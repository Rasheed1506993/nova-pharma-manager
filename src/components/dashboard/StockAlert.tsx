
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle } from 'lucide-react';

interface StockItem {
  id: string;
  name: string;
  currentStock: number;
  minStock: number;
  percentRemaining: number;
}

const sampleStockAlerts: StockItem[] = [
  {
    id: '1',
    name: 'باراسيتامول 500mg',
    currentStock: 5,
    minStock: 20,
    percentRemaining: 25,
  },
  {
    id: '2',
    name: 'أموكسيسيللين 250mg',
    currentStock: 3,
    minStock: 15,
    percentRemaining: 20,
  },
  {
    id: '3',
    name: 'لوراتادين 10mg',
    currentStock: 2,
    minStock: 10,
    percentRemaining: 20,
  },
  {
    id: '4',
    name: 'سيتريزين 5mg',
    currentStock: 4,
    minStock: 20,
    percentRemaining: 20,
  },
];

const StockAlert: React.FC = () => {
  return (
    <Card className="glass-card h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">تنبيهات المخزون</CardTitle>
          <AlertTriangle className="h-5 w-5 text-amber-500" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {sampleStockAlerts.map((item) => (
            <div 
              key={item.id} 
              className="animate-slide-in-bottom"
              style={{ animationDelay: `${parseInt(item.id) * 0.1}s` }}
            >
              <div className="flex items-center justify-between mb-1">
                <p className="text-sm font-medium">{item.name}</p>
                <span className="text-xs text-red-600 dark:text-red-400 font-medium">
                  {item.currentStock} / {item.minStock}
                </span>
              </div>
              <Progress 
                value={item.percentRemaining} 
                className="h-2 bg-gray-100 dark:bg-gray-800"
                indicatorClassName={item.percentRemaining < 30 ? "bg-red-500" : "bg-amber-500"}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default StockAlert;
