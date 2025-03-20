
import React from 'react';
import { cn } from '@/lib/utils';
import { Card } from '@/components/ui/card';

interface StatCardProps {
  title: string;
  value: string;
  icon?: React.ReactNode;
  change?: {
    value: string;
    positive: boolean;
  };
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  icon,
  change,
  className 
}) => {
  return (
    <Card className={cn(
      "glass-card overflow-hidden group",
      className
    )}>
      <div className="p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">
            {title}
          </h3>
          {icon && (
            <div className="h-8 w-8 rounded-full bg-pharma-100 dark:bg-pharma-900/30 flex items-center justify-center text-pharma-600 dark:text-pharma-400 group-hover:scale-110 transition-transform duration-300">
              {icon}
            </div>
          )}
        </div>
        <div className="mt-2">
          <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            {value}
          </p>
          {change && (
            <p className={cn(
              "text-xs font-medium mt-1",
              change.positive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
            )}>
              {change.positive ? '↑' : '↓'} {change.value}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
