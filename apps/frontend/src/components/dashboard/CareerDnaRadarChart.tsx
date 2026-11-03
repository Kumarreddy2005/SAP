import React, { useState } from 'react';
import { ExtractedSkillItem, SkillCategory, ProficiencyLevel } from '@career-orchestrator/shared';
import { ExtendedCareerRole } from '../../demo/demoCareers';
import { InfoIcon, CheckIcon, AlertTriangleIcon } from '../common/Icons';

interface CareerDnaRadarChartProps {
  skills: ExtractedSkillItem[];
  targetRole: ExtendedCareerRole;
}

interface CategoryMetric {
  category: SkillCategory;
  label: string;
  candidateScore: number; // 0 to 100
  targetScore: number; // 0 to 100
  confirmedCount: number;
  totalExtracted: number;
  hasSufficientData: boolean;
  confirmedSkills: ExtractedSkillItem[];
  missingRoleSkills: string[];
}

const CATEGORY_DEFINITIONS: { category: SkillCategory; label: string }[] = [
  { category: 'SAP_FUNCTIONAL', label: 'SAP Functional' },
  { category: 'SAP_TECHNICAL', label: 'SAP Technical' },
  { category: 'SOFTWARE_DEV', label: 'Software Eng' },
  { category: 'DATA_ANALYTICS', label: 'Data & Analytics' },
  { category: 'DOMAIN_BUSINESS', label: 'Domain & Biz' },
  { category: 'TRANSFERABLE_SOFT', label: 'Soft Skills' }
];

const PROFICIENCY_SCORE_MAP: Record<ProficiencyLevel, number> = {
  NOVICE: 25,
  INTERMEDIATE: 50,
  ADVANCED: 75,
  EXPERT: 100
};

export const CareerDnaRadarChart: React.FC<CareerDnaRadarChartProps> = ({ skills, targetRole }) => {
  const [showCandidate, setShowCandidate] = useState(true);
  const [showTarget, setShowTarget] = useState(true);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [selectedCategoryIndex, setSelectedCategoryIndex] = useState<number>(0);

  // Compute metrics for each category
  const metrics: CategoryMetric[] = CATEGORY_DEFINITIONS.map(({ category, label }) => {
    // 1. Candidate confirmed skills in this category
    const categorySkills = skills.filter((s) => s.category === category);
    const confirmedSkills = categorySkills.filter((s) => s.isConfirmed && s.reviewStatus === 'CONFIRMED');

    let candidateScore = 0;
    if (confirmedSkills.length > 0) {
      const sumProficiency = confirmedSkills.reduce((acc, s) => {
        const score = s.proficiency ? PROFICIENCY_SCORE_MAP[s.proficiency] || 40 : 40;
        return acc + score;
      }, 0);
      candidateScore = Math.min(100, Math.round(sumProficiency / confirmedSkills.length));
    }

    // 2. Target role requirement for this category
    const roleReqs = targetRole.requiredSkills.filter((r) => r.category === category);
    let targetScore = 0;
    if (roleReqs.length > 0) {
      const totalWeight = roleReqs.reduce((acc, r) => acc + (r.weight || 1), 0);
      const weightedSum = roleReqs.reduce((acc, r) => {
        const reqScore = PROFICIENCY_SCORE_MAP[r.minimumLevel] || 50;
        return acc + reqScore * (r.weight || 1);
      }, 0);
      targetScore = Math.round(weightedSum / totalWeight);
    } else {
      // If role does not strictly mandate this category, benchmark is lower
      targetScore = 20;
    }

    // Missing skills in target role
    const confirmedNames = confirmedSkills.map((s) => s.name.toLowerCase());
    const missingRoleSkills = roleReqs
      .filter((r) => !confirmedNames.some((cn) => cn.includes(r.skillName.toLowerCase()) || r.skillName.toLowerCase().includes(cn)))
      .map((r) => r.skillName);

    return {
      category,
      label,
      candidateScore,
      targetScore,
      confirmedCount: confirmedSkills.length,
      totalExtracted: categorySkills.length,
      hasSufficientData: confirmedSkills.length > 0,
      confirmedSkills,
      missingRoleSkills
    };
  });

  // Radar geometry
  const size = 340;
  const cx = size / 2;
  const cy = size / 2;
  const radius = 115;
  const totalAxes = metrics.length;

  const getCoordinates = (value: number, index: number) => {
    const angle = -Math.PI / 2 + (index * (2 * Math.PI)) / totalAxes;
    const r = (value / 100) * radius;
    return {
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle)
    };
  };

  // Generate SVG polygon points string
  const candidatePoints = metrics
    .map((m, i) => {
      const coord = getCoordinates(m.candidateScore, i);
      return `${coord.x},${coord.y}`;
    })
    .join(' ');

  const targetPoints = metrics
    .map((m, i) => {
      const coord = getCoordinates(m.targetScore, i);
      return `${coord.x},${coord.y}`;
    })
    .join(' ');

  const selectedMetric = metrics[selectedCategoryIndex];

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        border: '1px solid #D9E1E8',
        borderRadius: '12px',
        padding: '1.5rem',
        boxShadow: '0 2px 8px rgba(0, 26, 71, 0.05)',
        display: 'flex',
        flexDirection: 'column',
        height: '100%'
      }}
    >
      {/* Title & Legend Toggles */}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          marginBottom: '1rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#001A47', margin: 0 }}>
              Career DNA Radar
            </h3>
            <span
              style={{
                fontSize: '0.7rem',
                backgroundColor: '#EBF3FB',
                color: '#0A6ED1',
                padding: '0.15rem 0.45rem',
                borderRadius: '4px',
                fontWeight: 600
              }}
            >
              6 Competency Dimensions
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#5B6876', margin: '0.2rem 0 0' }}>
            Confirmed candidate competencies vs. benchmark requirement for {targetRole.title}
          </p>
        </div>

        {/* Legend buttons */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            onClick={() => setShowCandidate(!showCandidate)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.25rem 0.6rem',
              borderRadius: '16px',
              fontSize: '0.75rem',
              fontWeight: 600,
              backgroundColor: showCandidate ? '#E8F5ED' : '#F5F6F7',
              color: showCandidate ? '#107E3E' : '#8492A0',
              border: showCandidate ? '1px solid #107E3E' : '1px solid #D9E1E8',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: showCandidate ? '#107E3E' : '#8492A0'
              }}
            />
            Candidate Confirmed
          </button>

          <button
            onClick={() => setShowTarget(!showTarget)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              padding: '0.25rem 0.6rem',
              borderRadius: '16px',
              fontSize: '0.75rem',
              fontWeight: 600,
              backgroundColor: showTarget ? '#EBF3FB' : '#F5F6F7',
              color: showTarget ? '#0A6ED1' : '#8492A0',
              border: showTarget ? '1px solid #0A6ED1' : '1px solid #D9E1E8',
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: showTarget ? '#0A6ED1' : '#8492A0'
              }}
            />
            Target Benchmark
          </button>
        </div>
      </div>

      {/* Chart and Detail Pane Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
          gap: '1.5rem',
          alignItems: 'center'
        }}
        className="radar-grid"
      >
        {/* SVG Radar */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', width: '100%', maxWidth: `${size}px`, margin: '0 auto' }}>
          <svg viewBox={`0 0 ${size} ${size}`} style={{ width: '100%', maxWidth: `${size}px`, height: 'auto', display: 'block' }}>
            {/* Concentric rings at 20%, 40%, 60%, 80%, 100% */}
            {[20, 40, 60, 80, 100].map((level) => {
              const polyPoints = metrics
                .map((_, i) => {
                  const c = getCoordinates(level, i);
                  return `${c.x},${c.y}`;
                })
                .join(' ');
              return (
                <polygon
                  key={level}
                  points={polyPoints}
                  fill="none"
                  stroke="#E2E8F0"
                  strokeWidth="1"
                  strokeDasharray={level === 100 ? 'none' : '3 3'}
                />
              );
            })}

            {/* Axis Lines & Labels */}
            {metrics.map((m, i) => {
              const edgeCoord = getCoordinates(100, i);
              const labelCoord = getCoordinates(118, i);
              const isSelected = selectedCategoryIndex === i;

              return (
                <g key={m.category}>
                  {/* Axis line */}
                  <line
                    x1={cx}
                    y1={cy}
                    x2={edgeCoord.x}
                    y2={edgeCoord.y}
                    stroke="#CBD5E1"
                    strokeWidth="1"
                  />

                  {/* Clickable Label on perimeter */}
                  <text
                    x={labelCoord.x}
                    y={labelCoord.y}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fontSize="10.5"
                    fontWeight={isSelected ? '700' : '500'}
                    fill={isSelected ? '#0A6ED1' : '#475569'}
                    cursor="pointer"
                    onClick={() => setSelectedCategoryIndex(i)}
                  >
                    {m.label}
                  </text>
                </g>
              );
            })}

            {/* Target Role Benchmark Polygon */}
            {showTarget && (
              <polygon
                points={targetPoints}
                fill="rgba(10, 110, 209, 0.08)"
                stroke="#0A6ED1"
                strokeWidth="2"
                strokeDasharray="4 4"
              />
            )}

            {/* Candidate Confirmed Polygon */}
            {showCandidate && (
              <polygon
                points={candidatePoints}
                fill="rgba(16, 126, 62, 0.22)"
                stroke="#107E3E"
                strokeWidth="2.5"
                style={{ transition: 'all 0.3s ease' }}
              />
            )}

            {/* Vertex Nodes & Tooltips */}
            {metrics.map((m, i) => {
              const coord = getCoordinates(m.candidateScore, i);
              const isSelected = selectedCategoryIndex === i;
              const isHovered = hoveredIndex === i;

              return (
                <g
                  key={m.category}
                  cursor="pointer"
                  onClick={() => setSelectedCategoryIndex(i)}
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  {/* Pulse ring for selected category */}
                  {isSelected && (
                    <circle
                      cx={coord.x}
                      cy={coord.y}
                      r="9"
                      fill="none"
                      stroke="#0A6ED1"
                      strokeWidth="2"
                      opacity="0.6"
                    />
                  )}
                  {/* Outer circle */}
                  <circle
                    cx={coord.x}
                    cy={coord.y}
                    r={isSelected ? '6' : '4.5'}
                    fill={m.hasSufficientData ? '#107E3E' : '#E9730C'}
                    stroke="#FFFFFF"
                    strokeWidth="2"
                  />
                  {/* Hover tooltip label */}
                  {isHovered && (
                    <g pointerEvents="none">
                      <rect
                        x={coord.x - 45}
                        y={coord.y - 32}
                        width="90"
                        height="24"
                        rx="4"
                        fill="#001A47"
                        opacity="0.9"
                      />
                      <text
                        x={coord.x}
                        y={coord.y - 16}
                        textAnchor="middle"
                        fill="#FFFFFF"
                        fontSize="10"
                        fontWeight="600"
                      >
                        {m.candidateScore}% ({m.confirmedCount} skills)
                      </text>
                    </g>
                  )}
                </g>
              );
            })}
          </svg>
        </div>

        {/* Selected Category Details Card */}
        <div
          style={{
            backgroundColor: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '10px',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.85rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#5B6876', textTransform: 'uppercase' }}>
                Selected Dimension
              </div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#001A47' }}>
                {selectedMetric.label}
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: '#5B6876' }}>Proficiency Match</div>
              <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#107E3E' }}>
                {selectedMetric.candidateScore}%{' '}
                <span style={{ fontSize: '0.75rem', color: '#5B6876', fontWeight: 500 }}>
                  / {selectedMetric.targetScore}% Req
                </span>
              </div>
            </div>
          </div>

          {/* Insufficient data disclosure if 0 confirmed skills */}
          {!selectedMetric.hasSufficientData && (
            <div
              style={{
                backgroundColor: '#FEF3E8',
                border: '1px solid #F5C28C',
                borderRadius: '6px',
                padding: '0.65rem 0.85rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.8rem',
                color: '#8A3B00'
              }}
            >
              <AlertTriangleIcon size={16} color="#E9730C" />
              <span>
                <strong>Insufficient Confirmed Data:</strong> No validated competencies in this dimension. Score reflects unverified state.
              </span>
            </div>
          )}

          {/* Confirmed Skills list */}
          <div>
            <div
              style={{
                fontSize: '0.75rem',
                fontWeight: 700,
                color: '#222B35',
                marginBottom: '0.4rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}
            >
              <CheckIcon size={13} color="#107E3E" />
              Confirmed Competencies ({selectedMetric.confirmedSkills.length})
            </div>

            {selectedMetric.confirmedSkills.length === 0 ? (
              <div style={{ fontSize: '0.8rem', color: '#8492A0', fontStyle: 'italic' }}>
                None confirmed yet for this dimension.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                {selectedMetric.confirmedSkills.map((s) => (
                  <div
                    key={s.id}
                    style={{
                      backgroundColor: '#FFFFFF',
                      border: '1px solid #EDF1F5',
                      borderRadius: '6px',
                      padding: '0.5rem 0.75rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      fontSize: '0.8rem'
                    }}
                  >
                    <div>
                      <span style={{ fontWeight: 600, color: '#001A47' }}>{s.name}</span>
                      {s.evidenceSnippet && (
                        <div
                          style={{
                            fontSize: '0.72rem',
                            color: '#5B6876',
                            fontStyle: 'italic',
                            marginTop: '0.15rem'
                          }}
                        >
                          &quot;{s.evidenceSnippet}&quot;
                        </div>
                      )}
                    </div>
                    <span
                      style={{
                        fontSize: '0.7rem',
                        fontWeight: 700,
                        backgroundColor: '#E8F5ED',
                        color: '#107E3E',
                        padding: '0.15rem 0.45rem',
                        borderRadius: '4px'
                      }}
                    >
                      {s.proficiency || 'Calibrated'}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Missing Skills in this category */}
          {selectedMetric.missingRoleSkills.length > 0 && (
            <div style={{ marginTop: '0.2rem' }}>
              <div
                style={{
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: '#BB0000',
                  marginBottom: '0.35rem'
                }}
              >
                Target Requirements to Bridge ({selectedMetric.missingRoleSkills.length})
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                {selectedMetric.missingRoleSkills.map((mSkill) => (
                  <span
                    key={mSkill}
                    style={{
                      fontSize: '0.72rem',
                      backgroundColor: '#FDE8E8',
                      color: '#BB0000',
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      fontWeight: 600
                    }}
                  >
                    + {mSkill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Dimension Guidance */}
          <div
            style={{
              fontSize: '0.75rem',
              color: '#5B6876',
              borderTop: '1px solid #E2E8F0',
              paddingTop: '0.65rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem'
            }}
          >
            <InfoIcon size={14} color="#0A6ED1" />
            <span>Click any perimeter label to inspect corresponding dimension competencies.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
