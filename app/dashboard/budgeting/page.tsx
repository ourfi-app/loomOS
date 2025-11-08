
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import {
  DollarSign,
  TrendingUp,
  TrendingDown,
  Calendar,
  PieChart,
  Plus,
  AlertCircle,
} from 'lucide-react';
import { DesktopAppWrapper } from '@/components/webos/desktop-app-wrapper';

export default function BudgetingPage() {
  const [budgets, setBudgets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const response = await fetch('/api/budgeting');
      const data = await response.json();
      setBudgets(data);
    } catch (error) {
      console.error('Failed to fetch budgets:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DesktopAppWrapper
        title="Budgeting"
        icon={<PieChart className="w-5 h-5" />}
        gradient="from-green-500 to-emerald-500"
      >
        <div className="flex items-center justify-center h-full">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading budgets...</p>
          </div>
        </div>
      </DesktopAppWrapper>
    );
  }

  return (
    <DesktopAppWrapper
      title="Budgeting"
      icon={<PieChart className="w-5 h-5" />}
      gradient="from-green-500 to-emerald-500"
      toolbar={
        <>
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            New Budget
          </Button>
        </>
      }
    >
      <div className="p-6">
        <div className="space-y-6">
          {/* Summary Cards */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$125,000</div>
                <p className="text-xs text-muted-foreground">2025 Annual Budget</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Spent</CardTitle>
                <TrendingDown className="h-4 w-4 text-red-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$78,450</div>
                <p className="text-xs text-muted-foreground">62.8% of budget</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Remaining</CardTitle>
                <TrendingUp className="h-4 w-4 text-green-500" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">$46,550</div>
                <p className="text-xs text-muted-foreground">37.2% remaining</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Categories</CardTitle>
                <PieChart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">Active categories</p>
              </CardContent>
            </Card>
          </div>

          {/* Budget Categories */}
          <Card>
            <CardHeader>
              <CardTitle>Budget Categories</CardTitle>
              <CardDescription>Track spending across different categories</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {[
                  { name: 'Maintenance', budget: 35000, spent: 22000, color: 'blue' },
                  { name: 'Utilities', budget: 25000, spent: 18000, color: 'green' },
                  { name: 'Insurance', budget: 20000, spent: 15000, color: 'purple' },
                  { name: 'Landscaping', budget: 15000, spent: 8500, color: 'orange' },
                  { name: 'Security', budget: 12000, spent: 7000, color: 'red' },
                  { name: 'Amenities', budget: 10000, spent: 5000, color: 'pink' },
                  { name: 'Administrative', budget: 5000, spent: 2000, color: 'yellow' },
                  { name: 'Contingency', budget: 3000, spent: 950, color: 'gray' },
                ].map((category) => {
                  const percentage = (category.spent / category.budget) * 100;
                  const isOverBudget = percentage > 100;
                  const isWarning = percentage > 80 && percentage <= 100;

                  return (
                    <div key={category.name} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-3 h-3 rounded-full bg-${category.color}-500`}
                          ></div>
                          <div>
                            <p className="font-medium">{category.name}</p>
                            <p className="text-sm text-muted-foreground">
                              ${category.spent.toLocaleString()} of $
                              {category.budget.toLocaleString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge
                            variant={isOverBudget ? 'destructive' : isWarning ? 'secondary' : 'default'}
                          >
                            {percentage.toFixed(1)}%
                          </Badge>
                          {isOverBudget && (
                            <AlertCircle className="h-4 w-4 text-destructive" />
                          )}
                        </div>
                      </div>
                      <Progress
                        value={Math.min(percentage, 100)}
                        className="h-2"
                      />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Transactions</CardTitle>
              <CardDescription>Latest budget transactions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {budgets.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No transactions available
                  </div>
                ) : (
                  budgets.map((budget) => (
                    <div
                      key={budget.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`p-2 rounded-full bg-${budget.color}-100`}>
                          <DollarSign className={`h-4 w-4 text-${budget.color}-600`} />
                        </div>
                        <div>
                          <p className="font-medium">{budget.description}</p>
                          <p className="text-sm text-muted-foreground">
                            <Calendar className="inline h-3 w-3 mr-1" />
                            {new Date(budget.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold">${budget.amount.toLocaleString()}</p>
                        <Badge variant="secondary">{budget.category}</Badge>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DesktopAppWrapper>
  );
}
