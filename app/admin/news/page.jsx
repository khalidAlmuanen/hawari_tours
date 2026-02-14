'use client'

// ═══════════════════════════════════════════════════════════════
// 📰 NEWS MANAGEMENT - Ultra Professional & Modern
// إدارة الأخبار - تصميم احترافي وعصري جداً
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react'
import { useApp } from '@/contexts/AppContext'
import AdminLayout from '@/components/admin/AdminLayout'
import { useToast } from '@/components/admin/Toast'
import { motion, AnimatePresence } from 'framer-motion'

export default function NewsManagement() {
  const { locale } = useApp()
  const { success, error: showError, info } = useToast()
  const isAr = locale === 'ar'

  // State
  const [news, setNews] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState('create')
  const [selectedNews, setSelectedNews] = useState(null)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(null)
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [publishedFilter, setPublishedFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState(null)

  // Form Data
  const [formData, setFormData] = useState({
    title: '',
    titleAr: '',
    excerpt: '',
    excerptAr: '',
    content: '',
    contentAr: '',
    coverImage: '',
    images: [],
    category: 'TOURISM',
    tags: [],
    featured: false,
    breaking: false,
    trending: false,
    published: false,
    authorName: 'Admin'
  })

  // Categories matching Schema enum
  const categories = [
    { value: 'TOURISM', label: { ar: 'سياحة', en: 'Tourism' }, icon: '✈️', color: 'from-blue-500 to-cyan-600' },
    { value: 'ENVIRONMENT', label: { ar: 'بيئة', en: 'Environment' }, icon: '🌿', color: 'from-green-500 to-emerald-600' },
    { value: 'WEATHER', label: { ar: 'طقس', en: 'Weather' }, icon: '🌤️', color: 'from-yellow-500 to-orange-600' },
    { value: 'UNESCO', label: { ar: 'يونسكو', en: 'UNESCO' }, icon: '🏛️', color: 'from-indigo-500 to-purple-600' },
    { value: 'CULTURE', label: { ar: 'ثقافة', en: 'Culture' }, icon: '🎭', color: 'from-purple-500 to-pink-600' },
    { value: 'EVENTS', label: { ar: 'فعاليات', en: 'Events' }, icon: '🎉', color: 'from-pink-500 to-rose-600' }
  ]

  // Fetch News
  useEffect(() => {
    fetchNews()
  }, [searchTerm, categoryFilter, publishedFilter, currentPage])

  const fetchNews = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 12,
        ...(searchTerm && { search: searchTerm }),
        ...(categoryFilter !== 'all' && { category: categoryFilter }),
        ...(publishedFilter !== 'all' && { published: publishedFilter })
      })

      const response = await fetch(`/api/admin/news?${params}`)
      const result = await response.json()

      if (result.success) {
        setNews(result.data.news)
        setPagination(result.data.pagination)
      }
    } catch (error) {
      console.error('Failed to fetch news:', error)
      showError(isAr ? 'فشل في جلب البيانات' : 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  // Handle Create
  const handleCreate = () => {
    setModalMode('create')
    setSelectedNews(null)
    setFormData({
      title: '',
      titleAr: '',
      excerpt: '',
      excerptAr: '',
      content: '',
      contentAr: '',
      coverImage: '',
      images: [],
      category: 'TOURISM',
      tags: [],
      featured: false,
      breaking: false,
      trending: false,
      published: false,
      authorName: 'Admin'
    })
    setShowModal(true)
  }

  // Handle Edit
  const handleEdit = (newsItem) => {
    setModalMode('edit')
    setSelectedNews(newsItem)
    setFormData({
      title: newsItem.title,
      titleAr: newsItem.titleAr,
      excerpt: newsItem.excerpt,
      excerptAr: newsItem.excerptAr,
      content: newsItem.content,
      contentAr: newsItem.contentAr,
      coverImage: newsItem.coverImage,
      images: newsItem.images || [],
      category: newsItem.category,
      tags: newsItem.tags || [],
      featured: newsItem.featured,
      breaking: newsItem.breaking,
      trending: newsItem.trending,
      published: newsItem.published,
      authorName: newsItem.authorName || 'Admin'
    })
    setShowModal(true)
  }

  // Handle Save
  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const url = '/api/admin/news'
      const method = modalMode === 'create' ? 'POST' : 'PUT'
      const body = {
        ...formData,
        ...(modalMode === 'edit' && { id: selectedNews.id })
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const result = await response.json()

      if (result.success) {
        setShowModal(false)
        fetchNews()
        success(
          modalMode === 'create'
            ? (isAr ? 'تم إنشاء المقال بنجاح! 🎉' : 'Article created successfully! 🎉')
            : (isAr ? 'تم تحديث المقال بنجاح! ✨' : 'Article updated successfully! ✨')
        )
      } else {
        showError(result.error || (isAr ? 'فشلت العملية' : 'Operation failed'))
      }
    } catch (error) {
      console.error('Failed to save news:', error)
      showError(isAr ? 'فشل في حفظ البيانات' : 'Failed to save data')
    } finally {
      setSaving(false)
    }
  }

  // Handle Delete
  const handleDelete = async (newsId) => {
    setDeleting(newsId)
    try {
      const response = await fetch(`/api/admin/news?id=${newsId}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (result.success) {
        fetchNews()
        success(isAr ? 'تم حذف المقال بنجاح' : 'Article deleted successfully')
      } else {
        showError(result.error || (isAr ? 'فشل في الحذف' : 'Failed to delete'))
      }
    } catch (error) {
      console.error('Failed to delete news:', error)
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

  // Handle Tags
  const [tagInput, setTagInput] = useState('')
  
  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()]
      }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (tag) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(t => t !== tag)
    }))
  }

  const getCategoryGradient = (category) => {
    const cat = categories.find(c => c.value === category)
    const gradients = {
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      cyan: 'from-cyan-500 to-cyan-600',
      purple: 'from-purple-500 to-purple-600',
      pink: 'from-pink-500 to-pink-600',
      orange: 'from-orange-500 to-orange-600'
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
            {isAr ? '📰 إدارة الأخبار' : '📰 News Management'}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {isAr ? 'إدارة جميع الأخبار والمقالات' : 'Manage all news articles and posts'}
          </p>
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
            <div className="relative">
              <input
                type="search"
                placeholder={isAr ? '🔍 بحث في الأخبار...' : '🔍 Search news...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pr-12 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Category Filter */}
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

            {/* Published Filter */}
            <select
              value={publishedFilter}
              onChange={(e) => setPublishedFilter(e.target.value)}
              className="px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">{isAr ? 'الكل' : 'All'}</option>
              <option value="true">✅ {isAr ? 'منشور' : 'Published'}</option>
              <option value="false">📝 {isAr ? 'مسودة' : 'Draft'}</option>
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
              <span>{isAr ? 'مقال جديد' : 'New Article'}</span>
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

        {/* News Grid */}
        {!loading && news.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {news.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all group"
              >
                {/* Image */}
                <div className="relative h-48 overflow-hidden">
                  {item.coverImage ? (
                    <img 
                      src={item.coverImage} 
                      alt={item.title} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${getCategoryGradient(item.category)} flex items-center justify-center`}>
                      <span className="text-6xl">{categories.find(c => c.value === item.category)?.icon || '📰'}</span>
                    </div>
                  )}
                  
                  {/* Badges */}
                  <div className="absolute top-4 right-4 flex flex-col gap-2">
                    {item.featured && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="px-3 py-1 bg-yellow-500 text-white text-xs font-bold rounded-full backdrop-blur-sm"
                      >
                        ⭐ {isAr ? 'مميز' : 'Featured'}
                      </motion.span>
                    )}
                    {item.breaking && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="px-3 py-1 bg-red-500 text-white text-xs font-bold rounded-full backdrop-blur-sm animate-pulse"
                      >
                        🔥 {isAr ? 'عاجل' : 'Breaking'}
                      </motion.span>
                    )}
                    {item.trending && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full backdrop-blur-sm"
                      >
                        📈 {isAr ? 'رائج' : 'Trending'}
                      </motion.span>
                    )}
                    {!item.published && (
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="px-3 py-1 bg-gray-500 text-white text-xs font-bold rounded-full backdrop-blur-sm"
                      >
                        📝 {isAr ? 'مسودة' : 'Draft'}
                      </motion.span>
                    )}
                  </div>

                  {/* Category */}
                  <div className="absolute bottom-4 left-4">
                    <span className={`px-3 py-1 bg-gradient-to-r ${getCategoryGradient(item.category)} text-white text-xs font-semibold rounded-full backdrop-blur-md`}>
                      {categories.find(c => c.value === item.category)?.icon} {categories.find(c => c.value === item.category)?.label[locale]}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                    {locale === 'ar' ? item.titleAr : item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                    {locale === 'ar' ? item.excerptAr : item.excerpt}
                  </p>

                  {/* Tags */}
                  {item.tags && item.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {item.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Stats */}
                  <div className="flex items-center justify-between mb-4 text-sm text-gray-600 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                      <span>{item.viewsCount || 0}</span>
                    </div>
                    <span className="text-xs">
                      {new Date(item.createdAt).toLocaleDateString(locale)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="space-y-2">
                    {/* Row 1: View & Edit */}
                    <div className="flex gap-2">
                      <motion.a
                        href={`/news/${item.slug}`}
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
                        onClick={() => handleEdit(item)}
                        className="flex-1 px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-xl font-semibold hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all"
                      >
                        {isAr ? 'تعديل' : 'Edit'}
                      </motion.button>
                    </div>
                    
                    {/* Row 2: Delete */}
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => handleDelete(item.id)}
                      disabled={deleting === item.id}
                      className="w-full px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-xl font-semibold hover:bg-red-200 dark:hover:bg-red-900/50 transition-all disabled:opacity-50"
                    >
                      {deleting === item.id ? '⏳' : (isAr ? 'حذف' : 'Delete')}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && news.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-12 text-center shadow-xl"
          >
            <div className="text-6xl mb-4">📰</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {isAr ? 'لا توجد أخبار' : 'No News Found'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {isAr ? 'ابدأ بإنشاء مقال جديد' : 'Start by creating a new article'}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreate}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-xl transition-all"
            >
              {isAr ? 'إنشاء مقال جديد' : 'Create New Article'}
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
                      ? (isAr ? '🎉 مقال جديد' : '🎉 New Article')
                      : (isAr ? '✏️ تعديل المقال' : '✏️ Edit Article')
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
                  {/* Title */}
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
                      />
                    </div>
                  </div>

                  {/* Excerpt */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                        {isAr ? 'المقتطف (English)' : 'Excerpt (English)'} *
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={formData.excerpt}
                        onChange={(e) => handleFormChange('excerpt', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                        {isAr ? 'المقتطف (العربي)' : 'Excerpt (Arabic)'} *
                      </label>
                      <textarea
                        required
                        rows={3}
                        value={formData.excerptAr}
                        onChange={(e) => handleFormChange('excerptAr', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        dir="rtl"
                      />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                        {isAr ? 'المحتوى (English)' : 'Content (English)'} *
                      </label>
                      <textarea
                        required
                        rows={8}
                        value={formData.content}
                        onChange={(e) => handleFormChange('content', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                        {isAr ? 'المحتوى (العربي)' : 'Content (Arabic)'} *
                      </label>
                      <textarea
                        required
                        rows={8}
                        value={formData.contentAr}
                        onChange={(e) => handleFormChange('contentAr', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        dir="rtl"
                      />
                    </div>
                  </div>

                  {/* Cover Image & Category */}
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
                  </div>

                  {/* Tags */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                      {isAr ? 'الوسوم' : 'Tags'}
                    </label>
                    <div className="flex gap-2 mb-2">
                      <input
                        type="text"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                        placeholder={isAr ? 'أضف وسم...' : 'Add tag...'}
                        className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="button"
                        onClick={handleAddTag}
                        className="px-4 py-2 bg-blue-600 text-white rounded-xl font-semibold"
                      >
                        {isAr ? 'إضافة' : 'Add'}
                      </motion.button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {formData.tags.map((tag, index) => (
                        <motion.span
                          key={index}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                          className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full flex items-center gap-2"
                        >
                          #{tag}
                          <motion.button
                            whileHover={{ scale: 1.2, rotate: 90 }}
                            type="button"
                            onClick={() => handleRemoveTag(tag)}
                            className="text-red-500 hover:text-red-700"
                          >
                            ×
                          </motion.button>
                        </motion.span>
                      ))}
                    </div>
                  </div>

                  {/* Checkboxes */}
                  <div className="grid grid-cols-2 gap-4">
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
                        checked={formData.breaking}
                        onChange={(e) => handleFormChange('breaking', e.target.checked)}
                        className="w-5 h-5 rounded"
                      />
                      <span className="text-gray-900 dark:text-white font-semibold">
                        🔥 {isAr ? 'عاجل' : 'Breaking'}
                      </span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer p-4 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
                      <input
                        type="checkbox"
                        checked={formData.trending}
                        onChange={(e) => handleFormChange('trending', e.target.checked)}
                        className="w-5 h-5 rounded"
                      />
                      <span className="text-gray-900 dark:text-white font-semibold">
                        📈 {isAr ? 'رائج' : 'Trending'}
                      </span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer p-4 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
                      <input
                        type="checkbox"
                        checked={formData.published}
                        onChange={(e) => handleFormChange('published', e.target.checked)}
                        className="w-5 h-5 rounded"
                      />
                      <span className="text-gray-900 dark:text-white font-semibold">
                        ✅ {isAr ? 'منشور' : 'Published'}
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
