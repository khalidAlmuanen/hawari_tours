'use client'

// ═══════════════════════════════════════════════════════════════════════
// 🏠 الصفحة الرئيسية المحسّنة - Professional & Stunning
// ✅ متطلبات PDF: Welcome, Featured Tours, News, Updates
// ✅ إضافات: Why Choose Us, Weather, Instagram Feed, Newsletter
// ═══════════════════════════════════════════════════════════════════════

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useApp } from '@/contexts/AppContext'
import WhatsAppButton from '@/components/WhatsAppButton'
import TourCard from '@/components/TourCard'

export default function EnhancedHomePage() {
  const { locale, isDark } = useApp()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [weatherData, setWeatherData] = useState(null)
  const [newsArticles, setNewsArticles] = useState([])
  const [tours, setTours] = useState([])
  const [toursLoading, setToursLoading] = useState(true)
  const [newsLoading, setNewsLoading] = useState(true)

  // ═══════════════════════════════════════════════════════════════
  // Hero Slides - Premium Content
  // ═══════════════════════════════════════════════════════════════
  const heroSlides = [
    {
      image: '/img/hero/socotra-1.jpg',
      title: {
        ar: 'اكتشف جنة سقطرى الخفية',
        en: 'Discover Socotra\'s Hidden Paradise'
      },
      subtitle: {
        ar: 'جالاباغوس المحيط الهندي',
        en: 'Galapagos of Indian Ocean'
      },
      description: {
        ar: 'استمتع بتجربة فريدة في أكثر جزيرة غرابة على وجه الأرض',
        en: 'Experience the world\'s most unique island adventure'
      }
    },
    {
      image: '/img/hero/socotra-2.jpg',
      title: {
        ar: 'مغامرات لا تُنسى',
        en: 'Unforgettable Adventures'
      },
      subtitle: {
        ar: 'تخييم تحت النجوم',
        en: 'Camping Under the Stars'
      },
      description: {
        ar: 'اقضِ ليالي سحرية تحت سماء سقطرى الصافية',
        en: 'Spend magical nights under Socotra\'s crystal clear skies'
      }
    },
    {
      image: '/img/hero/socotra-3.jpg',
      title: {
        ar: 'شواطئ بكر ومياه كريستالية',
        en: 'Pristine Beaches & Crystal Waters'
      },
      subtitle: {
        ar: 'جنة على الأرض',
        en: 'Paradise on Earth'
      },
      description: {
        ar: 'اسبح في أنقى مياه المحيط الهندي',
        en: 'Swim in the purest waters of the Indian Ocean'
      }
    }
  ]

  // Fetch latest news from database
  useEffect(() => {
    fetchLatestNews()
  }, [])

  const fetchLatestNews = async () => {
    setNewsLoading(true)
    try {
      const response = await fetch('/api/news/all')
      const result = await response.json()

      if (result.success) {
        setNewsArticles(result.data.slice(0, 3)) // Get latest 3
      }
    } catch (error) {
      console.error('Failed to fetch news:', error)
    } finally {
      setNewsLoading(false)
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // Why Choose Us - Premium Features
  // ═══════════════════════════════════════════════════════════════
  const whyChooseUs = [
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
      title: {
        ar: 'رحلات آمنة ومؤمنة',
        en: 'Safe & Insured Trips'
      },
      description: {
        ar: 'جميع رحلاتنا مؤمنة بالكامل مع التزام صارم بمعايير السلامة العالمية',
        en: 'All trips fully insured with strict adherence to international safety standards'
      }
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: {
        ar: 'خبرة 10+ سنوات',
        en: '10+ Years Experience'
      },
      description: {
        ar: 'أكثر من عقد من الخبرة في تنظيم أفضل الرحلات السياحية في سقطرى',
        en: 'Over a decade organizing the best tours in Socotra'
      }
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      title: {
        ar: 'مرشدون محليون خبراء',
        en: 'Expert Local Guides'
      },
      description: {
        ar: 'فريق من المرشدين المحليين المحترفين الذين يتحدثون الإنجليزية بطلاقة',
        en: 'Team of professional local guides fluent in English'
      }
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      title: {
        ar: 'أسعار شفافة وعادلة',
        en: 'Transparent & Fair Pricing'
      },
      description: {
        ar: 'لا رسوم خفية - كل شيء واضح ومفصل منذ البداية',
        en: 'No hidden fees - everything clear and detailed from the start'
      }
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
        </svg>
      ),
      title: {
        ar: '100% رضا العملاء',
        en: '100% Customer Satisfaction'
      },
      description: {
        ar: '5000+ عميل سعيد من جميع أنحاء العالم - تقييم 4.9/5',
        en: '5000+ happy clients worldwide - 4.9/5 rating'
      }
    },
    {
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
        </svg>
      ),
      title: {
        ar: 'صديق للبيئة',
        en: 'Eco-Friendly'
      },
      description: {
        ar: 'نلتزم بالسياحة المستدامة ونحافظ على البيئة الفريدة لسقطرى',
        en: 'Committed to sustainable tourism and preserving Socotra\'s unique environment'
      }
    }
  ]

  // ═══════════════════════════════════════════════════════════════
  // Instagram Feed (مع صور placeholder)
  // ═══════════════════════════════════════════════════════════════
  const instagramPosts = [
    { id: 1, image: '/img/gallery/socotra-1.jpg', likes: 342, comments: 28 },
    { id: 2, image: '/img/gallery/socotra-2.jpg', likes: 567, comments: 45 },
    { id: 3, image: '/img/gallery/socotra-3.jpg', likes: 891, comments: 67 },
    { id: 4, image: '/img/destinations/arher.webp', likes: 1234, comments: 89 },
    { id: 5, image: '/img/destinations/diksam.webp', likes: 678, comments: 52 },
    { id: 6, image: '/img/destinations/dragon-blood-tree.webp', likes: 2341, comments: 156 }
  ]

  // Auto slide
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [heroSlides.length])

  // Fetch Tours from Database
  useEffect(() => {
    async function fetchTours() {
      try {
        setToursLoading(true)
        const response = await fetch('/api/tours?featured=true')
        const result = await response.json()
        
        if (result.success) {
          setTours(result.data)
        }
      } catch (error) {
        console.error('Failed to fetch tours:', error)
      } finally {
        setToursLoading(false)
      }
    }
    
    fetchTours()
  }, [])

  // Simulate weather data
  useEffect(() => {
    setWeatherData({
      temp: 28,
      condition: locale === 'ar' ? 'صافي' : 'Clear',
      humidity: 65,
      wind: 12
    })
  }, [locale])

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════
          Hero Section - Premium Design
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative h-screen min-h-[600px] overflow-hidden">
        {/* Background Slider */}
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              currentSlide === index ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.title[locale]}
              fill
              className="object-cover"
              priority={index === 0}
              quality={90}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent dark:from-black/80 dark:via-black/60 dark:to-black/40" />
          </div>
        ))}

        {/* Content */}
        <div className="relative h-full flex items-center z-20">
          <div className="container-custom">
            <div className="max-w-3xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-white/20 dark:bg-white/10 backdrop-blur-md px-6 py-3 rounded-full mb-6 animate-fade-in">
                <span className="w-2 h-2 bg-green-400 dark:bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-white text-sm font-semibold">
                  {heroSlides[currentSlide].subtitle[locale]}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-slide-in-right">
                {heroSlides[currentSlide].title[locale]}
              </h1>

              {/* Description */}
              <p className="text-xl md:text-2xl text-gray-200 dark:text-gray-300 mb-8 animate-slide-in-left">
                {heroSlides[currentSlide].description[locale]}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <a
                  href="#tours"
                  className="btn btn-primary text-lg px-8 py-4 transform hover:scale-105 transition-all shadow-lg hover:shadow-xl"
                >
                  {locale === 'ar' ? 'استكشف الرحلات' : 'Explore Tours'}
                  <svg className={`w-5 h-5 ${locale === 'ar' ? 'mr-2' : 'ml-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </a>
                <a
                  href="https://wa.me/967772371581"
                  className="btn btn-outline text-lg px-8 py-4 bg-white/10 backdrop-blur-md border-white text-white hover:bg-white hover:text-green-600 dark:hover:text-green-700 transform hover:scale-105 transition-all"
                >
                  <svg className={`w-6 h-6 ${locale === 'ar' ? 'ml-2' : 'mr-2'}`} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  {locale === 'ar' ? 'تواصل معنا' : 'Contact Us'}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Slider Indicators */}
        <div className="absolute bottom-8 right-1/2 translate-x-1/2 flex gap-3 z-20">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1 rounded-full transition-all duration-300 ${
                currentSlide === index
                  ? 'w-12 bg-white'
                  : 'w-8 bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          Quick Stats Section
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gradient-to-r from-green-500 via-emerald-600 to-teal-600 dark:from-green-700 dark:via-emerald-800 dark:to-teal-900 transition-colors">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-white text-center">
            <div className="animate-fade-in transform hover:scale-105 transition-transform">
              <div className="text-5xl md:text-6xl font-bold mb-2">700+</div>
              <div className="text-lg opacity-90">{locale === 'ar' ? 'نوع مستوطن' : 'Endemic Species'}</div>
              <div className="text-sm opacity-75 mt-1">{locale === 'ar' ? 'لا يوجد إلا في سقطرى' : 'Only in Socotra'}</div>
            </div>
            <div className="animate-fade-in transform hover:scale-105 transition-transform" style={{animationDelay: '0.1s'}}>
              <div className="text-5xl md:text-6xl font-bold mb-2">37%</div>
              <div className="text-lg opacity-90">{locale === 'ar' ? 'نباتات فريدة' : 'Unique Plants'}</div>
              <div className="text-sm opacity-75 mt-1">{locale === 'ar' ? 'من إجمالي النباتات' : 'Of total plants'}</div>
            </div>
            <div className="animate-fade-in transform hover:scale-105 transition-transform" style={{animationDelay: '0.2s'}}>
              <div className="text-5xl md:text-6xl font-bold mb-2">5000+</div>
              <div className="text-lg opacity-90">{locale === 'ar' ? 'سائح سعيد' : 'Happy Tourists'}</div>
              <div className="text-sm opacity-75 mt-1">{locale === 'ar' ? 'من جميع أنحاء العالم' : 'From around the world'}</div>
            </div>
            <div className="animate-fade-in transform hover:scale-105 transition-transform" style={{animationDelay: '0.3s'}}>
              <div className="text-5xl md:text-6xl font-bold mb-2">10+</div>
              <div className="text-lg opacity-90">{locale === 'ar' ? 'سنوات خبرة' : 'Years Experience'}</div>
              <div className="text-sm opacity-75 mt-1">{locale === 'ar' ? 'في السياحة المحلية' : 'In local tourism'}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          Welcome Message + Highlights (من متطلبات PDF)
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white dark:bg-gray-900 transition-colors">
        <div className="container-custom">
          <div className="text-center max-w-4xl mx-auto mb-16">
            <div className="inline-block px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-semibold mb-4">
              {locale === 'ar' ? 'مرحباً بك في سقطرى' : 'Welcome to Socotra'}
            </div>
            
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {locale === 'ar' ? 'اكتشف جمال' : 'Discover the Beauty of'}{' '}
              <span className="text-gradient bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                {locale === 'ar' ? 'سقطرى' : 'Socotra'}
              </span>
            </h2>

            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
              {locale === 'ar'
                ? 'جزيرة سقطرى هي واحدة من أكثر الأماكن غرابة وجمالاً على وجه الأرض. تضم أكثر من 700 نوع من الكائنات المستوطنة التي لا توجد في أي مكان آخر في العالم، مما يجعلها وجهة فريدة لعشاق الطبيعة والمغامرة.'
                : 'Socotra Island is one of the most extraordinary and beautiful places on Earth. Home to over 700 endemic species found nowhere else in the world, making it a unique destination for nature lovers and adventure seekers.'}
            </p>

            {/* Highlights of Socotra */}
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl transform hover:-translate-y-2 transition-all">
                <div className="w-16 h-16 bg-green-500 dark:bg-green-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {locale === 'ar' ? 'موقع تراث عالمي' : 'UNESCO World Heritage'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {locale === 'ar'
                    ? 'معترف بها من قبل اليونسكو كموقع تراث عالمي منذ 2008'
                    : 'Recognized by UNESCO as World Heritage Site since 2008'}
                </p>
              </div>

              <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl transform hover:-translate-y-2 transition-all">
                <div className="w-16 h-16 bg-blue-500 dark:bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {locale === 'ar' ? 'نباتات فريدة' : 'Unique Flora'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {locale === 'ar'
                    ? 'موطن لأشجار دم الأخوين الأسطورية والنباتات النادرة'
                    : 'Home to legendary Dragon Blood Trees and rare plants'}
                </p>
              </div>

              <div className="p-6 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-2xl transform hover:-translate-y-2 transition-all">
                <div className="w-16 h-16 bg-purple-500 dark:bg-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {locale === 'ar' ? 'شواطئ بكر' : 'Pristine Beaches'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {locale === 'ar'
                    ? 'شواطئ رملية بيضاء ومياه كريستالية صافية'
                    : 'White sandy beaches with crystal clear waters'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          Featured Tours Section (من متطلبات PDF)
          ═══════════════════════════════════════════════════════════════ */}
      <section id="tours" className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-semibold mb-4">
              {locale === 'ar' ? 'رحلاتنا المميزة' : 'Featured Tours'}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {locale === 'ar' ? 'استكشف' : 'Explore'}{' '}
              <span className="text-gradient bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                {locale === 'ar' ? 'أفضل الرحلات' : 'Best Tours'}
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {locale === 'ar'
                ? 'اختر من بين مجموعة متنوعة من الرحلات المصممة خصيصاً لتناسب جميع الأذواق والميزانيات'
                : 'Choose from a variety of tours specially designed to suit all tastes and budgets'}
            </p>
          </div>

          {/* Loading State */}
          {toursLoading && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-white dark:bg-gray-700 rounded-2xl overflow-hidden shadow-lg animate-pulse">
                  <div className="h-64 bg-gray-300 dark:bg-gray-600" />
                  <div className="p-6 space-y-4">
                    <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded w-3/4" />
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-full" />
                    <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-5/6" />
                    <div className="h-10 bg-gray-300 dark:bg-gray-600 rounded mt-4" />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Tours Grid */}
          {!toursLoading && tours.length > 0 && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {tours.slice(0, 6).map((tour) => (
                <TourCard key={tour.id} tour={tour} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!toursLoading && tours.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎯</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {locale === 'ar' ? 'لا توجد جولات متاحة حالياً' : 'No Tours Available'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {locale === 'ar' ? 'تحقق مرة أخرى قريباً!' : 'Check back soon!'}
              </p>
              <Link
                href="/admin/tours"
                className="inline-block px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:shadow-xl transition-all"
              >
                {locale === 'ar' ? 'إضافة جولة من لوحة التحكم' : 'Add Tour from Admin Panel'}
              </Link>
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/tours"
              className="btn btn-outline inline-flex items-center gap-2 transform hover:scale-105 transition-all"
            >
              {locale === 'ar' ? 'عرض جميع الرحلات' : 'View All Tours'}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={locale === 'ar' ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          Latest News & Updates Section (من متطلبات PDF)
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white dark:bg-gray-900 transition-colors">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-semibold mb-4">
              {locale === 'ar' ? 'آخر الأخبار' : 'Latest News'}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {locale === 'ar' ? 'أخبار و' : 'News &'}{' '}
              <span className="text-gradient bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                {locale === 'ar' ? 'تحديثات سقطرى' : 'Socotra Updates'}
              </span>
            </h2>
          </div>

          {newsLoading ? (
            <div className="text-center py-12">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
              <p className="mt-4 text-gray-600 dark:text-gray-400">
                {locale === 'ar' ? 'جارِ التحميل...' : 'Loading...'}
              </p>
            </div>
          ) : newsArticles.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-5xl mb-4">📰</div>
              <p className="text-gray-600 dark:text-gray-400">
                {locale === 'ar' ? 'لا توجد أخبار حالياً' : 'No news available'}
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-3 gap-8">
              {newsArticles.map((article) => {
                const title = locale === 'ar' ? article.titleAr : article.title
                const excerpt = locale === 'ar' ? article.excerptAr : article.excerpt

                return (
                  <article
                    key={article.id}
                    className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2"
                  >
                    {article.coverImage && (
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={article.coverImage}
                          alt={title}
                          fill
                          className="object-cover"
                        />
                        {article.breaking && (
                          <div className="absolute top-4 left-4">
                            <span className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full animate-pulse">
                              🔥 {locale === 'ar' ? 'عاجل' : 'Breaking'}
                            </span>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="p-6">
                      <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400 mb-3">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{new Date(article.publishedAt || article.createdAt).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                      </div>

                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">
                        {title}
                      </h3>

                      <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3">
                        {excerpt}
                      </p>

                      <Link
                        href={`/news/${article.slug}`}
                        className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 font-semibold hover:gap-3 transition-all"
                      >
                        {locale === 'ar' ? 'اقرأ المزيد' : 'Read More'}
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={locale === 'ar' ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
                        </svg>
                      </Link>
                    </div>
                  </article>
                )
              })}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/news"
              className="btn btn-outline inline-flex items-center gap-2 transform hover:scale-105 transition-all"
            >
              {locale === 'ar' ? 'جميع الأخبار' : 'All News'}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={locale === 'ar' ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          Why Choose Us Section - Premium
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-semibold mb-4">
              {locale === 'ar' ? 'لماذا تختارنا' : 'Why Choose Us'}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {locale === 'ar' ? 'لماذا تختار' : 'Why Choose'}{' '}
              <span className="text-gradient bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                {locale === 'ar' ? 'Hawari Tours؟' : 'Hawari Tours?'}
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {locale === 'ar'
                ? 'نحن نقدم أفضل تجربة سياحية في سقطرى مع الاهتمام بكل التفاصيل'
                : 'We provide the best tourism experience in Socotra with attention to every detail'}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {whyChooseUs.map((feature, index) => (
              <div
                key={index}
                className="group p-8 bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 dark:from-green-600 dark:to-emerald-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-white">
                  {feature.icon}
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {feature.title[locale]}
                </h3>

                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description[locale]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          Weather Section - Beautiful Widget
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-indigo-700 to-purple-800 dark:from-blue-900 dark:via-indigo-950 dark:to-purple-950 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-pattern-dots"></div>
        </div>

        <div className="container-custom relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-6 py-3 rounded-full mb-4">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
                <span className="font-semibold">{locale === 'ar' ? 'طقس سقطرى' : 'Socotra Weather'}</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold mb-6">
                {locale === 'ar' ? 'الطقس اليوم' : 'Today\'s Weather'}
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Current Weather */}
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <div className="text-7xl font-bold mb-2">
                      {weatherData?.temp || 28}°C
                    </div>
                    <div className="text-xl opacity-90">
                      {weatherData?.condition || (locale === 'ar' ? 'صافي' : 'Clear')}
                    </div>
                  </div>
                  <svg className="w-24 h-24 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
                      </svg>
                      <span className="text-sm opacity-75">
                        {locale === 'ar' ? 'الرطوبة' : 'Humidity'}
                      </span>
                    </div>
                    <div className="text-2xl font-bold">{weatherData?.humidity || 65}%</div>
                  </div>

                  <div className="bg-white/10 rounded-xl p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                      </svg>
                      <span className="text-sm opacity-75">
                        {locale === 'ar' ? 'الرياح' : 'Wind'}
                      </span>
                    </div>
                    <div className="text-2xl font-bold">{weatherData?.wind || 12} km/h</div>
                  </div>
                </div>
              </div>

              {/* Weather Forecast */}
              <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20">
                <h3 className="text-2xl font-bold mb-6">
                  {locale === 'ar' ? 'توقعات الأيام القادمة' : 'Next Days Forecast'}
                </h3>

                <div className="space-y-4">
                  {['Tomorrow', 'Friday', 'Saturday'].map((day, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b border-white/20 last:border-0">
                      <span className="font-semibold">{locale === 'ar' ? ['غداً', 'الجمعة', 'السبت'][index] : day}</span>
                      <div className="flex items-center gap-3">
                        <svg className="w-6 h-6 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                        </svg>
                        <span className="text-lg font-bold">{27 + index}°</span>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-sm opacity-75 mt-6">
                  {locale === 'ar'
                    ? '* أفضل وقت للزيارة من أكتوبر إلى إبريل'
                    : '* Best time to visit: October to April'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          Instagram Feed Section
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white dark:bg-gray-900 transition-colors">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-pink-100 dark:bg-pink-900/30 text-pink-700 dark:text-pink-400 rounded-full px-6 py-3 text-sm font-semibold mb-4">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"/>
              </svg>
              <span>@HawariTours</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {locale === 'ar' ? 'تابعنا على' : 'Follow Us on'}{' '}
              <span className="text-gradient bg-gradient-to-r from-pink-600 to-purple-600 dark:from-pink-400 dark:to-purple-400 bg-clip-text text-transparent">
                Instagram
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {instagramPosts.map((post) => (
              <a
                key={post.id}
                href="https://instagram.com/hawaritours"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative aspect-square overflow-hidden rounded-2xl bg-gradient-to-br from-pink-400 to-purple-500"
              >
                {/* Placeholder gradient - يمكن استبداله بصور حقيقية */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg className="w-12 h-12 text-white/30" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                  </svg>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center p-4">
                  <div className="flex items-center gap-4 text-white text-sm">
                    <div className="flex items-center gap-1">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                      </svg>
                      <span>{post.comments}</span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>

          <div className="text-center mt-12">
            <a
              href="https://instagram.com/hawaritours"
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline inline-flex items-center gap-2 transform hover:scale-105 transition-all border-pink-500 text-pink-600 hover:bg-pink-500 hover:text-white dark:border-pink-400 dark:text-pink-400 dark:hover:bg-pink-400 dark:hover:text-white"
            >
              {locale === 'ar' ? 'شاهد المزيد' : 'View More'}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={locale === 'ar' ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
              </svg>
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          Newsletter Section
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gradient-to-r from-green-600 via-emerald-700 to-teal-800 dark:from-green-900 dark:via-emerald-950 dark:to-teal-950 text-white relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        </div>

        <div className="container-custom relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-6 py-3 rounded-full mb-6">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
              <span className="font-semibold">{locale === 'ar' ? 'النشرة البريدية' : 'Newsletter'}</span>
            </div>

            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              {locale === 'ar' ? 'احصل على عروض حصرية' : 'Get Exclusive Offers'}
            </h2>

            <p className="text-xl opacity-90 mb-12 max-w-2xl mx-auto">
              {locale === 'ar'
                ? 'اشترك في نشرتنا البريدية واحصل على آخر العروض والأخبار والنصائح لرحلتك القادمة'
                : 'Subscribe to our newsletter and get the latest offers, news, and tips for your next trip'}
            </p>

            <form className="max-w-2xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  placeholder={locale === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                  className="flex-1 px-6 py-4 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 text-white placeholder-white/70 focus:outline-none focus:ring-4 focus:ring-white/20"
                />
                <button
                  type="submit"
                  className="btn btn-primary px-8 py-4 bg-white text-green-600 hover:bg-gray-100 font-bold rounded-2xl transform hover:scale-105 transition-all shadow-2xl"
                >
                  {locale === 'ar' ? 'اشترك الآن' : 'Subscribe Now'}
                </button>
              </div>

              <p className="text-sm opacity-75 mt-4">
                {locale === 'ar'
                  ? '✓ لن نشارك بريدك مع أي طرف ثالث'
                  : '✓ We will never share your email with third parties'}
              </p>
            </form>

            {/* Newsletter Benefits */}
            <div className="grid md:grid-cols-3 gap-6 mt-12">
              <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                  </svg>
                </div>
                <h4 className="font-bold mb-2">
                  {locale === 'ar' ? 'عروض حصرية' : 'Exclusive Offers'}
                </h4>
                <p className="text-sm opacity-90">
                  {locale === 'ar'
                    ? 'خصومات خاصة للمشتركين فقط'
                    : 'Special discounts for subscribers only'}
                </p>
              </div>

              <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                  </svg>
                </div>
                <h4 className="font-bold mb-2">
                  {locale === 'ar' ? 'آخر الأخبار' : 'Latest News'}
                </h4>
                <p className="text-sm opacity-90">
                  {locale === 'ar'
                    ? 'كن أول من يعلم بالأخبار الجديدة'
                    : 'Be first to know about new updates'}
                </p>
              </div>

              <div className="p-6 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <h4 className="font-bold mb-2">
                  {locale === 'ar' ? 'نصائح السفر' : 'Travel Tips'}
                </h4>
                <p className="text-sm opacity-90">
                  {locale === 'ar'
                    ? 'نصائح مفيدة لرحلتك إلى سقطرى'
                    : 'Useful tips for your Socotra trip'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          Final CTA Section
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/95 to-blue-900/95 dark:from-green-950/98 dark:to-blue-950/98"></div>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-pattern-dots"></div>
        </div>

        <div className="relative container-custom text-center z-10">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            {locale === 'ar' ? 'هل أنت جاهز لمغامرة العمر؟' : 'Ready for the Adventure of a Lifetime?'}
          </h2>

          <p className="text-xl text-gray-200 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            {locale === 'ar'
              ? 'احجز رحلتك إلى سقطرى الآن واستعد لتجربة لن تنساها أبداً!'
              : 'Book your Socotra trip now and get ready for an unforgettable experience!'}
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/tours"
              className="btn btn-primary text-lg px-8 py-4 bg-white text-green-600 hover:bg-gray-100 dark:hover:bg-gray-200 transform hover:scale-105 transition-all shadow-2xl"
            >
              {locale === 'ar' ? 'اختر رحلتك' : 'Choose Your Tour'}
            </Link>

            <a
              href="https://wa.me/967772371581"
              className="btn btn-outline text-lg px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-green-600 dark:hover:text-green-700 inline-flex items-center gap-2 transform hover:scale-105 transition-all"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              {locale === 'ar' ? 'تواصل عبر واتساب' : 'Contact on WhatsApp'}
            </a>
          </div>

          <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/80">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{locale === 'ar' ? 'مرخص رسمياً' : 'Officially Licensed'}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              <span>{locale === 'ar' ? '5000+ عميل سعيد' : '5000+ Happy Clients'}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{locale === 'ar' ? 'حجز آمن' : 'Secure Booking'}</span>
            </div>
          </div>
        </div>
      </section>
      
      <WhatsAppButton />
    </>
  )
}
