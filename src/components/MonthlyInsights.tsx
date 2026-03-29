'use client';

import * as React from 'react';
import { useExpenses } from '@/context/ExpenseContext';
import { formatCurrency, cn } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip, Legend } from 'recharts';
import { Flame, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';

const COLORS = ['#ef4444', '#06b6d4', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'];
const CATEGORY_EMOJIS: Record<string, string> = {
  Food: '🍔',
  Transportation: '🚗',
  Entertainment: '🎬',
  Shopping: '🛍️',
  Bills: '📄',
  Other: '📦',
};

export function MonthlyInsights() {
  const { expenses } = useExpenses();

  const categoryData = React.useMemo(() => {
    const data = expenses.reduce((acc, exp) => {
      acc[exp.category] = (acc[exp.category] || 0) + exp.amount;
      return acc;
    }, {} as Record<string, number>);
    
    return Object.entries(data)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
  }, [expenses]);

  const top3Categories = categoryData.slice(0, 3);
  const totalSpending = categoryData.reduce((sum, item) => sum + item.value, 0);

  // Simple mock calculation for streak
  const budgetStreak = 12;

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      <div className="border-b border-border pb-4 flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-foreground">Monthly Insights</h2>
          <p className="text-muted-foreground mt-2">Your spending patterns at a glance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Donut Chart Block */}
        <Card className="flex flex-col items-center justify-center p-6 bg-card border shadow-sm h-full min-h-[350px]">
          <h3 className="text-xl font-semibold mb-2 self-start">Spending Distribution</h3>
          <div className="w-full h-64 relative">
            {categoryData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={70}
                    outerRadius={100}
                    paddingAngle={2}
                    dataKey="value"
                    stroke="none"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                  <RechartsTooltip formatter={(value: any) => formatCurrency(Number(value))} contentStyle={{ backgroundColor: 'hsl(var(--card))', borderRadius: '8px', border: '1px solid hsl(var(--border))', color: 'hsl(var(--foreground))' }} />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full w-full flex items-center justify-center text-muted-foreground">
                No expense data available.
              </div>
            )}
            
            {/* Center Donut Label */}
            {categoryData.length > 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-sm text-muted-foreground font-medium bg-background px-3 py-1 rounded-md shadow-sm border border-border">Spending</span>
              </div>
            )}
          </div>
        </Card>

        <div className="flex flex-col gap-6 justify-between">
          
          {/* Top Categories Block */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-foreground flex items-center justify-between">
              Top Categories
              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full">Top 3!</span>
            </h3>
            
            <div className="space-y-3">
              {top3Categories.length > 0 ? top3Categories.map((cat, index) => (
                <div key={cat.name} className="flex items-center p-3 border border-border bg-card rounded-lg shadow-sm transition-all hover:bg-muted/50">
                  <div 
                    className="w-1.5 h-8 rounded-full mr-4" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }} 
                  />
                  <div className="flex-1 flex items-center text-lg">
                    <span className="mr-3 text-2xl">{CATEGORY_EMOJIS[cat.name] || '📦'}</span>
                    <span className="font-medium text-foreground">{cat.name}</span>
                  </div>
                  <div className="font-semibold text-lg text-foreground">
                    {formatCurrency(cat.value)}
                  </div>
                </div>
              )) : (
                <p className="text-muted-foreground">No data available.</p>
              )}
            </div>
          </div>

          {/* Budget Streak Block */}
          <Card className="border-2 border-dashed border-border bg-gradient-to-b from-card to-background shadow-none relative overflow-hidden">
            <div className="absolute right-0 top-0 opacity-5 pointer-events-none translate-x-1/4 -translate-y-1/4">
              <Flame className="w-32 h-32" />
            </div>
            <CardHeader className="text-center pb-2">
              <CardTitle className="text-2xl font-bold tracking-tight">Budget Streak</CardTitle>
            </CardHeader>
            <CardContent className="text-center flex flex-col items-center pb-6">
              <div className="flex items-baseline space-x-1 mb-2">
                <span className="text-6xl font-black text-green-500">{budgetStreak}</span>
                <span className="text-xl font-medium text-muted-foreground">days!</span>
              </div>
              <Button variant="outline" size="sm" className="mt-2 rounded-full border-border/60 shadow-sm opacity-80 hover:opacity-100">
                <Info className="w-4 h-4 mr-2" />
                View Details
              </Button>
            </CardContent>
          </Card>

        </div>
      </div>
    </div>
  );
}
