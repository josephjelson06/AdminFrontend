Below is the **execution of the refactored prompt**, written as a **Dashboard Architecture Decision Record (ADR)** from the perspective of a **Principal Design Engineer** designing the **primary Dashboard and Global Navigation** for a mature B2B SaaS platform.

This is **question-led, then decisively opinionated**, exactly as requested.

---

# Dashboard & Navigation — Design Architecture Decision Record

**Audience:** Super Admins, Platform Owners, Senior Ops
**Primary Function:** Orientation, prioritization, escalation
**Anti-goal:** Becoming a second Reports or Registry system

---

## 0. Design Questions (Asked First, Answered Explicitly)

### Q1. What is the dashboard’s true intent?

**Answer:**
The dashboard is an **orientation layer**, not a workspace.

It must answer, within **30 seconds**:

* Is the system healthy?
* Where is attention required?
* What should I open next?

It is **not** for:

* Detailed investigation
* Evidence extraction
* Configuration

---

### Q2. Is this dashboard strategic, operational, diagnostic—or hybrid?

**Answer:**
It is a **diagnostic + directional hybrid**.

* Diagnostic → surface anomalies, deltas, trends
* Directional → point users to the correct module

It is **not strategic** (long-term planning) and **not operational** (day-to-day execution).

---

### Q3. What decisions must be possible without leaving the dashboard?

**Answer:**
Only *routing decisions*:

* “Go to Reports”
* “Go to Hotels”
* “Go to Invoices”
* “This needs attention now”

No irreversible or high-risk actions belong here.

---

## 1. Foundational Dashboard Framing (Non-Negotiable)

### Decision

The dashboard is a **signal amplifier**, not a data store.

> If a widget answers “what exactly happened,” it does not belong here.

---

## 2. KPI & Card Strategy

### Decision

KPI cards exist solely to communicate **state + direction**, never detail.

### KPI Eligibility Rule

A metric qualifies as a dashboard KPI **only if**:

1. It can be understood in <3 seconds
2. It benefits from trend comparison
3. It signals health, risk, or opportunity

---

### KPI Types Allowed

**Allowed**

* Total Check-ins (with delta)
* Active / Deployed Assets
* Adoption Rates
* Failure / Exception Counts
* Coverage metrics

**Explicitly Excluded**

* Per-entity metrics
* Financial totals
* Usage breakdowns
* Counts without context

---

### KPI Quantity Decision

**Hard cap: 4–6 cards**

More than this:

* Reduces scannability
* Forces comparison where none is needed
* Dilutes urgency

---

## 3. Temporal Awareness (Validated Hypothesis)

### Decision

Temporal context is **mandatory**, but must be **centralized and controlled**.

---

### Global Time Control (Chosen)

* One **global time selector** at the dashboard level
* Affects all widgets consistently
* Supports:

  * Preset ranges (7d, 30d, 90d)
  * Previous-period comparison (implicit)

---

### Explicit Rejections

❌ Per-widget date pickers
❌ Mixed time contexts on the same screen

**Reason:**
They destroy mental consistency and invalidate comparisons.

---

## 4. Charts & Visual Components

### Decision

Charts are **trend detectors**, not analysis tools.

**Allowed**

* Time-series trends
* Aggregated comparisons
* Distribution overviews

**Excluded**

* Tables
* Row-level data
* Multi-dimensional filters

---

### Interaction Rule

Every chart must support **exactly one** of the following:

* Hover → context
* Click → escalation

Never both simultaneously.

---

## 5. Drill-Down & Escalation Model

### Decision

Dashboard widgets **never deepen**—they **redirect**.

---

### Canonical Escalation Paths

| Widget Type    | Escalates To             |
| -------------- | ------------------------ |
| KPI Card       | Registry / Report        |
| Trend Chart    | Report (pre-filtered)    |
| Coverage / Map | Registry or Usage Report |

---

### Explicit Rejection

❌ Expanding panels
❌ Embedded detail tables
❌ Modal-based analysis

**Reason:**
These trap users in shallow exploration.

---

## 6. Information Density & Cognitive Load

### First-Load Rule

On initial load, the dashboard must:

* Fit within one scroll
* Surface no more than 10 distinct data elements
* Avoid visual competition between widgets

---

### Empty / Low-Activity States

Empty states should:

* Explain *why* there’s no data
* Suggest *where to go next*
* Never appear broken or blank

---

## 7. Global Navigation & Resizable Sidebar

### Decision

The sidebar is a **mode-switching tool**, not a sitemap.

---

### Sidebar Behavior Model (Chosen)

#### Expanded Mode

* Icon + label
* Section headers
* Used by new or infrequent users

#### Collapsed Mode

* Icons only
* Tooltips on hover
* Optimized for power users

---

### Persistence Decision

* Sidebar state is **persisted per user**
* Resizing is deliberate, not responsive-only

---

### Role-Based Visibility

* Modules appear based on role
* Density (not access) is adjustable

---

### Explicit Rejections

❌ Auto-collapse on resize
❌ Icon-only by default
❌ Dynamic menu reordering

---

## 8. What Must NEVER Appear on the Dashboard

Explicit exclusions:

* Export buttons
* CRUD actions
* Configuration controls
* Audit logs
* Raw tables
* Multi-step workflows

These violate the dashboard’s purpose.

---

## 9. Dashboard Inclusion Summary

### Included

* System health indicators
* Adoption and usage signals
* Temporal trends
* Escalation affordances

### Excluded

* Evidence
* Configuration
* Transactions
* Decisions with consequences

---

## 10. Enterprise Design Principles Validation

| Principle                  | Status |
| -------------------------- | ------ |
| Orientation over execution | ✅      |
| Temporal consistency       | ✅      |
| Progressive disclosure     | ✅      |
| Cognitive load control     | ✅      |
| Scalability                | ✅      |

---

## Final Verdict

The dashboard becomes:

* A **compass**, not a control panel
* A **signal board**, not a spreadsheet
* A **starting point**, not a destination

The global navigation reinforces this by:

* Adapting to user maturity
* Staying predictable
* Never competing with content

> **A great dashboard doesn’t answer questions.
> It tells you which questions to ask next.**

---

If you want next, I can:

* Define **dashboard KPI eligibility rules** as a checklist
* Stress-test this dashboard against edge cases
* Create a **navigation behavior spec** for engineering
* Align this with your design system tokens

Tell me the next section you want to refactor.
