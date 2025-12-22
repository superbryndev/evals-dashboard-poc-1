import React from 'react';
import styled from '@emotion/styled';

const TabsContainer = styled.div`
  display: flex;
  gap: var(--space-xs);
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 0;
`;

const Tab = styled.button`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  color: var(--color-muted);
  font-size: 0.9375rem;
  font-weight: 500;
  transition: all var(--transition-fast);
  margin-bottom: -1px;
  
  &:hover:not(:disabled) {
    color: var(--color-text-primary);
  }
  
  &.active {
    color: var(--color-text-primary);
    border-bottom-color: var(--color-accent);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const Badge = styled.span`
  font-size: 0.6875rem;
  font-weight: 500;
  padding: 2px 6px;
  background: var(--color-bg-tertiary);
  color: var(--color-muted);
  border-radius: var(--radius-full);
  text-transform: lowercase;
`;

const TabNavigation = ({ tabs, activeTab, onTabChange }) => {
  return (
    <TabsContainer>
      {tabs.map((tab) => (
        <Tab
          key={tab.id}
          className={activeTab === tab.id ? 'active' : ''}
          onClick={() => !tab.disabled && onTabChange(tab.id)}
          disabled={tab.disabled}
        >
          {tab.label}
          {tab.badge && <Badge>{tab.badge}</Badge>}
        </Tab>
      ))}
    </TabsContainer>
  );
};

export default TabNavigation;

