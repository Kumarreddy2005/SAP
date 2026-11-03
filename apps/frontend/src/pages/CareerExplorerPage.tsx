import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import {
  SearchIcon,
  ColumnsIcon,
  ArrowRightIcon,
  CheckIcon,
  InfoIcon,
  AlertTriangleIcon
} from '../components/common/Icons';
import { DEMO_CAREER_ROLES, ExtendedCareerRole } from '../demo/demoCareers';
import { useCareerContext } from '../context/CareerContext';
import { CareerMatchResult } from '@career-orchestrator/shared';
import { enterpriseTheme } from '../theme/tokens';

export const CareerExplorerPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentProfileId,
    targetRoleSlug,
    setTargetRoleSlug,
    comparisonRoleSlugs,
    toggleComparisonRole,
    calculateRoleMatch,
    isRealProfileReviewed,
    skills,
    uploadedFile,
    careerMatches,
    fetchCareerMatches,
    sessionMode
  } = useCareerContext();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFamily, setSelectedFamily] = useState<string>('ALL');
  const [ecosystemFilter, setEcosystemFilter] = useState<'ALL' | 'SAP' | 'HYBRID' | 'NON_SAP'>('ALL');
  const [sortBy, setSortBy] = useState<'match' | 'effort' | 'title' | 'demand'>('match');

  // Explain match modal state
  const [explainingRole, setExplainingRole] = useState<ExtendedCareerRole | null>(null);

  const confirmedCount = skills.filter((s) => s.isConfirmed && s.reviewStatus === 'CONFIRMED').length;

  // On mount, if profile is reviewed, make sure career matches are loaded from backend
  useEffect(() => {
    if (isRealProfileReviewed && currentProfileId && careerMatches.length === 0) {
      fetchCareerMatches(currentProfileId);
    }
  }, [isRealProfileReviewed, currentProfileId, careerMatches.length, fetchCareerMatches]);

  const filteredRoles = DEMO_CAREER_ROLES.filter((role) => {
    const matchesSearch =
      role.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (role.tags && role.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()))) ||
      role.requiredSkills.some((req) => req.skillName.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesFamily = selectedFamily === 'ALL' || role.careerFamily === selectedFamily;

    const matchesEcosystem =
      ecosystemFilter === 'ALL' || role.ecosystem === ecosystemFilter;

    return matchesSearch && matchesFamily && matchesEcosystem;
  });

  // Sorting
  const sortedRoles = [...filteredRoles].sort((a, b) => {
    const matchA = calculateRoleMatch(a).percentage;
    const matchB = calculateRoleMatch(b).percentage;

    if (sortBy === 'match') return matchB - matchA;
    if (sortBy === 'effort') return a.learningHoursEstimate - b.learningHoursEstimate;
    if (sortBy === 'title') return a.title.localeCompare(b.title);
    if (sortBy === 'demand') {
      const rank: Record<string, number> = { Critical: 3, High: 2, Moderate: 1 };
      return (rank[b.marketDemand] || 0) - (rank[a.marketDemand] || 0);
    }
    return 0;
  });

  const handleSelectTarget = (role: ExtendedCareerRole) => {
    setTargetRoleSlug(role.slug);
    navigate('/career-gap');
  };

  const getBackendMatch = (slug: string): CareerMatchResult | undefined => {
    return careerMatches.find((m) => m.roleSlug === slug);
  };

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
      <Breadcrumbs items={[{ label: 'Skills Review', path: '/skills-review' }, { label: 'Career Explorer' }]} />

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
            <h1 style={{ fontSize: '1.85rem', fontWeight: 800, color: enterpriseTheme.colors.textPrimary, margin: 0 }}>
              Career Transition Explorer
            </h1>
            <Badge variant={sessionMode === 'DEMO' ? 'info' : 'success'}>
              Stage 3 of 8
            </Badge>
          </div>
          <p style={{ color: enterpriseTheme.colors.textSecondary, fontSize: '0.98rem', maxWidth: '820px', lineHeight: 1.5 }}>
            Discover and compare viable career transitions across {DEMO_CAREER_ROLES.length} structured roles in SAP Functional, Technical, Integration, Data Analytics, and Hybrid Enterprise Engineering.
          </p>
        </div>

        {/* Comparison Dock Pill */}
        {comparisonRoleSlugs.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Badge variant="purple" size="md">
              {comparisonRoleSlugs.length} / 4 Roles Selected for Comparison
            </Badge>
            <Button
              variant="secondary"
              size="sm"
              icon={<ColumnsIcon size={16} />}
              onClick={() => navigate('/careers/compare')}
            >
              Open Comparison Matrix
            </Button>
          </div>
        )}
      </div>

      {/* Dynamic Personalization / Verification Status Banner */}
      {isRealProfileReviewed ? (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: `1px solid ${enterpriseTheme.colors.successBorder}`,
            borderRadius: enterpriseTheme.radii.md,
            padding: '1rem 1.25rem',
            marginBottom: '1.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
            boxShadow: enterpriseTheme.shadows.card
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div
              style={{
                backgroundColor: enterpriseTheme.colors.successSubtle,
                color: enterpriseTheme.colors.success,
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <CheckIcon color={enterpriseTheme.colors.success} size={18} />
            </div>
            <div style={{ fontSize: '0.88rem', color: enterpriseTheme.colors.textPrimary }}>
              <strong>Explainable Matching Active:</strong> Scores are mathematically computed from your{' '}
              <strong>{confirmedCount} confirmed profile competencies</strong>
              {uploadedFile ? ` from ${uploadedFile.name}` : ''}. Unreviewed or rejected items are excluded from scoring.
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={() => navigate('/skills-review')}>
            Calibrate Reviewed Skills
          </Button>
        </div>
      ) : (
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: `1px solid ${enterpriseTheme.colors.infoBorder}`,
            borderRadius: enterpriseTheme.radii.md,
            padding: '1rem 1.25rem',
            marginBottom: '1.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap',
            boxShadow: enterpriseTheme.shadows.card
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <InfoIcon color={enterpriseTheme.colors.primary} size={18} />
            <div style={{ fontSize: '0.88rem', color: enterpriseTheme.colors.textPrimary }}>
              <strong>Demonstration Index Displayed:</strong> Scores below reflect baseline sample competencies. To calculate personalized matches against your genuine background, review your profile on the Skills Review page.
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/skills-review')}>
            Review & Confirm Skills →
          </Button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: `1px solid ${enterpriseTheme.colors.surfaceBorder}`,
          borderRadius: enterpriseTheme.radii.md,
          padding: '1.15rem 1.25rem',
          marginBottom: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: enterpriseTheme.shadows.card
        }}
      >
        {/* Search Input */}
        <div style={{ position: 'relative', flex: '1 1 280px' }}>
          <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: enterpriseTheme.colors.textMuted }}>
            <SearchIcon size={16} />
          </div>
          <input
            type="text"
            placeholder="Search roles by title, technology, or required skill (e.g. S/4HANA, SQL, RAP)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', paddingLeft: '2.4rem' }}
          />
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Ecosystem Filter */}
          <select
            value={ecosystemFilter}
            onChange={(e) => setEcosystemFilter(e.target.value as 'ALL' | 'SAP' | 'HYBRID' | 'NON_SAP')}
            style={{ fontSize: '0.84rem' }}
          >
            <option value="ALL">All Ecosystems ({DEMO_CAREER_ROLES.length})</option>
            <option value="SAP">SAP Ecosystem Only</option>
            <option value="HYBRID">Hybrid / Cross-ERP</option>
            <option value="NON_SAP">Non-SAP Cloud</option>
          </select>

          {/* Career Family Filter */}
          <select
            value={selectedFamily}
            onChange={(e) => setSelectedFamily(e.target.value)}
            style={{ fontSize: '0.84rem' }}
          >
            <option value="ALL">All Career Families</option>
            <option value="FUNCTIONAL_CONSULTING">Functional Consulting</option>
            <option value="TECHNICAL_DEVELOPMENT">Technical Development</option>
            <option value="INTEGRATION_ARCHITECTURE">Integration Architecture</option>
            <option value="DATA_ANALYTICS">Data & Analytics</option>
            <option value="ENTERPRISE_ANALYSIS">Enterprise Analysis</option>
            <option value="CLOUD_PLATFORM">Cloud & Platform</option>
            <option value="QA_TESTING">QA & Testing</option>
            <option value="PROJECT_MANAGEMENT">Project Management</option>
          </select>

          {/* Sort By */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'match' | 'effort' | 'title' | 'demand')}
            style={{ fontSize: '0.84rem' }}
          >
            <option value="match">Sort: Highest Match Score</option>
            <option value="effort">Sort: Lowest Effort Estimate</option>
            <option value="demand">Sort: Market Demand</option>
            <option value="title">Sort: Role Title (A–Z)</option>
          </select>
        </div>
      </div>

      {/* Results Count Strip */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', fontSize: '0.85rem', color: enterpriseTheme.colors.textSecondary }}>
        <span>
          Showing <strong>{sortedRoles.length}</strong> of {DEMO_CAREER_ROLES.length} career transition roles
        </span>
        {searchTerm || selectedFamily !== 'ALL' || ecosystemFilter !== 'ALL' ? (
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedFamily('ALL');
              setEcosystemFilter('ALL');
              setSortBy('match');
            }}
            style={{ color: enterpriseTheme.colors.primary, background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
          >
            Reset Filters
          </button>
        ) : null}
      </div>

      {/* Career Roles Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2.5rem'
        }}
      >
        {sortedRoles.map((role) => {
          const isTarget = role.slug === targetRoleSlug;
          const isComparing = comparisonRoleSlugs.includes(role.slug);
          const matchResult = calculateRoleMatch(role);
          const backendMatch = getBackendMatch(role.slug);
          const score = isRealProfileReviewed ? matchResult.percentage : role.matchScoreDemo;

          return (
            <Card
              key={role.id}
              hoverable
              title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <span>{role.title}</span>
                  {isTarget && (
                    <Badge variant="success" size="sm">
                      Current Target
                    </Badge>
                  )}
                </div>
              }
              subtitle={role.careerFamily.replace(/_/g, ' ')}
              action={
                <div style={{ textAlign: 'right' }}>
                  <div
                    style={{
                      fontSize: '1.4rem',
                      fontWeight: 800,
                      color: score >= 70 ? enterpriseTheme.colors.success : score >= 50 ? enterpriseTheme.colors.primary : enterpriseTheme.colors.warning
                    }}
                  >
                    {score}%
                  </div>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      color: isRealProfileReviewed ? enterpriseTheme.colors.success : enterpriseTheme.colors.textMuted,
                      textTransform: 'uppercase',
                      fontWeight: isRealProfileReviewed ? 700 : 500
                    }}
                  >
                    {isRealProfileReviewed ? 'Candidate Match' : 'Demo Index'}
                  </span>
                </div>
              }
              footer={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                  <div style={{ display: 'flex', gap: '0.4rem' }}>
                    <button
                      onClick={() => toggleComparisonRole(role.slug)}
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: isComparing ? enterpriseTheme.colors.accentPurple : enterpriseTheme.colors.textSecondary,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.35rem 0.65rem',
                        borderRadius: '4px',
                        backgroundColor: isComparing ? enterpriseTheme.colors.accentPurpleSubtle : 'transparent',
                        border: `1px solid ${isComparing ? '#DECFF2' : enterpriseTheme.colors.surfaceBorder}`,
                        cursor: 'pointer'
                      }}
                    >
                      <ColumnsIcon size={14} />
                      {isComparing ? 'Comparing ✓' : 'Compare'}
                    </button>

                    <button
                      onClick={() => setExplainingRole(role)}
                      style={{
                        fontSize: '0.8rem',
                        fontWeight: 600,
                        color: enterpriseTheme.colors.primary,
                        backgroundColor: enterpriseTheme.colors.primarySubtle,
                        border: `1px solid ${enterpriseTheme.colors.primaryBorder}`,
                        padding: '0.35rem 0.65rem',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Explain Score
                    </button>
                  </div>

                  <Button
                    variant={isTarget ? 'secondary' : 'primary'}
                    size="sm"
                    icon={<ArrowRightIcon size={14} />}
                    iconPosition="right"
                    onClick={() => handleSelectTarget(role)}
                  >
                    {isTarget ? 'View Skill Gaps' : 'Select Target Pathway'}
                  </Button>
                </div>
              }
            >
              <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                <Badge
                  variant={role.ecosystem === 'SAP' ? 'info' : role.ecosystem === 'HYBRID' ? 'purple' : 'neutral'}
                  size="sm"
                >
                  {role.ecosystem === 'SAP' ? 'SAP Ecosystem' : role.ecosystem === 'HYBRID' ? 'Hybrid / Cross-ERP' : 'Non-SAP Cloud'}
                </Badge>
                <Badge variant={role.marketDemand === 'Critical' ? 'critical' : 'warning'} size="sm">
                  {role.marketDemand} Demand
                </Badge>
              </div>

              <p style={{ color: enterpriseTheme.colors.textSecondary, fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '1.25rem', minHeight: '52px' }}>
                {role.summary}
              </p>

              <div style={{ backgroundColor: enterpriseTheme.colors.canvas, padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', border: `1px solid ${enterpriseTheme.colors.surfaceBorder}` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: enterpriseTheme.colors.textSecondary, marginBottom: '0.25rem' }}>
                  <span>Planning Bridge Effort:</span>
                  <strong style={{ color: enterpriseTheme.colors.textPrimary }}>~{role.learningHoursEstimate} hrs ({role.typicalPivotTimeline})</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: enterpriseTheme.colors.textSecondary }}>
                  <span>Market Compensation:</span>
                  <strong style={{ color: enterpriseTheme.colors.success }}>{role.averageSalaryUsd}</strong>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.76rem', fontWeight: 700, color: enterpriseTheme.colors.textPrimary, textTransform: 'uppercase' }}>
                    Required Competencies:
                  </span>
                  {isRealProfileReviewed && (
                    <span style={{ fontSize: '0.75rem', color: enterpriseTheme.colors.success, fontWeight: 700 }}>
                      {matchResult.matchedSkills.length} of {role.requiredSkills.length} Verified
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {role.requiredSkills.map((req, i) => {
                    const isMatched = matchResult.matchedSkills.includes(req.skillName);
                    return (
                      <Badge
                        key={i}
                        variant={isRealProfileReviewed ? (isMatched ? 'success' : 'neutral') : 'outline'}
                        size="sm"
                      >
                        {isRealProfileReviewed ? (isMatched ? `✓ ${req.skillName}` : req.skillName) : req.skillName}
                      </Badge>
                    );
                  })}
                </div>
              </div>

              {/* Warning if mandatory skills are missing and score is high */}
              {backendMatch && backendMatch.missingMandatorySkills.length > 0 && backendMatch.overallScore > 50 && (
                <div style={{ marginTop: '0.75rem', fontSize: '0.78rem', color: enterpriseTheme.colors.warning, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <AlertTriangleIcon size={14} color={enterpriseTheme.colors.warning} />
                  <span>Notice: {backendMatch.missingMandatorySkills.length} essential mandatory requirement(s) missing.</span>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {sortedRoles.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#FFFFFF', borderRadius: '8px', border: `1px dashed ${enterpriseTheme.colors.surfaceBorderStrong}` }}>
          <h3 style={{ color: enterpriseTheme.colors.textPrimary, marginBottom: '0.5rem', fontWeight: 700 }}>No Career Roles Match Your Filters</h3>
          <p style={{ color: enterpriseTheme.colors.textSecondary, marginBottom: '1rem', fontSize: '0.9rem' }}>Try clearing your search query or adjusting your ecosystem and career family filters.</p>
          <Button variant="outline" size="sm" onClick={() => { setSearchTerm(''); setSelectedFamily('ALL'); setEcosystemFilter('ALL'); }}>
            Reset All Filters
          </Button>
        </div>
      )}

      {/* Explain Match Modal */}
      {explainingRole && (
        <Modal
          isOpen={true}
          onClose={() => setExplainingRole(null)}
          title={`Explainable Match: ${explainingRole.title}`}
        >
          <div style={{ fontSize: '0.88rem', color: enterpriseTheme.colors.textPrimary, lineHeight: 1.6 }}>
            <div style={{ backgroundColor: enterpriseTheme.colors.canvas, padding: '1rem', borderRadius: '6px', border: `1px solid ${enterpriseTheme.colors.surfaceBorder}`, marginBottom: '1.25rem' }}>
              <div style={{ fontWeight: 700, color: enterpriseTheme.colors.textPrimary, marginBottom: '0.25rem' }}>
                Mathematical Match Formula:
              </div>
              <code style={{ fontSize: '0.82rem', color: enterpriseTheme.colors.primary }}>
                Match Score = 100 × (sum(requirement_weight × match_factor) / sum(weights))
              </code>
              <p style={{ fontSize: '0.8rem', color: enterpriseTheme.colors.textSecondary, marginTop: '0.5rem', marginBottom: 0 }}>
                Derived deterministically by comparing your confirmed competencies and declared proficiencies against the published role requirements. Full match = 1.0; Partial proficiency = 0.4–0.75; Missing or rejected = 0.0.
              </p>
            </div>

            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: enterpriseTheme.colors.textPrimary, marginBottom: '0.5rem' }}>
              Requirement Breakdown for {explainingRole.title}:
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '280px', overflowY: 'auto', marginBottom: '1.25rem', paddingRight: '0.5rem' }}>
              {explainingRole.requiredSkills.map((req) => {
                const isMatched = calculateRoleMatch(explainingRole).matchedSkills.includes(req.skillName);
                return (
                  <div
                    key={req.skillId}
                    style={{
                      padding: '0.75rem',
                      borderRadius: '6px',
                      border: `1px solid ${isMatched ? enterpriseTheme.colors.successBorder : enterpriseTheme.colors.surfaceBorder}`,
                      backgroundColor: isMatched ? enterpriseTheme.colors.successSubtle : '#FFFFFF'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ color: enterpriseTheme.colors.textPrimary }}>{req.skillName}</strong>
                      <Badge variant={isMatched ? 'success' : 'neutral'} size="sm">
                        {isMatched ? '100% Match Factor' : '0.0 (Missing)'}
                      </Badge>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: enterpriseTheme.colors.textSecondary, marginTop: '0.25rem' }}>
                      Weight: {req.weight} • Minimum Level: {req.minimumLevel} • {req.isMandatory ? 'Mandatory Requirement' : 'Preferred Skill'}
                    </div>
                    {req.rationale && (
                      <div style={{ fontSize: '0.76rem', color: enterpriseTheme.colors.textMuted, marginTop: '0.2rem', fontStyle: 'italic' }}>
                        Rationale: {req.rationale}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div style={{ padding: '0.75rem', backgroundColor: enterpriseTheme.colors.warningSubtle, border: `1px solid ${enterpriseTheme.colors.warningBorder}`, borderRadius: '6px', fontSize: '0.8rem', color: enterpriseTheme.colors.warning, marginBottom: '1.25rem' }}>
              <strong>Important Advisory:</strong> Match scores represent syllabus and competency overlap to guide your professional development. They are not a probability of being hired or guaranteed employment.
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <Button variant="ghost" onClick={() => setExplainingRole(null)}>
                Close Explanation
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setTargetRoleSlug(explainingRole.slug);
                  setExplainingRole(null);
                  navigate('/career-gap');
                }}
              >
                Select Target & View Gaps →
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};
