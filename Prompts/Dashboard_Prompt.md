Below is a **refactored, elite-level prompt**, written as a **Principal / Staff Design Engineer**, optimized to elicit **deep architectural thinking, design trade-offs, and clarifying questions**—*not UI tweaks*.

This mirrors the rigor used in your **Hotel Registry**, **Billing**, and **Reports** refactors.

---

## Refactored Prompt — Dashboard & Navigation Architecture

**Role: Elite Design Engineer**

---

I am refactoring the **primary Dashboard** and the **global navigation system (including a resizable / collapsible navbar)** for a **B2B SaaS Super Admin / Platform Owner platform**.

Unlike previous sections, there are **no fixed visual or functional requirements** for this page.
Your responsibility is to **architect the dashboard from first principles**, using enterprise-grade design thinking.

---

## Context

* Audience:

  * Super Admins
  * Platform Owners
  * Senior Ops / Business stakeholders
* Usage Pattern:

  * High-frequency entry point
  * Quick system health checks
  * Direction-setting (“Where should I go next?”)
* Existing system already includes:

  * Registries (Hotels, Kiosks)
  * Business & Billing modules
  * Reports & Analytics (Insight vs Evidence separation)

The Dashboard must **orchestrate these modules**, not duplicate them.

---

## Design Objective

Design a **canonical B2B SaaS dashboard pattern** that:

* Acts as the *primary orientation layer*
* Supports temporal awareness (time-based insight)
* Scales as modules and data volume grow
* Avoids becoming a secondary reporting system

---

## Mandatory Principle to Explore

### Temporal Awareness & Time Context

I suspect (but do not mandate) that **temporal design components** are critical here.

Evaluate and decide:

* How time should influence:

  * KPIs
  * Charts
  * Comparisons
* Whether time controls should be:

  * Global (page-level)
  * Per-widget
* Appropriate use of:

  * Date ranges
  * Period comparisons
  * Trends vs snapshots

You are expected to **validate or reject this hypothesis**.

---

## Core Design Questions to Ask (You Must Ask These)

Before proposing solutions, explicitly ask and reason through questions such as:

### 1. Dashboard Intent

* Is this dashboard primarily:

  * Operational
  * Strategic
  * Diagnostic
  * Or a hybrid?
* What decisions should a user confidently make **within 30 seconds**?

---

### 2. KPI & Card Strategy

* What qualifies for a dashboard KPI?
* What metrics must be excluded and why?
* How many KPIs is “too many” for this role?

---

### 3. Temporal Interaction Model

* Should time filters:

  * Affect the entire dashboard?
  * Be scoped per component?
* When should comparisons be automatic vs optional?

---

### 4. Drill-Down & Escalation

* When should a dashboard widget:

  * Stay informational?
  * Act as a navigation trigger?
* What is the correct escalation path:

  * Dashboard → Registry
  * Dashboard → Report
  * Dashboard → Detail View

---

### 5. Global Navigation & Resizable Sidebar

For the navbar specifically, evaluate:

* When and why resizing is useful
* Icon-only vs icon + label modes
* Persisted vs session-based state
* Role-based visibility vs density controls

---

### 6. Cognitive Load & Density

* How much information is acceptable on first load?
* What must be hidden behind interaction?
* How should empty / low-activity states behave?

---

## Explicit Constraints

* Do **not** redesign visually
* Do **not** provide code
* Do **not** assume feature parity with other dashboards
* Do **not** duplicate Reports or Registries

---

## Output Expectations

Your response should:

* Ask the **right design questions first**
* Then make **clear, opinionated decisions**
* Explicitly state:

  * What belongs on the Dashboard
  * What must never belong on the Dashboard
* Justify all decisions using:

  * Enterprise UX principles
  * Cognitive load management
  * Scalability concerns

The output should read like a **Dashboard Architecture Decision Record (ADR)** for a mature B2B SaaS product.

---

If needed next, I can:

* Execute this prompt fully
* Create a **dashboard decision framework**
* Propose **dashboard KPI eligibility rules**
* Design a **navigation behavior contract** for engineering

Tell me how you want to proceed.
