import { VerifiedLearningResource } from '@career-orchestrator/shared';

export const VERIFIED_LEARNING_RESOURCES: VerifiedLearningResource[] = [
  {
    id: 'learn-s4f01',
    code: 'S4F01',
    title: 'Financial Accounting in SAP S/4HANA — Business Processes',
    provider: 'SAP Learning Hub (Student Edition)',
    targetSkill: 'S/4HANA Finance Customizing (IMG)',
    estimatedHours: 40,
    externalUrl: 'https://learning.sap.com/learning-journeys/outlining-the-financial-accounting-processes-in-sap-s-4hana',
    isVerified: true,
    verificationDate: '2026-10-29',
    verificationSource: 'Official SAP Learning Journey — Outlining Financial Accounting Processes in SAP S/4HANA',
    level: 'Foundational',
    syllabusPoints: [
      'Universal Journal architecture and ACDOCA table single-source-of-truth structure',
      'Organizational units: Chart of Accounts, Company Code, Fiscal Year Variant, and Posting Period Variant',
      'Posting general ledger transactions, document types, and document splitting rules',
      'Financial closing operations, foreign currency valuation, and balance sheet extraction'
    ]
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
    verificationDate: '2026-10-29',
    verificationSource: 'Official SAP Learning Journey — Configuring Financial Accounting in SAP S/4HANA',
    level: 'Advanced',
    syllabusPoints: [
      'Implementation Guide (IMG) customizing for General Ledger, Accounts Payable, and Accounts Receivable',
      'Currencies architecture: Local currency, Group currency, and freely defined currencies',
      'Tax configuration, withholding tax codes, and financial statement versions (FSV)',
      'Integration touchpoints with Materials Management (MM) and Sales & Distribution (SD)'
    ]
  },
  {
    id: 'learn-ux100',
    code: 'UX100',
    title: 'Discovering SAP Fiori — Launchpad Navigation & Financial Applications',
    provider: 'SAP Learning Hub (Student Edition)',
    targetSkill: 'SAP Fiori Financial Apps',
    estimatedHours: 18,
    externalUrl: 'https://learning.sap.com/learning-journeys/discover-sap-fiori',
    isVerified: true,
    verificationDate: '2026-10-29',
    verificationSource: 'Official SAP Learning Journey — Discover SAP Fiori',
    level: 'Intermediate',
    syllabusPoints: [
      'SAP Fiori design principles: Role-based, adaptive, coherent, simple, and delightful',
      'Navigating Fiori Launchpad spaces, pages, transactional apps, and analytical tiles',
      'Managing user authorization catalogs, business roles, and personalizing workspace views'
    ]
  },
  {
    id: 'learn-act100',
    code: 'ACT100',
    title: 'SAP Activate Methodology for Cloud Deployments',
    provider: 'openSAP',
    targetSkill: 'SAP Activate Methodology',
    estimatedHours: 12,
    externalUrl: 'https://learning.sap.com/learning-journeys/explore-sap-activate',
    isVerified: true,
    verificationDate: '2026-10-29',
    verificationSource: 'Official SAP Learning Journey — Explore SAP Activate',
    level: 'Foundational',
    syllabusPoints: [
      'The six phases of SAP Activate: Discover, Prepare, Explore, Realize, Deploy, and Run',
      'Conducting Fit-to-Standard workshops using SAP Best Practices and Cloud ALM',
      'Agile sprints, user story refinement, delta backlog management, and cutover execution'
    ]
  },
  {
    id: 'learn-rap100',
    code: 'RAP100',
    title: 'Acquire Core ABAP Skills & Building Modern Extensions with ABAP RAP',
    provider: 'openSAP',
    targetSkill: 'ABAP RESTful Application Programming (RAP)',
    estimatedHours: 24,
    externalUrl: 'https://learning.sap.com/learning-journeys/acquire-core-abap-skills',
    isVerified: true,
    verificationDate: '2026-10-29',
    verificationSource: 'Official SAP Learning Journey — Acquire Core ABAP Skills & ABAP RAP',
    level: 'Intermediate',
    syllabusPoints: [
      'Core Data Services (CDS) view entity modeling, associations, and projections',
      'ABAP RESTful Application Programming model (RAP): Managed vs unmanaged business objects',
      'Behavior definition (BDEF), behavior implementation classes, and business logic execution',
      'Exposing and consuming OData V4 services for SAP Fiori Elements'
    ]
  },
  {
    id: 'learn-cld900',
    code: 'CLD900',
    title: 'Discovering SAP Business Technology Platform (BTP)',
    provider: 'SAP Learning Hub (Student Edition)',
    targetSkill: 'SAP Integration Suite / Cloud Foundry',
    estimatedHours: 20,
    externalUrl: 'https://learning.sap.com/learning-journeys/discovering-sap-business-technology-platform',
    isVerified: true,
    verificationDate: '2026-10-29',
    verificationSource: 'Official SAP Learning Journey — Discovering SAP BTP',
    level: 'Foundational',
    syllabusPoints: [
      'SAP BTP account model: Global accounts, subaccounts, spaces, and service entitlements',
      'Multi-cloud runtime environments: Cloud Foundry and Kyma (Kubernetes)',
      'Security architecture: SAP Cloud Identity Services, custom IdPs, and Role Collections',
      'Clean Core extensibility strategies: On-stack vs side-by-side extensions'
    ]
  },
  {
    id: 'learn-ts450',
    code: 'TS450',
    title: 'Sourcing and Procurement in SAP S/4HANA — Business Processes',
    provider: 'SAP Learning Hub (Student Edition)',
    targetSkill: 'S/4HANA Materials Management Customizing',
    estimatedHours: 35,
    externalUrl: 'https://learning.sap.com/learning-journeys/sourcing-and-procurement-in-sap-s-4hana',
    isVerified: true,
    verificationDate: '2026-10-29',
    verificationSource: 'Official SAP Learning Journey — Sourcing and Procurement in SAP S/4HANA',
    level: 'Intermediate',
    syllabusPoints: [
      'Procure-to-pay workflow: Purchase requisition, RFQ, purchase order, goods receipt, and invoice verification',
      'Material master data, vendor/business partner configuration, and purchasing info records',
      'Valuation and account determination: Automatic posting to General Ledger via OBYC customizing',
      'Inventory management: Movement types, physical inventory adjustments, and stock transfers'
    ]
  },
  {
    id: 'learn-cld100',
    code: 'CLD100',
    title: 'Developing Enterprise Integrations with SAP Integration Suite',
    provider: 'SAP Learning Hub (Student Edition)',
    targetSkill: 'SAP Cloud Integration Flow Modeling',
    estimatedHours: 28,
    externalUrl: 'https://learning.sap.com/learning-journeys/developing-with-sap-integration-suite',
    isVerified: true,
    verificationDate: '2026-10-29',
    verificationSource: 'Official SAP Learning Journey — Developing with SAP Integration Suite',
    level: 'Intermediate',
    syllabusPoints: [
      'Modeling message integration flows (iFlows) with message routers, splitters, and aggregators',
      'Data mapping techniques: Message Mapping, Groovy scripts, and XSLT transformations',
      'Security protocols: Certificate authentication, OAuth 2.0 credentials, and keystore management',
      'SAP Integration Advisor and pre-packaged integration content from SAP Business Accelerator Hub'
    ]
  },
  {
    id: 'learn-sac01',
    code: 'SAC01',
    title: 'Designing Interactive Dashboards & Stories in SAP Analytics Cloud',
    provider: 'SAP Learning Hub (Student Edition)',
    targetSkill: 'SAC Story Design & Visual Analytics',
    estimatedHours: 22,
    externalUrl: 'https://learning.sap.com/learning-journeys/exploring-sap-analytics-cloud',
    isVerified: true,
    verificationDate: '2026-10-29',
    verificationSource: 'Official SAP Learning Journey — Exploring SAP Analytics Cloud',
    level: 'Intermediate',
    syllabusPoints: [
      'Live data connections vs acquired data models from SAP S/4HANA and SAP Datasphere',
      'Designing executive responsive story layouts, charts, tables, and variance watermarks',
      'Augmented analytics: Smart Insights, Smart Discovery, and natural language search',
      'Financial planning models: Value driver trees, allocation rules, and version management'
    ]
  },
  {
    id: 'learn-cap100',
    code: 'CAP100',
    title: 'Building Cloud-Native Apps with SAP Cloud Application Programming (CAP)',
    provider: 'SAP Learning Hub (Student Edition)',
    targetSkill: 'SAP BTP Cloud Application Development (CAP)',
    estimatedHours: 30,
    externalUrl: 'https://learning.sap.com/learning-journeys/building-applications-with-sap-cloud-application-programming-model',
    isVerified: true,
    verificationDate: '2026-10-29',
    verificationSource: 'Official SAP Learning Journey — Building Apps with SAP CAP',
    level: 'Advanced',
    syllabusPoints: [
      'Core Data Services (CDS) domain data modeling and service definitions',
      'Implementing custom event handlers and business logic in Node.js / TypeScript',
      'Integrating with SAP HANA Cloud database and multitenancy setups',
      'Deploying to SAP BTP Cloud Foundry with MTA (Multi-Target Application) tooling'
    ]
  },
  // Verified Non-SAP Open Courseware
  {
    id: 'learn-sql-found',
    code: 'PGSQL-TUT',
    title: 'Relational Database Design & Advanced SQL Querying',
    provider: 'Verified Open Courseware',
    targetSkill: 'Relational Database Querying (SQL)',
    estimatedHours: 25,
    externalUrl: 'https://www.postgresql.org/docs/current/tutorial.html',
    isVerified: true,
    verificationDate: '2026-10-29',
    verificationSource: 'PostgreSQL Official Documentation Tutorial & Query Guide',
    level: 'Foundational',
    syllabusPoints: [
      'Relational algebra, schema design, primary and foreign key integrity constraints',
      'Complex multi-table joins, subqueries, and Common Table Expressions (CTEs)',
      'Window functions (ROW_NUMBER, RANK, LAG/LEAD) for financial auditing',
      'Index optimization (B-Tree, GIN) and EXPLAIN query plan analysis'
    ]
  },
  {
    id: 'learn-fullstack-node',
    code: 'NODE-ENTERPRISE',
    title: 'Enterprise Backend Engineering with Node.js, Express & TypeScript',
    provider: 'Verified Open Courseware',
    targetSkill: 'Full-Stack JavaScript/TypeScript Architecture',
    estimatedHours: 30,
    externalUrl: 'https://nodejs.org/docs/latest/api/',
    isVerified: true,
    verificationDate: '2026-10-29',
    verificationSource: 'Node.js Official API Documentation & Guides',
    level: 'Intermediate',
    syllabusPoints: [
      'Asynchronous event loop mechanics, streams, and worker threads',
      'Layered modular REST API design with controllers, services, and repositories',
      'Runtime input validation with Zod schemas and type safety',
      'Authentication with JWT, password hashing, and secure middleware chaining'
    ]
  },
  {
    id: 'learn-bpmn-analysis',
    code: 'BPMN-ANALYSIS',
    title: 'Business Process Modeling, Requirement Engineering & User Stories',
    provider: 'Verified Open Courseware',
    targetSkill: 'Business Process Mapping',
    estimatedHours: 15,
    externalUrl: 'https://www.bpmn.org/',
    isVerified: true,
    verificationDate: '2026-10-29',
    verificationSource: 'Object Management Group (OMG) BPMN 2.0 Specification Guide',
    level: 'Foundational',
    syllabusPoints: [
      'BPMN 2.0 notation: Swimlanes, activity gateways, events, and message flows',
      'As-Is current state mapping vs To-Be future state ERP gap analysis',
      'Formulating actionable Agile user stories and acceptance criteria (Given-When-Then)',
      'Cross-functional stakeholder interview techniques and requirement sign-off runbooks'
    ]
  },
  {
    id: 'learn-devops-docker',
    code: 'DOCKER-FOUND',
    title: 'Containerization, Docker & Continuous Integration Pipelines',
    provider: 'Verified Open Courseware',
    targetSkill: 'Docker & Containerization',
    estimatedHours: 20,
    externalUrl: 'https://docs.docker.com/get-started/',
    isVerified: true,
    verificationDate: '2026-10-29',
    verificationSource: 'Docker Official Get Started Documentation',
    level: 'Foundational',
    syllabusPoints: [
      'Docker images, multi-stage Dockerfiles, and container resource limits',
      'Docker Compose orchestration for multi-container local microservices',
      'CI/CD pipeline automation with automated test gates and linting',
      'Container registry management and security vulnerability scanning'
    ]
  },
  {
    id: 'learn-qa-automation',
    code: 'QA-AUTO-FOUND',
    title: 'Automated Testing, Test-Driven Development & Quality Assurance',
    provider: 'Verified Open Courseware',
    targetSkill: 'Automated Testing (Unit & Integration)',
    estimatedHours: 20,
    externalUrl: 'https://playwright.dev/docs/intro',
    isVerified: true,
    verificationDate: '2026-10-29',
    verificationSource: 'Playwright Official Documentation & Automated Testing Guide',
    level: 'Intermediate',
    syllabusPoints: [
      'Test Pyramid principles: Unit testing, service integration testing, and end-to-end browser flows',
      'Writing maintainable test fixtures, synthetic test buffers, and mock repositories',
      'Asynchronous test assertions, test flakiness remediation, and regression suites',
      'Continuous quality reporting and test coverage benchmarking'
    ]
  }
];

export function getVerifiedResourceById(id: string): VerifiedLearningResource | undefined {
  return VERIFIED_LEARNING_RESOURCES.find((r) => r.id === id || r.code === id);
}

export function getVerifiedResourcesForSkill(skillName: string): VerifiedLearningResource[] {
  const norm = skillName.toLowerCase();
  return VERIFIED_LEARNING_RESOURCES.filter(
    (r) =>
      r.targetSkill.toLowerCase().includes(norm) ||
      norm.includes(r.targetSkill.toLowerCase()) ||
      r.syllabusPoints.some((p) => p.toLowerCase().includes(norm))
  );
}
