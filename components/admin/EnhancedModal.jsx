// ═══════════════════════════════════════════════════════════════
// 🪟 ENHANCED MODAL - Advanced Modal Component
// نافذة منبثقة محسّنة مع ميزات متقدمة
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts'

export default function EnhancedModal({
    isOpen,
    onClose,
    title,
    children,
    size = 'medium', // 'small' | 'medium' | 'large' | 'full'
    showFooter = true,
    footerContent,
    onSave,
    onCancel,
    saveLabel = 'Save',
    cancelLabel = 'Cancel',
    saveDisabled = false,
    fullscreenToggle = false,
    steps, // For multi-step modals: [{ title, icon, content }]
    currentStep = 0,
    onStepChange,
    autoSave = false,
    autosaveInterval = 30000, // 30 seconds
    onAutosave,
    isAr = false,
    className = ''
}) {
    const [isFullscreen, setIsFullscreen] = useState(false)
    const [activeStep, setActiveStep] = useState(currentStep)
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

    // Keyboard shortcuts
    useKeyboardShortcuts({
        'Escape': () => {
            if (isOpen) {
                if (hasUnsavedChanges) {
                    if (confirm(isAr ? 'لديك تغييرات غير محفوظة. هل تريد المغادرة؟' : 'You have unsaved changes. Leave anyway?')) {
                        onClose()
                    }
                } else {
                    onClose()
                }
            }
        },
        'Ctrl+S': (e) => {
            if (isOpen && onSave) {
                e.preventDefault()
                onSave()
            }
        }
    })

    // Auto-save functionality
    useEffect(() => {
        if (!autoSave || !isOpen || !onAutosave) return

        const interval = setInterval(() => {
            if (hasUnsavedChanges) {
                onAutosave()
                setHasUnsavedChanges(false)
            }
        }, autosaveInterval)

        return () => clearInterval(interval)
    }, [autoSave, isOpen, hasUnsavedChanges, onAutosave, autosaveInterval])

    // Size classes
    const sizes = {
        small: 'max-w-md',
        medium: 'max-w-2xl',
        large: 'max-w-4xl',
        full: 'max-w-[95vw]'
    }

    const modalWidth = isFullscreen ? 'max-w-[95vw]' : sizes[size]

    // Handle step change
    const handleStepChange = (newStep) => {
        setActiveStep(newStep)
        onStepChange?.(newStep)
    }

    if (!isOpen) return null

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                onClick={() => {
                    if (!hasUnsavedChanges || confirm(isAr ? 'لديك تغييرات غير محفوظة. هل تريد المغادرة؟' : 'You have unsaved changes. Leave anyway?')) {
                        onClose()
                    }
                }}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0, y: 20 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.9, opacity: 0, y: 20 }}
                    className={`bg-white dark:bg-gray-800 rounded-2xl shadow-2xl ${modalWidth} 
            ${isFullscreen ? 'h-[95vh]' : 'max-h-[90vh]'} flex flex-col ${className}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="sticky top-0 bg-gradient-to-r from-green-600 to-emerald-600 text-white 
            px-6 py-4 flex items-center justify-between z-10 rounded-t-2xl">
                        <h3 className="text-2xl font-bold">{title}</h3>
                        <div className="flex items-center gap-2">
                            {/* Fullscreen Toggle */}
                            {fullscreenToggle && (
                                <button
                                    onClick={() => setIsFullscreen(!isFullscreen)}
                                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                                    title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                                >
                                    {isFullscreen ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                d="M9 9V4.5M9 9H4.5M9 9L3.75 3.75M15 9h4.5M15 9V4.5M15 9l5.25-5.25M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 15h4.5M15 15v4.5m0-4.5l5.25 5.25" />
                                        </svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
                                        </svg>
                                    )}
                                </button>
                            )}

                            {/* Close Button */}
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Progress Bar for Multi-Step */}
                    {steps && steps.length > 0 && (
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex items-center justify-between mb-3">
                                {steps.map((step, index) => (
                                    <div key={index} className="flex items-center flex-1">
                                        <button
                                            onClick={() => handleStepChange(index)}
                                            className={`flex items-center gap-2 ${index === activeStep
                                                ? 'text-green-600 dark:text-green-400 font-bold'
                                                : index < activeStep
                                                    ? 'text-green-500 dark:text-green-500'
                                                    : 'text-gray-400 dark:text-gray-600'}`}
                                        >
                                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm
                        ${index === activeStep
                                                    ? 'bg-green-600 text-white'
                                                    : index < activeStep
                                                        ? 'bg-green-500 text-white'
                                                        : 'bg-gray-200 dark:bg-gray-700 text-gray-500'}`}>
                                                {index < activeStep ? '✓' : step.icon || index + 1}
                                            </div>
                                            <span className="hidden sm:inline text-sm">{step.title}</span>
                                        </button>
                                        {index < steps.length - 1 && (
                                            <div className={`flex-1 h-1 mx-2 rounded ${index < activeStep
                                                ? 'bg-green-500'
                                                : 'bg-gray-200 dark:bg-gray-700'}`} />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Auto-save Indicator */}
                    {autoSave && hasUnsavedChanges && (
                        <div className="px-6 py-2 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 
              dark:text-yellow-400 text-sm flex items-center gap-2">
                            <span>💾</span>
                            {isAr ? 'تغييرات غير محفوظة...' : 'Unsaved changes...'}
                        </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 overflow-y-auto p-6">
                        {steps && steps.length > 0 ? steps[activeStep].content : children}
                    </div>

                    {/* Footer */}
                    {showFooter && (
                        <div className="sticky bottom-0 bg-gray-50 dark:bg-gray-700/30 px-6 py-4 
              flex items-center justify-between border-t border-gray-200 dark:border-gray-700 
              rounded-b-2xl">
                            {footerContent || (
                                <>
                                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                        {steps && steps.length > 0 && (
                                            <span>
                                                {isAr ? 'خطوة' : 'Step'} {activeStep + 1} {isAr ? 'من' : 'of'} {steps.length}
                                            </span>
                                        )}
                                    </div>

                                    <div className="flex items-center gap-3">
                                        {/* Previous (for multi-step) */}
                                        {steps && activeStep > 0 && (
                                            <button
                                                onClick={() => handleStepChange(activeStep - 1)}
                                                className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 
                          dark:text-gray-200 rounded-lg font-semibold hover:bg-gray-300 
                          dark:hover:bg-gray-500 transition-all"
                                            >
                                                ← {isAr ? 'السابق' : 'Previous'}
                                            </button>
                                        )}

                                        {/* Cancel */}
                                        <button
                                            onClick={onCancel || onClose}
                                            className="px-6 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 
                        dark:text-gray-200 rounded-lg font-semibold hover:bg-gray-300 
                        dark:hover:bg-gray-500 transition-all"
                                        >
                                            {cancelLabel}
                                        </button>

                                        {/* Next / Save */}
                                        {steps && activeStep < steps.length - 1 ? (
                                            <button
                                                onClick={() => handleStepChange(activeStep + 1)}
                                                className="px-6 py-2 bg-green-600 hover:bg-green-700 text-white 
                          rounded-lg font-semibold transition-all"
                                            >
                                                {isAr ? 'التالي' : 'Next'} →
                                            </button>
                                        ) : (
                                            onSave && (
                                                <button
                                                    onClick={onSave}
                                                    disabled={saveDisabled}
                                                    className={`px-6 py-2 bg-green-600 hover:bg-green-700 text-white 
                            rounded-lg font-semibold transition-all
                            ${saveDisabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    💾 {saveLabel}
                                                </button>
                                            )
                                        )}
                                    </div>
                                </>
                            )}
                        </div>
                    )}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    )
}
