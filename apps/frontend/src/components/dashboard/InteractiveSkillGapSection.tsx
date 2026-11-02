import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExtendedCareerRole } from '../../demo/demoCareers';
import { ExtractedSkillItem, ProficiencyLevel } from '@career-orchestrator/shared';
import { DEMO_LEARNING_MODULES } from '../../demo/demoLearning';
import { DEMO_PROJECTS } from '../../demo/demoProjects';
import {
  BookOpenIcon,
  AwardIcon,
  ArrowRightIcon
} from '../common/Icons';

interface InteractiveSkillGapSectionProps {
  targetRole: ExtendedCareerRole;
  skills: ExtractedSkillItem[];
  onNavigateToLearning?: () => void;
  onNavigateToProjects: () => void;
}

type GapSeverity = 'CRITICAL' | 'IMPORTANT' | 'PREFERRED' | 'COMPLETED';

interface EvaluatedGapItem {
  id: string;
  name: string;
  category: string;
  isMandatory: boolean;
  requiredLevel: ProficiencyLevel;
  candidateLevel: string;
  severity: GapSeverity;
  weight: number;
  matchedConfirmedSkill?: ExtractedSkillItem;
  suggestedAction: string;
  curatedResource?: typeof DEMO_LEARNING_MODULES[0];
  curatedProject?: typeof DEMO_PROJECTS[0];
}

const PROFICIENCY_RANK: Record<ProficiencyLevel, number> = {
  NOVICE: 1,
  INTERMEDIATE: 2,
  ADVANCED: 3,
  EXPERT: 4
};

export const InteractiveSkillGapSection: React.FC<InteractiveSkillGapSectionProps> = ({
  targetRole,
  skills,
  onNavigateToLearning: _onNavigateToLearning,
  onNavigateToProjects
}) => {
  const navigate = useNavigate();
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'CRITICAL' | 'IMPORTANT' | 'PREFERRED' | 'COMPLETED'>('ALL');
  const [expandedGapId, setExpandedGapId] = useState<string | null>(null);

  const confirmedSkills = skills.filter((s) => s.isConfirmed && s.reviewStatus === 'CONFIRMED');

  // Evaluate each required competency of targetRole
  const evaluatedGaps: EvaluatedGapItem[] = targetRole.requiredSkills.map((req, idx) => {
    const reqLower = req.skillName.toLowerCase();
    const matchedConfirmed = confirmedSkills.find(
      (cs) => cs.name.toLowerCase().includes(reqLower) || reqLower.includes(cs.name.toLowerCase())
    );

    let severity: GapSeverity = 'CRITICAL';
    let candidateLevel = 'Unverified / None';
    let suggestedAction = 'Begin Foundational Coursework';

    if (matchedConfirmed && matchedConfirmed.proficiency) {
      candidateLevel = matchedConfirmed.proficiency;
      const candidateRank = PROFICIENCY_RANK[matchedConfirmed.proficiency] || 1;
      const requiredRank = PROFICIENCY_RANK[req.minimumLevel] || 2;

      if (candidateRank >= requiredRank) {
        severity = 'COMPLETED';
        suggestedAction = 'Requirement Met — Validated';
      } else {
        severity = req.isMandatory ? 'IMPORTANT' : 'PREFERRED';
        suggestedAction = 'Advance Proficiency Level via Hands-on Challenge';
      }
    } else {
      severity = req.isMandatory ? 'CRITICAL' : 'PREFERRED';
      suggestedAction = 'Bridge Core Competency via Verified Learning Module';
    }

    // Find relevant learning module & project
    const curatedResource = DEMO_LEARNING_MODULES.find(
      (m) =>
        m.roleSlug === targetRole.slug ||
        m.targetSkill.toLowerCase().includes(reqLower) ||
        reqLower.includes(m.targetSkill.toLowerCase())
    );

    const curatedProject = DEMO_PROJECTS.find(
      (p) =>
        p.roleSlug === targetRole.slug ||
        p.targetSkills.some((ts) => ts.toLowerCase().includes(reqLower) || reqLower.includes(ts.toLowerCase()))
    );

    return {
      id: req.skillId || `gap-${idx}`,
      name: req.skillName,
      category: req.category.replace(/_/g, ' '),
      isMandatory: req.isMandatory,
      requiredLevel: req.minimumLevel,
      candidateLevel,
      severity,
      weight: req.weight || 1,
      matchedConfirmedSkill: matchedConfirmed,
      suggestedAction,
      curatedResource,
      curatedProject
    };
  });

  const filteredGaps = evaluatedGaps.filter((item) => {
    if (activeFilter === 'ALL') return true;
    return item.severity === activeFilter;
  });

  const criticalCount = evaluatedGaps.filter((g) => g.severity === 'CRITICAL').length;
  const importantCount = evaluatedGaps.filter((g) => g.severity === 'IMPORTANT').length;
  const preferredCount = evaluatedGaps.filter((g) => g.severity === 'PREFERRED').length;
  const completedCount = evaluatedGaps.filter((g) => g.severity === 'COMPLETED').length;

  return (
    <div
      id="skill-gaps"
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #D9E1E8',
        borderRadius: '12px',
        padding: '1.5rem',
        boxShadow: '0 2px 8px rgba(0, 26, 71, 0.05)'
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '1.25rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#001A47', margin: 0 }}>
              Interactive Skill Gap Matrix
            </h3>
            <span
              style={{
                fontSize: '0.75rem',
                backgroundColor: criticalCount > 0 ? '#FEF3E8' : '#E8F5ED',
                color: criticalCount > 0 ? '#E9730C' : '#107E3E',
                padding: '0.2rem 0.55rem',
                borderRadius: '12px',
                fontWeight: 700
              }}
            >
              {criticalCount} Critical Gaps
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#5B6876', margin: '0.2rem 0 0' }}>
            Competency comparison for <strong>{targetRole.title}</strong>. Click any row to inspect learning resources and practical projects.
          </p>
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
          {[
            { id: 'ALL', label: `All (${evaluatedGaps.length})` },
            { id: 'CRITICAL', label: `Critical (${criticalCount})`, color: '#BB0000' },
            { id: 'IMPORTANT', label: `Important (${importantCount})`, color: '#E9730C' },
            { id: 'PREFERRED', label: `Preferred (${preferredCount})`, color: '#0A6ED1' },
            { id: 'COMPLETED', label: `Met (${completedCount})`, color: '#107E3E' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveFilter(tab.id as typeof activeFilter)}
              style={{
                padding: '0.3rem 0.65rem',
                borderRadius: '16px',
                fontSize: '0.75rem',
                fontWeight: 600,
                backgroundColor: activeFilter === tab.id ? '#0A6ED1' : '#F8FAFC',
                color: activeFilter === tab.id ? '#FFFFFF' : tab.color || '#5B6876',
                border: activeFilter === tab.id ? '1px solid #0A6ED1' : '1px solid #D9E1E8',
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Gap Table */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {filteredGaps.map((gap) => {
          const isExpanded = expandedGapId === gap.id;

          const severityStyles: Record<GapSeverity, { bg: string; color: string; border: string }> = {
            CRITICAL: { bg: '#FDE8E8', color: '#BB0000', border: '#F5B8B8' },
            IMPORTANT: { bg: '#FEF3E8', color: '#E9730C', border: '#F5C28C' },
            PREFERRED: { bg: '#EBF3FB', color: '#0A6ED1', border: '#B8D8F8' },
            COMPLETED: { bg: '#E8F5ED', color: '#107E3E', border: '#B8E3C6' }
          };

          const sStyle = severityStyles[gap.severity];

          return (
            <div
              key={gap.id}
              style={{
                border: isExpanded ? '1px solid #0A6ED1' : '1px solid #EDF1F5',
                borderRadius: '8px',
                backgroundColor: isExpanded ? '#F8FAFF' : '#FFFFFF',
                overflow: 'hidden',
                transition: 'all 0.15s ease'
              }}
            >
              {/* Row Header */}
              <div
                onClick={() => setExpandedGapId(isExpanded ? null : gap.id)}
                style={{
                  padding: '0.85rem 1.15rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  gap: '1rem',
                  flexWrap: 'wrap'
                }}
              >
                {/* Left: Skill name & Category */}
                <div style={{ minWidth: '220px', flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 700, fontSize: '0.92rem', color: '#001A47' }}>
                      {gap.name}
                    </span>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        padding: '0.15rem 0.45rem',
                        borderRadius: '4px',
                        backgroundColor: sStyle.bg,
                        color: sStyle.color,
                        fontWeight: 700,
                        border: `1px solid ${sStyle.border}`
                      }}
                    >
                      {gap.severity}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#5B6876', marginTop: '0.15rem' }}>
                    {gap.category} • Weight: {gap.weight}x
                  </div>
                </div>

                {/* Center: Candidate Level vs Target Level */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', fontSize: '0.8rem' }}>
                  <div>
                    <span style={{ color: '#5B6876', fontSize: '0.7rem', display: 'block' }}>Candidate Level</span>
                    <span
                      style={{
                        fontWeight: 700,
                        color: gap.severity === 'COMPLETED' ? '#107E3E' : '#222B35'
                      }}
                    >
                      {gap.candidateLevel}
                    </span>
                  </div>

                  <span style={{ color: '#8492A0', fontSize: '0.85rem' }}>➔</span>

                  <div>
                    <span style={{ color: '#5B6876', fontSize: '0.7rem', display: 'block' }}>Required Level</span>
                    <span style={{ fontWeight: 700, color: '#0A6ED1' }}>{gap.requiredLevel}</span>
                  </div>
                </div>

                {/* Right: Suggested Action & Expand Icon */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span
                    style={{
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      color: gap.severity === 'COMPLETED' ? '#107E3E' : '#0A6ED1',
                      backgroundColor: gap.severity === 'COMPLETED' ? '#E8F5ED' : '#EBF3FB',
                      padding: '0.25rem 0.65rem',
                      borderRadius: '4px'
                    }}
                  >
                    {gap.suggestedAction}
                  </span>

                  <span
                    style={{
                      fontSize: '0.75rem',
                      color: '#0A6ED1',
                      fontWeight: 700,
                      transform: isExpanded ? 'rotate(180deg)' : 'none',
                      transition: 'transform 0.15s ease'
                    }}
                  >
                    ▼
                  </span>
                </div>
              </div>

              {/* Expanded Detail Panel */}
              {isExpanded && (
                <div
                  style={{
                    borderTop: '1px solid #E2E8F0',
                    backgroundColor: '#F8FAFC',
                    padding: '1.25rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem'
                  }}
                >
                  {/* Evidence & Rationale */}
                  <div style={{ fontSize: '0.82rem', color: '#334155', lineHeight: 1.5 }}>
                    <strong>Role Rationale:</strong> This competency is {gap.isMandatory ? 'mandatory' : 'preferred'} for {targetRole.title}. Demonstrating proficiency at the {gap.requiredLevel} level ensures baseline operational compliance in enterprise SAP environments.
                    {gap.matchedConfirmedSkill?.evidenceSnippet && (
                      <div
                        style={{
                          marginTop: '0.5rem',
                          padding: '0.5rem 0.75rem',
                          backgroundColor: '#FFFFFF',
                          borderLeft: '3px solid #107E3E',
                          borderRadius: '4px',
                          fontStyle: 'italic',
                          color: '#222B35'
                        }}
                      >
                        <strong>Confirmed Candidate Evidence:</strong> &quot;{gap.matchedConfirmedSkill.evidenceSnippet}&quot;
                      </div>
                    )}
                  </div>

                  {/* Curated Pathways & Practical Project Actions */}
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                      gap: '0.85rem'
                    }}
                  >
                    {/* Learning Resource Card */}
                    {gap.curatedResource && (
                      <div
                        style={{
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #D9E1E8',
                          borderRadius: '6px',
                          padding: '0.85rem',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          gap: '0.5rem'
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#633CA3', fontSize: '0.75rem', fontWeight: 700 }}>
                            <BookOpenIcon size={14} color="#633CA3" /> Verified Learning Course
                          </div>
                          <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#001A47', marginTop: '0.2rem' }}>
                            [{gap.curatedResource.code}] {gap.curatedResource.title}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#5B6876', marginTop: '0.15rem' }}>
                            {gap.curatedResource.provider} • {gap.curatedResource.estimatedHours} hrs
                          </div>
                        </div>

                        <a
                          href={gap.curatedResource.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: '#633CA3',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            textDecoration: 'none'
                          }}
                        >
                          Launch Official SAP Learning Roadmap <ArrowRightIcon size={12} color="#633CA3" />
                        </a>
                      </div>
                    )}

                    {/* Practical Project Card */}
                    {gap.curatedProject && (
                      <div
                        style={{
                          backgroundColor: '#FFFFFF',
                          border: '1px solid #D9E1E8',
                          borderRadius: '6px',
                          padding: '0.85rem',
                          display: 'flex',
                          flexDirection: 'column',
                          justifyContent: 'space-between',
                          gap: '0.5rem'
                        }}
                      >
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#E9730C', fontSize: '0.75rem', fontWeight: 700 }}>
                            <AwardIcon size={14} color="#E9730C" /> Practical Challenge Workspace
                          </div>
                          <div style={{ fontWeight: 700, fontSize: '0.85rem', color: '#001A47', marginTop: '0.2rem' }}>
                            {gap.curatedProject.title}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#5B6876', marginTop: '0.15rem' }}>
                            Difficulty: {gap.curatedProject.difficulty} • {gap.curatedProject.estimatedEffortHours} hrs
                          </div>
                        </div>

                        <button
                          onClick={() => {
                            onNavigateToProjects();
                            navigate('/projects');
                          }}
                          style={{
                            fontSize: '0.75rem',
                            fontWeight: 600,
                            color: '#E9730C',
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            padding: 0
                          }}
                        >
                          Open Workspace & Submit Deliverable <ArrowRightIcon size={12} color="#E9730C" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Explore Gap link */}
      <div
        style={{
          marginTop: '1.25rem',
          paddingTop: '1rem',
          borderTop: '1px solid #EDF1F5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          fontSize: '0.85rem'
        }}
      >
        <span style={{ color: '#5B6876' }}>
          Deep-dive into 6-category gap matrix and prerequisite warnings
        </span>
        <button
          onClick={() => navigate('/career-gap')}
          style={{
            color: '#0A6ED1',
            fontWeight: 600,
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.35rem',
            background: 'none',
            border: 'none',
            cursor: 'pointer'
          }}
        >
          Open Comprehensive Gap Analysis <ArrowRightIcon size={14} color="#0A6ED1" />
        </button>
      </div>
    </div>
  );
};
