// ═══════════════════════════════════════════════════════════════
// 🔒 PROXY - Maintenance Mode & Authentication & Security
// (Next.js 16+ — renamed from middleware.js to proxy.js)
// يتحكم في وضع الصيانة والمصادقة وحماية الـ API
// ═══════════════════════════════════════════════════════════════

import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

const JWT_SECRET = new TextEncoder().encode(
    process.env.JWT_SECRET || 'your-super-secret-key-change-in-production'
)

export async function proxy(request) {
    const { pathname } = request.nextUrl
    const method = request.method

    // 1. PUBLIC ASSETS & SPECIAL PATHS (Always Allowed)
    // المسارات العامة المسموح بها دائماً
    const publicPaths = [
        '/_next',
        '/images',
        '/favicon.ico',
        '/admin/login',
        '/admin/logout',
        '/api/auth',    // Login/Register/Logout APIs
        '/api/weather'  // Public weather utility
    ]

    // Allow if path starts with any public path
    if (publicPaths.some(path => pathname.startsWith(path))) {
        return NextResponse.next()
    }

    if (pathname === '/api/admin/blog/settings' && method === 'GET') {
        return NextResponse.next()
    }

    // 2. MAINTENANCE MODE CHECK
    // التحقق من وضع الصيانة
    try {
        const maintenanceMode = request.cookies.get('maintenance-mode')?.value === 'true'

        if (maintenanceMode) {
            const token = request.cookies.get('auth-token')?.value
            let isAdmin = false

            if (token) {
                try {
                    const verified = await jwtVerify(token, JWT_SECRET)
                    const role = verified.payload.role
                    isAdmin = role === 'ADMIN' || role === 'SUPER_ADMIN'
                } catch (err) {
                    // Verify failed
                }
            }

            // If not admin and trying to access site (excluding admin routes)
            const allowedIpsRaw = request.cookies.get('maintenance-allowed-ips')?.value
            const allowedIps = allowedIpsRaw
                ? decodeURIComponent(allowedIpsRaw).split('|').map((item) => item.trim()).filter(Boolean)
                : []
            const clientIp = request.ip || request.headers.get('x-forwarded-for')?.split(',')[0]?.trim()
            const isAllowedIp = clientIp ? allowedIps.includes(clientIp) : false

            if (!isAdmin && !isAllowedIp && !pathname.startsWith('/admin') && !pathname.startsWith('/api/admin')) {
                return NextResponse.rewrite(new URL('/maintenance', request.url))
            }
        }
    } catch (err) {
        console.error('Proxy maintenance check error:', err)
    }

    // 3. API SECURITY & AUTHENTICATION
    // حماية الـ API والمصادقة

    // A. Admin Routes Protection (Pages & API)
    // حماية صفحات ولوحة تحكم الأدمن
    if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin') || pathname.startsWith('/api/upload')) {
        const token = request.cookies.get('auth-token')?.value

        if (!token) {
            if (pathname.startsWith('/api')) {
                return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
            }
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }

        try {
            const verified = await jwtVerify(token, JWT_SECRET)
            const role = verified.payload.role

            // Strict Role Check for Admin
            if (role !== 'ADMIN' && role !== 'SUPER_ADMIN') {
                if (pathname.startsWith('/api')) {
                    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
                }
                return NextResponse.redirect(new URL('/admin/login', request.url))
            }
        } catch (err) {
            // Token invalid
            if (pathname.startsWith('/api')) {
                return NextResponse.json({ error: 'Invalid Token' }, { status: 401 })
            }
            return NextResponse.redirect(new URL('/admin/login', request.url))
        }
    }

    // B. Public API Write Protection
    // حماية الكتابة على الـ API العامة
    if (pathname.startsWith('/api')) {
        // List of allowed public POST endpoints (Forms)
        const allowedPublicPost = [
            '/api/messages',      // Contact form
            '/api/bookings',      // Booking form
            '/api/contact',       // Legacy contact form
            '/api/newsletter'     // Newsletter signup
        ]

        // If method is unsafe (POST, PUT, DELETE, PATCH)
        if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(method)) {
            // If it's NOT in the allowed list, require auth
            if (!allowedPublicPost.includes(pathname)) {
                const token = request.cookies.get('auth-token')?.value
                if (!token) {
                    return NextResponse.json({ error: 'Authentication Required for this action' }, { status: 401 })
                }
            }
        }
    }

    return NextResponse.next()
}

export const config = {
    matcher: [
        '/((?!_next/static|_next/image|favicon.ico).*)',
    ],
}
