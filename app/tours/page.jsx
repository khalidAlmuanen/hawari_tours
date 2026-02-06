'use client'

// ═══════════════════════════════════════════════════════════════════════
// 🗺️ Tours Page - Hawari Tours (احترافية 100%)
// ✅ متطلبات PDF:
//    1. Guided Tours (Adventure, Cultural, Eco-tours)
//    2. Custom Tours
//    3. Travel Packages
//    4. Booking and Inquiries
// ✨ تصميم عصري وفخم ومبهر جداً
// ═══════════════════════════════════════════════════════════════════════

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useApp } from '@/contexts/AppContext'
import TourCard from '@/components/TourCard'
import { getAllTours, getToursByCategory } from '@/data/tours-complete'

export default function ToursPage() {
  const { locale, isDark } = useApp()
  
  // State Management
  const [activeCategory, setActiveCategory] = useState('all')
  const [priceRange, setPriceRange] = useState([0, 2000])
  const [selectedDifficulty, setSelectedDifficulty] = useState('all')
  const [selectedDuration, setSelectedDuration] = useState('all')
  const [sortBy, setSortBy] = useState('popular')
  const [showFilters, setShowFilters] = useState(false)
  const [tours, setTours] = useState(getAllTours())
  const [filteredTours, setFilteredTours] = useState(tours)
  const [showBookingModal, setShowBookingModal] = useState(false)
  const [selectedTour, setSelectedTour] = useState(null)

  // ═══════════════════════════════════════════════════════════════
  // Tour Categories (من متطلبات PDF)
  // ═══════════════════════════════════════════════════════════════
  const tourCategories = [
    {
      id: 'all',
      name: { ar: 'جميع الرحلات', en: 'All Tours' },
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
      gradient: 'from-gray-500 to-gray-700',
      count: tours.length
    },
    {
      id: 'adventure',
      name: { ar: 'رحلات المغامرة', en: 'Adventure Tours' },
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
        </svg>
      ),
      gradient: 'from-orange-500 to-red-600',
      count: tours.filter(t => t.category === 'adventure').length,
      description: {
        ar: 'تخييم، تسلق، استكشاف',
        en: 'Camping, Climbing, Exploration'
      }
    },
    {
      id: 'cultural',
      name: { ar: 'رحلات ثقافية', en: 'Cultural Tours' },
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
      gradient: 'from-purple-500 to-pink-600',
      count: tours.filter(t => t.category === 'cultural' || t.category === 'family').length,
      description: {
        ar: 'تراث، تقاليد، شعب',
        en: 'Heritage, Traditions, People'
      }
    },
    {
      id: 'eco',
      name: { ar: 'رحلات بيئية', en: 'Eco-Tours' },
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
        </svg>
      ),
      gradient: 'from-green-500 to-emerald-600',
      count: tours.filter(t => t.category === 'camping').length,
      description: {
        ar: 'طبيعة، بيئة، استدامة',
        en: 'Nature, Environment, Sustainability'
      }
    },
    {
      id: 'marine',
      name: { ar: 'رحلات بحرية', en: 'Marine Tours' },
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
        </svg>
      ),
      gradient: 'from-blue-500 to-cyan-600',
      count: tours.filter(t => t.category === 'marine').length,
      description: {
        ar: 'غطس، شواطئ، دلافين',
        en: 'Diving, Beaches, Dolphins'
      }
    },
    {
      id: 'custom',
      name: { ar: 'رحلات مخصصة', en: 'Custom Tours' },
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
        </svg>
      ),
      gradient: 'from-indigo-500 to-purple-600',
      count: '∞',
      description: {
        ar: 'صمم رحلتك الخاصة',
        en: 'Design Your Own Trip'
      }
    }
  ]

  // ═══════════════════════════════════════════════════════════════
  // Filter & Sort Functions
  // ═══════════════════════════════════════════════════════════════
  useEffect(() => {
    let result = [...tours]

    // Filter by category
    if (activeCategory !== 'all') {
      if (activeCategory === 'cultural') {
        result = result.filter(t => t.category === 'cultural' || t.category === 'family')
      } else if (activeCategory === 'eco') {
        result = result.filter(t => t.category === 'camping')
      } else {
        result = result.filter(t => t.category === activeCategory)
      }
    }

    // Filter by price
    result = result.filter(t => t.price >= priceRange[0] && t.price <= priceRange[1])

    // Filter by difficulty
    if (selectedDifficulty !== 'all') {
      result = result.filter(t => t.difficulty === selectedDifficulty)
    }

    // Filter by duration
    if (selectedDuration !== 'all') {
      const days = parseInt(selectedDuration)
      result = result.filter(t => t.duration.days <= days)
    }

    // Sort
    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        result.sort((a, b) => b.price - a.price)
        break
      case 'duration':
        result.sort((a, b) => a.duration.days - b.duration.days)
        break
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      default: // popular
        result.sort((a, b) => b.reviewsCount - a.reviewsCount)
    }

    setFilteredTours(result)
  }, [activeCategory, priceRange, selectedDifficulty, selectedDuration, sortBy, tours])

  // ═══════════════════════════════════════════════════════════════
  // Special Offers
  // ═══════════════════════════════════════════════════════════════
  const specialOffers = [
    {
      title: { ar: 'خصم الحجز المبكر', en: 'Early Bird Discount' },
      discount: '15%',
      description: { ar: 'احجز قبل 30 يوم واحصل على خصم', en: 'Book 30 days in advance' },
      icon: '🎉',
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      title: { ar: 'عرض العائلة', en: 'Family Deal' },
      discount: '20%',
      description: { ar: 'لمجموعات 4 أشخاص وأكثر', en: 'For groups of 4+' },
      icon: '👨‍👩‍👧‍👦',
      gradient: 'from-blue-500 to-indigo-600'
    },
    {
      title: { ar: 'عرض الموسم', en: 'Seasonal Offer' },
      discount: '25%',
      description: { ar: 'على الرحلات في فبراير-مارس', en: 'On Feb-Mar tours' },
      icon: '🌟',
      gradient: 'from-purple-500 to-pink-600'
    }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* ═══════════════════════════════════════════════════════════════
          Hero Section with Search
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative h-[70vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <Image
            src="/img/tours/tour1.webp"
            alt="Socotra Tours"
            fill
            className="object-cover"
            priority
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/50 to-black/70" />
        </div>

        {/* Content */}
        <div className="relative z-10 container-custom text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full mb-6 animate-fade-in">
            <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-white font-semibold">
              {locale === 'ar' ? `${tours.length} رحلة متاحة` : `${tours.length} Tours Available`}
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-slide-in-right">
            {locale === 'ar' ? 'اختر رحلتك' : 'Choose Your'}
            <br />
            <span className="text-gradient bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">
              {locale === 'ar' ? 'المثالية' : 'Perfect Tour'}
            </span>
          </h1>

          <p className="text-xl text-gray-200 max-w-2xl mx-auto mb-12 animate-slide-in-left">
            {locale === 'ar'
              ? 'من المغامرات المثيرة إلى الرحلات الثقافية، لدينا ما يناسب كل مسافر'
              : 'From thrilling adventures to cultural journeys, we have something for every traveler'}
          </p>

          {/* Quick Search Bar */}
          <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-md rounded-2xl p-2 shadow-2xl">
            <div className="flex flex-col md:flex-row gap-2">
              <div className="flex-1">
                <input
                  type="text"
                  placeholder={locale === 'ar' ? 'ابحث عن رحلة...' : 'Search for a tour...'}
                  className="w-full px-6 py-4 bg-white/10 border border-white/20 rounded-xl text-white placeholder:text-white/60 focus:border-white/40 focus:ring-2 focus:ring-white/20 outline-none transition-all"
                />
              </div>
              <button className="btn btn-primary px-8 py-4 whitespace-nowrap">
                <svg className={`w-5 h-5 ${locale === 'ar' ? 'ml-2' : 'mr-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {locale === 'ar' ? 'بحث' : 'Search'}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          Special Offers Banner
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-6 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 dark:from-green-800 dark:via-blue-800 dark:to-purple-800">
        <div className="container-custom">
          <div className="flex items-center justify-center gap-8 flex-wrap">
            {specialOffers.map((offer, index) => (
              <div
                key={index}
                className="flex items-center gap-3 text-white animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <span className="text-3xl">{offer.icon}</span>
                <div>
                  <div className="font-bold">
                    {offer.title[locale]} - <span className="text-yellow-300">{offer.discount}</span>
                  </div>
                  <div className="text-sm opacity-90">{offer.description[locale]}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          Tour Categories (من متطلبات PDF)
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {locale === 'ar' ? 'تصفح حسب' : 'Browse by'}{' '}
              <span className="text-gradient bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {locale === 'ar' ? 'الفئة' : 'Category'}
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {locale === 'ar' ? 'اختر نوع المغامرة المفضلة لديك' : 'Choose your preferred adventure type'}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {tourCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`group relative p-6 rounded-2xl transition-all transform hover:scale-105 ${
                  activeCategory === category.id
                    ? 'bg-gradient-to-br ' + category.gradient + ' text-white shadow-2xl scale-105'
                    : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white hover:shadow-xl'
                }`}
              >
                {/* Icon */}
                <div className={`mb-4 ${activeCategory === category.id ? 'text-white' : 'text-gray-400 dark:text-gray-500 group-hover:text-green-500'}`}>
                  {category.icon}
                </div>

                {/* Name */}
                <h3 className="font-bold mb-2 text-sm">
                  {category.name[locale]}
                </h3>

                {/* Count Badge */}
                <div className={`inline-flex items-center justify-center px-3 py-1 rounded-full text-xs font-semibold ${
                  activeCategory === category.id
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-100 dark:bg-gray-600 text-gray-600 dark:text-gray-300'
                }`}>
                  {category.count} {locale === 'ar' ? 'رحلة' : 'tours'}
                </div>

                {/* Description */}
                {category.description && (
                  <p className={`text-xs mt-2 ${
                    activeCategory === category.id ? 'text-white/80' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {category.description[locale]}
                  </p>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          Filters & Sort Section
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-8 bg-white dark:bg-gray-900 sticky top-0 z-40 shadow-md">
        <div className="container-custom">
          <div className="flex items-center justify-between gap-4 flex-wrap">
            {/* Results Count */}
            <div className="text-gray-900 dark:text-white font-semibold">
              {filteredTours.length} {locale === 'ar' ? 'رحلة متاحة' : 'tours available'}
            </div>

            {/* Filters Toggle (Mobile) */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="md:hidden btn btn-outline"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              {locale === 'ar' ? 'فلاتر' : 'Filters'}
            </button>

            {/* Filters (Desktop) */}
            <div className="hidden md:flex items-center gap-4 flex-1 justify-end">
              {/* Price Range */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                  {locale === 'ar' ? 'السعر:' : 'Price:'}
                </span>
                <select
                  value={`${priceRange[0]}-${priceRange[1]}`}
                  onChange={(e) => {
                    const [min, max] = e.target.value.split('-').map(Number)
                    setPriceRange([min, max])
                  }}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-900/50 outline-none"
                >
                  <option value="0-2000">{locale === 'ar' ? 'الكل' : 'All'}</option>
                  <option value="0-1000">$0 - $1000</option>
                  <option value="1000-1500">$1000 - $1500</option>
                  <option value="1500-2000">$1500+</option>
                </select>
              </div>

              {/* Duration */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                  {locale === 'ar' ? 'المدة:' : 'Duration:'}
                </span>
                <select
                  value={selectedDuration}
                  onChange={(e) => setSelectedDuration(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-900/50 outline-none"
                >
                  <option value="all">{locale === 'ar' ? 'الكل' : 'All'}</option>
                  <option value="3">{locale === 'ar' ? '1-3 أيام' : '1-3 days'}</option>
                  <option value="7">{locale === 'ar' ? '4-7 أيام' : '4-7 days'}</option>
                  <option value="10">{locale === 'ar' ? '8-10 أيام' : '8-10 days'}</option>
                </select>
              </div>

              {/* Difficulty */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                  {locale === 'ar' ? 'الصعوبة:' : 'Difficulty:'}
                </span>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-900/50 outline-none"
                >
                  <option value="all">{locale === 'ar' ? 'الكل' : 'All'}</option>
                  <option value="easy">{locale === 'ar' ? 'سهل' : 'Easy'}</option>
                  <option value="moderate">{locale === 'ar' ? 'متوسط' : 'Moderate'}</option>
                  <option value="challenging">{locale === 'ar' ? 'صعب' : 'Challenging'}</option>
                </select>
              </div>

              {/* Sort */}
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600 dark:text-gray-400 whitespace-nowrap">
                  {locale === 'ar' ? 'الترتيب:' : 'Sort:'}
                </span>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-green-500 focus:ring-2 focus:ring-green-200 dark:focus:ring-green-900/50 outline-none"
                >
                  <option value="popular">{locale === 'ar' ? 'الأكثر شعبية' : 'Most Popular'}</option>
                  <option value="price-low">{locale === 'ar' ? 'السعر: الأقل أولاً' : 'Price: Low to High'}</option>
                  <option value="price-high">{locale === 'ar' ? 'السعر: الأعلى أولاً' : 'Price: High to Low'}</option>
                  <option value="duration">{locale === 'ar' ? 'المدة: الأقصر أولاً' : 'Duration: Shortest First'}</option>
                  <option value="rating">{locale === 'ar' ? 'التقييم: الأعلى أولاً' : 'Rating: Highest First'}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Mobile Filters Drawer */}
          {showFilters && (
            <div className="md:hidden mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-xl space-y-4">
              {/* Same filters as desktop but stacked */}
              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                  {locale === 'ar' ? 'السعر' : 'Price'}
                </label>
                <select
                  value={`${priceRange[0]}-${priceRange[1]}`}
                  onChange={(e) => {
                    const [min, max] = e.target.value.split('-').map(Number)
                    setPriceRange([min, max])
                  }}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                >
                  <option value="0-2000">{locale === 'ar' ? 'الكل' : 'All'}</option>
                  <option value="0-1000">$0 - $1000</option>
                  <option value="1000-1500">$1000 - $1500</option>
                  <option value="1500-2000">$1500+</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                  {locale === 'ar' ? 'المدة' : 'Duration'}
                </label>
                <select
                  value={selectedDuration}
                  onChange={(e) => setSelectedDuration(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                >
                  <option value="all">{locale === 'ar' ? 'الكل' : 'All'}</option>
                  <option value="3">{locale === 'ar' ? '1-3 أيام' : '1-3 days'}</option>
                  <option value="7">{locale === 'ar' ? '4-7 أيام' : '4-7 days'}</option>
                  <option value="10">{locale === 'ar' ? '8-10 أيام' : '8-10 days'}</option>
                </select>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
                  {locale === 'ar' ? 'الصعوبة' : 'Difficulty'}
                </label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700"
                >
                  <option value="all">{locale === 'ar' ? 'الكل' : 'All'}</option>
                  <option value="easy">{locale === 'ar' ? 'سهل' : 'Easy'}</option>
                  <option value="moderate">{locale === 'ar' ? 'متوسط' : 'Moderate'}</option>
                  <option value="challenging">{locale === 'ar' ? 'صعب' : 'Challenging'}</option>
                </select>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          Tours Grid
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container-custom">
          {filteredTours.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredTours.map((tour) => (
                  <TourCard key={tour.id} tour={tour} />
                ))}
              </div>

              {/* Load More */}
              {filteredTours.length > 6 && (
                <div className="text-center mt-12">
                  <button className="btn btn-outline">
                    {locale === 'ar' ? 'عرض المزيد' : 'Load More'}
                  </button>
                </div>
              )}
            </>
          ) : (
            /* No Results */
            <div className="text-center py-20">
              <svg className="w-24 h-24 mx-auto text-gray-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {locale === 'ar' ? 'لا توجد نتائج' : 'No Results Found'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {locale === 'ar'
                  ? 'حاول تغيير الفلاتر أو البحث بكلمات مختلفة'
                  : 'Try changing filters or search with different keywords'}
              </p>
              <button
                onClick={() => {
                  setActiveCategory('all')
                  setPriceRange([0, 2000])
                  setSelectedDifficulty('all')
                  setSelectedDuration('all')
                }}
                className="btn btn-primary"
              >
                {locale === 'ar' ? 'إعادة تعيين الفلاتر' : 'Reset Filters'}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          Custom Tours Section (من متطلبات PDF)
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
        <div className="container-custom">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full px-6 py-3 text-sm font-semibold mb-6">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
              </svg>
              {locale === 'ar' ? 'رحلات مخصصة' : 'Custom Tours'}
            </div>

            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {locale === 'ar' ? 'صمم رحلتك' : 'Design Your'}{' '}
              <span className="text-gradient bg-gradient-to-r from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400 bg-clip-text text-transparent">
                {locale === 'ar' ? 'الخاصة' : 'Own Tour'}
              </span>
            </h2>

            <p className="text-xl text-gray-600 dark:text-gray-400 mb-12">
              {locale === 'ar'
                ? 'لم تجد ما يناسبك؟ دعنا نصمم رحلة مثالية خصيصاً لك!'
                : 'Didn\'t find what you\'re looking for? Let us design the perfect tour just for you!'}
            </p>

            {/* Custom Tour Features */}
            <div className="grid md:grid-cols-3 gap-8 mb-12">
              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {locale === 'ar' ? 'اختر تواريخك' : 'Choose Your Dates'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {locale === 'ar' ? 'مرونة كاملة في اختيار الوقت' : 'Complete flexibility in timing'}
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {locale === 'ar' ? 'اختر وجهاتك' : 'Pick Your Destinations'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {locale === 'ar' ? 'زر الأماكن التي تهمك' : 'Visit places that interest you'}
                </p>
              </div>

              <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
                <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {locale === 'ar' ? 'اختر ميزانيتك' : 'Set Your Budget'}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {locale === 'ar' ? 'نصمم رحلة تناسب ميزانيتك' : 'We design within your budget'}
                </p>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/contact?type=custom"
                className="btn btn-primary text-lg px-8 py-4 transform hover:scale-105 transition-all shadow-xl"
              >
                {locale === 'ar' ? 'ابدأ التصميم' : 'Start Designing'}
                <svg className={`w-5 h-5 ${locale === 'ar' ? 'mr-2' : 'ml-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={locale === 'ar' ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
                </svg>
              </Link>

              <a
                href="https://wa.me/967772371581"
                className="btn btn-outline text-lg px-8 py-4 border-2 inline-flex items-center gap-2 transform hover:scale-105 transition-all"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                {locale === 'ar' ? 'واتساب' : 'WhatsApp'}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          Travel Packages Section (من متطلبات PDF)
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-semibold mb-6">
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

          <div className="grid md:grid-cols-3 gap-8">
            {/* Basic Package */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all">
              <div className="bg-gradient-to-br from-gray-500 to-gray-700 p-8 text-white text-center">
                <h3 className="text-2xl font-bold mb-2">
                  {locale === 'ar' ? 'الباقة الأساسية' : 'Basic Package'}
                </h3>
                <div className="text-4xl font-bold mb-2">$950</div>
                <div className="text-sm opacity-90">{locale === 'ar' ? '7 أيام / 7 ليالي' : '7 days / 7 nights'}</div>
              </div>

              <div className="p-8">
                <ul className="space-y-4 mb-8">
                  {[
                    locale === 'ar' ? 'تخييم كامل' : 'Full camping',
                    locale === 'ar' ? 'جميع الوجبات' : 'All meals',
                    locale === 'ar' ? 'مرشد محلي' : 'Local guide',
                    locale === 'ar' ? 'النقل الداخلي' : 'Internal transport',
                    locale === 'ar' ? 'معدات التخييم' : 'Camping equipment'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>

                <button className="btn btn-outline w-full">
                  {locale === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                </button>
              </div>
            </div>

            {/* Standard Package */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all border-4 border-green-500 relative">
              {/* Popular Badge */}
              <div className="absolute top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg z-10">
                {locale === 'ar' ? 'الأكثر شعبية' : 'Most Popular'}
              </div>

              <div className="bg-gradient-to-br from-green-500 to-emerald-600 p-8 text-white text-center">
                <h3 className="text-2xl font-bold mb-2">
                  {locale === 'ar' ? 'الباقة القياسية' : 'Standard Package'}
                </h3>
                <div className="text-4xl font-bold mb-2">$1200</div>
                <div className="text-sm opacity-90">{locale === 'ar' ? '7 أيام / 6 ليالي' : '7 days / 6 nights'}</div>
              </div>

              <div className="p-8">
                <ul className="space-y-4 mb-8">
                  {[
                    locale === 'ar' ? 'تخييم + فندق' : 'Camping + Hotel',
                    locale === 'ar' ? 'جميع الوجبات' : 'All meals',
                    locale === 'ar' ? 'مرشد محترف' : 'Professional guide',
                    locale === 'ar' ? 'النقل الكامل' : 'Full transport',
                    locale === 'ar' ? 'معدات عالية الجودة' : 'High-quality equipment',
                    locale === 'ar' ? 'زيارة جميع المعالم' : 'Visit all landmarks'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>

                <button className="btn btn-primary w-full">
                  {locale === 'ar' ? 'احجز الآن' : 'Book Now'}
                </button>
              </div>
            </div>

            {/* Premium Package */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all">
              <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-8 text-white text-center">
                <h3 className="text-2xl font-bold mb-2">
                  {locale === 'ar' ? 'الباقة المميزة' : 'Premium Package'}
                </h3>
                <div className="text-4xl font-bold mb-2">$1800</div>
                <div className="text-sm opacity-90">{locale === 'ar' ? '10 أيام / 9 ليالي' : '10 days / 9 nights'}</div>
              </div>

              <div className="p-8">
                <ul className="space-y-4 mb-8">
                  {[
                    locale === 'ar' ? 'إقامة فندقية فاخرة' : 'Luxury hotel stay',
                    locale === 'ar' ? 'وجبات فاخرة' : 'Premium meals',
                    locale === 'ar' ? 'مرشد خاص' : 'Private guide',
                    locale === 'ar' ? 'نقل خاص VIP' : 'VIP private transport',
                    locale === 'ar' ? 'رحلة بحرية خاصة' : 'Private boat trip',
                    locale === 'ar' ? 'تصوير احترافي' : 'Professional photography',
                    locale === 'ar' ? 'تأمين شامل' : 'Full insurance'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
                      <svg className="w-5 h-5 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      {item}
                    </li>
                  ))}
                </ul>

                <button className="btn btn-outline w-full">
                  {locale === 'ar' ? 'عرض التفاصيل' : 'View Details'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          Booking & Inquiries CTA (من متطلبات PDF)
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 dark:from-green-800 dark:via-blue-800 dark:to-purple-800 text-white">
        <div className="container-custom text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {locale === 'ar' ? 'جاهز للحجز؟' : 'Ready to Book?'}
          </h2>

          <p className="text-xl mb-12 max-w-2xl mx-auto opacity-90">
            {locale === 'ar'
              ? 'تواصل معنا الآن للحجز أو لأي استفسارات - فريقنا جاهز لمساعدتك'
              : 'Contact us now to book or for any inquiries - our team is ready to help'}
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="https://wa.me/967772371581"
              className="btn text-lg px-8 py-4 bg-white text-green-600 hover:bg-gray-100 transform hover:scale-105 transition-all shadow-2xl inline-flex items-center gap-2"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              {locale === 'ar' ? 'واتساب فوري' : 'WhatsApp Now'}
            </a>

            <Link
              href="/contact"
              className="btn text-lg px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-green-600 transform hover:scale-105 transition-all"
            >
              {locale === 'ar' ? 'نموذج الحجز' : 'Booking Form'}
            </Link>

            <a
              href="tel:+967772371581"
              className="btn text-lg px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-blue-600 transform hover:scale-105 transition-all inline-flex items-center gap-2"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {locale === 'ar' ? 'اتصل بنا' : 'Call Us'}
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}