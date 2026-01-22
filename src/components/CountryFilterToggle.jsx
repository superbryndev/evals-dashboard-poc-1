import React from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const pulse = keyframes`
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
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
  cursor: pointer;
  padding: 3px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  outline: none;
  
  background: ${props => {
    if (props.active) return 'var(--color-success)';
    return 'var(--color-bg-tertiary)';
  }};
  
  box-shadow: ${props => {
    if (props.active) return '0 0 12px rgba(34, 197, 94, 0.3)';
    return 'inset 0 1px 3px rgba(0, 0, 0, 0.1)';
  }};
  
  &:hover {
    box-shadow: ${props => {
      if (props.active) return '0 0 16px rgba(34, 197, 94, 0.4)';
      return 'inset 0 1px 3px rgba(0, 0, 0, 0.1), 0 0 8px rgba(133, 92, 241, 0.2)';
    }};
    transform: scale(1.02);
  }
  
  &:active {
    transform: scale(0.98);
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
  
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    width: 12px;
    height: 12px;
    color: ${props => {
      if (props.active) return 'var(--color-success)';
      return 'var(--color-border)';
    }};
    transition: color 0.3s ease;
  }
`;

const Label = styled.label`
  font-size: var(--font-size-sm);
  font-weight: 500;
  color: var(--color-text-secondary);
  cursor: pointer;
  user-select: none;
  transition: color var(--transition-fast);
  
  &:hover {
    color: var(--color-text-primary);
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
 * CountryFilterToggle - Toggle switch for filtering phone numbers by country
 * 
 * @param {Object} props
 * @param {boolean} props.active - Whether the filter is active
 * @param {Function} props.onChange - Callback when toggle state changes
 * @param {string} props.label - Label text (default: "Indian Numbers Only")
 */
const CountryFilterToggle = ({
  active = false,
  onChange,
  label = "Indian Numbers Only",
}) => {
  const handleToggle = (e) => {
    e.stopPropagation();
    onChange?.(!active);
  };

  return (
    <ToggleContainer>
      <Label onClick={handleToggle} htmlFor="country-filter-toggle">
        {label}
      </Label>
      <ToggleWrapper
        id="country-filter-toggle"
        active={active}
        onClick={handleToggle}
        aria-label={active ? 'Disable country filter' : 'Enable country filter'}
        aria-pressed={active}
        type="button"
      >
        <ToggleThumb active={active}>
          {active ? <CheckIcon /> : <XIcon />}
        </ToggleThumb>
      </ToggleWrapper>
    </ToggleContainer>
  );
};

export default CountryFilterToggle;

