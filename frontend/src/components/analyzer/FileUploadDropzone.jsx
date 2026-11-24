/**
 * FileUploadDropzone — drag-and-drop file upload component for the Analyzer page.
 * Supports PDF, DOCX, TXT files with visual drag feedback, file info display,
 * upload progress bar, and error handling.
 *
 * Design: matches existing TruthLens dark navy/blue/violet glass morphism theme.
 */
import { useRef, useState, useCallback } from 'react'
import {
  Upload,
  FileText,
  FileType2,
  X,
  Loader2,
  CheckCircle2,
  ScanText,
} from 'lucide-react'
import { formatFileSize } from '../../hooks/useFileUpload'

/** Badge color per file type */
const TYPE_BADGE_STYLES = {
  PDF:  'bg-red-500/15 border-red-500/30 text-red-400',
  DOCX: 'bg-blue-500/15 border-blue-500/30 text-blue-400',
  TXT:  'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
}

export default function FileUploadDropzone({
  file,
  fileInfo,
  uploadProgress,
  isUploading,
  hasFile,
  error,
  onFileSelect,
  onFileDrop,
  onRemoveFile,
  onUpload,
  onDismissError,
}) {
  const inputRef = useRef(null)
  const [isDragging, setIsDragging] = useState(false)

  // ── Drag Handlers ──
  const handleDragEnter = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragOver = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e) => {
    e.preventDefault()
    e.stopPropagation()
    // Only leave if actually exiting the drop zone
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setIsDragging(false)
    }
  }, [])

  const handleDrop = useCallback((e) => {
    setIsDragging(false)
    onFileDrop(e)
  }, [onFileDrop])

  // ── Click to browse ──
  const handleBrowseClick = useCallback(() => {
    inputRef.current?.click()
  }, [])

  const handleInputChange = useCallback((e) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      onFileSelect(selectedFile)
    }
    // Reset input so the same file can be re-selected
    e.target.value = ''
  }, [onFileSelect])

  const badgeStyle = fileInfo
    ? TYPE_BADGE_STYLES[fileInfo.typeBadge] ?? 'bg-slate-500/15 border-slate-500/30 text-slate-400'
    : ''

  return (
    <div className="space-y-4">
      {/* ── Hidden file input ── */}
      <input
        ref={inputRef}
        type="file"
        accept=".pdf,.docx,.txt"
        onChange={handleInputChange}
        className="hidden"
        aria-hidden="true"
      />

      {/* ── Drop zone ── */}
      {!hasFile && !isUploading && (
        <div
          onDragEnter={handleDragEnter}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={handleBrowseClick}
          className={`
            relative cursor-pointer rounded-2xl border-2 border-dashed
            transition-all duration-300 ease-out
            ${isDragging
              ? 'border-blue-400 bg-blue-500/10 shadow-lg shadow-blue-500/10 scale-[1.01]'
              : 'border-white/15 bg-white/[0.02] hover:border-white/25 hover:bg-white/[0.04]'
            }
          `}
          role="button"
          tabIndex={0}
          aria-label="Drop an article file here or click to browse"
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleBrowseClick() }}
        >
          <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
            {/* Upload icon */}
            <div className={`
              w-16 h-16 rounded-2xl flex items-center justify-center mb-5
              transition-all duration-300
              ${isDragging
                ? 'bg-gradient-to-br from-blue-500 to-violet-600 shadow-xl shadow-blue-900/40'
                : 'bg-gradient-to-br from-blue-500/20 to-violet-600/20 border border-white/10'
              }
            `}>
              <Upload
                size={28}
                className={`transition-colors duration-300 ${isDragging ? 'text-white' : 'text-blue-400'}`}
              />
            </div>

            {/* Primary text */}
            <p className="text-white font-semibold text-sm mb-1.5">
              {isDragging ? 'Drop your file here' : 'Drag & drop an article file here'}
            </p>

            {/* Separator */}
            <div className="flex items-center gap-3 my-3 w-full max-w-xs">
              <div className="flex-1 border-t border-white/10" />
              <span className="text-xs text-slate-500 font-medium">or</span>
              <div className="flex-1 border-t border-white/10" />
            </div>

            {/* Browse button */}
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); handleBrowseClick() }}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl
                         bg-gradient-to-r from-blue-600 to-violet-600
                         hover:from-blue-500 hover:to-violet-500
                         text-white text-sm font-semibold
                         shadow-lg shadow-blue-900/40
                         transition-all duration-200 hover:shadow-xl hover:shadow-blue-900/50"
            >
              <FileText size={15} />
              Browse Files
            </button>

            {/* Supported formats */}
            <div className="flex items-center gap-2 mt-5">
              {[
                { label: 'PDF', style: TYPE_BADGE_STYLES.PDF },
                { label: 'DOCX', style: TYPE_BADGE_STYLES.DOCX },
                { label: 'TXT', style: TYPE_BADGE_STYLES.TXT },
              ].map(({ label, style }) => (
                <span
                  key={label}
                  className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold
                              border uppercase tracking-wider ${style}`}
                >
                  {label}
                </span>
              ))}
            </div>

            <p className="text-xs text-slate-600 mt-3">
              Maximum file size: 10 MB
            </p>
          </div>
        </div>
      )}

      {/* ── Selected file info ── */}
      {(hasFile || isUploading) && fileInfo && (
        <div
          className="rounded-2xl border border-white/10 overflow-hidden"
          style={{ background: 'rgba(10,22,40,0.6)', backdropFilter: 'blur(12px)' }}
        >
          <div className="p-5">
            <div className="flex items-center gap-4">
              {/* File type icon */}
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
                              border ${badgeStyle}`}>
                <FileType2 size={22} />
              </div>

              {/* File details */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-white truncate">
                  {fileInfo.name}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px]
                                    font-bold border uppercase tracking-wider ${badgeStyle}`}>
                    {fileInfo.typeBadge}
                  </span>
                  <span className="text-xs text-slate-500">
                    {fileInfo.formattedSize}
                  </span>
                </div>
              </div>

              {/* Remove button (only when not uploading) */}
              {!isUploading && (
                <button
                  onClick={onRemoveFile}
                  className="p-2 rounded-lg text-slate-500 hover:text-red-400
                             hover:bg-red-500/10 transition-all duration-200 flex-shrink-0"
                  aria-label="Remove file"
                >
                  <X size={16} />
                </button>
              )}
            </div>

            {/* ── Upload progress bar ── */}
            {isUploading && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Loader2 size={12} className="animate-spin text-blue-400" />
                    {uploadProgress < 100
                      ? 'Uploading and extracting text…'
                      : 'Running RoBERTa inference…'
                    }
                  </span>
                  <span className="text-slate-500 tabular-nums font-medium">
                    {uploadProgress}%
                  </span>
                </div>
                <div className="h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-violet-500 transition-all duration-300 ease-out"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* ── Analyze button ── */}
          {hasFile && !isUploading && (
            <div className="border-t border-white/5 px-5 py-4">
              <button
                onClick={onUpload}
                className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3
                           rounded-xl bg-gradient-to-r from-blue-600 to-violet-600
                           hover:from-blue-500 hover:to-violet-500
                           text-white text-sm font-semibold
                           shadow-lg shadow-blue-900/40
                           transition-all duration-200 hover:shadow-xl hover:shadow-blue-900/50
                           active:scale-[0.98]"
              >
                <ScanText size={16} />
                Analyze Article
              </button>
            </div>
          )}
        </div>
      )}

      {/* ── Inline error ── */}
      {error && (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3.5 animate-fade-in"
        >
          <X size={17} className="text-red-400 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-red-300 leading-relaxed flex-1">{error}</p>
          {onDismissError && (
            <button
              onClick={onDismissError}
              className="text-red-400/60 hover:text-red-300 transition-colors flex-shrink-0 p-0.5 rounded"
              aria-label="Dismiss error"
            >
              <X size={15} />
            </button>
          )}
        </div>
      )}
    </div>
  )
}
