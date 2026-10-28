# Career Orchestrator — AI-Assisted Career Transitions for SAP

> **SAP Hackfest 2026 Project**  
> An explainable, human-guided career transition platform helping professionals translate their existing experience and transferable skills into high-demand SAP and enterprise technology careers.

---

## 1. Project Purpose

Career Orchestrator addresses the enterprise talent gap in the SAP ecosystem by:
- **Demystifying SAP Careers:** Translating non-SAP backgrounds (e.g. general accounting, warehouse operations, Java development, systems analysis) into relevant SAP roles (e.g. S/4HANA Finance, S/4HANA Sourcing & Procurement, ABAP Cloud, BTP Integration).
- **Preserving User Agency:** Keeping humans in control. Extracted skills are explicitly reviewed and confirmed by the candidate rather than determined by opaque AI.
- **Explainable Match Scoring:** Providing transparent, mathematically derived match percentages and itemized skill gap deltas.
- **Verified Learning Pathways:** Directing users to verified courses from SAP Learning Hub Student Edition and curated open resources without fabricated links.
- **Evidence-Based Readiness:** Allowing users to log tangible project deliverables and build an explainable readiness profile.

---

## 2. Architecture Overview

Career Orchestrator is structured as an npm workspaces monorepo:

```text
K:\SAP\
├── apps/
│   ├── backend/             # Node.js + Express + TypeScript REST API
│   └── frontend/            # React + Vite + TypeScript (SAP Horizon UI theme)
├── packages/
│   └── shared/              # Shared TypeScript domain models & Zod schemas
├── .env.example             # Safe environment variable configuration template
├── .gitignore               # Strict exclusion of dist, node_modules, and secrets
├── README.md                # System documentation and onboarding guide
└── PROJECT_STATUS.md        # Real-time implementation and verification log
```

- **Frontend:** Built with React 18, Vite, and TypeScript. Implements SAP Fiori/Horizon enterprise design language (SAP blue `#0070F2`, deep navy `#001A47`, accessible contrast, responsive card grids).
- **Backend:** Express API service with centralized error handling, CORS security policies, and environment validation.
- **Shared Layer (`@career-orchestrator/shared`):** Reusable domain interfaces (`Skill`, `CareerRole`, `SkillMatch`) and runtime Zod validation schemas (`HealthResponseSchema`, `SkillReviewInputSchema`) shared across frontend and backend.
- **Database Layer (Deferred):** PostgreSQL + Prisma ORM. Currently blocked pending local/hosted PostgreSQL service provision (see [Known Limitations](#7-known-limitations)).

---

## 3. Prerequisites

- **Operating System:** Windows 10/11, macOS, or Linux.
- **Node.js:** `v20.x` or higher (`v20.11.1` verified).
- **Package Manager:** `npm` (`v10.2.4` verified).
- **Git:** `v2.40+` (`v2.42.0` verified).
- **PostgreSQL (Optional for Phase 0/1 foundation; required for persistent DB phase):** PostgreSQL 15+ instance.

---

## 4. Installation & Setup

1. **Clone the repository:**
   ```bash
   git clone <repo-url>
   cd SAP
   ```

2. **Install all monorepo dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Copy `.env.example` to create your local `.env`:
   ```bash
   cp .env.example .env
   ```
   *Note: Default configurations will automatically run the API on port 5000 with CORS enabled for `http://localhost:5173`.*

4. **Build All Workspaces (Shared, Backend, Frontend):**
   ```bash
   npm run build
   ```

---

## 5. Development & Running Commands

From the root repository directory:

| Command | Action |
| :--- | :--- |
| `npm run build` | Builds shared package, backend, and frontend |
| `npm run typecheck` | Runs TypeScript compiler checks across all workspaces |
| `npm run start:backend` | Starts the production-compiled Express API server (`http://localhost:5000`) |
| `npm run dev:backend` | Starts the backend with live reloading (`tsx watch`) |
| `npm run dev:frontend` | Starts the Vite React frontend dev server (`http://localhost:5173`) |
| `npm run preview:frontend` | Previews the production-built frontend (`http://localhost:4173` or specified port) |

---

## 6. Verification & Health Check

The backend exposes an operational status endpoint:

- **Health-Check URL:** `http://localhost:5000/api/v1/health`
- **Expected JSON Response:**
  ```json
  {
    "status": "ok",
    "application": "Career Orchestrator",
    "environment": "development",
    "timestamp": "2026-10-28T15:11:14.385Z"
  }
  ```

---

## 7. Known Limitations

1. **PostgreSQL Availability:** PostgreSQL is not currently installed or running on the local host machine. The application foundation has been designed cleanly to operate and pass health-checks without an active database connection for this phase. Database migrations and Prisma integration will execute once database connection credentials are provided.
2. **Terminal Sandbox NVM Node Resolution:** When executing commands in restricted sandboxes on Windows, NVM symlinks pointing to `%LOCALAPPDATA%\nvm` require bypass approval due to OS-level user directory boundaries.
3. **Curated Catalogs:** Career roles and learning resource mappings are currently defined via shared domain schemas; database persistence and seeding will occur in the next implementation phase.
