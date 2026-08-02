'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/contexts/AppContext'
import AdminLayout from '@/components/admin/AdminLayout'
import { useToast } from '@/components/admin/Toast'

const TYPE_OPTIONS = [
  { value: 'all', labelAr: 'الكل', labelEn: 'All' },
  { value: 'BOOKING', labelAr: 'الحجوزات', labelEn: 'Bookings' },
  { value: 'MESSAGE', labelAr: 'الرسائل', labelEn: 'Messages' },
  { value: 'REVIEW', labelAr: 'المراجعات', labelEn: 'Reviews' },
  { value: 'SYSTEM', labelAr: 'النظام', labelEn: 'System' }
]

const getIcon = (type) => {
  switch (type) {
    case 'BOOKING':
      return '📅'
    case 'REVIEW':
      return '⭐'
    case 'MESSAGE':
      return '💬'
    case 'SYSTEM':
      return '🔔'
    default:
      return '📢'
  }
}

const getColor = (type) => {
  switch (type) {
    case 'BOOKING':
      return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
    case 'REVIEW':
      return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300'
    case 'MESSAGE':
      return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
    case 'SYSTEM':
      return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'
    default:
      return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300'
  }
}

export default function AdminNotificationsPage() {
  const { locale } = useApp()
  const { success, error: showError } = useToast()
  const router = useRouter()
  const isAr = locale === 'ar'

  const [notifications, setNotifications] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [busyId, setBusyId] = useState(null)
  const [markingAll, setMarkingAll] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [unreadOnly, setUnreadOnly] = useState(false)

  const fetchNotifications = useCallback(async () => {
    setLoading(true)
    try {
      const url = new URL('/api/admin/notifications', window.location.origin)
      url.searchParams.set('limit', '200')
      if (unreadOnly) {
        url.searchParams.set('unreadOnly', 'true')
      }
      const response = await fetch(url.toString(), { credentials: 'include' })
      if (!response.ok) {
        throw new Error('Failed to fetch')
      }
      const result = await response.json()
      if (result?.success) {
        setNotifications(result.data.notifications || [])
        setUnreadCount(result.data.unreadCount || 0)
      } else {
        showError(isAr ? 'فشل في جلب البيانات' : 'Failed to fetch data')
      }
    } catch {
      showError(isAr ? 'فشل في جلب الإشعارات' : 'Failed to fetch notifications')
    } finally {
      setLoading(false)
    }
  }, [isAr, showError, unreadOnly])

  useEffect(() => {
    fetchNotifications()
  }, [fetchNotifications])

  const handleMarkAsRead = async (notification) => {
    if (!notification?.id) return
    setBusyId(notification.id)
    try {
      const response = await fetch('/api/admin/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: notification.id }),
        credentials: 'include'
      })
      if (!response.ok) {
        throw new Error('Failed')
      }
      setNotifications((prev) => prev.map((item) => (
        item.id === notification.id ? { ...item, isRead: true } : item
      )))
      setUnreadCount((prev) => Math.max(0, prev - 1))
      if (notification.link) {
        router.push(notification.link)
      }
    } catch {
      showError(isAr ? 'فشل في تحديث الإشعار' : 'Failed to update notification')
    } finally {
      setBusyId(null)
    }
  }

  const handleMarkAllRead = async () => {
    setMarkingAll(true)
    try {
      const response = await fetch('/api/admin/notifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllRead: true }),
        credentials: 'include'
      })
      if (!response.ok) {
        throw new Error('Failed')
      }
      setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })))
      setUnreadCount(0)
      success(isAr ? 'تم تحديث جميع الإشعارات' : 'All notifications updated')
    } catch {
      showError(isAr ? 'فشل في تحديث الإشعارات' : 'Failed to update notifications')
    } finally {
      setMarkingAll(false)
    }
  }

  const filteredNotifications = useMemo(() => {
    const text = searchTerm.trim().toLowerCase()
    return notifications.filter((item) => {
      if (typeFilter !== 'all' && item.type !== typeFilter) return false
      if (text) {
        const haystack = `${item.title || ''} ${item.message || ''}`.toLowerCase()
        if (!haystack.includes(text)) return false
      }
      return true
    })
  }, [notifications, searchTerm, typeFilter])

  const formatDate = useCallback((value) => {
    if (!value) return isAr ? 'غير متوفر' : 'N/A'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return isAr ? 'غير متوفر' : 'N/A'
    return date.toLocaleString(isAr ? 'ar' : 'en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }, [isAr])

  const totalCount = notifications.length

  return (
    <AdminLayout>
      <div className="p-6 space-y-6" dir={isAr ? 'rtl' : 'ltr'}>
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">
              {isAr ? 'الإشعارات' : 'Notifications'}
            </h1>
            <p className="text-sm text-gray-500">
              {isAr ? 'عرض جميع إشعارات النظام والتفاعل معها' : 'Review and manage all system notifications'}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={fetchNotifications}
              className="rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:border-blue-500 hover:text-blue-600"
            >
              {isAr ? 'تحديث' : 'Refresh'}
            </button>
            <button
              type="button"
              onClick={handleMarkAllRead}
              disabled={markingAll || unreadCount === 0}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {markingAll ? (isAr ? 'جارٍ التحديث...' : 'Updating...') : (isAr ? 'تحديد الكل كمقروء' : 'Mark all read')}
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5">
            <div className="text-sm text-gray-500">{isAr ? 'إجمالي الإشعارات' : 'Total Notifications'}</div>
            <div className="text-3xl font-black text-gray-900 dark:text-white mt-2">{totalCount}</div>
          </div>
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5">
            <div className="text-sm text-gray-500">{isAr ? 'غير مقروءة' : 'Unread'}</div>
            <div className="text-3xl font-black text-gray-900 dark:text-white mt-2">{unreadCount}</div>
          </div>
          <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-gradient-to-br from-blue-600 to-indigo-700 p-5 text-white">
            <div className="text-sm text-white/80">{isAr ? 'الحالة' : 'Status'}</div>
            <div className="text-lg font-bold mt-2">
              {unreadCount > 0 ? (isAr ? 'تحتاج مراجعة' : 'Needs review') : (isAr ? 'كل شيء محدث' : 'All caught up')}
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-5 space-y-4">
          <div className="flex flex-wrap gap-3 items-center justify-between">
            <div className="flex flex-wrap gap-3 items-center">
              <div className="relative">
                <input
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                  placeholder={isAr ? 'ابحث في الإشعارات' : 'Search notifications'}
                  className="w-64 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                className="rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm"
                value={typeFilter}
                onChange={(event) => setTypeFilter(event.target.value)}
              >
                {TYPE_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {isAr ? option.labelAr : option.labelEn}
                  </option>
                ))}
              </select>
            </div>
            <label className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
              <input
                type="checkbox"
                checked={unreadOnly}
                onChange={(event) => setUnreadOnly(event.target.checked)}
              />
              {isAr ? 'غير المقروء فقط' : 'Unread only'}
            </label>
          </div>

          {loading ? (
            <div className="py-10 text-center text-gray-500">{isAr ? 'جارٍ التحميل...' : 'Loading...'}</div>
          ) : filteredNotifications.length === 0 ? (
            <div className="py-10 text-center text-gray-500">
              {isAr ? 'لا توجد إشعارات حالياً' : 'No notifications found'}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`rounded-2xl border p-4 transition hover:border-blue-300 dark:hover:border-blue-600 ${notification.isRead ? 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900' : 'border-blue-200 dark:border-blue-900/50 bg-blue-50/40 dark:bg-blue-950/20'}`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center text-xl ${getColor(notification.type)}`}>
                      {getIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2 min-w-0">
                          <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                            {notification.title || (isAr ? 'إشعار' : 'Notification')}
                          </h3>
                          {!notification.isRead && (
                            <span className="inline-flex h-2 w-2 rounded-full bg-blue-600" />
                          )}
                        </div>
                        <span className="text-xs text-gray-400">{formatDate(notification.createdAt)}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                        {notification.message || (isAr ? 'لا يوجد محتوى لهذا الإشعار' : 'No message content')}
                      </p>
                      <div className="mt-3 flex flex-wrap gap-2 items-center">
                        {notification.link && (
                          <button
                            type="button"
                            onClick={() => handleMarkAsRead(notification)}
                            disabled={busyId === notification.id}
                            className="rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                          >
                            {isAr ? 'فتح' : 'Open'}
                          </button>
                        )}
                        {!notification.isRead && (
                          <button
                            type="button"
                            onClick={() => handleMarkAsRead(notification)}
                            disabled={busyId === notification.id}
                            className="rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-1.5 text-xs font-semibold text-gray-700 dark:text-gray-200 hover:border-blue-500 hover:text-blue-600 disabled:opacity-60"
                          >
                            {busyId === notification.id ? (isAr ? 'جارٍ التحديث...' : 'Updating...') : (isAr ? 'تحديد كمقروء' : 'Mark as read')}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  )
}
