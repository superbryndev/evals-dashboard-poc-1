import React from 'react';
import styled from '@emotion/styled';

const TranscriptContainer = styled.div`
  max-height: 400px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
`;

const MessageBubble = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-md);
  max-width: 85%;
  
  ${props => props.role === 'agent' ? `
    align-self: flex-start;
    background: var(--color-accent-soft);
    border-bottom-left-radius: 4px;
  ` : `
    align-self: flex-end;
    background: var(--color-bg-secondary);
    border: 1px solid var(--color-border);
    border-bottom-right-radius: 4px;
  `}
`;

const MessageHeader = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
`;

const RoleLabel = styled.span`
  font-size: 0.6875rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  
  ${props => props.role === 'agent' ? `
    color: var(--color-accent);
  ` : `
    color: var(--color-muted);
  `}
`;

const Timestamp = styled.span`
  font-size: 0.625rem;
  color: var(--color-muted);
  font-family: var(--font-mono);
`;

const MessageContent = styled.p`
  font-size: 0.875rem;
  color: var(--color-text-primary);
  line-height: 1.5;
  margin: 0;
  word-wrap: break-word;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--space-xl);
  color: var(--color-muted);
  text-align: center;
  
  .icon {
    font-size: 2rem;
    margin-bottom: var(--space-sm);
  }
  
  p {
    font-size: 0.875rem;
  }
`;

const formatTimestamp = (ts) => {
  if (!ts) return '';
  try {
    const date = new Date(ts);
    return date.toLocaleTimeString();
  } catch {
    return ts;
  }
};

const TranscriptViewer = ({ transcript = [] }) => {
  if (!transcript || transcript.length === 0) {
    return (
      <EmptyState>
        <span className="icon">💬</span>
        <p>No transcript available for this call</p>
      </EmptyState>
    );
  }

  return (
    <TranscriptContainer>
      {transcript.map((entry, index) => (
        <MessageBubble key={entry.seq || index} role={entry.role}>
          <MessageHeader>
            <RoleLabel role={entry.role}>
              {entry.role === 'agent' ? '🤖 Agent' : '👤 User'}
            </RoleLabel>
            {entry.ts && <Timestamp>{formatTimestamp(entry.ts)}</Timestamp>}
          </MessageHeader>
          <MessageContent>{entry.content}</MessageContent>
        </MessageBubble>
      ))}
    </TranscriptContainer>
  );
};

export default TranscriptViewer;

