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

    // Clear auth cookie
    response.cookies.delete('auth-token')

    return response

  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { success: false, error: 'Logout failed' },
      { status: 500 }
    )
  }
}

