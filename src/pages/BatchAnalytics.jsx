import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import styled from '@emotion/styled';
import { fetchBatchDetails } from '../services/api';
import BatchOverviewCard from '../components/BatchOverviewCard';
import BatchJobsList from '../components/BatchJobsList';
import TabNavigation from '../components/TabNavigation';
import AnalysisTab from '../components/AnalysisTab';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorMessage from '../components/ErrorMessage';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: var(--space-md);
`;

const TitleSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
`;

const PageTitle = styled.h1`
  font-size: 1.75rem;
  font-weight: 600;
  color: var(--color-text-primary);
`;

const BatchId = styled.span`
  font-family: var(--font-mono);
  font-size: 0.875rem;
  color: var(--color-muted);
`;

const RefreshButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  font-size: 0.875rem;
  font-weight: 500;
  transition: all var(--transition-fast);
  
  &:hover:not(:disabled) {
    background: var(--color-bg-tertiary);
    border-color: var(--color-accent);
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  svg {
    width: 16px;
    height: 16px;
    transition: transform var(--transition-normal);
  }
  
  &.loading svg {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;

const LastUpdated = styled.span`
  font-size: 0.75rem;
  color: var(--color-muted);
  margin-top: var(--space-xs);
`;

const ContentSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
`;

const TabContent = styled.div`
  min-height: 400px;
`;

const ComingSoon = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 300px;
  background: var(--color-bg-secondary);
  border-radius: var(--radius-lg);
  border: 1px dashed var(--color-border);
  
  h3 {
    font-size: 1.25rem;
    font-weight: 600;
    color: var(--color-muted);
    margin-bottom: var(--space-sm);
  }
  
  p {
    color: var(--color-muted);
    font-size: 0.875rem;
  }
`;

const RefreshIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23,4 23,10 17,10" />
    <polyline points="1,20 1,14 7,14" />
    <path d="m3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
);

const TABS = [
  { id: 'simulations', label: 'Simulations' },
  { id: 'scenarios', label: 'Scenarios' },
  { id: 'analysis', label: 'Analysis' },
];

const BatchAnalytics = () => {
  const { batchId } = useParams();
  const [activeTab, setActiveTab] = useState('simulations');
  const [batchData, setBatchData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadBatchData = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      setError(null);
      
      const data = await fetchBatchDetails(batchId);
      setBatchData(data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to fetch batch details:', err);
      setError(err.response?.data?.detail || err.message || 'Failed to load batch details');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [batchId]);

  useEffect(() => {
    loadBatchData();
  }, [loadBatchData]);

  const handleRefresh = () => {
    loadBatchData(true);
  };

  if (loading) {
    return <LoadingSpinner message="Loading batch details..." />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={() => loadBatchData()} />;
  }

  return (
    <PageContainer>
      <PageHeader>
        <TitleSection>
          <PageTitle>Batch Details</PageTitle>
          <BatchId>/{batchId}</BatchId>
        </TitleSection>
        <div>
          <RefreshButton 
            onClick={handleRefresh} 
            disabled={refreshing}
            className={refreshing ? 'loading' : ''}
          >
            <RefreshIcon />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </RefreshButton>
          {lastUpdated && (
            <LastUpdated>
              Last updated: {lastUpdated.toLocaleTimeString()}
            </LastUpdated>
          )}
        </div>
      </PageHeader>

      {batchData && (
        <ContentSection>
          <BatchOverviewCard batch={batchData.batch} summary={batchData.summary} />
          
          <TabNavigation 
            tabs={TABS} 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
          />
          
          <TabContent>
            {activeTab === 'simulations' && (
              <BatchJobsList 
                jobs={batchData.jobs} 
                onRefresh={handleRefresh}
              />
            )}
            
            {activeTab === 'scenarios' && (
              <BatchJobsList 
                jobs={batchData.jobs} 
                showScenarios
                onRefresh={handleRefresh}
              />
            )}
            
            {activeTab === 'analysis' && (
              <AnalysisTab batchId={batchId} />
            )}
          </TabContent>
        </ContentSection>
      )}
    </PageContainer>
  );
};

export default BatchAnalytics;

