// ═══════════════════════════════════════════════════════════════
// 🧳 Travel Guide Admin API - Quick Tips Management
// API لإدارة النصائح السريعة
// ═══════════════════════════════════════════════════════════════

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// ═══════════════════════════════════════════════════════════════
// GET - Fetch all Quick Tips
// ═══════════════════════════════════════════════════════════════
export async function GET(request) {
  try {
    const tips = await prisma.quickTip.findMany({
      orderBy: { order: 'asc' }
    })

    console.log(`✅ [Quick Tips API] Fetched ${tips.length} tips`)

    return NextResponse.json({
      success: true,
      data: tips
    })

  } catch (error) {
    console.error('❌ [Quick Tips API] GET Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch quick tips',
        details: error.message
      },
      { status: 500 }
    )
  }
}

// ═══════════════════════════════════════════════════════════════
// POST - Create or Update Quick Tip
// ═══════════════════════════════════════════════════════════════
export async function POST(request) {
  try {
    const body = await request.json()
    const { id, titleAr, titleEn, descriptionAr, descriptionEn, icon, gradient, order, isActive } = body

    // Validate required fields
    if (!titleAr || !titleEn || !descriptionAr || !descriptionEn || !icon) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields'
        },
        { status: 400 }
      )
    }

    let tip

    if (id) {
      // Update existing tip
      tip = await prisma.quickTip.update({
        where: { id },
        data: {
          titleAr,
          titleEn,
          descriptionAr,
          descriptionEn,
          icon,
          gradient: gradient || 'from-blue-500 to-cyan-600',
          order: order || 1,
          isActive: isActive !== undefined ? isActive : true
        }
      })

      console.log(`✅ [Quick Tips API] Updated tip ID: ${id}`)
    } else {
      // Create new tip
      tip = await prisma.quickTip.create({
        data: {
          titleAr,
          titleEn,
          descriptionAr,
          descriptionEn,
          icon,
          gradient: gradient || 'from-blue-500 to-cyan-600',
          order: order || 1,
          isActive: isActive !== undefined ? isActive : true
        }
      })

      console.log(`✅ [Quick Tips API] Created new tip ID: ${tip.id}`)
    }

    return NextResponse.json({
      success: true,
      data: tip
    })

  } catch (error) {
    console.error('❌ [Quick Tips API] POST Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to save quick tip',
        details: error.message
      },
      { status: 500 }
    )
  }
}

// ═══════════════════════════════════════════════════════════════
// DELETE - Delete Quick Tip
// ═══════════════════════════════════════════════════════════════
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing tip ID'
        },
        { status: 400 }
      )
    }

    await prisma.quickTip.delete({
      where: { id }
    })

    console.log(`✅ [Quick Tips API] Deleted tip ID: ${id}`)

    return NextResponse.json({
      success: true,
      message: 'Tip deleted successfully'
    })

  } catch (error) {
    console.error('❌ [Quick Tips API] DELETE Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete quick tip',
        details: error.message
      },
      { status: 500 }
    )
  }
}