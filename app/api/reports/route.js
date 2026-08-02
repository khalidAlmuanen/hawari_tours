import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  try {
    const [settings, categories, stats, reports, unesco, cta] = await Promise.all([
      prisma.reportsPageSetting.findFirst(),
      prisma.reportCategory.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } }),
      prisma.reportStat.findMany({ where: { isActive: true }, orderBy: { order: 'asc' } }),
      prisma.report.findMany({
        where: { isActive: true },
        orderBy: { order: 'asc' },
        include: { category: true }
      }),
      prisma.reportsUnescoSection.findFirst({ where: { isActive: true } }),
      prisma.reportsCtaSection.findFirst({ where: { isActive: true } })
    ])

    const data = {
      settings: settings || {},
      categories,
      stats,
      reports,
      unesco: unesco || {},
      cta: cta || {}
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch reports data' }, { status: 500 })
  }
}
