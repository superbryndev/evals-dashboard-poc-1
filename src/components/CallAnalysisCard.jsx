import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { triggerCallAnalysis } from '../services/api';

const Card = styled.div`
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-md);
  margin-bottom: var(--space-md);
  transition: all var(--transition-fast);
  
  &:hover {
    border-color: var(--color-accent);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-sm);
`;

const CallId = styled.span`
  font-family: var(--font-mono);
  font-size: 0.875rem;
  color: var(--color-muted);
`;

const StatusBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-full);
  font-size: 0.8125rem;
  font-weight: 600;
  background: ${props => props.passed 
    ? 'rgba(34, 197, 94, 0.1)' 
    : 'rgba(239, 68, 68, 0.1)'};
  color: ${props => props.passed 
    ? 'var(--color-success)' 
    : 'var(--color-error)'};
  
  &::before {
    content: '${props => props.passed ? '✓' : '✗'}';
    font-size: 1rem;
    font-weight: bold;
  }
`;

const MetricsSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  margin-top: var(--space-md);
`;

const MetricsRow = styled.div`
  display: flex;
  gap: var(--space-md);
  align-items: flex-start;
  flex-wrap: wrap;
`;

const CSATCard = styled.div`
  flex: 1;
  min-width: 200px;
  padding: var(--space-md);
  background: linear-gradient(135deg, var(--color-bg-tertiary) 0%, rgba(133, 92, 241, 0.05) 100%);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
`;

const CSATLabel = styled.div`
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const CSATRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: var(--space-sm);
`;

const CSATScore = styled.span`
  font-size: 2rem;
  font-weight: 700;
  line-height: 1;
  color: ${props => {
    const score = props.score || 0;
    if (score >= 80) return 'var(--color-success)';
    if (score >= 60) return 'var(--color-warning)';
    return 'var(--color-error)';
  }};
`;

const CSATMax = styled.span`
  font-size: 1rem;
  color: var(--color-muted);
  font-weight: 500;
`;

const CSATReason = styled.div`
  font-size: 0.8125rem;
  color: var(--color-text-primary);
  line-height: 1.5;
  padding-top: var(--space-xs);
  border-top: 1px solid var(--color-border);
`;

const MetricsSummary = styled.div`
  display: flex;
  gap: var(--space-md);
  flex-wrap: wrap;
`;

const MetricBadge = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  padding: var(--space-sm) var(--space-md);
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
  min-width: 120px;
`;

const MetricLabel = styled.span`
  font-size: 0.75rem;
  color: var(--color-muted);
  font-weight: 500;
`;

const MetricValue = styled.span`
  font-size: 1.25rem;
  font-weight: 700;
  color: ${props => props.color || 'var(--color-text-primary)'};
`;

const ExpandButton = styled.button`
  background: var(--color-bg-tertiary);
  border: 1px solid var(--color-border);
  color: var(--color-accent);
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  padding: var(--space-xs) var(--space-md);
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  
  &:hover {
    background: var(--color-bg-secondary);
    border-color: var(--color-accent);
    color: var(--color-accent-hover);
  }
`;

const DetailsSection = styled.div`
  margin-top: var(--space-lg);
  padding-top: var(--space-lg);
  border-top: 2px solid var(--color-border);
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
`;

const DetailsTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--space-sm);
`;

const CriterionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
`;

const CriteriaTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: var(--space-sm);
  font-size: 0.875rem;
`;

const TableHeader = styled.thead`
  background: var(--color-bg-tertiary);
`;

const TableHeaderRow = styled.tr`
  border-bottom: 2px solid var(--color-border);
`;

const TableHeaderCell = styled.th`
  padding: var(--space-sm) var(--space-md);
  text-align: left;
  font-weight: 600;
  color: var(--color-text-primary);
  font-size: 0.8125rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  &:first-child {
    width: 40px;
  }
  
  &:nth-child(2) {
    width: 60px;
  }
`;

const TableBody = styled.tbody``;

const TableRow = styled.tr`
  border-bottom: 1px solid var(--color-border);
  transition: background-color var(--transition-fast);
  
  &:hover {
    background: var(--color-bg-tertiary);
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const TableCell = styled.td`
  padding: var(--space-md);
  color: var(--color-text-primary);
  vertical-align: top;
  
  &:first-child {
    text-align: center;
  }
  
  &:nth-child(2) {
    text-align: center;
    font-weight: 600;
  }
`;

const StatusCell = styled(TableCell)`
  color: ${props => props.passed 
    ? 'var(--color-success)' 
    : 'var(--color-error)'};
  font-weight: 600;
`;

const CriterionTextCell = styled(TableCell)`
  max-width: 0;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  
  @media (min-width: 768px) {
    white-space: normal;
  }
`;

const SummarySection = styled.div`
  margin-top: var(--space-lg);
  padding: var(--space-md);
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
`;

const SummaryTitle = styled.h4`
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--space-sm);
`;

const SummaryText = styled.p`
  font-size: 0.875rem;
  color: var(--color-text-primary);
  line-height: 1.6;
  margin: 0;
`;

const StrengthsWeaknessesSection = styled.div`
  margin-top: var(--space-lg);
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-md);
  
  @media (min-width: 768px) {
    grid-template-columns: 1fr 1fr;
  }
`;

const StrengthsCard = styled.div`
  padding: var(--space-md);
  background: rgba(34, 197, 94, 0.05);
  border: 1px solid rgba(34, 197, 94, 0.2);
  border-radius: var(--radius-md);
`;

const WeaknessesCard = styled.div`
  padding: var(--space-md);
  background: rgba(239, 68, 68, 0.05);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: var(--radius-md);
`;

const SectionTitle = styled.h5`
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--space-sm);
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  
  &::before {
    content: '${props => props.type === 'strengths' ? '✓' : '✗'}';
    font-size: 1rem;
    color: ${props => props.type === 'strengths' ? 'var(--color-success)' : 'var(--color-error)'};
  }
`;

const BulletList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const ListItem = styled.li`
  font-size: 0.8125rem;
  color: var(--color-text-primary);
  line-height: 1.6;
  margin-bottom: var(--space-xs);
  position: relative;
  padding-left: var(--space-md);
  
  &::before {
    content: '•';
    position: absolute;
    left: 0;
    color: var(--color-muted);
  }
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const CriterionItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  padding: var(--space-md);
  background: ${props => props.passed 
    ? 'rgba(34, 197, 94, 0.05)' 
    : 'rgba(239, 68, 68, 0.05)'};
  border: 1px solid ${props => props.passed 
    ? 'rgba(34, 197, 94, 0.2)' 
    : 'rgba(239, 68, 68, 0.2)'};
  border-radius: var(--radius-md);
  transition: all var(--transition-fast);
  
  &:hover {
    border-color: ${props => props.passed 
      ? 'rgba(34, 197, 94, 0.4)' 
      : 'rgba(239, 68, 68, 0.4)'};
    transform: translateY(-1px);
  }
`;

const CriterionHeader = styled.div`
  display: flex;
  align-items: flex-start;
  gap: var(--space-sm);
`;

const CriterionIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${props => props.passed 
    ? 'rgba(34, 197, 94, 0.15)' 
    : 'rgba(239, 68, 68, 0.15)'};
  color: ${props => props.passed 
    ? 'var(--color-success)' 
    : 'var(--color-error)'};
  font-weight: bold;
  font-size: 0.875rem;
  flex-shrink: 0;
`;

const CriterionText = styled.span`
  color: var(--color-text-primary);
  flex: 1;
  font-weight: 500;
  line-height: 1.5;
`;

const CriterionDetails = styled.div`
  margin-left: 2rem;
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
`;

const CriterionEvidence = styled.div`
  font-size: 0.8125rem;
  color: var(--color-text-primary);
  padding: var(--space-xs) var(--space-sm);
  background: var(--color-bg-secondary);
  border-left: 3px solid var(--color-accent);
  border-radius: var(--radius-sm);
  font-style: italic;
`;

const CriterionReasoning = styled.div`
  font-size: 0.75rem;
  color: var(--color-muted);
  line-height: 1.5;
`;

const ErrorMessage = styled.div`
  padding: var(--space-sm);
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid var(--color-error);
  border-radius: var(--radius-md);
  color: var(--color-error);
  font-size: 0.875rem;
  margin-top: var(--space-sm);
`;

const AnalyzeButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-xs) var(--space-sm);
  background: var(--color-accent);
  border: none;
  border-radius: var(--radius-md);
  color: white;
  font-size: 0.8125rem;
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
    width: 14px;
    height: 14px;
  }
  
  &.loading svg {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const ViewCallDetailsButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-xs) var(--space-sm);
  background: var(--color-bg-tertiary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover:not(:disabled) {
    background: var(--color-accent-soft);
    border-color: var(--color-accent);
    color: var(--color-accent);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  svg {
    width: 14px;
    height: 14px;
  }
`;

const CardHeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
`;

const CallAnalysisCard = ({ result, callId, callIdDisplay, jobId, onAnalyze, onExpand, onViewCallDetails, autoExpand = false }) => {
  const [expanded, setExpanded] = useState(autoExpand);
  const [analyzing, setAnalyzing] = useState(false);
  const [analyzeError, setAnalyzeError] = useState(null);
  
  // Auto-expand when autoExpand prop changes to true
  useEffect(() => {
    if (autoExpand && !expanded) {
      setExpanded(true);
    }
  }, [autoExpand, expanded]);
  
  const {
    call_id: result_call_id,
    passed,
    csat_score,
    csat_reason,
    agent_should_results = [],
    agent_should_not_results = [],
    evaluation_details = {},
    error_message,
  } = result || {};
  
  const strengths = evaluation_details?.strengths || [];
  const weaknesses = evaluation_details?.weaknesses || [];
  const summary = evaluation_details?.summary || '';
  
  // Debug logging (remove in production)
  if (result && expanded) {
    console.log('CallAnalysisCard expanded data:', {
      hasEvaluationDetails: !!evaluation_details,
      summary: summary ? summary.substring(0, 50) + '...' : 'none',
      strengthsCount: strengths.length,
      weaknessesCount: weaknesses.length,
      agentShouldCount: agent_should_results.length,
      agentShouldNotCount: agent_should_not_results.length,
      evaluation_details_keys: evaluation_details ? Object.keys(evaluation_details) : [],
    });
  }
  
  // Use callIdDisplay prop for display, fallback to result.call_id or callId
  const display_call_id = callIdDisplay || result_call_id || callId;
  // Use callId (UUID) for API calls, fallback to result.call_id
  const api_call_id = callId || result_call_id;
  const hasAnalysis = result && result_call_id;
  
  const handleExpand = () => {
    setExpanded(!expanded);
    if (onExpand && !expanded) {
      onExpand(display_call_id);
    }
  };
  
  const handleAnalyze = async () => {
    if (!api_call_id || analyzing) return;
    
    setAnalyzing(true);
    setAnalyzeError(null);
    
    try {
      const analysisResult = await triggerCallAnalysis(api_call_id);
      if (onAnalyze) {
        onAnalyze(api_call_id, analysisResult);
      }
    } catch (err) {
      console.error('Failed to trigger analysis:', err);
      setAnalyzeError(err.response?.data?.detail || err.message || 'Failed to trigger analysis');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleViewCallDetails = () => {
    if (onViewCallDetails && api_call_id) {
      onViewCallDetails(api_call_id, jobId);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CallId>{display_call_id}</CallId>
        <CardHeaderActions>
          {hasAnalysis && onViewCallDetails && (
            <ViewCallDetailsButton onClick={handleViewCallDetails}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              View Simulation Details
            </ViewCallDetailsButton>
          )}
          {hasAnalysis ? (
            <StatusBadge passed={passed}>
              {passed ? 'Passed' : 'Failed'}
            </StatusBadge>
          ) : (
            <AnalyzeButton onClick={handleAnalyze} disabled={analyzing} className={analyzing ? 'loading' : ''}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="23,4 23,10 17,10" />
                <polyline points="1,20 1,14 7,14" />
                <path d="m3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
              </svg>
              {analyzing ? 'Analyzing...' : 'Analyze'}
            </AnalyzeButton>
          )}
        </CardHeaderActions>
      </CardHeader>
      
      {analyzeError && (
        <ErrorMessage style={{ marginTop: 'var(--space-sm)' }}>
          {analyzeError}
        </ErrorMessage>
      )}
      
      {hasAnalysis && (
        <>
          <MetricsSection>
            <MetricsRow>
              <CSATCard>
                <CSATLabel>Customer Satisfaction Score</CSATLabel>
                <CSATRow>
                  <CSATScore score={csat_score}>{csat_score}</CSATScore>
                  <CSATMax>/100</CSATMax>
                </CSATRow>
                {csat_reason && (
                  <CSATReason>{csat_reason}</CSATReason>
                )}
              </CSATCard>
              
              {(agent_should_results.length > 0 || agent_should_not_results.length > 0) && (
                <MetricsSummary>
                  {agent_should_results.length > 0 && (
                    <MetricBadge>
                      <MetricLabel>Agent Should</MetricLabel>
                      <MetricValue color={agent_should_results.filter(r => r.passed).length === agent_should_results.length ? 'var(--color-success)' : 'var(--color-warning)'}>
                        {agent_should_results.filter(r => r.passed).length}/{agent_should_results.length}
                      </MetricValue>
                    </MetricBadge>
                  )}
                  {agent_should_not_results.length > 0 && (
                    <MetricBadge>
                      <MetricLabel>Agent Should Not</MetricLabel>
                      <MetricValue color={agent_should_not_results.filter(r => r.passed).length === agent_should_not_results.length ? 'var(--color-success)' : 'var(--color-error)'}>
                        {agent_should_not_results.filter(r => r.passed).length}/{agent_should_not_results.length}
                      </MetricValue>
                    </MetricBadge>
                  )}
                </MetricsSummary>
              )}
            </MetricsRow>
            
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 'var(--space-sm)' }}>
              <ExpandButton onClick={handleExpand}>
                {expanded ? '▼ Hide Details' : '▶ Show Details'}
              </ExpandButton>
            </div>
          </MetricsSection>
          
          {error_message && (
            <ErrorMessage>
              Error: {error_message}
            </ErrorMessage>
          )}
        </>
      )}
      
      {!hasAnalysis && !analyzing && (
        <div style={{ marginTop: 'var(--space-sm)', color: 'var(--color-muted)', fontSize: '0.875rem' }}>
          No analysis available. Click "Analyze" to trigger analysis for this call.
        </div>
      )}
      
      {hasAnalysis && expanded && (
        <DetailsSection>
          {summary ? (
            <SummarySection>
              <SummaryTitle>Overall Summary</SummaryTitle>
              <SummaryText>{summary}</SummaryText>
            </SummarySection>
          ) : null}
          
          {(strengths.length > 0 || weaknesses.length > 0) ? (
            <StrengthsWeaknessesSection>
              {strengths.length > 0 && (
                <StrengthsCard>
                  <SectionTitle type="strengths">Strengths</SectionTitle>
                  <BulletList>
                    {strengths.map((strength, idx) => (
                      <ListItem key={idx}>{strength}</ListItem>
                    ))}
                  </BulletList>
                </StrengthsCard>
              )}
              
              {weaknesses.length > 0 && (
                <WeaknessesCard>
                  <SectionTitle type="weaknesses">Weaknesses</SectionTitle>
                  <BulletList>
                    {weaknesses.map((weakness, idx) => (
                      <ListItem key={idx}>{weakness}</ListItem>
                    ))}
                  </BulletList>
                </WeaknessesCard>
              )}
            </StrengthsWeaknessesSection>
          ) : null}
          
          {agent_should_results.length > 0 ? (
            <>
              <DetailsTitle>
                Agent Should Criteria
                <span style={{ marginLeft: 'var(--space-sm)', fontSize: '0.875rem', fontWeight: 'normal', color: 'var(--color-muted)' }}>
                  ({agent_should_results.filter(r => r.passed).length}/{agent_should_results.length} passed)
                </span>
              </DetailsTitle>
              <CriteriaTable>
                <TableHeader>
                  <TableHeaderRow>
                    <TableHeaderCell>#</TableHeaderCell>
                    <TableHeaderCell>Status</TableHeaderCell>
                    <TableHeaderCell>Criterion</TableHeaderCell>
                    <TableHeaderCell>Evidence</TableHeaderCell>
                    <TableHeaderCell>Reasoning</TableHeaderCell>
                  </TableHeaderRow>
                </TableHeader>
                <TableBody>
                  {agent_should_results.map((criterion, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{idx + 1}</TableCell>
                      <StatusCell passed={criterion.passed}>
                        {criterion.passed ? '✓ Pass' : '✗ Fail'}
                      </StatusCell>
                      <CriterionTextCell>{criterion.criterion}</CriterionTextCell>
                      <TableCell>
                        {criterion.evidence ? (
                          <div style={{ fontSize: '0.8125rem', color: 'var(--color-muted)', fontStyle: 'italic' }}>
                            {criterion.evidence}
                          </div>
                        ) : (
                          <span style={{ color: 'var(--color-muted)' }}>—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {criterion.reasoning ? (
                          <div style={{ fontSize: '0.8125rem', color: 'var(--color-muted)' }}>
                            {criterion.reasoning}
                          </div>
                        ) : (
                          <span style={{ color: 'var(--color-muted)' }}>—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </CriteriaTable>
            </>
          ) : null}
          
          {agent_should_not_results.length > 0 ? (
            <>
              <DetailsTitle style={{ marginTop: 'var(--space-lg)' }}>
                Agent Should Not Criteria
                <span style={{ marginLeft: 'var(--space-sm)', fontSize: '0.875rem', fontWeight: 'normal', color: 'var(--color-muted)' }}>
                  ({agent_should_not_results.filter(r => r.passed).length}/{agent_should_not_results.length} no violations)
                </span>
              </DetailsTitle>
              <CriteriaTable>
                <TableHeader>
                  <TableHeaderRow>
                    <TableHeaderCell>#</TableHeaderCell>
                    <TableHeaderCell>Status</TableHeaderCell>
                    <TableHeaderCell>Criterion</TableHeaderCell>
                    <TableHeaderCell>Evidence</TableHeaderCell>
                    <TableHeaderCell>Reasoning</TableHeaderCell>
                  </TableHeaderRow>
                </TableHeader>
                <TableBody>
                  {agent_should_not_results.map((criterion, idx) => (
                    <TableRow key={idx}>
                      <TableCell>{idx + 1}</TableCell>
                      <StatusCell passed={criterion.passed}>
                        {criterion.passed ? '✓ No Violation' : '✗ Violated'}
                      </StatusCell>
                      <CriterionTextCell>{criterion.criterion}</CriterionTextCell>
                      <TableCell>
                        {criterion.evidence ? (
                          <div style={{ fontSize: '0.8125rem', color: 'var(--color-muted)', fontStyle: 'italic' }}>
                            {criterion.evidence}
                          </div>
                        ) : (
                          <span style={{ color: 'var(--color-muted)' }}>—</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {criterion.reasoning ? (
                          <div style={{ fontSize: '0.8125rem', color: 'var(--color-muted)' }}>
                            {criterion.reasoning}
                          </div>
                        ) : (
                          <span style={{ color: 'var(--color-muted)' }}>—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </CriteriaTable>
            </>
          ) : null}
          
          {!summary && strengths.length === 0 && weaknesses.length === 0 && agent_should_results.length === 0 && agent_should_not_results.length === 0 && (
            <div style={{ padding: 'var(--space-md)', textAlign: 'center', color: 'var(--color-muted)', fontSize: '0.875rem' }}>
              No detailed analysis data available. The analysis may have been created with an older format.
            </div>
          )}
        </DetailsSection>
      )}
    </Card>
  );
};

export default CallAnalysisCard;

