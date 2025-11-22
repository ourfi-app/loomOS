// TODO: Review and replace type safety bypasses (as any, @ts-expect-error) with proper types

'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  UserCheck, 
  UserX, 
  Shield,
  ChevronRight,
  Calendar,
  Mail,
  Phone,
  Home,
  X
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  LoomOSPaneContainer,
  LoomOSContainerPane,
  LoomOSNavigationPane,
  LoomOSListPane,
  LoomOSDetailPane,
  LoomOSListItem,
  LoomOSNavListItem,
  LoomOSGroupBox
} from '@/components/webos';
import { DesktopAppWrapper } from '@/components/webos/desktop-app-wrapper';
import { APP_COLORS } from '@/lib/app-design-system';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { format } from 'date-fns';

interface User {
  id: string;
  name: string;
  email: string;
  unitNumber: string | null;
  phone: string | null;
  role: string;
  isActive: boolean;
  createdAt: string;
}

interface FilterOption {
  id: string;
  label: string;
  count?: number;
  filter: (users: User[]) => User[];
}

export default function UserManagementPage() {
  const session = useSession();
  const status = session?.status || 'loading';
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    unitNumber: '',
    phone: '',
    role: 'RESIDENT' as string,
    password: ''
  });

  const userRole = (session?.data?.user as any)?.role;

  useEffect(() => {
    if (status === 'authenticated' && userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
      router.push('/dashboard');
    }
  }, [status, userRole, router]);

  useEffect(() => {
    if (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') {
      fetchUsers();
    }
  }, [userRole]);

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      }
    } catch (error) {
      console.error('Failed to fetch users:', error);
      toast.error('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateUser = async () => {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success('User created successfully');
        setIsDialogOpen(false);
        resetForm();
        fetchUsers();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      toast.error('Failed to create user');
    }
  };

  const handleUpdateUser = async () => {
    if (!editingUser) return;

    try {
      const response = await fetch(`/api/admin/users/${editingUser.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        toast.success('User updated successfully');
        setIsDialogOpen(false);
        setEditingUser(null);
        resetForm();
        fetchUsers();
        if (selectedUser?.id === editingUser.id) {
          // Refresh selected user
          const updated = await fetch(`/api/admin/users`).then(r => r.json());
          const updatedUser = updated.users?.find((u: User) => u.id === editingUser.id);
          if (updatedUser) setSelectedUser(updatedUser);
        }
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      toast.error('Failed to update user');
    }
  };

  const handleToggleActive = async (userId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive })
      });

      if (response.ok) {
        toast.success(`User ${!isActive ? 'activated' : 'deactivated'} successfully`);
        fetchUsers();
        if (selectedUser?.id === userId) {
          setSelectedUser({ ...selectedUser, isActive: !isActive });
        }
      } else {
        toast.error('Failed to update user status');
      }
    } catch (error) {
      console.error('Error toggling user status:', error);
      toast.error('Failed to update user status');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('User deleted successfully');
        if (selectedUser?.id === userId) {
          setSelectedUser(null);
        }
        fetchUsers();
      } else {
        toast.error('Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      toast.error('Failed to delete user');
    }
  };

  const openEditDialog = (user: User) => {
    setEditingUser(user);
    setFormData({
      name: user.name || '',
      email: user.email || '',
      unitNumber: user.unitNumber || '',
      phone: user.phone || '',
      role: user.role,
      password: ''
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      unitNumber: '',
      phone: '',
      role: 'RESIDENT',
      password: ''
    });
    setEditingUser(null);
  };

  // Filter options
  const filterOptions: FilterOption[] = [
    {
      id: 'all',
      label: 'All Users',
      count: users.length,
      filter: (users) => users
    },
    {
      id: 'active',
      label: 'Active',
      count: users.filter(u => u.isActive).length,
      filter: (users) => users.filter(u => u.isActive)
    },
    {
      id: 'inactive',
      label: 'Inactive',
      count: users.filter(u => !u.isActive).length,
      filter: (users) => users.filter(u => !u.isActive)
    },
    {
      id: 'admin',
      label: 'Administrators',
      count: users.filter(u => u.role === 'ADMIN' || u.role === 'SUPER_ADMIN').length,
      filter: (users) => users.filter(u => u.role === 'ADMIN' || u.role === 'SUPER_ADMIN')
    },
    {
      id: 'board',
      label: 'Board Members',
      count: users.filter(u => u.role === 'BOARD_MEMBER').length,
      filter: (users) => users.filter(u => u.role === 'BOARD_MEMBER')
    },
    {
      id: 'resident',
      label: 'Residents',
      count: users.filter(u => u.role === 'RESIDENT').length,
      filter: (users) => users.filter(u => u.role === 'RESIDENT')
    }
  ];

  // Apply filters and search
  const currentFilter = filterOptions.find(f => f.id === selectedFilter);
  const filteredUsers = currentFilter
    ? currentFilter.filter(users).filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.unitNumber?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Convert users to list items
  const listItems = filteredUsers.map(user => ({
    id: user.id,
    title: user.name || user.email,
    subtitle: user.email,
    timestamp: user.unitNumber ? `Unit ${user.unitNumber}` : undefined,
    selected: selectedUser?.id === user.id,
    badge: (
      <div className="flex gap-1">
        {user.role === 'ADMIN' || user.role === 'SUPER_ADMIN' ? (
          <Badge variant="default" className="text-xs">Admin</Badge>
        ) : user.role === 'BOARD_MEMBER' ? (
          <Badge variant="secondary" className="text-xs">Board</Badge>
        ) : null}
        <Badge variant={user.isActive ? 'default' : 'destructive'} className="text-xs">
          {user.isActive ? 'Active' : 'Inactive'}
        </Badge>
      </div>
    ),
    onClick: () => setSelectedUser(user)
  }));

  if (status === 'loading' || loading) {
    return (
      <div 
        className="flex items-center justify-center h-full"
        style={{
          background: 'var(--webos-bg-gradient)',
          fontFamily: "'Helvetica Neue', Arial, sans-serif"
        }}
      >
        <div className="text-center">
          <div 
            className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
            style={{ borderColor: 'var(--webos-app-blue)' }}
          ></div>
          <p className="font-light" style={{ color: 'var(--webos-text-secondary)' }}>
            Loading users...
          </p>
        </div>
      </div>
    );
  }

  if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
    return null;
  }

  return (
    <DesktopAppWrapper
      title="Users"
      icon={<Users className="w-5 h-5" />}
      gradient={APP_COLORS.admin.light}
    >
      <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="h-6 w-6 text-[var(--semantic-primary)]" />
            User Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage residents, board members, and administrators
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add User
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingUser ? 'Edit User' : 'Add New User'}</DialogTitle>
              <DialogDescription>
                {editingUser ? 'Update user information' : 'Create a new user account'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name*</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email*</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="john@example.com"
                  disabled={!!editingUser}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unitNumber">Unit Number</Label>
                <Input
                  id="unitNumber"
                  value={formData.unitNumber}
                  onChange={(e) => setFormData({ ...formData, unitNumber: e.target.value })}
                  placeholder="101"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="(555) 123-4567"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role*</Label>
                <Select value={formData.role} onValueChange={(value) => setFormData({ ...formData, role: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="RESIDENT">Resident</SelectItem>
                    <SelectItem value="BOARD_MEMBER">Board Member</SelectItem>
                    <SelectItem value="ADMIN">Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {!editingUser && (
                <div className="space-y-2">
                  <Label htmlFor="password">Password*</Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="Enter password"
                  />
                </div>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsDialogOpen(false);
                resetForm();
              }}>
                Cancel
              </Button>
              <Button onClick={editingUser ? handleUpdateUser : handleCreateUser}>
                {editingUser ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* 3-Pane Layout */}
      <div className="flex-1 overflow-hidden">
        <LoomOSPaneContainer>
          {/* Navigation Pane - Filters */}
          <LoomOSContainerPane id="filters" type="navigation" width={240}>
            <div className="p-4 space-y-1">
              <h3 className="text-xs font-light tracking-wider uppercase" style={{ color: 'var(--webos-text-tertiary' }} mb-3">Filters</h3>
              {filterOptions.map(filter => (
                <LoomOSNavListItem
                  key={filter.id}
                  label={filter.label}
                  count={filter.count}
                  selected={selectedFilter === filter.id}
                  onClick={() => {
                    setSelectedFilter(filter.id);
                    setSelectedUser(null);
                  }}
                />
              ))}
            </div>
          </LoomOSContainerPane>

          {/* List Pane - Users */}
          <LoomOSContainerPane id="list" type="list" width={360}>
            <LoomOSListPane
              searchPlaceholder="Search users..."
              searchValue={searchTerm}
              onSearchChange={setSearchTerm}
              items={listItems}
              emptyMessage="No users found"
              loading={loading}
            />
          </LoomOSContainerPane>

          {/* Detail Pane - User Details */}
          <LoomOSContainerPane id="detail" type="detail" fill>
            <LoomOSDetailPane
              isEmpty={!selectedUser}
              emptyIcon={<Users className="h-16 w-16" />}
              emptyMessage="No user selected"
              emptySubMessage="Select a user from the list to view details"
              title={selectedUser?.name || selectedUser?.email}
              subtitle={selectedUser ? `User ID: ${selectedUser.id}` : undefined}
              actions={selectedUser && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditDialog(selectedUser)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleActive(selectedUser.id, selectedUser.isActive)}
                  >
                    {selectedUser.isActive ? (
                      <>
                        <UserX className="h-4 w-4 mr-2" />
                        Deactivate
                      </>
                    ) : (
                      <>
                        <UserCheck className="h-4 w-4 mr-2" />
                        Activate
                      </>
                    )}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteUser(selectedUser.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              )}
            >
              {selectedUser && (
                <div className="space-y-6">
                  {/* Status */}
                  <div className="flex items-center gap-4">
                    <Badge variant={selectedUser.isActive ? 'default' : 'destructive'} className="text-sm">
                      {selectedUser.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <Badge variant={
                      selectedUser.role === 'ADMIN' || selectedUser.role === 'SUPER_ADMIN' ? 'default' : 
                      selectedUser.role === 'BOARD_MEMBER' ? 'secondary' : 'outline'
                    }>
                      {selectedUser.role.replace('_', ' ')}
                    </Badge>
                  </div>

                  {/* Contact Information */}
                  <LoomOSGroupBox title="Contact Information">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Email</p>
                          <p className="text-sm text-muted-foreground">{selectedUser.email}</p>
                        </div>
                      </div>
                      {selectedUser.phone && (
                        <div className="flex items-start gap-3">
                          <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">Phone</p>
                            <p className="text-sm text-muted-foreground">{selectedUser.phone}</p>
                          </div>
                        </div>
                      )}
                      {selectedUser.unitNumber && (
                        <div className="flex items-start gap-3">
                          <Home className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">Unit Number</p>
                            <p className="text-sm text-muted-foreground">Unit {selectedUser.unitNumber}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </LoomOSGroupBox>

                  {/* Account Details */}
                  <LoomOSGroupBox title="Account Details">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Created</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(selectedUser.createdAt), 'MMM dd, yyyy')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Shield className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Role</p>
                          <p className="text-sm text-muted-foreground">
                            {selectedUser.role.replace('_', ' ')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </LoomOSGroupBox>
                </div>
              )}
            </LoomOSDetailPane>
          </LoomOSContainerPane>
        </LoomOSPaneContainer>
      </div>
    </div>

    </DesktopAppWrapper>  );
}
