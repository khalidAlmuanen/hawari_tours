import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/apiAuth'
import { randomUUID } from 'crypto'

// Map section string to Enum
const SECTION_MAP = {
  'quick-tips': 'QUICK_TIPS',
  'visa': 'VISA',
  'transport': 'TRANSPORT',
  'accommodation': 'ACCOMMODATION',
  'time': 'TIME',
  'safety': 'SAFETY',
  'packing-list': 'PACKING_LIST',
  'emergency': 'EMERGENCY',
  'extras': 'EXTRAS',
  'settings': 'SETTINGS'
}

// Helper to get diverse default content
const getDefaults = (type) => {
  switch (type) {
    case 'QUICK_TIPS': return []
    case 'VISA': return { requirements: [], overview: [], countries: [] }
    case 'TRANSPORT': return { flights: [], local: [] }
    case 'ACCOMMODATION': return []
    case 'TIME': return {} // Object for seasons
    case 'SAFETY': return []
    case 'PACKING_LIST': return []
    case 'EMERGENCY': return []
    case 'EXTRAS': return []
    case 'SETTINGS': return {}
    default: return []
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const sectionParam = searchParams.get('section')

    if (!sectionParam || !SECTION_MAP[sectionParam]) {
      return NextResponse.json({ success: false, error: 'Invalid section' }, { status: 400 })
    }

    const type = SECTION_MAP[sectionParam]

    let section = await prisma.travelGuideSection.findUnique({
      where: { type }
    })

    // If needed, we can create default if not exists, or just return empty
    // But better to just return default structure if null
    const content = section ? section.content : getDefaults(type)

    return NextResponse.json({
      success: true,
      data: content
    })

  } catch (error) {
    console.error('Travel Guide GET Error:', error)
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 })
  }
}

// POST - Add new item (for array-based sections) or Create Section
export async function POST(request) {
  const auth = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
  if (auth.error) return auth.error

  try {
    const body = await request.json()
    const { section: sectionParam, data } = body

    if (!sectionParam || !SECTION_MAP[sectionParam]) {
      return NextResponse.json({ success: false, error: 'Invalid section' }, { status: 400 })
    }

    const type = SECTION_MAP[sectionParam]

    // Fetch current
    let section = await prisma.travelGuideSection.findUnique({
      where: { type }
    })

    let content = section ? section.content : getDefaults(type)

    const ensureVisaObject = () => {
      if (Array.isArray(content)) {
        content = { requirements: content, overview: [], countries: [] }
      } else if (!content || typeof content !== 'object') {
        content = { requirements: [], overview: [], countries: [] }
      }
    }

    // Handle Array types (Quick Tips, Accommodation, etc.)
    if (Array.isArray(content)) {
      const newItem = {
        id: randomUUID(),
        ...data,
        createdAt: new Date().toISOString()
      }
      content.push(newItem)

      // Sort by order if present
      if (newItem.order !== undefined) {
        content.sort((a, b) => (a.order || 0) - (b.order || 0))
      }
    }
    // Handle Object types (Settings, Transport with sub-arrays) 
    else if (typeof content === 'object') {
      // Deep merge or specific logic could go here
      // For now, if it's an object, we assume we want to update/set specific keys or the whole object
      // But POST usually implies "Create".
      // For object types, POST might not be the right verb for partial updates, but let's support "Adding to a list inside an object" if needed.
      // For simplicity, let's assume POST for arrays adds an item, and for objects it might just merge or overwrite.

      // Special case for Transport which has sub-arrays
      if (type === 'TRANSPORT') {
        // Expect data to have { category: 'flights', item: {...} }
        if (data.category && Array.isArray(content[data.category])) {
          const newItem = {
            id: randomUUID(),
            ...data.item,
            createdAt: new Date().toISOString()
          }
          content[data.category].push(newItem)
        }
      } else if (type === 'VISA') {
        ensureVisaObject()
        const isCollectionUpdate = Array.isArray(data?.requirements) || Array.isArray(data?.overview) || Array.isArray(data?.countries)

        if (isCollectionUpdate) {
          content = {
            ...content,
            ...data,
            requirements: Array.isArray(data?.requirements) ? data.requirements : content.requirements,
            overview: Array.isArray(data?.overview) ? data.overview : content.overview,
            countries: Array.isArray(data?.countries) ? data.countries : content.countries
          }
        } else {
          const newItem = {
            id: randomUUID(),
            ...data,
            createdAt: new Date().toISOString()
          }
          content.requirements = Array.isArray(content.requirements) ? content.requirements : []
          content.requirements.push(newItem)
          if (newItem.order !== undefined) {
            content.requirements.sort((a, b) => (a.order || 0) - (b.order || 0))
          }
        }
      } else {
        // Default object behavior: Merge
        content = { ...content, ...data }
      }
    }

    // Upsert
    const updatedSection = await prisma.travelGuideSection.upsert({
      where: { type },
      create: {
        type,
        content
      },
      update: {
        content
      }
    })

    return NextResponse.json({
      success: true,
      data: updatedSection.content
    })

  } catch (error) {
    console.error('Travel Guide POST Error:', error)
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 })
  }
}

// PUT - Update item or entire section
export async function PUT(request) {
  const auth = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
  if (auth.error) return auth.error

  try {
    const body = await request.json()
    const { section: sectionParam, id, data } = body

    if (!sectionParam || !SECTION_MAP[sectionParam]) {
      return NextResponse.json({ success: false, error: 'Invalid section' }, { status: 400 })
    }

    const type = SECTION_MAP[sectionParam]

    const section = await prisma.travelGuideSection.findUnique({
      where: { type }
    })

    if (!section) {
      if (id) {
        return NextResponse.json({ success: false, error: 'Section not found' }, { status: 404 })
      }

      let content = getDefaults(type)
      if (!Array.isArray(content) && content && typeof content === 'object') {
        content = { ...content, ...data }
      }

      const createdSection = await prisma.travelGuideSection.create({
        data: { type, content }
      })

      return NextResponse.json({
        success: true,
        data: createdSection.content
      })
    }

    let content = section.content

    const ensureVisaObject = () => {
      if (Array.isArray(content)) {
        content = { requirements: content, overview: [], countries: [] }
      } else if (!content || typeof content !== 'object') {
        content = { requirements: [], overview: [], countries: [] }
      }
    }

    if (type === 'VISA') {
      ensureVisaObject()
      if (id) {
        const index = content.requirements?.findIndex(item => item.id === id) ?? -1
        if (index !== -1) {
          content.requirements[index] = { ...content.requirements[index], ...data }
          if (data.order !== undefined) {
            content.requirements.sort((a, b) => (a.order || 0) - (b.order || 0))
          }
        }
      } else {
        content = {
          ...content,
          ...data,
          requirements: Array.isArray(data?.requirements) ? data.requirements : content.requirements,
          overview: Array.isArray(data?.overview) ? data.overview : content.overview,
          countries: Array.isArray(data?.countries) ? data.countries : content.countries
        }
      }
    }
    // Update specific item in array
    else if (Array.isArray(content) && id) {
      const index = content.findIndex(item => item.id === id)
      if (index !== -1) {
        content[index] = { ...content[index], ...data }
        // Re-sort if order changed
        if (data.order !== undefined) {
          content.sort((a, b) => (a.order || 0) - (b.order || 0))
        }
      }
    }
    // Update specific item in object's sub-array (Transport)
    else if (typeof content === 'object' && id && type === 'TRANSPORT') {
      // Search in flights and local
      ['flights', 'local'].forEach(cat => {
        if (Array.isArray(content[cat])) {
          const index = content[cat].findIndex(item => item.id === id)
          if (index !== -1) {
            content[cat][index] = { ...content[cat][index], ...data }
          }
        }
      })
    }
    // Update entire object (Settings)
    else if (!Array.isArray(content) && !id) {
      content = { ...content, ...data }
    }

    const updatedSection = await prisma.travelGuideSection.update({
      where: { type },
      data: { content }
    })

    return NextResponse.json({
      success: true,
      data: updatedSection.content
    })

  } catch (error) {
    console.error('Travel Guide PUT Error:', error)
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 })
  }
}

// DELETE - Remove item
export async function DELETE(request) {
  const auth = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
  if (auth.error) return auth.error

  try {
    const { searchParams } = new URL(request.url)
    const sectionParam = searchParams.get('section')
    const id = searchParams.get('id')
    const category = searchParams.get('category') // For transport (flights/local)

    if (!sectionParam || !SECTION_MAP[sectionParam] || !id) {
      return NextResponse.json({ success: false, error: 'Invalid parameters' }, { status: 400 })
    }

    const type = SECTION_MAP[sectionParam]

    const section = await prisma.travelGuideSection.findUnique({
      where: { type }
    })

    if (!section) {
      return NextResponse.json({ success: false, error: 'Section not found' }, { status: 404 })
    }

    let content = section.content

    if (type === 'VISA') {
      if (Array.isArray(content)) {
        content = { requirements: content, overview: [], countries: [] }
      }
      if (content?.requirements) {
        content.requirements = content.requirements.filter(item => item.id !== id)
      }
    }
    else if (Array.isArray(content)) {
      content = content.filter(item => item.id !== id)
    }
    else if (typeof content === 'object' && type === 'TRANSPORT') {
      if (category && content[category]) {
        content[category] = content[category].filter(item => item.id !== id)
      } else {
        // Try to delete from both if category not specified
        content.flights = content.flights?.filter(item => item.id !== id)
        content.local = content.local?.filter(item => item.id !== id)
      }
    }

    const updatedSection = await prisma.travelGuideSection.update({
      where: { type },
      data: { content }
    })

    return NextResponse.json({
      success: true,
      data: updatedSection.content
    })

  } catch (error) {
    console.error('Travel Guide DELETE Error:', error)
    return NextResponse.json({ success: false, error: 'Server Error' }, { status: 500 })
  }
}
