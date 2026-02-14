'use client'

// ═══════════════════════════════════════════════════════════════
// 🏛️ DESTINATIONS MANAGEMENT - Ultra Professional & Modern
// إدارة المعالم - تصميم احترافي وعصري جداً
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react'
import { useApp } from '@/contexts/AppContext'
import AdminLayout from '@/components/admin/AdminLayout'
import { useToast } from '@/components/admin/Toast'
import { motion, AnimatePresence } from 'framer-motion'

export default function DestinationsManagement() {
  const { locale } = useApp()
  const { success, error: showError, info } = useToast()
  const isAr = locale === 'ar'

  const [destinations, setDestinations] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState('create')
  const [selectedDestination, setSelectedDestination] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(null)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState(null)

  const [newHighlight, setNewHighlight] = useState('')
  const [newImage, setNewImage] = useState('')
  const [newActivity, setNewActivity] = useState('')

  const [formData, setFormData] = useState({
    name: '',
    nameAr: '',
    description: '',
    descriptionAr: '',
    category: 'NATURE',
    coverImage: '',
    images: [],
    latitude: '',
    longitude: '',
    highlights: [],
    activities: [],
    bestTimeToVisit: '',
    featured: false,
    isActive: true,
    unesco: false
  })

  const categories = [
    { value: 'NATURE', label: { ar: 'طبيعة', en: 'Nature' }, icon: '🌿', color: 'green' },
    { value: 'HERITAGE', label: { ar: 'تراث', en: 'Heritage' }, icon: '🏛️', color: 'purple' },
    { value: 'BEACH', label: { ar: 'شاطئ', en: 'Beach' }, icon: '🏖️', color: 'cyan' },
    { value: 'MOUNTAIN', label: { ar: 'جبل', en: 'Mountain' }, icon: '⛰️', color: 'gray' },
    { value: 'ARCHAEOLOGICAL', label: { ar: 'أثري', en: 'Archaeological' }, icon: '🏺', color: 'amber' },
    { value: 'CULTURAL', label: { ar: 'ثقافي', en: 'Cultural' }, icon: '🎭', color: 'pink' },
    { value: 'WILDLIFE', label: { ar: 'حياة برية', en: 'Wildlife' }, icon: '🦜', color: 'orange' }
  ]

  useEffect(() => {
    fetchDestinations()
  }, [searchTerm, categoryFilter, currentPage])

  const fetchDestinations = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 12,
        ...(searchTerm && { search: searchTerm }),
        ...(categoryFilter !== 'all' && { category: categoryFilter })
      })

      const response = await fetch(`/api/admin/destinations?${params}`)
      const result = await response.json()

      if (result.success) {
        setDestinations(result.data.destinations)
        setPagination(result.data.pagination)
      }
    } catch (error) {
      console.error('Failed to fetch destinations:', error)
      showError(isAr ? 'فشل في جلب البيانات' : 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      nameAr: '',
      description: '',
      descriptionAr: '',
      category: 'NATURE',
      coverImage: '',
      images: [],
      latitude: '',
      longitude: '',
      highlights: [],
      activities: [],
      bestTimeToVisit: '',
      featured: false,
      isActive: true,
      unesco: false
    })
    setNewHighlight('')
    setNewImage('')
    setNewActivity('')
  }

  const handleCreate = () => {
    setModalMode('create')
    setSelectedDestination(null)
    resetForm()
    setShowModal(true)
  }

  const handleEdit = (destination) => {
    setModalMode('edit')
    setSelectedDestination(destination)
    setFormData({
      name: destination.name,
      nameAr: destination.nameAr,
      description: destination.description,
      descriptionAr: destination.descriptionAr,
      category: destination.category,
      coverImage: destination.coverImage,
      images: destination.images || [],
      latitude: destination.latitude?.toString() || '',
      longitude: destination.longitude?.toString() || '',
      highlights: destination.highlights || [],
      activities: destination.activities || [],
      bestTimeToVisit: destination.bestTimeToVisit || '',
      featured: destination.featured,
      isActive: destination.isActive,
      unesco: destination.unesco
    })
    setShowModal(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const url = '/api/admin/destinations'
      const method = modalMode === 'create' ? 'POST' : 'PUT'
      const body = {
        ...formData,
        ...(modalMode === 'edit' && { id: selectedDestination.id }),
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
        fetchDestinations()
        resetForm()
        success(
          modalMode === 'create'
            ? (isAr ? 'تم إنشاء المعلم بنجاح! 🎉' : 'Destination created successfully! 🎉')
            : (isAr ? 'تم تحديث المعلم بنجاح! ✨' : 'Destination updated successfully! ✨')
        )
      } else {
        showError(result.error || (isAr ? 'فشلت العملية' : 'Operation failed'))
      }
    } catch (error) {
      console.error('Failed to save destination:', error)
      showError(isAr ? 'فشل في حفظ البيانات' : 'Failed to save data')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (destinationId) => {
    setDeleting(destinationId)
    try {
      const response = await fetch(`/api/admin/destinations?id=${destinationId}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (result.success) {
        fetchDestinations()
        success(isAr ? 'تم حذف المعلم بنجاح' : 'Destination deleted successfully')
      } else {
        showError(result.error || (isAr ? 'فشل في الحذف' : 'Failed to delete'))
      }
    } catch (error) {
      console.error('Failed to delete destination:', error)
      showError(isAr ? 'فشل في حذف البيانات' : 'Failed to delete data')
    } finally {
      setDeleting(null)
    }
  }

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleAddHighlight = () => {
    if (newHighlight.trim()) {
      setFormData(prev => ({
        ...prev,
        highlights: [...prev.highlights, newHighlight.trim()]
      }))
      setNewHighlight('')
    }
  }

  const handleRemoveHighlight = (index) => {
    setFormData(prev => ({
      ...prev,
      highlights: prev.highlights.filter((_, i) => i !== index)
    }))
  }

  const handleAddActivity = () => {
    if (newActivity.trim()) {
      setFormData(prev => ({
        ...prev,
        activities: [...prev.activities, newActivity.trim()]
      }))
      setNewActivity('')
    }
  }

  const handleRemoveActivity = (index) => {
    setFormData(prev => ({
      ...prev,
      activities: prev.activities.filter((_, i) => i !== index)
    }))
  }

  const handleAddImage = () => {
    if (newImage.trim()) {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, newImage.trim()]
      }))
      setNewImage('')
    }
  }

  const handleRemoveImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }))
  }

  const getCategoryGradient = (category) => {
    const cat = categories.find(c => c.value === category)
    const gradients = {
      green: 'from-green-500 to-emerald-600',
      purple: 'from-purple-500 to-purple-600',
      cyan: 'from-cyan-500 to-blue-600',
      gray: 'from-gray-500 to-gray-700',
      amber: 'from-amber-500 to-orange-600',
      pink: 'from-pink-500 to-rose-600',
      orange: 'from-orange-500 to-red-600'
    }
    return gradients[cat?.color] || 'from-gray-500 to-gray-600'
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">
            {isAr ? '🏛️ إدارة المعالم' : '🏛️ Destinations Management'}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {isAr ? 'إدارة جميع المعالم والوجهات السياحية' : 'Manage all landmarks and tourist destinations'}
          </p>
        </motion.div>

        {/* Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <input
                type="search"
                placeholder={isAr ? '🔍 بحث في المعالم...' : '🔍 Search destinations...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pr-12 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">{isAr ? 'جميع الفئات' : 'All Categories'}</option>
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>
                  {cat.icon} {cat.label[locale]}
                </option>
              ))}
            </select>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreate}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-2xl transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>{isAr ? 'معلم جديد' : 'New Destination'}</span>
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

        {/* Destinations Grid */}
        {!loading && destinations.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((dest, index) => (
              <motion.div
                key={dest.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all group"
              >
                {/* Image */}
                <div className="relative h-56 overflow-hidden">
                  {dest.coverImage ? (
                    <img 
                      src={dest.coverImage} 
                      alt={dest.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${getCategoryGradient(dest.category)} flex items-center justify-center`}>
                      <span className="text-6xl">{categories.find(c => c.value === dest.category)?.icon || '🏛️'}</span>
                    </div>
                  )}
                  
                  {/* Badges */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    {dest.featured && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="px-3 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full backdrop-blur-sm"
                      >
                        ⭐ {isAr ? 'مميز' : 'Featured'}
                      </motion.span>
                    )}
                    {dest.unesco && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="px-3 py-1 bg-blue-500 text-white text-xs font-bold rounded-full backdrop-blur-sm"
                      >
                        🏛️ UNESCO
                      </motion.span>
                    )}
                    {!dest.isActive && (
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
                    <span className={`px-3 py-1 bg-gradient-to-r ${getCategoryGradient(dest.category)} text-white text-xs font-bold rounded-full backdrop-blur-sm`}>
                      {categories.find(c => c.value === dest.category)?.icon} {categories.find(c => c.value === dest.category)?.label[locale]}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-1">
                    {locale === 'ar' ? dest.nameAr : dest.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                    {locale === 'ar' ? dest.descriptionAr : dest.description}
                  </p>

                  {/* Info Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="text-center p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <div className="text-xs text-gray-600 dark:text-gray-400">{isAr ? 'الأنشطة' : 'Activities'}</div>
                      <div className="text-sm font-bold text-gray-900 dark:text-white">{dest.activities?.length || 0}</div>
                    </div>
                    <div className="text-center p-2 bg-gray-100 dark:bg-gray-700 rounded-lg">
                      <div className="text-xs text-gray-600 dark:text-gray-400">{isAr ? 'المميزات' : 'Highlights'}</div>
                      <div className="text-sm font-bold text-gray-900 dark:text-white">{dest.highlights?.length || 0}</div>
                    </div>
                  </div>

                  {/* Best Time */}
                  {dest.bestTimeToVisit && (
                    <div className="mb-4 p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-center">
                      <div className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                        {isAr ? 'أفضل وقت للزيارة' : 'Best Time'}
                      </div>
                      <div className="text-sm font-semibold text-blue-700 dark:text-blue-400">
                        {dest.bestTimeToVisit}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="space-y-2">
                    {/* Row 1: View & Edit */}
                    <div className="flex gap-2">
                      <motion.a
                        href={`/destinations#${dest.slug || dest.id}`}
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
                        onClick={() => handleEdit(dest)}
                        className="flex-1 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-xl font-semibold hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all"
                      >
                        {isAr ? 'تعديل' : 'Edit'}
                      </motion.button>
                    </div>
                    
                    {/* Row 2: Delete */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(dest.id)}
                      disabled={deleting === dest.id}
                      className="w-full px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-xl font-semibold hover:bg-red-200 dark:hover:bg-red-900/50 transition-all disabled:opacity-50"
                    >
                      {deleting === dest.id ? '⏳' : (isAr ? 'حذف' : 'Delete')}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && destinations.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-12 text-center shadow-xl"
          >
            <div className="text-6xl mb-4">🏛️</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {isAr ? 'لا توجد معالم' : 'No Destinations Found'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {isAr ? 'ابدأ بإضافة معلم جديد' : 'Start by adding a new destination'}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreate}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-xl transition-all"
            >
              {isAr ? 'إضافة معلم' : 'Add Destination'}
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
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-800 rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              >
                {/* Modal Header */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 flex items-center justify-between z-10 rounded-t-3xl">
                  <h2 className="text-3xl font-black text-white">
                    {modalMode === 'create' 
                      ? (isAr ? '🎉 معلم جديد' : '🎉 New Destination')
                      : (isAr ? '✏️ تعديل المعلم' : '✏️ Edit Destination')
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

                {/* Modal Body */}
                <form onSubmit={handleSave} className="p-8 space-y-6">
                  {/* Name */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                        {isAr ? 'الاسم (English)' : 'Name (English)'} *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => handleFormChange('name', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                        {isAr ? 'الاسم (العربي)' : 'Name (Arabic)'} *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.nameAr}
                        onChange={(e) => handleFormChange('nameAr', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        dir="rtl"
                      />
                    </div>
                  </div>

                  {/* Description */}
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
                      />
                    </div>
                  </div>

                  {/* Category & Location */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                          <option key={cat.value} value={cat.value}>
                            {cat.icon} {cat.label[locale]}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                        {isAr ? 'خط العرض' : 'Latitude'}
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={formData.latitude}
                        onChange={(e) => handleFormChange('latitude', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                        {isAr ? 'خط الطول' : 'Longitude'}
                      </label>
                      <input
                        type="number"
                        step="any"
                        value={formData.longitude}
                        onChange={(e) => handleFormChange('longitude', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Cover Image & Best Time */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                        {isAr ? 'صورة الغلاف (URL)' : 'Cover Image (URL)'}
                      </label>
                      <input
                        type="url"
                        value={formData.coverImage}
                        onChange={(e) => handleFormChange('coverImage', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                        {isAr ? 'أفضل وقت للزيارة' : 'Best Time to Visit'}
                      </label>
                      <input
                        type="text"
                        value={formData.bestTimeToVisit}
                        onChange={(e) => handleFormChange('bestTimeToVisit', e.target.value)}
                        placeholder={isAr ? 'مثال: أكتوبر - مارس' : 'e.g., October - March'}
                        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>

                  {/* Highlights */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                      {isAr ? 'المميزات' : 'Highlights'}
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={newHighlight}
                        onChange={(e) => setNewHighlight(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddHighlight())}
                        placeholder={isAr ? 'أضف ميزة...' : 'Add highlight...'}
                        className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={handleAddHighlight}
                        className="px-4 py-2 bg-green-600 text-white rounded-xl font-semibold"
                      >
                        ➕
                      </motion.button>
                    </div>
                    <div className="space-y-2">
                      {formData.highlights.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 p-2 rounded-lg border border-green-200 dark:border-green-800"
                        >
                          <span className="text-green-600 dark:text-green-400">✓</span>
                          <span className="flex-1 text-gray-700 dark:text-gray-300 text-sm">{item}</span>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            type="button"
                            onClick={() => handleRemoveHighlight(index)}
                            className="px-2 py-1 bg-red-500 text-white rounded text-xs"
                          >
                            ✕
                          </motion.button>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Activities */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                      {isAr ? 'الأنشطة' : 'Activities'}
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={newActivity}
                        onChange={(e) => setNewActivity(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddActivity())}
                        placeholder={isAr ? 'أضف نشاط...' : 'Add activity...'}
                        className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={handleAddActivity}
                        className="px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold"
                      >
                        ➕
                      </motion.button>
                    </div>
                    <div className="space-y-2">
                      {formData.activities.map((item, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 p-2 rounded-lg border border-blue-200 dark:border-blue-800"
                        >
                          <span className="text-blue-600 dark:text-blue-400">🎯</span>
                          <span className="flex-1 text-gray-700 dark:text-gray-300 text-sm">{item}</span>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            type="button"
                            onClick={() => handleRemoveActivity(index)}
                            className="px-2 py-1 bg-red-500 text-white rounded text-xs"
                          >
                            ✕
                          </motion.button>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Checkboxes */}
                  <div className="grid grid-cols-3 gap-4">
                    <label className="flex items-center gap-2 cursor-pointer p-4 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
                      <input
                        type="checkbox"
                        checked={formData.featured}
                        onChange={(e) => handleFormChange('featured', e.target.checked)}
                        className="w-5 h-5 rounded"
                      />
                      <span className="text-gray-900 dark:text-white font-semibold">
                        ⭐ {isAr ? 'مميز' : 'Featured'}
                      </span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer p-4 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
                      <input
                        type="checkbox"
                        checked={formData.unesco}
                        onChange={(e) => handleFormChange('unesco', e.target.checked)}
                        className="w-5 h-5 rounded"
                      />
                      <span className="text-gray-900 dark:text-white font-semibold">
                        🏛️ UNESCO
                      </span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer p-4 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => handleFormChange('isActive', e.target.checked)}
                        className="w-5 h-5 rounded"
                      />
                      <span className="text-gray-900 dark:text-white font-semibold">
                        ✓ {isAr ? 'نشط' : 'Active'}
                      </span>
                    </label>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-4 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-bold"
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
