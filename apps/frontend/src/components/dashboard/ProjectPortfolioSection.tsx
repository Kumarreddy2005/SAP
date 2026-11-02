import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PracticalProjectDefinition, ProjectSubmission } from '@career-orchestrator/shared';
import { DEMO_PROJECTS } from '../../demo/demoProjects';
import { ArrowRightIcon, InfoIcon, EditIcon } from '../common/Icons';

interface ProjectPortfolioSectionProps {
  projects: PracticalProjectDefinition[];
  activeSubmissions: Record<string, ProjectSubmission>;
  onStartProject: (projectId: string) => Promise<void>;
  onSubmitDeliverables: (projectId: string) => void;
  onSimulateReview: (projectId: string) => Promise<void>;
}

export const ProjectPortfolioSection: React.FC<ProjectPortfolioSectionProps> = ({
  projects,
  activeSubmissions,
  onStartProject,
  onSubmitDeliverables,
  onSimulateReview
}) => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'ALL' | 'IN_PROGRESS' | 'SUBMITTED' | 'REVIEWED'>('ALL');

  // Use loaded projects or fallback to DEMO_PROJECTS
  const allProjects = projects.length > 0 ? projects : (DEMO_PROJECTS as unknown as PracticalProjectDefinition[]);

  const filteredProjects = allProjects.filter((p) => {
    const sub = activeSubmissions[p.id];
    const status = sub ? sub.status : 'NOT_STARTED';

    if (filter === 'IN_PROGRESS') return status === 'IN_PROGRESS';
    if (filter === 'SUBMITTED') return status === 'SUBMITTED';
    if (filter === 'REVIEWED') return status === 'REVIEWED' || status === 'COMPLETED';
    return true;
  });

  const reviewedCount = Object.values(activeSubmissions).filter(
    (s) => s.status === 'REVIEWED' || s.status === 'COMPLETED'
  ).length;

  return (
    <div
      id="projects"
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
              Practical Projects & Evidence Portfolio
            </h3>
            <span
              style={{
                fontSize: '0.75rem',
                backgroundColor: '#E8F5ED',
                color: '#107E3E',
                padding: '0.2rem 0.55rem',
                borderRadius: '12px',
                fontWeight: 700
              }}
            >
              {reviewedCount} Evaluated Submissions
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#5B6876', margin: '0.2rem 0 0' }}>
            Demonstrable enterprise deliverables scored against weighted rubric criteria.
          </p>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
          {[
            { id: 'ALL', label: `All (${allProjects.length})` },
            { id: 'IN_PROGRESS', label: 'In Progress' },
            { id: 'SUBMITTED', label: 'Submitted' },
            { id: 'REVIEWED', label: `Evaluated (${reviewedCount})` }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as typeof filter)}
              style={{
                padding: '0.3rem 0.65rem',
                borderRadius: '16px',
                fontSize: '0.75rem',
                fontWeight: 600,
                backgroundColor: filter === tab.id ? '#001A47' : '#F8FAFC',
                color: filter === tab.id ? '#FFFFFF' : '#5B6876',
                border: filter === tab.id ? '1px solid #001A47' : '1px solid #D9E1E8',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Visual Project Lifecycle Bar */}
      <div
        style={{
          backgroundColor: '#F8FAFC',
          border: '1px solid #E2E8F0',
          borderRadius: '8px',
          padding: '0.85rem 1.25rem',
          marginBottom: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '0.75rem'
        }}
      >
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#001A47', textTransform: 'uppercase' }}>
          Evidence Lifecycle:
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap', fontSize: '0.78rem' }}>
          <span style={{ fontWeight: 600, color: '#0A6ED1' }}>1. Build Solution</span>
          <span style={{ color: '#94A3B8' }}>➔</span>
          <span style={{ fontWeight: 600, color: '#E9730C' }}>2. Submit Artifacts</span>
          <span style={{ color: '#94A3B8' }}>➔</span>
          <span style={{ fontWeight: 600, color: '#633CA3' }}>3. Rubric Evaluation</span>
          <span style={{ color: '#94A3B8' }}>➔</span>
          <span style={{ fontWeight: 600, color: '#107E3E' }}>4. Showcase Portfolio</span>
        </div>
        <div style={{ fontSize: '0.72rem', color: '#64748B', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <InfoIcon size={12} color="#0A6ED1" />
          <span>Simulated Reviewer Mode Disclosed</span>
        </div>
      </div>

      {/* Grid of Projects */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '1.25rem'
        }}
      >
        {filteredProjects.map((project) => {
          const submission = activeSubmissions[project.id];
          const status = submission ? submission.status : 'NOT_STARTED';

          const statusBadgeMap: Record<string, { label: string; bg: string; color: string }> = {
            NOT_STARTED: { label: 'Not Started', bg: '#F1F5F9', color: '#64748B' },
            IN_PROGRESS: { label: 'In Progress', bg: '#EBF3FB', color: '#0A6ED1' },
            SUBMITTED: { label: 'Submitted (Awaiting Review)', bg: '#FEF3E8', color: '#E9730C' },
            REVIEWED: { label: 'Evaluated (Score Awarded)', bg: '#E8F5ED', color: '#107E3E' },
            COMPLETED: { label: 'Completed', bg: '#E8F5ED', color: '#107E3E' }
          };

          const sBadge = statusBadgeMap[status] || statusBadgeMap.NOT_STARTED;

          return (
            <div
              key={project.id}
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #E2E8F0',
                borderRadius: '8px',
                padding: '1.25rem',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                boxShadow: '0 1px 3px rgba(0, 26, 71, 0.04)',
                gap: '1rem'
              }}
            >
              <div>
                {/* Status & Difficulty */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      fontWeight: 700,
                      backgroundColor: sBadge.bg,
                      color: sBadge.color,
                      padding: '0.15rem 0.5rem',
                      borderRadius: '4px'
                    }}
                  >
                    {sBadge.label}
                  </span>

                  <span style={{ fontSize: '0.75rem', color: '#5B6876', fontWeight: 600 }}>
                    {project.difficulty} • ~{project.estimatedEffortHours} hrs
                  </span>
                </div>

                {/* Title & Description */}
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#001A47', margin: '0 0 0.4rem', lineHeight: 1.3 }}>
                  {project.title}
                </h4>

                <p style={{ fontSize: '0.8rem', color: '#5B6876', lineHeight: 1.45, margin: '0 0 0.75rem' }}>
                  {project.description.slice(0, 140)}...
                </p>

                {/* Target Competencies */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginBottom: '0.75rem' }}>
                  {project.targetSkills.map((s) => (
                    <span
                      key={s}
                      style={{
                        fontSize: '0.7rem',
                        backgroundColor: '#F1F5F9',
                        color: '#334155',
                        padding: '0.15rem 0.45rem',
                        borderRadius: '4px'
                      }}
                    >
                      {s}
                    </span>
                  ))}
                </div>

                {/* Rubric Score if evaluated */}
                {submission && (submission.status === 'REVIEWED' || submission.status === 'COMPLETED') && submission.overallScore !== undefined && (
                  <div
                    style={{
                      backgroundColor: '#E8F5ED',
                      border: '1px solid #B8E3C6',
                      borderRadius: '6px',
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.8rem',
                      color: '#107E3E',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <span>Overall Rubric Score: {submission.overallScore}/100</span>
                    <span style={{ fontSize: '0.72rem', fontWeight: 500, color: '#0F6932' }}>
                      [Simulated Evaluator Mode]
                    </span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div
                style={{
                  borderTop: '1px solid #EDF1F5',
                  paddingTop: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                {status === 'NOT_STARTED' && (
                  <button
                    onClick={() => onStartProject(project.id)}
                    style={{
                      flex: 1,
                      backgroundColor: '#0A6ED1',
                      color: '#FFFFFF',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      padding: '0.45rem 0.8rem',
                      borderRadius: '6px',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    Start Project Workspace
                  </button>
                )}

                {status === 'IN_PROGRESS' && (
                  <button
                    onClick={() => onSubmitDeliverables(project.id)}
                    style={{
                      flex: 1,
                      backgroundColor: '#E9730C',
                      color: '#FFFFFF',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      padding: '0.45rem 0.8rem',
                      borderRadius: '6px',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    Submit Deliverable Artifacts
                  </button>
                )}

                {status === 'SUBMITTED' && (
                  <button
                    onClick={() => onSimulateReview(project.id)}
                    style={{
                      flex: 1,
                      backgroundColor: '#633CA3',
                      color: '#FFFFFF',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      padding: '0.45rem 0.8rem',
                      borderRadius: '6px',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    Run Simulated Rubric Review
                  </button>
                )}

                {(status === 'REVIEWED' || status === 'COMPLETED') && (
                  <button
                    onClick={() => navigate('/projects')}
                    style={{
                      flex: 1,
                      backgroundColor: '#F8FAFC',
                      color: '#107E3E',
                      border: '1px solid #B8E3C6',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      padding: '0.45rem 0.8rem',
                      borderRadius: '6px',
                      cursor: 'pointer'
                    }}
                  >
                    View Evaluation Scorecard
                  </button>
                )}

                <button
                  onClick={() => navigate('/projects')}
                  title="Open in full projects workspace"
                  style={{
                    backgroundColor: '#F8FAFC',
                    color: '#5B6876',
                    border: '1px solid #D9E1E8',
                    padding: '0.45rem 0.65rem',
                    borderRadius: '6px',
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  <EditIcon size={14} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Explore Projects link */}
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
          Access full step-by-step guides, sample solution architectures & rubric evaluation tools
        </span>
        <button
          onClick={() => navigate('/projects')}
          style={{
            color: '#001A47',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Open Practical Projects Suite <ArrowRightIcon size={14} color="#001A47" />
        </button>
      </div>
    </div>
  );
};
