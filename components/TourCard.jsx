// ═══════════════════════════════════════════════════════════════
// 🎴 TourCard - DATABASE COMPATIBLE 100%
// ✅ يقرأ من Database مباشرة
// ✅ متوافق مع Prisma Schema بالكامل
// ✅ حل مشكلة "الرحلة غير موجودة"
// components/TourCard.jsx
// ═══════════════════════════════════════════════════════════════

'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useApp } from '@/contexts/AppContext'

export default function TourCard({ tour }) {
  const { locale } = useApp()
  const isAr = locale === 'ar'
  
  const [imageLoaded, setImageLoaded] = useState(false)
  const [isHovered, setIsHovered] = useState(false)

  // ═══════════════════════════════════════════════════════════
  // ✅ DATA MAPPING - من Database Schema
  // ═══════════════════════════════════════════════════════════
  
  // Title (Database: title, titleAr OR title.ar/en)
  const title = isAr 
    ? (tour.titleAr || (typeof tour.title === 'object' ? tour.title?.ar : tour.title) || 'رحلة سياحية')
    : ((typeof tour.title === 'object' ? tour.title?.en : tour.title) || tour.titleAr || 'Tour Package')

  // Description (Database: description, descriptionAr OR description.ar/en)
  const rawDescription = isAr
    ? (tour.descriptionAr || tour.shortDesc?.ar || (typeof tour.description === 'object' ? tour.description?.ar : tour.description) || 'استكشف سقطرى الساحرة')
    : ((typeof tour.description === 'object' ? tour.description?.en : tour.description) || tour.shortDesc?.en || tour.descriptionAr || 'Explore magical Socotra')

  // Clean description
  const description = (typeof rawDescription === 'string' ? rawDescription : String(rawDescription || ''))
    .replace(/<[^>]*>/g, '')
    .substring(0, 100)
    .trim() + ((typeof rawDescription === 'string' ? rawDescription : String(rawDescription || '')).length > 100 ? '...' : '')

  // Image (Database: coverImage, images array OR images.main)
  const coverImage = tour.coverImage || 
                     tour.images?.main ||
                     (tour.images && Array.isArray(tour.images) && tour.images.length > 0 ? tour.images[0] : null) ||
                     '/img/tours/default.jpg'

  // Price (Database: price, discount OR originalPrice)
  const basePrice = Number(tour.originalPrice || tour.price) || 0
  const finalPrice = Number(tour.price) || 0
  const discountPercent = tour.originalPrice 
    ? Math.round(((tour.originalPrice - tour.price) / tour.originalPrice) * 100)
    : (Number(tour.discount) || 0)
  const hasDiscount = discountPercent > 0 && tour.originalPrice

  // Duration (Database: duration - عدد الأيام OR duration.days)
  const durationDays = tour.duration?.days || Number(tour.duration) || 7

  // Rating (Database: rating, reviewsCount)
  const rating = Number(tour.rating) || 5.0
  const reviewsCount = Number(tour.reviewsCount) || 0

  // Max People (Database: maxPeople OR groupSize.max)
  const maxPeople = Number(tour.maxPeople) || Number(tour.groupSize?.max) || 10

  // Category (Database: category ENUM)
  const categoryColors = {
    'ADVENTURE': 'orange',
    'CULTURAL': 'purple',
    'NATURE': 'green',
    'BEACH': 'blue',
    'WILDLIFE': 'teal',
    'HERITAGE': 'indigo'
  }

  const categoryNames = {
    'ADVENTURE': { ar: 'مغامرة', en: 'Adventure' },
    'CULTURAL': { ar: 'ثقافية', en: 'Cultural' },
    'NATURE': { ar: 'طبيعة', en: 'Nature' },
    'BEACH': { ar: 'شاطئية', en: 'Beach' },
    'WILDLIFE': { ar: 'حياة برية', en: 'Wildlife' },
    'HERITAGE': { ar: 'تراث', en: 'Heritage' }
  }

  const categoryColor = categoryColors[tour.category] || 'green'
  const categoryName = isAr 
    ? (categoryNames[tour.category]?.ar || 'رحلة')
    : (categoryNames[tour.category]?.en || 'Tour')

  // Difficulty (Database: difficulty ENUM)
  const difficultyConfig = {
    'EASY': { ar: 'سهل', en: 'Easy', color: 'green', icon: '🟢' },
    'MODERATE': { ar: 'متوسط', en: 'Moderate', color: 'yellow', icon: '🟡' },
    'CHALLENGING': { ar: 'صعب', en: 'Challenging', color: 'orange', icon: '🟠' },
    'DIFFICULT': { ar: 'صعب جداً', en: 'Difficult', color: 'red', icon: '🔴' }
  }

  const difficulty = difficultyConfig[tour.difficulty] || difficultyConfig['MODERATE']
  const difficultyName = isAr ? difficulty.ar : difficulty.en

  // Slug (Database: slug)
  const slug = tour.slug || tour.id

  // Featured (Database: featured)
  const isFeatured = tour.featured === true

  return (
    <div
      className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 duration-300 border border-gray-100 dark:border-gray-700"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* ════════════════════════════════════════════════════════
          Image Section
          ════════════════════════════════════════════════════════ */}
      <Link href={`/tours/${slug}`} className="block relative h-64 overflow-hidden">
        <div className="relative w-full h-full">
          <Image
            src={coverImage}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className={`object-cover transition-all duration-700 ${
              isHovered ? 'scale-110' : 'scale-100'
            } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            onLoad={() => setImageLoaded(true)}
            priority={isFeatured}
          />

          {/* Loading Skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse" />
          )}
        </div>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex justify-between items-start z-20">
          {/* Discount Badge */}
          {hasDiscount && (
            <div className="relative">
              <div className="absolute inset-0 bg-red-500 blur-md opacity-50 animate-pulse" />
              <div className="relative bg-gradient-to-r from-red-500 via-pink-600 to-red-500 text-white px-4 py-2 rounded-full font-bold shadow-xl text-sm">
                -{discountPercent}%
              </div>
            </div>
          )}

          {/* Featured Badge */}
          {isFeatured && (
            <div className="relative ml-auto">
              <div className="absolute inset-0 bg-yellow-400 blur-md opacity-50" />
              <div className="relative bg-gradient-to-r from-yellow-400 via-orange-400 to-yellow-500 text-gray-900 px-4 py-2 rounded-full font-bold text-sm shadow-xl">
                ⭐ {isAr ? 'مميز' : 'Featured'}
              </div>
            </div>
          )}
        </div>

        {/* Category Badge - Bottom Left */}
        <div className="absolute bottom-4 left-4 z-20">
          <div className={`bg-${categoryColor}-500/90 backdrop-blur-sm text-white px-3 py-1 rounded-full text-xs font-semibold shadow-lg`}>
            {categoryName}
          </div>
        </div>

        {/* Rating Badge - Bottom Right */}
        <div className="absolute bottom-4 right-4 z-20">
          <div className="bg-white/95 dark:bg-gray-900/70 backdrop-blur-md px-4 py-2 rounded-xl flex items-center gap-2 shadow-xl border border-white/20">
            <svg className="w-5 h-5 text-yellow-400 fill-current" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            <div className="flex items-baseline gap-1">
              <span className="font-bold text-gray-900 dark:text-white text-lg">
                {rating.toFixed(1)}
              </span>
              <span className="text-gray-600 dark:text-gray-300 text-xs">
                ({reviewsCount})
              </span>
            </div>
          </div>
        </div>
      </Link>

      {/* ════════════════════════════════════════════════════════
          Content Section
          ════════════════════════════════════════════════════════ */}
      <div className="p-6">
        {/* Title */}
        <Link href={`/tours/${slug}`}>
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 hover:text-green-600 dark:hover:text-green-400 transition-colors cursor-pointer line-clamp-2 leading-tight">
            {title}
          </h3>
        </Link>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 mb-5 line-clamp-2 leading-relaxed text-[15px]">
          {description}
        </p>

        {/* Meta Info */}
        <div className="flex flex-wrap gap-2 mb-6">
          {/* Duration */}
          <div className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/10 px-3 py-2 rounded-lg border border-blue-100 dark:border-blue-800/40">
            <svg className="w-4 h-4 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span className="text-sm font-bold text-blue-900 dark:text-blue-100">
              {durationDays} {isAr ? 'أيام' : 'days'}
            </span>
          </div>

          {/* Max People */}
          <div className="flex items-center gap-2 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/10 px-3 py-2 rounded-lg border border-purple-100 dark:border-purple-800/40">
            <svg className="w-4 h-4 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <span className="text-sm font-bold text-purple-900 dark:text-purple-100">
              {isAr ? `${maxPeople} أشخاص` : `${maxPeople} people`}
            </span>
          </div>

          {/* Difficulty */}
          <div className={`flex items-center gap-2 bg-${difficulty.color}-50 dark:bg-${difficulty.color}-900/20 px-3 py-2 rounded-lg`}>
            <span className="text-sm">{difficulty.icon}</span>
            <span className={`text-sm font-bold text-${difficulty.color}-900 dark:text-${difficulty.color}-100`}>
              {difficultyName}
            </span>
          </div>
        </div>

        {/* Includes Preview */}
        {(() => {
          const includesArray = tour.includes || (tour.included && (isAr ? tour.included.ar : tour.included.en)) || []
          return Array.isArray(includesArray) && includesArray.length > 0 && (
            <div className="mb-6 space-y-2">
              {includesArray.slice(0, 3).map((item, index) => (
                <div key={index} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="line-clamp-1">{typeof item === 'string' ? item : ''}</span>
                </div>
              ))}
            </div>
          )
        })()}

        {/* Price Section */}
        <div className="flex items-center justify-between pt-5 border-t-2 border-gray-100 dark:border-gray-700">
          <div>
            {/* Original Price (if discount) */}
            {hasDiscount && (
              <div className="flex items-center gap-2 mb-1">
                <span className="text-gray-400 line-through text-sm">
                  ${Math.round(basePrice)}
                </span>
                <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 text-xs font-bold px-2 py-0.5 rounded-full">
                  {isAr ? 'وفر' : 'Save'} ${Math.round(basePrice - finalPrice)}
                </span>
              </div>
            )}
            
            {/* Final Price */}
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                ${Math.round(finalPrice)}
              </span>
              <span className="text-gray-500 dark:text-gray-300 text-sm font-medium">
                {isAr ? '/ للشخص' : '/ person'}
              </span>
            </div>
          </div>

          {/* CTA Button */}
          <Link
            href={`/tours/${slug}`}
            className="group/btn relative overflow-hidden bg-gradient-to-r from-green-500 via-emerald-600 to-green-500 bg-size-200 hover:bg-pos-100 text-white px-6 py-3.5 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl hover:shadow-green-500/50 flex items-center gap-2"
          >
            <span className="relative z-10">
              {isAr ? 'التفاصيل' : 'Details'}
            </span>

            <svg className={`w-5 h-5 relative z-10 transform transition-transform ${
              isAr ? 'group-hover/btn:-translate-x-1' : 'group-hover/btn:translate-x-1'
            }`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={isAr ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
            </svg>

            {/* Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-full group-hover/btn:translate-x-[-200%] transition-transform duration-1000" />
          </Link>
        </div>
      </div>

      {/* Bottom Progress Bar */}
      <div
        className={`h-1 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 transform origin-left transition-transform duration-500 ${
          isHovered ? 'scale-x-100' : 'scale-x-0'
        }`}
      />
    </div>
  )
}