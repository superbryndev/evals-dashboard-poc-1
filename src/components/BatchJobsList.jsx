import React, { useState } from 'react';
import styled from '@emotion/styled';
import StatusBadge from './StatusBadge';
import CallDetailsCard from './CallDetailsCard';
import Modal from './Modal';
import ScenarioDetailModal from './ScenarioDetailModal';
import PayloadViewerModal from './PayloadViewerModal';
import ScenarioActivationToggle from './ScenarioActivationToggle';
import { retryJob } from '../services/api';

const ListContainer = styled.div`
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
`;

const ListHeader = styled.div`
  display: grid;
  grid-template-columns: ${props => props.isInbound 
    ? '80px 1fr 180px 140px 100px 200px' 
    : '80px 1fr 140px 100px 240px'};
  gap: var(--space-lg);
  padding: var(--space-lg) var(--space-xl);
  background: var(--color-bg-tertiary);
  border-bottom: 2px solid var(--color-border);
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  @media (max-width: 768px) {
    display: none;
  }
`;

const JobRow = styled.div`
  border-bottom: 1px solid var(--color-border);
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    box-shadow: inset 0 0 0 1px var(--color-border);
  }
`;

const JobRowMain = styled.div`
  display: grid;
  grid-template-columns: ${props => props.isInbound 
    ? '80px 1fr 180px 140px 100px 200px' 
    : '80px 1fr 140px 100px 240px'};
  gap: var(--space-lg);
  padding: var(--space-lg) var(--space-xl);
  align-items: center;
  transition: background var(--transition-fast);
  
  &:hover {
    background: var(--color-bg-tertiary);
  }
  
  &.expanded {
    background: var(--color-bg-tertiary);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--space-md);
  }
`;

const SerialNumber = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  font-family: var(--font-mono);
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-primary);
`;

const RetryIcon = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 0;
  background: transparent;
  border: none;
  color: var(--color-accent);
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover:not(:disabled) {
    color: var(--color-accent-hover);
    transform: scale(1.1);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const PayloadIcon = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  padding: 0;
  background: transparent;
  border: none;
  cursor: pointer;
  transition: all var(--transition-fast);
  color: ${props => props.hasPayload ? 'var(--color-success)' : 'var(--color-muted)'};
  
  &:hover {
    transform: scale(1.1);
    color: ${props => props.hasPayload ? 'var(--color-success)' : 'var(--color-accent)'};
  }
  
  svg {
    width: 16px;
    height: 16px;
  }
`;

const ScenarioInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  cursor: pointer;
  padding: var(--space-xs) var(--space-sm);
  margin: calc(-1 * var(--space-xs)) calc(-1 * var(--space-sm));
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  
  &:hover {
    background: var(--color-accent-soft);
    
    .scenario-id {
      color: var(--color-accent);
    }
  }
  
  .scenario-id {
    font-weight: 600;
    font-size: 0.875rem;
    color: var(--color-accent);
    transition: color var(--transition-fast);
  }
  
  .scenario-desc {
    font-size: 0.75rem;
    color: var(--color-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 400px;
  }
`;

const Duration = styled.div`
  font-size: 0.875rem;
  color: var(--color-text-primary);
  font-family: var(--font-mono);
`;

const ActionButtons = styled.div`
  display: flex;
  gap: var(--space-sm);
`;

const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 6px 12px;
  font-size: 0.8125rem;
  font-weight: 500;
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  
  ${props => props.disabled ? `
    background: transparent;
    border: 1px dashed var(--color-border);
    color: var(--color-muted);
    cursor: not-allowed;
    opacity: 0.6;
  ` : `
    background: transparent;
    border: 1px solid var(--color-accent);
    color: var(--color-accent);
    cursor: pointer;
    
    &:hover {
      background: var(--color-accent);
      color: white;
    }
  `}
  
  ${props => props.variant === 'primary' && !props.disabled && `
    background: var(--color-accent);
    color: white;
    
    &:hover {
      background: var(--color-accent-hover);
    }
  `}
`;

const ExpandedContent = styled.div`
  padding: var(--space-xl);
  background: var(--color-bg-tertiary);
  border-top: 1px solid var(--color-border);
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-2xl);
  color: var(--color-muted);
  
  h3 {
    font-size: 1.125rem;
    font-weight: 600;
    margin-bottom: var(--space-sm);
  }
`;

const ScenarioCard = styled.div`
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  margin-top: var(--space-md);
  
  h4 {
    font-size: 0.875rem;
    font-weight: 600;
    color: var(--color-text-primary);
    margin-bottom: var(--space-sm);
  }
  
  p {
    font-size: 0.8125rem;
    color: var(--color-muted);
    line-height: 1.6;
  }
  
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-xs);
    margin-top: var(--space-sm);
  }
  
  .tag {
    padding: 2px 8px;
    background: var(--color-accent-soft);
    color: var(--color-accent);
    border-radius: var(--radius-full);
    font-size: 0.6875rem;
    font-weight: 500;
  }
`;

const formatDuration = (seconds) => {
  if (!seconds) return '-';
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const truncateId = (id) => {
  if (!id) return '-';
  return id.substring(0, 8);
};

const getScenarioId = (snapshot) => {
  return snapshot?.scenario_id || snapshot?.id || '-';
};

const getScenarioDescription = (snapshot) => {
  // New format: simulation_context.scenario.situation or goal
  if (snapshot?.simulation_context?.scenario) {
    return snapshot.simulation_context.scenario.situation || 
           snapshot.simulation_context.scenario.goal || 
           '';
  }
  // Legacy format
  return snapshot?.background || snapshot?.scenario || snapshot?.intent || '';
};

const getScenarioName = (snapshot) => {
  return snapshot?.scenario_name || snapshot?.name || getScenarioId(snapshot);
};

const getEvaluationCriteria = (snapshot) => {
  // New format: evaluation_criteria
  if (snapshot?.evaluation_criteria) {
    return {
      agent_should: snapshot.evaluation_criteria.agent_should || [],
      agent_should_not: snapshot.evaluation_criteria.agent_should_not || [],
    };
  }
  // Legacy format: expected_agent_goals
  if (snapshot?.expected_agent_goals) {
    return {
      agent_should: snapshot.expected_agent_goals,
      agent_should_not: [],
    };
  }
  return { agent_should: [], agent_should_not: [] };
};

const PackageIcon = ({ hasPayload }) => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    {hasPayload ? (
      <>
        <path d="M16.5 9.4l-9-5.19M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </>
    ) : (
      <>
        <path d="M12.89 1.45l8 4A2 2 0 0 1 22 7.24v9.53a2 2 0 0 1-1.11 1.79l-8 4a2 2 0 0 1-1.79 0l-8-4a2 2 0 0 1-1.1-1.8V7.24a2 2 0 0 1 1.11-1.79l8-4a2 2 0 0 1 1.78 0z" />
        <polyline points="2.32 6.16 12 11 21.68 6.16" />
        <line x1="12" y1="22.76" x2="12" y2="11" />
      </>
    )}
  </svg>
);

const BatchJobsList = ({ 
  jobs = [], 
  showScenarios = false, 
  onRefresh, 
  isInbound = false,
  batchId,
  availableSlots = 0,
  onActivateJob,
  onDeactivateJob,
}) => {
  const [expandedJobId, setExpandedJobId] = useState(null);
  const [retryingJobId, setRetryingJobId] = useState(null);
  const [showRetryModal, setShowRetryModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [showScenarioModal, setShowScenarioModal] = useState(false);
  const [showPayloadModal, setShowPayloadModal] = useState(false);
  const [selectedPayloadJob, setSelectedPayloadJob] = useState(null);

  // Sort jobs: active/inprogress first, then inactive, then completed/failed
  const sortedJobs = React.useMemo(() => {
    const statusPriority = {
      'inprogress': 1,
      'active': 2,
      'inactive': 3,
      'pending': 4,
      'processing': 5,
      'completed': 6,
      'failed': 7,
      'no_answer': 8,
    };

    return [...jobs].sort((a, b) => {
      const priorityA = statusPriority[a.status] || 99;
      const priorityB = statusPriority[b.status] || 99;
      
      if (priorityA !== priorityB) {
        return priorityA - priorityB;
      }
      
      // If same priority, sort by created_at (newest first for active, oldest first for inactive)
      if (priorityA <= 2) {
        // For active/inprogress, show newest first
        return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      } else {
        // For others, show oldest first
        return new Date(a.created_at || 0) - new Date(b.created_at || 0);
      }
    });
  }, [jobs]);

  const toggleExpand = (jobId) => {
    setExpandedJobId(expandedJobId === jobId ? null : jobId);
  };

  const isJobCompleted = (status) => {
    return ['completed', 'failed', 'no_answer'].includes(status);
  };

  const handleRetryClick = (jobId, e) => {
    e.stopPropagation();
    setSelectedJobId(jobId);
    setShowRetryModal(true);
  };

  const handleRetryConfirm = async () => {
    if (!selectedJobId) return;
    
    setRetryingJobId(selectedJobId);
    setShowRetryModal(false);
    
    try {
      await retryJob(selectedJobId);
      
      // Refresh the batch data
      if (onRefresh) {
        await onRefresh();
      }
      
      // Show success toast
      if (window.showToast) {
        window.showToast('Job retry initiated successfully! A new job has been created and queued.', 'success');
      }
    } catch (error) {
      console.error('Failed to retry job:', error);
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to retry job';
      
      // Show error toast
      if (window.showToast) {
        window.showToast(errorMessage, 'error', 7000);
      }
    } finally {
      setRetryingJobId(null);
      setSelectedJobId(null);
    }
  };

  const handleRetryCancel = () => {
    setShowRetryModal(false);
    setSelectedJobId(null);
  };

  const handleScenarioClick = (scenario, e) => {
    e.stopPropagation();
    setSelectedScenario(scenario);
    setShowScenarioModal(true);
  };

  const handleScenarioModalClose = () => {
    setShowScenarioModal(false);
    setSelectedScenario(null);
  };

  const handlePayloadClick = (job, e) => {
    e.stopPropagation();
    setSelectedPayloadJob(job);
    setShowPayloadModal(true);
  };

  const handlePayloadModalClose = () => {
    setShowPayloadModal(false);
    setSelectedPayloadJob(null);
  };

  if (jobs.length === 0) {
    return (
      <ListContainer>
        <EmptyState>
          <h3>No jobs found</h3>
          <p>This batch doesn't have any jobs yet</p>
        </EmptyState>
      </ListContainer>
    );
  }

  return (
    <>
      <ListContainer>
        <ListHeader isInbound={isInbound}>
          <div>#</div>
          <div>Scenario</div>
          {isInbound && <div>Activation</div>}
          <div>Status</div>
          <div>Duration</div>
          <div>Actions</div>
        </ListHeader>
      
      {sortedJobs.map((job, index) => {
        const isExpanded = expandedJobId === job.job_id;
        const completed = isJobCompleted(job.status);
        const scenarioSnapshot = job.scenario_snapshot || {};
        const isFailed = job.status === 'failed';
        const hasAnalysis = job.call?.analysis || job.call?.analytics?.analysis;
        
        // Extract duration from analytics timing or call duration_seconds
        // Check both structured and raw analytics formats
        const callAnalytics = job.call?.analytics || {};
        const rawAnalytics = typeof callAnalytics === 'object' ? callAnalytics : {};
        const timing = callAnalytics?.timing || rawAnalytics?.timing || {};
        const callDuration = timing?.duration_seconds || job.call?.duration_seconds;
        
        // For inbound jobs, determine if the job is active (has assigned phone number)
        const isJobActive = job.status === 'active' || job.status === 'inprogress';
        const isInactiveJob = job.status === 'inactive';
        const canActivate = isInactiveJob && availableSlots > 0;
        const canDeactivate = job.status === 'active'; // Can only deactivate 'active' jobs, not 'inprogress'
        
        return (
          <JobRow key={job.job_id}>
            <JobRowMain className={isExpanded ? 'expanded' : ''} isInbound={isInbound}>
              <SerialNumber>
                #{index + 1}
                {/* Only show payload icon for inbound batches (testing outbound agents) */}
                {isInbound && (
                  <PayloadIcon
                    onClick={(e) => handlePayloadClick(job, e)}
                    hasPayload={!!job.generated_payload}
                    title="Payload"
                  >
                    <PackageIcon hasPayload={!!job.generated_payload} />
                  </PayloadIcon>
                )}
                {isFailed && (
                  <RetryIcon
                    onClick={(e) => handleRetryClick(job.job_id, e)}
                    disabled={retryingJobId === job.job_id}
                    title="Retry failed job"
                  >
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="23 4 23 10 17 10" />
                      <polyline points="1 20 1 14 7 14" />
                      <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
                    </svg>
                  </RetryIcon>
                )}
              </SerialNumber>
              <ScenarioInfo 
                onClick={(e) => handleScenarioClick(scenarioSnapshot, e)}
                title="Click to view scenario details"
              >
                <span className="scenario-id">{getScenarioName(scenarioSnapshot)}</span>
                <span className="scenario-desc">{getScenarioDescription(scenarioSnapshot)}</span>
              </ScenarioInfo>
              {isInbound && (
                <ScenarioActivationToggle
                  jobId={job.job_id}
                  isActive={isJobActive}
                  assignedPhoneNumber={job.assigned_phone_number}
                  disabled={
                    (!canActivate && !canDeactivate) || 
                    completed ||
                    job.status === 'inprogress'
                  }
                  disabledReason={
                    completed ? 'Job already completed' :
                    job.status === 'inprogress' ? 'Call in progress' :
                    !canActivate && isInactiveJob ? 'No phone slots available' :
                    ''
                  }
                  onActivate={onActivateJob}
                  onDeactivate={onDeactivateJob}
                />
              )}
              <StatusBadge status={job.status} />
              <Duration>{formatDuration(callDuration)}</Duration>
              <ActionButtons>
                <ActionButton 
                  disabled={!completed}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (completed) {
                      setExpandedJobId(job.job_id);
                    }
                  }}
                >
                  View Details
                </ActionButton>
                <ActionButton 
                  disabled={!hasAnalysis}
                  variant={hasAnalysis ? 'primary' : undefined}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (hasAnalysis) {
                      setExpandedJobId(job.job_id);
                    }
                  }}
                >
                  Analysis
                </ActionButton>
              </ActionButtons>
            </JobRowMain>
            
            {isExpanded && (
              <ExpandedContent>
                {showScenarios ? (
                  <ScenarioCard>
                    <h4>Scenario: {getScenarioName(scenarioSnapshot)}</h4>
                    <p>{getScenarioDescription(scenarioSnapshot)}</p>
                    
                    {/* New format: simulation_context */}
                    {scenarioSnapshot?.simulation_context && (
                      <div style={{ marginTop: 'var(--space-md)' }}>
                        {scenarioSnapshot.simulation_context.caller_profile && (
                          <div style={{ marginBottom: 'var(--space-sm)' }}>
                            <strong style={{ fontSize: '0.8125rem' }}>Caller Profile:</strong>
                            <p style={{ fontSize: '0.8125rem', color: 'var(--color-muted)', marginTop: 'var(--space-xs)' }}>
                              {scenarioSnapshot.simulation_context.caller_profile.persona || 
                               scenarioSnapshot.simulation_context.caller_profile.name || 
                               'N/A'}
                            </p>
                          </div>
                        )}
                        {scenarioSnapshot.simulation_context.scenario && (
                          <div style={{ marginBottom: 'var(--space-sm)' }}>
                            <strong style={{ fontSize: '0.8125rem' }}>Situation:</strong>
                            <p style={{ fontSize: '0.8125rem', color: 'var(--color-muted)', marginTop: 'var(--space-xs)' }}>
                              {scenarioSnapshot.simulation_context.scenario.situation || 'N/A'}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Tags */}
                    {scenarioSnapshot.tags && scenarioSnapshot.tags.length > 0 && (
                      <div className="tags">
                        {scenarioSnapshot.tags.map((tag, i) => (
                          <span key={i} className="tag">{tag}</span>
                        ))}
                      </div>
                    )}
                    
                    {/* Metadata categories */}
                    {scenarioSnapshot.metadata?.categories && (
                      <div className="tags" style={{ marginTop: 'var(--space-sm)' }}>
                        {Object.entries(scenarioSnapshot.metadata.categories).map(([key, value]) => {
                          if (Array.isArray(value)) {
                            return value.map((v, i) => (
                              <span key={`${key}-${i}`} className="tag">{key}: {v}</span>
                            ));
                          }
                          return <span key={key} className="tag">{key}: {value}</span>;
                        })}
                      </div>
                    )}
                    
                    {/* Evaluation criteria */}
                    {(() => {
                      const criteria = getEvaluationCriteria(scenarioSnapshot);
                      return (criteria.agent_should.length > 0 || criteria.agent_should_not.length > 0) && (
                        <div style={{ marginTop: 'var(--space-md)' }}>
                          {criteria.agent_should.length > 0 && (
                            <div style={{ marginBottom: 'var(--space-sm)' }}>
                              <strong style={{ fontSize: '0.8125rem' }}>Agent Should:</strong>
                              <ul style={{ marginTop: 'var(--space-xs)', paddingLeft: 'var(--space-lg)', fontSize: '0.8125rem', color: 'var(--color-muted)' }}>
                                {criteria.agent_should.map((goal, i) => (
                                  <li key={i}>{goal}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                          {criteria.agent_should_not.length > 0 && (
                            <div>
                              <strong style={{ fontSize: '0.8125rem' }}>Agent Should Not:</strong>
                              <ul style={{ marginTop: 'var(--space-xs)', paddingLeft: 'var(--space-lg)', fontSize: '0.8125rem', color: 'var(--color-muted)' }}>
                                {criteria.agent_should_not.map((goal, i) => (
                                  <li key={i}>{goal}</li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      );
                    })()}
                  </ScenarioCard>
                ) : (
                  <CallDetailsCard 
                    job={job}
                    call={job.call}
                    scenario={scenarioSnapshot}
                  />
                )}
              </ExpandedContent>
            )}
          </JobRow>
        );
      })}
      </ListContainer>

      <Modal
        isOpen={showRetryModal}
        onClose={handleRetryCancel}
        title="Retry Failed Job"
        type="warning"
        onConfirm={handleRetryConfirm}
        onCancel={handleRetryCancel}
        confirmText="Retry"
        cancelText="Cancel"
      >
        <p style={{ margin: 0, color: 'var(--color-text-primary)' }}>
          Retry this failed call? A new job will be created with the same scenario and queued for processing.
        </p>
        <p style={{ margin: 'var(--space-sm) 0 0', fontSize: '0.8125rem', color: 'var(--color-muted)' }}>
          The original failed job will be preserved for reference.
        </p>
      </Modal>

      <ScenarioDetailModal
        isOpen={showScenarioModal}
        onClose={handleScenarioModalClose}
        scenario={selectedScenario}
      />

      <PayloadViewerModal
        isOpen={showPayloadModal}
        onClose={handlePayloadModalClose}
        jobId={selectedPayloadJob?.job_id}
        scenarioName={getScenarioName(selectedPayloadJob?.scenario_snapshot)}
      />
    </>
  );
};

export default BatchJobsList;

