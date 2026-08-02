
import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from '@/components/admin/Toast'

export default function VideosTab() {
  const [videos, setVideos] = useState([])
  const [loading, setLoading] = useState(true)
  const { success, error: showError } = useToast()

  // New Video Modal
  const [showModal, setShowModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const modalBodyRef = useRef(null)
  const [newVideo, setNewVideo] = useState({
    id: '',
    title: '',
    titleAr: '',
    videoUrl: '',
    thumbnail: '',
    category: 'NATURE',
    featured: false,
    isActive: true
  })

  const categories = [
    { id: 'DESTINATIONS', label: 'وجهات سياحية' },
    { id: 'TOURS', label: 'رحلات وجولات' },
    { id: 'NATURE', label: 'طبيعة ومناظر' },
    { id: 'CULTURE', label: 'ثقافة وشعب' },
    { id: 'WILDLIFE', label: 'حياة برية' },
    { id: 'PEOPLE', label: 'ناس وحياة' }
  ]

  const fetchVideos = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/gallery/videos')
      const data = await response.json()
      if (data.success) {
        setVideos(data.data.videos)
      }
    } catch (error) {
      showError('فشل في تحميل الفيديوهات')
    } finally {
      setLoading(false)
    }
  }, [showError])

  useEffect(() => {
    fetchVideos()
  }, [fetchVideos])

  const handleSave = async () => {
    if (!newVideo.videoUrl || !newVideo.title) {
      showError('العنوان ورابط الفيديو مطلوبان')
      return
    }

    try {
      const response = await fetch('/api/admin/gallery/videos', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVideo)
      })

      const data = await response.json()
      if (data.success) {
        success(isEditing ? 'تم تحديث الفيديو بنجاح' : 'تم إضافة الفيديو بنجاح')
        setShowModal(false)
        setIsEditing(false)
        setNewVideo({
          id: '',
          title: '',
          titleAr: '',
          videoUrl: '',
          thumbnail: '',
          category: 'NATURE',
          featured: false,
          isActive: true
        })
        fetchVideos()
      } else {
        showError(data.error || (isEditing ? 'فشل تحديث الفيديو' : 'فشل إضافة الفيديو'))
      }
    } catch (error) {
      showError(isEditing ? 'فشل حفظ تحديثات الفيديو' : 'فشل حفظ الفيديو')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('هل أنت متأكد من حذف هذا الفيديو؟')) return

    try {
      const response = await fetch('/api/admin/gallery/videos', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })

      if (response.ok) {
        success('تم حذف الفيديو')
        fetchVideos()
      }
    } catch (error) {
      showError('فشل حذف الفيديو')
    }
  }

  const handleToggleFeatured = async (video) => {
    try {
      const response = await fetch('/api/admin/gallery/videos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: video.id, featured: !video.featured })
      })
      const data = await response.json()
      if (data.success) {
        success(video.featured ? 'تم إلغاء تمييز الفيديو' : 'تم تمييز الفيديو')
        fetchVideos()
      } else {
        showError(data.error || 'فشل تحديث الفيديو')
      }
    } catch (error) {
      showError('فشل تحديث الفيديو')
    }
  }

  const handleToggleActive = async (video) => {
    try {
      const response = await fetch('/api/admin/gallery/videos', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: video.id, isActive: !video.isActive })
      })
      const data = await response.json()
      if (data.success) {
        success(video.isActive ? 'تم تعطيل الفيديو' : 'تم تفعيل الفيديو')
        fetchVideos()
      } else {
        showError(data.error || 'فشل تحديث الفيديو')
      }
    } catch (error) {
      showError('فشل تحديث الفيديو')
    }
  }

  const handleEdit = (video) => {
    setNewVideo({
      id: video.id,
      title: video.title || '',
      titleAr: video.titleAr || '',
      videoUrl: video.videoUrl || '',
      thumbnail: video.thumbnail || '',
      category: video.category || 'NATURE',
      featured: !!video.featured,
      isActive: video.isActive !== false
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
          <h2 className="text-2xl font-bold text-purple-700 dark:text-purple-400">مكتبة الفيديو</h2>
          <p className="text-gray-500 text-sm dark:text-gray-400">أضف فيديوهات من يوتيوب لعرضها في المعرض</p>
        </div>
        <button
          onClick={() => {
            setIsEditing(false)
            setNewVideo({
              id: '',
              title: '',
              titleAr: '',
              videoUrl: '',
              thumbnail: '',
              category: 'NATURE',
              featured: false,
              isActive: true
            })
            setShowModal(true)
          }}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
        >
          <span className="text-xl">➕</span>
          <span>إضافة فيديو جديد</span>
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="aspect-video bg-gray-200 dark:bg-gray-700 rounded-2xl"></div>
          ))}
        </div>
      ) : videos.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 dark:bg-gray-800/50 dark:border-gray-700">
          <div className="text-6xl mb-4 opacity-50">🎬</div>
          <h3 className="text-xl font-bold text-gray-500 dark:text-gray-400">لا توجد فيديوهات</h3>
          <p className="text-gray-400 dark:text-gray-500">ابدأ بإضافة فيديوهات يوتيوب</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {videos.map((video) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-2xl overflow-hidden shadow-lg group hover:shadow-2xl transition-all border border-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:shadow-none"
              >
                <div className="relative aspect-video bg-black">
                  <iframe
                    src={video.videoUrl.replace('watch?v=', 'embed/')}
                    className="w-full h-full pointer-events-none"
                    title={video.title}
                  />
                  <div className="absolute top-2 left-2 flex gap-2">
                    {video.featured && (
                      <span className="bg-yellow-400 text-yellow-900 text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                        ⭐ مميز
                      </span>
                    )}
                    {!video.isActive && (
                      <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                        معطل
                      </span>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-start justify-end p-2 gap-2">
                    <button
                      onClick={() => handleEdit(video)}
                      className="p-2 bg-blue-600 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all transform translate-y-[-10px] group-hover:translate-y-0 hover:bg-blue-700 shadow-md"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(video.id)}
                      className="p-2 bg-red-600 text-white rounded-xl opacity-0 group-hover:opacity-100 transition-all transform translate-y-[-10px] group-hover:translate-y-0 hover:bg-red-700 shadow-md"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-gray-800 text-lg mb-1 line-clamp-1 dark:text-gray-200">{video.titleAr || video.title}</h3>
                  <h4 className="text-sm text-gray-500 line-clamp-1 dark:text-gray-400">{video.title}</h4>
                  <div className="mt-3 flex gap-2">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-bold rounded-full dark:bg-purple-900/40 dark:text-purple-300">
                      {categories.find(cat => cat.id === video.category)?.label || video.category}
                    </span>
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleToggleFeatured(video)}
                      className="py-2 bg-yellow-400/80 hover:bg-yellow-500 text-yellow-900 rounded-lg text-xs font-bold transition-colors"
                    >
                      {video.featured ? 'إلغاء التمييز' : 'تمييز'}
                    </button>
                    <button
                      onClick={() => handleToggleActive(video)}
                      className="py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg text-xs font-bold transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                    >
                      {video.isActive ? 'تعطيل' : 'تفعيل'}
                    </button>
                  </div>
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
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative bg-white rounded-3xl p-8 w-full max-w-lg shadow-2xl dark:bg-gray-800 dark:border dark:border-gray-700"
          >
            <div className="flex justify-between items-center mb-6 border-b pb-4 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{isEditing ? 'تعديل فيديو يوتيوب' : 'إضافة فيديو يوتيوب'}</h2>
              <button onClick={() => { setShowModal(false); setIsEditing(false) }} className="text-gray-400 hover:text-red-500 text-2xl dark:text-gray-500 dark:hover:text-red-400">✕</button>
            </div>

            <div ref={modalBodyRef} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1 dark:text-gray-300">رابط الفيديو (YouTube)</label>
                <input
                  type="text"
                  placeholder="https://youtube.com/watch?v=..."
                  value={newVideo.videoUrl}
                  onChange={e => setNewVideo({ ...newVideo, videoUrl: e.target.value })}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all text-left dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1 dark:text-gray-300">العنوان (عربي)</label>
                <input
                  type="text"
                  placeholder="مثال: جولة في غابة دم الأخوين"
                  value={newVideo.titleAr}
                  onChange={e => setNewVideo({ ...newVideo, titleAr: e.target.value })}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1 dark:text-gray-300">العنوان (إنجليزي)</label>
                <input
                  type="text"
                  placeholder="e.g. Dragon Blood Tree Forest Tour"
                  value={newVideo.title}
                  onChange={e => setNewVideo({ ...newVideo, title: e.target.value })}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all text-left dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                  dir="ltr"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1 dark:text-gray-300">التصنيف</label>
                <select
                  value={newVideo.category}
                  onChange={e => setNewVideo({ ...newVideo, category: e.target.value })}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                >
                  {categories.map(cat => (
                    <option key={cat.id} value={cat.id}>{cat.label}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <label className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/40 border border-gray-200 dark:border-gray-600 rounded-xl p-3 font-bold text-gray-700 dark:text-gray-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newVideo.featured}
                    onChange={e => setNewVideo({ ...newVideo, featured: e.target.checked })}
                    className="w-4 h-4"
                  />
                  فيديو مميز
                </label>
                <label className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/40 border border-gray-200 dark:border-gray-600 rounded-xl p-3 font-bold text-gray-700 dark:text-gray-200 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={newVideo.isActive}
                    onChange={e => setNewVideo({ ...newVideo, isActive: e.target.checked })}
                    className="w-4 h-4"
                  />
                  نشط في الموقع
                </label>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={handleSave}
                className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white p-3 rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
              >
                {isEditing ? 'حفظ التعديلات' : 'حفظ الفيديو'}
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
