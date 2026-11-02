# Career Orchestrator — Project Status Log

**Project:** Career Orchestrator (SAP Hackfest 2026)  
**Current Milestone:** Deep Reset Bug Fix, Premium Minimal Enterprise Dashboard & Zero-Fabrication Candidate Session Isolation  
**Overall Status:** **HACKATHON DEMO READY** (53/53 automated backend tests pass, full monorepo typecheck clean across all 3 workspaces, production bundling clean, 17-stage E2E workflow verified, 15 desktop & mobile screenshots updated and verified)  
**Last Updated:** 2026-11-03 02:50:00 UTC+05:30  

---

## 1. Milestone Status Summary

- **Deep Candidate Session Reset & Distinct Workflows:** **PASS** (Separated candidate workflows into two distinct, non-aliased actions: `Start New Profile` and `Load Alex Vance Demo Baseline`. Fixed demo submission resurrection by removing fallback to `'demo-profile'` in `fetchUserSubmissions`, eliminating ghost key lookups in `project.repository.ts`, purging both compound `${profileId}:${projectId}` and `${sub.id}` keys, and guarding asynchronous requests with `AbortController` and `sessionGeneration` ref guards. Fully clears React refs, native file inputs, error banners, and browser cache).
- **Backend Candidate Session Purge API (`DELETE /api/v1/profile/:id`):** **PASS** (Returns HTTP 200 on successful purge with storage metadata and deleted submission counts; returns deliberate HTTP 404 with documented JSON when nonexistent or already expired; verified with automated regression tests 17 & 18).
- **Premium Minimal Enterprise Dashboard (`/dashboard`):** **PASS** (Redesigned into a cohesive SAP-inspired command center with white/light-grey content surfaces, deep navy typography, and SAP blue accents:
  1. *Executive Top Navigation:* Compact header with brand identity, one target-role selector, search palette trigger, live session signals popover, and profile dropdown menu.
  2. *Candidate Overview Bar:* 4-column overview displaying candidate identity, resume document source, active target role goal, and competency calibration status with distinct badges (`Alex Vance (Demo Baseline)`, `Verified Profile`, `Intake Staged`, or `Empty Session`).
  3. *Four Meaningful Quantitative Metrics:* Confirmed Competencies, Transferable Skills, Priority Skill Gaps, and Learning Milestones Completed — honest counts with zero artificial multipliers, distinguishing suggested from confirmed skills.
  4. *Dynamic Next Recommended Action Banner:* ONE prominent strategic recommendation card deriving purely from candidate state (Empty Session $\to$ Skills Review Calibration $\to$ Priority Milestone Upskilling $\to$ Learning In Progress $\to$ High Readiness & Evidence Submission). Includes secondary action for one-click demo baseline loading.
  5. *7-Stage Transition Roadmap:* Compact interactive milestone journey from Background Intake to Readiness & Job Destinations with genuine status indicators (`DONE`, `ACTIVE`, `NEXT`).
  6. *Two-Column Career Intelligence Grid:* Left column houses Target Role Match Breakdown with honest empty session state and SVG Career DNA Radar Chart; right column houses Target Learning Pathway with fractional progress and Practical Project Workspace.
  7. *Curated 14-Role Alternative Pathways:* 4 alternative career recommendations sorted by match score with matched/gap counts and quick target switching).
- **Zero-Fabrication Data Integrity:** **PASS** (Never displays hardcoded 88/100 project scores or artificial 34% multipliers for empty candidate sessions; never claims unreviewed profiles have verified AI match scores; strictly separates demo data with amber baseline badges).
- **Automated Verification Suite:** **PASS** (53/53 backend unit/integration tests passing in 2.4s; 17-stage end-to-end integration test passing; 100% monorepo typecheck clean; Vite production build compiling cleanly).
- **Visual Capture & Layout Audit:** **PASS** (Headless Chrome captured 1280x850 desktop and 375x812 mobile screenshots across all 11 platform views including the redesigned Executive Dashboard: `00-dashboard-desktop.png`, `mobile-00-dashboard.png`, and `01-landing-page.png` through `10-job-destinations.png` in `screenshots/` and artifact directory).

---

## 2. API Endpoints Created and Verified

| Method | Endpoint | Status | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/api/v1/health` | **200 OK** | System health, environment, timestamp. |
| `POST` | `/api/v1/resume/upload` | **200 OK** | Multipart upload (`file` field). Validates format and binary magic bytes, extracts text via Mozilla PDF.js or Mammoth, runs deterministic ontology matcher, returns `ResumeUploadResponse`. |
| `PUT` | `/api/v1/profile/:id/review` | **200 OK** | Submits human review (`ProfileReviewSubmissionSchema`). Segregates confirmed from rejected skills, persists updates, returns `ProfileReviewResponse`. |
| `GET` | `/api/v1/profile/:id` | **200 OK** | Retrieves stored candidate profile by ID. Returns 404 if profile does not exist or server was restarted. |
| `DELETE` | `/api/v1/profile/:id` | **200 OK / 404** | Purges candidate profile and associated practical project submissions from in-memory repository for a clean session reset. Returns 404 if already expired/nonexistent. |
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
| **Backend Automated Unit & Integration Suite** | **PASS (53/53)** | `npm test` running 53 tests across 7 test suites covering career matching (11), skill gaps (5), learning pathways (6), project lifecycle & rubrics (8), readiness scorecards (3), external job destinations (2), and resume ingestion/review (18). Includes regression test 10b, rubric guard test 7b, skill review default test 16, candidate purge test 17, and nonexistent delete test 18. Duration: 2.4s. |
| **End-to-End Milestone Verification** | **PASS (17/17)** | `verify-milestone.ts` tested real PDF & DOCX ingestion, human review, explainable matching, comparison, 6-group gap analysis, sequenced pathway, dynamic progress recalculation, edge cases, project discovery, workspace initiation, deliverable submission, rubric review, readiness scorecard, and parameterized job destinations. |
| **Monorepo Global Typecheck** | **PASS** | `npm run typecheck` across `shared`, `backend`, and `frontend` (0 errors). |
| **Frontend Production Build** | **PASS** | `npm run build:frontend` compiled 76 modules cleanly into `dist/` in 2.65s. |
| **Backend Production Build** | **PASS** | `npm run build:backend` compiled TypeScript cleanly into `dist/`. |
| **Visual Capture & Layout Audit** | **PASS** | Captured 15 screenshots (10 desktop + 5 mobile) into `screenshots/` and artifact directory (`00-dashboard-desktop.png` through `10-job-destinations.png`, plus `mobile-00` through `mobile-09`). |

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
