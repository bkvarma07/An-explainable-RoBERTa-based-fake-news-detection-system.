/**
 * historyStorage.js
 * Persistent localStorage service for prediction records.
 * Keeps up to MAX_RECORDS (50) newest items.
 * Safely handles corrupted or absent storage data.
 */

const STORAGE_KEY = 'truthlens_prediction_history'
const MAX_RECORDS = 50

/**
 * Safely parse JSON from localStorage with validation
 * @returns {Array<Object>}
 */
export function getStoredHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    
    // Ensure records match expected schema
    return parsed.filter((item) => (
      item &&
      typeof item === 'object' &&
      typeof item.id === 'string' &&
      (item.prediction === 'Real' || item.prediction === 'Fake') &&
      typeof item.real_probability === 'number' &&
      typeof item.fake_probability === 'number'
    ))
  } catch (err) {
    console.error('Failed to load prediction history from localStorage:', err)
    return []
  }
}

/**
 * Save a new successful prediction result to localStorage
 * @param {string} text - full article text
 * @param {Object} result - API response { prediction, fake_probability, real_probability, tokens_processed, max_tokens }
 * @returns {Object|null} the created record
 */
export function savePredictionResult(text, result) {
  if (!text || !result || !result.prediction) return null

  try {
    const current = getStoredHistory()
    
    // Generate unique ID
    const uniqueId = typeof crypto !== 'undefined' && crypto.randomUUID
      ? crypto.randomUUID()
      : `rec_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`

    const newRecord = {
      id: uniqueId,
      timestamp: new Date().toISOString(),
      text: text.trim(),
      preview: text.trim().slice(0, 160) + (text.trim().length > 160 ? '…' : ''),
      prediction: result.prediction,
      fake_probability: result.fake_probability,
      real_probability: result.real_probability,
      tokens_processed: result.tokens_processed ?? 0,
      max_tokens: result.max_tokens ?? 256,
    }

    // Keep newest first, limit to 50
    const updated = [newRecord, ...current].slice(0, MAX_RECORDS)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))

    // Notify listeners in same window
    window.dispatchEvent(new CustomEvent('truthlens:history_updated', { detail: updated }))

    return newRecord
  } catch (err) {
    console.error('Failed to save prediction record to localStorage:', err)
    return null
  }
}

/**
 * Delete a single record by ID
 * @param {string} id
 * @returns {Array<Object>} updated history
 */
export function deleteStoredRecord(id) {
  try {
    const current = getStoredHistory()
    const updated = current.filter((item) => item.id !== id)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
    window.dispatchEvent(new CustomEvent('truthlens:history_updated', { detail: updated }))
    return updated
  } catch (err) {
    console.error('Failed to delete history record:', err)
    return getStoredHistory()
  }
}

/**
 * Clear all prediction history
 */
export function clearStoredHistory() {
  try {
    localStorage.removeItem(STORAGE_KEY)
    window.dispatchEvent(new CustomEvent('truthlens:history_updated', { detail: [] }))
  } catch (err) {
    console.error('Failed to clear history from localStorage:', err)
  }
}

/**
 * Compute summary statistics from actual history
 * @param {Array<Object>} historyList
 * @returns {{ total: number, fakeCount: number, realCount: number, fakePercent: number, realPercent: number }}
 */
export function computeHistoryStats(historyList = []) {
  const total = historyList.length
  if (total === 0) {
    return {
      total: 0,
      fakeCount: 0,
      realCount: 0,
      fakePercent: 0,
      realPercent: 0,
    }
  }

  const fakeCount = historyList.filter((item) => item.prediction === 'Fake').length
  const realCount = historyList.filter((item) => item.prediction === 'Real').length
  const fakePercent = Math.round((fakeCount / total) * 100)
  const realPercent = Math.round((realCount / total) * 100)

  return {
    total,
    fakeCount,
    realCount,
    fakePercent,
    realPercent,
  }
}
