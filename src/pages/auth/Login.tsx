
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
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Link } from 'react-router-dom';

const loginSchema = z.object({
  email: z.string().email({ message: "يجب إدخال بريد إلكتروني صحيح" }),
  password: z.string().min(1, { message: "يجب إدخال كلمة المرور" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) throw error;
      
      toast({
        title: "تم تسجيل الدخول بنجاح!",
        description: "سيتم توجيهك إلى لوحة التحكم الخاصة بك.",
      });
      
      // Redirect to dashboard
      navigate('/');
    } catch (error: any) {
      console.error('Login error:', error);
      toast({
        title: "خطأ في تسجيل الدخول",
        description: "البريد الإلكتروني أو كلمة المرور غير صحيحة. الرجاء المحاولة مرة أخرى.",
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
          <h1 className="text-2xl font-bold">تسجيل الدخول</h1>
          <p className="mt-2 text-gray-600">أدخل بيانات حسابك للوصول إلى لوحة التحكم الخاصة بك</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link to="/auth/forgot-password" className="text-pharma-600 hover:text-pharma-700">
                  نسيت كلمة المرور؟
                </Link>
              </div>
            </div>

            <Button type="submit" className="w-full">تسجيل الدخول</Button>
          </form>
        </Form>

        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            ليس لديك حساب؟{" "}
            <Link to="/auth/register" className="text-pharma-600 hover:text-pharma-700 font-medium">
              تسجيل صيدلية جديدة
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
