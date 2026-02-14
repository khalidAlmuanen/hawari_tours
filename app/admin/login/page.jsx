'use client'

// ═══════════════════════════════════════════════════════════════
// 🔐 ADMIN LOGIN - FINAL FIX
// ✅ الحل النهائي مع debugging كامل
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const router = useRouter()
  
  // State Management
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [debugInfo, setDebugInfo] = useState('')

  // Hydration Fix
  useEffect(() => {
    setMounted(true)
    
    // Check if already logged in
    const token = localStorage.getItem('auth-token')
    if (token) {
      console.log('✅ Already logged in, redirecting...')
      router.replace('/admin')
    }
  }, [router])

  // Form Validation
  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email) {
      setEmailError('Email is required')
      return false
    }
    if (!emailRegex.test(email)) {
      setEmailError('Invalid email format')
      return false
    }
    setEmailError('')
    return true
  }

  const validatePassword = (password) => {
    if (!password) {
      setPasswordError('Password is required')
      return false
    }
    if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters')
      return false
    }
    setPasswordError('')
    return true
  }

  // Handle Login
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    console.log('🔵 Login attempt started...')
    
    // Reset states
    setError('')
    setSuccess(false)
    setDebugInfo('')
    
    // Validate
    const emailValid = validateEmail(formData.email)
    const passwordValid = validatePassword(formData.password)
    
    if (!emailValid || !passwordValid) {
      console.log('❌ Validation failed')
      return
    }

    setLoading(true)

    try {
      console.log('🔵 Calling API...')
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          email: formData.email.toLowerCase().trim(),
          password: formData.password
        })
      })

      console.log('🔵 API Response received:', response.status)
      const result = await response.json()
      console.log('🔵 API Result:', result)

      if (result.success && result.data) {
        console.log('✅ Login successful!')
        
        // ✅ الحل: تخزين البيانات بشكل صحيح
        if (result.data.token) {
          localStorage.setItem('auth-token', result.data.token)
          console.log('✅ Token saved:', result.data.token.substring(0, 20) + '...')
        }
        
        if (result.data.user) {
          const userStr = JSON.stringify(result.data.user)
          localStorage.setItem('user', userStr)
          console.log('✅ User saved:', result.data.user)
        }
        
        // Remember me
        if (rememberMe) {
          localStorage.setItem('remember-me', 'true')
        }

        // Verify storage
        const storedToken = localStorage.getItem('auth-token')
        const storedUser = localStorage.getItem('user')
        
        console.log('🔍 Verification:')
        console.log('  - Token stored:', !!storedToken)
        console.log('  - User stored:', !!storedUser)
        
        if (!storedToken || !storedUser) {
          console.error('❌ Storage verification failed!')
          setError('Failed to save credentials. Please try again.')
          setLoading(false)
          return
        }
        
        // Show success
        setSuccess(true)
        setDebugInfo('Redirecting in 2 seconds...')
        
        // ✅ الحل الجديد: Multiple redirect attempts
        console.log('🔵 Starting redirect sequence...')
        
        // Attempt 1: After 1 second
        setTimeout(() => {
          console.log('🔵 Redirect attempt 1: router.push')
          router.push('/admin')
        }, 1000)
        
        // Attempt 2: After 1.5 seconds
        setTimeout(() => {
          console.log('🔵 Redirect attempt 2: router.replace')
          router.replace('/admin')
        }, 1500)
        
        // Attempt 3: After 2 seconds (guaranteed)
        setTimeout(() => {
          console.log('🔵 Redirect attempt 3: window.location (FORCED)')
          const adminUrl = window.location.origin + '/admin'
          console.log('🔵 Redirecting to:', adminUrl)
          window.location.href = adminUrl
        }, 2000)
        
      } else {
        // Error
        console.log('❌ Login failed:', result.error)
        setError(result.error || 'Invalid credentials. Please try again.')
        setLoading(false)
      }
    } catch (err) {
      console.error('❌ Login error:', err)
      setError('Network error. Please check your connection.')
      setLoading(false)
    }
  }

  // Handle Input Change
  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    setError('')
    
    // Clear field-specific errors
    if (field === 'email') setEmailError('')
    if (field === 'password') setPasswordError('')
  }

  // ✅ Success Screen
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600 flex items-center justify-center p-4">
        <div className="text-center text-white max-w-md">
          <div className="relative inline-block mb-8">
            <div className="absolute inset-0 bg-white/30 rounded-full blur-3xl animate-pulse"></div>
            <div className="relative w-32 h-32 rounded-full bg-white/20 backdrop-blur-xl flex items-center justify-center mx-auto border-4 border-white/30 animate-bounce">
              <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          
          <h1 className="text-5xl font-black mb-4 animate-fade-in">
            Login Successful!
          </h1>
          <p className="text-2xl text-green-100 mb-8 animate-fade-in-delay">
            Welcome back, Admin! 👋
          </p>
          
          <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-6 mb-6">
            <div className="flex items-center justify-center gap-3 text-green-100 mb-4">
              <div className="flex gap-1">
                <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
              <span className="text-lg font-semibold">{debugInfo}</span>
            </div>
            
            {/* Debug Info */}
            <div className="text-left text-xs text-white/70 space-y-1 font-mono">
              <div>✅ Token: {localStorage.getItem('auth-token') ? 'Saved' : 'Missing'}</div>
              <div>✅ User: {localStorage.getItem('user') ? 'Saved' : 'Missing'}</div>
              <div>🔄 Redirect: In progress...</div>
            </div>
          </div>
          
          {/* Manual redirect button */}
          <button
            onClick={() => {
              console.log('🔵 Manual redirect clicked')
              window.location.href = '/admin'
            }}
            className="px-8 py-3 bg-white text-green-600 rounded-xl font-bold hover:bg-green-50 transition-all"
          >
            Click here if not redirected
          </button>
        </div>

        <style jsx>{`
          @keyframes fade-in {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          
          .animate-fade-in {
            animation: fade-in 0.6s ease-out;
          }
          
          .animate-fade-in-delay {
            animation: fade-in 0.6s ease-out 0.3s both;
          }
        `}</style>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Animated Background */}
      {mounted && (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(25)].map((_, i) => {
            const size = Math.random() * 120 + 40
            return (
              <div
                key={i}
                className="absolute rounded-full bg-white/10 animate-float"
                style={{
                  width: `${size}px`,
                  height: `${size}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 5}s`,
                  animationDuration: `${Math.random() * 15 + 10}s`
                }}
              />
            )
          })}
        </div>
      )}

      {/* Login Card */}
      <div className="relative w-full max-w-md z-10">
        
        {/* Glass Card */}
        <div className="bg-white/10 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/20 overflow-hidden transition-all duration-300 hover:shadow-3xl">
          
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-xl p-8 text-center border-b border-white/10">
            <div className="relative inline-block mb-4">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl blur-lg opacity-50 animate-pulse"></div>
              <div className="relative p-4 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl">
                <span className="text-5xl">👑</span>
              </div>
            </div>
            <h1 className="text-3xl font-black text-white mb-2 tracking-tight">
              Admin Login
            </h1>
            <p className="text-blue-100 font-medium">
              Hawarl Tours Management System
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-8 space-y-6">
            
            {/* Error Alert */}
            {error && (
              <div className="bg-red-500/20 backdrop-blur-xl border-2 border-red-500/30 rounded-2xl p-4 flex items-start gap-3 animate-shake">
                <svg className="w-6 h-6 text-red-200 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <div className="font-bold text-red-100 text-sm">Login Failed</div>
                  <div className="text-sm text-red-200 mt-1">{error}</div>
                </div>
              </div>
            )}

            {/* Demo Credentials */}
            <div className="bg-blue-500/20 backdrop-blur-xl border-2 border-blue-500/30 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <svg className="w-6 h-6 text-blue-200 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm flex-1">
                  <div className="font-bold text-blue-100 mb-2">Demo Credentials</div>
                  <div className="text-blue-200 font-mono text-xs space-y-1.5">
                    <div className="flex items-center justify-between bg-white/10 rounded-lg px-3 py-2">
                      <span className="text-blue-300">Email:</span>
                      <span className="font-semibold">admin@hawarl.com</span>
                    </div>
                    <div className="flex items-center justify-between bg-white/10 rounded-lg px-3 py-2">
                      <span className="text-blue-300">Password:</span>
                      <span className="font-semibold">Admin@123</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label className="block text-sm font-bold text-white mb-2">
                Email Address *
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  onBlur={() => validateEmail(formData.email)}
                  placeholder="admin@hawarl.com"
                  disabled={loading}
                  className={`w-full pl-12 pr-4 py-4 bg-white/10 backdrop-blur-xl border-2 rounded-2xl text-white placeholder-white/50 focus:outline-none transition-all ${
                    emailError 
                      ? 'border-red-500/50 focus:ring-2 focus:ring-red-400' 
                      : 'border-white/20 focus:ring-2 focus:ring-blue-400'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                />
              </div>
              {emailError && (
                <p className="text-red-300 text-xs mt-2 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01" />
                  </svg>
                  {emailError}
                </p>
              )}
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-bold text-white mb-2">
                Password *
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/50">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  onBlur={() => validatePassword(formData.password)}
                  placeholder="••••••••"
                  disabled={loading}
                  className={`w-full pl-12 pr-14 py-4 bg-white/10 backdrop-blur-xl border-2 rounded-2xl text-white placeholder-white/50 focus:outline-none transition-all ${
                    passwordError 
                      ? 'border-red-500/50 focus:ring-2 focus:ring-red-400' 
                      : 'border-white/20 focus:ring-2 focus:ring-blue-400'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
                  tabIndex={-1}
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {passwordError && (
                <p className="text-red-300 text-xs mt-2 flex items-center gap-1">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01" />
                  </svg>
                  {passwordError}
                </p>
              )}
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={loading}
                  className="w-5 h-5 rounded border-2 border-white/30 bg-white/10 text-blue-600 focus:ring-2 focus:ring-blue-400 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                />
                <span className="text-sm font-semibold text-white group-hover:text-blue-200 transition-colors">
                  Remember me
                </span>
              </label>
              <button
                type="button"
                disabled={loading}
                className="text-sm font-semibold text-blue-200 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !!emailError || !!passwordError}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-2xl font-bold text-lg shadow-xl hover:shadow-2xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3 group"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-6 w-6" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <svg className="w-6 h-6 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                  </svg>
                  <span>Login to Dashboard</span>
                </>
              )}
            </button>

            {/* Help Text */}
            <p className="text-center text-sm text-white/60">
              Need help? Contact{' '}
              <a href="mailto:support@hawarl.com" className="text-blue-200 hover:text-white font-semibold transition-colors">
                support@hawarl.com
              </a>
            </p>
          </form>

          {/* Footer */}
          <div className="px-8 py-6 bg-white/5 backdrop-blur-xl border-t border-white/10">
            <div className="text-center">
              <p className="text-sm text-white/70 mb-3">
                Protected by enterprise-grade security
              </p>
              <div className="flex items-center justify-center gap-6 text-xs text-white/60">
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <span className="font-semibold">256-bit SSL</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span className="font-semibold">2FA Ready</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span className="font-semibold">Audit Logs</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Version Badge */}
        <div className="text-center mt-6">
          <p className="text-white/40 text-xs font-mono">
            Hawarl Tours v1.0.0 • © 2024
          </p>
        </div>
      </div>

      {/* Global Styles */}
      <style jsx global>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-25px) rotate(15deg);
          }
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-8px); }
          20%, 40%, 60%, 80% { transform: translateX(8px); }
        }
        
        .animate-float {
          animation: float linear infinite;
        }
        
        .animate-shake {
          animation: shake 0.6s cubic-bezier(.36,.07,.19,.97) both;
        }

        .shadow-3xl {
          box-shadow: 0 35px 60px -15px rgba(0, 0, 0, 0.3);
        }
      `}</style>
    </div>
  )
}