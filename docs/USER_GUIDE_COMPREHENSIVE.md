# Community Manager - Complete User Guide

**Welcome to Community Manager!** This comprehensive guide will help you master every feature of your community management platform.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Desktop Environment](#desktop-environment)
3. [Applications](#applications)
4. [Power User Features](#power-user-features)
5. [Mobile Usage](#mobile-usage)
6. [Tips & Tricks](#tips--tricks)

---

## Getting Started

### First Login

1. Navigate to https://community-manager.abacusai.app
2. Enter your email and password
3. Click "Sign In"

**Demo Accounts:**
- Super Admin: superadmin@test.com / admin123
- Admin: admin@test.com / admin123
- User: user@test.com / user123

### The Interface

Community Manager uses a WebOS-inspired interface with three main areas:

**Status Bar** (Top)
- App title and navigation
- System indicators (time, weather, battery, WiFi)
- User menu

**Desktop** (Center)
- Your workspace where apps open as cards/windows
- Beautiful background (customizable)
- "Just type" search prompt

**Dock** (Bottom)
- Home button
- AI Assistant (sparkle icon)
- Notifications (bell icon)
- App Launcher (grid icon)
- Running apps appear here when opened

---

## Desktop Environment

### Opening Apps

**Method 1: App Launcher**
1. Click the grid icon in the dock
2. Browse or search for an app
3. Click to open

**Method 2: Universal Search**
1. Press `Cmd+K` (Mac) or `Ctrl+K` (Windows/Linux)
2. Type app name
3. Press Enter

**Method 3: From Dock**
- Click any app icon in the dock

### Managing Windows (Desktop Only)

**Moving Windows**
- Click and drag the title bar

**Resizing Windows**
- Click and drag edges or corners

**Snapping Windows**
- **Left Half**: `Cmd+Left Arrow`
- **Right Half**: `Cmd+Right Arrow`
- **Top Left Quarter**: `Cmd+Up+Left`
- **Top Right Quarter**: `Cmd+Up+Right`
- **Bottom Left Quarter**: `Cmd+Down+Left`
- **Bottom Right Quarter**: `Cmd+Down+Right`
- **Maximize**: `Cmd+Up`
- **Center**: `Cmd+Down` (when maximized)

**Window Controls**
- **Minimize**: Click `-` button (sends to dock)
- **Maximize**: Click square button
- **Close**: Click `×` button

### Multitasking View (Mobile/Tablet)

Swipe up from bottom to see all open apps as cards:
- Swipe up to close a card
- Tap a card to switch to it
- Swipe down to dismiss view

---

## Applications

### Messages

**Purpose**: Internal messaging system for community communication

#### Sending a Message

1. Open Messages app
2. Click "New Message" button
3. Select recipient(s)
4. Type your message
5. Click Send or press `Cmd+Enter`

#### Reading Messages

- **Conversations**: Listed in middle pane
- **Unread**: Bold with blue dot
- **Click conversation**: Opens in right pane

#### Features

- **Thread Replies**: Reply to specific messages
- **Attachments**: Click paperclip to attach files
- **Search**: Use search bar to find messages
- **Mark Read/Unread**: Right-click conversation

**Keyboard Shortcuts:**
- `N` - New message
- `R` - Reply
- `Cmd+F` - Search

---

### Calendar

**Purpose**: Schedule and manage community events

#### Creating an Event

1. Open Calendar app
2. Click "+ New Event" button
3. Fill in details:
   - Title
   - Date & Time
   - Location (optional)
   - Description
   - Calendar (select which calendar)
4. Click "Create Event"

#### Viewing Events

- **Month View**: See full month
- **Week View**: See current week
- **Day View**: See single day
- **List View**: All events in list

#### Managing Calendars

**Left Pane:**
- Personal calendar (always visible)
- Community calendars
- Toggle visibility by clicking calendar name

#### Features

- **Recurring Events**: Set daily/weekly/monthly repeats
- **Event Colors**: Each calendar has its own color
- **Reminders**: Set notifications before events
- **Export**: Export to .ics format

**Keyboard Shortcuts:**
- `N` - New event
- `T` - Today view
- `D` - Day view
- `W` - Week view
- `M` - Month view

---

### Tasks

**Purpose**: Personal and shared task management

#### Creating a Task

1. Open Tasks app
2. Click "+ Add task" at top of list
3. Type task title and press Enter
OR
1. Click "+ New Task" button for advanced options
2. Fill in:
   - Title
   - Description
   - Due date
   - Priority (high/medium/low)
   - List assignment
   - Tags
3. Click "Create Task"

#### Organizing Tasks

**Lists** (Left Pane):
- All Tasks
- Unfiled
- Today
- Overdue
- Work
- Personal
- Household
- Community

**Create New List:**
1. Click "+ New List"
2. Name your list
3. Choose icon and color

#### Completing Tasks

- Click checkbox next to task
- Task moves to completed
- Undo if clicked by mistake

#### Features

- **Subtasks**: Add checklist items to tasks
- **Attachments**: Attach files to tasks
- **Comments**: Add notes and updates
- **Assignment**: Assign tasks to others
- **Due Dates**: Set deadlines
- **Priorities**: High (red), Medium (yellow), Low (blue)

**Keyboard Shortcuts:**
- `N` - New task
- `Cmd+Enter` - Quick add task
- `Space` - Toggle complete
- `/` - Focus search

---

### Notes

**Purpose**: Quick note-taking and information storage

#### Creating a Note

1. Open Notes app
2. Click "+ New Note" button
3. Type title and content
4. Note saves automatically

#### Organizing Notes

**Categories** (Left Pane):
- All Notes
- Favorites (starred)
- General
- Personal
- Work
- Ideas
- Home
- Archived

**Add to Category:**
1. Open note
2. Select category from dropdown

#### Features

- **Rich Text**: Bold, italic, lists, links
- **Favorites**: Star important notes
- **Search**: Find notes by content
- **Archive**: Hide old notes
- **Share**: Share notes with others

**Keyboard Shortcuts:**
- `Cmd+N` - New note
- `Cmd+B` - Bold
- `Cmd+I` - Italic
- `Cmd+K` - Add link
- `Cmd+S` - Save (auto-saves anyway)

---

### Documents

**Purpose**: Central document repository for community files

#### Uploading Documents

1. Open Documents app
2. Navigate to desired folder
3. Click "Upload" button
4. Select file(s) from computer
5. Files upload to cloud

#### Folder Structure

**Default Folders:**
- Meeting Minutes
- Bylaws & Regulations
- Financial Reports
- Maintenance Records
- Purchase Records
- Resident Documents
- Board Documents

**Create New Folder:**
1. Click "+ New Folder"
2. Name the folder
3. Select parent folder (optional)

#### Viewing Documents

- **List View**: See all documents in folder
- **Grid View**: Thumbnail previews
- **Preview**: Click document to preview
- **Download**: Click download button

#### Features

- **Search**: Find documents by name or content
- **Filters**: Filter by type, date, folder
- **Sharing**: Share documents with residents
- **Versions**: Track document versions
- **Cloud Storage**: Backed up to AWS S3

**Keyboard Shortcuts:**
- `Cmd+U` - Upload
- `Cmd+F` - Search
- `Cmd+N` - New folder
- `Delete` - Delete selected

---

### Directory

**Purpose**: Resident contact information and committee management

#### Viewing Residents

**Left Pane:** Categories
- All Residents
- By Building/Section
- Committees
- Board Members

**Middle Pane:** Resident list
- Name
- Unit number
- Contact info

**Right Pane:** Detailed profile
- Full contact information
- Household members
- Vehicles
- Pets
- Committee memberships

#### Finding Residents

1. Use search bar at top
2. Type name, unit, or email
3. Results filter instantly

#### Committees

**View Committees:**
1. Click "Committees" in left pane
2. See all committees
3. Click committee to see members

**Committee Types:**
- Board of Directors
- Finance Committee
- Landscape Committee
- Social Committee
- Maintenance Committee

#### Request Directory Update

Don't have access to edit? Request an update:

1. Click "Request Update" button
2. Describe changes needed
3. Submit request
4. Admin will review and update

---

### My Community

**Purpose**: Quick access to community information

#### Documents Tab

- Browse community documents
- View bylaws and regulations
- Access meeting minutes
- Download forms

#### Directory Tab

- Quick resident lookup
- Committee information
- Contact board members

---

### My Household

**Purpose**: Manage your household information

#### Household Tab

**Family Members:**
- Add/edit household members
- Update contact information
- Manage access levels

**Children:**
- Add children's information
- Emergency contacts
- School information

**Pets:**
- Register pets
- Vaccination records
- Emergency vet information

**Vehicles:**
- Register vehicles
- License plate numbers
- Parking permits

#### Profile Tab

- Update personal information
- Change password
- Notification preferences
- Privacy settings

#### Payments Tab

- View payment history
- Make payments
- Download receipts
- Manage payment methods

---

## Power User Features

### Universal Search (Cmd+K)

The most powerful feature in Community Manager!

**What You Can Search:**

1. **Apps** - Open any app instantly
2. **Contacts** - Find residents and board members
3. **Documents** - Search document library
4. **Tasks** - Find your tasks
5. **Notes** - Search note contents
6. **Calendar Events** - Find events
7. **Actions** - Quick actions like "Send Message", "Create Task"

**How to Use:**

1. Press `Cmd+K` anywhere
2. Start typing
3. Use arrow keys to navigate
4. Press Enter to select

**Examples:**
- Type "messages" → Opens Messages app
- Type "john smith" → Shows John's contact
- Type "send message" → Opens new message compose
- Type "budget" → Finds documents with "budget"

### AI Assistant

**Access:** Click sparkle icon in dock

**What It Can Do:**

1. **Answer Questions**
   - "How do I upload a document?"
   - "What's the board meeting schedule?"
   
2. **Quick Actions**
   - "Create a task to review budget"
   - "Show me this month's events"
   
3. **Find Information**
   - "Find John Smith's phone number"
   - "What are the pool hours?"

4. **Get Help**
   - "How do I change my password?"
   - "Explain the directory feature"

**Tips:**
- Be specific in your questions
- Use natural language
- Ask follow-up questions
- Request step-by-step instructions

### Keyboard Shortcuts

**Global Shortcuts:**
- `Cmd+K` / `Ctrl+K` - Universal search
- `Cmd+/` - Show all shortcuts
- `Cmd+,` - Settings
- `Escape` - Close dialogs

**Window Management:**
- `Cmd+W` - Close current window
- `Cmd+M` - Minimize window
- `Cmd+Up` - Maximize window
- `Cmd+Left/Right` - Snap left/right
- `Cmd+Tab` - Switch windows

**Navigation:**
- `Cmd+1` through `Cmd+9` - Switch to app #
- `Cmd+0` - Go to home
- `Cmd+[` - Go back
- `Cmd+]` - Go forward

**Actions:**
- `Cmd+N` - New (context-aware)
- `Cmd+S` - Save
- `Cmd+F` - Find/Search
- `Cmd+P` - Print (where applicable)

---

## Mobile Usage

### Gestures

**Multitasking:**
- Swipe up from bottom → Show all open apps
- Swipe up on card → Close app
- Tap card → Switch to app
- Swipe down → Dismiss multitasking view

**In-App:**
- Swipe right → Go back
- Swipe left → Go forward (where applicable)
- Pull down → Refresh
- Long press → Context menu

### App Launcher (Mobile)

1. Tap grid icon in dock
2. Swipe up to see all apps
3. Tap to open

### Dock (Mobile)

- Home, Assistant, Notifications, Launcher
- Recently used apps appear automatically
- Tap and hold to see options

### Cards (Mobile/Tablet)

- Apps open as full-screen cards
- Swipe up from bottom to switch apps
- Only one app visible at a time on mobile
- Tablet can show 2 cards side-by-side

---

## Tips & Tricks

### Productivity Tips

1. **Use Cmd+K for Everything**
   - Fastest way to navigate
   - Works from anywhere
   - Learns your patterns

2. **Keyboard Shortcuts**
   - Learn 5-10 key shortcuts
   - Save hours per week
   - Press `Cmd+/` to see all

3. **Quick Add Tasks**
   - Use `Cmd+Enter` in Tasks
   - Type and go
   - Review/edit later

4. **Favorite Frequently Used**
   - Star important notes
   - Mark favorite contacts
   - Pin important documents

5. **Use AI Assistant**
   - Ask instead of searching
   - Get step-by-step help
   - Learn features faster

### Organization Tips

1. **Use Categories Consistently**
   - Notes: Personal, Work, Community
   - Tasks: Use lists effectively
   - Calendar: Separate calendars

2. **Regular Review**
   - Weekly: Review tasks
   - Monthly: Clean up notes
   - Quarterly: Archive old documents

3. **Naming Conventions**
   - Documents: "2025-10-Board-Minutes.pdf"
   - Events: Include location in title
   - Tasks: Start with action verb

4. **Search Over Navigate**
   - Use Cmd+K instead of clicking
   - Search documents instead of browsing
   - Find contacts by typing

### Time-Saving Tips

1. **Batch Similar Tasks**
   - Process all messages at once
   - Update multiple tasks together
   - Upload multiple documents

2. **Use Templates**
   - Message templates for common replies
   - Task templates for recurring work
   - Document templates for reports

3. **Automate Notifications**
   - Set reminders for important events
   - Enable email digests
   - Use calendar notifications

4. **Learn One Feature Per Week**
   - Master one keyboard shortcut
   - Try one new AI assistant command
   - Explore one new app feature

---

## Getting Help

### In-App Help

1. **AI Assistant** - Ask any question
2. **Help Menu** - Click `?` icon
3. **Tooltips** - Hover over buttons
4. **Empty States** - Show helpful hints

### Common Questions

**Q: How do I change my password?**
A: User Menu → Settings → Change Password

**Q: Can I work offline?**
A: Yes! Install as PWA for offline support

**Q: How do I add family members?**
A: My Household → Household Tab → Add Member

**Q: Who can see my notes?**
A: Only you, unless you share them

**Q: How do I report an issue?**
A: Contact your admin or use AI Assistant

### Need More Help?

- Check the FAQ document
- Review troubleshooting guide
- Contact your community administrator
- Use the AI Assistant for quick answers

---

**Guide Version**: 1.0  
**Last Updated**: November 1, 2025  
**App Version**: Production-Ready

Happy managing! 🎉
