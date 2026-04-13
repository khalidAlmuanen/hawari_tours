// ═══════════════════════════════════════════════════════════════
// 🔐 Logout API
// /app/api/auth/logout/route.js
// ═══════════════════════════════════════════════════════════════

import { NextResponse } from 'next/server'

export async function POST(request) {
  try {
    const response = NextResponse.json({
      success: true,
      message: 'Logout successful'
    })

    // Clear auth cookie with explicit options to ensure removal
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 0, // Expire immediately
      path: '/'
    })

    return response

  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { success: false, error: 'Logout failed' },
      { status: 500 }
    )
  }
}

