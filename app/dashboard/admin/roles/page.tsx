
'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import {
  ShieldCheck,
  Plus,
  Edit,
  Trash2,
  Users,
  Settings,
  Lock,
  Check,
  X,
  Search,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { DesktopAppWrapper } from '@/components/webos/desktop-app-wrapper';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';

interface Permission {
  id: string;
  name: string;
  description: string | null;
  category: string;
  resource: string;
  action: string;
}

interface CustomRole {
  id: string;
  name: string;
  description: string | null;
  basedOn: string | null;
  isSystem: boolean;
  organizationId: string | null;
  organization?: {
    id: string;
    name: string;
  } | null;
  rolePermissions: {
    permission: Permission;
  }[];
  _count: {
    userRoles: number;
  };
}

export default function RolesManagementPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [roles, setRoles] = useState<CustomRole[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [groupedPermissions, setGroupedPermissions] = useState<Record<string, Permission[]>>({});
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<CustomRole | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    basedOn: '',
    permissionIds: [] as string[],
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    } else if (status === 'authenticated') {
      fetchRoles();
      fetchPermissions();
    }
  }, [status, router]);

  const fetchRoles = async () => {
    try {
      const response = await fetch('/api/roles');
      if (!response.ok) throw new Error('Failed to fetch roles');
      const data = await response.json();
      setRoles(data.roles);
    } catch (error) {
      console.error('Error fetching roles:', error);
      toast.error('Failed to load roles');
    }
  };

  const fetchPermissions = async () => {
    try {
      const response = await fetch('/api/permissions');
      if (!response.ok) throw new Error('Failed to fetch permissions');
      const data = await response.json();
      setPermissions(data.permissions);
      setGroupedPermissions(data.groupedPermissions);
    } catch (error) {
      console.error('Error fetching permissions:', error);
      toast.error('Failed to load permissions');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRole = () => {
    setFormData({
      name: '',
      description: '',
      basedOn: '',
      permissionIds: [],
    });
    setIsCreateDialogOpen(true);
  };

  const handleEditRole = (role: CustomRole) => {
    setSelectedRole(role);
    setFormData({
      name: role.name,
      description: role.description || '',
      basedOn: role.basedOn || '',
      permissionIds: role.rolePermissions.map(rp => rp.permission.id),
    });
    setIsEditDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const url = isEditDialogOpen ? `/api/roles/${selectedRole?.id}` : '/api/roles';
      const method = isEditDialogOpen ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to save role');
      }

      toast.success(`Role ${isEditDialogOpen ? 'updated' : 'created'} successfully`);
      setIsCreateDialogOpen(false);
      setIsEditDialogOpen(false);
      fetchRoles();
    } catch (error: any) {
      console.error('Error saving role:', error);
      toast.error(error.message || 'Failed to save role');
    }
  };

  const handleDeleteRole = async (roleId: string) => {
    if (!confirm('Are you sure you want to delete this role?')) return;

    try {
      const response = await fetch(`/api/roles/${roleId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to delete role');
      }

      toast.success('Role deleted successfully');
      fetchRoles();
    } catch (error: any) {
      console.error('Error deleting role:', error);
      toast.error(error.message || 'Failed to delete role');
    }
  };

  const togglePermission = (permissionId: string) => {
    setFormData(prev => ({
      ...prev,
      permissionIds: prev.permissionIds.includes(permissionId)
        ? prev.permissionIds.filter(id => id !== permissionId)
        : [...prev.permissionIds, permissionId],
    }));
  };

  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <DesktopAppWrapper
        title="Roles & Permissions"
        icon={<ShieldCheck />}
        gradient="from-purple-500 to-pink-600"
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
            <p className="text-muted-foreground">Loading roles...</p>
          </div>
        </div>
      </DesktopAppWrapper>
    );
  }

  return (
    <DesktopAppWrapper
      title="Roles & Permissions"
      icon={<ShieldCheck />}
      gradient="from-purple-500 to-pink-600"
    >
      <div className="flex flex-col h-full">
        <div className="p-6 border-b bg-background/95">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-2xl font-bold">Roles & Permissions</h1>
              <p className="text-sm text-muted-foreground">
                Manage custom roles and permissions for your organization
              </p>
            </div>
            <Button onClick={handleCreateRole}>
              <Plus className="w-4 h-4 mr-2" />
              Create Role
            </Button>
          </div>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search roles..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredRoles.map((role) => (
              <Card key={role.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="flex items-center gap-2">
                        {role.name}
                        {role.isSystem && (
                          <Badge variant="secondary" className="text-xs">
                            <Lock className="w-3 h-3 mr-1" />
                            System
                          </Badge>
                        )}
                      </CardTitle>
                      {role.organization && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {role.organization.name}
                        </p>
                      )}
                    </div>
                    {!role.isSystem && (
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleEditRole(role)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteRole(role.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                  {role.description && (
                    <CardDescription className="mt-2">
                      {role.description}
                    </CardDescription>
                  )}
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {role.basedOn && (
                      <div className="flex items-center gap-2 text-sm">
                        <Settings className="w-4 h-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Based on:</span>
                        <Badge variant="outline">{role.basedOn}</Badge>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {role._count.userRoles} {role._count.userRoles === 1 ? 'user' : 'users'}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Check className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">
                        {role.rolePermissions.length} {role.rolePermissions.length === 1 ? 'permission' : 'permissions'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </ScrollArea>
      </div>

      <Dialog open={isCreateDialogOpen || isEditDialogOpen} onOpenChange={(open) => {
        setIsCreateDialogOpen(false);
        setIsEditDialogOpen(false);
      }}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditDialogOpen ? 'Edit Role' : 'Create New Role'}
            </DialogTitle>
            <DialogDescription>
              {isEditDialogOpen 
                ? 'Update role details and permissions'
                : 'Define a new role with specific permissions'
              }
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Role Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Finance Manager"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what this role does..."
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="basedOn">Based On</Label>
              <Select
                value={formData.basedOn}
                onValueChange={(value) => setFormData(prev => ({ ...prev, basedOn: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a base role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">None</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                  <SelectItem value="BOARD_MEMBER">Board Member</SelectItem>
                  <SelectItem value="RESIDENT">Resident</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Permissions</Label>
              <div className="border rounded-lg p-4 space-y-4">
                {Object.entries(groupedPermissions).map(([category, perms]) => (
                  <div key={category} className="space-y-2">
                    <h4 className="font-medium text-sm">{category}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {perms.map((permission) => (
                        <div key={permission.id} className="flex items-start space-x-2">
                          <Checkbox
                            id={permission.id}
                            checked={formData.permissionIds.includes(permission.id)}
                            onCheckedChange={() => togglePermission(permission.id)}
                          />
                          <div className="grid gap-1.5 leading-none">
                            <label
                              htmlFor={permission.id}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                              {permission.name}
                            </label>
                            {permission.description && (
                              <p className="text-xs text-muted-foreground">
                                {permission.description}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsCreateDialogOpen(false);
                  setIsEditDialogOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                {isEditDialogOpen ? 'Update Role' : 'Create Role'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </DesktopAppWrapper>
  );
}
