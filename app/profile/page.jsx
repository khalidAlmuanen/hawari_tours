'use client'

// ═══════════════════════════════════════════════════════════════
// 👤 USER PROFILE & SETTINGS - Ultra Professional
// صفحة الملف الشخصي والإعدادات - احترافية جداً
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/contexts/AppContext'
import { useAuth } from '@/contexts/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

export default function ProfilePage() {
  const { locale } = useApp()
  const { user, checkAuth, logout } = useAuth()
  const router = useRouter()
  const isAr = locale === 'ar'

  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')
  const [bookings, setBookings] = useState([])
  const [messages, setMessages] = useState([])
  const [reviews, setReviews] = useState([])

  // Profile Data
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    avatar: ''
  })

  // Password Data
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [showPasswords, setShowPasswords] = useState(false)

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      router.push('/login')
    } else {
      setProfileData({
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        avatar: user.avatar || ''
      })
      fetchUserData()
    }
  }, [user])

  const fetchUserData = async () => {
    try {
      // Fetch user's bookings
      const bookingsRes = await fetch('/api/bookings')
      if (bookingsRes.ok) {
        const bookingsData = await bookingsRes.json()
        setBookings(bookingsData.data || [])
      }
      
      // You can add more API calls for messages, reviews, etc.
    } catch (err) {
      console.error('Failed to fetch user data:', err)
    }
  }

  // Update Profile
  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      })

      const result = await response.json()

      if (result.success) {
        setSuccess(isAr ? 'تم تحديث الملف الشخصي بنجاح! ✅' : 'Profile updated successfully! ✅')
        checkAuth()
      } else {
        setError(result.error || (isAr ? 'فشل في التحديث' : 'Failed to update'))
      }
    } catch (err) {
      setError(isAr ? 'خطأ في الشبكة' : 'Network error')
    } finally {
      setLoading(false)
    }
  }

  // Change Password
  const handleChangePassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (passwordData.newPassword.length < 6) {
      setError(isAr ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : 'Password must be at least 6 characters')
      setLoading(false)
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError(isAr ? 'كلمات المرور غير متطابقة' : 'Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      })

      const result = await response.json()

      if (result.success) {
        setSuccess(isAr ? 'تم تغيير كلمة المرور بنجاح! ✅' : 'Password changed successfully! ✅')
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      } else {
        setError(result.error || (isAr ? 'فشل في تغيير كلمة المرور' : 'Failed to change password'))
      }
    } catch (err) {
      setError(isAr ? 'خطأ في الشبكة' : 'Network error')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return null
  }

  const tabs = [
    { id: 'profile', label: { ar: 'الملف الشخصي', en: 'Profile' }, icon: '👤' },
    { id: 'bookings', label: { ar: 'حجوزاتي', en: 'My Bookings' }, icon: '📅' },
    { id: 'security', label: { ar: 'الأمان', en: 'Security' }, icon: '🔒' },
    { id: 'activity', label: { ar: 'النشاط', en: 'Activity' }, icon: '📊' }
  ]

  return (
    <div className={`min-h-screen bg-gray-50 dark:bg-gray-900 ${isAr ? 'rtl' : 'ltr'}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="flex items-center gap-6">
            {/* Avatar */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center text-6xl font-bold overflow-hidden shadow-2xl"
            >
              {profileData.avatar ? (
                <img src={profileData.avatar} alt="Avatar" className="w-full h-full object-cover" />
              ) : (
                user.name?.charAt(0).toUpperCase() || '👤'
              )}
            </motion.div>

            {/* Info */}
            <div className="flex-1">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-4xl font-black mb-2"
              >
                {user.name || (isAr ? 'مستخدم' : 'User')}
              </motion.h1>
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-white/90 text-lg mb-4"
              >
                {user.email}
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex gap-3"
              >
                <span className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-sm font-bold">
                  {user.role === 'SUPER_ADMIN' ? (isAr ? '👑 مدير عام' : '👑 Super Admin') :
                   user.role === 'ADMIN' ? (isAr ? '⚡ مدير' : '⚡ Admin') :
                   (isAr ? '👤 مستخدم' : '👤 User')}
                </span>
                <span className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-full text-sm font-bold">
                  ✅ {isAr ? 'نشط' : 'Active'}
                </span>
              </motion.div>
            </div>

            {/* Logout */}
            <button
              onClick={() => {
                logout()
                router.push('/')
              }}
              className="px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-md rounded-xl font-bold transition-all"
            >
              {isAr ? 'تسجيل خروج' : 'Logout'}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-12">
        
        {/* Messages */}
        <AnimatePresence>
          {success && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 bg-green-100 dark:bg-green-900/30 border border-green-500 rounded-2xl p-4 flex items-start gap-3"
            >
              <svg className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-green-800 dark:text-green-200">{success}</div>
            </motion.div>
          )}

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 bg-red-100 dark:bg-red-900/30 border border-red-500 rounded-2xl p-4 flex items-start gap-3"
            >
              <svg className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-red-800 dark:text-red-200">{error}</div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* Sidebar - Tabs */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-4 space-y-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full px-4 py-3 rounded-xl font-bold text-left transition-all ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  <span>{tab.label[locale]}</span>
                </button>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 mt-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                {isAr ? 'إحصائيات سريعة' : 'Quick Stats'}
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{isAr ? 'الحجوزات' : 'Bookings'}</span>
                  <span className="text-2xl font-bold text-blue-600">{bookings.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{isAr ? 'التقييمات' : 'Reviews'}</span>
                  <span className="text-2xl font-bold text-yellow-600">{reviews.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 dark:text-gray-400">{isAr ? 'الرسائل' : 'Messages'}</span>
                  <span className="text-2xl font-bold text-green-600">{messages.length}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8">
              
              {/* Profile Tab */}
              {activeTab === 'profile' && (
                <motion.form
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onSubmit={handleUpdateProfile}
                  className="space-y-6"
                >
                  <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-6">
                    {isAr ? 'معلومات الملف الشخصي' : 'Profile Information'}
                  </h2>

                  {/* Avatar URL */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                      {isAr ? 'رابط الصورة الشخصية' : 'Avatar URL'}
                    </label>
                    <input
                      type="url"
                      value={profileData.avatar}
                      onChange={(e) => setProfileData({...profileData, avatar: e.target.value})}
                      placeholder="https://example.com/avatar.jpg"
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white border-2 border-transparent focus:border-blue-500 transition-all"
                    />
                  </div>

                  {/* Name */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                      {isAr ? 'الاسم الكامل' : 'Full Name'}
                    </label>
                    <input
                      type="text"
                      required
                      value={profileData.name}
                      onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white border-2 border-transparent focus:border-blue-500 transition-all"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                      {isAr ? 'البريد الإلكتروني' : 'Email Address'}
                    </label>
                    <input
                      type="email"
                      required
                      value={profileData.email}
                      onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white border-2 border-transparent focus:border-blue-500 transition-all"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                      {isAr ? 'رقم الهاتف' : 'Phone Number'}
                    </label>
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white border-2 border-transparent focus:border-blue-500 transition-all"
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl transition-all disabled:opacity-50"
                  >
                    {loading ? (isAr ? 'جارِ الحفظ...' : 'Saving...') : (isAr ? 'حفظ التغييرات' : 'Save Changes')}
                  </button>
                </motion.form>
              )}

              {/* Bookings Tab */}
              {activeTab === 'bookings' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-6">
                    {isAr ? 'حجوزاتي' : 'My Bookings'}
                  </h2>

                  {bookings.length === 0 ? (
                    <div className="text-center py-12">
                      <div className="text-6xl mb-4">📅</div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                        {isAr ? 'لا توجد حجوزات' : 'No Bookings'}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400 mb-6">
                        {isAr ? 'ليس لديك أي حجوزات حالياً' : 'You have no bookings yet'}
                      </p>
                      <Link
                        href="/tours"
                        className="inline-block px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-xl transition-all"
                      >
                        {isAr ? 'تصفح الجولات' : 'Browse Tours'}
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {bookings.map((booking) => (
                        <div
                          key={booking.id}
                          className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 hover:shadow-lg transition-all"
                        >
                          <div className="flex items-center justify-between">
                            <div>
                              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                                {booking.tour?.title || 'N/A'}
                              </h3>
                              <div className="text-gray-600 dark:text-gray-400 space-y-1">
                                <p>📅 {new Date(booking.startDate).toLocaleDateString(locale)}</p>
                                <p>👥 {booking.numberOfPeople} {isAr ? 'شخص' : 'people'}</p>
                                <p>💰 ${booking.totalPrice}</p>
                              </div>
                            </div>
                            <div>
                              <span className={`px-4 py-2 rounded-full font-bold ${
                                booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-700' :
                                booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                                booking.status === 'CANCELLED' ? 'bg-red-100 text-red-700' :
                                'bg-gray-100 text-gray-700'
                              }`}>
                                {booking.status}
                              </span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <motion.form
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  onSubmit={handleChangePassword}
                  className="space-y-6"
                >
                  <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-6">
                    {isAr ? 'تغيير كلمة المرور' : 'Change Password'}
                  </h2>

                  {/* Current Password */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                      {isAr ? 'كلمة المرور الحالية' : 'Current Password'}
                    </label>
                    <div className="relative">
                      <input
                        type={showPasswords ? 'text' : 'password'}
                        required
                        value={passwordData.currentPassword}
                        onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                        className="w-full px-4 py-3 pr-12 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white border-2 border-transparent focus:border-blue-500 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPasswords(!showPasswords)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl hover:scale-110 transition-transform"
                      >
                        {showPasswords ? '🙈' : '👁️'}
                      </button>
                    </div>
                  </div>

                  {/* New Password */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                      {isAr ? 'كلمة المرور الجديدة' : 'New Password'}
                    </label>
                    <input
                      type={showPasswords ? 'text' : 'password'}
                      required
                      value={passwordData.newPassword}
                      onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white border-2 border-transparent focus:border-blue-500 transition-all"
                    />
                    <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                      {isAr ? 'على الأقل 6 أحرف' : 'Minimum 6 characters'}
                    </div>
                  </div>

                  {/* Confirm Password */}
                  <div>
                    <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                      {isAr ? 'تأكيد كلمة المرور' : 'Confirm New Password'}
                    </label>
                    <input
                      type={showPasswords ? 'text' : 'password'}
                      required
                      value={passwordData.confirmPassword}
                      onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white border-2 border-transparent focus:border-blue-500 transition-all"
                    />
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full px-6 py-4 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl transition-all disabled:opacity-50"
                  >
                    {loading ? (isAr ? 'جارِ التغيير...' : 'Changing...') : (isAr ? 'تغيير كلمة المرور' : 'Change Password')}
                  </button>
                </motion.form>
              )}

              {/* Activity Tab */}
              {activeTab === 'activity' && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-6">
                    {isAr ? 'نشاط الحساب' : 'Account Activity'}
                  </h2>

                  <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-2xl">
                          📅
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white">
                            {isAr ? 'تاريخ الانضمام' : 'Member Since'}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400">
                            {new Date(user.createdAt).toLocaleDateString(locale, {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                    </div>

                    {user.lastLogin && (
                      <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                        <div className="flex items-center gap-4 mb-4">
                          <div className="w-12 h-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-2xl">
                            🔐
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 dark:text-white">
                              {isAr ? 'آخر تسجيل دخول' : 'Last Login'}
                            </h3>
                            <p className="text-gray-600 dark:text-gray-400">
                              {new Date(user.lastLogin).toLocaleString(locale)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6">
                      <div className="flex items-center gap-4 mb-4">
                        <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-2xl">
                          ✉️
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white">
                            {isAr ? 'حالة البريد' : 'Email Status'}
                          </h3>
                          <p className="text-gray-600 dark:text-gray-400">
                            {user.emailVerified ? (
                              <span className="text-green-600 font-bold">✅ {isAr ? 'مُحقق' : 'Verified'}</span>
                            ) : (
                              <span className="text-yellow-600 font-bold">⏳ {isAr ? 'بانتظار التحقق' : 'Pending'}</span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
