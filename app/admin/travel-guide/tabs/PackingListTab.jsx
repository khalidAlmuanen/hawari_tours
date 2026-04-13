'use client'

import { useState, useEffect } from 'react'
import { useApp } from '@/contexts/AppContext'
import { motion, AnimatePresence } from 'framer-motion'
import { FaTrash, FaPlus, FaSave } from 'react-icons/fa'

export default function PackingListTab() {
    const { locale } = useApp()
    const isAr = locale === 'ar'
    const emojiOptions = [
        '🎒', '👕', '🧥', '🧢', '🥾', '🧦', '🧤', '🕶️',
        '🧴', '🪥', '🧼', '🩺', '💊', '🩹', '🧻', '🧽',
        '🔌', '🔋', '📷', '📱', '🎧', '💳', '🧾', '🧳'
    ]

    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)

    // Form
    const [formData, setFormData] = useState({
        categoryEn: '', categoryAr: '',
        icon: '🎒',
        itemsEn: '', // Newline separated
        itemsAr: ''  // Newline separated
    })
    const [editingId, setEditingId] = useState(null)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/admin/travel-guide?section=packing-list')
            const result = await response.json()
            if (result.success) {
                setItems(result.data || [])
            }
        } catch (error) {
            console.error('Error fetching packing list:', error)
        } finally {
            setLoading(false)
        }
    }

    const startEdit = (item) => {
        setEditingId(item.id)
        setFormData({
            categoryEn: item.categoryEn,
            categoryAr: item.categoryAr,
            icon: item.icon,
            itemsEn: item.items?.map(i => i.en).join('\n') || '',
            itemsAr: item.items?.map(i => i.ar).join('\n') || ''
        })
    }

    const cancelEdit = () => {
        setEditingId(null)
        setFormData({
            categoryEn: '', categoryAr: '',
            icon: '🎒',
            itemsEn: '', itemsAr: ''
        })
    }

    const save = async (e) => {
        e.preventDefault()

        const listEn = formData.itemsEn.split('\n').filter(Boolean)
        const listAr = formData.itemsAr.split('\n').filter(Boolean)

        const itemsArray = listEn.map((en, i) => ({
            en,
            ar: listAr[i] || en
        }))

        const dataToSave = {
            categoryEn: formData.categoryEn,
            categoryAr: formData.categoryAr,
            icon: formData.icon,
            items: itemsArray
        }

        try {
            const url = '/api/admin/travel-guide'
            const method = editingId ? 'PUT' : 'POST'
            const body = editingId
                ? { section: 'packing-list', id: editingId, data: dataToSave }
                : { section: 'packing-list', data: dataToSave }

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            })

            const result = await response.json()
            if (result.success) {
                fetchData()
                cancelEdit()
            }
        } catch (error) {
            console.error('Error saving:', error)
        }
    }

    const deleteItem = async (id) => {
        if (!confirm(isAr ? 'هل أنت متأكد؟' : 'Are you sure?')) return
        try {
            await fetch(`/api/admin/travel-guide?section=packing-list&id=${id}`, { method: 'DELETE' })
            fetchData()
        } catch (error) {
            console.error(error)
        }
    }

    if (loading) return <div>Loading...</div>

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    🎒 {isAr ? 'قائمة الأمتعة' : 'Packing List'}
                </h3>
            </div>

            {/* List */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {items.map(item => (
                    <div key={item.id} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 relative group">
                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => startEdit(item)} className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200">✎</button>
                            <button onClick={() => deleteItem(item.id)} className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200"><FaTrash /></button>
                        </div>

                        <div className="text-4xl mb-4 text-center">{item.icon}</div>
                        <h4 className="font-bold text-center mb-4">{isAr ? item.categoryAr : item.categoryEn}</h4>

                        <ul className="text-sm space-y-1 text-gray-600 dark:text-gray-400">
                            {item.items?.slice(0, 4).map((i, idx) => (
                                <li key={idx}>• {isAr ? i.ar : i.en}</li>
                            ))}
                            {(item.items?.length > 4) && <li>...</li>}
                        </ul>
                    </div>
                ))}
            </div>

            {/* Form */}
            <form onSubmit={save} className="bg-gray-50 dark:bg-gray-900/50 p-6 rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
                <h4 className="font-bold mb-4">{editingId ? (isAr ? 'تعديل فئة' : 'Edit Category') : (isAr ? 'إضافة فئة جديدة' : 'Add New Category')}</h4>

                <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <input
                        className="input-field"
                        placeholder={isAr ? 'القسم (إنجليزي)' : 'Category (En)'}
                        value={formData.categoryEn}
                        onChange={e => setFormData({ ...formData, categoryEn: e.target.value })}
                        required
                    />
                    <input
                        className="input-field text-right"
                        placeholder={isAr ? 'القسم (عربي)' : 'Category (Ar)'}
                        value={formData.categoryAr}
                        onChange={e => setFormData({ ...formData, categoryAr: e.target.value })}
                        dir="rtl"
                        required
                    />
                    <input
                        className="input-field text-center"
                        placeholder={isAr ? 'الأيقونة (إيموجي)' : 'Icon (Emoji)'}
                        value={formData.icon}
                        onChange={e => setFormData({ ...formData, icon: e.target.value })}
                        required
                    />
                </div>
                <div className="grid grid-cols-8 gap-2 max-h-36 overflow-y-auto pr-1 mb-4">
                    {emojiOptions.map((emoji) => (
                        <button
                            key={emoji}
                            type="button"
                            onClick={() => setFormData({ ...formData, icon: emoji })}
                            className={`h-9 rounded-lg text-xl flex items-center justify-center border ${formData.icon === emoji ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-gray-700'}`}
                        >
                            {emoji}
                        </button>
                    ))}
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                    <textarea
                        className="input-field"
                        placeholder={isAr ? 'العناصر (إنجليزي) - عنصر في كل سطر' : 'Items (En) - One per line'}
                        rows={4}
                        value={formData.itemsEn}
                        onChange={e => setFormData({ ...formData, itemsEn: e.target.value })}
                    />
                    <textarea
                        className="input-field text-right"
                        placeholder={isAr ? 'العناصر (عربي) - واحد في كل سطر' : 'Items (Ar) - One per line'}
                        rows={4}
                        value={formData.itemsAr}
                        onChange={e => setFormData({ ...formData, itemsAr: e.target.value })}
                        dir="rtl"
                    />
                </div>

                <div className="flex gap-2">
                    {editingId && (
                        <button type="button" onClick={cancelEdit} className="px-6 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600">
                            {isAr ? 'إلغاء' : 'Cancel'}
                        </button>
                    )}
                    <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold flex items-center gap-2">
                        {editingId ? <FaSave /> : <FaPlus />}
                        {editingId ? (isAr ? 'تحديث' : 'Update') : (isAr ? 'إضافة فئة' : 'Add Category')}
                    </button>
                </div>
            </form>

            <style jsx>{`
                .input-field {
                    width: 100%;
                    padding: 0.75rem 1rem;
                    border-radius: 0.5rem;
                    border: 1px solid #d1d5db;
                    background-color: white;
                }
                :global(.dark) .input-field {
                    background-color: #1f2937;
                    border-color: #374151;
                    color: white;
                }
            `}</style>
        </div>
    )
}
