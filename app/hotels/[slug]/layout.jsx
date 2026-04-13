import { prisma } from '@/lib/prisma'

export async function generateMetadata({ params, searchParams }) {
    const { slug } = await params

    try {
        const hotel = await prisma.hotel.findUnique({
            where: { slug }
        })

        if (hotel) {
            return {
                title: hotel.metaTitle || hotel.name,
                description: hotel.metaDescription || hotel.shortDescription || hotel.description,
                keywords: hotel.keywords?.length ? hotel.keywords.join(', ') : undefined,
                openGraph: {
                    title: hotel.metaTitle || hotel.name,
                    description: hotel.metaDescription || hotel.shortDescription || hotel.description,
                    images: hotel.coverImage ? [hotel.coverImage] : []
                }
            }
        }
    } catch (err) {
        console.error("Failed to generate metadata for hotel:", err)
    }

    return {
        title: 'Hotel',
        description: 'Luxury hotel booking'
    }
}

export default function HotelLayout({ children }) {
    return children
}
