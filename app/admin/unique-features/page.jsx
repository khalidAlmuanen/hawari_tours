'use client'

// ═══════════════════════════════════════════════════════════════════════
// 🌟 UNIQUE FEATURES MANAGEMENT - Professional & Modern Admin
// إدارة الميزات الفريدة - لوحة تحكم احترافية
// ═══════════════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback } from 'react'
import { useApp } from '@/contexts/AppContext'
import AdminLayout from '@/components/admin/AdminLayout'
import { useToast } from '@/components/admin/Toast'
import { motion, AnimatePresence } from 'framer-motion'
import ImageUploader from '@/components/admin/ImageUploader'
import Image from 'next/image'

export default function UniqueFeaturesManagement() {
    const { locale } = useApp()
    const { success, error: showError } = useToast()
    const isAr = locale === 'ar'

    // State
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('settings')
    const [features, setFeatures] = useState({
        stats: [], // Stats are currently placeholders or part of pageSettings if implemented
        mainFeatures: [],
        beaches: [],
        caves: [],
        wildlife: [],
        pageSettings: {}
    })

    // Modal states
    const [showModal, setShowModal] = useState(false)
    const [modalMode, setModalMode] = useState('create')
    const [modalType, setModalType] = useState('stat')
    const [selectedItem, setSelectedItem] = useState(null)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState({})

    // Page Settings State
    const [pageSettings, setPageSettings] = useState({})

    // Gradient options
    const colorOptions = [
        { value: 'from-blue-500 to-cyan-600', label: '🔵 Blue-Cyan' },
        { value: 'from-amber-500 to-orange-600', label: '🟠 Amber-Orange' },
        { value: 'from-purple-500 to-pink-600', label: '🟣 Purple-Pink' },
        { value: 'from-green-500 to-emerald-600', label: '🟢 Green-Emerald' },
        { value: 'from-red-500 to-rose-600', label: '🔴 Red-Rose' },
        { value: 'from-yellow-500 to-amber-600', label: '🟡 Yellow-Amber' },
        { value: 'from-indigo-500 to-blue-600', label: '🔷 Indigo-Blue' },
        { value: 'from-gray-500 to-slate-600', label: '⚫ Gray-Slate' },
        { value: 'from-teal-500 to-cyan-600', label: '🟦 Teal-Cyan' },
        { value: 'from-red-500 via-orange-500 to-yellow-500', label: '🌅 Sunset' },
        { value: 'from-cyan-400 via-blue-400 to-indigo-500', label: '🌊 Ocean' },
        { value: 'from-gray-600 via-slate-600 to-stone-700', label: '🪨 Stone' }
    ]

    // Tabs
    const tabs = [
        { id: 'settings', icon: '⚙️', labelEn: 'General Settings', labelAr: 'الإعدادات العامة' },
        // { id: 'stats', icon: '📊', labelEn: 'Statistics Cards', labelAr: 'بطاقات الإحصائيات' }, // Disabled until schema support
        { id: 'main', icon: '🌟', labelEn: 'Main Features', labelAr: 'الميزات الرئيسية' },
        { id: 'beaches', icon: '🏖️', labelEn: 'Beaches', labelAr: 'الشواطئ' },
        { id: 'caves', icon: '⛰️', labelEn: 'Caves', labelAr: 'الكهوف' },
        { id: 'wildlife', icon: '🦎', labelEn: 'Wildlife', labelAr: 'الحياة البرية' }
    ]

    // ═══════════════════════════════════════════════════════════════
    // Fetch Features
    // ═══════════════════════════════════════════════════════════════
    const fetchFeatures = useCallback(async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/admin/unique-features')
            const result = await response.json()

            if (result.success) {
                setFeatures(result.data)
                setPageSettings(result.data.pageSettings || {})
            } else {
                showError('Failed to fetch features')
            }
        } catch (error) {
            console.error('Error fetching features:', error)
            showError('Error fetching features')
        } finally {
            setLoading(false)
        }
    }, [showError])

    useEffect(() => {
        fetchFeatures()
    }, [fetchFeatures])

    // ═══════════════════════════════════════════════════════════════
    // Save Page Settings
    // ═══════════════════════════════════════════════════════════════
    const savePageSettings = async () => {
        setSaving(true)
        try {
            const response = await fetch('/api/admin/unique-features', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    type: 'settings',
                    data: pageSettings
                })
            })

            const result = await response.json()

            if (result.success) {
                success('Page settings updated successfully!')
                setFeatures(prev => ({ ...prev, pageSettings: result.data }))
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

    const splitLangList = (value) => {
        const en = []
        const ar = []
        if (!Array.isArray(value)) return { en, ar }
        value.forEach(item => {
            if (typeof item !== 'string') return
            const text = item.trim()
            if (text.toLowerCase().startsWith('en:')) {
                en.push(text.replace(/^en:\s*/i, ''))
            } else if (text.toLowerCase().startsWith('ar:')) {
                ar.push(text.replace(/^ar:\s*/i, ''))
            } else {
                en.push(text)
            }
        })
        return { en, ar }
    }

    // ═══════════════════════════════════════════════════════════════
    // Open Modal
    // ═══════════════════════════════════════════════════════════════
    const openModal = (mode, type, item = null) => {
        setModalMode(mode)
        setModalType(type)
        setSelectedItem(item)

        // Initialize form data based on type
        const initialData = item ? { ...item } : {}
        if (initialData.facts && Array.isArray(initialData.facts)) {
            const { en, ar } = splitLangList(initialData.facts)
            initialData.facts = en.join(', ')
            initialData.factsAr = ar.join(', ')
        }
        if (initialData.uses && Array.isArray(initialData.uses)) {
            const { en, ar } = splitLangList(initialData.uses)
            initialData.uses = en.join(', ')
            initialData.usesAr = ar.join(', ')
        }
        if (initialData.threats && Array.isArray(initialData.threats)) {
            const { en, ar } = splitLangList(initialData.threats)
            initialData.threats = en.join(', ')
            initialData.threatsAr = ar.join(', ')
        }
        if (typeof initialData.isActive !== 'boolean') {
            initialData.isActive = true
        }
        if (typeof initialData.featured !== 'boolean') {
            initialData.featured = false
        }

        // Populate defaults for create mode if empty
        if (mode === 'create') {
            if (type === 'main') {
                Object.assign(initialData, {
                    titleEn: '', titleAr: '',
                    descriptionEn: '', descriptionAr: '',
                    isActive: true, featured: true,
                    gradient: 'from-green-500 to-emerald-600',
                    icon: '🌟',
                    facts: '',
                    factsAr: '',
                    uses: '',
                    usesAr: '',
                    threats: '',
                    threatsAr: '',
                    conservationStatus: '',
                    conservationStatusAr: '',
                    location: '',
                    locationAr: ''
                })
            } else if (type === 'beach') {
                Object.assign(initialData, {
                    nameEn: '', nameAr: '',
                    descriptionEn: '', descriptionAr: '',
                    activitiesEn: '', activitiesAr: '',
                    bestTimeEn: '', bestTimeAr: '',
                    rating: 5,
                    gradient: 'from-cyan-500 to-blue-600',
                    isActive: true, featured: true
                })
            } else if (type === 'cave') {
                Object.assign(initialData, {
                    nameEn: '', nameAr: '',
                    descriptionEn: '', descriptionAr: '',
                    depth: '', difficultyEn: '', difficultyAr: '',
                    durationEn: '', durationAr: '',
                    gradient: 'from-purple-600 to-indigo-700',
                    isActive: true
                })
            } else if (type === 'wildlife') {
                Object.assign(initialData, {
                    nameEn: '', nameAr: '',
                    scientificName: '',
                    descriptionEn: '', descriptionAr: '',
                    categoryEn: '', categoryAr: '',
                    sizeEn: '', sizeAr: '',
                    statusEn: '', statusAr: '',
                    gradient: 'from-green-500 to-emerald-600',
                    icon: '🦎',
                    isActive: true
                })
            }
        }

        setFormData(initialData)
        setShowModal(true)
    }

    // ═══════════════════════════════════════════════════════════════
    // Save Item
    // ═══════════════════════════════════════════════════════════════
    const handleSave = async () => {
        setSaving(true)

        try {
            const url = '/api/admin/unique-features'
            const method = modalMode === 'create' ? 'POST' : 'PUT'

            const body = {
                type: modalType,
                id: selectedItem?.id,
                data: formData
            }

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })

            const result = await response.json()

            if (result.success) {
                success(`Item ${modalMode === 'create' ? 'created' : 'updated'} successfully!`)
                fetchFeatures() // Refresh all data to keep it simple
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
    const handleDelete = async (id) => {
        if (!confirm(isAr ? 'هل تريد حذف هذا العنصر؟' : 'Are you sure you want to delete this item?')) return

        try {
            const response = await fetch(`/api/admin/unique-features?id=${id}`, {
                method: 'DELETE'
            })

            const result = await response.json()

            if (result.success) {
                success('Item deleted successfully!')
                fetchFeatures()
            } else {
                showError(result.error || 'Delete failed')
            }
        } catch (error) {
            console.error('Error deleting:', error)
            showError('Error deleting item')
        }
    }

    // ═══════════════════════════════════════════════════════════════
    // Restore Default Content
    // ═══════════════════════════════════════════════════════════════
    const restoreDefaults = async () => {
        if (!confirm(isAr ? 'هل أنت متأكد؟ سيتم إضافة البيانات الافتراضية.' : 'Are you sure? This will add default data.')) return

        setLoading(true)
        try {
            const response = await fetch('/api/admin/unique-features', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ type: 'seed', data: {} })
            })

            const result = await response.json()

            if (result.success) {
                success('Data restored successfully!')
                fetchFeatures()
            } else {
                showError(result.error || 'Restore failed')
            }
        } catch (error) {
            console.error('Error restoring:', error)
            showError('Error restoring data')
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <AdminLayout title={isAr ? 'إدارة الميزات الفريدة' : 'Unique Features Management'}>
                <div className="flex items-center justify-center min-h-[60vh]">
                    <div className="relative w-24 h-24">
                        <div className="absolute top-0 left-0 w-full h-full border-4 border-green-200 rounded-full animate-ping opacity-75"></div>
                        <div className="absolute top-0 left-0 w-full h-full border-4 border-t-green-600 rounded-full animate-spin"></div>
                    </div>
                </div>
            </AdminLayout>
        )
    }

    return (
        <AdminLayout title={isAr ? 'إدارة الميزات الفريدة' : 'Unique Features Management'}>

            {/* ═══════════════════════════════════════════════════════════════
                 Premium Dashboard Header
            ═══════════════════════════════════════════════════════════════ */}
            <div className="mb-10 bg-gradient-to-r from-green-900 via-emerald-800 to-teal-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl">
                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-black/10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/3" />

                <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-2 flex items-center gap-3">
                            <span className="text-4xl">🌟</span>
                            {isAr ? 'لوحة الميزات الفريدة' : 'Unique Features Dashboard'}
                        </h1>
                        <p className="text-green-100/80 text-lg max-w-2xl">
                            {isAr
                                ? 'تحكم في الأيقونات الطبيعية لسقطرى: نباتات نادرة، شواطئ ساحرة، كهوف عميقة، وحياة برية فريدة.'
                                : 'Manage Socotra\'s natural icons: rare flora, stunning beaches, deep caves, and unique wildlife.'}
                        </p>
                    </div>
                    {/* Quick Stats or Actions could go here */}
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                 Modern Animated Tabs
            ═══════════════════════════════════════════════════════════════ */}
            <div className="mb-8 overflow-x-auto pb-4">
                <div className="flex space-x-2 md:space-x-4 min-w-max p-1 bg-gray-100 dark:bg-gray-800/50 rounded-2xl border border-gray-200 dark:border-gray-700/50">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`relative px-6 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-2 ${activeTab === tab.id ? 'text-white' : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'}`}
                        >
                            {activeTab === tab.id && (
                                <motion.div
                                    layoutId="activeTabBg"
                                    className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl shadow-lg"
                                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                />
                            )}
                            <span className="relative z-10 text-xl">{tab.icon}</span>
                            <span className="relative z-10">{isAr ? tab.labelAr : tab.labelEn}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                  Tab Content Area
            ═══════════════════════════════════════════════════════════════ */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.3 }}
                >
                    {/* ═══════════════════════════════════════════════════════════════
                        Settings Tab
                    ═══════════════════════════════════════════════════════════════ */}
                    {activeTab === 'settings' && (
                        <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden">
                            <div className="p-8 border-b border-gray-100 dark:border-gray-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/50 dark:bg-gray-900/50">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        ⚙️ {isAr ? 'الإعدادات العامة للصفحة' : 'Page Configuration'}
                                    </h3>
                                    <p className="text-gray-500 text-sm mt-1">{isAr ? 'تخصيص العناوين وصور الخلفية' : 'Customize titles, SEO and background images'}</p>
                                </div>
                                <button
                                    onClick={savePageSettings}
                                    disabled={saving}
                                    className={`btn bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 rounded-xl shadow-lg shadow-green-600/20 transform transition hover:-translate-y-0.5 ${saving ? 'opacity-70 cursor-not-allowed' : ''}`}
                                >
                                    {saving ? (
                                        <div className="flex items-center gap-2">
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            {isAr ? 'جاري الحفظ...' : 'Saving...'}
                                        </div>
                                    ) : (
                                        <div className="flex items-center gap-2">
                                            <span>💾</span>
                                            {isAr ? 'حفظ التغييرات' : 'Save Changes'}
                                        </div>
                                    )}
                                </button>
                            </div>

                            <div className="p-8 space-y-10">
                                {/* Hero Settings */}
                                <div>
                                    <h4 className="text-lg font-bold text-green-700 dark:text-green-400 mb-6 flex items-center gap-2">
                                        <span className="w-8 h-8 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600">🖼️</span>
                                        {isAr ? 'إعدادات القسم الرئيسي (Hero)' : 'Hero Section'}
                                    </h4>
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">{isAr ? 'العنوان الرئيسي (إنجليزي)' : 'Hero Title (EN)'}</label>
                                                <input
                                                    type="text"
                                                    value={pageSettings.heroTitleEn || ''}
                                                    onChange={(e) => setPageSettings({ ...pageSettings, heroTitleEn: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                                    placeholder="e.g. Unique Features"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">{isAr ? 'العنوان الفرعي (إنجليزي)' : 'Hero Subtitle (EN)'}</label>
                                                <textarea
                                                    value={pageSettings.heroSubtitleEn || ''}
                                                    onChange={(e) => setPageSettings({ ...pageSettings, heroSubtitleEn: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all min-h-[100px]"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">{isAr ? 'العنوان الرئيسي (عربي)' : 'Hero Title (AR)'}</label>
                                                <input
                                                    type="text"
                                                    value={pageSettings.heroTitleAr || ''}
                                                    onChange={(e) => setPageSettings({ ...pageSettings, heroTitleAr: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-right"
                                                    placeholder="مثال: ميزات فريدة"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">{isAr ? 'العنوان الفرعي (عربي)' : 'Hero Subtitle (AR)'}</label>
                                                <textarea
                                                    value={pageSettings.heroSubtitleAr || ''}
                                                    onChange={(e) => setPageSettings({ ...pageSettings, heroSubtitleAr: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-right min-h-[100px]"
                                                />
                                            </div>
                                        </div>
                                        <div className="md:col-span-2">
                                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">{isAr ? 'صورة الخلفية' : 'Hero Background Image'}</label>
                                            <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 hover:border-green-500 transition-colors">
                                                <ImageUploader
                                                    value={pageSettings.heroImage || ''}
                                                    onChange={(url) => setPageSettings({ ...pageSettings, heroImage: url })}
                                                    folder="unique-features"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="h-px bg-gray-100 dark:bg-gray-700 w-full" />

                                <div>
                                    <h4 className="text-lg font-bold text-emerald-700 dark:text-emerald-400 mb-6 flex items-center gap-2">
                                        <span className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600">🧭</span>
                                        {isAr ? 'عناوين الأقسام' : 'Section Titles'}
                                    </h4>
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <h5 className="font-semibold text-gray-800 dark:text-gray-200">{isAr ? 'قسم الشواطئ' : 'Beaches Section'}</h5>
                                            <div>
                                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">{isAr ? 'العنوان (EN)' : 'Title (EN)'}</label>
                                                <input
                                                    type="text"
                                                    value={pageSettings.beachesTitleEn || ''}
                                                    onChange={(e) => setPageSettings({ ...pageSettings, beachesTitleEn: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">{isAr ? 'الوصف (EN)' : 'Subtitle (EN)'}</label>
                                                <textarea
                                                    value={pageSettings.beachesSubtitleEn || ''}
                                                    onChange={(e) => setPageSettings({ ...pageSettings, beachesSubtitleEn: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all min-h-[90px]"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">{isAr ? 'العنوان (AR)' : 'Title (AR)'}</label>
                                                <input
                                                    type="text"
                                                    value={pageSettings.beachesTitleAr || ''}
                                                    onChange={(e) => setPageSettings({ ...pageSettings, beachesTitleAr: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-right"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">{isAr ? 'الوصف (AR)' : 'Subtitle (AR)'}</label>
                                                <textarea
                                                    value={pageSettings.beachesSubtitleAr || ''}
                                                    onChange={(e) => setPageSettings({ ...pageSettings, beachesSubtitleAr: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-right min-h-[90px]"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <h5 className="font-semibold text-gray-800 dark:text-gray-200">{isAr ? 'قسم الكهوف' : 'Caves Section'}</h5>
                                            <div>
                                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">{isAr ? 'العنوان (EN)' : 'Title (EN)'}</label>
                                                <input
                                                    type="text"
                                                    value={pageSettings.cavesTitleEn || ''}
                                                    onChange={(e) => setPageSettings({ ...pageSettings, cavesTitleEn: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">{isAr ? 'الوصف (EN)' : 'Subtitle (EN)'}</label>
                                                <textarea
                                                    value={pageSettings.cavesSubtitleEn || ''}
                                                    onChange={(e) => setPageSettings({ ...pageSettings, cavesSubtitleEn: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all min-h-[90px]"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">{isAr ? 'العنوان (AR)' : 'Title (AR)'}</label>
                                                <input
                                                    type="text"
                                                    value={pageSettings.cavesTitleAr || ''}
                                                    onChange={(e) => setPageSettings({ ...pageSettings, cavesTitleAr: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-right"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">{isAr ? 'الوصف (AR)' : 'Subtitle (AR)'}</label>
                                                <textarea
                                                    value={pageSettings.cavesSubtitleAr || ''}
                                                    onChange={(e) => setPageSettings({ ...pageSettings, cavesSubtitleAr: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-right min-h-[90px]"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">{isAr ? 'نص زر الدعوة (EN)' : 'CTA Text (EN)'}</label>
                                                <input
                                                    type="text"
                                                    value={pageSettings.cavesCtaEn || ''}
                                                    onChange={(e) => setPageSettings({ ...pageSettings, cavesCtaEn: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">{isAr ? 'نص زر الدعوة (AR)' : 'CTA Text (AR)'}</label>
                                                <input
                                                    type="text"
                                                    value={pageSettings.cavesCtaAr || ''}
                                                    onChange={(e) => setPageSettings({ ...pageSettings, cavesCtaAr: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-right"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <h5 className="font-semibold text-gray-800 dark:text-gray-200">{isAr ? 'قسم الحياة البرية' : 'Wildlife Section'}</h5>
                                            <div>
                                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">{isAr ? 'العنوان (EN)' : 'Title (EN)'}</label>
                                                <input
                                                    type="text"
                                                    value={pageSettings.wildlifeTitleEn || ''}
                                                    onChange={(e) => setPageSettings({ ...pageSettings, wildlifeTitleEn: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">{isAr ? 'الوصف (EN)' : 'Subtitle (EN)'}</label>
                                                <textarea
                                                    value={pageSettings.wildlifeSubtitleEn || ''}
                                                    onChange={(e) => setPageSettings({ ...pageSettings, wildlifeSubtitleEn: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all min-h-[90px]"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">{isAr ? 'العنوان (AR)' : 'Title (AR)'}</label>
                                                <input
                                                    type="text"
                                                    value={pageSettings.wildlifeTitleAr || ''}
                                                    onChange={(e) => setPageSettings({ ...pageSettings, wildlifeTitleAr: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-right"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">{isAr ? 'الوصف (AR)' : 'Subtitle (AR)'}</label>
                                                <textarea
                                                    value={pageSettings.wildlifeSubtitleAr || ''}
                                                    onChange={(e) => setPageSettings({ ...pageSettings, wildlifeSubtitleAr: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all text-right min-h-[90px]"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="h-px bg-gray-100 dark:bg-gray-700 w-full" />

                                {/* SEO Settings */}
                                <div>
                                    <h4 className="text-lg font-bold text-blue-700 dark:text-blue-400 mb-6 flex items-center gap-2">
                                        <span className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600">🔍</span>
                                        {isAr ? 'تحسين محركات البحث (SEO)' : 'SEO Settings'}
                                    </h4>
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">{isAr ? 'عنوان الصفحة (Meta Title EN)' : 'Meta Title (EN)'}</label>
                                                <input
                                                    type="text"
                                                    value={pageSettings.metaTitleEn || ''}
                                                    onChange={(e) => setPageSettings({ ...pageSettings, metaTitleEn: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">{isAr ? 'وصف الصفحة (Meta Desc EN)' : 'Meta Description (EN)'}</label>
                                                <textarea
                                                    value={pageSettings.metaDescEn || ''}
                                                    onChange={(e) => setPageSettings({ ...pageSettings, metaDescEn: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all min-h-[100px]"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">{isAr ? 'عنوان الصفحة (Meta Title AR)' : 'Meta Title (AR)'}</label>
                                                <input
                                                    type="text"
                                                    value={pageSettings.metaTitleAr || ''}
                                                    onChange={(e) => setPageSettings({ ...pageSettings, metaTitleAr: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-right"
                                                />
                                            </div>
                                            <div>
                                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">{isAr ? 'وصف الصفحة (Meta Desc AR)' : 'Meta Description (AR)'}</label>
                                                <textarea
                                                    value={pageSettings.metaDescAr || ''}
                                                    onChange={(e) => setPageSettings({ ...pageSettings, metaDescAr: e.target.value })}
                                                    className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-right min-h-[100px]"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="h-px bg-gray-100 dark:bg-gray-700 w-full" />

                                {/* Restore Defaults Section */}
                                <div className="flex justify-between items-center p-6 bg-red-50 dark:bg-red-900/10 rounded-2xl border border-red-100 dark:border-red-900/30">
                                    <div>
                                        <h4 className="text-lg font-bold text-red-800 dark:text-red-300 mb-1 flex items-center gap-2">
                                            ⚠️ {isAr ? 'منطقة الخطر' : 'Danger Zone'}
                                        </h4>
                                        <p className="text-sm text-red-600 dark:text-red-400">
                                            {isAr ? 'استعادة البيانات الافتراضية إذا كانت القائمة فارغة.' : 'Restore default data only if the list is empty.'}
                                        </p>
                                    </div>
                                    <button
                                        onClick={restoreDefaults}
                                        className="btn bg-white dark:bg-red-900/20 hover:bg-red-50 text-red-600 border border-red-200 dark:border-red-800 px-6 py-2 rounded-lg text-sm font-bold shadow-sm"
                                    >
                                        {isAr ? 'استعادة البيانات' : 'Restore Data'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ═══════════════════════════════════════════════════════════════
                    Main Features Tab
                    ═══════════════════════════════════════════════════════════════ */}
                    {/* ═══════════════════════════════════════════════════════════════
                    Main Features Tab
                    ═══════════════════════════════════════════════════════════════ */}
                    {activeTab === 'main' && (
                        <div>
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        🌟 {isAr ? 'الميزات الرئيسية' : 'Main Features'}
                                    </h3>
                                    <p className="text-gray-500 text-sm mt-1">{isAr ? 'إدارة العناصر المميزة مثل دم الأخوين' : 'Manage highlight features like Dragon Blood Trees'}</p>
                                </div>
                                <button
                                    onClick={() => openModal('create', 'main')}
                                    className="btn bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl shadow-lg shadow-green-600/20 flex items-center gap-2 transform transition hover:-translate-y-0.5"
                                >
                                    <span className="text-xl">+</span>
                                    {isAr ? 'إضافة ميزة' : 'Add Feature'}
                                </button>
                            </div>

                            <div className="grid gap-6">
                                {features.mainFeatures?.map((feature) => (
                                    <motion.div
                                        key={feature.id}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 overflow-hidden"
                                    >
                                        <div className="flex flex-col md:flex-row gap-6 p-6">
                                            <div className="w-full md:w-64 h-48 rounded-xl overflow-hidden relative shrink-0 shadow-md">
                                                {feature.images?.[0] ? (
                                                    <Image
                                                        src={feature.images[0]}
                                                        alt={feature.nameEn}
                                                        fill
                                                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                        sizes="(min-width: 768px) 256px, 100vw"
                                                        unoptimized
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-green-100 to-emerald-200 flex items-center justify-center text-4xl">
                                                        🌿
                                                    </div>
                                                )}
                                                {feature.featured && (
                                                    <div className="absolute top-2 left-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-lg shadow-sm flex items-center gap-1">
                                                        <span>⭐</span> {isAr ? 'مميز' : 'Featured'}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-1 flex flex-col">
                                                <div className="flex justify-between items-start">
                                                    <div>
                                                        <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-green-600 transition-colors">
                                                            {isAr ? feature.nameAr || feature.titleAr : feature.nameEn || feature.titleEn}
                                                        </h4>
                                                        <p className="text-gray-500 text-sm line-clamp-2 mb-4 max-w-2xl">
                                                            {isAr ? feature.descriptionAr : feature.descriptionEn}
                                                        </p>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => openModal('edit', 'main', feature)}
                                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                                                            title={isAr ? 'تعديل' : 'Edit'}
                                                        >
                                                            ✏️
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(feature.id)}
                                                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                                                            title={isAr ? 'حذف' : 'Delete'}
                                                        >
                                                            🗑️
                                                        </button>
                                                    </div>
                                                </div>

                                                <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700 flex flex-wrap gap-3">
                                                    {feature.facts && feature.facts.length > 0 ? (
                                                        feature.facts.map((fact, i) => (
                                                            <span key={i} className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full text-xs font-medium">
                                                                {fact}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <span className="text-xs text-gray-400 italic">
                                                            {isAr ? 'لا توجد حقائق مضافة' : 'No facts added'}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}

                                {(!features.mainFeatures || features.mainFeatures.length === 0) && (
                                    <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                                        <p className="text-gray-500">{isAr ? 'لا توجد عناصر مضافة بعد' : 'No items added yet'}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ═══════════════════════════════════════════════════════════════
                    Beaches Tab
                    ═══════════════════════════════════════════════════════════════ */}
                    {activeTab === 'beaches' && (
                        <div>
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        🏖️ {isAr ? 'الشواطئ' : 'Beaches'}
                                    </h3>
                                    <p className="text-gray-500 text-sm mt-1">{isAr ? 'إدارة الشواطئ والأنشطة الساحلية' : 'Manage beaches and coastal activities'}</p>
                                </div>
                                <button
                                    onClick={() => openModal('create', 'beach')}
                                    className="btn bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl shadow-lg shadow-blue-600/20 flex items-center gap-2 transform transition hover:-translate-y-0.5"
                                >
                                    <span className="text-xl">+</span>
                                    {isAr ? 'إضافة شاطئ' : 'Add Beach'}
                                </button>
                            </div>

                            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                                {features.beaches?.map((feature) => (
                                    <motion.div
                                        key={feature.id}
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="group bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col"
                                    >
                                        <div className="relative h-56 overflow-hidden">
                                            {feature.images?.[0] ? (
                                                <Image
                                                    src={feature.images[0]}
                                                    alt={feature.nameEn}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                                                    sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                                                    unoptimized
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center text-4xl">
                                                    🏖️
                                                </div>
                                            )}
                                            <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded-lg text-xs font-bold text-gray-800 shadow-sm flex items-center gap-1">
                                                ⭐ {feature.rating || 5}.0
                                            </div>

                                            {/* Actions Overlay */}
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                                                <button
                                                    onClick={() => openModal('edit', 'beach', feature)}
                                                    className="bg-white text-gray-900 p-2 rounded-full hover:bg-blue-50 transition-colors shadow-lg"
                                                >✏️</button>
                                                <button
                                                    onClick={() => handleDelete(feature.id)}
                                                    className="bg-white text-red-600 p-2 rounded-full hover:bg-red-50 transition-colors shadow-lg"
                                                >🗑️</button>
                                            </div>
                                        </div>

                                        <div className="p-6 flex-1 flex flex-col">
                                            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2 group-hover:text-blue-600 transition-colors">
                                                {isAr ? feature.nameAr : feature.nameEn}
                                            </h4>
                                            <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                                                {isAr ? feature.descriptionAr : feature.descriptionEn}
                                            </p>

                                            <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                                                <div className="flex flex-wrap gap-2">
                                                    {(isAr ? feature.activitiesAr : feature.activitiesEn)?.split(',').slice(0, 3).map((tag, i) => (
                                                        <span key={i} className="px-2 py-1 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300 rounded-md text-xs font-medium">
                                                            {tag.trim()}
                                                        </span>
                                                    ))}
                                                    {(isAr ? feature.activitiesAr : feature.activitiesEn)?.split(',').length > 3 && (
                                                        <span className="px-2 py-1 bg-gray-50 dark:bg-gray-800 text-gray-500 rounded-md text-xs">
                                                            +{((isAr ? feature.activitiesAr : feature.activitiesEn)?.split(',').length - 3)}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}

                                {(!features.beaches || features.beaches.length === 0) && (
                                    <div className="col-span-full text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                                        <p className="text-gray-500">{isAr ? 'لا توجد شواطئ مضافة حتى الآن.' : 'No beaches added yet.'}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ═══════════════════════════════════════════════════════════════
                    Caves Tab
                    ═══════════════════════════════════════════════════════════════ */}
                    {/* ═══════════════════════════════════════════════════════════════
                    Caves Tab
                    ═══════════════════════════════════════════════════════════════ */}
                    {activeTab === 'caves' && (
                        <div>
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        ⛰️ {isAr ? 'الكهوف' : 'Caves'}
                                    </h3>
                                    <p className="text-gray-500 text-sm mt-1">{isAr ? 'إدارة الكهوف والمغارات' : 'Manage caves and caverns'}</p>
                                </div>
                                <button
                                    onClick={() => openModal('create', 'cave')}
                                    className="btn bg-gray-800 hover:bg-gray-900 text-white px-6 py-3 rounded-xl shadow-lg shadow-gray-800/20 flex items-center gap-2 transform transition hover:-translate-y-0.5"
                                >
                                    <span className="text-xl">+</span>
                                    {isAr ? 'إضافة كهف' : 'Add Cave'}
                                </button>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                {features.caves?.map((feature) => (
                                    <motion.div
                                        key={feature.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        className="group relative bg-gray-900 rounded-2xl shadow-xl overflow-hidden min-h-[250px] flex"
                                    >
                                        {/* Background Image with Overlay */}
                                        <div className="absolute inset-0">
                                            {feature.images?.[0] ? (
                                                <Image
                                                    src={feature.images[0]}
                                                    alt={feature.nameEn}
                                                    fill
                                                    className="object-cover opacity-60 transition-transform duration-700 group-hover:scale-110 group-hover:opacity-40"
                                                    sizes="100vw"
                                                    unoptimized
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gray-800" />
                                            )}
                                            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
                                        </div>

                                        <div className="relative z-10 p-8 flex flex-col justify-center w-full md:w-2/3">
                                            <h4 className="text-3xl font-bold text-white mb-2">
                                                {isAr ? feature.nameAr : feature.nameEn}
                                            </h4>
                                            <p className="text-gray-300 text-sm mb-6 line-clamp-3">
                                                {isAr ? feature.descriptionAr : feature.descriptionEn}
                                            </p>

                                            <div className="flex flex-wrap gap-2 mb-6">
                                                {feature.depth && (
                                                    <span className="px-3 py-1 bg-white/10 backdrop-blur border border-white/20 rounded-full text-xs text-white">
                                                        📏 {feature.depth}
                                                    </span>
                                                )}
                                                {(isAr ? feature.difficultyAr || feature.difficultyEn : feature.difficultyEn) && (
                                                    <span className="px-3 py-1 bg-white/10 backdrop-blur border border-white/20 rounded-full text-xs text-white">
                                                        🧗 {(isAr ? feature.difficultyAr || feature.difficultyEn : feature.difficultyEn)}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="flex gap-3">
                                                <button
                                                    onClick={() => openModal('edit', 'cave', feature)}
                                                    className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg backdrop-blur-sm transition-colors text-sm font-semibold"
                                                >
                                                    {isAr ? 'تعديل' : 'Edit'}
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(feature.id)}
                                                    className="px-4 py-2 bg-red-600/80 hover:bg-red-600 text-white rounded-lg backdrop-blur-sm transition-colors text-sm font-semibold"
                                                >
                                                    {isAr ? 'حذف' : 'Delete'}
                                                </button>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}

                                {(!features.caves || features.caves.length === 0) && (
                                    <div className="col-span-full text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                                        <p className="text-gray-500">{isAr ? 'لا توجد كهوف مضافة حتى الآن.' : 'No caves added yet.'}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* ═══════════════════════════════════════════════════════════════
                    Wildlife Tab
                    ═══════════════════════════════════════════════════════════════ */}
                    {activeTab === 'wildlife' && (
                        <div>
                            <div className="flex justify-between items-center mb-8">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        🦎 {isAr ? 'الحياة البرية' : 'Wildlife'}
                                    </h3>
                                    <p className="text-gray-500 text-sm mt-1">{isAr ? 'إدارة الحيوانات والطيور النادرة' : 'Manage rare animals and birds'}</p>
                                </div>
                                <button
                                    onClick={() => openModal('create', 'wildlife')}
                                    className="btn bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-xl shadow-lg shadow-amber-600/20 flex items-center gap-2 transform transition hover:-translate-y-0.5"
                                >
                                    <span className="text-xl">+</span>
                                    {isAr ? 'إضافة حيوان' : 'Add Wildlife'}
                                </button>
                            </div>
                            <div className="grid md:grid-cols-3 gap-6">
                                {features.wildlife?.map((feature) => (
                                    <motion.div
                                        key={feature.id}
                                        whileHover={{ y: -5 }}
                                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden border border-gray-100 dark:border-gray-700"
                                    >
                                        <div className="h-48 overflow-hidden relative group">
                                            {feature.images?.[0] ? (
                                                <Image
                                                    src={feature.images[0]}
                                                    alt={feature.nameEn}
                                                    fill
                                                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                    sizes="(min-width: 768px) 33vw, 100vw"
                                                    unoptimized
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center text-4xl">
                                                    🦎
                                                </div>
                                            )}
                                            <div className="absolute top-2 right-2 flex gap-1">
                                                <button onClick={() => openModal('edit', 'wildlife', feature)} className="p-2 bg-white/90 rounded-full shadow-sm text-gray-700 hover:text-amber-600 transition-colors">✏️</button>
                                                <button onClick={() => handleDelete(feature.id)} className="p-2 bg-white/90 rounded-full shadow-sm text-gray-700 hover:text-red-600 transition-colors">🗑️</button>
                                            </div>
                                        </div>
                                        <div className="p-6">
                                            <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                                {isAr ? feature.nameAr : feature.nameEn}
                                            </h4>
                                            <p className="text-gray-500 text-sm line-clamp-3 mb-4">
                                                {isAr ? feature.descriptionAr : feature.descriptionEn}
                                            </p>
                                            {feature.scientificName && (
                                                <p className="text-xs text-amber-600 dark:text-amber-400 italic">
                                                    {feature.scientificName}
                                                </p>
                                            )}
                                        </div>
                                    </motion.div>
                                ))}

                                {(!features.wildlife || features.wildlife.length === 0) && (
                                    <div className="col-span-full text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border border-dashed border-gray-300 dark:border-gray-700">
                                        <p className="text-gray-500">{isAr ? 'لا توجد حياة برية مضافة حتى الآن.' : 'No wildlife added yet.'}</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                </motion.div>
            </AnimatePresence>

            {/* ═══════════════════════════════════════════════════════════════
                 General Modal (Premium Glassmorphism)
            ═══════════════════════════════════════════════════════════════ */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4"
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-white/20 dark:border-gray-700"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-b border-gray-100 dark:border-gray-800 px-8 py-5 flex items-center justify-between z-10">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                        {modalMode === 'create' ? '✨' : '✏️'}
                                        {modalMode === 'create' ? (isAr ? 'إضافة عنصر جديد' : 'Add New Item') : (isAr ? 'تعديل العنصر' : 'Edit Item')}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {isAr ? 'قم بملء التفاصيل أدناه' : 'Fill in the details below'}
                                    </p>
                                </div>
                                <button
                                    onClick={() => setShowModal(false)}
                                    className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors"
                                >
                                    ✕
                                </button>
                            </div>

                            <div className="p-8">
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <h4 className="font-bold text-gray-900 dark:text-white border-b pb-2 mb-4 dark:border-gray-700">{isAr ? 'المحتوى الإنجليزي' : 'English Content'}</h4>
                                        <div>
                                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">{isAr ? 'الاسم (EN)' : 'Name (EN)'}</label>
                                            <input
                                                type="text"
                                                value={formData.nameEn || formData.titleEn || ''}
                                                onChange={(e) => setFormData({ ...formData, nameEn: e.target.value, titleEn: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                                                placeholder="Item Name"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">{isAr ? 'الوصف (EN)' : 'Description (EN)'}</label>
                                            <textarea
                                                value={formData.descriptionEn || ''}
                                                onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all min-h-[120px]"
                                                placeholder="Detailed description..."
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <h4 className="font-bold text-gray-900 dark:text-white border-b pb-2 mb-4 dark:border-gray-700">{isAr ? 'المحتوى العربي' : 'Arabic Content'}</h4>
                                        <div>
                                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">{isAr ? 'الاسم (AR)' : 'Name (AR)'}</label>
                                            <input
                                                type="text"
                                                value={formData.nameAr || formData.titleAr || ''}
                                                onChange={(e) => setFormData({ ...formData, nameAr: e.target.value, titleAr: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-right"
                                                placeholder="اسم العنصر"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">{isAr ? 'الوصف (AR)' : 'Description (AR)'}</label>
                                            <textarea
                                                value={formData.descriptionAr || ''}
                                                onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                                                className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-right min-h-[120px]"
                                                placeholder="وصف تفصيلي..."
                                            />
                                        </div>
                                    </div>

                                    {/* Image Field for All Types */}
                                    <div className="md:col-span-2 mt-4">
                                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">{isAr ? 'الصورة المميزة' : 'Featured Image'}</label>
                                        <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-xl border border-dashed border-gray-300 dark:border-gray-700 hover:border-green-500 transition-colors">
                                            <ImageUploader
                                                value={formData.imageUrl !== undefined ? formData.imageUrl : (formData.images?.[0] || '')}
                                                onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                                                folder="unique-features"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 grid md:grid-cols-2 gap-4 bg-gray-50 dark:bg-gray-800/30 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-white">{isAr ? 'عرض العنصر' : 'Visible'}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{isAr ? 'إظهار العنصر في الموقع' : 'Show item on site'}</p>
                                        </div>
                                        <button
                                            onClick={() => setFormData({ ...formData, isActive: !formData.isActive })}
                                            className={`w-12 h-7 rounded-full transition-all ${formData.isActive ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-700'}`}
                                        >
                                            <span className={`block w-5 h-5 bg-white rounded-full transform transition-all ${formData.isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                                        </button>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="font-semibold text-gray-900 dark:text-white">{isAr ? 'عنصر مميز' : 'Featured'}</p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">{isAr ? 'تمييز العنصر في القوائم' : 'Highlight in listings'}</p>
                                        </div>
                                        <button
                                            onClick={() => setFormData({ ...formData, featured: !formData.featured })}
                                            className={`w-12 h-7 rounded-full transition-all ${formData.featured ? 'bg-amber-500' : 'bg-gray-300 dark:bg-gray-700'}`}
                                        >
                                            <span className={`block w-5 h-5 bg-white rounded-full transform transition-all ${formData.featured ? 'translate-x-6' : 'translate-x-1'}`} />
                                        </button>
                                    </div>
                                </div>

                                {modalType === 'main' && (
                                    <div className="mt-8 bg-gray-50 dark:bg-gray-800/30 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                                        <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                            🌿 {isAr ? 'تفاصيل النباتات' : 'Flora Details'}
                                        </h4>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">{isAr ? 'حقائق (EN - فواصل)' : 'Facts (EN - comma separated)'}</label>
                                                <input type="text" value={formData.facts || ''} onChange={(e) => setFormData({ ...formData, facts: e.target.value })} className="input" />
                                            </div>
                                            <div>
                                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">{isAr ? 'حقائق (AR - فواصل)' : 'Facts (AR - comma separated)'}</label>
                                                <input type="text" value={formData.factsAr || ''} onChange={(e) => setFormData({ ...formData, factsAr: e.target.value })} className="input text-right" />
                                            </div>
                                            <div>
                                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">{isAr ? 'الاستخدامات (EN - فواصل)' : 'Uses (EN - comma separated)'}</label>
                                                <input type="text" value={formData.uses || ''} onChange={(e) => setFormData({ ...formData, uses: e.target.value })} className="input" />
                                            </div>
                                            <div>
                                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">{isAr ? 'الاستخدامات (AR - فواصل)' : 'Uses (AR - comma separated)'}</label>
                                                <input type="text" value={formData.usesAr || ''} onChange={(e) => setFormData({ ...formData, usesAr: e.target.value })} className="input text-right" />
                                            </div>
                                            <div>
                                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">{isAr ? 'التهديدات (EN - فواصل)' : 'Threats (EN - comma separated)'}</label>
                                                <input type="text" value={formData.threats || ''} onChange={(e) => setFormData({ ...formData, threats: e.target.value })} className="input" />
                                            </div>
                                            <div>
                                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">{isAr ? 'التهديدات (AR - فواصل)' : 'Threats (AR - comma separated)'}</label>
                                                <input type="text" value={formData.threatsAr || ''} onChange={(e) => setFormData({ ...formData, threatsAr: e.target.value })} className="input text-right" />
                                            </div>
                                            <div>
                                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">{isAr ? 'حالة الحفظ (EN)' : 'Conservation (EN)'}</label>
                                                <input type="text" value={formData.conservationStatus || ''} onChange={(e) => setFormData({ ...formData, conservationStatus: e.target.value })} className="input" />
                                            </div>
                                            <div>
                                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">{isAr ? 'حالة الحفظ (AR)' : 'Conservation (AR)'}</label>
                                                <input type="text" value={formData.conservationStatusAr || ''} onChange={(e) => setFormData({ ...formData, conservationStatusAr: e.target.value })} className="input text-right" />
                                            </div>
                                            <div>
                                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">{isAr ? 'الموقع (EN)' : 'Location (EN)'}</label>
                                                <input type="text" value={formData.location || ''} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="input" />
                                            </div>
                                            <div>
                                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">{isAr ? 'الموقع (AR)' : 'Location (AR)'}</label>
                                                <input type="text" value={formData.locationAr || ''} onChange={(e) => setFormData({ ...formData, locationAr: e.target.value })} className="input text-right" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Unique Fields Area */}
                                {(modalType === 'beach' || modalType === 'cave') && (
                                    <div className="mt-8 bg-gray-50 dark:bg-gray-800/30 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                                        <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                            🎯 {isAr ? 'تفاصيل إضافية' : 'Additional Details'}
                                        </h4>

                                        {modalType === 'beach' && (
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">{isAr ? 'أفضل وقت (EN)' : 'Best Time (EN)'}</label>
                                                    <input type="text" value={formData.bestTimeEn || ''} onChange={(e) => setFormData({ ...formData, bestTimeEn: e.target.value })} className="input" />
                                                </div>
                                                <div>
                                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">{isAr ? 'أفضل وقت (AR)' : 'Best Time (AR)'}</label>
                                                    <input type="text" value={formData.bestTimeAr || ''} onChange={(e) => setFormData({ ...formData, bestTimeAr: e.target.value })} className="input text-right" />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">{isAr ? 'الأنشطة (مفصولة بفواصل)' : 'Activities (comma separated)'}</label>
                                                    <input type="text" value={formData.activitiesEn || ''} onChange={(e) => setFormData({ ...formData, activitiesEn: e.target.value })} className="input" placeholder="Swimming, Snorkeling, etc." />
                                                </div>
                                                <div className="md:col-span-2">
                                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">{isAr ? 'الأنشطة (عربي)' : 'Activities (AR)'}</label>
                                                    <input type="text" value={formData.activitiesAr || ''} onChange={(e) => setFormData({ ...formData, activitiesAr: e.target.value })} className="input text-right" placeholder="سباحة، غطس..." />
                                                </div>
                                                <div>
                                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">{isAr ? 'التقييم' : 'Rating'}</label>
                                                    <input type="number" min="1" max="5" step="0.1" value={formData.rating ?? 5} onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })} className="input" />
                                                </div>
                                            </div>
                                        )}

                                        {modalType === 'cave' && (
                                            <div className="grid md:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">{isAr ? 'العمق / الطول' : 'Depth / Length'}</label>
                                                    <input type="text" value={formData.depth || ''} onChange={(e) => setFormData({ ...formData, depth: e.target.value })} className="input" placeholder="e.g. 3km" />
                                                </div>
                                                <div>
                                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">{isAr ? 'الصعوبة' : 'Difficulty'}</label>
                                                    <input type="text" value={formData.difficultyEn || ''} onChange={(e) => setFormData({ ...formData, difficultyEn: e.target.value })} className="input" placeholder="e.g. Moderate" />
                                                </div>
                                                <div>
                                                    <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">{isAr ? 'الصعوبة (AR)' : 'Difficulty (AR)'}</label>
                                                    <input type="text" value={formData.difficultyAr || ''} onChange={(e) => setFormData({ ...formData, difficultyAr: e.target.value })} className="input text-right" />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {modalType === 'wildlife' && (
                                    <div className="mt-8 bg-gray-50 dark:bg-gray-800/30 p-6 rounded-2xl border border-gray-100 dark:border-gray-800">
                                        <h4 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                            🦎 {isAr ? 'تفاصيل الحياة البرية' : 'Wildlife Details'}
                                        </h4>
                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">{isAr ? 'الاسم العلمي' : 'Scientific Name'}</label>
                                                <input type="text" value={formData.scientificName || ''} onChange={(e) => setFormData({ ...formData, scientificName: e.target.value })} className="input" />
                                            </div>
                                            <div>
                                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">{isAr ? 'الأيقونة' : 'Icon'}</label>
                                                <input type="text" value={formData.icon || ''} onChange={(e) => setFormData({ ...formData, icon: e.target.value })} className="input text-center" placeholder="🦎" />
                                            </div>
                                            <div>
                                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">{isAr ? 'الفئة (EN)' : 'Category (EN)'}</label>
                                                <input type="text" value={formData.categoryEn || ''} onChange={(e) => setFormData({ ...formData, categoryEn: e.target.value })} className="input" />
                                            </div>
                                            <div>
                                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">{isAr ? 'الفئة (AR)' : 'Category (AR)'}</label>
                                                <input type="text" value={formData.categoryAr || ''} onChange={(e) => setFormData({ ...formData, categoryAr: e.target.value })} className="input text-right" />
                                            </div>
                                            <div>
                                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">{isAr ? 'الحجم (EN)' : 'Size (EN)'}</label>
                                                <input type="text" value={formData.sizeEn || ''} onChange={(e) => setFormData({ ...formData, sizeEn: e.target.value })} className="input" />
                                            </div>
                                            <div>
                                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">{isAr ? 'الحجم (AR)' : 'Size (AR)'}</label>
                                                <input type="text" value={formData.sizeAr || ''} onChange={(e) => setFormData({ ...formData, sizeAr: e.target.value })} className="input text-right" />
                                            </div>
                                            <div>
                                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">{isAr ? 'الحالة (EN)' : 'Status (EN)'}</label>
                                                <input type="text" value={formData.statusEn || ''} onChange={(e) => setFormData({ ...formData, statusEn: e.target.value })} className="input" />
                                            </div>
                                            <div>
                                                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">{isAr ? 'الحالة (AR)' : 'Status (AR)'}</label>
                                                <input type="text" value={formData.statusAr || ''} onChange={(e) => setFormData({ ...formData, statusAr: e.target.value })} className="input text-right" />
                                            </div>
                                        </div>
                                    </div>
                                )}

                                <div className="mt-8 flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-800">
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="px-6 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        {isAr ? 'إلغاء' : 'Cancel'}
                                    </button>
                                    <button
                                        onClick={handleSave}
                                        disabled={saving}
                                        className="px-8 py-2.5 rounded-xl bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold shadow-lg shadow-green-600/20 hover:from-green-700 hover:to-emerald-700 transform transition hover:-translate-y-0.5 disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {saving ? (isAr ? 'جاري الحفظ...' : 'Saving...') : (isAr ? 'حفظ' : 'Save')}
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </AdminLayout >
    )
}
