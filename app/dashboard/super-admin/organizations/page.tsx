
'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { 
  Building2, 
  Search, 
  Plus, 
  MoreVertical,
  Edit,
  Trash2,
  Power,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { DesktopAppWrapper } from '@/components/webos/desktop-app-wrapper';

interface Organization {
  id: string;
  name: string;
  slug: string;
  type: string;
  subdomain: string | null;
  customDomain: string | null;
  email: string | null;
  phone: string | null;
  planType: string;
  subscriptionStatus: string;
  isActive: boolean;
  isSuspended: boolean;
  maxUsers: number;
  _count: {
    users: number;
  };
  createdAt: string;
  updatedAt: string;
}

export default function OrganizationsManagement() {
  const { data: session, status } = useSession() || {};
  const router = useRouter();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [filteredOrgs, setFilteredOrgs] = useState<Organization[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
      return;
    }

    if (session?.user?.role !== 'SUPER_ADMIN') {
      toast.error('Access denied');
      router.push('/dashboard');
      return;
    }

    fetchOrganizations();
  }, [session, status, router]);

  useEffect(() => {
    let filtered = organizations;

    if (searchTerm) {
      filtered = filtered.filter(org => 
        org.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.slug.toLowerCase().includes(searchTerm.toLowerCase()) ||
        org.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(org => {
        if (statusFilter === 'active') return org.isActive && !org.isSuspended;
        if (statusFilter === 'suspended') return org.isSuspended;
        if (statusFilter === 'inactive') return !org.isActive;
        return true;
      });
    }

    setFilteredOrgs(filtered);
  }, [searchTerm, statusFilter, organizations]);

  const fetchOrganizations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/super-admin/organizations');
      if (!response.ok) throw new Error('Failed to fetch organizations');
      const data = await response.json();
      setOrganizations(data);
      setFilteredOrgs(data);
    } catch (error) {
      console.error('Error fetching organizations:', error);
      toast.error('Failed to load organizations');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleSuspend = async (org: Organization) => {
    try {
      const response = await fetch(`/api/super-admin/organizations/${org.id}/suspend`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isSuspended: !org.isSuspended })
      });

      if (!response.ok) throw new Error('Failed to update organization');
      
      toast.success(`Organization ${org.isSuspended ? 'reactivated' : 'suspended'}`);
      fetchOrganizations();
    } catch (error) {
      console.error('Error updating organization:', error);
      toast.error('Failed to update organization');
    }
  };

  const handleDelete = async (org: Organization) => {
    if (!confirm(`Are you sure you want to delete "${org.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/super-admin/organizations/${org.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to delete organization');
      
      toast.success('Organization deleted');
      fetchOrganizations();
    } catch (error) {
      console.error('Error deleting organization:', error);
      toast.error('Failed to delete organization');
    }
  };

  const getStatusBadge = (org: Organization) => {
    if (org.isSuspended) {
      return <Badge variant="destructive">Suspended</Badge>;
    }
    if (!org.isActive) {
      return <Badge variant="secondary">Inactive</Badge>;
    }
    return <Badge variant="default" className="bg-[var(--semantic-success)]">Active</Badge>;
  };

  const getPlanBadge = (planType: string) => {
    const variants: Record<string, any> = {
      trial: 'secondary',
      basic: 'default',
      professional: 'default',
      enterprise: 'default'
    };
    return <Badge variant={variants[planType] || 'default'}>{planType.toUpperCase()}</Badge>;
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <DesktopAppWrapper
      title="Organizations"

// Back handled in toolbar
      // onBack={() => router.push('/dashboard/super-admin')}
      toolbar={
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          New Organization
        </Button>
      }
    >
      <div className="space-y-4">

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, slug, or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-[200px]">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Organizations Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Organizations ({filteredOrgs.length})</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Domain</TableHead>
                  <TableHead>Users</TableHead>
                  <TableHead>Plan</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredOrgs.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8">
                      <div className="flex flex-col items-center gap-2">
                        <Building2 className="h-8 w-8 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">
                          No organizations found
                        </p>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredOrgs.map((org) => (
                    <TableRow key={org.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{org.name}</div>
                          <div className="text-xs text-muted-foreground">{org.slug}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {org.customDomain || (org.subdomain ? `${org.subdomain}.yoursaas.com` : '-')}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">
                          {org._count.users} / {org.maxUsers}
                        </div>
                      </TableCell>
                      <TableCell>
                        {getPlanBadge(org.planType)}
                      </TableCell>
                      <TableCell>
                        {getStatusBadge(org)}
                      </TableCell>
                      <TableCell>
                        <div className="text-xs text-muted-foreground">
                          {new Date(org.createdAt).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => {
                              setSelectedOrg(org);
                              setIsEditDialogOpen(true);
                            }}>
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleToggleSuspend(org)}>
                              <Power className="h-4 w-4 mr-2" />
                              {org.isSuspended ? 'Reactivate' : 'Suspend'}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDelete(org)}
                              className="text-[var(--semantic-error)]"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Create Organization Dialog */}
      <CreateOrganizationDialog 
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={fetchOrganizations}
      />

      {/* Edit Organization Dialog */}
      {selectedOrg && (
        <EditOrganizationDialog
          open={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          organization={selectedOrg}
          onSuccess={fetchOrganizations}
        />
      )}
      </div>
    </DesktopAppWrapper>
  );
}

function CreateOrganizationDialog({ 
  open, 
  onOpenChange, 
  onSuccess 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void; 
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    type: 'CONDO_ASSOCIATION',
    email: '',
    phone: '',
    planType: 'trial',
    maxUsers: 100
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const response = await fetch('/api/super-admin/organizations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create organization');
      }

      toast.success('Organization created successfully');
      onOpenChange(false);
      onSuccess();
      
      // Reset form
      setFormData({
        name: '',
        slug: '',
        type: 'CONDO_ASSOCIATION',
        email: '',
        phone: '',
        planType: 'trial',
        maxUsers: 100
      });
    } catch (error: any) {
      console.error('Error creating organization:', error);
      toast.error(error.message || 'Failed to create organization');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create New Organization</DialogTitle>
            <DialogDescription>
              Add a new organization to the platform
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Organization Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                    setFormData({ ...formData, name, slug });
                  }}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="slug">Slug *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Organization Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CONDO_ASSOCIATION">Condo Association</SelectItem>
                    <SelectItem value="HOA">HOA</SelectItem>
                    <SelectItem value="COOPERATIVE">Cooperative</SelectItem>
                    <SelectItem value="NONPROFIT">Non-Profit</SelectItem>
                    <SelectItem value="COMMUNITY_GROUP">Community Group</SelectItem>
                    <SelectItem value="CLUB">Club</SelectItem>
                    <SelectItem value="CUSTOM">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="planType">Plan Type</Label>
                <Select
                  value={formData.planType}
                  onValueChange={(value) => setFormData({ ...formData, planType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trial">Trial</SelectItem>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="maxUsers">Max Users</Label>
              <Input
                id="maxUsers"
                type="number"
                value={formData.maxUsers}
                onChange={(e) => setFormData({ ...formData, maxUsers: parseInt(e.target.value) })}
                min="1"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Creating...' : 'Create Organization'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function EditOrganizationDialog({ 
  open, 
  onOpenChange, 
  organization,
  onSuccess 
}: { 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  organization: Organization;
  onSuccess: () => void;
}) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: organization.name,
    type: organization.type,
    email: organization.email || '',
    phone: organization.phone || '',
    planType: organization.planType,
    maxUsers: organization.maxUsers,
    subdomain: organization.subdomain || '',
    customDomain: organization.customDomain || ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setLoading(true);
      const response = await fetch(`/api/super-admin/organizations/${organization.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to update organization');

      toast.success('Organization updated successfully');
      onOpenChange(false);
      onSuccess();
    } catch (error) {
      console.error('Error updating organization:', error);
      toast.error('Failed to update organization');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Edit Organization</DialogTitle>
            <DialogDescription>
              Update organization settings
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Organization Name</Label>
              <Input
                id="edit-name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-type">Organization Type</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value) => setFormData({ ...formData, type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="CONDO_ASSOCIATION">Condo Association</SelectItem>
                    <SelectItem value="HOA">HOA</SelectItem>
                    <SelectItem value="COOPERATIVE">Cooperative</SelectItem>
                    <SelectItem value="NONPROFIT">Non-Profit</SelectItem>
                    <SelectItem value="COMMUNITY_GROUP">Community Group</SelectItem>
                    <SelectItem value="CLUB">Club</SelectItem>
                    <SelectItem value="CUSTOM">Custom</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-planType">Plan Type</Label>
                <Select
                  value={formData.planType}
                  onValueChange={(value) => setFormData({ ...formData, planType: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="trial">Trial</SelectItem>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="professional">Professional</SelectItem>
                    <SelectItem value="enterprise">Enterprise</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-email">Email</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-phone">Phone</Label>
                <Input
                  id="edit-phone"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-subdomain">Subdomain</Label>
                <Input
                  id="edit-subdomain"
                  value={formData.subdomain}
                  onChange={(e) => setFormData({ ...formData, subdomain: e.target.value })}
                  placeholder="e.g., myorg"
                />
                <p className="text-xs text-muted-foreground">
                  Will be: {formData.subdomain || 'subdomain'}.yoursaas.com
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-customDomain">Custom Domain</Label>
                <Input
                  id="edit-customDomain"
                  value={formData.customDomain}
                  onChange={(e) => setFormData({ ...formData, customDomain: e.target.value })}
                  placeholder="e.g., myorg.com"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-maxUsers">Max Users</Label>
              <Input
                id="edit-maxUsers"
                type="number"
                value={formData.maxUsers}
                onChange={(e) => setFormData({ ...formData, maxUsers: parseInt(e.target.value) })}
                min="1"
              />
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Updating...' : 'Update Organization'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
