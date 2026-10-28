import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { AdvisoryNotice } from '../components/common/AdvisoryNotice';
import { ArrowRightIcon, BookOpenIcon, AwardIcon, BriefcaseIcon } from '../components/common/Icons';
import { DEMO_CAREER_ROLES } from '../demo/demoCareers';
import { useCareerContext } from '../context/CareerContext';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { setTargetRoleSlug } = useCareerContext();

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1280px', margin: '0 auto' }}>
      {/* Hero Section */}
      <section
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #D9E1E8',
          borderRadius: '12px',
          padding: '3.5rem 3rem',
          boxShadow: '0 4px 16px rgba(0, 26, 71, 0.05)',
          marginBottom: '2.5rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: '350px',
            height: '100%',
            background: 'radial-gradient(circle at top right, rgba(10, 110, 209, 0.08), transparent 70%)',
            pointerEvents: 'none'
          }}
        />

        <div style={{ maxWidth: '820px', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <Badge variant="info">SAP HACKFEST 2026</Badge>
            <Badge variant="neutral">AI-Assisted Career Transitions</Badge>
          </div>

          <h1
            style={{
              fontSize: '2.8rem',
              fontWeight: 800,
              color: '#001A47',
              lineHeight: 1.15,
              letterSpacing: '-0.02em',
              marginBottom: '1.25rem'
            }}
          >
            Translate Your Experience Into SAP Enterprise Careers
          </h1>

          <p
            style={{
              fontSize: '1.2rem',
              color: '#5B6876',
              lineHeight: 1.6,
              marginBottom: '2.25rem'
            }}
          >
            Career Orchestrator bridges your transferable skills and existing industry background into high-demand
            SAP and enterprise technology careers. Experience explainable career recommendations, human-guided
            skill verification, and curated learning roadmaps.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/profile')}
              icon={<ArrowRightIcon size={18} />}
              iconPosition="right"
            >
              Begin Career Discovery
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/careers')}
              icon={<BriefcaseIcon size={18} />}
            >
              Explore Career Paths
            </Button>
          </div>
        </div>
      </section>

      {/* Advisory Banner */}
      <AdvisoryNotice
        style={{ marginBottom: '2.5rem' }}
        message="Career Orchestrator provides advisory intelligence based on competencies you inspect and verify. Recommendations illustrate transferable skill overlap and structured learning pathways; they do not predict or guarantee employment outcomes."
      />

      {/* How the Platform Works (4-Step Workflow) */}
      <section style={{ marginBottom: '3.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#001A47', marginBottom: '0.5rem' }}>
            How Career Orchestrator Works
          </h2>
          <p style={{ color: '#5B6876', fontSize: '1.05rem', maxWidth: '650px', margin: '0 auto' }}>
            A disciplined, human-in-the-loop progression designed for maximum transparency and career autonomy.
          </p>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
            gap: '1.5rem'
          }}
        >
          <Card
            hoverable
            title="1. Intake & Extraction"
            subtitle="Upload resume or enter work history"
          >
            <p style={{ color: '#5B6876', fontSize: '0.92rem', lineHeight: 1.5 }}>
              Upload your PDF/DOCX or input your responsibilities. The system identifies candidate competencies across business, technical, and soft skill domains.
            </p>
          </Card>

          <Card
            hoverable
            title="2. Human-in-the-Loop Review"
            subtitle="Verify, adjust, and confirm skills"
          >
            <p style={{ color: '#5B6876', fontSize: '0.92rem', lineHeight: 1.5 }}>
              You maintain total control. Review AI-suggested capabilities, calibrate your proficiency level, and confirm transferable skills before recommendations run.
            </p>
          </Card>

          <Card
            hoverable
            title="3. Explainable Role Matching"
            subtitle="Understand transferable overlaps"
          >
            <p style={{ color: '#5B6876', fontSize: '0.92rem', lineHeight: 1.5 }}>
              Compare your confirmed profile against active SAP & tech career requirements. View exact skill overlaps, transferable strengths, and critical gaps.
            </p>
          </Card>

          <Card
            hoverable
            title="4. Verified Roadmaps"
            subtitle="SAP Learning Hub & Project Evidence"
          >
            <p style={{ color: '#5B6876', fontSize: '0.92rem', lineHeight: 1.5 }}>
              Receive targeted course journeys mapped directly from SAP Learning Hub Student Edition and complete scenario-based portfolio projects.
            </p>
          </Card>
        </div>
      </section>

      {/* Featured Pathways Preview */}
      <section style={{ marginBottom: '3.5rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '1.5rem'
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#001A47', marginBottom: '0.25rem' }}>
              Featured Target Career Pathways
            </h2>
            <p style={{ color: '#5B6876', fontSize: '0.95rem' }}>
              Explore high-demand career roles in the SAP ecosystem and enterprise cloud landscape.
            </p>
          </div>
          <Button variant="ghost" onClick={() => navigate('/careers')}>
            View All {DEMO_CAREER_ROLES.length} Roles →
          </Button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '1.5rem'
          }}
        >
          {DEMO_CAREER_ROLES.slice(0, 3).map((role) => (
            <Card
              key={role.id}
              hoverable
              title={role.title}
              subtitle={role.track.replace(/_/g, ' ')}
              action={
                <Badge variant={role.marketDemand === 'Critical' ? 'critical' : 'info'}>
                  {role.marketDemand} Demand
                </Badge>
              }
              footer={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.85rem', color: '#5B6876' }}>
                    Est. Pivot: <strong>{role.typicalPivotTimeline}</strong>
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setTargetRoleSlug(role.slug);
                      navigate('/career-gap');
                    }}
                  >
                    Analyze Gaps →
                  </Button>
                </div>
              }
            >
              <p style={{ color: '#5B6876', fontSize: '0.9rem', marginBottom: '1rem', minHeight: '54px' }}>
                {role.summary}
              </p>
              <div>
                <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#001A47', marginBottom: '0.4rem', textTransform: 'uppercase' }}>
                  Core Competencies:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {role.requiredSkills.slice(0, 3).map((req, i) => (
                    <Badge key={i} variant="neutral" size="sm">
                      {req.skillName}
                    </Badge>
                  ))}
                  {role.requiredSkills.length > 3 && (
                    <Badge variant="outline" size="sm">
                      +{role.requiredSkills.length - 3} more
                    </Badge>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Two Pillars: Evidence Matching & Verified Learning */}
      <section
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))',
          gap: '2rem',
          marginBottom: '2rem'
        }}
      >
        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #D9E1E8',
            borderRadius: '8px',
            padding: '2rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ color: '#0A6ED1' }}>
              <AwardIcon size={24} />
            </div>
            <h3 style={{ fontSize: '1.3rem', color: '#001A47', fontWeight: 700 }}>
              Evidence-Based Skill Matching
            </h3>
          </div>
          <p style={{ color: '#5B6876', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
            Instead of opaque black-box recommendations, our engine applies a weighted overlap calculation. Transferable abilities (e.g. financial reporting, database querying, or stakeholder communication) are explicitly credited toward SAP role prerequisites.
          </p>
          <Button variant="outline" size="sm" onClick={() => navigate('/skills-review')}>
            Try Interactive Skill Confirmation →
          </Button>
        </div>

        <div
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #D9E1E8',
            borderRadius: '8px',
            padding: '2rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{ color: '#107E3E' }}>
              <BookOpenIcon size={24} />
            </div>
            <h3 style={{ fontSize: '1.3rem', color: '#001A47', fontWeight: 700 }}>
              Curated SAP Learning Hub Pathways
            </h3>
          </div>
          <p style={{ color: '#5B6876', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '1.25rem' }}>
            Connect directly with verified courses from SAP Learning Hub Student Edition, openSAP, and hands-on scenarios. Each module corresponds to specific skill deltas, minimizing redundant training and focusing on your exact gap areas.
          </p>
          <Button variant="outline" size="sm" onClick={() => navigate('/learning')}>
            Explore Learning Catalog →
          </Button>
        </div>
      </section>
    </div>
  );
};
