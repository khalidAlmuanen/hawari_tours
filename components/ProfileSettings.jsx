'use client'

// ═══════════════════════════════════════════════════════════════
// 👤 Profile Settings Component - Professional & Complete
// /components/ProfileSettings.jsx
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useAuth } from '@/contexts/AuthContext'
import { useApp } from '@/contexts/AppContext'

export default function ProfileSettings() {
  const { user, checkAuth } = useAuth()
  const { locale } = useApp()
  const isAr = locale === 'ar'
  
  const [activeTab, setActiveTab] = useState('profile')
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState('')
  const [error, setError] = useState('')

  // Profile Form
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    avatar: user?.avatar || ''
  })

  // Password Form
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [showPasswords, setShowPasswords] = useState(false)

  useEffect(() => {
    if (!user) return
    setProfileData({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      avatar: user.avatar || ''
    })
  }, [user])

  const labels = {
    title: isAr ? 'إعدادات الحساب' : 'Account Settings',
    subtitle: isAr ? 'إدارة بيانات الحساب والأمان والتفضيلات' : 'Manage your account settings, security, and preferences',
    profile: isAr ? 'الملف الشخصي' : 'Profile',
    security: isAr ? 'الأمان' : 'Security',
    preferences: isAr ? 'التفضيلات' : 'Preferences',
    saveChanges: isAr ? 'حفظ التغييرات' : 'Save Changes',
    saving: isAr ? 'جاري الحفظ...' : 'Saving...',
    changing: isAr ? 'جاري التغيير...' : 'Changing...',
    changePassword: isAr ? 'تغيير كلمة المرور' : 'Change Password',
    currentPassword: isAr ? 'كلمة المرور الحالية' : 'Current Password',
    newPassword: isAr ? 'كلمة المرور الجديدة' : 'New Password',
    confirmPassword: isAr ? 'تأكيد كلمة المرور الجديدة' : 'Confirm New Password',
    minChars: isAr ? 'الحد الأدنى 6 أحرف' : 'Minimum 6 characters',
    name: isAr ? 'الاسم الكامل' : 'Full Name',
    email: isAr ? 'البريد الإلكتروني' : 'Email Address',
    phone: isAr ? 'رقم الهاتف' : 'Phone Number',
    avatar: isAr ? 'رابط الصورة الشخصية' : 'Avatar URL',
    avatarPlaceholder: isAr ? 'https://example.com/avatar.jpg' : 'https://example.com/avatar.jpg',
    successProfile: isAr ? 'تم تحديث الملف الشخصي بنجاح' : 'Profile updated successfully!',
    successPassword: isAr ? 'تم تغيير كلمة المرور بنجاح' : 'Password changed successfully!',
    errorProfile: isAr ? 'تعذر تحديث الملف الشخصي' : 'Failed to update profile',
    errorPassword: isAr ? 'تعذر تغيير كلمة المرور' : 'Failed to change password',
    errorNetwork: isAr ? 'خطأ في الشبكة. حاول مرة أخرى.' : 'Network error. Please try again.',
    errorPasswordLength: isAr ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : 'Password must be at least 6 characters',
    errorPasswordMatch: isAr ? 'كلمتا المرور غير متطابقتين' : 'Passwords do not match',
    errorEmailRequired: isAr ? 'البريد الإلكتروني مطلوب' : 'Email is required',
    errorNameRequired: isAr ? 'الاسم مطلوب' : 'Name is required',
    preferencesTitle: isAr ? 'التفضيلات' : 'Preferences',
    preferencesDesc: isAr ? 'قريباً! إعدادات متقدمة للتحكم بالحساب.' : 'Coming soon! Advanced preferences will appear here.',
    role: isAr ? 'الدور' : 'Role',
    status: isAr ? 'الحالة' : 'Status',
    lastLogin: isAr ? 'آخر تسجيل دخول' : 'Last Login',
    createdAt: isAr ? 'تاريخ الإنشاء' : 'Created At',
    active: isAr ? 'نشط' : 'Active',
    inactive: isAr ? 'غير نشط' : 'Inactive'
  }

  const roleLabel = (() => {
    if (!user?.role) return isAr ? 'غير محدد' : 'Unknown'
    if (user.role === 'SUPER_ADMIN') return isAr ? 'مدير عام' : 'Super Admin'
    if (user.role === 'ADMIN') return isAr ? 'مدير' : 'Admin'
    return isAr ? 'مستخدم' : 'User'
  })()

  const formatDate = (value) => {
    if (!value) return isAr ? 'غير متاح' : 'N/A'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return isAr ? 'غير متاح' : 'N/A'
    return date.toLocaleString(isAr ? 'ar' : 'en')
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    if (!profileData.name?.trim()) {
      setError(labels.errorNameRequired)
      setLoading(false)
      return
    }
    if (!profileData.email?.trim()) {
      setError(labels.errorEmailRequired)
      setLoading(false)
      return
    }

    try {
      const response = await fetch('/api/auth/me', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profileData.name.trim(),
          email: profileData.email.trim().toLowerCase(),
          phone: profileData.phone?.trim() || '',
          avatar: profileData.avatar?.trim() || ''
        })
      })

      const result = await response.json()

      if (result.success) {
        setSuccess(labels.successProfile)
        checkAuth()
      } else {
        setError(result.error || labels.errorProfile)
      }
    } catch (err) {
      setError(labels.errorNetwork)
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

    // Validation
    if (passwordData.newPassword.length < 6) {
      setError(labels.errorPasswordLength)
      setLoading(false)
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setError(labels.errorPasswordMatch)
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
        setSuccess(labels.successPassword)
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        })
      } else {
        setError(result.error || labels.errorPassword)
      }
    } catch (err) {
      setError(labels.errorNetwork)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-8">
      
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">
          {labels.title}
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          {labels.subtitle}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="rounded-2xl bg-white dark:bg-gray-800 shadow-lg p-4 border border-gray-100 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{labels.role}</div>
          <div className="text-lg font-bold text-gray-900 dark:text-white">{roleLabel}</div>
        </div>
        <div className="rounded-2xl bg-white dark:bg-gray-800 shadow-lg p-4 border border-gray-100 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{labels.status}</div>
          <div className={`text-lg font-bold ${user?.isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}>
            {user?.isActive ? labels.active : labels.inactive}
          </div>
        </div>
        <div className="rounded-2xl bg-white dark:bg-gray-800 shadow-lg p-4 border border-gray-100 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{labels.lastLogin}</div>
          <div className="text-sm font-semibold text-gray-900 dark:text-white">{formatDate(user?.lastLogin)}</div>
        </div>
        <div className="rounded-2xl bg-white dark:bg-gray-800 shadow-lg p-4 border border-gray-100 dark:border-gray-700">
          <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{labels.createdAt}</div>
          <div className="text-sm font-semibold text-gray-900 dark:text-white">{formatDate(user?.createdAt)}</div>
        </div>
      </div>

      {/* Messages */}
      {success && (
        <div className="mb-6 bg-green-100 dark:bg-green-900/30 border border-green-500 rounded-2xl p-4 flex items-start gap-3">
          <svg className="w-6 h-6 text-green-600 dark:text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-green-800 dark:text-green-200">{success}</div>
        </div>
      )}

      {error && (
        <div className="mb-6 bg-red-100 dark:bg-red-900/30 border border-red-500 rounded-2xl p-4 flex items-start gap-3">
          <svg className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div className="text-red-800 dark:text-red-200">{error}</div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
        
        {/* Tab Headers */}
        <div className="flex border-b border-gray-200 dark:border-gray-700">
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex-1 px-6 py-4 font-bold transition-colors ${
              activeTab === 'profile'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            👤 {labels.profile}
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`flex-1 px-6 py-4 font-bold transition-colors ${
              activeTab === 'security'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            🔒 {labels.security}
          </button>
          <button
            onClick={() => setActiveTab('preferences')}
            className={`flex-1 px-6 py-4 font-bold transition-colors ${
              activeTab === 'preferences'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            ⚙️ {labels.preferences}
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-8">
          
          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <form onSubmit={handleUpdateProfile} className="space-y-6">
              
              {/* Avatar */}
              <div className="flex items-center gap-6">
                <div className="relative w-24 h-24 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white text-3xl font-bold overflow-hidden">
                  {profileData.avatar ? (
                    <Image src={profileData.avatar} alt="Avatar" fill className="object-cover" sizes="96px" />
                  ) : (
                    user?.name?.charAt(0) || 'U'
                  )}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                    {labels.avatar}
                  </label>
                  <input
                    type="url"
                    value={profileData.avatar}
                    onChange={(e) => setProfileData({...profileData, avatar: e.target.value})}
                    placeholder={labels.avatarPlaceholder}
                    className="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white"
                  />
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                  {labels.name}
                </label>
                <input
                  type="text"
                  required
                  value={profileData.name}
                  onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                  {labels.email}
                </label>
                <input
                  type="email"
                  required
                  value={profileData.email}
                  onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white"
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                  {labels.phone}
                </label>
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-xl transition-all disabled:opacity-50"
              >
                {loading ? labels.saving : labels.saveChanges}
              </button>
            </form>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <form onSubmit={handleChangePassword} className="space-y-6">
              
              {/* Current Password */}
              <div>
                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                  {labels.currentPassword}
                </label>
                <div className="relative">
                  <input
                    type={showPasswords ? 'text' : 'password'}
                    required
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    className="w-full px-4 py-3 pr-12 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords(!showPasswords)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPasswords ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                  {labels.newPassword}
                </label>
                <input
                  type={showPasswords ? 'text' : 'password'}
                  required
                  value={passwordData.newPassword}
                  onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white"
                />
                <div className="mt-2 text-xs text-gray-600 dark:text-gray-400">
                  {labels.minChars}
                </div>
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                  {labels.confirmPassword}
                </label>
                <input
                  type={showPasswords ? 'text' : 'password'}
                  required
                  value={passwordData.confirmPassword}
                  onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                  className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white"
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-3 bg-gradient-to-r from-red-600 to-pink-600 text-white rounded-xl font-bold hover:shadow-xl transition-all disabled:opacity-50"
              >
                {loading ? labels.changing : labels.changePassword}
              </button>
            </form>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="space-y-6">
              <div className="text-center py-12">
                <div className="text-6xl mb-4">⚙️</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                  {labels.preferencesTitle}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {labels.preferencesDesc}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
