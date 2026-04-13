// ═══════════════════════════════════════════════════════════════
// 🌟 UNIQUE FEATURES API - Admin Management
// مسار API لإدارة الميزات الفريدة لسقطرى
// ═══════════════════════════════════════════════════════════════

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'

const normalizeList = (value) => {
    if (Array.isArray(value)) return value.map(item => `${item}`.trim()).filter(Boolean)
    if (typeof value === 'string') {
        return value.split(',').map(item => item.trim()).filter(Boolean)
    }
    return []
}
const buildLangList = (enValue, arValue) => {
    const en = normalizeList(enValue)
    const ar = normalizeList(arValue)
    if (!ar.length) return en
    return [...en.map(item => `EN: ${item}`), ...ar.map(item => `AR: ${item}`)]
}

// ═══════════════════════════════════════════════════════════════
// GET - Fetch features and settings
// ═══════════════════════════════════════════════════════════════
export async function GET(request) {
    try {
        const { searchParams } = new URL(request.url)
        const type = searchParams.get('type') // stats / main / beaches / caves / wildlife / settings / all

        // Fetch Settings
        if (type === 'settings') {
            const settings = await prisma.uniqueFeaturesPageSetting.findFirst()
            return NextResponse.json({ success: true, data: settings || {} })
        }

        // Fetch Stats (Mapped from QuickStat with specific type/context if we were strictly following schema, 
        // but UniqueFeature doesn't have a 'STAT' type in enum. 
        // CHECKING SCHEMA: The schema defines FeatureType as FLORA, BEACH, CAVE, MOUNTAIN, WILDLIFE, GEOLOGICAL.
        // It does NOT have 'STAT'. 
        // However, the previous JSON implementation had 'stats'. 
        // Let's check where 'stats' should go. 
        // Looking at schema `QuickStat` model exists (lines 1390). 
        // But `UniqueFeature` is the main focus here.
        // Let's assume 'stats' in this context are specialized QuickStats or just stored in PageSettings if they are simple.
        // The JSON had them as objects. 
        // For now, to keep strict transition, I will map 'stats' to `QuickStat` model OR 
        // if they are page specific, maybe we should add them to `UniqueFeaturesPageSetting` as Json?
        // Checking `BlogSetting` (line 1558) has `stats Json`.
        // Let's check `UniqueFeaturesPageSetting` again. I just added it. 
        // It does NOT have stats.
        // I will add `stats Json` to `UniqueFeaturesPageSetting` in the next step to be safe and consistent with other pages.
        // WAITING: I will assume I can update the schema again or just use `QuickStat` model filtering?
        // `QuickStat` has `isActive`, `order`. It seems global.
        // For this page specifically, let's use `UniqueFeature` for the content.

        // Let's fetch all UniqueFeatures first
        const features = await prisma.uniqueFeature.findMany({
            orderBy: { order: 'asc' }
        })

        // Grouping
        const mainFeatures = features.filter(f => f.featured === true) // Or specific types?
        // The JSON separated them by ID logic or type.
        // JSON had: mainFeatures (mixed types, featured), beaches (type BEACH), caves (type CAVE/MOUNTAIN), wildlife (type WILDLIFE)

        // Let's map strict types from schema:
        // FLORA, BEACH, CAVE, MOUNTAIN, WILDLIFE, GEOLOGICAL

        if (type === 'main') {
            // Admin UI expects 'mainFeatures'. 
            // In DB, these might be defined by `featured: true` or specific selected ones.
            // For now, let's return features that are specifically FLORA or GEOLOGICAL which are usually "Main"
            const data = features.filter(f => ['FLORA', 'GEOLOGICAL'].includes(f.type))
            return NextResponse.json({ success: true, data })
        } else if (type === 'beaches') {
            const data = features.filter(f => f.type === 'BEACH')
            return NextResponse.json({ success: true, data })
        } else if (type === 'caves') {
            const data = features.filter(f => ['CAVE', 'MOUNTAIN'].includes(f.type))
            return NextResponse.json({ success: true, data })
        } else if (type === 'wildlife') {
            const data = features.filter(f => f.type === 'WILDLIFE' || f.type === 'FLORA') // Flora can be wildlife context sometimes? No, strict types.
            const dataStrict = features.filter(f => f.type === 'WILDLIFE')
            return NextResponse.json({ success: true, data: dataStrict })
        }

        // For 'all' or default, return structured object matching frontend expectation
        const structuredData = {
            stats: [], // Placeholder until we fix schema for stats
            mainFeatures: features.filter(f => ['FLORA', 'GEOLOGICAL'].includes(f.type)),
            beaches: features.filter(f => f.type === 'BEACH'),
            caves: features.filter(f => ['CAVE', 'MOUNTAIN'].includes(f.type)),
            wildlife: features.filter(f => f.type === 'WILDLIFE'),
            pageSettings: await prisma.uniqueFeaturesPageSetting.findFirst() || {}
        }

        return NextResponse.json({ success: true, data: structuredData })

    } catch (error) {
        console.error('❌ Error fetching features:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch features' },
            { status: 500 }
        )
    }
}

// ═══════════════════════════════════════════════════════════════
// POST - Create new item
// ═══════════════════════════════════════════════════════════════
// ═══════════════════════════════════════════════════════════════
// POST - Create new item or SEED data
// ═══════════════════════════════════════════════════════════════
export async function POST(request) {
    try {
        const body = await request.json()
        const { type, data } = body // type: 'settings', 'seed', or specific feature type

        // Handle Settings Creation
        if (type === 'settings') {
            const settings = await prisma.uniqueFeaturesPageSetting.create({ data })
            return NextResponse.json({ success: true, data: settings })
        }

        // Handle SEED Request
        if (type === 'seed') {
            // Optional: clear existing data?
            // await prisma.uniqueFeature.deleteMany({}) 
            // await prisma.uniqueFeaturesPageSetting.deleteMany({})

            // 1. Settings
            await prisma.uniqueFeaturesPageSetting.upsert({
                where: { id: 'default-settings' }, // specific ID to act as singleton if possible, or findFirst logic
                update: {
                    heroTitleEn: 'Unique Features',
                    heroTitleAr: 'ميزات فريدة',
                    heroSubtitleEn: 'Discover the alien-like flora and fauna found nowhere else on Earth. Socotra is a UNESCO World Heritage site for a reason.',
                    heroSubtitleAr: 'اكتشف النباتات والحيوانات النادرة التي لا توجد في أي مكان آخر على الأرض. سقطرى هي موقع تراث عالمي لسبب وجيه.',
                    // heroImage: '/images/hero/unique-features.jpg' 
                },
                create: {
                    heroTitleEn: 'Unique Features',
                    heroTitleAr: 'ميزات فريدة',
                    heroSubtitleEn: 'Discover the alien-like flora and fauna found nowhere else on Earth. Socotra is a UNESCO World Heritage site for a reason.',
                    heroSubtitleAr: 'اكتشف النباتات والحيوانات النادرة التي لا توجد في أي مكان آخر على الأرض. سقطرى هي موقع تراث عالمي لسبب وجيه.',
                }
            })

            // 2. Features Data (from the guide)
            const seedData = [
                {
                    type: 'FLORA',
                    nameEn: "Dragon's Blood Tree",
                    nameAr: "شجرة دم الأخوين",
                    descriptionEn: "The most famous and distinctive plant of the island, known for its unique umbrella shape and red sap used in medicine and dyes. It grows in the high plateaus like Diksam and Homhil.",
                    descriptionAr: "أشهر وأميز نباتات الجزيرة، معروفة بشكلها المظلي الفريد وعصارتها الحمراء المستخدمة في الطب والأصباغ. تنمو في الهضاب المرتفعة مثل دكسم وحومهل.",
                    featured: true,
                    images: ['/uploads/features/dragon-blood.jpg'], // Placeholder
                    conservationStatus: 'Vulnerable',
                    facts: ['Age: 650+ years', 'Habitat: Haggier Mts']
                },
                {
                    type: 'FLORA',
                    nameEn: "Cucumber Tree",
                    nameAr: "شجرة الخيار",
                    descriptionEn: "The only tree in the Cucurbitaceae family (which includes cucumbers and melons). It has a massive, bloated trunk to store water.",
                    descriptionAr: "الشجرة الوحيدة في فصيلة القرعيات (التي تشمل الخيار والبطيخ). تتميز بجذع ضخم وممتلئ لتخزين المياه في المناخ الجاف.",
                    featured: false,
                    images: []
                },
                {
                    type: 'FLORA',
                    nameEn: "Desert Rose (Adenium)",
                    nameAr: "وردة الصحراء (العدنة)",
                    descriptionEn: "Known locally as 'Isfied', this bottle-shaped tree produces beautiful pink flowers and thrives in the rocky terrain.",
                    descriptionAr: "تعرف محلياً باسم \"إسفيد\"، هذه الشجرة ذات الشكل الزجاجي تنتج زهوراً وردية جميلة وتزدهر في التضاريس الصخرية.",
                    featured: false,
                    images: []
                },
                {
                    type: 'BEACH',
                    nameEn: "Detwah Lagoon",
                    nameAr: "محمية ديطوح",
                    descriptionEn: "A breathtaking lagoon with white sands and turquoise waters, famous for its stingrays and diverse marine life.",
                    descriptionAr: "بحيرة خلابة ذات رمال بيضاء ومياه فيروزية، تشتهر بوجود أسماك الراي (اللخمة) والحياة البحرية المتنوعة.",
                    featured: true,
                    activitiesEn: "Swimming, Walking, Photography",
                    activitiesAr: "السباحة، المشي، التصوير",
                    bestTimeEn: "Early morning / Sunset",
                    bestTimeAr: "الصباح الباكر / الغروب",
                    images: []
                },
                {
                    type: 'BEACH',
                    nameEn: "Shoab Beach",
                    nameAr: "شاطئ شوعب",
                    descriptionEn: "Accessible by boat, this pristine white sand beach offers spinner dolphins sightings and crystal clear waters.",
                    descriptionAr: "يمكن الوصول إليه بالقارب، هذا الشاطئ ذو الرمال البيضاء النقية يوفر فرصة مشاهدة الدلافين الدوارة والمياه الصافية كالكريستال.",
                    featured: false,
                    activitiesEn: "Snorkeling, Dolphin watching",
                    activitiesAr: "الغوص السطحي، مشاهدة الدلافين",
                    bestTimeEn: "Morning boat trip",
                    bestTimeAr: "رحلة قارب صباحية",
                    images: []
                },
                {
                    type: 'BEACH',
                    nameEn: "Arher Beach",
                    nameAr: "شاطئ عرعر",
                    descriptionEn: "Famous for its massive white sand dunes that descend from the cliffs directly into the ocean. Freshwater streams flow here.",
                    descriptionAr: "يشتهر بكثبانه الرملية البيضاء الضخمة التي تنحدر من المنحدرات مباشرة إلى المحيط. تتدفق هنا جداول المياه العذبة.",
                    featured: false,
                    images: []
                },
                {
                    type: 'CAVE',
                    nameEn: "Hoq Cave",
                    nameAr: "كهف حوق",
                    descriptionEn: "One of the largest caves on the island, extending 3km deep with mesmerizing stalactites and stalagmites.",
                    descriptionAr: "واحد من أكبر الكهوف في الجزيرة، يمتد بعمق 3 كم مع صواعد وهوابط (ستالاجمايت وستالاجتايت) ساحرة.",
                    featured: true,
                    facts: ["Depth: 3 km", "Difficulty: Moderate hike"], // Using facts for these
                    images: []
                },
                {
                    type: 'WILDLIFE',
                    nameEn: "Socotra Chameleon",
                    nameAr: "حرباء سقطرى",
                    descriptionEn: "An endemic species known for its ability to produce a hissing sound when threatened.",
                    descriptionAr: "نوع مستوطن معروف بقدرته على إصدار صوت هسهسة عند الشعور بالتهديد.",
                    featured: true,
                    facts: ["Category: Reptile"],
                    images: []
                },
                {
                    type: 'WILDLIFE',
                    nameEn: "Socotra Sunbird",
                    nameAr: "تمير سقطرى",
                    descriptionEn: "A loud and active bird endemic to the island.",
                    descriptionAr: "طائر نشيط وصوته عالٍ، مستوطن في الجزيرة.",
                    featured: false,
                    images: []
                }
            ]

            // Insert Features
            for (const item of seedData) {
                // Check if exists by name to avoid duplicates on multiple clicks
                const existing = await prisma.uniqueFeature.findFirst({
                    where: { OR: [{ nameEn: item.nameEn }, { nameAr: item.nameAr }] }
                })

                if (!existing) {
                    await prisma.uniqueFeature.create({
                        data: {
                            type: item.type,
                            nameEn: item.nameEn,
                            nameAr: item.nameAr,
                            descriptionEn: item.descriptionEn,
                            descriptionAr: item.descriptionAr,
                            featured: item.featured,
                            images: item.images,
                            conservationStatus: item.conservationStatus,
                            // Map special fields to facts or respective columns if we had them
                            facts: [
                                ...(item.facts || []),
                                item.activitiesEn ? `Activities: ${item.activitiesEn}` : null,
                                item.bestTimeEn ? `Best Time: ${item.bestTimeEn}` : null
                            ].filter(Boolean)
                        }
                    })
                }
            }

            return NextResponse.json({ success: true, message: 'Data restored successfully' })
        }

        // Mapping Frontend 'type' to DB 'FeatureType'
        let dbType = 'FLORA' // Default
        if (type === 'beach') dbType = 'BEACH'
        else if (type === 'cave') dbType = 'CAVE'
        else if (type === 'wildlife') dbType = 'WILDLIFE'
        else if (type === 'main') dbType = 'FLORA'

        // Prepare data for Prisma
        const featureData = {
            type: dbType,
            nameEn: data.nameEn || data.titleEn || '',
            nameAr: data.nameAr || data.titleAr || '',
            descriptionEn: data.descriptionEn || '',
            descriptionAr: data.descriptionAr || '',
            featured: data.featured || false,
            isActive: typeof data.isActive === 'boolean' ? data.isActive : true,
            images: data.imageUrl ? [data.imageUrl] : [],
            conservationStatus: data.statusEn || data.conservationStatus || '',
            conservationStatusAr: data.statusAr || '',
            location: data.location || '',
            locationAr: data.locationAr || '',
            activitiesEn: data.activitiesEn || '',
            activitiesAr: data.activitiesAr || '',
            bestTimeEn: data.bestTimeEn || '',
            bestTimeAr: data.bestTimeAr || '',
            depth: data.depth || '',
            difficultyEn: data.difficultyEn || '',
            difficultyAr: data.difficultyAr || '',
            scientificName: data.scientificName || '',
            categoryEn: data.categoryEn || '',
            categoryAr: data.categoryAr || '',
            sizeEn: data.sizeEn || '',
            sizeAr: data.sizeAr || '',
            statusEn: data.statusEn || '',
            statusAr: data.statusAr || '',
            rating: typeof data.rating === 'number' ? data.rating : (data.rating ? Number(data.rating) : undefined),
            icon: data.icon || '',
            facts: buildLangList(data.facts, data.factsAr),
            uses: buildLangList(data.uses, data.usesAr),
            threats: buildLangList(data.threats, data.threatsAr)
        }

        const newFeature = await prisma.uniqueFeature.create({
            data: featureData
        })

        return NextResponse.json({
            success: true,
            message: 'Item created successfully',
            data: newFeature
        })

    } catch (error) {
        console.error('❌ Error creating item:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to create item' },
            { status: 500 }
        )
    }
}

// ═══════════════════════════════════════════════════════════════
// PUT - Update item
// ═══════════════════════════════════════════════════════════════
export async function PUT(request) {
    try {
        const body = await request.json()
        const { type, id, data } = body
        const itemId = id || data?.id

        if (type === 'settings') {
            // Upsert Settings with explicit field mapping
            const existing = await prisma.uniqueFeaturesPageSetting.findFirst()

            const settingsData = {
                heroTitleEn: data.heroTitleEn,
                heroTitleAr: data.heroTitleAr,
                heroSubtitleEn: data.heroSubtitleEn,
                heroSubtitleAr: data.heroSubtitleAr,
                heroImage: data.heroImage,
                beachesTitleEn: data.beachesTitleEn,
                beachesTitleAr: data.beachesTitleAr,
                beachesSubtitleEn: data.beachesSubtitleEn,
                beachesSubtitleAr: data.beachesSubtitleAr,
                cavesTitleEn: data.cavesTitleEn,
                cavesTitleAr: data.cavesTitleAr,
                cavesSubtitleEn: data.cavesSubtitleEn,
                cavesSubtitleAr: data.cavesSubtitleAr,
                cavesCtaEn: data.cavesCtaEn,
                cavesCtaAr: data.cavesCtaAr,
                wildlifeTitleEn: data.wildlifeTitleEn,
                wildlifeTitleAr: data.wildlifeTitleAr,
                wildlifeSubtitleEn: data.wildlifeSubtitleEn,
                wildlifeSubtitleAr: data.wildlifeSubtitleAr,
                metaTitleEn: data.metaTitleEn,
                metaTitleAr: data.metaTitleAr,
                metaDescEn: data.metaDescEn,
                metaDescAr: data.metaDescAr
            }

            let settings
            if (existing) {
                settings = await prisma.uniqueFeaturesPageSetting.update({
                    where: { id: existing.id },
                    data: settingsData
                })
            } else {
                settings = await prisma.uniqueFeaturesPageSetting.create({ data: settingsData })
            }
            return NextResponse.json({ success: true, data: settings })
        }

        // Construct update data
        const updateData = {
            nameEn: data.nameEn || data.titleEn,
            nameAr: data.nameAr || data.titleAr,
            descriptionEn: data.descriptionEn,
            descriptionAr: data.descriptionAr,
            featured: data.featured,
            isActive: typeof data.isActive === 'boolean' ? data.isActive : undefined,
            images: data.imageUrl ? [data.imageUrl] : undefined,
            conservationStatus: data.statusEn || data.conservationStatus,
            conservationStatusAr: data.statusAr,
            location: data.location,
            locationAr: data.locationAr,
            activitiesEn: data.activitiesEn,
            activitiesAr: data.activitiesAr,
            bestTimeEn: data.bestTimeEn,
            bestTimeAr: data.bestTimeAr,
            depth: data.depth,
            difficultyEn: data.difficultyEn,
            difficultyAr: data.difficultyAr,
            scientificName: data.scientificName,
            categoryEn: data.categoryEn,
            categoryAr: data.categoryAr,
            sizeEn: data.sizeEn,
            sizeAr: data.sizeAr,
            statusEn: data.statusEn,
            statusAr: data.statusAr,
            rating: typeof data.rating === 'number' ? data.rating : (data.rating ? Number(data.rating) : undefined),
            icon: data.icon,
            uses: buildLangList(data.uses, data.usesAr),
            threats: buildLangList(data.threats, data.threatsAr),
            // Re-construct facts array to include potential changes to special fields
            facts: buildLangList(data.facts, data.factsAr)
        }

        // Only update images if a new one is provided (even if empty string)
        if (typeof data.imageUrl !== 'undefined') {
            updateData.images = data.imageUrl ? [data.imageUrl] : []
        }

        if (!itemId) {
            return NextResponse.json(
                { success: false, error: 'Missing item id' },
                { status: 400 }
            )
        }

        // Update Feature
        const updatedFeature = await prisma.uniqueFeature.update({
            where: { id: itemId },
            data: updateData
        })

        return NextResponse.json({
            success: true,
            message: 'Item updated successfully',
            data: updatedFeature
        })

    } catch (error) {
        console.error('❌ Error updating item:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to update item' },
            { status: 500 }
        )
    }
}

// ═══════════════════════════════════════════════════════════════
// DELETE - Delete item
// ═══════════════════════════════════════════════════════════════
export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url)
        const id = searchParams.get('id')

        await prisma.uniqueFeature.delete({
            where: { id }
        })

        return NextResponse.json({
            success: true,
            message: 'Item deleted successfully'
        })

    } catch (error) {
        console.error('❌ Error deleting item:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to delete item' },
            { status: 500 }
        )
    }
}


