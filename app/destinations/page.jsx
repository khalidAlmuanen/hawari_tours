'use client'

// ═══════════════════════════════════════════════════════════════
// 🏛️ DESTINATIONS PAGE - Ultra Professional & Stunning
// صفحة المعالم السياحية - احترافية وعصرية ومبهرة جداً
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react'
import { useApp } from '@/contexts/AppContext'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'

export default function DestinationsPage() {
  const { locale, isDark } = useApp()
  const isAr = locale === 'ar'

  const [destinations, setDestinations] = useState([])
  const [loading, setLoading] = useState(true)
  const [pageSettings, setPageSettings] = useState(null)

  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState('grid') // grid or list
  const [isMounted, setIsMounted] = useState(false) // ✅ Fix hydration

  // ✅ Fix hydration: Only render particles on client
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Categories with icons and colors
  // Updated to match Admin Panel
  const categories = [
    { value: 'all', label: { ar: 'الكل', en: 'All' }, icon: '🌍', color: 'from-blue-500 to-purple-600' },
    { value: 'NATURE', label: { ar: 'طبيعة', en: 'Nature' }, icon: '🌿', color: 'from-green-500 to-emerald-600' },
    { value: 'HERITAGE', label: { ar: 'تراث', en: 'Heritage' }, icon: '🏛️', color: 'from-purple-500 to-pink-600' },
    { value: 'BEACH', label: { ar: 'شاطئ', en: 'Beach' }, icon: '🏖️', color: 'from-cyan-500 to-blue-600' },
    { value: 'MOUNTAIN', label: { ar: 'جبل', en: 'Mountain' }, icon: '⛰️', color: 'from-gray-600 to-gray-800' },
    { value: 'ARCHAEOLOGICAL', label: { ar: 'أثري', en: 'Archaeological' }, icon: '🏺', color: 'from-amber-500 to-orange-600' },
    { value: 'CULTURAL', label: { ar: 'ثقافي', en: 'Cultural' }, icon: '🎭', color: 'from-pink-500 to-rose-600' },
    { value: 'WILDLIFE', label: { ar: 'حياة برية', en: 'Wildlife' }, icon: '🦜', color: 'from-orange-500 to-red-600' },
    { value: 'URBAN', label: { ar: 'حضري', en: 'Urban' }, icon: '🏙️', color: 'from-blue-500 to-indigo-600' },
    { value: 'ADVENTURE', label: { ar: 'مغامرة', en: 'Adventure' }, icon: '🧗', color: 'from-red-500 to-orange-600' }
  ]

  // Fetch destinations and page settings
  useEffect(() => {
    fetchDestinations()
    fetchPageSettings()
  }, [])

  const fetchPageSettings = async () => {
    try {
      const response = await fetch('/api/destinations/settings')
      const result = await response.json()
      if (result.success) {
        setPageSettings(result.data)
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error)
    }
  }

  const fetchDestinations = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/destinations')
      const result = await response.json()

      if (result.success) {
        setDestinations(result.data.destinations || result.data) // Handle pagination structure if needed
      }
      // If API returns plain array or paginated object, adjust above
    } catch (error) {
      console.error('Failed to fetch destinations:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filter destinations
  const filteredDestinations = Array.isArray(destinations) ? destinations.filter(dest => {
    const matchesCategory = selectedCategory === 'all' || dest.category === selectedCategory
    const matchesSearch = searchTerm === '' ||
      (locale === 'ar' ? dest.nameAr : dest.name).toLowerCase().includes(searchTerm.toLowerCase())

    return matchesCategory && matchesSearch
  }) : []

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${isAr ? 'rtl' : 'ltr'}`}>

      {/* ═══════════════════════════════════════════════════════════════
          Hero Section - Dynamic from Settings
          ═══════════════════════════════════════════════════════════════ */}
      <div className="relative h-[60vh] min-h-[500px] overflow-hidden">
        <Image
          src={pageSettings?.heroImage || '/img/destinations/socotra-hero.jpg'}
          alt="Destinations Hero"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/50" />

        {/* Animated Particles Background */}
        <div className="absolute inset-0 overflow-hidden">
          {isMounted && [...Array(20)].map((_, i) => {
            const randomX = Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1920)
            const randomY = Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 1080)
            const randomDuration = Math.random() * 3 + 2

            return (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-white/30 rounded-full"
                initial={{
                  x: randomX,
                  y: randomY,
                }}
                animate={{
                  y: [null, Math.random() * -100 - 100],
                  opacity: [0.3, 0, 0.3],
                }}
                transition={{
                  duration: randomDuration,
                  repeat: Infinity,
                  ease: "linear"
                }}
              />
            )
          })}
        </div>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg"
          >
            {pageSettings
              ? (isAr ? pageSettings.heroTitleAr : pageSettings.heroTitleEn)
              : (isAr ? 'المعالم السياحية' : 'Tourist Destinations')
            }
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/90 max-w-2xl drop-shadow-md"
          >
            {pageSettings
              ? (isAr ? pageSettings.heroSubtitleAr : pageSettings.heroSubtitleEn)
              : (isAr ? 'استكشف أجمل المعالم السياحية في جزيرة سقطرى' : 'Explore the most beautiful tourist destinations in Socotra Island')
            }
          </motion.p>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          Categories Filter
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-8 bg-white/60 dark:bg-gray-900/60 backdrop-blur-md sticky top-0 z-40 border-b border-white/30 dark:border-white/10">
        <div className="container mx-auto px-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-white/90 to-transparent dark:from-gray-900/90 pointer-events-none" />
            <div className="absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-white/90 to-transparent dark:from-gray-900/90 pointer-events-none" />
            <div className="flex overflow-x-auto gap-4 pb-4 px-2 scroll-smooth snap-x snap-mandatory scrollbar-hide no-scrollbar">
            {categories.map((category, index) => (
              <motion.button
                key={category.value}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.value)}
                className={`snap-start flex items-center gap-2 px-6 py-3 rounded-full font-bold whitespace-nowrap transition-all border ${selectedCategory === category.value
                    ? `bg-gradient-to-r ${category.color} text-white shadow-xl shadow-${category.color.split('-')[1]}-500/30 border-white/20`
                    : 'bg-white/80 dark:bg-gray-800/80 text-gray-700 dark:text-gray-300 hover:shadow-lg border-white/40 dark:border-white/10'
                  }`}
              >
                <span className="text-xl">{category.icon}</span>
                <span>{category.label[locale]}</span>
                {selectedCategory === category.value && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-white/30 px-2 py-0.5 rounded-full text-xs ml-2 backdrop-blur-sm"
                  >
                    {filteredDestinations.length}
                  </motion.span>
                )}
              </motion.button>
            ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          Destinations Grid/List
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-16">
        <div className="container mx-auto px-4">

          {/* Controls: Search & View Toggle */}
          <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
            <div className="relative w-full md:w-96">
              <input
                type="text"
                placeholder={isAr ? "بحث عن معلم..." : "Search destinations..."}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 rounded-xl border-none bg-white dark:bg-gray-800 shadow-lg focus:ring-2 focus:ring-blue-500"
              />
              <span className="absolute left-4 top-3.5 text-gray-400 text-xl">🔍</span>
            </div>

            <div className="flex bg-white dark:bg-gray-800 p-1 rounded-xl shadow-md">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-400'}`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400' : 'text-gray-400'}`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </button>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full"
              />
            </div>
          )}

          {/* Grid View */}
          {!loading && viewMode === 'grid' && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredDestinations.map((destination, index) => (
                <DestinationCard
                  key={destination.id}
                  destination={destination}
                  index={index}
                  locale={locale}
                  isAr={isAr}
                  categories={categories}
                />
              ))}
            </motion.div>
          )}

          {/* List View */}
          {!loading && viewMode === 'list' && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              {filteredDestinations.map((destination, index) => (
                <DestinationListItem
                  key={destination.id}
                  destination={destination}
                  index={index}
                  locale={locale}
                  isAr={isAr}
                  categories={categories}
                />
              ))}
            </motion.div>
          )}

          {/* Empty State */}
          {!loading && filteredDestinations.length === 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <div className="text-6xl mb-4">🏜️</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {isAr ? 'لا توجد نتائج' : 'No destinations found'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {isAr ? 'جرب البحث عن شيء آخر' : 'Try searching for something else'}
              </p>
            </motion.div>
          )}

        </div>
      </section>

    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// Destination Card Component (Grid View)
// ═══════════════════════════════════════════════════════════════
function DestinationCard({ destination, index, locale, isAr, categories }) {
  const [isHovered, setIsHovered] = useState(false)

  // Use .value for comparison
  const category = categories.find(cat => cat.value === destination.category)
  const name = isAr ? destination.nameAr : destination.name
  const description = isAr ? destination.descriptionAr : destination.description

  return (
      <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ y: -10 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
        className="group relative rounded-3xl overflow-hidden shadow-2xl hover:shadow-[0_25px_80px_-20px_rgba(0,0,0,0.45)] transition-all cursor-pointer h-full flex flex-col bg-white/90 dark:bg-gray-800/90 border border-white/40 dark:border-white/10 backdrop-blur-md"
    >
      {/* Image */}
      <div className="relative h-64 overflow-hidden shrink-0">
        {destination.coverImage ? (
          <Image
            src={destination.coverImage}
            alt={name || 'Destination'}
            fill
              className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${category?.color || 'from-gray-500 to-gray-600'} flex items-center justify-center`}>
            <span className="text-8xl">{category?.icon || '🏛️'}</span>
          </div>
        )}

        {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.25),transparent_45%)] opacity-70" />
          <div className="absolute inset-0 translate-x-[-120%] group-hover:translate-x-[120%] transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent" />

        {/* Badges */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          {destination.unesco && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="px-4 py-2 bg-blue-500 text-white text-xs font-bold rounded-full backdrop-blur-sm shadow-lg"
            >
              🏛️ UNESCO
            </motion.span>
          )}
          {destination.featured && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="px-4 py-2 bg-yellow-500 text-white text-xs font-bold rounded-full backdrop-blur-sm shadow-lg"
            >
              ⭐ {isAr ? 'مميز' : 'Featured'}
            </motion.span>
          )}
        </div>

        {/* Category Badge */}
        <div className="absolute bottom-4 left-4">
          <span className={`px-4 py-2 bg-gradient-to-r ${category?.color || 'from-gray-500 to-gray-600'} text-white text-sm font-bold rounded-full backdrop-blur-md shadow-lg`}>
            {category?.icon} {category?.label[locale] || destination.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-1 group-hover:text-blue-600 transition-colors">
          {name}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed flex-1">
          {description}
        </p>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>🎯</span>
            <span>{destination.activities?.length || 0} {isAr ? 'نشاط' : 'activities'}</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <span>✨</span>
            <span>{destination.highlights?.length || 0} {isAr ? 'ميزة' : 'highlights'}</span>
          </div>
        </div>

        {/* Best Time */}
        {destination.bestTimeToVisit && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl mb-4">
            <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
              {isAr ? 'أفضل وقت للزيارة' : 'Best Time to Visit'}
            </div>
            <div className="text-sm font-bold text-blue-700 dark:text-blue-400">
              📅 {destination.bestTimeToVisit}
            </div>
          </div>
        )}

        {/* CTA Button */}
        <Link href={`/destinations/${destination.slug}`} className="mt-auto">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-xl transition-all"
          >
            {isAr ? 'اكتشف المزيد' : 'Discover More'}
          </motion.button>
        </Link>
      </div>

      {/* Bottom Progress Bar */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        className="h-1 bg-gradient-to-r from-blue-600 to-purple-600 origin-left"
      />
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════
// Destination List Item Component (List View)
// ═══════════════════════════════════════════════════════════════
function DestinationListItem({ destination, index, locale, isAr, categories }) {
  const category = categories.find(cat => cat.value === destination.category)
  const name = isAr ? destination.nameAr : destination.name
  const description = isAr ? destination.descriptionAr : destination.description

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white/90 dark:bg-gray-800/90 rounded-3xl overflow-hidden shadow-2xl hover:shadow-[0_25px_80px_-20px_rgba(0,0,0,0.45)] transition-all border border-white/40 dark:border-white/10 backdrop-blur-md"
    >
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        <div className="relative w-full md:w-80 h-64 md:h-auto flex-shrink-0">
          {destination.coverImage ? (
            <Image
              src={destination.coverImage}
              alt={name || 'Destination'}
              fill
              className="object-cover"
            />
          ) : (
            <div className={`w-full h-full bg-gradient-to-br ${category?.color} flex items-center justify-center`}>
              <span className="text-8xl">{category?.icon || '🏛️'}</span>
            </div>
          )}

          {/* Category Badge */}
          <div className="absolute bottom-4 left-4">
            <span className={`px-4 py-2 bg-gradient-to-r ${category?.color} text-white text-sm font-bold rounded-full backdrop-blur-md shadow-lg`}>
              {category?.icon} {category?.label[locale] || destination.category}
            </span>
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
        </div>

        {/* Content */}
        <div className="flex-1 p-8 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md">
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-3xl font-bold text-gray-900 dark:text-white">
              {name}
            </h3>
            <div className="flex gap-2">
              {destination.unesco && (
                <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold rounded-full">
                  🏛️ UNESCO
                </span>
              )}
              {destination.featured && (
                <span className="px-3 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 text-xs font-bold rounded-full">
                  ⭐ {isAr ? 'مميز' : 'Featured'}
                </span>
              )}
            </div>
          </div>

          <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-3 leading-relaxed">
            {description}
          </p>

          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span>🎯</span>
              <span>{destination.activities?.length || 0} {isAr ? 'نشاط' : 'activities'}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
              <span>✨</span>
              <span>{destination.highlights?.length || 0} {isAr ? 'ميزة' : 'highlights'}</span>
            </div>
            {destination.bestTimeToVisit && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <span>📅</span>
                <span>{destination.bestTimeToVisit}</span>
              </div>
            )}
          </div>

          <Link href={`/destinations/${destination.slug}`}>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-xl transition-all"
            >
              {isAr ? 'اكتشف المزيد' : 'Discover More'}
            </motion.button>
          </Link>
        </div>
      </div>
    </motion.div>
  )
}
