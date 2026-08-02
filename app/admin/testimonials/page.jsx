'use client'

// ═══════════════════════════════════════════════════════════════
// 💬 TESTIMONIALS MANAGEMENT - Ultra Professional & Modern
// إدارة آراء العملاء - تصميم احترافي وعصري جداً
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useApp } from '@/contexts/AppContext'
import AdminLayout from '@/components/admin/AdminLayout'
import { useToast } from '@/components/admin/Toast'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

const fallbackCountries = [
    { code: 'SA', en: 'Saudi Arabia', ar: 'المملكة العربية السعودية', flag: '🇸🇦' },
    { code: 'AE', en: 'UAE', ar: 'الإمارات', flag: '🇦🇪' },
    { code: 'US', en: 'United States', ar: 'الولايات المتحدة', flag: '🇺🇸' },
    { code: 'GB', en: 'United Kingdom', ar: 'بريطانيا', flag: '🇬🇧' },
    { code: 'FR', en: 'France', ar: 'فرنسا', flag: '🇫🇷' },
    { code: 'DE', en: 'Germany', ar: 'ألمانيا', flag: '🇩🇪' },
    { code: 'IT', en: 'Italy', ar: 'إيطاليا', flag: '🇮🇹' },
    { code: 'ES', en: 'Spain', ar: 'إسبانيا', flag: '🇪🇸' },
    { code: 'JP', en: 'Japan', ar: 'اليابان', flag: '🇯🇵' },
    { code: 'CN', en: 'China', ar: 'الصين', flag: '🇨🇳' },
]

const getFlagEmoji = (code) => {
    if (!code || code.length !== 2) return '🌍'
    const upper = code.toUpperCase()
    return String.fromCodePoint(...[...upper].map(char => 127397 + char.charCodeAt(0)))
}

export default function TestimonialsManagement() {
    const { locale } = useApp()
    const { success, error: showError } = useToast()
    const isAr = locale === 'ar'

    // State
    const [testimonials, setTestimonials] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [modalMode, setModalMode] = useState('create')
    const [selectedTestimonial, setSelectedTestimonial] = useState(null)
    const [saving, setSaving] = useState(false)
    const [deleting, setDeleting] = useState(null)

    // Filters
    const [searchTerm, setSearchTerm] = useState('')
    const [ratingFilter, setRatingFilter] = useState('all')
    const [countryFilter, setCountryFilter] = useState('all')
    const [publishedFilter, setPublishedFilter] = useState('all')
    const [verifiedFilter, setVerifiedFilter] = useState('all')

    // Form Data
    const [formData, setFormData] = useState({
        customerName: '',
        customerNameAr: '',
        customerEmail: '',
        customerImage: '',
        country: '',
        countryAr: '',
        countryCode: '',
        content: '',
        contentAr: '',
        rating: 5,
        tourName: '',
        tourNameAr: '',
        hasVideo: false,
        videoUrl: '',
        date: new Date().toISOString().split('T')[0],
        featured: false,
        verified: false,
        published: false
    })

    const countries = useMemo(() => {
        try {
            if (typeof Intl === 'undefined' || typeof Intl.supportedValuesOf !== 'function') {
                return fallbackCountries
            }
            const regions = Intl.supportedValuesOf('region')
            const enDisplay = new Intl.DisplayNames(['en'], { type: 'region' })
            const arDisplay = new Intl.DisplayNames(['ar'], { type: 'region' })
            return regions
                .map(code => {
                    const en = enDisplay.of(code) || code
                    const ar = arDisplay.of(code) || en
                    return { code, en, ar, flag: getFlagEmoji(code) }
                })
                .sort((a, b) => a.en.localeCompare(b.en))
        } catch {
            return fallbackCountries
        }
    }, [])

    const normalizeValue = (value) => value?.trim().toLowerCase() || ''

    const resolveCountryCode = (value, lang) => {
        const query = normalizeValue(value)
        if (!query) return ''
        const match = countries.find(country => {
            const name = lang === 'ar' ? country.ar : country.en
            return normalizeValue(name) === query
        })
        return match?.code || ''
    }

    const fetchTestimonials = useCallback(async () => {
        setLoading(true)
        try {
            const url = new URL('/api/admin/testimonials', window.location.origin)
            if (ratingFilter !== 'all') url.searchParams.set('rating', ratingFilter)
            if (countryFilter !== 'all') url.searchParams.set('country', countryFilter)
            if (publishedFilter !== 'all') url.searchParams.set('published', publishedFilter)
            if (verifiedFilter !== 'all') url.searchParams.set('verified', verifiedFilter)

            const response = await fetch(url)
            const result = await response.json()

            if (result.success) {
                setTestimonials(result.data || [])
            } else {
                showError('Failed to fetch testimonials')
            }
        } catch (error) {
            console.error('Error fetching testimonials:', error)
            showError('Error fetching testimonials')
        } finally {
            setLoading(false)
        }
    }, [countryFilter, publishedFilter, ratingFilter, showError, verifiedFilter])

    useEffect(() => {
        fetchTestimonials()
    }, [fetchTestimonials])

    // ═══════════════════════════════════════════════════════════════
    // CRUD Operations
    // ═══════════════════════════════════════════════════════════════

    const handleCreate = () => {
        setModalMode('create')
        setFormData({
            customerName: '',
            customerNameAr: '',
            customerEmail: '',
            customerImage: '',
            country: '',
            countryAr: '',
            countryCode: '',
            content: '',
            contentAr: '',
            rating: 5,
            tourName: '',
            tourNameAr: '',
            hasVideo: false,
            videoUrl: '',
            date: new Date().toISOString().split('T')[0],
            featured: false,
            verified: false,
            published: false
        })
        setShowModal(true)
    }

    const handleEdit = (testimonial) => {
        setModalMode('edit')
        setSelectedTestimonial(testimonial)
        setFormData({
            customerName: testimonial.customerName || '',
            customerNameAr: testimonial.customerNameAr || '',
            customerEmail: testimonial.customerEmail || '',
            customerImage: testimonial.customerImage || '',
            country: testimonial.country || '',
            countryAr: testimonial.countryAr || '',
            countryCode: testimonial.countryCode || '',
            content: testimonial.content || '',
            contentAr: testimonial.contentAr || '',
            rating: testimonial.rating || 5,
            tourName: testimonial.tourName || '',
            tourNameAr: testimonial.tourNameAr || '',
            hasVideo: testimonial.hasVideo || false,
            videoUrl: testimonial.videoUrl || '',
            date: testimonial.date ? new Date(testimonial.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
            featured: testimonial.featured || false,
            verified: testimonial.verified || false,
            published: testimonial.published || false
        })
        setShowModal(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)

        try {
            const url = '/api/admin/testimonials'
            const method = modalMode === 'create' ? 'POST' : 'PUT'
            const body = modalMode === 'edit'
                ? { ...formData, id: selectedTestimonial.id }
                : formData

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })

            const result = await response.json()

            if (result.success) {
                success(modalMode === 'create' ? 'Testimonial created!' : 'Testimonial updated!')
                setShowModal(false)
                fetchTestimonials()
            } else {
                showError(result.error || 'Operation failed')
            }
        } catch (error) {
            console.error('Error saving testimonial:', error)
            showError('Error saving testimonial')
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm(isAr ? 'هل أنت متأكد من الحذف؟' : 'Are you sure you want to delete?')) {
            return
        }

        try {
            setDeleting(id)
            const response = await fetch(`/api/admin/testimonials?id=${id}`, {
                method: 'DELETE'
            })

            const result = await response.json()

            if (result.success) {
                success('Testimonial deleted!')
                fetchTestimonials()
            } else {
                showError(result.error || 'Delete failed')
            }
        } catch (error) {
            console.error('Error deleting testimonial:', error)
            showError('Error deleting testimonial')
        } finally {
            setDeleting(null)
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // Filtered Testimonials
    // ═══════════════════════════════════════════════════════════════
    const filteredTestimonials = testimonials.filter(testimonial => {
        const matchesSearch = searchTerm === '' ||
            testimonial.customerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            testimonial.customerNameAr?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            testimonial.content?.toLowerCase().includes(searchTerm.toLowerCase())
        return matchesSearch
    })

    // ═══════════════════════════════════════════════════════════════
    // Stats
    // ═══════════════════════════════════════════════════════════════
    const stats = {
        total: testimonials.length,
        published: testimonials.filter(t => t.published).length,
        featured: testimonials.filter(t => t.featured).length,
        verified: testimonials.filter(t => t.verified).length,
        avgRating: testimonials.length > 0
            ? (testimonials.reduce((acc, t) => acc + t.rating, 0) / testimonials.length).toFixed(1)
            : 0
    }

    // Render stars
    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <span key={i} className={i < rating ? 'text-yellow-400' : 'text-gray-300'}>★</span>
        ))
    }

    return (
        <AdminLayout title={isAr ? 'إدارة آراء العملاء' : 'Testimonials Management'}>
            {/* Header with Stats */}
            <div className="mb-8">
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white shadow-lg"
                    >
                        <div className="text-3xl font-bold mb-1">{stats.total}</div>
                        <div className="text-sm opacity-90">{isAr ? 'المجموع' : 'Total'}</div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white shadow-lg"
                    >
                        <div className="text-3xl font-bold mb-1">{stats.published}</div>
                        <div className="text-sm opacity-90">{isAr ? 'منشور' : 'Published'}</div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-xl p-6 text-white shadow-lg"
                    >
                        <div className="text-3xl font-bold mb-1">{stats.featured}</div>
                        <div className="text-sm opacity-90">⭐ {isAr ? 'مميز' : 'Featured'}</div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl p-6 text-white shadow-lg"
                    >
                        <div className="text-3xl font-bold mb-1">{stats.verified}</div>
                        <div className="text-sm opacity-90">✓ {isAr ? 'موثَّق' : 'Verified'}</div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-gradient-to-br from-pink-500 to-pink-600 rounded-xl p-6 text-white shadow-lg"
                    >
                        <div className="text-3xl font-bold mb-1">{stats.avgRating}</div>
                        <div className="text-sm opacity-90">{isAr ? 'متوسط التقييم' : 'Avg Rating'}</div>
                    </motion.div>
                </div>

                {/* Controls */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                    <div className="flex flex-wrap gap-4 w-full md:w-auto">
                        {/* Search */}
                        <div className="relative flex-1 min-w-[200px]">
                            <input
                                type="text"
                                placeholder={isAr ? 'ابحث...' : 'Search...'}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 pr-10 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                            />
                            <svg className="absolute right-3 top-3 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>

                        {/* Rating Filter */}
                        <select
                            value={ratingFilter}
                            onChange={(e) => setRatingFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                            <option value="all">{isAr ? 'كل التقييمات' : 'All Ratings'}</option>
                            <option value="5">⭐⭐⭐⭐⭐</option>
                            <option value="4">⭐⭐⭐⭐</option>
                            <option value="3">⭐⭐⭐</option>
                            <option value="2">⭐⭐</option>
                            <option value="1">⭐</option>
                        </select>

                        {/* Published Filter */}
                        <select
                            value={publishedFilter}
                            onChange={(e) => setPublishedFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                            <option value="all">{isAr ? 'الكل' : 'All Status'}</option>
                            <option value="true">{isAr ? 'منشور' : 'Published'}</option>
                            <option value="false">{isAr ? 'مسودة' : 'Draft'}</option>
                        </select>

                        {/* Verified Filter */}
                        <select
                            value={verifiedFilter}
                            onChange={(e) => setVerifiedFilter(e.target.value)}
                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        >
                            <option value="all">{isAr ? 'الكل' : 'All'}</option>
                            <option value="true">✓ {isAr ? 'موثَّق' : 'Verified'}</option>
                            <option value="false">{isAr ? 'غير موثَّق' : 'Unverified'}</option>
                        </select>
                    </div>

                    {/* Create Button */}
                    <button
                        onClick={handleCreate}
                        className="btn btn-primary px-6 py-2 whitespace-nowrap"
                    >
                        <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                        </svg>
                        {isAr ? 'إضافة رأي' : 'New Testimonial'}
                    </button>
                </div>
            </div>

            {/* Testimonials Grid */}
            {loading ? (
                <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">{isAr ? 'جاري التحميل...' : 'Loading...'}</p>
                </div>
            ) : filteredTestimonials.length === 0 ? (
                <div className="text-center py-20 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <div className="text-6xl mb-4">💬</div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {isAr ? 'لا توجد آراء' : 'No Testimonials'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {isAr ? 'ابدأ بإضافة رأي عميل' : 'Start by adding a customer testimonial'}
                    </p>
                    <button onClick={handleCreate} className="btn btn-primary">
                        {isAr ? 'إضافة رأي' : 'Add Testimonial'}
                    </button>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredTestimonials.map((testimonial, index) => (
                        <motion.div
                            key={testimonial.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
                        >
                            {/* Header */}
                            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-6 text-white relative">
                                {/* Customer Image or Placeholder */}
                                <div className="flex items-start gap-4">
                                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-3xl overflow-hidden flex-shrink-0">
                                        {testimonial.customerImage ? (
                                            <Image src={testimonial.customerImage} alt={testimonial.customerName} fill className="object-cover" sizes="64px" unoptimized />
                                        ) : (
                                            '👤'
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-bold text-lg mb-1">
                                            {isAr ? testimonial.customerNameAr || testimonial.customerName : testimonial.customerName}
                                        </h3>
                                        <div className="flex items-center gap-2 text-sm opacity-90 mb-2">
                                            <span>{getFlagEmoji(testimonial.countryCode)}</span>
                                            <span>{isAr ? testimonial.countryAr : testimonial.country}</span>
                                        </div>
                                        <div className="flex gap-1 text-lg">
                                            {renderStars(testimonial.rating)}
                                        </div>
                                    </div>
                                </div>

                                {/* Badges */}
                                <div className="absolute top-3 right-3 flex flex-col gap-2">
                                    {testimonial.published && (
                                        <span className="px-2 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                                            {isAr ? 'منشور' : 'Published'}
                                        </span>
                                    )}
                                    {testimonial.featured && (
                                        <span className="px-2 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full">
                                            ⭐ {isAr ? 'مميز' : 'Featured'}
                                        </span>
                                    )}
                                    {testimonial.verified && (
                                        <span className="px-2 py-1 bg-blue-500 text-white text-xs font-bold rounded-full">
                                            ✓ {isAr ? 'موثَّق' : 'Verified'}
                                        </span>
                                    )}
                                    {testimonial.hasVideo && (
                                        <span className="px-2 py-1 bg-red-500 text-white text-xs font-bold rounded-full">
                                            🎥 Video
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <p className="text-gray-700 dark:text-gray-300 mb-4 line-clamp-4 italic">
                                    &ldquo;{isAr ? testimonial.contentAr || testimonial.content : testimonial.content}&rdquo;
                                </p>

                                {testimonial.tourName && (
                                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex items-center gap-2">
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
                                        </svg>
                                        <span>{isAr ? testimonial.tourNameAr || testimonial.tourName : testimonial.tourName}</span>
                                    </div>
                                )}

                                <div className="text-xs text-gray-500 dark:text-gray-500 mb-4">
                                    {new Date(testimonial.date).toLocaleDateString(isAr ? 'ar-SA' : 'en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <button
                                        onClick={() => handleEdit(testimonial)}
                                        className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg text-sm font-semibold transition-colors"
                                    >
                                        {isAr ? 'تعديل' : 'Edit'}
                                    </button>
                                    <button
                                        onClick={() => handleDelete(testimonial.id)}
                                        disabled={deleting === testimonial.id}
                                        className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-semibold transition-colors disabled:opacity-50"
                                    >
                                        {deleting === testimonial.id ? '...' : (isAr ? 'حذف' : 'Delete')}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Modal - Will continue in next message due to length */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => !saving && setShowModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.95, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                        >
                            {/* Modal Header */}
                            <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-6 rounded-t-2xl z-10">
                                <div className="flex items-center justify-between">
                                    <h2 className="text-2xl font-bold">
                                        {modalMode === 'create'
                                            ? (isAr ? '💬 رأي عميل جديد' : '💬 New Testimonial')
                                            : (isAr ? '✏️ تعديل الرأي' : '✏️ Edit Testimonial')}
                                    </h2>
                                    <button
                                        onClick={() => !saving && setShowModal(false)}
                                        className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Modal Body */}
                            <form onSubmit={handleSubmit} className="p-6 space-y-6">
                                {/* Customer Name EN/AR */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            {isAr ? 'اسم العميل (EN)' : 'Customer Name (EN)'} *
                                        </label>
                                        <input
                                            type="text"
                                            required
                                            value={formData.customerName}
                                            onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            placeholder="John Doe"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            {isAr ? 'اسم العميل (AR)' : 'Customer Name (AR)'}
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.customerNameAr}
                                            onChange={(e) => setFormData({ ...formData, customerNameAr: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-right"
                                            dir="rtl"
                                            placeholder="جون دو"
                                        />
                                    </div>
                                </div>

                                {/* Email & Image */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            {isAr ? 'البريد الإلكتروني' : 'Email'}
                                        </label>
                                        <input
                                            type="email"
                                            value={formData.customerEmail}
                                            onChange={(e) => setFormData({ ...formData, customerEmail: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            placeholder="customer@example.com"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            {isAr ? 'رابط الصورة' : 'Image URL'}
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.customerImage}
                                            onChange={(e) => setFormData({ ...formData, customerImage: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            placeholder="https://..."
                                        />
                                    </div>
                                </div>

                                {/* Country */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            {isAr ? 'الدولة (EN)' : 'Country (EN)'} *
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.country}
                                            onChange={(e) => {
                                                const value = e.target.value
                                                const code = resolveCountryCode(value, 'en')
                                                setFormData({
                                                    ...formData,
                                                    country: value,
                                                    countryCode: code || formData.countryCode || ''
                                                })
                                            }}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            placeholder="Saudi Arabia"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            {isAr ? 'الدولة (AR)' : 'Country (AR)'} *
                                        </label>
                                        <input
                                            required
                                            type="text"
                                            value={formData.countryAr}
                                            onChange={(e) => {
                                                const value = e.target.value
                                                const code = resolveCountryCode(value, 'ar')
                                                setFormData({
                                                    ...formData,
                                                    countryAr: value,
                                                    countryCode: code || formData.countryCode || ''
                                                })
                                            }}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-right"
                                            placeholder="المملكة العربية السعودية"
                                            dir="rtl"
                                        />
                                    </div>
                                </div>

                                {/* Rating, Date */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            {isAr ? 'التقييم' : 'Rating'} *
                                        </label>
                                        <select
                                            required
                                            value={formData.rating}
                                            onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        >
                                            <option value="5">⭐⭐⭐⭐⭐ (5)</option>
                                            <option value="4">⭐⭐⭐⭐ (4)</option>
                                            <option value="3">⭐⭐⭐ (3)</option>
                                            <option value="2">⭐⭐ (2)</option>
                                            <option value="1">⭐ (1)</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            {isAr ? 'التاريخ' : 'Date'}
                                        </label>
                                        <input
                                            type="date"
                                            value={formData.date}
                                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                    </div>
                                </div>

                                {/* Content EN/AR */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            {isAr ? 'المحتوى (EN)' : 'Content (EN)'} *
                                        </label>
                                        <textarea
                                            required
                                            rows={5}
                                            value={formData.content}
                                            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            placeholder="Amazing experience..."
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            {isAr ? 'المحتوى (AR)' : 'Content (AR)'}
                                        </label>
                                        <textarea
                                            rows={5}
                                            value={formData.contentAr}
                                            onChange={(e) => setFormData({ ...formData, contentAr: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-right"
                                            dir="rtl"
                                            placeholder="تجربة رائعة..."
                                        />
                                    </div>
                                </div>

                                {/* Tour Name EN/AR */}
                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            {isAr ? 'اسم الرحلة (EN)' : 'Tour Name (EN)'}
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.tourName}
                                            onChange={(e) => setFormData({ ...formData, tourName: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            placeholder="Socotra Adventure Tour"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            {isAr ? 'اسم الرحلة (AR)' : 'Tour Name (AR)'}
                                        </label>
                                        <input
                                            type="text"
                                            value={formData.tourNameAr}
                                            onChange={(e) => setFormData({ ...formData, tourNameAr: e.target.value })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-right"
                                            dir="rtl"
                                            placeholder="رحلة مغامرة سقطرى"
                                        />
                                    </div>
                                </div>

                                {/* Video Section */}
                                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                    <label className="flex items-center gap-2 cursor-pointer mb-3">
                                        <input
                                            type="checkbox"
                                            checked={formData.hasVideo}
                                            onChange={(e) => setFormData({ ...formData, hasVideo: e.target.checked })}
                                            className="w-5 h-5 text-blue-600 rounded"
                                        />
                                        <span className="text-gray-700 dark:text-gray-300 font-semibold">
                                            🎥 {isAr ? 'شهادة فيديو' : 'Video Testimonial'}
                                        </span>
                                    </label>

                                    {formData.hasVideo && (
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                {isAr ? 'رابط الفيديو (YouTube/Vimeo)' : 'Video URL (YouTube/Vimeo)'}
                                            </label>
                                            <input
                                                type="text"
                                                value={formData.videoUrl}
                                                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                placeholder="https://youtube.com/watch?v=..."
                                            />
                                        </div>
                                    )}
                                </div>

                                {/* Toggles */}
                                <div className="flex flex-wrap gap-6">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.published}
                                            onChange={(e) => setFormData({ ...formData, published: e.target.checked })}
                                            className="w-5 h-5 text-green-600 rounded"
                                        />
                                        <span className="text-gray-700 dark:text-gray-300 font-semibold">
                                            {isAr ? 'نشر' : 'Published'}
                                        </span>
                                    </label>

                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.featured}
                                            onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                            className="w-5 h-5 text-yellow-600 rounded"
                                        />
                                        <span className="text-gray-700 dark:text-gray-300 font-semibold">
                                            ⭐ {isAr ? 'مميز' : 'Featured'}
                                        </span>
                                    </label>

                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={formData.verified}
                                            onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                                            className="w-5 h-5 text-blue-600 rounded"
                                        />
                                        <span className="text-gray-700 dark:text-gray-300 font-semibold">
                                            ✓ {isAr ? 'موثَّق' : 'Verified'}
                                        </span>
                                    </label>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        disabled={saving}
                                        className="flex-1 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors disabled:opacity-50"
                                    >
                                        {isAr ? 'إلغاء' : 'Cancel'}
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all disabled:opacity-50"
                                    >
                                        {saving
                                            ? (isAr ? 'جاري الحفظ...' : 'Saving...')
                                            : (isAr ? 'حفظ' : 'Save')}
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </AdminLayout>
    )
}
