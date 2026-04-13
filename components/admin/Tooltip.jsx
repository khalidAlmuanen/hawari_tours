// ═══════════════════════════════════════════════════════════════
// 💡 TOOLTIPS & HELP - Interactive Tooltip Component
// تلميحات تفاعلية ونصوص مساعدة
// ═══════════════════════════════════════════════════════════════

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function Tooltip({
    content,
    children,
    position = 'top', // 'top' | 'bottom' | 'left' | 'right'
    trigger = 'hover', // 'hover' | 'click'
    delay = 200,
    maxWidth = '250px',
    interactive = false,
    className = ''
}) {
    const [isVisible, setIsVisible] = useState(false)
    const [timeoutId, setTimeoutId] = useState(null)

    const showTooltip = () => {
        if (trigger === 'hover') {
            const id = setTimeout(() => setIsVisible(true), delay)
            setTimeoutId(id)
        } else {
            setIsVisible(!isVisible)
        }
    }

    const hideTooltip = () => {
        if (timeoutId) {
            clearTimeout(timeoutId)
        }
        if (trigger === 'hover' && !interactive) {
            setIsVisible(false)
        }
    }

    const positions = {
        top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
        bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
        left: 'right-full top-1/2 -translate-y-1/2 mr-2',
        right: 'left-full top-1/2 -translate-y-1/2 ml-2'
    }

    const arrows = {
        top: 'top-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-b-transparent',
        bottom: 'bottom-full left-1/2 -translate-x-1/2 border-l-transparent border-r-transparent border-t-transparent',
        left: 'left-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-r-transparent',
        right: 'right-full top-1/2 -translate-y-1/2 border-t-transparent border-b-transparent border-l-transparent'
    }

    return (
        <div
            className={`relative inline-block ${className}`}
            onMouseEnter={showTooltip}
            onMouseLeave={hideTooltip}
            onClick={trigger === 'click' ? showTooltip : undefined}
        >
            {children}

            <AnimatePresence>
                {isVisible && content && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ duration: 0.15 }}
                        className={`absolute z-50 ${positions[position]}`}
                        style={{ maxWidth }}
                        onMouseEnter={() => interactive && setIsVisible(true)}
                        onMouseLeave={() => interactive && hideTooltip()}
                    >
                        <div className="bg-gray-900 dark:bg-gray-700 text-white text-sm px-3 py-2 rounded-lg shadow-xl">
                            {content}
                            {/* Arrow */}
                            <div className={`absolute w-0 h-0 border-4 border-gray-900 dark:border-gray-700 ${arrows[position]}`} />
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

// ═══════════════════════════════════════════════════════════════
// HELP ICON WITH TOOLTIP
// ═══════════════════════════════════════════════════════════════
export function HelpIcon({ content, position = 'top', className = '' }) {
    return (
        <Tooltip content={content} position={position} interactive>
            <button className={`inline-flex items-center justify-center w-5 h-5 rounded-full 
        bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 
        hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors ${className}`}>
                <span className="text-xs font-bold">?</span>
            </button>
        </Tooltip>
    )
}

// ═══════════════════════════════════════════════════════════════
// INFO POPOVER (enhanced tooltip with more content)
// ═══════════════════════════════════════════════════════════════
export function InfoPopover({
    title,
    content,
    children,
    position = 'bottom',
    maxWidth = '350px'
}) {
    const [isOpen, setIsOpen] = useState(false)

    const positions = {
        top: 'bottom-full left-0 mb-2',
        bottom: 'top-full left-0 mt-2',
        left: 'right-full top-0 mr-2',
        right: 'left-full top-0 ml-2'
    }

    return (
        <div className="relative inline-block">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
            >
                {children || 'ℹ️'}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <div
                            className="fixed inset-0 z-40"
                            onClick={() => setIsOpen(false)}
                        />

                        {/* Popover */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 10 }}
                            className={`absolute z-50 ${positions[position]}`}
                            style={{ maxWidth }}
                        >
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                                {title && (
                                    <div className="bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-4 py-3 font-semibold">
                                        {title}
                                    </div>
                                )}
                                <div className="p-4 text-sm text-gray-700 dark:text-gray-300">
                                    {content}
                                </div>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    )
}

// ═══════════════════════════════════════════════════════════════
// FIELD WITH HELP
// ═══════════════════════════════════════════════════════════════
export function FieldWithHelp({
    label,
    helpText,
    children,
    required = false,
    isAr = false
}) {
    return (
        <div className="space-y-2">
            <div className="flex items-center gap-2">
                <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    {label}
                    {required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {helpText && <HelpIcon content={helpText} />}
            </div>
            {children}
        </div>
    )
}
