/**
 * AboutPage.jsx
 * Phase 5: Academic Project Information Page for TruthLens
 *
 * Title: "Explainable Transformer-Based Fake News Detection
 *         Using News Content and Source Credibility Features"
 *
 * Accurately documents system architecture, ISOT training dataset,
 * RoBERTa fine-tuning, Captum Layer Integrated Gradients explainability,
 * reported metrics, and research limitations.
 */
import {
  BookOpen,
  Cpu,
  Layers,
  Database,
  BarChart3,
  AlertTriangle,
  Compass,
  ShieldAlert,
  Sparkles,
  CheckCircle2,
  Code2,
  Server,
  Workflow,
  FileCheck,
} from 'lucide-react'
import GradientOrbs from '../components/ui/GradientOrbs'
import SectionLabel from '../components/ui/SectionLabel'

// ─────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────

function InfoCard({ icon: Icon, iconColor = 'text-blue-400', borderColor = 'border-blue-500/20', bgColor = 'bg-blue-500/10', title, subtitle, children }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-navy-900/60 backdrop-blur-xl p-6 sm:p-8 space-y-4">
      <div className={`w-10 h-10 rounded-xl ${bgColor} border ${borderColor} flex items-center justify-center ${iconColor}`}>
        <Icon size={20} />
      </div>
      <div>
        <h2 className="text-xl font-bold text-white">{title}</h2>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
      {children}
    </div>
  )
}

function MetricCell({ label, value, color = 'text-slate-200', note }) {
  return (
    <div className="p-4 rounded-xl bg-navy-950/80 border border-white/5 space-y-1">
      <span className="text-xs text-slate-500">{label}</span>
      <p className={`text-2xl font-black font-mono ${color}`}>{value}</p>
      {note && <p className="text-[11px] text-slate-400">{note}</p>}
    </div>
  )
}

// ─────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────

export default function AboutPage() {
  return (
    <div className="relative min-h-screen pt-28 pb-24 px-4 sm:px-6 lg:px-8 overflow-hidden text-slate-300">
      {/* Background ambient lighting */}
      <GradientOrbs />

      {/* Subtle dot-grid */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `radial-gradient(rgba(255,255,255,0.8) 1px, transparent 1px)`,
          backgroundSize: '32px 32px',
        }}
        aria-hidden="true"
      />

      <div className="relative max-w-5xl mx-auto space-y-16">

        {/* ══════════════════════════════════════════
            1. Hero Header & Title
        ══════════════════════════════════════════ */}
        <div className="text-center space-y-5 max-w-3xl mx-auto">
          <SectionLabel className="mx-auto">
            <BookOpen size={13} className="text-blue-400" />
            <span>Academic Research Project</span>
          </SectionLabel>

          <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
            About <span className="gradient-text">TruthLens</span>
          </h1>

          <p className="text-sm sm:text-lg font-medium text-slate-200 leading-snug px-4">
            "Explainable Transformer-Based Fake News Detection Using News Content
            and Source Credibility Features"
          </p>

          <p className="text-sm text-slate-400 leading-relaxed max-w-2xl mx-auto">
            An academic research prototype investigating the application of
            fine-tuned bidirectional transformers (RoBERTa) and axiomatic
            feature attribution (Layer Integrated Gradients) for verifiable
            news classification.
          </p>

          <div className="inline-flex items-start gap-2.5 px-4 py-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs text-left max-w-xl mx-auto">
            <AlertTriangle size={15} className="text-amber-400 flex-shrink-0 mt-0.5" />
            <span>
              <strong className="text-amber-300">Research Prototype:</strong> TruthLens
              analyzes stylistic and lexical patterns learned from benchmark training
              distributions. It is an educational tool, not an infallible or real-time
              fact-checking engine.
            </span>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            2. Project Overview & Objectives
        ══════════════════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoCard
            icon={Compass}
            iconColor="text-blue-400"
            borderColor="border-blue-500/20"
            bgColor="bg-blue-500/10"
            title="Project Overview"
          >
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              The digital information ecosystem faces an unprecedented volume of
              disinformation, hyper-partisan propaganda, and synthetic media.
              Traditional machine learning baselines (e.g. TF-IDF classifiers) fail
              to capture nuanced context, syntax, and long-range dependencies.
            </p>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              TruthLens explores whether deep contextual transformers can identify
              linguistic markers of fabricated reporting, while simultaneously
              deploying token-level attribution algorithms to unpack the model's
              internal decision-making process.
            </p>
          </InfoCard>

          <InfoCard
            icon={Sparkles}
            iconColor="text-violet-400"
            borderColor="border-violet-500/20"
            bgColor="bg-violet-500/10"
            title="Core Research Objectives"
          >
            <ul className="space-y-3 text-xs sm:text-sm text-slate-300">
              {[
                ['text-blue-400', 'Transformer Fine-Tuning', 'Adapt RoBERTa-base for binary sequence classification over raw article content.'],
                ['text-violet-400', 'Axiomatic Explainability', 'Implement Captum Layer Integrated Gradients for verifiable word-level salience.'],
                ['text-indigo-400', 'Confidence Transparency', 'Communicate classification uncertainty clearly and avoid false certainty claims.'],
                ['text-amber-400', 'Dataset Bias Auditing', 'Inspect publisher artifacts, wire-service templates, and out-of-distribution limits.'],
              ].map(([color, title, desc]) => (
                <li key={title} className="flex items-start gap-2.5">
                  <CheckCircle2 size={15} className={`${color} flex-shrink-0 mt-0.5`} />
                  <span>
                    <strong className="text-white">{title}:</strong> {desc}
                  </span>
                </li>
              ))}
            </ul>
          </InfoCard>
        </div>

        {/* ══════════════════════════════════════════
            3. Pipeline Workflow
        ══════════════════════════════════════════ */}
        <div className="rounded-2xl border border-white/10 bg-navy-900/60 backdrop-blur-xl p-6 sm:p-8 space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Workflow size={18} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">System Architecture &amp; Pipeline</h2>
              <p className="text-xs text-slate-400">End-to-end inference flow from raw article input to explainable visualization</p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {[
              { step: '01', title: 'News Article', desc: 'Raw body text input, up to 10,000 characters' },
              { step: '02', title: 'Tokenization', desc: 'BPE encoding, capped at 256 tokens' },
              { step: '03', title: 'RoBERTa Model', desc: '12-layer transformer sequence classification' },
              { step: '04', title: 'Softmax Scores', desc: 'Confidence values for Real and Fake classes' },
              { step: '05', title: 'Integrated Gradients', desc: 'Captum path attribution on embedding space' },
              { step: '06', title: 'Token Highlighting', desc: 'Interactive character-offset attribution map' },
            ].map((st, i) => (
              <div
                key={i}
                className="relative rounded-xl border border-white/5 bg-navy-950/60 p-3.5 flex flex-col gap-2"
              >
                <span className="text-[10px] font-mono font-bold text-blue-400 bg-blue-500/10 px-1.5 py-0.5 rounded self-start">
                  {st.step}
                </span>
                <h3 className="text-xs font-bold text-white leading-tight">{st.title}</h3>
                <p className="text-[11px] text-slate-400 leading-snug">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════════════════════════════
            4. Technology Stack
        ══════════════════════════════════════════ */}
        <div className="space-y-5">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Code2 size={20} className="text-blue-400" />
            Technology Stack
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Frontend */}
            <div className="rounded-2xl border border-white/10 bg-navy-900/50 p-6 space-y-3">
              <div className="flex items-center gap-2 text-cyan-400 mb-1">
                <Code2 size={15} />
                <h3 className="text-xs font-bold uppercase tracking-wider">Frontend</h3>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {[
                  ['React.js 18', 'Component-driven reactive UI architecture'],
                  ['Vite', 'Ultra-fast build tool and dev-server proxy'],
                  ['Tailwind CSS', 'Custom dark navy, blue & violet design system'],
                  ['React Router v6', 'Client-side routing with route state persistence'],
                  ['Lucide React', 'Consistent visual icon library'],
                ].map(([name, desc]) => (
                  <li key={name}>
                    <strong className="text-white">{name}:</strong> {desc}
                  </li>
                ))}
              </ul>
            </div>

            {/* Backend */}
            <div className="rounded-2xl border border-white/10 bg-navy-900/50 p-6 space-y-3">
              <div className="flex items-center gap-2 text-blue-400 mb-1">
                <Server size={15} />
                <h3 className="text-xs font-bold uppercase tracking-wider">Backend API</h3>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {[
                  ['Python 3', 'High-performance runtime environment'],
                  ['FastAPI', 'Async REST API framework with OpenAPI/Swagger'],
                  ['Uvicorn', 'ASGI web server with worker thread isolation'],
                  ['Pydantic', 'Request & response schema validation'],
                  ['Endpoints', 'POST /predict · POST /explain'],
                ].map(([name, desc]) => (
                  <li key={name}>
                    <strong className="text-white">{name}:</strong>{' '}
                    <code className="text-slate-400">{desc}</code>
                  </li>
                ))}
              </ul>
            </div>

            {/* ML */}
            <div className="rounded-2xl border border-white/10 bg-navy-900/50 p-6 space-y-3">
              <div className="flex items-center gap-2 text-violet-400 mb-1">
                <Cpu size={15} />
                <h3 className="text-xs font-bold uppercase tracking-wider">ML &amp; XAI</h3>
              </div>
              <ul className="space-y-1.5 text-xs text-slate-300">
                {[
                  ['PyTorch', 'Dynamic tensor computation and autograd'],
                  ['RoBERTa-base', '125M parameter contextual transformer'],
                  ['Hugging Face', 'Transformers, tokenizers, offset mappings'],
                  ['Captum', 'PyTorch model interpretability library'],
                  ['LayerIntegratedGradients', 'Axiomatic path attribution method'],
                ].map(([name, desc]) => (
                  <li key={name}>
                    <strong className="text-white">{name}:</strong> {desc}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════
            5. Dataset Specifications
        ══════════════════════════════════════════ */}
        <InfoCard
          icon={Database}
          iconColor="text-blue-400"
          borderColor="border-blue-500/20"
          bgColor="bg-blue-500/10"
          title="ISOT Fake News Dataset"
          subtitle="University of Victoria — benchmark training corpus"
        >
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            The model was trained and evaluated on the widely recognized{' '}
            <strong>ISOT Fake News Dataset</strong>. The raw benchmark contains 44,898
            articles sourced during 2016–2017, organized into two CSV files:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <MetricCell
              label="Real News Corpus:"
              value="True.csv"
              color="text-emerald-400"
              note="21,417 raw articles — 100% Reuters wire reports. Label = 1."
            />
            <MetricCell
              label="Fake News Corpus:"
              value="Fake.csv"
              color="text-rose-400"
              note="23,481 raw articles — hyper-partisan blogs and opinion sites. Label = 0."
            />
            <MetricCell
              label="Cleaned Training Corpus:"
              value="39,084"
              color="text-blue-400"
              note="After deduplication and empty-body removal (21,190 Real · 17,894 Fake)."
            />
          </div>

          <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5 text-xs text-slate-300 space-y-1.5">
            <strong className="text-blue-300">Feature Policy:</strong>
            <p className="text-slate-400 leading-relaxed">
              The dataset's <code className="text-slate-200">subject</code> column (e.g.{' '}
              <em>politicsNews</em>, <em>left-news</em>) was found to have 100% label
              correlation during exploratory analysis and is <strong>strictly excluded</strong>{' '}
              from model inputs. Only concatenated headline and article body are used.
            </p>
          </div>
        </InfoCard>

        {/* ══════════════════════════════════════════
            6. Model Architecture & Confidence
        ══════════════════════════════════════════ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoCard
            icon={Layers}
            iconColor="text-blue-400"
            borderColor="border-blue-500/20"
            bgColor="bg-blue-500/10"
            title="Model Architecture & Input Specifications"
          >
            <ul className="space-y-2 text-xs sm:text-sm text-slate-300">
              {[
                ['Pretrained Base', 'roberta-base (Liu et al., 2019)'],
                ['Architecture', '12 transformer layers · 768 hidden dims · 12 attention heads'],
                ['Max Input Length', '256 RoBERTa tokens (BPE truncation and padding)'],
                ['Classification Head', 'Dense + dropout (p=0.1) over the <s> token representation'],
                ['Optimizer', 'AdamW with learning-rate warmup and weight decay'],
              ].map(([label, val]) => (
                <li key={label} className="flex flex-col sm:flex-row sm:gap-2">
                  <span className="font-semibold text-white w-40 flex-shrink-0">{label}:</span>
                  <span className="text-slate-400">{val}</span>
                </li>
              ))}
            </ul>

            <div className="p-3.5 rounded-xl border border-blue-500/20 bg-blue-500/5 text-xs text-slate-300 space-y-2 leading-relaxed">
              <p>
                <strong className="text-white">Maximum Input Length: 256 RoBERTa tokens</strong>
              </p>
              <p className="text-slate-400">
                TruthLens processes a maximum of 256 tokens per article using the fine-tuned RoBERTa-base model. Articles exceeding this limit are truncated to the first 256 tokens before prediction and explainability processing. Therefore, token-level explanations are generated only for the processed portion of the article.
              </p>
              <ul className="space-y-1 text-slate-400 list-disc list-inside text-[11px] pt-1">
                <li>Short and long demonstration samples are selected to remain within the 256-token limit.</li>
                <li>The token count is calculated using the actual RoBERTa tokenizer, not ordinary word count.</li>
              </ul>
            </div>
          </InfoCard>

          <InfoCard
            icon={FileCheck}
            iconColor="text-violet-400"
            borderColor="border-violet-500/20"
            bgColor="bg-violet-500/10"
            title="Confidence Score Interpretation"
          >
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              The model outputs raw logits for each class, converted to probabilities
              via the Softmax function. The displayed Fake% and Real% values reflect
              the model's normalized class confidence.
            </p>
            <div className="p-3 rounded-xl bg-navy-950/80 border border-white/5 font-mono text-center text-xs text-blue-300 tracking-wide">
              P(Class<sub>i</sub>) = exp(z<sub>i</sub>) / Σ exp(z<sub>j</sub>)
            </div>
            <div className="p-3 rounded-xl border border-amber-500/20 bg-amber-500/5 text-xs text-amber-200/90 leading-relaxed">
              <strong>Academic Clarity:</strong> These percentages reflect alignment with
              training distribution patterns — they are <em>model confidence metrics</em>,
              not verified probabilities of external factual truth.
            </div>
          </InfoCard>
        </div>

        {/* ══════════════════════════════════════════
            7. Explainable AI: Integrated Gradients
        ══════════════════════════════════════════ */}
        <InfoCard
          icon={Sparkles}
          iconColor="text-violet-400"
          borderColor="border-violet-500/20"
          bgColor="bg-violet-500/10"
          title="Explainable AI — Captum Layer Integrated Gradients"
          subtitle="Axiomatically grounded feature attribution via path integration"
        >
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            TruthLens deploys <strong>Captum's Layer Integrated Gradients (LIG)</strong>{' '}
            (Sundararajan et al., 2017) to explain model decisions. Unlike heuristic
            attention weights, Integrated Gradients satisfies the core mathematical axioms
            of <em>Completeness</em> and <em>Implementation Invariance</em>.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
            {[
              ['Target Layer', 'model.roberta.embeddings', 'text-violet-300', 'Embedding-dimension attributions'],
              ['Integration Steps', 'n_steps = 128', 'text-blue-300', 'Riemann sum path discretization'],
              ['Internal Batch', 'batch_size = 16', 'text-cyan-300', 'Prevents OOM during backward pass'],
              ['Offset Mapping', 'Fast Tokenizer Offsets', 'text-emerald-300', 'Character-exact article mapping'],
            ].map(([label, val, color, note]) => (
              <div key={label} className="p-3.5 rounded-xl bg-navy-950/80 border border-white/5 space-y-1">
                <span className="text-slate-500 text-[10px]">{label}</span>
                <p className={`font-mono font-bold text-xs ${color}`}>{val}</p>
                <p className="text-[11px] text-slate-400">{note}</p>
              </div>
            ))}
          </div>

          <div className="p-4 rounded-xl border border-white/5 bg-navy-950/60 text-xs text-slate-300 space-y-2">
            <strong className="text-slate-200 block">Understanding Attribution Polarity:</strong>
            <p className="text-slate-400 leading-relaxed">
              <span className="text-emerald-400 font-semibold">Positive attribution (+):</span>{' '}
              The token drove the model toward the predicted class (e.g. wire dateline punctuation supporting
              "Real", or sensational capitalization supporting "Fake").
            </p>
            <p className="text-slate-400 leading-relaxed">
              <span className="text-rose-400 font-semibold">Negative attribution (−):</span>{' '}
              The token resisted the classification, pushing the model toward the opposing class.
              These scores indicate model influence, not factual proof.
            </p>
          </div>
        </InfoCard>

        {/* ══════════════════════════════════════════
            8. Evaluation Metrics
        ══════════════════════════════════════════ */}
        <InfoCard
          icon={BarChart3}
          iconColor="text-blue-400"
          borderColor="border-blue-500/20"
          bgColor="bg-blue-500/10"
          title="Reported Evaluation Metrics"
          subtitle="Empirical results on random stratified ISOT test splits (7,817 held-out samples)"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="border-b border-white/10 text-slate-500 font-semibold uppercase tracking-wider text-[10px]">
                  {['Model Configuration', 'Accuracy', 'Macro Precision', 'Macro Recall', 'Macro F1'].map((h) => (
                    <th key={h} className="py-3 px-3 whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 text-slate-300">
                <tr className="hover:bg-white/[0.02]">
                  <td className="py-3 px-3 font-medium text-white whitespace-nowrap">TF-IDF + Logistic Regression</td>
                  <td className="py-3 px-3 font-mono">98.80%</td>
                  <td className="py-3 px-3 font-mono">0.9880</td>
                  <td className="py-3 px-3 font-mono">0.9880</td>
                  <td className="py-3 px-3 font-mono">0.9880</td>
                </tr>
                <tr className="hover:bg-white/[0.02]">
                  <td className="py-3 px-3 font-medium text-white whitespace-nowrap">RoBERTa Original (with "Reuters")</td>
                  <td className="py-3 px-3 font-mono text-blue-400 font-bold">100.00%</td>
                  <td className="py-3 px-3 font-mono text-blue-400">1.0000</td>
                  <td className="py-3 px-3 font-mono text-blue-400">1.0000</td>
                  <td className="py-3 px-3 font-mono text-blue-400">1.0000</td>
                </tr>
                <tr className="hover:bg-white/[0.02] bg-blue-500/[0.04]">
                  <td className="py-3 px-3 font-medium text-white whitespace-nowrap">
                    RoBERTa (Reuters word removed){' '}
                    <span className="text-[10px] ml-1 px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300">
                      Production
                    </span>
                  </td>
                  <td className="py-3 px-3 font-mono text-emerald-400 font-bold">99.97%</td>
                  <td className="py-3 px-3 font-mono text-emerald-400">0.9997</td>
                  <td className="py-3 px-3 font-mono text-emerald-400">0.9998</td>
                  <td className="py-3 px-3 font-mono text-emerald-400">0.9997</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 text-xs text-amber-200/90 leading-relaxed">
            <strong>Critical Academic Finding:</strong> These near-perfect in-distribution metrics do{' '}
            <strong>not</strong> establish real-world cross-publisher generalization. Empirical audit
            demonstrates that the model relies heavily on publisher stylistic signatures (wire-service
            datelines, editorial syntax) rather than semantic factual cues. Explainability tools are
            essential to uncover and document such dataset shortcut learning.
          </div>
        </InfoCard>

        {/* ══════════════════════════════════════════
            9. Limitations & Future Work
        ══════════════════════════════════════════ */}
        <InfoCard
          icon={ShieldAlert}
          iconColor="text-rose-400"
          borderColor="border-rose-500/20"
          bgColor="bg-rose-500/10"
          title="Limitations and Future Work"
          subtitle="Transparent documentation of research constraints and planned advancements"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
            <div className="space-y-3 p-4 rounded-xl bg-navy-950/60 border border-white/5">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <AlertTriangle size={14} className="text-rose-400" />
                Identified Limitations
              </h3>
              <ul className="space-y-2.5 text-slate-300 leading-relaxed">
                <li>
                  <strong className="text-white block">Publisher Monoculture:</strong>
                  100% of ISOT genuine articles originate from Reuters, introducing
                  wire-service formatting as a shortcut spurious correlation.
                </li>
                <li>
                  <strong className="text-white block">Limited Cross-Domain Transfer:</strong>
                  Out-of-distribution genuine news from BBC, AP, or independent
                  journalism can be falsely classified as Fake due to missing
                  dateline patterns.
                </li>
                <li>
                  <strong className="text-white block">Token Truncation:</strong>
                  The 256-token window analyzes only opening paragraphs, making the
                  system potentially vulnerable to late-article manipulations.
                </li>
              </ul>
            </div>

            <div className="space-y-3 p-4 rounded-xl bg-navy-950/60 border border-white/5">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Compass size={14} className="text-blue-400" />
                Future Work
              </h3>
              <ul className="space-y-2.5 text-slate-300 leading-relaxed">
                <li>
                  <strong className="text-white block">Source Credibility Feature Fusion:</strong>
                  As proposed in the project title — fusing domain authority, publisher
                  track record, and WHOIS metadata via a multimodal fusion layer.{' '}
                  <span className="text-amber-300 font-semibold">(Not yet implemented — future work.)</span>
                </li>
                <li>
                  <strong className="text-white block">Cross-Dataset Validation:</strong>
                  Benchmarking against independent datasets (LIAR, FakeNewsNet /
                  PolitiFact) to evaluate genuine semantic robustness.
                </li>
                <li>
                  <strong className="text-white block">Adversarial Retraining:</strong>
                  Retraining on publisher-scrubbed experimental datasets to compel
                  the model to learn content semantics over formatting artifacts.
                </li>
              </ul>
            </div>
          </div>
        </InfoCard>

        {/* ══════════════════════════════════════════
            10. Academic Disclaimer
        ══════════════════════════════════════════ */}
        <div className="rounded-2xl border border-white/10 bg-navy-900/60 backdrop-blur-xl p-8 text-center space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-white/10 flex items-center justify-center mx-auto text-blue-400">
            <BookOpen size={24} />
          </div>
          <h2 className="text-lg font-bold text-white">Academic Ethics &amp; Disclaimer</h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed max-w-2xl mx-auto">
            TruthLens is designed exclusively for university research and educational
            demonstration. Automated machine learning models must never be treated as sole
            arbiters of truth or used for censorship. Users are strongly advised to consult
            primary sources, peer-reviewed records, and established journalistic fact-checkers
            before drawing conclusions about contested claims.
          </p>
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 px-4 py-3 max-w-2xl mx-auto text-left">
            <p className="text-xs text-slate-400 leading-relaxed">
              <strong className="text-amber-300">Model score notice:</strong>{' '}
              The scores displayed by TruthLens represent the model's classification output.
              They are not verified probabilities that a news article is factually true.
              TruthLens is a research prototype and does not independently fact-check claims.
            </p>
          </div>
          <p className="text-[11px] text-slate-600">
            TruthLens Research Prototype • Explainable Transformer-Based Fake News Detection • 2026
          </p>
        </div>

      </div>
    </div>
  )
}
