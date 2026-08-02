'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '@/contexts/AppContext'

const CAR_TYPES = [
    { id: 'Pick-up', labelAr: 'شاص / بيك أب', labelEn: 'Pick-up' },
    { id: 'SUV', labelAr: 'دفع رباعي (SUV)', labelEn: 'SUV' },
    { id: '4x4', labelAr: 'دفع رباعي / جيب', labelEn: 'Off-Road 4x4' },
    { id: 'Sedan', labelAr: 'سيدان صالون صغير', labelEn: 'Sedan' },
    { id: 'Van', labelAr: 'عائلي / باص', labelEn: 'Family Van' },
    { id: 'Economy', labelAr: 'اقتصادي', labelEn: 'Economy' },
    { id: 'VIP', labelAr: 'فاخر (VIP)', labelEn: 'Luxury VIP' },
]

const MORE_FILTERS = [
    { id: 'Automatic', type: 'transmission', labelAr: 'أوتوماتيك', labelEn: 'Automatic', icon: '⚙️' },
    { id: 'Manual', type: 'transmission', labelAr: 'عادي (مانيوال)', labelEn: 'Manual', icon: '🚙' },
    { id: 'Petrol', type: 'fuel', labelAr: 'بنزين', labelEn: 'Petrol', icon: '⛽' },
    { id: 'Diesel', type: 'fuel', labelAr: 'ديزل', labelEn: 'Diesel', icon: '⛽' },
]

const DEFAULT_SETTINGS = {
    heroImage: '/img/hero/socotra-car.jpg',
    heroTitleAr: 'رحلتك بأسلوبك، استأجر سيارة أحلامك',
    heroTitleEn: 'Drive Your Journey, Rent Your Dream Car',
    heroSubtitleAr: 'اكتشف أسطولنا المميز من السيارات الفاخرة والعائلية، واحجز سيارتك المثالية مع أفضل العروض.',
    heroSubtitleEn: 'Discover our premium fleet of luxury and family vehicles, and book your perfect car with exclusive offers.',
    heroBadgeAr: 'تأجير سيارات فاخرة',
    heroBadgeEn: 'Luxury Car Rental',
    primaryButtonAr: 'ابحث عن سيارة',
    primaryButtonEn: 'Find a Car',
    primaryButtonLink: '#fleet',
    secondaryButtonAr: 'عروض خاصة',
    secondaryButtonEn: 'Special Offers',
    secondaryButtonLink: '/contact',
    stats: [
        { value: '50+', labelAr: 'سيارة حديثة', labelEn: 'Modern Cars' },
        { value: '24/7', labelAr: 'دعم على الطريق', labelEn: 'Roadside Support' },
        { value: '100%', labelAr: 'مضمونة الجودة', labelEn: 'Quality Guaranteed' },
    ],
    searchTitleAr: 'ابحث عن سيارتك المثالية',
    searchTitleEn: 'Find Your Perfect Car',
    searchButtonAr: 'عرض السيارات المتوفرة',
    searchButtonEn: 'Show Available Cars',
    searchHintLeftAr: 'إلغاء مجاني',
    searchHintLeftEn: 'Free Cancellation',
    searchHintRightAr: 'أسعار شاملة التأمين',
    searchHintRightEn: 'Insurance Included',
    filtersTitleAr: 'تصفية فاخرة',
    filtersTitleEn: 'Premium Filters',
    experiences: [
        {
            titleAr: 'توصيل من المطار', titleEn: 'Airport Transfer',
            descAr: 'استلم سيارتك من المطار مباشرة بكل سهولة', descEn: 'Pick up your car directly from the airport',
            icon: '✈️'
        },
        {
            titleAr: 'نظام ملاحة متقدم', titleEn: 'Advanced Navigation',
            descAr: 'جميع السيارات مزودة بأحدث أنظمة التتبع', descEn: 'All cars equipped with the latest GPS systems',
            icon: '🗺️'
        },
        {
            titleAr: 'تأمين شامل', titleEn: 'Full Insurance',
            descAr: 'راحة بال تامة مع باقات التأمين الشاملة', descEn: 'Complete peace of mind with our full coverage',
            icon: '🛡️'
        }
    ],
    vipTitleAr: 'خدمة تأجير السيارات VIP',
    vipTitleEn: 'VIP Car Rental Service',
    vipDescriptionAr: 'نوفر لك سيارات فاخرة مع سائق خاص، وتجربة تنقل متكاملة لرحلات الأعمال والسياحة الراقية.',
    vipDescriptionEn: 'We provide luxury vehicles with private chauffeurs, offering an integrated transport experience for business and premium tourism.',
    vipPrimaryButtonAr: 'احجز مع سائق',
    vipPrimaryButtonEn: 'Book with Chauffeur',
    vipPrimaryButtonLink: '/contact',
    vipSecondaryButtonAr: 'عرض باقاتنا',
    vipSecondaryButtonEn: 'View Our Packages',
    vipSecondaryButtonLink: '/tours'
}

export default function CarsPage() {
    const { locale } = useApp()
    const isAr = locale === 'ar'

    const [cars, setCars] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const [search, setSearch] = useState('')
    const [budget, setBudget] = useState(500)
    const [selectedTypes, setSelectedTypes] = useState([])
    const [selectedFilters, setSelectedFilters] = useState([])
    const [sortBy, setSortBy] = useState('recommended')
    const [showFilters, setShowFilters] = useState(false)
    const [pageSettings, setPageSettings] = useState(DEFAULT_SETTINGS)

    useEffect(() => {
        const fetchCars = async () => {
            try {
                setLoading(true)
                const res = await fetch('/api/cars', { cache: 'no-store' })
                const data = await res.json()
                if (data.success) {
                    setCars(data.data || [])
                } else {
                    setError(data.error || 'Failed to fetch cars')
                }
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchCars()
    }, [])

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await fetch('/api/cars/settings', { cache: 'no-store' })
                const data = await res.json()
                if (data && !data.error) {
                    const merged = {
                        ...DEFAULT_SETTINGS,
                        ...data,
                        stats: Array.isArray(data.stats) ? data.stats : DEFAULT_SETTINGS.stats,
                        experiences: Array.isArray(data.experiences) ? data.experiences : DEFAULT_SETTINGS.experiences
                    }
                    setPageSettings(merged)
                }
            } catch (err) {
                setPageSettings(DEFAULT_SETTINGS)
            }
        }
        fetchSettings()
    }, [])

    const toggleType = (id) => {
        setSelectedTypes((prev) => (prev.includes(id) ? prev.filter((t) => t !== id) : [...prev, id]))
    }

    const toggleFilter = (id) => {
        setSelectedFilters((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]))
    }

    const filteredCars = useMemo(() => {
        let result = [...cars]
        const keyword = search.trim().toLowerCase()

        if (keyword) {
            result = result.filter((car) => {
                const name = isAr ? car.nameAr : car.name
                const brand = car.brand || ''
                return (
                    name?.toLowerCase().includes(keyword) ||
                    brand.toLowerCase().includes(keyword)
                )
            })
        }

        if (selectedTypes.length) {
            result = result.filter((car) => selectedTypes.includes(car.type))
        }

        if (selectedFilters.length) {
            result = result.filter((car) => {
                const tMatch = selectedFilters.includes(car.transmission)
                const fMatch = selectedFilters.includes(car.fuelType)
                const transmissionActive = selectedFilters.some(f => ['Automatic', 'Manual'].includes(f))
                const fuelActive = selectedFilters.some(f => ['Petrol', 'Diesel'].includes(f))

                let valid = true
                if (transmissionActive && !tMatch) valid = false
                if (fuelActive && !fMatch) valid = false
                return valid
            })
        }

        result = result.filter((car) => car.pricePerDay <= budget)

        switch (sortBy) {
            case 'price-low':
                result.sort((a, b) => {
                    const priceA = a.discount ? a.pricePerDay - (a.pricePerDay * a.discount / 100) : a.pricePerDay
                    const priceB = b.discount ? b.pricePerDay - (b.pricePerDay * b.discount / 100) : b.pricePerDay
                    return priceA - priceB
                })
                break
            case 'price-high':
                result.sort((a, b) => {
                    const priceA = a.discount ? a.pricePerDay - (a.pricePerDay * a.discount / 100) : a.pricePerDay
                    const priceB = b.discount ? b.pricePerDay - (b.pricePerDay * b.discount / 100) : b.pricePerDay
                    return priceB - priceA
                })
                break
            default:
                // recommended (featured first)
                result.sort((a, b) => {
                    if (a.featured && !b.featured) return -1
                    if (!a.featured && b.featured) return 1
                    return 0
                })
                break
        }

        return result
    }, [cars, search, selectedTypes, selectedFilters, budget, sortBy, isAr])

    const FiltersPanel = () => (
        <>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                    {isAr ? pageSettings.filtersTitleAr : pageSettings.filtersTitleEn}
                </h2>
                <span className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                    {filteredCars.length} {isAr ? 'نتيجة' : 'results'}
                </span>
            </div>

            <div className="space-y-6">
                <div>
                    <div className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-3">
                        {isAr ? 'أقصى سعر لليوم' : 'Max price per day'}
                    </div>
                    <div className="flex items-center justify-between text-sm font-bold text-gray-900 dark:text-white mb-2">
                        <span>${budget}</span>
                        <span>$30 - $500</span>
                    </div>
                    <input
                        type="range"
                        min={30}
                        max={500}
                        value={budget}
                        onChange={(e) => setBudget(Number(e.target.value))}
                        className="w-full accent-indigo-500"
                    />
                </div>

                <div>
                    <div className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-3">
                        {isAr ? 'ترتيب النتائج' : 'Sort by'}
                    </div>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white font-semibold"
                    >
                        <option value="recommended">{isAr ? 'الأكثر تميزا' : 'Recommended'}</option>
                        <option value="price-low">{isAr ? 'الأقل سعرا' : 'Lowest price'}</option>
                        <option value="price-high">{isAr ? 'الأعلى سعرا' : 'Highest price'}</option>
                    </select>
                </div>

                <div>
                    <div className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-4">
                        {isAr ? 'فئة السيارة' : 'Car Category'}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        {CAR_TYPES.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => toggleType(item.id)}
                                className={`flex items-center justify-center px-3 py-2 rounded-xl border text-sm transition-all ${selectedTypes.includes(item.id)
                                    ? 'bg-indigo-500 text-white border-indigo-500 shadow-lg font-bold'
                                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-indigo-400 font-medium'
                                    }`}
                            >
                                {isAr ? item.labelAr : item.labelEn}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <div className="text-sm font-semibold text-gray-600 dark:text-gray-300 mb-4">
                        {isAr ? 'المواصفات الفنية' : 'Technical Specs'}
                    </div>
                    <div className="grid gap-2">
                        {MORE_FILTERS.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => toggleFilter(item.id)}
                                className={`flex items-center justify-between px-4 py-3 rounded-2xl border transition-all ${selectedFilters.includes(item.id)
                                    ? 'bg-blue-500 text-white border-blue-500 shadow-md'
                                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:border-blue-400'
                                    }`}
                            >
                                <span className="flex items-center gap-3 font-semibold text-sm">
                                    <span className="text-lg">{item.icon}</span>
                                    {isAr ? item.labelAr : item.labelEn}
                                </span>
                                <span className={`w-3 h-3 rounded-full ${selectedFilters.includes(item.id) ? 'bg-white' : 'bg-gray-300 dark:bg-gray-600'}`} />
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-24 w-24 border-8 border-indigo-200 dark:border-indigo-800 border-t-indigo-600 dark:border-t-indigo-400 mx-auto mb-6"></div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {isAr ? 'جاري تحميل الأسطول...' : 'Loading fleet...'}
                    </h2>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center p-6">
                <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-10 text-center shadow-2xl max-w-lg">
                    <div className="text-6xl mb-4">🚗</div>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-3 flex flex-col items-center">
                        {isAr ? 'تعذر تحميل السيارات' : 'Unable to load cars'}
                    </h2>
                    <p className="mb-8 text-gray-600 dark:text-gray-400">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-8 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold shadow-xl hover:shadow-2xl active:scale-95 transition-all w-full"
                    >
                        {isAr ? 'إعادة المحاولة' : 'Retry'}
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">
            {/* Hero Section */}
            <section className="relative overflow-hidden min-h-[85vh] flex items-center">
                <div className="absolute inset-0">
                    <Image
                        src={pageSettings.heroImage || DEFAULT_SETTINGS.heroImage}
                        alt="Luxury Cars"
                        fill
                        priority
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-gray-950/90 via-gray-900/70 to-black/50" />
                </div>

                <div className="relative container-custom mx-auto px-4 z-10 pt-24 pb-24 lg:pb-32">
                    <div className="grid lg:grid-cols-[1.2fr_1fr] gap-12 items-center">
                        <motion.div
                            initial={{ opacity: 0, x: isAr ? 40 : -40 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8 }}
                        >
                            <div className="inline-flex items-center gap-3 bg-white/10 text-white px-6 py-3 rounded-full border border-indigo-400/30 backdrop-blur-md shadow-[0_0_30px_rgba(99,102,241,0.2)]">
                                <span className="text-xl">🚘</span>
                                <span className="font-bold tracking-wider uppercase text-sm">
                                    {isAr ? pageSettings.heroBadgeAr : pageSettings.heroBadgeEn}
                                </span>
                            </div>
                            <h1 className="text-white text-5xl md:text-6xl lg:text-7xl font-black mt-8 leading-[1.1] tracking-tight">
                                {isAr ? pageSettings.heroTitleAr : pageSettings.heroTitleEn}
                            </h1>
                            <p className="text-white/80 text-xl mt-6 max-w-xl font-medium leading-relaxed">
                                {isAr ? pageSettings.heroSubtitleAr : pageSettings.heroSubtitleEn}
                            </p>
                            <div className="flex flex-wrap gap-4 mt-10">
                                <Link
                                    href={pageSettings.primaryButtonLink || '#fleet'}
                                    className="px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-black text-lg shadow-[0_10px_40px_rgba(99,102,241,0.4)] hover:shadow-indigo-500/50 hover:scale-105 transition-all"
                                >
                                    {isAr ? pageSettings.primaryButtonAr : pageSettings.primaryButtonEn}
                                </Link>
                                <Link
                                    href={pageSettings.secondaryButtonLink || '/contact'}
                                    className="px-8 py-4 rounded-2xl bg-white/10 text-white font-bold border border-white/20 hover:bg-white/20 hover:backdrop-blur-xl transition-all"
                                >
                                    {isAr ? pageSettings.secondaryButtonAr : pageSettings.secondaryButtonEn}
                                </Link>
                            </div>

                            <div className="grid grid-cols-3 gap-6 mt-16 pt-10 border-t border-white/10">
                                {(Array.isArray(pageSettings.stats) ? pageSettings.stats : DEFAULT_SETTINGS.stats).map((stat, index) => (
                                    <div key={stat.labelEn || index}>
                                        <div className="text-white text-3xl font-black bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">{stat.value}</div>
                                        <div className="text-white/60 text-sm font-semibold mt-1 tracking-wider uppercase">{isAr ? stat.labelAr : stat.labelEn}</div>
                                    </div>
                                ))}
                            </div>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="bg-white/10 backdrop-blur-2xl border border-white/20 rounded-[2.5rem] p-8 shadow-2xl shadow-indigo-500/10 lg:-mr-10"
                        >
                            <div className="text-white text-2xl font-black mb-8 flex items-center gap-3">
                                <span className="text-indigo-400">🔍</span>
                                {isAr ? pageSettings.searchTitleAr : pageSettings.searchTitleEn}
                            </div>
                            <div className="space-y-5">
                                <div className="relative">
                                    <input
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                        placeholder={isAr ? 'ابحث عبر الموديل، العلامة، أو النوع...' : 'Search by model, brand, or type...'}
                                        className="w-full px-5 py-4 pl-12 rounded-2xl bg-white/10 text-white placeholder:text-white/50 border border-white/10 focus:outline-none focus:border-indigo-400 focus:bg-white/20 transition-all font-medium"
                                    />
                                    <svg className={`absolute top-1/2 -translate-y-1/2 ${isAr ? 'right-4' : 'left-4'} w-5 h-5 text-white/50`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                                </div>

                                <button
                                    onClick={() => { document.getElementById('fleet').scrollIntoView({ behavior: 'smooth' }) }}
                                    className="w-full px-6 py-4 rounded-2xl bg-white text-gray-900 font-extrabold text-lg shadow-xl hover:bg-gray-50 active:scale-[0.98] transition-all"
                                >
                                    {isAr ? pageSettings.searchButtonAr : pageSettings.searchButtonEn}
                                </button>

                                <div className="flex items-center justify-between text-white/60 text-sm px-2 pt-2 border-t border-white/10">
                                    <span className="flex items-center gap-2"><span className="text-indigo-400">✓</span> {isAr ? pageSettings.searchHintLeftAr : pageSettings.searchHintLeftEn}</span>
                                    <span className="flex items-center gap-2"><span className="text-indigo-400">✓</span> {isAr ? pageSettings.searchHintRightAr : pageSettings.searchHintRightEn}</span>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Mobile Filters Modal */}
                {showFilters && (
                    <div className="fixed inset-0 z-50 lg:hidden">
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                            onClick={() => setShowFilters(false)}
                        />
                        <motion.div
                            initial={{ y: "100%" }}
                            animate={{ y: 0 }}
                            exit={{ y: "100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className="absolute inset-x-0 bottom-0 max-h-[85vh] rounded-t-3xl bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden flex flex-col"
                        >
                            <div className="p-5 overflow-y-auto flex-1 scrollbar-thin">
                                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100 dark:border-gray-800">
                                    <div>
                                        <h2 className="text-2xl font-black text-gray-900 dark:text-white">
                                            {isAr ? pageSettings.filtersTitleAr : pageSettings.filtersTitleEn}
                                        </h2>
                                        <div className="text-sm font-semibold text-indigo-500 mt-1">
                                            {filteredCars.length} {isAr ? 'نتيجة متاحة' : 'results available'}
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setShowFilters(false)}
                                        className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 flex items-center justify-center transition-colors"
                                    >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>
                                <FiltersPanel />
                            </div>
                            <div className="p-4 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 z-10">
                                <button
                                    onClick={() => setShowFilters(false)}
                                    className="w-full px-6 py-4 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-black shadow-xl"
                                >
                                    {isAr ? 'تطبيق الفلاتر والمتابعة' : 'Apply Filters & Continue'}
                                </button>
                            </div>
                        </motion.div>
                    </div>
                )}
            </section>

            {/* Experiences Section */}
            <section className="container-custom mx-auto px-4 relative z-30 -mt-8 lg:-mt-16 mb-12">
                <div className="grid md:grid-cols-3 gap-6">
                    {(Array.isArray(pageSettings.experiences) ? pageSettings.experiences : DEFAULT_SETTINGS.experiences).map((item, index) => (
                        <div key={item.titleEn || index} className="group bg-gray-900 dark:bg-gray-950 border border-gray-800 rounded-3xl p-6 shadow-xl hover:shadow-indigo-500/10 transition-all duration-300">
                            <div className="w-14 h-14 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform duration-500">
                                {item.icon}
                            </div>
                            <h3 className="text-lg font-black text-white mb-2 leading-tight">{isAr ? item.titleAr : item.titleEn}</h3>
                            <p className="text-sm text-gray-400 leading-relaxed">{isAr ? item.descAr : item.descEn}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Main Content Area */}
            <section id="fleet" className="container-custom mx-auto px-4 relative z-20">
                <div className="grid lg:grid-cols-[280px_1fr] xl:grid-cols-[320px_1fr] gap-8 items-start">

                    {/* Desktop Filters Sidebar */}
                    <div className="hidden lg:block">
                        <div className="bg-white dark:bg-gray-900 rounded-3xl shadow-[0_10px_40px_rgba(0,0,0,0.05)] dark:shadow-none border border-gray-100 dark:border-gray-800/60 p-6 sticky top-28">
                            <FiltersPanel />
                        </div>
                    </div>

                    <div className="space-y-10 min-w-0">
                        {/* Mobile Filters Toggle */}
                        <div className="lg:hidden bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-2xl p-4 shadow-sm flex items-center justify-between">
                            <div>
                                <div className="text-xs text-gray-500 dark:text-gray-400 font-medium uppercase tracking-wider">{isAr ? 'النتائج المتاحة' : 'Available Results'}</div>
                                <div className="text-xl font-black text-gray-900 dark:text-white mt-1">
                                    {filteredCars.length} {isAr ? 'سيارة' : 'Cars'}
                                </div>
                            </div>
                            <button
                                onClick={() => setShowFilters(true)}
                                className="px-5 py-3 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white font-bold hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors flex items-center gap-2"
                            >
                                <svg className="w-5 h-5 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12v-3m0 0Vv3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM14 15a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                                {isAr ? 'تصفية الفلاتر' : 'Filter Options'}
                            </button>
                        </div>


                        {/* Cars List Grid */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {filteredCars.map((car) => {
                                const badgeLabel = car.featured
                                    ? (isAr ? 'مميز 🔥' : 'Featured 🔥')
                                    : car.type === 'Luxury'
                                        ? (isAr ? 'فاخرة 💎' : 'Luxury 💎')
                                        : (isAr ? 'متوفر 🚙' : 'Available 🚙')

                                const imageSrc = car.coverImage || car.images?.[0] || '/img/default-car.jpg'
                                const finalPrice = car.discount
                                    ? Math.round(car.pricePerDay - (car.pricePerDay * car.discount) / 100)
                                    : car.pricePerDay

                                return (
                                    <motion.div
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        transition={{ duration: 0.4 }}
                                        key={car.id}
                                        className="group bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 flex flex-col"
                                    >
                                        <div className="relative h-64 overflow-hidden bg-gray-100 dark:bg-gray-800">
                                            <Image
                                                src={imageSrc}
                                                alt={car.name}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                                            <div className="absolute top-4 left-4 z-10">
                                                <span className="px-4 py-1.5 rounded-full bg-white/95 text-gray-900 text-xs font-black tracking-wide uppercase shadow-lg">
                                                    {badgeLabel}
                                                </span>
                                            </div>

                                            {car.discount > 0 && (
                                                <div className="absolute top-4 right-4 z-10">
                                                    <span className="px-4 py-1.5 rounded-full bg-rose-500 text-white text-xs font-black shadow-lg">
                                                        -{car.discount}%
                                                    </span>
                                                </div>
                                            )}

                                            <div className="absolute bottom-4 left-4 right-4 z-10 flex justify-between items-end">
                                                <span className="px-3 py-1 rounded-lg bg-black/40 backdrop-blur-md text-white/90 text-sm font-bold border border-white/10">
                                                    {car.brand}
                                                </span>
                                                {car.year && (
                                                    <span className="text-white/80 font-bold text-lg drop-shadow-md">
                                                        {car.year}
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="p-6 flex flex-col flex-1">
                                            <div className="flex items-start justify-between gap-4 mb-4">
                                                <div>
                                                    <h3 className="text-2xl font-black text-gray-900 dark:text-white line-clamp-1 group-hover:text-indigo-500 transition-colors">
                                                        {isAr ? car.nameAr : car.name}
                                                    </h3>
                                                </div>
                                                <div className="text-right shrink-0">
                                                    {car.discount > 0 ? (
                                                        <div className="flex flex-col items-end">
                                                            <span className="text-sm font-medium text-gray-400 line-through decoration-rose-500">${car.pricePerDay}</span>
                                                            <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">${finalPrice}</div>
                                                        </div>
                                                    ) : (
                                                        <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">${finalPrice}</div>
                                                    )}
                                                    <div className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mt-1">{isAr ? 'لليوم' : 'per day'}</div>
                                                </div>
                                            </div>

                                            {/* Specs Grid */}
                                            <div className="grid grid-cols-4 gap-2 mb-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl">
                                                <div className="text-center">
                                                    <div className="text-lg mb-1">💺</div>
                                                    <div className="text-xs font-bold text-gray-600 dark:text-gray-300">{car.seats}</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-lg mb-1">🚪</div>
                                                    <div className="text-xs font-bold text-gray-600 dark:text-gray-300">{car.doors}</div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-lg mb-1">⚙️</div>
                                                    <div className="text-[10px] sm:text-xs font-bold text-gray-600 dark:text-gray-300 truncate">
                                                        {car.transmission === 'Automatic' ? (isAr ? 'أوتو' : 'Auto') : (isAr ? 'عادي' : 'Manual')}
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="text-lg mb-1">⛽</div>
                                                    <div className="text-[10px] sm:text-xs font-bold text-gray-600 dark:text-gray-300 truncate">
                                                        {car.fuelType === 'Petrol' ? (isAr ? 'بنزين' : 'Petrol') : car.fuelType === 'Diesel' ? (isAr ? 'ديزل' : 'Diesel') : car.fuelType}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-wrap gap-2 mb-6">
                                                {(isAr ? car.featuresAr : car.features)?.slice(0, 3).map((tag, idx) => (
                                                    <span key={idx} className="px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-[11px] font-bold text-indigo-600 dark:text-indigo-300 uppercase tracking-wide border border-indigo-100 dark:border-indigo-800/30">
                                                        {tag}
                                                    </span>
                                                ))}
                                                {(car.features?.length > 3) && (
                                                    <span className="px-3 py-1.5 rounded-lg bg-gray-100 dark:bg-gray-800 text-[11px] font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                                                        +{car.features.length - 3}
                                                    </span>
                                                )}
                                            </div>

                                            <div className="mt-auto grid grid-cols-2 gap-3">
                                                <Link
                                                    href={`/cars/${car.slug}`}
                                                    className="px-4 py-3.5 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-200 font-extrabold text-sm text-center hover:bg-gray-50 dark:hover:bg-gray-800 hover:border-indigo-300 transition-all"
                                                >
                                                    {isAr ? 'عرض التفاصيل' : 'View Details'}
                                                </Link>
                                                <Link
                                                    href={`/cars/${car.slug}?book=1`}
                                                    className="px-4 py-3.5 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-extrabold text-sm text-center shadow-md hover:bg-indigo-600 dark:hover:bg-indigo-50 transition-all hover:shadow-xl"
                                                >
                                                    {isAr ? 'تأجير الآن' : 'Rent Now'}
                                                </Link>
                                            </div>
                                        </div>
                                    </motion.div>
                                )
                            })}
                        </div>

                        {/* VIP CTA Block */}
                        <div className="relative overflow-hidden bg-gray-900 dark:bg-black rounded-[2.5rem] p-10 lg:p-14 text-white shadow-2xl">
                            <div className="absolute inset-0 opacity-40">
                                <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500 rounded-full blur-[100px] transform translate-x-1/2 -translate-y-1/2" />
                                <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500 rounded-full blur-[100px] transform -translate-x-1/2 translate-y-1/2" />
                            </div>

                            <div className="relative z-10 grid lg:grid-cols-[1fr_auto] gap-10 items-center">
                                <div className="max-w-2xl">
                                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-bold uppercase tracking-widest mb-6">
                                        <span className="w-2 h-2 rounded-full bg-yellow-400 animate-pulse" />
                                        {isAr ? 'خدمة متميزة' : 'Premium Service'}
                                    </div>
                                    <h3 className="text-4xl md:text-5xl font-black mb-5 leading-tight">{isAr ? pageSettings.vipTitleAr : pageSettings.vipTitleEn}</h3>
                                    <p className="text-white/80 text-lg leading-relaxed">{isAr ? pageSettings.vipDescriptionAr : pageSettings.vipDescriptionEn}</p>
                                </div>
                                <div className="flex flex-col sm:flex-row lg:flex-col gap-4 w-full sm:w-auto">
                                    <Link
                                        href={pageSettings.vipPrimaryButtonLink || '/contact'}
                                        className="px-8 py-5 rounded-2xl bg-white text-gray-900 font-black text-center shadow-[0_0_30px_rgba(255,255,255,0.3)] hover:scale-105 active:scale-95 transition-all text-lg min-w-[200px]"
                                    >
                                        {isAr ? pageSettings.vipPrimaryButtonAr : pageSettings.vipPrimaryButtonEn}
                                    </Link>
                                    <Link
                                        href={pageSettings.vipSecondaryButtonLink || '/tours'}
                                        className="px-8 py-5 rounded-2xl bg-white/10 border border-white/20 text-white font-bold text-center hover:bg-white/20 transition-all text-lg min-w-[200px]"
                                    >
                                        {isAr ? pageSettings.vipSecondaryButtonAr : pageSettings.vipSecondaryButtonEn}
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Empty State */}
                        {filteredCars.length === 0 && (
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-[2.5rem] p-16 text-center shadow-lg"
                            >
                                <div className="w-24 h-24 rounded-full bg-gray-50 dark:bg-gray-800 flex items-center justify-center text-4xl mx-auto mb-6">🏜️</div>
                                <h3 className="text-3xl font-black text-gray-900 dark:text-white mb-4">
                                    {isAr ? 'لم نجد سيارات مطابقة لبحثك' : 'No cars match your search'}
                                </h3>
                                <p className="text-gray-500 dark:text-gray-400 text-lg max-w-md mx-auto mb-8">
                                    {isAr
                                        ? 'جرب تغيير فئة السيارة أو نطاق السعر للوصول لنتائج أفضل، أو تواصل معنا لطلبات خاصة.'
                                        : 'Try adjusting car category or price range for better results, or contact us for special requests.'}
                                </p>
                                <button
                                    onClick={() => {
                                        setSearch('')
                                        setSelectedTypes([])
                                        setSelectedFilters([])
                                        setBudget(500)
                                    }}
                                    className="px-8 py-4 rounded-xl bg-gray-900 dark:bg-white text-white dark:text-gray-900 font-bold hover:shadow-xl transition-all"
                                >
                                    {isAr ? 'إعادة ضبط الفلاتر' : 'Reset Filters'}
                                </button>
                            </motion.div>
                        )}
                    </div>
                </div>
            </section>
        </div>
    )
}
