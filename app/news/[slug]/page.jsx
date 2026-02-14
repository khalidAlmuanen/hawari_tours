'use client'

// ═══════════════════════════════════════════════════════════════
// 📰 NEWS DETAILS PAGE - Ultra Professional & Stunning
// صفحة تفاصيل الخبر - احترافية وعصرية ومبهرة جداً
// ═══════════════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useApp } from '@/contexts/AppContext'
import { motion } from 'framer-motion'
import WhatsAppButton from '@/components/WhatsAppButton'

export default function NewsDetailsPage({ params }) {
  const { locale, isDark } = useApp()
  const isAr = locale === 'ar'

  // ✅ Resolve params (Next.js 15+)
  const resolvedParams = React.use(params)

  // State
  const [news, setNews] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Category configs matching Schema enum
  const categoryConfig = {
    TOURISM: { icon: '✈️', color: 'from-blue-500 to-cyan-600', label: { ar: 'سياحة', en: 'Tourism' } },
    ENVIRONMENT: { icon: '🌿', color: 'from-green-500 to-emerald-600', label: { ar: 'بيئة', en: 'Environment' } },
    WEATHER: { icon: '🌤️', color: 'from-yellow-500 to-orange-600', label: { ar: 'طقس', en: 'Weather' } },
    UNESCO: { icon: '🏛️', color: 'from-indigo-500 to-purple-600', label: { ar: 'يونسكو', en: 'UNESCO' } },
    CULTURE: { icon: '🎭', color: 'from-purple-500 to-pink-600', label: { ar: 'ثقافة', en: 'Culture' } },
    EVENTS: { icon: '🎉', color: 'from-pink-500 to-rose-600', label: { ar: 'فعاليات', en: 'Events' } }
  }

  // Fetch news
  useEffect(() => {
    fetchNews()
  }, [resolvedParams.slug])

  const fetchNews = async () => {
    setLoading(true)
    setError(null)

    try {
      console.log('🔄 Fetching news:', resolvedParams.slug)

      const response = await fetch(`/api/news/${resolvedParams.slug}`)
      console.log('📡 API Response status:', response.status)

      if (!response.ok) {
        if (response.status === 404) {
          console.log('❌ News not found')
          setNews(null)
          return
        }

        const raw = await response.text()
        let errorData = {}
        try {
          errorData = JSON.parse(raw)
        } catch {
          // not JSON
        }

        console.error('❌ API Error:', {
          status: response.status,
          errorData,
          raw: raw?.slice?.(0, 500)
        })

        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const result = await response.json()
      console.log('📦 API Result:', result)

      if (result.success && result.data) {
        console.log('✅ News loaded:', result.data.title)
        setNews(result.data)
      } else {
        throw new Error(result.error || 'Failed to fetch news')
      }
    } catch (err) {
      console.error('❌ Error fetching news:', err)
      setError(err.message)
      setNews(null)
    } finally {
      setLoading(false)
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 text-lg">
            {isAr ? 'جارِ التحميل...' : 'Loading...'}
          </p>
        </div>
      </div>
    )
  }

  // Error state
  if (error || !news) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">📰</div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {isAr ? 'الخبر غير موجود' : 'News Not Found'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            {isAr ? 'الخبر الذي تبحث عنه غير موجود أو تم حذفه' : 'The news article you are looking for does not exist or has been removed'}
          </p>
          <Link
            href="/news"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
          >
            {isAr ? 'العودة إلى الأخبار' : 'Back to News'}
          </Link>
        </div>
      </div>
    )
  }

  const category = categoryConfig[news.category] || categoryConfig.TOURISM
  const title = isAr ? news.titleAr : news.title
  const excerpt = isAr ? news.excerptAr : news.excerpt
  const content = isAr ? news.contentAr : news.content
  const publishDate = new Date(news.publishedAt || news.createdAt).toLocaleDateString(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${isAr ? 'rtl' : 'ltr'}`}>
      
      {/* Hero Section */}
      <div className="relative h-[60vh] overflow-hidden">
        {news.coverImage && (
          <>
            <Image
              src={news.coverImage}
              alt={title}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent" />
          </>
        )}

        {/* Content Overlay */}
        <div className="absolute inset-0 flex items-end">
          <div className="container mx-auto px-4 pb-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="max-w-4xl"
            >
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-4 py-2 bg-gradient-to-r ${category.color} text-white rounded-full text-sm font-bold flex items-center gap-2`}>
                  <span>{category.icon}</span>
                  <span>{category.label[locale]}</span>
                </span>
                
                {news.breaking && (
                  <span className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-600 text-white rounded-full text-sm font-bold flex items-center gap-2 animate-pulse">
                    <span>🔥</span>
                    <span>{isAr ? 'عاجل' : 'Breaking'}</span>
                  </span>
                )}

                {news.trending && (
                  <span className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-600 text-white rounded-full text-sm font-bold flex items-center gap-2">
                    <span>📈</span>
                    <span>{isAr ? 'رائج' : 'Trending'}</span>
                  </span>
                )}

                {news.featured && (
                  <span className="px-4 py-2 bg-gradient-to-r from-purple-500 to-indigo-600 text-white rounded-full text-sm font-bold flex items-center gap-2">
                    <span>⭐</span>
                    <span>{isAr ? 'مميز' : 'Featured'}</span>
                  </span>
                )}
              </div>

              <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-2xl leading-tight">
                {title}
              </h1>

              {/* Meta Info */}
              <div className="flex flex-wrap gap-6 text-white/90 text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-xl">👁️</span>
                  <span>{news.viewsCount || 0} {isAr ? 'مشاهدة' : 'Views'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">📅</span>
                  <span>{publishDate}</span>
                </div>
                {news.authorName && (
                  <div className="flex items-center gap-2">
                    <span className="text-xl">✍️</span>
                    <span>{news.authorName}</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Article Content */}
          <div className="lg:col-span-2">
            {/* Excerpt */}
            {excerpt && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-8 mb-8 border-l-4 border-blue-600"
              >
                <p className="text-xl text-gray-800 dark:text-gray-200 leading-relaxed font-medium">
                  {excerpt}
                </p>
              </motion.div>
            )}

            {/* Article Content */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl mb-8"
            >
              <div 
                className="prose prose-lg dark:prose-invert max-w-none prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-a:text-blue-600 dark:prose-a:text-blue-400"
                style={{ whiteSpace: 'pre-line' }}
              >
                {content}
              </div>
            </motion.div>

            {/* Tags */}
            {news.tags && news.tags.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl mb-8"
              >
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <span>🏷️</span>
                  <span>{isAr ? 'الوسوم' : 'Tags'}</span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {news.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full text-sm font-medium hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all cursor-pointer"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Share Buttons - REAL LINKS */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <span>📤</span>
                <span>{isAr ? 'شارك هذا الخبر' : 'Share This Article'}</span>
              </h3>
              <div className="flex flex-wrap gap-4">
                {/* Facebook Share */}
                <a
                  href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all hover:scale-105 shadow-lg"
                >
                  <span>📘</span>
                  <span>Facebook</span>
                </a>
                
                {/* Twitter Share */}
                <a
                  href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&text=${encodeURIComponent(title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-blue-400 text-white rounded-xl font-bold hover:bg-blue-500 transition-all hover:scale-105 shadow-lg"
                >
                  <span>🐦</span>
                  <span>Twitter</span>
                </a>
                
                {/* WhatsApp Share */}
                <a
                  href={`https://wa.me/?text=${encodeURIComponent(title + ' - ' + (typeof window !== 'undefined' ? window.location.href : ''))}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-all hover:scale-105 shadow-lg"
                >
                  <span>💬</span>
                  <span>WhatsApp</span>
                </a>
                
                {/* Telegram Share */}
                <a
                  href={`https://t.me/share/url?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}&text=${encodeURIComponent(title)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-xl font-bold hover:bg-blue-600 transition-all hover:scale-105 shadow-lg"
                >
                  <span>✈️</span>
                  <span>Telegram</span>
                </a>
                
                {/* LinkedIn Share */}
                <a
                  href={`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(typeof window !== 'undefined' ? window.location.href : '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-3 bg-blue-700 text-white rounded-xl font-bold hover:bg-blue-800 transition-all hover:scale-105 shadow-lg"
                >
                  <span>💼</span>
                  <span>LinkedIn</span>
                </a>
                
                {/* Copy Link */}
                <button
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      navigator.clipboard.writeText(window.location.href)
                      alert(isAr ? 'تم نسخ الرابط! ✅' : 'Link copied! ✅')
                    }
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-xl font-bold hover:bg-gray-700 transition-all hover:scale-105 shadow-lg"
                >
                  <span>🔗</span>
                  <span>{isAr ? 'نسخ الرابط' : 'Copy Link'}</span>
                </button>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Back to News */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white shadow-2xl"
            >
              <h3 className="text-xl font-bold mb-4">
                {isAr ? 'المزيد من الأخبار' : 'More News'}
              </h3>
              <Link
                href="/news"
                className="block w-full py-3 bg-white text-blue-600 rounded-xl font-bold text-center hover:bg-gray-100 transition-all"
              >
                {isAr ? 'تصفح جميع الأخبار' : 'Browse All News'}
              </Link>
            </motion.div>

            {/* Quick Links */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl"
            >
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {isAr ? 'روابط سريعة' : 'Quick Links'}
              </h3>
              <div className="space-y-3">
                <Link
                  href="/tours"
                  className="block p-3 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-xl font-semibold hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-all"
                >
                  🎫 {isAr ? 'الجولات السياحية' : 'Tours'}
                </Link>
                <Link
                  href="/destinations"
                  className="block p-3 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 rounded-xl font-semibold hover:bg-green-100 dark:hover:bg-green-900/30 transition-all"
                >
                  🏛️ {isAr ? 'المعالم السياحية' : 'Destinations'}
                </Link>
                <Link
                  href="/contact"
                  className="block p-3 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 rounded-xl font-semibold hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-all"
                >
                  📞 {isAr ? 'اتصل بنا' : 'Contact Us'}
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* WhatsApp Button */}
      <WhatsAppButton />
    </div>
  )
}
