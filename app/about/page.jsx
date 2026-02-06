'use client'

// ═══════════════════════════════════════════════════════════════════════
// 📄 About Page - Socotra Paradise (احترافية 100%)
// ✅ متطلبات PDF:
//    1. Introduction to Socotra
//    2. Geography and Nature
//    3. Culture and People
//    4. Why Visit Socotra?
// ✨ تصميم عصري وفخم ومبهر جداً
// ═══════════════════════════════════════════════════════════════════════

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useApp } from '@/contexts/AppContext'

export default function AboutPage() {
  const { locale, isDark } = useApp()
  const [activeTab, setActiveTab] = useState('geography')
  const [scrollProgress, setScrollProgress] = useState(0)

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (window.scrollY / totalHeight) * 100
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // ═══════════════════════════════════════════════════════════════
  // Geography & Nature Data
  // ═══════════════════════════════════════════════════════════════
  const geographyFacts = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: {
        ar: 'الموقع',
        en: 'Location'
      },
      value: {
        ar: 'المحيط الهندي، قرب القرن الأفريقي',
        en: 'Indian Ocean, near Horn of Africa'
      },
      description: {
        ar: '350 كم جنوب اليمن',
        en: '350 km south of Yemen'
      }
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
        </svg>
      ),
      title: {
        ar: 'المساحة',
        en: 'Area'
      },
      value: {
        ar: '3,796 كم²',
        en: '3,796 km²'
      },
      description: {
        ar: 'أكبر من لوكسمبورغ',
        en: 'Larger than Luxembourg'
      }
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      ),
      title: {
        ar: 'المناخ',
        en: 'Climate'
      },
      value: {
        ar: 'استوائي جاف',
        en: 'Tropical Arid'
      },
      description: {
        ar: 'حار صيفاً، معتدل شتاءً',
        en: 'Hot summers, mild winters'
      }
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
      title: {
        ar: 'أعلى قمة',
        en: 'Highest Peak'
      },
      value: {
        ar: '1,525 متر',
        en: '1,525 meters'
      },
      description: {
        ar: 'جبال حجهر',
        en: 'Haghier Mountains'
      }
    }
  ]

  // ═══════════════════════════════════════════════════════════════
  // Endemic Species
  // ═══════════════════════════════════════════════════════════════
  const endemicSpecies = [
    {
      name: { ar: 'شجرة دم الأخوين', en: 'Dragon Blood Tree' },
      scientificName: 'Dracaena cinnabari',
      count: '~8000',
      status: { ar: 'معرض للخطر', en: 'Vulnerable' },
      image: '/img/destinations/dragon-blood-tree.webp',
      description: {
        ar: 'رمز سقطرى الأكثر شهرة، شجرة فريدة على شكل مظلة',
        en: 'Socotra\'s most iconic symbol, unique umbrella-shaped tree'
      }
    },
    {
      name: { ar: 'شجرة الخيار السقطري', en: 'Desert Rose' },
      scientificName: 'Adenium obesum socotranum',
      count: '~500',
      status: { ar: 'نادر', en: 'Rare' },
      image: '/img/nature/desert-rose.jpg',
      description: {
        ar: 'نبات عصاري بجذع منتفخ وأزهار وردية جميلة',
        en: 'Succulent plant with swollen trunk and beautiful pink flowers'
      }
    },
    {
      name: { ar: 'نبات الصبار السقطري', en: 'Socotra Aloe' },
      scientificName: 'Aloe perryi',
      count: '~1000+',
      status: { ar: 'مستقر', en: 'Stable' },
      image: '/img/nature/aloe.jpg',
      description: {
        ar: 'نبات طبي تقليدي بخصائص علاجية قوية',
        en: 'Traditional medicinal plant with powerful healing properties'
      }
    }
  ]

  // ═══════════════════════════════════════════════════════════════
  // Culture & People
  // ═══════════════════════════════════════════════════════════════
  const culturalAspects = [
    {
      title: { ar: 'اللغة السقطرية', en: 'Soqotri Language' },
      icon: '🗣️',
      description: {
        ar: 'لغة سامية قديمة فريدة لا توجد إلا في سقطرى، لا تزال محكية حتى اليوم بدون كتابة رسمية',
        en: 'Ancient unique Semitic language spoken only in Socotra, still spoken today without official writing'
      },
      stats: { ar: '~70,000 متحدث', en: '~70,000 speakers' }
    },
    {
      title: { ar: 'الموسيقى التقليدية', en: 'Traditional Music' },
      icon: '🎵',
      description: {
        ar: 'أغاني وألحان فريدة تعكس تراث الجزيرة، تُعزف بآلات تقليدية مثل العود والطبول',
        en: 'Unique songs and melodies reflecting island heritage, played with traditional instruments like oud and drums'
      },
      stats: { ar: 'تراث شفهي قديم', en: 'Ancient oral heritage' }
    },
    {
      title: { ar: 'الحرف اليدوية', en: 'Traditional Crafts' },
      icon: '🏺',
      description: {
        ar: 'صناعة السلال والمنسوجات والفخار بطرق توارثتها الأجيال منذ قرون',
        en: 'Basket weaving, textiles, and pottery made using methods passed down for centuries'
      },
      stats: { ar: 'حرف أصيلة', en: 'Authentic crafts' }
    },
    {
      title: { ar: 'الضيافة السقطرية', en: 'Soqotri Hospitality' },
      icon: '☕',
      description: {
        ar: 'كرم استثنائي وحفاوة بالضيوف، القهوة والتمر رمز الترحيب',
        en: 'Exceptional generosity and welcoming guests, coffee and dates symbolize welcome'
      },
      stats: { ar: 'تقليد راسخ', en: 'Deep-rooted tradition' }
    }
  ]

  // ═══════════════════════════════════════════════════════════════
  // Why Visit Socotra - أسباب مقنعة
  // ═══════════════════════════════════════════════════════════════
  const whyVisitReasons = [
    {
      number: '01',
      title: {
        ar: 'تنوع حيوي فريد',
        en: 'Unique Biodiversity'
      },
      description: {
        ar: '37% من النباتات و90% من الزواحف لا توجد في أي مكان آخر على الأرض',
        en: '37% of plants and 90% of reptiles found nowhere else on Earth'
      },
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      number: '02',
      title: {
        ar: 'جمال طبيعي خلاب',
        en: 'Breathtaking Natural Beauty'
      },
      description: {
        ar: 'مناظر طبيعية سريالية: شواطئ بكر، جبال شاهقة، كهوف عميقة، وديان خضراء',
        en: 'Surreal landscapes: pristine beaches, towering mountains, deep caves, green valleys'
      },
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      number: '03',
      title: {
        ar: 'ثقافة أصيلة',
        en: 'Authentic Culture'
      },
      description: {
        ar: 'شعب مضياف يحافظ على تقاليد وعادات عمرها آلاف السنين',
        en: 'Hospitable people preserving traditions and customs thousands of years old'
      },
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      number: '04',
      title: {
        ar: 'مغامرة حقيقية',
        en: 'True Adventure'
      },
      description: {
        ar: 'تجربة سفر فريدة بعيداً عن السياحة الجماعية والمسارات المألوفة',
        en: 'Unique travel experience away from mass tourism and familiar routes'
      },
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
        </svg>
      ),
      gradient: 'from-orange-500 to-red-600'
    },
    {
      number: '05',
      title: {
        ar: 'موقع تراث عالمي',
        en: 'UNESCO World Heritage'
      },
      description: {
        ar: 'معترف به عالمياً كموقع ذو قيمة عالمية استثنائية يجب الحفاظ عليه',
        en: 'Globally recognized as site of outstanding universal value to be preserved'
      },
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      gradient: 'from-indigo-500 to-purple-600'
    },
    {
      number: '06',
      title: {
        ar: 'تصوير فوتوغرافي مذهل',
        en: 'Amazing Photography'
      },
      description: {
        ar: 'كل زاوية تستحق الالتقاط - جنة لعشاق التصوير والطبيعة',
        en: 'Every angle deserves capture - paradise for photography and nature lovers'
      },
      icon: (
        <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      gradient: 'from-teal-500 to-green-600'
    }
  ]

  // ═══════════════════════════════════════════════════════════════
  // Historical Timeline
  // ═══════════════════════════════════════════════════════════════
  const timeline = [
    {
      year: '20M',
      title: { ar: 'الأصول الجيولوجية', en: 'Geological Origins' },
      description: {
        ar: 'انفصلت سقطرى عن أفريقيا منذ 20 مليون سنة',
        en: 'Socotra separated from Africa 20 million years ago'
      }
    },
    {
      year: '1st Century',
      title: { ar: 'العصر القديم', en: 'Ancient Era' },
      description: {
        ar: 'مذكورة في كتابات يونانية ورومانية قديمة',
        en: 'Mentioned in ancient Greek and Roman writings'
      }
    },
    {
      year: '1507',
      title: { ar: 'الاستكشاف البرتغالي', en: 'Portuguese Exploration' },
      description: {
        ar: 'زارها البرتغاليون واحتلوها لفترة قصيرة',
        en: 'Visited and briefly occupied by Portuguese'
      }
    },
    {
      year: '1967',
      title: { ar: 'الاستقلال', en: 'Independence' },
      description: {
        ar: 'أصبحت جزءاً من جمهورية اليمن الجنوبية',
        en: 'Became part of South Yemen republic'
      }
    },
    {
      year: '2008',
      title: { ar: 'تراث عالمي', en: 'World Heritage' },
      description: {
        ar: 'أدرجتها اليونسكو كموقع تراث عالمي',
        en: 'UNESCO listed as World Heritage Site'
      }
    },
    {
      year: '2024',
      title: { ar: 'السياحة المستدامة', en: 'Sustainable Tourism' },
      description: {
        ar: 'تطوير سياحة بيئية مستدامة',
        en: 'Developing sustainable eco-tourism'
      }
    }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-800 z-50">
        <div
          className="h-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 transition-all duration-300"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          Hero Section - Cinematic
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background with Parallax Effect */}
        <div className="absolute inset-0">
          <Image
            src="/img/about/socotra-nature.jpg"
            alt="Socotra Island"
            fill
            className="object-cover"
            priority
            quality={90}
          />
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70" />
          
          {/* Animated Particles */}
          <div className="absolute inset-0 opacity-30">
            <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-green-400 rounded-full animate-float" />
            <div className="absolute top-1/3 right-1/4 w-3 h-3 bg-blue-400 rounded-full animate-float" style={{ animationDelay: '1s' }} />
            <div className="absolute bottom-1/3 left-1/3 w-2 h-2 bg-purple-400 rounded-full animate-float" style={{ animationDelay: '2s' }} />
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 container-custom text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full mb-8 animate-fade-in">
            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-white font-semibold">
              {locale === 'ar' ? 'موقع تراث عالمي - اليونسكو' : 'UNESCO World Heritage Site'}
            </span>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 animate-slide-in-right">
            {locale === 'ar' ? 'اكتشف' : 'Discover'}
            <br />
            <span className="text-gradient bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
              {locale === 'ar' ? 'سقطرى' : 'Socotra'}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto mb-12 animate-slide-in-left">
            {locale === 'ar'
              ? 'جنة منعزلة في المحيط الهندي، حيث تلتقي الطبيعة الخيالية بالثقافة الأصيلة'
              : 'An isolated paradise in the Indian Ocean, where fantastical nature meets authentic culture'}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="#introduction"
              className="btn btn-primary text-lg px-8 py-4 transform hover:scale-105 transition-all shadow-2xl"
            >
              {locale === 'ar' ? 'ابدأ الرحلة' : 'Start Journey'}
              <svg className={`w-5 h-5 ${locale === 'ar' ? 'mr-2' : 'ml-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </a>
            <Link
              href="/tours"
              className="btn btn-outline text-lg px-8 py-4 bg-white/10 backdrop-blur-md border-white text-white hover:bg-white hover:text-green-600 transform hover:scale-105 transition-all"
            >
              {locale === 'ar' ? 'احجز رحلتك' : 'Book Your Trip'}
            </Link>
          </div>

          {/* Scroll Indicator */}
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 animate-bounce">
            <div className="flex flex-col items-center gap-2 text-white/80">
              <span className="text-sm font-semibold">{locale === 'ar' ? 'مرر للأسفل' : 'Scroll Down'}</span>
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          Introduction Section (متطلبات PDF: 1)
          ═══════════════════════════════════════════════════════════════ */}
      <section id="introduction" className="py-20 bg-white dark:bg-gray-900">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Text Content */}
            <div>
              <div className="inline-block px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-semibold mb-6">
                {locale === 'ar' ? 'مقدمة' : 'Introduction'}
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                {locale === 'ar' ? 'جزيرة' : 'The Island of'}{' '}
                <span className="text-gradient bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                  {locale === 'ar' ? 'العجائب' : 'Wonders'}
                </span>
              </h2>

              <div className="space-y-6 text-lg text-gray-600 dark:text-gray-400 leading-relaxed">
                <p>
                  {locale === 'ar'
                    ? 'سقطرى هي أرخبيل يمني يقع في المحيط الهندي، على بعد حوالي 350 كيلومتراً جنوب شبه الجزيرة العربية. تُعرف الجزيرة بأنها واحدة من أكثر الأماكن غرابة وتفرداً على وجه الأرض، وقد أطلق عليها العلماء لقب "جالاباغوس المحيط الهندي".'
                    : 'Socotra is a Yemeni archipelago in the Indian Ocean, located about 350 kilometers south of the Arabian Peninsula. The island is known as one of the most alien and unique places on Earth, nicknamed by scientists as the "Galapagos of the Indian Ocean".'}
                </p>

                <p>
                  {locale === 'ar'
                    ? 'منذ ملايين السنين، انفصلت سقطرى عن القارة الأفريقية، مما أدى إلى تطور نباتات وحيوانات فريدة لا توجد في أي مكان آخر في العالم. اليوم، تضم الجزيرة أكثر من 700 نوع من الكائنات المستوطنة، بما في ذلك شجرة دم الأخوين الأسطورية.'
                    : 'Millions of years ago, Socotra separated from the African continent, leading to the evolution of unique plants and animals found nowhere else in the world. Today, the island hosts over 700 endemic species, including the legendary Dragon Blood Tree.'}
                </p>

                <p>
                  {locale === 'ar'
                    ? 'في عام 2008، اعترفت اليونسكو بسقطرى كموقع تراث عالمي، تقديراً لتنوعها الحيوي الاستثنائي وأهميتها العلمية العالمية. إنها وجهة حلم لعشاق الطبيعة والمغامرة والتصوير الفوتوغرافي.'
                    : 'In 2008, UNESCO recognized Socotra as a World Heritage Site, acknowledging its exceptional biodiversity and global scientific importance. It\'s a dream destination for nature lovers, adventurers, and photographers.'}
                </p>
              </div>

              {/* Quick Facts */}
              <div className="mt-10 grid grid-cols-3 gap-6">
                <div className="text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-2xl">
                  <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">700+</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {locale === 'ar' ? 'نوع مستوطن' : 'Endemic Species'}
                  </div>
                </div>
                <div className="text-center p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl">
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">37%</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {locale === 'ar' ? 'نباتات فريدة' : 'Unique Plants'}
                  </div>
                </div>
                <div className="text-center p-6 bg-purple-50 dark:bg-purple-900/20 rounded-2xl">
                  <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">20M</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {locale === 'ar' ? 'سنة عزلة' : 'Years Isolated'}
                  </div>
                </div>
              </div>
            </div>

            {/* Image Collage */}
            <div className="relative">
              {/* Main Image */}
              <div className="relative h-[600px] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/img/about/socotra-nature.jpg"
                  alt="Socotra Nature"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>

              {/* Floating Card */}
              <div className="absolute -bottom-8 -left-8 bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-2xl max-w-xs transform hover:scale-105 transition-all">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                      {locale === 'ar' ? 'التصنيف' : 'Classification'}
                    </div>
                    <div className="text-lg font-bold text-gray-900 dark:text-white">
                      {locale === 'ar' ? 'تراث عالمي' : 'World Heritage'}
                    </div>
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {locale === 'ar'
                    ? 'معترف بها من قبل اليونسكو منذ 2008'
                    : 'Recognized by UNESCO since 2008'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          Geography & Nature Section (متطلبات PDF: 2)
          ═══════════════════════════════════════════════════════════════ */}
      <section id="geography" className="py-20 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-semibold mb-6">
              {locale === 'ar' ? 'الجغرافيا والطبيعة' : 'Geography & Nature'}
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {locale === 'ar' ? 'طبيعة' : 'Nature Like'}{' '}
              <span className="text-gradient bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                {locale === 'ar' ? 'خيالية' : 'No Other'}
              </span>
            </h2>

            <p className="text-lg text-gray-600 dark:text-gray-400">
              {locale === 'ar'
                ? 'موقع جغرافي فريد وتنوع بيئي استثنائي جعل من سقطرى متحفاً طبيعياً حياً'
                : 'Unique geographical location and exceptional environmental diversity made Socotra a living natural museum'}
            </p>
          </div>

          {/* Geography Facts Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {geographyFacts.map((fact, index) => (
              <div
                key={index}
                className="group bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-white">
                  {fact.icon}
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {fact.title[locale]}
                </h3>

                <div className="text-2xl font-bold text-green-600 dark:text-green-400 mb-2">
                  {fact.value[locale]}
                </div>

                <p className="text-gray-600 dark:text-gray-400">
                  {fact.description[locale]}
                </p>
              </div>
            ))}
          </div>

          {/* Endemic Species Showcase */}
          <div className="mt-20">
            <h3 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">
              {locale === 'ar' ? 'الأنواع المستوطنة' : 'Endemic Species'}
            </h3>
            <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
              {locale === 'ar'
                ? 'اكتشف بعض أشهر النباتات الفريدة التي لا توجد إلا في سقطرى'
                : 'Discover some of the most famous unique plants found only in Socotra'}
            </p>

            <div className="grid md:grid-cols-3 gap-8">
              {endemicSpecies.map((species, index) => (
                <div
                  key={index}
                  className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all"
                >
                  {/* Image */}
                  <div className="relative h-64 bg-gradient-to-br from-green-400 to-emerald-500 overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <svg className="w-20 h-20 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                      </svg>
                    </div>

                    {/* Status Badge */}
                    <div className="absolute top-4 right-4">
                      <span className="px-3 py-1 bg-white/90 backdrop-blur-sm text-green-700 text-xs font-semibold rounded-full">
                        {species.status[locale]}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {species.name[locale]}
                    </h4>

                    <p className="text-sm text-gray-500 dark:text-gray-400 italic mb-3">
                      {species.scientificName}
                    </p>

                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {species.description[locale]}
                    </p>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div>
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                          {locale === 'ar' ? 'العدد التقريبي' : 'Estimated Count'}
                        </div>
                        <div className="text-lg font-bold text-green-600 dark:text-green-400">
                          {species.count}
                        </div>
                      </div>

                      <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors">
                        <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          Culture & People Section (متطلبات PDF: 3)
          ═══════════════════════════════════════════════════════════════ */}
      <section id="culture" className="py-20 bg-white dark:bg-gray-900">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-semibold mb-6">
              {locale === 'ar' ? 'الثقافة والشعب' : 'Culture & People'}
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {locale === 'ar' ? 'تراث' : 'Heritage'}{' '}
              <span className="text-gradient bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                {locale === 'ar' ? 'حي' : 'Alive'}
              </span>
            </h2>

            <p className="text-lg text-gray-600 dark:text-gray-400">
              {locale === 'ar'
                ? 'شعب سقطرى يحافظ على تقاليد وثقافة عريقة عمرها آلاف السنين'
                : 'Soqotri people preserve ancient traditions and culture thousands of years old'}
            </p>
          </div>

          {/* Cultural Aspects Grid */}
          <div className="grid md:grid-cols-2 gap-8 mb-16">
            {culturalAspects.map((aspect, index) => (
              <div
                key={index}
                className="group bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-8 rounded-2xl hover:shadow-2xl transition-all"
              >
                <div className="flex items-start gap-6">
                  {/* Icon */}
                  <div className="text-6xl">{aspect.icon}</div>

                  {/* Content */}
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                      {aspect.title[locale]}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                      {aspect.description[locale]}
                    </p>

                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-semibold">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      {aspect.stats[locale]}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* People Stats */}
          <div className="mt-16 bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-800 dark:to-indigo-800 rounded-3xl p-12 text-white">
            <div className="grid md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-5xl font-bold mb-2">~70K</div>
                <div className="text-blue-100">{locale === 'ar' ? 'السكان' : 'Population'}</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">5</div>
                <div className="text-blue-100">{locale === 'ar' ? 'لهجات محلية' : 'Local Dialects'}</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">100%</div>
                <div className="text-blue-100">{locale === 'ar' ? 'مسلمون' : 'Muslims'}</div>
              </div>
              <div>
                <div className="text-5xl font-bold mb-2">50+</div>
                <div className="text-blue-100">{locale === 'ar' ? 'قرية' : 'Villages'}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          Historical Timeline
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full text-sm font-semibold mb-6">
              {locale === 'ar' ? 'التاريخ' : 'History'}
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {locale === 'ar' ? 'رحلة عبر' : 'Journey Through'}{' '}
              <span className="text-gradient bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                {locale === 'ar' ? 'الزمن' : 'Time'}
              </span>
            </h2>
          </div>

          {/* Timeline */}
          <div className="relative max-w-5xl mx-auto">
            {/* Center Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-500 to-pink-500 hidden lg:block" />

            {/* Timeline Items */}
            <div className="space-y-12">
              {timeline.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center gap-8 ${
                    index % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  }`}
                >
                  {/* Content Card */}
                  <div className="flex-1 lg:text-right lg:pr-8">
                    <div className={`bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg hover:shadow-2xl transition-all ${index % 2 === 0 ? '' : 'lg:text-left lg:pl-8 lg:pr-0'}`}>
                      <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                        {item.year}
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
                  <div className="hidden lg:block w-6 h-6 bg-purple-500 rounded-full border-4 border-white dark:border-gray-900 shadow-lg z-10" />

                  {/* Spacer */}
                  <div className="flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          Why Visit Section (متطلبات PDF: 4)
          ═══════════════════════════════════════════════════════════════ */}
      <section id="why-visit" className="py-20 bg-white dark:bg-gray-900">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block px-4 py-2 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/30 dark:to-blue-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-semibold mb-6">
              {locale === 'ar' ? 'لماذا سقطرى؟' : 'Why Socotra?'}
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {locale === 'ar' ? '6 أسباب' : '6 Reasons'}{' '}
              <span className="text-gradient bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 dark:from-green-400 dark:via-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                {locale === 'ar' ? 'مقنعة' : 'to Visit'}
              </span>
            </h2>

            <p className="text-lg text-gray-600 dark:text-gray-400">
              {locale === 'ar'
                ? 'اكتشف لماذا يجب أن تكون سقطرى وجهتك القادمة'
                : 'Discover why Socotra should be your next destination'}
            </p>
          </div>

          {/* Reasons Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyVisitReasons.map((reason, index) => (
              <div
                key={index}
                className="group relative bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all"
              >
                {/* Gradient Background */}
                <div className={`absolute top-0 left-0 right-0 h-2 bg-gradient-to-r ${reason.gradient}`} />

                <div className="p-8">
                  {/* Number Badge */}
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r ${reason.gradient} text-white rounded-2xl font-bold text-2xl mb-6`}>
                    {reason.number}
                  </div>

                  {/* Icon */}
                  <div className="text-gray-400 dark:text-gray-500 mb-6 group-hover:scale-110 transition-transform">
                    {reason.icon}
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {reason.title[locale]}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                    {reason.description[locale]}
                  </p>
                </div>

                {/* Hover Effect */}
                <div className={`absolute inset-0 bg-gradient-to-br ${reason.gradient} opacity-0 group-hover:opacity-5 transition-opacity pointer-events-none`} />
              </div>
            ))}
          </div>

          {/* CTA Section */}
          <div className="mt-16 text-center">
            <div className="inline-block bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 p-12 rounded-3xl">
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {locale === 'ar' ? 'مقتنع؟ احجز رحلتك الآن!' : 'Convinced? Book Your Trip Now!'}
              </h3>
              <p className="text-lg text-gray-600 dark:text-gray-400 mb-8 max-w-2xl mx-auto">
                {locale === 'ar'
                  ? 'اختر من بين رحلاتنا المتنوعة واستعد لتجربة لا تُنسى في جنة سقطرى'
                  : 'Choose from our diverse tours and get ready for an unforgettable experience in Socotra paradise'}
              </p>

              <div className="flex flex-wrap gap-4 justify-center">
                <Link
                  href="/tours"
                  className="btn btn-primary text-lg px-8 py-4 transform hover:scale-105 transition-all shadow-xl"
                >
                  {locale === 'ar' ? 'تصفح الرحلات' : 'Browse Tours'}
                  <svg className={`w-5 h-5 ${locale === 'ar' ? 'mr-2' : 'ml-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={locale === 'ar' ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
                  </svg>
                </Link>

                <Link
                  href="/contact"
                  className="btn btn-outline text-lg px-8 py-4 transform hover:scale-105 transition-all"
                >
                  {locale === 'ar' ? 'تواصل معنا' : 'Contact Us'}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          Image Gallery Section
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {locale === 'ar' ? 'معرض الصور' : 'Photo Gallery'}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {locale === 'ar' ? 'جمال سقطرى بالصور' : 'Socotra\'s Beauty in Pictures'}
            </p>
          </div>

          {/* Gallery Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
              <div
                key={item}
                className="group relative aspect-square bg-gradient-to-br from-green-400 to-blue-500 rounded-2xl overflow-hidden cursor-pointer"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-12 h-12 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                  </svg>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link
              href="/gallery"
              className="btn btn-primary inline-flex items-center gap-2"
            >
              {locale === 'ar' ? 'عرض المزيد' : 'View More'}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={locale === 'ar' ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          Final CTA
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 dark:from-green-800 dark:via-blue-800 dark:to-purple-800 text-white">
        <div className="container-custom text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {locale === 'ar' ? 'ابدأ مغامرتك في سقطرى' : 'Start Your Socotra Adventure'}
          </h2>

          <p className="text-xl mb-8 max-w-2xl mx-auto opacity-90">
            {locale === 'ar'
              ? 'اتصل بنا اليوم لتخطيط رحلتك المثالية إلى جزيرة العجائب'
              : 'Contact us today to plan your perfect trip to the island of wonders'}
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="https://wa.me/967772371581"
              className="btn text-lg px-8 py-4 bg-white text-green-600 hover:bg-gray-100 transform hover:scale-105 transition-all shadow-2xl inline-flex items-center gap-2"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              {locale === 'ar' ? 'واتساب' : 'WhatsApp'}
            </a>

            <Link
              href="/contact"
              className="btn text-lg px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-green-600 transform hover:scale-105 transition-all"
            >
              {locale === 'ar' ? 'نموذج الاتصال' : 'Contact Form'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )

  
}
