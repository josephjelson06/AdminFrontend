Here is a **clean, elite-level refactored prompt**, written the way a **Senior / Principal Design Engineer** would frame it for maximum clarity, scope control, and actionable feedback.

You can use this prompt to get **high-quality UX, IA, and product-level critique** from designers, PMs, or AI systems.

---

## Refactored Prompt (Elite Design Engineer Version)

I am designing a **Hotel Registry page** within a **Platform Owner / Super Admin dashboard** for a B2B SaaS product.
This page is intended to function as the **authoritative registry of all onboarded hotels**, not as a finance or analytics view.

### Context

* Audience: Internal Platform Owner / Super Admin users
* Primary Jobs-to-be-Done:

  * Discover and identify hotels quickly
  * Access essential contact and operational metadata
  * Perform administrative and support actions (including impersonation)
  * Monitor lifecycle status (active, pending, suspended, expired)

### Request

Please **critically evaluate this page from a UX, IA, and enterprise-design perspective** and propose **modifications, removals, and improvements** aligned with best-in-class B2B admin standards.

### Specifically, assess and provide recommendations on:

---

### 1. Information Architecture & Data Relevance

* What information currently shown **does not belong** in a “Hotel Registry” and should be moved to:

  * Finance
  * Subscriptions
  * Reports
* What **essential metadata** is missing for a registry-style view
* How to balance **data density vs clarity** for a Super Admin audience

---

### 2. Contact & Location Enhancements

Evaluate the inclusion of:

* **Email** (click-to-compose)
* **Phone** (click-to-dial)
* **Physical location** (click-to-open Google Maps)

Consider:

* Inline vs expandable display
* Iconography vs text
* Accessibility and discoverability

---

### 3. Filtering, Search & Discoverability

* Improvements to the existing search
* Addition of **calendar-based filters** (e.g., onboarding date, contract renewal)
* Status, plan, and location-based filtering
* Saved filters or presets (if applicable)

---

### 4. Actions & Privileged Operations

* Replace the current **“View”** action with a more appropriate **Admin-level action model**
* Evaluate the UX and safety of:

  * “Login as Hotel Admin / Manager” (impersonation)
* Recommendations for:

  * Placement (primary vs overflow menu)
  * Confirmation, audit logging, and visual warnings
  * Role-based visibility

---

### 5. Page-Level Actions & Ambiguity

* Assess whether **“Quick Add”** and **“Onboard Hotel”** are redundant or confusing
* Recommend:

  * Merging, renaming, or differentiating them
  * Clear mental models for each action

---

### 6. Table Design & Interaction Patterns

* Pagination vs infinite scroll (and why)
* Column prioritization and ordering
* Sticky headers, column resizing, and row density
* Bulk actions (if applicable)
* Empty, loading, and error states

---

### 7. Navigation & Progressive Disclosure

* Whether this page should remain a flat registry or support:

  * Drill-down to hotel detail pages
  * Secondary panels or drawers
* Use of breadcrumbs or contextual navigation (if needed)

---

### 8. Design Principles Validation

Evaluate the page against:

* Progressive disclosure
* Action-first design
* Exception-based highlighting
* Enterprise usability standards

---

### Output Expectation

The response should focus on:

* **Design reasoning**
* **UX trade-offs**
* **Structural recommendations**

Do **not** provide code.
Do **not** redesign visually.
Focus on **what to change and why**, not how to implement.

---

If you want, I can also:

* Convert this into a **design review checklist**
* Create a **before/after UX comparison**
* Map recommendations to **design system components**
* Help define a **canonical “Registry Page” pattern** for reuse

Just tell me.
