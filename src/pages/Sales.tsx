
import React, { useState } from 'react';
import PageContainer from '@/components/layout/PageContainer';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import InvoiceForm from '@/components/sales/InvoiceForm';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, ArrowDown, Eye, FileText, Printer } from 'lucide-react';

const invoices = [
  {
    id: 'INV-001',
    customer: 'محمد أحمد',
    date: '2023-06-15',
    amount: '120.50 ر.س',
    status: 'completed',
    items: 5,
  },
  {
    id: 'INV-002',
    customer: 'سارة خالد',
    date: '2023-06-15',
    amount: '85.75 ر.س',
    status: 'completed',
    items: 3,
  },
  {
    id: 'INV-003',
    customer: 'أحمد علي',
    date: '2023-06-14',
    amount: '210.25 ر.س',
    status: 'completed',
    items: 7,
  },
  {
    id: 'INV-004',
    customer: 'فاطمة محمد',
    date: '2023-06-14',
    amount: '65.00 ر.س',
    status: 'pending',
    items: 2,
  },
  {
    id: 'INV-005',
    customer: 'عمر خالد',
    date: '2023-06-13',
    amount: '145.30 ر.س',
    status: 'cancelled',
    items: 4,
  },
];

const statusMap = {
  completed: { label: 'مكتمل', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  pending: { label: 'معلق', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
  cancelled: { label: 'ملغي', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
};

const Sales = () => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [activeTab, setActiveTab] = useState('recent');
  
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
              المبيعات والفواتير
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              إدارة الفواتير وعمليات البيع
            </p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="flex space-x-4 space-x-reverse mb-4">
                <Button 
                  variant={activeTab === 'recent' ? 'default' : 'outline'} 
                  className={activeTab === 'recent' ? 'bg-pharma-600 hover:bg-pharma-700' : ''}
                  onClick={() => setActiveTab('recent')}
                >
                  الفواتير الأخيرة
                </Button>
                <Button 
                  variant={activeTab === 'new' ? 'default' : 'outline'} 
                  className={activeTab === 'new' ? 'bg-pharma-600 hover:bg-pharma-700' : ''}
                  onClick={() => setActiveTab('new')}
                >
                  فاتورة جديدة
                </Button>
              </div>
              
              {activeTab === 'recent' ? (
                <Card className="glass-card">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <CardTitle className="text-xl">الفواتير الأخيرة</CardTitle>
                      <div className="flex items-center space-x-2 space-x-reverse">
                        <div className="relative">
                          <Search className="absolute top-2.5 right-3 h-4 w-4 text-gray-400" />
                          <Input placeholder="بحث..." className="glass-input h-9 pl-3 pr-9 w-48" />
                        </div>
                        <Button variant="outline" size="sm" className="h-9">
                          <Filter className="h-4 w-4 mr-1" />
                          فلترة
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="rounded-md border overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>رقم الفاتورة</TableHead>
                            <TableHead>العميل</TableHead>
                            <TableHead className="text-center">التاريخ</TableHead>
                            <TableHead className="text-center">العناصر</TableHead>
                            <TableHead className="text-center">المبلغ</TableHead>
                            <TableHead className="text-center">الحالة</TableHead>
                            <TableHead className="text-center">إجراءات</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {invoices.map((invoice, index) => (
                            <TableRow key={invoice.id} className="animate-slide-in-bottom" style={{ animationDelay: `${index * 0.05}s` }}>
                              <TableCell className="font-medium">{invoice.id}</TableCell>
                              <TableCell>{invoice.customer}</TableCell>
                              <TableCell className="text-center">{invoice.date}</TableCell>
                              <TableCell className="text-center">{invoice.items}</TableCell>
                              <TableCell className="text-center">{invoice.amount}</TableCell>
                              <TableCell className="text-center">
                                <Badge className={statusMap[invoice.status].color}>
                                  {statusMap[invoice.status].label}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center justify-center space-x-2 space-x-reverse">
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Eye className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <FileText className="h-4 w-4" />
                                  </Button>
                                  <Button variant="ghost" size="icon" className="h-8 w-8">
                                    <Printer className="h-4 w-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <InvoiceForm />
              )}
            </div>
          </div>
          
          <div>
            <Card className="glass-card mb-6">
              <CardHeader>
                <CardTitle className="text-lg">ملخص المبيعات</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">اليوم</span>
                    <span className="font-semibold">1,250.50 ر.س</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">هذا الأسبوع</span>
                    <span className="font-semibold">4,725.25 ر.س</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">هذا الشهر</span>
                    <span className="font-semibold">12,568.75 ر.س</span>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">إجمالي الفواتير</span>
                      <span className="font-bold text-lg">24,560.50 ر.س</span>
                    </div>
                    <div className="flex items-center text-green-600 dark:text-green-400 text-sm mt-1">
                      <ArrowDown className="h-3 w-3 rotate-180 mr-1" />
                      <span>زيادة بنسبة 12.5% من الشهر الماضي</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardHeader>
                <CardTitle className="text-lg">طرق الدفع الشائعة</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-gray-600 dark:text-gray-400">نقدي</span>
                      <span className="text-sm font-medium">65%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-pharma-500 rounded-full" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-gray-600 dark:text-gray-400">بطاقة ائتمان</span>
                      <span className="text-sm font-medium">25%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: '25%' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-gray-600 dark:text-gray-400">تأمين</span>
                      <span className="text-sm font-medium">10%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: '10%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </PageContainer>
    </div>
  );
};

export default Sales;
