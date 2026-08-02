
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/apiAuth'

export async function GET(request) {
  const auth = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
  if (auth.error) return auth.error

  try {
    const posts = await prisma.instagramPost.findMany({
      orderBy: { order: 'asc' }
    })

    return NextResponse.json({
      success: true,
      data: { posts }
    })
  } catch (error) {
    console.error('Instagram GET error:', error)
    return NextResponse.json({ success: false, error: 'Failed to fetch instagram posts' }, { status: 500 })
  }
}

export async function POST(request) {
  const auth = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
  if (auth.error) return auth.error

  try {
    const body = await request.json()

    if (!body.imageUrl) {
      return NextResponse.json({ success: false, error: 'Image URL is required' }, { status: 400 })
    }

    const post = await prisma.instagramPost.create({
      data: {
        imageUrl: body.imageUrl,
        postUrl: body.postUrl,
        likes: body.likes || 0,
        comments: body.comments || 0,
        order: body.order || 0,
        isActive: body.isActive !== undefined ? body.isActive : true
      }
    })

    return NextResponse.json({
      success: true,
      message: 'Instagram post added',
      data: post
    })
  } catch (error) {
    console.error('Instagram POST error:', error)
    return NextResponse.json({ success: false, error: 'Failed to add post' }, { status: 500 })
  }
}

export async function PUT(request) {
  const auth = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
  if (auth.error) return auth.error

  try {
    const body = await request.json()
    const { id, ...updateData } = body

    if (!id) {
      return NextResponse.json({ success: false, error: 'Post ID is required' }, { status: 400 })
    }

    const existingPost = await prisma.instagramPost.findUnique({
      where: { id }
    })

    if (!existingPost) {
      return NextResponse.json({ success: false, error: 'Post not found' }, { status: 404 })
    }

    const cleanData = Object.entries(updateData).reduce((acc, [key, value]) => {
      if (value !== undefined) acc[key] = value
      return acc
    }, {})

    const post = await prisma.instagramPost.update({
      where: { id },
      data: cleanData
    })

    return NextResponse.json({
      success: true,
      message: 'Instagram post updated',
      data: post
    })
  } catch (error) {
    console.error('Instagram PUT error:', error)
    return NextResponse.json({ success: false, error: 'Failed to update post' }, { status: 500 })
  }
}

export async function DELETE(request) {
  const auth = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
  if (auth.error) return auth.error

  try {
    const body = await request.json()
    await prisma.instagramPost.delete({
      where: { id: body.id }
    })

    return NextResponse.json({ success: true, message: 'Post deleted' })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete post' }, { status: 500 })
  }
}
