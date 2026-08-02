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

const parseArabicNum = (str) => {
    if (str === null || str === undefined || str === '') return ''
    return String(str).replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))
}

const STATUS_STYLES = {
    ACTIVE: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-300',
    DRAFT: 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-300',
    SUSPENDED: 'bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-300'
}

const DEFAULT_PAGE_SETTINGS = {
    heroImage: '/img/cars/hero.jpg',
    heroBadgeAr: 'تأجير سيارات فاخرة في سقطرى',
    heroBadgeEn: 'Luxury Car Rental in Socotra',
    heroTitleAr: 'رحلتك المثالية تبدأ بسيارة مثالية',
    heroTitleEn: 'Your Perfect Journey Starts With A Perfect Car',
    heroSubtitleAr: 'اختر من بين تشكيلة واسعة من سيارات الدفع الرباعي والسيارات الفاخرة لتنطلق بثقة',
    heroSubtitleEn: 'Choose from a wide range of 4x4s and luxury vehicles to explore with confidence',
    primaryButtonAr: 'استعرض الأسطول',
    primaryButtonEn: 'Browse Fleet',
    primaryButtonLink: '#fleet',
    stats: [
        { value: '15+', labelAr: 'مركبة دفع رباعي', labelEn: '4x4 Vehicles' },
        { value: '4.9', labelAr: 'تقييم العملاء', labelEn: 'Customer Rating' },
        { value: '24/7', labelAr: 'دعم فني للطرق', labelEn: 'Road Assistance' }
    ]
}

export default function AdminCarsPage() {
    const { locale } = useApp()
    const { success, error: showError } = useToast()
    const isAr = locale === 'ar'
    const router = useRouter()

    const [cars, setCars] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const [search, setSearch] = useState('')
    const [statusFilter, setStatusFilter] = useState('all')
    const [typeFilter, setTypeFilter] = useState('all')
    const [sortBy, setSortBy] = useState('featured')

    const [showExportMenu, setShowExportMenu] = useState(false)
    const [showCreateModal, setShowCreateModal] = useState(false)
    const [savingCreate, setSavingCreate] = useState(false)
    const [deletingId, setDeletingId] = useState(null)
    const [isDeleting, setIsDeleting] = useState(false)

    const [createData, setCreateData] = useState({
        name: '',
        nameAr: '',
        brand: '',
        description: '',
        descriptionAr: '',
        pricePerDay: '',
        type: 'SUV',
        coverImage: '',
        insurance: 'Basic',
        insuranceAr: 'أساسي',
        mileage: 'Unlimited',
        mileageAr: 'مفتوح',
        color: '',
        colorAr: '',
        minAge: 21,
        deposit: 0,
        luggage: 2,
        doors: 4,
        seats: 5,
        transmission: 'Automatic',
        transmissionAr: 'أوتوماتيك',
        fuel: 'Petrol',
        fuelAr: 'بنزين'
    })

    const [showSettingsModal, setShowSettingsModal] = useState(false)
    const [savingSettings, setSavingSettings] = useState(false)
    const [pageSettings, setPageSettings] = useState(DEFAULT_PAGE_SETTINGS)
    const [newStat, setNewStat] = useState({ value: '', labelAr: '', labelEn: '' })

    const fetchCars = useCallback(async () => {
        try {
            setLoading(true)
            setError(null)
            const params = new URLSearchParams()
            if (search) params.set('search', search)
            if (statusFilter !== 'all') params.set('status', statusFilter)
            if (typeFilter !== 'all') params.set('type', typeFilter)
            if (sortBy) {
                params.set('sortBy', sortBy === 'price' ? 'pricePerDay' : (sortBy === 'reviews' ? 'reviewsCount' : sortBy))
                params.set('sortOrder', 'desc')
            }

            const res = await fetch(`/api/admin/cars?${params.toString()}`, { cache: 'no-store' })
            const data = await res.json()
            if (data.success) {
                setCars(data.data.cars || [])
            } else {
                setError(data.error || 'Failed to fetch cars')
            }
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }, [search, statusFilter, typeFilter, sortBy])

    useEffect(() => {
        fetchCars()
    }, [fetchCars])

    const stats = useMemo(() => {
        const total = cars.length
        const active = cars.filter((car) => car.status === 'ACTIVE').length
        const featured = cars.filter((car) => car.featured).length
        const avgRating = cars.length
            ? (cars.reduce((sum, c) => sum + c.rating, 0) / cars.length).toFixed(1)
            : '0.0'

        return { total, active, featured, avgRating }
    }, [cars])

    const filteredCars = useMemo(() => {
        let result = [...cars]
        const keyword = search.trim().toLowerCase()

        if (keyword) {
            result = result.filter((car) => {
                const name = isAr ? car.nameAr : car.name
                const type = car.type
                return name.toLowerCase().includes(keyword) || type.toLowerCase().includes(keyword)
            })
        }

        if (statusFilter !== 'all') {
            result = result.filter((car) => car.status === statusFilter)
        }

        if (typeFilter !== 'all') {
            result = result.filter((car) => car.type === typeFilter)
        }

        switch (sortBy) {
            case 'rating':
                result.sort((a, b) => b.rating - a.rating)
                break
            case 'price':
                result.sort((a, b) => b.pricePerDay - a.pricePerDay)
                break
            case 'reviews':
                result.sort((a, b) => b.reviewsCount - a.reviewsCount)
                break
            default:
                result.sort((a, b) => Number(b.featured) - Number(a.featured))
                break
        }

        return result
    }, [cars, search, statusFilter, typeFilter, sortBy, isAr])

    const updateCar = async (id, payload) => {
        const res = await fetch('/api/admin/cars', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id, ...payload })
        })
        const data = await res.json()
        if (!data.success) {
            throw new Error(data.error || 'Failed to update car')
        }
        return data.data
    }

    const toggleFeatured = async (id) => {
        const target = cars.find((car) => car.id === id)
        if (!target) return
        const next = !target.featured
        try {
            const updated = await updateCar(id, { featured: next })
            setCars((prev) => prev.map((car) => (car.id === id ? updated : car)))
        } catch (err) {
            setError(err.message)
        }
    }

    const toggleStatus = async (id) => {
        const target = cars.find((car) => car.id === id)
        if (!target) return
        const nextStatus = target.status === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE'
        try {
            const updated = await updateCar(id, { status: nextStatus })
            setCars((prev) => prev.map((car) => (car.id === id ? updated : car)))
        } catch (err) {
            setError(err.message)
        }
    }

    const confirmDelete = async () => {
        if (!deletingId) return
        setIsDeleting(true)
        try {
            const res = await fetch(`/api/admin/cars?id=${deletingId}`, { method: 'DELETE' })
            const data = await res.json()
            if (data.success) {
                success(isAr ? 'تم حذف السيارة نهائياً' : 'Car deleted permanently')
                setCars((prev) => prev.filter((c) => c.id !== deletingId))
            } else {
                showError(data.error || 'Failed to delete car')
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
            const res = await fetch('/api/cars/settings')
            const data = await res.json()
            if (data) {
                setPageSettings({
                    ...DEFAULT_PAGE_SETTINGS,
                    ...data,
                    stats: Array.isArray(data.stats) ? data.stats : DEFAULT_PAGE_SETTINGS.stats,
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
        if (!cars.length) {
            showError(isAr ? 'لا توجد بيانات للتصدير' : 'No data to export')
            return
        }
        const rows = cars.map((car) => ({
            [isAr ? 'المعرف' : 'ID']: car.id,
            [isAr ? 'الاسم' : 'Name']: isAr ? car.nameAr : car.name,
            [isAr ? 'النوع' : 'Type']: car.type,
            [isAr ? 'السعر لليوم' : 'Price per day']: car.pricePerDay,
            [isAr ? 'الحالة' : 'Status']: car.status,
            [isAr ? 'مميز' : 'Featured']: car.featured ? (isAr ? 'نعم' : 'Yes') : (isAr ? 'لا' : 'No'),
            [isAr ? 'التقييم' : 'Rating']: car.rating,
            [isAr ? 'عدد المراجعات' : 'Reviews']: car.reviewsCount
        }))
        exportData(rows, format, `cars_export_${new Date().toISOString().slice(0, 10)}`)
        success(isAr ? 'تم تصدير البيانات بنجاح' : 'Data exported successfully')
        setShowExportMenu(false)
    }

    const handleCreateCar = async (e) => {
        e.preventDefault()
        setSavingCreate(true)
        try {
            const payload = {
                ...createData,
                pricePerDay: parseFloat(parseArabicNum(createData.pricePerDay)) || 0,
                discount: parseFloat(parseArabicNum(createData.discount)) || 0,
                minAge: parseInt(parseArabicNum(createData.minAge)) || 21,
                deposit: parseFloat(parseArabicNum(createData.deposit)) || 0,
                luggage: parseInt(parseArabicNum(createData.luggage)) || 2,
                doors: parseInt(parseArabicNum(createData.doors)) || 4,
                seats: parseInt(parseArabicNum(createData.seats)) || 5,
            }
            const response = await fetch('/api/admin/cars', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
            const result = await response.json()
            if (result.success || result.id) { // Sometimes backend directly returns the object
                const createdId = result.data?.id || result.id
                if (createdId) {
                    success(isAr ? 'تم حفظ السيارة بنجاح' : 'Car saved successfully')
                    setShowCreateModal(false)
                    router.push(`/admin/cars/${createdId}`)
                } else {
                     showError(isAr ? 'تم الإنشاء ولكن لم يتم العثور على المعرف' : 'Created but ID not found')
                }
            } else {
                showError(result.error || (isAr ? 'فشل الحفظ' : 'Failed to save car'))
            }
        } catch (err) {
            console.error('Create error:', err)
            showError(isAr ? 'حدث خطأ أثناء الاتصال بالخادم' : 'A server connection error occurred')
        } finally {
            setSavingCreate(false)
        }
    }

    const handleSaveSettings = async (e) => {
        e.preventDefault()
        setSavingSettings(true)
        try {
            const response = await fetch('/api/cars/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(pageSettings)
            })
            if (response.ok) {
                success(isAr ? 'تم تحديث إعدادات الصفحة' : 'Settings updated successfully')
                setShowSettingsModal(false)
                fetchPageSettings()
            } else {
                showError(isAr ? 'فشل التحديث' : 'Failed to update')
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

    const updateStatField = (idx, field, value) => {
        setPageSettings(prev => {
            const statsList = [...(prev.stats || [])]
            statsList[idx] = { ...statsList[idx], [field]: value }
            return { ...prev, stats: statsList }
        })
    }

    if (loading) {
        return (
            <AdminLayout>
                <div className="min-h-[60vh] flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-24 w-24 border-8 border-indigo-200 dark:border-indigo-800 border-t-indigo-600 dark:border-t-indigo-400 mx-auto mb-6"></div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {isAr ? 'جاري تحميل السيارات...' : 'Loading cars...'}
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
                    className="relative rounded-3xl bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 p-10 text-white shadow-2xl z-10"
                >
                    <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
                        <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-purple-400/20 blur-3xl" />
                        <div className="absolute -left-10 -bottom-10 h-48 w-48 rounded-full bg-blue-400/20 blur-3xl" />
                    </div>

                    <div className="relative z-20 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                        <div>
                            <div className="inline-flex items-center gap-3 rounded-full bg-white/10 px-5 py-2 text-sm font-semibold">
                                <span className="text-lg">🚙</span>
                                {isAr ? 'إدارة السيارات الفاخرة' : 'Cars Management'}
                            </div>
                            <h1 className="mt-5 text-4xl font-black">{isAr ? 'مركز تحكم السيارات' : 'Cars Control Center'}</h1>
                            <p className="mt-3 text-white/80 max-w-2xl">
                                {isAr
                                    ? 'تحكم بأسطول السيارات، أسعار التأجير، التقييمات، وإعدادات صفحة الحجوزات.'
                                    : 'Manage car fleet, rental prices, ratings, and booking page settings.'}
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => setShowCreateModal(true)}
                                className="px-6 py-3 rounded-2xl bg-white text-gray-900 font-black shadow-xl hover:shadow-2xl transition-all"
                            >
                                {isAr ? 'إضافة سيارة جديدة' : 'Add New Car'}
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
                                    <div className="absolute z-20 mt-2 w-44 rounded-2xl border border-white/20 bg-white/95 text-gray-900 shadow-2xl backdrop-blur-md overflow-hidden left-0">
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
                        { label: isAr ? 'إجمالي الأسطول' : 'Total Fleet', value: stats.total, icon: '🚘' },
                        { label: isAr ? 'السيارات النشطة' : 'Active Cars', value: stats.active, icon: '🟢' },
                        { label: isAr ? 'المميزة' : 'Featured', value: stats.featured, icon: '👑' },
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
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center text-xl">
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
                                placeholder={isAr ? 'ابحث باسم أو نوع السيارة' : 'Search car name or type'}
                                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-400"
                            />
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <select
                                value={typeFilter}
                                onChange={(e) => setTypeFilter(e.target.value)}
                                className="px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-semibold"
                            >
                                <option value="all">{isAr ? 'كل الأنواع' : 'All types'}</option>
                                <option value="Pick-up">{isAr ? 'شاص / بيك أب' : 'Pick-up'}</option>
                                <option value="SUV">SUV</option>
                                <option value="4x4">{isAr ? 'دفع رباعي / جيب' : '4x4 / Off-Road'}</option>
                                <option value="Sedan">{isAr ? 'سيدان صالون صغير' : 'Sedan'}</option>
                                <option value="Van">{isAr ? 'عائلي / باص' : 'Family / Van'}</option>
                                <option value="Economy">{isAr ? 'اقتصادي' : 'Economy'}</option>
                                <option value="VIP">{isAr ? 'فاخر / VIP' : 'VIP Transport'}</option>
                            </select>
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
                                <option value="reviews">{isAr ? 'الأكثر مراجعة' : 'Most reviews'}</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {filteredCars.map((car, index) => (
                            <motion.div
                                key={car.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl overflow-hidden shadow-xl"
                            >
                                <div className="relative h-56">
                                    <Image src={car.coverImage || car.images?.[0] || '/img/cars/hero.jpg'} alt={car.name} fill className="object-cover" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                                    <div className="absolute top-4 left-4 flex gap-2">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_STYLES[car.status]}`}>
                                            {isAr
                                                ? car.status === 'ACTIVE'
                                                    ? 'نشط'
                                                    : car.status === 'DRAFT'
                                                        ? 'مسودة'
                                                        : 'موقوف'
                                                : car.status}
                                        </span>
                                        {car.featured && (
                                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/90 text-gray-900">
                                                {isAr ? 'مميز' : 'Featured'}
                                            </span>
                                        )}
                                    </div>
                                    <div className="absolute bottom-4 left-4 text-white">
                                        <div className="text-lg font-black">{isAr ? car.nameAr : car.name}</div>
                                        <div className="text-sm font-bold text-indigo-300">{car.type}</div>
                                    </div>
                                </div>
                                <div className="p-6 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">{isAr ? 'السعر لليوم' : 'Price / day'}</div>
                                            <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">${car.pricePerDay}</div>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex items-center gap-2 justify-end text-gray-900 dark:text-white font-bold">
                                                <span>★</span>
                                                <span>{car.rating}</span>
                                            </div>
                                            <div className="text-xs text-gray-500 dark:text-gray-400">
                                                {car.reviewsCount} {isAr ? 'تقييم' : 'reviews'}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4 text-sm text-gray-600 dark:text-gray-400 border-t border-b border-gray-100 dark:border-gray-800 py-3 my-2">
                                        <div className="flex items-center gap-1">
                                            <span>💺</span> {car.seats}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span>🚪</span> {car.doors}
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span>⚙️</span> {car.transmission === 'Automatic' ? (isAr ? 'تلقائي' : 'Auto') : (isAr ? 'يدوي' : 'Manual')}
                                        </div>
                                    </div>

                                    <div className="flex flex-wrap gap-3">
                                        <button
                                            onClick={() => toggleFeatured(car.id)}
                                            className={`flex-1 px-4 py-3 rounded-2xl font-semibold transition-all ${car.featured
                                                ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-lg'
                                                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-200'
                                                }`}
                                        >
                                            {car.featured ? (isAr ? 'إزالة التمييز' : 'Unfeature') : (isAr ? 'تمييز السيارة' : 'Feature')}
                                        </button>
                                        <button
                                            onClick={() => toggleStatus(car.id)}
                                            className="flex-1 px-4 py-3 rounded-2xl font-semibold border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-indigo-400 transition-all"
                                        >
                                            {car.status === 'ACTIVE' ? (isAr ? 'إيقاف مؤقت' : 'Pause') : (isAr ? 'تفعيل' : 'Activate')}
                                        </button>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <Link
                                            href={`/cars/${car.slug}`}
                                            className="w-full px-4 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold text-center shadow-lg hover:shadow-indigo-500/30 transition-all"
                                        >
                                            {isAr ? 'عرض بالموقع' : 'View live'}
                                        </Link>
                                        <Link
                                            href={`/admin/cars/${car.id}`}
                                            className="w-full px-4 py-3 rounded-2xl border border-indigo-200 dark:border-indigo-800 text-indigo-700 dark:text-indigo-400 font-bold text-center hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-all"
                                        >
                                            {isAr ? 'تعديل' : 'Edit'}
                                        </Link>
                                        <button
                                            onClick={() => setDeletingId(car.id)}
                                            className="px-4 py-3 rounded-2xl border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 font-bold text-center hover:bg-rose-50 dark:hover:bg-rose-900/20 transition-all"
                                            title={isAr ? 'حذف السيارة' : 'Delete Car'}
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>

                {filteredCars.length === 0 && (
                    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-10 text-center shadow-lg">
                        <div className="text-5xl mb-4">🚙</div>
                        <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
                            {isAr ? 'لا توجد سيارات مطابقة' : 'No matching cars'}
                        </h3>
                        <p className="text-gray-500">{isAr ? 'عدّل البحث أو أضف سيارة جديدة للأسطول.' : 'Adjust filters or add a new car to the fleet.'}</p>
                    </div>
                )}

                {/* Delete Modal */}
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
                                    ? 'سيتم حذف هذه السيارة وجميع بياناتها بشكل نهائي.'
                                    : 'This car and all its data will be permanently deleted.'}
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
                                    {isDeleting ? (isAr ? 'جاري الحذف...' : 'Deleting...') : (isAr ? 'حذف' : 'Delete')}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Create Modal */}
                {showCreateModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowCreateModal(false)} />
                        <div className="relative w-full max-w-6xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl flex flex-col max-h-[90vh]">
                            <div className="p-8 border-b border-gray-100 dark:border-gray-800 shrink-0">
                                <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                                    {isAr ? 'إضافة سيارة جديدة احترافية' : 'Add Professional New Car'}
                                </h2>
                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                    {isAr ? 'أدخل التفاصيل الأساسية، المواصفات الفنية، وشروط الإيجار مباشرة.' : 'Enter basic details, technical specs, and rental conditions all at once.'}
                                </p>
                            </div>
                            <form onSubmit={handleCreateCar} className="p-8 overflow-y-auto flex-1 space-y-12">
                                
                                {/* Section 1: Basic Information */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 pb-3 border-b border-gray-100 dark:border-gray-800">
                                        <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">1</div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{isAr ? 'المعلومات الأساسية' : 'Basic Information'}</h3>
                                    </div>
                                    <div className="grid lg:grid-cols-2 gap-6">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">{isAr ? 'اسم السيارة (EN)' : 'Car name (EN)'}</label>
                                                <input value={createData.name} onChange={(e) => setCreateData(prev => ({ ...prev, name: e.target.value }))} required className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" />
                                            </div>
                                            <div>
                                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">{isAr ? 'اسم السيارة (AR)' : 'Car name (AR)'}</label>
                                                <input value={createData.nameAr} onChange={(e) => setCreateData(prev => ({ ...prev, nameAr: e.target.value }))} required className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-right" />
                                            </div>
                                            <div>
                                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">{isAr ? 'العلامة التجارية (Brand)' : 'Brand'}</label>
                                                <input value={createData.brand} onChange={(e) => setCreateData(prev => ({ ...prev, brand: e.target.value }))} placeholder={isAr ? 'مثال: Toyota' : 'e.g. Toyota'} className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">{isAr ? 'السعر لليوم' : 'Price per day'}</label>
                                                    <input type="number" value={createData.pricePerDay} onChange={(e) => setCreateData(prev => ({ ...prev, pricePerDay: e.target.value }))} required className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white" />
                                                </div>
                                                <div>
                                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">{isAr ? 'النوع والفئة' : 'Type & Class'}</label>
                                                    <select value={createData.type} onChange={(e) => setCreateData(prev => ({ ...prev, type: e.target.value }))} className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white">
                                                        <option value="Sedan">{isAr ? 'سيدان (صالون صغير)' : 'Sedan'}</option>
                                                        <option value="Mid-size Sedan">{isAr ? 'سيدان (صالون متوسط)' : 'Mid-size Sedan'}</option>
                                                        <option value="Luxury Sedan">{isAr ? 'سيدان فاخرة (VIP)' : 'Luxury Sedan'}</option>
                                                        <option value="SUV">{isAr ? 'دفع رباعي عائلي (SUV)' : 'SUV'}</option>
                                                        <option value="4x4">{isAr ? 'دفع رباعي مجهز (جيب/شاص)' : '4x4'}</option>
                                                        <option value="Pick-up">{isAr ? 'بيك أب (حوض/شاص)' : 'Pick-up'}</option>
                                                        <option value="Crossover">{isAr ? 'كروس أوفر' : 'Crossover'}</option>
                                                        <option value="Van">{isAr ? 'باص عائلي (فان)' : 'Van'}</option>
                                                        <option value="Minibus">{isAr ? 'باص سياحي صغير (ميني باص)' : 'Minibus'}</option>
                                                        <option value="Bus">{isAr ? 'باص سياحي كبير' : 'Bus'}</option>
                                                        <option value="Hatchback">{isAr ? 'هاتشباك (سيارة صغيرة)' : 'Hatchback'}</option>
                                                        <option value="Sports">{isAr ? 'سيارة رياضية' : 'Sports'}</option>
                                                        <option value="Economy">{isAr ? 'سيارة اقتصادية' : 'Economy'}</option>
                                                        <option value="Convertible">{isAr ? 'سيارة مكشوفة (كابريوليه)' : 'Convertible'}</option>
                                                    </select>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-4 flex flex-col">
                                            <div>
                                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">{isAr ? 'الوصف (EN)' : 'Description (EN)'}</label>
                                                <textarea value={createData.description} onChange={(e) => setCreateData(prev => ({ ...prev, description: e.target.value }))} required className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white h-24" />
                                            </div>
                                            <div className="flex-1">
                                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1 block">{isAr ? 'الوصف (AR)' : 'Description (AR)'}</label>
                                                <textarea value={createData.descriptionAr} onChange={(e) => setCreateData(prev => ({ ...prev, descriptionAr: e.target.value }))} required className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white h-24 text-right" />
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Cover Image Section */}
                                    <div className="space-y-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                                        <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                            <span className="text-indigo-500">📸</span>
                                            {isAr ? 'صورة السيارة الأساسية' : 'Main Car Image'}
                                        </h4>
                                        <div className="grid md:grid-cols-2 gap-6 items-start">
                                            {/* Option 1: Upload */}
                                            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700">
                                                <div className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">{isAr ? 'خيار 1: رفع صورة' : 'Option 1: Upload Image'}</div>
                                                <ImageUploader
                                                    value={createData.coverImage && createData.coverImage.startsWith('/') ? createData.coverImage : ''}
                                                    onChange={(value) => setCreateData(prev => ({ ...prev, coverImage: value }))}
                                                />
                                            </div>

                                            {/* Option 2: Image URL */}
                                            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 h-full flex flex-col justify-center">
                                                <div className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">{isAr ? 'خيار 2: رابط صورة خارجي' : 'Option 2: External Image URL'}</div>
                                                <div className="flex bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition-all">
                                                    <span className="bg-gray-50 dark:bg-gray-800 px-4 py-3 text-gray-400 dark:text-gray-500 border-r border-gray-200 dark:border-gray-700 flex items-center justify-center">
                                                        🔗
                                                    </span>
                                                    <input
                                                        type="url"
                                                        value={createData.coverImage && createData.coverImage.startsWith('http') ? createData.coverImage : ''}
                                                        onChange={(e) => setCreateData(prev => ({ ...prev, coverImage: e.target.value }))}
                                                        placeholder={isAr ? "https://example.com/image.jpg" : "https://example.com/image.jpg"}
                                                        className="w-full px-4 py-3 bg-transparent text-gray-900 dark:text-white focus:outline-none text-sm"
                                                        dir="ltr"
                                                    />
                                                </div>
                                                <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 flex items-center gap-1.5">
                                                    <span className="text-indigo-400">💡</span> 
                                                    {isAr ? 'ألصق رابط الصورة مباشرة كبديل عن الرفع.' : 'Paste a direct image link as an alternative to uploading.'}
                                                </p>
                                            </div>
                                        </div>
                                        
                                        {/* Current Preview */}
                                        {createData.coverImage && (
                                            <div className="mt-4 p-4 border border-indigo-100 dark:border-indigo-900/30 bg-indigo-50/50 dark:bg-indigo-900/10 rounded-2xl">
                                                <div className="text-xs font-bold text-indigo-600 dark:text-indigo-400 mb-3 uppercase tracking-wider">
                                                    {isAr ? 'معاينة الصورة الحالية:' : 'Current Image Preview:'}
                                                </div>
                                                <img 
                                                    src={createData.coverImage} 
                                                    alt="Cover Preview" 
                                                    className="w-full h-48 object-cover rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
                                                    onError={(e) => {
                                                        e.target.onerror = null; 
                                                        e.target.src = '/img/placeholder.jpg';
                                                    }}
                                                />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Section 2: Technical Specs */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 pb-3 border-b border-gray-100 dark:border-gray-800">
                                        <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm">2</div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{isAr ? 'المواصفات الفنية' : 'Technical Specifications'}</h3>
                                    </div>
                                    <div className="grid md:grid-cols-4 gap-4">
                                        <div>
                                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-1">{isAr ? 'الأبواب' : 'Doors'}</label>
                                            <input type="number" min="2" max="10" value={createData.doors} onChange={(e) => setCreateData(prev => ({ ...prev, doors: e.target.value }))} className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800" />
                                        </div>
                                        <div>
                                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-1">{isAr ? 'المقاعد' : 'Seats'}</label>
                                            <input type="number" min="2" max="60" value={createData.seats} onChange={(e) => setCreateData(prev => ({ ...prev, seats: e.target.value }))} className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800" />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-1">{isAr ? 'ناقل الحركة' : 'Transmission'}</label>
                                            <select 
                                                value={createData.transmission} 
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    const map = { 'Automatic': 'أوتوماتيك', 'Manual': 'يدوي / عادي' };
                                                    setCreateData(prev => ({ ...prev, transmission: val, transmissionAr: map[val] }))
                                                }}
                                                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                                            >
                                                <option value="Automatic">{isAr ? 'أوتوماتيك (Automatic)' : 'Automatic'}</option>
                                                <option value="Manual">{isAr ? 'يدوي / عادي (Manual)' : 'Manual'}</option>
                                            </select>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-1">{isAr ? 'نوع الوقود' : 'Fuel Type'}</label>
                                            <select 
                                                value={createData.fuel} 
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    const map = { 'Petrol': 'بنزين', 'Diesel': 'ديزل', 'Electric': 'كهربائي', 'Hybrid': 'هجين' };
                                                    setCreateData(prev => ({ ...prev, fuel: val, fuelAr: map[val] }))
                                                }}
                                                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                                            >
                                                <option value="Petrol">{isAr ? 'بنزين (Petrol)' : 'Petrol'}</option>
                                                <option value="Diesel">{isAr ? 'ديزل (Diesel)' : 'Diesel'}</option>
                                                <option value="Electric">{isAr ? 'كهربائي (Electric)' : 'Electric'}</option>
                                                <option value="Hybrid">{isAr ? 'هجين (Hybrid)' : 'Hybrid'}</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-1">{isAr ? 'لون السيارة (EN)' : 'Color (EN)'}</label>
                                            <input value={createData.color} onChange={(e) => setCreateData(prev => ({ ...prev, color: e.target.value }))} placeholder="Pearl White" className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800" />
                                        </div>
                                        <div>
                                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-1">{isAr ? 'لون السيارة (AR)' : 'Color (AR)'}</label>
                                            <input value={createData.colorAr} onChange={(e) => setCreateData(prev => ({ ...prev, colorAr: e.target.value }))} placeholder="لؤلؤي أبيض" className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-right" />
                                        </div>
                                    </div>
                                </div>

                                {/* Section 3: Rental Conditions */}
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 pb-3 border-b border-gray-100 dark:border-gray-800">
                                        <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">3</div>
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{isAr ? 'شروط وعقود الإيجار الاحترافية' : 'Professional Rental Terms'}</h3>
                                    </div>
                                    <div className="grid md:grid-cols-3 gap-4">

                                        <div>
                                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-1">{isAr ? 'مبلغ التأمين المسترد ($)' : 'Security Deposit ($)'}</label>
                                            <input type="number" value={createData.deposit} onChange={(e) => setCreateData(prev => ({ ...prev, deposit: e.target.value }))} placeholder="e.g. 500" className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800" />
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-1">{isAr ? 'الكيلومترات (Mileage)' : 'Mileage Limit'}</label>
                                            <select 
                                                value={createData.mileage} 
                                                onChange={(e) => {
                                                    const val = e.target.value;
                                                    const map = { 
                                                        'Unlimited': 'مفتوح', 
                                                        '100 km/day': '100 كم/يوم', 
                                                        '150 km/day': '150 كم/يوم', 
                                                        '200 km/day': '200 كم/يوم', 
                                                        '250 km/day': '250 كم/يوم', 
                                                        '300 km/day': '300 كم/يوم',
                                                        '400 km/day': '400 كم/يوم',
                                                        '500 km/day': '500 كم/يوم',
                                                        '600 km/day': '600 كم/يوم'
                                                    };
                                                    setCreateData(prev => ({ ...prev, mileage: val, mileageAr: map[val] }))
                                                }}
                                                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800"
                                            >
                                                <option value="Unlimited">{isAr ? 'مفتوح / غير محدود' : 'Unlimited'}</option>
                                                <option value="100 km/day">{isAr ? '100 كم/يوم' : '100 km/day'}</option>
                                                <option value="150 km/day">{isAr ? '150 كم/يوم' : '150 km/day'}</option>
                                                <option value="200 km/day">{isAr ? '200 كم/يوم' : '200 km/day'}</option>
                                                <option value="250 km/day">{isAr ? '250 كم/يوم' : '250 km/day'}</option>
                                                <option value="300 km/day">{isAr ? '300 كم/يوم' : '300 km/day'}</option>
                                                <option value="400 km/day">{isAr ? '400 كم/يوم' : '400 km/day'}</option>
                                                <option value="500 km/day">{isAr ? '500 كم/يوم' : '500 km/day'}</option>
                                                <option value="600 km/day">{isAr ? '600 كم/يوم' : '600 km/day'}</option>
                                            </select>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-1">{isAr ? 'سعة الحقائب' : 'Luggage'}</label>
                                                <input type="number" min="0" value={createData.luggage} onChange={(e) => setCreateData(prev => ({ ...prev, luggage: e.target.value }))} className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800" />
                                            </div>
                                            <div>
                                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-1">{isAr ? 'العمر الأدنى' : 'Min Age'}</label>
                                                <input type="number" min="18" value={createData.minAge} onChange={(e) => setCreateData(prev => ({ ...prev, minAge: e.target.value }))} className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-4 justify-end pt-6 border-t border-gray-100 dark:border-gray-800 shrink-0">
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateModal(false)}
                                        className="px-8 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        {isAr ? 'إلغاء' : 'Cancel'}
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={savingCreate}
                                        className="px-10 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-black shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 disabled:opacity-60 transition-all"
                                    >
                                        {savingCreate ? (isAr ? 'جارٍ الحفظ والإنشاء...' : 'Creating...') : (isAr ? 'إضافة السيارة وفتح التحرير المتقدم' : 'Create Car Record')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Settings Modal */}
                {showSettingsModal && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowSettingsModal(false)} />
                        <div className="relative w-full max-w-4xl bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden">
                            <div className="p-8 border-b border-gray-100 dark:border-gray-800">
                                <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                                    {isAr ? 'إعدادات صفحة السيارات' : 'Cars Page Settings'}
                                </h2>
                            </div>
                            <form onSubmit={handleSaveSettings} className="p-8 space-y-10 max-h-[80vh] overflow-y-auto">
                                {/* Hero Section */}
                                <div className="space-y-6 bg-gray-50/50 dark:bg-gray-800/30 p-6 rounded-3xl border border-gray-100 dark:border-gray-800">
                                    <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
                                        <span className="p-2 bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-400 rounded-xl">🌟</span>
                                        {isAr ? 'القسم الرئيسي (Hero)' : 'Page Hero Section'}
                                    </h3>
                                    
                                    <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 space-y-6">
                                        <div className="flex flex-col gap-2">
                                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                {isAr ? 'إضافة رابط خارجي للصورة (URL)' : 'Add External Image URL'}
                                            </label>
                                            <input
                                                type="url"
                                                value={typeof pageSettings.heroImage === 'string' && pageSettings.heroImage.startsWith('http') ? pageSettings.heroImage : ''}
                                                onChange={(e) => setPageSettings(prev => ({ ...prev, heroImage: e.target.value }))}
                                                placeholder={isAr ? 'https://example.com/image.jpg' : 'https://example.com/image.jpg'}
                                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-indigo-500 transition-all font-mono text-sm"
                                            />
                                        </div>
                                        
                                        <div className="relative py-2 flex items-center">
                                            <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
                                            <span className="shrink-0 px-4 text-gray-400 dark:text-gray-500 font-bold text-sm bg-white dark:bg-gray-900 rounded-full">{isAr ? 'أو' : 'OR'}</span>
                                            <div className="flex-grow border-t border-gray-200 dark:border-gray-700"></div>
                                        </div>

                                        <ImageUploader
                                            value={pageSettings.heroImage}
                                            onChange={(val) => setPageSettings(prev => ({ ...prev, heroImage: val }))}
                                            label={isAr ? 'رفع صورة من الجهاز' : 'Upload Image from Device'}
                                        />
                                    </div>

                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{isAr ? 'العنوان (EN)' : 'Title (EN)'}</label>
                                            <input
                                                value={pageSettings.heroTitleEn}
                                                onChange={(e) => setPageSettings(prev => ({ ...prev, heroTitleEn: e.target.value }))}
                                                placeholder="e.g. Find Your Dream Ride"
                                                className="w-full px-4 py-3 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm focus:ring-2 focus:ring-indigo-500"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{isAr ? 'العنوان (AR)' : 'Title (AR)'}</label>
                                            <input
                                                value={pageSettings.heroTitleAr}
                                                onChange={(e) => setPageSettings(prev => ({ ...prev, heroTitleAr: e.target.value }))}
                                                placeholder="مثال: اعثر على سيارة أحلامك"
                                                className="w-full px-4 py-3 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm border-r-4 border-r-indigo-500 text-right focus:ring-2 focus:ring-indigo-500"
                                            />
                                        </div>
                                    </div>
                                    
                                    <div className="grid md:grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{isAr ? 'النص الفرعي (EN)' : 'Subtitle (EN)'}</label>
                                            <textarea
                                                value={pageSettings.heroSubtitleEn}
                                                onChange={(e) => setPageSettings(prev => ({ ...prev, heroSubtitleEn: e.target.value }))}
                                                placeholder="Short description..."
                                                className="w-full px-4 py-3 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm h-24 focus:ring-2 focus:ring-indigo-500"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{isAr ? 'النص الفرعي (AR)' : 'Subtitle (AR)'}</label>
                                            <textarea
                                                value={pageSettings.heroSubtitleAr}
                                                onChange={(e) => setPageSettings(prev => ({ ...prev, heroSubtitleAr: e.target.value }))}
                                                placeholder="وصف قصير..."
                                                className="w-full px-4 py-3 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl shadow-sm h-24 text-right focus:ring-2 focus:ring-indigo-500 border-r-4 border-r-indigo-500"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Stats Section */}
                                <div className="space-y-6 bg-gray-50/50 dark:bg-gray-800/30 p-6 rounded-3xl border border-gray-100 dark:border-gray-800">
                                    <h3 className="text-xl font-bold flex items-center gap-2 mb-4">
                                        <span className="p-2 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 rounded-xl">📊</span>
                                        {isAr ? 'أرقام وإحصائيات' : 'Stats & Numbers'}
                                    </h3>
                                    <div className="grid md:grid-cols-3 gap-4 bg-white dark:bg-gray-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800">
                                        <div className="space-y-1 col-span-1">
                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{isAr ? 'القيمة (مثال: +15)' : 'Value (e.g. 15+)'}</label>
                                            <input
                                                value={newStat.value}
                                                onChange={e => setNewStat({ ...newStat, value: e.target.value })}
                                                placeholder="15+"
                                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500"
                                            />
                                        </div>
                                        <div className="space-y-1 col-span-1">
                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{isAr ? 'الاسم (EN)' : 'Label (EN)'}</label>
                                            <input
                                                value={newStat.labelEn}
                                                onChange={e => setNewStat({ ...newStat, labelEn: e.target.value })}
                                                placeholder="Years Experience"
                                                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-emerald-500"
                                            />
                                        </div>
                                        <div className="space-y-1 col-span-1">
                                            <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{isAr ? 'الاسم (AR)' : 'Label (AR)'}</label>
                                            <div className="flex gap-2">
                                                <input
                                                    value={newStat.labelAr}
                                                    onChange={e => setNewStat({ ...newStat, labelAr: e.target.value })}
                                                    placeholder="سنوات الخبرة"
                                                    className="w-full flex-1 px-4 py-3 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-xl text-right focus:ring-2 focus:ring-emerald-500 border-r-4 border-r-emerald-500"
                                                />
                                                <button type="button" onClick={addStat} className="bg-emerald-500 text-white px-5 py-3 rounded-xl text-xl font-bold hover:bg-emerald-600 transition-colors shadow-lg shadow-emerald-500/30">+</button>
                                            </div>
                                        </div>
                                    </div>

                                    {pageSettings.stats?.length > 0 && (
                                        <div className="bg-white dark:bg-gray-900 shadow-sm border border-gray-100 dark:border-gray-800 rounded-2xl p-6 space-y-4">
                                            <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-2">{isAr ? 'الإحصائيات المضافة' : 'Added Stats'}</h4>
                                            {pageSettings.stats.map((stat, idx) => (
                                                <div key={idx} className="flex gap-3 items-center bg-gray-50 dark:bg-gray-800/50 p-3 rounded-xl border border-gray-200 dark:border-gray-700">
                                                    <input
                                                        value={stat.value}
                                                        onChange={e => updateStatField(idx, 'value', e.target.value)}
                                                        className="w-1/4 px-4 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg text-center font-bold"
                                                    />
                                                    <input
                                                        value={stat.labelEn}
                                                        onChange={e => updateStatField(idx, 'labelEn', e.target.value)}
                                                        className="w-1/3 px-4 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg"
                                                    />
                                                    <input
                                                        value={stat.labelAr}
                                                        onChange={e => updateStatField(idx, 'labelAr', e.target.value)}
                                                        className="w-1/3 px-4 py-2 bg-white dark:bg-gray-900 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 rounded-lg text-right"
                                                    />
                                                    <button type="button" onClick={() => removeStat(idx)} className="text-rose-500 bg-rose-50 dark:bg-rose-500/10 w-10 h-10 rounded-lg flex items-center justify-center font-bold hover:bg-rose-100 dark:hover:bg-rose-500/20 transition-colors">×</button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="flex items-center gap-4 justify-end pt-8 border-t border-gray-100 dark:border-gray-800 shrink-0">
                                    <button
                                        type="button"
                                        onClick={() => setShowSettingsModal(false)}
                                        className="px-8 py-4 rounded-2xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-bold hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        {isAr ? 'إلغاء الأمر' : 'Cancel'}
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={savingSettings}
                                        className="px-12 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-black text-lg shadow-xl shadow-indigo-500/30 hover:shadow-2xl hover:scale-105 active:scale-95 disabled:opacity-60 transition-all"
                                    >
                                        {savingSettings ? (isAr ? 'جارٍ الحفظ...' : 'Saving...') : (isAr ? 'حفظ إعدادات الصفحة' : 'Save Page Settings')}
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
