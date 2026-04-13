'use client'

// ═══════════════════════════════════════════════════════════════════════
// 🏛️ HISTORY CONTENT MANAGEMENT - Professional & Modern Admin
// إدارة المحتوى التاريخي - لوحة تحكم احترافية
// ═══════════════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback } from 'react'
import { useApp } from '@/contexts/AppContext'
import AdminLayout from '@/components/admin/AdminLayout'
import { useToast } from '@/components/admin/Toast'
import ImageUploader from '@/components/admin/ImageUploader'
import { motion, AnimatePresence } from 'framer-motion'

export default function HistoryManagement() {
    const { locale } = useApp()
    const { success, error: showError } = useToast()
    const isAr = locale === 'ar'

    // State
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('timeline')
    const [content, setContent] = useState({
        timelineEvents: [],
        archaeologicalSites: [],
        historicalSections: {},
        pageSettings: {}
    })

    // Modal states
    const [showModal, setShowModal] = useState(false)
    const [modalMode, setModalMode] = useState('create') // create / edit
    const [modalType, setModalType] = useState('timeline') // timeline / site
    const [selectedItem, setSelectedItem] = useState(null)
    const [saving, setSaving] = useState(false)

    // Form data
    const [formData, setFormData] = useState({})
    const [timelineSearch, setTimelineSearch] = useState('')
    const [timelineEra, setTimelineEra] = useState('all')
    const [timelineStatus, setTimelineStatus] = useState('all')
    const [siteSearch, setSiteSearch] = useState('')
    const [siteStatus, setSiteStatus] = useState('all')
    const [siteFeatured, setSiteFeatured] = useState('all')

    // Era options for timeline
    const eraOptions = [
        { value: 'ancient', labelEn: 'Ancient History', labelAr: 'التاريخ القديم' },
        { value: 'colonial', labelEn: 'Colonial Era', labelAr: 'العصر الاستعماري' },
        { value: 'modern', labelEn: 'Modern Era', labelAr: 'العصر الحديث' }
    ]

    // Color gradient options
    const colorOptions = [
        { value: 'from-blue-500 to-cyan-600', label: '🔵 Blue-Cyan' },
        { value: 'from-amber-500 to-orange-600', label: '🟠 Amber-Orange' },
        { value: 'from-purple-500 to-pink-600', label: '🟣 Purple-Pink' },
        { value: 'from-green-500 to-emerald-600', label: '🟢 Green-Emerald' },
        { value: 'from-red-500 to-rose-600', label: '🔴 Red-Rose' },
        { value: 'from-yellow-500 to-amber-600', label: '🟡 Yellow-Amber' },
        { value: 'from-indigo-500 to-blue-600', label: '🔷 Indigo-Blue' },
        { value: 'from-gray-500 to-slate-600', label: '⚫ Gray-Slate' },
        { value: 'from-teal-500 to-cyan-600', label: '🟦 Teal-Cyan' }
    ]

    // Tabs
    const tabs = [
        { id: 'timeline', icon: '📅', labelEn: 'Timeline Events', labelAr: 'الأحداث الزمنية' },
        { id: 'sites', icon: '🏛️', labelEn: 'Archaeological Sites', labelAr: 'المواقع الأثرية' },
        { id: 'sections', icon: '📖', labelEn: 'Historical Sections', labelAr: 'الأقسام التاريخية' },
        { id: 'settings', icon: '⚙️', labelEn: 'General Settings', labelAr: 'الإعدادات العامة' }
    ]

    // ═══════════════════════════════════════════════════════════════
    // Fetch Content
    // ═══════════════════════════════════════════════════════════════
    const fetchContent = useCallback(async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/admin/history')
            const result = await response.json()

            if (result.success) {
                setContent(result.data)
            } else {
                showError('Failed to fetch content')
            }
        } catch (error) {
            console.error('Error fetching content:', error)
            showError('Error fetching content')
        } finally {
            setLoading(false)
        }
    }, [showError])

    useEffect(() => {
        fetchContent()
    }, [fetchContent])

    // ═══════════════════════════════════════════════════════════════
    // Open Modal for Create/Edit
    // ═══════════════════════════════════════════════════════════════
    const openModal = (mode, type, item = null) => {
        setModalMode(mode)
        setModalType(type)
        setSelectedItem(item)

        if (mode === 'create') {
            if (type === 'timeline') {
                setFormData({
                    year: '',
                    yearEn: '',
                    era: 'ancient',
                    titleEn: '',
                    titleAr: '',
                    descriptionEn: '',
                    descriptionAr: '',
                    icon: '🏺',
                    color: 'from-blue-500 to-cyan-600',
                    isActive: true
                })
            } else if (type === 'site') {
                setFormData({
                    nameEn: '',
                    nameAr: '',
                    periodEn: '',
                    periodAr: '',
                    descriptionEn: '',
                    descriptionAr: '',
                    significanceEn: '',
                    significanceAr: '',
                    locationEn: '',
                    locationAr: '',
                    accessEn: '',
                    accessAr: '',
                    gradient: 'from-amber-500 to-orange-600',
                    imageUrl: '',
                    isActive: true,
                    featured: false
                })
            }
        } else {
            if (type === 'timeline') {
                setFormData({
                    ...item,
                    year: item?.year || '',
                    yearEn: item?.yearEn || ''
                })
            } else {
                setFormData(item || {})
            }
        }

        setShowModal(true)
    }

    // ═══════════════════════════════════════════════════════════════
    // Save Item
    // ═══════════════════════════════════════════════════════════════
    const handleSave = async () => {
        setSaving(true)

        try {
            const url = '/api/admin/history'
            const method = modalMode === 'create' ? 'POST' : 'PUT'

            const body = modalMode === 'create'
                ? { type: modalType, data: formData }
                : { type: modalType, id: selectedItem.id, data: formData }

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })

            const result = await response.json()

            if (result.success) {
                success(`${modalType === 'timeline' ? 'Timeline event' : 'Archaeological site'} ${modalMode === 'create' ? 'created' : 'updated'} successfully!`)
                setContent(result.data)
                setShowModal(false)
            } else {
                showError(result.error || 'Operation failed')
            }
        } catch (error) {
            console.error('Error saving:', error)
            showError('Error saving item')
        } finally {
            setSaving(false)
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // Delete Item
    // ═══════════════════════════════════════════════════════════════
    const handleDelete = async (type, id) => {
        if (!confirm(isAr ? 'هل تريد حذف هذا العنصر؟' : 'Are you sure you want to delete this item?')) return

        try {
            const response = await fetch(`/api/admin/history?type=${type}&id=${id}`, {
                method: 'DELETE'
            })

            const result = await response.json()

            if (result.success) {
                success('Item deleted successfully!')
                setContent(result.data)
            } else {
                showError(result.error || 'Delete failed')
            }
        } catch (error) {
            console.error('Error deleting:', error)
            showError('Error deleting item')
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // Save Historical Sections
    // ═══════════════════════════════════════════════════════════════
    const saveSections = async () => {
        setSaving(true)

        try {
            const response = await fetch('/api/admin/history', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'sections',
                    data: content.historicalSections
                })
            })

            const result = await response.json()

            if (result.success) {
                success('Historical sections updated successfully!')
            } else {
                showError(result.error || 'Update failed')
            }
        } catch (error) {
            console.error('Error saving sections:', error)
            showError('Error saving sections')
        } finally {
            setSaving(false)
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // Save Page Settings
    // ═══════════════════════════════════════════════════════════════
    const savePageSettings = async () => {
        setSaving(true)
        try {
            const response = await fetch('/api/admin/history', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'settings',
                    data: content.pageSettings
                })
            })

            const result = await response.json()

            if (result.success) {
                success('Page settings updated successfully!')
                setContent(result.data)
            } else {
                showError(result.error || 'Update failed')
            }
        } catch (error) {
            console.error('Error saving settings:', error)
            showError('Error saving settings')
        } finally {
            setSaving(false)
        }
    }

    const handleQuickUpdate = async (type, id, data, successMessage) => {
        try {
            const response = await fetch('/api/admin/history', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, id, data })
            })

            const result = await response.json()

            if (result.success) {
                if (successMessage) {
                    success(successMessage)
                }
                setContent(result.data)
            } else {
                showError(result.error || 'Update failed')
            }
        } catch (error) {
            console.error('Error updating item:', error)
            showError('Error updating item')
        }
    }

    const handleDuplicate = async (type, item) => {
        const baseTitleEn = type === 'timeline' ? item.titleEn : item.nameEn
        const baseTitleAr = type === 'timeline' ? item.titleAr : item.nameAr
        const data = {
            ...item,
            titleEn: type === 'timeline' ? `${baseTitleEn || ''} (Copy)` : undefined,
            titleAr: type === 'timeline' ? `${baseTitleAr || ''} (نسخة)` : undefined,
            nameEn: type === 'site' ? `${baseTitleEn || ''} (Copy)` : undefined,
            nameAr: type === 'site' ? `${baseTitleAr || ''} (نسخة)` : undefined
        }

        delete data.id
        delete data.createdAt
        delete data.updatedAt
        delete data.order

        try {
            const response = await fetch('/api/admin/history', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type, data })
            })
            const result = await response.json()

            if (result.success) {
                success(isAr ? 'تم نسخ العنصر بنجاح' : 'Item duplicated successfully')
                setContent(result.data)
            } else {
                showError(result.error || 'Duplicate failed')
            }
        } catch (error) {
            console.error('Error duplicating item:', error)
            showError('Error duplicating item')
        }
    }

    const handleReorder = async (type, id, direction) => {
        const list = type === 'timeline' ? [...(content.timelineEvents || [])] : [...(content.archaeologicalSites || [])]
        const currentIndex = list.findIndex(item => item.id === id)
        const targetIndex = currentIndex + direction

        if (currentIndex < 0 || targetIndex < 0 || targetIndex >= list.length) return

        const currentItem = list[currentIndex]
        const targetItem = list[targetIndex]

        try {
            await Promise.all([
                fetch('/api/admin/history', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ type, id: currentItem.id, data: { order: targetItem.order } })
                }),
                fetch('/api/admin/history', {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ type, id: targetItem.id, data: { order: currentItem.order } })
                })
            ])
            await fetchContent()
            success(isAr ? 'تم ترتيب العناصر' : 'Items reordered')
        } catch (error) {
            console.error('Error reordering:', error)
            showError('Error reordering')
        }
    }

    const filteredTimelineEvents = (content.timelineEvents || []).filter(event => {
        const searchValue = timelineSearch.trim().toLowerCase()
        const matchesSearch = !searchValue || [
            event.year,
            event.yearEn,
            event.titleEn,
            event.titleAr,
            event.descriptionEn,
            event.descriptionAr
        ].some(value => (value || '').toString().toLowerCase().includes(searchValue))

        const matchesEra = timelineEra === 'all' || event.era === timelineEra
        const matchesStatus = timelineStatus === 'all' || (timelineStatus === 'active' ? event.isActive : !event.isActive)

        return matchesSearch && matchesEra && matchesStatus
    })

    const filteredSites = (content.archaeologicalSites || []).filter(site => {
        const searchValue = siteSearch.trim().toLowerCase()
        const matchesSearch = !searchValue || [
            site.nameEn,
            site.nameAr,
            site.periodEn,
            site.periodAr,
            site.locationEn,
            site.locationAr,
            site.descriptionEn,
            site.descriptionAr
        ].some(value => (value || '').toString().toLowerCase().includes(searchValue))

        const matchesStatus = siteStatus === 'all' || (siteStatus === 'active' ? site.isActive : !site.isActive)
        const matchesFeatured = siteFeatured === 'all' || (siteFeatured === 'featured' ? site.featured : !site.featured)

        return matchesSearch && matchesStatus && matchesFeatured
    })

    if (loading) {
        return (
            <AdminLayout title={isAr ? 'إدارة المحتوى التاريخي' : 'History Management'}>
                <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">{isAr ? 'جاري التحميل...' : 'Loading...'}</p>
                </div>
            </AdminLayout>
        )
    }

    return (
        <AdminLayout title={isAr ? 'إدارة المحتوى التاريخي' : 'History Management'}>
            {/* Stats Header */}
            <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gradient-to-br from-amber-500 to-orange-600 text-white rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-amber-100 text-sm font-semibold mb-1">{isAr ? 'الأحداث الزمنية' : 'Timeline Events'}</p>
                            <p className="text-4xl font-bold">{content.timelineEvents?.length || 0}</p>
                        </div>
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">📅</div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-purple-100 text-sm font-semibold mb-1">{isAr ? 'المواقع الأثرية' : 'Archaeological Sites'}</p>
                            <p className="text-4xl font-bold">{content.archaeologicalSites?.length || 0}</p>
                        </div>
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">🏛️</div>
                    </div>
                </div>

                <div className="bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-2xl p-6 shadow-lg">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-green-100 text-sm font-semibold mb-1">{isAr ? 'الأقسام التاريخية' : 'Historical Sections'}</p>
                            <p className="text-4xl font-bold">{Object.keys(content.historicalSections || {}).length}</p>
                        </div>
                        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center text-3xl">📖</div>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="mb-8">
                <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-3 font-semibold transition-all ${activeTab === tab.id
                                ? 'text-amber-600 dark:text-amber-400 border-b-2 border-amber-600 dark:border-amber-400'
                                : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                }`}
                        >
                            <span className="mr-2">{tab.icon}</span>
                            {isAr ? tab.labelAr : tab.labelEn}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                {/* ═══════════════════════════════════════════════════════════════
                    Timeline Events Tab
                    ═══════════════════════════════════════════════════════════════ */}
                {activeTab === 'timeline' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {isAr ? 'الأحداث الزمنية' : 'Timeline Events'}
                            </h3>
                            <button
                                onClick={() => openModal('create', 'timeline')}
                                className="btn btn-primary px-6 py-3 flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                {isAr ? 'إضافة حدث' : 'Add Event'}
                            </button>
                        </div>

                        <div className="mb-6 grid lg:grid-cols-4 gap-4">
                            <div className="lg:col-span-2">
                                <input
                                    type="text"
                                    value={timelineSearch}
                                    onChange={(e) => setTimelineSearch(e.target.value)}
                                    placeholder={isAr ? 'ابحث بالسنة أو العنوان أو الوصف' : 'Search by year, title, or description'}
                                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800"
                                />
                            </div>
                            <select
                                value={timelineEra}
                                onChange={(e) => setTimelineEra(e.target.value)}
                                className="px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800"
                            >
                                <option value="all">{isAr ? 'كل الحقب' : 'All Eras'}</option>
                                {eraOptions.map(era => (
                                    <option key={era.value} value={era.value}>
                                        {isAr ? era.labelAr : era.labelEn}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={timelineStatus}
                                onChange={(e) => setTimelineStatus(e.target.value)}
                                className="px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800"
                            >
                                <option value="all">{isAr ? 'الكل' : 'All Status'}</option>
                                <option value="active">{isAr ? 'منشور' : 'Published'}</option>
                                <option value="inactive">{isAr ? 'غير منشور' : 'Unpublished'}</option>
                            </select>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {filteredTimelineEvents.map((event, index) => (
                                <motion.div
                                    key={event.id}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all overflow-hidden"
                                >
                                    {/* Header with gradient */}
                                    <div className={`h-24 bg-gradient-to-r ${event.color} flex items-center justify-center text-5xl`}>
                                        {event.icon}
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        <div className="flex items-center justify-between gap-2 mb-3">
                                            <div className="flex items-center gap-2">
                                                <span className={`px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r ${event.color} text-white`}>
                                                    {isAr ? (event.year || event.yearEn) : (event.yearEn || event.year)}
                                                </span>
                                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300">
                                                    {eraOptions.find(e => e.value === event.era)?.[isAr ? 'labelAr' : 'labelEn']}
                                                </span>
                                                {!event.isActive && (
                                                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300">
                                                        {isAr ? 'غير منشور' : 'Unpublished'}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <button
                                                    onClick={() => handleQuickUpdate('timeline', event.id, { isActive: !event.isActive }, isAr ? 'تم تحديث النشر' : 'Publish status updated')}
                                                    className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                                    title={event.isActive ? (isAr ? 'إلغاء النشر' : 'Unpublish') : (isAr ? 'نشر' : 'Publish')}
                                                >
                                                    {event.isActive ? '👁️' : '🚫'}
                                                </button>
                                                <button
                                                    onClick={() => handleReorder('timeline', event.id, -1)}
                                                    className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                                    title={isAr ? 'تحريك للأعلى' : 'Move up'}
                                                >
                                                    ↑
                                                </button>
                                                <button
                                                    onClick={() => handleReorder('timeline', event.id, 1)}
                                                    className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                                    title={isAr ? 'تحريك للأسفل' : 'Move down'}
                                                >
                                                    ↓
                                                </button>
                                                <button
                                                    onClick={() => handleDuplicate('timeline', event)}
                                                    className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                                    title={isAr ? 'نسخ' : 'Duplicate'}
                                                >
                                                    📄
                                                </button>
                                            </div>
                                        </div>

                                        <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                                            {isAr ? event.titleAr : event.titleEn}
                                        </h4>

                                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 mb-4">
                                            {isAr ? event.descriptionAr : event.descriptionEn}
                                        </p>

                                        {/* Actions */}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => openModal('edit', 'timeline', event)}
                                                className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
                                            >
                                                {isAr ? 'تعديل' : 'Edit'}
                                            </button>
                                            <button
                                                onClick={() => handleDelete('timeline', event.id)}
                                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
                                            >
                                                {isAr ? 'حذف' : 'Delete'}
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        {filteredTimelineEvents.length === 0 && (
                            <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                                {isAr ? 'لا توجد نتائج مطابقة' : 'No matching results'}
                            </div>
                        )}
                    </div>
                )}

                {/* ═══════════════════════════════════════════════════════════════
                    Archaeological Sites Tab
                    ═══════════════════════════════════════════════════════════════ */}
                {activeTab === 'sites' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                {isAr ? 'المواقع الأثرية' : 'Archaeological Sites'}
                            </h3>
                            <button
                                onClick={() => openModal('create', 'site')}
                                className="btn btn-primary px-6 py-3 flex items-center gap-2"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                {isAr ? 'إضافة موقع' : 'Add Site'}
                            </button>
                        </div>

                        <div className="mb-6 grid lg:grid-cols-4 gap-4">
                            <div className="lg:col-span-2">
                                <input
                                    type="text"
                                    value={siteSearch}
                                    onChange={(e) => setSiteSearch(e.target.value)}
                                    placeholder={isAr ? 'ابحث بالاسم أو الموقع أو الفترة' : 'Search by name, location, or period'}
                                    className="w-full px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800"
                                />
                            </div>
                            <select
                                value={siteStatus}
                                onChange={(e) => setSiteStatus(e.target.value)}
                                className="px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800"
                            >
                                <option value="all">{isAr ? 'الكل' : 'All Status'}</option>
                                <option value="active">{isAr ? 'منشور' : 'Published'}</option>
                                <option value="inactive">{isAr ? 'غير منشور' : 'Unpublished'}</option>
                            </select>
                            <select
                                value={siteFeatured}
                                onChange={(e) => setSiteFeatured(e.target.value)}
                                className="px-4 py-3 border border-gray-200 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800"
                            >
                                <option value="all">{isAr ? 'الكل' : 'All'}</option>
                                <option value="featured">{isAr ? 'مميز' : 'Featured'}</option>
                                <option value="normal">{isAr ? 'غير مميز' : 'Not Featured'}</option>
                            </select>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            {filteredSites.map((site, index) => (
                                <motion.div
                                    key={site.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                    className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all overflow-hidden"
                                >
                                    {/* Header */}
                                    <div className={`h-32 bg-gradient-to-br ${site.gradient} flex items-center justify-center relative`}>
                                        <span className="text-6xl">
                                            {site.gradient.includes('amber') ? '🏔️' :
                                                site.gradient.includes('gray') ? '🗿' :
                                                    site.gradient.includes('green') ? '🕌' :
                                                        site.gradient.includes('red') ? '🏰' :
                                                            site.gradient.includes('purple') ? '⚱️' : '🏛️'}
                                        </span>

                                        {/* Badges */}
                                        <div className="absolute top-3 right-3 flex gap-2">
                                            {site.featured && (
                                                <span className="bg-yellow-400 text-yellow-900 dark:bg-yellow-500/20 dark:text-yellow-200 px-3 py-1 rounded-full text-xs font-bold">
                                                    ⭐ {isAr ? 'مميز' : 'Featured'}
                                                </span>
                                            )}
                                            {site.isActive && (
                                                <span className="bg-green-400 text-green-900 dark:bg-green-500/20 dark:text-green-200 px-3 py-1 rounded-full text-xs font-bold">
                                                    ✓
                                                </span>
                                            )}
                                        </div>

                                        <div className="absolute bottom-3 right-3 bg-white/90 dark:bg-gray-800/90 px-3 py-1 rounded-full text-xs font-bold text-gray-700 dark:text-gray-300">
                                            {isAr ? site.periodAr : site.periodEn}
                                        </div>
                                    </div>

                                    {/* Content */}
                                    <div className="p-6">
                                        {!site.isActive && (
                                            <div className="mb-3">
                                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-300">
                                                    {isAr ? 'غير منشور' : 'Unpublished'}
                                                </span>
                                            </div>
                                        )}
                                        <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                            {isAr ? site.nameAr : site.nameEn}
                                        </h4>

                                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                                            {isAr ? site.descriptionAr : site.descriptionEn}
                                        </p>

                                        <div className="mb-4 space-y-2 text-sm">
                                            <div className="flex items-start gap-2">
                                                <span className="text-purple-600 dark:text-purple-400 font-semibold">📍</span>
                                                <span className="text-gray-700 dark:text-gray-300">
                                                    {isAr ? site.locationAr : site.locationEn}
                                                </span>
                                            </div>
                                            <div className="flex items-start gap-2">
                                                <span className="text-blue-600 dark:text-blue-400 font-semibold">🚶</span>
                                                <span className="text-gray-700 dark:text-gray-300">
                                                    {isAr ? site.accessAr : site.accessEn}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleQuickUpdate('site', site.id, { isActive: !site.isActive }, isAr ? 'تم تحديث النشر' : 'Publish status updated')}
                                                className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                                title={site.isActive ? (isAr ? 'إلغاء النشر' : 'Unpublish') : (isAr ? 'نشر' : 'Publish')}
                                            >
                                                {site.isActive ? '👁️' : '🚫'}
                                            </button>
                                            <button
                                                onClick={() => handleQuickUpdate('site', site.id, { featured: !site.featured }, isAr ? 'تم تحديث التمييز' : 'Featured status updated')}
                                                className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                                title={site.featured ? (isAr ? 'إلغاء التمييز' : 'Unfeature') : (isAr ? 'تمييز' : 'Feature')}
                                            >
                                                ⭐
                                            </button>
                                            <button
                                                onClick={() => handleReorder('site', site.id, -1)}
                                                className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                                title={isAr ? 'تحريك للأعلى' : 'Move up'}
                                            >
                                                ↑
                                            </button>
                                            <button
                                                onClick={() => handleReorder('site', site.id, 1)}
                                                className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                                title={isAr ? 'تحريك للأسفل' : 'Move down'}
                                            >
                                                ↓
                                            </button>
                                            <button
                                                onClick={() => handleDuplicate('site', site)}
                                                className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                                                title={isAr ? 'نسخ' : 'Duplicate'}
                                            >
                                                📄
                                            </button>
                                            <button
                                                onClick={() => openModal('edit', 'site', site)}
                                                className="flex-1 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg font-semibold transition-colors"
                                            >
                                                {isAr ? 'تعديل' : 'Edit'}
                                            </button>
                                            <button
                                                onClick={() => handleDelete('site', site.id)}
                                                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-colors"
                                            >
                                                {isAr ? 'حذف' : 'Delete'}
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                        {filteredSites.length === 0 && (
                            <div className="text-center py-12 text-gray-500 dark:text-gray-400 bg-white dark:bg-gray-800 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                                {isAr ? 'لا توجد نتائج مطابقة' : 'No matching results'}
                            </div>
                        )}
                    </div>
                )}

                {/* ═══════════════════════════════════════════════════════════════
                    Historical Sections Tab
                    ═══════════════════════════════════════════════════════════════ */}
                {activeTab === 'sections' && (
                    <div className="space-y-6">
                        <div className="flex justify-end">
                            <button
                                onClick={saveSections}
                                disabled={saving}
                                className="btn btn-primary px-8 py-3 text-lg font-bold shadow-lg disabled:opacity-50"
                            >
                                {saving ? (isAr ? 'جاري الحفظ...' : 'Saving...') : (isAr ? '💾 حفظ التغييرات' : '💾 Save Changes')}
                            </button>
                        </div>

                        {['ancient', 'colonial', 'modern'].map((section, index) => (
                            <motion.div
                                key={section}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
                            >
                                <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                    {section === 'ancient' && '🏺'}
                                    {section === 'colonial' && '⚔️'}
                                    {section === 'modern' && '🌍'}
                                    {eraOptions.find(e => e.value === section)?.[isAr ? 'labelAr' : 'labelEn']}
                                </h4>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            {isAr ? 'العنوان (EN)' : 'Title (EN)'}
                                        </label>
                                        <input
                                            type="text"
                                            value={content.historicalSections?.[section]?.titleEn || ''}
                                            onChange={(e) => setContent({
                                                ...content,
                                                historicalSections: {
                                                    ...content.historicalSections,
                                                    [section]: {
                                                        ...content.historicalSections[section],
                                                        titleEn: e.target.value
                                                    }
                                                }
                                            })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            {isAr ? 'العنوان (AR)' : 'Title (AR)'}
                                        </label>
                                        <input
                                            type="text"
                                            value={content.historicalSections?.[section]?.titleAr || ''}
                                            onChange={(e) => setContent({
                                                ...content,
                                                historicalSections: {
                                                    ...content.historicalSections,
                                                    [section]: {
                                                        ...content.historicalSections[section],
                                                        titleAr: e.target.value
                                                    }
                                                }
                                            })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-right"
                                            dir="rtl"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            {isAr ? 'المحتوى (EN)' : 'Content (EN)'}
                                        </label>
                                        <textarea
                                            rows={4}
                                            value={content.historicalSections?.[section]?.contentEn || ''}
                                            onChange={(e) => setContent({
                                                ...content,
                                                historicalSections: {
                                                    ...content.historicalSections,
                                                    [section]: {
                                                        ...content.historicalSections[section],
                                                        contentEn: e.target.value
                                                    }
                                                }
                                            })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            {isAr ? 'المحتوى (AR)' : 'Content (AR)'}
                                        </label>
                                        <textarea
                                            rows={4}
                                            value={content.historicalSections?.[section]?.contentAr || ''}
                                            onChange={(e) => setContent({
                                                ...content,
                                                historicalSections: {
                                                    ...content.historicalSections,
                                                    [section]: {
                                                        ...content.historicalSections[section],
                                                        contentAr: e.target.value
                                                    }
                                                }
                                            })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-right"
                                            dir="rtl"
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={content.historicalSections?.[section]?.isActive || false}
                                                onChange={(e) => setContent({
                                                    ...content,
                                                    historicalSections: {
                                                        ...content.historicalSections,
                                                        [section]: {
                                                            ...content.historicalSections[section],
                                                            isActive: e.target.checked
                                                        }
                                                    }
                                                })}
                                                className="w-5 h-5 text-green-600 rounded"
                                            />
                                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                {isAr ? 'منشور' : 'Published'}
                                            </span>
                                        </label>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}

                {/* ═══════════════════════════════════════════════════════════════
                    Settings Tab
                    ═══════════════════════════════════════════════════════════════ */}
                {activeTab === 'settings' && (
                    <div className="space-y-6">
                        <div className="flex justify-end">
                            <button
                                onClick={savePageSettings}
                                disabled={saving}
                                className="btn btn-primary px-8 py-3 text-lg font-bold shadow-lg disabled:opacity-50 flex items-center gap-2"
                            >
                                {saving ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        {isAr ? 'جاري الحفظ...' : 'Saving...'}
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
                                        </svg>
                                        {isAr ? 'حفظ الإعدادات' : 'Save Settings'}
                                    </>
                                )}
                            </button>
                        </div>

                        {/* Hero Section Settings */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700"
                        >
                            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2 pb-4 border-b border-gray-100 dark:border-gray-700">
                                <span className="text-2xl">🖼️</span>
                                {isAr ? 'إعدادات القسم الرئيسي (Hero)' : 'Hero Section Settings'}
                            </h4>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            {isAr ? 'العنوان الرئيسي (EN)' : 'Hero Title (EN)'}
                                        </label>
                                        <input
                                            type="text"
                                            value={content.pageSettings?.heroTitleEn || ''}
                                            onChange={(e) => setContent({
                                                ...content,
                                                pageSettings: { ...content.pageSettings, heroTitleEn: e.target.value }
                                            })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            {isAr ? 'العنوان الرئيسي (AR)' : 'Hero Title (AR)'}
                                        </label>
                                        <input
                                            type="text"
                                            dir="rtl"
                                            value={content.pageSettings?.heroTitleAr || ''}
                                            onChange={(e) => setContent({
                                                ...content,
                                                pageSettings: { ...content.pageSettings, heroTitleAr: e.target.value }
                                            })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-right"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            {isAr ? 'العنوان الفرعي (EN)' : 'Hero Subtitle (EN)'}
                                        </label>
                                        <textarea
                                            rows={3}
                                            value={content.pageSettings?.heroSubtitleEn || ''}
                                            onChange={(e) => setContent({
                                                ...content,
                                                pageSettings: { ...content.pageSettings, heroSubtitleEn: e.target.value }
                                            })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            {isAr ? 'العنوان الفرعي (AR)' : 'Hero Subtitle (AR)'}
                                        </label>
                                        <textarea
                                            rows={3}
                                            dir="rtl"
                                            value={content.pageSettings?.heroSubtitleAr || ''}
                                            onChange={(e) => setContent({
                                                ...content,
                                                pageSettings: { ...content.pageSettings, heroSubtitleAr: e.target.value }
                                            })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-right"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        {isAr ? 'صورة الخلفية' : 'Background Image'}
                                    </label>
                                    <ImageUploader
                                        value={content.pageSettings?.heroImage}
                                        onUploadProp={(url) => setContent({
                                            ...content,
                                            pageSettings: { ...content.pageSettings, heroImage: url }
                                        })}
                                        label={isAr ? 'اسحب وأفلت الصورة هنا' : 'Drag & Drop Image'}
                                        className="h-full"
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* CTA Section Settings */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700"
                        >
                            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2 pb-4 border-b border-gray-100 dark:border-gray-700">
                                <span className="text-2xl">📢</span>
                                {isAr ? 'إعدادات قسم الدعوة (CTA)' : 'Call to Action Settings'}
                            </h4>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            {isAr ? 'عنوان الدعوة (EN)' : 'CTA Title (EN)'}
                                        </label>
                                        <input
                                            type="text"
                                            value={content.pageSettings?.ctaTitleEn || ''}
                                            onChange={(e) => setContent({
                                                ...content,
                                                pageSettings: { ...content.pageSettings, ctaTitleEn: e.target.value }
                                            })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            {isAr ? 'عنوان الدعوة (AR)' : 'CTA Title (AR)'}
                                        </label>
                                        <input
                                            type="text"
                                            dir="rtl"
                                            value={content.pageSettings?.ctaTitleAr || ''}
                                            onChange={(e) => setContent({
                                                ...content,
                                                pageSettings: { ...content.pageSettings, ctaTitleAr: e.target.value }
                                            })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-right"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            {isAr ? 'نص الدعوة (EN)' : 'CTA Text (EN)'}
                                        </label>
                                        <textarea
                                            rows={3}
                                            value={content.pageSettings?.ctaTextEn || ''}
                                            onChange={(e) => setContent({
                                                ...content,
                                                pageSettings: { ...content.pageSettings, ctaTextEn: e.target.value }
                                            })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            {isAr ? 'نص الدعوة (AR)' : 'CTA Text (AR)'}
                                        </label>
                                        <textarea
                                            rows={3}
                                            dir="rtl"
                                            value={content.pageSettings?.ctaTextAr || ''}
                                            onChange={(e) => setContent({
                                                ...content,
                                                pageSettings: { ...content.pageSettings, ctaTextAr: e.target.value }
                                            })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-right"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        {isAr ? 'صورة الخلفية' : 'Background Image'}
                                    </label>
                                    <ImageUploader
                                        value={content.pageSettings?.ctaImage}
                                        onUploadProp={(url) => setContent({
                                            ...content,
                                            pageSettings: { ...content.pageSettings, ctaImage: url }
                                        })}
                                        label={isAr ? 'اسحب وأفلت الصورة هنا' : 'Drag & Drop Image'}
                                        className="h-full"
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* SEO Settings */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700"
                        >
                            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2 pb-4 border-b border-gray-100 dark:border-gray-700">
                                <span className="text-2xl">🔍</span>
                                {isAr ? 'إعدادات محركات البحث (SEO)' : 'SEO Settings'}
                            </h4>

                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        {isAr ? 'عنوان الصفحة (Meta Title EN)' : 'Meta Title (EN)'}
                                    </label>
                                    <input
                                        type="text"
                                        value={content.pageSettings?.metaTitleEn || ''}
                                        onChange={(e) => setContent({
                                            ...content,
                                            pageSettings: { ...content.pageSettings, metaTitleEn: e.target.value }
                                        })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        {isAr ? 'عنوان الصفحة (Meta Title AR)' : 'Meta Title (AR)'}
                                    </label>
                                    <input
                                        type="text"
                                        dir="rtl"
                                        value={content.pageSettings?.metaTitleAr || ''}
                                        onChange={(e) => setContent({
                                            ...content,
                                            pageSettings: { ...content.pageSettings, metaTitleAr: e.target.value }
                                        })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-right"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        {isAr ? 'وصف الصفحة (Meta Description EN)' : 'Meta Description (EN)'}
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={content.pageSettings?.metaDescEn || ''}
                                        onChange={(e) => setContent({
                                            ...content,
                                            pageSettings: { ...content.pageSettings, metaDescEn: e.target.value }
                                        })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900"
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        {isAr ? 'وصف الصفحة (Meta Description AR)' : 'Meta Description (AR)'}
                                    </label>
                                    <textarea
                                        rows={2}
                                        dir="rtl"
                                        value={content.pageSettings?.metaDescAr || ''}
                                        onChange={(e) => setContent({
                                            ...content,
                                            pageSettings: { ...content.pageSettings, metaDescAr: e.target.value }
                                        })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-right"
                                    />
                                </div>
                            </div>
                        </motion.div>

                        {/* Advanced Content Settings (Dynamic) */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-100 dark:border-gray-700"
                        >
                            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2 pb-4 border-b border-gray-100 dark:border-gray-700">
                                <span className="text-2xl">✨</span>
                                {isAr ? 'المحتوى المتقدم (شارات وبطاقات)' : 'Advanced Content (Badges & Cards)'}
                            </h4>

                            {/* Hero Badge */}
                            <div className="mb-8">
                                <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4 flex items-center gap-2">
                                    <span className="text-amber-500">🏷️</span>
                                    {isAr ? 'شارة القسم الرئيسي' : 'Hero Badge'}
                                </h5>
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            {isAr ? 'نص الشارة' : 'Badge Text'}
                                        </label>
                                        <input
                                            type="text"
                                            value={content.pageSettings?.extraContent?.heroBadgeText || ''}
                                            onChange={(e) => {
                                                const currentExtra = content.pageSettings?.extraContent || {}
                                                setContent({
                                                    ...content,
                                                    pageSettings: {
                                                        ...content.pageSettings,
                                                        extraContent: { ...currentExtra, heroBadgeText: e.target.value }
                                                    }
                                                })
                                            }}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900"
                                            placeholder={isAr ? "مثال: اكتشف إرث سقطرى" : "e.g., Discover Socotra's Legacy"}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Ancient Myths Cards */}
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h5 className="text-lg font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-2">
                                        <span className="text-purple-500">🃏</span>
                                        {isAr ? 'بطاقات الأساطير القديمة' : 'Ancient Myths Cards'}
                                    </h5>
                                    <button
                                        onClick={() => {
                                            const currentExtra = content.pageSettings?.extraContent || {}
                                            const currentCards = currentExtra.ancientCards || []
                                            const newCard = {
                                                id: Date.now(),
                                                titleEn: '', titleAr: '',
                                                descriptionEn: '', descriptionAr: '',
                                                image: ''
                                            }
                                            setContent({
                                                ...content,
                                                pageSettings: {
                                                    ...content.pageSettings,
                                                    extraContent: { ...currentExtra, ancientCards: [...currentCards, newCard] }
                                                }
                                            })
                                        }}
                                        className="text-sm px-3 py-1 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors"
                                    >
                                        + {isAr ? 'إضافة بطاقة' : 'Add Card'}
                                    </button>
                                </div>

                                <div className="space-y-4">
                                    {(content.pageSettings?.extraContent?.ancientCards || []).map((card, index) => (
                                        <div key={index} className="border border-gray-200 dark:border-gray-700 rounded-xl p-4 bg-gray-50 dark:bg-gray-900/50">
                                            <div className="flex justify-between items-start mb-4">
                                                <span className="font-bold text-gray-500">#{index + 1}</span>
                                                <button
                                                    onClick={() => {
                                                        const currentExtra = content.pageSettings?.extraContent || {}
                                                        const currentCards = [...(currentExtra.ancientCards || [])]
                                                        currentCards.splice(index, 1)
                                                        setContent({
                                                            ...content,
                                                            pageSettings: {
                                                                ...content.pageSettings,
                                                                extraContent: { ...currentExtra, ancientCards: currentCards }
                                                            }
                                                        })
                                                    }}
                                                    className="text-red-500 hover:text-red-700"
                                                >
                                                    🗑️
                                                </button>
                                            </div>

                                            <div className="grid md:grid-cols-2 gap-4">
                                                {/* Image */}
                                                <div className="md:col-span-2">
                                                    <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">
                                                        {isAr ? 'صورة البطاقة' : 'Card Image'}
                                                    </label>
                                                    <ImageUploader
                                                        value={card.image}
                                                        onUploadProp={(url) => {
                                                            const currentExtra = content.pageSettings?.extraContent || {}
                                                            const currentCards = [...(currentExtra.ancientCards || [])]
                                                            currentCards[index] = { ...card, image: url }
                                                            setContent({
                                                                ...content,
                                                                pageSettings: {
                                                                    ...content.pageSettings,
                                                                    extraContent: { ...currentExtra, ancientCards: currentCards }
                                                                }
                                                            })
                                                        }}
                                                        label={isAr ? 'صورة' : 'Image'}
                                                        className="h-32"
                                                    />
                                                </div>

                                                {/* Titles */}
                                                <div>
                                                    <input
                                                        type="text"
                                                        value={card.titleEn || ''}
                                                        onChange={(e) => {
                                                            const currentExtra = content.pageSettings?.extraContent || {}
                                                            const currentCards = [...(currentExtra.ancientCards || [])]
                                                            currentCards[index] = { ...card, titleEn: e.target.value }
                                                            setContent({
                                                                ...content,
                                                                pageSettings: {
                                                                    ...content.pageSettings,
                                                                    extraContent: { ...currentExtra, ancientCards: currentCards }
                                                                }
                                                            })
                                                        }}
                                                        placeholder="Title (EN)"
                                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <input
                                                        type="text"
                                                        dir="rtl"
                                                        value={card.titleAr || ''}
                                                        onChange={(e) => {
                                                            const currentExtra = content.pageSettings?.extraContent || {}
                                                            const currentCards = [...(currentExtra.ancientCards || [])]
                                                            currentCards[index] = { ...card, titleAr: e.target.value }
                                                            setContent({
                                                                ...content,
                                                                pageSettings: {
                                                                    ...content.pageSettings,
                                                                    extraContent: { ...currentExtra, ancientCards: currentCards }
                                                                }
                                                            })
                                                        }}
                                                        placeholder="العنوان (AR)"
                                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-right"
                                                    />
                                                </div>

                                                {/* Descriptions */}
                                                <div>
                                                    <textarea
                                                        rows={2}
                                                        value={card.descriptionEn || ''}
                                                        onChange={(e) => {
                                                            const currentExtra = content.pageSettings?.extraContent || {}
                                                            const currentCards = [...(currentExtra.ancientCards || [])]
                                                            currentCards[index] = { ...card, descriptionEn: e.target.value }
                                                            setContent({
                                                                ...content,
                                                                pageSettings: {
                                                                    ...content.pageSettings,
                                                                    extraContent: { ...currentExtra, ancientCards: currentCards }
                                                                }
                                                            })
                                                        }}
                                                        placeholder="Description (EN)"
                                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm"
                                                    />
                                                </div>
                                                <div>
                                                    <textarea
                                                        rows={2}
                                                        dir="rtl"
                                                        value={card.descriptionAr || ''}
                                                        onChange={(e) => {
                                                            const currentExtra = content.pageSettings?.extraContent || {}
                                                            const currentCards = [...(currentExtra.ancientCards || [])]
                                                            currentCards[index] = { ...card, descriptionAr: e.target.value }
                                                            setContent({
                                                                ...content,
                                                                pageSettings: {
                                                                    ...content.pageSettings,
                                                                    extraContent: { ...currentExtra, ancientCards: currentCards }
                                                                }
                                                            })
                                                        }}
                                                        placeholder="الوصف (AR)"
                                                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm text-right"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    ))}

                                    {(content.pageSettings?.extraContent?.ancientCards?.length === 0 || !content.pageSettings?.extraContent?.ancientCards) && (
                                        <div className="text-center py-8 text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                                            {isAr ? 'لا توجد بطاقات مضافة' : 'No cards added yet'}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </motion.div>

            {/* ═══════════════════════════════════════════════════════════════
                Modal for Timeline/Site
                ═══════════════════════════════════════════════════════════════ */}
            <AnimatePresence>
                {showModal && modalType !== 'sections' && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between z-10">
                                <h3 className="text-2xl font-bold text-gray-900 dark:text-white">
                                    {modalMode === 'create'
                                        ? (modalType === 'timeline'
                                            ? (isAr ? 'إضافة حدث زمني' : 'Add Timeline Event')
                                            : (isAr ? 'إضافة موقع أثري' : 'Add Archaeological Site'))
                                        : (modalType === 'timeline'
                                            ? (isAr ? 'تعديل حدث زمني' : 'Edit Timeline Event')
                                            : (isAr ? 'تعديل موقع أثري' : 'Edit Archaeological Site'))}
                                </h3>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            <div className="p-6">
                                {modalType === 'timeline' ? (
                                    /* Timeline Event Form */
                                    <div className="space-y-4">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                    {isAr ? 'السنة' : 'Year'}
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.year || ''}
                                                    onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                                                    placeholder={isAr ? '٢٠٠٨' : '2008'}
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                    {isAr ? 'السنة (EN)' : 'Year (EN)'}
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.yearEn || ''}
                                                    onChange={(e) => setFormData({ ...formData, yearEn: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                                                    placeholder="2008"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                    {isAr ? 'الحقبة' : 'Era'}
                                                </label>
                                                <select
                                                    value={formData.era || 'ancient'}
                                                    onChange={(e) => setFormData({ ...formData, era: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                >
                                                    {eraOptions.map(era => (
                                                        <option key={era.value} value={era.value}>
                                                            {isAr ? era.labelAr : era.labelEn}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                    {isAr ? 'العنوان (EN)' : 'Title (EN)'}
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.titleEn || ''}
                                                    onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                    {isAr ? 'العنوان (AR)' : 'Title (AR)'}
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.titleAr || ''}
                                                    onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-right bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                                                    dir="rtl"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                    {isAr ? 'الوصف (EN)' : 'Description (EN)'}
                                                </label>
                                                <textarea
                                                    rows={3}
                                                    value={formData.descriptionEn || ''}
                                                    onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                    {isAr ? 'الوصف (AR)' : 'Description (AR)'}
                                                </label>
                                                <textarea
                                                    rows={3}
                                                    value={formData.descriptionAr || ''}
                                                    onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-right bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                                                    dir="rtl"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                    {isAr ? 'الأيقونة' : 'Icon'}
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.icon || ''}
                                                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                                                    placeholder="🏺"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                    {isAr ? 'لون التدرج' : 'Gradient Color'}
                                                </label>
                                                <select
                                                    value={formData.color || ''}
                                                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                >
                                                    {colorOptions.map(color => (
                                                        <option key={color.value} value={color.value}>
                                                            {color.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div>
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.isActive || false}
                                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                                    className="w-5 h-5 text-green-600 rounded"
                                                />
                                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                    {isAr ? 'منشور' : 'Published'}
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                ) : (
                                    /* Archaeological Site Form */
                                    <div className="space-y-4">
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                    {isAr ? 'الاسم (EN)' : 'Name (EN)'}
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.nameEn || ''}
                                                    onChange={(e) => setFormData({ ...formData, nameEn: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                    {isAr ? 'الاسم (AR)' : 'Name (AR)'}
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.nameAr || ''}
                                                    onChange={(e) => setFormData({ ...formData, nameAr: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-right bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                                                    dir="rtl"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                    {isAr ? 'الفترة (EN)' : 'Period (EN)'}
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.periodEn || ''}
                                                    onChange={(e) => setFormData({ ...formData, periodEn: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                    {isAr ? 'الفترة (AR)' : 'Period (AR)'}
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.periodAr || ''}
                                                    onChange={(e) => setFormData({ ...formData, periodAr: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-right bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                                                    dir="rtl"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                    {isAr ? 'الوصف (EN)' : 'Description (EN)'}
                                                </label>
                                                <textarea
                                                    rows={3}
                                                    value={formData.descriptionEn || ''}
                                                    onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                    {isAr ? 'الوصف (AR)' : 'Description (AR)'}
                                                </label>
                                                <textarea
                                                    rows={3}
                                                    value={formData.descriptionAr || ''}
                                                    onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-right bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                                                    dir="rtl"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                    {isAr ? 'الأهمية (EN)' : 'Significance (EN)'}
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.significanceEn || ''}
                                                    onChange={(e) => setFormData({ ...formData, significanceEn: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                    {isAr ? 'الأهمية (AR)' : 'Significance (AR)'}
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.significanceAr || ''}
                                                    onChange={(e) => setFormData({ ...formData, significanceAr: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-right bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                                                    dir="rtl"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                    {isAr ? 'الموقع (EN)' : 'Location (EN)'}
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.locationEn || ''}
                                                    onChange={(e) => setFormData({ ...formData, locationEn: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                    {isAr ? 'الموقع (AR)' : 'Location (AR)'}
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.locationAr || ''}
                                                    onChange={(e) => setFormData({ ...formData, locationAr: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-right bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                                                    dir="rtl"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                    {isAr ? 'طريقة الوصول (EN)' : 'Access (EN)'}
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.accessEn || ''}
                                                    onChange={(e) => setFormData({ ...formData, accessEn: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                    {isAr ? 'طريقة الوصول (AR)' : 'Access (AR)'}
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.accessAr || ''}
                                                    onChange={(e) => setFormData({ ...formData, accessAr: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-right bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                                                    dir="rtl"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                    {isAr ? 'لون التدرج' : 'Gradient Color'}
                                                </label>
                                                <select
                                                    value={formData.gradient || ''}
                                                    onChange={(e) => setFormData({ ...formData, gradient: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                >
                                                    {colorOptions.map(color => (
                                                        <option key={color.value} value={color.value}>
                                                            {color.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                    {isAr ? 'صورة الموقع' : 'Site Image'}
                                                </label>
                                                <ImageUploader
                                                    value={formData.imageUrl || ''}
                                                    onUploadProp={(url) => setFormData({ ...formData, imageUrl: url })}
                                                    label={isAr ? 'اسحب وأفلت الصورة هنا' : 'Drag & Drop Image'}
                                                previewClassName="h-40 md:h-48"
                                                    className="h-40"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                    {isAr ? 'رابط الصورة' : 'Image URL'}
                                                </label>
                                                <input
                                                    type="text"
                                                    value={formData.imageUrl || ''}
                                                    onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
                                                    placeholder="https://..."
                                                />
                                            </div>
                                        </div>

                                        <div className="flex gap-4">
                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.isActive || false}
                                                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                                                    className="w-5 h-5 text-green-600 rounded"
                                                />
                                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                    {isAr ? 'منشور' : 'Published'}
                                                </span>
                                            </label>

                                            <label className="flex items-center gap-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.featured || false}
                                                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                                                    className="w-5 h-5 text-yellow-600 rounded"
                                                />
                                                <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                                    {isAr ? 'مميز' : 'Featured'}
                                                </span>
                                            </label>
                                        </div>
                                    </div>
                                )}

                                {/* Modal Actions */}
                                <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg font-semibold hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
                                    >
                                        {isAr ? 'إلغاء' : 'Cancel'}
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="flex-1 px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white rounded-lg font-semibold hover:from-amber-600 hover:to-orange-700 transition-all disabled:opacity-50"
                                    >
                                        {saving ? (isAr ? 'جاري الحفظ...' : 'Saving...') : (isAr ? 'حفظ' : 'Save')}
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
