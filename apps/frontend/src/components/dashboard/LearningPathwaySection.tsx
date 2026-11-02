import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ExtendedCareerRole } from '../../demo/demoCareers';
import { DEMO_LEARNING_MODULES, LearningModule } from '../../demo/demoLearning';
import {
  CheckIcon,
  ExternalLinkIcon,
  ArrowRightIcon,
  InfoIcon
} from '../common/Icons';

interface LearningPathwaySectionProps {
  targetRole: ExtendedCareerRole;
  completedLearningIds: string[];
  toggleLearningCompletion: (id: string) => void;
}

export const LearningPathwaySection: React.FC<LearningPathwaySectionProps> = ({
  targetRole,
  completedLearningIds,
  toggleLearningCompletion
}) => {
  const navigate = useNavigate();

  // Find modules for target role, or fallback to top modules
  const roleModules: LearningModule[] = DEMO_LEARNING_MODULES.filter(
    (m) => m.roleSlug === targetRole.slug
  );
  const displayModules = roleModules.length > 0 ? roleModules : DEMO_LEARNING_MODULES.slice(0, 3);

  const completedCount = displayModules.filter((m) => completedLearningIds.includes(m.id)).length;
  const totalHours = displayModules.reduce((acc, m) => acc + m.estimatedHours, 0);

  return (
    <div
      id="learning-pathway"
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
              Personalized Learning Pathway
            </h3>
            <span
              style={{
                fontSize: '0.75rem',
                backgroundColor: '#F2ECFA',
                color: '#633CA3',
                padding: '0.2rem 0.55rem',
                borderRadius: '12px',
                fontWeight: 700
              }}
            >
              {completedCount} of {displayModules.length} Milestones Completed
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#5B6876', margin: '0.2rem 0 0' }}>
            Curated official roadmaps tailored for <strong>{targetRole.title}</strong> (~{totalHours} hrs estimated study time)
          </p>
        </div>

        {/* Self-reported Disclosure Pill */}
        <div
          style={{
            fontSize: '0.75rem',
            backgroundColor: '#F8FAFC',
            border: '1px solid #E2E8F0',
            color: '#475569',
            padding: '0.35rem 0.75rem',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}
        >
          <InfoIcon size={14} color="#0A6ED1" />
          <span>Self-Reported Progress (LMS Sync Not Connected)</span>
        </div>
      </div>

      {/* Sequenced Milestones */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {displayModules.map((module, idx) => {
          const isCompleted = completedLearningIds.includes(module.id);

          return (
            <div
              key={module.id}
              style={{
                border: isCompleted ? '1px solid #B8E3C6' : '1px solid #E2E8F0',
                borderRadius: '8px',
                backgroundColor: isCompleted ? '#F8FDF9' : '#FFFFFF',
                padding: '1rem 1.25rem',
                display: 'flex',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
                gap: '1rem',
                flexWrap: 'wrap',
                transition: 'all 0.15s ease'
              }}
            >
              {/* Checkbox and Milestone Info */}
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem', flex: 1, minWidth: '260px' }}>
                {/* Interactive Checkbox */}
                <button
                  onClick={() => toggleLearningCompletion(module.id)}
                  title={isCompleted ? 'Mark incomplete' : 'Mark complete (Self-reported)'}
                  style={{
                    width: '24px',
                    height: '24px',
                    borderRadius: '6px',
                    border: isCompleted ? '2px solid #107E3E' : '2px solid #CBD5E1',
                    backgroundColor: isCompleted ? '#107E3E' : '#FFFFFF',
                    color: '#FFFFFF',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    marginTop: '2px',
                    transition: 'all 0.15s ease',
                    flexShrink: 0
                  }}
                >
                  {isCompleted && <CheckIcon size={14} color="#FFFFFF" />}
                </button>

                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: 700,
                        backgroundColor: '#EBF3FB',
                        color: '#0A6ED1',
                        padding: '0.15rem 0.45rem',
                        borderRadius: '4px'
                      }}
                    >
                      Step {idx + 1}: {module.code}
                    </span>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#001A47' }}>
                      {module.title}
                    </span>
                    {isCompleted && (
                      <span
                        style={{
                          fontSize: '0.7rem',
                          fontWeight: 700,
                          backgroundColor: '#E8F5ED',
                          color: '#107E3E',
                          padding: '0.15rem 0.45rem',
                          borderRadius: '4px'
                        }}
                      >
                        COMPLETED (Self-Reported)
                      </span>
                    )}
                  </div>

                  <div
                    style={{
                      fontSize: '0.8rem',
                      color: '#5B6876',
                      marginTop: '0.35rem',
                      display: 'flex',
                      gap: '1rem',
                      flexWrap: 'wrap'
                    }}
                  >
                    <span>
                      <strong>Provider:</strong> {module.provider}
                    </span>
                    <span>
                      <strong>Effort:</strong> ~{module.estimatedHours} hrs
                    </span>
                    <span>
                      <strong>Target Competency:</strong> {module.targetSkill}
                    </span>
                    <span>
                      <strong>Level:</strong> {module.level}
                    </span>
                  </div>

                  {/* Syllabus points */}
                  {module.syllabusPoints && module.syllabusPoints.length > 0 && (
                    <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: '#475569' }}>
                      <span style={{ fontWeight: 600 }}>Curriculum Highlights:</span>{' '}
                      {module.syllabusPoints.slice(0, 2).join(' • ')}
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', alignSelf: 'center' }}>
                <a
                  href={module.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    backgroundColor: '#633CA3',
                    color: '#FFFFFF',
                    padding: '0.45rem 0.85rem',
                    borderRadius: '6px',
                    textDecoration: 'none',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    boxShadow: '0 1px 3px rgba(99, 60, 163, 0.25)'
                  }}
                >
                  <span>Launch Official Course</span>
                  <ExternalLinkIcon size={12} color="#FFFFFF" />
                </a>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Explore Pathway link */}
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
          Inspect comprehensive course syllabi, prerequisites & certification paths
        </span>
        <button
          onClick={() => navigate('/learning')}
          style={{
            color: '#633CA3',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          View Full Learning Pathway <ArrowRightIcon size={14} color="#633CA3" />
        </button>
      </div>
    </div>
  );
};
