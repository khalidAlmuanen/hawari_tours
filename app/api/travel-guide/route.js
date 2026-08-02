// ═══════════════════════════════════════════════════════════════
// 🧳 Travel Guide API - Public (Read-only)
// API عامة لجلب كل بيانات دليل السفر
// ═══════════════════════════════════════════════════════════════

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

const SECTION_MAP = {
  settings: 'SETTINGS',
  'quick-tips': 'QUICK_TIPS',
  visa: 'VISA',
  transport: 'TRANSPORT',
  accommodation: 'ACCOMMODATION',
  safety: 'SAFETY',
  time: 'TIME',
  'packing-list': 'PACKING_LIST',
  emergency: 'EMERGENCY',
  extras: 'EXTRAS'
}

const getDefaults = (type) => {
  switch (type) {
    case 'QUICK_TIPS': return []
    case 'VISA': return { requirements: [], overview: [], countries: [] }
    case 'TRANSPORT': return { flights: [], local: [] }
    case 'ACCOMMODATION': return []
    case 'TIME': return {}
    case 'SAFETY': return []
    case 'PACKING_LIST': return []
    case 'EMERGENCY': return []
    case 'EXTRAS': return []
    case 'SETTINGS': return {}
    default: return []
  }
}

const normalizeContent = (type, content) => {
  const defaults = getDefaults(type)
  if (type === 'VISA') {
    if (Array.isArray(content)) {
      return { ...defaults, requirements: content }
    }
    if (content && typeof content === 'object' && !Array.isArray(content)) {
      return {
        ...defaults,
        ...content,
        requirements: Array.isArray(content.requirements) ? content.requirements : defaults.requirements,
        overview: Array.isArray(content.overview) ? content.overview : defaults.overview,
        countries: Array.isArray(content.countries) ? content.countries : defaults.countries
      }
    }
    return defaults
  }
  if (Array.isArray(defaults)) {
    return Array.isArray(content) ? content : defaults
  }
  if (defaults && typeof defaults === 'object') {
    return content && typeof content === 'object' && !Array.isArray(content) ? content : defaults
  }
  return content ?? defaults
}

// ═══════════════════════════════════════════════════════════════
// GET - Fetch Complete Travel Guide Content (Public)
// ═══════════════════════════════════════════════════════════════
export async function GET(request) {
  try {
    const sections = await prisma.travelGuideSection.findMany({
      where: { type: { in: Object.values(SECTION_MAP) } }
    })

    const contentByType = sections.reduce((acc, section) => {
      acc[section.type] = normalizeContent(section.type, section.content)
      return acc
    }, {})

    return NextResponse.json({
      success: true,
      data: {
        settings: contentByType.SETTINGS ?? getDefaults('SETTINGS'),
        quickTips: contentByType.QUICK_TIPS ?? getDefaults('QUICK_TIPS'),
        visa: contentByType.VISA ?? getDefaults('VISA'),
        transport: contentByType.TRANSPORT ?? getDefaults('TRANSPORT'),
        accommodation: contentByType.ACCOMMODATION ?? getDefaults('ACCOMMODATION'),
        safety: contentByType.SAFETY ?? getDefaults('SAFETY'),
        time: contentByType.TIME ?? getDefaults('TIME'),
        packingList: contentByType.PACKING_LIST ?? getDefaults('PACKING_LIST'),
        emergency: contentByType.EMERGENCY ?? getDefaults('EMERGENCY'),
        extras: contentByType.EXTRAS ?? getDefaults('EXTRAS')
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
