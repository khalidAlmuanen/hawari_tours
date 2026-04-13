'use client'

// ═══════════════════════════════════════════════════════════════════════
// 💬 REVIEWS MANAGEMENT - Premium Glassmorphism Redesign
// إدارة تقييمات الرحلات - تصميم زجاجي فاخر
// ═══════════════════════════════════════════════════════════════════════

import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useApp } from '@/contexts/AppContext'
import AdminLayout from '@/components/admin/AdminLayout'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import {
    Star,
    Search,
    Filter,
    Download,
    Trash2,
    CheckCircle2,
    XCircle,
    X,
    MoreHorizontal,
    Quote,
    Calendar,
    MapPin,
    User,
    AlertTriangle
} from 'lucide-react'

// ✨ NEW: Enhanced UI/UX Components
import {
    SkeletonStatCard,
    SkeletonReviewCard,
    EmptyStates,
    useBulkSelection,
    BulkActionsBar,
    BulkCheckbox,
    BulkActionPresets,
    useEnhancedToast,
    useKeyboardShortcuts,
    Breadcrumbs,
    BreadcrumbPresets,
    exportData,
    EXPORT_FORMATS
} from '@/components/admin'

// 🎨 Custom Number Counter Component
const AnimatedCounter = ({ value }) => {
    return (
        <span className="tabular-nums">
            {value}
        </span>
    )
}

export default function ReviewsManagement() {
    const { locale } = useApp()
    const isAr = locale === 'ar'
    const toast = useEnhancedToast()
    const searchInputRef = useRef(null)
    const toastRef = useRef(toast)

    // State
    const [loading, setLoading] = useState(true)
    const [reviews, setReviews] = useState([])
    const [stats, setStats] = useState(null)
    const [selectedReview, setSelectedReview] = useState(null)
    const [showModal, setShowModal] = useState(false)

    // Filters
    const [filterApproved, setFilterApproved] = useState('all')
    const [filterRating, setFilterRating] = useState('all')
    const [searchQuery, setSearchQuery] = useState('')
    const [debouncedSearch, setDebouncedSearch] = useState('')
    const [showExportMenu, setShowExportMenu] = useState(false)

    // Bulk Selection
    const bulkSelection = useBulkSelection(reviews)

    // ═══════════════════════════════════════════════════════════════
    // Fetch Reviews
    // ═══════════════════════════════════════════════════════════════
    useEffect(() => {
        toastRef.current = toast
    }, [toast])

    const fetchReviews = useCallback(async () => {
        try {
            setLoading(true)
            const params = new URLSearchParams()
            if (filterApproved !== 'all') params.append('approved', filterApproved)
            if (filterRating !== 'all') params.append('rating', filterRating)
            if (debouncedSearch) params.append('search', debouncedSearch)

            const response = await fetch(`/api/admin/reviews?${params}`)
            const result = await response.json()

            if (result.success) {
                setReviews(result.data)
                setStats(result.stats)
            } else {
                toastRef.current.error(isAr ? 'فشل جلب التقييمات' : 'Failed to fetch reviews')
            }
        } catch (error) {
            console.error('Error fetching reviews:', error)
            toastRef.current.error(isAr ? 'خطأ في جلب التقييمات' : 'Error fetching reviews')
        } finally {
            setLoading(false)
        }
    }, [filterApproved, filterRating, isAr, debouncedSearch])

    useEffect(() => {
        fetchReviews()
    }, [fetchReviews])

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(searchQuery)
        }, 400)
        return () => clearTimeout(timer)
    }, [searchQuery])

    // ═══════════════════════════════════════════════════════════════
    // Actions
    // ═══════════════════════════════════════════════════════════════
    const handleToggleApproval = async (review) => {
        try {
            const response = await fetch('/api/admin/reviews', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id: review.id,
                    approved: !review.approved
                })
            })

            const result = await response.json()

            if (result.success) {
                toast.success(
                    review.approved
                        ? (isAr ? 'تم إلغاء الاعتماد!' : 'Review rejected!')
                        : (isAr ? 'تم الاعتماد!' : 'Review approved!')
                )
                fetchReviews()
            } else {
                toast.error(result.error || 'Operation failed')
            }
        } catch (error) {
            toast.error(isAr ? 'خطأ في تحديث التقييم' : 'Error updating review')
        }
    }

    const handleDelete = async (id) => {
        // Custom confirmation toast could be used here, but simple confirm for now
        if (!confirm(isAr ? 'هل أنت متأكد من الحذف؟' : 'Are you sure you want to delete?')) return

        try {
            const response = await fetch(`/api/admin/reviews?id=${id}`, { method: 'DELETE' })
            const result = await response.json()

            if (result.success) {
                toast.success(isAr ? 'تم حذف التقييم' : 'Review deleted')
                fetchReviews()
            } else {
                toast.error(result.error || 'Delete failed')
            }
        } catch (error) {
            toast.error(isAr ? 'خطأ في حذف التقييم' : 'Error deleting review')
        }
    }

    // Bulk Actions
    const handleBulkApprove = async () => {
        const selectedIds = bulkSelection.getSelectedItems().map(r => r.id)
        try {
            await Promise.all(selectedIds.map(id =>
                fetch('/api/admin/reviews', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id, approved: true })
                })
            ))
            toast.success(`${selectedIds.length} ${isAr ? 'تم اعتمادها' : 'approved'}!`)
            bulkSelection.clearSelection()
            fetchReviews()
        } catch (e) { toast.error(isAr ? 'فشل تنفيذ الإجراء الجماعي' : 'Bulk action failed') }
    }

    const handleBulkReject = async () => {
        const selectedIds = bulkSelection.getSelectedItems().map(r => r.id)
        try {
            await Promise.all(selectedIds.map(id =>
                fetch('/api/admin/reviews', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id, approved: false })
                })
            ))
            toast.success(`${selectedIds.length} ${isAr ? 'تم رفضها' : 'rejected'}!`)
            bulkSelection.clearSelection()
            fetchReviews()
        } catch (e) { toast.error(isAr ? 'فشل تنفيذ الإجراء الجماعي' : 'Bulk action failed') }
    }

    const handleBulkDelete = async () => {
        if (!confirm(isAr ? 'هل أنت متأكد من الحذف؟' : 'Are you sure you want to delete?')) return
        const selectedIds = bulkSelection.getSelectedItems().map(r => r.id)
        try {
            await Promise.all(selectedIds.map(id => fetch(`/api/admin/reviews?id=${id}`, { method: 'DELETE' })))
            toast.success(`${selectedIds.length} ${isAr ? 'تم حذفها' : 'deleted'}!`)
            bulkSelection.clearSelection()
            fetchReviews()
        } catch (e) { toast.error(isAr ? 'فشل حذف العناصر المحددة' : 'Bulk delete failed') }
    }

    // ═══════════════════════════════════════════════════════════════
    // Helpers
    // ═══════════════════════════════════════════════════════════════
    const formatDate = useCallback((value, options) => {
        if (!value) return isAr ? 'غير متوفر' : 'N/A'
        const date = new Date(value)
        if (Number.isNaN(date.getTime())) return isAr ? 'غير متوفر' : 'N/A'
        return date.toLocaleString(isAr ? 'ar' : 'en-US', options)
    }, [isAr])

    const renderStars = (rating) => (
        <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map(star => (
                <Star
                    key={star}
                    className={`w-4 h-4 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300 dark:text-gray-600'}`}
                />
            ))}
        </div>
    )

    const exportRows = useMemo(() => {
        return reviews.map(review => ({
            [isAr ? 'المعرف' : 'ID']: review.id,
            [isAr ? 'المستخدم' : 'User']: review.user?.name || (isAr ? 'زائر' : 'Guest'),
            [isAr ? 'البريد الإلكتروني' : 'Email']: review.user?.email || (isAr ? 'غير متوفر' : 'N/A'),
            [isAr ? 'الرحلة' : 'Tour']: isAr ? review.tour?.titleAr : review.tour?.title,
            [isAr ? 'التقييم' : 'Rating']: review.rating,
            [isAr ? 'العنوان' : 'Title']: review.title,
            [isAr ? 'المحتوى' : 'Comment']: review.comment,
            [isAr ? 'الحالة' : 'Status']: review.approved ? (isAr ? 'مُعتمد' : 'Approved') : (isAr ? 'قيد المراجعة' : 'Pending'),
            [isAr ? 'التاريخ' : 'Date']: formatDate(review.createdAt)
        }))
    }, [reviews, isAr, formatDate])

    const handleExport = (format) => {
        exportData(exportRows, format, `reviews_export_${new Date().toISOString().slice(0, 10)}`)
        toast.success(isAr ? 'تم التصدير بنجاح!' : 'Exported successfully!')
    }

    useKeyboardShortcuts({
        'Ctrl+K': () => searchInputRef.current?.focus(),
        '/': () => searchInputRef.current?.focus(),
        'Ctrl+E': () => {
            if (exportRows.length > 0) {
                handleExport('excel')
            }
        },
        'Escape': () => {
            if (showModal) setShowModal(false)
            if (bulkSelection.selectedCount > 0) bulkSelection.clearSelection()
        }
    })

    // ═══════════════════════════════════════════════════════════════
    // UI Components
    // ═══════════════════════════════════════════════════════════════

    // Glassy Stat Card
    const StatCard = ({ title, value, icon: Icon, gradient, delay }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay, duration: 0.5, type: 'spring' }}
            className={`relative overflow-hidden rounded-3xl p-6 text-white shadow-xl ${gradient}`}
        >
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 blur-2xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-black/10 rounded-full -ml-12 -mb-12 blur-2xl pointer-events-none" />

            <div className="relative flex justify-between items-start">
                <div>
                    <p className="text-blue-50/80 font-medium text-sm mb-1">{title}</p>
                    <h3 className="text-4xl font-bold tracking-tight">
                        <AnimatedCounter value={value} />
                    </h3>
                </div>
                <div className="p-3 bg-white/20 backdrop-blur-md rounded-2xl shadow-lg">
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
        </motion.div>
    )

    return (
        <AdminLayout title={isAr ? 'إدارة التقييمات' : 'Reviews Management'}>
            <Breadcrumbs items={BreadcrumbPresets.reviews()} />

            {/* 📊 Stats Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    title={isAr ? 'إجمالي التقييمات' : 'Total Reviews'}
                    value={stats?.total || 0}
                    icon={Quote}
                    gradient="bg-gradient-to-br from-blue-600 to-indigo-600"
                    delay={0}
                />
                <StatCard
                    title={isAr ? 'التقييمات المعتمدة' : 'Approved Reviews'}
                    value={stats?.approved || 0}
                    icon={CheckCircle2}
                    gradient="bg-gradient-to-br from-emerald-500 to-teal-600"
                    delay={0.1}
                />
                <StatCard
                    title={isAr ? 'قيد المراجعة' : 'Pending Reviews'}
                    value={stats?.pending || 0}
                    icon={AlertTriangle}
                    gradient="bg-gradient-to-br from-amber-500 to-orange-600"
                    delay={0.2}
                />
                <StatCard
                    title={isAr ? 'متوسط التقييم' : 'Average Rating'}
                    value={stats?.avgRating?.toFixed(1) || '0.0'}
                    icon={Star}
                    gradient="bg-gradient-to-br from-violet-600 to-purple-600"
                    delay={0.3}
                />
            </div>

            {/* 🔍 Controls Section (Glass Island) */}
            <div className="mb-8 p-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700/50 flex flex-col lg:flex-row gap-4 items-center">
                <div className="relative flex-1 w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 rtl:right-3 rtl:left-auto" />
                    <input
                        ref={searchInputRef}
                        type="text"
                        placeholder={isAr ? 'ابحث عن تقييم...' : 'Search reviews...'}
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all rtl:pr-10 rtl:pl-4"
                    />
                </div>

                <div className="flex gap-3 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
                    <select
                        value={filterApproved}
                        onChange={(e) => setFilterApproved(e.target.value)}
                        className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">{isAr ? 'كل الحالات' : 'All Status'}</option>
                        <option value="true">{isAr ? 'مُعتمد' : 'Approved'}</option>
                        <option value="false">{isAr ? 'قيد المراجعة' : 'Pending'}</option>
                    </select>

                    <select
                        value={filterRating}
                        onChange={(e) => setFilterRating(e.target.value)}
                        className="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">{isAr ? 'كل التقييمات' : 'All Ratings'}</option>
                        <option value="5">⭐⭐⭐⭐⭐</option>
                        <option value="4">⭐⭐⭐⭐</option>
                        <option value="3">⭐⭐⭐</option>
                        <option value="2">⭐⭐</option>
                        <option value="1">⭐</option>
                    </select>

                    <button
                        onClick={fetchReviews}
                        className="px-6 py-3 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 rounded-xl font-bold shadow-lg active:scale-95 transition-all flex items-center gap-2 whitespace-nowrap"
                    >
                        🔄 {isAr ? 'تحديث' : 'Refresh'}
                    </button>
                    <div className="relative">
                        <button
                            onClick={() => setShowExportMenu(prev => !prev)}
                            disabled={exportRows.length === 0}
                            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-2 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Download className="w-5 h-5" />
                            {isAr ? 'تصدير' : 'Export'}
                        </button>
                        <AnimatePresence>
                            {showExportMenu && (
                                <motion.div
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 8 }}
                                    className={`absolute ${isAr ? 'right-0' : 'left-0'} mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden z-20`}
                                >
                                    {EXPORT_FORMATS.map((format) => (
                                        <button
                                            key={format.value}
                                            onClick={() => { handleExport(format.value); setShowExportMenu(false) }}
                                            className="w-full px-4 py-3 text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                                        >
                                            <span>{format.icon}</span>
                                            <span>{format.label}</span>
                                        </button>
                                    ))}
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>

            {/* 📝 Reviews Grid */}
            {loading && !reviews.length ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => <SkeletonReviewCard key={i} />)}
                </div>
            ) : reviews.length === 0 ? (
                <EmptyStates.NoReviews />
            ) : (
                <>
                    {/* Bulk Actions Header */}
                    <AnimatePresence>
                        {bulkSelection.selectedCount > 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: -20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className="mb-6 p-4 bg-blue-600 text-white rounded-xl shadow-lg flex items-center justify-between"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="font-bold text-lg">{bulkSelection.selectedCount}</span>
                                    <span>{isAr ? 'عنصر محدد' : 'selected'}</span>
                                </div>
                                <div className="flex gap-2">
                                    <button onClick={handleBulkApprove} className="p-2 hover:bg-white/20 rounded-lg transition-colors" title={isAr ? 'اعتماد' : 'Approve'}>
                                        <CheckCircle2 className="w-5 h-5" />
                                    </button>
                                    <button onClick={handleBulkReject} className="p-2 hover:bg-white/20 rounded-lg transition-colors" title={isAr ? 'رفض' : 'Reject'}>
                                        <XCircle className="w-5 h-5" />
                                    </button>
                                    <div className="h-6 w-px bg-white/20 mx-2" />
                                    <button onClick={handleBulkDelete} className="p-2 hover:bg-red-500/50 rounded-lg transition-colors" title={isAr ? 'حذف' : 'Delete'}>
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                        <AnimatePresence mode="popLayout">
                            {reviews.map((review, index) => (
                                <motion.div
                                    layout
                                    key={review.id}
                                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                    className={`
                                        group relative
                                        bg-white dark:bg-gray-800 
                                        rounded-3xl p-6 
                                        shadow-lg hover:shadow-2xl 
                                        border border-gray-100 dark:border-gray-700
                                        transition-all duration-300
                                        ${bulkSelection.isSelected(review.id) ? 'ring-2 ring-blue-500 bg-blue-50/50 dark:bg-blue-900/10' : ''}
                                    `}
                                >
                                    {/* Select Checkbox (Absolute) */}
                                    <div className="absolute top-4 right-4 z-10 rtl:right-auto rtl:left-4">
                                        <BulkCheckbox
                                            checked={bulkSelection.isSelected(review.id)}
                                            onChange={() => bulkSelection.toggleItem(review.id)}
                                        />
                                    </div>

                                    {/* Header: User Info */}
                                    <div className="flex items-start gap-4 mb-4">
                                        <div className="relative">
                                            {review.user?.avatar ? (
                                                <div className="relative w-12 h-12 rounded-2xl shadow-sm overflow-hidden">
                                                    <Image
                                                        src={review.user.avatar}
                                                        alt={review.user.name}
                                                        fill
                                                        className="object-cover"
                                                        sizes="48px"
                                                        unoptimized
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-sm">
                                                    {review.user?.name?.[0]?.toUpperCase() || 'U'}
                                                </div>
                                            )}
                                            <div className="absolute -bottom-1 -right-1 bg-white dark:bg-gray-800 rounded-full p-0.5 shadow-sm">
                                                {review.approved ?
                                                    <CheckCircle2 className="w-4 h-4 text-emerald-500 fill-emerald-50" /> :
                                                    <AlertTriangle className="w-4 h-4 text-amber-500 fill-amber-50" />
                                                }
                                            </div>
                                        </div>
                                        <div className="flex-1 min-w-0 pt-0.5">
                                            <h4 className="font-bold text-gray-900 dark:text-gray-100 truncate">
                                            {review.user?.name || (isAr ? 'زائر' : 'Anonymous')}
                                            </h4>
                                            <div className="flex items-center gap-2 mt-0.5">
                                                {renderStars(review.rating)}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Tour Badge */}
                                    <div className="mb-4 inline-flex items-center gap-1.5 px-3 py-1 bg-gray-100 dark:bg-gray-700/50 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300 w-full">
                                        <MapPin className="w-3.5 h-3.5 text-gray-400" />
                                        <span className="truncate flex-1">
                                            {isAr ? review.tour?.titleAr : review.tour?.title}
                                        </span>
                                    </div>

                                    {/* Content (Quote style) */}
                                    <div className="mb-6 relative">
                                        <Quote className="absolute -top-2 -left-1 w-6 h-6 text-gray-200 dark:text-gray-700 -z-10 transform scale-x-[-1]" />
                                        <h5 className="font-bold text-gray-800 dark:text-gray-200 mb-1 line-clamp-1">
                                            {review.title}
                                        </h5>
                                        <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed line-clamp-3">
                                            {review.comment}
                                        </p>
                                    </div>

                                    {/* Footer: Date & Actions */}
                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700/50">
                                        <div className="flex items-center gap-1.5 text-xs text-gray-400">
                                            <Calendar className="w-3.5 h-3.5" />
                                            <span>
                                                {formatDate(review.createdAt, { month: 'short', day: 'numeric', year: 'numeric' })}
                                            </span>
                                        </div>

                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleToggleApproval(review)}
                                                className={`
                                                    p-2 rounded-xl transition-all
                                                    ${review.approved
                                                        ? 'bg-amber-100 text-amber-600 hover:bg-amber-200 dark:bg-amber-900/30 dark:text-amber-400'
                                                        : 'bg-emerald-100 text-emerald-600 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400'
                                                    }
                                                `}
                                                title={review.approved ? (isAr ? 'رفض' : 'Reject') : (isAr ? 'اعتماد' : 'Approve')}
                                            >
                                                {review.approved ? <XCircle className="w-4 h-4" /> : <CheckCircle2 className="w-4 h-4" />}
                                            </button>

                                            <button
                                                onClick={() => {
                                                    setSelectedReview(review)
                                                    setShowModal(true)
                                                }}
                                                className="p-2 rounded-xl bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-gray-700/50 dark:text-gray-400 dark:hover:bg-gray-600 transition-all"
                                                title={isAr ? 'عرض التفاصيل' : 'View Details'}
                                            >
                                                <MoreHorizontal className="w-4 h-4" />
                                            </button>

                                            <button
                                                onClick={() => handleDelete(review.id)}
                                                className="p-2 rounded-xl bg-red-50 text-red-500 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 transition-all"
                                                title={isAr ? 'حذف' : 'Delete'}
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>

                    {/* Pagination or Load More could go here */}
                </>
            )}

            {/* Bulk Actions Fixed Bar (Bottom) - Optional */}
            <BulkActionsBar
                selectedCount={bulkSelection.selectedCount}
                onClear={bulkSelection.clearSelection}
                actions={BulkActionPresets.reviews(
                    handleBulkApprove,
                    handleBulkReject,
                    handleBulkDelete
                )}
                isAr={isAr}
            />

            {/* Details Modal */}
            <AnimatePresence>
                {showModal && selectedReview && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={e => e.stopPropagation()}
                            className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden"
                        >
                            {/* Modal Header */}
                            <div className="relative h-32 bg-gradient-to-r from-blue-600 to-indigo-600">
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="absolute top-4 right-4 p-2 bg-black/20 hover:bg-black/30 text-white rounded-full transition-colors rtl:right-auto rtl:left-4"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                                <div className="absolute -bottom-10 left-8 rtl:left-auto rtl:right-8">
                                    <div className="w-20 h-20 rounded-3xl bg-white dark:bg-gray-800 p-1 shadow-xl">
                                        {selectedReview.user?.avatar ? (
                                            <div className="relative w-full h-full rounded-2xl overflow-hidden">
                                                <Image
                                                    src={selectedReview.user.avatar}
                                                    alt={selectedReview.user?.name || 'User'}
                                                    fill
                                                    className="object-cover"
                                                    sizes="80px"
                                                    unoptimized
                                                />
                                            </div>
                                        ) : (
                                            <div className="w-full h-full bg-indigo-100 dark:bg-indigo-900 rounded-2xl flex items-center justify-center text-3xl">
                                                {selectedReview.user?.name?.[0]}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Modal Content */}
                            <div className="pt-12 px-8 pb-8">
                                <div className="flex justify-between items-start mb-6">
                                    <div>
                                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {selectedReview.user?.name || (isAr ? 'زائر' : 'Guest User')}
                                        </h3>
                                        <p className="text-gray-500">{selectedReview.user?.email}</p>
                                    </div>
                                    <div className="flex flex-col items-end gap-2">
                                        <div className="flex gap-1">{renderStars(selectedReview.rating)}</div>
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${selectedReview.approved ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                                            {selectedReview.approved ? (isAr ? 'مُعتمد' : 'Approved') : (isAr ? 'معلق' : 'Pending')}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-2xl">
                                        <h4 className="flex items-center gap-2 text-sm font-bold text-gray-500 uppercase tracking-wider mb-2">
                                            <MapPin className="w-4 h-4" />
                                            {isAr ? 'الرحلة' : 'Tour'}
                                        </h4>
                                        <p className="font-semibold text-lg text-gray-900 dark:text-white">
                                            {isAr ? selectedReview.tour?.titleAr : selectedReview.tour?.title}
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                            {selectedReview.title}
                                        </h4>
                                        <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                                            &ldquo;{selectedReview.comment}&rdquo;
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-6 pt-6 border-t border-gray-100 dark:border-gray-700">
                                        <div className="flex items-center gap-2 text-gray-500">
                                            <Calendar className="w-5 h-5" />
                                            <span>
                                                {formatDate(selectedReview.createdAt)}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Modal Actions */}
                                <div className="flex gap-4 mt-8">
                                    <button
                                        onClick={() => {
                                            handleToggleApproval(selectedReview)
                                            setShowModal(false)
                                        }}
                                        className={`flex-1 py-3 rounded-xl font-bold text-white transition-all shadow-lg ${selectedReview.approved
                                            ? 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20'
                                            : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20'
                                            }`}
                                    >
                                        {selectedReview.approved
                                            ? (isAr ? 'إلغاء الاعتماد' : 'Reject Review')
                                            : (isAr ? 'اعتماد التقييم' : 'Approve Review')
                                        }
                                    </button>
                                    <button
                                        onClick={() => {
                                            handleDelete(selectedReview.id)
                                            setShowModal(false)
                                        }}
                                        className="px-6 py-3 bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 rounded-xl font-bold transition-colors"
                                    >
                                        {isAr ? 'حذف' : 'Delete'}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </AdminLayout>
    )
}
