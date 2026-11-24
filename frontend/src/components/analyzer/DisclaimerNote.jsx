/**
 * DisclaimerNote — honest AI transparency notice.
 * Shown prominently before the user submits.
 */
import { Info } from 'lucide-react'

export default function DisclaimerNote() {
  return (
    <div
      className="flex gap-3 rounded-xl border border-blue-500/20 bg-blue-500/5 px-4 py-3.5"
      role="note"
      aria-label="Important disclaimer"
    >
      <Info size={16} className="text-blue-400 mt-0.5 flex-shrink-0" />
      <p className="text-xs text-slate-400 leading-relaxed">
        <span className="text-blue-300 font-semibold">What this tool does: </span>
        TruthLens classifies news text based on{' '}
        <strong className="text-slate-300 font-medium">
          learned linguistic and stylistic patterns
        </strong>{' '}
        from its training data. It does{' '}
        <strong className="text-slate-300 font-medium">not</strong> verify
        factual claims, check sources, or access the internet. A "Real" result
        means the text resembles authentic news writing — not that the content
        is factually accurate.
      </p>
    </div>
  )
}
