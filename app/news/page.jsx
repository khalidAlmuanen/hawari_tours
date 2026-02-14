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
  const isAr = locale === 'ar'

  // Weather Hook
  const {
    currentWeather,
    weeklyForecast,
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
    const temp = currentWeather.temp
    if (temp >= 30) return 'from-orange-500 to-red-600'
    if (temp >= 25) return 'from-yellow-400 to-orange-500'
    if (temp >= 20) return 'from-blue-400 to-cyan-500'
    return 'from-cyan-400 to-blue-500'
  }

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
                      {categories.find(c => c.value === currentFeatured.category)?.icon} {categories.find(c => c.value === currentFeatured.category)?.label[locale]}
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
      {!weatherLoading && currentWeather && (
        <section className="container mx-auto px-4 -mt-16 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-gradient-to-br ${getWeatherGradient()} rounded-3xl p-8 shadow-2xl backdrop-blur-lg border border-white/20`}
          >
            <div className="grid md:grid-cols-3 gap-6">
              {/* Current Weather */}
              <div className="md:col-span-1">
                <div className="flex items-center gap-4 mb-4">
                  <span className="text-6xl">{currentWeather.icon}</span>
                  <div>
                    <h3 className="text-white/90 text-sm font-semibold">
                      {isAr ? 'الطقس الآن' : 'Current Weather'}
                    </h3>
                    <p className="text-white text-5xl font-black">
                      {Math.round(currentWeather.temp)}°
                    </p>
                  </div>
                </div>
                <p className="text-white/90 text-lg font-semibold mb-2">
                  {currentWeather.condition}
                </p>
                <div className="flex items-center gap-4 text-white/80 text-sm">
                  <span>↑ {Math.round(currentWeather.tempMax)}°</span>
                  <span>↓ {Math.round(currentWeather.tempMin)}°</span>
                </div>
              </div>

              {/* Weekly Forecast */}
              <div className="md:col-span-2">
                <div className="grid grid-cols-4 lg:grid-cols-7 gap-3">
                  {weeklyForecast.slice(0, 7).map((day, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white/10 backdrop-blur-md rounded-2xl p-4 text-center hover:bg-white/20 transition-all"
                    >
                      <p className="text-white/80 text-xs font-semibold mb-2">
                        {day.day}
                      </p>
                      <span className="text-3xl mb-2 block">{day.icon}</span>
                      <div className="flex justify-center gap-1 text-white text-sm font-bold">
                        <span>{Math.round(day.high)}°</span>
                        <span className="text-white/60">{Math.round(day.low)}°</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Additional Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-white/20">
              <div className="flex items-center gap-3">
                <span className="text-2xl">💧</span>
                <div>
                  <p className="text-white/70 text-xs">{isAr ? 'الرطوبة' : 'Humidity'}</p>
                  <p className="text-white font-bold">{currentWeather.humidity}%</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">💨</span>
                <div>
                  <p className="text-white/70 text-xs">{isAr ? 'الرياح' : 'Wind'}</p>
                  <p className="text-white font-bold">{currentWeather.windSpeed} km/h</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">👁️</span>
                <div>
                  <p className="text-white/70 text-xs">{isAr ? 'الرؤية' : 'Visibility'}</p>
                  <p className="text-white font-bold">{currentWeather.visibility} km</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-2xl">☀️</span>
                <div>
                  <p className="text-white/70 text-xs">{isAr ? 'الأشعة UV' : 'UV Index'}</p>
                  <p className="text-white font-bold">{currentWeather.uvi}</p>
                </div>
              </div>
            </div>
          </motion.div>
        </section>
      )}

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
                <span className="text-lg">{cat.label[locale]}</span>
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
