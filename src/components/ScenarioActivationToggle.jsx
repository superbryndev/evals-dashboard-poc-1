import React, { useState } from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
`;

const shimmer = keyframes`
  0% { background-position: -200% center; }
  100% { background-position: 200% center; }
`;

const ToggleContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
`;

const ToggleWrapper = styled.button`
  position: relative;
  width: 52px;
  height: 28px;
  border-radius: var(--radius-full);
  border: none;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  padding: 3px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;
  
  background: ${props => {
    if (props.loading) return 'var(--color-border)';
    if (props.active) return 'var(--color-success)';
    return 'var(--color-bg-tertiary)';
  }};
  
  box-shadow: ${props => {
    if (props.active) return '0 0 12px rgba(34, 197, 94, 0.3)';
    return 'inset 0 1px 3px rgba(0, 0, 0, 0.1)';
  }};
  
  opacity: ${props => props.disabled ? 0.5 : 1};
  
  &:hover:not(:disabled) {
    box-shadow: ${props => {
      if (props.active) return '0 0 16px rgba(34, 197, 94, 0.4)';
      return 'inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 0 8px rgba(133, 92, 241, 0.2)';
    }};
  }
  
  &:focus-visible {
    box-shadow: 0 0 0 3px var(--color-accent-soft);
  }
`;

const ToggleThumb = styled.div`
  position: absolute;
  top: 3px;
  left: ${props => props.active ? '27px' : '3px'};
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: white;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  
  ${props => props.loading && `
    animation: ${pulse} 1s ease-in-out infinite;
  `}
  
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 12px;
    height: 12px;
    color: ${props => {
      if (props.loading) return 'var(--color-muted)';
      if (props.active) return 'var(--color-success)';
      return 'var(--color-border)';
    }};
    transition: color 0.3s ease;
  }
`;

const StatusLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  min-width: 55px;
  text-align: center;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  transition: all 0.3s ease;
  
  ${props => props.loading && `
    background: linear-gradient(90deg, var(--color-bg-tertiary) 25%, var(--color-border) 50%, var(--color-bg-tertiary) 75%);
    background-size: 200% auto;
    animation: ${shimmer} 1.5s linear infinite;
    color: var(--color-muted);
  `}
  
  ${props => !props.loading && props.active && `
    background: rgba(34, 197, 94, 0.1);
    color: #166534;
  `}
  
  ${props => !props.loading && !props.active && `
    background: var(--color-bg-tertiary);
    color: var(--color-muted);
  `}
`;

const PhoneNumber = styled.button`
  font-size: 0.6875rem;
  font-family: var(--font-mono);
  color: var(--color-accent);
  background: var(--color-accent-soft);
  padding: 2px 6px;
  border-radius: var(--radius-sm);
  white-space: nowrap;
  max-width: 120px;
  overflow: hidden;
  text-overflow: ellipsis;
  border: none;
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    background: var(--color-accent);
    color: white;
    transform: scale(1.02);
  }
  
  &:active {
    transform: scale(0.98);
  }
`;

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const XIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);

/**
 * ScenarioActivationToggle - Inline toggle for activating/deactivating inbound scenarios
 * 
 * @param {Object} props
 * @param {string} props.jobId - The job UUID
 * @param {boolean} props.isActive - Whether the job is currently active
 * @param {string} props.assignedPhoneNumber - Phone number assigned to this job (if active)
 * @param {boolean} props.disabled - Disable toggle (e.g., when no phone slots available)
 * @param {string} props.disabledReason - Reason for being disabled (shown as tooltip)
 * @param {Function} props.onActivate - Called when toggling to active
 * @param {Function} props.onDeactivate - Called when toggling to inactive
 */
const ScenarioActivationToggle = ({
  jobId,
  isActive = false,
  assignedPhoneNumber = null,
  disabled = false,
  disabledReason = '',
  onActivate,
  onDeactivate,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleToggle = async (e) => {
    e.stopPropagation();
    
    if (disabled || loading) return;
    
    setLoading(true);
    setError(null);
    
    try {
      if (isActive) {
        await onDeactivate?.(jobId);
      } else {
        await onActivate?.(jobId);
      }
    } catch (err) {
      setError(err.message || 'Failed to update status');
      console.error('Toggle error:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusText = () => {
    if (loading) return isActive ? 'Stopping...' : 'Starting...';
    return isActive ? 'Active' : 'Inactive';
  };

  const handleCopyPhone = async (e) => {
    e.stopPropagation();
    
    if (!assignedPhoneNumber) return;
    
    try {
      await navigator.clipboard.writeText(assignedPhoneNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy phone number:', err);
    }
  };

  return (
    <ToggleContainer>
      <ToggleWrapper
        active={isActive}
        loading={loading}
        disabled={disabled || loading}
        onClick={handleToggle}
        title={disabled ? disabledReason : (isActive ? 'Click to deactivate' : 'Click to activate')}
        aria-label={isActive ? 'Deactivate scenario' : 'Activate scenario'}
        aria-pressed={isActive}
      >
        <ToggleThumb active={isActive} loading={loading}>
          {isActive ? <CheckIcon /> : <XIcon />}
        </ToggleThumb>
      </ToggleWrapper>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <StatusLabel active={isActive} loading={loading}>
          {getStatusText()}
        </StatusLabel>
        {isActive && assignedPhoneNumber && (
          <PhoneNumber 
            onClick={handleCopyPhone}
            title={copied ? 'Copied!' : 'Click to copy phone number'}
            aria-label="Copy phone number"
          >
            {copied ? '✓ Copied' : assignedPhoneNumber}
          </PhoneNumber>
        )}
      </div>
    </ToggleContainer>
  );
};

export default ScenarioActivationToggle;

