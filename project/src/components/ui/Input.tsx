import React, { InputHTMLAttributes, forwardRef } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  fullWidth?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, fullWidth = true, className = '', id, ...props }, ref) => {
    // Generate an ID if not provided
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    
    // Base input classes
    const baseInputClasses = 'rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-1';
    
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
          <label htmlFor={inputId} className="mb-1 block text-sm font-medium text-gray-700">
            {label}
          </label>
        )}
        
        <div className="relative">
          {icon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">
              {icon}
            </div>
          )}
          
          <input
            ref={ref}
            id={inputId}
            className={`${baseInputClasses} ${errorClasses} ${iconClasses} ${widthClasses}`}
            aria-invalid={error ? 'true' : 'false'}
            {...props}
          />
        </div>
        
        {error && <p className="mt-1 text-sm text-error-600">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;