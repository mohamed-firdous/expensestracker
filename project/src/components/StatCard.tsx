import React from 'react';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';
import Card from './ui/Card';
import { formatCurrency } from '../utils/helpers';

interface StatCardProps {
  title: string;
  value: number;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: number;
  trendLabel?: string;
  icon?: React.ReactNode;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  trend,
  trendValue,
  trendLabel,
  icon,
  className = '',
}) => {
  const renderTrendIcon = () => {
    switch (trend) {
      case 'up':
        return <TrendingUp size={16} className="text-error-500" />;
      case 'down':
        return <TrendingDown size={16} className="text-success-500" />;
      default:
        return <Minus size={16} className="text-gray-400" />;
    }
  };

  const renderTrendText = () => {
    if (!trendValue && trend === 'neutral') return 'No change';
    
    if (trendValue) {
      const formattedValue = trendValue < 1 ? `${(trendValue * 100).toFixed(1)}%` : `${trendValue.toFixed(1)}%`;
      return (
        <span
          className={
            trend === 'up'
              ? 'text-error-500'
              : trend === 'down'
              ? 'text-success-500'
              : 'text-gray-500'
          }
        >
          {formattedValue}
          {trendLabel && ` ${trendLabel}`}
        </span>
      );
    }
    
    return null;
  };

  return (
    <Card
      variant="elevated"
      className={`stats-card transition-all hover:translate-y-[-2px] ${className}`}
    >
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gray-500">{title}</h3>
        {icon && <div className="text-gray-400">{icon}</div>}
      </div>
      
      <div className="mt-2 text-2xl font-bold text-gray-900">
        {formatCurrency(value)}
      </div>
      
      {(trend || trendValue) && (
        <div className="mt-1 flex items-center space-x-1 text-xs">
          {renderTrendIcon()}
          <span>{renderTrendText()}</span>
        </div>
      )}
    </Card>
  );
};

export default StatCard;