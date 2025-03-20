
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';

interface Sale {
  id: string;
  customer: {
    name: string;
    avatar?: string;
  };
  amount: string;
  date: string;
  status: 'completed' | 'pending' | 'cancelled';
}

const statusMap = {
  completed: { label: 'مكتمل', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  pending: { label: 'معلق', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
  cancelled: { label: 'ملغي', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
};

const sampleSales: Sale[] = [
  { 
    id: '1', 
    customer: { name: 'محمد أحمد' }, 
    amount: '120.00 ر.س', 
    date: 'منذ 10 دقائق', 
    status: 'completed' 
  },
  { 
    id: '2', 
    customer: { name: 'سارة خالد' }, 
    amount: '85.50 ر.س', 
    date: 'منذ 25 دقيقة', 
    status: 'completed' 
  },
  { 
    id: '3', 
    customer: { name: 'أحمد علي' }, 
    amount: '210.75 ر.س', 
    date: 'منذ ساعة', 
    status: 'pending' 
  },
  { 
    id: '4', 
    customer: { name: 'فاطمة محمد' }, 
    amount: '65.25 ر.س', 
    date: 'منذ 3 ساعات', 
    status: 'completed' 
  },
  { 
    id: '5', 
    customer: { name: 'عمر خالد' }, 
    amount: '145.00 ر.س', 
    date: 'منذ 5 ساعات', 
    status: 'cancelled' 
  },
];

const RecentSales: React.FC = () => {
  return (
    <Card className="glass-card h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-xl">أحدث المبيعات</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {sampleSales.map((sale) => (
            <div 
              key={sale.id} 
              className="flex items-center justify-between py-2 animate-slide-in-bottom"
              style={{ animationDelay: `${parseInt(sale.id) * 0.1}s` }}
            >
              <div className="flex items-center space-x-4 space-x-reverse">
                <Avatar className="h-10 w-10 border border-gray-200 dark:border-gray-700">
                  <div className="bg-pharma-100 dark:bg-pharma-900/30 text-pharma-800 dark:text-pharma-200 h-full w-full flex items-center justify-center font-medium">
                    {sale.customer.name.charAt(0)}
                  </div>
                </Avatar>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {sale.customer.name}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    {sale.date}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-4 space-x-reverse">
                <Badge className={statusMap[sale.status].color}>
                  {statusMap[sale.status].label}
                </Badge>
                <span className="text-sm font-medium">{sale.amount}</span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default RecentSales;
