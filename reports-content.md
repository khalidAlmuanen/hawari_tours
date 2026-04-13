# بيانات التقارير (لوحة التحكم)

## 1) التصنيفات (ReportCategory)
### الحقول الأساسية
- nameAr: الدراسات الحكومية (مطلوب)
- nameEn: Government Studies (مطلوب)
- slug: government-studies (مطلوب)
- icon: 📄
- gradient: from-gray-500 to-gray-700
- order: 0
- isActive: true

### مثال كامل
- nameAr: تقارير اليونسكو
- nameEn: UNESCO Reports
- slug: unesco-reports
- icon: 🌍
- gradient: from-emerald-500 to-teal-600
- order: 1
- isActive: true

## 2) التقارير (Report)
### الحقول الأساسية
- titleAr: تقرير حالة التنوع الحيوي في سقطرى (مطلوب)
- titleEn: Socotra Biodiversity Status Report (مطلوب)
- descriptionAr: وصف عربي تفصيلي للتقرير. (مطلوب)
- descriptionEn: Detailed English description of the report. (مطلوب)
- year: 2024 (مطلوب)
- pages: 128 (مطلوب)
- languageAr: العربية (مطلوب)
- languageEn: English (مطلوب)
- fileSize: 12.4 MB (مطلوب)
- downloadUrl: https://example.com/reports/socotra-biodiversity-2024.pdf (مطلوب)
- categoryId: <اختر من قائمة التصنيفات> (مطلوب)
- order: 0
- topicsText: اليونسكو, التنوع الحيوي, حماية البيئة
- featured: false
- isActive: true

### ملاحظات
- topicsText تُكتب مفصولة بفواصل وتُحفظ كقائمة topics.
- categoryId يجب أن يكون تصنيفًا موجودًا.

### مثال كامل
- titleAr: تقرير التراث العالمي لسقطرى 2023
- titleEn: Socotra World Heritage Report 2023
- descriptionAr: تقرير شامل عن حالة الموقع المدرج في قائمة التراث العالمي.
- descriptionEn: Comprehensive report on the World Heritage Site status.
- year: 2023
- pages: 96
- languageAr: العربية
- languageEn: English
- fileSize: 8.7 MB
- downloadUrl: https://example.com/reports/unesco-2023.pdf
- categoryId: <UNESCO Reports>
- order: 1
- topicsText: تراث عالمي, اليونسكو, حماية المواقع
- featured: true
- isActive: true

## 3) الإحصائيات (ReportStat)
### الحقول الأساسية
- number: 45
- labelAr: تقرير منشور
- labelEn: Published Reports
- icon: 📊
- gradient: from-blue-500 to-indigo-600
- order: 0
- isActive: true

### مثال كامل
- number: +120
- labelAr: صفحة بحثية
- labelEn: Research Pages
- icon: 📑
- gradient: from-purple-500 to-pink-600
- order: 2
- isActive: true

## 4) إعدادات صفحة التقارير (ReportsPageSetting)
### الحقول الأساسية
- heroBadgeEn: Reports Library
- heroBadgeAr: مكتبة التقارير
- heroTitleLine1En: Socotra
- heroTitleLine1Ar: تقارير
- heroTitleLine2En: Reports
- heroTitleLine2Ar: سقطرى
- heroSubtitleEn: UNESCO reports, government studies, NGO research, and scientific papers
- heroSubtitleAr: تقارير اليونسكو، الدراسات الحكومية، أبحاث المنظمات، والأبحاث العلمية
- primaryButtonLabelEn: Browse Reports
- primaryButtonLabelAr: تصفح التقارير
- primaryButtonLink: #reports
- secondaryButtonLabelEn: Statistics
- secondaryButtonLabelAr: الإحصائيات
- secondaryButtonLink: #statistics
- statsTitleEn: Key
- statsTitleAr: إحصائيات
- statsTitleHighlightEn: Statistics
- statsTitleHighlightAr: رئيسية
- featuredBadgeEn: Featured Reports
- featuredBadgeAr: تقارير مميزة
- featuredTitleEn: Most Important Reports
- featuredTitleAr: أهم التقارير
- allReportsTitleEn: All
- allReportsTitleAr: جميع
- allReportsTitleHighlightEn: Reports
- allReportsTitleHighlightAr: التقارير
- searchPlaceholderEn: Search for a report...
- searchPlaceholderAr: ابحث عن تقرير...
- noResultsTitleEn: No Results Found
- noResultsTitleAr: لا توجد نتائج
- noResultsTextEn: Try searching with different keywords
- noResultsTextAr: جرب البحث بكلمات مختلفة
- resetButtonLabelEn: Reset
- resetButtonLabelAr: إعادة تعيين
- downloadLabelEn: Download
- downloadLabelAr: تحميل
- reportsCountLabelEn: reports available
- reportsCountLabelAr: تقرير متاح

## 5) قسم اليونسكو (ReportsUnescoSection)
### الحقول الأساسية
- badgeEn: UNESCO World Heritage Site
- badgeAr: موقع تراث عالمي
- titleLine1En: Socotra — World
- titleLine1Ar: سقطرى — تراث
- titleLine2En: Heritage
- titleLine2Ar: عالمي
- descriptionEn: نص وصف قسم اليونسكو.
- descriptionAr: نص وصف قسم اليونسكو بالعربية.
- bulletsEn: 
  - Exceptional biodiversity
  - Global scientific importance
- bulletsAr:
  - تنوع حيوي استثنائي
  - أهمية علمية عالمية
- buttonLabelEn: Official UNESCO Page
- buttonLabelAr: موقع اليونسكو الرسمي
- buttonLink: https://whc.unesco.org/en/list/1263
- imageUrl: https://example.com/images/unesco-socotra.jpg
- isActive: true

### ملاحظات
- bulletsEn و bulletsAr تُكتب كل نقطة في سطر منفصل داخل لوحة التحكم.

## 6) قسم CTA (ReportsCtaSection)
### الحقول الأساسية
- titleEn: Have a Question?
- titleAr: هل لديك سؤال؟
- subtitleEn: For inquiries about reports or additional information, contact us
- subtitleAr: للاستفسار عن التقارير أو طلب معلومات إضافية، تواصل معنا
- primaryButtonLabelEn: Contact Us
- primaryButtonLabelAr: تواصل معنا
- primaryButtonLink: /contact
- secondaryButtonLabelEn: More About Socotra
- secondaryButtonLabelAr: المزيد عن سقطرى
- secondaryButtonLink: /about
- isActive: true
