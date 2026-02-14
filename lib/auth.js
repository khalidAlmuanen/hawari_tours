// ═══════════════════════════════════════════════════════════════
// 🔐 Auth Helper Functions - Complete & Professional
// /lib/auth.js
// ═══════════════════════════════════════════════════════════════

import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d'

/**
 * Verify JWT token
 * @param {string} token - JWT token to verify
 * @returns {object|null} - Decoded token or null if invalid
 */
export function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    return decoded
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      console.log('Token expired')
    } else if (error.name === 'JsonWebTokenError') {
      console.log('Invalid token')
    }
    return null
  }
}

/**
 * Generate JWT token
 * @param {object} payload - Data to encode in token
 * @param {string} expiresIn - Token expiry (default: 7d)
 * @returns {string} - JWT token
 */
export function generateToken(payload, expiresIn = JWT_EXPIRES_IN) {
  try {
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn })
    return token
  } catch (error) {
    console.error('Token generation error:', error)
    throw new Error('Failed to generate token')
  }
}

/**
 * Decode token without verification (for debugging)
 * @param {string} token - JWT token
 * @returns {object|null} - Decoded token
 */
export function decodeToken(token) {
  try {
    return jwt.decode(token)
  } catch (error) {
    return null
  }
}

/**
 * Check if user has required role
 * @param {string} userRole - User's current role
 * @param {string|array} requiredRoles - Required role(s)
 * @returns {boolean}
 */
export function hasRole(userRole, requiredRoles) {
  if (!userRole) return false
  if (!requiredRoles) return true
  
  if (!Array.isArray(requiredRoles)) {
    requiredRoles = [requiredRoles]
  }
  
  return requiredRoles.includes(userRole)
}

/**
 * Role hierarchy (higher number = more permissions)
 */
const ROLE_HIERARCHY = {
  'USER': 1,
  'ADMIN': 2,
  'SUPER_ADMIN': 3
}

/**
 * Check if user has sufficient permissions based on role hierarchy
 * @param {string} userRole - User's current role
 * @param {string} requiredRole - Minimum required role
 * @returns {boolean}
 */
export function hasPermission(userRole, requiredRole) {
  if (!userRole || !requiredRole) return false
  
  const userLevel = ROLE_HIERARCHY[userRole] || 0
  const requiredLevel = ROLE_HIERARCHY[requiredRole] || 0
  
  return userLevel >= requiredLevel
}

/**
 * Get role level
 * @param {string} role - Role name
 * @returns {number} - Role level
 */
export function getRoleLevel(role) {
  return ROLE_HIERARCHY[role] || 0
}

/**
 * Check if token is expired
 * @param {string} token - JWT token
 * @returns {boolean}
 */
export function isTokenExpired(token) {
  try {
    const decoded = jwt.decode(token)
    if (!decoded || !decoded.exp) return true
    
    const currentTime = Math.floor(Date.now() / 1000)
    return decoded.exp < currentTime
  } catch (error) {
    return true
  }
}

/**
 * Get token expiry time
 * @param {string} token - JWT token
 * @returns {Date|null}
 */
export function getTokenExpiry(token) {
  try {
    const decoded = jwt.decode(token)
    if (!decoded || !decoded.exp) return null
    
    return new Date(decoded.exp * 1000)
  } catch (error) {
    return null
  }
}

/**
 * Refresh token (generate new token with same payload)
 * @param {string} token - Old token
 * @returns {string|null} - New token or null if invalid
 */
export function refreshToken(token) {
  try {
    const decoded = verifyToken(token)
    if (!decoded) return null
    
    // Remove jwt specific fields
    const { iat, exp, ...payload } = decoded
    
    // Generate new token
    return generateToken(payload)
  } catch (error) {
    console.error('Token refresh error:', error)
    return null
  }
}

/**
 * Extract user ID from token
 * @param {string} token - JWT token
 * @returns {string|null}
 */
export function getUserIdFromToken(token) {
  try {
    const decoded = jwt.decode(token)
    return decoded?.userId || null
  } catch (error) {
    return null
  }
}

/**
 * Create password reset token
 * @param {string} userId - User ID
 * @param {string} email - User email
 * @returns {string}
 */
export function createPasswordResetToken(userId, email) {
  return generateToken(
    { userId, email, type: 'password_reset' },
    '1h' // Reset token expires in 1 hour
  )
}

/**
 * Verify password reset token
 * @param {string} token - Reset token
 * @returns {object|null}
 */
export function verifyPasswordResetToken(token) {
  try {
    const decoded = verifyToken(token)
    if (!decoded || decoded.type !== 'password_reset') {
      return null
    }
    return decoded
  } catch (error) {
    return null
  }
}

/**
 * Create email verification token
 * @param {string} userId - User ID
 * @param {string} email - User email
 * @returns {string}
 */
export function createEmailVerificationToken(userId, email) {
  return generateToken(
    { userId, email, type: 'email_verification' },
    '24h' // Verification token expires in 24 hours
  )
}

/**
 * Verify email verification token
 * @param {string} token - Verification token
 * @returns {object|null}
 */
export function verifyEmailVerificationToken(token) {
  try {
    const decoded = verifyToken(token)
    if (!decoded || decoded.type !== 'email_verification') {
      return null
    }
    return decoded
  } catch (error) {
    return null
  }
}