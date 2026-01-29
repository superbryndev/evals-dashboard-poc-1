import React, { useState } from 'react';
import { useTheme } from '../theme/ThemeContext';
import styled from '@emotion/styled';

const LayoutContainer = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

const Header = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-md) var(--space-xl);
  border-bottom: 1px solid var(--color-border);
  background: var(--color-bg-primary);
  position: sticky;
  top: 0;
`;

const Logo = styled.a`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text-primary);
  text-decoration: none;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  
  &:hover {
    opacity: 0.8;
  }
`;

const LogoImage = styled.img`
  height: 32px;
  width: auto;
  display: block;
  filter: brightness(0) saturate(100%) invert(42%) sepia(93%) saturate(1352%) hue-rotate(243deg) brightness(95%) contrast(91%);
  
  /* Fallback if image doesn't load */
  &:not([src]),
  &[src=""],
  &[src="undefined"] {
    display: none;
  }
`;

const LogoFallback = styled.span`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-accent);
`;

const ThemeToggle = styled.button`
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  padding: var(--space-sm) var(--space-md);
  color: var(--color-text-primary);
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  transition: all var(--transition-fast);
  
  &:hover {
    background: var(--color-bg-tertiary);
    border-color: var(--color-accent);
  }
`;

const ThemeIcon = styled.span`
  font-size: 1rem;
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
`;

const RefreshButton = styled.button`
  background: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  padding: var(--space-sm) var(--space-md);
  color: var(--color-text-primary);
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  transition: all var(--transition-fast);
  cursor: pointer;
  
  &:hover {
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

const RefreshIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23,4 23,10 17,10" />
    <polyline points="1,20 1,14 7,14" />
    <path d="m3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
  </svg>
);

const Main = styled.main`
  flex: 1;
  width: 100%;
`;

const Layout = ({ children }) => {
  const { theme, toggleTheme } = useTheme();
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = () => {
    setRefreshing(true);
    // Dispatch a custom event that pages can listen to
    // Pages can call event.preventDefault() to prevent page reload
    const event = new CustomEvent('pageRefresh', { cancelable: true });
    const prevented = !window.dispatchEvent(event);
    
    // If no page handled the refresh, reload the page
    if (!prevented) {
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } else {
      // Reset refreshing state after a delay
      setTimeout(() => {
        setRefreshing(false);
      }, 500);
    }
  };

  return (
    <LayoutContainer>
      <Header>
        <Logo href="/">
          <LogoImage 
            src="/images/superbryn-logo.png" 
            alt="SuperBryn"
            onError={(e) => {
              e.target.style.display = 'none';
              if (e.target.nextSibling) {
                e.target.nextSibling.style.display = 'block';
              }
            }}
          />
          <LogoFallback style={{ display: 'none' }}>SuperBryn</LogoFallback>
        </Logo>
        <HeaderActions>
          <RefreshButton 
            onClick={handleRefresh}
            disabled={refreshing}
            className={refreshing ? 'loading' : ''}
            title="Refresh page"
          >
            <RefreshIcon />
          </RefreshButton>
          <ThemeToggle onClick={toggleTheme}>
            <ThemeIcon>{theme === 'light' ? '🌙' : '☀️'}</ThemeIcon>
            {theme === 'light' ? 'Dark' : 'Light'}
          </ThemeToggle>
        </HeaderActions>
      </Header>
      <Main>
        {children}
      </Main>
    </LayoutContainer>
  );
};

export default Layout;

