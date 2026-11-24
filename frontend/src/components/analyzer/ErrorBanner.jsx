/**
 * ErrorBanner — dismissible inline error display.
 */
import { AlertTriangle, X } from 'lucide-react'

export default function ErrorBanner({ message, onDismiss }) {
  if (!message) return null

  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3.5 animate-fade-in"
    >
      <AlertTriangle size={17} className="text-red-400 mt-0.5 flex-shrink-0" />
      <p className="text-sm text-red-300 leading-relaxed flex-1">{message}</p>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="text-red-400/60 hover:text-red-300 transition-colors flex-shrink-0 p-0.5 rounded"
          aria-label="Dismiss error"
        >
          <X size={15} />
        </button>
      )}
    </div>
  )
}
