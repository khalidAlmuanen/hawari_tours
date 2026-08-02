'use client'

import { useState, useEffect } from 'react'
import { useApp } from '@/contexts/AppContext'
import { motion, AnimatePresence } from 'framer-motion'

export default function TransportTab() {
    const { locale } = useApp()
    const isAr = locale === 'ar'
    const gradientOptions = [
        { label: 'Blue', value: 'from-blue-500 to-indigo-600' },
        { label: 'Cyan', value: 'from-cyan-500 to-blue-600' },
        { label: 'Purple', value: 'from-purple-500 to-pink-600' },
        { label: 'Pink', value: 'from-pink-500 to-rose-600' },
        { label: 'Orange', value: 'from-orange-500 to-red-600' },
        { label: 'Yellow', value: 'from-yellow-500 to-orange-500' },
        { label: 'Green', value: 'from-green-500 to-emerald-600' },
        { label: 'Teal', value: 'from-teal-500 to-cyan-600' },
        { label: 'Red', value: 'from-red-500 to-red-700' },
        { label: 'Gray', value: 'from-gray-500 to-gray-700' }
    ]

    const [data, setData] = useState({ flights: [], local: [] })
    const [loading, setLoading] = useState(true)

    // Modal State
    const [showModal, setShowModal] = useState(false)
    const [modalType, setModalType] = useState('flight') // 'flight' or 'local'
    const [editingItem, setEditingItem] = useState(null)

    const [flightForm, setFlightForm] = useState({
        fromEn: '', fromAr: '',
        airline: '',
        duration: '',
        frequencyEn: '', frequencyAr: '',
        price: '',
        icon: '✈️',
        gradient: 'from-blue-500 to-indigo-600'
    })

    const [localForm, setLocalForm] = useState({
        typeEn: '', typeAr: '',
        descriptionEn: '', descriptionAr: '',
        priceEn: '', priceAr: '',
        icon: '🚙',
        gradient: 'from-green-500 to-emerald-600',
        featuresEn: '',
        featuresAr: ''
    })
    const [sectionSettings, setSectionSettings] = useState({
        sectionTitleEn: '',
        sectionTitleAr: '',
        flightsTitleEn: '',
        flightsTitleAr: '',
        flightsSubtitleEn: '',
        flightsSubtitleAr: '',
        localTitleEn: '',
        localTitleAr: '',
        flightTipsEn: '',
        flightTipsAr: ''
    })

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/admin/travel-guide?section=transport')
            const result = await response.json()
            if (result.success) {
                const payload = result.data || { flights: [], local: [] }
                setData({ flights: payload.flights || [], local: payload.local || [] })
                const tips = Array.isArray(payload.flightTips) ? payload.flightTips : []
                const tipsEn = tips.map(tip => tip.en || tip.textEn || tip.titleEn || (typeof tip === 'string' ? tip : '')).filter(Boolean)
                const tipsAr = tips.map(tip => tip.ar || tip.textAr || tip.titleAr || (typeof tip === 'string' ? tip : '')).filter(Boolean)
                setSectionSettings({
                    sectionTitleEn: payload.sectionTitleEn || '',
                    sectionTitleAr: payload.sectionTitleAr || '',
                    flightsTitleEn: payload.flightsTitleEn || '',
                    flightsTitleAr: payload.flightsTitleAr || '',
                    flightsSubtitleEn: payload.flightsSubtitleEn || '',
                    flightsSubtitleAr: payload.flightsSubtitleAr || '',
                    localTitleEn: payload.localTitleEn || '',
                    localTitleAr: payload.localTitleAr || '',
                    flightTipsEn: tipsEn.join('\n'),
                    flightTipsAr: tipsAr.join('\n')
                })
            }
        } catch (error) {
            console.error('Error fetching transport:', error)
        } finally {
            setLoading(false)
        }
    }

    const openModal = (type, item = null) => {
        setModalType(type)
        setEditingItem(item)

        if (type === 'flight') {
            if (item) {
                setFlightForm({
                    fromEn: item.fromEn || '', fromAr: item.fromAr || '',
                    airline: item.airline || '',
                    duration: item.duration || '',
                    frequencyEn: item.frequencyEn || '', frequencyAr: item.frequencyAr || '',
                    price: item.price || '',
                    icon: item.icon || '✈️',
                    gradient: item.gradient || 'from-blue-500 to-indigo-600'
                })
            } else {
                setFlightForm({
                    fromEn: '', fromAr: '',
                    airline: '',
                    duration: '',
                    frequencyEn: '', frequencyAr: '',
                    price: '',
                    icon: '✈️',
                    gradient: 'from-blue-500 to-indigo-600'
                })
            }
        } else {
            if (item) {
                const featuresEn = Array.isArray(item.features) ? item.features.map(feature => feature.en || feature.textEn || '').filter(Boolean) : []
                const featuresAr = Array.isArray(item.features) ? item.features.map(feature => feature.ar || feature.textAr || '').filter(Boolean) : []
                setLocalForm({
                    typeEn: item.typeEn || '', typeAr: item.typeAr || '',
                    descriptionEn: item.descriptionEn || '', descriptionAr: item.descriptionAr || '',
                    priceEn: item.priceEn || '', priceAr: item.priceAr || '',
                    icon: item.icon || '🚙',
                    gradient: item.gradient || 'from-green-500 to-emerald-600',
                    featuresEn: featuresEn.join('\n'),
                    featuresAr: featuresAr.join('\n')
                })
            } else {
                setLocalForm({
                    typeEn: '', typeAr: '',
                    descriptionEn: '', descriptionAr: '',
                    priceEn: '', priceAr: '',
                    icon: '🚙',
                    gradient: 'from-green-500 to-emerald-600',
                    featuresEn: '',
                    featuresAr: ''
                })
            }
        }
        setShowModal(true)
    }

    const save = async (e) => {
        e.preventDefault()
        const isFlight = modalType === 'flight'
        let formData = isFlight ? flightForm : localForm
        const category = isFlight ? 'flights' : 'local'

        try {
            const url = '/api/admin/travel-guide'
            let body
            let method

            if (!isFlight) {
                const featuresEn = localForm.featuresEn.split('\n').map(line => line.trim()).filter(Boolean)
                const featuresAr = localForm.featuresAr.split('\n').map(line => line.trim()).filter(Boolean)
                const max = Math.max(featuresEn.length, featuresAr.length)
                const features = Array.from({ length: max }).map((_, index) => ({
                    en: featuresEn[index] || featuresAr[index] || '',
                    ar: featuresAr[index] || featuresEn[index] || ''
                })).filter(feature => feature.en || feature.ar)
                formData = { ...localForm, features }
                delete formData.featuresEn
                delete formData.featuresAr
            }

            if (editingItem) {
                method = 'PUT'
                body = {
                    section: 'transport',
                    id: editingItem.id,
                    data: formData
                }
            } else {
                method = 'POST'
                body = {
                    section: 'transport',
                    data: {
                        category,
                        item: formData
                    }
                }
            }

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

    const deleteItem = async (id, category) => {
        if (!confirm(isAr ? 'هل أنت متأكد؟' : 'Are you sure?')) return
        try {
            await fetch(`/api/admin/travel-guide?section=transport&id=${id}&category=${category}`, {
                method: 'DELETE'
            })
            fetchData()
        } catch (error) {
            console.error('Error deleting:', error)
        }
    }

    const saveSectionSettings = async (e) => {
        e.preventDefault()
        try {
            const tipsEn = sectionSettings.flightTipsEn.split('\n').map(line => line.trim()).filter(Boolean)
            const tipsAr = sectionSettings.flightTipsAr.split('\n').map(line => line.trim()).filter(Boolean)
            const max = Math.max(tipsEn.length, tipsAr.length)
            const flightTips = Array.from({ length: max }).map((_, index) => ({
                en: tipsEn[index] || tipsAr[index] || '',
                ar: tipsAr[index] || tipsEn[index] || ''
            })).filter(tip => tip.en || tip.ar)

            const response = await fetch('/api/admin/travel-guide', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    section: 'transport',
                    data: {
                        sectionTitleEn: sectionSettings.sectionTitleEn,
                        sectionTitleAr: sectionSettings.sectionTitleAr,
                        flightsTitleEn: sectionSettings.flightsTitleEn,
                        flightsTitleAr: sectionSettings.flightsTitleAr,
                        flightsSubtitleEn: sectionSettings.flightsSubtitleEn,
                        flightsSubtitleAr: sectionSettings.flightsSubtitleAr,
                        localTitleEn: sectionSettings.localTitleEn,
                        localTitleAr: sectionSettings.localTitleAr,
                        flightTips
                    }
                })
            })

            const result = await response.json()
            if (result.success) {
                alert(isAr ? 'تم الحفظ!' : 'Saved!')
                fetchData()
            }
        } catch (error) {
            console.error('Error saving:', error)
        }
    }

    if (loading) return <div className="text-center py-20">Loading...</div>

    return (
        <div className="space-y-12">
            <form onSubmit={saveSectionSettings} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-md border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">
                    {isAr ? 'عناوين قسم النقل ونصائح الحجز' : 'Transport Titles & Booking Tips'}
                </h3>
                <div className="grid md:grid-cols-2 gap-4">
                    <input
                        className="input-field"
                        placeholder="Section Title (En)"
                        value={sectionSettings.sectionTitleEn}
                        onChange={e => setSectionSettings({ ...sectionSettings, sectionTitleEn: e.target.value })}
                    />
                    <input
                        className="input-field text-right"
                        placeholder="عنوان القسم (عربي)"
                        value={sectionSettings.sectionTitleAr}
                        onChange={e => setSectionSettings({ ...sectionSettings, sectionTitleAr: e.target.value })}
                        dir="rtl"
                    />
                    <input
                        className="input-field"
                        placeholder="Flights Title (En)"
                        value={sectionSettings.flightsTitleEn}
                        onChange={e => setSectionSettings({ ...sectionSettings, flightsTitleEn: e.target.value })}
                    />
                    <input
                        className="input-field text-right"
                        placeholder="عنوان الرحلات (عربي)"
                        value={sectionSettings.flightsTitleAr}
                        onChange={e => setSectionSettings({ ...sectionSettings, flightsTitleAr: e.target.value })}
                        dir="rtl"
                    />
                    <input
                        className="input-field"
                        placeholder="Flights Subtitle (En)"
                        value={sectionSettings.flightsSubtitleEn}
                        onChange={e => setSectionSettings({ ...sectionSettings, flightsSubtitleEn: e.target.value })}
                    />
                    <input
                        className="input-field text-right"
                        placeholder="وصف الرحلات (عربي)"
                        value={sectionSettings.flightsSubtitleAr}
                        onChange={e => setSectionSettings({ ...sectionSettings, flightsSubtitleAr: e.target.value })}
                        dir="rtl"
                    />
                    <input
                        className="input-field"
                        placeholder="Local Transport Title (En)"
                        value={sectionSettings.localTitleEn}
                        onChange={e => setSectionSettings({ ...sectionSettings, localTitleEn: e.target.value })}
                    />
                    <input
                        className="input-field text-right"
                        placeholder="عنوان النقل المحلي (عربي)"
                        value={sectionSettings.localTitleAr}
                        onChange={e => setSectionSettings({ ...sectionSettings, localTitleAr: e.target.value })}
                        dir="rtl"
                    />
                </div>
                <div className="grid md:grid-cols-2 gap-4 mt-6">
                    <textarea
                        className="input-field h-32"
                        placeholder="Booking Tips (En) - one per line"
                        value={sectionSettings.flightTipsEn}
                        onChange={e => setSectionSettings({ ...sectionSettings, flightTipsEn: e.target.value })}
                    />
                    <textarea
                        className="input-field h-32 text-right"
                        placeholder="نصائح الحجز (عربي) - كل سطر نصيحة"
                        value={sectionSettings.flightTipsAr}
                        onChange={e => setSectionSettings({ ...sectionSettings, flightTipsAr: e.target.value })}
                        dir="rtl"
                    />
                </div>
                <div className="mt-6 flex justify-end">
                    <button type="submit" className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700">
                        {isAr ? 'حفظ العناوين والنصائح' : 'Save Titles & Tips'}
                    </button>
                </div>
            </form>

            {/* ═══════════════════════════════════════════════════════════════
          Flights Section
          ═══════════════════════════════════════════════════════════════ */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        ✈️ {isAr ? 'الرحلات الجوية' : 'Flights'}
                    </h3>
                    <button
                        onClick={() => openModal('flight')}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        + {isAr ? 'إضافة رحلة' : 'Add Flight'}
                    </button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.flights?.map((flight) => (
                        <div key={flight.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700 relative group">
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => openModal('flight', flight)} className="p-1 bg-gray-100 hover:bg-gray-200 rounded">✏️</button>
                                <button onClick={() => deleteItem(flight.id, 'flights')} className="p-1 bg-red-100 hover:bg-red-200 rounded">🗑️</button>
                            </div>

                            <div className="flex items-center gap-4 mb-4">
                                <div className="text-4xl">{flight.icon}</div>
                                <div>
                                    <h4 className="font-bold">{isAr ? flight.fromAr : flight.fromEn}</h4>
                                    <p className="text-sm text-gray-500">{flight.airline}</p>
                                </div>
                            </div>

                            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                                <div className="flex justify-between">
                                    <span>{isAr ? 'المدة:' : 'Duration:'}</span>
                                    <span className="font-semibold">{flight.duration}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span>{isAr ? 'السعر:' : 'Price:'}</span>
                                    <span className="font-semibold">{flight.price}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                    {(!data.flights || data.flights.length === 0) && (
                        <div className="col-span-full text-center py-10 text-gray-500 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300">
                            {isAr ? 'لا توجد رحلات' : 'No flights added'}
                        </div>
                    )}
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
          Local Transport Section
          ═══════════════════════════════════════════════════════════════ */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                        🚙 {isAr ? 'النقل المحلي' : 'Local Transport'}
                    </h3>
                    <button
                        onClick={() => openModal('local')}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                        + {isAr ? 'إضافة نقل' : 'Add Transport'}
                    </button>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {data.local?.map((item) => (
                        <div key={item.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-md border border-gray-200 dark:border-gray-700 relative group">
                            <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => openModal('local', item)} className="p-1 bg-gray-100 hover:bg-gray-200 rounded">✏️</button>
                                <button onClick={() => deleteItem(item.id, 'local')} className="p-1 bg-red-100 hover:bg-red-200 rounded">🗑️</button>
                            </div>

                            <div className="flex items-center gap-4 mb-4">
                                <div className="text-4xl">{item.icon}</div>
                                <div>
                                    <h4 className="font-bold">{isAr ? item.typeAr : item.typeEn}</h4>
                                    <p className="text-xs text-green-600 font-bold">{isAr ? item.priceAr : item.priceEn}</p>
                                </div>
                            </div>

                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                {isAr ? item.descriptionAr : item.descriptionEn}
                            </p>
                        </div>
                    ))}
                    {(!data.local || data.local.length === 0) && (
                        <div className="col-span-full text-center py-10 text-gray-500 bg-gray-50 dark:bg-gray-800/50 rounded-xl border border-dashed border-gray-300">
                            {isAr ? 'لا يوجد خيارات نقل' : 'No transport options added'}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal */}
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
                            className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
                        >
                            <form onSubmit={save} className="max-h-[90vh] overflow-y-auto">
                                <div className="p-6 bg-gray-50 dark:bg-gray-900 border-b dark:border-gray-700">
                                    <h3 className="text-xl font-bold">
                                        {editingItem
                                            ? (isAr ? 'تعديل' : 'Edit')
                                            : (isAr ? 'إضافة جديد' : 'Add New')}
                                    </h3>
                                </div>

                                <div className="p-6 space-y-4">
                                    {modalType === 'flight' ? (
                                        <>
                                            <div className="grid grid-cols-2 gap-4">
                                                <input className="input-field" placeholder="From (En)" value={flightForm.fromEn} onChange={e => setFlightForm({ ...flightForm, fromEn: e.target.value })} required />
                                                <input className="input-field text-right" placeholder="من (عربي)" value={flightForm.fromAr} onChange={e => setFlightForm({ ...flightForm, fromAr: e.target.value })} required dir="rtl" />
                                            </div>
                                            <input className="input-field" placeholder="Airline" value={flightForm.airline} onChange={e => setFlightForm({ ...flightForm, airline: e.target.value })} required />
                                            <input className="input-field" placeholder="Duration (e.g. 2h 30m)" value={flightForm.duration} onChange={e => setFlightForm({ ...flightForm, duration: e.target.value })} required />
                                            <input className="input-field" placeholder="Price (e.g. $200)" value={flightForm.price} onChange={e => setFlightForm({ ...flightForm, price: e.target.value })} required />
                                            <div className="grid grid-cols-2 gap-4">
                                                <input className="input-field" placeholder="Frequency (En)" value={flightForm.frequencyEn} onChange={e => setFlightForm({ ...flightForm, frequencyEn: e.target.value })} required />
                                                <input className="input-field text-right" placeholder="التكرار (عربي)" value={flightForm.frequencyAr} onChange={e => setFlightForm({ ...flightForm, frequencyAr: e.target.value })} required dir="rtl" />
                                            </div>
                                            <input className="input-field text-center text-3xl" placeholder="Emoji Icon" value={flightForm.icon} onChange={e => setFlightForm({ ...flightForm, icon: e.target.value })} required />
                                            <div className="grid grid-cols-2 gap-4 items-center">
                                                <select
                                                    className="input-field"
                                                    value={flightForm.gradient}
                                                    onChange={e => setFlightForm({ ...flightForm, gradient: e.target.value })}
                                                    required
                                                >
                                                    {gradientOptions.map(option => (
                                                        <option key={option.value} value={option.value}>{option.label}</option>
                                                    ))}
                                                </select>
                                                <div className={`h-12 rounded-xl bg-gradient-to-r ${flightForm.gradient}`}></div>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="grid grid-cols-2 gap-4">
                                                <input className="input-field" placeholder="Type (En)" value={localForm.typeEn} onChange={e => setLocalForm({ ...localForm, typeEn: e.target.value })} required />
                                                <input className="input-field text-right" placeholder="النوع (عربي)" value={localForm.typeAr} onChange={e => setLocalForm({ ...localForm, typeAr: e.target.value })} required dir="rtl" />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <input className="input-field" placeholder="Price (En)" value={localForm.priceEn} onChange={e => setLocalForm({ ...localForm, priceEn: e.target.value })} required />
                                                <input className="input-field text-right" placeholder="السعر (عربي)" value={localForm.priceAr} onChange={e => setLocalForm({ ...localForm, priceAr: e.target.value })} required dir="rtl" />
                                            </div>
                                            <textarea className="input-field" placeholder="Description (En)" value={localForm.descriptionEn} onChange={e => setLocalForm({ ...localForm, descriptionEn: e.target.value })} required rows={3} />
                                            <textarea className="input-field text-right" placeholder="الوصف (عربي)" value={localForm.descriptionAr} onChange={e => setLocalForm({ ...localForm, descriptionAr: e.target.value })} required rows={3} dir="rtl" />
                                            <div className="grid grid-cols-2 gap-4">
                                                <textarea className="input-field" placeholder="Features (En) - one per line" value={localForm.featuresEn} onChange={e => setLocalForm({ ...localForm, featuresEn: e.target.value })} rows={3} />
                                                <textarea className="input-field text-right" placeholder="المزايا (عربي) - كل سطر ميزة" value={localForm.featuresAr} onChange={e => setLocalForm({ ...localForm, featuresAr: e.target.value })} rows={3} dir="rtl" />
                                            </div>
                                            <input className="input-field text-center text-3xl" placeholder="Emoji Icon" value={localForm.icon} onChange={e => setLocalForm({ ...localForm, icon: e.target.value })} required />
                                            <div className="grid grid-cols-2 gap-4 items-center">
                                                <select
                                                    className="input-field"
                                                    value={localForm.gradient}
                                                    onChange={e => setLocalForm({ ...localForm, gradient: e.target.value })}
                                                    required
                                                >
                                                    {gradientOptions.map(option => (
                                                        <option key={option.value} value={option.value}>{option.label}</option>
                                                    ))}
                                                </select>
                                                <div className={`h-12 rounded-xl bg-gradient-to-r ${localForm.gradient}`}></div>
                                            </div>
                                        </>
                                    )}
                                </div>

                                <div className="p-6 border-t dark:border-gray-700 flex gap-3">
                                    <button type="button" onClick={() => setShowModal(false)} className="flex-1 py-3 bg-gray-200 rounded-xl font-bold hover:bg-gray-300 text-gray-800">Cancel</button>
                                    <button type="submit" className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700">Save</button>
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
