
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PharmacyNavbar from '@/components/layout/PharmacyNavbar';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import RecentSales from '@/components/dashboard/RecentSales';
import StatCard from '@/components/dashboard/StatCard';
import StockAlert from '@/components/dashboard/StockAlert';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

interface DashboardStats {
  totalSales: number;
  totalProducts: number;
  lowStockItems: number;
  totalCustomers: number;
}

const PharmacyDashboard: React.FC = () => {
  const { pharmacy } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    totalProducts: 0,
    lowStockItems: 0,
    totalCustomers: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch total products
        const { count: productsCount } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true });
        
        // Fetch low stock items
        const { count: lowStockCount } = await supabase
          .from('products')
          .select('*', { count: 'exact', head: true })
          .lt('stock', 10);
        
        // Fetch total customers
        const { count: customersCount } = await supabase
          .from('customers')
          .select('*', { count: 'exact', head: true });
        
        // Fetch total sales amount
        const { data: salesData } = await supabase
          .from('sales')
          .select('total_amount');
        
        const totalSalesAmount = salesData?.reduce((sum, sale) => sum + Number(sale.total_amount), 0) || 0;
        
        setStats({
          totalProducts: productsCount || 0,
          lowStockItems: lowStockCount || 0,
          totalCustomers: customersCount || 0,
          totalSales: totalSalesAmount,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Get owner name from description
  const getOwnerName = () => {
    if (!pharmacy?.description) return pharmacy?.name;
    
    const match = pharmacy.description.match(/صيدلية يملكها: (.+)/);
    return match ? match[1] : pharmacy.name;
  };

  // Sample data for charts
  const salesData = [
    { name: 'يناير', sales: 4000 },
    { name: 'فبراير', sales: 3000 },
    { name: 'مارس', sales: 5000 },
    { name: 'أبريل', sales: 2780 },
    { name: 'مايو', sales: 1890 },
    { name: 'يونيو', sales: 2390 },
  ];

  return (
    <PharmacyNavbar>
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">مرحباً بك، {getOwnerName()}</h2>
          <div className="flex items-center space-x-2">
            {/* Additional actions can go here */}
          </div>
        </div>
        
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">نظرة عامة</TabsTrigger>
            <TabsTrigger value="analytics">التحليلات</TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard 
                title="إجمالي المبيعات"
                value={`${stats.totalSales.toLocaleString()} ر.س`}
                loading={isLoading}
              />
              <StatCard 
                title="المنتجات"
                value={stats.totalProducts.toString()}
                loading={isLoading}
              />
              <StatCard 
                title="العناصر منخفضة المخزون"
                value={stats.lowStockItems.toString()}
                loading={isLoading}
              />
              <StatCard 
                title="العملاء"
                value={stats.totalCustomers.toString()}
                loading={isLoading}
              />
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>المبيعات الشهرية</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <ResponsiveContainer width="100%" height={350}>
                    <BarChart data={salesData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="sales" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
              
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>أحدث المبيعات</CardTitle>
                </CardHeader>
                <CardContent>
                  <RecentSales />
                </CardContent>
              </Card>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-3">
                <CardHeader>
                  <CardTitle>تنبيهات المخزون</CardTitle>
                </CardHeader>
                <CardContent>
                  <StockAlert />
                </CardContent>
              </Card>
              
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>الأدوية الأكثر مبيعًا</CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Top selling medications chart or list could go here */}
                  <div className="h-[350px] flex items-center justify-center text-gray-500">
                    سيتم عرض الأدوية الأكثر مبيعًا هنا
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="analytics" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-7">
                <CardHeader>
                  <CardTitle>تحليلات متقدمة</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-[450px] flex items-center justify-center text-gray-500">
                    تحليلات متقدمة ستظهر هنا
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PharmacyNavbar>
  );
};

export default PharmacyDashboard;
