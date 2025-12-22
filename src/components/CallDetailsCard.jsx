import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { fetchCallAnalytics, evaluateCall } from '../services/api';
import TranscriptViewer from './TranscriptViewer';
import CallEvaluationCard from './CallEvaluationCard';
import LoadingSpinner from './LoadingSpinner';
import WaveformPlayer from './WaveformPlayer';

const DetailsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
  padding-top: var(--space-md);
`;

const Section = styled.div`
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-md);
`;

const SectionTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--space-md);
  display: flex;
  align-items: center;
  gap: var(--space-sm);
`;

const Icon = styled.span`
  font-size: 1rem;
`;

const MetricsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-sm);
`;

const MetricItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  
  .label {
    font-size: 0.6875rem;
    font-weight: 500;
    color: var(--color-muted);
    text-transform: uppercase;
    letter-spacing: 0.5px;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  
  .value {
    font-size: 0.9375rem;
    font-weight: 600;
    color: var(--color-text-primary);
    font-family: var(--font-mono);
  }
`;

const InfoIcon = styled.span`
  position: relative;
  display: inline-flex;
  cursor: help;
  
  svg {
    width: 12px;
    height: 12px;
    color: var(--color-muted);
    opacity: 0.7;
    transition: opacity var(--transition-fast);
  }
  
  &:hover svg {
    opacity: 1;
    color: var(--color-accent);
  }
  
  &:hover .tooltip {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) translateY(0);
  }
`;

const Tooltip = styled.span`
  position: absolute;
  bottom: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%) translateY(4px);
  background: var(--color-ink);
  color: var(--color-paper);
  padding: 6px 10px;
  border-radius: var(--radius-sm);
  font-size: 0.6875rem;
  font-weight: 400;
  text-transform: none;
  letter-spacing: normal;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all var(--transition-fast);
  z-index: 100;
  box-shadow: var(--shadow-md);
  
  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border: 5px solid transparent;
    border-top-color: var(--color-ink);
  }
`;

const InfoIconWithTooltip = ({ tooltip }) => (
  <InfoIcon>
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
    <Tooltip className="tooltip">{tooltip}</Tooltip>
  </InfoIcon>
);

const RecordingSection = styled.div`
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  padding: var(--space-md);
`;

const NoRecording = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 60px;
  background: var(--color-bg-secondary);
  border-radius: var(--radius-sm);
  color: var(--color-muted);
  font-size: 0.8125rem;
`;

const EvaluateButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-sm);
  width: 100%;
  padding: var(--space-md);
  background: var(--color-accent);
  border: none;
  border-radius: var(--radius-md);
  color: white;
  font-size: 0.9375rem;
  font-weight: 600;
  transition: all var(--transition-fast);
  
  &:hover:not(:disabled) {
    background: var(--color-accent-hover);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const ErrorText = styled.p`
  color: var(--color-error);
  font-size: 0.8125rem;
  text-align: center;
  padding: var(--space-md);
`;

const formatDuration = (seconds) => {
  if (!seconds) return '-';
  const mins = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
};

const formatLatency = (ms) => {
  if (!ms) return '-';
  return `${Math.round(ms)}ms`;
};

const CallDetailsCard = ({ job, call, scenario }) => {
  const [analytics, setAnalytics] = useState(null);
  const [evaluation, setEvaluation] = useState(null);
  const [loading, setLoading] = useState(false);
  const [evaluating, setEvaluating] = useState(false);
  const [error, setError] = useState(null);

  const isCompleted = ['completed', 'failed', 'no_answer'].includes(job?.status);

  // Debug: Log props when component mounts or updates
  useEffect(() => {
    console.log('CallDetailsCard props:', {
      jobStatus: job?.status,
      isCompleted,
      callId: call?.call_id,
      callIdAlt: call?.id,
      roomName: call?.room_name,
      hasCallAnalytics: !!call?.analytics,
      scenarioGoals: scenario?.evaluation_criteria?.agent_should?.length || 
                     scenario?.evaluation_criteria?.agent_should_not?.length ||
                     scenario?.expected_agent_goals?.length || 0,
    });
  }, [job?.status, call?.call_id, call?.id, call?.room_name, scenario, isCompleted]);

  useEffect(() => {
    const loadAnalytics = async () => {
      // Try call_id first, then id, then room_name as fallback
      const callIdentifier = call?.call_id || call?.id || call?.room_name;
      
      if (!callIdentifier || !isCompleted) {
        console.log('Skipping analytics load:', { callIdentifier, isCompleted });
        return;
      }
      
      setLoading(true);
      setError(null);
      
      try {
        console.log('Loading analytics for call:', callIdentifier);
        const data = await fetchCallAnalytics(callIdentifier);
        console.log('Analytics loaded:', data);
        setAnalytics(data);
        
        // Check if there's a cached evaluation in the analytics
        const evalData = data.analytics?.evaluation || (typeof data.analytics === 'object' && data.analytics?.evaluation);
        if (evalData) {
          setEvaluation({
            ...evalData,
            cached: true,
          });
        }
      } catch (err) {
        console.error('Failed to load analytics:', err);
        setError(err.response?.data?.detail || err.message || 'Failed to load call analytics');
      } finally {
        setLoading(false);
      }
    };
    
    loadAnalytics();
  }, [call?.call_id, call?.id, call?.room_name, isCompleted]);

  const handleEvaluate = async (forceRefresh = false) => {
    const callIdentifier = call?.call_id || call?.id || call?.room_name;
    if (!callIdentifier) {
      console.error('No call identifier available for evaluation');
      return;
    }
    
    setEvaluating(true);
    setError(null);
    
    try {
      console.log('Evaluating call:', callIdentifier);
      const result = await evaluateCall(callIdentifier, forceRefresh);
      console.log('Evaluation result:', result);
      setEvaluation(result);
    } catch (err) {
      console.error('Failed to evaluate call:', err);
      setError(err.response?.data?.detail || err.message || 'Failed to evaluate call');
    } finally {
      setEvaluating(false);
    }
  };

  if (!isCompleted) {
    return (
      <DetailsContainer>
        <NoRecording>
          Call is still in progress. Details will be available once completed.
        </NoRecording>
      </DetailsContainer>
    );
  }

  // Analytics can come from API response (analytics.analytics) or from call object (call.analytics)
  // Also check raw analytics if structured ones don't have the data
  const callAnalytics = analytics?.analytics || call?.analytics || {};
  const rawAnalytics = typeof callAnalytics === 'object' ? callAnalytics : {};
  
  // Extract nested data properly - check both structured and raw formats
  const transcript = callAnalytics?.transcript || rawAnalytics?.transcript || [];
  const recording = callAnalytics?.recording || rawAnalytics?.recording || {};
  
  // Try multiple paths for agent_latencies
  const agentLatencies = 
    callAnalytics?.agent_latencies || 
    rawAnalytics?.agent_latencies || 
    analytics?.agent_latencies ||
    call?.analytics?.agent_latencies ||
    {};
  
  const timing = callAnalytics?.timing || rawAnalytics?.timing || {};
  
  // Get duration from analytics timing, fall back to call.duration_seconds
  const callDuration = timing?.duration_seconds || call?.duration_seconds || analytics?.duration_seconds;
  
  // Debug logging
  if (analytics || call?.analytics) {
    console.log('Analytics loaded:', {
      hasAnalytics: !!analytics?.analytics,
      hasCallAnalytics: !!call?.analytics,
      callAnalyticsKeys: Object.keys(callAnalytics),
      rawAnalyticsKeys: Object.keys(rawAnalytics),
      agentLatencies: agentLatencies,
      agentLatenciesAvg: agentLatencies?.avg_ms,
      agentLatenciesKeys: Object.keys(agentLatencies),
      timing: timing,
      callDuration: callDuration,
    });
  }

  return (
    <DetailsContainer>
      {error && <ErrorText>{error}</ErrorText>}
      
      {loading && (
        <div style={{ padding: 'var(--space-lg)', textAlign: 'center' }}>
          <LoadingSpinner message="Loading call analytics..." />
        </div>
      )}
      
      {/* Recording Section - Full Width */}
      <RecordingSection>
        <SectionTitle>
          <Icon>🎙️</Icon>
          Recording
        </SectionTitle>
        {loading ? (
          <NoRecording>Loading...</NoRecording>
        ) : (
          <WaveformPlayer 
            src={recording?.url} 
            duration={callDuration}
          />
        )}
      </RecordingSection>
      
      {/* Metrics Section */}
      <Section>
        <SectionTitle>
          <Icon>📊</Icon>
          Call Metrics
        </SectionTitle>
        <MetricsGrid>
          <MetricItem>
            <span className="label">Duration</span>
            <span className="value">{formatDuration(callDuration)}</span>
          </MetricItem>
          <MetricItem>
            <span className="label">
              Avg Agent Latency
              <InfoIconWithTooltip tooltip="Average time for agent to respond to user" />
            </span>
            <span className="value">{formatLatency(agentLatencies?.avg_ms)}</span>
          </MetricItem>
        </MetricsGrid>
      </Section>
      
      {/* Transcript Section */}
      <Section>
        <SectionTitle>
          <Icon>💬</Icon>
          Transcript
        </SectionTitle>
        {loading ? (
          <div style={{ padding: 'var(--space-lg)', textAlign: 'center', color: 'var(--color-muted)' }}>
            Loading transcript...
          </div>
        ) : (
          <TranscriptViewer transcript={transcript} />
        )}
      </Section>
      
      {/* Evaluation Section */}
      {loading ? (
        <div style={{ padding: 'var(--space-lg)', textAlign: 'center', color: 'var(--color-muted)' }}>
          Loading evaluation options...
        </div>
      ) : evaluation ? (
        <CallEvaluationCard 
          evaluation={evaluation}
          onReEvaluate={() => handleEvaluate(true)}
          isLoading={evaluating}
        />
      ) : (
        <div>
          {(() => {
            // Check for evaluation criteria in new format or legacy format
            const hasCriteria = scenario?.evaluation_criteria?.agent_should?.length > 0 || 
                               scenario?.evaluation_criteria?.agent_should_not?.length > 0 ||
                               scenario?.expected_agent_goals?.length > 0;
            return (
              <>
                <EvaluateButton 
                  onClick={() => handleEvaluate(false)}
                  disabled={evaluating || !hasCriteria}
                >
                  {evaluating ? 'Evaluating...' : '🧠 Run AI Evaluation'}
                </EvaluateButton>
                {!hasCriteria && (
                  <p style={{ 
                    marginTop: 'var(--space-sm)', 
                    fontSize: '0.8125rem', 
                    color: 'var(--color-muted)',
                    textAlign: 'center'
                  }}>
                    No evaluation criteria defined for this scenario
                  </p>
                )}
              </>
            );
          })()}
        </div>
      )}
    </DetailsContainer>
  );
};

export default CallDetailsCard;

