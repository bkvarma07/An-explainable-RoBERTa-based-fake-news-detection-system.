/**
 * useAnalyzer — custom hook
 * Owns all state and logic for the News Analyzer page.
 * The page components stay purely presentational.
 */
import { useState, useCallback } from 'react'
import { predictNews } from '../services/api'
import { savePredictionResult } from '../services/historyStorage'

const MIN_CHARS = 50       // Warn if too short
const MAX_CHARS = 10000    // Hard cap for textarea

export const STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
}

export function useAnalyzer() {
  const [text, setText] = useState('')
  const [status, setStatus] = useState(STATES.IDLE)
  const [result, setResult] = useState(null)   // API response object
  const [error, setError] = useState(null)     // Human-readable error string
  const [elapsedMs, setElapsedMs] = useState(null) // Frontend-measured request time

  const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length
  const charCount = text.length
  const isTooShort = charCount > 0 && charCount < MIN_CHARS

  const handleTextChange = useCallback((e) => {
    const val = e.target.value
    if (val.length <= MAX_CHARS) setText(val)
  }, [])

  const handleSubmit = useCallback(async () => {
    // Client-side guard
    if (!text.trim()) {
      setError('Please paste a news article before clicking Analyze.')
      setStatus(STATES.ERROR)
      return
    }
    if (text.trim().length < MIN_CHARS) {
      setError(`The article is too short (${charCount} characters). Please paste at least ${MIN_CHARS} characters for a meaningful analysis.`)
      setStatus(STATES.ERROR)
      return
    }

    setStatus(STATES.LOADING)
    setResult(null)
    setError(null)
    setElapsedMs(null)

    const t0 = performance.now()
    try {
      const data = await predictNews(text)
      const elapsed = performance.now() - t0
      setElapsedMs(elapsed)
      savePredictionResult(text, data)
      setResult(data)
      setStatus(STATES.SUCCESS)
    } catch (err) {
      let message = 'An unexpected error occurred. Please try again.'

      if (err.code === 'ECONNABORTED') {
        message = 'Request timed out. The model may still be loading — please wait a moment and try again.'
      } else if (err.response) {
        // HTTP error from FastAPI
        const status = err.response.status
        const detail = err.response.data?.detail
        if (status === 400) {
          message = detail ?? 'Invalid input. Please check your text and try again.'
        } else if (status === 500) {
          message = 'The model encountered an internal error. Please try again.'
        } else if (status === 0 || !err.response) {
          message = 'Could not reach the backend. Make sure the FastAPI server is running on port 8000.'
        } else {
          message = detail ?? `Server error (${status}). Please try again.`
        }
      } else if (err.request) {
        // Request made but no response received
        message = 'Could not reach the backend server. Make sure FastAPI is running: uvicorn main:app --reload'
      }

      setError(message)
      setStatus(STATES.ERROR)
    }
  }, [text, charCount])

  const handleReset = useCallback(() => {
    setText('')
    setStatus(STATES.IDLE)
    setResult(null)
    setError(null)
    setElapsedMs(null)
  }, [])

  const handleDismissError = useCallback(() => {
    setError(null)
    if (status === STATES.ERROR) setStatus(STATES.IDLE)
  }, [status])

  const handleSelectSample = useCallback((sampleText) => {
    setText(sampleText)
    setError(null)
    if (status === STATES.ERROR) setStatus(STATES.IDLE)
  }, [status])

  return {
    // State
    text,
    setText,
    status,
    result,
    error,
    elapsedMs,
    // Derived
    wordCount,
    charCount,
    maxChars: MAX_CHARS,
    isTooShort,
    isLoading: status === STATES.LOADING,
    isSuccess: status === STATES.SUCCESS,
    // Handlers
    handleTextChange,
    handleSelectSample,
    handleSubmit,
    handleReset,
    handleDismissError,
  }
}
