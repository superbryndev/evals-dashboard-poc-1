import React, { useState } from 'react';
import styled from '@emotion/styled';
import { getBatchPayloads } from '../services/api';

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-md);
`;

const DownloadButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  background: ${props => props.disabled ? 'var(--color-bg-secondary)' : 'var(--color-accent-soft)'};
  border: 1px solid ${props => props.disabled ? 'var(--color-border)' : 'var(--color-accent)'};
  border-radius: var(--radius-md);
  color: ${props => props.disabled ? 'var(--color-muted)' : 'var(--color-accent)'};
  font-size: 0.875rem;
  font-weight: 500;
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all var(--transition-fast);
  
  &:hover:not(:disabled) {
    background: var(--color-accent);
    color: white;
  }
  
  &:disabled {
    opacity: 0.6;
  }
`;

const PayloadCount = styled.span`
  font-size: 0.8125rem;
  color: var(--color-muted);
`;

const Spinner = styled.span`
  width: 14px;
  height: 14px;
  border: 2px solid currentColor;
  border-right-color: transparent;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const DownloadIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7,10 12,15 17,10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const BulkPayloadDownload = ({ batchId, payloadCount = 0 }) => {
  const [downloading, setDownloading] = useState(false);
  const [error, setError] = useState(null);

  const handleDownload = async () => {
    if (downloading || !batchId || payloadCount === 0) return;
    
    setDownloading(true);
    setError(null);
    
    try {
      const data = await getBatchPayloads(batchId);
      
      // Create downloadable JSON
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      
      // Create download link and click it
      const link = document.createElement('a');
      link.href = url;
      link.download = `${batchId.substring(0, 8)}_payloads.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up the URL object
      URL.revokeObjectURL(url);
    } catch (err) {
      setError(err.message || 'Failed to download payloads');
      console.error('Download error:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Container>
      <DownloadButton 
        onClick={handleDownload}
        disabled={downloading || payloadCount === 0}
        title={payloadCount === 0 ? 'No payloads to download' : 'Download all payloads as JSON'}
      >
        {downloading ? <Spinner /> : <DownloadIcon />}
        {downloading ? 'Downloading...' : 'Download Payloads'}
      </DownloadButton>
      
      {payloadCount > 0 && (
        <PayloadCount>
          {payloadCount} payload{payloadCount !== 1 ? 's' : ''} available
        </PayloadCount>
      )}
      
      {error && (
        <PayloadCount style={{ color: 'var(--color-error)' }}>
          {error}
        </PayloadCount>
      )}
    </Container>
  );
};

export default BulkPayloadDownload;

