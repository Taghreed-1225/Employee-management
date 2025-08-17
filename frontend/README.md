# Employee Management System - Frontend

تطبيق Angular لإدارة الموظفين مع واجهة مستخدم حديثة وجميلة.

## المميزات

- ✅ تسجيل الدخول وإنشاء حساب جديد
- ✅ عرض قائمة الموظفين في جدول منظم
- ✅ إضافة موظفين جدد
- ✅ تعديل بيانات الموظفين
- ✅ حذف الموظفين
- ✅ تصدير البيانات إلى ملف Excel
- ✅ واجهة مستخدم عربية جميلة
- ✅ تصميم متجاوب (Responsive Design)
- ✅ Material Design Components

## المتطلبات

- Node.js (الإصدار 16 أو أحدث)
- npm أو yarn

## التثبيت والتشغيل

1. **تثبيت التبعيات:**
   ```bash
   npm install
   ```

2. **تشغيل التطبيق:**
   ```bash
   npm start
   ```

3. **فتح المتصفح:**
   انتقل إلى `http://localhost:4200`

## البناء للإنتاج

```bash
npm run build
```

## هيكل المشروع

```
src/
├── app/
│   ├── components/
│   │   ├── login/           # صفحة تسجيل الدخول
│   │   ├── register/        # صفحة إنشاء حساب جديد
│   │   ├── home/           # الصفحة الرئيسية
│   │   ├── employee-list/  # قائمة الموظفين
│   │   ├── employee-form/  # نموذج إضافة/تعديل الموظف
│   │   └── navbar/         # شريط التنقل
│   ├── services/
│   │   ├── auth.service.ts      # خدمة المصادقة
│   │   └── employee.service.ts  # خدمة إدارة الموظفين
│   ├── guards/
│   │   └── auth.guard.ts        # حماية الصفحات
│   ├── interceptors/
│   │   └── auth.interceptor.ts  # إضافة token للمطالبات
│   └── app.module.ts
├── assets/
└── styles.scss
```

## التقنيات المستخدمة

- **Angular 16** - إطار العمل الرئيسي
- **Angular Material** - مكونات UI
- **RxJS** - البرمجة التفاعلية
- **TypeScript** - لغة البرمجة
- **SCSS** - أنماط CSS المتقدمة

## API Endpoints

التطبيق يتصل بـ API على المنفذ 8080:

- `POST /api/auth/login` - تسجيل الدخول
- `POST /api/auth/register` - إنشاء حساب جديد
- `GET /api/employees` - جلب قائمة الموظفين
- `POST /api/employees` - إضافة موظف جديد
- `PUT /api/employees/{id}` - تحديث موظف
- `DELETE /api/employees/{id}` - حذف موظف
- `GET /api/employees/export` - تصدير إلى Excel

## المطور

تم تطوير هذا التطبيق باستخدام أحدث تقنيات Angular مع التركيز على تجربة المستخدم والتصميم الجميل.
