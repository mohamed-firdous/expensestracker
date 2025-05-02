import React from 'react';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Pencil, Trash2 } from 'lucide-react';
import { Expense, Category } from '../types';
import { formatCurrency } from '../utils/helpers';
import Card from './ui/Card';

interface ExpenseCardProps {
  expense: Expense;
  category: Category | undefined;
  onEdit: (expense: Expense) => void;
  onDelete: (id: string) => void;
}

const ExpenseCard: React.FC<ExpenseCardProps> = ({
  expense,
  category,
  onEdit,
  onDelete,
}) => {
  const { amount, description, date, createdAt } = expense;
  
  return (
    <Card variant="bordered" className="expense-card transition-all hover:shadow-md animate-fade-in">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="mb-1 flex items-center">
            <h4 className="text-lg font-medium text-gray-900">{description}</h4>
          </div>
          
          <div className="mb-2 text-sm text-gray-600">
            <span>{date}</span>
            <span className="mx-2">•</span>
            <span>Added {formatDistanceToNow(parseISO(createdAt), { addSuffix: true })}</span>
          </div>
          
          {category && (
            <div
              className="category-pill mb-3"
              style={{ backgroundColor: `${category.color}20`, color: category.color }}
            >
              {category.name}
            </div>
          )}
        </div>
        
        <div className="ml-4 text-right">
          <div className="mb-2 text-xl font-bold text-gray-900">
            {formatCurrency(amount)}
          </div>
          
          <div className="flex space-x-1">
            <button
              onClick={() => onEdit(expense)}
              className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-primary-600"
              aria-label="Edit expense"
            >
              <Pencil size={16} />
            </button>
            
            <button
              onClick={() => onDelete(expense.id)}
              className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-error-600"
              aria-label="Delete expense"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ExpenseCard;