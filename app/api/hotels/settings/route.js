import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { requireAuth } from '@/lib/apiAuth'

export async function GET() {
  try {
    let settings = await prisma.hotelsPageSetting.findFirst()
    if (!settings) {
      settings = await prisma.hotelsPageSetting.create({ data: {} })
    }
    return NextResponse.json({ success: true, data: settings })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch settings' }, { status: 500 })
  }
}

export async function POST(request) {
  const auth = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
  if (auth.error) return auth.error

  try {
    const body = await request.json()
    const { id, updatedAt, createdAt, ...dataToSave } = body;

    let settings = await prisma.hotelsPageSetting.findFirst()
    if (settings) {
      settings = await prisma.hotelsPageSetting.update({
        where: { id: settings.id },
        data: dataToSave
      })
    } else {
      settings = await prisma.hotelsPageSetting.create({ data: dataToSave })
    }
    return NextResponse.json({ success: true, data: settings })
  } catch (error) {
    console.error('[API ERROR] /api/hotels/settings:', error)
    return NextResponse.json({ success: false, error: 'Failed to update settings' }, { status: 500 })
  }
}
