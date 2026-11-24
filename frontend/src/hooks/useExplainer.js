/**
 * useExplainer — custom hook
 * Manages state and execution for token-level explainability requests (POST /api/explain).
 *
 * Features:
 * - Measures frontend elapsed time for each /explain request (performance.now()).
 * - Guards against duplicate simultaneous requests (isLoading check).
 * - Timeout set to 180 s in api.js — sufficient for Captum IG on CPU.
 * - Improved timeout/error messages.
 */
import { useState, useCallback, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { explainNews } from '../services/api'

const MIN_CHARS = 30
const MAX_CHARS = 10000

export const EXPLAIN_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
}

export function useExplainer() {
  const location = useLocation()
  const initialText = location.state?.text || ''

  const [text, setText] = useState(initialText)
  const [status, setStatus] = useState(EXPLAIN_STATES.IDLE)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [elapsedMs, setElapsedMs] = useState(null) // Frontend-measured request time

  // Guard: prevent duplicate simultaneous requests
  const requestInFlight = useRef(false)

  // Update text if location state changes (e.g. navigated from Results page)
  useEffect(() => {
    if (location.state?.text && location.state.text !== text) {
      setText(location.state.text)
    }
  }, [location.state])

  const wordCount = text.trim() === '' ? 0 : text.trim().split(/\s+/).length
  const charCount = text.length
  const isTooShort = charCount > 0 && charCount < MIN_CHARS

  const handleTextChange = useCallback((e) => {
    const val = e.target.value
    if (val.length <= MAX_CHARS) setText(val)
  }, [])

  const handleSubmit = useCallback(async () => {
    if (!text.trim()) {
      setError('Please enter or paste a news article to generate an explanation.')
      setStatus(EXPLAIN_STATES.ERROR)
      return
    }
    if (text.trim().length < MIN_CHARS) {
      setError(`Article is too short (${charCount} characters). Please provide at least ${MIN_CHARS} characters for token attribution analysis.`)
      setStatus(EXPLAIN_STATES.ERROR)
      return
    }

    // Prevent duplicate simultaneous requests
    if (requestInFlight.current) return

    requestInFlight.current = true
    setStatus(EXPLAIN_STATES.LOADING)
    setError(null)
    setResult(null)
    setElapsedMs(null)

    const t0 = performance.now()
    try {
      const data = await explainNews(text)
      const elapsed = performance.now() - t0
      setElapsedMs(elapsed)
      setResult(data)
      setStatus(EXPLAIN_STATES.SUCCESS)
    } catch (err) {
      const elapsed = performance.now() - t0
      setElapsedMs(elapsed)

      let message = 'Failed to generate explanation. Please try again.'

      if (err.code === 'ECONNABORTED') {
        message =
          'The request timed out after 180 seconds. Captum Integrated Gradients requires 128 × 16 forward passes on CPU — longer articles take more time. Try a shorter article, or ensure the backend is running on GPU.'
      } else if (err.response) {
        const statusCode = err.response.status
        const detail = err.response.data?.detail
        if (statusCode === 503) {
          message = detail || 'Captum library is not installed on the backend. Run: pip install captum'
        } else if (statusCode === 400) {
          message = detail || 'Invalid input text.'
        } else if (statusCode === 500) {
          message = detail || 'The model encountered an internal error during attribution computation.'
        } else {
          message = detail || `Server error (${statusCode}).`
        }
      } else if (err.request) {
        message = 'Could not connect to the backend server. Make sure FastAPI is running on port 8000.'
      }

      setError(message)
      setStatus(EXPLAIN_STATES.ERROR)
    } finally {
      requestInFlight.current = false
    }
  }, [text, charCount])

  const handleReset = useCallback(() => {
    setText('')
    setStatus(EXPLAIN_STATES.IDLE)
    setResult(null)
    setError(null)
    setElapsedMs(null)
  }, [])

  const handleDismissError = useCallback(() => {
    setError(null)
    if (status === EXPLAIN_STATES.ERROR) setStatus(EXPLAIN_STATES.IDLE)
  }, [status])

  return {
    text,
    status,
    result,
    error,
    elapsedMs,
    wordCount,
    charCount,
    maxChars: MAX_CHARS,
    isTooShort,
    isLoading: status === EXPLAIN_STATES.LOADING,
    isSuccess: status === EXPLAIN_STATES.SUCCESS,
    handleTextChange,
    handleSubmit,
    handleReset,
    handleDismissError,
    setText,
  }
}
