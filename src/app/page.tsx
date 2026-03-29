'use client';

import * as React from 'react';
import { Plus, Download } from 'lucide-react';
import { Dashboard } from '@/components/Dashboard';
import { Button } from '@/components/ui/button';
import { Dialog, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ExpenseForm } from '@/components/ExpenseForm';
import { AdvancedExportDialog } from '@/components/AdvancedExportDialog';
import { useExpenses } from '@/context/ExpenseContext';

export default function Home() {
  const [isAddModalOpen, setIsAddModalOpen] = React.useState(false);
  const [isExportOpen, setIsExportOpen] = React.useState(false);
  const { addExpense } = useExpenses();

  return (
    <div className="space-y-8 animate-in fade-in-50 duration-500">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Your personal financial overview.
          </p>
        </div>
        <div className="flex w-full sm:w-auto gap-2 items-center">
          <Button variant="outline" onClick={() => setIsExportOpen(true)} className="w-full sm:w-auto shrink-0 shadow-sm transition-all hover:scale-105 active:scale-95">
            <Download className="mr-2 h-4 w-4" /> Export Report
          </Button>
          <Button onClick={() => setIsAddModalOpen(true)} className="w-full sm:w-auto shrink-0 shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
            <Plus className="mr-2 h-4 w-4" /> Add Expense
          </Button>
        </div>
      </div>

      <div className="glass rounded-2xl p-4 sm:p-6 border shadow-2xl">
        <Dashboard />
      </div>

      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogHeader className="mb-4">
          <DialogTitle>Add New Expense</DialogTitle>
        </DialogHeader>
        <ExpenseForm 
          onSubmit={(data) => {
            addExpense(data);
            setIsAddModalOpen(false);
          }}
          onCancel={() => setIsAddModalOpen(false)}
        />
      </Dialog>
      
      <AdvancedExportDialog open={isExportOpen} onOpenChange={setIsExportOpen} />
    </div>
  );
}
