import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
    const diagnostics = {
        timestamp: new Date().toISOString(),
        prisma: {
            available: 'yes',
            clientVersion: null
        },
        database: {
            connected: false,
            error: null
        },
        tables: {
            blogs: false,
            error: null
        }
    }

    try {
        // Test Prisma Client
        diagnostics.prisma.clientVersion = prisma._engineConfig?.clientVersion || 'unknown'

        // Test database connection
        await prisma.$connect()
        diagnostics.database.connected = true

        // Test blogs table
        const count = await prisma.blog.count()
        diagnostics.tables.blogs = true
        diagnostics.tables.blogCount = count

    } catch (error) {
        diagnostics.database.error = error.message
        diagnostics.errorStack = error.stack
    } finally {
        await prisma.$disconnect()
    }

    return NextResponse.json(diagnostics, { status: 200 })
}
