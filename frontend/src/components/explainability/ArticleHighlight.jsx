/**
 * ArticleHighlight.jsx
 * Reconstructs the complete article from the original text and token character offsets.
 * Preserves all formatting, punctuation, linebreaks, and spacing.
 * Merges contiguous subwords and renders readable attribution highlights.
 */
import { useMemo, useState } from 'react'
import { Sparkles, HelpCircle, Layers, ZoomIn } from 'lucide-react'

/**
 * Reconstructs highlighted spans from originalText and token offsets.
 */
function buildHighlightedSegments(originalText, tokens) {
  if (!originalText) return []
  if (!tokens || tokens.length === 0) {
    return [{ text: originalText, isToken: false, score: 0 }]
  }

  // 1. Filter valid offsets
  const valid = tokens
    .filter(
      (t) =>
        t &&
        typeof t.start_offset === 'number' &&
        typeof t.end_offset === 'number' &&
        t.start_offset >= 0 &&
        t.end_offset <= originalText.length &&
        t.start_offset < t.end_offset
    )
    .sort((a, b) => a.start_offset - b.start_offset || a.end_offset - b.end_offset)

  if (valid.length === 0) {
    return [{ text: originalText, isToken: false, score: 0 }]
  }

  // 2. Merge contiguous subword tokens (no whitespace between adjacent tokens)
  const merged = []
  for (let i = 0; i < valid.length; i++) {
    const curr = { ...valid[i] }
    if (merged.length > 0) {
      const prev = merged[merged.length - 1]
      // If tokens are strictly adjacent without any gap
      if (prev.end_offset === curr.start_offset) {
        prev.end_offset = curr.end_offset
        prev.attribution_score += curr.attribution_score
        prev.token = (prev.token || '') + (curr.token || '')
        continue
      }
    }
    merged.push(curr)
  }

  // 3. Assemble full text spans from index 0 to originalText.length
  const segments = []
  let cursor = 0

  for (const span of merged) {
    // Gap before token
    if (span.start_offset > cursor) {
      segments.push({
        id: `gap_${cursor}_${span.start_offset}`,
        text: originalText.slice(cursor, span.start_offset),
        isToken: false,
        score: 0,
      })
    }

    const start = Math.max(cursor, span.start_offset)
    if (start < span.end_offset) {
      segments.push({
        id: `tok_${start}_${span.end_offset}`,
        text: originalText.slice(start, span.end_offset),
        isToken: true,
        score: span.attribution_score,
        token: span.token,
        start,
        end: span.end_offset,
      })
      cursor = span.end_offset
    }
  }

  // Remaining tail
  if (cursor < originalText.length) {
    segments.push({
      id: `tail_${cursor}`,
      text: originalText.slice(cursor),
      isToken: false,
      score: 0,
    })
  }

  return segments
}

export default function ArticleHighlight({
  originalText,
  tokens,
  prediction,
  convergenceDelta,
}) {
  const [activeToken, setActiveToken] = useState(null)
  const [filterMode, setFilterMode] = useState('ALL') // 'ALL' | 'SUPPORT' | 'OPPOSE'

  // Maximum magnitude score for relative color scaling
  const maxScore = useMemo(() => {
    if (!tokens || tokens.length === 0) return 0.1
    const scores = tokens.map((t) => Math.abs(t.attribution_score || 0))
    return Math.max(...scores, 0.001)
  }, [tokens])

  const segments = useMemo(() => {
    return buildHighlightedSegments(originalText, tokens)
  }, [originalText, tokens])

  const oppositeLabel = prediction === 'Fake' ? 'Real' : 'Fake'

  return (
    <div className="rounded-2xl border border-white/10 bg-navy-900/70 backdrop-blur-xl overflow-hidden shadow-2xl">
      {/* ── Header Ribbon ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-6 py-4 border-b border-white/5 bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Sparkles size={18} />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Attribution-Highlighted Article
            </h3>
            <p className="text-xs text-slate-400">
              Interactive Layer Integrated Gradients token attribution mapped onto original text
            </p>
          </div>
        </div>

        {/* Filter controls */}
        <div className="flex items-center gap-1.5 self-start sm:self-auto bg-navy-950/80 p-1 rounded-xl border border-white/5">
          <button
            onClick={() => setFilterMode('ALL')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              filterMode === 'ALL'
                ? 'bg-blue-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            All Tokens
          </button>
          <button
            onClick={() => setFilterMode('SUPPORT')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              filterMode === 'SUPPORT'
                ? 'bg-emerald-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Supporting Only
          </button>
          <button
            onClick={() => setFilterMode('OPPOSE')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
              filterMode === 'OPPOSE'
                ? 'bg-rose-600 text-white shadow'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Opposing Only
          </button>
        </div>
      </div>

      {/* ── Color Legend ── */}
      <div className="px-6 py-3 border-b border-white/5 bg-navy-950/40 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-4">
          <span className="text-slate-400 font-medium">Legend:</span>

          {/* Supporting Legend */}
          <div className="flex items-center gap-2">
            <span className="inline-block w-3.5 h-3.5 rounded bg-emerald-500/70 border border-emerald-400" />
            <span className="text-emerald-300 font-medium">
              Positive: Supports {prediction}
            </span>
          </div>

          {/* Opposing Legend */}
          <div className="flex items-center gap-2">
            <span className="inline-block w-3.5 h-3.5 rounded bg-rose-500/70 border border-rose-400" />
            <span className="text-rose-300 font-medium">
              Negative: Opposes {prediction} (Leans {oppositeLabel})
            </span>
          </div>

          {/* Neutral Legend */}
          <div className="flex items-center gap-2">
            <span className="inline-block w-3.5 h-3.5 rounded bg-white/10 border border-white/20" />
            <span className="text-slate-400">Near Zero</span>
          </div>
        </div>

        <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
          <Layers size={13} className="text-blue-400" />
          <span>Higher opacity = stronger contribution</span>
        </div>
      </div>

      {/* ── Active Token Hover Ribbon ── */}
      <div className="px-6 py-2.5 bg-blue-500/5 border-b border-white/5 flex items-center justify-between min-h-[38px] text-xs">
        {activeToken ? (
          <div className="flex items-center gap-3 animate-fade-in">
            <span className="text-slate-400">Hovered Token:</span>
            <span className="font-mono font-bold text-white px-2 py-0.5 rounded bg-white/10">
              "{activeToken.text.trim()}"
            </span>
            <span
              className={`font-mono font-bold ${
                activeToken.score > 0
                  ? 'text-emerald-400'
                  : activeToken.score < 0
                  ? 'text-rose-400'
                  : 'text-slate-400'
              }`}
            >
              Score: {activeToken.score > 0 ? '+' : ''}
              {activeToken.score.toFixed(6)}
            </span>
            <span className="text-slate-400 hidden sm:inline">
              ({activeToken.score > 0 ? `supports ${prediction}` : `opposes ${prediction}`})
            </span>
            <span className="text-slate-500 text-[11px] hidden md:inline">
              Offsets: [{activeToken.start}, {activeToken.end}]
            </span>
          </div>
        ) : (
          <span className="text-slate-500 italic flex items-center gap-1.5">
            <HelpCircle size={13} />
            Hover over any highlighted word to inspect its exact Integrated Gradients score
          </span>
        )}
      </div>

      {/* ── Main Text Container ── */}
      <div className="p-6 sm:p-8 max-h-[550px] overflow-y-auto font-sans leading-relaxed text-slate-200 text-sm sm:text-base select-text whitespace-pre-wrap break-words">
        {segments.map((seg) => {
          if (!seg.isToken) {
            return <span key={seg.id}>{seg.text}</span>
          }

          const score = seg.score
          const magnitude = Math.abs(score)
          const normalized = Math.min(magnitude / maxScore, 1.0)
          const isNearZero = normalized < 0.06

          const isPositive = score > 0
          const isNegative = score < 0

          // Respect display filters
          if (filterMode === 'SUPPORT' && !isPositive) {
            return <span key={seg.id}>{seg.text}</span>
          }
          if (filterMode === 'OPPOSE' && !isNegative) {
            return <span key={seg.id}>{seg.text}</span>
          }

          if (isNearZero) {
            return (
              <span
                key={seg.id}
                onMouseEnter={() => setActiveToken(seg)}
                onMouseLeave={() => setActiveToken(null)}
                className="hover:underline transition-all cursor-help"
              >
                {seg.text}
              </span>
            )
          }

          // Dynamic styling based on normalized attribution magnitude
          let bgStyle = {}
          let borderStyle = ''
          let textColor = 'text-white'

          if (isPositive) {
            const alpha = 0.18 + normalized * 0.42
            const borderAlpha = 0.4 + normalized * 0.6
            bgStyle = {
              backgroundColor: `rgba(16, 185, 129, ${alpha})`,
              borderBottom: `2px solid rgba(52, 211, 153, ${borderAlpha})`,
            }
            textColor = normalized > 0.6 ? 'text-emerald-100 font-semibold' : 'text-emerald-200'
          } else {
            const alpha = 0.18 + normalized * 0.42
            const borderAlpha = 0.4 + normalized * 0.6
            bgStyle = {
              backgroundColor: `rgba(244, 63, 94, ${alpha})`,
              borderBottom: `2px solid rgba(251, 113, 133, ${borderAlpha})`,
            }
            textColor = normalized > 0.6 ? 'text-rose-100 font-semibold' : 'text-rose-200'
          }

          return (
            <mark
              key={seg.id}
              style={bgStyle}
              onMouseEnter={() => setActiveToken(seg)}
              onMouseLeave={() => setActiveToken(null)}
              className={`rounded px-1 py-0.5 mx-0.5 inline transition-all cursor-help ${textColor}`}
              title={`${seg.text} (Score: ${score > 0 ? '+' : ''}${score.toFixed(6)})`}
            >
              {seg.text}
            </mark>
          )
        })}
      </div>

      {/* ── Footer Stats ── */}
      <div className="px-6 py-3 bg-navy-950/60 border-t border-white/5 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-500">
        <span>Preserves original casing, spaces, and punctuation via offset mapping.</span>
        {typeof convergenceDelta === 'number' && (
          <span className="tabular-nums">
            Approximation error (delta):{' '}
            <strong className="text-slate-400 font-mono">
              {convergenceDelta.toFixed(6)}
            </strong>
          </span>
        )}
      </div>
    </div>
  )
}
