# App Routing Architecture & Registry Guide

## Quick Reference

**Total Apps: 28**
- Public Apps (Always Visible): 15
- Admin-Only Apps: 13

## Routing Patterns

### Pattern 1: WebOS Apps → /dashboard/apps/<appname>
Purpose: Productivity apps with desktop-style interfaces

| App | Route | Admin Only? |
|-----|-------|-------------|
| Email | /dashboard/apps/email | No |
| Calendar | /dashboard/apps/calendar | No |
| Tasks | /dashboard/apps/tasks | No |
| Notes | /dashboard/apps/notes | No |
| App Designer | /dashboard/apps/designer | Yes (Admin) |

### Pattern 2: Dashboard Features → /dashboard/<appname>
Purpose: Core condo management functionality

**Public Apps:**
- Home (/dashboard)
- AI Assistant (/dashboard/chat)
- Notifications (/dashboard/notifications)
- Help (/dashboard/help)
- Profile (/dashboard/profile)
- Payments (/dashboard/payments)
- Household (/dashboard/household)
- Documents (/dashboard/documents)
- Directory (/dashboard/directory)
- Marketplace (/dashboard/marketplace)
- My Community (/dashboard/my-community)
- My Household Legacy (/dashboard/my-household)

**Admin-Only Apps:**
- Admin Panel (/dashboard/admin)
- Messages (/dashboard/messages)
- Accounting (/dashboard/accounting)
- Budgeting (/dashboard/budgeting)
- Building Services (/dashboard/building-services)
- External Connections (/dashboard/external-connections)
- Resident Portal (/dashboard/resident-portal)
- System Config (/dashboard/system-config)
- System Settings (/dashboard/system-settings)

### Pattern 3: Special Routes
- Setup Wizard (/onboarding) - Admin Only

## Why Some Apps Are Hidden

The app grid filters apps based on:

1. **Admin Mode** (Most common cause)
   - 13 apps require admin mode
   - Toggle admin mode: Status bar → Profile dropdown → Admin Mode

2. **Dock Visibility**
   - Some apps have canPinToDock: false
   - These won't appear in the floating menu dock
   - But they WILL appear in the full app grid

3. **Category Filters**
   - When a category is selected, only apps in that category show

## How to See All Apps

**Method 1: Enable Admin Mode**
1. Log in as an admin user
2. Click profile in status bar
3. Enable "Admin Mode" toggle
4. Open app grid → See all 28 apps

**Method 2: Direct Navigation**
- Type URL directly: https://community-manager.abacusai.app/dashboard/admin
- Works if you have permissions

**Method 3: Full App Grid**
- Click app grid icon (9-dots) at bottom center
- Shows all apps (filtered by permissions)

## Architecture Rationale

**Why Two Patterns?**

WebOS Apps (/dashboard/apps/*):
- Desktop-style productivity applications
- Three-pane layouts (navigation, list, detail)
- Template-based design system
- Examples: Email, Calendar, Tasks, Notes

Dashboard Features (/dashboard/*):
- Core community management
- Specialized interfaces for specific tasks
- Examples: Payments, Documents, Directory

This creates clear separation between:
- General productivity tools
- Community-specific features

## Summary

✓ All 28 apps are properly registered
✓ All routes exist and work correctly
✓ The split routing pattern is intentional
✓ Apps are filtered by permission level
✓ Admin mode controls visibility of 13 apps
