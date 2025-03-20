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
import { Search, Plus, Truck, Edit, Trash2, Phone, Mail, User } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const supplierSchema = z.object({
  name: z.string().min(2, { message: 'اسم المورد مطلوب ويجب أن يكون أكثر من حرفين' }),
  contact_person: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email({ message: 'البريد الإلكتروني غير صحيح' }).optional().or(z.literal('')),
  address: z.string().optional(),
});

type SupplierFormValues = z.infer<typeof supplierSchema>;

const Suppliers = () => {
  const [sidebarOpen, setSidebarOpen] = useState(window.innerWidth >= 1024);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedSupplier, setSelectedSupplier] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const { data: suppliers = [], isLoading } = useQuery({
    queryKey: ['suppliers'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('suppliers')
        .select('*')
        .order('name');
      
      if (error) {
        toast({
          variant: "destructive",
          title: "خطأ في جلب بيانات الموردين",
          description: error.message,
        });
        return [];
      }
      
      return data;
    }
  });

  const addForm = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      name: '',
      contact_person: '',
      phone: '',
      email: '',
      address: '',
    },
  });

  const editForm = useForm<SupplierFormValues>({
    resolver: zodResolver(supplierSchema),
    defaultValues: {
      name: '',
      contact_person: '',
      phone: '',
      email: '',
      address: '',
    },
  });

  const addSupplierMutation = useMutation({
    mutationFn: async (values: SupplierFormValues) => {
      const { data, error } = await supabase
        .from('suppliers')
        .insert([{
          name: values.name,
          contact_person: values.contact_person || null,
          phone: values.phone || null,
          email: values.email || null,
          address: values.address || null
        }])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      setIsAddOpen(false);
      addForm.reset();
      toast({
        title: "تمت الإضافة بنجاح",
        description: "تم إضافة المورد الجديد ��نجاح",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "خطأ في إضافة المورد",
        description: error.message,
      });
    }
  });

  const updateSupplierMutation = useMutation({
    mutationFn: async (values: SupplierFormValues & { id: string }) => {
      const { id, ...supplierData } = values;
      const { data, error } = await supabase
        .from('suppliers')
        .update(supplierData)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      setIsEditOpen(false);
      setSelectedSupplier(null);
      toast({
        title: "تم التحديث بنجاح",
        description: "تم تحديث بيانات المورد بنجاح",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "خطأ في تحديث بيانات المورد",
        description: error.message,
      });
    }
  });

  const deleteSupplierMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('suppliers')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['suppliers'] });
      setIsDeleteOpen(false);
      setSelectedSupplier(null);
      toast({
        title: "تم الحذف بنجاح",
        description: "تم حذف المورد بنجاح",
      });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "خطأ في حذف المورد",
        description: error.message,
      });
    }
  });

  const onAddSubmit = (values: SupplierFormValues) => {
    addSupplierMutation.mutate(values);
  };

  const onEditSubmit = (values: SupplierFormValues) => {
    if (selectedSupplier) {
      updateSupplierMutation.mutate({
        id: selectedSupplier.id,
        ...values,
      });
    }
  };

  const openEditDialog = (supplier: any) => {
    setSelectedSupplier(supplier);
    editForm.reset({
      name: supplier.name,
      contact_person: supplier.contact_person || '',
      phone: supplier.phone || '',
      email: supplier.email || '',
      address: supplier.address || '',
    });
    setIsEditOpen(true);
  };

  const openDeleteDialog = (supplier: any) => {
    setSelectedSupplier(supplier);
    setIsDeleteOpen(true);
  };

  const confirmDelete = () => {
    if (selectedSupplier) {
      deleteSupplierMutation.mutate(selectedSupplier.id);
    }
  };

  const filteredSuppliers = suppliers.filter(supplier => 
    supplier.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.contact_person?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <div className="bg-background">
      <Header toggleSidebar={toggleSidebar} />
      <Sidebar isOpen={sidebarOpen} />
      
      <PageContainer className={`${sidebarOpen ? 'lg:mr-64' : ''}`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-1">
              إدارة الموردين
            </h1>
            <p className="text-gray-500 dark:text-gray-400">
              عرض وإدارة بيانات الموردين
            </p>
          </div>
          
          <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
            <DialogTrigger asChild>
              <Button className="bg-pharma-600 hover:bg-pharma-700">
                <Plus className="h-4 w-4 mr-1" />
                إضافة مورد
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>إضافة مورد جديد</DialogTitle>
                <DialogDescription>
                  أدخل بيانات المورد الجديد في النموذج أدناه
                </DialogDescription>
              </DialogHeader>
              <Form {...addForm}>
                <form onSubmit={addForm.handleSubmit(onAddSubmit)} className="space-y-4">
                  <FormField
                    control={addForm.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>اسم الشركة/المورد</FormLabel>
                        <FormControl>
                          <Input placeholder="أدخل اسم الشركة أو المورد" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={addForm.control}
                    name="contact_person"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>مسؤول الاتصال</FormLabel>
                        <FormControl>
                          <Input placeholder="أدخل اسم مسؤول الاتصال" {...field} />
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
                      disabled={addSupplierMutation.isPending}
                    >
                      {addSupplierMutation.isPending ? 'جاري الإضافة...' : 'إضافة المورد'}
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
              placeholder="البحث عن مورد..." 
              className="glass-input pr-10" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        <Card className="glass-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-xl">قائمة الموردين</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <p>جاري تحميل البيانات...</p>
              </div>
            ) : filteredSuppliers.length === 0 ? (
              <div className="text-center py-8">
                <Truck className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium">لا يوجد موردين</h3>
                <p className="text-gray-500 dark:text-gray-400 mt-2">لم يتم العثور على أي موردين في النظام</p>
              </div>
            ) : (
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>اسم المورد</TableHead>
                      <TableHead>مسؤول الاتصال</TableHead>
                      <TableHead>رقم الهاتف</TableHead>
                      <TableHead>البريد الإلكتروني</TableHead>
                      <TableHead>العنوان</TableHead>
                      <TableHead className="text-center">إجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredSuppliers.map((supplier, index) => (
                      <TableRow key={supplier.id} className="animate-slide-in-bottom" style={{ animationDelay: `${index * 0.05}s` }}>
                        <TableCell className="font-medium">{supplier.name}</TableCell>
                        <TableCell>
                          {supplier.contact_person ? (
                            <div className="flex items-center">
                              <User className="h-4 w-4 mr-1 text-gray-500" />
                              <span>{supplier.contact_person}</span>
                            </div>
                          ) : '-'}
                        </TableCell>
                        <TableCell>
                          {supplier.phone ? (
                            <div className="flex items-center">
                              <Phone className="h-4 w-4 mr-1 text-gray-500" />
                              <span>{supplier.phone}</span>
                            </div>
                          ) : '-'}
                        </TableCell>
                        <TableCell>
                          {supplier.email ? (
                            <div className="flex items-center">
                              <Mail className="h-4 w-4 mr-1 text-gray-500" />
                              <span>{supplier.email}</span>
                            </div>
                          ) : '-'}
                        </TableCell>
                        <TableCell>{supplier.address || '-'}</TableCell>
                        <TableCell>
                          <div className="flex items-center justify-center space-x-2 space-x-reverse">
                            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEditDialog(supplier)}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500" onClick={() => openDeleteDialog(supplier)}>
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
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>تعديل بيانات المورد</DialogTitle>
              <DialogDescription>
                تعديل بيانات المورد في النموذج أدناه
              </DialogDescription>
            </DialogHeader>
            <Form {...editForm}>
              <form onSubmit={editForm.handleSubmit(onEditSubmit)} className="space-y-4">
                <FormField
                  control={editForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>اسم الشركة/المورد</FormLabel>
                      <FormControl>
                        <Input placeholder="أدخل اسم الشركة أو المورد" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="contact_person"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>مسؤول الاتصال</FormLabel>
                      <FormControl>
                        <Input placeholder="أدخل اسم مسؤول الاتصال" {...field} />
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
                    disabled={updateSupplierMutation.isPending}
                  >
                    {updateSupplierMutation.isPending ? 'جاري التحديث...' : 'تحديث البيانات'}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
        
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <DialogHeader>
              <DialogTitle>حذف المورد</DialogTitle>
              <DialogDescription>
                هل أنت متأكد من رغبتك في حذف هذا المورد؟ لا يمكن التراجع عن هذا الإجراء.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                إلغاء
              </Button>
              <Button 
                variant="destructive" 
                onClick={confirmDelete}
                disabled={deleteSupplierMutation.isPending}
              >
                {deleteSupplierMutation.isPending ? 'جاري الحذف...' : 'تأكيد الحذف'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PageContainer>
    </div>
  );
};

export default Suppliers;
