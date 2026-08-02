import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

// GET all content for admin (including inactive)
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const type = searchParams.get('type')

        let data

        if (type === 'timeline') {
            data = await prisma.timelineEvent.findMany({ orderBy: { order: 'asc' } })
        } else if (type === 'sites') {
            data = await prisma.archaeologicalSite.findMany({ orderBy: { order: 'asc' } })
        } else if (type === 'sections') {
            const sections = await prisma.historicalSection.findMany()
            data = sections.reduce((acc, section) => {
                acc[section.slug] = section
                return acc
            }, {})
        } else if (type === 'settings') {
            const settings = await prisma.historyPageSetting.findFirst()
            return NextResponse.json({ success: true, data: settings || {} })
        } else {
            const [timelineEvents, archaeologicalSites, historicalSections, pageSettings] = await Promise.all([
                prisma.timelineEvent.findMany({ orderBy: { order: 'asc' } }),
                prisma.archaeologicalSite.findMany({ orderBy: { order: 'asc' } }),
                prisma.historicalSection.findMany(),
                prisma.historyPageSetting.findFirst()
            ])

            data = {
                timelineEvents,
                archaeologicalSites,
                historicalSections: historicalSections.reduce((acc, section) => {
                    acc[section.slug] = section
                    return acc
                }, {}),
                pageSettings: pageSettings || {}
            }
        }

        return NextResponse.json({ success: true, data })
    } catch (error) {
        console.error('Error fetching admin history:', error)
        return NextResponse.json({ success: false, error: 'Failed to fetch data' }, { status: 500 })
    }
}

// POST create new item
export async function POST(request) {
    try {
        const body = await request.json()
        const { type, data } = body

        // ... existing POST logic ... 
        // Note: Settings are singular, so we only update them via PUT, no POST needed usually unless initialization.
        // But for completeness, we can handle it or just rely on PUTupsert. 
        // Existing POST logic remains for timeline/sites.

        let result

        if (type === 'timeline') {
            // Get max order
            const maxOrder = await prisma.timelineEvent.aggregate({ _max: { order: true } })
            const order = (maxOrder._max.order || 0) + 1

            result = await prisma.timelineEvent.create({
                data: { ...data, order }
            })
        } else if (type === 'site') {
            const maxOrder = await prisma.archaeologicalSite.aggregate({ _max: { order: true } })
            const order = (maxOrder._max.order || 0) + 1

            result = await prisma.archaeologicalSite.create({
                data: { ...data, order }
            })
        } else {
            return NextResponse.json({ success: false, error: 'Invalid type' }, { status: 400 })
        }

        // Return updated full list or just the new item? Returning full list is easier for state update but less efficient. 
        // Let's return the full lists to keep UI in sync easily as per original implementation.
        // Actually, to follow the pattern, let's return the unified data structure again or just the new item 
        // and let frontend handle it. The original code returned the FULL content object.
        // We will replicate that behavior for compatibility with the frontend logic I will write.

        // Efficient approach: fetch fresh data
        const [timelineEvents, archaeologicalSites, historicalSections, pageSettings] = await Promise.all([
            prisma.timelineEvent.findMany({ orderBy: { order: 'asc' } }),
            prisma.archaeologicalSite.findMany({ orderBy: { order: 'asc' } }),
            prisma.historicalSection.findMany(),
            prisma.historyPageSetting.findFirst()
        ])

        const allData = {
            timelineEvents,
            archaeologicalSites,
            historicalSections: historicalSections.reduce((acc, section) => {
                acc[section.slug] = section
                return acc
            }, {}),
            pageSettings: pageSettings || {}
        }

        return NextResponse.json({ success: true, data: allData })

    } catch (error) {
        console.error('Error creating item:', error)
        return NextResponse.json({ success: false, error: 'Failed to create item' }, { status: 500 })
    }
}

// PUT update item
export async function PUT(request) {
    try {
        const body = await request.json()
        const { type, id, data } = body

        // Sanitize data to remove fields that shouldn't be updated
        const { id: _id, createdAt, updatedAt, ...cleanData } = data

        if (type === 'timeline') {
            // Ensure correct types for TimelineEvent
            const sanitizedData = {
                ...cleanData,
                order: cleanData.order ? parseInt(cleanData.order) : undefined,
                isActive: cleanData.isActive === undefined ? undefined : Boolean(cleanData.isActive)
            }

            // Remove undefined keys
            Object.keys(sanitizedData).forEach(key => sanitizedData[key] === undefined && delete sanitizedData[key])

            await prisma.timelineEvent.update({
                where: { id },
                data: sanitizedData
            })
        } else if (type === 'site') {
            // Ensure correct types for ArchaeologicalSite
            const sanitizedData = {
                ...cleanData,
                order: cleanData.order ? parseInt(cleanData.order) : undefined,
                featured: cleanData.featured === undefined ? undefined : Boolean(cleanData.featured),
                isActive: cleanData.isActive === undefined ? undefined : Boolean(cleanData.isActive)
            }

            // Remove undefined keys
            Object.keys(sanitizedData).forEach(key => sanitizedData[key] === undefined && delete sanitizedData[key])

            await prisma.archaeologicalSite.update({
                where: { id },
                data: sanitizedData
            })
        } else if (type === 'sections') {
            // Data is an object { ancient: { ... }, colonial: { ... } }
            // We need to upsert each section

            const transactions = Object.entries(data).map(([slug, sectionData]) => {
                // Ensure sectionData is an object
                const safeData = sectionData || {}

                return prisma.historicalSection.upsert({
                    where: { slug },
                    update: {
                        titleEn: safeData.titleEn || '',
                        titleAr: safeData.titleAr || '',
                        contentEn: safeData.contentEn || '',
                        contentAr: safeData.contentAr || '',
                        isActive: safeData.isActive === undefined ? true : Boolean(safeData.isActive)
                    },
                    create: {
                        slug,
                        titleEn: safeData.titleEn || '',
                        titleAr: safeData.titleAr || '',
                        contentEn: safeData.contentEn || '',
                        contentAr: safeData.contentAr || '',
                        isActive: safeData.isActive === undefined ? true : Boolean(safeData.isActive)
                    }
                })
            })

            await prisma.$transaction(transactions)
        } else if (type === 'settings') {
            // Update Page Settings
            // Check if exists first
            const existing = await prisma.historyPageSetting.findFirst()

            if (existing) {
                await prisma.historyPageSetting.update({
                    where: { id: existing.id },
                    data: cleanData
                })
            } else {
                await prisma.historyPageSetting.create({
                    data: cleanData
                })
            }
        } else {
            return NextResponse.json({ success: false, error: 'Invalid type' }, { status: 400 })
        }

        // Return fresh data
        const [timelineEvents, archaeologicalSites, historicalSections, pageSettings] = await Promise.all([
            prisma.timelineEvent.findMany({ orderBy: { order: 'asc' } }),
            prisma.archaeologicalSite.findMany({ orderBy: { order: 'asc' } }),
            prisma.historicalSection.findMany(),
            prisma.historyPageSetting.findFirst()
        ])

        const allData = {
            timelineEvents,
            archaeologicalSites,
            historicalSections: historicalSections.reduce((acc, section) => {
                acc[section.slug] = section
                return acc
            }, {}),
            pageSettings: pageSettings || {}
        }

        return NextResponse.json({ success: true, data: allData })
    } catch (error) {
        console.error('Error updating history:', error)
        // Return the specific error message for debugging
        return NextResponse.json({ success: false, error: `Failed to update: ${error.message}` }, { status: 500 })
    }
}

// DELETE item
export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url)
        const type = searchParams.get('type')
        const id = searchParams.get('id')

        if (!id) return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 })

        if (type === 'timeline') {
            await prisma.timelineEvent.delete({ where: { id } })
        } else if (type === 'site') {
            await prisma.archaeologicalSite.delete({ where: { id } })
        } else {
            return NextResponse.json({ success: false, error: 'Invalid type' }, { status: 400 })
        }

        // Return fresh data
        const [timelineEvents, archaeologicalSites, historicalSections] = await Promise.all([
            prisma.timelineEvent.findMany({ orderBy: { order: 'asc' } }),
            prisma.archaeologicalSite.findMany({ orderBy: { order: 'asc' } }),
            prisma.historicalSection.findMany()
        ])

        const allData = {
            timelineEvents,
            archaeologicalSites,
            historicalSections: historicalSections.reduce((acc, section) => {
                acc[section.slug] = section
                return acc
            }, {})
        }

        return NextResponse.json({ success: true, data: allData })
    } catch (error) {
        console.error('Error deleting item:', error)
        return NextResponse.json({ success: false, error: 'Failed to delete' }, { status: 500 })
    }
}
