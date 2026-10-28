# Career Orchestrator — Project Status Log

**Project:** Career Orchestrator (SAP Hackfest 2026)  
**Current Phase:** Real End-to-End Resume Ingestion & Human-Reviewed Skill Extraction Workflow  
**Overall Status:** **PASS** (15/15 automated backend tests pass, full monorepo typecheck clean, frontend production build clean, full E2E workflow verified)  
**Last Updated:** 2026-10-28 21:58:00 UTC+05:30  

---

## 1. Phase Status Summary

- **Multi-Format Text Extraction:** **PASS** (Mozilla `pdfjs-dist/legacy/build/pdf.js` for robust Node 20.11.1 PDF text extraction; `mammoth` for Word DOCX extraction).
- **Deterministic Skill Ontology Matcher:** **PASS** (Word-boundary regex extraction across 9 categories, evidence snippets, explicit mention vs contextual inference, heuristic confidence scores 0.72–0.95, deduplication, unconfirmed `SUGGESTED` default).
- **Multipart Upload & Validation:** **PASS** (`POST /api/v1/resume/upload` enforces 10MB limit, extension whitelist `.pdf`/`.docx`, binary magic byte validation `%PDF` and `PK\x03\x04`, graceful handling of empty/corrupt files).
- **Human-in-the-Loop Review API:** **PASS** (`PUT /api/v1/profile/:id/review` validates payload via `ProfileReviewSubmissionSchema`, segregates confirmed from rejected skills, supports manual additions, updates candidate profile).
- **Frontend Human Review Interface:** **PASS** (`ProfilePage.tsx` with real multipart upload and progress indicator; `SkillsReviewPage.tsx` with competency verification table, evidence inspection, calibrated proficiency dropdowns, inline name editing, modal for manual addition, and persist review button; `CareerExplorerPage.tsx` with real dynamic match percentage derived from confirmed candidate competencies).
- **PostgreSQL & Repository Fallback:** **PASS** (Documented truthful status: PostgreSQL is not installed on host; implemented `InMemoryProfileRepository` fallback with non-durable session disclosure; tested graceful 404 behavior upon restart).
- **Automated Verification Suite:** **PASS** (15/15 backend unit/integration tests passing in 3.95s; 6-stage end-to-end integration test passing; 100% monorepo typecheck clean).
- **Visual Capture & Layout Audit:** **PASS** (All workflow views captured via headless Chrome at 1280x850 in `K:\SAP\screenshots` and brain artifacts).

---

## 2. API Endpoints Created and Verified

| Method | Endpoint | Status | Description |
| :--- | :--- | :---: | :--- |
| `GET` | `/api/v1/health` | **200 OK** | System health, environment, timestamp. |
| `POST` | `/api/v1/resume/upload` | **200 OK** | Multipart upload (`file` field). Validates format and binary magic bytes, extracts text via Mozilla PDF.js or Mammoth, runs deterministic ontology matcher, returns `ResumeUploadResponse`. |
| `PUT` | `/api/v1/profile/:id/review` | **200 OK** | Submits human review (`ProfileReviewSubmissionSchema`). Segregates confirmed from rejected skills, persists updates, returns `ProfileReviewResponse`. |
| `GET` | `/api/v1/profile/:id` | **200 OK** | Retrieves current stored candidate profile by ID. Returns 404 if profile does not exist or server was restarted. |

---

## 3. Architecture & Modules Created

### Backend Module (`apps/backend/src/modules/resume/`)
- `file-validator.ts`: Validates 10MB size limit, file extensions, and binary magic bytes (`%PDF` for PDF, `PK\x03\x04` ZIP for DOCX).
- `text-extractor.interface.ts`: Standard abstraction for document extractors.
- `pdf-extractor.ts`: Mozilla PDF.js legacy engine (`pdfjs-dist/legacy/build/pdf.js`). Detects scanned/image-only PDFs and warns that OCR is not enabled.
- `docx-extractor.ts`: Mammoth raw text extraction from binary buffers.
- `skill-ontology.ts`: Curated ontology across 9 functional categories (Programming, Frontend, Backend, Databases, Cloud Platforms, Data Analytics, Domain Business, Project Management, Tools/Testing).
- `deterministic-skill-extractor.ts`: Boundary-safe regex matcher (`\b...\b`), extracts supporting evidence snippets, distinguishes explicit vs contextual inference, heuristic confidence scores (0.72–0.95), deduplicates by code, sets `isConfirmed: false` and `reviewStatus: 'SUGGESTED'`.
- `profile.repository.ts`: Repository interface and `InMemoryProfileRepository` fallback with session non-durability disclosure.
- `resume.service.ts`: Orchestrates validation, text extraction, skill matching, and draft profile creation.
- `profile.service.ts`: Handles candidate review submission, confirmed vs rejected filtering, and manual additions.
- `resume.controller.ts`: Controller with input validation, error mapping, and HTTP status codes.
- `resume.router.ts`: Multer memory storage and route definitions.

### Shared Layer (`packages/shared/`)
- `domain.types.ts`: `ExtractedSkillItem`, `ExtractionMethod`, `SkillReviewStatus`, `ResumeUploadResponse`, `ProfileReviewResponse`.
- `validation.schemas.ts`: Zod schemas `SkillReviewInputSchema`, `ProfileReviewSubmissionSchema`.

### Frontend Updates (`apps/frontend/`)
- `ProfilePage.tsx`: Real multipart form upload to `/api/v1/resume/upload`, loading spinner, upload progress, error banners, OCR advisory warning banner on `EMPTY_TEXT`, and automatic transition to review.
- `SkillsReviewPage.tsx`: Interactive Competency Review table showing real candidate skills, canonical name editing, category badges, extraction method badges (`Direct Mention` vs `Contextual` vs `Manual`), calibrated proficiency dropdowns, years of experience inputs, evidence snippets with tooltip, unconfirm/reject controls, "Add Competency" modal, raw text preview collapsible, and "Confirm & Explore Careers" backend persistence action.
- `CareerExplorerPage.tsx`: Calculates candidate match percentage dynamically via `calculateRoleMatch(role)` when profile is reviewed; displays verified competency count (e.g., "3 of 5 Verified") and highlights matching required skills.
- `CareerContext.tsx`: Manages `currentProfileId`, `extractedTextPreview`, `extractionWarnings`, `isRealProfileLoaded`, `isRealProfileReviewed`, `skills`, and dynamic role match calculation.

---

## 4. Test & Verification Results

| Test Suite / Verification Step | Result | Details |
| :--- | :---: | :--- |
| **Backend Automated Unit & Integration Suite** | **PASS (15/15)** | `npm test` running 15 tests covering PDF extraction, DOCX extraction, evidence snippets, empty text warnings, format validation, 10MB limit, corrupt PDF handling, 0-byte rejection, deduplication, unconfirmed defaults, review confirmation, skill rejection, manual additions, 404 handling, and OCR detection. Duration: 3.95s. |
| **End-to-End Ingestion & Review Workflow** | **PASS (6/6)** | `verify-milestone.ts` tested real PDF (7 competencies identified), real DOCX (12 competencies identified), blank/scanned PDF (`EMPTY_TEXT` + OCR advisory), unsupported `.txt` (HTTP 400), review submission (4 confirmed, 1 rejected, 1 manual added), and post-restart 404 behavior. |
| **Monorepo Global Typecheck** | **PASS** | `npm run typecheck` across `shared`, `backend`, and `frontend` (0 errors). |
| **Frontend Production Build** | **PASS** | `npm run build:frontend` compiled 69 modules in 3.40s. |
| **Backend Production Build** | **PASS** | `npm run build:backend` compiled TypeScript cleanly into `dist/`. |
| **Visual Capture & Layout Audit** | **PASS** | Captured `02-profile-upload-staged.png`, `03-skills-review-real.png`, and `04-career-explorer-matched.png`. |

---

## 5. Truthful Capabilities vs Staged Features

### Genuinely Functional in this Milestone
1. **Real PDF Text Extraction:** Extracts selectable text from Adobe PDF documents via Mozilla PDF.js.
2. **Real Word DOCX Text Extraction:** Extracts document paragraphs from OpenXML DOCX files via Mammoth.
3. **Deterministic Ontology Matching:** Evaluates 9 functional skill categories with regex boundary safety, evidence snippet extraction, explicit vs contextual extraction tagging, and confidence scoring.
4. **Human-in-the-Loop Verification:** Candidate reviews every extracted item, confirms/unconfirms, edits canonical names, adjusts proficiencies and experience, rejects irrelevant skills, and adds custom competencies.
5. **Dynamic Career Match Scores:** Match percentages in Career Explorer dynamically reflect the candidate's confirmed competencies against role requirements.
6. **Graceful Error Handling:** Rejects oversized files, unsupported formats, empty files, and flags scanned/image PDFs with clear OCR advisory notices.

### Intentionally Staged / Host Prerequisites Pending
1. **PostgreSQL Database Storage:** PostgreSQL is not installed on the local host. The service operates an in-memory repository fallback. Profiles are retained for the duration of the server process. If the server restarts, draft profiles reset, and the user is guided to re-upload or continue with manual intake.
2. **Optical Character Recognition (OCR):** Scanned image PDFs and photos without a text layer are detected and flagged with an advisory notice explaining OCR is disabled.
3. **Deep Career Gap & Learning Plan Personalization:** Mathematical gap closure algorithms and dynamic milestone generation run in Milestone 3.
