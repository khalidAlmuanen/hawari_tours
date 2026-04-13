'use client'

import { useState, useEffect } from 'react'
import { useApp } from '@/contexts/AppContext'
import { motion, AnimatePresence } from 'framer-motion'

export default function AccommodationTab() {
    const { locale } = useApp()
    const isAr = locale === 'ar'
    const gradientOptions = [
        { value: 'from-blue-500 to-indigo-600', label: 'Blue → Indigo', preview: 'bg-gradient-to-r from-blue-500 to-indigo-600' },
        { value: 'from-cyan-500 to-blue-600', label: 'Cyan → Blue', preview: 'bg-gradient-to-r from-cyan-500 to-blue-600' },
        { value: 'from-purple-500 to-pink-600', label: 'Purple → Pink', preview: 'bg-gradient-to-r from-purple-500 to-pink-600' },
        { value: 'from-pink-500 to-rose-600', label: 'Pink → Rose', preview: 'bg-gradient-to-r from-pink-500 to-rose-600' },
        { value: 'from-orange-500 to-red-600', label: 'Orange → Red', preview: 'bg-gradient-to-r from-orange-500 to-red-600' },
        { value: 'from-yellow-500 to-orange-500', label: 'Yellow → Orange', preview: 'bg-gradient-to-r from-yellow-500 to-orange-500' },
        { value: 'from-green-500 to-emerald-600', label: 'Green → Emerald', preview: 'bg-gradient-to-r from-green-500 to-emerald-600' },
        { value: 'from-teal-500 to-cyan-600', label: 'Teal → Cyan', preview: 'bg-gradient-to-r from-teal-500 to-cyan-600' },
        { value: 'from-red-500 to-red-700', label: 'Red → Dark Red', preview: 'bg-gradient-to-r from-red-500 to-red-700' },
        { value: 'from-gray-500 to-gray-700', label: 'Gray → Dark Gray', preview: 'bg-gradient-to-r from-gray-500 to-gray-700' }
    ]

    const [items, setItems] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editingItem, setEditingItem] = useState(null)

    const [formData, setFormData] = useState({
        typeEn: '', typeAr: '',
        descriptionEn: '', descriptionAr: '',
        priceEn: '', priceAr: '',
        rating: 3,
        icon: '🏨',
        gradient: 'from-blue-500 to-indigo-600',
        featuresEn: '', // Newline separated
        featuresAr: '', // Newline separated
        examples: []
    })

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/admin/travel-guide?section=accommodation')
            const result = await response.json()
            if (result.success) {
                setItems(result.data || [])
            }
        } catch (error) {
            console.error('Error fetching accommodation:', error)
        } finally {
            setLoading(false)
        }
    }

    const openModal = (item = null) => {
        if (item) {
            setEditingItem(item)
            const examples = Array.isArray(item.examples)
                ? item.examples.map(example => ({
                    nameEn: example.nameEn || example.name || '',
                    nameAr: example.nameAr || example.name || '',
                    locationEn: example.locationEn || example.location || '',
                    locationAr: example.locationAr || example.location || '',
                    stars: example.stars || ''
                }))
                : []
            setFormData({
                typeEn: item.typeEn, typeAr: item.typeAr,
                descriptionEn: item.descriptionEn, descriptionAr: item.descriptionAr,
                priceEn: item.priceEn, priceAr: item.priceAr,
                rating: item.rating,
                icon: item.icon,
                gradient: item.gradient,
                featuresEn: item.features?.map(f => f.en).join('\n') || '',
                featuresAr: item.features?.map(f => f.ar).join('\n') || '',
                examples
            })
        } else {
            setEditingItem(null)
            setFormData({
                typeEn: '', typeAr: '',
                descriptionEn: '', descriptionAr: '',
                priceEn: '', priceAr: '',
                rating: 3,
                icon: '🏨',
                gradient: 'from-blue-500 to-indigo-600',
                featuresEn: '',
                featuresAr: '',
                examples: []
            })
        }
        setShowModal(true)
    }

    const save = async (e) => {
        e.preventDefault()

        // Process Arrays
        const featuresListEn = formData.featuresEn.split('\n').filter(f => f.trim())
        const featuresListAr = formData.featuresAr.split('\n').filter(f => f.trim())

        // Combine features into objects { en, ar, icon } - icon logic is tricky, maybe just use generic checkmark
        const features = featuresListEn.map((en, i) => ({
            en,
            ar: featuresListAr[i] || en,
            icon: '✅'
        }))

        const examples = formData.examples
            .filter(example => example.nameEn || example.nameAr || example.locationEn || example.locationAr)
            .map(example => ({
                nameEn: example.nameEn || '',
                nameAr: example.nameAr || '',
                locationEn: example.locationEn || '',
                locationAr: example.locationAr || '',
                stars: example.stars ? parseInt(example.stars) : null
            }))

        const dataToSave = {
            ...formData,
            features,
            examples,
            // remove temp fields
            featuresEn: undefined,
            featuresAr: undefined
        }

        try {
            const url = '/api/admin/travel-guide'
            const method = editingItem ? 'PUT' : 'POST'
            const body = editingItem
                ? { section: 'accommodation', id: editingItem.id, data: dataToSave }
                : { section: 'accommodation', data: dataToSave }

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
            await fetch(`/api/admin/travel-guide?section=accommodation&id=${id}`, {
                method: 'DELETE'
            })
            fetchData()
        } catch (error) {
            console.error('Error deleting:', error)
        }
    }

    if (loading) return <div className="text-center py-20">Loading...</div>

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    🏨 {isAr ? 'خيارات الإقامة' : 'Accommodation Options'}
                </h3>
                <button
                    onClick={() => openModal()}
                    className="px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-lg hover:shadow-lg"
                >
                    + {isAr ? 'إضافة خيار' : 'Add Option'}
                </button>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
                {items.map((item) => (
                    <div key={item.id} className={`bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 shadow-lg border border-gray-200 dark:border-gray-700 relative group`}>
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => openModal(item)} className="p-1 bg-gray-100 hover:bg-gray-200 rounded">✏️</button>
                            <button onClick={() => deleteItem(item.id)} className="p-1 bg-red-100 hover:bg-red-200 rounded">🗑️</button>
                        </div>

                        <div className="flex items-center gap-4 mb-4">
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl bg-gradient-to-br ${item.gradient} text-white`}>
                                {item.icon}
                            </div>
                            <div>
                                <h4 className="font-bold text-xl">{isAr ? item.typeAr : item.typeEn}</h4>
                                <p className="text-sm font-bold text-green-600">{isAr ? item.priceAr : item.priceEn}</p>
                                <div className="flex text-yellow-400 text-xs mt-1">
                                    {'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}
                                </div>
                            </div>
                        </div>

                        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                            {isAr ? item.descriptionAr : item.descriptionEn}
                        </p>

                        <div className="flex flex-wrap gap-2">
                            {item.features?.slice(0, 3).map((f, i) => (
                                <span key={i} className="text-xs bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                                    {isAr ? f.ar : f.en}
                                </span>
                            ))}
                            {(item.features?.length > 3) && <span className="text-xs px-2 py-1">+{item.features.length - 3}</span>}
                        </div>
                    </div>
                ))}
            </div>

            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9 }} animate={{ scale: 1 }} exit={{ scale: 0.9 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
                        >
                            <form onSubmit={save} className="p-6 space-y-4">
                                <h3 className="text-xl font-bold mb-4">{editingItem ? 'Edit' : 'Add Check'}</h3>

                                <div className="grid grid-cols-2 gap-4">
                                    <input className="input-field" placeholder="Type (En)" value={formData.typeEn} onChange={e => setFormData({ ...formData, typeEn: e.target.value })} required />
                                    <input className="input-field text-right" placeholder="النوع (عربي)" value={formData.typeAr} onChange={e => setFormData({ ...formData, typeAr: e.target.value })} required dir="rtl" />
                                </div>

                                <textarea className="input-field" placeholder="Description (En)" value={formData.descriptionEn} onChange={e => setFormData({ ...formData, descriptionEn: e.target.value })} required rows={2} />
                                <textarea className="input-field text-right" placeholder="الوصف (عربي)" value={formData.descriptionAr} onChange={e => setFormData({ ...formData, descriptionAr: e.target.value })} required rows={2} dir="rtl" />

                                <div className="grid grid-cols-3 gap-4">
                                    <input className="input-field" placeholder="Price (En)" value={formData.priceEn} onChange={e => setFormData({ ...formData, priceEn: e.target.value })} required />
                                    <input className="input-field text-right" placeholder="السعر (عربي)" value={formData.priceAr} onChange={e => setFormData({ ...formData, priceAr: e.target.value })} required dir="rtl" />
                                    <select className="input-field" value={formData.rating} onChange={e => setFormData({ ...formData, rating: parseInt(e.target.value) })} required>
                                        {[1, 2, 3, 4, 5].map(value => (
                                            <option key={value} value={value}>{value} {value === 1 ? 'Star' : 'Stars'}</option>
                                        ))}
                                    </select>
                                </div>

                                <input className="input-field text-center text-3xl" placeholder="Emoji Icon" value={formData.icon} onChange={e => setFormData({ ...formData, icon: e.target.value })} required />

                                <div>
                                    <label className="text-sm font-bold mb-2 block">{isAr ? 'التدرج اللوني' : 'Gradient'}</label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {gradientOptions.map((option) => (
                                            <button
                                                key={option.value}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, gradient: option.value })}
                                                className={`relative h-14 rounded-xl ${option.preview} ${formData.gradient === option.value ? 'ring-4 ring-blue-500' : ''}`}
                                            >
                                                {formData.gradient === option.value && (
                                                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-xl">
                                                        <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                        </svg>
                                                    </div>
                                                )}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="text-sm font-bold mb-1 block">Features (En) - One per line</label>
                                        <textarea className="input-field" rows={5} value={formData.featuresEn} onChange={e => setFormData({ ...formData, featuresEn: e.target.value })} />
                                    </div>
                                    <div>
                                        <label className="text-sm font-bold mb-1 block">Attributes (Ar) - One per line</label>
                                        <textarea className="input-field text-right" rows={5} value={formData.featuresAr} onChange={e => setFormData({ ...formData, featuresAr: e.target.value })} dir="rtl" />
                                    </div>
                                </div>

                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <label className="text-sm font-bold">Examples</label>
                                        <button
                                            type="button"
                                            onClick={() => setFormData({
                                                ...formData,
                                                examples: [
                                                    ...formData.examples,
                                                    { nameEn: '', nameAr: '', locationEn: '', locationAr: '', stars: '' }
                                                ]
                                            })}
                                            className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 rounded"
                                        >
                                            + {isAr ? 'إضافة مثال' : 'Add Example'}
                                        </button>
                                    </div>
                                    {formData.examples.length === 0 && (
                                        <div className="text-xs text-gray-500">{isAr ? 'لا توجد أمثلة مضافة' : 'No examples added'}</div>
                                    )}
                                    <div className="space-y-3">
                                        {formData.examples.map((example, index) => (
                                            <div key={index} className="grid grid-cols-2 gap-3 p-3 rounded-lg border border-gray-200 dark:border-gray-700">
                                                <input
                                                    className="input-field"
                                                    placeholder="Name (En)"
                                                    value={example.nameEn}
                                                    onChange={e => {
                                                        const updated = [...formData.examples]
                                                        updated[index] = { ...updated[index], nameEn: e.target.value }
                                                        setFormData({ ...formData, examples: updated })
                                                    }}
                                                />
                                                <input
                                                    className="input-field text-right"
                                                    placeholder="الاسم (عربي)"
                                                    value={example.nameAr}
                                                    onChange={e => {
                                                        const updated = [...formData.examples]
                                                        updated[index] = { ...updated[index], nameAr: e.target.value }
                                                        setFormData({ ...formData, examples: updated })
                                                    }}
                                                    dir="rtl"
                                                />
                                                <input
                                                    className="input-field"
                                                    placeholder="Location (En)"
                                                    value={example.locationEn}
                                                    onChange={e => {
                                                        const updated = [...formData.examples]
                                                        updated[index] = { ...updated[index], locationEn: e.target.value }
                                                        setFormData({ ...formData, examples: updated })
                                                    }}
                                                />
                                                <input
                                                    className="input-field text-right"
                                                    placeholder="الموقع (عربي)"
                                                    value={example.locationAr}
                                                    onChange={e => {
                                                        const updated = [...formData.examples]
                                                        updated[index] = { ...updated[index], locationAr: e.target.value }
                                                        setFormData({ ...formData, examples: updated })
                                                    }}
                                                    dir="rtl"
                                                />
                                                <select
                                                    className="input-field col-span-2"
                                                    value={example.stars}
                                                    onChange={e => {
                                                        const updated = [...formData.examples]
                                                        updated[index] = { ...updated[index], stars: e.target.value }
                                                        setFormData({ ...formData, examples: updated })
                                                    }}
                                                >
                                                    <option value="">{isAr ? 'بدون نجوم' : 'No Stars'}</option>
                                                    {[1, 2, 3, 4, 5].map(value => (
                                                        <option key={value} value={value}>{value} {value === 1 ? 'Star' : 'Stars'}</option>
                                                    ))}
                                                </select>
                                                <div className="col-span-2 flex justify-end">
                                                    <button
                                                        type="button"
                                                        onClick={() => {
                                                            const updated = formData.examples.filter((_, i) => i !== index)
                                                            setFormData({ ...formData, examples: updated })
                                                        }}
                                                        className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded"
                                                    >
                                                        {isAr ? 'حذف' : 'Remove'}
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 bg-gray-200 rounded-xl font-bold">Cancel</button>
                                    <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold">Save</button>
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
