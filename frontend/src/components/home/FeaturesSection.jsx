import {
  BrainCircuit,
  Layers,
  ScanText,
  BarChart2,
  Lightbulb,
  ShieldOff,
  Gauge,
  BookOpen,
} from 'lucide-react'
import SectionLabel from '../ui/SectionLabel'
import GlassCard from '../ui/GlassCard'

const features = [
  {
    icon: BrainCircuit,
    title: 'RoBERTa Transformer',
    description:
      'Fine-tuned on curated fake/real news datasets. The model learns deep linguistic and semantic patterns rather than surface-level keywords.',
    color: 'text-blue-400',
    bg: 'bg-blue-500/10',
  },
  {
    icon: ScanText,
    title: 'Full Text Analysis',
    description:
      'Processes up to 256 tokens of raw article text. No metadata, URLs, or author lookups — results are based purely on linguistic content.',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
  },
  {
    icon: Layers,
    title: 'Probability Scores',
    description:
      'Returns calibrated softmax probabilities for both Fake and Real classes — giving you confidence levels, not just binary verdicts.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
  },
  {
    icon: Lightbulb,
    title: 'Explainable Predictions',
    description:
      'Identify which words and phrases drove the model\'s decision using attention and saliency visualization tools in the Explainability view.',
    color: 'text-amber-400',
    bg: 'bg-amber-500/10',
  },
  {
    icon: Gauge,
    title: 'Real-Time Inference',
    description:
      'FastAPI backend serves predictions via a REST endpoint with low-latency responses. CORS-enabled for seamless frontend integration.',
    color: 'text-green-400',
    bg: 'bg-green-500/10',
  },
  {
    icon: ShieldOff,
    title: 'No Factual Claims',
    description:
      'TruthLens classifies linguistic style and patterns. It does not verify facts, check sources, or confirm real-world truth — by design.',
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
  },
  {
    icon: BarChart2,
    title: 'Token Transparency',
    description:
      'Each result includes the exact token count processed, so you know precisely how much of your article the model evaluated.',
    color: 'text-indigo-400',
    bg: 'bg-indigo-500/10',
  },
  {
    icon: BookOpen,
    title: 'Academic Integrity',
    description:
      'Built as a research project exploring XAI methods for NLP. Methodology, training details, and limitations are fully documented.',
    color: 'text-teal-400',
    bg: 'bg-teal-500/10',
  },
]

export default function FeaturesSection() {
  return (
    <section className="py-24 relative">
      {/* Subtle mid-page glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-30"
        style={{
          background:
            'radial-gradient(ellipse 60% 40% at 50% 50%, rgba(139,92,246,0.12) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <SectionLabel className="mb-4">Platform Features</SectionLabel>
          <h2 className="text-4xl sm:text-5xl font-bold text-white mt-4 mb-5 tracking-tight">
            What Makes{' '}
            <span className="gradient-text">TruthLens</span> Different
          </h2>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            Every design decision prioritizes transparency, academic rigor, and
            honest AI — without overpromising what the model can and cannot do.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map(({ icon: Icon, title, description, color, bg }) => (
            <GlassCard key={title} className="group">
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <Icon size={20} className={color} strokeWidth={1.8} />
              </div>
              <h3 className="text-white font-semibold text-sm mb-2 leading-snug">{title}</h3>
              <p className="text-slate-400 text-xs leading-relaxed">{description}</p>
            </GlassCard>
          ))}
        </div>
      </div>
    </section>
  )
}
