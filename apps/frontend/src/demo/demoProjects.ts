import { ProficiencyLevel } from '@career-orchestrator/shared';

export interface PracticalProject {
  id: string;
  roleSlug: string;
  title: string;
  difficulty: ProficiencyLevel;
  estimatedEffortHours: number;
  targetSkills: string[];
  description: string;
  deliverables: string[];
  rubricCriteria: { criterion: string; weightPercentage: number }[];
  sampleSolutionGuideUrl?: string;
}

export const DEMO_PROJECTS: PracticalProject[] = [
  {
    id: 'proj-fi-01',
    roleSlug: 'sap-s4hana-finance-consultant',
    title: 'Enterprise Organizational Blueprint & Company Code Setup',
    difficulty: 'INTERMEDIATE',
    estimatedEffortHours: 12,
    targetSkills: ['S/4HANA Finance Customizing (IMG)', 'General Ledger Accounting', 'Business Process Mapping'],
    description: 'Design and document the financial structure for a multinational enterprise with two operating subsidiaries in different fiscal zones. Configure or blueprint the Chart of Accounts (COA), define posting period variants, and document the Universal Journal ledger setup.',
    deliverables: [
      'Functional Configuration Document (.pdf or markdown) outlining the enterprise hierarchy',
      'Table listing Chart of Accounts, Account Groups, and Retained Earnings Account assignments',
      'Architecture diagram detailing the relation between Company Code, Fiscal Year Variant, and Field Status Groups'
    ],
    rubricCriteria: [
      { criterion: 'Completeness of Organizational Structure Hierarchy', weightPercentage: 35 },
      { criterion: 'Accurate General Ledger Account Group segmentation', weightPercentage: 35 },
      { criterion: 'Professional enterprise documentation formatting', weightPercentage: 30 }
    ]
  },
  {
    id: 'proj-fi-02',
    roleSlug: 'sap-s4hana-finance-consultant',
    title: 'Month-End Closing Automation & Financial Reporting Story',
    difficulty: 'ADVANCED',
    estimatedEffortHours: 16,
    targetSkills: ['SAP Fiori Financial Apps', 'Financial Reporting & IFRS', 'S/4HANA Finance Customizing (IMG)'],
    description: 'Simulate a month-end close cycle. Configure accrual postings, simulate foreign currency valuation adjustments for open balance sheet items, and design a customized reporting view in SAP Fiori or spreadsheet mockup adhering to IFRS standards.',
    deliverables: [
      'Documented step-by-step month-end closing checklist following SAP Best Practices',
      'Demonstrated sample journal entries with document splitting rules explained',
      'Executive Trial Balance summary report with variance commentary'
    ],
    rubricCriteria: [
      { criterion: 'Correctness of foreign currency & document split rules', weightPercentage: 40 },
      { criterion: 'Clarity of the closing procedure runbook', weightPercentage: 30 },
      { criterion: 'Financial variance analysis insight', weightPercentage: 30 }
    ]
  },
  {
    id: 'proj-abap-01',
    roleSlug: 'sap-abap-cloud-developer',
    title: 'Clean-Core Customer Inquiry API using ABAP RAP on BTP',
    difficulty: 'INTERMEDIATE',
    estimatedEffortHours: 14,
    targetSkills: ['ABAP RESTful Application Programming (RAP)', 'Core Data Services (CDS) Views', 'REST APIs & OData Protocol'],
    description: 'Construct an OData V4 service using modern ABAP Cloud syntax on SAP BTP Trial or Sandbox. Build a root CDS view entity on customer transactional records, implement transactional CRUD operations via a behavior pool, and expose the service definition.',
    deliverables: [
      'GitHub repository link containing the ABAP source files exported via abapGit',
      'README.md containing OData service metadata inspection screenshots',
      'Written reflection explaining how Clean Core principles were maintained without modifying standard tables'
    ],
    rubricCriteria: [
      { criterion: 'Adherence to ABAP Cloud language version rules (Clean Core)', weightPercentage: 40 },
      { criterion: 'Correct implementation of RAP behavior definitions & validations', weightPercentage: 35 },
      { criterion: 'Code documentation & git commit discipline', weightPercentage: 25 }
    ]
  }
];
