'use client'

import { use, useEffect, useMemo, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { useApp } from '@/contexts/AppContext'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import CarBookingModal from '@/components/CarBookingModal'

export default function CarDetailsPage({ params }) {
  const { locale } = useApp()
  const isAr = locale === 'ar'
  const { slug } = use(params)
  const searchParams = useSearchParams()

  const [car, setCar] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showBooking, setShowBooking] = useState(false)

  useEffect(() => {
    const fetchCar = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(`/api/cars/${slug}`)
        const data = await res.json()
        if (data.success) {
          setCar(data.data)
        } else {
          const message = data.details ? `${data.error} - ${data.details}` : data.error
          setError(message || 'Car not found')
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchCar()
  }, [slug])

  useEffect(() => {
    if (searchParams?.get('book') === '1') {
      setShowBooking(true)
    }
  }, [searchParams])

  const images = useMemo(() => {
    if (!car) return []
    const list = [car.coverImage, ...(car.images || [])].filter(Boolean)
    return Array.from(new Set(list))
  }, [car])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-24 w-24 border-8 border-indigo-200 dark:border-indigo-800 border-t-indigo-600 dark:border-t-indigo-400 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isAr ? 'جاري تحميل التفاصيل...' : 'Loading Details...'}
          </h2>
        </div>
      </div>
    )
  }

  if (error || !car) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-6">
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2rem] p-10 text-center shadow-xl max-w-lg">
          <div className="text-6xl mb-4">🚗</div>
          <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-3">
            {isAr ? 'لم يتم العثور على السيارة' : 'Car Not Found'}
          </h2>
          <p className="mb-8 text-gray-600 dark:text-gray-400">{error || (isAr ? 'عذراً، ربما تم إزالة هذه السيارة.' : 'Sorry, this car may have been removed.')}</p>
          <Link
            href="/cars"
            className="px-8 py-4 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-bold shadow-lg hover:shadow-2xl transition-all inline-block"
          >
            {isAr ? 'العودة للأسطول' : 'Back to Fleet'}
          </Link>
        </div>
      </div>
    )
  }

  const name = isAr ? car.nameAr : car.name
  const description = isAr ? car.descriptionAr : car.description
  const brand = car.brand || ''
  const finalPrice = car.discount
    ? Math.round(car.pricePerDay - (car.pricePerDay * car.discount) / 100)
    : car.pricePerDay
  const features = isAr ? car.featuresAr : car.features

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
      {/* Hero Header */}
      <section className="relative overflow-hidden min-h-[75vh] flex items-end pb-24">
        <div className="absolute inset-0">
          <Image
            src={car.coverImage || '/img/default-car.jpg'}
            alt={name}
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/80 to-black/40" />
        </div>
        
        <div className="relative container-custom mx-auto px-4 z-10 w-full">
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/20 text-indigo-300 font-bold uppercase tracking-widest text-xs border border-indigo-400/30 backdrop-blur-md shadow-lg mb-6">
                <span>{brand}</span>
                {car.year && <span>• {car.year}</span>}
              </div>
              
              <h1 className="text-white text-5xl md:text-6xl lg:text-7xl font-black leading-tight tracking-tight mb-6">
                {name}
              </h1>

              <div className="flex flex-wrap items-center gap-6 text-white/90">
                <div className="flex items-center gap-2 font-bold text-lg bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md">
                  <span className="text-indigo-400">🏷️</span>
                  <span>{car.type}</span>
                </div>
                {car.featured && (
                  <div className="flex items-center gap-2 font-bold text-lg bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border border-yellow-500/30 px-4 py-2 rounded-xl backdrop-blur-md text-yellow-400">
                    <span>👑</span>
                    <span>{isAr ? 'سيارة مميزة' : 'Featured Premium'}</span>
                  </div>
                )}
                {car.rating > 0 && (
                   <div className="flex items-center gap-2 font-bold text-lg bg-white/10 px-4 py-2 rounded-xl backdrop-blur-md">
                   <span className="text-yellow-400">★</span>
                   <span>{car.rating}</span>
                   <span className="text-white/60 text-sm">({car.reviewsCount})</span>
                 </div>
                )}
              </div>

              <div className="mt-10 flex flex-wrap gap-4">
                <button
                  onClick={() => setShowBooking(true)}
                  className="px-8 py-5 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-black text-lg shadow-[0_10px_30px_rgba(99,102,241,0.4)] hover:shadow-indigo-500/50 hover:scale-105 active:scale-95 transition-all"
                >
                  {isAr ? 'احجز هذه السيارة' : 'Book This Car'}
                </button>
                <Link
                  href="/cars"
                  className="px-8 py-5 rounded-2xl bg-white/10 text-white font-bold border border-white/20 hover:bg-white/20 hover:backdrop-blur-xl transition-all"
                >
                  {isAr ? 'استكشف سيارات أخرى' : 'Explore More Cars'}
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Main Details Area */}
      <section className="container-custom mx-auto px-4 -mt-16 relative z-20">
        <div className="grid lg:grid-cols-[2fr_1.1fr] gap-8">
          
          {/* Left Column (Details) */}
          <div className="space-y-8">
            
            {/* Quick Specs */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2rem] p-8 shadow-2xl flex items-center justify-between flex-wrap gap-6"
            >
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center text-2xl shadow-sm">
                  💺
                </div>
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">{isAr ? 'المقاعد' : 'Seats'}</div>
                  <div className="text-xl font-black text-gray-900 dark:text-white">{car.seats}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center text-2xl shadow-sm">
                  🚪
                </div>
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">{isAr ? 'الأبواب' : 'Doors'}</div>
                  <div className="text-xl font-black text-gray-900 dark:text-white">{car.doors}</div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center text-2xl shadow-sm">
                  ⚙️
                </div>
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">{isAr ? 'ناقل الحركة' : 'Transmission'}</div>
                  <div className="text-xl font-black text-gray-900 dark:text-white">
                    {car.transmission === 'Automatic' ? (isAr ? 'أوتوماتيك' : 'Auto') : (isAr ? 'عادي' : 'Manual')}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center text-2xl shadow-sm">
                  ⛽
                </div>
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider">{isAr ? 'الوقود' : 'Fuel'}</div>
                  <div className="text-xl font-black text-gray-900 dark:text-white">
                     {car.fuelType === 'Petrol' ? (isAr ? 'بنزين' : 'Petrol') : car.fuelType === 'Diesel' ? (isAr ? 'ديزل' : 'Diesel') : car.fuelType}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Professional Rental Terms */}
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2rem] p-8 shadow-sm space-y-6">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white flex items-center gap-3">
                <span className="text-indigo-500">📋</span>
                {isAr ? 'شروط ومعلومات الاستئجار' : 'Rental Conditions & Info'}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 font-bold mb-1">{isAr ? 'إيداع التأمين' : 'Security Deposit'}</div>
                  <div className="text-lg font-black text-gray-900 dark:text-white">${car.deposit || 0}</div>
                  <div className="text-xs text-gray-400 mt-1">{isAr ? '(مسترد عند التسليم)' : '(Refundable at drop-off)'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 font-bold mb-1">{isAr ? 'المسافة المسموحة (كم)' : 'Mileage Limit'}</div>
                  <div className="text-lg font-black text-gray-900 dark:text-white">{(isAr ? car.mileageAr : car.mileage) || (isAr ? 'غير محدود' : 'Unlimited')}</div>
                </div>

                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 font-bold mb-1">{isAr ? 'العمر الأدنى' : 'Minimum Age'}</div>
                  <div className="text-lg font-black text-gray-900 dark:text-white">{car.minAge || 21}+ {isAr ? 'سنة' : 'Years'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 font-bold mb-1">{isAr ? 'اللون الخارجي' : 'Exterior Color'}</div>
                  <div className="text-lg font-black text-gray-900 dark:text-white">{(isAr ? car.colorAr : car.color) || '-'}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 font-bold mb-1">{isAr ? 'سعة الحقائب' : 'Luggage'}</div>
                  <div className="text-lg font-black text-gray-900 dark:text-white">{car.luggage || 2} {isAr ? 'حقائب' : 'Bags'}</div>
                </div>
              </div>
            </div>

            {/* Overview */}
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2rem] p-8 shadow-sm">
              <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                <span className="text-indigo-500">📝</span>
                {isAr ? 'نظرة عامة' : 'Vehicle Overview'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 leading-loose text-lg whitespace-pre-line">
                {description}
              </p>
            </div>

            {/* Gallery */}
            {images.length > 0 && (
              <div className="grid md:grid-cols-2 gap-4">
                {images.slice(0, 4).map((img, idx) => (
                  <div key={idx} className="relative h-72 rounded-[2rem] overflow-hidden shadow-md group">
                    <Image src={img} alt={`${name} - ${idx}`} fill className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500" />
                  </div>
                ))}
              </div>
            )}

            {/* Features */}
            {features && features.length > 0 && (
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2rem] p-8 shadow-sm">
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-6 flex items-center gap-3">
                  <span className="text-indigo-500">✨</span>
                  {isAr ? 'ميزات السيارة' : 'Key Features'}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {features.map((feature, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-gray-700 dark:text-gray-300 font-bold p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 transition-colors hover:border-indigo-200 dark:hover:border-indigo-800/50">
                      <span className="w-8 h-8 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-sm shadow-sm">✔</span>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column (Pricing & Details) */}
          <div className="space-y-6 sticky top-28 self-start">
            
            {/* Pricing Card */}
            <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2rem] p-8 shadow-2xl">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <div className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1">{isAr ? 'سعر الإيجار لليوم' : 'Rental Rate Per Day'}</div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-indigo-600 dark:text-indigo-400 leading-none">
                      ${finalPrice}
                    </span>
                  </div>
                  {car.discount > 0 && (
                    <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-900/20 text-rose-600 dark:text-rose-400 text-sm font-bold">
                      <span className="line-through opacity-70">${car.pricePerDay}</span>
                      <span>وفر {car.discount}%</span>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-4 pt-6 border-t border-gray-100 dark:border-gray-800">

                <div className="flex items-center justify-between text-gray-700 dark:text-gray-300 text-sm font-semibold p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                  <span className="flex items-center gap-2">🚗 {isAr ? 'الكيلومترات:' : 'Mileage:'} {(isAr ? car.mileageAr : car.mileage) || (isAr ? 'غير محدود' : 'Unlimited')}</span>
                  <span className="text-emerald-500">✔</span>
                </div>
                <div className="flex items-center justify-between text-gray-700 dark:text-gray-300 text-sm font-semibold p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                  <span className="flex items-center gap-2">👨‍✈️ {isAr ? 'سائق خاص متوفر' : 'Private Driver Available'}</span>
                  <span className="text-emerald-500">✔</span>
                </div>
              </div>

              <button
                onClick={() => setShowBooking(true)}
                className="mt-8 w-full block rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-5 text-white font-black text-lg text-center shadow-[0_10px_30px_rgba(99,102,241,0.3)] hover:shadow-[0_15px_40px_rgba(99,102,241,0.4)] hover:scale-[1.02] active:scale-95 transition-all"
              >
                {isAr ? 'تأكيد الحجز فوراً' : 'Book Instantly'}
              </button>
              
              <div className="mt-4 text-center">
                 <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                   {isAr ? 'إلغاء مجاني متاح. لا تدفع الآن.' : 'Free cancellation available. No payment required now.'}
                 </p>
              </div>
            </div>

            {/* VIP Support Card */}
            <div className="bg-gray-900 dark:bg-black rounded-[2rem] p-8 text-white shadow-xl relative overflow-hidden">
               <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500 rounded-full blur-[50px] opacity-40" />
               <div className="relative z-10">
                 <h3 className="text-2xl font-black mb-3 text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300">
                   {isAr ? 'دعم كونسيرج 24/7' : '24/7 Concierge'}
                 </h3>
                 <p className="text-white/80 text-sm mb-6 leading-relaxed">
                   {isAr 
                    ? 'هل لديك متطلبات خاصة؟ مثل ترتيب سيارة الزفاف، الاستقبال الخاص في المطار، أو باقات شهر العسل للسيارات.' 
                    : 'Have special requirements? Like wedding car arrangements, private airport pickup, or honeymoon vehicle packages.'}
                 </p>
                 <Link
                   href="/contact"
                   className="inline-flex w-full items-center justify-center rounded-xl bg-white/10 border border-white/20 text-white px-5 py-3.5 font-bold hover:bg-white hover:text-gray-900 transition-all text-sm shadow-xl"
                 >
                   {isAr ? 'تواصل مع الدعم الخاص' : 'Contact VIP Support'}
                 </Link>
               </div>
            </div>

          </div>
        </div>
      </section>

      <CarBookingModal isOpen={showBooking} onClose={() => setShowBooking(false)} car={car} />
    </div>
  )
}
