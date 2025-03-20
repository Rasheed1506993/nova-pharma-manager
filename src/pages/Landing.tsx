
import React from 'react';
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";

const LandingPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pharma-50 to-white">
      {/* Hero Section */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto py-4 px-4 sm:px-6 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="h-10 w-10 bg-pharma-600 rounded-md flex items-center justify-center">
              <span className="text-white text-lg font-bold">N</span>
            </div>
            <h1 className="text-2xl font-bold text-pharma-700">Nova Pharma</h1>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link to="/auth/login">تسجيل الدخول</Link>
            </Button>
            <Button asChild>
              <Link to="/auth/register">تسجيل صيدلية جديدة</Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-12">
        {/* Hero Banner */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900">نظام إدارة الصيدليات الأكثر تطورًا</h1>
          <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
            حل متكامل يساعد صيدليتك على تحسين الكفاءة، وزيادة المبيعات، وتقديم خدمة أفضل للعملاء
          </p>
          <Button size="lg" className="px-8 py-6 text-lg" asChild>
            <Link to="/auth/register">ابدأ الآن مجانًا</Link>
          </Button>
        </div>

        {/* Features */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-10 text-gray-900">مميزات النظام</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>إدارة المخزون</CardTitle>
                <CardDescription>تتبع المخزون بدقة ومراقبة تواريخ انتهاء الصلاحية</CardDescription>
              </CardHeader>
              <CardContent>
                <p>تحكم كامل في مخزون الأدوية والمنتجات، مع تنبيهات آلية عند انخفاض المخزون أو اقتراب تاريخ الانتهاء.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>نقاط البيع</CardTitle>
                <CardDescription>واجهة سريعة وسهلة لإتمام المبيعات</CardDescription>
              </CardHeader>
              <CardContent>
                <p>نظام مبيعات متطور يدعم قارئ الباركود والحسابات التلقائية وإصدار الفواتير بضغطة زر.</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>تقارير ذكية</CardTitle>
                <CardDescription>رؤية شاملة لأداء الصيدلية</CardDescription>
              </CardHeader>
              <CardContent>
                <p>تقارير تفصيلية عن المبيعات والمشتريات والأرباح، مع رسوم بيانية توضح اتجاهات الأداء.</p>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Pricing */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-10 text-gray-900">باقات الاشتراك</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="border-pharma-200">
              <CardHeader>
                <CardTitle>الباقة الأساسية</CardTitle>
                <CardDescription>مناسبة للصيدليات الصغيرة</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-4">$29<span className="text-lg text-gray-500">/شهريًا</span></div>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">✓ إدارة المخزون</li>
                  <li className="flex items-center gap-2">✓ نقاط البيع الأساسية</li>
                  <li className="flex items-center gap-2">✓ تقارير أساسية</li>
                  <li className="flex items-center gap-2">✓ دعم بالبريد الإلكتروني</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline">اختر هذه الباقة</Button>
              </CardFooter>
            </Card>
            
            <Card className="border-pharma-500 relative">
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-pharma-500 text-white px-4 py-1 rounded-full text-sm font-medium">الأكثر شيوعًا</div>
              <CardHeader>
                <CardTitle>الباقة الاحترافية</CardTitle>
                <CardDescription>مناسبة لمعظم الصيدليات</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-4">$79<span className="text-lg text-gray-500">/شهريًا</span></div>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">✓ جميع ميزات الباقة الأساسية</li>
                  <li className="flex items-center gap-2">✓ إدارة العملاء والموردين</li>
                  <li className="flex items-center gap-2">✓ تقارير متقدمة</li>
                  <li className="flex items-center gap-2">✓ دعم فني على مدار الساعة</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full">اختر هذه الباقة</Button>
              </CardFooter>
            </Card>
            
            <Card className="border-pharma-200">
              <CardHeader>
                <CardTitle>الباقة المتقدمة</CardTitle>
                <CardDescription>للصيدليات الكبيرة والسلاسل</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-4">$149<span className="text-lg text-gray-500">/شهريًا</span></div>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2">✓ جميع ميزات الباقة الاحترافية</li>
                  <li className="flex items-center gap-2">✓ دعم تعدد الفروع</li>
                  <li className="flex items-center gap-2">✓ تكامل مع أنظمة خارجية</li>
                  <li className="flex items-center gap-2">✓ مدير حساب مخصص</li>
                </ul>
              </CardContent>
              <CardFooter>
                <Button className="w-full" variant="outline">اختر هذه الباقة</Button>
              </CardFooter>
            </Card>
          </div>
        </section>

        {/* Testimonials */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-10 text-gray-900">آراء عملائنا</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardContent className="pt-6">
                <p className="italic mb-4">"نظام Nova Pharma غيّر طريقة إدارة صيدليتنا بالكامل. أصبحنا نوفر الوقت والجهد ونستطيع التركيز على خدمة العملاء بشكل أفضل."</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">م</div>
                  <div>
                    <p className="font-medium">د. محمد سعيد</p>
                    <p className="text-sm text-gray-500">صيدلية الشفاء</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="pt-6">
                <p className="italic mb-4">"سهولة الاستخدام والتقارير الدقيقة ساعدتنا في اتخاذ قرارات أفضل. خدمة العملاء ممتازة والدعم الفني متوفر دائمًا."</p>
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">س</div>
                  <div>
                    <p className="font-medium">د. سارة أحمد</p>
                    <p className="text-sm text-gray-500">صيدلية الرعاية</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>

        {/* Call to Action */}
        <section className="text-center bg-pharma-50 p-10 rounded-lg">
          <h2 className="text-3xl font-bold mb-4 text-gray-900">جاهز لتطوير صيدليتك؟</h2>
          <p className="text-xl text-gray-600 mb-6 max-w-2xl mx-auto">
            انضم إلى آلاف الصيدليات التي تستخدم Nova Pharma لتحسين أدائها اليومي وزيادة أرباحها
          </p>
          <Button size="lg" className="px-8 py-6 text-lg" asChild>
            <Link to="/auth/register">سجل الآن</Link>
          </Button>
        </section>
      </main>

      <footer className="bg-gray-100 border-t border-gray-200 py-10">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row justify-between mb-8">
            <div className="mb-6 md:mb-0">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-8 w-8 bg-pharma-600 rounded-md flex items-center justify-center">
                  <span className="text-white text-sm font-bold">N</span>
                </div>
                <h3 className="text-xl font-bold text-pharma-700">Nova Pharma</h3>
              </div>
              <p className="text-gray-600 max-w-md">
                نظام متكامل لإدارة الصيدليات يساعدك على تحسين الكفاءة وزيادة الربحية
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              <div>
                <h4 className="font-semibold mb-3">المنتج</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-600 hover:text-pharma-600">المميزات</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-pharma-600">التسعير</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-pharma-600">شركاؤنا</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">الشركة</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-600 hover:text-pharma-600">عن الشركة</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-pharma-600">فريق العمل</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-pharma-600">اتصل بنا</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-3">الموارد</h4>
                <ul className="space-y-2">
                  <li><a href="#" className="text-gray-600 hover:text-pharma-600">المدونة</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-pharma-600">الدعم الفني</a></li>
                  <li><a href="#" className="text-gray-600 hover:text-pharma-600">الأسئلة الشائعة</a></li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="pt-6 border-t border-gray-200 text-center text-gray-500">
            <p>© {new Date().getFullYear()} Nova Pharma. جميع الحقوق محفوظة.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
