// ═══════════════════════════════════════════════════════════════
// 🚀 PERFORMANCE UTILITIES - Virtual Scrolling & Optimizations
// أدوات تحسين الأداء والتمرير الافتراضي
// ═══════════════════════════════════════════════════════════════

import { List } from 'react-window'
import NextImage from 'next/image'
import { memo, useMemo, useCallback, useState, useRef, useEffect, lazy, Suspense } from 'react'

// ═══════════════════════════════════════════════════════════════
// VIRTUAL LIST - For large datasets
// ═══════════════════════════════════════════════════════════════
export function VirtualList({
    items,
    height = 600,
    itemHeight = 80,
    renderItem,
    className = '',
    overscanCount = 5
}) {
    const Row = useCallback(({ index, style }) => {
        return (
            <div style={style}>
                {renderItem(items[index], index)}
            </div>
        )
    }, [items, renderItem])

    return (
        <List
            height={height}
            itemCount={items.length}
            itemSize={itemHeight}
            width="100%"
            className={className}
            overscanCount={overscanCount}
        >
            {Row}
        </List>
    )
}

// ═══════════════════════════════════════════════════════════════
// LAZY IMAGE - Lazy loading with blur placeholder
// ═══════════════════════════════════════════════════════════════
export function LazyImage({
    src,
    alt,
    width,
    height,
    className = '',
    placeholder = 'blur',
    onLoad
}) {
    const [isLoaded, setIsLoaded] = useState(false)
    const [imageSrc, setImageSrc] = useState(placeholder === 'blur' ? '' : src)

    useEffect(() => {
        const img = new Image()
        img.src = src
        img.onload = () => {
            setImageSrc(src)
            setIsLoaded(true)
            onLoad?.()
        }
    }, [src, onLoad])

    return (
        <div className={`relative overflow-hidden ${className}`} style={{ width, height }}>
            {/* Blur placeholder */}
            {!isLoaded && placeholder === 'blur' && (
                <div className="absolute inset-0 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-700 dark:to-gray-600 animate-pulse" />
            )}

            {/* Actual image */}
            {imageSrc && (
                <NextImage
                    src={imageSrc}
                    alt={alt}
                    width={width}
                    height={height}
                    className={`object-cover transition-opacity duration-300 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                    loading="lazy"
                />
            )}
        </div>
    )
}

// ═══════════════════════════════════════════════════════════════
// DEBOUNCE HOOK
// ═══════════════════════════════════════════════════════════════

export function useDebounce(value, delay = 500) {
    const [debouncedValue, setDebouncedValue] = useState(value)

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebouncedValue(value)
        }, delay)

        return () => {
            clearTimeout(handler)
        }
    }, [value, delay])

    return debouncedValue
}

// ═══════════════════════════════════════════════════════════════
// THROTTLE HOOK
// ═══════════════════════════════════════════════════════════════
export function useThrottle(value, limit = 500) {
    const [throttledValue, setThrottledValue] = useState(value)
    const lastRun = useRef(Date.now())

    useEffect(() => {
        const handler = setTimeout(() => {
            if (Date.now() - lastRun.current >= limit) {
                setThrottledValue(value)
                lastRun.current = Date.now()
            }
        }, limit - (Date.now() - lastRun.current))

        return () => {
            clearTimeout(handler)
        }
    }, [value, limit])

    return throttledValue
}

// ═══════════════════════════════════════════════════════════════
// MEMOIZED COMPONENT WRAPPER
// ═══════════════════════════════════════════════════════════════
export function createMemoizedComponent(Component, propsAreEqual) {
    return memo(Component, propsAreEqual)
}

// ═══════════════════════════════════════════════════════════════
// INTERSECTION OBSERVER HOOK (for lazy loading)
// ═══════════════════════════════════════════════════════════════

export function useIntersectionObserver(options = {}) {
    const [isIntersecting, setIsIntersecting] = useState(false)
    const [hasIntersected, setHasIntersected] = useState(false)
    const elementRef = useRef(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setIsIntersecting(entry.isIntersecting)
                if (entry.isIntersecting && !hasIntersected) {
                    setHasIntersected(true)
                }
            },
            {
                threshold: 0.1,
                ...options
            }
        )

        const element = elementRef.current
        if (element) {
            observer.observe(element)
        }

        return () => {
            if (element) {
                observer.unobserve(element)
            }
        }
    }, [options, hasIntersected])

    return { elementRef, isIntersecting, hasIntersected }
}

// ═══════════════════════════════════════════════════════════════
// PERFORMANCE MONITOR
// ═══════════════════════════════════════════════════════════════
export function usePerformanceMonitor(componentName) {
    useEffect(() => {
        if (process.env.NODE_ENV === 'development') {
            const startTime = performance.now()

            return () => {
                const endTime = performance.now()
                const renderTime = endTime - startTime

                if (renderTime > 100) {
                    console.warn(`⚠️ ${componentName} took ${renderTime.toFixed(2)}ms to render (slow!)`)
                } else {
                    console.log(`✓ ${componentName} rendered in ${renderTime.toFixed(2)}ms`)
                }
            }
        }
    })
}

// ═══════════════════════════════════════════════════════════════
// CODE SPLITTING HELPER
// ═══════════════════════════════════════════════════════════════
export function createLazyComponent(importFn, fallback = null) {
    const LazyComponent = lazy(importFn)

    function LazyWrapper(props) {
        return (
            <Suspense fallback={fallback || <div className="animate-pulse">Loading...</div>}>
                <LazyComponent {...props} />
            </Suspense>
        )
    }

    LazyWrapper.displayName = `LazyComponent(${LazyComponent.displayName || LazyComponent.name || 'Component'})`

    return LazyWrapper
}

