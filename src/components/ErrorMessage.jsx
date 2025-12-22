import React from 'react';
import styled from '@emotion/styled';

const ErrorContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  gap: var(--space-md);
  padding: var(--space-xl);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-error);
`;

const ErrorIcon = styled.div`
  width: 48px;
  height: 48px;
  background: rgba(239, 68, 68, 0.1);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-error);
  font-size: 1.5rem;
`;

const ErrorTitle = styled.h3`
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-error);
`;

const ErrorText = styled.p`
  color: var(--color-muted);
  font-size: 0.9375rem;
  text-align: center;
  max-width: 400px;
`;

const RetryButton = styled.button`
  padding: var(--space-sm) var(--space-lg);
  background: var(--color-accent);
  border: none;
  border-radius: var(--radius-md);
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all var(--transition-fast);
  
  &:hover {
    background: var(--color-accent-hover);
  }
`;

const ErrorMessage = ({ message, onRetry }) => {
  return (
    <ErrorContainer>
      <ErrorIcon>⚠️</ErrorIcon>
      <ErrorTitle>Something went wrong</ErrorTitle>
      <ErrorText>{message}</ErrorText>
      {onRetry && (
        <RetryButton onClick={onRetry}>
          Try Again
        </RetryButton>
      )}
    </ErrorContainer>
  );
};

export default ErrorMessage;

