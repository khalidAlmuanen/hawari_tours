'use client'

// ═══════════════════════════════════════════════════════════════════════
// 🎨 ملف: contexts/AppContext.js
// الوصف: Context عام للغة والوضع الليلي
// ═══════════════════════════════════════════════════════════════════════

import { createContext, useContext, useState, useEffect } from 'react'
import { useTranslation } from '@/lib/i18n/translations'

const AppContext = createContext()

export function AppProvider({ children }) {
  // اللغة
  const [locale, setLocale] = useState('ar')
  const { t, isRTL } = useTranslation(locale)

  // الوضع الليلي
  const [isDark, setIsDark] = useState(false)

  // تحميل الإعدادات من localStorage
  useEffect(() => {
    const savedLocale = localStorage.getItem('locale')
    const savedTheme = localStorage.getItem('theme')

    if (savedLocale) {
      setLocale(savedLocale)
    }

    if (savedTheme === 'dark') {
      setIsDark(true)
      document.documentElement.classList.add('dark')
    }
  }, [])

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