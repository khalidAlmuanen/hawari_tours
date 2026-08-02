// ═══════════════════════════════════════════════════════════════
// 📤 UPLOAD API - Cloudinary Cloud Storage
// رفع الصور إلى Cloudinary (يعمل على Vercel وأي hosting سحابي)
// ═══════════════════════════════════════════════════════════════

import { NextResponse } from 'next/server'
import { requireAuth } from '@/lib/apiAuth'
import { createClient } from '@supabase/supabase-js'

function getSupabaseClient() {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
    if (!supabaseUrl || !supabaseServiceKey) return null
    return createClient(supabaseUrl, supabaseServiceKey, {
        auth: { persistSession: false },
    })
}

async function uploadToSupabase(buffer, filename, contentType) {
    const client = getSupabaseClient()
    if (!client) {
        throw new Error('Supabase not configured')
    }
    const safeName = filename.replace(/[^a-zA-Z0-9.-]/g, '_')
    const uniqueName = `${Date.now()}_${safeName}`
    const bucket = process.env.SUPABASE_STORAGE_BUCKET || 'uploads'
    const path = `uploads/${uniqueName}`
    const { error } = await client.storage
        .from(bucket)
        .upload(path, buffer, { contentType, upsert: false })
    if (error) throw error
    const { data } = client.storage.from(bucket).getPublicUrl(path)
    return { secure_url: data.publicUrl, public_id: path, bucket }
}

// ─── Fallback: Local Upload (for development without Cloudinary) ─
async function uploadLocally(buffer, filename) {
    const { writeFile, mkdir } = await import('fs/promises')
    const path = await import('path')
    const safeName = filename.replace(/[^a-zA-Z0-9.-]/g, '_')
    const uniqueName = `${Date.now()}_${safeName}`
    const uploadDir = path.default.join(process.cwd(), 'public', 'uploads')
    try {
        await mkdir(uploadDir, { recursive: true })
    } catch (e) {
        // Ignore if already exists
    }
    const filePath = path.default.join(uploadDir, uniqueName)
    await writeFile(filePath, buffer)
    return { secure_url: `/uploads/${uniqueName}`, public_id: uniqueName }
}

// ─── POST Handler ────────────────────────────────────────────────
export async function POST(request) {
    // 1. Auth check
    const auth = await requireAuth(request, ['ADMIN', 'SUPER_ADMIN'])
    if (auth.error) return auth.error

    try {
        // 2. Parse form data
        let formData
        try {
            formData = await request.formData()
        } catch (e) {
            console.error('❌ [Upload] Failed to parse formData:', e)
            return NextResponse.json(
                { success: false, error: `Invalid upload request: ${e.message}` },
                { status: 400 }
            )
        }

        const file = formData.get('file')
        if (!file) {
            return NextResponse.json(
                { success: false, error: 'No file received' },
                { status: 400 }
            )
        }

        // 3. Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/avif', 'image/svg+xml']
        if (file.type && !allowedTypes.includes(file.type)) {
            return NextResponse.json(
                { success: false, error: `File type not allowed: ${file.type}` },
                { status: 400 }
            )
        }

        // 4. Validate file size (max 10MB)
        const maxSize = 10 * 1024 * 1024
        if (file.size > maxSize) {
            return NextResponse.json(
                { success: false, error: 'File size exceeds 10MB limit' },
                { status: 400 }
            )
        }

        const buffer = Buffer.from(await file.arrayBuffer())
        const originalName = file.name || 'image.jpg'
        const contentType = file.type || 'application/octet-stream'

        let result
        let storage = 'local'

        // 5. Upload to Supabase if configured, else fallback to local
        const hasSupabase = !!getSupabaseClient()

        if (hasSupabase) {
            console.log('🗄️ [Upload] Uploading to Supabase Storage...')
            result = await uploadToSupabase(buffer, originalName, contentType)
            console.log('✅ [Upload] Supabase upload success:', result.secure_url)
            storage = 'supabase'
        } else {
            if (process.env.NODE_ENV === 'production') {
                return NextResponse.json(
                    {
                        success: false,
                        error: 'Storage not configured. Set Supabase storage env variables.',
                    },
                    { status: 500 }
                )
            }
            console.log('📁 [Upload] Supabase not configured — using local storage (dev mode)')
            result = await uploadLocally(buffer, originalName)
            storage = 'local'
        }

        return NextResponse.json({
            success: true,
            url: result.secure_url,
            publicId: result.public_id,
            storage,
        })

    } catch (error) {
        console.error('❌ [Upload] Error:', error)
        return NextResponse.json(
            {
                success: false,
                error: error.message || 'Upload failed',
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
            },
            { status: 500 }
        )
    }
}
