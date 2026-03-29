'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Expense, ExpenseState } from '@/types';

interface ExpenseContextType extends ExpenseState {
  addExpense: (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateExpense: (id: string, updates: Partial<Expense>) => void;
  deleteExpense: (id: string) => void;
  setExpenses: React.Dispatch<React.SetStateAction<Expense[]>>;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'financial_dashboard_expenses';

export function ExpenseProvider({ children }: { children: React.ReactNode }) {
  const [expenses, setExpensesState] = useState<Expense[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (stored) {
        setExpensesState(JSON.parse(stored));
      } else {
        // Optional: seed some initial data
        setExpensesState([]);
      }
    } catch (err) {
      console.error('Failed to parse expenses from local storage', err);
      setError('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  }, []);

  const setExpenses: React.Dispatch<React.SetStateAction<Expense[]>> = (val) => {
    setExpensesState(prev => {
      const nextState = typeof val === 'function' ? val(prev) : val;
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(nextState));
      return nextState;
    });
  };

  const addExpense = (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newExpense: Expense = {
      ...expense,
      id: Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    setExpenses(prev => [newExpense, ...prev]);
  };

  const updateExpense = (id: string, updates: Partial<Expense>) => {
    setExpenses(prev => prev.map(exp => 
      exp.id === id 
        ? { ...exp, ...updates, updatedAt: new Date().toISOString() }
        : exp
    ));
  };

  const deleteExpense = (id: string) => {
    setExpenses(prev => prev.filter(exp => exp.id !== id));
  };

  return (
    <ExpenseContext.Provider value={{ expenses, loading, error, addExpense, updateExpense, deleteExpense, setExpenses }}>
      {children}
    </ExpenseContext.Provider>
  );
}

export function useExpenses() {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
}
