import { format, startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, isWithinInterval, parseISO, differenceInDays } from 'date-fns';
import { Expense, ExpenseSummary, Category, FilterOptions, TimeFrame } from '../types';

// Format currency amount
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount);
};

// Format date
export const formatDate = (date: string | Date, formatString: string = 'MMM dd, yyyy'): string => {
  return format(typeof date === 'string' ? parseISO(date) : date, formatString);
};

// Get time frame range
export const getTimeFrameRange = (timeFrame: TimeFrame, date: Date = new Date()): { start: Date; end: Date } => {
  switch (timeFrame) {
    case 'daily':
      return { 
        start: startOfDay(date),
        end: endOfDay(date),
      };
    case 'weekly':
      return { 
        start: startOfWeek(date, { weekStartsOn: 1 }),
        end: endOfWeek(date, { weekStartsOn: 1 }),
      };
    case 'monthly':
      return { 
        start: startOfMonth(date),
        end: endOfMonth(date),
      };
    case 'yearly':
      return { 
        start: startOfYear(date),
        end: endOfYear(date),
      };
    default:
      return { 
        start: startOfDay(date),
        end: endOfDay(date),
      };
  }
};

// Calculate expense summary
export const calculateExpenseSummary = (
  expenses: Expense[],
  categories: Category[],
  options: FilterOptions = {}
): ExpenseSummary => {
  let filteredExpenses = [...expenses];
  
  // Apply date filters
  if (options.startDate && options.endDate) {
    const start = parseISO(options.startDate);
    const end = parseISO(options.endDate);
    filteredExpenses = filteredExpenses.filter(expense => {
      const expenseDate = parseISO(expense.date);
      return isWithinInterval(expenseDate, { start, end });
    });
  }
  
  // Apply category filters
  if (options.categoryIds && options.categoryIds.length > 0) {
    filteredExpenses = filteredExpenses.filter(expense => 
      options.categoryIds?.includes(expense.categoryId)
    );
  }
  
  // Apply amount filters
  if (options.minAmount !== undefined) {
    filteredExpenses = filteredExpenses.filter(expense => 
      expense.amount >= (options.minAmount || 0)
    );
  }
  
  if (options.maxAmount !== undefined) {
    filteredExpenses = filteredExpenses.filter(expense => 
      expense.amount <= (options.maxAmount || Infinity)
    );
  }
  
  // Apply search query
  if (options.searchQuery) {
    const query = options.searchQuery.toLowerCase();
    filteredExpenses = filteredExpenses.filter(expense => 
      expense.description.toLowerCase().includes(query) || 
      expense.notes?.toLowerCase().includes(query)
    );
  }
  
  // Calculate total
  const total = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Calculate category totals
  const categoryMap = new Map<string, { amount: number; name: string }>();
  
  filteredExpenses.forEach(expense => {
    const categoryId = expense.categoryId;
    const category = categories.find(c => c.id === categoryId);
    const categoryName = category ? category.name : 'Uncategorized';
    
    if (categoryMap.has(categoryId)) {
      const current = categoryMap.get(categoryId)!;
      categoryMap.set(categoryId, {
        ...current,
        amount: current.amount + expense.amount,
      });
    } else {
      categoryMap.set(categoryId, {
        amount: expense.amount,
        name: categoryName,
      });
    }
  });
  
  // Convert to array and calculate percentages
  const categorySummary = Array.from(categoryMap.entries()).map(([categoryId, data]) => ({
    categoryId,
    categoryName: data.name,
    amount: data.amount,
    percentage: total > 0 ? (data.amount / total) * 100 : 0,
  }));
  
  // Sort by amount (highest first)
  categorySummary.sort((a, b) => b.amount - a.amount);
  
  // Generate time-based data if needed
  let timeSeriesData = {};
  
  if (options.timeFrame && options.startDate && options.endDate) {
    const start = parseISO(options.startDate);
    const end = parseISO(options.endDate);
    
    switch (options.timeFrame) {
      case 'daily': {
        const dailyData: { date: string; amount: number }[] = [];
        for (let d = start; d <= end; d.setDate(d.getDate() + 1)) {
          const dateStr = format(d, 'yyyy-MM-dd');
          const amount = filteredExpenses
            .filter(e => e.date === dateStr)
            .reduce((sum, e) => sum + e.amount, 0);
          
          dailyData.push({
            date: dateStr,
            amount,
          });
        }
        timeSeriesData = { daily: dailyData };
        break;
      }
      
      case 'monthly': {
        const monthlyData: { month: string; amount: number }[] = [];
        for (let m = start; m <= end; m.setMonth(m.getMonth() + 1)) {
          const monthStr = format(m, 'yyyy-MM');
          const monthStartDate = format(startOfMonth(m), 'yyyy-MM-dd');
          const monthEndDate = format(endOfMonth(m), 'yyyy-MM-dd');
          
          const amount = filteredExpenses
            .filter(e => {
              const date = e.date;
              return date >= monthStartDate && date <= monthEndDate;
            })
            .reduce((sum, e) => sum + e.amount, 0);
          
          monthlyData.push({
            month: monthStr,
            amount,
          });
        }
        timeSeriesData = { monthly: monthlyData };
        break;
      }
      
      case 'yearly': {
        const yearlyData: { year: string; amount: number }[] = [];
        for (let y = start.getFullYear(); y <= end.getFullYear(); y++) {
          const yearStr = y.toString();
          const yearStartDate = `${yearStr}-01-01`;
          const yearEndDate = `${yearStr}-12-31`;
          
          const amount = filteredExpenses
            .filter(e => {
              const date = e.date;
              return date >= yearStartDate && date <= yearEndDate;
            })
            .reduce((sum, e) => sum + e.amount, 0);
          
          yearlyData.push({
            year: yearStr,
            amount,
          });
        }
        timeSeriesData = { yearly: yearlyData };
        break;
      }
    }
  }
  
  return {
    total,
    categories: categorySummary,
    ...timeSeriesData,
  };
};

// Get expense trend (increasing or decreasing)
export const getExpenseTrend = (
  expenses: Expense[],
  days: number = 30
): { trend: 'increasing' | 'decreasing' | 'stable'; percentage: number } => {
  const today = new Date();
  const startDate = new Date(today);
  startDate.setDate(startDate.getDate() - days);
  
  const midpoint = new Date(today);
  midpoint.setDate(midpoint.getDate() - days / 2);
  
  // Filter expenses within the time range
  const relevantExpenses = expenses.filter(expense => {
    const expenseDate = parseISO(expense.date);
    return expenseDate >= startDate && expenseDate <= today;
  });
  
  // Calculate totals for first and second half
  const firstHalfExpenses = relevantExpenses.filter(expense => {
    const expenseDate = parseISO(expense.date);
    return expenseDate < midpoint;
  });
  
  const secondHalfExpenses = relevantExpenses.filter(expense => {
    const expenseDate = parseISO(expense.date);
    return expenseDate >= midpoint;
  });
  
  const firstHalfTotal = firstHalfExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const secondHalfTotal = secondHalfExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Calculate change percentage
  let percentage = 0;
  if (firstHalfTotal > 0) {
    percentage = ((secondHalfTotal - firstHalfTotal) / firstHalfTotal) * 100;
  } else if (secondHalfTotal > 0) {
    percentage = 100; // If first half was 0, and second half has expenses
  }
  
  // Determine trend
  let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
  if (percentage > 5) {
    trend = 'increasing';
  } else if (percentage < -5) {
    trend = 'decreasing';
  }
  
  return {
    trend,
    percentage: Math.abs(percentage),
  };
};

// Generate random color
export const generateRandomColor = (): string => {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
};