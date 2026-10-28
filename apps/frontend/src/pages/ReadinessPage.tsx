import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { StepIndicator } from '../components/common/StepIndicator';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { ProgressBar } from '../components/common/ProgressBar';
import { AdvisoryNotice } from '../components/common/AdvisoryNotice';
import { DemoDataBanner } from '../components/common/DemoDataBanner';
import { ArrowLeftIcon, BriefcaseIcon } from '../components/common/Icons';
import { DEMO_LEARNING_MODULES } from '../demo/demoLearning';
import { DEMO_PROJECTS } from '../demo/demoProjects';
import { useCareerContext } from '../context/CareerContext';

export const ReadinessPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    targetRole,
    completedLearningIds,
    projectSubmissions
  } = useCareerContext();

  const relevantModules = DEMO_LEARNING_MODULES.filter(
    (m) => m.roleSlug === targetRole.slug || m.roleSlug === 'sap-s4hana-finance-consultant'
  );
  const relevantProjects = DEMO_PROJECTS.filter(
    (p) => p.roleSlug === targetRole.slug || p.roleSlug === 'sap-s4hana-finance-consultant'
  );

  const learningCompletionPct =
    relevantModules.length > 0
      ? (relevantModules.filter((m) => completedLearningIds.includes(m.id)).length /
          relevantModules.length) *
        100
      : 0;

  const projectSubmissionCount = relevantProjects.filter(
    (p) => !!projectSubmissions[p.id]
  ).length;

  const projectCompletionPct =
    relevantProjects.length > 0
      ? (projectSubmissionCount / relevantProjects.length) * 100
      : 0;

  // Composite Readiness Formula (advisory model)
  // 50% baseline transferable match + 30% course completion + 20% project evidence
  const compositeReadinessIndex = Math.min(
    100,
    Math.round(
      targetRole.matchScoreDemo * 0.5 +
        learningCompletionPct * 0.3 +
        projectCompletionPct * 0.2
    )
  );

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1280px', margin: '0 auto' }}>
      <Breadcrumbs
        items={[
          { label: 'Projects', path: '/projects' },
          { label: 'Career Readiness Dashboard' }
        ]}
      />
      <StepIndicator currentStepId="readiness" />

      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#001A47', marginBottom: '0.5rem' }}>
          Career Transition Readiness Dashboard
        </h1>
        <p style={{ color: '#5B6876', fontSize: '1.05rem', maxWidth: '800px' }}>
          Track your educational readiness and portfolio milestones toward becoming a <strong>{targetRole.title}</strong>.
        </p>
      </div>

      <DemoDataBanner
        featureName="Readiness Metric Model"
        backendStateText="The readiness index below models how verified course completions, hands-on evidence, and confirmed skills aggregate into an explainable score."
      />

      <AdvisoryNotice
        style={{ marginBottom: '2rem' }}
        title="Distinction Between Learning Readiness and Employability"
        message="The Career Readiness Metric measures curriculum completion and hands-on portfolio milestones. It demonstrates subject matter competence and preparedness for junior or transition roles; it is not a commercial employment guarantee or hiring prediction."
      />

      {/* Hero Readiness Dial & Key Metrics */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '2rem',
          marginBottom: '2.5rem'
        }}
      >
        {/* Main Composite Score Card */}
        <Card
          title="Role Transition Readiness Index"
          subtitle={`Mathematical aggregate for ${targetRole.title}`}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', padding: '1rem 0' }}>
            <div
              style={{
                width: '120px',
                height: '120px',
                borderRadius: '50%',
                border: '8px solid #0A6ED1',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                backgroundColor: '#FAFBFD'
              }}
            >
              <span style={{ fontSize: '2.2rem', fontWeight: 800, color: '#001A47', lineHeight: 1 }}>
                {compositeReadinessIndex}%
              </span>
              <span style={{ fontSize: '0.7rem', color: '#8492A0', textTransform: 'uppercase', marginTop: '4px' }}>
                Prepared
              </span>
            </div>

            <div style={{ fontSize: '0.9rem', color: '#5B6876', lineHeight: 1.6 }}>
              <p style={{ marginBottom: '0.5rem' }}>
                Your readiness index reflects a combination of your <strong>transferable foundation</strong> ({targetRole.matchScoreDemo}%), verified <strong>SAP course completion</strong> ({Math.round(learningCompletionPct)}%), and <strong>practical evidence submissions</strong> ({projectSubmissionCount} logged).
              </p>
              <Badge variant={compositeReadinessIndex >= 70 ? 'success' : 'info'}>
                {compositeReadinessIndex >= 70 ? 'High Transition Readiness' : 'Active Skill Acquisition'}
              </Badge>
            </div>
          </div>
        </Card>

        {/* Milestone Breakdown Bars */}
        <Card title="Pillar Progression Breakdown" subtitle="Components comprising your readiness score">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <ProgressBar
                percentage={targetRole.matchScoreDemo}
                label="1. Transferable Competency Match"
                sublabel="Weight: 50%"
                color="#0A6ED1"
              />
            </div>

            <div>
              <ProgressBar
                percentage={learningCompletionPct}
                label="2. SAP Learning Hub Curriculum"
                sublabel={`${completedLearningIds.length} completed • Weight: 30%`}
                color="#107E3E"
              />
            </div>

            <div>
              <ProgressBar
                percentage={projectCompletionPct}
                label="3. Practical Scenario Deliverables"
                sublabel={`${projectSubmissionCount} of ${relevantProjects.length} submitted • Weight: 20%`}
                color="#633CA3"
              />
            </div>
          </div>
        </Card>
      </div>

      {/* Explanatory Formula Card */}
      <Card
        title="Explainable Scoring Rubric"
        subtitle="How Career Orchestrator calculates your readiness"
        style={{ marginBottom: '2.5rem' }}
      >
        <div style={{ fontSize: '0.92rem', color: '#5B6876', lineHeight: 1.6 }}>
          <p style={{ marginBottom: '1rem' }}>
            To uphold our commitment to <strong>transparent, explainable AI</strong>, the Career Readiness Metric avoids proprietary black-box calculations:
          </p>
          <div
            style={{
              backgroundColor: '#FAFBFD',
              border: '1px solid #EDF1F5',
              padding: '1rem 1.5rem',
              borderRadius: '6px',
              fontFamily: 'monospace',
              fontSize: '0.95rem',
              color: '#001A47',
              marginBottom: '1rem'
            }}
          >
            Readiness Index = (Transferable Competency Match × 0.50) + (SAP Learning Modules Completed × 0.30) + (Practical Projects Verified × 0.20)
          </div>
          <p>
            As you check off completed courses on the Learning Pathway and submit GitHub repositories or configuration runbooks on the Practical Projects page, your composite readiness increases automatically.
          </p>
        </div>
      </Card>

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
        <Button variant="ghost" icon={<ArrowLeftIcon size={16} />} onClick={() => navigate('/projects')}>
          Back to Practical Projects
        </Button>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.9rem', color: '#5B6876' }}>
            Ready to explore verified external market opportunities?
          </span>
          <Button
            variant="primary"
            size="lg"
            icon={<BriefcaseIcon size={18} />}
            iconPosition="right"
            onClick={() => navigate('/jobs')}
          >
            Explore Real Job Opportunities →
          </Button>
        </div>
      </div>
    </div>
  );
};
