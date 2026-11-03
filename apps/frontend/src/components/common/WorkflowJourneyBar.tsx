import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useCareerContext } from '../../context/CareerContext';
import { CheckIcon, ArrowRightIcon, BriefcaseIcon } from './Icons';

export interface WorkflowStage {
  id: number;
  slug: string;
  label: string;
  shortLabel: string;
  path: string;
  isComplete: (ctx: ReturnType<typeof useCareerContext>) => boolean;
}

export const WORKFLOW_STAGES: WorkflowStage[] = [
  {
    id: 1,
    slug: 'intake',
    label: '1. Profile Intake',
    shortLabel: 'Intake',
    path: '/profile',
    isComplete: (ctx) =>
      ctx.sessionMode === 'DEMO' ||
      ctx.isRealProfileLoaded ||
      ctx.skills.length > 0 ||
      ctx.manualProfile.fullName.trim() !== ''
  },
  {
    id: 2,
    slug: 'skills-review',
    label: '2. Skills Review',
    shortLabel: 'Skills',
    path: '/skills-review',
    isComplete: (ctx) =>
      ctx.sessionMode === 'DEMO' ||
      ctx.isRealProfileReviewed ||
      ctx.skills.some((s) => s.isConfirmed)
  },
  {
    id: 3,
    slug: 'target-role',
    label: '3. Target Role',
    shortLabel: 'Role',
    path: '/careers',
    isComplete: (ctx) => Boolean(ctx.targetRoleSlug)
  },
  {
    id: 4,
    slug: 'skill-gaps',
    label: '4. Skill Gaps',
    shortLabel: 'Gaps',
    path: '/career-gap',
    isComplete: (ctx) => Boolean(ctx.currentGapAnalysis || ctx.targetRoleSlug)
  },
  {
    id: 5,
    slug: 'learning',
    label: '5. Learning Hub',
    shortLabel: 'Learn',
    path: '/learning',
    isComplete: (ctx) => ctx.completedLearningIds.length > 0
  },
  {
    id: 6,
    slug: 'projects',
    label: '6. Projects',
    shortLabel: 'Projects',
    path: '/projects',
    isComplete: (ctx) =>
      Object.keys(ctx.projectSubmissions).length > 0 ||
      Object.keys(ctx.activeProjectSubmissions).length > 0
  },
  {
    id: 7,
    slug: 'readiness',
    label: '7. Readiness Score',
    shortLabel: 'Readiness',
    path: '/readiness',
    isComplete: (ctx) => Boolean(ctx.readinessScorecard)
  },
  {
    id: 8,
    slug: 'jobs',
    label: '8. Job Discovery',
    shortLabel: 'Jobs',
    path: '/jobs',
    isComplete: (ctx) => Boolean(ctx.jobSearchData)
  }
];

export const WorkflowJourneyBar: React.FC<{ style?: React.CSSProperties }> = ({ style }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const context = useCareerContext();
  const { sessionMode } = context;

  const currentPath = location.pathname;

  // Determine active stage
  const getActiveStageIndex = () => {
    if (currentPath === '/profile') return 0;
    if (currentPath === '/skills-review') return 1;
    if (currentPath.startsWith('/careers')) return 2;
    if (currentPath === '/career-gap') return 3;
    if (currentPath === '/learning') return 4;
    if (currentPath === '/projects') return 5;
    if (currentPath === '/readiness') return 6;
    if (currentPath === '/jobs') return 7;
    return -1;
  };

  const activeIndex = getActiveStageIndex();

  // Find next logical step
  const nextStage = activeIndex >= 0 && activeIndex < WORKFLOW_STAGES.length - 1
    ? WORKFLOW_STAGES[activeIndex + 1]
    : null;

  return (
    <nav
      aria-label="Career Transition Journey Progression"
      style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #D9E1E8',
        boxShadow: '0 1px 3px rgba(0, 26, 71, 0.04)',
        position: 'sticky',
        top: 53, // right below top Navbar
        zIndex: 90,
        ...style
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0.45rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }}
      >
        {/* Left: Session Badge & Return to Dashboard */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexShrink: 0 }}>
          <button
            onClick={() => navigate('/dashboard')}
            title="Return to Executive Overview Dashboard"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.35rem',
              fontSize: '0.78rem',
              fontWeight: 600,
              color: '#0A6ED1',
              backgroundColor: '#EBF3FB',
              border: '1px solid #B9D5F5',
              padding: '0.25rem 0.6rem',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <BriefcaseIcon size={13} color="#0A6ED1" />
            <span className="hide-on-mobile">Dashboard</span>
          </button>

          {/* Mode Pill */}
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 600,
              padding: '0.2rem 0.55rem',
              borderRadius: '9999px',
              letterSpacing: '0.02em',
              textTransform: 'uppercase',
              backgroundColor:
                sessionMode === 'DEMO'
                  ? '#EBF3FB'
                  : sessionMode === 'REAL_PROFILE'
                  ? '#E8F5ED'
                  : '#FEF3E8',
              color:
                sessionMode === 'DEMO'
                  ? '#0A6ED1'
                  : sessionMode === 'REAL_PROFILE'
                  ? '#107E3E'
                  : '#E9730C',
              border: `1px solid ${
                sessionMode === 'DEMO'
                  ? '#B9D5F5'
                  : sessionMode === 'REAL_PROFILE'
                  ? '#B8E3C8'
                  : '#FBD38D'
              }`
            }}
            title={
              sessionMode === 'DEMO'
                ? 'Curated Alex Vance candidate session'
                : sessionMode === 'REAL_PROFILE'
                ? 'Candidate session loaded from real uploaded document'
                : 'Fresh candidate intake session'
            }
          >
            {sessionMode === 'DEMO'
              ? 'Demo: Alex Vance'
              : sessionMode === 'REAL_PROFILE'
              ? 'Candidate Profile'
              : 'Fresh Session'}
          </span>
        </div>

        {/* Center: Scrollable horizontal stepper */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.25rem',
            overflowX: 'auto',
            padding: '0.1rem 0',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none'
          }}
        >
          {WORKFLOW_STAGES.map((stage, idx) => {
            const isActive = idx === activeIndex;
            const isCompleted = stage.isComplete(context);

            return (
              <React.Fragment key={stage.id}>
                {idx > 0 && (
                  <span
                    style={{
                      color: idx <= activeIndex ? '#0A6ED1' : '#CBD5E1',
                      fontSize: '0.7rem',
                      userSelect: 'none',
                      padding: '0 0.1rem'
                    }}
                  >
                    ›
                  </span>
                )}
                <Link
                  to={stage.path}
                  title={`${stage.label} — ${isCompleted ? 'Completed' : isActive ? 'Current Stage' : 'Pending'}`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    padding: '0.25rem 0.55rem',
                    borderRadius: '4px',
                    fontSize: '0.78rem',
                    fontWeight: isActive ? 700 : isCompleted ? 600 : 500,
                    color: isActive
                      ? '#FFFFFF'
                      : isCompleted
                      ? '#001A47'
                      : '#64748B',
                    backgroundColor: isActive
                      ? '#0A6ED1'
                      : isCompleted
                      ? '#F1F5F9'
                      : 'transparent',
                    textDecoration: 'none',
                    whiteSpace: 'nowrap',
                    transition: 'all 0.15s ease',
                    boxShadow: isActive ? '0 1px 3px rgba(10, 110, 209, 0.25)' : 'none'
                  }}
                >
                  <span
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      backgroundColor: isActive
                        ? '#FFFFFF'
                        : isCompleted
                        ? '#107E3E'
                        : '#E2E8F0',
                      color: isActive
                        ? '#0A6ED1'
                        : isCompleted
                        ? '#FFFFFF'
                        : '#64748B'
                    }}
                  >
                    {isCompleted ? <CheckIcon size={10} color={isActive ? '#0A6ED1' : '#FFFFFF'} /> : stage.id}
                  </span>
                  <span className="hide-on-mobile">{stage.label}</span>
                  <span className="show-on-mobile">{stage.shortLabel}</span>
                </Link>
              </React.Fragment>
            );
          })}
        </div>

        {/* Right: Quick Action to Next Stage */}
        {nextStage && (
          <div style={{ flexShrink: 0 }} className="hide-on-tablet">
            <button
              onClick={() => navigate(nextStage.path)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                fontSize: '0.78rem',
                fontWeight: 600,
                color: '#001A47',
                backgroundColor: '#F1F5F9',
                border: '1px solid #CBD5E1',
                padding: '0.25rem 0.65rem',
                borderRadius: '4px',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#EBF3FB';
                e.currentTarget.style.borderColor = '#0A6ED1';
                e.currentTarget.style.color = '#0A6ED1';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#F1F5F9';
                e.currentTarget.style.borderColor = '#CBD5E1';
                e.currentTarget.style.color = '#001A47';
              }}
            >
              <span>Next: {nextStage.shortLabel}</span>
              <ArrowRightIcon size={12} />
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};
