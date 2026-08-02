
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Starting seed...')

    // 1. Create/Update Featured Tours
    const tours = [
        {
            title: 'Socotra Treasure Island',
            titleAr: 'جزيرة الكنز سقطرى',
            slug: 'socotra-treasure-island',
            description: 'A 7-day adventure exploring the most iconic spots of Socotra.',
            descriptionAr: 'مغامرة لمدة 7 أيام لاستكشاف أفضل معالم سقطرى.',
            // Removed shortDesc (not in schema)
            price: 1200,
            originalPrice: 1500,
            duration: 7, // Fixed: Int (days)
            maxPeople: 12,
            difficulty: 'MODERATE',
            category: 'ADVENTURE',
            featured: true,
            isActive: true,
            coverImage: '/img/tours/treasure.jpg',
            images: ['/img/tours/treasure.jpg', '/img/tours/treasure-2.jpg'],
            includes: ['Visa', 'Hotel', 'Food', 'Transport'],
            location: 'Hadibo',
            locationAr: 'حديبو'
        },
        {
            title: 'Highlands & Canyons',
            titleAr: 'المرتفعات والوديان',
            slug: 'highlands-and-canyons',
            description: 'Hiking through the spectacular Dixam plateau and wadis.',
            descriptionAr: 'المشي لمسافات طويلة عبر هضبة ديكسام الرائعة والوديان.',
            // Removed shortDesc
            price: 950,
            originalPrice: 1100,
            duration: 5, // Fixed: Int
            maxPeople: 8,
            difficulty: 'CHALLENGING',
            category: 'NATURE',
            featured: true,
            isActive: true,
            coverImage: '/img/tours/highlands.jpg',
            images: ['/img/tours/highlands.jpg'],
            includes: ['Guide', 'Camping Gear', 'Water'],
            location: 'Dixam',
            locationAr: 'ديكسام'
        },
        {
            title: 'Blue Waters Escape',
            titleAr: 'ملاذ المياه الزرقاء',
            slug: 'blue-waters-escape',
            description: 'Relax on the pristine white sands of Qalansiyah and Shuab.',
            descriptionAr: 'استرخ على الرمال البيضاء النقية في قلنسية وشوعب.',
            // Removed shortDesc
            price: 1100,
            originalPrice: 1300,
            duration: 6, // Fixed: Int
            maxPeople: 10,
            difficulty: 'EASY',
            category: 'BEACH',
            featured: true,
            isActive: true,
            coverImage: '/img/tours/beach.jpg',
            images: ['/img/tours/beach.jpg'],
            includes: ['Boat trip', 'Snorkeling', 'Meals'],
            location: 'Qalansiyah',
            locationAr: 'قلنسية'
        }
    ]

    for (const t of tours) {
        // Avoid shortDesc by ONLY using defined fields
        const { originalPrice, ...data } = t
        // Schema has 'discount', not 'originalPrice' in creation? 
        // Wait, let's checking schema again.
        // model Tour { ... price Float, discount Float? @default(0) ... }
        // There is NO originalPrice field in Tour. 'discount' is likely the percentage or amount? 
        // Ah, 'discount' is type Float. 
        // Let's assume input 'originalPrice' was for calculation.
        // If originalPrice=1500, price=1200, discount = 1500-1200 = 300 (amount) or percentage?
        // Let's just set discount = 0 for now to avoid issues, or calculate it if valid.

        // Actually better to check schema again. Lines 53-61:
        // price Float
        // discount Float? @default(0)

        // So I will calculate discount
        const discountValue = t.originalPrice ? (t.originalPrice - t.price) : 0

        const tourData = {
            title: t.title,
            titleAr: t.titleAr,
            slug: t.slug,
            description: t.description,
            descriptionAr: t.descriptionAr,
            price: t.price,
            discount: discountValue,
            duration: t.duration,
            maxPeople: t.maxPeople,
            difficulty: t.difficulty,
            category: t.category,
            featured: t.featured,
            isActive: t.isActive,
            coverImage: t.coverImage,
            images: t.images,
            includes: t.includes,
            location: t.location,
            locationAr: t.locationAr
        }

        await prisma.tour.upsert({
            where: { slug: t.slug },
            update: tourData,
            create: tourData,
        })
    }

    // 2. Create/Update Packages
    const packages = [
        {
            title: 'Silver Package',
            titleAr: 'الباقة الفضية',
            price: 800,
            duration: '4 Days',
            durationAr: '4 أيام',
            features: ['Airport Pickup', '3 Star Hotel', 'Breakfast', 'City Tour'],
            featuresAr: ['استقبال المطار', 'فندق 3 نجوم', 'إفطار', 'جولة في المدينة'],
            isPopular: false,
            isFeatured: false,
            gradient: 'from-gray-500 to-gray-700',
            isActive: true,
            order: 1
        },
        {
            title: 'Gold Package',
            titleAr: 'الباقة الذهبية',
            price: 1500,
            duration: '7 Days',
            durationAr: '7 أيام',
            features: ['Visa Included', '4 Star Hotel', 'All Meals', '4WD Transport', 'English Guide'],
            featuresAr: ['شامل الفيزا', 'فندق 4 نجوم', 'جميع الوجبات', 'نقل دفع رباعي', 'مرشد إنجليزي'],
            isPopular: true,
            isFeatured: true,
            gradient: 'from-yellow-500 to-yellow-600',
            isActive: true,
            order: 2
        },
        {
            title: 'Platinum Package',
            titleAr: 'الباقة البلاتينية',
            price: 2500,
            duration: '10 Days',
            durationAr: '10 أيام',
            features: ['VIP Visa', 'Luxury Camping', 'Private Chef', 'Private Boat', 'Photography'],
            featuresAr: ['فيزا VIP', 'تخييم فاخر', 'طباخ خاص', 'قارب خاص', 'تغطية تصوير'],
            isPopular: false,
            isFeatured: false,
            gradient: 'from-slate-800 to-black',
            isActive: true,
            order: 3
        }
    ]

    for (const p of packages) {
        const existing = await prisma.travelPackage.findFirst({ where: { title: p.title } })
        if (existing) {
            await prisma.travelPackage.update({ where: { id: existing.id }, data: p })
        } else {
            await prisma.travelPackage.create({ data: p })
        }
    }

    // 3. Create/Update News
    const news = [
        {
            slug: 'socotra-filming-location',
            title: 'Socotra chosen as top filming location',
            titleAr: 'اختيار سقطرى كأفضل موقع تصوير',
            excerpt: 'Several international documentaries are being filmed in Socotra this season.',
            excerptAr: 'يتم تصوير العديد من الأفلام الوثائقية العالمية في سقطرى هذا الموسم.',
            content: 'Full content here...',
            contentAr: 'المحتوى الكامل هنا...',
            coverImage: '/img/news/filming.jpg',
            category: 'CULTURE', // Fixed Enum (was GENERAL, but schema says TOURISM, ENVIRONMENT, WEATHER, UNESCO, CULTURE, EVENTS)
            // Actually 'GENERAL' is NOT in enum.
            published: true,
            featured: true,
            breaking: false,
            publishedAt: new Date()
        },
        {
            slug: 'new-flight-routes',
            title: 'New direct flights to Socotra announced',
            titleAr: 'الإعلان عن رحلات طيران مباشرة جديدة إلى سقطرى',
            excerpt: 'Abu Dhabi to Socotra flights now operating twice weekly.',
            excerptAr: 'رحلات أبوظبي إلى سقطرى تعمل الآن مرتين أسبوعياً.',
            content: 'Details about flights...',
            contentAr: 'تفاصيل الرحلات...',
            coverImage: '/img/news/flights.jpg',
            category: 'TOURISM', // Fixed Enum (was TRAVEL)
            published: true,
            featured: true,
            breaking: true,
            publishedAt: new Date()
        },
        {
            slug: 'dragon-blood-festival',
            title: 'Annual Dragon Blood Tree Festival',
            titleAr: 'مهرجان شجرة دم الأخوين السنوي',
            excerpt: 'Join us for the cultural celebration of Socotra unique heritage.',
            excerptAr: 'انضم إلينا في الاحتفال الثقافي بتراث سقطرى الفريد.',
            content: 'Festival details...',
            contentAr: 'تفاصيل المهرجان...',
            coverImage: '/img/news/festival.jpg',
            category: 'CULTURE',
            published: true,
            featured: false,
            breaking: false,
            publishedAt: new Date()
        }
    ]

    for (const n of news) {
        await prisma.news.upsert({
            where: { slug: n.slug },
            update: n,
            create: n
        })
    }

    console.log('✅ Seed completed successfully')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
