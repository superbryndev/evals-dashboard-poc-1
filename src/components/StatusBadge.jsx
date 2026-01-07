import React from 'react';
import styled from '@emotion/styled';
import { keyframes } from '@emotion/react';

const pulse = keyframes`
  0%, 100% { 
    opacity: 1;
    transform: scale(1);
  }
  50% { 
    opacity: 0.6;
    transform: scale(1.1);
  }
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 500;
  letter-spacing: 0;
  white-space: nowrap;
  transition: all var(--transition-fast);
  
  ${props => {
    switch (props.status) {
      case 'completed':
        return `
          background: #DCFCE7;
          color: #166534;
        `;
      case 'failed':
      case 'no_answer':
        return `
          background: #FEE2E2;
          color: #991B1B;
        `;
      case 'inprogress':
        return `
          background: #DBEAFE;
          color: #1E40AF;
        `;
      case 'active':
        return `
          background: #FEF3C7;
          color: #92400E;
        `;
      case 'inactive':
        return `
          background: var(--color-bg-tertiary);
          color: var(--color-muted);
        `;
      case 'pending':
        return `
          background: var(--color-bg-tertiary);
          color: var(--color-muted);
        `;
      case 'processing':
        return `
          background: #E8EFFF;
          color: #5B21B6;
        `;
      default:
        return `
          background: var(--color-bg-tertiary);
          color: var(--color-muted);
        `;
    }
  }}
`;

const Dot = styled.span`
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentColor;
  flex-shrink: 0;
  
  ${props => props.pulse && `
    animation: ${pulse} 2s ease-in-out infinite;
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

