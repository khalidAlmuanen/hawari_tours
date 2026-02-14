'use client'

// ═══════════════════════════════════════════════════════════════
// 💡 Quick Tips Management - Full Control
// إدارة النصائح السريعة - تحكم كامل
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react'
import { useApp } from '@/contexts/AppContext'
import { motion, AnimatePresence } from 'framer-motion'

export default function QuickTipsTab() {
  const { locale, isDark } = useApp()
  const isAr = locale === 'ar'

  const [tips, setTips] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingTip, setEditingTip] = useState(null)
  const [formData, setFormData] = useState({
    icon: '',
    title: '',
    titleAr: '',
    description: '',
    descriptionAr: '',
    gradient: 'from-blue-500 to-cyan-600',
    order: 0
  })

  // Gradients options
  const gradientOptions = [
    { value: 'from-blue-500 to-cyan-600', label: 'Blue → Cyan', preview: 'bg-gradient-to-r from-blue-500 to-cyan-600' },
    { value: 'from-purple-500 to-pink-600', label: 'Purple → Pink', preview: 'bg-gradient-to-r from-purple-500 to-pink-600' },
    { value: 'from-orange-500 to-red-600', label: 'Orange → Red', preview: 'bg-gradient-to-r from-orange-500 to-red-600' },
    { value: 'from-green-500 to-emerald-600', label: 'Green → Emerald', preview: 'bg-gradient-to-r from-green-500 to-emerald-600' },
    { value: 'from-yellow-500 to-orange-600', label: 'Yellow → Orange', preview: 'bg-gradient-to-r from-yellow-500 to-orange-600' },
    { value: 'from-red-500 to-rose-600', label: 'Red → Rose', preview: 'bg-gradient-to-r from-red-500 to-rose-600' }
  ]

  // Fetch tips
  useEffect(() => {
    fetchTips()
  }, [])

  const fetchTips = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/travel-guide?section=quick-tips')
      const result = await response.json()
      
      if (result.success) {
        setTips(result.data)
      }
    } catch (error) {
      console.error('Error fetching tips:', error)
      alert(isAr ? 'فشل في جلب البيانات' : 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  // Open modal for new/edit
  const openModal = (tip = null) => {
    if (tip) {
      setEditingTip(tip)
      setFormData({
        icon: tip.icon,
        title: tip.title,
        titleAr: tip.titleAr,
        description: tip.description,
        descriptionAr: tip.descriptionAr,
        gradient: tip.gradient,
        order: tip.order
      })
    } else {
      setEditingTip(null)
      setFormData({
        icon: '',
        title: '',
        titleAr: '',
        description: '',
        descriptionAr: '',
        gradient: 'from-blue-500 to-cyan-600',
        order: tips.length + 1
      })
    }
    setShowModal(true)
  }

  // Save tip
  const saveTip = async (e) => {
    e.preventDefault()

    try {
      const url = '/api/admin/travel-guide'
      const method = editingTip ? 'PUT' : 'POST'
      const body = editingTip
        ? { section: 'quick-tips', id: editingTip.id, data: formData }
        : { section: 'quick-tips', data: formData }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const result = await response.json()

      if (result.success) {
        alert(isAr ? 'تم الحفظ بنجاح!' : 'Saved successfully!')
        setShowModal(false)
        fetchTips()
      } else {
        alert(result.error || (isAr ? 'فشل الحفظ' : 'Failed to save'))
      }
    } catch (error) {
      console.error('Error saving tip:', error)
      alert(isAr ? 'حدث خطأ' : 'An error occurred')
    }
  }

  // Delete tip
  const deleteTip = async (id) => {
    if (!confirm(isAr ? 'هل أنت متأكد من الحذف؟' : 'Are you sure you want to delete?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/travel-guide?section=quick-tips&id=${id}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (result.success) {
        alert(isAr ? 'تم الحذف بنجاح!' : 'Deleted successfully!')
        fetchTips()
      } else {
        alert(result.error || (isAr ? 'فشل الحذف' : 'Failed to delete'))
      }
    } catch (error) {
      console.error('Error deleting tip:', error)
      alert(isAr ? 'حدث خطأ' : 'An error occurred')
    }
  }

  // Toggle active
  const toggleActive = async (tip) => {
    try {
      const response = await fetch('/api/admin/travel-guide', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: 'quick-tips',
          id: tip.id,
          data: { isActive: !tip.isActive }
        })
      })

      const result = await response.json()

      if (result.success) {
        fetchTips()
      }
    } catch (error) {
      console.error('Error toggling active:', error)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <span className="text-4xl">💡</span>
            {isAr ? 'النصائح السريعة' : 'Quick Tips'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {isAr ? `إجمالي: ${tips.length} نصائح` : `Total: ${tips.length} tips`}
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {isAr ? 'إضافة نصيحة' : 'Add Tip'}
        </button>
      </div>

      {/* Tips Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <AnimatePresence>
          {tips.map((tip, index) => (
            <motion.div
              key={tip.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
              className={`relative bg-gradient-to-br ${tip.gradient} rounded-2xl p-6 text-white shadow-xl group ${!tip.isActive && 'opacity-50'}`}
            >
              {/* Active Toggle */}
              <button
                onClick={() => toggleActive(tip)}
                className="absolute top-3 right-3 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-white/30 transition-all"
              >
                {tip.isActive ? '👁️' : '🙈'}
              </button>

              {/* Order Badge */}
              <div className="absolute top-3 left-3 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center font-bold">
                {tip.order}
              </div>

              {/* Icon */}
              <div className="text-6xl mb-4 mt-8">{tip.icon}</div>

              {/* Title */}
              <h3 className="font-bold text-xl mb-2">
                {isAr ? tip.titleAr : tip.title}
              </h3>

              {/* Description */}
              <p className="text-white/90 text-sm mb-6">
                {isAr ? tip.descriptionAr : tip.description}
              </p>

              {/* Actions */}
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                <button
                  onClick={() => openModal(tip)}
                  className="flex-1 bg-white/20 backdrop-blur-sm hover:bg-white/30 py-2 rounded-lg font-semibold text-sm"
                >
                  {isAr ? 'تعديل' : 'Edit'}
                </button>
                <button
                  onClick={() => deleteTip(tip.id)}
                  className="flex-1 bg-red-500/50 backdrop-blur-sm hover:bg-red-500/70 py-2 rounded-lg font-semibold text-sm"
                >
                  {isAr ? 'حذف' : 'Delete'}
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Empty State */}
      {tips.length === 0 && (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">💡</div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            {isAr ? 'لا توجد نصائح' : 'No tips yet'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            {isAr ? 'ابدأ بإضافة أول نصيحة!' : 'Start by adding your first tip!'}
          </p>
        </div>
      )}

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <form onSubmit={saveTip}>
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-cyan-600 to-blue-600 text-white p-6 rounded-t-2xl">
                  <h2 className="text-2xl font-bold">
                    {editingTip
                      ? (isAr ? 'تعديل النصيحة' : 'Edit Tip')
                      : (isAr ? 'إضافة نصيحة جديدة' : 'Add New Tip')}
                  </h2>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                  {/* Icon */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      {isAr ? 'الأيقونة (Emoji)' : 'Icon (Emoji)'}
                    </label>
                    <input
                      type="text"
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-4xl text-center"
                      placeholder="💡"
                      required
                    />
                  </div>

                  {/* Title English */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      {isAr ? 'العنوان (English)' : 'Title (English)'}
                    </label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="Visa on Arrival"
                      required
                    />
                  </div>

                  {/* Title Arabic */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      {isAr ? 'العنوان (عربي)' : 'Title (Arabic)'}
                    </label>
                    <input
                      type="text"
                      value={formData.titleAr}
                      onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-right"
                      placeholder="تأشيرة عند الوصول"
                      required
                      dir="rtl"
                    />
                  </div>

                  {/* Description English */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      {isAr ? 'الوصف (English)' : 'Description (English)'}
                    </label>
                    <input
                      type="text"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="For most nationalities"
                      required
                    />
                  </div>

                  {/* Description Arabic */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      {isAr ? 'الوصف (عربي)' : 'Description (Arabic)'}
                    </label>
                    <input
                      type="text"
                      value={formData.descriptionAr}
                      onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-right"
                      placeholder="لمعظم الجنسيات"
                      required
                      dir="rtl"
                    />
                  </div>

                  {/* Gradient */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      {isAr ? 'التدرج اللوني' : 'Gradient'}
                    </label>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {gradientOptions.map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => setFormData({ ...formData, gradient: opt.value })}
                          className={`relative h-16 rounded-xl ${opt.preview} ${formData.gradient === opt.value ? 'ring-4 ring-blue-500' : ''}`}
                        >
                          {formData.gradient === opt.value && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-xl">
                              <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Order */}
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                      {isAr ? 'الترتيب' : 'Order'}
                    </label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      min="0"
                      required
                    />
                  </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-900 p-6 rounded-b-2xl flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-bold hover:bg-gray-300 dark:hover:bg-gray-600"
                  >
                    {isAr ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-bold hover:shadow-lg"
                  >
                    {isAr ? 'حفظ' : 'Save'}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
