
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Download,
  FileText,
  Calculator,
  PieChart,
  BarChart3,
} from 'lucide-react';
import { DesktopAppWrapper } from '@/components/webos/desktop-app-wrapper';

export default function AccountingPage() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/accounting');
      const data = await response.json();
      setTransactions(data);
    } catch (error) {
      console.error('Failed to fetch transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DesktopAppWrapper
        title="Accounting"
        icon={<Calculator className="w-5 h-5" />}
        gradient="from-blue-500 to-cyan-500"
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading accounting data...</p>
          </div>
        </div>
      </DesktopAppWrapper>
    );
  }

  return (
    <DesktopAppWrapper
      title="Accounting"
      icon={<Calculator className="w-5 h-5" />}
      gradient="from-blue-500 to-cyan-500"
      toolbar={
        <>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button>
            <FileText className="h-4 w-4 mr-2" />
            New Entry
          </Button>
        </>
      }
    >
      <div className="p-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="income">Income</TabsTrigger>
            <TabsTrigger value="expenses">Expenses</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Financial Summary */}
            <div className="grid gap-4 md:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
                  <TrendingUp className="h-4 w-4 text-[var(--semantic-success)]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$145,250</div>
                  <p className="text-xs text-muted-foreground">+12.5% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total Expenses</CardTitle>
                  <TrendingDown className="h-4 w-4 text-[var(--semantic-error)]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$98,420</div>
                  <p className="text-xs text-muted-foreground">-3.2% from last month</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Net Income</CardTitle>
                  <DollarSign className="h-4 w-4 text-[var(--semantic-primary)]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$46,830</div>
                  <p className="text-xs text-muted-foreground">32.3% profit margin</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Reserve Fund</CardTitle>
                  <Calculator className="h-4 w-4 text-[var(--semantic-accent)]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">$285,000</div>
                  <p className="text-xs text-muted-foreground">Target: $350,000</p>
                </CardContent>
              </Card>
            </div>

            {/* Recent Transactions */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Latest financial transactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {transactions.length === 0 ? (
                    <div className="text-center py-8 text-muted-foreground">
                      No transactions available
                    </div>
                  ) : (
                    transactions.slice(0, 10).map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div
                            className={`p-2 rounded-full ${
                              transaction.type === 'income'
                                ? 'bg-[var(--semantic-success-bg)] dark:bg-green-900/20'
                                : 'bg-[var(--semantic-error-bg)] dark:bg-red-900/20'
                            }`}
                          >
                            {transaction.type === 'income' ? (
                              <TrendingUp className="h-4 w-4 text-[var(--semantic-success)]" />
                            ) : (
                              <TrendingDown className="h-4 w-4 text-[var(--semantic-error)]" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium">{transaction.description}</p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(transaction.date).toLocaleDateString()} •{' '}
                              {transaction.category}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p
                            className={`font-semibold ${
                              transaction.type === 'income'
                                ? 'text-[var(--semantic-success)]'
                                : 'text-[var(--semantic-error)]'
                            }`}
                          >
                            {transaction.type === 'income' ? '+' : '-'}$
                            {transaction.amount.toLocaleString()}
                          </p>
                          <Badge variant="secondary">{transaction.status}</Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="income">
            <Card>
              <CardHeader>
                <CardTitle>Income Transactions</CardTitle>
                <CardDescription>All revenue and income sources</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  Income transactions will be displayed here
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="expenses">
            <Card>
              <CardHeader>
                <CardTitle>Expense Transactions</CardTitle>
                <CardDescription>All expenses and costs</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-center py-8">
                  Expense transactions will be displayed here
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reports">
            <div className="grid gap-6 md:grid-cols-2">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-[var(--semantic-primary-subtle)] dark:bg-[var(--semantic-primary-dark)]/20">
                      <PieChart className="h-6 w-6 text-[var(--semantic-primary)]" />
                    </div>
                    <div>
                      <CardTitle>Financial Summary</CardTitle>
                      <CardDescription>Comprehensive financial overview</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-[var(--semantic-success-bg)] dark:bg-green-900/20">
                      <BarChart3 className="h-6 w-6 text-[var(--semantic-success)]" />
                    </div>
                    <div>
                      <CardTitle>Income Statement</CardTitle>
                      <CardDescription>Revenue and expense analysis</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-[var(--semantic-accent-subtle)] dark:bg-purple-900/20">
                      <Calculator className="h-6 w-6 text-[var(--semantic-accent)]" />
                    </div>
                    <div>
                      <CardTitle>Balance Sheet</CardTitle>
                      <CardDescription>Assets and liabilities report</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-[var(--semantic-primary-subtle)] dark:bg-orange-900/20">
                      <FileText className="h-6 w-6 text-[var(--semantic-primary)]" />
                    </div>
                    <div>
                      <CardTitle>Cash Flow</CardTitle>
                      <CardDescription>Monthly cash flow analysis</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </DesktopAppWrapper>
  );
}
