'use client'

// ═══════════════════════════════════════════════════════════════
// ⭐ REVIEWS SECTION - Public Tour Page
// عرض التقييمات في صفحة الرحلة العامة
// ═══════════════════════════════════════════════════════════════

import { motion } from 'framer-motion'
import Image from 'next/image'
import { Star, User, Quote, Calendar } from 'lucide-react'
import { useApp } from '@/contexts/AppContext'

const ReviewCard = ({ review, index }) => {
    const { locale } = useApp()
    const isAr = locale === 'ar'

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: index * 0.1, duration: 0.5 }}
            className="group relative bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-all duration-300"
        >
            {/* Quote Icon Background */}
            <div className="absolute top-6 right-6 text-gray-100 dark:text-gray-700">
                <Quote className="w-12 h-12 opacity-50 transform rotate-180" />
            </div>

            {/* Header */}
            <div className="flex items-center gap-4 mb-4 relative z-10">
                <div className="relative">
                    {review.user?.avatar ? (
                        <div className="relative w-12 h-12 rounded-full ring-2 ring-white dark:ring-gray-700 shadow-md overflow-hidden">
                            <Image
                                src={review.user.avatar}
                                alt={review.user.name}
                                fill
                                className="object-cover"
                                sizes="48px"
                            />
                        </div>
                    ) : (
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold ring-2 ring-white dark:ring-gray-700 shadow-md">
                            <User className="w-6 h-6" />
                        </div>
                    )}

                </div>
                <div>
                    <h4 className="font-bold text-gray-900 dark:text-gray-100 text-lg">
                        {review.user?.name || (isAr ? 'مستخدم' : 'User')}
                    </h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                        <Calendar className="w-3 h-3" />
                        <span>
                            {new Date(review.createdAt).toLocaleDateString(isAr ? 'ar' : 'en', { year: 'numeric', month: 'long', day: 'numeric' })}
                        </span>
                    </div>
                </div>
            </div>

            {/* Rating Stars */}
            <div className="flex gap-1 mb-3 relative z-10">
                {[...Array(5)].map((_, i) => (
                    <Star
                        key={i}
                        className={`w-4 h-4 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300 dark:text-gray-600'}`}
                    />
                ))}
            </div>

            {/* Content */}
            <div className="relative z-10">
                {review.title && (
                    <h5 className="font-bold text-gray-800 dark:text-gray-200 mb-2">
                        {review.title}
                    </h5>
                )}
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {review.comment}
                </p>
            </div>
        </motion.div>
    )
}

export default function ReviewsSection({ reviews = [], avgRating, totalReviews }) {
    const { locale } = useApp()
    const isAr = locale === 'ar'

    if (!reviews || reviews.length === 0) return null

    return (
        <section className="py-16 bg-gray-50/50 dark:bg-gray-900/50">
            <div className="container mx-auto px-4 max-w-7xl">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                        {isAr ? 'آراء المسافرين' : 'Traveler Reviews'}
                    </h2>
                    <div className="flex items-center justify-center gap-3">
                        <div className="flex items-center gap-1">
                            <span className="text-2xl font-bold text-gray-900 dark:text-white">{avgRating || 0}</span>
                            <Star className="w-6 h-6 fill-amber-400 text-amber-400" />
                        </div>
                        <span className="w-1.5 h-1.5 bg-gray-300 rounded-full" />
                        <span className="text-gray-600 dark:text-gray-400">
                            {totalReviews} {isAr ? 'تقييم' : 'Reviews'}
                        </span>
                    </div>
                </div>

                {/* Reviews Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {reviews.map((review, index) => (
                        <ReviewCard key={review.id} review={review} index={index} />
                    ))}
                </div>

                {/* CTA (Optional) */}
                {/* <div className="mt-12 text-center">
                    <button className="px-8 py-3 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white rounded-xl font-bold hover:border-blue-500 hover:text-blue-600 transition-all">
                        {isAr ? 'عرض كل التقييمات' : 'View All Reviews'}
                    </button>
                </div> */}
            </div>
        </section>
    )
}
