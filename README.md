# TruthLens – Explainable Fake News Detection System

TruthLens is an AI-powered fake news detection system that uses a fine-tuned **RoBERTa transformer model** to classify news content as Real or Fake.

The project also integrates explainable AI techniques to help users understand which words in the input influenced the model's prediction.

## Features

- **Fake News Classification:** Predicts whether submitted news content is Real or Fake.
- **RoBERTa Model:** Uses a fine-tuned transformer model for text classification.
- **Explainable AI:** Uses Captum Integrated Gradients to highlight influential words.
- **Document Upload:** Supports uploading documents for text extraction and analysis.
- **Text Extraction:** Extracts text from supported PDF and DOCX files.
- **Web Interface:** React-based frontend for interacting with the detection system.
- **REST API:** FastAPI backend provides prediction and explanation endpoints.

## Tech Stack

| Component | Technology |
|---|---|
| Frontend | React, Vite, Tailwind CSS |
| Backend | Python, FastAPI |
| Machine Learning | PyTorch, Hugging Face Transformers |
| Model | Fine-tuned RoBERTa |
| Explainability | Captum Integrated Gradients |
| Document Processing | PyPDF, python-docx |

## Project Structure

```text
TruthLens/
├── Backend/
│   ├── main.py
│   ├── predictor.py
│   ├── extractor.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
└── .gitignore
```

## Machine Learning Model

The trained RoBERTa model is hosted separately on Hugging Face.

**Model Repository:**  
https://huggingface.co/bkvarma/truthlens-roberta

The backend downloads the model when it starts, so the model weights do not need to be included in this GitHub repository.

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/bkvarma07/An-explainable-RoBERTa-based-fake-news-detection-system..git
cd An-explainable-RoBERTa-based-fake-news-detection-system.
```

### 2. Set up the backend

```bash
cd Backend
python -m venv venv
```

Activate the virtual environment.

**Windows:**
```powershell
.\venv\Scripts\Activate.ps1
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the backend:

```bash
uvicorn main:app --reload --host 127.0.0.1 --port 8000
```

Backend API documentation:

http://127.0.0.1:8000/docs

### 3. Set up the frontend

Open another terminal from the project root:

```bash
cd frontend
npm install
npm run dev
```

Open the local frontend URL displayed in the terminal, usually:

http://localhost:5173

## How It Works

1. The user enters news text or uploads a supported document.
2. The frontend sends the content to the FastAPI backend.
3. The backend processes the text using the fine-tuned RoBERTa model.
4. The model generates a classification and prediction score.
5. Captum Integrated Gradients helps explain the words that influenced the prediction.
6. The frontend displays the result and explanation.

## Important Note

TruthLens is an experimental machine learning project. Its predictions are based on patterns learned during training and should not be treated as definitive proof that a news article is true or false. Always verify important information using reliable sources.

## Future Improvements

- Deploy the frontend and backend for public access.
- Improve model performance and evaluation.
- Enhance explainability and user experience.
- Add more document formats and analysis capabilities.

## Author

**Kalyan (bkvarma07)**

GitHub: https://github.com/bkvarma07
