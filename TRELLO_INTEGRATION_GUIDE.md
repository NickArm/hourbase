# Trello Integration Setup Guide

## Overview
The Trello integration allows you to import your Trello cards directly into your time-tracker as tasks. This is useful when you're already using Trello for project management and want to switch or integrate with your time tracking system.

## Prerequisites

Before using the Trello integration, you need to:

1. **Get your Trello API credentials**
   - Go to: https://trello.com/app-key
   - You'll see your API Key and API Token
   - Note: Keep these credentials secret!

2. **Add credentials to your .env file**
   ```
   TRELLO_API_KEY=your_api_key_here
   TRELLO_API_SECRET=your_api_token_here
   ```

## Features

### ✅ What the Integration Can Do

1. **Connect to Trello Account**
   - OAuth authentication with Trello
   - Secure token storage with encryption
   - Disconnect anytime from Settings

2. **Select Boards & Lists**
   - Browse all your Trello boards
   - Choose specific lists to import from
   - View list status (closed lists are filtered out)

3. **Import Cards as Tasks**
   - Convert Trello cards to tasks in your selected project
   - Preserve card names and descriptions
   - Optional: Import due dates
   - Optional: Import labels (as tags)
   - All imported tasks are set as billable by default

4. **Track Import History**
   - See when the last import happened
   - Know which board/list you imported from

## How to Use

### Step 1: Connect Your Trello Account

1. Navigate to **Settings → Integrations**
2. Click **"Connect Trello"** button
3. You'll be redirected to Trello's authorization page
4. Approve the connection
5. You'll be returned to your app, now connected

### Step 2: Select Data to Import

1. In **Settings → Integrations**, you should now see:
   - Your Trello username confirmation
   - Board dropdown
   - List dropdown
   - Project selection
   - Import options

2. **Select a Board** from the dropdown
3. **Select a List** from the board (shows active lists only)
4. **Choose a Project** to import cards into
   - Cards will be added to the selected project
   - Project must belong to your account

### Step 3: Configure Import Settings

- **Import Trello labels as tags** (optional)
  - Imports label names as task tags
  - Useful for categorizing tasks
  
- **Import due dates** (optional)
  - Preserves due dates from Trello cards
  - Useful for deadline tracking

### Step 4: Import Cards

1. Click **"Import Cards"** button
2. Wait for the import to complete
3. You'll see a success message with the number of imported cards
4. New tasks will appear in your project

## Important Notes

### ⚠️ Important

- **Card Import**: Only cards (not card attachments or comments) are imported
- **Billable Status**: All imported tasks are marked as billable by default (can be changed after import)
- **Duplicates**: The same card can be imported multiple times if you run import twice
- **Card Order**: Cards maintain their Trello order in the list
- **Labels/Tags**: If labels don't already exist in your system, they won't be created automatically (in current version)

### Security

- Your Trello token is **encrypted** before storage
- Never commit your .env file with real credentials to version control
- Disconnect from Trello anytime in Settings to revoke access

### Troubleshooting

**"Failed to fetch boards"**
- Check that your TRELLO_API_KEY and TRELLO_API_SECRET are correct in .env
- Make sure your token hasn't expired
- Try disconnecting and reconnecting

**"Failed to fetch lists"**
- Make sure the board exists and you have access
- Try selecting a different board

**"Failed to import cards"**
- Check that the project still exists
- Verify you have permission to edit the project
- Check that your Trello account still has access to the board/list

## Example Workflow

1. You have a Trello board called "Marketing" with a list "Q1 Tasks"
2. You have 15 cards in that list representing campaign tasks
3. In Settings → Integrations:
   - Click Connect Trello
   - Select "Marketing" board
   - Select "Q1 Tasks" list
   - Select your "Marketing Campaign" project
   - Enable "Import due dates"
   - Click Import Cards
4. All 15 cards are now in your system as tasks with their due dates preserved
5. You can now track time against these tasks, mark them as paid, add to invoices, etc.

## Integration Architecture

### Database
- `trello_integrations` table stores:
  - User ID
  - Trello user ID & username
  - Encrypted access token
  - Last synced timestamp
  - Selected board & list info
  - Import settings (JSON)

### Controllers
- `TrelloImportController`: Handles OAuth flow, imports, and API interactions
- `SettingsController`: Passes integration data to Settings page

### Services
- `TrelloService`: Handles all Trello API calls
  - Get user info
  - Fetch boards
  - Fetch lists
  - Fetch cards
  - Token verification

### Security
- Tokens are encrypted using Laravel's `encrypt()` function
- All Trello API calls use HTTPS
- User authentication required for all import operations
- CSRF protection on all form submissions

## Future Enhancement Ideas

- Batch imports from multiple lists
- Card description → Task description mapping
- Comment imports as task notes
- Trello member mapping to task assignees
- Scheduled recurring imports (sync)
- Selective card import (checkboxes for specific cards)
- Custom field mapping
- Webhook support for real-time card updates
