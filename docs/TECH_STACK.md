# Time Tracker - Tech Stack

## Overview

| Layer | Technology | Version |
|-------|-----------|---------|
| **Backend** | Laravel | 11.x |
| **Frontend** | React | 18.x |
| **Bridge** | Inertia.js | Latest |
| **Database** | MySQL | 5.7+ (Verpex) |
| **Local DB** | SQLite | (Development only) |
| **Styling** | Tailwind CSS | 3.x |
| **Package Manager** | Composer & npm | - |
| **Hosting** | Verpex (Shared) | - |

---

## Backend Stack

### Laravel 11
- **Framework**: Laravel 11.x
- **Authentication**: Laravel Breeze (Inertia + React preset)
- **ORM**: Eloquent
- **Validation**: Laravel Validation
- **Middleware**: CSRF, Auth, etc.

### Key Dependencies
```json
{
  "require": {
    "php": "^8.2",
    "laravel/framework": "^11.0",
    "inertiajs/inertia-laravel": "^0.6",
    "laravel/breeze": "^1.x"
  }
}
```

### Structure
```
time-tracker/
├── app/
│   ├── Models/
│   │   ├── User.php
│   │   ├── Client.php
│   │   ├── Project.php
│   │   ├── Task.php
│   │   └── TimeEntry.php
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── ClientController.php
│   │   │   ├── ProjectController.php
│   │   │   ├── TaskController.php
│   │   │   ├── TimeEntryController.php
│   │   │   └── DashboardController.php
│   │   └── Middleware/
│   ├── Services/
│   │   ├── BillingService.php
│   │   ├── ReportService.php
│   │   └── ExportService.php
│   └── Enums/
│       ├── TaskStatus.php
│       ├── PaymentStatus.php
│       └── Currency.php
├── database/
│   ├── migrations/
│   │   ├── create_users_table.php
│   │   ├── create_clients_table.php
│   │   ├── create_projects_table.php
│   │   ├── create_tasks_table.php
│   │   └── create_time_entries_table.php
│   └── seeders/
├── routes/
│   └── web.php
└── resources/
    └── js/
```

---

## Frontend Stack

### React 18.x + Inertia.js
- **React**: 18.x
- **Inertia.js**: Bridge between Laravel & React
- **Styling**: Tailwind CSS 3.x
- **UI Components**: Headless UI
- **Build Tool**: Vite (built into Laravel)

### Key Dependencies
```json
{
  "dependencies": {
    "react": "^18.x",
    "react-dom": "^18.x",
    "@inertiajs/react": "^0.6",
    "@inertiajs/core": "^0.6",
    "tailwindcss": "^3.x",
    "@headlessui/react": "^1.x",
    "axios": "^1.x"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.x",
    "laravel-vite-plugin": "^0.7.x"
  }
}
```

### Structure
```
resources/js/
├── Pages/
│   ├── Dashboard.jsx
│   ├── Auth/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   └── ResetPassword.jsx
│   ├── Clients/
│   │   ├── Index.jsx
│   │   ├── Create.jsx
│   │   ├── Edit.jsx
│   │   └── Show.jsx
│   ├── Projects/
│   │   ├── Index.jsx
│   │   ├── Create.jsx
│   │   ├── Edit.jsx
│   │   └── Show.jsx
│   ├── Tasks/
│   │   ├── Index.jsx
│   │   ├── Create.jsx
│   │   ├── Edit.jsx
│   │   └── Show.jsx
│   ├── TimeTracker/
│   │   ├── Weekly.jsx
│   │   ├── TimeEntry.jsx
│   │   └── Reports.jsx
│   └── Settings/
│       ├── Profile.jsx
│       └── BusinessDetails.jsx
├── Components/
│   ├── TaskForm.jsx
│   ├── TimeEntryForm.jsx
│   ├── FilterBar.jsx
│   ├── SearchBar.jsx
│   ├── ReportGenerator.jsx
│   └── Layout/
│       ├── Navbar.jsx
│       ├── Sidebar.jsx
│       └── AuthLayout.jsx
├── Hooks/
│   ├── useAuth.js
│   ├── useForm.js
│   └── useFilters.js
└── app.jsx
```

---

## Database Schema

### Users
```sql
CREATE TABLE users (
  id BIGINT PRIMARY KEY,
  name VARCHAR(255),
  email VARCHAR(255) UNIQUE,
  password VARCHAR(255),
  hourly_rate DECIMAL(10, 2),
  currency ENUM('EUR', 'USD', 'GBP') DEFAULT 'EUR',
  company_name VARCHAR(255),
  tax_id VARCHAR(50),
  address VARCHAR(255),
  city VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(100),
  phone VARCHAR(20),
  business_email VARCHAR(255),
  logo_url VARCHAR(255) NULL,
  bank_details TEXT NULL,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Clients
```sql
CREATE TABLE clients (
  id BIGINT PRIMARY KEY,
  user_id BIGINT FOREIGN KEY,
  name VARCHAR(255),
  email VARCHAR(255),
  phone VARCHAR(20),
  description TEXT NULL,
  hourly_rate DECIMAL(10, 2) NULL,
  company_name VARCHAR(255),
  tax_id VARCHAR(50),
  billing_address VARCHAR(255),
  billing_city VARCHAR(100),
  billing_postal_code VARCHAR(20),
  billing_country VARCHAR(100),
  contact_person VARCHAR(255),
  payment_terms VARCHAR(50),
  status ENUM('active', 'inactive') DEFAULT 'active',
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Projects
```sql
CREATE TABLE projects (
  id BIGINT PRIMARY KEY,
  client_id BIGINT FOREIGN KEY,
  user_id BIGINT FOREIGN KEY,
  name VARCHAR(255),
  description TEXT NULL,
  color VARCHAR(7) NULL,
  icon VARCHAR(50) NULL,
  status ENUM('active', 'archived') DEFAULT 'active',
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Tasks
```sql
CREATE TABLE tasks (
  id BIGINT PRIMARY KEY,
  project_id BIGINT FOREIGN KEY,
  user_id BIGINT FOREIGN KEY,
  name VARCHAR(255),
  description TEXT NULL,
  external_url VARCHAR(255) NULL,
  billable BOOLEAN DEFAULT true,
  payment_status ENUM('unpaid', 'paid') DEFAULT 'unpaid',
  due_date DATE NULL,
  status ENUM('to_do', 'in_progress', 'done') DEFAULT 'to_do',
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Time Entries
```sql
CREATE TABLE time_entries (
  id BIGINT PRIMARY KEY,
  task_id BIGINT FOREIGN KEY,
  user_id BIGINT FOREIGN KEY,
  date DATE,
  hours DECIMAL(5, 2),
  notes TEXT NULL,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

---

## Development Setup

### Prerequisites
- PHP 8.2+
- Composer
- Node.js 16+
- npm or yarn
- MySQL 5.7+ (for production testing)
- SQLite (local development)

### Local Setup
```bash
# 1. Clone repository
git clone <repo>
cd time-tracker

# 2. Install PHP dependencies
composer install

# 3. Install Node dependencies
npm install

# 4. Copy .env file
cp .env.example .env

# 5. Generate app key
php artisan key:generate

# 6. Configure database (SQLite for local)
# Update .env: DB_CONNECTION=sqlite

# 7. Run migrations
php artisan migrate

# 8. Run seeders (optional - sample data)
php artisan db:seed

# 9. Build assets
npm run dev    # Development (with hot reload)
npm run build  # Production build

# 10. Start Laravel server
php artisan serve
```

### Dev Commands
```bash
# Run development server with Vite hot reload
npm run dev

# Build production assets
npm run build

# Run migrations
php artisan migrate

# Create new model with migration
php artisan make:model ModelName -m

# Create controller
php artisan make:controller ControllerName

# Database reset
php artisan migrate:fresh --seed

# Tinker (interactive shell)
php artisan tinker
```

---

## File Upload & Export

### PDF Export
- Library: `barryvdh/laravel-dompdf`
- Use for: Invoice/report generation

### CSV/Excel Export
- Library: `maatwebsite/excel` (optional, future)

---

## Deployment (Verpex)

### Production .env
```bash
APP_ENV=production
APP_DEBUG=false
DB_CONNECTION=mysql
DB_HOST=<verpex-host>
DB_PORT=3306
DB_DATABASE=<verpex-db>
DB_USERNAME=<verpex-user>
DB_PASSWORD=<verpex-pass>
```

### Deployment Steps
1. Push to Git (GitHub/GitLab)
2. SSH into Verpex
3. `composer install --optimize-autoloader`
4. `npm install && npm run build`
5. `php artisan migrate --force`
6. `php artisan config:cache`
7. `php artisan route:cache`
8. Set proper permissions on `storage/` and `bootstrap/cache/`

---

## API Architecture

### Response Format
```json
{
  "success": true,
  "data": { /* resource */ },
  "message": "Operation successful"
}
```

### Key Routes
```
GET    /dashboard                 - Dashboard stats
GET    /clients                   - List clients
POST   /clients                   - Create client
PUT    /clients/{id}              - Update client
DELETE /clients/{id}              - Delete client

GET    /projects                  - List projects
POST   /projects                  - Create project
PUT    /projects/{id}             - Update project
DELETE /projects/{id}             - Delete project

GET    /tasks                     - List tasks (with filters)
POST   /tasks                     - Create task
PUT    /tasks/{id}                - Update task
DELETE /tasks/{id}                - Delete task
PATCH  /tasks/{id}/mark-paid      - Mark task as paid

GET    /time-entries              - List time entries
POST   /time-entries              - Create entry
PUT    /time-entries/{id}         - Update entry
DELETE /time-entries/{id}         - Delete entry

GET    /reports/weekly            - Weekly report
GET    /reports/client/{id}       - Client report
GET    /reports/export            - Export report (PDF)

GET    /settings                  - User settings
PUT    /settings                  - Update settings
```

---

## Code Style & Standards

### PHP
- **PSR-12** (PHP Standard Recommendations)
- Laravel conventions
- Type hints mandatory

### JavaScript/React
- **ESLint** config (optional setup)
- Functional components only
- Hooks-based state management

### Database
- Timestamps on all tables
- Foreign keys with ON DELETE CASCADE
- Enum types for fixed values

---

## Performance Considerations

1. **Database Indexing**
   - Foreign keys indexed
   - Common filters indexed (user_id, client_id, date)

2. **Query Optimization**
   - Eager loading (Eloquent `with()`)
   - Pagination on lists
   - Caching (Redis, optional)

3. **Frontend**
   - Code splitting with React.lazy
   - Image optimization
   - Lazy loading components

4. **Assets**
   - Minified CSS/JS (Vite handles this)
   - Gzip compression (Verpex)

---

## Security

### CSRF Protection
- Laravel middleware (enabled by default)
- Inertia validates automatically

### Authentication
- Laravel Breeze (Laravel Sessions)
- Password hashing: bcrypt

### Data Protection
- Validate all inputs (Laravel Validation)
- Sanitize output (React escaping)
- HTTPS only (configure on Verpex)

---

## Next Steps (When Ready)

1. ✅ Requirements defined (REQUIREMENTS.md)
2. ⏳ **Tech Stack defined (this file)**
3. ⏳ **Project initialization**
4. ⏳ **Database schema implementation**
5. ⏳ **Authentication setup**
6. ⏳ **Core CRUD operations**
7. ⏳ **Dashboard & Reports**
8. ⏳ **Testing & QA**
9. ⏳ **Deployment to Verpex**

---

## Useful Resources

- [Laravel Docs](https://laravel.com/docs/11.x)
- [Inertia.js Docs](https://inertiajs.com/)
- [React Docs](https://react.dev)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Verpex Documentation](https://help.verpex.com/)

---

## Notes

- Local development uses SQLite for simplicity
- Production uses MySQL on Verpex
- Breeze provides auth scaffolding (register, login, password reset)
- Inertia handles routing automatically (no separate API)
- All state management through Laravel (no Redux/Zustand needed)

