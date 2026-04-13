
import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from '@/components/admin/Toast'
import ImageUploader from '@/components/admin/ImageUploader'
import Image from 'next/image'

export default function ImagesTab() {
  const [images, setImages] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('all')
  const { success, error: showError } = useToast()

  // New Image Modal
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const modalBodyRef = useRef(null)
  const [newImage, setNewImage] = useState({
    id: '',
    url: '',
    title: '',
    titleAr: '',
    description: '',
    descriptionAr: '',
    category: 'DESTINATIONS',
    featured: false,
    isActive: true
  })

  // Categories with Arabic Labels
  const categories = [
    { id: 'all', label: 'الكل' },
    { id: 'DESTINATIONS', label: 'وجهات سياحية' },
    { id: 'TOURS', label: 'رحلات وجولات' },
    { id: 'NATURE', label: 'طبيعة ومناظر' },
    { id: 'CULTURE', label: 'ثقافة وشعب' },
    { id: 'WILDLIFE', label: 'حياة برية' },
    { id: 'PEOPLE', label: 'ناس وحياة' }
  ]

  const fetchImages = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (activeCategory !== 'all') params.append('category', activeCategory)

      const response = await fetch(`/api/admin/gallery?${params}`)
      const data = await response.json()

      if (data.success) {
        setImages(data.data.images)
      }
    } catch (error) {
      console.error('Failed to fetch images:', error)
      showError('فشل في جلب الصور')
    } finally {
      setLoading(false)
    }
  }, [activeCategory, showError])

  useEffect(() => {
    fetchImages()
  }, [fetchImages])

  const handleUploadComplete = (url) => {
    setNewImage({ ...newImage, url })
  }

  const handleSaveImage = async () => {
    if (!newImage.url) {
      showError('الرجاء رفع صورة أولاً')
      return
    }

    try {
      const response = await fetch('/api/admin/gallery', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newImage)
      })

      const data = await response.json()
      if (data.success) {
        success(isEditing ? 'تم تحديث الصورة بنجاح' : 'تم إضافة الصورة بنجاح')
        setShowUploadModal(false)
        setIsEditing(false)
        setNewImage({
          id: '',
          url: '',
          title: '',
          titleAr: '',
          description: '',
          descriptionAr: '',
          category: 'DESTINATIONS',
          featured: false,
          isActive: true
        })
        fetchImages()
      } else {
        showError(data.error || (isEditing ? 'فشل تحديث الصورة' : 'فشل إضافة الصورة'))
      }
    } catch (error) {
      showError(isEditing ? 'فشل حفظ تحديثات الصورة' : 'فشل حفظ الصورة')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('هل أنت متأكد من حذف هذه الصورة؟')) return

    try {
      const response = await fetch('/api/admin/gallery', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })

      if (response.ok) {
        success('تم حذف الصورة')
        fetchImages()
      }
    } catch (error) {
      showError('فشل حذف الصورة')
    }
  }

  const handleToggleFeatured = async (image) => {
    try {
      const response = await fetch('/api/admin/gallery', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: image.id, featured: !image.featured })
      })
      const data = await response.json()
      if (data.success) {
        success(image.featured ? 'تم إلغاء تمييز الصورة' : 'تم تمييز الصورة')
        fetchImages()
      } else {
        showError(data.error || 'فشل تحديث الصورة')
      }
    } catch (error) {
      showError('فشل تحديث الصورة')
    }
  }

  const handleToggleActive = async (image) => {
    try {
      const response = await fetch('/api/admin/gallery', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: image.id, isActive: !image.isActive })
      })
      const data = await response.json()
      if (data.success) {
        success(image.isActive ? 'تم تعطيل الصورة' : 'تم تفعيل الصورة')
        fetchImages()
      } else {
        showError(data.error || 'فشل تحديث الصورة')
      }
    } catch (error) {
      showError('فشل تحديث الصورة')
    }
  }

  const handleEdit = (image) => {
    setNewImage({
      id: image.id,
      url: image.url || '',
      title: image.title || '',
      titleAr: image.titleAr || '',
      description: image.description || '',
      descriptionAr: image.descriptionAr || '',
      category: image.category || 'DESTINATIONS',
      featured: !!image.featured,
      isActive: image.isActive !== false
    })
    setIsEditing(true)
    setShowUploadModal(true)
  }

  const handleScrollModal = (direction) => {
    const el = modalBodyRef.current
    if (!el) return
    const top = direction === 'top' ? 0 : el.scrollHeight
    el.scrollTo({ top, behavior: 'smooth' })
  }

  return (
    <div dir="rtl">
      {/* Actions Bar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-8">
        {/* Category Filters */}
        <div className="flex flex-wrap gap-2">
          {categories.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-md transform scale-105'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600 dark:border-gray-600'
                }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Add Button */}
        <button
          onClick={() => {
            setIsEditing(false)
            setNewImage({
              id: '',
              url: '',
              title: '',
              titleAr: '',
              description: '',
              descriptionAr: '',
              category: 'DESTINATIONS',
              featured: false,
              isActive: true
            })
            setShowUploadModal(true)
          }}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
        >
          <span className="text-xl">➕</span>
          <span>إضافة صورة جديدة</span>
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6 animate-pulse">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
          ))}
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 dark:bg-gray-800/50 dark:border-gray-700">
          <div className="text-6xl mb-4 opacity-50">🖼️</div>
          <h3 className="text-xl font-bold text-gray-500 dark:text-gray-400">لا توجد صور في هذا التصنيف</h3>
          <p className="text-gray-400 dark:text-gray-500">أضف صوراً جديدة لتظهر هنا</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
          <AnimatePresence>
            {images.map((img) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative aspect-square bg-white dark:bg-gray-700 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all"
              >
                <Image
                  src={img.url}
                  alt={img.title || 'Gallery Image'}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                  <h4 className="text-white font-bold truncate text-sm">{img.title || img.titleAr || 'بدون عنوان'}</h4>
                  <p className="text-gray-300 text-xs mb-3">{categories.find(c => c.id === img.category)?.label}</p>

                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <button
                      onClick={() => handleToggleFeatured(img)}
                      className="py-2 bg-yellow-400/80 hover:bg-yellow-500 text-yellow-900 rounded-lg text-xs font-bold backdrop-blur-sm transition-colors"
                    >
                      {img.featured ? 'إلغاء التمييز' : 'تمييز'}
                    </button>
                    <button
                      onClick={() => handleToggleActive(img)}
                      className="py-2 bg-white/80 hover:bg-white text-gray-900 rounded-lg text-xs font-bold backdrop-blur-sm transition-colors"
                    >
                      {img.isActive ? 'تعطيل' : 'تفعيل'}
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleEdit(img)}
                      className="py-2 bg-blue-500/80 hover:bg-blue-600 text-white rounded-lg text-sm font-bold backdrop-blur-sm transition-colors"
                    >
                      تعديل
                    </button>
                    <button
                      onClick={() => handleDelete(img.id)}
                      className="py-2 bg-red-500/80 hover:bg-red-600 text-white rounded-lg text-sm font-bold backdrop-blur-sm transition-colors"
                    >
                      حذف
                    </button>
                  </div>
                </div>

                {/* Badges */}
                <div className="absolute top-2 left-2 flex gap-1">
                  {img.featured && (
                    <span className="bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                      ⭐ مميز
                    </span>
                  )}
                  {!img.isActive && (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                      معطل
                    </span>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl dark:bg-gray-800 dark:border dark:border-gray-700"
          >
            <div className="flex justify-between items-center mb-6 border-b pb-4 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{isEditing ? 'تعديل صورة' : 'إضافة صورة جديدة'}</h2>
              <button onClick={() => { setShowUploadModal(false); setIsEditing(false) }} className="text-gray-400 hover:text-red-500 text-2xl dark:text-gray-500 dark:hover:text-red-400">✕</button>
            </div>

            <div ref={modalBodyRef} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              {newImage.url ? (
                <div className="relative rounded-2xl overflow-hidden aspect-video group border-2 border-blue-500 bg-gray-100 dark:bg-gray-900">
                  <Image src={newImage.url} alt="Preview" fill className="object-contain" />
                  <button
                    onClick={() => setNewImage({ ...newImage, url: '' })}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-md transform hover:scale-110"
                  >
                    🗑️
                  </button>
                  <div className="absolute bottom-2 right-2 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-md">
                    تم الرفع بنجاح
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 hover:bg-blue-50 hover:border-blue-400 transition-all text-center dark:border-gray-600 dark:hover:bg-gray-700/50 dark:hover:border-blue-500">
                  <ImageUploader onUploadProp={handleUploadComplete} multiple={false} />
                  <p className="text-gray-400 text-sm mt-2">اسحب الصورة هنا أو انقر للرفع</p>
                </div>
              )}
              {newImage.url && (
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => setNewImage({ ...newImage, url: '' })}
                    className="py-2 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                  >
                    تغيير الصورة
                  </button>
                  <button
                    onClick={() => setNewImage({ ...newImage, url: '' })}
                    className="py-2 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all"
                  >
                    حذف الصورة
                  </button>
                </div>
              )}

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1 dark:text-gray-300">العنوان (عربي)</label>
                  <input
                    type="text"
                    value={newImage.titleAr}
                    onChange={e => setNewImage({ ...newImage, titleAr: e.target.value })}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    placeholder="مثال: غروب الشمس في ديحمري"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1 dark:text-gray-300">العنوان (إنجليزي)</label>
                  <input
                    type="text"
                    value={newImage.title}
                    onChange={e => setNewImage({ ...newImage, title: e.target.value })}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-left dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    dir="ltr"
                    placeholder="e.g. Sunset at Dihamri"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1 dark:text-gray-300">الوصف (عربي)</label>
                  <textarea
                    rows={3}
                    value={newImage.descriptionAr}
                    onChange={e => setNewImage({ ...newImage, descriptionAr: e.target.value })}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    placeholder="اكتب وصفاً مختصراً للصورة"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1 dark:text-gray-300">الوصف (إنجليزي)</label>
                  <textarea
                    rows={3}
                    value={newImage.description}
                    onChange={e => setNewImage({ ...newImage, description: e.target.value })}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all text-left dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    dir="ltr"
                    placeholder="Write a short description"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1 dark:text-gray-300">التصنيف</label>
                <select
                  value={newImage.category}
                  onChange={e => setNewImage({ ...newImage, category: e.target.value })}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  {categories.filter(c => c.id !== 'all').map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/40 border border-gray-200 dark:border-gray-600 rounded-xl p-3 font-bold text-gray-700 dark:text-gray-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newImage.featured}
                    onChange={e => setNewImage({ ...newImage, featured: e.target.checked })}
                    className="w-4 h-4"
                  />
                  صورة مميزة
                </label>
                <label className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/40 border border-gray-200 dark:border-gray-600 rounded-xl p-3 font-bold text-gray-700 dark:text-gray-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newImage.isActive}
                    onChange={e => setNewImage({ ...newImage, isActive: e.target.checked })}
                    className="w-4 h-4"
                  />
                  نشط في الموقع
                </label>
              </div>

              <div className="flex gap-3 mt-8">
                <button
                  onClick={handleSaveImage}
                  className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 text-white p-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1"
                >
                  {isEditing ? 'حفظ التعديلات' : 'حفظ الصورة'}
                </button>
                <button
                  onClick={() => { setShowUploadModal(false); setIsEditing(false) }}
                  className="px-6 bg-gray-100 text-gray-600 p-3 rounded-xl font-bold hover:bg-gray-200 transition-all dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                >
                  إلغاء
                </button>
              </div>
            </div>
            <div className="absolute bottom-4 left-4 flex flex-col gap-2">
              <button
                onClick={() => handleScrollModal('top')}
                className="w-9 h-9 rounded-full bg-white/90 text-gray-700 shadow-lg hover:bg-white transition-all dark:bg-gray-700 dark:text-gray-200"
              >
                ↑
              </button>
              <button
                onClick={() => handleScrollModal('bottom')}
                className="w-9 h-9 rounded-full bg-white/90 text-gray-700 shadow-lg hover:bg-white transition-all dark:bg-gray-700 dark:text-gray-200"
              >
                ↓
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}
