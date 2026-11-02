import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DEMO_CAREER_ROLES } from '../../demo/demoCareers';
import { DEMO_LEARNING_MODULES } from '../../demo/demoLearning';
import { DEMO_PROJECTS } from '../../demo/demoProjects';
import { ExtractedSkillItem } from '@career-orchestrator/shared';
import {
  SearchIcon,
  CloseIcon,
  BriefcaseIcon,
  BookOpenIcon,
  AwardIcon,
  CheckIcon
} from '../common/Icons';

interface GlobalSearchPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  skills: ExtractedSkillItem[];
  onSelectRole: (slug: string) => void;
  onSelectSkill?: (skill: ExtractedSkillItem) => void;
}

export const GlobalSearchPalette: React.FC<GlobalSearchPaletteProps> = ({
  isOpen,
  onClose,
  skills,
  onSelectRole,
  onSelectSkill
}) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const trimmed = query.trim().toLowerCase();

  // Search Careers
  const matchedCareers = trimmed
    ? DEMO_CAREER_ROLES.filter(
        (r) =>
          r.title.toLowerCase().includes(trimmed) ||
          r.summary.toLowerCase().includes(trimmed) ||
          r.track.toLowerCase().includes(trimmed) ||
          r.requiredSkills.some((s) => s.skillName.toLowerCase().includes(trimmed))
      ).slice(0, 5)
    : DEMO_CAREER_ROLES.slice(0, 3);

  // Search Skills
  const matchedSkills = trimmed
    ? skills.filter(
        (s) =>
          s.name.toLowerCase().includes(trimmed) ||
          s.category.toLowerCase().includes(trimmed) ||
          (s.evidenceSnippet && s.evidenceSnippet.toLowerCase().includes(trimmed))
      ).slice(0, 5)
    : skills.slice(0, 4);

  // Search Learning Modules
  const matchedLearning = trimmed
    ? DEMO_LEARNING_MODULES.filter(
        (l) =>
          l.title.toLowerCase().includes(trimmed) ||
          l.code.toLowerCase().includes(trimmed) ||
          l.targetSkill.toLowerCase().includes(trimmed)
      ).slice(0, 4)
    : DEMO_LEARNING_MODULES.slice(0, 3);

  // Search Projects
  const matchedProjects = trimmed
    ? DEMO_PROJECTS.filter(
        (p) =>
          p.title.toLowerCase().includes(trimmed) ||
          p.description.toLowerCase().includes(trimmed) ||
          p.targetSkills.some((ts) => ts.toLowerCase().includes(trimmed))
      ).slice(0, 3)
    : [];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        backgroundColor: 'rgba(0, 26, 71, 0.65)',
        backdropFilter: 'blur(4px)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        padding: '5rem 1rem 2rem'
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: '12px',
          width: '100%',
          maxWidth: '680px',
          boxShadow: '0 20px 40px rgba(0, 26, 71, 0.25)',
          border: '1px solid #D9E1E8',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column',
          maxHeight: '80vh'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '1rem 1.25rem',
            borderBottom: '1px solid #E2E8F0',
            backgroundColor: '#F8FAFC'
          }}
        >
          <SearchIcon size={20} color="#0A6ED1" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search 14 SAP careers, confirmed skills, learning resources..."
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: '1.05rem',
              color: '#001A47',
              fontWeight: 500
            }}
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              style={{ color: '#8492A0', padding: '0.25rem' }}
              title="Clear search"
            >
              <CloseIcon size={16} />
            </button>
          )}
          <span
            style={{
              fontSize: '0.75rem',
              backgroundColor: '#E2E8F0',
              color: '#5B6876',
              padding: '0.2rem 0.5rem',
              borderRadius: '4px',
              fontWeight: 600
            }}
          >
            ESC
          </span>
        </div>

        {/* Results Scroll Area */}
        <div style={{ overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Section: Career Roles */}
          {matchedCareers.length > 0 && (
            <div>
              <div
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: '#5B6876',
                  letterSpacing: '0.05em',
                  marginBottom: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <BriefcaseIcon size={14} color="#0A6ED1" /> Target SAP Careers ({matchedCareers.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {matchedCareers.map((role) => (
                  <div
                    key={role.id}
                    onClick={() => {
                      onSelectRole(role.slug);
                      onClose();
                    }}
                    style={{
                      padding: '0.65rem 0.85rem',
                      borderRadius: '8px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #EDF1F5',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#F0F6FC';
                      e.currentTarget.style.borderColor = '#0A6ED1';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#FFFFFF';
                      e.currentTarget.style.borderColor = '#EDF1F5';
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, color: '#001A47', fontSize: '0.9rem' }}>
                        {role.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#5B6876' }}>
                        {role.ecosystem} • {role.track.replace(/_/g, ' ')}
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        color: '#0A6ED1',
                        fontWeight: 600,
                        backgroundColor: '#EBF3FB',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px'
                      }}
                    >
                      Set Target
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Candidate Skills */}
          {matchedSkills.length > 0 && (
            <div>
              <div
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: '#5B6876',
                  letterSpacing: '0.05em',
                  marginBottom: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <CheckIcon size={14} color="#107E3E" /> Extracted Competencies ({matchedSkills.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {matchedSkills.map((skill) => (
                  <div
                    key={skill.id}
                    onClick={() => {
                      if (onSelectSkill) onSelectSkill(skill);
                      onClose();
                    }}
                    style={{
                      padding: '0.65rem 0.85rem',
                      borderRadius: '8px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #EDF1F5',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#F0FDF4';
                      e.currentTarget.style.borderColor = '#107E3E';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#FFFFFF';
                      e.currentTarget.style.borderColor = '#EDF1F5';
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, color: '#001A47', fontSize: '0.9rem' }}>
                        {skill.name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#5B6876' }}>
                        {skill.category.replace(/_/g, ' ')} • {skill.proficiency || 'Uncalibrated'}
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        color: skill.isConfirmed ? '#107E3E' : '#E9730C',
                        fontWeight: 600,
                        backgroundColor: skill.isConfirmed ? '#E8F5ED' : '#FEF3E8',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px'
                      }}
                    >
                      {skill.isConfirmed ? 'Confirmed' : 'Suggested'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Learning Resources */}
          {matchedLearning.length > 0 && (
            <div>
              <div
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: '#5B6876',
                  letterSpacing: '0.05em',
                  marginBottom: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <BookOpenIcon size={14} color="#633CA3" /> Verified Learning Roadmaps ({matchedLearning.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {matchedLearning.map((mod) => (
                  <a
                    key={mod.id}
                    href={mod.externalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={onClose}
                    style={{
                      padding: '0.65rem 0.85rem',
                      borderRadius: '8px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #EDF1F5',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#F2ECFA';
                      e.currentTarget.style.borderColor = '#633CA3';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#FFFFFF';
                      e.currentTarget.style.borderColor = '#EDF1F5';
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, color: '#001A47', fontSize: '0.9rem' }}>
                        [{mod.code}] {mod.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#5B6876' }}>
                        {mod.provider} • {mod.estimatedHours} hrs • {mod.level}
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        color: '#633CA3',
                        fontWeight: 600,
                        backgroundColor: '#F2ECFA',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px'
                      }}
                    >
                      Open Course
                    </span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Section: Practical Projects */}
          {matchedProjects.length > 0 && (
            <div>
              <div
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  color: '#5B6876',
                  letterSpacing: '0.05em',
                  marginBottom: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem'
                }}
              >
                <AwardIcon size={14} color="#E9730C" /> Practical Projects ({matchedProjects.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {matchedProjects.map((proj) => (
                  <div
                    key={proj.id}
                    onClick={() => {
                      navigate('/projects');
                      onClose();
                    }}
                    style={{
                      padding: '0.65rem 0.85rem',
                      borderRadius: '8px',
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #EDF1F5',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = '#FEF3E8';
                      e.currentTarget.style.borderColor = '#E9730C';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = '#FFFFFF';
                      e.currentTarget.style.borderColor = '#EDF1F5';
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, color: '#001A47', fontSize: '0.9rem' }}>
                        {proj.title}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#5B6876' }}>
                        {proj.difficulty} • {proj.estimatedEffortHours} hrs
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        color: '#E9730C',
                        fontWeight: 600,
                        backgroundColor: '#FEF3E8',
                        padding: '0.2rem 0.5rem',
                        borderRadius: '4px'
                      }}
                    >
                      View Workspace
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {matchedCareers.length === 0 && matchedSkills.length === 0 && matchedLearning.length === 0 && (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#5B6876' }}>
              No matches found for &quot;{query}&quot;. Try searching for &quot;Finance&quot;, &quot;ABAP&quot;, &quot;SQL&quot;, or &quot;S/4HANA&quot;.
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div
          style={{
            padding: '0.75rem 1.25rem',
            borderTop: '1px solid #E2E8F0',
            backgroundColor: '#F8FAFC',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            fontSize: '0.75rem',
            color: '#5B6876'
          }}
        >
          <span>Tip: Press ESC to dismiss palette</span>
          <span>Curated SAP Hackfest 2026 Engine</span>
        </div>
      </div>
    </div>
  );
};
