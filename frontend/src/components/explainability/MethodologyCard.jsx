/**
 * MethodologyCard.jsx
 * Expandable technical accordion detailing the Layer Integrated Gradients (XAI)
 * methodology, Captum configuration, and interpretation boundaries.
 */
import { useState } from 'react'
import { ChevronDown, BookOpen, Cpu, Sliders, ShieldAlert, Sparkles } from 'lucide-react'

export default function MethodologyCard() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="rounded-2xl border border-white/10 bg-navy-900/60 backdrop-blur-xl overflow-hidden shadow-xl transition-all">
      {/* ── Toggle Header ── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-white/[0.02] transition-colors"
        aria-expanded={isOpen}
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-violet-500/10 border border-violet-500/30 flex items-center justify-center text-violet-400">
            <BookOpen size={18} />
          </div>
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              Explainability Methodology & Technical Details
            </h3>
            <p className="text-xs text-slate-400">
              Captum Layer Integrated Gradients (Sundararajan et al., 2017) architecture
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-blue-400 hidden sm:inline">
            {isOpen ? 'Collapse details' : 'Learn how it works'}
          </span>
          <div
            className={`w-7 h-7 rounded-lg bg-white/5 flex items-center justify-center text-slate-300 transition-transform duration-300 ${
              isOpen ? 'rotate-180 text-white' : ''
            }`}
          >
            <ChevronDown size={16} />
          </div>
        </div>
      </button>

      {/* ── Expandable Content ── */}
      {isOpen && (
        <div className="px-6 pb-6 pt-2 border-t border-white/5 space-y-6 text-xs text-slate-300 animate-fade-in">
          {/* Grid of technical specifications */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            <div className="p-4 rounded-xl bg-navy-950/80 border border-white/5 space-y-2">
              <div className="flex items-center gap-2 text-blue-400 font-semibold">
                <Cpu size={16} />
                <span>Target Layer</span>
              </div>
              <p className="font-mono text-white text-[11px] bg-black/40 p-1.5 rounded border border-white/5">
                model.roberta.embeddings
              </p>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Attributions are calculated directly at the token embedding representation level before deep multi-head self-attention layers.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-navy-950/80 border border-white/5 space-y-2">
              <div className="flex items-center gap-2 text-violet-400 font-semibold">
                <Sliders size={16} />
                <span>Hyperparameters</span>
              </div>
              <ul className="space-y-1 text-slate-400 text-[11px] font-mono">
                <li>• Integration Steps: <strong className="text-white">128</strong></li>
                <li>• Internal Batch Size: <strong className="text-white">16</strong></li>
                <li>• Target Class: <strong className="text-white">argmax(logits)</strong></li>
                <li>• Baseline: <strong className="text-white">Zero / Pad Embeddings</strong></li>
              </ul>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Riemann sum along the straight-line path satisfies the Completeness and Implementation Invariance axioms.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-navy-950/80 border border-white/5 space-y-2">
              <div className="flex items-center gap-2 text-emerald-400 font-semibold">
                <Sparkles size={16} />
                <span>Mathematical Formulation</span>
              </div>
              <p className="font-mono text-[10px] text-slate-300 bg-black/40 p-1.5 rounded border border-white/5 leading-tight">
                IG_i(x) = (x_i - x'_i) * ∫[0,1] ∂F(x' + α(x - x')) / ∂x_i dα
              </p>
              <p className="text-slate-400 text-[11px] leading-relaxed">
                Attributions are summed across the 768-dimensional embedding space to produce scalar token scores.
              </p>
            </div>
          </div>

          {/* Interpretability & Academic Guardrails */}
          <div className="p-4 rounded-xl bg-blue-950/20 border border-blue-500/20 flex items-start gap-3">
            <ShieldAlert size={18} className="text-blue-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-2 text-xs">
              <h5 className="font-bold text-white">Interpretation Note</h5>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Positive attribution scores support the predicted class, while negative attribution
                scores oppose it. Token attribution indicates the influence of text features on the
                model's prediction; it does not establish whether an individual claim is true or false.
              </p>
              <p className="text-slate-300 leading-relaxed text-[11px]">
                Token attributions reflect which syntactic and semantic cues influenced the fine-tuned RoBERTa model's decision boundaries.{' '}
                A positive attribution does <strong>not</strong> verify real-world factual accuracy; it signifies that the word or subword shifted the internal neural activation towards the predicted class.
              </p>
            </div>
          </div>

          {/* Compact Methodology Summary */}
          <div className="p-4 rounded-xl bg-navy-950/80 border border-white/5 space-y-2">
            <h5 className="text-xs font-bold text-white">Methodology Summary</h5>
            <ul className="space-y-1 text-slate-400 text-[11px] font-mono">
              <li>• Model: <strong className="text-white">Fine-tuned RoBERTa-base</strong></li>
              <li>• XAI Method: <strong className="text-white">Captum Layer Integrated Gradients</strong></li>
              <li>• Attribution Layer: <strong className="text-white">model.roberta.embeddings</strong></li>
              <li>• Integration Steps: <strong className="text-white">128</strong></li>
              <li>• Internal Batch Size: <strong className="text-white">16</strong></li>
              <li>• Max Sequence Length: <strong className="text-white">256 tokens</strong></li>
            </ul>
          </div>
        </div>
      )}
    </div>
  )
}
