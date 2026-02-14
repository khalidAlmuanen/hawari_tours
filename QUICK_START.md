# 🚀 دليل التشغيل السريع - Hawari Tours

## ⚡ التشغيل العادي:

```powershell
npm run dev
```

ثم افتح: http://localhost:3000

---

## 🔧 إذا ظهرت مشكلة (Port مستخدم أو Lock error):

### الحل السريع - استخدم Script جاهز:

```powershell
.\start-clean.ps1
```

هذا الـ Script سيقوم بـ:
1. ✅ إيقاف جميع عمليات Node.js
2. ✅ حذف مجلد .next
3. ✅ تشغيل المشروع من جديد

---

## 🛠️ الحل اليدوي (إذا لم يعمل Script):

### الخطوة 1: إيقاف جميع عمليات Node.js
```powershell
Get-Process node -ErrorAction SilentlyContinue | Stop-Process -Force
```

### الخطوة 2: حذف مجلد .next (اختياري)
```powershell
Remove-Item -Path ".next" -Recurse -Force -ErrorAction SilentlyContinue
```

### الخطوة 3: تشغيل المشروع
```powershell
npm run dev
```

---

## 📱 الصفحات الرئيسية:

### للزوار:
```
http://localhost:3000              # الرئيسية
http://localhost:3000/tours        # الجولات
http://localhost:3000/news         # الأخبار
http://localhost:3000/destinations # المعالم
http://localhost:3000/contact      # التواصل
http://localhost:3000/login        # تسجيل دخول
http://localhost:3000/register     # تسجيل حساب جديد
```

### بعد تسجيل الدخول:
```
http://localhost:3000/profile      # الملف الشخصي
```

### للمدراء:
```
http://localhost:3000/admin        # Dashboard
http://localhost:3000/admin/users  # إدارة المستخدمين

حساب Admin:
Email: admin@hawari.com
Password: admin123
```

---

## 💡 نصائح:

### تجنب المشكلة من الأساس:
1. ✅ لا تشغل `npm run dev` في أكثر من Terminal
2. ✅ أغلق Terminal القديم قبل فتح جديد
3. ✅ استخدم `Ctrl+C` لإيقاف الخادم بشكل صحيح

### إذا استمرت المشكلة:
```powershell
# أعد تشغيل Cursor/VSCode
# أو استخدم:
taskkill /F /IM node.exe /T
```

---

## 🔍 للتحقق من أن الخادم يعمل:

```powershell
# تحقق من Port 3000:
netstat -ano | Select-String ":3000"

# تحقق من عمليات Node:
Get-Process node
```

---

## 📂 الملفات المهمة:

```
.env.local              # متغيرات البيئة
prisma/schema.prisma    # Database Schema
package.json            # Dependencies
README.md               # الدليل الكامل
start-clean.ps1         # Script التشغيل النظيف
```

---

**كل شيء جاهز الآن! جرّب المشروع! 🚀**
