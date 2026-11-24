/**
 * useFileUpload — custom hook
 * Owns all state and logic for the file upload flow on the Analyzer page.
 * Handles file selection, validation, upload progress, prediction, and history saving.
 */
import { useState, useCallback, useRef } from 'react'
import { uploadAndPredictNews } from '../services/api'
import { savePredictionResult } from '../services/historyStorage'

const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10 MB
const ALLOWED_EXTENSIONS = ['.pdf', '.docx', '.txt']
const ALLOWED_MIME_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
]

export const UPLOAD_STATES = {
  IDLE: 'idle',
  FILE_SELECTED: 'file_selected',
  UPLOADING: 'uploading',
  SUCCESS: 'success',
  ERROR: 'error',
}

/**
 * Map file extension to a human-readable type badge
 */
function getFileTypeBadge(filename) {
  const ext = filename.toLowerCase().split('.').pop()
  const map = { pdf: 'PDF', docx: 'DOCX', txt: 'TXT' }
  return map[ext] ?? ext.toUpperCase()
}

/**
 * Format bytes into human-readable size
 */
export function formatFileSize(bytes) {
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  return `${(bytes / Math.pow(1024, i)).toFixed(i === 0 ? 0 : 1)} ${units[i]}`
}

/**
 * Validate a file on the client side before uploading
 * @returns {{ valid: boolean, error?: string }}
 */
function validateFile(file) {
  if (!file) return { valid: false, error: 'No file selected.' }

  // Extension check
  const ext = '.' + file.name.toLowerCase().split('.').pop()
  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return {
      valid: false,
      error: `Unsupported file type "${ext}". Supported formats: PDF, DOCX, TXT.`,
    }
  }

  // Size check
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File too large (${formatFileSize(file.size)}). Maximum allowed size is 10 MB.`,
    }
  }

  // Empty file check
  if (file.size === 0) {
    return { valid: false, error: 'The selected file is empty.' }
  }

  return { valid: true }
}

export function useFileUpload() {
  const [file, setFile] = useState(null)           // Selected File object
  const [status, setStatus] = useState(UPLOAD_STATES.IDLE)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [result, setResult] = useState(null)        // Full API response
  const [extractedText, setExtractedText] = useState('')  // Extracted article text
  const [error, setError] = useState(null)
  const [elapsedMs, setElapsedMs] = useState(null)
  const [fileInfo, setFileInfo] = useState(null)    // { name, size, type badge }

  // Prevent duplicate submissions
  const isSubmitting = useRef(false)

  /**
   * Select and validate a file (from input or drag-and-drop)
   */
  const handleFileSelect = useCallback((selectedFile) => {
    // Reset any previous state
    setResult(null)
    setExtractedText('')
    setElapsedMs(null)
    setUploadProgress(0)

    const validation = validateFile(selectedFile)
    if (!validation.valid) {
      setError(validation.error)
      setStatus(UPLOAD_STATES.ERROR)
      setFile(null)
      setFileInfo(null)
      return
    }

    setFile(selectedFile)
    setFileInfo({
      name: selectedFile.name,
      size: selectedFile.size,
      formattedSize: formatFileSize(selectedFile.size),
      typeBadge: getFileTypeBadge(selectedFile.name),
    })
    setError(null)
    setStatus(UPLOAD_STATES.FILE_SELECTED)
  }, [])

  /**
   * Handle file drop from drag-and-drop
   */
  const handleFileDrop = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()

    const droppedFiles = e.dataTransfer?.files
    if (droppedFiles && droppedFiles.length > 0) {
      handleFileSelect(droppedFiles[0])
    }
  }, [handleFileSelect])

  /**
   * Upload file and run prediction
   */
  const handleUploadAndPredict = useCallback(async () => {
    if (!file || isSubmitting.current) return

    isSubmitting.current = true
    setStatus(UPLOAD_STATES.UPLOADING)
    setResult(null)
    setExtractedText('')
    setError(null)
    setElapsedMs(null)
    setUploadProgress(0)

    const t0 = performance.now()
    try {
      const data = await uploadAndPredictNews(file, (progress) => {
        setUploadProgress(progress)
      })

      const elapsed = performance.now() - t0
      setElapsedMs(elapsed)
      setResult(data)
      setExtractedText(data.extracted_text || '')

      // Save to history — use the extracted text as the article text
      savePredictionResult(data.extracted_text || file.name, data)

      setStatus(UPLOAD_STATES.SUCCESS)
    } catch (err) {
      let message = 'An unexpected error occurred during file upload. Please try again.'

      if (err.code === 'ECONNABORTED') {
        message = 'Upload timed out. The file may be too large or the server may be busy — please try again.'
      } else if (err.response) {
        const httpStatus = err.response.status
        const detail = err.response.data?.detail
        if (httpStatus === 400) {
          message = detail ?? 'Invalid file. Please check the file format and try again.'
        } else if (httpStatus === 413) {
          message = 'File too large. Maximum allowed size is 10 MB.'
        } else if (httpStatus === 500) {
          message = 'The server encountered an error processing the file. Please try again.'
        } else {
          message = detail ?? `Server error (${httpStatus}). Please try again.`
        }
      } else if (err.request) {
        message = 'Could not reach the backend server. Make sure FastAPI is running: uvicorn main:app --reload'
      }

      setError(message)
      setStatus(UPLOAD_STATES.ERROR)
    } finally {
      isSubmitting.current = false
    }
  }, [file])

  /**
   * Remove the selected file and reset to idle
   */
  const handleRemoveFile = useCallback(() => {
    setFile(null)
    setFileInfo(null)
    setError(null)
    setUploadProgress(0)
    setStatus(UPLOAD_STATES.IDLE)
  }, [])

  /**
   * Full reset — clear everything
   */
  const handleReset = useCallback(() => {
    setFile(null)
    setFileInfo(null)
    setStatus(UPLOAD_STATES.IDLE)
    setResult(null)
    setExtractedText('')
    setError(null)
    setElapsedMs(null)
    setUploadProgress(0)
    isSubmitting.current = false
  }, [])

  /**
   * Dismiss error without resetting file selection
   */
  const handleDismissError = useCallback(() => {
    setError(null)
    if (file) {
      setStatus(UPLOAD_STATES.FILE_SELECTED)
    } else {
      setStatus(UPLOAD_STATES.IDLE)
    }
  }, [file])

  return {
    // State
    file,
    fileInfo,
    status,
    uploadProgress,
    result,
    extractedText,
    error,
    elapsedMs,
    // Derived
    isUploading: status === UPLOAD_STATES.UPLOADING,
    isSuccess: status === UPLOAD_STATES.SUCCESS,
    hasFile: status === UPLOAD_STATES.FILE_SELECTED,
    // Handlers
    handleFileSelect,
    handleFileDrop,
    handleUploadAndPredict,
    handleRemoveFile,
    handleReset,
    handleDismissError,
  }
}
