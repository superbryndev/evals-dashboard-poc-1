import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import BatchAnalytics from './pages/BatchAnalytics';
import Layout from './components/Layout';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/batch/:batchId" element={<BatchAnalytics />} />
        <Route path="/" element={
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'center', 
            justifyContent: 'center', 
            height: '60vh',
            gap: 'var(--space-md)'
          }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 600 }}>Batch Analytics Dashboard</h1>
            <p style={{ color: 'var(--color-muted)' }}>
              Navigate to <code style={{ 
                background: 'var(--color-bg-tertiary)', 
                padding: '2px 8px', 
                borderRadius: 'var(--radius-sm)'
              }}>/batch/:batchId</code> to view batch details
            </p>
          </div>
        } />
      </Routes>
    </Layout>
  );
}

export default App;

