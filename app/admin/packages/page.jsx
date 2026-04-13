'use client'

// ═══════════════════════════════════════════════════════════════════════
// 📦 Travel Packages Management (إدارة الباقات السياحية)
// ═══════════════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback } from 'react'
import { useApp } from '@/contexts/AppContext'
import EnhancedModal from '@/components/admin/EnhancedModal'
import { useEnhancedToast } from '@/components/admin/EnhancedToast'
import EmptyState from '@/components/admin/EmptyState'

export default function AdminPackagesPage() {
    const { locale, isRTL } = useApp()
    const toast = useEnhancedToast()
    const showToast = useCallback((message, type = 'success') => {
        if (toast[type]) {
            toast[type](message)
        } else {
            toast.info(message)
        }
    }, [toast])

    const [packages, setPackages] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [editingPackage, setEditingPackage] = useState(null)
    const [formData, setFormData] = useState({
        title: '',
        titleAr: '',
        price: '',
        duration: '',
        durationAr: '',
        features: [],
        featuresAr: [],
        gradient: 'from-gray-500 to-gray-700',
        isPopular: false,
        isFeatured: false,
        isActive: true,
        order: 0
    })

    // Feature Input State
    const [featureInput, setFeatureInput] = useState('')
    const [featureInputAr, setFeatureInputAr] = useState('')

    // ═══════════════════════════════════════════════════════════════
    // ✅ Fetch Packages
    // ═══════════════════════════════════════════════════════════════
    const fetchPackages = useCallback(async () => {
        try {
            setLoading(true)
            const url = typeof window !== 'undefined'
                ? new URL('/api/admin/packages', window.location.origin).toString()
                : '/api/admin/packages'
            const res = await fetch(url, { credentials: 'include' })
            const contentType = res.headers.get('content-type') || ''
            const data = contentType.includes('application/json')
                ? await res.json()
                : null

            if (!res.ok) {
                if (res.status === 401 || res.status === 403) {
                    if (typeof window !== 'undefined') {
                        window.location.href = '/admin/login'
                        return
                    }
                }
                throw new Error(data?.error || 'Failed to fetch packages')
            }

            if (data?.success) {
                const normalized = (data.data || []).map((pkg) => ({
                    ...pkg,
                    features: Array.isArray(pkg.features) ? pkg.features : [],
                    featuresAr: Array.isArray(pkg.featuresAr) ? pkg.featuresAr : []
                }))
                setPackages(normalized)
            } else {
                throw new Error(data?.error || 'Failed to fetch packages')
            }
        } catch (err) {
            console.error('Error fetching packages:', err)
            setError(err.message)
            showToast('Failed to load packages', 'error')
        } finally {
            setLoading(false)
        }
    }, [showToast])

    useEffect(() => {
        fetchPackages()
    }, [fetchPackages])

    // ═══════════════════════════════════════════════════════════════
    // ✅ Handlers
    // ═══════════════════════════════════════════════════════════════
    const handleOpenModal = (pkg = null) => {
        if (pkg) {
            setEditingPackage(pkg)
            const normalizedFeatures = Array.isArray(pkg.features) ? pkg.features : []
            const normalizedFeaturesAr = Array.isArray(pkg.featuresAr) ? pkg.featuresAr : []
            setFormData({
                title: pkg.title,
                titleAr: pkg.titleAr || '',
                price: pkg.price,
                duration: pkg.duration,
                durationAr: pkg.durationAr || '',
                features: normalizedFeatures,
                featuresAr: normalizedFeaturesAr,
                gradient: pkg.gradient || 'from-gray-500 to-gray-700',
                isPopular: pkg.isPopular,
                isFeatured: pkg.isFeatured,
                isActive: pkg.isActive,
                order: pkg.order || 0
            })
        } else {
            setEditingPackage(null)
            setFormData({
                title: '',
                titleAr: '',
                price: '',
                duration: '',
                durationAr: '',
                features: [],
                featuresAr: [],
                gradient: 'from-gray-500 to-gray-700',
                isPopular: false,
                isFeatured: false,
                isActive: true,
                order: packages.length + 1
            })
        }
        setIsModalOpen(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        try {
            const url = '/api/admin/packages'
            const method = editingPackage ? 'PUT' : 'POST'
            const body = editingPackage ? { ...formData, id: editingPackage.id } : formData

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })

            const data = await res.json()

            if (data.success) {
                showToast(editingPackage ? 'Package updated successfully' : 'Package created successfully', 'success')
                setIsModalOpen(false)
                fetchPackages()
            } else {
                throw new Error(data.error)
            }
        } catch (err) {
            console.error('Error saving package:', err)
            showToast(err.message || 'Failed to save package', 'error')
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this package?')) return

        try {
            const res = await fetch(`/api/admin/packages?id=${id}`, { method: 'DELETE' })
            const data = await res.json()

            if (data.success) {
                showToast('Package deleted successfully', 'success')
                fetchPackages()
            } else {
                throw new Error(data.error)
            }
        } catch (err) {
            console.error('Error deleting package:', err)
            showToast(err.message || 'Failed to delete package', 'error')
        }
    }

    // Feature Handlers
    const addFeature = (lang) => {
        if (lang === 'en' && featureInput.trim()) {
            setFormData(prev => ({
                ...prev,
                features: [...(Array.isArray(prev.features) ? prev.features : []), featureInput.trim()]
            }))
            setFeatureInput('')
        } else if (lang === 'ar' && featureInputAr.trim()) {
            setFormData(prev => ({
                ...prev,
                featuresAr: [...(Array.isArray(prev.featuresAr) ? prev.featuresAr : []), featureInputAr.trim()]
            }))
            setFeatureInputAr('')
        }
    }

    const removeFeature = (idx, lang) => {
        if (lang === 'en') {
            const current = Array.isArray(formData.features) ? formData.features : []
            setFormData(prev => ({ ...prev, features: current.filter((_, i) => i !== idx) }))
        } else {
            const current = Array.isArray(formData.featuresAr) ? formData.featuresAr : []
            setFormData(prev => ({ ...prev, featuresAr: current.filter((_, i) => i !== idx) }))
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // ✅ Loading State
    // ═══════════════════════════════════════════════════════════════
    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        )
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {locale === 'ar' ? 'إدارة الباقات السياحية' : 'Travel Packages Management'}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400">
                        {locale === 'ar' ? 'قم بإنشاء وتعديل باقات السفر' : 'Create and edit travel packages'}
                    </p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    {locale === 'ar' ? 'إضافة باقة' : 'Add Package'}
                </button>
            </div>



            {packages.length === 0 ? (
                <EmptyState
                    title={locale === 'ar' ? 'لا توجد باقات' : 'No Packages Found'}
                    description={locale === 'ar' ? 'قم بإضافة باقة جديدة للبدء' : 'Add a new package to get started'}
                    actionLabel={locale === 'ar' ? 'إضافة باقة' : 'Add Package'}
                    onAction={() => handleOpenModal()}
                    icon={
                        <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                        </svg>
                    }
                />
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {packages.map(pkg => {
                        const safeFeatures = locale === 'ar' ? (Array.isArray(pkg.featuresAr) ? pkg.featuresAr : []) : (Array.isArray(pkg.features) ? pkg.features : [])
                        return (
                        <div key={pkg.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl transition-shadow overflow-hidden border border-gray-100 dark:border-gray-700">
                            {/* Header with Gradient */}
                            <div className={`h-24 bg-gradient-to-r ${pkg.gradient} relative p-4 flex items-start justify-between`}>
                                <h3 className="text-white font-bold text-lg drop-shadow-md">
                                    {locale === 'ar' ? pkg.titleAr : pkg.title}
                                </h3>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => handleOpenModal(pkg)}
                                        className="p-1.5 bg-white/20 hover:bg-white/30 rounded-lg text-white transition backdrop-blur-sm"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                        </svg>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(pkg.id)}
                                        className="p-1.5 bg-red-500/20 hover:bg-red-500/40 rounded-lg text-white transition backdrop-blur-sm"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-6">
                                <div className="flex items-baseline mb-4">
                                    <span className="text-3xl font-bold text-gray-900 dark:text-white">${pkg.price}</span>
                                    <span className="text-gray-500 dark:text-gray-400 ml-2">/ {locale === 'ar' ? pkg.durationAr : pkg.duration}</span>
                                </div>

                                <div className="space-y-2 mb-4">
                                    {safeFeatures.slice(0, 3).map((feat, i) => (
                                        <div key={i} className="flex items-center text-sm text-gray-600 dark:text-gray-300">
                                            <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            {feat}
                                        </div>
                                    ))}
                                    {safeFeatures.length > 3 && (
                                        <div className="text-xs text-gray-400 italic pl-6">
                                            +{safeFeatures.length - 3} more features...
                                        </div>
                                    )}
                                </div>

                                <div className="flex gap-2">
                                    {pkg.isPopular && (
                                        <span className="px-2 py-1 text-xs font-semibold bg-green-100 text-green-700 rounded-full">
                                            {locale === 'ar' ? 'الأكثر شعبية' : 'Popular'}
                                        </span>
                                    )}
                                    {pkg.isFeatured && (
                                        <span className="px-2 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full">
                                            {locale === 'ar' ? 'مميز' : 'Featured'}
                                        </span>
                                    )}
                                    {!pkg.isActive && (
                                        <span className="px-2 py-1 text-xs font-semibold bg-gray-100 text-gray-600 rounded-full">
                                            {locale === 'ar' ? 'غير مفعل' : 'Inactive'}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>
                    )})}
                </div>
            )}

            {/* 
        ═══════════════════════════════════════════════════════════════
        📝 Edit/Create Modal
        ═══════════════════════════════════════════════════════════════
      */}
            <EnhancedModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingPackage
                    ? (locale === 'ar' ? 'تعديل الباقة' : 'Edit Package')
                    : (locale === 'ar' ? 'إضافة باقة جديدة' : 'Add New Package')}
                isAr={locale === 'ar'}
                showFooter={false}
            >
                <form onSubmit={handleSubmit} className="space-y-6 pr-2">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                {locale === 'ar' ? 'العنوان (إنجليزي)' : 'Title (EN)'}
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                required
                            />
                        </div>
                        <div className="rtl">
                            <label className="block text-sm font-medium mb-1 text-right">
                                {locale === 'ar' ? 'العنوان (عربي)' : 'Title (AR)'}
                            </label>
                            <input
                                type="text"
                                value={formData.titleAr}
                                onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-right"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                {locale === 'ar' ? 'السعر ($)' : 'Price ($)'}
                            </label>
                            <input
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                required
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                {locale === 'ar' ? 'المدة (إنجليزي)' : 'Duration (EN)'}
                            </label>
                            <input
                                type="text"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                placeholder={locale === 'ar' ? 'مثلاً 7 أيام (بالإنجليزي)' : 'e.g. 7 days'}
                                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                                required
                            />
                        </div>
                        <div className="rtl">
                            <label className="block text-sm font-medium mb-1 text-right">
                                {locale === 'ar' ? 'المدة (عربي)' : 'Duration (AR)'}
                            </label>
                            <input
                                type="text"
                                value={formData.durationAr}
                                onChange={(e) => setFormData({ ...formData, durationAr: e.target.value })}
                                placeholder={locale === 'ar' ? 'مثلاً 7 أيام' : 'e.g. 7 days'}
                                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600 text-right"
                                required
                            />
                        </div>
                    </div>

                    {/* Features Editor */}
                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                {locale === 'ar' ? 'المميزات (إنجليزي)' : 'Features (EN)'}
                            </label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={featureInput}
                                    onChange={(e) => setFeatureInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature('en'))}
                                    placeholder={locale === 'ar' ? 'أضف ميزة بالإنجليزي...' : 'Add feature...'}
                                    className="flex-1 px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600"
                                />
                                <button type="button" onClick={() => addFeature('en')} className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700">+</button>
                            </div>
                            <ul className="space-y-1 max-h-40 overflow-y-auto pl-1">
                                {(Array.isArray(formData.features) ? formData.features : []).map((f, i) => (
                                    <li key={i} className="flex justify-between items-center text-sm bg-gray-50 dark:bg-gray-700/50 px-2 py-1 rounded">
                                        <span>{f}</span>
                                        <button type="button" onClick={() => removeFeature(i, 'en')} className="text-red-500 hover:text-red-700">×</button>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="rtl">
                            <label className="block text-sm font-medium mb-2 text-right">
                                {locale === 'ar' ? 'المميزات (عربي)' : 'Features (AR)'}
                            </label>
                            <div className="flex gap-2 mb-2">
                                <input
                                    type="text"
                                    value={featureInputAr}
                                    onChange={(e) => setFeatureInputAr(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFeature('ar'))}
                                    placeholder={locale === 'ar' ? 'أضف ميزة...' : 'Add feature (AR)...'}
                                    className="flex-1 px-3 py-2 border rounded-lg text-sm dark:bg-gray-700 dark:border-gray-600 text-right"
                                />
                                <button type="button" onClick={() => addFeature('ar')} className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-gray-700">+</button>
                            </div>
                            <ul className="space-y-1 max-h-40 overflow-y-auto pr-1">
                                {(Array.isArray(formData.featuresAr) ? formData.featuresAr : []).map((f, i) => (
                                    <li key={i} className="flex justify-between items-center text-sm bg-gray-50 dark:bg-gray-700/50 px-2 py-1 rounded">
                                        <span>{f}</span>
                                        <button type="button" onClick={() => removeFeature(i, 'ar')} className="text-red-500 hover:text-red-700">×</button>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1">
                                {locale === 'ar' ? 'سِمة اللون' : 'Color Theme'}
                            </label>
                            <select
                                value={formData.gradient}
                                onChange={(e) => setFormData({ ...formData, gradient: e.target.value })}
                                className="w-full px-4 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
                            >
                                <option value="from-gray-500 to-gray-700">
                                    {locale === 'ar' ? 'رمادي (أساسي)' : 'Gray (Basic)'}
                                </option>
                                <option value="from-green-500 to-emerald-600">
                                    {locale === 'ar' ? 'أخضر (قياسي)' : 'Green (Standard)'}
                                </option>
                                <option value="from-purple-500 to-pink-600">
                                    {locale === 'ar' ? 'بنفسجي (فاخر)' : 'Purple (Premium)'}
                                </option>
                                <option value="from-blue-500 to-indigo-600">
                                    {locale === 'ar' ? 'أزرق' : 'Blue'}
                                </option>
                                <option value="from-orange-500 to-red-600">
                                    {locale === 'ar' ? 'برتقالي' : 'Orange'}
                                </option>
                                <option value="from-teal-500 to-cyan-600">
                                    {locale === 'ar' ? 'تركواز' : 'Teal'}
                                </option>
                            </select>
                            <div className={`mt-2 h-4 rounded w-full bg-gradient-to-r ${formData.gradient}`}></div>
                        </div>

                        <div className="flex flex-col gap-2 pt-6">
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.isPopular}
                                    onChange={(e) => setFormData({ ...formData, isPopular: e.target.checked })}
                                    className="w-4 h-4 rounded text-blue-600"
                                />
                                <span>{locale === 'ar' ? 'الأكثر شعبية' : 'Popular Tag'}</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.isFeatured}
                                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                                    className="w-4 h-4 rounded text-blue-600"
                                />
                                <span>{locale === 'ar' ? 'مميزة' : 'Featured'}</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={formData.isActive}
                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                    className="w-4 h-4 rounded text-blue-600"
                                />
                                <span>{locale === 'ar' ? 'مفعلة' : 'Active'}</span>
                            </label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <button
                            type="button"
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                        >
                            {locale === 'ar' ? 'إلغاء' : 'Cancel'}
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all transform hover:scale-105"
                        >
                            {locale === 'ar' ? 'حفظ التغييرات' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </EnhancedModal>
        </div>
    )
}
