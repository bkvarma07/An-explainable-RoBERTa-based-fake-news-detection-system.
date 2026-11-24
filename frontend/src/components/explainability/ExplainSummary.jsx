/**
 * ExplainSummary.jsx
 * Displays the prediction verdict, prediction score breakdown, sequence token usage,
 * Captum Integrated Gradients convergence delta, and processing time.
 *
 * Terminology: "Model Prediction Scores" (not "confidence"), "classification output"
 * (not "probability of truth").
 */
import { ShieldCheck, ShieldX, Activity, Info, CheckCircle2, Clock, Cpu, AlertTriangle } from 'lucide-react'
import ConfidenceBar from '../analyzer/ConfidenceBar'
import TokenMeter from '../analyzer/TokenMeter'

export default function ExplainSummary({ result, elapsedMs }) {
  if (!result) return null

  const {
    prediction,
    fake_probability,
    real_probability,
    tokens_processed,
    max_tokens,
    convergence_delta,
  } = result

  const isReal = prediction === 'Real'
  const dominantScore = isReal ? real_probability : fake_probability

  // Delta interpretation: small delta (|delta| < 0.05) is considered high fidelity
  const absDelta = Math.abs(convergence_delta || 0)
  const isHighFidelityDelta = absDelta < 0.05

  return (
    <div className="space-y-6">
      {/* ── Main 3-Column Grid ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* ── Column 1: Verdict & Classification Banner ── */}
        <div
          className={`rounded-2xl border p-6 flex flex-col justify-between backdrop-blur-xl transition-all shadow-xl ${
            isReal
              ? 'border-emerald-500/30 bg-emerald-950/20 shadow-emerald-950/20'
              : 'border-rose-500/30 bg-rose-950/20 shadow-rose-950/20'
          }`}
        >
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                Model Classification
              </span>
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full border ${
                  isReal
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-300'
                    : 'border-rose-500/30 bg-rose-500/10 text-rose-300'
                }`}
              >
                {isReal ? <ShieldCheck size={14} /> : <ShieldX size={14} />}
                {prediction} News
              </span>
            </div>

            <div className="space-y-1 mb-4">
              <div className="flex items-baseline gap-2">
                <span
                  className={`text-3xl sm:text-4xl font-black tracking-tight ${
                    isReal ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {prediction}
                </span>
                <span className="text-xl font-bold text-slate-400">
                  ({dominantScore.toFixed(1)}%)
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                {isReal
                  ? 'The model classified this article as Real.'
                  : 'The model classified this article as Fake.'}
                {' '}Target class for Integrated Gradients attribution is the model's predicted class (
                <span className="font-mono text-slate-300">{prediction}</span>).
              </p>
            </div>
          </div>

          {/* Small academic notice */}
          <div className="pt-4 border-t border-white/5 text-[11px] text-slate-400 flex items-start gap-2">
            <Info size={14} className="text-blue-400 flex-shrink-0 mt-0.5" />
            <span>
              Scores reflect the model's classification output over learned stylistic patterns, not verified factual truth.
            </span>
          </div>
        </div>

        {/* ── Column 2: Prediction Score Breakdown & Token Meter ── */}
        <div className="rounded-2xl border border-white/10 bg-navy-900/60 backdrop-blur-xl p-6 flex flex-col justify-between space-y-4 shadow-xl">
          <div className="space-y-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
              Model Prediction Scores
            </h4>
            <ConfidenceBar
              label="Real Score"
              value={real_probability}
              colorFrom="#10b981"
              colorTo="#059669"
              textColor="text-emerald-400"
              delay={0}
            />
            <ConfidenceBar
              label="Fake Score"
              value={fake_probability}
              colorFrom="#f43f5e"
              colorTo="#e11d48"
              textColor="text-rose-400"
              delay={80}
            />
          </div>

          <TokenMeter
            tokensProcessed={tokens_processed}
            maxTokens={max_tokens || 256}
          />
        </div>

        {/* ── Column 3: Integrated Gradients Approximation Quality ── */}
        <div className="rounded-2xl border border-white/10 bg-navy-900/60 backdrop-blur-xl p-6 flex flex-col justify-between space-y-4 shadow-xl">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
                <Activity size={14} className="text-cyan-400" />
                Approximation Delta
              </h4>
              <span
                className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                  isHighFidelityDelta
                    ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400'
                    : 'border-amber-500/30 bg-amber-500/10 text-amber-400'
                }`}
              >
                {isHighFidelityDelta ? 'High Fidelity' : 'Approximate'}
              </span>
            </div>

            <div className="space-y-2">
              <div className="flex items-baseline gap-2">
                <span className="text-2xl sm:text-3xl font-mono font-bold text-white">
                  {typeof convergence_delta === 'number'
                    ? convergence_delta.toFixed(6)
                    : '0.000000'}
                </span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Completeness axiom check: difference between total integrated attributions and prediction logit difference from baseline.
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-white/5 flex items-center gap-2 text-xs text-slate-400">
            <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
            <span>Calculated across 128 Riemann integration steps</span>
          </div>
        </div>
      </div>

      {/* ── Processing Time & Computation Parameters ── */}
      <div className="rounded-2xl border border-white/10 bg-navy-900/60 backdrop-blur-xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Processing time */}
          <div className="flex items-center gap-2.5 text-sm">
            <Clock size={16} className="text-blue-400 flex-shrink-0" />
            {typeof elapsedMs === 'number' ? (
              <span className="text-slate-300">
                Explanation generated in{' '}
                <strong className="text-white tabular-nums">{(elapsedMs / 1000).toFixed(2)}s</strong>
              </span>
            ) : (
              <span className="text-slate-500">Processing time not measured</span>
            )}
          </div>

          {/* Computation parameter chips */}
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-400">
            <span className="bg-white/5 border border-white/5 px-2.5 py-1 rounded-md inline-flex items-center gap-1">
              <Cpu size={10} className="text-blue-400" />
              Device: {result.device ? (result.device === 'CUDA' ? 'GPU (CUDA)' : result.device) : 'CPU'}
            </span>
            <span className="bg-white/5 border border-white/5 px-2.5 py-1 rounded-md">
              {tokens_processed} / {max_tokens || 256} tokens
            </span>
            <span className="bg-white/5 border border-white/5 px-2.5 py-1 rounded-md">
              128 IG steps
            </span>
            <span className="bg-white/5 border border-white/5 px-2.5 py-1 rounded-md">
              Batch size: 16
            </span>
          </div>
        </div>

        {/* Explain the computational cost */}
        <p className="text-[11px] text-slate-500 mt-3 leading-relaxed">
          Integrated Gradients requires additional model computations compared with ordinary
          prediction. Each explanation evaluates 128 × 16 forward passes through the embedding
          layer, making explainability significantly slower than a single-pass prediction —
          especially on CPU.
        </p>
      </div>

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
    </div>
  )
}
