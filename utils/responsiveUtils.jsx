// ═══════════════════════════════════════════════════════════════
// 📱 RESPONSIVE UTILITIES - Mobile & Tablet Helpers
// أدوات التجاوب للأجهزة المختلفة
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react'

// ═══════════════════════════════════════════════════════════════
// USE MEDIA QUERY HOOK
// ═══════════════════════════════════════════════════════════════
export function useMediaQuery(query) {
    const [matches, setMatches] = useState(false)

    useEffect(() => {
        const media = window.matchMedia(query)
        if (media.matches !== matches) {
            setMatches(media.matches)
        }

        const listener = () => setMatches(media.matches)
        media.addEventListener('change', listener)

        return () => media.removeEventListener('change', listener)
    }, [matches, query])

    return matches
}

// ═══════════════════════════════════════════════════════════════
// USE RESPONSIVE BREAKPOINT
// ═══════════════════════════════════════════════════════════════
export function useResponsive() {
    const isMobile = useMediaQuery('(max-width: 640px)')
    const isTablet = useMediaQuery('(min-width: 641px) and (max-width: 1024px)')
    const isDesktop = useMediaQuery('(min-width: 1025px)')
    const isTouchDevice = useMediaQuery('(hover: none) and (pointer: coarse)')

    return {
        isMobile,
        isTablet,
        isDesktop,
        isTouchDevice,
        // Convenience flags
        isSmallScreen: isMobile,
        isMediumScreen: isTablet,
        isLargeScreen: isDesktop
    }
}

// ═══════════════════════════════════════════════════════════════
// USE WINDOW SIZE
// ═══════════════════════════════════════════════════════════════
export function useWindowSize() {
    const [windowSize, setWindowSize] = useState({
        width: undefined,
        height: undefined
    })

    useEffect(() => {
        function handleResize() {
            setWindowSize({
                width: window.innerWidth,
                height: window.innerHeight
            })
        }

        window.addEventListener('resize', handleResize)
        handleResize()

        return () => window.removeEventListener('resize', handleResize)
    }, [])

    return windowSize
}

// ═══════════════════════════════════════════════════════════════
// MOBILE DRAWER COMPONENT
// ═══════════════════════════════════════════════════════════════
import { motion, AnimatePresence } from 'framer-motion'

export function MobileDrawer({ isOpen, onClose, position = 'bottom', children, title }) {
    const positions = {
        bottom: {
            initial: { y: '100%' },
            animate: { y: 0 },
            exit: { y: '100%' }
        },
        top: {
            initial: { y: '-100%' },
            animate: { y: 0 },
            exit: { y: '-100%' }
        },
        left: {
            initial: { x: '-100%' },
            animate: { x: 0 },
            exit: { x: '-100%' }
        },
        right: {
            initial: { x: '100%' },
            animate: { x: 0 },
            exit: { x: '100%' }
        }
    }

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                    />

                    {/* Drawer */}
                    <motion.div
                        {...positions[position]}
                        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                        className={`fixed z-50 bg-white dark:bg-gray-800 shadow-2xl
              ${position === 'bottom' ? 'bottom-0 left-0 right-0 rounded-t-3xl max-h-[90vh]' : ''}
              ${position === 'top' ? 'top-0 left-0 right-0 rounded-b-3xl max-h-[90vh]' : ''}
              ${position === 'left' ? 'top-0 bottom-0 left-0 rounded-r-3xl max-w-[90vw] w-80' : ''}
              ${position === 'right' ? 'top-0 bottom-0 right-0 rounded-l-3xl max-w-[90vw] w-80' : ''}
            `}
                    >
                        {/* Handle (for bottom drawer) */}
                        {position === 'bottom' && (
                            <div className="flex justify-center pt-3 pb-2">
                                <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-600 rounded-full" />
                            </div>
                        )}

                        {/* Header */}
                        {title && (
                            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                                <h3 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h3>
                                <button
                                    onClick={onClose}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                                >
                                    ✕
                                </button>
                            </div>
                        )}

                        {/* Content */}
                        <div className="overflow-y-auto p-6">{children}</div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}

// ═══════════════════════════════════════════════════════════════
// RESPONSIVE CONTAINER
// ═══════════════════════════════════════════════════════════════
export function ResponsiveContainer({
    mobile,
    tablet,
    desktop,
    children
}) {
    const { isMobile, isTablet, isDesktop } = useResponsive()

    if (isMobile && mobile) return mobile
    if (isTablet && tablet) return tablet
    if (isDesktop && desktop) return desktop

    return children
}

// ═══════════════════════════════════════════════════════════════
// TOUCH GESTURES (for mobile)
// ═══════════════════════════════════════════════════════════════
export function useTouchGestures(elementRef, { onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown }) {
    useEffect(() => {
        let touchStartX = 0
        let touchStartY = 0
        const threshold = 50

        const handleTouchStart = (e) => {
            touchStartX = e.touches[0].clientX
            touchStartY = e.touches[0].clientY
        }

        const handleTouchEnd = (e) => {
            const touchEndX = e.changedTouches[0].clientX
            const touchEndY = e.changedTouches[0].clientY

            const diffX = touchEndX - touchStartX
            const diffY = touchEndY - touchStartY

            if (Math.abs(diffX) > Math.abs(diffY)) {
                // Horizontal swipe
                if (diffX > threshold && onSwipeRight) onSwipeRight()
                if (diffX < -threshold && onSwipeLeft) onSwipeLeft()
            } else {
                // Vertical swipe
                if (diffY > threshold && onSwipeDown) onSwipeDown()
                if (diffY < -threshold && onSwipeUp) onSwipeUp()
            }
        }

        const element = elementRef.current
        if (element) {
            element.addEventListener('touchstart', handleTouchStart)
            element.addEventListener('touchend', handleTouchEnd)
        }

        return () => {
            if (element) {
                element.removeEventListener('touchstart', handleTouchStart)
                element.removeEventListener('touchend', handleTouchEnd)
            }
        }
    }, [elementRef, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown])
}
