'use client'

// ═══════════════════════════════════════════════════════════════
// 🛂 Visa Requirements Management - Full Control
// إدارة متطلبات التأشيرة - تحكم كامل
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react'
import { useApp } from '@/contexts/AppContext'
import { motion, AnimatePresence } from 'framer-motion'

export default function VisaTab() {
  const { locale } = useApp()
  const isAr = locale === 'ar'

  const [requirements, setRequirements] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [formData, setFormData] = useState({
    icon: '',
    itemAr: '',
    itemEn: '',
    order: 0
  })

  // Common icons for visa requirements
  const iconSuggestions = ['📘', '📸', '🏨', '✈️', '🛡️', '💵', '📄', '🎫', '🗓️', '🔖']

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/travel-guide?section=visa')
      const result = await response.json()
      if (result.success) {
        setRequirements(result.data)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setLoading(false)
    }
  }

  const openModal = (item = null) => {
    if (item) {
      setEditing(item)
      setFormData({
        icon: item.icon,
        itemAr: item.itemAr,
        itemEn: item.itemEn,
        order: item.order
      })
    } else {
      setEditing(null)
      setFormData({
        icon: '',
        itemAr: '',
        itemEn: '',
        order: requirements.length + 1
      })
    }
    setShowModal(true)
  }

  const save = async (e) => {
    e.preventDefault()
    try {
      const url = '/api/admin/travel-guide'
      const method = editing ? 'PUT' : 'POST'
      const body = editing
        ? { section: 'visa', id: editing.id, data: formData }
        : { section: 'visa', data: formData }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const result = await response.json()
      if (result.success) {
        alert(isAr ? 'تم الحفظ بنجاح!' : 'Saved successfully!')
        setShowModal(false)
        fetchData()
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const deleteItem = async (id) => {
    if (!confirm(isAr ? 'هل أنت متأكد من الحذف؟' : 'Are you sure?')) return
    try {
      const response = await fetch(`/api/admin/travel-guide?section=visa&id=${id}`, {
        method: 'DELETE'
      })
      const result = await response.json()
      if (result.success) {
        alert(isAr ? 'تم الحذف!' : 'Deleted!')
        fetchData()
      }
    } catch (error) {
      console.error('Error:', error)
    }
  }

  const toggleActive = async (item) => {
    try {
      await fetch('/api/admin/travel-guide', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          section: 'visa',
          id: item.id,
          data: { isActive: !item.isActive }
        })
      })
      fetchData()
    } catch (error) {
      console.error('Error:', error)
    }
  }

  if (loading) {
    return <div className="flex items-center justify-center py-20">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
    </div>
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
            <span className="text-4xl">🛂</span>
            {isAr ? 'متطلبات التأشيرة' : 'Visa Requirements'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            {isAr ? `إجمالي: ${requirements.length} متطلبات` : `Total: ${requirements.length} requirements`}
          </p>
        </div>
        <button
          onClick={() => openModal()}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          {isAr ? 'إضافة متطلب' : 'Add Requirement'}
        </button>
      </div>

      {/* Requirements List */}
      <div className="grid gap-4">
        {requirements.map((req, index) => (
          <motion.div
            key={req.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg border-l-4 border-blue-500 group ${!req.isActive && 'opacity-50'}`}
          >
            <div className="flex items-start gap-4">
              {/* Order */}
              <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center font-bold text-blue-600 dark:text-blue-400">
                {req.order}
              </div>

              {/* Icon */}
              <div className="text-5xl">{req.icon}</div>

              {/* Content */}
              <div className="flex-1">
                <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                  {isAr ? req.itemAr : req.itemEn}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {isAr ? req.itemEn : req.itemAr}
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-all">
                <button
                  onClick={() => toggleActive(req)}
                  className="p-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                >
                  {req.isActive ? '👁️' : '🙈'}
                </button>
                <button
                  onClick={() => openModal(req)}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
                >
                  {isAr ? 'تعديل' : 'Edit'}
                </button>
                <button
                  onClick={() => deleteItem(req.id)}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                  {isAr ? 'حذف' : 'Delete'}
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

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
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full"
            >
              <form onSubmit={save}>
                <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl">
                  <h2 className="text-2xl font-bold">
                    {editing ? (isAr ? 'تعديل المتطلب' : 'Edit Requirement') : (isAr ? 'إضافة متطلب' : 'Add Requirement')}
                  </h2>
                </div>

                <div className="p-6 space-y-6">
                  {/* Icon */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      {isAr ? 'الأيقونة' : 'Icon'}
                    </label>
                    <input
                      type="text"
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      className="w-full px-4 py-3 border rounded-xl text-4xl text-center dark:bg-gray-700 dark:border-gray-600"
                      placeholder="📘"
                      required
                    />
                    <div className="flex gap-2 mt-2 flex-wrap">
                      {iconSuggestions.map(icon => (
                        <button
                          key={icon}
                          type="button"
                          onClick={() => setFormData({ ...formData, icon })}
                          className="text-3xl p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                        >
                          {icon}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Item English */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      {isAr ? 'المتطلب (English)' : 'Requirement (English)'}
                    </label>
                    <input
                      type="text"
                      value={formData.itemEn}
                      onChange={(e) => setFormData({ ...formData, itemEn: e.target.value })}
                      className="w-full px-4 py-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600"
                      placeholder="Valid passport for 6 months"
                      required
                    />
                  </div>

                  {/* Item Arabic */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      {isAr ? 'المتطلب (عربي)' : 'Requirement (Arabic)'}
                    </label>
                    <input
                      type="text"
                      value={formData.itemAr}
                      onChange={(e) => setFormData({ ...formData, itemAr: e.target.value })}
                      className="w-full px-4 py-3 border rounded-xl text-right dark:bg-gray-700 dark:border-gray-600"
                      placeholder="جواز سفر صالح لمدة 6 أشهر"
                      required
                      dir="rtl"
                    />
                  </div>

                  {/* Order */}
                  <div>
                    <label className="block text-sm font-semibold mb-2">
                      {isAr ? 'الترتيب' : 'Order'}
                    </label>
                    <input
                      type="number"
                      value={formData.order}
                      onChange={(e) => setFormData({ ...formData, order: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 border rounded-xl dark:bg-gray-700 dark:border-gray-600"
                      min="0"
                      required
                    />
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-900 p-6 rounded-b-2xl flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 rounded-xl font-bold"
                  >
                    {isAr ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold"
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
