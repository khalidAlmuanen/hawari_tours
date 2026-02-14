'use client'

// ═══════════════════════════════════════════════════════════════
// 🧭 PREMIUM LUXURY NAVBAR - Hawarl Tours (FOR SALE READY)
// Ultra modern glass + glow + animated active pill + cards mega menu
// ✅ Fix 1: Mobile drawer now shows mega items (Accordion)
// ✅ Fix 2: Desktop mega menu no longer disappears quickly (hover safe-area + small close delay)
// ✅ Fix 3: Mobile drawer scroll works (proper overflow + height)
// Logout: calls /api/auth/logout + clears storage
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useApp } from '@/contexts/AppContext'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const { locale, toggleLocale, isDark, toggleDarkMode } = useApp()

  const [mounted, setMounted] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

  // Desktop mega
  const [activeMega, setActiveMega] = useState(null)
  const megaCloseTimer = useRef(null)

  // User
  const [user, setUser] = useState(null)
  const [userMenu, setUserMenu] = useState(false)

  // Mobile mega accordion
  const [mobileMegaOpen, setMobileMegaOpen] = useState(null)

  const [isAdminRoute, setIsAdminRoute] = useState(false)

  const userMenuRef = useRef(null)
  const megaRef = useRef(null)

  const normalizePath = useCallback((p) => {
    if (!p) return '/'
    const clean = p.split('?')[0].split('#')[0]
    return clean !== '/' ? clean.replace(/\/+$/, '') : '/'
  }, [])

  const safePathname = useMemo(() => {
    if (!mounted) return null
    return normalizePath(pathname)
  }, [mounted, pathname, normalizePath])

  const isActive = useCallback(
    (href) => safePathname && normalizePath(href) === safePathname,
    [safePathname, normalizePath]
  )

  const checkAuth = useCallback(() => {
    if (typeof window === 'undefined') return
    const storedUser = localStorage.getItem('user')
    const token = localStorage.getItem('auth-token')
    if (storedUser && token) {
      try {
        setUser(JSON.parse(storedUser))
      } catch {
        setUser(null)
        localStorage.removeItem('user')
        localStorage.removeItem('auth-token')
      }
    } else setUser(null)
  }, [])

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!mounted) return
    checkAuth()
    setIsAdminRoute(pathname?.startsWith('/admin') || false)
  }, [mounted, pathname, checkAuth])

  useEffect(() => {
    if (!mounted) return
    const onStorage = (e) => {
      if (e.key === 'user' || e.key === 'auth-token') checkAuth()
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [mounted, checkAuth])

  useEffect(() => {
    if (!mounted) return
    const onScroll = () => setIsScrolled(window.scrollY > 14)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [mounted])

  // Lock body scroll when drawer open
  useEffect(() => {
    if (!mounted) return
    document.body.style.overflow = drawerOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [drawerOpen, mounted])

  // Close menus on route change
  useEffect(() => {
    if (!mounted) return
    setDrawerOpen(false)
    setUserMenu(false)
    setActiveMega(null)
    setMobileMegaOpen(null)
  }, [safePathname, mounted])

  useEffect(() => {
    if (!mounted) return

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        setDrawerOpen(false)
        setUserMenu(false)
        setActiveMega(null)
        setMobileMegaOpen(null)
      }
    }

    const onDown = (e) => {
      const t = e.target
      if (userMenuRef.current && !userMenuRef.current.contains(t)) setUserMenu(false)
      // megaRef contains all mega area (with safe padding)
      if (megaRef.current && !megaRef.current.contains(t)) setActiveMega(null)
    }

    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('mousedown', onDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('mousedown', onDown)
    }
  }, [mounted])

  const handleLogout = useCallback(async () => {
    const msg = locale === 'ar' ? 'هل تريد تسجيل الخروج؟' : 'Are you sure you want to logout?'
    if (!confirm(msg)) return

    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      }).catch(() => null)
    } finally {
      try {
        localStorage.removeItem('auth-token')
        localStorage.removeItem('user')
        localStorage.removeItem('remember-me')
        sessionStorage.clear()
      } catch {}
      setUser(null)
      setUserMenu(false)
      router.push('/admin/logout?next=/')
    }
  }, [locale, router])

  // Desktop mega open/close with delay (prevents flicker)
  const openMega = useCallback((href) => {
    if (megaCloseTimer.current) clearTimeout(megaCloseTimer.current)
    setActiveMega(href)
  }, [])

  const closeMegaSoon = useCallback(() => {
    if (megaCloseTimer.current) clearTimeout(megaCloseTimer.current)
    megaCloseTimer.current = setTimeout(() => setActiveMega(null), 140)
  }, [])

  useEffect(() => {
    return () => {
      if (megaCloseTimer.current) clearTimeout(megaCloseTimer.current)
    }
  }, [])

  const nav = useMemo(
    () => [
      {
        href: '/',
        label: locale === 'ar' ? 'الرئيسية' : 'Home',
        icon: '🏝️',
        desc: locale === 'ar' ? 'اكتشف سقطرى' : 'Discover Socotra',
      },
      {
        href: '/tours',
        label: locale === 'ar' ? 'الرحلات' : 'Tours',
        icon: '✈️',
        desc: locale === 'ar' ? 'برامج فاخرة' : 'Premium packages',
        mega: [
          { href: '/tours', title: locale === 'ar' ? 'كل الرحلات' : 'All Tours', sub: locale === 'ar' ? 'تصفح كل البرامج' : 'Browse all packages', icon: '🗺️' },
          { href: '/destinations', title: locale === 'ar' ? 'المعالم' : 'Destinations', sub: locale === 'ar' ? 'أفضل الأماكن' : 'Top places', icon: '🏖️' },
          { href: '/travel-guide', title: locale === 'ar' ? 'دليل السفر' : 'Travel Guide', sub: locale === 'ar' ? 'نصائح وملفات' : 'Tips & info', icon: '📚' },
          { href: '/contact', title: locale === 'ar' ? 'صمّم رحلتك' : 'Custom Trip', sub: locale === 'ar' ? 'خطة حسب رغبتك' : 'Tailored plan', icon: '✨' },
        ],
      },
      {
        href: '/gallery',
        label: locale === 'ar' ? 'المعرض' : 'Gallery',
        icon: '📸',
        desc: locale === 'ar' ? 'صور ملهمة' : 'Inspiring shots',
      },
      {
        href: '/news',
        label: locale === 'ar' ? 'الأخبار' : 'News',
        icon: '📰',
        desc: locale === 'ar' ? 'آخر المستجدات' : 'Latest updates',
      },
      {
        href: '/about',
        label: locale === 'ar' ? 'عن سقطرى' : 'About',
        icon: '🌴',
        desc: locale === 'ar' ? 'القصة والمكان' : 'Story & place',
        mega: [
          { href: '/about', title: locale === 'ar' ? 'نظرة عامة' : 'Overview', sub: locale === 'ar' ? 'تعرف على سقطرى' : 'Know Socotra', icon: '📖' },
          { href: '/history', title: locale === 'ar' ? 'التاريخ' : 'History', sub: locale === 'ar' ? 'أحداث ومعلومات' : 'Facts & timeline', icon: '🏛️' },
          { href: '/unique-features', title: locale === 'ar' ? 'الميزات' : 'Features', sub: locale === 'ar' ? 'ما يميّز الجزيرة' : 'What makes it unique', icon: '🌟' },
          { href: '/contact', title: locale === 'ar' ? 'تواصل معنا' : 'Talk to us', sub: locale === 'ar' ? 'دعم سريع' : 'Fast support', icon: '💬' },
        ],
      },
      {
        href: '/contact',
        label: locale === 'ar' ? 'اتصل بنا' : 'Contact',
        icon: '📞',
        cta: true,
        desc: locale === 'ar' ? 'حجز سريع' : 'Fast booking',
      },
    ],
    [locale]
  )

  // Hide navbar in /admin
  if (isAdminRoute) return null

  if (!mounted) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50">
        <div className="h-20 bg-black/20 backdrop-blur-xl border-b border-white/10" />
      </div>
    )
  }

  return (
    <>
      {/* Overlay for drawer */}
      {drawerOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm lg:hidden"
          onClick={() => {
            setDrawerOpen(false)
            setMobileMegaOpen(null)
          }}
        />
      )}

      <header className="fixed top-0 left-0 right-0 z-50">
        {/* Glow bar */}
        <div className="pointer-events-none absolute inset-x-0 -top-24 h-56 opacity-80">
          <div className="mx-auto max-w-7xl h-full blur-3xl bg-gradient-to-r from-emerald-500/30 via-cyan-500/25 to-fuchsia-500/25" />
        </div>

        <div className={`mx-auto max-w-7xl px-4 transition-all duration-500 ${isScrolled ? 'pt-3' : 'pt-4'}`}>
          <div
            className={`relative rounded-3xl border shadow-2xl transition-all duration-500 ${
              isScrolled
                ? 'bg-white/85 dark:bg-gray-950/70 border-black/5 dark:border-white/10 backdrop-blur-2xl'
                : 'bg-white/18 dark:bg-gray-950/25 border-white/10 backdrop-blur-2xl'
            }`}
          >
            {/* inner sheen */}
            <div className="pointer-events-none absolute inset-0 rounded-3xl overflow-hidden">
              <div className="absolute -top-24 -left-24 w-72 h-72 bg-white/20 blur-3xl" />
              <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-white/10 blur-3xl" />
            </div>

            <div className="relative h-20 flex items-center justify-between px-4 sm:px-6">
              {/* Brand */}
              <Link href="/" className="flex items-center gap-3 group">
                <div className="relative">
                  <div className="absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-80 transition-opacity bg-gradient-to-br from-emerald-500 to-cyan-500" />
                  <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                    <span className="text-xl">🌍</span>
                  </div>
                </div>

                <div className="hidden sm:block leading-tight">
                  <div className={`text-lg sm:text-xl font-black tracking-tight ${isScrolled ? 'text-gray-900 dark:text-white' : 'text-white'}`}>
                    Hawarl Tours
                  </div>
                  <div className={`${isScrolled ? 'text-gray-600 dark:text-gray-300' : 'text-white/80'} text-xs font-semibold`}>
                    {locale === 'ar' ? 'Socotra • Luxury Travel' : 'Socotra • Luxury Travel'}
                  </div>
                </div>
              </Link>

              {/* Desktop nav (with safe-area wrapper) */}
              <nav className="hidden lg:flex items-center gap-2 relative" ref={megaRef} onMouseLeave={closeMegaSoon}>
                {nav.map((item) => {
                  const active = isActive(item.href)
                  const hasMega = !!item.mega

                  return (
                    <div
                      key={item.href}
                      className="relative"
                      onMouseEnter={() => hasMega && openMega(item.href)}
                    >
                      <Link
                        href={item.href}
                        className={`relative px-4 py-2.5 rounded-2xl font-bold text-sm transition-all duration-300 flex items-center gap-2 ${
                          item.cta
                            ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg hover:shadow-2xl hover:scale-[1.03]'
                            : active
                            ? isScrolled
                              ? 'text-gray-900 dark:text-white'
                              : 'text-white'
                            : isScrolled
                            ? 'text-gray-700 dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/10'
                            : 'text-white/85 hover:bg-white/10'
                        }`}
                      >
                        <span className="text-base">{item.icon}</span>
                        <span>{item.label}</span>

                        {active && !item.cta && (
                          <span className="absolute inset-0 -z-10 rounded-2xl bg-gradient-to-r from-emerald-500/20 via-cyan-500/20 to-fuchsia-500/20 border border-white/10" />
                        )}

                        {hasMega && (
                          <svg className={`w-4 h-4 transition-transform ${activeMega === item.href ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        )}
                      </Link>

                      {/* Mega menu */}
                      {hasMega && activeMega === item.href && (
                        <div
                          className="absolute top-full left-0 mt-3 w-[540px] rounded-3xl border border-white/10 bg-white/90 dark:bg-gray-950/85 backdrop-blur-2xl shadow-2xl overflow-hidden animate-mega"
                          onMouseEnter={() => openMega(item.href)}
                          onMouseLeave={closeMegaSoon}
                        >
                          <div className="p-5">
                            <div className="mb-4">
                              <div className="text-sm font-black text-gray-900 dark:text-white">{item.label}</div>
                              <div className="text-xs text-gray-600 dark:text-gray-300">{item.desc}</div>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                              {item.mega.map((m) => (
                                <Link
                                  key={m.href}
                                  href={m.href}
                                  className="group rounded-2xl border border-black/5 dark:border-white/10 bg-white/70 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 transition-all p-4 hover:shadow-xl"
                                >
                                  <div className="flex items-start gap-3">
                                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500/25 via-cyan-500/20 to-fuchsia-500/20 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                                      {m.icon}
                                    </div>
                                    <div className="min-w-0 flex-1">
                                      <div className="font-black text-gray-900 dark:text-white truncate">{m.title}</div>
                                      <div className="text-xs text-gray-600 dark:text-gray-300 mt-0.5 truncate">{m.sub}</div>
                                    </div>
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-900 dark:text-white">
                                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                      </svg>
                                    </div>
                                  </div>
                                </Link>
                              ))}
                            </div>
                          </div>

                          <div className="px-5 py-4 border-t border-black/5 dark:border-white/10 bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-fuchsia-500/10">
                            <div className="flex items-center justify-between">
                              <div className="text-xs text-gray-700 dark:text-gray-200 font-semibold">
                                {locale === 'ar' ? 'جاهز لرحلة فاخرة؟' : 'Ready for a luxury trip?'}
                              </div>
                              <Link
                                href="/contact"
                                className="text-xs font-black px-4 py-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white hover:shadow-xl transition-all"
                              >
                                {locale === 'ar' ? 'احجز الآن' : 'Book Now'}
                              </Link>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </nav>

              {/* Right actions */}
              <div className="flex items-center gap-2">
                {/* User */}
                {user ? (
                  <div className="hidden lg:block relative" ref={userMenuRef}>
                    <button
                      onClick={() => setUserMenu((v) => !v)}
                      className={`group flex items-center gap-3 px-3 py-2 rounded-2xl border transition-all ${
                        isScrolled
                          ? 'bg-black/5 dark:bg-white/5 border-black/5 dark:border-white/10'
                          : 'bg-white/10 border-white/10'
                      } hover:shadow-xl`}
                    >
                      <div className="relative">
                        <div className="absolute inset-0 rounded-2xl blur-xl opacity-0 group-hover:opacity-80 transition-opacity bg-gradient-to-br from-fuchsia-500/40 to-cyan-500/40" />
                        <div className="relative w-9 h-9 rounded-2xl bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white font-black">
                          {user.name?.charAt(0)?.toUpperCase() || 'A'}
                        </div>
                      </div>
                      <div className="hidden xl:block text-left">
                        <div className={`${isScrolled ? 'text-gray-900 dark:text-white' : 'text-white'} text-sm font-black leading-tight max-w-[130px] truncate`}>
                          {user.name}
                        </div>
                        <div className={`${isScrolled ? 'text-gray-600 dark:text-gray-300' : 'text-white/70'} text-[11px] font-semibold max-w-[130px] truncate`}>
                          {user.role}
                        </div>
                      </div>
                      <svg className={`w-4 h-4 ${isScrolled ? 'text-gray-700 dark:text-gray-200' : 'text-white/80'} transition-transform ${userMenu ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </button>

                    {userMenu && (
                      <div className="absolute right-0 top-full mt-3 w-80 rounded-3xl border border-white/10 bg-white/92 dark:bg-gray-950/85 backdrop-blur-2xl shadow-2xl overflow-hidden animate-mega">
                        <div className="p-5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center font-black text-lg">
                              {user.name?.charAt(0)?.toUpperCase() || 'A'}
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="font-black truncate">{user.name}</div>
                              <div className="text-xs text-purple-100 truncate">{user.email}</div>
                            </div>
                          </div>
                        </div>

                        <div className="p-2">
                          <Link
                            href="/profile"
                            onClick={() => setUserMenu(false)}
                            className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-black/5 dark:hover:bg-white/10 transition-all"
                          >
                            <span className="text-xl">👤</span>
                            <div className="flex-1">
                              <div className="font-black text-gray-900 dark:text-white">{locale === 'ar' ? 'ملفي الشخصي' : 'My Profile'}</div>
                              <div className="text-xs text-gray-600 dark:text-gray-300">{locale === 'ar' ? 'الإعدادات والحجوزات' : 'Settings & bookings'}</div>
                            </div>
                          </Link>

                          {(user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') && (
                            <Link
                              href="/admin"
                              onClick={() => setUserMenu(false)}
                              className="flex items-center gap-3 px-4 py-3 rounded-2xl hover:bg-black/5 dark:hover:bg-white/10 transition-all"
                            >
                              <span className="text-xl">📊</span>
                              <div className="flex-1">
                                <div className="font-black text-gray-900 dark:text-white">{locale === 'ar' ? 'لوحة التحكم' : 'Dashboard'}</div>
                                <div className="text-xs text-gray-600 dark:text-gray-300">{locale === 'ar' ? 'إدارة المحتوى والطلبات' : 'Manage content & bookings'}</div>
                              </div>
                            </Link>
                          )}

                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
                          >
                            <span className="text-xl">⎋</span>
                            <div className="text-left">
                              <div className="font-black">{locale === 'ar' ? 'تسجيل الخروج' : 'Logout'}</div>
                              <div className="text-xs opacity-80">{locale === 'ar' ? 'إنهاء الجلسة بأمان' : 'End session securely'}</div>
                            </div>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    href="/admin/login"
                    className={`hidden lg:flex items-center gap-2 px-4 py-2.5 rounded-2xl font-black transition-all ${
                      isScrolled
                        ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white hover:shadow-2xl'
                        : 'bg-white/10 text-white hover:bg-white/15 border border-white/10'
                    }`}
                  >
                    <span>👑</span>
                    <span>{locale === 'ar' ? 'دخول الأدمن' : 'Admin Login'}</span>
                  </Link>
                )}

                {/* Locale */}
                <button
                  onClick={toggleLocale}
                  className={`hidden sm:flex items-center gap-2 px-3 py-2 rounded-2xl font-black transition-all ${
                    isScrolled ? 'bg-black/5 dark:bg-white/5 text-gray-800 dark:text-gray-100' : 'bg-white/10 text-white'
                  } hover:shadow-xl border border-white/10`}
                  title="Language"
                >
                  <span>🌐</span>
                  <span className="text-xs">{locale === 'ar' ? 'EN' : 'AR'}</span>
                </button>

                {/* Theme */}
                <button
                  onClick={toggleDarkMode}
                  className={`px-3 py-2 rounded-2xl transition-all border border-white/10 ${
                    isScrolled ? 'bg-black/5 dark:bg-white/5' : 'bg-white/10'
                  } hover:shadow-xl`}
                  title="Theme"
                >
                  <span className={`${isScrolled ? 'text-gray-800 dark:text-gray-100' : 'text-white'} text-lg`}>
                    {isDark ? '☀️' : '🌙'}
                  </span>
                </button>

                {/* Mobile burger */}
                <button
                  onClick={() => setDrawerOpen(true)}
                  className={`lg:hidden px-3 py-2 rounded-2xl border border-white/10 transition-all ${
                    isScrolled ? 'bg-black/5 dark:bg-white/5' : 'bg-white/10'
                  } hover:shadow-xl`}
                  aria-label="Open menu"
                >
                  <span className={`${isScrolled ? 'text-gray-800 dark:text-gray-100' : 'text-white'} text-xl`}>☰</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile side drawer */}
      <aside
        className={`lg:hidden fixed top-0 right-0 z-50 h-[100dvh] w-[86%] max-w-sm transition-transform duration-300 ${
          drawerOpen ? 'translate-x-0' : 'translate-x-full'
        } bg-white/92 dark:bg-gray-950/90 backdrop-blur-2xl border-l border-white/10 shadow-2xl flex flex-col`}
        aria-hidden={!drawerOpen}
      >
        <div className="p-5 flex items-center justify-between border-b border-black/5 dark:border-white/10 shrink-0">
          <div className="font-black text-gray-900 dark:text-white">{locale === 'ar' ? 'القائمة' : 'Menu'}</div>
          <button
            onClick={() => {
              setDrawerOpen(false)
              setMobileMegaOpen(null)
            }}
            className="px-3 py-2 rounded-2xl bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-all"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* ✅ SCROLL AREA */}
        <div className="p-4 space-y-2 overflow-y-auto overscroll-contain flex-1">
          {user && (
            <div className="p-4 rounded-3xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white mb-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center font-black text-lg">
                  {user.name?.charAt(0)?.toUpperCase() || 'A'}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-black truncate">{user.name}</div>
                  <div className="text-xs text-purple-100 truncate">{user.email}</div>
                </div>
              </div>

              <div className="mt-3 flex gap-2">
                <Link
                  href="/profile"
                  onClick={() => {
                    setDrawerOpen(false)
                    setMobileMegaOpen(null)
                  }}
                  className="flex-1 text-center px-4 py-2 rounded-2xl bg-white/20 hover:bg-white/30 font-black transition-all"
                >
                  {locale === 'ar' ? 'الملف الشخصي' : 'Profile'}
                </Link>
                {(user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') && (
                  <Link
                    href="/admin"
                    onClick={() => {
                      setDrawerOpen(false)
                      setMobileMegaOpen(null)
                    }}
                    className="flex-1 text-center px-4 py-2 rounded-2xl bg-white/20 hover:bg-white/30 font-black transition-all"
                  >
                    {locale === 'ar' ? 'التحكم' : 'Admin'}
                  </Link>
                )}
                <button
                  onClick={() => {
                    setDrawerOpen(false)
                    setMobileMegaOpen(null)
                    handleLogout()
                  }}
                  className="px-4 py-2 rounded-2xl bg-white/20 hover:bg-white/30 font-black transition-all"
                >
                  ⎋
                </button>
              </div>
            </div>
          )}

          {/* ✅ NAV (with mega accordion) */}
          {nav.map((item) => {
            const hasMega = !!item.mega?.length
            const isOpen = mobileMegaOpen === item.href

            // CTA
            if (item.cta) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    setDrawerOpen(false)
                    setMobileMegaOpen(null)
                  }}
                  className="group flex items-center gap-3 p-4 rounded-3xl border transition-all bg-gradient-to-r from-emerald-500 to-cyan-500 text-white border-white/10 shadow-lg"
                >
                  <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-black text-white">{item.label}</div>
                    <div className="text-xs text-white/80 truncate">{item.desc}</div>
                  </div>
                  <span className="text-white/80">›</span>
                </Link>
              )
            }

            // No mega
            if (!hasMega) {
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => {
                    setDrawerOpen(false)
                    setMobileMegaOpen(null)
                  }}
                  className={`group flex items-center gap-3 p-4 rounded-3xl border transition-all ${
                    isActive(item.href)
                      ? 'bg-black/5 dark:bg-white/10 border-black/5 dark:border-white/10'
                      : 'bg-white/60 dark:bg-white/5 border-black/5 dark:border-white/10 hover:bg-black/5 dark:hover:bg-white/10'
                  }`}
                >
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-cyan-500/15 to-fuchsia-500/15 flex items-center justify-center text-xl group-hover:scale-110 transition-transform">
                    {item.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-black text-gray-900 dark:text-white">{item.label}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-300 truncate">{item.desc}</div>
                  </div>
                  <span className="text-gray-900 dark:text-white opacity-70">›</span>
                </Link>
              )
            }

            // Mega accordion
            return (
              <div
                key={item.href}
                className={`rounded-3xl border transition-all overflow-hidden ${
                  isOpen
                    ? 'bg-white/70 dark:bg-white/7 border-black/5 dark:border-white/10'
                    : 'bg-white/60 dark:bg-white/5 border-black/5 dark:border-white/10'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setMobileMegaOpen(isOpen ? null : item.href)}
                  className="w-full flex items-center gap-3 p-4"
                  aria-expanded={isOpen}
                >
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-cyan-500/15 to-fuchsia-500/15 flex items-center justify-center text-xl transition-transform">
                    {item.icon}
                  </div>

                  <div className="min-w-0 flex-1 text-right">
                    <div className="font-black text-gray-900 dark:text-white">{item.label}</div>
                    <div className="text-xs text-gray-600 dark:text-gray-300 truncate">{item.desc}</div>
                  </div>

                  <span className={`text-gray-700 dark:text-gray-200 transition-transform ${isOpen ? 'rotate-180' : ''}`}>▾</span>
                </button>

                {isOpen && (
                  <div className="px-4 pb-4">
                    <div className="mt-1 grid gap-2">
                      {item.mega.map((m) => (
                        <Link
                          key={m.href}
                          href={m.href}
                          onClick={() => {
                            setDrawerOpen(false)
                            setMobileMegaOpen(null)
                          }}
                          className="group flex items-center gap-3 rounded-2xl border border-black/5 dark:border-white/10 bg-white/70 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 transition-all p-3"
                        >
                          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-cyan-500/15 to-fuchsia-500/15 flex items-center justify-center text-lg group-hover:scale-110 transition-transform">
                            {m.icon}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="font-black text-gray-900 dark:text-white truncate">{m.title}</div>
                            <div className="text-xs text-gray-600 dark:text-gray-300 truncate">{m.sub}</div>
                          </div>
                          <span className="text-gray-400 group-hover:text-emerald-500 transition-colors">›</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )
          })}

          {!user && (
            <Link
              href="/admin/login"
              onClick={() => {
                setDrawerOpen(false)
                setMobileMegaOpen(null)
              }}
              className="mt-2 block text-center px-5 py-4 rounded-3xl font-black text-white bg-gradient-to-r from-purple-600 to-indigo-600 shadow-xl"
            >
              {locale === 'ar' ? 'دخول الأدمن' : 'Admin Login'}
            </Link>
          )}

          <div className="mt-4 grid grid-cols-2 gap-2 pb-4">
            <button
              onClick={toggleLocale}
              className="px-4 py-3 rounded-3xl font-black bg-black/5 dark:bg-white/10 text-gray-900 dark:text-white"
            >
              🌐 {locale === 'ar' ? 'EN' : 'AR'}
            </button>
            <button
              onClick={toggleDarkMode}
              className="px-4 py-3 rounded-3xl font-black bg-black/5 dark:bg-white/10 text-gray-900 dark:text-white"
            >
              {isDark ? '☀️' : '🌙'} {locale === 'ar' ? 'الثيم' : 'Theme'}
            </button>
          </div>
        </div>
      </aside>

      {/* Spacer */}
      <div className="h-24" />

      <style jsx global>{`
        @keyframes mega {
          from { opacity: 0; transform: translateY(-8px) scale(.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-mega { animation: mega .18s ease-out; }
      `}</style>
    </>
  )
}
