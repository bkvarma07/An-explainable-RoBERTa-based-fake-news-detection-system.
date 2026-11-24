/**
 * API service — all backend calls live here.
 * The Vite dev proxy forwards /api/* → http://127.0.0.1:8000/*
 * So /api/predict → POST http://127.0.0.1:8000/predict
 * /api/upload → POST http://127.0.0.1:8000/upload
 */
import axios from 'axios'

// Standard prediction endpoint — fast (single forward pass on CPU ~1–5 s)
const predictApi = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000, // 30 s — model inference can be slow on CPU
})

// File upload endpoint — allows multipart form uploads with file extraction and prediction
const uploadApi = axios.create({
  baseURL: '/api',
  timeout: 45000, // 45 s — allows file upload + parsing + inference
})

// Explainability endpoint — Captum Layer Integrated Gradients requires
// 128 integration steps × internal_batch_size=16 forward passes on CPU,
// which can take 60–180 s for longer articles.
const explainApi = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
  timeout: 180000, // 180 s — allow sufficient time for IG on CPU
})

/**
 * POST /predict
 * @param {string} text — raw news article text
 * @returns {Promise<{
 *   prediction: 'Fake'|'Real',
 *   fake_probability: number,
 *   real_probability: number,
 *   tokens_processed: number,
 *   max_tokens: number,
 *   device?: string
 * }>}
 */
export async function predictNews(text) {
  const { data } = await predictApi.post('/predict', { text })
  return data
}

/**
 * POST /upload
 * Uploads a document file (.pdf, .docx, .txt), extracts text, and returns RoBERTa prediction.
 * @param {File} file — browser File object
 * @param {(progress: number) => void} [onProgress] — upload progress callback
 * @returns {Promise<{
 *   filename: string,
 *   file_type: string,
 *   file_size_bytes: number,
 *   extracted_text: string,
 *   word_count: number,
 *   char_count: number,
 *   prediction: 'Fake'|'Real',
 *   fake_probability: number,
 *   real_probability: number,
 *   tokens_processed: number,
 *   max_tokens: number,
 *   device?: string
 * }>}
 */
export async function uploadAndPredictNews(file, onProgress) {
  const formData = new FormData()
  formData.append('file', file)

  const { data } = await uploadApi.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (progressEvent) => {
      if (onProgress && progressEvent.total) {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total)
        onProgress(percentCompleted)
      }
    },
  })
  return data
}

/**
 * POST /extract-text
 * Extracts text from an uploaded file without running prediction.
 * @param {File} file — browser File object
 * @returns {Promise<{
 *   filename: string,
 *   file_type: string,
 *   file_size_bytes: number,
 *   extracted_text: string,
 *   word_count: number,
 *   char_count: number
 * }>}
 */
export async function extractTextFromFile(file) {
  const formData = new FormData()
  formData.append('file', file)

  const { data } = await uploadApi.post('/extract-text', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data
}

/**
 * POST /explain
 * @param {string} text — raw news article text
 * @returns {Promise<{
 *   prediction: 'Fake'|'Real',
 *   fake_probability: number,
 *   real_probability: number,
 *   predicted_class: number,
 *   tokens_processed: number,
 *   max_tokens: number,
 *   convergence_delta: number,
 *   device?: string,
 *   tokens: Array<{
 *     token: string,
 *     start_offset: number|null,
 *     end_offset: number|null,
 *     attribution_score: number
 *   }>
 * }>}
 */
export async function explainNews(text) {
  const { data } = await explainApi.post('/explain', { text })
  return data
}

/**
 * GET /health — check if the backend is reachable
 * @returns {Promise<{ status: string, model: string, model_loaded: boolean, captum_available: boolean, device?: string }>}
 */
export async function checkHealth() {
  const { data } = await predictApi.get('/health')
  return data
}
