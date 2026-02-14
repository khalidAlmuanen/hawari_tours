'use client'

// ═══════════════════════════════════════════════════════════════
// 📸 COMPLETE GALLERY MANAGEMENT - Ultra Professional
// إدارة المعرض الشاملة - احترافية جداً مع نظام Tabs
// Features: Images, Videos, Virtual Tours, Instagram, Settings
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react'
import { useApp } from '@/contexts/AppContext'
import AdminLayout from '@/components/admin/AdminLayout'
import { useToast } from '@/components/admin/Toast'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

// Import individual tab components (will create separately)
import ImagesTab from './tabs/ImagesTab'
import VideosTab from './tabs/VideosTab'
import VirtualToursTab from './tabs/VirtualToursTab'
import InstagramTab from './tabs/InstagramTab'
import SettingsTab from './tabs/SettingsTab'

export default function CompleteGalleryManagement() {
  const { locale } = useApp()
  const { success, error: showError, info } = useToast()
  const isAr = locale === 'ar'

  // ═══════════════════════════════════════════════════════════
  // Tabs State
  // ═══════════════════════════════════════════════════════════
  const [activeTab, setActiveTab] = useState('images')

  const tabs = [
    {
      id: 'images',
      label: { ar: 'الصور', en: 'Images' },
      icon: '📸',
      gradient: 'from-blue-500 to-cyan-600',
      description: { ar: 'إدارة صور المعرض', en: 'Manage Gallery Images' }
    },
    {
      id: 'videos',
      label: { ar: 'الفيديوهات', en: 'Videos' },
      icon: '🎬',
      gradient: 'from-purple-500 to-pink-600',
      description: { ar: 'إدارة الفيديوهات', en: 'Manage Videos' }
    },
    {
      id: 'virtual-tours',
      label: { ar: 'جولات 360°', en: '360° Tours' },
      icon: '🌐',
      gradient: 'from-green-500 to-emerald-600',
      description: { ar: 'جولات افتراضية', en: 'Virtual Tours' }
    },
    {
      id: 'instagram',
      label: { ar: 'إنستغرام', en: 'Instagram' },
      icon: '📱',
      gradient: 'from-pink-500 to-rose-600',
      description: { ar: 'منشورات إنستغرام', en: 'Instagram Posts' }
    },
    {
      id: 'settings',
      label: { ar: 'الإعدادات', en: 'Settings' },
      icon: '⚙️',
      gradient: 'from-gray-500 to-slate-600',
      description: { ar: 'إعدادات المعرض', en: 'Gallery Settings' }
    }
  ]

  // ═══════════════════════════════════════════════════════════
  // Render
  // ═══════════════════════════════════════════════════════════
  return (
    <AdminLayout>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900/20">
        
        {/* ════════════════════════════════════════════════════
            Header Section
            ════════════════════════════════════════════════════ */}
        <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-white shadow-2xl">
          <div className="container mx-auto px-6 py-8">
            {/* Title */}
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center text-4xl">
                📸
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold mb-2">
                  {isAr ? 'إدارة المعرض الشاملة' : 'Complete Gallery Management'}
                </h1>
                <p className="text-white/90 text-lg">
                  {isAr 
                    ? 'تحكم كامل في كل عناصر صفحة المعرض'
                    : 'Full control over all gallery page elements'}
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
                        layoutId="activeTab"
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
              {activeTab === 'images' && <ImagesTab />}
              {activeTab === 'videos' && <VideosTab />}
              {activeTab === 'virtual-tours' && <VirtualToursTab />}
              {activeTab === 'instagram' && <InstagramTab />}
              {activeTab === 'settings' && <SettingsTab />}
            </motion.div>
          </AnimatePresence>
        </div>

      </div>
    </AdminLayout>
  )
}
