# ShelfSense AI — Predict. Prevent. Redistribute.
## Autonomous Inventory Intelligence & Surplus Redistribution Agent

ShelfSense AI is a security-first, agentic inventory intelligence and surplus redistribution platform designed for university canteens, hostel dining halls, and institutional food service providers. It combines deterministic food safety and expiry math with Gemini-powered reasoning to forecast waste risk, formulate mitigation plans, enforce human approval gates, and coordinate verified donations or kitchen repurposing.

---

## User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural parameters have been established based on your clarifying input and hackathon evaluation criteria:

- **Confirmed Operational Profile**: University canteen and campus hostel mess (high batch perishables like dairy, produce, prepared grains, meal service surges, weekend attendance drops).
- **Confirmed Surplus Handling Strategy**: Dual-channel execution combining verified local NGO/food bank redistribution and internal kitchen recipe repurposing (e.g. batch stocks, daily special stews, chilled prep).
- **Confirmed Data Initialization**: Preloaded realistic campus canteen inventory scenarios with an instant one-click reset/seed capability to ensure consistent, reliable competition demonstrations.
- **Safety Boundary**: Deterministic guardrails strictly govern consumption safety logic, expiry timestamps, and tool execution; Gemini handles structured multi-step reasoning, contextual risk explanation, and recommendation planning without direct autonomous database mutation.

---

## 1. Problem Analysis, Selected Features & MVP Scope

### 1.1 Problem Analysis
Campus canteens and hostel messes operate on rigid daily meal schedules with volatile student turnout (affected by exams, weekends, holidays) and highly perishable ingredients (fresh vegetables, paneer/tofu, milk, bread, prepared bulk bases). Traditional spreadsheet logging leads to:
1. **Blind Expiry Accumulation**: First-In-First-Out (FIFO) failures where items spoil in the back of cold rooms before kitchen staff notice.
2. **Suboptimal Crisis Reaction**: When surpluses occur, managers either discard food due to lack of coordination time or engage in ad-hoc, unrecorded giveaways.
3. **Absence of Verifiable Auditability**: No structured tracking of safety parameters, temperature zones, cost impacts, or waste avoided.

### 1.2 The 6 Selected Core Features & Concrete Value

| Feature ID & Title | Core Mechanism | Real-World Value |
| :--- | :--- | :--- |
| **F1: Intelligent Inventory Risk Analysis** | Tracks batch inventory with shelf-life clock, storage zones (ambient, refrigerated, deep chill), days-to-expiry, and deterministic risk score (Nominal, Moderate, Critical, Expired). Explains risk drivers. | Prevents silent spoilage and guarantees zero consumption past safety cutoff dates. |
| **F2: Demand & Surplus Forecasting** | Evaluates historical meal demand trends vs. current stock velocity and calendar events (e.g., weekend hostel exodus) using deterministic consumption models with labeled confidence. | Flags impending surplus 24–48 hours in advance rather than post-prep crisis. |
| **F3: Agentic Action Planner (Human-in-the-Loop)** | Multi-phase agent collects inventory telemetry, diagnoses risk, selects eligible tools, generates an actionable mitigation plan, and pauses at an explicit Human Approval Gate. | Replaces manual decision fatigue with verified, policy-compliant action recommendations. |
| **F4: Dual-Channel Redistribution Coordinator** | Evaluates surplus against verified local NGO recipient directory (capacity, pickup window, cold chain specs) or internal kitchen repurpose recipes (curry base, bakery croutons). | Coordinates immediate handover slips or kitchen production orders with zero food discarded. |
| **F5: Security-First Audit Trail & Action History** | Immutable audit log recording trigger events, AI rationale, assumptions, user approvals/rejections, and timestamped execution receipts. | Complete transparency, anti-tampering, and verifiable efficiency tracking for compliance. |
| **F6: Measurable Waste, Cost & ESG Intelligence** | Real-time calculations of financial value at risk, food weight saved (kg), meals provided, and carbon footprint avoided ($\text{kg CO}_2\text{e}$). | Delivers quantifiable efficiency metrics for hackathon judges and operational reporting. |

### 1.3 MVP Scope vs. Explicit Exclusions

- **In Scope (MVP)**:
  - Complete inventory lifecycle (create, update, filter, remove, batch reset).
  - Deterministic expiry engine running transparent mathematical risk formulas.
  - Multi-step Agentic Planner integrating Gemini API via server proxy for reasoning, schema validation, and tool formulation.
  - Interactive Human Approval modal with full parameter inspection and editability.
  - Simulated NGO directory with realistic operational constraints (distance, accepting categories, cold chain capability).
  - Simulated kitchen batch transformation recipes.
  - Downloadable/printable Redistribution Dispatch Slips with verification QR codes.
  - Comprehensive unit test suite (`tsx --test`) verifying calculation math and security invariants.
- **Explicit Exclusions (Post-Hackathon)**:
  - Live GPS tracking of transport logistics vehicles.
  - Direct ERP/SAP accounting connector integrations.
  - Unsupervised autonomous tool execution without human authorization.

---

## 2. User Journey: From Inventory Intake to Approved Outcome

```
[1. Intake / Monitor] 
Manager reviews preloaded canteen inventory; filters by 'Approaching Expiry'.
         │
         ▼
[2. Autonomous Evaluation]
System runs deterministic risk calculation; identifies 18 kg Paneer & 25 L Milk expiring in 36h.
Demand forecast flags a 60% student drop-off due to upcoming weekend.
         │
         ▼
[3. Agent Activation]
User triggers "Run Agentic Analysis". 
Gemini Agent reasons over stock velocity, storage constraints, and NGO directory.
Agent generates a structured Two-Prong Plan:
  • Action A: Dispatch 15 L Milk to 'Sneha Care Children's Home' (pickup in 3h).
  • Action B: Repurpose 18 kg Paneer into frozen canteen meal prep batches.
         │
         ▼
[4. Human Approval Gate]
UI renders interactive Approval Modal displaying rationale, recipient details, and cost metrics.
Manager modifies quantity from 15 L to 14 L and clicks "Approve & Execute Plan".
         │
         ▼
[5. Tool Execution & Audit Commit]
Agentic executor runs registered tool handlers:
  • `reserve_for_redistribution(orgId, qty, window)`
  • `commit_kitchen_repurpose(recipeId, qty)`
  • Updates inventory balances instantly.
  • Emits signed record into Immutable Audit Trail.
         │
         ▼
[6. Realized Outcome & Verification]
System generates printable Dispatch Slip; updates ESG Dashboard with +28 Meals Saved and $64 Value Preserved.
```

---

## 3. System Architecture & Data Flow

```
┌──────────────────────────────────────────────────────────────────────────┐
│                             CLIENT LAYER                                 │
│  React 19 + Tailwind CSS + Lucide + Plus Jakarta Sans + Monospace Data  │
│  ┌────────────────────┐ ┌────────────────────┐ ┌──────────────────────┐  │
│  │ Inventory Console  │ │ Risk & Forecasting │ │ Agent Action Center  │  │
│  └─────────┬──────────┘ └─────────┬──────────┘ └──────────┬───────────┘  │
│            │                      │                       │              │
│            ▼                      ▼                       ▼              │
│  ┌──────────────────────────────────────────────────────────────────┐    │
│  │     Client Orchestrator (State Store & Deterministic Rules)     │    │
│  │  • Expiry formula calculation • Input validation (Zod-like)      │    │
│  │  • Human Approval Dialog      • Audit Log State Cache            │    │
│  └────────────────────────────────┬─────────────────────────────────┘    │
└───────────────────────────────────┼──────────────────────────────────────┘
                                    │ Safe REST Request (Zero client keys)
                                    ▼
┌──────────────────────────────────────────────────────────────────────────┐
│                       FULL-STACK SERVER RUNTIME                          │
│               Express / Node.js Server Proxy (`/api/*`)                  │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │ Security Gateway & Rate Limiter                                    │  │
│  │  • Strict JSON Schema Validation                                  │  │
│  │  • Prompt Injection Sanitization & Tool Whitelist Enforcer         │  │
│  └─────────────────────────────────┬──────────────────────────────────┘  │
│                                    │                                     │
│                                    ▼                                     │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │ Agentic AI Orchestrator                                            │  │
│  │  • Model: Google GenAI SDK (`gemini-2.5-flash`)                   │  │
│  │  • System Prompt: Institutional Safety & Anti-Hallucination Policy │  │
│  │  • Structured Schema Output: Action Proposal Array                 │  │
│  │  • Deterministic Tool Engine: `tools/inventoryTools.ts`            │  │
│  └─────────────────────────────────┬──────────────────────────────────┘  │
│                                    │                                     │
│                                    ▼                                     │
│  ┌────────────────────────────────────────────────────────────────────┐  │
│  │ Data & Persistence Layer                                           │  │
│  │  • Local Persistent Store with Canteen Seed Profile               │  │
│  │  • Immutable Append-Only Audit Trail Ledger                        │  │
│  └────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 4. Proposed Data Model

```typescript
// Core Inventory Item
export interface InventoryItem {
  id: string;
  name: string;
  category: 'dairy' | 'produce' | 'bakery' | 'grains' | 'prepared_meals' | 'proteins';
  quantity: number;
  unit: 'kg' | 'liters' | 'units' | 'portions';
  unitCost: number; // in USD or standard currency
  purchaseDate: string; // ISO8601
  expiryDate: string; // ISO8601
  storageCondition: 'ambient' | 'refrigerated' | 'frozen';
  batchNumber: string;
  location: string; // e.g. "Cold Room A - Rack 2"
  status: 'available' | 'reserved_donation' | 'repurposed' | 'depleted';
}

// Deterministic Risk Assessment
export interface RiskAssessment {
  itemId: string;
  daysRemaining: number;
  hoursRemaining: number;
  riskTier: 'nominal' | 'moderate' | 'critical' | 'expired';
  riskScore: number; // 0 (safe) to 100 (expired)
  deterministicReason: string;
  recommendedTimeWindowHours: number;
}

// Redistribution Partner (NGO / Food Bank)
export interface RecipientOrg {
  id: string;
  name: string;
  type: 'orphanage' | 'food_bank' | 'community_shelter' | 'animal_welfare';
  distanceKm: number;
  contactPerson: string;
  phone: string;
  acceptedCategories: InventoryItem['category'][];
  hasColdChain: boolean;
  maxDailyCapacityKg: number;
  operatingHours: string;
  isVerified: boolean;
}

// Kitchen Repurposing Recipe
export interface RepurposeRecipe {
  id: string;
  targetDishName: string;
  primaryIngredientCategory: InventoryItem['category'];
  yieldPortionsPerUnit: number;
  extendedShelfLifeDays: number;
  instructions: string;
}

// Agent Proposed Action (Subject to Human Approval)
export interface ProposedAction {
  id: string;
  actionType: 'ngo_donation' | 'kitchen_repurpose' | 'markdown_clearance' | 'quarantine_spoilage';
  targetItemId: string;
  itemName: string;
  quantity: number;
  unit: string;
  recipientOrgId?: string;
  recipientOrgName?: string;
  recipeId?: string;
  recipeName?: string;
  urgency: 'high' | 'medium' | 'low';
  rationale: string;
  assumptions: string[];
  expectedImpact: {
    wasteAvoidedKg: number;
    costPreserved: number;
    mealsGenerated: number;
  };
  approvalStatus: 'pending' | 'approved' | 'rejected' | 'modified';
}

// Immutable Audit Log Event
export interface AuditRecord {
  id: string;
  timestamp: string;
  actionId: string;
  actionType: string;
  details: string;
  performedBy: string; // "Agent (Proposed)" | "Manager (Approved)" | "System Executor"
  previousState: any;
  newState: any;
  metricsEffect: {
    wasteAvoidedKg: number;
    costPreserved: number;
  };
  verificationHash: string; // SHA256-like integrity digest
}
```

---

## 5. Security & Human Approval Strategy

1. **Strict Human-in-the-Loop (HITL) Gate**:
   - The AI agent is strictly an **advisory planner**, never an unsupervised executor.
   - Any state-mutating action (reducing inventory, dispatching donation shipments, logging kitchen conversions) is presented in an explicit **Inspection & Approval Modal**.
   - The user can approve, reject, or adjust quantities before execution.
2. **Zero Client-Side Secrets**:
   - All AI interactions run through the application's `/api/agent/plan` endpoint.
   - `GEMINI_API_KEY` is read strictly from `process.env` in server memory and never passed to the browser bundle.
3. **Restricted Deterministic Tool Sandbox**:
   - The AI planner does not execute arbitrary code or shell commands. It outputs structured JSON conforming to a strict schema of known tool IDs (`donate_stock`, `repurpose_stock`, `flag_spoilage`).
   - Server-side and client-side validators confirm that requested quantities do not exceed available on-hand stock and that recipient organizations actually exist in the verified registry.
4. **Idempotency & Replay Prevention**:
   - Every proposed action receives a cryptographically random UUID. Executed actions are marked with an immutable timestamp to prevent duplicate clicks or concurrent double-redistribution.

---

## 6. Google Technologies Strategy & Graceful Fallbacks

| Technology | Role in ShelfSense AI | Technical Rationale |
| :--- | :--- | :--- |
| **Google GenAI SDK (`@google/genai`)** | Powers the core agentic reasoning engine, dynamic scenario diagnosis, and action plan synthesis. | Industry-leading speed, schema adherence (`responseSchema`), and reasoning capability on `gemini-2.5-flash`. |
| **Server-Side API Proxy** | Node/Express backend proxying AI requests securely. | Protects `GEMINI_API_KEY` from client inspection and enforces rate limiting and payload validation. |
| **Graceful Deterministic Fallback** | Local heuristic decision tree when API key is missing or offline. | If `GEMINI_API_KEY` is not configured, the system seamlessly transitions to a transparent, rule-based algorithmic heuristic engine with an explicit UI notification tag: *"Running in Deterministic Heuristic Mode"*. The app never crashes or hangs. |

---

## 7. User Experience & Visual Design Specification

In accordance with the **Universal Frontend Design Constitution** and **SaaS Dashboard Design Guidelines**:

- **Visual Tone & Theme**: Clean, utilitarian sustainability palette:
  - Canvas: Pristine light slate (`#F8FAFC`) with deep slate text (`#0F172A`).
  - Brand Accent: Deep Forest Spruce (`#0F766E` / `#047857`) conveying safety and sustainability, paired with crisp Amber (`#D97706`) and Coral Red (`#DC2626`) for risk signaling.
  - Zero AI-slop: No generic glowing purple gradients, no fake circular scorecards, no decorative animated pulse dots.
- **Top Bar Contract**:
  - Zone 1: Wordmark: `ShelfSense AI` (display font in bold slate, with quiet category subtext `Campus Food Intelligence`).
  - Zone 2: Navigation tabs: `Inventory`, `Risk & Forecast`, `Agent Planner`, `Redistributions`, `Audit & ESG`.
  - Zone 3: Primary CTA: `+ Log Stock Item` and `Run Agent Analysis`.
- **Zero-Pill Metadata**: Metadata uses subtle typographic separators (e.g. `Batch #B-204 · Cold Room A · 36h Remaining`).
- **Tabular Figures**: All weights, shelf-life hours, currency values, and counts rendered with `font-mono tabular-nums`.
- **State Completeness**: Includes populated demo state, empty states, search filtering, action execution toasts, and responsive layout scaling from desktop (1440px) to mobile (390px).

---

## 8. Practical Testing & Verification Plan

### 8.1 Fast-Feedback Unit Tests (`node:test` via `tsx --test`)
- `tests/risk_calculator.test.ts`: Tests deterministic shelf-life calculation, boundary hours, risk tier categorizations (Critical under 24h, Moderate under 72h, Nominal over 72h).
- `tests/inventory_guardrails.test.ts`: Verifies that stock reductions cannot exceed on-hand balances, negative quantities are rejected, and expired items cannot be scheduled for human consumption.
- `tests/agent_tool_validator.test.ts`: Verifies JSON schema validation for agent actions, rejection of unknown tool names, and idempotency key checks.

### 8.2 End-to-End Browser Journey Verification (Playwright CLI / Ultra Mode)
1. **Journey 1: Inventory Intake & Risk Filtering**: User filters stock by 'Critical Risk', inspects item telemetry, and sorts by days remaining.
2. **Journey 2: Agent Action Planning & HITL Approval**: User triggers "Run Agentic Analysis", inspects proposed redistribution plan, edits quantity, approves the action, and observes immediate stock deduction.
3. **Journey 3: Redistribution & Audit Verification**: User navigates to Redistributions tab, reviews generated Dispatch Slip with recipient details, checks Audit Trail for signed log entry, and verifies ESG metric updates.

---

## 9. Alignment with Competition Evaluation Criteria

| Competition Criterion | How ShelfSense AI Exceeds the Standard |
| :--- | :--- |
| **1. Security** | Zero client-side API keys, strict Human-in-the-Loop authorization gate, deterministic schema validation, anti-replay token guards, and immutable audit logs. |
| **2. Efficiency** | Deterministic calculations run in sub-millisecond client time; Gemini calls are cached and batched; tangible ESG metrics display exact kg of waste avoided and meal servings preserved. |
| **3. Technology Implemented** | Full-stack TypeScript architecture, Google GenAI SDK with structured schema generation, pure logic unit test suite, and resilient local storage state engine. |
| **4. Performance** | Zero UI layout jitter via tabular numerals, snappy response times, comprehensive empty/loading/error states, and offline deterministic fallback. |
| **5. Google Technology Used** | First-class integration of Google GenAI SDK (`gemini-2.5-flash`), with architectural design ready for Firebase/Cloud Run deployment. |

---

## 10. Implementation Sequence

1. **Step 1: Testable Core Rules & Logic Engine** — Build pure mathematical risk calculator, demand estimator, and tool schema validator with complete unit tests in `src/utils/`.
2. **Step 2: Server API & Gemini Agentic Integration** — Set up Express backend endpoints with Google GenAI SDK structured outputs and graceful deterministic fallback.
3. **Step 3: State Management & Seed Datasets** — Create persistent store loaded with realistic campus canteen stock (milk, paneer, veggies, bread, lentils) and verified local NGO partners.
4. **Step 4: High-Fidelity UI Views & Components** — Build top bar, inventory table with zero-pill metadata, forecast charts, Agent Action Center with approval modal, and Dispatch Slip generator.
5. **Step 5: Automated Verification & Ultra Mode Browser Checks** — Run `tsx --test`, check compilation, restart server, inspect live journeys via browser snapshots, critique visual hierarchy, and eliminate any defects.
