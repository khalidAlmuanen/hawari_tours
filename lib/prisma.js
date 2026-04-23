// ═══════════════════════════════════════════════════════════════
// 🗄️ Prisma Client Instance - Serverless-safe Singleton + Retry
// /lib/prisma.js
// ═══════════════════════════════════════════════════════════════

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis

// ───────────────────────────────────────────────────────────────
// Resolve the best available connection URL.
// Priority:
//   1) POSTGRES_PRISMA_URL   → provided by Vercel ↔ Supabase integration
//                              (already tuned for PgBouncer + Prisma)
//   2) DATABASE_URL          → classic manual configuration
//   3) POSTGRES_URL          → generic pooled URL
// ───────────────────────────────────────────────────────────────
function resolveDatabaseUrl() {
  return (
    process.env.POSTGRES_PRISMA_URL ||
    process.env.DATABASE_URL ||
    process.env.POSTGRES_URL ||
    ''
  )
}

/**
 * Ensure the URL is PgBouncer-safe for Prisma.
 * - pgbouncer=true → disables prepared statements (fixes error 26000/42P05)
 * - connection_limit=1 is avoided on purpose: let Supabase's
 *   Transaction Pooler (port 6543) manage pool sizing. Setting it
 *   explicitly causes P2024 on warm Lambdas.
 */
function buildPrismaUrl(base) {
  if (!base) return base
  if (base.includes('pgbouncer=true')) return base
  const separator = base.includes('?') ? '&' : '?'
  return `${base}${separator}pgbouncer=true`
}

const createPrismaClient = () => {
  const url = buildPrismaUrl(resolveDatabaseUrl())

  if (!url) {
    // Surface the root cause clearly in server logs.
    console.error(
      '[Prisma] FATAL: No database URL found in environment. ' +
      'Expected one of: POSTGRES_PRISMA_URL, DATABASE_URL, POSTGRES_URL. ' +
      'If you are on Vercel, make sure the Supabase integration is connected.'
    )
  }

  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    datasources: {
      db: { url },
    },
  })
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()

// Cache in ALL environments to prevent connection exhaustion on warm Lambdas
globalForPrisma.prisma = prisma

// ═══════════════════════════════════════════════════════════════
// 🔁 withRetry — Retry any Prisma operation on transient errors
// Usage: await withRetry(() => prisma.user.findMany())
// ═══════════════════════════════════════════════════════════════
export async function withRetry(fn, retries = 3, delayMs = 300) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      return await fn()
    } catch (err) {
      const msg = err?.message || ''
      const isTransient =
        msg.includes('connection') ||
        msg.includes('timeout') ||
        msg.includes('ECONNRESET') ||
        msg.includes('prepared statement') ||
        msg.includes('Tenant or user not found') ||
        err?.code === 'P1001' || // DB unreachable
        err?.code === 'P1008' || // Operations timed out
        err?.code === 'P1017' || // Server closed the connection
        err?.code === 'P2024'    // Pool timeout

      if (isTransient && attempt < retries) {
        console.warn(`[Prisma] Transient error (attempt ${attempt}/${retries}):`, msg)
        await new Promise((r) => setTimeout(r, delayMs * attempt)) // backoff
        continue
      }
      throw err // re-throw non-transient or final attempt
    }
  }
}

export default prisma
