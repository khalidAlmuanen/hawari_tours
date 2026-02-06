'use client'

// ═══════════════════════════════════════════════════════════════════════
// 🧭 Ultra-Modern Professional Navbar - Hawari Tours
// تصميم احترافي جداً وعصري ومبهر
// ═══════════════════════════════════════════════════════════════════════

import { useState, useEffect, useMemo, useCallback } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useApp } from '@/contexts/AppContext'

export default function Navbar() {
  const pathname = usePathname()
  const { t, locale, toggleLocale, isDark, toggleDarkMode } = useApp()

  const [mounted, setMounted] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [activeMegaMenu, setActiveMegaMenu] = useState(null)

  // تطبيع المسار
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
    (href) => {
      if (!safePathname) return false
      return safePathname === normalizePath(href)
    },
    [safePathname, normalizePath]
  )

  // تتبع scroll
  useEffect(() => {
    setMounted(true)

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Navigation structure with mega menu
  const navStructure = useMemo(
    () => [
      { 
        href: '/', 
        label: locale === 'ar' ? 'الرئيسية' : 'Home',
        icon: '🏠'
      },
      { 
        href: '/about', 
        label: locale === 'ar' ? 'عن سقطرى' : 'About Socotra',
        icon: '🌴',
        megaMenu: [
          { href: '/about', label: locale === 'ar' ? 'نظرة عامة' : 'Overview', icon: '📖' },
          { href: '/history', label: locale === 'ar' ? 'التاريخ' : 'History', icon: '🏛️' },
          { href: '/unique-features', label: locale === 'ar' ? 'الميزات الفريدة' : 'Unique Features', icon: '🌟' },
        ]
      },
      { 
        href: '/tours', 
        label: locale === 'ar' ? 'الرحلات' : 'Tours',
        icon: '✈️',
        megaMenu: [
          { href: '/tours', label: locale === 'ar' ? 'جميع الرحلات' : 'All Tours', icon: '🗺️' },
          { href: '/travel-guide', label: locale === 'ar' ? 'دليل السفر' : 'Travel Guide', icon: '📚' },
        ]
      },
      { 
        href: '/gallery', 
        label: locale === 'ar' ? 'المعرض' : 'Gallery',
        icon: '📸',
        megaMenu: [
          { href: '/gallery', label: locale === 'ar' ? 'معرض الصور' : 'Photo Gallery', icon: '🖼️' },
          { href: '/blog', label: locale === 'ar' ? 'المدونة' : 'Blog', icon: '📝' },
          { href: '/news', label: locale === 'ar' ? 'الأخبار' : 'News', icon: '📰' },
        ]
      },
      { 
        href: '/reports', 
        label: locale === 'ar' ? 'التقارير' : 'Reports',
        icon: '📊'
      },
      { 
        href: '/testimonials', 
        label: locale === 'ar' ? 'آراء العملاء' : 'Testimonials',
        icon: '⭐'
      },
      { 
        href: '/contact', 
        label: locale === 'ar' ? 'اتصل بنا' : 'Contact',
        icon: '📞',
        highlight: true
      }
    ],
    [locale]
  )

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl shadow-2xl border-b border-gray-200/50 dark:border-gray-700/50'
            : 'bg-gradient-to-b from-black/30 to-transparent backdrop-blur-sm'
        }`}
      >
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between h-20">
            {/* ═══════════════════════════════════════════════════════
                Logo - Enhanced with animations
                ═══════════════════════════════════════════════════════ */}
            <Link href="/" className="flex items-center gap-3 group relative z-10">
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl blur-lg opacity-0 group-hover:opacity-70 transition-opacity duration-500"></div>
                
                {/* Logo container */}
                <div className="relative w-14 h-14 bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center shadow-xl group-hover:shadow-2xl transition-all transform group-hover:scale-110 group-hover:rotate-6">
                  <svg className="w-8 h-8 text-white transform group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>

              <div className="hidden sm:block">
                <h1 className={`text-2xl font-bold transition-all ${
                  isScrolled 
                    ? 'bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent'
                    : 'text-white drop-shadow-lg'
                }`}>
                  Hawari Tours
                </h1>
                <p className={`text-xs font-medium transition-all ${
                  isScrolled 
                    ? 'text-gray-600 dark:text-gray-400'
                    : 'text-white/90 drop-shadow'
                }`}>
                  {locale === 'ar' ? '✨ جنة سقطرى' : '✨ Socotra Paradise'}
                </p>
              </div>
            </Link>

            {/* ═══════════════════════════════════════════════════════
                Desktop Menu with Mega Menu
                ═══════════════════════════════════════════════════════ */}
            <div className="hidden lg:flex items-center gap-1">
              {navStructure.map((link) => (
                <div
                  key={link.href}
                  className="relative group"
                  onMouseEnter={() => link.megaMenu && setActiveMegaMenu(link.href)}
                  onMouseLeave={() => setActiveMegaMenu(null)}
                >
                  <Link
                    href={link.href}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all relative overflow-hidden ${
                      link.highlight
                        ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105'
                        : isActive(link.href)
                          ? isScrolled
                            ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                            : 'bg-white/20 backdrop-blur-md text-white'
                          : isScrolled
                            ? 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                            : 'text-white/90 hover:bg-white/10 backdrop-blur-sm'
                    }`}
                  >
                    <span className="text-lg">{link.icon}</span>
                    <span>{link.label}</span>
                    {link.megaMenu && (
                      <svg className={`w-4 h-4 transition-transform ${activeMegaMenu === link.href ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    )}
                    
                    {/* Active indicator */}
                    {isActive(link.href) && !link.highlight && (
                      <span className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></span>
                    )}
                  </Link>

                  {/* Mega Menu Dropdown */}
                  {link.megaMenu && activeMegaMenu === link.href && (
                    <div className="absolute top-full left-0 mt-2 w-64 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden animate-fade-in">
                      <div className="p-2">
                        {link.megaMenu.map((subLink) => (
                          <Link
                            key={subLink.href}
                            href={subLink.href}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-gray-700 dark:text-gray-300 hover:bg-green-50 dark:hover:bg-green-900/30 hover:text-green-600 dark:hover:text-green-400 transition-all group/item"
                          >
                            <span className="text-2xl group-hover/item:scale-110 transition-transform">{subLink.icon}</span>
                            <span className="font-medium">{subLink.label}</span>
                            <svg className="w-4 h-4 ml-auto opacity-0 group-hover/item:opacity-100 transition-opacity" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                            </svg>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* ═══════════════════════════════════════════════════════
                Actions (Language, Dark Mode, Mobile Menu)
                ═══════════════════════════════════════════════════════ */}
            <div className="flex items-center gap-2">
              {/* Language Toggle */}
              <button
                onClick={toggleLocale}
                className={`hidden sm:flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold transition-all group ${
                  isScrolled
                    ? 'bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 text-purple-700 dark:text-purple-400 hover:from-purple-200 hover:to-pink-200 dark:hover:from-purple-900/50 dark:hover:to-pink-900/50'
                    : 'bg-white/20 backdrop-blur-md text-white hover:bg-white/30'
                }`}
              >
                <svg className="w-5 h-5 transform group-hover:rotate-12 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                </svg>
                <span className="hidden md:inline">{locale === 'ar' ? 'EN' : 'عربي'}</span>
              </button>

              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className={`relative p-2.5 rounded-xl transition-all overflow-hidden group ${
                  isScrolled
                    ? 'bg-gradient-to-r from-yellow-100 to-orange-100 dark:from-gray-800 dark:to-gray-700 hover:from-yellow-200 hover:to-orange-200 dark:hover:from-gray-700 dark:hover:to-gray-600'
                    : 'bg-white/20 backdrop-blur-md hover:bg-white/30'
                }`}
                aria-label={isDark ? 'Light Mode' : 'Dark Mode'}
              >
                {/* Animated background */}
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 dark:from-blue-600 dark:to-purple-600 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                
                {isDark ? (
                  <svg className={`w-6 h-6 transform group-hover:rotate-180 transition-transform ${isScrolled ? 'text-yellow-600' : 'text-white'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" />
                  </svg>
                ) : (
                  <svg className={`w-6 h-6 transform group-hover:-rotate-12 transition-transform ${isScrolled ? 'text-gray-700' : 'text-white'}`} fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className={`lg:hidden p-2.5 rounded-xl transition-all ${
                  isScrolled
                    ? 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300'
                    : 'bg-white/20 backdrop-blur-md text-white'
                }`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  {isMobileMenuOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>

          {/* ═══════════════════════════════════════════════════════
              Mobile Menu - Enhanced
              ═══════════════════════════════════════════════════════ */}
          {isMobileMenuOpen && (
            <div className="lg:hidden py-6 border-t border-gray-200 dark:border-gray-700 bg-white/98 dark:bg-gray-900/98 backdrop-blur-xl animate-fade-in">
              <div className="space-y-2">
                {navStructure.map((link) => (
                  <div key={link.href}>
                    <Link
                      href={link.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-4 py-4 rounded-xl font-semibold transition-all ${
                        link.highlight
                          ? 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg'
                          : isActive(link.href)
                            ? 'bg-green-50 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <span className="text-2xl">{link.icon}</span>
                      <span className="flex-1">{link.label}</span>
                      {isActive(link.href) && !link.highlight && (
                        <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </Link>

                    {/* Mobile Submenu */}
                    {link.megaMenu && (
                      <div className="ml-6 mt-2 space-y-1">
                        {link.megaMenu.map((subLink) => (
                          <Link
                            key={subLink.href}
                            href={subLink.href}
                            onClick={() => setIsMobileMenuOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-green-600 dark:hover:text-green-400 transition-all"
                          >
                            <span className="text-lg">{subLink.icon}</span>
                            <span>{subLink.label}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Mobile Language Toggle */}
                <button
                  onClick={() => {
                    toggleLocale()
                    setIsMobileMenuOpen(false)
                  }}
                  className="w-full flex items-center gap-3 px-4 py-4 rounded-xl font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all sm:hidden"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
                  </svg>
                  <span>{locale === 'ar' ? 'English' : 'العربية'}</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Spacer to prevent content from going under fixed navbar */}
      <div className="h-20"></div>
    </>
  )
}