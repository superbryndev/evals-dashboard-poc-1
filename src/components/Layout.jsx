import React from 'react';
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

const Main = styled.main`
  flex: 1;
  width: 100%;
`;

const Layout = ({ children }) => {
  const { theme, toggleTheme } = useTheme();

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
        <ThemeToggle onClick={toggleTheme}>
          <ThemeIcon>{theme === 'light' ? '🌙' : '☀️'}</ThemeIcon>
          {theme === 'light' ? 'Dark' : 'Light'}
        </ThemeToggle>
      </Header>
      <Main>
        {children}
      </Main>
    </LayoutContainer>
  );
};

export default Layout;

