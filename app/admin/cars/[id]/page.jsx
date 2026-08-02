'use client'

import { use, useEffect, useState } from 'react'
import { useApp } from '@/contexts/AppContext'
import AdminLayout from '@/components/admin/AdminLayout'
import { useToast } from '@/components/admin/Toast'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import ImageUploader from '@/components/admin/ImageUploader'

const parseArabicNum = (str) => {
    if (str === null || str === undefined || str === '') return ''
    return String(str).replace(/[٠-٩]/g, d => '٠١٢٣٤٥٦٧٨٩'.indexOf(d))
}

const CAR_TYPES = [
    { value: 'Sedan', label: 'Sedan', labelAr: 'سيدان (صالون صغير)' },
    { value: 'Mid-size Sedan', label: 'Mid-size Sedan', labelAr: 'سيدان (صالون متوسط)' },
    { value: 'Luxury Sedan', label: 'Luxury Sedan', labelAr: 'سيدان فاخرة (VIP)' },
    { value: 'SUV', label: 'SUV', labelAr: 'دفع رباعي عائلي (SUV)' },
    { value: '4x4', label: '4x4', labelAr: 'دفع رباعي مجهز (جيب/شاص)' },
    { value: 'Pick-up', label: 'Pick-up', labelAr: 'بيك أب (حوض/شاص)' },
    { value: 'Crossover', label: 'Crossover', labelAr: 'كروس أوفر' },
    { value: 'Van', label: 'Van', labelAr: 'باص عائلي (فان)' },
    { value: 'Minibus', label: 'Minibus', labelAr: 'باص سياحي صغير (ميني باص)' },
    { value: 'Bus', label: 'Bus', labelAr: 'باص سياحي كبير' },
    { value: 'Hatchback', label: 'Hatchback', labelAr: 'هاتشباك (سيارة صغيرة)' },
    { value: 'Sports', label: 'Sports', labelAr: 'سيارة رياضية' },
    { value: 'Economy', label: 'Economy', labelAr: 'سيارة اقتصادية' },
    { value: 'Convertible', label: 'Convertible', labelAr: 'سيارة مكشوفة (كابريوليه)' },
]

const TRANSMISSION_TYPES = [
    { value: 'Automatic', label: 'Automatic', labelAr: 'أوتوماتيك' },
    { value: 'Manual', label: 'Manual', labelAr: 'يدوي' },
]

const FUEL_TYPES = [
    { value: 'Petrol', label: 'Petrol', labelAr: 'بنزين' },
    { value: 'Diesel', label: 'Diesel', labelAr: 'ديزل' },
    { value: 'Electric', label: 'Electric', labelAr: 'كهربائي' },
    { value: 'Hybrid', label: 'Hybrid', labelAr: 'هجين' },
]

const INSURANCE_TYPES = [
    { value: 'Basic', label: 'Basic', labelAr: 'تأمين أساسي' },
    { value: 'Full', label: 'Full', labelAr: 'تأمين شامل' },
]

const MILEAGE_TYPES = [
    { value: 'Unlimited', label: 'Unlimited', labelAr: 'غير محدود' },
    { value: 'Limited', label: 'Limited', labelAr: 'محدود' },
]

const STATUS_TYPES = [
    { value: 'ACTIVE', label: 'Active', labelAr: 'نشط' },
    { value: 'INACTIVE', label: 'Inactive', labelAr: 'غير نشط' },
    { value: 'MAINTENANCE', label: 'Maintenance', labelAr: 'صيانة' },
]

const EMPTY_FORM = {
    name: '',
    nameAr: '',
    slug: '',
    description: '',
    descriptionAr: '',
    brand: '',
    type: 'SUV',
    year: '',
    pricePerDay: '',
    discount: '0',
    seats: '4',
    doors: '4',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    insurance: 'Basic',
    insuranceAr: 'تأمين أساسي',
    mileage: 'Unlimited',
    mileageAr: 'غير محدود',
    color: '',
    colorAr: '',
    minAge: '21',
    deposit: '0',
    luggage: '2',
    featured: false,
    status: 'ACTIVE',
    coverImage: '',
    images: [],
    videoUrl: '',
    features: [],
    featuresAr: [],
    metaTitle: '',
    metaDescription: '',
    keywords: []
}

export default function AdminCarDetails({ params }) {
    const { locale } = useApp()
    const { success, error: showError } = useToast()
    const isAr = locale === 'ar'
    const router = useRouter()
    const { id } = use(params)

    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [formData, setFormData] = useState(EMPTY_FORM)
    const [error, setError] = useState(null)

    const [newFeature, setNewFeature] = useState('')
    const [newFeatureAr, setNewFeatureAr] = useState('')
    const [newKeyword, setNewKeyword] = useState('')

    useEffect(() => {
        const fetchCar = async () => {
            try {
                setLoading(true)
                setError(null)
                const res = await fetch(`/api/admin/cars/${id}`)
                const data = await res.json()
                if (data.success) {
                    const car = data.data
                        setFormData({
                        ...EMPTY_FORM,
                        ...car,
                        type: car.type || 'SUV',
                        brand: car.brand || '',
                        transmission: car.transmission || 'Automatic',
                        fuelType: car.fuelType || 'Petrol',
                        pricePerDay: car.pricePerDay?.toString() || '',
                        discount: car.discount?.toString() || '0',
                        year: car.year?.toString() || '',
                        seats: car.seats?.toString() || '4',
                        doors: car.doors?.toString() || '4',
                        insurance: car.insurance || 'Basic',
                        insuranceAr: car.insuranceAr || 'تأمين أساسي',
                        mileage: car.mileage || 'Unlimited',
                        mileageAr: car.mileageAr || 'غير محدود',
                        color: car.color || '',
                        colorAr: car.colorAr || '',
                        videoUrl: car.videoUrl || '',
                        minAge: car.minAge?.toString() || '21',
                        deposit: car.deposit?.toString() || '0',
                        luggage: car.luggage?.toString() || '2',
                        featured: !!car.featured,
                        status: car.status || 'ACTIVE',
                        images: car.images || [],
                        features: car.features || [],
                        featuresAr: car.featuresAr || [],
                        keywords: car.keywords || [],
                        metaTitle: car.metaTitle || '',
                        metaDescription: car.metaDescription || ''
                    })
                } else {
                    setError(data.error || 'Car not found')
                }
            } catch (err) {
                setError(err.message)
            } finally {
                setLoading(false)
            }
        }
        fetchCar()
    }, [id])

    const handleFormChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }))
    }

    const handleAddFeature = () => {
        if (!newFeature.trim()) return
        setFormData((prev) => ({ ...prev, features: [...prev.features, newFeature.trim()] }))
        setNewFeature('')
    }

    const handleAddFeatureAr = () => {
        if (!newFeatureAr.trim()) return
        setFormData((prev) => ({ ...prev, featuresAr: [...prev.featuresAr, newFeatureAr.trim()] }))
        setNewFeatureAr('')
    }

    const handleAddKeyword = () => {
        if (!newKeyword.trim()) return
        setFormData((prev) => ({ ...prev, keywords: [...prev.keywords, newKeyword.trim()] }))
        setNewKeyword('')
    }

    const handleRemoveItem = (field, index) => {
        setFormData((prev) => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }))
    }

    const handleCoverUpload = (url) => handleFormChange('coverImage', url || '')

    const handleGalleryUpload = (urls) => {
        const incoming = Array.isArray(urls) ? urls : [urls]
        handleFormChange('images', [...formData.images, ...incoming.filter(u => !!u)])
    }

    const handleSave = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            const payload = {
                ...formData,
                pricePerDay: parseFloat(parseArabicNum(formData.pricePerDay)) || 0,
                discount: parseFloat(parseArabicNum(formData.discount)) || 0,
                seats: parseInt(parseArabicNum(formData.seats)) || 0,
                doors: parseInt(parseArabicNum(formData.doors)) || 0,
                year: parseInt(parseArabicNum(formData.year)) || new Date().getFullYear(),
                deposit: parseFloat(parseArabicNum(formData.deposit)) || 0,
                luggage: parseInt(parseArabicNum(formData.luggage)) || 0,
                minAge: parseInt(parseArabicNum(formData.minAge)) || 18,
            }

            const res = await fetch('/api/admin/cars', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            })
            const data = await res.json()
            if (data.success) {
                success(isAr ? 'تم حفظ التغييرات بنجاح' : 'Changes saved successfully')
            } else {
                showError(data.error || 'Failed to save')
            }
        } catch (err) {
            showError(err.message)
        } finally {
            setSaving(false)
        }
    }

    const previewSlug = formData.slug || ''
    const previewUrl = previewSlug ? `/cars/${previewSlug}` : '/cars'

    if (loading) {
        return (
            <AdminLayout>
                <div className="min-h-[60vh] flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-24 w-24 border-8 border-indigo-200 dark:border-indigo-800 border-t-indigo-600 dark:border-t-indigo-400 mx-auto mb-6"></div>
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {isAr ? 'جاري تحميل تفاصيل السيارة...' : 'Loading car details...'}
                        </h2>
                    </div>
                </div>
            </AdminLayout>
        )
    }

    if (error) {
        return (
            <AdminLayout>
                <div className="min-h-[60vh] flex items-center justify-center">
                    <div className="bg-white dark:bg-gray-900 border border-rose-200 dark:border-rose-800 rounded-3xl p-10 text-center shadow-xl max-w-lg">
                        <div className="text-5xl mb-4">🚙</div>
                        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-3">
                            {isAr ? 'تعذر تحميل بيانات السيارة' : 'Unable to load car'}
                        </h2>
                        <p className="mb-6">{error}</p>
                        <Link
                            href="/admin/cars"
                            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-bold shadow-lg"
                        >
                            {isAr ? 'العودة للأسطول' : 'Back to fleet'}
                        </Link>
                    </div>
                </div>
            </AdminLayout>
        )
    }

    return (
        <AdminLayout>
            <form onSubmit={handleSave} className="space-y-8 pb-20">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-900 via-blue-900 to-purple-900 p-10 text-white shadow-2xl"
                >
                    <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-purple-400/20 blur-3xl" />
                    <div className="absolute -left-10 -bottom-10 h-48 w-48 rounded-full bg-blue-400/20 blur-3xl" />
                    <div className="relative z-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                        <div>
                            <div className="inline-flex items-center gap-3 rounded-full bg-white/10 px-5 py-2 text-sm font-semibold">
                                <span className="text-lg">🚘</span>
                                {isAr ? 'تحكم احترافي بتفاصيل السيارة' : 'Car Detail Control'}
                            </div>
                            <h1 className="mt-5 text-4xl font-black">{isAr ? 'إدارة تفاصيل السيارة' : 'Car Details Manager'}</h1>
                            <p className="mt-3 text-white/80 max-w-2xl">
                                {isAr ? 'تحرير كامل لكل البيانات، المواصفات الميكانيكية، الصور، والأسعار بشكل احترافي.' : 'Premium console to edit vehicle specs, media, capabilities, and pricing.'}
                            </p>
                        </div>
                        <div className="flex flex-wrap gap-3">
                            <Link
                                href={previewUrl}
                                target="_blank"
                                className="px-6 py-3 rounded-2xl bg-white text-gray-900 font-black shadow-xl hover:shadow-2xl transition-all"
                            >
                                {isAr ? 'معاينة السيارة' : 'Preview Live'}
                            </Link>
                            <button
                                type="submit"
                                disabled={saving}
                                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-black shadow-xl disabled:opacity-60"
                            >
                                {saving ? (isAr ? 'جارٍ الحفظ...' : 'Saving...') : (isAr ? 'حفظ التغييرات' : 'Save changes')}
                            </button>
                        </div>
                    </div>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-xl space-y-4">
                        <h3 className="text-xl font-black text-gray-900 dark:text-white">{isAr ? 'المعلومات الأساسية' : 'Basic info'}</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <input
                                value={formData.name}
                                onChange={(e) => handleFormChange('name', e.target.value)}
                                placeholder={isAr ? 'اسم السيارة (إنجليزي)' : 'Car name (EN)'}
                                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                                required
                            />
                            <input
                                value={formData.nameAr}
                                onChange={(e) => handleFormChange('nameAr', e.target.value)}
                                placeholder={isAr ? 'اسم السيارة (عربي)' : 'Car name (AR)'}
                                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-right"
                                required
                            />
                            <input
                                value={formData.slug}
                                onChange={(e) => handleFormChange('slug', e.target.value)}
                                placeholder={isAr ? 'المسار (slug)' : 'Slug'}
                                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                            />
                            <select
                                value={formData.type}
                                onChange={(e) => handleFormChange('type', e.target.value)}
                                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                            >
                                <option value="Pick-up">{isAr ? 'شاص / بيك أب' : 'Pick-up'}</option>
                                <option value="SUV">SUV</option>
                                <option value="4x4">{isAr ? 'دفع رباعي / جيب' : '4x4 / Off-Road'}</option>
                                <option value="Sedan">{isAr ? 'سيدان صالون صغير' : 'Sedan'}</option>
                                <option value="Van">{isAr ? 'عائلي / باص' : 'Family / Van'}</option>
                                <option value="Economy">{isAr ? 'اقتصادي' : 'Economy'}</option>
                                <option value="VIP">{isAr ? 'فاخر / VIP' : 'VIP Transport'}</option>
                            </select>
                            <input
                                value={formData.brand}
                                onChange={(e) => handleFormChange('brand', e.target.value)}
                                placeholder={isAr ? 'العلامة التجارية (مثل Toyota)' : 'Brand (e.g. Toyota)'}
                                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                            />
                            <input
                                type="number"
                                value={formData.year}
                                onChange={(e) => handleFormChange('year', e.target.value)}
                                placeholder={isAr ? 'سنة الصنع' : 'Manufacture year'}
                                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                            />
                        </div>
                        <textarea
                            value={formData.description}
                            onChange={(e) => handleFormChange('description', e.target.value)}
                            placeholder={isAr ? 'وصف السيارة (EN)' : 'Car Description (EN)'}
                            className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white min-h-[120px]"
                            required
                        />
                        <textarea
                            value={formData.descriptionAr}
                            onChange={(e) => handleFormChange('descriptionAr', e.target.value)}
                            placeholder={isAr ? 'وصف السيارة (AR)' : 'Car Description (AR)'}
                            className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white min-h-[120px] text-right"
                            required
                        />
                    </div>

                    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-xl space-y-4">
                        <h3 className="text-xl font-black text-gray-900 dark:text-white">{isAr ? 'الأسعار والمواصفات' : 'Pricing & Specs'}</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                            <input
                                type="number"
                                value={formData.pricePerDay}
                                onChange={(e) => handleFormChange('pricePerDay', e.target.value)}
                                placeholder={isAr ? 'السعر لليوم ($)' : 'Price per day ($)'}
                                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                                required
                            />
                            <input
                                type="number"
                                value={formData.discount}
                                onChange={(e) => handleFormChange('discount', e.target.value)}
                                placeholder={isAr ? 'الخصم (%)' : 'Discount (%)'}
                                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                            />
                            <input
                                type="number"
                                value={formData.seats}
                                onChange={(e) => handleFormChange('seats', e.target.value)}
                                placeholder={isAr ? 'عدد المقاعد' : 'Number of seats'}
                                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                            />
                            <input
                                type="number"
                                value={formData.doors}
                                onChange={(e) => handleFormChange('doors', e.target.value)}
                                placeholder={isAr ? 'عدد الأبواب' : 'Number of doors'}
                                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                            />
                            <select
                                value={formData.transmission}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    const map = { 'Automatic': 'أوتوماتيك', 'Manual': 'يدوي / عادي' };
                                    handleFormChange('transmission', val);
                                    handleFormChange('transmissionAr', map[val]);
                                }}
                                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                            >
                                <option value="Automatic">{isAr ? 'تلقائي / أوتوماتيك (Automatic)' : 'Automatic'}</option>
                                <option value="Manual">{isAr ? 'يدوي / عادي (Manual)' : 'Manual'}</option>
                            </select>
                            <select
                                value={formData.fuelType}
                                onChange={(e) => {
                                    const val = e.target.value;
                                    const map = { 'Petrol': 'بنزين', 'Diesel': 'ديزل', 'Electric': 'كهربائي', 'Hybrid': 'هجين' };
                                    handleFormChange('fuelType', val);
                                    handleFormChange('fuelAr', map[val]);
                                }}
                                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                            >
                                <option value="Petrol">{isAr ? 'بنزين (Petrol)' : 'Petrol'}</option>
                                <option value="Diesel">{isAr ? 'ديزل (Diesel)' : 'Diesel'}</option>
                                <option value="Hybrid">{isAr ? 'هجين (Hybrid)' : 'Hybrid'}</option>
                                <option value="Electric">{isAr ? 'كهرباء (Electric)' : 'Electric'}</option>
                            </select>
                            <select
                                value={formData.status}
                                onChange={(e) => handleFormChange('status', e.target.value)}
                                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                            >
                                <option value="ACTIVE">{isAr ? 'نشط' : 'Active'}</option>
                                <option value="DRAFT">{isAr ? 'مسودة' : 'Draft'}</option>
                                <option value="SUSPENDED">{isAr ? 'موقوف' : 'Suspended'}</option>
                            </select>
                            <label className="flex items-center gap-3 text-sm font-semibold text-gray-700 dark:text-gray-200">
                                <input
                                    type="checkbox"
                                    checked={formData.featured}
                                    onChange={(e) => handleFormChange('featured', e.target.checked)}
                                    className="w-5 h-5 rounded"
                                />
                                {isAr ? 'تمييز السيارة في الصفحة الرئيسية' : 'Feature car on main page'}
                            </label>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-xl space-y-4 lg:col-span-2">
                        <h3 className="text-xl font-black text-gray-900 dark:text-white">{isAr ? 'شروط وعقود الإيجار الاحترافية' : 'Professional Rental Terms'}</h3>
                        <div className="grid md:grid-cols-3 gap-4">

                            <input
                                type="number"
                                value={formData.deposit}
                                onChange={(e) => handleFormChange('deposit', e.target.value)}
                                placeholder={isAr ? 'مبلغ التأمين المسترد ($)' : 'Security Deposit ($)'}
                                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                            />
                            
                            <div className="md:col-span-2">
                                <select
                                    value={formData.mileage}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        const map = { 
                                            'Unlimited': 'مفتوح', 
                                            '100 km/day': '100 كم/يوم', 
                                            '150 km/day': '150 كم/يوم', 
                                            '200 km/day': '200 كم/يوم', 
                                            '250 km/day': '250 كم/يوم', 
                                            '300 km/day': '300 كم/يوم',
                                            '400 km/day': '400 كم/يوم',
                                            '500 km/day': '500 كم/يوم',
                                            '600 km/day': '600 كم/يوم'
                                        };
                                        handleFormChange('mileage', val);
                                        handleFormChange('mileageAr', map[val]);
                                    }}
                                    className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                                >
                                    <option value="" disabled>{isAr ? '-- اختر حد الكيلومترات --' : '-- Select Mileage --'}</option>
                                    <option value="Unlimited">{isAr ? 'مفتوح / غير محدود' : 'Unlimited'}</option>
                                    <option value="100 km/day">{isAr ? '100 كم/يوم' : '100 km/day'}</option>
                                    <option value="150 km/day">{isAr ? '150 كم/يوم' : '150 km/day'}</option>
                                    <option value="200 km/day">{isAr ? '200 كم/يوم' : '200 km/day'}</option>
                                    <option value="250 km/day">{isAr ? '250 كم/يوم' : '250 km/day'}</option>
                                    <option value="300 km/day">{isAr ? '300 كم/يوم' : '300 km/day'}</option>
                                    <option value="400 km/day">{isAr ? '400 كم/يوم' : '400 km/day'}</option>
                                    <option value="500 km/day">{isAr ? '500 كم/يوم' : '500 km/day'}</option>
                                    <option value="600 km/day">{isAr ? '600 كم/يوم' : '600 km/day'}</option>
                                </select>
                            </div>
                            <input
                                type="number"
                                value={formData.minAge}
                                onChange={(e) => handleFormChange('minAge', e.target.value)}
                                placeholder={isAr ? 'العمر الأدنى للسائق' : 'Min Driver Age'}
                                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                            />

                            <input
                                value={formData.color}
                                onChange={(e) => handleFormChange('color', e.target.value)}
                                placeholder={isAr ? 'اللون (EN)' : 'Car Color (EN)'}
                                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                            />
                            <input
                                value={formData.colorAr}
                                onChange={(e) => handleFormChange('colorAr', e.target.value)}
                                placeholder={isAr ? 'اللون (AR)' : 'Car Color (AR)'}
                                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-right"
                            />
                            <input
                                type="number"
                                value={formData.luggage}
                                onChange={(e) => handleFormChange('luggage', e.target.value)}
                                placeholder={isAr ? 'سعة الحقائب' : 'Luggage Capacity (Bags)'}
                                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                            />
                        </div>
                    </div>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-xl space-y-4">
                        <h3 className="text-xl font-black text-gray-900 dark:text-white">{isAr ? 'الوسائط المرئية' : 'Media Gallery'}</h3>
                        
                        {/* Dual Cover Image Setup */}
                        <div className="space-y-4 pt-2">
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                <span className="text-indigo-500">📸</span>
                                {isAr ? 'صورة الغلاف الرئيسية (مطلوبة)' : 'Main Cover Image (Required)'}
                            </h4>
                            <div className="grid md:grid-cols-2 gap-4 items-start">
                                {/* Option 1: Upload */}
                                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700">
                                    <div className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">{isAr ? 'رفع صورة' : 'Upload Image'}</div>
                                    <ImageUploader
                                        value={formData.coverImage && formData.coverImage.startsWith('/') ? formData.coverImage : ''}
                                        onChange={handleCoverUpload}
                                        multiple={false}
                                    />
                                </div>

                                {/* Option 2: Image URL */}
                                <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-100 dark:border-gray-700 h-full flex flex-col justify-center">
                                    <div className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-2 uppercase tracking-wider">{isAr ? 'رابط صورة خارجي' : 'External Image URL'}</div>
                                    <div className="flex bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
                                        <span className="bg-gray-50 dark:bg-gray-800 px-3 py-2 text-gray-400 border-r border-gray-200 dark:border-gray-700">🔗</span>
                                        <input
                                            type="url"
                                            value={formData.coverImage && formData.coverImage.startsWith('http') ? formData.coverImage : ''}
                                            onChange={(e) => handleFormChange('coverImage', e.target.value)}
                                            placeholder="https://..."
                                            className="w-full px-3 py-2 bg-transparent text-gray-900 dark:text-white focus:outline-none text-sm"
                                            dir="ltr"
                                        />
                                    </div>
                                    <p className="text-[10px] text-gray-400 mt-2">{isAr ? 'ألصق رابط مباشر كبديل عن الرفع.' : 'Paste a link instead of uploading.'}</p>
                                </div>
                            </div>
                            
                            {/* Current Preview */}
                            {formData.coverImage && (
                                <div className="mt-2 text-center relative group inline-block">
                                    <div className="text-[10px] font-bold text-indigo-500 uppercase mb-1">{isAr ? 'الصورة الحالية' : 'Current'}</div>
                                    <img 
                                        src={formData.coverImage} 
                                        alt="Current Cover" 
                                        className="h-24 w-auto object-contain rounded-lg shadow-sm border border-gray-200 dark:border-gray-700" 
                                        onError={(e) => { e.target.onerror = null; e.target.src = '/img/placeholder.jpg'; }}
                                    />
                                </div>
                            )}
                        </div>

                        <div className="pt-6 mt-6 border-t border-gray-100 dark:border-gray-800">
                            <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-3">
                                {isAr ? 'معرض الصور الإضافية' : 'Additional Gallery Images'}
                            </h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                                {formData.images.map((img, index) => (
                                    <div key={img} className="relative h-28 rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
                                        <Image src={img} alt={`gallery-${index}`} fill className="object-cover" />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveItem('images', index)}
                                            className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-7 h-7 flex items-center justify-center hover:bg-rose-500 transition-colors shadow-lg"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                            <ImageUploader onUploadProp={handleGalleryUpload} multiple={true} />
                        </div>

                        <div className="pt-4">
                            <label className="text-sm font-bold text-gray-700 dark:text-gray-300 block mb-2">{isAr ? 'رابط فيديو استعراض السيارة (إن وجد)' : 'Video Showcase URL (Optional)'}</label>
                            <input
                                type="url"
                                value={formData.videoUrl}
                                onChange={(e) => handleFormChange('videoUrl', e.target.value)}
                                placeholder="https://youtube.com/..."
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                                dir="ltr"
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-xl space-y-4">
                            <h3 className="text-xl font-black text-gray-900 dark:text-white">{isAr ? 'ميزات السيارة (EN)' : 'Car Features (EN)'}</h3>
                            <div className="flex gap-2">
                                <input
                                    value={newFeature}
                                    onChange={(e) => setNewFeature(e.target.value)}
                                    placeholder={isAr ? 'إضافة ميزة (مثل: تكييف هواء، بلوتوث)' : 'Add feature (e.g., Air Conditioning, Bluetooth)'}
                                    className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddFeature())}
                                />
                                <button
                                    type="button"
                                    onClick={handleAddFeature}
                                    className="px-5 py-3 rounded-2xl bg-indigo-500 hover:bg-indigo-600 transition-colors text-white font-bold"
                                >
                                    +
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.features.map((item, index) => (
                                    <button
                                        type="button"
                                        key={`f-${index}`}
                                        onClick={() => handleRemoveItem('features', index)}
                                        className="px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-sm font-semibold hover:bg-rose-100 hover:text-rose-700 transition-colors"
                                        title={isAr ? 'حذف' : 'Remove'}
                                    >
                                        {item} ×
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-xl space-y-4">
                            <h3 className="text-xl font-black text-gray-900 dark:text-white">{isAr ? 'ميزات السيارة (AR)' : 'Car Features (AR)'}</h3>
                            <div className="flex gap-2">
                                <input
                                    value={newFeatureAr}
                                    onChange={(e) => setNewFeatureAr(e.target.value)}
                                    placeholder={isAr ? 'أضف ميزة (AR)' : 'Add feature (AR)'}
                                    className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white text-right"
                                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddFeatureAr())}
                                />
                                <button
                                    type="button"
                                    onClick={handleAddFeatureAr}
                                    className="px-5 py-3 rounded-2xl bg-indigo-500 hover:bg-indigo-600 transition-colors text-white font-bold"
                                >
                                    +
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.featuresAr.map((item, index) => (
                                    <button
                                        type="button"
                                        key={`far-${index}`}
                                        onClick={() => handleRemoveItem('featuresAr', index)}
                                        className="px-4 py-2 rounded-full bg-indigo-50 text-indigo-700 text-sm font-semibold hover:bg-rose-100 hover:text-rose-700 transition-colors"
                                    >
                                        {item} ×
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-xl space-y-4">
                            <h3 className="text-xl font-black text-gray-900 dark:text-white">{isAr ? 'تحسين محركات البحث (SEO)' : 'SEO Metadata'}</h3>
                            <input
                                value={formData.metaTitle}
                                onChange={(e) => handleFormChange('metaTitle', e.target.value)}
                                placeholder={isAr ? 'عنوان الميتا' : 'Meta title'}
                                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                            />
                            <textarea
                                value={formData.metaDescription}
                                onChange={(e) => handleFormChange('metaDescription', e.target.value)}
                                placeholder={isAr ? 'وصف الميتا' : 'Meta description'}
                                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white min-h-[100px]"
                            />
                            <div className="flex gap-2">
                                <input
                                    value={newKeyword}
                                    onChange={(e) => setNewKeyword(e.target.value)}
                                    placeholder={isAr ? 'أضف كلمة مفتاحية' : 'Add keyword'}
                                    className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddKeyword())}
                                />
                                <button
                                    type="button"
                                    onClick={handleAddKeyword}
                                    className="px-5 py-3 rounded-2xl bg-purple-500 hover:bg-purple-600 transition-colors text-white font-bold"
                                >
                                    +
                                </button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {formData.keywords.map((item, index) => (
                                    <button
                                        type="button"
                                        key={`kw-${index}`}
                                        onClick={() => handleRemoveItem('keywords', index)}
                                        className="px-3 py-2 rounded-full bg-purple-50 text-purple-700 text-sm font-semibold hover:bg-rose-100 hover:text-rose-700 transition-colors"
                                    >
                                        {item} ×
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </AdminLayout>
    )
}
