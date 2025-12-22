import React from 'react';
import styled from '@emotion/styled';

const SpinnerContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  gap: var(--space-md);
`;

const Spinner = styled.div`
  width: 40px;
  height: 40px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const Message = styled.p`
  color: var(--color-muted);
  font-size: 0.9375rem;
`;

const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <SpinnerContainer>
      <Spinner />
      <Message>{message}</Message>
    </SpinnerContainer>
  );
};

export default LoadingSpinner;

