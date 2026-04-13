'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useApp } from '@/contexts/AppContext'
import AdminLayout from '@/components/admin/AdminLayout'
import { useToast } from '@/components/admin/Toast'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { exportData, EXPORT_FORMATS } from '@/components/admin'
import ImageUploader from '@/components/admin/ImageUploader'

const STATUS_STYLES = {
  ACTIVE: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
  DRAFT: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
  SUSPENDED: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300'
}

const DEFAULT_PAGE_SETTINGS = {
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
  experiences: [
    { titleAr: 'خدمة مضيف خاص 24/7', titleEn: 'Private host 24/7', descAr: 'تنسيق حجوزاتك وتنقلاتك بلمسة شخصية', descEn: 'Personalized concierge for every detail', icon: '✨' },
    { titleAr: 'جلسات عشاء على الشاطئ', titleEn: 'Beachfront dining', descAr: 'قوائم مصممة خصيصا بإطلالة ساحرة', descEn: 'Custom menus with cinematic views', icon: '🍽️' },
    { titleAr: 'تجارب سبا صحية', titleEn: 'Wellness spa rituals', descAr: 'جلسات استرخاء بمواد طبيعية محلية', descEn: 'Signature treatments with local essences', icon: '🫧' }
  ],
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

export default function AdminHotelsPage() {
  const { locale } = useApp()
  const { success, error: showError } = useToast()
  const isAr = locale === 'ar'
  const router = useRouter()

  const [hotels, setHotels] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('featured')
  const [showExportMenu, setShowExportMenu] = useState(false)
  const [showCreateModal, setShowCreateModal] = useState(false)
  const [savingCreate, setSavingCreate] = useState(false)
  const [deletingId, setDeletingId] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [createData, setCreateData] = useState({
    name: '',
    nameAr: '',
    description: '',
    descriptionAr: '',
    pricePerNight: '',
    location: '',
    locationAr: '',
    roomsCount: '',
    coverImage: ''
  })
  const [showSettingsModal, setShowSettingsModal] = useState(false)
  const [savingSettings, setSavingSettings] = useState(false)
  const [pageSettings, setPageSettings] = useState(DEFAULT_PAGE_SETTINGS)
  const [newStat, setNewStat] = useState({ value: '', labelAr: '', labelEn: '' })
  const [newExperience, setNewExperience] = useState({ titleAr: '', titleEn: '', descAr: '', descEn: '', icon: '' })

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true)
        setError(null)
        const params = new URLSearchParams()
        if (search) params.set('search', search)
        if (statusFilter !== 'all') params.set('status', statusFilter)
        if (sortBy) {
          params.set('sortBy', sortBy === 'price' ? 'pricePerNight' : (sortBy === 'reviews' ? 'reviewsCount' : sortBy))
          params.set('sortOrder', 'desc')
        }
        const res = await fetch(`/api/admin/hotels?${params.toString()}`, { cache: 'no-store' })
        const data = await res.json()
        if (data.success) {
          setHotels(data.data.hotels || [])
        } else {
          setError(data.error || 'Failed to fetch hotels')
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchHotels()
  }, [search, statusFilter, sortBy])

  const stats = useMemo(() => {
    const total = hotels.length
    const active = hotels.filter((hotel) => hotel.status === 'ACTIVE').length
    const featured = hotels.filter((hotel) => hotel.featured).length
    const avgRating = hotels.length
      ? (hotels.reduce((sum, h) => sum + h.rating, 0) / hotels.length).toFixed(1)
      : '0.0'

    return { total, active, featured, avgRating }
  }, [hotels])

  const filteredHotels = useMemo(() => {
    let result = [...hotels]
    const keyword = search.trim().toLowerCase()

    if (keyword) {
      result = result.filter((hotel) => {
        const name = isAr ? hotel.nameAr : hotel.name
        const location = isAr ? hotel.locationAr : hotel.location
        return name.toLowerCase().includes(keyword) || location.toLowerCase().includes(keyword)
      })
    }

    if (statusFilter !== 'all') {
      result = result.filter((hotel) => hotel.status === statusFilter)
    }

    switch (sortBy) {
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      case 'price':
        result.sort((a, b) => b.pricePerNight - a.pricePerNight)
        break
      case 'reviews':
        result.sort((a, b) => b.reviewsCount - a.reviewsCount)
        break
      default:
        result.sort((a, b) => Number(b.featured) - Number(a.featured))
        break
    }

    return result
  }, [hotels, search, statusFilter, sortBy, isAr])

  const updateHotel = async (id, payload) => {
    const res = await fetch('/api/admin/hotels', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, ...payload })
    })
    const data = await res.json()
    if (!data.success) {
      throw new Error(data.error || 'Failed to update hotel')
    }
    return data.data
  }

  const toggleFeatured = async (id) => {
    const target = hotels.find((hotel) => hotel.id === id)
    if (!target) return
    const next = !target.featured
    try {
      const updated = await updateHotel(id, { featured: next })
      setHotels((prev) => prev.map((hotel) => (hotel.id === id ? updated : hotel)))
    } catch (err) {
      setError(err.message)
    }
  }

  const toggleStatus = async (id) => {
    const target = hotels.find((hotel) => hotel.id === id)
    if (!target) return
    const nextStatus = target.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'
    try {
      const updated = await updateHotel(id, { status: nextStatus })
      setHotels((prev) => prev.map((hotel) => (hotel.id === id ? updated : hotel)))
    } catch (err) {
      setError(err.message)
    }
  }

  const confirmDelete = async () => {
    if (!deletingId) return
    setIsDeleting(true)
    try {
      const res = await fetch(`/api/admin/hotels?id=${deletingId}`, { method: 'DELETE' })
      const data = await res.json()
      if (data.success) {
        success(isAr ? 'تم حذف الفندق نهائياً' : 'Hotel deleted permanently')
        setHotels((prev) => prev.filter((h) => h.id !== deletingId))
      } else {
        showError(data.error || 'Failed to delete hotel')
      }
    } catch (err) {
      showError(err.message)
    } finally {
      setIsDeleting(false)
      setDeletingId(null)
    }
  }

  const fetchPageSettings = useCallback(async () => {
    try {
      const res = await fetch('/api/hotels/settings')
      const data = await res.json()
      if (data.success && data.data) {
        setPageSettings({
          ...DEFAULT_PAGE_SETTINGS,
          ...data.data,
          stats: Array.isArray(data.data.stats) ? data.data.stats : DEFAULT_PAGE_SETTINGS.stats,
          experiences: Array.isArray(data.data.experiences) ? data.data.experiences : DEFAULT_PAGE_SETTINGS.experiences
        })
      }
    } catch (err) {
      setPageSettings(DEFAULT_PAGE_SETTINGS)
    }
  }, [])

  useEffect(() => {
    fetchPageSettings()
  }, [fetchPageSettings])

  const handleExport = (format) => {
    if (!hotels.length) {
      showError(isAr ? 'لا توجد بيانات للتصدير' : 'No data to export')
      return
    }
    const rows = hotels.map((hotel) => ({
      [isAr ? 'المعرف' : 'ID']: hotel.id,
      [isAr ? 'الاسم' : 'Name']: isAr ? hotel.nameAr : hotel.name,
      [isAr ? 'الموقع' : 'Location']: isAr ? hotel.locationAr : hotel.location,
      [isAr ? 'السعر لليلة' : 'Price per night']: hotel.pricePerNight,
      [isAr ? 'الحالة' : 'Status']: hotel.status,
      [isAr ? 'مميز' : 'Featured']: hotel.featured ? (isAr ? 'نعم' : 'Yes') : (isAr ? 'لا' : 'No'),
      [isAr ? 'التقييم' : 'Rating']: hotel.rating,
      [isAr ? 'عدد المراجعات' : 'Reviews']: hotel.reviewsCount
    }))
    exportData(rows, format, `hotels_export_${new Date().toISOString().slice(0, 10)}`)
    success(isAr ? 'تم تصدير البيانات بنجاح' : 'Data exported successfully')
    setShowExportMenu(false)
  }

  const handleCreateHotel = async (e) => {
    e.preventDefault()
    setSavingCreate(true)
    try {
      const response = await fetch('/api/admin/hotels', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(createData)
      })
      const result = await response.json()
      if (result.success) {
        success(isAr ? 'تم إنشاء الفندق بنجاح' : 'Hotel created successfully')
        setShowCreateModal(false)
        setCreateData({
          name: '',
          nameAr: '',
          description: '',
          descriptionAr: '',
          pricePerNight: '',
          roomsCount: '',
          location: '',
          locationAr: '',
          coverImage: ''
        })
        router.push(`/admin/hotels/${result.data.id}`)
      } else {
        showError(result.error || (isAr ? 'فشل إنشاء الفندق' : 'Failed to create hotel'))
      }
    } catch (err) {
      showError(isAr ? 'حدث خطأ' : 'An error occurred')
    } finally {
      setSavingCreate(false)
    }
  }

  const handleSaveSettings = async (e) => {
    e.preventDefault()
    setSavingSettings(true)
    try {
      const response = await fetch('/api/hotels/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(pageSettings)
      })
      const result = await response.json()
      if (result.success) {
        success(isAr ? 'تم تحديث إعدادات الصفحة' : 'Settings updated successfully')
        setShowSettingsModal(false)
        fetchPageSettings()
      } else {
        showError(isAr ? 'فشل تحديث الإعدادات' : 'Failed to update settings')
      }
    } catch (err) {
      showError(isAr ? 'حدث خطأ' : 'An error occurred')
    } finally {
      setSavingSettings(false)
    }
  }

  const addStat = () => {
    if (!newStat.value || (!newStat.labelAr && !newStat.labelEn)) return
    setPageSettings(prev => ({
      ...prev,
      stats: [...(prev.stats || []), newStat]
    }))
    setNewStat({ value: '', labelAr: '', labelEn: '' })
  }

  const removeStat = (idx) => {
    setPageSettings(prev => ({
      ...prev,
      stats: prev.stats.filter((_, i) => i !== idx)
    }))
  }

  const addExperience = () => {
    if (!newExperience.titleAr && !newExperience.titleEn) return
    setPageSettings(prev => ({
      ...prev,
      experiences: [...(prev.experiences || []), newExperience]
    }))
    setNewExperience({ titleAr: '', titleEn: '', descAr: '', descEn: '', icon: '' })
  }

  const removeExperience = (idx) => {
    setPageSettings(prev => ({
      ...prev,
      experiences: prev.experiences.filter((_, i) => i !== idx)
    }))
  }

  const updateStatField = (idx, field, value) => {
    setPageSettings(prev => {
      const statsList = [...(prev.stats || [])]
      statsList[idx] = { ...statsList[idx], [field]: value }
      return { ...prev, stats: statsList }
    })
  }

  const updateExperienceField = (idx, field, value) => {
    setPageSettings(prev => {
      const list = [...(prev.experiences || [])]
      list[idx] = { ...list[idx], [field]: value }
      return { ...prev, experiences: list }
    })
  }

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-24 w-24 border-8 border-emerald-200 dark:border-emerald-800 border-t-emerald-600 dark:border-t-emerald-400 mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isAr ? 'جاري تحميل الفنادق...' : 'Loading hotels...'}
            </h2>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-8 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative rounded-3xl bg-gradient-to-br from-gray-900 via-emerald-900 to-cyan-900 p-10 text-white shadow-2xl z-10"
        >
          {/* Background isolated to handle overflow clipping without hiding dropdowns */}
          <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
            <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-emerald-400/20 blur-3xl" />
            <div className="absolute -left-10 -bottom-10 h-48 w-48 rounded-full bg-cyan-400/20 blur-3xl" />
          </div>

          <div className="relative z-20 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-3 rounded-full bg-white/10 px-5 py-2 text-sm font-semibold">
                <span className="text-lg">🏨</span>
                {isAr ? 'إدارة الفنادق الفاخرة' : 'Luxury Hotels Management'}
              </div>
              <h1 className="mt-5 text-4xl font-black">{isAr ? 'مركز تحكم الفنادق' : 'Hotels Control Center'}</h1>
              <p className="mt-3 text-white/80 max-w-2xl">
                {isAr
                  ? 'تحكم كامل في الفنادق، الأسعار، التقييمات، وعروض VIP بتجربة فاخرة تليق بالعلامة.'
                  : 'Manage prices, ratings, and VIP offers with a premium command interface.'}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 rounded-2xl bg-white text-gray-900 font-black shadow-xl hover:shadow-2xl transition-all"
              >
                {isAr ? 'إضافة فندق فاخر' : 'Add Luxury Hotel'}
              </button>
              <button
                onClick={() => setShowSettingsModal(true)}
                className="px-6 py-3 rounded-2xl border border-white/30 text-white font-semibold hover:bg-white/10 transition-all"
              >
                {isAr ? 'إعدادات الصفحة' : 'Page Settings'}
              </button>
              <div className="relative">
                <button
                  onClick={() => setShowExportMenu(prev => !prev)}
                  className="px-6 py-3 rounded-2xl border border-white/30 text-white font-semibold hover:bg-white/10 transition-all"
                >
                  {isAr ? 'تصدير التقرير' : 'Export Report'}
                </button>
                {showExportMenu && (
                  <div className="absolute z-20 mt-2 w-44 rounded-2xl border border-white/20 bg-white/95 text-gray-900 shadow-2xl backdrop-blur-md overflow-hidden">
                    {EXPORT_FORMATS.map((format) => (
                      <button
                        key={format.value}
                        onClick={() => handleExport(format.value)}
                        className="w-full px-4 py-3 text-sm font-semibold text-left hover:bg-gray-100"
                      >
                        {format.icon} {format.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
          {[
            { label: isAr ? 'إجمالي الفنادق' : 'Total Hotels', value: stats.total, icon: '✨' },
            { label: isAr ? 'الفنادق النشطة' : 'Active Hotels', value: stats.active, icon: '🟢' },
            { label: isAr ? 'فنادق مميزة' : 'Featured', value: stats.featured, icon: '👑' },
            { label: isAr ? 'متوسط التقييم' : 'Avg Rating', value: stats.avgRating, icon: '⭐' }
          ].map((card) => (
            <motion.div
              key={card.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-xl"
            >
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400 font-semibold">{card.label}</div>
                  <div className="text-3xl font-black text-gray-900 dark:text-white mt-2">{card.value}</div>
                </div>
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 text-white flex items-center justify-center text-xl">
                  {card.icon}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div className="flex-1">
              <div className="text-sm font-semibold text-gray-500 dark:text-gray-400 mb-2">
                {isAr ? 'بحث سريع' : 'Quick search'}
              </div>
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={isAr ? 'ابحث باسم الفندق أو الموقع' : 'Search hotel or location'}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
            </div>
            <div className="flex flex-wrap gap-4">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold"
              >
                <option value="all">{isAr ? 'كل الحالات' : 'All statuses'}</option>
                <option value="ACTIVE">{isAr ? 'نشط' : 'Active'}</option>
                <option value="DRAFT">{isAr ? 'مسودة' : 'Draft'}</option>
                <option value="SUSPENDED">{isAr ? 'موقوف' : 'Suspended'}</option>
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold"
              >
                <option value="featured">{isAr ? 'الأولوية' : 'Priority'}</option>
                <option value="rating">{isAr ? 'الأعلى تقييما' : 'Top rating'}</option>
                <option value="price">{isAr ? 'الأعلى سعرا' : 'Highest price'}</option>
                <option value="reviews">{isAr ? 'الأكثر تقييما' : 'Most reviews'}</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <AnimatePresence>
            {filteredHotels.map((hotel, index) => (
              <motion.div
                key={hotel.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden shadow-xl"
              >
                <div className="relative h-56">
                  <Image src={hotel.coverImage || hotel.images?.[0] || '/img/hero/socotra-1.jpg'} alt={hotel.name} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute top-4 left-4 flex gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_STYLES[hotel.status]}`}>
                      {isAr
                        ? hotel.status === 'ACTIVE'
                          ? 'نشط'
                          : hotel.status === 'DRAFT'
                            ? 'مسودة'
                            : 'موقوف'
                        : hotel.status}
                    </span>
                    {hotel.featured && (
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/90 text-gray-900">
                        {isAr ? 'مميز' : 'Featured'}
                      </span>
                    )}
                  </div>
                  <div className="absolute bottom-4 left-4 text-white">
                    <div className="text-lg font-black">{isAr ? hotel.nameAr : hotel.name}</div>
                    <div className="text-sm text-white/80">{isAr ? hotel.locationAr : hotel.location}</div>
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{isAr ? 'السعر لليلة' : 'Price / night'}</div>
                      <div className="text-2xl font-black text-emerald-600">${hotel.pricePerNight}</div>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-2 justify-end text-gray-900 dark:text-white font-bold">
                        <span>★</span>
                        <span>{hotel.rating}</span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {hotel.reviewsCount} {isAr ? 'تقييم' : 'reviews'}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300">
                    <span>{isAr ? 'عدد الغرف' : 'Rooms'}</span>
                    <span className="font-semibold">{hotel.roomsCount}</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <button
                      onClick={() => toggleFeatured(hotel.id)}
                      className={`flex-1 px-4 py-3 rounded-2xl font-semibold transition-all ${hotel.featured
                        ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200'
                        }`}
                    >
                      {hotel.featured ? (isAr ? 'إزالة التمييز' : 'Unfeature') : (isAr ? 'تمييز الفندق' : 'Feature')}
                    </button>
                    <button
                      onClick={() => toggleStatus(hotel.id)}
                      className="flex-1 px-4 py-3 rounded-2xl font-semibold border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-emerald-400 transition-all"
                    >
                      {hotel.status === 'ACTIVE' ? (isAr ? 'إيقاف مؤقت' : 'Pause') : (isAr ? 'تفعيل الفندق' : 'Activate')}
                    </button>
                  </div>
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/hotels/${hotel.slug}`}
                      className="w-full px-4 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold text-center shadow-lg"
                    >
                      {isAr ? 'معاينة التفاصيل' : 'Preview details'}
                    </Link>
                    <Link
                      href={`/admin/hotels/${hotel.id}`}
                      className="w-full px-4 py-3 rounded-2xl border border-emerald-200 dark:border-emerald-700 text-emerald-700 dark:text-emerald-200 font-bold text-center hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                    >
                      {isAr ? 'تحرير' : 'Edit'}
                    </Link>
                    <button
                      onClick={() => setDeletingId(hotel.id)}
                      className="px-4 py-3 rounded-2xl border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 font-bold text-center hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all"
                      title={isAr ? 'حذف الفندق' : 'Delete Hotel'}
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredHotels.length === 0 && (
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-10 text-center shadow-lg">
            <div className="text-5xl mb-4">🏨</div>
            <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
              {isAr ? 'لا توجد فنادق مطابقة' : 'No matching hotels'}
            </h3>
            <p>{isAr ? 'عدّل البحث أو الحالة لإظهار نتائج فاخرة جديدة.' : 'Adjust filters to reveal more luxury stays.'}</p>
          </div>
        )}
        {error && (
          <div className="bg-white dark:bg-gray-900 border border-rose-200 dark:border-rose-800 rounded-3xl p-6 text-center shadow-lg text-rose-600 dark:text-rose-300">
            {error}
          </div>
        )}

        {deletingId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => !isDeleting && setDeletingId(null)} />
            <div className="relative w-full max-w-sm bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden p-6 text-center">
              <div className="w-16 h-16 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-600 flex items-center justify-center text-3xl mx-auto mb-4">
                ⚠️
              </div>
              <h3 className="text-xl font-black text-gray-900 dark:text-white mb-2">
                {isAr ? 'هل أنت متأكد؟' : 'Are you sure?'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 mb-6 text-sm">
                {isAr
                  ? 'سيتم حذف هذا الفندق وجميع بياناته بشكل نهائي. هذا الإجراء لا يمكن التراجع عنه.'
                  : 'This hotel and all its data will be permanently deleted. This action cannot be undone.'}
              </p>
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setDeletingId(null)}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-all"
                >
                  {isAr ? 'إلغاء' : 'Cancel'}
                </button>
                <button
                  type="button"
                  onClick={confirmDelete}
                  disabled={isDeleting}
                  className="flex-1 px-4 py-3 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-bold shadow-lg shadow-rose-500/30 transition-all disabled:opacity-50"
                >
                  {isDeleting ? (isAr ? 'جاري الحذف...' : 'Deleting...') : (isAr ? 'تأكيد الحذف' : 'Delete')}
                </button>
              </div>
            </div>
          </div>
        )}

        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
            <div className="relative w-full max-w-3xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-8 border-b border-gray-100 dark:border-gray-800">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                  {isAr ? 'إضافة فندق فاخر' : 'Add Luxury Hotel'}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {isAr ? 'أدخل البيانات الأساسية ثم أكمل التفاصيل في صفحة التحرير.' : 'Add core details, then complete the full profile in edit page.'}
                </p>
              </div>
              <form onSubmit={handleCreateHotel} className="p-8 space-y-6 max-h-[80vh] overflow-y-auto">
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    value={createData.name}
                    onChange={(e) => setCreateData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder={isAr ? 'اسم الفندق (EN)' : 'Hotel name (EN)'}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                    required
                  />
                  <input
                    value={createData.nameAr}
                    onChange={(e) => setCreateData(prev => ({ ...prev, nameAr: e.target.value }))}
                    placeholder={isAr ? 'اسم الفندق (AR)' : 'Hotel name (AR)'}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    value={createData.location}
                    onChange={(e) => setCreateData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder={isAr ? 'الموقع (EN)' : 'Location (EN)'}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                    required
                  />
                  <input
                    value={createData.locationAr}
                    onChange={(e) => setCreateData(prev => ({ ...prev, locationAr: e.target.value }))}
                    placeholder={isAr ? 'الموقع (AR)' : 'Location (AR)'}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                    required
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <input
                    type="number"
                    value={createData.pricePerNight}
                    onChange={(e) => setCreateData(prev => ({ ...prev, pricePerNight: e.target.value }))}
                    placeholder={isAr ? 'السعر لليلة' : 'Price per night'}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                    required
                  />
                  <input
                    type="number"
                    value={createData.roomsCount}
                    onChange={(e) => setCreateData(prev => ({ ...prev, roomsCount: e.target.value }))}
                    placeholder={isAr ? 'عدد الغرف' : 'Rooms count'}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <textarea
                    value={createData.description}
                    onChange={(e) => setCreateData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder={isAr ? 'وصف الفندق (EN)' : 'Hotel description (EN)'}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white min-h-[120px]"
                    required
                  />
                  <textarea
                    value={createData.descriptionAr}
                    onChange={(e) => setCreateData(prev => ({ ...prev, descriptionAr: e.target.value }))}
                    placeholder={isAr ? 'وصف الفندق (AR)' : 'Hotel description (AR)'}
                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white min-h-[120px]"
                    required
                  />
                </div>
                <ImageUploader
                  value={createData.coverImage}
                  onChange={(value) => setCreateData(prev => ({ ...prev, coverImage: value }))}
                  label={isAr ? 'صورة الغلاف' : 'Cover image'}
                />
                <div className="flex items-center gap-3 justify-end">
                  <button
                    type="button"
                    onClick={() => setShowCreateModal(false)}
                    className="px-6 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-semibold"
                  >
                    {isAr ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={savingCreate}
                    className="px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-black shadow-xl disabled:opacity-60"
                  >
                    {savingCreate ? (isAr ? 'جارٍ الحفظ...' : 'Saving...') : (isAr ? 'حفظ ومتابعة' : 'Save & continue')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showSettingsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSettingsModal(false)} />
            <div className="relative w-full max-w-5xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden">
              <div className="p-8 border-b border-gray-100 dark:border-gray-800">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                  {isAr ? 'إعدادات صفحة الفنادق' : 'Hotels Page Settings'}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {isAr ? 'تحكم كامل في محتوى الصفحة العامة للفنادق.' : 'Full control over the public hotels page content.'}
                </p>
              </div>
              <form onSubmit={handleSaveSettings} className="p-8 space-y-8 max-h-[80vh] overflow-y-auto">
                <div className="grid lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="text-lg font-black text-gray-900 dark:text-white">{isAr ? 'قسم البطل' : 'Hero Section'}</div>
                    <ImageUploader
                      value={pageSettings.heroImage}
                      onChange={(value) => setPageSettings(prev => ({ ...prev, heroImage: value }))}
                      label={isAr ? 'صورة البطل' : 'Hero image'}
                    />
                    <input
                      value={pageSettings.heroBadgeAr}
                      onChange={(e) => setPageSettings(prev => ({ ...prev, heroBadgeAr: e.target.value }))}
                      placeholder={isAr ? 'الشارة (AR)' : 'Badge (AR)'}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                    <input
                      value={pageSettings.heroBadgeEn}
                      onChange={(e) => setPageSettings(prev => ({ ...prev, heroBadgeEn: e.target.value }))}
                      placeholder={isAr ? 'الشارة (EN)' : 'Badge (EN)'}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                    <input
                      value={pageSettings.heroTitleAr}
                      onChange={(e) => setPageSettings(prev => ({ ...prev, heroTitleAr: e.target.value }))}
                      placeholder={isAr ? 'العنوان (AR)' : 'Title (AR)'}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                    <input
                      value={pageSettings.heroTitleEn}
                      onChange={(e) => setPageSettings(prev => ({ ...prev, heroTitleEn: e.target.value }))}
                      placeholder={isAr ? 'العنوان (EN)' : 'Title (EN)'}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                    <textarea
                      value={pageSettings.heroSubtitleAr}
                      onChange={(e) => setPageSettings(prev => ({ ...prev, heroSubtitleAr: e.target.value }))}
                      placeholder={isAr ? 'الوصف (AR)' : 'Subtitle (AR)'}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white min-h-[100px]"
                    />
                    <textarea
                      value={pageSettings.heroSubtitleEn}
                      onChange={(e) => setPageSettings(prev => ({ ...prev, heroSubtitleEn: e.target.value }))}
                      placeholder={isAr ? 'الوصف (EN)' : 'Subtitle (EN)'}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white min-h-[100px]"
                    />
                    <div className="grid md:grid-cols-2 gap-4">
                      <input
                        value={pageSettings.primaryButtonAr}
                        onChange={(e) => setPageSettings(prev => ({ ...prev, primaryButtonAr: e.target.value }))}
                        placeholder={isAr ? 'زر أساسي (AR)' : 'Primary button (AR)'}
                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                      <input
                        value={pageSettings.primaryButtonEn}
                        onChange={(e) => setPageSettings(prev => ({ ...prev, primaryButtonEn: e.target.value }))}
                        placeholder={isAr ? 'زر أساسي (EN)' : 'Primary button (EN)'}
                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                      <input
                        value={pageSettings.primaryButtonLink}
                        onChange={(e) => setPageSettings(prev => ({ ...prev, primaryButtonLink: e.target.value }))}
                        placeholder={isAr ? 'رابط الزر الأساسي' : 'Primary button link'}
                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                      <input
                        value={pageSettings.secondaryButtonAr}
                        onChange={(e) => setPageSettings(prev => ({ ...prev, secondaryButtonAr: e.target.value }))}
                        placeholder={isAr ? 'زر ثانوي (AR)' : 'Secondary button (AR)'}
                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                      <input
                        value={pageSettings.secondaryButtonEn}
                        onChange={(e) => setPageSettings(prev => ({ ...prev, secondaryButtonEn: e.target.value }))}
                        placeholder={isAr ? 'زر ثانوي (EN)' : 'Secondary button (EN)'}
                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                      <input
                        value={pageSettings.secondaryButtonLink}
                        onChange={(e) => setPageSettings(prev => ({ ...prev, secondaryButtonLink: e.target.value }))}
                        placeholder={isAr ? 'رابط الزر الثانوي' : 'Secondary button link'}
                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="text-lg font-black text-gray-900 dark:text-white">{isAr ? 'إحصائيات البطل' : 'Hero Stats'}</div>
                    <div className="space-y-3">
                      {(pageSettings.stats || []).map((stat, idx) => (
                        <div key={`${stat.value}-${idx}`} className="grid md:grid-cols-[1fr_1fr_auto] gap-3 items-center">
                          <input
                            value={stat.value}
                            onChange={(e) => updateStatField(idx, 'value', e.target.value)}
                            placeholder={isAr ? 'القيمة' : 'Value'}
                            className="w-full px-3 py-2 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              value={stat.labelAr}
                              onChange={(e) => updateStatField(idx, 'labelAr', e.target.value)}
                              placeholder={isAr ? 'التسمية (AR)' : 'Label (AR)'}
                              className="w-full px-3 py-2 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                            />
                            <input
                              value={stat.labelEn}
                              onChange={(e) => updateStatField(idx, 'labelEn', e.target.value)}
                              placeholder={isAr ? 'التسمية (EN)' : 'Label (EN)'}
                              className="w-full px-3 py-2 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeStat(idx)}
                            className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300"
                          >
                            ✕
                          </button>
                        </div>
                      ))}
                      <div className="grid md:grid-cols-[1fr_1fr_auto] gap-3 items-center">
                        <input
                          value={newStat.value}
                          onChange={(e) => setNewStat(prev => ({ ...prev, value: e.target.value }))}
                          placeholder={isAr ? 'القيمة' : 'Value'}
                          className="w-full px-3 py-2 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <input
                            value={newStat.labelAr}
                            onChange={(e) => setNewStat(prev => ({ ...prev, labelAr: e.target.value }))}
                            placeholder={isAr ? 'التسمية (AR)' : 'Label (AR)'}
                            className="w-full px-3 py-2 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                          />
                          <input
                            value={newStat.labelEn}
                            onChange={(e) => setNewStat(prev => ({ ...prev, labelEn: e.target.value }))}
                            placeholder={isAr ? 'التسمية (EN)' : 'Label (EN)'}
                            className="w-full px-3 py-2 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={addStat}
                          className="px-4 py-2 rounded-xl bg-emerald-500 text-white font-bold"
                        >
                          {isAr ? 'إضافة' : 'Add'}
                        </button>
                      </div>
                    </div>

                    <div className="text-lg font-black text-gray-900 dark:text-white mt-6">{isAr ? 'منطقة البحث' : 'Search Card'}</div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <input
                        value={pageSettings.searchTitleAr}
                        onChange={(e) => setPageSettings(prev => ({ ...prev, searchTitleAr: e.target.value }))}
                        placeholder={isAr ? 'العنوان (AR)' : 'Title (AR)'}
                        className="w-full px-3 py-2 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                      <input
                        value={pageSettings.searchTitleEn}
                        onChange={(e) => setPageSettings(prev => ({ ...prev, searchTitleEn: e.target.value }))}
                        placeholder={isAr ? 'العنوان (EN)' : 'Title (EN)'}
                        className="w-full px-3 py-2 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                      <input
                        value={pageSettings.searchButtonAr}
                        onChange={(e) => setPageSettings(prev => ({ ...prev, searchButtonAr: e.target.value }))}
                        placeholder={isAr ? 'زر البحث (AR)' : 'Button (AR)'}
                        className="w-full px-3 py-2 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                      <input
                        value={pageSettings.searchButtonEn}
                        onChange={(e) => setPageSettings(prev => ({ ...prev, searchButtonEn: e.target.value }))}
                        placeholder={isAr ? 'زر البحث (EN)' : 'Button (EN)'}
                        className="w-full px-3 py-2 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                      <input
                        value={pageSettings.searchHintLeftAr}
                        onChange={(e) => setPageSettings(prev => ({ ...prev, searchHintLeftAr: e.target.value }))}
                        placeholder={isAr ? 'تلميح يسار (AR)' : 'Hint left (AR)'}
                        className="w-full px-3 py-2 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                      <input
                        value={pageSettings.searchHintLeftEn}
                        onChange={(e) => setPageSettings(prev => ({ ...prev, searchHintLeftEn: e.target.value }))}
                        placeholder={isAr ? 'تلميح يسار (EN)' : 'Hint left (EN)'}
                        className="w-full px-3 py-2 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                      <input
                        value={pageSettings.searchHintRightAr}
                        onChange={(e) => setPageSettings(prev => ({ ...prev, searchHintRightAr: e.target.value }))}
                        placeholder={isAr ? 'تلميح يمين (AR)' : 'Hint right (AR)'}
                        className="w-full px-3 py-2 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                      <input
                        value={pageSettings.searchHintRightEn}
                        onChange={(e) => setPageSettings(prev => ({ ...prev, searchHintRightEn: e.target.value }))}
                        placeholder={isAr ? 'تلميح يمين (EN)' : 'Hint right (EN)'}
                        className="w-full px-3 py-2 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>

                    <div className="text-lg font-black text-gray-900 dark:text-white mt-6">{isAr ? 'عنوان الفلاتر' : 'Filters Title'}</div>
                    <div className="grid md:grid-cols-2 gap-3">
                      <input
                        value={pageSettings.filtersTitleAr}
                        onChange={(e) => setPageSettings(prev => ({ ...prev, filtersTitleAr: e.target.value }))}
                        placeholder={isAr ? 'عنوان الفلاتر (AR)' : 'Filters title (AR)'}
                        className="w-full px-3 py-2 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                      <input
                        value={pageSettings.filtersTitleEn}
                        onChange={(e) => setPageSettings(prev => ({ ...prev, filtersTitleEn: e.target.value }))}
                        placeholder={isAr ? 'عنوان الفلاتر (EN)' : 'Filters title (EN)'}
                        className="w-full px-3 py-2 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="text-lg font-black text-gray-900 dark:text-white">{isAr ? 'تجارب الضيافة' : 'Experiences'}</div>
                  <div className="space-y-3">
                    {(pageSettings.experiences || []).map((exp, idx) => (
                      <div key={`${exp.titleEn}-${idx}`} className="grid lg:grid-cols-[1fr_1fr_auto] gap-3 items-start">
                        <div className="space-y-2">
                          <input
                            value={exp.titleAr}
                            onChange={(e) => updateExperienceField(idx, 'titleAr', e.target.value)}
                            placeholder={isAr ? 'العنوان (AR)' : 'Title (AR)'}
                            className="w-full px-3 py-2 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                          />
                          <input
                            value={exp.titleEn}
                            onChange={(e) => updateExperienceField(idx, 'titleEn', e.target.value)}
                            placeholder={isAr ? 'العنوان (EN)' : 'Title (EN)'}
                            className="w-full px-3 py-2 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                          />
                          <textarea
                            value={exp.descAr}
                            onChange={(e) => updateExperienceField(idx, 'descAr', e.target.value)}
                            placeholder={isAr ? 'الوصف (AR)' : 'Description (AR)'}
                            className="w-full px-3 py-2 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white min-h-[90px]"
                          />
                          <textarea
                            value={exp.descEn}
                            onChange={(e) => updateExperienceField(idx, 'descEn', e.target.value)}
                            placeholder={isAr ? 'الوصف (EN)' : 'Description (EN)'}
                            className="w-full px-3 py-2 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white min-h-[90px]"
                          />
                        </div>
                        <div className="space-y-2">
                          <input
                            value={exp.icon}
                            onChange={(e) => updateExperienceField(idx, 'icon', e.target.value)}
                            placeholder={isAr ? 'أيقونة' : 'Icon'}
                            className="w-full px-3 py-2 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removeExperience(idx)}
                          className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300"
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                    <div className="grid lg:grid-cols-[1fr_1fr_auto] gap-3 items-start">
                      <div className="space-y-2">
                        <input
                          value={newExperience.titleAr}
                          onChange={(e) => setNewExperience(prev => ({ ...prev, titleAr: e.target.value }))}
                          placeholder={isAr ? 'العنوان (AR)' : 'Title (AR)'}
                          className="w-full px-3 py-2 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                        <input
                          value={newExperience.titleEn}
                          onChange={(e) => setNewExperience(prev => ({ ...prev, titleEn: e.target.value }))}
                          placeholder={isAr ? 'العنوان (EN)' : 'Title (EN)'}
                          className="w-full px-3 py-2 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                        <textarea
                          value={newExperience.descAr}
                          onChange={(e) => setNewExperience(prev => ({ ...prev, descAr: e.target.value }))}
                          placeholder={isAr ? 'الوصف (AR)' : 'Description (AR)'}
                          className="w-full px-3 py-2 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white min-h-[90px]"
                        />
                        <textarea
                          value={newExperience.descEn}
                          onChange={(e) => setNewExperience(prev => ({ ...prev, descEn: e.target.value }))}
                          placeholder={isAr ? 'الوصف (EN)' : 'Description (EN)'}
                          className="w-full px-3 py-2 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white min-h-[90px]"
                        />
                      </div>
                      <div className="space-y-2">
                        <input
                          value={newExperience.icon}
                          onChange={(e) => setNewExperience(prev => ({ ...prev, icon: e.target.value }))}
                          placeholder={isAr ? 'أيقونة' : 'Icon'}
                          className="w-full px-3 py-2 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                        />
                      </div>
                      <button
                        type="button"
                        onClick={addExperience}
                        className="px-4 py-2 rounded-xl bg-emerald-500 text-white font-bold"
                      >
                        {isAr ? 'إضافة' : 'Add'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="text-lg font-black text-gray-900 dark:text-white">{isAr ? 'قسم VIP' : 'VIP Section'}</div>
                  <div className="grid lg:grid-cols-2 gap-4">
                    <input
                      value={pageSettings.vipTitleAr}
                      onChange={(e) => setPageSettings(prev => ({ ...prev, vipTitleAr: e.target.value }))}
                      placeholder={isAr ? 'العنوان (AR)' : 'Title (AR)'}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                    <input
                      value={pageSettings.vipTitleEn}
                      onChange={(e) => setPageSettings(prev => ({ ...prev, vipTitleEn: e.target.value }))}
                      placeholder={isAr ? 'العنوان (EN)' : 'Title (EN)'}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                    <textarea
                      value={pageSettings.vipDescriptionAr}
                      onChange={(e) => setPageSettings(prev => ({ ...prev, vipDescriptionAr: e.target.value }))}
                      placeholder={isAr ? 'الوصف (AR)' : 'Description (AR)'}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white min-h-[100px]"
                    />
                    <textarea
                      value={pageSettings.vipDescriptionEn}
                      onChange={(e) => setPageSettings(prev => ({ ...prev, vipDescriptionEn: e.target.value }))}
                      placeholder={isAr ? 'الوصف (EN)' : 'Description (EN)'}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white min-h-[100px]"
                    />
                    <input
                      value={pageSettings.vipPrimaryButtonAr}
                      onChange={(e) => setPageSettings(prev => ({ ...prev, vipPrimaryButtonAr: e.target.value }))}
                      placeholder={isAr ? 'زر أساسي (AR)' : 'Primary button (AR)'}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                    <input
                      value={pageSettings.vipPrimaryButtonEn}
                      onChange={(e) => setPageSettings(prev => ({ ...prev, vipPrimaryButtonEn: e.target.value }))}
                      placeholder={isAr ? 'زر أساسي (EN)' : 'Primary button (EN)'}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                    <input
                      value={pageSettings.vipPrimaryButtonLink}
                      onChange={(e) => setPageSettings(prev => ({ ...prev, vipPrimaryButtonLink: e.target.value }))}
                      placeholder={isAr ? 'رابط الزر الأساسي' : 'Primary button link'}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                    <input
                      value={pageSettings.vipSecondaryButtonAr}
                      onChange={(e) => setPageSettings(prev => ({ ...prev, vipSecondaryButtonAr: e.target.value }))}
                      placeholder={isAr ? 'زر ثانوي (AR)' : 'Secondary button (AR)'}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                    <input
                      value={pageSettings.vipSecondaryButtonEn}
                      onChange={(e) => setPageSettings(prev => ({ ...prev, vipSecondaryButtonEn: e.target.value }))}
                      placeholder={isAr ? 'زر ثانوي (EN)' : 'Secondary button (EN)'}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                    <input
                      value={pageSettings.vipSecondaryButtonLink}
                      onChange={(e) => setPageSettings(prev => ({ ...prev, vipSecondaryButtonLink: e.target.value }))}
                      placeholder={isAr ? 'رابط الزر الثانوي' : 'Secondary button link'}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowSettingsModal(false)}
                    className="px-6 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-semibold"
                  >
                    {isAr ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    disabled={savingSettings}
                    className="px-8 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-black shadow-xl disabled:opacity-60"
                  >
                    {savingSettings ? (isAr ? 'جارٍ الحفظ...' : 'Saving...') : (isAr ? 'حفظ الإعدادات' : 'Save settings')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  )
}
