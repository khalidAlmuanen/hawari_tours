// ═══════════════════════════════════════════════════════════════
// 📧 Admin Messages API - Complete CRUD (Protected)
// /app/api/admin/messages/route.js
// ═══════════════════════════════════════════════════════════════

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/apiAuth'

// ═══════════════════════════════════════════════════════════════
// GET - Get all messages with filters
// ═══════════════════════════════════════════════════════════════

export async function GET(request) {
  const auth = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
  if (auth.error) return auth.error

  try {
    const { searchParams } = new URL(request.url)

    // Pagination
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const skip = (page - 1) * limit

    // Filters
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const sortBy = searchParams.get('sortBy') || 'createdAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    // Build where clause
    const where = {
      AND: [
        // Search by name, email, subject
        search
          ? {
              OR: [
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { subject: { contains: search, mode: 'insensitive' } }
              ]
            }
          : {},

        // Status filter
        status && status !== 'all' ? { status } : {}
      ]
    }

    // Execute queries in parallel
    const [messages, total, stats] = await Promise.all([
      prisma.message.findMany({
        where,
        skip,
        take: limit,
        orderBy: { [sortBy]: sortOrder },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        }
      }),
      prisma.message.count({ where }),
      prisma.message.groupBy({
        by: ['status'],
        _count: true
      })
    ])

    // Format stats
    const formattedStats = {
      total,
      unread: stats.find(s => s.status === 'UNREAD')?._count || 0,
      read: stats.find(s => s.status === 'READ')?._count || 0,
      replied: stats.find(s => s.status === 'REPLIED')?._count || 0,
      archived: stats.find(s => s.status === 'ARCHIVED')?._count || 0
    }

    return NextResponse.json({
      success: true,
      data: {
        messages,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit)
        },
        stats: formattedStats
      }
    })

  } catch (error) {
    console.error('Messages GET error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch messages' }, { status: 500 })
  }
}

// ═══════════════════════════════════════════════════════════════
// PUT - Update message (mark as read, reply, etc.)
// ═══════════════════════════════════════════════════════════════

export async function PUT(request) {
  const auth = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
  if (auth.error) return auth.error

  try {
    const body = await request.json()
    const { id } = body

    if (!id) {
      return NextResponse.json({ success: false, error: 'Message ID is required' }, { status: 400 })
    }

    // Check if message exists
    const existing = await prisma.message.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Message not found' }, { status: 404 })
    }

    // Update data
    const updateData = {}
    
    if (body.status !== undefined) {
      updateData.status = body.status
      
      // Auto-set repliedAt when status is REPLIED
      if (body.status === 'REPLIED' && body.reply) {
        updateData.repliedAt = new Date()
      }
    }
    
    if (body.reply !== undefined) {
      updateData.reply = body.reply
    }

    const message = await prisma.message.update({
      where: { id },
      data: updateData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    })

    // TODO: If replied, send email to customer

    return NextResponse.json({
      success: true,
      message: 'Message updated successfully',
      data: message
    })

  } catch (error) {
    console.error('Message PUT error:', error)
    return NextResponse.json({ success: false, error: 'Failed to update message' }, { status: 500 })
  }
}

// ═══════════════════════════════════════════════════════════════
// DELETE - Delete message (Super Admin only)
// ═══════════════════════════════════════════════════════════════

export async function DELETE(request) {
  const auth = await requireAuth(request, ['SUPER_ADMIN'])
  if (auth.error) return auth.error

  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ success: false, error: 'Message ID is required' }, { status: 400 })
    }

    // Check if message exists
    const existing = await prisma.message.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json({ success: false, error: 'Message not found' }, { status: 404 })
    }

    await prisma.message.delete({ where: { id } })

    return NextResponse.json({
      success: true,
      message: 'Message deleted successfully'
    })

  } catch (error) {
    console.error('Message DELETE error:', error)
    return NextResponse.json({ success: false, error: 'Failed to delete message' }, { status: 500 })
  }
}
