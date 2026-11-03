import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { CloseIcon, ArrowRightIcon, PlusIcon, CheckIcon, AlertTriangleIcon } from '../components/common/Icons';
import { DEMO_CAREER_ROLES } from '../demo/demoCareers';
import { useCareerContext } from '../context/CareerContext';
import { enterpriseTheme } from '../theme/tokens';

export const CareerComparisonPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentProfileId,
    comparisonRoleSlugs,
    toggleComparisonRole,
    setTargetRoleSlug,
    skills,
    isRealProfileReviewed,
    calculateRoleMatch,
    comparisonResult,
    fetchComparison
  } = useCareerContext();

  const comparedRoles = DEMO_CAREER_ROLES.filter((r) =>
    comparisonRoleSlugs.includes(r.slug)
  );

  const availableToAdd = DEMO_CAREER_ROLES.filter(
    (r) => !comparisonRoleSlugs.includes(r.slug)
  );

  // Fetch real comparison matrix from backend on mount or when slugs change
  useEffect(() => {
    if (comparisonRoleSlugs.length > 0) {
      fetchComparison(comparisonRoleSlugs, currentProfileId || undefined);
    }
  }, [comparisonRoleSlugs, currentProfileId, fetchComparison]);

  const confirmedSkillNames = skills
    .filter((s) => s.isConfirmed && s.reviewStatus === 'CONFIRMED')
    .map((s) => s.name.toLowerCase());

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
      <Breadcrumbs
        items={[
          { label: 'Careers', path: '/careers' },
          { label: 'Comparison Matrix' }
        ]}
      />

      {/* Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '1rem',
          marginBottom: '1.75rem'
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: enterpriseTheme.colors.textPrimary, marginBottom: '0.4rem' }}>
            Multi-Role Comparison Matrix
          </h1>
          <p style={{ color: enterpriseTheme.colors.textSecondary, fontSize: '0.98rem', maxWidth: '820px', lineHeight: 1.5 }}>
            Compare candidate career pathways side-by-side. Analyze transferable competency overlaps, critical gap deltas, and estimated bridge efforts before committing.
          </p>
        </div>

        <Button variant="outline" onClick={() => navigate('/careers')}>
          Back to Catalogue
        </Button>
      </div>

      {/* Profile Status Banner */}
      {isRealProfileReviewed ? (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: `1px solid ${enterpriseTheme.colors.successBorder}`,
            borderRadius: enterpriseTheme.radii.md,
            padding: '0.85rem 1.25rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.5rem',
            boxShadow: enterpriseTheme.shadows.card
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <CheckIcon size={18} color={enterpriseTheme.colors.success} />
            <span style={{ fontSize: '0.88rem', color: enterpriseTheme.colors.success, fontWeight: 700 }}>
              Comparing Against Your Verified Profile Competencies
            </span>
          </div>
          <Badge variant="success" size="sm">Verified Candidate Profile</Badge>
        </div>
      ) : (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: `1px solid ${enterpriseTheme.colors.warningBorder}`,
            borderRadius: enterpriseTheme.radii.md,
            padding: '0.85rem 1.25rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '0.5rem',
            boxShadow: enterpriseTheme.shadows.card
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <span style={{ fontSize: '0.88rem', color: enterpriseTheme.colors.warning, fontWeight: 700 }}>
              Sample Demo Comparison Mode (Alex Vance baseline)
            </span>
          </div>
          <Badge variant="warning" size="sm">Sample Demo Profile</Badge>
        </div>
      )}

      {/* Shared Transferable Skills Banner */}
      {comparisonResult && comparisonResult.sharedTransferableSkills.length > 0 && (
        <div
          style={{
            backgroundColor: enterpriseTheme.colors.successSubtle,
            border: `1px solid ${enterpriseTheme.colors.successBorder}`,
            borderRadius: enterpriseTheme.radii.md,
            padding: '1rem 1.25rem',
            marginBottom: '1.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}
        >
          <CheckIcon size={20} color={enterpriseTheme.colors.success} />
          <div style={{ fontSize: '0.88rem', color: enterpriseTheme.colors.textPrimary, lineHeight: 1.4 }}>
            <strong>Universal Transferable Assets:</strong> You have confirmed competencies that apply across all compared roles:{' '}
            <strong>{comparisonResult.sharedTransferableSkills.join(', ')}</strong>.
          </div>
        </div>
      )}

      {comparedRoles.length === 0 ? (
        <Card title="No Careers Currently Selected">
          <div style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
            <p style={{ color: enterpriseTheme.colors.textSecondary, marginBottom: '1.5rem', fontSize: '0.92rem' }}>
              Select 2 to 4 career pathways from the catalogue to compare requirements side-by-side.
            </p>
            <Button variant="primary" onClick={() => navigate('/careers')}>
              Browse Career Catalogue →
            </Button>
          </div>
        </Card>
      ) : (
        <div>
          {/* Comparison Grid with Horizontal Overflow Support */}
          <div style={{ overflowX: 'auto', paddingBottom: '1rem', marginBottom: '2rem' }}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: `repeat(${comparedRoles.length}, minmax(300px, 1fr))`,
                gap: '1.5rem',
                minWidth: comparedRoles.length > 2 ? `${comparedRoles.length * 310}px` : 'auto'
              }}
            >
              {comparedRoles.map((role) => {
                const matchResult = calculateRoleMatch(role);
                const backendMatch = comparisonResult?.roles.find((r) => r.roleSlug === role.slug);
                const score = isRealProfileReviewed ? matchResult.percentage : role.matchScoreDemo;

                // Overlap calculation
                const matchedRequirements = role.requiredSkills.filter((req) =>
                  confirmedSkillNames.some(
                    (cs) => cs.includes(req.skillName.toLowerCase()) || req.skillName.toLowerCase().includes(cs)
                  )
                );
                const missingRequirements = role.requiredSkills.filter(
                  (req) => !matchedRequirements.some((m) => m.skillId === req.skillId)
                );

                const mandatoryGaps = missingRequirements.filter((r) => r.isMandatory);
                const preferredGaps = missingRequirements.filter((r) => !r.isMandatory);

                return (
                  <div
                    key={role.id}
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: `1px solid ${enterpriseTheme.colors.surfaceBorder}`,
                      borderRadius: enterpriseTheme.radii.md,
                      boxShadow: enterpriseTheme.shadows.card,
                      display: 'flex',
                      flexDirection: 'column',
                      overflow: 'hidden'
                    }}
                  >
                    {/* Card Header with Remove Button */}
                    <div
                      style={{
                        padding: '1.25rem',
                        borderBottom: `1px solid ${enterpriseTheme.colors.surfaceBorder}`,
                        position: 'relative',
                        backgroundColor: '#FAFCFE'
                      }}
                    >
                      <button
                        onClick={() => toggleComparisonRole(role.slug)}
                        title="Remove from comparison"
                        style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          color: enterpriseTheme.colors.textMuted,
                          backgroundColor: 'transparent',
                          border: 'none',
                          cursor: 'pointer',
                          padding: '4px'
                        }}
                      >
                        <CloseIcon size={16} />
                      </button>

                      <Badge
                        variant={role.ecosystem === 'SAP' ? 'info' : role.ecosystem === 'HYBRID' ? 'purple' : 'neutral'}
                        size="sm"
                        style={{ marginBottom: '0.4rem' }}
                      >
                        {role.careerFamily.replace(/_/g, ' ')}
                      </Badge>

                      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: enterpriseTheme.colors.textPrimary, paddingRight: '24px' }}>
                        {role.title}
                      </h3>

                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.75rem' }}>
                        <span
                          style={{
                            fontSize: '1.8rem',
                            fontWeight: 800,
                            color: score >= 70 ? enterpriseTheme.colors.success : score >= 50 ? enterpriseTheme.colors.primary : enterpriseTheme.colors.warning
                          }}
                        >
                          {score}%
                        </span>
                        <span style={{ fontSize: '0.78rem', color: enterpriseTheme.colors.textSecondary, textTransform: 'uppercase', fontWeight: 600 }}>
                          {isRealProfileReviewed ? 'Candidate Match' : 'Demo Overlap'}
                        </span>
                      </div>
                    </div>

                    {/* Body Content */}
                    <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1 }}>
                      {/* Key Attributes */}
                      <div>
                        <div style={{ fontSize: '0.76rem', fontWeight: 700, color: enterpriseTheme.colors.textMuted, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                          Core Attributes
                        </div>
                        <div style={{ fontSize: '0.84rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: enterpriseTheme.colors.textSecondary }}>Market Demand:</span>
                            <Badge variant={role.marketDemand === 'Critical' ? 'critical' : 'warning'} size="sm">
                              {role.marketDemand}
                            </Badge>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: enterpriseTheme.colors.textSecondary }}>Est. Transition:</span>
                            <strong style={{ color: enterpriseTheme.colors.textPrimary }}>{role.typicalPivotTimeline}</strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: enterpriseTheme.colors.textSecondary }}>Planning Effort:</span>
                            <strong style={{ color: enterpriseTheme.colors.primary }}>~{role.learningHoursEstimate} hrs</strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: enterpriseTheme.colors.textSecondary }}>Compensation:</span>
                            <strong style={{ color: enterpriseTheme.colors.success }}>{role.averageSalaryUsd}</strong>
                          </div>
                        </div>
                      </div>

                      {/* Transferable Strengths */}
                      <div>
                        <div style={{ fontSize: '0.76rem', fontWeight: 700, color: enterpriseTheme.colors.success, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                          Transferable Strengths ({matchedRequirements.length})
                        </div>
                        {matchedRequirements.length > 0 ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                            {matchedRequirements.map((req) => (
                              <div
                                key={req.skillId}
                                style={{
                                  fontSize: '0.82rem',
                                  padding: '0.35rem 0.6rem',
                                  backgroundColor: enterpriseTheme.colors.successSubtle,
                                  border: `1px solid ${enterpriseTheme.colors.successBorder}`,
                                  borderRadius: '4px',
                                  color: enterpriseTheme.colors.textPrimary,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.35rem'
                                }}
                              >
                                <CheckIcon size={13} color={enterpriseTheme.colors.success} />
                                <span>{req.skillName}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.82rem', color: enterpriseTheme.colors.textMuted }}>No confirmed matches yet.</span>
                        )}
                      </div>

                      {/* Critical Mandatory Gaps */}
                      <div>
                        <div style={{ fontSize: '0.76rem', fontWeight: 700, color: enterpriseTheme.colors.critical, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                          Mandatory Skill Gaps ({mandatoryGaps.length})
                        </div>
                        {mandatoryGaps.length > 0 ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                            {mandatoryGaps.map((req) => (
                              <div
                                key={req.skillId}
                                style={{
                                  fontSize: '0.82rem',
                                  padding: '0.35rem 0.6rem',
                                  backgroundColor: enterpriseTheme.colors.criticalSubtle,
                                  border: `1px solid ${enterpriseTheme.colors.criticalBorder}`,
                                  borderRadius: '4px',
                                  color: enterpriseTheme.colors.critical,
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.35rem'
                                }}
                              >
                                <AlertTriangleIcon size={13} color={enterpriseTheme.colors.critical} />
                                <span>{req.skillName} (Req: {req.minimumLevel})</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div style={{ fontSize: '0.82rem', color: enterpriseTheme.colors.success, fontWeight: 700 }}>
                            All mandatory competencies verified!
                          </div>
                        )}
                      </div>

                      {/* Preferred Gaps */}
                      {preferredGaps.length > 0 && (
                        <div>
                          <div style={{ fontSize: '0.76rem', fontWeight: 700, color: enterpriseTheme.colors.warning, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                            Preferred Electives ({preferredGaps.length})
                          </div>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                            {preferredGaps.map((req) => (
                              <Badge key={req.skillId} variant="outline" size="sm">
                                {req.skillName}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Prerequisite Warnings */}
                      {backendMatch && backendMatch.prerequisiteWarnings.length > 0 && (
                        <div style={{ padding: '0.6rem', backgroundColor: enterpriseTheme.colors.warningSubtle, border: `1px solid ${enterpriseTheme.colors.warningBorder}`, borderRadius: '4px', fontSize: '0.78rem', color: enterpriseTheme.colors.warning }}>
                          <strong>Prerequisite Notice:</strong> {backendMatch.prerequisiteWarnings[0]}
                        </div>
                      )}
                    </div>

                    {/* Card Footer */}
                    <div style={{ padding: '1.25rem', borderTop: `1px solid ${enterpriseTheme.colors.surfaceBorder}`, backgroundColor: enterpriseTheme.colors.canvas }}>
                      <Button
                        variant="primary"
                        size="md"
                        style={{ width: '100%' }}
                        icon={<ArrowRightIcon size={16} />}
                        iconPosition="right"
                        onClick={() => {
                          setTargetRoleSlug(role.slug);
                          navigate('/career-gap');
                        }}
                      >
                        Commit to Target Career
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Add More Roles Drawer */}
          {availableToAdd.length > 0 && comparedRoles.length < 4 && (
            <Card title="Add Another Role to Matrix" subtitle={`You can add ${4 - comparedRoles.length} more role(s)`}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {availableToAdd.map((role) => (
                  <button
                    key={role.id}
                    onClick={() => toggleComparisonRole(role.slug)}
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.4rem 0.8rem',
                      backgroundColor: '#FFFFFF',
                      border: `1px solid ${enterpriseTheme.colors.surfaceBorder}`,
                      borderRadius: '6px',
                      fontSize: '0.84rem',
                      fontWeight: 600,
                      color: enterpriseTheme.colors.textPrimary,
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <PlusIcon size={14} color={enterpriseTheme.colors.primary} />
                    <span>{role.title}</span>
                  </button>
                ))}
              </div>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};
