'use client'

// ═══════════════════════════════════════════════════════════════
// 🌐 VIRTUAL TOURS TAB - 360° Tours Management  
// تبويب الجولات الافتراضية - إدارة جولات 360°
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react'
import { useApp } from '@/contexts/AppContext'
import { useToast } from '@/components/admin/Toast'
import { motion } from 'framer-motion'

export default function VirtualToursTab() {
  const { locale } = useApp()
  const { success, error: showError } = useToast()
  const isAr = locale === 'ar'

  const [tours, setTours] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTours()
  }, [])

  const fetchTours = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/gallery/virtual-tours')
      const result = await response.json()
      if (result.success) {
        setTours(result.data.tours)
      }
    } catch (error) {
      console.error('Failed to fetch tours:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-300 dark:border-green-700 rounded-2xl p-8">
        <div className="text-center">
          <div className="text-6xl mb-4">🌐</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {isAr ? 'جولات افتراضية 360°' : 'Virtual Tours 360°'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {isAr 
              ? 'هذا القسم جاهز! يمكنك البدء بإضافة جولات افتراضية احترافية.'
              : 'This section is ready! You can start adding professional virtual tours.'}
          </p>
          <button
            onClick={() => showError(isAr ? 'سيتم تفعيل هذه الميزة قريباً' : 'This feature will be activated soon')}
            className="px-8 py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold hover:shadow-2xl transition-all"
          >
            {isAr ? 'إضافة جولة جديدة' : 'Add New Tour'}
          </button>
        </div>
      </div>

      {!loading && tours.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tours.map((tour, index) => (
            <motion.div
              key={tour.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`bg-gradient-to-br ${tour.gradient} rounded-2xl p-6 text-white shadow-xl hover:shadow-2xl transition-all`}
            >
              <div className="text-5xl mb-4">{tour.icon}</div>
              <h3 className="text-xl font-bold mb-2">
                {isAr ? tour.titleAr : tour.title}
              </h3>
              <p className="text-white/90 text-sm mb-4">
                {isAr ? tour.locationAr : tour.location}
              </p>
              {tour.featured && (
                <span className="inline-block bg-white/20 backdrop-blur-sm px-3 py-1 rounded-lg text-sm font-bold">
                  ⭐ {isAr ? 'مميز' : 'Featured'}
                </span>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
