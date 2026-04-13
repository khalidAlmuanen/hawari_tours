'use client'

// ═══════════════════════════════════════════════════════════════
// 📝 USER REGISTRATION PAGE - Ultra Professional
// صفحة التسجيل - احترافية جداً
// ═══════════════════════════════════════════════════════════════

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useApp } from '@/contexts/AppContext'
import { useAuth } from '@/contexts/AuthContext'
import { motion } from 'framer-motion'
import Link from 'next/link'

export default function RegisterPage() {
  const { locale } = useApp()
  const { checkAuth } = useAuth()
  const router = useRouter()
  const isAr = locale === 'ar'

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPasswords, setShowPasswords] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Validation
    if (formData.password.length < 6) {
      setError(isAr ? 'كلمة المرور يجب أن تكون 6 أحرف على الأقل' : 'Password must be at least 6 characters')
      setLoading(false)
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError(isAr ? 'كلمات المرور غير متطابقة' : 'Passwords do not match')
      setLoading(false)
      return
    }

    try {
      console.log('📝 [Register] Attempting registration...')

      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password
        })
      })

      const result = await response.json()
      console.log('📡 [Register] Response:', result)

      if (result.success) {
        console.log('✅ [Register] Success!')
        
        // Auto login after registration
        localStorage.setItem('auth-token', result.data.token)
        localStorage.setItem('user', JSON.stringify(result.data.user))

        // Refresh auth context
        await checkAuth()

        // Redirect to profile
        router.push('/profile')
      } else {
        setError(result.error || (isAr ? 'فشل التسجيل' : 'Registration failed'))
      }
    } catch (err) {
      console.error('❌ [Register] Error:', err)
      setError(isAr ? 'خطأ في الشبكة' : 'Network error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br from-green-600 via-teal-600 to-blue-600 flex items-center justify-center p-4 ${isAr ? 'rtl' : 'ltr'}`}>
      
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-72 h-72 bg-white/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-teal-300/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Register Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-2xl rounded-3xl shadow-2xl p-8 border border-white/20">
          
          {/* Logo */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200 }}
              className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-green-600 to-teal-600 rounded-2xl flex items-center justify-center text-4xl shadow-xl"
            >
              🏝️
            </motion.div>
            <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-2">
              {isAr ? 'انضم إلينا' : 'Join Us'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {isAr ? 'أنشئ حسابك الآن' : 'Create your account now'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 bg-red-100 dark:bg-red-900/30 border border-red-500 rounded-2xl p-4 flex items-start gap-3"
            >
              <svg className="w-6 h-6 text-red-600 dark:text-red-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div className="text-red-800 dark:text-red-200 text-sm">{error}</div>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Name */}
            <div>
              <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                {isAr ? 'الاسم الكامل' : 'Full Name'}
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
                placeholder={isAr ? 'أحمد محمد' : 'John Doe'}
                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-white border-2 border-transparent focus:border-green-500 transition-all"
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
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="example@email.com"
                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-white border-2 border-transparent focus:border-green-500 transition-all"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                {isAr ? 'رقم الهاتف' : 'Phone Number'}
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="+967 xxx xxx xxx"
                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-white border-2 border-transparent focus:border-green-500 transition-all"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                {isAr ? 'كلمة المرور' : 'Password'}
              </label>
              <div className="relative">
                <input
                  type={showPasswords ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  placeholder={isAr ? '••••••••' : '••••••••'}
                  className="w-full px-4 py-3 pr-12 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-white border-2 border-transparent focus:border-green-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPasswords(!showPasswords)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl hover:scale-110 transition-transform"
                >
                  {showPasswords ? '🙈' : '👁️'}
                </button>
              </div>
              <div className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {isAr ? 'على الأقل 6 أحرف' : 'Minimum 6 characters'}
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                {isAr ? 'تأكيد كلمة المرور' : 'Confirm Password'}
              </label>
              <input
                type={showPasswords ? 'text' : 'password'}
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                placeholder={isAr ? '••••••••' : '••••••••'}
                className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl text-gray-900 dark:text-white border-2 border-transparent focus:border-green-500 transition-all"
              />
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full px-6 py-4 bg-gradient-to-r from-green-600 to-teal-600 text-white rounded-xl font-bold text-lg hover:shadow-2xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>{isAr ? 'جارِ التسجيل...' : 'Registering...'}</span>
                </span>
              ) : (
                isAr ? 'تسجيل حساب جديد' : 'Create Account'
              )}
            </motion.button>
          </form>

          {/* Footer Links */}
          <div className="mt-6 text-center space-y-3">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {isAr ? 'لديك حساب بالفعل؟' : 'Already have an account?'}{' '}
              <Link href="/login" className="text-green-600 dark:text-green-400 font-bold hover:underline">
                {isAr ? 'سجّل دخول' : 'Login'}
              </Link>
            </p>
            <Link href="/" className="block text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              {isAr ? '← العودة للرئيسية' : '← Back to Home'}
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
