
import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from '@/components/admin/Toast'

export default function VirtualToursTab() {
  const [tours, setTours] = useState([])
  const [loading, setLoading] = useState(true)
  const { success, error: showError } = useToast()

  // New Tour Modal
  const [showModal, setShowModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const modalBodyRef = useRef(null)
  const [newTour, setNewTour] = useState({
    id: '',
    title: '',
    titleAr: '',
    tourUrl: '',
    location: '',
    locationAr: '',
    featured: false,
    isActive: true
  })

  const fetchTours = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/gallery/virtual-tours')
      const data = await response.json()
      if (data.success) {
        setTours(data.data.virtualTours)
      }
    } catch (error) {
      showError('فشل في تحميل الجولات الافتراضية')
    } finally {
      setLoading(false)
    }
  }, [showError])

  useEffect(() => {
    fetchTours()
  }, [fetchTours])

  const handleSave = async () => {
    if (!newTour.tourUrl || !newTour.title) {
      showError('العنوان ورابط الجولة مطلوبان')
      return
    }

    try {
      const response = await fetch('/api/admin/gallery/virtual-tours', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTour)
      })

      const data = await response.json()
      if (data.success) {
        success(isEditing ? 'تم تحديث الجولة الافتراضية بنجاح' : 'تم إضافة الجولة الافتراضية بنجاح')
        setShowModal(false)
        setIsEditing(false)
        setNewTour({
          id: '',
          title: '',
          titleAr: '',
          tourUrl: '',
          location: '',
          locationAr: '',
          featured: false,
          isActive: true
        })
        fetchTours()
      } else {
        showError(data.error || (isEditing ? 'فشل تحديث الجولة' : 'فشل إضافة الجولة'))
      }
    } catch (error) {
      showError(isEditing ? 'فشل حفظ تحديثات الجولة' : 'فشل حفظ الجولة')
    }
  }

  const handleToggleFeatured = async (tour) => {
    try {
      const response = await fetch('/api/admin/gallery/virtual-tours', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: tour.id, featured: !tour.featured })
      })
      const data = await response.json()
      if (data.success) {
        success(tour.featured ? 'تم إلغاء تمييز الجولة' : 'تم تمييز الجولة')
        fetchTours()
      } else {
        showError(data.error || 'فشل تحديث الجولة')
      }
    } catch (error) {
      showError('فشل تحديث الجولة')
    }
  }

  const handleToggleActive = async (tour) => {
    try {
      const response = await fetch('/api/admin/gallery/virtual-tours', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: tour.id, isActive: !tour.isActive })
      })
      const data = await response.json()
      if (data.success) {
        success(tour.isActive ? 'تم تعطيل الجولة' : 'تم تفعيل الجولة')
        fetchTours()
      } else {
        showError(data.error || 'فشل تحديث الجولة')
      }
    } catch (error) {
      showError('فشل تحديث الجولة')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('هل أنت متأكد من حذف هذه الجولة؟')) return

    try {
      const response = await fetch('/api/admin/gallery/virtual-tours', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })

      if (response.ok) {
        success('تم حذف الجولة')
        fetchTours()
      }
    } catch (error) {
      showError('فشل حذف الجولة')
    }
  }

  const handleEdit = (tour) => {
    setNewTour({
      id: tour.id,
      title: tour.title || '',
      titleAr: tour.titleAr || '',
      tourUrl: tour.tourUrl || '',
      location: tour.location || '',
      locationAr: tour.locationAr || '',
      featured: !!tour.featured,
      isActive: tour.isActive !== false
    })
    setIsEditing(true)
    setShowModal(true)
  }

  const handleScrollModal = (direction) => {
    const el = modalBodyRef.current
    if (!el) return
    const top = direction === 'top' ? 0 : el.scrollHeight
    el.scrollTo({ top, behavior: 'smooth' })
  }

  return (
    <div dir="rtl">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-bold text-green-700 dark:text-green-400">الجولات الافتراضية 360°</h2>
          <p className="text-gray-500 text-sm dark:text-gray-400">أضف جولات تفاعلية من منصات مثل Kuula أو Matterport</p>
        </div>
        <button
          onClick={() => {
            setIsEditing(false)
            setNewTour({
              id: '',
              title: '',
              titleAr: '',
              tourUrl: '',
              location: '',
              locationAr: '',
              featured: false,
              isActive: true
            })
            setShowModal(true)
          }}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
        >
          <span className="text-xl">➕</span>
          <span>إضافة جولة جديدة</span>
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
          ))}
        </div>
      ) : tours.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 dark:bg-gray-800/50 dark:border-gray-700">
          <div className="text-6xl mb-4 opacity-50">🌐</div>
          <h3 className="text-xl font-bold text-gray-500 dark:text-gray-400">لا توجد جولات افتراضية</h3>
          <p className="text-gray-400 dark:text-gray-500">ابدأ بإضافة روابط للجولات</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {tours.map((tour) => (
              <motion.div
                key={tour.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg group p-6 border-r-4 border-green-500 hover:shadow-2xl transition-all dark:bg-gray-800 dark:border-gray-700 dark:shadow-none"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center text-2xl text-green-600 dark:bg-green-900/40 dark:text-green-300">
                    🌐
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(tour)}
                      className="p-2 bg-blue-50 text-blue-500 rounded-lg hover:bg-blue-100 hover:text-blue-700 transition-colors dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/40"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(tour.id)}
                      className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100 hover:text-red-700 transition-colors dark:bg-red-900/20 dark:text-red-400 dark:hover:bg-red-900/40"
                    >
                      🗑️
                    </button>
                  </div>
                </div>

                <div className="flex gap-2 mb-3">
                  {tour.featured && (
                    <span className="bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                      ⭐ مميز
                    </span>
                  )}
                  {!tour.isActive && (
                    <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                      معطل
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-xl text-gray-800 mb-1 dark:text-gray-200">{tour.titleAr || tour.title}</h3>
                <h4 className="text-sm text-gray-500 mb-4 dark:text-gray-400">{tour.title}</h4>

                <div className="flex items-center gap-2 text-sm text-gray-500 mb-6 dark:text-gray-400">
                  <span>📍</span>
                  <span>{tour.locationAr || tour.location || 'موقع غير محدد'}</span>
                </div>

                <div className="p-3 bg-gray-50 rounded-xl mb-6 text-xs font-mono text-gray-400 truncate dir-ltr text-left dark:bg-gray-700 dark:text-gray-500">
                  {tour.tourUrl}
                </div>

                <a
                  href={tour.tourUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full text-center py-3 bg-green-600 text-white rounded-xl font-bold hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
                >
                  عرض الجولة 🚀
                </a>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <button
                    onClick={() => handleToggleFeatured(tour)}
                    className="py-2 bg-yellow-400/80 hover:bg-yellow-500 text-yellow-900 rounded-lg text-xs font-bold transition-colors"
                  >
                    {tour.featured ? 'إلغاء التمييز' : 'تمييز'}
                  </button>
                  <button
                    onClick={() => handleToggleActive(tour)}
                    className="py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                  >
                    {tour.isActive ? 'تعطيل' : 'تفعيل'}
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="relative bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl dark:bg-gray-800 dark:border dark:border-gray-700"
          >
            <div className="flex justify-between items-center mb-6 border-b pb-4 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{isEditing ? 'تعديل جولة افتراضية' : 'إضافة جولة افتراضية'}</h2>
              <button onClick={() => { setShowModal(false); setIsEditing(false) }} className="text-gray-400 hover:text-red-500 text-2xl dark:text-gray-500 dark:hover:text-red-400">✕</button>
            </div>

            <div ref={modalBodyRef} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1 dark:text-gray-300">رابط الجولة (URL)</label>
                <input
                  type="text"
                  placeholder="https://kuula.co/share/..."
                  value={newTour.tourUrl}
                  onChange={e => setNewTour({ ...newTour, tourUrl: e.target.value })}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all text-left dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                  dir="ltr"
                />
                <p className="text-xs text-gray-400 mt-1 dark:text-gray-500">يدعم روابط Kuula, Matterport, Google Maps وغيرها</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1 dark:text-gray-300">العنوان (عربي)</label>
                  <input
                    type="text"
                    placeholder="مثال: مخيم ديهامري"
                    value={newTour.titleAr}
                    onChange={e => setNewTour({ ...newTour, titleAr: e.target.value })}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1 dark:text-gray-300">العنوان (إنجليزي)</label>
                  <input
                    type="text"
                    placeholder="e.g. Dihamri Camp"
                    value={newTour.title}
                    onChange={e => setNewTour({ ...newTour, title: e.target.value })}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all text-left dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1 dark:text-gray-300">الموقع (عربي)</label>
                  <input
                    type="text"
                    placeholder="مثال: سقطرى، اليمن"
                    value={newTour.locationAr}
                    onChange={e => setNewTour({ ...newTour, locationAr: e.target.value })}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1 dark:text-gray-300">الموقع (إنجليزي)</label>
                  <input
                    type="text"
                    placeholder="e.g. Socotra, Yemen"
                    value={newTour.location}
                    onChange={e => setNewTour({ ...newTour, location: e.target.value })}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all text-left dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/40 border border-gray-200 dark:border-gray-600 rounded-xl p-3 font-bold text-gray-700 dark:text-gray-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newTour.featured}
                    onChange={e => setNewTour({ ...newTour, featured: e.target.checked })}
                    className="w-4 h-4"
                  />
                  جولة مميزة
                </label>
                <label className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/40 border border-gray-200 dark:border-gray-600 rounded-xl p-3 font-bold text-gray-700 dark:text-gray-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newTour.isActive}
                    onChange={e => setNewTour({ ...newTour, isActive: e.target.checked })}
                    className="w-4 h-4"
                  />
                  نشط في الموقع
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={handleSave}
                className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white p-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
              >
                {isEditing ? 'حفظ التعديلات' : 'حفظ الجولة'}
              </button>
              <button
                onClick={() => { setShowModal(false); setIsEditing(false) }}
                className="px-6 bg-gray-100 text-gray-600 p-3 rounded-xl font-bold hover:bg-gray-200 transition-all dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                إلغاء
              </button>
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
