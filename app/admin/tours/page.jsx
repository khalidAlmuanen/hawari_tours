'use client'

// ═══════════════════════════════════════════════════════════════
// ✈️ TOURS MANAGEMENT - Ultra Professional & Modern
// إدارة الجولات - تصميم احترافي وعصري جداً
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useApp } from '@/contexts/AppContext'
import AdminLayout from '@/components/admin/AdminLayout'
import { useToast } from '@/components/admin/Toast'
import ImageUploader from '@/components/admin/ImageUploader' // ✅ Integrated ImageUploader
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { useDebounce, exportData, EXPORT_FORMATS } from '@/components/admin'

export default function ToursManagement() {
  const { locale } = useApp()
  const { success, error: showError, info } = useToast()
  const isAr = locale === 'ar'

  // State
  const [tours, setTours] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState('create')
  const [selectedTour, setSelectedTour] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(null)

  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState(null)
  const [showExportMenu, setShowExportMenu] = useState(false)
  const debouncedSearch = useDebounce(searchTerm, 400)

  // Temporary input states for arrays
  const [newInclude, setNewInclude] = useState('')
  const [newExclude, setNewExclude] = useState('')
  const [newFeature, setNewFeature] = useState('')
  const [newFeatureAr, setNewFeatureAr] = useState('')

  // Itinerary State
  const [newDay, setNewDay] = useState({
    day: 1,
    title: '',
    titleAr: '',
    description: '',
    descriptionAr: ''
  })

  // Form Data
  const [formData, setFormData] = useState({
    title: '',
    titleAr: '',
    description: '',
    descriptionAr: '',
    price: '',
    discount: '0',
    duration: '',
    maxPeople: '',
    difficulty: 'MODERATE',
    category: 'ADVENTURE',
    location: '',
    locationAr: '',
    latitude: '',
    longitude: '',
    coverImage: '',
    cardImage: '',
    images: [],
    videoUrl: '',
    includes: [],
    excludes: [],
    features: [],
    featuresAr: [],
    featured: false,
    isActive: true,
    metaTitle: '',
    metaDescription: '',
    keywords: []
  })

  const categories = useMemo(() => ([
    { value: 'ADVENTURE', label: { ar: 'مغامرة', en: 'Adventure' }, color: 'blue' },
    { value: 'CULTURAL', label: { ar: 'ثقافي', en: 'Cultural' }, color: 'purple' },
    { value: 'NATURE', label: { ar: 'طبيعة', en: 'Nature' }, color: 'green' },
    { value: 'BEACH', label: { ar: 'شاطئ', en: 'Beach' }, color: 'cyan' },
    { value: 'WILDLIFE', label: { ar: 'حياة برية', en: 'Wildlife' }, color: 'orange' },
    { value: 'HERITAGE', label: { ar: 'تراث', en: 'Heritage' }, color: 'amber' }
  ]), [])

  const difficulties = useMemo(() => ([
    { value: 'EASY', label: { ar: 'سهل', en: 'Easy' }, icon: '😊' },
    { value: 'MODERATE', label: { ar: 'متوسط', en: 'Moderate' }, icon: '🙂' },
    { value: 'CHALLENGING', label: { ar: 'صعب', en: 'Challenging' }, icon: '😅' },
    { value: 'DIFFICULT', label: { ar: 'صعب جداً', en: 'Difficult' }, icon: '💪' }
  ]), [])

  // Fetch Tours
  const fetchTours = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...(debouncedSearch && { search: debouncedSearch }),
        ...(categoryFilter !== 'all' && { category: categoryFilter })
      })

      const response = await fetch(`/api/admin/tours?${params}`)
      const result = await response.json()

      if (result.success) {
        setTours(result.data.tours)
        setPagination(result.data.pagination)
      }
    } catch (error) {
      console.error('Failed to fetch tours:', error)
      showError(isAr ? 'فشل في جلب البيانات' : 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }, [categoryFilter, currentPage, debouncedSearch, isAr, showError])

  useEffect(() => {
    fetchTours()
  }, [fetchTours])

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, categoryFilter])

  // Reset Form
  const resetForm = () => {
    setFormData({
      title: '',
      titleAr: '',
      description: '',
      descriptionAr: '',
      price: '',
      discount: '0',
      duration: '',
      maxPeople: '',
      difficulty: 'MODERATE',
      category: 'ADVENTURE',
      location: '',
      locationAr: '',
      latitude: '',
      longitude: '',
      coverImage: '',
      cardImage: '',
      images: [],
      videoUrl: '',
      includes: [],
      excludes: [],
      features: [],
      featuresAr: [],
      featured: false,
      isActive: true,
      metaTitle: '',
      metaDescription: '',
      keywords: [],
      itinerary: []
    })
    setNewInclude('')
    setNewExclude('')
    setNewFeature('')
    setNewFeatureAr('')
    setNewDay({ day: 1, title: '', titleAr: '', description: '', descriptionAr: '' })
  }

  // Handle Create
  const handleCreate = () => {
    setModalMode('create')
    setSelectedTour(null)
    resetForm()
    setShowModal(true)
  }

  // Handle Edit
  const handleEdit = (tour) => {
    setModalMode('edit')
    setSelectedTour(tour)
    setFormData({
      title: tour.title,
      titleAr: tour.titleAr,
      description: tour.description,
      descriptionAr: tour.descriptionAr,
      price: tour.price.toString(),
      discount: tour.discount?.toString() || '0',
      duration: tour.duration.toString(),
      maxPeople: tour.maxPeople.toString(),
      difficulty: tour.difficulty,
      category: tour.category,
      location: tour.location || '',
      locationAr: tour.locationAr || '',
      latitude: tour.latitude?.toString() || '',
      longitude: tour.longitude?.toString() || '',
      coverImage: tour.coverImage,
      cardImage: tour.cardImage || '',
      images: tour.images || [],
      videoUrl: tour.videoUrl || '',
      includes: tour.includes || [],
      excludes: tour.excludes || [],
      features: tour.features || [],
      featuresAr: tour.featuresAr || [],
      featured: tour.featured,
      isActive: tour.isActive,
      metaTitle: tour.metaTitle || '',
      metaDescription: tour.metaDescription || '',
      keywords: tour.keywords || [],
      itinerary: Array.isArray(tour.itinerary) ? tour.itinerary : []
    })
    setNewDay({
      day: (Array.isArray(tour.itinerary) ? tour.itinerary.length : 0) + 1,
      title: '',
      titleAr: '',
      description: '',
      descriptionAr: ''
    })
    setShowModal(true)
  }

  // Handle Save
  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const url = '/api/admin/tours'
      const method = modalMode === 'create' ? 'POST' : 'PUT'
      const body = {
        ...formData,
        ...(modalMode === 'edit' && { id: selectedTour.id }),
        price: parseFloat(formData.price),
        discount: parseFloat(formData.discount),
        duration: parseInt(formData.duration),
        maxPeople: parseInt(formData.maxPeople),
        latitude: formData.latitude ? parseFloat(formData.latitude) : null,
        longitude: formData.longitude ? parseFloat(formData.longitude) : null
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const result = await response.json()

      if (result.success) {
        setShowModal(false)
        fetchTours()
        resetForm()
        success(
          modalMode === 'create'
            ? (isAr ? 'تم إنشاء الجولة بنجاح! 🎉' : 'Tour created successfully! 🎉')
            : (isAr ? 'تم تحديث الجولة بنجاح! ✨' : 'Tour updated successfully! ✨')
        )
      } else {
        showError(result.error || (isAr ? 'فشلت العملية' : 'Operation failed'))
      }
    } catch (error) {
      console.error('Failed to save tour:', error)
      showError(isAr ? 'فشل في حفظ البيانات' : 'Failed to save data')
    } finally {
      setSaving(false)
    }
  }

  // Handle Delete
  const handleDelete = async (tourId) => {
    if (!confirm(isAr ? 'هل أنت متأكد من حذف الجولة؟' : 'Are you sure you want to delete this tour?')) return
    setDeleting(tourId)
    try {
      const response = await fetch(`/api/admin/tours?id=${tourId}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (result.success) {
        fetchTours()
        success(isAr ? 'تم حذف الجولة بنجاح' : 'Tour deleted successfully')
      } else {
        showError(result.error || (isAr ? 'فشل في الحذف' : 'Failed to delete'))
      }
    } catch (error) {
      console.error('Failed to delete tour:', error)
      showError(isAr ? 'فشل في حذف البيانات' : 'Failed to delete data')
    } finally {
      setDeleting(null)
    }
  }

  // Handle Form Change
  const handleFormChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleResetFilters = () => {
    setSearchTerm('')
    setCategoryFilter('all')
    setCurrentPage(1)
  }

  const exportRows = useMemo(() => {
    return tours.map((tour) => ({
      [isAr ? 'المعرف' : 'ID']: tour.id,
      [isAr ? 'العنوان' : 'Title']: isAr ? (tour.titleAr || tour.title) : (tour.title || tour.titleAr),
      [isAr ? 'الفئة' : 'Category']: categories.find(c => c.value === tour.category)?.label[locale],
      [isAr ? 'السعر' : 'Price']: tour.price,
      [isAr ? 'الخصم' : 'Discount']: tour.discount || 0,
      [isAr ? 'المدة' : 'Duration']: tour.duration,
      [isAr ? 'الحد الأقصى للأشخاص' : 'Max People']: tour.maxPeople,
      [isAr ? 'الحالة' : 'Status']: tour.isActive ? (isAr ? 'نشط' : 'Active') : (isAr ? 'غير نشط' : 'Inactive'),
      [isAr ? 'مميز' : 'Featured']: tour.featured ? (isAr ? 'نعم' : 'Yes') : (isAr ? 'لا' : 'No'),
      [isAr ? 'الحجوزات' : 'Bookings']: tour.bookingsCount || 0,
      [isAr ? 'التقييم' : 'Rating']: tour.rating || 0
    }))
  }, [tours, isAr, categories, locale])

  const handleExport = (format) => {
    exportData(exportRows, format, `tours_export_${new Date().toISOString().slice(0, 10)}`)
    success(isAr ? 'تم تصدير البيانات بنجاح' : 'Data exported successfully')
  }

  // ✅ New Image Handlers
  const handleCoverUpload = (url) => {
    setFormData(prev => ({ ...prev, coverImage: url }))
  }

  const handleCardImageUpload = (url) => {
    setFormData(prev => ({ ...prev, cardImage: url }))
  }

  const handleGalleryUpload = (urls) => {
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, ...urls]
    }))
  }

  const handleRemoveGalleryImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  // Handle Array Fields
  const handleAddInclude = () => {
    if (!newInclude.trim()) return
    setFormData(prev => ({
      ...prev,
      includes: [...prev.includes, newInclude.trim()]
    }))
    setNewInclude('')
  }

  const handleRemoveInclude = (index) => {
    setFormData(prev => ({
      ...prev,
      includes: prev.includes.filter((_, i) => i !== index)
    }))
  }

  const handleAddExclude = () => {
    if (!newExclude.trim()) return
    setFormData(prev => ({
      ...prev,
      excludes: [...prev.excludes, newExclude.trim()]
    }))
    setNewExclude('')
  }

  const handleRemoveExclude = (index) => {
    setFormData(prev => ({
      ...prev,
      excludes: prev.excludes.filter((_, i) => i !== index)
    }))
  }

  const handleAddFeature = () => {
    if (!newFeature.trim()) return
    setFormData(prev => ({
      ...prev,
      features: [...prev.features, newFeature.trim()]
    }))
    setNewFeature('')
  }

  const handleRemoveFeature = (index) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.filter((_, i) => i !== index)
    }))
  }

  const handleAddFeatureAr = () => {
    if (!newFeatureAr.trim()) return
    setFormData(prev => ({
      ...prev,
      featuresAr: [...prev.featuresAr, newFeatureAr.trim()]
    }))
    setNewFeatureAr('')
  }

  const handleRemoveFeatureAr = (index) => {
    setFormData(prev => ({
      ...prev,
      featuresAr: prev.featuresAr.filter((_, i) => i !== index)
    }))
  }

  const getCategoryColor = (category) => {
    const cat = categories.find(c => c.value === category)
    const colors = {
      blue: 'from-blue-500 to-blue-600',
      purple: 'from-purple-500 to-purple-600',
      green: 'from-green-500 to-green-600',
      cyan: 'from-cyan-500 to-cyan-600',
      orange: 'from-orange-500 to-orange-600',
      amber: 'from-amber-500 to-amber-600'
    }
    return colors[cat?.color] || 'from-gray-500 to-gray-600'
  }

  // Handle Itinerary
  const handleAddDay = () => {
    if (!newDay.title || !newDay.description) return

    setFormData(prev => ({
      ...prev,
      itinerary: [...(prev.itinerary || []), { ...newDay, day: (prev.itinerary?.length || 0) + 1 }]
    }))

    setNewDay({
      day: (formData.itinerary?.length || 0) + 2,
      title: '',
      titleAr: '',
      description: '',
      descriptionAr: ''
    })
  }

  const handleRemoveDay = (index) => {
    const updated = formData.itinerary.filter((_, i) => i !== index).map((item, i) => ({
      ...item,
      day: i + 1
    }))
    setFormData(prev => ({ ...prev, itinerary: updated }))
    setNewDay(prev => ({ ...prev, day: updated.length + 1 }))
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">
              {isAr ? '🎯 إدارة الجولات' : '🎯 Tours Management'}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {isAr ? 'إدارة جميع الجولات السياحية' : 'Manage all tours and packages'}
            </p>
          </div>
        </motion.div>

        {/* Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search */}
            <div className="lg:col-span-2 relative">
              <input
                type="search"
                placeholder={isAr ? '🔍 بحث في الجولات...' : '🔍 Search tours...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pr-12 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              />
              <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            >
              <option value="all">{isAr ? 'جميع الفئات' : 'All Categories'}</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label[locale]}</option>
              ))}
            </select>

            {/* Create Button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreate}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-2xl transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>{isAr ? 'جولة جديدة' : 'New Tour'}</span>
            </motion.button>

            {/* Page Settings Button */}
            <motion.a
              href="/admin/settings/tours-page"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-600 transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span>{isAr ? 'إعدادات الصفحة' : 'Page Settings'}</span>
            </motion.a>
          </div>
          <div className="mt-4 flex flex-wrap items-center justify-end gap-3">
            <button
              onClick={handleResetFilters}
              className="px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-600 transition-all"
            >
              {isAr ? 'إعادة ضبط الفلاتر' : 'Reset Filters'}
            </button>
            <button
              onClick={fetchTours}
              className="px-4 py-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-200 border border-gray-200 dark:border-gray-600 rounded-xl font-bold hover:bg-gray-50 dark:hover:bg-gray-600 transition-all"
            >
              {isAr ? 'تحديث' : 'Refresh'}
            </button>
            <div className="relative">
              <button
                onClick={() => setShowExportMenu(prev => !prev)}
                disabled={exportRows.length === 0}
                className="px-4 py-2 bg-blue-600 text-white rounded-xl font-bold shadow-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAr ? 'تصدير' : 'Export'}
              </button>
              <AnimatePresence>
                {showExportMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className={`absolute ${isAr ? 'right-0' : 'left-0'} mt-2 w-44 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden z-20`}
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
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full"
            />
          </div>
        )}

        {/* Tours Grid */}
        {!loading && tours.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tours.map((tour, index) => (
              <motion.div
                key={tour.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all group"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  {tour.coverImage ? (
                    <Image
                      src={tour.coverImage}
                      alt={tour.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                      sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                      unoptimized
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${getCategoryColor(tour.category)} flex items-center justify-center`}>
                      <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                  )}

                  {/* Badges */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    {tour.featured && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="px-3 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full backdrop-blur-sm"
                      >
                        ⭐ {isAr ? 'مميز' : 'Featured'}
                      </motion.span>
                    )}
                    {!tour.isActive && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full backdrop-blur-sm"
                      >
                        {isAr ? 'غير نشط' : 'Inactive'}
                      </motion.span>
                    )}
                  </div>

                  {/* Category Badge */}
                  <div className="absolute bottom-4 left-4">
                    <span className={`px-3 py-1 bg-gradient-to-r ${getCategoryColor(tour.category)} text-white text-xs font-bold rounded-full backdrop-blur-sm`}>
                      {categories.find(c => c.value === tour.category)?.label[locale]}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
                    {locale === 'ar' ? tour.titleAr || tour.title : tour.title || tour.titleAr}
                  </h3>

                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="text-center p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <div className="text-xs text-gray-600 dark:text-gray-400">{isAr ? 'المدة' : 'Duration'}</div>
                      <div className="text-sm font-bold text-gray-900 dark:text-white">{tour.duration}d</div>
                    </div>
                    <div className="text-center p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <div className="text-xs text-gray-600 dark:text-gray-400">{isAr ? 'الأشخاص' : 'People'}</div>
                      <div className="text-sm font-bold text-gray-900 dark:text-white">{tour.maxPeople}</div>
                    </div>
                    <div className="text-center p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <div className="text-xs text-gray-600 dark:text-gray-400">{isAr ? 'الحجوزات' : 'Bookings'}</div>
                      <div className="text-sm font-bold text-gray-900 dark:text-white">{tour.bookingsCount || 0}</div>
                    </div>
                  </div>

                  {/* Includes/Excludes Count */}
                  <div className="flex gap-2 mb-4 text-xs">
                    <div className="flex items-center gap-1 text-green-600 dark:text-green-400">
                      <span>✓</span>
                      <span>{tour.includes?.length || 0} {isAr ? 'مشمول' : 'included'}</span>
                    </div>
                    <div className="flex items-center gap-1 text-red-600 dark:text-red-400">
                      <span>✗</span>
                      <span>{tour.excludes?.length || 0} {isAr ? 'مستبعد' : 'excluded'}</span>
                    </div>
                  </div>

                  {/* Price */}
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-2xl font-black text-blue-600">${tour.price}</span>
                      {tour.discount > 0 && (
                        <span className="ml-2 text-sm text-gray-500 line-through">${(tour.price * (1 + tour.discount / 100)).toFixed(0)}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">⭐</span>
                      <span className="font-bold text-gray-900 dark:text-white">{tour.rating || 5.0}</span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    {/* Row 1: View & Edit */}
                    <div className="flex gap-2">
                      <motion.a
                        href={`/tours/${tour.slug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex-1 px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-xl font-semibold hover:bg-green-200 dark:hover:bg-green-900/50 transition-all text-center flex items-center justify-center gap-1"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span>{isAr ? 'معاينة' : 'View'}</span>
                      </motion.a>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEdit(tour)}
                        className="flex-1 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-xl font-semibold hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all"
                      >
                        {isAr ? 'تعديل' : 'Edit'}
                      </motion.button>
                    </div>

                    {/* Row 2: Delete */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(tour.id)}
                      disabled={deleting === tour.id}
                      className="w-full px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-xl font-semibold hover:bg-red-200 dark:hover:bg-red-900/50 transition-all disabled:opacity-50"
                    >
                      {deleting === tour.id ? '⏳' : (isAr ? 'حذف' : 'Delete')}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && tours.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-12 text-center shadow-xl"
          >
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {isAr ? 'لا توجد جولات' : 'No Tours Found'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {isAr ? 'ابدأ بإنشاء جولة جديدة' : 'Start by creating a new tour'}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreate}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-xl transition-all"
            >
              {isAr ? 'إنشاء جولة جديدة' : 'Create New Tour'}
            </motion.button>
          </motion.div>
        )}

        {/* Pagination */}{/* Same Pagination Code */}
        {pagination && pagination.totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center gap-2"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg disabled:opacity-50 shadow-lg"
            >
              ←
            </motion.button>
            <span className="px-4 py-2 text-gray-900 dark:text-white font-semibold">
              {currentPage} / {pagination.totalPages}
            </span>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
              disabled={currentPage === pagination.totalPages}
              className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg disabled:opacity-50 shadow-lg"
            >
              →
            </motion.button>
          </motion.div>
        )}

        {/* Modal - Create/Edit */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-800 rounded-3xl max-w-5xl w-full my-8 shadow-2xl"
              >
                {/* Modal Header */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 flex items-center justify-between rounded-t-3xl z-10">
                  <h2 className="text-3xl font-black text-white">
                    {modalMode === 'create'
                      ? (isAr ? '🎉 جولة جديدة' : '🎉 New Tour')
                      : (isAr ? '✏️ تعديل الجولة' : '✏️ Edit Tour')
                    }
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-white/20 rounded-xl transition-all"
                  >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>

                {/* Modal Body - Scrollable */}
                <form onSubmit={handleSave} className="p-8 space-y-8 max-h-[70vh] overflow-y-auto">

                  {/* Basic Info */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white border-b-2 border-blue-500 pb-2 flex items-center gap-2">
                      <span>📝</span>
                      <span>{isAr ? 'معلومات أساسية' : 'Basic Information'}</span>
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                          {isAr ? 'العنوان (English)' : 'Title (English)'} *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.title}
                          onChange={(e) => handleFormChange('title', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., Dragon Blood Trees Adventure"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                          {isAr ? 'العنوان (العربي)' : 'Title (Arabic)'} *
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.titleAr}
                          onChange={(e) => handleFormChange('titleAr', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          dir="rtl"
                          placeholder="مثال: مغامرة أشجار دم الأخوين"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                          {isAr ? 'الوصف (English)' : 'Description (English)'} *
                        </label>
                        <textarea
                          required
                          rows={4}
                          value={formData.description}
                          onChange={(e) => handleFormChange('description', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Detailed description..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                          {isAr ? 'الوصف (العربي)' : 'Description (Arabic)'} *
                        </label>
                        <textarea
                          required
                          rows={4}
                          value={formData.descriptionAr}
                          onChange={(e) => handleFormChange('descriptionAr', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          dir="rtl"
                          placeholder="وصف تفصيلي..."
                        />
                      </div>
                    </div>

                    {/* Location Coordinates */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                          {isAr ? 'خط العرض (Latitude)' : 'Latitude'}
                        </label>
                        <input
                          type="number"
                          step="any"
                          value={formData.latitude}
                          onChange={(e) => handleFormChange('latitude', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g. 12.65"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                          {isAr ? 'خط الطول (Longitude)' : 'Longitude'}
                        </label>
                        <input
                          type="number"
                          step="any"
                          value={formData.longitude}
                          onChange={(e) => handleFormChange('longitude', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g. 54.02"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Pricing & Details */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white border-b-2 border-green-500 pb-2 flex items-center gap-2">
                      <span>💰</span>
                      <span>{isAr ? 'السعر والتفاصيل' : 'Pricing & Details'}</span>
                    </h3>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                          {isAr ? 'السعر ($)' : 'Price ($)'} *
                        </label>
                        <input
                          type="number"
                          required
                          min="0"
                          step="0.01"
                          value={formData.price}
                          onChange={(e) => handleFormChange('price', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                          {isAr ? 'الخصم (%)' : 'Discount (%)'}
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={formData.discount}
                          onChange={(e) => handleFormChange('discount', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                          {isAr ? 'المدة (أيام)' : 'Duration (days)'} *
                        </label>
                        <input
                          type="number"
                          required
                          min="1"
                          value={formData.duration}
                          onChange={(e) => handleFormChange('duration', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                          {isAr ? 'عدد الأشخاص' : 'Max People'} *
                        </label>
                        <input
                          type="number"
                          required
                          min="1"
                          value={formData.maxPeople}
                          onChange={(e) => handleFormChange('maxPeople', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                          {isAr ? 'الفئة' : 'Category'} *
                        </label>
                        <select
                          required
                          value={formData.category}
                          onChange={(e) => handleFormChange('category', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {categories.map(cat => (
                            <option key={cat.value} value={cat.value}>{cat.label[locale]}</option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                          {isAr ? 'الصعوبة' : 'Difficulty'} *
                        </label>
                        <select
                          required
                          value={formData.difficulty}
                          onChange={(e) => handleFormChange('difficulty', e.target.value)}
                          className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {difficulties.map(diff => (
                            <option key={diff.value} value={diff.value}>{diff.label[locale]} {diff.icon}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Media (Images & Video) */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white border-b-2 border-purple-500 pb-2 flex items-center gap-2">
                      <span>📸</span>
                      <span>{isAr ? 'الوسائط' : 'Media'}</span>
                    </h3>

                    {/* Cover Image */}
                    <div>
                      <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                        {isAr ? 'صورة الغلاف' : 'Cover Image'}
                      </label>
                      <div className="space-y-4">
                        {formData.coverImage && (
                          <div className="relative w-full h-64 rounded-xl overflow-hidden shadow-lg border-2 border-gray-200 dark:border-gray-700">
                            <Image src={formData.coverImage} alt="Cover" fill className="object-cover" sizes="100vw" unoptimized />
                            <button
                              type="button"
                              onClick={() => handleFormChange('coverImage', '')}
                              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-all"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        )}
                        {!formData.coverImage && (
                          <ImageUploader onUploadProp={handleCoverUpload} multiple={false} />
                        )}
                      </div>
                    </div>

                    {/* Card Image */}
                    <div>
                      <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                        {isAr ? 'صورة البطاقة (اختياري)' : 'Card Image (Optional)'}
                        <span className="block text-xs font-normal text-gray-500 mt-1">
                          {isAr ? 'صورة مربعة أو 4:3 تظهر في قائمة الرحلات. إذا لم تتوفر سيتم استخدام صورة الغلاف.' : 'Square or 4:3 image for tour lists. Falls back to cover image if empty.'}
                        </span>
                      </label>
                      <div className="space-y-4">
                        {formData.cardImage && (
                          <div className="relative w-48 h-48 rounded-xl overflow-hidden shadow-lg border-2 border-gray-200 dark:border-gray-700">
                            <Image src={formData.cardImage} alt="Card" fill className="object-cover" sizes="192px" unoptimized />
                            <button
                              type="button"
                              onClick={() => handleFormChange('cardImage', '')}
                              className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full shadow-lg hover:bg-red-600 transition-all"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </div>
                        )}
                        {!formData.cardImage && (
                          <div className="w-48">
                            <ImageUploader onUploadProp={handleCardImageUpload} multiple={false} />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Gallery Images */}
                    <div>
                      <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                        {isAr ? 'معرض الصور' : 'Gallery Images'}
                      </label>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        {formData.images.map((img, index) => (
                          <div key={index} className="relative group aspect-square rounded-xl overflow-hidden shadow-md border-2 border-gray-200 dark:border-gray-700">
                            <Image src={img} alt={`Gallery ${index + 1}`} fill className="object-cover" sizes="(min-width: 768px) 25vw, 50vw" unoptimized />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button
                                type="button"
                                onClick={() => handleRemoveGalleryImage(index)}
                                className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition-all transform hover:scale-110"
                              >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <ImageUploader onUploadProp={handleGalleryUpload} multiple={true} />
                    </div>

                    {/* Video URL */}
                    <div>
                      <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                        {isAr ? 'رابط الفيديو (YouTube)' : 'Video URL (YouTube)'}
                      </label>
                      <input
                        type="url"
                        value={formData.videoUrl}
                        onChange={(e) => handleFormChange('videoUrl', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="https://youtube.com/watch?v=..."
                      />
                    </div>
                  </div>

                  {/* Includes & Excludes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Includes */}
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white border-b-2 border-green-500 pb-2 flex items-center gap-2">
                        <span>✅</span>
                        <span>{isAr ? 'ما يشمله السعر' : 'Includes'}</span>
                      </h3>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newInclude}
                          onChange={(e) => setNewInclude(e.target.value)}
                          className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                          placeholder={isAr ? 'أضف بند...' : 'Add item...'}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddInclude())}
                        />
                        <button
                          type="button"
                          onClick={handleAddInclude}
                          className="px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all font-bold"
                        >
                          +
                        </button>
                      </div>

                      <ul className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                        {formData.includes.map((item, index) => (
                          <li key={index} className="flex items-center justify-between bg-green-50 dark:bg-green-900/20 p-3 rounded-xl border border-green-100 dark:border-green-800">
                            <span className="text-gray-800 dark:text-gray-200">{item}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveInclude(index)}
                              className="text-red-500 hover:text-red-700 bg-white dark:bg-gray-800 rounded-full p-1"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Excludes */}
                    <div className="space-y-4">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white border-b-2 border-red-500 pb-2 flex items-center gap-2">
                        <span>❌</span>
                        <span>{isAr ? 'ما لا يشمله السعر' : 'Excludes'}</span>
                      </h3>

                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={newExclude}
                          onChange={(e) => setNewExclude(e.target.value)}
                          className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500"
                          placeholder={isAr ? 'أضف بند...' : 'Add item...'}
                          onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddExclude())}
                        />
                        <button
                          type="button"
                          onClick={handleAddExclude}
                          className="px-4 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all font-bold"
                        >
                          +
                        </button>
                      </div>

                      <ul className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                        {formData.excludes.map((item, index) => (
                          <li key={index} className="flex items-center justify-between bg-red-50 dark:bg-red-900/20 p-3 rounded-xl border border-red-100 dark:border-red-800">
                            <span className="text-gray-800 dark:text-gray-200">{item}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveExclude(index)}
                              className="text-red-500 hover:text-red-700 bg-white dark:bg-gray-800 rounded-full p-1"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Features (Bilingual) */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white border-b-2 border-indigo-500 pb-2 flex items-center gap-2">
                      <span>✨</span>
                      <span>{isAr ? 'المميزات' : 'Features'}</span>
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Features English */}
                      <div className="space-y-4">
                        <label className="block text-sm font-bold text-gray-900 dark:text-white">
                          {isAr ? 'المميزات (English)' : 'Features (English)'}
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newFeature}
                            onChange={(e) => setNewFeature(e.target.value)}
                            className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            placeholder={isAr ? 'أضف ميزة...' : 'Add feature...'}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                          />
                          <button
                            type="button"
                            onClick={handleAddFeature}
                            className="px-4 py-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-all font-bold"
                          >
                            +
                          </button>
                        </div>
                        <ul className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                          {formData.features.map((item, index) => (
                            <li key={index} className="flex items-center justify-between bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-xl border border-indigo-100 dark:border-indigo-800">
                              <span className="text-gray-800 dark:text-gray-200">{item}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveFeature(index)}
                                className="text-red-500 hover:text-red-700 bg-white dark:bg-gray-800 rounded-full p-1"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Features Arabic */}
                      <div className="space-y-4">
                        <label className="block text-sm font-bold text-gray-900 dark:text-white">
                          {isAr ? 'المميزات (العربي)' : 'Features (Arabic)'}
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={newFeatureAr}
                            onChange={(e) => setNewFeatureAr(e.target.value)}
                            className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            dir="rtl"
                            placeholder="أضف ميزة..."
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFeatureAr())}
                          />
                          <button
                            type="button"
                            onClick={handleAddFeatureAr}
                            className="px-4 py-2 bg-indigo-500 text-white rounded-xl hover:bg-indigo-600 transition-all font-bold"
                          >
                            +
                          </button>
                        </div>
                        <ul className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                          {formData.featuresAr.map((item, index) => (
                            <li key={index} className="flex items-center justify-between bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-xl border border-indigo-100 dark:border-indigo-800">
                              <span className="text-gray-800 dark:text-gray-200">{item}</span>
                              <button
                                type="button"
                                onClick={() => handleRemoveFeatureAr(index)}
                                className="text-red-500 hover:text-red-700 bg-white dark:bg-gray-800 rounded-full p-1"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Itinerary Management */}
                  <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white border-b-2 border-amber-500 pb-2 flex items-center gap-2">
                      <span>📅</span>
                      <span>{isAr ? 'برنامج الرحلة' : 'Itinerary'}</span>
                    </h3>

                    <div className="bg-gray-50 dark:bg-gray-700/30 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                            {isAr ? 'عنوان اليوم (English)' : 'Day Title (English)'}
                          </label>
                          <input
                            type="text"
                            value={newDay.title}
                            onChange={(e) => setNewDay({ ...newDay, title: e.target.value })}
                            className="w-full px-4 py-2 bg-white dark:bg-gray-600 rounded-lg border border-gray-300 dark:border-gray-500"
                            placeholder="e.g. Arrival in Socotra"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                            {isAr ? 'عنوان اليوم (العربي)' : 'Day Title (Arabic)'}
                          </label>
                          <input
                            type="text"
                            value={newDay.titleAr}
                            onChange={(e) => setNewDay({ ...newDay, titleAr: e.target.value })}
                            className="w-full px-4 py-2 bg-white dark:bg-gray-600 rounded-lg border border-gray-300 dark:border-gray-500"
                            dir="rtl"
                            placeholder="مثال: الوصول الى سقطرى"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                            {isAr ? 'الوصف (English)' : 'Description (English)'}
                          </label>
                          <textarea
                            rows="2"
                            value={newDay.description}
                            onChange={(e) => setNewDay({ ...newDay, description: e.target.value })}
                            className="w-full px-4 py-2 bg-white dark:bg-gray-600 rounded-lg border border-gray-300 dark:border-gray-500"
                          />
                        </div>
                        <div className="md:col-span-2">
                          <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                            {isAr ? 'الوصف (العربي)' : 'Description (Arabic)'}
                          </label>
                          <textarea
                            rows="2"
                            value={newDay.descriptionAr}
                            onChange={(e) => setNewDay({ ...newDay, descriptionAr: e.target.value })}
                            className="w-full px-4 py-2 bg-white dark:bg-gray-600 rounded-lg border border-gray-300 dark:border-gray-500"
                            dir="rtl"
                          />
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleAddDay}
                        className="w-full py-2 bg-amber-500 text-white rounded-lg font-bold hover:bg-amber-600 transition-all flex items-center justify-center gap-2"
                      >
                        <span>+</span>
                        <span>{isAr ? 'إضافة يوم' : 'Add Day'} {newDay.day}</span>
                      </button>
                    </div>

                    {/* Timeline List */}
                    <div className="space-y-4 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-300 before:to-transparent">
                      {formData.itinerary?.map((day, index) => (
                        <div key={index} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                          <div className="flex items-center justify-center w-10 h-10 rounded-full border border-white bg-slate-300 group-[.is-active]:bg-emerald-500 text-slate-500 group-[.is-active]:text-emerald-50 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10">
                            {day.day}
                          </div>

                          <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-white dark:bg-gray-800 p-4 rounded-xl border border-slate-200 dark:border-gray-700 shadow flex flex-col gap-2">
                            <div className="flex justify-between items-start">
                              <h4 className="font-bold text-gray-900 dark:text-white">{day.title} / {day.titleAr}</h4>
                              <button
                                type="button"
                                onClick={() => handleRemoveDay(index)}
                                className="text-red-500 hover:text-red-700"
                              >
                                🗑️
                              </button>
                            </div>
                            <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">{day.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Settings Toggle */}
                  <div className="space-y-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex flex-wrap gap-6">
                      <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                        <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 cursor-pointer ${formData.featured ? 'bg-yellow-400' : 'bg-gray-300 dark:bg-gray-600'}`}
                          onClick={() => handleFormChange('featured', !formData.featured)}>
                          <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${formData.featured ? 'translate-x-6' : ''}`} />
                        </div>
                        <span className="font-bold text-gray-900 dark:text-white">
                          {isAr ? 'جولة مميزة' : 'Featured Tour'}
                        </span>
                      </div>

                      <div className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl">
                        <div className={`w-12 h-6 rounded-full p-1 transition-colors duration-300 cursor-pointer ${formData.isActive ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                          onClick={() => handleFormChange('isActive', !formData.isActive)}>
                          <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${formData.isActive ? 'translate-x-6' : ''}`} />
                        </div>
                        <span className="font-bold text-gray-900 dark:text-white">
                          {isAr ? 'نشط' : 'Active'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="sticky bottom-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-4 border-t border-gray-200 dark:border-gray-700 flex justify-end gap-4 rounded-b-3xl -mx-8 -mb-8">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-xl font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                    >
                      {isAr ? 'إلغاء' : 'Cancel'}
                    </button>
                    <button
                      type="submit"
                      disabled={saving}
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-xl transition-all disabled:opacity-50 flex items-center gap-2"
                    >
                      {saving ? (
                        <>
                          <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                          </svg>
                          <span>{isAr ? 'جاري الحفظ...' : 'Saving...'}</span>
                        </>
                      ) : (
                        <>
                          <span>{modalMode === 'create' ? '✨' : '💾'}</span>
                          <span>
                            {modalMode === 'create'
                              ? (isAr ? 'إنشاء الجولة' : 'Create Tour')
                              : (isAr ? 'حفظ التغييرات' : 'Save Changes')
                            }
                          </span>
                        </>
                      )}
                    </button>
                  </div>

                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  )
}
