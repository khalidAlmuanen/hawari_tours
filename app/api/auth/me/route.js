// ═══════════════════════════════════════════════════════════════
// 👤 Get Current User API - Complete & Professional
// /app/api/auth/me/route.js
// ═══════════════════════════════════════════════════════════════

import { NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request) {
  try {
    // Get token from cookie or Authorization header
    const token = request.cookies.get('auth-token')?.value ||
                  request.headers.get('Authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Not authenticated',
          code: 'NO_TOKEN'
        },
        { status: 401 }
      )
    }

    // Verify token
    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid or expired token',
          code: 'INVALID_TOKEN'
        },
        { status: 401 }
      )
    }

    // Get user from database with relations
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        phone: true,
        isActive: true,
        emailVerified: true,
        createdAt: true,
        lastLogin: true,
        _count: {
          select: {
            bookings: true,
            reviews: true,
            messages: true
          }
        }
      }
    })

    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'User not found',
          code: 'USER_NOT_FOUND'
        },
        { status: 404 }
      )
    }

    if (!user.isActive) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Account is deactivated. Please contact support.',
          code: 'ACCOUNT_DEACTIVATED'
        },
        { status: 403 }
      )
    }

    // Optional: Update last activity
    // Note: lastActivity field doesn't exist in schema
    // await prisma.user.update({
    //   where: { id: user.id },
    //   data: { lastLogin: new Date() }
    // }).catch(() => {
    //   // Ignore errors - this is optional
    // })

    return NextResponse.json({
      success: true,
      data: { 
        user,
        tokenInfo: {
          issuedAt: new Date(decoded.iat * 1000),
          expiresAt: new Date(decoded.exp * 1000)
        }
      }
    })

  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to get user information',
        code: 'SERVER_ERROR'
      },
      { status: 500 }
    )
  }
}

// Optional: Update user profile
export async function PATCH(request) {
  try {
    const token = request.cookies.get('auth-token')?.value ||
                  request.headers.get('Authorization')?.replace('Bearer ', '')

    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return NextResponse.json(
        { success: false, error: 'Invalid token' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const { name, phone, avatar } = body

    // Update user profile
    const user = await prisma.user.update({
      where: { id: decoded.userId },
      data: {
        ...(name && { name }),
        ...(phone !== undefined && { phone }),
        ...(avatar !== undefined && { avatar })
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        phone: true,
        isActive: true,
        emailVerified: true
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Profile updated successfully',
      data: { user }
    })

  } catch (error) {
    console.error('Update profile error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update profile' },
      { status: 500 }
    )
  }
}