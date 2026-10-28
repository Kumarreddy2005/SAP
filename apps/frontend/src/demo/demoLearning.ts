export interface LearningModule {
  id: string;
  code: string;
  title: string;
  provider: 'SAP Learning Hub (Student Edition)' | 'openSAP' | 'SAP Developers Community' | 'Verified Open Courseware';
  targetSkill: string;
  estimatedHours: number;
  externalUrl: string;
  isVerified: boolean;
  level: 'Foundational' | 'Intermediate' | 'Advanced';
  syllabusPoints: string[];
  roleSlug: string;
  milestoneOrder: number;
}

export const DEMO_LEARNING_MODULES: LearningModule[] = [
  {
    id: 'learn-s4f01',
    code: 'S4F01',
    title: 'Financial Accounting in SAP S/4HANA — Business Processes',
    provider: 'SAP Learning Hub (Student Edition)',
    targetSkill: 'S/4HANA Finance Customizing (IMG)',
    estimatedHours: 40,
    externalUrl: 'https://learning.sap.com/learning-journeys/outlining-the-financial-accounting-processes-in-sap-s-4hana',
    isVerified: true,
    level: 'Foundational',
    syllabusPoints: [
      'Universal Journal architecture and ACDOCA table deep-dive',
      'Organizational units: Chart of Accounts, Company Code, Fiscal Year Variant',
      'Posting general ledger transactions and managing document splitting',
      'Financial closing activities and trial balance generation'
    ],
    roleSlug: 'sap-s4hana-finance-consultant',
    milestoneOrder: 1
  },
  {
    id: 'learn-fiori-fi',
    code: 'UX100',
    title: 'SAP Fiori — System Administration & Finance Launchpad Navigation',
    provider: 'SAP Learning Hub (Student Edition)',
    targetSkill: 'SAP Fiori Financial Apps',
    estimatedHours: 18,
    externalUrl: 'https://learning.sap.com/learning-journeys/discover-sap-fiori',
    isVerified: true,
    level: 'Intermediate',
    syllabusPoints: [
      'Role-based SAP Fiori launchpad spaces and pages configuration',
      'Navigating transactional, analytical, and factsheet financial apps',
      'Managing user authorization catalogs for finance personnel'
    ],
    roleSlug: 'sap-s4hana-finance-consultant',
    milestoneOrder: 2
  },
  {
    id: 'learn-s4f02',
    code: 'S4F02',
    title: 'Financial Accounting in SAP S/4HANA — Academy Customizing',
    provider: 'SAP Learning Hub (Student Edition)',
    targetSkill: 'S/4HANA Finance Customizing (IMG)',
    estimatedHours: 35,
    externalUrl: 'https://learning.sap.com/learning-journeys/configuring-financial-accounting-in-sap-s-4hana',
    isVerified: true,
    level: 'Advanced',
    syllabusPoints: [
      'Customizing posting periods, tolerance groups, and document types in IMG',
      'Currencies configuration: Group currency, hard currency, index-based currency',
      'Integration between General Ledger, Accounts Payable, and Accounts Receivable'
    ],
    roleSlug: 'sap-s4hana-finance-consultant',
    milestoneOrder: 3
  },
  {
    id: 'learn-activate',
    code: 'ACT100',
    title: 'SAP Activate Methodology for Agile S/4HANA Deployments',
    provider: 'openSAP',
    targetSkill: 'SAP Activate Methodology',
    estimatedHours: 12,
    externalUrl: 'https://learning.sap.com/learning-journeys/explore-sap-activate',
    isVerified: true,
    level: 'Foundational',
    syllabusPoints: [
      'The six phases of SAP Activate: Discover, Prepare, Explore, Realize, Deploy, Run',
      'Conducting Fit-to-Standard workshops with SAP Best Practices',
      'Agile sprints, backlog grooming, and test cycle management'
    ],
    roleSlug: 'sap-s4hana-finance-consultant',
    milestoneOrder: 4
  },
  {
    id: 'learn-rap',
    code: 'RAP100',
    title: 'Building Modern Extensions with ABAP RESTful Application Programming',
    provider: 'openSAP',
    targetSkill: 'ABAP RESTful Application Programming (RAP)',
    estimatedHours: 24,
    externalUrl: 'https://learning.sap.com/learning-journeys/acquire-core-abap-skills',
    isVerified: true,
    level: 'Intermediate',
    syllabusPoints: [
      'Core Data Services (CDS) entity modeling and associations',
      'Behavior definition, behavior implementation, and business logic execution',
      'Publishing OData V4 services for SAP Fiori Elements'
    ],
    roleSlug: 'sap-abap-cloud-developer',
    milestoneOrder: 1
  },
  {
    id: 'learn-btp-found',
    code: 'CLD900',
    title: 'SAP Business Technology Platform (BTP) Foundation',
    provider: 'SAP Learning Hub (Student Edition)',
    targetSkill: 'SAP Integration Suite / Cloud Foundry',
    estimatedHours: 20,
    externalUrl: 'https://learning.sap.com/learning-journeys/discovering-sap-business-technology-platform',
    isVerified: true,
    level: 'Foundational',
    syllabusPoints: [
      'Cloud Foundry environment, subaccounts, and entitlement quotas',
      'BTP security: Custom identity providers, role collections and scopes',
      'Overview of Integration Suite, Extension Suite, and HANA Cloud'
    ],
    roleSlug: 'sap-abap-cloud-developer',
    milestoneOrder: 2
  }
];
