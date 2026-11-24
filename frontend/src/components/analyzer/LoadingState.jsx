/**
 * LoadingState — shown while the API is processing.
 * Full-panel pulse skeleton with status messaging.
 */
export default function LoadingState() {
  return (
    <div
      className="rounded-2xl border border-white/10 overflow-hidden animate-fade-in"
      style={{ background: 'rgba(10,22,40,0.7)' }}
      role="status"
      aria-live="polite"
      aria-label="Analyzing article, please wait"
    >
      {/* Top shimmer bar */}
      <div className="h-1 w-full overflow-hidden">
        <div
          className="h-full"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, #3b82f6 40%, #8b5cf6 60%, transparent 100%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 1.6s linear infinite',
          }}
        />
      </div>

      <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
      `}</style>

      <div className="p-7 space-y-6">
        {/* Icon + headline */}
        <div className="flex flex-col items-center text-center gap-4 py-4">
          {/* Spinning orb */}
          <div className="relative w-16 h-16">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 opacity-20 animate-pulse" />
            <div className="absolute inset-2 rounded-full bg-gradient-to-br from-blue-500 to-violet-600 opacity-40 animate-pulse"
                 style={{ animationDelay: '150ms' }} />
            <div className="absolute inset-0 flex items-center justify-center">
              <svg className="animate-spin h-7 w-7 text-blue-400"
                   xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-20" cx="12" cy="12" r="10"
                        stroke="currentColor" strokeWidth="3" />
                <path className="opacity-80" fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            </div>
          </div>

          <div>
            <p className="text-white font-semibold text-base">Running RoBERTa inference…</p>
            <p className="text-slate-400 text-sm mt-1">
              Tokenizing text and computing classification probabilities
            </p>
          </div>
        </div>

        {/* Skeleton bars */}
        <div className="space-y-3">
          {[70, 45, 85, 30].map((w, i) => (
            <div
              key={i}
              className="h-2.5 rounded-full animate-pulse"
              style={{
                width: `${w}%`,
                background: 'rgba(255,255,255,0.06)',
                animationDelay: `${i * 100}ms`,
              }}
            />
          ))}
        </div>

        {/* Stage labels */}
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Tokenizing', done: true },
            { label: 'Inference', done: false },
            { label: 'Scoring', done: false },
          ].map(({ label, done }) => (
            <div key={label}
                 className={`rounded-lg px-3 py-2 text-center text-xs font-medium border transition-all ${
                   done
                     ? 'border-blue-500/40 text-blue-400 bg-blue-500/10'
                     : 'border-white/5 text-slate-600 bg-white/[0.02]'
                 }`}>
              {label}
            </div>
          ))}
        </div>

        <p className="text-center text-xs text-slate-600">
          First request may take longer while the model loads into memory.
        </p>
      </div>
    </div>
  )
}
