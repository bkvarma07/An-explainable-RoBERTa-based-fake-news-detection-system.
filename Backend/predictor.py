
import os
from typing import Optional, List, Dict, Any
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification

# Safe import for Captum
try:
    from captum.attr import LayerIntegratedGradients
    CAPTUM_AVAILABLE = True
except ImportError:
    CAPTUM_AVAILABLE = False


# Hugging Face model configuration
MODEL_ID = os.getenv(
    "MODEL_ID",
    "bkvarma/truthlens-roberta"
)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# Load tokenizer from Hugging Face
tokenizer = AutoTokenizer.from_pretrained(MODEL_ID)

# Load trained RoBERTa model from Hugging Face
model = AutoModelForSequenceClassification.from_pretrained(
    MODEL_ID
).to(device)

model.eval()


def predict_news(news_text):
    if not isinstance(news_text, str) or not news_text.strip():
        raise ValueError("Please enter a valid news article.")

    inputs = tokenizer(
        news_text,
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=256
    )

    token_count = inputs["attention_mask"].sum().item()

    inputs = {
        key: value.to(device)
        for key, value in inputs.items()
    }

    with torch.no_grad():
        outputs = model(**inputs)
        probabilities = torch.softmax(outputs.logits, dim=1)[0]

    predicted_class = torch.argmax(probabilities).item()

    return {
        "prediction": "Fake" if predicted_class == 0 else "Real",
        "fake_probability": round(probabilities[0].item() * 100, 2),
        "real_probability": round(probabilities[1].item() * 100, 2),
        "tokens_processed": token_count,
        "max_tokens": 256,
        "device": str(device).upper()
    }


def explain_news(news_text: str) -> Dict[str, Any]:
    """
    Computes token-level attribution scores using Captum's LayerIntegratedGradients
    targeting model.roberta.embeddings for the model's predicted class.
    """
    if not isinstance(news_text, str) or not news_text.strip():
        raise ValueError("Please enter a valid news article.")

    if not CAPTUM_AVAILABLE:
        raise RuntimeError(
            "Captum library is not installed in the environment. "
            "Please install it using: pip install captum"
        )

    # Tokenize with offset mapping to preserve alignment with original text
    try:
        inputs = tokenizer(
            news_text,
            return_tensors="pt",
            truncation=True,
            padding=True,
            max_length=256,
            return_offsets_mapping=True
        )
        offset_mapping = inputs.pop("offset_mapping", None)
    except Exception:
        inputs = tokenizer(
            news_text,
            return_tensors="pt",
            truncation=True,
            padding=True,
            max_length=256
        )
        offset_mapping = None

    token_count = int(inputs["attention_mask"].sum().item())

    input_ids = inputs["input_ids"].to(device)
    attention_mask = inputs["attention_mask"].to(device)

    model.eval()

    # Step 1: Forward pass to obtain class prediction and probabilities
    with torch.no_grad():
        outputs = model(input_ids=input_ids, attention_mask=attention_mask)
        probabilities = torch.softmax(outputs.logits, dim=1)[0]
        predicted_class = int(torch.argmax(probabilities).item())

    # Step 2: Define forward function returning logits
    def forward_func(inp_ids, att_mask=None):
        if att_mask is not None:
            out = model(input_ids=inp_ids, attention_mask=att_mask)
        else:
            out = model(input_ids=inp_ids)
        return out.logits

    # Step 3: Initialize LayerIntegratedGradients
    lig = LayerIntegratedGradients(forward_func, model.roberta.embeddings)

    # Step 4: Compute attributions for the predicted class
    attributions, delta = lig.attribute(
        inputs=input_ids,
        additional_forward_args=(attention_mask,),
        target=predicted_class,
        n_steps=128,
        internal_batch_size=16,
        return_convergence_delta=True
    )

    # Step 5: Sum attribution values across the embedding dimension
    token_attributions = attributions.sum(dim=-1).squeeze(0).detach().cpu()

    convergence_delta = 0.0
    if delta is not None:
        delta_cpu = delta.detach().cpu()
        if delta_cpu.numel() > 0:
            convergence_delta = round(float(delta_cpu[0].item()), 6)

    # Parse offsets safely
    offsets = None
    if offset_mapping is not None:
        if isinstance(offset_mapping, torch.Tensor):
            offsets = offset_mapping[0].tolist()
        else:
            offsets = offset_mapping[0]

    # Step 6: Construct token list excluding special tokens and padding
    tokens_list = []
    input_ids_list = input_ids[0].tolist()
    attention_mask_list = attention_mask[0].tolist()
    special_ids = set(tokenizer.all_special_ids)

    for i, (tok_id, mask_val) in enumerate(zip(input_ids_list, attention_mask_list)):
        if mask_val == 0:
            continue

        if tok_id in special_ids:
            continue

        raw_token = tokenizer.convert_ids_to_tokens(tok_id)
        token_display = raw_token.replace("Ġ", "") if raw_token.startswith("Ġ") else raw_token

        if not token_display:
            token_display = raw_token

        start_offset = None
        end_offset = None

        if offsets is not None and i < len(offsets):
            s, e = offsets[i]
            if isinstance(s, int) and isinstance(e, int):
                start_offset = s
                end_offset = e

        score = float(token_attributions[i].item())

        tokens_list.append({
            "token": token_display,
            "start_offset": start_offset,
            "end_offset": end_offset,
            "attribution_score": round(score, 6)
        })

    return {
        "prediction": "Fake" if predicted_class == 0 else "Real",
        "fake_probability": round(probabilities[0].item() * 100, 2),
        "real_probability": round(probabilities[1].item() * 100, 2),
        "predicted_class": predicted_class,
        "tokens_processed": token_count,
        "max_tokens": 256,
        "convergence_delta": convergence_delta,
        "tokens": tokens_list,
        "device": str(device).upper()
    }
