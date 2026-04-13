'use client'

import { useState, useEffect, useCallback } from 'react'
import { Save, Plus, Trash2, Image as ImageIcon, Layout, Tag, Percent, CheckCircle, Smartphone, Globe, Info } from 'lucide-react'
import { useToast } from '@/components/admin/Toast'
import ImageUploader from '@/components/admin/ImageUploader'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

export default function ToursPageSettings() {
    const { success, error: showError } = useToast()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [activeTab, setActiveTab] = useState('hero')

    const [settings, setSettings] = useState({
        heroTitleEn: '',
        heroTitleAr: '',
        heroSubtitleEn: '',
        heroSubtitleAr: '',
        heroImage: '',
        categoriesTitleEn: '',
        categoriesTitleAr: '',
        categoriesSubtitleEn: '',
        categoriesSubtitleAr: '',
        specialOffers: []
    })

    const fetchSettings = useCallback(async () => {
        try {
            const res = await fetch('/api/settings/tours-page')
            const data = await res.json()
            if (data.success && data.data) {
                setSettings({
                    ...data.data,
                    specialOffers: Array.isArray(data.data.specialOffers) ? data.data.specialOffers : []
                })
            }
        } catch (error) {
            console.error('Failed to fetch settings:', error)
            showError('فشل تحميل الإعدادات')
        } finally {
            setLoading(false)
        }
    }, [showError])

    useEffect(() => {
        fetchSettings()
    }, [fetchSettings])

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            const res = await fetch('/api/settings/tours-page', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            })
            const data = await res.json()
            if (data.success) {
                success('تم تحديث الإعدادات بنجاح')
            } else {
                throw new Error(data.error)
            }
        } catch (error) {
            console.error('Failed to update settings:', error)
            showError(error.message || 'فشل تحديث الإعدادات')
        } finally {
            setSaving(false)
        }
    }

    const handleAddOffer = () => {
        setSettings(prev => ({
            ...prev,
            specialOffers: [
                ...prev.specialOffers,
                {
                    titleEn: 'New Offer',
                    titleAr: 'عرض جديد',
                    discount: '10%',
                    descriptionEn: 'Description here',
                    descriptionAr: 'الوصف هنا',
                    icon: '🎉',
                    gradient: 'from-blue-500 to-purple-600'
                }
            ]
        }))
    }

    const handleRemoveOffer = (index) => {
        setSettings(prev => ({
            ...prev,
            specialOffers: prev.specialOffers.filter((_, i) => i !== index)
        }))
    }

    const handleOfferChange = (index, field, value) => {
        const newOffers = [...settings.specialOffers]
        newOffers[index] = { ...newOffers[index], [field]: value }
        setSettings(prev => ({ ...prev, specialOffers: newOffers }))
    }

    if (loading) return (
        <div className="flex justify-center items-center min-h-[60vh]">
            <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full"
            />
        </div>
    )

    const tabs = [
        { id: 'hero', label: 'القسم الرئيسي', icon: Layout, color: 'text-blue-500', bg: 'bg-blue-500/10' },
        { id: 'offers', label: 'العروض المميزة', icon: Percent, color: 'text-purple-500', bg: 'bg-purple-500/10' },
        { id: 'categories', label: 'قسم التصنيفات', icon: Tag, color: 'text-green-500', bg: 'bg-green-500/10' },
    ]

    return (
        <div className="min-h-screen bg-transparent" dir="rtl">
            <div className="max-w-7xl mx-auto p-6 space-y-8">

                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl p-6 rounded-2xl shadow-sm border border-gray-200/50 dark:border-gray-700/50"
                >
                    <div>
                        <h1 className="text-3xl font-black bg-gradient-to-l from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            إعدادات صفحة الجولات
                        </h1>
                        <p className="text-gray-500 dark:text-gray-400 mt-1 font-medium">
                            تحكم كامل في مظهر ومحتوى صفحة الجولات السياحية
                        </p>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleSubmit}
                        disabled={saving}
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-3 rounded-xl shadow-lg hover:shadow-blue-500/25 disabled:opacity-70 disabled:cursor-not-allowed transition-all font-bold text-lg"
                    >
                        {saving ? (
                            <motion.div
                                animate={{ rotate: 360 }}
                                transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                            >
                                <Layout className="w-5 h-5" />
                            </motion.div>
                        ) : (
                            <Save className="w-5 h-5" />
                        )}
                        {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
                    </motion.button>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Updated Sidebar */}
                    <div className="lg:col-span-1 space-y-3">
                        {tabs.map((tab) => (
                            <motion.button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                whileHover={{ x: -5 }}
                                whileTap={{ scale: 0.98 }}
                                className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all border font-bold relative overflow-hidden group ${activeTab === tab.id
                                    ? 'bg-white dark:bg-gray-800 border-blue-500/30 shadow-lg scale-[1.02]'
                                    : 'bg-white/50 dark:bg-gray-800/50 border-transparent hover:bg-white dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400'
                                    }`}
                            >
                                <div className={`p-3 rounded-lg ${tab.bg} ${tab.color}`}>
                                    <tab.icon size={20} />
                                </div>
                                <span className={`text-lg transition-colors ${activeTab === tab.id ? 'text-gray-900 dark:text-white' : ''}`}>
                                    {tab.label}
                                </span>
                                {activeTab === tab.id && (
                                    <motion.div
                                        layoutId="activeTabIndicator"
                                        className="absolute left-0 top-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-500 to-purple-500 rounded-r-full"
                                    />
                                )}
                            </motion.button>
                        ))}
                    </div>

                    {/* Content Area */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="lg:col-span-3"
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeTab}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.2 }}
                            >
                                {/* Hero Section */}
                                {activeTab === 'hero' && (
                                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-xl">
                                        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100 dark:border-gray-700">
                                            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-xl text-blue-600 dark:text-blue-400">
                                                <ImageIcon size={24} />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-black text-gray-900 dark:text-white">إعدادات القسم الرئيسي</h2>
                                                <p className="text-sm text-gray-500">تخصيص الصورة والنصوص الرئيسية في أعلى الصفحة</p>
                                            </div>
                                        </div>

                                        <div className="space-y-8">
                                            {/* Image Input */}
                                            <div className="group">
                                                <label className="block text-sm font-bold mb-3 text-gray-700 dark:text-gray-300">
                                                    رابط صورة الخلفية
                                                </label>
                                                <div className="relative">
                                                    <input
                                                        type="text"
                                                        value={settings.heroImage}
                                                        onChange={(e) => setSettings({ ...settings, heroImage: e.target.value })}
                                                        className="w-full pl-4 pr-12 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-blue-500 focus:ring-0 transition-all outline-none text-left"
                                                        dir="ltr"
                                                        placeholder="https://..."
                                                    />
                                                    <div className="absolute top-1/2 right-4 -translate-y-1/2 text-gray-400">
                                                        <Globe size={20} />
                                                    </div>
                                                </div>

                                                {/* Image Preview */}
                                                <motion.div
                                                    initial={{ opacity: 0, height: 0 }}
                                                    animate={{ opacity: settings.heroImage ? 1 : 0, height: settings.heroImage ? 'auto' : 0 }}
                                                    className="mt-4 rounded-2xl overflow-hidden shadow-2xl relative aspect-video border-4 border-white dark:border-gray-700"
                                                >
                                                    {settings.heroImage && (
                                                        <>
                                                            <Image
                                                                src={settings.heroImage}
                                                                alt="Hero Preview"
                                                                fill
                                                                className="object-cover group-hover:scale-105 transition-transform duration-700"
                                                            />
                                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                                                <span className="bg-white/20 backdrop-blur-md text-white px-4 py-2 rounded-full text-sm font-bold border border-white/30">
                                                                    معاينة الصورة
                                                                </span>
                                                            </div>
                                                        </>
                                                    )}
                                                </motion.div>
                                            </div>

                                            {/* Titles */}
                                            <div className="grid md:grid-cols-2 gap-8">
                                                {[
                                                    { label: 'العنوان (العربية)', value: settings.heroTitleAr, key: 'heroTitleAr', dir: 'rtl', icon: <CheckCircle /> },
                                                    { label: 'العنوان (English)', value: settings.heroTitleEn, key: 'heroTitleEn', dir: 'ltr', icon: <Globe /> },
                                                    { label: 'الوصف (العربية)', value: settings.heroSubtitleAr, key: 'heroSubtitleAr', dir: 'rtl', isTextArea: true },
                                                    { label: 'الوصف (English)', value: settings.heroSubtitleEn, key: 'heroSubtitleEn', dir: 'ltr', isTextArea: true },
                                                ].map((field, i) => (
                                                    <div key={i} className="space-y-2">
                                                        <label className="flex items-center gap-2 text-sm font-bold text-gray-700 dark:text-gray-300">
                                                            {field.label}
                                                        </label>
                                                        {field.isTextArea ? (
                                                            <textarea
                                                                rows={3}
                                                                value={field.value}
                                                                onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                                                                className="w-full p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-blue-500 transition-all outline-none resize-none"
                                                                dir={field.dir}
                                                            />
                                                        ) : (
                                                            <div className="relative">
                                                                <input
                                                                    type="text"
                                                                    value={field.value}
                                                                    onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                                                                    className={`w-full py-4 px-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-blue-500 transition-all outline-none ${field.dir === 'ltr' ? 'text-left' : 'text-right'}`}
                                                                    dir={field.dir}
                                                                />
                                                            </div>
                                                        )}
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Categories Section */}
                                {activeTab === 'categories' && (
                                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-xl">
                                        <div className="flex items-center gap-3 mb-8 pb-4 border-b border-gray-100 dark:border-gray-700">
                                            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-xl text-green-600 dark:text-green-400">
                                                <Tag size={24} />
                                            </div>
                                            <div>
                                                <h2 className="text-xl font-black text-gray-900 dark:text-white">إعدادات قسم التصنيفات</h2>
                                                <p className="text-sm text-gray-500">تخصيص عناوين قسم تصنيفات الجولات</p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {[
                                                { label: 'عنوان القسم (العربية)', value: settings.categoriesTitleAr, key: 'categoriesTitleAr', dir: 'rtl' },
                                                { label: 'عنوان القسم (English)', value: settings.categoriesTitleEn, key: 'categoriesTitleEn', dir: 'ltr' },
                                                { label: 'الوصف الفرعي (العربية)', value: settings.categoriesSubtitleAr, key: 'categoriesSubtitleAr', dir: 'rtl' },
                                                { label: 'الوصف الفرعي (English)', value: settings.categoriesSubtitleEn, key: 'categoriesSubtitleEn', dir: 'ltr' },
                                            ].map((field, i) => (
                                                <div key={i} className="space-y-2">
                                                    <label className="text-sm font-bold text-gray-700 dark:text-gray-300">
                                                        {field.label}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        value={field.value}
                                                        onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
                                                        className={`w-full p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 focus:border-green-500 transition-all outline-none ${field.dir === 'ltr' ? 'text-left' : 'text-right'}`}
                                                        dir={field.dir}
                                                    />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Special Offers Section */}
                                {activeTab === 'offers' && (
                                    <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl border border-gray-200 dark:border-gray-700 p-8 shadow-xl">
                                        <div className="flex justify-between items-center mb-8 pb-4 border-b border-gray-100 dark:border-gray-700">
                                            <div className="flex items-center gap-3">
                                                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-xl text-purple-600 dark:text-purple-400">
                                                    <Percent size={24} />
                                                </div>
                                                <div>
                                                    <h2 className="text-xl font-black text-gray-900 dark:text-white">العروض المميزة</h2>
                                                    <p className="text-sm text-gray-500">إدارة بطاقات العروض التي تظهر في الصفحة</p>
                                                </div>
                                            </div>
                                            <motion.button
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                onClick={handleAddOffer}
                                                className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold shadow-lg hover:shadow-purple-500/25 transition-all"
                                            >
                                                <Plus size={18} />
                                                إضافة عرض جديد
                                            </motion.button>
                                        </div>

                                        <div className="grid grid-cols-1 gap-6">
                                            <AnimatePresence>
                                                {settings.specialOffers.map((offer, index) => (
                                                    <motion.div
                                                        key={index}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, scale: 0.95 }}
                                                        className="group relative bg-gray-50/50 dark:bg-gray-900/50 border-2 border-dashed border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 rounded-2xl p-6 transition-colors"
                                                    >
                                                        <motion.button
                                                            whileHover={{ scale: 1.1, rotate: 10 }}
                                                            whileTap={{ scale: 0.9 }}
                                                            onClick={() => handleRemoveOffer(index)}
                                                            className="absolute top-4 left-4 w-8 h-8 flex items-center justify-center bg-red-100 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                                                        >
                                                            <Trash2 size={16} />
                                                        </motion.button>

                                                        <div className="grid md:grid-cols-12 gap-6">
                                                            {/* Icon & Preview */}
                                                            <div className="md:col-span-2 flex flex-col items-center justify-center gap-2">
                                                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl bg-gradient-to-br shadow-inner ${offer.gradient}`}>
                                                                    {offer.icon}
                                                                </div>
                                                                <input
                                                                    type="text"
                                                                    value={offer.icon}
                                                                    onChange={(e) => handleOfferChange(index, 'icon', e.target.value)}
                                                                    className="w-16 text-center py-1 rounded-lg border bg-white dark:bg-gray-800 text-sm"
                                                                    placeholder="🎉"
                                                                />
                                                            </div>

                                                            {/* Content Feilds */}
                                                            <div className="md:col-span-10 grid md:grid-cols-2 gap-4">
                                                                <div className="space-y-4">
                                                                    <div dir="rtl">
                                                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">العنوان (AR)</label>
                                                                        <input
                                                                            type="text"
                                                                            value={offer.titleAr}
                                                                            onChange={(e) => handleOfferChange(index, 'titleAr', e.target.value)}
                                                                            className="w-full p-2.5 rounded-lg border bg-white dark:bg-gray-800 outline-none focus:ring-2 ring-purple-500/20 transition-all"
                                                                        />
                                                                    </div>
                                                                    <div dir="rtl">
                                                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1">الوصف (AR)</label>
                                                                        <input
                                                                            type="text"
                                                                            value={offer.descriptionAr}
                                                                            onChange={(e) => handleOfferChange(index, 'descriptionAr', e.target.value)}
                                                                            className="w-full p-2.5 rounded-lg border bg-white dark:bg-gray-800 outline-none focus:ring-2 ring-purple-500/20 transition-all"
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className="space-y-4">
                                                                    <div>
                                                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1 text-left">Title (EN)</label>
                                                                        <input
                                                                            type="text"
                                                                            value={offer.titleEn}
                                                                            onChange={(e) => handleOfferChange(index, 'titleEn', e.target.value)}
                                                                            className="w-full p-2.5 rounded-lg border bg-white dark:bg-gray-800 outline-none focus:ring-2 ring-purple-500/20 transition-all text-left"
                                                                            dir="ltr"
                                                                        />
                                                                    </div>
                                                                    <div>
                                                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1 text-left">Description (EN)</label>
                                                                        <input
                                                                            type="text"
                                                                            value={offer.descriptionEn}
                                                                            onChange={(e) => handleOfferChange(index, 'descriptionEn', e.target.value)}
                                                                            className="w-full p-2.5 rounded-lg border bg-white dark:bg-gray-800 outline-none focus:ring-2 ring-purple-500/20 transition-all text-left"
                                                                            dir="ltr"
                                                                        />
                                                                    </div>
                                                                </div>

                                                                <div className="md:col-span-2 grid grid-cols-2 gap-4">
                                                                    <div>
                                                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1 text-left">Discount Label</label>
                                                                        <div className="relative">
                                                                            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                                                            <input
                                                                                type="text"
                                                                                value={offer.discount}
                                                                                onChange={(e) => handleOfferChange(index, 'discount', e.target.value)}
                                                                                className="w-full pl-9 pr-3 py-2.5 rounded-lg border bg-white dark:bg-gray-800 outline-none focus:ring-2 ring-purple-500/20 transition-all text-left"
                                                                                dir="ltr"
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                    <div>
                                                                        <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-1 text-left">Color Theme</label>
                                                                        <select
                                                                            value={offer.gradient}
                                                                            onChange={(e) => handleOfferChange(index, 'gradient', e.target.value)}
                                                                            className="w-full p-2.5 rounded-lg border bg-white dark:bg-gray-800 outline-none focus:ring-2 ring-purple-500/20 transition-all"
                                                                            dir="ltr"
                                                                        >
                                                                            <option value="from-green-500 to-emerald-600">Green Nature</option>
                                                                            <option value="from-blue-500 to-indigo-600">Ocean Blue</option>
                                                                            <option value="from-purple-500 to-pink-600">Royal Purple</option>
                                                                            <option value="from-orange-500 to-red-600">Sunset Orange</option>
                                                                        </select>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </AnimatePresence>

                                            {settings.specialOffers.length === 0 && (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700"
                                                >
                                                    <div className="mb-4 inline-flex p-4 rounded-full bg-gray-100 dark:bg-gray-800">
                                                        <Percent className="w-8 h-8 text-gray-400" />
                                                    </div>
                                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">لا توجد عروض حالياً</h3>
                                                    <p className="text-gray-500 mb-6">أضف عروضاً مميزة لجذب المزيد من الزوار</p>
                                                    <button onClick={handleAddOffer} className="text-purple-600 font-bold hover:underline">
                                                        + إضافة العرض الأول
                                                    </button>
                                                </motion.div>
                                            )}
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
