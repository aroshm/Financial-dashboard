'use client';

import * as React from 'react';
import { ExpenseList } from '@/components/ExpenseList';

export default function ExpensesPage() {
  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Transactions</h1>
        <p className="text-muted-foreground mt-1 text-sm sm:text-base">
          Manage, filter, and export all your financial transactions.
        </p>
      </div>

      <div className="glass rounded-2xl p-4 sm:p-6 border shadow-2xl">
        <ExpenseList />
      </div>
    </div>
  );
}
