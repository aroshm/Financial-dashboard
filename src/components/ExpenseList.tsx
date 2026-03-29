'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Trash2, Edit2, Download, Search } from 'lucide-react';
import { useExpenses } from '@/context/ExpenseContext';
import { type Category, type Expense } from '@/types';
import { formatCurrency, cn } from '@/lib/utils';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select } from './ui/select';
import { Card, CardContent } from './ui/card';
import { Dialog, DialogHeader, DialogTitle } from './ui/dialog';
import { ExpenseForm } from './ExpenseForm';

export function ExpenseList() {
  const { expenses, deleteExpense, updateExpense } = useExpenses();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterCategory, setFilterCategory] = React.useState<Category | 'All'>('All');
  const [editingExpense, setEditingExpense] = React.useState<Expense | null>(null);

  const filteredExpenses = React.useMemo(() => {
    return expenses
      .filter(exp => 
        (filterCategory === 'All' || exp.category === filterCategory) &&
        (exp.description.toLowerCase().includes(searchTerm.toLowerCase()))
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [expenses, filterCategory, searchTerm]);

  const handleExportCsv = () => {
    const headers = ['Date', 'Category', 'Description', 'Amount'];
    const rows = filteredExpenses.map(exp => [
      format(new Date(exp.date), 'yyyy-MM-dd'),
      exp.category,
      // Wrap description in quotes to handle commas
      `"${exp.description.replace(/"/g, '""')}"`,
      exp.amount.toString()
    ]);
    
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `expenses_export_${format(new Date(), 'yyyyMMdd')}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-card p-4 rounded-lg border shadow-sm">
        <div className="flex flex-1 w-full sm:w-auto space-x-2">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search expenses..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="w-full max-w-[150px]">
            <Select 
              value={filterCategory} 
              onChange={(e) => setFilterCategory(e.target.value as Category | 'All')}
            >
              <option value="All">All Categories</option>
              <option value="Food">Food</option>
              <option value="Transportation">Transportation</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Shopping">Shopping</option>
              <option value="Bills">Bills</option>
              <option value="Other">Other</option>
            </Select>
          </div>
        </div>
        <Button variant="outline" onClick={handleExportCsv} className="w-full sm:w-auto shrink-0">
          <Download className="mr-2 h-4 w-4" /> Export CSV
        </Button>
      </div>

      <div className="grid gap-4">
        {filteredExpenses.length === 0 ? (
          <div className="text-center p-8 bg-card border rounded-lg shadow-sm text-muted-foreground">
            No expenses found.
          </div>
        ) : (
          filteredExpenses.map(expense => (
            <Card key={expense.id} className="overflow-hidden transition-all hover:border-primary/50">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 sm:p-6 gap-4">
                  <div className="flex items-center space-x-4">
                    <div className={cn(
                      "flex h-12 w-12 items-center justify-center rounded-full text-lg font-bold",
                      expense.category === 'Food' ? "bg-orange-500/10 text-orange-500" :
                      expense.category === 'Transportation' ? "bg-blue-500/10 text-blue-500" :
                      expense.category === 'Shopping' ? "bg-pink-500/10 text-pink-500" :
                      expense.category === 'Bills' ? "bg-red-500/10 text-red-500" :
                      expense.category === 'Entertainment' ? "bg-purple-500/10 text-purple-500" :
                      "bg-gray-500/10 text-gray-400"
                    )}>
                      {expense.category.charAt(0)}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground truncate max-w-[200px] sm:max-w-xs">{expense.description}</h4>
                      <p className="text-sm text-muted-foreground flex items-center mt-1">
                        <span className="font-medium mr-2">{expense.category}</span>
                        • <span className="ml-2">{format(new Date(expense.date), 'MMM dd, yyyy')}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between w-full sm:w-auto">
                    <div className="font-bold text-lg sm:text-xl text-foreground sm:mr-6">
                      {formatCurrency(expense.amount, expense.currency)}
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="icon" onClick={() => setEditingExpense(expense)}>
                        <Edit2 className="h-4 w-4 text-muted-foreground hover:text-primary transition-colors" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => deleteExpense(expense.id)}>
                        <Trash2 className="h-4 w-4 text-destructive hover:text-red-600 transition-colors" />
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={!!editingExpense} onOpenChange={(open) => !open && setEditingExpense(null)}>
        <DialogHeader className="mb-4">
          <DialogTitle>Edit Expense</DialogTitle>
        </DialogHeader>
        {editingExpense && (
          <ExpenseForm 
            initialData={editingExpense}
            onSubmit={(data) => {
              updateExpense(editingExpense.id, data);
              setEditingExpense(null);
            }}
            onCancel={() => setEditingExpense(null)}
          />
        )}
      </Dialog>
    </div>
  );
}
