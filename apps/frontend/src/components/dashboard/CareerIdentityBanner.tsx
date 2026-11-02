import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ManualProfileData } from '../../context/CareerContext';
import { ExtendedCareerRole } from '../../demo/demoCareers';
import { ExtractedSkillItem } from '@career-orchestrator/shared';
import { ArrowRightIcon, BriefcaseIcon, AwardIcon, CheckIcon } from '../common/Icons';

interface CareerIdentityBannerProps {
  manualProfile: ManualProfileData;
  uploadedFile: { name: string; size: number; type: string } | null;
  skills: ExtractedSkillItem[];
  targetRole: ExtendedCareerRole;
  matchScore: number;
  onOpenRoleSelector: () => void;
  isRealProfileReviewed: boolean;
}

export const CareerIdentityBanner: React.FC<CareerIdentityBannerProps> = ({
  manualProfile,
  uploadedFile,
  skills,
  targetRole,
  matchScore,
  onOpenRoleSelector,
  isRealProfileReviewed
}) => {
  const navigate = useNavigate();

  // Find candidate's top confirmed skills
  const confirmedSkills = skills.filter((s) => s.isConfirmed && s.reviewStatus === 'CONFIRMED');
  const transferableSkills = confirmedSkills.filter((s) => s.isTransferable);

  // Generate personalized transition narrative
  const topTransferableNames = transferableSkills.slice(0, 3).map((s) => s.name);
  const narrative =
    confirmedSkills.length > 0
      ? `Your background in ${
          topTransferableNames.length > 0 ? topTransferableNames.join(', ') : 'enterprise operations'
        } provides a strong ${matchScore}% transferable foundation for transitioning into ${
          targetRole.title
        }. Priority focus areas include closing target ERP customizing competencies through structured learning milestones and hands-on projects.`
      : `Complete your skills calibration to generate a personalized transition pathway from your current experience into ${targetRole.title}.`;

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #D9E1E8',
        borderRadius: '12px',
        padding: '2rem 2.25rem',
        boxShadow: '0 4px 16px rgba(0, 26, 71, 0.06)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Decorative gradient overlay */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
          width: '380px',
          height: '100%',
          background: 'radial-gradient(circle at top right, rgba(10, 110, 209, 0.08), transparent 70%)',
          pointerEvents: 'none'
        }}
      />

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Top meta tags */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.85rem', flexWrap: 'wrap' }}>
          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              backgroundColor: '#EBF3FB',
              color: '#0A6ED1',
              padding: '0.25rem 0.65rem',
              borderRadius: '16px',
              letterSpacing: '0.02em'
            }}
          >
            ACTIVE TRANSITION TARGET
          </span>

          <span
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              backgroundColor: targetRole.ecosystem === 'SAP' ? '#E8F5ED' : '#F5F6F7',
              color: targetRole.ecosystem === 'SAP' ? '#107E3E' : '#5B6876',
              padding: '0.25rem 0.65rem',
              borderRadius: '16px'
            }}
          >
            {targetRole.ecosystem} Ecosystem
          </span>

          {isRealProfileReviewed ? (
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                backgroundColor: '#E8F5ED',
                color: '#107E3E',
                padding: '0.25rem 0.65rem',
                borderRadius: '16px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.3rem'
              }}
            >
              <CheckIcon size={12} color="#107E3E" /> Verified Candidate Profile
            </span>
          ) : (
            <span
              style={{
                fontSize: '0.75rem',
                fontWeight: 600,
                backgroundColor: '#FEF3E8',
                color: '#E9730C',
                padding: '0.25rem 0.65rem',
                borderRadius: '16px'
              }}
            >
              Sample Demo Profile Active
            </span>
          )}

          {uploadedFile && (
            <span
              style={{
                fontSize: '0.75rem',
                color: '#5B6876',
                backgroundColor: '#F8FAFC',
                padding: '0.25rem 0.65rem',
                borderRadius: '16px',
                border: '1px solid #EDF1F5'
              }}
            >
              Source: {uploadedFile.name}
            </span>
          )}
        </div>

        {/* Identity & Target Role Heading */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '1.5rem',
            marginBottom: '1rem'
          }}
        >
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <h1
                style={{
                  fontSize: '2rem',
                  fontWeight: 800,
                  color: '#001A47',
                  lineHeight: 1.2,
                  letterSpacing: '-0.02em',
                  margin: 0
                }}
              >
                {manualProfile.fullName || 'Alex Vance'}
              </h1>
              <span
                style={{
                  fontSize: '1rem',
                  color: '#5B6876',
                  fontWeight: 500
                }}
              >
                • {manualProfile.currentTitle || 'Senior Financial Analyst'} ({manualProfile.yearsExperience || 4.5} yrs exp)
              </span>
            </div>

            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginTop: '0.4rem',
                color: '#0A6ED1',
                fontSize: '1.1rem',
                fontWeight: 700
              }}
            >
              <BriefcaseIcon size={18} color="#0A6ED1" />
              <span>Target Role: {targetRole.title}</span>
            </div>
          </div>

          {/* Match Score Circular Pill */}
          <div
            style={{
              backgroundColor: '#F8FAFC',
              border: '1px solid #E2E8F0',
              borderRadius: '10px',
              padding: '0.85rem 1.25rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem'
            }}
          >
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: '50%',
                backgroundColor: matchScore >= 70 ? '#E8F5ED' : '#EBF3FB',
                color: matchScore >= 70 ? '#107E3E' : '#0A6ED1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.1rem',
                fontWeight: 800,
                border: matchScore >= 70 ? '2px solid #107E3E' : '2px solid #0A6ED1'
              }}
            >
              {matchScore}%
            </div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#5B6876', fontWeight: 600, textTransform: 'uppercase' }}>
                Transferable Overlap
              </div>
              <div style={{ fontSize: '0.8rem', color: '#222B35', fontWeight: 600 }}>
                Explainable Match
              </div>
            </div>
          </div>
        </div>

        {/* Personalized Narrative Statement */}
        <p
          style={{
            fontSize: '1rem',
            color: '#475569',
            lineHeight: 1.6,
            maxWidth: '920px',
            margin: '0 0 1.5rem'
          }}
        >
          {narrative}
        </p>

        {/* Action Button Row */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
          <button
            onClick={onOpenRoleSelector}
            style={{
              backgroundColor: '#0A6ED1',
              color: '#FFFFFF',
              fontWeight: 600,
              fontSize: '0.875rem',
              padding: '0.6rem 1.15rem',
              borderRadius: '6px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              cursor: 'pointer',
              border: 'none',
              boxShadow: '0 1px 3px rgba(10, 110, 209, 0.25)',
              transition: 'background-color 0.15s ease'
            }}
          >
            <BriefcaseIcon size={16} color="#FFFFFF" /> Switch Target Career Role
          </button>

          <button
            onClick={() => navigate('/careers')}
            style={{
              backgroundColor: '#FFFFFF',
              color: '#0A6ED1',
              fontWeight: 600,
              fontSize: '0.875rem',
              padding: '0.6rem 1.15rem',
              borderRadius: '6px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              cursor: 'pointer',
              border: '1px solid #0A6ED1',
              transition: 'all 0.15s ease'
            }}
          >
            Explore All 14 Roles <ArrowRightIcon size={14} color="#0A6ED1" />
          </button>

          <button
            onClick={() => navigate('/readiness')}
            style={{
              backgroundColor: '#F8FAFC',
              color: '#5B6876',
              fontWeight: 600,
              fontSize: '0.875rem',
              padding: '0.6rem 1.15rem',
              borderRadius: '6px',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              cursor: 'pointer',
              border: '1px solid #D9E1E8',
              transition: 'all 0.15s ease'
            }}
          >
            <AwardIcon size={16} color="#5B6876" /> View Readiness Scorecard
          </button>
        </div>
      </div>
    </div>
  );
};
