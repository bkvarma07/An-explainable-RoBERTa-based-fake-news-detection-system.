/**
 * TokenMeter — visualises how many of the 256 available tokens were used.
 * Props:
 *   tokensProcessed number
 *   maxTokens       number (always 256 from the backend)
 */
import { useEffect, useState } from 'react'

export default function TokenMeter({ tokensProcessed, maxTokens }) {
  const pct = Math.min((tokensProcessed / maxTokens) * 100, 100)
  const [width, setWidth] = useState(0)

  useEffect(() => {
    const t = setTimeout(() => setWidth(pct), 120)
    return () => clearTimeout(t)
  }, [pct])

  const isNearMax = pct >= 90

  return (
    <div className="rounded-xl border border-white/10 p-4 space-y-3"
         style={{ background: 'rgba(10,22,40,0.6)' }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Tokens Processed
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">
            RoBERTa max sequence: {maxTokens} tokens
          </p>
        </div>
        <div className="text-right">
          <p className={`text-lg font-bold tabular-nums ${isNearMax ? 'text-amber-400' : 'text-blue-400'}`}>
            {tokensProcessed}
            <span className="text-sm font-normal text-slate-500"> / {maxTokens}</span>
          </p>
        </div>
      </div>

      {/* Bar */}
      <div
        className="h-2 w-full rounded-full overflow-hidden"
        style={{ background: 'rgba(255,255,255,0.06)' }}
        role="progressbar"
        aria-valuenow={tokensProcessed}
        aria-valuemax={maxTokens}
        aria-label={`${tokensProcessed} of ${maxTokens} tokens used`}
      >
        <div
          className="h-full rounded-full transition-all"
          style={{
            width: `${width}%`,
            background: isNearMax
              ? 'linear-gradient(to right, #f59e0b, #ef4444)'
              : 'linear-gradient(to right, #3b82f6, #8b5cf6)',
            transition: 'width 900ms cubic-bezier(0.4,0,0.2,1) 150ms',
          }}
        />
      </div>

      {isNearMax && (
        <p className="text-[11px] text-amber-400/80 leading-relaxed">
          ⚠ Your article reached the token limit. Text beyond token {maxTokens} was truncated — results reflect only the first portion of the article.
        </p>
      )}
      {!isNearMax && (
        <p className="text-[11px] text-slate-500 leading-relaxed">
          The model processed {pct.toFixed(1)}% of the available token budget for this article.
        </p>
      )}
    </div>
  )
}
