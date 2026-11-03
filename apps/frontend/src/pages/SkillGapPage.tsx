import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
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
import { enterpriseTheme } from '../theme/tokens';

export const SkillGapPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    targetRole,
    skills,
    isRealProfileReviewed,
    currentProfileId,
    currentGapAnalysis,
    fetchSkillGaps,
    sessionMode
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
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
      <Breadcrumbs
        items={[
          { label: 'Careers', path: '/careers' },
          { label: 'Skill Gap Breakdown' }
        ]}
      />

      {/* Target Role Hero Header */}
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
                Stage 4 of 8
              </Badge>
              <Badge variant={isRealProfileReviewed ? 'success' : 'warning'}>
                {isRealProfileReviewed ? 'Verified Candidate Profile' : 'Sample Demo Profile'}
              </Badge>
              <Badge variant="info">Target Pathway</Badge>
              <Badge variant="purple">{targetRole.careerFamily ? targetRole.careerFamily.replace(/_/g, ' ') : targetRole.track.replace(/_/g, ' ')}</Badge>
              <Badge variant={targetRole.ecosystem === 'SAP' ? 'info' : targetRole.ecosystem === 'HYBRID' ? 'purple' : 'neutral'}>
                {targetRole.ecosystem === 'SAP' ? 'SAP Ecosystem' : targetRole.ecosystem === 'HYBRID' ? 'Hybrid / Cross-ERP' : 'Non-SAP Cloud'}
              </Badge>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: enterpriseTheme.colors.textPrimary, marginBottom: '0.5rem' }}>
              {targetRole.title}
            </h1>
            <p style={{ color: enterpriseTheme.colors.textSecondary, fontSize: '0.96rem', maxWidth: '750px', lineHeight: 1.55 }}>
              {targetRole.summary}
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
            <div
              style={{
                fontSize: '2.5rem',
                fontWeight: 800,
                color: fitPercentage >= 70 ? enterpriseTheme.colors.success : fitPercentage >= 50 ? enterpriseTheme.colors.primary : enterpriseTheme.colors.warning
              }}
            >
              {fitPercentage}%
            </div>
            <div style={{ fontSize: '0.86rem', fontWeight: 700, color: enterpriseTheme.colors.textPrimary }}>
              {isRealProfileReviewed ? 'Profile-Derived Overlap' : 'Demonstration Index'}
            </div>
            <div style={{ fontSize: '0.78rem', color: enterpriseTheme.colors.textSecondary, marginTop: '0.2rem' }}>
              ~{estimatedBridgeHours} hrs planning estimate
            </div>
          </div>
        </div>

        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: `1px solid ${enterpriseTheme.colors.surfaceBorder}` }}>
          <ProgressBar
            percentage={fitPercentage}
            label="Verified Competency Coverage"
            sublabel={`${confirmedMatches.length} confirmed matches • ${mandatoryGaps.length} mandatory gaps • ${partiallyMatched.length} partial`}
            height={10}
            color={fitPercentage >= 70 ? enterpriseTheme.colors.success : enterpriseTheme.colors.primary}
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
        <div style={{ backgroundColor: '#FFFFFF', border: `1px solid ${enterpriseTheme.colors.surfaceBorder}`, borderRadius: enterpriseTheme.radii.md, padding: '1rem 1.25rem', boxShadow: enterpriseTheme.shadows.card }}>
          <span style={{ fontSize: '0.75rem', color: enterpriseTheme.colors.success, textTransform: 'uppercase', fontWeight: 700 }}>Confirmed Strengths</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: enterpriseTheme.colors.success, marginTop: '0.2rem' }}>{confirmedMatches.length}</div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', border: `1px solid ${enterpriseTheme.colors.surfaceBorder}`, borderRadius: enterpriseTheme.radii.md, padding: '1rem 1.25rem', boxShadow: enterpriseTheme.shadows.card }}>
          <span style={{ fontSize: '0.75rem', color: enterpriseTheme.colors.critical, textTransform: 'uppercase', fontWeight: 700 }}>Mandatory Gaps</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: enterpriseTheme.colors.critical, marginTop: '0.2rem' }}>{mandatoryGaps.length}</div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', border: `1px solid ${enterpriseTheme.colors.surfaceBorder}`, borderRadius: enterpriseTheme.radii.md, padding: '1rem 1.25rem', boxShadow: enterpriseTheme.shadows.card }}>
          <span style={{ fontSize: '0.75rem', color: enterpriseTheme.colors.warning, textTransform: 'uppercase', fontWeight: 700 }}>Partially Matched</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: enterpriseTheme.colors.warning, marginTop: '0.2rem' }}>{partiallyMatched.length}</div>
        </div>

        <div style={{ backgroundColor: '#FFFFFF', border: `1px solid ${enterpriseTheme.colors.surfaceBorder}`, borderRadius: enterpriseTheme.radii.md, padding: '1rem 1.25rem', boxShadow: enterpriseTheme.shadows.card }}>
          <span style={{ fontSize: '0.75rem', color: enterpriseTheme.colors.primary, textTransform: 'uppercase', fontWeight: 700 }}>Planning Effort</span>
          <div style={{ fontSize: '1.75rem', fontWeight: 800, color: enterpriseTheme.colors.primary, marginTop: '0.2rem' }}>~{estimatedBridgeHours} hrs</div>
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
                    backgroundColor: enterpriseTheme.colors.successSubtle,
                    border: `1px solid ${enterpriseTheme.colors.successBorder}`,
                    borderRadius: enterpriseTheme.radii.sm,
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontWeight: 700, color: enterpriseTheme.colors.success }}>
                      <CheckIcon size={16} color={enterpriseTheme.colors.success} />
                      <span>{item.skillName}</span>
                    </div>
                    <Badge variant="success" size="sm">
                      Level: {item.candidateProficiency || item.requiredProficiency}
                    </Badge>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: enterpriseTheme.colors.successHover }}>
                    Category: {item.category.replace(/_/g, ' ')} • Match Factor: 1.0 (Full Match)
                  </div>
                  {item.evidenceSnippet && (
                    <div style={{ fontSize: '0.78rem', color: enterpriseTheme.colors.textSecondary, fontStyle: 'italic', marginTop: '0.25rem' }}>
                      Evidence: "{item.evidenceSnippet}"
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '1.5rem', color: enterpriseTheme.colors.textMuted, fontSize: '0.88rem' }}>
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
                    backgroundColor: enterpriseTheme.colors.warningSubtle,
                    border: `1px solid ${enterpriseTheme.colors.warningBorder}`,
                    borderRadius: enterpriseTheme.radii.sm,
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.35rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <strong style={{ color: enterpriseTheme.colors.textPrimary }}>{item.skillName}</strong>
                    <Badge variant="warning" size="sm">
                      Partial ({(item.matchFactor * 100).toFixed(0)}%)
                    </Badge>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: enterpriseTheme.colors.warning }}>
                    Your Level: {item.candidateProficiency || 'Novice'} → Target Required: {item.requiredProficiency}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: enterpriseTheme.colors.textSecondary }}>{item.explanation}</div>
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
                    backgroundColor: enterpriseTheme.colors.criticalSubtle,
                    border: `1px solid ${enterpriseTheme.colors.criticalBorder}`,
                    borderRadius: enterpriseTheme.radii.sm,
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <AlertTriangleIcon size={18} color={enterpriseTheme.colors.critical} />
                      <strong style={{ color: enterpriseTheme.colors.critical, fontSize: '1rem' }}>{gap.skillName}</strong>
                    </div>
                    <Badge variant="critical" size="sm">
                      Mandatory (Required: {gap.requiredProficiency})
                    </Badge>
                  </div>

                  <p style={{ fontSize: '0.88rem', color: enterpriseTheme.colors.textSecondary, margin: 0 }}>
                    <strong>Why it matters:</strong> {gap.explanation}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.25rem', paddingTop: '0.5rem', borderTop: `1px dashed ${enterpriseTheme.colors.criticalBorder}`, fontSize: '0.82rem' }}>
                    <span style={{ color: enterpriseTheme.colors.textPrimary }}>
                      Bridged via: <strong>SAP Learning Hub / openSAP Curriculum</strong>
                    </span>
                    <button
                      onClick={() => navigate('/learning')}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: enterpriseTheme.colors.primary,
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
            <div style={{ textAlign: 'center', padding: '1.5rem', color: enterpriseTheme.colors.success, fontWeight: 700 }}>
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
                    backgroundColor: enterpriseTheme.colors.canvas,
                    border: `1px solid ${enterpriseTheme.colors.surfaceBorder}`,
                    borderRadius: enterpriseTheme.radii.sm,
                    padding: '1rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                    <strong style={{ color: enterpriseTheme.colors.textPrimary }}>{rec.skillName}</strong>
                    <Badge variant="neutral" size="sm">
                      Elective ({rec.requiredProficiency})
                    </Badge>
                  </div>
                  <div style={{ fontSize: '0.82rem', color: enterpriseTheme.colors.textSecondary }}>{rec.explanation}</div>
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
                    backgroundColor: p.isMet ? enterpriseTheme.colors.successSubtle : enterpriseTheme.colors.canvas,
                    border: `1px solid ${p.isMet ? enterpriseTheme.colors.successBorder : enterpriseTheme.colors.surfaceBorder}`,
                    borderRadius: enterpriseTheme.radii.sm,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '1rem'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    {p.isMet ? (
                      <CheckIcon size={18} color={enterpriseTheme.colors.success} />
                    ) : (
                      <InfoIcon size={18} color={enterpriseTheme.colors.primary} />
                    )}
                    <span style={{ fontSize: '0.88rem', color: enterpriseTheme.colors.textPrimary, fontWeight: 600 }}>
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
