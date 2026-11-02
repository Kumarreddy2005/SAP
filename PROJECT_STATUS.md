# Career Orchestrator — Project Status Log

**Project:** Career Orchestrator (SAP Hackfest 2026)  
**Current Milestone:** Final Stabilisation & Hackathon Release Check  
**Overall Status:** **HACKATHON DEMO READY** (51/51 automated backend tests pass, full monorepo typecheck clean, frontend production build clean, 17-stage E2E workflow verified, 15 desktop & mobile screenshots verified)  
**Last Updated:** 2026-11-02 20:05:00 UTC+05:30  

---

## 1. Milestone Status Summary

- **Human-in-the-Loop Skill Calibration:** **PASS** (Zero silent invention of proficiency or experience; explicit candidate selection strictly required for confirmation; extraction confidence score preserved separately from proficiency; validation blocks uncalibrated submissions).
- **Project Assessment Integrity & Evaluator Disclosures:** **PASS** (Rubric weights exclusively enforced from project catalogue; criteria not in definition are rejected; self-assessment capped at `REVIEWED` status; simulated independent evaluator mode explicitly labeled with transparent non-authenticated disclosure).
- **Learning Progress & SAP Verification Truthfulness:** **PASS** (Milestone completions labeled as "Self-reported progress"; removed all claims that clicking external SAP links verifies course completion; evidence limitations disclosed).
- **Profile Workflow Validation & Demo Separation:** **PASS** (Unreviewed profiles strictly blocked from generating career matches, skill gaps, role comparisons, or personalized pathways; candidate profiles clearly segregated from demo baseline with visual UI badges).
- **Curated Career Catalogue (14 Roles):** **PASS** (Comprehensive catalogue spanning SAP functional, SAP technical development, integration architecture, data analytics, enterprise analysis, cloud platform, QA automation, and agile project management; verified requirements, weights, and prerequisites).
- **Deterministic Explainable Career Matching:** **PASS** (Transparent mathematical formula: $100 \times \frac{\sum (w_i \times f_i)}{\sum w_i}$; matches full 1.0, partial proficiency 0.4–0.75, unknown proficiency 0.5, missing 0.0; mandatory skills below required proficiency strictly prevent pivot eligibility).
- **Multi-Role Side-by-Side Comparison:** **PASS** (`POST /api/v1/careers/compare` evaluates 2 to 4 roles concurrently; extracts shared transferable skills; presents role-specific mandatory and preferred gap deltas; estimates bridge hours).
- **Detailed 6-Group Skill-Gap Analysis:** **PASS** (`GET /api/v1/careers/:slug/gaps/:profileId` breaks role requirements into: 1. Confirmed matches, 2. Partial matches, 3. Mandatory gaps, 4. Recommended gaps, 5. Unverified requirements, 6. External prerequisites; enriches each gap with verified learning resources and practical projects).
- **Personalized Learning Pathway Generation:** **PASS** (`POST /api/v1/learning-pathways` dynamically generates sequenced roadmap milestones; prioritizes foundational processes before configuring; excludes elementary coursework for already-confirmed skills; maps verified SAP Learning Journeys and open courseware).
- **Interactive Project Workspaces & Enterprise Scenarios:** **PASS** (10 enterprise practical projects with business problems, step-by-step instructions, and multi-criteria rubrics; full submission lifecycle `NOT_STARTED` $\to$ `IN_PROGRESS` $\to$ `SUBMITTED` $\to$ `NEEDS_REVISION` / `REVIEWED` / `COMPLETED`; alternative evidence submission for private repositories).
- **Multi-Dimensional Career Readiness Scorecards:** **PASS** (`GET /api/v1/readiness/:profileId/:roleId` computes explainable readiness index: $0.35 \times \text{Skill} + 0.35 \times \text{Mandatory} + 0.15 \times \text{Learning} + 0.15 \times \text{Projects}$; prominent mandatory gaps alert; progress counters; statutory non-hiring guarantee disclaimer).
- **Verified External Job Destinations:** **PASS** (`GET /api/v1/jobs/search-links/:roleId` generates authenticated, parameterized search URLs into official engines for SAP Official Careers `jobs.sap.com`, LinkedIn Jobs, and Indeed; Zero-Fabrication disclosure; external departure warning).
- **Automated Verification Suite:** **PASS** (51/51 backend unit/integration tests passing in 2.0s; 17-stage end-to-end integration test passing; 100% monorepo typecheck clean; 66 frontend modules compiled cleanly).
- **Visual Capture & Layout Audit:** **PASS** (Headless Chrome captured 1280x850 desktop and 375x812 mobile screenshots across all 10 platform views: `01-landing-page.png` through `10-job-destinations.png` plus 5 mobile viewport audits in `screenshots/` and brain artifact directory).

---

## 2. API Endpoints Created and Verified

| Method | Endpoint | Status | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/api/v1/health` | **200 OK** | System health, environment, timestamp. |
| `POST` | `/api/v1/resume/upload` | **200 OK** | Multipart upload (`file` field). Validates format and binary magic bytes, extracts text via Mozilla PDF.js or Mammoth, runs deterministic ontology matcher, returns `ResumeUploadResponse`. |
| `PUT` | `/api/v1/profile/:id/review` | **200 OK** | Submits human review (`ProfileReviewSubmissionSchema`). Segregates confirmed from rejected skills, persists updates, returns `ProfileReviewResponse`. |
| `GET` | `/api/v1/profile/:id` | **200 OK** | Retrieves stored candidate profile by ID. Returns 404 if profile does not exist or server was restarted. |
| `GET` | `/api/v1/careers` | **200 OK** | Retrieves curated career catalogue (14 roles) with optional query filters (`search`, `ecosystem`, `family`, `track`). |
| `GET` | `/api/v1/careers/:idOrSlug` | **200 OK** | Retrieves a single career role definition with full competency requirements, prerequisites, learning IDs, and project IDs. |
| `GET` | `/api/v1/careers/matches/:profileId` | **200 OK** | Computes explainable match scores across all 14 catalogue roles using strictly candidate's confirmed competencies. |
| `POST` | `/api/v1/careers/compare` | **200 OK** | Compares 2 to 4 career roles side-by-side with shared transferable skills and gap deltas. |
| `GET` | `/api/v1/careers/:idOrSlug/gaps/:profileId` | **200 OK** | Performs 6-group skill-gap analysis with verified learning resources and practical projects. |
| `POST` | `/api/v1/learning-pathways` | **200 OK** | Generates sequenced, personalized learning pathway bridging candidate's actual skill gaps. |
| `GET` | `/api/v1/learning-resources` | **200 OK** | Returns complete catalogue of verified learning resources with direct URLs and verification metadata. |
| `GET` | `/api/v1/projects` | **200 OK** | Lists practical enterprise projects with optional filters (`roleSlug`, `search`, `difficulty`, `skill`). |
| `GET` | `/api/v1/projects/:projectId` | **200 OK** | Retrieves project detail including business problem, objectives, step-by-step instructions, and rubric criteria. |
| `POST` | `/api/v1/projects/:projectId/start` | **201 Created** | Initiates project workspace for candidate (`status: IN_PROGRESS`). |
| `POST` | `/api/v1/projects/:projectId/submissions` | **201 Created** | Submits deliverables (`repositoryUrl`, `liveDemoUrl`, `explanation`, `reflection`, `skillsDemonstrated`, `alternativeEvidence`). Transitions to `SUBMITTED`, `AWAITING_REVIEW`. |
| `GET` | `/api/v1/projects/submissions/:profileId` | **200 OK** | Returns all project submissions and evaluation states for a candidate profile. |
| `PUT` | `/api/v1/projects/submissions/:submissionId/review` | **200 OK** | Submits rubric evaluation. Computes weighted score using catalogue-locked weights; transitions to `COMPLETED` if independent evaluator $\ge 70\%$, `REVIEWED` if self-assessed, otherwise `NEEDS_REVISION`. |
| `GET` | `/api/v1/readiness/:profileId/:roleId` | **200 OK** | Computes 4-dimensional explainable readiness scorecard ($0.35 \times \text{Skill} + 0.35 \times \text{Mandatory} + 0.15 \times \text{Learning} + 0.15 \times \text{Projects}$), mandatory gap alerts, and next steps. |
| `GET` | `/api/v1/jobs/search-links/:roleId` | **200 OK** | Generates parameterized search URLs for SAP Official Careers, LinkedIn Jobs, and Indeed with Zero-Fabrication guarantee. |

---

## 3. Architecture & Modules Hardened

### Projects, Readiness & Jobs Modules (`apps/backend/src/modules/`)
- `practical-projects.catalogue.ts`: 10 enterprise portfolio projects with detailed business problems, step-by-step instructions, target skills, required technologies, and weighted rubric criteria.
- `project.service.ts`: Business logic for project workspace initiation, deliverable submission, and rubric evaluations with strictly locked catalogue weights, criterion existence verification, and simulated reviewer mode labeling.
- `readiness.service.ts`: Multi-dimensional readiness aggregation engine with mandatory gap checks, self-reported learning progress disclosures, and project scope isolation.
- `job-search.service.ts`: Query encoder and deep link generator for official career platforms.

### Shared Types & Schemas (`packages/shared/`)
- `validation.schemas.ts`: Added schema refinement requiring explicit proficiency selection on confirmed competencies while permitting optional proficiency on unconfirmed/rejected items; added `SIMULATED_DEMO_REVIEWER` to allowed reviewer types.
- `domain.types.ts`: Added `isDemoProfile` tracking across scorecards, gap analyses, and comparison results.

### Frontend Pages (`apps/frontend/`)
- `SkillsReviewPage.tsx`: Strictly blocks confirmation without explicit proficiency; displays helpful validation banners; preserves extraction confidence.
- `PracticalProjectsPage.tsx`: Discloses evaluator mode (Self-Assessment vs Simulated Independent Reviewer) with explicit limitations.
- `LearningPathwayPage.tsx`: Clearly labels progress as self-reported; clarifies that opening official SAP links does not automatically verify completion.
- `ReadinessPage.tsx`: Discloses that curriculum milestones are self-reported and that third-party LMS verification is not connected.
- `CareerExplorerPage.tsx`, `CareerComparisonPage.tsx`, `SkillGapPage.tsx`: Visual banners clearly distinguishing Verified Candidate Profiles from Sample Demo Profiles.

---

## 4. Test & Verification Results

| Test Suite / Verification Step | Result | Details |
| :--- | :---: | :--- |
| **Backend Automated Unit & Integration Suite** | **PASS (51/51)** | `npm test` running 51 tests across 7 test suites covering career matching (11), skill gaps (5), learning pathways (6), project lifecycle & rubrics (8), readiness scorecards (3), external job destinations (2), and resume ingestion/review (16). Includes regression test 10b, rubric guard test 7b, and skill review default test 16. Duration: 2.0s. |
| **End-to-End Milestone Verification** | **PASS (17/17)** | `verify-milestone.ts` tested real PDF & DOCX ingestion, human review, explainable matching, comparison, 6-group gap analysis, sequenced pathway, dynamic progress recalculation, edge cases, project discovery, workspace initiation, deliverable submission, rubric review, readiness scorecard, and parameterized job destinations. |
| **Monorepo Global Typecheck** | **PASS** | `npm run typecheck` across `shared`, `backend`, and `frontend` (0 errors). |
| **Frontend Production Build** | **PASS** | `npm run build:frontend` compiled 66 modules cleanly into `dist/` in 3.00s. |
| **Backend Production Build** | **PASS** | `npm run build:backend` compiled TypeScript cleanly into `dist/`. |
| **Visual Capture & Layout Audit** | **PASS** | Captured 15 screenshots (10 desktop + 5 mobile) into `screenshots/` and artifact directory (`01-landing-page.png` through `10-job-destinations.png`, plus `mobile-01` through `mobile-09`). |

---

## 5. Truthful Capabilities vs Limitations (Hackathon Demo Readiness)

### Genuinely Functional in this Build
1. **Interactive Project Workspaces:** Candidates discover 10 enterprise projects, initiate workspaces, submit URLs/reflections/challenges/alternative evidence, and undergo multi-criteria rubric evaluations.
2. **Strict Rubric Locking:** Rubric criteria and weights are strictly enforced from project catalogue definitions, rejecting client tampering or unknown criteria.
3. **Explicit Lifecycle States:** Submissions transition cleanly from `NOT_STARTED` $\to$ `IN_PROGRESS` $\to$ `SUBMITTED` $\to$ `NEEDS_REVISION` / `REVIEWED` / `COMPLETED`. Uploading never automatically certifies competence without rubric scoring.
4. **Audit-Transparent Career Readiness:** Readiness score formula ($0.35 \times \text{Skill} + 0.35 \times \text{Mandatory} + 0.15 \times \text{Learning} + 0.15 \times \text{Projects}$) highlights missing mandatory skills and prevents eligibility when core prerequisites are absent.
5. **Verified External Job Deep Searches:** Custom parameterization generates direct queries for SAP Official Careers (`jobs.sap.com`), LinkedIn Jobs, and Indeed without scrapers or hallucinated postings.
6. **Human-in-the-Loop AI & Zero Fabrication:** Full explainability with statutory disclaimers stating readiness is not a hiring guarantee and external jobs are query-parameterized deep links to official engines.

### Truthful Limitations & Disclosures
1. **Database Persistence:** PostgreSQL is not installed on the development host. The backend operates with an in-process in-memory repository fallback. Candidate profiles, reviewed competencies, and project submissions persist for the duration of the Node.js server process. If the server restarts, data resets, and users are notified via banner disclosure.
2. **Security & Reviewer Authentication:** Independent reviewer mode is a simulated demonstration. Enterprise third-party OAuth/SAML evaluator authentication and digital signing are not implemented in this local build; self-assessment is explicitly restricted from granting independent verification.
3. **LMS Credential Verification:** Course milestone completions are self-reported by the candidate for session planning. Opening official SAP URLs provides direct curriculum access but does not automatically verify course completion without external SAP LMS API integration.
