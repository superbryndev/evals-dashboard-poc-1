import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import BatchAnalytics from './pages/BatchAnalytics';
import Layout from './components/Layout';
import { ToastProvider } from './components/Toast';

function App() {
  return (
    <ToastProvider>
      <Layout>
        <Routes>
          {/* Batch Analytics - handles both inbound and outbound */}
          <Route path="/batch/:batchId" element={<BatchAnalytics />} />
          
          {/* Home/Landing */}
          <Route path="/" element={
            <div style={{ 
              display: 'flex', 
              flexDirection: 'column',
              alignItems: 'center', 
              justifyContent: 'center', 
              height: '60vh',
              gap: 'var(--space-lg)'
            }}>
              <h1 style={{ fontSize: '2rem', fontWeight: 600 }}>SuperBryn Batch Dashboard</h1>
              <p style={{ color: 'var(--color-muted)', textAlign: 'center', maxWidth: '600px' }}>
                Manage and monitor your AI agent simulation batches (inbound & outbound)
              </p>
              <p style={{ 
                color: 'var(--color-text-secondary)', 
                fontSize: '0.875rem',
                marginTop: 'var(--space-md)'
              }}>
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
    </ToastProvider>
  );
}

export default App;

