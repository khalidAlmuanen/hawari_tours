'use client'

// ═══════════════════════════════════════════════════════════════
// ⚙️ ADMIN SETTINGS - Ultra Professional & Modern
// إعدادات النظام - احترافية وعصرية ومبهرة جداً
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react'
import { useApp } from '@/contexts/AppContext'
import AdminLayout from '@/components/admin/AdminLayout'
import { useToast } from '@/components/admin/Toast'
import { motion, AnimatePresence } from 'framer-motion'

export default function AdminSettings() {
  const { locale } = useApp()
  const { success, error: showError, info } = useToast()
  const isAr = locale === 'ar'

  const [activeTab, setActiveTab] = useState('general')
  const [loading, setLoading] = useState(false)
  const [settings, setSettings] = useState({
    // General Settings
    siteName: 'Hawari Tours',
    siteNameAr: 'رحلات الحواري',
    siteDescription: 'Discover the beauty of Socotra Island',
    siteDescriptionAr: 'اكتشف جمال جزيرة سقطرى',
    contactEmail: 'info@hawaritours.com',
    contactPhone: '+967 xxx xxx xxx',
    contactAddress: 'Socotra Island, Yemen',
    contactAddressAr: 'جزيرة سقطرى، اليمن',

    // Social Media
    facebook: '',
    instagram: '',
    twitter: '',
    youtube: '',
    whatsapp: '+967 xxx xxx xxx',

    // Booking Settings
    currency: 'USD',
    taxRate: 0,
    minimumBookingDays: 1,
    maximumBookingDays: 30,
    cancellationDays: 7,

    // Email Settings
    emailEnabled: true,
    emailHost: 'smtp.gmail.com',
    emailPort: 587,
    emailUser: '',
    emailPassword: '',
    emailSecure: true,
    emailSender: '',

    // Notifications
    emailNotifications: true,
    pushNotifications: false,
    bookingNotifications: true,
    messageNotifications: true,
    reviewNotifications: true,

    // Maintenance
    maintenanceMode: false,
    maintenanceMessage: 'We are currently performing maintenance. Please check back soon.',
    maintenanceMessageAr: 'نقوم حالياً بأعمال صيانة. يرجى العودة قريباً.',
    allowedIPs: []
  })

  const tabs = [
    { id: 'general', label: { ar: 'عام', en: 'General' }, icon: '🏢' },
    { id: 'social', label: { ar: 'التواصل', en: 'Social Media' }, icon: '📱' },
    { id: 'booking', label: { ar: 'الحجوزات', en: 'Booking' }, icon: '📅' },
    { id: 'email', label: { ar: 'البريد', en: 'Email' }, icon: '📧' },
    { id: 'notifications', label: { ar: 'الإشعارات', en: 'Notifications' }, icon: '🔔' },
    { id: 'maintenance', label: { ar: 'الصيانة', en: 'Maintenance' }, icon: '🔧' }
  ]

  const handleSave = async () => {
    setLoading(true)
    try {
      const normalizeNumber = (value, fallback, allowNull = false) => {
        const num = Number(value)
        if (Number.isFinite(num)) return num
        return allowNull ? null : fallback
      }

      const payload = {
        ...settings,
        taxRate: normalizeNumber(settings.taxRate, 0),
        minimumBookingDays: normalizeNumber(settings.minimumBookingDays, 1),
        maximumBookingDays: normalizeNumber(settings.maximumBookingDays, 30),
        cancellationDays: normalizeNumber(settings.cancellationDays, 7),
        emailPort: normalizeNumber(settings.emailPort, null, true),
        allowedIPs: Array.isArray(settings.allowedIPs) ? settings.allowedIPs : []
      }

      // Save to API
      const response = await fetch('/api/admin/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      const data = await response.json().catch(() => null)
      if (!response.ok) throw new Error(data?.error || 'Failed to save settings')

      // Update local state with returned data (to ensure sync)
      if (data.success && data.data) {
        setSettings((prev) => ({ ...prev, ...data.data }))
        // Also update localStorage as backup/cache
        localStorage.setItem('admin-settings', JSON.stringify(data.data))
      }

      // Save maintenance mode to cookie (for middleware)
      if (settings.maintenanceMode) {
        document.cookie = 'maintenance-mode=true; path=/; max-age=31536000' // 1 year
      } else {
        document.cookie = 'maintenance-mode=false; path=/; max-age=31536000'
      }
      document.cookie = `maintenance-allowed-ips=${encodeURIComponent(
        Array.isArray(settings.allowedIPs) ? settings.allowedIPs.join('|') : ''
      )}; path=/; max-age=31536000`

      success(isAr ? 'تم حفظ الإعدادات بنجاح! ✅' : 'Settings saved successfully! ✅')

      // Show info about maintenance mode
      if (settings.maintenanceMode) {
        setTimeout(() => {
          info(isAr
            ? '⚠️ وضع الصيانة نشط! الزوار لن يتمكنوا من الوصول للموقع (ماعدا المدراء)'
            : '⚠️ Maintenance mode is ON! Visitors cannot access the site (except admins)'
          )
        }, 1500)
      }
    } catch (err) {
      console.error(err)
      showError(isAr ? 'فشل في حفظ الإعدادات' : 'Failed to save settings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch('/api/admin/settings')
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.data) {
            setSettings((prev) => ({ ...prev, ...data.data }))
            // Update localStorage
            localStorage.setItem('admin-settings', JSON.stringify(data.data))
            return
          }
        }
      } catch (error) {
        console.error('Failed to fetch settings from API:', error)
      }

      // Fallback to localStorage if API fails or first load
      const savedSettings = localStorage.getItem('admin-settings')
      if (savedSettings) {
        try {
          setSettings((prev) => ({ ...prev, ...JSON.parse(savedSettings) }))
        } catch (err) {
          console.error('Failed to load settings from local storage:', err)
        }
      }
    }

    fetchSettings()
  }, [])

  return (
    <AdminLayout>
      <div className="space-y-6">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">
            {isAr ? '⚙️ إعدادات النظام' : '⚙️ System Settings'}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {isAr ? 'إدارة إعدادات الموقع والنظام' : 'Manage site and system settings'}
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {/* Currency */}
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-100 font-semibold">{isAr ? 'العملة' : 'Currency'}</span>
              <span className="text-3xl">💰</span>
            </div>
            <div className="text-4xl font-black">{settings.currency}</div>
            <div className="text-blue-100 text-sm mt-2">{isAr ? 'عملة الموقع' : 'Site currency'}</div>
          </motion.div>

          {/* Tax Rate */}
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-green-100 font-semibold">{isAr ? 'الضريبة' : 'Tax'}</span>
              <span className="text-3xl">📊</span>
            </div>
            <div className="text-4xl font-black">{settings.taxRate}%</div>
            <div className="text-green-100 text-sm mt-2">{isAr ? 'نسبة الضريبة' : 'Tax rate'}</div>
          </motion.div>

          {/* Maintenance */}
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className={`bg-gradient-to-br ${settings.maintenanceMode ? 'from-red-500 to-red-600' : 'from-purple-500 to-purple-600'} rounded-2xl p-6 text-white shadow-xl`}
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/90 font-semibold">{isAr ? 'الصيانة' : 'Maintenance'}</span>
              <span className="text-3xl">🔧</span>
            </div>
            <div className="text-4xl font-black">{settings.maintenanceMode ? (isAr ? 'نشط' : 'ON') : (isAr ? 'متوقف' : 'OFF')}</div>
            <div className="text-white/90 text-sm mt-2">{isAr ? 'وضع الصيانة' : 'Maintenance mode'}</div>
          </motion.div>

          {/* Notifications */}
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white shadow-xl"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-orange-100 font-semibold">{isAr ? 'الإشعارات' : 'Notifications'}</span>
              <span className="text-3xl">🔔</span>
            </div>
            <div className="text-4xl font-black">
              {[settings.bookingNotifications, settings.messageNotifications, settings.reviewNotifications].filter(Boolean).length}
            </div>
            <div className="text-orange-100 text-sm mt-2">{isAr ? 'نشط من 3' : 'Active of 3'}</div>
          </motion.div>
        </motion.div>

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
        >

          {/* Tabs */}
          <div className="flex overflow-x-auto border-b border-gray-200 dark:border-gray-700">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-6 py-4 font-bold transition-all whitespace-nowrap ${activeTab === tab.id
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
              >
                <span className="text-xl">{tab.icon}</span>
                <span>{tab.label[locale]}</span>
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="p-8">
            <AnimatePresence mode="wait">

              {/* General Settings */}
              {activeTab === 'general' && (
                <motion.div
                  key="general"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">
                    {isAr ? 'الإعدادات العامة' : 'General Settings'}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Site Name */}
                    <div>
                      <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                        {isAr ? 'اسم الموقع (English)' : 'Site Name (English)'}
                      </label>
                      <input
                        type="text"
                        value={settings.siteName || ''}
                        onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white border-2 border-transparent focus:border-blue-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                        {isAr ? 'اسم الموقع (عربي)' : 'Site Name (Arabic)'}
                      </label>
                      <input
                        type="text"
                        value={settings.siteNameAr || ''}
                        onChange={(e) => setSettings({ ...settings, siteNameAr: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white border-2 border-transparent focus:border-blue-500 transition-all"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                        {isAr ? 'الوصف (English)' : 'Description (English)'}
                      </label>
                      <textarea
                        value={settings.siteDescription || ''}
                        onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white border-2 border-transparent focus:border-blue-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                        {isAr ? 'الوصف (عربي)' : 'Description (Arabic)'}
                      </label>
                      <textarea
                        value={settings.siteDescriptionAr || ''}
                        onChange={(e) => setSettings({ ...settings, siteDescriptionAr: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white border-2 border-transparent focus:border-blue-500 transition-all"
                      />
                    </div>

                    {/* Contact Info */}
                    <div>
                      <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                        {isAr ? 'البريد الإلكتروني' : 'Contact Email'}
                      </label>
                      <input
                        type="email"
                        value={settings.contactEmail || ''}
                        onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white border-2 border-transparent focus:border-blue-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                        {isAr ? 'رقم الهاتف' : 'Contact Phone'}
                      </label>
                      <input
                        type="tel"
                        value={settings.contactPhone || ''}
                        onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white border-2 border-transparent focus:border-blue-500 transition-all"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                        {isAr ? 'العنوان' : 'Contact Address'}
                      </label>
                      <input
                        type="text"
                        value={settings.contactAddress || ''}
                        onChange={(e) => setSettings({ ...settings, contactAddress: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white border-2 border-transparent focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Social Media */}
              {activeTab === 'social' && (
                <motion.div
                  key="social"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">
                    {isAr ? 'وسائل التواصل الاجتماعي' : 'Social Media Links'}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                        📘 Facebook
                      </label>
                      <input
                        type="url"
                        value={settings.facebook || ''}
                        onChange={(e) => setSettings({ ...settings, facebook: e.target.value })}
                        placeholder="https://facebook.com/hawaritours"
                        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white border-2 border-transparent focus:border-blue-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                        📷 Instagram
                      </label>
                      <input
                        type="url"
                        value={settings.instagram || ''}
                        onChange={(e) => setSettings({ ...settings, instagram: e.target.value })}
                        placeholder="https://instagram.com/hawaritours"
                        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white border-2 border-transparent focus:border-blue-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                        🐦 Twitter (X)
                      </label>
                      <input
                        type="url"
                        value={settings.twitter || ''}
                        onChange={(e) => setSettings({ ...settings, twitter: e.target.value })}
                        placeholder="https://twitter.com/hawaritours"
                        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white border-2 border-transparent focus:border-blue-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                        📹 YouTube
                      </label>
                      <input
                        type="url"
                        value={settings.youtube || ''}
                        onChange={(e) => setSettings({ ...settings, youtube: e.target.value })}
                        placeholder="https://youtube.com/@hawaritours"
                        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white border-2 border-transparent focus:border-blue-500 transition-all"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                        💬 WhatsApp
                      </label>
                      <input
                        type="tel"
                        value={settings.whatsapp || ''}
                        onChange={(e) => setSettings({ ...settings, whatsapp: e.target.value })}
                        placeholder="+967 xxx xxx xxx"
                        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white border-2 border-transparent focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Booking Settings */}
              {activeTab === 'booking' && (
                <motion.div
                  key="booking"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">
                    {isAr ? 'إعدادات الحجوزات' : 'Booking Settings'}
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                        {isAr ? 'العملة' : 'Currency'}
                      </label>
                      <select
                        value={settings.currency || 'USD'}
                        onChange={(e) => setSettings({ ...settings, currency: e.target.value })}
                        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white border-2 border-transparent focus:border-blue-500 transition-all"
                      >
                        <option value="USD">USD - US Dollar</option>
                        <option value="EUR">EUR - Euro</option>
                        <option value="GBP">GBP - British Pound</option>
                        <option value="SAR">SAR - Saudi Riyal</option>
                        <option value="YER">YER - Yemeni Rial</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                        {isAr ? 'نسبة الضريبة (%)' : 'Tax Rate (%)'}
                      </label>
                      <input
                        type="number"
                        min="0"
                        max="100"
                        step="0.1"
                        value={settings.taxRate ?? 0}
                        onChange={(e) => setSettings({ ...settings, taxRate: parseFloat(e.target.value) })}
                        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white border-2 border-transparent focus:border-blue-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                        {isAr ? 'الحد الأدنى للحجز (أيام)' : 'Minimum Booking Days'}
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={settings.minimumBookingDays || 1}
                        onChange={(e) => setSettings({ ...settings, minimumBookingDays: parseInt(e.target.value) })}
                        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white border-2 border-transparent focus:border-blue-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                        {isAr ? 'الحد الأقصى للحجز (أيام)' : 'Maximum Booking Days'}
                      </label>
                      <input
                        type="number"
                        min="1"
                        value={settings.maximumBookingDays || 30}
                        onChange={(e) => setSettings({ ...settings, maximumBookingDays: parseInt(e.target.value) })}
                        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white border-2 border-transparent focus:border-blue-500 transition-all"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                        {isAr ? 'أيام الإلغاء المجاني' : 'Free Cancellation Days'}
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={settings.cancellationDays ?? 0}
                        onChange={(e) => setSettings({ ...settings, cancellationDays: parseInt(e.target.value) })}
                        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white border-2 border-transparent focus:border-blue-500 transition-all"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        {isAr ? 'عدد الأيام المسموح بها للإلغاء المجاني قبل موعد الرحلة' : 'Number of days allowed for free cancellation before the tour date'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Email Settings */}
              {activeTab === 'email' && (
                <motion.div
                  key="email"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">
                    {isAr ? 'إعدادات البريد الإلكتروني' : 'Email Settings'}
                  </h2>

                  <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">⚠️</span>
                      <div>
                        <h3 className="font-bold text-yellow-800 dark:text-yellow-200 mb-1">
                          {isAr ? 'تنبيه أمني' : 'Security Notice'}
                        </h3>
                        <p className="text-sm text-yellow-700 dark:text-yellow-300">
                          {isAr ? 'لا تشارك كلمة مرور البريد الإلكتروني مع أي شخص. استخدم App Password للحسابات مثل Gmail.' : 'Never share your email password. Use App Password for accounts like Gmail.'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Email Enabled */}
                    <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-700 rounded-xl">
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">
                          {isAr ? 'تفعيل إرسال البريد' : 'Enable Email Sending'}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {isAr ? 'إرسال رسائل البريد تلقائياً للمستخدمين' : 'Automatically send emails to users'}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.emailEnabled}
                          onChange={(e) => setSettings({ ...settings, emailEnabled: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-14 h-8 bg-gray-300 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                          {isAr ? 'مضيف SMTP' : 'SMTP Host'}
                        </label>
                        <input
                          type="text"
                          value={settings.emailHost || ''}
                          onChange={(e) => setSettings({ ...settings, emailHost: e.target.value })}
                          placeholder="smtp.gmail.com"
                          className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white border-2 border-transparent focus:border-blue-500 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                          {isAr ? 'منفذ SMTP' : 'SMTP Port'}
                        </label>
                        <input
                          type="number"
                          value={settings.emailPort || ''}
                          onChange={(e) => setSettings({ ...settings, emailPort: parseInt(e.target.value) })}
                          placeholder="587"
                          className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white border-2 border-transparent focus:border-blue-500 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                          {isAr ? 'اسم المستخدم' : 'Username / Email'}
                        </label>
                        <input
                          type="email"
                          value={settings.emailUser || ''}
                          onChange={(e) => setSettings({ ...settings, emailUser: e.target.value })}
                          placeholder="your-email@gmail.com"
                          className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white border-2 border-transparent focus:border-blue-500 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                          {isAr ? 'كلمة المرور' : 'Password / App Password'}
                        </label>
                        <input
                          type="password"
                          value={settings.emailPassword || ''}
                          onChange={(e) => setSettings({ ...settings, emailPassword: e.target.value })}
                          placeholder="••••••••••••••••"
                          className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white border-2 border-transparent focus:border-blue-500 transition-all"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                          {isAr ? 'مرسل البريد' : 'Email Sender'}
                        </label>
                        <input
                          type="text"
                          value={settings.emailSender || ''}
                          onChange={(e) => setSettings({ ...settings, emailSender: e.target.value })}
                          placeholder={isAr ? 'مثل: Hawari Tours <info@domain.com>' : 'e.g. Hawari Tours <info@domain.com>'}
                          className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white border-2 border-transparent focus:border-blue-500 transition-all"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-700 rounded-xl">
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">
                          {isAr ? 'تشفير البريد (SSL/TLS)' : 'Email Encryption (SSL/TLS)'}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {isAr ? 'تفعيل الاتصال الآمن بخادم البريد' : 'Enable secure connection to SMTP server'}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.emailSecure}
                          onChange={(e) => setSettings({ ...settings, emailSecure: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-14 h-8 bg-gray-300 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Notifications */}
              {activeTab === 'notifications' && (
                <motion.div
                  key="notifications"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">
                    {isAr ? 'إعدادات الإشعارات' : 'Notification Settings'}
                  </h2>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-700 rounded-xl">
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">
                          ✉️ {isAr ? 'إشعارات البريد' : 'Email Notifications'}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {isAr ? 'تلقي إشعارات عبر البريد الإلكتروني' : 'Receive notifications via email'}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.emailNotifications}
                          onChange={(e) => setSettings({ ...settings, emailNotifications: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-14 h-8 bg-gray-300 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-700 rounded-xl">
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">
                          📱 {isAr ? 'إشعارات الجوال' : 'Push Notifications'}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {isAr ? 'إشعارات فورية على الأجهزة' : 'Instant notifications on devices'}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.pushNotifications}
                          onChange={(e) => setSettings({ ...settings, pushNotifications: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-14 h-8 bg-gray-300 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    {/* Booking Notifications */}
                    <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-700 rounded-xl">
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">
                          📅 {isAr ? 'إشعارات الحجوزات' : 'Booking Notifications'}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {isAr ? 'تلقي إشعار عند حجز جديد' : 'Receive notification for new bookings'}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.bookingNotifications}
                          onChange={(e) => setSettings({ ...settings, bookingNotifications: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-14 h-8 bg-gray-300 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    {/* Message Notifications */}
                    <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-700 rounded-xl">
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">
                          💬 {isAr ? 'إشعارات الرسائل' : 'Message Notifications'}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {isAr ? 'تلقي إشعار عند رسالة جديدة' : 'Receive notification for new messages'}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.messageNotifications}
                          onChange={(e) => setSettings({ ...settings, messageNotifications: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-14 h-8 bg-gray-300 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    {/* Review Notifications */}
                    <div className="flex items-center justify-between p-4 bg-gray-100 dark:bg-gray-700 rounded-xl">
                      <div>
                        <h3 className="font-bold text-gray-900 dark:text-white">
                          ⭐ {isAr ? 'إشعارات التقييمات' : 'Review Notifications'}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {isAr ? 'تلقي إشعار عند تقييم جديد' : 'Receive notification for new reviews'}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.reviewNotifications}
                          onChange={(e) => setSettings({ ...settings, reviewNotifications: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-14 h-8 bg-gray-300 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Maintenance */}
              {activeTab === 'maintenance' && (
                <motion.div
                  key="maintenance"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
                  <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-6">
                    {isAr ? 'وضع الصيانة' : 'Maintenance Mode'}
                  </h2>

                  <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">⚠️</span>
                      <div>
                        <h3 className="font-bold text-red-800 dark:text-red-200 mb-1">
                          {isAr ? 'تحذير!' : 'Warning!'}
                        </h3>
                        <p className="text-sm text-red-700 dark:text-red-300">
                          {isAr ? 'عند تفعيل وضع الصيانة، لن يتمكن الزوار من الوصول للموقع (ماعدا المدراء).' : 'When maintenance mode is enabled, visitors will not be able to access the site (except admins).'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-6">
                    {/* Maintenance Toggle */}
                    <div className="flex items-center justify-between p-6 bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/30 dark:to-orange-900/30 rounded-xl border-2 border-red-200 dark:border-red-800">
                      <div>
                        <h3 className="text-xl font-black text-gray-900 dark:text-white">
                          {isAr ? 'تفعيل وضع الصيانة' : 'Enable Maintenance Mode'}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {isAr ? 'إيقاف الوصول للموقع مؤقتاً' : 'Temporarily disable site access'}
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={settings.maintenanceMode}
                          onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
                          className="sr-only peer"
                        />
                        <div className="w-20 h-10 bg-gray-300 dark:bg-gray-600 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 dark:peer-focus:ring-red-800 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-8 after:w-8 after:transition-all peer-checked:bg-red-600"></div>
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                        {isAr ? 'رسالة الصيانة (English)' : 'Maintenance Message (English)'}
                      </label>
                      <textarea
                        value={settings.maintenanceMessage || ''}
                        onChange={(e) => setSettings({ ...settings, maintenanceMessage: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white border-2 border-transparent focus:border-blue-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                        {isAr ? 'رسالة الصيانة (عربي)' : 'Maintenance Message (Arabic)'}
                      </label>
                      <textarea
                        value={settings.maintenanceMessageAr || ''}
                        onChange={(e) => setSettings({ ...settings, maintenanceMessageAr: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white border-2 border-transparent focus:border-blue-500 transition-all"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                        {isAr ? 'عناوين IP المسموحة' : 'Allowed IPs'}
                      </label>
                      <input
                        type="text"
                        value={Array.isArray(settings.allowedIPs) ? settings.allowedIPs.join(', ') : ''}
                        onChange={(e) => {
                          const list = e.target.value
                            .split(',')
                            .map((item) => item.trim())
                            .filter(Boolean)
                          setSettings({ ...settings, allowedIPs: list })
                        }}
                        placeholder={isAr ? 'مثال: 1.1.1.1, 2.2.2.2' : 'e.g. 1.1.1.1, 2.2.2.2'}
                        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white border-2 border-transparent focus:border-blue-500 transition-all"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </div>

          {/* Save Button */}
          <div className="p-6 bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              disabled={loading}
              className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
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
            </motion.button>
          </div>
        </motion.div>
      </div>
    </AdminLayout>
  )
}
