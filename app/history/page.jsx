'use client'

// ═══════════════════════════════════════════════════════════════════════
// 📜 History Page - Socotra (المرحلة 6)
// ✅ متطلبات PDF:
//    1. Ancient History (التاريخ القديم)
//    2. Colonial Era (العصر الاستعماري)
//    3. Modern Socotra (سقطرى الحديثة)
//    4. Archaeological Sites (المواقع الأثرية)
// ✨ تصميم احترافي جداً مع Timeline تفاعلي
// ═══════════════════════════════════════════════════════════════════════

import { useState } from 'react'
import { useApp } from '@/contexts/AppContext'
import WhatsAppButton from '@/components/WhatsAppButton'

export default function HistoryPage() {
  const { locale, isDark } = useApp()
  const isAr = locale === 'ar'

  const [activeEra, setActiveEra] = useState('ancient')
  const [selectedSite, setSelectedSite] = useState(null)

  // ═══════════════════════════════════════════════════════════════
  // Timeline Data - خط زمني تفاعلي
  // ═══════════════════════════════════════════════════════════════
  const timeline = [
    {
      id: 'prehistoric',
      year: '20M BCE',
      era: 'ancient',
      title: { ar: 'الانفصال الجيولوجي', en: 'Geological Separation' },
      description: {
        ar: 'انفصلت سقطرى عن القارة الأفريقية قبل 20 مليون سنة، مما أدى إلى تطور حياة فريدة',
        en: 'Socotra separated from Africa 20 million years ago, leading to unique evolution'
      },
      icon: '🌍',
      color: 'from-blue-500 to-cyan-600'
    },
    {
      id: 'ancient1',
      year: '1000 BCE',
      era: 'ancient',
      title: { ar: 'الحضارات القديمة', en: 'Ancient Civilizations' },
      description: {
        ar: 'سكنت سقطرى قبائل قديمة تعيش على صيد الأسماك والرعي',
        en: 'Ancient tribes inhabited Socotra, living on fishing and herding'
      },
      icon: '🏺',
      color: 'from-amber-500 to-orange-600'
    },
    {
      id: 'ancient2',
      year: '1st Century',
      era: 'ancient',
      title: { ar: 'التجارة البحرية', en: 'Maritime Trade' },
      description: {
        ar: 'ذُكرت سقطرى في كتابات يونانية ورومانية كمركز تجاري مهم لتجارة البخور',
        en: 'Socotra mentioned in Greek and Roman writings as important incense trade center'
      },
      icon: '⛵',
      color: 'from-purple-500 to-pink-600'
    },
    {
      id: 'islamic',
      year: '7th Century',
      era: 'ancient',
      title: { ar: 'الإسلام', en: 'Islamic Era' },
      description: {
        ar: 'دخل الإسلام إلى سقطرى وأصبح دين السكان الرئيسي',
        en: 'Islam arrived in Socotra and became the main religion'
      },
      icon: '☪️',
      color: 'from-green-500 to-emerald-600'
    },
    {
      id: 'portuguese',
      year: '1507',
      era: 'colonial',
      title: { ar: 'الاحتلال البرتغالي', en: 'Portuguese Occupation' },
      description: {
        ar: 'احتل البرتغاليون سقطرى لفترة قصيرة كجزء من توسعهم في المحيط الهندي',
        en: 'Portuguese occupied Socotra briefly as part of Indian Ocean expansion'
      },
      icon: '⚔️',
      color: 'from-red-500 to-rose-600'
    },
    {
      id: 'mahra',
      year: '16th-19th',
      era: 'colonial',
      title: { ar: 'سلطنة المهرة', en: 'Mahra Sultanate' },
      description: {
        ar: 'حكمت سلطنة المهرة سقطرى لعدة قرون',
        en: 'Mahra Sultanate ruled Socotra for several centuries'
      },
      icon: '👑',
      color: 'from-yellow-500 to-amber-600'
    },
    {
      id: 'british',
      year: '1886',
      era: 'colonial',
      title: { ar: 'الحماية البريطانية', en: 'British Protectorate' },
      description: {
        ar: 'أصبحت سقطرى تحت الحماية البريطانية',
        en: 'Socotra became under British protection'
      },
      icon: '🇬🇧',
      color: 'from-indigo-500 to-blue-600'
    },
    {
      id: 'independence',
      year: '1967',
      era: 'modern',
      title: { ar: 'الاستقلال', en: 'Independence' },
      description: {
        ar: 'أصبحت سقطرى جزءاً من جمهورية اليمن الجنوبية بعد استقلالها عن بريطانيا',
        en: 'Socotra became part of South Yemen after independence from Britain'
      },
      icon: '🇾🇪',
      color: 'from-red-500 to-red-700'
    },
    {
      id: 'unity',
      year: '1990',
      era: 'modern',
      title: { ar: 'الوحدة اليمنية', en: 'Yemeni Unity' },
      description: {
        ar: 'انضمت سقطرى إلى اليمن الموحد',
        en: 'Socotra joined unified Yemen'
      },
      icon: '🤝',
      color: 'from-green-500 to-teal-600'
    },
    {
      id: 'unesco',
      year: '2008',
      era: 'modern',
      title: { ar: 'تراث عالمي', en: 'World Heritage' },
      description: {
        ar: 'أدرجت اليونسكو سقطرى كموقع تراث عالمي',
        en: 'UNESCO inscribed Socotra as World Heritage Site'
      },
      icon: '🏛️',
      color: 'from-blue-500 to-purple-600'
    },
    {
      id: 'today',
      year: '2024',
      era: 'modern',
      title: { ar: 'سقطرى اليوم', en: 'Socotra Today' },
      description: {
        ar: 'سقطرى وجهة سياحية بيئية مع الحفاظ على تراثها الطبيعي والثقافي',
        en: 'Socotra as eco-tourism destination preserving natural and cultural heritage'
      },
      icon: '🌿',
      color: 'from-emerald-500 to-green-600'
    }
  ]

  // ═══════════════════════════════════════════════════════════════
  // Archaeological Sites Data
  // ═══════════════════════════════════════════════════════════════
  const archaeologicalSites = [
    {
      id: 1,
      name: { ar: 'كهف هوق', en: 'Hoq Cave' },
      period: { ar: 'ما قبل التاريخ - القرن الأول', en: 'Prehistoric - 1st Century' },
      description: {
        ar: 'كهف مقدس يحتوي على نقوش قديمة بعدة لغات بما فيها اليونانية والسنسكريتية والسقطرية القديمة',
        en: 'Sacred cave containing ancient inscriptions in multiple languages including Greek, Sanskrit, and Old Soqotri'
      },
      significance: {
        ar: 'دليل على التبادل التجاري والثقافي القديم',
        en: 'Evidence of ancient trade and cultural exchange'
      },
      location: { ar: 'شرق الجزيرة', en: 'East of the island' },
      access: { ar: 'متاح للزيارة مع مرشد', en: 'Accessible with guide' },
      gradient: 'from-amber-500 to-orange-600'
    },
    {
      id: 2,
      name: { ar: 'مواقع ما قبل التاريخ', en: 'Prehistoric Sites' },
      period: { ar: 'العصر الحجري', en: 'Stone Age' },
      description: {
        ar: 'أدوات حجرية ومواقع سكنية قديمة تعود للعصر الحجري',
        en: 'Stone tools and ancient dwelling sites from Stone Age'
      },
      significance: {
        ar: 'أقدم دليل على الاستيطان البشري',
        en: 'Earliest evidence of human settlement'
      },
      location: { ar: 'مناطق متفرقة', en: 'Various locations' },
      access: { ar: 'بعضها متاح', en: 'Some accessible' },
      gradient: 'from-gray-500 to-slate-600'
    },
    {
      id: 3,
      name: { ar: 'المساجد القديمة', en: 'Ancient Mosques' },
      period: { ar: 'القرن 7-15', en: '7th-15th Century' },
      description: {
        ar: 'مساجد قديمة ببناء تقليدي فريد تعكس العمارة الإسلامية المبكرة في سقطرى',
        en: 'Ancient mosques with unique traditional architecture reflecting early Islamic architecture in Socotra'
      },
      significance: {
        ar: 'تراث إسلامي وعمارة فريدة',
        en: 'Islamic heritage and unique architecture'
      },
      location: { ar: 'حديبو وقرى مختلفة', en: 'Hadiboh and various villages' },
      access: { ar: 'متاح للزيارة', en: 'Accessible for visits' },
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      id: 4,
      name: { ar: 'القلاع البرتغالية', en: 'Portuguese Forts' },
      period: { ar: 'القرن 16', en: '16th Century' },
      description: {
        ar: 'بقايا تحصينات برتغالية من فترة احتلالهم القصيرة للجزيرة',
        en: 'Remains of Portuguese fortifications from their brief occupation'
      },
      significance: {
        ar: 'دليل على الحقبة الاستعمارية',
        en: 'Evidence of colonial period'
      },
      location: { ar: 'الساحل الشمالي', en: 'North coast' },
      access: { ar: 'أطلال يمكن زيارتها', en: 'Ruins can be visited' },
      gradient: 'from-red-500 to-rose-600'
    },
    {
      id: 5,
      name: { ar: 'المقابر الصخرية', en: 'Rock Tombs' },
      period: { ar: 'القرون الوسطى', en: 'Medieval Period' },
      description: {
        ar: 'مقابر منحوتة في الصخور تعكس تقاليد الدفن القديمة',
        en: 'Rock-carved tombs reflecting ancient burial traditions'
      },
      significance: {
        ar: 'عادات الدفن التقليدية',
        en: 'Traditional burial customs'
      },
      location: { ar: 'المناطق الجبلية', en: 'Mountain areas' },
      access: { ar: 'صعب الوصول', en: 'Difficult access' },
      gradient: 'from-purple-500 to-indigo-600'
    },
    {
      id: 6,
      name: { ar: 'المستوطنات القديمة', en: 'Ancient Settlements' },
      period: { ar: 'مختلف العصور', en: 'Various Periods' },
      description: {
        ar: 'بقايا قرى ومستوطنات قديمة توضح تطور الحياة في سقطرى',
        en: 'Remains of old villages and settlements showing life evolution in Socotra'
      },
      significance: {
        ar: 'تاريخ الاستيطان والحياة اليومية',
        en: 'Settlement history and daily life'
      },
      location: { ar: 'وديان مختلفة', en: 'Various valleys' },
      access: { ar: 'متفاوت', en: 'Varies' },
      gradient: 'from-teal-500 to-cyan-600'
    }
  ]

  // Filter timeline by era
  const filteredTimeline = timeline.filter(item => item.era === activeEra)

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[600px] overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-600 via-orange-600 to-red-600" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          
          {/* Pattern Overlay */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%23ffffff" fill-opacity="1"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
            }}></div>
          </div>
        </div>

        {/* Content */}
        <div className="relative h-full flex items-center z-10">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full mb-6 animate-fade-in">
                <svg className="w-5 h-5 text-amber-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
                <span className="text-white font-semibold">
                  {isAr ? '20 مليون سنة من التاريخ' : '20 Million Years of History'}
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-slide-in-up">
                {isAr ? 'تاريخ' : 'History of'}
                <br />
                <span className="text-gradient bg-gradient-to-r from-amber-300 via-yellow-300 to-orange-300 bg-clip-text text-transparent">
                  {isAr ? 'سقطرى' : 'Socotra'}
                </span>
              </h1>

              <p className="text-xl text-white/90 mb-8 animate-slide-in-up" style={{animationDelay: '0.1s'}}>
                {isAr
                  ? 'رحلة عبر الزمن: من الانفصال الجيولوجي إلى التراث العالمي'
                  : 'A journey through time: from geological separation to world heritage'}
              </p>

              <div className="flex gap-4 animate-fade-in" style={{animationDelay: '0.2s'}}>
                <a href="#timeline" className="btn btn-primary">
                  {isAr ? 'استكشف الخط الزمني' : 'Explore Timeline'}
                </a>
                <a href="#sites" className="btn btn-outline border-white text-white hover:bg-white hover:text-amber-600">
                  {isAr ? 'المواقع الأثرية' : 'Archaeological Sites'}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-20">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          Interactive Timeline with Era Filter
          ═══════════════════════════════════════════════════════════════ */}
      <section id="timeline" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {isAr ? 'الخط الزمني' : 'Historical'}{' '}
              <span className="text-gradient bg-gradient-to-r from-amber-600 to-orange-600 bg-clip-text text-transparent">
                {isAr ? 'التاريخي' : 'Timeline'}
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {isAr ? 'تتبع تاريخ سقطرى عبر العصور' : 'Track Socotra history through the ages'}
            </p>
          </div>

          {/* Era Filters */}
          <div className="flex justify-center gap-4 mb-16">
            {[
              { id: 'ancient', label: { ar: 'التاريخ القديم', en: 'Ancient History' }, icon: '🏺' },
              { id: 'colonial', label: { ar: 'العصر الاستعماري', en: 'Colonial Era' }, icon: '⚔️' },
              { id: 'modern', label: { ar: 'العصر الحديث', en: 'Modern Era' }, icon: '🌍' }
            ].map(era => (
              <button
                key={era.id}
                onClick={() => setActiveEra(era.id)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                  activeEra === era.id
                    ? 'bg-gradient-to-r from-amber-500 to-orange-600 text-white shadow-lg scale-105'
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:shadow-md'
                }`}
              >
                <span className="text-xl">{era.icon}</span>
                <span>{era.label[locale]}</span>
              </button>
            ))}
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Center Line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-500 to-orange-500 transform -translate-x-1/2"></div>

            {/* Timeline Items */}
            <div className="space-y-12">
              {filteredTimeline.map((item, index) => (
                <div
                  key={item.id}
                  className={`flex items-center gap-8 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  } animate-fade-in`}
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  {/* Content */}
                  <div className={`flex-1 ${index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'}`}>
                    <div className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all">
                      <div className={`inline-flex items-center gap-2 bg-gradient-to-r ${item.color} text-white px-4 py-2 rounded-full text-sm font-bold mb-3`}>
                        <span className="text-xl">{item.icon}</span>
                        <span>{item.year}</span>
                      </div>
                      
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {item.title[locale]}
                      </h3>
                      
                      <p className="text-gray-600 dark:text-gray-400">
                        {item.description[locale]}
                      </p>
                    </div>
                  </div>

                  {/* Center Dot */}
                  <div className={`hidden md:flex w-10 h-10 rounded-full border-4 border-white dark:border-gray-800 shadow-lg z-10 bg-gradient-to-br ${item.color} items-center justify-center flex-shrink-0`}>
                    <span className="text-lg">{item.icon}</span>
                  </div>

                  {/* Spacer */}
                  <div className="hidden md:block flex-1"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          Ancient History Section (متطلبات PDF: 1)
          ═══════════════════════════════════════════════════════════════ */}
      <section id="ancient" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-full text-sm font-semibold mb-4">
              🏺 {isAr ? 'التاريخ القديم' : 'Ancient History'}
            </div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {isAr ? 'سقطرى في العصور القديمة' : 'Socotra in Ancient Times'}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              {isAr
                ? 'تاريخ غني يعود لآلاف السنين: من التجارة القديمة إلى الحضارات المتعاقبة'
                : 'Rich history spanning thousands of years: from ancient trade to successive civilizations'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
            {/* Text Content */}
            <div>
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                {isAr ? 'طريق البخور' : 'The Incense Route'}
              </h3>
              <div className="space-y-4 text-gray-700 dark:text-gray-300">
                <p className="leading-relaxed">
                  {isAr
                    ? 'كانت سقطرى محطة مهمة على طريق البخور التاريخي الذي ربط جنوب الجزيرة العربية بالبحر الأبيض المتوسط. اشتهرت الجزيرة بإنتاج البخور، المر، الصبر، ودم الأخوين - وهي مواد كانت تُعتبر أكثر قيمة من الذهب في العالم القديم.'
                    : 'Socotra was an important station on the historic Incense Route connecting southern Arabia to the Mediterranean. The island was famous for producing incense, myrrh, aloe, and dragon\'s blood - materials considered more valuable than gold in the ancient world.'}
                </p>
                <p className="leading-relaxed">
                  {isAr
                    ? 'ذُكرت سقطرى في "الطواف حول البحر الإريتري" اليوناني (القرن الأول الميلادي) كجزيرة غنية بالموارد الطبيعية النادرة. كان التجار اليونانيون والرومان يأتون إلى الجزيرة لشراء هذه المنتجات الثمينة.'
                    : 'Socotra was mentioned in the Greek "Periplus of the Erythraean Sea" (1st century AD) as an island rich in rare natural resources. Greek and Roman traders came to the island to purchase these precious products.'}
                </p>
              </div>
              
              {/* Key Points */}
              <div className="mt-6 space-y-3">
                {[
                  { ar: 'مركز تجاري رئيسي منذ القرن الأول', en: 'Major trade center since 1st century' },
                  { ar: 'إنتاج المواد النادرة والثمينة', en: 'Production of rare and precious materials' },
                  { ar: 'تبادل ثقافي مع حضارات متعددة', en: 'Cultural exchange with multiple civilizations' }
                ].map((point, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <svg className="w-6 h-6 text-amber-500 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-gray-700 dark:text-gray-300">{point[locale]}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual */}
            <div className="relative h-[400px] bg-gradient-to-br from-amber-400 to-orange-500 rounded-2xl overflow-hidden shadow-2xl">
              <div className="absolute inset-0 flex items-center justify-center">
                <svg className="w-32 h-32 text-white/20" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Additional Ancient Info Cards */}
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: { ar: 'الأساطير القديمة', en: 'Ancient Myths' },
                icon: '📖',
                description: {
                  ar: 'ارتبطت سقطرى بأساطير التنانين ودم الأخوين في الثقافات القديمة',
                  en: 'Socotra associated with dragon myths and dragon\'s blood in ancient cultures'
                }
              },
              {
                title: { ar: 'المسيحية المبكرة', en: 'Early Christianity' },
                icon: '✝️',
                description: {
                  ar: 'يُعتقد أن القديس توما زار الجزيرة في القرن الأول الميلادي',
                  en: 'Saint Thomas believed to have visited island in 1st century AD'
                }
              },
              {
                title: { ar: 'اللغة القديمة', en: 'Ancient Language' },
                icon: '🗣️',
                description: {
                  ar: 'اللغة السقطرية القديمة من أقدم اللغات السامية الجنوبية',
                  en: 'Old Soqotri language among oldest South Semitic languages'
                }
              }
            ].map((card, i) => (
              <div key={i} className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-6 rounded-xl border border-amber-200 dark:border-amber-800">
                <div className="text-4xl mb-3">{card.icon}</div>
                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {card.title[locale]}
                </h4>
                <p className="text-gray-600 dark:text-gray-400">
                  {card.description[locale]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          Colonial Era Section (متطلبات PDF: 2)
          ═══════════════════════════════════════════════════════════════ */}
      <section id="colonial" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-sm font-semibold mb-4">
              ⚔️ {isAr ? 'العصر الاستعماري' : 'Colonial Era'}
            </div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {isAr ? 'الفترة الاستعمارية' : 'Colonial Period'}
            </h2>
          </div>

          {/* Portuguese Era */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-xl mb-12">
            <div className="h-2 bg-gradient-to-r from-red-500 to-rose-600"></div>
            <div className="p-8 md:p-12">
              <div className="flex items-start gap-6 mb-6">
                <div className="text-6xl">🇵🇹</div>
                <div>
                  <span className="inline-block px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-sm font-bold mb-3">
                    1507-1511
                  </span>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {isAr ? 'الاحتلال البرتغالي' : 'Portuguese Occupation'}
                  </h3>
                </div>
              </div>

              <div className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300">
                <p className="mb-4">
                  {isAr
                    ? 'وصل البرتغاليون بقيادة تريستان دا كونها إلى سقطرى عام 1507 كجزء من توسعهم في المحيط الهندي. احتلوا الجزيرة لمدة أربع سنوات وبنوا قلعة صغيرة في حديبو. كان هدفهم السيطرة على طرق التجارة البحرية ومنع العثمانيين من الوصول إلى المحيط الهندي.'
                    : 'Portuguese arrived led by Tristão da Cunha in 1507 as part of their Indian Ocean expansion. They occupied the island for four years and built a small fortress in Hadiboh. Their goal was to control maritime trade routes and prevent Ottomans from reaching Indian Ocean.'}
                </p>
                <p>
                  {isAr
                    ? 'اضطر البرتغاليون للانسحاب عام 1511 بسبب العزلة الشديدة وصعوبة الإمداد والدعم. لم يترك احتلالهم القصير أثراً كبيراً على السكان المحليين، لكن بقايا قلعتهم لا تزال موجودة حتى اليوم.'
                    : 'Portuguese forced to withdraw in 1511 due to extreme isolation and supply difficulties. Their brief occupation left little impact on locals, but fortress remains still exist today.'}
                </p>
              </div>
            </div>
          </div>

          {/* British Era */}
          <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-xl">
            <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
            <div className="p-8 md:p-12">
              <div className="flex items-start gap-6 mb-6">
                <div className="text-6xl">🇬🇧</div>
                <div>
                  <span className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-bold mb-3">
                    1886-1967
                  </span>
                  <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                    {isAr ? 'الحماية البريطانية' : 'British Protectorate'}
                  </h3>
                </div>
              </div>

              <div className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300">
                <p className="mb-4">
                  {isAr
                    ? 'أصبحت سقطرى تحت الحماية البريطانية عام 1886 كجزء من محمية عدن. لم يكن للبريطانيين وجود عسكري مباشر في الجزيرة، بل حكموها بشكل غير مباشر من خلال سلاطين المهرة المحليين. كانت سقطرى مهمة استراتيجياً للسيطرة على مدخل البحر الأحمر.'
                    : 'Socotra came under British protection in 1886 as part of Aden Protectorate. British had no direct military presence on island, ruling indirectly through local Mahri sultans. Socotra was strategically important for controlling Red Sea entrance.'}
                </p>
                <p>
                  {isAr
                    ? 'ظلت سقطرى معزولة نسبياً خلال الحقبة البريطانية. حافظ السكان المحليون على تقاليدهم وثقافتهم ولغتهم دون تأثر كبير بالوجود الاستعماري. انتهت الحماية البريطانية عام 1967 مع استقلال اليمن الجنوبي.'
                    : 'Socotra remained relatively isolated during British era. Locals maintained their traditions, culture and language without major colonial influence. British protection ended in 1967 with South Yemen independence.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          Modern Socotra Section (متطلبات PDF: 3)
          ═══════════════════════════════════════════════════════════════ */}
      <section id="modern" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-semibold mb-4">
              🌍 {isAr ? 'العصر الحديث' : 'Modern Era'}
            </div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {isAr ? 'سقطرى الحديثة' : 'Modern Socotra'}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {isAr ? 'من الاستقلال إلى التراث العالمي' : 'From Independence to World Heritage'}
            </p>
          </div>

          <div className="space-y-8">
            {/* 1967 - Independence */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-8 rounded-2xl border border-green-200 dark:border-green-800">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white text-3xl flex-shrink-0">
                  🇾🇪
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-4 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-bold">
                      1967
                    </span>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {isAr ? 'الاستقلال' : 'Independence'}
                    </h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {isAr
                      ? 'استقلت سقطرى مع جمهورية اليمن الجنوبية الشعبية عن الاستعمار البريطاني. بدأت مرحلة جديدة من التطور مع إنشاء بنية تحتية أساسية وخدمات حكومية. اهتمت الحكومة الجديدة بتطوير التعليم والصحة في الجزيرة.'
                      : 'Socotra gained independence with People\'s Democratic Republic of Yemen from British colonialism. New phase of development began with establishment of basic infrastructure and government services. New government focused on developing education and health on the island.'}
                  </p>
                </div>
              </div>
            </div>

            {/* 1990 - Unity */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-8 rounded-2xl border border-blue-200 dark:border-blue-800">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-3xl flex-shrink-0">
                  🤝
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-4 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-bold">
                      1990
                    </span>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {isAr ? 'الوحدة اليمنية' : 'Yemeni Unification'}
                    </h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {isAr
                      ? 'مع توحيد اليمن، أصبحت سقطرى جزءاً من الجمهورية اليمنية الموحدة. بدأت الحكومة في الاهتمام بحماية البيئة الفريدة للجزيرة وتطوير السياحة البيئية المستدامة.'
                      : 'With Yemen unification, Socotra became part of unified Republic of Yemen. Government began focusing on protecting island\'s unique environment and developing sustainable eco-tourism.'}
                  </p>
                </div>
              </div>
            </div>

            {/* 1996 - Conservation */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 p-8 rounded-2xl border border-purple-200 dark:border-purple-800">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center text-white text-3xl flex-shrink-0">
                  🌿
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-4 py-1 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full text-sm font-bold">
                      1996
                    </span>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {isAr ? 'برنامج الحفظ' : 'Conservation Program'}
                    </h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {isAr
                      ? 'أطلقت الحكومة اليمنية بالتعاون مع برنامج الأمم المتحدة الإنمائي برنامجاً شاملاً لحفظ التنوع البيولوجي في سقطرى. شمل دراسات علمية مكثفة وخطط إدارة بيئية.'
                      : 'Yemeni government with UNDP launched comprehensive biodiversity conservation program in Socotra. Included intensive scientific studies and environmental management plans.'}
                  </p>
                </div>
              </div>
            </div>

            {/* 2008 - UNESCO */}
            <div className="bg-gradient-to-br from-yellow-50 to-orange-50 dark:from-yellow-900/20 dark:to-orange-900/20 p-8 rounded-2xl border-2 border-yellow-400 dark:border-yellow-600 relative overflow-hidden">
              {/* Highlight Badge */}
              <div className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 px-4 py-2 rounded-full text-xs font-bold shadow-lg">
                ⭐ {isAr ? 'أهم حدث' : 'Major Milestone'}
              </div>

              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center text-white text-3xl flex-shrink-0">
                  🏛️
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-4 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-sm font-bold">
                      2008
                    </span>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {isAr ? 'موقع تراث عالمي UNESCO' : 'UNESCO World Heritage Site'}
                    </h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
                    {isAr
                      ? 'أدرجت منظمة اليونسكو أرخبيل سقطرى كموقع تراث عالمي طبيعي. كان هذا اعترافاً عالمياً بأهمية سقطرى البيولوجية والبيئية الفريدة. يُعتبر هذا التصنيف التزاماً دولياً بالحفاظ على الجزيرة للأجيال القادمة.'
                      : 'UNESCO inscribed Socotra Archipelago as natural World Heritage Site. This was global recognition of Socotra\'s unique biological and environmental importance. Classification is international commitment to preserve island for future generations.'}
                  </p>
                  
                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 mt-4">
                    {[
                      { number: '700+', label: { ar: 'نوع مستوطن', en: 'Endemic Species' } },
                      { number: '37%', label: { ar: 'نباتات فريدة', en: 'Unique Plants' } },
                      { number: '90%', label: { ar: 'زواحف مستوطنة', en: 'Endemic Reptiles' } }
                    ].map((stat, i) => (
                      <div key={i} className="bg-white dark:bg-gray-900 p-3 rounded-lg text-center">
                        <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stat.number}</div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">{stat.label[locale]}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Today */}
            <div className="bg-gradient-to-br from-teal-50 to-cyan-50 dark:from-teal-900/20 dark:to-cyan-900/20 p-8 rounded-2xl border border-teal-200 dark:border-teal-800">
              <div className="flex items-start gap-6">
                <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-cyan-600 rounded-2xl flex items-center justify-center text-white text-3xl flex-shrink-0">
                  🌟
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="px-4 py-1 bg-teal-100 dark:bg-teal-900/30 text-teal-700 dark:text-teal-400 rounded-full text-sm font-bold">
                      {isAr ? 'اليوم' : 'Today'}
                    </span>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {isAr ? 'سقطرى في الحاضر' : 'Socotra Today'}
                    </h3>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                    {isAr
                      ? 'رغم التحديات، تواصل سقطرى جهودها في الحفاظ على بيئتها الفريدة. يعمل المجتمع المحلي مع المنظمات الدولية لتطوير سياحة بيئية مستدامة تحترم البيئة والثقافة المحلية. تظل سقطرى واحدة من أكثر الأماكن تميزاً على وجه الأرض.'
                      : 'Despite challenges, Socotra continues efforts to preserve unique environment. Local community works with international organizations to develop sustainable eco-tourism respecting environment and local culture. Socotra remains one of most unique places on Earth.'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          Archaeological Sites Section (متطلبات PDF: 4)
          ═══════════════════════════════════════════════════════════════ */}
      <section id="sites" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full text-sm font-semibold mb-4">
              🏛️ {isAr ? 'المواقع الأثرية' : 'Archaeological Sites'}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {isAr ? 'كنوز' : 'Treasures of'}{' '}
              <span className="text-gradient bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {isAr ? 'التاريخ' : 'History'}
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {isAr ? 'استكشف المواقع الأثرية التي تروي قصة آلاف السنين' : 'Explore archaeological sites telling story of millennia'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {archaeologicalSites.map((site) => (
              <div
                key={site.id}
                className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 cursor-pointer"
                onClick={() => setSelectedSite(site)}
              >
                {/* Header */}
                <div className={`h-32 bg-gradient-to-br ${site.gradient} flex items-center justify-center relative`}>
                  <span className="text-6xl">{site.gradient.includes('amber') ? '🏔️' : site.gradient.includes('gray') ? '🗿' : site.gradient.includes('green') ? '🕌' : site.gradient.includes('red') ? '🏰' : site.gradient.includes('purple') ? '⚱️' : '⚖️'}</span>
                  
                  {/* Period Badge */}
                  <div className="absolute bottom-3 right-3 bg-white/90 dark:bg-gray-800/90 px-3 py-1 rounded-full text-xs font-bold text-gray-700 dark:text-gray-300">
                    {site.period[locale]}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                    {site.name[locale]}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                    {site.description[locale]}
                  </p>

                  {/* Info Grid */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      <span>{site.location[locale]}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>{site.access[locale]}</span>
                    </div>
                  </div>

                  {/* Significance Badge */}
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-xs font-semibold text-purple-600 dark:text-purple-400 mb-1">
                      {isAr ? 'الأهمية:' : 'Significance:'}
                    </div>
                    <p className="text-sm text-gray-700 dark:text-gray-300">
                      {site.significance[locale]}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          CTA Section
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {isAr ? 'اكتشف تاريخ سقطرى بنفسك' : 'Discover Socotra History Yourself'}
          </h2>

          <p className="text-xl mb-12 opacity-90">
            {isAr
              ? 'انضم لجولاتنا الثقافية واستكشف المواقع التاريخية والأثرية'
              : 'Join our cultural tours and explore historical and archaeological sites'}
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="/tours"
              className="btn text-lg px-8 py-4 bg-white text-orange-600 hover:bg-gray-100 transform hover:scale-105 transition-all shadow-2xl"
            >
              {isAr ? 'الجولات الثقافية' : 'Cultural Tours'}
            </a>

            <a
              href="/contact"
              className="btn text-lg px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-orange-600 transform hover:scale-105 transition-all"
            >
              {isAr ? 'احجز الآن' : 'Book Now'}
            </a>
          </div>
        </div>
      </section>

      <WhatsAppButton />
    </div>
  )
}