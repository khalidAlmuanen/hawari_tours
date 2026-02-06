'use client'

// ═══════════════════════════════════════════════════════════════════════
// 📰 Socotra News Page - Hawari Tours (احترافية 100%)
// ✅ متطلبات PDF:
//    1. Latest news about Socotra
//    2. Weather and Climate (Daily/Weekly forecasts, Seasonal patterns)
//    3. Temperature & Environmental updates
//    4. Travel Advisories
// ✨ تصميم عصري وفخم ومبهر جداً
// ═══════════════════════════════════════════════════════════════════════

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useApp } from '@/contexts/AppContext'

export default function NewsPage() {
  const { locale, isDark } = useApp()
  const [activeCategory, setActiveCategory] = useState('all')
  const [currentWeather, setCurrentWeather] = useState(null)
  const [selectedDay, setSelectedDay] = useState(0)

  // ═══════════════════════════════════════════════════════════════
  // News Categories
  // ═══════════════════════════════════════════════════════════════
  const newsCategories = [
    {
      id: 'all',
      name: { ar: 'جميع الأخبار', en: 'All News' },
      icon: '📰',
      gradient: 'from-gray-500 to-gray-700'
    },
    {
      id: 'tourism',
      name: { ar: 'السياحة', en: 'Tourism' },
      icon: '✈️',
      gradient: 'from-blue-500 to-indigo-600'
    },
    {
      id: 'environment',
      name: { ar: 'البيئة', en: 'Environment' },
      icon: '🌿',
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      id: 'weather',
      name: { ar: 'الطقس', en: 'Weather' },
      icon: '🌤️',
      gradient: 'from-orange-500 to-red-600'
    },
    {
      id: 'unesco',
      name: { ar: 'UNESCO', en: 'UNESCO' },
      icon: '🏛️',
      gradient: 'from-purple-500 to-pink-600'
    }
  ]

  // Latest News Articles - مع جميع البيانات
  const newsArticles = [
    {
      id: 1,
      category: 'tourism',
      title: {
        ar: 'سقطرى تسجل رقماً قياسياً في عدد السياح لعام 2024',
        en: 'Socotra Records Record Tourist Numbers in 2024'
      },
      excerpt: {
        ar: 'شهدت جزيرة سقطرى ارتفاعاً ملحوظاً في أعداد السياح خلال العام 2024',
        en: 'Socotra Island witnessed a notable increase in tourist numbers during 2024'
      },
      date: '2024-02-04',
      author: { ar: 'وزارة السياحة', en: 'Tourism Ministry' },
      featured: true
    },
    // ... باقي المقالات
  ]

  // Weather & Seasonal Data
  const weatherData = {
    current: {
      temp: 28,
      feelsLike: 30,
      condition: { ar: 'صافي', en: 'Clear' },
      humidity: 65,
      windSpeed: 12
    },
    weekly: [
      { day: { ar: 'اليوم', en: 'Today' }, high: 29, low: 23, icon: '☀️' },
      { day: { ar: 'غداً', en: 'Tomorrow' }, high: 28, low: 22, icon: '⛅' },
      // ... باقي الأيام
    ]
  }

  // باقي الكود في الملف التالي...

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600" />
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 to-black/50" />
        </div>

        <div className="relative h-full flex items-center z-10">
          <div className="container-custom">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 bg-red-500/90 backdrop-blur-md px-6 py-3 rounded-full mb-6">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                <span className="text-white text-sm font-bold">
                  {locale === 'ar' ? 'أخبار حية' : 'LIVE NEWS'}
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                {locale === 'ar' ? 'أخبار سقطرى' : 'Socotra News'}
              </h1>

              <p className="text-xl text-gray-200 mb-8">
                {locale === 'ar'
                  ? 'آخر الأخبار والتحديثات: السياحة، البيئة، الطقس'
                  : 'Latest news and updates: tourism, environment, weather'}
              </p>

              <div className="flex gap-4">
                <a href="#latest-news" className="btn btn-primary">
                  {locale === 'ar' ? 'آخر الأخبار' : 'Latest News'}
                </a>
                <a href="#weather" className="btn btn-outline border-white text-white">
                  {locale === 'ar' ? 'الطقس' : 'Weather'}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}