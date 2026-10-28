import { SkillCategory, ProficiencyLevel } from '@career-orchestrator/shared';

export interface UserSkillItem {
  id: string;
  code: string;
  name: string;
  category: SkillCategory;
  proficiency: ProficiencyLevel;
  yearsExperience: number;
  isConfirmed: boolean;
  isTransferable: boolean;
  confidenceScore: number;
  sourceSnippet?: string;
}

export const INITIAL_DEMO_SKILLS: UserSkillItem[] = [
  {
    id: 'skill-1',
    code: 'DOM-GL-ACC',
    name: 'General Ledger Accounting',
    category: 'DOMAIN_BUSINESS',
    proficiency: 'ADVANCED',
    yearsExperience: 4.5,
    isConfirmed: true,
    isTransferable: true,
    confidenceScore: 0.96,
    sourceSnippet: 'Managed end-to-end month-end general ledger reconciliations and financial statement preparation.'
  },
  {
    id: 'skill-2',
    code: 'DOM-FIN-REP',
    name: 'Financial Reporting & IFRS',
    category: 'DOMAIN_BUSINESS',
    proficiency: 'ADVANCED',
    yearsExperience: 4.0,
    isConfirmed: true,
    isTransferable: true,
    confidenceScore: 0.94,
    sourceSnippet: 'Prepared statutory IFRS balance sheet reports and quarterly cash flow summaries.'
  },
  {
    id: 'skill-3',
    code: 'TECH-SQL',
    name: 'Relational Database Querying (SQL)',
    category: 'SOFTWARE_DEV',
    proficiency: 'INTERMEDIATE',
    yearsExperience: 2.0,
    isConfirmed: true,
    isTransferable: true,
    confidenceScore: 0.88,
    sourceSnippet: 'Executed SQL queries and joins on transactional databases to audit anomalies.'
  },
  {
    id: 'skill-4',
    code: 'SOFT-BIZ-PROC',
    name: 'Business Process Mapping',
    category: 'TRANSFERABLE_SOFT',
    proficiency: 'INTERMEDIATE',
    yearsExperience: 3.0,
    isConfirmed: true,
    isTransferable: true,
    confidenceScore: 0.91,
    sourceSnippet: 'Documented standard operating procedures and workflows for ERP record-to-report transitions.'
  },
  {
    id: 'skill-5',
    code: 'TECH-EXCEL-ADV',
    name: 'Advanced Financial Modeling (Excel / Pivot)',
    category: 'DATA_ANALYTICS',
    proficiency: 'EXPERT',
    yearsExperience: 5.0,
    isConfirmed: true,
    isTransferable: true,
    confidenceScore: 0.98,
    sourceSnippet: 'Architected automated forecasting models using VBA, Power Query, and advanced lookup formulas.'
  },
  {
    id: 'skill-6',
    code: 'SOFT-STAKEHOLDER',
    name: 'Cross-Functional Stakeholder Alignment',
    category: 'TRANSFERABLE_SOFT',
    proficiency: 'ADVANCED',
    yearsExperience: 3.5,
    isConfirmed: false,
    isTransferable: true,
    confidenceScore: 0.82,
    sourceSnippet: 'Facilitated quarterly alignment meetings between treasury, IT and executive business stakeholders.'
  },
  {
    id: 'skill-7',
    code: 'SAP-S4-FI-AWARE',
    name: 'SAP S/4HANA Finance Architecture Awareness',
    category: 'SAP_FUNCTIONAL',
    proficiency: 'NOVICE',
    yearsExperience: 0.5,
    isConfirmed: false,
    isTransferable: false,
    confidenceScore: 0.76,
    sourceSnippet: 'Participated in SAP S/4HANA user acceptance testing for accounts payable journal entries.'
  }
];

export const AVAILABLE_SKILL_CATALOGUE = [
  { code: 'SAP-S4-FI-CONF', name: 'S/4HANA Finance Customizing (IMG)', category: 'SAP_FUNCTIONAL' },
  { code: 'SAP-FIORI-APPS', name: 'SAP Fiori Launchpad & Financial Apps', category: 'SAP_FUNCTIONAL' },
  { code: 'SAP-ABAP-RAP', name: 'ABAP RESTful Application Programming (RAP)', category: 'SAP_TECHNICAL' },
  { code: 'SAP-CDS-VIEWS', name: 'Core Data Services (CDS) Views', category: 'SAP_TECHNICAL' },
  { code: 'SAP-BTP-INT', name: 'SAP Integration Suite / Cloud Foundry', category: 'SAP_TECHNICAL' },
  { code: 'SAP-SAC-PLAN', name: 'SAP Analytics Cloud (SAC) Planning', category: 'DATA_ANALYTICS' },
  { code: 'LANG-PYTHON', name: 'Python Data Analysis & Automation', category: 'SOFTWARE_DEV' },
  { code: 'METHOD-AGILE', name: 'Agile & SAP Activate Methodology', category: 'TRANSFERABLE_SOFT' }
];
