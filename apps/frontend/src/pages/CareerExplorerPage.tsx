import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { StepIndicator } from '../components/common/StepIndicator';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { DemoDataBanner } from '../components/common/DemoDataBanner';
import { SearchIcon, ColumnsIcon, ArrowRightIcon } from '../components/common/Icons';
import { DEMO_CAREER_ROLES, ExtendedCareerRole } from '../demo/demoCareers';
import { useCareerContext } from '../context/CareerContext';

export const CareerExplorerPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    targetRoleSlug,
    setTargetRoleSlug,
    comparisonRoleSlugs,
    toggleComparisonRole
  } = useCareerContext();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedTrack, setSelectedTrack] = useState<string>('ALL');
  const [sapFilter, setSapFilter] = useState<'ALL' | 'SAP_ONLY' | 'NON_SAP'>('ALL');

  const filteredRoles = DEMO_CAREER_ROLES.filter((role) => {
    const matchesSearch =
      role.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.summary.toLowerCase().includes(searchTerm.toLowerCase()) ||
      role.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesTrack = selectedTrack === 'ALL' || role.track === selectedTrack;

    const matchesSap =
      sapFilter === 'ALL' ||
      (sapFilter === 'SAP_ONLY' && role.isSapEcosystem) ||
      (sapFilter === 'NON_SAP' && !role.isSapEcosystem);

    return matchesSearch && matchesTrack && matchesSap;
  });

  const handleSelectTarget = (role: ExtendedCareerRole) => {
    setTargetRoleSlug(role.slug);
    navigate('/career-gap');
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
            Career Role Explorer
          </h1>
          <p style={{ color: '#5B6876', fontSize: '1.05rem', maxWidth: '800px' }}>
            Browse through active SAP pathways and adjacent enterprise roles. Inspect required competencies, compare options, and choose your target pivot.
          </p>
        </div>

        {/* Comparison Dock Pill */}
        {comparisonRoleSlugs.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Badge variant="purple" size="md">
              {comparisonRoleSlugs.length} / 3 Roles Selected for Comparison
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

      <DemoDataBanner
        featureName="Career Catalogue & Match Index"
        backendStateText="Calculated match indices displayed on role cards are illustrative demonstrations based on transferable competency overlap. The mathematical matcher runs in Phase 3."
      />

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
        <div style={{ position: 'relative', flex: '1 1 300px' }}>
          <div style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#8492A0' }}>
            <SearchIcon size={16} />
          </div>
          <input
            type="text"
            placeholder="Search roles by title, keyword (e.g. S/4HANA, RAP, SQL, Finance)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '100%', paddingLeft: '2.4rem' }}
          />
        </div>

        {/* Track Filter */}
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <select
            value={selectedTrack}
            onChange={(e) => setSelectedTrack(e.target.value)}
            style={{ fontSize: '0.85rem' }}
          >
            <option value="ALL">All Specialization Tracks</option>
            <option value="SAP_FUNCTIONAL_CONSULTANT">SAP Functional Consultant</option>
            <option value="SAP_TECHNICAL_DEVELOPER">SAP Technical Developer</option>
            <option value="SAP_INTEGRATION_ARCHITECT">SAP Integration Architect</option>
            <option value="ENTERPRISE_ANALYST">Enterprise Business Analyst</option>
            <option value="HYBRID_CROSS_ERP">Hybrid / Cross-ERP</option>
          </select>

          {/* Ecosystem Filter */}
          <select
            value={sapFilter}
            onChange={(e) => setSapFilter(e.target.value as any)}
            style={{ fontSize: '0.85rem' }}
          >
            <option value="ALL">All Ecosystems</option>
            <option value="SAP_ONLY">SAP Ecosystem Only</option>
            <option value="NON_SAP">Non-SAP Adjacent</option>
          </select>
        </div>
      </div>

      {/* Career Roles Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
          gap: '1.75rem',
          marginBottom: '2.5rem'
        }}
      >
        {filteredRoles.map((role) => {
          const isTarget = role.slug === targetRoleSlug;
          const isComparing = comparisonRoleSlugs.includes(role.slug);

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
              subtitle={role.track.replace(/_/g, ' ')}
              action={
                <div style={{ textAlign: 'right' }}>
                  <div
                    style={{
                      fontSize: '1.3rem',
                      fontWeight: 800,
                      color: role.matchScoreDemo >= 70 ? '#107E3E' : role.matchScoreDemo >= 55 ? '#0A6ED1' : '#E9730C'
                    }}
                  >
                    {role.matchScoreDemo}%
                  </div>
                  <span style={{ fontSize: '0.72rem', color: '#8492A0', textTransform: 'uppercase' }}>Match Index</span>
                </div>
              }
              footer={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '0.5rem' }}>
                  <button
                    onClick={() => toggleComparisonRole(role.slug)}
                    style={{
                      fontSize: '0.82rem',
                      fontWeight: 600,
                      color: isComparing ? '#633CA3' : '#5B6876',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem',
                      padding: '0.3rem 0.6rem',
                      borderRadius: '4px',
                      backgroundColor: isComparing ? '#F2ECFA' : 'transparent',
                      border: `1px solid ${isComparing ? '#DECFF2' : '#D9E1E8'}`,
                      cursor: 'pointer'
                    }}
                  >
                    <ColumnsIcon size={14} />
                    {isComparing ? 'Comparing ✓' : 'Add to Compare'}
                  </button>

                  <Button
                    variant={isTarget ? 'secondary' : 'primary'}
                    size="sm"
                    icon={<ArrowRightIcon size={14} />}
                    iconPosition="right"
                    onClick={() => handleSelectTarget(role)}
                  >
                    {isTarget ? 'View Skill Gaps' : 'Select Target Role'}
                  </Button>
                </div>
              }
            >
              <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
                <Badge variant={role.isSapEcosystem ? 'info' : 'neutral'} size="sm">
                  {role.isSapEcosystem ? 'SAP Ecosystem' : 'Adjacent Enterprise'}
                </Badge>
                <Badge variant={role.marketDemand === 'Critical' ? 'critical' : 'warning'} size="sm">
                  {role.marketDemand} Demand
                </Badge>
              </div>

              <p style={{ color: '#5B6876', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1.25rem', minHeight: '60px' }}>
                {role.summary}
              </p>

              <div style={{ backgroundColor: '#FAFBFD', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', border: '1px solid #EDF1F5' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#5B6876', marginBottom: '0.25rem' }}>
                  <span>Estimated Bridge Effort:</span>
                  <strong style={{ color: '#001A47' }}>~{role.learningHoursEstimate} hrs ({role.typicalPivotTimeline})</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: '#5B6876' }}>
                  <span>Market Compensation:</span>
                  <strong style={{ color: '#107E3E' }}>{role.averageSalaryUsd}</strong>
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#001A47', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                  Core Required Competencies:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {role.requiredSkills.map((req, i) => (
                    <Badge key={i} variant="outline" size="sm">
                      {req.skillName}
                    </Badge>
                  ))}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {filteredRoles.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px dashed #D9E1E8' }}>
          <h3 style={{ color: '#001A47', marginBottom: '0.5rem' }}>No Career Roles Match Your Filters</h3>
          <p style={{ color: '#5B6876', marginBottom: '1rem' }}>Try clearing your search term or selecting "All Specialization Tracks".</p>
          <Button variant="outline" size="sm" onClick={() => { setSearchTerm(''); setSelectedTrack('ALL'); setSapFilter('ALL'); }}>
            Reset All Filters
          </Button>
        </div>
      )}
    </div>
  );
};
