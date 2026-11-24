from typing import List, Optional
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from predictor import predict_news, explain_news, CAPTUM_AVAILABLE, device
from extractor import extract_text_from_file, MAX_FILE_SIZE_BYTES

app = FastAPI(
    title="TruthLens Fake News Detection API",
    description="Explainable RoBERTa-based Fake News Classification API with Document Upload & Captum Integrated Gradients",
    version="1.2.0"
)

# Enable CORS for frontend clients and development tools
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class NewsRequest(BaseModel):
    text: str = Field(..., description="Full text of the news article to analyze")


class TokenAttribution(BaseModel):
    token: str = Field(..., description="Token text string")
    start_offset: Optional[int] = Field(None, description="Start character offset in original text")
    end_offset: Optional[int] = Field(None, description="End character offset in original text")
    attribution_score: float = Field(..., description="Integrated gradients attribution score")


class ExplainResponse(BaseModel):
    prediction: str = Field(..., description="Predicted class label ('Fake' or 'Real')")
    fake_probability: float = Field(..., description="Softmax confidence score for Fake class (0-100)")
    real_probability: float = Field(..., description="Softmax confidence score for Real class (0-100)")
    predicted_class: int = Field(..., description="Predicted class index (0 for Fake, 1 for Real)")
    tokens_processed: int = Field(..., description="Number of tokens processed by the tokenizer")
    max_tokens: int = Field(256, description="Maximum sequence length")
    convergence_delta: float = Field(..., description="Captum approximation error delta")
    device: Optional[str] = Field("CPU", description="Inference device (CPU or CUDA)")
    tokens: List[TokenAttribution] = Field(..., description="List of non-special tokens with attributions and character offsets")


class FilePredictionResponse(BaseModel):
    filename: str = Field(..., description="Original name of the uploaded file")
    file_type: str = Field(..., description="Detected file format (PDF, DOCX, TXT)")
    file_size_bytes: int = Field(..., description="File size in bytes")
    extracted_text: str = Field(..., description="Extracted plain text of the article")
    word_count: int = Field(..., description="Word count of extracted text")
    char_count: int = Field(..., description="Character count of extracted text")
    prediction: str = Field(..., description="Predicted class label ('Fake' or 'Real')")
    fake_probability: float = Field(..., description="Softmax prediction score for Fake class (0-100)")
    real_probability: float = Field(..., description="Softmax prediction score for Real class (0-100)")
    tokens_processed: int = Field(..., description="Number of tokens processed by the tokenizer")
    max_tokens: int = Field(256, description="Maximum sequence length")
    device: Optional[str] = Field("CPU", description="Inference device")


class ExtractTextResponse(BaseModel):
    filename: str = Field(..., description="Original name of the uploaded file")
    file_type: str = Field(..., description="Detected file format (PDF, DOCX, TXT)")
    file_size_bytes: int = Field(..., description="File size in bytes")
    extracted_text: str = Field(..., description="Extracted plain text of the article")
    word_count: int = Field(..., description="Word count of extracted text")
    char_count: int = Field(..., description="Character count of extracted text")


@app.get("/")
def home():
    return {
        "message": "TruthLens Fake News Detection API is running!",
        "version": "1.2.0",
        "endpoints": ["/predict", "/explain", "/upload", "/extract-text", "/health"]
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "model": "RoBERTa",
        "model_loaded": True,
        "captum_available": CAPTUM_AVAILABLE,
        "device": str(device).upper()
    }


@app.post("/predict")
def predict(request: NewsRequest):
    try:
        result = predict_news(request.text)
        return result
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )


@app.post("/upload", response_model=FilePredictionResponse)
async def upload_and_predict(file: UploadFile = File(...)):
    """
    Accepts an uploaded article file (.pdf, .docx, or .txt up to 10 MB),
    extracts the text safely in-memory, and runs RoBERTa fake news prediction.
    """
    try:
        # Read file bytes in memory with size cap protection
        contents = await file.read(MAX_FILE_SIZE_BYTES + 1024)
        if len(contents) > MAX_FILE_SIZE_BYTES:
            raise ValueError(f"File size exceeds the 10 MB limit. Please upload a smaller file.")

        extracted_text, file_type = extract_text_from_file(
            file_bytes=contents,
            filename=file.filename or "uploaded_article",
            content_type=file.content_type
        )

        # Run prediction through existing RoBERTa classifier
        pred_result = predict_news(extracted_text)

        word_count = len(extracted_text.split())
        char_count = len(extracted_text)

        return {
            "filename": file.filename or "uploaded_article",
            "file_type": file_type,
            "file_size_bytes": len(contents),
            "extracted_text": extracted_text,
            "word_count": word_count,
            "char_count": char_count,
            "prediction": pred_result["prediction"],
            "fake_probability": pred_result["fake_probability"],
            "real_probability": pred_result["real_probability"],
            "tokens_processed": pred_result["tokens_processed"],
            "max_tokens": pred_result["max_tokens"],
            "device": pred_result.get("device", "CPU")
        }
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"File processing failed: {str(e)}"
        )


@app.post("/extract-text", response_model=ExtractTextResponse)
async def extract_text_only(file: UploadFile = File(...)):
    """
    Extracts text from an uploaded article file (.pdf, .docx, or .txt) without running prediction.
    Useful for previewing or loading extracted text into the manual editor.
    """
    try:
        contents = await file.read(MAX_FILE_SIZE_BYTES + 1024)
        if len(contents) > MAX_FILE_SIZE_BYTES:
            raise ValueError("File size exceeds the 10 MB limit. Please upload a smaller file.")

        extracted_text, file_type = extract_text_from_file(
            file_bytes=contents,
            filename=file.filename or "uploaded_article",
            content_type=file.content_type
        )

        return {
            "filename": file.filename or "uploaded_article",
            "file_type": file_type,
            "file_size_bytes": len(contents),
            "extracted_text": extracted_text,
            "word_count": len(extracted_text.split()),
            "char_count": len(extracted_text)
        }
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Text extraction failed: {str(e)}"
        )


@app.post("/explain", response_model=ExplainResponse)
def explain(request: NewsRequest):
    try:
        result = explain_news(request.text)
        return result
    except ValueError as e:
        raise HTTPException(
            status_code=400,
            detail=str(e)
        )
    except RuntimeError as e:
        # Raised if Captum is missing
        raise HTTPException(
            status_code=503,
            detail=str(e)
        )
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Explanation failed: {str(e)}"
        )
