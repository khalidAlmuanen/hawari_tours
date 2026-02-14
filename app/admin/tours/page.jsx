'use client'

// ═══════════════════════════════════════════════════════════════
// ✈️ TOURS MANAGEMENT - Ultra Professional & Modern
// إدارة الجولات - تصميم احترافي وعصري جداً
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react'
import { useApp } from '@/contexts/AppContext'
import AdminLayout from '@/components/admin/AdminLayout'
import { useToast } from '@/components/admin/Toast'
import { motion, AnimatePresence } from 'framer-motion'

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

  // Temporary input states for arrays
  const [newInclude, setNewInclude] = useState('')
  const [newExclude, setNewExclude] = useState('')
  const [newImage, setNewImage] = useState('')

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
    images: [],
    videoUrl: '',
    includes: [],
    excludes: [],
    featured: false,
    isActive: true,
    metaTitle: '',
    metaDescription: '',
    keywords: []
  })

  const categories = [
    { value: 'ADVENTURE', label: { ar: 'مغامرة', en: 'Adventure' }, color: 'blue' },
    { value: 'CULTURAL', label: { ar: 'ثقافي', en: 'Cultural' }, color: 'purple' },
    { value: 'NATURE', label: { ar: 'طبيعة', en: 'Nature' }, color: 'green' },
    { value: 'BEACH', label: { ar: 'شاطئ', en: 'Beach' }, color: 'cyan' },
    { value: 'WILDLIFE', label: { ar: 'حياة برية', en: 'Wildlife' }, color: 'orange' },
    { value: 'HERITAGE', label: { ar: 'تراث', en: 'Heritage' }, color: 'amber' }
  ]

  const difficulties = [
    { value: 'EASY', label: { ar: 'سهل', en: 'Easy' }, icon: '😊' },
    { value: 'MODERATE', label: { ar: 'متوسط', en: 'Moderate' }, icon: '🙂' },
    { value: 'CHALLENGING', label: { ar: 'صعب', en: 'Challenging' }, icon: '😅' },
    { value: 'DIFFICULT', label: { ar: 'صعب جداً', en: 'Difficult' }, icon: '💪' }
  ]

  // Fetch Tours
  useEffect(() => {
    fetchTours()
  }, [searchTerm, categoryFilter, currentPage])

  const fetchTours = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...(searchTerm && { search: searchTerm }),
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
  }

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
      images: [],
      videoUrl: '',
      includes: [],
      excludes: [],
      featured: false,
      isActive: true,
      metaTitle: '',
      metaDescription: '',
      keywords: []
    })
    setNewInclude('')
    setNewExclude('')
    setNewImage('')
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
      images: tour.images || [],
      videoUrl: tour.videoUrl || '',
      includes: tour.includes || [],
      excludes: tour.excludes || [],
      featured: tour.featured,
      isActive: tour.isActive,
      metaTitle: tour.metaTitle || '',
      metaDescription: tour.metaDescription || '',
      keywords: tour.keywords || []
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

  const handleAddImage = () => {
    if (!newImage.trim()) return
    setFormData(prev => ({
      ...prev,
      images: [...prev.images, newImage.trim()]
    }))
    setNewImage('')
  }

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
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
                    <img 
                      src={tour.coverImage} 
                      alt={tour.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
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
                    {locale === 'ar' ? tour.titleAr : tour.title}
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
                        <span className="ml-2 text-sm text-gray-500 line-through">${(tour.price * (1 + tour.discount/100)).toFixed(0)}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">⭐</span>
                      <span className="font-bold text-gray-900 dark:text-white">{tour.rating || 0}</span>
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

        {/* Pagination */}
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
                        {isAr ? 'المستوى' : 'Difficulty'} *
                      </label>
                      <select
                        required
                        value={formData.difficulty}
                        onChange={(e) => handleFormChange('difficulty', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {difficulties.map(diff => (
                            <option key={diff.value} value={diff.value}>
                              {diff.icon} {diff.label[locale]}
                            </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                  {/* Media */}
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white border-b-2 border-purple-500 pb-2 flex items-center gap-2">
                      <span>🖼️</span>
                      <span>{isAr ? 'الصور والفيديو' : 'Media'}</span>
                  </h3>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                      {isAr ? 'صورة الغلاف (URL)' : 'Cover Image (URL)'}
                    </label>
                    <input
                      type="url"
                      value={formData.coverImage}
                      onChange={(e) => handleFormChange('coverImage', e.target.value)}
                      placeholder="https://example.com/image.jpg"
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Additional Images */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                      {isAr ? 'صور إضافية' : 'Additional Images'}
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="url"
                        value={newImage}
                        onChange={(e) => setNewImage(e.target.value)}
                        placeholder="https://example.com/image.jpg"
                        className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={handleAddImage}
                        className="px-6 py-3 bg-purple-600 text-white rounded-xl font-bold hover:bg-purple-700"
                      >
                        ➕
                        </motion.button>
                    </div>
                    <div className="space-y-2">
                      {formData.images.map((img, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                            className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 p-2 rounded-lg"
                          >
                          <span className="flex-1 text-sm text-gray-700 dark:text-gray-300 truncate">{img}</span>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            type="button"
                            onClick={() => handleRemoveImage(index)}
                            className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
                          >
                            ✕
                            </motion.button>
                          </motion.div>
                      ))}
                    </div>
                  </div>
                </div>

                  {/* What's Included */}
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white border-b-2 border-green-500 pb-2 flex items-center gap-2">
                      <span>✅</span>
                      <span>{isAr ? 'ما يشمله السعر' : "What's Included"}</span>
                  </h3>

                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newInclude}
                      onChange={(e) => setNewInclude(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddInclude())}
                      placeholder={isAr ? 'مثال: النقل من وإلى المطار' : 'e.g., Airport transfers'}
                      className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      dir={isAr ? 'rtl' : 'ltr'}
                    />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={handleAddInclude}
                      className="px-6 py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700"
                    >
                      ➕
                      </motion.button>
                  </div>

                  <div className="space-y-2">
                    {formData.includes.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 p-3 rounded-lg border border-green-200 dark:border-green-800"
                        >
                        <span className="text-green-600 dark:text-green-400 flex-shrink-0">✓</span>
                        <span className="flex-1 text-gray-700 dark:text-gray-300">{item}</span>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          type="button"
                          onClick={() => handleRemoveInclude(index)}
                          className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
                        >
                          ✕
                          </motion.button>
                        </motion.div>
                    ))}
                  </div>
                </div>

                  {/* What's NOT Included */}
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white border-b-2 border-red-500 pb-2 flex items-center gap-2">
                      <span>❌</span>
                      <span>{isAr ? 'ما لا يشمله السعر' : 'Not Included'}</span>
                  </h3>

                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={newExclude}
                      onChange={(e) => setNewExclude(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddExclude())}
                      placeholder={isAr ? 'مثال: تذاكر الطيران' : 'e.g., Flight tickets'}
                      className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      dir={isAr ? 'rtl' : 'ltr'}
                    />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      type="button"
                      onClick={handleAddExclude}
                      className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700"
                    >
                      ➕
                      </motion.button>
                  </div>

                  <div className="space-y-2">
                    {formData.excludes.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 p-3 rounded-lg border border-red-200 dark:border-red-800"
                        >
                        <span className="text-red-600 dark:text-red-400 flex-shrink-0">✗</span>
                        <span className="flex-1 text-gray-700 dark:text-gray-300">{item}</span>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          type="button"
                          onClick={() => handleRemoveExclude(index)}
                          className="px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600"
                        >
                          ✕
                          </motion.button>
                        </motion.div>
                    ))}
                  </div>
                </div>

                  {/* Status */}
                <div className="space-y-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white border-b-2 border-indigo-500 pb-2 flex items-center gap-2">
                      <span>⚙️</span>
                      <span>{isAr ? 'الحالة' : 'Status'}</span>
                  </h3>

                  <div className="flex gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => handleFormChange('featured', e.target.checked)}
                        className="w-5 h-5 rounded text-blue-600 focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-gray-900 dark:text-white font-semibold">
                        ⭐ {isAr ? 'مميز' : 'Featured'}
                      </span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => handleFormChange('isActive', e.target.checked)}
                        className="w-5 h-5 rounded text-blue-600 focus:ring-2 focus:ring-blue-500"
                      />
                      <span className="text-gray-900 dark:text-white font-semibold">
                        ✓ {isAr ? 'نشط' : 'Active'}
                      </span>
                    </label>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-4 pt-4 sticky bottom-0 bg-white dark:bg-gray-800 pb-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                  >
                    {isAr ? 'إلغاء' : 'Cancel'}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={saving}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-xl transition-all disabled:opacity-50"
                  >
                    {saving ? (
                      <div className="flex items-center justify-center gap-2">
                        <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                        <span>{isAr ? 'جاري الحفظ...' : 'Saving...'}</span>
                      </div>
                    ) : (
                      <span>💾 {isAr ? 'حفظ' : 'Save'}</span>
                    )}
                    </motion.button>
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
