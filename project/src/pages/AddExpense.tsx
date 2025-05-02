import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CircleDollarSign, ArrowLeft } from 'lucide-react';
import { useExpenses } from '../contexts/ExpenseContext';
import ExpenseForm from '../components/ExpenseForm';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const AddExpense: React.FC = () => {
  const { addExpense, categories, isLoading } = useExpenses();
  const navigate = useNavigate();
  
  const handleAddExpense = async (expense: any) => {
    await addExpense(expense);
    navigate('/expenses');
  };
  
  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center space-x-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(-1)}
          leftIcon={<ArrowLeft size={16} />}
        >
          Back
        </Button>
        
        <h1 className="text-2xl font-bold text-gray-900">Add New Expense</h1>
      </div>
      
      <Card variant="elevated" padding="lg">
        <div className="mb-4 flex items-center space-x-3 text-primary-700">
          <CircleDollarSign size={24} />
          <h2 className="text-xl font-semibold">Expense Details</h2>
        </div>
        
        <ExpenseForm
          onSubmit={handleAddExpense}
          categories={categories}
          isLoading={isLoading}
        />
      </Card>
    </div>
  );
};

export default AddExpense;