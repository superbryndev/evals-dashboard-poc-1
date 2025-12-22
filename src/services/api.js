import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000, // 30 second timeout
});

// Request deduplication cache (prevents duplicate requests within 1 second)
const requestCache = new Map();
const CACHE_TTL = 1000; // 1 second

const getCacheKey = (method, url, params) => {
  const paramsStr = params ? JSON.stringify(params) : '';
  return `${method}:${url}:${paramsStr}`;
};

const deduplicateRequest = async (method, url, config = {}) => {
  const cacheKey = getCacheKey(method, url, config.params);
  const cached = requestCache.get(cacheKey);
  
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.promise;
  }
  
  const promise = api[method](url, config.data, config)
    .then(response => {
      // Remove from cache after request completes
      setTimeout(() => requestCache.delete(cacheKey), CACHE_TTL);
      return response;
    })
    .catch(error => {
      // Remove from cache on error
      requestCache.delete(cacheKey);
      throw error;
    });
  
  requestCache.set(cacheKey, {
    promise,
    timestamp: Date.now(),
  });
  
  return promise;
};

/**
 * Fetch batch details with all jobs and calls
 * @param {string} batchId - The batch UUID
 * @returns {Promise<Object>} Batch details response
 */
export const fetchBatchDetails = async (batchId) => {
  const response = await deduplicateRequest('get', `/api/v1/calls/batch/${batchId}/details`);
  return response.data;
};

/**
 * Fetch call analytics for a specific call
 * @param {string} callId - The call identifier
 * @returns {Promise<Object>} Call analytics response
 */
export const fetchCallAnalytics = async (callId) => {
  const response = await api.get(`/api/v1/calls/call/${callId}/analytics`);
  return response.data;
};

/**
 * Trigger LLM evaluation for a call
 * @param {string} callId - The call identifier
 * @param {boolean} forceRefresh - Force re-evaluation even if cached
 * @returns {Promise<Object>} Evaluation response
 */
export const evaluateCall = async (callId, forceRefresh = false) => {
  const response = await api.post(`/api/v1/calls/call/${callId}/evaluate`, {
    force_refresh: forceRefresh,
  });
  return response.data;
};

/**
 * Fetch job status
 * @param {string} jobId - The job UUID
 * @returns {Promise<Object>} Job status response
 */
export const fetchJobStatus = async (jobId) => {
  const response = await api.get(`/api/v1/calls/status/${jobId}`);
  return response.data;
};

/**
 * Fetch batch analysis results
 * @param {string} batchId - The batch UUID
 * @returns {Promise<Object>} Batch analysis response with summary and results
 */
export const fetchBatchAnalysis = async (batchId) => {
  const response = await api.get(`/api/v1/calls/batch/${batchId}/analysis`);
  return response.data;
};

/**
 * Fetch call analysis results
 * @param {string} callId - The call identifier
 * @returns {Promise<Object>} Call analysis response with pass/fail and CSAT score
 */
export const fetchCallAnalysis = async (callId) => {
  const response = await api.get(`/api/v1/calls/call/${callId}/analysis`);
  return response.data;
};

/**
 * Trigger analysis for a call
 * @param {string} callUuid - The call UUID (primary key from sim_calls_01.id)
 * @returns {Promise<Object>} Call analysis response with pass/fail and CSAT score
 */
export const triggerCallAnalysis = async (callUuid) => {
  const response = await api.post(`/api/v1/calls/call/${callUuid}/analyze`);
  return response.data;
};

export const triggerBatchAnalysis = async (batchId, forceRefresh = false) => {
  const response = await api.post(
    `/api/v1/calls/batch/${batchId}/analyze`,
    null,
    { params: { force_refresh: forceRefresh } }
  );
  return response.data;
};

export default api;

