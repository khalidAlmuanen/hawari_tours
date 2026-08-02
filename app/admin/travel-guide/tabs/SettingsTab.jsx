'use client'

import { useState, useEffect } from 'react'
import { useApp } from '@/contexts/AppContext'
import { motion } from 'framer-motion'
import Image from 'next/image'

export default function SettingsTab() {
    const { locale } = useApp()
    const isAr = locale === 'ar'

    const [loading, setLoading] = useState(true)
    const [formData, setFormData] = useState({
        heroImage: '',
        heroTitleEn: 'Travel Guide',
        heroTitleAr: 'دليل السفر',
        heroSubtitleEn: 'Everything you need to know before you go',
        heroSubtitleAr: 'كل ما تحتاج معرفته قبل السفر',
        accommodationTitleEn: '',
        accommodationTitleAr: '',
        accommodationSubtitleEn: '',
        accommodationSubtitleAr: '',
        packingTitleEn: '',
        packingTitleAr: '',
        packingSubtitleEn: '',
        packingSubtitleAr: '',
        safetyTitleEn: '',
        safetyTitleAr: '',
        safetySubtitleEn: '',
        safetySubtitleAr: '',
        safetyHeadlineEn: '',
        safetyHeadlineAr: '',
        safetyHighlightEn: '',
        safetyHighlightAr: '',
        ctaTitleEn: '',
        ctaTitleAr: '',
        ctaSubtitleEn: '',
        ctaSubtitleAr: '',
        ctaPrimaryLabelEn: '',
        ctaPrimaryLabelAr: '',
        ctaPrimaryUrl: '',
        ctaSecondaryLabelEn: '',
        ctaSecondaryLabelAr: '',
        ctaSecondaryUrl: '',
        ctaWhatsappLabelEn: '',
        ctaWhatsappLabelAr: '',
        ctaWhatsappUrl: ''
    })

    // Image Gallery State for selection (reuse if possible, or simple input for now)
    const [showGallery, setShowGallery] = useState(false)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/admin/travel-guide?section=settings')
            const result = await response.json()
            if (result.success && result.data && Object.keys(result.data).length > 0) {
                setFormData(prev => ({ ...prev, ...result.data }))
            }
        } catch (error) {
            console.error('Error fetching settings:', error)
        } finally {
            setLoading(false)
        }
    }

    const save = async (e) => {
        e.preventDefault()
        try {
            const response = await fetch('/api/admin/travel-guide', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    section: 'settings',
                    data: formData
                })
            })

            const result = await response.json()
            if (result.success) {
                alert(isAr ? 'تم حفظ الإعدادات!' : 'Settings saved!')
                // Update local state just in case
                setFormData(prev => ({ ...prev, ...result.data }))
            } else {
                alert(isAr ? 'فشل الحفظ' : 'Failed to save')
            }
        } catch (error) {
            console.error('Error saving:', error)
        }
    }

    if (loading) return <div className="text-center py-20">Loading...</div>

    return (
        <div className="max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-gradient-to-r from-gray-700 to-gray-900 p-6 text-white">
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                        <span className="text-3xl">⚙️</span>
                        {isAr ? 'إعدادات الصفحة' : 'Page Settings'}
                    </h2>
                    <p className="text-white/70 mt-1">
                        {isAr ? 'تخصيص الصور والنصوص الرئيسية' : 'Customize main images and texts'}
                    </p>
                </div>

                <form onSubmit={save} className="p-8 space-y-8">

                    {/* Hero Section */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white border-b pb-2">
                            {isAr ? 'القسم الرئيسي (Hero)' : 'Hero Section'}
                        </h3>

                        {/* Image Preview */}
                        <div className="relative h-64 w-full bg-gray-100 dark:bg-gray-900 rounded-xl overflow-hidden border-2 border-dashed border-gray-300 dark:border-gray-700 flex items-center justify-center group">
                            {formData.heroImage ? (
                                <>
                                    <Image
                                        src={formData.heroImage}
                                        alt="Hero"
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <button type="button" onClick={() => setFormData({ ...formData, heroImage: '' })} className="bg-red-500 text-white px-4 py-2 rounded-lg">
                                            {isAr ? 'حذف الصورة' : 'Remove Image'}
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="text-gray-400 flex flex-col items-center">
                                    <span className="text-4xl mb-2">🖼️</span>
                                    <span>{isAr ? 'لا توجد صورة' : 'No Image Selected'}</span>
                                </div>
                            )}
                        </div>

                        {/* Image URL Input */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                {isAr ? 'رابط صورة الغلاف' : 'Cover Image URL'}
                            </label>
                            <input
                                type="text"
                                value={formData.heroImage}
                                onChange={(e) => setFormData({ ...formData, heroImage: e.target.value })}
                                className="input-field"
                                placeholder="https://..."
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                {isAr ? 'يمكنك استخدام رابط خارجي أو من المعرض' : 'You can use an external URL or from gallery'}
                            </p>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                    {isAr ? 'العنوان الرئيسي (English)' : 'Main Title (English)'}
                                </label>
                                <input
                                    type="text"
                                    value={formData.heroTitleEn}
                                    onChange={(e) => setFormData({ ...formData, heroTitleEn: e.target.value })}
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                    {isAr ? 'العنوان الرئيسي (عربي)' : 'Main Title (Arabic)'}
                                </label>
                                <input
                                    type="text"
                                    dir="rtl"
                                    value={formData.heroTitleAr}
                                    onChange={(e) => setFormData({ ...formData, heroTitleAr: e.target.value })}
                                    className="input-field text-right"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                    {isAr ? 'العنوان الفرعي (English)' : 'Subtitle (English)'}
                                </label>
                                <input
                                    type="text"
                                    value={formData.heroSubtitleEn}
                                    onChange={(e) => setFormData({ ...formData, heroSubtitleEn: e.target.value })}
                                    className="input-field"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                                    {isAr ? 'العنوان الفرعي (عربي)' : 'Subtitle (Arabic)'}
                                </label>
                                <input
                                    type="text"
                                    dir="rtl"
                                    value={formData.heroSubtitleAr}
                                    onChange={(e) => setFormData({ ...formData, heroSubtitleAr: e.target.value })}
                                    className="input-field text-right"
                                />
                            </div>
                        </div>

                    </div>

                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white border-b pb-2">
                            {isAr ? 'عناوين الإقامة' : 'Accommodation Titles'}
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <input
                                type="text"
                                value={formData.accommodationTitleEn}
                                onChange={(e) => setFormData({ ...formData, accommodationTitleEn: e.target.value })}
                                className="input-field"
                                placeholder="Title (English)"
                            />
                            <input
                                type="text"
                                dir="rtl"
                                value={formData.accommodationTitleAr}
                                onChange={(e) => setFormData({ ...formData, accommodationTitleAr: e.target.value })}
                                className="input-field text-right"
                                placeholder="العنوان (عربي)"
                            />
                            <input
                                type="text"
                                value={formData.accommodationSubtitleEn}
                                onChange={(e) => setFormData({ ...formData, accommodationSubtitleEn: e.target.value })}
                                className="input-field"
                                placeholder="Subtitle (English)"
                            />
                            <input
                                type="text"
                                dir="rtl"
                                value={formData.accommodationSubtitleAr}
                                onChange={(e) => setFormData({ ...formData, accommodationSubtitleAr: e.target.value })}
                                className="input-field text-right"
                                placeholder="العنوان الفرعي (عربي)"
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white border-b pb-2">
                            {isAr ? 'عناوين الأمتعة' : 'Packing Titles'}
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <input
                                type="text"
                                value={formData.packingTitleEn}
                                onChange={(e) => setFormData({ ...formData, packingTitleEn: e.target.value })}
                                className="input-field"
                                placeholder="Title (English)"
                            />
                            <input
                                type="text"
                                dir="rtl"
                                value={formData.packingTitleAr}
                                onChange={(e) => setFormData({ ...formData, packingTitleAr: e.target.value })}
                                className="input-field text-right"
                                placeholder="العنوان (عربي)"
                            />
                            <input
                                type="text"
                                value={formData.packingSubtitleEn}
                                onChange={(e) => setFormData({ ...formData, packingSubtitleEn: e.target.value })}
                                className="input-field"
                                placeholder="Subtitle (English)"
                            />
                            <input
                                type="text"
                                dir="rtl"
                                value={formData.packingSubtitleAr}
                                onChange={(e) => setFormData({ ...formData, packingSubtitleAr: e.target.value })}
                                className="input-field text-right"
                                placeholder="العنوان الفرعي (عربي)"
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white border-b pb-2">
                            {isAr ? 'عناوين السلامة' : 'Safety Titles'}
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <input
                                type="text"
                                value={formData.safetyTitleEn}
                                onChange={(e) => setFormData({ ...formData, safetyTitleEn: e.target.value })}
                                className="input-field"
                                placeholder="Badge Title (English)"
                            />
                            <input
                                type="text"
                                dir="rtl"
                                value={formData.safetyTitleAr}
                                onChange={(e) => setFormData({ ...formData, safetyTitleAr: e.target.value })}
                                className="input-field text-right"
                                placeholder="عنوان الشارة (عربي)"
                            />
                            <input
                                type="text"
                                value={formData.safetySubtitleEn}
                                onChange={(e) => setFormData({ ...formData, safetySubtitleEn: e.target.value })}
                                className="input-field"
                                placeholder="Subtitle (English)"
                            />
                            <input
                                type="text"
                                dir="rtl"
                                value={formData.safetySubtitleAr}
                                onChange={(e) => setFormData({ ...formData, safetySubtitleAr: e.target.value })}
                                className="input-field text-right"
                                placeholder="العنوان الفرعي (عربي)"
                            />
                            <input
                                type="text"
                                value={formData.safetyHeadlineEn}
                                onChange={(e) => setFormData({ ...formData, safetyHeadlineEn: e.target.value })}
                                className="input-field"
                                placeholder="Headline (English)"
                            />
                            <input
                                type="text"
                                dir="rtl"
                                value={formData.safetyHeadlineAr}
                                onChange={(e) => setFormData({ ...formData, safetyHeadlineAr: e.target.value })}
                                className="input-field text-right"
                                placeholder="العنوان الرئيسي (عربي)"
                            />
                            <input
                                type="text"
                                value={formData.safetyHighlightEn}
                                onChange={(e) => setFormData({ ...formData, safetyHighlightEn: e.target.value })}
                                className="input-field"
                                placeholder="Headline Highlight (English)"
                            />
                            <input
                                type="text"
                                dir="rtl"
                                value={formData.safetyHighlightAr}
                                onChange={(e) => setFormData({ ...formData, safetyHighlightAr: e.target.value })}
                                className="input-field text-right"
                                placeholder="تمييز العنوان (عربي)"
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white border-b pb-2">
                            {isAr ? 'زر الدعوة للإجراء' : 'CTA'}
                        </h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <input
                                type="text"
                                value={formData.ctaTitleEn}
                                onChange={(e) => setFormData({ ...formData, ctaTitleEn: e.target.value })}
                                className="input-field"
                                placeholder="CTA Title (English)"
                            />
                            <input
                                type="text"
                                dir="rtl"
                                value={formData.ctaTitleAr}
                                onChange={(e) => setFormData({ ...formData, ctaTitleAr: e.target.value })}
                                className="input-field text-right"
                                placeholder="عنوان الدعوة (عربي)"
                            />
                            <input
                                type="text"
                                value={formData.ctaSubtitleEn}
                                onChange={(e) => setFormData({ ...formData, ctaSubtitleEn: e.target.value })}
                                className="input-field"
                                placeholder="CTA Subtitle (English)"
                            />
                            <input
                                type="text"
                                dir="rtl"
                                value={formData.ctaSubtitleAr}
                                onChange={(e) => setFormData({ ...formData, ctaSubtitleAr: e.target.value })}
                                className="input-field text-right"
                                placeholder="الوصف (عربي)"
                            />
                            <input
                                type="text"
                                value={formData.ctaPrimaryLabelEn}
                                onChange={(e) => setFormData({ ...formData, ctaPrimaryLabelEn: e.target.value })}
                                className="input-field"
                                placeholder="Primary Button (English)"
                            />
                            <input
                                type="text"
                                dir="rtl"
                                value={formData.ctaPrimaryLabelAr}
                                onChange={(e) => setFormData({ ...formData, ctaPrimaryLabelAr: e.target.value })}
                                className="input-field text-right"
                                placeholder="زر أساسي (عربي)"
                            />
                            <input
                                type="text"
                                value={formData.ctaPrimaryUrl}
                                onChange={(e) => setFormData({ ...formData, ctaPrimaryUrl: e.target.value })}
                                className="input-field"
                                placeholder="Primary URL"
                            />
                            <input
                                type="text"
                                value={formData.ctaSecondaryLabelEn}
                                onChange={(e) => setFormData({ ...formData, ctaSecondaryLabelEn: e.target.value })}
                                className="input-field"
                                placeholder="Secondary Button (English)"
                            />
                            <input
                                type="text"
                                dir="rtl"
                                value={formData.ctaSecondaryLabelAr}
                                onChange={(e) => setFormData({ ...formData, ctaSecondaryLabelAr: e.target.value })}
                                className="input-field text-right"
                                placeholder="زر ثانوي (عربي)"
                            />
                            <input
                                type="text"
                                value={formData.ctaSecondaryUrl}
                                onChange={(e) => setFormData({ ...formData, ctaSecondaryUrl: e.target.value })}
                                className="input-field"
                                placeholder="Secondary URL"
                            />
                            <input
                                type="text"
                                value={formData.ctaWhatsappLabelEn}
                                onChange={(e) => setFormData({ ...formData, ctaWhatsappLabelEn: e.target.value })}
                                className="input-field"
                                placeholder="WhatsApp Button (English)"
                            />
                            <input
                                type="text"
                                dir="rtl"
                                value={formData.ctaWhatsappLabelAr}
                                onChange={(e) => setFormData({ ...formData, ctaWhatsappLabelAr: e.target.value })}
                                className="input-field text-right"
                                placeholder="زر واتساب (عربي)"
                            />
                            <input
                                type="text"
                                value={formData.ctaWhatsappUrl}
                                onChange={(e) => setFormData({ ...formData, ctaWhatsappUrl: e.target.value })}
                                className="input-field"
                                placeholder="WhatsApp URL"
                            />
                        </div>
                    </div>

                    {/* Actions */}
                    <div className="pt-6 border-t dark:border-gray-700 flex justify-end">
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            className="px-8 py-4 bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-xl font-bold shadow-lg text-lg flex items-center gap-2"
                        >
                            <span>💾</span>
                            {isAr ? 'حفظ التغييرات' : 'Save Changes'}
                        </motion.button>
                    </div>

                </form>
            </div>

            <style jsx>{`
        .input-field {
            width: 100%;
            padding: 0.75rem 1rem;
            border-radius: 0.75rem;
            border: 1px solid #e5e7eb;
            background-color: white;
            color: #1f2937;
            transition: all 0.2s;
        }
        .input-field:focus {
            outline: none;
            border-color: #3b82f6;
            box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        :global(.dark) .input-field {
            background-color: #1f2937;
            border-color: #374151;
            color: white;
        }
        :global(.dark) .input-field:focus {
            border-color: #60a5fa;
            box-shadow: 0 0 0 3px rgba(96, 165, 250, 0.1);
        }
      `}</style>
        </div>
    )
}
