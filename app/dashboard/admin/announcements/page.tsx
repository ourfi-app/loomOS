'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { 
  Bell, 
  Plus, 
  Edit, 
  Trash2, 
  Megaphone, 
  AlertCircle,
  Calendar,
  User,
  Target,
  AlertOctagon
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  WebOSPaneContainer,
  WebOSContainerPane,
  WebOSListPane,
  WebOSDetailPane,
  WebOSListItem,
  WebOSNavListItem,
  WebOSGroupBox
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
import { useDeepLinkSelection } from '@/hooks/use-deep-link';

interface Announcement {
  id: string;
  title: string;
  content: string;
  priority: string;
  targetRole: string | null;
  isActive: boolean;
  author: {
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface FilterOption {
  id: string;
  label: string;
  count?: number;
  filter: (announcements: Announcement[]) => Announcement[];
}

export default function AnnouncementsPage() {
  const session = useSession();
  const status = session?.status || 'loading';
  const router = useRouter();
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    priority: 'normal',
    targetRole: 'all'
  });

  const userRole = (session?.data?.user as any)?.role;

  // Deep Link Support: Auto-select announcement when navigating from notifications
  useDeepLinkSelection({
    items: announcements,
    onSelect: (item) => setSelectedAnnouncement(item),
    enabled: announcements.length > 0,
  });

  useEffect(() => {
    if (status === 'authenticated' && userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
      router.push('/dashboard');
    }
  }, [status, userRole, router]);

  useEffect(() => {
    if (userRole === 'ADMIN' || userRole === 'SUPER_ADMIN') {
      fetchAnnouncements();
    }
  }, [userRole]);

  const fetchAnnouncements = async () => {
    try {
      const response = await fetch('/api/admin/announcements');
      if (response.ok) {
        const data = await response.json();
        setAnnouncements(data.announcements || []);
      }
    } catch (error) {
      console.error('Failed to fetch announcements:', error);
      toast.error('Failed to load announcements');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAnnouncement = async () => {
    if (!formData.title || !formData.content) {
      toast.error('Title and content are required');
      return;
    }

    try {
      const response = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          targetRole: formData.targetRole === 'all' ? null : formData.targetRole
        })
      });

      if (response.ok) {
        toast.success('Announcement created successfully');
        setIsDialogOpen(false);
        resetForm();
        fetchAnnouncements();
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to create announcement');
      }
    } catch (error) {
      console.error('Error creating announcement:', error);
      toast.error('Failed to create announcement');
    }
  };

  const handleUpdateAnnouncement = async () => {
    if (!editingAnnouncement) return;

    try {
      const response = await fetch(`/api/admin/announcements/${editingAnnouncement.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          targetRole: formData.targetRole === 'all' ? null : formData.targetRole
        })
      });

      if (response.ok) {
        toast.success('Announcement updated successfully');
        setIsDialogOpen(false);
        setEditingAnnouncement(null);
        resetForm();
        fetchAnnouncements();
        if (selectedAnnouncement?.id === editingAnnouncement.id) {
          const updated = await fetch('/api/admin/announcements').then(r => r.json());
          const updatedAnn = updated.announcements?.find((a: Announcement) => a.id === editingAnnouncement.id);
          if (updatedAnn) setSelectedAnnouncement(updatedAnn);
        }
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to update announcement');
      }
    } catch (error) {
      console.error('Error updating announcement:', error);
      toast.error('Failed to update announcement');
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    if (!confirm('Are you sure you want to delete this announcement?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/announcements/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        toast.success('Announcement deleted successfully');
        if (selectedAnnouncement?.id === id) {
          setSelectedAnnouncement(null);
        }
        fetchAnnouncements();
      } else {
        toast.error('Failed to delete announcement');
      }
    } catch (error) {
      console.error('Error deleting announcement:', error);
      toast.error('Failed to delete announcement');
    }
  };

  const handleToggleActive = async (id: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/announcements/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive })
      });

      if (response.ok) {
        toast.success(`Announcement ${!isActive ? 'activated' : 'deactivated'}`);
        fetchAnnouncements();
        if (selectedAnnouncement?.id === id) {
          setSelectedAnnouncement({ ...selectedAnnouncement, isActive: !isActive });
        }
      } else {
        toast.error('Failed to update announcement');
      }
    } catch (error) {
      console.error('Error updating announcement:', error);
      toast.error('Failed to update announcement');
    }
  };

  const openEditDialog = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      content: announcement.content,
      priority: announcement.priority,
      targetRole: announcement.targetRole || 'all'
    });
    setIsDialogOpen(true);
  };

  const resetForm = () => {
    setFormData({
      title: '',
      content: '',
      priority: 'normal',
      targetRole: 'all'
    });
    setEditingAnnouncement(null);
  };

  const getPriorityVariant = (priority: string): "default" | "secondary" | "destructive" => {
    const variants: Record<string, "default" | "secondary" | "destructive"> = {
      urgent: 'destructive',
      normal: 'default',
      low: 'secondary'
    };
    return variants[priority] || 'default';
  };

  // Filter options
  const filterOptions: FilterOption[] = [
    {
      id: 'all',
      label: 'All Announcements',
      count: announcements.length,
      filter: (announcements) => announcements
    },
    {
      id: 'active',
      label: 'Active',
      count: announcements.filter(a => a.isActive).length,
      filter: (announcements) => announcements.filter(a => a.isActive)
    },
    {
      id: 'inactive',
      label: 'Inactive',
      count: announcements.filter(a => !a.isActive).length,
      filter: (announcements) => announcements.filter(a => !a.isActive)
    },
    {
      id: 'urgent',
      label: 'Urgent',
      count: announcements.filter(a => a.priority === 'urgent').length,
      filter: (announcements) => announcements.filter(a => a.priority === 'urgent')
    },
    {
      id: 'normal',
      label: 'Normal Priority',
      count: announcements.filter(a => a.priority === 'normal').length,
      filter: (announcements) => announcements.filter(a => a.priority === 'normal')
    },
    {
      id: 'low',
      label: 'Low Priority',
      count: announcements.filter(a => a.priority === 'low').length,
      filter: (announcements) => announcements.filter(a => a.priority === 'low')
    }
  ];

  // Apply filters and search
  const currentFilter = filterOptions.find(f => f.id === selectedFilter);
  const filteredAnnouncements = currentFilter
    ? currentFilter.filter(announcements).filter(announcement => 
        announcement.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        announcement.content?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  // Convert announcements to list items
  const listItems = filteredAnnouncements.map(announcement => ({
    id: announcement.id,
    title: announcement.title,
    subtitle: announcement.content.length > 60 
      ? announcement.content.substring(0, 60) + '...'
      : announcement.content,
    timestamp: format(new Date(announcement.createdAt), 'MMM dd, yyyy'),
    selected: selectedAnnouncement?.id === announcement.id,
    badge: (
      <div className="flex gap-1">
        <Badge variant={getPriorityVariant(announcement.priority)} className="text-xs">
          {announcement.priority}
        </Badge>
        <Badge variant={announcement.isActive ? 'default' : 'secondary'} className="text-xs">
          {announcement.isActive ? 'Active' : 'Inactive'}
        </Badge>
      </div>
    ),
    onClick: () => setSelectedAnnouncement(announcement)
  }));

  if (status === 'loading' || loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading announcements...</p>
        </div>
      </div>
    );
  }

  if (userRole !== 'ADMIN' && userRole !== 'SUPER_ADMIN') {
    return null;
  }

  return (
    <DesktopAppWrapper
      title="Announcements"
      icon={<Megaphone className="w-5 h-5" />}
      gradient={APP_COLORS.admin.light}
    >
      <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Megaphone className="h-6 w-6 text-blue-600" />
            Announcements
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Create and manage community announcements
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              New Announcement
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingAnnouncement ? 'Edit Announcement' : 'New Announcement'}</DialogTitle>
              <DialogDescription>
                {editingAnnouncement ? 'Update announcement details' : 'Create a new announcement for residents'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title*</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Announcement title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">Content*</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Announcement details..."
                  rows={6}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="urgent">Urgent</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="low">Low</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetRole">Target Audience</Label>
                  <Select value={formData.targetRole} onValueChange={(value) => setFormData({ ...formData, targetRole: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Residents</SelectItem>
                      <SelectItem value="ADMIN">Administrators</SelectItem>
                      <SelectItem value="BOARD_MEMBER">Board Members</SelectItem>
                      <SelectItem value="RESIDENT">Residents Only</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => {
                setIsDialogOpen(false);
                resetForm();
              }}>
                Cancel
              </Button>
              <Button onClick={editingAnnouncement ? handleUpdateAnnouncement : handleCreateAnnouncement}>
                {editingAnnouncement ? 'Update' : 'Create'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* 3-Pane Layout */}
      <div className="flex-1 overflow-hidden">
        <WebOSPaneContainer>
          {/* Navigation Pane - Filters */}
          <WebOSContainerPane id="filters" type="navigation" width={240}>
            <div className="p-4 space-y-1">
              <h3 className="text-xs font-semibold text-muted-foreground uppercase mb-3">Filters</h3>
              {filterOptions.map(filter => (
                <WebOSNavListItem
                  key={filter.id}
                  label={filter.label}
                  count={filter.count}
                  selected={selectedFilter === filter.id}
                  onClick={() => {
                    setSelectedFilter(filter.id);
                    setSelectedAnnouncement(null);
                  }}
                />
              ))}
            </div>
          </WebOSContainerPane>

          {/* List Pane - Announcements */}
          <WebOSContainerPane id="list" type="list" width={360}>
            <WebOSListPane
              searchPlaceholder="Search announcements..."
              searchValue={searchTerm}
              onSearchChange={setSearchTerm}
              items={listItems}
              emptyMessage="No announcements found"
              loading={loading}
            />
          </WebOSContainerPane>

          {/* Detail Pane - Announcement Details */}
          <WebOSContainerPane id="detail" type="detail" fill>
            <WebOSDetailPane
              isEmpty={!selectedAnnouncement}
              emptyIcon={<Megaphone className="h-16 w-16" />}
              emptyMessage="No announcement selected"
              emptySubMessage="Select an announcement from the list to view details"
              title={selectedAnnouncement?.title}
              subtitle={selectedAnnouncement ? `Created ${format(new Date(selectedAnnouncement.createdAt), 'MMM dd, yyyy')}` : undefined}
              actions={selectedAnnouncement && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEditDialog(selectedAnnouncement)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleToggleActive(selectedAnnouncement.id, selectedAnnouncement.isActive)}
                  >
                    <Bell className="h-4 w-4 mr-2" />
                    {selectedAnnouncement.isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDeleteAnnouncement(selectedAnnouncement.id)}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              )}
            >
              {selectedAnnouncement && (
                <div className="space-y-6">
                  {/* Status */}
                  <div className="flex items-center gap-4">
                    <Badge variant={getPriorityVariant(selectedAnnouncement.priority)} className="text-sm">
                      {selectedAnnouncement.priority} priority
                    </Badge>
                    <Badge variant={selectedAnnouncement.isActive ? 'default' : 'secondary'}>
                      {selectedAnnouncement.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    {selectedAnnouncement.targetRole && (
                      <Badge variant="outline">
                        {selectedAnnouncement.targetRole.replace('_', ' ')}
                      </Badge>
                    )}
                  </div>

                  {/* Content */}
                  <WebOSGroupBox title="Content">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">
                      {selectedAnnouncement.content}
                    </p>
                  </WebOSGroupBox>

                  {/* Metadata */}
                  <WebOSGroupBox title="Details">
                    <div className="space-y-4">
                      <div className="flex items-start gap-3">
                        <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Author</p>
                          <p className="text-sm text-muted-foreground">{selectedAnnouncement.author.name}</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Created</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(selectedAnnouncement.createdAt), 'MMMM dd, yyyy \'at\' h:mm a')}
                          </p>
                        </div>
                      </div>
                      {selectedAnnouncement.updatedAt !== selectedAnnouncement.createdAt && (
                        <div className="flex items-start gap-3">
                          <Calendar className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">Last Updated</p>
                            <p className="text-sm text-muted-foreground">
                              {format(new Date(selectedAnnouncement.updatedAt), 'MMMM dd, yyyy \'at\' h:mm a')}
                            </p>
                          </div>
                        </div>
                      )}
                      {selectedAnnouncement.targetRole && (
                        <div className="flex items-start gap-3">
                          <Target className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm font-medium">Target Audience</p>
                            <p className="text-sm text-muted-foreground">
                              {selectedAnnouncement.targetRole.replace('_', ' ')}
                            </p>
                          </div>
                        </div>
                      )}
                      <div className="flex items-start gap-3">
                        <AlertOctagon className="h-5 w-5 text-muted-foreground mt-0.5" />
                        <div>
                          <p className="text-sm font-medium">Priority Level</p>
                          <p className="text-sm text-muted-foreground capitalize">
                            {selectedAnnouncement.priority}
                          </p>
                        </div>
                      </div>
                    </div>
                  </WebOSGroupBox>
                </div>
              )}
            </WebOSDetailPane>
          </WebOSContainerPane>
        </WebOSPaneContainer>
      </div>
    </div>

    </DesktopAppWrapper>  );
}
