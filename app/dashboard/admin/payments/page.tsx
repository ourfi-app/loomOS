'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { DollarSign, Search, Download, CheckCircle, Clock, AlertTriangle, XCircle, User, Mail, Building2, Calendar as CalendarIcon } from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';
import {
  DesktopAppWrapper,
  LoomOSNavigationPane,
  LoomOSDetailPane,
  LoomOSListItemEnhanced,
  LoomOSListDivider,
  LoomOSActionButton,
  LoomOSEmptyState,
  LoomOSLoadingState,
} from '@/components/webos';
import { APP_COLORS } from '@/lib/app-design-system';
import { LoomOSNavListItem } from '@/components/webos/loomos-nav-list-item';

interface Payment {
  id: string;
  user: {
    name: string;
    email: string;
    unitNumber: string;
  };
  amount: number;
  dueDate: string;
  paidDate: string | null;
  status: string;
  type: string;
  description: string | null;
  createdAt: string;
}

type FilterId = 'all' | 'paid' | 'pending' | 'overdue' | 'cancelled';

interface FilterOption {
  id: FilterId;
  label: string;
  count: number;
  filter: (payments: Payment[]) => Payment[];
}

export default function PaymentManagementPage() {
  const session = useSession();
  const status = session?.status || 'loading';
  const router = useRouter();
  const searchParams = useSearchParams();
  const [payments, setPayments] = useState<Payment[]>([]);
  const [filteredPayments, setFilteredPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<FilterId>((searchParams?.get('filter') as FilterId) || 'all');
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);

  const userRole = (session?.data?.user as any)?.role;

  useEffect(() => {
    if (status === 'authenticated' && userRole !== 'ADMIN') {
      router.push('/dashboard');
    }
  }, [status, userRole, router]);

  useEffect(() => {
    if (userRole === 'ADMIN') {
      fetchPayments();
    }
  }, [userRole]);

  useEffect(() => {
    filterPayments();
  }, [payments, searchTerm, selectedFilter]);

  const fetchPayments = async () => {
    try {
      const response = await fetch('/api/admin/payments');
      if (response.ok) {
        const data = await response.json();
        setPayments(data.payments || []);
      }
    } catch (error) {
      console.error('Failed to fetch payments:', error);
      toast.error('Failed to load payments');
    } finally {
      setLoading(false);
    }
  };

  const filterOptions: FilterOption[] = [
    {
      id: 'all',
      label: 'All Payments',
      count: payments.length,
      filter: (payments) => payments,
    },
    {
      id: 'paid',
      label: 'Paid',
      count: payments.filter(p => p.status === 'PAID').length,
      filter: (payments) => payments.filter(p => p.status === 'PAID'),
    },
    {
      id: 'pending',
      label: 'Pending',
      count: payments.filter(p => p.status === 'PENDING').length,
      filter: (payments) => payments.filter(p => p.status === 'PENDING'),
    },
    {
      id: 'overdue',
      label: 'Overdue',
      count: payments.filter(p => p.status === 'OVERDUE').length,
      filter: (payments) => payments.filter(p => p.status === 'OVERDUE'),
    },
    {
      id: 'cancelled',
      label: 'Cancelled',
      count: payments.filter(p => p.status === 'CANCELLED').length,
      filter: (payments) => payments.filter(p => p.status === 'CANCELLED'),
    },
  ];

  const filterPayments = () => {
    const filterOption = filterOptions.find(f => f.id === selectedFilter);
    let filtered = filterOption ? filterOption.filter(payments) : payments;

    if (searchTerm) {
      filtered = filtered.filter(payment =>
        payment.user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        payment.user.unitNumber?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPayments(filtered);
  };

  const handleMarkAsPaid = async (paymentId: string) => {
    try {
      const response = await fetch(`/api/admin/payments/${paymentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'PAID', paidDate: new Date() })
      });

      if (response.ok) {
        toast.success('Payment marked as paid');
        fetchPayments();
        // Update selected payment if it's the one being updated
        if (selectedPayment?.id === paymentId) {
          setSelectedPayment({
            ...selectedPayment,
            status: 'PAID',
            paidDate: new Date().toISOString(),
          });
        }
      } else {
        toast.error('Failed to update payment');
      }
    } catch (error) {
      console.error('Error updating payment:', error);
      toast.error('Failed to update payment');
    }
  };

  const handleExport = () => {
    const csv = [
      ['Name', 'Unit', 'Email', 'Amount', 'Due Date', 'Paid Date', 'Status', 'Type', 'Description'].join(','),
      ...filteredPayments.map(p => [
        p.user.name,
        p.user.unitNumber,
        p.user.email,
        p.amount,
        format(new Date(p.dueDate), 'yyyy-MM-dd'),
        p.paidDate ? format(new Date(p.paidDate), 'yyyy-MM-dd') : '',
        p.status,
        p.type,
        p.description || ''
      ].join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `payments-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    toast.success('Payments exported');
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID':
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'PENDING':
        return <Clock className="h-4 w-4 text-orange-600" />;
      case 'OVERDUE':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'CANCELLED':
        return <XCircle className="h-4 w-4 text-[var(--semantic-text-secondary)]" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      PAID: 'default',
      PENDING: 'secondary',
      OVERDUE: 'destructive',
      CANCELLED: 'outline'
    };
    return <Badge variant={variants[status] || 'secondary'}>{status}</Badge>;
  };

  const stats = {
    totalAmount: payments.reduce((sum, p) => sum + Number(p.amount), 0),
    collectedAmount: payments.filter(p => p.status === 'PAID').reduce((sum, p) => sum + Number(p.amount), 0)
  };

  if (status === 'loading' || loading) {
    return <LoomOSLoadingState message="Loading payments..." />;
  }

  if (userRole !== 'ADMIN') {
    return null;
  }

  const detailActions = selectedPayment ? (
    <>
      <Button variant="outline" onClick={handleExport}>
        <Download className="h-4 w-4 mr-2" />
        Export CSV
      </Button>
      {selectedPayment.status === 'PENDING' && (
        <Button onClick={() => handleMarkAsPaid(selectedPayment.id)}>
          <CheckCircle className="h-4 w-4 mr-2" />
          Mark as Paid
        </Button>
      )}
    </>
  ) : (
    <Button variant="outline" onClick={handleExport}>
      <Download className="h-4 w-4 mr-2" />
      Export CSV
    </Button>
  );

  return (
    <DesktopAppWrapper
      title="Payment Management"
      icon={<DollarSign className="w-5 h-5" />}
      gradient={APP_COLORS.payments?.light || 'from-green-500 to-emerald-600'}
    >
      {/* Pane 1: Filters Navigation */}
      <LoomOSNavigationPane
        title="FILTERS"
        items={filterOptions.map(filter => ({
          id: filter.id,
          label: filter.label,
          count: filter.count,
          active: selectedFilter === filter.id,
          onClick: () => setSelectedFilter(filter.id),
        }))}
      />

      {/* Pane 2: Payment List */}
      <div className="w-[420px] flex-shrink-0 border-r border-[var(--semantic-border-light)] flex flex-col bg-white">
        {/* Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-[var(--semantic-border-light)]">
          <div>
            <h2 className="text-lg font-semibold">Payments</h2>
            <p className="text-xs text-muted-foreground">{filteredPayments.length} payments</p>
          </div>
        </div>

        {/* Search */}
        <div className="px-6 py-4 border-b border-[var(--semantic-border-light)]">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search payments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-10"
            />
          </div>
        </div>

        {/* Payment List */}
        <div className="flex-1 overflow-y-auto">
          {filteredPayments.length > 0 ? (
            filteredPayments.map((payment) => (
              <LoomOSListItemEnhanced
                key={payment.id}
                selected={selectedPayment?.id === payment.id}
                onClick={() => setSelectedPayment(payment)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-medium text-sm truncate">{payment.user.name}</p>
                      {getStatusIcon(payment.status)}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
                      <Building2 className="h-3 w-3" />
                      <span>Unit {payment.user.unitNumber || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="font-semibold text-green-600">
                        ${Number(payment.amount).toFixed(2)}
                      </span>
                      <span className="text-muted-foreground">
                        Due: {format(new Date(payment.dueDate), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  </div>
                  <div className="ml-2">
                    {getStatusBadge(payment.status)}
                  </div>
                </div>
              </LoomOSListItemEnhanced>
            ))
          ) : (
            <LoomOSEmptyState
              icon={<DollarSign size={64} className="text-[var(--semantic-text-tertiary)]" />}
              title="No payments found"
              description="Try adjusting your search or filter"
            />
          )}
        </div>
      </div>

      {/* Pane 3: Payment Detail */}
      <LoomOSDetailPane
        title={selectedPayment ? `${selectedPayment.user.name}` : 'Payment Details'}
        subtitle={selectedPayment ? `Unit ${selectedPayment.user.unitNumber || 'N/A'}` : undefined}
        actions={detailActions}
        isEmpty={!selectedPayment}
        emptyIcon={<DollarSign size={64} />}
        emptyMessage="No payment selected"
        emptySubMessage="Select a payment from the list to view details"
      >
        {selectedPayment && (
          <div className="space-y-6">
            {/* Status Banner */}
            <div className={`p-4 rounded-lg border ${
              selectedPayment.status === 'PAID' ? 'bg-green-50 border-green-200' :
              selectedPayment.status === 'PENDING' ? 'bg-orange-50 border-orange-200' :
              selectedPayment.status === 'OVERDUE' ? 'bg-red-50 border-red-200' :
              'bg-[var(--semantic-bg-subtle)] border-[var(--semantic-border-light)]'
            }`}>
              <div className="flex items-center gap-3">
                {getStatusIcon(selectedPayment.status)}
                <div className="flex-1">
                  <p className="font-semibold">{selectedPayment.status}</p>
                  <p className="text-xs text-muted-foreground">
                    {selectedPayment.status === 'PAID' && selectedPayment.paidDate
                      ? `Paid on ${format(new Date(selectedPayment.paidDate), 'MMM dd, yyyy')}`
                      : selectedPayment.status === 'PENDING'
                      ? 'Payment is awaiting processing'
                      : selectedPayment.status === 'OVERDUE'
                      ? 'Payment is past due date'
                      : 'Payment was cancelled'}
                  </p>
                </div>
              </div>
            </div>

            {/* Payment Information */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Payment Information</h3>
              <div className="space-y-3">
                <div className="flex items-start justify-between py-2">
                  <span className="text-sm text-muted-foreground">Amount</span>
                  <span className="text-lg font-bold text-green-600">
                    ${Number(selectedPayment.amount).toFixed(2)}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-muted-foreground">Payment Type</span>
                  <span className="text-sm font-medium capitalize">
                    {selectedPayment.type.replace('_', ' ')}
                  </span>
                </div>
                <Separator />
                <div className="flex items-center justify-between py-2">
                  <span className="text-sm text-muted-foreground">Due Date</span>
                  <span className="text-sm font-medium">
                    {format(new Date(selectedPayment.dueDate), 'MMM dd, yyyy')}
                  </span>
                </div>
                {selectedPayment.paidDate && (
                  <>
                    <Separator />
                    <div className="flex items-center justify-between py-2">
                      <span className="text-sm text-muted-foreground">Paid Date</span>
                      <span className="text-sm font-medium">
                        {format(new Date(selectedPayment.paidDate), 'MMM dd, yyyy')}
                      </span>
                    </div>
                  </>
                )}
                {selectedPayment.description && (
                  <>
                    <Separator />
                    <div className="py-2">
                      <span className="text-sm text-muted-foreground block mb-2">Description</span>
                      <p className="text-sm">{selectedPayment.description}</p>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Resident Information */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Resident Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 py-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Name</p>
                    <p className="text-sm font-medium">{selectedPayment.user.name}</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-3 py-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="text-sm font-medium">{selectedPayment.user.email}</p>
                  </div>
                </div>
                <Separator />
                <div className="flex items-center gap-3 py-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Unit Number</p>
                    <p className="text-sm font-medium">{selectedPayment.user.unitNumber || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Record Information */}
            <div>
              <h3 className="text-sm font-semibold mb-3">Record Information</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 py-2">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <div className="flex-1">
                    <p className="text-xs text-muted-foreground">Created</p>
                    <p className="text-sm font-medium">
                      {format(new Date(selectedPayment.createdAt), 'MMM dd, yyyy h:mm a')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </LoomOSDetailPane>
    </DesktopAppWrapper>
  );
}
