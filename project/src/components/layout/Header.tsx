import React from 'react';
import { Menu, BellOff, DollarSign } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onMenuClick: () => void;
  title?: string;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick, title = 'Personal Expense Tracker' }) => {
  return (
    <header className="navbar sticky top-0 z-20 border-b border-gray-200 bg-white shadow-sm">
      <div className="flex items-center">
        <button
          type="button"
          className="mr-2 rounded-md p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 lg:hidden"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        
        <Link to="/" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary-600 text-white">
            <DollarSign className="h-5 w-5" />
          </div>
          <span className="hidden text-lg font-bold text-gray-900 sm:block">
            {title}
          </span>
        </Link>
      </div>
      
      <div className="flex items-center space-x-4">
        <button
          type="button"
          className="rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          aria-label="Notifications"
        >
          <BellOff className="h-5 w-5" />
        </button>
      </div>
    </header>
  );
};

export default Header;