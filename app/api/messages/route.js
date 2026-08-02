// ═══════════════════════════════════════════════════════════════
// 📧 Messages API - Contact Form Submissions
// /app/api/messages/route.js
// ✅ Public: إنشاء رسالة من صفحة Contact
// ═══════════════════════════════════════════════════════════════

import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// ═══════════════════════════════════════════════════════════════
// POST - Create new message (Public - No Auth Required)
// ═══════════════════════════════════════════════════════════════

export async function POST(request) {
  try {
    const body = await request.json()

    console.log('📧 [API] Creating new message:', body)

    // Validation
    const required = ['name', 'email', 'subject', 'message']
    for (const field of required) {
      if (!body[field]) {
        return NextResponse.json(
          { success: false, error: `Missing required field: ${field}` },
          { status: 400 }
        )
      }
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email address' },
        { status: 400 }
      )
    }

    // Check if user exists (optional link)
    let userId = null
    try {
      const user = await prisma.user.findUnique({
        where: { email: body.email }
      })
      if (user) {
        userId = user.id
      }
    } catch (err) {
      // Ignore - user link is optional
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone || null,
        subject: body.subject,
        message: body.message,
        userId: userId,
        status: 'UNREAD'
      }
    })



    console.log('✅ [API] Message created:', message.id)

    // ✅ Create Notification for Admin
    try {
      if (prisma.notification) {
        await prisma.notification.create({
          data: {
            type: 'MESSAGE',
            title: '📩 رسالة جديدة',
            message: `رسالة جديدة من ${body.name} — الموضوع: ${body.subject}`,
            link: `/admin/messages`,
            messageId: message.id,
            isRead: false
          }
        })
      }
    } catch (notifError) {
      console.error('Failed to create notification:', notifError)
    }
    // TODO: Send auto-reply to customer

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully',
      data: message
    }, { status: 201 })

  } catch (error) {
    console.error('❌ [API] Message creation error:', error)

    return NextResponse.json(
      {
        success: false,
        error: 'Failed to send message',
        details: error.message
      },
      { status: 500 }
    )
  }
}
