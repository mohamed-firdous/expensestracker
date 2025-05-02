import { format } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { User, Category, Expense, Budget } from '../types';

// Mock User
export const currentUser: User = {
  id: '1',
  name: 'John Doe',
  email: 'john.doe@example.com',
  avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
};

// Mock Categories
export const categories: Category[] = [
  { id: '1', name: 'Food & Dining', color: '#F59E0B', icon: 'utensils' },
  { id: '2', name: 'Transportation', color: '#3B82F6', icon: 'car' },
  { id: '3', name: 'Housing', color: '#10B981', icon: 'home' },
  { id: '4', name: 'Entertainment', color: '#EC4899', icon: 'film' },
  { id: '5', name: 'Shopping', color: '#8B5CF6', icon: 'shopping-bag' },
  { id: '6', name: 'Healthcare', color: '#EF4444', icon: 'stethoscope' },
  { id: '7', name: 'Education', color: '#0EA5E9', icon: 'book' },
  { id: '8', name: 'Utilities', color: '#6366F1', icon: 'bolt' },
  { id: '9', name: 'Travel', color: '#F97316', icon: 'plane' },
  { id: '10', name: 'Other', color: '#6B7280', icon: 'ellipsis-h' },
];

// Generate mock expenses
const generateMockExpenses = (): Expense[] => {
  const today = new Date();
  const expenses: Expense[] = [];
  
  // Last 60 days of expenses
  for (let i = 0; i < 60; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    
    // Generate 1-3 expenses per day
    const expensesCount = Math.floor(Math.random() * 3) + 1;
    
    for (let j = 0; j < expensesCount; j++) {
      const categoryIndex = Math.floor(Math.random() * categories.length);
      const amount = Math.floor(Math.random() * 200) + 10; // Random amount between 10 and 210
      
      const expense: Expense = {
        id: uuidv4(),
        amount,
        description: `${categories[categoryIndex].name} expense`,
        date: format(date, 'yyyy-MM-dd'),
        categoryId: categories[categoryIndex].id,
        userId: currentUser.id,
        paymentMethod: Math.random() > 0.5 ? 'Credit Card' : 'Cash',
        isRecurring: Math.random() > 0.8,
        notes: Math.random() > 0.7 ? 'Some notes about this expense' : undefined,
        createdAt: date.toISOString(),
        updatedAt: date.toISOString(),
      };
      
      expenses.push(expense);
    }
  }
  
  return expenses;
};

export const expenses = generateMockExpenses();

// Mock Budgets
export const budgets: Budget[] = [
  {
    id: '1',
    userId: currentUser.id,
    categoryId: '1', // Food & Dining
    amount: 500,
    period: 'monthly',
    startDate: format(new Date(), 'yyyy-MM-01'),
  },
  {
    id: '2',
    userId: currentUser.id,
    categoryId: '2', // Transportation
    amount: 300,
    period: 'monthly',
    startDate: format(new Date(), 'yyyy-MM-01'),
  },
  {
    id: '3',
    userId: currentUser.id,
    categoryId: '3', // Housing
    amount: 1500,
    period: 'monthly',
    startDate: format(new Date(), 'yyyy-MM-01'),
  },
];

export const users = [currentUser];