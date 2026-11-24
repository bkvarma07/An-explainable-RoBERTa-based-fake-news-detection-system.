/**
 * IsotSampleSelector.jsx
 * Reusable component for choosing genuine sample articles from the ISOT dataset.
 * Used consistently across both News Analyzer and Explainability pages.
 *
 * Layout:
 *   Real News  → Short Sample 1 | Short Sample 2 | Long Sample
 *   Fake News  → Short Sample 1 | Short Sample 2 | Long Sample
 *
 * Selecting a sample ONLY populates the text field — it does NOT auto-submit.
 */
import { useState } from 'react'
import { CheckCircle2, Database, ArrowUpRight, Zap, FileText } from 'lucide-react'
import { ISOT_SAMPLES } from '../../data/isotSamples'

const realSamples = ISOT_SAMPLES.filter((s) => s.category === 'real')
const fakeSamples = ISOT_SAMPLES.filter((s) => s.category === 'fake')

function SampleCard({ sample, isSelected, disabled, onSelect }) {
  const isReal = sample.category === 'real'
  const isLong = sample.length === 'long'

  return (
    <div
      onClick={() => !disabled && onSelect(sample.text)}
      className={`group relative rounded-xl border p-4 flex flex-col justify-between transition-all duration-200 cursor-pointer text-left ${
        isSelected
          ? isReal
            ? 'border-emerald-500/50 bg-emerald-950/20 shadow-lg shadow-emerald-950/30 ring-1 ring-emerald-500/30'
            : 'border-rose-500/50 bg-rose-950/20 shadow-lg shadow-rose-950/30 ring-1 ring-rose-500/30'
          : 'border-white/5 bg-navy-900/40 hover:border-white/20 hover:bg-navy-900/80'
      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <div className="space-y-2.5">
        {/* Badges row */}
        <div className="flex items-center justify-between gap-2 flex-wrap">
          {/* Real/Fake badge */}
          <span
            className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
              isReal
                ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                : 'border-rose-500/30 bg-rose-500/10 text-rose-300'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${isReal ? 'bg-emerald-400' : 'bg-rose-400'}`} />
            {isReal ? 'Real (Label 1)' : 'Fake (Label 0)'}
          </span>

          {/* Short / Long badge with exact RoBERTa token count */}
          <span
            className={`inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md border ${
              isLong
                ? 'border-amber-500/30 bg-amber-500/10 text-amber-300'
                : 'border-blue-500/30 bg-blue-500/10 text-blue-300'
            }`}
          >
            {isLong ? <FileText size={9} /> : <Zap size={9} />}
            {isLong ? 'Long' : 'Short'} · {sample.tokenCount} tokens
          </span>
        </div>

        {/* Title */}
        <h4 className="text-xs font-semibold text-white group-hover:text-blue-300 transition-colors line-clamp-2 leading-snug">
          {sample.title}
        </h4>

        {/* Preview snippet */}
        <p className="text-[11px] text-slate-400 line-clamp-3 leading-relaxed font-sans">
          {sample.preview}
        </p>
      </div>

      {/* Bottom metadata & CTA */}
      <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[10px]">
        <span className="text-slate-500">
          {sample.subject} · {sample.date}
        </span>

        <span
          className={`inline-flex items-center gap-1 font-semibold transition-colors ${
            isSelected
              ? isReal
                ? 'text-emerald-400'
                : 'text-rose-400'
              : 'text-blue-400 group-hover:text-blue-300'
          }`}
        >
          {isSelected ? (
            <>
              <CheckCircle2 size={12} />
              <span>Loaded</span>
            </>
          ) : (
            <>
              <span>Load sample</span>
              <ArrowUpRight size={12} />
            </>
          )}
        </span>
      </div>
    </div>
  )
}

function CategorySection({ title, samples, currentText, disabled, onSelectSample, colorClass, dotClass }) {
  return (
    <div className="space-y-3">
      {/* Section heading */}
      <div className="flex items-center gap-2 px-1">
        <span className={`w-2 h-2 rounded-full ${dotClass}`} />
        <h4 className={`text-xs font-bold uppercase tracking-wider ${colorClass}`}>{title}</h4>
        <span className="text-[10px] text-slate-500">
          ({samples.filter((s) => s.length === 'short').length} Short · {samples.filter((s) => s.length === 'long').length} Long)
        </span>
      </div>

      {/* Cards grid: short cards first, long card last */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {samples.map((sample) => (
          <SampleCard
            key={sample.id}
            sample={sample}
            isSelected={currentText === sample.text}
            disabled={disabled}
            onSelect={onSelectSample}
          />
        ))}
      </div>
    </div>
  )
}

export default function IsotSampleSelector({ onSelectSample, currentText, disabled }) {
  const [activeCategory, setActiveCategory] = useState('all') // 'all' | 'real' | 'fake'

  const shownReal = activeCategory !== 'fake' ? realSamples : []
  const shownFake = activeCategory !== 'real' ? fakeSamples : []

  return (
    <div
      className="rounded-2xl border border-white/10 overflow-hidden"
      style={{ background: 'rgba(10,22,40,0.65)', backdropFilter: 'blur(16px)' }}
    >
      {/* Header & Category Filters */}
      <div className="p-5 sm:p-6 border-b border-white/5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <Database size={15} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <span>Genuine ISOT Benchmark Samples</span>
                <span className="text-[10px] uppercase font-semibold tracking-wider px-2 py-0.5 rounded-full border border-blue-500/30 bg-blue-500/10 text-blue-300">
                  Authoritative Dataset
                </span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Authentic articles from ISOT <code className="text-slate-300">True.csv</code> and{' '}
                <code className="text-slate-300">Fake.csv</code> — all within the 256 RoBERTa-token limit
              </p>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-navy-950/80 border border-white/5 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setActiveCategory('all')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all ${
                activeCategory === 'all'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-900/40'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              All (6)
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory('real')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                activeCategory === 'real'
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-900/40'
                  : 'text-emerald-400/80 hover:text-emerald-300'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Real (3)
            </button>
            <button
              type="button"
              onClick={() => setActiveCategory('fake')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all flex items-center gap-1.5 ${
                activeCategory === 'fake'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-900/40'
                  : 'text-rose-400/80 hover:text-rose-300'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
              Fake (3)
            </button>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 leading-relaxed">
          Select any sample to populate the text editor. You must still manually click <strong className="text-slate-400">Analyze</strong> or{' '}
          <strong className="text-slate-400">Generate Explanation</strong> to call the backend API.
          No predictions are hardcoded — all results come from the real fine-tuned RoBERTa model.{' '}
          <span className="text-amber-400/80">Long samples</span> produce more tokens and require more Captum computation time.
        </p>
      </div>

      {/* Sample Sections */}
      <div className="p-5 sm:p-6 space-y-6">
        {shownReal.length > 0 && (
          <CategorySection
            title="Real News"
            samples={realSamples}
            currentText={currentText}
            disabled={disabled}
            onSelectSample={onSelectSample}
            colorClass="text-emerald-400"
            dotClass="bg-emerald-400"
          />
        )}
        {shownFake.length > 0 && (
          <CategorySection
            title="Fake News"
            samples={fakeSamples}
            currentText={currentText}
            disabled={disabled}
            onSelectSample={onSelectSample}
            colorClass="text-rose-400"
            dotClass="bg-rose-400"
          />
        )}
      </div>
    </div>
  )
}
