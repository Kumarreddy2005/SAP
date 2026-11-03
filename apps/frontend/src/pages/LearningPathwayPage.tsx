import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { ProgressBar } from '../components/common/ProgressBar';
import {
  CheckIcon,
  ExternalLinkIcon,
  ArrowLeftIcon,
  AwardIcon,
  InfoIcon
} from '../components/common/Icons';
import { useCareerContext } from '../context/CareerContext';
import { enterpriseTheme } from '../theme/tokens';

export const LearningPathwayPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    targetRole,
    currentProfileId,
    completedLearningIds,
    toggleLearningCompletion,
    currentPathway,
    generateLearningPathway,
    isLoadingPathway,
    sessionMode
  } = useCareerContext();

  useEffect(() => {
    if (targetRole && currentProfileId) {
      generateLearningPathway(targetRole.slug, currentProfileId);
    }
  }, [targetRole, currentProfileId, generateLearningPathway]);

  const milestones = currentPathway?.milestones || [];
  const completedCount = milestones.filter((m) => completedLearningIds.includes(m.milestoneId)).length;
  const totalHours = currentPathway?.totalEstimatedHours || targetRole.learningHoursEstimate;
  const progressPercentage = milestones.length > 0 ? (completedCount / milestones.length) * 100 : 0;

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
      <Breadcrumbs
        items={[
          { label: 'Gap Analysis', path: '/career-gap' },
          { label: 'Learning Pathway' }
        ]}
      />

      {/* Header with Overall Progress */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: `1px solid ${enterpriseTheme.colors.surfaceBorder}`,
          borderRadius: enterpriseTheme.radii.lg,
          padding: '2rem',
          boxShadow: enterpriseTheme.shadows.card,
          marginBottom: '2rem'
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.65rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <Badge variant={sessionMode === 'DEMO' ? 'info' : 'success'}>
                Stage 5 of 8
              </Badge>
              <Badge variant="info">Curated Curriculum</Badge>
              <Badge variant="purple">SAP Learning Hub & openSAP</Badge>
              <Badge variant={targetRole.ecosystem === 'SAP' ? 'info' : 'neutral'}>
                {targetRole.ecosystem === 'SAP' ? 'SAP Ecosystem' : 'Hybrid Enterprise'}
              </Badge>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: enterpriseTheme.colors.textPrimary, marginBottom: '0.5rem' }}>
              Personalized Learning Pathway
            </h1>
            <p style={{ color: enterpriseTheme.colors.textSecondary, fontSize: '0.96rem', maxWidth: '750px', lineHeight: 1.55 }}>
              Sequenced milestones dynamically generated to bridge your verified skill gaps for <strong>{targetRole.title}</strong> using authentic SAP Learning Journeys and enterprise courseware.
            </p>
          </div>

          <div
            style={{
              backgroundColor: enterpriseTheme.colors.canvas,
              border: `1px solid ${enterpriseTheme.colors.surfaceBorder}`,
              padding: '1.25rem 1.75rem',
              borderRadius: enterpriseTheme.radii.md,
              minWidth: '220px',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '2.2rem', fontWeight: 800, color: enterpriseTheme.colors.success }}>
              {completedCount} / {milestones.length || 4}
            </div>
            <div style={{ fontSize: '0.86rem', fontWeight: 700, color: enterpriseTheme.colors.textPrimary }}>
              Completed Milestones
            </div>
            <div style={{ fontSize: '0.78rem', color: enterpriseTheme.colors.textSecondary, marginTop: '0.2rem' }}>
              ~{totalHours} total planning hours
            </div>
          </div>
        </div>

        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: `1px solid ${enterpriseTheme.colors.surfaceBorder}` }}>
          <ProgressBar
            percentage={progressPercentage}
            label="Learning Journey Completion"
            sublabel={`${completedCount} of ${milestones.length || 4} milestones self-reported as completed in current session`}
            color={enterpriseTheme.colors.success}
            height={10}
          />
        </div>
      </div>

      {/* Sequencing Rationale Banner */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: `1px solid ${enterpriseTheme.colors.infoBorder}`,
          borderRadius: enterpriseTheme.radii.md,
          padding: '1.15rem 1.25rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.75rem',
          boxShadow: enterpriseTheme.shadows.card
        }}
      >
        <InfoIcon size={20} color={enterpriseTheme.colors.primary} />
        <div style={{ fontSize: '0.88rem', color: enterpriseTheme.colors.textPrimary, lineHeight: 1.5 }}>
          <strong>Sequencing Strategy:</strong> {currentPathway?.sequencingRationale || 'Milestones are ordered strictly by functional dependencies: foundational domain processes precede system customizing; core development precedes integration flows; essential gaps are addressed ahead of elective enhancements.'}
          <div style={{ marginTop: '0.35rem', color: enterpriseTheme.colors.textSecondary, fontSize: '0.8rem' }}>
            Note: All learning links direct to official, publicly verifiable SAP Learning Journeys and open documentation. Progress checkmarks are self-reported by the candidate for active session planning. Opening official course URLs provides curriculum access but does not automatically verify course completion without external SAP LMS credential integration.
          </div>
        </div>
      </div>

      {/* Ordered Milestones List */}
      {isLoadingPathway ? (
        <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#FFFFFF', borderRadius: '8px', border: `1px solid ${enterpriseTheme.colors.surfaceBorder}` }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 700, color: enterpriseTheme.colors.textPrimary, marginBottom: '0.5rem' }}>
            Generating Your Personalized Learning Pathway...
          </div>
          <p style={{ color: enterpriseTheme.colors.textSecondary, fontSize: '0.9rem' }}>
            Sequencing dependencies and mapping verified SAP curriculum to your profile gaps.
          </p>
        </div>
      ) : milestones.length === 0 ? (
        <Card title="No Specific Gaps Found">
          <div style={{ textAlign: 'center', padding: '2.5rem' }}>
            <AwardIcon size={44} color={enterpriseTheme.colors.success} />
            <h3 style={{ color: enterpriseTheme.colors.textPrimary, marginTop: '1rem', marginBottom: '0.5rem', fontWeight: 700 }}>
              Full Core Competency Coverage!
            </h3>
            <p style={{ color: enterpriseTheme.colors.textSecondary, maxWidth: '520px', margin: '0 auto 1.5rem', fontSize: '0.92rem' }}>
              Your confirmed competencies meet all published requirements for {targetRole.title}. We recommend undertaking the practical capstone project below to build portfolio evidence.
            </p>
            <Button variant="primary" onClick={() => navigate('/projects')}>
              Proceed to Practical Projects →
            </Button>
          </div>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
          {milestones.map((milestone, idx) => {
            const isComplete = completedLearningIds.includes(milestone.milestoneId);

            return (
              <Card
                key={milestone.milestoneId}
                style={{
                  borderColor: isComplete ? enterpriseTheme.colors.successBorder : enterpriseTheme.colors.surfaceBorder,
                  backgroundColor: isComplete ? enterpriseTheme.colors.successSubtle : '#FFFFFF'
                }}
              >
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', flex: '1 1 500px' }}>
                    {/* Step Number Circle */}
                    <div
                      style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '50%',
                        backgroundColor: isComplete ? enterpriseTheme.colors.success : enterpriseTheme.colors.primary,
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '1.1rem',
                        flexShrink: 0,
                        boxShadow: '0 2px 6px rgba(0, 26, 71, 0.12)'
                      }}
                    >
                      {isComplete ? '✓' : idx + 1}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                        <Badge variant={milestone.isEssential ? 'critical' : 'neutral'} size="sm">
                          {milestone.isEssential ? 'Essential Gap' : 'Elective Enhancement'}
                        </Badge>
                        <Badge variant="outline" size="sm">
                          ~{milestone.estimatedHours} Hours
                        </Badge>
                        {milestone.prerequisiteMilestoneIds.length > 0 && (
                          <Badge variant="purple" size="sm">
                            Requires Step {milestone.prerequisiteMilestoneIds.map((id) => id.split('-').pop()).join(', ')}
                          </Badge>
                        )}
                      </div>

                      <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: enterpriseTheme.colors.textPrimary, marginBottom: '0.35rem' }}>
                        {milestone.title}
                      </h3>

                      <p style={{ color: enterpriseTheme.colors.textSecondary, fontSize: '0.9rem', marginBottom: '1rem', lineHeight: 1.5 }}>
                        {milestone.objective}
                      </p>

                      {/* Verified Learning Resources List */}
                      {milestone.resources.length > 0 && (
                        <div style={{ marginBottom: '1.25rem' }}>
                          <span style={{ fontSize: '0.76rem', fontWeight: 700, color: enterpriseTheme.colors.textPrimary, textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                            Verified Course Curriculum:
                          </span>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {milestone.resources.map((res) => (
                              <div
                                key={res.id}
                                style={{
                                  padding: '0.75rem 1rem',
                                  backgroundColor: enterpriseTheme.colors.canvas,
                                  border: `1px solid ${enterpriseTheme.colors.surfaceBorder}`,
                                  borderRadius: '6px',
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  flexWrap: 'wrap',
                                  gap: '0.5rem'
                                }}
                              >
                                <div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <span style={{ fontWeight: 600, color: enterpriseTheme.colors.textPrimary, fontSize: '0.88rem' }}>
                                      [{res.code}] {res.title}
                                    </span>
                                    <Badge variant="success" size="sm">
                                      Verified Link
                                    </Badge>
                                  </div>
                                  <div style={{ fontSize: '0.78rem', color: enterpriseTheme.colors.textSecondary, marginTop: '0.2rem' }}>
                                    Provider: {res.provider} • Level: {res.level} • ~{res.estimatedHours} hrs
                                  </div>
                                </div>

                                <a
                                  href={res.externalUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.35rem',
                                    fontSize: '0.82rem',
                                    fontWeight: 600,
                                    color: enterpriseTheme.colors.primary,
                                    textDecoration: 'none',
                                    padding: '0.35rem 0.65rem',
                                    backgroundColor: '#FFFFFF',
                                    border: `1px solid ${enterpriseTheme.colors.primaryBorder}`,
                                    borderRadius: '4px'
                                  }}
                                >
                                  <span>Open Course Page</span>
                                  <ExternalLinkIcon size={13} />
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Mapped Practical Project Exercise */}
                      {milestone.practicalProject && (
                        <div
                          style={{
                            padding: '0.9rem 1rem',
                            backgroundColor: enterpriseTheme.colors.successSubtle,
                            border: `1px solid ${enterpriseTheme.colors.successBorder}`,
                            borderRadius: '6px',
                            marginBottom: '1rem'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                            <strong style={{ color: enterpriseTheme.colors.success, fontSize: '0.88rem' }}>
                              Mapped Hands-on Project: {milestone.practicalProject.title}
                            </strong>
                            <Badge variant="success" size="sm">
                              {milestone.practicalProject.estimatedEffortHours} hrs
                            </Badge>
                          </div>
                          <p style={{ color: enterpriseTheme.colors.successHover, fontSize: '0.82rem', marginBottom: '0.4rem', lineHeight: 1.4 }}>
                            {milestone.practicalProject.description}
                          </p>
                          <div style={{ fontSize: '0.78rem', color: enterpriseTheme.colors.textSecondary }}>
                            <strong>Deliverable:</strong> {milestone.practicalProject.deliverables[0]}
                          </div>
                        </div>
                      )}

                      {/* Completion Criteria */}
                      <div style={{ fontSize: '0.82rem', color: enterpriseTheme.colors.textSecondary, fontStyle: 'italic' }}>
                        <strong>Completion Criteria:</strong> {milestone.completionCriteria}
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Toggle Completion Action */}
                  <div style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => toggleLearningCompletion(milestone.milestoneId)}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        border: `1px solid ${isComplete ? enterpriseTheme.colors.successBorder : enterpriseTheme.colors.surfaceBorder}`,
                        backgroundColor: isComplete ? enterpriseTheme.colors.successSubtle : '#FFFFFF',
                        color: isComplete ? enterpriseTheme.colors.success : enterpriseTheme.colors.textPrimary,
                        fontWeight: 600,
                        fontSize: '0.85rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem',
                        transition: 'all 0.15s ease'
                      }}
                    >
                      {isComplete ? (
                        <>
                          <CheckIcon size={16} color={enterpriseTheme.colors.success} />
                          <span>Marked Complete</span>
                        </>
                      ) : (
                        <span>Mark Milestone Complete</span>
                      )}
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Navigation Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <Button variant="ghost" icon={<ArrowLeftIcon size={16} />} onClick={() => navigate('/career-gap')}>
          Back to Skill Gap Breakdown
        </Button>
        <Button
          variant="primary"
          size="lg"
          icon={<AwardIcon size={18} />}
          iconPosition="right"
          onClick={() => navigate('/projects')}
        >
          Proceed to Practical Projects & Evidence →
        </Button>
      </div>
    </div>
  );
};
