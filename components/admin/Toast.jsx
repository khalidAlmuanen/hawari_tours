'use client'

// ═══════════════════════════════════════════════════════════════
// 🎉 TOAST NOTIFICATIONS - Premium Glassmorphism (Unified Design)
// إشعارات منبثقة احترافية وجميلة (تصميم موحد)
// ═══════════════════════════════════════════════════════════════

import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '@/contexts/AppContext'
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Info,
  X,
  Loader2
} from 'lucide-react'

const ToastContext = createContext()

export const useToast = () => {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToast must be used within ToastProvider')
  }
  return context
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }, [])

  const addToast = useCallback((message, type = 'info', duration = 5000) => {
    const id = Date.now() + Math.random()
    const text = typeof message === 'string' ? message : (message?.title || message?.message || 'Notification')
    const description = typeof message === 'object' && message.description ? message.description : null

    const newToast = { id, message: text, description, type, duration }

    setToasts((prev) => [...prev, newToast])

    if (duration && duration > 0) {
      setTimeout(() => {
        removeToast(id)
      }, duration)
    }

    return id
  }, [removeToast])

  const success = useCallback((message, duration) => addToast(message, 'success', duration), [addToast])
  const error = useCallback((message, duration) => addToast(message, 'error', duration), [addToast])
  const info = useCallback((message, duration) => addToast(message, 'info', duration), [addToast])
  const warning = useCallback((message, duration) => addToast(message, 'warning', duration), [addToast])

  return (
    <ToastContext.Provider value={{ addToast, removeToast, success, error, info, warning }}>
      {children}
      <ToastContainer toasts={toasts} removeToast={removeToast} />
    </ToastContext.Provider>
  )
}

function ToastContainer({ toasts, removeToast }) {
  const { locale } = useApp()
  const isAr = locale === 'ar' || (typeof document !== 'undefined' && document.documentElement.dir === 'rtl')

  return (
    <div className={`fixed top-6 ${isAr ? 'left-6' : 'right-6'} z-[9999] flex flex-col items-end pointer-events-none gap-3`}>
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onClose={() => removeToast(toast.id)} isAr={isAr} />
        ))}
      </AnimatePresence>
    </div>
  )
}

function ToastItem({ toast, onClose, isAr }) {
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
    }
  }

  const config = types[toast.type] || types.info
  const Icon = config.icon

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: isAr ? -50 : 50, scale: 0.9 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      whileHover={{ scale: 1.02 }}
      className={`
          pointer-events-auto w-full max-w-sm
          bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl
          border ${config.border}
          rounded-2xl shadow-2xl shadow-black/5
          overflow-hidden
          group relative
      `}
      style={{
        direction: isAr ? 'rtl' : 'ltr'
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
          <Icon className="w-6 h-6" strokeWidth={2.5} />
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
      {(toast.duration && toast.duration > 0) && (
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
