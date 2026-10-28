import React, { useEffect } from 'react';
import { CloseIcon } from './Icons';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  maxWidth?: string;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  footer,
  maxWidth = '550px'
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 26, 71, 0.45)',
        backdropFilter: 'blur(2px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          boxShadow: '0 12px 32px rgba(0, 26, 71, 0.2)',
          width: '100%',
          maxWidth,
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'fadeIn 0.15s ease'
        }}
      >
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid #EDF1F5',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <h3 style={{ fontSize: '1.2rem', fontWeight: 600, color: '#001A47' }}>{title}</h3>
          <button
            onClick={onClose}
            aria-label="Close dialog"
            style={{
              padding: '0.4rem',
              borderRadius: '4px',
              color: '#5B6876',
              cursor: 'pointer'
            }}
          >
            <CloseIcon size={18} />
          </button>
        </div>

        <div style={{ padding: '1.5rem', overflowY: 'auto', flex: 1 }}>{children}</div>

        {footer && (
          <div
            style={{
              padding: '1rem 1.5rem',
              backgroundColor: '#FAFBFD',
              borderTop: '1px solid #EDF1F5',
              display: 'flex',
              justifyContent: 'flex-end',
              gap: '0.75rem'
            }}
          >
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};
