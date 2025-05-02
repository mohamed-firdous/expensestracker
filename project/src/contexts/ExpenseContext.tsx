import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { format } from 'date-fns';
import { Expense, Category, FilterOptions } from '../types';
import { useAuth } from './AuthContext';
import { expenses as mockExpenses, categories as mockCategories } from '../data/mockData';

interface ExpenseContextType {
  expenses: Expense[];
  categories: Category[];
  budgets: Budget[];
  addExpense: (expense: Omit<Expense, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => Promise<Expense>;
  updateExpense: (id: string, expenseData: Partial<Expense>) => Promise<Expense | null>;
  deleteExpense: (id: string) => Promise<boolean>;
  addCategory: (category: Omit<Category, 'id'>) => Promise<Category>;
  updateCategory: (id: string, categoryData: Partial<Category>) => Promise<Category | null>;
  deleteCategory: (id: string) => Promise<boolean>;
  addBudget: (budget: Omit<Budget, 'id' | 'userId'>) => Promise<Budget>;
  updateBudget: (id: string, budgetData: Partial<Budget>) => Promise<Budget | null>;
  deleteBudget: (id: string) => Promise<boolean>;
  getFilteredExpenses: (filterOptions: FilterOptions) => Expense[];
  isLoading: boolean;
  error: string | null;
}

const ExpenseContext = createContext<ExpenseContextType | undefined>(undefined);

export const ExpenseProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load expenses and categories on mount or when user changes
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // In a real app, you would fetch from an API
        // For this mock, we'll just filter the mock data by user
        await new Promise(resolve => setTimeout(resolve, 500));
        
        if (user) {
          const userExpenses = mockExpenses.filter(expense => expense.userId === user.id);
          setExpenses(userExpenses);
          setCategories(mockCategories);
        } else {
          setExpenses([]);
        }
        
        setIsLoading(false);
      } catch (error) {
        setError('Failed to load expenses data');
        setIsLoading(false);
      }
    };
    
    loadData();
  }, [user]);

  // Add a new expense
  const addExpense = async (expenseData: Omit<Expense, 'id' | 'userId' | 'createdAt' | 'updatedAt'>): Promise<Expense> => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      const now = new Date();
      const newExpense: Expense = {
        id: uuidv4(),
        userId: user.id,
        createdAt: now.toISOString(),
        updatedAt: now.toISOString(),
        ...expenseData,
      };
      
      // Add to the expenses list
      setExpenses(prevExpenses => [newExpense, ...prevExpenses]);
      
      setIsLoading(false);
      return newExpense;
    } catch (error) {
      setError('Failed to add expense');
      setIsLoading(false);
      throw error;
    }
  };

  // Update an existing expense
  const updateExpense = async (id: string, expenseData: Partial<Expense>): Promise<Expense | null> => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // Find the expense to update
      const expenseIndex = expenses.findIndex(expense => expense.id === id);
      
      if (expenseIndex === -1) {
        setIsLoading(false);
        return null;
      }
      
      // Create updated expense object
      const now = new Date();
      const updatedExpense: Expense = {
        ...expenses[expenseIndex],
        ...expenseData,
        updatedAt: now.toISOString(),
      };
      
      // Update the expenses list
      const updatedExpenses = [...expenses];
      updatedExpenses[expenseIndex] = updatedExpense;
      setExpenses(updatedExpenses);
      
      setIsLoading(false);
      return updatedExpense;
    } catch (error) {
      setError('Failed to update expense');
      setIsLoading(false);
      throw error;
    }
  };

  // Delete an expense
  const deleteExpense = async (id: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      if (!user) {
        throw new Error('User not authenticated');
      }
      
      // Remove the expense from the list
      setExpenses(prevExpenses => prevExpenses.filter(expense => expense.id !== id));
      
      setIsLoading(false);
      return true;
    } catch (error) {
      setError('Failed to delete expense');
      setIsLoading(false);
      throw error;
    }
  };

  // Add a new category
  const addCategory = async (categoryData: Omit<Category, 'id'>): Promise<Category> => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      const newCategory: Category = {
        id: uuidv4(),
        ...categoryData,
      };
      
      // Add to the categories list
      setCategories(prevCategories => [...prevCategories, newCategory]);
      
      setIsLoading(false);
      return newCategory;
    } catch (error) {
      setError('Failed to add category');
      setIsLoading(false);
      throw error;
    }
  };

  // Update an existing category
  const updateCategory = async (id: string, categoryData: Partial<Category>): Promise<Category | null> => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Find the category to update
      const categoryIndex = categories.findIndex(category => category.id === id);
      
      if (categoryIndex === -1) {
        setIsLoading(false);
        return null;
      }
      
      // Create updated category object
      const updatedCategory: Category = {
        ...categories[categoryIndex],
        ...categoryData,
      };
      
      // Update the categories list
      const updatedCategories = [...categories];
      updatedCategories[categoryIndex] = updatedCategory;
      setCategories(updatedCategories);
      
      setIsLoading(false);
      return updatedCategory;
    } catch (error) {
      setError('Failed to update category');
      setIsLoading(false);
      throw error;
    }
  };

  // Delete a category
  const deleteCategory = async (id: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // Check if category is in use
      const categoryInUse = expenses.some(expense => expense.categoryId === id);
      
      if (categoryInUse) {
        setError('Cannot delete category that is in use by expenses');
        setIsLoading(false);
        return false;
      }
      
      // Remove the category from the list
      setCategories(prevCategories => prevCategories.filter(category => category.id !== id));
      
      setIsLoading(false);
      return true;
    } catch (error) {
      setError('Failed to delete category');
      setIsLoading(false);
      return false;
    }
  };

  // Add budget
  const addBudget = async (budgetData: Omit<Budget, 'id' | 'userId'>): Promise<Budget> => {
    try {
      setIsLoading(true);
      setError(null);

      if (!user) {
        throw new Error('User not authenticated');
      }

      const newBudget: Budget = {
        id: uuidv4(),
        userId: user.id,
        ...budgetData,
      };

      setBudgets(prev => [...prev, newBudget]);
      setIsLoading(false);
      return newBudget;
    } catch (error) {
      setError('Failed to add budget');
      setIsLoading(false);
      throw error;
    }
  };

  // Update budget
  const updateBudget = async (id: string, budgetData: Partial<Budget>): Promise<Budget | null> => {
    try {
      setIsLoading(true);
      setError(null);

      const budgetIndex = budgets.findIndex(budget => budget.id === id);
      
      if (budgetIndex === -1) {
        setIsLoading(false);
        return null;
      }

      const updatedBudget: Budget = {
        ...budgets[budgetIndex],
        ...budgetData,
      };

      const updatedBudgets = [...budgets];
      updatedBudgets[budgetIndex] = updatedBudget;
      setBudgets(updatedBudgets);

      setIsLoading(false);
      return updatedBudget;
    } catch (error) {
      setError('Failed to update budget');
      setIsLoading(false);
      throw error;
    }
  };

  // Delete budget
  const deleteBudget = async (id: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setError(null);

      setBudgets(prev => prev.filter(budget => budget.id !== id));

      setIsLoading(false);
      return true;
    } catch (error) {
      setError('Failed to delete budget');
      setIsLoading(false);
      return false;
    }
  };

  // Get filtered expenses based on options
  const getFilteredExpenses = (filterOptions: FilterOptions): Expense[] => {
    let filtered = [...expenses];
    
    // Filter by date range
    if (filterOptions.startDate && filterOptions.endDate) {
      filtered = filtered.filter(expense => {
        return expense.date >= filterOptions.startDate! && expense.date <= filterOptions.endDate!;
      });
    }
    
    // Filter by categories
    if (filterOptions.categoryIds && filterOptions.categoryIds.length > 0) {
      filtered = filtered.filter(expense => 
        filterOptions.categoryIds!.includes(expense.categoryId)
      );
    }
    
    // Filter by amount range
    if (filterOptions.minAmount !== undefined) {
      filtered = filtered.filter(expense => expense.amount >= filterOptions.minAmount!);
    }
    
    if (filterOptions.maxAmount !== undefined) {
      filtered = filtered.filter(expense => expense.amount <= filterOptions.maxAmount!);
    }
    
    // Filter by search query
    if (filterOptions.searchQuery) {
      const query = filterOptions.searchQuery.toLowerCase();
      filtered = filtered.filter(expense => 
        expense.description.toLowerCase().includes(query) || 
        expense.notes?.toLowerCase().includes(query)
      );
    }
    
    return filtered;
  };

  const value = {
    expenses,
    categories,
    budgets,
    addExpense,
    updateExpense,
    deleteExpense,
    addCategory,
    updateCategory,
    deleteCategory,
    addBudget,
    updateBudget,
    deleteBudget,
    getFilteredExpenses,
    isLoading,
    error,
  };

  return <ExpenseContext.Provider value={value}>{children}</ExpenseContext.Provider>;
};

// Custom hook to use the expense context
export const useExpenses = () => {
  const context = useContext(ExpenseContext);
  if (context === undefined) {
    throw new Error('useExpenses must be used within an ExpenseProvider');
  }
  return context;
};