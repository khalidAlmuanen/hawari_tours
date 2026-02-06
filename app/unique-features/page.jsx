'use client'

// ═══════════════════════════════════════════════════════════════════════
// 🌟 Unique Features Page - PART 1 (Hero + Data)
// المرحلة 8: الميزات الفريدة - احترافي جداً وعصري
// ═══════════════════════════════════════════════════════════════════════

import { useState } from 'react'
import { useApp } from '@/contexts/AppContext'
import WhatsAppButton from '@/components/WhatsAppButton'

export default function UniqueFeaturesPage() {
  const { locale, isDark } = useApp()
  const isAr = locale === 'ar'

  const [activeFeature, setActiveFeature] = useState('dragons-blood')
  const [selectedAnimal, setSelectedAnimal] = useState(null)

  // ═══════════════════════════════════════════════════════════════
  // Stats Overview - إحصائيات سريعة
  // ═══════════════════════════════════════════════════════════════
  const stats = [
    {
      number: '700+',
      label: { ar: 'نوع متوطن', en: 'Endemic Species' },
      icon: '🌿',
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      number: '37%',
      label: { ar: 'نباتات فريدة', en: 'Unique Plants' },
      icon: '🌺',
      gradient: 'from-pink-500 to-rose-600'
    },
    {
      number: '90%',
      label: { ar: 'زواحف متوطنة', en: 'Endemic Reptiles' },
      icon: '🦎',
      gradient: 'from-orange-500 to-red-600'
    },
    {
      number: '10',
      label: { ar: 'أنواع طيور فريدة', en: 'Unique Bird Species' },
      icon: '🦅',
      gradient: 'from-blue-500 to-cyan-600'
    }
  ]

  // ═══════════════════════════════════════════════════════════════
  // 1. Dragon's Blood Trees (متطلبات PDF)
  // ═══════════════════════════════════════════════════════════════
  const dragonBloodTrees = {
    id: 'dragons-blood',
    title: { ar: 'شجرة دم الأخوين', en: 'Dragon\'s Blood Tree' },
    scientificName: 'Dracaena cinnabari',
    icon: '🌳',
    gradient: 'from-red-500 via-orange-500 to-yellow-500',

    intro: {
      ar: 'الشجرة الأيقونية لسقطرى - رمز الجزيرة الخالد',
      en: 'Socotra\'s Iconic Tree - The Island\'s Eternal Symbol'
    },

    description: {
      ar: 'شجرة دم الأخوين هي أشهر رموز سقطرى وأكثرها تميزاً. بشكلها الفريد الذي يشبه المظلة المقلوبة، تُعتبر من أقدم الأشجار على وجه الأرض. تُنتج راتنجاً أحمر اللون كان يُستخدم منذ آلاف السنين في الطب والصبغ والبخور.',
      en: 'Dragon\'s Blood Tree is Socotra\'s most famous and distinctive symbol. With its unique umbrella-shaped canopy, it\'s one of the oldest trees on Earth. It produces red resin used for thousands of years in medicine, dyes, and incense.'
    },

    facts: [
      {
        title: { ar: 'العمر', en: 'Age' },
        value: { ar: 'يصل إلى 650 سنة', en: 'Up to 650 years' },
        icon: '⏳'
      },
      {
        title: { ar: 'الارتفاع', en: 'Height' },
        value: { ar: '5-10 متر', en: '5-10 meters' },
        icon: '📏'
      },
      {
        title: { ar: 'الراتنج', en: 'Resin' },
        value: { ar: 'أحمر داكن', en: 'Dark Red' },
        icon: '💉'
      },
      {
        title: { ar: 'الموطن', en: 'Habitat' },
        value: { ar: 'جبال حجر', en: 'Haggier Mountains' },
        icon: '🏔️'
      }
    ],

    uses: {
      title: { ar: 'الاستخدامات التاريخية', en: 'Historical Uses' },
      items: [
        {
          use: { ar: 'الطب التقليدي', en: 'Traditional Medicine' },
          description: {
            ar: 'علاج الجروح والقرحات والالتهابات',
            en: 'Treating wounds, ulcers, and inflammations'
          },
          icon: '💊'
        },
        {
          use: { ar: 'الصبغة', en: 'Dye' },
          description: {
            ar: 'صبغ الأقمشة والجلود باللون الأحمر',
            en: 'Dyeing fabrics and leather red'
          },
          icon: '🎨'
        },
        {
          use: { ar: 'البخور', en: 'Incense' },
          description: {
            ar: 'يُستخدم في الطقوس الدينية والاحتفالات',
            en: 'Used in religious rituals and celebrations'
          },
          icon: '🔥'
        },
        {
          use: { ar: 'مستحضرات التجميل', en: 'Cosmetics' },
          description: {
            ar: 'في العناية بالبشرة والشعر',
            en: 'In skincare and haircare'
          },
          icon: '💄'
        }
      ]
    },

    conservation: {
      status: { ar: 'مهدد بالانقراض', en: 'Vulnerable' },
      threats: [
        { ar: 'الرعي الجائر', en: 'Overgrazing' },
        { ar: 'تغير المناخ', en: 'Climate change' },
        { ar: 'قطع الأشجار', en: 'Tree cutting' },
        { ar: 'قلة التجديد الطبيعي', en: 'Low natural regeneration' }
      ],
      efforts: {
        ar: 'جهود حماية مكثفة من قبل اليونسكو والسلطات المحلية',
        en: 'Intensive protection efforts by UNESCO and local authorities'
      }
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // 2. White Sand Beaches (متطلبات PDF)
  // ═══════════════════════════════════════════════════════════════
  const beaches = {
    id: 'beaches',
    title: { ar: 'الشواطئ الرملية البيضاء', en: 'White Sand Beaches' },
    icon: '🏖️',
    gradient: 'from-cyan-400 via-blue-400 to-indigo-500',

    intro: {
      ar: 'شواطئ بيضاء نقية تمتد لكيلومترات - جنة استوائية حقيقية',
      en: 'Pristine white beaches stretching for kilometers - a true tropical paradise'
    },

    description: {
      ar: 'تتميز سقطرى بشواطئ رملية بيضاء ناعمة ومياه فيروزية صافية. هذه الشواطئ الخلابة غير المزدحمة توفر تجربة استوائية نادرة، مع فرص رائعة للسباحة والغطس واستكشاف الحياة البحرية الغنية.',
      en: 'Socotra features soft white sandy beaches and crystal-clear turquoise waters. These stunning uncrowded beaches offer a rare tropical experience, with excellent opportunities for swimming, snorkeling, and exploring rich marine life.'
    },

    topBeaches: [
      {
        id: 1,
        name: { ar: 'شاطئ ديحمري', en: 'Detwah Lagoon' },
        description: {
          ar: 'لاجون ساحر مع كثبان رملية بيضاء ومياه ضحلة هادئة',
          en: 'Enchanting lagoon with white sand dunes and calm shallow waters'
        },
        activities: [
          { ar: 'سباحة', en: 'Swimming' },
          { ar: 'غطس', en: 'Snorkeling' },
          { ar: 'تصوير', en: 'Photography' }
        ],
        bestTime: { ar: 'أكتوبر - أبريل', en: 'October - April' },
        rating: 5,
        gradient: 'from-cyan-500 to-blue-600'
      },
      {
        id: 2,
        name: { ar: 'شاطئ قلنسية', en: 'Qalansiyah Beach' },
        description: {
          ar: 'شاطئ طويل بمياه فيروزية صافية مثالي للسباحة والاسترخاء',
          en: 'Long beach with crystal turquoise waters perfect for swimming and relaxation'
        },
        activities: [
          { ar: 'سباحة', en: 'Swimming' },
          { ar: 'استكشاف', en: 'Exploration' },
          { ar: 'شروق/غروب', en: 'Sunrise/Sunset' }
        ],
        bestTime: { ar: 'نوفمبر - مارس', en: 'November - March' },
        rating: 5,
        gradient: 'from-blue-500 to-indigo-600'
      },
      {
        id: 3,
        name: { ar: 'شاطئ عرعر', en: 'Arher Beach' },
        description: {
          ar: 'شاطئ محمي بكثبان رملية ضخمة وأشجار استوائية',
          en: 'Beach protected by massive sand dunes and tropical trees'
        },
        activities: [
          { ar: 'تخييم', en: 'Camping' },
          { ar: 'مشي', en: 'Walking' },
          { ar: 'استرخاء', en: 'Relaxation' }
        ],
        bestTime: { ar: 'ديسمبر - مارس', en: 'December - March' },
        rating: 5,
        gradient: 'from-orange-500 to-red-600'
      },
      {
        id: 4,
        name: { ar: 'شاطئ ديحمري البحري', en: 'Dihamri Marine Beach' },
        description: {
          ar: 'منطقة محمية بحرياً مع شعاب مرجانية غنية وحياة بحرية متنوعة',
          en: 'Marine protected area with rich coral reefs and diverse marine life'
        },
        activities: [
          { ar: 'غطس', en: 'Snorkeling' },
          { ar: 'غوص', en: 'Diving' },
          { ar: 'مراقبة أسماك', en: 'Fish watching' }
        ],
        bestTime: { ar: 'طوال العام', en: 'Year-round' },
        rating: 5,
        gradient: 'from-teal-500 to-cyan-600'
      }
    ],

    marineLife: {
      title: { ar: 'الحياة البحرية', en: 'Marine Life' },
      species: [
        { name: { ar: 'سلاحف بحرية', en: 'Sea Turtles' }, icon: '🐢' },
        { name: { ar: 'دلافين', en: 'Dolphins' }, icon: '🐬' },
        { name: { ar: 'أسماك ملونة', en: 'Colorful Fish' }, icon: '🐠' },
        { name: { ar: 'شعاب مرجانية', en: 'Coral Reefs' }, icon: '🪸' },
        { name: { ar: 'قروش الشعاب', en: 'Reef Sharks' }, icon: '🦈' },
        { name: { ar: 'أخطبوط', en: 'Octopus' }, icon: '🐙' }
      ]
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // 3. Caves and Mountains (متطلبات PDF)
  // ═══════════════════════════════════════════════════════════════
  const cavesAndMountains = {
    id: 'caves-mountains',
    title: { ar: 'الكهوف والجبال', en: 'Caves and Mountains' },
    icon: '⛰️',
    gradient: 'from-gray-600 via-slate-600 to-stone-700',

    intro: {
      ar: 'تضاريس دراماتيكية من الجبال الشاهقة والكهوف الغامضة',
      en: 'Dramatic landscapes of towering mountains and mysterious caves'
    },

    mountains: {
      title: { ar: 'جبال حجر', en: 'Haggier Mountains' },
      description: {
        ar: 'سلسلة جبلية مذهلة في وسط الجزيرة، موطن للعديد من الأنواع المتوطنة',
        en: 'Stunning mountain range in island center, home to many endemic species'
      },
      peak: { ar: 'جبل سمحان - 1525 متر', en: 'Mount Samhan - 1,525m' },
      features: [
        {
          title: { ar: 'مناظر بانورامية', en: 'Panoramic Views' },
          description: {
            ar: 'إطلالات خلابة على الجزيرة بأكملها',
            en: 'Breathtaking views of entire island'
          },
          icon: '🏞️'
        },
        {
          title: { ar: 'غابات دم الأخوين', en: 'Dragon Blood Forests' },
          description: {
            ar: 'تجمعات كبيرة من أشجار دم الأخوين الأسطورية',
            en: 'Large concentrations of legendary dragon blood trees'
          },
          icon: '🌲'
        },
        {
          title: { ar: 'مسارات المشي', en: 'Hiking Trails' },
          description: {
            ar: 'مسارات متنوعة لجميع المستويات',
            en: 'Varied trails for all levels'
          },
          icon: '🥾'
        }
      ]
    },

    caves: {
      title: { ar: 'الكهوف الرائعة', en: 'Amazing Caves' },
      famous: [
        {
          id: 1,
          name: { ar: 'كهف هوق', en: 'Hoq Cave' },
          description: {
            ar: 'كهف ضخم بطول 3 كم مع نقوش تاريخية قديمة وتشكيلات صخرية مذهلة',
            en: '3km giant cave with ancient historical inscriptions and stunning rock formations'
          },
          depth: '250m',
          highlights: [
            { ar: 'نقوش قديمة (يونانية، هندية، سقطرية)', en: 'Ancient inscriptions (Greek, Indian, Soqotri)' },
            { ar: 'تشكيلات الصواعد والهوابط', en: 'Stalagmites and stalactites formations' },
            { ar: 'بحيرات تحت أرضية', en: 'Underground lakes' },
            { ar: 'خفافيش نادرة', en: 'Rare bats' }
          ],
          difficulty: { ar: 'متوسط - صعب', en: 'Moderate - Difficult' },
          duration: { ar: '3-4 ساعات', en: '3-4 hours' },
          gradient: 'from-purple-600 to-indigo-700'
        },
        {
          id: 2,
          name: { ar: 'كهف دي جوب', en: 'Dagub Cave' },
          description: {
            ar: 'كهف كبير بتشكيلات صخرية طبيعية رائعة',
            en: 'Large cave with magnificent natural rock formations'
          },
          depth: '150m',
          highlights: [
            { ar: 'تشكيلات حجرية فريدة', en: 'Unique stone formations' },
            { ar: 'ممرات واسعة', en: 'Wide passages' },
            { ar: 'سهل الاستكشاف', en: 'Easy to explore' }
          ],
          difficulty: { ar: 'سهل', en: 'Easy' },
          duration: { ar: '1-2 ساعة', en: '1-2 hours' },
          gradient: 'from-blue-600 to-cyan-700'
        },
        {
          id: 3,
          name: { ar: 'كهف ديحمري', en: 'Dihamri Cave' },
          description: {
            ar: 'كهف ساحلي بإطلالة على البحر',
            en: 'Coastal cave with sea view'
          },
          depth: '50m',
          highlights: [
            { ar: 'إطلالة بحرية', en: 'Sea view' },
            { ar: 'موقع غطس قريب', en: 'Nearby snorkel site' },
            { ar: 'سهل الوصول', en: 'Easy access' }
          ],
          difficulty: { ar: 'سهل جداً', en: 'Very Easy' },
          duration: { ar: '30 دقيقة', en: '30 minutes' },
          gradient: 'from-teal-600 to-green-700'
        }
      ]
    }
  }

  // باقي البيانات في PART1 تابع...

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[700px] overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-emerald-600 to-teal-600" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
          
          {/* Animated Shapes */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute bottom-20 right-20 w-96 h-96 bg-white/10 rounded-full blur-3xl animate-pulse" style={{animationDelay: '1s'}}></div>
          </div>
        </div>

        {/* Content */}
        <div className="relative h-full flex items-center z-10">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full mb-6 animate-fade-in">
                <svg className="w-5 h-5 text-emerald-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <span className="text-white font-semibold">
                  {isAr ? 'لن تجدها في أي مكان آخر على الأرض' : 'Found nowhere else on Earth'}
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-slide-in-up">
                {isAr ? 'ميزات' : 'Unique'}
                <br />
                <span className="text-gradient bg-gradient-to-r from-emerald-300 via-green-300 to-teal-300 bg-clip-text text-transparent">
                  {isAr ? 'فريدة' : 'Features'}
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-white/90 mb-8 animate-slide-in-up" style={{animationDelay: '0.1s'}}>
                {isAr
                  ? 'اكتشف عجائب الطبيعة التي جعلت سقطرى أكثر الجزر تميزاً في العالم'
                  : 'Discover the natural wonders that make Socotra the world\'s most unique island'}
              </p>

              <div className="flex gap-4 animate-fade-in" style={{animationDelay: '0.2s'}}>
                <a href="#dragons-blood" className="btn btn-primary px-8 py-4 text-lg">
                  {isAr ? 'استكشف الآن' : 'Explore Now'}
                </a>
                <a href="#wildlife" className="btn btn-outline border-white text-white hover:bg-white hover:text-green-600 px-8 py-4 text-lg">
                  {isAr ? 'الحياة البرية' : 'Wildlife'}
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

      {/* Stats Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800 -mt-20 relative z-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br ${stat.gradient} p-6 rounded-2xl shadow-xl text-center transform hover:scale-105 transition-all animate-fade-in text-white`}
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="text-5xl mb-3">{stat.icon}</div>
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-sm opacity-90">{stat.label[locale]}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          Feature Navigation Tabs
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-8 bg-white dark:bg-gray-800 sticky top-0 z-40 border-b border-gray-200 dark:border-gray-700 shadow-md">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex overflow-x-auto gap-4 pb-2">
            {[
              { id: 'dragons-blood', label: { ar: 'دم الأخوين', en: 'Dragon\'s Blood' }, icon: '🌳' },
              { id: 'beaches', label: { ar: 'الشواطئ', en: 'Beaches' }, icon: '🏖️' },
              { id: 'caves-mountains', label: { ar: 'كهوف وجبال', en: 'Caves & Mountains' }, icon: '⛰️' },
              { id: 'wildlife', label: { ar: 'الحياة البرية', en: 'Wildlife' }, icon: '🦎' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveFeature(tab.id)
                  document.getElementById(tab.id)?.scrollIntoView({ behavior: 'smooth' })
                }}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all ${
                  activeFeature === tab.id
                    ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg scale-105'
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
          1. Dragon's Blood Trees Section (متطلبات PDF)
          ═══════════════════════════════════════════════════════════════ */}
      <section id="dragons-blood" className="py-20 bg-gradient-to-b from-orange-50 to-red-50 dark:from-orange-900/10 dark:to-red-900/10">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Section Title */}
          <div className="text-center mb-16">
            <div className={`inline-block px-6 py-3 bg-gradient-to-r ${dragonBloodTrees.gradient} text-white rounded-full text-sm font-semibold mb-4`}>
              {dragonBloodTrees.icon} {dragonBloodTrees.title[locale]}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {dragonBloodTrees.intro[locale]}
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 font-mono">
              {dragonBloodTrees.scientificName}
            </p>
          </div>

          {/* Main Description */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12 mb-12 border border-gray-200 dark:border-gray-700">
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed mb-8">
              {dragonBloodTrees.description[locale]}
            </p>

            {/* Facts Grid */}
            <div className="grid md:grid-cols-4 gap-6">
              {dragonBloodTrees.facts.map((fact, index) => (
                <div key={index} className="bg-gradient-to-br from-orange-50 to-red-50 dark:from-orange-900/20 dark:to-red-900/20 p-6 rounded-xl border border-orange-200 dark:border-orange-800 text-center">
                  <div className="text-4xl mb-3">{fact.icon}</div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">{fact.title[locale]}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{fact.value[locale]}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Historical Uses */}
          <div className="mb-12">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              {dragonBloodTrees.uses.title[locale]}
            </h3>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {dragonBloodTrees.uses.items.map((item, index) => (
                <div key={index} className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 hover:shadow-2xl transition-all transform hover:-translate-y-2">
                  <div className="text-5xl mb-4 text-center">{item.icon}</div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-3 text-center">
                    {item.use[locale]}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                    {item.description[locale]}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Conservation Status */}
          <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-l-4 border-red-500 p-8 rounded-lg">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-orange-600 rounded-2xl flex items-center justify-center text-white text-3xl flex-shrink-0">
                ⚠️
              </div>
              <div className="flex-1">
                <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {isAr ? 'حالة الحفظ:' : 'Conservation Status:'} 
                  <span className="text-red-600 dark:text-red-400 mx-2">{dragonBloodTrees.conservation.status[locale]}</span>
                </h4>

                <div className="mb-4">
                  <h5 className="font-bold text-gray-800 dark:text-gray-200 mb-2">
                    {isAr ? 'التهديدات الرئيسية:' : 'Main Threats:'}
                  </h5>
                  <div className="flex flex-wrap gap-2">
                    {dragonBloodTrees.conservation.threats.map((threat, i) => (
                      <span key={i} className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-300 border border-red-200 dark:border-red-800">
                        {threat[locale]}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 rounded">
                  <p className="text-green-800 dark:text-green-300 font-semibold">
                    ✓ {dragonBloodTrees.conservation.efforts[locale]}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          2. White Sand Beaches Section (متطلبات PDF)
          ═══════════════════════════════════════════════════════════════ */}
      <section id="beaches" className="py-20 bg-gradient-to-b from-cyan-50 to-blue-50 dark:from-cyan-900/10 dark:to-blue-900/10">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Section Title */}
          <div className="text-center mb-16">
            <div className={`inline-block px-6 py-3 bg-gradient-to-r ${beaches.gradient} text-white rounded-full text-sm font-semibold mb-4`}>
              {beaches.icon} {beaches.title[locale]}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {beaches.intro[locale]}
            </h2>
          </div>

          {/* Main Description */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 mb-12 border border-gray-200 dark:border-gray-700">
            <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed">
              {beaches.description[locale]}
            </p>
          </div>

          {/* Top Beaches Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {beaches.topBeaches.map((beach) => (
              <div key={beach.id} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2">
                <div className={`h-3 bg-gradient-to-r ${beach.gradient}`}></div>
                
                <div className="p-8">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {beach.name[locale]}
                    </h3>
                    <div className="flex gap-1">
                      {[...Array(beach.rating)].map((_, i) => (
                        <svg key={i} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                    {beach.description[locale]}
                  </p>

                  <div className="mb-4">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-3 text-sm">
                      {isAr ? 'الأنشطة:' : 'Activities:'}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {beach.activities.map((activity, i) => (
                        <span key={i} className="px-3 py-1 bg-cyan-100 dark:bg-cyan-900/30 text-cyan-700 dark:text-cyan-400 rounded-full text-sm font-semibold">
                          {activity[locale]}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                    <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                    </svg>
                    <span className="font-semibold">{beach.bestTime[locale]}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Marine Life */}
          <div className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl shadow-2xl p-8 md:p-12 text-white">
            <h3 className="text-3xl font-bold mb-8 text-center">
              {beaches.marineLife.title[locale]}
            </h3>

            <div className="grid grid-cols-3 md:grid-cols-6 gap-6">
              {beaches.marineLife.species.map((species, i) => (
                <div key={i} className="text-center transform hover:scale-110 transition-all">
                  <div className="text-5xl mb-2">{species.icon}</div>
                  <p className="text-sm font-semibold">{species.name[locale]}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          3. Caves and Mountains Section (متطلبات PDF)
          ═══════════════════════════════════════════════════════════════ */}
      <section id="caves-mountains" className="py-20 bg-gradient-to-b from-gray-50 to-slate-50 dark:from-gray-800 dark:to-slate-900">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Section Title */}
          <div className="text-center mb-16">
            <div className={`inline-block px-6 py-3 bg-gradient-to-r ${cavesAndMountains.gradient} text-white rounded-full text-sm font-semibold mb-4`}>
              {cavesAndMountains.icon} {cavesAndMountains.title[locale]}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {cavesAndMountains.intro[locale]}
            </h2>
          </div>

          {/* Mountains Section */}
          <div className="mb-16">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-200 dark:border-gray-700">
              <div className="bg-gradient-to-r from-gray-600 to-slate-700 p-8 text-white">
                <h3 className="text-3xl font-bold mb-3">{cavesAndMountains.mountains.title[locale]}</h3>
                <p className="text-lg opacity-90 mb-4">{cavesAndMountains.mountains.description[locale]}</p>
                <div className="inline-block bg-white/20 px-4 py-2 rounded-lg font-bold">
                  ⛰️ {cavesAndMountains.mountains.peak[locale]}
                </div>
              </div>

              <div className="p-8">
                <div className="grid md:grid-cols-3 gap-6">
                  {cavesAndMountains.mountains.features.map((feature, i) => (
                    <div key={i} className="text-center p-6 bg-gray-50 dark:bg-gray-900 rounded-xl">
                      <div className="text-5xl mb-4">{feature.icon}</div>
                      <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {feature.title[locale]}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {feature.description[locale]}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Caves Section */}
          <div>
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              {cavesAndMountains.caves.title[locale]}
            </h3>

            <div className="space-y-8">
              {cavesAndMountains.caves.famous.map((cave) => (
                <div key={cave.id} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl border border-gray-200 dark:border-gray-700">
                  <div className={`h-2 bg-gradient-to-r ${cave.gradient}`}></div>
                  
                  <div className="p-8">
                    <div className="grid md:grid-cols-3 gap-8">
                      {/* Info Column */}
                      <div className="md:col-span-2">
                        <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                          {cave.name[locale]}
                        </h4>

                        <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
                          {cave.description[locale]}
                        </p>

                        <div className="space-y-3">
                          <h5 className="font-bold text-gray-900 dark:text-white">
                            {isAr ? 'المميزات:' : 'Highlights:'}
                          </h5>
                          {cave.highlights.map((highlight, i) => (
                            <div key={i} className="flex items-start gap-2">
                              <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                              </svg>
                              <span className="text-gray-700 dark:text-gray-300">{highlight[locale]}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Details Column */}
                      <div className="space-y-4">
                        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl">
                          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            {isAr ? 'العمق:' : 'Depth:'}
                          </div>
                          <div className="text-2xl font-bold text-gray-900 dark:text-white">
                            {cave.depth}
                          </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl">
                          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            {isAr ? 'الصعوبة:' : 'Difficulty:'}
                          </div>
                          <div className="text-lg font-bold text-gray-900 dark:text-white">
                            {cave.difficulty[locale]}
                          </div>
                        </div>

                        <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-xl">
                          <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                            {isAr ? 'المدة:' : 'Duration:'}
                          </div>
                          <div className="text-lg font-bold text-gray-900 dark:text-white">
                            {cave.duration[locale]}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          4. Endemic Wildlife Section (متطلبات PDF)
          ═══════════════════════════════════════════════════════════════ */}
      <section id="wildlife" className="py-20 bg-gradient-to-b from-green-50 to-emerald-50 dark:from-green-900/10 dark:to-emerald-900/10">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Section Title */}
          <div className="text-center mb-16">
            <div className="inline-block px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full text-sm font-semibold mb-4">
              🦎 {isAr ? 'الحياة البرية المتوطنة' : 'Endemic Wildlife'}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {isAr ? 'حيوانات' : 'Wildlife'}{' '}
              <span className="text-gradient bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {isAr ? 'فريدة' : 'Like Nowhere Else'}
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {isAr 
                ? '90% من الزواحف و37% من النباتات لا توجد في أي مكان آخر على الأرض'
                : '90% of reptiles and 37% of plants found nowhere else on Earth'}
            </p>
          </div>

          {/* Endemic Animals Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {[
              {
                id: 1,
                name: { ar: 'حرباء سقطرى', en: 'Socotra Chameleon' },
                scientific: 'Chamaeleo monachus',
                description: {
                  ar: 'حرباء كبيرة متوطنة بألوان زاهية، تعيش في غابات دم الأخوين',
                  en: 'Large endemic chameleon with vibrant colors, lives in dragon blood forests'
                },
                icon: '🦎',
                status: { ar: 'ضعيف', en: 'Vulnerable' },
                gradient: 'from-lime-500 to-green-600',
                facts: [
                  { ar: 'يصل طولها إلى 25 سم', en: 'Up to 25cm long' },
                  { ar: 'تتغير ألوانها حسب المزاج', en: 'Changes color with mood' },
                  { ar: 'تعيش على الحشرات', en: 'Feeds on insects' }
                ]
              },
              {
                id: 2,
                name: { ar: 'عصفور سقطرى', en: 'Socotra Starling' },
                scientific: 'Onychognathus frater',
                description: {
                  ar: 'طائر متوطن بريش أسود لامع ومنقار برتقالي مميز',
                  en: 'Endemic bird with glossy black plumage and distinctive orange beak'
                },
                icon: '🐦',
                status: { ar: 'أقل قلقاً', en: 'Least Concern' },
                gradient: 'from-blue-500 to-indigo-600',
                facts: [
                  { ar: 'يعيش في المرتفعات', en: 'Lives in highlands' },
                  { ar: 'صوت مميز جميل', en: 'Beautiful distinctive song' },
                  { ar: 'يتغذى على الفواكه', en: 'Feeds on fruits' }
                ]
              },
              {
                id: 3,
                name: { ar: 'الخفاش السقطري', en: 'Socotra Bat' },
                scientific: 'Rhinopoma hardwickei',
                description: {
                  ar: 'خفاش صغير متوطن يعيش في الكهوف والمباني القديمة',
                  en: 'Small endemic bat living in caves and old buildings'
                },
                icon: '🦇',
                status: { ar: 'قريب من التهديد', en: 'Near Threatened' },
                gradient: 'from-purple-500 to-pink-600',
                facts: [
                  { ar: 'نشط ليلاً', en: 'Nocturnal activity' },
                  { ar: 'يعيش في مستعمرات', en: 'Lives in colonies' },
                  { ar: 'يأكل الحشرات', en: 'Eats insects' }
                ]
              },
              {
                id: 4,
                name: { ar: 'سحلية سقطرى القزمة', en: 'Socotra Dwarf Gecko' },
                scientific: 'Haemodracon riebeckii',
                description: {
                  ar: 'سحلية صغيرة جداً تعيش تحت الصخور وفي شقوق الأشجار',
                  en: 'Very small lizard living under rocks and in tree crevices'
                },
                icon: '🦎',
                status: { ar: 'متوطن', en: 'Endemic' },
                gradient: 'from-orange-500 to-red-600',
                facts: [
                  { ar: 'حجم صغير جداً (5-7 سم)', en: 'Very small size (5-7cm)' },
                  { ar: 'نشط ليلاً', en: 'Nocturnal' },
                  { ar: 'يتسلق الأشجار', en: 'Climbs trees' }
                ]
              },
              {
                id: 5,
                name: { ar: 'ورور سقطرى', en: 'Socotra Bunting' },
                scientific: 'Emberiza socotrana',
                description: {
                  ar: 'طائر صغير متوطن بألوان بنية وبيضاء، يعيش في المناطق الجبلية',
                  en: 'Small endemic bird with brown and white colors, lives in mountain areas'
                },
                icon: '🐦',
                status: { ar: 'ضعيف', en: 'Vulnerable' },
                gradient: 'from-yellow-500 to-orange-600',
                facts: [
                  { ar: 'يبني أعشاش أرضية', en: 'Builds ground nests' },
                  { ar: 'يأكل البذور', en: 'Feeds on seeds' },
                  { ar: 'نادر ومهدد', en: 'Rare and threatened' }
                ]
              },
              {
                id: 6,
                name: { ar: 'سلحفاة سقطرى البحرية', en: 'Socotra Sea Turtle' },
                scientific: 'Chelonia mydas',
                description: {
                  ar: 'سلاحف بحرية كبيرة تأتي للتعشيش على شواطئ سقطرى',
                  en: 'Large sea turtles coming to nest on Socotra beaches'
                },
                icon: '🐢',
                status: { ar: 'مهدد', en: 'Endangered' },
                gradient: 'from-teal-500 to-cyan-600',
                facts: [
                  { ar: 'تعشش على الشواطئ', en: 'Nests on beaches' },
                  { ar: 'تهاجر لمسافات طويلة', en: 'Migrates long distances' },
                  { ar: 'محمية قانونياً', en: 'Legally protected' }
                ]
              }
            ].map((animal) => (
              <div
                key={animal.id}
                className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 cursor-pointer"
                onClick={() => setSelectedAnimal(animal.id === selectedAnimal ? null : animal.id)}
              >
                <div className={`h-3 bg-gradient-to-r ${animal.gradient}`}></div>
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="text-5xl">{animal.icon}</div>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                      animal.status[locale].includes('قلق') || animal.status[locale].includes('Concern')
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                        : animal.status[locale].includes('مهدد') || animal.status[locale].includes('Endangered') || animal.status[locale].includes('Threatened')
                        ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {animal.status[locale]}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {animal.name[locale]}
                  </h3>

                  <p className="text-xs text-gray-500 dark:text-gray-500 font-mono mb-3">
                    {animal.scientific}
                  </p>

                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                    {animal.description[locale]}
                  </p>

                  {selectedAnimal === animal.id && (
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 space-y-2 animate-fade-in">
                      {animal.facts.map((fact, i) => (
                        <div key={i} className="flex items-center gap-2 text-sm">
                          <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                          </svg>
                          <span className="text-gray-700 dark:text-gray-300">{fact[locale]}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Endemic Plants */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-2xl p-8 md:p-12 text-white">
            <h3 className="text-3xl font-bold mb-8 text-center">
              {isAr ? 'نباتات متوطنة فريدة' : 'Unique Endemic Plants'}
            </h3>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
              {[
                { icon: '🌳', name: { ar: 'دم الأخوين', en: 'Dragon Blood' } },
                { icon: '🌴', name: { ar: 'النخيل السقطري', en: 'Socotra Palm' } },
                { icon: '🌺', name: { ar: 'الورد الصحراوي', en: 'Desert Rose' } },
                { icon: '🌿', name: { ar: 'الصبر السقطري', en: 'Socotra Aloe' } },
                { icon: '🌱', name: { ar: 'البخور السقطري', en: 'Frankincense' } },
                { icon: '🍀', name: { ar: 'الخيار البري', en: 'Wild Cucumber' } }
              ].map((plant, i) => (
                <div key={i} className="text-center transform hover:scale-110 transition-all">
                  <div className="text-5xl mb-2">{plant.icon}</div>
                  <p className="text-sm font-semibold">{plant.name[locale]}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 text-center bg-white/10 backdrop-blur-md p-6 rounded-xl">
              <p className="text-lg font-semibold">
                {isAr 
                  ? '825 نوع نباتي - 307 منها متوطن (37%)'
                  : '825 plant species - 307 endemic (37%)'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          Conservation Message Section
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20 rounded-2xl p-8 md:p-12 border-2 border-green-300 dark:border-green-700">
            <div className="text-center">
              <div className="text-6xl mb-6">🌍💚</div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                {isAr ? 'ساعدنا في الحفاظ على هذا الكنز' : 'Help Us Preserve This Treasure'}
              </h2>

              <div className="prose prose-lg max-w-3xl mx-auto text-gray-700 dark:text-gray-300 mb-8">
                <p className="text-lg leading-relaxed">
                  {isAr
                    ? 'سقطرى كنز طبيعي فريد يحتاج إلى حمايتنا جميعاً. من خلال السياحة المسؤولة والوعي البيئي، يمكننا الحفاظ على هذه الجزيرة الاستثنائية للأجيال القادمة.'
                    : 'Socotra is a unique natural treasure that needs all our protection. Through responsible tourism and environmental awareness, we can preserve this exceptional island for future generations.'}
                </p>
              </div>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {[
                  {
                    icon: '♻️',
                    title: { ar: 'سياحة مستدامة', en: 'Sustainable Tourism' },
                    desc: { ar: 'احترام البيئة والثقافة', en: 'Respect environment & culture' }
                  },
                  {
                    icon: '🌱',
                    title: { ar: 'لا تترك أثراً', en: 'Leave No Trace' },
                    desc: { ar: 'خذ ذكرياتك فقط', en: 'Take only memories' }
                  },
                  {
                    icon: '🤝',
                    title: { ar: 'دعم المجتمع', en: 'Support Community' },
                    desc: { ar: 'خدمات محلية فقط', en: 'Local services only' }
                  }
                ].map((item, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-xl">
                    <div className="text-4xl mb-3">{item.icon}</div>
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                      {item.title[locale]}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {item.desc[locale]}
                    </p>
                  </div>
                ))}
              </div>

              <a
                href="/tours"
                className="inline-block bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                {isAr ? 'انضم لرحلاتنا البيئية' : 'Join Our Eco Tours'}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          CTA Section
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 text-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {isAr ? 'اكتشف عجائب سقطرى بنفسك' : 'Discover Socotra\'s Wonders Yourself'}
          </h2>

          <p className="text-xl mb-12 opacity-90">
            {isAr
              ? 'انضم لرحلاتنا واستكشف الميزات الفريدة التي لا توجد في أي مكان آخر'
              : 'Join our tours and explore unique features found nowhere else'}
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="/tours"
              className="btn text-lg px-8 py-4 bg-white text-green-600 hover:bg-gray-100 transform hover:scale-105 transition-all shadow-2xl"
            >
              {isAr ? 'تصفح الرحلات' : 'Browse Tours'}
            </a>

            <a
              href="/travel-guide"
              className="btn text-lg px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-green-600 transform hover:scale-105 transition-all"
            >
              {isAr ? 'دليل السفر' : 'Travel Guide'}
            </a>

            <a
              href="/contact"
              className="btn text-lg px-8 py-4 bg-emerald-500 text-white hover:bg-emerald-600 transform hover:scale-105 transition-all shadow-2xl"
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