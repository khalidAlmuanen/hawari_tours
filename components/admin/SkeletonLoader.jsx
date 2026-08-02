// ═══════════════════════════════════════════════════════════════
// 💀 SKELETON LOADER - Reusable Component
// مكون تحميل هيكلي قابل لإعادة الاستخدام
// ═══════════════════════════════════════════════════════════════

export function SkeletonLoader({ className = '', variant = 'default' }) {
    const baseClasses = 'animate-pulse bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 bg-[length:200%_100%] rounded'

    const variants = {
        default: 'h-4 w-full',
        text: 'h-4 w-3/4',
        title: 'h-6 w-1/2',
        avatar: 'h-10 w-10 rounded-full',
        button: 'h-10 w-24',
        card: 'h-32 w-full',
        image: 'h-48 w-full',
    }

    return (
        <div
            className={`${baseClasses} ${variants[variant]} ${className}`}
            style={{ animationDuration: '1.5s' }}
        />
    )
}

// ═══════════════════════════════════════════════════════════════
// 📊 SKELETON STAT CARD
// ═══════════════════════════════════════════════════════════════
export function SkeletonStatCard() {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <SkeletonLoader variant="text" className="mb-3 w-1/2" />
                    <SkeletonLoader variant="title" className="w-2/3" />
                </div>
                <SkeletonLoader className="w-14 h-14 rounded-2xl" />
            </div>
            <SkeletonLoader variant="text" className="mt-4 w-1/3" />
        </div>
    )
}

// ═══════════════════════════════════════════════════════════════
// 📋 SKELETON TABLE ROW
// ═══════════════════════════════════════════════════════════════
export function SkeletonTableRow({ columns = 4 }) {
    return (
        <tr className="border-b border-gray-200 dark:border-gray-700">
            {Array.from({ length: columns }).map((_, i) => (
                <td key={i} className="py-4 px-4">
                    <SkeletonLoader variant={i === 0 ? 'avatar' : 'text'} />
                </td>
            ))}
        </tr>
    )
}

// ═══════════════════════════════════════════════════════════════
// 💬 SKELETON REVIEW CARD - For Reviews Page
// بطاقة تحميل هيكلية للمراجعات
// ═══════════════════════════════════════════════════════════════
export function SkeletonReviewCard() {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-gray-300 dark:border-gray-600">
            <div className="flex items-start gap-4">
                {/* Checkbox skeleton */}
                <div className="flex-shrink-0 pt-1">
                    <SkeletonLoader className="w-5 h-5 rounded" />
                </div>

                {/* Avatar skeleton */}
                <div className="flex-shrink-0">
                    <SkeletonLoader variant="avatar" className="w-14 h-14" />
                </div>

                {/* Content skeleton */}
                <div className="flex-1">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                            <SkeletonLoader variant="title" className="mb-2 w-1/3" />
                            <div className="flex items-center gap-3">
                                <SkeletonLoader variant="text" className="w-24" />
                                <SkeletonLoader variant="text" className="w-32" />
                            </div>
                        </div>
                        <SkeletonLoader className="w-20 h-6 rounded-full" />
                    </div>

                    {/* Tour info */}
                    <div className="mb-3 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                        <SkeletonLoader variant="text" className="mb-1 w-1/4" />
                        <SkeletonLoader variant="text" className="w-1/2" />
                    </div>

                    {/* Title */}
                    <SkeletonLoader variant="title" className="mb-2 w-2/3" />

                    {/* Comment */}
                    <SkeletonLoader variant="text" className="mb-2 w-full" />
                    <SkeletonLoader variant="text" className="mb-4 w-3/4" />

                    {/* Action buttons */}
                    <div className="flex gap-3">
                        <SkeletonLoader variant="button" className="w-24" />
                        <SkeletonLoader variant="button" className="w-28" />
                        <SkeletonLoader variant="button" className="w-20" />
                    </div>
                </div>
            </div>
        </div>
    )
}

// ═══════════════════════════════════════════════════════════════
// 🃏 SKELETON CARD ITEM
// ═══════════════════════════════════════════════════════════════
export function SkeletonCardItem() {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <div className="flex items-start gap-4">
                <SkeletonLoader variant="avatar" />
                <div className="flex-1">
                    <SkeletonLoader variant="title" className="mb-2" />
                    <SkeletonLoader variant="text" className="mb-3" />
                    <SkeletonLoader variant="text" className="mb-3 w-full" />
                    <div className="flex gap-2 mt-4">
                        <SkeletonLoader variant="button" />
                        <SkeletonLoader variant="button" />
                    </div>
                </div>
            </div>
        </div>
    )
}

// ═══════════════════════════════════════════════════════════════
// 📝 SKELETON FORM
// ═══════════════════════════════════════════════════════════════
export function SkeletonForm({ fields = 5 }) {
    return (
        <div className="space-y-4">
            {Array.from({ length: fields }).map((_, i) => (
                <div key={i}>
                    <SkeletonLoader variant="text" className="mb-2 w-1/4" />
                    <SkeletonLoader className="h-10 w-full rounded-lg" />
                </div>
            ))}
            <div className="flex gap-3 mt-6">
                <SkeletonLoader variant="button" className="w-32" />
                <SkeletonLoader variant="button" className="w-24" />
            </div>
        </div>
    )
}

// ═══════════════════════════════════════════════════════════════
// 🎨 SKELETON GRID
// ═══════════════════════════════════════════════════════════════
export function SkeletonGrid({ items = 6, columns = 3 }) {
    const gridCols = {
        1: 'grid-cols-1',
        2: 'grid-cols-1 md:grid-cols-2',
        3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
        4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4',
    }

    return (
        <div className={`grid ${gridCols[columns]} gap-6`}>
            {Array.from({ length: items }).map((_, i) => (
                <SkeletonCardItem key={i} />
            ))}
        </div>
    )
}
