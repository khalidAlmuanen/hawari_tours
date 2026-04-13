import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/apiAuth'

const fetchAll = async () => {
    const [heroSlides, quickStats, welcomeMessages, whyChooseUs] = await Promise.all([
        prisma.heroSlide.findMany({ orderBy: { order: 'asc' } }),
        prisma.quickStat.findMany({ orderBy: { order: 'asc' } }),
        prisma.welcomeMessage.findMany({ orderBy: { updatedAt: 'desc' } }),
        prisma.whyChooseUs.findMany({ orderBy: { order: 'asc' } })
    ])

    return { heroSlides, quickStats, welcomeMessages, whyChooseUs }
}

const normalizeOrder = async (model, value) => {
    if (value !== undefined && value !== null && value !== '') {
        const parsed = parseInt(value)
        if (!Number.isNaN(parsed)) return parsed
    }
    const maxOrder = await model.aggregate({ _max: { order: true } })
    return (maxOrder._max.order || 0) + 1
}

export async function GET() {
    try {
        const data = await fetchAll()
        return NextResponse.json({ success: true, data })
    } catch (error) {
        console.error('Error fetching homepage content:', error)
        return NextResponse.json({ success: false, error: 'Failed to fetch homepage content' }, { status: 500 })
    }
}

export async function POST(request) {
    const auth = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
    if (auth.error) return auth.error

    try {
        const body = await request.json()
        const { type, data } = body || {}
        const { id, createdAt, updatedAt, ...cleanData } = data || {}

        if (type === 'hero') {
            const order = await normalizeOrder(prisma.heroSlide, cleanData.order)
            await prisma.heroSlide.create({
                data: { ...cleanData, order, isActive: cleanData.isActive ?? true }
            })
        } else if (type === 'stats') {
            const order = await normalizeOrder(prisma.quickStat, cleanData.order)
            await prisma.quickStat.create({
                data: { ...cleanData, order, isActive: cleanData.isActive ?? true }
            })
        } else if (type === 'welcome') {
            await prisma.welcomeMessage.create({
                data: { ...cleanData, isActive: cleanData.isActive ?? true }
            })
        } else if (type === 'why') {
            const order = await normalizeOrder(prisma.whyChooseUs, cleanData.order)
            await prisma.whyChooseUs.create({
                data: { ...cleanData, order, isActive: cleanData.isActive ?? true }
            })
        } else {
            return NextResponse.json({ success: false, error: 'Invalid type' }, { status: 400 })
        }

        const updated = await fetchAll()
        return NextResponse.json({ success: true, data: updated })
    } catch (error) {
        console.error('Error creating homepage content:', error)
        return NextResponse.json({ success: false, error: 'Failed to create content' }, { status: 500 })
    }
}

export async function PUT(request) {
    const auth = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
    if (auth.error) return auth.error

    try {
        const body = await request.json()
        const { type, id, data } = body || {}
        const { createdAt, updatedAt, ...cleanData } = data || {}

        if (!id) {
            return NextResponse.json({ success: false, error: 'Missing id' }, { status: 400 })
        }

        if (type === 'hero') {
            const order = await normalizeOrder(prisma.heroSlide, cleanData.order)
            await prisma.heroSlide.update({
                where: { id },
                data: { ...cleanData, order, isActive: cleanData.isActive ?? true }
            })
        } else if (type === 'stats') {
            const order = await normalizeOrder(prisma.quickStat, cleanData.order)
            await prisma.quickStat.update({
                where: { id },
                data: { ...cleanData, order, isActive: cleanData.isActive ?? true }
            })
        } else if (type === 'welcome') {
            await prisma.welcomeMessage.update({
                where: { id },
                data: { ...cleanData, isActive: cleanData.isActive ?? true }
            })
        } else if (type === 'why') {
            const order = await normalizeOrder(prisma.whyChooseUs, cleanData.order)
            await prisma.whyChooseUs.update({
                where: { id },
                data: { ...cleanData, order, isActive: cleanData.isActive ?? true }
            })
        } else {
            return NextResponse.json({ success: false, error: 'Invalid type' }, { status: 400 })
        }

        const updated = await fetchAll()
        return NextResponse.json({ success: true, data: updated })
    } catch (error) {
        console.error('Error updating homepage content:', error)
        return NextResponse.json({ success: false, error: 'Failed to update content' }, { status: 500 })
    }
}

export async function DELETE(request) {
    const auth = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
    if (auth.error) return auth.error

    try {
        const { searchParams } = new URL(request.url)
        const type = searchParams.get('type')
        const id = searchParams.get('id')

        if (!type || !id) {
            return NextResponse.json({ success: false, error: 'Missing type or id' }, { status: 400 })
        }

        if (type === 'hero') {
            await prisma.heroSlide.delete({ where: { id } })
        } else if (type === 'stats') {
            await prisma.quickStat.delete({ where: { id } })
        } else if (type === 'welcome') {
            await prisma.welcomeMessage.delete({ where: { id } })
        } else if (type === 'why') {
            await prisma.whyChooseUs.delete({ where: { id } })
        } else {
            return NextResponse.json({ success: false, error: 'Invalid type' }, { status: 400 })
        }

        const updated = await fetchAll()
        return NextResponse.json({ success: true, data: updated })
    } catch (error) {
        console.error('Error deleting homepage content:', error)
        return NextResponse.json({ success: false, error: 'Failed to delete content' }, { status: 500 })
    }
}
