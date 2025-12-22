import React from 'react';
import styled from '@emotion/styled';
import StatusBadge from './StatusBadge';

const Card = styled.div`
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-lg);
`;

const CardTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text-primary);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
  gap: var(--space-md);
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
`;

const StatLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StatValue = styled.span`
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text-primary);
`;

const StatSubtext = styled.span`
  font-size: 0.75rem;
  color: var(--color-muted);
`;

const ProgressContainer = styled.div`
  margin-top: var(--space-lg);
  padding-top: var(--space-lg);
  border-top: 1px solid var(--color-border);
`;

const ProgressHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-sm);
`;

const ProgressLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-primary);
`;

const ProgressPercent = styled.span`
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-accent);
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 8px;
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-full);
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, var(--color-accent) 0%, var(--color-accent-hover) 100%);
  border-radius: var(--radius-full);
  transition: width var(--transition-normal);
`;

const StatusSummary = styled.div`
  display: flex;
  gap: var(--space-md);
  margin-top: var(--space-md);
  flex-wrap: wrap;
`;

const StatusChip = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-xs) var(--space-sm);
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-full);
  font-size: 0.8125rem;
  
  .dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: ${props => {
      switch (props.status) {
        case 'completed': return 'var(--color-success)';
        case 'failed': return 'var(--color-error)';
        case 'inprogress': return 'var(--color-info)';
        case 'active': return 'var(--color-warning)';
        case 'pending': return 'var(--color-muted)';
        default: return 'var(--color-muted)';
      }
    }};
  }
  
  .count {
    font-weight: 600;
    color: var(--color-text-primary);
  }
  
  .label {
    color: var(--color-muted);
  }
`;

const formatDate = (dateString) => {
  if (!dateString) return '-';
  const date = new Date(dateString);
  return date.toLocaleString();
};

const BatchOverviewCard = ({ batch, summary = {} }) => {
  const { total_jobs = 0, completed_jobs = 0, failed_jobs = 0 } = batch || {};
  const completedCount = completed_jobs + failed_jobs;
  const progressPercent = total_jobs > 0 ? Math.round((completedCount / total_jobs) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Batch Configs + All Jobs with status</CardTitle>
        <StatusBadge status={batch?.status} />
      </CardHeader>
      
      <StatsGrid>
        <StatItem>
          <StatLabel>Total Jobs</StatLabel>
          <StatValue>{total_jobs}</StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>Completed</StatLabel>
          <StatValue style={{ color: 'var(--color-success)' }}>{completed_jobs}</StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>Failed</StatLabel>
          <StatValue style={{ color: 'var(--color-error)' }}>{failed_jobs}</StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>Phone Number</StatLabel>
          <StatValue style={{ fontSize: '1rem' }}>{batch?.phone_number || '-'}</StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>Priority</StatLabel>
          <StatValue>{batch?.priority || '-'}</StatValue>
        </StatItem>
        <StatItem>
          <StatLabel>Created</StatLabel>
          <StatSubtext>{formatDate(batch?.created_at)}</StatSubtext>
        </StatItem>
      </StatsGrid>
      
      <ProgressContainer>
        <ProgressHeader>
          <ProgressLabel>Completion Progress</ProgressLabel>
          <ProgressPercent>{progressPercent}%</ProgressPercent>
        </ProgressHeader>
        <ProgressBar>
          <ProgressFill style={{ width: `${progressPercent}%` }} />
        </ProgressBar>
        
        <StatusSummary>
          {Object.entries(summary).map(([status, count]) => (
            <StatusChip key={status} status={status}>
              <span className="dot" />
              <span className="count">{count}</span>
              <span className="label">{status}</span>
            </StatusChip>
          ))}
        </StatusSummary>
      </ProgressContainer>
    </Card>
  );
};

export default BatchOverviewCard;

