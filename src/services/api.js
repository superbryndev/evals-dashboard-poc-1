import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

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

/**
 * Retry a failed job by creating a new job with the same scenario
 * @param {string} jobId - The job UUID to retry
 * @returns {Promise<Object>} Retry response with new job_id
 */
export const retryJob = async (jobId) => {
  const response = await api.post(`/api/v1/calls/job/${jobId}/retry`);
  return response.data;
};

// ==================== INBOUND SIMULATION API ====================

/**
 * Get available phone numbers for inbound calls
 * @param {string} countryCode - Optional country code filter (e.g., 'IN', 'US')
 * @returns {Promise<Object>} Phone numbers with availability status
 */
export const getPhoneNumbers = async (countryCode = null) => {
  const params = countryCode ? { country_code: countryCode } : {};
  const response = await api.get('/api/v1/calls/telephony/numbers', { params });
  return response.data;
};

/**
 * Create an inbound simulation batch
 * @param {Object} batchData - Batch creation data
 * @param {Array} batchData.scenarios - Array of scenarios
 * @param {string} batchData.outbound_agent_phone_number - Phone number of calling agent
 * @param {number} batchData.max_concurrent_calls - Max concurrent calls (default: 5)
 * @param {number} batchData.priority - Priority level 1-10 (default: 5)
 * @param {number} batchData.max_duration_seconds - Max call duration (default: 300)
 * @param {number} batchData.max_turns - Max conversation turns (default: 20)
 * @returns {Promise<Object>} Batch creation response with batch_id
 */
export const createInboundBatch = async (batchData) => {
  const response = await api.post('/api/v1/calls/inbound/batch', batchData);
  return response.data;
};

/**
 * Get inbound batch status
 * @param {string} batchId - The batch UUID
 * @returns {Promise<Object>} Batch status with job counts
 */
export const getInboundBatchStatus = async (batchId) => {
  const response = await api.get(`/api/v1/calls/inbound/batch/${batchId}/status`);
  return response.data;
};

/**
 * Activate jobs in an inbound batch
 * @param {string} batchId - The batch UUID
 * @param {Array<string>} jobIds - Array of job IDs to activate
 * @param {string} countryCode - Optional country code filter (e.g., 'IN', 'US')
 * @returns {Promise<Object>} Activation response with assigned phone numbers
 */
export const activateInboundJobs = async (batchId, jobIds, countryCode = null) => {
  const params = countryCode ? { country_code: countryCode } : {};
  const response = await api.post(`/api/v1/calls/inbound/batch/${batchId}/activate`, {
    job_ids: jobIds,
  }, { params });
  return response.data;
};

/**
 * Deactivate jobs in an inbound batch
 * @param {string} batchId - The batch UUID
 * @param {Array<string>} jobIds - Array of job IDs to deactivate
 * @returns {Promise<Object>} Deactivation response with released phone numbers
 */
export const deactivateInboundJobs = async (batchId, jobIds) => {
  const response = await api.post(`/api/v1/calls/inbound/batch/${batchId}/deactivate`, {
    job_ids: jobIds,
  });
  return response.data;
};

/**
 * Get jobs for an inbound batch
 * @param {string} batchId - The batch UUID
 * @param {Object} params - Query parameters
 * @param {string} params.status - Filter by status (active, inactive, completed, etc.)
 * @param {number} params.limit - Number of results per page (default: 50)
 * @param {number} params.page - Page number (default: 1)
 * @returns {Promise<Object>} Jobs list with pagination
 */
export const getInboundBatchJobs = async (batchId, params = {}) => {
  const response = await api.get(`/api/v1/calls/inbound/batch/${batchId}/jobs`, { params });
  return response.data;
};

/**
 * Free a phone number for inbound simulation.
 * This will deactivate any active jobs on the number (in inbound batches)
 * but will fail if there is any in-progress job on that number.
 *
 * @param {string} phoneNumber - The phone number to free (E.164 format)
 * @returns {Promise<Object>} Free-number response
 */
export const freePhoneNumber = async (phoneNumber) => {
  const response = await api.post('/api/v1/calls/telephony/numbers/free', {
    phone_number: phoneNumber,
  });
  return response.data;
};

/**
 * Get list of all inbound batches
 * @param {Object} params - Query parameters
 * @param {number} params.limit - Number of results per page
 * @param {number} params.page - Page number
 * @returns {Promise<Object>} Batches list with pagination
 */
export const getInboundBatches = async (params = {}) => {
  const response = await api.get('/api/v1/calls/inbound/batches', { params });
  return response.data;
};

// ==================== PAYLOAD GENERATION API ====================

/**
 * Generate AI payloads for all jobs in a batch
 * @param {string} batchId - The batch UUID
 * @param {Array} fieldDefinitions - Array of field definitions
 * @param {boolean} regenerateExisting - Whether to regenerate existing payloads
 * @returns {Promise<Object>} Generation result with counts and errors
 */
export const generateBatchPayloads = async (batchId, fieldDefinitions, regenerateExisting = false) => {
  const response = await api.post(`/api/v1/calls/batch/${batchId}/generate-payloads`, {
    field_definitions: fieldDefinitions,
    regenerate_existing: regenerateExisting,
  });
  return response.data;
};

/**
 * Get generated payload for a specific job
 * @param {string} jobId - The job UUID
 * @returns {Promise<Object>} Job payload response
 */
export const getJobPayload = async (jobId) => {
  const response = await api.get(`/api/v1/calls/job/${jobId}/payload`);
  return response.data;
};

/**
 * Get all generated payloads for a batch (for bulk download)
 * @param {string} batchId - The batch UUID
 * @returns {Promise<Object>} Batch payloads response
 */
export const getBatchPayloads = async (batchId) => {
  const response = await api.get(`/api/v1/calls/batch/${batchId}/payloads`);
  return response.data;
};

export default api;

