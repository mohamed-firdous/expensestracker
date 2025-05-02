import React, { useState } from 'react';
import { Budget, Category } from '../types';
import Input from './ui/Input';
import Select from './ui/Select';
import Button from './ui/Button';
import { Wallet, Calendar, Tag } from 'lucide-react';
import { format } from 'date-fns';

interface BudgetFormProps {
  onSubmit: (budget: Omit<Budget, 'id' | 'userId'>) => Promise<void>;
  categories: Category[];
  initialValues?: Partial<Budget>;
  submitLabel?: string;
  isLoading?: boolean;
}

const BudgetForm: React.FC<BudgetFormProps> = ({
  onSubmit,
  categories,
  initialValues = {},
  submitLabel = 'Set Budget',
  isLoading = false,
}) => {
  const [amount, setAmount] = useState(initialValues.amount?.toString() || '');
  const [categoryId, setCategoryId] = useState(initialValues.categoryId || '');
  const [period, setPeriod] = useState(initialValues.period || 'monthly');
  const [startDate, setStartDate] = useState(initialValues.startDate || format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(initialValues.endDate || '');
  const [notifyThreshold, setNotifyThreshold] = useState(initialValues.notifyThreshold?.toString() || '80');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }

    if (!categoryId) {
      newErrors.categoryId = 'Please select a category';
    }

    if (!startDate) {
      newErrors.startDate = 'Start date is required';
    }

    if (!notifyThreshold || isNaN(Number(notifyThreshold)) || Number(notifyThreshold) < 0 || Number(notifyThreshold) > 100) {
      newErrors.notifyThreshold = 'Please enter a valid threshold percentage (0-100)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    await onSubmit({
      amount: Number(amount),
      categoryId,
      period,
      startDate,
      endDate: endDate || undefined,
      notifyThreshold: Number(notifyThreshold),
    });
  };

  const periodOptions = [
    { value: 'daily', label: 'Daily' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'monthly', label: 'Monthly' },
    { value: 'yearly', label: 'Yearly' },
  ];

  const categoryOptions = categories.map(category => ({
    value: category.id,
    label: category.name,
  }));

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          type="number"
          label="Budget Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          icon={<Wallet size={16} />}
          error={errors.amount}
          step="0.01"
          min="0"
          required
        />

        <Select
          label="Category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          options={categoryOptions}
          icon={<Tag size={16} />}
          error={errors.categoryId}
          required
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Select
          label="Budget Period"
          value={period}
          onChange={(e) => setPeriod(e.target.value as Budget['period'])}
          options={periodOptions}
          icon={<Calendar size={16} />}
          required
        />

        <Input
          type="number"
          label="Notification Threshold (%)"
          value={notifyThreshold}
          onChange={(e) => setNotifyThreshold(e.target.value)}
          placeholder="80"
          min="0"
          max="100"
          error={errors.notifyThreshold}
          required
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Input
          type="date"
          label="Start Date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          error={errors.startDate}
          required
        />

        <Input
          type="date"
          label="End Date (Optional)"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default BudgetForm;