/**
 * ResultCard — displays the full prediction result from the backend.
 * Props:
 *   result    { prediction, fake_probability, real_probability, tokens_processed, max_tokens }
 *   elapsedMs number|null — frontend-measured request time in milliseconds
 *   onReset   function — callback to analyze a new article
 */
import { ShieldCheck, ShieldX, RefreshCw, Info, Clock, AlertTriangle } from 'lucide-react'
import ConfidenceBar from './ConfidenceBar'
import TokenMeter from './TokenMeter'

// Theme config per prediction label
const VERDICT_THEME = {
  Real: {
    icon: ShieldCheck,
    label: 'Real News',
    sublabel: 'The model classified this article as Real.',
    borderColor: 'rgba(34,197,94,0.35)',
    glowColor: 'rgba(34,197,94,0.12)',
    iconBg: 'from-green-500 to-emerald-600',
    iconGlow: 'shadow-green-900/50',
    badgeBg: 'bg-green-500/15 border-green-500/30 text-green-400',
    headingColor: 'text-green-400',
    topBarColor: 'from-green-500 to-emerald-500',
  },
  Fake: {
    icon: ShieldX,
    label: 'Fake News',
    sublabel: 'The model classified this article as Fake.',
    borderColor: 'rgba(239,68,68,0.35)',
    glowColor: 'rgba(239,68,68,0.10)',
    iconBg: 'from-red-500 to-rose-600',
    iconGlow: 'shadow-red-900/50',
    badgeBg: 'bg-red-500/15 border-red-500/30 text-red-400',
    headingColor: 'text-red-400',
    topBarColor: 'from-red-500 to-rose-500',
  },
}

export default function ResultCard({ result, elapsedMs, onReset }) {
  if (!result) return null

  const {
    prediction,
    fake_probability,
    real_probability,
    tokens_processed,
    max_tokens,
  } = result

  // Fallback to 'Real' theme if prediction is unexpected
  const theme = VERDICT_THEME[prediction] ?? VERDICT_THEME.Real
  const Icon = theme.icon

  // Dominant score (the winning class)
  const dominantScore = prediction === 'Fake' ? fake_probability : real_probability
  const isStrongPreference = dominantScore >= 70

  return (
    <div
      className="rounded-2xl border overflow-hidden animate-slide-up"
      style={{
        borderColor: theme.borderColor,
        background: `radial-gradient(ellipse at top, ${theme.glowColor} 0%, rgba(10,22,40,0.9) 60%)`,
        backdropFilter: 'blur(12px)',
      }}
    >
      {/* Top accent bar */}
      <div
        className={`h-1 w-full bg-gradient-to-r ${theme.topBarColor}`}
        aria-hidden="true"
      />

      <div className="p-6 sm:p-8 space-y-7">

        {/* ── Verdict Header ── */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
          {/* Icon */}
          <div
            className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${theme.iconBg}
                        flex items-center justify-center flex-shrink-0
                        shadow-xl ${theme.iconGlow}`}
          >
            <Icon size={30} className="text-white" strokeWidth={1.8} />
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap items-center gap-2.5 mb-1">
              <h2 className={`text-2xl sm:text-3xl font-black tracking-tight ${theme.headingColor}`}>
                {theme.label}
              </h2>
              <span
                className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold
                            border ${theme.badgeBg} uppercase tracking-wider`}
              >
                {isStrongPreference ? 'Strong Model Preference' : 'Weak Model Preference'}
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">{theme.sublabel}</p>
          </div>

          {/* Re-analyze button */}
          <button
            onClick={onReset}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl
                       border border-white/10 text-slate-400 hover:text-white
                       hover:border-white/20 text-xs font-medium
                       transition-all duration-200 flex-shrink-0"
            aria-label="Analyze a new article"
          >
            <RefreshCw size={13} />
            New Analysis
          </button>
        </div>

        {/* ── Divider ── */}
        <div className="border-t border-white/5" />

        {/* ── Prediction Scores ── */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-4">
            <h3 className="text-sm font-semibold text-white uppercase tracking-wider">
              Model Prediction Scores
            </h3>
            <div className="group relative">
              <Info size={13} className="text-slate-500 cursor-help" />
              <div
                className="pointer-events-none absolute left-0 bottom-full mb-2 w-64 rounded-xl
                           border border-white/10 bg-navy-900 p-3 text-xs text-slate-400
                           leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity z-10
                           shadow-2xl"
              >
                These scores reflect the model's softmax output — how strongly
                the model leans toward each label based on learned language patterns.
                They are <strong className="text-slate-200">not</strong> probabilities
                of factual truth.
              </div>
            </div>
          </div>

          <ConfidenceBar
            label="Real Score"
            value={real_probability}
            colorFrom="#22c55e"
            colorTo="#10b981"
            textColor="text-green-400"
            delay={0}
          />
          <ConfidenceBar
            label="Fake Score"
            value={fake_probability}
            colorFrom="#ef4444"
            colorTo="#f43f5e"
            textColor="text-red-400"
            delay={120}
          />
        </div>

        {/* ── Token Meter ── */}
        <TokenMeter
          tokensProcessed={tokens_processed}
          maxTokens={max_tokens}
        />

        {/* ── Processing Time ── */}
        {typeof elapsedMs === 'number' && (
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <Clock size={13} className="text-blue-400 flex-shrink-0" />
            <span>
              Prediction completed in{' '}
              <strong className="text-slate-200 tabular-nums">{(elapsedMs / 1000).toFixed(2)}s</strong>
              {' '}(single forward pass)
            </span>
          </div>
        )}

        {/* ── Model Score Disclaimer ── */}
        <div className="rounded-xl border border-white/5 px-4 py-3.5"
             style={{ background: 'rgba(255,255,255,0.02)' }}>
          <div className="flex items-start gap-2.5">
            <AlertTriangle size={14} className="text-amber-400/70 flex-shrink-0 mt-0.5" />
            <p className="text-xs text-slate-500 leading-relaxed">
              These scores represent the model's classification output. They are not
              verified probabilities that the news article is factually true. TruthLens
              is a research prototype and does not independently fact-check claims.
            </p>
          </div>
        </div>

        {/* ── Interpretation Note ── */}
        <div className="rounded-xl border border-white/5 px-4 py-3.5"
             style={{ background: 'rgba(255,255,255,0.02)' }}>
          <p className="text-xs text-slate-500 leading-relaxed">
            <span className="text-slate-400 font-medium">Interpretation note: </span>
            This classification is based solely on linguistic patterns learned from training data.
            The model does{' '}
            <strong className="text-slate-400">not</strong> access the internet,
            verify sources, or assess factual accuracy. Use this result as one signal
            — not a definitive verdict.
          </p>
        </div>

      </div>
    </div>
  )
}
