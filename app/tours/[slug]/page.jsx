'use client'

// ═══════════════════════════════════════════════════════════════════════
// 📄 ملف: app/tours/[slug]/page.jsx
// الوصف: صفحة تفاصيل الرحلة - تقرأ من Database
// ✅ UPDATED: Fix params Promise + Better error parsing (no {})
// ═══════════════════════════════════════════════════════════════════════

import React, { useMemo, useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import WhatsAppButton from '@/components/WhatsAppButton'
import ContactModal from '@/components/ContactModal'
import BookingModal from '@/components/BookingModal'
import ReviewsSection from '@/components/tours/ReviewsSection'
import { useApp } from '@/contexts/AppContext'

// ✅ Helper to get tour data (cached for metadata)
async function getTour(slug) {
  try {
    return null
  } catch (error) {
    return null
  }
}

// Helper to extract YouTube ID
const getYouTubeId = (url) => {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export default function TourDetailsPage({ params }) {
  const { locale, t, isRTL, isDark } = useApp()
  const isAr = locale === 'ar'

  // ✅ FIX: params عندك Promise، لازم نفكّه بـ React.use()
  const resolvedParams = React.use(params)

  // ✅ NEW: Database state
  const [tour, setTour] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false)
  const [reviewForm, setReviewForm] = useState({
    name: '',
    email: '',
    title: '',
    comment: '',
    rating: 5
  })
  const [reviewSubmitting, setReviewSubmitting] = useState(false)
  const [reviewMessage, setReviewMessage] = useState('')
  const [reviewError, setReviewError] = useState('')

  // ✅ Fetch tour from database
  useEffect(() => {
    const fetchTour = async () => {
      setLoading(true)
      setError(null)

      try {
        console.log('🔄 Fetching tour:', resolvedParams.slug)

        const response = await fetch(`/api/tours/${resolvedParams.slug}`)

        console.log('📡 API Response status:', response.status)

        if (!response.ok) {
          if (response.status === 404) {
            console.log('❌ Tour not found in database')
            setTour(null)
            return
          }

          // ✅ FIX: لا تفترض أنه JSON دائماً (قد يرجع HTML/فارغ)
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
          console.log('✅ Tour loaded:', result.data.title)
          setTour(result.data)
        } else {
          throw new Error(result.error || 'Failed to fetch tour')
        }
      } catch (err) {
        console.error('❌ Error fetching tour:', err)
        setError(err.message)
        setTour(null)
      } finally {
        setLoading(false)
      }
    }

    if (resolvedParams.slug) {
      fetchTour()
    }
  }, [resolvedParams.slug])

  // Translations helper
  const tt = useCallback((key, fallback) => {
    try {
      const v = t?.(key)
      if (!v || v === key) return fallback
      return v
    } catch {
      return fallback
    }
  }, [t])

  const labels = useMemo(() => {
    return {
      home: tt('nav.home', isAr ? 'الرئيسية' : 'Home'),
      tours: tt('nav.tours', isAr ? 'الرحلات' : 'Tours'),
      featured: tt('tours.featured', isAr ? 'مميز' : 'Featured'),
      discount: tt('tours.discount', isAr ? 'خصم' : 'OFF'),
      days: tt('tours.days', isAr ? 'أيام' : 'days'),

      highlightsTitle: tt('tourDetails.highlights', isAr ? 'أبرز المعالم' : 'Highlights'),
      includedTitle: tt('tourDetails.included', isAr ? 'ما يشمله السعر' : "What's Included"),
      notIncludedTitle: tt('tourDetails.notIncluded', isAr ? 'ما لا يشمله السعر' : 'Not Included'),

      save: tt('tours.save', isAr ? 'وفر' : 'Save'),
      perPerson: tt('tours.perPerson', isAr ? '/ للشخص' : '/ per person'),
      taxesNote: tt('tourDetails.taxesIncluded', isAr ? 'الأسعار شاملة جميع الضرائب' : 'Prices include all taxes'),

      bookWhatsapp: tt('tourDetails.bookWhatsapp', isAr ? 'احجز عبر واتساب' : 'Book on WhatsApp'),
      emailUs: tt('tourDetails.emailUs', isAr ? 'راسلنا عبر الإيميل' : 'Email Us'),

      instantBooking: tt('tourDetails.instantBooking', isAr ? 'حجز فوري مضمون' : 'Instant booking guaranteed'),
      support: tt('tourDetails.support', isAr ? 'دعم 24/7' : '24/7 Support'),

      backToTours: tt('tourDetails.backToTours', isAr ? 'العودة لجميع الرحلات' : 'Back to all tours'),
      reviewSectionTitle: isAr ? 'التقييمات' : 'Reviews',
      reviewSectionSubtitle: isAr ? 'شاركنا رأيك عن هذه الرحلة' : 'Share your feedback about this tour',
      reviewSubmit: isAr ? 'إرسال التقييم' : 'Submit Review',
      reviewPending: isAr ? 'تم إرسال تقييمك وسيتم مراجعته قبل النشر' : 'Your review was submitted and will be reviewed before publishing',
      reviewRequired: isAr ? 'يرجى تعبئة الحقول المطلوبة' : 'Please fill the required fields',
      reviewInvalidEmail: isAr ? 'البريد الإلكتروني غير صالح' : 'Invalid email address'
    }
  }, [isAr, tt])

  const handleReviewSubmit = async (e) => {
    e.preventDefault()
    setReviewError('')
    setReviewMessage('')

    const name = reviewForm.name.trim()
    const email = reviewForm.email.trim()
    const comment = reviewForm.comment.trim()
    const rating = Number(reviewForm.rating)
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

    if (!name || !email || !comment || !rating) {
      setReviewError(labels.reviewRequired)
      return
    }

    if (!emailValid) {
      setReviewError(labels.reviewInvalidEmail)
      return
    }

    if (!tour?.id) {
      setReviewError(isAr ? 'تعذر تحديد الرحلة' : 'Unable to determine tour')
      return
    }

    setReviewSubmitting(true)
    try {
      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tourId: tour.id,
          name,
          email,
          rating,
          title: reviewForm.title.trim(),
          comment
        })
      })

      const data = await response.json().catch(() => null)
      if (!response.ok || !data?.success) {
        throw new Error(data?.error || 'Failed to submit review')
      }

      setReviewMessage(labels.reviewPending)
      setReviewForm({ name: '', email: '', title: '', comment: '', rating: 5 })
    } catch (err) {
      setReviewError(err.message || (isAr ? 'فشل إرسال التقييم' : 'Failed to submit review'))
    } finally {
      setReviewSubmitting(false)
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // ✅ Loading State
  // ═══════════════════════════════════════════════════════════════
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-8 border-green-200 dark:border-green-800 border-t-green-600 dark:border-t-green-400 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {tt('loading', isAr ? 'جاري التحميل...' : 'Loading...')}
          </h2>
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════════
  // ✅ Tour Not Found
  // ═══════════════════════════════════════════════════════════════
  if (!tour && !loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="mb-8 animate-bounce">
            <svg className="w-32 h-32 mx-auto text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {tt('tourDetails.notFoundTitle', isAr ? 'الرحلة غير موجودة' : 'Tour Not Found')}
          </h1>

          <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
            {tt('tourDetails.notFoundDesc', isAr ? 'عذراً، الرحلة التي تبحث عنها غير متوفرة' : 'Sorry, the tour you are looking for is not available')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/tours"
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-4 rounded-xl font-bold hover:from-green-600 hover:to-emerald-700 transition-all shadow-lg"
            >
              {tt('tourDetails.viewAllTours', isAr ? 'عرض جميع الرحلات' : 'View All Tours')}
            </Link>
            <Link
              href="/"
              className="border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 px-8 py-4 rounded-xl font-bold transition-all"
            >
              {tt('nav.home', isAr ? 'الصفحة الرئيسية' : 'Home')}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // ═══════════════════════════════════════════════════════════════
  // ✅ Data Mapping from Database
  // ═══════════════════════════════════════════════════════════════
  const title = isAr ? (tour.titleAr || tour.title) : (tour.title || tour.titleAr)
  const description = isAr ? (tour.descriptionAr || tour.description) : (tour.description || tour.descriptionAr)

  // Clean HTML from description
  const shortDesc = description
    .replace(/<[^>]*>/g, '')
    .substring(0, 150)
    .trim() + (description.length > 150 ? '...' : '')

  const hasDiscount = tour.discount && tour.discount > 0
  const discountPercent = Math.round(tour.discount || 0)
  const finalPrice = hasDiscount
    ? tour.price - (tour.price * tour.discount / 100)
    : tour.price

  // Images
  const coverImage = tour.coverImage ||
    (tour.images && tour.images.length > 0 ? tour.images[0] : null) ||
    '/img/default-tour.jpg'

  // Arrays (ensure they exist)
  const includes = tour.includes || []
  const excludes = tour.excludes || []

  // Features
  const featuresList = isAr ? (tour.featuresAr || tour.features) : (tour.features || tour.featuresAr)
  const features = Array.isArray(featuresList) ? featuresList : []

  // WhatsApp text
  const whatsappText = isAr
    ? `مرحباً! أريد حجز رحلة: ${title}`
    : `Hi! I'd like to book the tour: ${title}`

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Hero */}
        <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={coverImage}
              alt={title}
              fill
              className="object-cover"
              priority
              quality={90}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/60 to-black/40" />
          </div>

          <div className="relative h-full flex items-end">
            <div className="container mx-auto px-4 max-w-7xl pb-12">
              <div className="max-w-4xl">
                <nav className="mb-6 flex items-center gap-2 text-white/80 text-sm">
                  <Link href="/" className="hover:text-white transition-colors">
                    {labels.home}
                  </Link>
                  <span>/</span>
                  <Link href="/tours" className="hover:text-white transition-colors">
                    {labels.tours}
                  </Link>
                  <span>/</span>
                  <span className="text-white">{title}</span>
                </nav>

                <div className="flex flex-wrap gap-3 mb-6">
                  {tour.featured && (
                    <span className="bg-yellow-400 text-gray-900 px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                      ⭐ {labels.featured}
                    </span>
                  )}
                  {hasDiscount && (
                    <span className="bg-red-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
                      {labels.discount} {discountPercent}%
                    </span>
                  )}
                </div>

                <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
                  {title}
                </h1>

                <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed">
                  {shortDesc}
                </p>

                <div className="flex items-center gap-2 text-white/90 mb-6 text-lg">
                  <svg className="w-6 h-6 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>
                    {isAr ? (tour.locationAr || tour.location) : (tour.location || tour.locationAr)}
                  </span>
                </div>

                <div className="flex flex-wrap gap-4">
                  <div className="bg-white/20 backdrop-blur-md px-4 py-3 rounded-xl flex items-center gap-3 border border-white/30">
                    <svg className="w-6 h-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <div className="text-white">
                      <span className="font-bold text-xl">{tour.rating || 5.0}</span>
                      <span className={`text-white/80 text-sm ${isRTL ? 'mr-2' : 'ml-2'}`}>
                        ({tour.reviewsCount || 0})
                      </span>
                    </div>
                  </div>

                  <div className="bg-white/20 backdrop-blur-md px-4 py-3 rounded-xl flex items-center gap-3 text-white border border-white/30">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="font-bold text-lg">
                      {tour.duration || 0} {labels.days}
                    </span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* Main */}
        <section className="py-16">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="grid lg:grid-cols-3 gap-12">
              {/* Left */}
              <div className="lg:col-span-2 space-y-10">

                {/* Description */}
                {description && (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                      {isAr ? 'نبذة عن الرحلة' : 'About This Tour'}
                    </h2>
                    <div
                      className="prose dark:prose-invert max-w-none"
                      dangerouslySetInnerHTML={{ __html: description }}
                    />
                  </div>
                )}

                {/* Features */}
                {features.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                      <span>✨</span>
                      {isAr ? 'مميزات الرحلة' : 'Tour Features'}
                    </h2>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {features.map((item, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-indigo-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-200">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Included */}
                {includes.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                      <span className="text-4xl">✅</span>
                      {labels.includedTitle}
                    </h2>

                    <div className="grid sm:grid-cols-2 gap-3">
                      {includes.map((item, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-200">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Not Included */}
                {excludes.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                      <span className="text-4xl">❌</span>
                      {labels.notIncludedTitle}
                    </h2>

                    <div className="grid sm:grid-cols-2 gap-3">
                      {excludes.map((item, index) => (
                        <div key={index} className="flex items-start gap-3">
                          <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                          <span className="text-gray-700 dark:text-gray-200">{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Video Section */}
                {tour.videoUrl && getYouTubeId(tour.videoUrl) && (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 overflow-hidden">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                      <span>🎥</span>
                      {isAr ? 'فيديو الرحلة' : 'Tour Video'}
                    </h2>
                    <div className="relative pt-[56.25%] rounded-xl overflow-hidden bg-black">
                      <iframe
                        className="absolute inset-0 w-full h-full"
                        src={`https://www.youtube.com/embed/${getYouTubeId(tour.videoUrl)}`}
                        title={title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      />
                    </div>
                  </div>
                )}

                {/* Itinerary Section */}
                {tour.itinerary && Array.isArray(tour.itinerary) && tour.itinerary.length > 0 && (
                  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
                      <span>🗺️</span>
                      {isAr ? 'برنامج الرحلة' : 'Itinerary'}
                    </h2>

                    <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:ml-5 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-green-500 before:via-gray-200 before:to-transparent">
                      {tour.itinerary.map((day, index) => (
                        <div key={index} className="relative flex gap-6 group">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-gray-800 bg-green-500 text-white font-bold shadow-lg shrink-0 z-10 relative">
                            {day.day}
                          </div>

                          <div className="flex-1 bg-gray-50 dark:bg-gray-700/50 p-6 rounded-2xl border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                              {isAr ? (day.titleAr || day.title) : (day.title || day.titleAr)}
                            </h4>
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                              {isAr ? (day.descriptionAr || day.description) : (day.description || day.descriptionAr)}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 sticky top-24">
                  <div className="mb-8 pb-8 border-b-2 border-gray-100 dark:border-gray-700">
                    {hasDiscount && (
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-gray-400 line-through text-xl">${Math.round(tour.price)}</span>
                        <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 text-sm font-bold px-3 py-1 rounded-full">
                          {labels.save} ${Math.round(tour.price - finalPrice)}
                        </span>
                      </div>
                    )}

                    <div className="flex items-baseline gap-3 mb-2">
                      <span className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        ${Math.round(finalPrice)}
                      </span>
                      <span className="text-gray-600 dark:text-gray-300 text-lg">
                        {labels.perPerson}
                      </span>
                    </div>

                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {labels.taxesNote}
                    </p>
                  </div>

                  <div className="space-y-4 mb-8">
                    {/* Book Now Button - PRIMARY */}
                    <button
                      onClick={() => setIsBookingModalOpen(true)}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-5 rounded-xl font-bold text-xl flex items-center justify-center gap-3 shadow-2xl hover:shadow-purple-500/50 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
                    >
                      <span className="text-2xl">✨</span>
                      <span>{isAr ? 'احجز الآن' : 'Book Now'}</span>
                    </button>

                    {/* WhatsApp Button - SECONDARY */}
                    <a
                      href={`https://wa.me/967772371581?text=${encodeURIComponent(whatsappText)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                      </svg>
                      {labels.bookWhatsapp}
                    </a>

                    {/* Email Button - TERTIARY */}
                    <button
                      onClick={() => setIsModalOpen(true)}
                      className="w-full border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all hover:border-green-500 hover:text-green-600 dark:hover:text-green-400"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      {labels.emailUs}
                    </button>
                  </div>

                  <div className="space-y-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>{labels.instantBooking}</span>
                    </div>
                    <div className="flex items-center gap-3 text-sm text-gray-600 dark:text-gray-300">
                      <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span>{labels.support}</span>
                    </div>
                  </div>

                  {/* Location Map (Coordinates) */}
                  {(tour.latitude && tour.longitude) && (
                    <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
                      <h4 className="font-bold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
                        <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {isAr ? 'الموقع على الخريطة' : 'Location Map'}
                      </h4>
                      <a
                        href={`https://www.google.com/maps/search/?api=1&query=${tour.latitude},${tour.longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block w-full h-40 bg-gray-200 dark:bg-gray-700 rounded-xl overflow-hidden relative group"
                      >
                        {/* Static Map Image Placeholder or Interactive Map if API key exists */}
                        {/* Using a simple visual placeholder since we might not have API key */}
                        <div className="absolute inset-0 flex items-center justify-center bg-blue-50 dark:bg-blue-900/20 group-hover:bg-blue-100 transition-colors">
                          <span className="text-blue-600 font-semibold flex items-center gap-1">
                            ↗ {isAr ? 'فتح في خرائط جوجل' : 'Open in Google Maps'}
                          </span>
                        </div>
                      </a>
                    </div>
                  )}

                </div>
              </div>
            </div>

            <div className="mt-16 text-center">
              <Link
                href="/tours"
                className="inline-flex items-center gap-3 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 font-bold text-lg transition-colors group"
              >
                {isRTL ? (
                  <svg className="w-6 h-6 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 5l7 7-7 7m-8 14l7-7-7-7" />
                  </svg>
                )}
                {labels.backToTours}
              </Link>
            </div>
          </div>
        </section>

        {tour?.reviews && tour.reviews.length > 0 && (
          <ReviewsSection
            reviews={tour.reviews}
            avgRating={tour.rating}
            totalReviews={tour.reviewsCount}
          />
        )}

        <section className="py-16 bg-gray-50/50 dark:bg-gray-900/50">
          <div className="container mx-auto px-4 max-w-5xl">
            <div className="text-center mb-10">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-3">
                {labels.reviewSectionTitle}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 text-lg">
                {labels.reviewSectionSubtitle}
              </p>
            </div>

            <form onSubmit={handleReviewSubmit} className="bg-white dark:bg-gray-800 rounded-3xl p-6 md:p-10 shadow-xl border border-gray-100 dark:border-gray-700">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">
                    {isAr ? 'الاسم' : 'Name'}
                  </label>
                  <input
                    type="text"
                    value={reviewForm.name}
                    onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border-2 border-transparent focus:border-blue-500 transition-all"
                    placeholder={isAr ? 'اكتب اسمك الكامل' : 'Your full name'}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">
                    {isAr ? 'البريد الإلكتروني' : 'Email'}
                  </label>
                  <input
                    type="email"
                    value={reviewForm.email}
                    onChange={(e) => setReviewForm({ ...reviewForm, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border-2 border-transparent focus:border-blue-500 transition-all"
                    placeholder={isAr ? 'name@example.com' : 'name@example.com'}
                    required
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mt-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">
                    {isAr ? 'عنوان التقييم' : 'Review Title'}
                  </label>
                  <input
                    type="text"
                    value={reviewForm.title}
                    onChange={(e) => setReviewForm({ ...reviewForm, title: e.target.value })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border-2 border-transparent focus:border-blue-500 transition-all"
                    placeholder={isAr ? 'اختياري' : 'Optional'}
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">
                    {isAr ? 'التقييم' : 'Rating'}
                  </label>
                  <select
                    value={reviewForm.rating}
                    onChange={(e) => setReviewForm({ ...reviewForm, rating: Number(e.target.value) })}
                    className="w-full px-4 py-3 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border-2 border-transparent focus:border-blue-500 transition-all"
                  >
                    {[5, 4, 3, 2, 1].map((value) => (
                      <option key={value} value={value}>
                        {value} {isAr ? 'نجوم' : 'Stars'}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">
                  {isAr ? 'اكتب تقييمك' : 'Your Review'}
                </label>
                <textarea
                  rows={5}
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  className="w-full px-4 py-3 rounded-2xl bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white border-2 border-transparent focus:border-blue-500 transition-all"
                  placeholder={isAr ? 'شاركنا تجربتك...' : 'Share your experience...'}
                  required
                />
              </div>

              {reviewError && (
                <div className="mt-4 text-red-600 font-semibold">
                  {reviewError}
                </div>
              )}
              {reviewMessage && (
                <div className="mt-4 text-green-600 font-semibold">
                  {reviewMessage}
                </div>
              )}

              <div className="mt-8 flex justify-end">
                <button
                  type="submit"
                  disabled={reviewSubmitting}
                  className="px-8 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold transition-colors disabled:opacity-60"
                >
                  {reviewSubmitting ? (isAr ? 'جارٍ الإرسال...' : 'Submitting...') : labels.reviewSubmit}
                </button>
              </div>
            </form>
          </div>
        </section>

        <WhatsAppButton />
      </div>

      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tourTitle={title}
        tourPrice={Math.round(finalPrice)}
      />

      <BookingModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        tour={tour}
      />
    </>
  )
}
