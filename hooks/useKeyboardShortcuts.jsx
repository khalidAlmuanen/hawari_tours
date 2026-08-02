// ═══════════════════════════════════════════════════════════════
// ⌨️ KEYBOARD SHORTCUTS - Global Shortcuts Hook
// اختصارات لوحة المفاتيح العامة
// ═══════════════════════════════════════════════════════════════

import { useEffect, useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ═══════════════════════════════════════════════════════════════
// SHORTCUTS HOOK
// ═══════════════════════════════════════════════════════════════
export function useKeyboardShortcuts(shortcuts = {}) {
    useEffect(() => {
        const handleKeyDown = (event) => {
            const { key, ctrlKey, metaKey, shiftKey, altKey } = event

            // Check each shortcut
            Object.entries(shortcuts).forEach(([shortcutKey, handler]) => {
                const parts = shortcutKey.split('+').map(p => p.trim().toLowerCase())

                const needsCtrl = parts.includes('ctrl') || parts.includes('cmd')
                const needsShift = parts.includes('shift')
                const needsAlt = parts.includes('alt')
                const mainKey = parts[parts.length - 1]

                const ctrlPressed = ctrlKey || metaKey

                if (
                    key.toLowerCase() === mainKey &&
                    (!needsCtrl || ctrlPressed) &&
                    (!needsShift || shiftKey) &&
                    (!needsAlt || altKey)
                ) {
                    event.preventDefault()
                    handler(event)
                }
            })
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [shortcuts])
}

// ═══════════════════════════════════════════════════════════════
// SHORTCUTS HELP MODAL
// ═══════════════════════════════════════════════════════════════
export function KeyboardShortcutsHelp({ shortcuts = [], isAr = false }) {
    const [isOpen, setIsOpen] = useState(false)

    // Listen for "?" key
    useKeyboardShortcuts({
        '?': () => setIsOpen(true),
        'Escape': () => setIsOpen(false)
    })

    if (!shortcuts.length) return null

    return (
        <>
            {/* Help Button */}
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 w-12 h-12 bg-green-600 hover:bg-green-700 text-white 
          rounded-full shadow-2xl flex items-center justify-center text-xl font-bold z-40
          transition-all hover:scale-110"
                title={isAr ? 'اختصارات لوحة المفاتيح (?)' : 'Keyboard Shortcuts (?)'}
            >
                ⌨️
            </button>

            {/* Modal */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setIsOpen(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full 
                max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Header */}
                            <div className="sticky top-0 bg-gradient-to-r from-green-600 to-emerald-600 
                text-white px-6 py-4 flex items-center justify-between z-10 rounded-t-2xl">
                                <div className="flex items-center gap-3">
                                    <span className="text-3xl">⌨️</span>
                                    <h3 className="text-2xl font-bold">
                                        {isAr ? 'اختصارات لوحة المفاتيح' : 'Keyboard Shortcuts'}
                                    </h3>
                                </div>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="text-white hover:text-gray-200 transition-colors"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-4">
                                {shortcuts.map((shortcut, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/50 
                      rounded-xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                                    >
                                        <div className="flex items-center gap-3">
                                            {shortcut.icon && (
                                                <span className="text-2xl">{shortcut.icon}</span>
                                            )}
                                            <div>
                                                <p className="font-semibold text-gray-900 dark:text-white">
                                                    {shortcut.description}
                                                </p>
                                                {shortcut.note && (
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        {shortcut.note}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {shortcut.keys.map((key, i) => (
                                                <span key={i} className="flex items-center">
                                                    <kbd className="px-3 py-1.5 bg-white dark:bg-gray-600 border-2 
                            border-gray-300 dark:border-gray-500 rounded-lg font-mono font-bold 
                            text-gray-700 dark:text-gray-200 shadow-sm min-w-[2.5rem] text-center">
                                                        {key}
                                                    </kbd>
                                                    {i < shortcut.keys.length - 1 && (
                                                        <span className="mx-1 text-gray-400">+</span>
                                                    )}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Footer */}
                            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700/30 rounded-b-2xl 
                border-t border-gray-200 dark:border-gray-700">
                                <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
                                    {isAr
                                        ? 'اضغط "؟" في أي وقت لعرض هذه القائمة'
                                        : 'Press "?" anytime to show this list'}
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}

// ═══════════════════════════════════════════════════════════════
// COMMON SHORTCUTS PRESETS
// ═══════════════════════════════════════════════════════════════
export const COMMON_SHORTCUTS = {
    // English
    en: [
        {
            keys: ['Ctrl', 'K'],
            description: 'Quick Search',
            icon: '🔍',
            note: 'Open global search'
        },
        {
            keys: ['Ctrl', 'N'],
            description: 'New Item',
            icon: '➕',
            note: 'Create new entry'
        },
        {
            keys: ['Ctrl', 'S'],
            description: 'Save',
            icon: '💾',
            note: 'Save current changes'
        },
        {
            keys: ['Escape'],
            description: 'Close Modal',
            icon: '✖️',
            note: 'Close any open dialog'
        },
        {
            keys: ['/'],
            description: 'Focus Search',
            icon: '🎯',
            note: 'Jump to search box'
        },
        {
            keys: ['?'],
            description: 'Show Shortcuts',
            icon: '⌨️',
            note: 'Display this help'
        },
        {
            keys: ['Ctrl', 'E'],
            description: 'Export Data',
            icon: '📤',
            note: 'Export current view'
        },
        {
            keys: ['Ctrl', 'A'],
            description: 'Select All',
            icon: '✅',
            note: 'Select all items'
        }
    ],

    // Arabic
    ar: [
        {
            keys: ['Ctrl', 'K'],
            description: 'بحث سريع',
            icon: '🔍',
            note: 'فتح البحث العام'
        },
        {
            keys: ['Ctrl', 'N'],
            description: 'عنصر جديد',
            icon: '➕',
            note: 'إنشاء إدخال جديد'
        },
        {
            keys: ['Ctrl', 'S'],
            description: 'حفظ',
            icon: '💾',
            note: 'حفظ التغييرات الحالية'
        },
        {
            keys: ['Escape'],
            description: 'إغلاق النافذة',
            icon: '✖️',
            note: 'إغلاق أي نافذة مفتوحة'
        },
        {
            keys: ['/'],
            description: 'التركيز على البحث',
            icon: '🎯',
            note: 'الانتقال إلى مربع البحث'
        },
        {
            keys: ['?'],
            description: 'عرض الاختصارات',
            icon: '⌨️',
            note: 'عرض هذه المساعدة'
        },
        {
            keys: ['Ctrl', 'E'],
            description: 'تصدير البيانات',
            icon: '📤',
            note: 'تصدير العرض الحالي'
        },
        {
            keys: ['Ctrl', 'A'],
            description: 'تحديد الكل',
            icon: '✅',
            note: 'تحديد جميع العناصر'
        }
    ]
}

// Default export
export default useKeyboardShortcuts

