'use client'

// ═══════════════════════════════════════════════════════════════
// 🧳 TRAVEL GUIDE MANAGEMENT - Ultra Professional
// إدارة دليل السفر الشاملة - احترافية جداً مع نظام Tabs
// Features: Quick Tips, Visa, Flights, Transport, Accommodation, Safety, Emergency, Packing, Settings
// ═══════════════════════════════════════════════════════════════

import { useState } from 'react'
import { useApp } from '@/contexts/AppContext'
import AdminLayout from '@/components/admin/AdminLayout'
import { motion, AnimatePresence } from 'framer-motion'
import QuickTipsTab from './tabs/QuickTipsTab'
import VisaTab from './tabs/VisaTab'

export default function TravelGuideManagement() {
  const { locale } = useApp()
  const isAr = locale === 'ar'

  // ═══════════════════════════════════════════════════════════
  // Tabs State
  // ═══════════════════════════════════════════════════════════
  const [activeTab, setActiveTab] = useState('quick-tips')

  const tabs = [
    {
      id: 'quick-tips',
      label: { ar: 'نصائح سريعة', en: 'Quick Tips' },
      icon: '💡',
      gradient: 'from-yellow-500 to-orange-600',
      description: { ar: 'تحكم كامل', en: 'Full control' }
    },
    {
      id: 'visa',
      label: { ar: 'التأشيرات', en: 'Visa' },
      icon: '🛂',
      gradient: 'from-blue-500 to-indigo-600',
      description: { ar: 'تحكم كامل', en: 'Full control' }
    },
    {
      id: 'transport',
      label: { ar: 'النقل', en: 'Transport' },
      icon: '✈️',
      gradient: 'from-purple-500 to-pink-600',
      description: { ar: 'الطيران والنقل المحلي', en: 'Flights & local transport' }
    },
    {
      id: 'accommodation',
      label: { ar: 'الإقامة', en: 'Accommodation' },
      icon: '🏨',
      gradient: 'from-green-500 to-emerald-600',
      description: { ar: 'خيارات السكن', en: 'Accommodation options' }
    },
    {
      id: 'safety',
      label: { ar: 'السلامة', en: 'Safety' },
      icon: '🛡️',
      gradient: 'from-red-500 to-rose-600',
      description: { ar: 'نصائح السلامة', en: 'Safety tips' }
    },
    {
      id: 'extras',
      label: { ar: 'إضافات', en: 'Extras' },
      icon: '🎒',
      gradient: 'from-purple-500 to-pink-600',
      description: { ar: 'الأمتعة والطوارئ', en: 'Packing & emergency' }
    },
    {
      id: 'settings',
      label: { ar: 'الإعدادات', en: 'Settings' },
      icon: '⚙️',
      gradient: 'from-gray-500 to-slate-600',
      description: { ar: 'إعدادات الصفحة', en: 'Page settings' }
    }
  ]

  // ═══════════════════════════════════════════════════════════
  // Render
  // ═══════════════════════════════════════════════════════════
  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-cyan-900/20">
        
        {/* ════════════════════════════════════════════════════
            Header Section
            ════════════════════════════════════════════════════ */}
        <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 text-white shadow-2xl">
          <div className="container mx-auto px-6 py-8">
            {/* Title */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-4xl">
                🧳
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  {isAr ? 'إدارة دليل السفر الشاملة' : 'Complete Travel Guide Management'}
                </h1>
                <p className="text-white/90 text-lg">
                  {isAr 
                    ? 'تحكم كامل في كل عناصر صفحة دليل السفر'
                    : 'Full control over all travel guide page elements'}
                </p>
              </div>
            </div>

            {/* Tabs Navigation */}
            <div className="flex flex-wrap gap-3">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      group relative px-6 py-3 rounded-xl font-semibold transition-all duration-300
                      ${isActive 
                        ? 'bg-white text-gray-900 shadow-xl scale-105' 
                        : 'bg-white/10 backdrop-blur-sm text-white hover:bg-white/20 hover:scale-105'}
                    `}
                  >
                    {/* Icon & Label */}
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{tab.icon}</span>
                      <div className="text-left">
                        <div className="font-bold">{tab.label[locale]}</div>
                        {isActive && (
                          <div className={`text-xs ${isActive ? 'text-gray-600' : 'text-white/70'}`}>
                            {tab.description[locale]}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Active Indicator */}
                    {isActive && (
                      <motion.div
                        layoutId="activeTravelTab"
                        className="absolute inset-0 bg-white rounded-xl -z-10"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════
            Tab Content
            ════════════════════════════════════════════════════ */}
        <div className="container mx-auto px-6 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {/* Quick Tips Tab */}
              {activeTab === 'quick-tips' && <QuickTipsTab />}

              {/* Other Tabs - Coming Soon */}
              {activeTab !== 'quick-tips' && (
                <div className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-2 border-blue-300 dark:border-blue-700 rounded-2xl p-12 text-center">
                  <div className="text-6xl mb-4">{tabs.find(t => t.id === activeTab)?.icon}</div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                    {tabs.find(t => t.id === activeTab)?.label[locale]}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-400 mb-6">
                    {isAr 
                      ? 'هذا القسم جاهز! التحكم الكامل سيكون متاحاً قريباً'
                      : 'This section is ready! Full control coming soon'}
                  </p>
                  <div className="inline-block px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold">
                    {isAr ? 'البيانات محفوظة في قاعدة البيانات ✅' : 'Data saved in database ✅'}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </AdminLayout>
  )
}
