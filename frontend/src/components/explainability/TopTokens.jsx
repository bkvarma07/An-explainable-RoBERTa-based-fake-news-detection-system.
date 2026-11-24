/**
 * TopTokens.jsx
 * Computes and displays the Top 5 tokens supporting the predicted class
 * and the Top 5 tokens opposing the predicted class.
 */
import { useMemo } from 'react'
import { ThumbsUp, ThumbsDown, ArrowUpRight, ArrowDownRight, Award } from 'lucide-react'

function cleanTokenString(token) {
  if (!token) return ''
  // Replace RoBERTa word boundary symbol 'Ġ' with a clean space prefix indicator
  return token.replace(/^Ġ/, '')
}

export default function TopTokens({ tokens, prediction }) {
  const oppositeLabel = prediction === 'Fake' ? 'Real' : 'Fake'

  const { supporting, opposing, maxSupportScore, maxOpposeScore } = useMemo(() => {
    if (!tokens || tokens.length === 0) {
      return { supporting: [], opposing: [], maxSupportScore: 1, maxOpposeScore: 1 }
    }

    // Filter out empty or special tokens just in case
    const valid = tokens.filter(
      (t) =>
        t &&
        t.token &&
        t.token !== '<s>' &&
        t.token !== '</s>' &&
        t.token !== '<pad>' &&
        typeof t.attribution_score === 'number'
    )

    // Supporting: score > 0, sorted descending
    const supp = valid
      .filter((t) => t.attribution_score > 0)
      .sort((a, b) => b.attribution_score - a.attribution_score)
      .slice(0, 5)

    // Opposing: score < 0, sorted ascending (most negative first)
    const opp = valid
      .filter((t) => t.attribution_score < 0)
      .sort((a, b) => a.attribution_score - b.attribution_score)
      .slice(0, 5)

    const maxSupp = supp.length > 0 ? Math.abs(supp[0].attribution_score) : 1
    const maxOpp = opp.length > 0 ? Math.abs(opp[0].attribution_score) : 1

    return {
      supporting: supp,
      opposing: opp,
      maxSupportScore: maxSupp || 1,
      maxOpposeScore: maxOpp || 1,
    }
  }, [tokens])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* ── Top Supporting Tokens ── */}
      <div className="rounded-2xl border border-emerald-500/20 bg-navy-900/60 backdrop-blur-xl p-6 shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                <ThumbsUp size={16} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  Top Supporting Tokens
                  <ArrowUpRight size={14} className="text-emerald-400" />
                </h4>
                <p className="text-xs text-slate-400">
                  Tokens that most strongly supported the prediction of{' '}
                  <span className="font-semibold text-emerald-300">{prediction}</span>
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              Positive (+)
            </span>
          </div>

          {supporting.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No strong supporting tokens detected for this text sample.
            </div>
          ) : (
            <div className="space-y-3">
              {supporting.map((item, idx) => {
                const ratio = Math.min((item.attribution_score / maxSupportScore) * 100, 100)
                const cleaned = cleanTokenString(item.token)
                return (
                  <div
                    key={`supp_${idx}_${item.start_offset}`}
                    className="p-3 rounded-xl bg-emerald-950/20 border border-emerald-500/15 hover:border-emerald-500/30 transition-all"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-white/5 flex items-center justify-center text-[10px] font-mono font-bold text-slate-400">
                          #{idx + 1}
                        </span>
                        <span className="text-sm font-mono font-bold text-white bg-black/30 px-2 py-0.5 rounded border border-white/10">
                          "{cleaned}"
                        </span>
                      </div>
                      <span className="font-mono text-xs font-bold text-emerald-400 tabular-nums">
                        +{item.attribution_score.toFixed(6)}
                      </span>
                    </div>

                    {/* Magnitude bar */}
                    <div className="w-full h-1.5 rounded-full bg-navy-950/80 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700"
                        style={{ width: `${ratio}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <p className="mt-4 pt-3 border-t border-white/5 text-[11px] text-slate-500">
          Positive scores shift the model's logits towards {prediction}.
        </p>
      </div>

      {/* ── Top Opposing Tokens ── */}
      <div className="rounded-2xl border border-rose-500/20 bg-navy-900/60 backdrop-blur-xl p-6 shadow-xl flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/5">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
                <ThumbsDown size={16} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white flex items-center gap-1.5">
                  Top Opposing Tokens
                  <ArrowDownRight size={14} className="text-rose-400" />
                </h4>
                <p className="text-xs text-slate-400">
                  Tokens that pushed the prediction towards{' '}
                  <span className="font-semibold text-rose-300">{oppositeLabel}</span>
                </p>
              </div>
            </div>
            <span className="text-[11px] font-bold text-rose-400 bg-rose-500/10 px-2.5 py-0.5 rounded-full border border-rose-500/20">
              Negative (-)
            </span>
          </div>

          {opposing.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">
              No strong opposing tokens detected for this text sample.
            </div>
          ) : (
            <div className="space-y-3">
              {opposing.map((item, idx) => {
                const ratio = Math.min((Math.abs(item.attribution_score) / maxOpposeScore) * 100, 100)
                const cleaned = cleanTokenString(item.token)
                return (
                  <div
                    key={`opp_${idx}_${item.start_offset}`}
                    className="p-3 rounded-xl bg-rose-950/20 border border-rose-500/15 hover:border-rose-500/30 transition-all"
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className="w-5 h-5 rounded-md bg-white/5 flex items-center justify-center text-[10px] font-mono font-bold text-slate-400">
                          #{idx + 1}
                        </span>
                        <span className="text-sm font-mono font-bold text-white bg-black/30 px-2 py-0.5 rounded border border-white/10">
                          "{cleaned}"
                        </span>
                      </div>
                      <span className="font-mono text-xs font-bold text-rose-400 tabular-nums">
                        {item.attribution_score.toFixed(6)}
                      </span>
                    </div>

                    {/* Magnitude bar */}
                    <div className="w-full h-1.5 rounded-full bg-navy-950/80 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-700"
                        style={{ width: `${ratio}%` }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        <p className="mt-4 pt-3 border-t border-white/5 text-[11px] text-slate-500">
          Negative scores oppose {prediction} and favor {oppositeLabel}.
        </p>
      </div>
    </div>
  )
}
