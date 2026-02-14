'use client'

// ═══════════════════════════════════════════════════════════════
// 🔐 Auth Context - Global Authentication State
// /contexts/AuthContext.jsx
// ═══════════════════════════════════════════════════════════════

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const router = useRouter()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check if user is logged in on mount
  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    try {
      // Check localStorage first
      const storedUser = localStorage.getItem('user')
      if (storedUser) {
        setUser(JSON.parse(storedUser))
        setIsAuthenticated(true)
      }

      // Verify with server
      const response = await fetch('/api/auth/me')
      const result = await response.json()

      if (result.success) {
        setUser(result.data.user)
        setIsAuthenticated(true)
        localStorage.setItem('user', JSON.stringify(result.data.user))
      } else {
        // Token invalid or expired
        setUser(null)
        setIsAuthenticated(false)
        localStorage.removeItem('user')
        localStorage.removeItem('auth-token')
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      setUser(null)
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const result = await response.json()

      if (result.success) {
        setUser(result.data.user)
        setIsAuthenticated(true)
        localStorage.setItem('user', JSON.stringify(result.data.user))
        localStorage.setItem('auth-token', result.data.token)
        return { success: true }
      } else {
        return { success: false, error: result.error }
      }
    } catch (error) {
      return { success: false, error: 'Network error' }
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setUser(null)
      setIsAuthenticated(false)
      localStorage.removeItem('user')
      localStorage.removeItem('auth-token')
      router.push('/admin/login')
    }
  }

  const hasRole = (requiredRoles) => {
    if (!user) return false
    if (!Array.isArray(requiredRoles)) {
      requiredRoles = [requiredRoles]
    }
    return requiredRoles.includes(user.role)
  }

  const isAdmin = () => {
    return hasRole(['ADMIN', 'SUPER_ADMIN'])
  }

  const isSuperAdmin = () => {
    return hasRole(['SUPER_ADMIN'])
  }

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    checkAuth,
    hasRole,
    isAdmin,
    isSuperAdmin
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}


// ═══════════════════════════════════════════════════════════════
// 🔐 Protected Route Component
// Usage: Wrap admin pages with this component
// ═══════════════════════════════════════════════════════════════

export function ProtectedRoute({ children, requiredRole = null }) {
  const { user, loading, isAuthenticated, hasRole } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        router.push('/admin/login')
      } else if (requiredRole && !hasRole(requiredRole)) {
        router.push('/')
      }
    }
  }, [loading, isAuthenticated, user, requiredRole])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated || (requiredRole && !hasRole(requiredRole))) {
    return null
  }

  return children
}


// ═══════════════════════════════════════════════════════════════
// 🔐 Usage Examples
// ═══════════════════════════════════════════════════════════════

/*
// 1. Wrap your app with AuthProvider (in layout.jsx)
import { AuthProvider } from '@/contexts/AuthContext'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}

// 2. Use in components
import { useAuth } from '@/contexts/AuthContext'

function MyComponent() {
  const { user, isAuthenticated, logout, isAdmin } = useAuth()
  
  if (!isAuthenticated) {
    return <div>Please login</div>
  }
  
  return (
    <div>
      <p>Welcome {user.name}</p>
      {isAdmin() && <p>You are an admin</p>}
      <button onClick={logout}>Logout</button>
    </div>
  )
}

// 3. Protect admin pages
import { ProtectedRoute } from '@/contexts/AuthContext'

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole={['ADMIN', 'SUPER_ADMIN']}>
      <div>Admin content here</div>
    </ProtectedRoute>
  )
}

// 4. Protect API routes
import { requireAuth } from '@/lib/apiAuth'

export async function GET(request) {
  const auth = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
  if (auth.error) return auth.error
  
  const user = auth.user
  // ... your code
}
*/