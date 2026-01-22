import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import styled from '@emotion/styled';
import { fetchBatchDetails, getInboundBatchStatus, getInboundBatchJobs, activateInboundJobs, deactivateInboundJobs } from '../services/api';
import BatchOverviewCard from '../components/BatchOverviewCard';
import BatchJobsList from '../components/BatchJobsList';
import TabNavigation from '../components/TabNavigation';
import AnalysisTab from '../components/AnalysisTab';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';
import JobActivationControl from '../features/inbound/JobActivationControl';
import ActiveCallsList from '../features/inbound/ActiveCallsList';
import PhoneNumberList from '../features/inbound/PhoneNumberList';
import Toast from '../components/Toast';
import PayloadGeneratorModal from '../components/PayloadGeneratorModal';
import AllPayloadsModal from '../components/AllPayloadsModal';
import { getPhoneNumbers } from '../services/api';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
  padding: var(--space-xl);
  max-width: 1600px;
  margin: 0 auto;
  width: 100%;
  box-sizing: border-box;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: var(--space-lg);
  margin-bottom: var(--space-md);
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
`;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--color-text-primary);
  display: flex;
  align-items: center;
  gap: var(--space-md);
  flex-wrap: wrap;
`;

const AgentTypeBadge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-xs) var(--space-md);
  background: ${props => props.agentType === 'inbound' ? '#DCFCE7' : '#E0E7FF'};
  color: ${props => props.agentType === 'inbound' ? '#166534' : '#3730A3'};
  border-radius: var(--radius-full);
  font-size: 0.875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const BatchId = styled.span`
  font-family: var(--font-mono);
  font-size: 0.875rem;
  color: var(--color-muted);
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

const LastUpdated = styled.span`
  font-size: 0.75rem;
  color: var(--color-muted);
  margin-top: var(--space-xs);
`;

const ContentSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
`;

const SideBySideContainer = styled.div`
  display: flex;
  gap: var(--space-xl);
  width: 100%;
  
  > * {
    flex: 1;
    min-width: 0;
  }
  
  @media (max-width: 768px) {
    flex-direction: column;
  }
`;

const TabContent = styled.div`
  min-height: 400px;
  margin-top: var(--space-lg);
`;

const ComingSoon = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  border: 1px dashed var(--color-border);
  
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-muted);
    margin-bottom: var(--space-sm);
  }
  
  p {
    color: var(--color-muted);
    font-size: 0.875rem;
  }
`;

const RefreshIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23,4 23,10 17,10" />
    <polyline points="1,20 1,14 7,14" />
    <path d="m3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
);

const SparklesIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
    <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
    <path d="M5 19l.5 1.5L7 21l-1.5.5L5 23l-.5-1.5L3 21l1.5-.5L5 19z" />
    <path d="M19 10l.5 1.5L21 12l-1.5.5L19 14l-.5-1.5L17 12l1.5-.5L19 10z" />
  </svg>
);

const GenerateButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  background: var(--color-accent-soft);
  border: 1px solid var(--color-accent);
  border-radius: var(--radius-md);
  color: var(--color-accent);
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    background: var(--color-accent);
    color: white;
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const ViewPayloadsButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  background: ${props => props.disabled ? 'var(--color-bg-secondary)' : 'var(--color-bg-tertiary)'};
  border: 1px solid ${props => props.disabled ? 'var(--color-border)' : 'var(--color-border-hover)'};
  border-radius: var(--radius-md);
  color: ${props => props.disabled ? 'var(--color-muted)' : 'var(--color-text-primary)'};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all var(--transition-fast);
  opacity: ${props => props.disabled ? 0.6 : 1};
  
  &:hover:not(:disabled) {
    background: var(--color-accent-soft);
    border-color: var(--color-accent);
    color: var(--color-accent);
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const PayloadSection = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  padding: var(--space-md) var(--space-lg);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-lg);
`;

const PayloadLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-secondary);
`;

const TABS = [
  { id: 'simulations', label: 'Simulations' },
  { id: 'analysis', label: 'Analysis' },
];

const BatchAnalytics = () => {
  const { batchId } = useParams();
  const [activeTab, setActiveTab] = useState('simulations');
  const [batchData, setBatchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [isInbound, setIsInbound] = useState(false);
  const [inboundData, setInboundData] = useState(null);
  const [activeCalls, setActiveCalls] = useState([]);
  const [toast, setToast] = useState(null);
  const [availablePhoneNumbers, setAvailablePhoneNumbers] = useState(0);
  const [showPayloadModal, setShowPayloadModal] = useState(false);
  const [showAllPayloadsModal, setShowAllPayloadsModal] = useState(false);
  const [indianNumbersOnly, setIndianNumbersOnly] = useState(false);
  const [highlightedJobId, setHighlightedJobId] = useState(null);
  const [highlightedCallId, setHighlightedCallId] = useState(null);

  const loadBatchData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      // Fetch batch details - this works for both inbound and outbound
      try {
        const data = await fetchBatchDetails(batchId);
        
        // Check call_type from batch data to determine if it's inbound or outbound
        const callType = data.batch?.call_type || 'outbound';
        const isInboundBatch = callType === 'inbound';
        
        setIsInbound(isInboundBatch);
        
        if (isInboundBatch) {
          // For inbound batches, also fetch status and jobs
          try {
            const inboundStatus = await getInboundBatchStatus(batchId);
            const inboundJobs = await getInboundBatchJobs(batchId, { limit: 100 });
            
            // Fetch available phone numbers to calculate actual available slots
            try {
              const phoneNumbers = await getPhoneNumbers(indianNumbersOnly ? 'IN' : undefined);
              // Filter by country if toggle is ON
              const filteredNumbers = indianNumbersOnly
                ? (phoneNumbers.numbers || []).filter(n => n.phone_number.startsWith('+91'))
                : (phoneNumbers.numbers || []);
              const availableCount = filteredNumbers.filter(n => n.is_available).length;
              setAvailablePhoneNumbers(availableCount);
            } catch (phoneErr) {
              console.warn('Failed to fetch phone numbers:', phoneErr);
              setAvailablePhoneNumbers(0);
            }
            
            console.log('Inbound batch data:', {
              status: inboundStatus,
              jobsCount: inboundJobs?.jobs?.length || 0,
              totalJobs: inboundStatus?.total_jobs || 0,
              jobs: inboundJobs?.jobs || []
            });
            
            setInboundData({
              status: inboundStatus,
              jobs: inboundJobs?.jobs || [],
            });
            
            // Use batchData.jobs (from fetchBatchDetails) which includes call objects with analytics
            // This is the source of truth for jobs with call data
            setBatchData(data);
            
            // Extract active calls from batchData.jobs (which has call objects)
            const active = (data.jobs || []).filter(
              (job) => job.status === 'inprogress' && job.call
            );
            setActiveCalls(active.map((job) => ({
              ...job.call,
              sim_jobs_01: {
                scenario_id: job.scenario_id,
                scenario_snapshot: job.scenario_snapshot,
              },
            })));
          } catch (inboundErr) {
            console.warn('Failed to fetch inbound-specific data:', inboundErr);
            // Still set batch data even if inbound-specific fetch fails
            setBatchData(data);
          }
        } else {
          // For outbound batches, use the standard batch data
          setBatchData(data);
          
          // Extract active calls for outbound batches
          const outboundJobs = data.jobs || [];
          const active = outboundJobs.filter(
            (job) => job.status === 'inprogress' && job.call
          );
          setActiveCalls(active.map((job) => ({
            ...job.call,
            sim_jobs_01: {
              scenario_id: job.scenario?.scenario_id || job.scenario_id,
              scenario_snapshot: job.scenario,
            },
            // Pass the job's customer phone number for outbound calls
            customer_phone_number: job.customer_phone_number || job.phone_number,
          })));
        }
        
        setLastUpdated(new Date());
      } catch (err) {
        // If fetchBatchDetails fails, try inbound endpoints as fallback
        try {
          const inboundStatus = await getInboundBatchStatus(batchId);
          const inboundJobs = await getInboundBatchJobs(batchId, { limit: 100 });
          
          // Fetch available phone numbers to calculate actual available slots
          try {
            const phoneNumbers = await getPhoneNumbers(indianNumbersOnly ? 'IN' : undefined);
            // Filter by country if toggle is ON
            const filteredNumbers = indianNumbersOnly
              ? (phoneNumbers.numbers || []).filter(n => n.phone_number.startsWith('+91'))
              : (phoneNumbers.numbers || []);
            const availableCount = filteredNumbers.filter(n => n.is_available).length;
            setAvailablePhoneNumbers(availableCount);
          } catch (phoneErr) {
            console.warn('Failed to fetch phone numbers:', phoneErr);
            setAvailablePhoneNumbers(0);
          }
          
          setIsInbound(true);
          setInboundData({
            status: inboundStatus,
            jobs: inboundJobs?.jobs || [],
          });
          
          // Extract active calls
          const active = (inboundJobs?.jobs || []).filter(
            (job) => job.status === 'inprogress' && job.call
          );
          setActiveCalls(active.map((job) => ({
            ...job.call,
            sim_jobs_01: {
              scenario_id: job.scenario_id,
              scenario_snapshot: job.scenario_snapshot,
            },
          })));
          
          setLastUpdated(new Date());
        } catch (inboundErr) {
          // Both failed, throw the original error
          throw err;
        }
      }
    } catch (err) {
      console.error('Failed to fetch batch details:', err);
      setError(err.response?.data?.detail || err.message || 'Failed to load batch details');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [batchId]);

  useEffect(() => {
    loadBatchData();
    // Removed auto-refresh - users can manually refresh using the refresh button
  }, [loadBatchData]);

  // Refetch phone numbers when filter changes
  useEffect(() => {
    if (isInbound && inboundData) {
      const fetchPhoneNumbers = async () => {
        try {
          const phoneNumbers = await getPhoneNumbers(indianNumbersOnly ? 'IN' : undefined);
          const filteredNumbers = indianNumbersOnly
            ? (phoneNumbers.numbers || []).filter(n => n.phone_number.startsWith('+91'))
            : (phoneNumbers.numbers || []);
          const availableCount = filteredNumbers.filter(n => n.is_available).length;
          setAvailablePhoneNumbers(availableCount);
        } catch (phoneErr) {
          console.warn('Failed to fetch phone numbers:', phoneErr);
          setAvailablePhoneNumbers(0);
        }
      };
      fetchPhoneNumbers();
    }
  }, [indianNumbersOnly, isInbound, inboundData]);

  const handleRefresh = () => {
    loadBatchData(true);
  };

  const handleActivationSuccess = (response) => {
    setToast({
      type: 'success',
      message: `Activated ${response.activated_jobs} job(s) successfully!`,
    });
    loadBatchData(true);
  };

  // Handler for single job activation from the table toggle
  const handleActivateJob = async (jobId) => {
    try {
      const response = await activateInboundJobs(batchId, [jobId], indianNumbersOnly ? 'IN' : undefined);
      setToast({
        type: 'success',
        message: `Scenario activated! Phone: ${response.assignments?.[0]?.phone_number || response.job_details?.[0]?.assigned_phone_number || 'assigned'}`,
      });
      loadBatchData(true);
      return response;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to activate scenario';
      setToast({
        type: 'error',
        message: errorMsg,
      });
      throw err;
    }
  };

  // Handler for single job deactivation from the table toggle
  const handleDeactivateJob = async (jobId) => {
    try {
      const response = await deactivateInboundJobs(batchId, [jobId]);
      setToast({
        type: 'success',
        message: 'Scenario deactivated. Phone number released.',
      });
      loadBatchData(true);
      return response;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to deactivate scenario';
      setToast({
        type: 'error',
        message: errorMsg,
      });
      throw err;
    }
  };

  const handleViewCall = (call) => {
    console.log('View call:', call);
    // Future: Navigate to call details
  };

  // Navigation handlers for correlating analysis and call details
  const handleNavigateToCallDetails = useCallback((callId, jobId) => {
    setHighlightedJobId(jobId);
    setActiveTab('simulations');
    // Clear highlight after a delay to allow expansion
    setTimeout(() => {
      setHighlightedJobId(null);
    }, 2000);
  }, []);

  const handleNavigateToAnalysis = useCallback((callId, jobId) => {
    setHighlightedCallId(callId);
    setActiveTab('analysis');
    // Clear highlight after a delay to allow scrolling
    setTimeout(() => {
      setHighlightedCallId(null);
    }, 2000);
  }, []);

  const handlePayloadGenerationComplete = (result) => {
    setToast({
      type: result.failed > 0 ? 'warning' : 'success',
      message: `Generated ${result.generated} payload(s)${result.failed > 0 ? `, ${result.failed} failed` : ''}`,
    });
    loadBatchData(true);
  };

  // Count payloads for outbound batches
  const payloadCount = batchData?.jobs?.filter(job => job.generated_payload)?.length || 0;

  if (loading) {
    return <LoadingSpinner message="Loading batch details..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={() => loadBatchData()} />;
  }

  // Render Inbound Batch UI
  if (isInbound && inboundData) {
    const { status, jobs } = inboundData;
    const inactiveJobs = jobs.filter((job) => job.status === 'inactive');
    // Use actual available phone numbers instead of max_concurrent_calls
    // Available slots = available phone numbers (not in use)
    const availableSlots = Math.max(0, availablePhoneNumbers);
    const progressPercentage = status.total_jobs > 0 ? (status.completed_jobs / status.total_jobs) * 100 : 0;
    // Count payloads for inbound batches
    const inboundPayloadCount = jobs.filter(job => job.generated_payload)?.length || 0;

    return (
      <PageContainer>
        <PageHeader>
          <TitleSection>
            <PageTitle>
              Batch Details
              <AgentTypeBadge agentType="inbound">
                📤 Testing Outbound Agent
              </AgentTypeBadge>
            </PageTitle>
            <BatchId>/{batchId}</BatchId>
          </TitleSection>
          <div>
            <RefreshButton 
              onClick={handleRefresh} 
              disabled={refreshing}
              className={refreshing ? 'loading' : ''}
            >
              <RefreshIcon />
              {refreshing ? 'Refreshing...' : 'Refresh'}
            </RefreshButton>
            {lastUpdated && (
              <LastUpdated>
                Last updated: {lastUpdated.toLocaleTimeString()}
              </LastUpdated>
            )}
          </div>
        </PageHeader>

        <ContentSection>
          {/* Batch Overview */}
          <BatchOverviewCard 
            batch={{
              id: batchId,
              call_type: 'inbound',
              outbound_agent_phone_number: status.outbound_agent_phone_number,
              created_at: status.created_at,
              status: status.status,
            }} 
            summary={{
              total_jobs: status.total_jobs,
              completed_jobs: status.completed_jobs,
              failed_jobs: status.failed_jobs,
              active_jobs: status.active_jobs,
              inactive_jobs: status.inactive_jobs,
              inprogress_jobs: status.inprogress_jobs,
              progress: progressPercentage,
            }} 
          />

          {/* Available Phone Numbers */}
          <PhoneNumberList 
            indianNumbersOnly={indianNumbersOnly}
            onFilterChange={setIndianNumbersOnly}
          />

          {/* Payload Generation Section - Show for inbound batches (testing outbound agents) */}
          <PayloadSection>
            <PayloadLabel>AI Payloads:</PayloadLabel>
            <GenerateButton onClick={() => setShowPayloadModal(true)}>
              <SparklesIcon />
              Generate Payloads
            </GenerateButton>
            <ViewPayloadsButton 
              onClick={() => setShowAllPayloadsModal(true)}
              disabled={inboundPayloadCount === 0}
              title={inboundPayloadCount === 0 ? 'No payloads generated yet' : `View all ${inboundPayloadCount} payloads`}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              View All Payloads {inboundPayloadCount > 0 && `(${inboundPayloadCount})`}
            </ViewPayloadsButton>
          </PayloadSection>

          {/* Job Activation Control and Active Calls - Side by Side */}
          <SideBySideContainer>
            {/* Job Activation Control */}
            <JobActivationControl
              batchId={batchId}
              inactiveJobs={inactiveJobs}
              availableSlots={availableSlots}
              onActivationSuccess={handleActivationSuccess}
              indianNumbersOnly={indianNumbersOnly}
            />

            {/* Active Calls */}
            <ActiveCallsList
              batchId={batchId}
              activeCalls={activeCalls}
              onViewCall={handleViewCall}
            />
          </SideBySideContainer>

          {/* Tabs for Jobs View */}
          <TabNavigation 
            tabs={TABS} 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
          />
          
          <TabContent>
            {activeTab === 'simulations' && (
              <BatchJobsList 
                jobs={batchData?.jobs || []} 
                onRefresh={handleRefresh}
                isInbound={true}
                batchId={batchId}
                availableSlots={availableSlots}
                onActivateJob={handleActivateJob}
                onDeactivateJob={handleDeactivateJob}
                highlightedJobId={highlightedJobId}
                onNavigateToAnalysis={handleNavigateToAnalysis}
              />
            )}
            
            {activeTab === 'analysis' && (
              <AnalysisTab 
                batchId={batchId}
                onNavigateToCallDetails={handleNavigateToCallDetails}
                highlightCallId={highlightedCallId}
              />
            )}
          </TabContent>
        </ContentSection>

        {toast && (
          <Toast
            type={toast.type}
            message={toast.message}
            onClose={() => setToast(null)}
          />
        )}

        <PayloadGeneratorModal
          isOpen={showPayloadModal}
          onClose={() => setShowPayloadModal(false)}
          batchId={batchId}
          totalJobs={status?.total_jobs || 0}
          onGenerationComplete={handlePayloadGenerationComplete}
        />

        <AllPayloadsModal
          isOpen={showAllPayloadsModal}
          onClose={() => setShowAllPayloadsModal(false)}
          batchId={batchId}
        />
      </PageContainer>
    );
  }

  // Render Outbound Batch UI (original)
  return (
    <PageContainer>
      <PageHeader>
          <TitleSection>
            <PageTitle>
              Batch Details
              <AgentTypeBadge agentType="outbound">
                📞 Testing Inbound Agent
              </AgentTypeBadge>
            </PageTitle>
          <BatchId>/{batchId}</BatchId>
        </TitleSection>
        <div>
          <RefreshButton 
            onClick={handleRefresh} 
            disabled={refreshing}
            className={refreshing ? 'loading' : ''}
          >
            <RefreshIcon />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </RefreshButton>
          {lastUpdated && (
            <LastUpdated>
              Last updated: {lastUpdated.toLocaleTimeString()}
            </LastUpdated>
          )}
        </div>
      </PageHeader>

      {batchData && (
        <ContentSection>
          <BatchOverviewCard batch={batchData.batch} summary={batchData.summary} />
          
          {/* Active Calls for Outbound */}
          {activeCalls.length > 0 && (
            <ActiveCallsList
              batchId={batchId}
              activeCalls={activeCalls}
              onViewCall={handleViewCall}
              isOutbound={true}
              agentPhoneNumber={batchData.batch?.phone_number}
            />
          )}
          
          <TabNavigation 
            tabs={TABS} 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
          />
          
          <TabContent>
            {activeTab === 'simulations' && (
              <BatchJobsList 
                jobs={batchData.jobs} 
                onRefresh={handleRefresh}
                isInbound={false}
                highlightedJobId={highlightedJobId}
                onNavigateToAnalysis={handleNavigateToAnalysis}
              />
            )}
            
            {activeTab === 'analysis' && (
              <AnalysisTab 
                batchId={batchId}
                onNavigateToCallDetails={handleNavigateToCallDetails}
                highlightCallId={highlightedCallId}
              />
            )}
          </TabContent>
        </ContentSection>
      )}

      <PayloadGeneratorModal
        isOpen={showPayloadModal}
        onClose={() => setShowPayloadModal(false)}
        batchId={batchId}
        totalJobs={batchData?.jobs?.length || 0}
        onGenerationComplete={handlePayloadGenerationComplete}
      />
    </PageContainer>
  );
};

export default BatchAnalytics;

