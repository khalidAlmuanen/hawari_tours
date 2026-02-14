'use client'

// ═══════════════════════════════════════════════════════════════
// 🏛️ Destination Details Page - Ultra Professional & Stunning
// صفحة تفاصيل المعلم السياحي - احترافية وعصرية ومبهرة جداً
// ═══════════════════════════════════════════════════════════════

import React, { useState, useEffect } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useApp } from '@/contexts/AppContext'
import { motion, AnimatePresence } from 'framer-motion'
import WhatsAppButton from '@/components/WhatsAppButton'
import ContactModal from '@/components/ContactModal'

export default function DestinationDetailsPage({ params }) {
  const { locale, isDark } = useApp()
  const isAr = locale === 'ar'

  // ✅ Resolve params (Next.js 15+)
  const resolvedParams = React.use(params)

  // State
  const [destination, setDestination] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState(0)

  // Category configs
  const categoryConfig = {
    NATURE: { icon: '🌿', color: 'from-green-500 to-emerald-600', label: { ar: 'طبيعة', en: 'Nature' } },
    HERITAGE: { icon: '🏛️', color: 'from-purple-500 to-pink-600', label: { ar: 'تراث', en: 'Heritage' } },
    BEACH: { icon: '🏖️', color: 'from-cyan-500 to-blue-600', label: { ar: 'شاطئ', en: 'Beach' } },
    MOUNTAIN: { icon: '⛰️', color: 'from-gray-600 to-gray-800', label: { ar: 'جبل', en: 'Mountain' } },
    ARCHAEOLOGICAL: { icon: '🏺', color: 'from-amber-500 to-orange-600', label: { ar: 'أثري', en: 'Archaeological' } },
    WILDLIFE: { icon: '🦜', color: 'from-orange-500 to-red-600', label: { ar: 'حياة برية', en: 'Wildlife' } },
    CULTURAL: { icon: '🎭', color: 'from-pink-500 to-rose-600', label: { ar: 'ثقافي', en: 'Cultural' } },
    URBAN: { icon: '🏙️', color: 'from-blue-500 to-indigo-600', label: { ar: 'حضري', en: 'Urban' } },
    ADVENTURE: { icon: '🧗', color: 'from-red-500 to-orange-600', label: { ar: 'مغامرة', en: 'Adventure' } }
  }

  // Fetch destination
  useEffect(() => {
    fetchDestination()
  }, [resolvedParams.slug])

  const fetchDestination = async () => {
    setLoading(true)
    setError(null)

    try {
      console.log('🔄 Fetching destination:', resolvedParams.slug)

      const response = await fetch(`/api/destinations/${resolvedParams.slug}`)
      console.log('📡 API Response status:', response.status)

      if (!response.ok) {
        if (response.status === 404) {
          console.log('❌ Destination not found')
          setDestination(null)
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
        console.log('✅ Destination loaded:', result.data.name)
        setDestination(result.data)
      } else {
        throw new Error(result.error || 'Failed to fetch destination')
      }
    } catch (err) {
      console.error('❌ Error fetching destination:', err)
      setError(err.message)
      setDestination(null)
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
  if (error || !destination) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">🏛️</div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {isAr ? 'المعلم غير موجود' : 'Destination Not Found'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">
            {isAr ? 'المعلم الذي تبحث عنه غير موجود أو تم حذفه' : 'The destination you are looking for does not exist or has been removed'}
          </p>
          <Link
            href="/destinations"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
          >
            {isAr ? 'العودة إلى المعالم' : 'Back to Destinations'}
          </Link>
        </div>
      </div>
    )
  }

  const category = categoryConfig[destination.category] || categoryConfig.NATURE
  const name = isAr ? destination.nameAr : destination.name
  const description = isAr ? destination.descriptionAr : destination.description
  const allImages = [destination.coverImage, ...(destination.images || []), ...(destination.gallery || [])].filter(Boolean)

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${isAr ? 'rtl' : 'ltr'}`}>
      
      {/* Hero Section with Gallery */}
      <div className="relative h-[70vh] overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedImage}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.7 }}
            className="absolute inset-0"
          >
            {allImages[selectedImage] && (
              <Image
                src={allImages[selectedImage]}
                alt={name}
                fill
                className="object-cover"
                priority
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          </motion.div>
        </AnimatePresence>

        {/* Content Overlay */}
        <div className="absolute inset-0 flex flex-col justify-end">
          <div className="container mx-auto px-4 pb-12">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              {/* Badges */}
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-4 py-2 bg-gradient-to-r ${category.color} text-white rounded-full text-sm font-bold flex items-center gap-2`}>
                  <span>{category.icon}</span>
                  <span>{category.label[locale]}</span>
                </span>
                
                {destination.unesco && (
                  <span className="px-4 py-2 bg-gradient-to-r from-yellow-500 to-amber-600 text-white rounded-full text-sm font-bold flex items-center gap-2">
                    <span>🏆</span>
                    <span>{isAr ? 'يونسكو' : 'UNESCO'}</span>
                  </span>
                )}

                {destination.featured && (
                  <span className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-full text-sm font-bold flex items-center gap-2">
                    <span>⭐</span>
                    <span>{isAr ? 'مميز' : 'Featured'}</span>
                  </span>
                )}
              </div>

              <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 drop-shadow-2xl">
                {name}
              </h1>

              {/* Stats */}
              <div className="flex flex-wrap gap-6 text-white/90">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">👁️</span>
                  <span className="text-lg">{destination.viewsCount || 0} {isAr ? 'مشاهدة' : 'Views'}</span>
                </div>
                {destination.toursCount > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🎫</span>
                    <span className="text-lg">{destination.toursCount} {isAr ? 'جولة' : 'Tours'}</span>
                  </div>
                )}
                {destination.bestTimeToVisit && (
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">📅</span>
                    <span className="text-lg">{destination.bestTimeToVisit}</span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Image Thumbnails */}
        {allImages.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 z-10">
            {allImages.slice(0, 5).map((img, idx) => (
              <button
                key={idx}
                onClick={() => setSelectedImage(idx)}
                className={`w-16 h-16 rounded-lg overflow-hidden border-2 transition-all ${
                  selectedImage === idx
                    ? 'border-white scale-110'
                    : 'border-white/50 hover:border-white/80'
                }`}
              >
                <Image
                  src={img}
                  alt={`${name} - ${idx + 1}`}
                  width={64}
                  height={64}
                  className="object-cover w-full h-full"
                />
              </button>
            ))}
            {allImages.length > 5 && (
              <div className="w-16 h-16 rounded-lg bg-black/50 flex items-center justify-center text-white font-bold border-2 border-white/50">
                +{allImages.length - 5}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl"
            >
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-3">
                <span>📖</span>
                <span>{isAr ? 'عن هذا المعلم' : 'About This Destination'}</span>
              </h2>
              <div className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line text-lg">
                {description}
              </div>
            </motion.div>

            {/* Highlights */}
            {destination.highlights && destination.highlights.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl"
              >
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                  <span>✨</span>
                  <span>{isAr ? 'أبرز المعالم' : 'Highlights'}</span>
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {destination.highlights.map((highlight, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl"
                    >
                      <span className="text-2xl flex-shrink-0">✓</span>
                      <span className="text-gray-800 dark:text-gray-200 font-medium">{highlight}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Activities */}
            {destination.activities && destination.activities.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl"
              >
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                  <span>🎯</span>
                  <span>{isAr ? 'الأنشطة المتاحة' : 'Available Activities'}</span>
                </h2>
                <div className="grid md:grid-cols-2 gap-4">
                  {destination.activities.map((activity, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl"
                    >
                      <span className="text-2xl flex-shrink-0">🎯</span>
                      <span className="text-gray-800 dark:text-gray-200 font-medium">{activity}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Location */}
            {(destination.latitude && destination.longitude) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl"
              >
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                  <span>📍</span>
                  <span>{isAr ? 'الموقع' : 'Location'}</span>
                </h2>
                <div className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden">
                  <iframe
                    src={`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1000!2d${destination.longitude}!3d${destination.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1sen!2s!4v1234567890`}
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </motion.div>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Contact Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-8 text-white shadow-2xl sticky top-4"
            >
              <h3 className="text-2xl font-bold mb-4">
                {isAr ? 'هل أنت مهتم؟' : 'Interested?'}
              </h3>
              <p className="mb-6 text-white/90">
                {isAr
                  ? 'اتصل بنا لتخطيط زيارتك إلى هذا المعلم الرائع'
                  : 'Contact us to plan your visit to this amazing destination'}
              </p>
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full py-4 bg-white text-blue-600 rounded-xl font-bold hover:bg-gray-100 transition-all transform hover:scale-105 active:scale-95 mb-4"
              >
                {isAr ? 'احجز الآن' : 'Book Now'}
              </button>
              <Link
                href="/destinations"
                className="block w-full py-4 bg-white/10 backdrop-blur-xl text-white text-center rounded-xl font-bold hover:bg-white/20 transition-all"
              >
                {isAr ? 'تصفح المزيد من المعالم' : 'Browse More Destinations'}
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* WhatsApp Button */}
      <WhatsAppButton />

      {/* Contact Modal */}
      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tourTitle={name}
      />
    </div>
  )
}
