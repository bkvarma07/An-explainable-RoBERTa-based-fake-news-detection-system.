/**
 * ClearConfirmModal.jsx
 * Confirmation dialog before wiping all prediction history from localStorage.
 */
import { useEffect } from 'react'
import { AlertTriangle, Trash2, X } from 'lucide-react'

export default function ClearConfirmModal({ isOpen, onConfirm, onCancel }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onCancel()
    }
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown)
    }
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onCancel])

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="clear-modal-title"
    >
      <div className="relative w-full max-w-md rounded-2xl border border-rose-500/30 bg-navy-900 p-6 shadow-2xl shadow-rose-950/50 animate-slide-up">
        <button
          onClick={onCancel}
          className="absolute right-4 top-4 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          aria-label="Close"
        >
          <X size={16} />
        </button>

        <div className="flex items-center gap-3.5 mb-4">
          <div className="w-11 h-11 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 flex-shrink-0">
            <AlertTriangle size={22} />
          </div>
          <div>
            <h3 id="clear-modal-title" className="text-base font-bold text-white">
              Clear Analysis History?
            </h3>
            <p className="text-xs text-slate-400">This action cannot be undone</p>
          </div>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed mb-6">
          Are you sure you want to permanently delete all saved article predictions
          from your local browser storage? Your summary statistics will also reset to zero.
        </p>

        <div className="flex items-center justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2.5 rounded-xl border border-white/10 text-xs font-semibold text-slate-300 hover:text-white hover:bg-white/5 transition-all"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-xs font-semibold text-white shadow-lg shadow-rose-900/30 transition-all"
          >
            <Trash2 size={13} />
            Yes, Clear All
          </button>
        </div>
      </div>
    </div>
  )
}
