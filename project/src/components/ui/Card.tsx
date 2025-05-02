import React, { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'bordered' | 'elevated';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  header,
  footer,
  className = '',
  ...props
}) => {
  // Base card classes
  const baseClasses = 'rounded-lg bg-white overflow-hidden transition-shadow';
  
  // Variant classes
  const variantClasses = {
    default: 'shadow-sm',
    bordered: 'border border-gray-200',
    elevated: 'shadow-md hover:shadow-lg',
  };
  
  // Padding classes for the content area
  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-4',
    lg: 'p-6',
  };
  
  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`} {...props}>
      {header && (
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
          {header}
        </div>
      )}
      
      <div className={paddingClasses[padding]}>
        {children}
      </div>
      
      {footer && (
        <div className="border-t border-gray-200 bg-gray-50 px-4 py-3">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;