'use client'

// ═══════════════════════════════════════════════════════════════
// 📐 Admin Layout Wrapper - يستخدم AdminLayout لجميع صفحات لوحة التحكم
// ═══════════════════════════════════════════════════════════════

import { usePathname } from 'next/navigation'
import AdminLayout from '@/components/admin/AdminLayout'
import { EnhancedToastProvider } from '@/components/admin/EnhancedToast'
import { AppProvider } from '@/contexts/AppContext'

export default function AdminLayoutWrapper({ children }) {
  const pathname = usePathname()

  // صفحات لا تحتاج AdminLayout (مثل Login)
  const noLayoutPages = ['/admin/login', '/admin/reset-password']
  const needsLayout = !noLayoutPages.includes(pathname)

  if (!needsLayout) {
    return (
      <AppProvider>
        <div className="min-h-screen">{children}</div>
      </AppProvider>
    )
  }

  return (
    <AppProvider>
      <EnhancedToastProvider>
        <AdminLayout>{children}</AdminLayout>
      </EnhancedToastProvider>
    </AppProvider>
  )
}
