import React, { useState } from 'react';
import { Receipt, SlidersHorizontal, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useExpenses } from '../contexts/ExpenseContext';
import { Expense } from '../types';
import ExpenseList from '../components/ExpenseList';
import ExpenseForm from '../components/ExpenseForm';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const Expenses: React.FC = () => {
  const { expenses, categories, updateExpense, deleteExpense } = useExpenses();
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setIsModalOpen(true);
  };
  
  const handleUpdateExpense = async (expenseData: Omit<Expense, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => {
    if (editingExpense) {
      await updateExpense(editingExpense.id, expenseData);
      setEditingExpense(null);
      setIsModalOpen(false);
    }
  };
  
  const handleDeleteExpense = async (id: string) => {
    if (confirm('Are you sure you want to delete this expense?')) {
      await deleteExpense(id);
    }
  };
  
  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Manage Expenses</h1>
        <Link to="/add-expense">
          <Button variant="primary" leftIcon={<Plus size={16} />}>
            Add Expense
          </Button>
        </Link>
      </div>
      
      <Card variant="elevated">
        <ExpenseList
          expenses={expenses}
          categories={categories}
          onEditExpense={handleEditExpense}
          onDeleteExpense={handleDeleteExpense}
        />
      </Card>
      
      {/* Edit Expense Modal */}
      {isModalOpen && editingExpense && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full animate-scale-in">
            <div className="flex items-center justify-between border-b border-gray-200 p-4">
              <h2 className="text-lg font-medium">Edit Expense</h2>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingExpense(null);
                }}
                className="text-gray-400 hover:text-gray-500"
              >
                &times;
              </button>
            </div>
            <div className="p-4">
              <ExpenseForm
                onSubmit={handleUpdateExpense}
                categories={categories}
                initialValues={editingExpense}
                submitLabel="Update Expense"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Expenses;