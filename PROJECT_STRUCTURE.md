# 🏗️ بنية المشروع - Hawari Tours
# Project Structure & Architecture

---

## 📦 **نظرة عامة على المشروع**

**Hawari Tours** هو موقع سياحي احترافي كامل لإدارة وحجز الرحلات السياحية في جزيرة سقطرى.

### **التقنيات المستخدمة:**
- ⚛️ **Next.js 14+** (App Router)
- 🎨 **Tailwind CSS** (للتصميم)
- 🎭 **Framer Motion** (للأنيميشن)
- 🗄️ **Prisma ORM** (قاعدة البيانات)
- 🐘 **PostgreSQL** (Database)
- 🔐 **JWT** (المصادقة)
- 📧 **Nodemailer** (البريد الإلكتروني)

---

## 📁 **هيكل الملفات**

```
hawari_tours/
│
├── 📂 app/                          # Next.js App Router
│   ├── 📂 admin/                    # 🔒 لوحة التحكم (محمية)
│   │   ├── page.jsx                 # Dashboard الرئيسي
│   │   ├── 📂 tours/                # إدارة الجولات
│   │   │   └── page.jsx             # صفحة إدارة الجولات
│   │   ├── 📂 bookings/             # إدارة الحجوزات
│   │   │   └── page.jsx             # صفحة إدارة الحجوزات
│   │   ├── 📂 news/                 # إدارة الأخبار
│   │   │   └── page.jsx             # صفحة إدارة الأخبار
│   │   ├── 📂 users/                # إدارة المستخدمين
│   │   │   └── page.jsx             # صفحة إدارة المستخدمين
│   │   └── 📂 destinations/         # إدارة المعالم
│   │       └── page.jsx             # صفحة إدارة المعالم
│   │
│   ├── 📂 api/                      # Backend APIs
│   │   ├── 📂 admin/                # 🔒 Admin APIs (محمية)
│   │   │   ├── 📂 tours/            # CRUD الجولات
│   │   │   │   └── route.js
│   │   │   ├── 📂 bookings/         # CRUD الحجوزات
│   │   │   │   └── route.js
│   │   │   ├── 📂 news/             # CRUD الأخبار
│   │   │   │   └── route.js
│   │   │   ├── 📂 users/            # CRUD المستخدمين
│   │   │   │   └── route.js
│   │   │   └── 📂 destinations/     # CRUD المعالم
│   │   │       └── route.js
│   │   │
│   │   ├── 📂 auth/                 # APIs المصادقة
│   │   │   ├── 📂 login/
│   │   │   ├── 📂 register/
│   │   │   ├── 📂 logout/
│   │   │   └── 📂 me/
│   │   │
│   │   ├── 📂 tours/                # 🌐 Public API للجولات
│   │   │   └── route.js
│   │   ├── 📂 destinations/         # 🌐 Public API للمعالم
│   │   │   └── route.js
│   │   ├── 📂 news/                 # 🌐 Public API للأخبار
│   │   │   └── route.js
│   │   └── 📂 weather/              # API الطقس
│   │       └── route.js
│   │
│   ├── 📂 tours/                    # 🌐 صفحة الجولات العامة
│   │   ├── page.jsx
│   │   └── 📂 [slug]/               # صفحة جولة واحدة
│   │       └── page.jsx
│   │
│   ├── 📂 destinations/             # 🌐 صفحة المعالم العامة
│   │   └── page.jsx
│   │
│   ├── 📂 news/                     # 🌐 صفحة الأخبار العامة
│   │   └── page.jsx
│   │
│   ├── 📂 about/                    # من نحن
│   ├── 📂 contact/                  # اتصل بنا
│   ├── 📂 gallery/                  # المعرض
│   │
│   ├── page.jsx                     # 🏠 الصفحة الرئيسية
│   ├── layout.jsx                   # Layout رئيسي
│   └── globals.css                  # Styles عامة
│
├── 📂 components/                   # React Components
│   ├── 📂 admin/                    # مكونات لوحة التحكم
│   │   ├── AdminLayout.jsx          # Layout لوحة التحكم
│   │   └── Toast.jsx                # نظام الإشعارات
│   │
│   ├── Navbar.jsx                   # شريط التنقل
│   ├── Footer.jsx                   # التذييل
│   ├── TourCard.jsx                 # بطاقة الجولة
│   └── WhatsAppButton.jsx           # زر واتساب
│
├── 📂 contexts/                     # React Contexts
│   ├── AppContext.jsx               # Context عام (اللغة، Dark Mode)
│   └── AuthContext.jsx              # Context المصادقة
│
├── 📂 hooks/                        # Custom React Hooks
│   └── useAuth.js
│
├── 📂 lib/                          # مكتبات مساعدة
│   ├── prisma.js                    # Prisma Client
│   ├── auth.js                      # دوال المصادقة
│   └── apiAuth.js                   # Middleware للـ APIs
│
├── 📂 prisma/                       # Database Schema
│   └── schema.prisma                # Prisma Schema
│
├── 📂 public/                       # ملفات عامة
│   └── 📂 img/                      # الصور
│
├── .env.local                       # متغيرات البيئة
├── package.json                     # Dependencies
├── next.config.js                   # Next.js Config
├── tailwind.config.js               # Tailwind Config
│
├── TESTING_GUIDE.md                 # 🧪 دليل الاختبار
└── PROJECT_STRUCTURE.md             # 📖 هذا الملف
```

---

## 🎯 **تدفق البيانات (Data Flow)**

### **للصفحات العامة (Public Pages):**

```
User → Page → Public API → Database → Response → Page → User
```

**مثال: عرض الجولات**
```
1. User يفتح /tours
2. Page يرسل request إلى /api/tours
3. API يقرأ من Database (Prisma)
4. API يُرجع البيانات
5. Page يعرض البيانات
```

---

### **للوحة التحكم (Admin Panel):**

```
Admin → Login → JWT Token → Admin Page → Protected API → Database
```

**مثال: إضافة جولة جديدة**
```
1. Admin يسجل دخول
2. يحصل على JWT Token
3. يفتح /admin/tours
4. يملأ Form ويضغط Save
5. يُرسل POST request إلى /api/admin/tours
6. API يتحقق من Token والصلاحيات
7. API يضيف الجولة إلى Database
8. API يُرجع success message
9. Page يُحدث نفسه تلقائياً
10. الجولة تظهر في الموقع العام فوراً
```

---

## 🔐 **نظام الصلاحيات**

### **الأدوار (Roles):**

#### **1. USER (مستخدم عادي)**
```javascript
الصلاحيات:
✅ تصفح الموقع
✅ حجز الجولات
✅ إدارة حجوزاته
✅ تعديل ملفه الشخصي
❌ الدخول إلى /admin
```

#### **2. ADMIN (مدير)**
```javascript
الصلاحيات:
✅ كل صلاحيات USER
✅ الدخول إلى /admin
✅ إدارة الجولات
✅ إدارة الحجوزات
✅ إدارة الأخبار
✅ إدارة المعالم
✅ عرض الإحصائيات
❌ إدارة المستخدمين (عدا نفسه)
```

#### **3. SUPER_ADMIN (مدير عام)**
```javascript
الصلاحيات:
✅ كل صلاحيات ADMIN
✅ إدارة جميع المستخدمين
✅ تغيير الصلاحيات
✅ الوصول لكل شيء
```

---

## 🗄️ **Database Schema**

### **الجداول الرئيسية:**

#### **1. User**
```prisma
model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String
  password      String    # Hashed with bcrypt
  role          Role      @default(USER)
  isActive      Boolean   @default(true)
  bookings      Booking[]
  createdAt     DateTime  @default(now())
}

enum Role {
  USER
  ADMIN
  SUPER_ADMIN
}
```

#### **2. Tour**
```prisma
model Tour {
  id              String    @id @default(cuid())
  slug            String    @unique
  title           String
  titleAr         String
  description     String
  descriptionAr   String
  price           Float
  discount        Float     @default(0)
  duration        Int       # أيام
  maxPeople       Int
  difficulty      Difficulty @default(MODERATE)
  category        TourCategory
  featured        Boolean   @default(false)
  isActive        Boolean   @default(true)
  coverImage      String?
  images          String[]
  includes        String[]
  excludes        String[]
  rating          Float     @default(5.0)
  reviewsCount    Int       @default(0)
  bookings        Booking[]
  createdAt       DateTime  @default(now())
}
```

#### **3. Booking**
```prisma
model Booking {
  id              String    @id @default(cuid())
  bookingNumber   String    @unique
  tourId          String
  tour            Tour      @relation(fields: [tourId], references: [id])
  userId          String
  user            User      @relation(fields: [userId], references: [id])
  startDate       DateTime
  endDate         DateTime
  numberOfPeople  Int
  totalPrice      Float
  paidAmount      Float     @default(0)
  status          BookingStatus @default(PENDING)
  paymentStatus   PaymentStatus @default(PENDING)
  createdAt       DateTime  @default(now())
}
```

#### **4. Destination**
```prisma
model Destination {
  id              String    @id @default(cuid())
  name            String
  nameAr          String
  description     String
  descriptionAr   String
  category        DestinationCategory
  coverImage      String?
  images          String[]
  highlights      String[]
  activities      String[]
  featured        Boolean   @default(false)
  unesco          Boolean   @default(false)
  isActive        Boolean   @default(true)
  bestTimeToVisit String?
  createdAt       DateTime  @default(now())
}
```

#### **5. News**
```prisma
model News {
  id              String    @id @default(cuid())
  title           String
  titleAr         String
  excerpt         String
  excerptAr       String
  content         String
  contentAr       String
  coverImage      String?
  images          String[]
  category        NewsCategory
  tags            String[]
  featured        Boolean   @default(false)
  breaking        Boolean   @default(false)
  trending        Boolean   @default(false)
  published       Boolean   @default(false)
  viewsCount      Int       @default(0)
  authorName      String
  createdAt       DateTime  @default(now())
}
```

---

## 🔄 **APIs Documentation**

### **Public APIs (لا تحتاج مصادقة):**

#### **GET /api/tours**
```javascript
// جلب جميع الجولات النشطة
Query Parameters:
  - category: ADVENTURE | CULTURAL | NATURE | etc.
  - minPrice: number
  - maxPrice: number
  - difficulty: EASY | MODERATE | CHALLENGING | DIFFICULT
  - featured: boolean
  - search: string

Response:
{
  success: true,
  data: Tour[],
  count: number
}
```

#### **GET /api/destinations**
```javascript
// جلب جميع المعالم النشطة
Query Parameters:
  - category: NATURE | HERITAGE | BEACH | etc.
  - featured: boolean
  - search: string

Response:
{
  success: true,
  data: Destination[],
  pagination: {...}
}
```

#### **GET /api/news**
```javascript
// جلب جميع الأخبار المنشورة
Query Parameters:
  - category: TOURISM | ENVIRONMENT | etc.
  - featured: boolean
  - search: string

Response:
{
  success: true,
  data: News[],
  pagination: {...}
}
```

---

### **Protected APIs (تحتاج JWT Token):**

#### **POST /api/admin/tours**
```javascript
// إنشاء جولة جديدة
Headers:
  Cookie: token=<JWT_TOKEN>

Body:
{
  title: string,
  titleAr: string,
  description: string,
  descriptionAr: string,
  price: number,
  duration: number,
  category: string,
  // ... باقي الحقول
}

Response:
{
  success: true,
  data: Tour
}
```

#### **PUT /api/admin/tours**
```javascript
// تعديل جولة
Body:
{
  id: string,
  // ... الحقول المراد تعديلها
}
```

#### **DELETE /api/admin/tours?id={tourId}**
```javascript
// حذف جولة
```

---

## 🎨 **Styling System**

### **Tailwind CSS Classes:**

#### **الألوان الرئيسية:**
```css
Primary: blue-600 → purple-600
Success: green-600 → emerald-600
Warning: yellow-500 → orange-500
Danger: red-600 → rose-600
```

#### **Gradients:**
```css
.bg-gradient-to-r from-blue-600 to-purple-600
.bg-gradient-to-br from-green-500 to-emerald-600
```

#### **Dark Mode:**
```css
.dark:bg-gray-900
.dark:text-white
.dark:border-gray-700
```

---

## 🎭 **Animations (Framer Motion)**

### **أمثلة مستخدمة:**

```javascript
// Fade In
<motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  transition={{ duration: 0.5 }}
>

// Slide Up
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ delay: 0.2 }}
>

// Hover Effect
<motion.button
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
>
```

---

## 🌐 **Multi-Language System**

### **كيف يعمل:**

```javascript
// في AppContext
const [locale, setLocale] = useState('ar')

// في المكونات
const { locale } = useApp()
const isAr = locale === 'ar'

// عرض النص
{isAr ? 'مرحباً' : 'Hello'}
```

### **RTL/LTR:**
```javascript
<div dir={isAr ? 'rtl' : 'ltr'}>
```

---

## 📱 **Responsive Design**

### **Breakpoints:**
```javascript
sm:  640px
md:  768px
lg:  1024px
xl:  1280px
2xl: 1536px
```

### **مثال:**
```jsx
<div className="
  grid 
  grid-cols-1     // Mobile
  md:grid-cols-2  // Tablet
  lg:grid-cols-3  // Desktop
">
```

---

## 🚀 **Deployment**

### **متطلبات Production:**

1. **Environment Variables:**
```env
DATABASE_URL="postgresql://..."
JWT_SECRET="..."
NEXTAUTH_SECRET="..."
```

2. **Build:**
```bash
npm run build
```

3. **Start:**
```bash
npm start
```

---

## 📊 **Performance Optimization**

### **ما تم تطبيقه:**

✅ Image Optimization (Next.js Image)
✅ Code Splitting (Next.js Auto)
✅ Lazy Loading للصور
✅ Suspense للـ Components
✅ API Response Caching
✅ Database Query Optimization

---

## 🧪 **Testing**

راجع [TESTING_GUIDE.md](./TESTING_GUIDE.md) للتفاصيل الكاملة.

---

## 📝 **المساهمة**

1. Fork المشروع
2. أنشئ branch جديد (`git checkout -b feature/amazing`)
3. Commit التغييرات (`git commit -m 'Add amazing feature'`)
4. Push للـ branch (`git push origin feature/amazing`)
5. افتح Pull Request

---

## 📞 **الدعم**

في حالة وجود مشاكل:
1. تحقق من [TESTING_GUIDE.md](./TESTING_GUIDE.md)
2. افتح Issue في GitHub
3. اتصل بالدعم الفني

---

**تاريخ آخر تحديث:** 2026-02-14
**الإصدار:** 1.0.0
**الحالة:** 🟢 نشط ويعمل
