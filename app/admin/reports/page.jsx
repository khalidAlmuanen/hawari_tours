'use client'

// ═══════════════════════════════════════════════════════════════════════
// 📊 Socotra Reports Page — Hawari Tours
// ✨ Premium Editorial Design — Luxury Island Heritage Aesthetic
// ═══════════════════════════════════════════════════════════════════════

import Link from 'next/link'
import Image from 'next/image'
import { useCallback, useEffect, useMemo, useState, useRef } from 'react'
import { useApp } from '@/contexts/AppContext'
import AdminLayout from '@/components/admin/AdminLayout'
import { useToast } from '@/components/admin/Toast'

// ── Animated background particles ──────────────────────────────────────
function FloatingOrb({ style }) {
  return <div className="reports-orb" style={style} />
}

// ── Skeleton shimmer card ───────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="reports-skeleton">
      <div className="reports-skeleton__header" />
      <div className="reports-skeleton__line reports-skeleton__line--wide" />
      <div className="reports-skeleton__line" />
      <div className="reports-skeleton__line reports-skeleton__line--short" />
      <div className="reports-skeleton__footer" />
    </div>
  )
}

// ── Stat counter with animation ─────────────────────────────────────────
function AnimatedStat({ value, label, icon }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } }, { threshold: 0.3 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return (
    <div ref={ref} className={`reports-stat ${visible ? 'reports-stat--visible' : ''}`}>
      <span className="reports-stat__icon">{icon}</span>
      <span className="reports-stat__value">{value}</span>
      <span className="reports-stat__label">{label}</span>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════
export default function ReportsPage() {
  const { locale } = useApp()
  const isAr = locale === 'ar'
  const { success, error: showError } = useToast()

  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [content, setContent] = useState({
    categories: [], reports: [], stats: [], settings: {}, unesco: {}, cta: {}
  })
  const [activeTab, setActiveTab] = useState('reports')
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState('create')
  const [modalType, setModalType] = useState('report')
  const [selectedItem, setSelectedItem] = useState(null)
  const [formData, setFormData] = useState({})
  const [saving, setSaving] = useState(false)
  const [settingsData, setSettingsData] = useState({})
  const [unescoData, setUnescoData] = useState({})
  const [ctaData, setCtaData] = useState({})
  const [showPreview, setShowPreview] = useState(false)
  const [showScrollTop, setShowScrollTop] = useState(false)
  const [showScrollBottom, setShowScrollBottom] = useState(false)
  const [showModalScrollTop, setShowModalScrollTop] = useState(false)
  const [showModalScrollBottom, setShowModalScrollBottom] = useState(false)
  const mountedRef = useRef(false)
  const modalContentRef = useRef(null)

  const fetchContent = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch('/api/admin/reports')
      const result = await response.json()
      if (result.success && mountedRef.current) {
        setContent(result.data)
        setSettingsData(result.data.settings || {})
        setUnescoData(result.data.unesco || {})
        setCtaData(result.data.cta || {})
      }
    } catch (error) {
      if (mountedRef.current) {
        setContent({ categories: [], reports: [], stats: [], settings: {}, unesco: {}, cta: {} })
        setSettingsData({})
        setUnescoData({})
        setCtaData({})
      }
      showError(isAr ? 'تعذر جلب بيانات التقارير' : 'Failed to fetch reports data')
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [isAr, showError])

  useEffect(() => {
    mountedRef.current = true
    fetchContent()
    return () => { mountedRef.current = false }
  }, [fetchContent])

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setShowPreview(params.get('preview') === 'true')
  }, [])

  useEffect(() => {
    const updateScrollState = () => {
      const scrollY = window.scrollY || 0
      const viewHeight = window.innerHeight || 0
      const docHeight = document.documentElement.scrollHeight || 0
      setShowScrollTop(scrollY > 200)
      setShowScrollBottom(scrollY + viewHeight < docHeight - 200)
    }
    updateScrollState()
    window.addEventListener('scroll', updateScrollState, { passive: true })
    window.addEventListener('resize', updateScrollState)
    return () => {
      window.removeEventListener('scroll', updateScrollState)
      window.removeEventListener('resize', updateScrollState)
    }
  }, [])

  useEffect(() => {
    if (!showModal || !modalContentRef.current) return
    const container = modalContentRef.current
    const updateModalScroll = () => {
      const scrollTop = container.scrollTop || 0
      const viewHeight = container.clientHeight || 0
      const scrollHeight = container.scrollHeight || 0
      setShowModalScrollTop(scrollTop > 50)
      setShowModalScrollBottom(scrollTop + viewHeight < scrollHeight - 50)
    }
    updateModalScroll()
    container.addEventListener('scroll', updateModalScroll, { passive: true })
    window.addEventListener('resize', updateModalScroll)
    return () => {
      container.removeEventListener('scroll', updateModalScroll)
      window.removeEventListener('resize', updateModalScroll)
    }
  }, [showModal])

  const settings = useMemo(() => content.settings || {}, [content.settings])
  const unescoSection = useMemo(() => content.unesco || {}, [content.unesco])
  const ctaSection = useMemo(() => content.cta || {}, [content.cta])

  const reportCategories = useMemo(() => {
    const base = (content.categories || []).map((cat) => ({
      id: cat.id,
      name: { ar: cat.nameAr, en: cat.nameEn },
      icon: cat.icon || '📄',
      gradient: cat.gradient || 'from-gray-500 to-gray-700'
    }))
    return [
      { id: 'all', name: { ar: settings.allReportsTitleAr || 'جميع التقارير', en: settings.allReportsTitleEn || 'All Reports' }, icon: '📚', gradient: 'from-gray-500 to-gray-700' },
      ...base
    ]
  }, [content.categories, settings])

  const reports = useMemo(() => content.reports || [], [content.reports])
  const statistics = useMemo(() => content.stats || [], [content.stats])

  const filteredReports = reports.filter(report => {
    const matchesCategory = activeCategory === 'all' || report.categoryId === activeCategory
    const text = `${report.titleAr || ''} ${report.titleEn || ''} ${report.descriptionAr || ''} ${report.descriptionEn || ''}`.toLowerCase()
    const matchesSearch = searchQuery === '' || text.includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const featuredReports = reports.filter(r => r.featured)
  const heroReport = featuredReports[0] || reports[0]
  const downloadLabel = isAr ? (settings.downloadLabelAr || 'تحميل التقرير') : (settings.downloadLabelEn || 'Download Report')
  const reportsCountLabel = isAr ? (settings.reportsCountLabelAr || 'تقرير متاح') : (settings.reportsCountLabelEn || 'reports available')

  const tabs = [
    { value: 'reports', label: isAr ? 'التقارير' : 'Reports' },
    { value: 'categories', label: isAr ? 'التصنيفات' : 'Categories' },
    { value: 'stats', label: isAr ? 'الإحصائيات' : 'Stats' },
    { value: 'settings', label: isAr ? 'الإعدادات' : 'Settings' },
    { value: 'unesco', label: isAr ? 'قسم اليونسكو' : 'UNESCO' },
    { value: 'cta', label: isAr ? 'نداء الإجراء' : 'CTA' }
  ]

  const categories = useMemo(() => content.categories || [], [content.categories])
  const filteredAdminReports = useMemo(() => {
    const normalizedQuery = searchQuery.toLowerCase()
    return reports.filter(report => {
      const matchesCategory = activeCategory === 'all' || report.categoryId === activeCategory
      const text = `${report.titleAr || ''} ${report.titleEn || ''} ${report.descriptionAr || ''} ${report.descriptionEn || ''}`.toLowerCase()
      const matchesSearch = searchQuery === '' || text.includes(normalizedQuery)
      return matchesCategory && matchesSearch
    })
  }, [activeCategory, reports, searchQuery])

  const toSlug = (value) => value
    .toLowerCase()
    .replace(/[^a-z0-9\u0600-\u06FF]+/g, '-')
    .replace(/^-+|-+$/g, '')

  const getDefaultCategory = () => ({
    nameEn: '',
    nameAr: '',
    slug: '',
    icon: '📄',
    gradient: 'from-gray-500 to-gray-700',
    isActive: true,
    order: 0
  })

  const getDefaultReport = () => ({
    titleEn: '',
    titleAr: '',
    descriptionEn: '',
    descriptionAr: '',
    year: '',
    pages: '',
    languageEn: '',
    languageAr: '',
    fileSize: '',
    downloadUrl: '',
    categoryId: categories[0]?.id || '',
    featured: false,
    isActive: true,
    order: 0,
    topicsText: ''
  })

  const getDefaultStat = () => ({
    number: '',
    labelEn: '',
    labelAr: '',
    icon: '📈',
    gradient: 'from-blue-500 to-indigo-600',
    isActive: true,
    order: 0
  })

  const openCreate = (type) => {
    setModalType(type)
    setModalMode('create')
    setSelectedItem(null)
    if (type === 'category') setFormData(getDefaultCategory())
    if (type === 'report') setFormData(getDefaultReport())
    if (type === 'stat') setFormData(getDefaultStat())
    setShowModal(true)
  }

  const openEdit = (type, item) => {
    setModalType(type)
    setModalMode('edit')
    setSelectedItem(item)
    if (type === 'category') {
      setFormData({
        nameEn: item.nameEn || '',
        nameAr: item.nameAr || '',
        slug: item.slug || '',
        icon: item.icon || '📄',
        gradient: item.gradient || 'from-gray-500 to-gray-700',
        isActive: Boolean(item.isActive),
        order: item.order || 0
      })
    }
    if (type === 'report') {
      setFormData({
        titleEn: item.titleEn || '',
        titleAr: item.titleAr || '',
        descriptionEn: item.descriptionEn || '',
        descriptionAr: item.descriptionAr || '',
        year: item.year || '',
        pages: item.pages || '',
        languageEn: item.languageEn || '',
        languageAr: item.languageAr || '',
        fileSize: item.fileSize || '',
        downloadUrl: item.downloadUrl || '',
        categoryId: item.categoryId || '',
        featured: Boolean(item.featured),
        isActive: Boolean(item.isActive),
        order: item.order || 0,
        topicsText: (item.topics || []).join(', ')
      })
    }
    if (type === 'stat') {
      setFormData({
        number: item.number || '',
        labelEn: item.labelEn || '',
        labelAr: item.labelAr || '',
        icon: item.icon || '📈',
        gradient: item.gradient || 'from-blue-500 to-indigo-600',
        isActive: Boolean(item.isActive),
        order: item.order || 0
      })
    }
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setSelectedItem(null)
    setFormData({})
  }

  const handleSaveItem = async () => {
    const typeMap = { report: 'reports', category: 'categories', stat: 'stats' }
    const requestType = typeMap[modalType]
    if (!requestType) return
    if (modalType === 'report' && !formData.categoryId) {
      showError(isAr ? 'يرجى اختيار تصنيف' : 'Please select a category')
      return
    }

    setSaving(true)
    try {
      const payload = { ...formData }
      if (modalType === 'category') {
        payload.slug = payload.slug || toSlug(payload.nameEn || payload.nameAr || '')
      }
      if (modalType === 'report') {
        const topics = (payload.topicsText || '')
          .split(',')
          .map(item => item.trim())
          .filter(Boolean)
        payload.topics = topics
        delete payload.topicsText
      }

      const response = await fetch('/api/admin/reports', {
        method: modalMode === 'create' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: requestType,
          id: modalMode === 'edit' ? selectedItem?.id : undefined,
          data: payload
        })
      })

      const result = await response.json()
      if (!result.success) throw new Error(result.error || 'Request failed')
      setContent(result.data)
      setSettingsData(result.data.settings || {})
      setUnescoData(result.data.unesco || {})
      setCtaData(result.data.cta || {})
      success(isAr ? 'تم الحفظ بنجاح' : 'Saved successfully')
      closeModal()
    } catch (error) {
      showError(isAr ? 'فشل حفظ البيانات' : 'Failed to save data')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (type, id) => {
    setSaving(true)
    try {
      const response = await fetch('/api/admin/reports', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, id })
      })
      const result = await response.json()
      if (!result.success) throw new Error(result.error || 'Request failed')
      setContent(result.data)
      setSettingsData(result.data.settings || {})
      setUnescoData(result.data.unesco || {})
      setCtaData(result.data.cta || {})
      success(isAr ? 'تم الحذف بنجاح' : 'Deleted successfully')
    } catch (error) {
      showError(isAr ? 'فشل حذف البيانات' : 'Failed to delete data')
    } finally {
      setSaving(false)
    }
  }

  const handleSaveSection = async (type, data, setter) => {
    setSaving(true)
    try {
      const response = await fetch('/api/admin/reports', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, data })
      })
      const result = await response.json()
      if (!result.success) throw new Error(result.error || 'Request failed')
      setContent(result.data)
      setSettingsData(result.data.settings || {})
      setUnescoData(result.data.unesco || {})
      setCtaData(result.data.cta || {})
      setter(result.data[type] || {})
      success(isAr ? 'تم التحديث بنجاح' : 'Updated successfully')
    } catch (error) {
      showError(isAr ? 'فشل تحديث البيانات' : 'Failed to update data')
    } finally {
      setSaving(false)
    }
  }

  const settingsFields = [
    { key: 'heroBadgeEn', label: isAr ? 'شارة البطل (EN)' : 'Hero Badge (EN)' },
    { key: 'heroBadgeAr', label: isAr ? 'شارة البطل (AR)' : 'Hero Badge (AR)' },
    { key: 'heroTitleLine1En', label: isAr ? 'العنوان 1 (EN)' : 'Hero Title 1 (EN)' },
    { key: 'heroTitleLine1Ar', label: isAr ? 'العنوان 1 (AR)' : 'Hero Title 1 (AR)' },
    { key: 'heroTitleLine2En', label: isAr ? 'العنوان 2 (EN)' : 'Hero Title 2 (EN)' },
    { key: 'heroTitleLine2Ar', label: isAr ? 'العنوان 2 (AR)' : 'Hero Title 2 (AR)' },
    { key: 'heroSubtitleEn', label: isAr ? 'الوصف الرئيسي (EN)' : 'Hero Subtitle (EN)', type: 'textarea' },
    { key: 'heroSubtitleAr', label: isAr ? 'الوصف الرئيسي (AR)' : 'Hero Subtitle (AR)', type: 'textarea' },
    { key: 'primaryButtonLabelEn', label: isAr ? 'زر رئيسي (EN)' : 'Primary Button (EN)' },
    { key: 'primaryButtonLabelAr', label: isAr ? 'زر رئيسي (AR)' : 'Primary Button (AR)' },
    { key: 'primaryButtonLink', label: isAr ? 'رابط الزر الرئيسي' : 'Primary Button Link' },
    { key: 'secondaryButtonLabelEn', label: isAr ? 'زر ثانوي (EN)' : 'Secondary Button (EN)' },
    { key: 'secondaryButtonLabelAr', label: isAr ? 'زر ثانوي (AR)' : 'Secondary Button (AR)' },
    { key: 'secondaryButtonLink', label: isAr ? 'رابط الزر الثانوي' : 'Secondary Button Link' },
    { key: 'statsTitleEn', label: isAr ? 'عنوان الإحصائيات (EN)' : 'Stats Title (EN)' },
    { key: 'statsTitleAr', label: isAr ? 'عنوان الإحصائيات (AR)' : 'Stats Title (AR)' },
    { key: 'statsTitleHighlightEn', label: isAr ? 'تمييز الإحصائيات (EN)' : 'Stats Highlight (EN)' },
    { key: 'statsTitleHighlightAr', label: isAr ? 'تمييز الإحصائيات (AR)' : 'Stats Highlight (AR)' },
    { key: 'featuredBadgeEn', label: isAr ? 'شارة المميز (EN)' : 'Featured Badge (EN)' },
    { key: 'featuredBadgeAr', label: isAr ? 'شارة المميز (AR)' : 'Featured Badge (AR)' },
    { key: 'featuredTitleEn', label: isAr ? 'عنوان المميز (EN)' : 'Featured Title (EN)' },
    { key: 'featuredTitleAr', label: isAr ? 'عنوان المميز (AR)' : 'Featured Title (AR)' },
    { key: 'allReportsTitleEn', label: isAr ? 'عنوان الكل (EN)' : 'All Reports Title (EN)' },
    { key: 'allReportsTitleAr', label: isAr ? 'عنوان الكل (AR)' : 'All Reports Title (AR)' },
    { key: 'allReportsTitleHighlightEn', label: isAr ? 'تمييز الكل (EN)' : 'All Reports Highlight (EN)' },
    { key: 'allReportsTitleHighlightAr', label: isAr ? 'تمييز الكل (AR)' : 'All Reports Highlight (AR)' },
    { key: 'searchPlaceholderEn', label: isAr ? 'بحث placeholder (EN)' : 'Search Placeholder (EN)' },
    { key: 'searchPlaceholderAr', label: isAr ? 'بحث placeholder (AR)' : 'Search Placeholder (AR)' },
    { key: 'noResultsTitleEn', label: isAr ? 'عنوان بدون نتائج (EN)' : 'No Results Title (EN)' },
    { key: 'noResultsTitleAr', label: isAr ? 'عنوان بدون نتائج (AR)' : 'No Results Title (AR)' },
    { key: 'noResultsTextEn', label: isAr ? 'نص بدون نتائج (EN)' : 'No Results Text (EN)', type: 'textarea' },
    { key: 'noResultsTextAr', label: isAr ? 'نص بدون نتائج (AR)' : 'No Results Text (AR)', type: 'textarea' },
    { key: 'resetButtonLabelEn', label: isAr ? 'زر إعادة (EN)' : 'Reset Button (EN)' },
    { key: 'resetButtonLabelAr', label: isAr ? 'زر إعادة (AR)' : 'Reset Button (AR)' },
    { key: 'downloadLabelEn', label: isAr ? 'زر تحميل (EN)' : 'Download Label (EN)' },
    { key: 'downloadLabelAr', label: isAr ? 'زر تحميل (AR)' : 'Download Label (AR)' },
    { key: 'reportsCountLabelEn', label: isAr ? 'عدّاد التقارير (EN)' : 'Reports Count (EN)' },
    { key: 'reportsCountLabelAr', label: isAr ? 'عدّاد التقارير (AR)' : 'Reports Count (AR)' }
  ]

  const unescoFields = [
    { key: 'badgeEn', label: isAr ? 'شارة يونسكو (EN)' : 'UNESCO Badge (EN)' },
    { key: 'badgeAr', label: isAr ? 'شارة يونسكو (AR)' : 'UNESCO Badge (AR)' },
    { key: 'titleLine1En', label: isAr ? 'عنوان 1 (EN)' : 'Title Line 1 (EN)' },
    { key: 'titleLine1Ar', label: isAr ? 'عنوان 1 (AR)' : 'Title Line 1 (AR)' },
    { key: 'titleLine2En', label: isAr ? 'عنوان 2 (EN)' : 'Title Line 2 (EN)' },
    { key: 'titleLine2Ar', label: isAr ? 'عنوان 2 (AR)' : 'Title Line 2 (AR)' },
    { key: 'descriptionEn', label: isAr ? 'الوصف (EN)' : 'Description (EN)', type: 'textarea' },
    { key: 'descriptionAr', label: isAr ? 'الوصف (AR)' : 'Description (AR)', type: 'textarea' },
    { key: 'buttonLabelEn', label: isAr ? 'زر (EN)' : 'Button Label (EN)' },
    { key: 'buttonLabelAr', label: isAr ? 'زر (AR)' : 'Button Label (AR)' },
    { key: 'buttonLink', label: isAr ? 'رابط الزر' : 'Button Link' },
    { key: 'imageUrl', label: isAr ? 'رابط الصورة' : 'Image URL' }
  ]

  const ctaFields = [
    { key: 'titleEn', label: isAr ? 'عنوان CTA (EN)' : 'CTA Title (EN)' },
    { key: 'titleAr', label: isAr ? 'عنوان CTA (AR)' : 'CTA Title (AR)' },
    { key: 'subtitleEn', label: isAr ? 'وصف CTA (EN)' : 'CTA Subtitle (EN)', type: 'textarea' },
    { key: 'subtitleAr', label: isAr ? 'وصف CTA (AR)' : 'CTA Subtitle (AR)', type: 'textarea' },
    { key: 'primaryButtonLabelEn', label: isAr ? 'زر رئيسي (EN)' : 'Primary Button (EN)' },
    { key: 'primaryButtonLabelAr', label: isAr ? 'زر رئيسي (AR)' : 'Primary Button (AR)' },
    { key: 'primaryButtonLink', label: isAr ? 'رابط الزر الرئيسي' : 'Primary Button Link' },
    { key: 'secondaryButtonLabelEn', label: isAr ? 'زر ثانوي (EN)' : 'Secondary Button (EN)' },
    { key: 'secondaryButtonLabelAr', label: isAr ? 'زر ثانوي (AR)' : 'Secondary Button (AR)' },
    { key: 'secondaryButtonLink', label: isAr ? 'رابط الزر الثانوي' : 'Secondary Button Link' }
  ]

  const inputClass = 'w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500'
  const textareaClass = 'w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[110px]'
  const labelClass = 'text-sm font-medium text-gray-700 dark:text-gray-200'
  const scrollSideClass = isAr ? 'left-6' : 'right-6'
  const scrollButtonClass = 'h-11 w-11 rounded-full border border-gray-200 bg-white text-gray-700 shadow-lg transition hover:border-blue-500 hover:text-blue-600 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-200'
  const iconOptions = [
    { value: '📄', labelAr: 'وثيقة', labelEn: 'Document' },
    { value: '📚', labelAr: 'مكتبة', labelEn: 'Library' },
    { value: '📘', labelAr: 'كتاب أزرق', labelEn: 'Blue Book' },
    { value: '📙', labelAr: 'كتاب برتقالي', labelEn: 'Orange Book' },
    { value: '📗', labelAr: 'كتاب أخضر', labelEn: 'Green Book' },
    { value: '📑', labelAr: 'أوراق', labelEn: 'Pages' },
    { value: '🧾', labelAr: 'سجل', labelEn: 'Record' },
    { value: '📊', labelAr: 'مخطط أعمدة', labelEn: 'Chart' },
    { value: '📈', labelAr: 'مخطط صاعد', labelEn: 'Growth' },
    { value: '📉', labelAr: 'مخطط هابط', labelEn: 'Decline' },
    { value: '📎', labelAr: 'مرفق', labelEn: 'Attachment' },
    { value: '🗂️', labelAr: 'ملفات', labelEn: 'Files' },
    { value: '🌍', labelAr: 'عالم', labelEn: 'World' },
    { value: '🧪', labelAr: 'مختبر', labelEn: 'Lab' },
    { value: '🧬', labelAr: 'أبحاث', labelEn: 'Research' },
    { value: '🌿', labelAr: 'بيئة', labelEn: 'Nature' },
    { value: '🏛️', labelAr: 'مؤسسة', labelEn: 'Institution' },
    { value: '🧭', labelAr: 'استكشاف', labelEn: 'Exploration' },
    { value: '🔬', labelAr: 'علم', labelEn: 'Science' },
    { value: '🛰️', labelAr: 'استشعار', labelEn: 'Satellite' },
    { value: '🧑‍🔬', labelAr: 'باحث', labelEn: 'Scientist' },
    { value: '🧑‍🏫', labelAr: 'أكاديمي', labelEn: 'Academic' }
  ]
  const gradientOptions = [
    { value: 'from-gray-500 to-gray-700', labelAr: 'رمادي داكن', labelEn: 'Dark Gray' },
    { value: 'from-slate-500 to-slate-700', labelAr: 'سلايت داكن', labelEn: 'Dark Slate' },
    { value: 'from-zinc-500 to-zinc-700', labelAr: 'زنك داكن', labelEn: 'Dark Zinc' },
    { value: 'from-stone-500 to-stone-700', labelAr: 'حجري داكن', labelEn: 'Dark Stone' },
    { value: 'from-blue-500 to-indigo-600', labelAr: 'أزرق إلى نيلي', labelEn: 'Blue to Indigo' },
    { value: 'from-indigo-500 to-purple-600', labelAr: 'نيلي إلى بنفسجي', labelEn: 'Indigo to Purple' },
    { value: 'from-purple-500 to-fuchsia-600', labelAr: 'بنفسجي إلى فوشيا', labelEn: 'Purple to Fuchsia' },
    { value: 'from-emerald-500 to-teal-600', labelAr: 'زمردي إلى تركوازي', labelEn: 'Emerald to Teal' },
    { value: 'from-green-500 to-emerald-600', labelAr: 'أخضر إلى زمردي', labelEn: 'Green to Emerald' },
    { value: 'from-teal-500 to-cyan-600', labelAr: 'تركوازي إلى سماوي', labelEn: 'Teal to Cyan' },
    { value: 'from-cyan-500 to-sky-600', labelAr: 'سماوي إلى أزرق سماوي', labelEn: 'Cyan to Sky' },
    { value: 'from-sky-500 to-blue-600', labelAr: 'أزرق سماوي إلى أزرق', labelEn: 'Sky to Blue' },
    { value: 'from-amber-500 to-orange-600', labelAr: 'كهرماني إلى برتقالي', labelEn: 'Amber to Orange' },
    { value: 'from-orange-500 to-rose-600', labelAr: 'برتقالي إلى وردي', labelEn: 'Orange to Rose' },
    { value: 'from-rose-500 to-pink-600', labelAr: 'وردي إلى زهري', labelEn: 'Rose to Pink' },
    { value: 'from-pink-500 to-purple-600', labelAr: 'زهري إلى بنفسجي', labelEn: 'Pink to Purple' }
  ]

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const scrollToBottom = () => {
    window.scrollTo({ top: document.documentElement.scrollHeight || 0, behavior: 'smooth' })
  }

  const scrollModalToTop = () => {
    if (modalContentRef.current) {
      modalContentRef.current.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  const scrollModalToBottom = () => {
    if (modalContentRef.current) {
      modalContentRef.current.scrollTo({ top: modalContentRef.current.scrollHeight || 0, behavior: 'smooth' })
    }
  }

  // ── Loading State ────────────────────────────────────────────────────
  if (showPreview && loading) {
    return (
      <div className="reports-page" dir={isAr ? 'rtl' : 'ltr'}>
        <style>{STYLES}</style>
        <div className="reports-loading">
          <div className="reports-loading__orbs">
            <FloatingOrb style={{ width: 500, height: 500, top: '-10%', left: '-5%', animationDelay: '0s' }} />
            <FloatingOrb style={{ width: 350, height: 350, bottom: '5%', right: '10%', animationDelay: '-3s' }} />
          </div>
          <div className="reports-loading__spinner">
            <div className="reports-loading__ring" />
            <span>{isAr ? 'جارٍ التحميل…' : 'Loading…'}</span>
          </div>
          <div className="reports-loading__grid">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        </div>
      </div>
    )
  }

  if (!showPreview) {
    return (
      <AdminLayout>
        <div className="p-6 space-y-6" dir={isAr ? 'rtl' : 'ltr'}>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {isAr ? 'إدارة التقارير' : 'Reports Management'}
              </h1>
              <p className="text-sm text-gray-500">
                {isAr ? 'تحديث التقارير والإعدادات والمحتوى المرتبط بها' : 'Manage reports, settings, and related content'}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => fetchContent()}
                className="rounded-lg border border-gray-200 dark:border-gray-700 px-4 py-2 text-sm font-semibold text-gray-700 dark:text-gray-200 hover:border-blue-500 hover:text-blue-600"
              >
                {isAr ? 'تحديث البيانات' : 'Refresh'}
              </button>
              {activeTab === 'reports' && (
                <button
                  type="button"
                  onClick={() => openCreate('report')}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  {isAr ? 'إضافة تقرير' : 'Add Report'}
                </button>
              )}
              {activeTab === 'categories' && (
                <button
                  type="button"
                  onClick={() => openCreate('category')}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  {isAr ? 'إضافة تصنيف' : 'Add Category'}
                </button>
              )}
              {activeTab === 'stats' && (
                <button
                  type="button"
                  onClick={() => openCreate('stat')}
                  className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                >
                  {isAr ? 'إضافة إحصائية' : 'Add Stat'}
                </button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.value}
                type="button"
                onClick={() => setActiveTab(tab.value)}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${activeTab === tab.value
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700'}`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900">
            {loading ? (
              <div className="py-12 text-center text-sm text-gray-500">
                {isAr ? 'جارٍ التحميل...' : 'Loading...'}
              </div>
            ) : (
              <>
                {activeTab === 'reports' && (
                  <div className="space-y-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder={isAr ? 'ابحث عن تقرير' : 'Search reports'}
                        className={inputClass}
                      />
                      <select
                        value={activeCategory}
                        onChange={(e) => setActiveCategory(e.target.value)}
                        className={inputClass}
                      >
                        <option value="all">{isAr ? 'كل التصنيفات' : 'All categories'}</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {isAr ? cat.nameAr : cat.nameEn}
                          </option>
                        ))}
                      </select>
                    </div>

                    {filteredAdminReports.length === 0 ? (
                      <div className="rounded-lg border border-dashed border-gray-200 p-8 text-center text-sm text-gray-500 dark:border-gray-700">
                        {isAr ? 'لا توجد تقارير مطابقة' : 'No reports found'}
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                          <thead className="text-left text-xs uppercase text-gray-500">
                            <tr>
                              <th className="px-3 py-2">{isAr ? 'العنوان' : 'Title'}</th>
                              <th className="px-3 py-2">{isAr ? 'التصنيف' : 'Category'}</th>
                              <th className="px-3 py-2">{isAr ? 'السنة' : 'Year'}</th>
                              <th className="px-3 py-2">{isAr ? 'مميز' : 'Featured'}</th>
                              <th className="px-3 py-2">{isAr ? 'الحالة' : 'Status'}</th>
                              <th className="px-3 py-2">{isAr ? 'الإجراءات' : 'Actions'}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {filteredAdminReports.map((report) => {
                              const matchedCategory = report.category || categories.find((cat) => cat.id === report.categoryId)
                              const categoryLabel = matchedCategory
                                ? (isAr ? matchedCategory.nameAr : matchedCategory.nameEn)
                                : '-'
                              return (
                                <tr key={report.id} className="border-t border-gray-100 dark:border-gray-800">
                                  <td className="px-3 py-2 font-medium text-gray-900 dark:text-white">
                                    {isAr ? report.titleAr : report.titleEn}
                                  </td>
                                  <td className="px-3 py-2 text-gray-600 dark:text-gray-300">{categoryLabel}</td>
                                  <td className="px-3 py-2 text-gray-600 dark:text-gray-300">{report.year || '-'}</td>
                                  <td className="px-3 py-2">
                                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${report.featured ? 'bg-amber-100 text-amber-700' : 'bg-gray-100 text-gray-600'}`}>
                                      {report.featured ? (isAr ? 'نعم' : 'Yes') : (isAr ? 'لا' : 'No')}
                                    </span>
                                  </td>
                                  <td className="px-3 py-2">
                                    <span className={`rounded-full px-2 py-1 text-xs font-semibold ${report.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                      {report.isActive ? (isAr ? 'نشط' : 'Active') : (isAr ? 'غير نشط' : 'Inactive')}
                                    </span>
                                  </td>
                                  <td className="px-3 py-2">
                                    <div className="flex flex-wrap gap-2">
                                      <button
                                        type="button"
                                        onClick={() => openEdit('report', report)}
                                        className="rounded-md border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-700 hover:border-blue-500 hover:text-blue-600 dark:border-gray-700 dark:text-gray-200"
                                      >
                                        {isAr ? 'تعديل' : 'Edit'}
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleDelete('reports', report.id)}
                                        className="rounded-md border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 hover:border-red-400"
                                      >
                                        {isAr ? 'حذف' : 'Delete'}
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'categories' && (
                  <div className="space-y-4">
                    {categories.length === 0 ? (
                      <div className="rounded-lg border border-dashed border-gray-200 p-8 text-center text-sm text-gray-500 dark:border-gray-700">
                        {isAr ? 'لا توجد تصنيفات بعد' : 'No categories yet'}
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                          <thead className="text-left text-xs uppercase text-gray-500">
                            <tr>
                              <th className="px-3 py-2">{isAr ? 'الاسم' : 'Name'}</th>
                              <th className="px-3 py-2">{isAr ? 'الرمز' : 'Slug'}</th>
                              <th className="px-3 py-2">{isAr ? 'الحالة' : 'Status'}</th>
                              <th className="px-3 py-2">{isAr ? 'الإجراءات' : 'Actions'}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {categories.map((cat) => (
                              <tr key={cat.id} className="border-t border-gray-100 dark:border-gray-800">
                                <td className="px-3 py-2 font-medium text-gray-900 dark:text-white">
                                  {isAr ? cat.nameAr : cat.nameEn}
                                </td>
                                <td className="px-3 py-2 text-gray-600 dark:text-gray-300">{cat.slug}</td>
                                <td className="px-3 py-2">
                                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${cat.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                    {cat.isActive ? (isAr ? 'نشط' : 'Active') : (isAr ? 'غير نشط' : 'Inactive')}
                                  </span>
                                </td>
                                <td className="px-3 py-2">
                                  <div className="flex flex-wrap gap-2">
                                    <button
                                      type="button"
                                      onClick={() => openEdit('category', cat)}
                                      className="rounded-md border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-700 hover:border-blue-500 hover:text-blue-600 dark:border-gray-700 dark:text-gray-200"
                                    >
                                      {isAr ? 'تعديل' : 'Edit'}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDelete('categories', cat.id)}
                                      className="rounded-md border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 hover:border-red-400"
                                    >
                                      {isAr ? 'حذف' : 'Delete'}
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'stats' && (
                  <div className="space-y-4">
                    {statistics.length === 0 ? (
                      <div className="rounded-lg border border-dashed border-gray-200 p-8 text-center text-sm text-gray-500 dark:border-gray-700">
                        {isAr ? 'لا توجد إحصائيات بعد' : 'No stats yet'}
                      </div>
                    ) : (
                      <div className="overflow-x-auto">
                        <table className="min-w-full text-sm">
                          <thead className="text-left text-xs uppercase text-gray-500">
                            <tr>
                              <th className="px-3 py-2">{isAr ? 'الرقم' : 'Number'}</th>
                              <th className="px-3 py-2">{isAr ? 'الوصف' : 'Label'}</th>
                              <th className="px-3 py-2">{isAr ? 'الحالة' : 'Status'}</th>
                              <th className="px-3 py-2">{isAr ? 'الإجراءات' : 'Actions'}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {statistics.map((stat) => (
                              <tr key={stat.id} className="border-t border-gray-100 dark:border-gray-800">
                                <td className="px-3 py-2 font-medium text-gray-900 dark:text-white">{stat.number}</td>
                                <td className="px-3 py-2 text-gray-600 dark:text-gray-300">
                                  {isAr ? stat.labelAr : stat.labelEn}
                                </td>
                                <td className="px-3 py-2">
                                  <span className={`rounded-full px-2 py-1 text-xs font-semibold ${stat.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}>
                                    {stat.isActive ? (isAr ? 'نشط' : 'Active') : (isAr ? 'غير نشط' : 'Inactive')}
                                  </span>
                                </td>
                                <td className="px-3 py-2">
                                  <div className="flex flex-wrap gap-2">
                                    <button
                                      type="button"
                                      onClick={() => openEdit('stat', stat)}
                                      className="rounded-md border border-gray-200 px-3 py-1 text-xs font-semibold text-gray-700 hover:border-blue-500 hover:text-blue-600 dark:border-gray-700 dark:text-gray-200"
                                    >
                                      {isAr ? 'تعديل' : 'Edit'}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDelete('stats', stat.id)}
                                      className="rounded-md border border-red-200 px-3 py-1 text-xs font-semibold text-red-600 hover:border-red-400"
                                    >
                                      {isAr ? 'حذف' : 'Delete'}
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      {settingsFields.map((field) => (
                        <div key={field.key} className="space-y-2">
                          <label className={labelClass}>{field.label}</label>
                          {field.type === 'textarea' ? (
                            <textarea
                              className={textareaClass}
                              value={settingsData[field.key] || ''}
                              onChange={(e) => setSettingsData((prev) => ({ ...prev, [field.key]: e.target.value }))}
                            />
                          ) : (
                            <input
                              className={inputClass}
                              value={settingsData[field.key] || ''}
                              onChange={(e) => setSettingsData((prev) => ({ ...prev, [field.key]: e.target.value }))}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSaveSection('settings', settingsData, setSettingsData)}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                      disabled={saving}
                    >
                      {saving ? (isAr ? 'جارٍ الحفظ...' : 'Saving...') : (isAr ? 'حفظ الإعدادات' : 'Save Settings')}
                    </button>
                  </div>
                )}

                {activeTab === 'unesco' && (
                  <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      {unescoFields.map((field) => (
                        <div key={field.key} className="space-y-2">
                          <label className={labelClass}>{field.label}</label>
                          {field.type === 'textarea' ? (
                            <textarea
                              className={textareaClass}
                              value={unescoData[field.key] || ''}
                              onChange={(e) => setUnescoData((prev) => ({ ...prev, [field.key]: e.target.value }))}
                            />
                          ) : (
                            <input
                              className={inputClass}
                              value={unescoData[field.key] || ''}
                              onChange={(e) => setUnescoData((prev) => ({ ...prev, [field.key]: e.target.value }))}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <label className={labelClass}>{isAr ? 'نقاط (EN)' : 'Bullets (EN)'}</label>
                        <textarea
                          className={textareaClass}
                          value={(unescoData.bulletsEn || []).join('\n')}
                          onChange={(e) => setUnescoData((prev) => ({
                            ...prev,
                            bulletsEn: e.target.value.split('\n').map((item) => item.trim()).filter(Boolean)
                          }))}
                        />
                      </div>
                      <div className="space-y-2">
                        <label className={labelClass}>{isAr ? 'نقاط (AR)' : 'Bullets (AR)'}</label>
                        <textarea
                          className={textareaClass}
                          value={(unescoData.bulletsAr || []).join('\n')}
                          onChange={(e) => setUnescoData((prev) => ({
                            ...prev,
                            bulletsAr: e.target.value.split('\n').map((item) => item.trim()).filter(Boolean)
                          }))}
                        />
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={Boolean(unescoData.isActive)}
                        onChange={(e) => setUnescoData((prev) => ({ ...prev, isActive: e.target.checked }))}
                      />
                      <span className={labelClass}>{isAr ? 'تفعيل القسم' : 'Enable section'}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSaveSection('unesco', unescoData, setUnescoData)}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                      disabled={saving}
                    >
                      {saving ? (isAr ? 'جارٍ الحفظ...' : 'Saving...') : (isAr ? 'حفظ قسم اليونسكو' : 'Save UNESCO')}
                    </button>
                  </div>
                )}

                {activeTab === 'cta' && (
                  <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      {ctaFields.map((field) => (
                        <div key={field.key} className="space-y-2">
                          <label className={labelClass}>{field.label}</label>
                          {field.type === 'textarea' ? (
                            <textarea
                              className={textareaClass}
                              value={ctaData[field.key] || ''}
                              onChange={(e) => setCtaData((prev) => ({ ...prev, [field.key]: e.target.value }))}
                            />
                          ) : (
                            <input
                              className={inputClass}
                              value={ctaData[field.key] || ''}
                              onChange={(e) => setCtaData((prev) => ({ ...prev, [field.key]: e.target.value }))}
                            />
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        checked={Boolean(ctaData.isActive)}
                        onChange={(e) => setCtaData((prev) => ({ ...prev, isActive: e.target.checked }))}
                      />
                      <span className={labelClass}>{isAr ? 'تفعيل القسم' : 'Enable section'}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSaveSection('cta', ctaData, setCtaData)}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                      disabled={saving}
                    >
                      {saving ? (isAr ? 'جارٍ الحفظ...' : 'Saving...') : (isAr ? 'حفظ نداء الإجراء' : 'Save CTA')}
                    </button>
                  </div>
                )}
              </>
            )}
          </div>

          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
              <div className="relative w-full max-w-3xl rounded-2xl bg-white shadow-xl dark:bg-gray-900">
                <button
                  type="button"
                  onClick={closeModal}
                  className="absolute top-4 left-4 w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                >
                  ✕
                </button>
                <div ref={modalContentRef} className="max-h-[80vh] overflow-y-auto p-6">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                      {modalMode === 'create'
                        ? (modalType === 'report' ? (isAr ? 'إضافة تقرير' : 'Add Report')
                          : modalType === 'category' ? (isAr ? 'إضافة تصنيف' : 'Add Category')
                            : (isAr ? 'إضافة إحصائية' : 'Add Stat'))
                        : (modalType === 'report' ? (isAr ? 'تعديل تقرير' : 'Edit Report')
                          : modalType === 'category' ? (isAr ? 'تعديل تصنيف' : 'Edit Category')
                            : (isAr ? 'تعديل إحصائية' : 'Edit Stat'))}
                    </h3>
                    <button type="button" onClick={closeModal} className="text-xl text-gray-400 hover:text-gray-600">×</button>
                  </div>

                  <div className="mt-4 grid gap-4 md:grid-cols-2">
                    {modalType === 'category' && (
                      <>
                        <div className="space-y-2">
                          <label className={labelClass}>{isAr ? 'الاسم (AR)' : 'Name (AR)'}</label>
                          <input className={inputClass} value={formData.nameAr || ''} onChange={(e) => setFormData((prev) => ({ ...prev, nameAr: e.target.value }))} />
                        </div>
                        <div className="space-y-2">
                          <label className={labelClass}>{isAr ? 'الاسم (EN)' : 'Name (EN)'}</label>
                          <input className={inputClass} value={formData.nameEn || ''} onChange={(e) => setFormData((prev) => ({ ...prev, nameEn: e.target.value }))} />
                        </div>
                        <div className="space-y-2">
                          <label className={labelClass}>{isAr ? 'Slug' : 'Slug'}</label>
                          <input className={inputClass} value={formData.slug || ''} onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))} />
                        </div>
                        <div className="space-y-2">
                          <label className={labelClass}>{isAr ? 'الأيقونة' : 'Icon'}</label>
                          <select className={inputClass} value={formData.icon || ''} onChange={(e) => setFormData((prev) => ({ ...prev, icon: e.target.value }))}>
                            <option value="">{isAr ? 'اختر أيقونة' : 'Select icon'}</option>
                            {iconOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.value} {isAr ? option.labelAr : option.labelEn}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className={labelClass}>{isAr ? 'التدرج' : 'Gradient'}</label>
                          <select className={inputClass} value={formData.gradient || ''} onChange={(e) => setFormData((prev) => ({ ...prev, gradient: e.target.value }))}>
                            <option value="">{isAr ? 'اختر تدرج' : 'Select gradient'}</option>
                            {gradientOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {isAr ? option.labelAr : option.labelEn}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className={labelClass}>{isAr ? 'الترتيب' : 'Order'}</label>
                          <input type="number" className={inputClass} value={formData.order ?? 0} onChange={(e) => setFormData((prev) => ({ ...prev, order: e.target.value }))} />
                        </div>
                        <div className="flex items-center gap-3">
                          <input type="checkbox" checked={Boolean(formData.isActive)} onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))} />
                          <span className={labelClass}>{isAr ? 'نشط' : 'Active'}</span>
                        </div>
                      </>
                    )}

                    {modalType === 'stat' && (
                      <>
                        <div className="space-y-2">
                          <label className={labelClass}>{isAr ? 'الرقم' : 'Number'}</label>
                          <input className={inputClass} value={formData.number || ''} onChange={(e) => setFormData((prev) => ({ ...prev, number: e.target.value }))} />
                        </div>
                        <div className="space-y-2">
                          <label className={labelClass}>{isAr ? 'الوصف (AR)' : 'Label (AR)'}</label>
                          <input className={inputClass} value={formData.labelAr || ''} onChange={(e) => setFormData((prev) => ({ ...prev, labelAr: e.target.value }))} />
                        </div>
                        <div className="space-y-2">
                          <label className={labelClass}>{isAr ? 'الوصف (EN)' : 'Label (EN)'}</label>
                          <input className={inputClass} value={formData.labelEn || ''} onChange={(e) => setFormData((prev) => ({ ...prev, labelEn: e.target.value }))} />
                        </div>
                        <div className="space-y-2">
                          <label className={labelClass}>{isAr ? 'الأيقونة' : 'Icon'}</label>
                          <select className={inputClass} value={formData.icon || ''} onChange={(e) => setFormData((prev) => ({ ...prev, icon: e.target.value }))}>
                            <option value="">{isAr ? 'اختر أيقونة' : 'Select icon'}</option>
                            {iconOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {option.value} {isAr ? option.labelAr : option.labelEn}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className={labelClass}>{isAr ? 'التدرج' : 'Gradient'}</label>
                          <select className={inputClass} value={formData.gradient || ''} onChange={(e) => setFormData((prev) => ({ ...prev, gradient: e.target.value }))}>
                            <option value="">{isAr ? 'اختر تدرج' : 'Select gradient'}</option>
                            {gradientOptions.map((option) => (
                              <option key={option.value} value={option.value}>
                                {isAr ? option.labelAr : option.labelEn}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className={labelClass}>{isAr ? 'الترتيب' : 'Order'}</label>
                          <input type="number" className={inputClass} value={formData.order ?? 0} onChange={(e) => setFormData((prev) => ({ ...prev, order: e.target.value }))} />
                        </div>
                        <div className="flex items-center gap-3">
                          <input type="checkbox" checked={Boolean(formData.isActive)} onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))} />
                          <span className={labelClass}>{isAr ? 'نشط' : 'Active'}</span>
                        </div>
                      </>
                    )}

                    {modalType === 'report' && (
                      <>
                        <div className="space-y-2">
                          <label className={labelClass}>{isAr ? 'العنوان (AR)' : 'Title (AR)'}</label>
                          <input className={inputClass} value={formData.titleAr || ''} onChange={(e) => setFormData((prev) => ({ ...prev, titleAr: e.target.value }))} />
                        </div>
                        <div className="space-y-2">
                          <label className={labelClass}>{isAr ? 'العنوان (EN)' : 'Title (EN)'}</label>
                          <input className={inputClass} value={formData.titleEn || ''} onChange={(e) => setFormData((prev) => ({ ...prev, titleEn: e.target.value }))} />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className={labelClass}>{isAr ? 'الوصف (AR)' : 'Description (AR)'}</label>
                          <textarea className={textareaClass} value={formData.descriptionAr || ''} onChange={(e) => setFormData((prev) => ({ ...prev, descriptionAr: e.target.value }))} />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className={labelClass}>{isAr ? 'الوصف (EN)' : 'Description (EN)'}</label>
                          <textarea className={textareaClass} value={formData.descriptionEn || ''} onChange={(e) => setFormData((prev) => ({ ...prev, descriptionEn: e.target.value }))} />
                        </div>
                        <div className="space-y-2">
                          <label className={labelClass}>{isAr ? 'السنة' : 'Year'}</label>
                          <input type="number" className={inputClass} value={formData.year || ''} onChange={(e) => setFormData((prev) => ({ ...prev, year: e.target.value }))} />
                        </div>
                        <div className="space-y-2">
                          <label className={labelClass}>{isAr ? 'عدد الصفحات' : 'Pages'}</label>
                          <input type="number" className={inputClass} value={formData.pages || ''} onChange={(e) => setFormData((prev) => ({ ...prev, pages: e.target.value }))} />
                        </div>
                        <div className="space-y-2">
                          <label className={labelClass}>{isAr ? 'اللغة (AR)' : 'Language (AR)'}</label>
                          <input className={inputClass} value={formData.languageAr || ''} onChange={(e) => setFormData((prev) => ({ ...prev, languageAr: e.target.value }))} />
                        </div>
                        <div className="space-y-2">
                          <label className={labelClass}>{isAr ? 'اللغة (EN)' : 'Language (EN)'}</label>
                          <input className={inputClass} value={formData.languageEn || ''} onChange={(e) => setFormData((prev) => ({ ...prev, languageEn: e.target.value }))} />
                        </div>
                        <div className="space-y-2">
                          <label className={labelClass}>{isAr ? 'حجم الملف' : 'File Size'}</label>
                          <input className={inputClass} value={formData.fileSize || ''} onChange={(e) => setFormData((prev) => ({ ...prev, fileSize: e.target.value }))} />
                        </div>
                        <div className="space-y-2">
                          <label className={labelClass}>{isAr ? 'رابط التحميل' : 'Download URL'}</label>
                          <input className={inputClass} value={formData.downloadUrl || ''} onChange={(e) => setFormData((prev) => ({ ...prev, downloadUrl: e.target.value }))} />
                        </div>
                        <div className="space-y-2">
                          <label className={labelClass}>{isAr ? 'التصنيف' : 'Category'}</label>
                          <select className={inputClass} value={formData.categoryId || ''} onChange={(e) => setFormData((prev) => ({ ...prev, categoryId: e.target.value }))}>
                            <option value="">{isAr ? 'اختر تصنيف' : 'Select category'}</option>
                            {categories.map((cat) => (
                              <option key={cat.id} value={cat.id}>
                                {isAr ? cat.nameAr : cat.nameEn}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className={labelClass}>{isAr ? 'الترتيب' : 'Order'}</label>
                          <input type="number" className={inputClass} value={formData.order ?? 0} onChange={(e) => setFormData((prev) => ({ ...prev, order: e.target.value }))} />
                        </div>
                        <div className="space-y-2 md:col-span-2">
                          <label className={labelClass}>{isAr ? 'المواضيع (مفصولة بفواصل)' : 'Topics (comma separated)'}</label>
                          <input className={inputClass} value={formData.topicsText || ''} onChange={(e) => setFormData((prev) => ({ ...prev, topicsText: e.target.value }))} />
                        </div>
                        <div className="flex items-center gap-3">
                          <input type="checkbox" checked={Boolean(formData.featured)} onChange={(e) => setFormData((prev) => ({ ...prev, featured: e.target.checked }))} />
                          <span className={labelClass}>{isAr ? 'مميز' : 'Featured'}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <input type="checkbox" checked={Boolean(formData.isActive)} onChange={(e) => setFormData((prev) => ({ ...prev, isActive: e.target.checked }))} />
                          <span className={labelClass}>{isAr ? 'نشط' : 'Active'}</span>
                        </div>
                      </>
                    )}
                  </div>

                  <div className="mt-6 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 hover:border-gray-300"
                    >
                      {isAr ? 'إلغاء' : 'Cancel'}
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveItem}
                      disabled={saving}
                      className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-60"
                    >
                      {saving ? (isAr ? 'جارٍ الحفظ...' : 'Saving...') : (isAr ? 'حفظ' : 'Save')}
                    </button>
                  </div>
                </div>
                {(showModalScrollTop || showModalScrollBottom) && (
                  <div className={`absolute ${scrollSideClass} top-5 flex flex-col gap-2`}>
                    {showModalScrollTop && (
                      <button type="button" onClick={scrollModalToTop} className={scrollButtonClass} aria-label={isAr ? 'التمرير للأعلى' : 'Scroll to top'}>
                        <svg viewBox="0 0 24 24" className="mx-auto h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 19V5" />
                          <path d="M5 12l7-7 7 7" />
                        </svg>
                      </button>
                    )}
                    {showModalScrollBottom && (
                      <button type="button" onClick={scrollModalToBottom} className={scrollButtonClass} aria-label={isAr ? 'التمرير للأسفل' : 'Scroll to bottom'}>
                        <svg viewBox="0 0 24 24" className="mx-auto h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 5v14" />
                          <path d="M5 12l7 7 7-7" />
                        </svg>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
          {(showScrollTop || showScrollBottom) && (
            <div className={`fixed ${scrollSideClass} bottom-6 z-40 flex flex-col gap-2`}>
              {showScrollTop && (
                <button type="button" onClick={scrollToTop} className={scrollButtonClass} aria-label={isAr ? 'التمرير للأعلى' : 'Scroll to top'}>
                  <svg viewBox="0 0 24 24" className="mx-auto h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 19V5" />
                    <path d="M5 12l7-7 7 7" />
                  </svg>
                </button>
              )}
              {showScrollBottom && (
                <button type="button" onClick={scrollToBottom} className={scrollButtonClass} aria-label={isAr ? 'التمرير للأسفل' : 'Scroll to bottom'}>
                  <svg viewBox="0 0 24 24" className="mx-auto h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M12 5v14" />
                    <path d="M5 12l7 7 7-7" />
                  </svg>
                </button>
              )}
            </div>
          )}
        </div>
      </AdminLayout>
    )
  }

  // ── Main Render ──────────────────────────────────────────────────────
  return (
    <div className="reports-page" dir={isAr ? 'rtl' : 'ltr'}>
      <style>{STYLES}</style>

      {/* ── AMBIENT ORBS ─────────────────────────────────────────────── */}
      <div className="reports-bg-orbs" aria-hidden>
        <FloatingOrb style={{ width: 900, height: 900, top: '-20%', left: '-15%', animationDelay: '0s' }} />
        <FloatingOrb style={{ width: 600, height: 600, top: '30%', right: '-10%', animationDelay: '-4s' }} />
        <FloatingOrb style={{ width: 400, height: 400, bottom: '10%', left: '20%', animationDelay: '-7s' }} />
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* HERO SECTION                                                   */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <section className="reports-hero">
        <div className="reports-hero__noise" />

        {/* Badge */}
        <div className="reports-hero__badge">
          <span className="reports-hero__badge-dot" />
          {isAr ? (settings.heroBadgeAr || 'مكتبة التقارير الرسمية') : (settings.heroBadgeEn || 'Official Reports Library')}
        </div>

        {/* Title */}
        <h1 className="reports-hero__title">
          <span className="reports-hero__title-line reports-hero__title-line--dim">
            {isAr ? (settings.heroTitleLine1Ar || 'تقارير') : (settings.heroTitleLine1En || 'Socotra')}
          </span>
          <span className="reports-hero__title-line reports-hero__title-line--accent">
            {isAr ? (settings.heroTitleLine2Ar || 'سقطرى') : (settings.heroTitleLine2En || 'Reports')}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="reports-hero__subtitle">
          {isAr
            ? (settings.heroSubtitleAr || 'تقارير اليونسكو، الدراسات الحكومية، أبحاث المنظمات، والأبحاث العلمية')
            : (settings.heroSubtitleEn || 'UNESCO reports, government studies, NGO research, and scientific papers')}
        </p>

        {/* CTA Buttons */}
        <div className="reports-hero__actions">
          <a href={settings.primaryButtonLink || '#reports-grid'} className="reports-btn reports-btn--primary">
            <span>{isAr ? (settings.primaryButtonLabelAr || 'تصفح التقارير') : (settings.primaryButtonLabelEn || 'Browse Reports')}</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </a>
          <a href={settings.secondaryButtonLink || '#stats'} className="reports-btn reports-btn--ghost">
            {isAr ? (settings.secondaryButtonLabelAr || 'الإحصائيات') : (settings.secondaryButtonLabelEn || 'Statistics')}
          </a>
        </div>

        {/* Quick counters */}
        <div className="reports-hero__counters">
          {[
            { v: reports.length, l: isAr ? 'تقرير' : 'Reports', icon: '📄' },
            { v: content.categories.length, l: isAr ? 'تصنيف' : 'Categories', icon: '🏷️' },
            { v: featuredReports.length, l: isAr ? 'مميّز' : 'Featured', icon: '⭐' },
          ].map((item, i) => (
            <div key={i} className="reports-hero__counter">
              <span className="reports-hero__counter-icon">{item.icon}</span>
              <strong>{item.v}</strong>
              <span>{item.l}</span>
            </div>
          ))}
        </div>

        {/* Hero Featured Report Card */}
        {heroReport && (
          <div className="reports-hero__card">
            <div className="reports-hero__card-meta">
              <span className="reports-badge reports-badge--year">{heroReport?.year}</span>
              <span className="reports-badge reports-badge--size">{heroReport?.fileSize}</span>
              <span className="reports-badge reports-badge--featured">
                ⭐ {isAr ? 'مميّز' : 'Featured'}
              </span>
            </div>
            <h3 className="reports-hero__card-title">
              {isAr ? heroReport?.titleAr : heroReport?.titleEn}
            </h3>
            <p className="reports-hero__card-desc">
              {isAr ? heroReport?.descriptionAr : heroReport?.descriptionEn}
            </p>
            <a href={heroReport?.downloadUrl || '#'} className="reports-btn reports-btn--download" target="_blank" rel="noopener noreferrer">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
              {downloadLabel}
            </a>
          </div>
        )}

        {/* Scroll indicator */}
        <div className="reports-hero__scroll">
          <div className="reports-hero__scroll-wheel" />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* STATISTICS                                                     */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <section id="stats" className="reports-stats">
        <div className="reports-section-header">
          <div className="reports-section-label">
            {isAr ? (settings.statsTitleAr || 'إحصائيات') : (settings.statsTitleEn || 'Key')}{' '}
            <strong>{isAr ? (settings.statsTitleHighlightAr || 'رئيسية') : (settings.statsTitleHighlightEn || 'Statistics')}</strong>
          </div>
        </div>
        <div className="reports-stats__grid">
          {statistics.map((stat, i) => (
            <AnimatedStat key={i} value={stat.number} label={isAr ? stat.labelAr : stat.labelEn} icon={stat.icon} />
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* SEARCH & FILTERS                                               */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <section className="reports-filters">
        {/* Search */}
        <div className="reports-search">
          <svg className="reports-search__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
          </svg>
          <input
            type="text"
            placeholder={isAr ? (settings.searchPlaceholderAr || 'ابحث في التقارير…') : (settings.searchPlaceholderEn || 'Search reports…')}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="reports-search__input"
          />
          {searchQuery && (
            <button className="reports-search__clear" onClick={() => setSearchQuery('')}>✕</button>
          )}
        </div>

        {/* Category Tabs */}
        <div className="reports-cats">
          {reportCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`reports-cat ${activeCategory === cat.id ? 'reports-cat--active' : ''}`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name[locale] || cat.name.en}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* FEATURED REPORTS                                               */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {featuredReports.length > 0 && (
        <section className="reports-featured">
          <div className="reports-section-header">
            <div className="reports-section-label">
              ⭐ {isAr ? (settings.featuredBadgeAr || 'تقارير مميزة') : (settings.featuredBadgeEn || 'Featured Reports')}
            </div>
            <h2 className="reports-section-title">
              {isAr ? (settings.featuredTitleAr || 'أهم التقارير') : (settings.featuredTitleEn || 'Most Important Reports')}
            </h2>
          </div>

          <div className="reports-featured__grid">
            {featuredReports.slice(0, 3).map((report, i) => {
              const catMeta = report.category || reportCategories.find(c => c.id === report.categoryId)
              const catLabel = report.category
                ? (isAr ? report.category.nameAr : report.category.nameEn)
                : catMeta?.name?.[locale] || catMeta?.name?.en
              return (
                <article key={report.id || i} className={`reports-featured__card reports-featured__card--${i + 1}`}>
                  <div className="reports-featured__card-glow" />
                  <div className="reports-featured__card-top">
                    <span className="reports-featured__cat-icon">{catMeta?.icon || '📄'}</span>
                    <span className="reports-badge reports-badge--year">{report.year}</span>
                  </div>
                  <div className="reports-featured__badge">
                    ⭐ {isAr ? (settings.featuredBadgeAr || 'مميّز') : (settings.featuredBadgeEn || 'Featured')}
                  </div>
                  <h3 className="reports-featured__title">
                    {isAr ? report.titleAr : report.titleEn}
                  </h3>
                  <p className="reports-featured__desc">
                    {isAr ? report.descriptionAr : report.descriptionEn}
                  </p>
                  {(report.topics || []).length > 0 && (
                    <div className="reports-featured__topics">
                      {(report.topics || []).slice(0, 3).map((topic, ti) => (
                        <span key={ti} className="reports-topic">{topic}</span>
                      ))}
                    </div>
                  )}
                  <div className="reports-featured__meta">
                    <span>📄 {report.pages} {isAr ? 'صفحة' : 'pages'}</span>
                    <span>💾 {report.fileSize}</span>
                  </div>
                  <div className="reports-featured__actions">
                    <a href={report.downloadUrl || '#'} className="reports-btn reports-btn--download" target="_blank" rel="noopener noreferrer">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                      {downloadLabel}
                    </a>
                    {catLabel && <span className="reports-badge reports-badge--cat">{catLabel}</span>}
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* ALL REPORTS GRID                                               */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <section id="reports-grid" className="reports-all">
        <div className="reports-section-header">
          <h2 className="reports-section-title">
            {isAr ? (settings.allReportsTitleAr || 'جميع') : (settings.allReportsTitleEn || 'All')}{' '}
            <span className="reports-section-title--accent">
              {isAr ? (settings.allReportsTitleHighlightAr || 'التقارير') : (settings.allReportsTitleHighlightEn || 'Reports')}
            </span>
          </h2>
          <div className="reports-all__count">
            <span className="reports-all__count-num">{filteredReports.length}</span>
            <span>{reportsCountLabel}</span>
          </div>
        </div>

        {filteredReports.length > 0 ? (
          <div className="reports-grid">
            {filteredReports.map((report, i) => {
              const catMeta = report.category || reportCategories.find(c => c.id === report.categoryId)
              const catLabel = report.category
                ? (isAr ? report.category.nameAr : report.category.nameEn)
                : catMeta?.name?.[locale] || catMeta?.name?.en
              return (
                <article key={report.id || i} className="reports-card" style={{ animationDelay: `${i * 60}ms` }}>
                  <div className="reports-card__accent" />
                  <div className="reports-card__header">
                    <span className="reports-card__cat-icon">{catMeta?.icon || '📄'}</span>
                    <div className="reports-card__badges">
                      {catLabel && <span className="reports-badge reports-badge--cat">{catLabel}</span>}
                      <span className="reports-badge reports-badge--year">{report.year}</span>
                    </div>
                  </div>
                  <h3 className="reports-card__title">
                    {isAr ? report.titleAr : report.titleEn}
                  </h3>
                  <p className="reports-card__desc">
                    {isAr ? report.descriptionAr : report.descriptionEn}
                  </p>
                  <div className="reports-card__meta">
                    <span>📄 {report.pages} {isAr ? 'صفحة' : 'pages'}</span>
                    <span>🌐 {isAr ? report.languageAr : report.languageEn}</span>
                    <span>💾 {report.fileSize}</span>
                  </div>
                  <a href={report.downloadUrl || '#'} className="reports-card__download" target="_blank" rel="noopener noreferrer">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="7 10 12 15 17 10" /><line x1="12" y1="15" x2="12" y2="3" /></svg>
                    {downloadLabel}
                  </a>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="reports-empty">
            <div className="reports-empty__icon">🔍</div>
            <h3>{isAr ? (settings.noResultsTitleAr || 'لا توجد نتائج') : (settings.noResultsTitleEn || 'No Results Found')}</h3>
            <p>{isAr ? (settings.noResultsTextAr || 'جرّب البحث بكلمات مختلفة') : (settings.noResultsTextEn || 'Try searching with different keywords')}</p>
            <button
              className="reports-btn reports-btn--primary"
              onClick={() => { setActiveCategory('all'); setSearchQuery('') }}
            >
              {isAr ? (settings.resetButtonLabelAr || 'إعادة تعيين') : (settings.resetButtonLabelEn || 'Reset')}
            </button>
          </div>
        )}
      </section>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* UNESCO SECTION                                                 */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <section className="reports-unesco">
        <div className="reports-unesco__inner">
          {/* Text */}
          <div className="reports-unesco__text">
            <div className="reports-section-label reports-section-label--light">
              🌍 {isAr ? (unescoSection.badgeAr || 'موقع تراث عالمي') : (unescoSection.badgeEn || 'UNESCO World Heritage Site')}
            </div>
            <h2 className="reports-unesco__title">
              {isAr ? (unescoSection.titleLine1Ar || 'سقطرى — تراث') : (unescoSection.titleLine1En || 'Socotra —')}{' '}
              <em>{isAr ? (unescoSection.titleLine2Ar || 'عالمي') : (unescoSection.titleLine2En || 'World Heritage')}</em>
            </h2>
            <p className="reports-unesco__desc">
              {isAr
                ? (unescoSection.descriptionAr || 'في عام 2008، أدرجت اليونسكو أرخبيل سقطرى كموقع تراث عالمي تقديراً لتنوعه البيولوجي الاستثنائي وأهميته العلمية العالمية.')
                : (unescoSection.descriptionEn || 'In 2008, UNESCO inscribed Socotra Archipelago as a World Heritage Site in recognition of its exceptional biodiversity and global scientific importance.')}
            </p>
            <ul className="reports-unesco__bullets">
              {(isAr ? (unescoSection.bulletsAr || []) : (unescoSection.bulletsEn || [])).map((item, idx) => (
                <li key={idx}>
                  <span className="reports-unesco__bullet-dot" />
                  {item}
                </li>
              ))}
            </ul>
            <a
              href={unescoSection.buttonLink || 'https://whc.unesco.org/en/list/1263'}
              className="reports-btn reports-btn--light"
              target="_blank"
              rel="noopener noreferrer"
            >
              🌐 {isAr ? (unescoSection.buttonLabelAr || 'موقع اليونسكو الرسمي') : (unescoSection.buttonLabelEn || 'Official UNESCO Page')}
            </a>
          </div>

          {/* Visual */}
          <div className="reports-unesco__visual">
            {unescoSection.imageUrl ? (
              <Image
                src={unescoSection.imageUrl}
                alt="Socotra UNESCO"
                fill
                className="reports-unesco__img"
              />
            ) : (
              <div className="reports-unesco__placeholder">
                <span>🌴</span>
                <p>Socotra Archipelago</p>
                <small>UNESCO World Heritage 2008</small>
              </div>
            )}
            <div className="reports-unesco__visual-badge">
              <span>🌍</span>
              <span>UNESCO</span>
              <strong>2008</strong>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* CTA SECTION                                                    */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <section className="reports-cta">
        <div className="reports-cta__glow" />
        <div className="reports-cta__content">
          <div className="reports-section-label">
            💬 {isAr ? 'تواصل معنا' : 'Get in Touch'}
          </div>
          <h2 className="reports-cta__title">
            {isAr ? (ctaSection.titleAr || 'هل لديك سؤال؟') : (ctaSection.titleEn || 'Have a Question?')}
          </h2>
          <p className="reports-cta__subtitle">
            {isAr
              ? (ctaSection.subtitleAr || 'للاستفسار عن التقارير أو طلب معلومات إضافية، تواصل معنا')
              : (ctaSection.subtitleEn || 'For inquiries about reports or additional information, contact us')}
          </p>
          <div className="reports-hero__actions">
            <Link href={ctaSection.primaryButtonLink || '/contact'} className="reports-btn reports-btn--primary">
              {isAr ? (ctaSection.primaryButtonLabelAr || 'تواصل معنا') : (ctaSection.primaryButtonLabelEn || 'Contact Us')}
            </Link>
            <Link href={ctaSection.secondaryButtonLink || '/about'} className="reports-btn reports-btn--ghost">
              {isAr ? (ctaSection.secondaryButtonLabelAr || 'المزيد عن سقطرى') : (ctaSection.secondaryButtonLabelEn || 'More About Socotra')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════
// STYLES  — Self-contained, zero external deps
// ══════════════════════════════════════════════════════════════════════
const STYLES = `
/* ── Variables ──────────────────────────────────────────────────── */
.reports-page {
  --c-bg:          #060b14;
  --c-surface:     #0d1526;
  --c-surface2:    #111e35;
  --c-border:      rgba(99,162,255,.12);
  --c-border2:     rgba(99,162,255,.22);
  --c-text:        #e8edf5;
  --c-muted:       #7b90b8;
  --c-accent:      #3d91ff;
  --c-accent2:     #06d6a0;
  --c-gold:        #f0c040;
  --c-orb1:        rgba(61,145,255,.07);
  --c-orb2:        rgba(6,214,160,.05);
  --font-display:  'Cairo', 'Inter', sans-serif;
  --font-body:     'Cairo', 'Inter', sans-serif;
  --r-card:        20px;
  --r-btn:         100px;
  --shadow-card:   0 8px 40px rgba(0,0,0,.45);
  --shadow-glow:   0 0 80px rgba(61,145,255,.18);

  font-family: var(--font-body);
  background: var(--c-bg);
  color: var(--c-text);
  min-height: 100vh;
  overflow-x: hidden;
  position: relative;
}

/* ── Google Fonts import hint ───────────────────────────────────── */
/* Fonts loaded globally via globals.css (Cairo + Inter) */

/* ── Ambient orbs ───────────────────────────────────────────────── */
.reports-bg-orbs { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
.reports-orb {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, var(--c-orb1) 0%, transparent 70%);
  animation: orbFloat 18s ease-in-out infinite alternate;
  pointer-events: none;
}
.reports-orb:nth-child(2) { background: radial-gradient(circle, var(--c-orb2) 0%, transparent 70%); }
@keyframes orbFloat {
  0%   { transform: translate(0, 0) scale(1); }
  100% { transform: translate(40px, -60px) scale(1.08); }
}

/* ── Shared wrappers ─────────────────────────────────────────────── */
.reports-page > * { position: relative; z-index: 1; }

/* ═════════════════════════════════════════════════════════════════ */
/* HERO                                                              */
/* ═════════════════════════════════════════════════════════════════ */
.reports-hero {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 120px 24px 80px;
  gap: 24px;
  position: relative;
}
.reports-hero__noise {
  position: absolute; inset: 0; z-index: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E");
  opacity: .6;
  pointer-events: none;
}
.reports-hero > * { position: relative; z-index: 1; }

.reports-hero__badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(61,145,255,.10);
  border: 1px solid rgba(61,145,255,.25);
  color: var(--c-accent);
  font-size: .78rem;
  font-weight: 600;
  letter-spacing: .1em;
  text-transform: uppercase;
  padding: 8px 20px;
  border-radius: var(--r-btn);
  animation: fadeDown .6s ease both;
}
.reports-hero__badge-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: var(--c-accent);
  box-shadow: 0 0 10px var(--c-accent);
  animation: pulse 2s infinite;
}
@keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.4)} }

.reports-hero__title {
  font-family: var(--font-display);
  display: flex;
  flex-direction: column;
  line-height: 1.05;
  animation: fadeDown .6s .1s ease both;
}
.reports-hero__title-line { display: block; }
.reports-hero__title-line--dim  { font-size: clamp(2.5rem, 7vw, 5rem); color: var(--c-muted); font-weight: 700; }
.reports-hero__title-line--accent {
  font-size: clamp(4rem, 13vw, 9rem);
  font-style: italic;
  background: linear-gradient(135deg, #60aaff 0%, #06d6a0 60%, #f0c040 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: none;
  filter: drop-shadow(0 0 60px rgba(61,145,255,.35));
}

.reports-hero__subtitle {
  max-width: 600px;
  color: var(--c-muted);
  font-size: 1.05rem;
  line-height: 1.7;
  animation: fadeDown .6s .2s ease both;
}

.reports-hero__actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
  animation: fadeDown .6s .3s ease both;
}

.reports-hero__counters {
  display: flex;
  gap: 2px;
  background: rgba(255,255,255,.03);
  border: 1px solid var(--c-border);
  border-radius: var(--r-card);
  overflow: hidden;
  animation: fadeDown .6s .4s ease both;
}
.reports-hero__counter {
  display: flex; flex-direction: column; align-items: center;
  gap: 2px;
  padding: 18px 32px;
  font-size: .85rem;
  color: var(--c-muted);
  border-inline-end: 1px solid var(--c-border);
  transition: background .2s;
}
.reports-hero__counter:last-child { border: none; }
.reports-hero__counter:hover { background: rgba(61,145,255,.05); }
.reports-hero__counter-icon { font-size: 1.3rem; margin-bottom: 2px; }
.reports-hero__counter strong { font-size: 1.6rem; font-family: var(--font-display); color: var(--c-text); }

/* Hero Card */
.reports-hero__card {
  width: 100%; max-width: 700px;
  background: linear-gradient(135deg, rgba(13,21,38,.9) 0%, rgba(17,30,53,.9) 100%);
  border: 1px solid var(--c-border2);
  border-radius: var(--r-card);
  padding: 28px 32px;
  text-align: start;
  backdrop-filter: blur(24px);
  box-shadow: var(--shadow-card), 0 0 60px rgba(61,145,255,.07);
  animation: fadeDown .6s .5s ease both;
}
.reports-hero__card-meta { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px; }
.reports-hero__card-title { font-family: var(--font-display); font-size: 1.4rem; font-weight: 700; margin: 0 0 10px; }
.reports-hero__card-desc { color: var(--c-muted); font-size: .9rem; line-height: 1.65; margin: 0 0 20px; }

/* Scroll indicator */
.reports-hero__scroll {
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  width: 26px; height: 40px;
  border: 2px solid var(--c-border2);
  border-radius: 13px;
  display: flex;
  justify-content: center;
  padding-top: 6px;
}
.reports-hero__scroll-wheel {
  width: 4px; height: 8px;
  border-radius: 2px;
  background: var(--c-accent);
  animation: scrollWheel 1.6s infinite;
}
@keyframes scrollWheel { 0%{opacity:1;transform:translateY(0)} 100%{opacity:0;transform:translateY(14px)} }

/* ═════════════════════════════════════════════════════════════════ */
/* BUTTONS                                                           */
/* ═════════════════════════════════════════════════════════════════ */
.reports-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 13px 26px;
  border-radius: var(--r-btn);
  font-size: .9rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  text-decoration: none;
  transition: all .22s;
  white-space: nowrap;
}
.reports-btn--primary {
  background: linear-gradient(135deg, var(--c-accent), #0a5fff);
  color: #fff;
  box-shadow: 0 6px 32px rgba(61,145,255,.35);
}
.reports-btn--primary:hover { transform: translateY(-2px); box-shadow: 0 10px 40px rgba(61,145,255,.5); }

.reports-btn--ghost {
  background: rgba(255,255,255,.05);
  border: 1px solid var(--c-border2);
  color: var(--c-text);
}
.reports-btn--ghost:hover { background: rgba(255,255,255,.09); border-color: rgba(99,162,255,.4); }

.reports-btn--download {
  background: rgba(6,214,160,.12);
  border: 1px solid rgba(6,214,160,.3);
  color: var(--c-accent2);
  padding: 10px 20px;
  font-size: .85rem;
}
.reports-btn--download:hover { background: rgba(6,214,160,.22); transform: translateY(-1px); }

.reports-btn--light {
  background: rgba(255,255,255,.12);
  border: 1px solid rgba(255,255,255,.25);
  color: #fff;
}
.reports-btn--light:hover { background: rgba(255,255,255,.2); }

/* ═════════════════════════════════════════════════════════════════ */
/* BADGES                                                            */
/* ═════════════════════════════════════════════════════════════════ */
.reports-badge {
  display: inline-flex; align-items: center;
  padding: 4px 12px;
  border-radius: var(--r-btn);
  font-size: .73rem;
  font-weight: 600;
  letter-spacing: .03em;
}
.reports-badge--year  { background: rgba(240,192,64,.12); border: 1px solid rgba(240,192,64,.25); color: var(--c-gold); }
.reports-badge--size  { background: rgba(61,145,255,.1); border: 1px solid rgba(61,145,255,.2); color: var(--c-accent); }
.reports-badge--cat   { background: rgba(6,214,160,.1); border: 1px solid rgba(6,214,160,.2); color: var(--c-accent2); }
.reports-badge--featured { background: rgba(240,192,64,.15); border: 1px solid rgba(240,192,64,.3); color: var(--c-gold); }

/* ═════════════════════════════════════════════════════════════════ */
/* SECTION HELPERS                                                   */
/* ═════════════════════════════════════════════════════════════════ */
.reports-section-header {
  text-align: center;
  margin-bottom: 48px;
}
.reports-section-label {
  display: inline-block;
  font-size: .78rem;
  font-weight: 700;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--c-accent);
  background: rgba(61,145,255,.08);
  border: 1px solid rgba(61,145,255,.18);
  padding: 6px 16px;
  border-radius: var(--r-btn);
  margin-bottom: 14px;
}
.reports-section-label--light { color: var(--c-accent2); background: rgba(6,214,160,.08); border-color: rgba(6,214,160,.2); }
.reports-section-title {
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 4vw, 3rem);
  font-weight: 900;
  margin: 0;
}
.reports-section-title--accent {
  background: linear-gradient(135deg, var(--c-accent), var(--c-accent2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ═════════════════════════════════════════════════════════════════ */
/* STATISTICS                                                        */
/* ═════════════════════════════════════════════════════════════════ */
.reports-stats {
  padding: 80px 24px;
  max-width: 1200px;
  margin: 0 auto;
}
.reports-stats__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}
.reports-stat {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--r-card);
  padding: 32px 24px;
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  text-align: center;
  opacity: 0;
  transform: translateY(30px);
  transition: opacity .6s ease, transform .6s ease, box-shadow .25s, border-color .25s;
}
.reports-stat--visible { opacity: 1; transform: translateY(0); }
.reports-stat:hover { border-color: var(--c-border2); box-shadow: 0 6px 40px rgba(61,145,255,.12); }
.reports-stat__icon { font-size: 2rem; }
.reports-stat__value { font-family: var(--font-display); font-size: 2.4rem; font-weight: 900; color: var(--c-accent); }
.reports-stat__label { font-size: .85rem; color: var(--c-muted); }

/* ═════════════════════════════════════════════════════════════════ */
/* SEARCH & FILTERS                                                  */
/* ═════════════════════════════════════════════════════════════════ */
.reports-filters {
  padding: 0 24px 48px;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
}
.reports-search {
  position: relative;
  width: 100%; max-width: 560px;
}
.reports-search__icon {
  position: absolute;
  inset-inline-start: 18px;
  top: 50%; transform: translateY(-50%);
  color: var(--c-muted);
  pointer-events: none;
}
.reports-search__input {
  width: 100%;
  padding: 14px 50px;
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--r-btn);
  color: var(--c-text);
  font-size: .95rem;
  font-family: var(--font-body);
  outline: none;
  transition: border-color .2s, box-shadow .2s;
}
.reports-search__input:focus { border-color: var(--c-accent); box-shadow: 0 0 0 4px rgba(61,145,255,.12); }
.reports-search__input::placeholder { color: var(--c-muted); }
.reports-search__clear {
  position: absolute;
  inset-inline-end: 16px;
  top: 50%; transform: translateY(-50%);
  background: none; border: none; cursor: pointer;
  color: var(--c-muted); font-size: .85rem;
  transition: color .2s;
}
.reports-search__clear:hover { color: var(--c-text); }

.reports-cats {
  display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;
}
.reports-cat {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 9px 20px;
  border-radius: var(--r-btn);
  font-size: .85rem; font-weight: 600;
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  color: var(--c-muted);
  cursor: pointer;
  transition: all .2s;
}
.reports-cat:hover { border-color: var(--c-border2); color: var(--c-text); background: var(--c-surface2); }
.reports-cat--active {
  background: linear-gradient(135deg, var(--c-accent), #0a5fff);
  border-color: transparent;
  color: #fff;
  box-shadow: 0 4px 20px rgba(61,145,255,.35);
  transform: scale(1.04);
}

/* ═════════════════════════════════════════════════════════════════ */
/* FEATURED REPORTS                                                  */
/* ═════════════════════════════════════════════════════════════════ */
.reports-featured {
  padding: 80px 24px;
  max-width: 1200px;
  margin: 0 auto;
}
.reports-featured__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
}
.reports-featured__card {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--r-card);
  padding: 28px;
  display: flex; flex-direction: column; gap: 14px;
  position: relative;
  overflow: hidden;
  transition: transform .25s, box-shadow .25s, border-color .25s;
}
.reports-featured__card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-card), 0 0 50px rgba(61,145,255,.12);
  border-color: var(--c-border2);
}
.reports-featured__card-glow {
  position: absolute; inset: 0;
  background: radial-gradient(circle at 30% 0%, rgba(61,145,255,.08) 0%, transparent 60%);
  pointer-events: none;
}
/* Gradient accent line per card */
.reports-featured__card--1 { border-top: 2px solid var(--c-accent); }
.reports-featured__card--2 { border-top: 2px solid var(--c-accent2); }
.reports-featured__card--3 { border-top: 2px solid var(--c-gold); }

.reports-featured__card-top { display: flex; justify-content: space-between; align-items: center; }
.reports-featured__cat-icon { font-size: 1.8rem; }
.reports-featured__badge { font-size: .73rem; font-weight: 700; color: var(--c-gold); letter-spacing: .05em; }
.reports-featured__title { font-family: var(--font-display); font-size: 1.15rem; font-weight: 700; margin: 0; line-height: 1.45; }
.reports-featured__desc { color: var(--c-muted); font-size: .87rem; line-height: 1.65; margin: 0; flex: 1; }

.reports-featured__topics { display: flex; flex-wrap: wrap; gap: 6px; }
.reports-topic {
  font-size: .72rem; font-weight: 600;
  background: rgba(61,145,255,.08); border: 1px solid rgba(61,145,255,.18);
  color: var(--c-accent); padding: 3px 10px; border-radius: var(--r-btn);
}

.reports-featured__meta { display: flex; gap: 16px; font-size: .8rem; color: var(--c-muted); }
.reports-featured__actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

/* ═════════════════════════════════════════════════════════════════ */
/* ALL REPORTS GRID                                                  */
/* ═════════════════════════════════════════════════════════════════ */
.reports-all {
  padding: 80px 24px;
  max-width: 1200px;
  margin: 0 auto;
}
.reports-all__count {
  display: inline-flex; align-items: center; gap: 8px;
  background: var(--c-surface); border: 1px solid var(--c-border);
  border-radius: var(--r-btn); padding: 6px 16px;
  font-size: .82rem; color: var(--c-muted);
  margin-top: 12px;
}
.reports-all__count-num { font-weight: 700; color: var(--c-accent); }

.reports-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.reports-card {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--r-card);
  padding: 22px;
  display: flex; flex-direction: column; gap: 12px;
  position: relative;
  overflow: hidden;
  opacity: 0;
  animation: cardReveal .5s ease forwards;
  transition: transform .22s, box-shadow .22s, border-color .22s;
}
.reports-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-card); border-color: var(--c-border2); }

.reports-card__accent {
  position: absolute; top: 0; inset-inline-start: 0;
  width: 3px; height: 0;
  background: linear-gradient(to bottom, var(--c-accent), var(--c-accent2));
  border-radius: 0 0 3px 3px;
  transition: height .35s ease;
}
.reports-card:hover .reports-card__accent { height: 100%; }

.reports-card__header { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; }
.reports-card__cat-icon { font-size: 1.6rem; flex-shrink: 0; }
.reports-card__badges { display: flex; flex-wrap: wrap; gap: 5px; }
.reports-card__title { font-family: var(--font-display); font-size: 1rem; font-weight: 700; line-height: 1.45; flex: 1; margin: 0; }
.reports-card__desc { color: var(--c-muted); font-size: .84rem; line-height: 1.6; margin: 0; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; flex: 1; }
.reports-card__meta { display: flex; flex-wrap: wrap; gap: 10px; font-size: .78rem; color: var(--c-muted); }
.reports-card__download {
  display: inline-flex; align-items: center; gap: 7px;
  background: rgba(6,214,160,.08); border: 1px solid rgba(6,214,160,.2);
  color: var(--c-accent2); padding: 9px 18px;
  border-radius: var(--r-btn); font-size: .83rem; font-weight: 600;
  text-decoration: none; transition: all .2s; align-self: flex-start;
}
.reports-card__download:hover { background: rgba(6,214,160,.18); transform: translateX(2px); }

@keyframes cardReveal { to { opacity: 1; } }

/* ─── Empty State ────────────────────────────────────────────────── */
.reports-empty {
  text-align: center; padding: 80px 24px;
  display: flex; flex-direction: column; align-items: center; gap: 16px;
}
.reports-empty__icon { font-size: 4rem; opacity: .4; }
.reports-empty h3 { font-family: var(--font-display); font-size: 1.5rem; margin: 0; }
.reports-empty p { color: var(--c-muted); margin: 0; }

/* ═════════════════════════════════════════════════════════════════ */
/* UNESCO SECTION                                                    */
/* ═════════════════════════════════════════════════════════════════ */
.reports-unesco {
  margin: 40px 24px 80px;
  max-width: 1200px;
  margin-inline: auto;
}
.reports-unesco__inner {
  background: linear-gradient(135deg, #0d1e3a 0%, #091429 50%, #0a2a1e 100%);
  border: 1px solid var(--c-border2);
  border-radius: 28px;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 480px;
}
.reports-unesco__text {
  padding: 56px 48px;
  display: flex; flex-direction: column; gap: 20px; justify-content: center;
}
.reports-unesco__title {
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 3.5vw, 2.8rem);
  font-weight: 900; line-height: 1.2; margin: 0;
}
.reports-unesco__title em { font-style: italic; color: var(--c-accent2); }
.reports-unesco__desc { color: var(--c-muted); line-height: 1.75; margin: 0; }
.reports-unesco__bullets { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
.reports-unesco__bullets li { display: flex; align-items: flex-start; gap: 12px; font-size: .9rem; color: var(--c-muted); }
.reports-unesco__bullet-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: var(--c-accent2); margin-top: 6px; flex-shrink: 0;
}

.reports-unesco__visual {
  position: relative;
  background: linear-gradient(135deg, #091a2a, #0a2520);
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
}
.reports-unesco__visual::before {
  content: '';
  position: absolute; inset: 0;
  background: radial-gradient(circle at 50% 50%, rgba(6,214,160,.1) 0%, transparent 70%);
}
.reports-unesco__img { object-fit: cover; transition: transform .5s ease; }
.reports-unesco__visual:hover .reports-unesco__img { transform: scale(1.04); }
.reports-unesco__placeholder {
  text-align: center; color: var(--c-muted); z-index: 1;
  display: flex; flex-direction: column; align-items: center; gap: 8px;
}
.reports-unesco__placeholder span { font-size: 5rem; filter: drop-shadow(0 0 30px rgba(6,214,160,.3)); }
.reports-unesco__placeholder p { font-family: var(--font-display); font-size: 1.2rem; color: var(--c-text); margin: 0; }
.reports-unesco__placeholder small { font-size: .78rem; }

.reports-unesco__visual-badge {
  position: absolute; top: 20px; inset-inline-end: 20px; z-index: 2;
  background: rgba(13,21,38,.9); border: 1px solid var(--c-border2);
  border-radius: 12px; padding: 12px 16px;
  display: flex; flex-direction: column; align-items: center; gap: 2px;
  backdrop-filter: blur(12px);
  font-size: .8rem; color: var(--c-muted);
}
.reports-unesco__visual-badge span:first-child { font-size: 1.4rem; }
.reports-unesco__visual-badge strong { color: var(--c-accent2); font-size: 1rem; }

/* ═════════════════════════════════════════════════════════════════ */
/* CTA SECTION                                                       */
/* ═════════════════════════════════════════════════════════════════ */
.reports-cta {
  padding: 100px 24px;
  text-align: center;
  position: relative;
}
.reports-cta__glow {
  position: absolute; inset: 0; pointer-events: none;
  background: radial-gradient(ellipse at 50% 100%, rgba(61,145,255,.09) 0%, transparent 65%);
}
.reports-cta__content {
  position: relative; z-index: 1;
  max-width: 600px; margin: 0 auto;
  display: flex; flex-direction: column; align-items: center; gap: 20px;
}
.reports-cta__title { font-family: var(--font-display); font-size: clamp(2rem,5vw,3.5rem); font-weight: 900; margin: 0; }
.reports-cta__subtitle { color: var(--c-muted); font-size: 1rem; line-height: 1.7; margin: 0; }

/* ═════════════════════════════════════════════════════════════════ */
/* LOADING STATE                                                     */
/* ═════════════════════════════════════════════════════════════════ */
.reports-loading { position: relative; min-height: 100vh; }
.reports-loading__orbs { position: fixed; inset: 0; pointer-events: none; overflow: hidden; }
.reports-loading__spinner {
  display: flex; flex-direction: column; align-items: center; gap: 16px;
  padding: 120px 24px 48px; color: var(--c-muted); font-size: .9rem;
}
.reports-loading__ring {
  width: 48px; height: 48px;
  border: 3px solid var(--c-border);
  border-top-color: var(--c-accent);
  border-radius: 50%;
  animation: spin .8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.reports-loading__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px; padding: 0 24px;
  max-width: 1200px; margin: 0 auto;
}
.reports-skeleton {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--r-card);
  padding: 24px;
  display: flex; flex-direction: column; gap: 14px;
}
.reports-skeleton__header { height: 40px; width: 40%; border-radius: 8px; background: var(--c-surface2); animation: shimmer 1.5s infinite; }
.reports-skeleton__line { height: 14px; border-radius: 7px; background: var(--c-surface2); animation: shimmer 1.5s infinite; }
.reports-skeleton__line--wide { width: 90%; }
.reports-skeleton__line--short { width: 60%; }
.reports-skeleton__footer { height: 36px; width: 45%; border-radius: var(--r-btn); background: var(--c-surface2); animation: shimmer 1.5s infinite; margin-top: 8px; }
@keyframes shimmer {
  0%   { opacity: 1; }
  50%  { opacity: .4; }
  100% { opacity: 1; }
}

/* ═════════════════════════════════════════════════════════════════ */
/* ANIMATIONS                                                        */
/* ═════════════════════════════════════════════════════════════════ */
@keyframes fadeDown {
  from { opacity: 0; transform: translateY(-18px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ═════════════════════════════════════════════════════════════════ */
/* RESPONSIVE                                                        */
/* ═════════════════════════════════════════════════════════════════ */
@media (max-width: 768px) {
  .reports-unesco__inner { grid-template-columns: 1fr; }
  .reports-unesco__visual { min-height: 280px; }
  .reports-unesco__text { padding: 36px 24px; }
  .reports-hero__counters { flex-direction: column; border-radius: var(--r-card); }
  .reports-hero__counter { border: none; border-bottom: 1px solid var(--c-border); }
  .reports-hero__counter:last-child { border: none; }
  .reports-hero__card { text-align: start; }
}

/* ─── RTL flip icon arrows ──────────────────────────────────────── */
[dir="rtl"] .reports-btn svg { transform: scaleX(-1); }
[dir="rtl"] .reports-card__download:hover { transform: translateX(-2px); }
[dir="rtl"] .reports-hero__scroll { right: 50%; left: auto; transform: translateX(50%); }
`
