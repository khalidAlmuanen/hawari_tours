'use client'

// ═══════════════════════════════════════════════════════════════
// 📸 COMPLETE GALLERY MANAGEMENT - Ultra Professional (RTL)
// إدارة المعرض الشاملة - تصميم عصري واحترافي
// ═══════════════════════════════════════════════════════════════

import { useState } from 'react'
import { useApp } from '@/contexts/AppContext'
import AdminLayout from '@/components/admin/AdminLayout'
import { motion, AnimatePresence } from 'framer-motion'

// Import individual tab components
import ImagesTab from './tabs/ImagesTab'
import VideosTab from './tabs/VideosTab'
import VirtualToursTab from './tabs/VirtualToursTab'
import InstagramTab from './tabs/InstagramTab'
import SettingsTab from './tabs/SettingsTab'

export default function CompleteGalleryManagement() {
  const { locale } = useApp()
  const isAr = true // Force Arabic for Admin UI as requested

  // ═══════════════════════════════════════════════════════════
  // Tabs State
  // ═══════════════════════════════════════════════════════════
  const [activeTab, setActiveTab] = useState('images')

  const tabs = [
    {
      id: 'images',
      label: 'مكتبة الصور',
      icon: '📸',
      gradient: 'from-blue-500 to-cyan-600',
      description: 'رفع وإدارة صور المعرض وتصنيفها',
      bgColor: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400'
    },
    {
      id: 'videos',
      label: 'مكتبة الفيديو',
      icon: '🎬',
      gradient: 'from-purple-500 to-pink-600',
      description: 'إدارة روابط يوتيوب والفيديوهات المميزة',
      bgColor: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400'
    },
    {
      id: 'virtual-tours',
      label: 'جولات 360°',
      icon: '🌐',
      gradient: 'from-green-500 to-emerald-600',
      description: 'إضافة الجولات الافتراضية التفاعلية',
      bgColor: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400'
    },
    {
      id: 'instagram',
      label: 'إنستغرام',
      icon: '📱',
      gradient: 'from-pink-500 to-rose-600',
      description: 'ربط وعرض منشورات إنستغرام',
      bgColor: 'bg-pink-50 text-pink-600 dark:bg-pink-900/20 dark:text-pink-400'
    },
    {
      id: 'settings',
      label: 'الإعدادات',
      icon: '⚙️',
      gradient: 'from-gray-600 to-slate-700',
      description: 'تخصيص نصوص وعناوين صفحة المعرض',
      bgColor: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300'
    }
  ]

  // ═══════════════════════════════════════════════════════════
  // Render
  // ═══════════════════════════════════════════════════════════
  return (
    <AdminLayout>
      <div className="min-h-screen bg-gray-50/50 dark:bg-gray-900 transition-colors duration-300" dir="rtl">

        {/* ════════════════════════════════════════════════════
            Header Section
            ════════════════════════════════════════════════════ */}
        <div className="bg-white border-b border-gray-200 sticky top-0 z-30 shadow-sm backdrop-blur-md bg-white/80 dark:bg-gray-800/80 dark:border-gray-700 transition-colors duration-300">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center text-2xl shadow-lg shadow-indigo-200 dark:shadow-none text-white">
                  🎨
                </div>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800 dark:text-white transition-colors">إدارة المعرض والوسائط</h1>
                  <p className="text-sm text-gray-500 dark:text-gray-400 transition-colors">التحكم الكامل في المحتوى المرئي للموقع</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div className="container mx-auto px-6 mt-4">
            <div className="flex gap-2 overflow-x-auto pb-4 no-scrollbar">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      relative flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-300 font-bold whitespace-nowrap
                      ${isActive
                        ? `bg-gradient-to-l ${tab.gradient} text-white shadow-lg shadow-gray-200 dark:shadow-none scale-105`
                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700 dark:hover:bg-gray-700'
                      }
                    `}
                  >
                    <span className="text-xl">{tab.icon}</span>
                    <span>{tab.label}</span>
                    {isActive && (
                      <motion.div
                        layoutId="activeTabIndicator"
                        className="absolute -bottom-4 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-current to-transparent opacity-50"
                      />
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════════
            Content Area
            ════════════════════════════════════════════════════ */}
        <div className="container mx-auto px-6 py-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              {/* Tab Header Info */}
              <div className="mb-8 p-6 bg-white rounded-2xl border border-gray-100 shadow-sm flex items-start gap-4 dark:bg-gray-800 dark:border-gray-700 transition-colors duration-300">
                <div className={`p-4 rounded-xl ${tabs.find(t => t.id === activeTab).bgColor} transition-colors`}>
                  <span className="text-3xl">{tabs.find(t => t.id === activeTab).icon}</span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-1 dark:text-white transition-colors">
                    {tabs.find(t => t.id === activeTab).label}
                  </h2>
                  <p className="text-gray-500 dark:text-gray-400 transition-colors">
                    {tabs.find(t => t.id === activeTab).description}
                  </p>
                </div>
              </div>

              {/* Tab Content */}
              <div className="bg-white rounded-3xl shadow-xl shadow-gray-100/50 border border-gray-100 p-6 min-h-[500px] dark:bg-gray-800 dark:border-gray-700 dark:shadow-none transition-colors duration-300">
                {activeTab === 'images' && <ImagesTab />}
                {activeTab === 'videos' && <VideosTab />}
                {activeTab === 'virtual-tours' && <VirtualToursTab />}
                {activeTab === 'instagram' && <InstagramTab />}
                {activeTab === 'settings' && <SettingsTab />}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </AdminLayout>
  )
}
