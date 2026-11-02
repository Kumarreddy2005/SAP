import React, { useState } from 'react';
import { PracticalProjectDefinition, ProjectSubmissionInput } from '@career-orchestrator/shared';
import { CloseIcon, UploadCloudIcon } from '../common/Icons';

interface ProjectSubmitModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: PracticalProjectDefinition | null;
  profileId: string;
  onSubmit: (input: ProjectSubmissionInput) => Promise<void>;
}

export const ProjectSubmitModal: React.FC<ProjectSubmitModalProps> = ({
  isOpen,
  onClose,
  project,
  profileId,
  onSubmit
}) => {
  const [repositoryUrl, setRepositoryUrl] = useState('');
  const [liveDemoUrl, setLiveDemoUrl] = useState('');
  const [learningReflection, setLearningReflection] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !project) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!learningReflection.trim() || learningReflection.trim().length < 20) {
      setError('Please provide a meaningful reflection of your learning (at least 20 characters).');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await onSubmit({
        projectId: project.id,
        profileId: profileId || 'demo-profile',
        repositoryUrl: repositoryUrl.trim() || undefined,
        liveDemoUrl: liveDemoUrl.trim() || undefined,
        projectExplanation: `Evidence submission for ${project.title}. Demonstrates competencies in ${project.targetSkills.join(', ')}.`,
        skillsDemonstrated: project.targetSkills,
        learningReflection: learningReflection.trim()
      });
      onClose();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Submission failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 26, 71, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 1rem'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '640px',
          boxShadow: '0 20px 40px rgba(0, 26, 71, 0.25)',
          border: '1px solid #D9E1E8',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '1.25rem 1.5rem',
            borderBottom: '1px solid #E2E8F0',
            backgroundColor: '#001A47',
            color: '#FFFFFF',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>
              Submit Practical Deliverables
            </h2>
            <p style={{ fontSize: '0.82rem', color: '#C4D5EA', margin: '0.2rem 0 0' }}>
              {project.title}
            </p>
          </div>
          <button
            onClick={onClose}
            style={{
              color: '#FFFFFF',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '6px',
              padding: '0.4rem',
              display: 'flex',
              alignItems: 'center'
            }}
          >
            <CloseIcon size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
          {error && (
            <div
              style={{
                backgroundColor: '#FDE8E8',
                color: '#BB0000',
                padding: '0.75rem',
                borderRadius: '6px',
                fontSize: '0.85rem'
              }}
            >
              {error}
            </div>
          )}

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#001A47', marginBottom: '0.35rem' }}>
              Artifact Repository / Code URL (Optional)
            </label>
            <input
              type="url"
              value={repositoryUrl}
              onChange={(e) => setRepositoryUrl(e.target.value)}
              placeholder="https://github.com/your-username/sap-s4hana-blueprint"
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#001A47', marginBottom: '0.35rem' }}>
              Documentation / Diagram / Live Demo URL (Optional)
            </label>
            <input
              type="url"
              value={liveDemoUrl}
              onChange={(e) => setLiveDemoUrl(e.target.value)}
              placeholder="https://drive.google.com/file/... or live demo"
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#001A47', marginBottom: '0.35rem' }}>
              Learning Reflection & Implementation Summary <span style={{ color: '#BB0000' }}>*</span>
            </label>
            <textarea
              rows={4}
              value={learningReflection}
              onChange={(e) => setLearningReflection(e.target.value)}
              placeholder="Describe your design decisions, how you structured the organizational units or code, and any challenges you resolved..."
              style={{ width: '100%', resize: 'vertical' }}
              required
            />
            <span style={{ fontSize: '0.72rem', color: '#64748B', display: 'block', marginTop: '0.25rem' }}>
              Minimum 20 characters required. Scored against rubric criteria.
            </span>
          </div>

          {/* Submission Buttons */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'flex-end',
              gap: '0.75rem',
              marginTop: '0.5rem'
            }}
          >
            <button
              type="button"
              onClick={onClose}
              style={{
                padding: '0.55rem 1rem',
                borderRadius: '6px',
                border: '1px solid #D9E1E8',
                backgroundColor: '#FFFFFF',
                color: '#5B6876',
                fontWeight: 600,
                fontSize: '0.85rem',
                cursor: 'pointer'
              }}
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                padding: '0.55rem 1.25rem',
                borderRadius: '6px',
                backgroundColor: '#0A6ED1',
                color: '#FFFFFF',
                fontWeight: 600,
                fontSize: '0.85rem',
                border: 'none',
                cursor: isSubmitting ? 'not-allowed' : 'pointer',
                opacity: isSubmitting ? 0.7 : 1,
                display: 'flex',
                alignItems: 'center',
                gap: '0.4rem'
              }}
            >
              <UploadCloudIcon size={16} />
              <span>{isSubmitting ? 'Submitting...' : 'Submit Evidence'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
