# CAREER ORCHESTRATOR — HACKATHON DEMO GUIDE
> **SAP Hackfest 2026 | Technical Demo Script & Presentation Playbook**

This guide provides the presentation narrative, startup procedures, step-by-step demo flow, and technical architectural walkthrough for the judges and audience at SAP Hackfest 2026.

---

## 1. Quick-Start Commands

To run Career Orchestrator locally for the live demo:

### Step 1: Start the Backend Service
Open a terminal in `K:\SAP`:
```powershell
# From workspace root
npm run start:backend
# Or with live reload:
npm run dev:backend
```
*The Express API will be running on `http://localhost:5000` (Health Check: `http://localhost:5000/api/v1/health`).*

### Step 2: Start the Frontend Application
Open a second terminal in `K:\SAP`:
```powershell
# Production preview (recommended for rock-solid demo performance):
npm run preview:frontend
# Or development mode with hot reload:
npm run dev:frontend
```
*Open your browser at `http://localhost:4173` (preview) or `http://localhost:5173` (dev).*

---

## 2. System Architecture

```mermaid
graph TD
    subgraph Client ["Frontend Client (React 18 + Vite + TypeScript)"]
        UI_Landing["Landing Page /"]
        UI_Dashboard["Executive Dashboard /dashboard"]
        UI_Profile["Profile Ingestion /profile"]
        UI_Review["Human Skills Review /skills-review"]
        UI_Careers["Career Explorer & Comparison /careers"]
        UI_Gaps["6-Category Skill Gaps /career-gap"]
        UI_Learning["Sequenced Pathways /learning"]
        UI_Projects["Enterprise Project Workspaces /projects"]
        UI_Readiness["Readiness Scorecard /readiness"]
        UI_Jobs["Verified Job Destinations /jobs"]
        Context["CareerContext State Machine"]
    end

    subgraph Backend ["Backend API Service (Node.js + Express + TypeScript)"]
        API_Gateway["Express Router /api/v1"]
        ResumeEngine["Deterministic Resume Parser (PDF.js / Mammoth)"]
        Ontology["Deterministic Enterprise Skill Ontology (50+ Skills)"]
        Matcher["Explainable Career Matcher (Weighted Fit Formula)"]
        GapAnalyzer["Categorized Gap Analyzer (6 Dimensions)"]
        PathwayEngine["Sequenced Learning Pathway Generator"]
        ProjectService["Enterprise Project Lifecycle & Rubric Engine"]
        ReadinessEngine["Multi-Dimensional Readiness Aggregator"]
        JobSearchEngine["Deep-Query External Job Link Generator"]
        Repo["In-Memory Repository (Session Fallback)"]
    end

    subgraph Shared ["Shared Monorepo Package (@career-orchestrator/shared)"]
        Schemas["Zod Runtime Validation Schemas"]
        Types["Enterprise TypeScript Domain Types"]
    end

    Client -->|REST API Calls| API_Gateway
    API_Gateway --> ResumeEngine
    ResumeEngine --> Ontology
    API_Gateway --> Matcher
    API_Gateway --> GapAnalyzer
    API_Gateway --> PathwayEngine
    API_Gateway --> ProjectService
    API_Gateway --> ReadinessEngine
    API_Gateway --> JobSearchEngine
    Matcher --> Repo
    GapAnalyzer --> Repo
    PathwayEngine --> Repo
    ProjectService --> Repo
    ReadinessEngine --> Repo
    Client -.->|Type Safety| Types
    Backend -.->|Validation| Schemas
```

---

## 3. Candidate User Journey

```mermaid
flowchart LR
    A["1. Resume Upload / Profile"] --> B["2. Human Skills Review"]
    B --> C["3. Explore 14 Career Tracks"]
    C --> D["4. Side-by-Side Comparison"]
    D --> E["5. Itemized Skill Gap Delta"]
    E --> F["6. Sequenced Learning Pathway"]
    F --> G["7. Hands-on Project Deliverable"]
    G --> H["8. Career Readiness Scorecard"]
    H --> I["9. Verified Job Applications"]
```

---

## 4. Live Demo Walkthrough (3–5 Minute Script)

### Persona: **Alex Vance / Alex Morgan**
- **Current Role:** Senior Financial & Systems Analyst (5 years general accounting, Excel modeling, SQL auditing).
- **Career Ambition:** Pivot into the high-demand SAP ecosystem as an **SAP S/4HANA Finance Functional Consultant**.
- **Pain Point:** Opaque job descriptions, uncertainty about transferable skills, lack of structured enterprise training, and no verifiable portfolio proof.

---

### ACT I — Landing Page & The Executive Cockpit (45 Seconds)
- **Navigate to:** `http://localhost:4173/` and click **"Open Executive Dashboard"** (`/dashboard`).
- **Narrative:**
  > *"Career Orchestrator provides an enterprise SaaS executive cockpit that brings every dimension of career transition into unified, real-time focus. Notice the dark navy collapsible sidebar, responsive global search palette with instant keyboard filtering across roles and skills, and our 5-stage documented transition progress tracker. Our interactive pure-SVG Career DNA radar visualizes candidate competencies across 6 enterprise dimensions directly against target role benchmarks."*
- **Action:**
  1. Demonstrate the **Global Search Palette** (press `/` or click search: type *"Finance"* or *"SQL"* to see live matches).
  2. Toggle the **Career DNA Radar** legend (hide/show Candidate Level vs Target Benchmark) and click a perimeter category label to inspect confirmed competencies and evidence snippets.
  3. Show the **Transition Progress Tracker** and click *"Explain Formula & Rules"* to prove transparent, documented arithmetic ($P = \frac{\sum P_i}{5}$) with zero fake percentages.
  4. Use the top bar dropdown to quickly switch the target role to *"SAP ABAP Cloud Developer"* and show the whole dashboard re-calibrating dynamically! Switch back to *"SAP S/4HANA Finance Consultant"*.

---

### ACT II — Ingestion & Human-in-the-Loop Review (60 Seconds)
- **Navigate to:** `http://localhost:4173/profile` $\to$ `/skills-review`
- **Narrative:**
  > *"Instead of using generative AI that hallucinates skills or invents years of experience, our backend employs a deterministic ontology parser supporting genuine PDF and DOCX documents with magic byte verification. Most importantly: we uphold the Human-in-the-Loop principle. The AI extracts evidence snippets, but competencies remain unconfirmed and uncalibrated until the candidate explicitly reviews them."*
- **Action:**
  1. Highlight the pre-extracted profile for Alex (or upload `Alex_Vance_Resume.pdf`).
  2. In `/skills-review`, show the candidate reviewing skills:
     - Point out that clicking "Confirm" without selecting proficiency displays a clear prompt requiring calibration.
     - Show the **Evidence Snippets** highlighting actual lines extracted from the resume.
     - Select calibrated proficiency (e.g. Advanced or Intermediate) and experience for confirmed skills.
     - Click **"Confirm & Explore Careers"** to persist the reviewed profile to the backend.

---

### ACT III — Explainable Matching & Role Comparison (45 Seconds)
- **Navigate to:** `http://localhost:4173/careers` and `/careers/compare`
- **Narrative:**
  > *"Our matching algorithm is 100% deterministic and explainable: $100 \times \frac{\sum w_i f_i}{\sum w_i}$. We clearly separate missing mandatory requirements from elective skills so a candidate never gets a false sense of security. Notice the green badge indicating that matches are derived strictly from an active human-reviewed profile."*
- **Action:**
  1. Notice **SAP S/4HANA Finance Functional Consultant** is highlighted as a top match (~72% initial fit).
  2. Select **SAP S/4HANA Finance** and **SAP S/4HANA Sourcing & Procurement** to compare side-by-side in `/careers/compare`.
  3. Show the comparison matrix isolating shared transferable skills (SQL, Business Process Mapping) vs role-specific mandatory requirements.

---

### ACT IV — Skill Gap Analysis & Sequenced Learning (45 Seconds)
- **Navigate to:** `http://localhost:4173/career-gap` and `/learning`
- **Narrative:**
  > *"Career Orchestrator breaks gaps into 6 clear categories rather than a vague percentage. We then sequence a personalized roadmap that respects pedagogical prerequisites: business process fundamentals come before customizing; core skills come before integration."*
- **Action:**
  1. In `/career-gap`, point out the 6 groups: Confirmed Matches, Partial Matches, Mandatory Gaps (e.g., *SAP Fiori Financial Apps*), Recommended Gaps, Unverified Requirements, and External Prerequisites.
  2. Show verified resource links directly mapped to official **SAP Learning Hub (Student Edition)** and **openSAP** courses with exact hour estimates.
  3. In `/learning`, show the sequenced milestones. Note the clear disclosure: milestone progress is self-reported by the candidate for session planning, and clicking the SAP link provides courseware access without claiming automatic server-side LMS completion.

---

### ACT V — Enterprise Projects & Readiness Scorecard (60 Seconds)
- **Navigate to:** `http://localhost:4173/projects` and `/readiness`
- **Narrative:**
  > *"Course completion alone doesn't prove capability to an enterprise hiring manager. Our platform includes 10 enterprise portfolio projects with realistic business scenarios and multi-criteria rubrics. Weights are locked to the project catalogue to prevent grade tampering."*
- **Action:**
  1. In `/projects`, open **"Enterprise Organizational Blueprint & Company Code Setup"**.
  2. Show the multi-criteria evaluation rubric. Point out the Evaluator Mode dropdown: Self-Assessment (capped at REVIEWED) vs Simulated Independent Evaluator Mode (with explicit demo disclosure).
  3. Demonstrate starting the workspace, submitting deliverables, and grading against the rubric.
  4. Navigate to `/readiness` to display the **Multi-Dimensional Career Readiness Scorecard**:
     $$\text{Readiness} = 0.35 \times \text{Skill} + 0.35 \times \text{Mandatory} + 0.15 \times \text{Learning} + 0.15 \times \text{Projects}$$
  5. Highlight the **Statutory Non-Hiring Guarantee Disclaimer** and self-reported learning progress disclosures.

---

### ACT VI — Verified Job Destinations (30 Seconds)
- **Navigate to:** `http://localhost:4173/jobs`
- **Narrative:**
  > *"Finally, when ready to apply, we do not scrape private job databases or invent fake openings. We generate authenticated, parameterized deep search queries directly into official platforms: SAP Official Careers (jobs.sap.com), LinkedIn Jobs, and Indeed."*
- **Action:** Show the verified deep links with embedded skill keywords and the **Zero-Fabrication Policy** disclosure.

---

## 5. Offline & Fallback Contingency Plan

If live Wi-Fi fails or the venue network blocks ports during the presentation:
1. **Fully Standalone Monorepo:** The application runs 100% locally on `localhost`. No external cloud or third-party LLM API connectivity is required during runtime.
2. **In-Memory Profile Persistence:** The backend automatically falls back to its robust in-memory repository with clear banner disclosures. All candidate reviews, project submissions, and calculations remain responsive.
3. **Pre-Seeded Alex Morgan Demo Data:** The frontend includes high-fidelity pre-seeded state for Alex Vance/Morgan, allowing all 10 platform views to render immediately with interactive data even if accessed cold.

---

## 6. Technical Innovations Checklist for Judges

| Evaluation Dimension | Hackathon Innovation |
| :--- | :--- |
| **Trust & Explainability** | Zero black-box hallucinations. Match scores and readiness indices are derived from documented, auditable mathematical formulas. |
| **Human-in-the-Loop** | Extracted competencies remain unassessed until reviewed, calibrated, or rejected by the candidate. No silent invention of proficiency or years. |
| **SAP Ecosystem Alignment** | Official SAP Learning Hub curricula, SAP Activate methodology, S/4HANA enterprise scenarios, and SAP Horizon enterprise UI design system. |
| **Portfolio-First Evidence** | Replaces passive certificate collection with hands-on enterprise projects assessed against transparent rubrics with catalogue-locked weights. |
| **Architectural Rigor** | Monorepo architecture with shared TypeScript contracts, Zod runtime validation, 51 passing automated tests, and 17 passing E2E stages. |

---

## 7. Truthful Capabilities vs Limitations (Hackathon Demo Readiness)

### Genuinely Functional in this Build
- Deterministic skill extraction from real PDF and DOCX files.
- Human review and proficiency calibration without fabricated defaults.
- Explainable career matching across 14 roles ($100 \times \frac{\sum w_i f_i}{\sum w_i}$) with strict mandatory eligibility enforcement.
- 6-group skill gap delta analysis with verified bridge hour calculations.
- Pedagogically sequenced learning pathways.
- 10 enterprise practical project workspaces with locked rubric criteria and score calculation.
- 4-dimensional readiness scorecard ($0.35 \times \text{Skill} + 0.35 \times \text{Mandatory} + 0.15 \times \text{Learning} + 0.15 \times \text{Projects}$).
- Verified query-parameterized job searches into official portals.

### What Remains Simulated / Local Limitations
- **Database Persistence:** PostgreSQL is not running on the development host; in-memory repository fallback is active. State persists for the duration of the server process.
- **Reviewer Authentication:** Independent reviewer mode is a simulated demonstration. Enterprise third-party OAuth/SAML evaluator authentication is not configured; self-assessment cannot claim independent verification.
- **LMS Integration:** Milestone progress is self-reported by the candidate in the active session. Direct SAP Learning Hub API verification is not connected.
- **Not a Production Hiring Engine:** Platform includes statutory non-hiring guarantee disclaimers to ensure ethical transparency.
