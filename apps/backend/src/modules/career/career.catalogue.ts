import { CareerRole } from '@career-orchestrator/shared';

export const CAREER_CATALOGUE: CareerRole[] = [
  // 1. SAP S/4HANA Finance Functional Consultant
  {
    id: 'role-sap-s4-fi',
    slug: 'sap-s4hana-finance-consultant',
    title: 'SAP S/4HANA Finance Functional Consultant',
    track: 'SAP_FUNCTIONAL_CONSULTANT',
    careerFamily: 'FUNCTIONAL_CONSULTING',
    ecosystem: 'SAP',
    summary:
      'Design, customize, and deploy Universal Journal, General Ledger, Accounts Payable, Accounts Receivable, and Asset Accounting processes on SAP S/4HANA Cloud and On-Premise systems.',
    marketDemand: 'Critical',
    planningHoursEstimate: 80,
    typicalPivotTimeline: '8–12 weeks',
    tags: ['S/4HANA', 'Finance', 'Fiori', 'Consulting', 'Universal Journal'],
    catalogueSource: 'SAP S/4HANA Finance Consultant Certification Guide (C_TS4FI) & Learning Journeys',
    lastVerifiedDate: '2026-10-29',
    prerequisites: [
      'Foundational understanding of General Ledger accounting and financial double-entry bookkeeping',
      'Familiarity with financial reporting cycles (month-end close, balance sheet, P&L)'
    ],
    requiredSkills: [
      {
        skillId: 'req-fi-01',
        skillName: 'General Ledger Accounting',
        category: 'DOMAIN_BUSINESS',
        minimumLevel: 'ADVANCED',
        weight: 1.0,
        isMandatory: true,
        rationale: 'Core domain prerequisite needed to validate account postings and financial reporting.'
      },
      {
        skillId: 'req-fi-02',
        skillName: 'S/4HANA Finance Customizing (IMG)',
        category: 'SAP_FUNCTIONAL',
        minimumLevel: 'INTERMEDIATE',
        weight: 1.0,
        isMandatory: true,
        rationale: 'Mandatory technical skill for configuring chart of accounts, company codes, and posting variants.'
      },
      {
        skillId: 'req-fi-03',
        skillName: 'SAP Fiori Financial Apps',
        category: 'SAP_FUNCTIONAL',
        minimumLevel: 'INTERMEDIATE',
        weight: 0.8,
        isMandatory: true,
        rationale: 'Required modern user interface for transaction processing and analytical storyboards in S/4HANA.'
      },
      {
        skillId: 'req-fi-04',
        skillName: 'Financial Reporting & IFRS',
        category: 'DOMAIN_BUSINESS',
        minimumLevel: 'INTERMEDIATE',
        weight: 0.8,
        isMandatory: true,
        rationale: 'Essential for configuring balance sheet versions and statutory compliance reporting.'
      }
    ],
    preferredSkills: [
      {
        skillId: 'pref-fi-01',
        skillName: 'Business Process Mapping',
        category: 'TRANSFERABLE_SOFT',
        minimumLevel: 'INTERMEDIATE',
        weight: 0.6,
        isMandatory: false,
        rationale: 'Helpful for facilitating Fit-to-Standard workshops and documenting To-Be business workflows.'
      },
      {
        skillId: 'pref-fi-02',
        skillName: 'SAP Activate Methodology',
        category: 'TRANSFERABLE_SOFT',
        minimumLevel: 'NOVICE',
        weight: 0.5,
        isMandatory: false,
        rationale: 'Standard project methodology for Agile SAP implementations.'
      }
    ],
    suggestedLearningResourceIds: ['learn-s4f01', 'learn-s4f02', 'learn-ux100', 'learn-act100'],
    suggestedProjectIds: ['proj-fi-01', 'proj-fi-02']
  },

  // 2. SAP S/4HANA Sourcing & Procurement Consultant (MM)
  {
    id: 'role-sap-s4-mm',
    slug: 'sap-s4hana-sourcing-procurement',
    title: 'SAP S/4HANA Sourcing & Procurement Consultant (MM)',
    track: 'SAP_FUNCTIONAL_CONSULTANT',
    careerFamily: 'FUNCTIONAL_CONSULTING',
    ecosystem: 'SAP',
    summary:
      'Configure end-to-end procure-to-pay lifecycles, material master data, inventory management, automatic account assignment (OBYC), and purchasing workflows.',
    marketDemand: 'High',
    planningHoursEstimate: 85,
    typicalPivotTimeline: '10–14 weeks',
    tags: ['Materials Management', 'Procurement', 'Inventory', 'Logistics', 'MM'],
    catalogueSource: 'SAP S/4HANA Sourcing and Procurement Certification (C_TS452) Standard Curriculum',
    lastVerifiedDate: '2026-10-29',
    prerequisites: ['Basic understanding of corporate purchasing and inventory operations'],
    requiredSkills: [
      {
        skillId: 'req-mm-01',
        skillName: 'Procurement & Purchasing Workflows',
        category: 'DOMAIN_BUSINESS',
        minimumLevel: 'INTERMEDIATE',
        weight: 1.0,
        isMandatory: true,
        rationale: 'Foundational operational domain required to map requisition, PO, and receipt processes.'
      },
      {
        skillId: 'req-mm-02',
        skillName: 'S/4HANA Materials Management Customizing',
        category: 'SAP_FUNCTIONAL',
        minimumLevel: 'INTERMEDIATE',
        weight: 1.0,
        isMandatory: true,
        rationale: 'Core configuration skill for plant parameters, storage locations, and purchasing org structures.'
      },
      {
        skillId: 'req-mm-03',
        skillName: 'General Ledger Accounting',
        category: 'DOMAIN_BUSINESS',
        minimumLevel: 'NOVICE',
        weight: 0.7,
        isMandatory: true,
        rationale: 'Necessary to configure MM-FI integration and automatic inventory account determination.'
      }
    ],
    preferredSkills: [
      {
        skillId: 'pref-mm-01',
        skillName: 'Cross-Functional Stakeholder Alignment',
        category: 'TRANSFERABLE_SOFT',
        minimumLevel: 'INTERMEDIATE',
        weight: 0.6,
        isMandatory: false,
        rationale: 'Essential for managing vendor relationships and operations alignment.'
      },
      {
        skillId: 'pref-mm-02',
        skillName: 'Business Process Mapping',
        category: 'TRANSFERABLE_SOFT',
        minimumLevel: 'INTERMEDIATE',
        weight: 0.5,
        isMandatory: false,
        rationale: 'Supports supply chain bottleneck identification and workflow re-engineering.'
      }
    ],
    suggestedLearningResourceIds: ['learn-ts450', 'learn-ux100', 'learn-act100'],
    suggestedProjectIds: ['proj-mm-01']
  },

  // 3. SAP S/4HANA Sales & Distribution Consultant (SD)
  {
    id: 'role-sap-s4-sd',
    slug: 'sap-s4hana-sales-distribution',
    title: 'SAP S/4HANA Sales & Distribution Consultant (SD)',
    track: 'SAP_FUNCTIONAL_CONSULTANT',
    careerFamily: 'FUNCTIONAL_CONSULTING',
    ecosystem: 'SAP',
    summary:
      'Architect order-to-cash operational pipelines, customer master data, pricing procedures (Condition Technique), shipping, billing, and sales document type customization in S/4HANA.',
    marketDemand: 'High',
    planningHoursEstimate: 80,
    typicalPivotTimeline: '8–12 weeks',
    tags: ['Sales', 'Distribution', 'Order to Cash', 'Pricing', 'SD'],
    catalogueSource: 'SAP S/4HANA Sales Consultant Certification (C_TS462) Curriculum',
    lastVerifiedDate: '2026-10-29',
    prerequisites: ['Understanding of commercial sales operations, customer invoicing, and logistics handoffs'],
    requiredSkills: [
      {
        skillId: 'req-sd-01',
        skillName: 'Order-to-Cash & Sales Operations',
        category: 'DOMAIN_BUSINESS',
        minimumLevel: 'INTERMEDIATE',
        weight: 1.0,
        isMandatory: true,
        rationale: 'Underpins sales quotes, contracts, deliveries, and customer billing schedules.'
      },
      {
        skillId: 'req-sd-02',
        skillName: 'SAP S/4HANA Enterprise Management',
        category: 'SAP_FUNCTIONAL',
        minimumLevel: 'INTERMEDIATE',
        weight: 1.0,
        isMandatory: true,
        rationale: 'Required to configure sales organizations, distribution channels, and divisions.'
      },
      {
        skillId: 'req-sd-03',
        skillName: 'General Ledger Accounting',
        category: 'DOMAIN_BUSINESS',
        minimumLevel: 'NOVICE',
        weight: 0.7,
        isMandatory: true,
        rationale: 'Required for revenue recognition and SD-FI billing integration.'
      }
    ],
    preferredSkills: [
      {
        skillId: 'pref-sd-01',
        skillName: 'SAP Fiori Financial Apps',
        category: 'SAP_FUNCTIONAL',
        minimumLevel: 'NOVICE',
        weight: 0.6,
        isMandatory: false,
        rationale: 'Provides modern Fiori Sales Order fulfillment monitor capabilities.'
      },
      {
        skillId: 'pref-sd-02',
        skillName: 'Business Process Mapping',
        category: 'TRANSFERABLE_SOFT',
        minimumLevel: 'INTERMEDIATE',
        weight: 0.5,
        isMandatory: false,
        rationale: 'Aids customer journey optimization and delivery route planning.'
      }
    ],
    suggestedLearningResourceIds: ['learn-ux100', 'learn-act100'],
    suggestedProjectIds: ['proj-ba-01']
  },

  // 4. SAP ABAP Cloud & Clean Core Developer
  {
    id: 'role-sap-abap-cloud',
    slug: 'sap-abap-cloud-developer',
    title: 'SAP ABAP Cloud & Clean Core Developer',
    track: 'SAP_TECHNICAL_DEVELOPER',
    careerFamily: 'TECHNICAL_DEVELOPMENT',
    ecosystem: 'SAP',
    summary:
      'Engineer modern enterprise extensions using ABAP Cloud, Core Data Services (CDS) view entities, and the ABAP RESTful Application Programming model (RAP) aligned with SAP Clean Core architecture.',
    marketDemand: 'High',
    planningHoursEstimate: 100,
    typicalPivotTimeline: '12–16 weeks',
    tags: ['ABAP Cloud', 'RAP', 'CDS Views', 'BTP', 'Clean Core'],
    catalogueSource: 'SAP Certified Associate — Back-End Developer — ABAP Cloud (C_ABAPD)',
    lastVerifiedDate: '2026-10-29',
    prerequisites: ['Basic object-oriented programming fundamentals', 'Relational database querying (SQL)'],
    requiredSkills: [
      {
        skillId: 'req-abap-01',
        skillName: 'ABAP RESTful Application Programming (RAP)',
        category: 'SAP_TECHNICAL',
        minimumLevel: 'INTERMEDIATE',
        weight: 1.0,
        isMandatory: true,
        rationale: 'The official programming model for building transactional cloud applications on SAP S/4HANA.'
      },
      {
        skillId: 'req-abap-02',
        skillName: 'Core Data Services (CDS) Views',
        category: 'SAP_TECHNICAL',
        minimumLevel: 'INTERMEDIATE',
        weight: 1.0,
        isMandatory: true,
        rationale: 'The data modeling layer defining semantic entities, associations, and projections.'
      },
      {
        skillId: 'req-abap-03',
        skillName: 'Relational Database Querying (SQL)',
        category: 'SOFTWARE_DEV',
        minimumLevel: 'ADVANCED',
        weight: 0.9,
        isMandatory: true,
        rationale: 'Essential foundation for writing high-performance database access and CDS query logic.'
      },
      {
        skillId: 'req-abap-04',
        skillName: 'REST APIs & OData Protocol',
        category: 'SOFTWARE_DEV',
        minimumLevel: 'INTERMEDIATE',
        weight: 0.8,
        isMandatory: true,
        rationale: 'Standard protocol for publishing business service bindings to SAP Fiori Elements.'
      }
    ],
    preferredSkills: [
      {
        skillId: 'pref-abap-01',
        skillName: 'Version Control (Git & GitHub)',
        category: 'SOFTWARE_DEV',
        minimumLevel: 'INTERMEDIATE',
        weight: 0.6,
        isMandatory: false,
        rationale: 'Required for abapGit distributed version control workflows.'
      },
      {
        skillId: 'pref-abap-02',
        skillName: 'Automated Testing (Unit & Integration)',
        category: 'SOFTWARE_DEV',
        minimumLevel: 'NOVICE',
        weight: 0.5,
        isMandatory: false,
        rationale: 'Enables ABAP Unit test-driven development and behavioral test doubles.'
      }
    ],
    suggestedLearningResourceIds: ['learn-rap100', 'learn-cld900', 'learn-sql-found'],
    suggestedProjectIds: ['proj-abap-01']
  },

  // 5. SAP BTP Cloud Application Developer (CAP)
  {
    id: 'role-sap-btp-dev',
    slug: 'sap-btp-application-developer',
    title: 'SAP BTP Cloud Application Developer (CAP & Node.js)',
    track: 'SAP_TECHNICAL_DEVELOPER',
    careerFamily: 'TECHNICAL_DEVELOPMENT',
    ecosystem: 'SAP',
    summary:
      'Build side-by-side cloud extensions, microservices, and multi-tenant SaaS solutions on SAP Business Technology Platform using the SAP Cloud Application Programming model (CAP) and Node.js/TypeScript.',
    marketDemand: 'Critical',
    planningHoursEstimate: 95,
    typicalPivotTimeline: '10–14 weeks',
    tags: ['SAP CAP', 'Node.js', 'TypeScript', 'BTP', 'HANA Cloud'],
    catalogueSource: 'SAP Certified Development Associate — SAP BTP & CAP Developer Guides',
    lastVerifiedDate: '2026-10-29',
    prerequisites: ['Proficiency with JavaScript or TypeScript', 'Basic understanding of HTTP and REST APIs'],
    requiredSkills: [
      {
        skillId: 'req-cap-01',
        skillName: 'Full-Stack JavaScript/TypeScript Architecture',
        category: 'SOFTWARE_DEV',
        minimumLevel: 'ADVANCED',
        weight: 1.0,
        isMandatory: true,
        rationale: 'The core implementation language for the SAP Cloud Application Programming model runtime.'
      },
      {
        skillId: 'req-cap-02',
        skillName: 'SAP Integration Suite / Cloud Foundry',
        category: 'SAP_TECHNICAL',
        minimumLevel: 'INTERMEDIATE',
        weight: 1.0,
        isMandatory: true,
        rationale: 'The runtime environment hosting microservices, destinations, and XSUAA security tokens.'
      },
      {
        skillId: 'req-cap-03',
        skillName: 'REST APIs & OData Protocol',
        category: 'SOFTWARE_DEV',
        minimumLevel: 'ADVANCED',
        weight: 0.9,
        isMandatory: true,
        rationale: 'Core protocol used by CAP services for data exposure and external service consumption.'
      },
      {
        skillId: 'req-cap-04',
        skillName: 'Relational Database Querying (SQL)',
        category: 'SOFTWARE_DEV',
        minimumLevel: 'INTERMEDIATE',
        weight: 0.8,
        isMandatory: true,
        rationale: 'Essential for defining CDS schema entities and managing SAP HANA Cloud tables.'
      }
    ],
    preferredSkills: [
      {
        skillId: 'pref-cap-01',
        skillName: 'Docker & Containerization',
        category: 'SOFTWARE_DEV',
        minimumLevel: 'NOVICE',
        weight: 0.6,
        isMandatory: false,
        rationale: 'Helpful for deploying CAP workloads onto SAP BTP Kyma (Kubernetes) environments.'
      },
      {
        skillId: 'pref-cap-02',
        skillName: 'CI/CD Pipelines & DevOps',
        category: 'SOFTWARE_DEV',
        minimumLevel: 'NOVICE',
        weight: 0.5,
        isMandatory: false,
        rationale: 'Enables continuous delivery using SAP Continuous Integration and Delivery (CI/CD).'
      }
    ],
    suggestedLearningResourceIds: ['learn-cap100', 'learn-cld900', 'learn-fullstack-node', 'learn-sql-found'],
    suggestedProjectIds: ['proj-fullstack-01']
  },

  // 6. SAP Integration Suite Specialist
  {
    id: 'role-sap-integration',
    slug: 'sap-integration-suite-architect',
    title: 'SAP Integration Suite Specialist',
    track: 'SAP_INTEGRATION_ARCHITECT',
    careerFamily: 'INTEGRATION_ARCHITECTURE',
    ecosystem: 'SAP',
    summary:
      'Design hybrid multi-cloud integration flows (iFlows), API management policies, event-driven architectures (Event Mesh), and B2B connectivity connecting SAP with third-party enterprise platforms.',
    marketDemand: 'Critical',
    planningHoursEstimate: 90,
    typicalPivotTimeline: '10–14 weeks',
    tags: ['Integration Suite', 'iFlows', 'APIs', 'Event Mesh', 'BTP'],
    catalogueSource: 'SAP Certified Development Associate — SAP Integration Suite (C_CPI)',
    lastVerifiedDate: '2026-10-29',
    prerequisites: ['Understanding of network protocols, REST APIs, JSON/XML data formats, and SSL/TLS security'],
    requiredSkills: [
      {
        skillId: 'req-int-01',
        skillName: 'REST APIs & OData Protocol',
        category: 'SOFTWARE_DEV',
        minimumLevel: 'ADVANCED',
        weight: 1.0,
        isMandatory: true,
        rationale: 'Core integration standard for connecting heterogeneous enterprise cloud services.'
      },
      {
        skillId: 'req-int-02',
        skillName: 'SAP Cloud Integration Flow Modeling',
        category: 'SAP_TECHNICAL',
        minimumLevel: 'INTERMEDIATE',
        weight: 1.0,
        isMandatory: true,
        rationale: 'Primary hands-on competency for building message pipelines, splitters, and routers.'
      },
      {
        skillId: 'req-int-03',
        skillName: 'SAP Integration Suite / Cloud Foundry',
        category: 'SAP_TECHNICAL',
        minimumLevel: 'INTERMEDIATE',
        weight: 0.9,
        isMandatory: true,
        rationale: 'Infrastructure tenant environment for deploying and monitoring production integration artifacts.'
      }
    ],
    preferredSkills: [
      {
        skillId: 'pref-int-01',
        skillName: 'Microservices & Enterprise Integration',
        category: 'SOFTWARE_DEV',
        minimumLevel: 'INTERMEDIATE',
        weight: 0.7,
        isMandatory: false,
        rationale: 'Helpful for architecting decoupled asynchronous messaging and circuit breaker patterns.'
      },
      {
        skillId: 'pref-int-02',
        skillName: 'Relational Database Querying (SQL)',
        category: 'SOFTWARE_DEV',
        minimumLevel: 'NOVICE',
        weight: 0.5,
        isMandatory: false,
        rationale: 'Useful when staging JDBC adapter connections to enterprise relational databases.'
      }
    ],
    suggestedLearningResourceIds: ['learn-cld100', 'learn-cld900'],
    suggestedProjectIds: ['proj-int-01']
  },

  // 7. SAP Analytics Cloud (SAC) Consultant
  {
    id: 'role-sap-sac',
    slug: 'sap-analytics-cloud-consultant',
    title: 'SAP Analytics Cloud (SAC) Planning & BI Consultant',
    track: 'ENTERPRISE_ANALYST',
    careerFamily: 'DATA_ANALYTICS',
    ecosystem: 'SAP',
    summary:
      'Author interactive executive dashboards, augmented smart discovery stories, and integrated financial planning models utilizing SAP Analytics Cloud connected to SAP Datasphere and S/4HANA.',
    marketDemand: 'High',
    planningHoursEstimate: 70,
    typicalPivotTimeline: '6–10 weeks',
    tags: ['SAC', 'Business Intelligence', 'Planning', 'Predictive Analytics', 'Dashboards'],
    catalogueSource: 'SAP Certified Application Associate — SAP Analytics Cloud (C_SAC)',
    lastVerifiedDate: '2026-10-29',
    prerequisites: ['Prior experience in spreadsheet financial modeling, KPI calculation, or business reporting'],
    requiredSkills: [
      {
        skillId: 'req-sac-01',
        skillName: 'Advanced Financial Modeling (Excel / Pivot)',
        category: 'DATA_ANALYTICS',
        minimumLevel: 'ADVANCED',
        weight: 1.0,
        isMandatory: true,
        rationale: 'Foundational analytical skillset directly transferable to SAC dimension and measure modeling.'
      },
      {
        skillId: 'req-sac-02',
        skillName: 'SAC Story Design & Visual Analytics',
        category: 'DATA_ANALYTICS',
        minimumLevel: 'INTERMEDIATE',
        weight: 1.0,
        isMandatory: true,
        rationale: 'Core operational capability for designing executive responsive dashboards and variance charts.'
      },
      {
        skillId: 'req-sac-03',
        skillName: 'Financial Reporting & IFRS',
        category: 'DOMAIN_BUSINESS',
        minimumLevel: 'INTERMEDIATE',
        weight: 0.8,
        isMandatory: true,
        rationale: 'Critical domain knowledge for authoring balance sheet, cash flow, and P&L financial stories.'
      }
    ],
    preferredSkills: [
      {
        skillId: 'pref-sac-01',
        skillName: 'Relational Database Querying (SQL)',
        category: 'SOFTWARE_DEV',
        minimumLevel: 'INTERMEDIATE',
        weight: 0.6,
        isMandatory: false,
        rationale: 'Valuable for building SQL data models in underlying SAP Datasphere spaces.'
      },
      {
        skillId: 'pref-sac-02',
        skillName: 'Business Process Mapping',
        category: 'TRANSFERABLE_SOFT',
        minimumLevel: 'NOVICE',
        weight: 0.5,
        isMandatory: false,
        rationale: 'Aids understanding of managerial cost center structures and budget approval workflows.'
      }
    ],
    suggestedLearningResourceIds: ['learn-sac01', 'learn-s4f01'],
    suggestedProjectIds: ['proj-sac-01']
  },

  // 8. Enterprise ERP Business Systems Analyst
  {
    id: 'role-erp-ba',
    slug: 'enterprise-business-analyst',
    title: 'Enterprise ERP Business Systems Analyst',
    track: 'ENTERPRISE_ANALYST',
    careerFamily: 'ENTERPRISE_ANALYSIS',
    ecosystem: 'HYBRID',
    summary:
      'Serve as the strategic translator between business operations and technical engineering teams. Capture functional requirements, map As-Is and To-Be processes, and steer ERP user acceptance testing.',
    marketDemand: 'High',
    planningHoursEstimate: 50,
    typicalPivotTimeline: '4–8 weeks',
    tags: ['Requirements', 'BPMN', 'Agile', 'User Stories', 'Hybrid'],
    catalogueSource: 'IIBA BABOK Guide & Enterprise Systems Engineering Standards',
    lastVerifiedDate: '2026-10-29',
    prerequisites: ['Strong written and verbal stakeholder communication skills', 'Business domain awareness'],
    requiredSkills: [
      {
        skillId: 'req-ba-01',
        skillName: 'Business Process Mapping',
        category: 'TRANSFERABLE_SOFT',
        minimumLevel: 'ADVANCED',
        weight: 1.0,
        isMandatory: true,
        rationale: 'Essential for diagramming swimlanes, identifying friction points, and modeling future state.'
      },
      {
        skillId: 'req-ba-02',
        skillName: 'Cross-Functional Stakeholder Alignment',
        category: 'TRANSFERABLE_SOFT',
        minimumLevel: 'ADVANCED',
        weight: 1.0,
        isMandatory: true,
        rationale: 'Critical for running alignment sessions across IT, Finance, and Executive management.'
      },
      {
        skillId: 'req-ba-03',
        skillName: 'Agile & Scrum Methodologies',
        category: 'TRANSFERABLE_SOFT',
        minimumLevel: 'INTERMEDIATE',
        weight: 0.8,
        isMandatory: true,
        rationale: 'Standard framework for authoring user stories and participating in sprint ceremonies.'
      }
    ],
    preferredSkills: [
      {
        skillId: 'pref-ba-01',
        skillName: 'General Ledger Accounting',
        category: 'DOMAIN_BUSINESS',
        minimumLevel: 'INTERMEDIATE',
        weight: 0.7,
        isMandatory: false,
        rationale: 'Provides valuable literacy during financial ERP business requirements elicitation.'
      },
      {
        skillId: 'pref-ba-02',
        skillName: 'Relational Database Querying (SQL)',
        category: 'SOFTWARE_DEV',
        minimumLevel: 'NOVICE',
        weight: 0.6,
        isMandatory: false,
        rationale: 'Allows independent data exploration to validate discrepancy reports.'
      }
    ],
    suggestedLearningResourceIds: ['learn-bpmn-analysis', 'learn-act100'],
    suggestedProjectIds: ['proj-ba-01']
  },

  // 9. Business Intelligence & SQL Data Analyst
  {
    id: 'role-sql-analyst',
    slug: 'bi-sql-data-analyst',
    title: 'Business Intelligence & SQL Data Analyst',
    track: 'ENTERPRISE_ANALYST',
    careerFamily: 'DATA_ANALYTICS',
    ecosystem: 'HYBRID',
    summary:
      'Extract, transform, and analyze relational data across enterprise data warehouses. Build executive analytical dashboards, automated SQL validation scripts, and business performance KPIs.',
    marketDemand: 'High',
    planningHoursEstimate: 60,
    typicalPivotTimeline: '6–10 weeks',
    tags: ['SQL', 'Data Analytics', 'BI', 'Reporting', 'PostgreSQL'],
    catalogueSource: 'Enterprise Data Analytics & SQL Modeling Competency Standards',
    lastVerifiedDate: '2026-10-29',
    prerequisites: ['Familiarity with spreadsheets, statistical aggregations, and business metrics'],
    requiredSkills: [
      {
        skillId: 'req-da-01',
        skillName: 'Relational Database Querying (SQL)',
        category: 'SOFTWARE_DEV',
        minimumLevel: 'ADVANCED',
        weight: 1.0,
        isMandatory: true,
        rationale: 'The non-negotiable language required to query, aggregate, and audit transactional tables.'
      },
      {
        skillId: 'req-da-02',
        skillName: 'Advanced Financial Modeling (Excel / Pivot)',
        category: 'DATA_ANALYTICS',
        minimumLevel: 'ADVANCED',
        weight: 0.9,
        isMandatory: true,
        rationale: 'Core skill for rapid prototyping, pivot table variance testing, and executive summaries.'
      },
      {
        skillId: 'req-da-03',
        skillName: 'PostgreSQL',
        category: 'SOFTWARE_DEV',
        minimumLevel: 'INTERMEDIATE',
        weight: 0.8,
        isMandatory: true,
        rationale: 'Representative modern enterprise relational database engine for analytical queries.'
      }
    ],
    preferredSkills: [
      {
        skillId: 'pref-da-01',
        skillName: 'Financial Reporting & IFRS',
        category: 'DOMAIN_BUSINESS',
        minimumLevel: 'INTERMEDIATE',
        weight: 0.7,
        isMandatory: false,
        rationale: 'Enables high-context financial analytics without requiring extensive domain guidance.'
      },
      {
        skillId: 'pref-da-02',
        skillName: 'Version Control (Git & GitHub)',
        category: 'SOFTWARE_DEV',
        minimumLevel: 'NOVICE',
        weight: 0.5,
        isMandatory: false,
        rationale: 'Supports collaborative version management of analytical SQL transformation scripts.'
      }
    ],
    suggestedLearningResourceIds: ['learn-sql-found', 'learn-sac01'],
    suggestedProjectIds: ['proj-sac-01']
  },

  // 10. Cloud Full-Stack Enterprise Developer
  {
    id: 'role-cloud-fullstack',
    slug: 'cloud-fullstack-engineer',
    title: 'Cloud Full-Stack Enterprise Developer',
    track: 'HYBRID_CROSS_ERP',
    careerFamily: 'TECHNICAL_DEVELOPMENT',
    ecosystem: 'NON_SAP',
    summary:
      'Design, build, and maintain production web applications, microservices, and database layers utilizing TypeScript, React, Node.js, Express, and PostgreSQL.',
    marketDemand: 'Critical',
    planningHoursEstimate: 120,
    typicalPivotTimeline: '14–18 weeks',
    tags: ['TypeScript', 'React', 'Node.js', 'PostgreSQL', 'Fullstack'],
    catalogueSource: 'Full-Stack Software Engineering Curricula & Modern Cloud Architectures',
    lastVerifiedDate: '2026-10-29',
    prerequisites: ['Basic HTML/CSS understanding', 'Basic programming logic in any modern language'],
    requiredSkills: [
      {
        skillId: 'req-fs-01',
        skillName: 'Full-Stack JavaScript/TypeScript Architecture',
        category: 'SOFTWARE_DEV',
        minimumLevel: 'ADVANCED',
        weight: 1.0,
        isMandatory: true,
        rationale: 'Primary language for type-safe frontend UI and backend service construction.'
      },
      {
        skillId: 'req-fs-02',
        skillName: 'Relational Database Querying (SQL)',
        category: 'SOFTWARE_DEV',
        minimumLevel: 'ADVANCED',
        weight: 1.0,
        isMandatory: true,
        rationale: 'Essential for designing normalized database schemas, migrations, and transactional queries.'
      },
      {
        skillId: 'req-fs-03',
        skillName: 'REST APIs & OData Protocol',
        category: 'SOFTWARE_DEV',
        minimumLevel: 'ADVANCED',
        weight: 0.9,
        isMandatory: true,
        rationale: 'Underlying communication contract connecting browser frontends with backend API services.'
      },
      {
        skillId: 'req-fs-04',
        skillName: 'PostgreSQL',
        category: 'SOFTWARE_DEV',
        minimumLevel: 'INTERMEDIATE',
        weight: 0.8,
        isMandatory: true,
        rationale: 'Primary relational data tier for storage, indexing, and constraint enforcement.'
      }
    ],
    preferredSkills: [
      {
        skillId: 'pref-fs-01',
        skillName: 'Docker & Containerization',
        category: 'SOFTWARE_DEV',
        minimumLevel: 'INTERMEDIATE',
        weight: 0.7,
        isMandatory: false,
        rationale: 'Crucial for reproducible development environments and containerized cloud deployment.'
      },
      {
        skillId: 'pref-fs-02',
        skillName: 'Automated Testing (Unit & Integration)',
        category: 'SOFTWARE_DEV',
        minimumLevel: 'INTERMEDIATE',
        weight: 0.7,
        isMandatory: false,
        rationale: 'Protects critical business functionality from unintended regressions across sprints.'
      }
    ],
    suggestedLearningResourceIds: ['learn-fullstack-node', 'learn-sql-found', 'learn-devops-docker'],
    suggestedProjectIds: ['proj-fullstack-01']
  },

  // 11. DevOps & Cloud Platform Infrastructure Engineer
  {
    id: 'role-devops-cloud',
    slug: 'devops-cloud-engineer',
    title: 'DevOps & Cloud Platform Infrastructure Engineer',
    track: 'HYBRID_CROSS_ERP',
    careerFamily: 'CLOUD_PLATFORM',
    ecosystem: 'NON_SAP',
    summary:
      'Automate infrastructure provisioning, containerization (Docker, Kubernetes), continuous integration/deployment (CI/CD pipelines), and cloud environment observability.',
    marketDemand: 'Critical',
    planningHoursEstimate: 110,
    typicalPivotTimeline: '12–16 weeks',
    tags: ['DevOps', 'Docker', 'CI/CD', 'Cloud', 'Infrastructure'],
    catalogueSource: 'Cloud Native Computing Foundation (CNCF) & DevOps Engineering Roadmap',
    lastVerifiedDate: '2026-10-29',
    prerequisites: ['Basic command-line familiarity', 'Fundamentals of networking and operating systems'],
    requiredSkills: [
      {
        skillId: 'req-ops-01',
        skillName: 'Docker & Containerization',
        category: 'SOFTWARE_DEV',
        minimumLevel: 'ADVANCED',
        weight: 1.0,
        isMandatory: true,
        rationale: 'Standard abstraction for packaging microservices and immutable container deployments.'
      },
      {
        skillId: 'req-ops-02',
        skillName: 'CI/CD Pipelines & DevOps',
        category: 'SOFTWARE_DEV',
        minimumLevel: 'ADVANCED',
        weight: 1.0,
        isMandatory: true,
        rationale: 'Automates testing, artifact bundling, and staging deployments without manual overhead.'
      },
      {
        skillId: 'req-ops-03',
        skillName: 'Version Control (Git & GitHub)',
        category: 'SOFTWARE_DEV',
        minimumLevel: 'ADVANCED',
        weight: 0.9,
        isMandatory: true,
        rationale: 'Foundation for GitOps infrastructure-as-code workflows and branch governance.'
      }
    ],
    preferredSkills: [
      {
        skillId: 'pref-ops-01',
        skillName: 'Microservices & Enterprise Integration',
        category: 'SOFTWARE_DEV',
        minimumLevel: 'INTERMEDIATE',
        weight: 0.7,
        isMandatory: false,
        rationale: 'Assists in designing distributed network ingress, service meshes, and health probes.'
      },
      {
        skillId: 'pref-ops-02',
        skillName: 'Relational Database Querying (SQL)',
        category: 'SOFTWARE_DEV',
        minimumLevel: 'NOVICE',
        weight: 0.5,
        isMandatory: false,
        rationale: 'Useful for diagnosing database backup scripts and containerized connection pools.'
      }
    ],
    suggestedLearningResourceIds: ['learn-devops-docker', 'learn-fullstack-node'],
    suggestedProjectIds: ['proj-devops-01']
  },

  // 12. QA & Automated Test Engineer
  {
    id: 'role-qa-auto',
    slug: 'qa-automation-engineer',
    title: 'QA & Automated Test Engineer',
    track: 'HYBRID_CROSS_ERP',
    careerFamily: 'QA_TESTING',
    ecosystem: 'NON_SAP',
    summary:
      'Design, script, and maintain end-to-end regression suites, API contract tests, and unit testing frameworks to guarantee enterprise software stability and security compliance.',
    marketDemand: 'Moderate',
    planningHoursEstimate: 75,
    typicalPivotTimeline: '8–12 weeks',
    tags: ['QA', 'Automation', 'Testing', 'Jest', 'Playwright'],
    catalogueSource: 'ISTQB Certified Tester Foundation & Modern Test Automation Frameworks',
    lastVerifiedDate: '2026-10-29',
    prerequisites: ['Attention to detail', 'Familiarity with web application workflows'],
    requiredSkills: [
      {
        skillId: 'req-qa-01',
        skillName: 'Automated Testing (Unit & Integration)',
        category: 'SOFTWARE_DEV',
        minimumLevel: 'ADVANCED',
        weight: 1.0,
        isMandatory: true,
        rationale: 'The core discipline required to construct test runners, assertions, and mock doubles.'
      },
      {
        skillId: 'req-qa-02',
        skillName: 'REST APIs & OData Protocol',
        category: 'SOFTWARE_DEV',
        minimumLevel: 'INTERMEDIATE',
        weight: 0.9,
        isMandatory: true,
        rationale: 'Required for authoring automated API boundary tests and payload validation suites.'
      },
      {
        skillId: 'req-qa-03',
        skillName: 'Version Control (Git & GitHub)',
        category: 'SOFTWARE_DEV',
        minimumLevel: 'INTERMEDIATE',
        weight: 0.8,
        isMandatory: true,
        rationale: 'Enables embedding automated test suites into pull request continuous integration gates.'
      }
    ],
    preferredSkills: [
      {
        skillId: 'pref-qa-01',
        skillName: 'Agile & Scrum Methodologies',
        category: 'TRANSFERABLE_SOFT',
        minimumLevel: 'INTERMEDIATE',
        weight: 0.7,
        isMandatory: false,
        rationale: 'Supports sprint test planning and defect triage in Agile cross-functional squads.'
      },
      {
        skillId: 'pref-qa-02',
        skillName: 'Full-Stack JavaScript/TypeScript Architecture',
        category: 'SOFTWARE_DEV',
        minimumLevel: 'NOVICE',
        weight: 0.6,
        isMandatory: false,
        rationale: 'Assists with reading application code to identify untestable edge conditions.'
      }
    ],
    suggestedLearningResourceIds: ['learn-qa-automation', 'learn-fullstack-node'],
    suggestedProjectIds: ['proj-qa-01']
  },

  // 13. Enterprise IT Systems Administrator
  {
    id: 'role-sysadmin',
    slug: 'enterprise-systems-admin',
    title: 'Enterprise IT Systems Administrator',
    track: 'HYBRID_CROSS_ERP',
    careerFamily: 'CLOUD_PLATFORM',
    ecosystem: 'HYBRID',
    summary:
      'Manage corporate identity directory services, server infrastructure, backup redundancy, network security credentials, and enterprise software rollouts.',
    marketDemand: 'Moderate',
    planningHoursEstimate: 70,
    typicalPivotTimeline: '8–12 weeks',
    tags: ['SysAdmin', 'Infrastructure', 'Active Directory', 'Security', 'Hybrid'],
    catalogueSource: 'Enterprise IT Infrastructure & Systems Administration Competency Standards',
    lastVerifiedDate: '2026-10-29',
    prerequisites: ['Fundamental networking and operating system administration knowledge'],
    requiredSkills: [
      {
        skillId: 'req-sa-01',
        skillName: 'Cross-Functional Stakeholder Alignment',
        category: 'TRANSFERABLE_SOFT',
        minimumLevel: 'INTERMEDIATE',
        weight: 0.9,
        isMandatory: true,
        rationale: 'Key for coordinating planned maintenance outages with enterprise division heads.'
      },
      {
        skillId: 'req-sa-02',
        skillName: 'Version Control (Git & GitHub)',
        category: 'SOFTWARE_DEV',
        minimumLevel: 'NOVICE',
        weight: 0.7,
        isMandatory: true,
        rationale: 'Required for managing configuration scripts and infrastructure automation repos.'
      },
      {
        skillId: 'req-sa-03',
        skillName: 'Business Process Mapping',
        category: 'TRANSFERABLE_SOFT',
        minimumLevel: 'NOVICE',
        weight: 0.7,
        isMandatory: true,
        rationale: 'Aids in documenting disaster recovery plans and IT service management runbooks.'
      }
    ],
    preferredSkills: [
      {
        skillId: 'pref-sa-01',
        skillName: 'Docker & Containerization',
        category: 'SOFTWARE_DEV',
        minimumLevel: 'NOVICE',
        weight: 0.6,
        isMandatory: false,
        rationale: 'Assists when hosting internal IT diagnostic tooling on lightweight containers.'
      },
      {
        skillId: 'pref-sa-02',
        skillName: 'Relational Database Querying (SQL)',
        category: 'SOFTWARE_DEV',
        minimumLevel: 'NOVICE',
        weight: 0.5,
        isMandatory: false,
        rationale: 'Useful for auditing IT user account tables and system access logs.'
      }
    ],
    suggestedLearningResourceIds: ['learn-devops-docker', 'learn-bpmn-analysis'],
    suggestedProjectIds: ['proj-devops-01']
  },

  // 14. Agile & SAP Activate Project Coordinator
  {
    id: 'role-proj-coord',
    slug: 'agile-project-coordinator',
    title: 'Agile & SAP Activate Project Coordinator',
    track: 'ENTERPRISE_ANALYST',
    careerFamily: 'PROJECT_MANAGEMENT',
    ecosystem: 'HYBRID',
    summary:
      'Facilitate sprint ceremonies, track milestone delivery, coordinate Fit-to-Standard workshops, and manage risk registers across large-scale enterprise transformation projects.',
    marketDemand: 'Moderate',
    planningHoursEstimate: 45,
    typicalPivotTimeline: '4–8 weeks',
    tags: ['Project Management', 'Agile', 'Scrum', 'SAP Activate', 'Coordination'],
    catalogueSource: 'PMI Agile Certified Practitioner & SAP Activate Implementation Standards',
    lastVerifiedDate: '2026-10-29',
    prerequisites: ['Organizational coordination skills and understanding of project schedules'],
    requiredSkills: [
      {
        skillId: 'req-pm-01',
        skillName: 'Agile & Scrum Methodologies',
        category: 'TRANSFERABLE_SOFT',
        minimumLevel: 'ADVANCED',
        weight: 1.0,
        isMandatory: true,
        rationale: 'The core execution framework for coordinating daily standups and sprint retrospectives.'
      },
      {
        skillId: 'req-pm-02',
        skillName: 'Cross-Functional Stakeholder Alignment',
        category: 'TRANSFERABLE_SOFT',
        minimumLevel: 'ADVANCED',
        weight: 1.0,
        isMandatory: true,
        rationale: 'Essential for aligning technical engineers, functional leads, and steering committees.'
      },
      {
        skillId: 'req-pm-03',
        skillName: 'Business Process Mapping',
        category: 'TRANSFERABLE_SOFT',
        minimumLevel: 'INTERMEDIATE',
        weight: 0.8,
        isMandatory: true,
        rationale: 'Helpful for tracking project deliverable workflows and dependency graphs.'
      }
    ],
    preferredSkills: [
      {
        skillId: 'pref-pm-01',
        skillName: 'SAP Activate Methodology',
        category: 'TRANSFERABLE_SOFT',
        minimumLevel: 'INTERMEDIATE',
        weight: 0.7,
        isMandatory: false,
        rationale: 'Provides specialized knowledge for SAP cloud roadmap phases and governance.'
      },
      {
        skillId: 'pref-pm-02',
        skillName: 'General Ledger Accounting',
        category: 'DOMAIN_BUSINESS',
        minimumLevel: 'NOVICE',
        weight: 0.5,
        isMandatory: false,
        rationale: 'Helpful context when coordinating financial systems migration milestones.'
      }
    ],
    suggestedLearningResourceIds: ['learn-act100', 'learn-bpmn-analysis'],
    suggestedProjectIds: ['proj-ba-01']
  }
];

export function getRoleByIdOrSlug(idOrSlug: string): CareerRole | undefined {
  return CAREER_CATALOGUE.find((r) => r.id === idOrSlug || r.slug === idOrSlug);
}

export function getAllCareerRoles(): CareerRole[] {
  return CAREER_CATALOGUE;
}
