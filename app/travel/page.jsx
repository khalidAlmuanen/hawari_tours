'use client'

// ═══════════════════════════════════════════════════════════════════════
// 🧳 Travel Guide Page - PART 1 (Hero + Data Structures)
// المرحلة 7: دليل السفر - احترافي جداً وعصري
// ═══════════════════════════════════════════════════════════════════════

import { useState } from 'react'
import { useApp } from '@/contexts/AppContext'
import WhatsAppButton from '@/components/WhatsAppButton'

export default function TravelGuidePage() {
  const { locale, isDark } = useApp()
  const isAr = locale === 'ar'

  const [activeTab, setActiveTab] = useState('visa')
  const [budgetType, setBudgetType] = useState('budget')
  const [selectedMonth, setSelectedMonth] = useState(1)

  // ═══════════════════════════════════════════════════════════════
  // Quick Tips Data - نصائح سريعة
  // ═══════════════════════════════════════════════════════════════
  const quickTips = [
    {
      icon: '🛂',
      title: { ar: 'تأشيرة عند الوصول', en: 'Visa on Arrival' },
      description: { ar: 'لمعظم الجنسيات', en: 'For most nationalities' },
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      icon: '✈️',
      title: { ar: 'رحلات مباشرة', en: 'Direct Flights' },
      description: { ar: 'من المكلا وأبوظبي', en: 'From Mukalla & Abu Dhabi' },
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      icon: '🌡️',
      title: { ar: 'أفضل وقت', en: 'Best Time' },
      description: { ar: 'أكتوبر - أبريل', en: 'October - April' },
      gradient: 'from-orange-500 to-red-600'
    },
    {
      icon: '💰',
      title: { ar: 'العملة', en: 'Currency' },
      description: { ar: 'ريال يمني (YER)', en: 'Yemeni Rial (YER)' },
      gradient: 'from-green-500 to-emerald-600'
    }
  ]

  // ═══════════════════════════════════════════════════════════════
  // 1. Visa & Entry Requirements (متطلبات PDF)
  // ═══════════════════════════════════════════════════════════════
  const visaInfo = {
    title: { ar: 'التأشيرات ومتطلبات الدخول', en: 'Visa & Entry Requirements' },
    
    overview: {
      icon: '🛂',
      points: [
        {
          title: { ar: 'تأشيرة عند الوصول', en: 'Visa on Arrival' },
          description: {
            ar: 'متاحة لمعظم الجنسيات في مطار سقطرى. التكلفة تقريباً 100 دولار أمريكي',
            en: 'Available for most nationalities at Socotra Airport. Cost approximately $100 USD'
          },
          icon: '✅',
          color: 'text-green-600 dark:text-green-400'
        },
        {
          title: { ar: 'صلاحية الجواز', en: 'Passport Validity' },
          description: {
            ar: 'يجب أن يكون جواز السفر صالحاً لمدة 6 أشهر على الأقل من تاريخ الدخول',
            en: 'Passport must be valid for at least 6 months from date of entry'
          },
          icon: '📘',
          color: 'text-blue-600 dark:text-blue-400'
        },
        {
          title: { ar: 'مدة الإقامة', en: 'Duration of Stay' },
          description: {
            ar: 'التأشيرة صالحة لمدة 30 يوماً، ويمكن تمديدها في حديبو',
            en: 'Visa valid for 30 days, can be extended in Hadiboh'
          },
          icon: '📅',
          color: 'text-purple-600 dark:text-purple-400'
        }
      ]
    },

    requirements: {
      title: { ar: 'المستندات المطلوبة', en: 'Required Documents' },
      items: [
        { ar: 'جواز سفر صالح لمدة 6 أشهر', en: 'Valid passport for 6 months', icon: '📘' },
        { ar: 'صورة شخصية حديثة', en: 'Recent passport photo', icon: '📸' },
        { ar: 'حجز فندقي أو خطاب دعوة', en: 'Hotel booking or invitation letter', icon: '🏨' },
        { ar: 'تذكرة طيران ذهاب وعودة', en: 'Round-trip flight ticket', icon: '✈️' },
        { ar: 'تأمين سفر (موصى به بشدة)', en: 'Travel insurance (highly recommended)', icon: '🛡️' },
        { ar: 'رسوم التأشيرة نقداً (دولار أمريكي)', en: 'Visa fee in cash (USD)', icon: '💵' }
      ]
    },

    countries: [
      {
        category: { ar: 'دول مجلس التعاون الخليجي', en: 'GCC Countries' },
        status: { ar: 'دخول بدون تأشيرة', en: 'Visa-Free Entry' },
        icon: '🟢',
        countries: { ar: 'السعودية، الإمارات، الكويت، قطر، عمان، البحرين', en: 'Saudi Arabia, UAE, Kuwait, Qatar, Oman, Bahrain' }
      },
      {
        category: { ar: 'معظم الدول', en: 'Most Countries' },
        status: { ar: 'تأشيرة عند الوصول', en: 'Visa on Arrival' },
        icon: '🟡',
        countries: { ar: 'أوروبا، أمريكا، آسيا، أستراليا', en: 'Europe, America, Asia, Australia' }
      },
      {
        category: { ar: 'بعض الدول', en: 'Some Countries' },
        status: { ar: 'تأشيرة مسبقة مطلوبة', en: 'Prior Visa Required' },
        icon: '🔴',
        countries: { ar: 'يرجى التحقق من السفارة اليمنية', en: 'Please check with Yemeni embassy' }
      }
    ]
  }

  // ═══════════════════════════════════════════════════════════════
  // 2. Transportation (متطلبات PDF)
  // ═══════════════════════════════════════════════════════════════
  const transportation = {
    title: { ar: 'النقل والمواصلات', en: 'Transportation' },

    flights: {
      title: { ar: 'الرحلات الجوية إلى سقطرى', en: 'Flights to Socotra' },
      subtitle: { ar: 'خطوط جوية تطير إلى مطار سقطرى', en: 'Airlines flying to Socotra Airport' },
      routes: [
        {
          id: 1,
          from: { ar: 'المكلا، اليمن', en: 'Mukalla, Yemen' },
          airline: 'Yemenia',
          duration: '1h 30m',
          frequency: { ar: '3-4 رحلات أسبوعياً', en: '3-4 flights weekly' },
          price: '$150-250',
          icon: '🇾🇪',
          gradient: 'from-red-500 to-red-700'
        },
        {
          id: 2,
          from: { ar: 'أبوظبي، الإمارات', en: 'Abu Dhabi, UAE' },
          airline: 'Felix Airways',
          duration: '2h 15m',
          frequency: { ar: 'رحلتان أسبوعياً', en: '2 flights weekly' },
          price: '$300-450',
          icon: '🇦🇪',
          gradient: 'from-blue-500 to-indigo-600'
        },
        {
          id: 3,
          from: { ar: 'القاهرة، مصر', en: 'Cairo, Egypt' },
          airline: 'Charter Flights',
          duration: '3h 30m',
          frequency: { ar: 'موسمية', en: 'Seasonal' },
          price: '$400-600',
          icon: '🇪🇬',
          gradient: 'from-yellow-500 to-orange-600'
        }
      ],
      tips: [
        { ar: 'احجز مبكراً - عدد المقاعد محدود جداً', en: 'Book early - very limited seats' },
        { ar: 'تحقق من جداول الرحلات قبل السفر', en: 'Verify flight schedules before travel' },
        { ar: 'الأمتعة المسموحة: 20 كجم عادةً', en: 'Baggage allowance: typically 20kg' },
        { ar: 'قد تتأخر الرحلات أو تُلغى بسبب الطقس', en: 'Flights may delay/cancel due to weather' }
      ]
    },

    local: {
      title: { ar: 'النقل المحلي في سقطرى', en: 'Local Transportation in Socotra' },
      options: [
        {
          id: 1,
          type: { ar: 'سيارات دفع رباعي مع سائق', en: '4x4 Vehicle with Driver' },
          description: {
            ar: 'الخيار الأفضل والأكثر أماناً. معظم الطرق وعرة وتحتاج سائق خبير محلي',
            en: 'Best and safest option. Most roads are rough and need experienced local driver'
          },
          price: { ar: '80-120 دولار/يوم', en: '$80-120/day' },
          icon: '🚙',
          gradient: 'from-green-500 to-emerald-600',
          features: [
            { ar: 'سائق محلي خبير', en: 'Expert local driver' },
            { ar: 'معرفة بالطرق الوعرة', en: 'Knowledge of rough roads' },
            { ar: 'وقود مشمول عادةً', en: 'Fuel usually included' },
            { ar: 'مرن ومريح', en: 'Flexible and comfortable' }
          ]
        },
        {
          id: 2,
          type: { ar: 'تاكسي محلي', en: 'Local Taxi' },
          description: {
            ar: 'متاح في حديبو والمدن الرئيسية للمسافات القصيرة فقط',
            en: 'Available in Hadiboh and main towns for short distances only'
          },
          price: { ar: '5-20 دولار', en: '$5-20' },
          icon: '🚕',
          gradient: 'from-yellow-500 to-orange-600',
          features: [
            { ar: 'للمسافات القصيرة', en: 'For short distances' },
            { ar: 'داخل المدن فقط', en: 'Within cities only' },
            { ar: 'اقتصادي', en: 'Economical' },
            { ar: 'متوفر عند الطلب', en: 'Available on demand' }
          ]
        },
        {
          id: 3,
          type: { ar: 'دراجات نارية', en: 'Motorcycles' },
          description: {
            ar: 'للمغامرين ذوي الخبرة - الطرق صعبة وخطيرة',
            en: 'For experienced adventurers - roads are difficult and dangerous'
          },
          price: { ar: '30-50 دولار/يوم', en: '$30-50/day' },
          icon: '🏍️',
          gradient: 'from-red-500 to-rose-600',
          features: [
            { ar: 'خبرة قيادة مطلوبة', en: 'Driving experience required' },
            { ar: 'خطر على الطرق الوعرة', en: 'Risky on rough roads' },
            { ar: 'حرية التنقل', en: 'Freedom of movement' },
            { ar: 'غير موصى للمبتدئين', en: 'Not for beginners' }
          ]
        },
        {
          id: 4,
          type: { ar: 'قوارب', en: 'Boats' },
          description: {
            ar: 'للوصول إلى الشواطئ البعيدة والجزر الصغيرة',
            en: 'To reach remote beaches and small islands'
          },
          price: { ar: '100-250 دولار/رحلة', en: '$100-250/trip' },
          icon: '⛵',
          gradient: 'from-blue-500 to-cyan-600',
          features: [
            { ar: 'للمواقع الساحلية', en: 'For coastal locations' },
            { ar: 'رحلات منظمة', en: 'Organized trips' },
            { ar: 'مرشد بحري', en: 'Marine guide' },
            { ar: 'حسب الطقس', en: 'Weather dependent' }
          ]
        }
      ]
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // 3. Accommodation (متطلبات PDF)
  // ═══════════════════════════════════════════════════════════════
  const accommodation = {
    title: { ar: 'خيارات الإقامة', en: 'Accommodation Options' },
    subtitle: { ar: 'من الفنادق إلى التخييم البيئي', en: 'From Hotels to Eco-Camping' },

    types: [
      {
        id: 1,
        type: { ar: 'فنادق', en: 'Hotels' },
        icon: '🏨',
        description: {
          ar: 'فنادق ونزل في حديبو والمدن الرئيسية مع خدمات أساسية',
          en: 'Hotels and inns in Hadiboh and main towns with basic services'
        },
        price: { ar: '50-120 دولار/ليلة', en: '$50-120/night' },
        rating: 3,
        gradient: 'from-blue-500 to-indigo-600',
        features: [
          { ar: 'غرف مكيفة', en: 'Air-conditioned rooms', icon: '❄️' },
          { ar: 'واي فاي (محدود)', en: 'WiFi (limited)', icon: '📶' },
          { ar: 'مطعم', en: 'Restaurant', icon: '🍽️' },
          { ar: 'موقف سيارات', en: 'Parking', icon: '🅿️' },
          { ar: 'ماء ساخن', en: 'Hot water', icon: '🚿' }
        ],
        examples: [
          { name: 'Socotra Hotel', location: 'Hadiboh', stars: 3 },
          { name: 'Hadiboh Hotel', location: 'Hadiboh', stars: 3 },
          { name: 'Summerland Hotel', location: 'Hadiboh', stars: 2 }
        ]
      },
      {
        id: 2,
        type: { ar: 'نزل بيئية', en: 'Eco-Lodges' },
        icon: '🏡',
        description: {
          ar: 'إقامة صديقة للبيئة في مواقع طبيعية خلابة بعيداً عن المدن',
          en: 'Eco-friendly accommodation in stunning natural locations away from towns'
        },
        price: { ar: '70-150 دولار/ليلة', en: '$70-150/night' },
        rating: 4,
        gradient: 'from-green-500 to-emerald-600',
        features: [
          { ar: 'تصميم بيئي مستدام', en: 'Sustainable eco-design', icon: '🌿' },
          { ar: 'إطلالات طبيعية رائعة', en: 'Amazing nature views', icon: '🏞️' },
          { ar: 'طعام محلي عضوي', en: 'Local organic food', icon: '🥗' },
          { ar: 'أنشطة بيئية', en: 'Eco activities', icon: '🎯' },
          { ar: 'طاقة شمسية', en: 'Solar power', icon: '☀️' }
        ],
        examples: [
          { name: 'Dihamri Marine Lodge', location: 'Dihamri', stars: 4 },
          { name: 'Qalansiyah Beach Lodge', location: 'Qalansiyah', stars: 3 }
        ]
      },
      {
        id: 3,
        type: { ar: 'بيوت ضيافة محلية', en: 'Local Guesthouses' },
        icon: '🏠',
        description: {
          ar: 'إقامة بسيطة مع عائلات محلية - تجربة ثقافية أصيلة',
          en: 'Simple stay with local families - authentic cultural experience'
        },
        price: { ar: '20-40 دولار/ليلة', en: '$20-40/night' },
        rating: 2,
        gradient: 'from-orange-500 to-red-600',
        features: [
          { ar: 'تجربة محلية حقيقية', en: 'Authentic local experience', icon: '🤝' },
          { ar: 'وجبات منزلية', en: 'Home-cooked meals', icon: '🍲' },
          { ar: 'ضيافة سقطرية', en: 'Socotri hospitality', icon: '💚' },
          { ar: 'اقتصادي جداً', en: 'Very economical', icon: '💰' },
          { ar: 'تعلم اللغة المحلية', en: 'Learn local language', icon: '🗣️' }
        ],
        examples: [
          { name: 'Family Guesthouses', location: 'Various villages', stars: 2 },
          { name: 'Community Houses', location: 'Rural areas', stars: 2 }
        ]
      },
      {
        id: 4,
        type: { ar: 'تخييم بيئي', en: 'Eco-Camping' },
        icon: '⛺',
        description: {
          ar: 'تخييم منظم في مواقع طبيعية مع معدات ومرشدين - مغامرة حقيقية',
          en: 'Organized camping in natural sites with equipment and guides - true adventure'
        },
        price: { ar: '30-70 دولار/ليلة', en: '$30-70/night' },
        rating: 4,
        gradient: 'from-purple-500 to-pink-600',
        features: [
          { ar: 'نوم تحت النجوم', en: 'Sleep under stars', icon: '⭐' },
          { ar: 'معدات تخييم كاملة', en: 'Full camping equipment', icon: '🎒' },
          { ar: 'مرشد محلي خبير', en: 'Expert local guide', icon: '🧭' },
          { ar: 'مواقع آمنة ومحمية', en: 'Safe protected locations', icon: '🛡️' },
          { ar: 'طعام مطبوخ على النار', en: 'Fire-cooked food', icon: '🔥' }
        ],
        examples: [
          { name: 'Beach Camping', location: 'Various beaches', stars: null },
          { name: 'Mountain Camping', location: 'Haggier Mountains', stars: null },
          { name: 'Desert Camping', location: 'Sand dunes', stars: null }
        ]
      }
    ]
  }

  // باقي البيانات والأقسام في PART2...

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[600px] overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-cyan-600 to-teal-600" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          
          {/* Animated Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 animate-pulse" style={{
              backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)'
            }}></div>
          </div>
        </div>

        {/* Content */}
        <div className="relative h-full flex items-center z-10">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full mb-6 animate-fade-in">
                <svg className="w-5 h-5 text-cyan-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                <span className="text-white font-semibold">
                  {isAr ? 'دليلك الشامل للسفر إلى سقطرى' : 'Your Complete Guide to Socotra'}
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-slide-in-up">
                {isAr ? 'دليل' : 'Travel'}
                <br />
                <span className="text-gradient bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                  {isAr ? 'السفر' : 'Guide'}
                </span>
              </h1>

              <p className="text-xl text-white/90 mb-8 animate-slide-in-up" style={{animationDelay: '0.1s'}}>
                {isAr
                  ? 'كل ما تحتاج معرفته: التأشيرات، النقل، الإقامة، أفضل الأوقات، ونصائح السلامة'
                  : 'Everything you need: Visas, Transport, Accommodation, Best Times, and Safety Tips'}
              </p>

              <div className="flex gap-4 animate-fade-in" style={{animationDelay: '0.2s'}}>
                <a href="#visa" className="btn btn-primary px-8 py-4 text-lg">
                  {isAr ? 'ابدأ التخطيط' : 'Start Planning'}
                </a>
                <a href="#safety" className="btn btn-outline border-white text-white hover:bg-white hover:text-cyan-600 px-8 py-4 text-lg">
                  {isAr ? 'نصائح السلامة' : 'Safety Tips'}
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

      {/* Quick Tips Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800 -mt-20 relative z-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {quickTips.map((tip, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br ${tip.gradient} p-6 rounded-2xl shadow-xl text-center transform hover:scale-105 transition-all animate-fade-in text-white`}
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="text-5xl mb-3">{tip.icon}</div>
                <h3 className="font-bold text-lg mb-1">
                  {tip.title[locale]}
                </h3>
                <p className="text-sm opacity-90">
                  {tip.description[locale]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          Tab Navigation - للتنقل بين الأقسام
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-8 bg-white dark:bg-gray-800 sticky top-0 z-40 border-b border-gray-200 dark:border-gray-700 shadow-md">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex overflow-x-auto gap-4 pb-2">
            {[
              { id: 'visa', label: { ar: 'التأشيرات', en: 'Visa' }, icon: '🛂' },
              { id: 'transport', label: { ar: 'النقل', en: 'Transport' }, icon: '✈️' },
              { id: 'accommodation', label: { ar: 'الإقامة', en: 'Accommodation' }, icon: '🏨' },
              { id: 'time', label: { ar: 'أفضل وقت', en: 'Best Time' }, icon: '📅' },
              { id: 'safety', label: { ar: 'السلامة', en: 'Safety' }, icon: '🛡️' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id)
                  document.getElementById(tab.id)?.scrollIntoView({ behavior: 'smooth' })
                }}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <span className="text-xl">{tab.icon}</span>
                <span>{tab.label[locale]}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          1. Visa & Entry Requirements Section
          ═══════════════════════════════════════════════════════════════ */}
      <section id="visa" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Section Title */}
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-semibold mb-4">
              🛂 {visaInfo.title[locale]}
            </div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {isAr ? 'كل ما تحتاج معرفته عن' : 'Everything About'}{' '}
              <span className="text-gradient bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                {isAr ? 'التأشيرات' : 'Visas'}
              </span>
            </h2>
          </div>

          {/* Overview Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {visaInfo.overview.points.map((point, index) => (
              <div key={index} className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 p-8 rounded-2xl border border-blue-200 dark:border-blue-800">
                <div className={`text-5xl mb-4 ${point.color}`}>{point.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {point.title[locale]}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {point.description[locale]}
                </p>
              </div>
            ))}
          </div>

          {/* Required Documents */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-12 border border-gray-200 dark:border-gray-700">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center text-white text-xl">
                📋
              </span>
              {visaInfo.requirements.title[locale]}
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              {visaInfo.requirements.items.map((item, index) => (
                <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-900 rounded-xl">
                  <span className="text-3xl flex-shrink-0">{item.icon}</span>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">
                      {item[locale]}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Countries Status */}
          <div className="space-y-6">
            {visaInfo.countries.map((cat, index) => (
              <div key={index} className="bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 p-8 rounded-2xl border border-gray-200 dark:border-gray-700">
                <div className="flex items-start gap-4">
                  <span className="text-4xl">{cat.icon}</span>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {cat.category[locale]}
                    </h4>
                    <p className="text-lg font-semibold text-blue-600 dark:text-blue-400 mb-3">
                      {cat.status[locale]}
                    </p>
                    <p className="text-gray-600 dark:text-gray-400">
                      {cat.countries[locale]}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          2. Transportation Section
          ═══════════════════════════════════════════════════════════════ */}
      <section id="transport" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Section Title */}
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full text-sm font-semibold mb-4">
              ✈️ {transportation.title[locale]}
            </div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {transportation.flights.title[locale]}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {transportation.flights.subtitle[locale]}
            </p>
          </div>

          {/* Flight Routes */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {transportation.flights.routes.map((route) => (
              <div key={route.id} className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2">
                <div className={`h-2 bg-gradient-to-r ${route.gradient}`}></div>
                
                <div className="p-6">
                  <div className="text-5xl mb-4 text-center">{route.icon}</div>
                  
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 text-center">
                    {route.from[locale]}
                  </h3>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">{isAr ? 'شركة الطيران:' : 'Airline:'}</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{route.airline}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">{isAr ? 'المدة:' : 'Duration:'}</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{route.duration}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">{isAr ? 'التكرار:' : 'Frequency:'}</span>
                      <span className="font-semibold text-gray-900 dark:text-white">{route.frequency[locale]}</span>
                    </div>
                  </div>

                  <div className={`bg-gradient-to-r ${route.gradient} text-white text-center py-3 rounded-xl font-bold text-lg`}>
                    {route.price}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Flight Tips */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-6 rounded-lg mb-16">
            <h4 className="font-bold text-blue-900 dark:text-blue-300 mb-4 flex items-center gap-2">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              {isAr ? 'نصائح مهمة للحجز:' : 'Important Booking Tips:'}
            </h4>
            <ul className="space-y-2">
              {transportation.flights.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2 text-blue-800 dark:text-blue-300">
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  <span>{tip[locale]}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Local Transportation */}
          <div className="mb-8">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              {transportation.local.title[locale]}
            </h3>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {transportation.local.options.map((option) => (
              <div key={option.id} className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-xl">
                <div className={`h-2 bg-gradient-to-r ${option.gradient}`}></div>
                
                <div className="p-8">
                  <div className="flex items-start gap-4 mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${option.gradient} rounded-2xl flex items-center justify-center text-4xl flex-shrink-0`}>
                      {option.icon}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {option.type[locale]}
                      </h4>
                      <p className="text-sm font-semibold text-gray-600 dark:text-gray-400">
                        {option.price[locale]}
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                    {option.description[locale]}
                  </p>

                  <div className="space-y-2">
                    {option.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm">
                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700 dark:text-gray-300">{feature[locale]}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          3. Accommodation Section
          ═══════════════════════════════════════════════════════════════ */}
      <section id="accommodation" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Section Title */}
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-semibold mb-4">
              🏨 {accommodation.title[locale]}
            </div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {accommodation.subtitle[locale]}
            </h2>
          </div>

          {/* Accommodation Types */}
          <div className="space-y-12">
            {accommodation.types.map((type) => (
              <div key={type.id} className="bg-gradient-to-br from-gray-50 to-white dark:from-gray-800 dark:to-gray-900 rounded-2xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700">
                <div className={`h-3 bg-gradient-to-r ${type.gradient}`}></div>
                
                <div className="p-8 md:p-12">
                  <div className="grid md:grid-cols-3 gap-8">
                    {/* Info Column */}
                    <div className="md:col-span-2">
                      <div className="flex items-start gap-4 mb-6">
                        <div className={`w-20 h-20 bg-gradient-to-br ${type.gradient} rounded-2xl flex items-center justify-center text-5xl flex-shrink-0`}>
                          {type.icon}
                        </div>
                        <div>
                          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                            {type.type[locale]}
                          </h3>
                          <div className="flex items-center gap-2 mb-2">
                            {[...Array(5)].map((_, i) => (
                              <svg key={i} className={`w-5 h-5 ${i < type.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`} fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <p className="text-lg font-semibold text-gray-600 dark:text-gray-400">
                            {type.price[locale]}
                          </p>
                        </div>
                      </div>

                      <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                        {type.description[locale]}
                      </p>

                      <div className="grid grid-cols-2 gap-3">
                        {type.features.map((feature, i) => (
                          <div key={i} className="flex items-center gap-2">
                            <span className="text-xl">{feature.icon}</span>
                            <span className="text-sm text-gray-700 dark:text-gray-300">{feature[locale]}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Examples Column */}
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white mb-4">
                        {isAr ? 'أمثلة:' : 'Examples:'}
                      </h4>
                      <div className="space-y-3">
                        {type.examples.map((example, i) => (
                          <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                            <p className="font-semibold text-gray-900 dark:text-white text-sm mb-1">
                              {example.name}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              {example.location}
                            </p>
                            {example.stars && (
                              <div className="flex gap-1 mt-2">
                                {[...Array(example.stars)].map((_, j) => (
                                  <svg key={j} className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                  </svg>
                                ))}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          4. Best Time to Visit Section (متطلبات PDF: 4)
          ═══════════════════════════════════════════════════════════════ */}
      <section id="time" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Section Title */}
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 rounded-full text-sm font-semibold mb-4">
              📅 {isAr ? 'أفضل وقت للزيارة' : 'Best Time to Visit'}
            </div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {isAr ? 'خطط' : 'Plan Your'}{' '}
              <span className="text-gradient bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
                {isAr ? 'رحلتك' : 'Trip'}
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {isAr ? 'دليل شهري للطقس وأفضل الأوقات للزيارة' : 'Monthly weather guide and best times to visit'}
            </p>
          </div>

          {/* Month Selector */}
          <div className="grid grid-cols-6 md:grid-cols-12 gap-2 mb-12">
            {[
              { id: 1, name: { ar: 'يناير', en: 'Jan' }, color: 'from-green-500 to-emerald-600' },
              { id: 2, name: { ar: 'فبراير', en: 'Feb' }, color: 'from-green-500 to-emerald-600' },
              { id: 3, name: { ar: 'مارس', en: 'Mar' }, color: 'from-green-500 to-emerald-600' },
              { id: 4, name: { ar: 'أبريل', en: 'Apr' }, color: 'from-blue-500 to-cyan-600' },
              { id: 5, name: { ar: 'مايو', en: 'May' }, color: 'from-yellow-500 to-orange-600' },
              { id: 6, name: { ar: 'يونيو', en: 'Jun' }, color: 'from-red-500 to-rose-600' },
              { id: 7, name: { ar: 'يوليو', en: 'Jul' }, color: 'from-red-500 to-rose-600' },
              { id: 8, name: { ar: 'أغسطس', en: 'Aug' }, color: 'from-red-500 to-rose-600' },
              { id: 9, name: { ar: 'سبتمبر', en: 'Sep' }, color: 'from-orange-500 to-red-600' },
              { id: 10, name: { ar: 'أكتوبر', en: 'Oct' }, color: 'from-blue-500 to-cyan-600' },
              { id: 11, name: { ar: 'نوفمبر', en: 'Nov' }, color: 'from-green-500 to-emerald-600' },
              { id: 12, name: { ar: 'ديسمبر', en: 'Dec' }, color: 'from-green-500 to-emerald-600' }
            ].map(month => (
              <button
                key={month.id}
                onClick={() => setSelectedMonth(month.id)}
                className={`py-3 px-2 rounded-xl font-semibold text-sm transition-all ${
                  selectedMonth === month.id
                    ? `bg-gradient-to-r ${month.color} text-white shadow-lg scale-110`
                    : 'bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:shadow-md'
                }`}
              >
                {month.name[locale]}
              </button>
            ))}
          </div>

          {/* Seasons Overview */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {/* Peak Season */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-8 rounded-2xl border-2 border-green-400 dark:border-green-600">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-5xl">⭐</span>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {isAr ? 'موسم الذروة' : 'Peak Season'}
                  </h3>
                  <p className="text-green-700 dark:text-green-400 font-semibold">
                    {isAr ? 'أكتوبر - مارس' : 'October - March'}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-green-900 dark:text-green-300 mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {isAr ? 'المميزات:' : 'Pros:'}
                  </h4>
                  <ul className="space-y-2">
                    {[
                      { ar: 'طقس مثالي (24-29°C)', en: 'Perfect weather (24-29°C)' },
                      { ar: 'بحر هادئ مثالي للسباحة', en: 'Calm sea perfect for swimming' },
                      { ar: 'جميع الأنشطة متاحة', en: 'All activities available' },
                      { ar: 'رؤية واضحة للنجوم', en: 'Clear stargazing' }
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-green-800 dark:text-green-300">
                        <span>•</span>
                        <span>{item[locale]}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-green-900 dark:text-green-300 mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {isAr ? 'العيوب:' : 'Cons:'}
                  </h4>
                  <ul className="space-y-2">
                    {[
                      { ar: 'أسعار أعلى (20-30%)', en: 'Higher prices (20-30%)' },
                      { ar: 'حجز مبكر ضروري', en: 'Early booking required' },
                      { ar: 'مزدحم نسبياً', en: 'Relatively crowded' }
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-green-800 dark:text-green-300">
                        <span>•</span>
                        <span>{item[locale]}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Off Season */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 p-8 rounded-2xl border-2 border-red-400 dark:border-red-600">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-5xl">⚠️</span>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                    {isAr ? 'موسم منخفض' : 'Off Season'}
                  </h3>
                  <p className="text-red-700 dark:text-red-400 font-semibold">
                    {isAr ? 'يونيو - سبتمبر' : 'June - September'}
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h4 className="font-bold text-red-900 dark:text-red-300 mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {isAr ? 'المميزات:' : 'Pros:'}
                  </h4>
                  <ul className="space-y-2">
                    {[
                      { ar: 'أسعار منخفضة (30-40%)', en: 'Lower prices (30-40%)' },
                      { ar: 'هدوء وخصوصية تامة', en: 'Peace and total privacy' },
                      { ar: 'سهولة الحجوزات', en: 'Easy bookings' }
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-red-800 dark:text-red-300">
                        <span>•</span>
                        <span>{item[locale]}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="font-bold text-red-900 dark:text-red-300 mb-2 flex items-center gap-2">
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    {isAr ? 'العيوب:' : 'Cons:'}
                  </h4>
                  <ul className="space-y-2">
                    {[
                      { ar: 'رياح موسمية قوية', en: 'Strong monsoon winds' },
                      { ar: 'رحلات جوية محدودة', en: 'Limited flights' },
                      { ar: 'بحر مضطرب - سباحة خطرة', en: 'Rough sea - dangerous swimming' },
                      { ar: 'بعض الأنشطة غير متاحة', en: 'Some activities unavailable' }
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-2 text-red-800 dark:text-red-300">
                        <span>•</span>
                        <span>{item[locale]}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Temperature Chart Visual */}
          <div className="bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-xl">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
              {isAr ? 'متوسط درجات الحرارة على مدار العام' : 'Average Temperatures Throughout the Year'}
            </h3>
            <div className="flex items-end justify-between gap-2 h-64">
              {[24, 25, 27, 29, 31, 33, 34, 33, 31, 29, 26, 24].map((temp, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-2">
                  <div className="text-xs font-semibold text-gray-600 dark:text-gray-400">{temp}°C</div>
                  <div
                    className={`w-full rounded-t-lg transition-all ${
                      temp <= 27 ? 'bg-gradient-to-t from-green-400 to-green-600' :
                      temp <= 30 ? 'bg-gradient-to-t from-yellow-400 to-orange-500' :
                      'bg-gradient-to-t from-red-400 to-red-600'
                    }`}
                    style={{ height: `${(temp - 20) * 10}%` }}
                  ></div>
                  <div className="text-xs font-semibold text-gray-700 dark:text-gray-300">
                    {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          5. Safety Tips Section (متطلبات PDF: 5)
          ═══════════════════════════════════════════════════════════════ */}
      <section id="safety" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Section Title */}
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-full text-sm font-semibold mb-4">
              🛡️ {isAr ? 'نصائح السلامة' : 'Safety Tips'}
            </div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {isAr ? 'سلامتك' : 'Your Safety'}{' '}
              <span className="text-gradient bg-gradient-to-r from-red-600 to-rose-600 bg-clip-text text-transparent">
                {isAr ? 'أولوية' : 'First'}
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {isAr ? 'نصائح مهمة لرحلة آمنة وممتعة' : 'Important tips for safe and enjoyable trip'}
            </p>
          </div>

          {/* Safety Categories */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {[
              {
                category: { ar: 'الصحة والنظافة', en: 'Health & Hygiene' },
                icon: '🏥',
                gradient: 'from-red-500 to-rose-600',
                tips: [
                  { ar: 'احصل على تأمين صحي شامل قبل السفر', en: 'Get comprehensive health insurance before travel' },
                  { ar: 'أحضر صيدلية سفر كاملة وأدويتك الشخصية', en: 'Bring complete travel pharmacy and personal medications' },
                  { ar: 'اشرب مياه معبأة فقط - لا تشرب ماء الصنبور', en: 'Drink bottled water only - no tap water' },
                  { ar: 'استخدم واقي شمس قوي SPF 50+', en: 'Use strong sunscreen SPF 50+' },
                  { ar: 'ارتدِ قبعة ونظارة شمسية', en: 'Wear hat and sunglasses' }
                ]
              },
              {
                category: { ar: 'الأمان الشخصي', en: 'Personal Security' },
                icon: '🔒',
                gradient: 'from-blue-500 to-indigo-600',
                tips: [
                  { ar: 'احتفظ بنسخ من جواز سفرك ووثائقك', en: 'Keep copies of passport and documents' },
                  { ar: 'لا تسافر بمفردك في الليل', en: 'Don\'t travel alone at night' },
                  { ar: 'استخدم مرشد محلي موثوق', en: 'Use trusted local guide' },
                  { ar: 'أبلغ الفندق بخطط سفرك اليومية', en: 'Inform hotel of daily travel plans' },
                  { ar: 'احمل هاتفك محمولاً دائماً', en: 'Keep phone charged always' }
                ]
              },
              {
                category: { ar: 'البيئة والطبيعة', en: 'Environment & Nature' },
                icon: '🌿',
                gradient: 'from-green-500 to-emerald-600',
                tips: [
                  { ar: 'لا تلمس النباتات النادرة أو دم الأخوين', en: 'Don\'t touch rare plants or dragon blood trees' },
                  { ar: 'خذ قمامتك معك - حافظ على نظافة البيئة', en: 'Take trash with you - keep environment clean' },
                  { ar: 'ابقَ على الممرات المحددة', en: 'Stay on marked paths' },
                  { ar: 'لا تطعم الحيوانات البرية', en: 'Don\'t feed wild animals' },
                  { ar: 'احترم المحميات الطبيعية', en: 'Respect nature reserves' }
                ]
              },
              {
                category: { ar: 'الثقافة والعادات', en: 'Culture & Customs' },
                icon: '🕌',
                gradient: 'from-purple-500 to-pink-600',
                tips: [
                  { ar: 'احترم العادات والتقاليد المحلية', en: 'Respect local customs and traditions' },
                  { ar: 'البس ملابس محتشمة خاصة في القرى', en: 'Dress modestly especially in villages' },
                  { ar: 'اطلب إذناً قبل تصوير الأشخاص', en: 'Ask permission before photographing people' },
                  { ar: 'تعلم بعض الكلمات السقطرية الأساسية', en: 'Learn basic Soqotri words' },
                  { ar: 'كن صبوراً ومهذباً', en: 'Be patient and polite' }
                ]
              }
            ].map((cat, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700">
                <div className={`h-2 bg-gradient-to-r ${cat.gradient}`}></div>
                
                <div className="p-8">
                  <div className="flex items-center gap-4 mb-6">
                    <div className={`w-16 h-16 bg-gradient-to-br ${cat.gradient} rounded-2xl flex items-center justify-center text-4xl`}>
                      {cat.icon}
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                      {cat.category[locale]}
                    </h3>
                  </div>

                  <ul className="space-y-3">
                    {cat.tips.map((tip, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700 dark:text-gray-300">{tip[locale]}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>

          {/* Emergency Contacts */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 p-8 rounded-2xl border-2 border-red-300 dark:border-red-700">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
              <span className="w-12 h-12 bg-gradient-to-r from-red-500 to-rose-600 rounded-xl flex items-center justify-center text-white text-2xl">
                🚨
              </span>
              {isAr ? 'أرقام الطوارئ' : 'Emergency Contacts'}
            </h3>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                { name: { ar: 'الشرطة', en: 'Police' }, number: '199', icon: '👮' },
                { name: { ar: 'الإسعاف', en: 'Ambulance' }, number: '191', icon: '🚑' },
                { name: { ar: 'Hawari Tours', en: 'Hawari Tours' }, number: '+967 772 371 581', icon: '📞' }
              ].map((contact, i) => (
                <a
                  key={i}
                  href={`tel:${contact.number.replace(/\s/g, '')}`}
                  className="bg-white dark:bg-gray-800 p-6 rounded-xl border-2 border-red-200 dark:border-red-800 hover:border-red-400 dark:hover:border-red-600 transition-all hover:shadow-lg"
                >
                  <div className="text-center">
                    <div className="text-4xl mb-2">{contact.icon}</div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">{contact.name[locale]}</h4>
                    <p className="text-2xl font-bold text-red-600 dark:text-red-400">{contact.number}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          Packing List Section (إضافة احترافية)
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {isAr ? 'قائمة الأمتعة' : 'Packing List'}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {isAr ? 'لا تنسى هذه الأشياء الضرورية' : 'Don\'t forget these essentials'}
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-6">
            {[
              {
                category: { ar: 'الملابس', en: 'Clothing' },
                icon: '👕',
                items: [
                  { ar: 'ملابس خفيفة', en: 'Light clothes' },
                  { ar: 'سترة للمساء', en: 'Evening jacket' },
                  { ar: 'حذاء مشي', en: 'Walking shoes' },
                  { ar: 'قبعة', en: 'Hat' }
                ]
              },
              {
                category: { ar: 'المستلزمات', en: 'Essentials' },
                icon: '🎒',
                items: [
                  { ar: 'واقي شمس', en: 'Sunscreen' },
                  { ar: 'نظارة شمسية', en: 'Sunglasses' },
                  { ar: 'كاميرا', en: 'Camera' },
                  { ar: 'باور بانك', en: 'Power bank' }
                ]
              },
              {
                category: { ar: 'الصحة', en: 'Health' },
                icon: '💊',
                items: [
                  { ar: 'أدوية شخصية', en: 'Personal meds' },
                  { ar: 'مسكنات', en: 'Pain relievers' },
                  { ar: 'مطهر', en: 'Antiseptic' },
                  { ar: 'لاصقات جروح', en: 'Band-aids' }
                ]
              },
              {
                category: { ar: 'إلكترونيات', en: 'Electronics' },
                icon: '📱',
                items: [
                  { ar: 'هاتف محمول', en: 'Phone' },
                  { ar: 'شاحن', en: 'Charger' },
                  { ar: 'محول كهرباء', en: 'Power adapter' },
                  { ar: 'سماعات', en: 'Headphones' }
                ]
              }
            ].map((cat, i) => (
              <div key={i} className="bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-lg">
                <div className="text-4xl mb-4 text-center">{cat.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 text-center">
                  {cat.category[locale]}
                </h3>
                <ul className="space-y-2">
                  {cat.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                      <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {item[locale]}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          CTA Section
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {isAr ? 'جاهز لرحلتك إلى سقطرى؟' : 'Ready for Your Socotra Adventure?'}
          </h2>

          <p className="text-xl mb-12 opacity-90">
            {isAr
              ? 'دعنا نساعدك في التخطيط لرحلة العمر - تواصل معنا الآن'
              : 'Let us help you plan the trip of a lifetime - contact us now'}
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="/tours"
              className="btn text-lg px-8 py-4 bg-white text-cyan-600 hover:bg-gray-100 transform hover:scale-105 transition-all shadow-2xl"
            >
              {isAr ? 'تصفح الرحلات' : 'Browse Tours'}
            </a>

            <a
              href="/contact"
              className="btn text-lg px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-cyan-600 transform hover:scale-105 transition-all"
            >
              {isAr ? 'تواصل معنا' : 'Contact Us'}
            </a>

            <a
              href="https://wa.me/967772371581"
              target="_blank"
              rel="noopener noreferrer"
              className="btn text-lg px-8 py-4 bg-green-500 text-white hover:bg-green-600 transform hover:scale-105 transition-all shadow-2xl flex items-center gap-2"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              {isAr ? 'واتساب' : 'WhatsApp'}
            </a>
          </div>
        </div>
      </section>
      <WhatsAppButton />
    </div>
  )
}