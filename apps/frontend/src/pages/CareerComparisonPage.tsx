import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { StepIndicator } from '../components/common/StepIndicator';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { DemoDataBanner } from '../components/common/DemoDataBanner';
import { CloseIcon, ArrowRightIcon, PlusIcon, CheckIcon, AlertTriangleIcon } from '../components/common/Icons';
import { DEMO_CAREER_ROLES } from '../demo/demoCareers';
import { useCareerContext } from '../context/CareerContext';

export const CareerComparisonPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    comparisonRoleSlugs,
    toggleComparisonRole,
    setTargetRoleSlug,
    skills
  } = useCareerContext();

  const comparedRoles = DEMO_CAREER_ROLES.filter((r) =>
    comparisonRoleSlugs.includes(r.slug)
  );

  const availableToAdd = DEMO_CAREER_ROLES.filter(
    (r) => !comparisonRoleSlugs.includes(r.slug)
  );

  const confirmedSkillNames = skills.filter((s) => s.isConfirmed).map((s) => s.name.toLowerCase());

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
            Compare up to 3 candidate career pathways side-by-side. Analyze transferable competency overlaps, critical gap deltas, and estimated bridge efforts before committing.
          </p>
        </div>

        <Button variant="outline" onClick={() => navigate('/careers')}>
          Back to Catalogue
        </Button>
      </div>

      <DemoDataBanner
        featureName="Role Comparison Engine"
        backendStateText="The competency fit rationales below reflect transferable strengths from your confirmed profile. You can add or swap roles dynamically."
      />

      {comparedRoles.length === 0 ? (
        <Card title="No Careers Currently Selected">
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <p style={{ color: '#5B6876', marginBottom: '1.5rem' }}>
              Select 2 to 3 career pathways from the catalogue to compare requirements side-by-side.
            </p>
            <Button variant="primary" onClick={() => navigate('/careers')}>
              Browse Career Catalogue →
            </Button>
          </div>
        </Card>
      ) : (
        <div>
          {/* Comparison Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `repeat(${comparedRoles.length}, minmax(280px, 1fr))`,
              gap: '1.5rem',
              marginBottom: '2rem'
            }}
          >
            {comparedRoles.map((role) => {
              // Calculate overlap
              const matchedRequirements = role.requiredSkills.filter((req) =>
                confirmedSkillNames.some((cs) => cs.includes(req.skillName.toLowerCase()) || req.skillName.toLowerCase().includes(cs))
              );
              const missingRequirements = role.requiredSkills.filter(
                (req) => !matchedRequirements.some((m) => m.skillId === req.skillId)
              );

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
                        cursor: 'pointer',
                        padding: '4px'
                      }}
                    >
                      <CloseIcon size={16} />
                    </button>

                    <Badge variant={role.isSapEcosystem ? 'info' : 'neutral'} size="sm" style={{ marginBottom: '0.4rem' }}>
                      {role.track.replace(/_/g, ' ')}
                    </Badge>

                    <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#001A47', paddingRight: '20px' }}>
                      {role.title}
                    </h3>

                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem', marginTop: '0.75rem' }}>
                      <span style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0A6ED1' }}>
                        {role.matchScoreDemo}%
                      </span>
                      <span style={{ fontSize: '0.8rem', color: '#5B6876' }}>Transferable Index</span>
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
                          <Badge variant={role.marketDemand === 'Critical' ? 'critical' : 'info'} size="sm">
                            {role.marketDemand}
                          </Badge>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#5B6876' }}>Est. Transition:</span>
                          <strong style={{ color: '#001A47' }}>{role.typicalPivotTimeline}</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#5B6876' }}>Bridge Hours:</span>
                          <strong style={{ color: '#0A6ED1' }}>~{role.learningHoursEstimate} hrs</strong>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#5B6876' }}>Salary Band:</span>
                          <strong style={{ color: '#107E3E' }}>{role.averageSalaryUsd}</strong>
                        </div>
                      </div>
                    </div>

                    {/* Matched & Transferable Strengths */}
                    <div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#107E3E', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                        Transferable Strengths ({matchedRequirements.length})
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        {matchedRequirements.length > 0 ? (
                          matchedRequirements.map((req) => (
                            <div
                              key={req.skillId}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.4rem',
                                fontSize: '0.82rem',
                                backgroundColor: '#E8F5ED',
                                padding: '0.35rem 0.5rem',
                                borderRadius: '4px',
                                color: '#107E3E'
                              }}
                            >
                              <CheckIcon size={14} color="#107E3E" />
                              <span>{req.skillName}</span>
                            </div>
                          ))
                        ) : (
                          <span style={{ fontSize: '0.8rem', color: '#8492A0' }}>No exact matches yet</span>
                        )}
                      </div>
                    </div>

                    {/* Critical Skill Gaps */}
                    <div>
                      <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#BB0000', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                        Critical Skill Gaps ({missingRequirements.length})
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        {missingRequirements.map((req) => (
                          <div
                            key={req.skillId}
                            style={{
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.4rem',
                              fontSize: '0.82rem',
                              backgroundColor: '#FDE8E8',
                              padding: '0.35rem 0.5rem',
                              borderRadius: '4px',
                              color: '#BB0000'
                            }}
                          >
                            <AlertTriangleIcon size={14} color="#BB0000" />
                            <span>{req.skillName}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Prerequisites */}
                    {role.prerequisites && (
                      <div>
                        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#8492A0', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                          Key Prerequisites
                        </div>
                        <ul style={{ paddingLeft: '1.2rem', fontSize: '0.82rem', color: '#5B6876', lineHeight: 1.4 }}>
                          {role.prerequisites.map((p, i) => (
                            <li key={i}>{p}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>

                  {/* Card Bottom Action */}
                  <div style={{ padding: '1.25rem', borderTop: '1px solid #EDF1F5', backgroundColor: '#FAFBFD' }}>
                    <Button
                      variant="primary"
                      fullWidth
                      icon={<ArrowRightIcon size={16} />}
                      iconPosition="right"
                      onClick={() => {
                        setTargetRoleSlug(role.slug);
                        navigate('/career-gap');
                      }}
                    >
                      Select as Target Pathway
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Add Another Role Pill Bar */}
          {comparedRoles.length < 3 && availableToAdd.length > 0 && (
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px dashed #B4D7FA',
                borderRadius: '8px',
                padding: '1.25rem',
                textAlign: 'center',
                marginBottom: '2rem'
              }}
            >
              <span style={{ fontSize: '0.9rem', color: '#001A47', fontWeight: 600, marginRight: '1rem' }}>
                Add up to {3 - comparedRoles.length} more role to compare:
              </span>
              <div style={{ display: 'inline-flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.5rem' }}>
                {availableToAdd.map((role) => (
                  <Button
                    key={role.id}
                    variant="outline"
                    size="sm"
                    icon={<PlusIcon size={14} />}
                    onClick={() => toggleComparisonRole(role.slug)}
                  >
                    + {role.title}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
