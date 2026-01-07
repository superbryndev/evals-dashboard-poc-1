import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { getJobPayload } from '../services/api';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(13, 13, 13, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--space-lg);
  animation: fadeIn var(--transition-normal);
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ModalContainer = styled.div`
  background: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  max-width: 600px;
  width: 100%;
  max-height: 80vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: slideUp var(--transition-normal);
  
  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const ModalHeader = styled.div`
  padding: var(--space-lg);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-shrink: 0;
`;

const ModalTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
`;

const StatusBadge = styled.span`
  font-size: 0.75rem;
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-full);
  background: ${props => props.hasPayload ? 'rgba(34, 197, 94, 0.1)' : 'rgba(245, 158, 11, 0.1)'};
  color: ${props => props.hasPayload ? 'var(--color-success)' : 'var(--color-warning)'};
  font-weight: 500;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: var(--color-muted);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
  
  &:hover {
    background: var(--color-bg-secondary);
    color: var(--color-text-primary);
  }
`;

const ModalBody = styled.div`
  padding: var(--space-lg);
  overflow-y: auto;
  flex: 1;
`;

const PayloadContainer = styled.div`
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  color: var(--color-text-primary);
  white-space: pre-wrap;
  overflow-x: auto;
  border: 1px solid var(--color-border);
  position: relative;
`;

const CopyButton = styled.button`
  position: absolute;
  top: var(--space-sm);
  right: var(--space-sm);
  padding: var(--space-xs) var(--space-sm);
  background: var(--color-bg-tertiary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-text-secondary);
  font-size: 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  transition: all var(--transition-fast);
  
  &:hover {
    background: var(--color-accent);
    color: white;
    border-color: var(--color-accent);
  }
  
  &.copied {
    background: var(--color-success);
    color: white;
    border-color: var(--color-success);
  }
`;

const EmptyState = styled.div`
  text-align: center;
  padding: var(--space-xl);
  color: var(--color-muted);
`;

const EmptyIcon = styled.div`
  font-size: 2rem;
  margin-bottom: var(--space-md);
`;

const LoadingState = styled.div`
  text-align: center;
  padding: var(--space-xl);
  color: var(--color-muted);
`;

const Spinner = styled.div`
  width: 32px;
  height: 32px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin: 0 auto var(--space-md);
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const ScenarioSection = styled.div`
  margin-top: var(--space-lg);
  padding-top: var(--space-lg);
  border-top: 1px solid var(--color-border);
`;

const SectionTitle = styled.h4`
  font-size: 0.8125rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: var(--space-md);
`;

const ScenarioPreview = styled.div`
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  border: 1px solid var(--color-border);
`;

const ScenarioField = styled.div`
  margin-bottom: var(--space-sm);
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const FieldLabel = styled.span`
  font-weight: 500;
  color: var(--color-text-primary);
`;

const CopyIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const CheckIcon = () => (
  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20,6 9,17 4,12" />
  </svg>
);

const PayloadViewerModal = ({
  isOpen,
  onClose,
  jobId,
  scenarioName,
}) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && jobId) {
      loadPayload();
    }
  }, [isOpen, jobId]);

  const loadPayload = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getJobPayload(jobId);
      setData(result);
    } catch (err) {
      setError(err.message || 'Failed to load payload');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = async () => {
    if (data?.payload) {
      try {
        await navigator.clipboard.writeText(JSON.stringify(data.payload, null, 2));
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy:', err);
      }
    }
  };

  const handleClose = () => {
    setData(null);
    setError(null);
    setLoading(true);
    onClose();
  };

  if (!isOpen) return null;

  const hasPayload = data?.payload && Object.keys(data.payload).length > 0;

  return (
    <Overlay onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            {scenarioName || 'Job'} Payload
            {!loading && (
              <StatusBadge hasPayload={hasPayload}>
                {hasPayload ? 'Generated' : 'No Payload'}
              </StatusBadge>
            )}
          </ModalTitle>
          <CloseButton onClick={handleClose}>×</CloseButton>
        </ModalHeader>

        <ModalBody>
          {loading && (
            <LoadingState>
              <Spinner />
              <div>Loading payload...</div>
            </LoadingState>
          )}

          {error && (
            <EmptyState>
              <EmptyIcon>⚠️</EmptyIcon>
              <div>{error}</div>
            </EmptyState>
          )}

          {!loading && !error && !hasPayload && (
            <EmptyState>
              <EmptyIcon>📝</EmptyIcon>
              <div>No payload generated yet</div>
              <div style={{ fontSize: '0.8125rem', marginTop: 'var(--space-sm)' }}>
                Use "Generate Payloads" to create AI-generated test data
              </div>
            </EmptyState>
          )}

          {!loading && !error && hasPayload && (
            <>
              <PayloadContainer>
                <CopyButton 
                  onClick={handleCopy}
                  className={copied ? 'copied' : ''}
                >
                  {copied ? <CheckIcon /> : <CopyIcon />}
                  {copied ? 'Copied!' : 'Copy'}
                </CopyButton>
                {JSON.stringify(data.payload, null, 2)}
              </PayloadContainer>

              {data.scenario_snapshot && (
                <ScenarioSection>
                  <SectionTitle>Scenario Context</SectionTitle>
                  <ScenarioPreview>
                    {data.scenario_snapshot.background && (
                      <ScenarioField>
                        <FieldLabel>Background: </FieldLabel>
                        {data.scenario_snapshot.background}
                      </ScenarioField>
                    )}
                    {data.scenario_snapshot.simulation_context?.caller_profile?.persona && (
                      <ScenarioField>
                        <FieldLabel>Persona: </FieldLabel>
                        {data.scenario_snapshot.simulation_context.caller_profile.persona}
                      </ScenarioField>
                    )}
                    {data.scenario_snapshot.simulation_context?.scenario?.situation && (
                      <ScenarioField>
                        <FieldLabel>Situation: </FieldLabel>
                        {data.scenario_snapshot.simulation_context.scenario.situation}
                      </ScenarioField>
                    )}
                  </ScenarioPreview>
                </ScenarioSection>
              )}
            </>
          )}
        </ModalBody>
      </ModalContainer>
    </Overlay>
  );
};

export default PayloadViewerModal;

