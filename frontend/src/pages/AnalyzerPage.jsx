/**
 * AnalyzerPage — /analyze
 * Assembles the News Analyzer UI with two input modes:
 *   1. Paste Article — existing manual text input
 *   2. Upload File  — drag-and-drop / browse file upload
 * Both share the same result display area (ResultCard).
 * All logic lives in useAnalyzer() and useFileUpload(); components are purely presentational.
 */
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ScanText, History, Sparkles, FileText, Upload, FileType2, ChevronDown } from 'lucide-react'
import { useAnalyzer, STATES } from '../hooks/useAnalyzer'
import { useFileUpload, UPLOAD_STATES } from '../hooks/useFileUpload'
import SectionLabel from '../components/ui/SectionLabel'
import GradientOrbs from '../components/ui/GradientOrbs'
import ArticleInput from '../components/analyzer/ArticleInput'
import FileUploadDropzone from '../components/analyzer/FileUploadDropzone'
import ResultCard from '../components/analyzer/ResultCard'
import LoadingState from '../components/analyzer/LoadingState'
import ErrorBanner from '../components/analyzer/ErrorBanner'
import DisclaimerNote from '../components/analyzer/DisclaimerNote'
import IsotSampleSelector from '../components/common/IsotSampleSelector'

const INPUT_TABS = [
  { id: 'paste', label: 'Paste Article', icon: FileText },
  { id: 'upload', label: 'Upload File', icon: Upload },
]

export default function AnalyzerPage() {
  const [activeTab, setActiveTab] = useState('paste')

  // ── Paste mode state ──
  const {
    text,
    status,
    result,
    error,
    elapsedMs,
    wordCount,
    charCount,
    maxChars,
    isTooShort,
    isLoading,
    isSuccess,
    handleTextChange,
    handleSelectSample,
    handleSubmit,
    handleReset,
    handleDismissError,
  } = useAnalyzer()

  // ── Upload mode state ──
  const upload = useFileUpload()

  // Determine which mode is showing results
  const pasteShowInput  = activeTab === 'paste' && !isLoading && !isSuccess
  const pasteShowResult = activeTab === 'paste' && isSuccess && result

  const uploadShowInput  = activeTab === 'upload' && !upload.isUploading && !upload.isSuccess
  const uploadShowResult = activeTab === 'upload' && upload.isSuccess && upload.result

  const showAnyResult = pasteShowResult || uploadShowResult
  const activeResult = pasteShowResult ? result : upload.result
  const activeElapsedMs = pasteShowResult ? elapsedMs : upload.elapsedMs
  const activeText = pasteShowResult ? text : upload.extractedText

  // Reset handler for the active mode
  const handleActiveReset = () => {
    if (activeTab === 'paste') {
      handleReset()
    } else {
      upload.handleReset()
    }
  }

  return (
    <div className="relative min-h-screen pt-28 pb-20 overflow-hidden">
      {/* Background orbs — same as homepage for visual consistency */}
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

      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Page Header ── */}
        <div className="text-center mb-10">
          <SectionLabel className="mb-4">
            <ScanText size={12} />
            RoBERTa-Powered Analysis
          </SectionLabel>

          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mt-4 mb-4 leading-tight">
            Analyze{' '}
            <span className="gradient-text">News</span>
          </h1>

          <p className="text-slate-400 text-base sm:text-lg leading-relaxed max-w-xl mx-auto">
            Paste the full body of a news article or upload a document file. The fine-tuned RoBERTa
            model will classify its linguistic style as{' '}
            <strong className="text-slate-200 font-semibold">Fake</strong> or{' '}
            <strong className="text-slate-200 font-semibold">Real</strong> and return
            model prediction scores.
          </p>
        </div>

        {/* ── Error Banner (shown above both states — paste mode only) ── */}
        {activeTab === 'paste' && error && (
          <div className="mb-5">
            <ErrorBanner message={error} onDismiss={handleDismissError} />
          </div>
        )}

        {/* ── Input Mode Tabs ── */}
        {!showAnyResult && !isLoading && !upload.isUploading && (
          <div className="flex items-center gap-1 mb-6 p-1 rounded-xl border border-white/10 bg-white/[0.03] w-fit mx-auto">
            {INPUT_TABS.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`
                  inline-flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold
                  transition-all duration-200
                  ${activeTab === id
                    ? 'bg-gradient-to-r from-blue-600/90 to-violet-600/90 text-white shadow-lg shadow-blue-900/30'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
                  }
                `}
              >
                <Icon size={15} />
                {label}
              </button>
            ))}
          </div>
        )}

        {/* ── PASTE MODE: Input panel ── */}
        {pasteShowInput && (
          <div
            className="rounded-2xl border border-white/10 overflow-hidden mb-6"
            style={{ background: 'rgba(10,22,40,0.75)', backdropFilter: 'blur(16px)' }}
          >
            {/* Panel header */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-white/5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600
                              flex items-center justify-center shadow-lg shadow-blue-900/40">
                <ScanText size={15} className="text-white" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">Article Input</h2>
                <p className="text-xs text-slate-500">Paste the full article body — headlines alone are not enough</p>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <DisclaimerNote />

              <ArticleInput
                text={text}
                wordCount={wordCount}
                charCount={charCount}
                maxChars={maxChars}
                isTooShort={isTooShort}
                isLoading={isLoading}
                onChange={handleTextChange}
                onSubmit={handleSubmit}
                onClear={handleReset}
              />
            </div>
          </div>
        )}

        {/* ── PASTE MODE: ISOT Dataset Sample Selector ── */}
        {pasteShowInput && (
          <div className="mb-8">
            <IsotSampleSelector
              onSelectSample={handleSelectSample}
              currentText={text}
              disabled={isLoading}
            />
          </div>
        )}

        {/* ── UPLOAD MODE: File Upload Panel ── */}
        {activeTab === 'upload' && !upload.isSuccess && (
          <div
            className="rounded-2xl border border-white/10 overflow-hidden mb-6"
            style={{ background: 'rgba(10,22,40,0.75)', backdropFilter: 'blur(16px)' }}
          >
            {/* Panel header */}
            <div className="flex items-center gap-3 px-6 py-4 border-b border-white/5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600
                              flex items-center justify-center shadow-lg shadow-blue-900/40">
                <Upload size={15} className="text-white" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-white">Upload Article</h2>
                <p className="text-xs text-slate-500">Upload a PDF, Word, or Text file for analysis</p>
              </div>
            </div>

            <div className="p-6 space-y-5">
              <DisclaimerNote />

              <FileUploadDropzone
                file={upload.file}
                fileInfo={upload.fileInfo}
                uploadProgress={upload.uploadProgress}
                isUploading={upload.isUploading}
                hasFile={upload.hasFile}
                error={upload.error}
                onFileSelect={upload.handleFileSelect}
                onFileDrop={upload.handleFileDrop}
                onRemoveFile={upload.handleRemoveFile}
                onUpload={upload.handleUploadAndPredict}
                onDismissError={upload.handleDismissError}
              />
            </div>
          </div>
        )}

        {/* ── Loading State (paste mode) ── */}
        {activeTab === 'paste' && isLoading && (
          <div className="mb-6">
            <LoadingState />
          </div>
        )}

        {/* ── Loading State (upload mode — show when file is uploading) ── */}
        {activeTab === 'upload' && upload.isUploading && !upload.hasFile && (
          <div className="mb-6">
            <LoadingState />
          </div>
        )}

        {/* ── Result Card (shared by both modes) ── */}
        {showAnyResult && (
          <div className="mb-4">
            <ResultCard result={activeResult} elapsedMs={activeElapsedMs} onReset={handleActiveReset} />
          </div>
        )}

        {/* ── Upload file metadata (shown after upload success) ── */}
        {uploadShowResult && upload.result && (
          <div
            className="rounded-2xl border border-white/5 overflow-hidden mb-4"
            style={{ background: 'rgba(10,22,40,0.5)' }}
          >
            <div className="px-5 py-4">
              <div className="flex items-center gap-3 mb-3">
                <FileType2 size={16} className="text-blue-400" />
                <h3 className="text-sm font-semibold text-white">Uploaded File Details</h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { label: 'Filename', value: upload.result.filename },
                  { label: 'File Type', value: upload.result.file_type },
                  { label: 'Words Extracted', value: upload.result.word_count?.toLocaleString() },
                  { label: 'Characters', value: upload.result.char_count?.toLocaleString() },
                ].map(({ label, value }) => (
                  <div key={label} className="rounded-lg border border-white/5 px-3 py-2.5 bg-white/[0.02]">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider font-medium mb-0.5">{label}</p>
                    <p className="text-xs text-slate-300 font-medium truncate">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── History & Explain links ── */}
        {showAnyResult && (
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 px-1">
            <span className="text-xs text-slate-500">
              Analysis automatically archived in your Results Dashboard.
            </span>
            <div className="flex items-center gap-4">
              <Link
                to="/explainability"
                state={{ text: activeText }}
                className="text-xs font-semibold text-violet-400 hover:text-violet-300 inline-flex items-center gap-1.5 transition-colors"
              >
                <Sparkles size={13} />
                <span>Explain with XAI &rarr;</span>
              </Link>
              <Link
                to="/results"
                className="text-xs font-semibold text-blue-400 hover:text-blue-300 inline-flex items-center gap-1.5 transition-colors"
              >
                <History size={13} />
                <span>Open Dashboard &rarr;</span>
              </Link>
            </div>
          </div>
        )}

        {/* ── After result: show the analyzed article text for reference ── */}
        {showAnyResult && activeText && (
          <details className="group rounded-2xl border border-white/5 overflow-hidden"
                   style={{ background: 'rgba(10,22,40,0.5)' }}>
            <summary
              className="flex items-center justify-between px-5 py-3.5 cursor-pointer
                         text-sm text-slate-400 hover:text-white select-none
                         transition-colors duration-200 list-none"
            >
              <span className="font-medium">View analyzed article text</span>
              <ChevronDown
                size={16}
                className="transition-transform duration-200 group-open:rotate-180"
              />
            </summary>
            <div className="border-t border-white/5 px-5 py-4">
              <p className="text-xs text-slate-500 leading-relaxed whitespace-pre-wrap break-words font-mono">
                {activeText}
              </p>
            </div>
          </details>
        )}

        {/* ── Bottom help text ── */}
        <p className="text-center text-xs text-slate-600 mt-8 leading-relaxed">
          Backend endpoint: <code className="text-slate-500">POST /api/predict</code> →
          proxied to <code className="text-slate-500">http://127.0.0.1:8000/predict</code>
          {activeTab === 'upload' && (
            <>
              {' '}| <code className="text-slate-500">POST /api/upload</code> →
              proxied to <code className="text-slate-500">http://127.0.0.1:8000/upload</code>
            </>
          )}
        </p>

      </div>
    </div>
  )
}
