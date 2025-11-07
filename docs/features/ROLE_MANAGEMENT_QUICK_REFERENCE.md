# Role Management - Quick Reference Guide

## 🚀 Quick Start

### Access the Role Management Interface
1. Log in as Admin or Super Admin
2. Navigate to: **Dashboard → Admin → Roles Management**
3. View system and custom roles

## 🎯 Common Tasks

### Create a Custom Role
1. Click "Create Custom Role"
2. Enter role name and description
3. Select permissions by category
4. Click "Create Role"

### Assign Role to User
1. Go to **Admin → Users**
2. Select user
3. Click "Manage Roles"
4. Add desired role(s)
5. Save changes

### Edit Custom Role
1. Navigate to Roles Management
2. Click on custom role (system roles cannot be edited)
3. Modify permissions
4. Save changes

## 📋 System Roles

| Role | Access Level | Can Modify |
|------|-------------|-----------|
| `RESIDENT` | Basic member features | ❌ |
| `ADMIN` | Tenant management | ❌ |
| `SUPER_ADMIN` | System-wide control | ❌ |

## 🔑 Permission Categories

### Core Modules
- **Users** - User management (5 permissions)
- **Directory** - Resident directory (4 permissions)
- **Documents** - Document management (4 permissions)
- **Messages** - Internal messaging (3 permissions)

### Financial
- **Payments** - Payment processing (4 permissions)
- **Budgeting** - Budget management (4 permissions)
- **Accounting** - Financial accounting (4 permissions)

### Community
- **Announcements** - Community posts (3 permissions)
- **Household** - Household management (4 permissions)
- **Committees** - Committee operations (4 permissions)

### Administrative
- **Settings** - System configuration (2 permissions)
- **Reports** - Reporting features (2 permissions)
- **Onboarding** - System setup (2 permissions)

### System (Super Admin Only)
- **Organizations** - Multi-tenant management (4 permissions)
- **Domains** - Domain management (2 permissions)
- **Monitoring** - System monitoring (2 permissions)

## 💡 Permission Naming Convention

Format: `module.action`

Examples:
- `users.view` - View users
- `users.edit` - Edit users
- `payments.create` - Create payments
- `documents.delete` - Delete documents

## 🔒 Access Control Rules

### Admins
- Manage roles within their organization
- Cannot modify system roles
- Cannot access super admin permissions

### Super Admins
- Manage roles across all organizations
- Can view all permissions
- Full system access

## 🎨 UI Features

### Role List View
- Role name and description
- Permission count badge
- System role indicator
- Action buttons (Edit/Delete)

### Permission Picker
- Grouped by category
- Checkbox selection
- Visual organization
- Search/filter (coming soon)

### Role Details
- Complete permission list
- User count with this role
- Creation/modification dates

## 📊 API Quick Reference

### Get All Roles
```bash
GET /api/roles
```

### Create Role
```bash
POST /api/roles
Content-Type: application/json

{
  "name": "Property Manager",
  "description": "Manages property operations",
  "permissions": ["users.view", "documents.upload"]
}
```

### Update Role
```bash
PUT /api/roles/[roleId]
Content-Type: application/json

{
  "name": "Updated Name",
  "permissions": ["users.view", "users.edit"]
}
```

### Assign Role to User
```bash
POST /api/users/[userId]/roles
Content-Type: application/json

{
  "roleId": "role_abc123"
}
```

### Remove Role from User
```bash
DELETE /api/users/[userId]/roles?roleId=role_abc123
```

## 🛠️ Troubleshooting

### "Permission Denied" Error
- Check if user has required role
- Verify role has correct permissions
- Ensure tenant isolation is correct

### Cannot Delete Role
- System roles cannot be deleted
- Check if role is assigned to users
- Only custom roles can be removed

### Changes Not Reflected
- User may need to log out and back in
- Check role assignment completed successfully
- Verify permissions saved correctly

## 📈 Best Practices

### Role Design
1. **Start Simple**: Begin with broad roles
2. **Group Logically**: Related permissions together
3. **Descriptive Names**: Clear role purpose
4. **Regular Review**: Audit permissions periodically

### Permission Assignment
1. **Least Privilege**: Give minimum needed access
2. **Role-Based**: Assign roles, not individual permissions
3. **Document Changes**: Note why permissions granted
4. **Regular Cleanup**: Remove unused roles

### Security
1. **Audit Trail**: Monitor role changes
2. **Separation of Duties**: Prevent conflicts of interest
3. **Regular Reviews**: Check user access levels
4. **Test Changes**: Verify in non-production first

## 🔄 Migration Notes

### Existing Users
- Legacy `role` field still works
- New system complements existing roles
- Gradual migration recommended
- No immediate changes required

### Backward Compatibility
- All existing features work unchanged
- New permissions optional
- Old role checks still valid
- Smooth upgrade path

## 📞 Need Help?

### Common Questions
- **Q**: Can I have multiple roles?
  - **A**: Yes, users can have multiple roles with combined permissions

- **Q**: What happens if I delete a custom role?
  - **A**: Users with that role lose those permissions immediately

- **Q**: Can I rename system roles?
  - **A**: No, system roles are protected and cannot be modified

- **Q**: How do I test a new role?
  - **A**: Create test user, assign role, verify access works correctly

### Additional Resources
- Full documentation: `ROLE_MANAGEMENT_IMPLEMENTATION.md`
- API docs: Check `/api` endpoints
- Permission list: View in database or UI

---

**Last Updated**: November 1, 2025  
**Version**: 1.0.0
