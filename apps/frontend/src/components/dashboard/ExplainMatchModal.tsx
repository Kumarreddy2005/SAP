import React from 'react';
import { ExtendedCareerRole } from '../../demo/demoCareers';
import { CloseIcon, CheckIcon, AlertTriangleIcon } from '../common/Icons';

interface ExplainMatchModalProps {
  isOpen: boolean;
  onClose: () => void;
  role: ExtendedCareerRole | null;
  matchScore: number;
  matchedSkills: string[];
  missingSkills: string[];
}

export const ExplainMatchModal: React.FC<ExplainMatchModalProps> = ({
  isOpen,
  onClose,
  role,
  matchScore,
  matchedSkills,
  missingSkills
}) => {
  if (!isOpen || !role) return null;

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 26, 71, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '680px',
          maxHeight: '85vh',
          boxShadow: '0 20px 40px rgba(0, 26, 71, 0.25)',
          border: '1px solid #D9E1E8',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid #E2E8F0',
            backgroundColor: '#001A47',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
              Explainable Match Formula Breakdown
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#C4D5EA', margin: '0.2rem 0 0' }}>
              Mathematical transparency for {role.title} ({matchScore}% Match)
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              color: '#FFFFFF',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
              padding: '0.4rem',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <CloseIcon size={18} />
          </button>
        </div>

        {/* Content */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1.25rem 1.5rem' }}>
          {/* Formula Callout */}
          <div
            style={{
              backgroundColor: '#F8FAFC',
              border: '1px solid #D9E1E8',
              borderRadius: '8px',
              padding: '1rem',
              marginBottom: '1.25rem'
            }}
          >
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#5B6876', textTransform: 'uppercase' }}>
              Deterministic Weighted Overlap Formula
            </div>
            <div
              style={{
                fontFamily: 'monospace',
                fontSize: '0.95rem',
                color: '#0A6ED1',
                fontWeight: 700,
                margin: '0.4rem 0'
              }}
            >
              Match Score = 100 × [ Σ (weight_i × matchFactor_i) / Σ (weight_i) ]
            </div>
            <p style={{ fontSize: '0.78rem', color: '#64748B', margin: 0, lineHeight: 1.4 }}>
              Where <code>matchFactor_i</code> = 1.0 (Full Match), 0.5 (Partial Match), 0.0 (Missing/Uncalibrated).
              Weights <code>weight_i</code> are defined in the SAP career catalogue (1.0 to 1.5x for mandatory requirements).
            </p>
          </div>

          {/* Important Disclosure */}
          <div
            style={{
              backgroundColor: '#FEF3E8',
              border: '1px solid #F5C28C',
              borderRadius: '6px',
              padding: '0.75rem 1rem',
              marginBottom: '1.25rem',
              fontSize: '0.8rem',
              color: '#8A3B00',
              lineHeight: 1.4
            }}
          >
            <strong>Important Anti-Fabrication Notice:</strong> Match scores represent objective competency overlap with the curated role catalogue. They do not represent statistical probabilities of hiring, interview guarantees, or employment predictions.
          </div>

          {/* Matched Requirements List */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#107E3E', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <CheckIcon size={14} color="#107E3E" /> Matched Confirmed Competencies ({matchedSkills.length})
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {matchedSkills.map((s) => (
                <div
                  key={s}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #E8F5ED',
                    borderRadius: '6px',
                    padding: '0.45rem 0.75rem',
                    fontSize: '0.8rem',
                    color: '#222B35',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span style={{ fontWeight: 600 }}>{s}</span>
                  <span style={{ fontSize: '0.72rem', color: '#107E3E', fontWeight: 700, backgroundColor: '#E8F5ED', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                    Factor: 1.0 (Full Overlap)
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Missing Requirements List */}
          {missingSkills.length > 0 && (
            <div>
              <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#E9730C', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <AlertTriangleIcon size={14} color="#E9730C" /> Missing Catalogue Requirements ({missingSkills.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {missingSkills.map((s) => (
                  <div
                    key={s}
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #FEF3E8',
                      borderRadius: '6px',
                      padding: '0.45rem 0.75rem',
                      fontSize: '0.8rem',
                      color: '#222B35',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span>{s}</span>
                    <span style={{ fontSize: '0.72rem', color: '#E9730C', fontWeight: 700, backgroundColor: '#FEF3E8', padding: '0.15rem 0.45rem', borderRadius: '4px' }}>
                      Factor: 0.0 (To Bridge)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '0.85rem 1.5rem',
            borderTop: '1px solid #E2E8F0',
            backgroundColor: '#F8FAFC',
            textAlign: 'right'
          }}
        >
          <button
            onClick={onClose}
            style={{
              padding: '0.45rem 1rem',
              borderRadius: '6px',
              backgroundColor: '#0A6ED1',
              color: '#FFFFFF',
              fontSize: '0.85rem',
              fontWeight: 600,
              border: 'none',
              cursor: 'pointer'
            }}
          >
            Close Breakdown
          </button>
        </div>
      </div>
    </div>
  );
};
