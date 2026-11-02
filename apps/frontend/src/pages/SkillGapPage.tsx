import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { StepIndicator } from '../components/common/StepIndicator';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { ProgressBar } from '../components/common/ProgressBar';
import {
  CheckIcon,
  AlertTriangleIcon,
  ArrowLeftIcon,
  BookOpenIcon,
  InfoIcon
} from '../components/common/Icons';
import { useCareerContext } from '../context/CareerContext';

export const SkillGapPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    targetRole,
    skills,
    isRealProfileReviewed,
    currentProfileId,
    currentGapAnalysis,
    fetchSkillGaps
  } = useCareerContext();

  useEffect(() => {
    if (targetRole && currentProfileId) {
      fetchSkillGaps(targetRole.slug, currentProfileId);
    }
  }, [targetRole, currentProfileId, fetchSkillGaps]);

  const confirmedSkillNames = skills
    .filter((s) => s.isConfirmed && s.reviewStatus === 'CONFIRMED')
    .map((s) => s.name.toLowerCase());

  // Use backend analysis if available, otherwise fallback to local calculation
  const confirmedMatches = currentGapAnalysis
    ? currentGapAnalysis.confirmedMatches
    : targetRole.requiredSkills
        .filter((req) =>
          confirmedSkillNames.some(
            (cs) => cs.includes(req.skillName.toLowerCase()) || req.skillName.toLowerCase().includes(cs)
          )
        )
        .map((req) => ({
          skillId: req.skillId,
          skillName: req.skillName,
          category: req.category,
          isMandatory: req.isMandatory,
          weight: req.weight,
          requiredProficiency: req.minimumLevel,
          candidateProficiency: req.minimumLevel,
          matchFactor: 1.0,
          status: 'FULL_MATCH' as const,
          evidenceSnippet: 'Demonstrated in candidate confirmed competencies.',
          explanation: 'Demonstrated in candidate confirmed competencies.'
        }));

  const mandatoryGaps = currentGapAnalysis
    ? currentGapAnalysis.mandatoryGaps
    : targetRole.requiredSkills
        .filter(
          (req) =>
            req.isMandatory &&
            !confirmedSkillNames.some(
              (cs) => cs.includes(req.skillName.toLowerCase()) || req.skillName.toLowerCase().includes(cs)
            )
        )
        .map((req) => ({
          skillId: req.skillId,
          skillName: req.skillName,
          category: req.category,
          isMandatory: true,
          weight: req.weight,
          requiredProficiency: req.minimumLevel,
          matchFactor: 0.0,
          status: 'MISSING' as const,
          explanation: req.rationale || 'Mandatory core requirement for role.'
        }));

  const recommendedGaps = currentGapAnalysis
    ? currentGapAnalysis.recommendedGaps
    : (targetRole.preferredSkills || [])
        .filter(
          (req) =>
            !confirmedSkillNames.some(
              (cs) => cs.includes(req.skillName.toLowerCase()) || req.skillName.toLowerCase().includes(cs)
            )
        )
        .map((req) => ({
          skillId: req.skillId,
          skillName: req.skillName,
          category: req.category,
          isMandatory: false,
          weight: req.weight,
          requiredProficiency: req.minimumLevel,
          matchFactor: 0.0,
          status: 'MISSING' as const,
          explanation: req.rationale || 'Preferred elective competency.'
        }));

  const partiallyMatched = currentGapAnalysis ? currentGapAnalysis.partiallyMatched : [];
  const prerequisites = currentGapAnalysis ? currentGapAnalysis.prerequisites : (targetRole.prerequisites || []).map((p) => ({
    requirement: p,
    isMet: confirmedSkillNames.some((cs) => p.toLowerCase().includes(cs)),
    guidance: 'Foundational concept recommended prior to undertaking advanced configuration customizing.'
  }));

  const fitPercentage = currentGapAnalysis
    ? currentGapAnalysis.overallFitPercentage
    : isRealProfileReviewed
    ? Math.round((confirmedMatches.length / Math.max(1, targetRole.requiredSkills.length)) * 100)
    : targetRole.matchScoreDemo;

  const estimatedBridgeHours = currentGapAnalysis
    ? currentGapAnalysis.criticalitySummary.estimatedBridgeHours
    : targetRole.learningHoursEstimate;

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
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <Badge variant={isRealProfileReviewed ? 'success' : 'warning'}>
                {isRealProfileReviewed ? 'Verified Candidate Profile' : 'Sample Demo Profile'}
              </Badge>
              <Badge variant="info">Target Pathway</Badge>
              <Badge variant="purple">{targetRole.careerFamily ? targetRole.careerFamily.replace(/_/g, ' ') : targetRole.track.replace(/_/g, ' ')}</Badge>
              <Badge variant={targetRole.ecosystem === 'SAP' ? 'info' : targetRole.ecosystem === 'HYBRID' ? 'purple' : 'neutral'}>
                {targetRole.ecosystem === 'SAP' ? 'SAP Ecosystem' : targetRole.ecosystem === 'HYBRID' ? 'Hybrid / Cross-ERP' : 'Non-SAP Cloud'}
              </Badge>
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
            <div
              style={{
                fontSize: '2.4rem',
                fontWeight: 800,
                color: fitPercentage >= 70 ? '#107E3E' : fitPercentage >= 50 ? '#0A6ED1' : '#E9730C'
              }}
            >
              {fitPercentage}%
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#001A47' }}>
              {isRealProfileReviewed ? 'Profile-Derived Overlap' : 'Demonstration Index'}
            </div>
            <div style={{ fontSize: '0.78rem', color: '#5B6876', marginTop: '0.2rem' }}>
              ~{estimatedBridgeHours} hrs planning estimate
            </div>
          </div>
        </div>

        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid #EDF1F5' }}>
          <ProgressBar
            percentage={fitPercentage}
            label="Verified Competency Coverage"
            sublabel={`${confirmedMatches.length} confirmed matches • ${mandatoryGaps.length} mandatory gaps • ${partiallyMatched.length} partial`}
            height={10}
          />
        </div>
      </div>

      {/* Criticality Summary Strip */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          marginBottom: '2rem'
        }}
      >
        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #D9E1E8', borderRadius: '8px', padding: '1rem 1.25rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#107E3E', textTransform: 'uppercase', fontWeight: 600 }}>Confirmed Strengths</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#107E3E', marginTop: '0.2rem' }}>{confirmedMatches.length}</div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #D9E1E8', borderRadius: '8px', padding: '1rem 1.25rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#BB0000', textTransform: 'uppercase', fontWeight: 600 }}>Mandatory Gaps</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#BB0000', marginTop: '0.2rem' }}>{mandatoryGaps.length}</div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #D9E1E8', borderRadius: '8px', padding: '1rem 1.25rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#E9730C', textTransform: 'uppercase', fontWeight: 600 }}>Partially Matched</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#E9730C', marginTop: '0.2rem' }}>{partiallyMatched.length}</div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', border: '1px solid #D9E1E8', borderRadius: '8px', padding: '1rem 1.25rem' }}>
          <span style={{ fontSize: '0.8rem', color: '#0A6ED1', textTransform: 'uppercase', fontWeight: 600 }}>Planning Effort</span>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: '#0A6ED1', marginTop: '0.2rem' }}>~{estimatedBridgeHours} hrs</div>
        </div>
      </div>

      {/* 6-Group Categorized Requirements Section */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', marginBottom: '2.5rem' }}>
        {/* Group 1: Confirmed Matches */}
        <Card
          title={`1. Confirmed Competency Matches (${confirmedMatches.length})`}
          subtitle="Competencies from your background that apply directly to this target role"
        >
          {confirmedMatches.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
              {confirmedMatches.map((item) => (
                <div
                  key={item.skillId}
                  style={{
                    backgroundColor: '#F3FAF6',
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
                      <span>{item.skillName}</span>
                    </div>
                    <Badge variant="success" size="sm">
                      Level: {item.candidateProficiency || item.requiredProficiency}
                    </Badge>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#276738' }}>
                    Category: {item.category.replace(/_/g, ' ')} • Match Factor: 1.0 (Full Match)
                  </div>
                  {item.evidenceSnippet && (
                    <div style={{ fontSize: '0.78rem', color: '#5B6876', fontStyle: 'italic', marginTop: '0.25rem' }}>
                      Evidence: "{item.evidenceSnippet}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '1.5rem', color: '#8492A0', fontSize: '0.9rem' }}>
              No direct overlaps verified yet. The learning pathway below will cover all foundational requirements.
            </div>
          )}
        </Card>

        {/* Group 2: Partially Matched Competencies */}
        {partiallyMatched.length > 0 && (
          <Card
            title={`2. Partially Matched Competencies (${partiallyMatched.length})`}
            subtitle="Skills verified at introductory levels that require calibration up to target enterprise standards"
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
              {partiallyMatched.map((item) => (
                <div
                  key={item.skillId}
                  style={{
                    backgroundColor: '#FFF8F0',
                    border: '1px solid #FFE0B2',
                    borderRadius: '6px',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ color: '#001A47' }}>{item.skillName}</strong>
                    <Badge variant="warning" size="sm">
                      Partial ({(item.matchFactor * 100).toFixed(0)}%)
                    </Badge>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#A05000' }}>
                    Your Level: {item.candidateProficiency || 'Novice'} → Target Required: {item.requiredProficiency}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#5B6876' }}>{item.explanation}</div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Group 3: Mandatory Gaps */}
        <Card
          title={`3. Mandatory Skill Gaps (${mandatoryGaps.length})`}
          subtitle="Non-negotiable core requirements needed for this career transition"
        >
          {mandatoryGaps.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {mandatoryGaps.map((gap) => (
                <div
                  key={gap.skillId}
                  style={{
                    backgroundColor: '#FCF2F2',
                    border: '1px solid #F5B7B1',
                    borderRadius: '6px',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <AlertTriangleIcon size={18} color="#BB0000" />
                      <strong style={{ color: '#BB0000', fontSize: '1rem' }}>{gap.skillName}</strong>
                    </div>
                    <Badge variant="critical" size="sm">
                      Mandatory (Required: {gap.requiredProficiency})
                    </Badge>
                  </div>

                  <p style={{ fontSize: '0.875rem', color: '#5B6876', margin: 0 }}>
                    <strong>Why it matters:</strong> {gap.explanation}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.25rem', paddingTop: '0.5rem', borderTop: '1px dashed #F5B7B1', fontSize: '0.82rem' }}>
                    <span style={{ color: '#001A47' }}>
                      Bridged via: <strong>SAP Learning Hub / openSAP Curriculum</strong>
                    </span>
                    <button
                      onClick={() => navigate('/learning')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#0A6ED1',
                        cursor: 'pointer',
                        fontWeight: 600,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem'
                      }}
                    >
                      <BookOpenIcon size={14} />
                      View in Learning Pathway →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '1.5rem', color: '#107E3E', fontWeight: 600 }}>
              All mandatory competency requirements have been confirmed in your profile!
            </div>
          )}
        </Card>

        {/* Group 4: Recommended Elective Gaps */}
        {recommendedGaps.length > 0 && (
          <Card
            title={`4. Recommended Elective Competencies (${recommendedGaps.length})`}
            subtitle="Valuable enhancements that increase transition competitiveness"
          >
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
              {recommendedGaps.map((rec) => (
                <div
                  key={rec.skillId}
                  style={{
                    backgroundColor: '#FAFBFD',
                    border: '1px solid #EDF1F5',
                    borderRadius: '6px',
                    padding: '1rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                    <strong style={{ color: '#001A47' }}>{rec.skillName}</strong>
                    <Badge variant="neutral" size="sm">
                      Elective ({rec.requiredProficiency})
                    </Badge>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: '#5B6876' }}>{rec.explanation}</div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Group 5: External Prerequisites & Qualifications */}
        {prerequisites.length > 0 && (
          <Card
            title="5. Essential Prerequisites & Foundational Criteria"
            subtitle="Domain prerequisites and foundational qualifications"
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {prerequisites.map((p, idx) => (
                <div
                  key={idx}
                  style={{
                    padding: '0.85rem 1rem',
                    backgroundColor: p.isMet ? '#F3FAF6' : '#FAFBFD',
                    border: `1px solid ${p.isMet ? '#B8E3C8' : '#EDF1F5'}`,
                    borderRadius: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    {p.isMet ? (
                      <CheckIcon size={18} color="#107E3E" />
                    ) : (
                      <InfoIcon size={18} color="#0A6ED1" />
                    )}
                    <span style={{ fontSize: '0.9rem', color: '#001A47', fontWeight: 600 }}>
                      {p.requirement}
                    </span>
                  </div>
                  <Badge variant={p.isMet ? 'success' : 'neutral'} size="sm">
                    {p.isMet ? 'Verified' : 'Guidance'}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        )}
      </div>

      {/* Navigation Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <Button variant="ghost" icon={<ArrowLeftIcon size={16} />} onClick={() => navigate('/careers')}>
          Back to Career Explorer
        </Button>
        <Button
          variant="primary"
          size="lg"
          icon={<BookOpenIcon size={18} />}
          iconPosition="right"
          onClick={() => navigate('/learning')}
        >
          Generate My Personalized Learning Pathway →
        </Button>
      </div>
    </div>
  );
};
