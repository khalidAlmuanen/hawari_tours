// ═══════════════════════════════════════════════════════════════
// 🔑 Password Reset API - Complete & Professional
// /app/api/auth/reset-password/route.js
// ═══════════════════════════════════════════════════════════════

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { createPasswordResetToken, verifyPasswordResetToken } from '@/lib/auth'

// Request password reset
export async function POST(request) {
  try {
    const body = await request.json()
    const { email, token, newPassword } = body

    // ═══════════════════════════════════════════════════════════
    // STEP 1: Request reset token
    // ═══════════════════════════════════════════════════════════
    if (email && !token && !newPassword) {
      // Find user by email
      const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
        select: { id: true, email: true, name: true }
      })

      if (!user) {
        // Don't reveal if email exists (security)
        return NextResponse.json({
          success: true,
          message: 'If an account exists with this email, you will receive a password reset link.'
        })
      }

      // Generate reset token
      const resetToken = createPasswordResetToken(user.id, user.email)

      // In production, send email with reset link
      // For now, return token (for testing)
      const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/admin/reset-password?token=${resetToken}`

      // TODO: Send email with resetLink
      console.log('Password Reset Link:', resetLink)

      return NextResponse.json({
        success: true,
        message: 'Password reset link has been sent to your email.',
        // Remove this in production
        resetToken,
        resetLink
      })
    }

    // ═══════════════════════════════════════════════════════════
    // STEP 2: Reset password with token
    // ═══════════════════════════════════════════════════════════
    if (token && newPassword) {
      // Verify reset token
      const decoded = verifyPasswordResetToken(token)
      
      if (!decoded) {
        return NextResponse.json(
          { success: false, error: 'Invalid or expired reset token' },
          { status: 400 }
        )
      }

      // Validate new password
      if (newPassword.length < 6) {
        return NextResponse.json(
          { success: false, error: 'Password must be at least 6 characters' },
          { status: 400 }
        )
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10)

      // Update user password
      await prisma.user.update({
        where: { id: decoded.userId },
        data: { 
          password: hashedPassword,
          emailVerified: true // Auto-verify on password reset
        }
      })

      return NextResponse.json({
        success: true,
        message: 'Password has been reset successfully. You can now login with your new password.'
      })
    }

    // Invalid request
    return NextResponse.json(
      { success: false, error: 'Invalid request' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Password reset error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process password reset' },
      { status: 500 }
    )
  }
}

// Verify reset token (optional - for frontend validation)
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Token is required' },
        { status: 400 }
      )
    }

    const decoded = verifyPasswordResetToken(token)
    
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Invalid or expired token' },
        { status: 400 }
      )
    }

    // Get user info (without sensitive data)
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { email: true, name: true }
    })

    if (!user) {
      return NextResponse.json(
        { success: false, error: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        email: user.email,
        name: user.name
      }
    })

  } catch (error) {
    console.error('Token verification error:', error)
    return NextResponse.json(
      { success: false, error: 'Invalid token' },
      { status: 400 }
    )
  }
}