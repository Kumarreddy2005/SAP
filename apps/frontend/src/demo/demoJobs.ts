export interface VerifiedJobSearchPortal {
  id: string;
  name: string;
  category: 'SAP Official' | 'Professional Network' | 'Aggregated Job Engine';
  description: string;
  generateSearchUrl: (keywords: string, location?: string) => string;
  iconName: string;
}

export const VERIFIED_JOB_SEARCH_PORTALS: VerifiedJobSearchPortal[] = [
  {
    id: 'sap-careers-official',
    name: 'SAP Career Portal (Official)',
    category: 'SAP Official',
    description: 'Explore verified positions directly within SAP AG and subsidiaries worldwide.',
    generateSearchUrl: (keywords: string, location = '') =>
      `https://jobs.sap.com/search/?q=${encodeURIComponent(keywords)}&locationsearch=${encodeURIComponent(location)}`,
    iconName: 'AwardIcon'
  },
  {
    id: 'linkedin-jobs',
    name: 'LinkedIn Jobs Directory',
    category: 'Professional Network',
    description: 'Filter real-time postings across enterprise SAP consulting partners and enterprise clients.',
    generateSearchUrl: (keywords: string, location = '') =>
      `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(keywords)}&location=${encodeURIComponent(location)}`,
    iconName: 'BriefcaseIcon'
  },
  {
    id: 'indeed-jobs',
    name: 'Indeed Enterprise Jobs',
    category: 'Aggregated Job Engine',
    description: 'Direct searches across global corporate job postings and enterprise implementers.',
    generateSearchUrl: (keywords: string, location = '') =>
      `https://www.indeed.com/jobs?q=${encodeURIComponent(keywords)}&l=${encodeURIComponent(location)}`,
    iconName: 'SearchIcon'
  }
];

export interface VerifiedLiveJobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  workMode: 'Remote' | 'Hybrid' | 'On-site';
  track: string;
  sourceUrl: string;
  postedDate: string;
  isVerifiedLive: boolean;
}

// Strictly empty array for verified live listings, clearly illustrating the empty state
// until live enterprise feed integrations are authenticated and verified
export const VERIFIED_LIVE_JOB_LISTINGS: VerifiedLiveJobListing[] = [];
