'use client'

// ═══════════════════════════════════════════════════════════════
// 📧 MESSAGES MANAGEMENT - Ultra Professional & Modern
// إدارة الرسائل - تصميم احترافي وعصري جداً
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useApp } from '@/contexts/AppContext'
import AdminLayout from '@/components/admin/AdminLayout'
import { useToast } from '@/components/admin/Toast'
import { exportData, EXPORT_FORMATS } from '@/components/admin/ExportImport'
import { motion, AnimatePresence } from 'framer-motion'

const STATUSES = [
  { value: 'UNREAD', label: { ar: 'غير مقروءة', en: 'Unread' }, color: 'blue', icon: '✉️' },
  { value: 'READ', label: { ar: 'مقروءة', en: 'Read' }, color: 'yellow', icon: '📖' },
  { value: 'REPLIED', label: { ar: 'تم الرد', en: 'Replied' }, color: 'green', icon: '✅' },
  { value: 'ARCHIVED', label: { ar: 'مؤرشفة', en: 'Archived' }, color: 'gray', icon: '📦' }
]

const STATUS_STYLES = {
  UNREAD: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  READ: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400',
  REPLIED: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  ARCHIVED: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
}

export default function MessagesManagement() {
  const { locale } = useApp()
  const { success, error: showError } = useToast()
  const isAr = locale === 'ar'

  // State
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState(null)

  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState(null)

  // Modal
  const [selectedMessage, setSelectedMessage] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [reply, setReply] = useState('')
  const [updating, setUpdating] = useState(false)
  const [deleting, setDeleting] = useState(null)
  const [showExportMenu, setShowExportMenu] = useState(false)

  // Fetch Messages
  const fetchMessages = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== 'all' && { status: statusFilter })
      })

      const response = await fetch(`/api/admin/messages?${params}`)
      const result = await response.json()

      if (result.success) {
        setMessages(result.data.messages)
        setPagination(result.data.pagination)
        setStats(result.data.stats)
      }
    } catch (error) {
      console.error('Failed to fetch messages:', error)
      showError(isAr ? 'فشل في جلب البيانات' : 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }, [currentPage, isAr, searchTerm, showError, statusFilter])

  useEffect(() => {
    fetchMessages()
  }, [fetchMessages])

  // Mark as Read
  const handleMarkAsRead = async (messageId) => {
    try {
      const response = await fetch('/api/admin/messages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: messageId, status: 'READ' })
      })

      const result = await response.json()
      if (result.success) {
        fetchMessages()
        success(isAr ? 'تم تحديث الحالة' : 'Status updated')
      }
    } catch (error) {
      showError(isAr ? 'فشل في التحديث' : 'Failed to update')
    }
  }

  // Reply to Message
  const handleReply = async () => {
    if (!reply.trim()) {
      showError(isAr ? 'الرد مطلوب' : 'Reply is required')
      return
    }

    setUpdating(true)
    try {
      const response = await fetch('/api/admin/messages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: selectedMessage.id,
          status: 'REPLIED',
          reply: reply
        })
      })

      const result = await response.json()
      if (result.success) {
        // Open email client so the reply is actually sent to the user
        const subject = encodeURIComponent(`رد على رسالتك: ${selectedMessage.subject}`)
        const body = encodeURIComponent(
          `السلام عليكم ${selectedMessage.name},\n\n${reply}\n\n---\nرسالتك الأصلية:\n${selectedMessage.message}\n\n---\nHawari Tours`
        )
        window.open(`mailto:${selectedMessage.email}?subject=${subject}&body=${body}`, '_blank')

        setShowModal(false)
        setReply('')
        setSelectedMessage(null)
        fetchMessages()
        success(isAr ? 'تم حفظ الرد ✅ وفتح برنامج البريد لإرساله' : 'Reply saved ✅ Email client opened to send it')
      }
    } catch (error) {
      showError(isAr ? 'فشل في إرسال الرد' : 'Failed to send reply')
    } finally {
      setUpdating(false)
    }
  }

  // Open email client directly without saving to DB (quick send)
  const openMailto = (message) => {
    const subject = encodeURIComponent(`رد على رسالتك: ${message.subject}`)
    const greeting = `السلام عليكم ${message.name},\n\n`
    const footer = `\n\n---\nرسالتك الأصلية:\n${message.message}\n\n---\nHawari Tours`
    const body = encodeURIComponent(`${greeting}${footer}`)
    window.open(`mailto:${message.email}?subject=${subject}&body=${body}`, '_blank')
  }

  // Delete Message
  const handleDelete = async (messageId) => {
    if (!confirm(isAr ? 'هل أنت متأكد من حذف هذه الرسالة؟' : 'Are you sure you want to delete this message?')) {
      return
    }

    setDeleting(messageId)
    try {
      const response = await fetch(`/api/admin/messages?id=${messageId}`, {
        method: 'DELETE'
      })

      const result = await response.json()
      if (result.success) {
        fetchMessages()
        success(isAr ? 'تم الحذف بنجاح' : 'Deleted successfully')
      }
    } catch (error) {
      showError(isAr ? 'فشل في الحذف' : 'Failed to delete')
    } finally {
      setDeleting(null)
    }
  }

  // Archive Message
  const handleArchive = async (messageId) => {
    try {
      const response = await fetch('/api/admin/messages', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: messageId, status: 'ARCHIVED' })
      })

      const result = await response.json()
      if (result.success) {
        fetchMessages()
        success(isAr ? 'تم الأرشفة' : 'Archived successfully')
      }
    } catch (error) {
      showError(isAr ? 'فشل في الأرشفة' : 'Failed to archive')
    }
  }

  const formatDate = useCallback((value, options) => {
    if (!value) return isAr ? 'غير متوفر' : 'N/A'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return isAr ? 'غير متوفر' : 'N/A'
    return date.toLocaleString(isAr ? 'ar' : 'en-US', options)
  }, [isAr])

  const exportRows = useMemo(() => {
    return messages.map((message) => ({
      [isAr ? 'المعرف' : 'ID']: message.id,
      [isAr ? 'الاسم' : 'Name']: message.name,
      [isAr ? 'البريد الإلكتروني' : 'Email']: message.email,
      [isAr ? 'الهاتف' : 'Phone']: message.phone || (isAr ? 'غير متوفر' : 'N/A'),
      [isAr ? 'الموضوع' : 'Subject']: message.subject,
      [isAr ? 'الرسالة' : 'Message']: message.message,
      [isAr ? 'الحالة' : 'Status']: STATUSES.find(s => s.value === message.status)?.label[locale] || message.status,
      [isAr ? 'تاريخ الإرسال' : 'Sent At']: formatDate(message.createdAt)
    }))
  }, [messages, isAr, locale, formatDate])

  const handleExport = (format) => {
    exportData(exportRows, format, `messages_export_${new Date().toISOString().slice(0, 10)}`)
    success(isAr ? 'تم تصدير البيانات بنجاح' : 'Data exported successfully')
  }

  return (
    <AdminLayout>
      <div className="p-6">
        {/* Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              📧 {isAr ? 'إدارة الرسائل' : 'Messages Management'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {isAr ? 'إدارة رسائل العملاء والاستفسارات' : 'Manage customer messages and inquiries'}
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchMessages}
              className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center gap-2 shadow-sm"
            >
              🔄 {isAr ? 'تحديث' : 'Refresh'}
            </button>
            <div className="relative">
              <button
                onClick={() => setShowExportMenu((prev) => !prev)}
                disabled={messages.length === 0}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                📤 {isAr ? 'تصدير' : 'Export'}
              </button>
              <AnimatePresence>
                {showExportMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className={`absolute ${isAr ? 'right-0' : 'left-0'} mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden z-20`}
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
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl p-6 text-white shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm mb-1">{isAr ? 'جميع الرسائل' : 'Total Messages'}</p>
                  <p className="text-3xl font-bold">{stats.total}</p>
                </div>
                <div className="text-5xl">📧</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-2xl p-6 text-white shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm mb-1">{isAr ? 'غير مقروءة' : 'Unread'}</p>
                  <p className="text-3xl font-bold">{stats.unread}</p>
                </div>
                <div className="text-5xl">✉️</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl p-6 text-white shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm mb-1">{isAr ? 'تم الرد' : 'Replied'}</p>
                  <p className="text-3xl font-bold">{stats.replied}</p>
                </div>
                <div className="text-5xl">✅</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-gradient-to-r from-gray-500 to-gray-600 rounded-2xl p-6 text-white shadow-lg"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/80 text-sm mb-1">{isAr ? 'مؤرشفة' : 'Archived'}</p>
                  <p className="text-3xl font-bold">{stats.archived}</p>
                </div>
                <div className="text-5xl">📦</div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 mb-6 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Search */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                {isAr ? 'البحث' : 'Search'}
              </label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
                placeholder={isAr ? 'ابحث بالاسم، الإيميل، أو الموضوع...' : 'Search by name, email, or subject...'}
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none dark:bg-gray-700 dark:text-white"
              />
            </div>

            {/* Status Filter */}
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                {isAr ? 'الحالة' : 'Status'}
              </label>
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value)
                  setCurrentPage(1)
                }}
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none dark:bg-gray-700 dark:text-white"
              >
                <option value="all">{isAr ? 'الكل' : 'All'}</option>
                {STATUSES.map(status => (
                  <option key={status.value} value={status.value}>
                    {status.icon} {status.label[locale]}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Messages List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">{isAr ? 'جارِ التحميل...' : 'Loading...'}</p>
          </div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
            <div className="text-6xl mb-4">📭</div>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              {isAr ? 'لا توجد رسائل' : 'No messages found'}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((message, idx) => {
              const statusConfig = STATUSES.find(s => s.value === message.status)

              return (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className={`bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-lg border-2 ${message.status === 'UNREAD'
                    ? 'border-blue-400 dark:border-blue-600'
                    : 'border-transparent'
                    }`}
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    {/* Message Info */}
                    <div className="flex-1">
                      <div className="flex items-start gap-3 mb-3">
                        <div className="text-4xl">{statusConfig?.icon || '📧'}</div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                              {message.name}
                            </h3>
                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${STATUS_STYLES[message.status] || STATUS_STYLES.UNREAD}`}>
                              {statusConfig?.label[locale]}
                            </span>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                            📧 {message.email} {message.phone && `• 📱 ${message.phone}`}
                          </p>
                          <p className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-2">
                            {message.subject}
                          </p>
                          <p className="text-gray-600 dark:text-gray-400">
                            {message.message}
                          </p>
                          {message.reply && (
                            <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border-l-4 border-green-500">
                              <p className="text-sm font-bold text-green-700 dark:text-green-400 mb-1">
                                ✅ {isAr ? 'الرد:' : 'Reply:'}
                              </p>
                              <p className="text-gray-700 dark:text-gray-300">{message.reply}</p>
                            </div>
                          )}
                        </div>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-500">
                        {formatDate(message.createdAt)}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex md:flex-col gap-2">
                      {message.status === 'UNREAD' && (
                        <button
                          onClick={() => handleMarkAsRead(message.id)}
                          className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-xl font-semibold hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all"
                        >
                          {isAr ? 'علّم كمقروء' : 'Mark as Read'}
                        </button>
                      )}

                      {message.status !== 'REPLIED' && (
                        <button
                          onClick={() => {
                            setSelectedMessage(message)
                            setReply('')
                            setShowModal(true)
                          }}
                          className="px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-xl font-semibold hover:bg-green-200 dark:hover:bg-green-900/50 transition-all"
                        >
                          ✏️ {isAr ? 'رد' : 'Reply'}
                        </button>
                      )}

                      {/* Quick direct email button */}
                      <button
                        onClick={() => openMailto(message)}
                        title={message.email}
                        className="px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-xl font-semibold hover:bg-indigo-200 dark:hover:bg-indigo-900/50 transition-all"
                      >
                        📧 {isAr ? 'بريد مباشر' : 'Quick Email'}
                      </button>

                      {message.status !== 'ARCHIVED' && (
                        <button
                          onClick={() => handleArchive(message.id)}
                          className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
                        >
                          {isAr ? 'أرشف' : 'Archive'}
                        </button>
                      )}

                      <button
                        onClick={() => handleDelete(message.id)}
                        disabled={deleting === message.id}
                        className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 rounded-xl font-semibold hover:bg-red-200 dark:hover:bg-red-900/50 transition-all disabled:opacity-50"
                      >
                        {deleting === message.id ? '⏳' : (isAr ? 'حذف' : 'Delete')}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-6">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-xl disabled:opacity-50"
            >
              {isAr ? 'السابق' : 'Previous'}
            </button>
            <span className="px-4 py-2 bg-white dark:bg-gray-800 rounded-xl font-bold">
              {isAr ? `الصفحة ${currentPage} من ${pagination.totalPages}` : `Page ${currentPage} of ${pagination.totalPages}`}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))}
              disabled={currentPage === pagination.totalPages}
              className="px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-xl disabled:opacity-50"
            >
              {isAr ? 'التالي' : 'Next'}
            </button>
          </div>
        )}

        {/* Reply Modal */}
        <AnimatePresence>
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowModal(false)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative bg-white dark:bg-gray-800 rounded-3xl p-8 max-w-2xl w-full shadow-2xl"
              >
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                  ✉️ {isAr ? 'الرد على الرسالة' : 'Reply to Message'}
                </h2>

                {selectedMessage && (
                  <div className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                      {isAr ? 'من:' : 'From:'} <strong>{selectedMessage.name}</strong> ({selectedMessage.email})
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {isAr ? 'الموضوع:' : 'Subject:'} <strong>{selectedMessage.subject}</strong>
                    </p>
                    <p className="text-gray-700 dark:text-gray-300 text-sm">
                      {selectedMessage.message}
                    </p>
                  </div>
                )}

                <textarea
                  value={reply}
                  onChange={(e) => setReply(e.target.value)}
                  placeholder={isAr ? 'اكتب ردك هنا...' : 'Write your reply here...'}
                  rows={6}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none dark:bg-gray-700 dark:text-white resize-none mb-3"
                />

                {/* Info note */}
                <div className="flex items-start gap-2 mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                  <span className="text-blue-500 text-lg mt-0.5">📨</span>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    {isAr
                      ? 'سيتم حفظ الرد وفتح برنامج البريد الإلكتروني تلقائياً لإرسال الرد إلى العميل.'
                      : 'The reply will be saved and your email app will open automatically to deliver it to the customer.'}
                  </p>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleReply}
                    disabled={updating || !reply.trim()}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    <span>📨</span>
                    <span>{updating ? (isAr ? 'جارِ الحفظ...' : 'Saving...') : (isAr ? 'حفظ وإرسال عبر البريد' : 'Save & Send via Email')}</span>
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-xl font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                  >
                    {isAr ? 'إلغاء' : 'Cancel'}
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
