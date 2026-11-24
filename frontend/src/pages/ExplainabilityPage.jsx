/**
 * ExplainabilityPage.jsx
 * Phase 4B + Presentation Improvements:
 * Token-level Explainability Page powered by Captum Layer Integrated Gradients.
 * Connects directly to POST /api/explain and renders interactive token attributions
 * mapped onto the original article text using character offset mappings.
 *
 * Improvements:
 * - Improved loading message explaining IG computation cost.
 * - Retry button on error.
 * - Elapsed time passed to ExplainSummary.
 */
import {
  Sparkles,
  Layers,
  RotateCcw,
  AlertCircle,
  FileText,
  Clock,
  ArrowRight,
  Loader2,
  CheckCircle,
  RefreshCw,
} from 'lucide-react'
import { useExplainer } from '../hooks/useExplainer'
import ArticleHighlight from '../components/explainability/ArticleHighlight'
import ExplainSummary from '../components/explainability/ExplainSummary'
import TopTokens from '../components/explainability/TopTokens'
import MethodologyCard from '../components/explainability/MethodologyCard'
import GradientOrbs from '../components/ui/GradientOrbs'
import IsotSampleSelector from '../components/common/IsotSampleSelector'

export default function ExplainabilityPage() {
  const {
    text,
    status,
    result,
    error,
    elapsedMs,
    wordCount,
    charCount,
    maxChars,
    isTooShort,
    isLoading,
    isSuccess,
    handleTextChange,
    handleSubmit,
    handleReset,
    handleDismissError,
    setText,
  } = useExplainer()

  return (
    <div className="relative min-h-screen pt-24 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background ambient lighting */}
      <GradientOrbs />

      <div className="relative max-w-6xl mx-auto space-y-10">
        {/* ── Page Header ── */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 text-violet-300 text-xs font-semibold tracking-wider uppercase backdrop-blur-md">
            <Sparkles size={14} className="text-violet-400" />
            <span>Explainable AI (XAI) Engine</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            Token-Level{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-violet-400 to-cyan-400">
              Model Explainability
            </span>
          </h1>

          <p className="text-slate-400 text-sm sm:text-base leading-relaxed">
            Inspect the exact words and subwords that drove the RoBERTa model's decision.{' '}
            Powered by Captum's Layer Integrated Gradients with mathematical path attribution.
          </p>
        </div>

        {/* ── Error Banner with Retry ── */}
        {error && (
          <div
            className="rounded-2xl border border-rose-500/30 bg-rose-950/40 backdrop-blur-xl p-4 sm:p-5 shadow-xl animate-fade-in"
            role="alert"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <AlertCircle size={20} className="text-rose-400 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-white">Explanation Request Failed</h4>
                  <p className="text-xs text-rose-200/90 mt-0.5 leading-relaxed">{error}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button
                  onClick={() => {
                    handleDismissError()
                    // Allow retry after a brief tick
                    setTimeout(() => handleSubmit(), 50)
                  }}
                  className="text-xs text-blue-300 hover:text-white px-3 py-1.5 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 transition-colors inline-flex items-center gap-1.5 font-semibold"
                >
                  <RefreshCw size={12} />
                  Retry
                </button>
                <button
                  onClick={handleDismissError}
                  className="text-xs text-rose-300 hover:text-white px-2.5 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 transition-colors flex-shrink-0"
                >
                  Dismiss
                </button>
              </div>
            </div>
          </div>
        )}

        {/* ── Input Section ── */}
        <div className="rounded-2xl border border-white/10 bg-navy-900/60 backdrop-blur-xl p-6 sm:p-8 shadow-2xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                <FileText size={16} />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-bold text-white">
                  Article Content for Attribution
                </h2>
                <p className="text-xs text-slate-400">
                  Paste or edit the news article you want to explain
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-auto">
              <span className="text-[11px] text-slate-400 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg">
                6 ISOT Samples Available Below
              </span>
            </div>
          </div>

          {/* Textarea */}
          <div className="relative">
            <textarea
              value={text}
              onChange={handleTextChange}
              disabled={isLoading}
              rows={6}
              placeholder="Paste article text here (minimum 30 characters), or load one of the genuine ISOT benchmark samples below..."
              className="w-full rounded-xl border border-white/10 bg-navy-950/80 p-4 text-sm text-slate-200 placeholder:text-slate-600 focus:border-blue-500/60 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all resize-y font-sans leading-relaxed disabled:opacity-60"
            />
          </div>

          {/* Bottom Bar: Counters & Action Buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <span className="tabular-nums">
                <strong className="text-slate-200">{wordCount}</strong> words
              </span>
              <span className="text-slate-600">•</span>
              <span className={`tabular-nums ${isTooShort ? 'text-amber-400 font-semibold' : ''}`}>
                <strong className={isTooShort ? 'text-amber-400' : 'text-slate-200'}>
                  {charCount}
                </strong>{' '}
                / {maxChars} chars
                {isTooShort && ' (min 30)'}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {text && (
                <button
                  onClick={handleReset}
                  disabled={isLoading}
                  className="px-4 py-2 rounded-xl border border-white/10 text-xs font-semibold text-slate-400 hover:text-white hover:bg-white/5 transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  <RotateCcw size={13} />
                  <span>Clear</span>
                </button>
              )}

              <button
                onClick={handleSubmit}
                disabled={isLoading || !text.trim() || isTooShort}
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-blue-500/25 transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-blue-500/40"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin text-white" />
                    <span>Computing Attributions...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={16} />
                    <span>Generate Explanation</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* ── ISOT Dataset Sample Selector ── */}
        {!isLoading && !isSuccess && (
          <div className="space-y-3">
            <IsotSampleSelector
              onSelectSample={setText}
              currentText={text}
              disabled={isLoading}
            />
          </div>
        )}

        {/* ── Loading Skeleton / Computation State ── */}
        {isLoading && (
          <div className="rounded-2xl border border-blue-500/20 bg-navy-900/40 backdrop-blur-xl p-10 sm:p-14 text-center space-y-5 animate-pulse">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-blue-500/30 flex items-center justify-center mx-auto text-blue-400">
              <Loader2 size={28} className="animate-spin" />
            </div>
            <div className="space-y-3 max-w-xl mx-auto">
              <h3 className="text-lg font-bold text-white">
                Computing Layer Integrated Gradients
              </h3>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Generating token-level explanations. Integrated Gradients requires
                additional computation and may take longer on CPU, especially for
                longer articles.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2 text-[11px] text-slate-500">
                <span className="bg-white/5 border border-white/5 px-2 py-0.5 rounded-md">
                  128 integration steps
                </span>
                <span className="bg-white/5 border border-white/5 px-2 py-0.5 rounded-md">
                  Batch size: 16
                </span>
                <span className="bg-white/5 border border-white/5 px-2 py-0.5 rounded-md">
                  Max 256 tokens
                </span>
              </div>
            </div>
          </div>
        )}

        {/* ── Success Results Section ── */}
        {isSuccess && result && (
          <div className="space-y-8 animate-fade-in">
            {/* 1. Summary Cards (Verdict, Confidence, Token Meter, Delta) */}
            <ExplainSummary result={result} elapsedMs={elapsedMs} />

            {/* 2. Top Supporting and Opposing Words */}
            <TopTokens tokens={result.tokens} prediction={result.prediction} />

            {/* 3. Interactive Highlighted Article with Offset Reconstruction */}
            <ArticleHighlight
              originalText={text}
              tokens={result.tokens}
              prediction={result.prediction}
              convergenceDelta={result.convergence_delta}
            />

            {/* 4. Technical Methodology & Academic Guardrails Accordion */}
            <MethodologyCard />

            {/* 5. Analyze another article */}
            <div className="text-center">
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-white/10 text-sm font-semibold text-slate-400 hover:text-white hover:border-white/20 hover:bg-white/5 transition-all"
              >
                <RotateCcw size={14} />
                Explain Another Article
              </button>
            </div>
          </div>
        )}

        {/* ── Empty State (Initial) ── */}
        {!isLoading && !isSuccess && (
          <div className="rounded-2xl border border-white/5 bg-navy-900/30 backdrop-blur-sm p-10 sm:p-14 text-center space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto text-slate-400">
              <Layers size={24} />
            </div>
            <div className="space-y-1.5 max-w-md mx-auto">
              <h3 className="text-base font-bold text-white">No Explanation Generated Yet</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Paste an article above or pick one of the sample texts to see interactive token attributions calculated by Captum.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
