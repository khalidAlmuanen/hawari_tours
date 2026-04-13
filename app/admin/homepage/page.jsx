'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Image from 'next/image'
import EnhancedModal from '@/components/admin/EnhancedModal'
import EmptyState from '@/components/admin/EmptyState'
import ImageUploader from '@/components/admin/ImageUploader'
import { useEnhancedToast } from '@/components/admin/EnhancedToast'

export default function AdminHomepage() {
  const toast = useEnhancedToast()
  const isAr = true

  const tabs = useMemo(
    () => [
      { id: 'hero', label: { ar: 'السلايدر الرئيسي', en: 'Hero Slides' } },
      { id: 'stats', label: { ar: 'الإحصائيات السريعة', en: 'Quick Stats' } },
      { id: 'welcome', label: { ar: 'رسالة الترحيب', en: 'Welcome Message' } },
      { id: 'why', label: { ar: 'لماذا تختارنا', en: 'Why Choose Us' } }
    ],
    []
  )

  const typeLabels = {
    hero: { ar: 'السلايدر الرئيسي', en: 'Hero Slide' },
    stats: { ar: 'الإحصائيات السريعة', en: 'Quick Stat' },
    welcome: { ar: 'رسالة الترحيب', en: 'Welcome Message' },
    why: { ar: 'لماذا تختارنا', en: 'Why Choose Us' }
  }

  const [activeTab, setActiveTab] = useState('hero')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [heroSlides, setHeroSlides] = useState([])
  const [quickStats, setQuickStats] = useState([])
  const [welcomeMessages, setWelcomeMessages] = useState([])
  const [whyChooseUs, setWhyChooseUs] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [sortBy, setSortBy] = useState('order')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState('create')
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({})

  const emptyFormData = (type) => {
    if (type === 'hero') {
      return {
        titleAr: '',
        titleEn: '',
        subtitleAr: '',
        subtitleEn: '',
        descriptionAr: '',
        descriptionEn: '',
        imageUrl: '',
        buttonTextAr: '',
        buttonText: '',
        buttonLink: '',
        order: '',
        isActive: true
      }
    }
    if (type === 'stats') {
      return {
        labelAr: '',
        labelEn: '',
        value: '',
        icon: '',
        color: '#10B981',
        order: '',
        isActive: true
      }
    }
    if (type === 'welcome') {
      return {
        titleAr: '',
        titleEn: '',
        subtitleAr: '',
        subtitleEn: '',
        contentAr: '',
        contentEn: '',
        imageUrl: '',
        isActive: true
      }
    }
    return {
      titleAr: '',
      titleEn: '',
      descriptionAr: '',
      descriptionEn: '',
      icon: '',
      color: '#10B981',
      order: '',
      isActive: true
    }
  }

  const mapItemToForm = (type, item) => {
    if (type === 'hero') {
      return {
        titleAr: item.titleAr || '',
        titleEn: item.titleEn || '',
        subtitleAr: item.subtitleAr || '',
        subtitleEn: item.subtitleEn || '',
        descriptionAr: item.descriptionAr || '',
        descriptionEn: item.descriptionEn || '',
        imageUrl: item.imageUrl || '',
        buttonTextAr: item.buttonTextAr || '',
        buttonText: item.buttonText || '',
        buttonLink: item.buttonLink || '',
        order: item.order ?? '',
        isActive: item.isActive ?? true
      }
    }
    if (type === 'stats') {
      return {
        labelAr: item.labelAr || '',
        labelEn: item.labelEn || '',
        value: item.value || '',
        icon: item.icon || '',
        color: item.color || '#10B981',
        order: item.order ?? '',
        isActive: item.isActive ?? true
      }
    }
    if (type === 'welcome') {
      return {
        titleAr: item.titleAr || '',
        titleEn: item.titleEn || '',
        subtitleAr: item.subtitleAr || '',
        subtitleEn: item.subtitleEn || '',
        contentAr: item.contentAr || '',
        contentEn: item.contentEn || '',
        imageUrl: item.imageUrl || '',
        isActive: item.isActive ?? true
      }
    }
    return {
      titleAr: item.titleAr || '',
      titleEn: item.titleEn || '',
      descriptionAr: item.descriptionAr || '',
      descriptionEn: item.descriptionEn || '',
      icon: item.icon || '',
      color: item.color || '#10B981',
      order: item.order ?? '',
      isActive: item.isActive ?? true
    }
  }

  const applyData = (data) => {
    setHeroSlides(data.heroSlides || [])
    setQuickStats(data.quickStats || [])
    setWelcomeMessages(data.welcomeMessages || [])
    setWhyChooseUs(data.whyChooseUs || [])
  }

  const fetchContent = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/homepage')
      const result = await response.json()
      if (result.success) {
        applyData(result.data || {})
      } else {
        toast.error(isAr ? 'تعذر تحميل المحتوى' : 'Failed to load content')
      }
    } catch (error) {
      toast.error(isAr ? 'تعذر تحميل المحتوى' : 'Failed to load content')
    } finally {
      setLoading(false)
    }
  }, [isAr, toast])

  useEffect(() => {
    fetchContent()
  }, [fetchContent])

  const getFieldValue = (item, field) => {
    const value = item?.[field]
    return value === null || value === undefined ? '' : String(value)
  }

  const currentItems = useMemo(() => {
    if (activeTab === 'hero') return heroSlides
    if (activeTab === 'stats') return quickStats
    if (activeTab === 'welcome') return welcomeMessages
    return whyChooseUs
  }, [activeTab, heroSlides, quickStats, welcomeMessages, whyChooseUs])

  const filteredItems = useMemo(() => {
    const term = searchTerm.trim().toLowerCase()
    let items = [...currentItems]

    if (statusFilter !== 'all') {
      const shouldBeActive = statusFilter === 'active'
      items = items.filter((item) => Boolean(item.isActive) === shouldBeActive)
    }

    if (term) {
      items = items.filter((item) => {
        if (activeTab === 'hero') {
          return [
            getFieldValue(item, 'titleAr'),
            getFieldValue(item, 'titleEn'),
            getFieldValue(item, 'subtitleAr'),
            getFieldValue(item, 'subtitleEn'),
            getFieldValue(item, 'descriptionAr'),
            getFieldValue(item, 'descriptionEn')
          ].some((value) => value.toLowerCase().includes(term))
        }
        if (activeTab === 'stats') {
          return [
            getFieldValue(item, 'labelAr'),
            getFieldValue(item, 'labelEn'),
            getFieldValue(item, 'value')
          ].some((value) => value.toLowerCase().includes(term))
        }
        if (activeTab === 'welcome') {
          return [
            getFieldValue(item, 'titleAr'),
            getFieldValue(item, 'titleEn'),
            getFieldValue(item, 'subtitleAr'),
            getFieldValue(item, 'subtitleEn'),
            getFieldValue(item, 'contentAr'),
            getFieldValue(item, 'contentEn')
          ].some((value) => value.toLowerCase().includes(term))
        }
        return [
          getFieldValue(item, 'titleAr'),
          getFieldValue(item, 'titleEn'),
          getFieldValue(item, 'descriptionAr'),
          getFieldValue(item, 'descriptionEn')
        ].some((value) => value.toLowerCase().includes(term))
      })
    }

    if (sortBy === 'newest') {
      items.sort((a, b) => new Date(b.updatedAt || b.createdAt || 0) - new Date(a.updatedAt || a.createdAt || 0))
    } else if (sortBy === 'order') {
      items.sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    }

    return items
  }, [activeTab, currentItems, searchTerm, sortBy, statusFilter])

  const totals = useMemo(() => ({
    hero: heroSlides.length,
    heroActive: heroSlides.filter((item) => item.isActive).length,
    stats: quickStats.length,
    statsActive: quickStats.filter((item) => item.isActive).length,
    welcome: welcomeMessages.length,
    welcomeActive: welcomeMessages.filter((item) => item.isActive).length,
    why: whyChooseUs.length,
    whyActive: whyChooseUs.filter((item) => item.isActive).length
  }), [heroSlides, quickStats, welcomeMessages, whyChooseUs])

  const lastUpdated = useMemo(() => {
    const allItems = [...heroSlides, ...quickStats, ...welcomeMessages, ...whyChooseUs]
    const timestamps = allItems
      .map((item) => item.updatedAt || item.createdAt)
      .filter(Boolean)
      .map((value) => new Date(value).getTime())
    if (!timestamps.length) return null
    return new Date(Math.max(...timestamps))
  }, [heroSlides, quickStats, welcomeMessages, whyChooseUs])

  const openCreateModal = () => {
    setModalMode('create')
    setEditingItem(null)
    setFormData(emptyFormData(activeTab))
    setIsModalOpen(true)
  }

  const openEditModal = (item) => {
    setModalMode('edit')
    setEditingItem(item)
    setFormData(mapItemToForm(activeTab, item))
    setIsModalOpen(true)
  }

  const handleSave = async () => {
    const payload = modalMode === 'create'
      ? { type: activeTab, data: formData }
      : { type: activeTab, id: editingItem?.id, data: formData }

    try {
      setSaving(true)
      const response = await fetch('/api/admin/homepage', {
        method: modalMode === 'create' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      const result = await response.json()
      if (result.success) {
        applyData(result.data || {})
        toast.success(isAr ? 'تم الحفظ بنجاح' : 'Saved successfully')
        setIsModalOpen(false)
      } else {
        toast.error(isAr ? 'تعذر حفظ البيانات' : 'Failed to save data')
      }
    } catch (error) {
      toast.error(isAr ? 'تعذر حفظ البيانات' : 'Failed to save data')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (item) => {
    const confirmText = isAr ? 'هل أنت متأكد من الحذف؟' : 'Are you sure you want to delete?'
    if (!window.confirm(confirmText)) return
    try {
      const response = await fetch(`/api/admin/homepage?type=${activeTab}&id=${item.id}`, {
        method: 'DELETE'
      })
      const result = await response.json()
      if (result.success) {
        applyData(result.data || {})
        toast.success(isAr ? 'تم الحذف' : 'Deleted')
      } else {
        toast.error(isAr ? 'تعذر الحذف' : 'Failed to delete')
      }
    } catch (error) {
      toast.error(isAr ? 'تعذر الحذف' : 'Failed to delete')
    }
  }

  const updateItem = async (item, data) => {
    try {
      setSaving(true)
      const response = await fetch('/api/admin/homepage', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: activeTab, id: item.id, data })
      })
      const result = await response.json()
      if (result.success) {
        applyData(result.data || {})
        return true
      }
      toast.error('تعذر تحديث البيانات')
      return false
    } catch (error) {
      toast.error('تعذر تحديث البيانات')
      return false
    } finally {
      setSaving(false)
    }
  }

  const toggleActive = async (item) => {
    const data = activeTab === 'welcome'
      ? { isActive: !item.isActive }
      : { isActive: !item.isActive, order: item.order ?? 0 }
    await updateItem(item, data)
  }

  const moveItem = async (item, direction) => {
    if (activeTab === 'welcome') return
    const ordered = [...currentItems].sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
    const index = ordered.findIndex((entry) => entry.id === item.id)
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (index === -1 || targetIndex < 0 || targetIndex >= ordered.length) return
    const target = ordered[targetIndex]
    const currentOrder = item.order ?? 0
    const targetOrder = target.order ?? 0
    await updateItem(item, { order: targetOrder, isActive: item.isActive })
    await updateItem(target, { order: currentOrder, isActive: target.isActive })
  }

  const renderCards = () => {
    if (!filteredItems.length) {
      return (
        <EmptyState
          title={isAr ? 'لا توجد بيانات بعد' : 'No data yet'}
          description={isAr ? 'ابدأ بإضافة محتوى جديد للصفحة الرئيسية' : 'Start by adding new homepage content'}
          actionLabel={isAr ? 'إضافة الآن' : 'Add Now'}
          onAction={openCreateModal}
          icon="🏠"
          className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-100 dark:border-gray-800"
        />
      )
    }

    if (activeTab === 'hero') {
      return (
        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredItems.map((slide, index) => (
            <div key={slide.id} className="bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-xl border border-gray-100 dark:border-gray-800">
              <div className="relative h-48">
                {slide.imageUrl ? (
                  <Image
                    src={slide.imageUrl}
                    alt={slide.titleAr || slide.titleEn}
                    fill
                    sizes="(max-width: 1280px) 100vw, 33vw"
                    className="object-cover"
                  />
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <div className="text-sm opacity-80">{slide.subtitleAr || slide.subtitleEn}</div>
                  <div className="text-lg font-semibold line-clamp-1">{slide.titleAr || slide.titleEn}</div>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-sm text-gray-500 dark:text-gray-400">ترتيب #{slide.order ?? index + 1}</div>
                  <span className={`text-xs px-2 py-1 rounded-full ${slide.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'}`}>
                    {slide.isActive ? 'نشط' : 'غير نشط'}
                  </span>
                </div>
                <div className="text-gray-700 dark:text-gray-300 text-sm line-clamp-2">{slide.descriptionAr || slide.descriptionEn}</div>
                <div className="flex items-center gap-2 mt-4">
                  <button
                    onClick={() => toggleActive(slide)}
                    className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  >
                    {slide.isActive ? 'إيقاف' : 'تفعيل'}
                  </button>
                  <button
                    onClick={() => moveItem(slide, 'up')}
                    className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    disabled={saving}
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveItem(slide, 'down')}
                    className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    disabled={saving}
                  >
                    ↓
                  </button>
                </div>
                <div className="flex items-center gap-2 mt-4">
                  <button
                    onClick={() => openEditModal(slide)}
                    className="flex-1 px-3 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                  >
                    تعديل
                  </button>
                  <button
                    onClick={() => handleDelete(slide)}
                    className="flex-1 px-3 py-2 rounded-xl bg-rose-600 text-white hover:bg-rose-700 transition-colors"
                  >
                    حذف
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )
    }

    if (activeTab === 'stats') {
      return (
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
          {filteredItems.map((stat, index) => (
            <div key={stat.id} className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-800">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl text-white" style={{ backgroundColor: stat.color || '#10B981' }}>
                  {stat.icon || '⭐'}
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${stat.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'}`}>
                  {stat.isActive ? 'نشط' : 'غير نشط'}
                </span>
              </div>
              <div className="text-3xl font-black text-gray-900 dark:text-white mb-2">{stat.value}</div>
              <div className="text-gray-600 dark:text-gray-400">{stat.labelAr || stat.labelEn}</div>
              <div className="text-xs text-gray-500 dark:text-gray-500 mt-2">ترتيب #{stat.order ?? index + 1}</div>
              <div className="flex items-center gap-2 mt-4">
                <button
                  onClick={() => toggleActive(stat)}
                  className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {stat.isActive ? 'إيقاف' : 'تفعيل'}
                </button>
                <button
                  onClick={() => moveItem(stat, 'up')}
                  className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  disabled={saving}
                >
                  ↑
                </button>
                <button
                  onClick={() => moveItem(stat, 'down')}
                  className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                  disabled={saving}
                >
                  ↓
                </button>
              </div>
              <div className="flex items-center gap-2 mt-5">
                <button
                  onClick={() => openEditModal(stat)}
                  className="flex-1 px-3 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  تعديل
                </button>
                <button
                  onClick={() => handleDelete(stat)}
                  className="flex-1 px-3 py-2 rounded-xl bg-rose-600 text-white hover:bg-rose-700 transition-colors"
                >
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      )
    }

    if (activeTab === 'welcome') {
      return (
        <div className="grid lg:grid-cols-2 gap-6">
          {filteredItems.map((message) => (
            <div key={message.id} className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-800">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{message.subtitleAr || message.subtitleEn}</div>
                  <div className="text-2xl font-bold text-gray-900 dark:text-white">{message.titleAr || message.titleEn}</div>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${message.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'}`}>
                  {message.isActive ? 'نشط' : 'غير نشط'}
                </span>
              </div>
              <div className="text-gray-600 dark:text-gray-400 line-clamp-3">{message.contentAr || message.contentEn}</div>
              {message.imageUrl && (
                <div className="mt-4 rounded-2xl overflow-hidden relative h-40">
                  <Image
                    src={message.imageUrl}
                    alt={message.titleAr || message.titleEn}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              )}
              <div className="flex items-center gap-2 mt-4">
                <button
                  onClick={() => toggleActive(message)}
                  className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {message.isActive ? 'إيقاف' : 'تفعيل'}
                </button>
              </div>
              <div className="flex items-center gap-2 mt-5">
                <button
                  onClick={() => openEditModal(message)}
                  className="flex-1 px-3 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors"
                >
                  تعديل
                </button>
                <button
                  onClick={() => handleDelete(message)}
                  className="flex-1 px-3 py-2 rounded-xl bg-rose-600 text-white hover:bg-rose-700 transition-colors"
                >
                  حذف
                </button>
              </div>
            </div>
          ))}
        </div>
      )
    }

    return (
      <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredItems.map((feature, index) => (
          <div key={feature.id} className="bg-white dark:bg-gray-900 rounded-3xl p-6 shadow-xl border border-gray-100 dark:border-gray-800">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl text-white" style={{ backgroundColor: feature.color || '#10B981' }}>
                {feature.icon || '⭐'}
              </div>
              <span className={`text-xs px-2 py-1 rounded-full ${feature.isActive ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300'}`}>
                {feature.isActive ? 'نشط' : 'غير نشط'}
              </span>
            </div>
            <div className="text-xl font-bold text-gray-900 dark:text-white mb-2">{feature.titleAr || feature.titleEn}</div>
            <div className="text-gray-600 dark:text-gray-400 line-clamp-3">{feature.descriptionAr || feature.descriptionEn}</div>
            <div className="text-xs text-gray-500 dark:text-gray-500 mt-2">ترتيب #{feature.order ?? index + 1}</div>
            <div className="flex items-center gap-2 mt-4">
              <button
                onClick={() => toggleActive(feature)}
                className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {feature.isActive ? 'إيقاف' : 'تفعيل'}
              </button>
              <button
                onClick={() => moveItem(feature, 'up')}
                className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                disabled={saving}
              >
                ↑
              </button>
              <button
                onClick={() => moveItem(feature, 'down')}
                className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                disabled={saving}
              >
                ↓
              </button>
            </div>
            <div className="flex items-center gap-2 mt-5">
              <button
                onClick={() => openEditModal(feature)}
                className="flex-1 px-3 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition-colors"
              >
                تعديل
              </button>
              <button
                onClick={() => handleDelete(feature)}
                className="flex-1 px-3 py-2 rounded-xl bg-rose-600 text-white hover:bg-rose-700 transition-colors"
              >
                حذف
              </button>
            </div>
          </div>
        ))}
      </div>
    )
  }

  const modalTitle = `${modalMode === 'create' ? 'إضافة' : 'تعديل'} ${typeLabels[activeTab].ar}`

  return (
    <div className="p-6 space-y-6" dir="rtl">
      <div className="rounded-3xl p-8 shadow-2xl border border-emerald-100/40 dark:border-emerald-900/30 bg-gradient-to-br from-emerald-50 via-white to-teal-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-200 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              لوحة التحكم المتقدمة
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              إدارة الصفحة الرئيسية
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              تحكم احترافي كامل في جميع أقسام الصفحة الرئيسية وتفاصيلها.
            </p>
            <div className="flex flex-wrap items-center gap-3 mt-4 text-sm text-gray-600 dark:text-gray-400">
              <span className="px-3 py-1 rounded-full bg-white/70 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800">
                آخر تحديث: {lastUpdated ? lastUpdated.toLocaleString('ar-EG') : 'لا يوجد'}
              </span>
              <span className="px-3 py-1 rounded-full bg-white/70 dark:bg-gray-900/60 border border-gray-100 dark:border-gray-800">
                الحالة: {saving ? 'جارٍ الحفظ' : loading ? 'جارٍ التحميل' : 'جاهز'}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={fetchContent}
              className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              تحديث البيانات
            </button>
            <button
              onClick={openCreateModal}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg hover:shadow-xl transition-all"
            >
              إضافة عنصر جديد
            </button>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 shadow-lg border border-gray-100 dark:border-gray-800">
          <div className="text-sm text-gray-500 dark:text-gray-400">السلايدر الرئيسي</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{totals.hero}</div>
          <div className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">نشط: {totals.heroActive}</div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 shadow-lg border border-gray-100 dark:border-gray-800">
          <div className="text-sm text-gray-500 dark:text-gray-400">الإحصائيات السريعة</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{totals.stats}</div>
          <div className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">نشط: {totals.statsActive}</div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 shadow-lg border border-gray-100 dark:border-gray-800">
          <div className="text-sm text-gray-500 dark:text-gray-400">رسالة الترحيب</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{totals.welcome}</div>
          <div className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">نشط: {totals.welcomeActive}</div>
        </div>
        <div className="bg-white dark:bg-gray-900 rounded-3xl p-5 shadow-lg border border-gray-100 dark:border-gray-800">
          <div className="text-sm text-gray-500 dark:text-gray-400">لماذا تختارنا</div>
          <div className="text-2xl font-bold text-gray-900 dark:text-white mt-2">{totals.why}</div>
          <div className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">نشط: {totals.whyActive}</div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl p-4 shadow-xl border border-gray-100 dark:border-gray-800 flex flex-wrap gap-3">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2 rounded-2xl text-sm font-semibold transition-all ${activeTab === tab.id
              ? 'bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-lg'
              : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
          >
            {tab.label.ar}
          </button>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-900 rounded-3xl p-4 shadow-xl border border-gray-100 dark:border-gray-800 flex flex-col lg:flex-row gap-4 lg:items-center lg:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="ابحث داخل القسم الحالي..."
            className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-gray-700 dark:text-gray-300 w-64"
          />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-gray-700 dark:text-gray-300"
          >
            <option value="all">كل الحالات</option>
            <option value="active">نشط فقط</option>
            <option value="inactive">غير نشط فقط</option>
          </select>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-4 py-2 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-950 text-gray-700 dark:text-gray-300"
          >
            <option value="order">ترتيب مخصص</option>
            <option value="newest">الأحدث أولاً</option>
          </select>
        </div>
        <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
          <span>نتائج: {filteredItems.length}</span>
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              مسح البحث
            </button>
          )}
        </div>
      </div>

      <div className="min-h-[240px]">
        {loading ? (
          <div className="bg-white dark:bg-gray-900 rounded-3xl p-12 text-center text-gray-500 dark:text-gray-400 border border-gray-100 dark:border-gray-800">
            جاري التحميل...
          </div>
        ) : (
          renderCards()
        )}
      </div>

      <EnhancedModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalTitle}
        onSave={handleSave}
        saveDisabled={loading || saving}
        isAr={isAr}
        size="large"
      >
        <div className="grid md:grid-cols-2 gap-6">
          {activeTab === 'hero' && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {isAr ? 'العنوان (AR)' : 'Title (AR)'}
                </label>
                <input
                  value={formData.titleAr}
                  dir="rtl"
                  onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                  className="w-full px-4 py-2 border rounded-xl dark:bg-gray-900 dark:border-gray-700 text-right"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {isAr ? 'العنوان (EN)' : 'Title (EN)'}
                </label>
                <input
                  value={formData.titleEn}
                  onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                  className="w-full px-4 py-2 border rounded-xl dark:bg-gray-900 dark:border-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {isAr ? 'العنوان الفرعي (AR)' : 'Subtitle (AR)'}
                </label>
                <input
                  value={formData.subtitleAr}
                  dir="rtl"
                  onChange={(e) => setFormData({ ...formData, subtitleAr: e.target.value })}
                  className="w-full px-4 py-2 border rounded-xl dark:bg-gray-900 dark:border-gray-700 text-right"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {isAr ? 'العنوان الفرعي (EN)' : 'Subtitle (EN)'}
                </label>
                <input
                  value={formData.subtitleEn}
                  onChange={(e) => setFormData({ ...formData, subtitleEn: e.target.value })}
                  className="w-full px-4 py-2 border rounded-xl dark:bg-gray-900 dark:border-gray-700"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {isAr ? 'الوصف (AR)' : 'Description (AR)'}
                </label>
                <textarea
                  rows={3}
                  value={formData.descriptionAr}
                  dir="rtl"
                  onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                  className="w-full px-4 py-2 border rounded-xl dark:bg-gray-900 dark:border-gray-700 text-right"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {isAr ? 'الوصف (EN)' : 'Description (EN)'}
                </label>
                <textarea
                  rows={3}
                  value={formData.descriptionEn}
                  onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                  className="w-full px-4 py-2 border rounded-xl dark:bg-gray-900 dark:border-gray-700"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {isAr ? 'الصورة' : 'Image'}
                </label>
                <ImageUploader
                  value={formData.imageUrl}
                  onUploadProp={(url) => setFormData({ ...formData, imageUrl: url })}
                  label={isAr ? 'اسحب وأفلت الصورة هنا' : 'Drag & Drop Image'}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {isAr ? 'نص الزر (AR)' : 'Button Text (AR)'}
                </label>
                <input
                  value={formData.buttonTextAr}
                  dir="rtl"
                  onChange={(e) => setFormData({ ...formData, buttonTextAr: e.target.value })}
                  className="w-full px-4 py-2 border rounded-xl dark:bg-gray-900 dark:border-gray-700 text-right"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {isAr ? 'نص الزر (EN)' : 'Button Text (EN)'}
                </label>
                <input
                  value={formData.buttonText}
                  onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                  className="w-full px-4 py-2 border rounded-xl dark:bg-gray-900 dark:border-gray-700"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {isAr ? 'رابط الزر' : 'Button Link'}
                </label>
                <input
                  value={formData.buttonLink}
                  onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                  className="w-full px-4 py-2 border rounded-xl dark:bg-gray-900 dark:border-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {isAr ? 'الترتيب' : 'Order'}
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                  className="w-full px-4 py-2 border rounded-xl dark:bg-gray-900 dark:border-gray-700"
                />
              </div>
              <div className="flex items-center gap-3 pt-8">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-green-600"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {isAr ? 'نشط' : 'Active'}
                </span>
              </div>
            </>
          )}

          {activeTab === 'stats' && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {isAr ? 'الاسم (AR)' : 'Label (AR)'}
                </label>
                <input
                  value={formData.labelAr}
                  dir="rtl"
                  onChange={(e) => setFormData({ ...formData, labelAr: e.target.value })}
                  className="w-full px-4 py-2 border rounded-xl dark:bg-gray-900 dark:border-gray-700 text-right"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {isAr ? 'الاسم (EN)' : 'Label (EN)'}
                </label>
                <input
                  value={formData.labelEn}
                  onChange={(e) => setFormData({ ...formData, labelEn: e.target.value })}
                  className="w-full px-4 py-2 border rounded-xl dark:bg-gray-900 dark:border-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {isAr ? 'القيمة' : 'Value'}
                </label>
                <input
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  className="w-full px-4 py-2 border rounded-xl dark:bg-gray-900 dark:border-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {isAr ? 'الأيقونة (Emoji)' : 'Icon (Emoji)'}
                </label>
                <input
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-4 py-2 border rounded-xl dark:bg-gray-900 dark:border-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {isAr ? 'اللون' : 'Color'}
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={formData.color || '#10B981'}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="h-12 w-16 rounded-lg border border-gray-200 dark:border-gray-700"
                  />
                  <input
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="flex-1 px-4 py-2 border rounded-xl dark:bg-gray-900 dark:border-gray-700"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {isAr ? 'الترتيب' : 'Order'}
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                  className="w-full px-4 py-2 border rounded-xl dark:bg-gray-900 dark:border-gray-700"
                />
              </div>
              <div className="flex items-center gap-3 pt-8">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-green-600"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {isAr ? 'نشط' : 'Active'}
                </span>
              </div>
            </>
          )}

          {activeTab === 'welcome' && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {isAr ? 'العنوان (AR)' : 'Title (AR)'}
                </label>
                <input
                  value={formData.titleAr}
                  dir="rtl"
                  onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                  className="w-full px-4 py-2 border rounded-xl dark:bg-gray-900 dark:border-gray-700 text-right"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {isAr ? 'العنوان (EN)' : 'Title (EN)'}
                </label>
                <input
                  value={formData.titleEn}
                  onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                  className="w-full px-4 py-2 border rounded-xl dark:bg-gray-900 dark:border-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {isAr ? 'النص التمهيدي (AR)' : 'Subtitle (AR)'}
                </label>
                <input
                  value={formData.subtitleAr}
                  dir="rtl"
                  onChange={(e) => setFormData({ ...formData, subtitleAr: e.target.value })}
                  className="w-full px-4 py-2 border rounded-xl dark:bg-gray-900 dark:border-gray-700 text-right"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {isAr ? 'النص التمهيدي (EN)' : 'Subtitle (EN)'}
                </label>
                <input
                  value={formData.subtitleEn}
                  onChange={(e) => setFormData({ ...formData, subtitleEn: e.target.value })}
                  className="w-full px-4 py-2 border rounded-xl dark:bg-gray-900 dark:border-gray-700"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {isAr ? 'المحتوى (AR)' : 'Content (AR)'}
                </label>
                <textarea
                  rows={4}
                  value={formData.contentAr}
                  dir="rtl"
                  onChange={(e) => setFormData({ ...formData, contentAr: e.target.value })}
                  className="w-full px-4 py-2 border rounded-xl dark:bg-gray-900 dark:border-gray-700 text-right"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {isAr ? 'المحتوى (EN)' : 'Content (EN)'}
                </label>
                <textarea
                  rows={4}
                  value={formData.contentEn}
                  onChange={(e) => setFormData({ ...formData, contentEn: e.target.value })}
                  className="w-full px-4 py-2 border rounded-xl dark:bg-gray-900 dark:border-gray-700"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {isAr ? 'صورة إضافية' : 'Optional Image'}
                </label>
                <ImageUploader
                  value={formData.imageUrl}
                  onUploadProp={(url) => setFormData({ ...formData, imageUrl: url })}
                  label={isAr ? 'اسحب وأفلت الصورة هنا' : 'Drag & Drop Image'}
                />
              </div>
              <div className="flex items-center gap-3 pt-8">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-green-600"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {isAr ? 'نشط' : 'Active'}
                </span>
              </div>
            </>
          )}

          {activeTab === 'why' && (
            <>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {isAr ? 'العنوان (AR)' : 'Title (AR)'}
                </label>
                <input
                  value={formData.titleAr}
                  dir="rtl"
                  onChange={(e) => setFormData({ ...formData, titleAr: e.target.value })}
                  className="w-full px-4 py-2 border rounded-xl dark:bg-gray-900 dark:border-gray-700 text-right"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {isAr ? 'العنوان (EN)' : 'Title (EN)'}
                </label>
                <input
                  value={formData.titleEn}
                  onChange={(e) => setFormData({ ...formData, titleEn: e.target.value })}
                  className="w-full px-4 py-2 border rounded-xl dark:bg-gray-900 dark:border-gray-700"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {isAr ? 'الوصف (AR)' : 'Description (AR)'}
                </label>
                <textarea
                  rows={3}
                  value={formData.descriptionAr}
                  dir="rtl"
                  onChange={(e) => setFormData({ ...formData, descriptionAr: e.target.value })}
                  className="w-full px-4 py-2 border rounded-xl dark:bg-gray-900 dark:border-gray-700 text-right"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {isAr ? 'الوصف (EN)' : 'Description (EN)'}
                </label>
                <textarea
                  rows={3}
                  value={formData.descriptionEn}
                  onChange={(e) => setFormData({ ...formData, descriptionEn: e.target.value })}
                  className="w-full px-4 py-2 border rounded-xl dark:bg-gray-900 dark:border-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {isAr ? 'الأيقونة (Emoji)' : 'Icon (Emoji)'}
                </label>
                <input
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-4 py-2 border rounded-xl dark:bg-gray-900 dark:border-gray-700"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {isAr ? 'اللون' : 'Color'}
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={formData.color || '#10B981'}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="h-12 w-16 rounded-lg border border-gray-200 dark:border-gray-700"
                  />
                  <input
                    value={formData.color}
                    onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                    className="flex-1 px-4 py-2 border rounded-xl dark:bg-gray-900 dark:border-gray-700"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                  {isAr ? 'الترتيب' : 'Order'}
                </label>
                <input
                  type="number"
                  value={formData.order}
                  onChange={(e) => setFormData({ ...formData, order: e.target.value })}
                  className="w-full px-4 py-2 border rounded-xl dark:bg-gray-900 dark:border-gray-700"
                />
              </div>
              <div className="flex items-center gap-3 pt-8">
                <input
                  type="checkbox"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 rounded text-green-600"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {isAr ? 'نشط' : 'Active'}
                </span>
              </div>
            </>
          )}
        </div>
      </EnhancedModal>
    </div>
  )
}
