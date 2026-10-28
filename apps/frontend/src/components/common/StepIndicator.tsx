import React from 'react';
import { useNavigate } from 'react-router-dom';

export interface Step {
  id: string;
  name: string;
  path: string;
}

export const JOURNEY_STEPS: Step[] = [
  { id: 'profile', name: '1. Background', path: '/profile' },
  { id: 'skills', name: '2. Skills Review', path: '/skills-review' },
  { id: 'careers', name: '3. Explore Careers', path: '/careers' },
  { id: 'compare', name: '4. Compare Options', path: '/careers/compare' },
  { id: 'gap', name: '5. Gap Analysis', path: '/career-gap' },
  { id: 'learning', name: '6. Learning Plan', path: '/learning' },
  { id: 'projects', name: '7. Projects', path: '/projects' },
  { id: 'readiness', name: '8. Readiness', path: '/readiness' },
  { id: 'jobs', name: '9. Job Search', path: '/jobs' }
];

export interface StepIndicatorProps {
  currentStepId: string;
}

export const StepIndicator: React.FC<StepIndicatorProps> = ({ currentStepId }) => {
  const navigate = useNavigate();
  const currentIndex = JOURNEY_STEPS.findIndex((s) => s.id === currentStepId);

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #D9E1E8',
        borderRadius: '8px',
        padding: '0.75rem 1rem',
        marginBottom: '2rem',
        overflowX: 'auto',
        boxShadow: '0 1px 3px rgba(0, 26, 71, 0.04)'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          minWidth: '780px',
          justifyContent: 'space-between'
        }}
      >
        {JOURNEY_STEPS.map((step, index) => {
          const isCurrent = step.id === currentStepId;
          const isPast = currentIndex > -1 && index < currentIndex;

          return (
            <React.Fragment key={step.id}>
              <button
                onClick={() => navigate(step.path)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.4rem 0.6rem',
                  borderRadius: '4px',
                  backgroundColor: isCurrent ? '#EBF3FB' : 'transparent',
                  color: isCurrent ? '#0A6ED1' : isPast ? '#107E3E' : '#5B6876',
                  fontWeight: isCurrent ? 700 : 500,
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  border: 'none',
                  whiteSpace: 'nowrap',
                  transition: 'background-color 0.15s ease'
                }}
                title={`Go to ${step.name}`}
              >
                <span
                  style={{
                    width: '18px',
                    height: '18px',
                    borderRadius: '50%',
                    backgroundColor: isCurrent ? '#0A6ED1' : isPast ? '#107E3E' : '#D9E1E8',
                    color: '#FFFFFF',
                    fontSize: '0.7rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontWeight: 700
                  }}
                >
                  {isPast ? '✓' : index + 1}
                </span>
                <span>{step.name.replace(/^\d+\.\s*/, '')}</span>
              </button>
              {index < JOURNEY_STEPS.length - 1 && (
                <div
                  style={{
                    flex: 1,
                    height: '2px',
                    backgroundColor: isPast ? '#107E3E' : '#EDF1F5',
                    margin: '0 0.25rem',
                    minWidth: '12px'
                  }}
                />
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};
