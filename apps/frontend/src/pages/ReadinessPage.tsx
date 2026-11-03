import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { ProgressBar } from '../components/common/ProgressBar';
import { AdvisoryNotice } from '../components/common/AdvisoryNotice';
import {
  ArrowLeftIcon,
  BriefcaseIcon,
  CheckIcon,
  AlertTriangleIcon
} from '../components/common/Icons';
import { useCareerContext } from '../context/CareerContext';
import { enterpriseTheme } from '../theme/tokens';

export const ReadinessPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    targetRole,
    currentProfileId,
    readinessScorecard,
    isLoadingReadiness,
    fetchReadinessScorecard,
    completedLearningIds,
    activeProjectSubmissions,
    isRealProfileReviewed,
    sessionMode
  } = useCareerContext();

  // Fetch or refresh readiness scorecard whenever role, completed learning, or project submissions change
  useEffect(() => {
    fetchReadinessScorecard(targetRole.slug, currentProfileId || undefined);
  }, [targetRole.slug, currentProfileId, completedLearningIds.length, Object.keys(activeProjectSubmissions).length, fetchReadinessScorecard]);

  const getDimensionStatusBadge = (status: 'STRONG' | 'IN_PROGRESS' | 'NEEDS_ATTENTION' | 'INSUFFICIENT_DATA') => {
    switch (status) {
      case 'STRONG':
        return <Badge variant="success">Strong Coverage</Badge>;
      case 'IN_PROGRESS':
        return <Badge variant="info">In Progress</Badge>;
      case 'NEEDS_ATTENTION':
        return <Badge variant="warning">Needs Attention</Badge>;
      case 'INSUFFICIENT_DATA':
      default:
        return <Badge variant="neutral">Insufficient Data</Badge>;
    }
  };

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
      <Breadcrumbs
        items={[
          { label: 'Projects', path: '/projects' },
          { label: 'Career Readiness Scorecard' }
        ]}
      />

      {/* Header */}
      <div style={{ marginBottom: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.65rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <Badge variant={sessionMode === 'DEMO' ? 'info' : 'success'}>
                Stage 7 of 8
              </Badge>
              <Badge variant={isRealProfileReviewed ? 'success' : 'warning'}>
                {isRealProfileReviewed ? 'Verified Candidate Profile' : 'Sample Demo Profile'}
              </Badge>
              <Badge variant="purple">Audited Readiness</Badge>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: enterpriseTheme.colors.textPrimary, marginBottom: '0.5rem' }}>
              Explainable Career Readiness Scorecard
            </h1>
            <p style={{ color: enterpriseTheme.colors.textSecondary, fontSize: '0.98rem', maxWidth: '800px', lineHeight: 1.55 }}>
              Multi-dimensional, audit-transparent evaluation for <strong>{targetRole.title}</strong> based on confirmed competencies, verified learning milestones, and applied portfolio evidence.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => fetchReadinessScorecard(targetRole.slug, currentProfileId || undefined)}
            disabled={isLoadingReadiness}
          >
            {isLoadingReadiness ? 'Recalculating...' : 'Refresh Scorecard'}
          </Button>
        </div>
      </div>

      {/* Statutory Advisory Notice */}
      <AdvisoryNotice
        style={{ marginBottom: '2rem' }}
        title="Official Readiness & Statutory Advisory Disclosure"
        message="Career readiness is an evidence-based progress assessment against this role's defined requirements. It is not a hiring probability, job guarantee or substitute for an employer's selection process."
      />

      {isLoadingReadiness && !readinessScorecard ? (
        <Card>
          <div style={{ padding: '3rem 1rem', textAlign: 'center', color: enterpriseTheme.colors.textSecondary }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: enterpriseTheme.colors.textPrimary, marginBottom: '0.5rem' }}>
              Calculating Explainable Readiness Scorecard...
            </div>
            <p>Aggregating skill overlap, mandatory prerequisites, curriculum progress, and verified portfolio submissions.</p>
          </div>
        </Card>
      ) : readinessScorecard ? (
        <>
          {/* Hero Score Card */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '2rem',
              marginBottom: '2rem'
            }}
          >
            {/* Main Gauge Card */}
            <Card
              title="Overall Transition Readiness"
              subtitle={`Auditable metric for ${readinessScorecard.roleTitle}`}
              action={
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                  <Badge variant={isRealProfileReviewed ? 'success' : 'warning'}>
                    {isRealProfileReviewed ? 'Verified Candidate Profile' : 'Sample Demo Profile'}
                  </Badge>
                  {readinessScorecard.isReadinessEligible ? (
                    <Badge variant="success">Eligible for Transition</Badge>
                  ) : (
                    <Badge variant="warning">Prerequisite Gaps Remaining</Badge>
                  )}
                </div>
              }
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', padding: '1rem 0' }}>
                <div
                  style={{
                    width: '128px',
                    height: '128px',
                    borderRadius: '50%',
                    border: `10px solid ${
                      readinessScorecard.overallReadinessScore >= 75
                        ? enterpriseTheme.colors.success
                        : readinessScorecard.overallReadinessScore >= 50
                        ? enterpriseTheme.colors.primary
                        : enterpriseTheme.colors.warning
                    }`,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    backgroundColor: enterpriseTheme.colors.canvas,
                    boxShadow: enterpriseTheme.shadows.card
                  }}
                >
                  <span style={{ fontSize: '2.4rem', fontWeight: 800, color: enterpriseTheme.colors.textPrimary, lineHeight: 1 }}>
                    {readinessScorecard.overallReadinessScore}%
                  </span>
                  <span style={{ fontSize: '0.72rem', color: enterpriseTheme.colors.textMuted, textTransform: 'uppercase', marginTop: '4px', fontWeight: 700 }}>
                    Readiness
                  </span>
                </div>

                <div style={{ fontSize: '0.92rem', color: enterpriseTheme.colors.textSecondary, lineHeight: 1.6 }}>
                  <p style={{ marginBottom: '0.75rem' }}>
                    {readinessScorecard.summaryText}
                  </p>
                  <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <Badge variant={readinessScorecard.isReadinessEligible ? 'success' : 'warning'}>
                      {readinessScorecard.isReadinessEligible
                        ? 'Core Mandatory Thresholds Met'
                        : `${readinessScorecard.outstandingMandatoryGaps.length} Mandatory Skills Missing`}
                    </Badge>
                    <Badge variant="neutral">
                      {readinessScorecard.projectEvidenceProgress.completedProjectsCount} Projects Verified
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>

            {/* Weighted Dimensional Breakdown */}
            <Card
              title="Readiness Dimensions (Weighted)"
              subtitle="Mathematical contribution to overall score"
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <ProgressBar
                    percentage={readinessScorecard.dimensions.skillCoverage.score}
                    label={`1. Skill Coverage (${readinessScorecard.dimensions.skillCoverage.weightPercentage}%)`}
                    sublabel={`Score: ${readinessScorecard.dimensions.skillCoverage.score}% • ${readinessScorecard.dimensions.skillCoverage.demonstratedDetails}`}
                    color={enterpriseTheme.colors.primary}
                  />
                </div>

                <div>
                  <ProgressBar
                    percentage={readinessScorecard.dimensions.mandatoryRequirements.score}
                    label={`2. Mandatory Role Requirements (${readinessScorecard.dimensions.mandatoryRequirements.weightPercentage}%)`}
                    sublabel={`Score: ${readinessScorecard.dimensions.mandatoryRequirements.score}% • ${readinessScorecard.dimensions.mandatoryRequirements.demonstratedDetails}`}
                    color={readinessScorecard.dimensions.mandatoryRequirements.score === 100 ? enterpriseTheme.colors.success : enterpriseTheme.colors.warning}
                  />
                </div>

                <div>
                  <ProgressBar
                    percentage={readinessScorecard.dimensions.learningMilestones.score}
                    label={`3. Structured Learning Curriculum (${readinessScorecard.dimensions.learningMilestones.weightPercentage}%)`}
                    sublabel={`Score: ${readinessScorecard.dimensions.learningMilestones.score}% • ${readinessScorecard.learningMilestoneProgress.completedCount} of ${readinessScorecard.learningMilestoneProgress.totalCount} milestones completed`}
                    color={enterpriseTheme.colors.accentPurple}
                  />
                </div>

                <div>
                  <ProgressBar
                    percentage={readinessScorecard.dimensions.projectEvidence.score}
                    label={`4. Applied Practical Projects (${readinessScorecard.dimensions.projectEvidence.weightPercentage}%)`}
                    sublabel={`Score: ${readinessScorecard.dimensions.projectEvidence.score}% • ${readinessScorecard.projectEvidenceProgress.completedProjectsCount} completed, ${readinessScorecard.projectEvidenceProgress.submissionsAwaitingReviewCount} awaiting review`}
                    color={enterpriseTheme.colors.success}
                  />
                </div>
              </div>
            </Card>
          </div>

          {/* Prominent Mandatory Gaps Alert Banner */}
          {readinessScorecard.outstandingMandatoryGaps.length > 0 ? (
            <div
              style={{
                backgroundColor: enterpriseTheme.colors.warningSubtle,
                border: `1.5px solid ${enterpriseTheme.colors.warningBorder}`,
                borderRadius: enterpriseTheme.radii.md,
                padding: '1.25rem 1.5rem',
                marginBottom: '2rem',
                boxShadow: enterpriseTheme.shadows.card
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ color: enterpriseTheme.colors.warning, marginTop: '2px' }}>
                  <AlertTriangleIcon size={24} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                    <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: enterpriseTheme.colors.warning, margin: 0 }}>
                      Mandatory Core Competencies Missing ({readinessScorecard.outstandingMandatoryGaps.length})
                    </h3>
                    <Badge variant="warning">Action Required</Badge>
                  </div>
                  <p style={{ color: enterpriseTheme.colors.textSecondary, fontSize: '0.9rem', marginBottom: '0.75rem', lineHeight: 1.5 }}>
                    These competencies are foundational for <strong>{readinessScorecard.roleTitle}</strong> and must be evidenced before achieving transition readiness eligibility:
                  </p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    {readinessScorecard.outstandingMandatoryGaps.map((gap) => (
                      <span
                        key={gap}
                        style={{
                          backgroundColor: '#FFFFFF',
                          border: `1px solid ${enterpriseTheme.colors.warningBorder}`,
                          color: enterpriseTheme.colors.warning,
                          padding: '0.25rem 0.65rem',
                          borderRadius: '4px',
                          fontSize: '0.85rem',
                          fontWeight: 600,
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '0.35rem'
                        }}
                      >
                        <AlertTriangleIcon size={13} color={enterpriseTheme.colors.warning} />
                        {gap}
                      </span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                    <Button size="sm" variant="outline" onClick={() => navigate('/learning')}>
                      Address in Learning Pathway →
                    </Button>
                    <Button size="sm" variant="ghost" onClick={() => navigate('/projects')}>
                      Submit Project Evidence →
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div
              style={{
                backgroundColor: enterpriseTheme.colors.successSubtle,
                border: `1.5px solid ${enterpriseTheme.colors.successBorder}`,
                borderRadius: enterpriseTheme.radii.md,
                padding: '1rem 1.5rem',
                marginBottom: '2rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem'
              }}
            >
              <div style={{ color: enterpriseTheme.colors.success }}>
                <CheckIcon size={24} />
              </div>
              <div style={{ flex: 1 }}>
                <strong style={{ color: enterpriseTheme.colors.success, fontSize: '0.95rem' }}>
                  All Mandatory Requirements Satisfied!
                </strong>
                <p style={{ color: enterpriseTheme.colors.successHover, fontSize: '0.88rem', margin: '2px 0 0' }}>
                  You have confirmed baseline evidence for every core prerequisite for this role.
                </p>
              </div>
            </div>
          )}

          {/* 4 In-Depth Dimensional Review Cards */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', color: enterpriseTheme.colors.textPrimary, fontWeight: 700, marginBottom: '1.25rem' }}>
              Detailed Dimensional Audit
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {/* Card 1: Skill Coverage */}
              <Card
                title="1. Skill Coverage"
                subtitle={`Weight: 35% • Score: ${readinessScorecard.dimensions.skillCoverage.score}%`}
                action={getDimensionStatusBadge(readinessScorecard.dimensions.skillCoverage.status)}
              >
                <div style={{ fontSize: '0.88rem', color: enterpriseTheme.colors.textSecondary, lineHeight: 1.6 }}>
                  <div style={{ marginBottom: '0.75rem' }}>
                    <strong style={{ color: enterpriseTheme.colors.textPrimary, display: 'block', marginBottom: '0.25rem' }}>
                      Demonstrated:
                    </strong>
                    {readinessScorecard.dimensions.skillCoverage.demonstratedDetails}
                  </div>
                  <div>
                    <strong style={{ color: enterpriseTheme.colors.textPrimary, display: 'block', marginBottom: '0.25rem' }}>
                      Coverage Gap:
                    </strong>
                    {readinessScorecard.dimensions.skillCoverage.gapDetails}
                  </div>
                </div>
              </Card>

              {/* Card 2: Mandatory Requirements */}
              <Card
                title="2. Mandatory Core Skills"
                subtitle={`Weight: 35% • Score: ${readinessScorecard.dimensions.mandatoryRequirements.score}%`}
                action={getDimensionStatusBadge(readinessScorecard.dimensions.mandatoryRequirements.status)}
              >
                <div style={{ fontSize: '0.88rem', color: enterpriseTheme.colors.textSecondary, lineHeight: 1.6 }}>
                  <div style={{ marginBottom: '0.75rem' }}>
                    <strong style={{ color: enterpriseTheme.colors.textPrimary, display: 'block', marginBottom: '0.25rem' }}>
                      Confirmed Mandatory:
                    </strong>
                    {readinessScorecard.confirmedMandatorySkills.length > 0 ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.25rem' }}>
                        {readinessScorecard.confirmedMandatorySkills.map((s) => (
                          <span
                            key={s}
                            style={{
                              backgroundColor: enterpriseTheme.colors.successSubtle,
                              border: `1px solid ${enterpriseTheme.colors.successBorder}`,
                              color: enterpriseTheme.colors.success,
                              fontSize: '0.78rem',
                              padding: '0.15rem 0.5rem',
                              borderRadius: '4px'
                            }}
                          >
                            ✓ {s}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span style={{ color: enterpriseTheme.colors.textMuted }}>None verified yet</span>
                    )}
                  </div>
                  <div>
                    <strong style={{ color: enterpriseTheme.colors.textPrimary, display: 'block', marginBottom: '0.25rem' }}>
                      Remaining Mandatory:
                    </strong>
                    {readinessScorecard.outstandingMandatoryGaps.length > 0 ? (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem', marginTop: '0.25rem' }}>
                        {readinessScorecard.outstandingMandatoryGaps.map((s) => (
                          <span
                            key={s}
                            style={{
                              backgroundColor: enterpriseTheme.colors.warningSubtle,
                              border: `1px solid ${enterpriseTheme.colors.warningBorder}`,
                              color: enterpriseTheme.colors.warning,
                              fontSize: '0.78rem',
                              padding: '0.15rem 0.5rem',
                              borderRadius: '4px'
                            }}
                          >
                            ! {s}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <span style={{ color: enterpriseTheme.colors.success }}>All mandatory confirmed</span>
                    )}
                  </div>
                </div>
              </Card>

              {/* Card 3: Learning Milestones */}
              <Card
                title="3. Curriculum Milestones (Self-Reported)"
                subtitle={`Weight: 15% • Score: ${readinessScorecard.dimensions.learningMilestones.score}%`}
                action={getDimensionStatusBadge(readinessScorecard.dimensions.learningMilestones.status)}
              >
                <div style={{ fontSize: '0.88rem', color: enterpriseTheme.colors.textSecondary, lineHeight: 1.6 }}>
                  <div style={{ marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <strong style={{ color: enterpriseTheme.colors.textPrimary }}>Milestone Progress</strong>
                      <span>
                        {readinessScorecard.learningMilestoneProgress.completedCount} /{' '}
                        {readinessScorecard.learningMilestoneProgress.totalCount} ({readinessScorecard.learningMilestoneProgress.completionPercentage}%)
                      </span>
                    </div>
                    <ProgressBar
                      percentage={readinessScorecard.learningMilestoneProgress.completionPercentage}
                      color={enterpriseTheme.colors.accentPurple}
                    />
                  </div>
                  <div style={{ marginTop: '0.5rem' }}>
                    <span style={{ color: enterpriseTheme.colors.textMuted, fontSize: '0.8rem' }}>
                      {readinessScorecard.learningMilestoneProgress.remainingMilestoneTitles.length} modules remaining. Progress is self-reported by candidate; external LMS verification is not connected.
                    </span>
                  </div>
                  <div style={{ marginTop: '0.75rem' }}>
                    <Button size="sm" variant="outline" fullWidth onClick={() => navigate('/learning')}>
                      Open Learning Pathway
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Card 4: Practical Applied Projects */}
              <Card
                title="4. Practical Portfolio"
                subtitle={`Weight: 15% • Score: ${readinessScorecard.dimensions.projectEvidence.score}%`}
                action={getDimensionStatusBadge(readinessScorecard.dimensions.projectEvidence.status)}
              >
                <div style={{ fontSize: '0.88rem', color: enterpriseTheme.colors.textSecondary, lineHeight: 1.6 }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    <div style={{ backgroundColor: enterpriseTheme.colors.canvas, padding: '0.5rem', borderRadius: '4px', textAlign: 'center', border: `1px solid ${enterpriseTheme.colors.surfaceBorder}` }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: 700, color: enterpriseTheme.colors.success }}>
                        {readinessScorecard.projectEvidenceProgress.completedProjectsCount}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: enterpriseTheme.colors.textMuted }}>Completed / Approved</div>
                    </div>
                    <div style={{ backgroundColor: enterpriseTheme.colors.canvas, padding: '0.5rem', borderRadius: '4px', textAlign: 'center', border: `1px solid ${enterpriseTheme.colors.surfaceBorder}` }}>
                      <div style={{ fontSize: '1.2rem', fontWeight: 700, color: enterpriseTheme.colors.primary }}>
                        {readinessScorecard.projectEvidenceProgress.submittedCount}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: enterpriseTheme.colors.textMuted }}>Total Submitted</div>
                    </div>
                  </div>
                  <div style={{ color: enterpriseTheme.colors.textMuted, fontSize: '0.8rem', marginBottom: '0.75rem' }}>
                    {readinessScorecard.projectEvidenceProgress.submissionsAwaitingReviewCount > 0
                      ? `${readinessScorecard.projectEvidenceProgress.submissionsAwaitingReviewCount} deliverables currently awaiting rubric evaluation.`
                      : 'All submissions have completed rubric review.'}
                  </div>
                  <Button size="sm" variant="outline" fullWidth onClick={() => navigate('/projects')}>
                    Open Project Workspaces
                  </Button>
                </div>
              </Card>
            </div>
          </div>

          {/* Actionable Next Recommended Steps */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', color: enterpriseTheme.colors.textPrimary, fontWeight: 700, marginBottom: '1.25rem' }}>
              Actionable Next Steps
            </h2>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
              {readinessScorecard.nextRecommendedActions.map((action, idx) => (
                <div
                  key={idx}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: `1px solid ${enterpriseTheme.colors.surfaceBorder}`,
                    borderRadius: enterpriseTheme.radii.md,
                    padding: '1.25rem',
                    display: 'flex',
                    alignItems: 'flex-start',
                    gap: '1rem',
                    boxShadow: enterpriseTheme.shadows.card
                  }}
                >
                  <div
                    style={{
                      width: '28px',
                      height: '28px',
                      borderRadius: '50%',
                      backgroundColor: enterpriseTheme.colors.primarySubtle,
                      color: enterpriseTheme.colors.primary,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      flexShrink: 0
                    }}
                  >
                    {idx + 1}
                  </div>
                  <div style={{ flex: 1, fontSize: '0.9rem', color: enterpriseTheme.colors.textPrimary, lineHeight: 1.5 }}>
                    {action}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Explainable Scoring Formula Card */}
          <Card
            title="Explainable Formula Breakdown"
            subtitle="Transparent, open architecture — zero black-box scoring"
            style={{ marginBottom: '2.5rem' }}
          >
            <div style={{ fontSize: '0.9rem', color: enterpriseTheme.colors.textSecondary, lineHeight: 1.6 }}>
              <div
                style={{
                  backgroundColor: enterpriseTheme.colors.canvas,
                  border: `1px solid ${enterpriseTheme.colors.surfaceBorder}`,
                  padding: '1rem 1.5rem',
                  borderRadius: '6px',
                  fontFamily: 'monospace',
                  fontSize: '0.92rem',
                  color: enterpriseTheme.colors.textPrimary,
                  marginBottom: '1rem'
                }}
              >
                Readiness Score = (0.35 × Skill Coverage) + (0.35 × Mandatory Requirements) + (0.15 × Learning Milestones) + (0.15 × Practical Projects)
              </div>
              <p>
                Every metric is directly derived from concrete candidate actions: human-reviewed skill extractions, curriculum module completions on the Learning Pathway, and rubric-evaluated enterprise project deliverables.
              </p>
            </div>
          </Card>
        </>
      ) : null}

      {/* Bottom Navigation Actions */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: `1px solid ${enterpriseTheme.colors.surfaceBorder}`,
          borderRadius: enterpriseTheme.radii.md,
          padding: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          boxShadow: enterpriseTheme.shadows.card
        }}
      >
        <Button variant="ghost" icon={<ArrowLeftIcon size={16} />} onClick={() => navigate('/projects')}>
          Back to Practical Projects
        </Button>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.88rem', color: enterpriseTheme.colors.textSecondary }}>
            Ready to explore verified external market opportunities?
          </span>
          <Button
            variant="primary"
            size="lg"
            icon={<BriefcaseIcon size={18} />}
            iconPosition="right"
            onClick={() => navigate('/jobs')}
          >
            Explore Real Job Opportunities →
          </Button>
        </div>
      </div>
    </div>
  );
};
