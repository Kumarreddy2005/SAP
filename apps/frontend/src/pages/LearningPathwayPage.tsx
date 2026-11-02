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
  ExternalLinkIcon,
  ArrowLeftIcon,
  AwardIcon,
  InfoIcon
} from '../components/common/Icons';
import { useCareerContext } from '../context/CareerContext';

export const LearningPathwayPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    targetRole,
    currentProfileId,
    completedLearningIds,
    toggleLearningCompletion,
    currentPathway,
    generateLearningPathway,
    isLoadingPathway
  } = useCareerContext();

  useEffect(() => {
    if (targetRole && currentProfileId) {
      generateLearningPathway(targetRole.slug, currentProfileId);
    }
  }, [targetRole, currentProfileId, generateLearningPathway]);

  const milestones = currentPathway?.milestones || [];
  const completedCount = milestones.filter((m) => completedLearningIds.includes(m.milestoneId)).length;
  const totalHours = currentPathway?.totalEstimatedHours || targetRole.learningHoursEstimate;
  const progressPercentage = milestones.length > 0 ? (completedCount / milestones.length) * 100 : 0;

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
              <Badge variant="purple">SAP Learning Hub & openSAP</Badge>
              <Badge variant={targetRole.ecosystem === 'SAP' ? 'info' : 'neutral'}>
                {targetRole.ecosystem === 'SAP' ? 'SAP Ecosystem' : 'Hybrid Enterprise'}
              </Badge>
            </div>
            <h1 style={{ fontSize: '2.2rem', fontWeight: 800, color: '#001A47', marginBottom: '0.5rem' }}>
              Personalized Learning Pathway
            </h1>
            <p style={{ color: '#5B6876', fontSize: '1rem', maxWidth: '750px', lineHeight: 1.5 }}>
              Sequenced milestones dynamically generated to bridge your verified skill gaps for <strong>{targetRole.title}</strong> using authentic SAP Learning Journeys and enterprise courseware.
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
              {completedCount} / {milestones.length || 4}
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#001A47' }}>
              Completed Milestones
            </div>
            <div style={{ fontSize: '0.78rem', color: '#5B6876', marginTop: '0.2rem' }}>
              ~{totalHours} total planning hours
            </div>
          </div>
        </div>

        <div style={{ marginTop: '1.5rem', paddingTop: '1.25rem', borderTop: '1px solid #EDF1F5' }}>
          <ProgressBar
            percentage={progressPercentage}
            label="Learning Journey Completion"
            sublabel={`${completedCount} of ${milestones.length || 4} milestones self-reported as completed in current session`}
            color="#107E3E"
            height={10}
          />
        </div>
      </div>

      {/* Sequencing Rationale Banner */}
      <div
        style={{
          backgroundColor: '#EBF3FB',
          border: '1px solid #C4D5EA',
          borderRadius: '8px',
          padding: '1rem 1.25rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.75rem'
        }}
      >
        <InfoIcon size={20} color="#0A6ED1" />
        <div style={{ fontSize: '0.88rem', color: '#001A47', lineHeight: 1.5 }}>
          <strong>Sequencing Strategy:</strong> {currentPathway?.sequencingRationale || 'Milestones are ordered strictly by functional dependencies: foundational domain processes precede system customizing; core development precedes integration flows; essential gaps are addressed ahead of elective enhancements.'}
          <div style={{ marginTop: '0.35rem', color: '#5B6876', fontSize: '0.82rem' }}>
            Note: All learning links direct to official, publicly verifiable SAP Learning Journeys and open documentation. Progress checkmarks are self-reported by the candidate for active session planning. Opening official course URLs provides curriculum access but does not automatically verify course completion without external SAP LMS credential integration.
          </div>
        </div>
      </div>

      {/* Ordered Milestones List */}
      {isLoadingPathway ? (
        <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #D9E1E8' }}>
          <div style={{ fontSize: '1.2rem', fontWeight: 600, color: '#001A47', marginBottom: '0.5rem' }}>
            Generating Your Personalized Learning Pathway...
          </div>
          <p style={{ color: '#5B6876', fontSize: '0.9rem' }}>
            Sequencing dependencies and mapping verified SAP curriculum to your profile gaps.
          </p>
        </div>
      ) : milestones.length === 0 ? (
        <Card title="No Specific Gaps Found">
          <div style={{ textAlign: 'center', padding: '2.5rem' }}>
            <AwardIcon size={44} color="#107E3E" />
            <h3 style={{ color: '#001A47', marginTop: '1rem', marginBottom: '0.5rem' }}>
              Full Core Competency Coverage!
            </h3>
            <p style={{ color: '#5B6876', maxWidth: '520px', margin: '0 auto 1.5rem', fontSize: '0.95rem' }}>
              Your confirmed competencies meet all published requirements for {targetRole.title}. We recommend undertaking the practical capstone project below to build portfolio evidence.
            </p>
            <Button variant="primary" onClick={() => navigate('/projects')}>
              Proceed to Practical Projects →
            </Button>
          </div>
        </Card>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', marginBottom: '2.5rem' }}>
          {milestones.map((milestone, idx) => {
            const isComplete = completedLearningIds.includes(milestone.milestoneId);

            return (
              <Card
                key={milestone.milestoneId}
                style={{
                  borderColor: isComplete ? '#B8E3C8' : '#D9E1E8',
                  backgroundColor: isComplete ? '#FAFDFB' : '#FFFFFF'
                }}
              >
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem' }}>
                  <div style={{ display: 'flex', gap: '1.25rem', alignItems: 'flex-start', flex: '1 1 500px' }}>
                    {/* Step Number Circle */}
                    <div
                      style={{
                        width: '46px',
                        height: '46px',
                        borderRadius: '50%',
                        backgroundColor: isComplete ? '#107E3E' : '#0A6ED1',
                        color: '#FFFFFF',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontWeight: 700,
                        fontSize: '1.15rem',
                        flexShrink: 0
                      }}
                    >
                      {isComplete ? '✓' : idx + 1}
                    </div>

                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                        <Badge variant={milestone.isEssential ? 'critical' : 'neutral'} size="sm">
                          {milestone.isEssential ? 'Essential Gap' : 'Elective Enhancement'}
                        </Badge>
                        <Badge variant="outline" size="sm">
                          ~{milestone.estimatedHours} Hours
                        </Badge>
                        {milestone.prerequisiteMilestoneIds.length > 0 && (
                          <Badge variant="purple" size="sm">
                            Requires Step {milestone.prerequisiteMilestoneIds.map((id) => id.split('-').pop()).join(', ')}
                          </Badge>
                        )}
                      </div>

                      <h3 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#001A47', marginBottom: '0.35rem' }}>
                        {milestone.title}
                      </h3>

                      <p style={{ color: '#5B6876', fontSize: '0.92rem', marginBottom: '1rem', lineHeight: 1.5 }}>
                        {milestone.objective}
                      </p>

                      {/* Verified Learning Resources List */}
                      {milestone.resources.length > 0 && (
                        <div style={{ marginBottom: '1.25rem' }}>
                          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: '#001A47', textTransform: 'uppercase', display: 'block', marginBottom: '0.5rem' }}>
                            Verified Course Curriculum:
                          </span>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                            {milestone.resources.map((res) => (
                              <div
                                key={res.id}
                                style={{
                                  padding: '0.75rem 1rem',
                                  backgroundColor: '#FAFBFD',
                                  border: '1px solid #EDF1F5',
                                  borderRadius: '6px',
                                  display: 'flex',
                                  justifyContent: 'space-between',
                                  alignItems: 'center',
                                  flexWrap: 'wrap',
                                  gap: '0.5rem'
                                }}
                              >
                                <div>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                                    <span style={{ fontWeight: 600, color: '#001A47', fontSize: '0.9rem' }}>
                                      [{res.code}] {res.title}
                                    </span>
                                    <Badge variant="success" size="sm">
                                      Verified Link
                                    </Badge>
                                  </div>
                                  <div style={{ fontSize: '0.78rem', color: '#5B6876', marginTop: '0.2rem' }}>
                                    Provider: {res.provider} • Level: {res.level} • ~{res.estimatedHours} hrs
                                  </div>
                                </div>

                                <a
                                  href={res.externalUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '0.35rem',
                                    fontSize: '0.82rem',
                                    fontWeight: 600,
                                    color: '#0A6ED1',
                                    textDecoration: 'none',
                                    padding: '0.35rem 0.65rem',
                                    backgroundColor: '#FFFFFF',
                                    border: '1px solid #C4D5EA',
                                    borderRadius: '4px'
                                  }}
                                >
                                  <span>Open Course Page</span>
                                  <ExternalLinkIcon size={13} />
                                </a>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Mapped Practical Project Exercise */}
                      {milestone.practicalProject && (
                        <div
                          style={{
                            padding: '0.9rem 1rem',
                            backgroundColor: '#F3FAF6',
                            border: '1px solid #B8E3C8',
                            borderRadius: '6px',
                            marginBottom: '1rem'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                            <strong style={{ color: '#107E3E', fontSize: '0.88rem' }}>
                              Mapped Hands-on Project: {milestone.practicalProject.title}
                            </strong>
                            <Badge variant="success" size="sm">
                              {milestone.practicalProject.estimatedEffortHours} hrs
                            </Badge>
                          </div>
                          <p style={{ color: '#276738', fontSize: '0.82rem', marginBottom: '0.4rem', lineHeight: 1.4 }}>
                            {milestone.practicalProject.description}
                          </p>
                          <div style={{ fontSize: '0.78rem', color: '#5B6876' }}>
                            <strong>Deliverable:</strong> {milestone.practicalProject.deliverables[0]}
                          </div>
                        </div>
                      )}

                      {/* Completion Criteria */}
                      <div style={{ fontSize: '0.82rem', color: '#5B6876', fontStyle: 'italic' }}>
                        <strong>Completion Criteria:</strong> {milestone.completionCriteria}
                      </div>
                    </div>
                  </div>

                  {/* Right Side: Toggle Completion Action */}
                  <div style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => toggleLearningCompletion(milestone.milestoneId)}
                      style={{
                        padding: '0.5rem 1rem',
                        borderRadius: '6px',
                        border: `1px solid ${isComplete ? '#107E3E' : '#D9E1E8'}`,
                        backgroundColor: isComplete ? '#E8F5ED' : '#FFFFFF',
                        color: isComplete ? '#107E3E' : '#001A47',
                        fontWeight: 600,
                        fontSize: '0.875rem',
                        cursor: 'pointer',
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.4rem'
                      }}
                    >
                      {isComplete ? (
                        <>
                          <CheckIcon size={16} color="#107E3E" />
                          <span>Marked Complete</span>
                        </>
                      ) : (
                        <span>Mark Milestone Complete</span>
                      )}
                    </button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Navigation Footer */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <Button variant="ghost" icon={<ArrowLeftIcon size={16} />} onClick={() => navigate('/career-gap')}>
          Back to Skill Gap Breakdown
        </Button>
        <Button
          variant="primary"
          size="lg"
          icon={<AwardIcon size={18} />}
          iconPosition="right"
          onClick={() => navigate('/projects')}
        >
          Proceed to Practical Projects & Evidence →
        </Button>
      </div>
    </div>
  );
};
