'use client'

// ═══════════════════════════════════════════════════════════════════════
// ⚙️ BLOG SETTINGS API - ULTRA PROFESSIONAL
// إعدادات المدونة المتكاملة - تصميم زجاجي عصري
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback } from 'react'
import { useApp } from '@/contexts/AppContext'
import { useToast } from '@/components/admin/Toast'
import ImageUploader from '@/components/admin/ImageUploader'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

// -----------------------------------------------------------------------------
// 🎨 UI COMPONENTS
// -----------------------------------------------------------------------------
const SectionHeader = ({ title, description }) => (
    <div className="mb-6 pb-4 border-b border-gray-100/80 dark:border-gray-800/80">
        <div className="flex items-center gap-3">
            <div className="h-9 w-1.5 rounded-full bg-gradient-to-b from-blue-500 to-purple-500" />
            <h3 className="text-xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
                {title}
            </h3>
        </div>
        {description && <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{description}</p>}
    </div>
)

const InputGroup = ({ label, value, onChange, placeholder, dir = 'ltr', type = 'text', textarea = false }) => (
    <div className="group">
        <label className={`block mb-2 text-gray-500 dark:text-gray-400 group-focus-within:text-blue-500 transition-colors ${dir === 'rtl' ? 'text-sm font-semibold tracking-normal' : 'text-[11px] font-bold uppercase tracking-[0.2em]'}`}>
            {label}
        </label>
        {textarea ? (
            <textarea
                value={value ?? ''}
                onChange={onChange}
                placeholder={placeholder}
                dir={dir}
                rows={3}
                className="w-full px-4 py-3 rounded-2xl bg-white/80 dark:bg-gray-900/50 border border-gray-200/80 dark:border-gray-700/70 shadow-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all resize-none text-gray-900 dark:text-gray-100 placeholder-gray-400"
            />
        ) : (
            <input
                type={type}
                value={value ?? ''}
                onChange={onChange}
                placeholder={placeholder}
                dir={dir}
                className="w-full px-4 py-3 rounded-2xl bg-white/80 dark:bg-gray-900/50 border border-gray-200/80 dark:border-gray-700/70 shadow-sm focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all text-gray-900 dark:text-gray-100 placeholder-gray-400"
            />
        )}
    </div>
)

const TabButton = ({ id, label, icon, active, onClick }) => (
    <button
        type="button"
        onClick={() => onClick(id)}
        className={`relative flex items-center gap-3 px-6 py-4 rounded-2xl transition-all font-bold w-full text-left overflow-hidden group ${active
            ? 'text-white shadow-xl shadow-blue-500/30'
            : 'text-gray-600 dark:text-gray-300 hover:bg-white/60 dark:hover:bg-gray-800/60 border border-transparent hover:border-gray-200/60 dark:hover:border-gray-700/60'
            }`}
    >
        {active && (
            <motion.div
                layoutId="activeTabBgResult"
                className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
        )}
        <span className="text-2xl relative z-10 group-hover:scale-110 transition-transform duration-300">{icon}</span>
        <span className="relative z-10">{label}</span>
    </button>
)

// -----------------------------------------------------------------------------
// 🛠️ MAIN COMPONENT
// -----------------------------------------------------------------------------
export default function BlogSettingsModal({ onClose }) {
    const { locale } = useApp()
    const { success, error: showError } = useToast()
    const isAr = locale === 'ar'

    // State
    const [activeTab, setActiveTab] = useState('general')
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    // Data State
    const [settings, setSettings] = useState({
        heroImage: '',
        heroTitleEn: '', heroTitleAr: '',
        heroSubtitleEn: '', heroSubtitleAr: '',
        newsletterTitleEn: '', newsletterTitleAr: '',
        newsletterTextEn: '', newsletterTextAr: '',
        writeTitleEn: '', writeTitleAr: '',
        writeTextEn: '', writeTextAr: '',
        stats: [] // Array of { labelEn, labelAr, value, icon }
    })
    const [authors, setAuthors] = useState([])
    const [tags, setTags] = useState([])

    // Editing State
    const [editingAuthor, setEditingAuthor] = useState(null)
    const [authorForm, setAuthorForm] = useState({ nameEn: '', nameAr: '', roleEn: '', roleAr: '', bioEn: '', bioAr: '', avatar: '' })
    const [editingTag, setEditingTag] = useState(null)
    const [tagForm, setTagForm] = useState({ nameEn: '', nameAr: '', slug: '' })

    // -------------------------------------------------------------------------
    // 🔄 DATA FETCHING
    // -------------------------------------------------------------------------
    const fetchData = useCallback(async () => {
        setLoading(true)
        try {
            const [settingsRes, authorsRes, tagsRes] = await Promise.all([
                fetch('/api/admin/blog/settings'),
                fetch('/api/admin/blog/authors'),
                fetch('/api/admin/blog/tags')
            ])

            const sData = await settingsRes.json()
            const aData = await authorsRes.json()
            const tData = await tagsRes.json()

            if (sData.success && sData.data) {
                // Ensure stats is array
                const loadedSettings = {
                    heroImage: '',
                    heroTitleEn: '',
                    heroTitleAr: '',
                    heroSubtitleEn: '',
                    heroSubtitleAr: '',
                    newsletterTitleEn: '',
                    newsletterTitleAr: '',
                    newsletterTextEn: '',
                    newsletterTextAr: '',
                    writeTitleEn: '',
                    writeTitleAr: '',
                    writeTextEn: '',
                    writeTextAr: '',
                    stats: [],
                    ...sData.data
                }
                if (!Array.isArray(loadedSettings.stats)) loadedSettings.stats = []
                setSettings(loadedSettings)
            }
            if (aData.success) setAuthors(aData.data)
            if (tData.success) setTags(tData.data)

        } catch (error) {
            console.error('Error fetching settings:', error)
            showError(isAr ? 'فشل تحميل الإعدادات' : 'Failed to load settings')
        } finally {
            setLoading(false)
        }
    }, [showError, isAr])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    // -------------------------------------------------------------------------
    // 💾 SAVE HANDLERS
    // -------------------------------------------------------------------------
    const saveSettings = async () => {
        setSaving(true)
        try {
            const res = await fetch('/api/admin/blog/settings', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(settings)
            })
            const result = await res.json()
            if (result.success) success(isAr ? 'تم حفظ الإعدادات بنجاح' : 'Settings updated successfully')
            else showError(isAr ? 'تعذر حفظ الإعدادات' : (result.error || 'Failed to save settings'))
        } catch (e) {
            showError(isAr ? 'فشل حفظ الإعدادات' : 'Error saving settings')
        } finally {
            setSaving(false)
        }
    }

    const saveAuthor = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            const url = editingAuthor ? `/api/admin/blog/authors?id=${editingAuthor.id}` : '/api/admin/blog/authors'
            const method = editingAuthor ? 'PUT' : 'POST'
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(authorForm)
            })
            const result = await res.json()
            if (result.success) {
                success(isAr ? 'تم حفظ الكاتب' : 'Author saved')
                fetchData()
                setEditingAuthor(null)
                setAuthorForm({ nameEn: '', nameAr: '', roleEn: '', roleAr: '', bioEn: '', bioAr: '', avatar: '' })
            } else showError(isAr ? 'تعذر حفظ الكاتب' : (result.error || 'Failed to save author'))
        } catch (e) {
            showError(isAr ? 'فشل حفظ الكاتب' : 'Error saving author')
        } finally {
            setSaving(false)
        }
    }

    const deleteAuthor = async (id) => {
        if (!confirm(isAr ? 'هل تريد حذف هذا الكاتب؟' : 'Delete this author?')) return
        try {
            const res = await fetch(`/api/admin/blog/authors?id=${id}`, { method: 'DELETE' })
            if (res.ok) {
                success(isAr ? 'تم حذف الكاتب' : 'Author deleted')
                setAuthors(authors.filter(a => a.id !== id))
            }
        } catch (e) { showError(isAr ? 'فشل حذف الكاتب' : 'Error deleting author') }
    }

    const saveTag = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            const url = editingTag ? `/api/admin/blog/tags?id=${editingTag.id}` : '/api/admin/blog/tags'
            const method = editingTag ? 'PUT' : 'POST'
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(tagForm)
            })
            const result = await res.json()
            if (result.success) {
                success(isAr ? 'تم حفظ الوسم' : 'Tag saved')
                fetchData()
                setEditingTag(null)
                setTagForm({ nameEn: '', nameAr: '', slug: '' })
            } else showError(isAr ? 'تعذر حفظ الوسم' : (result.error || 'Failed to save tag'))
        } catch (e) {
            showError(isAr ? 'فشل حفظ الوسم' : 'Error saving tag')
        } finally {
            setSaving(false)
        }
    }

    const deleteTag = async (id) => {
        if (!confirm(isAr ? 'هل تريد حذف هذا الوسم؟' : 'Delete this tag?')) return
        try {
            const res = await fetch(`/api/admin/blog/tags?id=${id}`, { method: 'DELETE' })
            if (res.ok) {
                success(isAr ? 'تم حذف الوسم' : 'Tag deleted')
                setTags(tags.filter(t => t.id !== id))
            }
        } catch (e) { showError(isAr ? 'فشل حذف الوسم' : 'Error deleting tag') }
    }

    // Stats Management
    const addStat = () => {
        setSettings({
            ...settings,
            stats: [...settings.stats, { labelEn: 'New Stat', labelAr: 'إحصائية', value: '0', icon: '📊' }]
        })
    }

    const removeStat = (index) => {
        const newStats = [...settings.stats]
        newStats.splice(index, 1)
        setSettings({ ...settings, stats: newStats })
    }

    const updateStat = (index, field, value) => {
        const newStats = [...settings.stats]
        newStats[index] = { ...newStats[index], [field]: value }
        setSettings({ ...settings, stats: newStats })
    }

    return (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-2xl z-50 flex items-center justify-center p-4">
            <motion.div
                initial={{ scale: 0.95, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0.95, opacity: 0, y: 20 }}
                className="bg-white/95 dark:bg-gray-900/95 rounded-[2.8rem] shadow-[0_40px_120px_-40px_rgba(0,0,0,0.6)] w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden border border-gray-200/80 dark:border-gray-800/80"
                dir={isAr ? 'rtl' : 'ltr'}
            >
                {/* Header */}
                <div className="px-8 py-6 border-b border-gray-100/80 dark:border-gray-800/80 flex items-center justify-between bg-gradient-to-r from-white via-blue-50/40 to-purple-50/40 dark:from-gray-900 dark:via-gray-900/90 dark:to-gray-900/80 shrink-0">
                    <div>
                        <h2 className="text-2xl font-black bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3">
                            <span className="w-10 h-10 rounded-2xl bg-white/80 dark:bg-gray-800 flex items-center justify-center shadow-sm">⚙️</span>
                            <span>{isAr ? 'إعدادات المدونة الشاملة' : 'Blog System Settings'}</span>
                        </h2>
                        <p className="text-gray-500 font-medium ml-12">
                            {isAr ? 'اضبط الهيرو، الإحصائيات، النشرة، والكتّاب بدقة' : 'Configure hero, stats, newsletter, authors, and tags.'}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-11 h-11 flex items-center justify-center rounded-full bg-white/80 dark:bg-gray-800 text-gray-500 hover:bg-red-500 hover:text-white transition-all shadow-md border border-gray-200/70 dark:border-gray-700/70"
                    >
                        ✕
                    </button>
                </div>

                {/* Content */}
                <div className="flex-1 flex overflow-hidden">
                    {/* Sidebar */}
                    <div className="w-72 bg-gradient-to-b from-white/70 via-gray-50/60 to-white/40 dark:from-gray-900/80 dark:via-gray-900/60 dark:to-gray-900/40 border-r border-gray-100/80 dark:border-gray-800/80 p-6 space-y-3 hidden md:block overflow-y-auto">
                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 px-2">
                            {isAr ? 'الإعدادات العامة' : 'Configuration'}
                        </div>
                        <TabButton id="general" label={isAr ? 'عام والهيرو' : 'General & Hero'} icon="🏠" active={activeTab === 'general'} onClick={setActiveTab} />
                        <TabButton id="stats" label={isAr ? 'شريط الإحصائيات' : 'Stats Bar'} icon="📊" active={activeTab === 'stats'} onClick={setActiveTab} />
                        <TabButton id="newsletter" label={isAr ? 'النشرة البريدية' : 'Newsletter'} icon="📧" active={activeTab === 'newsletter'} onClick={setActiveTab} />

                        <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mt-8 mb-4 px-2">
                            {isAr ? 'المحتوى' : 'Content'}
                        </div>
                        <TabButton id="authors" label={isAr ? 'الكتّاب' : 'Authors'} icon="✍️" active={activeTab === 'authors'} onClick={setActiveTab} />
                        <TabButton id="tags" label={isAr ? 'الوسوم' : 'Tags'} icon="🏷️" active={activeTab === 'tags'} onClick={setActiveTab} />
                    </div>

                    {/* Main Content Area */}
                    <div className="flex-1 overflow-y-auto p-6 md:p-12 pb-24 scrollbar-thin bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.08),transparent_55%)] dark:bg-[radial-gradient(circle_at_top,_rgba(59,130,246,0.12),transparent_55%)]">
                        <div className="md:hidden mb-6">
                            <div className="flex gap-2 overflow-x-auto pb-2">
                                {[
                                    { id: 'general', label: isAr ? 'عام' : 'General', icon: '🏠' },
                                    { id: 'stats', label: isAr ? 'الإحصائيات' : 'Stats', icon: '📊' },
                                    { id: 'newsletter', label: isAr ? 'النشرة' : 'Newsletter', icon: '📧' },
                                    { id: 'authors', label: isAr ? 'الكتّاب' : 'Authors', icon: '✍️' },
                                    { id: 'tags', label: isAr ? 'الوسوم' : 'Tags', icon: '🏷️' }
                                ].map((tab) => (
                                    <button
                                        key={tab.id}
                                        type="button"
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${activeTab === tab.id
                                            ? 'bg-blue-600 text-white shadow-xl shadow-blue-600/30'
                                            : 'bg-white/90 dark:bg-gray-800/80 text-gray-600 dark:text-gray-300 border border-gray-200/70 dark:border-gray-700/70'
                                            }`}
                                    >
                                        <span className="mr-1">{tab.icon}</span>
                                        {tab.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center min-h-[60vh] text-gray-500">
                                <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4" />
                                <div className="font-bold">{isAr ? 'جاري تحميل الإعدادات...' : 'Loading settings...'}</div>
                            </div>
                        ) : (
                            <>

                        {/* GENERAL TAB */}
                        {activeTab === 'general' && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-4xl">
                                <SectionHeader
                                    title={isAr ? 'قسم الهيرو الرئيسي' : 'Main Hero Section'}
                                    description={isAr ? 'أول ما يراه الزائر في صفحة المدونة.' : 'The first thing visitors see on the blog page.'}
                                />

                                <div className="bg-white/90 dark:bg-gray-800/80 rounded-3xl shadow-lg border border-gray-100/70 dark:border-gray-700/70 p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div>
                                            <h4 className="font-bold text-gray-900 dark:text-white">{isAr ? 'صورة خلفية الهيرو' : 'Hero Background Image'}</h4>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                {isAr ? 'أضف صورة أو احذفها للعودة للخلفية الافتراضية' : 'Upload an image or remove it to return to the default background'}
                                            </p>
                                        </div>
                                    </div>
                                    <ImageUploader
                                        label={isAr ? 'صورة الخلفية' : 'Background Image'}
                                        value={settings.heroImage}
                                        onChange={(url) => setSettings({ ...settings, heroImage: url })}
                                        previewClassName="aspect-[16/7]"
                                    />
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-6 p-6 bg-white/90 dark:bg-gray-800/80 rounded-3xl shadow-lg border border-gray-100/70 dark:border-gray-700/70">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="text-2xl">🇺🇸</span>
                                            <h4 className="text-base font-bold text-gray-800 dark:text-gray-100">{isAr ? 'المحتوى الإنجليزي' : 'English Content'}</h4>
                                        </div>
                                        <InputGroup label={isAr ? 'عنوان الهيرو (EN)' : 'Hero Title'} value={settings.heroTitleEn} onChange={e => setSettings({ ...settings, heroTitleEn: e.target.value })} />
                                        <InputGroup label={isAr ? 'وصف الهيرو (EN)' : 'Hero Subtitle'} value={settings.heroSubtitleEn} onChange={e => setSettings({ ...settings, heroSubtitleEn: e.target.value })} textarea />
                                    </div>

                                    <div className="space-y-6 p-6 bg-white/90 dark:bg-gray-800/80 rounded-3xl shadow-lg border border-gray-100/70 dark:border-gray-700/70">
                                        <div className="flex items-center gap-2 mb-3">
                                            <span className="text-2xl">🇸🇦</span>
                                            <h4 className="text-base font-bold text-gray-800 dark:text-gray-100">المحتوى العربي</h4>
                                        </div>
                                        <InputGroup label="عنوان الهيرو" dir="rtl" value={settings.heroTitleAr} onChange={e => setSettings({ ...settings, heroTitleAr: e.target.value })} />
                                        <InputGroup label="وصف الهيرو" dir="rtl" value={settings.heroSubtitleAr} onChange={e => setSettings({ ...settings, heroSubtitleAr: e.target.value })} textarea />
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* STATS TAB */}
                        {activeTab === 'stats' && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-5xl">
                                <SectionHeader
                                    title={isAr ? 'شريط الإحصائيات' : 'Stats Bar'}
                                    description={isAr ? 'إحصائيات ديناميكية أسفل الهيرو.' : 'Dynamic statistics shown below the hero section.'}
                                />

                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {settings.stats.map((stat, i) => (
                                        <div key={i} className="relative group p-6 bg-white/90 dark:bg-gray-800/80 rounded-3xl border border-gray-200/70 dark:border-gray-700/70 shadow-lg hover:shadow-xl transition-all">
                                            <button onClick={() => removeStat(i)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/80 dark:bg-gray-700 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors">×</button>

                                            <div className="text-3xl mb-4 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 w-16 h-16 rounded-2xl flex items-center justify-center border border-gray-200/60 dark:border-gray-700/60 shadow-sm">
                                                <input
                                                    value={stat.icon}
                                                    onChange={e => updateStat(i, 'icon', e.target.value)}
                                                    className="w-full text-center bg-transparent outline-none"
                                                />
                                            </div>

                                            <div className="space-y-4">
                                                <InputGroup label={isAr ? 'القيمة (مثال 50+)' : 'Value (e.g. 50+)'} value={stat.value} onChange={e => updateStat(i, 'value', e.target.value)} />
                                                <InputGroup label={isAr ? 'التسمية (EN)' : 'Label (EN)'} value={stat.labelEn} onChange={e => updateStat(i, 'labelEn', e.target.value)} />
                                                <InputGroup label={isAr ? 'التسمية (AR)' : 'Label (AR)'} dir="rtl" value={stat.labelAr} onChange={e => updateStat(i, 'labelAr', e.target.value)} />
                                            </div>
                                        </div>
                                    ))}

                                    <button onClick={addStat} className="flex flex-col items-center justify-center p-6 bg-white/60 dark:bg-gray-900/40 rounded-3xl border-2 border-dashed border-gray-200/80 dark:border-gray-700/70 hover:border-blue-500 hover:bg-blue-50/60 dark:hover:bg-blue-900/10 transition-all group min-h-[300px]">
                                        <div className="w-16 h-16 rounded-2xl bg-white dark:bg-gray-800 flex items-center justify-center shadow-lg mb-4 group-hover:scale-110 transition-transform">
                                            <span className="text-3xl text-blue-500">+</span>
                                        </div>
                                        <span className="font-bold text-gray-500 group-hover:text-blue-600">{isAr ? 'إضافة إحصائية جديدة' : 'Add New Stat'}</span>
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {/* NEWSLETTER & WRITE FOR US */}
                        {activeTab === 'newsletter' && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-12 max-w-4xl">
                                <div>
                                    <SectionHeader
                                        title={isAr ? 'قسم النشرة البريدية' : 'Newsletter Section'}
                                        description={isAr ? 'دعوة للاشتراك بالبريد الإلكتروني.' : 'Call to action for email subscriptions.'}
                                    />
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <InputGroup label={isAr ? 'العنوان (EN)' : 'Title (EN)'} value={settings.newsletterTitleEn} onChange={e => setSettings({ ...settings, newsletterTitleEn: e.target.value })} />
                                            <InputGroup label={isAr ? 'النص (EN)' : 'Text (EN)'} value={settings.newsletterTextEn} onChange={e => setSettings({ ...settings, newsletterTextEn: e.target.value })} textarea />
                                        </div>
                                        <div className="space-y-4">
                                            <InputGroup label="العنوان (AR)" dir="rtl" value={settings.newsletterTitleAr} onChange={e => setSettings({ ...settings, newsletterTitleAr: e.target.value })} />
                                            <InputGroup label="النص (AR)" dir="rtl" value={settings.newsletterTextAr} onChange={e => setSettings({ ...settings, newsletterTextAr: e.target.value })} textarea />
                                        </div>
                                    </div>
                                </div>

                                <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
                                    <SectionHeader
                                        title={isAr ? 'قسم اكتب معنا' : "'Write For Us' Section"}
                                        description={isAr ? 'قسم يحفّز الزوار لإرسال قصصهم.' : 'Section encouraging users to submit stories.'}
                                    />
                                    <div className="grid md:grid-cols-2 gap-8">
                                        <div className="space-y-4">
                                            <InputGroup label={isAr ? 'العنوان (EN)' : 'Title (EN)'} value={settings.writeTitleEn} onChange={e => setSettings({ ...settings, writeTitleEn: e.target.value })} />
                                            <InputGroup label={isAr ? 'النص (EN)' : 'Text (EN)'} value={settings.writeTextEn} onChange={e => setSettings({ ...settings, writeTextEn: e.target.value })} textarea />
                                        </div>
                                        <div className="space-y-4">
                                            <InputGroup label="العنوان (AR)" dir="rtl" value={settings.writeTitleAr} onChange={e => setSettings({ ...settings, writeTitleAr: e.target.value })} />
                                            <InputGroup label="النص (AR)" dir="rtl" value={settings.writeTextAr} onChange={e => setSettings({ ...settings, writeTextAr: e.target.value })} textarea />
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* AUTHORS */}
                        {activeTab === 'authors' && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                                <SectionHeader
                                    title={isAr ? 'إدارة الكتّاب' : 'Author Management'}
                                    description={isAr ? 'إدارة فريق الكتّاب بشكل احترافي.' : 'Manage the team of writers.'}
                                />

                                {/* Editor */}
                                <div className="bg-white/90 dark:bg-gray-800/80 p-8 rounded-3xl shadow-xl border border-gray-100/70 dark:border-gray-700/70">
                                    <h4 className="text-lg font-bold mb-6 flex items-center gap-2">
                                        <span className="bg-blue-100 dark:bg-blue-900 text-blue-600 rounded-lg p-1.5 text-xl">✍️</span>
                                        {editingAuthor ? (isAr ? 'تعديل كاتب' : 'Edit Author') : (isAr ? 'إضافة كاتب جديد' : 'Add New Author')}
                                    </h4>
                                    <form onSubmit={saveAuthor} className="space-y-6">
                                        <div className="flex flex-col md:flex-row gap-8">
                                            <div className="shrink-0 flex flex-col items-center gap-2">
                                                <div className="relative">
                                                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-500/30 to-purple-500/30 blur-xl" />
                                                    <div className="relative w-36 h-36 rounded-full bg-white/90 dark:bg-gray-800/90 border border-white/70 dark:border-gray-700/70 shadow-[0_20px_60px_-25px_rgba(59,130,246,0.6)] overflow-hidden">
                                                        <ImageUploader
                                                            value={authorForm.avatar}
                                                            onUploadProp={(url) => setAuthorForm({ ...authorForm, avatar: url })}
                                                            className="w-36 h-36"
                                                            boxClassName="w-36 h-36 rounded-full p-0 flex items-center justify-center"
                                                            previewClassName="w-36 h-36 rounded-full"
                                                            label={null}
                                                        />
                                                    </div>
                                                </div>
                                                <span className="text-xs font-bold text-gray-400 uppercase">{isAr ? 'صورة الكاتب' : 'Profile Photo'}</span>
                                                <span className="text-[11px] text-gray-400">{isAr ? 'يفضل صورة مربعة بدقة عالية' : 'Square high-res image recommended'}</span>
                                            </div>
                                            <div className="flex-1 grid md:grid-cols-2 gap-6">
                                                <InputGroup label={isAr ? 'الاسم (EN)' : 'Name (EN)'} value={authorForm.nameEn} onChange={e => setAuthorForm({ ...authorForm, nameEn: e.target.value })} placeholder={isAr ? 'مثال: John Doe' : 'e.g. John Doe'} />
                                                <InputGroup label="الاسم (AR)" dir="rtl" value={authorForm.nameAr} onChange={e => setAuthorForm({ ...authorForm, nameAr: e.target.value })} placeholder="مثال: أحمد محمد" />
                                                <InputGroup label={isAr ? 'المنصب (EN)' : 'Role (EN)'} value={authorForm.roleEn} onChange={e => setAuthorForm({ ...authorForm, roleEn: e.target.value })} placeholder={isAr ? 'مثال: Editor' : 'e.g. Editor'} />
                                                <InputGroup label="المنصب (AR)" dir="rtl" value={authorForm.roleAr} onChange={e => setAuthorForm({ ...authorForm, roleAr: e.target.value })} placeholder="مثال: محرر" />
                                            </div>
                                        </div>
                                        <div className="grid md:grid-cols-2 gap-6">
                                            <InputGroup label={isAr ? 'نبذة (EN)' : 'Bio (EN)'} value={authorForm.bioEn} onChange={e => setAuthorForm({ ...authorForm, bioEn: e.target.value })} textarea />
                                            <InputGroup label="نبذة (AR)" dir="rtl" value={authorForm.bioAr} onChange={e => setAuthorForm({ ...authorForm, bioAr: e.target.value })} textarea />
                                        </div>
                                        <div className="flex justify-end gap-3 pt-4 border-t border-gray-100 dark:border-gray-700">
                                            {editingAuthor && (
                                                <button type="button" onClick={() => { setEditingAuthor(null); setAuthorForm({ nameEn: '', nameAr: '', roleEn: '', roleAr: '', bioEn: '', bioAr: '', avatar: '' }) }} className="px-6 py-3 rounded-xl font-bold bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 text-gray-600 dark:text-white transition-colors">
                                                    {isAr ? 'إلغاء' : 'Cancel'}
                                                </button>
                                            )}
                                            <button type="submit" disabled={saving} className="px-8 py-3 rounded-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-xl shadow-blue-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all">
                                                {saving ? (isAr ? 'جارٍ الحفظ...' : 'Saving...') : (editingAuthor ? (isAr ? 'تحديث الكاتب' : 'Update Author') : (isAr ? 'إضافة الكاتب' : 'Add Author'))}
                                            </button>
                                        </div>
                                    </form>
                                </div>

                                {/* List */}
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {authors.map(author => (
                                        <div key={author.id} className="group p-5 bg-white/90 dark:bg-gray-800/80 rounded-3xl border border-gray-100/70 dark:border-gray-700/70 shadow-lg hover:shadow-xl transition-all flex items-center gap-4">
                                            <div className="relative w-16 h-16 rounded-full border-2 border-white/90 dark:border-gray-600/80 shadow-md overflow-hidden group-hover:scale-105 transition-transform">
                                                <Image
                                                    src={author.avatar || '/placeholder-user.jpg'}
                                                    alt={author.nameEn}
                                                    fill
                                                    className="object-cover"
                                                    sizes="64px"
                                                    unoptimized
                                                />
                                                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs border-2 border-white dark:border-gray-800">✓</div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-bold text-gray-900 dark:text-white truncate">{isAr ? author.nameAr : author.nameEn}</h4>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{isAr ? author.roleAr : author.roleEn}</p>
                                            </div>
                                            <div className="flex flex-col gap-2">
                                                <button onClick={() => { setEditingAuthor(author); setAuthorForm(author) }} className="w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors">✎</button>
                                                <button onClick={() => deleteAuthor(author.id)} className="w-8 h-8 rounded-full bg-red-50 dark:bg-red-900/30 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors">🗑️</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* TAGS */}
                        {activeTab === 'tags' && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                                <SectionHeader
                                    title={isAr ? 'إدارة الوسوم' : 'Tag Management'}
                                    description={isAr ? 'نظّم المحتوى عبر الوسوم.' : 'Organize content with tags.'}
                                />

                                <div className="bg-white/90 dark:bg-gray-800/80 p-6 rounded-3xl shadow-xl border border-gray-100/70 dark:border-gray-700/70 flex flex-col md:flex-row gap-6 items-end">
                                    <div className="flex-1 grid md:grid-cols-3 gap-6 w-full">
                                        <InputGroup label={isAr ? 'الاسم (EN)' : 'Name (EN)'} value={tagForm.nameEn} onChange={e => setTagForm({ ...tagForm, nameEn: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })} placeholder={isAr ? 'مثال: Travel' : 'e.g. Travel'} />
                                        <InputGroup label="الاسم (AR)" dir="rtl" value={tagForm.nameAr} onChange={e => setTagForm({ ...tagForm, nameAr: e.target.value })} placeholder="مثال: سفر" />
                                        <InputGroup label={isAr ? 'الرابط المختصر' : 'Slug'} value={tagForm.slug} onChange={e => setTagForm({ ...tagForm, slug: e.target.value })} placeholder={isAr ? 'travel' : 'travel'} />
                                    </div>
                                    <div className="flex gap-3 w-full md:w-auto">
                                        {editingTag && <button onClick={() => { setEditingTag(null); setTagForm({ nameEn: '', nameAr: '', slug: '' }) }} className="px-6 py-3 rounded-2xl font-bold bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 transition-colors h-[50px]">{isAr ? 'إلغاء' : 'Cancel'}</button>}
                                        <button onClick={saveTag} disabled={saving} className="flex-1 md:flex-none px-8 py-3 rounded-2xl font-bold bg-gradient-to-r from-purple-600 to-fuchsia-600 text-white shadow-xl shadow-purple-600/30 hover:scale-[1.02] active:scale-[0.98] transition-all h-[50px]">
                                            {saving ? '...' : (editingTag ? (isAr ? 'تحديث الوسم' : 'Update Tag') : (isAr ? 'إضافة وسم' : 'Add Tag'))}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-3">
                                    {tags.map(tag => (
                                        <div key={tag.id} className="group flex items-center gap-3 pl-4 pr-2 py-2 bg-white/90 dark:bg-gray-800/80 rounded-full border border-gray-200/70 dark:border-gray-700/70 shadow-sm hover:shadow-md hover:border-purple-300 transition-all">
                                            <span className="font-bold text-gray-700 dark:text-gray-200">
                                                {isAr ? tag.nameAr : tag.nameEn}
                                            </span>
                                            <div className="w-px h-4 bg-gray-200 dark:bg-gray-700"></div>
                                            <div className="flex gap-1">
                                                <button onClick={() => { setEditingTag(tag); setTagForm(tag) }} className="w-6 h-6 rounded-full hover:bg-purple-100 dark:hover:bg-purple-900/40 text-purple-600 flex items-center justify-center text-xs">✎</button>
                                                <button onClick={() => deleteTag(tag.id)} className="w-6 h-6 rounded-full hover:bg-red-100 dark:hover:bg-red-900/40 text-red-600 flex items-center justify-center text-xs">×</button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </motion.div>
                        )}
                            </>
                        )}
                    </div>

                    {/* Footer Actions for General Settings */}
                    {(activeTab === 'general' || activeTab === 'stats' || activeTab === 'newsletter') && (
                        <div className="sticky bottom-0 left-0 right-0 mt-8 p-6 bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 flex justify-end gap-4 z-40">
                            <button
                                onClick={saveSettings}
                                disabled={saving}
                                className="px-10 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold shadow-xl shadow-blue-600/30 hover:scale-105 active:scale-95 transition-all flex items-center gap-2"
                            >
                                {saving ? <span className="animate-spin text-xl">⏳</span> : <span className="text-xl">💾</span>}
                                {isAr ? 'حفظ التغييرات' : 'Save Changes'}
                            </button>
                        </div>
                    )}

                </div>
            </motion.div>
        </div>
    )
}
