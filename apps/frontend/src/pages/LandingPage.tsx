import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/common/Button';
import { Card } from '../components/common/Card';
import { Badge } from '../components/common/Badge';
import { AdvisoryNotice } from '../components/common/AdvisoryNotice';
import {
  ArrowRightIcon,
  AwardIcon,
  BriefcaseIcon,
  CheckIcon,
  ColumnsIcon
} from '../components/common/Icons';
import { DEMO_CAREER_ROLES } from '../demo/demoCareers';
import { useCareerContext } from '../context/CareerContext';
import { enterpriseTheme } from '../theme/tokens';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { setTargetRoleSlug, loadDemoBaseline } = useCareerContext();
  const [activePipelineStep, setActivePipelineStep] = useState<number>(0);

  const pipelineStages = [
    {
      title: '1. Ingest Experience',
      badge: 'Unstructured Data',
      desc: 'Upload resume or enter work history. NLP parses responsibilities without discarding nuances.',
      example: 'Alex Vance: 4.5 yrs Senior Financial Analyst (GL reconciliation, variance audit, SQL queries)'
    },
    {
      title: '2. Career DNA',
      badge: 'Human-in-the-Loop',
      desc: 'Inspect and confirm competencies. Mark verified proficiencies and transferable capabilities.',
      example: 'Financial Accounting (Advanced) + SQL Data Extraction (Intermediate) + Internal Audit (Advanced)'
    },
    {
      title: '3. Role Alignment',
      badge: 'Explainable Overlap',
      desc: 'Match against SAP enterprise architectures (S/4HANA Finance, BTP, Supply Chain, Analytics).',
      example: 'Top Alignment: SAP S/4HANA Finance Consultant (76% Transferable Overlap)'
    },
    {
      title: '4. Targeted Upskilling',
      badge: 'SAP Learning Hub',
      desc: 'Bridge missing competencies with verified courses from SAP Learning Hub & openSAP.',
      example: 'TS4F01 (Financial Accounting in SAP S/4HANA) + TS4F02 (Management Accounting)'
    },
    {
      title: '5. Practical Evidence',
      badge: 'Audited Rubrics',
      desc: 'Execute scenario projects in sandboxes with explicit evaluation rubrics to verify readiness.',
      example: 'Project: S/4HANA General Ledger Migration & Period-End Closing Architecture'
    }
  ];

  const handleLaunchDemo = () => {
    loadDemoBaseline();
    navigate('/dashboard');
  };

  return (
    <div style={{ padding: '2.5rem 1.5rem', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, #001A47 0%, #08255A 60%, #0A6ED1 100%)',
          borderRadius: enterpriseTheme.radii.lg,
          padding: '3.75rem 3rem',
          boxShadow: enterpriseTheme.shadows.elevated,
          marginBottom: '2.5rem',
          position: 'relative',
          overflow: 'hidden',
          color: '#FFFFFF'
        }}
      >
        {/* Subtle decorative grid overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage:
              'radial-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1px), radial-gradient(rgba(255, 255, 255, 0.06) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
            backgroundPosition: '0 0, 16px 16px',
            pointerEvents: 'none',
            opacity: 0.7
          }}
        />

        <div style={{ maxWidth: '840px', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            <span
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                color: '#FFFFFF',
                padding: '0.25rem 0.65rem',
                borderRadius: '4px',
                fontSize: '0.75rem',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                border: '1px solid rgba(255, 255, 255, 0.25)'
              }}
            >
              SAP HACKFEST 2026
            </span>
            <span
              style={{
                backgroundColor: 'rgba(10, 110, 209, 0.35)',
                color: '#DCEBFA',
                padding: '0.25rem 0.65rem',
                borderRadius: '4px',
                fontSize: '0.75rem',
                fontWeight: 600,
                border: '1px solid rgba(185, 213, 245, 0.3)'
              }}
            >
              Explainable AI • Human-in-the-Loop Career Intelligence
            </span>
          </div>

          <h1
            style={{
              fontSize: '2.75rem',
              fontWeight: 800,
              color: '#FFFFFF',
              lineHeight: 1.15,
              letterSpacing: '-0.025em',
              marginBottom: '1.25rem'
            }}
          >
            Transform Your Existing Experience Into Your Next SAP Enterprise Career
          </h1>

          <p
            style={{
              fontSize: '1.15rem',
              color: '#D4E2F2',
              lineHeight: 1.6,
              marginBottom: '2.25rem',
              maxWidth: '740px'
            }}
          >
            Career Orchestrator bridges your transferable skills and domain background into high-demand SAP and enterprise cloud roles. Gain mathematically transparent career overlap scores, human-guided competence verification, and curated learning roadmaps.
          </p>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', alignItems: 'center' }}>
            <Button
              variant="primary"
              size="lg"
              onClick={handleLaunchDemo}
              icon={<AwardIcon size={18} />}
              style={{
                backgroundColor: '#FFFFFF',
                color: '#001A47',
                border: '1px solid #FFFFFF',
                boxShadow: '0 4px 14px rgba(0, 0, 0, 0.25)',
                fontWeight: 700
              }}
            >
              Explore Alex Vance Demo
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate('/profile')}
              icon={<ArrowRightIcon size={18} />}
              iconPosition="right"
              style={{
                color: '#FFFFFF',
                borderColor: 'rgba(255, 255, 255, 0.6)',
                backgroundColor: 'rgba(255, 255, 255, 0.08)'
              }}
            >
              Begin Candidate Intake
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={() => navigate('/careers')}
              icon={<BriefcaseIcon size={18} />}
              style={{
                color: '#E0EEFC'
              }}
            >
              Browse 14 SAP Roles
            </Button>
          </div>
        </div>
      </section>

      {/* Advisory Banner */}
      <AdvisoryNotice
        style={{ marginBottom: '2.5rem' }}
        message="Career Orchestrator provides advisory intelligence based on competencies you inspect and verify. Recommendations illustrate transferable skill overlap and structured learning pathways; they do not predict or guarantee employment outcomes."
      />

      {/* Interactive Career Transition Pipeline Visualizer */}
      <section
        style={{
          backgroundColor: '#FFFFFF',
          border: `1px solid ${enterpriseTheme.colors.surfaceBorder}`,
          borderRadius: enterpriseTheme.radii.lg,
          padding: '2.25rem',
          boxShadow: enterpriseTheme.shadows.card,
          marginBottom: '3rem'
        }}
      >
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
            <Badge variant="purple">Transition Pipeline Architecture</Badge>
            <span style={{ fontSize: '0.8rem', color: enterpriseTheme.colors.textMuted }}>• 5-Stage Transformation</span>
          </div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: enterpriseTheme.colors.textPrimary }}>
            How Career Orchestrator Unlocks Your Enterprise Value
          </h2>
          <p style={{ color: enterpriseTheme.colors.textSecondary, fontSize: '0.92rem' }}>
            Click through each pipeline milestone to see how unstructured resumes convert into audited readiness.
          </p>
        </div>

        {/* Pipeline Stepper Selector */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '0.5rem',
            marginBottom: '1.5rem'
          }}
        >
          {pipelineStages.map((stage, idx) => {
            const isActive = idx === activePipelineStep;
            return (
              <button
                key={idx}
                onClick={() => setActivePipelineStep(idx)}
                style={{
                  textAlign: 'left',
                  padding: '0.85rem 1rem',
                  borderRadius: enterpriseTheme.radii.sm,
                  border: `1px solid ${isActive ? enterpriseTheme.colors.primary : enterpriseTheme.colors.surfaceBorder}`,
                  backgroundColor: isActive ? enterpriseTheme.colors.primarySubtle : '#FFFFFF',
                  cursor: 'pointer',
                  transition: 'all 0.15s ease'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: isActive ? enterpriseTheme.colors.primary : enterpriseTheme.colors.textMuted }}>
                    STAGE 0{idx + 1}
                  </span>
                  {isActive && <CheckIcon size={12} color={enterpriseTheme.colors.primary} />}
                </div>
                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: isActive ? enterpriseTheme.colors.primary : enterpriseTheme.colors.textPrimary }}>
                  {stage.title.split('. ')[1]}
                </div>
              </button>
            );
          })}
        </div>

        {/* Selected Stage Detail Display */}
        <div
          style={{
            backgroundColor: enterpriseTheme.colors.canvas,
            border: `1px solid ${enterpriseTheme.colors.surfaceBorder}`,
            borderRadius: enterpriseTheme.radii.md,
            padding: '1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.75rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: enterpriseTheme.colors.textPrimary }}>
              {pipelineStages[activePipelineStep].title}
            </h3>
            <Badge variant="info">{pipelineStages[activePipelineStep].badge}</Badge>
          </div>
          <p style={{ color: enterpriseTheme.colors.textSecondary, fontSize: '0.92rem', lineHeight: 1.5 }}>
            {pipelineStages[activePipelineStep].desc}
          </p>
          <div
            style={{
              marginTop: '0.35rem',
              padding: '0.75rem 1rem',
              backgroundColor: '#FFFFFF',
              border: `1px solid ${enterpriseTheme.colors.surfaceBorder}`,
              borderRadius: '4px',
              fontFamily: 'monospace',
              fontSize: '0.82rem',
              color: enterpriseTheme.colors.textPrimary
            }}
          >
            <span style={{ color: enterpriseTheme.colors.textMuted, fontWeight: 600 }}>LIVE DEMO TRACE: </span>
            {pipelineStages[activePipelineStep].example}
          </div>
        </div>
      </section>

      {/* 4 Pillars of Transparency */}
      <section style={{ marginBottom: '3.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#001A47', marginBottom: '0.5rem' }}>
            Enterprise Design Principles
          </h2>
          <p style={{ color: '#5B6876', fontSize: '1.02rem', maxWidth: '650px', margin: '0 auto' }}>
            A disciplined platform built to eliminate black-box recommendations and protect candidate autonomy.
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
            title="1. Human-in-the-Loop Review"
            subtitle="Full verification control"
          >
            <p style={{ color: '#5B6876', fontSize: '0.9rem', lineHeight: 1.5 }}>
              AI extracts candidate competencies without making unverified assumptions. You explicitly inspect, adjust proficiencies, and confirm each skill before role matching runs.
            </p>
          </Card>

          <Card
            hoverable
            title="2. Explainable Matching"
            subtitle="Clear overlap math"
          >
            <p style={{ color: '#5B6876', fontSize: '0.9rem', lineHeight: 1.5 }}>
              Every career match breaks down into transferable competencies, mandatory core requirements, and preferred differentiators with transparent percentage contributions.
            </p>
          </Card>

          <Card
            hoverable
            title="3. Verified SAP Pathways"
            subtitle="Curated official curricula"
          >
            <p style={{ color: '#5B6876', fontSize: '0.9rem', lineHeight: 1.5 }}>
              Targeted modules linked directly to openSAP and SAP Learning Hub courses (TS4F01, BTP100, ACT100) mapped to specific competence deltas.
            </p>
          </Card>

          <Card
            hoverable
            title="4. Audited Scenario Evidence"
            subtitle="Rubric-based assessment"
          >
            <p style={{ color: '#5B6876', fontSize: '0.9rem', lineHeight: 1.5 }}>
              Hands-on enterprise projects evaluate candidate deliverables using catalog-locked rubrics, simulated external reviews, and transparent scoring dimensions.
            </p>
          </Card>
        </div>
      </section>

      {/* Featured Target Career Pathways */}
      <section style={{ marginBottom: '3.5rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
            marginBottom: '1.5rem',
            flexWrap: 'wrap',
            gap: '1rem'
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.8rem', fontWeight: 700, color: '#001A47', marginBottom: '0.25rem' }}>
              High-Demand SAP Enterprise Roles
            </h2>
            <p style={{ color: '#5B6876', fontSize: '0.95rem' }}>
              Explore certified enterprise tracks across S/4HANA Finance, BTP Development, Supply Chain, and Cloud Integration.
            </p>
          </div>
          <Button variant="ghost" onClick={() => navigate('/careers')} icon={<ColumnsIcon size={16} />}>
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
              <p style={{ color: '#5B6876', fontSize: '0.9rem', marginBottom: '1rem', minHeight: '52px' }}>
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

      {/* Ready to Experience Transition Banner */}
      <section
        style={{
          backgroundColor: '#FFFFFF',
          border: `1px solid ${enterpriseTheme.colors.surfaceBorder}`,
          borderRadius: enterpriseTheme.radii.lg,
          padding: '2.5rem',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1.5rem',
          boxShadow: enterpriseTheme.shadows.card
        }}
      >
        <div style={{ maxWidth: '640px' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 700, color: enterpriseTheme.colors.textPrimary, marginBottom: '0.4rem' }}>
            Ready to Explore Your Career Transition?
          </h3>
          <p style={{ color: enterpriseTheme.colors.textSecondary, fontSize: '0.95rem', lineHeight: 1.5 }}>
            Load the Alex Vance baseline to explore an active session, or upload your own resume for an instant transferable skill audit.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Button variant="primary" size="lg" onClick={handleLaunchDemo}>
            Explore Alex Vance Demo
          </Button>
          <Button variant="outline" size="lg" onClick={() => navigate('/profile')}>
            Upload Resume Intake
          </Button>
        </div>
      </section>
    </div>
  );
};
