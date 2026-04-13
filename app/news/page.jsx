'use client'

// ═══════════════════════════════════════════════════════════════
// 📰 ULTIMATE NEWS PAGE - STUNNING & PROFESSIONAL
// صفحة الأخبار - رهيبة واحترافية ومبهرة جداً جداً
// ✅ Weather Widget + Featured News + Categories + Animations
// ═══════════════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useApp } from '@/contexts/AppContext'
import { motion, AnimatePresence } from 'framer-motion'
import WhatsAppButton from '@/components/WhatsAppButton'
import { useLiveWeather } from '@/hooks/useLiveWeather'

export default function UltimateNewsPage() {
  const { locale } = useApp()
  const resolvedLocale = typeof locale === 'string' ? locale : 'en'
  const localeKey = resolvedLocale.toLowerCase().startsWith('ar') ? 'ar' : 'en'

  // Weather Hook
  const {
    currentWeather,
    hourlyForecast,
    weeklyForecast,
    airQuality,
    recommendations,
    alerts,
    lastUpdate,
    refresh: refreshWeather,
    loading: weatherLoading
  } = useLiveWeather(locale)

  // State
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [isMounted, setIsMounted] = useState(false)
  const [activeCategory, setActiveCategory] = useState('all')
  const [featuredNews, setFeaturedNews] = useState([])
  const [featuredIndex, setFeaturedIndex] = useState(0)

  // Categories with proper config
  const categories = [
    { value: 'all', label: { ar: 'الكل', en: 'All' }, icon: '📰', color: 'from-gray-500 to-gray-700' },
    { value: 'TOURISM', label: { ar: 'سياحة', en: 'Tourism' }, icon: '✈️', color: 'from-blue-500 to-cyan-600' },
    { value: 'CULTURE', label: { ar: 'ثقافة', en: 'Culture' }, icon: '🎭', color: 'from-purple-500 to-pink-600' },
    { value: 'ENVIRONMENT', label: { ar: 'بيئة', en: 'Environment' }, icon: '🌿', color: 'from-green-500 to-emerald-600' },
    { value: 'WEATHER', label: { ar: 'طقس', en: 'Weather' }, icon: '🌤️', color: 'from-yellow-500 to-orange-600' },
    { value: 'UNESCO', label: { ar: 'يونسكو', en: 'UNESCO' }, icon: '🏛️', color: 'from-indigo-500 to-purple-600' },
    { value: 'EVENTS', label: { ar: 'فعاليات', en: 'Events' }, icon: '🎉', color: 'from-pink-500 to-rose-600' }
  ]

  // Mount
  useEffect(() => {
    setIsMounted(true)
    fetchNews()
  }, [])

  // Auto-rotate featured news
  useEffect(() => {
    if (featuredNews.length > 0) {
      const interval = setInterval(() => {
        setFeaturedIndex((prev) => (prev + 1) % featuredNews.length)
      }, 5000)
      return () => clearInterval(interval)
    }
  }, [featuredNews])

  // Fetch news from database
  const fetchNews = async () => {
    setLoading(true)
    try {
      console.log('🔄 Fetching news...')
      const response = await fetch('/api/news/all')
      const result = await response.json()

      console.log('📦 News API response:', result)

      if (result.success) {
        const allNews = result.data || []
        console.log(`✅ Loaded ${allNews.length} published news`)
        setNews(allNews)
        setFeaturedNews(allNews.filter(n => n.featured))
      }
    } catch (error) {
      console.error('❌ Failed to fetch news:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filter news
  const filteredNews = activeCategory === 'all' 
    ? news 
    : news.filter(n => n.category === activeCategory)

  const currentFeatured = featuredNews[featuredIndex]

  // Get weather icon gradient
  const getWeatherGradient = () => {
    if (!currentWeather) return 'from-blue-400 to-cyan-500'
    if (currentWeather.gradient) return currentWeather.gradient
    const temp = currentWeather.temp
    if (temp >= 30) return 'from-orange-500 to-red-600'
    if (temp >= 25) return 'from-yellow-400 to-orange-500'
    if (temp >= 20) return 'from-blue-400 to-cyan-500'
    return 'from-cyan-400 to-blue-500'
  }

  const renderLocaleKey = isMounted ? localeKey : 'ar'
  const isAr = renderLocaleKey === 'ar'
  const weatherUpdatedAt = lastUpdate
    ? lastUpdate.toLocaleTimeString(renderLocaleKey, { hour: '2-digit', minute: '2-digit' })
    : null

  return (
    <div className={`min-h-screen bg-gradient-to-b from-gray-50 via-white to-gray-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 ${isAr ? 'rtl' : 'ltr'}`}>
      
      {/* Hero Section with Featured News */}
      <section className="relative h-[75vh] min-h-[650px] overflow-hidden">
        <AnimatePresence mode="wait">
          {currentFeatured && (
            <motion.div
              key={currentFeatured.id}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0"
            >
              {currentFeatured.coverImage && (
                <>
                  <Image
                    src={currentFeatured.coverImage}
                    alt={isAr ? currentFeatured.titleAr : currentFeatured.title}
                    fill
                    className="object-cover"
                    priority
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Animated Background Particles */}
        {isMounted && (
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(15)].map((_, i) => (
              <motion.div
                  key={i}
                className="absolute w-2 h-2 bg-white/20 rounded-full"
                initial={{
                  x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1000),
                  y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800)
                }}
                animate={{
                  y: [null, Math.random() * -100],
                  opacity: [0.2, 0.5, 0.2]
                }}
                transition={{
                  duration: 3 + Math.random() * 2,
                  repeat: Infinity,
                  ease: 'easeInOut'
                  }}
                />
              ))}
            </div>
          )}

        {/* Content Overlay */}
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-20">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="max-w-5xl"
            >
              {currentFeatured ? (
                <>
                  <div className="flex flex-wrap gap-3 mb-6">
                    <motion.span
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="px-5 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-full text-sm font-bold flex items-center gap-2 shadow-2xl"
                    >
                    <span className="text-xl">🔥</span>
                      <span>{isAr ? 'عاجل' : 'Breaking'}</span>
                    </motion.span>
                    <span className="px-5 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-sm font-bold shadow-xl backdrop-blur-md">
                      {categories.find(c => c.value === currentFeatured.category)?.icon} {categories.find(c => c.value === currentFeatured.category)?.label[renderLocaleKey]}
                    </span>
                  </div>
                  <h1 className="text-5xl md:text-7xl font-black text-white mb-6 drop-shadow-2xl leading-tight">
                    {isAr ? currentFeatured.titleAr : currentFeatured.title}
              </h1>
                  <p className="text-xl md:text-2xl text-white/95 mb-8 line-clamp-2 leading-relaxed">
                    {isAr ? currentFeatured.excerptAr : currentFeatured.excerpt}
                  </p>
                  <Link
                    href={`/news/${currentFeatured.slug}`}
                    className="inline-flex items-center gap-3 px-10 py-5 bg-white text-blue-600 rounded-2xl font-bold text-lg hover:bg-blue-50 hover:scale-105 transition-all shadow-2xl"
                  >
                    <span>{isAr ? 'اقرأ المزيد' : 'Read More'}</span>
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isAr ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
                  </svg>
                  </Link>
                </>
              ) : (
                <div>
                  <h1 className="text-6xl md:text-8xl font-black text-white mb-6 drop-shadow-2xl">
                    {isAr ? 'الأخبار والتحديثات' : 'News & Updates'}
                  </h1>
                  <p className="text-2xl text-white/95">
                    {isAr ? 'آخر الأخبار والمستجدات عن سقطرى' : 'Latest news and updates about Socotra'}
                  </p>
                </div>
              )}
            </motion.div>
                </div>
              </div>

        {/* Featured Navigation Dots */}
        {featuredNews.length > 1 && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3">
            {featuredNews.map((_, idx) => (
                <button
                key={idx}
                onClick={() => setFeaturedIndex(idx)}
                className={`h-2 rounded-full transition-all ${
                  idx === featuredIndex 
                    ? 'bg-white w-12 shadow-lg' 
                    : 'bg-white/40 w-2 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
        )}
      </section>

      {/* Weather Widget - STUNNING & PROFESSIONAL */}
      <section className="container mx-auto px-4 -mt-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -6 }}
          transition={{ type: 'spring', stiffness: 120, damping: 18 }}
          className="relative rounded-[32px] border border-white/15 bg-slate-950/80 backdrop-blur-xl shadow-[0_30px_100px_rgba(15,23,42,0.45)] overflow-hidden"
        >
          <motion.div
            animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.05, 1] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.22),transparent_40%),radial-gradient(circle_at_80%_10%,rgba(168,85,247,0.24),transparent_45%),radial-gradient(circle_at_50%_85%,rgba(34,197,94,0.2),transparent_45%)]"
          />
          <div className={`relative z-10 bg-gradient-to-br ${getWeatherGradient()} px-8 pt-8 pb-6`}>
            <div className="flex flex-wrap items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <motion.span
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="text-5xl"
                >
                  {currentWeather?.icon || '⛅'}
                </motion.span>
                <div>
                  <div className="text-white/70 text-sm font-semibold">
                    {isAr ? 'الطقس الحي في سقطرى' : 'Live Weather in Socotra'}
                  </div>
                  <motion.div
                    animate={{ scale: [1, 1.02, 1] }}
                    transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                    className="text-4xl md:text-5xl font-black text-white"
                  >
                    {currentWeather ? `${Math.round(currentWeather.temp)}°` : '--'}
                  </motion.div>
                  <div className="text-white/90 text-sm font-semibold">
                    {currentWeather?.condition || (isAr ? 'جارٍ التحميل' : 'Loading')}
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs text-white/80">
                <span>
                  {weatherUpdatedAt
                    ? `${isAr ? 'آخر تحديث' : 'Last update'}: ${weatherUpdatedAt}`
                    : (isAr ? 'جارٍ التحديث' : 'Updating')}
                </span>
                <button
                  type="button"
                  onClick={refreshWeather}
                  suppressHydrationWarning
                  className="px-4 py-2 rounded-full bg-white/15 hover:bg-white/25 transition-colors ring-1 ring-white/20"
                >
                  {isAr ? 'تحديث الآن' : 'Refresh'}
                </button>
                <div className="flex items-center gap-2">
                  <span>🌅</span>
                  <span>{currentWeather?.sunrise || '--'}</span>
                  <span>•</span>
                  <span>🌇</span>
                  <span>{currentWeather?.sunset || '--'}</span>
                </div>
              </div>
            </div>
          </div>

          {weatherLoading && (
            <div className="relative z-10 p-8">
              <div className="grid md:grid-cols-3 gap-6">
                <div className="h-40 rounded-2xl bg-white/5 animate-pulse" />
                <div className="h-40 rounded-2xl bg-white/5 animate-pulse" />
                <div className="h-40 rounded-2xl bg-white/5 animate-pulse" />
              </div>
            </div>
          )}

          {!weatherLoading && currentWeather && (
            <div className="relative z-10 p-8 grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                    <div className="text-xs text-white/60">{isAr ? 'الرطوبة' : 'Humidity'}</div>
                    <div className="text-2xl font-bold text-white">{currentWeather.humidity}%</div>
                  </div>
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                    <div className="text-xs text-white/60">{isAr ? 'الرياح' : 'Wind'}</div>
                    <div className="text-2xl font-bold text-white">{currentWeather.windSpeed} km/h</div>
                  </div>
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                    <div className="text-xs text-white/60">{isAr ? 'الرؤية' : 'Visibility'}</div>
                    <div className="text-2xl font-bold text-white">{currentWeather.visibility} km</div>
                  </div>
                  <div className="rounded-2xl bg-white/5 border border-white/10 p-4">
                    <div className="text-xs text-white/60">{isAr ? 'الأشعة UV' : 'UV Index'}</div>
                    <div className="text-2xl font-bold text-white">{currentWeather.uvi}</div>
                    <div className="text-[11px] text-white/60">
                      {currentWeather.uvLevel?.label?.[locale] || currentWeather.uvLevel?.label?.en}
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">{isAr ? 'الساعات القادمة' : 'Next Hours'}</h3>
                    <span className="text-xs text-white/50">{isAr ? 'تحديث تلقائي كل 10 دقائق' : 'Auto refresh every 10 min'}</span>
                  </div>
                  <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
                    {hourlyForecast.slice(0, 8).map((hour, index) => (
                      <motion.div
                        key={`${hour.time}-${index}`}
                        whileHover={{ y: -6, backgroundColor: 'rgba(255,255,255,0.08)' }}
                        transition={{ type: 'spring', stiffness: 150, damping: 16 }}
                        className="rounded-2xl bg-white/5 p-3 text-center"
                      >
                        <div className="text-[11px] text-white/60">{hour.time}</div>
                        <div className="text-2xl my-2">{hour.icon}</div>
                        <div className="font-bold text-white">{Math.round(hour.temp)}°</div>
                        <div className="text-[10px] text-white/50">{Math.round(hour.windSpeed)} km/h</div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
                  <h3 className="text-lg font-bold text-white mb-4">{isAr ? 'توقعات 7 أيام' : '7-Day Forecast'}</h3>
                  <div className="space-y-3">
                    {weeklyForecast.slice(0, 7).map((day, idx) => (
                      <motion.div
                        key={`${day.day}-${idx}`}
                        whileHover={{ x: isAr ? -6 : 6 }}
                        transition={{ type: 'spring', stiffness: 120, damping: 16 }}
                        className="flex items-center justify-between rounded-2xl bg-white/5 px-4 py-3"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-2xl">{day.icon}</span>
                          <div>
                            <div className="font-semibold text-white">{day.day}</div>
                            <div className="text-xs text-white/50">{day.date}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-4 text-xs text-white/70">
                          <span>{day.condition}</span>
                          <span className="font-bold text-white">{day.high}°</span>
                          <span className="text-white/50">{day.low}°</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl bg-white/5 border border-white/10 p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-bold text-white">{isAr ? 'جودة الهواء' : 'Air Quality'}</h3>
                    {airQuality && <span className="text-2xl">{airQuality.emoji}</span>}
                  </div>
                  {airQuality && (
                    <div className="flex items-center justify-between rounded-2xl bg-white/10 p-4 mb-4">
                      <div className="text-xs text-white/60">{isAr ? 'المؤشر' : 'AQI'}</div>
                      <div className="text-3xl font-black text-white">{airQuality.aqi}</div>
                      <div className="text-xs font-semibold text-white/80">
                        {airQuality.label?.[renderLocaleKey] || airQuality.label?.en}
                      </div>
                    </div>
                  )}
                  {airQuality && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-[11px] text-white/50 mb-2">
                        <span>{isAr ? 'ممتاز' : 'Excellent'}</span>
                        <span>{isAr ? 'متوسط' : 'Moderate'}</span>
                        <span>{isAr ? 'غير صحي' : 'Unhealthy'}</span>
                      </div>
                      <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${Math.min(100, Math.max(5, (airQuality.aqi / 5) * 100))}%`,
                            backgroundColor: airQuality.color || '#22c55e'
                          }}
                        />
                      </div>
                    </div>
                  )}
                  <div className="space-y-2">
                    {recommendations.slice(0, 3).map((item, idx) => (
                      <div key={`${item.text}-${idx}`} className="flex items-center gap-3 rounded-2xl bg-white/5 px-4 py-3">
                        <span className="text-xl">{item.icon}</span>
                        <span className="text-sm text-white/80">{item.text}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {alerts.length > 0 && (
                  <div className="rounded-2xl bg-red-500/15 border border-red-400/30 p-6">
                    <h3 className="text-lg font-bold text-white mb-3">{isAr ? 'تنبيهات الطقس' : 'Weather Alerts'}</h3>
                    <div className="space-y-3 text-sm text-white/90">
                      {alerts.map((alert, idx) => (
                        <div key={`${alert.event}-${idx}`} className="rounded-2xl bg-red-500/20 px-4 py-3">
                          <div className="font-semibold">{alert.event || (isAr ? 'تنبيه' : 'Alert')}</div>
                          <div className="text-white/80">{alert.description || ''}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </motion.div>
      </section>

      {/* Categories Filter */}
      <section className="container mx-auto px-4 py-12">
        <div className="flex flex-wrap gap-4 justify-center">
          {categories.map((cat) => {
            const count = cat.value === 'all' 
              ? news.length 
              : news.filter(n => n.category === cat.value).length

            return (
              <motion.button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                className={`px-8 py-4 rounded-2xl font-bold transition-all shadow-lg ${
                  activeCategory === cat.value
                    ? `bg-gradient-to-r ${cat.color} text-white shadow-2xl`
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-xl'
                }`}
              >
                <span className="text-xl mr-2">{cat.icon}</span>
                <span className="text-lg">{cat.label[renderLocaleKey]}</span>
                <span className="ml-2 text-sm opacity-75">({count})</span>
              </motion.button>
            )
          })}
        </div>
      </section>

      {/* News Grid */}
      <section className="container mx-auto px-4 py-8 pb-20">
        {loading ? (
          <div className="text-center py-32">
            <div className="inline-block animate-spin rounded-full h-20 w-20 border-t-4 border-b-4 border-blue-600"></div>
            <p className="mt-6 text-gray-600 dark:text-gray-400 text-xl font-semibold">
              {isAr ? 'جارِ التحميل...' : 'Loading...'}
            </p>
          </div>
        ) : filteredNews.length === 0 ? (
          <div className="text-center py-32">
            <div className="text-8xl mb-6">📰</div>
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {isAr ? 'لا توجد أخبار' : 'No News Found'}
                </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
              {isAr ? 'لم نجد أخباراً في هذا التصنيف' : 'No news found in this category'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              {isAr 
                ? '💡 تأكد من نشر الأخبار من لوحة التحكم (Published = ✅)' 
                : '💡 Make sure to publish news from Admin Panel (Published = ✅)'}
                </p>
              </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredNews.map((article, idx) => {
              const category = categories.find(c => c.value === article.category) || categories[1]
              const title = isAr ? article.titleAr : article.title
              const excerpt = isAr ? article.excerptAr : article.excerpt

              return (
                <motion.div
                  key={article.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -8 }}
                  className="group"
                >
                  <Link href={`/news/${article.slug}`}>
                    <div className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all h-full">
                      {/* Image */}
                      {article.coverImage && (
                  <div className="relative h-64 overflow-hidden">
                          <Image
                            src={article.coverImage}
                            alt={title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                          
                          {/* Gradient Overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                          
                          {/* Badges */}
                          <div className="absolute top-4 left-4 right-4 flex gap-2 flex-wrap">
                            <span className={`px-4 py-2 bg-gradient-to-r ${category.color} text-white rounded-full text-xs font-bold flex items-center gap-2 shadow-lg`}>
                              <span>{category.icon}</span>
                              <span>{category.label[locale]}</span>
                      </span>

                      {article.breaking && (
                              <motion.span
                                animate={{ scale: [1, 1.1, 1] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                                className="px-4 py-2 bg-red-500 text-white rounded-full text-xs font-bold shadow-lg"
                              >
                                🔥 {isAr ? 'عاجل' : 'Breaking'}
                              </motion.span>
                            )}
                            
                      {article.trending && (
                              <span className="px-4 py-2 bg-yellow-500 text-white rounded-full text-xs font-bold shadow-lg">
                                📈 {isAr ? 'رائج' : 'Trending'}
                        </span>
                      )}
                  </div>

                          {/* Views Counter */}
                          <div className="absolute bottom-4 left-4 flex items-center gap-2 bg-black/50 backdrop-blur-md px-3 py-2 rounded-full">
                            <span className="text-white text-xs">👁️</span>
                            <span className="text-white text-xs font-bold">{article.viewsCount || 0}</span>
                      </div>
                    </div>
                      )}

                      {/* Content */}
                      <div className="p-6">
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
                          {title}
                </h3>
                        
                        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-3 leading-relaxed">
                          {excerpt}
                        </p>

                        {/* Tags */}
                        {article.tags && article.tags.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {article.tags.slice(0, 3).map((tag, idx) => (
                              <span
                                key={idx}
                                className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-semibold"
                              >
                                #{tag}
                </span>
                            ))}
              </div>
                        )}

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(article.publishedAt || article.createdAt).toLocaleDateString(locale, {
                      year: 'numeric',
                              month: 'short',
                      day: 'numeric'
                    })}
                  </span>

                          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold group-hover:gap-3 transition-all">
                            <span>{isAr ? 'اقرأ' : 'Read'}</span>
                            <svg
                              className="w-5 h-5 group-hover:translate-x-1 transition-transform"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                    <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d={isAr ? 'M11 19l-7-7 7-7m8 14l-7-7 7-7' : 'M13 7l5 5-5 5M6 12h12'}
                    />
                  </svg>
              </div>
            </div>
          </div>
        </div>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        )}
      </section>

      {/* WhatsApp Button */}
      <WhatsAppButton />
    </div>
  )
}
