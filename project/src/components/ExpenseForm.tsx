import React, { useState, useEffect } from 'react';
import { Wallet, Calendar, Tag, Banknote, CircleDollarSign, FileText } from 'lucide-react';
import { Expense, Category } from '../types';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';
import { format } from 'date-fns';

interface ExpenseFormProps {
  onSubmit: (expense: Omit<Expense, 'id' | 'userId' | 'createdAt' | 'updatedAt'>) => void;
  categories: Category[];
  initialValues?: Partial<Expense>;
  submitLabel?: string;
  isLoading?: boolean;
}

const ExpenseForm: React.FC<ExpenseFormProps> = ({
  onSubmit,
  categories,
  initialValues = {},
  submitLabel = 'Add Expense',
  isLoading = false,
}) => {
  const [amount, setAmount] = useState(initialValues.amount?.toString() || '');
  const [description, setDescription] = useState(initialValues.description || '');
  const [date, setDate] = useState(initialValues.date || format(new Date(), 'yyyy-MM-dd'));
  const [categoryId, setCategoryId] = useState(initialValues.categoryId || '');
  const [paymentMethod, setPaymentMethod] = useState(initialValues.paymentMethod || 'Credit Card');
  const [notes, setNotes] = useState(initialValues.notes || '');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Update form when initialValues change
  useEffect(() => {
    if (initialValues) {
      if (initialValues.amount) setAmount(initialValues.amount.toString());
      if (initialValues.description) setDescription(initialValues.description);
      if (initialValues.date) setDate(initialValues.date);
      if (initialValues.categoryId) setCategoryId(initialValues.categoryId);
      if (initialValues.paymentMethod) setPaymentMethod(initialValues.paymentMethod);
      if (initialValues.notes) setNotes(initialValues.notes);
    }
  }, [initialValues]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }
    
    if (!description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!date) {
      newErrors.date = 'Date is required';
    }
    
    if (!categoryId) {
      newErrors.categoryId = 'Category is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    onSubmit({
      amount: Number(amount),
      description,
      date,
      categoryId,
      paymentMethod,
      notes: notes || undefined,
    });
  };

  const categoryOptions = categories.map(category => ({
    value: category.id,
    label: category.name,
  }));

  const paymentMethodOptions = [
    { value: 'Credit Card', label: 'Credit Card' },
    { value: 'Debit Card', label: 'Debit Card' },
    { value: 'Cash', label: 'Cash' },
    { value: 'Bank Transfer', label: 'Bank Transfer' },
    { value: 'Mobile Payment', label: 'Mobile Payment' },
    { value: 'Other', label: 'Other' },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <Input
          type="number"
          label="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="0.00"
          icon={<Banknote size={16} />}
          error={errors.amount}
          step="0.01"
          min="0"
          required
        />
        
        <Input
          type="date"
          label="Date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          icon={<Calendar size={16} />}
          error={errors.date}
          required
        />
      </div>
      
      <Input
        type="text"
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="What did you spend on?"
        icon={<FileText size={16} />}
        error={errors.description}
        required
      />
      
      <div className="grid gap-4 md:grid-cols-2">
        <Select
          label="Category"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          options={categoryOptions}
          icon={<Tag size={16} />}
          error={errors.categoryId}
          required
        />
        
        <Select
          label="Payment Method"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          options={paymentMethodOptions}
          icon={<Wallet size={16} />}
        />
      </div>
      
      <div>
        <label htmlFor="notes" className="mb-1 block text-sm font-medium text-gray-700">
          Notes (Optional)
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Add any additional notes here..."
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
          rows={3}
        />
      </div>
      
      <div className="flex justify-end">
        <Button
          type="submit"
          variant="primary"
          isLoading={isLoading}
          leftIcon={<CircleDollarSign size={16} />}
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
};

export default ExpenseForm;