Below is the **execution of the refactored prompt**, written as a **Design Architecture Decision Record (ADR)** from the perspective of a **Principal Design Engineer** responsible for a B2B SaaS **Business & Billing domain**.

This is intentionally decisive, opinionated, and structured.

---

# Business & Billing — Design Architecture Review

**Audience:** Platform Owner / Super Admin
**Domain:** Revenue, contracts, billing operations
**Design Objective:** Clarity, safety, scalability

---

## 1. Core Framing Decision (Foundational)

### Decision

**Business & Billing must be split into two conceptual layers:**

1. **Commercial Configuration** (What we sell & how)
2. **Billing Operations** (How money moves & is tracked)

This separation is mandatory in enterprise SaaS systems to prevent:

* Cognitive overload
* Accidental high-risk actions
* Blurring of strategic vs operational responsibilities

---

## 2. Introduce “Plans” as a First-Class Module

### Decision

Create a **dedicated module: `Plans`** under Business & Billing.

> Plans are **commercial contracts**, not subscriptions.

---

### What “Plans” IS Responsible For

This page defines **what can be sold**, not who is paying.

**Included**

* Plan name (Standard, Advanced, Enterprise)
* Pricing model (flat, per-unit, tiered)
* Included limits (e.g., kiosks)
* Overage rules
* Billing frequency options
* Status (Active / Deprecated)
* Effective date
* Versioning (read-only history)

**Allowed Actions**

* Create plan
* Edit plan (forward-only)
* Deprecate plan (never delete)

---

### What “Plans” MUST NEVER Show

**Explicitly excluded**

* Hotel names
* MRR
* Invoices
* Payment methods
* Subscription status
* Usage per customer

**Reason**
Plans are **global configuration artifacts**.
Mixing customer data violates separation of concerns and creates audit risk.

---

## 3. Subscription & Invoicing Consolidation Decision

### Decision

❌ **Do NOT merge Subscriptions and Invoicing into a single page**
✅ **Group them under a common parent: `Billing Operations`**

---

### Why Full Merging Is Rejected

Subscriptions and Invoicing answer different questions:

| Area          | Question Answered                 |
| ------------- | --------------------------------- |
| Subscriptions | Who is entitled to what right now |
| Invoicing     | What money is owed or paid        |

Merging them:

* Increases cognitive load
* Obscures responsibility
* Makes error states harder to reason about

---

## 4. Final Module Structure (Authoritative)

### Business & Billing

```
Business & Billing
├── Plans                (Configuration)
├── Subscriptions        (Entitlements)
├── Invoices             (Financial execution)
└── Reports              (Financial analytics)
```

This structure scales cleanly to:

* Multiple pricing models
* Enterprise contracts
* Region-based billing
* Compliance requirements

---

## 5. Page-Level Responsibilities & Boundaries

### 5.1 Plans (Configuration Layer)

**Purpose**
Define commercial offerings.

**Supports Decisions**

* Pricing strategy
* Feature packaging
* Upsell paths

**Must Never Support**

* Revenue monitoring
* Customer support workflows

---

### 5.2 Subscriptions (Entitlement Layer)

**Purpose**
Track which customer is on which plan and in what state.

**Displayed Information**

* Customer (Hotel)
* Plan
* Subscription status (Active, Suspended, Grace)
* Payment mode (Auto / Manual)
* Next billing date
* Usage vs limits (high-level only)

**Allowed Actions**

* Pause / Resume subscription
* Upgrade / Downgrade plan
* Apply grace period

**Explicitly Excluded**

* Invoice ledger
* Payment transaction history
* Revenue aggregation

---

### 5.3 Invoices (Execution Layer)

**Purpose**
Manage monetary obligations.

**Displayed Information**

* Invoice ID
* Customer
* Amount
* Status (Paid, Pending, Overdue)
* Due date
* Aging bucket

**Allowed Actions**

* Generate invoice
* Send reminder
* Download / export
* Mark as paid (manual only)

**Must Never Show**

* Plan configuration
* Usage limits
* Subscription lifecycle controls

---

## 6. Metrics & Summary Strategy

### Decision

**Metrics only appear where they inform decisions.**

| Page          | Metrics Allowed                    |
| ------------- | ---------------------------------- |
| Plans         | None                               |
| Subscriptions | Count-based (Active, New, Churned) |
| Invoices      | Monetary + Aging                   |
| Reports       | Full financial KPIs                |

This avoids:

* Redundant dashboards
* Metric pollution
* Conflicting numbers

---

## 7. Actions, Authority & Risk Model

### High-Risk Actions (Require Guardrails)

* Editing plans
* Pausing subscriptions
* Manual invoice settlement

**Mandatory Controls**

* Confirmation dialogs
* Clear impact statements
* Audit logs
* Role-based visibility

---

## 8. Navigation & Naming Decisions

### Chosen Naming

* **Plans** (not Pricing)
* **Subscriptions** (not Customers)
* **Invoices** (not Billing)
* **Reports** (separate, read-only)

**Rejected**

* “Billing Overview”
* “Revenue”
* “Accounts”

Reason: ambiguity and overlap.

---

## 9. Enterprise Design Principles Validation

| Principle                                | Status |
| ---------------------------------------- | ------ |
| Separation of Configuration vs Execution | ✅      |
| Progressive Disclosure                   | ✅      |
| Financial Safety                         | ✅      |
| Audit Readiness                          | ✅      |
| Scalability                              | ✅      |

---

## Final Verdict

The redesigned Business & Billing section becomes:

* Predictable
* Auditable
* Scalable
* Mentally lightweight for Super Admins

Most importantly:

> **Each page answers exactly one class of question.**

That is the defining trait of mature B2B SaaS systems.

---

If you want next, I can:

* Produce a **canonical “Plans / Subscriptions / Invoices” page contract**
* Write **UX acceptance criteria** for each module
* Simulate **edge cases** (failed payments, plan deprecation)
* Align this with **enterprise billing platforms (Stripe / Chargebee mental models)**

Just tell me how deep you want to go.
