import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useCareerContext } from '../../context/CareerContext';
import { MenuIcon, CloseIcon } from '../common/Icons';

export const Navbar: React.FC = () => {
  const location = useLocation();
  const { healthStatus, backendHealth } = useCareerContext();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  return (
    <header
      style={{
        backgroundColor: '#001A47',
        color: '#FFFFFF',
        borderBottom: '3px solid #0A6ED1',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        boxShadow: '0 2px 10px rgba(0, 26, 71, 0.15)'
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          padding: '0.75rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}
      >
        {/* Brand Wordmark */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            color: '#FFFFFF',
            textDecoration: 'none'
          }}
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            style={{
              backgroundColor: '#0A6ED1',
              color: '#FFFFFF',
              fontWeight: 700,
              padding: '0.2rem 0.55rem',
              borderRadius: '4px',
              fontSize: '0.75rem',
              letterSpacing: '0.05em'
            }}
          >
            SAP HACKFEST
          </div>
          <div>
            <span style={{ fontSize: '1.2rem', fontWeight: 700, letterSpacing: '-0.01em' }}>
              Career Orchestrator
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <nav
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
          className="hide-on-mobile"
        >
          {navLinks.map((link) => {
            const active = isActive(link.path);
            return (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  color: active ? '#FFFFFF' : '#C4D5EA',
                  backgroundColor: active ? 'rgba(10, 110, 209, 0.35)' : 'transparent',
                  padding: '0.45rem 0.85rem',
                  borderRadius: '4px',
                  fontSize: '0.875rem',
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
                    e.currentTarget.style.color = '#C4D5EA';
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Section: Backend Status Pill & Mobile Menu Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          {/* Health indicator */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              backgroundColor: 'rgba(255, 255, 255, 0.07)',
              padding: '0.3rem 0.7rem',
              borderRadius: '20px',
              fontSize: '0.75rem',
              color: '#EDF1F5'
            }}
            title={
              healthStatus === 'online'
                ? `Connected to API Gateway (${backendHealth?.environment})`
                : 'API Gateway connection state'
            }
          >
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor:
                  healthStatus === 'online' ? '#107E3E' : healthStatus === 'checking' ? '#E9730C' : '#BB0000'
              }}
            />
            <span className="hide-on-mobile">
              API:{' '}
              {healthStatus === 'online'
                ? 'Online'
                : healthStatus === 'checking'
                ? 'Connecting...'
                : 'Offline'}
            </span>
          </div>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            style={{
              color: '#FFFFFF',
              padding: '0.4rem',
              borderRadius: '4px',
              display: 'none'
            }}
            className="show-on-mobile"
          >
            {mobileMenuOpen ? <CloseIcon size={22} /> : <MenuIcon size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            backgroundColor: '#001438',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            padding: '1rem 1.5rem 1.5rem'
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    color: active ? '#FFFFFF' : '#C4D5EA',
                    backgroundColor: active ? '#0A6ED1' : 'transparent',
                    padding: '0.65rem 1rem',
                    borderRadius: '4px',
                    fontSize: '0.95rem',
                    fontWeight: active ? 600 : 500,
                    textDecoration: 'none'
                  }}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
