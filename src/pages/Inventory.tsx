
import React, { useState } from 'react';
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
import { Search, Plus, Filter } from 'lucide-react';

const products = [
  {
    id: '1',
    name: 'باراسيتامول 500mg',
    scientificName: 'Paracetamol',
    price: '15.00 ر.س',
    stock: 45,
    expiryDate: '2025-12-31',
    category: 'مسكنات',
  },
  {
    id: '2',
    name: 'أموكسيسيللين 250mg',
    scientificName: 'Amoxicillin',
    price: '35.50 ر.س',
    stock: 20,
    expiryDate: '2025-06-15',
    category: 'مضادات حيوية',
  },
  {
    id: '3',
    name: 'لوراتادين 10mg',
    scientificName: 'Loratadine',
    price: '25.75 ر.س',
    stock: 32,
    expiryDate: '2024-08-22',
    category: 'مضادات الهيستامين',
  },
  {
    id: '4',
    name: 'إبوبروفين 400mg',
    scientificName: 'Ibuprofen',
    price: '18.25 ر.س',
    stock: 28,
    expiryDate: '2025-03-10',
    category: 'مسكنات',
  },
  {
    id: '5',
    name: 'سيتريزين 5mg',
    scientificName: 'Cetirizine',
    price: '22.50 ر.س',
    stock: 15,
    expiryDate: '2024-11-05',
    category: 'مضادات الهيستامين',
  },
  {
    id: '6',
    name: 'أزيثرومايسين 250mg',
    scientificName: 'Azithromycin',
    price: '45.00 ر.س',
    stock: 8,
    expiryDate: '2024-07-18',
    category: 'مضادات حيوية',
  },
  {
    id: '7',
    name: 'سيتالوبرام 20mg',
    scientificName: 'Citalopram',
    price: '65.00 ر.س',
    stock: 12,
    expiryDate: '2025-09-20',
    category: 'مضادات الاكتئاب',
  },
  {
    id: '8',
    name: 'أوميبرازول 20mg',
    scientificName: 'Omeprazole',
    price: '28.75 ر.س',
    stock: 25,
    expiryDate: '2025-05-12',
    category: 'مثبطات مضخة البروتون',
  }
];

const Inventory = () => {
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
              إدارة المخزون
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              عرض وإدارة جميع المنتجات في المخزون
            </p>
          </div>
          
          <Button className="bg-pharma-600 hover:bg-pharma-700">
            <Plus className="h-4 w-4 mr-1" />
            إضافة منتج
          </Button>
        </div>
        
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 md:space-x-reverse mb-6">
          <div className="relative flex-1">
            <Search className="absolute top-2.5 right-3 h-5 w-5 text-gray-400" />
            <Input placeholder="البحث عن منتج..." className="glass-input pr-10" />
          </div>
          
          <div className="flex space-x-4 space-x-reverse">
            <Select>
              <SelectTrigger className="glass-input w-36">
                <SelectValue placeholder="التصنيف" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">الكل</SelectItem>
                <SelectItem value="painkillers">مسكنات</SelectItem>
                <SelectItem value="antibiotics">مضادات حيوية</SelectItem>
                <SelectItem value="antihistamine">مضادات الهيستامين</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>فلترة</span>
            </Button>
          </div>
        </div>
        
        <Tabs defaultValue="all" className="mb-6">
          <TabsList className="glass-card">
            <TabsTrigger value="all">الكل</TabsTrigger>
            <TabsTrigger value="low-stock">مخزون منخفض</TabsTrigger>
            <TabsTrigger value="expiring">قرب انتهاء الصلاحية</TabsTrigger>
            <TabsTrigger value="popular">الأكثر مبيعاً</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="p-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {products.map((product, index) => (
                <div 
                  key={product.id}
                  className="animate-slide-in-bottom"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="low-stock" className="p-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {products
                .filter(product => product.stock < 10)
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
          </TabsContent>
          
          <TabsContent value="expiring" className="p-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {products
                .filter(product => new Date(product.expiryDate) < new Date(Date.now() + 180 * 24 * 60 * 60 * 1000))
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
          </TabsContent>
          
          <TabsContent value="popular" className="p-1">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {products
                .slice(0, 4)
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
          </TabsContent>
        </Tabs>
      </PageContainer>
    </div>
  );
};

export default Inventory;
