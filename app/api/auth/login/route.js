// ═══════════════════════════════════════════════════════════════
// 🔐 Login API - FINAL VERSION WITH FULL ERROR HANDLING
// /app/api/auth/login/route.js
// ═══════════════════════════════════════════════════════════════

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'hawarl-tours-secret-key-2024-super-secure-change-in-production'
const JWT_EXPIRES_IN = '7d'

export async function POST(request) {
  console.log('\n🔐 ===== LOGIN REQUEST START =====')

  try {
    // Parse request body
    let body
    try {
      body = await request.json()
      console.log('📥 Request received:', { email: body.email })
    } catch (parseError) {
      console.error('❌ Failed to parse request body:', parseError)
      return NextResponse.json(
        { success: false, error: 'Invalid request format' },
        { status: 400 }
      )
    }

    const { email, password } = body

    // Validation
    if (!email || !password) {
      console.log('❌ Missing email or password')
      return NextResponse.json(
        { success: false, error: 'Email and password are required' },
        { status: 400 }
      )
    }

    console.log('🔍 Searching for user:', email.toLowerCase())

    // Find user
    let user
    try {
      user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
        select: {
          id: true,
          email: true,
          name: true,
          password: true,
          role: true,
          avatar: true,
          isActive: true,
          emailVerified: true
        }
      })
    } catch (dbError) {
      console.error('❌ Database error:', dbError)
      return NextResponse.json(
        { success: false, error: 'Database connection error' },
        { status: 500 }
      )
    }

    if (!user) {
      console.log('❌ User not found')
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    console.log('✅ User found:', user.email, '- Role:', user.role)

    console.log('✅ User found DB state:', JSON.stringify(user))

    // Check if active
    if (!user.isActive) {
      console.log('❌ Account deactivated')
      return NextResponse.json(
        { success: false, error: 'Account is deactivated. Contact support.' },
        { status: 403 }
      )
    }

    // Verify password
    console.log('🔑 Verifying password...')
    let isPasswordValid
    try {
      isPasswordValid = await bcrypt.compare(password, user.password)
      console.log('Password valid:', isPasswordValid)
    } catch (bcryptError) {
      console.error('❌ Bcrypt error:', bcryptError)
      return NextResponse.json(
        { success: false, error: 'Password verification failed' },
        { status: 500 }
      )
    }

    if (!isPasswordValid) {
      console.log('❌ Invalid password')
      return NextResponse.json(
        { success: false, error: 'Invalid email or password' },
        { status: 401 }
      )
    }

    // Update last login
    try {
      await prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() }
      })
    } catch (updateError) {
      console.log('⚠️ Failed to update lastLogin (non-critical):', updateError.message)
    }

    // Generate JWT
    console.log('🎫 Generating JWT token...')
    let token
    try {
      token = jwt.sign(
        {
          userId: user.id,
          email: user.email,
          role: user.role
        },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      )
    } catch (jwtError) {
      console.error('❌ JWT generation error:', jwtError)
      return NextResponse.json(
        { success: false, error: 'Token generation failed' },
        { status: 500 }
      )
    }

    // User data (without password)
    const userData = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      avatar: user.avatar,
      emailVerified: user.emailVerified
    }

    console.log('✅ Login successful for:', user.email)
    console.log('🔐 ===== LOGIN REQUEST END =====\n')

    // Create response
    const response = NextResponse.json({
      success: true,
      message: 'Login successful',
      data: {
        user: userData,
        token
      }
    })

    // Set cookie
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/'
    })

    return response

  } catch (error) {
    console.error('🔥 CRITICAL LOGIN ERROR:', error)
    console.error('Error stack:', error.stack)
    console.log('🔐 ===== LOGIN REQUEST END (ERROR) =====\n')

    return NextResponse.json(
      {
        success: false,
        error: 'Login failed. Please try again.',
        debug: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}

// Health check endpoint
export async function GET() {
  return NextResponse.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    dependencies: {
      prisma: !!prisma,
      bcrypt: !!bcrypt,
      jwt: !!jwt
    }
  })
}