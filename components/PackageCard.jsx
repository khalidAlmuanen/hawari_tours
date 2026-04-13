import Link from 'next/link'
import { useApp } from '@/contexts/AppContext'

export default function PackageCard({ pkg }) {
    const { locale } = useApp()
    const isAr = locale === 'ar'

    const title = isAr ? pkg.titleAr : pkg.title
    const duration = isAr ? pkg.durationAr : pkg.duration
    const features = isAr ? pkg.featuresAr : pkg.features

    return (
        <div className={`bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-1 border border-gray-100 dark:border-gray-700 flex flex-col h-full relative group`}>
            {pkg.isPopular && (
                <div className="absolute top-4 right-4 z-10">
                    <span className="bg-green-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg animate-pulse">
                        {isAr ? 'الأكثر شعبية' : 'Most Popular'}
                    </span>
                </div>
            )}

            {/* Header Gradient */}
            <div className={`bg-gradient-to-br ${pkg.gradient} p-8 text-white text-center relative overflow-hidden`}>
                <div className="relative z-10">
                    <h3 className="text-2xl font-bold mb-2 drop-shadow-md">{title}</h3>
                    <div className="flex justify-center items-baseline gap-1 mb-2">
                        <span className="text-4xl font-extrabold">${pkg.price}</span>
                    </div>
                    <div className="text-sm opacity-90 font-medium bg-white/20 inline-block px-3 py-1 rounded-full backdrop-blur-sm">
                        {duration}
                    </div>
                </div>

                {/* Decorative Circles */}
                <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2 blur-2xl"></div>
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-black/10 rounded-full translate-x-1/2 translate-y-1/2 blur-2xl"></div>
            </div>

            <div className="p-8 flex-1 flex flex-col">
                <ul className="space-y-4 mb-8 flex-1">
                    {features.map((item, i) => (
                        <li key={i} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                            <svg className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                            <span className="text-sm leading-relaxed">{item}</span>
                        </li>
                    ))}
                </ul>

                <Link
                    href={`/contact?package=${encodeURIComponent(title)}`}
                    className={`block w-full py-4 rounded-xl font-bold text-center transition-all shadow-lg ${pkg.isFeatured
                            ? 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white hover:shadow-green-500/30'
                            : 'border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-green-500 hover:text-green-600 dark:hover:text-green-400'
                        }`}
                >
                    {isAr ? 'احجز الآن' : 'Book Now'}
                </Link>
            </div>
        </div>
    )
}
