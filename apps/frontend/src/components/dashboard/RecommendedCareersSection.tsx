import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExtendedCareerRole } from '../../demo/demoCareers';
import {
  CheckIcon,
  AlertTriangleIcon,
  ArrowRightIcon,
  InfoIcon,
  ColumnsIcon
} from '../common/Icons';

interface RecommendedCareersSectionProps {
  rolesWithMatches: {
    role: ExtendedCareerRole;
    matchScore: number;
    matchedSkills: string[];
    missingSkills: string[];
  }[];
  activeTargetSlug: string;
  onSetTargetRole: (slug: string) => void;
  onExplainMatch: (role: ExtendedCareerRole, score: number) => void;
}

export const RecommendedCareersSection: React.FC<RecommendedCareersSectionProps> = ({
  rolesWithMatches,
  activeTargetSlug,
  onSetTargetRole,
  onExplainMatch
}) => {
  const navigate = useNavigate();
  const [filterEcosystem, setFilterEcosystem] = useState<'ALL' | 'SAP' | 'HYBRID'>('ALL');

  // Filter and sort top 4 matching roles
  const filteredRoles = rolesWithMatches
    .filter((item) => {
      if (filterEcosystem === 'ALL') return true;
      return item.role.ecosystem === filterEcosystem;
    })
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, 4);

  return (
    <div
      id="recommended-careers"
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #D9E1E8',
        borderRadius: '12px',
        padding: '1.5rem',
        boxShadow: '0 2px 8px rgba(0, 26, 71, 0.05)'
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '1.25rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#001A47', margin: 0 }}>
              Recommended Target Careers
            </h3>
            <span
              style={{
                fontSize: '0.75rem',
                backgroundColor: '#EBF3FB',
                color: '#0A6ED1',
                padding: '0.2rem 0.55rem',
                borderRadius: '12px',
                fontWeight: 600
              }}
            >
              Explainable Weighted Match
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#5B6876', margin: '0.2rem 0 0' }}>
            Ranked by candidate confirmed competency overlap. Scores illustrate skill alignment, not hiring probability.
          </p>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          {(['ALL', 'SAP', 'HYBRID'] as const).map((eco) => (
            <button
              key={eco}
              onClick={() => setFilterEcosystem(eco)}
              style={{
                padding: '0.3rem 0.65rem',
                borderRadius: '16px',
                fontSize: '0.75rem',
                fontWeight: 600,
                backgroundColor: filterEcosystem === eco ? '#0A6ED1' : '#F5F6F7',
                color: filterEcosystem === eco ? '#FFFFFF' : '#5B6876',
                border: filterEcosystem === eco ? '1px solid #0A6ED1' : '1px solid #D9E1E8',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {eco === 'ALL' ? 'All Tracks' : `${eco} Ecosystem`}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of Career Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.25rem'
        }}
      >
        {filteredRoles.map(({ role, matchScore, matchedSkills, missingSkills }) => {
          const isActive = role.slug === activeTargetSlug;

          return (
            <div
              key={role.id}
              style={{
                backgroundColor: isActive ? '#F8FAFF' : '#FFFFFF',
                border: isActive ? '2px solid #0A6ED1' : '1px solid #E2E8F0',
                borderRadius: '10px',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: isActive ? '0 4px 12px rgba(10, 110, 209, 0.12)' : '0 1px 4px rgba(0, 26, 71, 0.04)',
                position: 'relative',
                transition: 'all 0.15s ease'
              }}
            >
              {/* Active Badge */}
              {isActive && (
                <div
                  style={{
                    position: 'absolute',
                    top: '-10px',
                    right: '16px',
                    backgroundColor: '#0A6ED1',
                    color: '#FFFFFF',
                    fontSize: '0.7rem',
                    fontWeight: 700,
                    padding: '0.15rem 0.55rem',
                    borderRadius: '10px',
                    letterSpacing: '0.04em'
                  }}
                >
                  ACTIVE TARGET
                </div>
              )}

              {/* Top Row: Track & Match Pill */}
              <div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                    marginBottom: '0.65rem'
                  }}
                >
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      color: role.ecosystem === 'SAP' ? '#0A6ED1' : '#5B6876',
                      backgroundColor: role.ecosystem === 'SAP' ? '#EBF3FB' : '#F1F5F9',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '4px'
                    }}
                  >
                    {role.track.replace(/_/g, ' ')}
                  </span>

                  {/* Match Score Badge */}
                  <button
                    onClick={() => onExplainMatch(role, matchScore)}
                    title="Click to inspect explainable formula"
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      backgroundColor: matchScore >= 70 ? '#E8F5ED' : '#EBF3FB',
                      color: matchScore >= 70 ? '#107E3E' : '#0A6ED1',
                      padding: '0.2rem 0.55rem',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      cursor: 'pointer',
                      border: matchScore >= 70 ? '1px solid #B8E3C6' : '1px solid #D0E2F5'
                    }}
                  >
                    <span>{matchScore}% Match</span>
                    <InfoIcon size={12} />
                  </button>
                </div>

                {/* Role Title */}
                <h4
                  style={{
                    fontSize: '1.05rem',
                    fontWeight: 700,
                    color: '#001A47',
                    margin: '0 0 0.4rem',
                    lineHeight: 1.3
                  }}
                >
                  {role.title}
                </h4>

                <p
                  style={{
                    fontSize: '0.8rem',
                    color: '#5B6876',
                    lineHeight: 1.45,
                    margin: '0 0 0.85rem'
                  }}
                >
                  {role.summary.slice(0, 115)}...
                </p>

                {/* Competency Overlap Breakdown */}
                <div style={{ marginBottom: '1rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  {/* Confirmed matches */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem' }}>
                    <CheckIcon size={13} color="#107E3E" />
                    <span style={{ fontWeight: 600, color: '#107E3E' }}>
                      {matchedSkills.length} Confirmed Matches:
                    </span>
                    <span style={{ color: '#475569' }}>
                      {matchedSkills.slice(0, 2).join(', ')}
                      {matchedSkills.length > 2 && ` +${matchedSkills.length - 2} more`}
                    </span>
                  </div>

                  {/* Missing requirements */}
                  {missingSkills.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem' }}>
                      <AlertTriangleIcon size={13} color="#E9730C" />
                      <span style={{ fontWeight: 600, color: '#E9730C' }}>
                        {missingSkills.length} Requirements to Bridge:
                      </span>
                      <span style={{ color: '#475569' }}>
                        {missingSkills.slice(0, 2).join(', ')}
                        {missingSkills.length > 2 && ` +${missingSkills.length - 2} more`}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Bottom Actions */}
              <div
                style={{
                  borderTop: '1px solid #EDF1F5',
                  paddingTop: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '0.5rem'
                }}
              >
                {!isActive ? (
                  <button
                    onClick={() => onSetTargetRole(role.slug)}
                    style={{
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      backgroundColor: '#0A6ED1',
                      color: '#FFFFFF',
                      padding: '0.4rem 0.8rem',
                      borderRadius: '6px',
                      cursor: 'pointer',
                      border: 'none',
                      flex: 1
                    }}
                  >
                    Set as Target
                  </button>
                ) : (
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: '#0A6ED1',
                      backgroundColor: '#EBF3FB',
                      padding: '0.4rem 0.8rem',
                      borderRadius: '6px',
                      textAlign: 'center',
                      flex: 1
                    }}
                  >
                    Selected Target Role
                  </span>
                )}

                <button
                  onClick={() => navigate('/careers/compare')}
                  title="Compare with other roles"
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    backgroundColor: '#F8FAFC',
                    color: '#5B6876',
                    border: '1px solid #D9E1E8',
                    padding: '0.4rem 0.65rem',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}
                >
                  <ColumnsIcon size={13} /> Compare
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Explore link */}
      <div
        style={{
          marginTop: '1.25rem',
          paddingTop: '1rem',
          borderTop: '1px solid #EDF1F5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.85rem'
        }}
      >
        <span style={{ color: '#5B6876' }}>
          Explore all 14 enterprise roles in the catalog
        </span>
        <button
          onClick={() => navigate('/careers')}
          style={{
            color: '#0A6ED1',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          View Full Career Explorer <ArrowRightIcon size={14} color="#0A6ED1" />
        </button>
      </div>
    </div>
  );
};
