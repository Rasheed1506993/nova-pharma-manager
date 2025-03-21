
import React, { useState, useEffect } from 'react';
import PageContainer from '@/components/layout/PageContainer';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import ProductCard from '@/components/inventory/ProductCard';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from "@/components/ui/progress";
import { Search, Plus, Filter, Layout, TableIcon, Barcode } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import BarcodeGenerator from '@/components/inventory/BarcodeGenerator';

const Inventory = () => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  
  const { toast } = useToast();
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // جلب المنتجات من قاعدة البيانات
  const { data: products = [], isLoading } = useQuery({
    queryKey: ['inventory-products'],
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

  // جلب التصنيفات من قاعدة البيانات
  const { data: categories = [] } = useQuery({
    queryKey: ['inventory-categories'],
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

  // استخراج التصنيفات الفريدة من المنتجات
  const uniqueCategories = [...new Set(products.map(product => product.category).filter(Boolean))];

  // تصفية المنتجات حسب البحث والتصنيف
  const filteredProducts = products.filter(product => {
    const matchesSearch = 
      product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.scientific_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.barcode?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.manufacturer?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    
    return matchesSearch && matchesCategory;
  });

  // الحصول على حالة المخزون
  const getStockStatus = (product: any) => {
    if (product.stock <= 0) {
      return { label: 'نفذ', color: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400' };
    } else if (product.min_stock && product.stock < product.min_stock) {
      return { label: 'منخفض', color: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400' };
    } else if (product.max_stock && product.stock > product.max_stock) {
      return { label: 'فائض', color: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400' };
    } else {
      return { label: 'متوفر', color: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' };
    }
  };

  // حساب نسبة المخزون
  const calculateStockPercentage = (product: any) => {
    if (!product.max_stock) return 0;
    const percentage = (product.stock / product.max_stock) * 100;
    return Math.min(percentage, 100);
  };

  // لون مؤشر المخزون
  const getStockIndicatorColor = (product: any) => {
    if (product.stock <= 0) {
      return "bg-red-500";
    } else if (product.min_stock && product.stock < product.min_stock) {
      return "bg-yellow-500";
    } else if (product.max_stock && product.stock > product.max_stock) {
      return "bg-blue-500";
    } else {
      return "bg-green-500";
    }
  };

  // التحقق من انتهاء الصلاحية
  const isExpired = (expiryDate: string) => {
    if (!expiryDate) return false;
    const today = new Date();
    const expiry = new Date(expiryDate);
    return expiry < today;
  };

  // التحقق من قرب انتهاء الصلاحية
  const isNearExpiry = (expiryDate: string) => {
    if (!expiryDate) return false;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const threeMonths = 3 * 30 * 24 * 60 * 60 * 1000; // تقريبا 3 أشهر بالمللي ثانية
    return expiry > today && expiry.getTime() - today.getTime() < threeMonths;
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('ar-SA');
  };
  
  return (
    <div className="bg-background">
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} />
      
      <PageContainer className={`${sidebarOpen ? 'lg:mr-64' : ''}`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              إدارة المخزون
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              عرض وإدارة جميع المنتجات في المخزون
            </p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="icon" 
              className={`h-10 w-10 ${viewMode === 'grid' ? 'bg-muted' : ''}`}
              onClick={() => setViewMode('grid')}
              title="عرض شبكي"
            >
              <Layout className="h-5 w-5" />
            </Button>
            <Button 
              variant="outline" 
              size="icon" 
              className={`h-10 w-10 ${viewMode === 'table' ? 'bg-muted' : ''}`}
              onClick={() => setViewMode('table')}
              title="عرض جدولي"
            >
              <TableIcon className="h-5 w-5" />
            </Button>
            <Button 
              className="bg-pharma-600 hover:bg-pharma-700 mr-2"
              onClick={() => window.location.href = '/products'}
            >
              <Plus className="h-4 w-4 mr-1" />
              إضافة منتج
            </Button>
          </div>
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
                <SelectItem value="all">الكل</SelectItem>
                {uniqueCategories.map((category, index) => (
                  <SelectItem key={index} value={category || ''}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Tabs defaultValue="all" className="mb-6">
          <TabsList className="glass-card">
            <TabsTrigger value="all">الكل</TabsTrigger>
            <TabsTrigger value="low-stock">مخزون منخفض</TabsTrigger>
            <TabsTrigger value="expiring">قرب انتهاء الصلاحية</TabsTrigger>
            <TabsTrigger value="barcode">عرض الباركود</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="p-1">
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <p>جاري تحميل البيانات...</p>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredProducts.map((product, index) => (
                  <div 
                    key={product.id}
                    className="animate-slide-in-bottom"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    <ProductCard product={product} />
                  </div>
                ))}
              </div>
            ) : (
              <Card className="glass-card">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>اسم المنتج</TableHead>
                        <TableHead>التصنيف</TableHead>
                        <TableHead>السعر</TableHead>
                        <TableHead>المخزون</TableHead>
                        <TableHead>تاريخ الصلاحية</TableHead>
                        <TableHead>الباركود</TableHead>
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
                            </div>
                          </TableCell>
                          <TableCell>{product.category || '-'}</TableCell>
                          <TableCell>{(product.price || 0).toFixed(2)} ر.س</TableCell>
                          <TableCell>
                            <div className="space-y-1">
                              <div className="flex items-center justify-between">
                                <Badge className={getStockStatus(product).color}>
                                  {getStockStatus(product).label}
                                </Badge>
                                <span className="text-sm">{product.stock}/{product.max_stock || '∞'}</span>
                              </div>
                              <Progress 
                                value={calculateStockPercentage(product)} 
                                className="h-1.5" 
                                indicatorClassName={getStockIndicatorColor(product)}
                              />
                            </div>
                          </TableCell>
                          <TableCell>
                            {product.expiry_date ? (
                              <div className="flex items-center">
                                {isExpired(product.expiry_date) ? (
                                  <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 flex items-center gap-1">
                                    منتهي
                                  </Badge>
                                ) : isNearExpiry(product.expiry_date) ? (
                                  <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 flex items-center gap-1">
                                    قريب الانتهاء
                                  </Badge>
                                ) : (
                                  <span>{formatDate(product.expiry_date)}</span>
                                )}
                              </div>
                            ) : (
                              '-'
                            )}
                          </TableCell>
                          <TableCell>
                            {product.barcode ? (
                              <div className="flex items-center gap-1">
                                <Barcode className="h-4 w-4 text-gray-500" />
                                <span className="text-sm">{product.barcode}</span>
                              </div>
                            ) : (
                              '-'
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="low-stock" className="p-1">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredProducts
                  .filter(product => product.min_stock && product.stock < product.min_stock)
                  .map((product, index) => (
                    <div 
                      key={product.id}
                      className="animate-slide-in-bottom"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
              </div>
            ) : (
              <Card className="glass-card">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>اسم المنتج</TableHead>
                        <TableHead>التصنيف</TableHead>
                        <TableHead>السعر</TableHead>
                        <TableHead>المخزون</TableHead>
                        <TableHead>تاريخ الصلاحية</TableHead>
                        <TableHead>الباركود</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts
                        .filter(product => product.min_stock && product.stock < product.min_stock)
                        .map((product, index) => (
                          <TableRow key={product.id} className="animate-slide-in-bottom" style={{ animationDelay: `${index * 0.05}s` }}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{product.name}</div>
                                {product.scientific_name && (
                                  <div className="text-xs text-gray-500">{product.scientific_name}</div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{product.category || '-'}</TableCell>
                            <TableCell>{(product.price || 0).toFixed(2)} ر.س</TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                  <Badge className={getStockStatus(product).color}>
                                    {getStockStatus(product).label}
                                  </Badge>
                                  <span className="text-sm">{product.stock}/{product.max_stock || '∞'}</span>
                                </div>
                                <Progress 
                                  value={calculateStockPercentage(product)} 
                                  className="h-1.5" 
                                  indicatorClassName={getStockIndicatorColor(product)}
                                />
                              </div>
                            </TableCell>
                            <TableCell>
                              {product.expiry_date ? formatDate(product.expiry_date) : '-'}
                            </TableCell>
                            <TableCell>
                              {product.barcode ? (
                                <div className="flex items-center gap-1">
                                  <Barcode className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm">{product.barcode}</span>
                                </div>
                              ) : (
                                '-'
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="expiring" className="p-1">
            {viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredProducts
                  .filter(product => product.expiry_date && (isExpired(product.expiry_date) || isNearExpiry(product.expiry_date)))
                  .map((product, index) => (
                    <div 
                      key={product.id}
                      className="animate-slide-in-bottom"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <ProductCard product={product} />
                    </div>
                  ))}
              </div>
            ) : (
              <Card className="glass-card">
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>اسم المنتج</TableHead>
                        <TableHead>التصنيف</TableHead>
                        <TableHead>السعر</TableHead>
                        <TableHead>المخزون</TableHead>
                        <TableHead>تاريخ الصلاحية</TableHead>
                        <TableHead>الباركود</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredProducts
                        .filter(product => product.expiry_date && (isExpired(product.expiry_date) || isNearExpiry(product.expiry_date)))
                        .map((product, index) => (
                          <TableRow key={product.id} className="animate-slide-in-bottom" style={{ animationDelay: `${index * 0.05}s` }}>
                            <TableCell>
                              <div>
                                <div className="font-medium">{product.name}</div>
                                {product.scientific_name && (
                                  <div className="text-xs text-gray-500">{product.scientific_name}</div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>{product.category || '-'}</TableCell>
                            <TableCell>{(product.price || 0).toFixed(2)} ر.س</TableCell>
                            <TableCell>
                              <div className="space-y-1">
                                <div className="flex items-center justify-between">
                                  <Badge className={getStockStatus(product).color}>
                                    {getStockStatus(product).label}
                                  </Badge>
                                  <span className="text-sm">{product.stock}/{product.max_stock || '∞'}</span>
                                </div>
                                <Progress 
                                  value={calculateStockPercentage(product)} 
                                  className="h-1.5" 
                                  indicatorClassName={getStockIndicatorColor(product)}
                                />
                              </div>
                            </TableCell>
                            <TableCell>
                              {product.expiry_date ? (
                                <div className="flex items-center">
                                  {isExpired(product.expiry_date) ? (
                                    <Badge className="bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 flex items-center gap-1">
                                      منتهي
                                    </Badge>
                                  ) : isNearExpiry(product.expiry_date) ? (
                                    <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 flex items-center gap-1">
                                      قريب الانتهاء
                                    </Badge>
                                  ) : (
                                    <span>{formatDate(product.expiry_date)}</span>
                                  )}
                                </div>
                              ) : (
                                '-'
                              )}
                            </TableCell>
                            <TableCell>
                              {product.barcode ? (
                                <div className="flex items-center gap-1">
                                  <Barcode className="h-4 w-4 text-gray-500" />
                                  <span className="text-sm">{product.barcode}</span>
                                </div>
                              ) : (
                                '-'
                              )}
                            </TableCell>
                          </TableRow>
                        ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            )}
          </TabsContent>
          
          <TabsContent value="barcode" className="p-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filteredProducts
                .filter(product => product.barcode)
                .map((product, index) => (
                  <Card key={product.id} className="glass-card animate-slide-in-bottom" style={{ animationDelay: `${index * 0.05}s` }}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-sm">{product.name}</CardTitle>
                      <p className="text-xs text-gray-500">{product.scientific_name || product.category || ''}</p>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-col items-center">
                        <BarcodeGenerator value={product.barcode || ''} height={80} width={1.5} />
                        <span className="text-xs mt-1">{product.barcode}</span>
                        
                        <div className="flex items-center justify-between w-full mt-3 pt-3 border-t">
                          <div className="text-sm">
                            <Badge className={getStockStatus(product).color}>
                              {getStockStatus(product).label}
                            </Badge>
                          </div>
                          <div className="text-sm">{(product.price || 0).toFixed(2)} ر.س</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        </Tabs>
      </PageContainer>
    </div>
  );
};

export default Inventory;
