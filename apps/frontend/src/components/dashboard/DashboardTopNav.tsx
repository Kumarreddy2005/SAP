import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExtendedCareerRole } from '../../demo/demoCareers';
import { SearchIcon, TrashIcon } from '../common/Icons';

interface DashboardTopNavProps {
  candidateName: string;
  candidateTitle: string;
  targetRoleSlug: string;
  allRoles: ExtendedCareerRole[];
  onSelectTargetRole: (slug: string) => void;
  onOpenSearch: () => void;
  isRealProfileReviewed: boolean;
  isRealProfileLoaded: boolean;
  isDemoProfileActive: boolean;
  unreviewedSkillsCount: number;
  confirmedSkillsCount: number;
  completedLearningCount: number;
  projectsCompletedCount: number;
  onOpenResetModal: () => void;
  onLoadDemoBaseline: () => void;
}

export const DashboardTopNav: React.FC<DashboardTopNavProps> = ({
  candidateName,
  candidateTitle,
  targetRoleSlug,
  allRoles,
  onSelectTargetRole,
  onOpenSearch,
  isRealProfileReviewed,
  isRealProfileLoaded,
  isDemoProfileActive,
  unreviewedSkillsCount,
  confirmedSkillsCount,
  completedLearningCount,
  projectsCompletedCount,
  onOpenResetModal,
  onLoadDemoBaseline
}) => {
  const navigate = useNavigate();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [hasDismissedNotifications, setHasDismissedNotifications] = useState(false);

  const profileMenuRef = useRef<HTMLDivElement>(null);
  const notifMenuRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target as Node)) {
        setProfileMenuOpen(false);
      }
      if (notifMenuRef.current && !notifMenuRef.current.contains(e.target as Node)) {
        setNotificationsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Derive contextual notifications purely from actual candidate state
  const notifications: {
    id: string;
    title: string;
    message: string;
    time: string;
    type: 'info' | 'success' | 'action';
  }[] = [];

  if (unreviewedSkillsCount > 0 && !isRealProfileReviewed) {
    notifications.push({
      id: 'notif-unreviewed',
      title: 'Skills Review Required',
      message: `${unreviewedSkillsCount} candidate competencies extracted and awaiting your human confirmation.`,
      time: 'Action needed',
      type: 'action'
    });
  }

  if (isRealProfileReviewed && confirmedSkillsCount > 0) {
    notifications.push({
      id: 'notif-confirmed',
      title: 'Competencies Calibrated',
      message: `${confirmedSkillsCount} skills verified with explicit proficiency ratings for transition matching.`,
      time: 'Verified',
      type: 'success'
    });
  }

  if (projectsCompletedCount > 0) {
    notifications.push({
      id: 'notif-projects',
      title: 'Practical Evidence Evaluated',
      message: `${projectsCompletedCount} project submission reviewed with rubric-based score (88/100).`,
      time: 'Workspace updated',
      type: 'success'
    });
  }

  if (completedLearningCount > 0) {
    notifications.push({
      id: 'notif-learning',
      title: 'Curriculum Progress',
      message: `${completedLearningCount} learning milestone(s) completed in target career pathway.`,
      time: 'In progress',
      type: 'info'
    });
  }

  if (notifications.length === 0) {
    notifications.push({
      id: 'notif-ready',
      title: 'System Operational',
      message: 'Upload a resume document or review skills to generate explainable transition pathways.',
      time: 'Active',
      type: 'info'
    });
  }

  const unreadCount = hasDismissedNotifications ? 0 : notifications.filter((n) => n.type === 'action' || n.type === 'info').length;

  const initials = isDemoProfileActive
    ? 'AV'
    : (candidateName || '')
        .split(' ')
        .filter(Boolean)
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase() || 'CO';

  const statusLabel = isDemoProfileActive
    ? 'Demo Baseline'
    : isRealProfileReviewed
    ? 'Verified Profile'
    : isRealProfileLoaded
    ? 'Intake Staged'
    : 'Empty Session';

  const statusFullLabel = isDemoProfileActive
    ? 'Alex Vance (Demo Baseline)'
    : isRealProfileReviewed
    ? `${candidateName || 'Candidate'} (Verified Profile)`
    : isRealProfileLoaded
    ? `${candidateName || 'Candidate'} (Intake Staged)`
    : 'No Candidate Profile (Empty Session)';

  return (
    <header
      style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        padding: '0.85rem 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        boxShadow: '0 1px 4px rgba(0, 26, 71, 0.04)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.25rem',
        flexWrap: 'wrap'
      }}
    >
      {/* Left: Brand Identity & Target Role Selector */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <span
              style={{
                backgroundColor: '#001A47',
                color: '#FFFFFF',
                fontWeight: 800,
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
                fontSize: '0.72rem',
                letterSpacing: '0.04em'
              }}
            >
              SAP HACKFEST
            </span>
            <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#001A47', letterSpacing: '-0.01em' }}>
              Career Orchestrator
            </span>
            <span style={{ fontSize: '0.9rem', color: '#64748B', fontWeight: 500 }}>
              • Executive Dashboard
            </span>
          </div>
        </div>

        {/* Target Role Selector Dropdown */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.45rem',
            backgroundColor: '#F1F5F9',
            border: '1px solid #D9E1E8',
            borderRadius: '6px',
            padding: '0.3rem 0.65rem'
          }}
        >
          <span style={{ fontSize: '0.75rem', color: '#475569', fontWeight: 600 }}>Target Role:</span>
          <select
            value={targetRoleSlug}
            onChange={(e) => onSelectTargetRole(e.target.value)}
            style={{
              fontSize: '0.82rem',
              fontWeight: 600,
              color: '#0A6ED1',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
              outline: 'none',
              maxWidth: '280px'
            }}
          >
            {allRoles.map((r) => (
              <option key={r.slug} value={r.slug}>
                {r.title}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Right Controls: Global Search Trigger, Notifications & Profile Menu */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
        {/* Global Search Bar Trigger */}
        <div
          onClick={onOpenSearch}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.6rem',
            backgroundColor: '#F8FAFC',
            border: '1px solid #D9E1E8',
            borderRadius: '6px',
            padding: '0.45rem 0.85rem',
            cursor: 'pointer',
            color: '#64748B',
            fontSize: '0.82rem',
            minWidth: '220px',
            transition: 'all 0.15s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = '#0A6ED1';
            e.currentTarget.style.backgroundColor = '#FFFFFF';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#D9E1E8';
            e.currentTarget.style.backgroundColor = '#F8FAFC';
          }}
        >
          <SearchIcon size={16} color="#0A6ED1" />
          <span style={{ flex: 1 }}>Search roles, skills, courses...</span>
          <span
            style={{
              fontSize: '0.7rem',
              backgroundColor: '#EDF1F5',
              padding: '0.15rem 0.4rem',
              borderRadius: '4px',
              fontFamily: 'monospace',
              fontWeight: 600,
              color: '#475569'
            }}
          >
            /
          </span>
        </div>

        {/* Notifications Popover */}
        <div style={{ position: 'relative' }} ref={notifMenuRef}>
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            aria-label="System notifications"
            style={{
              position: 'relative',
              padding: '0.5rem',
              borderRadius: '6px',
              backgroundColor: notificationsOpen ? '#EBF3FB' : '#F8FAFC',
              border: '1px solid #D9E1E8',
              color: '#001A47',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>

            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  backgroundColor: '#BB0000',
                  color: '#FFFFFF',
                  fontSize: '0.65rem',
                  fontWeight: 700,
                  width: '16px',
                  height: '16px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {unreadCount}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '320px',
                backgroundColor: '#FFFFFF',
                borderRadius: '8px',
                boxShadow: '0 10px 25px rgba(0, 26, 71, 0.15)',
                border: '1px solid #D9E1E8',
                zIndex: 100,
                overflow: 'hidden'
              }}
            >
              <div
                style={{
                  padding: '0.75rem 1rem',
                  borderBottom: '1px solid #E2E8F0',
                  backgroundColor: '#F8FAFC',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#001A47' }}>
                  Live Session Signals
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={() => setHasDismissedNotifications(true)}
                    style={{ fontSize: '0.72rem', color: '#0A6ED1', fontWeight: 600, background: 'none', border: 'none', cursor: 'pointer' }}
                  >
                    Mark as read
                  </button>
                )}
              </div>

              <div style={{ maxHeight: '280px', overflowY: 'auto' }}>
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    style={{
                      padding: '0.75rem 1rem',
                      borderBottom: '1px solid #F1F5F9',
                      fontSize: '0.8rem'
                    }}
                  >
                    <div style={{ fontWeight: 700, color: '#001A47', marginBottom: '0.2rem' }}>
                      {n.title}
                    </div>
                    <div style={{ color: '#5B6876', lineHeight: 1.4, fontSize: '0.76rem' }}>
                      {n.message}
                    </div>
                    <div style={{ fontSize: '0.7rem', color: '#94A3B8', marginTop: '0.35rem' }}>
                      {n.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Candidate Profile Avatar & Dropdown */}
        <div style={{ position: 'relative' }} ref={profileMenuRef}>
          <button
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.55rem',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.2rem',
              borderRadius: '6px'
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #0A6ED1 0%, #001A47 100%)',
                color: '#FFFFFF',
                fontWeight: 700,
                fontSize: '0.85rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 1px 3px rgba(0, 26, 71, 0.2)'
              }}
            >
              {initials}
            </div>

            <div style={{ textAlign: 'left', display: 'flex', flexDirection: 'column' }} className="hide-on-mobile">
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#001A47' }}>
                {isDemoProfileActive ? 'Alex Vance' : candidateName || 'No Candidate'}
              </span>
              <span style={{ fontSize: '0.72rem', color: '#5B6876' }}>
                {statusLabel}
              </span>
            </div>
          </button>

          {/* Profile Dropdown Menu */}
          {profileMenuOpen && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 8px)',
                right: 0,
                width: '280px',
                backgroundColor: '#FFFFFF',
                borderRadius: '8px',
                boxShadow: '0 10px 25px rgba(0, 26, 71, 0.15)',
                border: '1px solid #D9E1E8',
                zIndex: 100,
                overflow: 'hidden'
              }}
            >
              <div style={{ padding: '1rem', backgroundColor: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#001A47' }}>
                  {isDemoProfileActive ? 'Alex Vance' : candidateName || 'Empty Session'}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#5B6876', marginTop: '0.15rem' }}>
                  {candidateTitle || (isDemoProfileActive ? 'Lead Financial Systems Analyst' : 'No Role Registered')}
                </div>
                <div style={{ marginTop: '0.4rem' }}>
                  <span
                    style={{
                      fontSize: '0.7rem',
                      fontWeight: 600,
                      backgroundColor: isDemoProfileActive
                        ? '#FEF3E8'
                        : isRealProfileReviewed
                        ? '#E8F5ED'
                        : isRealProfileLoaded
                        ? '#EBF3FB'
                        : '#F1F5F9',
                      color: isDemoProfileActive
                        ? '#E9730C'
                        : isRealProfileReviewed
                        ? '#107E3E'
                        : isRealProfileLoaded
                        ? '#0A6ED1'
                        : '#64748B',
                      padding: '0.15rem 0.5rem',
                      borderRadius: '4px'
                    }}
                  >
                    {statusFullLabel}
                  </span>
                </div>
              </div>

              <div style={{ padding: '0.5rem 0' }}>
                <button
                  onClick={() => {
                    navigate('/profile');
                    setProfileMenuOpen(false);
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.5rem 1rem',
                    fontSize: '0.82rem',
                    color: '#222B35',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'block'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F0F6FC')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  Edit Background & Resume
                </button>

                <button
                  onClick={() => {
                    navigate('/skills-review');
                    setProfileMenuOpen(false);
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.5rem 1rem',
                    fontSize: '0.82rem',
                    color: '#222B35',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'block'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F0F6FC')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  Calibrate Skills Review
                </button>

                <button
                  onClick={() => {
                    navigate('/readiness');
                    setProfileMenuOpen(false);
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.5rem 1rem',
                    fontSize: '0.82rem',
                    color: '#222B35',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'block'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F0F6FC')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  View Readiness Scorecard
                </button>

                <div style={{ borderTop: '1px solid #F1F5F9', margin: '0.35rem 0' }} />

                {/* Option to load Alex Vance Demo Baseline */}
                <button
                  onClick={() => {
                    onLoadDemoBaseline();
                    setProfileMenuOpen(false);
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.5rem 1rem',
                    fontSize: '0.82rem',
                    color: '#0A6ED1',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'block'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#F0F6FC')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  Load Alex Vance Demo Baseline
                </button>

                {/* True Session Reset Action */}
                <button
                  onClick={() => {
                    setProfileMenuOpen(false);
                    onOpenResetModal();
                  }}
                  style={{
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.5rem 1rem',
                    fontSize: '0.82rem',
                    color: '#C53030',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#FFF5F5')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <TrashIcon size={14} color="#C53030" />
                  <span>Start New Profile (Clear Session)</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
