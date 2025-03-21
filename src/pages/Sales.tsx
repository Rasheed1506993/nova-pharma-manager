
import React, { useState, useEffect } from 'react';
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
import { 
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Search, Filter, ArrowDown, Eye, FileText, Printer, Calendar, Download } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import BarcodeGenerator from '@/components/inventory/BarcodeGenerator';

const statusMap = {
  completed: { label: 'مكتمل', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' },
  pending: { label: 'معلق', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' },
  cancelled: { label: 'ملغي', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' },
};

const Sales = () => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [activeTab, setActiveTab] = useState('recent');
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);
  const [isInvoiceOpen, setIsInvoiceOpen] = useState(false);
  const [dateFilter, setDateFilter] = useState('all'); // all, today, week, month
  const [searchTerm, setSearchTerm] = useState('');
  
  const { toast } = useToast();
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // جلب الفواتير من قاعدة البيانات
  const { data: invoices = [], isLoading } = useQuery({
    queryKey: ['sales', dateFilter],
    queryFn: async () => {
      let query = supabase
        .from('sales')
        .select(`
          *,
          customer:customer_id (name)
        `)
        .order('created_at', { ascending: false });
      
      // تطبيق فلتر التاريخ
      if (dateFilter !== 'all') {
        const now = new Date();
        let startDate;
        
        if (dateFilter === 'today') {
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        } else if (dateFilter === 'week') {
          startDate = new Date(now);
          startDate.setDate(startDate.getDate() - 7);
        } else if (dateFilter === 'month') {
          startDate = new Date(now);
          startDate.setMonth(startDate.getMonth() - 1);
        }
        
        if (startDate) {
          query = query.gte('created_at', startDate.toISOString());
        }
      }
      
      const { data, error } = await query;
      
      if (error) {
        toast({
          variant: "destructive",
          title: "خطأ في جلب الفواتير",
          description: error.message,
        });
        return [];
      }
      
      return data || [];
    }
  });

  // الحصول على معلومات المبيعات
  const { data: salesSummary = { daily: 0, weekly: 0, monthly: 0, total: 0 } } = useQuery({
    queryKey: ['sales-summary'],
    queryFn: async () => {
      const now = new Date();
      
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const startOfWeek = new Date(now);
      startOfWeek.setDate(startOfWeek.getDate() - 7);
      const startOfMonth = new Date(now);
      startOfMonth.setMonth(startOfMonth.getMonth() - 1);
      
      const promises = [
        // مبيعات اليوم
        supabase.from('sales').select('total_amount').gte('created_at', startOfDay.toISOString()),
        // مبيعات الأسبوع
        supabase.from('sales').select('total_amount').gte('created_at', startOfWeek.toISOString()),
        // مبيعات الشهر
        supabase.from('sales').select('total_amount').gte('created_at', startOfMonth.toISOString()),
        // إجمالي المبيعات
        supabase.from('sales').select('total_amount'),
      ];
      
      const [dailyResult, weeklyResult, monthlyResult, totalResult] = await Promise.all(promises);
      
      const calcTotal = (data: any[]) => data.reduce((acc, curr) => acc + (curr.total_amount || 0), 0);
      
      return {
        daily: calcTotal(dailyResult.data || []),
        weekly: calcTotal(weeklyResult.data || []),
        monthly: calcTotal(monthlyResult.data || []),
        total: calcTotal(totalResult.data || []),
      };
    }
  });

  // فلترة الفواتير حسب البحث
  const filteredInvoices = invoices.filter(invoice => {
    // البحث في رقم الفاتورة أو اسم العميل
    const invoiceId = invoice.id.toLowerCase();
    const customerName = (invoice.customer?.name || '').toLowerCase();
    const searchTermLower = searchTerm.toLowerCase();
    
    return invoiceId.includes(searchTermLower) || customerName.includes(searchTermLower);
  });

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ar-SA');
  };

  const formatCurrency = (amount: number) => {
    return amount.toFixed(2) + ' ر.س';
  };

  // عرض تفاصيل الفاتورة
  const viewInvoiceDetails = async (invoice: any) => {
    // جلب تفاصيل الفاتورة والمنتجات
    const { data, error } = await supabase
      .from('sale_items')
      .select(`
        *,
        product:product_id (name, scientific_name, barcode)
      `)
      .eq('sale_id', invoice.id);
    
    if (error) {
      toast({
        variant: "destructive",
        title: "خطأ في جلب تفاصيل الفاتورة",
        description: error.message,
      });
      return;
    }
    
    setSelectedInvoice({
      ...invoice,
      items: data
    });
    setIsInvoiceOpen(true);
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
                          <Input 
                            placeholder="بحث..." 
                            className="glass-input h-9 pl-3 pr-9 w-48" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                          />
                        </div>
                        <div className="flex">
                          <Button 
                            variant={dateFilter === 'all' ? 'default' : 'outline'} 
                            size="sm" 
                            className={`h-9 ${dateFilter === 'all' ? 'bg-pharma-600 hover:bg-pharma-700' : ''}`}
                            onClick={() => setDateFilter('all')}
                          >
                            الكل
                          </Button>
                          <Button 
                            variant={dateFilter === 'today' ? 'default' : 'outline'} 
                            size="sm" 
                            className={`h-9 ${dateFilter === 'today' ? 'bg-pharma-600 hover:bg-pharma-700' : ''}`}
                            onClick={() => setDateFilter('today')}
                          >
                            اليوم
                          </Button>
                          <Button 
                            variant={dateFilter === 'week' ? 'default' : 'outline'} 
                            size="sm" 
                            className={`h-9 ${dateFilter === 'week' ? 'bg-pharma-600 hover:bg-pharma-700' : ''}`}
                            onClick={() => setDateFilter('week')}
                          >
                            أسبوع
                          </Button>
                          <Button 
                            variant={dateFilter === 'month' ? 'default' : 'outline'} 
                            size="sm" 
                            className={`h-9 ${dateFilter === 'month' ? 'bg-pharma-600 hover:bg-pharma-700' : ''}`}
                            onClick={() => setDateFilter('month')}
                          >
                            شهر
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    {isLoading ? (
                      <div className="text-center py-8">
                        <p>جاري تحميل البيانات...</p>
                      </div>
                    ) : filteredInvoices.length === 0 ? (
                      <div className="text-center py-8">
                        <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                        <h3 className="text-lg font-medium">لا توجد فواتير</h3>
                        <p className="text-gray-500 dark:text-gray-400 mt-2">لم يتم العثور على أي فواتير تطابق معايير البحث</p>
                      </div>
                    ) : (
                      <div className="rounded-md border overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead className="text-center">رقم الفاتورة</TableHead>
                              <TableHead>العميل</TableHead>
                              <TableHead className="text-center">التاريخ</TableHead>
                              <TableHead className="text-center">المبلغ</TableHead>
                              <TableHead className="text-center">الحالة</TableHead>
                              <TableHead className="text-center">إجراءات</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredInvoices.map((invoice, index) => (
                              <TableRow key={invoice.id} className="animate-slide-in-bottom" style={{ animationDelay: `${index * 0.05}s` }}>
                                <TableCell className="font-medium text-center">{invoice.id}</TableCell>
                                <TableCell>{invoice.customer?.name || 'عميل غير مسجل'}</TableCell>
                                <TableCell className="text-center">
                                  <div className="flex items-center justify-center gap-1">
                                    <Calendar className="h-3.5 w-3.5 text-gray-500" />
                                    <span>{formatDate(invoice.created_at)}</span>
                                  </div>
                                </TableCell>
                                <TableCell className="text-center font-medium">{formatCurrency(invoice.total_amount || 0)}</TableCell>
                                <TableCell className="text-center">
                                  <Badge className={statusMap[invoice.status as keyof typeof statusMap]?.color || statusMap.pending.color}>
                                    {statusMap[invoice.status as keyof typeof statusMap]?.label || 'معلق'}
                                  </Badge>
                                </TableCell>
                                <TableCell>
                                  <div className="flex items-center justify-center space-x-2 space-x-reverse">
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-8 w-8"
                                      onClick={() => viewInvoiceDetails(invoice)}
                                    >
                                      <Eye className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <Printer className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                      <Download className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    )}
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
                    <span className="font-semibold">{formatCurrency(salesSummary.daily)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">هذا الأسبوع</span>
                    <span className="font-semibold">{formatCurrency(salesSummary.weekly)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">هذا الشهر</span>
                    <span className="font-semibold">{formatCurrency(salesSummary.monthly)}</span>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">إجمالي الفواتير</span>
                      <span className="font-bold text-lg">{formatCurrency(salesSummary.total)}</span>
                    </div>
                    {salesSummary.monthly > 0 && salesSummary.monthly > salesSummary.weekly && (
                      <div className="flex items-center text-green-600 dark:text-green-400 text-sm mt-1">
                        <ArrowDown className="h-3 w-3 rotate-180 mr-1" />
                        <span>
                          زيادة بنسبة {((salesSummary.monthly / (salesSummary.weekly || 1) - 1) * 100).toFixed(1)}% من الأسبوع الماضي
                        </span>
                      </div>
                    )}
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

        {/* نافذة تفاصيل الفاتورة */}
        <Dialog open={isInvoiceOpen} onOpenChange={setIsInvoiceOpen}>
          <DialogContent className="sm:max-w-[650px]">
            <DialogHeader>
              <DialogTitle>تفاصيل الفاتورة</DialogTitle>
            </DialogHeader>

            {selectedInvoice && (
              <div className="space-y-6">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-semibold">رقم الفاتورة: {selectedInvoice.id}</h3>
                    <p className="text-sm text-gray-500">
                      التاريخ: {formatDate(selectedInvoice.created_at)}
                    </p>
                  </div>
                  <Badge className={statusMap[selectedInvoice.status as keyof typeof statusMap]?.color || statusMap.pending.color}>
                    {statusMap[selectedInvoice.status as keyof typeof statusMap]?.label || 'معلق'}
                  </Badge>
                </div>

                <div className="border-t border-b py-3">
                  <h4 className="font-medium mb-2">معلومات العميل:</h4>
                  <p>{selectedInvoice.customer?.name || 'عميل غير مسجل'}</p>
                </div>

                <div>
                  <h4 className="font-medium mb-2">المنتجات:</h4>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>المنتج</TableHead>
                        <TableHead className="text-center">الكمية</TableHead>
                        <TableHead className="text-center">السعر</TableHead>
                        <TableHead className="text-center">الإجمالي</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {selectedInvoice.items?.map((item: any) => (
                        <TableRow key={item.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{item.product?.name || 'منتج غير معروف'}</div>
                              {item.product?.barcode && (
                                <div className="flex items-center mt-1">
                                  <span className="text-xs text-gray-500 ml-2">{item.product.barcode}</span>
                                  <div className="scale-75 origin-left">
                                    <BarcodeGenerator value={item.product.barcode} height={30} width={1} displayValue={false} />
                                  </div>
                                </div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell className="text-center">{item.quantity}</TableCell>
                          <TableCell className="text-center">{formatCurrency(item.price)}</TableCell>
                          <TableCell className="text-center">{formatCurrency(item.subtotal)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>

                <div className="border-t pt-3">
                  <div className="flex justify-between mb-1">
                    <span>الإجمالي</span>
                    <span>{formatCurrency(selectedInvoice.total_amount || 0)}</span>
                  </div>
                  {selectedInvoice.discount > 0 && (
                    <div className="flex justify-between mb-1 text-gray-500">
                      <span>الخصم</span>
                      <span>- {formatCurrency(selectedInvoice.discount)}</span>
                    </div>
                  )}
                  <div className="flex justify-between font-bold text-lg mt-2 pt-2 border-t">
                    <span>المبلغ النهائي</span>
                    <span>{formatCurrency((selectedInvoice.total_amount || 0) - (selectedInvoice.discount || 0))}</span>
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button
                variant="outline"
                className="gap-1"
                onClick={() => {
                  // طباعة الفاتورة
                  setIsInvoiceOpen(false);
                }}
              >
                <Printer className="h-4 w-4" />
                <span>طباعة</span>
              </Button>
              <Button
                className="bg-pharma-600 hover:bg-pharma-700 gap-1"
                onClick={() => setIsInvoiceOpen(false)}
              >
                <span>إغلاق</span>
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageContainer>
    </div>
  );
};

export default Sales;
