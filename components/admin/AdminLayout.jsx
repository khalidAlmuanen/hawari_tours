'use client'

// 👑 ADMIN LAYOUT - Professional & Modern Design
// تخطيط لوحة التحكم - تصميم احترافي وعصري
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect, useRef } from 'react'
import { useApp } from '@/contexts/AppContext'
import { useAuth } from '@/contexts/AuthContext'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { EnhancedToastProvider } from '@/components/admin/EnhancedToast'
import NotificationBell from '@/components/admin/Notifications/NotificationBell'

export default function AdminLayout({ children }) {
  const { locale, isDark, toggleDarkMode } = useApp()
  const { user, logout, isAuthenticated } = useAuth()
  const isAr = locale === 'ar'
  const pathname = usePathname()
  const router = useRouter()

  const [isDesktopCollapsed, setIsDesktopCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [isMobileOpen, setIsMobileOpen] = useState(false)

  const [showProfileMenu, setShowProfileMenu] = useState(false)
  const [mounted, setMounted] = useState(false)
  const profileMenuRef = useRef(null)

  // Stats State for Badges
  const [stats, setStats] = useState({
    unreadMessages: 0,
    pendingBookings: 0
  })

  useEffect(() => {
    setMounted(true)
    fetchBadgeStats()

    // Handle resize
    const handleResize = () => {
      const width = window.innerWidth
      const mobile = width < 1024

      setIsMobile(prevIsMobile => {
        if (prevIsMobile !== mobile) {
          if (mobile) {
            setIsMobileOpen(false)
          } else {
            setIsMobileOpen(false)
            setIsDesktopCollapsed(false)
          }
          return mobile
        }
        return prevIsMobile
      })
    }

    // Initial check
    handleResize()

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Auto-close sidebar on route change on mobile
  useEffect(() => {
    if (isMobile) {
      setIsMobileOpen(false)
    }
  }, [pathname, isMobile])

  useEffect(() => {
    if (!mounted) return
    document.body.style.overflow = isMobileOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMobileOpen, mounted])

  useEffect(() => {
    if (!mounted) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setIsMobileOpen(false)
        setShowProfileMenu(false)
      }
    }
    const onMouseDown = (e) => {
      if (showProfileMenu && profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setShowProfileMenu(false)
      }
    }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('mousedown', onMouseDown)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('mousedown', onMouseDown)
    }
  }, [mounted, showProfileMenu])

  // Fetch stats for sidebar badges
  const fetchBadgeStats = async () => {
    try {
      const response = await fetch('/api/admin/stats')
      const result = await response.json()
      if (result.success) {
        setStats({
          unreadMessages: result.data.unreadMessages || 0,
          pendingBookings: result.data.pendingBookings || 0
        })
      }
    } catch (error) {
      console.error('Failed to fetch sidebar badge stats:', error)
    }
  }

  // Check authentication
  useEffect(() => {
    if (mounted && !isAuthenticated) {
      router.push('/admin/login')
    }
  }, [isAuthenticated, mounted, router])

  // Menu Items
  const menuItems = [
    {
      id: 'dashboard',
      href: '/admin',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
        </svg>
      ),
      label: { ar: 'لوحة التحكم', en: 'Dashboard' },
      badge: null
    },
    // Management
    {
      id: 'bookings',
      href: '/admin/bookings',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      label: { ar: 'الحجوزات', en: 'Bookings' },
      badge: stats.pendingBookings > 0 ? { count: stats.pendingBookings, color: 'bg-red-500' } : null
    },
    {
      id: 'users',
      href: '/admin/users',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      label: { ar: 'المستخدمين', en: 'Users' },
      badge: null
    },
    {
      id: 'messages',
      href: '/admin/messages',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      label: { ar: 'الرسائل', en: 'Messages' },
      badge: stats.unreadMessages > 0 ? { count: stats.unreadMessages, color: 'bg-blue-500' } : null
    },
    {
      id: 'reviews',
      href: '/admin/reviews',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      label: { ar: 'التقييمات', en: 'Reviews' },
      badge: null
    },
    {
      id: 'contact',
      href: '/admin/contact',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      label: { ar: 'معلومات الاتصال', en: 'Contact Info' },
      badge: null
    },
    // Tours & Destinations
    {
      id: 'tours',
      href: '/admin/tours',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      label: { ar: 'الجولات', en: 'Tours' },
      badge: null
    },
    {
      id: 'hotels',
      href: '/admin/hotels',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12h18M3 7h18M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2zm4-8h2m-2 4h2m4-4h2m-2 4h2" />
        </svg>
      ),
      label: { ar: 'الفنادق', en: 'Hotels' },
      badge: null
    },
    {
      id: 'cars',
      href: '/admin/cars',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
        </svg>
      ),
      label: { ar: 'السيارات', en: 'Cars' },
      badge: null
    },

    {
      id: 'destinations',
      href: '/admin/destinations',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
        </svg>
      ),
      label: { ar: 'المعالم', en: 'Destinations' },
      badge: null
    },
    {
      id: 'travel-guide',
      href: '/admin/travel-guide',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      label: { ar: 'دليل السفر', en: 'Travel Guide' },
      badge: null
    },
    {
      id: 'packages',
      href: '/admin/packages',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      label: { ar: 'الباقات السياحية', en: 'Travel Packages' },
      badge: null
    },
    // Content
    {
      id: 'blog',
      href: '/admin/blog',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
        </svg>
      ),
      label: { ar: 'المدونة', en: 'Blog' },
      badge: null
    },
    {
      id: 'news',
      href: '/admin/news',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
        </svg>
      ),
      label: { ar: 'الأخبار', en: 'News' },
      badge: null
    },
    {
      id: 'reports',
      href: '/admin/reports',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      label: { ar: 'التقارير', en: 'Reports' },
      badge: null
    },
    {
      id: 'testimonials',
      href: '/admin/testimonials',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
        </svg>
      ),
      label: { ar: 'آراء العملاء', en: 'Testimonials' },
      badge: null
    },
    {
      id: 'gallery',
      href: '/admin/gallery',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      label: { ar: 'المعرض', en: 'Gallery' },
      badge: null
    },
    // Company Info
    {
      id: 'about',
      href: '/admin/about',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: { ar: 'من نحن', en: 'About Us' },
      badge: null
    },
    {
      id: 'history',
      href: '/admin/history',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      label: { ar: 'تاريخنا', en: 'Our History' },
      badge: null
    },
    {
      id: 'unique-features',
      href: '/admin/unique-features',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
        </svg>
      ),
      label: { ar: 'مميزاتنا', en: 'Unique Features' },
      badge: null
    },
    // System
    {
      id: 'analytics',
      href: '/admin/analytics',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      label: { ar: 'التحليلات', en: 'Analytics' },
      badge: null
    },
    {
      id: 'settings',
      href: '/admin/settings',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      label: { ar: 'الإعدادات', en: 'Settings' },
      badge: null
    }
  ]

  const handleLogout = () => {
    if (confirm(isAr ? 'هل أنت متأكد من تسجيل الخروج؟' : 'Are you sure you want to logout?')) {
      logout()
      router.push('/admin/login')
    }
  }

  if (!mounted || !isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="relative inline-block">
            <div className="animate-spin rounded-full h-32 w-32 border-8 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl">👑</div>
          </div>
        </div>
      </div>
    )
  }



  return (
    <div className={`min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800 ${isAr ? 'rtl' : 'ltr'}`}>

      {/* Top Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className={`fixed top-0 ${isAr ? 'right-0 left-0' : 'left-0 right-0'} h-20 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-700 shadow-lg z-50`}
      >
        <div className="h-full px-6 flex items-center justify-between">
          <div className="flex items-center gap-6">
            {/* Toggle Sidebar */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                if (isMobile) {
                  setIsMobileOpen(prev => !prev)
                } else {
                  setIsDesktopCollapsed(prev => !prev)
                }
                setShowProfileMenu(false)
              }}
              className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all"
            >
              <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </motion.button>

            {/* Logo */}
            <Link href="/admin" className="flex items-center gap-3 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl blur-lg opacity-50 group-hover:opacity-70 transition-opacity"></div>
                <div className="relative p-3 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl">
                  <span className="text-3xl">👑</span>
                </div>
              </div>
              <div>
                <h1 className="text-2xl font-black text-gray-900 dark:text-white">
                  {isAr ? 'لوحة التحكم' : 'Admin Panel'}
                </h1>
                <p className="text-sm text-gray-600 dark:text-gray-400">Hawari Tours</p>
              </div>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden md:inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-gray-700/70 hover:bg-white dark:hover:bg-gray-700 text-gray-700 dark:text-gray-100 rounded-xl border border-gray-200 dark:border-gray-600 transition-all"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 3h7v7m0-7L10 14m-1 7H3a2 2 0 01-2-2V8a2 2 0 012-2h6" />
              </svg>
              <span className="text-sm font-semibold">{isAr ? 'عرض الموقع' : 'View Site'}</span>
            </Link>
            {/* Search */}
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="hidden md:block"
            >
              <div className="relative">
                <input
                  type="search"
                  placeholder={isAr ? 'بحث سريع...' : 'Quick search...'}
                  className="w-64 px-4 py-2 pr-10 bg-gray-100 dark:bg-gray-700 rounded-xl text-sm text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </motion.div>

            {/* Dark Mode Toggle */}
            <motion.button
              whileHover={{ scale: 1.05, rotate: 180 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleDarkMode}
              className="p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all"
            >
              {isDark ? (
                <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </motion.button>

            {/* Notifications */}
            <div className="relative">
              <NotificationBell />
            </div>

            {/* Profile Dropdown */}
            <div className="relative" ref={profileMenuRef}>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-2xl cursor-pointer transition-all shadow-lg"
              >
                <div className="relative w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white font-bold">
                  {user?.avatar ? (
                    <Image src={user.avatar} alt={user.name} fill className="rounded-xl object-cover" sizes="40px" />
                  ) : (
                    user?.name?.charAt(0) || 'A'
                  )}
                </div>
                <div className="hidden lg:block text-left">
                  <div className="text-sm font-bold text-white">{user?.name || 'Admin'}</div>
                  <div className="text-xs text-white/80">{user?.role || 'Super Admin'}</div>
                </div>
                <svg className={`w-4 h-4 text-white transition-transform ${showProfileMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.button>

              {/* Dropdown Menu */}
              <AnimatePresence>
                {showProfileMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    className="absolute right-0 mt-2 w-56 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden z-50"
                  >
                    <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                      <div className="font-bold text-gray-900 dark:text-white">{user?.name}</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">{user?.email}</div>
                    </div>
                    <div className="p-2">
                      <Link
                        href="/admin/profile"
                        className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                        </svg>
                        <span>{isAr ? 'الملف الشخصي' : 'Profile'}</span>
                      </Link>
                      <Link
                        href="/admin/settings"
                        className="flex items-center gap-3 px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-xl transition-all"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{isAr ? 'الإعدادات' : 'Settings'}</span>
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-all"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                        <span>{isAr ? 'تسجيل الخروج' : 'Logout'}</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* ────────────────────────────────────────────────────────────────────────
          MOBILE SIDEBAR (DRAWER) - MODERN UI
      ──────────────────────────────────────────────────────────────────────── */}
      <AnimatePresence mode="sync">
        {isMobile && isMobileOpen && (
          <>
            <motion.div
              key="mobile-backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => setIsMobileOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
            />

            <motion.aside
              key="mobile-sidebar"
              initial={{ x: isAr ? '100%' : '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: isAr ? '100%' : '-100%' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className={`fixed top-0 bottom-0 ${isAr ? 'right-0' : 'left-0'} w-[280px] bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl border-${isAr ? 'l' : 'r'} border-gray-200 dark:border-gray-800 shadow-2xl z-[70] overflow-hidden flex flex-col lg:hidden`}
            >
              {/* Header */}
              <div className="p-6 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-gray-50/50 dark:bg-gray-800/50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-xl shadow-lg">👑</div>
                  <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">
                    {isAr ? 'لوحة التحكم' : 'Admin Panel'}
                  </span>
                </div>
                <button
                  onClick={() => setIsMobileOpen(false)}
                  className="p-2 hover:bg-white dark:hover:bg-gray-700 rounded-xl shadow-sm text-gray-500 transition-all active:scale-95"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </button>
              </div>

              {/* Menu */}
              <div className="flex-1 overflow-y-auto py-6 px-4 scrollbar-thin">
                <nav className="space-y-1">
                  {menuItems.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
                    return (
                      <Link
                        key={item.id}
                        href={item.href}
                        onClick={() => setIsMobileOpen(false)}
                        className={`relative flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group overflow-hidden ${isActive ? 'text-white shadow-lg shadow-blue-500/25' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                          }`}
                      >
                        {isActive && (
                          <motion.div
                            layoutId="activeTabMobile"
                            className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl"
                            initial={false}
                            transition={{ type: "spring", stiffness: 500, damping: 30 }}
                          />
                        )}
                        <div className="relative z-10 flex items-center gap-4 w-full">
                          <span className={`transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>{item.icon}</span>
                          <span className="font-semibold">{item.label[locale]}</span>
                          {item.badge && (
                            <span className={`ml-auto ${item.badge.color} text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm`}>
                              {item.badge.count}
                            </span>
                          )}
                        </div>
                      </Link>
                    )
                  })}
                </nav>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ────────────────────────────────────────────────────────────────────────
          DESKTOP SIDEBAR (PREMIUM UI)
      ──────────────────────────────────────────────────────────────────────── */}
      {!isMobile && (
        <motion.aside
          initial={false}
          animate={{
            width: isDesktopCollapsed ? 88 : 280,
            x: 0,
            opacity: 1
          }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          className={`fixed top-24 bottom-6 ${isAr ? 'right-6' : 'left-6'} bg-white/90 dark:bg-gray-900/90 backdrop-blur-2xl border border-white/20 dark:border-gray-700/50 shadow-2xl shadow-blue-900/5 rounded-3xl z-40 overflow-hidden hidden lg:flex flex-col`}
        >
          <div className="flex-1 overflow-y-auto py-6 px-3 scrollbar-thin">
            <nav className="space-y-2">
              {menuItems.map((item) => {
                const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href))
                return (
                  <Link
                    key={item.id}
                    href={item.href}
                    className={`relative group flex items-center px-4 py-3 rounded-2xl transition-all duration-300 ${isActive ? 'text-white shadow-lg shadow-blue-500/20 bg-gradient-to-r from-blue-600 to-purple-600' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                      } ${isDesktopCollapsed ? 'justify-center' : ''}`}
                  >
                    {/* Icon */}
                    <div className={`relative z-10 flex-shrink-0 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                      {item.icon}
                    </div>

                    {/* Label */}
                    <AnimatePresence>
                      {!isDesktopCollapsed && (
                        <motion.div
                          initial={{ opacity: 0, width: 0, marginLeft: 0 }}
                          animate={{ opacity: 1, width: 'auto', marginLeft: 12 }}
                          exit={{ opacity: 0, width: 0, marginLeft: 0 }}
                          transition={{ duration: 0.2 }}
                          className="whitespace-nowrap overflow-hidden"
                        >
                          <span className="font-semibold tracking-wide">{item.label[locale]}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Tooltip for Collapsed State */}
                    {isDesktopCollapsed && (
                      <div className={`absolute ${isAr ? 'right-full mr-2' : 'left-full ml-2'} px-3 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50`}>
                        {item.label[locale]}
                      </div>
                    )}
                  </Link>
                )
              })}
            </nav>
          </div>
        </motion.aside>
      )}

      {/* Main Content */}
      <motion.main
        layout
        animate={{
          marginLeft: isMobile ? 0 : (isAr ? 0 : (isDesktopCollapsed ? 80 : 280)),
          marginRight: isMobile ? 0 : (isAr ? (isDesktopCollapsed ? 80 : 280) : 0)
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="pt-20 min-h-screen transition-all"
      >
        <div className="p-4 md:p-8">
          <EnhancedToastProvider>
            {children}
          </EnhancedToastProvider>
        </div>
      </motion.main>

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .scrollbar-thin::-webkit-scrollbar {
          width: 6px;
        }

        .scrollbar-thin::-webkit-scrollbar-track {
          background: transparent;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(156, 163, 175, 0.5);
          border-radius: 3px;
        }

        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(107, 114, 128, 0.7);
        }

        .dark .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(75, 85, 99, 0.5);
        }

        .dark .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(55, 65, 81, 0.7);
        }

        @media (max-width: 1023px) {
          main {
            margin-left: 0 !important;
            margin-right: 0 !important;
          }
        }
      `}</style>
    </div>
  )
}
