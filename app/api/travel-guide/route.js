// ═══════════════════════════════════════════════════════════════
// 🧳 Travel Guide API - Public (Read-only)
// API عامة لجلب كل بيانات دليل السفر
// ═══════════════════════════════════════════════════════════════

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// ═══════════════════════════════════════════════════════════════
// GET - Fetch Complete Travel Guide Content (Public)
// ═══════════════════════════════════════════════════════════════
export async function GET(request) {
  try {
    // Fetch all active data in parallel
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
      prisma.quickTip.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' }
      }),
      prisma.visaRequirement.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' }
      }),
      prisma.flightRoute.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' }
      }),
      prisma.localTransport.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' }
      }),
      prisma.accommodationType.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' }
      }),
      prisma.safetyCategory.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' }
      }),
      prisma.emergencyContact.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' }
      }),
      prisma.packingCategory.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' }
      }),
      prisma.travelGuideSetting.findFirst()
    ])

    // Parse JSON fields for accommodation types
    const parsedAccommodationTypes = accommodationTypes.map(type => ({
      ...type,
      features: type.features.map(f => JSON.parse(f)),
      examples: type.examples.map(e => JSON.parse(e))
    }))

    // Parse JSON fields for local transport
    const parsedLocalTransport = localTransport.map(transport => ({
      ...transport,
      features: transport.features.map(f => JSON.parse(f))
    }))

    // Parse JSON fields for safety categories
    const parsedSafetyCategories = safetyCategories.map(cat => ({
      ...cat,
      tips: cat.tips.map(t => JSON.parse(t))
    }))

    // Parse JSON fields for packing categories
    const parsedPackingCategories = packingCategories.map(cat => ({
      ...cat,
      items: cat.items.map(i => JSON.parse(i))
    }))

    console.log(`✅ [Travel Guide API] Complete data fetched successfully`)

    return NextResponse.json({
      success: true,
      data: {
        quickTips,
        visaRequirements,
        flightRoutes,
        localTransport: parsedLocalTransport,
        accommodationTypes: parsedAccommodationTypes,
        safetyCategories: parsedSafetyCategories,
        emergencyContacts,
        packingCategories: parsedPackingCategories,
        settings: settings || {
          heroTitleAr: 'دليل السفر',
          heroTitleEn: 'Travel Guide'
        }
      }
    })

  } catch (error) {
    console.error('❌ [Travel Guide API] Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch travel guide content',
        details: error.message
      },
      { status: 500 }
    )
  }
}
