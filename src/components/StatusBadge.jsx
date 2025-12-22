import React from 'react';
import styled from '@emotion/styled';

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: capitalize;
  
  ${props => {
    switch (props.status) {
      case 'completed':
        return `
          background: rgba(34, 197, 94, 0.1);
          color: var(--color-success);
          border: 1px solid rgba(34, 197, 94, 0.3);
        `;
      case 'failed':
      case 'no_answer':
        return `
          background: rgba(239, 68, 68, 0.1);
          color: var(--color-error);
          border: 1px solid rgba(239, 68, 68, 0.3);
        `;
      case 'inprogress':
        return `
          background: rgba(59, 130, 246, 0.1);
          color: var(--color-info);
          border: 1px solid rgba(59, 130, 246, 0.3);
        `;
      case 'active':
        return `
          background: rgba(245, 158, 11, 0.1);
          color: var(--color-warning);
          border: 1px solid rgba(245, 158, 11, 0.3);
        `;
      case 'pending':
        return `
          background: var(--color-bg-tertiary);
          color: var(--color-muted);
          border: 1px solid var(--color-border);
        `;
      case 'processing':
        return `
          background: rgba(133, 92, 241, 0.1);
          color: var(--color-accent);
          border: 1px solid rgba(133, 92, 241, 0.3);
        `;
      default:
        return `
          background: var(--color-bg-tertiary);
          color: var(--color-muted);
          border: 1px solid var(--color-border);
        `;
    }
  }}
`;

const Dot = styled.span`
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: currentColor;
  
  ${props => props.pulse && `
    animation: pulse 2s ease-in-out infinite;
    
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }
  `}
`;

const formatStatus = (status) => {
  if (!status) return 'Unknown';
  
  const statusMap = {
    'completed': 'Completed',
    'failed': 'Failed',
    'no_answer': 'No Answer',
    'inprogress': 'In Progress',
    'active': 'Active',
    'pending': 'In Queue',
    'processing': 'Processing',
  };
  
  return statusMap[status] || status;
};

const isActiveStatus = (status) => {
  return ['active', 'inprogress', 'processing'].includes(status);
};

const StatusBadge = ({ status, showDot = true }) => {
  return (
    <Badge status={status}>
      {showDot && <Dot pulse={isActiveStatus(status)} />}
      {formatStatus(status)}
    </Badge>
  );
};

export default StatusBadge;

