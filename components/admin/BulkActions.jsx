// ═══════════════════════════════════════════════════════════════
// ✅ BULK ACTIONS - Multi-Select Component
// مكون الإجراءات الجماعية مع تحديد متعدد
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function useBulkSelection(items = []) {
    const [selectedIds, setSelectedIds] = useState(new Set())
    const [isSelectAll, setIsSelectAll] = useState(false)

    // Toggle single item
    const toggleItem = (id) => {
        setSelectedIds(prev => {
            const newSet = new Set(prev)
            if (newSet.has(id)) {
                newSet.delete(id)
            } else {
                newSet.add(id)
            }
            return newSet
        })
    }

    // Toggle all items
    const toggleAll = () => {
        if (isSelectAll) {
            setSelectedIds(new Set())
        } else {
            setSelectedIds(new Set(items.map(item => item.id)))
        }
        setIsSelectAll(!isSelectAll)
    }

    // Clear selection
    const clearSelection = () => {
        setSelectedIds(new Set())
        setIsSelectAll(false)
    }

    // Get selected items
    const getSelectedItems = () => {
        return items.filter(item => selectedIds.has(item.id))
    }

    // Update isSelectAll when selectedIds changes
    useEffect(() => {
        const allSelected = items.length > 0 && items.every(item => selectedIds.has(item.id))
        setIsSelectAll(allSelected)
    }, [selectedIds, items])

    return {
        selectedIds,
        selectedCount: selectedIds.size,
        isSelectAll,
        toggleItem,
        toggleAll,
        clearSelection,
        getSelectedItems,
        isSelected: (id) => selectedIds.has(id)
    }
}

// ═══════════════════════════════════════════════════════════════
// 📊 BULK ACTIONS BAR
// ═══════════════════════════════════════════════════════════════
export function BulkActionsBar({
    selectedCount,
    onClear,
    actions = [], // Array of { label, icon, onClick, variant }
    isAr = false
}) {
    return (
        <AnimatePresence>
            {selectedCount > 0 && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="fixed top-20 left-1/2 -translate-x-1/2 z-40 bg-gradient-to-r from-blue-600 to-cyan-600 
            text-white px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-4"
                >
                    {/* Selected Count */}
                    <div className="flex items-center gap-2 px-4 py-2 bg-white/20 rounded-lg">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span className="font-bold">
                            {selectedCount} {isAr ? 'محدد' : 'Selected'}
                        </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-2">
                        {actions.map((action, index) => (
                            <motion.button
                                key={index}
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={action.onClick}
                                className={`px-4 py-2 rounded-lg font-semibold transition-all flex items-center gap-2
                  ${action.variant === 'danger'
                                        ? 'bg-red-500 hover:bg-red-600 text-white'
                                        : action.variant === 'success'
                                            ? 'bg-green-500 hover:bg-green-600 text-white'
                                            : 'bg-white/20 hover:bg-white/30 text-white'
                                    }`}
                            >
                                {action.icon && <span className="text-lg">{action.icon}</span>}
                                {action.label}
                            </motion.button>
                        ))}
                    </div>

                    {/* Clear Button */}
                    <button
                        onClick={onClear}
                        className="ml-2 p-2 hover:bg-white/20 rounded-lg transition-colors"
                        title={isAr ? 'إلغاء التحديد' : 'Clear Selection'}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

// ═══════════════════════════════════════════════════════════════
// ☑️ CHECKBOX COMPONENT
// ═══════════════════════════════════════════════════════════════
export function BulkCheckbox({
    checked,
    onChange,
    indeterminate = false,
    className = ''
}) {
    return (
        <label className={`relative flex items-center cursor-pointer ${className}`}>
            <input
                type="checkbox"
                checked={checked}
                onChange={onChange}
                className="sr-only peer"
            />
            <div className={`w-5 h-5 border-2 rounded transition-all
        ${checked
                    ? 'bg-green-600 border-green-600'
                    : indeterminate
                        ? 'bg-blue-600 border-blue-600'
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700'
                }
        peer-hover:border-green-500 peer-focus:ring-2 peer-focus:ring-green-500 peer-focus:ring-offset-2
      `}>
                {checked && (
                    <svg className="w-full h-full text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                    </svg>
                )}
                {!checked && indeterminate && (
                    <svg className="w-full h-full text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" />
                    </svg>
                )}
            </div>
        </label>
    )
}

// ═══════════════════════════════════════════════════════════════
// 🎯 BULK ACTION EXAMPLES
// ═══════════════════════════════════════════════════════════════
export const BulkActionPresets = {
    // For Reviews
    reviews: (onApprove, onReject, onDelete, isAr = false) => [
        {
            label: isAr ? 'اعتماد الكل' : 'Approve All',
            icon: '✅',
            onClick: onApprove,
            variant: 'success'
        },
        {
            label: isAr ? 'رفض الكل' : 'Reject All',
            icon: '❌',
            onClick: onReject,
            variant: 'default'
        },
        {
            label: isAr ? 'حذف الكل' : 'Delete All',
            icon: '🗑️',
            onClick: onDelete,
            variant: 'danger'
        }
    ],

    // For Testimonials
    testimonials: (onPublish, onUnpublish, onDelete, isAr = false) => [
        {
            label: isAr ? 'نشر الكل' : 'Publish All',
            icon: '📢',
            onClick: onPublish,
            variant: 'success'
        },
        {
            label: isAr ? 'إلغاء النشر' : 'Unpublish',
            icon: '📝',
            onClick: onUnpublish,
            variant: 'default'
        },
        {
            label: isAr ? 'حذف الكل' : 'Delete All',
            icon: '🗑️',
            onClick: onDelete,
            variant: 'danger'
        }
    ],

    // Generic
    generic: (onAction, actionLabel, isAr = false) => [
        {
            label: actionLabel,
            icon: '⚡',
            onClick: onAction,
            variant: 'default'
        }
    ]
}
