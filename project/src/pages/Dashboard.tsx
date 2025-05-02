import React, { useState, useMemo } from 'react';
import { format, startOfMonth, endOfMonth, subDays, parseISO } from 'date-fns';
import { 
  LayoutDashboard, 
  CreditCard, 
  CalendarDays, 
  Calendar, 
  PiggyBank, 
  BarChart3 
} from 'lucide-react';
import { useExpenses } from '../contexts/ExpenseContext';
import { calculateExpenseSummary, getExpenseTrend, getTimeFrameRange } from '../utils/helpers';
import StatCard from '../components/StatCard';
import ExpenseChart from '../components/charts/ExpenseChart';
import ExpenseCard from '../components/ExpenseCard';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { Link } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const { expenses, categories } = useExpenses();
  const [selectedExpense, setSelectedExpense] = useState<string | null>(null);
  
  // Get date ranges
  const today = new Date();
  const yesterday = subDays(today, 1);
  const thisMonth = {
    start: startOfMonth(today),
    end: endOfMonth(today),
  };
  
  // Calculate summaries
  const todayExpenses = useMemo(() => {
    const range = getTimeFrameRange('daily', today);
    return expenses.filter(
      expense => {
        const expenseDate = parseISO(expense.date);
        return expenseDate >= range.start && expenseDate <= range.end;
      }
    );
  }, [expenses, today]);
  
  const yesterdayExpenses = useMemo(() => {
    const range = getTimeFrameRange('daily', yesterday);
    return expenses.filter(
      expense => {
        const expenseDate = parseISO(expense.date);
        return expenseDate >= range.start && expenseDate <= range.end;
      }
    );
  }, [expenses, yesterday]);
  
  const thisMonthExpenses = useMemo(() => {
    return expenses.filter(
      expense => {
        const expenseDate = parseISO(expense.date);
        return expenseDate >= thisMonth.start && expenseDate <= thisMonth.end;
      }
    );
  }, [expenses, thisMonth]);
  
  // Calculate totals
  const todayTotal = todayExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const yesterdayTotal = yesterdayExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const thisMonthTotal = thisMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Calculate year-to-date total
  const ytdTotal = expenses.filter(
    expense => parseISO(expense.date).getFullYear() === today.getFullYear()
  ).reduce((sum, expense) => sum + expense.amount, 0);
  
  // Calculate total all-time
  const totalAllTime = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  
  // Calculate trend
  const monthlyTrend = getExpenseTrend(expenses, 30);
  const weeklyTrend = getExpenseTrend(expenses, 7);
  
  // Prepare data for charts
  const last7DaysData = useMemo(() => {
    const startDate = format(subDays(today, 6), 'yyyy-MM-dd');
    const endDate = format(today, 'yyyy-MM-dd');
    
    return calculateExpenseSummary(
      expenses,
      categories,
      {
        startDate,
        endDate,
        timeFrame: 'daily',
      }
    );
  }, [expenses, categories, today]);
  
  const thisMonthData = useMemo(() => {
    const startDate = format(thisMonth.start, 'yyyy-MM-dd');
    const endDate = format(thisMonth.end, 'yyyy-MM-dd');
    
    return calculateExpenseSummary(
      expenses,
      categories,
      {
        startDate,
        endDate,
      }
    );
  }, [expenses, categories, thisMonth]);
  
  // Get recent expenses
  const recentExpenses = useMemo(() => {
    return [...expenses]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [expenses]);
  
  // Format title with date
  const title = `Dashboard - ${format(today, 'MMMM d, yyyy')}`;
  
  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
        <Link to="/add-expense">
          <Button variant="primary" size="sm">
            Add Expense
          </Button>
        </Link>
      </div>
      
      {/* Stats cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <StatCard
          title="Today's Expenses"
          value={todayTotal}
          icon={<CalendarDays className="h-5 w-5" />}
          trend={todayTotal > yesterdayTotal ? 'up' : todayTotal < yesterdayTotal ? 'down' : 'neutral'}
          trendValue={yesterdayTotal > 0 ? ((todayTotal - yesterdayTotal) / yesterdayTotal) * 100 : 0}
          trendLabel="vs yesterday"
        />
        
        <StatCard
          title="Yesterday's Expenses"
          value={yesterdayTotal}
          icon={<Calendar className="h-5 w-5" />}
        />
        
        <StatCard
          title="This Month"
          value={thisMonthTotal}
          icon={<CreditCard className="h-5 w-5" />}
          trend={monthlyTrend.trend === 'increasing' ? 'up' : monthlyTrend.trend === 'decreasing' ? 'down' : 'neutral'}
          trendValue={monthlyTrend.percentage}
          trendLabel="vs last month"
        />
        
        <StatCard
          title="Year to Date"
          value={ytdTotal}
          icon={<BarChart3 className="h-5 w-5" />}
        />
        
        <StatCard
          title="Total All Time"
          value={totalAllTime}
          icon={<PiggyBank className="h-5 w-5" />}
        />
      </div>
      
      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card variant="elevated">
          <h2 className="mb-4 text-xl font-semibold">Daily Expenses (Last 7 Days)</h2>
          <ExpenseChart 
            data={last7DaysData} 
            categories={categories} 
            type="bar"
            timeFrame="daily"
          />
        </Card>
        
        <Card variant="elevated">
          <h2 className="mb-4 text-xl font-semibold">Expense Categories</h2>
          <ExpenseChart 
            data={thisMonthData} 
            categories={categories} 
            type="pie"
          />
        </Card>
      </div>
      
      {/* Recent transactions */}
      <Card variant="elevated">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">Recent Expenses</h2>
          <Link to="/expenses">
            <Button variant="ghost" size="sm">
              View All
            </Button>
          </Link>
        </div>
        
        {recentExpenses.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-gray-500">No recent expenses found.</p>
            <Link to="/add-expense" className="mt-2 inline-block">
              <Button variant="primary" size="sm">
                Add Your First Expense
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {recentExpenses.map(expense => (
              <ExpenseCard
                key={expense.id}
                expense={expense}
                category={categories.find(c => c.id === expense.categoryId)}
                onEdit={() => {}}
                onDelete={() => {}}
              />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default Dashboard;