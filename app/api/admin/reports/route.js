import { NextResponse } from 'next/server'
import { Prisma } from '@prisma/client'
import prisma from '@/lib/prisma'
import { requireAuth } from '@/lib/apiAuth'

const hasReportsModels = () =>
  Boolean(
    prisma.reportsPageSetting &&
      prisma.reportCategory &&
      prisma.reportStat &&
      prisma.report &&
      prisma.reportsUnescoSection &&
      prisma.reportsCtaSection
  )

const reportsSettingsFields = [
  'heroBadgeEn',
  'heroBadgeAr',
  'heroTitleLine1En',
  'heroTitleLine1Ar',
  'heroTitleLine2En',
  'heroTitleLine2Ar',
  'heroSubtitleEn',
  'heroSubtitleAr',
  'primaryButtonLabelEn',
  'primaryButtonLabelAr',
  'primaryButtonLink',
  'secondaryButtonLabelEn',
  'secondaryButtonLabelAr',
  'secondaryButtonLink',
  'statsTitleEn',
  'statsTitleAr',
  'statsTitleHighlightEn',
  'statsTitleHighlightAr',
  'featuredBadgeEn',
  'featuredBadgeAr',
  'featuredTitleEn',
  'featuredTitleAr',
  'allReportsTitleEn',
  'allReportsTitleAr',
  'allReportsTitleHighlightEn',
  'allReportsTitleHighlightAr',
  'searchPlaceholderEn',
  'searchPlaceholderAr',
  'noResultsTitleEn',
  'noResultsTitleAr',
  'noResultsTextEn',
  'noResultsTextAr',
  'resetButtonLabelEn',
  'resetButtonLabelAr',
  'downloadLabelEn',
  'downloadLabelAr',
  'reportsCountLabelEn',
  'reportsCountLabelAr'
]

const normalizeReportPayload = (data) => {
  const payload = {
    ...data,
    year: data?.year === undefined || data?.year === '' ? undefined : parseInt(data.year, 10),
    pages: data?.pages === undefined || data?.pages === '' ? undefined : parseInt(data.pages, 10),
    order: data?.order === undefined || data?.order === '' ? undefined : parseInt(data.order, 10),
    featured: data?.featured === undefined ? undefined : Boolean(data.featured),
    isActive: data?.isActive === undefined ? undefined : Boolean(data.isActive),
    topics: Array.isArray(data?.topics)
      ? data.topics.map((topic) => `${topic || ''}`.trim()).filter(Boolean)
      : data?.topics === undefined
        ? undefined
        : []
  }
  return payload
}

const validateReportPayload = (payload) => {
  const required = [
    'titleEn',
    'titleAr',
    'descriptionEn',
    'descriptionAr',
    'year',
    'pages',
    'languageEn',
    'languageAr',
    'fileSize',
    'downloadUrl',
    'categoryId'
  ]
  const missing = required.filter((key) => payload[key] === undefined || payload[key] === '')
  if (Number.isNaN(payload.year)) {
    return { ok: false, message: 'السنة غير صحيحة' }
  }
  if (Number.isNaN(payload.pages)) {
    return { ok: false, message: 'عدد الصفحات غير صحيح' }
  }
  if (missing.length) {
    return { ok: false, message: `الحقول المطلوبة ناقصة: ${missing.join(', ')}` }
  }
  if (!Array.isArray(payload.topics)) {
    return { ok: false, message: 'المواضيع غير صحيحة' }
  }
  return { ok: true }
}

const getSettingsRaw = async () => {
  const rows = await prisma.$queryRaw`SELECT * FROM "reports_page_settings" LIMIT 1`
  return rows?.[0] || {}
}

const ensureReportsTables = async () => {
  await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "report_categories" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT '📄',
    "gradient" TEXT NOT NULL DEFAULT 'from-gray-500 to-gray-700',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "report_categories_pkey" PRIMARY KEY ("id")
  )`)

  await prisma.$executeRawUnsafe(
    'CREATE UNIQUE INDEX IF NOT EXISTS "report_categories_slug_key" ON "report_categories"("slug")'
  )
  await prisma.$executeRawUnsafe(
    'CREATE INDEX IF NOT EXISTS "report_categories_order_idx" ON "report_categories"("order")'
  )
  await prisma.$executeRawUnsafe(
    'CREATE INDEX IF NOT EXISTS "report_categories_isActive_idx" ON "report_categories"("isActive")'
  )

  await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "reports" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleAr" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "descriptionAr" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "pages" INTEGER NOT NULL,
    "languageEn" TEXT NOT NULL,
    "languageAr" TEXT NOT NULL,
    "fileSize" TEXT NOT NULL,
    "downloadUrl" TEXT NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "topics" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
  )`)

  await prisma.$executeRawUnsafe(
    'CREATE INDEX IF NOT EXISTS "reports_categoryId_idx" ON "reports"("categoryId")'
  )
  await prisma.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "reports_featured_idx" ON "reports"("featured")')
  await prisma.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "reports_order_idx" ON "reports"("order")')
  await prisma.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "reports_isActive_idx" ON "reports"("isActive")')
  await prisma.$executeRawUnsafe(`
    DO $$ BEGIN
      IF NOT EXISTS (SELECT 1 FROM pg_constraint WHERE conname = 'reports_categoryId_fkey') THEN
        ALTER TABLE "reports"
        ADD CONSTRAINT "reports_categoryId_fkey"
        FOREIGN KEY ("categoryId") REFERENCES "report_categories"("id")
        ON DELETE CASCADE ON UPDATE CASCADE;
      END IF;
    END $$;
  `)

  await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "report_stats" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "labelEn" TEXT NOT NULL,
    "labelAr" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "gradient" TEXT NOT NULL DEFAULT 'from-blue-500 to-indigo-600',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "report_stats_pkey" PRIMARY KEY ("id")
  )`)

  await prisma.$executeRawUnsafe('CREATE INDEX IF NOT EXISTS "report_stats_order_idx" ON "report_stats"("order")')
  await prisma.$executeRawUnsafe(
    'CREATE INDEX IF NOT EXISTS "report_stats_isActive_idx" ON "report_stats"("isActive")'
  )

  await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "reports_page_settings" (
    "id" TEXT NOT NULL,
    "heroBadgeEn" TEXT NOT NULL DEFAULT 'Reports Library',
    "heroBadgeAr" TEXT NOT NULL DEFAULT 'مكتبة التقارير',
    "heroTitleLine1En" TEXT NOT NULL DEFAULT 'Socotra',
    "heroTitleLine1Ar" TEXT NOT NULL DEFAULT 'تقارير',
    "heroTitleLine2En" TEXT NOT NULL DEFAULT 'Reports',
    "heroTitleLine2Ar" TEXT NOT NULL DEFAULT 'سقطرى',
    "heroSubtitleEn" TEXT,
    "heroSubtitleAr" TEXT,
    "primaryButtonLabelEn" TEXT NOT NULL DEFAULT 'Browse Reports',
    "primaryButtonLabelAr" TEXT NOT NULL DEFAULT 'تصفح التقارير',
    "primaryButtonLink" TEXT NOT NULL DEFAULT '#reports',
    "secondaryButtonLabelEn" TEXT NOT NULL DEFAULT 'Statistics',
    "secondaryButtonLabelAr" TEXT NOT NULL DEFAULT 'الإحصائيات',
    "secondaryButtonLink" TEXT NOT NULL DEFAULT '#statistics',
    "statsTitleEn" TEXT NOT NULL DEFAULT 'Key',
    "statsTitleAr" TEXT NOT NULL DEFAULT 'إحصائيات',
    "statsTitleHighlightEn" TEXT NOT NULL DEFAULT 'Statistics',
    "statsTitleHighlightAr" TEXT NOT NULL DEFAULT 'رئيسية',
    "featuredBadgeEn" TEXT NOT NULL DEFAULT 'Featured Reports',
    "featuredBadgeAr" TEXT NOT NULL DEFAULT 'تقارير مميزة',
    "featuredTitleEn" TEXT NOT NULL DEFAULT 'Most Important Reports',
    "featuredTitleAr" TEXT NOT NULL DEFAULT 'أهم التقارير',
    "allReportsTitleEn" TEXT NOT NULL DEFAULT 'All',
    "allReportsTitleAr" TEXT NOT NULL DEFAULT 'جميع',
    "allReportsTitleHighlightEn" TEXT NOT NULL DEFAULT 'Reports',
    "allReportsTitleHighlightAr" TEXT NOT NULL DEFAULT 'التقارير',
    "searchPlaceholderEn" TEXT NOT NULL DEFAULT 'Search for a report...',
    "searchPlaceholderAr" TEXT NOT NULL DEFAULT 'ابحث عن تقرير...',
    "noResultsTitleEn" TEXT NOT NULL DEFAULT 'No Results Found',
    "noResultsTitleAr" TEXT NOT NULL DEFAULT 'لا توجد نتائج',
    "noResultsTextEn" TEXT NOT NULL DEFAULT 'Try searching with different keywords',
    "noResultsTextAr" TEXT NOT NULL DEFAULT 'جرب البحث بكلمات مختلفة',
    "resetButtonLabelEn" TEXT NOT NULL DEFAULT 'Reset',
    "resetButtonLabelAr" TEXT NOT NULL DEFAULT 'إعادة تعيين',
    "downloadLabelEn" TEXT NOT NULL DEFAULT 'Download',
    "downloadLabelAr" TEXT NOT NULL DEFAULT 'تحميل',
    "reportsCountLabelEn" TEXT NOT NULL DEFAULT 'reports available',
    "reportsCountLabelAr" TEXT NOT NULL DEFAULT 'تقرير متاح',
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "reports_page_settings_pkey" PRIMARY KEY ("id")
  )`)

  await prisma.$executeRawUnsafe(
    'ALTER TABLE "reports_page_settings" ADD COLUMN IF NOT EXISTS "downloadLabelEn" TEXT NOT NULL DEFAULT \'Download\''
  )
  await prisma.$executeRawUnsafe(
    'ALTER TABLE "reports_page_settings" ADD COLUMN IF NOT EXISTS "downloadLabelAr" TEXT NOT NULL DEFAULT \'تحميل\''
  )
  await prisma.$executeRawUnsafe(
    'ALTER TABLE "reports_page_settings" ADD COLUMN IF NOT EXISTS "reportsCountLabelEn" TEXT NOT NULL DEFAULT \'reports available\''
  )
  await prisma.$executeRawUnsafe(
    'ALTER TABLE "reports_page_settings" ADD COLUMN IF NOT EXISTS "reportsCountLabelAr" TEXT NOT NULL DEFAULT \'تقرير متاح\''
  )

  await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "reports_unesco_section" (
    "id" TEXT NOT NULL,
    "badgeEn" TEXT NOT NULL DEFAULT 'UNESCO World Heritage Site',
    "badgeAr" TEXT NOT NULL DEFAULT 'موقع تراث عالمي',
    "titleLine1En" TEXT NOT NULL DEFAULT 'Socotra - World',
    "titleLine1Ar" TEXT NOT NULL DEFAULT 'سقطرى - تراث',
    "titleLine2En" TEXT NOT NULL DEFAULT 'Heritage',
    "titleLine2Ar" TEXT NOT NULL DEFAULT 'عالمي',
    "descriptionEn" TEXT,
    "descriptionAr" TEXT,
    "bulletsEn" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "bulletsAr" TEXT[] NOT NULL DEFAULT ARRAY[]::TEXT[],
    "buttonLabelEn" TEXT NOT NULL DEFAULT 'Official UNESCO Page',
    "buttonLabelAr" TEXT NOT NULL DEFAULT 'موقع اليونسكو الرسمي',
    "buttonLink" TEXT NOT NULL DEFAULT 'https://whc.unesco.org/en/list/1263',
    "imageUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "reports_unesco_section_pkey" PRIMARY KEY ("id")
  )`)

  await prisma.$executeRawUnsafe(`CREATE TABLE IF NOT EXISTS "reports_cta_section" (
    "id" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL DEFAULT 'Have a Question?',
    "titleAr" TEXT NOT NULL DEFAULT 'هل لديك سؤال؟',
    "subtitleEn" TEXT,
    "subtitleAr" TEXT,
    "primaryButtonLabelEn" TEXT NOT NULL DEFAULT 'Contact Us',
    "primaryButtonLabelAr" TEXT NOT NULL DEFAULT 'تواصل معنا',
    "primaryButtonLink" TEXT NOT NULL DEFAULT '/contact',
    "secondaryButtonLabelEn" TEXT NOT NULL DEFAULT 'More About Socotra',
    "secondaryButtonLabelAr" TEXT NOT NULL DEFAULT 'المزيد عن سقطرى',
    "secondaryButtonLink" TEXT NOT NULL DEFAULT '/about',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "reports_cta_section_pkey" PRIMARY KEY ("id")
  )`)
}

const upsertSettingsRaw = async (data) => {
  const payload = Object.fromEntries(
    Object.entries(data || {}).filter(
      ([key, value]) => reportsSettingsFields.includes(key) && value !== undefined && value !== null
    )
  )

  if (Object.keys(payload).length === 0) {
    return getSettingsRaw()
  }

  const existing = await prisma.$queryRaw`SELECT id FROM "reports_page_settings" LIMIT 1`
  const keys = Object.keys(payload)
  const values = Object.values(payload)

  if (existing?.length) {
    const setClause = Prisma.join(
      keys.map((key, index) => Prisma.sql`${Prisma.raw(`"${key}"`)} = ${values[index]}`),
      Prisma.sql`, `
    )
    await prisma.$executeRaw(Prisma.sql`UPDATE "reports_page_settings" SET ${setClause} WHERE id = ${existing[0].id}`)
  } else {
    const columnList = Prisma.join(keys.map((key) => Prisma.raw(`"${key}"`)), Prisma.sql`, `)
    const valueList = Prisma.join(values.map((value) => Prisma.sql`${value}`), Prisma.sql`, `)
    await prisma.$executeRaw(
      Prisma.sql`INSERT INTO "reports_page_settings" (${columnList}) VALUES (${valueList})`
    )
  }

  return getSettingsRaw()
}

const fetchAll = async () => {
  if (!hasReportsModels()) {
    return {
      settings: await getSettingsRaw(),
      categories: [],
      stats: [],
      reports: [],
      unesco: {},
      cta: {}
    }
  }

  const [settings, categories, stats, reports, unesco, cta] = await Promise.all([
    prisma.reportsPageSetting.findFirst(),
    prisma.reportCategory.findMany({ orderBy: { order: 'asc' } }),
    prisma.reportStat.findMany({ orderBy: { order: 'asc' } }),
    prisma.report.findMany({ orderBy: { order: 'asc' }, include: { category: true } }),
    prisma.reportsUnescoSection.findFirst(),
    prisma.reportsCtaSection.findFirst()
  ])

  return {
    settings: settings || {},
    categories,
    stats,
    reports,
    unesco: unesco || {},
    cta: cta || {}
  }
}

export async function GET(request) {
  const auth = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
  if (auth.error) return auth.error

  try {
    await ensureReportsTables()
    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')

    if (type === 'settings') {
      if (!hasReportsModels()) {
        const settings = await getSettingsRaw()
        return NextResponse.json({ success: true, data: settings || {} })
      }
      const settings = await prisma.reportsPageSetting.findFirst()
      return NextResponse.json({ success: true, data: settings || {} })
    }
    if (!hasReportsModels()) {
      return NextResponse.json(
        { success: false, error: 'Prisma client out of date. Run "npx prisma generate" and restart the server.' },
        { status: 500 }
      )
    }
    if (type === 'categories') {
      const categories = await prisma.reportCategory.findMany({ orderBy: { order: 'asc' } })
      return NextResponse.json({ success: true, data: categories })
    }
    if (type === 'stats') {
      const stats = await prisma.reportStat.findMany({ orderBy: { order: 'asc' } })
      return NextResponse.json({ success: true, data: stats })
    }
    if (type === 'reports') {
      const reports = await prisma.report.findMany({ orderBy: { order: 'asc' }, include: { category: true } })
      return NextResponse.json({ success: true, data: reports })
    }
    if (type === 'unesco') {
      const unesco = await prisma.reportsUnescoSection.findFirst()
      return NextResponse.json({ success: true, data: unesco || {} })
    }
    if (type === 'cta') {
      const cta = await prisma.reportsCtaSection.findFirst()
      return NextResponse.json({ success: true, data: cta || {} })
    }

    const data = await fetchAll()
    return NextResponse.json({ success: true, data })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch reports data' }, { status: 500 })
  }
}

export async function POST(request) {
  const auth = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
  if (auth.error) return auth.error

  try {
    await ensureReportsTables()
    const body = await request.json()
    const { type, data } = body
    const { id: _id, createdAt, updatedAt, ...cleanData } = data || {}
    const normalizedData = Object.fromEntries(
      Object.entries(cleanData).filter(([, value]) => value !== undefined && value !== null)
    )

    if (type === 'categories') {
      if (!hasReportsModels()) {
        return NextResponse.json(
          { success: false, error: 'Prisma client out of date. Run "npx prisma generate" and restart the server.' },
          { status: 500 }
        )
      }
      const maxOrder = await prisma.reportCategory.aggregate({ _max: { order: true } })
      await prisma.reportCategory.create({ data: { ...normalizedData, order: (maxOrder._max.order || 0) + 1 } })
    } else if (type === 'stats') {
      if (!hasReportsModels()) {
        return NextResponse.json(
          { success: false, error: 'Prisma client out of date. Run "npx prisma generate" and restart the server.' },
          { status: 500 }
        )
      }
      const maxOrder = await prisma.reportStat.aggregate({ _max: { order: true } })
      await prisma.reportStat.create({ data: { ...normalizedData, order: (maxOrder._max.order || 0) + 1 } })
    } else if (type === 'reports') {
      if (!hasReportsModels()) {
        return NextResponse.json(
          { success: false, error: 'Prisma client out of date. Run "npx prisma generate" and restart the server.' },
          { status: 500 }
        )
      }
      const reportPayload = normalizeReportPayload(normalizedData)
      if (!Array.isArray(reportPayload.topics)) reportPayload.topics = []
      const validation = validateReportPayload(reportPayload)
      if (!validation.ok) {
        return NextResponse.json({ success: false, error: validation.message }, { status: 400 })
      }
      const categoryExists = await prisma.reportCategory.findUnique({ where: { id: reportPayload.categoryId } })
      if (!categoryExists) {
        return NextResponse.json(
          { success: false, error: 'التصنيف غير موجود. يرجى إنشاء تصنيف أولاً.' },
          { status: 400 }
        )
      }
      const maxOrder = await prisma.report.aggregate({ _max: { order: true } })
      await prisma.report.create({
        data: { ...reportPayload, order: (maxOrder._max.order || 0) + 1 }
      })
    } else if (type === 'settings') {
      if (!hasReportsModels()) {
        const settings = await upsertSettingsRaw(normalizedData)
        const refreshed = await fetchAll()
        return NextResponse.json({ success: true, data: { ...refreshed, settings } })
      }
      const existing = await prisma.reportsPageSetting.findFirst()
      if (existing) {
        await prisma.reportsPageSetting.update({ where: { id: existing.id }, data: normalizedData })
      } else {
        await prisma.reportsPageSetting.create({ data: normalizedData })
      }
    } else if (type === 'unesco') {
      if (!hasReportsModels()) {
        return NextResponse.json(
          { success: false, error: 'Prisma client out of date. Run "npx prisma generate" and restart the server.' },
          { status: 500 }
        )
      }
      const existing = await prisma.reportsUnescoSection.findFirst()
      if (existing) {
        await prisma.reportsUnescoSection.update({ where: { id: existing.id }, data: normalizedData })
      } else {
        await prisma.reportsUnescoSection.create({ data: normalizedData })
      }
    } else if (type === 'cta') {
      if (!hasReportsModels()) {
        return NextResponse.json(
          { success: false, error: 'Prisma client out of date. Run "npx prisma generate" and restart the server.' },
          { status: 500 }
        )
      }
      const existing = await prisma.reportsCtaSection.findFirst()
      if (existing) {
        await prisma.reportsCtaSection.update({ where: { id: existing.id }, data: normalizedData })
      } else {
        await prisma.reportsCtaSection.create({ data: normalizedData })
      }
    } else {
      return NextResponse.json({ success: false, error: 'Invalid type' }, { status: 400 })
    }

    const refreshed = await fetchAll()
    return NextResponse.json({ success: true, data: refreshed })
  } catch (error) {
    console.error('Reports POST error:', error)
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to create reports data' },
      { status: 500 }
    )
  }
}

export async function PUT(request) {
  const auth = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
  if (auth.error) return auth.error

  try {
    await ensureReportsTables()
    const body = await request.json()
    const { type, id, data } = body

    const { id: _id, createdAt, updatedAt, ...cleanData } = data || {}

    if (type === 'categories') {
      if (!hasReportsModels()) {
        return NextResponse.json(
          { success: false, error: 'Prisma client out of date. Run "npx prisma generate" and restart the server.' },
          { status: 500 }
        )
      }
      const payload = {
        ...cleanData,
        order: cleanData.order === undefined ? undefined : parseInt(cleanData.order, 10),
        isActive: cleanData.isActive === undefined ? undefined : Boolean(cleanData.isActive)
      }
      Object.keys(payload).forEach((key) => (payload[key] === undefined || payload[key] === null) && delete payload[key])
      await prisma.reportCategory.update({ where: { id }, data: payload })
    } else if (type === 'stats') {
      if (!hasReportsModels()) {
        return NextResponse.json(
          { success: false, error: 'Prisma client out of date. Run "npx prisma generate" and restart the server.' },
          { status: 500 }
        )
      }
      const payload = {
        ...cleanData,
        order: cleanData.order === undefined ? undefined : parseInt(cleanData.order, 10),
        isActive: cleanData.isActive === undefined ? undefined : Boolean(cleanData.isActive)
      }
      Object.keys(payload).forEach((key) => (payload[key] === undefined || payload[key] === null) && delete payload[key])
      await prisma.reportStat.update({ where: { id }, data: payload })
    } else if (type === 'reports') {
      if (!hasReportsModels()) {
        return NextResponse.json(
          { success: false, error: 'Prisma client out of date. Run "npx prisma generate" and restart the server.' },
          { status: 500 }
        )
      }
      const payload = normalizeReportPayload(cleanData)
      if (payload.year !== undefined && Number.isNaN(payload.year)) {
        return NextResponse.json({ success: false, error: 'السنة غير صحيحة' }, { status: 400 })
      }
      if (payload.pages !== undefined && Number.isNaN(payload.pages)) {
        return NextResponse.json({ success: false, error: 'عدد الصفحات غير صحيح' }, { status: 400 })
      }
      if (payload.categoryId) {
        const categoryExists = await prisma.reportCategory.findUnique({ where: { id: payload.categoryId } })
        if (!categoryExists) {
          return NextResponse.json(
            { success: false, error: 'التصنيف غير موجود. يرجى إنشاء تصنيف أولاً.' },
            { status: 400 }
          )
        }
      }
      Object.keys(payload).forEach((key) => (payload[key] === undefined || payload[key] === null) && delete payload[key])
      await prisma.report.update({ where: { id }, data: payload })
    } else if (type === 'settings') {
      if (!hasReportsModels()) {
        const settings = await upsertSettingsRaw(cleanData || {})
        const refreshed = await fetchAll()
        return NextResponse.json({ success: true, data: { ...refreshed, settings } })
      }
      const existing = await prisma.reportsPageSetting.findFirst()
      if (existing) {
        await prisma.reportsPageSetting.update({ where: { id: existing.id }, data: cleanData })
      } else {
        await prisma.reportsPageSetting.create({ data: cleanData })
      }
    } else if (type === 'unesco') {
      if (!hasReportsModels()) {
        return NextResponse.json(
          { success: false, error: 'Prisma client out of date. Run "npx prisma generate" and restart the server.' },
          { status: 500 }
        )
      }
      const existing = await prisma.reportsUnescoSection.findFirst()
      if (existing) {
        await prisma.reportsUnescoSection.update({ where: { id: existing.id }, data: cleanData })
      } else {
        await prisma.reportsUnescoSection.create({ data: cleanData })
      }
    } else if (type === 'cta') {
      if (!hasReportsModels()) {
        return NextResponse.json(
          { success: false, error: 'Prisma client out of date. Run "npx prisma generate" and restart the server.' },
          { status: 500 }
        )
      }
      const existing = await prisma.reportsCtaSection.findFirst()
      if (existing) {
        await prisma.reportsCtaSection.update({ where: { id: existing.id }, data: cleanData })
      } else {
        await prisma.reportsCtaSection.create({ data: cleanData })
      }
    } else {
      return NextResponse.json({ success: false, error: 'Invalid type' }, { status: 400 })
    }

    const refreshed = await fetchAll()
    return NextResponse.json({ success: true, data: refreshed })
  } catch (error) {
    console.error('Reports PUT error:', error)
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update reports data' },
      { status: 500 }
    )
  }
}

export async function DELETE(request) {
  const auth = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
  if (auth.error) return auth.error

  try {
    await ensureReportsTables()
    const body = await request.json()
    const { type, id } = body

    if (type === 'categories') {
      if (!hasReportsModels()) {
        return NextResponse.json(
          { success: false, error: 'Prisma client out of date. Run "npx prisma generate" and restart the server.' },
          { status: 500 }
        )
      }
      await prisma.reportCategory.delete({ where: { id } })
    } else if (type === 'stats') {
      if (!hasReportsModels()) {
        return NextResponse.json(
          { success: false, error: 'Prisma client out of date. Run "npx prisma generate" and restart the server.' },
          { status: 500 }
        )
      }
      await prisma.reportStat.delete({ where: { id } })
    } else if (type === 'reports') {
      if (!hasReportsModels()) {
        return NextResponse.json(
          { success: false, error: 'Prisma client out of date. Run "npx prisma generate" and restart the server.' },
          { status: 500 }
        )
      }
      await prisma.report.delete({ where: { id } })
    } else {
      return NextResponse.json({ success: false, error: 'Invalid type' }, { status: 400 })
    }

    const refreshed = await fetchAll()
    return NextResponse.json({ success: true, data: refreshed })
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete reports data' }, { status: 500 })
  }
}
