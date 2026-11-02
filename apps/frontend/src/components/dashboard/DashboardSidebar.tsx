import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  BriefcaseIcon,
  BookOpenIcon,
  AwardIcon,
  CheckIcon,
  SearchIcon,
  ColumnsIcon,
  FileTextIcon,
  ArrowRightIcon,
  ArrowLeftIcon
} from '../common/Icons';

interface DashboardSidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onScrollToSection: (sectionId: string) => void;
  candidateName: string;
  isRealProfileReviewed: boolean;
  healthStatus: 'online' | 'checking' | 'offline';
  onResetDemo: () => void;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  isCollapsed,
  onToggleCollapse,
  onScrollToSection,
  candidateName,
  isRealProfileReviewed,
  healthStatus,
  onResetDemo
}) => {
  const location = useLocation();

  const sections = [
    { id: 'progress', label: 'Roadmap Progress', icon: <CheckIcon size={18} /> },
    { id: 'career-dna', label: 'Career DNA Radar', icon: <AwardIcon size={18} /> },
    { id: 'recommended-careers', label: 'Target Roles', icon: <BriefcaseIcon size={18} /> },
    { id: 'skill-gaps', label: 'Skill Gap Matrix', icon: <SearchIcon size={18} /> },
    { id: 'learning-pathway', label: 'Learning Pathway', icon: <BookOpenIcon size={18} /> },
    { id: 'projects', label: 'Project Portfolio', icon: <AwardIcon size={18} /> },
    { id: 'career-intelligence', label: 'Career Intelligence', icon: <ColumnsIcon size={18} /> }
  ];

  const externalRoutes = [
    { path: '/profile', label: 'Background Intake', icon: <FileTextIcon size={18} /> },
    { path: '/skills-review', label: 'Skills Review', icon: <CheckIcon size={18} /> },
    { path: '/careers', label: 'Career Explorer', icon: <BriefcaseIcon size={18} /> },
    { path: '/careers/compare', label: 'Role Comparison', icon: <ColumnsIcon size={18} /> },
    { path: '/learning', label: 'Learning Roadmaps', icon: <BookOpenIcon size={18} /> },
    { path: '/projects', label: 'Projects Suite', icon: <AwardIcon size={18} /> },
    { path: '/readiness', label: 'Readiness Scorecard', icon: <AwardIcon size={18} /> },
    { path: '/jobs', label: 'Job Search', icon: <BriefcaseIcon size={18} /> }
  ];

  return (
    <aside
      style={{
        width: isCollapsed ? '70px' : '250px',
        minHeight: '100vh',
        backgroundColor: '#001438',
        borderRight: '1px solid rgba(255, 255, 255, 0.08)',
        color: '#FFFFFF',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        transition: 'width 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        overflowX: 'hidden'
      }}
    >
      {/* Top Branding & Collapse Button */}
      <div>
        <div
          style={{
            padding: isCollapsed ? '1rem 0.5rem' : '1.25rem 1.25rem',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: isCollapsed ? 'center' : 'space-between'
          }}
        >
          {!isCollapsed && (
            <Link
              to="/"
              style={{
                display: 'flex',
                flexDirection: 'column',
                textDecoration: 'none',
                color: '#FFFFFF'
              }}
            >
              <div
                style={{
                  fontSize: '0.68rem',
                  fontWeight: 700,
                  color: '#0A6ED1',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase'
                }}
              >
                SAP HACKFEST 2026
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#FFFFFF' }}>
                Career Orchestrator
              </div>
            </Link>
          )}

          {/* Toggle Button */}
          <button
            onClick={onToggleCollapse}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            style={{
              color: '#94A3B8',
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              border: 'none',
              borderRadius: '6px',
              padding: '0.45rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = '#FFFFFF';
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.12)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = '#94A3B8';
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
            }}
          >
            {isCollapsed ? <ArrowRightIcon size={16} /> : <ArrowLeftIcon size={16} />}
          </button>
        </div>

        {/* Dashboard In-Page Navigation */}
        <div style={{ padding: '1rem 0.75rem' }}>
          {!isCollapsed && (
            <div
              style={{
                fontSize: '0.7rem',
                fontWeight: 700,
                color: '#64748B',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                padding: '0 0.5rem 0.5rem'
              }}
            >
              Dashboard Modules
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {sections.map((sec) => (
              <button
                key={sec.id}
                onClick={() => onScrollToSection(sec.id)}
                title={sec.label}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: isCollapsed ? '0.65rem 0' : '0.55rem 0.75rem',
                  justifyContent: isCollapsed ? 'center' : 'flex-start',
                  borderRadius: '6px',
                  backgroundColor: 'transparent',
                  color: '#CBD5E1',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  transition: 'all 0.15s ease',
                  width: '100%'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(10, 110, 209, 0.2)';
                  e.currentTarget.style.color = '#FFFFFF';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = '#CBD5E1';
                }}
              >
                <span style={{ color: '#0A6ED1', display: 'flex' }}>{sec.icon}</span>
                {!isCollapsed && <span>{sec.label}</span>}
              </button>
            ))}
          </div>

          {/* Workflow Pages Divider */}
          <div
            style={{
              margin: '1.25rem 0 0.75rem',
              borderTop: '1px solid rgba(255, 255, 255, 0.08)',
              paddingTop: '0.75rem'
            }}
          >
            {!isCollapsed && (
              <div
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  color: '#64748B',
                  textTransform: 'uppercase',
                  letterSpacing: '0.06em',
                  padding: '0 0.5rem 0.5rem'
                }}
              >
                Platform Workflows
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
              {externalRoutes.map((rt) => {
                const active = location.pathname.startsWith(rt.path);
                return (
                  <Link
                    key={rt.path}
                    to={rt.path}
                    title={rt.label}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      padding: isCollapsed ? '0.65rem 0' : '0.55rem 0.75rem',
                      justifyContent: isCollapsed ? 'center' : 'flex-start',
                      borderRadius: '6px',
                      backgroundColor: active ? '#0A6ED1' : 'transparent',
                      color: active ? '#FFFFFF' : '#94A3B8',
                      textDecoration: 'none',
                      fontSize: '0.82rem',
                      fontWeight: active ? 600 : 500,
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => {
                      if (!active) {
                        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.07)';
                        e.currentTarget.style.color = '#FFFFFF';
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!active) {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.color = '#94A3B8';
                      }
                    }}
                  >
                    <span style={{ color: active ? '#FFFFFF' : '#64748B', display: 'flex' }}>
                      {rt.icon}
                    </span>
                    {!isCollapsed && <span>{rt.label}</span>}
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Profile & Status Card */}
      <div
        style={{
          padding: isCollapsed ? '1rem 0.5rem' : '1rem 1.25rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.08)',
          backgroundColor: '#00102E'
        }}
      >
        {!isCollapsed ? (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#94A3B8' }}>Active Profile:</span>
              <span
                style={{
                  fontSize: '0.7rem',
                  fontWeight: 600,
                  backgroundColor: isRealProfileReviewed ? '#107E3E' : '#E9730C',
                  color: '#FFFFFF',
                  padding: '0.1rem 0.45rem',
                  borderRadius: '4px'
                }}
              >
                {isRealProfileReviewed ? 'Verified' : 'Sample Demo'}
              </span>
            </div>

            <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#FFFFFF', marginBottom: '0.35rem' }}>
              {candidateName || 'Alex Vance'}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              {/* API Health */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.72rem', color: '#94A3B8' }}>
                <span
                  style={{
                    width: '7px',
                    height: '7px',
                    borderRadius: '50%',
                    backgroundColor: healthStatus === 'online' ? '#107E3E' : '#E9730C'
                  }}
                />
                <span>API Gateway: {healthStatus === 'online' ? 'Online' : 'Checking'}</span>
              </div>

              {/* Reset Demo button */}
              <button
                onClick={onResetDemo}
                style={{
                  fontSize: '0.7rem',
                  color: '#94A3B8',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  textDecoration: 'underline'
                }}
              >
                Reset Demo
              </button>
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: healthStatus === 'online' ? '#107E3E' : '#E9730C'
              }}
              title={`API Gateway: ${healthStatus}`}
            />
          </div>
        )}
      </div>
    </aside>
  );
};
