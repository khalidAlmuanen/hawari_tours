# بيانات معلومات الاتصال (لوحة التحكم)

## 1) معلومات الشركة (Company Info)
### الحقول الأساسية
- company.nameEn: Hawarl Tours
- company.nameAr: رحلات حوار
- company.descriptionEn: Discover the wonders of Yemen
- company.descriptionAr: اكتشف عجائب اليمن
- company.logo: https://example.com/logo.png

## 2) بيانات التواصل (Contact Details)
### البريد الإلكتروني
- contact.emails.info: info@hawarl.com
- contact.emails.support: support@hawarl.com
- contact.emails.booking: booking@hawarl.com

### أرقام الهاتف
- contact.phones.primary: +967 1 234 567
- contact.phones.secondary: +967 7 890 123
- contact.phones.whatsapp: +967 777 123 456

### العناوين (قائمة قابلة للتكرار)
كل عنوان يحتوي على الحقول التالية:
- id: 1
- titleEn: Main Office
- titleAr: المكتب الرئيسي
- addressEn: Sana'a, Yemen
- addressAr: صنعاء، اليمن
- lat: 15.3694
- lng: 44.1910
- mapUrl: https://maps.google.com/...

#### مثال عنوان إضافي
- id: 2
- titleEn: Airport Office
- titleAr: مكتب المطار
- addressEn: Socotra Airport, Yemen
- addressAr: مطار سقطرى، اليمن
- lat: 12.6300
- lng: 53.9100
- mapUrl: https://maps.google.com/...

## 3) ساعات العمل (Working Hours)
### أيام العمل
- workingHours.weekdays.daysEn: Sunday - Thursday
- workingHours.weekdays.daysAr: الأحد - الخميس
- workingHours.weekdays.openEn: 9:00 AM - 6:00 PM
- workingHours.weekdays.openAr: 9:00 ص - 6:00 م

### عطلة نهاية الأسبوع
- workingHours.weekend.daysEn: Saturday
- workingHours.weekend.daysAr: السبت
- workingHours.weekend.openEn: 10:00 AM - 2:00 PM
- workingHours.weekend.openAr: 10:00 ص - 2:00 م

### أيام الإغلاق
- workingHours.closedEn: Friday
- workingHours.closedAr: الجمعة

## 4) وسائل التواصل الاجتماعي (Social Media)
كل منصة تحتوي على الحقول التالية:
- url: https://facebook.com/hawarl
- followers: 15000
- active: true

### المنصات المتاحة
- socialMedia.facebook
- socialMedia.instagram
- socialMedia.twitter
- socialMedia.youtube
- socialMedia.tiktok
- socialMedia.linkedin

#### مثال لكل منصة
- socialMedia.facebook.url: https://facebook.com/hawarl
- socialMedia.facebook.followers: 15000
- socialMedia.facebook.active: true

- socialMedia.instagram.url: https://instagram.com/hawarl
- socialMedia.instagram.followers: 22000
- socialMedia.instagram.active: true

- socialMedia.twitter.url: https://x.com/hawarl
- socialMedia.twitter.followers: 8000
- socialMedia.twitter.active: true

- socialMedia.youtube.url: https://youtube.com/@hawarl
- socialMedia.youtube.followers: 12000
- socialMedia.youtube.active: true

- socialMedia.tiktok.url: https://tiktok.com/@hawarl
- socialMedia.tiktok.followers: 30000
- socialMedia.tiktok.active: true

- socialMedia.linkedin.url: https://linkedin.com/company/hawarl
- socialMedia.linkedin.followers: 4000
- socialMedia.linkedin.active: false
