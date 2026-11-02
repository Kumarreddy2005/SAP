import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InfoIcon, CheckIcon } from '../common/Icons';

interface TransitionProgressTrackerProps {
  isProfileComplete: boolean;
  skillsReviewedPct: number;
  confirmedCount: number;
  totalSkillsCount: number;
  isCareerAnalysisComplete: boolean;
  learningProgressPct: number;
  completedLearningCount: number;
  totalLearningCount: number;
  projectEvidencePct: number;
  completedProjectCount: number;
  totalProjectCount: number;
  onNavigateToSection: (sectionId: string) => void;
}

export const TransitionProgressTracker: React.FC<TransitionProgressTrackerProps> = ({
  isProfileComplete,
  skillsReviewedPct,
  confirmedCount,
  totalSkillsCount,
  isCareerAnalysisComplete,
  learningProgressPct,
  completedLearningCount,
  totalLearningCount,
  projectEvidencePct,
  completedProjectCount,
  totalProjectCount,
  onNavigateToSection
}) => {
  const navigate = useNavigate();
  const [showFormulaModal, setShowFormulaModal] = useState(false);

  // Documented, transparent calculation rules
  const profileScore = isProfileComplete ? 100 : 50;
  const skillsScore = Math.min(100, Math.round(skillsReviewedPct));
  const careerScore = isCareerAnalysisComplete ? 100 : 0;
  const learningScore = Math.min(100, Math.round(learningProgressPct));
  const projectScore = Math.min(100, Math.round(projectEvidencePct));

  // Transparent average of the 5 milestones
  const overallProgress = Math.round(
    (profileScore + skillsScore + careerScore + learningScore + projectScore) / 5
  );

  const steps = [
    {
      id: 'profile',
      number: 1,
      title: 'Profile Intake',
      progress: profileScore,
      details: isProfileComplete ? 'Background verified' : 'Incomplete intake',
      action: () => navigate('/profile')
    },
    {
      id: 'skills',
      number: 2,
      title: 'Skills Reviewed',
      progress: skillsScore,
      details: `${confirmedCount} of ${totalSkillsCount} confirmed`,
      action: () => navigate('/skills-review')
    },
    {
      id: 'career',
      number: 3,
      title: 'Career Analysis',
      progress: careerScore,
      details: isCareerAnalysisComplete ? 'Target role calibrated' : 'Pending target selection',
      action: () => onNavigateToSection('recommended-careers')
    },
    {
      id: 'learning',
      number: 4,
      title: 'Learning Progress',
      progress: learningScore,
      details: `${completedLearningCount} of ${totalLearningCount} modules (Self-Reported)`,
      action: () => onNavigateToSection('learning-pathway')
    },
    {
      id: 'project',
      number: 5,
      title: 'Project Evidence',
      progress: projectScore,
      details: `${completedProjectCount} of ${totalProjectCount} reviewed challenges`,
      action: () => onNavigateToSection('projects')
    }
  ];

  return (
    <div
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
              Career Transition Roadmap
            </h3>
            <span
              style={{
                fontSize: '0.75rem',
                backgroundColor: overallProgress >= 60 ? '#E8F5ED' : '#EBF3FB',
                color: overallProgress >= 60 ? '#107E3E' : '#0A6ED1',
                padding: '0.2rem 0.55rem',
                borderRadius: '12px',
                fontWeight: 700
              }}
            >
              {overallProgress}% Total Transition Progress
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#5B6876', margin: '0.2rem 0 0' }}>
            5 verifiable lifecycle stages calculated from active candidate data and session milestones
          </p>
        </div>

        <button
          onClick={() => setShowFormulaModal(!showFormulaModal)}
          style={{
            fontSize: '0.78rem',
            color: '#0A6ED1',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: '#F0F6FC',
            border: '1px solid #D0E2F5',
            padding: '0.35rem 0.75rem',
            borderRadius: '6px',
            cursor: 'pointer'
          }}
        >
          <InfoIcon size={14} color="#0A6ED1" />
          {showFormulaModal ? 'Hide Calculation Rules' : 'Explain Formula & Rules'}
        </button>
      </div>

      {/* Transparent Formula Disclosure Card (Toggleable) */}
      {showFormulaModal && (
        <div
          style={{
            backgroundColor: '#F8FAFC',
            border: '1px solid #D9E1E8',
            borderRadius: '8px',
            padding: '1rem 1.25rem',
            marginBottom: '1.25rem',
            fontSize: '0.8rem',
            color: '#334155',
            lineHeight: 1.6
          }}
        >
          <div style={{ fontWeight: 700, color: '#001A47', marginBottom: '0.3rem' }}>
            Documented Transition Progress Formula:
          </div>
          <div
            style={{
              fontFamily: 'monospace',
              backgroundColor: '#FFFFFF',
              border: '1px solid #E2E8F0',
              padding: '0.4rem 0.75rem',
              borderRadius: '4px',
              color: '#0A6ED1',
              fontWeight: 600,
              marginBottom: '0.5rem'
            }}
          >
            TransitionProgress = Round( (Profile(100) + SkillsReview({skillsScore}%) + CareerAnalysis({careerScore}%) + Learning({learningScore}%) + Projects({projectScore}%)) / 5 ) = {overallProgress}%
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.5rem', fontSize: '0.75rem' }}>
            <div>• <strong>Profile (20%):</strong> Candidate background completeness.</div>
            <div>• <strong>Skills (20%):</strong> Ratio of human-confirmed vs extracted skills.</div>
            <div>• <strong>Career (20%):</strong> Target role match and gap calculation.</div>
            <div>• <strong>Learning (20%):</strong> Self-reported session milestones completed.</div>
            <div>• <strong>Projects (20%):</strong> Practical challenge submissions reviewed.</div>
          </div>
        </div>
      )}

      {/* 5-Step Visual Progress Bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '1rem',
          position: 'relative'
        }}
      >
        {steps.map((step) => {
          const isDone = step.progress === 100;
          const isInProgress = step.progress > 0 && step.progress < 100;

          return (
            <div
              key={step.id}
              onClick={step.action}
              style={{
                backgroundColor: isDone ? '#F8FDF9' : '#FFFFFF',
                border: isDone ? '1px solid #B8E3C6' : '1px solid #E2E8F0',
                borderRadius: '8px',
                padding: '0.85rem 1rem',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                position: 'relative',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#0A6ED1';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(10, 110, 209, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = isDone ? '#B8E3C6' : '#E2E8F0';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              {/* Progress track at bottom */}
              <div
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  backgroundColor: '#EDF1F5'
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: `${step.progress}%`,
                    backgroundColor: isDone ? '#107E3E' : '#0A6ED1',
                    transition: 'width 0.3s ease'
                  }}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                <span
                  style={{
                    width: '22px',
                    height: '22px',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    backgroundColor: isDone ? '#107E3E' : isInProgress ? '#0A6ED1' : '#F1F5F9',
                    color: isDone || isInProgress ? '#FFFFFF' : '#64748B'
                  }}
                >
                  {isDone ? <CheckIcon size={12} color="#FFFFFF" /> : step.number}
                </span>

                <span
                  style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: isDone ? '#107E3E' : isInProgress ? '#0A6ED1' : '#64748B'
                  }}
                >
                  {step.progress}%
                </span>
              </div>

              <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#001A47' }}>
                {step.title}
              </div>

              <div style={{ fontSize: '0.72rem', color: '#5B6876', marginTop: '0.15rem' }}>
                {step.details}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
