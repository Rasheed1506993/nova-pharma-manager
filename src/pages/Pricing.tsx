
import React, { useState } from 'react';
import PageContainer from '@/components/layout/PageContainer';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
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
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Tag, Percent, DollarSign, ArrowUpDown, Check, Save, ArrowDownUp } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Badge } from '@/components/ui/badge';

const updatePriceSchema = z.object({
  amount: z.coerce.number().min(0, { message: 'يجب أن تكون القيمة أكبر من أو تساوي صفر' }),
  type: z.enum(['fixed', 'percentage']),
  operation: z.enum(['increase', 'decrease', 'set']),
  category: z.string().optional(),
});

type UpdatePriceFormValues = z.infer<typeof updatePriceSchema>;

const Pricing = () => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [isBulkUpdateOpen, setIsBulkUpdateOpen] = useState(false);
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [editableRows, setEditableRows] = useState<Record<string, boolean>>({});
  const [tempPrices, setTempPrices] = useState<Record<string, string>>({});
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // استعلام لجلب المنتجات
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');
      
      if (error) {
        toast({
          variant: "destructive",
          title: "خطأ في جلب بيانات المنتجات",
          description: error.message,
        });
        return [];
      }
      
      return data;
    }
  });

  // نموذج تحديث الأسعار
  const bulkUpdateForm = useForm<UpdatePriceFormValues>({
    resolver: zodResolver(updatePriceSchema),
    defaultValues: {
      amount: 0,
      type: 'fixed',
      operation: 'increase',
      category: 'all',
    },
  });

  // تعديل سعر منتج واحد
  const updateProductPriceMutation = useMutation({
    mutationFn: async ({ id, price }: { id: string, price: number }) => {
      const { data, error } = await supabase
        .from('products')
        .update({ price, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      toast({
        title: "تم التحديث بنجاح",
        description: "تم تحديث سعر المنتج بنجاح",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "خطأ في تحديث سعر المنتج",
        description: error.message,
      });
    }
  });

  // تعديل عدة منتجات دفعة واحدة
  const bulkUpdatePricesMutation = useMutation({
    mutationFn: async (values: UpdatePriceFormValues) => {
      const { amount, type, operation, category } = values;
      
      // تحديد المنتجات المراد تحديثها
      let productsToUpdate = Object.entries(selectedRows)
        .filter(([_, isSelected]) => isSelected)
        .map(([id]) => id);
      
      if (productsToUpdate.length === 0) {
        // إذا لم يتم تحديد أي منتج، اختر جميع المنتجات حسب التصفية
        productsToUpdate = filteredProducts.map(p => p.id);
      }
      
      // الحصول على البيانات الحالية للمنتجات
      const { data: currentProducts, error: fetchError } = await supabase
        .from('products')
        .select('id, price')
        .in('id', productsToUpdate);
      
      if (fetchError) throw fetchError;
      
      // حساب الأسعار الجديدة
      const updates = currentProducts.map(product => {
        let newPrice = product.price;
        
        if (operation === 'set') {
          newPrice = amount;
        } else if (operation === 'increase') {
          if (type === 'fixed') {
            newPrice += amount;
          } else {
            // نسبة مئوية
            newPrice += (newPrice * amount) / 100;
          }
        } else if (operation === 'decrease') {
          if (type === 'fixed') {
            newPrice = Math.max(0, newPrice - amount);
          } else {
            // نسبة مئوية
            newPrice -= (newPrice * amount) / 100;
            newPrice = Math.max(0, newPrice);
          }
        }
        
        return {
          id: product.id,
          price: parseFloat(newPrice.toFixed(2)),
          updated_at: new Date().toISOString()
        };
      });
      
      // تحديث قاعدة البيانات
      const { error: updateError } = await supabase
        .from('products')
        .upsert(updates);
      
      if (updateError) throw updateError;
      
      return updates.length;
    },
    onSuccess: (count) => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setIsBulkUpdateOpen(false);
      setSelectedRows({});
      bulkUpdateForm.reset();
      toast({
        title: "تم التحديث بنجاح",
        description: `تم تحديث أسعار ${count} منتج بنجاح`,
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "خطأ في تحديث الأسعار",
        description: error.message,
      });
    }
  });

  const onBulkUpdateSubmit = (values: UpdatePriceFormValues) => {
    bulkUpdatePricesMutation.mutate(values);
  };

  // الحصول على الفئات الفريدة من المنتجات
  const uniqueCategories = [...new Set(products.map(product => product.category).filter(Boolean))];

  // تصفية المنتجات
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.scientific_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.barcode?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  // إدارة التحديدات
  const toggleSelectAll = () => {
    if (Object.values(selectedRows).every(selected => selected === true)) {
      // إلغاء تحديد الكل
      setSelectedRows({});
    } else {
      // تحديد الكل
      const newSelectedRows = {};
      filteredProducts.forEach(product => {
        newSelectedRows[product.id] = true;
      });
      setSelectedRows(newSelectedRows);
    }
  };

  const toggleSelectRow = (id: string) => {
    setSelectedRows(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // إدارة الصفوف القابلة للتعديل
  const toggleEditRow = (id: string) => {
    setEditableRows(prev => {
      const newEditableRows = { ...prev };
      
      // إذا تم تحديد الصف للتعديل
      if (!newEditableRows[id]) {
        // حفظ السعر الحالي في مصفوفة tempPrices
        const product = products.find(p => p.id === id);
        if (product) {
          setTempPrices(prev => ({
            ...prev,
            [id]: product.price.toString(),
          }));
        }
      }
      
      newEditableRows[id] = !newEditableRows[id];
      return newEditableRows;
    });
  };

  const handlePriceChange = (id: string, value: string) => {
    setTempPrices(prev => ({
      ...prev,
      [id]: value,
    }));
  };

  const savePrice = (id: string) => {
    const price = parseFloat(tempPrices[id]);
    if (isNaN(price) || price < 0) {
      toast({
        variant: "destructive",
        title: "قيمة غير صالحة",
        description: "يرجى إدخال قيمة صالحة للسعر",
      });
      return;
    }
    
    updateProductPriceMutation.mutate({ id, price });
    toggleEditRow(id);
  };

  // حساب نسبة هامش الربح
  const calculateMargin = (product: any) => {
    if (!product.cost_price || product.cost_price <= 0) return null;
    const margin = ((product.price - product.cost_price) / product.price) * 100;
    return margin.toFixed(2);
  };
  
  return (
    <div className="bg-background">
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} />
      
      <PageContainer className={`${sidebarOpen ? 'lg:mr-64' : ''}`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              إدارة الأسعار
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              عرض وتعديل أسعار المنتجات
            </p>
          </div>
          
          <Dialog open={isBulkUpdateOpen} onOpenChange={setIsBulkUpdateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-pharma-600 hover:bg-pharma-700">
                <Tag className="h-4 w-4 mr-1" />
                تعديل الأسعار دفعة واحدة
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>تعديل الأسعار دفعة واحدة</DialogTitle>
                <DialogDescription>
                  يمكنك تعديل أسعار المنتجات المحددة أو جميع المنتجات المعروضة
                </DialogDescription>
              </DialogHeader>
              <Form {...bulkUpdateForm}>
                <form onSubmit={bulkUpdateForm.handleSubmit(onBulkUpdateSubmit)} className="space-y-4">
                  <FormField
                    control={bulkUpdateForm.control}
                    name="operation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>نوع العملية</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر نوع العملية" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="increase">زيادة الأسعار</SelectItem>
                            <SelectItem value="decrease">تخفيض الأسعار</SelectItem>
                            <SelectItem value="set">تعيين سعر محدد</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={bulkUpdateForm.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>القيمة</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" step="0.01" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={bulkUpdateForm.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>نوع القيمة</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            disabled={bulkUpdateForm.watch('operation') === 'set'}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="اختر نوع القيمة" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="fixed">مبلغ ثابت</SelectItem>
                              <SelectItem value="percentage">نسبة مئوية</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <FormField
                    control={bulkUpdateForm.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>التصنيف</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="اختر التصنيف" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="all">جميع التصنيفات</SelectItem>
                            {uniqueCategories.map((category, index) => (
                              <SelectItem key={index} value={category || ''}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded-md text-amber-800 dark:text-amber-400 text-sm">
                    <p className="font-semibold mb-1">ملاحظة:</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>
                        {Object.values(selectedRows).filter(Boolean).length > 0
                          ? `سيتم تعديل أسعار ${Object.values(selectedRows).filter(Boolean).length} منتج محدد فقط.`
                          : `سيتم تعديل أسعار جميع المنتجات المعروضة (${filteredProducts.length} منتج).`}
                      </li>
                      <li>تأكد من مراجعة التغييرات بعد تطبيقها.</li>
                    </ul>
                  </div>
                  
                  <DialogFooter>
                    <Button 
                      type="submit" 
                      className="bg-pharma-600 hover:bg-pharma-700"
                      disabled={bulkUpdatePricesMutation.isPending}
                    >
                      {bulkUpdatePricesMutation.isPending ? 'جاري التحديث...' : 'تطبيق التغييرات'}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 md:space-x-reverse mb-6">
          <div className="relative flex-1">
            <Search className="absolute top-2.5 right-3 h-5 w-5 text-gray-400" />
            <Input 
              placeholder="البحث عن منتج..." 
              className="glass-input pr-10" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-4 space-x-reverse">
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="glass-input w-40">
                <SelectValue placeholder="التصنيف" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع التصنيفات</SelectItem>
                {uniqueCategories.map((category, index) => (
                  <SelectItem key={index} value={category || ''}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">جدول الأسعار</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <p>جاري تحميل البيانات...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-8">
                <Tag className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium">لا توجد منتجات</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2">لم يتم العثور على أي منتجات تطابق معايير البحث</p>
              </div>
            ) : (
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12 text-center">
                        <input 
                          type="checkbox" 
                          checked={
                            filteredProducts.length > 0 &&
                            filteredProducts.every(product => selectedRows[product.id])
                          }
                          onChange={toggleSelectAll}
                          className="h-4 w-4 rounded border-gray-300 text-pharma-600 focus:ring-pharma-500"
                        />
                      </TableHead>
                      <TableHead>المنتج</TableHead>
                      <TableHead>التصنيف</TableHead>
                      <TableHead className="text-center">سعر التكلفة</TableHead>
                      <TableHead className="text-center">سعر البيع</TableHead>
                      <TableHead className="text-center">هامش الربح</TableHead>
                      <TableHead className="text-center">إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product, index) => (
                      <TableRow key={product.id} className="animate-slide-in-bottom" style={{ animationDelay: `${index * 0.05}s` }}>
                        <TableCell className="text-center">
                          <input 
                            type="checkbox" 
                            checked={selectedRows[product.id] || false}
                            onChange={() => toggleSelectRow(product.id)}
                            className="h-4 w-4 rounded border-gray-300 text-pharma-600 focus:ring-pharma-500"
                          />
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            {product.scientific_name && (
                              <div className="text-xs text-gray-500">{product.scientific_name}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{product.category || '-'}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex items-center justify-center">
                            <DollarSign className="h-4 w-4 text-gray-500 ml-1" />
                            <span>{product.cost_price?.toFixed(2) || '0.00'} ر.س</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {editableRows[product.id] ? (
                            <div className="flex items-center justify-center">
                              <Input 
                                type="number" 
                                min="0" 
                                step="0.01" 
                                value={tempPrices[product.id] || '0'}
                                onChange={(e) => handlePriceChange(product.id, e.target.value)}
                                className="h-8 max-w-24 text-center"
                              />
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 mr-1 text-green-500"
                                onClick={() => savePrice(product.id)}
                              >
                                <Save className="h-4 w-4" />
                              </Button>
                            </div>
                          ) : (
                            <div className="flex items-center justify-center">
                              <DollarSign className="h-4 w-4 text-gray-500 ml-1" />
                              <span className="font-medium">{product.price?.toFixed(2) || '0.00'} ر.س</span>
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {calculateMargin(product) ? (
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                              <Percent className="h-3 w-3 ml-1" />
                              {calculateMargin(product)}
                            </Badge>
                          ) : (
                            '-'
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8"
                              onClick={() => toggleEditRow(product.id)}
                            >
                              {editableRows[product.id] ? (
                                <Check className="h-4 w-4" />
                              ) : (
                                <ArrowUpDown className="h-4 w-4" />
                              )}
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
      </PageContainer>
    </div>
  );
};

export default Pricing;
