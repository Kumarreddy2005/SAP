import { CareerRole } from '@career-orchestrator/shared';

export interface ExtendedCareerRole extends CareerRole {
  isSapEcosystem: boolean;
  typicalPivotTimeline: string;
  matchScoreDemo: number;
  averageSalaryUsd: string;
  learningHoursEstimate: number;
  tags: string[];
}

export const DEMO_CAREER_ROLES: ExtendedCareerRole[] = [
  {
    id: 'role-s4-fi',
    slug: 'sap-s4hana-finance-consultant',
    title: 'SAP S/4HANA Finance Functional Consultant',
    track: 'SAP_FUNCTIONAL_CONSULTANT',
    isSapEcosystem: true,
    summary: 'Design, customize and implement Universal Journal, General Ledger, Accounts Payable/Receivable and Asset Accounting on SAP S/4HANA Cloud.',
    marketDemand: 'Critical',
    matchScoreDemo: 78,
    typicalPivotTimeline: '8–12 weeks',
    averageSalaryUsd: '$115,000 – $145,000',
    learningHoursEstimate: 75,
    tags: ['S/4HANA', 'Finance', 'Fiori', 'Consulting'],
    prerequisites: ['Foundational General Ledger Accounting knowledge', 'Familiarity with financial statements'],
    requiredSkills: [
      { skillId: 's1', skillName: 'General Ledger Accounting', category: 'DOMAIN_BUSINESS', minimumLevel: 'ADVANCED', weight: 1.0, isMandatory: true },
      { skillId: 's2', skillName: 'S/4HANA Finance Customizing (IMG)', category: 'SAP_FUNCTIONAL', minimumLevel: 'INTERMEDIATE', weight: 1.0, isMandatory: true },
      { skillId: 's3', skillName: 'SAP Fiori Financial Apps', category: 'SAP_FUNCTIONAL', minimumLevel: 'INTERMEDIATE', weight: 0.8, isMandatory: true },
      { skillId: 's4', skillName: 'Business Process Mapping', category: 'TRANSFERABLE_SOFT', minimumLevel: 'INTERMEDIATE', weight: 0.7, isMandatory: false },
      { skillId: 's5', skillName: 'SAP Activate Methodology', category: 'TRANSFERABLE_SOFT', minimumLevel: 'NOVICE', weight: 0.5, isMandatory: false }
    ]
  },
  {
    id: 'role-abap-cloud',
    slug: 'sap-abap-cloud-developer',
    title: 'SAP ABAP Cloud & BTP Developer',
    track: 'SAP_TECHNICAL_DEVELOPER',
    isSapEcosystem: true,
    summary: 'Develop clean-core enterprise extensions and cloud APIs using modern ABAP, Core Data Services (CDS), and RAP on SAP Business Technology Platform.',
    marketDemand: 'High',
    matchScoreDemo: 62,
    typicalPivotTimeline: '12–16 weeks',
    averageSalaryUsd: '$110,000 – $140,000',
    learningHoursEstimate: 110,
    tags: ['ABAP Cloud', 'RAP', 'CDS Views', 'BTP', 'Clean Core'],
    prerequisites: ['Basic object-oriented programming concepts', 'Relational database SQL querying'],
    requiredSkills: [
      { skillId: 's6', skillName: 'Relational Database Querying (SQL)', category: 'SOFTWARE_DEV', minimumLevel: 'ADVANCED', weight: 0.9, isMandatory: true },
      { skillId: 's7', skillName: 'ABAP RESTful Application Programming (RAP)', category: 'SAP_TECHNICAL', minimumLevel: 'INTERMEDIATE', weight: 1.0, isMandatory: true },
      { skillId: 's8', skillName: 'Core Data Services (CDS) Views', category: 'SAP_TECHNICAL', minimumLevel: 'INTERMEDIATE', weight: 0.9, isMandatory: true },
      { skillId: 's9', skillName: 'Clean Core Architecture Principles', category: 'SAP_TECHNICAL', minimumLevel: 'INTERMEDIATE', weight: 0.7, isMandatory: false },
      { skillId: 's10', skillName: 'REST APIs & OData Protocol', category: 'SOFTWARE_DEV', minimumLevel: 'INTERMEDIATE', weight: 0.8, isMandatory: true }
    ]
  },
  {
    id: 'role-s4-mm',
    slug: 'sap-s4hana-sourcing-procurement',
    title: 'SAP S/4HANA Sourcing & Procurement Consultant (MM)',
    track: 'SAP_FUNCTIONAL_CONSULTANT',
    isSapEcosystem: true,
    summary: 'Configure end-to-end procure-to-pay lifecycles, material master data, inventory management, and automated purchasing workflows.',
    marketDemand: 'High',
    matchScoreDemo: 54,
    typicalPivotTimeline: '10–14 weeks',
    averageSalaryUsd: '$105,000 – $135,000',
    learningHoursEstimate: 85,
    tags: ['Materials Management', 'Procurement', 'Inventory', 'Logistics'],
    prerequisites: ['Understanding of supply chain or purchasing operations'],
    requiredSkills: [
      { skillId: 's11', skillName: 'Procurement & Purchasing Workflows', category: 'DOMAIN_BUSINESS', minimumLevel: 'INTERMEDIATE', weight: 0.9, isMandatory: true },
      { skillId: 's12', skillName: 'S/4HANA Materials Management Customizing', category: 'SAP_FUNCTIONAL', minimumLevel: 'INTERMEDIATE', weight: 1.0, isMandatory: true },
      { skillId: 's13', skillName: 'Cross-Functional Stakeholder Alignment', category: 'TRANSFERABLE_SOFT', minimumLevel: 'INTERMEDIATE', weight: 0.7, isMandatory: false },
      { skillId: 's14', skillName: 'Inventory Valuation & Invoicing', category: 'DOMAIN_BUSINESS', minimumLevel: 'INTERMEDIATE', weight: 0.8, isMandatory: true }
    ]
  },
  {
    id: 'role-integration-suite',
    slug: 'sap-integration-suite-architect',
    title: 'SAP Integration Suite Specialist',
    track: 'SAP_INTEGRATION_ARCHITECT',
    isSapEcosystem: true,
    summary: 'Design hybrid multi-cloud integration flows, API management gateways, event mesh brokers, and B2B EDI connections across enterprise systems.',
    marketDemand: 'Critical',
    matchScoreDemo: 58,
    typicalPivotTimeline: '10–14 weeks',
    averageSalaryUsd: '$120,000 – $155,000',
    learningHoursEstimate: 95,
    tags: ['Integration Suite', 'BTP', 'APIs', 'Event Mesh'],
    prerequisites: ['Familiarity with HTTP/REST, JSON, XML protocols', 'API integration basics'],
    requiredSkills: [
      { skillId: 's15', skillName: 'REST APIs & OData Protocol', category: 'SOFTWARE_DEV', minimumLevel: 'ADVANCED', weight: 1.0, isMandatory: true },
      { skillId: 's16', skillName: 'SAP Cloud Integration Flow Modeling', category: 'SAP_TECHNICAL', minimumLevel: 'INTERMEDIATE', weight: 1.0, isMandatory: true },
      { skillId: 's17', skillName: 'Enterprise Security & OAuth 2.0', category: 'SOFTWARE_DEV', minimumLevel: 'INTERMEDIATE', weight: 0.8, isMandatory: false },
      { skillId: 's18', skillName: 'Message Mapping (Groovy/XSLT)', category: 'SAP_TECHNICAL', minimumLevel: 'INTERMEDIATE', weight: 0.8, isMandatory: true }
    ]
  },
  {
    id: 'role-sac-consultant',
    slug: 'sap-analytics-cloud-consultant',
    title: 'SAP Analytics Cloud (SAC) Consultant',
    track: 'ENTERPRISE_ANALYST',
    isSapEcosystem: true,
    summary: 'Deliver interactive executive dashboards, augmented predictive analytics, financial planning models, and live data stories with SAC.',
    marketDemand: 'High',
    matchScoreDemo: 74,
    typicalPivotTimeline: '6–10 weeks',
    averageSalaryUsd: '$105,000 – $135,000',
    learningHoursEstimate: 60,
    tags: ['SAC', 'BI', 'Planning', 'Predictive', 'Dashboards'],
    prerequisites: ['Advanced spreadsheet modeling or business intelligence reporting'],
    requiredSkills: [
      { skillId: 's19', skillName: 'Advanced Financial Modeling (Excel / Pivot)', category: 'DATA_ANALYTICS', minimumLevel: 'EXPERT', weight: 0.9, isMandatory: true },
      { skillId: 's20', skillName: 'SAC Story Design & Visual Analytics', category: 'DATA_ANALYTICS', minimumLevel: 'INTERMEDIATE', weight: 1.0, isMandatory: true },
      { skillId: 's21', skillName: 'Relational Database Querying (SQL)', category: 'SOFTWARE_DEV', minimumLevel: 'INTERMEDIATE', weight: 0.7, isMandatory: false },
      { skillId: 's22', skillName: 'Financial Reporting & IFRS', category: 'DOMAIN_BUSINESS', minimumLevel: 'ADVANCED', weight: 0.8, isMandatory: true }
    ]
  },
  {
    id: 'role-biz-analyst',
    slug: 'enterprise-business-analyst',
    title: 'Enterprise ERP Business Systems Analyst',
    track: 'ENTERPRISE_ANALYST',
    isSapEcosystem: false,
    summary: 'Bridge operational business divisions and technical ERP engineering teams. Formulate functional requirements, user stories and process improvements.',
    marketDemand: 'High',
    matchScoreDemo: 82,
    typicalPivotTimeline: '4–8 weeks',
    averageSalaryUsd: '$95,000 – $125,000',
    learningHoursEstimate: 45,
    tags: ['Requirements', 'Agile', 'BPMN', 'Non-SAP Hybrid'],
    prerequisites: ['Strong verbal and written business communication skills'],
    requiredSkills: [
      { skillId: 's23', skillName: 'Business Process Mapping', category: 'TRANSFERABLE_SOFT', minimumLevel: 'ADVANCED', weight: 1.0, isMandatory: true },
      { skillId: 's24', skillName: 'Cross-Functional Stakeholder Alignment', category: 'TRANSFERABLE_SOFT', minimumLevel: 'ADVANCED', weight: 0.9, isMandatory: true },
      { skillId: 's25', skillName: 'General Ledger Accounting', category: 'DOMAIN_BUSINESS', minimumLevel: 'INTERMEDIATE', weight: 0.8, isMandatory: false },
      { skillId: 's26', skillName: 'Agile & Scrum User Story Writing', category: 'TRANSFERABLE_SOFT', minimumLevel: 'INTERMEDIATE', weight: 0.7, isMandatory: true }
    ]
  },
  {
    id: 'role-fullstack-dev',
    slug: 'cloud-fullstack-engineer',
    title: 'Cloud Full-Stack Enterprise Developer',
    track: 'HYBRID_CROSS_ERP',
    isSapEcosystem: false,
    summary: 'Build responsive web apps, microservices, and backend enterprise integrations using TypeScript, React, Node.js, and Cloud Databases.',
    marketDemand: 'High',
    matchScoreDemo: 48,
    typicalPivotTimeline: '16–20 weeks',
    averageSalaryUsd: '$105,000 – $140,000',
    learningHoursEstimate: 140,
    tags: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Cloud'],
    prerequisites: ['Fundamentals of HTML, CSS, JavaScript/TypeScript'],
    requiredSkills: [
      { skillId: 's27', skillName: 'Relational Database Querying (SQL)', category: 'SOFTWARE_DEV', minimumLevel: 'ADVANCED', weight: 0.9, isMandatory: true },
      { skillId: 's28', skillName: 'Full-Stack JavaScript/TypeScript Architecture', category: 'SOFTWARE_DEV', minimumLevel: 'ADVANCED', weight: 1.0, isMandatory: true },
      { skillId: 's29', skillName: 'REST APIs & OData Protocol', category: 'SOFTWARE_DEV', minimumLevel: 'INTERMEDIATE', weight: 0.8, isMandatory: true }
    ]
  }
];
