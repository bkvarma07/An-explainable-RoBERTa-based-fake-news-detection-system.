/**
 * HistoryTable.jsx
 * Displays prediction history records in an accessible, responsive format.
 * Features desktop table view and mobile card view.
 */
import { ShieldCheck, ShieldX, Eye, Trash2, Calendar, Cpu } from 'lucide-react'

function formatDate(isoString) {
  try {
    const date = new Date(isoString)
    return new Intl.DateTimeFormat(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  } catch {
    return isoString
  }
}

export default function HistoryTable({ records, onSelectRecord, onDeleteRecord }) {
  return (
    <div className="space-y-4">
      {/* ── Desktop View (table) ── */}
      <div className="hidden lg:block rounded-2xl border border-white/10 overflow-hidden bg-navy-900/60 backdrop-blur-md">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.02] text-[11px] font-semibold uppercase tracking-wider text-slate-400">
                <th className="py-3.5 pl-6 pr-4">Article Preview</th>
                <th className="py-3.5 px-4">Prediction</th>
                <th className="py-3.5 px-4">Real Score</th>
                <th className="py-3.5 px-4">Fake Score</th>
                <th className="py-3.5 px-4">Tokens</th>
                <th className="py-3.5 px-4">Date &amp; Time</th>
                <th className="py-3.5 pl-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {records.map((item) => {
                const isReal = item.prediction === 'Real'
                return (
                  <tr
                    key={item.id}
                    className="hover:bg-white/[0.02] transition-colors group"
                  >
                    {/* Article preview */}
                    <td className="py-4 pl-6 pr-4 max-w-xs xl:max-w-md">
                      <p className="text-slate-200 text-xs font-mono line-clamp-2 leading-relaxed">
                        {item.preview || item.text}
                      </p>
                    </td>

                    {/* Verdict badge */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                          isReal
                            ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                            : 'bg-rose-500/15 border-rose-500/30 text-rose-400'
                        }`}
                      >
                        {isReal ? (
                          <ShieldCheck size={13} strokeWidth={2.5} />
                        ) : (
                          <ShieldX size={13} strokeWidth={2.5} />
                        )}
                        {item.prediction}
                      </span>
                    </td>

                    {/* Real score */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="font-semibold text-xs tabular-nums text-emerald-400">
                        {item.real_probability?.toFixed(1)}%
                      </span>
                    </td>

                    {/* Fake score */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="font-semibold text-xs tabular-nums text-rose-400">
                        {item.fake_probability?.toFixed(1)}%
                      </span>
                    </td>

                    {/* Tokens */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="text-xs text-slate-400 tabular-nums">
                        {item.tokens_processed}
                        <span className="text-slate-600">/{item.max_tokens}</span>
                      </span>
                    </td>

                    {/* Timestamp */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span className="text-xs text-slate-400">
                        {formatDate(item.timestamp)}
                      </span>
                    </td>

                    {/* Actions */}
                    <td className="py-4 pl-4 pr-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => onSelectRecord(item)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-500/30 bg-blue-500/10 text-xs font-medium text-blue-300 hover:bg-blue-500/20 hover:text-white transition-all"
                          title="View stored prediction details"
                        >
                          <Eye size={13} />
                          Details
                        </button>
                        <button
                          onClick={() => onDeleteRecord(item.id)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                          title="Delete this record"
                          aria-label="Delete analysis"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Mobile & Tablet View (Cards) ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:hidden">
        {records.map((item) => {
          const isReal = item.prediction === 'Real'
          return (
            <div
              key={item.id}
              className="rounded-2xl border border-white/10 p-5 bg-navy-900/60 backdrop-blur-md space-y-4 hover:border-white/20 transition-all"
            >
              {/* Header: Badge & Date */}
              <div className="flex items-center justify-between gap-3">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${
                    isReal
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                      : 'bg-rose-500/15 border-rose-500/30 text-rose-400'
                  }`}
                >
                  {isReal ? (
                    <ShieldCheck size={13} strokeWidth={2.5} />
                  ) : (
                    <ShieldX size={13} strokeWidth={2.5} />
                  )}
                  {item.prediction}
                </span>

                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <Calendar size={12} />
                  <span>{formatDate(item.timestamp)}</span>
                </div>
              </div>

              {/* Text Preview */}
              <p className="text-xs text-slate-300 font-mono line-clamp-3 leading-relaxed">
                {item.preview || item.text}
              </p>

              {/* Confidence scores row */}
              <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/5">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-500 block">
                    Real Score
                  </span>
                  <span className="text-xs font-bold text-emerald-400 tabular-nums">
                    {item.real_probability?.toFixed(1)}%
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-500 block">
                    Fake Score
                  </span>
                  <span className="text-xs font-bold text-rose-400 tabular-nums">
                    {item.fake_probability?.toFixed(1)}%
                  </span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-semibold text-slate-500 block">
                    Tokens
                  </span>
                  <span className="text-xs font-bold text-slate-300 tabular-nums flex items-center gap-1">
                    <Cpu size={11} className="text-blue-400" />
                    {item.tokens_processed}
                  </span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex items-center justify-between gap-2 pt-2">
                <button
                  onClick={() => onSelectRecord(item)}
                  className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-blue-500/30 bg-blue-500/10 text-xs font-semibold text-blue-300 hover:bg-blue-500/20 hover:text-white transition-all"
                >
                  <Eye size={13} />
                  View Details
                </button>
                <button
                  onClick={() => onDeleteRecord(item.id)}
                  className="p-2 rounded-xl border border-white/10 text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 transition-all"
                  aria-label="Delete analysis"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
