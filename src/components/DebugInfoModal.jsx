import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const fadeIn = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

const slideUp = keyframes`
  from { 
    transform: translateY(24px) scale(0.98);
    opacity: 0;
  }
  to { 
    transform: translateY(0) scale(1);
    opacity: 1;
  }
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(13, 13, 13, 0.6);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--space-lg);
  animation: ${fadeIn} 200ms ease-out;
`;

const ModalContainer = styled.div`
  background: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg), 0 0 0 1px var(--color-border);
  max-width: 480px;
  width: 100%;
  display: flex;
  flex-direction: column;
  animation: ${slideUp} 300ms cubic-bezier(0.16, 1, 0.3, 1);
`;

const ModalHeader = styled.div`
  padding: var(--space-lg) var(--space-xl);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const ModalTitle = styled.h3`
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
`;

const CloseButton = styled.button`
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  width: 28px;
  height: 28px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--color-muted);
  transition: all var(--transition-fast);
  flex-shrink: 0;
  
  &:hover {
    background: var(--color-bg-tertiary);
    color: var(--color-text-primary);
    border-color: var(--color-accent);
  }
  
  svg {
    width: 14px;
    height: 14px;
  }
`;

const ModalBody = styled.div`
  padding: var(--space-xl);
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
`;

const InfoSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
`;

const InfoLabel = styled.label`
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--color-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const InfoValue = styled.div`
  font-size: 0.875rem;
  color: var(--color-text-primary);
  font-family: var(--font-mono);
  padding: var(--space-sm) var(--space-md);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  word-break: break-all;
`;

const InfoValueEmpty = styled(InfoValue)`
  color: var(--color-muted);
  font-style: italic;
`;

const CopyButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-xs);
  padding: var(--space-sm) var(--space-md);
  background: var(--color-accent);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    background: var(--color-accent-hover);
  }
  
  &:active {
    transform: scale(0.98);
  }
  
  svg {
    width: 14px;
    height: 14px;
  }
  
  &.copied {
    background: var(--color-success);
    
    &:hover {
      background: var(--color-success);
    }
  }
`;

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

const CopyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const DebugInfoModal = ({ isOpen, onClose, job }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setCopied(false);
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen || !job) return null;

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Extract prompt from multiple possible locations
  const getPrompt = () => {
    // Priority 1: Direct job field
    if (job.generated_prompt) {
      return job.generated_prompt;
    }
    
    // Priority 2: Check scenario_snapshot for prompt
    const scenarioSnapshot = job.scenario_snapshot || {};
    if (scenarioSnapshot.generated_prompt) {
      return scenarioSnapshot.generated_prompt;
    }
    
    // Priority 3: Check if prompt is in scenario context
    if (scenarioSnapshot.simulation_context?.prompt) {
      return scenarioSnapshot.simulation_context.prompt;
    }
    
    // Priority 4: Check for any prompt field in scenario snapshot
    if (scenarioSnapshot.prompt) {
      return scenarioSnapshot.prompt;
    }
    
    // Priority 5: Check call context if available
    if (job.call?.context?.generated_prompt) {
      return job.call.context.generated_prompt;
    }
    
    return null;
  };

  const handleCopyPrompt = async () => {
    const prompt = getPrompt();
    if (prompt) {
      try {
        await navigator.clipboard.writeText(prompt);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy prompt:', err);
      }
    }
  };

  // Extract voice information
  const scenarioSnapshot = job.scenario_snapshot || {};
  const voiceId = job.tts_voice_id || scenarioSnapshot.tts_voice_id || null;
  const gender = job.gender || scenarioSnapshot.gender || scenarioSnapshot.simulation_context?.caller_profile?.gender || null;
  const language = job.language || scenarioSnapshot.language || null;
  const prompt = getPrompt();
  const hasPrompt = !!prompt;

  return (
    <Overlay onClick={handleOverlayClick}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>Debug Info</ModalTitle>
          <CloseButton onClick={onClose} aria-label="Close modal">
            <CloseIcon />
          </CloseButton>
        </ModalHeader>

        <ModalBody>
          <InfoSection>
            <InfoLabel>Voice ID</InfoLabel>
            {voiceId ? (
              <InfoValue>{voiceId}</InfoValue>
            ) : (
              <InfoValueEmpty>Not specified</InfoValueEmpty>
            )}
          </InfoSection>

          <InfoSection>
            <InfoLabel>Gender</InfoLabel>
            {gender ? (
              <InfoValue>{gender}</InfoValue>
            ) : (
              <InfoValueEmpty>Not specified</InfoValueEmpty>
            )}
          </InfoSection>

          {language && (
            <InfoSection>
              <InfoLabel>Language</InfoLabel>
              <InfoValue>{language}</InfoValue>
            </InfoSection>
          )}

          <InfoSection>
            <InfoLabel>Scenario Prompt</InfoLabel>
            <CopyButton
              onClick={handleCopyPrompt}
              disabled={!hasPrompt}
              className={copied ? 'copied' : ''}
            >
              {copied ? (
                <>
                  <CheckIcon />
                  Copied!
                </>
              ) : (
                <>
                  <CopyIcon />
                  {hasPrompt ? 'Copy Prompt' : 'No Prompt Available'}
                </>
              )}
            </CopyButton>
          </InfoSection>
        </ModalBody>
      </ModalContainer>
    </Overlay>
  );
};

export default DebugInfoModal;

