import React, { useState } from 'react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useExpenses } from '../contexts/ExpenseContext';
import { Budget as BudgetType } from '../types';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import { formatCurrency } from '../utils/helpers';

export const Budget: React.FC = () => {
  const { categories, budgets, addBudget, updateBudget, deleteBudget } = useExpenses();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBudget, setEditingBudget] = useState<BudgetType | null>(null);
  const [formData, setFormData] = useState({
    categoryId: '',
    amount: '',
    period: 'monthly' as 'daily' | 'weekly' | 'monthly' | 'yearly',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const budgetData = {
      ...formData,
      amount: Number(formData.amount),
      startDate: new Date().toISOString().split('T')[0],
    };

    if (editingBudget) {
      await updateBudget(editingBudget.id, budgetData);
    } else {
      await addBudget(budgetData);
    }

    setIsModalOpen(false);
    setEditingBudget(null);
    setFormData({ categoryId: '', amount: '', period: 'monthly' });
  };

  const handleEdit = (budget: BudgetType) => {
    setEditingBudget(budget);
    setFormData({
      categoryId: budget.categoryId,
      amount: budget.amount.toString(),
      period: budget.period,
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this budget?')) {
      await deleteBudget(id);
    }
  };

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Budget Settings</h1>
        <Button
          variant="primary"
          leftIcon={<Plus size={16} />}
          onClick={() => setIsModalOpen(true)}
        >
          Add Budget
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {budgets.map((budget) => {
          const category = categories.find(c => c.id === budget.categoryId);
          return (
            <Card key={budget.id} variant="bordered" className="relative">
              <div className="absolute right-2 top-2 flex space-x-1">
                <button
                  onClick={() => handleEdit(budget)}
                  className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-primary-600"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(budget.id)}
                  className="rounded p-1 text-gray-400 hover:bg-gray-100 hover:text-error-600"
                >
                  <Trash2 size={16} />
                </button>
              </div>

              <h3 className="text-lg font-medium text-gray-900">
                {category?.name || 'Unknown Category'}
              </h3>
              <p className="mt-1 text-2xl font-bold text-primary-600">
                {formatCurrency(budget.amount)}
              </p>
              <p className="mt-1 text-sm text-gray-500">
                per {budget.period}
              </p>
            </Card>
          );
        })}
      </div>

      {/* Budget Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <h2 className="mb-4 text-xl font-semibold">
              {editingBudget ? 'Edit Budget' : 'Add New Budget'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <Select
                label="Category"
                value={formData.categoryId}
                onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                options={categories.map(category => ({
                  value: category.id,
                  label: category.name,
                }))}
                required
              />

              <Input
                type="number"
                label="Amount"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                placeholder="0.00"
                required
              />

              <Select
                label="Period"
                value={formData.period}
                onChange={(e) => setFormData({ ...formData, period: e.target.value as any })}
                options={[
                  { value: 'daily', label: 'Daily' },
                  { value: 'weekly', label: 'Weekly' },
                  { value: 'monthly', label: 'Monthly' },
                  { value: 'yearly', label: 'Yearly' },
                ]}
                required
              />

              <div className="flex justify-end space-x-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    setIsModalOpen(false);
                    setEditingBudget(null);
                    setFormData({ categoryId: '', amount: '', period: 'monthly' });
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  {editingBudget ? 'Update Budget' : 'Add Budget'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};