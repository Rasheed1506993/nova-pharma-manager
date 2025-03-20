
import React, { useState } from 'react';
import PageContainer from '@/components/layout/PageContainer';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { 
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { 
  Calendar,
  Download,
  BarChart3,
  PieChart as PieChartIcon,
  TrendingUp,
  FileText,
  Printer,
  Users,
  Package
} from 'lucide-react';

const salesData = [
  { name: 'يناير', sales: 4000, profit: 2400 },
  { name: 'فبراير', sales: 3000, profit: 1398 },
  { name: 'مارس', sales: 5000, profit: 3000 },
  { name: 'أبريل', sales: 2780, profit: 1908 },
  { name: 'مايو', sales: 1890, profit: 800 },
  { name: 'يونيو', sales: 2390, profit: 1300 },
  { name: 'يوليو', sales: 3490, profit: 2300 },
];

const categoryData = [
  { name: 'مسكنات', value: 35 },
  { name: 'مضادات حيوية', value: 25 },
  { name: 'مضادات الهيستامين', value: 15 },
  { name: 'مكملات غذائية', value: 15 },
  { name: 'أخرى', value: 10 },
];

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

const topProducts = [
  { id: '1', name: 'باراسيتامول 500mg', sales: 245, amount: '3,675.00 ر.س' },
  { id: '2', name: 'أموكسيسيللين 250mg', sales: 187, amount: '6,545.00 ر.س' },
  { id: '3', name: 'لوراتادين 10mg', sales: 156, amount: '3,900.00 ر.س' },
  { id: '4', name: 'إبوبروفين 400mg', sales: 132, amount: '2,376.00 ر.س' },
  { id: '5', name: 'سيتريزين 5mg', sales: 124, amount: '2,790.00 ر.س' },
];

const topCustomers = [
  { id: '1', name: 'محمد أحمد', purchases: 15, amount: '1,850.00 ر.س' },
  { id: '2', name: 'سارة خالد', purchases: 12, amount: '1,475.50 ر.س' },
  { id: '3', name: 'أحمد علي', purchases: 9, amount: '1,125.25 ر.س' },
  { id: '4', name: 'فاطمة محمد', purchases: 8, amount: '985.75 ر.س' },
  { id: '5', name: 'عمر خالد', purchases: 7, amount: '875.00 ر.س' },
];

const Reports = () => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  return (
    <div className="bg-background">
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} />
      
      <PageContainer className={`${sidebarOpen ? 'lg:mr-64' : ''}`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              التقارير والإحصائيات
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              تحليل بيانات أداء الصيدلية والمبيعات
            </p>
          </div>
          
          <div className="flex space-x-2 space-x-reverse">
            <Button variant="outline" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>15 يونيو 2023 - 15 يوليو 2023</span>
            </Button>
            <Button variant="outline" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              <span>تصدير</span>
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="mb-6">
          <TabsList className="glass-card">
            <TabsTrigger value="overview" className="flex items-center gap-1">
              <BarChart3 className="h-4 w-4" />
              <span>نظرة عامة</span>
            </TabsTrigger>
            <TabsTrigger value="sales" className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4" />
              <span>المبيعات</span>
            </TabsTrigger>
            <TabsTrigger value="products" className="flex items-center gap-1">
              <Package className="h-4 w-4" />
              <span>المنتجات</span>
            </TabsTrigger>
            <TabsTrigger value="customers" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>العملاء</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="p-1">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <Card className="glass-card">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">المبيعات والأرباح</CardTitle>
                    <Select defaultValue="month">
                      <SelectTrigger className="w-32 h-8 glass-input">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="week">أسبوعي</SelectItem>
                        <SelectItem value="month">شهري</SelectItem>
                        <SelectItem value="year">سنوي</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={salesData}
                        margin={{
                          top: 20,
                          right: 30,
                          left: 20,
                          bottom: 10,
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
                        <Legend />
                        <Line type="monotone" dataKey="sales" stroke="#0ea5e9" strokeWidth={2} name="المبيعات" />
                        <Line type="monotone" dataKey="profit" stroke="#10b981" strokeWidth={2} name="الأرباح" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-card">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">تصنيفات المنتجات</CardTitle>
                    <PieChartIcon className="h-5 w-5 text-pharma-600" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="h-80 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                          outerRadius={100}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            borderRadius: '8px', 
                            border: 'none', 
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                            backgroundColor: 'rgba(255, 255, 255, 0.95)'
                          }}
                          formatter={(value, name) => [`${value}%`, name]}
                        />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="glass-card">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">المنتجات الأكثر مبيعاً</CardTitle>
                    <Button variant="ghost" size="sm" className="h-8 text-pharma-600">
                      <FileText className="h-4 w-4 mr-1" />
                      التقرير الكامل
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50%]">المنتج</TableHead>
                          <TableHead className="text-center">الكمية</TableHead>
                          <TableHead className="text-center">المبلغ</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {topProducts.map((product, index) => (
                          <TableRow key={product.id} className="animate-slide-in-bottom" style={{ animationDelay: `${index * 0.05}s` }}>
                            <TableCell className="font-medium">{product.name}</TableCell>
                            <TableCell className="text-center">{product.sales}</TableCell>
                            <TableCell className="text-center">{product.amount}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-card">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl">أكثر العملاء شراءً</CardTitle>
                    <Button variant="ghost" size="sm" className="h-8 text-pharma-600">
                      <Printer className="h-4 w-4 mr-1" />
                      طباعة
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="rounded-md border overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead className="w-[50%]">العميل</TableHead>
                          <TableHead className="text-center">عدد المشتريات</TableHead>
                          <TableHead className="text-center">المبلغ</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {topCustomers.map((customer, index) => (
                          <TableRow key={customer.id} className="animate-slide-in-bottom" style={{ animationDelay: `${index * 0.05}s` }}>
                            <TableCell className="font-medium">{customer.name}</TableCell>
                            <TableCell className="text-center">{customer.purchases}</TableCell>
                            <TableCell className="text-center">{customer.amount}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="sales">
            <div className="p-4 bg-pharma-50 dark:bg-pharma-900/10 rounded-lg mb-4">
              <p className="text-pharma-800 dark:text-pharma-200">
                يمكنك عرض تقارير مفصلة عن المبيعات والإيرادات والأرباح حسب الفترة الزمنية المحددة.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="products">
            <div className="p-4 bg-pharma-50 dark:bg-pharma-900/10 rounded-lg mb-4">
              <p className="text-pharma-800 dark:text-pharma-200">
                تحليل أداء المنتجات والمخزون وعرض المنتجات ذات الطلب العالي والمنخفض.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="customers">
            <div className="p-4 bg-pharma-50 dark:bg-pharma-900/10 rounded-lg mb-4">
              <p className="text-pharma-800 dark:text-pharma-200">
                عرض تقارير عن العملاء وسلوكهم الشرائي ووفائهم للصيدلية.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </PageContainer>
    </div>
  );
};

export default Reports;
