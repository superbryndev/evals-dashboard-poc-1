import React, { useState, useCallback } from 'react';
import styled from '@emotion/styled';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(13, 13, 13, 0.7);
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
  max-width: 700px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
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
  
  &:hover {
    background: var(--color-bg-secondary);
    color: var(--color-text-primary);
  }
`;

const ModalBody = styled.div`
  padding: var(--space-lg);
`;

const Section = styled.div`
  margin-bottom: var(--space-lg);
`;

const SectionTitle = styled.h4`
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: var(--space-md);
`;

const FieldsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
`;

const FieldRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr auto;
  gap: var(--space-md);
  align-items: center;
  padding: var(--space-sm) var(--space-md);
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-border);
`;

const Input = styled.input`
  padding: var(--space-sm) var(--space-md);
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  font-size: 0.875rem;
  width: 100%;
  
  &:focus {
    outline: none;
    border-color: var(--color-accent);
    box-shadow: 0 0 0 2px var(--color-accent-soft);
  }
  
  &::placeholder {
    color: var(--color-muted);
  }
`;

const Select = styled.select`
  padding: var(--space-sm) var(--space-md);
  background: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-primary);
  font-size: 0.875rem;
  cursor: pointer;
  
  &:focus {
    outline: none;
    border-color: var(--color-accent);
    box-shadow: 0 0 0 2px var(--color-accent-soft);
  }
`;

const IconButton = styled.button`
  background: none;
  border: none;
  color: var(--color-muted);
  cursor: pointer;
  padding: var(--space-xs);
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
  
  &:hover {
    background: var(--color-error);
    color: white;
  }
  
  &:disabled {
    opacity: 0.3;
    cursor: not-allowed;
    &:hover {
      background: none;
      color: var(--color-muted);
    }
  }
`;

const AddFieldButton = styled.button`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: var(--space-sm) var(--space-md);
  background: var(--color-bg-secondary);
  border: 1px dashed var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-accent);
  font-size: 0.875rem;
  cursor: pointer;
  transition: all var(--transition-fast);
  width: 100%;
  justify-content: center;
  
  &:hover {
    background: var(--color-accent-soft);
    border-color: var(--color-accent);
  }
`;

const PreviewSection = styled.div`
  background: var(--color-bg-secondary);
  border-radius: var(--radius-md);
  padding: var(--space-md);
  font-family: var(--font-mono);
  font-size: 0.8125rem;
  color: var(--color-text-secondary);
  white-space: pre-wrap;
  border: 1px solid var(--color-border);
`;

const OptionsRow = styled.div`
  display: flex;
  align-items: center;
  gap: var(--space-md);
  margin-top: var(--space-md);
`;

const Checkbox = styled.label`
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  font-size: 0.875rem;
  color: var(--color-text-secondary);
  cursor: pointer;
  
  input {
    width: 16px;
    height: 16px;
    accent-color: var(--color-accent);
  }
`;

const ModalFooter = styled.div`
  padding: var(--space-lg);
  border-top: 1px solid var(--color-border);
  display: flex;
  gap: var(--space-md);
  justify-content: space-between;
  align-items: center;
`;

const FooterInfo = styled.span`
  font-size: 0.8125rem;
  color: var(--color-muted);
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: var(--space-sm);
`;

const Button = styled.button`
  padding: var(--space-sm) var(--space-lg);
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  font-weight: 500;
  transition: all var(--transition-fast);
  cursor: pointer;
  border: none;
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

const PrimaryButton = styled(Button)`
  background: var(--color-accent);
  color: white;
  
  &:hover:not(:disabled) {
    background: var(--color-accent-hover);
  }
`;

const SecondaryButton = styled(Button)`
  background: var(--color-bg-secondary);
  color: var(--color-text-primary);
  border: 1px solid var(--color-border);
  
  &:hover:not(:disabled) {
    background: var(--color-bg-tertiary);
  }
`;

const ProgressBar = styled.div`
  width: 100%;
  height: 4px;
  background: var(--color-bg-tertiary);
  border-radius: var(--radius-full);
  overflow: hidden;
  margin-bottom: var(--space-sm);
`;

const ProgressFill = styled.div`
  height: 100%;
  background: var(--color-accent);
  transition: width 0.3s ease;
  width: ${props => props.progress}%;
`;

const ResultSection = styled.div`
  padding: var(--space-md);
  background: ${props => props.hasErrors ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 197, 94, 0.1)'};
  border-radius: var(--radius-md);
  border: 1px solid ${props => props.hasErrors ? 'var(--color-error)' : 'var(--color-success)'};
`;

const ResultTitle = styled.div`
  font-weight: 600;
  color: ${props => props.hasErrors ? 'var(--color-error)' : 'var(--color-success)'};
  margin-bottom: var(--space-sm);
`;

const ResultStats = styled.div`
  display: flex;
  gap: var(--space-lg);
  font-size: 0.875rem;
  color: var(--color-text-secondary);
`;

const FIELD_TYPES = [
  { value: 'string', label: 'String' },
  { value: 'number', label: 'Number' },
  { value: 'boolean', label: 'Boolean' },
  { value: 'date', label: 'Date' },
  { value: 'email', label: 'Email' },
  { value: 'phone', label: 'Phone' },
];

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="3,6 5,6 21,6" />
    <path d="m19,6v14a2,2 0 0 1-2,2H7a2,2 0 0 1-2-2V6m3,0V4a2,2 0 0 1 2-2h4a2,2 0 0 1 2,2v2" />
  </svg>
);

const PlusIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const SparklesIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
    <path d="M5 19l.5 1.5L7 21l-1.5.5L5 23l-.5-1.5L3 21l1.5-.5L5 19z" />
    <path d="M19 10l.5 1.5L21 12l-1.5.5L19 14l-.5-1.5L17 12l1.5-.5L19 10z" />
  </svg>
);

const PayloadGeneratorModal = ({
  isOpen,
  onClose,
  batchId,
  totalJobs,
  onGenerationComplete,
}) => {
  const [fields, setFields] = useState([
    { name: 'PhoneNo', type: 'phone' },
    { name: 'Name', type: 'string' },
  ]);
  const [regenerateExisting, setRegenerateExisting] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const addField = useCallback(() => {
    setFields(prev => [...prev, { name: '', type: 'string' }]);
  }, []);

  const removeField = useCallback((index) => {
    if (fields.length > 1) {
      setFields(prev => prev.filter((_, i) => i !== index));
    }
  }, [fields.length]);

  const updateField = useCallback((index, key, value) => {
    setFields(prev => prev.map((field, i) => 
      i === index ? { ...field, [key]: value } : field
    ));
  }, []);

  const generatePreview = useCallback(() => {
    const preview = {};
    fields.forEach(field => {
      if (field.name) {
        switch (field.type) {
          case 'number':
            preview[field.name] = 0;
            break;
          case 'boolean':
            preview[field.name] = true;
            break;
          default:
            preview[field.name] = `<${field.type}>`;
        }
      }
    });
    return JSON.stringify(preview, null, 2);
  }, [fields]);

  const handleGenerate = async () => {
    // Validate fields
    const validFields = fields.filter(f => f.name && f.name.trim());
    if (validFields.length === 0) {
      setError('At least one field with a name is required');
      return;
    }

    // Check for duplicate names
    const names = validFields.map(f => f.name);
    if (new Set(names).size !== names.length) {
      setError('Field names must be unique');
      return;
    }

    setGenerating(true);
    setProgress(10);
    setResult(null);
    setError(null);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'}/api/v1/calls/batch/${batchId}/generate-payloads`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            field_definitions: validFields.map(f => ({
              name: f.name,
              type: f.type,
              description: f.description || null,
            })),
            regenerate_existing: regenerateExisting,
          }),
        }
      );

      setProgress(80);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to generate payloads');
      }

      const data = await response.json();
      setProgress(100);
      setResult(data);
      
      if (onGenerationComplete) {
        onGenerationComplete(data);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setGenerating(false);
    }
  };

  const handleClose = () => {
    if (!generating) {
      setResult(null);
      setError(null);
      setProgress(0);
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <Overlay onClick={(e) => e.target === e.currentTarget && handleClose()}>
      <ModalContainer onClick={e => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>
            <SparklesIcon />
            Generate AI Payloads
          </ModalTitle>
          <CloseButton onClick={handleClose} disabled={generating}>×</CloseButton>
        </ModalHeader>

        <ModalBody>
          <Section>
            <SectionTitle>Field Definitions</SectionTitle>
            <FieldsList>
              {fields.map((field, index) => (
                <FieldRow key={index}>
                  <Input
                    placeholder="Field Name (e.g., PhoneNo)"
                    value={field.name}
                    onChange={(e) => updateField(index, 'name', e.target.value)}
                    disabled={generating}
                  />
                  <Select
                    value={field.type}
                    onChange={(e) => updateField(index, 'type', e.target.value)}
                    disabled={generating}
                  >
                    {FIELD_TYPES.map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </Select>
                  <IconButton 
                    type="button"
                    onClick={() => removeField(index)}
                    disabled={fields.length === 1 || generating}
                    title="Remove field"
                  >
                    <TrashIcon />
                  </IconButton>
                </FieldRow>
              ))}
              <AddFieldButton type="button" onClick={addField} disabled={generating}>
                <PlusIcon /> Add Field
              </AddFieldButton>
            </FieldsList>

            <OptionsRow>
              <Checkbox>
                <input
                  type="checkbox"
                  checked={regenerateExisting}
                  onChange={(e) => setRegenerateExisting(e.target.checked)}
                  disabled={generating}
                />
                Regenerate existing payloads
              </Checkbox>
            </OptionsRow>
          </Section>

          <Section>
            <SectionTitle>Preview Structure</SectionTitle>
            <PreviewSection>
              {generatePreview()}
            </PreviewSection>
          </Section>

          {generating && (
            <Section>
              <SectionTitle>Generating...</SectionTitle>
              <ProgressBar>
                <ProgressFill progress={progress} />
              </ProgressBar>
              <FooterInfo>Processing {totalJobs} scenario(s) with AI...</FooterInfo>
            </Section>
          )}

          {error && (
            <ResultSection hasErrors>
              <ResultTitle hasErrors>Error</ResultTitle>
              <div>{error}</div>
            </ResultSection>
          )}

          {result && (
            <ResultSection hasErrors={result.failed > 0}>
              <ResultTitle hasErrors={result.failed > 0}>
                {result.failed > 0 ? 'Completed with errors' : 'Completed successfully'}
              </ResultTitle>
              <ResultStats>
                <span>✅ Generated: {result.generated}</span>
                {result.failed > 0 && <span>❌ Failed: {result.failed}</span>}
                <span>📊 Total: {result.total_scenarios}</span>
              </ResultStats>
            </ResultSection>
          )}
        </ModalBody>

        <ModalFooter>
          <FooterInfo>
            {totalJobs} job(s) in this batch
          </FooterInfo>
          <ButtonGroup>
            <SecondaryButton type="button" onClick={handleClose} disabled={generating}>
              {result ? 'Close' : 'Cancel'}
            </SecondaryButton>
            {!result && (
              <PrimaryButton type="button" onClick={handleGenerate} disabled={generating}>
                {generating ? 'Generating...' : 'Generate Payloads'}
              </PrimaryButton>
            )}
          </ButtonGroup>
        </ModalFooter>
      </ModalContainer>
    </Overlay>
  );
};

export default PayloadGeneratorModal;

