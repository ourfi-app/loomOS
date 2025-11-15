

'use client';

import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  DollarSign, 
  Calendar, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  Download,
  Filter
} from 'lucide-react';

interface Payment {
  id: string;
  amount: number;
  dueDate: string;
  paidDate?: string;
  status: string;
  description: string;
  type: string;
  createdAt: string;
}

export default function PaymentsTab() {
  const { data: session } = useSession() || {};
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<any>({});
  const [showFilters, setShowFilters] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  const userRole = (session?.user as any)?.role;

  useEffect(() => {
    async function fetchPayments() {
      try {
        const response = await fetch('/api/payments');
        if (response.ok) {
          const data = await response.json();
          setPayments(data.payments || []);
          setStats(data.stats || {});
        }
      } catch (error) {
        console.error('Failed to fetch payments:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPayments();
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID':
        return <CheckCircle className="h-4 w-4 text-[var(--semantic-success)]" />;
      case 'PENDING':
        return <Clock className="h-4 w-4 text-[var(--semantic-primary)]" />;
      case 'OVERDUE':
        return <AlertTriangle className="h-4 w-4 text-[var(--semantic-error)]" />;
      default:
        return <Clock className="h-4 w-4 text-[var(--semantic-text-tertiary)]" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PAID':
        return <Badge className="bg-[var(--semantic-success)] hover:bg-[var(--semantic-success)]">Paid</Badge>;
      case 'PENDING':
        return <Badge variant="secondary">Pending</Badge>;
      case 'OVERDUE':
        return <Badge variant="destructive">Overdue</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const handleFilter = () => {
    setShowFilters(!showFilters);
  };

  const handleExport = () => {
    // Create CSV export
    const csvContent = "data:text/csv;charset=utf-8," 
      + "Description,Amount,Due Date,Status,Type\n"
      + filteredPayments.map(p => 
          `"${p.description}","$${p.amount}","${new Date(p.dueDate).toLocaleDateString()}","${p.status}","${p.type}"`
        ).join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `payments_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePayNow = (payment: Payment) => {
    // TODO: Integrate with Stripe payment processing
    alert(`Redirecting to secure payment for ${payment.description} - $${payment.amount.toLocaleString()}`);
  };

  const filteredPayments = payments.filter(payment => {
    if (statusFilter === 'all') return true;
    return payment.status === statusFilter;
  });

  return (
    <div className="space-y-4">
      {/* Filter and Export Buttons */}
      <div className="flex gap-2 justify-end">
        <Button variant="outline" size="sm" onClick={handleFilter}>
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
        <Button variant="outline" size="sm" onClick={handleExport}>
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <Card className="p-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium">Status:</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-1 border border-input bg-background rounded-md text-sm"
              >
                <option value="all">All</option>
                <option value="PAID">Paid</option>
                <option value="PENDING">Pending</option>
                <option value="OVERDUE">Overdue</option>
              </select>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setStatusFilter('all');
                setShowFilters(false);
              }}
            >
              Clear Filters
            </Button>
          </div>
        </Card>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Paid</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(stats.totalPaid || 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">This year</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Due</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${(stats.currentDue || 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">This month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Payment Status</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[var(--semantic-success)]">
              {stats.paymentStatus || 'Current'}
            </div>
            <p className="text-xs text-muted-foreground">Overall status</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Next Due</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.nextDueDate || 'N/A'}
            </div>
            <p className="text-xs text-muted-foreground">Due date</p>
          </CardContent>
        </Card>
      </div>

      {/* Payment History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment History
          </CardTitle>
          <CardDescription>
            {userRole === 'RESIDENT' 
              ? 'Your payment history and upcoming dues'
              : 'All association payments and collections'
            }
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[var(--semantic-primary)] mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading payments...</p>
            </div>
          ) : filteredPayments.length > 0 ? (
            <div className="space-y-4">
              {filteredPayments.map((payment) => (
                <div key={payment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center gap-4">
                    {getStatusIcon(payment.status)}
                    <div>
                      <p className="font-medium">{payment.description}</p>
                      <p className="text-sm text-muted-foreground">
                        Due: {new Date(payment.dueDate).toLocaleDateString()}
                        {payment.paidDate && (
                          <span> • Paid: {new Date(payment.paidDate).toLocaleDateString()}</span>
                        )}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold">${payment.amount.toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {payment.type.replace('_', ' ')}
                      </p>
                    </div>
                    {getStatusBadge(payment.status)}
                    {payment.status === 'PENDING' && (
                      <Button size="sm" onClick={() => handlePayNow(payment)}>
                        Pay Now
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <CreditCard className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No payment history found</p>
              <p className="text-sm text-muted-foreground mt-2">
                {statusFilter !== 'all' 
                  ? `No ${statusFilter.toLowerCase()} payments found`
                  : 'Payments will appear here once they are created'
                }
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Make Payment Card (for residents with pending payments) */}
      {userRole === 'RESIDENT' && (
        <Card className="border-[var(--semantic-primary-light)] bg-[var(--semantic-primary-subtle)]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-[var(--semantic-primary-dark)]">
              <CreditCard className="h-5 w-5" />
              Make a Payment
            </CardTitle>
            <CardDescription className="text-[var(--semantic-primary-dark)]">
              Pay your monthly dues or special assessments securely online
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-[var(--semantic-primary-dark)]">
                  Current amount due: ${(stats.currentDue || 350).toLocaleString()}
                </p>
                <p className="text-sm text-[var(--semantic-primary-dark)]">
                  Secure payment processing powered by Stripe
                </p>
              </div>
              <Button 
                className="bg-[var(--semantic-primary)] hover:bg-[var(--semantic-primary-dark)]"
                onClick={() => handlePayNow({
                  id: 'current-due',
                  description: 'Current Monthly Dues',
                  amount: stats.currentDue || 350,
                  dueDate: '',
                  status: 'PENDING',
                  type: 'monthly_dues',
                  createdAt: ''
                })}
              >
                Pay Now
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

