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
import { useLiveWeather } from '@/hooks/useLiveWeather'
import WhatsAppButton from '@/components/WhatsAppButton'
import TourCard from '@/components/TourCard'
import PackageCard from '@/components/PackageCard'

const emptyWelcomeMessage = {
  title: { ar: '', en: '' },
  subtitle: { ar: '', en: '' },
  content: { ar: '', en: '' },
  imageUrl: ''
}

export default function EnhancedHomePage() {
  const { locale, isDark } = useApp()
  const [currentSlide, setCurrentSlide] = useState(0)
  const [newsArticles, setNewsArticles] = useState([])
  const [tours, setTours] = useState([])
  const [toursLoading, setToursLoading] = useState(true)
  const [newsLoading, setNewsLoading] = useState(true)
  const [packages, setPackages] = useState([])
  const [packagesLoading, setPackagesLoading] = useState(true)
  const [heroSlides, setHeroSlides] = useState([])
  const [quickStats, setQuickStats] = useState([])
  const [welcomeMessage, setWelcomeMessage] = useState(emptyWelcomeMessage)
  const [whyChooseUs, setWhyChooseUs] = useState([])
  const {
    currentWeather,
    hourlyForecast,
    weeklyForecast,
    airQuality,
    recommendations,
    alerts,
    loading: weatherLoading,
    lastUpdate,
    refresh: refreshWeather
  } = useLiveWeather(locale)

  const fetchHomepageContent = async () => {
    try {
      const response = await fetch('/api/homepage')
      const result = await response.json()
      if (result.success) {
        const data = result.data || {}
        const mappedSlides = (data.heroSlides || [])
          .filter((slide) => slide?.imageUrl)
          .map((slide) => ({
            image: slide.imageUrl,
            title: { ar: slide.titleAr || '', en: slide.titleEn || '' },
            subtitle: { ar: slide.subtitleAr || '', en: slide.subtitleEn || '' },
            description: { ar: slide.descriptionAr || '', en: slide.descriptionEn || '' },
            buttonText: {
              ar: slide.buttonTextAr || '',
              en: slide.buttonText || ''
            },
            buttonLink: slide.buttonLink || ''
          }))

        setHeroSlides(mappedSlides)
        setQuickStats(data.quickStats || [])

        if ((data.welcomeMessages || []).length) {
          const message = data.welcomeMessages[0]
          setWelcomeMessage({
            title: { ar: message.titleAr || '', en: message.titleEn || '' },
            subtitle: { ar: message.subtitleAr || '', en: message.subtitleEn || '' },
            content: { ar: message.contentAr || '', en: message.contentEn || '' },
            imageUrl: message.imageUrl || ''
          })
        } else {
          setWelcomeMessage(emptyWelcomeMessage)
        }

        const mappedWhy = (data.whyChooseUs || []).map((item) => ({
          icon: item.icon || '⭐',
          color: item.color || '#10B981',
          title: { ar: item.titleAr || '', en: item.titleEn || '' },
          description: { ar: item.descriptionAr || '', en: item.descriptionEn || '' }
        }))
        setWhyChooseUs(mappedWhy)
      }
    } catch (error) {
      console.error('Failed to fetch homepage content:', error)
    }
  }

  useEffect(() => {
    fetchHomepageContent()
  }, [])

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

  useEffect(() => {
    if (heroSlides.length <= 1) return
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [heroSlides.length])

  useEffect(() => {
    if (currentSlide >= heroSlides.length) {
      setCurrentSlide(0)
    }
  }, [currentSlide, heroSlides.length])

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
    fetchPackages()
  }, [])

  const fetchPackages = async () => {
    try {
      setPackagesLoading(true)
      const res = await fetch('/api/packages')
      const data = await res.json()
      if (data.success) {
        setPackages(data.data)
      }
    } catch (err) {
      console.error('Error fetching packages:', err)
    } finally {
      setPackagesLoading(false)
    }
  }

  const currentHeroSlide = heroSlides[currentSlide] || heroSlides[0] || null
  const heroButtonText = currentHeroSlide?.buttonText?.[locale] || ''
  const heroButtonLink = currentHeroSlide?.buttonLink || ''
  const welcomeHighlights = whyChooseUs.slice(0, 3)
  const hasHeroSection = heroSlides.length > 0
  const hasQuickStats = quickStats.length > 0
  const hasWelcomeSection = Boolean(
    welcomeMessage?.title?.ar ||
    welcomeMessage?.title?.en ||
    welcomeMessage?.subtitle?.ar ||
    welcomeMessage?.subtitle?.en ||
    welcomeMessage?.content?.ar ||
    welcomeMessage?.content?.en ||
    welcomeHighlights.length
  )
  const hasWhyChooseUs = whyChooseUs.length > 0
  const weatherGradient = currentWeather?.gradient || 'from-sky-500 to-indigo-600'
  const weatherUpdatedAt = lastUpdate
    ? lastUpdate.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })
    : null

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════
          Hero Section - Premium Design
          ═══════════════════════════════════════════════════════════════ */}
      {hasHeroSection && (
      <section className="relative h-screen min-h-[700px] overflow-hidden bg-black">
        {/* Background Slider */}
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${currentSlide === index ? 'opacity-100' : 'opacity-0'
              }`}
          >
            <Image
              src={slide.image}
              alt={slide.title?.[locale] || ''}
              fill
              className="object-cover"
              priority={index === 0}
              quality={90}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/25 dark:from-black/90 dark:via-black/70 dark:to-black/45" />
          </div>
        ))}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.25),transparent_45%),radial-gradient(circle_at_80%_10%,rgba(59,130,246,0.25),transparent_40%),radial-gradient(circle_at_70%_80%,rgba(236,72,153,0.25),transparent_45%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.08),transparent_55%)]" />
        <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-emerald-400/20 blur-3xl" />
        <div className="absolute -bottom-40 -right-32 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />
        <div className="absolute top-24 right-10 h-64 w-64 rounded-full border border-white/10 blur-0" />
        <div className="absolute bottom-24 left-10 h-56 w-56 rounded-full border border-white/10 blur-0" />

        {/* Content */}
        <div className="relative h-full flex items-center z-20">
          <div className="container-custom relative">
            <div className="max-w-4xl">
              {/* Badge */}
              <div className="inline-flex items-center gap-3 bg-white/15 dark:bg-white/10 backdrop-blur-md px-6 py-3 rounded-full mb-6 animate-fade-in ring-1 ring-white/20 shadow-[0_0_30px_rgba(16,185,129,0.25)]">
                <span className="w-2.5 h-2.5 bg-emerald-400 dark:bg-emerald-500 rounded-full animate-pulse"></span>
                <span className="text-white text-sm font-semibold tracking-widest">
                  {currentHeroSlide?.subtitle?.[locale] || ''}
                </span>
              </div>

              {/* Title */}
              <h1 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight leading-tight animate-slide-in-right drop-shadow-[0_10px_30px_rgba(0,0,0,0.55)]">
                {currentHeroSlide?.title?.[locale] || ''}
              </h1>

              {/* Description */}
              <p className="text-xl md:text-2xl text-gray-200 dark:text-gray-300 mb-8 leading-relaxed animate-slide-in-left">
                {currentHeroSlide?.description?.[locale] || ''}
              </p>

              <div className="flex flex-wrap gap-3 mb-10">
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-4 py-2 text-white/90 ring-1 ring-white/20 shadow-[0_0_24px_rgba(255,255,255,0.15)]">
                  <span className="text-base">⭐</span>
                  <span className="text-sm font-semibold">{locale === 'ar' ? 'تقييم 4.9/5' : '4.9/5 Rating'}</span>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-4 py-2 text-white/90 ring-1 ring-white/20 shadow-[0_0_24px_rgba(255,255,255,0.15)]">
                  <span className="text-base">🧭</span>
                  <span className="text-sm font-semibold">{locale === 'ar' ? 'جولات مخصصة' : 'Custom Tours'}</span>
                </div>
                <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur-md px-4 py-2 text-white/90 ring-1 ring-white/20 shadow-[0_0_24px_rgba(255,255,255,0.15)]">
                  <span className="text-base">🛡️</span>
                  <span className="text-sm font-semibold">{locale === 'ar' ? 'أمان مضمون' : 'Safety First'}</span>
                </div>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                {heroButtonText && (
                  <a
                    href={heroButtonLink || '#'}
                    className="btn btn-primary text-lg px-8 py-4 rounded-full transform hover:scale-105 transition-all shadow-lg shadow-emerald-600/30 hover:shadow-2xl hover:shadow-emerald-600/40"
                  >
                    {heroButtonText}
                    <svg className={`w-5 h-5 ${locale === 'ar' ? 'mr-2' : 'ml-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  </a>
                )}
                <a
                  href="https://wa.me/967772371581"
                  className="btn btn-outline text-lg px-8 py-4 rounded-full bg-white/10 backdrop-blur-md border-white text-white hover:bg-white hover:text-emerald-600 dark:hover:text-emerald-700 transform hover:scale-105 transition-all"
                >
                  <svg className={`w-6 h-6 ${locale === 'ar' ? 'ml-2' : 'mr-2'}`} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  {locale === 'ar' ? 'تواصل معنا' : 'Contact Us'}
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="absolute bottom-20 right-1/2 translate-x-1/2 hidden md:flex flex-col items-center gap-2 text-white/80 z-20 animate-bounce-subtle">
          <span className="text-xs font-semibold tracking-widest uppercase">
            {locale === 'ar' ? 'اسحب للأسفل' : 'Scroll Down'}
          </span>
          <div className="h-10 w-px bg-white/70" />
        </div>
        <div className="absolute bottom-8 right-1/2 translate-x-1/2 flex gap-3 z-20">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1 rounded-full transition-all duration-300 ${currentSlide === index
                ? 'w-12 bg-white'
                : 'w-8 bg-white/50 hover:bg-white/75'
                }`}
              aria-label={`Slide ${index + 1}`}
              suppressHydrationWarning
            />
          ))}
        </div>
      </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          Quick Stats Section
          ═══════════════════════════════════════════════════════════════ */}
      {hasQuickStats && (
      <section className="relative py-24 bg-gradient-to-r from-green-500 via-emerald-600 to-teal-600 dark:from-green-700 dark:via-emerald-800 dark:to-teal-900 transition-colors overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.18),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(255,255,255,0.15),transparent_45%)]" />
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-white text-center relative z-10">
            {quickStats.map((stat, index) => (
              <div
                key={stat.id || index}
                className="animate-fade-in transform-gpu transition-all duration-500 hover:-translate-y-2"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="group relative overflow-hidden rounded-3xl bg-white/10 backdrop-blur-md ring-1 ring-white/20 p-6 shadow-xl transition-all duration-500 hover:ring-white/40 hover:shadow-2xl">
                  <div className="absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ background: `radial-gradient(circle at 20% 20%, ${stat.color || '#FFFFFF'}33, transparent 60%)` }} />
                  <div className="relative flex items-center justify-center mb-3">
                    <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl transition-all duration-500 group-hover:scale-110 group-hover:-rotate-6" style={{ backgroundColor: `${stat.color || '#FFFFFF'}33` }}>
                      {stat.icon || '⭐'}
                    </div>
                  </div>
                  <div className="relative text-5xl md:text-6xl font-black mb-2 transition-all duration-500 group-hover:scale-105" style={{ color: stat.color || '#FFFFFF' }}>
                    {stat.value}
                  </div>
                  <div className="relative text-lg font-semibold opacity-95 transition-all duration-500 group-hover:opacity-100">
                    {locale === 'ar' ? stat.labelAr : stat.labelEn}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          Welcome Message + Highlights (من متطلبات PDF)
          ═══════════════════════════════════════════════════════════════ */}
      {hasWelcomeSection && (
      <section className="py-24 bg-white dark:bg-gray-900 transition-colors">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className={`text-center ${locale === 'ar' ? 'lg:text-right lg:order-2' : 'lg:text-left lg:order-1'}`}>
              <div className="inline-block px-5 py-2.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-semibold mb-4">
                {welcomeMessage?.subtitle?.[locale] || ''}
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                <span className="text-gradient bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                  {welcomeMessage?.title?.[locale] || ''}
                </span>
              </h2>

              <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed mb-8">
                {welcomeMessage?.content?.[locale] || ''}
              </p>

              {welcomeHighlights.length > 0 && (
                <div className="grid md:grid-cols-3 gap-6 mt-12">
                  {welcomeHighlights.map((feature, index) => (
                    <div
                      key={feature.id || index}
                      className="p-7 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-3xl transform hover:-translate-y-2 transition-all shadow-xl hover:shadow-2xl ring-1 ring-black/5 dark:ring-white/10"
                    >
                      <div
                        className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg text-white"
                        style={{ backgroundColor: feature.color || '#10B981' }}
                      >
                        <span className="text-3xl">{feature.icon || '⭐'}</span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {feature.title?.[locale] || feature.title?.ar || feature.title?.en}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {feature.description?.[locale] || feature.description?.ar || feature.description?.en}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {welcomeMessage?.imageUrl && (
              <div className={`relative ${locale === 'ar' ? 'lg:order-1' : 'lg:order-2'}`}>
                <div className="group relative overflow-hidden rounded-[2.5rem] shadow-2xl ring-1 ring-black/5 dark:ring-white/10">
                  <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/20 via-transparent to-cyan-500/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.18),transparent_40%)] opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <div className="relative aspect-[4/3] md:aspect-[5/4] lg:aspect-[4/5]">
                    <Image
                      src={welcomeMessage.imageUrl}
                      alt={welcomeMessage?.title?.[locale] || ''}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          Featured Tours Section (من متطلبات PDF)
          ═══════════════════════════════════════════════════════════════ */}
      <section id="tours" className="relative py-24 bg-gray-50 dark:bg-gray-800 transition-colors overflow-hidden">
        <div className="absolute -top-32 -right-32 h-80 w-80 rounded-full bg-emerald-400/15 blur-3xl" />
        <div className="absolute -bottom-40 -left-24 h-96 w-96 rounded-full bg-green-500/10 blur-3xl" />
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block px-5 py-2.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-semibold mb-4">
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
                <div key={i} className="bg-white/80 dark:bg-gray-700/80 rounded-3xl overflow-hidden shadow-xl ring-1 ring-black/5 dark:ring-white/10 animate-pulse backdrop-blur">
                  <div className="h-64 bg-gray-300/70 dark:bg-gray-600/70" />
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
              className="btn btn-outline inline-flex items-center gap-2 transform hover:scale-105 transition-all rounded-full px-8 py-3"
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
          Travel Packages Section - (Added based on user request)
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative py-24 bg-white dark:bg-gray-900 transition-colors overflow-hidden">
        <div className="absolute -top-32 -left-32 h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl" />
        <div className="absolute -bottom-32 -right-28 h-80 w-80 rounded-full bg-blue-400/10 blur-3xl" />
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block px-5 py-2.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-semibold mb-6">
              {locale === 'ar' ? 'باقات سياحية' : 'Travel Packages'}
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {locale === 'ar' ? 'باقات' : 'Complete'}{' '}
              <span className="text-gradient bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                {locale === 'ar' ? 'متكاملة' : 'Packages'}
              </span>
            </h2>

            <p className="text-lg text-gray-600 dark:text-gray-400">
              {locale === 'ar'
                ? 'باقات شاملة كل شيء: الإقامة، الطعام، النقل، والأنشطة'
                : 'All-inclusive packages: accommodation, meals, transport, and activities'}
            </p>
          </div>

          {packagesLoading ? (
            <div className="flex justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
          ) : packages.length > 0 ? (
            <div className="grid md:grid-cols-3 gap-8">
              {packages.map((pkg) => (
                <PackageCard key={pkg.id} pkg={pkg} />
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              {/* Fallback silent or message */}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/tours"
              className="btn btn-outline inline-flex items-center gap-2 transform hover:scale-105 transition-all rounded-full px-8 py-3"
            >
              {locale === 'ar' ? 'عرض جميع التفاصيل' : 'View All Details'}
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
      <section className="relative py-24 bg-white dark:bg-gray-900 transition-colors overflow-hidden">
        <div className="absolute -top-40 -right-24 h-96 w-96 rounded-full bg-blue-400/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-28 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl" />
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block px-5 py-2.5 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-semibold mb-4">
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
                    className="bg-white/90 dark:bg-gray-800/90 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 ring-1 ring-black/5 dark:ring-white/10 backdrop-blur"
                  >
                    {article.coverImage && (
                      <div className="relative h-52 overflow-hidden">
                        <Image
                          src={article.coverImage}
                          alt={title}
                          fill
                          className="object-cover transition-transform duration-700 hover:scale-105"
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
              className="btn btn-outline inline-flex items-center gap-2 transform hover:scale-105 transition-all rounded-full px-8 py-3"
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
      {hasWhyChooseUs && (
      <section className="relative py-24 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors overflow-hidden">
        <div className="absolute -top-36 -left-24 h-80 w-80 rounded-full bg-emerald-400/15 blur-3xl" />
        <div className="absolute -bottom-32 -right-20 h-72 w-72 rounded-full bg-teal-400/15 blur-3xl" />
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block px-5 py-2.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-semibold mb-4">
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
                className="group p-8 bg-white/90 dark:bg-gray-800/90 rounded-3xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 ring-1 ring-black/5 dark:ring-white/10 backdrop-blur"
              >
                <div
                  className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform text-white shadow-lg"
                  style={{ backgroundColor: feature.color || '#10B981' }}
                >
                  {typeof feature.icon === 'string' ? <span className="text-3xl">{feature.icon}</span> : feature.icon}
                </div>

                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {feature.title?.[locale] || ''}
                </h3>

                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                  {feature.description?.[locale] || ''}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          Weather Section - Beautiful Widget
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-24 bg-slate-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.18),transparent_40%),radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.2),transparent_45%),radial-gradient(circle_at_50%_80%,rgba(34,197,94,0.18),transparent_45%)]" />
        <div className="absolute -top-40 -left-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-40 -right-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
        <div className="container-custom relative z-10">
          <div className="max-w-6xl mx-auto">
            <div className="flex flex-col items-center text-center mb-12 gap-4">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full ring-1 ring-white/20">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                </svg>
                <span className="font-semibold">{locale === 'ar' ? 'طقس سقطرى الآن' : 'Live Socotra Weather'}</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold">
                {locale === 'ar' ? 'بيانات طقس حية ومحدثة' : 'Live, Updated Weather Data'}
              </h2>
              <div className="flex flex-wrap items-center justify-center gap-3 text-sm text-white/70">
                <span>{locale === 'ar' ? 'الموقع: سقطرى' : 'Location: Socotra'}</span>
                <span>•</span>
                <span>
                  {weatherUpdatedAt
                    ? `${locale === 'ar' ? 'آخر تحديث' : 'Last update'}: ${weatherUpdatedAt}`
                    : (locale === 'ar' ? 'جارٍ التحديث' : 'Updating')}
                </span>
                <button
                  type="button"
                  onClick={refreshWeather}
                  suppressHydrationWarning
                  className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 transition-colors ring-1 ring-white/20"
                >
                  {locale === 'ar' ? 'تحديث الآن' : 'Refresh'}
                </button>
              </div>
            </div>

            {weatherLoading && (
              <div className="rounded-3xl bg-white/5 border border-white/10 p-10 animate-pulse">
                <div className="h-8 w-48 bg-white/10 rounded mb-6" />
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="h-40 bg-white/10 rounded-2xl" />
                  <div className="h-40 bg-white/10 rounded-2xl" />
                  <div className="h-40 bg-white/10 rounded-2xl" />
                </div>
              </div>
            )}

            {!weatherLoading && currentWeather && (
              <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-6">
                  <div className={`rounded-3xl p-8 border border-white/15 shadow-2xl bg-gradient-to-br ${weatherGradient}`}>
                    <div className="flex flex-wrap items-center justify-between gap-6">
                      <div className="flex items-center gap-5">
                        <div className="text-6xl">{currentWeather.icon}</div>
                        <div>
                          <div className="text-6xl md:text-7xl font-black">
                            {Math.round(currentWeather.temp)}°C
                          </div>
                          <div className="text-white/90 text-lg font-semibold">
                            {currentWeather.condition}
                          </div>
                          <div className="text-white/70 text-sm">
                            {locale === 'ar' ? 'المحسوس' : 'Feels like'} {Math.round(currentWeather.feelsLike)}°C
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-2 text-sm text-white/90">
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🌅</span>
                          <span>{locale === 'ar' ? 'الشروق' : 'Sunrise'}: {currentWeather.sunrise}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🌇</span>
                          <span>{locale === 'ar' ? 'الغروب' : 'Sunset'}: {currentWeather.sunset}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-xl">🧭</span>
                          <span>
                            {locale === 'ar' ? 'اتجاه الرياح' : 'Wind'}: {currentWeather.windDirection?.label?.[locale] || currentWeather.windDirection?.label?.en} {currentWeather.windDirection?.arrow}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                      <div className="rounded-2xl bg-white/15 p-4 ring-1 ring-white/20">
                        <div className="text-xs uppercase tracking-widest text-white/70">{locale === 'ar' ? 'الرطوبة' : 'Humidity'}</div>
                        <div className="text-2xl font-bold">{currentWeather.humidity}%</div>
                      </div>
                      <div className="rounded-2xl bg-white/15 p-4 ring-1 ring-white/20">
                        <div className="text-xs uppercase tracking-widest text-white/70">{locale === 'ar' ? 'الرياح' : 'Wind'}</div>
                        <div className="text-2xl font-bold">{currentWeather.windSpeed} km/h</div>
                      </div>
                      <div className="rounded-2xl bg-white/15 p-4 ring-1 ring-white/20">
                        <div className="text-xs uppercase tracking-widest text-white/70">{locale === 'ar' ? 'الرؤية' : 'Visibility'}</div>
                        <div className="text-2xl font-bold">{currentWeather.visibility} km</div>
                      </div>
                      <div className="rounded-2xl bg-white/15 p-4 ring-1 ring-white/20">
                        <div className="text-xs uppercase tracking-widest text-white/70">{locale === 'ar' ? 'الضغط' : 'Pressure'}</div>
                        <div className="text-2xl font-bold">{currentWeather.pressure} hPa</div>
                      </div>
                      <div className="rounded-2xl bg-white/15 p-4 ring-1 ring-white/20">
                        <div className="text-xs uppercase tracking-widest text-white/70">{locale === 'ar' ? 'الأشعة UV' : 'UV Index'}</div>
                        <div className="text-2xl font-bold">{currentWeather.uvi}</div>
                        <div className="text-xs text-white/70">
                          {currentWeather.uvLevel?.label?.[locale] || currentWeather.uvLevel?.label?.en}
                        </div>
                      </div>
                      <div className="rounded-2xl bg-white/15 p-4 ring-1 ring-white/20">
                        <div className="text-xs uppercase tracking-widest text-white/70">{locale === 'ar' ? 'غيوم' : 'Clouds'}</div>
                        <div className="text-2xl font-bold">{currentWeather.cloudCover}%</div>
                      </div>
                      <div className="rounded-2xl bg-white/15 p-4 ring-1 ring-white/20">
                        <div className="text-xs uppercase tracking-widest text-white/70">{locale === 'ar' ? 'ندى' : 'Dew Point'}</div>
                        <div className="text-2xl font-bold">{currentWeather.dewPoint}°</div>
                      </div>
                      <div className="rounded-2xl bg-white/15 p-4 ring-1 ring-white/20">
                        <div className="text-xs uppercase tracking-widest text-white/70">{locale === 'ar' ? 'الأمطار' : 'Rain'}</div>
                        <div className="text-2xl font-bold">{currentWeather.rain}%</div>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-3xl bg-white/5 border border-white/10 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold">{locale === 'ar' ? 'الساعات القادمة' : 'Next Hours'}</h3>
                      <span className="text-sm text-white/70">{locale === 'ar' ? 'تحديث تلقائي كل 10 دقائق' : 'Auto refresh every 10 min'}</span>
                    </div>
                    <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                      {hourlyForecast.slice(0, 8).map((hour, index) => (
                        <div key={`${hour.time}-${index}`} className="rounded-2xl bg-white/10 p-3 text-center">
                          <div className="text-xs text-white/70">{hour.time}</div>
                          <div className="text-2xl my-2">{hour.icon}</div>
                          <div className="font-bold">{Math.round(hour.temp)}°</div>
                          <div className="text-[11px] text-white/60">{Math.round(hour.windSpeed)} km/h</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="rounded-3xl bg-white/5 border border-white/10 p-6">
                    <h3 className="text-xl font-bold mb-4">{locale === 'ar' ? 'توقعات 7 أيام' : '7-Day Forecast'}</h3>
                    <div className="space-y-3">
                      {weeklyForecast.slice(0, 7).map((day, index) => (
                        <div key={`${day.day}-${index}`} className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3">
                          <div className="flex items-center gap-3">
                            <span className="text-2xl">{day.icon}</span>
                            <div>
                              <div className="font-semibold">{day.day}</div>
                              <div className="text-xs text-white/60">{day.date}</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-sm">
                            <span className="text-white/70">{day.condition}</span>
                            <span className="font-bold">{day.high}°</span>
                            <span className="text-white/60">{day.low}°</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-3xl bg-white/5 border border-white/10 p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-xl font-bold">{locale === 'ar' ? 'جودة الهواء' : 'Air Quality'}</h3>
                      {airQuality && (
                        <span className="text-2xl">{airQuality.emoji}</span>
                      )}
                    </div>
                    {airQuality && (
                      <div className="flex items-center justify-between rounded-2xl bg-white/10 p-4 mb-5">
                        <div className="text-sm text-white/70">{locale === 'ar' ? 'المؤشر' : 'AQI'}</div>
                        <div className="text-3xl font-black">{airQuality.aqi}</div>
                        <div className="text-sm font-semibold">
                          {airQuality.label?.[locale] || airQuality.label?.en}
                        </div>
                      </div>
                    )}
                    <div className="space-y-2">
                      {recommendations.slice(0, 3).map((item, index) => (
                        <div key={`${item.text}-${index}`} className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3">
                          <span className="text-xl">{item.icon}</span>
                          <span className="text-sm text-white/80">{item.text}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {alerts.length > 0 && (
                    <div className="rounded-3xl bg-red-500/15 border border-red-400/30 p-6">
                      <h3 className="text-xl font-bold mb-3">{locale === 'ar' ? 'تنبيهات الطقس' : 'Weather Alerts'}</h3>
                      <div className="space-y-3 text-sm text-white/90">
                        {alerts.map((alert, index) => (
                          <div key={`${alert.event}-${index}`} className="rounded-2xl bg-red-500/20 px-4 py-3">
                            <div className="font-semibold">{alert.event || (locale === 'ar' ? 'تنبيه' : 'Alert')}</div>
                            <div className="text-white/80">{alert.description || ''}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
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

            <form className="max-w-2xl mx-auto flex flex-col md:flex-row gap-4">
              <input
                type="email"
                placeholder={locale === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                className="flex-1 px-6 py-4 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 text-white placeholder-gray-200 focus:outline-none focus:bg-white/30 transition-all"
                suppressHydrationWarning
              />
              <button
                type="submit"
                className="btn btn-primary px-8 py-4 bg-white text-green-600 hover:bg-gray-100 font-bold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all"
                suppressHydrationWarning
              >
                {locale === 'ar' ? 'اشترك الآن' : 'Subscribe Now'}
              </button>
            </form>

            <p className="text-sm opacity-75 mt-4">
              {locale === 'ar'
                ? '✓ لن نشارك بريدك مع أي طرف ثالث'
                : '✓ We will never share your email with third parties'}
            </p>

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
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
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
