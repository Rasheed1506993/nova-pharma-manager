
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Trash2, Plus, Receipt, FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface InvoiceItem {
  id: string;
  product: string;
  quantity: number;
  price: number;
  total: number;
}

const InvoiceForm: React.FC = () => {
  const { toast } = useToast();
  const [items, setItems] = useState<InvoiceItem[]>([
    { id: '1', product: 'باراسيتامول 500mg', quantity: 2, price: 15, total: 30 },
  ]);
  
  const addItem = () => {
    const newId = (items.length + 1).toString();
    setItems([...items, { id: newId, product: '', quantity: 1, price: 0, total: 0 }]);
  };
  
  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };
  
  const calculateTotal = () => {
    return items.reduce((sum, item) => sum + item.total, 0);
  };
  
  const handleSaveInvoice = () => {
    toast({
      title: "تم حفظ الفاتورة",
      description: `تم حفظ الفاتورة بنجاح بإجمالي ${calculateTotal()} ر.س`,
    });
  };
  
  return (
    <Card className="glass-card w-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl">إنشاء فاتورة جديدة</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <Label htmlFor="customer">العميل</Label>
            <Select>
              <SelectTrigger id="customer" className="glass-input">
                <SelectValue placeholder="اختر العميل" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1">محمد أحمد</SelectItem>
                <SelectItem value="2">سارة خالد</SelectItem>
                <SelectItem value="3">عميل جديد</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label htmlFor="date">التاريخ</Label>
            <Input id="date" type="date" defaultValue={new Date().toISOString().split('T')[0]} className="glass-input" />
          </div>
          
          <div>
            <Label htmlFor="payment">طريقة الدفع</Label>
            <Select>
              <SelectTrigger id="payment" className="glass-input">
                <SelectValue placeholder="اختر طريقة الدفع" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">نقدي</SelectItem>
                <SelectItem value="card">بطاقة ائتمان</SelectItem>
                <SelectItem value="insurance">تأمين</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="mb-4">
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[40%]">المنتج</TableHead>
                  <TableHead className="text-center">الكمية</TableHead>
                  <TableHead className="text-center">السعر</TableHead>
                  <TableHead className="text-center">الإجمالي</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.id} className="animate-slide-in-bottom" style={{ animationDelay: `${parseInt(item.id) * 0.05}s` }}>
                    <TableCell>
                      <Select>
                        <SelectTrigger className="glass-input border-0">
                          <SelectValue placeholder="اختر المنتج" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="paracetamol">باراسيتامول 500mg</SelectItem>
                          <SelectItem value="amoxicillin">أموكسيسيللين 250mg</SelectItem>
                          <SelectItem value="loratadine">لوراتادين 10mg</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell className="text-center">
                      <Input 
                        type="number" 
                        value={item.quantity} 
                        min={1}
                        className="glass-input text-center border-0 w-20 mx-auto" 
                      />
                    </TableCell>
                    <TableCell className="text-center">
                      <Input 
                        type="number" 
                        value={item.price} 
                        min={0}
                        className="glass-input text-center border-0 w-24 mx-auto" 
                      />
                    </TableCell>
                    <TableCell className="text-center font-medium">
                      {item.total} ر.س
                    </TableCell>
                    <TableCell>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => removeItem(item.id)}
                        className="h-8 w-8 text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <Button variant="outline" size="sm" className="mt-4" onClick={addItem}>
            <Plus className="h-4 w-4 mr-1" />
            إضافة منتج
          </Button>
        </div>
        
        <div className="flex flex-col space-y-2 md:flex-row md:justify-between md:space-y-0 md:space-x-2 md:space-x-reverse items-center border-t pt-4">
          <div className="text-right">
            <div className="flex items-center justify-between space-x-4 space-x-reverse">
              <span className="text-sm text-gray-500 dark:text-gray-400">الإجمالي:</span>
              <span className="font-bold text-lg">{calculateTotal()} ر.س</span>
            </div>
          </div>
          
          <div className="flex space-x-2 space-x-reverse">
            <Button variant="outline" className="w-full md:w-auto">
              <FileText className="h-4 w-4 mr-2" />
              حفظ كمسودة
            </Button>
            <Button 
              className="bg-pharma-600 hover:bg-pharma-700 text-white w-full md:w-auto"
              onClick={handleSaveInvoice}
            >
              <Receipt className="h-4 w-4 mr-2" />
              إصدار الفاتورة
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoiceForm;
