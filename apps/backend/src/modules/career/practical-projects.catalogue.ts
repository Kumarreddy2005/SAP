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
    businessProblem:
      'A global retail manufacturer operates in the US and Germany. Financial consolidation is fragmented because legacy subsidiary systems use disparate chart of accounts, inconsistent fiscal year variants, and unaligned posting periods, resulting in multi-week consolidation delays.',
    objectives: [
      'Define an enterprise structure hierarchy with group Chart of Accounts and local operational Chart of Accounts',
      'Establish fiscal year variants (K4 vs V3) and posting period variants to control month-end postings',
      'Map Universal Journal (ACDOCA) leading and non-leading ledger configurations for dual-GAAP compliance'
    ],
    stepByStepInstructions: [
      '1. Review the multinational business scenario and subsidiary operational currencies (USD and EUR).',
      '2. Draft the enterprise hierarchy diagram connecting Client, Operating Concern, Controlling Area, and Company Codes.',
      '3. Formulate the Chart of Accounts structure specifying account number lengths, account groups (Assets, Liabilities, P&L), and retained earnings accounts.',
      '4. Define Field Status Variants and assign mandatory fields for expense account postings.',
      '5. Author the Functional Specification & Configuration Document (.pdf, markdown, or text runbook).'
    ],
    requiredTechnologies: ['SAP S/4HANA Finance (Customizing IMG)', 'Universal Journal Architecture', 'Excel / Visio / Draw.io'],
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
    businessProblem:
      'The financial accounting team spends 12 days closing books each month due to manual foreign exchange calculations, un-reconciled intercompany clearing accounts, and spreadsheet-based trial balance compilation.',
    objectives: [
      'Automate monthly closing tasks following SAP S/4HANA Financial Closing Cockpit principles',
      'Design balance sheet and profit & loss statutory statement versions under IFRS regulations',
      'Construct a SAP Fiori tile or analytical story delivering real-time variance visibility'
    ],
    stepByStepInstructions: [
      '1. Define the month-end closing task dependency checklist (sub-ledger closing -> GR/IR clearing -> FX revaluation -> GL close).',
      '2. Prepare test data journal vouchers with active document splitting by profit center and business segment.',
      '3. Formulate foreign currency valuation rules for open accounts payable and accounts receivable items.',
      '4. Execute variance reporting comparing actual spend against annualized budget targets.',
      '5. Document closing runbook and executive analytical storyboard deliverable.'
    ],
    requiredTechnologies: ['SAP Fiori Financial Apps', 'Financial Statement Version (FSV)', 'ACDOCA Universal Journal', 'IFRS'],
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
    businessProblem:
      'A legacy SAP ERP system has custom order management logic embedded in non-upgradable user exits. During S/4HANA Cloud transition, this logic must be re-architected into a clean-core, cloud-ready RESTful service.',
    objectives: [
      'Create CDS data definitions adhering to Clean Core extension standards',
      'Implement business object behavior definition (BDEF) with custom validation methods',
      'Publish an OData V4 service binding and test via SAP Fiori Elements preview'
    ],
    stepByStepInstructions: [
      '1. Open ABAP Development Tools (ADT) in Eclipse connected to SAP BTP ABAP Environment or local developer environment.',
      '2. Author a root CDS view entity `ZCE_CUSTOMER_ORDER` with appropriate data element annotations.',
      '3. Define a behavior definition with draft capability, validation on save, and authorization master.',
      '4. Code the ABAP behavior implementation class checking order credit limit thresholds.',
      '5. Expose service definition and test query operations using OData V4 client.'
    ],
    requiredTechnologies: ['ABAP Cloud', 'RESTful Application Programming (RAP)', 'Core Data Services (CDS)', 'ADT Eclipse'],
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
    businessProblem:
      'Purchasing transactions frequently fail at goods receipt or invoice receipt due to unassigned valuation classes and missing automatic G/L account determination in OBYC, halting plant production.',
    objectives: [
      'Establish plant and storage location enterprise assignments for inventory tracking',
      'Configure automatic account determination matrix linking valuation classes to G/L balance sheet accounts',
      'Validate 3-way matching rules (Purchase Order -> Goods Receipt -> Supplier Invoice)'
    ],
    stepByStepInstructions: [
      '1. Define Material Type parameters and Valuation Grouping Codes in IMG.',
      '2. Map transaction keys BSX (Inventory Posting) and WRX (GR/IR Clearing) to designated test G/L accounts.',
      '3. Create purchase requisition and convert into approved Purchase Order document.',
      '4. Execute simulated MIGO transaction verifying inventory valuation posting.',
      '5. Document account determination matrix and invoice verification runbook.'
    ],
    requiredTechnologies: ['SAP MM Customizing (IMG)', 'Automatic Account Determination (OBYC)', 'Procure-to-Pay'],
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
    roleSlug: 'sap-integration-suite-developer',
    title: 'Enterprise Integration Flow with OAuth 2.0 & Exception Subprocess',
    difficulty: 'ADVANCED',
    estimatedEffortHours: 16,
    targetSkills: ['SAP Cloud Integration Flow Modeling', 'REST APIs & OData Protocol', 'Enterprise Security & OAuth 2.0'],
    description:
      'Model an asynchronous integration flow (iFlow) in SAP Cloud Integration that ingests external JSON webhooks, transforms payloads using Groovy scripting, validates schema constraints, and routes transactions with error alerts via Exception Subprocess.',
    businessProblem:
      'E-commerce order transactions from a modern Shopify storefront must integrate securely into SAP S/4HANA. Network timeouts and malformed JSON payloads currently cause silent transaction losses without alerting.',
    objectives: [
      'Model an iFlow with HTTPS sender adapter secured via OAuth 2.0 client credentials',
      'Write a Groovy script to sanitize and transform JSON into target XML/OData format',
      'Implement an Exception Subprocess that catches exceptions, formats error payloads, and triggers alert notifications'
    ],
    stepByStepInstructions: [
      '1. Set up integration artifact in SAP Cloud Integration tenant or local mock.',
      '2. Configure HTTPS adapter endpoint with OAuth 2.0 policy.',
      '3. Add JSON-to-XML converter and Groovy mapping script handling null values.',
      '4. Configure Content Modifier and Exception Subprocess with error email or dead-letter queue adapter.',
      '5. Execute test requests with valid and corrupt payloads, documenting execution logs.'
    ],
    requiredTechnologies: ['SAP Cloud Integration (CPI)', 'Groovy Scripting', 'OAuth 2.0', 'OData & XML'],
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
    businessProblem:
      'C-suite executives receive monthly financial results in static 80-page slide decks, making it impossible to drill into regional cost center overruns or perform what-if revenue sensitivity simulations.',
    objectives: [
      'Model a multi-dimensional finance dataset with Account, Time, Version (Actual/Budget/Forecast), and Cost Center',
      'Design responsive SAC story following International Business Communication Standards (IBCS)',
      'Construct dynamic variance indicators and parameterized what-if forecast sliders'
    ],
    stepByStepInstructions: [
      '1. Connect to financial data model or clean spreadsheet dataset.',
      '2. Create Story canvas with responsive KPI summary header cards.',
      '3. Insert waterfall chart explaining Gross Margin to Operating Income bridge.',
      '4. Add chart filters for Region and Product Line.',
      '5. Document calculated dimension formulas and visual styling decisions.'
    ],
    requiredTechnologies: ['SAP Analytics Cloud (SAC)', 'IBCS Standards', 'Financial Modeling', 'Data Visualization'],
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
    businessProblem:
      'Customer order fulfillment takes an average of 14 days because credit hold releases, inventory allocations, and shipping notices rely on manual emails between Sales, Credit, and Warehouse teams.',
    objectives: [
      'Diagram current As-Is business process in standard BPMN 2.0 swimlane format',
      'Identify process waste, delays, and single points of failure across department handoffs',
      'Formulate modernized To-Be future state process and author backlog of INVEST-compliant user stories'
    ],
    stepByStepInstructions: [
      '1. Review interview notes from sales reps, credit managers, and warehouse supervisors.',
      '2. Draft the As-Is swimlane diagram identifying bottlenecks and manual touchpoints.',
      '3. Map To-Be process leveraging automated S/4HANA credit checks and automatic order release.',
      '4. Write 5 user stories in Gherkin syntax (Given-When-Then) with clear testable acceptance criteria.',
      '5. Compile business case and process change impact matrix.'
    ],
    requiredTechnologies: ['BPMN 2.0 (Camunda / Draw.io / Signavio)', 'Jira / Agile Backlog Management', 'Gherkin Syntax'],
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
    roleSlug: 'cloud-fullstack-developer',
    title: 'Full-Stack Enterprise Inventory Service with TypeScript & React',
    difficulty: 'ADVANCED',
    estimatedEffortHours: 18,
    targetSkills: ['Full-Stack JavaScript/TypeScript Architecture', 'Relational Database Querying (SQL)', 'REST APIs & OData Protocol'],
    description:
      'Develop a complete, typed inventory tracking application with an Express/Node.js backend, PostgreSQL database, and React frontend. Implement CRUD operations, pagination, search filters, and Zod input validation schemas.',
    businessProblem:
      'Warehouse staff cannot track real-time stock levels across regional depots because legacy inventory software lacks modern REST APIs and a mobile-responsive browser interface.',
    objectives: [
      'Architect a modular Node.js/Express service with typed request/response contracts',
      'Design relational schema with foreign key constraints, indexes, and audit timestamps',
      'Build a responsive React UI supporting instantaneous search and optimistic updates'
    ],
    stepByStepInstructions: [
      '1. Scaffold monorepo with shared types, Express backend, and Vite React frontend.',
      '2. Write database migrations establishing Item, Warehouse, and StockTransaction tables.',
      '3. Implement REST API endpoints with Zod schema validation and parameterized SQL queries.',
      '4. Build React user interface featuring data tables, status badges, and transaction modal.',
      '5. Author automated integration tests asserting HTTP contract safety.'
    ],
    requiredTechnologies: ['TypeScript', 'Node.js & Express', 'React + Vite', 'PostgreSQL / SQL', 'Zod'],
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
    roleSlug: 'devops-cloud-platform-engineer',
    title: 'Containerized Microservices CI/CD Pipeline & Health Monitoring',
    difficulty: 'ADVANCED',
    estimatedEffortHours: 15,
    targetSkills: ['Docker & Containerization', 'CI/CD Pipelines & DevOps', 'Microservices & Enterprise Integration'],
    description:
      'Containerize a multi-tier web application using optimized Dockerfiles. Create a GitHub Actions workflow that executes linting, runs unit and integration tests, builds minimal container images, and implements automated health checks.',
    businessProblem:
      'Deployments to cloud staging environments are manual, take 3 hours per release, and frequently fail due to dependency mismatches between developer laptops and host Linux servers.',
    objectives: [
      'Construct a multi-stage Dockerfile producing minimal, non-root Alpine container images',
      'Automate continuous integration in GitHub Actions with test gates and coverage thresholds',
      'Implement container healthcheck probes and docker-compose deployment orchestrations'
    ],
    stepByStepInstructions: [
      '1. Write multi-stage Dockerfile separating build dependencies from runtime assets.',
      '2. Configure non-root user and minimal attack surface in container specifications.',
      '3. Author GitHub Actions YAML workflow triggering on pull requests.',
      '4. Create docker-compose.yml configuration orchestrating API and database with health checks.',
      '5. Validate automated build times and security vulnerability scans.'
    ],
    requiredTechnologies: ['Docker & Docker Compose', 'GitHub Actions CI/CD', 'Linux Shell Scripting', 'Health Probes'],
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
    roleSlug: 'qa-automation-systems-engineer',
    title: 'End-to-End Automated Test Framework for Enterprise Checkout',
    difficulty: 'INTERMEDIATE',
    estimatedEffortHours: 12,
    targetSkills: ['Automated Testing (Unit & Integration)', 'Version Control (Git & GitHub)', 'TypeScript'],
    description:
      'Develop an automated regression testing suite covering critical user journeys. Implement page object models, synthetic data fixtures, negative test scenarios, and automated HTML test reports.',
    businessProblem:
      'Each software release requires 40 hours of manual QA click-testing across browsers. Regressions in checkout payment calculations slip into production due to human oversight.',
    objectives: [
      'Build a maintainable end-to-end testing framework using modern test automation tools',
      'Implement Page Object Model (POM) pattern for clean separation of locator and assertions',
      'Cover critical business scenarios including coupon validation, cart checkout, and error states'
    ],
    stepByStepInstructions: [
      '1. Initialize TypeScript test framework project with Playwright or Vitest/Testing-Library.',
      '2. Create Page Objects encapsulating navigation, button interactions, and field inputs.',
      '3. Write end-to-end test cases asserting happy paths, edge cases, and network failure responses.',
      '4. Configure automated test fixtures and synthetic test database state resets.',
      '5. Generate automated HTML test reports with execution traces and screenshots.'
    ],
    requiredTechnologies: ['TypeScript', 'Playwright / Test Automation', 'Page Object Model', 'CI Reporting'],
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
