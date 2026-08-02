// ═══════════════════════════════════════════════════════════════
// 🔒 Change Password API
// /app/api/auth/change-password/route.js
// ═══════════════════════════════════════════════════════════════

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { requireAuth } from '@/lib/apiAuth'

export async function POST(request) {
  // التحقق من المصادقة
  const auth = await requireAuth(request)
  if (auth.error) return auth.error

  const user = auth.user

  try {
    const body = await request.json()
    const { currentPassword, newPassword } = body

    // Validation
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        {
          success: false,
          error: 'Current password and new password are required'
        },
        { status: 400 }
      )
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        {
          success: false,
          error: 'New password must be at least 6 characters'
        },
        { status: 400 }
      )
    }

    // Get user with password
    const userWithPassword = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        password: true
      }
    })

    if (!userWithPassword) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found'
        },
        { status: 404 }
      )
    }

    const storedPassword = userWithPassword.password || ''
    const isBcryptHash = storedPassword.startsWith('$2a$') || storedPassword.startsWith('$2b$') || storedPassword.startsWith('$2y$')
    let isPasswordCorrect = false

    if (isBcryptHash) {
      isPasswordCorrect = await bcrypt.compare(currentPassword, storedPassword)
    } else {
      isPasswordCorrect = currentPassword === storedPassword
    }

    if (!isPasswordCorrect) {
      return NextResponse.json(
        {
          success: false,
          error: 'Current password is incorrect'
        },
        { status: 401 }
      )
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update password
    await prisma.user.update({
      where: { id: user.id },
      data: { password: hashedPassword }
    })

    console.log(`✅ [Auth] Password changed for user: ${user.email}`)

    return NextResponse.json({
      success: true,
      message: 'Password changed successfully'
    })

  } catch (error) {
    console.error('❌ [Auth] Change password error:', error)
    
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to change password',
        details: error.message
      },
      { status: 500 }
    )
  }
}
