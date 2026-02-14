'use client'

// ═══════════════════════════════════════════════════════════════
// 📅 BOOKINGS MANAGEMENT - Ultra Professional & Modern
// إدارة الحجوزات - تصميم احترافي وعصري جداً
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react'
import { useApp } from '@/contexts/AppContext'
import AdminLayout from '@/components/admin/AdminLayout'
import { useToast } from '@/components/admin/Toast'
import { motion, AnimatePresence } from 'framer-motion'

export default function BookingsManagement() {
  const { locale } = useApp()
  const { success, error: showError, info } = useToast()
  const isAr = locale === 'ar'

  // State
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [updating, setUpdating] = useState(false)
  
  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [paymentFilter, setPaymentFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState(null)
  const [stats, setStats] = useState(null)

  // Statuses
  const statuses = [
    { value: 'PENDING', label: { ar: 'قيد الانتظار', en: 'Pending' }, color: 'yellow', icon: '⏳' },
    { value: 'CONFIRMED', label: { ar: 'مؤكد', en: 'Confirmed' }, color: 'green', icon: '✅' },
    { value: 'CANCELLED', label: { ar: 'ملغي', en: 'Cancelled' }, color: 'red', icon: '❌' },
    { value: 'COMPLETED', label: { ar: 'مكتمل', en: 'Completed' }, color: 'blue', icon: '🎉' }
  ]

  const paymentStatuses = [
    { value: 'PENDING', label: { ar: 'معلق', en: 'Pending' }, color: 'yellow', icon: '⏳' },
    { value: 'PARTIAL', label: { ar: 'جزئي', en: 'Partial' }, color: 'orange', icon: '💰' },
    { value: 'PAID', label: { ar: 'مدفوع', en: 'Paid' }, color: 'green', icon: '✅' },
    { value: 'REFUNDED', label: { ar: 'مسترد', en: 'Refunded' }, color: 'purple', icon: '↩️' }
  ]

  // Fetch Bookings
  useEffect(() => {
    fetchBookings()
  }, [searchTerm, statusFilter, paymentFilter, currentPage])

  const fetchBookings = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 10,
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter !== 'all' && { status: statusFilter }),
        ...(paymentFilter !== 'all' && { paymentStatus: paymentFilter })
      })

      const response = await fetch(`/api/admin/bookings?${params}`)
      const result = await response.json()

      if (result.success) {
        setBookings(result.data.bookings)
        setPagination(result.data.pagination)
        setStats(result.data.stats)
      }
    } catch (error) {
      console.error('Failed to fetch bookings:', error)
      showError(isAr ? 'فشل في جلب البيانات' : 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

  // Handle View Details
  const handleView = (booking) => {
    setSelectedBooking(booking)
    setShowModal(true)
  }

  // Handle Update Status
  const handleUpdateStatus = async (bookingId, newStatus) => {
    setUpdating(true)
    try {
      const response = await fetch('/api/admin/bookings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: bookingId, status: newStatus })
      })

      const result = await response.json()
      if (result.success) {
        fetchBookings()
        if (selectedBooking?.id === bookingId) {
          setSelectedBooking(result.data)
        }
        success(isAr ? 'تم تحديث الحالة بنجاح! ✨' : 'Status updated successfully! ✨')
      }
    } catch (error) {
      console.error('Failed to update status:', error)
      showError(isAr ? 'فشل في التحديث' : 'Failed to update')
    } finally {
      setUpdating(false)
    }
  }

  // Handle Update Payment Status
  const handleUpdatePayment = async (bookingId, newPaymentStatus) => {
    setUpdating(true)
    try {
      const response = await fetch('/api/admin/bookings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: bookingId, paymentStatus: newPaymentStatus })
      })

      const result = await response.json()
      if (result.success) {
        fetchBookings()
        if (selectedBooking?.id === bookingId) {
          setSelectedBooking(result.data)
        }
        success(isAr ? 'تم تحديث حالة الدفع بنجاح! 💰' : 'Payment status updated successfully! 💰')
      }
    } catch (error) {
      console.error('Failed to update payment:', error)
      showError(isAr ? 'فشل في التحديث' : 'Failed to update')
    } finally {
      setUpdating(false)
    }
  }

  // Handle Cancel
  const handleCancel = async (bookingId) => {
    try {
      const response = await fetch(`/api/admin/bookings?id=${bookingId}&action=cancel`, {
        method: 'DELETE'
      })

      const result = await response.json()
      if (result.success) {
        fetchBookings()
        setShowModal(false)
        success(isAr ? 'تم إلغاء الحجز بنجاح' : 'Booking cancelled successfully')
      }
    } catch (error) {
      console.error('Failed to cancel booking:', error)
      showError(isAr ? 'فشل في الإلغاء' : 'Failed to cancel')
    }
  }

  // Get Status Badge
  const getStatusBadge = (status, type = 'status') => {
    const statusList = type === 'status' ? statuses : paymentStatuses
    const statusObj = statusList.find(s => s.value === status)
    if (!statusObj) return null

    const colors = {
      yellow: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-200 dark:border-yellow-800',
      green: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800',
      red: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800',
      blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
      orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-400 border-orange-200 dark:border-orange-800',
      purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800'
    }

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${colors[statusObj.color]}`}>
        {statusObj.icon} {statusObj.label[locale]}
      </span>
    )
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
            {isAr ? '📅 إدارة الحجوزات' : '📅 Bookings Management'}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {isAr ? 'إدارة جميع حجوزات العملاء' : 'Manage all customer bookings'}
          </p>
        </motion.div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {Object.entries(stats).map(([key, value], index) => {
              const statusObj = statuses.find(s => s.value === key)
              if (!statusObj) return null

              const gradients = {
                yellow: 'from-yellow-500 to-orange-500',
                green: 'from-green-500 to-emerald-500',
                red: 'from-red-500 to-rose-500',
                blue: 'from-blue-500 to-indigo-500'
              }

              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5, scale: 1.02 }}
                  className={`bg-gradient-to-br ${gradients[statusObj.color]} rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all cursor-pointer`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-semibold opacity-90">
                      {statusObj.label[locale]}
                    </h3>
                    <span className="text-3xl">{statusObj.icon}</span>
                  </div>
                  <div className="text-3xl font-black mb-2">
                    {value.count}
                  </div>
                  <div className="text-sm opacity-90">
                    ${value.revenue?.toLocaleString() || 0}
                  </div>
                </motion.div>
              )
            })}
          </div>
        )}

        {/* Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <input
                type="search"
                placeholder={isAr ? '🔍 بحث برقم الحجز، اسم العميل...' : '🔍 Search by booking #, customer...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pr-12 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">{isAr ? 'جميع الحالات' : 'All Statuses'}</option>
              {statuses.map(status => (
                <option key={status.value} value={status.value}>
                  {status.icon} {status.label[locale]}
                </option>
              ))}
            </select>

            {/* Payment Filter */}
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">{isAr ? 'جميع حالات الدفع' : 'All Payment Status'}</option>
              {paymentStatuses.map(status => (
                <option key={status.value} value={status.value}>
                  {status.icon} {status.label[locale]}
                </option>
              ))}
            </select>
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

        {/* Bookings Table */}
        {!loading && bookings.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase">
                      {isAr ? 'رقم الحجز' : 'Booking #'}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase">
                      {isAr ? 'العميل' : 'Customer'}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase">
                      {isAr ? 'الجولة' : 'Tour'}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase">
                      {isAr ? 'التاريخ' : 'Date'}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase">
                      {isAr ? 'المبلغ' : 'Amount'}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase">
                      {isAr ? 'الحالة' : 'Status'}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase">
                      {isAr ? 'الإجراءات' : 'Actions'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {bookings.map((booking, index) => (
                    <motion.tr
                      key={booking.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-mono text-sm font-bold text-gray-900 dark:text-white">
                          {booking.bookingNumber}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0">
                            {booking.customerName?.charAt(0) || 'U'}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white">
                              {booking.customerName}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {booking.customerEmail}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {locale === 'ar' ? booking.tour?.titleAr : booking.tour?.title}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {booking.numberOfPeople} {isAr ? 'أشخاص' : 'people'} • {booking.tour?.duration}d
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900 dark:text-white">
                          {new Date(booking.startDate).toLocaleDateString(locale)}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {isAr ? 'إلى' : 'to'} {new Date(booking.endDate).toLocaleDateString(locale)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900 dark:text-white">
                          ${booking.totalPrice?.toLocaleString() || 0}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {isAr ? 'مدفوع:' : 'Paid:'} ${booking.paidAmount?.toLocaleString() || 0}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-2">
                          {getStatusBadge(booking.status, 'status')}
                          {getStatusBadge(booking.paymentStatus, 'payment')}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleView(booking)}
                          className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg font-semibold hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all text-sm"
                        >
                          {isAr ? 'عرض' : 'View'}
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && bookings.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-12 text-center shadow-xl"
          >
            <div className="text-6xl mb-4">📅</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {isAr ? 'لا توجد حجوزات' : 'No Bookings Found'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {isAr ? 'جرب تغيير معايير البحث' : 'Try changing filters'}
            </p>
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

        {/* Details Modal */}
        <AnimatePresence>
          {showModal && selectedBooking && (
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
                className="bg-white dark:bg-gray-800 rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              >
                {/* Modal Header */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 flex items-center justify-between z-10 rounded-t-3xl">
                  <div>
                    <h2 className="text-2xl font-black text-white">
                      {isAr ? 'تفاصيل الحجز' : 'Booking Details'}
                    </h2>
                    <p className="text-sm text-white/80 font-mono">
                      {selectedBooking.bookingNumber}
                    </p>
                  </div>
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
                <div className="p-8 space-y-6">
                  {/* Customer Info */}
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <span>👤</span>
                      <span>{isAr ? 'معلومات العميل' : 'Customer Information'}</span>
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          {isAr ? 'الاسم' : 'Name'}
                        </div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {selectedBooking.customerName}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          {isAr ? 'البريد الإلكتروني' : 'Email'}
                        </div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {selectedBooking.customerEmail}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          {isAr ? 'الهاتف' : 'Phone'}
                        </div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {selectedBooking.customerPhone}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          {isAr ? 'عدد الأشخاص' : 'Number of People'}
                        </div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {selectedBooking.numberOfPeople}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tour Info */}
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <span>✈️</span>
                      <span>{isAr ? 'معلومات الجولة' : 'Tour Information'}</span>
                    </h3>
                    <div className="font-bold text-xl text-gray-900 dark:text-white mb-2">
                      {locale === 'ar' ? selectedBooking.tour?.titleAr : selectedBooking.tour?.title}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          {isAr ? 'تاريخ البدء' : 'Start Date'}
                        </div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {new Date(selectedBooking.startDate).toLocaleDateString(locale)}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          {isAr ? 'تاريخ الانتهاء' : 'End Date'}
                        </div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {new Date(selectedBooking.endDate).toLocaleDateString(locale)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Info */}
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <span>💰</span>
                      <span>{isAr ? 'معلومات الدفع' : 'Payment Information'}</span>
                    </h3>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          {isAr ? 'المبلغ الإجمالي' : 'Total Amount'}
                        </div>
                        <div className="text-2xl font-black text-gray-900 dark:text-white">
                          ${selectedBooking.totalPrice?.toLocaleString() || 0}
                        </div>
                      </div>
                      <div>
                        <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                          {isAr ? 'المبلغ المدفوع' : 'Paid Amount'}
                        </div>
                        <div className="text-2xl font-black text-green-600">
                          ${selectedBooking.paidAmount?.toLocaleString() || 0}
                        </div>
                      </div>
                    </div>
                    {selectedBooking.paymentMethod && (
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {isAr ? 'طريقة الدفع:' : 'Payment Method:'} <span className="font-semibold">{selectedBooking.paymentMethod}</span>
                      </div>
                    )}
                  </div>

                  {/* Status Update */}
                  <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <span>⚙️</span>
                      <span>{isAr ? 'تحديث الحالة' : 'Update Status'}</span>
                    </h3>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                          {isAr ? 'حالة الحجز' : 'Booking Status'}
                        </label>
                        <select
                          value={selectedBooking.status}
                          onChange={(e) => handleUpdateStatus(selectedBooking.id, e.target.value)}
                          disabled={updating}
                          className="w-full px-4 py-2 bg-white dark:bg-gray-600 rounded-xl text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {statuses.map(status => (
                            <option key={status.value} value={status.value}>
                              {status.icon} {status.label[locale]}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                          {isAr ? 'حالة الدفع' : 'Payment Status'}
                        </label>
                        <select
                          value={selectedBooking.paymentStatus}
                          onChange={(e) => handleUpdatePayment(selectedBooking.id, e.target.value)}
                          disabled={updating}
                          className="w-full px-4 py-2 bg-white dark:bg-gray-600 rounded-xl text-gray-900 dark:text-white border border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          {paymentStatuses.map(status => (
                            <option key={status.value} value={status.value}>
                              {status.icon} {status.label[locale]}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Special Requests */}
                  {selectedBooking.specialRequests && (
                    <div className="bg-gray-50 dark:bg-gray-700/50 rounded-2xl p-6">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                        <span>📝</span>
                        <span>{isAr ? 'طلبات خاصة' : 'Special Requests'}</span>
                      </h3>
                      <p className="text-gray-700 dark:text-gray-300">
                        {selectedBooking.specialRequests}
                      </p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex gap-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleCancel(selectedBooking.id)}
                      disabled={selectedBooking.status === 'CANCELLED'}
                      className="flex-1 px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isAr ? 'إلغاء الحجز' : 'Cancel Booking'}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setShowModal(false)}
                      className="px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
                    >
                      {isAr ? 'إغلاق' : 'Close'}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  )
}
