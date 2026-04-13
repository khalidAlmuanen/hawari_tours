'use client'

import { use, useEffect, useMemo, useState } from 'react'
import { useApp } from '@/contexts/AppContext'
import AdminLayout from '@/components/admin/AdminLayout'
import { useToast } from '@/components/admin/Toast'
import { motion } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import ImageUploader from '@/components/admin/ImageUploader'
import { AMENITIES } from '@/utils/hotelConstants'

const EMPTY_FORM = {
  name: '',
  nameAr: '',
  slug: '',
  description: '',
  descriptionAr: '',
  shortDescription: '',
  shortDescriptionAr: '',
  pricePerNight: '',
  discount: '0',
  rating: '0',
  reviewsCount: '0',
  roomsCount: '0',
  status: 'ACTIVE',
  featured: false,
  coverImage: '',
  images: [],
  videoUrl: '',
  location: '',
  locationAr: '',
  latitude: '',
  longitude: '',
  amenities: [],
  amenitiesAr: [],
  highlights: [],
  highlightsAr: [],
  checkInTime: '',
  checkOutTime: '',
  cancellationPolicy: '',
  cancellationPolicyAr: '',
  metaTitle: '',
  metaDescription: '',
  keywords: []
}

export default function AdminHotelDetails({ params }) {
  const { locale } = useApp()
  const { success, error: showError } = useToast()
  const isAr = locale === 'ar'
  const { id } = use(params)

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [formData, setFormData] = useState(EMPTY_FORM)
  const [error, setError] = useState(null)

  const [newAmenity, setNewAmenity] = useState('')
  const [newAmenityAr, setNewAmenityAr] = useState('')
  const [newHighlight, setNewHighlight] = useState('')
  const [newHighlightAr, setNewHighlightAr] = useState('')
  const [newKeyword, setNewKeyword] = useState('')

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        setLoading(true)
        setError(null)
        const res = await fetch(`/api/admin/hotels/${id}`)
        const data = await res.json()
        if (data.success) {
          const hotel = data.data
          setFormData({
            name: hotel.name || '',
            nameAr: hotel.nameAr || '',
            slug: hotel.slug || '',
            description: hotel.description || '',
            descriptionAr: hotel.descriptionAr || '',
            shortDescription: hotel.shortDescription || '',
            shortDescriptionAr: hotel.shortDescriptionAr || '',
            pricePerNight: hotel.pricePerNight?.toString() || '',
            discount: hotel.discount?.toString() || '0',
            rating: hotel.rating?.toString() || '0',
            reviewsCount: hotel.reviewsCount?.toString() || '0',
            roomsCount: hotel.roomsCount?.toString() || '0',
            status: hotel.status || 'ACTIVE',
            featured: !!hotel.featured,
            coverImage: hotel.coverImage || '',
            images: hotel.images || [],
            videoUrl: hotel.videoUrl || '',
            location: hotel.location || '',
            locationAr: hotel.locationAr || '',
            latitude: hotel.latitude?.toString() || '',
            longitude: hotel.longitude?.toString() || '',
            amenities: hotel.amenities || [],
            amenitiesAr: hotel.amenitiesAr || [],
            highlights: hotel.highlights || [],
            highlightsAr: hotel.highlightsAr || [],
            checkInTime: hotel.checkInTime || '',
            checkOutTime: hotel.checkOutTime || '',
            cancellationPolicy: hotel.cancellationPolicy || '',
            cancellationPolicyAr: hotel.cancellationPolicyAr || '',
            metaTitle: hotel.metaTitle || '',
            metaDescription: hotel.metaDescription || '',
            keywords: hotel.keywords || []
          })
        } else {
          setError(data.error || 'Hotel not found')
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchHotel()
  }, [id])

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const toggleAmenity = (id) => {
    setFormData((prev) => {
      const isSelected = prev.amenities.includes(id)
      const newAmenities = isSelected
        ? prev.amenities.filter((i) => i !== id)
        : [...prev.amenities, id]
      return { ...prev, amenities: newAmenities, amenitiesAr: newAmenities }
    })
  }

  const handleAddHighlight = () => {
    if (!newHighlight.trim()) return
    setFormData((prev) => ({ ...prev, highlights: [...prev.highlights, newHighlight.trim()] }))
    setNewHighlight('')
  }

  const handleAddHighlightAr = () => {
    if (!newHighlightAr.trim()) return
    setFormData((prev) => ({ ...prev, highlightsAr: [...prev.highlightsAr, newHighlightAr.trim()] }))
    setNewHighlightAr('')
  }

  const handleAddKeyword = () => {
    if (!newKeyword.trim()) return
    setFormData((prev) => ({ ...prev, keywords: [...prev.keywords, newKeyword.trim()] }))
    setNewKeyword('')
  }

  const handleRemoveItem = (field, index) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }))
  }

  const handleCoverUpload = (url) => handleFormChange('coverImage', url)

  const handleGalleryUpload = (urls) => {
    const incoming = Array.isArray(urls) ? urls : [urls]
    handleFormChange('images', [...formData.images, ...incoming])
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      const body = {
        id,
        ...formData,
        pricePerNight: formData.pricePerNight === '' ? null : parseFloat(formData.pricePerNight),
        discount: formData.discount === '' ? 0 : parseFloat(formData.discount),
        rating: formData.rating === '' ? 0 : parseFloat(formData.rating),
        reviewsCount: formData.reviewsCount === '' ? 0 : parseInt(formData.reviewsCount),
        roomsCount: formData.roomsCount === '' ? 0 : parseInt(formData.roomsCount),
        latitude: formData.latitude === '' ? null : parseFloat(formData.latitude),
        longitude: formData.longitude === '' ? null : parseFloat(formData.longitude),
      }

      const res = await fetch('/api/admin/hotels', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })
      const data = await res.json()
      if (data.success) {
        success(isAr ? 'تم حفظ التغييرات بنجاح' : 'Changes saved successfully')
      } else {
        showError(data.error || 'Failed to save')
      }
    } catch (err) {
      showError(err.message)
    } finally {
      setSaving(false)
    }
  }

  const previewSlug = formData.slug || ''
  const previewUrl = previewSlug ? `/hotels/${previewSlug}` : '/hotels'

  if (loading) {
    return (
      <AdminLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-24 w-24 border-8 border-emerald-200 dark:border-emerald-800 border-t-emerald-600 dark:border-t-emerald-400 mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {isAr ? 'جاري تحميل تفاصيل الفندق...' : 'Loading hotel details...'}
            </h2>
          </div>
        </div>
      </AdminLayout>
    )
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="bg-white dark:bg-gray-900 border border-rose-200 dark:border-rose-800 rounded-3xl p-10 text-center shadow-xl max-w-lg">
            <div className="text-5xl mb-4">🏨</div>
            <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-3">
              {isAr ? 'تعذر تحميل الفندق' : 'Unable to load hotel'}
            </h2>
            <p className="mb-6">{error}</p>
            <Link
              href="/admin/hotels"
              className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-bold shadow-lg"
            >
              {isAr ? 'العودة للفنادق' : 'Back to hotels'}
            </Link>
          </div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <form onSubmit={handleSave} className="space-y-8 pb-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-gray-900 via-emerald-900 to-cyan-900 p-10 text-white shadow-2xl"
        >
          <div className="absolute -right-16 -top-16 h-52 w-52 rounded-full bg-emerald-400/20 blur-3xl" />
          <div className="absolute -left-10 -bottom-10 h-48 w-48 rounded-full bg-cyan-400/20 blur-3xl" />
          <div className="relative z-10 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-3 rounded-full bg-white/10 px-5 py-2 text-sm font-semibold">
                <span className="text-lg">🏨</span>
                {isAr ? 'تحكم احترافي بتفاصيل الفندق' : 'Hotel Detail Control'}
              </div>
              <h1 className="mt-5 text-4xl font-black">{isAr ? 'إدارة تفاصيل الفندق' : 'Hotel Details Manager'}</h1>
              <p className="mt-3 text-white/80 max-w-2xl">
                {isAr ? 'تحرير كامل لكل البيانات، الصور، السياسات، والأسعار بشكل احترافي.' : 'Edit content, media, policies, and pricing in one premium console.'}
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link
                href={previewUrl}
                className="px-6 py-3 rounded-2xl bg-white text-gray-900 font-black shadow-xl hover:shadow-2xl transition-all"
              >
                {isAr ? 'معاينة الفندق' : 'Preview hotel'}
              </Link>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white font-black shadow-xl disabled:opacity-60"
              >
                {saving ? (isAr ? 'جارٍ الحفظ...' : 'Saving...') : (isAr ? 'حفظ التغييرات' : 'Save changes')}
              </button>
            </div>
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-xl font-black text-gray-900 dark:text-white">{isAr ? 'المعلومات الأساسية' : 'Basic info'}</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                value={formData.name}
                onChange={(e) => handleFormChange('name', e.target.value)}
                placeholder={isAr ? 'اسم الفندق (إنجليزي)' : 'Hotel name (EN)'}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <input
                value={formData.nameAr}
                onChange={(e) => handleFormChange('nameAr', e.target.value)}
                placeholder={isAr ? 'اسم الفندق (عربي)' : 'Hotel name (AR)'}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <input
                value={formData.slug}
                onChange={(e) => handleFormChange('slug', e.target.value)}
                placeholder={isAr ? 'المسار (slug)' : 'Slug'}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <input
                value={formData.location}
                onChange={(e) => handleFormChange('location', e.target.value)}
                placeholder={isAr ? 'الموقع (EN)' : 'Location (EN)'}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <input
                value={formData.locationAr}
                onChange={(e) => handleFormChange('locationAr', e.target.value)}
                placeholder={isAr ? 'الموقع (AR)' : 'Location (AR)'}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <textarea
              value={formData.shortDescription}
              onChange={(e) => handleFormChange('shortDescription', e.target.value)}
              placeholder={isAr ? 'وصف مختصر (EN)' : 'Short description (EN)'}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white min-h-[120px]"
            />
            <textarea
              value={formData.shortDescriptionAr}
              onChange={(e) => handleFormChange('shortDescriptionAr', e.target.value)}
              placeholder={isAr ? 'وصف مختصر (AR)' : 'Short description (AR)'}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white min-h-[120px]"
            />
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-xl font-black text-gray-900 dark:text-white">{isAr ? 'الأسعار والإحصائيات' : 'Pricing & stats'}</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                type="number"
                value={formData.pricePerNight}
                onChange={(e) => handleFormChange('pricePerNight', e.target.value)}
                placeholder={isAr ? 'السعر لليلة' : 'Price per night'}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <input
                type="number"
                value={formData.discount}
                onChange={(e) => handleFormChange('discount', e.target.value)}
                placeholder={isAr ? 'الخصم (%)' : 'Discount (%)'}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <input
                type="number"
                value={formData.rating}
                onChange={(e) => handleFormChange('rating', e.target.value)}
                placeholder={isAr ? 'التقييم' : 'Rating'}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <input
                type="number"
                value={formData.reviewsCount}
                onChange={(e) => handleFormChange('reviewsCount', e.target.value)}
                placeholder={isAr ? 'عدد التقييمات' : 'Reviews count'}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <input
                type="number"
                value={formData.roomsCount}
                onChange={(e) => handleFormChange('roomsCount', e.target.value)}
                placeholder={isAr ? 'عدد الغرف' : 'Rooms count'}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <select
                value={formData.status}
                onChange={(e) => handleFormChange('status', e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
              >
                <option value="ACTIVE">{isAr ? 'نشط' : 'Active'}</option>
                <option value="DRAFT">{isAr ? 'مسودة' : 'Draft'}</option>
                <option value="SUSPENDED">{isAr ? 'موقوف' : 'Suspended'}</option>
              </select>
              <label className="flex items-center gap-3 text-sm font-semibold text-gray-700 dark:text-gray-200">
                <input
                  type="checkbox"
                  checked={formData.featured}
                  onChange={(e) => handleFormChange('featured', e.target.checked)}
                  className="w-5 h-5 rounded"
                />
                {isAr ? 'تمييز الفندق' : 'Featured hotel'}
              </label>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-xl font-black text-gray-900 dark:text-white">{isAr ? 'وصف الفندق الكامل' : 'Full description'}</h3>
            <textarea
              value={formData.description}
              onChange={(e) => handleFormChange('description', e.target.value)}
              placeholder={isAr ? 'الوصف (EN)' : 'Description (EN)'}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white min-h-[180px]"
            />
            <textarea
              value={formData.descriptionAr}
              onChange={(e) => handleFormChange('descriptionAr', e.target.value)}
              placeholder={isAr ? 'الوصف (AR)' : 'Description (AR)'}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white min-h-[180px]"
            />
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-xl font-black text-gray-900 dark:text-white">{isAr ? 'الوسائط' : 'Media'}</h3>
            <ImageUploader
              value={formData.coverImage}
              onChange={(val) => handleFormChange('coverImage', val || '')}
              multiple={false}
              label={isAr ? 'صورة الغلاف' : 'Cover image'}
            />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {formData.images.map((img, index) => (
                <div key={img} className="relative h-28 rounded-2xl overflow-hidden">
                  <Image src={img} alt={`gallery-${index}`} fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveItem('images', index)}
                    className="absolute top-2 right-2 bg-black/60 text-white rounded-full w-7 h-7 flex items-center justify-center"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <ImageUploader onUploadProp={handleGalleryUpload} multiple={true} label={isAr ? 'إضافة صور المعرض' : 'Add gallery images'} />
            <input
              type="url"
              value={formData.videoUrl}
              onChange={(e) => handleFormChange('videoUrl', e.target.value)}
              placeholder={isAr ? 'رابط الفيديو' : 'Video URL'}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-1 gap-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-xl font-black text-gray-900 dark:text-white">{isAr ? 'الخدمات الفندقية' : 'Hotel Amenities'}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4">
              {AMENITIES.map((item) => {
                const isSelected = formData.amenities.includes(item.id)
                return (
                  <label key={item.id} className={`flex flex-col items-center justify-center gap-2 p-4 rounded-2xl border cursor-pointer transition-all text-center ${isSelected ? 'bg-emerald-50 border-emerald-500 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300' : 'border-gray-200 dark:border-gray-700 hover:border-emerald-400'}`}>
                    <input
                      type="checkbox"
                      className="hidden"
                      checked={isSelected}
                      onChange={() => toggleAmenity(item.id)}
                    />
                    <span className="text-3xl">{item.icon}</span>
                    <span className="font-semibold text-sm">{item.label[locale]}</span>
                  </label>
                )
              })}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-xl font-black text-gray-900 dark:text-white">{isAr ? 'المميزات (EN)' : 'Highlights (EN)'}</h3>
            <div className="flex gap-2">
              <input
                value={newHighlight}
                onChange={(e) => setNewHighlight(e.target.value)}
                placeholder={isAr ? 'أضف ميزة بالإنجليزية' : 'Add highlight (EN)'}
                className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <button
                type="button"
                onClick={handleAddHighlight}
                className="px-5 py-3 rounded-2xl bg-cyan-500 text-white font-bold"
              >
                +
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.highlights.map((item, index) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => handleRemoveItem('highlights', index)}
                  className="px-3 py-2 rounded-full bg-cyan-50 text-cyan-700"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-xl font-black text-gray-900 dark:text-white">{isAr ? 'المميزات (AR)' : 'Highlights (AR)'}</h3>
            <div className="flex gap-2">
              <input
                value={newHighlightAr}
                onChange={(e) => setNewHighlightAr(e.target.value)}
                placeholder={isAr ? 'أضف ميزة بالعربية' : 'Add highlight (AR)'}
                className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <button
                type="button"
                onClick={handleAddHighlightAr}
                className="px-5 py-3 rounded-2xl bg-cyan-500 text-white font-bold"
              >
                +
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.highlightsAr.map((item, index) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => handleRemoveItem('highlightsAr', index)}
                  className="px-3 py-2 rounded-full bg-cyan-50 text-cyan-700"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-xl font-black text-gray-900 dark:text-white">{isAr ? 'السياسات والتوقيت' : 'Policies & timing'}</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <input
                value={formData.checkInTime}
                onChange={(e) => handleFormChange('checkInTime', e.target.value)}
                placeholder={isAr ? 'وقت الوصول' : 'Check-in time'}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <input
                value={formData.checkOutTime}
                onChange={(e) => handleFormChange('checkOutTime', e.target.value)}
                placeholder={isAr ? 'وقت المغادرة' : 'Check-out time'}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
            <textarea
              value={formData.cancellationPolicy}
              onChange={(e) => handleFormChange('cancellationPolicy', e.target.value)}
              placeholder={isAr ? 'سياسة الإلغاء (EN)' : 'Cancellation policy (EN)'}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white min-h-[120px]"
            />
            <textarea
              value={formData.cancellationPolicyAr}
              onChange={(e) => handleFormChange('cancellationPolicyAr', e.target.value)}
              placeholder={isAr ? 'سياسة الإلغاء (AR)' : 'Cancellation policy (AR)'}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white min-h-[120px]"
            />
          </div>

          <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="text-xl font-black text-gray-900 dark:text-white">{isAr ? 'تحسين محركات البحث' : 'SEO'}</h3>
            <input
              value={formData.metaTitle}
              onChange={(e) => handleFormChange('metaTitle', e.target.value)}
              placeholder={isAr ? 'عنوان الميتا' : 'Meta title'}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
            />
            <textarea
              value={formData.metaDescription}
              onChange={(e) => handleFormChange('metaDescription', e.target.value)}
              placeholder={isAr ? 'وصف الميتا' : 'Meta description'}
              className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white min-h-[120px]"
            />
            <div className="flex gap-2">
              <input
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                placeholder={isAr ? 'أضف كلمة مفتاحية' : 'Add keyword'}
                className="flex-1 px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
              />
              <button
                type="button"
                onClick={handleAddKeyword}
                className="px-5 py-3 rounded-2xl bg-purple-500 text-white font-bold"
              >
                +
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.keywords.map((item, index) => (
                <button
                  type="button"
                  key={item}
                  onClick={() => handleRemoveItem('keywords', index)}
                  className="px-3 py-2 rounded-full bg-purple-50 text-purple-700"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </form>
    </AdminLayout>
  )
}
