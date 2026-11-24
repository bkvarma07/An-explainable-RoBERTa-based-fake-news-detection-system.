/**
 * SummaryStats.jsx
 * Displays summary cards for Total, Real, and Fake classifications.
 * All metrics are calculated dynamically from actual stored history.
 */
import { FileText, ShieldCheck, ShieldX } from 'lucide-react'
import GlassCard from '../ui/GlassCard'

export default function SummaryStats({ stats }) {
  const { total, fakeCount, realCount, fakePercent, realPercent } = stats

  const cards = [
    {
      id: 'total',
      label: 'Articles Analyzed',
      value: total,
      sublabel: total === 1 ? '1 total record' : `${total} total records saved`,
      icon: FileText,
      iconColor: 'text-blue-400',
      iconBg: 'bg-blue-500/10 border-blue-500/20',
      glow: 'shadow-blue-900/20',
    },
    {
      id: 'real',
      label: 'Real Classifications',
      value: realCount,
      sublabel: total > 0 ? `${realPercent}% of total analyses` : '0% of total',
      icon: ShieldCheck,
      iconColor: 'text-emerald-400',
      iconBg: 'bg-emerald-500/10 border-emerald-500/20',
      glow: 'shadow-emerald-900/20',
    },
    {
      id: 'fake',
      label: 'Fake Classifications',
      value: fakeCount,
      sublabel: total > 0 ? `${fakePercent}% of total analyses` : '0% of total',
      icon: ShieldX,
      iconColor: 'text-rose-400',
      iconBg: 'bg-rose-500/10 border-rose-500/20',
      glow: 'shadow-rose-900/20',
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
      {cards.map((card) => {
        const Icon = card.icon
        return (
          <GlassCard key={card.id} className="relative overflow-hidden group">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
                  {card.label}
                </p>
                <h3 className="text-3xl font-black text-white tracking-tight">
                  {card.value.toLocaleString()}
                </h3>
                <p className="text-xs text-slate-500 mt-1">{card.sublabel}</p>
              </div>

              <div
                className={`w-12 h-12 rounded-xl flex items-center justify-center border ${card.iconBg} shadow-lg ${card.glow} transition-transform duration-300 group-hover:scale-105`}
              >
                <Icon size={22} className={card.iconColor} strokeWidth={2} />
              </div>
            </div>
          </GlassCard>
        )
      })}
    </div>
  )
}
