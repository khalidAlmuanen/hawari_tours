// ═══════════════════════════════════════════════════════════════
// 🍞 BREADCRUMBS - Navigation Component
// مكون المسار التفصيلي للتنقل
// ═══════════════════════════════════════════════════════════════

import Link from 'next/link'
import { motion } from 'framer-motion'

export default function Breadcrumbs({ items = [], className = '' }) {
    if (!items || items.length === 0) return null

    return (
        <nav className={`flex items-center space-x-2 text-sm ${className}`} aria-label="Breadcrumb">
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-2"
            >
                {/* Home Icon */}
                <Link
                    href="/admin"
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 
            transition-colors flex items-center"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                </Link>

                {/* Breadcrumb Items */}
                {items.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                        {/* Separator */}
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>

                        {/* Item */}
                        {index === items.length - 1 ? (
                            // Current page - not clickable
                            <span className="font-semibold text-gray-900 dark:text-white flex items-center gap-2">
                                {item.icon && <span>{item.icon}</span>}
                                {item.label}
                            </span>
                        ) : (
                            // Link
                            <Link
                                href={item.href}
                                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 
                  transition-colors flex items-center gap-2"
                            >
                                {item.icon && <span>{item.icon}</span>}
                                {item.label}
                            </Link>
                        )}
                    </div>
                ))}
            </motion.div>
        </nav>
    )
}

// ═══════════════════════════════════════════════════════════════
// 🎯 BREADCRUMB PRESETS
// ═══════════════════════════════════════════════════════════════
export const BreadcrumbPresets = {
    // Admin sections
    testimonials: (isAr = false) => [
        { label: isAr ? 'لوحة التحكم' : 'Dashboard', href: '/admin', icon: '🏠' },
        { label: isAr ? 'إدارة التقييمات' : 'Testimonials', icon: '⭐' }
    ],

    reviews: (isAr = false) => [
        { label: isAr ? 'لوحة التحكم' : 'Dashboard', href: '/admin', icon: '🏠' },
        { label: isAr ? 'إدارة المراجعات' : 'Reviews', icon: '💬' }
    ],

    analytics: (isAr = false) => [
        { label: isAr ? 'لوحة التحكم' : 'Dashboard', href: '/admin', icon: '🏠' },
        { label: isAr ? 'التحليلات' : 'Analytics', icon: '📊' }
    ],

    history: (isAr = false) => [
        { label: isAr ? 'لوحة التحكم' : 'Dashboard', href: '/admin', icon: '🏠' },
        { label: isAr ? 'إدارة المحتوى التاريخي' : 'History', icon: '📜' }
    ],

    uniqueFeatures: (isAr = false) => [
        { label: isAr ? 'لوحة التحكم' : 'Dashboard', href: '/admin', icon: '🏠' },
        { label: isAr ? 'الميزات الفريدة' : 'Unique Features', icon: '🌟' }
    ],

    contact: (isAr = false) => [
        { label: isAr ? 'لوحة التحكم' : 'Dashboard', href: '/admin', icon: '🏠' },
        { label: isAr ? 'إعدادات التواصل' : 'Contact Settings', icon: '📞' }
    ]
}
