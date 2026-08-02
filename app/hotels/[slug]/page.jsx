'use client'

import { use, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useApp } from '@/contexts/AppContext'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import HotelBookingModal from '@/components/HotelBookingModal'
import { AMENITIES } from '@/utils/hotelConstants'

export default function HotelDetailsPage({ params }) {
  const { locale } = useApp()
  const isAr = locale === 'ar'
  const { slug } = use(params)
  const searchParams = useSearchParams()

  const [hotel, setHotel] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showBooking, setShowBooking] = useState(false)

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(`/api/hotels/${slug}`)
        const data = await res.json()
        if (data.success) {
          setHotel(data.data)
        } else {
          const message = data.details ? `${data.error} - ${data.details}` : data.error
          setError(message || 'Hotel not found')
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchHotel()
  }, [slug])

  useEffect(() => {
    if (searchParams?.get('book') === '1') {
      setShowBooking(true)
    }
  }, [searchParams])

  const images = useMemo(() => {
    if (!hotel) return []
    const list = [hotel.coverImage, ...(hotel.images || [])].filter(Boolean)
    return Array.from(new Set(list))
  }, [hotel])

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-24 w-24 border-8 border-emerald-200 dark:border-emerald-800 border-t-emerald-600 dark:border-t-emerald-400 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isAr ? 'جاري تحميل التفاصيل...' : 'Loading details...'}
          </h2>
        </div>
      </div>
    )
  }

  if (error || !hotel) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center p-6">
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-10 text-center shadow-xl max-w-lg">
          <div className="text-5xl mb-4">🏨</div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-3">
            {isAr ? 'لم يتم العثور على الفندق' : 'Hotel not found'}
          </h2>
          <p className="mb-6">{error || (isAr ? 'حاول مرة أخرى لاحقا' : 'Please try again later')}</p>
          <Link
            href="/hotels"
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold shadow-lg"
          >
            {isAr ? 'العودة للفنادق' : 'Back to hotels'}
          </Link>
        </div>
      </div>
    )
  }

  const name = isAr ? hotel.nameAr : hotel.name
  const location = isAr ? hotel.locationAr : hotel.location
  const description = isAr ? hotel.descriptionAr : hotel.description
  const shortDescription = isAr ? hotel.shortDescriptionAr : hotel.shortDescription
  const amenities = isAr && hotel.amenitiesAr?.length ? hotel.amenitiesAr : hotel.amenities
  const highlights = isAr && hotel.highlightsAr?.length ? hotel.highlightsAr : hotel.highlights
  const cancellationPolicy = isAr ? hotel.cancellationPolicyAr : hotel.cancellationPolicy
  const finalPrice = hotel.discount
    ? Math.round(hotel.pricePerNight - (hotel.pricePerNight * hotel.discount) / 100)
    : hotel.pricePerNight

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={hotel.coverImage || '/img/hero/socotra-1.jpg'}
            alt={name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/70" />
        </div>
        <div className="relative container-custom mx-auto px-4 pt-40 pb-24 text-white">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-3 rounded-full bg-white/10 px-5 py-2 text-sm font-semibold border border-white/20">
              <span className="text-lg">🏨</span>
              {isAr ? 'تجربة إقامة فاخرة' : 'Luxury Stay Experience'}
            </div>
            <h1 className="mt-6 text-4xl md:text-5xl font-black">{name}</h1>
            <p className="mt-4 text-white/80 text-lg">{shortDescription || description}</p>
            <div className="mt-6 flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 text-white/90 font-semibold">
                <span>📍</span>
                <span>{location}</span>
              </div>
              <div className="flex items-center gap-2 text-white/90 font-semibold">
                <span>★</span>
                <span>{hotel.rating}</span>
                <span className="text-white/70 text-sm">({hotel.reviewsCount})</span>
              </div>
              <div className="flex items-center gap-2 text-white/90 font-semibold">
                <span>👑</span>
                <span>{hotel.featured ? (isAr ? 'مميز' : 'Featured') : (isAr ? 'فاخر' : 'Luxury')}</span>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <button
                onClick={() => setShowBooking(true)}
                className="px-7 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-black shadow-2xl hover:shadow-3xl transition-all"
              >
                {isAr ? 'احجز إقامة فاخرة' : 'Request luxury booking'}
              </button>
              <Link
                href="/hotels"
                className="px-7 py-4 rounded-2xl bg-white/10 text-white font-bold border border-white/20 hover:bg-white/20 transition-all"
              >
                {isAr ? 'عودة للفنادق' : 'Back to hotels'}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container-custom mx-auto px-4 -mt-12 relative z-10">
        <div className="grid lg:grid-cols-[2fr_1fr] gap-8">
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-8 shadow-xl"
            >
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-4">
                {isAr ? 'وصف الفندق' : 'Hotel overview'}
              </h2>
              <p className="text-base">{description}</p>
            </motion.div>

            {images.length > 0 && (
              <div className="grid md:grid-cols-2 gap-4">
                {images.slice(0, 4).map((img) => (
                  <div key={img} className="relative h-64 rounded-3xl overflow-hidden shadow-lg">
                    <Image src={img} alt={name} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}

            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-lg">
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-4">
                  {isAr ? 'المميزات الفاخرة' : 'Luxury highlights'}
                </h3>
                <div className="grid gap-3">
                  {(highlights || []).slice(0, 6).map((item) => (
                    <div key={item} className="flex items-center gap-3 text-gray-700 dark:text-gray-200 font-semibold">
                      <span className="w-8 h-8 rounded-2xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">✨</span>
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-lg">
                <h3 className="text-xl font-black text-gray-900 dark:text-white mb-4">
                  {isAr ? 'الخدمات' : 'Amenities'}
                </h3>
                <div className="grid gap-3">
                  {(amenities || []).slice(0, 6).map((item) => {
                    const amenityObj = AMENITIES.find(a => a.id === item)
                    const label = amenityObj ? amenityObj.label[locale] : item
                    const icon = amenityObj ? amenityObj.icon : '💎'
                    return (
                      <div key={item} className="flex items-center gap-3 text-gray-700 dark:text-gray-200 font-semibold">
                        <span className="w-8 h-8 rounded-2xl bg-cyan-500/10 text-cyan-600 flex items-center justify-center">{icon}</span>
                        <span>{label}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-xl">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{isAr ? 'السعر لليلة' : 'Price per night'}</div>
                  <div className="text-3xl font-black text-emerald-600">${finalPrice}</div>
                  {hotel.discount ? (
                    <div className="text-sm text-gray-400 line-through">${hotel.pricePerNight}</div>
                  ) : null}
                </div>
                <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                  {isAr ? 'عدد الغرف' : 'Rooms'}
                  <div className="text-lg font-bold text-gray-900 dark:text-white">{hotel.roomsCount}</div>
                </div>
              </div>
              <div className="mt-5 space-y-3 text-sm text-gray-600 dark:text-gray-300">
                <div className="flex items-center justify-between">
                  <span>{isAr ? 'تسجيل الوصول' : 'Check-in'}</span>
                  <span className="font-semibold">{hotel.checkInTime || (isAr ? '2:00 مساءً' : '2:00 PM')}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span>{isAr ? 'تسجيل المغادرة' : 'Check-out'}</span>
                  <span className="font-semibold">{hotel.checkOutTime || (isAr ? '12:00 ظهرًا' : '12:00 PM')}</span>
                </div>
              </div>
              <button
                onClick={() => setShowBooking(true)}
                className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 px-6 py-4 text-white font-black shadow-lg hover:shadow-2xl transition-all"
              >
                {isAr ? 'طلب حجز فاخر' : 'Request luxury booking'}
              </button>
            </div>

            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-xl">
              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-4">
                {isAr ? 'سياسة الإلغاء' : 'Cancellation policy'}
              </h3>
              <p className="text-sm">
                {cancellationPolicy || (isAr ? 'يمكنك الإلغاء مجاناً قبل 48 ساعة من الوصول.' : 'Free cancellation up to 48 hours before arrival.')}
              </p>
            </div>

            <div className="bg-gradient-to-br from-emerald-700 via-cyan-700 to-blue-800 rounded-3xl p-6 text-white shadow-2xl border border-white/15">
              <h3 className="text-xl font-black mb-2">{isAr ? 'كونسيرج VIP' : 'VIP concierge'}</h3>
              <p className="text-white/95 text-sm">
                {isAr ? 'احصل على ترقية غرفة وخدمات حصرية بمجرد تواصلك معنا.' : 'Unlock room upgrades and exclusive perks with our VIP team.'}
              </p>
              <Link
                href="/contact"
                className="mt-4 inline-flex w-full items-center justify-center rounded-2xl bg-white text-gray-900 px-5 py-3 font-black shadow-xl hover:shadow-2xl hover:scale-[1.01] transition-all"
              >
                {isAr ? 'تواصل الآن' : 'Contact now'}
              </Link>
            </div>
          </div>
        </div>
      </section>
      <HotelBookingModal isOpen={showBooking} onClose={() => setShowBooking(false)} hotel={hotel} />
    </div>
  )
}
