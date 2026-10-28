import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { StepIndicator } from '../components/common/StepIndicator';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { ProgressBar } from '../components/common/ProgressBar';
import { DemoDataBanner } from '../components/common/DemoDataBanner';
import { CheckIcon, AlertTriangleIcon, ArrowLeftIcon, BookOpenIcon } from '../components/common/Icons';
import { useCareerContext } from '../context/CareerContext';

export const SkillGapPage: React.FC = () => {
  const navigate = useNavigate();
  const { targetRole, skills } = useCareerContext();

  const confirmedSkillNames = skills.filter((s) => s.isConfirmed).map((s) => s.name.toLowerCase());

  // Segregate target requirements into matches and gaps
  const matchedRequirements = targetRole.requiredSkills.filter((req) =>
    confirmedSkillNames.some(
      (cs) => cs.includes(req.skillName.toLowerCase()) || req.skillName.toLowerCase().includes(cs)
    )
  );

  const missingRequirements = targetRole.requiredSkills.filter(
    (req) => !matchedRequirements.some((m) => m.skillId === req.skillId)
  );

  const mandatoryGaps = missingRequirements.filter((req) => req.isMandatory);
  const optionalGaps = missingRequirements.filter((req) => !req.isMandatory);

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1280px', margin: '0 auto' }}>
      <Breadcrumbs
        items={[
          { label: 'Careers', path: '/careers' },
          { label: 'Skill Gap Breakdown' }
        ]}
      />
      <StepIndicator currentStepId="gap" />

      {/* Target Role Hero Header */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #D9E1E8',
          borderRadius: '8px',
          padding: '2rem',
          boxShadow: '0 2px 8px rgba(0, 26, 71, 0.05)',
          marginBottom: '2rem'
        }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center' }}>
              <Badge variant="info">Target Pathway</Badge>
              <Badge variant="purple">{targetRole.track.replace(/_/g, ' ')}</Badge>
            </div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#001A47', marginBottom: '0.5rem' }}>
              {targetRole.title}
            </h1>
            <p style={{ color: '#5B6876', fontSize: '1rem', maxWidth: '750px', lineHeight: 1.5 }}>
              {targetRole.summary}
            </p>
          </div>

          <div
            style={{
              backgroundColor: '#FAFBFD',
              border: '1px solid #EDF1F5',
              padding: '1.25rem 1.5rem',
              borderRadius: '8px',
              minWidth: '220px',
              textAlign: 'center'
            }}
          >
            <div style={{ fontSize: '2.4rem', fontWeight: 800, color: '#0A6ED1' }}>
              {targetRole.matchScoreDemo}%
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#001A47' }}>
              Transferable Baseline
            </div>
            <div style={{ fontSize: '0.78rem', color: '#5B6876', marginTop: '0.2rem' }}>
              ~{targetRole.learningHoursEstimate} hrs to bridge full core
            </div>
          </div>
        </div>

        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid #EDF1F5' }}>
          <ProgressBar
            percentage={targetRole.matchScoreDemo}
            label="Overall Competency Fit"
            sublabel={`${matchedRequirements.length} of ${targetRole.requiredSkills.length} competencies met`}
            height={10}
          />
        </div>
      </div>

      <DemoDataBanner
        featureName="Explainable Competency Gap Analysis"
        backendStateText="This breakdown compares your confirmed skills against the required ontology. The next phase will connect these exact gaps to SAP Learning Hub Student Edition journeys."
      />

      {/* Two Column Layout: Confirmed Transferable vs Gaps to Bridge */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
        {/* Column 1: Confirmed Strengths */}
        <Card
          title={`Confirmed Transferable Strengths (${matchedRequirements.length})`}
          subtitle="Competencies from your background that apply directly to this role"
        >
          {matchedRequirements.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {matchedRequirements.map((req) => (
                <div
                  key={req.skillId}
                  style={{
                    backgroundColor: '#E8F5ED',
                    border: '1px solid #B8E3C8',
                    borderRadius: '6px',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: '#107E3E' }}>
                      <CheckIcon size={16} color="#107E3E" />
                      <span>{req.skillName}</span>
                    </div>
                    <Badge variant="success" size="sm">
                      Level: {req.minimumLevel}
                    </Badge>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#276738' }}>
                    Category: {req.category.replace(/_/g, ' ')} • Weight: {(req.weight * 100).toFixed(0)}%
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#8492A0' }}>
              No immediate direct overlaps identified. Foundational training recommended.
            </div>
          )}
        </Card>

        {/* Column 2: Mandatory Gaps */}
        <Card
          title={`Required Competencies to Bridge (${missingRequirements.length})`}
          subtitle="Specific skill deltas mapped into your personalized learning pathway"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {mandatoryGaps.length > 0 && (
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#BB0000', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                  Mandatory Requirements ({mandatoryGaps.length})
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {mandatoryGaps.map((req) => (
                    <div
                      key={req.skillId}
                      style={{
                        backgroundColor: '#FDE8E8',
                        border: '1px solid #F8B4B4',
                        borderRadius: '6px',
                        padding: '1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.35rem'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: '#BB0000' }}>
                          <AlertTriangleIcon size={16} color="#BB0000" />
                          <span>{req.skillName}</span>
                        </div>
                        <Badge variant="critical" size="sm">
                          Target: {req.minimumLevel}
                        </Badge>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#821D1D' }}>
                        Category: {req.category.replace(/_/g, ' ')} • Core Non-Negotiable
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {optionalGaps.length > 0 && (
              <div>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#E9730C', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                  Recommended / Value-Add Skills ({optionalGaps.length})
                </span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {optionalGaps.map((req) => (
                    <div
                      key={req.skillId}
                      style={{
                        backgroundColor: '#FEF3E8',
                        border: '1px solid #FCD4B2',
                        borderRadius: '6px',
                        padding: '1rem',
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '0.35rem'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 600, color: '#873E04' }}>
                          <span>{req.skillName}</span>
                        </div>
                        <Badge variant="warning" size="sm">
                          Target: {req.minimumLevel}
                        </Badge>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#873E04' }}>
                        Enhances project delivery and team agility
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Bottom Actions */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #D9E1E8',
          borderRadius: '8px',
          padding: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <Button variant="ghost" icon={<ArrowLeftIcon size={16} />} onClick={() => navigate('/careers')}>
          Select Different Career
        </Button>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.9rem', color: '#5B6876' }}>
            Ready to close the {missingRequirements.length} identified gaps?
          </span>
          <Button
            variant="primary"
            size="lg"
            icon={<BookOpenIcon size={18} />}
            iconPosition="right"
            onClick={() => navigate('/learning')}
          >
            Generate Verified Learning Plan →
          </Button>
        </div>
      </div>
    </div>
  );
};
