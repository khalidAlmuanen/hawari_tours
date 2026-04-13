'use client'

// ═══════════════════════════════════════════════════════════════
// 📅 BOOKINGS MANAGEMENT - Ultra Professional & Modern
// إدارة الحجوزات - تصميم احترافي وعصري جداً
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback } from 'react'
import { useApp } from '@/contexts/AppContext'
import AdminLayout from '@/components/admin/AdminLayout'
import { useToast } from '@/components/admin/Toast'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { exportData } from '@/components/admin'

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

  // Delete Confirmation State
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [bookingToDelete, setBookingToDelete] = useState(null)

  // Filters
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [paymentFilter, setPaymentFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [pagination, setPagination] = useState(null)
  const [stats, setStats] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')

  // Statuses
  const statuses = [
    { value: 'PENDING', label: { ar: 'قيد الانتظار', en: 'Pending' }, color: 'yellow', icon: '⏳' },
    { value: 'CONFIRMED', label: { ar: 'مؤكد', en: 'Confirmed' }, color: 'green', icon: '✅' },
    { value: 'CANCELLED', label: { ar: 'ملغي', en: 'Cancelled' }, color: 'red', icon: '❌' },
    { value: 'COMPLETED', label: { ar: 'مكتمل', en: 'Completed' }, color: 'blue', icon: '🎉' }
  ]

  // Status Labels Lookup
  const statusLabels = statuses.reduce((acc, status) => {
    acc[status.value] = status.label
    return acc
  }, {})

  const paymentStatuses = [
    { value: 'PENDING', label: { ar: 'معلق', en: 'Pending' }, color: 'yellow', icon: '⏳' },
    { value: 'PARTIAL', label: { ar: 'جزئي', en: 'Partial' }, color: 'orange', icon: '💰' },
    { value: 'PAID', label: { ar: 'مدفوع', en: 'Paid' }, color: 'green', icon: '✅' },
    { value: 'REFUNDED', label: { ar: 'مسترد', en: 'Refunded' }, color: 'purple', icon: '↩️' }
  ]

  // Fetch Bookings
  const fetchBookings = useCallback(async () => {
    setLoading(true)
    setErrorMessage('')
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: pageSize,
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
      setErrorMessage(isAr ? 'تعذر تحميل الحجوزات' : 'Failed to load bookings')
      showError(isAr ? 'فشل في جلب البيانات' : 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }, [currentPage, isAr, pageSize, paymentFilter, searchTerm, showError, statusFilter])

  useEffect(() => {
    fetchBookings()
  }, [fetchBookings])

  useEffect(() => {
    setCurrentPage(1)
  }, [pageSize, statusFilter, paymentFilter, searchTerm])

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

  // Handle Cancel (Soft Delete)
  const handleCancel = async (bookingId) => {
    if (!confirm(isAr ? 'هل أنت متأكد من إلغاء هذا الحجز؟' : 'Are you sure you want to cancel this booking?')) return

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

  // Handle Delete (Hard Delete) - Opens Confirmation
  const openDeleteConfirm = (booking) => {
    setBookingToDelete(booking)
    setShowDeleteConfirm(true)
  }

  // Execute Delete
  const handleDeleteExecute = async () => {
    if (!bookingToDelete) return

    try {
      const response = await fetch(`/api/admin/bookings?id=${bookingToDelete.id}&action=delete`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (result.success) {
        fetchBookings()
        setShowDeleteConfirm(false)
        setShowModal(false)
        setBookingToDelete(null)
        success(isAr ? 'تم حذف الحجز نهائياً بنجاح 🗑️' : 'Booking permanently deleted! 🗑️')
      } else {
        // Handle logic error (like existing payments)
        showError(isAr ? (result.error || 'فشل الحذف') : (result.error || 'Failed to delete'))
        if (result.suggestion) info(result.suggestion)
      }
    } catch (error) {
      console.error('Failed to delete booking:', error)
      showError(isAr ? 'فشل في الحذف' : 'Failed to delete')
    }
  }

  // Get Status Badge
  const getStatusBadge = (status, type = 'status') => {
    const statusList = type === 'status' ? statuses : paymentStatuses
    const statusObj = statusList.find(s => s.value === status)
    if (!statusObj) return null

    const colors = {
      yellow: 'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800',
      green: 'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-800',
      red: 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/30 dark:text-rose-300 dark:border-rose-800',
      blue: 'bg-sky-100 text-sky-800 border-sky-200 dark:bg-sky-900/30 dark:text-sky-300 dark:border-sky-800',
      orange: 'bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/30 dark:text-orange-300 dark:border-orange-800',
      purple: 'bg-violet-100 text-violet-800 border-violet-200 dark:bg-violet-900/30 dark:text-violet-300 dark:border-violet-800'
    }

    return (
      <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${colors[statusObj.color]} flex items-center gap-1.5 w-fit`}>
        {statusObj.icon} {statusObj.label[locale]}
      </span>
    )
  }

  const formatCurrency = (value) => new Intl.NumberFormat(isAr ? 'ar' : 'en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0
  }).format(Number(value) || 0)

  const formatDate = (value) => {
    if (!value) return '-'
    return new Date(value).toLocaleDateString(isAr ? 'ar' : 'en-US')
  }

  const handleExport = (format) => {
    if (!bookings.length) {
      showError(isAr ? 'لا توجد بيانات للتصدير' : 'No data to export')
      return
    }
    const data = bookings.map((booking) => ({
      bookingNumber: booking.bookingNumber,
      customerName: booking.customerName,
      customerEmail: booking.customerEmail,
      customerPhone: booking.customerPhone,
      bookingType: booking.bookingType === 'HOTEL' 
        ? (isAr ? 'فندقي' : 'Hotel') 
        : (booking.bookingType === 'CAR' ? (isAr ? 'سيارة' : 'Car') : (isAr ? 'جولة' : 'Tour')),
      itemTitle: booking.bookingType === 'HOTEL'
        ? (locale === 'ar' ? booking.hotel?.nameAr : booking.hotel?.name)
        : (booking.bookingType === 'CAR' 
            ? (locale === 'ar' ? booking.car?.nameAr : booking.car?.name)
            : (locale === 'ar' ? booking.tour?.titleAr : booking.tour?.title)),
      startDate: formatDate(booking.startDate),
      endDate: formatDate(booking.endDate),
      people: booking.numberOfPeople,
      status: statusLabels[booking.status]?.[locale] || booking.status,
      paymentStatus: paymentStatuses.find(s => s.value === booking.paymentStatus)?.label[locale] || booking.paymentStatus,
      totalPrice: booking.totalPrice,
      paidAmount: booking.paidAmount,
      createdAt: formatDate(booking.createdAt)
    }))
    exportData(data, format, `bookings_${new Date().toISOString().slice(0, 10)}`)
    success(isAr ? 'تم تصدير البيانات بنجاح' : 'Data exported successfully')
  }

  return (
    <AdminLayout>
      <div className="space-y-8 min-h-screen">
        {/* Header Section with Glassmorphism */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-indigo-700 p-8 shadow-2xl text-white">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24"><path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2zm-7 5h5v5h-5z" /></svg>
          </div>

          <div className="relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4"
            >
              <div>
                <h1 className="text-4xl font-black mb-2 tracking-tight">
                  {isAr ? 'إدارة الحجوزات الاحترافية' : 'Professional Bookings'}
                </h1>
                <p className="text-indigo-100 text-lg font-light max-w-2xl">
                  {isAr ? 'نظام متكامل لمتابعة الحجوزات، المدفوعات، وحالة العملاء بكل سهولة ويسر.' : 'Comprehensive system to track bookings, payments, and customer status with ease and precision.'}
                </p>
              </div>
            </motion.div>

            {/* KPI Cards inside Header */}
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                {Object.entries(stats).map(([key, value], index) => {
                  const statusObj = statuses.find(s => s.value === key)
                  if (!statusObj) return null

                  return (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-4 hover:bg-white/20 transition-all cursor-pointer group"
                      onClick={() => setStatusFilter(key)}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-2xl drop-shadow-md group-hover:scale-110 transition-transform">{statusObj.icon}</span>
                        <div className="text-right">
                          <p className="text-xs font-medium text-indigo-100 uppercase tracking-wider">{statusObj.label[locale]}</p>
                        </div>
                      </div>
                      <div className="flex flex-col items-end">
                        <p className="text-3xl font-bold">{value.count}</p>
                        <p className="text-xs text-indigo-200 font-mono">${value.revenue?.toLocaleString() || 0}</p>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>
        </div>

        {/* Toolbar & Filters */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 p-2 flex flex-col gap-2"
        >
          <div className="relative flex-1">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </span>
            <input
              type="search"
              placeholder={isAr ? '🔍 بحث سريع...' : '🔍 Quick Search...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full h-12 pl-12 pr-4 bg-transparent outline-none text-gray-700 dark:text-gray-200 placeholder-gray-400 font-medium"
            />
          </div>

          <div className="flex flex-wrap gap-2 p-1">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 px-4 bg-gray-50 dark:bg-gray-700 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-300 border-none focus:ring-2 focus:ring-indigo-500 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <option value="all">{isAr ? '📌 جميع الحالات' : '📌 All Statuses'}</option>
              {statuses.map(status => (
                <option key={status.value} value={status.value}>{status.label[locale]}</option>
              ))}
            </select>

            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="h-10 px-4 bg-gray-50 dark:bg-gray-700 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-300 border-none focus:ring-2 focus:ring-indigo-500 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <option value="all">{isAr ? '💳 جميع المدفوعات' : '💳 All Payments'}</option>
              {paymentStatuses.map(status => (
                <option key={status.value} value={status.value}>{status.label[locale]}</option>
              ))}
            </select>

            <select
              value={pageSize}
              onChange={(e) => setPageSize(Number(e.target.value))}
              className="h-10 px-4 bg-gray-50 dark:bg-gray-700 rounded-xl text-sm font-semibold text-gray-600 dark:text-gray-300 border-none focus:ring-2 focus:ring-indigo-500 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
            >
              <option value={10}>{isAr ? '10 نتائج' : '10 Rows'}</option>
              <option value={20}>{isAr ? '20 نتائج' : '20 Rows'}</option>
              <option value={50}>{isAr ? '50 نتائج' : '50 Rows'}</option>
            </select>

            <button
              onClick={fetchBookings}
              className="h-10 px-4 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors"
            >
              {isAr ? 'تحديث' : 'Refresh'}
            </button>

            <div className="flex gap-2">
              <button
                onClick={() => handleExport('csv')}
                className="h-10 px-4 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors"
              >
                {isAr ? 'CSV تصدير' : 'Export CSV'}
              </button>
              <button
                onClick={() => handleExport('excel')}
                className="h-10 px-4 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors"
              >
                {isAr ? 'Excel تصدير' : 'Export Excel'}
              </button>
              <button
                onClick={() => handleExport('json')}
                className="h-10 px-4 bg-gray-900 text-white rounded-xl text-sm font-semibold hover:bg-gray-800 transition-colors"
              >
                {isAr ? 'JSON تصدير' : 'Export JSON'}
              </button>
            </div>
          </div>
        </motion.div>

        {/* Content Area */}
        <div className="relative min-h-[400px]">
          {errorMessage && (
            <div className="mb-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 rounded-2xl px-4 py-3 flex items-center justify-between">
              <div className="font-semibold">{errorMessage}</div>
              <button
                onClick={fetchBookings}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-sm font-semibold hover:bg-rose-700 transition-colors"
              >
                {isAr ? 'إعادة المحاولة' : 'Retry'}
              </button>
            </div>
          )}
          {loading ? (
            <div className="absolute inset-0 flex items-center justify-center bg-white/50 dark:bg-gray-900/50 backdrop-blur-sm rounded-3xl z-10">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                <p className="text-gray-500 font-medium animate-pulse">{isAr ? 'جاري التحميل...' : 'Loading Bookings...'}</p>
              </div>
            </div>
          ) : null}

          {!loading && bookings.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-20 bg-white dark:bg-gray-800 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700"
            >
              <div className="text-8xl mb-6 opacity-20">📭</div>
              <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">
                {isAr ? 'لا توجد حجوزات مطابقة' : 'No Bookings Found'}
              </h3>
              <p className="text-gray-500 dark:text-gray-400 max-w-sm text-center">
                {isAr ? 'لم يتم العثور على أي حجوزات تطابق معايير البحث الحالية. حاول تغيير الفلاتر.' : 'We couldn\'t find any bookings matching your current filters. Try generating some traffic!'}
              </p>
              <button
                onClick={() => { setSearchTerm(''); setStatusFilter('all'); setPaymentFilter('all') }}
                className="mt-6 px-6 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 rounded-full font-semibold hover:bg-indigo-100 dark:hover:bg-indigo-900/40 transition-colors"
              >
                {isAr ? 'عرض الكل' : 'Clear Filters'}
              </button>
            </motion.div>
          ) : (
            <div className="space-y-4">
              {/* Desktop Table Header - Hidden on Mobile */}
              <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 bg-gray-100 dark:bg-gray-800/50 rounded-xl text-xs font-bold text-gray-500 uppercase tracking-wider">
                <div className="col-span-2">{isAr ? 'العميل' : 'Customer'}</div>
                <div className="col-span-3">{isAr ? 'الجولة' : 'Tour Details'}</div>
                <div className="col-span-2">{isAr ? 'التاريخ' : 'Dates'}</div>
                <div className="col-span-2">{isAr ? 'الحالة' : 'Status'}</div>
                <div className="col-span-2">{isAr ? 'الدفع' : 'Payment'}</div>
                <div className="col-span-1 text-center">{isAr ? 'إجراء' : 'Actions'}</div>
              </div>

              <div className="space-y-3">
                {bookings.map((booking, index) => (
                  <motion.div
                    layoutId={`booking-${booking.id}`}
                    key={booking.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="group relative bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm hover:shadow-md border border-gray-100 dark:border-gray-700 transition-all hover:border-indigo-200 dark:hover:border-indigo-800"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                      {/* Customer */}
                      <div className="col-span-2 flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                          {booking.customerName.charAt(0).toUpperCase()}
                        </div>
                        <div className="overflow-hidden">
                          <h4 className="font-bold text-gray-900 dark:text-gray-100 truncate">{booking.customerName || (isAr ? 'عميل' : 'Customer')}</h4>
                          <p className="text-xs text-gray-500 truncate font-mono">{booking.bookingNumber || '-'}</p>
                        </div>
                      </div>

                      {/* Tour */}
                      <div className="col-span-3">
                        <h3 className="font-semibold text-gray-800 dark:text-gray-200 truncate">
                          {booking.bookingType === 'HOTEL'
                            ? (locale === 'ar' ? booking.hotel?.nameAr : booking.hotel?.name || (isAr ? 'فندق غير محدد' : 'Unknown Hotel'))
                            : booking.bookingType === 'CAR'
                              ? (locale === 'ar' ? booking.car?.nameAr : booking.car?.name || (isAr ? 'سيارة غير محددة' : 'Unknown Car'))
                              : (locale === 'ar' ? booking.tour?.titleAr : booking.tour?.title || (isAr ? 'رحلة غير محددة' : 'Unknown Tour'))}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs px-2 py-0.5 rounded font-bold ${
                            booking.bookingType === 'HOTEL' ? 'bg-emerald-100 text-emerald-700' 
                            : booking.bookingType === 'CAR' ? 'bg-amber-100 text-amber-700'
                            : 'bg-indigo-100 text-indigo-700'
                          }`}>
                            {booking.bookingType === 'HOTEL' ? (isAr ? 'فندقي' : 'Hotel') 
                             : booking.bookingType === 'CAR' ? (isAr ? 'سيارة' : 'Car')
                             : (isAr ? 'جولة' : 'Tour')}
                          </span>
                          <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded text-gray-600 dark:text-gray-300">
                            {booking.numberOfPeople} {isAr ? 'أفراد' : 'Pax'}
                          </span>
                          {booking.bookingType === 'HOTEL' && (
                            <span className="text-xs px-2 py-0.5 bg-emerald-50 text-emerald-700 rounded">
                              {booking.numberOfRooms || 1} {isAr ? 'غرف' : 'Rooms'}
                            </span>
                          )}
                          <span className="text-xs text-gray-400">•</span>
                          <span className="text-xs text-gray-500">
                            {booking.bookingType === 'HOTEL'
                              ? `${Math.max(1, Math.ceil((new Date(booking.endDate) - new Date(booking.startDate)) / (1000 * 60 * 60 * 24)))} ${isAr ? 'ليالٍ' : 'Nights'}`
                              : booking.bookingType === 'CAR'
                                ? `${Math.max(1, Math.ceil((new Date(booking.endDate) - new Date(booking.startDate)) / (1000 * 60 * 60 * 24)))} ${isAr ? 'أيام' : 'Days'}`
                                : `${booking.tour?.duration || 1} ${isAr ? 'أيام' : 'Days'}`}
                          </span>
                        </div>
                      </div>

                      {/* Dates */}
                      <div className="col-span-2 text-sm">
                        <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                          <span className="text-gray-400">📅</span>
                          {formatDate(booking.startDate)}
                        </div>
                        <div className="flex items-center gap-2 text-gray-500 text-xs mt-1">
                          <span className="opacity-0">📅</span>
                          {isAr ? 'إلى' : 'to'} {formatDate(booking.endDate)}
                        </div>
                      </div>

                      {/* Status */}
                      <div className="col-span-2">
                        {getStatusBadge(booking.status, 'status')}
                      </div>

                      {/* Payment */}
                      <div className="col-span-2">
                        <div className="font-bold text-gray-900 dark:text-white">
                          {formatCurrency(booking.totalPrice)}
                        </div>
                        <div className="mt-1">
                          {getStatusBadge(booking.paymentStatus, 'payment')}
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="col-span-1 flex items-center justify-end gap-2 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleView(booking)}
                          className="p-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 dark:bg-indigo-900/30 dark:text-indigo-400 dark:hover:bg-indigo-900/50 transition-colors"
                          title={isAr ? 'عرض التفاصيل' : 'View Details'}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        </button>

                        <button
                          onClick={(e) => { e.stopPropagation(); openDeleteConfirm(booking) }}
                          className="p-2 bg-rose-50 text-rose-600 rounded-lg hover:bg-rose-100 dark:bg-rose-900/30 dark:text-rose-400 dark:hover:bg-rose-900/50 transition-colors"
                          title={isAr ? 'حذف الحجز' : 'Delete Booking'}
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <div className="flex justify-center mt-8">
            <nav className="flex gap-2 p-2 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
              <button
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                {isAr ? 'السابق' : 'Previous'}
              </button>
              {[...Array(pagination.totalPages)].map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentPage(idx + 1)}
                  className={`w-10 h-10 rounded-lg text-sm font-bold transition-all ${currentPage === idx + 1
                    ? 'bg-indigo-600 text-white shadow-md scale-105'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300'
                    }`}
                >
                  {idx + 1}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
                disabled={currentPage === pagination.totalPages}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50"
              >
                {isAr ? 'التالي' : 'Next'}
              </button>
            </nav>
          </div>
        )}

        {/* Details Modal - Ultra Professional Redesign */}
        <AnimatePresence>
          {showModal && selectedBooking && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowModal(false)}
                className="absolute inset-0 bg-gray-900/80 backdrop-blur-md"
              />
              <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="relative w-full max-w-5xl bg-gray-50 dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]"
                onClick={e => e.stopPropagation()}
              >
                {/* 1. Header with Cover Image Background */}
                <div className="relative h-48 shrink-0">
                  {(selectedBooking.bookingType === 'HOTEL' 
                      ? selectedBooking.hotel?.coverImage 
                      : selectedBooking.bookingType === 'CAR' 
                        ? selectedBooking.car?.coverImage 
                        : selectedBooking.tour?.coverImage) ? (
                    <Image
                      src={(selectedBooking.bookingType === 'HOTEL' 
                              ? selectedBooking.hotel?.coverImage 
                              : selectedBooking.bookingType === 'CAR'
                                ? selectedBooking.car?.coverImage
                                : selectedBooking.tour?.coverImage) || '/img/hero/socotra-1.jpg'}
                      alt={selectedBooking.bookingType === 'HOTEL' 
                            ? (selectedBooking.hotel?.name || 'Hotel Cover') 
                            : selectedBooking.bookingType === 'CAR'
                              ? (selectedBooking.car?.name || 'Car Cover')
                              : (selectedBooking.tour?.title || 'Tour Cover')}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1024px) 900px, 100vw"
                      unoptimized
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-r from-indigo-600 to-purple-800" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/60 to-transparent" />

                  <div className="absolute bottom-0 inset-x-0 p-8 flex justify-between items-end">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold border border-white/10">
                          {selectedBooking.bookingNumber}
                        </span>
                        {getStatusBadge(selectedBooking.status, 'status')}
                      </div>
                      <h2 className="text-3xl font-black text-white drop-shadow-md">
                        {selectedBooking.bookingType === 'HOTEL'
                          ? (locale === 'ar' ? selectedBooking.hotel?.nameAr : selectedBooking.hotel?.name || (isAr ? 'فندق غير محدد' : 'Unknown Hotel'))
                          : selectedBooking.bookingType === 'CAR'
                            ? (locale === 'ar' ? selectedBooking.car?.nameAr : selectedBooking.car?.name || (isAr ? 'سيارة غير محددة' : 'Unknown Car'))
                            : (locale === 'ar' ? selectedBooking.tour?.titleAr : selectedBooking.tour?.title || (isAr ? 'رحلة غير محددة' : 'Unknown Tour'))}
                      </h2>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => window.print()}
                        className="p-3 bg-white/10 backdrop-blur-md border border-white/20 text-white rounded-xl hover:bg-white/20 transition-all"
                        title={isAr ? 'طباعة الفاتورة' : 'Print Invoice'}
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
                      </button>
                      <button
                        onClick={() => setShowModal(false)}
                        className="p-3 bg-white text-gray-900 rounded-xl hover:bg-gray-100 transition-all"
                      >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. Main Layout (Sidebar + Content) */}
                <div className="flex flex-col md:flex-row flex-1 overflow-hidden">

                  {/* Left Sidebar (Quick Stats & Customer) */}
                  <div className="w-full md:w-80 bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 p-6 overflow-y-auto z-10">
                    <h3 className="text-xs font-bold uppercase text-gray-400 mb-6 tracking-wider">
                      {isAr ? 'بيانات العميل' : 'CUSTOMER PROFILE'}
                    </h3>

                    <div className="text-center mb-8">
                      <div className="w-24 h-24 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl rotate-3 shadow-xl flex items-center justify-center text-4xl text-white font-black mb-4">
                        {selectedBooking.customerName?.charAt(0) || 'A'}
                      </div>
                      <h3 className="text-xl font-bold dark:text-white">{selectedBooking.customerName || (isAr ? 'عميل' : 'Customer')}</h3>
                      <div className="flex justify-center gap-2 mt-3">
                        <a href={`mailto:${selectedBooking.customerEmail}`} className="p-2 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-lg hover:scale-110 transition-transform">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        </a>
                        <a href={`https://wa.me/${selectedBooking.customerPhone.replace(/[^0-9]/g, '')}`} target="_blank" rel="noopener noreferrer" className="p-2 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-lg hover:scale-110 transition-transform">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                        </a>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(selectedBooking.bookingNumber);
                            success(isAr ? 'تم نسخ رقم الحجز' : 'Booking ID Copied');
                          }}
                          className="p-2 bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-lg hover:scale-110 transition-transform"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                        </button>
                      </div>
                    </div>

                    <div className="space-y-4">
                      <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-100 dark:border-gray-600">
                        <span className="text-xs text-gray-400 block mb-1">{isAr ? 'البريد الإلكتروني' : 'EMAIL'}</span>
                        <p className="font-medium text-sm break-all dark:text-gray-200">{selectedBooking.customerEmail}</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-100 dark:border-gray-600">
                        <span className="text-xs text-gray-400 block mb-1">{isAr ? 'رقم الهاتف' : 'PHONE'}</span>
                        <p className="font-medium text-sm dark:text-gray-200">{selectedBooking.customerPhone}</p>
                      </div>
                      <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-100 dark:border-gray-600">
                        <span className="text-xs text-gray-400 block mb-1">{isAr ? 'عدد المسافرين' : 'TRAVELERS'}</span>
                        <p className="font-medium text-sm dark:text-gray-200 flex items-center gap-2">
                          <span className="text-lg">👥</span>
                          {selectedBooking.numberOfPeople}
                          <span className="text-xs opacity-50">({isAr ? 'أشخاص' : 'People'})</span>
                        </p>
                      </div>
                      {selectedBooking.bookingType === 'HOTEL' && (
                        <div className="bg-gray-50 dark:bg-gray-700/50 p-4 rounded-xl border border-gray-100 dark:border-gray-600">
                          <span className="text-xs text-gray-400 block mb-1">{isAr ? 'عدد الغرف' : 'ROOMS'}</span>
                          <p className="font-medium text-sm dark:text-gray-200 flex items-center gap-2">
                            <span className="text-lg">🛏️</span>
                            {selectedBooking.numberOfRooms || 1}
                            <span className="text-xs opacity-50">({isAr ? 'غرفة' : 'Rooms'})</span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Center Content (Timeline & Details) */}
                  <div className="flex-1 bg-gray-50/50 dark:bg-gray-900 overflow-y-auto p-8 custom-scrollbar">

                    {/* A. Status Timeline */}
                    <div className="mb-10">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                        <span>⏳</span>
                        {isAr ? 'سير الحجز' : 'Booking Timeline'}
                      </h3>
                      <div className="relative flex items-center justify-between w-full max-w-2xl mx-auto">
                        {/* Connecting Line */}
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700 -z-10 -translate-y-1/2 rounded-full" />
                        <div
                          className="absolute top-1/2 left-0 h-1 bg-indigo-500 -z-10 -translate-y-1/2 rounded-full transition-all duration-1000"
                          style={{
                            width: selectedBooking.status === 'COMPLETED' ? '100%' :
                              selectedBooking.status === 'CONFIRMED' ? '50%' : '0%'
                          }}
                        />

                        {/* Steps */}
                        {['PENDING', 'CONFIRMED', 'COMPLETED'].map((step, idx) => {
                          const isActive = ['PENDING', 'CONFIRMED', 'COMPLETED'].indexOf(selectedBooking.status) >= idx;
                          const isCurrent = selectedBooking.status === step;

                          // Handling Cancelled State Separately
                          if (selectedBooking.status === 'CANCELLED') return null;

                          return (
                            <div key={step} className="flex flex-col items-center gap-2 bg-gray-50 dark:bg-gray-900 px-2">
                              <div className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-all duration-500 ${isActive
                                ? 'bg-indigo-600 border-indigo-200 text-white shadow-lg shadow-indigo-200 dark:shadow-none'
                                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-300'
                                }`}>
                                {isActive ? '✓' : idx + 1}
                              </div>
                              <span className={`text-xs font-bold uppercase tracking-wider ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-400'}`}>
                                {statusLabels[step][locale]}
                              </span>
                              {isActive && (
                                <span className="text-[10px] text-gray-400 font-mono">
                                  {formatDate(
                                    step === 'PENDING' ? selectedBooking.createdAt :
                                      step === 'CONFIRMED' ? (selectedBooking.confirmedAt || new Date()) :
                                        (selectedBooking.completedAt || new Date())
                                  )}
                                </span>
                              )}
                            </div>
                          )
                        })}

                        {/* Cancelled Indicator specific */}
                        {selectedBooking.status === 'CANCELLED' && (
                          <div className="flex flex-col items-center gap-2 w-full">
                            <div className="w-12 h-12 bg-red-100 dark:bg-red-900/30 text-red-600 rounded-full flex items-center justify-center text-xl border-4 border-red-200 animate-pulse">
                              ✕
                            </div>
                            <span className="text-red-600 font-bold uppercase">{isAr ? 'تم الإلغاء' : 'CANCELLED'}</span>
                            <span className="text-xs text-gray-400">{formatDate(selectedBooking.cancelledAt || new Date())}</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                      {/* B. Date & Tour Details */}
                      <div className="space-y-6">
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow">
                          <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase mb-4 flex items-center gap-2">
                            <span className="p-1.5 bg-blue-50 text-blue-600 rounded-lg">📅</span>
                            {isAr ? 'الجدول الزمني' : 'Schedule'}
                          </h4>

                        <div className="flex items-center gap-6">
                            <div className="text-center">
                            <div className="text-xs text-gray-400 uppercase mb-1">{isAr ? 'الوصول' : 'Check-In'}</div>
                              <div className="text-xl font-black text-gray-900 dark:text-white">
                                {new Date(selectedBooking.startDate).getDate()}
                              </div>
                              <div className="text-xs font-bold text-gray-500 uppercase">
                                {new Date(selectedBooking.startDate).toLocaleString(isAr ? 'ar' : 'en-US', { month: 'short' })}
                              </div>
                            </div>

                            <div className="flex-1 flex flex-col items-center">
                              <span className="text-xs font-mono text-gray-400 mb-1">
                                {selectedBooking.bookingType === 'HOTEL'
                                  ? `${Math.max(1, Math.ceil((new Date(selectedBooking.endDate) - new Date(selectedBooking.startDate)) / (1000 * 60 * 60 * 24)))} ${isAr ? 'ليالٍ' : 'Nights'}`
                                  : selectedBooking.bookingType === 'CAR'
                                    ? `${Math.max(1, Math.ceil((new Date(selectedBooking.endDate) - new Date(selectedBooking.startDate)) / (1000 * 60 * 60 * 24)))} ${isAr ? 'أيام' : 'Days'}`
                                    : `${selectedBooking.tour?.duration || 1} ${isAr ? 'أيام' : 'Days'}`}
                              </span>
                              <div className="w-full h-0.5 bg-gray-200 dark:bg-gray-700 relative">
                                <div className="absolute top-1/2 left-0 w-2 h-2 bg-gray-400 rounded-full -translate-y-1/2" />
                                <div className="absolute top-1/2 right-0 w-2 h-2 bg-gray-400 rounded-full -translate-y-1/2" />
                              </div>
                            </div>

                            <div className="text-center">
                              <div className="text-xs text-gray-400 uppercase mb-1">{isAr ? 'المغادرة' : 'Check-Out'}</div>
                              <div className="text-xl font-black text-gray-900 dark:text-white">
                                {new Date(selectedBooking.endDate).getDate()}
                              </div>
                              <div className="text-xs font-bold text-gray-500 uppercase">
                                {new Date(selectedBooking.endDate).toLocaleString(isAr ? 'ar' : 'en-US', { month: 'short' })}
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Status Controls */}
                        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
                          <h4 className="text-sm font-bold text-gray-900 dark:text-white uppercase mb-4 flex items-center gap-2">
                            <span className="p-1.5 bg-indigo-50 text-indigo-600 rounded-lg">⚙️</span>
                            {isAr ? 'التحكم بالحالة' : 'Status Operations'}
                          </h4>

                          <div className="space-y-4">
                            <div>
                              <label className="text-xs text-gray-400 uppercase font-bold mb-2 block">{isAr ? 'حالة الحجز' : 'Booking Status'}</label>
                              <div className="flex gap-2 p-1 bg-gray-100 dark:bg-gray-700 rounded-xl overflow-x-auto">
                                {statuses.map(status => (
                          <button
                                    key={status.value}
                                    onClick={() => handleUpdateStatus(selectedBooking.id, status.value)}
                            disabled={updating}
                            className={`flex-1 min-w-[80px] py-2 px-3 rounded-lg text-xs font-bold transition-all ${selectedBooking.status === status.value
                                      ? 'bg-white dark:bg-gray-600 shadow text-indigo-600 dark:text-white'
                                      : 'text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                              } ${updating ? 'opacity-50 cursor-not-allowed' : ''}`}
                                  >
                                    {status.label[locale]}
                                  </button>
                                ))}
                              </div>
                            </div>

                            <div>
                              <label className="text-xs text-gray-400 uppercase font-bold mb-2 block">{isAr ? 'حالة الدفع' : 'Payment Status'}</label>
                              <div className="relative">
                                <select
                                  value={selectedBooking.paymentStatus}
                                  onChange={(e) => handleUpdatePayment(selectedBooking.id, e.target.value)}
                                  disabled={updating}
                                  className="w-full pl-4 pr-10 py-3 bg-gray-50 dark:bg-gray-700/50 border-none rounded-xl font-semibold text-sm focus:ring-2 focus:ring-indigo-500 dark:text-white disabled:opacity-60"
                                >
                                  {paymentStatuses.map(status => (
                                    <option key={status.value} value={status.value}>{status.label[locale]}</option>
                                  ))}
                                </select>
                                <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none">
                                  ▼
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* C. Financials (Receipt Style) */}
                      <div className="bg-white dark:bg-gray-800 rounded-2xl p-0 shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden relative">
                        {/* Receipt Top Pattern */}
                        <div className="bg-gray-100 dark:bg-gray-700 h-4 bg-[url('https://www.transparenttextures.com/patterns/saw-tooth.png')] opacity-50"></div>

                        <div className="p-8">
                          <div className="text-center mb-6">
                            <div className="text-xs text-gray-400 uppercase tracking-widest mb-1">{isAr ? 'الفاتورة' : 'INVOICE'}</div>
                            <div className="text-3xl font-black text-gray-900 dark:text-white">{formatCurrency(selectedBooking.totalPrice)}</div>
                            <div className={`inline-flex items-center gap-1 mt-2 px-3 py-1 rounded-full text-xs font-bold ${selectedBooking.paymentStatus === 'PAID' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                              {getStatusBadge(selectedBooking.paymentStatus, 'payment')?.props.children}
                            </div>
                          </div>

                          <div className="space-y-3 pt-6 border-t border-dashed border-gray-200 dark:border-gray-600">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-500 dark:text-gray-400">
                                {selectedBooking.bookingType === 'HOTEL' 
                                  ? (isAr ? 'سعر الليلة' : 'Nightly Rate') 
                                  : selectedBooking.bookingType === 'CAR'
                                    ? (isAr ? 'سعر اليوم' : 'Daily Rate')
                                    : (isAr ? 'سعر الرحلة' : 'Base Price')}
                              </span>
                              <span className="font-semibold dark:text-gray-200">
                                {selectedBooking.bookingType === 'HOTEL'
                                  ? `${formatCurrency(selectedBooking.hotel?.pricePerNight || 0)} x ${Math.max(1, Math.ceil((new Date(selectedBooking.endDate) - new Date(selectedBooking.startDate)) / (1000 * 60 * 60 * 24)))}`
                                  : selectedBooking.bookingType === 'CAR'
                                    ? `${formatCurrency(selectedBooking.car?.pricePerDay || 0)} x ${Math.max(1, Math.ceil((new Date(selectedBooking.endDate) - new Date(selectedBooking.startDate)) / (1000 * 60 * 60 * 24)))}`
                                    : `${formatCurrency(selectedBooking.tour?.price || 0)} x ${selectedBooking.numberOfPeople}`}
                              </span>
                            </div>
                            <div className="flex justify-between text-sm text-emerald-600 font-medium">
                              <span>{isAr ? 'المدفوع مسبقاً' : 'Paid Amount'}</span>
                              <span>- {formatCurrency(selectedBooking.paidAmount)}</span>
                            </div>
                            {/* Calculated Due */}
                            <div className="flex justify-between text-base font-bold text-gray-900 border-t border-gray-100 dark:border-gray-600 pt-3 mt-3">
                              <span>{isAr ? 'المبلغ المستحق' : 'Amount Due'}</span>
                              <span className={(Number(selectedBooking.totalPrice) - Number(selectedBooking.paidAmount)) > 0 ? 'text-rose-600' : 'text-green-600'}>
                                {formatCurrency(Number(selectedBooking.totalPrice) - Number(selectedBooking.paidAmount))}
                              </span>
                            </div>
                          </div>

                          {/* Barcode Mockup */}
                          <div className="mt-8 pt-6 border-t border-gray-100 dark:border-gray-700 text-center">
                            <div className="font-mono text-[10px] text-gray-400 tracking-[0.5em] mb-2">{selectedBooking.bookingNumber}</div>
                            <div className="h-8 bg-gray-200 dark:bg-gray-700 w-2/3 mx-auto rounded overflow-hidden flex items-center justify-center opacity-30">
                              ||| || ||| || ||| || |||
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Additional Notes */}
                    {selectedBooking.specialRequests && (
                      <div className="mt-8 bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-800/20 rounded-2xl p-6">
                        <h4 className="text-sm font-bold text-amber-800 dark:text-amber-500 uppercase mb-3 flex items-center gap-2">
                          <span>📝</span>
                          {isAr ? 'ملاحظات العميل' : 'Customer Notes'}
                        </h4>
                        <p className="text-amber-900 dark:text-amber-200 text-sm leading-relaxed italic">
                          &ldquo;{selectedBooking.specialRequests}&rdquo;
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {/* 3. Footer Actions */}
                <div className="p-6 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 flex justify-between items-center z-10">
                  <button
                    onClick={() => openDeleteConfirm(selectedBooking)}
                    className="text-rose-500 hover:text-rose-700 text-sm font-bold flex items-center gap-2 px-4 py-2 hover:bg-rose-50 rounded-lg transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                    {isAr ? 'حذف هذا الحجز' : 'Delete Booking'}
                  </button>

                  <div className="flex gap-3">
                    {selectedBooking.status !== 'CANCELLED' && (
                      <button
                        onClick={() => handleCancel(selectedBooking.id)}
                        className="px-6 py-3 rounded-xl font-bold text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-all text-sm"
                      >
                        {isAr ? 'إلغاء' : 'Cancel'}
                      </button>
                    )}
                    <button
                      onClick={() => setShowModal(false)}
                      className="px-8 py-3 rounded-xl font-bold text-white bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-200 dark:shadow-none transition-all text-sm"
                    >
                      {isAr ? 'حفظ وإغلاق' : 'Save & Close'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation Modal */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowDeleteConfirm(false)}
                className="absolute inset-0 bg-gray-900/80 backdrop-blur-md"
              />
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="relative w-full max-w-md bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl text-center"
                onClick={e => e.stopPropagation()}
              >
                <div className="w-20 h-20 bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                  ⚠️
                </div>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
                  {isAr ? 'هل أنت متأكد؟' : 'Are you absolutely sure?'}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 mb-8">
                  {isAr
                    ? 'هذا الإجراء سيقوم بحذف الحجز نهائياً من قاعدة البيانات ولا يمكن التراجع عنه. هل تريد الاستمرار؟'
                    : 'This action will permanently delete the booking from the database. This action cannot be undone. Do you want to proceed?'}
                </p>

                <div className="flex gap-4">
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="flex-1 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
                  >
                    {isAr ? 'تراجع' : 'Cancel'}
                  </button>
                  <button
                    onClick={handleDeleteExecute}
                    className="flex-1 py-3 bg-rose-600 text-white font-bold rounded-xl hover:bg-rose-700 shadow-lg shadow-rose-200 dark:shadow-none transition-colors"
                  >
                    {isAr ? 'نعم، احذف' : 'Yes, Delete'}
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
