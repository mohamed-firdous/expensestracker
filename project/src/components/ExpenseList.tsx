import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Expense, Category, FilterOptions } from '../types';
import ExpenseCard from './ExpenseCard';
import Input from './ui/Input';
import Select from './ui/Select';
import Button from './ui/Button';

interface ExpenseListProps {
  expenses: Expense[];
  categories: Category[];
  onEditExpense: (expense: Expense) => void;
  onDeleteExpense: (id: string) => void;
}

const ExpenseList: React.FC<ExpenseListProps> = ({
  expenses,
  categories,
  onEditExpense,
  onDeleteExpense,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterOptions>({});
  
  const handleFilterChange = (key: keyof FilterOptions, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  const resetFilters = () => {
    setFilters({});
    setSearchQuery('');
  };
  
  // Apply filters to expenses
  const filteredExpenses = expenses.filter(expense => {
    // Apply search query
    if (searchQuery && !expense.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }
    
    // Apply category filter
    if (filters.categoryIds?.length && !filters.categoryIds.includes(expense.categoryId)) {
      return false;
    }
    
    // Apply date filters
    if (filters.startDate && expense.date < filters.startDate) {
      return false;
    }
    
    if (filters.endDate && expense.date > filters.endDate) {
      return false;
    }
    
    // Apply amount filters
    if (filters.minAmount !== undefined && expense.amount < filters.minAmount) {
      return false;
    }
    
    if (filters.maxAmount !== undefined && expense.amount > filters.maxAmount) {
      return false;
    }
    
    return true;
  });
  
  const categoryOptions = [
    { value: '', label: 'All Categories' },
    ...categories.map(category => ({
      value: category.id,
      label: category.name,
    })),
  ];
  
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="flex-1">
          <Input
            type="text"
            placeholder="Search expenses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            icon={<Search size={16} />}
            className="min-w-[200px]"
          />
        </div>
        
        <Button
          variant="ghost"
          onClick={() => setShowFilters(!showFilters)}
          leftIcon={<Filter size={16} />}
          size="sm"
        >
          {showFilters ? 'Hide Filters' : 'Show Filters'}
        </Button>
        
        {(showFilters || Object.keys(filters).some(k => !!filters[k as keyof FilterOptions])) && (
          <Button
            variant="ghost"
            onClick={resetFilters}
            leftIcon={<X size={16} />}
            size="sm"
          >
            Reset
          </Button>
        )}
      </div>
      
      {showFilters && (
        <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Select
              label="Category"
              value={filters.categoryIds?.[0] || ''}
              onChange={(e) => 
                handleFilterChange('categoryIds', e.target.value ? [e.target.value] : undefined)
              }
              options={categoryOptions}
            />
            
            <Input
              type="date"
              label="From Date"
              value={filters.startDate || ''}
              onChange={(e) => handleFilterChange('startDate', e.target.value || undefined)}
            />
            
            <Input
              type="date"
              label="To Date"
              value={filters.endDate || ''}
              onChange={(e) => handleFilterChange('endDate', e.target.value || undefined)}
            />
            
            <Input
              type="number"
              label="Min Amount"
              value={filters.minAmount?.toString() || ''}
              onChange={(e) => 
                handleFilterChange('minAmount', e.target.value ? Number(e.target.value) : undefined)
              }
              placeholder="0.00"
              step="0.01"
              min="0"
            />
          </div>
        </div>
      )}
      
      {filteredExpenses.length === 0 ? (
        <div className="mt-8 rounded-lg border border-gray-200 bg-gray-50 p-6 text-center">
          <p className="text-gray-500">No expenses found.</p>
          <p className="mt-1 text-sm text-gray-400">Try adjusting your filters or add new expenses.</p>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          {filteredExpenses.map((expense) => (
            <ExpenseCard
              key={expense.id}
              expense={expense}
              category={categories.find(c => c.id === expense.categoryId)}
              onEdit={onEditExpense}
              onDelete={onDeleteExpense}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default ExpenseList;