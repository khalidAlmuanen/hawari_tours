import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Safely expose whether an env var is present (NEVER leaks its value).
function has(name) {
    const v = process.env[name]
    return typeof v === 'string' && v.length > 0
}

// Redact a URL so we can show the host/user without the password.
function redact(url) {
    if (!url) return null
    try {
        const u = new URL(url)
        return `${u.protocol}//${u.username || '(no user)'}:***@${u.host}${u.pathname}${u.search ? '?' + u.searchParams.toString().replace(/(password|pwd)=[^&]*/gi, '$1=***') : ''}`
    } catch {
        return '(unparseable url)'
    }
}

export async function GET() {
    const started = Date.now()

    const envChecks = {
        POSTGRES_PRISMA_URL: has('POSTGRES_PRISMA_URL'),
        POSTGRES_URL_NON_POOLING: has('POSTGRES_URL_NON_POOLING'),
        POSTGRES_URL: has('POSTGRES_URL'),
        DATABASE_URL: has('DATABASE_URL'),
        DIRECT_URL: has('DIRECT_URL'),
        SUPABASE_URL: has('SUPABASE_URL'),
        NEXT_PUBLIC_SUPABASE_URL: has('NEXT_PUBLIC_SUPABASE_URL'),
        SUPABASE_SERVICE_ROLE_KEY: has('SUPABASE_SERVICE_ROLE_KEY'),
        SUPABASE_ANON_KEY: has('SUPABASE_ANON_KEY'),
    }

    const resolvedUrl =
        process.env.POSTGRES_PRISMA_URL ||
        process.env.DATABASE_URL ||
        process.env.POSTGRES_URL ||
        null

    const diagnostics = {
        ok: false,
        timestamp: new Date().toISOString(),
        environment: process.env.VERCEL_ENV || process.env.NODE_ENV || 'unknown',
        region: process.env.VERCEL_REGION || null,
        env: envChecks,
        connection: {
            resolvedFrom: resolvedUrl
                ? process.env.POSTGRES_PRISMA_URL
                    ? 'POSTGRES_PRISMA_URL'
                    : process.env.DATABASE_URL
                        ? 'DATABASE_URL'
                        : 'POSTGRES_URL'
                : null,
            redactedUrl: redact(resolvedUrl),
        },
        database: {
            connected: false,
            pingMs: null,
            error: null,
        },
        tables: {
            blogs: { ok: false, count: null },
            tours: { ok: false, count: null },
            heroSlides: { ok: false, count: null },
        },
        timings: {
            totalMs: 0,
        },
    }

    try {
        const t0 = Date.now()
        // A single cheap round-trip to prove we can reach Postgres.
        await prisma.$queryRawUnsafe('SELECT 1')
        diagnostics.database.connected = true
        diagnostics.database.pingMs = Date.now() - t0

        // Probe a few core tables in parallel (best-effort).
        const [blogs, tours, heroSlides] = await Promise.allSettled([
            prisma.blog.count(),
            prisma.tour.count(),
            prisma.heroSlide.count(),
        ])

        if (blogs.status === 'fulfilled') {
            diagnostics.tables.blogs = { ok: true, count: blogs.value }
        } else {
            diagnostics.tables.blogs = { ok: false, error: blogs.reason?.message }
        }
        if (tours.status === 'fulfilled') {
            diagnostics.tables.tours = { ok: true, count: tours.value }
        } else {
            diagnostics.tables.tours = { ok: false, error: tours.reason?.message }
        }
        if (heroSlides.status === 'fulfilled') {
            diagnostics.tables.heroSlides = { ok: true, count: heroSlides.value }
        } else {
            diagnostics.tables.heroSlides = {
                ok: false,
                error: heroSlides.reason?.message,
            }
        }

        diagnostics.ok = diagnostics.database.connected
    } catch (error) {
        diagnostics.database.error = error?.message || String(error)
        diagnostics.database.code = error?.code || null
    } finally {
        diagnostics.timings.totalMs = Date.now() - started
    }

    // Return 200 even on failure so the dashboard can read the details.
    return NextResponse.json(diagnostics, {
        status: 200,
        headers: { 'Cache-Control': 'no-store' },
    })
}
