/**
 * ResultDetailModal.jsx
 * Modal dialog displaying the full stored details of a past prediction.
 * Displays stored prediction, scores, tokens, and full article text without re-calling the backend.
 */
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  X,
  ShieldCheck,
  ShieldX,
  Copy,
  Check,
  Calendar,
  FileText,
  Info,
  Sparkles,
} from 'lucide-react'
import ConfidenceBar from '../analyzer/ConfidenceBar'
import TokenMeter from '../analyzer/TokenMeter'

function formatDate(isoString) {
  try {
    const date = new Date(isoString)
    return new Intl.DateTimeFormat(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    }).format(date)
  } catch {
    return isoString
  }
}

export default function ResultDetailModal({ record, onClose }) {
  const navigate = useNavigate()
  const [copied, setCopied] = useState(false)

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (!record) return null

  const isReal = record.prediction === 'Real'
  const dominantScore = isReal ? record.real_probability : record.fake_probability
  const isHighConfidence = dominantScore >= 70

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(record.text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback
      setCopied(false)
    }
  }

  const handleExplain = () => {
    onClose()
    navigate('/explainability', { state: { text: record.text } })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto bg-black/80 backdrop-blur-md animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-headline"
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-navy-900 shadow-2xl overflow-hidden my-8 animate-slide-up"
        style={{
          boxShadow: isReal
            ? '0 0 50px rgba(34,197,94,0.15)'
            : '0 0 50px rgba(244,63,94,0.15)',
        }}
      >
        {/* Top accent bar */}
        <div
          className={`h-1.5 w-full bg-gradient-to-r ${
            isReal ? 'from-emerald-500 to-green-500' : 'from-rose-500 to-red-500'
          }`}
          aria-hidden="true"
        />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-white/5">
          <div className="flex items-center gap-3">
            <div
              className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                isReal
                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
                  : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
              }`}
            >
              {isReal ? <ShieldCheck size={20} /> : <ShieldX size={20} />}
            </div>
            <div>
              <h2 id="modal-headline" className="text-base font-bold text-white">
                Historical Analysis Details
              </h2>
              <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-0.5">
                <Calendar size={12} />
                <span>{formatDate(record.timestamp)}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close modal"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Verdict Banner */}
          <div
            className={`rounded-2xl p-5 border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
              isReal
                ? 'border-emerald-500/30 bg-emerald-500/5'
                : 'border-rose-500/30 bg-rose-500/5'
            }`}
          >
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`text-2xl font-black ${
                    isReal ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {isReal ? 'Real News' : 'Fake News'}
                </span>
                <span
                  className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                    isReal
                      ? 'border-emerald-500/30 bg-emerald-500/20 text-emerald-300'
                      : 'border-rose-500/30 bg-rose-500/20 text-rose-300'
                  }`}
                >
                  {isHighConfidence ? 'Strong Model Preference' : 'Weak Model Preference'}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                {isReal
                  ? 'Model identified stylistic patterns typical of authentic news reporting.'
                  : 'Model identified stylistic patterns typical of questionable or unverified writing.'}
              </p>
            </div>
          </div>

          {/* Confidence Scores */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-300">
                Model Prediction Scores
              </h3>
              <div className="group relative">
                <Info size={13} className="text-slate-500 cursor-help" />
                <div className="pointer-events-none absolute left-0 bottom-full mb-2 w-64 rounded-xl border border-white/10 bg-navy-950 p-3 text-xs text-slate-400 leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity z-20 shadow-2xl">
                  Softmax probabilities calculated by the fine-tuned RoBERTa model.
                  These represent classification confidence, not absolute factual truth.
                </div>
              </div>
            </div>

            <ConfidenceBar
              label="Real Score"
              value={record.real_probability}
              colorFrom="#10b981"
              colorTo="#059669"
              textColor="text-emerald-400"
              delay={0}
            />
            <ConfidenceBar
              label="Fake Score"
              value={record.fake_probability}
              colorFrom="#f43f5e"
              colorTo="#e11d48"
              textColor="text-rose-400"
              delay={80}
            />
          </div>

          {/* Token Meter */}
          <TokenMeter
            tokensProcessed={record.tokens_processed}
            maxTokens={record.max_tokens}
          />

          {/* Stored Article Text */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                <FileText size={13} />
                Analyzed Article Text
              </span>
              <button
                onClick={handleCopy}
                className="inline-flex items-center gap-1.5 text-xs text-blue-400 hover:text-blue-300 transition-colors"
              >
                {copied ? <Check size={13} /> : <Copy size={13} />}
                <span>{copied ? 'Copied' : 'Copy Text'}</span>
              </button>
            </div>
            <div className="rounded-xl border border-white/10 p-4 bg-navy-950/80 max-h-48 overflow-y-auto">
              <p className="text-xs text-slate-300 font-mono leading-relaxed whitespace-pre-wrap">
                {record.text}
              </p>
            </div>
          </div>

          {/* Integrity Note */}
          <div className="rounded-xl border border-white/5 bg-white/[0.02] p-3 text-[11px] text-slate-400 leading-relaxed">
            <span className="text-slate-300 font-semibold">Integrity Notice: </span>
            This record was retrieved directly from local browser storage. Scores represent
            the original model inference outputs and have not been recalculated.
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-white/5 flex items-center justify-between">
          <button
            onClick={handleExplain}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white text-xs font-semibold hover:from-blue-500 hover:to-violet-500 transition-all flex items-center gap-1.5 shadow-lg shadow-blue-500/20"
          >
            <Sparkles size={14} />
            <span>Explain with XAI</span>
          </button>

          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl border border-white/15 text-xs font-semibold text-slate-200 hover:text-white hover:bg-white/10 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
