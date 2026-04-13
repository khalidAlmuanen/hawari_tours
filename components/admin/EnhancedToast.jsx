// ═══════════════════════════════════════════════════════════════
// 🔔 ENHANCED TOAST - Premium Glassmorphism Notifications
// إشعارات احترافية بتصميم زجاجي عصري
// ═══════════════════════════════════════════════════════════════

import { createContext, useContext, useState, useCallback, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
    CheckCircle2,
    XCircle,
    AlertTriangle,
    Info,
    X,
    Undo2,
    Loader2
} from 'lucide-react'

const ToastContext = createContext()

export function EnhancedToastProvider({ children }) {
    const [toasts, setToasts] = useState([])

    const removeToast = useCallback((id) => {
        setToasts(prev => prev.filter(t => t.id !== id))
    }, [])

    const addToast = useCallback((toast) => {
        const id = Date.now() + Math.random()
        const newToast = { id, ...toast }

        setToasts(prev => {
            const cleanPrev = prev.length > 5 ? prev.slice(prev.length - 5) : prev
            return [...cleanPrev, newToast]
        })

        if (toast.duration !== Infinity && toast.duration !== false) {
            setTimeout(() => {
                removeToast(id)
            }, toast.duration || 5000)
        }

        return id
    }, [removeToast])

    const updateToast = useCallback((id, updates) => {
        setToasts(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t))
    }, [])

    return (
        <ToastContext.Provider value={{ addToast, removeToast, updateToast }}>
            {children}
            <ToastContainer toasts={toasts} removeToast={removeToast} />
        </ToastContext.Provider>
    )
}

export function useEnhancedToast() {
    const context = useContext(ToastContext)
    if (!context) {
        throw new Error('useEnhancedToast must be used within EnhancedToastProvider')
    }

    const { addToast, removeToast, updateToast } = context

    return useMemo(() => ({
        success: (message, options = {}) => addToast({ type: 'success', message, ...options }),
        error: (message, options = {}) => addToast({ type: 'error', message, ...options }),
        warning: (message, options = {}) => addToast({ type: 'warning', message, ...options }),
        info: (message, options = {}) => addToast({ type: 'info', message, ...options }),
        withAction: (message, actionLabel, onAction, options = {}) =>
            addToast({
                message,
                action: { label: actionLabel, onClick: onAction },
                ...options
            }),
        withUndo: (message, onUndo, options = {}) =>
            addToast({
                message,
                action: { label: 'Undo', onClick: onUndo },
                type: 'success',
                duration: 8000,
                ...options
            }),
        progress: (message, options = {}) => {
            const id = addToast({
                type: 'loading',
                message,
                progress: 0,
                duration: false,
                ...options
            })

            return {
                update: (progress, newMessage) => updateToast(id, {
                    progress,
                    message: newMessage || message
                }),
                complete: (successMessage = 'Completed successfully') => {
                    updateToast(id, {
                        type: 'success',
                        progress: 100,
                        message: successMessage
                    })
                    setTimeout(() => removeToast(id), 3000)
                },
                error: (errorMessage = 'Operation failed') => {
                    updateToast(id, {
                        type: 'error',
                        message: errorMessage,
                        progress: undefined
                    })
                    setTimeout(() => removeToast(id), 4000)
                }
            }
        },
        remove: removeToast
    }), [addToast, removeToast, updateToast])
}

function ToastContainer({ toasts, removeToast }) {
    return (
        <div className="fixed top-6 right-6 z-[100] flex flex-col items-end pointer-events-none gap-3">
            <AnimatePresence mode="popLayout">
                {toasts.map((toast) => (
                    <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} />
                ))}
            </AnimatePresence>
        </div>
    )
}

function ToastItem({ toast, onClose }) {
    const isRTL = document.documentElement.dir === 'rtl' || document.documentElement.lang === 'ar'

    const types = {
        success: {
            icon: CheckCircle2,
            gradient: 'from-emerald-500/10 to-green-500/10',
            border: 'border-emerald-500/20',
            iconColor: 'text-emerald-500',
            progressColor: 'bg-emerald-500'
        },
        error: {
            icon: XCircle,
            gradient: 'from-red-500/10 to-rose-500/10',
            border: 'border-red-500/20',
            iconColor: 'text-red-500',
            progressColor: 'bg-red-500'
        },
        warning: {
            icon: AlertTriangle,
            gradient: 'from-amber-500/10 to-orange-500/10',
            border: 'border-amber-500/20',
            iconColor: 'text-amber-500',
            progressColor: 'bg-amber-500'
        },
        info: {
            icon: Info,
            gradient: 'from-blue-500/10 to-cyan-500/10',
            border: 'border-blue-500/20',
            iconColor: 'text-blue-500',
            progressColor: 'bg-blue-500'
        },
        loading: {
            icon: Loader2,
            gradient: 'from-violet-500/10 to-purple-500/10',
            border: 'border-violet-500/20',
            iconColor: 'text-violet-500',
            progressColor: 'bg-violet-500'
        }
    }

    const config = types[toast.type] || types.info
    const Icon = config.icon

    return (
        <motion.div
            layout
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            whileHover={{ scale: 1.02 }}
            drag="x"
            dragConstraints={{ left: 0, right: 300 }}
            onDragEnd={(event, info) => {
                if (info.offset.x > 100) onClose()
            }}
            className={`
                pointer-events-auto w-full max-w-sm
                bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl
                border ${config.border}
                rounded-2xl shadow-2xl shadow-black/5
                overflow-hidden
                group relative
            `}
            style={{
                direction: isRTL ? 'rtl' : 'ltr'
            }}
        >
            {/* Background Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-br ${config.gradient} opacity-50`} />

            <div className="relative p-4 flex items-start gap-4">
                {/* Icon Section */}
                <div className={`
                    flex-shrink-0 p-2.5 rounded-xl 
                    bg-white/50 dark:bg-white/5 
                    ${config.iconColor} shadow-sm ring-1 ring-inset ring-black/5
                `}>
                    <Icon className={`w-6 h-6 ${toast.type === 'loading' ? 'animate-spin' : ''}`} strokeWidth={2.5} />
                </div>

                {/* Content Section */}
                <div className="flex-1 min-w-0 pt-0.5">
                    <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-6">
                        {toast.message}
                    </p>

                    {toast.description && (
                        <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                            {toast.description}
                        </p>
                    )}

                    {/* Progress Bar (Visible if progress is set) */}
                    {toast.progress !== undefined && (
                        <div className="mt-3 h-1.5 w-full bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${toast.progress}%` }}
                                transition={{ type: 'spring', stiffness: 100, damping: 20 }}
                                className={`h-full rounded-full ${config.progressColor}`}
                            />
                        </div>
                    )}

                    {/* Action Button */}
                    {toast.action && (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={(e) => {
                                e.stopPropagation();
                                toast.action.onClick()
                                onClose()
                            }}
                            className={`
                                mt-3 flex items-center gap-1.5 px-3 py-1.5 
                                rounded-lg text-xs font-semibold
                                bg-gray-50 dark:bg-white/5 
                                hover:bg-gray-100 dark:hover:bg-white/10
                                text-gray-900 dark:text-white
                                transition-colors
                                border border-gray-200 dark:border-white/10
                            `}
                        >
                            {toast.action.label === 'Undo' && <Undo2 className="w-3.5 h-3.5" />}
                            {toast.action.label}
                        </motion.button>
                    )}
                </div>

                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="
                        flex-shrink-0 p-1 rounded-full
                        text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 
                        hover:bg-gray-100 dark:hover:bg-white/10
                        transition-all opacity-0 group-hover:opacity-100
                    "
                >
                    <X className="w-4 h-4" />
                </button>
            </div>

            {/* Time Progress Bar */}
            {(toast.duration && toast.duration !== Infinity) && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gray-100 dark:bg-gray-800">
                    <motion.div
                        initial={{ width: '100%' }}
                        animate={{ width: '0%' }}
                        transition={{ duration: toast.duration / 1000, ease: 'linear' }}
                        className={`h-full ${config.progressColor}`}
                    />
                </div>
            )}
        </motion.div>
    )
}
