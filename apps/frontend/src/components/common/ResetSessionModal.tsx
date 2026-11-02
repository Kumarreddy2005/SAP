import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCareerContext } from '../../context/CareerContext';
import { AlertTriangleIcon, CloseIcon, TrashIcon } from './Icons';

interface ResetSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ResetSessionModal: React.FC<ResetSessionModalProps> = ({ isOpen, onClose }) => {
  const navigate = useNavigate();
  const { startNewCandidateSession, currentProfileId } = useCareerContext();
  const [isClearing, setIsClearing] = useState(false);

  if (!isOpen) return null;

  const handleConfirmReset = async () => {
    setIsClearing(true);
    try {
      await startNewCandidateSession();
      onClose();
      navigate('/profile');
    } catch (err) {
      console.error('Failed to clear candidate session:', err);
    } finally {
      setIsClearing(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 26, 71, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 2000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1.5rem'
      }}
      onClick={() => {
        if (!isClearing) onClose();
      }}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '560px',
          boxShadow: '0 20px 40px rgba(0, 26, 71, 0.25)',
          border: '1px solid #D9E1E8',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="reset-modal-title"
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            backgroundColor: '#FFF5F5',
            borderBottom: '1px solid #FED7D7',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                backgroundColor: '#FEB2B2',
                color: '#C53030',
                padding: '0.5rem',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <AlertTriangleIcon size={22} color="#C53030" />
            </div>
            <div>
              <h3 id="reset-modal-title" style={{ fontSize: '1.15rem', fontWeight: 700, color: '#9B2C2C', margin: 0 }}>
                Clear Candidate Session?
              </h3>
              <p style={{ fontSize: '0.8rem', color: '#C53030', margin: '0.15rem 0 0' }}>
                Prepare for a completely fresh candidate intake
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isClearing}
            aria-label="Close dialog"
            style={{
              background: 'none',
              border: 'none',
              color: '#A0AEC0',
              cursor: isClearing ? 'not-allowed' : 'pointer',
              padding: '0.25rem',
              borderRadius: '4px'
            }}
          >
            <CloseIcon size={20} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: '1.5rem' }}>
          <p style={{ color: '#2D3748', fontSize: '0.95rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>
            This will remove your uploaded resume, extracted skills, confirmed competencies, gap analyses,
            learning progress, and project workspace submissions from this browser session.
          </p>

          <div
            style={{
              backgroundColor: '#F7FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '8px',
              padding: '1rem 1.25rem',
              marginBottom: '1.25rem'
            }}
          >
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#4A5568', marginBottom: '0.5rem' }}>
              The following session items will be permanently cleared:
            </div>
            <ul style={{ margin: 0, paddingLeft: '1.25rem', fontSize: '0.85rem', color: '#718096', lineHeight: 1.6 }}>
              <li>Uploaded resume file cache and extracted text snippets</li>
              <li>Confirmed and rejected skill ratings (resets to 0 skills)</li>
              <li>Selected target career and computed match percentages</li>
              <li>Calculated skill gaps and customized learning pathway</li>
              <li>Active project workspace deliverables and rubric evaluations</li>
              {currentProfileId && (
                <li style={{ color: '#C53030', fontWeight: 600 }}>
                  Backend in-memory profile session ({currentProfileId})
                </li>
              )}
            </ul>
          </div>

          <p style={{ fontSize: '0.85rem', color: '#718096', margin: 0 }}>
            You will be redirected to the Background Intake page to upload a new resume document.
          </p>
        </div>

        {/* Footer Actions */}
        <div
          style={{
            padding: '1rem 1.5rem',
            backgroundColor: '#EDF2F7',
            borderTop: '1px solid #E2E8F0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'flex-end',
            gap: '0.75rem'
          }}
        >
          <button
            type="button"
            onClick={onClose}
            disabled={isClearing}
            style={{
              padding: '0.6rem 1.25rem',
              borderRadius: '6px',
              border: '1px solid #CBD5E0',
              backgroundColor: '#FFFFFF',
              color: '#4A5568',
              fontWeight: 600,
              fontSize: '0.9rem',
              cursor: isClearing ? 'not-allowed' : 'pointer'
            }}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleConfirmReset}
            disabled={isClearing}
            style={{
              padding: '0.6rem 1.25rem',
              borderRadius: '6px',
              border: 'none',
              backgroundColor: isClearing ? '#E53E3E' : '#C53030',
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              cursor: isClearing ? 'wait' : 'pointer',
              boxShadow: '0 2px 4px rgba(197, 48, 48, 0.3)'
            }}
          >
            <TrashIcon size={16} />
            {isClearing ? 'Clearing Session...' : 'Clear Profile & Start Again'}
          </button>
        </div>
      </div>
    </div>
  );
};
