'use client'

// ═══════════════════════════════════════════════════════════════════════
// 🎨 ملف: contexts/AppContext.js
// الوصف: Context عام للغة والوضع الليلي
// ═══════════════════════════════════════════════════════════════════════

import { createContext, useContext, useState, useEffect } from 'react'
import { useTranslation } from '@/lib/i18n/translations'

const AppContext = createContext()

export function AppProvider({ children }) {
  const readCookie = (name) => {
    if (typeof document === 'undefined') return null
    const entry = document.cookie.split('; ').find((row) => row.startsWith(`${name}=`))
    return entry ? decodeURIComponent(entry.split('=')[1]) : null
  }

  const writeCookie = (name, value) => {
    if (typeof document === 'undefined') return
    document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=31536000`
  }

  // اللغة
  const [locale, setLocale] = useState(() => {
    if (typeof window === 'undefined') return 'ar'
    const cookieLocale = readCookie('locale')
    return cookieLocale || localStorage.getItem('locale') || 'ar'
  })
  const { t, isRTL } = useTranslation(locale)

  // الوضع الليلي
  const [isDark, setIsDark] = useState(() => {
    if (typeof window === 'undefined') return false
    const cookieTheme = readCookie('theme')
    if (cookieTheme) return cookieTheme === 'dark'
    return localStorage.getItem('theme') === 'dark'
  })

  // تبديل اللغة
  const toggleLocale = () => {
    const newLocale = locale === 'ar' ? 'en' : 'ar'
    setLocale(newLocale)
    localStorage.setItem('locale', newLocale)

    // تحديث اتجاه الصفحة
    document.documentElement.dir = newLocale === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = newLocale
  }

  // تبديل الوضع الليلي
  const toggleDarkMode = () => {
    const newIsDark = !isDark
    setIsDark(newIsDark)
    localStorage.setItem('theme', newIsDark ? 'dark' : 'light')

    if (newIsDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // تعيين اتجاه الصفحة عند التحميل
  useEffect(() => {
    document.documentElement.dir = isRTL ? 'rtl' : 'ltr'
    document.documentElement.lang = locale
  }, [locale, isRTL])

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDark])

  useEffect(() => {
    writeCookie('locale', locale)
    writeCookie('theme', isDark ? 'dark' : 'light')
  }, [locale, isDark])

  const value = {
    locale,
    setLocale,
    toggleLocale,
    t,
    isRTL,
    isDark,
    toggleDarkMode
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within AppProvider')
  }
  return context
}
