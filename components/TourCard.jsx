'use client'

// ═══════════════════════════════════════════════════════════════════════
// 📄 ملف: components/TourCard.jsx
// الوصف: بطاقة الرحلة - الحل النهائي الاحترافي 100%
// جميع العناصر قابلة للضغط وتوجه لصفحة التفاصيل
// ═══════════════════════════════════════════════════════════════════════

import Image from 'next/image'
import Link from 'next/link'
import { useMemo, useState } from 'react'
import { useApp } from '@/contexts/AppContext'

export default function TourCard({ tour, viewMode = 'grid' }) {
  const { locale, t, isRTL } = useApp()
  const isAr = locale === 'ar'

  const [imageLoaded, setImageLoaded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // مساعد: لو الترجمة غير موجودة يرجع fallback
  const tt = (key, fallback) => {
    try {
      const v = t?.(key)
      // كثير من أنظمة i18n ترجع نفس key إذا ما لقت ترجمة
      if (!v || v === key) return fallback
      return v
    } catch {
      return fallback
    }
  }

  // اختيار نص من الداتا {ar,en} مع fallback
  const pick = (obj, fallbackAr, fallbackEn) => {
    if (!obj) return isAr ? fallbackAr : fallbackEn
    return obj[locale] || obj.en || obj.ar || (isAr ? fallbackAr : fallbackEn)
  }

  const labels = useMemo(() => {
    return {
      details: tt('tours.details', isAr ? 'التفاصيل' : 'Details'),
      days: tt('tours.days', isAr ? 'أيام' : 'days'),
      perPerson: tt('tours.perPerson', isAr ? '/ شخص' : '/ person'),
      save: tt('tours.save', isAr ? 'وفر' : 'Save'),
      discount: tt('tours.discount', isAr ? 'خصم' : 'OFF'),
      featured: tt('tours.featured', isAr ? 'مميز' : 'Featured'),
      defaultTitle: tt('tours.defaultTitle', isAr ? 'عنوان الرحلة' : 'Tour Title'),
      defaultDesc: tt('tours.defaultDesc', isAr ? 'وصف مختصر للرحلة' : 'Short tour description'),
      difficulty: {
        easy: tt('tours.difficulty.easy', isAr ? 'سهل' : 'Easy'),
        moderate: tt('tours.difficulty.moderate', isAr ? 'متوسط' : 'Moderate'),
        hard: tt('tours.difficulty.hard', isAr ? 'صعب' : 'Hard'),
        normal: tt('tours.difficulty.normal', isAr ? 'عادي' : 'Normal')
      }
    }
  }, [locale])

  const hasDiscount = tour.originalPrice && tour.originalPrice > tour.price
  const discountPercent = hasDiscount
    ? Math.round(((tour.originalPrice - tour.price) / tour.originalPrice) * 100)
    : 0

  const difficultyConfig = (() => {
    switch (tour.difficulty) {
      case 'easy':
        return {
          bg: 'bg-green-50 dark:bg-green-900/20',
          text: 'text-green-700 dark:text-green-300',
          icon: '🟢',
          label: labels.difficulty.easy
        }
      case 'moderate':
        return {
          bg: 'bg-yellow-50 dark:bg-yellow-900/20',
          text: 'text-yellow-700 dark:text-yellow-300',
          icon: '🟡',
          label: labels.difficulty.moderate
        }
      case 'hard':
        return {
          bg: 'bg-red-50 dark:bg-red-900/20',
          text: 'text-red-700 dark:text-red-300',
          icon: '🔴',
          label: labels.difficulty.hard
        }
      default:
        return {
          bg: 'bg-gray-50 dark:bg-gray-700/40',
          text: 'text-gray-700 dark:text-gray-200',
          icon: '⚪',
          label: labels.difficulty.normal
        }
    }
  })()

  const title = pick(tour.title, labels.defaultTitle, labels.defaultTitle)
  const desc = pick(tour.shortDesc, labels.defaultDesc, labels.defaultDesc)

  return (
    <div
      className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 border border-gray-100 dark:border-gray-700 hover:border-green-200 dark:hover:border-green-600/40"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link href={`/tours/${tour.slug}`} className="block relative h-64 overflow-hidden cursor-pointer">
        <div className="relative w-full h-full">
          <Image
            src={tour.images?.main || '/img/default-tour.jpg'}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`object-cover transition-all duration-700 ${
              isHovered ? 'scale-110' : 'scale-100'
            } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
            priority={tour.featured}
          />

          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse" />
          )}
        </div>

        <div
          className={`absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent transition-opacity duration-300 ${
            isHovered ? 'opacity-100' : 'opacity-60'
          }`}
        />

        {hasDiscount && (
          <div className="absolute top-4 left-4 z-20">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500 blur-md opacity-50 animate-pulse" />
              <div className="relative bg-gradient-to-r from-red-500 via-pink-600 to-red-500 text-white px-4 py-2 rounded-full font-bold shadow-xl">
                <span className="text-sm">
                  {isAr ? `${labels.discount} ${discountPercent}%` : `${discountPercent}% ${labels.discount}`}
                </span>
              </div>
            </div>
          </div>
        )}

        {tour.featured && (
          <div className="absolute top-4 right-4 z-20">
            <div className="relative">
              <div className="absolute inset-0 bg-yellow-400 blur-md opacity-50" />
              <div className="relative bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 text-gray-900 px-4 py-2 rounded-full font-bold text-sm shadow-xl">
                {labels.featured}
              </div>
            </div>
          </div>
        )}

        <div className="absolute bottom-4 right-4 z-20">
          <div className="bg-white/95 dark:bg-gray-900/70 backdrop-blur-md px-4 py-2 rounded-xl flex items-center gap-2 shadow-xl border border-white/20 dark:border-gray-700/50">
            <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <div className="flex items-baseline gap-1">
              <span className="font-bold text-gray-900 dark:text-white text-lg">{tour.rating}</span>
              <span className="text-gray-600 dark:text-gray-300 text-xs">({tour.reviewsCount})</span>
            </div>
          </div>
        </div>
      </Link>

      <div className="p-6">
        <Link href={`/tours/${tour.slug}`}>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 hover:text-green-600 dark:hover:text-green-400 transition-colors cursor-pointer line-clamp-2 leading-tight">
            {title}
          </h3>
        </Link>

        <p className="text-gray-600 dark:text-gray-300 mb-5 line-clamp-2 leading-relaxed text-[15px]">
          {desc}
        </p>

        <div className="flex flex-wrap gap-2 mb-6">
          <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/10 px-3 py-2 rounded-lg border border-blue-100 dark:border-blue-800/40">
            <span className="text-sm font-bold text-blue-900 dark:text-blue-100">
              {tour.duration?.days || 0} {labels.days}
            </span>
          </div>

          <div className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/10 px-3 py-2 rounded-lg border border-purple-100 dark:border-purple-800/40">
            <span className="text-sm font-bold text-purple-900 dark:text-purple-100">
              {tour.groupSize?.min || 1}-{tour.groupSize?.max || 10}
            </span>
          </div>

          <div className={`flex items-center gap-2 ${difficultyConfig.bg} px-3 py-2 rounded-lg`}>
            <span className="text-sm">{difficultyConfig.icon}</span>
            <span className={`text-sm font-bold ${difficultyConfig.text}`}>{difficultyConfig.label}</span>
          </div>
        </div>

        <div className="flex items-center justify-between pt-5 border-t-2 border-gray-100 dark:border-gray-700">
          <div>
            {hasDiscount && (
              <div className="flex items-center gap-2 mb-1">
                <span className="text-gray-400 line-through text-sm">${tour.originalPrice}</span>
                <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 text-xs font-bold px-2 py-0.5 rounded-full">
                  {labels.save} ${tour.originalPrice - tour.price}
                </span>
              </div>
            )}
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                ${tour.price}
              </span>
              <span className="text-gray-500 dark:text-gray-300 text-sm font-medium">
                {labels.perPerson}
              </span>
            </div>
          </div>

          <Link
            href={`/tours/${tour.slug}`}
            className="group/btn relative overflow-hidden bg-gradient-to-r from-green-500 via-emerald-600 to-green-500 bg-size-200 hover:bg-pos-100 text-white px-6 py-3.5 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl hover:shadow-green-500/50 flex items-center gap-2"
          >
            <span className="relative z-10">{labels.details}</span>

            {isRTL ? (
              <svg className="w-5 h-5 relative z-10 transform group-hover/btn:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
              </svg>
            ) : (
              <svg className="w-5 h-5 relative z-10 transform group-hover/btn:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            )}

            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-full group-hover/btn:translate-x-[-200%] transition-transform duration-1000" />
          </Link>
        </div>
      </div>

      <div
        className={`h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 transform origin-left transition-transform duration-500 ${
          isHovered ? 'scale-x-100' : 'scale-x-0'
        }`}
      />
    </div>
  )
}
