import { ExtractedSkillItem } from '@career-orchestrator/shared';

export type UserSkillItem = ExtractedSkillItem;

export const INITIAL_DEMO_SKILLS: ExtractedSkillItem[] = [
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
    extractionMethod: 'EXPLICIT_MENTION',
    evidenceSnippet: 'Managed end-to-end month-end general ledger reconciliations and financial statement preparation.',
    reviewStatus: 'CONFIRMED'
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
    extractionMethod: 'EXPLICIT_MENTION',
    evidenceSnippet: 'Prepared statutory IFRS balance sheet reports and quarterly cash flow summaries.',
    reviewStatus: 'CONFIRMED'
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
    extractionMethod: 'EXPLICIT_MENTION',
    evidenceSnippet: 'Executed SQL queries and joins on transactional databases to audit anomalies.',
    reviewStatus: 'CONFIRMED'
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
    extractionMethod: 'CONTEXTUAL_INFERENCE',
    evidenceSnippet: 'Documented standard operating procedures and workflows for ERP record-to-report transitions.',
    reviewStatus: 'CONFIRMED'
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
    extractionMethod: 'EXPLICIT_MENTION',
    evidenceSnippet: 'Architected automated forecasting models using VBA, Power Query, and advanced lookup formulas.',
    reviewStatus: 'CONFIRMED'
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
    extractionMethod: 'CONTEXTUAL_INFERENCE',
    evidenceSnippet: 'Facilitated quarterly alignment meetings between treasury, IT and executive business stakeholders.',
    reviewStatus: 'SUGGESTED'
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
    extractionMethod: 'CONTEXTUAL_INFERENCE',
    evidenceSnippet: 'Participated in SAP S/4HANA user acceptance testing for accounts payable journal entries.',
    reviewStatus: 'SUGGESTED'
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
