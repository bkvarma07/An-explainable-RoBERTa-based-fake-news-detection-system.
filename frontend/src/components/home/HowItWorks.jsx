import { Type, Cpu, BarChart3, Eye } from 'lucide-react'
import SectionLabel from '../ui/SectionLabel'
import GlassCard from '../ui/GlassCard'

const steps = [
  {
    step: '01',
    icon: Type,
    title: 'Paste News Text',
    description:
      'Enter the full text of a news article you want to evaluate. The system works directly with raw text — no URL scraping or external lookups.',
    color: 'from-blue-500 to-blue-700',
    glow: 'shadow-blue-900/40',
  },
  {
    step: '02',
    icon: Cpu,
    title: 'Transformer Inference',
    description:
      'Your text is tokenized and passed through the fine-tuned RoBERTa model. The model generates probability scores for each classification label.',
    color: 'from-violet-500 to-violet-700',
    glow: 'shadow-violet-900/40',
  },
  {
    step: '03',
    icon: BarChart3,
    title: 'Classification Result',
    description:
      'The model outputs a classification — Fake or Real — alongside confidence probabilities. Results are grounded in learned linguistic patterns.',
    color: 'from-cyan-500 to-cyan-700',
    glow: 'shadow-cyan-900/40',
  },
  {
    step: '04',
    icon: Eye,
    title: 'Explainability View',
    description:
      'Inspect which tokens and phrases contributed most to the prediction via attention visualization and saliency-based explanations.',
    color: 'from-rose-500 to-rose-700',
    glow: 'shadow-rose-900/40',
  },
]

export default function HowItWorks() {
  return (
    <section className="py-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <SectionLabel className="mb-4">How It Works</SectionLabel>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mt-4 mb-5 tracking-tight">
            From Article to{' '}
            <span className="gradient-text">Insight</span>
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            A transparent four-step pipeline that takes raw news text and delivers
            an explainable AI-powered classification.
          </p>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map(({ step, icon: Icon, title, description, color, glow }, idx) => (
            <div key={step} className="relative group">
              {/* Connector line (desktop) */}
              {idx < steps.length - 1 && (
                <div
                  className="hidden lg:block absolute top-10 left-full w-full h-px z-10 -translate-x-6"
                  style={{
                    background: 'linear-gradient(to right, rgba(59,130,246,0.4), transparent)',
                  }}
                  aria-hidden="true"
                />
              )}

              <GlassCard className="h-full flex flex-col">
                {/* Step number + icon */}
                <div className="flex items-start justify-between mb-5">
                  <div
                    className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center shadow-lg ${glow} group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon size={22} className="text-white" strokeWidth={1.8} />
                  </div>
                  <span className="text-3xl font-black text-white/10 group-hover:text-white/20 transition-colors">
                    {step}
                  </span>
                </div>

                <h3 className="text-white font-semibold text-base mb-3 leading-snug">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed flex-1">{description}</p>
              </GlassCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
