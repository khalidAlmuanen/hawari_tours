'use client'

// ═══════════════════════════════════════════════════════════════════════
// 🎒 صفحة الرحلات - النسخة الاحترافية المبهرة
// ✨ التحسينات: اللغات، الوضع الليلي، Advanced Filters، Animations
// ═══════════════════════════════════════════════════════════════════════

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { useApp } from '@/contexts/AppContext'
import WhatsAppButton from '@/components/WhatsAppButton'
import TourCard from '@/components/TourCard'
import { getAllTours } from '@/data/tours-complete'

export default function ToursPage() {
  const { t, locale, isDark } = useApp()
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [sortBy, setSortBy] = useState('featured')
  const [viewMode, setViewMode] = useState('grid') // 'grid' | 'list'
  const tours = getAllTours()

  // Categories مع دعم اللغات
  const categories = [
    {
      id: 'all',
      name: { ar: 'جميع الرحلات', en: 'All Tours' },
      icon: '🌍',
      count: tours.length
    },
    {
      id: 'camping',
      name: { ar: 'تخييم', en: 'Camping' },
      icon: '⛺',
      count: tours.filter(t => t.category === 'camping').length
    },
    {
      id: 'mixed',
      name: { ar: 'مختلط', en: 'Mixed' },
      icon: '🏨',
      count: tours.filter(t => t.category === 'mixed').length
    },
    {
      id: 'adventure',
      name: { ar: 'مغامرات', en: 'Adventures' },
      icon: '🏔️',
      count: tours.filter(t => t.category === 'adventure').length
    },
    {
      id: 'marine',
      name: { ar: 'بحرية', en: 'Marine' },
      icon: '🌊',
      count: tours.filter(t => t.category === 'marine').length
    },
    {
      id: 'family',
      name: { ar: 'عائلية', en: 'Family' },
      icon: '👨‍👩‍👧‍👦',
      count: tours.filter(t => t.category === 'family').length
    }
  ]

  // Filter tours بطريقة محسّنة
  const filteredTours = useMemo(() => {
    let result = selectedCategory === 'all'
      ? tours
      : tours.filter(tour => tour.category === selectedCategory)

    // Sort tours
    switch(sortBy) {
      case 'price-low':
        return [...result].sort((a, b) => a.price - b.price)
      case 'price-high':
        return [...result].sort((a, b) => b.price - a.price)
      case 'rating':
        return [...result].sort((a, b) => (b.rating || 0) - (a.rating || 0))
      case 'duration':
        return [...result].sort((a, b) => a.duration.days - b.duration.days)
      default:
        return result
    }
  }, [tours, selectedCategory, sortBy])

  // Sort options مع دعم اللغات
  const sortOptions = [
    { value: 'featured', label: { ar: 'مميز', en: 'Featured' } },
    { value: 'price-low', label: { ar: 'السعر: الأقل أولاً', en: 'Price: Low to High' } },
    { value: 'price-high', label: { ar: 'السعر: الأعلى أولاً', en: 'Price: High to Low' } },
    { value: 'rating', label: { ar: 'الأعلى تقييماً', en: 'Highest Rated' } },
    { value: 'duration', label: { ar: 'المدة: الأقصر', en: 'Duration: Shortest' } }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-green-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">
      {/* ═══════════════════════════════════════════════════════════════
          Hero Section مع Wave Divider
          ═══════════════════════════════════════════════════════════════ */}

      <section className="relative h-[40vh] min-h-[400px] overflow-hidden">
        {/* Animated Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 dark:from-green-800 dark:via-blue-800 dark:to-purple-800">
          <div className="absolute inset-0 opacity-20 bg-pattern-dots animate-pulse"></div>
        </div>

        {/* Content */}
        <div className="relative h-full flex items-center justify-center text-center z-10">
          <div className="max-w-4xl mx-auto px-4">
            <div className="inline-block px-6 py-2 bg-white/20 dark:bg-white/10 backdrop-blur-md rounded-full text-white text-sm font-semibold mb-4 animate-fade-in">
              {locale === 'ar' ? 'رحلاتنا' : 'Our Tours'}
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 animate-slide-in-right">
              {locale === 'ar' ? 'استكشف' : 'Explore'}{' '}
              <span className="text-yellow-300 drop-shadow-lg">
                {locale === 'ar' ? 'أفضل الرحلات' : 'Best Tours'}
              </span>
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto animate-slide-in-left">
              {locale === 'ar'
                ? 'اختر من بين مجموعة متنوعة من الرحلات المصممة خصيصاً لتناسب جميع الأذواق والميزانيات'
                : 'Choose from a variety of tours specially designed to suit all tastes and budgets'}
            </p>
          </div>
        </div>

        {/* Wave Divider مع تأثير متحرك */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full text-gray-50 dark:text-gray-900">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z" fill="currentColor"/>
          </svg>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          Advanced Filters Section
          ═══════════════════════════════════════════════════════════════ */}

      <section className="py-8 -mt-10 relative z-10">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 transition-colors">
            {/* Category Filters */}
            <div className="flex flex-wrap gap-3 justify-center mb-6">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`
                    px-6 py-3 rounded-xl font-semibold transition-all duration-300 transform hover:scale-105
                    ${selectedCategory === cat.id
                      ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/50'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                    }
                  `}
                >
                  <span className={locale === 'ar' ? 'ml-2' : 'mr-2'}>{cat.icon}</span>
                  {cat.name[locale]}
                  {selectedCategory === cat.id && (
                    <span className={`${locale === 'ar' ? 'mr-2' : 'ml-2'} bg-white/20 px-2 py-0.5 rounded-full text-xs`}>
                      {cat.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Sort & View Controls */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              {/* Sort Dropdown */}
              <div className="flex items-center gap-3">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                  {locale === 'ar' ? 'ترتيب حسب:' : 'Sort by:'}
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white font-semibold focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-900/50 outline-none transition-all"
                >
                  {sortOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label[locale]}
                    </option>
                  ))}
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'grid'
                      ? 'bg-white dark:bg-gray-600 shadow-md'
                      : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  aria-label="Grid View"
                >
                  <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                  </svg>
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all ${
                    viewMode === 'list'
                      ? 'bg-white dark:bg-gray-600 shadow-md'
                      : 'hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                  aria-label="List View"
                >
                  <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          Tours Grid/List
          ═══════════════════════════════════════════════════════════════ */}

      <section className="py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Results Count مع Animation */}
          <div className="flex items-center justify-between mb-8 animate-fade-in">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              {filteredTours.length}{' '}
              <span className="text-green-600 dark:text-green-400">
                {locale === 'ar'
                  ? (filteredTours.length === 1 ? 'رحلة' : 'رحلات')
                  : (filteredTours.length === 1 ? 'Tour' : 'Tours')}
              </span>{' '}
              {locale === 'ar' ? 'متاحة' : 'Available'}
            </h2>

            {/* Quick Stats */}
            <div className="hidden md:flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z" />
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
                </svg>
                <span>{locale === 'ar' ? 'من' : 'From'} $350</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                <span>3-15 {locale === 'ar' ? 'أيام' : 'days'}</span>
              </div>
            </div>
          </div>

          {/* Tours Display */}
          {filteredTours.length > 0 ? (
            <div className={viewMode === 'grid'
              ? 'grid md:grid-cols-2 lg:grid-cols-3 gap-8'
              : 'space-y-6'
            }>
              {filteredTours.map((tour, index) => (
                <div
                  key={tour.id}
                  className="animate-fade-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <TourCard tour={tour} viewMode={viewMode} />
                </div>
              ))}
            </div>
          ) : (
            // Empty State مع Animation
            <div className="text-center py-20 animate-fade-in">
              <div className="text-6xl mb-4 animate-bounce">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {locale === 'ar' ? 'لا توجد رحلات في هذه الفئة' : 'No tours in this category'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {locale === 'ar' ? 'جرب فئة أخرى أو تصفح جميع الرحلات' : 'Try another category or browse all tours'}
              </p>
              <button
                onClick={() => setSelectedCategory('all')}
                className="btn btn-primary"
              >
                {locale === 'ar' ? 'عرض جميع الرحلات' : 'View All Tours'}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          CTA Section
          ═══════════════════════════════════════════════════════════════ */}

      <section className="py-20 bg-gradient-to-r from-green-500 via-emerald-600 to-teal-600 dark:from-green-700 dark:via-emerald-800 dark:to-teal-900 relative overflow-hidden">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-pattern-dots animate-pulse"></div>
        </div>

        <div className="container mx-auto px-4 max-w-7xl text-center relative z-10">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 animate-fade-in">
            {locale === 'ar' ? 'لم تجد ما تبحث عنه؟' : 'Didn\'t Find What You\'re Looking For?'}
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto animate-fade-in" style={{ animationDelay: '0.1s' }}>
            {locale === 'ar'
              ? 'نقدم رحلات مخصصة حسب رغبتك! تواصل معنا وسنصمم لك الرحلة المثالية'
              : 'We offer custom tours! Contact us and we\'ll design the perfect trip for you'}
          </p>
          <div className="flex flex-wrap gap-4 justify-center animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <a
              href="https://wa.me/967772371581?text=أريد رحلة مخصصة"
              className="btn btn-primary bg-white text-green-600 hover:bg-gray-100 dark:hover:bg-gray-200 inline-flex items-center gap-2 text-lg px-8 py-4 rounded-xl font-bold shadow-xl transform hover:scale-105 transition-all"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              {locale === 'ar' ? 'تواصل عبر واتساب' : 'Contact on WhatsApp'}
            </a>
            <Link
              href="/contact"
              className="btn btn-outline border-2 border-white text-white hover:bg-white hover:text-green-600 dark:hover:text-green-700 inline-flex items-center gap-2 text-lg px-8 py-4 rounded-xl font-bold transform hover:scale-105 transition-all"
            >
              {locale === 'ar' ? 'راسلنا' : 'Contact Us'}
            </Link>
          </div>
        </div>
      </section>
      
      <WhatsAppButton />
    </div>
  )
}