'use client'

import { useState, useEffect } from 'react'
import { useApp } from '@/contexts/AppContext'
import { FaTrash, FaPlus, FaSave } from 'react-icons/fa'

export default function EmergencyTab() {
    const { locale } = useApp()
    const isAr = locale === 'ar'
    const emojiOptions = [
        '🚨', '🚑', '👮', '🚒', '🩺', '🏥', '🧯', '⚠️',
        '📞', '📟', '🆘', '🛟', '🚓', '🚁', '🚤', '🧭',
        '🧰', '🩹', '💊', '🩸', '⛑️', '🔒', '🧑‍⚕️', '🧑‍🚒'
    ]

    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)

    // Form
    const [formData, setFormData] = useState({
        nameEn: '', nameAr: '',
        number: '',
        icon: '🚨'
    })
    const [editingId, setEditingId] = useState(null)

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/admin/travel-guide?section=emergency')
            const result = await response.json()
            if (result.success) {
                setItems(result.data || [])
            }
        } catch (error) {
            console.error('Error fetching emergency contacts:', error)
        } finally {
            setLoading(false)
        }
    }

    const startEdit = (item) => {
        setEditingId(item.id)
        setFormData({
            nameEn: item.nameEn,
            nameAr: item.nameAr,
            number: item.number,
            icon: item.icon
        })
    }

    const cancelEdit = () => {
        setEditingId(null)
        setFormData({ nameEn: '', nameAr: '', number: '', icon: '🚨' })
    }

    const save = async (e) => {
        e.preventDefault()

        try {
            const url = '/api/admin/travel-guide'
            const method = editingId ? 'PUT' : 'POST'
            const body = editingId
                ? { section: 'emergency', id: editingId, data: formData }
                : { section: 'emergency', data: formData }

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
            await fetch(`/api/admin/travel-guide?section=emergency&id=${id}`, { method: 'DELETE' })
            fetchData()
        } catch (error) {
            console.error(error)
        }
    }

    if (loading) return <div>Loading...</div>

    return (
        <div className="space-y-8">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                🚨 {isAr ? 'أرقام الطوارئ' : 'Emergency Contacts'}
            </h3>

            <div className="grid md:grid-cols-3 gap-6">
                {items.map(item => (
                    <div key={item.id} className="bg-red-50 dark:bg-red-900/10 p-6 rounded-xl border border-red-200 dark:border-red-800 relative group text-center">
                        <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => startEdit(item)} className="p-1 bg-white text-blue-600 rounded shadow hover:bg-gray-100">✎</button>
                            <button onClick={() => deleteItem(item.id)} className="p-1 bg-white text-red-600 rounded shadow hover:bg-gray-100"><FaTrash /></button>
                        </div>

                        <div className="text-4xl mb-4">{item.icon}</div>
                        <h4 className="font-bold text-lg mb-1">{isAr ? item.nameAr : item.nameEn}</h4>
                        <p className="text-2xl font-bold text-red-600 dark:text-red-400" dir="ltr">{item.number}</p>
                    </div>
                ))}
            </div>

            {/* Form */}
            <form onSubmit={save} className="bg-white dark:bg-gray-800 p-6 rounded-xl border border-gray-200 dark:border-gray-700 max-w-2xl mx-auto">
                <h4 className="font-bold mb-4">{editingId ? (isAr ? 'تعديل جهة' : 'Edit Contact') : (isAr ? 'إضافة جهة جديدة' : 'Add New Contact')}</h4>

                <div className="grid grid-cols-2 gap-4 mb-4">
                    <input
                        className="input-field"
                        placeholder={isAr ? 'الاسم (إنجليزي)' : 'Name (En)'}
                        value={formData.nameEn}
                        onChange={e => setFormData({ ...formData, nameEn: e.target.value })}
                        required
                    />
                    <input
                        className="input-field text-right"
                        placeholder={isAr ? 'الاسم (عربي)' : 'Name (Ar)'}
                        value={formData.nameAr}
                        onChange={e => setFormData({ ...formData, nameAr: e.target.value })}
                        dir="rtl"
                        required
                    />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                    <input
                        className="input-field"
                        placeholder={isAr ? 'الرقم (مثال 199)' : 'Number (e.g. 199)'}
                        value={formData.number}
                        onChange={e => setFormData({ ...formData, number: e.target.value })}
                        required
                        dir="ltr"
                    />
                    <input
                        className="input-field text-center"
                        placeholder={isAr ? 'الأيقونة (إيموجي)' : 'Icon (Emoji)'}
                        value={formData.icon}
                        onChange={e => setFormData({ ...formData, icon: e.target.value })}
                        required
                    />
                </div>
                <div className="grid grid-cols-6 gap-2 max-h-40 overflow-y-auto pr-1 mb-6">
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

                <button type="submit" className="w-full py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 font-bold flex items-center justify-center gap-2">
                    {editingId ? <FaSave /> : <FaPlus />}
                    {editingId ? (isAr ? 'تحديث الجهة' : 'Update Contact') : (isAr ? 'إضافة جهة' : 'Add Contact')}
                </button>
                {editingId && (
                    <button type="button" onClick={cancelEdit} className="w-full mt-2 py-2 text-gray-500 hover:text-gray-700">{isAr ? 'إلغاء' : 'Cancel'}</button>
                )}
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
