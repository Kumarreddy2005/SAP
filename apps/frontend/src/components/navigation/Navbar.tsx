import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCareerContext } from '../../context/CareerContext';
import { MenuIcon, CloseIcon, TrashIcon } from '../common/Icons';
import { ResetSessionModal } from '../common/ResetSessionModal';
import { enterpriseTheme } from '../../theme/tokens';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { healthStatus, backendHealth, sessionMode, manualProfile } = useCareerContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);

  const navLinks = [
    { label: 'Overview', path: '/' },
    { label: 'Dashboard', path: '/dashboard' },
    { label: 'Background', path: '/profile' },
    { label: 'Skills', path: '/skills-review' },
    { label: 'Careers', path: '/careers' },
    { label: 'Learning', path: '/learning' },
    { label: 'Projects', path: '/projects' },
    { label: 'Readiness', path: '/readiness' },
    { label: 'Jobs', path: '/jobs' }
  ];

  const isActive = (path: string) => {
    if (path === '/' && location.pathname === '/') return true;
    if (path !== '/' && location.pathname.startsWith(path)) return true;
    return false;
  };

  const getCandidatePillText = () => {
    if (sessionMode === 'DEMO') return 'Alex Vance (Demo)';
    if (sessionMode === 'REAL_PROFILE') {
      return manualProfile.fullName ? `${manualProfile.fullName} (Active)` : 'Active Candidate';
    }
    return 'Fresh Session';
  };

  return (
    <header
      style={{
        backgroundColor: enterpriseTheme.colors.shell,
        color: '#FFFFFF',
        borderBottom: `3px solid ${enterpriseTheme.colors.primary}`,
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: enterpriseTheme.shadows.card
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0.65rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem'
        }}
      >
        {/* Brand Wordmark */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            color: '#FFFFFF',
            textDecoration: 'none',
            flexShrink: 0
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            style={{
              backgroundColor: enterpriseTheme.colors.primary,
              color: '#FFFFFF',
              fontWeight: 700,
              padding: '0.2rem 0.5rem',
              borderRadius: '4px',
              fontSize: '0.72rem',
              letterSpacing: '0.06em'
            }}
          >
            SAP HACKFEST
          </div>
          <div>
            <span style={{ fontSize: '1.15rem', fontWeight: 700, letterSpacing: '-0.01em' }}>
              Career Orchestrator
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.2rem'
          }}
          className="hide-on-tablet"
        >
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  color: active ? '#FFFFFF' : '#CBD5E1',
                  backgroundColor: active ? 'rgba(10, 110, 209, 0.4)' : 'transparent',
                  padding: '0.4rem 0.7rem',
                  borderRadius: '4px',
                  fontSize: '0.84rem',
                  fontWeight: active ? 600 : 500,
                  textDecoration: 'none',
                  transition: 'all 0.15s ease'
                }}
                onMouseEnter={(e) => {
                  if (!active) {
                    e.currentTarget.style.color = '#FFFFFF';
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!active) {
                    e.currentTarget.style.color = '#CBD5E1';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Candidate Pill, Backend Health & Reset Intake */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexShrink: 0 }}>
          {/* Candidate session indicator */}
          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 600,
              padding: '0.25rem 0.6rem',
              borderRadius: '9999px',
              backgroundColor:
                sessionMode === 'DEMO'
                  ? 'rgba(10, 110, 209, 0.25)'
                  : sessionMode === 'REAL_PROFILE'
                  ? 'rgba(16, 126, 62, 0.25)'
                  : 'rgba(233, 115, 12, 0.25)',
              color:
                sessionMode === 'DEMO'
                  ? '#B9D5F5'
                  : sessionMode === 'REAL_PROFILE'
                  ? '#B8E3C8'
                  : '#FBD38D',
              border: `1px solid ${
                sessionMode === 'DEMO'
                  ? 'rgba(185, 213, 245, 0.4)'
                  : sessionMode === 'REAL_PROFILE'
                  ? 'rgba(184, 227, 200, 0.4)'
                  : 'rgba(251, 211, 141, 0.4)'
              }`
            }}
            className="hide-on-mobile"
          >
            {getCandidatePillText()}
          </span>

          {/* Health indicator */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.4rem',
              backgroundColor: 'rgba(255, 255, 255, 0.08)',
              padding: '0.25rem 0.6rem',
              borderRadius: '20px',
              fontSize: '0.74rem',
              color: '#EDF1F5'
            }}
            title={
              healthStatus === 'online'
                ? `Connected to API Gateway (${backendHealth?.environment || 'Production'})`
                : 'API Gateway connection state'
            }
          >
            <span
              style={{
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor:
                  healthStatus === 'online' ? '#107E3E' : healthStatus === 'checking' ? '#E9730C' : '#BB0000'
              }}
            />
            <span className="hide-on-mobile">
              {healthStatus === 'online' ? 'API Online' : healthStatus === 'checking' ? 'Connecting' : 'Offline'}
            </span>
          </div>

          {/* Reset / New Session Button */}
          <button
            onClick={() => setIsResetModalOpen(true)}
            title="Reset candidate session"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.35rem',
              backgroundColor: 'rgba(235, 87, 87, 0.15)',
              border: '1px solid rgba(235, 87, 87, 0.35)',
              color: '#FFA8A8',
              padding: '0.28rem 0.65rem',
              borderRadius: '4px',
              fontSize: '0.74rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            className="hide-on-mobile"
          >
            <TrashIcon size={12} color="#FFA8A8" />
            <span>Reset</span>
          </button>

          {/* Tablet & Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            style={{
              color: '#FFFFFF',
              padding: '0.35rem',
              borderRadius: '4px',
              display: 'none',
              cursor: 'pointer'
            }}
            className="show-on-tablet"
          >
            {mobileMenuOpen ? <CloseIcon size={22} /> : <MenuIcon size={22} />}
          </button>
        </div>
      </div>

      {/* Responsive Slide-out / Dropdown Menu for Tablet and Mobile */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: '#001438',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '1rem 1.25rem 1.25rem'
          }}
          className="animate-slide-down"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            <div style={{ padding: '0.3rem 0.5rem', marginBottom: '0.3rem', fontSize: '0.75rem', color: '#8492A0' }}>
              SESSION: {getCandidatePillText()}
            </div>
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    color: active ? '#FFFFFF' : '#C4D5EA',
                    backgroundColor: active ? enterpriseTheme.colors.primary : 'transparent',
                    padding: '0.6rem 0.85rem',
                    borderRadius: '4px',
                    fontSize: '0.9rem',
                    fontWeight: active ? 600 : 500,
                    textDecoration: 'none'
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsResetModalOpen(true);
              }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#FFA8A8',
                backgroundColor: 'rgba(235, 87, 87, 0.15)',
                border: '1px solid rgba(235, 87, 87, 0.35)',
                padding: '0.6rem 0.85rem',
                borderRadius: '4px',
                fontSize: '0.9rem',
                fontWeight: 600,
                cursor: 'pointer',
                marginTop: '0.5rem',
                textAlign: 'left'
              }}
            >
              <TrashIcon size={16} color="#FFA8A8" />
              <span>Reset Candidate Intake</span>
            </button>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ResetSessionModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
      />
    </header>
  );
};
