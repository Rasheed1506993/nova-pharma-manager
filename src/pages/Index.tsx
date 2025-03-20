
import React, { useState } from 'react';
import PageContainer from '@/components/layout/PageContainer';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import StatCard from '@/components/dashboard/StatCard';
import RecentSales from '@/components/dashboard/RecentSales';
import StockAlert from '@/components/dashboard/StockAlert';
import { 
  Receipt, 
  Package, 
  Users, 
  TrendingUp,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  Bar, 
  BarChart, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  Legend
} from 'recharts';

const salesData = [
  { name: 'يناير', sales: 4000 },
  { name: 'فبراير', sales: 3000 },
  { name: 'مارس', sales: 5000 },
  { name: 'أبريل', sales: 2780 },
  { name: 'مايو', sales: 1890 },
  { name: 'يونيو', sales: 2390 },
  { name: 'يوليو', sales: 3490 },
];

const medicineData = [
  { name: 'السبت', prescription: 2400, otc: 1400 },
  { name: 'الأحد', prescription: 1398, otc: 1210 },
  { name: 'الإثنين', prescription: 9800, otc: 3908 },
  { name: 'الثلاثاء', prescription: 3908, otc: 4800 },
  { name: 'الأربعاء', prescription: 4800, otc: 3800 },
  { name: 'الخميس', prescription: 3800, otc: 1500 },
  { name: 'الجمعة', prescription: 4300, otc: 2300 },
];

const Index = () => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="bg-background">
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} />
      
      <PageContainer className={`${sidebarOpen ? 'lg:mr-64' : ''}`}>
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            مرحباً بك في نظام نوفا فارم
          </h1>
          <p className="text-gray-500 dark:text-gray-400">
            هذه نظرة عامة على أداء الصيدلية الخاصة بك.
          </p>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          <StatCard 
            title="إجمالي المبيعات"
            value="24,560 ر.س"
            icon={<Receipt size={18} />}
            change={{ value: '8.2% من الأسبوع الماضي', positive: true }}
          />
          <StatCard 
            title="عدد المنتجات"
            value="1,352"
            icon={<Package size={18} />}
            change={{ value: '12 منتج جديد', positive: true }}
          />
          <StatCard 
            title="العملاء"
            value="856"
            icon={<Users size={18} />}
            change={{ value: '3.1% من الشهر الماضي', positive: true }}
          />
          <StatCard 
            title="الطلبات اليوم"
            value="25"
            icon={<TrendingUp size={18} />}
            change={{ value: '2 أقل من الأمس', positive: false }}
          />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-6">
          <Card className="glass-card lg:col-span-2">
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-4">المبيعات الشهرية</h3>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={salesData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eaeaea" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip 
                      contentStyle={{ 
                        borderRadius: '8px', 
                        border: 'none', 
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        backgroundColor: 'rgba(255, 255, 255, 0.95)'
                      }} 
                    />
                    <Bar dataKey="sales" fill="#0ea5e9" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
          
          <div className="flex flex-col space-y-5">
            <Card className="glass-card animate-slide-in-bottom" style={{ animationDelay: '0.1s' }}>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-medium">الطلبات اليوم</h3>
                  <Button variant="ghost" size="sm" className="h-8 text-pharma-600 hover:text-pharma-700 hover:bg-pharma-50">
                    <Calendar className="h-4 w-4 mr-1" />
                    عرض الكل
                  </Button>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-pharma-50 dark:bg-pharma-900/10 rounded-md">
                    <div>
                      <p className="text-sm font-medium">طلبات اليوم</p>
                      <p className="text-2xl font-bold">25</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-pharma-100 dark:bg-pharma-900/30 flex items-center justify-center text-pharma-600 dark:text-pharma-400">
                      <TrendingUp className="h-6 w-6" />
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/10 rounded-md">
                    <div>
                      <p className="text-sm font-medium">قيد الانتظار</p>
                      <p className="text-2xl font-bold">8</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 dark:text-amber-400">
                      <AlertTriangle className="h-6 w-6" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card h-full animate-slide-in-bottom" style={{ animationDelay: '0.2s' }}>
              <CardContent className="pt-6">
                <h3 className="text-lg font-medium mb-3">مبيعات الأسبوع</h3>
                <div className="h-40">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={medicineData}
                      margin={{
                        top: 5,
                        right: 10,
                        left: 10,
                        bottom: 0,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eaeaea" />
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis tick={{ fontSize: 12 }} />
                      <Tooltip 
                        contentStyle={{ 
                          borderRadius: '8px', 
                          border: 'none', 
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                          backgroundColor: 'rgba(255, 255, 255, 0.95)'
                        }} 
                      />
                      <Line type="monotone" dataKey="prescription" stroke="#0ea5e9" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                      <Line type="monotone" dataKey="otc" stroke="#a855f7" strokeWidth={2} dot={{ r: 3 }} activeDot={{ r: 5 }} />
                      <Legend />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <RecentSales />
          <StockAlert />
        </div>
      </PageContainer>
    </div>
  );
};

export default Index;
