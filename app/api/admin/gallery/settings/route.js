// ═══════════════════════════════════════════════════════════════
// ⚙️ Gallery Settings Management API - ADMIN ONLY
// إدارة إعدادات صفحة المعرض بشكل شامل واحترافي
// ═══════════════════════════════════════════════════════════════

import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/apiAuth'
import prisma from '@/lib/prisma'

// ═══════════════════════════════════════════════════════════════
// GET - Fetch Gallery Settings
// ═══════════════════════════════════════════════════════════════
export async function GET(request) {
  try {
    // Verify admin auth
    const authResult = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
    if (authResult.error) {
      return NextResponse.json(authResult, { status: 401 })
    }

    // Try to get existing settings
    let settings = await prisma.gallerySetting.findFirst()

    // If no settings exist, create default settings
    if (!settings) {
      settings = await prisma.gallerySetting.create({
        data: {
          // Default values are set in the schema
        }
      })
    }

    return NextResponse.json({
      success: true,
      data: settings
    })

  } catch (error) {
    console.error('Gallery Settings GET Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch settings',
      details: error.message
    }, { status: 500 })
  }
}

// ═══════════════════════════════════════════════════════════════
// PUT - Update Gallery Settings
// ═══════════════════════════════════════════════════════════════
export async function PUT(request) {
  try {
    // Verify admin auth
    const authResult = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
    if (authResult.error) {
      return NextResponse.json(authResult, { status: 401 })
    }

    const body = await request.json()

    // Get existing settings
    let settings = await prisma.gallerySetting.findFirst()

    if (settings) {
      // Update existing settings
      settings = await prisma.gallerySetting.update({
        where: { id: settings.id },
        data: body
      })
    } else {
      // Create new settings
      settings = await prisma.gallerySetting.create({
        data: body
      })
    }

    return NextResponse.json({
      success: true,
      message: 'Gallery settings updated successfully',
      data: settings
    })

  } catch (error) {
    console.error('Gallery Settings PUT Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update settings',
      details: error.message
    }, { status: 500 })
  }
}

// ═══════════════════════════════════════════════════════════════
// POST - Reset to Default Settings
// ═══════════════════════════════════════════════════════════════
export async function POST(request) {
  try {
    // Verify admin auth
    const authResult = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
    if (authResult.error) {
      return NextResponse.json(authResult, { status: 401 })
    }

    // Delete existing settings
    await prisma.gallerySetting.deleteMany()

    // Create new default settings
    const settings = await prisma.gallerySetting.create({
      data: {
        // Default values from schema
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Gallery settings reset to defaults successfully',
      data: settings
    })

  } catch (error) {
    console.error('Gallery Settings POST Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to reset settings',
      details: error.message
    }, { status: 500 })
  }
}
