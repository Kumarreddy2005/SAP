import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { StepIndicator } from '../components/common/StepIndicator';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { ProgressBar } from '../components/common/ProgressBar';
import { DemoDataBanner } from '../components/common/DemoDataBanner';
import { CheckIcon, ExternalLinkIcon, ArrowLeftIcon, AwardIcon } from '../components/common/Icons';
import { DEMO_LEARNING_MODULES } from '../demo/demoLearning';
import { useCareerContext } from '../context/CareerContext';

export const LearningPathwayPage: React.FC = () => {
  const navigate = useNavigate();
  const { targetRole, completedLearningIds, toggleLearningCompletion } = useCareerContext();

  // Filter modules relevant to the target role
  const relevantModules = DEMO_LEARNING_MODULES.filter(
    (m) => m.roleSlug === targetRole.slug || m.roleSlug === 'sap-s4hana-finance-consultant'
  );

  const completedCount = relevantModules.filter((m) =>
    completedLearningIds.includes(m.id)
  ).length;

  const totalHours = relevantModules.reduce((acc, m) => acc + m.estimatedHours, 0);
  const completedHours = relevantModules
    .filter((m) => completedLearningIds.includes(m.id))
    .reduce((acc, m) => acc + m.estimatedHours, 0);

  const progressPercentage = relevantModules.length > 0 ? (completedCount / relevantModules.length) * 100 : 0;

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1280px', margin: '0 auto' }}>
      <Breadcrumbs
        items={[
          { label: 'Gap Analysis', path: '/career-gap' },
          { label: 'Learning Pathway' }
        ]}
      />
      <StepIndicator currentStepId="learning" />

      {/* Header with Overall Progress */}
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
              <Badge variant="info">Curated Curriculum</Badge>
              <Badge variant="purple">SAP Learning Hub Student Edition</Badge>
            </div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#001A47', marginBottom: '0.5rem' }}>
              Personalized Learning Pathway
            </h1>
            <p style={{ color: '#5B6876', fontSize: '1rem', maxWidth: '750px', lineHeight: 1.5 }}>
              Ordered milestones to bridge specific skill deltas for <strong>{targetRole.title}</strong> using verified SAP Learning Hub modules and openSAP content.
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
            <div style={{ fontSize: '2rem', fontWeight: 800, color: '#107E3E' }}>
              {completedHours} / {totalHours} hrs
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#001A47' }}>
              Completed Study Effort
            </div>
            <div style={{ fontSize: '0.78rem', color: '#5B6876', marginTop: '0.2rem' }}>
              {completedCount} of {relevantModules.length} Modules Verified
            </div>
          </div>
        </div>

        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid #EDF1F5' }}>
          <ProgressBar
            percentage={progressPercentage}
            label="Learning Journey Completion"
            sublabel={`${completedCount} of ${relevantModules.length} modules complete`}
            color="#107E3E"
            height={10}
          />
        </div>
      </div>

      <DemoDataBanner
        featureName="Verified Course Catalog & Student Tracking"
        backendStateText="All course codes and learning journey links point to authentic SAP curriculum. Course progress checkmarks update your session state interactively."
      />

      {/* Ordered Milestones List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginBottom: '2.5rem' }}>
        {relevantModules.map((module, idx) => {
          const isComplete = completedLearningIds.includes(module.id);

          return (
            <Card
              key={module.id}
              style={{
                borderColor: isComplete ? '#B8E3C8' : '#D9E1E8',
                backgroundColor: isComplete ? '#FAFDFB' : '#FFFFFF'
              }}
            >
              <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start' }}>
                  {/* Milestone Number Badge */}
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      backgroundColor: isComplete ? '#107E3E' : '#0A6ED1',
                      color: '#FFFFFF',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontWeight: 700,
                      fontSize: '1.1rem',
                      flexShrink: 0
                    }}
                  >
                    {isComplete ? '✓' : idx + 1}
                  </div>

                  <div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                      <Badge variant="outline" size="sm">
                        Code: {module.code}
                      </Badge>
                      <Badge variant={module.provider.includes('Student Edition') ? 'info' : 'purple'} size="sm">
                        {module.provider}
                      </Badge>
                      <Badge variant="neutral" size="sm">
                        {module.level} Level
                      </Badge>
                    </div>

                    <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#001A47', marginBottom: '0.35rem' }}>
                      {module.title}
                    </h3>

                    <div style={{ fontSize: '0.875rem', color: '#0A6ED1', fontWeight: 600, marginBottom: '0.75rem' }}>
                      Target Competency: {module.targetSkill} • ~{module.estimatedHours} hrs study time
                    </div>

                    <div style={{ marginBottom: '1rem' }}>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: '#8492A0', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                        Core Syllabus Topics:
                      </span>
                      <ul style={{ paddingLeft: '1.25rem', fontSize: '0.875rem', color: '#5B6876', lineHeight: 1.5 }}>
                        {module.syllabusPoints.map((point, pIdx) => (
                          <li key={pIdx}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Right Actions */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '180px' }}>
                  <a
                    href={module.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'none' }}
                  >
                    <Button variant="outline" size="sm" fullWidth icon={<ExternalLinkIcon size={14} />}>
                      Open Course
                    </Button>
                  </a>

                  <Button
                    variant={isComplete ? 'secondary' : 'primary'}
                    size="sm"
                    fullWidth
                    icon={isComplete ? <CheckIcon size={14} /> : undefined}
                    onClick={() => toggleLearningCompletion(module.id)}
                  >
                    {isComplete ? 'Mark Incomplete' : 'Mark Completed'}
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
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
        <Button variant="ghost" icon={<ArrowLeftIcon size={16} />} onClick={() => navigate('/career-gap')}>
          Back to Skill Gap Analysis
        </Button>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span style={{ fontSize: '0.9rem', color: '#5B6876' }}>
            Ready to validate skills through hands-on work?
          </span>
          <Button
            variant="primary"
            size="lg"
            icon={<AwardIcon size={18} />}
            iconPosition="right"
            onClick={() => navigate('/projects')}
          >
            Practical Projects & Evidence →
          </Button>
        </div>
      </div>
    </div>
  );
};
