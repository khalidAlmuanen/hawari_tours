'use client'

import { useState, useEffect } from 'react'
import { useApp } from '@/contexts/AppContext'
import { motion, AnimatePresence } from 'framer-motion'

export default function SafetyTab() {
    const { locale } = useApp()
    const isAr = locale === 'ar'

    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingItem, setEditingItem] = useState(null)

    const [formData, setFormData] = useState({
        icon: '',
        titleEn: '', titleAr: '',
        descriptionEn: '', descriptionAr: '',
        category: 'HEALTH',
        order: 0
    })

    const categories = [
        { value: 'HEALTH', labelEn: 'Health & Hygiene', labelAr: 'الصحة والنظافة' },
        { value: 'SECURITY', labelEn: 'Personal Security', labelAr: 'الأمان الشخصي' },
        { value: 'ENVIRONMENT', labelEn: 'Environment & Nature', labelAr: 'البيئة والطبيعة' },
        { value: 'CULTURE', labelEn: 'Culture & Customs', labelAr: 'الثقافة والعادات' },
        { value: 'WEATHER', labelEn: 'Weather & Climate', labelAr: 'الطقس والمناخ' },
        { value: 'WATER', labelEn: 'Water & Swimming', labelAr: 'المياه والسباحة' },
        { value: 'TRANSPORT', labelEn: 'Road & Transport', labelAr: 'الطرق والمواصلات' },
        { value: 'WILDLIFE', labelEn: 'Wildlife & Insects', labelAr: 'الحياة البرية والحشرات' }
    ]
    const emojiOptions = [
        '🛡️', '🏥', '🧼', '💊', '🧯', '🩹', '💧', '🥤',
        '🌡️', '☀️', '⛈️', '🌪️', '🌊', '🏊', '🚗', '🚌',
        '🚤', '🧭', '🏕️', '🔥', '⚠️', '🔒', '👮', '🤝',
        '🕌', '🍽️', '🧳', '🦎', '🦂', '🐍', '🦟', '🦈'
    ]

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/admin/travel-guide?section=safety')
            const result = await response.json()
            if (result.success) {
                setItems(result.data || [])
            }
        } catch (error) {
            console.error('Error fetching safety:', error)
        } finally {
            setLoading(false)
        }
    }

    const openModal = (item = null) => {
        if (item) {
            setEditingItem(item)
            setFormData({
                icon: item.icon,
                titleEn: item.titleEn, titleAr: item.titleAr,
                descriptionEn: item.descriptionEn, descriptionAr: item.descriptionAr,
                category: item.category || 'HEALTH',
                order: item.order || 0
            })
        } else {
            setEditingItem(null)
            setFormData({
                icon: '',
                titleEn: '', titleAr: '',
                descriptionEn: '', descriptionAr: '',
                category: 'HEALTH',
                order: items.length + 1
            })
        }
        setShowModal(true)
    }

    const save = async (e) => {
        e.preventDefault()
        try {
            const url = '/api/admin/travel-guide'
            const method = editingItem ? 'PUT' : 'POST'
            const body = editingItem
                ? { section: 'safety', id: editingItem.id, data: formData }
                : { section: 'safety', data: formData }

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })

            const result = await response.json()
            if (result.success) {
                alert(isAr ? 'تم الحفظ!' : 'Saved!')
                setShowModal(false)
                fetchData()
            }
        } catch (error) {
            console.error('Error saving:', error)
        }
    }

    const deleteItem = async (id) => {
        if (!confirm(isAr ? 'هل أنت متأكد؟' : 'Are you sure?')) return
        try {
            await fetch(`/api/admin/travel-guide?section=safety&id=${id}`, {
                method: 'DELETE'
            })
            fetchData()
        } catch (error) {
            console.error('Error deleting:', error)
        }
    }

    if (loading) return <div className="text-center py-20">Loading...</div>

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
                        <span className="text-4xl">🛡️</span>
                        {isAr ? 'إراشادات السلامة' : 'Safety Guidelines'}
                    </h2>
                </div>
                <button
                    onClick={() => openModal()}
                    className="px-6 py-3 bg-red-600 text-white rounded-xl font-bold hover:shadow-lg transition-all flex items-center gap-2"
                >
                    {isAr ? 'إضافة إرشاد' : 'Add Guideline'}
                </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
                {items.map((item) => (
                    <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border-l-4 border-red-500 relative group flex gap-4">
                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openModal(item)} className="p-1 bg-gray-100 hover:bg-gray-200 rounded">✏️</button>
                            <button onClick={() => deleteItem(item.id)} className="p-1 bg-red-100 hover:bg-red-200 rounded">🗑️</button>
                        </div>

                        <div className="text-4xl">{item.icon}</div>
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <h3 className="font-bold text-lg">{isAr ? item.titleAr : item.titleEn}</h3>
                                <span className="text-xs px-2 py-0.5 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-500">
                                    {isAr
                                        ? (categories.find(c => c.value === item.category)?.labelAr || item.category)
                                        : (categories.find(c => c.value === item.category)?.labelEn || item.category)}
                                </span>
                            </div>
                            <p className="text-gray-600 dark:text-gray-400 text-sm">{isAr ? item.descriptionAr : item.descriptionEn}</p>
                        </div>
                    </div>
                ))}
            </div>

            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full p-6"
                        >
                            <form onSubmit={save} className="space-y-4">
                                <h2 className="text-2xl font-bold mb-4">{editingItem ? (isAr ? 'تعديل' : 'Edit') : (isAr ? 'إضافة' : 'Add')}</h2>

                                <input className="input-field text-center text-4xl" placeholder="Emoji" value={formData.icon} onChange={e => setFormData({ ...formData, icon: e.target.value })} required />
                                <div className="grid grid-cols-6 gap-2 max-h-40 overflow-y-auto pr-1">
                                    {emojiOptions.map((emoji) => (
                                        <button
                                            key={emoji}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, icon: emoji })}
                                            className={`h-10 rounded-lg text-xl flex items-center justify-center border ${formData.icon === emoji ? 'border-red-500 bg-red-50 dark:bg-red-900/20' : 'border-gray-200 dark:border-gray-700'}`}
                                        >
                                            {emoji}
                                        </button>
                                    ))}
                                </div>

                                <div>
                                    <label className="block text-sm font-bold mb-1">Category</label>
                                    <select
                                        className="input-field"
                                        value={formData.category}
                                        onChange={e => setFormData({ ...formData, category: e.target.value })}
                                    >
                                        {categories.map(cat => (
                                            <option key={cat.value} value={cat.value}>
                                                {isAr ? cat.labelAr : cat.labelEn}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <input className="input-field" placeholder="Title (En)" value={formData.titleEn} onChange={e => setFormData({ ...formData, titleEn: e.target.value })} required />
                                    <input className="input-field text-right" placeholder="العنوان (عربي)" value={formData.titleAr} onChange={e => setFormData({ ...formData, titleAr: e.target.value })} required dir="rtl" />
                                </div>

                                <textarea className="input-field" rows={3} placeholder="Description (En)" value={formData.descriptionEn} onChange={e => setFormData({ ...formData, descriptionEn: e.target.value })} required />
                                <textarea className="input-field text-right" rows={3} placeholder="الوصف (عربي)" value={formData.descriptionAr} onChange={e => setFormData({ ...formData, descriptionAr: e.target.value })} required dir="rtl" />

                                <div className="flex gap-3 pt-4">
                                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 bg-gray-200 rounded-xl font-bold">Cancel</button>
                                    <button type="submit" className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold">Save</button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <style jsx>{`
        .input-field {
            width: 100%;
            padding: 0.75rem 1rem;
            border-radius: 0.75rem;
            border: 1px solid #e5e7eb;
            background-color: white;
            color: #1f2937;
        }
        :global(.dark) .input-field {
            background-color: #374151;
            border-color: #4b5563;
            color: white;
        }
      `}</style>
        </div>
    )
}
