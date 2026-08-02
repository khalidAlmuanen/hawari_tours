'use client'

import { useEffect, useState } from 'react'
import { useApp } from '@/contexts/AppContext'
import PackageCard from '@/components/PackageCard'

export default function PackagesPage() {
  const { locale } = useApp()
  const isAr = locale === 'ar'
  const [packages, setPackages] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        setLoading(true)
        const res = await fetch('/api/packages')
        const data = await res.json()
        if (data.success) {
          setPackages(data.data)
        } else {
          throw new Error(data.error || 'Failed to fetch packages')
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchPackages()
  }, [])

  return (
    <div className="pt-28 pb-20 bg-white dark:bg-gray-900 transition-colors min-h-screen">
      <div className="container-custom">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-block px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-semibold mb-6">
            {isAr ? 'الباقات السياحية' : 'Travel Packages'}
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            {isAr ? 'اختر الباقة الأنسب لك' : 'Choose the Package That Fits You'}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {isAr
              ? 'باقات شاملة للإقامة والطعام والنقل والأنشطة'
              : 'All-inclusive packages covering accommodation, meals, transport, and activities'}
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          </div>
        ) : error ? (
          <div className="text-center text-red-500 py-12">{error}</div>
        ) : packages.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {packages.map((pkg) => (
              <PackageCard key={pkg.id} pkg={pkg} />
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-500 py-12">
            {isAr ? 'لا توجد باقات حالياً' : 'No packages available right now'}
          </div>
        )}
      </div>
    </div>
  )
}
