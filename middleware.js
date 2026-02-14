// ═══════════════════════════════════════════════════════════════
// 🔒 MIDDLEWARE - Maintenance Mode & Authentication
// يتحكم في وضع الصيانة والمصادقة
// ═══════════════════════════════════════════════════════════════

import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'your-super-secret-key-change-in-production'
)

export async function middleware(request) {
  const { pathname } = request.nextUrl

  // Skip middleware for certain paths
  const publicPaths = [
    '/api',
    '/_next',
    '/favicon.ico',
    '/images',
    '/admin/login',
    '/admin/logout'
  ]

  if (publicPaths.some(path => pathname.startsWith(path))) {
    return NextResponse.next()
  }

  // Check Maintenance Mode
  try {
    // Try to get settings from cookie or localStorage
    const maintenanceMode = request.cookies.get('maintenance-mode')?.value === 'true'
    
    if (maintenanceMode) {
      // Check if user is admin
      const token = request.cookies.get('auth-token')?.value
      
      let isAdmin = false
      if (token) {
        try {
          const verified = await jwtVerify(token, JWT_SECRET)
          const role = verified.payload.role
          isAdmin = role === 'ADMIN' || role === 'SUPER_ADMIN'
        } catch (err) {
          // Invalid token
        }
      }

      // If not admin and not on admin routes, show maintenance page
      if (!isAdmin && !pathname.startsWith('/admin')) {
        // Redirect to maintenance page
        return NextResponse.rewrite(new URL('/maintenance', request.url))
      }
    }
  } catch (err) {
    console.error('Middleware error:', err)
  }

  // Admin routes protection
  if (pathname.startsWith('/admin') && pathname !== '/admin/login' && pathname !== '/admin/logout') {
    const token = request.cookies.get('auth-token')?.value

    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }

    try {
      const verified = await jwtVerify(token, JWT_SECRET)
      const role = verified.payload.role
      
      // Check if user has admin access
      if (role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
        return NextResponse.redirect(new URL('/admin/login', request.url))
      }
    } catch (err) {
      // Token is invalid or expired
      return NextResponse.redirect(new URL('/admin/login', request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
