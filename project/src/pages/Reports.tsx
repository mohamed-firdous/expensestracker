import React, { useState, useMemo } from 'react';
import { format, subMonths, startOfMonth, endOfMonth, parseISO } from 'date-fns';
import { BarChart3, PieChart, TrendingUp, Calendar, Download } from 'lucide-react';
import { useExpenses } from '../contexts/ExpenseContext';
import { calculateExpenseSummary } from '../utils/helpers';
import ExpenseChart from '../components/charts/ExpenseChart';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Select from '../components/ui/Select';

const Reports: React.FC = () => {
  const { expenses, categories } = useExpenses();
  const [timeFrame, setTimeFrame] = useState<'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  const [chartType, setChartType] = useState<'bar' | 'pie' | 'line'>('bar');
  const [selectedMonth, setSelectedMonth] = useState<number>(0); // 0 = current month, 1 = last month, etc.
  
  // Get date range for selected month
  const dateRange = useMemo(() => {
    const today = new Date();
    const targetMonth = subMonths(today, selectedMonth);
    return {
      start: startOfMonth(targetMonth),
      end: endOfMonth(targetMonth),
    };
  }, [selectedMonth]);
  
  // Prepare data for charts
  const chartData = useMemo(() => {
    const startDate = format(dateRange.start, 'yyyy-MM-dd');
    const endDate = format(dateRange.end, 'yyyy-MM-dd');
    
    return calculateExpenseSummary(
      expenses,
      categories,
      {
        startDate,
        endDate,
        timeFrame,
      }
    );
  }, [expenses, categories, dateRange, timeFrame]);
  
  // Options for select dropdowns
  const timeFrameOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' },
  ];
  
  const chartTypeOptions = [
    { value: 'bar', label: 'Bar Chart' },
    { value: 'line', label: 'Line Chart' },
    { value: 'pie', label: 'Pie Chart' },
  ];
  
  const monthOptions = [
    { value: '0', label: 'Current Month' },
    { value: '1', label: 'Last Month' },
    { value: '2', label: 'Two Months Ago' },
    { value: '3', label: 'Three Months Ago' },
    { value: '6', label: 'Six Months Ago' },
    { value: '12', label: 'One Year Ago' },
  ];
  
  // Generate report title
  const reportTitle = `Expense Report - ${format(dateRange.start, 'MMMM yyyy')}`;
  
  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Expense Reports</h1>
        <Button
          variant="outline"
          leftIcon={<Download size={16} />}
          onClick={() => {
            alert('Export functionality would be implemented here in a production app.');
          }}
        >
          Export Report
        </Button>
      </div>
      
      <Card variant="elevated">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-xl font-semibold">{reportTitle}</h2>
          
          <div className="flex flex-wrap gap-2">
            <Select
              options={monthOptions}
              value={selectedMonth.toString()}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              icon={<Calendar size={16} />}
              fullWidth={false}
              className="w-40"
            />
            
            <Select
              options={timeFrameOptions}
              value={timeFrame}
              onChange={(e) => setTimeFrame(e.target.value as any)}
              icon={<TrendingUp size={16} />}
              fullWidth={false}
              className="w-32"
            />
            
            <Select
              options={chartTypeOptions}
              value={chartType}
              onChange={(e) => setChartType(e.target.value as any)}
              icon={
                chartType === 'bar' ? <BarChart3 size={16} /> : 
                chartType === 'pie' ? <PieChart size={16} /> : 
                <TrendingUp size={16} />
              }
              fullWidth={false}
              className="w-36"
            />
          </div>
        </div>
        
        <div className="h-96">
          <ExpenseChart
            data={chartData}
            categories={categories}
            type={chartType}
            timeFrame={timeFrame}
          />
        </div>
      </Card>
      
      {/* Category breakdown */}
      <Card variant="elevated">
        <h2 className="mb-4 text-xl font-semibold">Category Breakdown</h2>
        
        <div className="overflow-x-auto">
          <table className="w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Amount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                  Percentage
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {chartData.categories.map((category) => (
                <tr key={category.categoryId}>
                  <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                    {category.categoryName}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    ${category.amount.toFixed(2)}
                  </td>
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                    {category.percentage.toFixed(1)}%
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-gray-50">
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                  Total
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                  ${chartData.total.toFixed(2)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                  100%
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Reports;