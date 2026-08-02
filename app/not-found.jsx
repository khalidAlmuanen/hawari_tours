'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/contexts/AppContext'

export default function NotFound() {
  const router = useRouter()
  const { locale } = useApp()
  const isAr = locale === 'ar'

  useEffect(() => {
    router.replace('/')
  }, [router])

  return (
    <div className={`min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-6 ${isAr ? 'rtl' : 'ltr'}`}>
      <div className="max-w-xl w-full text-center">
        <div className="text-6xl font-black text-gray-900 dark:text-white mb-4">404</div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          {isAr ? 'الصفحة غير موجودة' : 'Page Not Found'}
        </h1>
        <p className="text-gray-600 dark:text-gray-400 mb-8">
          {isAr
            ? 'يبدو أن الرابط غير صحيح أو تم نقل الصفحة.'
            : 'The link is invalid or the page has been moved.'}
        </p>
        <a
          href={isAr ? '/ar' : '/'}
          className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition"
        >
          {isAr ? 'العودة للرئيسية' : 'Back to Home'}
        </a>
      </div>
    </div>
  )
}
