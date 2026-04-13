// ═══════════════════════════════════════════════════════════════
// 📜 ACTIVITY LOG - Audit Trail Component
// سجل النشاطات والتغييرات
// ═══════════════════════════════════════════════════════════════

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function ActivityLog({
    activities = [],
    maxHeight = '400px',
    showFilters = true,
    onLoadMore,
    hasMore = false,
    isAr = false
}) {
    const [filter, setFilter] = useState('all') // 'all' | 'create' | 'update' | 'delete'
    const [isExpanded, setIsExpanded] = useState(false)

    const filteredActivities = activities.filter(activity =>
        filter === 'all' || activity.type === filter
    )

    const getActivityIcon = (type) => {
        const icons = {
            create: '➕',
            update: '✏️',
            delete: '🗑️',
            approve: '✅',
            reject: '❌',
            publish: '📢',
            unpublish: '📝'
        }
        return icons[type] || '📌'
    }

    const getActivityColor = (type) => {
        const colors = {
            create: 'from-green-500 to-emerald-600',
            update: 'from-blue-500 to-cyan-600',
            delete: 'from-red-500 to-rose-600',
            approve: 'from-green-500 to-emerald-600',
            reject: 'from-orange-500 to-red-600',
            publish: 'from-purple-500 to-pink-600',
            unpublish: 'from-gray-500 to-slate-600'
        }
        return colors[type] || 'from-gray-500 to-slate-600'
    }

    const formatDate = (date) => {
        const d = new Date(date)
        const now = new Date()
        const diffMs = now - d
        const diffMins = Math.floor(diffMs / 60000)
        const diffHours = Math.floor(diffMs / 3600000)
        const diffDays = Math.floor(diffMs / 86400000)

        if (diffMins < 1) return isAr ? 'الآن' : 'Just now'
        if (diffMins < 60) return `${diffMins} ${isAr ? 'دقيقة' : 'min'} ${isAr ? 'مضت' : 'ago'}`
        if (diffHours < 24) return `${diffHours} ${isAr ? 'ساعة' : 'hour'}${diffHours > 1 ? 's' : ''} ${isAr ? 'مضت' : 'ago'}`
        if (diffDays < 7) return `${diffDays} ${isAr ? 'يوم' : 'day'}${diffDays > 1 ? 's' : ''} ${isAr ? 'مضى' : 'ago'}`

        return d.toLocaleDateString(isAr ? 'ar' : 'en', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 flex items-center justify-between">
                <h3 className="text-xl font-bold flex items-center gap-2">
                    <span>📜</span>
                    {isAr ? 'سجل النشاطات' : 'Activity Log'}
                </h3>
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                >
                    {isExpanded ? '−' : '+'}
                </button>
            </div>

            <AnimatePresence>
                {(isExpanded || !showFilters) && (
                    <motion.div
                        initial={{ height: 0 }}
                        animate={{ height: 'auto' }}
                        exit={{ height: 0 }}
                        className="overflow-hidden"
                    >
                        {/* Filters */}
                        {showFilters && (
                            <div className="px-6 py-3 bg-gray-50 dark:bg-gray-700/30 flex flex-wrap gap-2">
                                {['all', 'create', 'update', 'delete', 'approve'].map(type => (
                                    <button
                                        key={type}
                                        onClick={() => setFilter(type)}
                                        className={`px-3 py-1 rounded-full text-sm font-semibold transition-all capitalize
                      ${filter === type
                                                ? 'bg-purple-600 text-white'
                                                : 'bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
                                            }`}
                                    >
                                        {type}
                                    </button>
                                ))}
                            </div>
                        )}

                        {/* Activities List */}
                        <div className="overflow-y-auto" style={{ maxHeight }}>
                            {filteredActivities.length === 0 ? (
                                <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                                    <div className="text-4xl mb-3">📭</div>
                                    <p>{isAr ? 'لا توجد نشاطات' : 'No activities yet'}</p>
                                </div>
                            ) : (
                                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                                    {filteredActivities.map((activity, index) => (
                                        <motion.div
                                            key={activity.id || index}
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.05 }}
                                            className="p-4 hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors"
                                        >
                                            <div className="flex items-start gap-3">
                                                {/* Icon */}
                                                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${getActivityColor(activity.type)} 
                          flex items-center justify-center text-white text-xl flex-shrink-0`}>
                                                    {getActivityIcon(activity.type)}
                                                </div>

                                                {/* Content */}
                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2">
                                                        <div>
                                                            <p className="font-semibold text-gray-900 dark:text-white">
                                                                {activity.message}
                                                            </p>
                                                            {activity.details && (
                                                                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                                    {activity.details}
                                                                </p>
                                                            )}
                                                            <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                                                                <span className="flex items-center gap-1">
                                                                    👤 {activity.user}
                                                                </span>
                                                                <span className="flex items-center gap-1">
                                                                    🕒 {formatDate(activity.timestamp)}
                                                                </span>
                                                            </div>
                                                        </div>

                                                        {/* Changes Badge */}
                                                        {activity.changes && (
                                                            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 
                                rounded-full text-xs font-semibold whitespace-nowrap">
                                                                {activity.changes} {isAr ? 'تغيير' : 'changes'}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            )}

                            {/* Load More */}
                            {hasMore && onLoadMore && (
                                <div className="p-4 text-center border-t border-gray-200 dark:border-gray-700">
                                    <button
                                        onClick={onLoadMore}
                                        className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg 
                      font-semibold transition-all"
                                    >
                                        {isAr ? 'تحميل المزيد' : 'Load More'}
                                    </button>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

// ═══════════════════════════════════════════════════════════════
// ACTIVITY TYPE GENERATOR
// ═══════════════════════════════════════════════════════════════
export const createActivity = {
    create: (user, item, details = '') => ({
        id: Date.now(),
        type: 'create',
        message: `Created ${item}`,
        details,
        user,
        timestamp: new Date().toISOString()
    }),

    update: (user, item, changes = 1, details = '') => ({
        id: Date.now(),
        type: 'update',
        message: `Updated ${item}`,
        details,
        user,
        changes,
        timestamp: new Date().toISOString()
    }),

    delete: (user, item, details = '') => ({
        id: Date.now(),
        type: 'delete',
        message: `Deleted ${item}`,
        details,
        user,
        timestamp: new Date().toISOString()
    }),

    approve: (user, item, details = '') => ({
        id: Date.now(),
        type: 'approve',
        message: `Approved ${item}`,
        details,
        user,
        timestamp: new Date().toISOString()
    }),

    reject: (user, item, details = '') => ({
        id: Date.now(),
        type: 'reject',
        message: `Rejected ${item}`,
        details,
        user,
        timestamp: new Date().toISOString()
    })
}
