import React from 'react';
import styled from '@emotion/styled';
import StatusBadge from './StatusBadge';

const Card = styled.div`
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-xl);
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-xl);
  padding-bottom: var(--space-md);
  border-bottom: 1px solid var(--color-border);
`;

const CardTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text-primary);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: var(--space-lg);
  margin-bottom: var(--space-lg);
`;

const StatItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
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

const ProgressContainer = styled.div`
  margin-top: var(--space-xl);
  padding-top: var(--space-xl);
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


const BatchOverviewCard = ({ batch, summary = {} }) => {
  // Prioritize summary values for job counts (used by inbound batches)
  // Fall back to batch values (used by outbound batches)
  const total_jobs = summary.total_jobs ?? batch?.total_jobs ?? 0;
  const completed_jobs = summary.completed_jobs ?? batch?.completed_jobs ?? 0;
  const failed_jobs = summary.failed_jobs ?? batch?.failed_jobs ?? 0;
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
          <StatValue style={{ fontSize: '1rem' }}>
            {batch?.phone_number || batch?.outbound_agent_phone_number || '-'}
          </StatValue>
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
      </ProgressContainer>
    </Card>
  );
};

export default BatchOverviewCard;

