/**
 * HistoryFilters.jsx
 * Filter pills (All, Real, Fake), text search bar, sort toggle, and clear history action.
 */
import { Search, X, ArrowUpDown, Trash2 } from 'lucide-react'

export default function HistoryFilters({
  filter,
  onFilterChange,
  searchQuery,
  onSearchChange,
  sortOrder,
  onToggleSort,
  onOpenClearConfirm,
  totalCount,
  realCount,
  fakeCount,
  hasRecords,
}) {
  const filterTabs = [
    { id: 'ALL', label: 'All Articles', count: totalCount },
    { id: 'Real', label: 'Real News', count: realCount },
    { id: 'Fake', label: 'Fake News', count: fakeCount },
  ]

  return (
    <div className="flex flex-col gap-4 mb-6">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Search input */}
        <div className="relative flex-1 max-w-md">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search saved articles by content…"
            disabled={!hasRecords}
            className="w-full rounded-xl bg-navy-900/80 border border-white/10 pl-9 pr-9 py-2.5 text-sm text-slate-200 placeholder:text-slate-600 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/20 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-0.5 rounded transition-colors"
              aria-label="Clear search query"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Action Controls: Sort & Clear */}
        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          {/* Sort toggle */}
          <button
            onClick={onToggleSort}
            disabled={!hasRecords}
            className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-white/10 text-xs font-medium text-slate-300 hover:text-white hover:border-white/20 bg-white/[0.02] disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            title={`Sort order: ${sortOrder === 'newest' ? 'Newest first' : 'Oldest first'}`}
          >
            <ArrowUpDown size={13} className="text-blue-400" />
            <span>{sortOrder === 'newest' ? 'Newest first' : 'Oldest first'}</span>
          </button>

          {/* Clear history button */}
          {hasRecords && (
            <button
              onClick={onOpenClearConfirm}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-rose-500/20 text-xs font-medium text-rose-400/90 hover:text-rose-300 hover:bg-rose-500/10 hover:border-rose-500/40 transition-all"
              title="Clear all saved history"
            >
              <Trash2 size={13} />
              <span>Clear History</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {filterTabs.map((tab) => {
          const isActive = filter === tab.id
          return (
            <button
              key={tab.id}
              onClick={() => onFilterChange(tab.id)}
              className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                isActive
                  ? 'bg-blue-600/20 text-blue-300 border border-blue-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                  isActive ? 'bg-blue-500/30 text-blue-200' : 'bg-white/10 text-slate-400'
                }`}
              >
                {tab.count}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
