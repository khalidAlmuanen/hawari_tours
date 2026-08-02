'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { motion } from 'framer-motion'
import { useApp } from '@/contexts/AppContext'

import { AMENITIES } from '@/utils/hotelConstants'

const EXPERIENCES = [
  {
    titleAr: 'خدمة مضيف خاص 24/7', titleEn: 'Private host 24/7',
    descAr: 'تنسيق حجوزاتك وتنقلاتك بلمسة شخصية', descEn: 'Personalized concierge for every detail',
    icon: '✨'
  },
  {
    titleAr: 'جلسات عشاء على الشاطئ', titleEn: 'Beachfront dining',
    descAr: 'قوائم مصممة خصيصا بإطلالة ساحرة', descEn: 'Custom menus with cinematic views',
    icon: '🍽️'
  },
  {
    titleAr: 'تجارب سبا صحية', titleEn: 'Wellness spa rituals',
    descAr: 'جلسات استرخاء بمواد طبيعية محلية', descEn: 'Signature treatments with local essences',
    icon: '🫧'
  }
]

const DEFAULT_SETTINGS = {
  heroImage: '/img/hero/socotra-3.jpg',
  heroBadgeAr: 'حجز فنادق فاخرة في سقطرى',
  heroBadgeEn: 'Luxury Hotel Booking in Socotra',
  heroTitleAr: 'تجربة إقامة مبهرة بتفاصيل ملكية',
  heroTitleEn: 'A Royal Stay Crafted with Luxury',
  heroSubtitleAr: 'اختر غرفتك المثالية مع عروض حصرية، خدمات خاصة، وتجارب مصممة بعناية لكل رحلة.',
  heroSubtitleEn: 'Choose your perfect suite with exclusive offers, private services, and curated experiences.',
  primaryButtonAr: 'احجز الآن',
  primaryButtonEn: 'Book Now',
  primaryButtonLink: '/contact',
  secondaryButtonAr: 'استكشف الجولات',
  secondaryButtonEn: 'Explore Tours',
  secondaryButtonLink: '/tours',
  stats: [
    { value: '28+', labelAr: 'فنادق فاخرة', labelEn: 'Luxury Hotels' },
    { value: '4.8', labelAr: 'متوسط التقييم', labelEn: 'Avg Rating' },
    { value: '24/7', labelAr: 'خدمة VIP', labelEn: 'VIP Service' }
  ],
  searchTitleAr: 'بحث ذكي عن الفندق',
  searchTitleEn: 'Smart Hotel Search',
  searchButtonAr: 'عرض الخيارات الفاخرة',
  searchButtonEn: 'Show Luxury Options',
  searchHintLeftAr: 'حجز فوري مضمون',
  searchHintLeftEn: 'Instant booking guaranteed',
  searchHintRightAr: 'دعم 24/7',
  searchHintRightEn: '24/7 Support',
  filtersTitleAr: 'فلترة فاخرة',
  filtersTitleEn: 'Luxury Filters',
  experiences: EXPERIENCES,
  vipTitleAr: 'خدمة حجز VIP عبر فريقنا',
  vipTitleEn: 'VIP Booking Concierge',
  vipDescriptionAr: 'نوفر لك تفاوض على أفضل الأسعار، ترقية الغرف، وتجهيزات استثنائية لرحلتك القادمة.',
  vipDescriptionEn: 'We secure exclusive rates, room upgrades, and bespoke arrangements for your next escape.',
  vipPrimaryButtonAr: 'تواصل مع المستشار',
  vipPrimaryButtonEn: 'Talk to Concierge',
  vipPrimaryButtonLink: '/contact',
  vipSecondaryButtonAr: 'أضف جولة فاخرة',
  vipSecondaryButtonEn: 'Add a luxury tour',
  vipSecondaryButtonLink: '/tours'
}

export default function HotelsPage() {
  const { locale } = useApp()
  const isAr = locale === 'ar'

  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [search, setSearch] = useState('')
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setCheckOut] = useState('')
  const [guests, setGuests] = useState(2)
  const [rooms, setRooms] = useState(1)
  const [budget, setBudget] = useState(1000)
  const [minRating, setMinRating] = useState(0)
  const [sortBy, setSortBy] = useState('recommended')
  const [amenities, setAmenities] = useState([])
  const [showFilters, setShowFilters] = useState(false)
  const [pageSettings, setPageSettings] = useState(DEFAULT_SETTINGS)

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch('/api/hotels', { cache: 'no-store' })
        const data = await res.json()
        if (data.success) {
          setHotels(data.data || [])
        } else {
          const message = data.details ? `${data.error} - ${data.details}` : data.error
          setError(message || 'Failed to fetch hotels')
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchHotels()
  }, [])

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/hotels/settings', { cache: 'no-store' })
        const data = await res.json()
        if (data.success && data.data) {
          const merged = {
            ...DEFAULT_SETTINGS,
            ...data.data,
            stats: Array.isArray(data.data.stats) ? data.data.stats : DEFAULT_SETTINGS.stats,
            experiences: Array.isArray(data.data.experiences) ? data.data.experiences : DEFAULT_SETTINGS.experiences
          }
          setPageSettings(merged)
        }
      } catch (err) {
        setPageSettings(DEFAULT_SETTINGS)
      }
    }
    fetchSettings()
  }, [])

  const toggleAmenity = (id) => {
    setAmenities((prev) => (prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]))
  }

  const filteredHotels = useMemo(() => {
    let result = [...hotels]
    const keyword = search.trim().toLowerCase()

    if (keyword) {
      result = result.filter((hotel) => {
        const name = isAr ? hotel.nameAr : hotel.name
        const location = isAr ? hotel.locationAr : hotel.location
        return (
          name.toLowerCase().includes(keyword) ||
          location.toLowerCase().includes(keyword)
        )
      })
    }

    if (amenities.length) {
      result = result.filter((hotel) => amenities.every((a) => (hotel.amenities || []).includes(a)))
    }

    result = result.filter((hotel) => hotel.pricePerNight <= budget && hotel.rating >= minRating)

    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => {
          const priceA = a.discount ? a.pricePerNight - (a.pricePerNight * a.discount / 100) : a.pricePerNight
          const priceB = b.discount ? b.pricePerNight - (b.pricePerNight * b.discount / 100) : b.pricePerNight
          return priceA - priceB
        })
        break
      case 'price-high':
        result.sort((a, b) => {
          const priceA = a.discount ? a.pricePerNight - (a.pricePerNight * a.discount / 100) : a.pricePerNight
          const priceB = b.discount ? b.pricePerNight - (b.pricePerNight * b.discount / 100) : b.pricePerNight
          return priceB - priceA
        })
        break
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      default:
        result.sort((a, b) => (b.rating + b.reviewsCount / 100) - (a.rating + a.reviewsCount / 100))
        break
    }

    return result
  }, [hotels, search, amenities, budget, minRating, sortBy, isAr])

  const FiltersPanel = () => (
    <>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white">
          {isAr ? pageSettings.filtersTitleAr : pageSettings.filtersTitleEn}
        </h2>
        <span className="text-sm font-semibold text-emerald-600">
          {filteredHotels.length} {isAr ? 'نتيجة' : 'results'}
        </span>
      </div>

      <div className="space-y-6">
        <div>
          <div className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-3">
            {isAr ? 'أقصى سعر لليلة' : 'Max price per night'}
          </div>
          <div className="flex items-center justify-between text-sm font-bold text-gray-900 dark:text-white mb-2">
            <span>${budget}</span>
            <span>$50 - $1000</span>
          </div>
          <input
            type="range"
            min={50}
            max={1000}
            value={budget}
            onChange={(e) => setBudget(Number(e.target.value))}
            className="w-full accent-emerald-500"
          />
        </div>

        <div>
          <div className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-3">
            {isAr ? 'الحد الأدنى للتقييم' : 'Minimum rating'}
          </div>
          <select
            value={minRating}
            onChange={(e) => setMinRating(Number(e.target.value))}
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold"
          >
            <option value={0}>{isAr ? 'الكل' : 'All'}</option>
            <option value={4.0}>{isAr ? '4.0 وما فوق' : '4.0 and up'}</option>
            <option value={4.2}>{isAr ? '4.2 وما فوق' : '4.2 and up'}</option>
            <option value={4.5}>{isAr ? '4.5 وما فوق' : '4.5 and up'}</option>
            <option value={4.7}>{isAr ? '4.7 وما فوق' : '4.7 and up'}</option>
            <option value={4.9}>{isAr ? '4.9 وما فوق' : '4.9 and up'}</option>
          </select>
        </div>

        <div>
          <div className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-3">
            {isAr ? 'ترتيب النتائج' : 'Sort by'}
          </div>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold"
          >
            <option value="recommended">{isAr ? 'الأكثر تميزا' : 'Recommended'}</option>
            <option value="rating">{isAr ? 'الأعلى تقييما' : 'Top rated'}</option>
            <option value="price-low">{isAr ? 'الأقل سعرا' : 'Lowest price'}</option>
            <option value="price-high">{isAr ? 'الأعلى سعرا' : 'Highest price'}</option>
          </select>
        </div>

        <div>
          <div className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-4">
            {isAr ? 'الخدمات الفاخرة' : 'Premium amenities'}
          </div>
          <div className="grid gap-3">
            {AMENITIES.map((item) => (
              <button
                key={item.id}
                onClick={() => toggleAmenity(item.id)}
                className={`flex items-center justify-between px-4 py-3 rounded-2xl border transition-all ${amenities.includes(item.id)
                  ? 'bg-emerald-500 text-white border-emerald-500 shadow-lg'
                  : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-emerald-400'
                  }`}
              >
                <span className="flex items-center gap-3 font-semibold">
                  <span className="text-lg">{item.icon}</span>
                  {item.label[locale]}
                </span>
                <span className={`w-3 h-3 rounded-full ${amenities.includes(item.id) ? 'bg-white' : 'bg-gray-300 dark:bg-gray-600'}`} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  )

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-24 w-24 border-8 border-emerald-200 dark:border-emerald-800 border-t-emerald-600 dark:border-t-emerald-400 mx-auto mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {isAr ? 'جاري تحميل الفنادق...' : 'Loading hotels...'}
          </h2>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center p-6">
        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-10 text-center shadow-xl max-w-lg">
          <div className="text-5xl mb-4">⚠️</div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-3">
            {isAr ? 'تعذر تحميل الفنادق' : 'Unable to load hotels'}
          </h2>
          <p className="mb-6">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold shadow-lg"
          >
            {isAr ? 'إعادة المحاولة' : 'Retry'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src={pageSettings.heroImage || DEFAULT_SETTINGS.heroImage}
            alt="Luxury Hotels"
            fill
            priority
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-gray-950/80 via-gray-900/65 to-black/80" />
        </div>

        <div className="relative container-custom mx-auto px-4 pt-40 pb-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-3 bg-white/10 text-white px-6 py-3 rounded-full border border-white/20 backdrop-blur-md">
                <span className="text-lg">🏨</span>
                <span className="font-semibold">
                  {isAr ? pageSettings.heroBadgeAr : pageSettings.heroBadgeEn}
                </span>
              </div>
              <h1 className="text-white text-4xl md:text-5xl lg:text-6xl font-black mt-6 leading-tight">
                {isAr ? pageSettings.heroTitleAr : pageSettings.heroTitleEn}
              </h1>
              <p className="text-white/80 text-lg mt-6 max-w-xl">
                {isAr ? pageSettings.heroSubtitleAr : pageSettings.heroSubtitleEn}
              </p>
              <div className="flex flex-wrap gap-4 mt-8">
                <Link
                  href={pageSettings.primaryButtonLink || '/contact'}
                  className="px-7 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-black shadow-2xl hover:shadow-3xl hover:scale-[1.02] transition-all"
                >
                  {isAr ? pageSettings.primaryButtonAr : pageSettings.primaryButtonEn}
                </Link>
                <Link
                  href={pageSettings.secondaryButtonLink || '/tours'}
                  className="px-7 py-4 rounded-2xl bg-white/10 text-white font-bold border border-white/20 hover:bg-white/20 transition-all"
                >
                  {isAr ? pageSettings.secondaryButtonAr : pageSettings.secondaryButtonEn}
                </Link>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-10">
                {(Array.isArray(pageSettings.stats) ? pageSettings.stats : DEFAULT_SETTINGS.stats).map((stat, index) => (
                  <div key={stat.labelEn || index} className="bg-white/10 border border-white/15 rounded-2xl px-5 py-4 backdrop-blur-md">
                    <div className="text-white text-2xl font-black">{stat.value}</div>
                    <div className="text-white/70 text-sm font-semibold">{isAr ? stat.labelAr : stat.labelEn}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-3xl p-6 shadow-2xl"
            >
              <div className="text-white text-xl font-black mb-6">
                {isAr ? pageSettings.searchTitleAr : pageSettings.searchTitleEn}
              </div>
              <div className="grid gap-4">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={isAr ? 'ابحث عن اسم الفندق أو الموقع' : 'Search hotel or location'}
                  className="w-full px-4 py-3 rounded-2xl bg-white/15 text-white placeholder:text-white/70 border border-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                />
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-white/70 text-sm mb-2">{isAr ? 'تاريخ الوصول' : 'Check-in'}</div>
                    <input
                      type="date"
                      value={checkIn}
                      onChange={(e) => setCheckIn(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-white/15 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>
                  <div>
                    <div className="text-white/70 text-sm mb-2">{isAr ? 'تاريخ المغادرة' : 'Check-out'}</div>
                    <input
                      type="date"
                      value={checkOut}
                      onChange={(e) => setCheckOut(e.target.value)}
                      className="w-full px-4 py-3 rounded-2xl bg-white/15 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-white/70 text-sm mb-2">{isAr ? 'عدد الضيوف' : 'Guests'}</div>
                    <input
                      type="number"
                      min={1}
                      max={12}
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="w-full px-4 py-3 rounded-2xl bg-white/15 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>
                  <div>
                    <div className="text-white/70 text-sm mb-2">{isAr ? 'عدد الغرف' : 'Rooms'}</div>
                    <input
                      type="number"
                      min={1}
                      max={6}
                      value={rooms}
                      onChange={(e) => setRooms(Number(e.target.value))}
                      className="w-full px-4 py-3 rounded-2xl bg-white/15 text-white border border-white/20 focus:outline-none focus:ring-2 focus:ring-emerald-400"
                    />
                  </div>
                </div>
                <button className="w-full px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-black shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all">
                  {isAr ? pageSettings.searchButtonAr : pageSettings.searchButtonEn}
                </button>
                <div className="flex items-center justify-between text-white/80 text-sm">
                  <span>{isAr ? pageSettings.searchHintLeftAr : pageSettings.searchHintLeftEn}</span>
                  <span>{isAr ? pageSettings.searchHintRightAr : pageSettings.searchHintRightEn}</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>

        {showFilters && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              onClick={() => setShowFilters(false)}
            />
            <div className="absolute inset-x-0 bottom-0 max-h-[85vh] rounded-t-3xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 shadow-2xl overflow-hidden">
              <div className="p-5 overflow-y-auto max-h-[85vh]">
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{isAr ? pageSettings.filtersTitleAr : pageSettings.filtersTitleEn}</div>
                    <div className="text-2xl font-black text-gray-900 dark:text-white">
                      {filteredHotels.length} {isAr ? 'نتيجة' : 'results'}
                    </div>
                  </div>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200 flex items-center justify-center"
                  >
                    ✕
                  </button>
                </div>
                <FiltersPanel />
                <button
                  onClick={() => setShowFilters(false)}
                  className="mt-6 w-full px-6 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-black shadow-xl"
                >
                  {isAr ? 'تطبيق الفلاتر' : 'Apply filters'}
                </button>
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="container-custom mx-auto px-4 -mt-12 relative z-10">
        <div className="grid lg:grid-cols-[1.1fr_2fr] gap-8">
          <div className="hidden lg:block bg-white dark:bg-gray-900 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 p-6 sticky top-28 h-fit">
            <FiltersPanel />
          </div>

          <div className="space-y-10">
            <div className="lg:hidden bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-4 shadow-lg flex items-center justify-between">
              <div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{isAr ? 'النتائج' : 'Results'}</div>
                <div className="text-xl font-black text-gray-900 dark:text-white">
                  {filteredHotels.length} {isAr ? 'فندق' : 'Hotels'}
                </div>
              </div>
              <button
                onClick={() => setShowFilters(true)}
                className="px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-black shadow-lg"
              >
                {isAr ? pageSettings.filtersTitleAr : pageSettings.filtersTitleEn}
              </button>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {(Array.isArray(pageSettings.experiences) ? pageSettings.experiences : DEFAULT_SETTINGS.experiences).map((item, index) => (
                <div key={item.titleEn || index} className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-xl">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 text-white flex items-center justify-center text-xl mb-4">
                    {item.icon}
                  </div>
                  <h3 className="text-lg font-black text-gray-900 dark:text-white mb-2">{isAr ? item.titleAr : item.titleEn}</h3>
                  <p className="text-sm">{isAr ? item.descAr : item.descEn}</p>
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
              {filteredHotels.map((hotel) => {
                const badgeLabel = hotel.featured
                  ? (isAr ? 'مميز' : 'Featured')
                  : hotel.rating >= 4.8
                    ? (isAr ? 'فاخر' : 'Luxury')
                    : (isAr ? 'مختار' : 'Select')
                const imageSrc = hotel.coverImage || hotel.images?.[0] || '/img/hero/socotra-1.jpg'
                const finalPrice = hotel.discount
                  ? Math.round(hotel.pricePerNight - (hotel.pricePerNight * hotel.discount) / 100)
                  : hotel.pricePerNight

                return (
                  <div key={hotel.id} className="group bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all">
                    <div className="relative h-56 overflow-hidden">
                      <Image src={imageSrc} alt={hotel.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      <div className="absolute top-4 left-4 px-4 py-2 rounded-full bg-white/90 text-gray-900 text-xs font-black">
                        {badgeLabel}
                      </div>
                      <div className="absolute bottom-4 left-4">
                        <div className="flex items-center gap-2 text-white font-semibold">
                          <span className="text-lg">★</span>
                          <span>{hotel.rating}</span>
                          <span className="text-white/70 text-sm">({hotel.reviewsCount})</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-6 space-y-4">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-black text-gray-900 dark:text-white">
                            {isAr ? hotel.nameAr : hotel.name}
                          </h3>
                          <div className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                            {isAr ? hotel.locationAr : hotel.location}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-black text-emerald-600">${finalPrice}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{isAr ? 'لليلة' : 'per night'}</div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {(hotel.amenities || []).slice(0, 4).map((tag) => (
                          <span key={tag} className="px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs font-semibold text-gray-600 dark:text-gray-300">
                            {AMENITIES.find((item) => item.id === tag)?.label?.[locale] || tag}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/hotels/${hotel.slug}?book=1`}
                          className="flex-1 px-5 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-black shadow-lg hover:shadow-xl transition-all text-center"
                        >
                          {isAr ? 'حجز فوري' : 'Instant Book'}
                        </Link>
                        <Link
                          href={`/hotels/${hotel.slug}`}
                          className="px-5 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-semibold hover:border-emerald-400 transition-all"
                        >
                          {isAr ? 'تفاصيل' : 'Details'}
                        </Link>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="bg-gradient-to-r from-emerald-600 via-cyan-600 to-blue-700 rounded-3xl p-8 text-white shadow-2xl">
              <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8 items-center">
                <div>
                  <h3 className="text-3xl font-black mb-3">{isAr ? pageSettings.vipTitleAr : pageSettings.vipTitleEn}</h3>
                  <p className="text-white/95">{isAr ? pageSettings.vipDescriptionAr : pageSettings.vipDescriptionEn}</p>
                </div>
                <div className="flex flex-col gap-4">
                  <Link
                    href={pageSettings.vipPrimaryButtonLink || '/contact'}
                    className="px-6 py-4 rounded-2xl bg-white text-gray-900 font-black text-center shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all"
                  >
                    {isAr ? pageSettings.vipPrimaryButtonAr : pageSettings.vipPrimaryButtonEn}
                  </Link>
                  <Link
                    href={pageSettings.vipSecondaryButtonLink || '/tours'}
                    className="px-6 py-4 rounded-2xl bg-white/15 border border-white/40 text-white font-semibold text-center hover:bg-white/25 transition-all"
                  >
                    {isAr ? pageSettings.vipSecondaryButtonAr : pageSettings.vipSecondaryButtonEn}
                  </Link>
                </div>
              </div>
            </div>

            {filteredHotels.length === 0 && (
              <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-10 text-center shadow-lg">
                <div className="text-5xl mb-4">🌟</div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
                  {isAr ? 'لا توجد نتائج مطابقة' : 'No matching results'}
                </h3>
                <p>
                  {isAr
                    ? 'جرّب تغيير نطاق السعر أو اختيار خدمات مختلفة للوصول إلى خيارات فاخرة أكثر.'
                    : 'Try adjusting price range or amenities to see more luxury options.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
