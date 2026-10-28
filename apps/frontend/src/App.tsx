import React, { useEffect, useState } from 'react';
import type { HealthResponse, CareerRole } from '@career-orchestrator/shared';

// Initial sample catalog preview powered by shared types
const SAMPLE_PREVIEW_ROLES: Partial<CareerRole>[] = [
  {
    title: 'SAP S/4HANA Finance Consultant',
    track: 'SAP_FUNCTIONAL_CONSULTANT',
    summary: 'Lead financial modernization, general ledger migration, and business process automation on S/4HANA Cloud.',
    marketDemand: 'Critical'
  },
  {
    title: 'SAP ABAP Cloud & BTP Developer',
    track: 'SAP_TECHNICAL_DEVELOPER',
    summary: 'Build clean-core extensions and modern cloud apps using ABAP RESTful Application Programming (RAP) on SAP BTP.',
    marketDemand: 'High'
  },
  {
    title: 'SAP Integration Suite Architect',
    track: 'SAP_INTEGRATION_ARCHITECT',
    summary: 'Orchestrate enterprise workflows, connect hybrid landscapes, and build API-led enterprise architectures.',
    marketDemand: 'High'
  }
];

export const App: React.FC = () => {
  const [health, setHealth] = useState<HealthResponse | null>(null);
  const [healthStatus, setHealthStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [discoveryStarted, setDiscoveryStarted] = useState<boolean>(false);

  useEffect(() => {
    fetch('/api/v1/health')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data: HealthResponse) => {
        setHealth(data);
        setHealthStatus('online');
      })
      .catch(() => {
        setHealthStatus('offline');
      });
  }, []);

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* SAP-inspired Shell Bar */}
      <header
        style={{
          backgroundColor: '#001A47',
          color: '#FFFFFF',
          padding: '0.85rem 2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '3px solid #0A6ED1'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div
            style={{
              backgroundColor: '#0A6ED1',
              color: '#FFFFFF',
              fontWeight: 700,
              padding: '0.25rem 0.6rem',
              borderRadius: '4px',
              fontSize: '0.85rem',
              letterSpacing: '0.05em'
            }}
          >
            SAP HACKFEST 2026
          </div>
          <h1 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Career Orchestrator</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span
              style={{
                width: '10px',
                height: '10px',
                borderRadius: '50%',
                backgroundColor:
                  healthStatus === 'online' ? '#107E3E' : healthStatus === 'checking' ? '#E9730C' : '#BB0000',
                display: 'inline-block'
              }}
            />
            <span>
              API Gateway:{' '}
              {healthStatus === 'online'
                ? `Online (${health?.environment})`
                : healthStatus === 'checking'
                ? 'Connecting...'
                : 'Offline (Start backend)'}
            </span>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main style={{ flex: 1, maxWidth: '1200px', margin: '0 auto', padding: '3rem 2rem', width: '100%' }}>
        {/* Hero Section */}
        <section
          style={{
            backgroundColor: '#FFFFFF',
            border: '1px solid #D9E1E8',
            borderRadius: '8px',
            padding: '3rem',
            boxShadow: '0 2px 8px rgba(0, 26, 71, 0.06)',
            marginBottom: '2.5rem'
          }}
        >
          <div
            style={{
              color: '#0A6ED1',
              fontWeight: 600,
              fontSize: '0.9rem',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '0.5rem'
            }}
          >
            Intelligent Career Transition Navigator
          </div>
          <h2
            style={{
              fontSize: '2.4rem',
              fontWeight: 700,
              color: '#001A47',
              lineHeight: 1.2,
              marginBottom: '1rem'
            }}
          >
            Translate Your Experience Into SAP Excellence
          </h2>
          <p
            style={{
              fontSize: '1.15rem',
              color: '#5B6876',
              maxWidth: '800px',
              lineHeight: 1.6,
              marginBottom: '2rem'
            }}
          >
            Career Orchestrator bridges your transferable skills and existing industry background into high-demand
            SAP and enterprise technology careers. Experience explainable career recommendations, human-guided
            skill verification, and curated learning roadmaps.
          </p>

          {!discoveryStarted ? (
            <button
              onClick={() => setDiscoveryStarted(true)}
              style={{
                backgroundColor: '#0A6ED1',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '6px',
                padding: '0.9rem 2rem',
                fontSize: '1.05rem',
                fontWeight: 600,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                transition: 'background-color 0.15s ease'
              }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#085caf')}
              onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.backgroundColor = '#0A6ED1')}
            >
              Begin Career Discovery →
            </button>
          ) : (
            <div
              style={{
                backgroundColor: '#EBF3FB',
                border: '1px solid #B4D7FA',
                padding: '1.25rem 1.5rem',
                borderRadius: '6px',
                maxWidth: '650px'
              }}
            >
              <h3 style={{ color: '#001A47', fontSize: '1.1rem', marginBottom: '0.5rem' }}>
                Career Discovery Initialized
              </h3>
              <p style={{ color: '#222B35', fontSize: '0.95rem' }}>
                Next phase will unlock resume parsing, interactive human-in-the-loop review, and automated skill-gap
                scoring against our verified SAP career ontology.
              </p>
            </div>
          )}
        </section>

        {/* Feature Grid */}
        <section style={{ marginBottom: '3rem' }}>
          <h3 style={{ fontSize: '1.35rem', color: '#001A47', marginBottom: '1.25rem' }}>
            Core Architectural Capabilities
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem'
            }}
          >
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #D9E1E8',
                borderRadius: '8px',
                padding: '1.5rem'
              }}
            >
              <h4 style={{ color: '#001A47', marginBottom: '0.5rem', fontSize: '1.1rem' }}>
                1. Human-in-the-Loop Review
              </h4>
              <p style={{ color: '#5B6876', fontSize: '0.95rem' }}>
                Never accept opaque AI assumptions. Candidates inspect, edit, and confirm every extracted competency
                before recommendations are calculated.
              </p>
            </div>
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #D9E1E8',
                borderRadius: '8px',
                padding: '1.5rem'
              }}
            >
              <h4 style={{ color: '#001A47', marginBottom: '0.5rem', fontSize: '1.1rem' }}>
                2. Explainable Transferability
              </h4>
              <p style={{ color: '#5B6876', fontSize: '0.95rem' }}>
                Transparent mathematical scoring identifies transferable capabilities (such as accounting or SQL) and
                pinpoints specific delta gaps to bridge.
              </p>
            </div>
            <div
              style={{
                backgroundColor: '#FFFFFF',
                border: '1px solid #D9E1E8',
                borderRadius: '8px',
                padding: '1.5rem'
              }}
            >
              <h4 style={{ color: '#001A47', marginBottom: '0.5rem', fontSize: '1.1rem' }}>
                3. Verified Learning Journeys
              </h4>
              <p style={{ color: '#5B6876', fontSize: '0.95rem' }}>
                Personalized roadmaps built with verified SAP Learning Hub Student Edition courses, openSAP, and
                hands-on portfolio project milestones.
              </p>
            </div>
          </div>
        </section>

        {/* Career Preview Cards */}
        <section>
          <h3 style={{ fontSize: '1.35rem', color: '#001A47', marginBottom: '1.25rem' }}>
            Featured Target SAP Pathways
          </h3>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '1.5rem'
            }}
          >
            {SAMPLE_PREVIEW_ROLES.map((role, idx) => (
              <div
                key={idx}
                style={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #D9E1E8',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div
                    style={{
                      display: 'inline-block',
                      backgroundColor: '#EBF3FB',
                      color: '#0A6ED1',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      padding: '0.2rem 0.5rem',
                      borderRadius: '4px',
                      marginBottom: '0.75rem'
                    }}
                  >
                    {role.track?.replace(/_/g, ' ')}
                  </div>
                  <h4 style={{ color: '#001A47', fontSize: '1.15rem', marginBottom: '0.5rem' }}>{role.title}</h4>
                  <p style={{ color: '#5B6876', fontSize: '0.9rem', marginBottom: '1rem' }}>{role.summary}</p>
                </div>
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    borderTop: '1px solid #F0F3F6',
                    paddingTop: '0.75rem',
                    fontSize: '0.85rem',
                    color: '#222B35'
                  }}
                >
                  <span>
                    Demand:{' '}
                    <strong style={{ color: role.marketDemand === 'Critical' ? '#BB0000' : '#0A6ED1' }}>
                      {role.marketDemand}
                    </strong>
                  </span>
                  <span style={{ color: '#0A6ED1', fontWeight: 600 }}>Explore Syllabus →</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer
        style={{
          backgroundColor: '#FFFFFF',
          borderTop: '1px solid #D9E1E8',
          padding: '1.5rem 2rem',
          textAlign: 'center',
          color: '#5B6876',
          fontSize: '0.85rem'
        }}
      >
        <p>Career Orchestrator • SAP Hackfest 2026 Architectural Foundation</p>
      </footer>
    </div>
  );
};

export default App;
