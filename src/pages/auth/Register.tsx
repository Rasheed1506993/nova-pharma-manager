import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Link } from 'react-router-dom';

const registerSchema = z.object({
  pharmacyName: z.string().min(2, { message: "يجب أن يحتوي اسم الصيدلية على حرفين على الأقل" }),
  email: z.string().email({ message: "يجب إدخال بريد إلكتروني صحيح" }),
  password: z.string().min(8, { message: "يجب أن تتكون كلمة المرور من 8 أحرف على الأقل" }),
  phoneNumber: z.string().min(10, { message: "يجب إدخال رقم هاتف صحيح" }),
  address: z.string().min(5, { message: "يجب إدخال عنوان صحيح" }),
  ownerName: z.string().min(2, { message: "يجب إدخال اسم المالك بشكل صحيح" }),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

const Register = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      pharmacyName: "",
      email: "",
      password: "",
      phoneNumber: "",
      address: "",
      ownerName: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      // 1. إنشاء المستخدم في supabase.auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
      });

      if (authError) throw authError;

      // 2. التأكد من أن عملية التسجيل تمت بنجاح ووجود user.id
      const userId = authData.user?.id;
      if (!userId) throw new Error("فشل في الحصول على معرف المستخدم");

      // 3. إضافة بيانات الصيدلية إلى جدول pharmacies وربطها بـ user_id
      const { error: profileError } = await supabase
        .from('pharmacies')
        .insert({
          user_id: userId,
          name: data.pharmacyName,
          email: data.email,
          phone: data.phoneNumber,
          address: data.address,
          description: `صيدلية يملكها: ${data.ownerName}`
        });

      if (profileError) throw profileError;

      // 4. إظهار رسالة النجاح والتوجيه
      toast({
        title: "تم إنشاء الحساب بنجاح!",
        description: "سيتم توجيهك إلى لوحة التحكم الخاصة بك.",
      });

      navigate('/');

    } catch (error: any) {
      console.error('Registration error:', error);
      toast({
        title: "خطأ في التسجيل",
        description: error.message || "حدث خطأ أثناء إنشاء الحساب. الرجاء المحاولة مرة أخرى.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="h-8 w-8 bg-pharma-600 rounded-md flex items-center justify-center">
              <span className="text-white text-sm font-bold">N</span>
            </div>
            <h2 className="text-xl font-bold text-pharma-700">Nova Pharma</h2>
          </div>
          <h1 className="text-2xl font-bold">تسجيل صيدلية جديدة</h1>
          <p className="mt-2 text-gray-600">أنشئ حسابك الآن واستمتع بإدارة صيدليتك بشكل احترافي</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="pharmacyName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اسم الصيدلية</FormLabel>
                  <FormControl>
                    <Input placeholder="صيدلية الشفاء" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ownerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>اسم المالك</FormLabel>
                  <FormControl>
                    <Input placeholder="د. محمد أحمد" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>البريد الإلكتروني</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="example@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>كلمة المرور</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="********" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>رقم الهاتف</FormLabel>
                  <FormControl>
                    <Input placeholder="05xxxxxxxx" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>عنوان الصيدلية</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="المدينة، الحي، الشارع، رقم المبنى" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">إنشاء الحساب</Button>
          </form>
        </Form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            لديك حساب بالفعل؟{" "}
            <Link to="/auth/login" className="text-pharma-600 hover:text-pharma-700 font-medium">
              تسجيل الدخول
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
