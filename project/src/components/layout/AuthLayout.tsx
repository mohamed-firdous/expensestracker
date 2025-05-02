import React, { ReactNode } from 'react';
import { DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children, title, subtitle }) => {
  return (
    <div className="flex min-h-screen flex-col justify-center bg-gray-50 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-primary-600">
          <DollarSign className="h-8 w-8 text-white" />
        </div>
        
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">{title}</h2>
        
        {subtitle && (
          <p className="mt-2 text-center text-sm text-gray-600">{subtitle}</p>
        )}
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="animate-fade-in rounded-lg bg-white px-4 py-8 shadow sm:px-10">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;