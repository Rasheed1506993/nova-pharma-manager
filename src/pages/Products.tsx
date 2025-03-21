import React, { useState, useEffect } from 'react';
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
import { Search, Plus, Package, Edit, Trash2, AlertTriangle, Tag, Scan, RotateCw } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Progress } from "@/components/ui/progress";
import { Badge } from '@/components/ui/badge';
import BarcodeGenerator from '@/components/inventory/BarcodeGenerator';
import { generateUniqueBarcode } from '@/lib/barcode';

const productSchema = z.object({
  name: z.string().min(2, { message: 'اسم المنتج مطلوب ويجب أن يكون أكثر من حرفين' }),
  scientific_name: z.string().optional(),
  barcode: z.string().optional(),
  category: z.string().optional(),
  manufacturer: z.string().optional(),
  price: z.coerce.number().min(0, { message: 'السعر يجب أن يكون رقماً موجباً' }),
  cost_price: z.coerce.number().min(0, { message: 'سعر التكلفة يجب أن يكون رقماً موجباً' }).optional(),
  stock: z.coerce.number().min(0, { message: 'المخزون يجب أن يكون رقماً موجباً' }),
  min_stock: z.coerce.number().min(0, { message: 'الحد الأدنى للمخزون يجب أن يكون رقماً موجباً' }).optional(),
  max_stock: z.coerce.number().min(0, { message: 'الحد الأقصى للمخزون يجب أن يكون رقماً موجباً' }).optional(),
  expiry_date: z.string().optional(),
});

type ProductFormValues = z.infer<typeof productSchema>;

const Products = () => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isBarcodeOpen, setIsBarcodeOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

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

  const { data: categories = [] } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');
      
      if (error) {
        console.error("Error fetching categories:", error);
        return [];
      }
      
      return data;
    }
  });

  const addForm = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      scientific_name: '',
      barcode: generateUniqueBarcode(),
      category: '',
      manufacturer: '',
      price: 0,
      cost_price: 0,
      stock: 0,
      min_stock: 5,
      max_stock: 20,
      expiry_date: '',
    },
  });

  // توليد باركود جديد عند فتح نموذج الإضافة
  useEffect(() => {
    if (isAddOpen) {
      addForm.setValue('barcode', generateUniqueBarcode());
    }
  }, [isAddOpen, addForm]);

  const editForm = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      scientific_name: '',
      barcode: '',
      category: '',
      manufacturer: '',
      price: 0,
      cost_price: 0,
      stock: 0,
      min_stock: 5,
      max_stock: 20,
      expiry_date: '',
    },
  });

  const addProductMutation = useMutation({
    mutationFn: async (values: ProductFormValues) => {
      const { data, error } = await supabase
        .from('products')
        .insert([{
          name: values.name,
          price: values.price,
          scientific_name: values.scientific_name || null,
          barcode: values.barcode || null,
          category: values.category || null,
          manufacturer: values.manufacturer || null,
          cost_price: values.cost_price || null,
          stock: values.stock ?? 0,
          min_stock: values.min_stock || null,
          max_stock: values.max_stock || null,
          expiry_date: values.expiry_date || null
        }])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setIsAddOpen(false);
      addForm.reset();
      toast({
        title: "تمت الإضافة بنجاح",
        description: "تم إضافة المنتج الجديد بنجاح",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "خطأ في إضافة المنتج",
        description: error.message,
      });
    }
  });

  const updateProductMutation = useMutation({
    mutationFn: async (values: ProductFormValues & { id: string }) => {
      const { id, ...productData } = values;
      const { data, error } = await supabase
        .from('products')
        .update(productData)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setIsEditOpen(false);
      setSelectedProduct(null);
      toast({
        title: "تم التحديث بنجاح",
        description: "تم تحديث بيانات المنتج بنجاح",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "خطأ في تحديث بيانات المنتج",
        description: error.message,
      });
    }
  });

  const deleteProductMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
      setIsDeleteOpen(false);
      setSelectedProduct(null);
      toast({
        title: "تم الحذف بنجاح",
        description: "تم حذف المنتج بنجاح",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "خطأ في حذف المنتج",
        description: error.message,
      });
    }
  });

  const onAddSubmit = (values: ProductFormValues) => {
    // إذا لم يكن هناك باركود، قم بتوليد واحد
    if (!values.barcode) {
      values.barcode = generateUniqueBarcode();
    }
    addProductMutation.mutate(values);
  };

  const onEditSubmit = (values: ProductFormValues) => {
    if (selectedProduct) {
      // إذا لم يكن هناك باركود، قم بتوليد واحد
      if (!values.barcode) {
        values.barcode = generateUniqueBarcode();
      }
      updateProductMutation.mutate({
        id: selectedProduct.id,
        ...values,
      });
    }
  };

  const openEditDialog = (product: any) => {
    setSelectedProduct(product);
    editForm.reset({
      name: product.name,
      scientific_name: product.scientific_name || '',
      barcode: product.barcode || '',
      category: product.category || '',
      manufacturer: product.manufacturer || '',
      price: product.price || 0,
      cost_price: product.cost_price || 0,
      stock: product.stock || 0,
      min_stock: product.min_stock || 5,
      max_stock: product.max_stock || 20,
      expiry_date: product.expiry_date ? product.expiry_date : '',
    });
    setIsEditOpen(true);
  };

  const openDeleteDialog = (product: any) => {
    setSelectedProduct(product);
    setIsDeleteOpen(true);
  };

  const openBarcodeDialog = (product: any) => {
    setSelectedProduct(product);
    setIsBarcodeOpen(true);
  };

  const regenerateBarcode = () => {
    const newBarcode = generateUniqueBarcode();
    addForm.setValue('barcode', newBarcode);
  };

  const regenerateEditBarcode = () => {
    const newBarcode = generateUniqueBarcode();
    editForm.setValue('barcode', newBarcode);
  };

  const confirmDelete = () => {
    if (selectedProduct) {
      deleteProductMutation.mutate(selectedProduct.id);
    }
  };

  const uniqueCategories = [...new Set(products.map(product => product.category).filter(Boolean))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.scientific_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.barcode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.manufacturer?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  const getStockStatus = (product: any) => {
    if (product.stock <= 0) {
      return { label: 'نفذ', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' };
    } else if (product.stock < product.min_stock) {
      return { label: 'منخفض', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' };
    } else if (product.stock > product.max_stock) {
      return { label: 'فائض', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' };
    } else {
      return { label: 'متوفر', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' };
    }
  };

  const calculateStockPercentage = (product: any) => {
    if (!product.max_stock) return 0;
    const percentage = (product.stock / product.max_stock) * 100;
    return Math.min(percentage, 100);
  };

  const getStockIndicatorColor = (product: any) => {
    if (product.stock <= 0) {
      return "bg-red-500";
    } else if (product.stock < product.min_stock) {
      return "bg-yellow-500";
    } else if (product.stock > product.max_stock) {
      return "bg-blue-500";
    } else {
      return "bg-green-500";
    }
  };

  const isExpired = (expiryDate: string) => {
    if (!expiryDate) return false;
    const today = new Date();
    const expiry = new Date(expiryDate);
    return expiry < today;
  };

  const isNearExpiry = (expiryDate: string) => {
    if (!expiryDate) return false;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const threeMonths = 3 * 30 * 24 * 60 * 60 * 1000; // تقريبا 3 أشهر بالمللي ثانية
    return expiry > today && expiry.getTime() - today.getTime() < threeMonths;
  };

  return (
    <div className="bg-background">
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} />
      
      <PageContainer className={`${sidebarOpen ? 'lg:mr-64' : ''}`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              إدارة المنتجات
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              عرض وإدارة بيانات المنتجات
            </p>
          </div>
          
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="bg-pharma-600 hover:bg-pharma-700">
                <Plus className="h-4 w-4 mr-1" />
                إضافة منتج
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px]">
              <DialogHeader>
                <DialogTitle>إضافة منتج جديد</DialogTitle>
                <DialogDescription>
                  أدخل بيانات المنتج الجديد في النموذج أدناه
                </DialogDescription>
              </DialogHeader>
              <Form {...addForm}>
                <form onSubmit={addForm.handleSubmit(onAddSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={addForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>اسم المنتج</FormLabel>
                          <FormControl>
                            <Input placeholder="أدخل اسم المنتج" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={addForm.control}
                      name="scientific_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>الاسم العلمي</FormLabel>
                          <FormControl>
                            <Input placeholder="أدخل الاسم العلمي" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={addForm.control}
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
                              {categories.map((category) => (
                                <SelectItem key={category.id} value={category.name}>
                                  {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={addForm.control}
                      name="manufacturer"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>الشركة المصنعة</FormLabel>
                          <FormControl>
                            <Input placeholder="أدخل اسم الشركة المصنعة" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={addForm.control}
                      name="barcode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex justify-between items-center">
                            <span>الباركود</span>
                            <Button 
                              type="button"
                              variant="outline" 
                              size="sm" 
                              className="h-6 px-2 text-xs flex items-center gap-1"
                              onClick={regenerateBarcode}
                              title="توليد باركود جديد"
                            >
                              <RotateCw className="h-3 w-3" />
                              <span>توليد جديد</span>
                            </Button>
                          </FormLabel>
                          <FormControl>
                            <div className="flex gap-2">
                              <Input placeholder="رقم الباركود" {...field} />
                              <Button 
                                type="button"
                                variant="ghost" 
                                size="icon" 
                                className="h-9 w-9 flex-shrink-0"
                                title="مسح رمز الباركود"
                              >
                                <Scan className="h-4 w-4" />
                              </Button>
                            </div>
                          </FormControl>
                          <div className="mt-2">
                            <BarcodeGenerator value={field.value || ''} height={60} width={1.5} />
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={addForm.control}
                      name="expiry_date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>تاريخ انتهاء الصلاحية</FormLabel>
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <FormField
                      control={addForm.control}
                      name="price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>سعر البيع</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" step="0.01" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={addForm.control}
                      name="cost_price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>سعر التكلفة</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" step="0.01" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={addForm.control}
                      name="stock"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>المخزون</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={addForm.control}
                      name="min_stock"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>الحد الأدنى للمخزون</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={addForm.control}
                      name="max_stock"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>الحد الأقصى للمخزون</FormLabel>
                          <FormControl>
                            <Input type="number" min="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <DialogFooter>
                    <Button 
                      type="submit" 
                      className="bg-pharma-600 hover:bg-pharma-700"
                      disabled={addProductMutation.isPending}
                    >
                      {addProductMutation.isPending ? 'جاري الإضافة...' : 'إضافة المنتج'}
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
            <CardTitle className="text-xl">قائمة المنتجات</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <p>جاري تحميل البيانات...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="text-center py-8">
                <Package className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium">لا توجد منتجات</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2">لم يتم العثور على أي منتجات تطابق معايير البحث</p>
              </div>
            ) : (
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>اسم المنتج</TableHead>
                      <TableHead>التصنيف</TableHead>
                      <TableHead>سعر البيع</TableHead>
                      <TableHead>المخزون</TableHead>
                      <TableHead>تاريخ الصلاحية</TableHead>
                      <TableHead className="text-center">إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredProducts.map((product, index) => (
                      <TableRow key={product.id} className="animate-slide-in-bottom" style={{ animationDelay: `${index * 0.05}s` }}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{product.name}</div>
                            {product.scientific_name && (
                              <div className="text-xs text-gray-500">{product.scientific_name}</div>
                            )}
                            {product.manufacturer && (
                              <div className="text-xs text-gray-500">{product.manufacturer}</div>
                            )}
                            {product.barcode && (
                              <div className="text-xs flex items-center gap-1 text-gray-500">
                                <Scan className="h-3 w-3" />
                                <span 
                                  className="cursor-pointer hover:underline" 
                                  onClick={() => openBarcodeDialog(product)}
                                >
                                  {product.barcode}
                                </span>
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{product.category || '-'}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <Tag className="h-4 w-4 mr-1 text-gray-500" />
                            <span>{product.price?.toFixed(2) || '0.00'} ر.س</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-1">
                            <div className="flex items-center justify-between">
                              <Badge className={getStockStatus(product).color}>
                                {getStockStatus(product).label}
                              </Badge>
                              <span className="text-sm">{product.stock}/{product.max_stock}</span>
                            </div>
                            <Progress 
                              value={calculateStockPercentage(product)} 
                              className="h-2" 
                              indicatorClassName={getStockIndicatorColor(product)}
                            />
                          </div>
                        </TableCell>
                        <TableCell>
                          {product.expiry_date ? (
                            <div className="flex items-center">
                              {isExpired(product.expiry_date) ? (
                                <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 flex items-center gap-1">
                                  <AlertTriangle className="h-3 w-3" />
                                  منتهي
                                </Badge>
                              ) : isNearExpiry(product.expiry_date) ? (
                                <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 flex items-center gap-1">
                                  <AlertTriangle className="h-3 w-3" />
                                  قريب الانتهاء
                                </Badge>
                              ) : (
                                <span>{new Date(product.expiry_date).toLocaleDateString('ar-SA')}</span>
                              )}
                            </div>
                          ) : (
                            '-'
                          )}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center space-x-2 space-x-reverse">
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8" 
                              onClick={() => openBarcodeDialog(product)}
                              title="عرض الباركود"
                            >
                              <Scan className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(product)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => openDeleteDialog(product)}>
                              <Trash2 className="h-4 w-4" />
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
        
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>تعديل بيانات المنتج</DialogTitle>
              <DialogDescription>
                تعديل بيانات المنتج في النموذج أدناه
              </DialogDescription>
            </DialogHeader>
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={editForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>اسم المنتج</FormLabel>
                        <FormControl>
                          <Input placeholder="أدخل اسم المنتج" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editForm.control}
                    name="scientific_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الاسم العلمي</FormLabel>
                        <FormControl>
                          <Input placeholder="أدخل الاسم العلمي" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={editForm.control}
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
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.name}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editForm.control}
                    name="manufacturer"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>الشركة المصنعة</FormLabel>
                        <FormControl>
                          <Input placeholder="أدخل اسم الشركة المصنعة" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={editForm.control}
                    name="barcode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex justify-between items-center">
                          <span>الباركود</span>
                          <Button 
                            type="button"
                            variant="outline" 
                            size="sm" 
                            className="h-6 px-2 text-xs flex items-center gap-1"
                            onClick={regenerateEditBarcode}
                            title="توليد باركود جديد"
                          >
                            <RotateCw className="h-3 w-3" />
                            <span>توليد جديد</span>
                          </Button>
                        </FormLabel>
                        <FormControl>
                          <div className="flex gap-2">
                            <Input placeholder="رقم الباركود" {...field} />
                            <Button 
                              type="button"
                              variant="ghost" 
                              size="icon" 
                              className="h-9 w-9 flex-shrink-0"
                              title="مسح رمز الباركود"
                            >
                              <Scan className="h-4 w-4" />
                            </Button>
                          </div>
                        </FormControl>
                        <div className="mt-2">
                          <BarcodeGenerator value={field.value || ''} height={60} width={1.5} />
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={editForm.control}
                    name="expiry_date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>تاريخ انتهاء الصلاحية</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={editForm.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>سعر البيع</FormLabel>
                        <FormControl>
