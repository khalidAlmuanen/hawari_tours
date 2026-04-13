const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    console.log('🌱 Seeding Travel Packages...')

    const packages = [
        {
            title: 'Basic Package',
            titleAr: 'الباقة الأساسية',
            price: 950,
            duration: '7 days / 7 nights',
            durationAr: '7 أيام / 7 ليالي',
            gradient: 'from-gray-500 to-gray-700',
            isPopular: false,
            isFeatured: false,
            order: 1,
            features: [
                'Full camping',
                'All meals',
                'Local guide',
                'Internal transport',
                'Camping equipment'
            ],
            featuresAr: [
                'تخييم كامل',
                'جميع الوجبات',
                'مرشد محلي',
                'النقل الداخلي',
                'معدات التخييم'
            ]
        },
        {
            title: 'Standard Package',
            titleAr: 'الباقة القياسية',
            price: 1200,
            duration: '7 days / 6 nights',
            durationAr: '7 أيام / 6 ليالي',
            gradient: 'from-green-500 to-emerald-600',
            isPopular: true,
            isFeatured: true,
            order: 2,
            features: [
                'Camping + Hotel',
                'All meals',
                'Professional guide',
                'Full transport',
                'High-quality equipment',
                'Visit all highlights'
            ],
            featuresAr: [
                'تخييم + فندق',
                'جميع الوجبات',
                'مرشد محترف',
                'النقل الكامل',
                'معدات عالية الجودة',
                'زيارة جميع المعالم'
            ]
        },
        {
            title: 'Premium Package',
            titleAr: 'الباقة المميزة',
            price: 1800,
            duration: '10 days / 9 nights',
            durationAr: '10 أيام / 9 ليالي',
            gradient: 'from-purple-500 to-pink-600',
            isPopular: false,
            isFeatured: true,
            order: 3,
            features: [
                'Luxury Hotel stay',
                'Luxury meals',
                'Private guide',
                'VIP transport',
                'Private boat trip',
                'Pro photography',
                'Full insurance'
            ],
            featuresAr: [
                'إقامة فندقية فاخرة',
                'وجبات فاخرة',
                'مرشد خاص',
                'نقل خاص VIP',
                'رحلة بحرية خاصة',
                'تصوير احترافي',
                'تأمين شامل'
            ]
        }
    ]

    for (const pkg of packages) {
        const existing = await prisma.travelPackage.findFirst({
            where: { title: pkg.title }
        })

        if (!existing) {
            await prisma.travelPackage.create({
                data: pkg
            })
            console.log(`✅ Created package: ${pkg.title}`)
        } else {
            console.log(`⚠️ Package already exists: ${pkg.title}`)
        }
    }

    console.log('🎉 Seeding finished!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
