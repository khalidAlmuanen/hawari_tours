'use client'

// ═══════════════════════════════════════════════════════════════
// 📖 ABOUT PAGE MANAGEMENT - Ultra Professional & Modern
// إدارة صفحة من نحن - تصميم احترافي وعصري جداً
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect, useRef, useCallback } from 'react'
import { useApp } from '@/contexts/AppContext'
import AdminLayout from '@/components/admin/AdminLayout'
import { useToast } from '@/components/admin/Toast'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import {
    FaGlobeAmericas, FaLeaf, FaTheaterMasks, FaPlus, FaEdit, FaTrash,
    FaSave, FaTimes, FaCamera, FaSpinner, FaCloudUploadAlt, FaImage, FaCog
} from 'react-icons/fa'

// ═══════════════════════════════════════════════════════════════
// 🖼️ IMAGE UPLOAD COMPONENT
// ═══════════════════════════════════════════════════════════════

const ImageUpload = ({ label, value, onChange, isAr }) => {
    const [uploading, setUploading] = useState(false)
    const fileInputRef = useRef(null)
    const { error: showError } = useToast()

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (!file.type.startsWith('image/')) {
            showError(isAr ? 'يجب اختيار ملف صورة' : 'Please select an image file')
            return
        }

        if (file.size > 5 * 1024 * 1024) {
            showError(isAr ? 'حجم الصورة يجب أن يكون أقل من 5 ميجابايت' : 'Image size must be less than 5MB')
            return
        }

        setUploading(true)
        const formData = new FormData()
        formData.append('file', file)

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData
            })
            const result = await response.json()

            if (result.success) {
                onChange(result.url)
            } else {
                showError(isAr ? 'فشل رفع الصورة' : 'Failed to upload image')
            }
        } catch (error) {
            console.error('Upload error:', error)
            showError(isAr ? 'حدث خطأ أثناء الرفع' : 'Error uploading image')
        } finally {
            setUploading(false)
        }
    }

    return (
        <div className="space-y-3">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 ml-1">
                {label}
            </label>

            <div className="relative group">
                <div
                    onClick={() => fileInputRef.current?.click()}
                    className={`
                        relative w-full h-56 rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden
                        ${value
                            ? 'border-green-500/50 bg-gray-50 dark:bg-gray-800'
                            : 'border-gray-300 dark:border-gray-600 hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/10'
                        }
                    `}
                >
                    {value ? (
                        <>
                            <Image
                                src={value}
                                alt="Preview"
                                fill
                                className="object-cover"
                                sizes="(min-width: 768px) 50vw, 100vw"
                                unoptimized
                            />
                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center backdrop-blur-sm">
                                <span className="px-4 py-2 bg-white/10 border border-white/20 rounded-full text-white font-bold flex items-center gap-2 hover:bg-white/20 transition-colors">
                                    <FaCamera /> {isAr ? 'تغيير الصورة' : 'Change Image'}
                                </span>
                            </div>
                        </>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-4 group-hover:scale-105 transition-transform duration-300">
                            {uploading ? (
                                <FaSpinner className="w-10 h-10 animate-spin text-blue-500" />
                            ) : (
                                <>
                                    <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700/50 flex items-center justify-center group-hover:bg-blue-100 dark:group-hover:bg-blue-900/30 group-hover:text-blue-500 transition-colors">
                                        <FaCloudUploadAlt className="w-8 h-8" />
                                    </div>
                                    <span className="text-sm font-bold text-gray-500 group-hover:text-blue-500 transition-colors">
                                        {isAr ? 'اضغط لرفع صورة' : 'Click to upload image'}
                                    </span>
                                </>
                            )}
                        </div>
                    )}
                </div>

                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={uploading}
                />
            </div>

            {/* URL Input */}
            <div className="relative">
                <input
                    type="text"
                    value={value || ''}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full pl-3 pr-3 py-2 text-xs bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-400"
                    placeholder="https://..."
                />
            </div>
        </div>
    )
}

// ═══════════════════════════════════════════════════════════════
// 📋 MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════

export default function AboutManagement() {
    const { locale } = useApp()
    const { success, error: showError } = useToast()
    const isAr = locale === 'ar'

    // State
    const [activeTab, setActiveTab] = useState('sections')
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [modalMode, setModalMode] = useState('create')
    const [selectedItem, setSelectedItem] = useState(null)
    const [saving, setSaving] = useState(false)
    const [deleting, setDeleting] = useState(null)



    // Data States
    const [sections, setSections] = useState([])
    const [species, setSpecies] = useState([])
    const [cultural, setCultural] = useState([])
    const [settings, setSettings] = useState(null) // New settings state

    // Form Data - Dynamic based on active tab
    const [formData, setFormData] = useState({})

    // Constants
    const sectionTypes = [
        { value: 'GEOGRAPHY', label: { ar: 'جغرافيا', en: 'Geography' }, icon: '🌍', color: 'from-blue-500 to-cyan-600' },
        { value: 'NATURE', label: { ar: 'طبيعة', en: 'Nature' }, icon: '🌿', color: 'from-green-500 to-emerald-600' },
        { value: 'CULTURE', label: { ar: 'ثقافة', en: 'Culture' }, icon: '🎭', color: 'from-purple-500 to-pink-600' },
        { value: 'HISTORY', label: { ar: 'تاريخ', en: 'History' }, icon: '🏛️', color: 'from-amber-500 to-orange-600' }
    ]

    const speciesCategories = [
        { value: 'FLORA', label: { ar: 'نباتات', en: 'Flora' }, icon: '🌱' },
        { value: 'FAUNA', label: { ar: 'حيوانات', en: 'Fauna' }, icon: '🦎' },
        { value: 'BIRDS', label: { ar: 'طيور', en: 'Birds' }, icon: '🦅' },
        { value: 'MARINE', label: { ar: 'بحرية', en: 'Marine' }, icon: '🐠' }
    ]

    // Fetch Data
    const fetchData = useCallback(async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/admin/about')
            const result = await response.json()

            if (result.success) {
                setSections(result.data.sections || [])
                setSpecies(result.data.species || [])
                setCultural(result.data.cultural || [])
                setSettings(result.data.settings || {})
            }
        } catch (error) {
            console.error('Failed to fetch data:', error)
            showError(isAr ? 'فشل في جلب البيانات' : 'Failed to fetch data')
        } finally {
            setLoading(false)
        }
    }, [isAr, showError])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    // Get Empty Form Data based on tab
    const getEmptyFormData = (tab) => {
        switch (tab) {
            case 'sections':
                return {
                    type: 'GEOGRAPHY',
                    titleEn: '', titleAr: '',
                    contentEn: '', contentAr: '',
                    imageUrl: '',
                    order: 0, isActive: true
                }
            case 'species':
                return {
                    nameEn: '', nameAr: '',
                    scientificName: '',
                    descriptionEn: '', descriptionAr: '',
                    category: 'FLORA',
                    conservationStatus: '',
                    imageUrl: '',
                    facts: [],
                    order: 0, isActive: true
                }
            case 'cultural':
                return {
                    titleEn: '', titleAr: '',
                    descriptionEn: '', descriptionAr: '',
                    icon: '',
                    order: 0, isActive: true
                }
            case 'settings':
                return settings || {}
            default: return {}
        }
    }

    // Handlers
    const handleCreate = () => {
        setModalMode('create')
        setSelectedItem(null)
        setFormData(getEmptyFormData(activeTab))
        setShowModal(true)
    }

    const handleEdit = (item) => {
        setModalMode('edit')
        setSelectedItem(item)
        setFormData(item)
        setShowModal(true)
    }

    const handleSave = async (e) => {
        e.preventDefault()
        setSaving(true)

        try {
            const contentType = activeTab === 'sections' ? 'section' :
                activeTab === 'species' ? 'species' :
                    activeTab === 'cultural' ? 'cultural' : 'settings'

            // Settings always uses POST/PUT to the specific endpoint logic
            const method = modalMode === 'create' || contentType === 'settings' ? 'POST' : 'PUT'

            const body = (modalMode === 'create' || contentType === 'settings')
                ? { contentType, data: formData }
                : { contentType, id: selectedItem.id, data: formData }

            const response = await fetch('/api/admin/about', {
                method: 'POST', // Use POST for everything simplification if allowed, but stick to logic
                // Actually our API logic: POST handles creation and 'settings' update/create. PUT handles updates with ID.
                // For settings, we don't pass ID necessarily, so let's stick to POST for settings as per API.

                // Re-evaluating:
                // POST /api/admin/about with contentType='settings' will findFirst and update OR create.
                // So for settings, ALWAYS use POST.

                method: contentType === 'settings' ? 'POST' : method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })

            const result = await response.json()

            if (result.success) {
                setShowModal(false)
                fetchData()
                success(modalMode === 'create'
                    ? (isAr ? 'تم الإنشاء بنجاح! 🎉' : 'Created successfully! 🎉')
                    : (isAr ? 'تم التحديث بنجاح! ✨' : 'Updated successfully! ✨'))
            } else {
                showError(result.error || (isAr ? 'فشلت العملية' : 'Operation failed'))
            }
        } catch (error) {
            console.error('Failed to save:', error)
            showError(isAr ? 'فشل في حفظ البيانات' : 'Failed to save data')
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (item) => {
        if (!confirm(isAr ? 'هل أنت متأكد من الحذف؟' : 'Are you sure you want to delete?')) return

        const contentType = activeTab === 'sections' ? 'section' :
            activeTab === 'species' ? 'species' : 'cultural'

        setDeleting(item.id)
        try {
            const response = await fetch(`/api/admin/about?contentType=${contentType}&id=${item.id}`, {
                method: 'DELETE'
            })

            const result = await response.json()

            if (result.success) {
                fetchData()
                success(isAr ? 'تم الحذف بنجاح' : 'Deleted successfully')
            } else {
                showError(result.error || (isAr ? 'فشل في الحذف' : 'Failed to delete'))
            }
        } catch (error) {
            console.error('Failed to delete:', error)
            showError(isAr ? 'فشل في حذف البيانات' : 'Failed to delete data')
        } finally {
            setDeleting(null)
        }
    }

    const handleFormChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }))
    }

    // Helper to get color and data
    const getTabConfig = () => {
        switch (activeTab) {
            case 'sections': return { color: 'from-blue-600 to-cyan-600', icon: <FaGlobeAmericas />, data: sections }
            case 'species': return { color: 'from-green-600 to-emerald-600', icon: <FaLeaf />, data: species }
            case 'cultural': return { color: 'from-purple-600 to-pink-600', icon: <FaTheaterMasks />, data: cultural }
            default: return { color: 'from-gray-600 to-gray-700', icon: <FaGlobeAmericas />, data: [] }
        }
    }

    const tabConfig = getTabConfig()

    return (
        <AdminLayout>
            <div className="space-y-8">
                {/* Header & Stats */}
                <div className="space-y-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                            <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2 tracking-tight">
                                {isAr ? '📖 إدارة صفحة من نحن' : 'Management'}
                            </h1>
                            <p className="text-gray-500 dark:text-gray-400 text-lg">
                                {isAr ? 'التحكم الكامل في محتوى الصفحة، الأنواع المستوطنة، والثقافة' : 'Manage page content, endemic species, and cultural elements'}
                            </p>
                        </motion.div>

                        {/* Quick Stats Grid */}
                        <div className="flex gap-3">
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 min-w-[100px] text-center">
                                <span className="block text-2xl font-black text-blue-600 mb-1">{sections.length}</span>
                                <span className="text-xs font-bold text-gray-400 uppercase">{isAr ? 'أقسام' : 'Sections'}</span>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 min-w-[100px] text-center">
                                <span className="block text-2xl font-black text-green-600 mb-1">{species.length}</span>
                                <span className="text-xs font-bold text-gray-400 uppercase">{isAr ? 'أنواع' : 'Species'}</span>
                            </div>
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 min-w-[100px] text-center">
                                <span className="block text-2xl font-black text-purple-600 mb-1">{cultural.length}</span>
                                <span className="text-xs font-bold text-gray-400 uppercase">{isAr ? 'ثقافة' : 'Culture'}</span>
                            </div>
                        </div>
                    </div>

                    {/* Tabs & Controls */}
                    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-1.5 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex w-full md:w-auto overflow-x-auto pb-2 md:pb-0 gap-1.5 no-scrollbar">
                            {[
                                { id: 'sections', icon: FaGlobeAmericas, label: { ar: 'أقسام الصفحة', en: 'Sections' }, color: 'blue' },
                                { id: 'species', icon: FaLeaf, label: { ar: 'الأنواع المستوطنة', en: 'Species' }, color: 'green' },
                                { id: 'cultural', icon: FaTheaterMasks, label: { ar: 'العناصر الثقافية', en: 'Culture' }, color: 'purple' },
                                { id: 'settings', icon: FaCog, label: { ar: 'الإعدادات العامة', en: 'Gen. Settings' }, color: 'orange' }
                            ].map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`
                                        relative px-5 py-3 rounded-xl font-bold transition-all duration-300 flex items-center gap-2 whitespace-nowrap
                                        ${activeTab === tab.id
                                            ? `bg-${tab.color}-500 text-white shadow-lg shadow-${tab.color}-500/30 scale-100`
                                            : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 scale-95 hover:scale-100'
                                        }
                                    `}
                                >
                                    <tab.icon className={activeTab === tab.id ? 'animate-bounce-subtle' : ''} />
                                    <span>{isAr ? tab.label.ar : tab.label.en}</span>
                                </button>
                            ))}
                        </div>

                        {/* Action Buttons */}
                        {activeTab !== 'settings' && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleCreate}
                                className={`
                                    w-full md:w-auto px-6 py-3 rounded-xl font-bold text-white shadow-lg 
                                    bg-gradient-to-r ${tabConfig.color} flex items-center justify-center gap-2
                                `}
                            >
                                <FaPlus />
                                <span>{isAr ? 'إضافة عنصر جديد' : 'Add New Item'}</span>
                            </motion.button>
                        )}
                        {activeTab === 'settings' && (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={async (e) => {
                                    setModalMode('create')
                                    setFormData(settings || {})
                                    handleSave(e)
                                }}
                                disabled={saving}
                                className="w-full md:w-auto px-8 py-3 bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white rounded-xl font-bold shadow-lg flex items-center justify-center gap-2"
                            >
                                {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
                                {saving ? (isAr ? 'جاري الحفظ...' : 'Saving...') : (isAr ? 'حفظ التغييرات' : 'Save Changes')}
                            </motion.button>
                        )}
                    </div>
                </div>

                {/* Settings View (Direct Form) */}
                {activeTab === 'settings' && !loading && (
                    <div className="bg-transparent"> {/* Removed container style to let cards breathe */}
                        {/* Header Removed as it's redundant with new layout */}

                        <form id="settingsForm" onSubmit={(e) => {
                            setModalMode('create')
                            handleSave(e)
                        }}>
                            <SettingsForm
                                formData={activeTab === 'settings' ? (formData.contentType ? formData : (settings || {})) : formData}
                                onChange={(field, value) => {
                                    const newSettings = { ...settings, [field]: value }
                                    setSettings(newSettings)
                                    setFormData(newSettings)
                                }}
                                isAr={isAr}
                            />
                        </form>
                    </div>
                )}

                {/* Content Grid (Hidden for Settings) */}
                {!loading && activeTab !== 'settings' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence mode='popLayout'>
                            {tabConfig.data.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.9 }}
                                    transition={{ duration: 0.2, delay: index * 0.05 }}
                                    className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl border border-gray-100 dark:border-gray-700 transition-all"
                                >
                                    {/* Card Header (Image or Icon) */}
                                    <div className={`relative h-48 overflow-hidden bg-gray-100 dark:bg-gray-900`}>
                                        {item.imageUrl ? (
                                            <Image
                                                src={item.imageUrl}
                                                alt={item.titleEn || item.nameEn}
                                                fill
                                                className="object-cover transition-transform duration-500 group-hover:scale-110"
                                                sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                                                unoptimized
                                            />
                                        ) : (
                                            <div className={`w-full h-full flex items-center justify-center bg-gradient-to-br ${tabConfig.color} opacity-10 group-hover:opacity-20 transition-opacity`}>
                                                <FaImage className="w-12 h-12 text-gray-500" />
                                            </div>
                                        )}

                                        {/* Overlay Actions */}
                                        <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-sm">
                                            <button onClick={() => handleEdit(item)} className="p-3 bg-white text-blue-600 rounded-full hover:scale-110 transition-transform shadow-lg">
                                                <FaEdit />
                                            </button>
                                            <button onClick={() => handleDelete(item)} className="p-3 bg-white text-red-600 rounded-full hover:scale-110 transition-transform shadow-lg">
                                                {deleting === item.id ? <FaSpinner className="animate-spin" /> : <FaTrash />}
                                            </button>
                                        </div>

                                        {/* Status Badge */}
                                        <div className="absolute top-3 right-3">
                                            <span className={`px-2 py-1 rounded-lg text-xs font-bold ${item.isActive ? 'bg-green-500/90 text-white' : 'bg-red-500/90 text-white'}`}>
                                                {item.isActive ? (isAr ? 'نشط' : 'Active') : (isAr ? 'غير نشط' : 'Inactive')}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Card Content */}
                                    <div className="p-6">
                                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1 line-clamp-1">
                                            {isAr ? (item.titleAr || item.nameAr) : (item.titleEn || item.nameEn)}
                                        </h3>

                                        {item.scientificName && (
                                            <p className="text-sm text-green-600 dark:text-green-400 italic mb-2">{item.scientificName}</p>
                                        )}

                                        <div className="h-16 mb-4">
                                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-3">
                                                {isAr ? (item.contentAr || item.descriptionAr) : (item.contentEn || item.descriptionEn)}
                                            </p>
                                        </div>

                                        <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
                                            <div className="flex items-center gap-2">
                                                <span className={`w-2 h-2 rounded-full bg-gradient-to-r ${tabConfig.color}`}></span>
                                                <span className="text-xs font-medium text-gray-400">
                                                    {activeTab === 'sections' ? item.type : activeTab === 'species' ? item.category : 'Cultural'}
                                                </span>
                                            </div>
                                            <span className="text-xs font-mono text-gray-300">#{item.order}</span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}

                {/* Empty State */}
                {!loading && tabConfig.data.length === 0 && (
                    <div className="text-center py-20 bg-gray-50 dark:bg-gray-800/50 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700">
                        <div className={`w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br ${tabConfig.color} flex items-center justify-center opacity-20`}>
                            {tabConfig.icon}
                        </div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                            {isAr ? 'لا توجد بيانات' : 'No Data Found'}
                        </h3>
                        <p className="text-gray-500 mb-6">
                            {isAr ? 'ابدأ بإضافة أول عنصر في هذا القسم' : 'Start by adding the first item in this section'}
                        </p>
                        <button onClick={handleCreate} className="text-blue-600 font-bold hover:underline">
                            {isAr ? 'إضافة الآن' : 'Add Now'}
                        </button>
                    </div>
                )}

                {/* Forms Modal */}
                <AnimatePresence>
                    {showModal && (
                        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                                className="bg-white dark:bg-gray-800 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
                            >
                                {/* Header */}
                                <div className={`p-6 bg-gradient-to-r ${tabConfig.color} flex justify-between items-center shrink-0`}>
                                    <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                        {modalMode === 'create' ? <FaPlus /> : <FaEdit />}
                                        {modalMode === 'create'
                                            ? (isAr ? 'إضافة عنصر جديد' : 'Add New Item')
                                            : (isAr ? 'تعديل العنصر' : 'Edit Item')
                                        }
                                    </h2>
                                    <button onClick={() => setShowModal(false)} className="text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors">
                                        <FaTimes size={24} />
                                    </button>
                                </div>

                                {/* Scrollable Content */}
                                <div className="p-8 overflow-y-auto custom-scrollbar">
                                    <form id="aboutForm" onSubmit={handleSave} className="space-y-6">
                                        {activeTab === 'sections' && (
                                            <SectionForm formData={formData} onChange={handleFormChange} sectionTypes={sectionTypes} isAr={isAr} locale={locale} />
                                        )}
                                        {activeTab === 'species' && (
                                            <SpeciesForm formData={formData} onChange={handleFormChange} speciesCategories={speciesCategories} isAr={isAr} locale={locale} />
                                        )}
                                        {activeTab === 'cultural' && (
                                            <CulturalForm formData={formData} onChange={handleFormChange} isAr={isAr} />
                                        )}
                                    </form>
                                </div>

                                {/* Footer Actions */}
                                <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50 flex justify-end gap-3 shrink-0">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-6 py-3 rounded-xl font-bold text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        {isAr ? 'إلغاء' : 'Cancel'}
                                    </button>
                                    <button
                                        type="submit"
                                        form="aboutForm"
                                        disabled={saving}
                                        className={`
                                            px-8 py-3 rounded-xl font-bold text-white shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center gap-2
                                            bg-gradient-to-r ${tabConfig.color} disabled:opacity-70 disabled:cursor-not-allowed
                                        `}
                                    >
                                        {saving ? <FaSpinner className="animate-spin" /> : <FaSave />}
                                        {saving ? (isAr ? 'جاري الحفظ...' : 'Saving...') : (isAr ? 'حفظ التغييرات' : 'Save Changes')}
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    )}
                </AnimatePresence>
            </div>
        </AdminLayout>
    )
}

// ═══════════════════════════════════════════════════════════════
// 📝 SUB-FORMS
// ═══════════════════════════════════════════════════════════════

const SectionForm = ({ formData, onChange, sectionTypes, isAr, locale }) => (
    <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 ml-1">{isAr ? 'النوع' : 'Type'}</label>
                <div className="relative">
                    <select
                        value={formData.type}
                        onChange={(e) => onChange('type', e.target.value)}
                        className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-gray-800 text-gray-900 dark:text-white outline-none appearance-none"
                    >
                        {sectionTypes.map(t => (
                            <option key={t.value} value={t.value}>{t.label[locale]}</option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                    </div>
                </div>
            </div>
            <InputGroup
                label={isAr ? 'الترتيب' : 'Order'}
                value={formData.order}
                onChange={(v) => onChange('order', +v)}
                type="number"
            />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
            <InputGroup
                label={isAr ? 'العنوان (EN)' : 'Title (EN)'}
                value={formData.titleEn}
                onChange={(v) => onChange('titleEn', v)}
                required
            />
            <InputGroup
                label={isAr ? 'العنوان (AR)' : 'Title (AR)'}
                value={formData.titleAr}
                onChange={(v) => onChange('titleAr', v)}
                dir="rtl"
                required
            />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
            <InputGroup
                label={isAr ? 'المحتوى (EN)' : 'Content (EN)'}
                value={formData.contentEn}
                onChange={(v) => onChange('contentEn', v)}
                type="textarea"
                rows={6}
                required
            />
            <InputGroup
                label={isAr ? 'المحتوى (AR)' : 'Content (AR)'}
                value={formData.contentAr}
                onChange={(v) => onChange('contentAr', v)}
                type="textarea"
                rows={6}
                dir="rtl"
                required
            />
        </div>

        <ImageUpload
            label={isAr ? 'صورة القسم' : 'Section Image'}
            value={formData.imageUrl}
            onChange={(url) => onChange('imageUrl', url)}
            isAr={isAr}
        />

        <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <input
                type="checkbox"
                checked={formData.isActive}
                onChange={(e) => onChange('isActive', e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <span className="font-bold text-gray-700 dark:text-gray-300">{isAr ? 'نشط (ظاهر في الموقع)' : 'Active (Visible on site)'}</span>
        </div>
    </div>
)

// ═══════════════════════════════════════════════════════════════
// 🛠️ SHARED UI COMPONENTS
// ═══════════════════════════════════════════════════════════════

const SectionCard = ({ title, icon, children, color = "blue" }) => (
    <div className={`
        group bg-white dark:bg-gray-800 rounded-3xl p-8 
        border border-gray-100 dark:border-gray-700 
        shadow-sm hover:shadow-xl transition-all duration-300
        relative overflow-hidden
    `}>
        {/* Ambient Background Glow */}
        <div className={`absolute top-0 right-0 w-32 h-32 bg-${color}-500/5 rounded-full blur-3xl -z-10 group-hover:bg-${color}-500/10 transition-all`} />

        <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100 dark:border-gray-700">
            <div className={`w-10 h-10 rounded-xl bg-${color}-50 dark:bg-${color}-900/20 flex items-center justify-center text-${color}-600 dark:text-${color}-400`}>
                {icon}
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {title}
            </h3>
        </div>
        <div className="space-y-6">
            {children}
        </div>
    </div>
)

const InputGroup = ({ label, value, onChange, type = "text", dir = "ltr", rows, placeholder, required = false, className = "" }) => (
    <div className={`space-y-1.5 ${className}`}>
        <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 ml-1 flex items-center gap-1">
            {label}
            {required && <span className="text-red-500">*</span>}
        </label>
        {type === 'textarea' ? (
            <textarea
                rows={rows || 3}
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                dir={dir}
                className={`
                    w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 
                    border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-gray-800
                    text-gray-900 dark:text-white placeholder-gray-400
                    transition-all duration-200 outline-none resize-y
                    ${dir === 'rtl' ? 'text-right' : 'text-left'}
                    ${className || ''}
                `}
                placeholder={placeholder}
            />
        ) : type === 'select' ? (
            null
        ) : (
            <input
                type="text"
                value={value || ''}
                onChange={(e) => onChange(e.target.value)}
                dir={dir}
                className={`
                    w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 
                    border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-gray-800
                    text-gray-900 dark:text-white placeholder-gray-400
                    transition-all duration-200 outline-none
                    ${dir === 'rtl' ? 'text-right' : 'text-left'}
                    ${className || ''}
                `}
                placeholder={placeholder}
            />
        )}
    </div>
)

const SpeciesForm = ({ formData, onChange, speciesCategories, isAr, locale }) => (
    <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 ml-1">{isAr ? 'الفئة' : 'Category'}</label>
                <div className="relative">
                    <select value={formData.category} onChange={(e) => onChange('category', e.target.value)} className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border-2 border-transparent focus:border-blue-500 focus:bg-white dark:focus:bg-gray-800 text-gray-900 dark:text-white outline-none appearance-none">
                        {speciesCategories.map(c => (
                            <option key={c.value} value={c.value}>{c.label[locale]}</option>
                        ))}
                    </select>
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none text-gray-500">
                        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" /></svg>
                    </div>
                </div>
            </div>
            <InputGroup
                label={isAr ? 'حالة الحفظ' : 'Conservation Status'}
                value={formData.conservationStatus}
                onChange={(v) => onChange('conservationStatus', v)}
                placeholder="e.g. Endangered"
            />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
            <InputGroup
                label={isAr ? 'الاسم (EN)' : 'Name (EN)'}
                value={formData.nameEn}
                onChange={(v) => onChange('nameEn', v)}
                required
            />
            <InputGroup
                label={isAr ? 'الاسم (AR)' : 'Name (AR)'}
                value={formData.nameAr}
                onChange={(v) => onChange('nameAr', v)}
                dir="rtl"
                required
            />
        </div>

        <InputGroup
            label={isAr ? 'الاسم العلمي' : 'Scientific Name'}
            value={formData.scientificName}
            onChange={(v) => onChange('scientificName', v)}
            className="italic"
        />

        <div className="grid md:grid-cols-2 gap-6">
            <InputGroup
                label={isAr ? 'الوصف (EN)' : 'Description (EN)'}
                value={formData.descriptionEn}
                onChange={(v) => onChange('descriptionEn', v)}
                type="textarea"
                rows={4}
                required
            />
            <InputGroup
                label={isAr ? 'الوصف (AR)' : 'Description (AR)'}
                value={formData.descriptionAr}
                onChange={(v) => onChange('descriptionAr', v)}
                type="textarea"
                rows={4}
                dir="rtl"
                required
            />
        </div>

        <ImageUpload
            label={isAr ? 'صورة الكائن' : 'Species Image'}
            value={formData.imageUrl}
            onChange={(url) => onChange('imageUrl', url)}
            isAr={isAr}
        />

        <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <input type="checkbox" checked={formData.isActive} onChange={(e) => onChange('isActive', e.target.checked)} className="w-5 h-5 text-green-600 rounded focus:ring-green-500" />
            <span className="font-bold text-gray-700 dark:text-gray-300">{isAr ? 'نشط' : 'Active'}</span>
        </div>
    </div>
)

const CulturalForm = ({ formData, onChange, isAr }) => (
    <div className="space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
            <InputGroup
                label={isAr ? 'العنوان (EN)' : 'Title (EN)'}
                value={formData.titleEn}
                onChange={(v) => onChange('titleEn', v)}
                required
            />
            <InputGroup
                label={isAr ? 'العنوان (AR)' : 'Title (AR)'}
                value={formData.titleAr}
                onChange={(v) => onChange('titleAr', v)}
                dir="rtl"
                required
            />
        </div>

        <div className="grid md:grid-cols-2 gap-6">
            <InputGroup
                label={isAr ? 'الوصف (EN)' : 'Description (EN)'}
                value={formData.descriptionEn}
                onChange={(v) => onChange('descriptionEn', v)}
                type="textarea"
                rows={4}
                required
            />
            <InputGroup
                label={isAr ? 'الوصف (AR)' : 'Description (AR)'}
                value={formData.descriptionAr}
                onChange={(v) => onChange('descriptionAr', v)}
                type="textarea"
                rows={4}
                dir="rtl"
                required
            />
        </div>

        {/* Emoji Icon Input */}
        <div className="space-y-1.5">
            <label className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 ml-1">{isAr ? 'أيقونة (إيموجي)' : 'Icon (Emoji)'}</label>
            <div className="flex gap-4 items-center">
                <input
                    type="text"
                    value={formData.icon || ''}
                    onChange={(e) => onChange('icon', e.target.value)}
                    className="w-24 h-16 text-4xl text-center rounded-2xl bg-gray-50 dark:bg-gray-700/50 border-2 border-transparent focus:border-blue-500 focus:outline-none transition-all"
                    placeholder="🎭"
                    maxLength={5}
                />
                <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center bg-blue-50 dark:bg-blue-900/20 px-4 py-2 rounded-xl">
                    <span className="mr-2">💡</span>
                    {isAr ? 'استخدم إيموجي لتمثيل هذا العنصر الثقافي' : 'Use an emoji to represent this cultural element'}
                </div>
            </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
            <input type="checkbox" checked={formData.isActive} onChange={(e) => onChange('isActive', e.target.checked)} className="w-5 h-5 text-purple-600 rounded focus:ring-purple-500" />
            <span className="font-bold text-gray-700 dark:text-gray-300">{isAr ? 'نشط' : 'Active'}</span>
        </div>
    </div>
)

const SettingsForm = ({ formData, onChange, isAr }) => {
    // Helper for nested stats change
    const onStatChange = (index, field, value) => {
        const newStats = [...(formData.stats || [])];
        if (!newStats[index]) newStats[index] = {};
        newStats[index][field] = value;
        onChange('stats', newStats);
    }

    const addStat = () => {
        onChange('stats', [...(formData.stats || []), { labelEn: '', labelAr: '', value: '' }]);
    }

    const removeStat = (index) => {
        const newStats = [...(formData.stats || [])];
        newStats.splice(index, 1);
        onChange('stats', newStats);
    }

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Hero Section */}
            <SectionCard
                title={isAr ? 'القسم الرئيسي (Hero)' : 'Hero Section'}
                icon={<span className="text-xl">🖼️</span>}
                color="blue"
            >
                <div className="grid md:grid-cols-2 gap-6">
                    <InputGroup
                        label={isAr ? 'العنوان (EN)' : 'Title (EN)'}
                        value={formData.heroTitle}
                        onChange={(v) => onChange('heroTitle', v)}
                    />
                    <InputGroup
                        label={isAr ? 'العنوان (AR)' : 'Title (AR)'}
                        value={formData.heroTitleAr}
                        onChange={(v) => onChange('heroTitleAr', v)}
                        dir="rtl"
                    />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    <InputGroup
                        label={isAr ? 'العنوان الفرعي (EN)' : 'Subtitle (EN)'}
                        value={formData.heroSubtitle}
                        onChange={(v) => onChange('heroSubtitle', v)}
                        type="textarea"
                        rows={2}
                    />
                    <InputGroup
                        label={isAr ? 'العنوان الفرعي (AR)' : 'Subtitle (AR)'}
                        value={formData.heroSubtitleAr}
                        onChange={(v) => onChange('heroSubtitleAr', v)}
                        type="textarea"
                        rows={2}
                        dir="rtl"
                    />
                </div>
                <div className="pt-2">
                    <ImageUpload
                        label={isAr ? 'صورة الخلفية' : 'Background Image'}
                        value={formData.heroImage}
                        onChange={(url) => onChange('heroImage', url)}
                        isAr={isAr}
                    />
                </div>
            </SectionCard>

            {/* Introduction Section */}
            <SectionCard
                title={isAr ? 'مقدمة عن سقطرى' : 'Introduction Section'}
                icon={<span className="text-xl">📝</span>}
                color="green"
            >
                <div className="grid md:grid-cols-2 gap-6">
                    <InputGroup
                        label={isAr ? 'عنوان المقدمة (EN)' : 'Intro Title (EN)'}
                        value={formData.introTitle}
                        onChange={(v) => onChange('introTitle', v)}
                    />
                    <InputGroup
                        label={isAr ? 'عنوان المقدمة (AR)' : 'Intro Title (AR)'}
                        value={formData.introTitleAr}
                        onChange={(v) => onChange('introTitleAr', v)}
                        dir="rtl"
                    />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    <InputGroup
                        label={isAr ? 'نص المقدمة (EN)' : 'Intro Content (EN)'}
                        value={formData.introContent}
                        onChange={(v) => onChange('introContent', v)}
                        type="textarea"
                        rows={5}
                    />
                    <InputGroup
                        label={isAr ? 'نص المقدمة (AR)' : 'Intro Content (AR)'}
                        value={formData.introContentAr}
                        onChange={(v) => onChange('introContentAr', v)}
                        type="textarea"
                        rows={5}
                        dir="rtl"
                    />
                </div>
                <div className="pt-2">
                    <ImageUpload
                        label={isAr ? 'صورة المقدمة' : 'Intro Image'}
                        value={formData.introImage}
                        onChange={(url) => onChange('introImage', url)}
                        isAr={isAr}
                    />
                </div>
            </SectionCard>

            {/* Statistics Section */}
            <SectionCard
                title={isAr ? 'الإحصائيات' : 'Statistics'}
                icon={<span className="text-xl">📊</span>}
                color="purple"
            >
                <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4">
                        {(formData.stats || []).map((stat, idx) => (
                            <div key={idx} className="flex flex-col md:flex-row gap-4 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-700 relative group">
                                <div className="flex-1">
                                    <InputGroup
                                        label={isAr ? 'الرقم/القيمة' : 'Value'}
                                        value={stat.value}
                                        onChange={(v) => onStatChange(idx, 'value', v)}
                                        placeholder="700+"
                                    />
                                </div>
                                <div className="flex-[1.5]">
                                    <InputGroup
                                        label={isAr ? 'الوصف (EN)' : 'Label (EN)'}
                                        value={stat.labelEn}
                                        onChange={(v) => onStatChange(idx, 'labelEn', v)}
                                    />
                                </div>
                                <div className="flex-[1.5]">
                                    <InputGroup
                                        label={isAr ? 'الوصف (AR)' : 'Label (AR)'}
                                        value={stat.labelAr}
                                        onChange={(v) => onStatChange(idx, 'labelAr', v)}
                                        dir="rtl"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeStat(idx)}
                                    className="absolute -top-2 -right-2 md:static md:self-end p-3 bg-white dark:bg-gray-700 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl shadow-sm border border-gray-100 dark:border-gray-600 transition-all opacity-0 group-hover:opacity-100"
                                >
                                    <FaTrash />
                                </button>
                            </div>
                        ))}
                    </div>

                    <button
                        type="button"
                        onClick={addStat}
                        className="w-full py-4 border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-2xl text-gray-400 hover:border-purple-500 hover:text-purple-500 hover:bg-purple-50 dark:hover:bg-purple-900/10 font-bold transition-all flex items-center justify-center gap-2"
                    >
                        <FaPlus /> {isAr ? 'إضافة إحصائية جديدة' : 'Add New Statistic'}
                    </button>
                </div>
            </SectionCard>

            {/* SEO Section */}
            <SectionCard
                title="SEO Configuration"
                icon={<span className="text-xl">🔍</span>}
                color="orange"
            >
                <div className="grid md:grid-cols-2 gap-6">
                    <InputGroup
                        label={isAr ? 'عنوان الصفحة (Meta Title)' : 'Meta Title'}
                        value={formData.metaTitle}
                        onChange={(v) => onChange('metaTitle', v)}
                        placeholder="Page Title | Brand Name"
                    />
                    <InputGroup
                        label={isAr ? 'عنوان الصفحة (AR)' : 'Meta Title (AR)'}
                        value={formData.metaTitleAr}
                        onChange={(v) => onChange('metaTitleAr', v)}
                        dir="rtl"
                        placeholder="عنوان الصفحة | اسم الهوية"
                    />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    <InputGroup
                        label={isAr ? 'وصف الصفحة (Meta Desc)' : 'Meta Description'}
                        value={formData.metaDescription}
                        onChange={(v) => onChange('metaDescription', v)}
                        type="textarea"
                        rows={3}
                        placeholder="Brief description for search engines..."
                    />
                    <InputGroup
                        label={isAr ? 'وصف الصفحة (AR)' : 'Meta Description (AR)'}
                        value={formData.metaDescriptionAr}
                        onChange={(v) => onChange('metaDescriptionAr', v)}
                        type="textarea"
                        rows={3}
                        dir="rtl"
                        placeholder="وصف مختصر لمحركات البحث..."
                    />
                </div>
            </SectionCard>
        </div>
    )
}
