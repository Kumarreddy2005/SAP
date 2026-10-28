import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Breadcrumbs } from '../components/common/Breadcrumbs';
import { StepIndicator } from '../components/common/StepIndicator';
import { Card } from '../components/common/Card';
import { Button } from '../components/common/Button';
import { Badge } from '../components/common/Badge';
import { EmptyState } from '../components/common/EmptyState';
import { AdvisoryNotice } from '../components/common/AdvisoryNotice';
import { ExternalLinkIcon, BriefcaseIcon, ArrowLeftIcon } from '../components/common/Icons';
import { VERIFIED_JOB_SEARCH_PORTALS, VERIFIED_LIVE_JOB_LISTINGS } from '../demo/demoJobs';
import { useCareerContext } from '../context/CareerContext';

export const JobsPage: React.FC = () => {
  const navigate = useNavigate();
  const { targetRole } = useCareerContext();

  const [searchQuery, setSearchQuery] = useState(targetRole.title);
  const [locationQuery, setLocationQuery] = useState('Remote');

  return (
    <div style={{ padding: '2rem 1.5rem', maxWidth: '1280px', margin: '0 auto' }}>
      <Breadcrumbs
        items={[
          { label: 'Readiness', path: '/readiness' },
          { label: 'Job Search Destinations' }
        ]}
      />
      <StepIndicator currentStepId="jobs" />

      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#001A47', marginBottom: '0.5rem' }}>
          Explore Real-World Job Opportunities
        </h1>
        <p style={{ color: '#5B6876', fontSize: '1.05rem', maxWidth: '800px' }}>
          Connect directly with verified external job portals pre-filtered with your target competencies for <strong>{targetRole.title}</strong>.
        </p>
      </div>

      <AdvisoryNotice
        style={{ marginBottom: '2rem' }}
        title="Zero Fabrication Policy"
        message="Career Orchestrator strictly refrains from fabricating synthetic job listings or scraping unverified third-party job ads. Instead, we generate authenticated deep-search queries into trusted official career engines (SAP Career Portal, LinkedIn Jobs, and Indeed)."
      />

      {/* Query Customizer Bar */}
      <Card
        title="Custom Search Parameters"
        subtitle="Customize role keywords and geographic preference to generate live search links"
        style={{ marginBottom: '2rem' }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.25rem', alignItems: 'flex-end' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.35rem', color: '#001A47' }}>
              Target Role Keywords
            </label>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. SAP S/4HANA Finance Consultant"
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem', marginBottom: '0.35rem', color: '#001A47' }}>
              Geographic Filter / Mode
            </label>
            <input
              type="text"
              value={locationQuery}
              onChange={(e) => setLocationQuery(e.target.value)}
              placeholder="e.g. Remote, United States, Germany, India"
              style={{ width: '100%' }}
            />
          </div>

          <div>
            <Button
              variant="outline"
              size="md"
              fullWidth
              onClick={() => {
                setSearchQuery(targetRole.title);
                setLocationQuery('Remote');
              }}
            >
              Reset to Current Target
            </Button>
          </div>
        </div>
      </Card>

      {/* Verified External Search Portal Cards */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.35rem', color: '#001A47', fontWeight: 700, marginBottom: '1.25rem' }}>
          Verified External Search Portals
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {VERIFIED_JOB_SEARCH_PORTALS.map((portal) => {
            const destinationUrl = portal.generateSearchUrl(searchQuery, locationQuery);

            return (
              <Card
                key={portal.id}
                hoverable
                title={portal.name}
                subtitle={portal.category}
                action={
                  <Badge variant={portal.category === 'SAP Official' ? 'info' : 'neutral'} size="sm">
                    Verified Link
                  </Badge>
                }
                footer={
                  <a
                    href={destinationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ textDecoration: 'none' }}
                  >
                    <Button variant="primary" size="sm" fullWidth icon={<ExternalLinkIcon size={14} />} iconPosition="right">
                      Search on {portal.name.split(' ')[0]}
                    </Button>
                  </a>
                }
              >
                <p style={{ color: '#5B6876', fontSize: '0.9rem', lineHeight: 1.5, marginBottom: '1rem', minHeight: '44px' }}>
                  {portal.description}
                </p>
                <div style={{ fontSize: '0.8rem', color: '#8492A0', wordBreak: 'break-all', backgroundColor: '#FAFBFD', padding: '0.5rem', borderRadius: '4px', border: '1px solid #EDF1F5' }}>
                  <strong>Query:</strong> {searchQuery} {locationQuery ? `• Location: ${locationQuery}` : ''}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Verified Live Listings Section (Demonstrating Clean Empty State) */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', color: '#001A47', fontWeight: 700 }}>
              Direct Verified Job Partner Feed
            </h2>
            <p style={{ fontSize: '0.9rem', color: '#5B6876' }}>
              Direct employer postings verified through authenticated enterprise API feeds
            </p>
          </div>
          <Badge variant="outline">0 Active Feed Integrations</Badge>
        </div>

        {VERIFIED_LIVE_JOB_LISTINGS.length === 0 ? (
          <EmptyState
            icon={<BriefcaseIcon size={40} />}
            title="No Direct Live Partner Listings Connected Yet"
            description="Direct employer API integrations will authenticate in Phase 6. Use the verified external search portals above to query real-time postings directly across SAP SE, LinkedIn, and Indeed."
            actionLabel="Search Official SAP Portal"
            onAction={() =>
              window.open(
                VERIFIED_JOB_SEARCH_PORTALS[0].generateSearchUrl(searchQuery, locationQuery),
                '_blank'
              )
            }
          />
        ) : (
          <div>{/* Future verified live listing cards */}</div>
        )}
      </div>

      {/* Bottom Actions */}
      <div
        style={{
          backgroundColor: '#FFFFFF',
          border: '1px solid #D9E1E8',
          borderRadius: '8px',
          padding: '1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <Button variant="ghost" icon={<ArrowLeftIcon size={16} />} onClick={() => navigate('/readiness')}>
          Back to Readiness Dashboard
        </Button>
        <Button variant="primary" onClick={() => navigate('/')}>
          Return to Platform Home
        </Button>
      </div>
    </div>
  );
};
