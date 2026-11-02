import React from 'react';
import {
  CheckIcon,
  SearchIcon,
  BriefcaseIcon,
  AwardIcon,
  AlertTriangleIcon,
  ArrowRightIcon
} from '../common/Icons';

interface InteractiveKpiGridProps {
  skillsIdentifiedCount: number;
  skillsConfirmedCount: number;
  transferableCount: number;
  recommendedRolesCount: number;
  remainingGapsCount: number;
  projectsCompletedCount: number;
  onOpenSkillsModal: (filter: 'ALL' | 'CONFIRMED' | 'TRANSFERABLE' | 'SUGGESTED') => void;
  onScrollToSection: (sectionId: string) => void;
}

export const InteractiveKpiGrid: React.FC<InteractiveKpiGridProps> = ({
  skillsIdentifiedCount,
  skillsConfirmedCount,
  transferableCount,
  recommendedRolesCount,
  remainingGapsCount,
  projectsCompletedCount,
  onOpenSkillsModal,
  onScrollToSection
}) => {
  const cards = [
    {
      id: 'kpi-identified',
      title: 'Skills Identified',
      value: skillsIdentifiedCount,
      subtitle: 'Extracted from resume & background',
      badge: 'Inventory',
      badgeBg: '#F1F5F9',
      badgeColor: '#475569',
      icon: <SearchIcon size={20} color="#0A6ED1" />,
      accentColor: '#0A6ED1',
      action: () => onOpenSkillsModal('ALL'),
      actionLabel: 'View full inventory'
    },
    {
      id: 'kpi-confirmed',
      title: 'Skills Confirmed',
      value: skillsConfirmedCount,
      subtitle: `${skillsIdentifiedCount - skillsConfirmedCount} unconfirmed awaiting review`,
      badge: 'Human Calibrated',
      badgeBg: '#E8F5ED',
      badgeColor: '#107E3E',
      icon: <CheckIcon size={20} color="#107E3E" />,
      accentColor: '#107E3E',
      action: () => onOpenSkillsModal('CONFIRMED'),
      actionLabel: 'Inspect verified'
    },
    {
      id: 'kpi-transferable',
      title: 'Transferable Skills',
      value: transferableCount,
      subtitle: 'Cross-functional ERP foundation',
      badge: 'High Pivot Leverage',
      badgeBg: '#F2ECFA',
      badgeColor: '#633CA3',
      icon: <AwardIcon size={20} color="#633CA3" />,
      accentColor: '#633CA3',
      action: () => onOpenSkillsModal('TRANSFERABLE'),
      actionLabel: 'View transferable overlap'
    },
    {
      id: 'kpi-roles',
      title: 'Recommended Roles',
      value: recommendedRolesCount,
      subtitle: 'Across 14 curated SAP career paths',
      badge: 'Ecosystem Catalog',
      badgeBg: '#EBF3FB',
      badgeColor: '#0A6ED1',
      icon: <BriefcaseIcon size={20} color="#0A6ED1" />,
      accentColor: '#0A6ED1',
      action: () => onScrollToSection('recommended-careers'),
      actionLabel: 'Explore top matches'
    },
    {
      id: 'kpi-gaps',
      title: 'Remaining Skill Gaps',
      value: remainingGapsCount,
      subtitle: 'For active target role',
      badge: remainingGapsCount > 0 ? 'Action Required' : 'All Met',
      badgeBg: remainingGapsCount > 0 ? '#FEF3E8' : '#E8F5ED',
      badgeColor: remainingGapsCount > 0 ? '#E9730C' : '#107E3E',
      icon: <AlertTriangleIcon size={20} color="#E9730C" />,
      accentColor: '#E9730C',
      action: () => onScrollToSection('skill-gaps'),
      actionLabel: 'Review gap breakdown'
    },
    {
      id: 'kpi-projects',
      title: 'Projects Completed',
      value: projectsCompletedCount,
      subtitle: 'Demonstrated portfolio evidence',
      badge: 'Rubric Evaluated',
      badgeBg: '#F8FAFC',
      badgeColor: '#001A47',
      icon: <AwardIcon size={20} color="#001A47" />,
      accentColor: '#001A47',
      action: () => onScrollToSection('projects'),
      actionLabel: 'Inspect workspace evidence'
    }
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '1rem'
      }}
    >
      {cards.map((card) => (
        <div
          key={card.id}
          onClick={card.action}
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #D9E1E8',
            borderRadius: '10px',
            padding: '1.25rem',
            cursor: 'pointer',
            boxShadow: '0 2px 6px rgba(0, 26, 71, 0.04)',
            transition: 'all 0.15s ease',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = card.accentColor;
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 6px 16px rgba(0, 26, 71, 0.08)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#D9E1E8';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 2px 6px rgba(0, 26, 71, 0.04)';
          }}
        >
          {/* Top row: Title and Icon */}
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#5B6876' }}>
              {card.title}
            </span>
            <div
              style={{
                padding: '0.4rem',
                borderRadius: '8px',
                backgroundColor: '#F8FAFC',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {card.icon}
            </div>
          </div>

          {/* Metric value & Badge */}
          <div style={{ margin: '0.75rem 0' }}>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
              <span
                style={{
                  fontSize: '2rem',
                  fontWeight: 800,
                  color: '#001A47',
                  lineHeight: 1
                }}
              >
                {card.value}
              </span>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  backgroundColor: card.badgeBg,
                  color: card.badgeColor,
                  padding: '0.15rem 0.45rem',
                  borderRadius: '4px'
                }}
              >
                {card.badge}
              </span>
            </div>
            <p style={{ fontSize: '0.75rem', color: '#5B6876', margin: '0.35rem 0 0', lineHeight: 1.3 }}>
              {card.subtitle}
            </p>
          </div>

          {/* Bottom action cue */}
          <div
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              color: card.accentColor,
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              borderTop: '1px solid #F1F5F9',
              paddingTop: '0.5rem'
            }}
          >
            <span>{card.actionLabel}</span>
            <ArrowRightIcon size={12} color={card.accentColor} />
          </div>
        </div>
      ))}
    </div>
  );
};
