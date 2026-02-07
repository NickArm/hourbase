# Time Tracker - SaaS Application Requirements

## Project Overview
Πλατφόρμα time tracking για freelancers που συνεργάζονται με πολλαπλές ομάδες που χρησιμοποιούν διαφορετικά task management tools (Notion, Trello, κλπ). Στόχος: γρήγορη και εύκολη καταγραφή ωρών ανά task με σύνδεση στα external tools.

**Έμπνευση**: myhours.com

## Design Principles (ΚΡΙΣΙΜΟ)
🎯 **#1 Priority: Ευκολία & Ταχύτητα**
- Η δημιουργία task και η καταγραφή ωρών πρέπει να γίνεται σε **δευτερόλεπτα**
- Minimal clicks - maximum efficiency
- Keyboard shortcuts για power users
- Inline editing (edit in place χωρίς modals όπου γίνεται)
- Quick actions always visible
- Smart defaults (π.χ. today's date, last used project)

**Reference UX**: myhours.com timesheet interface

### UI/UX Design Guidelines
🎨 **Design Style**: Minimal, Clean, Simple
- Focus: Timetracking + Task URL linking
- Απλότητα στη δημιουργία tasks ανά project
- Εύκολο πέρασμα ωρών

📐 **Layout Structure**:
- **Sidebar (Left)**: Navigation menu
  - Dashboard
  - Time Tracker (main view)
  - Projects
  - Clients
  - Invoices
  - Tags
  - Reports
  - Settings
- **Content Area (Right)**: Main content

📊 **Dashboard View**:
- Βασικά στατιστικά (simple, not overwhelming)
- Tasks in progress (με progress indicators)
- Due tasks / Upcoming deadlines
- Recent time entries
- Quick actions (+ New task, + Log time)

📁 **Project View**:
- Εύκολη λίστα με tasks
- Quick filters (status, tags, billable)
- Inline time entry
- Visual progress (estimated vs actual)

🔗 **Core Feature Highlight**:
- **External URL linking** - Prominent in task UI
- Easy copy/paste of Notion/Trello/Jira URLs
- Visual indicator when task has external link

## Target Users
- [x] Freelancers (PRIMARY)
- [x] Web Developers που συνεργάζονται με πολλαπλές ομάδες
- [ ] Agencies
- [ ] Small/Medium Businesses

## Core Features (MVP)

### 1. Client Management
- [x] **MUST HAVE**: Create/Edit/Delete clients
- [x] **MUST HAVE**: Soft delete (Archive) instead of permanent delete
- [x] **MUST HAVE**: Restore archived clients
- [x] **MUST HAVE**: Client details (name, contact info)
- [x] **MUST HAVE**: Associate projects with clients
- [x] **MUST HAVE**: Client billing/company details (για invoices):
  - Company name (legal name)
  - Tax ID / VAT number
  - Billing address (street, city, postal code, country)
  - Contact person, Email, Phone
  - Payment terms (optional)

### 2. Project Management
- [x] **MUST HAVE**: Create/Edit/Delete projects
- [x] **MUST HAVE**: Soft delete (Archive) instead of permanent delete
- [x] **MUST HAVE**: Restore archived projects
- [x] **MUST HAVE**: Duplicate project (copy structure + tasks)
- [x] **MUST HAVE**: Project description field
- [x] **MUST HAVE**: Associate project with client
- [x] **MUST HAVE**: Estimated hours (total for project)
- [x] **MUST HAVE**: Project status (Active, On Hold, Completed, Archived)
- [ ] Project color/icon για visual identification

### 3. Task Management
- [x] **MUST HAVE**: Create/Edit/Delete tasks per project
- [x] **MUST HAVE**: Soft delete (Archive) instead of permanent delete
- [x] **MUST HAVE**: Restore archived tasks
- [x] **MUST HAVE**: Duplicate task (copy all settings)
- [x] **MUST HAVE**: Task description field
- [x] **MUST HAVE**: Task external URL (link to Notion, Trello, Jira, etc.)
- [x] **MUST HAVE**: Billable/Non-billable flag ανά task
- [x] **MUST HAVE**: Estimated hours (for planning)
- [x] **MUST HAVE**: Due date field
- [x] **MUST HAVE**: Status field (To Do, In Progress, Done)
- [x] **MUST HAVE**: Tags (one or multiple per task)
- [x] **MUST HAVE**: Marked as paid when included in Paid Invoice
- [ ] Task priority (future)

### 3a. Tag Management
- [x] **MUST HAVE**: Create/Edit/Delete tags (per user)
- [x] **MUST HAVE**: Tag color (visual identification)
- [x] **MUST HAVE**: Assign tags to tasks (multiple tags per task)
- [x] **MUST HAVE**: Filter tasks by tag(s)
- [x] **MUST HAVE**: View all tags used by user
- [ ] Tag suggestions (based on usage)
- [ ] Bulk tag assignment

### 4. Time Tracking
- [x] **MUST HAVE**: Manual time entry (hours:minutes) ανά task
- [x] **MUST HAVE**: Time editing
- [x] **MUST HAVE**: Time deletion
- [x] **MUST HAVE**: Date selection για κάθε entry
- [x] **MUST HAVE**: Notes field per time entry (what did you do)
- [x] **MUST HAVE**: Weekly timesheet view (like myhours.com)
- [ ] Quick entry interface
- [ ] ~~Start/Stop timer~~ (ΟΧΙ για MVP)

### 5. Reporting & Analytics
- [x] **MUST HAVE**: Weekly view με breakdown ανά project/task
- [x] **MUST HAVE**: Total hours ανά project
- [x] **MUST HAVE**: Billable vs Non-billable hours separation
- [x] **MUST HAVE**: "What client owes me" report (Unpaid billable tasks)
- [x] **MUST HAVE**: Amount calculation per project/client
- [x] **MUST HAVE**: Export report για τον πελάτη (PDF preferred)
- [x] **MUST HAVE**: Estimates vs Actual (per project & per task)
- [ ] Monthly reports
- [ ] Export (CSV, Excel)
- [ ] Custom date range
### 5a. Invoice Management
- [x] **MUST HAVE**: Create invoices from tasks (multi-select)
- [x] **MUST HAVE**: Edit invoice details:
  - Invoice date
  - Due date
  - Notes/Description (header)
  - Footer notes (e.g., "0% VAT - Article 39α" for tax exemptions)
  - MyData invoice number (external)
- [x] **MUST HAVE**: Invoice status (Draft, Issued, Paid)
- [x] **MUST HAVE**: Auto-calculate totals (hours × rate + VAT)
- [x] **MUST HAVE**: Link invoice to client (auto-populated)
- [x] **MUST HAVE**: Export invoice as PDF (with branding)
- [x] **MUST HAVE**: Mark invoice as Paid
- [x] **MUST HAVE**: Payment tracking:
  - Payment method (Bank Transfer, PayPal, Cash, Card, Other)
  - Payment reference number
  - Payment date
- [x] **MUST HAVE**: When invoice marked Paid → all tasks in it → marked as completed
- [x] **MUST HAVE**: View all invoices (list with filters)
- [ ] Invoice numbering auto-increment (future)
- [ ] Payment reminders (future)

### 5b. Export Functionalities
- [x] **MUST HAVE**: Export by Client (all projects + tasks + time entries)
- [x] **MUST HAVE**: Export by Project (all tasks + time entries)
- [x] **MUST HAVE**: PDF format with branding
- [x] **MUST HAVE**: Includes billing calculations
- [x] **MUST HAVE**: Export all user data (JSON/CSV) - Backup & GDPR compliance
- [ ] CSV export (future)
- [ ] Excel export (future)
### 6. User Management (MVP - Single User)
- [x] **MUST HAVE**: User registration
- [x] **MUST HAVE**: User authentication (email/password)
- [x] **MUST HAVE**: Password reset
- [x] **MUST HAVE**: Change password
- [x] **MUST HAVE**: Logout
- [x] **MUST HAVE**: Default hourly rate setting (global)
- [x] **MUST HAVE**: Currency selection (€, $, £) - Default: €
- [x] **MUST HAVE**: VAT/Tax rate (%) - e.g., 24% for Greece, 0% for exemptions
- [x] **MUST HAVE**: Business/Company details (γιά invoices):
  - Company name
  - Tax ID / VAT number
  - Address (street, city, postal code, country)
  - Phone, Email
  - Logo (optional)
  - Bank details (optional)
- [x] **MUST HAVE**: Admin role (first user: armenisnick@gmail.com / password)
- [x] **MUST HAVE**: Admin can create new users
- [x] **MUST HAVE**: Admin can set/reset user passwords
- [ ] Team management (future)
- [ ] Multiple user roles (future)
- [ ] Subscription management (future)

### 6a. Authentication
- [x] **MUST HAVE**: Login page
- [x] **MUST HAVE**: Register page (available if allowed)
- [x] **MUST HAVE**: Logout functionality
- [x] **MUST HAVE**: Password reset via email
- [x] **MUST HAVE**: Session management
- [x] **MUST HAVE**: CSRF protection
- [ ] Social login (Google/GitHub) - future
- [ ] Two-factor authentication - future

### 7. Dashboard
- [x] **MUST HAVE**: Overview με stats (current week/month)
- [x] **MUST HAVE**: Total hours (billable vs non-billable)
- [x] **MUST HAVE**: Breakdown by client/project
- [x] **MUST HAVE**: Recent time entries
- [x] **MUST HAVE**: Admin panel (if user is admin)
- [ ] Charts/graphs (nice to have)
- [ ] Productivity insights (future)

### 8. Search & Filtering
- [x] **MUST HAVE**: Search tasks by name
- [x] **MUST HAVE**: Filter tasks by:
  - Client
  - Project
  - Status (To Do, In Progress, Done)
  - Billable/Non-billable
  - Tags (single or multiple)
- [x] **MUST HAVE**: Combined filters (e.g., Client X + Tag "urgent" + Billable)
- [ ] Search across projects/clients (future)
- [ ] Saved filter presets (future)

## Data Model (Core Entities)

### User
- Email (unique)
- Password (hashed)
- Name
- Default hourly rate
- Currency (enum: EUR, USD, GBP) - Default: EUR
- VAT rate (decimal, %) - Default: 24 (for Greece)
- Role (enum: admin, user) - Default: user
- Is Active (boolean) - Default: true
- **Business Details** (γιά invoice generation):
  - Company name
  - Tax ID / VAT number
  - Address (street, city, postal code, country)
  - Phone, Business email
  - Logo URL (optional)
  - Bank details (optional)
- **Subscription Info** (future structure):
  - Subscription plan (null initially)
  - Subscription start date (null initially)
  - Subscription end date (null initially)
  - Status (active/canceled/expired)
- Created/Updated dates
- Last login (nullable)

### Client
- Name
- Contact info (email, phone)
- Description/Notes
- Hourly rate (override του default user rate)
- Status (active/inactive)
- Archived (boolean, soft delete)
- Archived at (timestamp, nullable)
- **Billing Details** (για invoice generation):
  - Company legal name
  - Tax ID / VAT number
  - Billing address (street, city, postal code, country)
  - Contact person
  - Payment terms (e.g., "Net 30")

### Project
- Name
- Description (rich text ή markdown)
- Client (relationship)
- Estimated hours (for planning)
- Color/Icon (optional)
- Status (enum: Active, On Hold, Completed, Archived)
- Archived (boolean, soft delete)
- Archived at (timestamp, nullable)
- Created/Updated dates

### Task
- Name
- Description (rich text ή markdown)
- Project (relationship)
- External URL (link to Notion/Trello/Jira task)
- Billable flag (boolean)
- Estimated hours (for planning)
- Due date
- Status (enum: To Do, In Progress, Done)
- Tags (many-to-many relationship)
- Paid via Invoice (relationship - nullable, when added to invoice)
- Archived (boolean, soft delete)
- Archived at (timestamp, nullable)
- Created/Updated dates

### Tag
- Name (user input)
- Color (hex code, for visual identification)
- User (relationship - tags are per user)
- Tasks (many-to-many relationship)
- Created/Updated dates

### Invoice
- Invoice number (auto-generated within system)
- MyData Invoice Number (external, user input - optional)
- User (relationship)
- Client (relationship)
- Date
- Due date
- Status (enum: Draft, Issued, Paid) - Default: Draft
- Subtotal (calculated from tasks)
- VAT rate (%) - from user settings
- VAT amount (calculated: subtotal × VAT rate)
- Total amount (subtotal + VAT)
- Currency (from user settings)
- Notes/Description (editable, header)
- Footer notes (e.g., "0% VAT - Article 39α", tax exemption info)
- Payment method (enum: Bank Transfer, PayPal, Cash, Card, Other) - nullable
- Payment reference (string) - nullable
- Payment date (date) - nullable
- Tasks (many-to-many via invoice_items)
- Created/Updated dates

### Invoice Item (line items)
- Invoice (relationship)
- Task (relationship)
- Hours (from time entries)
- Rate (client rate ή default rate)
- Amount (hours × rate)

### Time Entry
- Task (relationship)
- Date
- Hours (decimal ή HH:MM format)
- Notes (what did you do, for reporting & communication)
- User (relationship)
- Created/Updated dates

### Billing Logic
- **Default rate**: User's global hourly rate
- **Client rate**: Override ανά client (optional)
- **Invoice creation**: Select billable tasks → System creates Invoice draft
- **Invoice calculation**: Sum of (Task hours × Client/Default rate)
- **Invoice workflow**:
  - Draft → Edit details (date, mydata #, notes) → Issue → Mark Paid
  - When marked Paid → All tasks in invoice → Marked as paid
- **MyData integration**: Field for manual mydata invoice number linking
- **Payment tracking**: 
  - Unpaid invoices shown on dashboard
  - Paid invoices tracked by date
  - Easy reporting of total owed vs total paid

## Future Considerations (Post-MVP)

### Code Quality & Technical Standards
- ✅ **2026 Best Practices**: Modern Laravel 11 patterns
- ✅ **Laravel Standards**: Follow Laravel conventions strictly
  - Service layer for business logic
  - Repository pattern (if needed)
  - Form Requests for validation
  - Resource classes for API responses
  - Eloquent relationships properly defined
  - Database migrations version controlled
- ✅ **React/Inertia Best Practices**:
  - Functional components only
  - Custom hooks for reusable logic
  - Proper state management
  - Component composition
- ✅ **Code Organization**:
  - Clean, readable code
  - Meaningful variable/function names
  - Comments για complex logic
  - DRY principle
  - SOLID principles
- ✅ **Testing** (future):
  - Feature tests για critical paths
  - Unit tests για business logic

### Documentation Requirements
- ✅ **README.md** (simple, concise):
  - Project overview
  - Installation steps
  - Configuration guide
  - Basic usage
  - Tech stack
  - Contributing guidelines (future)
- ✅ **CHANGELOG.md**:
  - Version history
  - New features
  - Bug fixes
  - Breaking changes
  - Follow Keep a Changelog format
- ✅ **Code Comments**:
  - Inline comments για complex logic
  - PHPDoc για functions/methods
  - JSDoc για React components

### Additional Features
- [ ] **Invoice Email Sending**
  - Send invoice PDF via email directly σε client
  - From within app
  - CC yourself
  - Email templates
- [ ] **External System Sync** (High priority future)
  - Sync tasks from Notion
  - Sync tasks from Jira
  - Sync tasks from Trello
  - Two-way sync (view only initially)
  - Auto-update task status
  - OAuth integration
- [ ] **Invoice Generation** (uses User & Client business details)
  - Auto-populate from business details
  - PDF export with branding
  - Invoice numbering
  - Payment tracking
- [ ] Mobile app
- [ ] Offline mode
- [ ] Integrations (Slack, Jira, etc.)
- [ ] Calendar view
- [ ] Notifications
- [ ] Dark mode
- [ ] Multi-language support

### Business Model
- [ ] Freemium
- [ ] Subscription (Monthly/Yearly)
- [ ] Per-user pricing
- [ ] Enterprise plans

### Technical Requirements (Keep in mind for stack selection)
- [x] **MVP**: Responsive design (mobile-friendly web)
- [x] **MVP**: Data security & encryption
- [x] **MVP**: Clean, modern UI (sidebar + content layout)
- [x] **MVP**: Minimal design focused on timetracking
- [x] **MVP**: Laravel 11 best practices
- [x] **MVP**: React/Inertia best practices
- [x] **MVP**: Proper documentation (README + CHANGELOG)
- [ ] Real-time updates (WebSockets)
- [ ] GDPR compliance
- [ ] Public API for integrations
- [ ] Performance optimization at scale
- [ ] Multi-tenancy & scalability

## Success Metrics
- User engagement
- Retention rate
- Revenue targets
- Performance benchmarks

---

## Initial Setup

### Admin User (Seeder)
Πρώτος χρήστης που δημιουργείται με database seeder:
- **Email**: armenisnick@gmail.com
- **Password**: password
- **Role**: Admin
- **Status**: Active

Αυτός ο χρήστης μπορεί να:
- Δημιουργήσει νέους χρήστες
- Ορίσει κωδικούς σε χρήστες
- Διαχειριστεί το σύστημα

## Notes
[Πρόσθεσε εδώ οποιεσδήποτε επιπλέον σκέψεις ή requirements]

## Future Considerations for Subscriptions

### Multi-Tenancy (When subscriptions come)
- Each admin has own workspace
- Users under admin can only access their workspace
- Data isolation per workspace
- Pricing per workspace/admin

### Subscription Models (Post-MVP)
- Free plan: Limited features/users
- Pro plan: Full features, X users
- Enterprise: Custom
- Payment provider: Stripe (recommended)

### Database Structure Ready For Subscriptions
- User table has `subscription_*` fields (prepared but null)
- Data is user-scoped (ready for multi-tenancy)
- Can add `workspace` concept later without major refactor
