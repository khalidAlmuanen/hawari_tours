'use client'

// ═══════════════════════════════════════════════════════════════════════
// 📄 ملف: app/tours/[slug]/page.jsx
// الوصف: صفحة تفاصيل الرحلة مع نظام إرسال إيميل احترافي
// ═══════════════════════════════════════════════════════════════════════

import Image from 'next/image'
import Link from 'next/link'
import { use, useMemo, useState } from 'react'
import { getTourBySlug } from '@/data/tours-complete'
import WhatsAppButton from '@/components/WhatsAppButton'
import ContactModal from '@/components/ContactModal'
import { useApp } from '@/contexts/AppContext'

export default function TourDetailsPage({ params }) {
  const { locale, t, isRTL, isDark } = useApp()
  const isAr = locale === 'ar'

  // Next.js 15 params
  const resolvedParams = use(params)
  const tour = getTourBySlug(resolvedParams.slug)

  const [isModalOpen, setIsModalOpen] = useState(false)

  const tt = (key, fallback) => {
    try {
      const v = t?.(key)
      if (!v || v === key) return fallback
      return v
    } catch {
      return fallback
    }
  }

  const pick = (obj, fallbackAr, fallbackEn) => {
    if (!obj) return isAr ? fallbackAr : fallbackEn
    return obj[locale] || obj.en || obj.ar || (isAr ? fallbackAr : fallbackEn)
  }

  // لو ما لقى الرحلة
  if (!tour) {
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

  const hasDiscount = tour.originalPrice && tour.originalPrice > tour.price
  const discountPercent = hasDiscount ? Math.round(((tour.originalPrice - tour.price) / tour.originalPrice) * 100) : 0

  const title = pick(tour.title, 'رحلة سياحية', 'Tour')
  const shortDesc = pick(tour.shortDesc, 'رحلة مميزة في سقطرى', 'A great trip in Socotra')
  const highlights = (tour.highlights?.[locale] || tour.highlights?.en || tour.highlights?.ar || [])
  const included = (tour.included?.[locale] || tour.included?.en || tour.included?.ar || [])
  const notIncluded = (tour.notIncluded?.[locale] || tour.notIncluded?.en || tour.notIncluded?.ar || [])

  const labels = useMemo(() => {
    return {
      home: tt('nav.home', isAr ? 'الرئيسية' : 'Home'),
      tours: tt('nav.tours', isAr ? 'الرحلات' : 'Tours'),
      featured: tt('tours.featured', isAr ? 'مميز' : 'Featured'),
      discount: tt('tours.discount', isAr ? 'خصم' : 'OFF'),
      days: tt('tours.days', isAr ? 'أيام' : 'days'),

      highlightsTitle: tt('tourDetails.highlights', isAr ? 'أبرز المعالم' : 'Highlights'),
      includedTitle: tt('tourDetails.included', isAr ? 'ما يشمله السعر' : 'What’s Included'),
      notIncludedTitle: tt('tourDetails.notIncluded', isAr ? 'ما لا يشمله السعر' : 'Not Included'),

      save: tt('tours.save', isAr ? 'وفر' : 'Save'),
      perPerson: tt('tours.perPerson', isAr ? '/ للشخص' : '/ per person'),
      taxesNote: tt('tourDetails.taxesIncluded', isAr ? 'الأسعار شاملة جميع الضرائب' : 'Prices include all taxes'),

      bookWhatsapp: tt('tourDetails.bookWhatsapp', isAr ? 'احجز عبر واتساب' : 'Book on WhatsApp'),
      emailUs: tt('tourDetails.emailUs', isAr ? 'راسلنا عبر الإيميل' : 'Email Us'),

      instantBooking: tt('tourDetails.instantBooking', isAr ? 'حجز فوري مضمون' : 'Instant booking guaranteed'),
      support: tt('tourDetails.support', isAr ? 'دعم 24/7' : '24/7 Support'),

      backToTours: tt('tourDetails.backToTours', isAr ? 'العودة لجميع الرحلات' : 'Back to all tours')
    }
  }, [locale])

  // نص واتساب
  const whatsappText = isAr
    ? `مرحباً! أريد حجز رحلة: ${title}`
    : `Hi! I’d like to book the tour: ${title}`

  return (
    <>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Hero */}
        <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
          <div className="absolute inset-0">
            <Image
              src={tour.images?.main || '/img/default-tour.jpg'}
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
                      {tour.duration?.days || 0} {labels.days}
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

                {/* Highlights */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <span className="text-4xl">✨</span>
                    {labels.highlightsTitle}
                  </h2>

                  <div className="grid sm:grid-cols-2 gap-4">
                    {highlights.map((highlight, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/10 p-4 rounded-xl border border-green-100 dark:border-green-800/30"
                      >
                        <svg className="w-6 h-6 text-green-600 dark:text-green-300 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                        <span className="text-gray-700 dark:text-gray-200 font-medium leading-relaxed">
                          {highlight}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Included */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <span className="text-4xl">✅</span>
                    {labels.includedTitle}
                  </h2>

                  <div className="grid sm:grid-cols-2 gap-3">
                    {included.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-200">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Not Included */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
                  <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                    <span className="text-4xl">❌</span>
                    {labels.notIncludedTitle}
                  </h2>

                  <div className="grid sm:grid-cols-2 gap-3">
                    {notIncluded.map((item, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="w-2 h-2 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-200">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 sticky top-24">
                  <div className="mb-8 pb-8 border-b-2 border-gray-100 dark:border-gray-700">
                    {hasDiscount && (
                      <div className="flex items-center gap-3 mb-2">
                        <span className="text-gray-400 line-through text-xl">${tour.originalPrice}</span>
                        <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-300 text-sm font-bold px-3 py-1 rounded-full">
                          {labels.save} ${tour.originalPrice - tour.price}
                        </span>
                      </div>
                    )}

                    <div className="flex items-baseline gap-3 mb-2">
                      <span className="text-5xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        ${tour.price}
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
                    <a
                      href={`https://wa.me/967772371581?text=${encodeURIComponent(whatsappText)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-3 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1"
                    >
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                      </svg>
                      {labels.bookWhatsapp}
                    </a>

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

        <WhatsAppButton />
      </div>

      <ContactModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        tourTitle={title}
        tourPrice={tour.price}
      />
    </>
  )
}
