'use client'

// ═══════════════════════════════════════════════════════════════
// 🧳 TRAVEL GUIDE MANAGEMENT - Ultra Professional
// إدارة دليل السفر الشاملة - احترافية جداً مع نظام Tabs
// Features: Quick Tips, Visa, Flights, Transport, Accommodation, Safety, Emergency, Packing, Settings
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect, useMemo } from 'react'
import { useApp } from '@/contexts/AppContext'
import AdminLayout from '@/components/admin/AdminLayout'
import { motion, AnimatePresence } from 'framer-motion'
import QuickTipsTab from './tabs/QuickTipsTab'
import VisaTab from './tabs/VisaTab'
import TransportTab from './tabs/TransportTab'
import AccommodationTab from './tabs/AccommodationTab'
import SafetyTab from './tabs/SafetyTab'
import SettingsTab from './tabs/SettingsTab'
import BestTimeTab from './tabs/BestTimeTab'
import PackingListTab from './tabs/PackingListTab'
import EmergencyTab from './tabs/EmergencyTab'

export default function TravelGuideManagement() {
  const { locale } = useApp()
  const isAr = locale === 'ar'

  // ═══════════════════════════════════════════════════════════
  // Tabs State
  // ═══════════════════════════════════════════════════════════
  const [activeTab, setActiveTab] = useState('quick-tips')

  const tabs = useMemo(() => ([
    {
      id: 'settings',
      label: { ar: 'الإعدادات', en: 'Settings' },
      icon: '⚙️',
      description: { ar: 'إعدادات الصفحة (Hero)', en: 'Page Settings (Hero)' }
    },
    {
      id: 'quick-tips',
      label: { ar: 'نصائح سريعة', en: 'Quick Tips' },
      icon: '💡',
      description: { ar: 'نصائح عامة ومهمة', en: 'General important tips' }
    },
    {
      id: 'visa',
      label: { ar: 'التأشيرة', en: 'Visa' },
      icon: '🛂',
      description: { ar: 'متطلبات الدخول', en: 'Entry requirements' }
    },
    {
      id: 'transport',
      label: { ar: 'النقل', en: 'Transport' },
      icon: '✈️',
      description: { ar: 'طيران ونقل محلي', en: 'Flights & Local Transport' }
    },
    {
      id: 'accommodation',
      label: { ar: 'السكن', en: 'Accommodation' },
      icon: '🏨',
      description: { ar: 'أنواع السكن', en: 'Accommodation Types' }
    },
    {
      id: 'time',
      label: { ar: 'الوقت المناسب', en: 'Best Time' },
      icon: '📅',
      description: { ar: 'المواسم والطقس', en: 'Seasons & Weather' }
    },
    {
      id: 'safety',
      label: { ar: 'السلامة', en: 'Safety' },
      icon: '🛡️',
      description: { ar: 'إرشادات السلامة', en: 'Safety Guidelines' }
    },
    {
      id: 'packing-list',
      label: { ar: 'الحقيبة', en: 'Packing List' },
      icon: '🎒',
      description: { ar: 'قائمة الأمتعة', en: 'Packing Essentials' }
    },
    {
      id: 'emergency',
      label: { ar: 'الطوارئ', en: 'Emergency' },
      icon: '🚨',
      description: { ar: 'أرقام الطوارئ', en: 'Contact Numbers' }
    },
  ]), [])

  useEffect(() => {
    const hash = typeof window !== 'undefined' ? window.location.hash.replace('#', '') : ''
    const stored = typeof window !== 'undefined' ? localStorage.getItem('travel-guide-tab') : ''
    const initial = tabs.some(tab => tab.id === hash)
      ? hash
      : (tabs.some(tab => tab.id === stored) ? stored : 'quick-tips')
    setActiveTab(initial)
  }, [tabs])

  const handleTabChange = (tabId) => {
    setActiveTab(tabId)
    if (typeof window !== 'undefined') {
      window.history.replaceState(null, '', `#${tabId}`)
      localStorage.setItem('travel-guide-tab', tabId)
    }
  }

  // ═══════════════════════════════════════════════════════════
  // Render
  // ═══════════════════════════════════════════════════════════
  return (
    <AdminLayout>
      {/* ════════════════════════════════════════════════════
            Header Section
            ════════════════════════════════════════════════════ */}
      <div className="bg-gradient-to-r from-cyan-600 via-blue-600 to-purple-600 text-white shadow-2xl rounded-b-3xl mb-8 -mx-6 -mt-6 p-8">
        <div className="container mx-auto">
          {/* Title */}
          <div className="flex items-center gap-4 mb-8">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-4xl shadow-lg">
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
                  onClick={() => handleTabChange(tab.id)}
                  className={`
                      group relative px-5 py-3 rounded-xl font-semibold transition-all duration-300 flex items-center gap-3
                      ${isActive
                      ? 'bg-white text-blue-900 shadow-xl scale-105 ring-2 ring-white/50'
                      : 'bg-white/10 backdrop-blur-md text-white hover:bg-white/20 hover:scale-105'}
                    `}
                >
                  <span className="text-2xl">{tab.icon}</span>
                  <div className="text-left">
                    <div className="text-sm font-bold">{tab.label[locale]}</div>
                    {isActive && (
                      <div className="text-[10px] opacity-75 hidden md:block">{tab.description[locale]}</div>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
            Tab Content
            ════════════════════════════════════════════════════ */}
      <div className="container mx-auto pb-12">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'quick-tips' && <QuickTipsTab />}
            {activeTab === 'visa' && <VisaTab />}
            {activeTab === 'transport' && <TransportTab />}
            {activeTab === 'accommodation' && <AccommodationTab />}
            {activeTab === 'time' && <BestTimeTab />}
            {activeTab === 'safety' && <SafetyTab />}
            {activeTab === 'packing-list' && <PackingListTab />}
            {activeTab === 'emergency' && <EmergencyTab />}
            {activeTab === 'settings' && <SettingsTab />}
          </motion.div>
        </AnimatePresence>
      </div>

    </AdminLayout>
  )
}
