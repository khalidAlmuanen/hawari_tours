'use client'

import { useState, useEffect } from 'react'
import { useApp } from '@/contexts/AppContext'
import { motion, AnimatePresence } from 'framer-motion'

export default function BestTimeTab() {
    const { locale } = useApp()
    const isAr = locale === 'ar'

    const [loading, setLoading] = useState(true)
    const [formData, setFormData] = useState({
        sectionTitleAr: '',
        sectionTitleEn: '',
        sectionSubtitleAr: '',
        sectionSubtitleEn: '',
        headlineAr: '',
        headlineEn: '',
        headlineHighlightAr: '',
        headlineHighlightEn: '',
        peakSeasonAr: 'أكتوبر - مارس',
        peakSeasonEn: 'October - March',
        peakProsAr: '', // Newline separated
        peakProsEn: '',
        peakConsAr: '',
        peakConsEn: '',
        offSeasonAr: 'يونيو - سبتمبر',
        offSeasonEn: 'June - September',
        offProsAr: '',
        offProsEn: '',
        offConsAr: '',
        offConsEn: ''
    })

    useEffect(() => {
        fetchData()
    }, [])

    const fetchData = async () => {
        try {
            setLoading(true)
            const response = await fetch('/api/admin/travel-guide?section=time')
            const result = await response.json()
            if (result.success && result.data) {
                const data = result.data
                setFormData({
                    sectionTitleAr: data.sectionTitleAr || '',
                    sectionTitleEn: data.sectionTitleEn || '',
                    sectionSubtitleAr: data.sectionSubtitleAr || '',
                    sectionSubtitleEn: data.sectionSubtitleEn || '',
                    headlineAr: data.headlineAr || '',
                    headlineEn: data.headlineEn || '',
                    headlineHighlightAr: data.headlineHighlightAr || '',
                    headlineHighlightEn: data.headlineHighlightEn || '',
                    peakSeasonAr: data.peakSeasonAr || '',
                    peakSeasonEn: data.peakSeasonEn || '',
                    peakProsAr: data.peakProsAr?.join('\n') || '',
                    peakProsEn: data.peakProsEn?.join('\n') || '',
                    peakConsAr: data.peakConsAr?.join('\n') || '',
                    peakConsEn: data.peakConsEn?.join('\n') || '',
                    offSeasonAr: data.offSeasonAr || '',
                    offSeasonEn: data.offSeasonEn || '',
                    offProsAr: data.offProsAr?.join('\n') || '',
                    offProsEn: data.offProsEn?.join('\n') || '',
                    offConsAr: data.offConsAr?.join('\n') || '',
                    offConsEn: data.offConsEn?.join('\n') || ''
                })
            }
        } catch (error) {
            console.error('Error fetching best time data:', error)
        } finally {
            setLoading(false)
        }
    }

    const save = async (e) => {
        e.preventDefault()
        try {
            const dataToSave = {
                sectionTitleAr: formData.sectionTitleAr,
                sectionTitleEn: formData.sectionTitleEn,
                sectionSubtitleAr: formData.sectionSubtitleAr,
                sectionSubtitleEn: formData.sectionSubtitleEn,
                headlineAr: formData.headlineAr,
                headlineEn: formData.headlineEn,
                headlineHighlightAr: formData.headlineHighlightAr,
                headlineHighlightEn: formData.headlineHighlightEn,
                peakSeasonAr: formData.peakSeasonAr,
                peakSeasonEn: formData.peakSeasonEn,
                peakProsAr: formData.peakProsAr.split('\n').filter(Boolean),
                peakProsEn: formData.peakProsEn.split('\n').filter(Boolean),
                peakConsAr: formData.peakConsAr.split('\n').filter(Boolean),
                peakConsEn: formData.peakConsEn.split('\n').filter(Boolean),
                offSeasonAr: formData.offSeasonAr,
                offSeasonEn: formData.offSeasonEn,
                offProsAr: formData.offProsAr.split('\n').filter(Boolean),
                offProsEn: formData.offProsEn.split('\n').filter(Boolean),
                offConsAr: formData.offConsAr.split('\n').filter(Boolean),
                offConsEn: formData.offConsEn.split('\n').filter(Boolean)
            }

            const response = await fetch('/api/admin/travel-guide', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    section: 'time',
                    data: dataToSave
                })
            })

            const result = await response.json()
            if (result.success) {
                alert(isAr ? 'تم الحفظ!' : 'Saved!')
            }
        } catch (error) {
            console.error('Error saving:', error)
        }
    }

    if (loading) return <div className="text-center py-20">Loading...</div>

    return (
        <form onSubmit={save} className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
            <h3 className="text-xl font-bold mb-6 text-gray-900 dark:text-white">
                📅 {isAr ? 'أفضل وقت للزيارة' : 'Best Time to Visit'}
            </h3>

            <div className="grid md:grid-cols-2 gap-4 mb-10">
                <input
                    className="input-field"
                    placeholder="Section Title (En)"
                    value={formData.sectionTitleEn}
                    onChange={e => setFormData({ ...formData, sectionTitleEn: e.target.value })}
                />
                <input
                    className="input-field text-right"
                    placeholder="عنوان القسم (عربي)"
                    value={formData.sectionTitleAr}
                    onChange={e => setFormData({ ...formData, sectionTitleAr: e.target.value })}
                    dir="rtl"
                />
                <input
                    className="input-field"
                    placeholder="Section Subtitle (En)"
                    value={formData.sectionSubtitleEn}
                    onChange={e => setFormData({ ...formData, sectionSubtitleEn: e.target.value })}
                />
                <input
                    className="input-field text-right"
                    placeholder="الوصف (عربي)"
                    value={formData.sectionSubtitleAr}
                    onChange={e => setFormData({ ...formData, sectionSubtitleAr: e.target.value })}
                    dir="rtl"
                />
                <input
                    className="input-field"
                    placeholder="Headline (En)"
                    value={formData.headlineEn}
                    onChange={e => setFormData({ ...formData, headlineEn: e.target.value })}
                />
                <input
                    className="input-field text-right"
                    placeholder="العنوان الرئيسي (عربي)"
                    value={formData.headlineAr}
                    onChange={e => setFormData({ ...formData, headlineAr: e.target.value })}
                    dir="rtl"
                />
                <input
                    className="input-field"
                    placeholder="Headline Highlight (En)"
                    value={formData.headlineHighlightEn}
                    onChange={e => setFormData({ ...formData, headlineHighlightEn: e.target.value })}
                />
                <input
                    className="input-field text-right"
                    placeholder="تمييز العنوان (عربي)"
                    value={formData.headlineHighlightAr}
                    onChange={e => setFormData({ ...formData, headlineHighlightAr: e.target.value })}
                    dir="rtl"
                />
            </div>

            <div className="grid md:grid-cols-2 gap-12">
                {/* Peak Season */}
                <div className="space-y-6">
                    <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-xl border border-green-200 dark:border-green-800">
                        <h4 className="font-bold text-green-800 dark:text-green-300 mb-4 text-center text-lg">
                            {isAr ? 'موسم الذروة' : 'Peak Season'}
                        </h4>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="text-xs font-bold mb-1 block">Months (En)</label>
                                <input
                                    className="input-field"
                                    value={formData.peakSeasonEn}
                                    onChange={e => setFormData({ ...formData, peakSeasonEn: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold mb-1 block">Months (Ar)</label>
                                <input
                                    className="input-field text-right"
                                    value={formData.peakSeasonAr}
                                    onChange={e => setFormData({ ...formData, peakSeasonAr: e.target.value })}
                                    dir="rtl"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold mb-1 block">Pros (One per line) - En</label>
                                <textarea
                                    className="input-field h-32"
                                    value={formData.peakProsEn}
                                    onChange={e => setFormData({ ...formData, peakProsEn: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold mb-1 block">Pros (One per line) - Ar</label>
                                <textarea
                                    className="input-field h-32 text-right"
                                    value={formData.peakProsAr}
                                    onChange={e => setFormData({ ...formData, peakProsAr: e.target.value })}
                                    dir="rtl"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold mb-1 block">Cons (One per line) - En</label>
                                <textarea
                                    className="input-field h-24"
                                    value={formData.peakConsEn}
                                    onChange={e => setFormData({ ...formData, peakConsEn: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold mb-1 block">Cons (One per line) - Ar</label>
                                <textarea
                                    className="input-field h-24 text-right"
                                    value={formData.peakConsAr}
                                    onChange={e => setFormData({ ...formData, peakConsAr: e.target.value })}
                                    dir="rtl"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Off Season */}
                <div className="space-y-6">
                    <div className="bg-red-50 dark:bg-red-900/20 p-4 rounded-xl border border-red-200 dark:border-red-800">
                        <h4 className="font-bold text-red-800 dark:text-red-300 mb-4 text-center text-lg">
                            {isAr ? 'موسم منخفض' : 'Off Season'}
                        </h4>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div>
                                <label className="text-xs font-bold mb-1 block">Months (En)</label>
                                <input
                                    className="input-field"
                                    value={formData.offSeasonEn}
                                    onChange={e => setFormData({ ...formData, offSeasonEn: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold mb-1 block">Months (Ar)</label>
                                <input
                                    className="input-field text-right"
                                    value={formData.offSeasonAr}
                                    onChange={e => setFormData({ ...formData, offSeasonAr: e.target.value })}
                                    dir="rtl"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold mb-1 block">Pros (One per line) - En</label>
                                <textarea
                                    className="input-field h-32"
                                    value={formData.offProsEn}
                                    onChange={e => setFormData({ ...formData, offProsEn: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold mb-1 block">Pros (One per line) - Ar</label>
                                <textarea
                                    className="input-field h-32 text-right"
                                    value={formData.offProsAr}
                                    onChange={e => setFormData({ ...formData, offProsAr: e.target.value })}
                                    dir="rtl"
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold mb-1 block">Cons (One per line) - En</label>
                                <textarea
                                    className="input-field h-24"
                                    value={formData.offConsEn}
                                    onChange={e => setFormData({ ...formData, offConsEn: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="text-xs font-bold mb-1 block">Cons (One per line) - Ar</label>
                                <textarea
                                    className="input-field h-24 text-right"
                                    value={formData.offConsAr}
                                    onChange={e => setFormData({ ...formData, offConsAr: e.target.value })}
                                    dir="rtl"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-8">
                <button type="submit" className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg">
                    {isAr ? 'حفظ التغييرات' : 'Save Changes'}
                </button>
            </div>

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
        </form>
    )
}
