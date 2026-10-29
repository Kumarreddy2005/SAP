import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { StepIndicator } from '../components/common/StepIndicator';
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
    fetchCareerMatches
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
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1280px', margin: '0 auto' }}>
      <Breadcrumbs items={[{ label: 'Skills Review', path: '/skills-review' }, { label: 'Career Explorer' }]} />
      <StepIndicator currentStepId="careers" />

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
            Career Transition Explorer
          </h1>
          <p style={{ color: '#5B6876', fontSize: '1.05rem', maxWidth: '800px' }}>
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
            backgroundColor: '#F3FAF6',
            border: '1px solid #B8E3C8',
            borderRadius: '8px',
            padding: '1rem 1.25rem',
            marginBottom: '1.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <CheckIcon color="#107E3E" size={22} />
            <div style={{ fontSize: '0.9rem', color: '#001A47' }}>
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
            backgroundColor: '#EBF3FB',
            border: '1px solid #C4D5EA',
            borderRadius: '8px',
            padding: '1rem 1.25rem',
            marginBottom: '1.75rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '1rem',
            flexWrap: 'wrap'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <InfoIcon color="#0A6ED1" size={20} />
            <div style={{ fontSize: '0.9rem', color: '#001A47' }}>
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
          border: '1px solid #D9E1E8',
          borderRadius: '8px',
          padding: '1.25rem',
          marginBottom: '2rem',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '1rem',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        {/* Search Input */}
        <div style={{ position: 'relative', flex: '1 1 280px' }}>
          <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8492A0' }}>
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
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Ecosystem Filter */}
          <select
            value={ecosystemFilter}
            onChange={(e) => setEcosystemFilter(e.target.value as 'ALL' | 'SAP' | 'HYBRID' | 'NON_SAP')}
            style={{ fontSize: '0.85rem' }}
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
            style={{ fontSize: '0.85rem' }}
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
            style={{ fontSize: '0.85rem' }}
          >
            <option value="match">Sort: Highest Match Score</option>
            <option value="effort">Sort: Lowest Effort Estimate</option>
            <option value="demand">Sort: Market Demand</option>
            <option value="title">Sort: Role Title (A–Z)</option>
          </select>
        </div>
      </div>

      {/* Results Count Strip */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', fontSize: '0.875rem', color: '#5B6876' }}>
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
            style={{ color: '#0A6ED1', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
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
          gap: '1.75rem',
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
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
                      color: score >= 70 ? '#107E3E' : score >= 50 ? '#0A6ED1' : '#E9730C'
                    }}
                  >
                    {score}%
                  </div>
                  <span
                    style={{
                      fontSize: '0.72rem',
                      color: isRealProfileReviewed ? '#107E3E' : '#8492A0',
                      textTransform: 'uppercase',
                      fontWeight: isRealProfileReviewed ? 600 : 400
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
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        color: isComparing ? '#633CA3' : '#5B6876',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        padding: '0.35rem 0.65rem',
                        borderRadius: '4px',
                        backgroundColor: isComparing ? '#F2ECFA' : 'transparent',
                        border: `1px solid ${isComparing ? '#DECFF2' : '#D9E1E8'}`,
                        cursor: 'pointer'
                      }}
                    >
                      <ColumnsIcon size={14} />
                      {isComparing ? 'Comparing ✓' : 'Compare'}
                    </button>

                    <button
                      onClick={() => setExplainingRole(role)}
                      style={{
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        color: '#0A6ED1',
                        backgroundColor: '#EBF3FB',
                        border: '1px solid #C4D5EA',
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

              <p style={{ color: '#5B6876', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1.25rem', minHeight: '54px' }}>
                {role.summary}
              </p>

              <div style={{ backgroundColor: '#FAFBFD', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', border: '1px solid #EDF1F5' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#5B6876', marginBottom: '0.25rem' }}>
                  <span>Planning Bridge Effort:</span>
                  <strong style={{ color: '#001A47' }}>~{role.learningHoursEstimate} hrs ({role.typicalPivotTimeline})</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#5B6876' }}>
                  <span>Market Compensation:</span>
                  <strong style={{ color: '#107E3E' }}>{role.averageSalaryUsd}</strong>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
                  <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#001A47', textTransform: 'uppercase' }}>
                    Required Competencies:
                  </span>
                  {isRealProfileReviewed && (
                    <span style={{ fontSize: '0.75rem', color: '#107E3E', fontWeight: 600 }}>
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
                <div style={{ marginTop: '0.75rem', fontSize: '0.78rem', color: '#A05000', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                  <AlertTriangleIcon size={14} color="#E9730C" />
                  <span>Notice: {backendMatch.missingMandatorySkills.length} essential mandatory requirement(s) missing.</span>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {sortedRoles.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px dashed #D9E1E8' }}>
          <h3 style={{ color: '#001A47', marginBottom: '0.5rem' }}>No Career Roles Match Your Filters</h3>
          <p style={{ color: '#5B6876', marginBottom: '1rem' }}>Try clearing your search query or adjusting your ecosystem and career family filters.</p>
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
          <div style={{ fontSize: '0.9rem', color: '#222B35', lineHeight: 1.6 }}>
            <div style={{ backgroundColor: '#FAFBFD', padding: '1rem', borderRadius: '6px', border: '1px solid #EDF1F5', marginBottom: '1.25rem' }}>
              <div style={{ fontWeight: 600, color: '#001A47', marginBottom: '0.25rem' }}>
                Mathematical Match Formula:
              </div>
              <code style={{ fontSize: '0.82rem', color: '#0A6ED1' }}>
                Match Score = 100 × (sum(requirement_weight × match_factor) / sum(weights))
              </code>
              <p style={{ fontSize: '0.8rem', color: '#5B6876', marginTop: '0.5rem', marginBottom: 0 }}>
                Derived deterministically by comparing your confirmed competencies and declared proficiencies against the published role requirements. Full match = 1.0; Partial proficiency = 0.4–0.75; Missing or rejected = 0.0.
              </p>
            </div>

            <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: '#001A47', marginBottom: '0.5rem' }}>
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
                      border: `1px solid ${isMatched ? '#B8E3C8' : '#EDF1F5'}`,
                      backgroundColor: isMatched ? '#F3FAF6' : '#FFFFFF'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <strong style={{ color: '#001A47' }}>{req.skillName}</strong>
                      <Badge variant={isMatched ? 'success' : 'neutral'} size="sm">
                        {isMatched ? '100% Match Factor' : '0.0 (Missing)'}
                      </Badge>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#5B6876', marginTop: '0.25rem' }}>
                      Weight: {req.weight} • Minimum Level: {req.minimumLevel} • {req.isMandatory ? 'Mandatory Requirement' : 'Preferred Skill'}
                    </div>
                    {req.rationale && (
                      <div style={{ fontSize: '0.78rem', color: '#8492A0', marginTop: '0.2rem', fontStyle: 'italic' }}>
                        Rationale: {req.rationale}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div style={{ padding: '0.75rem', backgroundColor: '#FFF4E5', border: '1px solid #FFD099', borderRadius: '6px', fontSize: '0.8rem', color: '#A05000', marginBottom: '1.25rem' }}>
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
