// ═══════════════════════════════════════════════════════════════
// 📭 EMPTY STATE - Professional Component
// حالة فارغة احترافية قابلة لإعادة الاستخدام
// ═══════════════════════════════════════════════════════════════

import { motion } from 'framer-motion'

export default function EmptyState({
    icon = '📭',
    title,
    description,
    actionLabel,
    onAction,
    actionIcon = '+',
    variant = 'default', // 'default' | 'search' | 'filter' | 'error'
    className = ''
}) {

    const variants = {
        default: {
            iconBg: 'from-blue-500 to-cyan-600',
            buttonBg: 'bg-blue-600 hover:bg-blue-700',
        },
        search: {
            iconBg: 'from-purple-500 to-pink-600',
            buttonBg: 'bg-purple-600 hover:bg-purple-700',
        },
        filter: {
            iconBg: 'from-orange-500 to-red-600',
            buttonBg: 'bg-orange-600 hover:bg-orange-700',
        },
        error: {
            iconBg: 'from-red-500 to-rose-600',
            buttonBg: 'bg-red-600 hover:bg-red-700',
        }
    }

    const currentVariant = variants[variant] || variants.default

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`flex flex-col items-center justify-center py-16 px-4 ${className}`}
        >
            {/* Animated Icon */}
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                    type: 'spring',
                    stiffness: 200,
                    damping: 15,
                    delay: 0.1
                }}
                className={`w-24 h-24 rounded-full bg-gradient-to-br ${currentVariant.iconBg} 
          flex items-center justify-center text-5xl mb-6 shadow-2xl`}
            >
                {icon}
            </motion.div>

            {/* Title */}
            <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-2xl font-bold text-gray-900 dark:text-white mb-3"
            >
                {title}
            </motion.h3>

            {/* Description */}
            {description && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-gray-600 dark:text-gray-400 text-center max-w-md mb-8"
                >
                    {description}
                </motion.p>
            )}

            {/* Action Button */}
            {actionLabel && onAction && (
                <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onAction}
                    className={`${currentVariant.buttonBg} text-white px-6 py-3 rounded-lg 
            font-semibold shadow-lg transition-all duration-200 
            flex items-center gap-2`}
                >
                    <span className="text-xl">{actionIcon}</span>
                    {actionLabel}
                </motion.button>
            )}

            {/* Decorative Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    animate={{
                        y: [0, -20, 0],
                        opacity: [0.1, 0.2, 0.1],
                    }}
                    transition={{
                        duration: 4,
                        repeat: Infinity,
                        ease: 'easeInOut'
                    }}
                    className="absolute top-20 left-20 w-32 h-32 bg-blue-500 rounded-full blur-3xl"
                />
                <motion.div
                    animate={{
                        y: [0, 20, 0],
                        opacity: [0.1, 0.2, 0.1],
                    }}
                    transition={{
                        duration: 5,
                        repeat: Infinity,
                        ease: 'easeInOut',
                        delay: 1
                    }}
                    className="absolute bottom-20 right-20 w-40 h-40 bg-purple-500 rounded-full blur-3xl"
                />
            </div>
        </motion.div>
    )
}

// ═══════════════════════════════════════════════════════════════
// 🎨 PRESET EMPTY STATES
// ═══════════════════════════════════════════════════════════════

export const EmptyStates = {
    NoReviews: (props) => (
        <EmptyState
            icon="💬"
            title="No Reviews Yet"
            description="Be the first to review a tour and share your experience!"
            variant="default"
            {...props}
        />
    ),

    NoTestimonials: (props) => (
        <EmptyState
            icon="⭐"
            title="No Testimonials"
            description="No customer testimonials have been added yet."
            variant="default"
            {...props}
        />
    ),

    NoSearchResults: (props) => (
        <EmptyState
            icon="🔍"
            title="No Results Found"
            description="Try adjusting your search terms or filters."
            variant="search"
            {...props}
        />
    ),

    NoFilterResults: (props) => (
        <EmptyState
            icon="🎯"
            title="No Matches"
            description="No items match your current filters. Try clearing some filters."
            actionLabel="Clear Filters"
            actionIcon="✖️"
            variant="filter"
            {...props}
        />
    ),

    Error: (props) => (
        <EmptyState
            icon="⚠️"
            title="Something Went Wrong"
            description="We couldn't load this content. Please try again."
            actionLabel="Retry"
            actionIcon="🔄"
            variant="error"
            {...props}
        />
    ),

    NoHistory: (props) => (
        <EmptyState
            icon="📜"
            title="No History Yet"
            description="Timeline events will appear here once they're added."
            variant="default"
            {...props}
        />
    ),

    NoData: (props) => (
        <EmptyState
            icon="📊"
            title="No Data Available"
            description="There's no data to display at the moment."
            variant="default"
            {...props}
        />
    ),
}
