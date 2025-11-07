
'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Loader2,
  User,
  Users,
  Calendar,
  FileEdit,
  AlertCircle,
  Search
} from 'lucide-react';
import { format } from 'date-fns';
import { hasAdminAccess } from '@/lib/auth';
import {
  LoomOSPaneContainer,
  LoomOSListPane,
  LoomOSDetailPane,
  LoomOSNavListItem,
  LoomOSGroupBox,
  LoomOSListItemEnhanced,
  LoomOSEmptyState,
} from '@/components/webos';
import { DesktopAppWrapper } from '@/components/webos/desktop-app-wrapper';
import { APP_COLORS } from '@/lib/app-design-system';
import { useDeepLinkSelection } from '@/hooks/use-deep-link';

interface UpdateRequest {
  id: string;
  updateType: string;
  currentData: any;
  requestedData: any;
  reason: string | null;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: string;
  reviewedAt: string | null;
  reviewNotes: string | null;
  user: {
    id: string;
    name: string | null;
    firstName: string | null;
    lastName: string | null;
    email: string;
    unitNumber: string | null;
  };
  requester: {
    id: string;
    name: string | null;
    firstName: string | null;
    lastName: string | null;
    email: string;
  };
  reviewedBy: {
    id: string;
    name: string | null;
    firstName: string | null;
    lastName: string | null;
    email: string;
  } | null;
}

type FilterType = 'all' | 'pending' | 'approved' | 'rejected';

export default function DirectoryRequestsPage() {
  const session = useSession();
  const status = session?.status || 'loading';
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<UpdateRequest[]>([]);
  const [selectedRequest, setSelectedRequest] = useState<UpdateRequest | null>(null);
  const [selectedFilter, setSelectedFilter] = useState<FilterType>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [reviewAction, setReviewAction] = useState<'APPROVED' | 'REJECTED'>('APPROVED');
  const [reviewNotes, setReviewNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Deep Link Support: Auto-select request when navigating from notifications
  useDeepLinkSelection({
    items: requests,
    onSelect: (item) => setSelectedRequest(item),
    enabled: requests.length > 0,
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/');
    } else if (!hasAdminAccess((session?.data?.user as any)?.role)) {
      router.push('/dashboard');
      toast({
        title: 'Access Denied',
        description: 'You do not have permission to access this page',
        variant: 'destructive',
      });
    }
  }, [session, status, router, toast]);

  useEffect(() => {
    if (session?.data?.user?.role === 'ADMIN') {
      fetchRequests();
    }
  }, [session]);

  const fetchRequests = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/directory-update-requests');
      const data = await response.json();
      setRequests(data.requests || []);
    } catch (error) {
      console.error('Error fetching requests:', error);
      toast({
        title: 'Error',
        description: 'Failed to load update requests',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReview = (request: UpdateRequest, action: 'APPROVED' | 'REJECTED') => {
    setSelectedRequest(request);
    setReviewAction(action);
    setReviewNotes('');
    setReviewDialogOpen(true);
  };

  const submitReview = async () => {
    if (!selectedRequest) return;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/directory-update-requests/${selectedRequest.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: reviewAction,
          reviewNotes: reviewNotes.trim() || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to review request');
      }

      toast({
        title: 'Success',
        description: `Request ${reviewAction.toLowerCase()} successfully`,
      });
      
      setReviewDialogOpen(false);
      setSelectedRequest(null);
      setReviewNotes('');
      fetchRequests();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to review request',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getUserDisplayName = (user: any) => {
    return user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email;
  };

  const renderDataComparison = (request: UpdateRequest) => {
    const current = request.currentData as any || {};
    const requested = request.requestedData as any || {};
    
    const fields = [
      { key: 'firstName', label: 'First Name' },
      { key: 'lastName', label: 'Last Name' },
      { key: 'name', label: 'Full Name' },
      { key: 'unitNumber', label: 'Unit Number' },
      { key: 'phone', label: 'Phone Number' },
    ];

    const changes = fields.filter(field => current[field.key] !== requested[field.key]);

    if (changes.length === 0) {
      return <p className="text-sm text-gray-500">No changes detected</p>;
    }

    return (
      <div className="space-y-3">
        {changes.map(field => (
          <div key={field.key} className="bg-gray-50 p-3 rounded-lg">
            <p className="text-sm font-medium text-gray-700 mb-2">{field.label}</p>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs text-gray-500 mb-1">Current</p>
                <p className="text-gray-900 line-through">
                  {current[field.key] || <span className="text-gray-400 italic">Not set</span>}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500 mb-1">Requested</p>
                <p className="text-green-600 font-medium">
                  {requested[field.key] || <span className="text-gray-400 italic">Not set</span>}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  // Filter requests
  const filteredRequests = requests.filter(request => {
    // Filter by status
    if (selectedFilter === 'pending' && request.status !== 'PENDING') return false;
    if (selectedFilter === 'approved' && request.status !== 'APPROVED') return false;
    if (selectedFilter === 'rejected' && request.status !== 'REJECTED') return false;

    // Filter by search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const userName = getUserDisplayName(request.user).toLowerCase();
      const requesterName = getUserDisplayName(request.requester).toLowerCase();
      return userName.includes(searchLower) || requesterName.includes(searchLower);
    }

    return true;
  });

  const pendingRequests = requests.filter(r => r.status === 'PENDING');
  const approvedRequests = requests.filter(r => r.status === 'APPROVED');
  const rejectedRequests = requests.filter(r => r.status === 'REJECTED');

  if (loading || status === 'loading') {
    return (
      <DesktopAppWrapper
      title="Directory Requests"
      icon={<Users className="w-5 h-5" />}
      gradient={APP_COLORS.admin.light}
    >
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    </DesktopAppWrapper>
    );
  }

  // SUPER_ADMIN has unrestricted access to everything
  if (!hasAdminAccess((session?.data?.user as any)?.role)) {
    return null;
  }

  return (
    <DesktopAppWrapper
      title="Directory Requests"
      icon={<Users className="w-5 h-5" />}
      gradient={APP_COLORS.admin.light}
    >
      {/* Fixed Header */}
      <div className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-6">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Directory Update Requests</h1>
          <p className="text-sm text-gray-500">
            Review and manage resident directory update requests
          </p>
        </div>
      </div>

      {/* 3-Pane Layout */}
      <LoomOSPaneContainer>
        {/* Navigation Pane */}
        <div className="w-60 flex-shrink-0 border-r border-gray-200 bg-white flex flex-col overflow-hidden">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
              FILTERS
            </h2>
          </div>
          <div className="flex-1 overflow-y-auto p-2">
            <div className="space-y-1">
              <LoomOSNavListItem
                label="All Requests"
                count={requests.length}
                selected={selectedFilter === 'all'}
                onClick={() => setSelectedFilter('all')}
                icon={<FileEdit className="w-4 h-4" />}
              />
              <LoomOSNavListItem
                label="Pending"
                count={pendingRequests.length}
                selected={selectedFilter === 'pending'}
                onClick={() => setSelectedFilter('pending')}
                icon={<Clock className="w-4 h-4 text-orange-600" />}
              />
              <LoomOSNavListItem
                label="Approved"
                count={approvedRequests.length}
                selected={selectedFilter === 'approved'}
                onClick={() => setSelectedFilter('approved')}
                icon={<CheckCircle className="w-4 h-4 text-green-600" />}
              />
              <LoomOSNavListItem
                label="Rejected"
                count={rejectedRequests.length}
                selected={selectedFilter === 'rejected'}
                onClick={() => setSelectedFilter('rejected')}
                icon={<XCircle className="w-4 h-4 text-red-600" />}
              />
            </div>
          </div>
        </div>

        {/* List Pane */}
        <div className="w-96 flex-shrink-0 border-r border-gray-200 flex flex-col bg-white">
          {/* Search Bar */}
          <div className="p-4 border-b border-gray-200">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
          </div>

          {/* List Items */}
          <div className="flex-1 overflow-y-auto">
            {filteredRequests.length === 0 ? (
              <LoomOSEmptyState
                icon={<FileEdit size={48} />}
                title={searchTerm ? 'No requests match your search' : 'No requests found'}
              />
            ) : (
              <div className="divide-y divide-gray-100">
                {filteredRequests.map((request) => (
                  <LoomOSListItemEnhanced
                    key={request.id}
                    selected={selectedRequest?.id === request.id}
                    onClick={() => setSelectedRequest(request)}
                  >
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-medium text-sm text-gray-900 line-clamp-1">
                          {getUserDisplayName(request.user)}
                        </h3>
                        <Badge
                          variant={request.status === 'PENDING' ? 'default' : request.status === 'APPROVED' ? 'default' : 'destructive'}
                          className={
                            request.status === 'PENDING' ? 'bg-orange-100 text-orange-700' :
                            request.status === 'APPROVED' ? 'bg-green-100 text-green-700' : ''
                          }
                        >
                          {request.status}
                        </Badge>
                      </div>
                      <div className="space-y-1 text-xs text-gray-500">
                        <div className="flex items-center gap-1">
                          <User className="w-3 h-3" />
                          <span className="line-clamp-1">
                            By {getUserDisplayName(request.requester)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          <span>{format(new Date(request.createdAt), 'MMM dd, yyyy')}</span>
                        </div>
                      </div>
                    </div>
                  </LoomOSListItemEnhanced>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Detail Pane */}
        <LoomOSDetailPane
          title={selectedRequest ? `Update Request for ${getUserDisplayName(selectedRequest.user)}` : 'No Request Selected'}
          isEmpty={!selectedRequest}
          emptyIcon={<FileEdit size={64} />}
          emptyMessage="Select a request to view details"
        >
          {selectedRequest && (
            <div className="space-y-6">
              {/* Status Badge */}
              <LoomOSGroupBox title="Status">
                <div className="flex items-center gap-3">
                  <Badge
                    variant={selectedRequest.status === 'PENDING' ? 'default' : selectedRequest.status === 'APPROVED' ? 'default' : 'destructive'}
                    className={
                      selectedRequest.status === 'PENDING' ? 'bg-orange-100 text-orange-700' :
                      selectedRequest.status === 'APPROVED' ? 'bg-green-100 text-green-700' : ''
                    }
                  >
                    {selectedRequest.status}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    Submitted {format(new Date(selectedRequest.createdAt), 'MMM dd, yyyy HH:mm')}
                  </span>
                </div>
              </LoomOSGroupBox>

              {/* Requester Info */}
              <LoomOSGroupBox title="Requester">
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-900">{getUserDisplayName(selectedRequest.requester)}</span>
                  </div>
                  {selectedRequest.user.unitNumber && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Unit:</span>
                      <span className="text-gray-900">{selectedRequest.user.unitNumber}</span>
                    </div>
                  )}
                </div>
              </LoomOSGroupBox>

              {/* Reason */}
              {selectedRequest.reason && (
                <LoomOSGroupBox title="Reason">
                  <p className="text-sm text-gray-700">{selectedRequest.reason}</p>
                </LoomOSGroupBox>
              )}

              {/* Requested Changes */}
              <LoomOSGroupBox title="Requested Changes">
                {renderDataComparison(selectedRequest)}
              </LoomOSGroupBox>

              {/* Review Info */}
              {selectedRequest.status !== 'PENDING' && selectedRequest.reviewedBy && (
                <LoomOSGroupBox title="Review">
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-700">
                      Reviewed by <strong>{getUserDisplayName(selectedRequest.reviewedBy)}</strong> on{' '}
                      {format(new Date(selectedRequest.reviewedAt!), 'MMM dd, yyyy HH:mm')}
                    </p>
                    {selectedRequest.reviewNotes && (
                      <div className="bg-gray-50 p-3 rounded-lg mt-2">
                        <p className="text-gray-600">{selectedRequest.reviewNotes}</p>
                      </div>
                    )}
                  </div>
                </LoomOSGroupBox>
              )}

              {/* Actions */}
              {selectedRequest.status === 'PENDING' && (
                <div className="flex gap-3 pt-4">
                  <Button
                    className="flex-1"
                    variant="outline"
                    onClick={() => handleReview(selectedRequest, 'APPROVED')}
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve
                  </Button>
                  <Button
                    className="flex-1"
                    variant="destructive"
                    onClick={() => handleReview(selectedRequest, 'REJECTED')}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject
                  </Button>
                </div>
              )}
            </div>
          )}
        </LoomOSDetailPane>
      </LoomOSPaneContainer>

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {reviewAction === 'APPROVED' ? 'Approve' : 'Reject'} Update Request
            </DialogTitle>
            <DialogDescription>
              {reviewAction === 'APPROVED'
                ? 'Are you sure you want to approve this update? The changes will be applied immediately.'
                : 'Are you sure you want to reject this update? Please provide a reason for the requester.'}
            </DialogDescription>
          </DialogHeader>
          {selectedRequest && (
            <div className="space-y-4 py-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm font-medium text-gray-700">
                  Request for: {getUserDisplayName(selectedRequest.user)}
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reviewNotes">
                  Notes {reviewAction === 'REJECTED' && '(recommended)'}
                </Label>
                <Textarea
                  id="reviewNotes"
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder={
                    reviewAction === 'APPROVED'
                      ? 'Optional notes about this approval...'
                      : 'Please explain why this request is being rejected...'
                  }
                  rows={3}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setReviewDialogOpen(false)}
              disabled={submitting}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={submitReview}
              disabled={submitting}
              variant={reviewAction === 'APPROVED' ? 'default' : 'destructive'}
            >
              {submitting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {reviewAction === 'APPROVED' ? 'Approve' : 'Reject'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DesktopAppWrapper>
  );
}
