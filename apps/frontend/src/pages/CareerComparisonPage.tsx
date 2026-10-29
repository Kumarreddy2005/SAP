import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { StepIndicator } from '../components/common/StepIndicator';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { CloseIcon, ArrowRightIcon, PlusIcon, CheckIcon, AlertTriangleIcon } from '../components/common/Icons';
import { DEMO_CAREER_ROLES } from '../demo/demoCareers';
import { useCareerContext } from '../context/CareerContext';

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
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1280px', margin: '0 auto' }}>
      <Breadcrumbs
        items={[
          { label: 'Careers', path: '/careers' },
          { label: 'Comparison Matrix' }
        ]}
      />
      <StepIndicator currentStepId="compare" />

      {/* Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}
      >
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#001A47', marginBottom: '0.5rem' }}>
            Multi-Role Comparison Matrix
          </h1>
          <p style={{ color: '#5B6876', fontSize: '1.05rem', maxWidth: '800px' }}>
            Compare candidate career pathways side-by-side. Analyze transferable competency overlaps, critical gap deltas, and estimated bridge efforts before committing.
          </p>
        </div>

        <Button variant="outline" onClick={() => navigate('/careers')}>
          Back to Catalogue
        </Button>
      </div>

      {/* Shared Transferable Skills Banner */}
      {comparisonResult && comparisonResult.sharedTransferableSkills.length > 0 && (
        <div
          style={{
            backgroundColor: '#F3FAF6',
            border: '1px solid #B8E3C8',
            borderRadius: '8px',
            padding: '1rem 1.25rem',
            marginBottom: '1.75rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem'
          }}
        >
          <CheckIcon size={22} color="#107E3E" />
          <div style={{ fontSize: '0.9rem', color: '#001A47' }}>
            <strong>Universal Transferable Assets:</strong> You have confirmed competencies that apply across all compared roles:{' '}
            <strong>{comparisonResult.sharedTransferableSkills.join(', ')}</strong>.
          </div>
        </div>
      )}

      {comparedRoles.length === 0 ? (
        <Card title="No Careers Currently Selected">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ color: '#5B6876', marginBottom: '1.5rem' }}>
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
                      border: '1px solid #D9E1E8',
                      borderRadius: '8px',
                      boxShadow: '0 2px 8px rgba(0, 26, 71, 0.05)',
                      display: 'flex',
                      flexDirection: 'column'
                    }}
                  >
                    {/* Card Header with Remove Button */}
                    <div
                      style={{
                        padding: '1.25rem',
                        borderBottom: '1px solid #EDF1F5',
                        position: 'relative'
                      }}
                    >
                      <button
                        onClick={() => toggleComparisonRole(role.slug)}
                        title="Remove from comparison"
                        style={{
                          position: 'absolute',
                          top: '12px',
                          right: '12px',
                          color: '#8492A0',
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

                      <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#001A47', paddingRight: '24px' }}>
                        {role.title}
                      </h3>

                      <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.75rem' }}>
                        <span
                          style={{
                            fontSize: '1.8rem',
                            fontWeight: 800,
                            color: score >= 70 ? '#107E3E' : score >= 50 ? '#0A6ED1' : '#E9730C'
                          }}
                        >
                          {score}%
                        </span>
                        <span style={{ fontSize: '0.8rem', color: '#5B6876', textTransform: 'uppercase' }}>
                          {isRealProfileReviewed ? 'Candidate Match' : 'Demo Overlap'}
                        </span>
                      </div>
                    </div>

                    {/* Body Content */}
                    <div style={{ padding: '1.25rem', display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1 }}>
                      {/* Key Attributes */}
                      <div>
                        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#8492A0', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                          Core Attributes
                        </div>
                        <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#5B6876' }}>Market Demand:</span>
                            <Badge variant={role.marketDemand === 'Critical' ? 'critical' : 'warning'} size="sm">
                              {role.marketDemand}
                            </Badge>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#5B6876' }}>Est. Transition:</span>
                            <strong style={{ color: '#001A47' }}>{role.typicalPivotTimeline}</strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#5B6876' }}>Planning Bridge Effort:</span>
                            <strong style={{ color: '#0A6ED1' }}>~{role.learningHoursEstimate} hrs</strong>
                          </div>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ color: '#5B6876' }}>Market Compensation:</span>
                            <strong style={{ color: '#107E3E' }}>{role.averageSalaryUsd}</strong>
                          </div>
                        </div>
                      </div>

                      {/* Transferable Strengths */}
                      <div>
                        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#107E3E', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
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
                                  backgroundColor: '#F3FAF6',
                                  border: '1px solid #B8E3C8',
                                  borderRadius: '4px',
                                  color: '#001A47',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.35rem'
                                }}
                              >
                                <CheckIcon size={14} color="#107E3E" />
                                <span>{req.skillName}</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.82rem', color: '#8492A0' }}>No confirmed matches yet.</span>
                        )}
                      </div>

                      {/* Critical Mandatory Gaps */}
                      <div>
                        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#BB0000', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
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
                                  backgroundColor: '#FCF2F2',
                                  border: '1px solid #F5B7B1',
                                  borderRadius: '4px',
                                  color: '#BB0000',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.35rem'
                                }}
                              >
                                <AlertTriangleIcon size={14} color="#BB0000" />
                                <span>{req.skillName} (Req: {req.minimumLevel})</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div style={{ fontSize: '0.82rem', color: '#107E3E', fontWeight: 600 }}>
                            All mandatory competencies verified!
                          </div>
                        )}
                      </div>

                      {/* Preferred Gaps */}
                      {preferredGaps.length > 0 && (
                        <div>
                          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#E9730C', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
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
                        <div style={{ padding: '0.6rem', backgroundColor: '#FFF4E5', border: '1px solid #FFD099', borderRadius: '4px', fontSize: '0.78rem', color: '#A05000' }}>
                          <strong>Prerequisite Notice:</strong> {backendMatch.prerequisiteWarnings[0]}
                        </div>
                      )}
                    </div>

                    {/* Card Footer */}
                    <div style={{ padding: '1.25rem', borderTop: '1px solid #EDF1F5', backgroundColor: '#FAFBFD' }}>
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
                      border: '1px solid #D9E1E8',
                      borderRadius: '6px',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: '#001A47',
                      cursor: 'pointer'
                    }}
                  >
                    <PlusIcon size={14} color="#0A6ED1" />
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
