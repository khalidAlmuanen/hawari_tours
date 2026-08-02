'use client'

// ═══════════════════════════════════════════════════════════════
// 📤 Logout Page - Smooth Exit Animation
// صفحة تسجيل الخروج - انتقال سلس
// ═══════════════════════════════════════════════════════════════

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { useApp } from '@/contexts/AppContext'
import { motion } from 'framer-motion'

export default function LogoutPage() {
    const router = useRouter()
    const { logout } = useAuth()
    const { isDark, locale } = useApp()
    const isAr = locale === 'ar'

    useEffect(() => {
        // Perform cleanup and redirect
        const performLogout = async () => {
            // 1. Clear local storage immediately
            try {
                localStorage.removeItem('auth-token')
                localStorage.removeItem('user')
                localStorage.removeItem('remember-me')
                sessionStorage.clear()
            } catch (e) {
                console.error('Storage clear error:', e)
            }

            // 2. Short delay for animation then redirect
            setTimeout(() => {
                window.location.href = '/admin/login'
            }, 2000)
        }

        performLogout()
    }, [])

    return (
        <div className={`min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 ${isAr ? 'rtl' : 'ltr'}`}>

            {/* Background Animated Gradient */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-blue-500/10 rounded-full blur-[100px] animate-pulse" />
                <div className="absolute top-[40%] -right-[10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center z-10"
            >
                {/* Animated Icon */}
                <motion.div
                    animate={{
                        rotate: [0, 360],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-4xl shadow-xl shadow-blue-500/20"
                >
                    👋
                </motion.div>

                {/* Text */}
                <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
                    {isAr ? 'إلى اللقاء...' : 'See You Soon...'}
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    {isAr ? 'جاري تسجيل الخروج بأمان' : 'Safely logging you out'}
                </p>

                {/* Loading Bar */}
                <div className="mt-8 w-48 h-1.5 bg-gray-200 dark:bg-gray-800 rounded-full mx-auto overflow-hidden">
                    <motion.div
                        initial={{ x: '-100%' }}
                        animate={{ x: '100%' }}
                        transition={{
                            duration: 1.5,
                            repeat: Infinity,
                            ease: "linear"
                        }}
                        className="w-full h-full bg-gradient-to-r from-blue-600 to-purple-600"
                    />
                </div>
            </motion.div>
        </div>
    )
}
