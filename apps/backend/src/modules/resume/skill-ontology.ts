import { SkillCategory } from '@career-orchestrator/shared';

export interface OntologySkillDefinition {
  code: string;
  name: string;
  category: SkillCategory;
  isTransferable: boolean;
  aliases: string[];
  inferredFrom?: string[]; // If these words exist, we can contextually infer this competency
}

export const SKILL_ONTOLOGY: OntologySkillDefinition[] = [
  // 1. Programming Languages
  {
    code: 'LANG-TS',
    name: 'TypeScript',
    category: 'SOFTWARE_DEV',
    isTransferable: true,
    aliases: ['TypeScript', 'TS']
  },
  {
    code: 'LANG-JS',
    name: 'JavaScript',
    category: 'SOFTWARE_DEV',
    isTransferable: true,
    aliases: ['JavaScript', 'JS', 'ECMAScript', 'ES6', 'ESNext']
  },
  {
    code: 'LANG-PYTHON',
    name: 'Python',
    category: 'SOFTWARE_DEV',
    isTransferable: true,
    aliases: ['Python', 'Python3', 'PySpark']
  },
  {
    code: 'LANG-JAVA',
    name: 'Java',
    category: 'SOFTWARE_DEV',
    isTransferable: true,
    aliases: ['Java', 'Core Java', 'J2EE', 'Jakarta EE']
  },
  {
    code: 'LANG-CSHARP',
    name: 'C# / .NET',
    category: 'SOFTWARE_DEV',
    isTransferable: true,
    aliases: ['C#', 'CSharp', '.NET', '.NET Core', 'ASP.NET']
  },
  {
    code: 'LANG-ABAP',
    name: 'SAP ABAP',
    category: 'SAP_TECHNICAL',
    isTransferable: false,
    aliases: ['ABAP', 'ABAP Cloud', 'ABAP OO', 'ABAP Objects', 'Advanced Business Application Programming']
  },
  {
    code: 'LANG-SQL',
    name: 'Relational Database Querying (SQL)',
    category: 'SOFTWARE_DEV',
    isTransferable: true,
    aliases: ['SQL', 'Structured Query Language', 'T-SQL', 'PL/SQL', 'ANSI SQL']
  },

  // 2. Frontend Development
  {
    code: 'FRONT-REACT',
    name: 'React.js',
    category: 'SOFTWARE_DEV',
    isTransferable: true,
    aliases: ['React', 'React.js', 'ReactJS', 'React Native']
  },
  {
    code: 'FRONT-ANGULAR',
    name: 'Angular',
    category: 'SOFTWARE_DEV',
    isTransferable: true,
    aliases: ['Angular', 'AngularJS', 'Angular 2+']
  },
  {
    code: 'FRONT-WEB-STD',
    name: 'HTML5 & CSS3 Web Standards',
    category: 'SOFTWARE_DEV',
    isTransferable: true,
    aliases: ['HTML', 'HTML5', 'CSS', 'CSS3', 'Tailwind CSS', 'SASS', 'SCSS']
  },

  // 3. Backend Development
  {
    code: 'BACK-NODE',
    name: 'Node.js & Express',
    category: 'SOFTWARE_DEV',
    isTransferable: true,
    aliases: ['Node.js', 'NodeJS', 'Express', 'Express.js', 'NestJS', 'Fastify']
  },
  {
    code: 'BACK-REST-API',
    name: 'RESTful API Architecture & OData',
    category: 'SOFTWARE_DEV',
    isTransferable: true,
    aliases: ['REST', 'RESTful', 'REST API', 'RESTful APIs', 'OData', 'OpenAPI', 'Swagger', 'GraphQL']
  },
  {
    code: 'BACK-MICROSERVICES',
    name: 'Microservices & Enterprise Integration',
    category: 'SOFTWARE_DEV',
    isTransferable: true,
    aliases: ['Microservices', 'Event-Driven Architecture', 'Kafka', 'RabbitMQ', 'Enterprise Integration']
  },

  // 4. Databases
  {
    code: 'DB-POSTGRES',
    name: 'PostgreSQL',
    category: 'SOFTWARE_DEV',
    isTransferable: true,
    aliases: ['PostgreSQL', 'Postgres', 'pgSQL']
  },
  {
    code: 'DB-MYSQL',
    name: 'MySQL & MariaDB',
    category: 'SOFTWARE_DEV',
    isTransferable: true,
    aliases: ['MySQL', 'MariaDB']
  },
  {
    code: 'DB-ORACLE',
    name: 'Oracle Database',
    category: 'SOFTWARE_DEV',
    isTransferable: true,
    aliases: ['Oracle DB', 'Oracle Database', 'Oracle 19c', 'Oracle 12c', 'PL/SQL']
  },
  {
    code: 'DB-SAP-HANA',
    name: 'SAP HANA In-Memory Database',
    category: 'SAP_TECHNICAL',
    isTransferable: false,
    aliases: ['SAP HANA', 'HANA Cloud', 'HANA Database', 'HANA DB', 'Core Data Services', 'CDS Views']
  },

  // 5. Cloud & Enterprise Platforms
  {
    code: 'CLOUD-AWS',
    name: 'Amazon Web Services (AWS)',
    category: 'SOFTWARE_DEV',
    isTransferable: true,
    aliases: ['AWS', 'Amazon Web Services', 'EC2', 'S3', 'AWS Lambda']
  },
  {
    code: 'CLOUD-AZURE',
    name: 'Microsoft Azure',
    category: 'SOFTWARE_DEV',
    isTransferable: true,
    aliases: ['Azure', 'Microsoft Azure', 'Azure DevOps', 'Azure Functions']
  },
  {
    code: 'CLOUD-DOCKER',
    name: 'Docker & Containerization',
    category: 'SOFTWARE_DEV',
    isTransferable: true,
    aliases: ['Docker', 'Containers', 'Containerization', 'Kubernetes', 'K8s']
  },
  {
    code: 'SAP-BTP',
    name: 'SAP Business Technology Platform (BTP)',
    category: 'SAP_TECHNICAL',
    isTransferable: false,
    aliases: ['SAP BTP', 'SAP Cloud Platform', 'BTP Integration Suite', 'Cloud Foundry BTP']
  },
  {
    code: 'SAP-S4HANA',
    name: 'SAP S/4HANA Enterprise Management',
    category: 'SAP_FUNCTIONAL',
    isTransferable: false,
    aliases: ['SAP S/4HANA', 'S/4HANA', 'S4HANA', 'SAP S4', 'S/4HANA Cloud', 'S/4HANA On-Premise', 'SAP ECC']
  },
  {
    code: 'SAP-FIORI',
    name: 'SAP Fiori & User Experience',
    category: 'SAP_FUNCTIONAL',
    isTransferable: false,
    aliases: ['SAP Fiori', 'Fiori Elements', 'Fiori Launchpad', 'SAPUI5', 'UI5']
  },

  // 6. Data Analytics & Business Intelligence
  {
    code: 'DATA-EXCEL-ADV',
    name: 'Advanced Financial Modeling (Excel / Pivot)',
    category: 'DATA_ANALYTICS',
    isTransferable: true,
    aliases: ['Excel', 'Microsoft Excel', 'VBA', 'Pivot Tables', 'VLOOKUP', 'XLOOKUP', 'Power Query']
  },
  {
    code: 'DATA-POWERBI',
    name: 'Power BI & Tableau Data Visualization',
    category: 'DATA_ANALYTICS',
    isTransferable: true,
    aliases: ['Power BI', 'PowerBI', 'Tableau', 'Looker', 'Qlik']
  },
  {
    code: 'DATA-SAC',
    name: 'SAP Analytics Cloud (SAC)',
    category: 'DATA_ANALYTICS',
    isTransferable: false,
    aliases: ['SAP Analytics Cloud', 'SAC', 'SAC Planning', 'SAC Stories']
  },

  // 7. Business & Domain Functional
  {
    code: 'BIZ-GL-ACC',
    name: 'General Ledger Accounting',
    category: 'DOMAIN_BUSINESS',
    isTransferable: true,
    aliases: ['General Ledger', 'GL Accounting', 'Journal Entries', 'Chart of Accounts', 'Month-End Close', 'Reconciliation', 'Balance Sheet']
  },
  {
    code: 'BIZ-FIN-REPORT',
    name: 'Financial Reporting & IFRS',
    category: 'DOMAIN_BUSINESS',
    isTransferable: true,
    aliases: ['Financial Reporting', 'IFRS', 'GAAP', 'US GAAP', 'Financial Statements', 'P&L', 'Profit and Loss', 'Statutory Reporting']
  },
  {
    code: 'BIZ-PROCURE',
    name: 'Procurement & Supply Chain Operations',
    category: 'DOMAIN_BUSINESS',
    isTransferable: true,
    aliases: ['Procurement', 'Purchasing', 'Purchase Orders', 'Supply Chain', 'Inventory Management', 'Procure-to-Pay', 'P2P', 'Vendor Management']
  },
  {
    code: 'BIZ-PROCESS-MAP',
    name: 'Business Process Mapping & Optimization',
    category: 'TRANSFERABLE_SOFT',
    isTransferable: true,
    aliases: ['Business Process', 'Process Mapping', 'BPMN', 'Standard Operating Procedures', 'SOP', 'Workflow Optimization', 'As-Is To-Be']
  },

  // 8. Project Management & Methodologies
  {
    code: 'METHOD-AGILE',
    name: 'Agile & Scrum Methodologies',
    category: 'TRANSFERABLE_SOFT',
    isTransferable: true,
    aliases: ['Agile', 'Scrum', 'Sprint Planning', 'Kanban', 'User Stories', 'Backlog Grooming']
  },
  {
    code: 'METHOD-ACTIVATE',
    name: 'SAP Activate Methodology',
    category: 'TRANSFERABLE_SOFT',
    isTransferable: false,
    aliases: ['SAP Activate', 'Fit-to-Standard', 'Activate Methodology', 'Best Practices Package']
  },

  // 9. Testing & Software Engineering Tools
  {
    code: 'TOOL-GIT',
    name: 'Version Control (Git & GitHub)',
    category: 'SOFTWARE_DEV',
    isTransferable: true,
    aliases: ['Git', 'GitHub', 'GitLab', 'Bitbucket', 'Version Control']
  },
  {
    code: 'TOOL-TESTING',
    name: 'Automated Testing (Unit & Integration)',
    category: 'SOFTWARE_DEV',
    isTransferable: true,
    aliases: ['Jest', 'Vitest', 'Mocha', 'Cypress', 'Playwright', 'Selenium', 'Unit Testing', 'Automated Testing', 'Test-Driven Development', 'TDD']
  },
  {
    code: 'TOOL-CI-CD',
    name: 'CI/CD Pipelines & DevOps',
    category: 'SOFTWARE_DEV',
    isTransferable: true,
    aliases: ['CI/CD', 'Continuous Integration', 'Jenkins', 'GitHub Actions', 'GitLab CI']
  }
];
