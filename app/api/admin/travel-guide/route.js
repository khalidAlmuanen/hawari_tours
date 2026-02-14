// ═══════════════════════════════════════════════════════════════
// 🧳 Travel Guide Management API - ADMIN ONLY
// إدارة دليل السفر بشكل احترافي وشامل
// Handles: Quick Tips, Visa, Flights, Transport, Accommodation, Safety, Emergency, Packing
// ═══════════════════════════════════════════════════════════════

import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/apiAuth'
import prisma from '@/lib/prisma'

// ═══════════════════════════════════════════════════════════════
// GET - Fetch All Travel Guide Data (Admin)
// ═══════════════════════════════════════════════════════════════
export async function GET(request) {
  try {
    // Verify admin auth
    const authResult = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
    if (authResult.error) {
      return NextResponse.json(authResult, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const section = searchParams.get('section') // quick-tips, visa, flights, etc.

    // If specific section requested
    if (section) {
      let data
      switch (section) {
        case 'quick-tips':
          data = await prisma.quickTip.findMany({
            orderBy: { order: 'asc' }
          })
          break
        case 'visa':
          data = await prisma.visaRequirement.findMany({
            orderBy: { order: 'asc' }
          })
          break
        case 'flights':
          data = await prisma.flightRoute.findMany({
            orderBy: { order: 'asc' }
          })
          break
        case 'transport':
          data = await prisma.localTransport.findMany({
            orderBy: { order: 'asc' }
          })
          break
        case 'accommodation':
          data = await prisma.accommodationType.findMany({
            orderBy: { order: 'asc' }
          })
          break
        case 'safety':
          data = await prisma.safetyCategory.findMany({
            orderBy: { order: 'asc' }
          })
          break
        case 'emergency':
          data = await prisma.emergencyContact.findMany({
            orderBy: { order: 'asc' }
          })
          break
        case 'packing':
          data = await prisma.packingCategory.findMany({
            orderBy: { order: 'asc' }
          })
          break
        case 'settings':
          data = await prisma.travelGuideSetting.findFirst()
          if (!data) {
            data = await prisma.travelGuideSetting.create({ data: {} })
          }
          break
        default:
          return NextResponse.json({
            success: false,
            error: 'Invalid section'
          }, { status: 400 })
      }

      return NextResponse.json({
        success: true,
        data
      })
    }

    // Fetch all data
    const [
      quickTips,
      visaRequirements,
      flightRoutes,
      localTransport,
      accommodationTypes,
      safetyCategories,
      emergencyContacts,
      packingCategories,
      settings
    ] = await Promise.all([
      prisma.quickTip.findMany({ orderBy: { order: 'asc' } }),
      prisma.visaRequirement.findMany({ orderBy: { order: 'asc' } }),
      prisma.flightRoute.findMany({ orderBy: { order: 'asc' } }),
      prisma.localTransport.findMany({ orderBy: { order: 'asc' } }),
      prisma.accommodationType.findMany({ orderBy: { order: 'asc' } }),
      prisma.safetyCategory.findMany({ orderBy: { order: 'asc' } }),
      prisma.emergencyContact.findMany({ orderBy: { order: 'asc' } }),
      prisma.packingCategory.findMany({ orderBy: { order: 'asc' } }),
      prisma.travelGuideSetting.findFirst()
    ])

    // Calculate stats
    const stats = {
      quickTips: quickTips.length,
      visaRequirements: visaRequirements.length,
      flightRoutes: flightRoutes.length,
      localTransport: localTransport.length,
      accommodationTypes: accommodationTypes.length,
      safetyCategories: safetyCategories.length,
      emergencyContacts: emergencyContacts.length,
      packingCategories: packingCategories.length
    }

    return NextResponse.json({
      success: true,
      data: {
        quickTips,
        visaRequirements,
        flightRoutes,
        localTransport,
        accommodationTypes,
        safetyCategories,
        emergencyContacts,
        packingCategories,
        settings: settings || {},
        stats
      }
    })

  } catch (error) {
    console.error('Travel Guide GET Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch travel guide data',
      details: error.message
    }, { status: 500 })
  }
}

// ═══════════════════════════════════════════════════════════════
// POST - Create New Item
// ═══════════════════════════════════════════════════════════════
export async function POST(request) {
  try {
    // Verify admin auth
    const authResult = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
    if (authResult.error) {
      return NextResponse.json(authResult, { status: 401 })
    }

    const body = await request.json()
    const { section, data } = body

    if (!section || !data) {
      return NextResponse.json({
        success: false,
        error: 'Section and data are required'
      }, { status: 400 })
    }

    let result
    switch (section) {
      case 'quick-tips':
        result = await prisma.quickTip.create({ data })
        break
      case 'visa':
        result = await prisma.visaRequirement.create({ data })
        break
      case 'flights':
        result = await prisma.flightRoute.create({ data })
        break
      case 'transport':
        result = await prisma.localTransport.create({ data })
        break
      case 'accommodation':
        result = await prisma.accommodationType.create({ data })
        break
      case 'safety':
        result = await prisma.safetyCategory.create({ data })
        break
      case 'emergency':
        result = await prisma.emergencyContact.create({ data })
        break
      case 'packing':
        result = await prisma.packingCategory.create({ data })
        break
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid section'
        }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: 'Item created successfully',
      data: result
    }, { status: 201 })

  } catch (error) {
    console.error('Travel Guide POST Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to create item',
      details: error.message
    }, { status: 500 })
  }
}

// ═══════════════════════════════════════════════════════════════
// PUT - Update Item or Settings
// ═══════════════════════════════════════════════════════════════
export async function PUT(request) {
  try {
    // Verify admin auth
    const authResult = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
    if (authResult.error) {
      return NextResponse.json(authResult, { status: 401 })
    }

    const body = await request.json()
    const { section, id, data } = body

    if (!section) {
      return NextResponse.json({
        success: false,
        error: 'Section is required'
      }, { status: 400 })
    }

    // Handle settings update (no ID needed)
    if (section === 'settings') {
      let settings = await prisma.travelGuideSetting.findFirst()
      
      if (settings) {
        settings = await prisma.travelGuideSetting.update({
          where: { id: settings.id },
          data
        })
      } else {
        settings = await prisma.travelGuideSetting.create({ data })
      }

      return NextResponse.json({
        success: true,
        message: 'Settings updated successfully',
        data: settings
      })
    }

    // Handle regular items (ID required)
    if (!id) {
      return NextResponse.json({
        success: false,
        error: 'ID is required for non-settings updates'
      }, { status: 400 })
    }

    let result
    switch (section) {
      case 'quick-tips':
        result = await prisma.quickTip.update({ where: { id }, data })
        break
      case 'visa':
        result = await prisma.visaRequirement.update({ where: { id }, data })
        break
      case 'flights':
        result = await prisma.flightRoute.update({ where: { id }, data })
        break
      case 'transport':
        result = await prisma.localTransport.update({ where: { id }, data })
        break
      case 'accommodation':
        result = await prisma.accommodationType.update({ where: { id }, data })
        break
      case 'safety':
        result = await prisma.safetyCategory.update({ where: { id }, data })
        break
      case 'emergency':
        result = await prisma.emergencyContact.update({ where: { id }, data })
        break
      case 'packing':
        result = await prisma.packingCategory.update({ where: { id }, data })
        break
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid section'
        }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: 'Item updated successfully',
      data: result
    })

  } catch (error) {
    console.error('Travel Guide PUT Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to update item',
      details: error.message
    }, { status: 500 })
  }
}

// ═══════════════════════════════════════════════════════════════
// DELETE - Delete Item
// ═══════════════════════════════════════════════════════════════
export async function DELETE(request) {
  try {
    // Verify admin auth
    const authResult = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
    if (authResult.error) {
      return NextResponse.json(authResult, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const section = searchParams.get('section')
    const id = searchParams.get('id')

    if (!section || !id) {
      return NextResponse.json({
        success: false,
        error: 'Section and ID are required'
      }, { status: 400 })
    }

    switch (section) {
      case 'quick-tips':
        await prisma.quickTip.delete({ where: { id } })
        break
      case 'visa':
        await prisma.visaRequirement.delete({ where: { id } })
        break
      case 'flights':
        await prisma.flightRoute.delete({ where: { id } })
        break
      case 'transport':
        await prisma.localTransport.delete({ where: { id } })
        break
      case 'accommodation':
        await prisma.accommodationType.delete({ where: { id } })
        break
      case 'safety':
        await prisma.safetyCategory.delete({ where: { id } })
        break
      case 'emergency':
        await prisma.emergencyContact.delete({ where: { id } })
        break
      case 'packing':
        await prisma.packingCategory.delete({ where: { id } })
        break
      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid section'
        }, { status: 400 })
    }

    return NextResponse.json({
      success: true,
      message: 'Item deleted successfully'
    })

  } catch (error) {
    console.error('Travel Guide DELETE Error:', error)
    return NextResponse.json({
      success: false,
      error: 'Failed to delete item',
      details: error.message
    }, { status: 500 })
  }
}
