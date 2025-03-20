
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
import { Search, Plus, User, UserPlus, Edit, Trash2, Phone, Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

// تعريف مخطط البيانات للعميل
const customerSchema = z.object({
  name: z.string().min(2, { message: 'اسم العميل مطلوب ويجب أن يكون أكثر من حرفين' }),
  phone: z.string().optional(),
  email: z.string().email({ message: 'البريد الإلكتروني غير صحيح' }).optional().or(z.literal('')),
  address: z.string().optional(),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

const Customers = () => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  // استعلام لجلب العملاء
  const { data: customers = [], isLoading } = useQuery({
    queryKey: ['customers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('customers')
        .select('*')
        .order('name');
      
      if (error) {
        toast({
          variant: "destructive",
          title: "خطأ في جلب بيانات العملاء",
          description: error.message,
        });
        return [];
      }
      
      return data;
    }
  });

  // نموذج إضافة عميل جديد
  const addForm = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      address: '',
    },
  });

  // نموذج تعديل بيانات العميل
  const editForm = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: {
      name: '',
      phone: '',
      email: '',
      address: '',
    },
  });

  // إضافة عميل جديد
  const addCustomerMutation = useMutation({
    mutationFn: async (values: CustomerFormValues) => {
      const { data, error } = await supabase
        .from('customers')
        .insert([values])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      setIsAddOpen(false);
      addForm.reset();
      toast({
        title: "تمت الإضافة بنجاح",
        description: "تم إضافة العميل الجديد بنجاح",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "خطأ في إضافة العميل",
        description: error.message,
      });
    }
  });

  // تعديل بيانات العميل
  const updateCustomerMutation = useMutation({
    mutationFn: async (values: CustomerFormValues & { id: string }) => {
      const { id, ...customerData } = values;
      const { data, error } = await supabase
        .from('customers')
        .update(customerData)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      setIsEditOpen(false);
      setSelectedCustomer(null);
      toast({
        title: "تم التحديث بنجاح",
        description: "تم تحديث بيانات العميل بنجاح",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "خطأ في تحديث بيانات العميل",
        description: error.message,
      });
    }
  });

  // حذف العميل
  const deleteCustomerMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('customers')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customers'] });
      setIsDeleteOpen(false);
      setSelectedCustomer(null);
      toast({
        title: "تم الحذف بنجاح",
        description: "تم حذف العميل بنجاح",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "خطأ في حذف العميل",
        description: error.message,
      });
    }
  });

  const onAddSubmit = (values: CustomerFormValues) => {
    addCustomerMutation.mutate(values);
  };

  const onEditSubmit = (values: CustomerFormValues) => {
    if (selectedCustomer) {
      updateCustomerMutation.mutate({
        id: selectedCustomer.id,
        ...values,
      });
    }
  };

  const openEditDialog = (customer: any) => {
    setSelectedCustomer(customer);
    editForm.reset({
      name: customer.name,
      phone: customer.phone || '',
      email: customer.email || '',
      address: customer.address || '',
    });
    setIsEditOpen(true);
  };

  const openDeleteDialog = (customer: any) => {
    setSelectedCustomer(customer);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (selectedCustomer) {
      deleteCustomerMutation.mutate(selectedCustomer.id);
    }
  };

  const filteredCustomers = customers.filter(customer => 
    customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="bg-background">
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} />
      
      <PageContainer className={`${sidebarOpen ? 'lg:mr-64' : ''}`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              إدارة العملاء
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              عرض وإدارة بيانات العملاء
            </p>
          </div>
          
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="bg-pharma-600 hover:bg-pharma-700">
                <UserPlus className="h-4 w-4 mr-1" />
                إضافة عميل
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>إضافة عميل جديد</DialogTitle>
                <DialogDescription>
                  أدخل بيانات العميل الجديد في النموذج أدناه
                </DialogDescription>
              </DialogHeader>
              <Form {...addForm}>
                <form onSubmit={addForm.handleSubmit(onAddSubmit)} className="space-y-4">
                  <FormField
                    control={addForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>اسم العميل</FormLabel>
                        <FormControl>
                          <Input placeholder="أدخل اسم العميل" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>رقم الهاتف</FormLabel>
                        <FormControl>
                          <Input placeholder="أدخل رقم الهاتف" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>البريد الإلكتروني</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="أدخل البريد الإلكتروني" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>العنوان</FormLabel>
                        <FormControl>
                          <Input placeholder="أدخل العنوان" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button 
                      type="submit" 
                      className="bg-pharma-600 hover:bg-pharma-700"
                      disabled={addCustomerMutation.isPending}
                    >
                      {addCustomerMutation.isPending ? 'جاري الإضافة...' : 'إضافة العميل'}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute top-2.5 right-3 h-5 w-5 text-gray-400" />
            <Input 
              placeholder="البحث عن عميل..." 
              className="glass-input pr-10" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">قائمة العملاء</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <p>جاري تحميل البيانات...</p>
              </div>
            ) : filteredCustomers.length === 0 ? (
              <div className="text-center py-8">
                <User className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium">لا يوجد عملاء</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2">لم يتم العثور على أي عملاء في النظام</p>
              </div>
            ) : (
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>اسم العميل</TableHead>
                      <TableHead>رقم الهاتف</TableHead>
                      <TableHead>البريد الإلكتروني</TableHead>
                      <TableHead>العنوان</TableHead>
                      <TableHead>نقاط الولاء</TableHead>
                      <TableHead className="text-center">إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCustomers.map((customer, index) => (
                      <TableRow key={customer.id} className="animate-slide-in-bottom" style={{ animationDelay: `${index * 0.05}s` }}>
                        <TableCell className="font-medium">{customer.name}</TableCell>
                        <TableCell>
                          {customer.phone ? (
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 mr-1 text-gray-500" />
                              <span>{customer.phone}</span>
                            </div>
                          ) : '-'}
                        </TableCell>
                        <TableCell>
                          {customer.email ? (
                            <div className="flex items-center">
                              <Mail className="h-4 w-4 mr-1 text-gray-500" />
                              <span>{customer.email}</span>
                            </div>
                          ) : '-'}
                        </TableCell>
                        <TableCell>{customer.address || '-'}</TableCell>
                        <TableCell>{customer.loyalty_points || 0}</TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center space-x-2 space-x-reverse">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(customer)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => openDeleteDialog(customer)}>
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
        
        {/* تعديل العميل */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>تعديل بيانات العميل</DialogTitle>
              <DialogDescription>
                تعديل بيانات العميل في النموذج أدناه
              </DialogDescription>
            </DialogHeader>
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
                <FormField
                  control={editForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>اسم العميل</FormLabel>
                      <FormControl>
                        <Input placeholder="أدخل اسم العميل" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>رقم الهاتف</FormLabel>
                      <FormControl>
                        <Input placeholder="أدخل رقم الهاتف" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>البريد الإلكتروني</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="أدخل البريد الإلكتروني" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>العنوان</FormLabel>
                      <FormControl>
                        <Input placeholder="أدخل العنوان" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button 
                    type="submit" 
                    className="bg-pharma-600 hover:bg-pharma-700"
                    disabled={updateCustomerMutation.isPending}
                  >
                    {updateCustomerMutation.isPending ? 'جاري التحديث...' : 'تحديث البيانات'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        
        {/* حذف العميل */}
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>حذف العميل</DialogTitle>
              <DialogDescription>
                هل أنت متأكد من رغبتك في حذف هذا العميل؟ لا يمكن التراجع عن هذا الإجراء.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                إلغاء
              </Button>
              <Button 
                variant="destructive" 
                onClick={confirmDelete}
                disabled={deleteCustomerMutation.isPending}
              >
                {deleteCustomerMutation.isPending ? 'جاري الحذف...' : 'تأكيد الحذف'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageContainer>
    </div>
  );
};

export default Customers;
