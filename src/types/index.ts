export type Category = 
  | 'Food' 
  | 'Transportation' 
  | 'Entertainment' 
  | 'Shopping' 
  | 'Bills' 
  | 'Other';

// We added future-proof fields like currency, tags, createdAt, updatedAt
export interface Expense {
  id: string;
  amount: number;
  category: Category;
  description: string;
  date: string; // ISO 8601 string
  currency?: string;
  tags?: string[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ExpenseState {
  expenses: Expense[];
  loading: boolean;
  error: string | null;
}

export type ExpenseFilter = {
  startDate?: string;
  endDate?: string;
  category?: Category | 'All';
  searchQuery?: string;
};
