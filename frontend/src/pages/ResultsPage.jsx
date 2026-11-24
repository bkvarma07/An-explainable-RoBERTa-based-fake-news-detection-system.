/**
 * ResultsPage.jsx — /results
 * Complete Results Dashboard for TruthLens Fake News Detection.
 * Displays summary cards, filter tabs, search, sorting, and persistent prediction history.
 */
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { LayoutDashboard, Zap, ShieldAlert } from 'lucide-react'
import { useHistory } from '../hooks/useHistory'
import SectionLabel from '../components/ui/SectionLabel'
import GradientOrbs from '../components/ui/GradientOrbs'
import SummaryStats from '../components/results/SummaryStats'
import HistoryFilters from '../components/results/HistoryFilters'
import HistoryTable from '../components/results/HistoryTable'
import ResultDetailModal from '../components/results/ResultDetailModal'
import ClearConfirmModal from '../components/results/ClearConfirmModal'
import EmptyState from '../components/results/EmptyState'

export default function ResultsPage() {
  const {
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
  } = useHistory()

  const [isClearModalOpen, setIsClearModalOpen] = useState(false)

  const hasRecords = history.length > 0
  const isFiltered = Boolean(filter !== 'ALL' || searchQuery.trim())

  const handleToggleSort = () => {
    setSortOrder((prev) => (prev === 'newest' ? 'oldest' : 'newest'))
  }

  const handleResetFilters = () => {
    setFilter('ALL')
    setSearchQuery('')
  }

  const handleConfirmClear = () => {
    clearAll()
    setIsClearModalOpen(false)
  }

  return (
    <div className="relative min-h-screen pt-28 pb-24 overflow-hidden">
      {/* Background Orbs */}
      <GradientOrbs />

      {/* Grid Pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ── Page Header ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <SectionLabel className="mb-3">
              <LayoutDashboard size={12} />
              Analytics &amp; History
            </SectionLabel>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Results <span className="gradient-text">Dashboard</span>
            </h1>

            <p className="text-slate-400 text-sm sm:text-base mt-2 max-w-xl leading-relaxed">
              Review historical classifications performed by the fine-tuned RoBERTa model.
              All records and summary metrics are dynamically computed from your session history.
            </p>
          </div>

          {/* Quick CTA */}
          <Link
            to="/analyze"
            className="btn-primary text-xs sm:text-sm px-5 py-2.5 self-start md:self-auto inline-flex items-center gap-2 shadow-lg shadow-blue-900/30"
          >
            <Zap size={15} />
            Analyze New Article
          </Link>
        </div>

        {/* ── Model Prediction Score Disclaimer Ribbon ── */}
        <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 px-4 py-3 mb-8 flex items-start sm:items-center gap-3">
          <ShieldAlert size={16} className="text-blue-400 mt-0.5 sm:mt-0 flex-shrink-0" />
          <p className="text-xs text-slate-400 leading-relaxed">
            <span className="text-blue-300 font-semibold">Model Prediction Scores: </span>
            These scores represent the model's classification output. They are not verified probabilities that the news article is factually true. TruthLens is a research prototype and does not independently fact-check claims.
          </p>
        </div>

        {/* ── Summary Statistics Cards ── */}
        <SummaryStats stats={stats} />

        {/* ── Controls & Filter Bar ── */}
        <HistoryFilters
          filter={filter}
          onFilterChange={setFilter}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          sortOrder={sortOrder}
          onToggleSort={handleToggleSort}
          onOpenClearConfirm={() => setIsClearModalOpen(true)}
          totalCount={stats.total}
          realCount={stats.realCount}
          fakeCount={stats.fakeCount}
          hasRecords={hasRecords}
        />

        {/* ── History Table / Cards or Empty State ── */}
        {hasRecords ? (
          filteredHistory.length > 0 ? (
            <HistoryTable
              records={filteredHistory}
              onSelectRecord={setSelectedRecord}
              onDeleteRecord={deleteRecord}
            />
          ) : (
            <EmptyState isFiltered={true} onResetFilters={handleResetFilters} />
          )
        ) : (
          <EmptyState isFiltered={false} />
        )}
      </div>

      {/* ── Detail View Modal ── */}
      <ResultDetailModal
        record={selectedRecord}
        onClose={() => setSelectedRecord(null)}
      />

      {/* ── Clear Confirmation Modal ── */}
      <ClearConfirmModal
        isOpen={isClearModalOpen}
        onConfirm={handleConfirmClear}
        onCancel={() => setIsClearModalOpen(false)}
      />
    </div>
  )
}
