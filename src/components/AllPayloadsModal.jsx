import React, { useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { getBatchPayloads } from '../services/api';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(13, 13, 13, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--space-lg);
  animation: fadeIn var(--transition-normal);
  
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
`;

const ModalContainer = styled.div`
  background: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  max-width: 1000px;
  width: 100%;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  animation: slideUp var(--transition-normal);
  
  @keyframes slideUp {
    from {
      transform: translateY(20px);
      opacity: 0;
    }
    to {
      transform: translateY(0);
      opacity: 1;
    }
  }
`;

const ModalHeader = styled.div`
  padding: var(--space-lg);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--color-bg-secondary);
`;

const ModalTitle = styled.h3`
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
`;

const ActionButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--space-xs);
  padding: var(--space-xs) var(--space-sm);
  background: ${props => props.primary ? 'var(--color-accent)' : 'var(--color-bg-tertiary)'};
  color: ${props => props.primary ? 'white' : 'var(--color-text-primary)'};
  border: 1px solid ${props => props.primary ? 'var(--color-accent)' : 'var(--color-border)'};
  border-radius: var(--radius-sm);
  font-size: 0.8125rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
  
  &:hover {
    background: ${props => props.primary ? 'var(--color-accent-hover)' : 'var(--color-bg-hover)'};
    transform: translateY(-1px);
  }
  
  &.copied {
    background: #10B981;
    border-color: #10B981;
    color: white;
  }
  
  svg {
    width: 14px;
    height: 14px;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: var(--color-muted);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
  margin-left: var(--space-sm);
  
  &:hover {
    background: var(--color-bg-tertiary);
    color: var(--color-text-primary);
  }
`;

const ModalBody = styled.div`
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
`;

const LoadingState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-md);
  padding: var(--space-xl);
  color: var(--color-muted);
  flex: 1;
`;

const Spinner = styled.span`
  width: 32px;
  height: 32px;
  border: 3px solid var(--color-border);
  border-top-color: var(--color-accent);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  
  @keyframes spin {
    to { transform: rotate(360deg); }
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-xl);
  color: var(--color-muted);
  text-align: center;
  flex: 1;
  justify-content: center;
`;

const EmptyIcon = styled.div`
  font-size: 3rem;
  opacity: 0.5;
`;

const CodeEditorContainer = styled.div`
  flex: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background: #1e1e1e;
  border-radius: 0 0 var(--radius-lg) var(--radius-lg);
`;

const CodeEditorHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-sm) var(--space-md);
  background: #252526;
  border-bottom: 1px solid #3c3c3c;
  
  span {
    font-family: var(--font-mono);
    font-size: 0.75rem;
    color: #858585;
  }
`;

const CodeEditorBody = styled.div`
  flex: 1;
  overflow: auto;
  padding: var(--space-md);
  font-family: 'Consolas', 'Monaco', 'Courier New', monospace;
  font-size: 0.8125rem;
  line-height: 1.6;
  color: #d4d4d4;
  white-space: pre;
  tab-size: 2;
  
  /* Syntax highlighting styles */
  .string { color: #ce9178; }
  .number { color: #b5cea8; }
  .boolean { color: #569cd6; }
  .null { color: #569cd6; }
  .key { color: #9cdcfe; }
  .bracket { color: #ffd700; }
  .comma { color: #d4d4d4; }
`;

const PayloadStats = styled.div`
  display: flex;
  gap: var(--space-lg);
  padding: var(--space-sm) var(--space-md);
  background: #252526;
  border-bottom: 1px solid #3c3c3c;
  font-size: 0.75rem;
  
  span {
    display: flex;
    align-items: center;
    gap: var(--space-xs);
    color: #858585;
    
    strong {
      color: #d4d4d4;
      font-weight: 600;
    }
  }
`;

const CopyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
  </svg>
);

const DownloadIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="7 10 12 15 17 10" />
    <line x1="12" y1="15" x2="12" y2="3" />
  </svg>
);

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// Simple JSON syntax highlighter
const highlightJSON = (json) => {
  return json
    .replace(/("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, (match) => {
      let cls = 'number';
      if (/^"/.test(match)) {
        if (/:$/.test(match)) {
          cls = 'key';
          return `<span class="${cls}">${match.slice(0, -1)}</span>:`;
        } else {
          cls = 'string';
        }
      } else if (/true|false/.test(match)) {
        cls = 'boolean';
      } else if (/null/.test(match)) {
        cls = 'null';
      }
      return `<span class="${cls}">${match}</span>`;
    })
    .replace(/[{}\[\]]/g, (match) => `<span class="bracket">${match}</span>`)
    .replace(/,/g, '<span class="comma">,</span>');
};

const AllPayloadsModal = ({ isOpen, onClose, batchId }) => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && batchId) {
      loadPayloads();
    }
  }, [isOpen, batchId]);

  const loadPayloads = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getBatchPayloads(batchId);
      setData(result);
    } catch (err) {
      setError(err.message || 'Failed to load payloads');
    } finally {
      setLoading(false);
    }
  };

  const getPayloadsArray = () => {
    if (!data?.payloads) return [];
    return data.payloads.map(p => p.payload);
  };

  const getFormattedJSON = () => {
    const payloads = getPayloadsArray();
    return JSON.stringify(payloads, null, 2);
  };

  const handleCopyAll = async () => {
    try {
      await navigator.clipboard.writeText(getFormattedJSON());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleDownload = () => {
    const jsonString = getFormattedJSON();
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${batchId.substring(0, 8)}_payloads.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    URL.revokeObjectURL(url);
  };

  const handleClose = () => {
    setData(null);
    setError(null);
    setLoading(true);
    setCopied(false);
    onClose();
  };

  if (!isOpen) return null;

  const hasPayloads = data?.payloads && data.payloads.length > 0;
  const payloadCount = data?.payloads?.length || 0;

  return (
    <Overlay onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            All Generated Payloads
          </ModalTitle>
          <HeaderActions>
            {hasPayloads && (
              <>
                <ActionButton 
                  onClick={handleCopyAll}
                  className={copied ? 'copied' : ''}
                >
                  {copied ? <CheckIcon /> : <CopyIcon />}
                  {copied ? 'Copied!' : 'Copy All'}
                </ActionButton>
                <ActionButton primary onClick={handleDownload}>
                  <DownloadIcon />
                  Download JSON
                </ActionButton>
              </>
            )}
            <CloseButton onClick={handleClose}>×</CloseButton>
          </HeaderActions>
        </ModalHeader>

        <ModalBody>
          {loading && (
            <LoadingState>
              <Spinner />
              <div>Loading payloads...</div>
            </LoadingState>
          )}

          {error && (
            <EmptyState>
              <EmptyIcon>⚠️</EmptyIcon>
              <div>{error}</div>
            </EmptyState>
          )}

          {!loading && !error && !hasPayloads && (
            <EmptyState>
              <EmptyIcon>📝</EmptyIcon>
              <div>No payloads generated yet</div>
              <div style={{ fontSize: '0.8125rem', marginTop: 'var(--space-sm)' }}>
                Use "Generate Payloads" to create AI-generated test data
              </div>
            </EmptyState>
          )}

          {!loading && !error && hasPayloads && (
            <CodeEditorContainer>
              <PayloadStats>
                <span>
                  <strong>{payloadCount}</strong> payloads
                </span>
                {data.field_definitions && data.field_definitions.length > 0 && (
                  <span>
                    <strong>{data.field_definitions.length}</strong> fields per payload
                  </span>
                )}
              </PayloadStats>
              <CodeEditorHeader>
                <span>payloads.json</span>
                <span>{getFormattedJSON().split('\n').length} lines</span>
              </CodeEditorHeader>
              <CodeEditorBody
                dangerouslySetInnerHTML={{ 
                  __html: highlightJSON(getFormattedJSON()) 
                }}
              />
            </CodeEditorContainer>
          )}
        </ModalBody>
      </ModalContainer>
    </Overlay>
  );
};

export default AllPayloadsModal;
