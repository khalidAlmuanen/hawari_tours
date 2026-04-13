// ═══════════════════════════════════════════════════════════════
// 🎨 THEME CUSTOMIZATION - Theme Settings Component
// مكون تخصيص السمة والألوان
// ═══════════════════════════════════════════════════════════════

import { createContext, useContext, useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const ThemeContext = createContext()

// ═══════════════════════════════════════════════════════════════
// THEME PROVIDER
// ═══════════════════════════════════════════════════════════════
export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState({
        mode: 'light', // 'light' | 'dark' | 'auto'
        colorScheme: 'green', // 'green' | 'blue' | 'purple' | 'orange'
        fontSize: 'medium', // 'small' | 'medium' | 'large'
        density: 'comfortable', // 'compact' | 'comfortable' | 'spacious'
        borderRadius: 'medium', // 'none' | 'small' | 'medium' | 'large'
    })

    // Load theme from localStorage
    useEffect(() => {
        const saved = localStorage.getItem('admin-theme')
        if (saved) {
            try {
                setTheme(JSON.parse(saved))
            } catch (e) {
                console.error('Failed to load theme:', e)
            }
        }
    }, [])

    // Save theme to localStorage
    useEffect(() => {
        localStorage.setItem('admin-theme', JSON.stringify(theme))
        applyTheme(theme)
    }, [theme])

    const applyTheme = (theme) => {
        const root = document.documentElement

        // Apply dark mode
        if (theme.mode === 'dark' || (theme.mode === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            root.classList.add('dark')
        } else {
            root.classList.remove('dark')
        }

        // Apply color scheme
        root.setAttribute('data-color-scheme', theme.colorScheme)

        // Apply font size
        const fontSizes = { small: '14px', medium: '16px', large: '18px' }
        root.style.setProperty('--base-font-size', fontSizes[theme.fontSize])

        // Apply density
        const densities = { compact: '0.75', comfortable: '1', spacious: '1.25' }
        root.style.setProperty('--spacing-scale', densities[theme.density])

        // Apply border radius
        const radiusValues = { none: '0', small: '0.375rem', medium: '0.75rem', large: '1.5rem' }
        root.style.setProperty('--border-radius', radiusValues[theme.borderRadius])
    }

    const updateTheme = (updates) => {
        setTheme(prev => ({ ...prev, ...updates }))
    }

    const resetTheme = () => {
        setTheme({
            mode: 'light',
            colorScheme: 'green',
            fontSize: 'medium',
            density: 'comfortable',
            borderRadius: 'medium',
        })
    }

    return (
        <ThemeContext.Provider value={{ theme, updateTheme, resetTheme }}>
            {children}
        </ThemeContext.Provider>
    )
}

export function useTheme() {
    const context = useContext(ThemeContext)
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider')
    }
    return context
}

// ═══════════════════════════════════════════════════════════════
// THEME CUSTOMIZER PANEL
// ═══════════════════════════════════════════════════════════════
export function ThemeCustomizer({ isOpen, onClose, isAr = false }) {
    const { theme, updateTheme, resetTheme } = useTheme()

    const colorSchemes = [
        { value: 'green', label: 'Green', color: 'from-green-500 to-emerald-600' },
        { value: 'blue', label: 'Blue', color: 'from-blue-500 to-cyan-600' },
        { value: 'purple', label: 'Purple', color: 'from-purple-500 to-pink-600' },
        { value: 'orange', label: 'Orange', color: 'from-orange-500 to-red-600' },
    ]

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={onClose}
                >
                    <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.9, opacity: 0 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Header */}
                        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-4 flex items-center justify-between z-10 rounded-t-2xl">
                            <h3 className="text-2xl font-bold flex items-center gap-2">
                                <span>🎨</span>
                                {isAr ? 'تخصيص المظهر' : 'Theme Customization'}
                            </h3>
                            <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>

                        {/* Content */}
                        <div className="p-6 space-y-6">
                            {/* Dark Mode */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                    {isAr ? 'الوضع' : 'Mode'}
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {['light', 'dark', 'auto'].map((mode) => (
                                        <button
                                            key={mode}
                                            onClick={() => updateTheme({ mode })}
                                            className={`px-4 py-3 rounded-lg font-semibold transition-all capitalize
                        ${theme.mode === mode
                                                    ? 'bg-purple-600 text-white shadow-lg'
                                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                                }`}
                                        >
                                            {mode === 'light' ? '☀️' : mode === 'dark' ? '🌙' : '⚙️'} {mode}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Color Scheme */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                    {isAr ? 'نظام الألوان' : 'Color Scheme'}
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    {colorSchemes.map((scheme) => (
                                        <button
                                            key={scheme.value}
                                            onClick={() => updateTheme({ colorScheme: scheme.value })}
                                            className={`relative px-4 py-3 rounded-lg font-semibold transition-all overflow-hidden
                        ${theme.colorScheme === scheme.value
                                                    ? 'ring-2 ring-offset-2 ring-purple-600 dark:ring-offset-gray-800'
                                                    : ''
                                                }`}
                                        >
                                            <div className={`absolute inset-0 bg-gradient-to-r ${scheme.color} opacity-20`} />
                                            <div className="relative flex items-center gap-2">
                                                <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${scheme.color}`} />
                                                {scheme.label}
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Font Size */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                    {isAr ? 'حجم الخط' : 'Font Size'}
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {['small', 'medium', 'large'].map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => updateTheme({ fontSize: size })}
                                            className={`px-4 py-3 rounded-lg font-semibold transition-all capitalize
                        ${theme.fontSize === size
                                                    ? 'bg-purple-600 text-white shadow-lg'
                                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                                }`}
                                        >
                                            {size === 'small' ? 'Aa' : size === 'medium' ? 'Aa' : 'Aa'}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Density */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                    {isAr ? 'الكثافة' : 'Density'}
                                </label>
                                <div className="grid grid-cols-3 gap-3">
                                    {['compact', 'comfortable', 'spacious'].map((density) => (
                                        <button
                                            key={density}
                                            onClick={() => updateTheme({ density })}
                                            className={`px-4 py-3 rounded-lg font-semibold transition-all capitalize text-sm
                        ${theme.density === density
                                                    ? 'bg-purple-600 text-white shadow-lg'
                                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                                }`}
                                        >
                                            {density}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Border Radius */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-3">
                                    {isAr ? 'انحناء الحواف' : 'Border Radius'}
                                </label>
                                <div className="grid grid-cols-4 gap-3">
                                    {['none', 'small', 'medium', 'large'].map((radius) => (
                                        <button
                                            key={radius}
                                            onClick={() => updateTheme({ borderRadius: radius })}
                                            className={`px-3 py-3 font-semibold transition-all capitalize text-sm
                        ${theme.borderRadius === radius
                                                    ? 'bg-purple-600 text-white shadow-lg'
                                                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                                                }
                        ${radius === 'none' ? 'rounded-none' : radius === 'small' ? 'rounded' : radius === 'medium' ? 'rounded-lg' : 'rounded-2xl'}
                      `}
                                        >
                                            {radius}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Reset Button */}
                            <button
                                onClick={resetTheme}
                                className="w-full px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-all"
                            >
                                🔄 {isAr ? 'إعادة تعيين' : 'Reset to Default'}
                            </button>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

// ═══════════════════════════════════════════════════════════════
// THEME BUTTON (for opening customizer)
// ═══════════════════════════════════════════════════════════════
export function ThemeButton({ onClick, className = '' }) {
    return (
        <button
            onClick={onClick}
            className={`p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors ${className}`}
            title="Theme Settings"
        >
            🎨
        </button>
    )
}
