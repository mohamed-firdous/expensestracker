export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string;
}

export interface Expense {
  id: string;
  amount: number;
  description: string;
  date: string;
  categoryId: string;
  userId: string;
  paymentMethod?: string;
  isRecurring?: boolean;
  recurringInterval?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  notes?: string;
  attachments?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Budget {
  id: string;
  userId: string;
  categoryId: string;
  amount: number;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: string;
  endDate?: string;
  notifyThreshold?: number; // Percentage at which to notify user
}

export interface DateRange {
  startDate: Date;
  endDate: Date;
}

export interface ExpenseSummary {
  total: number;
  categories: {
    categoryId: string;
    categoryName: string;
    amount: number;
    percentage: number;
    budget?: number;
    remainingBudget?: number;
    budgetUtilization?: number;
  }[];
  daily?: { date: string; amount: number }[];
  weekly?: { week: string; amount: number }[];
  monthly?: { month: string; amount: number }[];
  yearly?: { year: string; amount: number }[];
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export type TimeFrame = 'daily' | 'weekly' | 'monthly' | 'yearly';

export interface FilterOptions {
  startDate?: string;
  endDate?: string;
  categoryIds?: string[];
  minAmount?: number;
  maxAmount?: number;
  timeFrame?: TimeFrame;
  searchQuery?: string;
}