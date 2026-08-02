// ═══════════════════════════════════════════════════════════════
// 🌟 UNIQUE FEATURES API - Public Access
// مسار API العام لعرض الميزات الفريدة
// ═══════════════════════════════════════════════════════════════

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

export const dynamic = 'force-dynamic' // Ensure freshness

export async function GET() {
    try {
        // 1. Fetch Page Settings
        const pageSettings = await prisma.uniqueFeaturesPageSetting.findFirst()

        // 2. Fetch All Features
        const features = await prisma.uniqueFeature.findMany({
            where: { isActive: true },
            orderBy: { order: 'asc' }
        })

        // 3. Structure Data for Public Page
        // We need to map the flat list of features into the structured object the page expects.

        // Helper to parse 'facts' array back to object if needed, or just pass as is.
        // The public page expects specific structures for each section.
        // Let's look at `app/unique-features/page.jsx` structure again.

        /* 
           Structure expected by Page:
           - stats: Array (we might need to hardcode or fetch from QuickStat if we didn't migrate them)
           - dragonBloodTrees: Object (Single Feature or List?) -> Page has `const dragonBloodTrees = { ... }` 
             It seems it treats Dragon Blood as a SINGLE special section.
             We need to find the 'FLORA' feature that is 'Dragon Blood Tree'.
           - beaches: Object { title, intro, description, topBeaches: [] }
           - cavesAndMountains: Object { mountains: {}, caves: { famous: [] } }
           - wildlife: { intro, description, animals: [] } - Page has `const wildlife` section.
           
           This is a bit complex alignment. 
           The Admin UI saves them as simple lists of Features with Types.
           The Public Page is heavily designed around specific CONTENT BLOCKS.
           
           STRATEGY:
           - I will map the DB features to these sections.
           - If DB is empty (first run), I should probably return the "Static Fallback" so the site doesn't break?
           - OR, I updated the Admin API to return default structure if empty? 
             No, I replaced JSON reading. DB is empty now.
             
           CRITICAL: The site will be EMPTY until user adds content via Admin.
           However, I should try to map "Types" to these sections.
        */

        // Grouping
        const flora = features.filter(f => f.type === 'FLORA' || f.type === 'GEOLOGICAL')
        const beachesList = features.filter(f => f.type === 'BEACH')
        const cavesList = features.filter(f => f.type === 'CAVE')
        const mountainsList = features.filter(f => f.type === 'MOUNTAIN')
        const wildlifeList = features.filter(f => f.type === 'WILDLIFE')

        // Construct Response
        const data = {
            pageSettings: pageSettings || {},

            // Dragon Blood (Flora) - Keep for backward compat but also return full list
            dragonBloodTrees: flora.find(f => f.nameEn.includes('Dragon')) || flora[0] || null,
            flora: flora, // Return all flora items

            // Beaches
            beaches: {
                // These titles/descriptions come from PageSettings or hardcoded? 
                // The PageSettings has generic SEO/Hero. 
                // Maybe we should allow editing Section Titles in Settings tab? 
                // For now, use the features list.
                items: beachesList
            },

            // Caves & Mountains
            caves: cavesList,
            mountains: mountainsList, // Might need to combine in UI

            // Wildlife
            wildlife: wildlifeList
        }

        return NextResponse.json({ success: true, data })

    } catch (error) {
        console.error('❌ Error fetching public unique features:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch features' },
            { status: 500 }
        )
    }
}
