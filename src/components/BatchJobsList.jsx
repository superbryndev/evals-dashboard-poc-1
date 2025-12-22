import React, { useState } from 'react';
import styled from '@emotion/styled';
import StatusBadge from './StatusBadge';
import CallDetailsCard from './CallDetailsCard';

const ListContainer = styled.div`
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  overflow: hidden;
`;

const ListHeader = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 140px 100px 120px;
  gap: var(--space-md);
  padding: var(--space-md) var(--space-lg);
  background: var(--color-bg-tertiary);
  border-bottom: 1px solid var(--color-border);
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
`;

const JobRowMain = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 140px 100px 120px;
  gap: var(--space-md);
  padding: var(--space-md) var(--space-lg);
  align-items: center;
  cursor: pointer;
  transition: background var(--transition-fast);
  
  &:hover {
    background: var(--color-bg-tertiary);
  }
  
  &.expanded {
    background: var(--color-bg-tertiary);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: var(--space-sm);
  }
`;

const JobId = styled.div`
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  color: var(--color-text-primary);
  
  .truncated {
    color: var(--color-muted);
  }
`;

const ScenarioInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  
  .scenario-id {
    font-weight: 600;
    font-size: 0.875rem;
    color: var(--color-text-primary);
  }
  
  .scenario-desc {
    font-size: 0.75rem;
    color: var(--color-muted);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px;
  }
`;

const Duration = styled.div`
  font-size: 0.875rem;
  color: var(--color-text-primary);
  font-family: var(--font-mono);
`;

const EvalsButton = styled.button`
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
`;

const ExpandedContent = styled.div`
  padding: 0 var(--space-lg) var(--space-lg);
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

const BatchJobsList = ({ jobs = [], showScenarios = false, onRefresh }) => {
  const [expandedJobId, setExpandedJobId] = useState(null);

  const toggleExpand = (jobId) => {
    setExpandedJobId(expandedJobId === jobId ? null : jobId);
  };

  const isJobCompleted = (status) => {
    return ['completed', 'failed', 'no_answer'].includes(status);
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
    <ListContainer>
      <ListHeader>
        <div>Job ID</div>
        <div>Scenario</div>
        <div>Status</div>
        <div>Duration</div>
        <div>Evaluation</div>
      </ListHeader>
      
      {jobs.map((job) => {
        const isExpanded = expandedJobId === job.job_id;
        const completed = isJobCompleted(job.status);
        const scenarioSnapshot = job.scenario_snapshot || {};
        
        // Extract duration from analytics timing or call duration_seconds
        // Check both structured and raw analytics formats
        const callAnalytics = job.call?.analytics || {};
        const rawAnalytics = typeof callAnalytics === 'object' ? callAnalytics : {};
        const timing = callAnalytics?.timing || rawAnalytics?.timing || {};
        const callDuration = timing?.duration_seconds || job.call?.duration_seconds;
        
        return (
          <JobRow key={job.job_id}>
            <JobRowMain 
              onClick={() => toggleExpand(job.job_id)}
              className={isExpanded ? 'expanded' : ''}
            >
              <JobId>
                {truncateId(job.job_id)}
                <span className="truncated">...</span>
              </JobId>
              <ScenarioInfo>
                <span className="scenario-id">{getScenarioName(scenarioSnapshot)}</span>
                <span className="scenario-desc">{getScenarioDescription(scenarioSnapshot)}</span>
              </ScenarioInfo>
              <StatusBadge status={job.status} />
              <Duration>{formatDuration(callDuration)}</Duration>
              <EvalsButton 
                disabled={!completed}
                onClick={(e) => {
                  e.stopPropagation();
                  if (completed) {
                    setExpandedJobId(job.job_id);
                  }
                }}
              >
                evals
              </EvalsButton>
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
  );
};

export default BatchJobsList;

