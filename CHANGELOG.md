# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [9.0.7] - 2026-02-08
### Added
- Created TimeEntries Edit page for editing existing time entries
- Added developer credit in footer linking to armenisnick.gr

### Fixed
- Fixed null reference error in ReportsController for projects without client
- Fixed null reference error in ReportsController for clients method
- Improved error handling in Reports page to prevent 500 errors

## [9.0.6] - 2026-02-08
### Fixed
- Fixed invoice_items seeder to use renamed columns (quantity, unit_price) instead of (hours, rate)
- Fixed database migration column naming consistency

## [9.0.5] - 2026-02-07
### Fixed
- Fixed migration execution order for invoice_items table
- Resolved foreign key constraint issues in production deployment

## [9.0.4] - 2026-02-06
### Added
- Added Trello integration support
- Added comprehensive address fields to clients table

### Fixed
- Removed deprecated billing_address field from clients

## [9.0.3] - 2026-02-05
### Added
- Added invoice fields to tasks table (invoice_number, date, etc.)
- Added description field to invoice_items table
- Made task_id and amount nullable in invoice_items

### Changed
- Renamed invoice_items columns: hours → quantity, rate → unit_price
- Added paid status tracking to tasks table

## [9.0.2] - 2026-02-05
### Added
- Complete time tracking system with projects, tasks, and time entries
- Invoice generation and management system
- Client management with comprehensive profile fields
- Tag system for task organization
- Demo data seeder for testing and development

## [9.0.1] - 2026-02-05
### Added
- Custom Hourbase logo with bold clock and link symbol design
- User profile fields (company name, address, tax ID, etc.)

### Changed
- Complete UI color rebrand from Laravel blue/indigo to slate-900 brand colors
- Updated all components with consistent brand identity

## [9.0.0] - 2026-02-05
### Added
- Initial Hourbase application setup
- Laravel 11 with Inertia.js and React 18
- Sanctum authentication system
- SQLite (development) and MySQL (production) database support
- Tailwind CSS with custom brand configuration
- Comprehensive README with features, installation, and API documentation
