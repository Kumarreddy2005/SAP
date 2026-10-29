import { PracticalProjectDefinition } from '@career-orchestrator/shared';

export const PRACTICAL_PROJECTS_CATALOGUE: PracticalProjectDefinition[] = [
  {
    id: 'proj-fi-01',
    roleSlug: 'sap-s4hana-finance-consultant',
    title: 'Enterprise Organizational Blueprint & Company Code Setup',
    difficulty: 'INTERMEDIATE',
    estimatedEffortHours: 12,
    targetSkills: ['S/4HANA Finance Customizing (IMG)', 'General Ledger Accounting', 'Business Process Mapping'],
    description:
      'Design and document the financial structure for a multinational enterprise with two operating subsidiaries in different fiscal zones. Configure or blueprint the Chart of Accounts (COA), define posting period variants, and document the Universal Journal ledger setup.',
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
    description:
      'Simulate a month-end close cycle. Configure accrual postings, simulate foreign currency valuation adjustments for open balance sheet items, and design a customized reporting view in SAP Fiori or spreadsheet mockup adhering to IFRS standards.',
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
    description:
      'Construct an OData V4 service using ABAP RESTful Application Programming model (RAP) on an SAP BTP trial account or local mock. Define a root CDS view entity on customer orders, create behavior definitions with validation rules, and expose the service via service binding.',
    deliverables: [
      'Source code export of Core Data Services (CDS) data definition and projections',
      'Behavior definition (BDEF) with custom validation method checking credit limit',
      'Screen capture or response payload showing successful metadata retrieval from OData V4 service'
    ],
    rubricCriteria: [
      { criterion: 'Compliance with Clean Core architectural principles', weightPercentage: 40 },
      { criterion: 'Proper CDS entity annotations and associations', weightPercentage: 35 },
      { criterion: 'Validation method error handling and status codes', weightPercentage: 25 }
    ]
  },
  {
    id: 'proj-mm-01',
    roleSlug: 'sap-s4hana-sourcing-procurement',
    title: 'Procure-to-Pay Lifecycle Configuration & Automatic Account Determination',
    difficulty: 'INTERMEDIATE',
    estimatedEffortHours: 14,
    targetSkills: ['S/4HANA Materials Management Customizing', 'Procurement & Purchasing Workflows', 'General Ledger Accounting'],
    description:
      'Configure end-to-end procurement settings. Define material types, valuation classes, and map transaction keys (BSX, WRX) to automatic General Ledger reconciliation accounts in OBYC. Simulate purchase order generation and 3-way invoice matching.',
    deliverables: [
      'Valuation class and account determination matrix documenting MM-FI integration',
      'Purchase Order document with standard pricing procedure breakdown',
      'Goods Receipt (MIGO) and Invoice Verification (MIRO) transaction verification runbook'
    ],
    rubricCriteria: [
      { criterion: 'Accuracy of automatic account determination (OBYC) rules', weightPercentage: 40 },
      { criterion: 'Proper handling of Goods Receipt / Invoice Receipt (GR/IR) clearing', weightPercentage: 35 },
      { criterion: 'Completeness of material master purchasing view setup', weightPercentage: 25 }
    ]
  },
  {
    id: 'proj-int-01',
    roleSlug: 'sap-integration-suite-architect',
    title: 'Enterprise Integration Flow with OAuth 2.0 & Exception Subprocess',
    difficulty: 'ADVANCED',
    estimatedEffortHours: 16,
    targetSkills: ['SAP Cloud Integration Flow Modeling', 'REST APIs & OData Protocol', 'Enterprise Security & OAuth 2.0'],
    description:
      'Model an asynchronous integration flow (iFlow) in SAP Cloud Integration that ingests external JSON webhooks, transforms payloads using Groovy scripting, validates schema constraints, and routes transactions with error alerts via Exception Subprocess.',
    deliverables: [
      'Exported iFlow configuration bundle (.zip) or graphical architecture model',
      'Custom Groovy transformation script with regex input sanitation',
      'Exception subprocess runbook with dead-letter queue routing explanation'
    ],
    rubricCriteria: [
      { criterion: 'Robustness of error handling and exception subprocess', weightPercentage: 40 },
      { criterion: 'Efficiency and security of the Groovy mapping script', weightPercentage: 30 },
      { criterion: 'Appropriate credential and security artifact management', weightPercentage: 30 }
    ]
  },
  {
    id: 'proj-sac-01',
    roleSlug: 'sap-analytics-cloud-consultant',
    title: 'Executive Financial Storyboard & Variance Dashboard',
    difficulty: 'INTERMEDIATE',
    estimatedEffortHours: 10,
    targetSkills: ['SAC Story Design & Visual Analytics', 'Advanced Financial Modeling (Excel / Pivot)', 'Financial Reporting & IFRS'],
    description:
      'Build an executive dashboard story in SAP Analytics Cloud or interactive BI tool connecting to transactional ERP finance data. Design responsive summary tiles, dynamic waterfall charts for operating profit variance, and parameterized forecast scenarios.',
    deliverables: [
      'Interactive dashboard story mockup or SAC export showing KPI summary tiles',
      'Variance chart visualizing Actual vs Budget vs Forecast revenue streams',
      'Documentation of underlying calculated dimensions and currency conversions'
    ],
    rubricCriteria: [
      { criterion: 'Visual clarity and adherence to IBCS executive reporting standards', weightPercentage: 40 },
      { criterion: 'Accuracy of financial variance formulas and KPI definitions', weightPercentage: 35 },
      { criterion: 'Responsiveness of the layout across devices', weightPercentage: 25 }
    ]
  },
  {
    id: 'proj-ba-01',
    roleSlug: 'enterprise-business-analyst',
    title: 'As-Is to To-Be ERP Process Re-engineering & User Story Backlog',
    difficulty: 'INTERMEDIATE',
    estimatedEffortHours: 12,
    targetSkills: ['Business Process Mapping', 'Cross-Functional Stakeholder Alignment', 'Agile & Scrum User Story Writing'],
    description:
      'Conduct a business process review of an order-to-cash process plagued by manual handoffs. Map the As-Is BPMN diagram, identify bottlenecks, formulate a modernized To-Be workflow for S/4HANA, and author 5 detailed Agile user stories with acceptance criteria.',
    deliverables: [
      'BPMN 2.0 swimlane diagrams representing As-Is and To-Be process workflows',
      'Root-cause analysis summary highlighting process waste and latency points',
      'Product Backlog containing 5 prioritized Agile user stories formatted in Gherkin (Given-When-Then)'
    ],
    rubricCriteria: [
      { criterion: 'Strict adherence to BPMN 2.0 visual and logical conventions', weightPercentage: 40 },
      { criterion: 'Actionable, testable user story acceptance criteria', weightPercentage: 35 },
      { criterion: 'Thoroughness of business stakeholder alignment considerations', weightPercentage: 25 }
    ]
  },
  {
    id: 'proj-fullstack-01',
    roleSlug: 'cloud-fullstack-engineer',
    title: 'Full-Stack Enterprise Inventory Service with TypeScript & React',
    difficulty: 'ADVANCED',
    estimatedEffortHours: 18,
    targetSkills: ['Full-Stack JavaScript/TypeScript Architecture', 'Relational Database Querying (SQL)', 'REST APIs & OData Protocol'],
    description:
      'Develop a complete, typed inventory tracking application with an Express/Node.js backend, PostgreSQL database, and React frontend. Implement CRUD operations, pagination, search filters, and Zod input validation schemas.',
    deliverables: [
      'GitHub repository link or source code package with clean monorepo architecture',
      'Database migration scripts with indexed relational tables',
      'Automated integration test suite verifying API contract safety'
    ],
    rubricCriteria: [
      { criterion: 'Code quality, modular separation, and strict TypeScript compliance', weightPercentage: 40 },
      { criterion: 'Database design normalization and query optimization', weightPercentage: 30 },
      { criterion: 'Frontend component usability and state management hygiene', weightPercentage: 30 }
    ]
  },
  {
    id: 'proj-devops-01',
    roleSlug: 'devops-cloud-engineer',
    title: 'Containerized Microservices CI/CD Pipeline & Health Monitoring',
    difficulty: 'ADVANCED',
    estimatedEffortHours: 15,
    targetSkills: ['Docker & Containerization', 'CI/CD Pipelines & DevOps', 'Microservices & Enterprise Integration'],
    description:
      'Containerize a multi-tier web application using optimized Dockerfiles. Create a GitHub Actions workflow that executes linting, runs unit and integration tests, builds minimal container images, and implements automated health checks.',
    deliverables: [
      'Multi-stage Dockerfile adhering to container security best practices',
      'GitHub Actions CI/CD workflow YAML configuration',
      'Container orchestration compose manifest with environment variable isolation'
    ],
    rubricCriteria: [
      { criterion: 'Image minimization and multi-stage build optimization', weightPercentage: 40 },
      { criterion: 'CI/CD test automation gate coverage and reliability', weightPercentage: 35 },
      { criterion: 'Security hardening (non-root container execution)', weightPercentage: 25 }
    ]
  },
  {
    id: 'proj-qa-01',
    roleSlug: 'qa-automation-engineer',
    title: 'End-to-End Automated Test Framework for Enterprise Checkout',
    difficulty: 'INTERMEDIATE',
    estimatedEffortHours: 12,
    targetSkills: ['Automated Testing (Unit & Integration)', 'Version Control (Git & GitHub)', 'TypeScript'],
    description:
      'Develop an automated regression testing suite covering critical user journeys. Implement page object models, synthetic data fixtures, negative test scenarios, and automated HTML test reports.',
    deliverables: [
      'Test automation framework codebase with Page Object Model pattern',
      'Test suite with at least 10 assertions covering happy paths and edge cases',
      'Execution report documenting execution timing and assertion metrics'
    ],
    rubricCriteria: [
      { criterion: 'Test architecture maintainability and Page Object abstraction', weightPercentage: 40 },
      { criterion: 'Edge-case assertion robustness and absence of flakiness', weightPercentage: 35 },
      { criterion: 'Clear test reporting and artifact generation', weightPercentage: 25 }
    ]
  }
];

export function getProjectById(id: string): PracticalProjectDefinition | undefined {
  return PRACTICAL_PROJECTS_CATALOGUE.find((p) => p.id === id);
}

export function getProjectsForRole(roleSlug: string): PracticalProjectDefinition[] {
  return PRACTICAL_PROJECTS_CATALOGUE.filter((p) => p.roleSlug === roleSlug);
}
