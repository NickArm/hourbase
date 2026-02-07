# Hourbase — Time Tracking for Freelancers

> Modern time tracking platform designed for freelancers and consultants who work across multiple teams and tools. Link your tasks from Notion, Trello, Jira, or any tool you use, track time effortlessly, and generate professional invoices in seconds.

## About

**Hourbase** is a comprehensive time tracking and invoicing solution built for freelancers who need to:
- Track billable hours across multiple clients and projects
- Link tasks from external tools (Notion, Trello, Jira)
- Generate professional invoices with VAT and payment tracking
- Access detailed reports and analytics
- Manage clients, projects, and team members

## Features

### Core Functionality
- ⏱️ **Time Tracking**: Manual and quick time entry with task linking
- 📋 **Task Management**: Create, edit, and track task status with external URL support
- 👥 **Client Management**: Organize clients with contact info and hourly rates
- 📁 **Projects**: Group tasks by project with individual billing rates
- 🏷️ **Tags**: Organize tasks with flexible tagging system
- 📊 **Reports**: Detailed analytics by client, project, and date range
- 💰 **Invoicing**: Professional invoice generation with VAT, payment tracking, and MyData integration
- 💾 **Backup & Export**: Export data in multiple formats

### Integrations
- 🔗 **Trello Import**: Connect Trello account and import cards as tasks
- 📌 **External Task Linking**: Link tasks from Notion, Jira, and other tools
- 📤 **Data Export**: Export clients, projects, and invoices (Excel, CSV)

### Pro Features
- 🔐 **Multi-user Support**: Team collaboration with role-based access
- 📈 **Advanced Reports**: Time tracking analytics and insights
- 🎨 **Custom Branding**: Add your logo to invoices
- 🌍 **Multi-currency Support**: Support for multiple currencies
- ⚙️ **Settings**: Billing rates, VAT configuration, bank details

## Tech Stack

### Backend
- **Framework**: Laravel 11
- **Authentication**: Laravel Sanctum
- **Database**: SQLite (development) / MySQL (production)
- **Job Queue**: Laravel Queue with Database driver
- **Exports**: Maatwebsite Excel 3.1.67

### Frontend
- **Framework**: React 18
- **SPA Router**: Inertia.js
- **Styling**: Tailwind CSS
- **Icons**: Heroicons
- **Date Picker**: React DatePicker

### Development
- **Build Tool**: Vite
- **Package Manager**: npm

## Requirements

- PHP 8.2 or higher
- Composer
- Node.js 18 or higher
- npm or yarn

## Installation

### 1. Clone and Setup
```bash
git clone <repository-url>
cd time-tracker
```

### 2. Environment Configuration
```bash
cp .env.example .env
php artisan key:generate
```

### 3. Install Dependencies
```bash
composer install
npm install
```

### 4. Database Setup
```bash
php artisan migrate
php artisan db:seed  # Optional: seed demo data
```

### 5. Build Assets
```bash
npm run build  # Production
npm run dev    # Development
```

### 6. Start Development Servers
```bash
# Terminal 1 - PHP Development Server
php artisan serve

# Terminal 2 - Frontend Build Server
npm run dev
```

Access the application at `http://localhost:8000`

## Configuration

### Environment Variables
Key configuration options in `.env`:

```env
APP_NAME=Hourbase
APP_ENV=local
APP_DEBUG=true

DB_CONNECTION=sqlite

MAIL_FROM_ADDRESS=your-email@example.com

# Trello Integration (Optional)
TRELLO_API_KEY=your_trello_key
TRELLO_API_SECRET=your_trello_secret
```

### Application Configuration
- **Timezone**: `config/app.php`
- **Database**: `config/database.php`
- **Mail**: `config/mail.php`

## Project Structure

```
time-tracker/
├── app/
│   ├── Http/Controllers/        # API & Page Controllers
│   ├── Models/                  # Database Models
│   ├── Services/                # Business Logic (TrelloService, etc.)
│   └── Jobs/                    # Queued Jobs
├── resources/
│   ├── js/
│   │   ├── Pages/              # React Pages
│   │   ├── Components/          # Reusable React Components
│   │   ├── Layouts/            # Layout Components
│   │   └── hooks/              # Custom React Hooks
│   └── views/                   # Blade Templates
├── database/
│   ├── migrations/              # Database Migrations
│   ├── seeders/                # Database Seeders
│   └── factories/               # Model Factories
├── routes/
│   ├── web.php                 # Web Routes
│   └── auth.php                # Auth Routes
├── docs/                        # Documentation
└── public/                      # Public Assets
```

## Database Schema

### Core Tables
- **users**: User accounts and settings
- **clients**: Client information
- **projects**: Projects belonging to clients
- **tasks**: Tasks within projects
- **time_entries**: Logged time entries
- **invoices**: Generated invoices
- **tags**: Task tags and categories
- **trello_integrations**: Trello account connections

### Tasks
- `GET /tasks` - List all tasks
- `POST /tasks` - Create new task
- `PUT /tasks/{id}` - Update task
- `DELETE /tasks/{id}` - Delete task

### Time Entries
- `GET /time-entries` - List time entries
- `POST /time-entries` - Log time
- `PUT /time-entries/{id}` - Update entry
- `DELETE /time-entries/{id}` - Delete entry

### Invoices
- `GET /invoices` - List invoices
- `POST /invoices` - Create invoice
- `GET /invoices/{id}/download` - Download PDF

### Integrations
- `GET /trello/authorize` - Start Trello OAuth
- `GET /trello/callback` - Trello OAuth callback
- `GET /trello/boards` - List Trello boards
- `POST /trello/import` - Import Trello cards

## Features Breakdown

### Time Tracking
- Manual time entry creation
- Quick time entry modal
- Task-based time logging
- Billable/non-billable tracking
- Time entry editing and deletion

### Project Management
- Unlimited clients and projects
- Project status tracking
- Hourly rate configuration
- Task creation and management
- Task status workflow (pending, in_progress, completed)

### Invoicing
- Professional invoice templates
- Multiple payment statuses
- VAT/Tax calculation
- Bank details inclusion
- MyData reference support
- PDF export

### Reporting
- Time tracking by client
- Time tracking by project
- Project progress analytics
- Revenue reports
- Detailed time entry logs

### User Management
- Multi-user support
- Role-based access control
- Admin panel for user management
- User profile management

## Development

### Available Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production

# Laravel
php artisan tinker                    # PHP REPL
php artisan migrate:refresh           # Reset database
php artisan db:seed                   # Seed data
php artisan storage:link              # Link storage
php artisan queue:work                # Process jobs

# Testing
php artisan test
npm run test
```

### Code Style
- PHP: PSR-12 (via Laravel Pint)
- JavaScript: ESLint + Prettier

## Support & Contact

**Developer**: Nick Armenis  
**Email**: hello@armenisnick.gr  
**Website**: https://armenisnick.gr

For issues, questions, or feature requests, please contact via email.

## License

This project is proprietary software. Unauthorized copying of this file via any medium is strictly prohibited.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for detailed version history.

## Disclaimer

This is an actively developed project. Features and documentation may change frequently. Always check the latest version for updates.
