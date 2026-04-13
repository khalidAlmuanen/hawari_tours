# ⚙️ دليل صفحة الإعدادات - Settings Guide

## 🎉 تم إنشاء صفحة الإعدادات بنجاح!

### 🔗 الوصول للصفحة:
```
http://localhost:3000/admin/settings
```

أو من **Sidebar** في Admin Panel → **⚙️ الإعدادات / Settings**

---

## 📋 الأقسام (6 Tabs):

### 1️⃣ **General** 🏢 - الإعدادات العامة
- ✅ اسم الموقع (English & Arabic)
- ✅ وصف الموقع (English & Arabic)
- ✅ البريد الإلكتروني للتواصل
- ✅ رقم الهاتف
- ✅ العنوان (English & Arabic)

**مثال:**
```
Site Name: Hawari Tours
اسم الموقع: رحلات الحواري
Description: Discover the beauty of Socotra Island
الوصف: اكتشف جمال جزيرة سقطرى
Email: info@hawaritours.com
Phone: +967 xxx xxx xxx
```

---

### 2️⃣ **Social Media** 📱 - وسائل التواصل
- ✅ Facebook - رابط صفحة الفيسبوك
- ✅ Instagram - رابط الإنستغرام
- ✅ Twitter (X) - رابط تويتر
- ✅ YouTube - رابط قناة اليوتيوب
- ✅ WhatsApp - رقم الواتساب

**مثال:**
```
Facebook:  https://facebook.com/hawaritours
Instagram: https://instagram.com/hawaritours
Twitter:   https://twitter.com/hawaritours
YouTube:   https://youtube.com/@hawaritours
WhatsApp:  +967 xxx xxx xxx
```

---

### 3️⃣ **Booking** 📅 - إعدادات الحجوزات
- ✅ **Currency** - العملة (USD, EUR, GBP, YER)
- ✅ **Tax Rate** - نسبة الضريبة (%)
- ✅ **Minimum Booking Days** - الحد الأدنى للحجز (أيام)
- ✅ **Maximum Booking Days** - الحد الأقصى للحجز (أيام)
- ✅ **Free Cancellation Days** - أيام الإلغاء المجاني

**مثال:**
```
Currency:           USD
Tax Rate:           0% (أو 5%)
Min Booking:        1 day
Max Booking:        30 days
Cancellation:       7 days (إلغاء مجاني قبل 7 أيام)
```

**💡 كيف تعمل:**
- إذا حجز شخص جولة، يمكنه الإلغاء مجاناً قبل 7 أيام
- بعد 7 أيام، يخضع للشروط والأحكام

---

### 4️⃣ **Email** 📧 - إعدادات البريد
⚠️ **تنبيه أمني:** استخدم App Password وليس كلمة المرور الأساسية!

- ✅ **Enable Email** - تفعيل إرسال البريد
- ✅ **SMTP Host** - خادم البريد (مثل: smtp.gmail.com)
- ✅ **SMTP Port** - المنفذ (587 لـ TLS)
- ✅ **Username** - البريد الإلكتروني
- ✅ **Password** - كلمة المرور أو App Password

**للاستخدام مع Gmail:**
```
1. اذهب إلى: https://myaccount.google.com/apppasswords
2. أنشئ App Password جديد
3. انسخ الكود المكون من 16 حرف
4. استخدمه في حقل Password
```

**إعدادات Gmail:**
```
Host:     smtp.gmail.com
Port:     587
User:     your-email@gmail.com
Password: xxxx xxxx xxxx xxxx (App Password)
```

---

### 5️⃣ **Notifications** 🔔 - الإشعارات
Toggle switches لتفعيل/تعطيل الإشعارات:

- ✅ **Booking Notifications** 📅
  - إشعار عند حجز جديد
  
- ✅ **Message Notifications** 💬
  - إشعار عند رسالة جديدة
  
- ✅ **Review Notifications** ⭐
  - إشعار عند تقييم جديد

**كيف تعمل:**
- ON (أزرق) = ستتلقى إشعارات
- OFF (رمادي) = لن تتلقى إشعارات

---

### 6️⃣ **Maintenance** 🔧 - وضع الصيانة
⚠️ **تحذير!** عند تفعيل هذا الوضع، الزوار لن يتمكنوا من الوصول للموقع!

- ✅ **Enable Maintenance Mode**
  - Toggle كبير أحمر
  
- ✅ **Maintenance Message (English)**
  - الرسالة التي ستظهر للزوار بالإنجليزية
  
- ✅ **Maintenance Message (Arabic)**
  - الرسالة التي ستظهر للزوار بالعربية

**مثال للرسالة:**
```
English: We are currently performing maintenance. 
         Please check back soon.

Arabic:  نقوم حالياً بأعمال صيانة. 
         يرجى العودة قريباً.
```

**📝 ملاحظة مهمة:**
- المدراء (Admins) يمكنهم الوصول للموقع حتى أثناء الصيانة
- المستخدمون العاديون سيشاهدون رسالة الصيانة فقط

---

## 📊 Stats Cards في الأعلى:

### 💰 Currency
- يعرض العملة الحالية

### 📊 Tax
- يعرض نسبة الضريبة الحالية

### 🔧 Maintenance
- **ON** (أحمر) = وضع الصيانة نشط
- **OFF** (بنفسجي) = الموقع يعمل عادياً

### 🔔 Notifications
- يعرض عدد الإشعارات المفعّلة (مثلاً: 3 من 3)

---

## 💾 حفظ الإعدادات:

### زر "Save Settings" في الأسفل:
```
💾 حفظ الإعدادات / Save Settings
```

**ماذا يحدث عند الحفظ:**
1. ✅ يتم حفظ جميع التغييرات في **localStorage**
2. ✅ ظهور رسالة نجاح: "تم حفظ الإعدادات بنجاح! ✅"
3. ✅ يمكنك استخدام الإعدادات فوراً

**💡 ملاحظة للتطوير:**
- حالياً يتم الحفظ في localStorage
- يمكن إضافة API endpoint لحفظها في Database لاحقاً:
  ```javascript
  POST /api/admin/settings
  Body: { ...allSettings }
  ```

---

## 🎨 التصميم:

### المميزات:
- ✅ **Tabs Navigation** - تنقل سهل بين الأقسام
- ✅ **Stats Cards** مع Gradients ملونة
- ✅ **Toggle Switches** احترافية
- ✅ **Input Fields** مع Focus States
- ✅ **Framer Motion** Animations
- ✅ **Dark Mode** Support
- ✅ **RTL/LTR** Support
- ✅ **Responsive** 100%

### الألوان:
```
Tabs Active:     Blue to Purple Gradient
Stats Cards:     Blue, Green, Red/Purple, Orange
Toggle ON:       Blue (Notifications) / Red (Maintenance)
Toggle OFF:      Gray
Save Button:     Blue to Purple Gradient
```

---

## 🔍 كيف تستخدم الإعدادات في الموقع:

### في أي Component:
```javascript
// 1. اجلب الإعدادات من localStorage
const settings = JSON.parse(localStorage.getItem('admin-settings'))

// 2. استخدمها
const siteName = settings?.siteName || 'Hawari Tours'
const currency = settings?.currency || 'USD'
const taxRate = settings?.taxRate || 0
```

### مثال في Footer:
```javascript
const Footer = () => {
  const settings = JSON.parse(localStorage.getItem('admin-settings'))
  
  return (
    <footer>
      <h3>{settings?.siteName}</h3>
      <p>{settings?.siteDescription}</p>
      <p>Email: {settings?.contactEmail}</p>
      <p>Phone: {settings?.contactPhone}</p>
      
      {/* Social Links */}
      {settings?.facebook && (
        <a href={settings.facebook}>Facebook</a>
      )}
    </footer>
  )
}
```

---

## 🚀 للمستقبل - تحسينات محتملة:

### 1. حفظ في Database:
```javascript
// إنشاء جدول Settings في Prisma
model Settings {
  id        String   @id @default(cuid())
  key       String   @unique
  value     String
  updatedAt DateTime @updatedAt
}

// API Route
POST /api/admin/settings
- حفظ كل إعداد في Database
- استرجاع عند تحميل الصفحة
```

### 2. إضافة أقسام جديدة:
- **SEO Settings** - Meta tags, OG images, etc.
- **Payment Settings** - Stripe, PayPal, etc.
- **Analytics** - Google Analytics, Facebook Pixel
- **Theme Settings** - Colors, Fonts, etc.

### 3. Import/Export:
- **Export** - حفظ الإعدادات في ملف JSON
- **Import** - استيراد إعدادات من ملف
- **Reset** - إعادة تعيين للإعدادات الافتراضية

---

## ✅ الملف:

```
📂 app/admin/settings/page.jsx
- 700+ lines
- 6 Tabs
- Stats Cards
- Toggle Switches
- Fully Functional
- Professional Design
```

---

## 🎯 النتيجة:

**صفحة الإعدادات الآن:**
- ✅ **احترافية جداً** - تصميم عصري ومبهر
- ✅ **متكاملة** - جميع الإعدادات الأساسية موجودة
- ✅ **سهلة الاستخدام** - UI بسيط وواضح
- ✅ **Responsive** - تعمل على كل الشاشات
- ✅ **مع Animations** - حركات سلسة
- ✅ **RTL/LTR** - تدعم العربية والإنجليزية

---

**جرّبها الآن! 🚀**

```
http://localhost:3000/admin/settings
```

**من Sidebar → ⚙️ الإعدادات**
