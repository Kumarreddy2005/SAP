import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer
      style={{
        backgroundColor: '#FFFFFF',
        borderTop: '1px solid #D9E1E8',
        padding: '2.5rem 1.5rem',
        marginTop: 'auto',
        color: '#5B6876',
        fontSize: '0.85rem'
      }}
    >
      <div
        style={{
          maxWidth: '1280px',
          margin: '0 auto',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '1.5rem'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span style={{ fontWeight: 700, color: '#001A47', fontSize: '1rem' }}>
              Career Orchestrator
            </span>
            <span
              style={{
                backgroundColor: '#EBF3FB',
                color: '#0A6ED1',
                padding: '0.15rem 0.45rem',
                borderRadius: '3px',
                fontSize: '0.72rem',
                fontWeight: 600
              }}
            >
              SAP Hackfest 2026
            </span>
          </div>
          <p style={{ maxWidth: '600px', lineHeight: 1.4 }}>
            Empowering professionals and students to pivot into high-demand SAP ecosystems through explainable
            transferable skill intelligence and verified learning pathways.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1.5rem' }}>
          <Link to="/" style={{ color: '#5B6876', textDecoration: 'none' }}>
            Platform Overview
          </Link>
          <Link to="/profile" style={{ color: '#5B6876', textDecoration: 'none' }}>
            Profile Intake
          </Link>
          <Link to="/careers" style={{ color: '#5B6876', textDecoration: 'none' }}>
            Career Catalogue
          </Link>
          <Link to="/learning" style={{ color: '#5B6876', textDecoration: 'none' }}>
            SAP Learning Hub
          </Link>
        </div>
      </div>

      <div
        style={{
          maxWidth: '1280px',
          margin: '1.5rem auto 0',
          paddingTop: '1rem',
          borderTop: '1px solid #EDF1F5',
          fontSize: '0.78rem',
          color: '#8492A0',
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          gap: '0.5rem'
        }}
      >
        <span>
          © 2026 Career Orchestrator Project. Independent student innovation initiative; not an official SAP SE product.
        </span>
        <span>Advisory career navigation engine • Human-in-the-loop decision autonomy</span>
      </div>
    </footer>
  );
};
