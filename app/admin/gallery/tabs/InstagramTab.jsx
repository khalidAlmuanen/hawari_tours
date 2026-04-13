
import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from '@/components/admin/Toast'
import ImageUploader from '@/components/admin/ImageUploader'
import Image from 'next/image'

export default function InstagramTab() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const { success, error: showError } = useToast()

  // New Post Modal
  const [showModal, setShowModal] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const modalBodyRef = useRef(null)
  const [newPost, setNewPost] = useState({
    id: '',
    imageUrl: '',
    postUrl: '',
    likes: 0,
    comments: 0,
    isActive: true
  })

  const fetchPosts = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/gallery/instagram')
      const data = await response.json()
      if (data.success) {
        setPosts(data.data.posts)
      }
    } catch (error) {
      showError('فشل في تحميل منشورات إنستغرام')
    } finally {
      setLoading(false)
    }
  }, [showError])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  const handleUploadComplete = (url) => {
    setNewPost({ ...newPost, imageUrl: url })
  }

  const handleSave = async () => {
    if (!newPost.imageUrl) {
      showError('صورة المنشور مطلوبة')
      return
    }

    try {
      const response = await fetch('/api/admin/gallery/instagram', {
        method: isEditing ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost)
      })

      const data = await response.json()
      if (data.success) {
        success(isEditing ? 'تم تحديث المنشور بنجاح' : 'تم إضافة المنشور بنجاح')
        setShowModal(false)
        setIsEditing(false)
        setNewPost({ id: '', imageUrl: '', postUrl: '', likes: 0, comments: 0, isActive: true })
        fetchPosts()
      } else {
        showError(data.error || (isEditing ? 'فشل تحديث المنشور' : 'فشل إضافة المنشور'))
      }
    } catch (error) {
      showError(isEditing ? 'فشل حفظ تحديثات المنشور' : 'فشل حفظ المنشور')
    }
  }

  const handleDelete = async (id) => {
    if (!confirm('هل أنت متأكد من حذف هذا المنشور؟')) return

    try {
      const response = await fetch('/api/admin/gallery/instagram', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
      })

      if (response.ok) {
        success('تم حذف المنشور')
        fetchPosts()
      }
    } catch (error) {
      showError('فشل حذف المنشور')
    }
  }

  const handleToggleActive = async (post) => {
    try {
      const response = await fetch('/api/admin/gallery/instagram', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: post.id, isActive: !post.isActive })
      })
      const data = await response.json()
      if (data.success) {
        success(post.isActive ? 'تم تعطيل المنشور' : 'تم تفعيل المنشور')
        fetchPosts()
      } else {
        showError(data.error || 'فشل تحديث المنشور')
      }
    } catch (error) {
      showError('فشل تحديث المنشور')
    }
  }

  const handleEdit = (post) => {
    setNewPost({
      id: post.id,
      imageUrl: post.imageUrl || '',
      postUrl: post.postUrl || '',
      likes: post.likes || 0,
      comments: post.comments || 0,
      isActive: post.isActive !== false
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
          <h2 className="text-2xl font-bold text-pink-600 dark:text-pink-400">منشورات إنستغرام</h2>
          <p className="text-gray-500 text-sm dark:text-gray-400">اعرض أحدث الصور من حساب الإنستغرام الخاص بكم</p>
        </div>
        <button
          onClick={() => {
            setIsEditing(false)
            setNewPost({ id: '', imageUrl: '', postUrl: '', likes: 0, comments: 0, isActive: true })
            setShowModal(true)
          }}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-pink-500 to-rose-600 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
        >
          <span className="text-xl">➕</span>
          <span>إضافة منشور جديد</span>
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 animate-pulse">
          {[...Array(10)].map((_, i) => (
            <div key={i} className="aspect-square bg-gray-200 dark:bg-gray-700 rounded-xl"></div>
          ))}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200 dark:bg-gray-800/50 dark:border-gray-700">
          <div className="text-6xl mb-4 opacity-50">📸</div>
          <h3 className="text-xl font-bold text-gray-500 dark:text-gray-400">لا توجد منشورات</h3>
          <p className="text-gray-400 dark:text-gray-500">أضف صوراً لربطها بإنستغرام</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          <AnimatePresence>
            {posts.map((post) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="relative aspect-square bg-white rounded-xl overflow-hidden shadow-lg group hover:ring-4 ring-pink-500/30 transition-all dark:bg-gray-800"
              >
                <Image
                  src={post.imageUrl}
                  alt="Insta Post"
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {!post.isActive && (
                  <div className="absolute top-2 left-2 bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-sm">
                    معطل
                  </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white gap-2 backdrop-blur-sm">
                  <div className="flex gap-4 font-bold text-lg">
                    <span>❤️ {post.likes}</span>
                    <span>💬 {post.comments}</span>
                  </div>

                  <div className="flex gap-2 mt-4">
                    <a
                      href={post.postUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-3 bg-white/20 rounded-full hover:bg-white/40 hover:scale-110 transition-all"
                      title="عرض المنشور"
                    >
                      🔗
                    </a>
                    <button
                      onClick={() => handleDelete(post.id)}
                      className="p-3 bg-red-500/80 rounded-full hover:bg-red-600 hover:scale-110 transition-all"
                      title="حذف"
                    >
                      🗑️
                    </button>
                    <button
                      onClick={() => handleEdit(post)}
                      className="p-3 bg-blue-500/80 rounded-full hover:bg-blue-600 hover:scale-110 transition-all"
                      title="تعديل"
                    >
                      ✏️
                    </button>
                  </div>

                  <button
                    onClick={() => handleToggleActive(post)}
                    className="mt-4 px-4 py-2 bg-white/20 rounded-full hover:bg-white/40 transition-all text-sm font-bold"
                  >
                    {post.isActive ? 'تعطيل' : 'تفعيل'}
                  </button>
                </div>

                {/* Insta Icon */}
                <div className="absolute top-2 right-2 text-xl opacity-80 drop-shadow-md">
                  📸
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
            className="relative bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl dark:bg-gray-800 dark:border dark:border-gray-700"
          >
            <div className="flex justify-between items-center mb-6 border-b pb-4 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">{isEditing ? 'تعديل منشور إنستغرام' : 'إضافة منشور إنستغرام'}</h2>
              <button onClick={() => { setShowModal(false); setIsEditing(false) }} className="text-gray-400 hover:text-red-500 text-2xl dark:text-gray-500 dark:hover:text-red-400">✕</button>
            </div>

            <div ref={modalBodyRef} className="mb-4 max-h-[70vh] overflow-y-auto pr-1">
              {newPost.imageUrl ? (
                <div className="relative rounded-xl overflow-hidden aspect-square group mx-auto w-1/2 border-2 border-pink-500 bg-gray-100 dark:bg-gray-900">
                  <Image src={newPost.imageUrl} alt="Preview" fill className="object-cover" />
                  <button
                    onClick={() => setNewPost({ ...newPost, imageUrl: '' })}
                    className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 rounded-2xl p-6 hover:bg-pink-50 hover:border-pink-400 transition-all text-center dark:border-gray-600 dark:hover:bg-pink-900/10">
                  <ImageUploader onUploadProp={handleUploadComplete} multiple={false} className="py-4" />
                  <p className="text-gray-400 text-sm mt-2 dark:text-gray-500">صورة المنشور</p>
                </div>
              )}
              {newPost.imageUrl && (
                <div className="grid grid-cols-2 gap-3 mt-4">
                  <button
                    onClick={() => setNewPost({ ...newPost, imageUrl: '' })}
                    className="py-2 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-all dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
                  >
                    تغيير الصورة
                  </button>
                  <button
                    onClick={() => setNewPost({ ...newPost, imageUrl: '' })}
                    className="py-2 bg-red-500 text-white rounded-xl font-bold hover:bg-red-600 transition-all"
                  >
                    حذف الصورة
                  </button>
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1 dark:text-gray-300">رابط المنشور (URL)</label>
                <input
                  type="text"
                  placeholder="https://instagram.com/p/..."
                  value={newPost.postUrl}
                  onChange={e => setNewPost({ ...newPost, postUrl: e.target.value })}
                  className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all text-left dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
                  dir="ltr"
                />
              </div>

              <div className="flex gap-3 mb-4">
                <div className="w-1/2">
                  <label className="block text-sm font-bold text-gray-700 mb-1 dark:text-gray-300">الإعجابات</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={newPost.likes}
                    onChange={e => setNewPost({ ...newPost, likes: parseInt(e.target.value) })}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all text-center dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
                <div className="w-1/2">
                  <label className="block text-sm font-bold text-gray-700 mb-1 dark:text-gray-300">التعليقات</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={newPost.comments}
                    onChange={e => setNewPost({ ...newPost, comments: parseInt(e.target.value) })}
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all text-center dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  />
                </div>
              </div>

              <label className="flex items-center gap-3 bg-gray-50 dark:bg-gray-700/40 border border-gray-200 dark:border-gray-600 rounded-xl p-3 font-bold text-gray-700 dark:text-gray-200 cursor-pointer">
                <input
                  type="checkbox"
                  checked={newPost.isActive}
                  onChange={e => setNewPost({ ...newPost, isActive: e.target.checked })}
                  className="w-4 h-4"
                />
                نشط في الموقع
              </label>
            </div>

            <div className="flex gap-2 mt-6">
              <button
                onClick={handleSave}
                className="flex-1 bg-gradient-to-r from-pink-500 to-rose-600 text-white p-3 rounded-xl font-bold shadow-md hover:shadow-lg transition-all"
              >
                {isEditing ? 'حفظ التعديلات' : 'حفظ المنشور'}
              </button>
              <button
                onClick={() => { setShowModal(false); setIsEditing(false) }}
                className="px-6 bg-gray-100 text-gray-600 p-3 rounded-xl font-bold hover:bg-gray-200 transition-all dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
              >
                إلغاء
              </button>
            </div>
            <div className="absolute bottom-4 left-4 z-10 flex flex-col gap-2">
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
