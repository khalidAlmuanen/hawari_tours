'use client'

// ═══════════════════════════════════════════════════════════════════════
// 💬 ملف: app/testimonials/page.jsx
// الوصف: صفحة آراء وقصص العملاء - تصميم عالمي فخم
// ═══════════════════════════════════════════════════════════════════════

import { useState } from 'react'
import Image from 'next/image'
import { useApp } from '@/contexts/AppContext'
import { testimonials, getAverageRating, getTotalReviews } from '@/data/testimonials'
import WhatsAppButton from '@/components/WhatsAppButton'

export default function TestimonialsPage() {
  const { t, locale, isDark } = useApp()
  const [filter, setFilter] = useState('all') // all, recent, topRated
  const [expandedReviews, setExpandedReviews] = useState({})

  const averageRating = getAverageRating()
  const totalReviews = getTotalReviews()

  // تصفية التقييمات
  const filteredTestimonials = [...testimonials].sort((a, b) => {
    if (filter === 'recent') {
      return new Date(b.date) - new Date(a.date)
    } else if (filter === 'topRated') {
      return b.rating - a.rating
    }
    return 0
  })

  // تبديل قراءة المزيد
  const toggleExpand = (id) => {
    setExpandedReviews(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  // الحصول على أيقونة العلم
  const getFlagEmoji = (countryCode) => {
    const codePoints = countryCode
      .toUpperCase()
      .split('')
      .map(char => 127397 + char.charCodeAt())
    return String.fromCodePoint(...codePoints)
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900"></div>
        <div className="absolute inset-0 opacity-10 dark:opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)',
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        <div className="container mx-auto px-4 max-w-7xl relative z-10">
          {/* Stats Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-16">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl transform hover:scale-105 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                </div>
                <div>
                  <p className="text-4xl font-bold text-gray-900 dark:text-white">{averageRating}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('testimonials.rating')}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl transform hover:scale-105 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-4xl font-bold text-gray-900 dark:text-white">{totalReviews}+</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('testimonials.allReviews')}</p>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl transform hover:scale-105 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="text-4xl font-bold text-gray-900 dark:text-white">100%</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{t('testimonials.verified')}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Title */}
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white mb-6">
              {t('testimonials.title')}
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 leading-relaxed">
              {t('testimonials.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex flex-wrap gap-3 justify-center">
            <button
              onClick={() => setFilter('all')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                filter === 'all'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {t('testimonials.allReviews')}
            </button>
            <button
              onClick={() => setFilter('recent')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                filter === 'recent'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {t('testimonials.recent')}
            </button>
            <button
              onClick={() => setFilter('topRated')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                filter === 'topRated'
                  ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {t('testimonials.topRated')}
            </button>
          </div>
        </div>
      </section>

      {/* Reviews Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid md:grid-cols-2 gap-8">
            {filteredTestimonials.map((testimonial) => {
              const isExpanded = expandedReviews[testimonial.id]
              const review = testimonial.review[locale]
              const shouldTruncate = review.length > 200
              const displayReview = shouldTruncate && !isExpanded
                ? review.substring(0, 200) + '...'
                : review

              return (
                <div
                  key={testimonial.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-1"
                >
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0 ring-4 ring-green-500/20">
                      <div className="w-full h-full bg-gradient-to-br from-green-400 to-emerald-500 flex items-center justify-center">
                        <span className="text-2xl font-bold text-white">
                          {testimonial.name[locale].charAt(0)}
                        </span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                        {testimonial.name[locale]}
                      </h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-2">
                        <span className="text-2xl">{getFlagEmoji(testimonial.countryCode)}</span>
                        <span>{testimonial.country[locale]}</span>
                      </div>
                      {testimonial.verified && (
                        <div className="inline-flex items-center gap-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-3 py-1 rounded-full text-xs font-semibold">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          {t('testimonials.verified')}
                        </div>
                      )}
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${
                            i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                  </div>

                  {/* Tour Name */}
                  <div className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-xl">
                    <p className="text-sm text-green-700 dark:text-green-400 font-semibold">
                      {testimonial.tourName[locale]}
                    </p>
                  </div>

                  {/* Review */}
                  <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                    {displayReview}
                  </p>

                  {/* Read More Button */}
                  {shouldTruncate && (
                    <button
                      onClick={() => toggleExpand(testimonial.id)}
                      className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-semibold text-sm flex items-center gap-2 transition-colors"
                    >
                      {isExpanded ? t('testimonials.showLess') : t('testimonials.readMore')}
                      <svg
                        className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>
                  )}

                  {/* Date */}
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-xs text-gray-500 dark:text-gray-500">
                      {new Date(testimonial.date).toLocaleDateString(locale === 'ar' ? 'ar-SA' : 'en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <WhatsAppButton />
    </div>
  )
}