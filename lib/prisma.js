// ═══════════════════════════════════════════════════════════════
// 🗄️ Prisma Client Instance - Serverless-safe Singleton + Retry
// /lib/prisma.js
// ═══════════════════════════════════════════════════════════════

import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis

/**
 * Build a Supabase/PgBouncer-compatible connection URL.
 * - pgbouncer=true → disables prepared statements (fixes error code 26000/42P05)
 *
 * NOTE: Do NOT add connection_limit or pool_timeout here.
 * Those fight with Supabase's own pgbouncer pool and cause P2024
 * when concurrent warm Lambda requests share the same Prisma singleton.
 * Let Supabase's Transaction Pooler (port 6543) manage the pool sizing.
 */
function buildPrismaUrl(base) {
  if (!base) return base
  if (base.includes('pgbouncer=true')) return base
  const separator = base.includes('?') ? '&' : '?'
  return `${base}${separator}pgbouncer=true`
}

const createPrismaClient = () =>
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    datasources: {
      db: {
        url: buildPrismaUrl(process.env.DATABASE_URL),
      },
    },
  })

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
      const isTransient =
        err.message?.includes('connection') ||
        err.message?.includes('timeout') ||
        err.message?.includes('ECONNRESET') ||
        err.message?.includes('prepared statement') ||
        err.code === 'P1001' || // DB unreachable
        err.code === 'P1008' || // Operations timed out
        err.code === 'P2024'    // Pool timeout

      if (isTransient && attempt < retries) {
        console.warn(`[Prisma] Transient error (attempt ${attempt}/${retries}):`, err.message)
        await new Promise((r) => setTimeout(r, delayMs * attempt)) // exponential-ish backoff
        continue
      }
      throw err // re-throw non-transient or final attempt
    }
  }
}

export default prisma