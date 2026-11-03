import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import {
  ArrowRightIcon,
  SearchIcon,
  BookOpenIcon,
  AlertTriangleIcon,
  ExternalLinkIcon,
  InfoIcon
} from '../components/common/Icons';
import { useCareerContext } from '../context/CareerContext';
import {
  PracticalProjectDefinition,
  ProjectLifecycleState
} from '@career-orchestrator/shared';
import { enterpriseTheme } from '../theme/tokens';

export const PracticalProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    targetRole,
    currentProfileId,
    projects,
    isLoadingProjects,
    activeProjectSubmissions,
    fetchProjects,
    startProjectWorkspace,
    submitProjectDeliverables,
    reviewProjectDeliverables,
    sessionMode
  } = useCareerContext();

  // Filters
  const [roleFilter, setRoleFilter] = useState<string>('TARGET');
  const [difficultyFilter, setDifficultyFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal / Detail state
  const [selectedProject, setSelectedProject] = useState<PracticalProjectDefinition | null>(null);
  const [modalTab, setModalTab] = useState<'details' | 'submit' | 'review' | 'history'>('details');
  const [workspaceOpen, setWorkspaceOpen] = useState(false);

  // Form states for submission
  const [repoUrl, setRepoUrl] = useState('');
  const [demoUrl, setDemoUrl] = useState('');
  const [explanation, setExplanation] = useState('');
  const [challenges, setChallenges] = useState('');
  const [reflection, setReflection] = useState('');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [alternativeEvidence, setAlternativeEvidence] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form states for review
  const [rubricScores, setRubricScores] = useState<Record<string, number>>({});
  const [rubricFeedback, setRubricFeedback] = useState<Record<string, string>>({});
  const [generalFeedback, setGeneralFeedback] = useState('');
  const [reviewerType, setReviewerType] = useState<'SELF_ASSESSMENT' | 'INDEPENDENT_REVIEWER'>('SELF_ASSESSMENT');
  const [targetStatus, setTargetStatus] = useState<
    'IN_PROGRESS' | 'SUBMITTED' | 'NEEDS_REVISION' | 'REVIEWED' | 'COMPLETED'
  >('REVIEWED');
  const [isReviewing, setIsReviewing] = useState(false);

  // Fetch projects on mount or filter change
  useEffect(() => {
    fetchProjects({
      roleSlug: roleFilter === 'TARGET' ? targetRole.slug : roleFilter === 'ALL' ? undefined : roleFilter,
      difficulty: difficultyFilter !== 'ALL' ? difficultyFilter : undefined,
      search: searchQuery.trim() || undefined
    });
  }, [fetchProjects, roleFilter, targetRole.slug, difficultyFilter, searchQuery]);

  const openWorkspace = (project: PracticalProjectDefinition) => {
    setSelectedProject(project);
    const existing = activeProjectSubmissions[project.id];

    if (existing) {
      setRepoUrl(existing.repositoryUrl || '');
      setDemoUrl(existing.liveDemoUrl || '');
      setExplanation(existing.projectExplanation || '');
      setChallenges(existing.challengesEncountered || '');
      setReflection(existing.learningReflection || '');
      setSelectedSkills(existing.skillsDemonstrated || project.targetSkills);
      setAlternativeEvidence(existing.alternativeEvidenceDescription || '');

      // Populate review state
      const scoresMap: Record<string, number> = {};
      const feedbackMap: Record<string, string> = {};
      (existing.rubricAssessments || []).forEach((r) => {
        scoresMap[r.criterion] = r.awardedScore ?? 80;
        feedbackMap[r.criterion] = r.feedback || '';
      });
      setRubricScores(scoresMap);
      setRubricFeedback(feedbackMap);
      setGeneralFeedback(existing.reviewerFeedback || '');
      setReviewerType(existing.reviewerType === 'INDEPENDENT_REVIEWER' ? 'INDEPENDENT_REVIEWER' : 'SELF_ASSESSMENT');
      setTargetStatus(existing.status === 'COMPLETED' ? 'COMPLETED' : 'REVIEWED');
    } else {
      setRepoUrl('');
      setDemoUrl('');
      setExplanation('');
      setChallenges('');
      setReflection('');
      setSelectedSkills(project.targetSkills);
      setAlternativeEvidence('');

      const scoresMap: Record<string, number> = {};
      const feedbackMap: Record<string, string> = {};
      project.rubricCriteria.forEach((r) => {
        scoresMap[r.criterion] = 85;
        feedbackMap[r.criterion] = 'Meets criteria with demonstrated deliverables.';
      });
      setRubricScores(scoresMap);
      setRubricFeedback(feedbackMap);
      setGeneralFeedback('Well-structured deliverable meeting enterprise documentation standards.');
      setReviewerType('SELF_ASSESSMENT');
      setTargetStatus('REVIEWED');
    }

    setFormError(null);
    setModalTab(existing?.status === 'SUBMITTED' || existing?.status === 'REVIEWED' || existing?.status === 'COMPLETED' ? 'history' : 'details');
    setWorkspaceOpen(true);
  };

  const handleStartProject = async (project: PracticalProjectDefinition) => {
    await startProjectWorkspace(project.id, currentProfileId || 'demo-profile');
    openWorkspace(project);
    setModalTab('submit');
  };

  const handleSubmitDeliverable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;

    if (explanation.trim().length < 10) {
      setFormError('Project explanation must be at least 10 characters.');
      return;
    }
    if (reflection.trim().length < 10) {
      setFormError('Learning reflection must be at least 10 characters.');
      return;
    }
    if (selectedSkills.length === 0) {
      setFormError('Please select at least one skill demonstrated.');
      return;
    }

    if (repoUrl && !/^https?:\/\/.+/.test(repoUrl)) {
      setFormError('Repository URL must be a valid http:// or https:// URL.');
      return;
    }
    if (demoUrl && !/^https?:\/\/.+/.test(demoUrl)) {
      setFormError('Live demo URL must be a valid http:// or https:// URL.');
      return;
    }

    setFormError(null);
    setIsSubmitting(true);

    try {
      const res = await submitProjectDeliverables({
        projectId: selectedProject.id,
        profileId: currentProfileId || 'demo-profile',
        repositoryUrl: repoUrl.trim() || undefined,
        liveDemoUrl: demoUrl.trim() || undefined,
        projectExplanation: explanation.trim(),
        challengesEncountered: challenges.trim() || undefined,
        skillsDemonstrated: selectedSkills,
        learningReflection: reflection.trim(),
        alternativeEvidenceDescription: alternativeEvidence.trim() || undefined
      });

      if (res) {
        setModalTab('history');
      } else {
        setFormError('Failed to record submission. Please check backend connection.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReviewSubmission = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProject) return;
    const existing = activeProjectSubmissions[selectedProject.id];
    if (!existing) return;

    if (generalFeedback.trim().length < 5) {
      setFormError('Reviewer feedback must be at least 5 characters.');
      return;
    }

    setFormError(null);
    setIsReviewing(true);

    try {
      const assessments = selectedProject.rubricCriteria.map((rc) => ({
        criterion: rc.criterion,
        weightPercentage: rc.weightPercentage,
        awardedScore: rubricScores[rc.criterion] ?? 80,
        feedback: rubricFeedback[rc.criterion] || 'Meets criteria.',
        isSatisfied: (rubricScores[rc.criterion] ?? 80) >= 70
      }));

      const res = await reviewProjectDeliverables({
        submissionId: existing.id,
        reviewerProfileId: currentProfileId || 'reviewer-01',
        status: targetStatus,
        reviewerType,
        rubricAssessments: assessments,
        reviewerFeedback: generalFeedback.trim()
      });

      if (res) {
        setModalTab('history');
      } else {
        setFormError('Failed to record review assessment.');
      }
    } finally {
      setIsReviewing(false);
    }
  };

  // Helper for status badge variant
  const getStatusBadge = (status?: ProjectLifecycleState) => {
    switch (status) {
      case 'COMPLETED':
        return <Badge variant="success">Verified Completed</Badge>;
      case 'REVIEWED':
        return <Badge variant="purple">Reviewed</Badge>;
      case 'SUBMITTED':
        return <Badge variant="warning">Submitted (Awaiting Review)</Badge>;
      case 'NEEDS_REVISION':
        return <Badge variant="critical">Needs Revision</Badge>;
      case 'IN_PROGRESS':
        return <Badge variant="info">In Progress</Badge>;
      default:
        return <Badge variant="neutral">Not Started</Badge>;
    }
  };

  // Counts
  const totalProjects = projects.length;
  const inProgressCount = Object.values(activeProjectSubmissions).filter((s) => s.status === 'IN_PROGRESS').length;
  const submittedCount = Object.values(activeProjectSubmissions).filter((s) => s.status === 'SUBMITTED').length;
  const completedCount = Object.values(activeProjectSubmissions).filter(
    (s) => s.status === 'COMPLETED' || s.status === 'REVIEWED'
  ).length;

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1280px', margin: '0 auto', width: '100%' }}>
      <Breadcrumbs
        items={[
          { label: 'Learning Pathway', path: '/learning' },
          { label: 'Practical Project Workspaces' }
        ]}
      />

      {/* Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.65rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <Badge variant={sessionMode === 'DEMO' ? 'info' : 'success'}>
              Stage 6 of 8
            </Badge>
            <Badge variant="info">Portfolio Evidence</Badge>
            <Badge variant="purple">Rubric Assessed</Badge>
          </div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: enterpriseTheme.colors.textPrimary, marginBottom: '0.5rem' }}>
            Applied Scenario Workspaces & Evidence
          </h1>
          <p style={{ color: enterpriseTheme.colors.textSecondary, fontSize: '0.98rem', maxWidth: '800px', lineHeight: 1.55 }}>
            Demonstrate verified capability for <strong>{targetRole.title}</strong> through enterprise scenarios. Submit repository deliverables, reflect on technical challenges, and assess your work against documented rubrics.
          </p>
        </div>

        <Button
          variant="primary"
          icon={<ArrowRightIcon size={16} />}
          iconPosition="right"
          onClick={() => navigate('/readiness')}
        >
          View Career Readiness Scorecard
        </Button>
      </div>

      {/* Honest Advisory Notice */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: `1px solid ${enterpriseTheme.colors.infoBorder}`,
          borderRadius: enterpriseTheme.radii.md,
          padding: '1.15rem 1.25rem',
          marginBottom: '2rem',
          display: 'flex',
          gap: '1rem',
          alignItems: 'flex-start',
          boxShadow: enterpriseTheme.shadows.card
        }}
      >
        <InfoIcon size={22} color={enterpriseTheme.colors.primary} />
        <div style={{ fontSize: '0.88rem', color: enterpriseTheme.colors.textPrimary, lineHeight: 1.5 }}>
          <strong>Evidence Assessment Standard:</strong> A submitted project represents candidate evidence awaiting evaluation; submission alone does not certify competence. Projects must be assessed against explicit rubric criteria before contributing toward verified readiness.
        </div>
      </div>

      {/* Metrics Counter Bar */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.25rem',
          marginBottom: '2rem'
        }}
      >
        <Card>
          <div style={{ fontSize: '0.82rem', color: enterpriseTheme.colors.textSecondary, fontWeight: 700 }}>Total Projects</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: enterpriseTheme.colors.textPrimary, marginTop: '0.25rem' }}>
            {totalProjects}
          </div>
          <div style={{ fontSize: '0.78rem', color: enterpriseTheme.colors.textMuted, marginTop: '0.25rem' }}>Enterprise Scenarios</div>
        </Card>

        <Card>
          <div style={{ fontSize: '0.82rem', color: enterpriseTheme.colors.primary, fontWeight: 700 }}>In Progress</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: enterpriseTheme.colors.primary, marginTop: '0.25rem' }}>
            {inProgressCount}
          </div>
          <div style={{ fontSize: '0.78rem', color: enterpriseTheme.colors.textMuted, marginTop: '0.25rem' }}>Active Workspaces</div>
        </Card>

        <Card>
          <div style={{ fontSize: '0.82rem', color: enterpriseTheme.colors.warning, fontWeight: 700 }}>Awaiting Review</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: enterpriseTheme.colors.warning, marginTop: '0.25rem' }}>
            {submittedCount}
          </div>
          <div style={{ fontSize: '0.78rem', color: enterpriseTheme.colors.textMuted, marginTop: '0.25rem' }}>Submissions Logged</div>
        </Card>

        <Card>
          <div style={{ fontSize: '0.82rem', color: enterpriseTheme.colors.success, fontWeight: 700 }}>Verified Completed</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: enterpriseTheme.colors.success, marginTop: '0.25rem' }}>
            {completedCount}
          </div>
          <div style={{ fontSize: '0.78rem', color: enterpriseTheme.colors.textMuted, marginTop: '0.25rem' }}>Rubric Assessed</div>
        </Card>
      </div>

      {/* Filter and Search Bar */}
      <Card style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', alignItems: 'flex-end' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: enterpriseTheme.colors.textPrimary, marginBottom: '0.35rem' }}>
              Filter by Role Alignment
            </label>
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '6px', border: `1px solid ${enterpriseTheme.colors.surfaceBorder}`, fontSize: '0.85rem' }}
            >
              <option value="TARGET">Selected Target Career ({targetRole.title})</option>
              <option value="ALL">All Available Scenarios (Full Catalogue)</option>
              <option value="sap-s4hana-finance-consultant">SAP S/4HANA Finance</option>
              <option value="sap-abap-cloud-developer">SAP ABAP Cloud & RAP</option>
              <option value="sap-s4hana-sourcing-procurement">SAP S/4HANA Sourcing (MM)</option>
              <option value="sap-integration-suite-developer">SAP Integration Suite</option>
              <option value="sap-analytics-cloud-consultant">SAP Analytics Cloud (SAC)</option>
              <option value="enterprise-business-analyst">ERP Business Analyst</option>
              <option value="cloud-fullstack-developer">Cloud Full-Stack</option>
              <option value="devops-cloud-platform-engineer">DevOps & Platform</option>
              <option value="qa-automation-systems-engineer">QA Automation</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: enterpriseTheme.colors.textPrimary, marginBottom: '0.35rem' }}>
              Difficulty Level
            </label>
            <select
              value={difficultyFilter}
              onChange={(e) => setDifficultyFilter(e.target.value)}
              style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: '6px', border: `1px solid ${enterpriseTheme.colors.surfaceBorder}`, fontSize: '0.85rem' }}
            >
              <option value="ALL">All Difficulties</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 700, color: enterpriseTheme.colors.textPrimary, marginBottom: '0.35rem' }}>
              Search Keywords
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search scenario or skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '0.55rem 0.75rem 0.55rem 2.25rem', borderRadius: '6px', border: `1px solid ${enterpriseTheme.colors.surfaceBorder}`, fontSize: '0.85rem' }}
              />
              <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: enterpriseTheme.colors.textMuted }}>
                <SearchIcon size={16} />
              </span>
            </div>
          </div>
        </div>
      </Card>

      {/* Projects Grid */}
      {isLoadingProjects ? (
        <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#FFFFFF', borderRadius: '8px', border: `1px solid ${enterpriseTheme.colors.surfaceBorder}` }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 700, color: enterpriseTheme.colors.textPrimary }}>Loading Project Catalogue...</div>
        </div>
      ) : projects.length === 0 ? (
        <Card>
          <div style={{ textAlign: 'center', padding: '3rem' }}>
            <BookOpenIcon size={40} color={enterpriseTheme.colors.textMuted} />
            <h3 style={{ marginTop: '1rem', color: enterpriseTheme.colors.textPrimary, fontWeight: 700 }}>No Practical Projects Found</h3>
            <p style={{ color: enterpriseTheme.colors.textSecondary, fontSize: '0.9rem', marginTop: '0.5rem' }}>
              Try selecting "All Available Scenarios" to explore projects across the entire career catalogue.
            </p>
            <Button variant="outline" style={{ marginTop: '1rem' }} onClick={() => { setRoleFilter('ALL'); setDifficultyFilter('ALL'); setSearchQuery(''); }}>
              Reset Filters
            </Button>
          </div>
        </Card>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem', marginBottom: '3rem' }}>
          {projects.map((project) => {
            const submission = activeProjectSubmissions[project.id];
            const isRelevantToTarget = project.roleSlug === targetRole.slug;

            return (
              <Card
                key={project.id}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  border: isRelevantToTarget ? `2px solid ${enterpriseTheme.colors.primary}` : `1px solid ${enterpriseTheme.colors.surfaceBorder}`
                }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      <Badge variant={project.difficulty === 'ADVANCED' ? 'purple' : 'info'}>
                        {project.difficulty}
                      </Badge>
                      <Badge variant="neutral">~{project.estimatedEffortHours} hrs effort</Badge>
                      {isRelevantToTarget && <Badge variant="success">Target Role Match</Badge>}
                    </div>
                    {getStatusBadge(submission?.status)}
                  </div>

                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: enterpriseTheme.colors.textPrimary, marginBottom: '0.5rem' }}>
                    {project.title}
                  </h3>

                  <p style={{ fontSize: '0.88rem', color: enterpriseTheme.colors.textSecondary, lineHeight: 1.5, marginBottom: '1rem' }}>
                    {project.description}
                  </p>

                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ fontSize: '0.76rem', fontWeight: 700, color: enterpriseTheme.colors.textPrimary, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '0.4rem' }}>
                      Competencies Addressed:
                    </div>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                      {project.targetSkills.map((skill, sIdx) => (
                        <span
                          key={sIdx}
                          style={{
                            fontSize: '0.75rem',
                            padding: '0.2rem 0.5rem',
                            backgroundColor: enterpriseTheme.colors.canvas,
                            border: `1px solid ${enterpriseTheme.colors.surfaceBorder}`,
                            borderRadius: '4px',
                            color: enterpriseTheme.colors.textPrimary
                          }}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ borderTop: `1px solid ${enterpriseTheme.colors.surfaceBorder}`, paddingTop: '0.75rem', marginBottom: '1.25rem' }}>
                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: enterpriseTheme.colors.textPrimary, marginBottom: '0.35rem' }}>
                      Deliverables:
                    </div>
                    <ul style={{ paddingLeft: '1.2rem', margin: 0, fontSize: '0.82rem', color: enterpriseTheme.colors.textSecondary }}>
                      {project.deliverables.slice(0, 2).map((del, dIdx) => (
                        <li key={dIdx} style={{ marginBottom: '0.25rem' }}>{del}</li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                  <Button
                    variant={submission ? 'primary' : 'outline'}
                    size="md"
                    fullWidth
                    onClick={() => (submission ? openWorkspace(project) : handleStartProject(project))}
                  >
                    {submission ? 'Open Workspace' : 'Start Project Workspace'}
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Project Workspace Modal */}
      {workspaceOpen && selectedProject && (
        <Modal
          isOpen={workspaceOpen}
          onClose={() => setWorkspaceOpen(false)}
          title={`Project Workspace: ${selectedProject.title}`}
          maxWidth="900px"
        >
          <div>
            {/* Modal Navigation Tabs */}
            <div style={{ display: 'flex', borderBottom: `1px solid ${enterpriseTheme.colors.surfaceBorder}`, marginBottom: '1.5rem', gap: '1rem', overflowX: 'auto' }}>
              <button
                onClick={() => setModalTab('details')}
                style={{
                  padding: '0.75rem 1rem',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  borderBottom: modalTab === 'details' ? `3px solid ${enterpriseTheme.colors.primary}` : '3px solid transparent',
                  color: modalTab === 'details' ? enterpriseTheme.colors.primary : enterpriseTheme.colors.textSecondary,
                  whiteSpace: 'nowrap'
                }}
              >
                1. Scenario & Instructions
              </button>
              <button
                onClick={() => setModalTab('submit')}
                style={{
                  padding: '0.75rem 1rem',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  borderBottom: modalTab === 'submit' ? `3px solid ${enterpriseTheme.colors.primary}` : '3px solid transparent',
                  color: modalTab === 'submit' ? enterpriseTheme.colors.primary : enterpriseTheme.colors.textSecondary,
                  whiteSpace: 'nowrap'
                }}
              >
                2. Submit Deliverables
              </button>
              <button
                onClick={() => setModalTab('review')}
                style={{
                  padding: '0.75rem 1rem',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  borderBottom: modalTab === 'review' ? `3px solid ${enterpriseTheme.colors.primary}` : '3px solid transparent',
                  color: modalTab === 'review' ? enterpriseTheme.colors.primary : enterpriseTheme.colors.textSecondary,
                  whiteSpace: 'nowrap'
                }}
              >
                3. Assessment & Rubric
              </button>
              <button
                onClick={() => setModalTab('history')}
                style={{
                  padding: '0.75rem 1rem',
                  fontWeight: 700,
                  fontSize: '0.88rem',
                  border: 'none',
                  background: 'none',
                  cursor: 'pointer',
                  borderBottom: modalTab === 'history' ? `3px solid ${enterpriseTheme.colors.primary}` : '3px solid transparent',
                  color: modalTab === 'history' ? enterpriseTheme.colors.primary : enterpriseTheme.colors.textSecondary,
                  whiteSpace: 'nowrap'
                }}
              >
                4. Submission History
              </button>
            </div>

            {formError && (
              <div style={{ backgroundColor: enterpriseTheme.colors.criticalSubtle, border: `1px solid ${enterpriseTheme.colors.criticalBorder}`, padding: '0.75rem 1rem', borderRadius: '6px', color: enterpriseTheme.colors.critical, marginBottom: '1.25rem', fontSize: '0.88rem' }}>
                <AlertTriangleIcon size={16} style={{ display: 'inline', marginRight: '0.5rem', verticalAlign: 'text-bottom' }} />
                {formError}
              </div>
            )}

            {/* TAB 1: DETAILS */}
            {modalTab === 'details' && (
              <div>
                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ color: enterpriseTheme.colors.textPrimary, fontSize: '0.98rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                    Business Scenario & Problem Context
                  </h4>
                  <p style={{ color: enterpriseTheme.colors.textPrimary, fontSize: '0.88rem', lineHeight: 1.6, backgroundColor: enterpriseTheme.colors.canvas, padding: '1rem', borderRadius: '6px', border: `1px solid ${enterpriseTheme.colors.surfaceBorder}` }}>
                    {selectedProject.businessProblem || selectedProject.description}
                  </p>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ color: enterpriseTheme.colors.textPrimary, fontSize: '0.98rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                    Learning Objectives
                  </h4>
                  <ul style={{ paddingLeft: '1.25rem', color: enterpriseTheme.colors.textSecondary, fontSize: '0.88rem', lineHeight: 1.6 }}>
                    {(selectedProject.objectives || ['Demonstrate enterprise configuration competence', 'Author audit-ready documentation']).map((obj, i) => (
                      <li key={i}>{obj}</li>
                    ))}
                  </ul>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ color: enterpriseTheme.colors.textPrimary, fontSize: '0.98rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                    Step-by-Step Instructions
                  </h4>
                  <div style={{ color: enterpriseTheme.colors.textPrimary, fontSize: '0.88rem', lineHeight: 1.6 }}>
                    {(selectedProject.stepByStepInstructions || [
                      '1. Review functional scenario requirements.',
                      '2. Execute solution in sandbox or document enterprise blueprint.',
                      '3. Package configuration runbook and evidence export.'
                    ]).map((step, idx) => (
                      <div key={idx} style={{ marginBottom: '0.4rem' }}>{step}</div>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ color: enterpriseTheme.colors.textPrimary, fontSize: '0.98rem', fontWeight: 700, marginBottom: '0.4rem' }}>
                    Required Deliverables
                  </h4>
                  <ul style={{ paddingLeft: '1.25rem', color: enterpriseTheme.colors.textSecondary, fontSize: '0.88rem' }}>
                    {selectedProject.deliverables.map((del, dIdx) => (
                      <li key={dIdx} style={{ marginBottom: '0.35rem' }}><strong>{del}</strong></li>
                    ))}
                  </ul>
                </div>

                <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                  <Button variant="primary" onClick={() => setModalTab('submit')}>
                    Proceed to Deliverable Submission
                  </Button>
                </div>
              </div>
            )}

            {/* TAB 2: SUBMIT */}
            {modalTab === 'submit' && (
              <form onSubmit={handleSubmitDeliverable}>
                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: enterpriseTheme.colors.textPrimary, marginBottom: '0.35rem' }}>
                    Deliverable Repository URL (GitHub / GitLab / Bitbucket)
                  </label>
                  <input
                    type="url"
                    placeholder="https://github.com/username/project-repo"
                    value={repoUrl}
                    onChange={(e) => setRepoUrl(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.75rem', borderRadius: '6px', border: `1px solid ${enterpriseTheme.colors.surfaceBorder}` }}
                  />
                  <small style={{ color: enterpriseTheme.colors.textMuted, display: 'block', marginTop: '0.25rem' }}>
                    Public repository link. (If your repository is private or offline, document it in the alternative evidence field below).
                  </small>
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: enterpriseTheme.colors.textPrimary, marginBottom: '0.35rem' }}>
                    Live Demo / Cloud Storyboard URL (Optional)
                  </label>
                  <input
                    type="url"
                    placeholder="https://drive.google.com/file/... or live deployment"
                    value={demoUrl}
                    onChange={(e) => setDemoUrl(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.75rem', borderRadius: '6px', border: `1px solid ${enterpriseTheme.colors.surfaceBorder}` }}
                  />
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: enterpriseTheme.colors.textPrimary, marginBottom: '0.35rem' }}>
                    Project Explanation & Architecture Summary *
                  </label>
                  <textarea
                    rows={4}
                    placeholder="Explain the solution architecture, configurations applied, and how you met the business scenario objectives..."
                    value={explanation}
                    onChange={(e) => setExplanation(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.75rem', borderRadius: '6px', border: `1px solid ${enterpriseTheme.colors.surfaceBorder}` }}
                  />
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: enterpriseTheme.colors.textPrimary, marginBottom: '0.35rem' }}>
                    Challenges Encountered & Resolutions
                  </label>
                  <textarea
                    rows={3}
                    placeholder="What technical, functional, or integration hurdles did you encounter, and how did you resolve them?"
                    value={challenges}
                    onChange={(e) => setChallenges(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.75rem', borderRadius: '6px', border: `1px solid ${enterpriseTheme.colors.surfaceBorder}` }}
                  />
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: enterpriseTheme.colors.textPrimary, marginBottom: '0.35rem' }}>
                    Demonstrated Competencies (Check all that apply) *
                  </label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
                    {selectedProject.targetSkills.map((skill) => (
                      <label key={skill} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: enterpriseTheme.colors.textPrimary }}>
                        <input
                          type="checkbox"
                          checked={selectedSkills.includes(skill)}
                          onChange={(e) => {
                            if (e.target.checked) setSelectedSkills([...selectedSkills, skill]);
                            else setSelectedSkills(selectedSkills.filter((s) => s !== skill));
                          }}
                        />
                        {skill}
                      </label>
                    ))}
                  </div>
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: enterpriseTheme.colors.textPrimary, marginBottom: '0.35rem' }}>
                    Key Learning Reflection *
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Reflect on how this project reinforced your theoretical understanding and prepared you for enterprise practice..."
                    value={reflection}
                    onChange={(e) => setReflection(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.75rem', borderRadius: '6px', border: `1px solid ${enterpriseTheme.colors.surfaceBorder}` }}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: enterpriseTheme.colors.textPrimary, marginBottom: '0.35rem' }}>
                    Alternative Evidence Description (For Private Repositories or Offline Artifacts)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="If you cannot share a public repository, provide verification instructions or local checksum..."
                    value={alternativeEvidence}
                    onChange={(e) => setAlternativeEvidence(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.75rem', borderRadius: '6px', border: `1px solid ${enterpriseTheme.colors.surfaceBorder}` }}
                  />
                  <small style={{ color: enterpriseTheme.colors.textMuted, display: 'block', marginTop: '0.25rem' }}>
                    Never submit passwords, AWS/BTP access keys, or sensitive credentials.
                  </small>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                  <Button variant="outline" type="button" onClick={() => setWorkspaceOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Logging Submission...' : 'Submit Evidence for Review'}
                  </Button>
                </div>
              </form>
            )}

            {/* TAB 3: REVIEW & RUBRIC */}
            {modalTab === 'review' && (
              <form onSubmit={handleReviewSubmission}>
                <div style={{ backgroundColor: enterpriseTheme.colors.canvas, padding: '1rem', borderRadius: '6px', border: `1px solid ${enterpriseTheme.colors.surfaceBorder}`, marginBottom: '1.5rem' }}>
                  <div style={{ fontSize: '0.88rem', color: enterpriseTheme.colors.textPrimary, lineHeight: 1.5 }}>
                    <strong>Rubric-Based Evidence Assessment:</strong> Grade the deliverable against each criterion defined for this scenario. Weighted total score $\ge 70\%$ qualifies for verified completion.
                  </div>
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: enterpriseTheme.colors.textPrimary, marginBottom: '0.35rem' }}>
                    Evaluator Mode
                  </label>
                  <select
                    value={reviewerType}
                    onChange={(e) => setReviewerType(e.target.value as 'SELF_ASSESSMENT' | 'INDEPENDENT_REVIEWER')}
                    style={{ width: '100%', padding: '0.65rem 0.75rem', borderRadius: '6px', border: `1px solid ${enterpriseTheme.colors.surfaceBorder}` }}
                  >
                    <option value="SELF_ASSESSMENT">Self-Assessment (Candidate Review)</option>
                    <option value="INDEPENDENT_REVIEWER">Simulated Independent Evaluator (Demonstration Mode)</option>
                  </select>
                  <small style={{ color: enterpriseTheme.colors.textSecondary, display: 'block', marginTop: '0.35rem', lineHeight: 1.4 }}>
                    {reviewerType === 'SELF_ASSESSMENT'
                      ? 'Self-Assessment: Allows candidate review against rubric criteria. Capped at "REVIEWED" status; cannot claim independent verification.'
                      : 'Simulated Demonstration Mode: Independent evaluator review is demonstrated in local environment. Note: Third-party enterprise authentication is not configured in this build.'}
                  </small>
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <h4 style={{ color: enterpriseTheme.colors.textPrimary, fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.75rem' }}>
                    Assessment Rubric Breakdown
                  </h4>
                  {selectedProject.rubricCriteria.map((rc, idx) => (
                    <div key={idx} style={{ padding: '1rem', border: `1px solid ${enterpriseTheme.colors.surfaceBorder}`, borderRadius: '6px', marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <span style={{ fontWeight: 700, color: enterpriseTheme.colors.textPrimary, fontSize: '0.9rem' }}>
                          {rc.criterion}
                        </span>
                        <Badge variant="neutral">{rc.weightPercentage}% weight</Badge>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '140px 1fr', gap: '1rem', alignItems: 'center' }}>
                        <div>
                          <label style={{ fontSize: '0.75rem', color: enterpriseTheme.colors.textSecondary, display: 'block' }}>Score (0–100)</label>
                          <input
                            type="number"
                            min="0"
                            max="100"
                            value={rubricScores[rc.criterion] ?? 80}
                            onChange={(e) =>
                              setRubricScores({
                                ...rubricScores,
                                [rc.criterion]: parseInt(e.target.value) || 0
                              })
                            }
                            style={{ width: '100%', padding: '0.4rem 0.5rem', borderRadius: '4px', border: `1px solid ${enterpriseTheme.colors.surfaceBorder}` }}
                          />
                        </div>
                        <div>
                          <label style={{ fontSize: '0.75rem', color: enterpriseTheme.colors.textSecondary, display: 'block' }}>Criterion Feedback</label>
                          <input
                            type="text"
                            placeholder="Feedback on this specific criterion..."
                            value={rubricFeedback[rc.criterion] || ''}
                            onChange={(e) =>
                              setRubricFeedback({
                                ...rubricFeedback,
                                [rc.criterion]: e.target.value
                              })
                            }
                            style={{ width: '100%', padding: '0.4rem 0.5rem', borderRadius: '4px', border: `1px solid ${enterpriseTheme.colors.surfaceBorder}` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ marginBottom: '1.25rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: enterpriseTheme.colors.textPrimary, marginBottom: '0.35rem' }}>
                    Overall Reviewer Feedback *
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Provide constructive assessment feedback detailing strengths and areas for revision..."
                    value={generalFeedback}
                    onChange={(e) => setGeneralFeedback(e.target.value)}
                    style={{ width: '100%', padding: '0.65rem 0.75rem', borderRadius: '6px', border: `1px solid ${enterpriseTheme.colors.surfaceBorder}` }}
                  />
                </div>

                <div style={{ marginBottom: '1.5rem' }}>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: enterpriseTheme.colors.textPrimary, marginBottom: '0.35rem' }}>
                    Target Evaluation Decision
                  </label>
                  <select
                    value={targetStatus}
                    onChange={(e) =>
                      setTargetStatus(
                        e.target.value as
                          | 'IN_PROGRESS'
                          | 'SUBMITTED'
                          | 'NEEDS_REVISION'
                          | 'REVIEWED'
                          | 'COMPLETED'
                      )
                    }
                    style={{ width: '100%', padding: '0.65rem 0.75rem', borderRadius: '6px', border: `1px solid ${enterpriseTheme.colors.surfaceBorder}` }}
                  >
                    <option value="COMPLETED">Verified Completed (Passes Rubric Criteria)</option>
                    <option value="REVIEWED">Reviewed (Evaluated without full completion)</option>
                    <option value="NEEDS_REVISION">Needs Revision (Score &lt; 70% or missing artifacts)</option>
                  </select>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                  <Button variant="outline" type="button" onClick={() => setWorkspaceOpen(false)}>
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit" disabled={isReviewing}>
                    {isReviewing ? 'Saving Assessment...' : 'Record Evaluation & Update Status'}
                  </Button>
                </div>
              </form>
            )}

            {/* TAB 4: HISTORY */}
            {modalTab === 'history' && (
              <div>
                {activeProjectSubmissions[selectedProject.id] ? (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
                      <div>
                        <div style={{ fontSize: '0.82rem', color: enterpriseTheme.colors.textSecondary }}>Current Evidence Status:</div>
                        <div style={{ marginTop: '0.25rem' }}>
                          {getStatusBadge(activeProjectSubmissions[selectedProject.id].status)}
                        </div>
                      </div>
                      {activeProjectSubmissions[selectedProject.id].overallScore !== undefined && (
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '0.82rem', color: enterpriseTheme.colors.textSecondary }}>Rubric Score:</div>
                          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: enterpriseTheme.colors.success }}>
                            {activeProjectSubmissions[selectedProject.id].overallScore}%
                          </div>
                        </div>
                      )}
                    </div>

                    <div style={{ backgroundColor: enterpriseTheme.colors.canvas, padding: '1.25rem', borderRadius: '8px', border: `1px solid ${enterpriseTheme.colors.surfaceBorder}`, marginBottom: '1.5rem' }}>
                      <h4 style={{ color: enterpriseTheme.colors.textPrimary, fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem' }}>
                        Submitted Deliverable Details
                      </h4>
                      {activeProjectSubmissions[selectedProject.id].repositoryUrl && (
                        <div style={{ marginBottom: '0.5rem', fontSize: '0.88rem' }}>
                          <strong>Repository URL: </strong>
                          <a
                            href={activeProjectSubmissions[selectedProject.id].repositoryUrl}
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: enterpriseTheme.colors.primary }}
                          >
                            {activeProjectSubmissions[selectedProject.id].repositoryUrl} <ExternalLinkIcon size={12} style={{ display: 'inline' }} />
                          </a>
                        </div>
                      )}
                      {activeProjectSubmissions[selectedProject.id].liveDemoUrl && (
                        <div style={{ marginBottom: '0.5rem', fontSize: '0.88rem' }}>
                          <strong>Live Demo: </strong>
                          <a
                            href={activeProjectSubmissions[selectedProject.id].liveDemoUrl}
                            target="_blank"
                            rel="noreferrer"
                            style={{ color: enterpriseTheme.colors.primary }}
                          >
                            {activeProjectSubmissions[selectedProject.id].liveDemoUrl} <ExternalLinkIcon size={12} style={{ display: 'inline' }} />
                          </a>
                        </div>
                      )}
                      <div style={{ marginTop: '0.75rem', fontSize: '0.88rem' }}>
                        <strong>Explanation:</strong>
                        <p style={{ marginTop: '0.25rem', color: enterpriseTheme.colors.textSecondary, lineHeight: 1.5 }}>
                          {activeProjectSubmissions[selectedProject.id].projectExplanation}
                        </p>
                      </div>
                      {activeProjectSubmissions[selectedProject.id].learningReflection && (
                        <div style={{ marginTop: '0.75rem', fontSize: '0.88rem' }}>
                          <strong>Reflection:</strong>
                          <p style={{ marginTop: '0.25rem', color: enterpriseTheme.colors.textSecondary, lineHeight: 1.5 }}>
                            {activeProjectSubmissions[selectedProject.id].learningReflection}
                          </p>
                        </div>
                      )}
                    </div>

                    {activeProjectSubmissions[selectedProject.id].reviewerFeedback && (
                      <div style={{ backgroundColor: enterpriseTheme.colors.successSubtle, padding: '1.25rem', borderRadius: '8px', border: `1px solid ${enterpriseTheme.colors.successBorder}`, marginBottom: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <h4 style={{ color: enterpriseTheme.colors.success, fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>
                            Evaluator Assessment & Feedback
                          </h4>
                          <Badge variant="success">
                            {activeProjectSubmissions[selectedProject.id].reviewerType === 'INDEPENDENT_REVIEWER'
                              ? 'Independent Review'
                              : 'Self-Assessment'}
                          </Badge>
                        </div>
                        <p style={{ color: enterpriseTheme.colors.textPrimary, fontSize: '0.88rem', lineHeight: 1.5 }}>
                          {activeProjectSubmissions[selectedProject.id].reviewerFeedback}
                        </p>
                      </div>
                    )}

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                      <Button variant="outline" onClick={() => setModalTab('submit')}>
                        Update Deliverable Submission
                      </Button>
                      <Button variant="secondary" onClick={() => setModalTab('review')}>
                        Conduct Rubric Assessment
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <p style={{ color: enterpriseTheme.colors.textSecondary }}>No submission logged yet for this project.</p>
                    <Button variant="primary" style={{ marginTop: '1rem' }} onClick={() => setModalTab('submit')}>
                      Submit Project Deliverables
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
};
