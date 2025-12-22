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
  z-index: 100;
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
    color: var(--color-accent);
  }
`;

const LogoIcon = styled.span`
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, var(--color-accent) 0%, var(--color-accent-hover) 100%);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 700;
  font-size: 0.875rem;
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
  padding: var(--space-xl);
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
`;

const Layout = ({ children }) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <LayoutContainer>
      <Header>
        <Logo href="/">
          <LogoIcon>BA</LogoIcon>
          Batch Analytics
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

