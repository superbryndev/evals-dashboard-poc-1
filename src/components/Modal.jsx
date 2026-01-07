import React, { useEffect } from 'react';
import styled from '@emotion/styled';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(13, 13, 13, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--space-lg);
  animation: fadeIn var(--transition-normal);
  
  @keyframes fadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }
`;

const ModalContainer = styled.div`
  background: var(--color-bg-primary);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  max-width: 500px;
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
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: var(--color-muted);
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
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
  color: var(--color-text-primary);
  line-height: 1.6;
`;

const ModalFooter = styled.div`
  padding: var(--space-lg);
  border-top: 1px solid var(--color-border);
  display: flex;
  gap: var(--space-sm);
  justify-content: flex-end;
`;

const Button = styled.button`
  padding: var(--space-sm) var(--space-lg);
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  font-weight: 500;
  transition: all var(--transition-fast);
  cursor: pointer;
  border: none;
  
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

const DangerButton = styled(Button)`
  background: var(--color-error);
  color: white;
  
  &:hover:not(:disabled) {
    background: #DC2626;
  }
`;

const IconContainer = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  margin-bottom: var(--space-md);
  margin: 0 auto var(--space-md);
  
  ${props => {
    if (props.type === 'error') {
      return `
        background: rgba(239, 68, 68, 0.1);
        color: var(--color-error);
      `;
    }
    if (props.type === 'success') {
      return `
        background: rgba(34, 197, 94, 0.1);
        color: var(--color-success);
      `;
    }
    if (props.type === 'warning') {
      return `
        background: rgba(245, 158, 11, 0.1);
        color: var(--color-warning);
      `;
    }
    return `
      background: var(--color-accent-soft);
      color: var(--color-accent);
    `;
  }}
`;

const Modal = ({ 
  isOpen, 
  onClose, 
  title, 
  children, 
  onConfirm, 
  onCancel,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'default', // 'default', 'error', 'success', 'warning'
  showCloseButton = true,
  closeOnOverlayClick = true
}) => {
  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleOverlayClick = (e) => {
    if (closeOnOverlayClick && e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    if (onConfirm) {
      onConfirm();
    }
    onClose();
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
    onClose();
  };

  const getIcon = () => {
    switch (type) {
      case 'error':
        return '⚠️';
      case 'success':
        return '✓';
      case 'warning':
        return '⚠️';
      default:
        return null;
    }
  };

  return (
    <Overlay onClick={handleOverlayClick}>
      <ModalContainer onClick={(e) => e.stopPropagation()}>
        <ModalHeader>
          <ModalTitle>{title}</ModalTitle>
          {showCloseButton && (
            <CloseButton onClick={onClose} aria-label="Close">
              ×
            </CloseButton>
          )}
        </ModalHeader>
        <ModalBody>
          {type !== 'default' && (
            <IconContainer type={type}>
              {getIcon()}
            </IconContainer>
          )}
          {children}
        </ModalBody>
        {(onConfirm || onCancel) && (
          <ModalFooter>
            {onCancel && (
              <SecondaryButton onClick={handleCancel}>
                {cancelText}
              </SecondaryButton>
            )}
            {onConfirm && (
              <PrimaryButton onClick={handleConfirm}>
                {confirmText}
              </PrimaryButton>
            )}
          </ModalFooter>
        )}
      </ModalContainer>
    </Overlay>
  );
};

export default Modal;

