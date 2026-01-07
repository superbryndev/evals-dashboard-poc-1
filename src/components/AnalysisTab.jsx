import React, { useState, useEffect, useCallback } from 'react';
import styled from '@emotion/styled';
import { fetchBatchAnalysis, fetchBatchDetails, triggerCallAnalysis, triggerBatchAnalysis } from '../services/api';
import AnalysisSummaryCard from './AnalysisSummaryCard';
import CallAnalysisCard from './CallAnalysisCard';
import LoadingSpinner from './LoadingSpinner';
import ErrorMessage from './ErrorMessage';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
`;

const CallsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-xl);
  background: var(--color-bg-secondary);
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-lg);
  color: var(--color-muted);
  text-align: center;
  
  h3 {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: var(--space-sm);
  }
  
  p {
    font-size: 0.875rem;
  }
`;

const RefreshButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover:not(:disabled) {
    background: var(--color-bg-tertiary);
    border-color: var(--color-accent);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  svg {
    width: 16px;
    height: 16px;
    transition: transform var(--transition-normal);
  }
  
  &.loading svg {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const ReAnalyzeButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  background: var(--color-accent);
  border: none;
  border-radius: var(--radius-md);
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover:not(:disabled) {
    background: var(--color-accent-hover);
    transform: translateY(-1px);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
  
  &.loading svg {
    animation: spin 1s linear infinite;
  }
`;

const HeaderRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const RefreshIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23,4 23,10 17,10" />
    <polyline points="1,20 1,14 7,14" />
    <path d="m3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
);

const AnalysisTab = ({ batchId }) => {
  const [analysisData, setAnalysisData] = useState(null);
  const [batchDetails, setBatchDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [reAnalyzing, setReAnalyzing] = useState(false);
  const [reAnalyzeProgress, setReAnalyzeProgress] = useState({ current: 0, total: 0 });
  const [error, setError] = useState(null);

  const loadAnalysis = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      // Fetch both analysis results and batch details (to get calls without analysis)
      const [analysisDataResult, batchDetailsResult] = await Promise.all([
        fetchBatchAnalysis(batchId).catch(err => {
          // If analysis endpoint fails, return empty data
          console.warn('Failed to fetch batch analysis:', err);
          return { summary: { passed_count: 0, failed_count: 0, pending_count: 0, avg_csat: null }, results: [] };
        }),
        fetchBatchDetails(batchId).catch(err => {
          console.warn('Failed to fetch batch details:', err);
          // Return empty structure instead of null to prevent errors
          return { jobs: [] };
        }),
      ]);
      
      setAnalysisData(analysisDataResult);
      setBatchDetails(batchDetailsResult);
      
      // Update progress if re-analyzing
      if (reAnalyzing && analysisDataResult && analysisDataResult.results) {
        const analyzedCount = analysisDataResult.results.length;
        setReAnalyzeProgress(prev => {
          if (prev.total > 0) {
            return { ...prev, current: analyzedCount };
          }
          return prev;
        });
      }
    } catch (err) {
      console.error('Failed to load analysis data:', err);
      setError(err.response?.data?.detail || err.message || 'Failed to load analysis');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [batchId]);

  useEffect(() => {
    loadAnalysis();
  }, [loadAnalysis]);

  const handleRefresh = () => {
    loadAnalysis(true);
  };

  const handleExpandCall = (callId) => {
    // Could fetch detailed call analysis here if needed
    console.log('Expanding call:', callId);
  };
  
  const handleAnalyze = async (callId, analysisResult) => {
    // Refresh analysis data after analysis completes
    await loadAnalysis(true);
  };

  const handleReAnalyzeBatch = async () => {
    if (!batchId) {
      if (window.showToast) {
        window.showToast('Batch ID not available.', 'error');
      }
      return;
    }

    setReAnalyzing(true);
    setError(null);
    setReAnalyzeProgress({ current: 0, total: 0 });

    try {
      // Use the new batch analysis endpoint with exponential backoff
      const result = await triggerBatchAnalysis(batchId, true); // force_refresh = true
      
      if (result.status === 'no_calls') {
        if (window.showToast) {
          window.showToast('No completed calls found in this batch to analyze.', 'warning');
        }
        setReAnalyzing(false);
        return;
      }
      
      // Set initial progress
      setReAnalyzeProgress({ current: 0, total: result.total_calls });
      
      // Refresh analysis data periodically to show progress
      // Poll every 3 seconds for updates (more frequent for better UX)
      let pollCount = 0;
      const maxPolls = 100; // Stop after ~5 minutes (100 * 3 seconds)
      
      const pollInterval = setInterval(async () => {
        try {
          // Fetch fresh analysis data directly
          const freshAnalysis = await fetchBatchAnalysis(batchId).catch(() => ({
            summary: { passed_count: 0, failed_count: 0, pending_count: 0, avg_csat: null },
            results: []
          }));
          
          setAnalysisData(freshAnalysis);
          
          // Update progress based on how many calls now have analysis
          if (freshAnalysis && freshAnalysis.results) {
            const analyzedCount = freshAnalysis.results.length;
            setReAnalyzeProgress(prev => ({
              ...prev,
              current: analyzedCount,
            }));
            
            // If all calls are analyzed, stop polling
            if (analyzedCount >= result.total_calls) {
              clearInterval(pollInterval);
              setReAnalyzing(false);
              setReAnalyzeProgress({ current: 0, total: 0 });
            }
          }
          
          pollCount++;
          if (pollCount >= maxPolls) {
            clearInterval(pollInterval);
            setReAnalyzing(false);
            setReAnalyzeProgress({ current: 0, total: 0 });
          }
        } catch (err) {
          console.error('Error polling for analysis updates:', err);
        }
      }, 3000);
      
    } catch (err) {
      console.error('Failed to trigger batch analysis:', err);
      setError(err.response?.data?.detail || err.message || 'Failed to trigger batch analysis');
      setReAnalyzing(false);
      setReAnalyzeProgress({ current: 0, total: 0 });
    }
  };

  if (loading) {
    return <LoadingSpinner message="Loading analysis results..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={() => loadAnalysis()} />;
  }

  if (!analysisData) {
    return (
      <EmptyState>
        <h3>No Analysis Data</h3>
        <p>Analysis results will appear here once calls are completed and analyzed.</p>
      </EmptyState>
    );
  }

  const { summary, results = [] } = analysisData || { summary: { passed_count: 0, failed_count: 0, pending_count: 0, avg_csat: null }, results: [] };
  
  // Helper function to determine if a call is ready for analysis
  // Checks analytics outcome first, then falls back to call/job status
  const isCallReadyForAnalysis = (call, job) => {
    // First, check if analytics exists and has outcome === "completed"
    const callAnalytics = call?.analytics || {};
    const rawAnalytics = typeof callAnalytics === 'object' ? callAnalytics : {};
    
    // Check for outcome in analytics (handle nested structures)
    const analyticsOutcome = callAnalytics?.outcome || rawAnalytics?.outcome;
    
    if (analyticsOutcome === 'completed') {
      return true;
    }
    
    // If analytics exists but outcome is not "completed", don't include it
    // (unless it's explicitly null/undefined, meaning analytics might not be fully loaded)
    if (callAnalytics && Object.keys(callAnalytics).length > 0 && analyticsOutcome !== null && analyticsOutcome !== undefined) {
      return false;
    }
    
    // Fall back to call/job status if analytics is not present or doesn't have outcome
    return call?.status === 'completed' || job?.status === 'completed';
  };
  
  // Build a map of calls with analysis
  // Map by both call_id (SIP call ID) and call_uuid (if available) for better matching
  const callsWithAnalysis = new Map();
  const callsWithAnalysisByUuid = new Map();
  results.forEach(result => {
    if (result.call_id) {
      callsWithAnalysis.set(result.call_id, result);
    }
    // Also map by UUID if available
    if (result.call_uuid) {
      callsWithAnalysisByUuid.set(result.call_uuid, result);
    }
  });
  
  // Get calls without analysis from batch details
  // Handle both inbound and outbound batch structures
  const callsWithoutAnalysis = [];
  const jobs = batchDetails?.jobs || [];
  
  if (batchDetails && jobs.length > 0) {
    jobs.forEach(job => {
      if (job.call && job.call.id) {
        const callUuid = job.call.id; // Use UUID (id field) instead of call_id
        const sipCallId = job.call.call_id; // Keep SIP call_id for display
        
        // Check if call is ready for analysis using analytics outcome first
        // Only include calls that don't already have analysis results
        // Check both sipCallId and callUuid in case the mapping uses different identifiers
        const hasAnalysis = callsWithAnalysis.has(sipCallId) || 
                           callsWithAnalysisByUuid.has(callUuid);
        
        if (isCallReadyForAnalysis(job.call, job) && !hasAnalysis) {
          callsWithoutAnalysis.push({
            id: callUuid, // UUID for API call
            call_id: sipCallId, // SIP call_id for display
            job_id: job.job_id,
            status: job.call.status,
          });
        }
      }
    });
  }
  
  const allCalls = [
    ...results,
    ...callsWithoutAnalysis.map(call => ({ 
      call_id: call.call_id, // SIP call_id for display
      id: call.id, // UUID for API calls
      job_id: call.job_id 
    })),
  ];

  return (
    <Container>
      <HeaderRow>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--color-text-primary)' }}>
          Call Analysis
        </h2>
        <div style={{ display: 'flex', gap: 'var(--space-sm)', alignItems: 'center', flexWrap: 'wrap' }}>
          {reAnalyzing && (
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 'var(--space-sm)',
              padding: 'var(--space-xs) var(--space-sm)',
              background: 'rgba(59, 130, 246, 0.1)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: 'var(--radius-md)',
              fontSize: '0.875rem',
              color: 'var(--color-text-primary)'
            }}>
              <svg 
                style={{ 
                  width: '16px', 
                  height: '16px', 
                  animation: 'spin 1s linear infinite' 
                }} 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2"
              >
                <path d="M21 12a9 9 0 11-6.219-8.56"/>
              </svg>
              <span>
                <strong>Re-analyzing:</strong> {reAnalyzeProgress.current}/{reAnalyzeProgress.total} calls
                {reAnalyzeProgress.total > 0 && (
                  <span style={{ marginLeft: 'var(--space-xs)', color: 'var(--color-muted)', fontWeight: 'normal' }}>
                    ({Math.round((reAnalyzeProgress.current / reAnalyzeProgress.total) * 100)}%)
                  </span>
                )}
              </span>
            </div>
          )}
          <ReAnalyzeButton 
            onClick={handleReAnalyzeBatch} 
            disabled={reAnalyzing || refreshing}
            className={reAnalyzing ? 'loading' : ''}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="23,4 23,10 17,10" />
              <polyline points="1,20 1,14 7,14" />
              <path d="m3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
            </svg>
            {reAnalyzing ? 'Re-analyzing...' : 'Re-analyze Batch'}
          </ReAnalyzeButton>
          <RefreshButton 
            onClick={handleRefresh} 
            disabled={refreshing || reAnalyzing}
            className={refreshing ? 'loading' : ''}
          >
            <RefreshIcon />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </RefreshButton>
        </div>
      </HeaderRow>
      
      <AnalysisSummaryCard summary={summary} />
      
      {allCalls.length === 0 ? (
        <EmptyState>
          <h3>No Calls Found</h3>
          <p>No calls found for this batch.</p>
        </EmptyState>
      ) : (
        <CallsList>
          {results.map((result) => (
            <CallAnalysisCard
              key={result.call_id}
              result={result}
              callId={result.call_uuid || result.call_id}
              callIdDisplay={result.call_id}
              onAnalyze={handleAnalyze}
              onExpand={handleExpandCall}
            />
          ))}
          {callsWithoutAnalysis.map((call) => (
            <CallAnalysisCard
              key={call.id || call.call_id}
              result={null}
              callId={call.id} // Pass UUID instead of SIP call_id
              callIdDisplay={call.call_id} // SIP call_id for display
              onAnalyze={handleAnalyze}
              onExpand={handleExpandCall}
            />
          ))}
        </CallsList>
      )}
    </Container>
  );
};

export default AnalysisTab;

