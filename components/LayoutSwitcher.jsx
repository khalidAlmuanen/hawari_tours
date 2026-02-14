'use client'

// ═══════════════════════════════════════════════════════════════
// 🔀 Layout Switcher - إخفاء Navbar/Footer في مسارات الـ admin
// ═══════════════════════════════════════════════════════════════

import { usePathname } from 'next/navigation'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function LayoutSwitcher({ children }) {
  const pathname = usePathname()
  const isAdminRoute = pathname?.startsWith('/admin')

  // مسارات الـ admin لا تعرض Navbar و Footer
  if (isAdminRoute) {
    return <>{children}</>
  }

  // المسارات العادية تعرض Navbar و Footer
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
