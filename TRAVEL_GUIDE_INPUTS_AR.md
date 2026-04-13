# قالب البيانات المطلوب تعبئتها لدليل السفر (احترافي 100%)

هذا الملف يوضح بدقة البيانات التي تحتاج تعبئتها في لوحة التحكم حتى يظهر دليل السفر بشكل احترافي ومتكامل.

مسار لوحة التحكم: /admin/travel-guide

---

## 1) الإعدادات العامة (Settings)
**Hero**
- رابط صورة الغلاف: heroImage
- العنوان الرئيسي: heroTitleEn, heroTitleAr
- العنوان الفرعي: heroSubtitleEn, heroSubtitleAr

**عناوين الإقامة**
- accommodationTitleEn, accommodationTitleAr
- accommodationSubtitleEn, accommodationSubtitleAr

**عناوين الأمتعة**
- packingTitleEn, packingTitleAr
- packingSubtitleEn, packingSubtitleAr

**عناوين السلامة**
- safetyTitleEn, safetyTitleAr
- safetySubtitleEn, safetySubtitleAr
- safetyHeadlineEn, safetyHeadlineAr
- safetyHighlightEn, safetyHighlightAr

**CTA**
- ctaTitleEn, ctaTitleAr
- ctaSubtitleEn, ctaSubtitleAr
- ctaPrimaryLabelEn, ctaPrimaryLabelAr
- ctaPrimaryUrl
- ctaSecondaryLabelEn, ctaSecondaryLabelAr
- ctaSecondaryUrl
- ctaWhatsappLabelEn, ctaWhatsappLabelAr
- ctaWhatsappUrl

---

## 2) نصائح سريعة (Quick Tips)
لكل نصيحة:
- icon
- titleEn, titleAr
- descriptionEn, descriptionAr
- gradient
- order
- isActive

---

## 3) التأشيرات (Visa)
**عناوين القسم**
- sectionTitleEn, sectionTitleAr
- headlineEn, headlineAr
- headlineHighlightEn, headlineHighlightAr
- requirementsTitleEn, requirementsTitleAr

**متطلبات التأشيرة (قائمة)**
لكل متطلب:
- icon
- itemEn, itemAr
- order
- isActive

---

## 4) النقل والمواصلات (Transport)
**عناوين القسم**
- sectionTitleEn, sectionTitleAr
- flightsTitleEn, flightsTitleAr
- flightsSubtitleEn, flightsSubtitleAr
- localTitleEn, localTitleAr

**نصائح الحجز (قائمة)**
- flightTips: كل سطر نصيحة بالعربي وكل سطر مناظر بالإنجليزي

**الرحلات الجوية (Flights)**
لكل رحلة:
- fromEn, fromAr
- airline
- duration
- frequencyEn, frequencyAr
- price
- icon
- gradient

**النقل المحلي (Local)**
لكل خيار:
- typeEn, typeAr
- descriptionEn, descriptionAr
- priceEn, priceAr
- icon
- gradient

---

## 5) الإقامة (Accommodation)
لكل نوع إقامة:
- typeEn, typeAr
- descriptionEn, descriptionAr
- priceEn, priceAr
- rating (1-5)
- icon
- gradient
- featuresEn (كل سطر ميزة)
- featuresAr (كل سطر ميزة)
- examples (كل سطر بالشكل: Name|Location|Stars)

---

## 6) أفضل وقت للزيارة (Best Time)
**عناوين القسم**
- sectionTitleEn, sectionTitleAr
- sectionSubtitleEn, sectionSubtitleAr
- headlineEn, headlineAr
- headlineHighlightEn, headlineHighlightAr

**موسم الذروة**
- peakSeasonEn, peakSeasonAr
- peakProsEn (كل سطر ميزة)
- peakProsAr (كل سطر ميزة)
- peakConsEn (كل سطر عيب)
- peakConsAr (كل سطر عيب)

**الموسم المنخفض**
- offSeasonEn, offSeasonAr
- offProsEn (كل سطر ميزة)
- offProsAr (كل سطر ميزة)
- offConsEn (كل سطر عيب)
- offConsAr (كل سطر عيب)

---

## 7) السلامة (Safety)
لكل نصيحة:
- icon
- titleEn, titleAr
- descriptionEn, descriptionAr
- category (HEALTH / SECURITY / ENVIRONMENT / CULTURE / WEATHER / WATER / TRANSPORT / WILDLIFE)
- order
ملاحظات العرض في الصفحة:
- الأيقونة والعنوان والوصف تظهر مباشرة في قسم السلامة.
- يتم تجميع النصائح حسب category وترتيبها حسب order.

---

## 8) أرقام الطوارئ (Emergency)
لكل جهة:
- nameEn, nameAr
- number
- icon

---

## 9) قائمة الأمتعة (Packing List)
لكل فئة:
- categoryEn, categoryAr
- icon
- itemsEn (كل سطر عنصر)
- itemsAr (كل سطر عنصر)

---

## توصيات احترافية سريعة
- استخدم لغة عربية فصيحة ومباشرة بدون مبالغة.
- اجعل كل حقل عربي يقابله إنجليزي بنفس المعنى.
- ركّز على أمثلة محلية خاصة بسقطرى.
- استخدم أيقونات Emoji واضحة ومناسبة للمحتوى.

---

# بيانات مقترحة جاهزة للإضافة (شاملة)

## 1) الإعدادات العامة (Settings) — قيم مقترحة
- heroImage: https://images.unsplash.com/photo-1500530855697-b586d89ba3ee
- heroTitleEn: Travel Guide
- heroTitleAr: دليل السفر
- heroSubtitleEn: Everything you need before visiting Socotra
- heroSubtitleAr: كل ما تحتاجه قبل زيارة سقطرى
- accommodationTitleEn: Accommodation Options
- accommodationTitleAr: خيارات الإقامة
- accommodationSubtitleEn: From hotels to eco-camping
- accommodationSubtitleAr: من الفنادق إلى التخييم البيئي
- packingTitleEn: Packing List
- packingTitleAr: قائمة الأمتعة
- packingSubtitleEn: Essentials for a smooth trip
- packingSubtitleAr: أهم المستلزمات لرحلة مريحة
- safetyTitleEn: Safety Tips
- safetyTitleAr: نصائح السلامة
- safetySubtitleEn: Practical guidance for safe travel
- safetySubtitleAr: إرشادات عملية لرحلة آمنة
- safetyHeadlineEn: Your Safety
- safetyHeadlineAr: سلامتك
- safetyHighlightEn: First
- safetyHighlightAr: أولاً
- ctaTitleEn: Plan Your Socotra Trip
- ctaTitleAr: خطط رحلتك إلى سقطرى
- ctaSubtitleEn: We are ready to help you build a perfect itinerary
- ctaSubtitleAr: نحن جاهزون لمساعدتك في إعداد برنامج مثالي
- ctaPrimaryLabelEn: Contact Us
- ctaPrimaryLabelAr: تواصل معنا
- ctaPrimaryUrl: https://wa.me/967000000000
- ctaSecondaryLabelEn: View Tours
- ctaSecondaryLabelAr: عرض الجولات
- ctaSecondaryUrl: /tours
- ctaWhatsappLabelEn: WhatsApp
- ctaWhatsappLabelAr: واتساب
- ctaWhatsappUrl: https://wa.me/967000000000

---

## 2) نصائح سريعة (Quick Tips) — أمثلة متعددة
1) icon: 🌤️
   titleEn: Best Season
   titleAr: أفضل موسم
   descriptionEn: October to April has the mildest weather
   descriptionAr: من أكتوبر إلى أبريل الطقس ألطف
   gradient: from-blue-500 to-cyan-600
   order: 1
   isActive: true
2) icon: 📱
   titleEn: Local SIM
   titleAr: شريحة محلية
   descriptionEn: Buy a SIM in Hadiboh for basic coverage
   descriptionAr: اشترِ شريحة محلية في حديبو لتغطية أساسية
   gradient: from-purple-500 to-pink-600
   order: 2
   isActive: true
3) icon: 💵
   titleEn: Cash First
   titleAr: الكاش أولاً
   descriptionEn: ATMs are rare, carry enough cash
   descriptionAr: أجهزة الصراف قليلة، احمل مبلغاً كافياً
   gradient: from-green-500 to-emerald-600
   order: 3
   isActive: true
4) icon: 🧭
   titleEn: Local Guide
   titleAr: مرشد محلي
   descriptionEn: A local guide makes remote areas safer
   descriptionAr: المرشد المحلي يجعل المناطق البعيدة أكثر أماناً
   gradient: from-orange-500 to-red-600
   order: 4
   isActive: true

---

## 3) التأشيرات (Visa) — أمثلة
**عناوين القسم**
- sectionTitleEn: Visa Requirements
- sectionTitleAr: متطلبات التأشيرة
- headlineEn: Visa
- headlineAr: التأشيرة
- headlineHighlightEn: Information
- headlineHighlightAr: المعلومات
- requirementsTitleEn: Required Documents
- requirementsTitleAr: الوثائق المطلوبة

**متطلبات التأشيرة (قائمة)**
1) icon: 🛂
   itemEn: Valid passport (6 months)
   itemAr: جواز سفر صالح (6 أشهر)
   order: 1
   isActive: true
2) icon: 🧾
   itemEn: Visa application form
   itemAr: نموذج طلب التأشيرة
   order: 2
   isActive: true
3) icon: 📸
   itemEn: Passport photo
   itemAr: صورة جواز
   order: 3
   isActive: true

---

## 4) النقل والمواصلات (Transport) — أمثلة
**عناوين القسم**
- sectionTitleEn: Transportation
- sectionTitleAr: النقل والمواصلات
- flightsTitleEn: Flights to Socotra
- flightsTitleAr: الرحلات إلى سقطرى
- flightsSubtitleEn: Limited flights, book early
- flightsSubtitleAr: رحلات محدودة، احجز مبكراً
- localTitleEn: Local Transport
- localTitleAr: النقل المحلي

**نصائح الحجز (قائمة)**
- احجز مبكراً خلال موسم الذروة
- Confirm baggage allowance before travel
- تجنب تغيير الحجوزات في آخر لحظة

**الرحلات الجوية (Flights)**
1) fromEn: Abu Dhabi
   fromAr: أبوظبي
   airline: Air Arabia
   duration: 2h 15m
   frequencyEn: Weekly
   frequencyAr: أسبوعياً
   price: $250-400
   icon: ✈️
   gradient: from-blue-500 to-indigo-600
2) fromEn: Cairo
   fromAr: القاهرة
   airline: Yemenia
   duration: 4h 30m
   frequencyEn: Seasonal
   frequencyAr: موسمي
   price: $300-450
   icon: 🛫
   gradient: from-cyan-500 to-blue-600

**النقل المحلي (Local)**
1) typeEn: 4x4 Jeeps
   typeAr: سيارات دفع رباعي
   descriptionEn: Best for rugged terrain and valleys
   descriptionAr: الأنسب للطرق الوعرة والأودية
   priceEn: $80-120/day
   priceAr: 80-120 دولار/يوم
   icon: 🚙
   gradient: from-green-500 to-emerald-600
   featuresEn: Air-conditioned, Local driver, Fuel included
   featuresAr: مكيف, سائق محلي, الوقود مشمول
2) typeEn: Boats
   typeAr: القوارب
   descriptionEn: For beaches and island trips
   descriptionAr: للوصول للشواطئ والجزر
   priceEn: $100-250/trip
   priceAr: 100-250 دولار/رحلة
   icon: ⛵
   gradient: from-blue-500 to-cyan-600
   featuresEn: Coastal routes, Marine guide, Weather dependent
   featuresAr: مسارات ساحلية, مرشد بحري, حسب الطقس

---

## 5) الإقامة (Accommodation) — أمثلة
1) typeEn: Hotels
   typeAr: فنادق
   descriptionEn: Basic hotels in Hadiboh and main towns
   descriptionAr: فنادق بسيطة في حديبو والمدن الرئيسية
   priceEn: $50-120/night
   priceAr: 50-120 دولار/ليلة
   rating: 3
   icon: 🏨
   gradient: from-blue-500 to-indigo-600
   featuresEn: Air-conditioned rooms, WiFi, Restaurant, Parking
   featuresAr: غرف مكيفة, واي فاي, مطعم, موقف سيارات
   examples:
   - nameEn: Socotra Hotel | nameAr: فندق سقطرى | locationEn: Hadiboh | locationAr: حديبو | stars: 3
   - nameEn: Summerland Hotel | nameAr: فندق سمرلاند | locationEn: Hadiboh | locationAr: حديبو | stars: 2
2) typeEn: Eco-Lodges
   typeAr: نزل بيئية
   descriptionEn: Eco-friendly stays in natural locations
   descriptionAr: إقامة صديقة للبيئة بمواقع طبيعية
   priceEn: $70-150/night
   priceAr: 70-150 دولار/ليلة
   rating: 4
   icon: 🏡
   gradient: from-green-500 to-emerald-600
   featuresEn: Solar power, Local food, Scenic views
   featuresAr: طاقة شمسية, طعام محلي, إطلالات طبيعية
   examples:
   - nameEn: Dihamri Lodge | nameAr: نزل دهامري | locationEn: Dihamri | locationAr: دهامري | stars: 4

---

## 6) الوقت المناسب (Best Time) — أمثلة
- peakSeasonEn: Peak Season
- peakSeasonAr: موسم الذروة
- peakProsEn: Mild temperatures | Clear skies | Best marine visibility
- peakProsAr: درجات حرارة معتدلة | سماء صافية | أفضل رؤية بحرية
- peakConsEn: Higher prices | Busy spots
- peakConsAr: أسعار أعلى | ازدحام المواقع
- offSeasonEn: Off Season
- offSeasonAr: موسم منخفض
- offProsEn: Lower prices | Fewer visitors
- offProsAr: أسعار أقل | زوار أقل
- offConsEn: Rough seas | Limited services
- offConsAr: بحر هائج | خدمات محدودة

---

## 7) السلامة (Safety) — أمثلة كثيرة
**HEALTH**
1) icon: 🧼
   titleEn: Wash hands regularly
   titleAr: اغسل يديك بانتظام
   descriptionEn: Use soap or sanitizer after excursions
   descriptionAr: استخدم الصابون أو المعقم بعد الرحلات
   category: HEALTH
   order: 1
2) icon: 💊
   titleEn: Carry basic meds
   titleAr: احمل أدوية أساسية
   descriptionEn: Painkillers and rehydration salts are useful
   descriptionAr: مسكنات وأملاح تعويض السوائل مفيدة
   category: HEALTH
   order: 2

**SECURITY**
1) icon: 🔒
   titleEn: Keep valuables safe
   titleAr: احفظ مقتنياتك الثمينة
   descriptionEn: Use a small day bag and avoid exposure
   descriptionAr: استخدم حقيبة يومية وتجنب إظهار المقتنيات
   category: SECURITY
   order: 1
2) icon: 👮
   titleEn: Follow local advice
   titleAr: اتبع نصائح المحليين
   descriptionEn: Ask guides before visiting remote areas
   descriptionAr: اسأل المرشد قبل زيارة المناطق البعيدة
   category: SECURITY
   order: 2

**ENVIRONMENT**
1) icon: 🌿
   titleEn: Respect nature reserves
   titleAr: احترم المحميات الطبيعية
   descriptionEn: Stay on marked paths
   descriptionAr: التزم بالمسارات المحددة
   category: ENVIRONMENT
   order: 1
2) icon: 🚯
   titleEn: No littering
   titleAr: لا ترمِ النفايات
   descriptionEn: Carry a small bag for trash
   descriptionAr: احمل كيساً صغيراً للنفايات
   category: ENVIRONMENT
   order: 2

**CULTURE**
1) icon: 🕌
   titleEn: Dress modestly in towns
   titleAr: التزم بالاحتشام في المدن
   descriptionEn: Especially when visiting markets
   descriptionAr: خصوصاً عند زيارة الأسواق
   category: CULTURE
   order: 1
2) icon: 🤝
   titleEn: Ask before photos
   titleAr: اطلب الإذن قبل التصوير
   descriptionEn: Respect local privacy
   descriptionAr: احترم خصوصية السكان
   category: CULTURE
   order: 2

**WEATHER**
1) icon: 🌡️
   titleEn: Pack light layers
   titleAr: احمل طبقات خفيفة
   descriptionEn: Temperatures drop at night
   descriptionAr: تنخفض الحرارة ليلاً
   category: WEATHER
   order: 1
2) icon: ⛈️
   titleEn: Check wind updates
   titleAr: تابع تحديثات الرياح
   descriptionEn: Strong winds affect boat trips
   descriptionAr: الرياح القوية تؤثر على القوارب
   category: WEATHER
   order: 2

**WATER**
1) icon: 🌊
   titleEn: Swim with guides
   titleAr: اسبح مع مرشدين
   descriptionEn: Currents can be strong in some beaches
   descriptionAr: التيارات قد تكون قوية في بعض الشواطئ
   category: WATER
   order: 1
2) icon: 🥤
   titleEn: Drink safe water
   titleAr: اشرب مياه آمنة
   descriptionEn: Use bottled or filtered water
   descriptionAr: استخدم مياه معبأة أو مفلترة
   category: WATER
   order: 2

**TRANSPORT**
1) icon: 🚗
   titleEn: Seat belts on
   titleAr: اربط حزام الأمان
   descriptionEn: Roads are rough in some areas
   descriptionAr: الطرق وعرة في بعض المناطق
   category: TRANSPORT
   order: 1
2) icon: 🧭
   titleEn: Keep offline maps
   titleAr: احتفظ بخرائط بدون إنترنت
   descriptionEn: Signal may be limited
   descriptionAr: التغطية قد تكون ضعيفة
   category: TRANSPORT
   order: 2

**WILDLIFE**
1) icon: 🦂
   titleEn: Watch for scorpions
   titleAr: انتبه للعقارب
   descriptionEn: Check shoes before wearing
   descriptionAr: افحص الحذاء قبل ارتدائه
   category: WILDLIFE
   order: 1
2) icon: 🦟
   titleEn: Use insect repellent
   titleAr: استخدم طارد الحشرات
   descriptionEn: Especially near water
   descriptionAr: خصوصاً قرب المياه
   category: WILDLIFE
   order: 2

---

## 8) أرقام الطوارئ (Emergency) — أمثلة
1) nameEn: Police
   nameAr: الشرطة
   number: 199
   icon: 👮
2) nameEn: Ambulance
   nameAr: الإسعاف
   number: 191
   icon: 🚑
3) nameEn: Coast Guard
   nameAr: خفر السواحل
   number: 177
   icon: 🚤

---

## 9) قائمة الأمتعة (Packing List) — أمثلة
1) categoryEn: Clothing
   categoryAr: الملابس
   icon: 👕
   itemsEn: Light jacket | Hat | Comfortable shoes
   itemsAr: جاكيت خفيف | قبعة | أحذية مريحة
2) categoryEn: Health
   categoryAr: الصحة
   icon: 🩺
   itemsEn: Sunscreen | Basic meds | Insect repellent
   itemsAr: واقي شمس | أدوية أساسية | طارد حشرات
3) categoryEn: Tech
   categoryAr: التقنية
   icon: 🔌
   itemsEn: Power bank | Camera | Travel adapter
   itemsAr: شاحن متنقل | كاميرا | محول كهرباء
