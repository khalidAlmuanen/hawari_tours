'use client'

// ═══════════════════════════════════════════════════════════════
// ⚙️ SETTINGS TAB - Gallery Page Settings
// تبويب الإعدادات - إعدادات صفحة المعرض
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react'
import { useApp } from '@/contexts/AppContext'
import { useToast } from '@/components/admin/Toast'
import { motion } from 'framer-motion'

export default function SettingsTab() {
  const { locale } = useApp()
  const { success, error: showError } = useToast()
  const isAr = locale === 'ar'

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState({
    // Hero Section
    heroTitle: '',
    heroTitleAr: '',
    heroSubtitle: '',
    heroSubtitleAr: '',
    heroDescription: '',
    heroDescriptionAr: '',
    
    // Instagram Settings
    instagramUsername: '',
    instagramUrl: '',
    instagramTitle: '',
    instagramTitleAr: '',
    
    // Download Section
    downloadTitle: '',
    downloadTitleAr: '',
    downloadDescription: '',
    downloadDescriptionAr: '',
    downloadEnabled: true,
    
    // CTA Section
    ctaTitle: '',
    ctaTitleAr: '',
    ctaDescription: '',
    ctaDescriptionAr: '',
    ctaButtonText: '',
    ctaButtonTextAr: '',
    
    // Stats
    statsEnabled: true,
    virtualToursCount: '10+',
    highQualityLabel: '4K'
  })

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/gallery/settings')
      const result = await response.json()
      if (result.success) {
        setSettings(result.data)
      }
    } catch (error) {
      console.error('Failed to fetch settings:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch('/api/admin/gallery/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })

      const result = await response.json()
      if (result.success) {
        success(isAr ? 'تم حفظ الإعدادات! ✅' : 'Settings saved! ✅')
      } else {
        showError(result.error || (isAr ? 'فشل في الحفظ' : 'Failed to save'))
      }
    } catch (error) {
      console.error('Failed to save settings:', error)
      showError(isAr ? 'فشل في الحفظ' : 'Failed to save')
    } finally {
      setSaving(false)
    }
  }

  const handleReset = async () => {
    if (!confirm(isAr ? 'هل تريد إعادة تعيين الإعدادات للقيم الافتراضية؟' : 'Reset settings to default values?')) {
      return
    }

    try {
      const response = await fetch('/api/admin/gallery/settings', {
        method: 'POST'
      })

      const result = await response.json()
      if (result.success) {
        setSettings(result.data)
        success(isAr ? 'تم إعادة التعيين! 🔄' : 'Reset successful! 🔄')
      }
    } catch (error) {
      console.error('Failed to reset:', error)
      showError(isAr ? 'فشل في إعادة التعيين' : 'Failed to reset')
    }
  }

  if (loading) {
    return (
      <div className="text-center py-20">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
        <p className="mt-4 text-gray-600 dark:text-gray-400">{isAr ? 'جارٍ التحميل...' : 'Loading...'}</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      
      {/* Hero Section Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-xl flex items-center justify-center text-2xl">
            🎯
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isAr ? 'القسم الرئيسي (Hero)' : 'Hero Section'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {isAr ? 'عنوان ووصف القسم الرئيسي في صفحة المعرض' : 'Title and description for the main section'}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              {isAr ? 'العنوان (عربي)' : 'Title (Arabic)'}
            </label>
            <input
              type="text"
              value={settings.heroTitleAr}
              onChange={(e) => setSettings({...settings, heroTitleAr: e.target.value})}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white"
              placeholder="استكشف سقطرى"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              {isAr ? 'العنوان (إنجليزي)' : 'Title (English)'}
            </label>
            <input
              type="text"
              value={settings.heroTitle}
              onChange={(e) => setSettings({...settings, heroTitle: e.target.value})}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 dark:text-white"
              placeholder="Explore Socotra"
            />
          </div>
        </div>
      </motion.div>

      {/* Instagram Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center text-2xl">
            📱
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isAr ? 'إعدادات إنستغرام' : 'Instagram Settings'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {isAr ? 'معلومات حساب إنستغرام' : 'Instagram account information'}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              {isAr ? 'اسم المستخدم' : 'Username'}
            </label>
            <input
              type="text"
              value={settings.instagramUsername}
              onChange={(e) => setSettings({...settings, instagramUsername: e.target.value})}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-pink-500 dark:text-white"
              placeholder="@HawariTours"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              {isAr ? 'رابط الحساب' : 'Account URL'}
            </label>
            <input
              type="url"
              value={settings.instagramUrl}
              onChange={(e) => setSettings({...settings, instagramUrl: e.target.value})}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-pink-500 dark:text-white"
              placeholder="https://instagram.com/hawaritours"
            />
          </div>
        </div>
      </motion.div>

      {/* Download Section Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-2xl">
            📥
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isAr ? 'قسم التحميل' : 'Download Section'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {isAr ? 'إعدادات قسم طلب الصور عالية الجودة' : 'High-resolution image request section settings'}
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={settings.downloadEnabled}
              onChange={(e) => setSettings({...settings, downloadEnabled: e.target.checked})}
              className="w-5 h-5 text-green-600 bg-gray-100 border-gray-300 rounded focus:ring-green-500"
            />
            <span className="text-gray-900 dark:text-white font-bold">
              ✅ {isAr ? 'تفعيل قسم التحميل' : 'Enable Download Section'}
            </span>
          </label>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                {isAr ? 'العنوان (عربي)' : 'Title (Arabic)'}
              </label>
              <input
                type="text"
                value={settings.downloadTitleAr}
                onChange={(e) => setSettings({...settings, downloadTitleAr: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                {isAr ? 'العنوان (إنجليزي)' : 'Title (English)'}
              </label>
              <input
                type="text"
                value={settings.downloadTitle}
                onChange={(e) => setSettings({...settings, downloadTitle: e.target.value})}
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 dark:text-white"
              />
            </div>
          </div>
        </div>
      </motion.div>

      {/* CTA Section Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center text-2xl">
            🚀
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isAr ? 'قسم الدعوة للعمل (CTA)' : 'Call-to-Action Section'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {isAr ? 'إعدادات قسم الدعوة للحجز' : 'Booking call-to-action section settings'}
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              {isAr ? 'العنوان (عربي)' : 'Title (Arabic)'}
            </label>
            <input
              type="text"
              value={settings.ctaTitleAr}
              onChange={(e) => setSettings({...settings, ctaTitleAr: e.target.value})}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              {isAr ? 'العنوان (إنجليزي)' : 'Title (English)'}
            </label>
            <input
              type="text"
              value={settings.ctaTitle}
              onChange={(e) => setSettings({...settings, ctaTitle: e.target.value})}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              {isAr ? 'نص الزر (عربي)' : 'Button Text (Arabic)'}
            </label>
            <input
              type="text"
              value={settings.ctaButtonTextAr}
              onChange={(e) => setSettings({...settings, ctaButtonTextAr: e.target.value})}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
              {isAr ? 'نص الزر (إنجليزي)' : 'Button Text (English)'}
            </label>
            <input
              type="text"
              value={settings.ctaButtonText}
              onChange={(e) => setSettings({...settings, ctaButtonText: e.target.value})}
              className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 dark:text-white"
            />
          </div>
        </div>
      </motion.div>

      {/* Actions */}
      <div className="flex gap-4">
        <button
          type="button"
          onClick={handleReset}
          className="px-8 py-4 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-bold hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
        >
          {isAr ? '🔄 إعادة تعيين' : '🔄 Reset'}
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex-1 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-2xl transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {saving ? (
            <>
              <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{isAr ? 'جارِ الحفظ...' : 'Saving...'}</span>
            </>
          ) : (
            <>
              <span>💾</span>
              <span>{isAr ? 'حفظ الإعدادات' : 'Save Settings'}</span>
            </>
          )}
        </button>
      </div>
    </form>
  )
}
