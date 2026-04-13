'use client'

import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useApp } from '@/contexts/AppContext'

export default function NotificationBell() {
    const { locale } = useApp()
    const router = useRouter()
    const [notifications, setNotifications] = useState([])
    const [unreadCount, setUnreadCount] = useState(0)
    const [isOpen, setIsOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const dropdownRef = useRef(null)

    const isAr = locale === 'ar'

    // Close dropdown when clicking outside
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    // Poll for notifications
    useEffect(() => {
        fetchNotifications()
        const interval = setInterval(fetchNotifications, 30000) // Poll every 30s
        return () => clearInterval(interval)
    }, [])

    const fetchNotifications = async () => {
        try {
            const url = new URL('/api/admin/notifications', window.location.origin)
            url.searchParams.set('limit', '10')
            const response = await fetch(url.toString(), { credentials: 'include' })
            if (!response.ok) {
                return
            }
            const result = await response.json()
            if (result?.success) {
                setNotifications(result.data.notifications)
                setUnreadCount(result.data.unreadCount)
            }
        } catch {
            setNotifications([])
            setUnreadCount(0)
        }
    }

    const handleMarkAsRead = async (id, link) => {
        try {
            const response = await fetch('/api/admin/notifications', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id }),
                credentials: 'include'
            })
            if (!response.ok) return

            // Update local state
            setNotifications(prev => prev.map(n =>
                n.id === id ? { ...n, isRead: true } : n
            ))
            setUnreadCount(prev => Math.max(0, prev - 1))

            if (link) {
                setIsOpen(false)
                router.push(link)
            }
        } catch (error) {
            console.error('Failed to mark as read:', error)
        }
    }

    const handleMarkAllRead = async () => {
        setLoading(true)
        try {
            const response = await fetch('/api/admin/notifications', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ markAllRead: true }),
                credentials: 'include'
            })
            if (!response.ok) return

            setNotifications(prev => prev.map(n => ({ ...n, isRead: true })))
            setUnreadCount(0)
        } catch {
        } finally {
            setLoading(false)
        }
    }

    const getIcon = (type) => {
        switch (type) {
            case 'BOOKING': return '📅'
            case 'REVIEW': return '⭐'
            case 'MESSAGE': return '💬'
            case 'SYSTEM': return '🔔'
            default: return '📢'
        }
    }

    const getColor = (type) => {
        switch (type) {
            case 'BOOKING': return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
            case 'REVIEW': return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/30 dark:text-yellow-400'
            case 'MESSAGE': return 'bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400'
            default: return 'bg-gray-100 text-gray-600 dark:bg-gray-900/30 dark:text-gray-400'
        }
    }

    return (
        <div className="relative" ref={dropdownRef}>
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all"
            >
                <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                {unreadCount > 0 && (
                    <span className="absolute top-2 right-2 flex h-4 w-4">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 text-[10px] text-white font-bold items-center justify-center">
                            {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                    </span>
                )}
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        className={`absolute ${isAr ? 'left-0' : 'right-0'} mt-2 w-80 md:w-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50`}
                    >
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between bg-gray-50 dark:bg-gray-800/50">
                            <h3 className="font-bold text-gray-900 dark:text-white">
                                {isAr ? 'الإشعارات' : 'Notifications'}
                            </h3>
                            {unreadCount > 0 && (
                                <button
                                    onClick={handleMarkAllRead}
                                    disabled={loading}
                                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline disabled:opacity-50"
                                >
                                    {isAr ? 'تحديد الكل كمقروء' : 'Mark all as read'}
                                </button>
                            )}
                        </div>

                        <div className="max-h-[400px] overflow-y-auto">
                            {notifications.length === 0 ? (
                                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                                    <div className="text-4xl mb-2">🔕</div>
                                    <p>{isAr ? 'لا توجد إشعارات حالياً' : 'No notifications yet'}</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {notifications.map((notification) => (
                                        <div
                                            key={notification.id}
                                            onClick={() => handleMarkAsRead(notification.id, notification.link)}
                                            className={`p-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer relative ${!notification.isRead ? 'bg-blue-50/50 dark:bg-blue-900/10' : ''
                                                }`}
                                        >
                                            <div className="flex gap-3">
                                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0 ${getColor(notification.type)}`}>
                                                    {getIcon(notification.type)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <p className={`text-sm font-semibold truncate ${!notification.isRead ? 'text-gray-900 dark:text-white' : 'text-gray-600 dark:text-gray-300'}`}>
                                                            {notification.title}
                                                        </p>
                                                        <span className="text-xs text-gray-400 whitespace-nowrap">
                                                            {new Date(notification.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                        </span>
                                                    </div>
                                                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                                                        {notification.message}
                                                    </p>
                                                </div>
                                                {!notification.isRead && (
                                                    <div className="w-2 h-2 rounded-full bg-blue-500 mt-2"></div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <div className="p-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                            <Link
                                href="/admin/notifications"
                                className="block w-full py-2 text-center text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 font-medium transition-colors"
                                onClick={() => setIsOpen(false)}
                            >
                                {isAr ? 'عرض كل الإشعارات' : 'View All Notifications'}
                            </Link>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
