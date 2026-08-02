// ═══════════════════════════════════════════════════════════════
// ♿ ACCESSIBILITY UTILITIES - A11y Helpers
// أدوات إمكانية الوصول
// ═══════════════════════════════════════════════════════════════

import { useEffect, useRef } from 'react'

// ═══════════════════════════════════════════════════════════════
// FOCUS TRAP - For modals and dialogs
// ═══════════════════════════════════════════════════════════════
export function useFocusTrap(isActive) {
    const containerRef = useRef(null)

    useEffect(() => {
        if (!isActive || !containerRef.current) return

        const container = containerRef.current
        const focusableElements = container.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        )

        const firstElement = focusableElements[0]
        const lastElement = focusableElements[focusableElements.length - 1]

        // Focus first element
        firstElement?.focus()

        const handleTab = (e) => {
            if (e.key !== 'Tab') return

            if (e.shiftKey) {
                // Shift + Tab
                if (document.activeElement === firstElement) {
                    e.preventDefault()
                    lastElement?.focus()
                }
            } else {
                // Tab
                if (document.activeElement === lastElement) {
                    e.preventDefault()
                    firstElement?.focus()
                }
            }
        }

        container.addEventListener('keydown', handleTab)
        return () => container.removeEventListener('keydown', handleTab)
    }, [isActive])

    return containerRef
}

// ═══════════════════════════════════════════════════════════════
// SKIP TO CONTENT LINK
// ═══════════════════════════════════════════════════════════════
export function SkipToContent({ contentId = 'main-content', isAr = false }) {
    return (
        <a
            href={`#${contentId}`}
            className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 
        focus:z-50 focus:px-4 focus:py-2 focus:bg-green-600 focus:text-white 
        focus:rounded-lg focus:font-semibold focus:shadow-lg"
        >
            {isAr ? 'تخطي إلى المحتوى' : 'Skip to content'}
        </a>
    )
}

// ═══════════════════════════════════════════════════════════════
// SCREEN READER ONLY TEXT
// ═══════════════════════════════════════════════════════════════
export function ScreenReaderOnly({ children }) {
    return (
        <span className="sr-only">
            {children}
        </span>
    )
}

// ═══════════════════════════════════════════════════════════════
// ANNOUNCE TO SCREEN READERS
// ═══════════════════════════════════════════════════════════════
export function useLiveRegion() {
    const announce = (message, priority = 'polite') => {
        const liveRegion = document.getElementById('live-region')
        if (liveRegion) {
            liveRegion.setAttribute('aria-live', priority)
            liveRegion.textContent = message

            // Clear after announcement
            setTimeout(() => {
                liveRegion.textContent = ''
            }, 1000)
        }
    }

    return { announce }
}

// Live Region Component (add to app root)
export function LiveRegion() {
    return (
        <div
            id="live-region"
            className="sr-only"
            aria-live="polite"
            aria-atomic="true"
        />
    )
}

// ═══════════════════════════════════════════════════════════════
// FOCUS VISIBLE UTILITY
// ═══════════════════════════════════════════════════════════════
export function useFocusVisible() {
    useEffect(() => {
        // Add focus-visible class for keyboard navigation
        const handleKeyDown = (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('keyboard-nav')
            }
        }

        const handleMouseDown = () => {
            document.body.classList.remove('keyboard-nav')
        }

        document.addEventListener('keydown', handleKeyDown)
        document.addEventListener('mousedown', handleMouseDown)

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            document.removeEventListener('mousedown', handleMouseDown)
        }
    }, [])
}

// ═══════════════════════════════════════════════════════════════
// KEYBOARD NAVIGATION HELPERS
// ═══════════════════════════════════════════════════════════════
export function useArrowNavigation(items, onSelect) {
    const [activeIndex, setActiveIndex] = useState(-1)

    const handleKeyDown = (e) => {
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault()
                setActiveIndex(prev => (prev < items.length - 1 ? prev + 1 : 0))
                break
            case 'ArrowUp':
                e.preventDefault()
                setActiveIndex(prev => (prev > 0 ? prev - 1 : items.length - 1))
                break
            case 'Enter':
            case ' ':
                e.preventDefault()
                if (activeIndex >= 0 && items[activeIndex]) {
                    onSelect(items[activeIndex])
                }
                break
            case 'Escape':
                setActiveIndex(-1)
                break
        }
    }

    return { activeIndex, handleKeyDown, setActiveIndex }
}

// ═══════════════════════════════════════════════════════════════
// ARIA LABEL HELPERS
// ═══════════════════════════════════════════════════════════════
export const ariaLabels = {
    // Buttons
    close: (isAr) => isAr ? 'إغلاق' : 'Close',
    delete: (isAr) => isAr ? 'حذف' : 'Delete',
    edit: (isAr) => isAr ? 'تعديل' : 'Edit',
    save: (isAr) => isAr ? 'حفظ' : 'Save',
    cancel: (isAr) => isAr ? 'إلغاء' : 'Cancel',

    // Navigation
    menu: (isAr) => isAr ? 'القائمة' : 'Menu',
    search: (isAr) => isAr ? 'بحث' : 'Search',
    next: (isAr) => isAr ? 'التالي' : 'Next',
    previous: (isAr) => isAr ? 'السابق' : 'Previous',

    // States
    loading: (isAr) => isAr ? 'جاري التحميل' : 'Loading',
    error: (isAr) => isAr ? 'خطأ' : 'Error',
    success: (isAr) => isAr ? 'نجح' : 'Success',
}

import { useState } from 'react'

// ═══════════════════════════════════════════════════════════════
// CONTRAST CHECKER
// ═══════════════════════════════════════════════════════════════
export function checkContrast(foreground, background) {
    // Convert hex to RGB
    const hexToRgb = (hex) => {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null
    }

    // Calculate relative luminance
    const getLuminance = (rgb) => {
        const { r, g, b } = rgb
        const [rs, gs, bs] = [r, g, b].map(c => {
            c = c / 255
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
        })
        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
    }

    const fg = hexToRgb(foreground)
    const bg = hexToRgb(background)

    if (!fg || !bg) return null

    const l1 = getLuminance(fg)
    const l2 = getLuminance(bg)

    const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05)

    return {
        ratio: ratio.toFixed(2),
        passAAA: ratio >= 7,
        passAA: ratio >= 4.5,
        passAALarge: ratio >= 3
    }
}

// ═══════════════════════════════════════════════════════════════
// REDUCED MOTION PREFERENCE
// ═══════════════════════════════════════════════════════════════
export function useReducedMotion() {
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

    useEffect(() => {
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
        setPrefersReducedMotion(mediaQuery.matches)

        const listener = (e) => setPrefersReducedMotion(e.matches)
        mediaQuery.addEventListener('change', listener)

        return () => mediaQuery.removeEventListener('change', listener)
    }, [])

    return prefersReducedMotion
}
