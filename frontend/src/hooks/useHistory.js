/**
 * useHistory — custom hook
 * Manages prediction history state, filtering, searching, sorting,
 * and synchronizing with localStorage across tabs and components.
 */
import { useState, useEffect, useMemo, useCallback } from 'react'
import {
  getStoredHistory,
  deleteStoredRecord,
  clearStoredHistory,
  computeHistoryStats,
} from '../services/historyStorage'

export function useHistory() {
  const [history, setHistory] = useState(() => getStoredHistory())
  const [filter, setFilter] = useState('ALL') // 'ALL' | 'Real' | 'Fake'
  const [searchQuery, setSearchQuery] = useState('')
  const [sortOrder, setSortOrder] = useState('newest') // 'newest' | 'oldest'
  const [selectedRecord, setSelectedRecord] = useState(null)

  // Listen for storage events (e.g. from Analyzer in same window or across browser tabs)
  useEffect(() => {
    const handleLocalUpdate = (e) => {
      if (e.detail) {
        setHistory(e.detail)
      } else {
        setHistory(getStoredHistory())
      }
    }

    const handleStorageEvent = (e) => {
      if (e.key === 'truthlens_prediction_history') {
        setHistory(getStoredHistory())
      }
    }

    window.addEventListener('truthlens:history_updated', handleLocalUpdate)
    window.addEventListener('storage', handleStorageEvent)

    return () => {
      window.removeEventListener('truthlens:history_updated', handleLocalUpdate)
      window.removeEventListener('storage', handleStorageEvent)
    }
  }, [])

  // Computed statistics from actual history
  const stats = useMemo(() => computeHistoryStats(history), [history])

  // Filter, search, and sort logic
  const filteredHistory = useMemo(() => {
    let result = [...history]

    // Filter by class (Real / Fake)
    if (filter === 'Real') {
      result = result.filter((item) => item.prediction === 'Real')
    } else if (filter === 'Fake') {
      result = result.filter((item) => item.prediction === 'Fake')
    }

    // Search query in article text
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim()
      result = result.filter((item) => item.text.toLowerCase().includes(q))
    }

    // Sort order
    result.sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime()
      const timeB = new Date(b.timestamp).getTime()
      return sortOrder === 'newest' ? timeB - timeA : timeA - timeB
    })

    return result
  }, [history, filter, searchQuery, sortOrder])

  const deleteRecord = useCallback((id) => {
    const updated = deleteStoredRecord(id)
    setHistory(updated)
    if (selectedRecord && selectedRecord.id === id) {
      setSelectedRecord(null)
    }
  }, [selectedRecord])

  const clearAll = useCallback(() => {
    clearStoredHistory()
    setHistory([])
    setSelectedRecord(null)
  }, [])

  return {
    history,
    filteredHistory,
    stats,
    filter,
    setFilter,
    searchQuery,
    setSearchQuery,
    sortOrder,
    setSortOrder,
    selectedRecord,
    setSelectedRecord,
    deleteRecord,
    clearAll,
  }
}
