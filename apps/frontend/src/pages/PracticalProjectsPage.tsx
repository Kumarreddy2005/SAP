import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { StepIndicator } from '../components/common/StepIndicator';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { Modal } from '../components/common/Modal';
import { DemoDataBanner } from '../components/common/DemoDataBanner';
import { AwardIcon, ArrowRightIcon, ArrowLeftIcon } from '../components/common/Icons';
import { DEMO_PROJECTS, PracticalProject } from '../demo/demoProjects';
import { useCareerContext } from '../context/CareerContext';

export const PracticalProjectsPage: React.FC = () => {
  const navigate = useNavigate();
  const { targetRole, projectSubmissions, submitProjectEvidence } = useCareerContext();

  const [activeProject, setActiveProject] = useState<PracticalProject | null>(null);
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [reflectionText, setReflectionText] = useState('');
  const [submissionModalOpen, setSubmissionModalOpen] = useState(false);

  // Filter projects relevant to target role or default to available
  const relevantProjects = DEMO_PROJECTS.filter(
    (p) => p.roleSlug === targetRole.slug || p.roleSlug === 'sap-s4hana-finance-consultant'
  );

  const openSubmissionModal = (project: PracticalProject) => {
    setActiveProject(project);
    const existing = projectSubmissions[project.id];
    setSubmissionUrl(existing ? existing.submissionUrl : '');
    setReflectionText(existing ? existing.reflectionText : '');
    setSubmissionModalOpen(true);
  };

  const handleSaveSubmission = (e: React.FormEvent) => {
    e.preventDefault();
    if (!submissionUrl.trim() || !reflectionText.trim()) {
      alert('Please provide both a deliverable URL (e.g. GitHub/Drive link) and a brief reflection.');
      return;
    }

    if (activeProject) {
      submitProjectEvidence(activeProject.id, submissionUrl.trim(), reflectionText.trim());
      setSubmissionModalOpen(false);
    }
  };

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1280px', margin: '0 auto' }}>
      <Breadcrumbs
        items={[
          { label: 'Learning Pathway', path: '/learning' },
          { label: 'Practical Projects' }
        ]}
      />
      <StepIndicator currentStepId="projects" />

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
            Scenario Projects & Evidence Tracking
          </h1>
          <p style={{ color: '#5B6876', fontSize: '1.05rem', maxWidth: '800px' }}>
            Build tangible evidence of competency for <strong>{targetRole.title}</strong>. Complete realistic business blueprints, trial sandbox configurations, and clean-core code deliverables.
          </p>
        </div>

        <Button
          variant="primary"
          icon={<ArrowRightIcon size={16} />}
          iconPosition="right"
          onClick={() => navigate('/readiness')}
        >
          View Career Readiness Dashboard
        </Button>
      </div>

      <DemoDataBanner
        featureName="Hands-On Project Evidence Submissions"
        backendStateText="Project submissions are retained in current session memory to demonstrate evidence logging. Permanent cloud artifact storage and automated rubric scoring connect in Phase 5."
      />

      {/* Projects Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '2rem', marginBottom: '2.5rem' }}>
        {relevantProjects.map((project) => {
          const submission = projectSubmissions[project.id];
          const isSubmitted = !!submission;

          return (
            <Card
              key={project.id}
              hoverable
              title={project.title}
              subtitle={
                <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.2rem' }}>
                  <Badge variant={project.difficulty === 'ADVANCED' ? 'critical' : 'warning'} size="sm">
                    {project.difficulty} Level
                  </Badge>
                  <Badge variant="neutral" size="sm">
                    ~{project.estimatedEffortHours} hrs effort
                  </Badge>
                </div>
              }
              action={
                isSubmitted ? (
                  <Badge variant="success">Evidence Logged ✓</Badge>
                ) : (
                  <Badge variant="outline">Pending Submission</Badge>
                )
              }
              footer={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.82rem', color: '#5B6876' }}>
                    {isSubmitted ? 'Deliverable on file' : 'No submission yet'}
                  </span>
                  <Button
                    variant={isSubmitted ? 'outline' : 'primary'}
                    size="sm"
                    icon={<AwardIcon size={14} />}
                    onClick={() => openSubmissionModal(project)}
                  >
                    {isSubmitted ? 'Edit Evidence Link' : 'Submit Evidence'}
                  </Button>
                </div>
              }
            >
              <p style={{ color: '#5B6876', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1.25rem' }}>
                {project.description}
              </p>

              <div style={{ marginBottom: '1.25rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#001A47', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                  Demonstrated Competencies:
                </span>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                  {project.targetSkills.map((skill, sIdx) => (
                    <Badge key={sIdx} variant="info" size="sm">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <span style={{ fontSize: '0.78rem', fontWeight: 600, color: '#001A47', textTransform: 'uppercase', display: 'block', marginBottom: '0.4rem' }}>
                  Expected Deliverables:
                </span>
                <ul style={{ paddingLeft: '1.2rem', fontSize: '0.85rem', color: '#5B6876', lineHeight: 1.4 }}>
                  {project.deliverables.map((d, dIdx) => (
                    <li key={dIdx}>{d}</li>
                  ))}
                </ul>
              </div>

              {isSubmitted && (
                <div
                  style={{
                    marginTop: '1rem',
                    padding: '0.75rem',
                    backgroundColor: '#E8F5ED',
                    borderRadius: '6px',
                    fontSize: '0.82rem',
                    color: '#107E3E'
                  }}
                >
                  <strong>Submitted Artifact:</strong>{' '}
                  <a
                    href={submission.submissionUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{ color: '#107E3E', textDecoration: 'underline' }}
                  >
                    {submission.submissionUrl}
                  </a>
                </div>
              )}
            </Card>
          );
        })}
      </div>

      {/* Navigation Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Button variant="ghost" icon={<ArrowLeftIcon size={16} />} onClick={() => navigate('/learning')}>
          Back to Learning Plan
        </Button>
        <Button
          variant="primary"
          size="lg"
          icon={<ArrowRightIcon size={18} />}
          iconPosition="right"
          onClick={() => navigate('/readiness')}
        >
          Proceed to Career Readiness Dashboard →
        </Button>
      </div>

      {/* Submission Modal */}
      <Modal
        isOpen={submissionModalOpen}
        onClose={() => setSubmissionModalOpen(false)}
        title={activeProject ? `Submit Evidence: ${activeProject.title}` : 'Submit Project Deliverable'}
      >
        <form onSubmit={handleSaveSubmission}>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.4rem', color: '#001A47' }}>
              Deliverable URL (GitHub / Google Drive / Public Sandbox Link) *
            </label>
            <input
              type="url"
              placeholder="https://github.com/username/sap-s4hana-project"
              value={submissionUrl}
              onChange={(e) => setSubmissionUrl(e.target.value)}
              style={{ width: '100%' }}
              required
            />
            <span style={{ fontSize: '0.78rem', color: '#8492A0', marginTop: '0.25rem', display: 'block' }}>
              Ensure your link is publicly viewable for evaluator assessment.
            </span>
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.4rem', color: '#001A47' }}>
              Technical Reflection & Implementation Commentary *
            </label>
            <textarea
              rows={5}
              placeholder="Explain how you addressed the business requirements, customized the system or wrote the code, and how this scenario bridges your transferable background..."
              value={reflectionText}
              onChange={(e) => setReflectionText(e.target.value)}
              style={{ width: '100%', resize: 'vertical' }}
              required
            />
          </div>

          <div
            style={{
              padding: '0.75rem 1rem',
              backgroundColor: '#FEF9F3',
              border: '1px solid #FCD4B2',
              borderRadius: '6px',
              fontSize: '0.8rem',
              color: '#873E04',
              marginBottom: '1.5rem'
            }}
          >
            <strong>Note on Persistence:</strong> In this foundation phase, your submission is tracked in active session state. Permanent PostgreSQL database persistence will connect in the next phase.
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <Button type="button" variant="ghost" onClick={() => setSubmissionModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save Project Evidence
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
