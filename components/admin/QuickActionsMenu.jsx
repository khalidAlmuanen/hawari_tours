// ═══════════════════════════════════════════════════════════════
// ⚡ QUICK ACTIONS MENU - Floating Action Button
// قائمة الإجراءات السريعة مع زر عائم
// ═══════════════════════════════════════════════════════════════

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function QuickActionsMenu({ actions = [], position = 'bottom-right', isAr = false }) {
    const [isOpen, setIsOpen] = useState(false)

    const positions = {
        'bottom-right': 'bottom-6 right-6',
        'bottom-left': 'bottom-6 left-6',
        'top-right': 'top-6 right-6',
        'top-left': 'top-6 left-6',
    }

    if (!actions || actions.length === 0) return null

    return (
        <div className={`fixed ${positions[position]} z-40`}>
            {/* Action Items */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0, y: 20 }}
                        className="mb-4 space-y-3"
                    >
                        {actions.map((action, index) => (
                            <motion.button
                                key={index}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ delay: index * 0.05 }}
                                onClick={() => {
                                    action.onClick?.()
                                    setIsOpen(false)
                                }}
                                className="flex items-center gap-3 bg-white dark:bg-gray-800 hover:bg-gray-50 
                  dark:hover:bg-gray-700 text-gray-900 dark:text-white px-4 py-3 rounded-xl 
                  shadow-lg border border-gray-200 dark:border-gray-700 transition-all 
                  hover:shadow-xl group w-full"
                                whileHover={{ scale: 1.05, x: -5 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${action.gradient || 'from-green-500 to-emerald-600'} 
                  flex items-center justify-center text-white text-xl flex-shrink-0`}>
                                    {action.icon}
                                </div>
                                <div className="text-left flex-1">
                                    <p className="font-semibold text-sm">{action.label}</p>
                                    {action.description && (
                                        <p className="text-xs text-gray-500 dark:text-gray-400">{action.description}</p>
                                    )}
                                </div>
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Main FAB */}
            <motion.button
                onClick={() => setIsOpen(!isOpen)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className={`w-14 h-14 rounded-full bg-gradient-to-br from-green-600 to-emerald-600 
          text-white shadow-2xl flex items-center justify-center text-2xl font-bold 
          transition-all hover:shadow-green-500/50 ${isOpen ? 'rotate-45' : ''}`}
            >
                {isOpen ? '✕' : '+'}
            </motion.button>

            {/* Backdrop */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsOpen(false)}
                        className="fixed inset-0 bg-black/20 backdrop-blur-sm -z-10"
                    />
                )}
            </AnimatePresence>
        </div>
    )
}

// ═══════════════════════════════════════════════════════════════
// 🎯 QUICK ACTIONS PRESETS
// ═══════════════════════════════════════════════════════════════
export const QuickActionsPresets = {
    // Reviews Page
    reviews: (onAddReview, onExport, onSettings, isAr = false) => [
        {
            icon: '💬',
            label: isAr ? 'إضافة تقييم' : 'Add Review',
            description: isAr ? 'إضافة تقييم جديد' : 'Create new review',
            onClick: onAddReview,
            gradient: 'from-blue-500 to-cyan-600'
        },
        {
            icon: '📤',
            label: isAr ? 'تصدير' : 'Export',
            description: isAr ? 'تصدير التقييمات' : 'Export reviews data',
            onClick: onExport,
            gradient: 'from-purple-500 to-pink-600'
        },
        {
            icon: '⚙️',
            label: isAr ? 'إعدادات' : 'Settings',
            description: isAr ? 'إعدادات التقييمات' : 'Review settings',
            onClick: onSettings,
            gradient: 'from-gray-500 to-slate-600'
        }
    ],

    // Generic Actions
    generic: (actions, isAr = false) => actions.map((action, i) => ({
        ...action,
        gradient: action.gradient || [
            'from-green-500 to-emerald-600',
            'from-blue-500 to-cyan-600',
            'from-purple-500 to-pink-600',
            'from-orange-500 to-red-600'
        ][i % 4]
    }))
}
