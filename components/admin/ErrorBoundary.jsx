// ═══════════════════════════════════════════════════════════════
// ⚠️ ERROR BOUNDARY - Error Handling Component
// مكون معالجة الأخطاء
// ═══════════════════════════════════════════════════════════════

import React from 'react'
import { motion } from 'framer-motion'

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            hasError: false,
            error: null,
            errorInfo: null,
            errorCount: 0
        }
    }

    static getDerivedStateFromError(error) {
        return { hasError: true }
    }

    componentDidCatch(error, errorInfo) {
        // Log error to console (in production, send to error reporting service)
        console.error('Error caught by boundary:', error, errorInfo)

        this.setState(prev => ({
            error,
            errorInfo,
            errorCount: prev.errorCount + 1
        }))

        // Optional: Report to error tracking service
        if (this.props.onError) {
            this.props.onError(error, errorInfo)
        }
    }

    handleReset = () => {
        this.setState({
            hasError: false,
            error: null,
            errorInfo: null
        })
    }

    handleReload = () => {
        window.location.reload()
    }

    render() {
        if (this.state.hasError) {
            // Custom fallback UI
            if (this.props.fallback) {
                return this.props.fallback({
                    error: this.state.error,
                    errorInfo: this.state.errorInfo,
                    reset: this.handleReset
                })
            }

            // Default error UI
            return (
                <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full p-8"
                    >
                        {/* Icon */}
                        <div className="flex justify-center mb-6">
                            <div className="w-20 h-20 bg-gradient-to-br from-red-500 to-orange-600 rounded-full flex items-center justify-center text-4xl shadow-xl">
                                ⚠️
                            </div>
                        </div>

                        {/* Title */}
                        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-4">
                            {this.props.isAr ? 'عذراً! حدث خطأ ما' : 'Oops! Something went wrong'}
                        </h1>

                        {/* Description */}
                        <p className="text-center text-gray-600 dark:text-gray-400 mb-6">
                            {this.props.isAr
                                ? 'حدث خطأ غير متوقع. نحن نعمل على إصلاحه.'
                                : 'An unexpected error occurred. We\'re working on fixing it.'}
                        </p>

                        {/* Error Details (in development) */}
                        {process.env.NODE_ENV === 'development' && this.state.error && (
                            <details className="mb-6 bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                                <summary className="cursor-pointer font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    🔍 Error Details (Dev Only)
                                </summary>
                                <div className="mt-4 space-y-2">
                                    <div>
                                        <strong className="text-red-600 dark:text-red-400">Error:</strong>
                                        <pre className="text-xs bg-red-50 dark:bg-red-900/20 p-2 rounded mt-1 overflow-x-auto">
                                            {this.state.error.toString()}
                                        </pre>
                                    </div>
                                    {this.state.errorInfo && (
                                        <div>
                                            <strong className="text-orange-600 dark:text-orange-400">Stack Trace:</strong>
                                            <pre className="text-xs bg-orange-50 dark:bg-orange-900/20 p-2 rounded mt-1 overflow-x-auto">
                                                {this.state.errorInfo.componentStack}
                                            </pre>
                                        </div>
                                    )}
                                </div>
                            </details>
                        )}

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                            <button
                                onClick={this.handleReset}
                                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                            >
                                <span>🔄</span>
                                {this.props.isAr ? 'حاول مرة أخرى' : 'Try Again'}
                            </button>

                            <button
                                onClick={this.handleReload}
                                className="px-6 py-3 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 text-gray-700 dark:text-gray-200 rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                            >
                                <span>↻</span>
                                {this.props.isAr ? 'إعادة تحميل الصفحة' : 'Reload Page'}
                            </button>

                            {this.props.onGoHome && (
                                <button
                                    onClick={this.props.onGoHome}
                                    className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all flex items-center justify-center gap-2"
                                >
                                    <span>🏠</span>
                                    {this.props.isAr ? 'العودة للصفحة الرئيسية' : 'Go Home'}
                                </button>
                            )}
                        </div>

                        {/* Error Count Warning */}
                        {this.state.errorCount > 1 && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-lg text-center"
                            >
                                <p className="text-yellow-700 dark:text-yellow-400 text-sm">
                                    ⚠️ {this.props.isAr
                                        ? `حدث هذا الخطأ ${this.state.errorCount} مرات. يُرجى إعادة تحميل الصفحة.`
                                        : `This error occurred ${this.state.errorCount} times. Please reload the page.`}
                                </p>
                            </motion.div>
                        )}
                    </motion.div>
                </div>
            )
        }

        return this.props.children
    }
}

// ═══════════════════════════════════════════════════════════════
// NETWORK ERROR HANDLER
// ═══════════════════════════════════════════════════════════════
export function NetworkErrorHandler({ children, isAr = false }) {
    const [isOnline, setIsOnline] = React.useState(true)

    React.useEffect(() => {
        const handleOnline = () => setIsOnline(true)
        const handleOffline = () => setIsOnline(false)

        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [])

    if (!isOnline) {
        return (
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center max-w-md"
                >
                    <div className="text-6xl mb-4">📡</div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                        {isAr ? 'لا يوجد اتصال بالإنترنت' : 'No Internet Connection'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                        {isAr
                            ? 'يُرجى التحقق من اتصالك بالإنترنت والمحاولة مرة أخرى.'
                            : 'Please check your internet connection and try again.'}
                    </p>
                </motion.div>
            </div>
        )
    }

    return children
}
