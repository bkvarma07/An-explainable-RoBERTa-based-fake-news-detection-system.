/**
 * EmptyState.jsx
 * Displayed when no history exists or when search/filters return zero results.
 */
import { Link } from 'react-router-dom'
import { Inbox, SearchX, Zap, RotateCcw } from 'lucide-react'

export default function EmptyState({ isFiltered, onResetFilters }) {
  if (isFiltered) {
    return (
      <div className="rounded-2xl border border-white/10 p-12 text-center bg-navy-900/40 backdrop-blur-sm animate-fade-in">
        <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4 text-slate-400">
          <SearchX size={26} />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">No Matching Records Found</h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto mb-6">
          No previous analysis matches your current search query or active filter.
        </p>
        <button
          onClick={onResetFilters}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/15 text-xs font-semibold text-slate-200 hover:text-white hover:border-blue-500/40 hover:bg-white/5 transition-all"
        >
          <RotateCcw size={14} />
          Reset Filters &amp; Search
        </button>
      </div>
    )
  }

  return (
    <div className="rounded-2xl border border-white/10 p-12 sm:p-16 text-center bg-navy-900/40 backdrop-blur-sm animate-fade-in">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500/10 to-violet-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-blue-900/20">
        <Inbox size={30} className="text-blue-400" />
      </div>

      <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
        No Analysis History Yet
      </h3>

      <p className="text-sm text-slate-400 max-w-md mx-auto mb-8 leading-relaxed">
        Articles you evaluate with the fine-tuned RoBERTa model will automatically be
        archived here with their confidence scores and token counts.
      </p>

      <Link
        to="/analyze"
        className="btn-primary text-sm px-6 py-3 inline-flex items-center gap-2"
      >
        <Zap size={16} />
        Analyze Your First Article
      </Link>
    </div>
  )
}
