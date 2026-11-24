"""
extractor.py
Safe in-memory text extraction for news article files (PDF, DOCX, TXT).
Adheres strictly to TruthLens requirements:
- In-memory processing via io.BytesIO (no permanent file storage)
- Extension and MIME validation
- 10 MB file size limit
- Empty file and empty text rejection
- Meaningful error reporting
"""
import io
import os
from typing import Tuple, Optional
import pypdf
import docx

MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB

SUPPORTED_EXTENSIONS = {
    ".pdf": "PDF",
    ".docx": "DOCX",
    ".txt": "TXT"
}

ALLOWED_MIME_TYPES = {
    ".pdf": {"application/pdf", "application/x-pdf", "binary/octet-stream", "application/octet-stream"},
    ".docx": {
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "application/msword",
        "application/zip",
        "application/x-zip-compressed",
        "application/octet-stream",
        "binary/octet-stream"
    },
    ".txt": {"text/plain", "text/csv", "text/tab-separated-values", "application/octet-stream", "binary/octet-stream"}
}


def extract_text_from_file(
    file_bytes: bytes,
    filename: str,
    content_type: Optional[str] = None
) -> Tuple[str, str]:
    """
    Extracts plain text from raw file bytes in-memory.

    Parameters:
        file_bytes: raw bytes of the uploaded file
        filename: original filename provided by the client
        content_type: MIME type reported by the client

    Returns:
        Tuple of (extracted_text: str, file_type: str)

    Raises:
        ValueError with human-readable error message on validation or extraction failure.
    """
    # 1. Size checks
    if not file_bytes or len(file_bytes) == 0:
        raise ValueError("The uploaded file is empty (0 bytes). Please upload a file containing article text.")

    if len(file_bytes) > MAX_FILE_SIZE_BYTES:
        size_mb = len(file_bytes) / (1024 * 1024)
        raise ValueError(f"File size exceeds the 10 MB limit ({size_mb:.2f} MB uploaded). Please upload a smaller file.")

    # 2. Extension validation
    clean_name = os.path.basename(filename or "uploaded_file")
    ext = os.path.splitext(clean_name)[1].lower()

    if ext not in SUPPORTED_EXTENSIONS:
        supported_list = ", ".join(SUPPORTED_EXTENSIONS.keys())
        raise ValueError(
            f"Unsupported file format '{ext or 'unknown'}'. TruthLens accepts PDF ({supported_list}) files."
        )

    file_type = SUPPORTED_EXTENSIONS[ext]

    # 3. MIME type sanity check (loose validation to avoid blocking unusual OS MIME mappings)
    if content_type:
        normalized_mime = content_type.lower().split(";")[0].strip()
        allowed_mimes = ALLOWED_MIME_TYPES.get(ext, set())
        # If the mime type is not recognized at all and doesn't match allowed, warn/check
        if allowed_mimes and normalized_mime not in allowed_mimes and not normalized_mime.startswith("text/"):
            # If the mime clearly contradicts the extension (e.g. image/jpeg with a .pdf extension)
            if normalized_mime.startswith(("image/", "video/", "audio/", "application/x-executable", "application/x-msdownload")):
                raise ValueError(
                    f"File MIME type '{normalized_mime}' does not match the '{ext}' extension. Please upload a genuine {file_type} file."
                )

    # 4. Text Extraction per Format
    extracted_text = ""

    try:
        if ext == ".pdf":
            extracted_text = _extract_from_pdf(file_bytes)
        elif ext == ".docx":
            extracted_text = _extract_from_docx(file_bytes)
        elif ext == ".txt":
            extracted_text = _extract_from_txt(file_bytes)
    except ValueError:
        raise
    except Exception as e:
        raise ValueError(f"Failed to extract text from {file_type} file '{clean_name}': {str(e)}")

    # 5. Non-empty extraction check
    cleaned_text = extracted_text.strip()
    if not cleaned_text:
        raise ValueError(
            f"No readable text could be extracted from '{clean_name}'. "
            "Please ensure the file contains text content (scanned image PDFs without selectable text are not supported)."
        )

    if len(cleaned_text) < 20:
        raise ValueError(
            f"The extracted text from '{clean_name}' is too short ({len(cleaned_text)} characters) "
            "for reliable fake news analysis. Please upload an article with more content."
        )

    return cleaned_text, file_type


def _extract_from_pdf(file_bytes: bytes) -> str:
    """Extracts text from PDF bytes using pypdf."""
    stream = io.BytesIO(file_bytes)
    try:
        reader = pypdf.PdfReader(stream)
    except Exception as e:
        raise ValueError(f"Unable to parse PDF file. The file may be corrupted or invalid: {str(e)}")

    if reader.is_encrypted:
        try:
            # Try blank password decryption
            decrypted = reader.decrypt("")
            if decrypted == 0:
                raise ValueError("This PDF is password-protected. Please upload an unencrypted document.")
        except Exception:
            raise ValueError("This PDF is password-protected. Please upload an unencrypted document.")

    if len(reader.pages) == 0:
        raise ValueError("PDF document contains no pages.")

    pages_text = []
    for i, page in enumerate(reader.pages):
        try:
            page_text = page.extract_text()
            if page_text and page_text.strip():
                pages_text.append(page_text.strip())
        except Exception as e:
            # Continue extracting remaining pages if one page fails
            continue

    return "\n\n".join(pages_text)


def _extract_from_docx(file_bytes: bytes) -> str:
    """Extracts text from DOCX bytes using python-docx."""
    stream = io.BytesIO(file_bytes)
    try:
        doc = docx.Document(stream)
    except Exception as e:
        raise ValueError(f"Unable to parse Word document. The file may be corrupted or not a valid .docx file: {str(e)}")

    paragraphs = []
    for p in doc.paragraphs:
        txt = p.text.strip()
        if txt:
            paragraphs.append(txt)

    # Also capture table text if present
    for table in doc.tables:
        for row in table.rows:
            row_texts = [cell.text.strip() for cell in row.cells if cell.text.strip()]
            if row_texts:
                paragraphs.append(" | ".join(row_texts))

    return "\n\n".join(paragraphs)


def _extract_from_txt(file_bytes: bytes) -> str:
    """Extracts text from TXT bytes using multi-encoding fallback."""
    encodings = ["utf-8", "utf-8-sig", "cp1252", "latin-1", "iso-8859-1"]
    for enc in encodings:
        try:
            return file_bytes.decode(enc)
        except (UnicodeDecodeError, LookupError):
            continue

    # Final fallback with replace
    return file_bytes.decode("utf-8", errors="replace")
