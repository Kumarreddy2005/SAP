import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ExtendedCareerRole } from '../../demo/demoCareers';
import { BriefcaseIcon, ColumnsIcon, ArrowRightIcon, InfoIcon } from '../common/Icons';

interface CareerIntelligenceSectionProps {
  targetRole: ExtendedCareerRole;
}

export const CareerIntelligenceSection: React.FC<CareerIntelligenceSectionProps> = ({ targetRole }) => {
  const navigate = useNavigate();

  // Curated emerging skills for track
  const emergingSkillsMap: Record<string, string[]> = {
    SAP_FUNCTIONAL_CONSULTANT: [
      'SAP S/4HANA Cloud (Public & Private Edition)',
      'SAP Fiori 3.0 & Spaces Architecture',
      'Clean Core Extensibility Principles',
      'Universal Journal (ACDOCA) Customizing'
    ],
    SAP_TECHNICAL_DEVELOPER: [
      'ABAP RESTful Application Programming (RAP)',
      'Core Data Services (CDS) Data Modeling',
      'Clean Core Developer Extensibility',
      'SAP BTP Cloud Foundry Runtime'
    ],
    SAP_INTEGRATION_ARCHITECT: [
      'SAP Integration Suite & Cloud Integration (CPI)',
      'Event Mesh & Asynchronous Messaging',
      'OpenAPI & RESTful API Management',
      'Hybrid Cloud Security & OAuth 2.0'
    ],
    ENTERPRISE_ANALYST: [
      'SAP Analytics Cloud (SAC) Stories & Modeling',
      'Datasphere Semantic Data Layering',
      'Predictive Scenario Forecasting',
      'Business Process Intelligence (Signavio)'
    ]
  };

  const emergingSkills = emergingSkillsMap[targetRole.track] || [
    'Clean Core Extensibility',
    'SAP BTP Integration',
    'SAP Fiori Architecture',
    'SAP Activate Agile Methodology'
  ];

  return (
    <div
      id="career-intelligence"
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
              Career Intelligence & Ecosystem Insights
            </h3>
            <span
              style={{
                fontSize: '0.75rem',
                backgroundColor: '#EBF3FB',
                color: '#0A6ED1',
                padding: '0.2rem 0.55rem',
                borderRadius: '12px',
                fontWeight: 600
              }}
            >
              Curated Architecture Insights
            </span>
          </div>
          <p style={{ fontSize: '0.8rem', color: '#5B6876', margin: '0.2rem 0 0' }}>
            Domain intelligence and transition guidance based on SAP ecosystem architecture and catalogue benchmarks.
          </p>
        </div>

        {/* Truthful Market Data Disclaimer */}
        <div
          style={{
            fontSize: '0.72rem',
            backgroundColor: '#F8FAFC',
            border: '1px solid #E2E8F0',
            color: '#64748B',
            padding: '0.35rem 0.75rem',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem'
          }}
        >
          <InfoIcon size={12} color="#0A6ED1" />
          <span>Curated Ecosystem Catalogue Assessment (Not Live Labor Web Scrape)</span>
        </div>
      </div>

      {/* 4 Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '1.25rem'
        }}
      >
        {/* Card 1: Emerging Competencies */}
        <div
          style={{
            backgroundColor: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0A6ED1', textTransform: 'uppercase' }}>
              Modern Competency Trends
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#001A47', margin: '0.3rem 0 0.75rem' }}>
              Emerging Skills in Track
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {emergingSkills.map((skill) => (
                <div
                  key={skill}
                  style={{
                    backgroundColor: '#FFFFFF',
                    border: '1px solid #EDF1F5',
                    borderRadius: '6px',
                    padding: '0.45rem 0.65rem',
                    fontSize: '0.78rem',
                    color: '#222B35',
                    fontWeight: 500,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.4rem'
                  }}
                >
                  <span style={{ color: '#0A6ED1', fontWeight: 700 }}>•</span>
                  <span>{skill}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ fontSize: '0.72rem', color: '#64748B', marginTop: '1rem' }}>
            Clean Core & Cloud-native SAP paradigms
          </div>
        </div>

        {/* Card 2: Ecosystem Demand & Compensation Profile */}
        <div
          style={{
            backgroundColor: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#107E3E', textTransform: 'uppercase' }}>
              Ecosystem Profile
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#001A47', margin: '0.3rem 0 0.75rem' }}>
              Market Demand & Compensation
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#5B6876' }}>Enterprise Demand:</span>
                <span style={{ fontWeight: 700, color: '#107E3E' }}>
                  {targetRole.marketDemand || 'High'} Demand
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#5B6876' }}>Benchmark Compensation:</span>
                <span style={{ fontWeight: 700, color: '#001A47' }}>
                  {targetRole.averageSalaryUsd}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#5B6876' }}>Typical Pivot Horizon:</span>
                <span style={{ fontWeight: 700, color: '#0A6ED1' }}>
                  {targetRole.typicalPivotTimeline || '3 – 6 Months'}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#5B6876' }}>Study Effort Estimate:</span>
                <span style={{ fontWeight: 700, color: '#633CA3' }}>
                  ~{targetRole.planningHoursEstimate || 80} Hours
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/jobs')}
            style={{
              marginTop: '1rem',
              backgroundColor: '#FFFFFF',
              border: '1px solid #D9E1E8',
              borderRadius: '6px',
              padding: '0.45rem 0.75rem',
              fontSize: '0.78rem',
              fontWeight: 600,
              color: '#0A6ED1',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem'
            }}
          >
            <BriefcaseIcon size={14} color="#0A6ED1" />
            <span>Search Verified Job Destinations</span>
          </button>
        </div>

        {/* Card 3: Strategic Next Actions */}
        <div
          style={{
            backgroundColor: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#E9730C', textTransform: 'uppercase' }}>
              Strategic Priorities
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#001A47', margin: '0.3rem 0 0.75rem' }}>
              High-Leverage Next Steps
            </h4>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.78rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                <span style={{ fontWeight: 800, color: '#E9730C' }}>1.</span>
                <span>
                  Bridge mandatory gap in <strong>S/4HANA Finance Customizing (IMG)</strong> via course S4F01.
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                <span style={{ fontWeight: 800, color: '#E9730C' }}>2.</span>
                <span>
                  Start practical challenge: <strong>Enterprise Organizational Blueprint</strong> to establish verifiable project evidence.
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem' }}>
                <span style={{ fontWeight: 800, color: '#E9730C' }}>3.</span>
                <span>
                  Calibrate remaining unconfirmed soft skills in <strong>Skills Review</strong> to boost match confidence.
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => navigate('/readiness')}
            style={{
              marginTop: '1rem',
              backgroundColor: '#0A6ED1',
              border: 'none',
              borderRadius: '6px',
              padding: '0.45rem 0.75rem',
              fontSize: '0.78rem',
              fontWeight: 600,
              color: '#FFFFFF',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem'
            }}
          >
            <span>Review 4-Tier Readiness Scorecard</span>
            <ArrowRightIcon size={12} color="#FFFFFF" />
          </button>
        </div>

        {/* Card 4: Side-by-Side Comparison Shortcut */}
        <div
          style={{
            backgroundColor: '#F8FAFC',
            border: '1px solid #E2E8F0',
            borderRadius: '8px',
            padding: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between'
          }}
        >
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#633CA3', textTransform: 'uppercase' }}>
              Multi-Role Decision Support
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#001A47', margin: '0.3rem 0 0.75rem' }}>
              Compare Alternative Careers
            </h4>

            <p style={{ fontSize: '0.8rem', color: '#5B6876', lineHeight: 1.45, margin: 0 }}>
              Unsure if {targetRole.title} is your optimal destination? Run side-by-side comparison across up to 4 roles to contrast transferable skill overlap, gap severity, and effort estimates.
            </p>
          </div>

          <button
            onClick={() => navigate('/careers/compare')}
            style={{
              marginTop: '1rem',
              backgroundColor: '#FFFFFF',
              border: '1px solid #633CA3',
              borderRadius: '6px',
              padding: '0.45rem 0.75rem',
              fontSize: '0.78rem',
              fontWeight: 600,
              color: '#633CA3',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.35rem'
            }}
          >
            <ColumnsIcon size={14} color="#633CA3" />
            <span>Open Side-by-Side Comparison</span>
          </button>
        </div>
      </div>
    </div>
  );
};
