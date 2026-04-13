
import { useState, useEffect, useCallback } from 'react'
import { useToast } from '@/components/admin/Toast'
import ImageUploader from '@/components/admin/ImageUploader'

export default function SettingsTab() {
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const { success, error: showError } = useToast()

  const fetchSettings = useCallback(async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/gallery/settings')
      const data = await response.json()
      if (data.success) {
        setSettings(data.data)
      }
    } catch (error) {
      showError('فشل في تحميل الإعدادات')
    } finally {
      setLoading(false)
    }
  }, [showError])

  useEffect(() => {
    fetchSettings()
  }, [fetchSettings])

  const handleSave = async () => {
    try {
      const response = await fetch('/api/admin/gallery/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      })

      const data = await response.json()
      if (data.success) {
        success('تم تحديث الإعدادات بنجاح')
        setSettings(data.data)
      } else {
        showError(data.error || 'فشل تحديث الإعدادات')
      }
    } catch (error) {
      showError('فشل حفظ الإعدادات')
    }
  }

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setSettings(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
  }

  if (loading) return (
    <div className="flex justify-center items-center h-64">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
    </div>
  )

  if (!settings) return <div className="text-center py-12 text-gray-500">لا توجد إعدادات</div>

  return (
    <div className="max-w-5xl mx-auto space-y-8" dir="rtl">

      {/* Hero Section */}
      <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
        <h3 className="text-2xl font-bold mb-6 text-blue-700 flex items-center gap-2 dark:text-blue-400">
          <span>🖼️</span> إعدادات القسم الرئيسي (Hero)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <ImageUploader
              label="صورة الغلاف"
              value={settings.heroImage || ''}
              onChange={(url) => setSettings(prev => ({ ...prev, heroImage: url }))}
              previewClassName="aspect-video"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 dark:text-gray-300">العنوان (عربي)</label>
            <input
              name="heroTitleAr"
              value={settings.heroTitleAr || ''}
              onChange={handleChange}
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50 focus:bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              placeholder="مثال: معرض صور سقطرى"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 dark:text-gray-300">العنوان (إنجليزي)</label>
            <input
              name="heroTitle"
              value={settings.heroTitle || ''}
              onChange={handleChange}
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50 focus:bg-white text-left dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              dir="ltr"
              placeholder="e.g. Socotra Photo Gallery"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 dark:text-gray-300">العنوان الفرعي (عربي)</label>
            <input
              name="heroSubtitleAr"
              value={settings.heroSubtitleAr || ''}
              onChange={handleChange}
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50 focus:bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              placeholder="مثال: عدسة واحدة، وجمال لا ينتهي"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 dark:text-gray-300">العنوان الفرعي (إنجليزي)</label>
            <input
              name="heroSubtitle"
              value={settings.heroSubtitle || ''}
              onChange={handleChange}
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all bg-gray-50 focus:bg-white text-left dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              dir="ltr"
              placeholder="e.g. One Lens, Infinite Beauty"
            />
          </div>
        </div>
      </div>

      {/* Instagram Settings */}
      <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
        <h3 className="text-2xl font-bold mb-6 text-pink-600 flex items-center gap-2 dark:text-pink-400">
          <span>📱</span> إعدادات قسم إنستغرام
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 dark:text-gray-300">اسم المستخدم (Username)</label>
            <input
              name="instagramUsername"
              value={settings.instagramUsername || ''}
              onChange={handleChange}
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all bg-gray-50 focus:bg-white text-left dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              dir="ltr"
              placeholder="@HawariTours"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 dark:text-gray-300">رابط الحساب (Profile URL)</label>
            <input
              name="instagramUrl"
              value={settings.instagramUrl || ''}
              onChange={handleChange}
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all bg-gray-50 focus:bg-white text-left dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              dir="ltr"
              placeholder="https://instagram.com/..."
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 dark:text-gray-300">عنوان القسم (عربي)</label>
            <input
              name="instagramTitleAr"
              value={settings.instagramTitleAr || ''}
              onChange={handleChange}
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all bg-gray-50 focus:bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              placeholder="تابعنا على إنستغرام"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 dark:text-gray-300">عنوان القسم (إنجليزي)</label>
            <input
              name="instagramTitle"
              value={settings.instagramTitle || ''}
              onChange={handleChange}
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-pink-500 outline-none transition-all bg-gray-50 focus:bg-white text-left dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              dir="ltr"
              placeholder="Follow us on Instagram"
            />
          </div>

        </div>
      </div>

      {/* Download Section Settings */}
      <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-green-600 flex items-center gap-2 dark:text-green-400">
            <span>📥</span> إعدادات قسم التحميل
          </h3>
          <div className="flex items-center gap-3 bg-green-50 px-4 py-2 rounded-xl dark:bg-green-900/20">
            <input
              type="checkbox"
              id="downloadEnabled"
              name="downloadEnabled"
              checked={settings.downloadEnabled}
              onChange={handleChange}
              className="w-5 h-5 text-green-600 rounded focus:ring-green-500"
            />
            <label htmlFor="downloadEnabled" className="text-sm font-bold text-green-700 cursor-pointer dark:text-green-400">تفعيل القسم</label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 dark:text-gray-300">العنوان (عربي)</label>
            <input
              name="downloadTitleAr"
              value={settings.downloadTitleAr || ''}
              onChange={handleChange}
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all bg-gray-50 focus:bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 dark:text-gray-300">العنوان (إنجليزي)</label>
            <input
              name="downloadTitle"
              value={settings.downloadTitle || ''}
              onChange={handleChange}
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all bg-gray-50 focus:bg-white text-left dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              dir="ltr"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-2 dark:text-gray-300">الوصف (عربي)</label>
            <textarea
              name="downloadDescriptionAr"
              value={settings.downloadDescriptionAr || ''}
              onChange={handleChange}
              rows={2}
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all bg-gray-50 focus:bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-2 dark:text-gray-300">الوصف (إنجليزي)</label>
            <textarea
              name="downloadDescription"
              value={settings.downloadDescription || ''}
              onChange={handleChange}
              rows={2}
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-green-500 outline-none transition-all bg-gray-50 focus:bg-white text-left dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              dir="ltr"
            />
          </div>
        </div>
      </div>

      {/* CTA Section Settings */}
      <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
        <h3 className="text-2xl font-bold mb-6 text-purple-600 flex items-center gap-2 dark:text-purple-400">
          <span>🚀</span> إعدادات قسم الدعوة لاتخاذ إجراء (CTA)
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 dark:text-gray-300">العنوان (عربي)</label>
            <input
              name="ctaTitleAr"
              value={settings.ctaTitleAr || ''}
              onChange={handleChange}
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all bg-gray-50 focus:bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 dark:text-gray-300">العنوان (إنجليزي)</label>
            <input
              name="ctaTitle"
              value={settings.ctaTitle || ''}
              onChange={handleChange}
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all bg-gray-50 focus:bg-white text-left dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              dir="ltr"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 dark:text-gray-300">نص الزر (عربي)</label>
            <input
              name="ctaButtonTextAr"
              value={settings.ctaButtonTextAr || ''}
              onChange={handleChange}
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all bg-gray-50 focus:bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />
          </div>
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2 dark:text-gray-300">نص الزر (إنجليزي)</label>
            <input
              name="ctaButtonText"
              value={settings.ctaButtonText || ''}
              onChange={handleChange}
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all bg-gray-50 focus:bg-white text-left dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              dir="ltr"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-2 dark:text-gray-300">الوصف (عربي)</label>
            <textarea
              name="ctaDescriptionAr"
              value={settings.ctaDescriptionAr || ''}
              onChange={handleChange}
              rows={2}
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all bg-gray-50 focus:bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-bold text-gray-700 mb-2 dark:text-gray-300">الوصف (إنجليزي)</label>
            <textarea
              name="ctaDescription"
              value={settings.ctaDescription || ''}
              onChange={handleChange}
              rows={2}
              className="w-full p-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all bg-gray-50 focus:bg-white text-left dark:bg-gray-700 dark:border-gray-600 dark:text-white dark:placeholder-gray-400"
              dir="ltr"
            />
          </div>
        </div>
      </div>

      {/* General Settings */}
      <div className="bg-white p-8 rounded-3xl shadow-lg border border-gray-100 dark:bg-gray-800 dark:border-gray-700">
        <h3 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">إعدادات عامة</h3>
        <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl dark:bg-gray-700">
          <input
            type="checkbox"
            id="statsEnabled"
            name="statsEnabled"
            checked={settings.statsEnabled}
            onChange={handleChange}
            className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
          />
          <label htmlFor="statsEnabled" className="font-bold text-gray-700 cursor-pointer dark:text-gray-300">عرض إحصائيات المعرض (عدد الصور، المشاهدات، الخ)</label>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-4 sticky bottom-8">
        <button
          onClick={handleSave}
          className="px-12 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold shadow-xl hover:shadow-2xl transition-all transform hover:scale-105 hover:-translate-y-1 text-lg"
        >
          💾 حفظ التغييرات
        </button>
      </div>

    </div>
  )
}
