import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExtractedSkillItem } from '@career-orchestrator/shared';
import { CloseIcon, EditIcon } from '../common/Icons';

interface SkillsDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  skills: ExtractedSkillItem[];
  initialFilter?: 'ALL' | 'CONFIRMED' | 'TRANSFERABLE' | 'SUGGESTED';
}

export const SkillsDetailModal: React.FC<SkillsDetailModalProps> = ({
  isOpen,
  onClose,
  skills,
  initialFilter = 'ALL'
}) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'ALL' | 'CONFIRMED' | 'TRANSFERABLE' | 'SUGGESTED'>(initialFilter);
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  if (!isOpen) return null;

  const filteredSkills = skills.filter((s) => {
    if (filter === 'CONFIRMED' && (!s.isConfirmed || s.reviewStatus !== 'CONFIRMED')) return false;
    if (filter === 'TRANSFERABLE' && (!s.isTransferable || !s.isConfirmed)) return false;
    if (filter === 'SUGGESTED' && s.isConfirmed) return false;
    if (categoryFilter !== 'ALL' && s.category !== categoryFilter) return false;
    return true;
  });

  const categories = Array.from(new Set(skills.map((s) => s.category)));

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
          maxWidth: '840px',
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
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#001A47',
            color: '#FFFFFF'
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>
              Candidate Competency Inventory
            </h2>
            <p style={{ fontSize: '0.85rem', color: '#C4D5EA', margin: '0.2rem 0 0' }}>
              Extracted from candidate background & validated through human-in-the-loop review
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

        {/* Filter bar */}
        <div
          style={{
            padding: '1rem 1.5rem',
            backgroundColor: '#F8FAFC',
            borderBottom: '1px solid #E2E8F0',
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '0.75rem'
          }}
        >
          {/* Quick filter pills */}
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {[
              { id: 'ALL', label: `All (${skills.length})` },
              { id: 'CONFIRMED', label: `Confirmed (${skills.filter((s) => s.isConfirmed).length})` },
              {
                id: 'TRANSFERABLE',
                label: `Transferable (${skills.filter((s) => s.isConfirmed && s.isTransferable).length})`
              },
              { id: 'SUGGESTED', label: `Unconfirmed (${skills.filter((s) => !s.isConfirmed).length})` }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as typeof filter)}
                style={{
                  padding: '0.35rem 0.75rem',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  backgroundColor: filter === tab.id ? '#0A6ED1' : '#FFFFFF',
                  color: filter === tab.id ? '#FFFFFF' : '#5B6876',
                  border: filter === tab.id ? '1px solid #0A6ED1' : '1px solid #D9E1E8',
                  transition: 'all 0.15s ease'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Category Dropdown */}
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: '6px',
              fontSize: '0.8rem',
              border: '1px solid #D9E1E8',
              backgroundColor: '#FFFFFF',
              color: '#001A47',
              fontWeight: 500
            }}
          >
            <option value="ALL">All Competency Categories</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c.replace(/_/g, ' ')}
              </option>
            ))}
          </select>
        </div>

        {/* Content list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 1.5rem' }}>
          {filteredSkills.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#5B6876' }}>
              No competencies match the selected criteria.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {filteredSkills.map((skill) => (
                <div
                  key={skill.id}
                  style={{
                    border: '1px solid #EDF1F5',
                    borderRadius: '8px',
                    padding: '1rem',
                    backgroundColor: skill.isConfirmed ? '#FFFFFF' : '#FAFAFA'
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      justifyContent: 'space-between',
                      gap: '1rem'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#001A47' }}>
                          {skill.name}
                        </span>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            padding: '0.15rem 0.5rem',
                            borderRadius: '4px',
                            fontWeight: 600,
                            backgroundColor:
                              skill.reviewStatus === 'CONFIRMED'
                                ? '#E8F5ED'
                                : skill.reviewStatus === 'REJECTED'
                                ? '#FDE8E8'
                                : '#FEF3E8',
                            color:
                              skill.reviewStatus === 'CONFIRMED'
                                ? '#107E3E'
                                : skill.reviewStatus === 'REJECTED'
                                ? '#BB0000'
                                : '#E9730C'
                          }}
                        >
                          {skill.reviewStatus}
                        </span>
                        {skill.isTransferable && (
                          <span
                            style={{
                              fontSize: '0.75rem',
                              padding: '0.15rem 0.5rem',
                              borderRadius: '4px',
                              fontWeight: 600,
                              backgroundColor: '#EBF3FB',
                              color: '#0A6ED1'
                            }}
                          >
                            Transferable
                          </span>
                        )}
                      </div>

                      <div
                        style={{
                          fontSize: '0.8rem',
                          color: '#5B6876',
                          margin: '0.35rem 0 0',
                          display: 'flex',
                          gap: '1.25rem',
                          flexWrap: 'wrap'
                        }}
                      >
                        <span>
                          <strong>Category:</strong> {skill.category.replace(/_/g, ' ')}
                        </span>
                        <span>
                          <strong>Proficiency:</strong> {skill.proficiency || 'Uncalibrated'}
                        </span>
                        {skill.yearsExperience !== undefined && skill.yearsExperience !== null && (
                          <span>
                            <strong>Experience:</strong> {skill.yearsExperience} yrs
                          </span>
                        )}
                        <span>
                          <strong>Extraction Confidence:</strong> {Math.round(skill.confidenceScore * 100)}%
                        </span>
                      </div>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <span
                        style={{
                          fontSize: '0.75rem',
                          color: '#8492A0',
                          backgroundColor: '#F5F6F7',
                          padding: '0.2rem 0.45rem',
                          borderRadius: '4px',
                          fontFamily: 'monospace'
                        }}
                      >
                        {skill.code}
                      </span>
                    </div>
                  </div>

                  {skill.evidenceSnippet && (
                    <div
                      style={{
                        marginTop: '0.65rem',
                        padding: '0.5rem 0.75rem',
                        borderRadius: '4px',
                        backgroundColor: '#F8FAFC',
                        borderLeft: '3px solid #0A6ED1',
                        fontSize: '0.8rem',
                        color: '#222B35',
                        fontStyle: 'italic'
                      }}
                    >
                      &quot;{skill.evidenceSnippet}&quot;
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div
          style={{
            padding: '1rem 1.5rem',
            borderTop: '1px solid #E2E8F0',
            backgroundColor: '#F8FAFC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <span style={{ fontSize: '0.85rem', color: '#5B6876' }}>
            Showing {filteredSkills.length} of {skills.length} competencies
          </span>
          <button
            onClick={() => {
              navigate('/skills-review');
              onClose();
            }}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              backgroundColor: '#0A6ED1',
              color: '#FFFFFF',
              fontSize: '0.85rem',
              fontWeight: 600,
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <EditIcon size={14} color="#FFFFFF" /> Open Full Skills Review Tool
          </button>
        </div>
      </div>
    </div>
  );
};
