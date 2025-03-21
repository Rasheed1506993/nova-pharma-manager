
import { createId } from '@paralleldrive/cuid2';

// توليد باركود فريد للمنتج
export const generateUniqueBarcode = (prefix: string = 'PRD'): string => {
  // إنشاء رمز فريد مبني على الوقت والتوقيع العشوائي
  const uniqueId = createId();
  
  // تنسيق الباركود بإضافة البادئة ثم 12 رقماً من المعرف الفريد
  const barcode = `${prefix}${uniqueId.substring(0, 12)}`;
  
  return barcode;
};

// التحقق من صحة الباركود
export const isValidBarcode = (barcode: string): boolean => {
  // يمكن إضافة منطق للتحقق من صحة الباركود حسب متطلبات العمل
  return barcode && barcode.length >= 8;
};
