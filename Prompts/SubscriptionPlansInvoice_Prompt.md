Below is a **clean, elite-level refactoring** of your prompt, written exactly the way a **Principal Design Engineer / Staff Product Designer** would frame it for **strategic UX, IA, and product decisions** in a B2B SaaS finance domain.

This version is optimized to extract **high-quality architectural decisions**, not surface-level UI feedback.

---

## Refactored Prompt — Business & Billing Section

**Role: Elite Design Engineer**

---

I am redesigning the **Business & Billing section** of a **B2B SaaS Super Admin / Platform Owner dashboard**.
This section currently includes **Subscriptions**, **Invoicing**, and hotel-level billing views, but it lacks a clear conceptual separation between **plans, billing operations, and financial oversight**.

### Context

* Audience: Internal Platform Owner / Super Admin
* Responsibility Level: High-risk financial and contractual control
* Usage Pattern:

  * Strategic (monitor revenue, growth, churn)
  * Operational (generate invoices, manage payment failures)
  * Administrative (define plans, pricing, and billing rules)

### Goal

Refactor the **Business & Billing information architecture** to:

* Reduce cognitive overload
* Clearly separate *configuration* vs *operations*
* Align with enterprise SaaS billing standards
* Create reusable, scalable patterns as the platform grows

---

## Core Design Decisions to Be Evaluated

### 1. Subscription Plans as a First-Class Entity

Introduce a **dedicated page/module called “Plans”**.

Please evaluate and recommend:

* Whether “Plans” should live as:

  * A standalone top-level item under Business & Billing, or
  * A sub-module within Subscriptions
* What information belongs **exclusively** in Plans vs what must not

**Explicitly decide:**

* What is included
* What is intentionally excluded
* Why those decisions were made

---

### 2. Consolidation of Subscriptions & Invoicing

Evaluate the proposal to **combine Subscriptions and Invoicing into a single conceptual category or page**.

Your task is to:

* Decide whether they should be:

  * Fully merged
  * Partially merged under a common parent
  * Remain separate but tightly linked
* Define the mental model this creates for Super Admin users

**Important:**
Do not default to “keep both.” Make **primary decisions** and justify them.

---

### 3. Page Responsibilities & Boundaries

For each resulting page/module, clearly define:

#### a. What the page is responsible for

#### b. What it must never show

#### c. What level of decision-making it supports

Avoid references to other pages or prior examples.
Treat this as a **clean-slate architectural decision**.

---

### 4. Information Display Strategy

For each proposed page (e.g., Plans, Subscriptions, Billing/Invoices), specify:

* Key metrics or summaries (if any)
* Operational tables vs overview cards
* Drill-down vs inline detail
* What is configurable vs read-only

Focus on **clarity of intent**, not visual styling.

---

### 5. Actions, Authority & Risk

Evaluate and recommend:

* Which actions are allowed per page (e.g., create plan, pause billing, generate invoice)
* Which actions are:

  * High-risk
  * Irreversible
  * Audit-critical
* How action placement should reflect authority and risk

---

### 6. Navigation & Taxonomy

Recommend a **final navigation structure** for the Business & Billing section:

* Naming conventions
* Grouping logic
* Ordering
* What becomes top-level vs secondary

---

### 7. Enterprise Design Principles Validation

Validate your recommendations against:

* Separation of configuration vs execution
* Progressive disclosure
* Financial safety and auditability
* Scalability to multiple pricing models, currencies, and billing rules

---

## Output Expectations

* Make **clear design decisions**
* Explicitly state **what is chosen and what is rejected**
* Provide **reasoned justifications**, not alternatives
* No UI mockups
* No code
* No implementation steps

The output should read like a **design architecture decision record (ADR)** for a mature B2B SaaS platform.

---

If needed next, I can:

* Convert this into a **Business & Billing IA diagram**
* Define **canonical page contracts** for Finance modules
* Help create **UX acceptance criteria** for engineering
* Align this with **SOC2 / audit-readiness patterns**

Just let me know.
