'use client'

// ═══════════════════════════════════════════════════════════════
// 📞 CONTACT SETTINGS MANAGEMENT - Ultra Professional & Modern
// إدارة معلومات التواصل - تصميم احترافي وعصري جداً
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback, useMemo } from 'react'
import { useApp } from '@/contexts/AppContext'
import AdminLayout from '@/components/admin/AdminLayout'
import { useToast } from '@/components/admin/Toast'
import { motion } from 'framer-motion'

export default function ContactManagement() {
    const { locale } = useApp()
    const { success, error: showError } = useToast()
    const isAr = locale === 'ar'

    // State
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [activeTab, setActiveTab] = useState('company')
    const [settings, setSettings] = useState(null)
    const [originalSettings, setOriginalSettings] = useState(null)

    // Tabs
    const tabs = [
        { id: 'company', icon: '🏢', labelEn: 'Company Info', labelAr: 'معلومات الشركة' },
        { id: 'contact', icon: '📞', labelEn: 'Contact Details', labelAr: 'بيانات التواصل' },
        { id: 'hours', icon: '⏰', labelEn: 'Working Hours', labelAr: 'ساعات العمل' },
        { id: 'social', icon: '🌐', labelEn: 'Social Media', labelAr: 'وسائل التواصل' }
    ]

    // Social media platforms
    const socialPlatforms = [
        { key: 'facebook', icon: '📘', name: 'Facebook', color: 'from-blue-500 to-blue-600' },
        { key: 'instagram', icon: '📸', name: 'Instagram', color: 'from-pink-500 to-purple-600' },
        { key: 'twitter', icon: '🐦', name: 'Twitter / X', color: 'from-blue-400 to-blue-500' },
        { key: 'youtube', icon: '▶️', name: 'YouTube', color: 'from-red-500 to-red-600' },
        { key: 'tiktok', icon: '🎵', name: 'TikTok', color: 'from-gray-800 to-gray-900' },
        { key: 'linkedin', icon: '💼', name: 'LinkedIn', color: 'from-blue-600 to-blue-700' }
    ]

    // ═══════════════════════════════════════════════════════════════
    // Fetch Settings
    // ═══════════════════════════════════════════════════════════════
    const fetchSettings = useCallback(async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/admin/contact')
            const result = await response.json()

            if (result.success) {
                setSettings(result.data)
                setOriginalSettings(result.data)
            } else {
                showError(isAr ? 'فشل جلب بيانات التواصل' : 'Failed to fetch contact settings')
            }
        } catch (error) {
            console.error('Error fetching settings:', error)
            showError(isAr ? 'خطأ في جلب بيانات التواصل' : 'Error fetching contact settings')
        } finally {
            setLoading(false)
        }
    }, [showError, isAr])

    useEffect(() => {
        fetchSettings()
    }, [fetchSettings])

    // ═══════════════════════════════════════════════════════════════
    // Save Settings
    // ═══════════════════════════════════════════════════════════════
    const handleSave = async () => {
        setSaving(true)

        try {
            const response = await fetch('/api/admin/contact', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            })

            const result = await response.json()

            if (result.success) {
                success(isAr ? 'تم تحديث بيانات التواصل بنجاح!' : 'Contact settings updated successfully!')
                setOriginalSettings(settings)
            } else {
                showError(result.error || (isAr ? 'فشل التحديث' : 'Update failed'))
            }
        } catch (error) {
            console.error('Error saving settings:', error)
            showError(isAr ? 'خطأ في حفظ بيانات التواصل' : 'Error saving contact settings')
        } finally {
            setSaving(false)
        }
    }

    const handleReset = () => {
        if (!originalSettings) return
        setSettings(originalSettings)
    }

    const isDirty = useMemo(() => {
        if (!settings || !originalSettings) return false
        return JSON.stringify(settings) !== JSON.stringify(originalSettings)
    }, [settings, originalSettings])

    // ═══════════════════════════════════════════════════════════════
    // Add/Remove Address
    // ═══════════════════════════════════════════════════════════════
    const addAddress = () => {
        const newAddress = {
            id: Date.now().toString(),
            titleEn: '',
            titleAr: '',
            addressEn: '',
            addressAr: '',
            lat: '',
            lng: '',
            mapUrl: ''
        }
        setSettings({
            ...settings,
            contact: {
                ...settings.contact,
                addresses: [...settings.contact.addresses, newAddress]
            }
        })
    }

    const removeAddress = (id) => {
        setSettings({
            ...settings,
            contact: {
                ...settings.contact,
                addresses: settings.contact.addresses.filter(addr => addr.id !== id)
            }
        })
    }

    if (loading) {
        return (
            <AdminLayout title={isAr ? 'إدارة معلومات التواصل' : 'Contact Settings'}>
                <div className="text-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">{isAr ? 'جاري التحميل...' : 'Loading...'}</p>
                </div>
            </AdminLayout>
        )
    }

    if (!settings) return null

    return (
        <AdminLayout title={isAr ? 'إدارة معلومات التواصل' : 'Contact Settings'}>
            {/* Tabs */}
            <div className="mb-8">
                <div className="flex flex-wrap gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-6 py-3 font-semibold transition-all ${activeTab === tab.id
                                    ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400'
                                    : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                }`}
                        >
                            <span className="mr-2">{tab.icon}</span>
                            {isAr ? tab.labelAr : tab.labelEn}
                        </button>
                    ))}
                </div>

                {/* Save Button (Always Visible) */}
                <div className="sticky top-4 z-20 flex flex-wrap gap-3 justify-end mb-6">
                    <button
                        onClick={fetchSettings}
                        disabled={loading || saving}
                        className="btn btn-outline px-6 py-3 text-lg font-bold shadow-lg disabled:opacity-50"
                    >
                        {isAr ? 'تحديث البيانات' : 'Refresh Data'}
                    </button>
                    <button
                        onClick={handleReset}
                        disabled={!isDirty || saving}
                        className="btn btn-outline px-6 py-3 text-lg font-bold shadow-lg disabled:opacity-50"
                    >
                        {isAr ? 'تراجع عن التغييرات' : 'Discard Changes'}
                    </button>
                    <button
                        onClick={handleSave}
                        disabled={saving || !isDirty}
                        className="btn btn-primary px-8 py-3 text-lg font-bold shadow-lg disabled:opacity-50"
                    >
                        {saving ? (isAr ? 'جاري الحفظ...' : 'Saving...') : (isAr ? '💾 حفظ جميع التغييرات' : '💾 Save All Changes')}
                    </button>
                </div>
            </div>

            {/* Tab Content */}
            <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                {/* ═══════════════════════════════════════════════════════════════ */}
                {/* Company Info Tab */}
                {/* ═══════════════════════════════════════════════════════════════ */}
                {activeTab === 'company' && (
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                🏢 {isAr ? 'معلومات الشركة' : 'Company Information'}
                            </h3>

                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        {isAr ? 'اسم الشركة (EN)' : 'Company Name (EN)'}
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.company.nameEn}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            company: { ...settings.company, nameEn: e.target.value }
                                        })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        {isAr ? 'اسم الشركة (AR)' : 'Company Name (AR)'}
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.company.nameAr}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            company: { ...settings.company, nameAr: e.target.value }
                                        })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-right"
                                        dir="rtl"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        {isAr ? 'عنوان الهيرو (EN)' : 'Hero Title (EN)'}
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.company.heroTitleEn || ''}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            company: { ...settings.company, heroTitleEn: e.target.value }
                                        })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        {isAr ? 'عنوان الهيرو (AR)' : 'Hero Title (AR)'}
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.company.heroTitleAr || ''}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            company: { ...settings.company, heroTitleAr: e.target.value }
                                        })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-right"
                                        dir="rtl"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        {isAr ? 'نص الهيرو (EN)' : 'Hero Text (EN)'}
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={settings.company.heroSubtitleEn || ''}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            company: { ...settings.company, heroSubtitleEn: e.target.value }
                                        })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        {isAr ? 'نص الهيرو (AR)' : 'Hero Text (AR)'}
                                    </label>
                                    <textarea
                                        rows={2}
                                        value={settings.company.heroSubtitleAr || ''}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            company: { ...settings.company, heroSubtitleAr: e.target.value }
                                        })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-right"
                                        dir="rtl"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        {isAr ? 'الوصف (EN)' : 'Description (EN)'}
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={settings.company.descriptionEn}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            company: { ...settings.company, descriptionEn: e.target.value }
                                        })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        {isAr ? 'الوصف (AR)' : 'Description (AR)'}
                                    </label>
                                    <textarea
                                        rows={3}
                                        value={settings.company.descriptionAr}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            company: { ...settings.company, descriptionAr: e.target.value }
                                        })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-right"
                                        dir="rtl"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        {isAr ? 'رابط الشعار' : 'Logo URL'}
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.company.logo}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            company: { ...settings.company, logo: e.target.value }
                                        })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ═══════════════════════════════════════════════════════════════ */}
                {/* Contact Details Tab */}
                {/* ═══════════════════════════════════════════════════════════════ */}
                {activeTab === 'contact' && (
                    <div className="space-y-6">
                        {/* Email Addresses */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                📧 {isAr ? 'عناوين البريد الإلكتروني' : 'Email Addresses'}
                            </h3>

                            <div className="grid md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        {isAr ? 'البريد العام' : 'Info Email'}
                                    </label>
                                    <input
                                        type="email"
                                        value={settings.contact.emails.info}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            contact: {
                                                ...settings.contact,
                                                emails: { ...settings.contact.emails, info: e.target.value }
                                            }
                                        })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        {isAr ? 'بريد الدعم' : 'Support Email'}
                                    </label>
                                    <input
                                        type="email"
                                        value={settings.contact.emails.support}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            contact: {
                                                ...settings.contact,
                                                emails: { ...settings.contact.emails, support: e.target.value }
                                            }
                                        })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        {isAr ? 'بريد الحجوزات' : 'Booking Email'}
                                    </label>
                                    <input
                                        type="email"
                                        value={settings.contact.emails.booking}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            contact: {
                                                ...settings.contact,
                                                emails: { ...settings.contact.emails, booking: e.target.value }
                                            }
                                        })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Phone Numbers */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                📞 {isAr ? 'أرقام الهاتف' : 'Phone Numbers'}
                            </h3>

                            <div className="grid md:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        {isAr ? 'الهاتف الرئيسي' : 'Primary Phone'}
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.contact.phones.primary}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            contact: {
                                                ...settings.contact,
                                                phones: { ...settings.contact.phones, primary: e.target.value }
                                            }
                                        })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        {isAr ? 'الهاتف الثانوي' : 'Secondary Phone'}
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.contact.phones.secondary}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            contact: {
                                                ...settings.contact,
                                                phones: { ...settings.contact.phones, secondary: e.target.value }
                                            }
                                        })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        {isAr ? 'واتساب' : 'WhatsApp'}
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.contact.phones.whatsapp}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            contact: {
                                                ...settings.contact,
                                                phones: { ...settings.contact.phones, whatsapp: e.target.value }
                                            }
                                        })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Addresses */}
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                                    📍 {isAr ? 'العناوين' : 'Addresses'}
                                </h3>
                                <button
                                    onClick={addAddress}
                                    className="btn btn-primary px-4 py-2 text-sm"
                                >
                                    <svg className="w-4 h-4 inline-block mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                    </svg>
                                    {isAr ? 'إضافة عنوان' : 'Add Address'}
                                </button>
                            </div>

                            <div className="space-y-4">
                                {settings.contact.addresses.map((address, index) => (
                                    <div key={address.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                        <div className="flex items-center justify-between mb-3">
                                            <h4 className="font-semibold text-gray-900 dark:text-white">
                                                {isAr ? 'عنوان' : 'Address'} {index + 1}
                                            </h4>
                                            {settings.contact.addresses.length > 1 && (
                                                <button
                                                    onClick={() => removeAddress(address.id)}
                                                    className="text-red-500 hover:text-red-700 text-sm font-semibold"
                                                >
                                                    {isAr ? 'حذف' : 'Remove'}
                                                </button>
                                            )}
                                        </div>

                                        <div className="grid md:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                    {isAr ? 'العنوان (EN)' : 'Title (EN)'}
                                                </label>
                                                <input
                                                    type="text"
                                                    value={address.titleEn}
                                                    onChange={(e) => {
                                                        const updated = [...settings.contact.addresses]
                                                        updated[index].titleEn = e.target.value
                                                        setSettings({
                                                            ...settings,
                                                            contact: { ...settings.contact, addresses: updated }
                                                        })
                                                    }}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                    {isAr ? 'العنوان (AR)' : 'Title (AR)'}
                                                </label>
                                                <input
                                                    type="text"
                                                    value={address.titleAr}
                                                    onChange={(e) => {
                                                        const updated = [...settings.contact.addresses]
                                                        updated[index].titleAr = e.target.value
                                                        setSettings({
                                                            ...settings,
                                                            contact: { ...settings.contact, addresses: updated }
                                                        })
                                                    }}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-right"
                                                    dir="rtl"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                    {isAr ? 'العنوان التفصيلي (EN)' : 'Full Address (EN)'}
                                                </label>
                                                <input
                                                    type="text"
                                                    value={address.addressEn}
                                                    onChange={(e) => {
                                                        const updated = [...settings.contact.addresses]
                                                        updated[index].addressEn = e.target.value
                                                        setSettings({
                                                            ...settings,
                                                            contact: { ...settings.contact, addresses: updated }
                                                        })
                                                    }}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                    {isAr ? 'العنوان التفصيلي (AR)' : 'Full Address (AR)'}
                                                </label>
                                                <input
                                                    type="text"
                                                    value={address.addressAr}
                                                    onChange={(e) => {
                                                        const updated = [...settings.contact.addresses]
                                                        updated[index].addressAr = e.target.value
                                                        setSettings({
                                                            ...settings,
                                                            contact: { ...settings.contact, addresses: updated }
                                                        })
                                                    }}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-right"
                                                    dir="rtl"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                    {isAr ? 'خط العرض' : 'Latitude'}
                                                </label>
                                                <input
                                                    type="text"
                                                    value={address.lat}
                                                    onChange={(e) => {
                                                        const updated = [...settings.contact.addresses]
                                                        updated[index].lat = e.target.value
                                                        setSettings({
                                                            ...settings,
                                                            contact: { ...settings.contact, addresses: updated }
                                                        })
                                                    }}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                    placeholder="15.3694"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                    {isAr ? 'خط الطول' : 'Longitude'}
                                                </label>
                                            <input
                                                type="text"
                                                value={address.lng}
                                                    onChange={(e) => {
                                                        const updated = [...settings.contact.addresses]
                                                        updated[index].lng = e.target.value
                                                        setSettings({
                                                            ...settings,
                                                            contact: { ...settings.contact, addresses: updated }
                                                        })
                                                    }}
                                                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                    placeholder="44.1910"
                                                />
                                            </div>
                                        <div className="md:col-span-2">
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                {isAr ? 'رابط الخريطة' : 'Map URL'}
                                            </label>
                                            <input
                                                type="text"
                                                value={address.mapUrl || ''}
                                                onChange={(e) => {
                                                    const updated = [...settings.contact.addresses]
                                                    updated[index].mapUrl = e.target.value
                                                    setSettings({
                                                        ...settings,
                                                        contact: { ...settings.contact, addresses: updated }
                                                    })
                                                }}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                                placeholder="https://maps.google.com/..."
                                            />
                                        </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ═══════════════════════════════════════════════════════════════ */}
                {/* Working Hours Tab */}
                {/* ═══════════════════════════════════════════════════════════════ */}
                {activeTab === 'hours' && (
                    <div className="space-y-6">
                        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                ⏰ {isAr ? 'ساعات العمل' : 'Working Hours'}
                            </h3>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Weekdays */}
                                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                                        {isAr ? 'أيام العمل' : 'Weekdays'}
                                    </h4>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                {isAr ? 'الأيام (EN)' : 'Days (EN)'}
                                            </label>
                                            <input
                                                type="text"
                                                value={settings.workingHours.weekdays.daysEn ?? settings.workingHours.weekdays.days ?? ''}
                                                onChange={(e) => setSettings({
                                                    ...settings,
                                                    workingHours: {
                                                        ...settings.workingHours,
                                                        weekdays: { ...settings.workingHours.weekdays, daysEn: e.target.value }
                                                    }
                                                })}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                {isAr ? 'الأيام (AR)' : 'Days (AR)'}
                                            </label>
                                            <input
                                                type="text"
                                                value={settings.workingHours.weekdays.daysAr ?? ''}
                                                onChange={(e) => setSettings({
                                                    ...settings,
                                                    workingHours: {
                                                        ...settings.workingHours,
                                                        weekdays: { ...settings.workingHours.weekdays, daysAr: e.target.value }
                                                    }
                                                })}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-right"
                                                dir="rtl"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                {isAr ? 'الساعات (EN)' : 'Hours (EN)'}
                                            </label>
                                            <input
                                                type="text"
                                                value={settings.workingHours.weekdays.openEn}
                                                onChange={(e) => setSettings({
                                                    ...settings,
                                                    workingHours: {
                                                        ...settings.workingHours,
                                                        weekdays: { ...settings.workingHours.weekdays, openEn: e.target.value }
                                                    }
                                                })}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                {isAr ? 'الساعات (AR)' : 'Hours (AR)'}
                                            </label>
                                            <input
                                                type="text"
                                                value={settings.workingHours.weekdays.openAr}
                                                onChange={(e) => setSettings({
                                                    ...settings,
                                                    workingHours: {
                                                        ...settings.workingHours,
                                                        weekdays: { ...settings.workingHours.weekdays, openAr: e.target.value }
                                                    }
                                                })}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-right"
                                                dir="rtl"
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* Weekend */}
                                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                                        {isAr ? 'عطلة نهاية الأسبوع' : 'Weekend'}
                                    </h4>
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                {isAr ? 'الأيام (EN)' : 'Days (EN)'}
                                            </label>
                                            <input
                                                type="text"
                                                value={settings.workingHours.weekend.daysEn ?? settings.workingHours.weekend.days ?? ''}
                                                onChange={(e) => setSettings({
                                                    ...settings,
                                                    workingHours: {
                                                        ...settings.workingHours,
                                                        weekend: { ...settings.workingHours.weekend, daysEn: e.target.value }
                                                    }
                                                })}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                {isAr ? 'الأيام (AR)' : 'Days (AR)'}
                                            </label>
                                            <input
                                                type="text"
                                                value={settings.workingHours.weekend.daysAr ?? ''}
                                                onChange={(e) => setSettings({
                                                    ...settings,
                                                    workingHours: {
                                                        ...settings.workingHours,
                                                        weekend: { ...settings.workingHours.weekend, daysAr: e.target.value }
                                                    }
                                                })}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-right"
                                                dir="rtl"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                {isAr ? 'الساعات (EN)' : 'Hours (EN)'}
                                            </label>
                                            <input
                                                type="text"
                                                value={settings.workingHours.weekend.openEn}
                                                onChange={(e) => setSettings({
                                                    ...settings,
                                                    workingHours: {
                                                        ...settings.workingHours,
                                                        weekend: { ...settings.workingHours.weekend, openEn: e.target.value }
                                                    }
                                                })}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                                {isAr ? 'الساعات (AR)' : 'Hours (AR)'}
                                            </label>
                                            <input
                                                type="text"
                                                value={settings.workingHours.weekend.openAr}
                                                onChange={(e) => setSettings({
                                                    ...settings,
                                                    workingHours: {
                                                        ...settings.workingHours,
                                                        weekend: { ...settings.workingHours.weekend, openAr: e.target.value }
                                                    }
                                                })}
                                                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-right"
                                                dir="rtl"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-4 grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        {isAr ? 'أيام الإغلاق (EN)' : 'Closed Days (EN)'}
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.workingHours.closedEn ?? settings.workingHours.closed ?? ''}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            workingHours: { ...settings.workingHours, closedEn: e.target.value }
                                        })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        {isAr ? 'أيام الإغلاق (AR)' : 'Closed Days (AR)'}
                                    </label>
                                    <input
                                        type="text"
                                        value={settings.workingHours.closedAr ?? ''}
                                        onChange={(e) => setSettings({
                                            ...settings,
                                            workingHours: { ...settings.workingHours, closedAr: e.target.value }
                                        })}
                                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-right"
                                        dir="rtl"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* ═══════════════════════════════════════════════════════════════ */}
                {/* Social Media Tab */}
                {/* ═══════════════════════════════════════════════════════════════ */}
                {activeTab === 'social' && (
                    <div className="grid md:grid-cols-2 gap-6">
                        {socialPlatforms.map(platform => (
                            <motion.div
                                key={platform.key}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border-l-4 border-transparent"
                                style={{ borderLeftColor: settings.socialMedia[platform.key].active ? '#22c55e' : '#ef4444' }}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className={`text-xl font-bold bg-gradient-to-r ${platform.color} bg-clip-text text-transparent flex items-center gap-2`}>
                                        <span>{platform.icon}</span>
                                        {platform.name}
                                    </h3>
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={settings.socialMedia[platform.key].active}
                                            onChange={(e) => setSettings({
                                                ...settings,
                                                socialMedia: {
                                                    ...settings.socialMedia,
                                                    [platform.key]: { ...settings.socialMedia[platform.key], active: e.target.checked }
                                                }
                                            })}
                                            className="w-5 h-5 text-green-600 rounded"
                                        />
                                        <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                            {settings.socialMedia[platform.key].active ? (isAr ? 'نشط' : 'Active') : (isAr ? 'غير نشط' : 'Inactive')}
                                        </span>
                                    </label>
                                </div>

                                <div className="space-y-3">
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            {isAr ? 'رابط الحساب' : 'Profile URL'}
                                        </label>
                                        <input
                                            type="text"
                                            value={settings.socialMedia[platform.key].url}
                                            onChange={(e) => setSettings({
                                                ...settings,
                                                socialMedia: {
                                                    ...settings.socialMedia,
                                                    [platform.key]: { ...settings.socialMedia[platform.key], url: e.target.value }
                                                }
                                            })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            placeholder={`https://${platform.key}.com/...`}
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            {isAr ? 'عدد المتابعين' : 'Followers Count'}
                                        </label>
                                        <input
                                            type="number"
                                            value={settings.socialMedia[platform.key].followers}
                                            onChange={(e) => setSettings({
                                                ...settings,
                                                socialMedia: {
                                                    ...settings.socialMedia,
                                                    [platform.key]: { ...settings.socialMedia[platform.key], followers: parseInt(e.target.value) || 0 }
                                                }
                                            })}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            placeholder="10000"
                                        />
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>
        </AdminLayout>
    )
}
