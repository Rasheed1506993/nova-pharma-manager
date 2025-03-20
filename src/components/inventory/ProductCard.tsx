
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pill, ShoppingCart, BarChart2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    scientificName: string;
    price: string;
    stock: number;
    expiryDate: string;
    category: string;
    image?: string;
  };
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const isLowStock = product.stock < 10;
  const isExpiringSoon = new Date(product.expiryDate) < new Date(Date.now() + 90 * 24 * 60 * 60 * 1000);
  
  return (
    <Card className="glass-card overflow-hidden group transition-all duration-300 hover:-translate-y-1">
      <div className="p-4 flex flex-col h-full">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center">
            <div className="h-10 w-10 bg-pharma-100 dark:bg-pharma-900/30 rounded-full flex items-center justify-center text-pharma-600 dark:text-pharma-400 mr-3">
              <Pill className="h-5 w-5" />
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-gray-100">{product.name}</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">{product.scientificName}</p>
            </div>
          </div>
          <Badge className={cn(
            "text-xs",
            product.category === "مسكنات" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" :
            product.category === "مضادات حيوية" ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400" :
            "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400"
          )}>
            {product.category}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between mb-2">
          <div className="flex flex-col">
            <span className="text-sm text-gray-500 dark:text-gray-400">السعر</span>
            <span className="font-semibold">{product.price}</span>
          </div>
          <div className="flex flex-col text-right">
            <span className="text-sm text-gray-500 dark:text-gray-400">المخزون</span>
            <span className={cn(
              "font-semibold",
              isLowStock ? "text-red-600 dark:text-red-400" : "text-gray-900 dark:text-gray-100"
            )}>
              {product.stock} وحدة
            </span>
          </div>
        </div>
        
        <div className="mt-auto">
          <div className="mb-3">
            <span className="text-sm text-gray-500 dark:text-gray-400 block mb-1">تاريخ انتهاء الصلاحية</span>
            <span className={cn(
              "text-sm font-medium",
              isExpiringSoon ? "text-amber-600 dark:text-amber-400" : "text-gray-700 dark:text-gray-300"
            )}>
              {product.expiryDate}
            </span>
          </div>
          
          <div className="flex space-x-2 space-x-reverse">
            <Button 
              variant="outline" 
              size="sm" 
              className="flex-1 group-hover:border-pharma-300 group-hover:text-pharma-700 dark:group-hover:border-pharma-700 dark:group-hover:text-pharma-300"
            >
              <BarChart2 className="h-4 w-4 mr-1" />
              <span>التفاصيل</span>
            </Button>
            <Button 
              variant="default" 
              size="sm" 
              className="flex-1 bg-pharma-600 hover:bg-pharma-700 text-white"
            >
              <ShoppingCart className="h-4 w-4 mr-1" />
              <span>بيع</span>
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;
