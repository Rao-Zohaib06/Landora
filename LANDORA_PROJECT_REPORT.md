# Landora – Real Estate Management System

## 1. Introduction
Landora is a modern, full‑stack Real Estate Management System designed to streamline day‑to‑day operations for property businesses. It centralizes projects, plots, listings, leads, agent activities, commissions, installments, ledgers, payments, and documents, while providing a clean, role‑aware interface for Admins, Agents, and End‑Users. The system targets operational efficiency, data integrity, and decision enablement through accurate records, meaningful reports, and secure role‑based access.

## 2. Problem Statement
Real estate operations typically suffer from fragmented records (spreadsheets, messaging apps, paper forms), manual calculations (commissions, installments), delayed updates, and limited visibility across teams. This fragmentation leads to mistakes, slow response times, compliance risks, and lost opportunities. Landora addresses these issues by offering a single system of record with governed workflows, automated calculations, robust access control, and an extensible API surface.

## 3. Objectives
- Provide a unified platform for projects, plots, listings, leads, commissions, installments, and financial ledgers.
- Enforce role‑based permissions for Admin, Agent, and User personas.
- Automate recurring calculations (commissions, installment schedules, ledger postings) with auditability.
- Improve data accuracy via validation, standardized forms, and guided flows (e.g., agent approvals).
- Enable timely decision‑making with dashboards, filters, and exportable reports.
- Offer scalable, API‑driven architecture that can integrate with external CRMs, payment gateways, and storage services.

## 4. Technologies Used
- Frontend: Next.js (App Router), TypeScript, Tailwind CSS, shadcn/ui, lucide‑react, React Context for auth/session; form validation helpers and animated UI components for UX.
- Backend: Node.js (Express), RESTful APIs organized by controllers (projects, plots, listings, leads, commissions, installments, ledger, bank accounts, notifications, reports, file import/export).
- Database: MongoDB with Mongoose (document‑oriented design, references between business entities). 
- Tooling & DevOps: Postman Collection for API testing, environment‑based configuration, static asset handling and upload endpoints.

## 5. System Architecture (Roles & Boundaries)
- Presentation Layer (Next.js): 
  - Admin, Agent, and User views with shared components (forms, tables, cards, loaders) and guarded routes (middleware) based on role and session state.
- API Layer (Express):
  - Controllers expose CRUD and workflow endpoints: projects, listings, agent approvals, commissions, installments, ledgers, payments, files, and notifications.
- Data Layer (MongoDB):
  - Schemas for core entities with references and indexes for lookups (e.g., projects→plots→listings, users→agents→leads).
- Roles:
  - Admin: system oversight, master data (projects/plots/listings), user/agent management, approvals, financials, and reporting.
  - Agent: lead handling, listing creation requests (subject to rules), commissions tracking, own ledger visibility, and document uploads.
  - User: discovery of properties/projects, calculators, inquiry/contact, and saved items.

## 6. Module Breakdown
### 6.1 Admin Module
- User & Agent Management: create users, approve agents, assign roles, deactivate/reactivate.
- Project & Plot Management: define projects (location, pricing, images), manage plots and availability status.
- Listings & Inventory: create/edit listings, attach media, set pricing and metadata.
- Lead Management: assign leads, set statuses, track conversions and notes.
- Commissions: configure commission rules, calculate payable amounts, track payouts and splits.
- Installments: define plans (tenure, frequency, down payment), generate schedules, record receipts.
- Ledger & Payments: record financial entries (sales, receipts, adjustments), reconcile accounts and generate reports.
- Bank Accounts: maintain accounts used for receipts/payments, reconcile transactions.
- Files & Imports: upload documents (images, PDFs), import CSV/Excel where available, manage attachments.
- Notifications & Reports: notify stakeholders on approvals and due items; export summaries (PDF/CSV) where enabled.

### 6.2 Agent Module
- Lead Inbox: view assigned leads, update status, add notes, schedule follow‑ups.
- Listings Workspace: submit/maintain listings (images, descriptions, prices) within permitted scopes.
- Commission Tracker: view accrued/paid commissions and breakdowns by project/listing.
- Installment Receipts: record payments from buyers (subject to permissions) and issue acknowledgments.
- Profile & Documents: manage KYC/profile data and required compliance documents.

### 6.3 User Module
- Property Search: browse projects and listings with filters (city, area, price range, size).
- Project Pages: photos, amenities, descriptions, price ranges, and availability signals.
- Tools: affordability and installment calculators.
- Engagement: inquiry forms, contact agent/admin, and receive follow‑ups.

## 7. Database Design (High‑Level)
Key Entities (documents) and relationships (references):
- User: { name, email, phone, role (admin|agent|user), credentials, status }
- Agent: { userId → User, licenseNo, approvalStatus, commissionProfileId, documents[] }
- Project: { name, code, location{city, area, address}, totalAreaMarla, status, details{description, developer, features[], amenities[]}, pricing{minPrice, maxPrice, pricePerMarla}, images[] }
- Plot: { projectId → Project, number, sizeMarla, status (available|reserved|sold), facing, price }
- Listing: { projectId → Project, plotId → Plot?, agentId → Agent?, title, description, media[], price, status }
- Lead: { name, contact, source, assignedTo → Agent?, interestIn → Listing|Project, status, notes[] }
- Commission: { listingId → Listing, agentId → Agent, rateType (flat|tiered), rate/tiers[], saleAmount, computedAmount, split{agent,company}, status }
- InstallmentPlan: { projectId/listingId, buyer, schedule[{dueDate, principal, markup?, totalDue}], downPayment, tenure, frequency }
- InstallmentPayment: { planId → InstallmentPlan, receiptNo, paidOn, amount, method, remarks }
- LedgerEntry: { date, refType (sale|receipt|commission|adjustment), refId, accountDr, accountCr, amount, narration }
- BankAccount: { name, number/IBAN, bank, balance?, transactions[] }
- Notification: { toUserId/role, type, payload, readAt }
- File: { ownerType/id, url, mimeType, caption, createdAt }

Notes:
- Reference integrity enforced in controllers/services; critical fields indexed (e.g., projectId, agentId, listingId).
- Attachments stored via file service; URLs persisted in related docs.

## 8. Security & Access Control
- Authentication: stateless sessions using JWT/HTTP‑only cookies (frontend middleware protects routes; backend verifies tokens).
- Authorization (RBAC): role checks at route level; Admin/Agent/User permissions enforced per controller.
- Data Validation: request schemas and centralized validation of inputs; server‑side checks on relations and status transitions.
- Transport & CORS: HTTPS in production; restrictive CORS origins and headers.
- Secrets & Config: environment variables for DB, JWT, and storage keys; never hard‑coded.
- Passwords: salted hashing (e.g., bcrypt) and credential lifecycle (reset/expiry) policies.
- Rate Limiting & Audit: protective throttles on sensitive endpoints; activity/audit logs for critical flows (approvals, payouts).

## 9. Real‑Time Data Flow Explanation
The system supports timely updates across roles using one of the following patterns depending on deployment:
- WebSocket Channel (e.g., Socket.IO): server pushes events (lead assignment, approval decisions, payment receipts) to subscribed clients by role/user.
- Server‑Sent Events or Polling Fallback: periodic refresh for dashboards and counters when sockets are unavailable.
Typical flow: an Admin approves an Agent → backend emits a notification event → Agent’s session receives and updates UI; similarly for new leads, due installments, and commission status changes.

## 10. Business Logic (Commission, Installments, Ledgers)
- Commission Calculation:
  - Flat: commission = $S \times r$, where $S$ is sale amount and $r$ is rate.
  - Tiered: apply tier rates across slabs and sum; company/agent splits can be configured, e.g., agent share = $c_{agent} \times$ commission.
  - Status Lifecycle: pending → verified → payable → paid (with references to ledger postings).
- Installments:
  - Plan Structure: down payment, tenure (months), frequency (monthly/quarterly), optional markup/late fee.
  - Equal Installments (no markup): installment = $\frac{S - D}{n}$ where $S$ is sale price, $D$ down payment, and $n$ periods.
  - With markup/late fee: totalDue per period = principal + markup + arrears; overdue items flagged; receipts reduce outstanding.
- Ledgers (Double‑Entry):
  - Every financial event posts a balanced entry: debit account = credit account, amount equal.
  - Examples: 
    - Sale recognition: Dr Accounts Receivable, Cr Revenue.
    - Receipt: Dr Bank, Cr Accounts Receivable.
    - Commission payout: Dr Commission Expense, Cr Bank/Payable.
  - Reconciliations and reports derive from these postings with filters by project, agent, and period.

## 11. Screenshots Placeholders (SS)
Place screenshots under `frontend/public/screenshots/` and update links below:
- ![SS‑1: Admin Login](frontend/public/screenshots/admin-login.png)
- ![SS‑2: Admin Dashboard](frontend/public/screenshots/admin-dashboard.png)
- ![SS‑3: Projects List](frontend/public/screenshots/projects-list.png)
- ![SS‑4: Edit Project](frontend/public/screenshots/project-edit.png)
- ![SS‑5: Agents Approval](frontend/public/screenshots/agents-approval.png)
- ![SS‑6: Leads Inbox](frontend/public/screenshots/leads-inbox.png)
- ![SS‑7: Listings Management](frontend/public/screenshots/listings-management.png)
- ![SS‑8: Commission Tracker](frontend/public/screenshots/commission-tracker.png)
- ![SS‑9: Installment Schedule](frontend/public/screenshots/installment-schedule.png)
- ![SS‑10: Ledger & Reports](frontend/public/screenshots/ledger-reports.png)
- ![SS‑11: User Property Search](frontend/public/screenshots/user-search.png)
- ![SS‑12: Project Detail Page](frontend/public/screenshots/project-detail.png)

## 12. Conclusion
Landora delivers an integrated platform for managing the full real‑estate lifecycle—from master data (projects/plots) to sales operations (listings/leads) and financial control (commissions/installments/ledgers). Its modular, API‑first architecture and role‑aware UX reduce operational risk, improve turnaround times, and give leadership the visibility needed to scale.

## 13. Future Enhancements
- Analytics & Dashboards: cohort conversion, heatmaps, and revenue forecasting.
- Geospatial Search: map‑based discovery with proximity filters.
- Workflow Automation: SLA timers, reminders, escalations, and approval chains.
- Digital Payments: gateway integration and automated reconciliation.
- Document Workflows: e‑signatures, templated agreements, and versioning.
- Mobile App: Agent on‑the‑go leads, tasks, and receipts.
- Multi‑Tenancy: workspace isolation for franchises/partners with centralized oversight.
