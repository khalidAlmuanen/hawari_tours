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
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState('grid') // grid or list
  const [isMounted, setIsMounted] = useState(false) // ✅ Fix hydration

  // ✅ Fix hydration: Only render particles on client
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Categories with icons and colors
  const categories = [
    { 
      id: 'all', 
      name: { ar: 'الكل', en: 'All' },
      icon: '🌍',
      color: 'from-blue-500 to-purple-600'
    },
    { 
      id: 'NATURE', 
      name: { ar: 'طبيعة', en: 'Nature' },
      icon: '🌿',
      color: 'from-green-500 to-emerald-600'
    },
    { 
      id: 'HERITAGE', 
      name: { ar: 'تراث', en: 'Heritage' },
      icon: '🏛️',
      color: 'from-purple-500 to-pink-600'
    },
    { 
      id: 'BEACH', 
      name: { ar: 'شاطئ', en: 'Beach' },
      icon: '🏖️',
      color: 'from-cyan-500 to-blue-600'
    },
    { 
      id: 'MOUNTAIN', 
      name: { ar: 'جبل', en: 'Mountain' },
      icon: '⛰️',
      color: 'from-gray-600 to-gray-800'
    },
    { 
      id: 'ARCHAEOLOGICAL', 
      name: { ar: 'أثري', en: 'Archaeological' },
      icon: '🏺',
      color: 'from-amber-500 to-orange-600'
    },
    { 
      id: 'WILDLIFE', 
      name: { ar: 'حياة برية', en: 'Wildlife' },
      icon: '🦜',
      color: 'from-orange-500 to-red-600'
    }
  ]

  // Fetch destinations
  useEffect(() => {
    fetchDestinations()
  }, [])

  const fetchDestinations = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/destinations')
      const result = await response.json()
      
      if (result.success) {
        setDestinations(result.data)
      }
    } catch (error) {
      console.error('Failed to fetch destinations:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filter destinations
  const filteredDestinations = destinations.filter(dest => {
    const matchesCategory = selectedCategory === 'all' || dest.category === selectedCategory
    const matchesSearch = searchTerm === '' || 
      (locale === 'ar' ? dest.nameAr : dest.name).toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesCategory && matchesSearch
  })

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

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
      {/* ═══════════════════════════════════════════════════════════════
          Hero Section - Stunning Design
          ═══════════════════════════════════════════════════════════════ */}
      <section className="relative h-[60vh] min-h-[500px] overflow-hidden">
        {/* Background Image with Parallax Effect */}
        <div className="absolute inset-0">
          <Image
            src="/img/destinations/socotra-hero.jpg"
            alt="Socotra Destinations"
            fill
            className="object-cover"
            priority
            quality={90}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
        </div>

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

        {/* Content */}
        <div className="relative h-full flex items-center z-10">
          <div className="container-custom">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="max-w-3xl"
            >
              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-6 py-3 rounded-full mb-6"
              >
                <span className="text-2xl">🏛️</span>
                <span className="text-white font-semibold">
                  {isAr ? 'اكتشف سقطرى' : 'Discover Socotra'}
                </span>
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight"
              >
                {isAr ? 'المعالم السياحية' : 'Tourist Destinations'}
              </motion.h1>

              {/* Description */}
              <motion.p
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="text-xl text-gray-200 mb-8 leading-relaxed"
              >
                {isAr 
                  ? 'استكشف أكثر من 50 معلماً سياحياً فريداً في جزيرة سقطرى، جالاباغوس المحيط الهندي'
                  : 'Explore over 50 unique tourist destinations in Socotra Island, the Galapagos of the Indian Ocean'
                }
              </motion.p>

              {/* Stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap gap-6"
              >
                {[
                  { icon: '🏛️', count: destinations.length || '50+', label: { ar: 'معلم', en: 'Destinations' } },
                  { icon: '🌿', count: '25+', label: { ar: 'محمية طبيعية', en: 'Natural Reserves' } },
                  { icon: '🏖️', count: '15+', label: { ar: 'شاطئ', en: 'Beaches' } },
                  { icon: '🏺', count: '10+', label: { ar: 'موقع أثري', en: 'Archaeological Sites' } }
                ].map((stat, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05, y: -5 }}
                    className="bg-white/10 backdrop-blur-md px-6 py-4 rounded-2xl"
                  >
                    <div className="text-3xl mb-2">{stat.icon}</div>
                    <div className="text-2xl font-bold text-white mb-1">{stat.count}</div>
                    <div className="text-sm text-gray-300">{stat.label[locale]}</div>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1, y: [0, 10, 0] }}
          transition={{ delay: 1, repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
        >
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex items-start justify-center p-2">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-1.5 h-1.5 bg-white rounded-full"
            />
          </div>
        </motion.div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          Search & Filter Section
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-12 sticky top-0 z-40 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700">
        <div className="container-custom">
          <div className="flex flex-col lg:flex-row gap-6 items-center">
            {/* Search Bar */}
            <div className="flex-1 w-full">
              <div className="relative">
                <input
                  type="search"
                  placeholder={isAr ? '🔍 ابحث عن معلم...' : '🔍 Search destinations...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-6 py-4 pr-14 bg-gray-100 dark:bg-gray-800 rounded-2xl text-gray-900 dark:text-white placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-500/50 transition-all"
                  dir={isAr ? 'rtl' : 'ltr'}
                />
                <svg className="absolute right-5 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>

            {/* View Mode Toggle */}
            <div className="flex gap-2 bg-gray-100 dark:bg-gray-800 p-2 rounded-2xl">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode('grid')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  viewMode === 'grid'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode('list')}
                className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                  viewMode === 'list'
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </motion.button>
            </div>

            {/* Results Count */}
            <div className="text-sm font-semibold text-gray-600 dark:text-gray-400 whitespace-nowrap">
              {isAr ? `${filteredDestinations.length} نتيجة` : `${filteredDestinations.length} results`}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          Categories Filter
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-8 bg-white/50 dark:bg-gray-900/50">
        <div className="container-custom">
          <div className="flex overflow-x-auto gap-4 pb-4 scrollbar-hide">
            {categories.map((category, index) => (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSelectedCategory(category.id)}
                className={`flex items-center gap-3 px-6 py-4 rounded-2xl font-bold whitespace-nowrap transition-all ${
                  selectedCategory === category.id
                    ? `bg-gradient-to-r ${category.color} text-white shadow-2xl`
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-lg border border-gray-200 dark:border-gray-700'
                }`}
              >
                <span className="text-2xl">{category.icon}</span>
                <span>{category.name[locale]}</span>
                {selectedCategory === category.id && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="bg-white/30 px-2 py-1 rounded-full text-xs"
                  >
                    {filteredDestinations.length}
                  </motion.span>
                )}
              </motion.button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          Destinations Grid/List
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-16">
        <div className="container-custom">
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
              <div className="text-6xl mb-6">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {isAr ? 'لا توجد نتائج' : 'No Results Found'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-8">
                {isAr ? 'جرب تغيير معايير البحث' : 'Try changing your search criteria'}
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('all')
                }}
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all"
              >
                {isAr ? 'إعادة تعيين الفلاتر' : 'Reset Filters'}
              </motion.button>
            </motion.div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          CTA Section
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
        {/* Animated Background Shapes */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute bg-white/10 rounded-full"
              style={{
                width: Math.random() * 300 + 100,
                height: Math.random() * 300 + 100,
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                scale: [1, 1.2, 1],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                ease: "linear"
              }}
            />
          ))}
        </div>

        <div className="container-custom relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-6xl font-black text-white mb-6">
              {isAr ? 'جاهز لبدء مغامرتك؟' : 'Ready to Start Your Adventure?'}
            </h2>
            <p className="text-xl text-white/90 mb-10">
              {isAr 
                ? 'احجز الآن واستمتع بخصم 20% على جميع الجولات'
                : 'Book now and get 20% off on all tours'
              }
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <motion.a
                href="/tours"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 bg-white text-purple-600 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-white/50 transition-all"
              >
                {isAr ? 'تصفح الجولات' : 'Browse Tours'}
              </motion.a>
              <motion.a
                href="/contact"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-10 py-5 bg-white/20 backdrop-blur-md text-white rounded-2xl font-bold text-lg border-2 border-white/50 hover:bg-white/30 transition-all"
              >
                {isAr ? 'اتصل بنا' : 'Contact Us'}
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════
// Destination Card Component (Grid View)
// ═══════════════════════════════════════════════════════════════
function DestinationCard({ destination, index, locale, isAr, categories }) {
  const [isHovered, setIsHovered] = useState(false)
  
  const category = categories.find(cat => cat.id === destination.category)
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
      className="group bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-64 overflow-hidden">
        {destination.coverImage ? (
          <Image
            src={destination.coverImage}
            alt={name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${category?.color} flex items-center justify-center`}>
            <span className="text-8xl">{category?.icon || '🏛️'}</span>
          </div>
        )}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

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
          <span className={`px-4 py-2 bg-gradient-to-r ${category?.color} text-white text-sm font-bold rounded-full backdrop-blur-md shadow-lg`}>
            {category?.icon} {category?.name[locale]}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-1 group-hover:text-blue-600 transition-colors">
          {name}
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2 leading-relaxed">
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
        <Link href={`/destinations/${destination.slug}`}>
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
        className="h-1 bg-gradient-to-r from-blue-600 to-purple-600"
      />
    </motion.div>
  )
}

// ═══════════════════════════════════════════════════════════════
// Destination List Item Component (List View)
// ═══════════════════════════════════════════════════════════════
function DestinationListItem({ destination, index, locale, isAr, categories }) {
  const category = categories.find(cat => cat.id === destination.category)
  const name = isAr ? destination.nameAr : destination.name
  const description = isAr ? destination.descriptionAr : destination.description

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all"
    >
      <div className="flex flex-col md:flex-row">
        {/* Image */}
        <div className="relative w-full md:w-80 h-64 md:h-auto flex-shrink-0">
          {destination.coverImage ? (
            <Image
              src={destination.coverImage}
              alt={name}
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
              {category?.icon} {category?.name[locale]}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-8">
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
