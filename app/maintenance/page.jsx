'use client'

// ═══════════════════════════════════════════════════════════════
// 🔧 MAINTENANCE PAGE - Professional Design
// صفحة الصيانة - تصميم احترافي
// ═══════════════════════════════════════════════════════════════

import { useApp } from '@/contexts/AppContext'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function MaintenancePage() {
  const { locale } = useApp()
  const isAr = locale === 'ar'

  const [settings, setSettings] = useState(null)

  useEffect(() => {
    // Load settings from localStorage
    const savedSettings = localStorage.getItem('admin-settings')
    if (savedSettings) {
      try {
        setSettings(JSON.parse(savedSettings))
      } catch (err) {
        console.error('Failed to load settings:', err)
      }
    }
  }, [])

  const message = isAr 
    ? (settings?.maintenanceMessageAr || 'نقوم حالياً بأعمال صيانة. يرجى العودة قريباً.')
    : (settings?.maintenanceMessage || 'We are currently performing maintenance. Please check back soon.')

  return (
    <div className={`min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center p-4 ${isAr ? 'rtl' : 'ltr'}`}>
      
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-purple-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 max-w-2xl w-full"
      >
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl rounded-3xl shadow-2xl p-12 border border-white/20 text-center">
          
          {/* Icon */}
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="inline-flex items-center justify-center w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-full shadow-2xl"
          >
            <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </motion.div>

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-4xl font-black text-gray-900 dark:text-white mb-4"
          >
            {isAr ? '🔧 أعمال صيانة' : '🔧 Under Maintenance'}
          </motion.h1>

          {/* Message */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-gray-600 dark:text-gray-400 mb-8 leading-relaxed"
          >
            {message}
          </motion.p>

          {/* Loading Animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center gap-2 mb-8"
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{ 
                  scale: [1, 1.5, 1],
                  opacity: [0.5, 1, 0.5]
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2
                }}
                className="w-3 h-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
              />
            ))}
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-sm text-gray-500 dark:text-gray-400"
          >
            {isAr ? 'شكراً لصبركم' : 'Thank you for your patience'} 💙
          </motion.div>

          {/* Admin Login Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            className="mt-6"
          >
            <a
              href="/admin/login"
              className="text-blue-600 dark:text-blue-400 hover:underline text-sm font-bold"
            >
              {isAr ? '👑 دخول المدراء' : '👑 Admin Login'}
            </a>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
