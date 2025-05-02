import React from 'react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  PieChart, 
  Pie, 
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import { ExpenseSummary, Category } from '../../types';
import { formatCurrency } from '../../utils/helpers';

interface ExpenseChartProps {
  data: ExpenseSummary;
  categories: Category[];
  type: 'bar' | 'pie' | 'line';
  timeFrame?: 'daily' | 'weekly' | 'monthly' | 'yearly';
}

const ExpenseChart: React.FC<ExpenseChartProps> = ({
  data,
  categories,
  type,
  timeFrame = 'monthly',
}) => {
  // Get category colors by id
  const getCategoryColor = (categoryId: string): string => {
    const category = categories.find(c => c.id === categoryId);
    return category ? category.color : '#6B7280';
  };
  
  // Custom tooltip formatter
  const formatTooltipValue = (value: number) => {
    return formatCurrency(value);
  };
  
  // Render bar chart for time-based data
  const renderBarChart = () => {
    let chartData;
    
    switch (timeFrame) {
      case 'daily':
        chartData = data.daily || [];
        break;
      case 'weekly':
        chartData = data.weekly || [];
        break;
      case 'monthly':
        chartData = data.monthly || [];
        break;
      case 'yearly':
        chartData = data.yearly || [];
        break;
      default:
        chartData = [];
    }
    
    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey={timeFrame === 'daily' ? 'date' : timeFrame === 'monthly' ? 'month' : 'year'} 
            tick={{ fontSize: 12 }}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip formatter={formatTooltipValue} />
          <Bar dataKey="amount" fill="#0D9488" />
        </BarChart>
      </ResponsiveContainer>
    );
  };
  
  // Render pie chart for category breakdown
  const renderPieChart = () => {
    const categoryData = data.categories;
    
    return (
      <ResponsiveContainer width="100%" height={300}>
        <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 30 }}>
          <Pie
            data={categoryData}
            dataKey="amount"
            nameKey="categoryName"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#0D9488"
            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
          >
            {categoryData.map((entry) => (
              <Cell key={entry.categoryId} fill={getCategoryColor(entry.categoryId)} />
            ))}
          </Pie>
          <Tooltip formatter={formatTooltipValue} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  };
  
  // Render line chart for trend analysis
  const renderLineChart = () => {
    let chartData;
    
    switch (timeFrame) {
      case 'daily':
        chartData = data.daily || [];
        break;
      case 'weekly':
        chartData = data.weekly || [];
        break;
      case 'monthly':
        chartData = data.monthly || [];
        break;
      case 'yearly':
        chartData = data.yearly || [];
        break;
      default:
        chartData = [];
    }
    
    return (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 30 }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey={timeFrame === 'daily' ? 'date' : timeFrame === 'monthly' ? 'month' : 'year'} 
            tick={{ fontSize: 12 }}
          />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip formatter={formatTooltipValue} />
          <Line 
            type="monotone" 
            dataKey="amount" 
            stroke="#0D9488" 
            activeDot={{ r: 8 }} 
          />
        </LineChart>
      </ResponsiveContainer>
    );
  };
  
  // Render chart based on type
  switch (type) {
    case 'bar':
      return renderBarChart();
    case 'pie':
      return renderPieChart();
    case 'line':
      return renderLineChart();
    default:
      return null;
  }
};

export default ExpenseChart;