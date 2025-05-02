import React, { SelectHTMLAttributes, forwardRef } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'value'> {
  label?: string;
  options: SelectOption[];
  error?: string;
  value?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, icon, fullWidth = true, className = '', id, ...props }, ref) => {
    // Generate an ID if not provided
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
    
    // Base select classes
    const baseSelectClasses = 'rounded-md border appearance-none px-3 py-2 text-sm focus:outline-none focus:ring-1';
    
    // Generate error and status classes
    const errorClasses = error
      ? 'border-error-500 focus:border-error-500 focus:ring-error-500'
      : 'border-gray-300 focus:border-primary-500 focus:ring-primary-500';
    
    // Icon classes
    const iconClasses = icon ? 'pl-10' : '';
    
    // Width classes
    const widthClasses = fullWidth ? 'w-full' : '';
    
    return (
      <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
        {label && (
          <label htmlFor={selectId} className="mb-1 block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        
        <div className="relative">
          {icon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              {icon}
            </div>
          )}
          
          <select
            ref={ref}
            id={selectId}
            className={`${baseSelectClasses} ${errorClasses} ${iconClasses} ${widthClasses}`}
            aria-invalid={error ? 'true' : 'false'}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          
          <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-400">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 3a.75.75 0 01.55.24l3.25 3.5a.75.75 0 11-1.1 1.02L10 4.852 7.3 7.76a.75.75 0 01-1.1-1.02l3.25-3.5A.75.75 0 0110 3zm-3.76 9.2a.75.75 0 011.06.04l2.7 2.908 2.7-2.908a.75.75 0 111.1 1.02l-3.25 3.5a.75.75 0 01-1.1 0l-3.25-3.5a.75.75 0 01.04-1.06z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>
        
        {error && <p className="mt-1 text-sm text-error-600">{error}</p>}
      </div>
    );
  }
);

Select.displayName = 'Select';

export default Select;