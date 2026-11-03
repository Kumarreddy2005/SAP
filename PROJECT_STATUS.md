# Career Orchestrator — Project Status Log

**Project:** Career Orchestrator (SAP Hackfest 2026)  
**Current Milestone:** Post-Release Engineering Audit, Persistent Candidate Session Modes & Zero-Fabrication Mobile-Hardened Dashboard  
**Overall Status:** **HACKATHON DEMO READY & AUDIT VERIFIED** (65/65 automated tests pass [53 backend + 12 frontend], full monorepo typecheck clean across all 3 workspaces, production bundling clean, 17-stage E2E workflow verified, 17 desktop & mobile screenshots updated and verified)  
**Last Updated:** 2026-11-03 03:30:00 UTC+05:30  

---

## 1. Milestone Status Summary

- **Persistent Candidate Session Modes (`EMPTY`, `DEMO`, `REAL_PROFILE`):** **PASS** (Engineered a validated candidate session storage layer in `apps/frontend/src/context/sessionState.ts`. Solved candidate resurrection across page reloads by replacing hardcoded initial state literals with `loadSessionState()`. Page refresh on an empty session deterministically preserves `EMPTY` mode; page refresh on `DEMO` preserves the Alex Vance baseline; page refresh on `REAL_PROFILE` preserves actual parsed/confirmed competencies without ever falling back to demo records).
- **Complete Request Lifecycle & Async Race Protection:** **PASS** (Audited and protected all 12 candidate-specific asynchronous operations across CareerContext: resume upload, skill review, career matching, gap analysis, learning pathway generation, role comparison, project workspace initialization, project deliverable submission, project review, user submissions fetching, readiness calculation, and job search links. Wired native `AbortController` signals to cancel in-flight HTTP requests upon session reset, and added `sessionGenerationRef` and `sessionMode === 'EMPTY'` guards to reject late-resolving promises).
- **Honest Readiness Scorecard Validation:** **PASS** (Completely eliminated the premature shortcut `projectsCompletedCount > 0` that previously triggered `HIGH_READINESS`. The system now strictly requires verified backend scorecard eligibility: `readinessScorecard.isReadinessEligible && readinessScorecard.overallReadinessScore >= 70 && readinessScorecard.outstandingMandatoryGaps.length === 0`. Missing backend scorecards produce an honest intake/pending status, never an invented score).
- **Zero-Fabrication Data Integrity & Removal of Fake `88/100` Fallbacks:** **PASS** (Audited all components and eliminated every occurrence of `|| 88` and fabricated `(88/100)` strings in notifications, roadmap step subtitles, project status badges, and rubric feedback. Derived all notifications strictly from actual database records: e.g. displaying dynamic rubric scores, actual evaluated project counts, or unreviewed counts).
- **Mobile Responsiveness Audit & 0px Horizontal Overflow at 375px:** **PASS** (Fixed previous 105px horizontal overflow on 375px mobile screens. Root cause: `gridTemplateColumns: minmax(480px, 1fr)` in DashboardPage line 995 and fixed-width SVG/grid in radar chart. Replaced with `repeat(auto-fit, minmax(min(100%, 320px), 1fr))`, fluid radar chart with `maxWidth: 100%`, compact icon-only search on mobile, flexible role selectors, and stacked overview cards. Confirmed zero horizontal scrolling at 375px).
- **Truthful Dashboard Semantics & Empty Session States:** **PASS** (Target Calibration step on transition roadmap is no longer marked completed merely because a default role was selected; it correctly requires skill review in real candidate sessions and remains inactive in empty sessions. Curriculum completed metric displays `—` with `Intake required for curriculum` in empty sessions rather than claiming `0 of 3 Milestones`).
- **Comprehensive Automated Test Coverage (65 Tests Total):** **PASS** (Created `apps/frontend/src/__tests__/session-lifecycle.test.ts` covering all 12 required lifecycle, persistence, and audit scenarios using Node test runner. Monorepo automated test suite now runs 65 tests [53 backend + 12 frontend] with 100% pass rate in 2.1s).
- **Visual Capture & Layout Audit:** **PASS** (Captured 17 verified screenshots [11 desktop + 6 mobile] including fresh empty and demo dashboards: `00-dashboard-empty-desktop.png`, `00-dashboard-desktop.png`, `mobile-00-dashboard-empty.png`, and `mobile-00-dashboard.png` into `screenshots/` and artifact directory).

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
| **Monorepo Automated Test Suite (`npm test`)** | **PASS (65/65)** | `npm test` running 65 automated tests across backend (53) and frontend (12). Frontend suite covers all 12 candidate session lifecycle, refresh persistence, race isolation, rubric integrity, and mobile layout constraints. Backend suite covers career matching (11), skill gaps (5), learning pathways (6), project lifecycle & rubrics (8), readiness scorecards (3), external job destinations (2), and resume ingestion/review (18). Duration: 2.1s. |
| **End-to-End Milestone Verification** | **PASS (17/17)** | `verify-milestone.ts` tested real PDF & DOCX ingestion, human review, explainable matching, comparison, 6-group gap analysis, sequenced pathway, dynamic progress recalculation, edge cases, project discovery, workspace initiation, deliverable submission, rubric review, readiness scorecard, and parameterized job destinations. |
| **Monorepo Global Typecheck** | **PASS** | `npm run typecheck` across `shared`, `backend`, and `frontend` (0 errors). |
| **Frontend Production Build** | **PASS** | `npm run build:frontend` compiled 77 modules cleanly into `dist/` in 4.62s. |
| **Backend Production Build** | **PASS** | `npm run build:backend` compiled TypeScript cleanly into `dist/`. |
| **Visual Capture & Layout Audit** | **PASS** | Captured 17 verified screenshots (11 desktop + 6 mobile) into `screenshots/` and artifact directory (`00-dashboard-empty-desktop.png`, `00-dashboard-desktop.png`, `mobile-00-dashboard-empty.png`, `mobile-00-dashboard.png`, and `01-landing-page.png` through `10-job-destinations.png`). |

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
