'use client'

// ═══════════════════════════════════════════════════════════════════════
// 📸 Gallery Page - Ultra Professional & Dynamic
// المرحلة 9: معرض الصور - احترافي جداً وعصري ومبهر (يتحكم من Admin!)
// ═══════════════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useApp } from '@/contexts/AppContext'
import WhatsAppButton from '@/components/WhatsAppButton'

export default function GalleryPage() {
  const { locale, isDark } = useApp()
  const isAr = locale === 'ar'

  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedImage, setSelectedImage] = useState(null)
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)

  // ═══════════════════════════════════════════════════════════════
  // Fetch Gallery Images from Database
  // ═══════════════════════════════════════════════════════════════
  useEffect(() => {
    fetchGalleryImages()
  }, [])

  const fetchGalleryImages = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/gallery')
      const result = await response.json()
      
      if (result.success) {
        // Transform database images to match the format used in the UI
        const transformedImages = result.data.images.map(img => ({
          id: img.id,
          category: mapCategoryToOldFormat(img.category),
          title: { ar: img.titleAr || img.title || 'بدون عنوان', en: img.title || img.titleAr || 'Untitled' },
          location: { ar: '', en: '' }, // Can be added to schema if needed
          src: img.url,
          thumbnail: img.thumbnail || img.url,
          photographer: 'Hawari Tours',
          date: new Date(img.createdAt).getFullYear().toString(),
          description: { ar: img.descriptionAr || img.description || '', en: img.description || img.descriptionAr || '' },
          tags: img.tags || [],
          aspectRatio: calculateAspectRatio(img.width, img.height),
          featured: img.featured,
          color: getCategoryColor(img.category)
        }))
        
        setPhotos(transformedImages)
      }
    } catch (error) {
      console.error('Failed to fetch gallery:', error)
    } finally {
      setLoading(false)
    }
  }

  // Map database categories to old format
  const mapCategoryToOldFormat = (category) => {
    const mapping = {
      'DESTINATIONS': 'landscapes',
      'TOURS': 'landscapes',
      'NATURE': 'landscapes',
      'CULTURE': 'culture',
      'WILDLIFE': 'wildlife',
      'PEOPLE': 'culture'
    }
    return mapping[category] || 'landscapes'
  }

  // Calculate aspect ratio
  const calculateAspectRatio = (width, height) => {
    if (!width || !height) return 'landscape'
    const ratio = width / height
    if (ratio > 1.3) return 'landscape'
    if (ratio < 0.8) return 'portrait'
    return 'square'
  }

  // Get category color
  const getCategoryColor = (category) => {
    const colors = {
      'DESTINATIONS': '#00BCD4',
      'TOURS': '#9C27B0',
      'NATURE': '#4CAF50',
      'CULTURE': '#FF9800',
      'WILDLIFE': '#8BC34A',
      'PEOPLE': '#E91E63'
    }
    return colors[category] || '#00BCD4'
  }

  // ═══════════════════════════════════════════════════════════════
  // Gallery Stats - إحصائيات المعرض (Dynamic)
  // ═══════════════════════════════════════════════════════════════
  const stats = [
    {
      number: `${photos.length}+`,
      label: { ar: 'صورة', en: 'Photos' },
      icon: '📸',
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      number: `${photos.filter(p => p.featured).length}+`,
      label: { ar: 'مميزة', en: 'Featured' },
      icon: '⭐',
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      number: '10+',
      label: { ar: 'جولة 360°', en: '360° Tours' },
      icon: '🌐',
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      number: '4K',
      label: { ar: 'دقة عالية', en: 'High Quality' },
      icon: '✨',
      gradient: 'from-orange-500 to-red-600'
    }
  ]

  // OLD STATIC DATA (Removed - Now from Database!)
  // const photos = [
  // OLD STATIC DATA REMOVED - NOW FETCHED FROM DATABASE!

  // ═══════════════════════════════════════════════════════════════
  // Video Gallery Data
  // ═══════════════════════════════════════════════════════════════
  const videos = [
    {
      id: 1,
      title: { ar: 'جولة جوية فوق سقطرى', en: 'Aerial Tour of Socotra' },
      description: {
        ar: 'جولة بطائرة درون فوق أجمل مناطق سقطرى',
        en: "Drone tour over Socotra's most beautiful areas"
      },
      duration: '5:30',
      thumbnail: 'aerial-thumb.jpg',
      category: 'landscapes',
      featured: true
    },
    {
      id: 2,
      title: { ar: 'الحياة البرية في سقطرى', en: 'Socotra Wildlife' },
      description: {
        ar: 'وثائقي قصير عن الحيوانات المتوطنة',
        en: 'Short documentary about endemic animals'
      },
      duration: '8:15',
      thumbnail: 'wildlife-thumb.jpg',
      category: 'wildlife',
      featured: true
    },
    {
      id: 3,
      title: { ar: 'ثقافة وتقاليد سقطرى', en: 'Socotra Culture & Traditions' },
      description: {
        ar: 'نظرة على الحياة التقليدية في سقطرى',
        en: 'Look at traditional life in Socotra'
      },
      duration: '6:45',
      thumbnail: 'culture-thumb.jpg',
      category: 'culture',
      featured: true
    }
  ]

  // ═══════════════════════════════════════════════════════════════
  // Virtual Tours Data (360°)
  // ═══════════════════════════════════════════════════════════════
  const virtualTours = [
    {
      id: 1,
      title: { ar: 'غابة دم الأخوين 360°', en: 'Dragon Blood Forest 360°' },
      description: {
        ar: 'جولة تفاعلية بزاوية 360 درجة في غابة دم الأخوين',
        en: 'Interactive 360° tour in Dragon Blood Forest'
      },
      location: { ar: 'جبال حجر', en: 'Haggier Mountains' },
      icon: '🌳',
      gradient: 'from-red-500 to-orange-600'
    },
    {
      id: 2,
      title: { ar: 'شاطئ ديتوا 360°', en: 'Detwah Beach 360°' },
      description: {
        ar: 'استكشف أجمل شواطئ سقطرى بزاوية 360 درجة',
        en: "Explore Socotra's most beautiful beach in 360°"
      },
      location: { ar: 'قلنسية', en: 'Qalansiyah' },
      icon: '🏖️',
      gradient: 'from-cyan-500 to-blue-600'
    },
    {
      id: 3,
      title: { ar: 'كهف هوق 360°', en: 'Hoq Cave 360°' },
      description: {
        ar: 'اكتشف داخل أكبر كهوف سقطرى',
        en: "Discover inside Socotra's largest cave"
      },
      location: { ar: 'شرق الجزيرة', en: 'East Island' },
      icon: '🏔️',
      gradient: 'from-gray-600 to-slate-700'
    }
  ]

  // Categories
  const categories = [
    { id: 'all', label: { ar: 'الكل', en: 'All' }, icon: '🌟', count: photos.length },
    { id: 'landscapes', label: { ar: 'مناظر طبيعية', en: 'Landscapes' }, icon: '🏞️', count: photos.filter(p => p.category === 'landscapes').length },
    { id: 'culture', label: { ar: 'ثقافة', en: 'Culture' }, icon: '🏛️', count: photos.filter(p => p.category === 'culture').length },
    { id: 'wildlife', label: { ar: 'حياة برية', en: 'Wildlife' }, icon: '🦎', count: photos.filter(p => p.category === 'wildlife').length }
  ]

  // Filter photos
  const filteredPhotos = activeCategory === 'all'
    ? photos
    : photos.filter(p => p.category === activeCategory)

  // Lightbox functions
  const openLightbox = (index) => {
    setCurrentImageIndex(index)
    setIsLightboxOpen(true)
    document.body.style.overflow = 'hidden'
  }

  const closeLightbox = () => {
    setIsLightboxOpen(false)
    document.body.style.overflow = 'auto'
  }

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % filteredPhotos.length)
  }

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + filteredPhotos.length) % filteredPhotos.length)
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[700px] overflow-hidden">
        {/* Background Slideshow Effect */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />

          {/* Animated Grid Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="grid grid-cols-8 grid-rows-8 h-full">
              {[...Array(64)].map((_, i) => (
                <div
                  key={i}
                  className="border border-white/20 animate-pulse"
                  style={{
                    animationDelay: `${i * 0.05}s`,
                    animationDuration: '3s'
                  }}
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="relative h-full flex items-center z-10">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full mb-6 animate-fade-in">
                <svg className="w-5 h-5 text-cyan-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
                </svg>
                <span className="text-white font-semibold">
                  {isAr ? '500+ صورة وفيديو احترافي' : '500+ Professional Photos & Videos'}
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-slide-in-up">
                {isAr ? 'معرض' : 'Visual'}
                <br />
                <span className="text-gradient bg-gradient-to-r from-cyan-300 via-blue-300 to-purple-300 bg-clip-text text-transparent">
                  {isAr ? 'سقطرى' : 'Gallery'}
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-white/90 mb-8 animate-slide-in-up" style={{ animationDelay: '0.1s' }}>
                {isAr
                  ? 'استكشف جمال سقطرى من خلال صور وفيديوهات احترافية وجولات افتراضية بزاوية 360°'
                  : "Explore Socotra's beauty through professional photos, videos, and 360° virtual tours"}
              </p>

              <div className="flex gap-4 animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <a href="#photos" className="btn btn-primary px-8 py-4 text-lg">
                  {isAr ? 'تصفح المعرض' : 'Browse Gallery'}
                </a>
                <a href="#videos" className="btn btn-outline border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 text-lg">
                  {isAr ? 'شاهد الفيديوهات' : 'Watch Videos'}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-20">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800 -mt-20 relative z-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br ${stat.gradient} p-6 rounded-2xl shadow-xl text-center transform hover:scale-105 transition-all animate-fade-in text-white`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-5xl mb-3">{stat.icon}</div>
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-sm opacity-90">{stat.label[locale]}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          Category Filters
          ═══════════════════════════════════════════════════════════════ */}
      <section id="photos" className="py-8 bg-white dark:bg-gray-800 sticky top-0 z-40 border-b border-gray-200 dark:border-gray-700 shadow-md">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex overflow-x-auto gap-4 pb-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? 'bg-gradient-to-r from-purple-500 to-blue-600 text-white shadow-lg scale-105'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <span className="text-xl">{cat.icon}</span>
                <span>{cat.label[locale]}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  activeCategory === cat.id
                    ? 'bg-white/20'
                    : 'bg-gray-200 dark:bg-gray-600'
                }`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          Photo Gallery - Masonry Grid (DYNAMIC FROM DATABASE!)
          ✅ كل الصور يتم التحكم فيها من لوحة التحكم!
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Section Title */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {isAr ? 'معرض الصور' : 'Photo Gallery'}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {loading 
                ? (isAr ? 'جاري التحميل...' : 'Loading...')
                : (isAr
                  ? `${filteredPhotos.length} صورة احترافية`
                  : `${filteredPhotos.length} Professional Photos`)
              }
            </p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center py-20">
              <div className="text-center">
                <div className="inline-block w-16 h-16 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full animate-spin mb-4"></div>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  {isAr ? 'جاري تحميل الصور...' : 'Loading images...'}
                </p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!loading && filteredPhotos.length === 0 && (
            <div className="text-center py-20">
              <div className="text-6xl mb-4">📸</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {isAr ? 'لا توجد صور' : 'No Images'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {isAr ? 'لم يتم إضافة صور بعد' : 'No images have been added yet'}
              </p>
            </div>
          )}

          {/* Masonry Grid */}
          {!loading && filteredPhotos.length > 0 && (
            <>
              <div className="grid md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredPhotos.map((photo, index) => (
                  <div
                    key={photo.id}
                    className={`group relative overflow-hidden rounded-2xl shadow-lg hover:shadow-2xl transition-all cursor-pointer transform hover:-translate-y-2 animate-fade-in ${
                      photo.aspectRatio === 'landscape'
                        ? 'md:col-span-2'
                        : photo.aspectRatio === 'portrait'
                        ? 'md:row-span-2'
                        : ''
                    } ${photo.featured ? 'lg:col-span-2 lg:row-span-2' : ''}`}
                    style={{
                      animationDelay: `${index * 0.05}s`,
                      backgroundColor: photo.color
                    }}
                    onClick={() => openLightbox(index)}
                  >
                    {/* Image Container */}
                    <div className={`relative ${
                      photo.aspectRatio === 'portrait' ? 'aspect-[3/4]' : 'aspect-[4/3]'
                    } ${photo.featured ? 'aspect-square' : ''}`}>
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80"></div>

                      {/* ✅ Actual Image */}
                      {photo.thumbnail || photo.src ? (
                        <Image
                          src={photo.thumbnail || photo.src}
                          alt={photo.title[locale]}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                          priority={photo.featured}
                          unoptimized={true}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white/20 text-6xl">
                          📸
                        </div>
                      )}

                      {/* Overlay on Hover */}
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center">
                        <div className="opacity-0 group-hover:opacity-100 transition-opacity transform scale-0 group-hover:scale-100 transition-transform">
                          <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                          </svg>
                        </div>
                      </div>

                      {/* Info Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-full group-hover:translate-y-0 transition-transform">
                        <h3 className="text-white font-bold text-lg mb-1">
                          {photo.title[locale]}
                        </h3>
                        <div className="flex items-center gap-2 text-white/80 text-sm">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                          </svg>
                          <span>{photo.location[locale]}</span>
                        </div>
                      </div>

                      {/* Featured Badge */}
                      {photo.featured && (
                        <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                          {isAr ? 'مميزة' : 'Featured'}
                        </div>
                      )}

                      {/* Category Badge */}
                      <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-semibold">
                        {categories.find(c => c.id === photo.category)?.icon} {categories.find(c => c.id === photo.category)?.label[locale]}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Load More Button */}
              {filteredPhotos.length > 12 && (
                <div className="text-center mt-12">
                  <button className="btn btn-outline px-8 py-4 text-lg">
                    {isAr ? 'تحميل المزيد' : 'Load More'}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          Lightbox Viewer (Full Screen)
          ✅ تم استبدال Placeholder بصورة حقيقية من photo.src
          ═══════════════════════════════════════════════════════════════ */}
      {isLightboxOpen && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center animate-fade-in">
          {/* Close Button */}
          <button
            onClick={closeLightbox}
            className="absolute top-4 right-4 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all z-50"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Previous Button */}
          <button
            onClick={prevImage}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          {/* Next Button */}
          <button
            onClick={nextImage}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          {/* Image Container */}
          <div className="max-w-6xl max-h-[90vh] mx-4">
            <div
              className="relative rounded-lg overflow-hidden shadow-2xl"
              style={{ backgroundColor: filteredPhotos[currentImageIndex]?.color }}
            >
              {/* ✅ Actual Image */}
              <div className="relative w-[min(92vw,1100px)] h-[min(70vh,720px)]">
                {filteredPhotos[currentImageIndex]?.src ? (
                  <Image
                    src={filteredPhotos[currentImageIndex].src}
                    alt={filteredPhotos[currentImageIndex]?.title[locale]}
                    fill
                    className="object-contain"
                    sizes="92vw"
                    priority
                    unoptimized={true}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-white/30 text-9xl min-h-[400px]">
                    📸
                  </div>
                )}
              </div>
            </div>

            {/* Image Info */}
            <div className="mt-6 text-center text-white">
              <h3 className="text-2xl font-bold mb-2">
                {filteredPhotos[currentImageIndex]?.title[locale]}
              </h3>
              <p className="text-white/80 mb-4">
                {filteredPhotos[currentImageIndex]?.description[locale]}
              </p>
              <div className="flex items-center justify-center gap-6 text-sm text-white/60">
                <span className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                  </svg>
                  {filteredPhotos[currentImageIndex]?.location[locale]}
                </span>
                <span>•</span>
                <span>{filteredPhotos[currentImageIndex]?.photographer}</span>
                <span>•</span>
                <span>{filteredPhotos[currentImageIndex]?.date}</span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 justify-center mt-4">
                {filteredPhotos[currentImageIndex]?.tags.map((tag, i) => (
                  <span key={i} className="px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs">
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Image Counter */}
              <div className="mt-6 text-white/60 text-sm">
                {currentImageIndex + 1} / {filteredPhotos.length}
              </div>
            </div>
          </div>

          {/* Keyboard hint */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/40 text-xs">
            {isAr ? 'استخدم الأسهم أو ESC للإغلاق' : 'Use arrow keys or ESC to close'}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          Video Gallery Section (متطلبات PDF)
          ═══════════════════════════════════════════════════════════════ */}
      <section id="videos" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Section Title */}
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full text-sm font-semibold mb-4">
              🎥 {isAr ? 'معرض الفيديو' : 'Video Gallery'}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {isAr ? 'شاهد' : 'Watch'}{' '}
              <span className="text-gradient bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {isAr ? 'سقطرى' : 'Socotra'}
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {isAr ? 'فيديوهات احترافية عالية الجودة' : 'Professional high-quality videos'}
            </p>
          </div>

          {/* Featured Video */}
          <div className="mb-12">
            <div className="relative aspect-video rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-purple-600 to-pink-600">
              {/* Video Placeholder */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-24 h-24 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center mx-auto mb-4 hover:bg-white/30 transition-all cursor-pointer group">
                    <svg className="w-12 h-12 transform group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{videos[0].title[locale]}</h3>
                  <p className="text-white/80 mb-4">{videos[0].description[locale]}</p>
                  <div className="flex items-center justify-center gap-4 text-sm">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      {videos[0].duration}
                    </span>
                    <span>•</span>
                    <span>4K Ultra HD</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Video Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {videos.slice(1).map((video, index) => (
              <div key={video.id} className="group cursor-pointer animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="relative aspect-video rounded-xl overflow-hidden shadow-lg group-hover:shadow-2xl transition-all mb-4 bg-gradient-to-br from-blue-500 to-cyan-600">
                  {/* Thumbnail Placeholder */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center group-hover:bg-white/30 transition-all">
                      <svg className="w-8 h-8 text-white transform group-hover:scale-110 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                      </svg>
                    </div>
                  </div>

                  {/* Duration Badge */}
                  <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md text-white px-2 py-1 rounded text-xs font-semibold">
                    {video.duration}
                  </div>

                  {/* Category Badge */}
                  <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {categories.find(c => c.id === video.category)?.icon} {categories.find(c => c.id === video.category)?.label[locale]}
                  </div>
                </div>

                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                  {video.title[locale]}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {video.description[locale]}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          360° Virtual Tours Section (متطلبات PDF)
          ═══════════════════════════════════════════════════════════════ */}
      <section id="virtual-tours" className="py-20 bg-gradient-to-b from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Section Title */}
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-sm font-semibold mb-4">
              🌐 {isAr ? 'جولات افتراضية 360°' : '360° Virtual Tours'}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {isAr ? 'استكشف' : 'Explore'}{' '}
              <span className="text-gradient bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                {isAr ? 'تفاعلياً' : 'Interactively'}
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {isAr ? 'جولات تفاعلية بزاوية 360 درجة' : 'Interactive 360-degree tours'}
            </p>
          </div>

          {/* Virtual Tours Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {virtualTours.map((tour, index) => (
              <div
                key={tour.id}
                className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 cursor-pointer animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`h-3 bg-gradient-to-r ${tour.gradient}`}></div>

                <div className="p-8">
                  <div className={`w-20 h-20 bg-gradient-to-br ${tour.gradient} rounded-2xl flex items-center justify-center text-5xl mx-auto mb-6 transform group-hover:scale-110 group-hover:rotate-12 transition-all`}>
                    {tour.icon}
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 text-center">
                    {tour.title[locale]}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-400 text-center mb-4 text-sm">
                    {tour.description[locale]}
                  </p>

                  <div className="flex items-center justify-center gap-2 text-sm text-gray-500 dark:text-gray-500 mb-6">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                    </svg>
                    <span>{tour.location[locale]}</span>
                  </div>

                  <button className={`w-full py-3 bg-gradient-to-r ${tour.gradient} text-white rounded-xl font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 group`}>
                    <svg className="w-5 h-5 transform group-hover:rotate-180 transition-transform" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
                    </svg>
                    <span>{isAr ? 'ابدأ الجولة' : 'Start Tour'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Info Box */}
          <div className="mt-12 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-l-4 border-blue-500 p-8 rounded-lg">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center text-white text-2xl flex-shrink-0">
                ℹ️
              </div>
              <div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                  {isAr ? 'كيف تستخدم الجولات الافتراضية؟' : 'How to use virtual tours?'}
                </h4>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  {isAr
                    ? 'انقر وسحب للنظر حولك، استخدم الماوس أو إصبعك للتحرك في أي اتجاه. اضغط على النقاط الساخنة لمعلومات إضافية.'
                    : 'Click and drag to look around, use mouse or finger to move in any direction. Click on hotspots for additional information.'}
                </p>
                <div className="flex flex-wrap gap-3">
                  {[
                    { icon: '🖱️', text: { ar: 'اسحب للتحرك', en: 'Drag to move' } },
                    { icon: '🔍', text: { ar: 'زوم للتقريب', en: 'Zoom to enlarge' } },
                    { icon: '📍', text: { ar: 'انقر النقاط', en: 'Click hotspots' } }
                  ].map((tip, i) => (
                    <span key={i} className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 px-4 py-2 rounded-lg text-sm font-semibold text-gray-700 dark:text-gray-300">
                      <span>{tip.icon}</span>
                      <span>{tip.text[locale]}</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          Instagram Feed Section (إضافة احترافية)
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Section Title */}
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full text-sm font-semibold mb-4">
              📱 {isAr ? 'تابعنا على إنستغرام' : 'Follow us on Instagram'}
            </div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              @HawariTours
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {isAr ? 'آخر التحديثات والصور اليومية من سقطرى' : 'Latest updates and daily photos from Socotra'}
            </p>
          </div>

          {/* Instagram Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
            {[
              { likes: 342, comments: 28 },
              { likes: 521, comments: 45 },
              { likes: 198, comments: 15 },
              { likes: 673, comments: 52 },
              { likes: 289, comments: 31 },
              { likes: 445, comments: 38 },
              { likes: 567, comments: 42 },
              { likes: 312, comments: 24 },
              { likes: 489, comments: 36 },
              { likes: 234, comments: 19 },
              { likes: 598, comments: 48 },
              { likes: 367, comments: 29 }
            ].map((post, i) => (
              <div
                key={i}
                className="aspect-square rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all cursor-pointer group relative bg-gradient-to-br from-pink-400 to-purple-600 animate-fade-in"
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                {/* Instagram Icon Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center text-white/30 text-4xl">
                  📷
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all flex items-center justify-center">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white">
                    <div className="flex gap-4">
                      <span className="flex items-center gap-1">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                        {post.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                        </svg>
                        {post.comments}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Follow Button */}
          <div className="text-center">
            <a
              href="https://instagram.com/hawaritours"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl transition-all transform hover:scale-105"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
              <span>{isAr ? 'تابعنا على إنستغرام' : 'Follow us on Instagram'}</span>
            </a>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          Download Section (إضافة احترافية)
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-8 md:p-12 border-2 border-green-300 dark:border-green-700">
            <div className="text-center">
              <div className="text-6xl mb-6">📥</div>

              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                {isAr ? 'هل تريد نسخة عالية الجودة؟' : 'Want High-Resolution Copy?'}
              </h2>

              <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                {isAr
                  ? 'جميع صورنا متاحة للتحميل بجودة عالية (4K) للاستخدام الشخصي والتجاري بموجب الترخيص المناسب'
                  : 'All our photos available for download in high quality (4K) for personal and commercial use under appropriate license'}
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {[
                  { icon: '📸', title: { ar: '4K دقة', en: '4K Resolution' } },
                  { icon: '✅', title: { ar: 'ترخيص تجاري', en: 'Commercial License' } },
                  { icon: '💯', title: { ar: 'جودة احترافية', en: 'Pro Quality' } }
                ].map((item, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-xl">
                    <div className="text-3xl mb-2">{item.icon}</div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {item.title[locale]}
                    </div>
                  </div>
                ))}
              </div>

              <a
                href="/contact"
                className="inline-block bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                {isAr ? 'اطلب نسخة عالية الجودة' : 'Request High-Res Copy'}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          CTA Section
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {isAr ? 'هل أعجبتك الصور؟ زر سقطرى بنفسك!' : 'Liked the Photos? Visit Socotra Yourself!'}
          </h2>

          <p className="text-xl mb-12 opacity-90">
            {isAr
              ? 'احجز رحلتك الآن واستمتع بتجربة لا تُنسى في أجمل جزيرة على وجه الأرض'
              : 'Book your trip now and enjoy an unforgettable experience on the most beautiful island on Earth'}
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="/tours"
              className="btn text-lg px-8 py-4 bg-white text-purple-600 hover:bg-gray-100 transform hover:scale-105 transition-all shadow-2xl"
            >
              {isAr ? 'تصفح الرحلات' : 'Browse Tours'}
            </a>

            <a
              href="/contact"
              className="btn text-lg px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-purple-600 transform hover:scale-105 transition-all"
            >
              {isAr ? 'احجز الآن' : 'Book Now'}
            </a>

            <a
              href="https://wa.me/967772371581"
              target="_blank"
              rel="noopener noreferrer"
              className="btn text-lg px-8 py-4 bg-green-500 text-white hover:bg-green-600 transform hover:scale-105 transition-all shadow-2xl flex items-center gap-2"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              {isAr ? 'واتساب' : 'WhatsApp'}
            </a>
          </div>
        </div>
      </section>

      <WhatsAppButton />
    </div>
  )
}
