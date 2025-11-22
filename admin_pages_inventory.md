# Admin Pages Inventory - loomOS Design System Unification (Phase 4)

**Repository:** https://www.github.com/ourfi-app/loomOS  
**Branch:** design-system-unification  
**Date:** November 22, 2025  
**Purpose:** Comprehensive inventory of all admin-related pages for WebOS design system application

---

## Summary

This document provides a complete inventory of all administrative interface pages in the loomOS project that need the WebOS design system applied. Pages are categorized by access level and function.

**Total Admin Pages Found:** 23 pages

---

## 🔧 Admin Pages (10 pages)
*Access Level: ADMIN role required*

### 1. Admin Dashboard
**File Path:** `app/dashboard/admin/page.tsx`  
**Route:** `/dashboard/admin`  
**Status:** ✅ Already has DesktopAppWrapper

**Description:**  
Main administrative dashboard providing comprehensive overview of the condo association. Displays key metrics including:
- Total residents and active users
- Monthly revenue and collection rates
- Pending and overdue payments
- Documents and pending directory requests
- Recent activity feed
- Quick action buttons to manage users, payments, announcements, and settings

**Features:**
- Real-time statistics refresh (every 60 seconds)
- Key metrics cards with visual indicators
- Alerts for overdue payments and pending requests
- Quick navigation to all admin functions

**Design Status:** Uses DesktopAppWrapper with admin gradient

---

### 2. Announcements Management
**File Path:** `app/dashboard/admin/announcements/page.tsx`  
**Route:** `/dashboard/admin/announcements`  
**Status:** ✅ Already has DesktopAppWrapper

**Description:**  
Create, manage, and distribute community announcements to residents. Features include:
- Create announcements with priority levels (urgent, normal, low)
- Target specific audiences (all residents, admins, board members, residents only)
- Toggle announcements active/inactive
- Edit and delete announcements
- View announcement history and status

**Features:**
- 3-pane layout (filters, list, detail)
- Deep link support for navigation from notifications
- Priority badges and status indicators
- Full CRUD operations for announcements
- Rich text content support

**Design Status:** Uses DesktopAppWrapper with 3-pane LoomOS layout

---

### 3. Association Settings
**File Path:** `app/dashboard/admin/association/page.tsx`  
**Route:** `/dashboard/admin/association`  
**Status:** ✅ Already has DesktopAppWrapper

**Description:**  
Configure comprehensive association/organization settings including:
- **Basic Info:** Association name, property type, year established, total units, floors
- **Location:** Street address, city, state, ZIP, country
- **Contact Information:** Office phone/email, emergency phone, management company, website
- **Financial Settings:** Default monthly dues, due day, late fees, grace period
- **Policies:** Pet policy, parking policy, rental policy, quiet hours

**Features:**
- 2-pane layout (navigation sidebar + detail form)
- Category-based navigation (Basic, Contact, Financial, Policies)
- Real-time financial summary preview
- Form validation and error handling
- Save confirmation with toast notifications

**Design Status:** Uses DesktopAppWrapper with 2-pane layout and LoomOSGroupBox components

---

### 4. Directory Requests Management
**File Path:** `app/dashboard/admin/directory-requests/page.tsx`  
**Route:** `/dashboard/admin/directory-requests`  
**Status:** ✅ Already has DesktopAppWrapper

**Description:**  
Review and approve/reject resident directory update requests. Handles:
- View all pending, approved, and rejected update requests
- Compare current vs. requested data changes
- Approve or reject with review notes
- Track who requested changes and when
- Maintain audit trail of all directory modifications

**Features:**
- 3-pane layout (filters, request list, detail view)
- Side-by-side comparison of current and requested changes
- Review dialog with notes functionality
- Status badges and filtering
- Deep link support for notification navigation

**Design Status:** Uses DesktopAppWrapper with full 3-pane LoomOS layout

---

### 5. Import Units (Bulk Import)
**File Path:** `app/dashboard/admin/import-units/page.tsx`  
**Route:** `/dashboard/admin/import-units`  
**Status:** ✅ Already has DesktopAppWrapper

**Description:**  
Bulk import units, accounts, and resident data from CSV files. Features:
- Download CSV template with required columns
- Upload and parse CSV files
- Validate data before import (checks for errors, warnings)
- Preview all records with validation status
- Import validated records with duplicate detection
- Match existing users by email

**Features:**
- Step-by-step import workflow
- CSV parsing and validation
- Validation results table with color-coded status
- Error/warning/success badges
- Existing user detection
- Comprehensive import summary

**Design Status:** Uses DesktopAppWrapper with card-based layout

---

### 6. Payment Management
**File Path:** `app/dashboard/admin/payments/page.tsx`  
**Route:** `/dashboard/admin/payments`  
**Status:** ✅ Already has DesktopAppWrapper

**Description:**  
Manage all resident payments and dues. Features include:
- View all payments with status (paid, pending, overdue, cancelled)
- Filter payments by status
- Search by resident name, unit, or email
- Mark payments as paid
- View payment history and details
- Export payment data to CSV

**Features:**
- 3-pane layout (filters, payment list, detail)
- Status indicators with icons and colors
- Payment status toggle
- Resident information display
- CSV export functionality
- Due date tracking

**Design Status:** Uses DesktopAppWrapper with 3-pane LoomOS layout

---

### 7. Property Map
**File Path:** `app/dashboard/admin/property-map/page.tsx`  
**Route:** `/dashboard/admin/property-map`  
**Status:** ✅ Already has DesktopAppWrapper

**Description:**  
Visual property map interface for managing unit locations. Features:
- Interactive Mapbox map showing all units
- Add new units by clicking on map
- Edit existing unit locations and details
- Geocode addresses automatically
- View unit occupancy status on map
- Color-coded unit markers (occupied, vacant, rented, for sale)

**Features:**
- Dynamic map loading with Mapbox
- Click-to-add unit functionality
- Geocoding integration
- Comprehensive unit information form (location, amenities, dues)
- Units grid view with status badges
- Search and filter units

**Design Status:** Uses DesktopAppWrapper with card-based layout and map integration

---

### 8. Roles & Permissions
**File Path:** `app/dashboard/admin/roles/page.tsx`  
**Route:** `/dashboard/admin/roles`  
**Status:** ✅ Already has DesktopAppWrapper

**Description:**  
Manage custom roles and permissions for organization users. Features:
- Create custom roles with specific permissions
- Edit existing roles (non-system roles only)
- Delete custom roles
- View role usage (number of users assigned)
- Permission categories and grouping
- Base role selection (ADMIN, BOARD_MEMBER, RESIDENT)

**Features:**
- Role cards grid layout
- System roles protection (marked with lock icon)
- Permission checklist by category
- Role creation/edit dialog
- User count tracking
- Search and filter roles

**Design Status:** Uses DesktopAppWrapper with card grid layout

---

### 9. Admin Settings
**File Path:** `app/dashboard/admin/settings/page.tsx`  
**Route:** `/dashboard/admin/settings`  
**Status:** ✅ Already has DesktopAppWrapper

**Description:**  
Global admin settings for the system including:
- **Appearance:** Color palette selection (applies globally)
- **Dues & Payments:** Monthly amount, due day, late fees, grace period
- **System:** Application version, database status, last update info

**Features:**
- 2-pane layout (navigation + settings form)
- Live palette preview and selection
- Financial configuration with preview
- Due date suffix calculation (1st, 2nd, 3rd, etc.)
- Automatic page reload after palette change
- System information dashboard

**Design Status:** Uses DesktopAppWrapper with 2-pane LoomOS layout

---

### 10. User Management
**File Path:** `app/dashboard/admin/users/page.tsx`  
**Route:** `/dashboard/admin/users`  
**Status:** ✅ Already has DesktopAppWrapper

**Description:**  
Comprehensive user management for all residents and admins. Features:
- View all users with filtering (all, active, inactive, by role)
- Create new user accounts
- Edit user information
- Activate/deactivate users
- Delete users (with confirmation)
- Search by name, email, or unit number
- View user details and contact information

**Features:**
- 3-pane layout (filters, user list, detail)
- User creation dialog with role selection
- Status badges and role indicators
- Contact information display
- Account creation date tracking
- Full CRUD operations

**Design Status:** Uses DesktopAppWrapper with 3-pane LoomOS layout

---

## 🔐 Super Admin Pages (8 pages)
*Access Level: SUPER_ADMIN role required - Platform-wide management*

### 11. Super Admin Dashboard
**File Path:** `app/dashboard/super-admin/page.tsx`  
**Route:** `/dashboard/super-admin`  
**Status:** ✅ Already has DesktopAppWrapper

**Description:**  
Platform-wide super admin dashboard with system-level metrics:
- Total organizations (active, suspended, trial)
- Total users across all organizations
- Storage usage and limits
- API call statistics (today, week, month)
- Recent system activity
- Quick access to all super admin functions

**Features:**
- Key metrics cards with visual indicators
- Storage usage bar chart
- Recent activity feed with type indicators
- Quick action cards for navigation
- System status overview

**Design Status:** Uses DesktopAppWrapper with super admin gradient (red)

---

### 12. Activity Logs
**File Path:** `app/dashboard/super-admin/activity/page.tsx`  
**Route:** `/dashboard/super-admin/activity`  
**Status:** ✅ Already has DesktopAppWrapper

**Description:**  
System-wide activity logging and monitoring. Tracks:
- All system events (success, error, warning, info)
- User actions across organizations
- Security events
- API calls and errors
- Organization changes

**Features:**
- Advanced filtering (type, category, search)
- Activity log list with type icons
- Metadata display for each event
- Export functionality
- Real-time activity tracking

**Design Status:** Uses DesktopAppWrapper

---

### 13. API Management
**File Path:** `app/dashboard/super-admin/api/page.tsx`  
**Route:** `/dashboard/super-admin/api`  
**Status:** ⚠️ Needs verification

**Description:**  
Manage platform API keys, usage, and rate limits. Features expected:
- API key generation and revocation
- Usage statistics per organization
- Rate limit configuration
- API endpoint monitoring
- Access logs

---

### 14. Domains Management
**File Path:** `app/dashboard/super-admin/domains/page.tsx`  
**Route:** `/dashboard/super-admin/domains`  
**Status:** ⚠️ Needs verification

**Description:**  
Configure custom domains for organizations. Features expected:
- Add/remove custom domains
- Domain verification
- SSL certificate management
- DNS configuration help
- Domain routing setup

---

### 15. System Monitoring
**File Path:** `app/dashboard/super-admin/monitoring/page.tsx`  
**Route:** `/dashboard/super-admin/monitoring`  
**Status:** ⚠️ Needs verification

**Description:**  
Real-time system performance monitoring. Features expected:
- Server health metrics
- Database performance
- API response times
- Error rates and logs
- Resource usage (CPU, memory, disk)
- Uptime statistics

---

### 16. Organizations Management
**File Path:** `app/dashboard/super-admin/organizations/page.tsx`  
**Route:** `/dashboard/super-admin/organizations`  
**Status:** ⚠️ Needs verification

**Description:**  
Manage all tenant organizations on the platform. Features expected:
- Create/edit organizations
- Suspend/activate organizations
- View organization details and stats
- Configure organization settings
- Manage subscription plans
- View organization users and usage

---

### 17. Security Management
**File Path:** `app/dashboard/super-admin/security/page.tsx`  
**Route:** `/dashboard/super-admin/security`  
**Status:** ⚠️ Needs verification

**Description:**  
Platform-wide security settings and monitoring. Features expected:
- Security event logs
- Failed login attempts
- IP blocking/whitelisting
- 2FA enforcement settings
- Session management
- Security policy configuration

---

### 18. Super Admin Users
**File Path:** `app/dashboard/super-admin/users/page.tsx`  
**Route:** `/dashboard/super-admin/users`  
**Status:** ⚠️ Needs verification

**Description:**  
Manage all users across all organizations. Features expected:
- View all platform users
- Search across organizations
- Modify user roles and permissions
- Suspend/activate users globally
- View user activity across orgs
- Reset passwords and 2FA

---

## ⚙️ System Configuration Pages (2 pages)
*Access Level: ADMIN role with admin mode enabled*

### 19. System Config
**File Path:** `app/dashboard/system-config/page.tsx`  
**Route:** `/dashboard/system-config`  
**Status:** ✅ Already has DesktopAppWrapper

**Description:**  
Advanced system configuration settings for administrators. Features:
- Weather widget settings (provider, location, units, update interval)
- Notification preferences (email, SMS, push notifications)
- Event type notification toggles (building status, payments, announcements, emergencies)
- System integration settings

**Features:**
- Category-based navigation
- Toggle switches for feature enabling
- Configuration forms per category
- Real-time setting updates
- Admin mode enforcement

**Design Status:** Uses DesktopAppWrapper with navigation pane

---

### 20. System Settings
**File Path:** `app/dashboard/system-settings/page.tsx`  
**Route:** `/dashboard/system-settings`  
**Status:** ✅ Already has DesktopAppWrapper

**Description:**  
Comprehensive system-wide settings including:
- **General:** Organization name, timezone, date format, language, currency
- **User Preferences:** Default view, items per page, animations, compact mode
- **Notifications:** All notification channel settings
- **Privacy & Security:** 2FA, session timeout, security settings

**Features:**
- Tab-based interface for categories
- Extensive configuration options
- User preference management
- Security configuration
- Email digest settings

**Design Status:** Uses DesktopAppWrapper with tabbed interface

---

## 💰 Payment/Billing Pages (1 page)
*Access Level: Resident-facing but administratively relevant*

### 21. Resident Payments
**File Path:** `app/dashboard/payments/page.tsx`  
**Route:** `/dashboard/payments`  
**Status:** ⚠️ Needs verification

**Description:**  
Resident-facing payment page for viewing and making payments. Features expected:
- View payment history
- Make online payments
- Download receipts
- View upcoming dues
- Payment method management

**Note:** While this is resident-facing, it relates to the admin payment system and may need design consistency.

---

## 👨‍💻 Developer Portal Pages (1 page)
*Access Level: Developers or admin users*

### 22. Developer Portal
**File Path:** `app/dashboard/developer/page.tsx`  
**Route:** `/dashboard/developer`  
**Status:** ⚠️ Needs verification

**Description:**  
Developer portal for API access and app development. Features expected:
- API documentation
- API key management
- Webhook configuration
- Developer app management
- Testing tools

---

## 📊 Accounting/Finance Pages (1 page)
*Access Level: ADMIN or BOARD_MEMBER role*

### 23. Accounting Dashboard
**File Path:** `app/dashboard/apps/accounting/page.tsx`  
**Route:** `/dashboard/apps/accounting`  
**Status:** ⚠️ Needs verification

**Description:**  
Accounting and financial management dashboard. Features expected:
- Financial reports
- Account balances
- Transaction history
- Invoice management
- Budget tracking
- Financial analytics

---

## Priority Recommendations

### High Priority (Fully verified and documented - 10 pages)
These pages are well-documented and ready for design system work:

1. ✅ Admin Dashboard
2. ✅ Announcements Management
3. ✅ Association Settings
4. ✅ Directory Requests
5. ✅ Import Units
6. ✅ Payment Management
7. ✅ Property Map
8. ✅ Roles & Permissions
9. ✅ Admin Settings
10. ✅ User Management

### Medium Priority (Partially verified - 3 pages)
These have DesktopAppWrapper but need more detailed analysis:

11. ✅ Super Admin Dashboard
12. ✅ Activity Logs
13. ✅ System Config
14. ✅ System Settings

### Needs Verification (Requires file review - 9 pages)
These need to be examined for current design status:

15. ⚠️ API Management
16. ⚠️ Domains Management
17. ⚠️ System Monitoring
18. ⚠️ Organizations Management
19. ⚠️ Security Management
20. ⚠️ Super Admin Users
21. ⚠️ Resident Payments
22. ⚠️ Developer Portal
23. ⚠️ Accounting Dashboard

---

## Technical Notes

### Design System Requirements
All pages should implement:
- ✅ **Glassmorphism** with backdrop blur (20px)
- ✅ **Muted gray gradients** (#d8d8d8, #e8e8e8)
- ✅ **Helvetica Neue Light** typography (font-weight 300)
- ✅ **Rounded forms** (24px for cards, 12px for buttons)
- ✅ **Design tokens** for colors, borders, shadows
- ✅ **100% backward compatibility**

### Common Patterns Found
1. **DesktopAppWrapper**: Most admin pages already use this component
2. **3-Pane Layout**: Filters → List → Detail (very common pattern)
3. **2-Pane Layout**: Navigation → Content (for settings pages)
4. **LoomOS Components**: Heavy usage of LoomOS design system components
5. **Deep Link Support**: Many pages support navigation from notifications

### File Locations Summary
- **Admin Pages**: `app/dashboard/admin/*/page.tsx` (10 pages)
- **Super Admin Pages**: `app/dashboard/super-admin/*/page.tsx` (8 pages)
- **System Pages**: `app/dashboard/system-*/page.tsx` (2 pages)
- **Other Admin**: Various locations (3 pages)

---

## Next Steps

1. **Review Priority**: Focus on the 10 high-priority admin pages first
2. **Verify Unknowns**: Check the 9 pages marked as "Needs Verification"
3. **Design Application**: Apply WebOS design system systematically
4. **Testing**: Ensure backward compatibility maintained
5. **Documentation**: Update progress in PHASE4_PROGRESS_SUMMARY.md

---

## Questions for User Review

1. **Page Selection**: Which 10 of these 23 pages should we prioritize for Phase 4?
2. **Super Admin Priority**: Should super admin pages be included in the current phase?
3. **Verification**: Should we verify the 9 "Needs Verification" pages before selecting?
4. **Scope**: Any additional admin pages not listed here that should be included?

---

**Document Generated:** November 22, 2025  
**Repository Branch:** design-system-unification  
**Total Pages Identified:** 23 admin/administrative pages  
**Verified & Ready:** 14 pages  
**Needs Verification:** 9 pages
