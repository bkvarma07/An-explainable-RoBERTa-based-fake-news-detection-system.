/**
 * ArticleInput — the main textarea panel.
 * Props:
 *   text, wordCount, charCount, maxChars, isTooShort,
 *   isLoading, onChange, onSubmit, onClear
 */
import { Zap, Trash2, AlertTriangle } from 'lucide-react'

export default function ArticleInput({
  text,
  wordCount,
  charCount,
  maxChars,
  isTooShort,
  isLoading,
  onChange,
  onSubmit,
  onClear,
}) {
  const pct = Math.min((charCount / maxChars) * 100, 100)
  const nearLimit = charCount > maxChars * 0.9

  return (
    <div className="flex flex-col gap-4">
      {/* Textarea wrapper */}
      <div
        className={`relative rounded-2xl border transition-all duration-300 overflow-hidden ${
          isTooShort
            ? 'border-amber-500/40 shadow-amber-900/20 shadow-lg'
            : text.length > 0
            ? 'border-blue-500/40 shadow-blue-900/20 shadow-lg'
            : 'border-white/10 hover:border-white/20'
        }`}
        style={{ background: 'rgba(10, 22, 40, 0.8)' }}
      >
        {/* Focus glow ring */}
        {text.length > 0 && !isTooShort && (
          <div
            className="pointer-events-none absolute inset-0 rounded-2xl"
            style={{
              boxShadow: 'inset 0 0 0 1px rgba(59,130,246,0.15)',
            }}
            aria-hidden="true"
          />
        )}

        <textarea
          value={text}
          onChange={onChange}
          disabled={isLoading}
          placeholder="Paste the full text of a news article here…&#10;&#10;For best results, include the complete article body (not just the headline). The model processes up to 256 tokens."
          rows={14}
          aria-label="News article input"
          className={`w-full resize-none bg-transparent px-5 pt-5 pb-3 text-sm text-slate-200 leading-relaxed
                      placeholder:text-slate-600 focus:outline-none
                      disabled:opacity-50 disabled:cursor-not-allowed
                      font-mono sm:font-sans`}
          style={{ minHeight: '280px' }}
        />

        {/* Character progress bar at bottom of textarea */}
        <div className="px-5 pb-4 pt-1">
          <div className="h-0.5 w-full rounded-full bg-white/5 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                nearLimit
                  ? 'bg-gradient-to-r from-amber-500 to-red-500'
                  : 'bg-gradient-to-r from-blue-600 to-violet-600'
              }`}
              style={{ width: `${pct}%` }}
              role="progressbar"
              aria-valuenow={charCount}
              aria-valuemax={maxChars}
              aria-label="Character usage"
            />
          </div>
        </div>
      </div>

      {/* Stats row + warnings */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-1">
        {/* Counters */}
        <div className="flex items-center gap-4">
          <span className="text-xs text-slate-500">
            <span className={`font-semibold ${nearLimit ? 'text-amber-400' : 'text-slate-300'}`}>
              {charCount.toLocaleString()}
            </span>
            <span className="text-slate-600"> / {maxChars.toLocaleString()} chars</span>
          </span>
          <span className="text-xs text-slate-500">
            <span className="font-semibold text-slate-300">{wordCount}</span> words
          </span>
        </div>

        {/* Short text warning */}
        {isTooShort && (
          <div className="flex items-center gap-1.5 text-xs text-amber-400">
            <AlertTriangle size={12} />
            Article too short for reliable analysis
          </div>
        )}
      </div>

      {/* Action buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={onSubmit}
          disabled={isLoading || !text.trim()}
          className={`flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl
                      font-semibold text-sm transition-all duration-300
                      ${
                        isLoading || !text.trim()
                          ? 'bg-gradient-to-r from-blue-700/50 to-violet-700/50 text-white/40 cursor-not-allowed'
                          : 'btn-primary shadow-xl shadow-blue-900/40 cursor-pointer'
                      }`}
          aria-disabled={isLoading || !text.trim()}
        >
          {isLoading ? (
            <>
              {/* Spinner */}
              <svg
                className="animate-spin h-4 w-4 text-white/60"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle
                  className="opacity-25"
                  cx="12" cy="12" r="10"
                  stroke="currentColor" strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Analyzing with RoBERTa…
            </>
          ) : (
            <>
              <Zap size={16} strokeWidth={2.5} />
              Analyze News
            </>
          )}
        </button>

        {text.length > 0 && !isLoading && (
          <button
            onClick={onClear}
            className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl
                       border border-white/10 text-slate-400 hover:text-white hover:border-white/25
                       text-sm font-medium transition-all duration-200"
            aria-label="Clear textarea"
          >
            <Trash2 size={15} />
            Clear
          </button>
        )}
      </div>
    </div>
  )
}
