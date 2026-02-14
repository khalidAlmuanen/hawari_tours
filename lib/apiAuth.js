// ═══════════════════════════════════════════════════════════════
// 🔐 API Route Protection Helper - Complete & Professional
// /lib/apiAuth.js
// ═══════════════════════════════════════════════════════════════

import { NextResponse } from 'next/server'
import { verifyToken, hasRole, hasPermission } from './auth'
import { prisma } from './prisma'

/**
 * Require authentication for API routes
 * @param {Request} request - Next.js request object
 * @param {string|array|null} requiredRole - Required role(s) or null for any authenticated user
 * @returns {Promise<{user: object} | {error: NextResponse}>}
 */
export async function requireAuth(request, requiredRole = null) {
  // Get token from cookie or Authorization header
  const token = request.cookies.get('auth-token')?.value ||
                request.headers.get('Authorization')?.replace('Bearer ', '')

  if (!token) {
    return {
      error: NextResponse.json(
        { 
          success: false, 
          error: 'Authentication required',
          code: 'NO_TOKEN'
        },
        { status: 401 }
      )
    }
  }

  // Verify token
  const decoded = verifyToken(token)
  if (!decoded) {
    return {
      error: NextResponse.json(
        { 
          success: false, 
          error: 'Invalid or expired token',
          code: 'INVALID_TOKEN'
        },
        { status: 401 }
      )
    }
  }

  // Get user from database
  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      avatar: true,
      isActive: true,
      emailVerified: true
    }
  })

  if (!user) {
    return {
      error: NextResponse.json(
        { 
          success: false, 
          error: 'User not found',
          code: 'USER_NOT_FOUND'
        },
        { status: 404 }
      )
    }
  }

  if (!user.isActive) {
    return {
      error: NextResponse.json(
        { 
          success: false, 
          error: 'Account is deactivated',
          code: 'ACCOUNT_DEACTIVATED'
        },
        { status: 403 }
      )
    }
  }

  // Check role if required
  if (requiredRole) {
    const userHasRole = hasRole(user.role, requiredRole)
    if (!userHasRole) {
      return {
        error: NextResponse.json(
          { 
            success: false, 
            error: 'Insufficient permissions',
            code: 'INSUFFICIENT_PERMISSIONS',
            required: Array.isArray(requiredRole) ? requiredRole : [requiredRole],
            current: user.role
          },
          { status: 403 }
        )
      }
    }
  }

  return { user }
}

/**
 * Require specific permission level (hierarchical)
 * @param {Request} request - Next.js request object
 * @param {string} minRole - Minimum required role
 * @returns {Promise<{user: object} | {error: NextResponse}>}
 */
export async function requirePermission(request, minRole) {
  const auth = await requireAuth(request)
  if (auth.error) return auth

  const user = auth.user
  if (!hasPermission(user.role, minRole)) {
    return {
      error: NextResponse.json(
        { 
          success: false, 
          error: 'Insufficient permissions',
          code: 'INSUFFICIENT_PERMISSIONS',
          required: minRole,
          current: user.role
        },
        { status: 403 }
      )
    }
  }

  return { user }
}

/**
 * Require admin access (ADMIN or SUPER_ADMIN)
 * @param {Request} request - Next.js request object
 * @returns {Promise<{user: object} | {error: NextResponse}>}
 */
export async function requireAdmin(request) {
  return requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
}

/**
 * Require super admin access
 * @param {Request} request - Next.js request object
 * @returns {Promise<{user: object} | {error: NextResponse}>}
 */
export async function requireSuperAdmin(request) {
  return requireAuth(request, 'SUPER_ADMIN')
}

/**
 * Optional auth - get user if authenticated, otherwise continue
 * @param {Request} request - Next.js request object
 * @returns {Promise<{user: object|null}>}
 */
export async function optionalAuth(request) {
  try {
    const token = request.cookies.get('auth-token')?.value ||
                  request.headers.get('Authorization')?.replace('Bearer ', '')

    if (!token) {
      return { user: null }
    }

    const decoded = verifyToken(token)
    if (!decoded) {
      return { user: null }
    }

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
        isActive: true
      }
    })

    return { user: user && user.isActive ? user : null }
  } catch (error) {
    return { user: null }
  }
}

/**
 * Check if authenticated user owns the resource
 * @param {object} user - User object from requireAuth
 * @param {string} resourceUserId - User ID of resource owner
 * @returns {boolean}
 */
export function isOwner(user, resourceUserId) {
  return user.id === resourceUserId
}

/**
 * Check if user can modify resource (owner or admin)
 * @param {object} user - User object from requireAuth
 * @param {string} resourceUserId - User ID of resource owner
 * @returns {boolean}
 */
export function canModify(user, resourceUserId) {
  return isOwner(user, resourceUserId) || hasRole(user.role, ['ADMIN', 'SUPER_ADMIN'])
}

/**
 * Require ownership or admin access
 * @param {object} user - User object from requireAuth
 * @param {string} resourceUserId - User ID of resource owner
 * @returns {NextResponse|null} - Error response or null if allowed
 */
export function requireOwnership(user, resourceUserId) {
  if (!canModify(user, resourceUserId)) {
    return NextResponse.json(
      { 
        success: false, 
        error: 'You do not have permission to modify this resource',
        code: 'NOT_OWNER'
      },
      { status: 403 }
    )
  }
  return null
}

/**
 * Rate limiting helper (simple in-memory)
 */
const rateLimitMap = new Map()

export function checkRateLimit(identifier, limit = 10, windowMs = 60000) {
  const now = Date.now()
  const userLimits = rateLimitMap.get(identifier) || []
  
  // Clean old entries
  const recentLimits = userLimits.filter(time => now - time < windowMs)
  
  if (recentLimits.length >= limit) {
    return {
      allowed: false,
      error: NextResponse.json(
        { 
          success: false, 
          error: 'Too many requests. Please try again later.',
          code: 'RATE_LIMIT_EXCEEDED',
          retryAfter: Math.ceil((recentLimits[0] + windowMs - now) / 1000)
        },
        { status: 429 }
      )
    }
  }
  
  recentLimits.push(now)
  rateLimitMap.set(identifier, recentLimits)
  
  return { allowed: true }
}

/**
 * Clear rate limit for identifier
 */
export function clearRateLimit(identifier) {
  rateLimitMap.delete(identifier)
}