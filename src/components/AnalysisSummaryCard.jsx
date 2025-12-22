import React from 'react';
import styled from '@emotion/styled';

const Card = styled.div`
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
`;

const CardTitle = styled.h2`
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin-bottom: var(--space-lg);
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(160px, 1fr));
  gap: var(--space-md);
`;

const StatCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
  padding: var(--space-md);
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
`;

const StatLabel = styled.span`
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--color-muted);
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const StatValue = styled.span`
  font-size: 2rem;
  font-weight: 700;
  color: ${props => {
    if (props.color) return props.color;
    return 'var(--color-text-primary)';
  }};
`;

const StatSubtext = styled.span`
  font-size: 0.75rem;
  color: var(--color-muted);
`;

const CSATContainer = styled.div`
  margin-top: var(--space-lg);
  padding-top: var(--space-lg);
  border-top: 1px solid var(--color-border);
`;

const CSATLabel = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--space-sm);
`;

const CSATText = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-text-primary);
`;

const CSATScore = styled.span`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${props => {
    const score = props.score || 0;
    if (score >= 80) return 'var(--color-success)';
    if (score >= 60) return 'var(--color-warning)';
    return 'var(--color-error)';
  }};
`;

const CSATBar = styled.div`
  width: 100%;
  height: 12px;
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin-top: var(--space-sm);
`;

const CSATFill = styled.div`
  height: 100%;
  background: linear-gradient(90deg, 
    ${props => {
      const score = props.score || 0;
      if (score >= 80) return 'var(--color-success)';
      if (score >= 60) return 'var(--color-warning)';
      return 'var(--color-error)';
    }} 0%, 
    ${props => {
      const score = props.score || 0;
      if (score >= 80) return 'var(--color-success-hover)';
      if (score >= 60) return 'var(--color-warning-hover)';
      return 'var(--color-error-hover)';
    }} 100%
  );
  border-radius: var(--radius-full);
  transition: width var(--transition-normal);
  width: ${props => `${props.score || 0}%`};
`;

const AnalysisSummaryCard = ({ summary }) => {
  const {
    total_calls = 0,
    passed_count = 0,
    failed_count = 0,
    avg_csat = null,
    pending_count = 0,
  } = summary || {};

  const passRate = total_calls > 0 ? Math.round((passed_count / total_calls) * 100) : 0;

  return (
    <Card>
      <CardTitle>Analysis Summary</CardTitle>
      
      <StatsGrid>
        <StatCard>
          <StatLabel>Total Calls</StatLabel>
          <StatValue>{total_calls}</StatValue>
          {pending_count > 0 && (
            <StatSubtext>{pending_count} pending analysis</StatSubtext>
          )}
        </StatCard>
        
        <StatCard>
          <StatLabel>Passed</StatLabel>
          <StatValue color="var(--color-success)">{passed_count}</StatValue>
          <StatSubtext>{passRate}% pass rate</StatSubtext>
        </StatCard>
        
        <StatCard>
          <StatLabel>Failed</StatLabel>
          <StatValue color="var(--color-error)">{failed_count}</StatValue>
          <StatSubtext>{total_calls > 0 ? Math.round((failed_count / total_calls) * 100) : 0}% fail rate</StatSubtext>
        </StatCard>
      </StatsGrid>
      
      {avg_csat !== null && (
        <CSATContainer>
          <CSATLabel>
            <CSATText>Average CSAT Score</CSATText>
            <CSATScore score={Math.round(avg_csat)}>{Math.round(avg_csat)}/100</CSATScore>
          </CSATLabel>
          <CSATBar>
            <CSATFill score={Math.round(avg_csat)} />
          </CSATBar>
        </CSATContainer>
      )}
    </Card>
  );
};

export default AnalysisSummaryCard;

