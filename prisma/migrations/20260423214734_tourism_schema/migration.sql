/*
  Warnings:

  - You are about to drop the column `authorName` on the `blogs` table. All the data in the column will be lost.
  - You are about to drop the column `tags` on the `blogs` table. All the data in the column will be lost.
  - You are about to drop the column `author` on the `comments` table. All the data in the column will be lost.
  - You are about to drop the column `category` on the `settings` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `settings` table. All the data in the column will be lost.
  - You are about to drop the column `key` on the `settings` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `settings` table. All the data in the column will be lost.
  - You are about to drop the column `value` on the `settings` table. All the data in the column will be lost.
  - Added the required column `name` to the `comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `testimonials` table without a default value. This is not possible if the table is not empty.
  - Added the required column `countryCode` to the `testimonials` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "HotelStatusEnum" AS ENUM ('ACTIVE', 'DRAFT', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "BookingType" AS ENUM ('TOUR', 'HOTEL', 'CAR');

-- CreateEnum
CREATE TYPE "AboutSectionType" AS ENUM ('GEOGRAPHY', 'NATURE', 'CULTURE', 'HISTORY');

-- CreateEnum
CREATE TYPE "SpeciesCategory" AS ENUM ('FLORA', 'FAUNA', 'MARINE', 'BIRDS');

-- CreateEnum
CREATE TYPE "FAQCategory" AS ENUM ('GENERAL', 'TOURS', 'BOOKING', 'PAYMENT', 'TRAVEL', 'VISA', 'SAFETY');

-- CreateEnum
CREATE TYPE "FeatureType" AS ENUM ('FLORA', 'BEACH', 'CAVE', 'MOUNTAIN', 'WILDLIFE', 'GEOLOGICAL');

-- CreateEnum
CREATE TYPE "TravelGuideSectionType" AS ENUM ('QUICK_TIPS', 'VISA', 'TRANSPORT', 'ACCOMMODATION', 'TIME', 'SAFETY', 'PACKING_LIST', 'EMERGENCY', 'EXTRAS', 'SETTINGS');

-- DropForeignKey
ALTER TABLE "bookings" DROP CONSTRAINT "bookings_tourId_fkey";

-- DropIndex
DROP INDEX "settings_category_idx";

-- DropIndex
DROP INDEX "settings_key_idx";

-- DropIndex
DROP INDEX "settings_key_key";

-- AlterTable
ALTER TABLE "blogs" DROP COLUMN "authorName",
DROP COLUMN "tags";

-- AlterTable
ALTER TABLE "bookings" ADD COLUMN     "bookingType" "BookingType" NOT NULL DEFAULT 'TOUR',
ADD COLUMN     "carId" TEXT,
ADD COLUMN     "hotelId" TEXT,
ADD COLUMN     "numberOfRooms" INTEGER DEFAULT 1,
ALTER COLUMN "tourId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "comments" DROP COLUMN "author",
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "settings" DROP COLUMN "category",
DROP COLUMN "description",
DROP COLUMN "key",
DROP COLUMN "type",
DROP COLUMN "value",
ADD COLUMN     "allowedIPs" TEXT[],
ADD COLUMN     "bookingNotifications" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "cancellationDays" INTEGER NOT NULL DEFAULT 7,
ADD COLUMN     "contactAddress" TEXT,
ADD COLUMN     "contactAddressAr" TEXT,
ADD COLUMN     "contactEmail" TEXT,
ADD COLUMN     "contactPhone" TEXT,
ADD COLUMN     "currency" TEXT NOT NULL DEFAULT 'USD',
ADD COLUMN     "emailEnabled" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "emailHost" TEXT,
ADD COLUMN     "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "emailPassword" TEXT,
ADD COLUMN     "emailPort" INTEGER,
ADD COLUMN     "emailSecure" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "emailSender" TEXT,
ADD COLUMN     "emailUser" TEXT,
ADD COLUMN     "facebook" TEXT,
ADD COLUMN     "instagram" TEXT,
ADD COLUMN     "maintenanceMessage" TEXT,
ADD COLUMN     "maintenanceMessageAr" TEXT,
ADD COLUMN     "maintenanceMode" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "maximumBookingDays" INTEGER NOT NULL DEFAULT 30,
ADD COLUMN     "messageNotifications" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "minimumBookingDays" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "pushNotifications" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "reviewNotifications" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "siteDescription" TEXT,
ADD COLUMN     "siteDescriptionAr" TEXT,
ADD COLUMN     "siteName" TEXT NOT NULL DEFAULT 'Hawari Tours',
ADD COLUMN     "siteNameAr" TEXT NOT NULL DEFAULT 'رحلات الحواري',
ADD COLUMN     "taxRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
ADD COLUMN     "twitter" TEXT,
ADD COLUMN     "whatsapp" TEXT,
ADD COLUMN     "youtube" TEXT;

-- AlterTable
ALTER TABLE "testimonials" ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "countryAr" TEXT,
ADD COLUMN     "countryCode" TEXT NOT NULL,
ADD COLUMN     "customerPhone" TEXT,
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "hasVideo" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "videoUrl" TEXT;

-- AlterTable
ALTER TABLE "tours" ADD COLUMN     "cardImage" TEXT,
ADD COLUMN     "features" TEXT[],
ADD COLUMN     "featuresAr" TEXT[];

-- CreateTable
CREATE TABLE "contact_settings" (
    "id" TEXT NOT NULL,
    "data" JSONB NOT NULL DEFAULT '{}',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hotels" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "descriptionAr" TEXT NOT NULL,
    "shortDescription" TEXT,
    "shortDescriptionAr" TEXT,
    "pricePerNight" DOUBLE PRECISION NOT NULL,
    "discount" DOUBLE PRECISION DEFAULT 0,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reviewsCount" INTEGER NOT NULL DEFAULT 0,
    "roomsCount" INTEGER NOT NULL DEFAULT 0,
    "status" "HotelStatusEnum" NOT NULL DEFAULT 'ACTIVE',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "coverImage" TEXT NOT NULL,
    "images" TEXT[],
    "videoUrl" TEXT,
    "location" TEXT NOT NULL,
    "locationAr" TEXT NOT NULL,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "amenities" TEXT[],
    "amenitiesAr" TEXT[],
    "highlights" TEXT[],
    "highlightsAr" TEXT[],
    "checkInTime" TEXT,
    "checkOutTime" TEXT,
    "cancellationPolicy" TEXT,
    "cancellationPolicyAr" TEXT,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "keywords" TEXT[],
    "viewsCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hotels_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hotels_page_settings" (
    "id" TEXT NOT NULL,
    "heroImage" TEXT NOT NULL DEFAULT '/img/hero/socotra-3.jpg',
    "heroBadgeAr" TEXT NOT NULL DEFAULT 'حجز فنادق فاخرة في سقطرى',
    "heroBadgeEn" TEXT NOT NULL DEFAULT 'Luxury Hotel Booking in Socotra',
    "heroTitleAr" TEXT NOT NULL DEFAULT 'تجربة إقامة مبهرة بتفاصيل ملكية',
    "heroTitleEn" TEXT NOT NULL DEFAULT 'A Royal Stay Crafted with Luxury',
    "heroSubtitleAr" TEXT NOT NULL DEFAULT 'اختر غرفتك المثالية مع عروض حصرية، خدمات خاصة، وتجارب مصممة بعناية لكل رحلة.',
    "heroSubtitleEn" TEXT NOT NULL DEFAULT 'Choose your perfect suite with exclusive offers, private services, and curated experiences.',
    "primaryButtonAr" TEXT NOT NULL DEFAULT 'احجز الآن',
    "primaryButtonEn" TEXT NOT NULL DEFAULT 'Book Now',
    "primaryButtonLink" TEXT NOT NULL DEFAULT '/contact',
    "secondaryButtonAr" TEXT NOT NULL DEFAULT 'استكشف الجولات',
    "secondaryButtonEn" TEXT NOT NULL DEFAULT 'Explore Tours',
    "secondaryButtonLink" TEXT NOT NULL DEFAULT '/tours',
    "stats" JSONB NOT NULL DEFAULT '[{"value":"28+","labelAr":"فنادق فاخرة","labelEn":"Luxury Hotels"},{"value":"4.8","labelAr":"متوسط التقييم","labelEn":"Avg Rating"},{"value":"24/7","labelAr":"خدمة VIP","labelEn":"VIP Service"}]',
    "searchTitleAr" TEXT NOT NULL DEFAULT 'بحث ذكي عن الفندق',
    "searchTitleEn" TEXT NOT NULL DEFAULT 'Smart Hotel Search',
    "searchButtonAr" TEXT NOT NULL DEFAULT 'عرض الخيارات الفاخرة',
    "searchButtonEn" TEXT NOT NULL DEFAULT 'Show Luxury Options',
    "searchHintLeftAr" TEXT NOT NULL DEFAULT 'حجز فوري مضمون',
    "searchHintLeftEn" TEXT NOT NULL DEFAULT 'Instant booking guaranteed',
    "searchHintRightAr" TEXT NOT NULL DEFAULT 'دعم 24/7',
    "searchHintRightEn" TEXT NOT NULL DEFAULT '24/7 Support',
    "filtersTitleAr" TEXT NOT NULL DEFAULT 'فلترة فاخرة',
    "filtersTitleEn" TEXT NOT NULL DEFAULT 'Luxury Filters',
    "experiences" JSONB NOT NULL DEFAULT '[{"titleAr":"خدمة مضيف خاص 24/7","titleEn":"Private host 24/7","descAr":"تنسيق حجوزاتك وتنقلاتك بلمسة شخصية","descEn":"Personalized concierge for every detail","icon":"✨"},{"titleAr":"جلسات عشاء على الشاطئ","titleEn":"Beachfront dining","descAr":"قوائم مصممة خصيصا بإطلالة ساحرة","descEn":"Custom menus with cinematic views","icon":"🍽️"},{"titleAr":"تجارب سبا صحية","titleEn":"Wellness spa rituals","descAr":"جلسات استرخاء بمواد طبيعية محلية","descEn":"Signature treatments with local essences","icon":"🫧"}]',
    "vipTitleAr" TEXT NOT NULL DEFAULT 'خدمة حجز VIP عبر فريقنا',
    "vipTitleEn" TEXT NOT NULL DEFAULT 'VIP Booking Concierge',
    "vipDescriptionAr" TEXT NOT NULL DEFAULT 'نوفر لك تفاوض على أفضل الأسعار، ترقية الغرف، وتجهيزات استثنائية لرحلتك القادمة.',
    "vipDescriptionEn" TEXT NOT NULL DEFAULT 'We secure exclusive rates, room upgrades, and bespoke arrangements for your next escape.',
    "vipPrimaryButtonAr" TEXT NOT NULL DEFAULT 'تواصل مع المستشار',
    "vipPrimaryButtonEn" TEXT NOT NULL DEFAULT 'Talk to Concierge',
    "vipPrimaryButtonLink" TEXT NOT NULL DEFAULT '/contact',
    "vipSecondaryButtonAr" TEXT NOT NULL DEFAULT 'أضف جولة فاخرة',
    "vipSecondaryButtonEn" TEXT NOT NULL DEFAULT 'Add a luxury tour',
    "vipSecondaryButtonLink" TEXT NOT NULL DEFAULT '/tours',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hotels_page_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gallery_videos" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleAr" TEXT NOT NULL,
    "description" TEXT,
    "descriptionAr" TEXT,
    "videoUrl" TEXT NOT NULL,
    "thumbnail" TEXT,
    "duration" TEXT,
    "category" "GalleryCategory" NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gallery_videos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "virtual_tours" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleAr" TEXT NOT NULL,
    "description" TEXT,
    "descriptionAr" TEXT,
    "location" TEXT NOT NULL,
    "locationAr" TEXT NOT NULL,
    "tourUrl" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT '🌐',
    "gradient" TEXT NOT NULL DEFAULT 'from-blue-500 to-cyan-600',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "virtual_tours_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "instagram_posts" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "postUrl" TEXT,
    "likes" INTEGER NOT NULL DEFAULT 0,
    "comments" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "instagram_posts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gallery_settings" (
    "id" TEXT NOT NULL,
    "heroTitle" TEXT NOT NULL DEFAULT 'Explore Socotra',
    "heroTitleAr" TEXT NOT NULL DEFAULT 'استكشف سقطرى',
    "heroSubtitle" TEXT,
    "heroSubtitleAr" TEXT,
    "heroImage" TEXT,
    "heroDescription" TEXT,
    "heroDescriptionAr" TEXT,
    "instagramUsername" TEXT NOT NULL DEFAULT '@HawariTours',
    "instagramUrl" TEXT NOT NULL DEFAULT 'https://instagram.com/hawaritours',
    "instagramTitle" TEXT NOT NULL DEFAULT 'Follow us on Instagram',
    "instagramTitleAr" TEXT NOT NULL DEFAULT 'تابعنا على إنستغرام',
    "instagramDescription" TEXT,
    "instagramDescriptionAr" TEXT,
    "downloadTitle" TEXT NOT NULL DEFAULT 'Want High-Resolution Copy?',
    "downloadTitleAr" TEXT NOT NULL DEFAULT 'هل تريد نسخة عالية الجودة؟',
    "downloadDescription" TEXT,
    "downloadDescriptionAr" TEXT,
    "downloadEnabled" BOOLEAN NOT NULL DEFAULT true,
    "ctaTitle" TEXT NOT NULL DEFAULT 'Liked the Photos? Visit Socotra Yourself!',
    "ctaTitleAr" TEXT NOT NULL DEFAULT 'هل أعجبتك الصور؟ زر سقطرى بنفسك!',
    "ctaDescription" TEXT,
    "ctaDescriptionAr" TEXT,
    "ctaButtonText" TEXT NOT NULL DEFAULT 'Browse Tours',
    "ctaButtonTextAr" TEXT NOT NULL DEFAULT 'تصفح الرحلات',
    "statsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "virtualToursCount" TEXT NOT NULL DEFAULT '10+',
    "highQualityLabel" TEXT NOT NULL DEFAULT '4K',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gallery_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quick_tips" (
    "id" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleAr" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "descriptionAr" TEXT NOT NULL,
    "gradient" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quick_tips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visa_requirements" (
    "id" TEXT NOT NULL,
    "itemAr" TEXT NOT NULL,
    "itemEn" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "visa_requirements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "link" TEXT,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "bookingId" TEXT,
    "reviewId" TEXT,
    "messageId" TEXT,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "flight_routes" (
    "id" TEXT NOT NULL,
    "fromAr" TEXT NOT NULL,
    "fromEn" TEXT NOT NULL,
    "airline" TEXT NOT NULL,
    "duration" TEXT NOT NULL,
    "frequencyAr" TEXT NOT NULL,
    "frequencyEn" TEXT NOT NULL,
    "price" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "gradient" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "flight_routes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "local_transport" (
    "id" TEXT NOT NULL,
    "typeAr" TEXT NOT NULL,
    "typeEn" TEXT NOT NULL,
    "descriptionAr" TEXT,
    "descriptionEn" TEXT,
    "priceAr" TEXT NOT NULL,
    "priceEn" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "gradient" TEXT NOT NULL,
    "features" TEXT[],
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "local_transport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accommodation_types" (
    "id" TEXT NOT NULL,
    "typeAr" TEXT NOT NULL,
    "typeEn" TEXT NOT NULL,
    "descriptionAr" TEXT,
    "descriptionEn" TEXT,
    "priceAr" TEXT NOT NULL,
    "priceEn" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 3,
    "gradient" TEXT NOT NULL,
    "features" TEXT[],
    "examples" TEXT[],
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "accommodation_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "safety_categories" (
    "id" TEXT NOT NULL,
    "categoryAr" TEXT NOT NULL,
    "categoryEn" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "safety_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "safety_tips" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "tipAr" TEXT NOT NULL,
    "tipEn" TEXT NOT NULL,
    "isImportant" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "safety_tips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "timeline_events" (
    "id" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "yearEn" TEXT,
    "era" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleAr" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "descriptionAr" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "color" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "timeline_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "archaeological_sites" (
    "id" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "periodEn" TEXT NOT NULL DEFAULT 'Ancient Period',
    "periodAr" TEXT NOT NULL DEFAULT 'فترة قديمة',
    "descriptionEn" TEXT NOT NULL,
    "descriptionAr" TEXT NOT NULL,
    "significanceEn" TEXT,
    "significanceAr" TEXT,
    "locationEn" TEXT,
    "locationAr" TEXT,
    "accessEn" TEXT,
    "accessAr" TEXT,
    "gradient" TEXT NOT NULL DEFAULT 'from-amber-500 to-orange-600',
    "imageUrl" TEXT,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "archaeological_sites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historical_sections" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleAr" TEXT NOT NULL,
    "contentEn" TEXT NOT NULL,
    "contentAr" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "historical_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "history_page_settings" (
    "id" TEXT NOT NULL,
    "heroTitleEn" TEXT NOT NULL DEFAULT 'History of Socotra',
    "heroTitleAr" TEXT NOT NULL DEFAULT 'تاريخ سقطرى',
    "heroSubtitleEn" TEXT,
    "heroSubtitleAr" TEXT,
    "heroImage" TEXT,
    "ctaTitleEn" TEXT NOT NULL DEFAULT 'Discover Socotra History Yourself',
    "ctaTitleAr" TEXT NOT NULL DEFAULT 'اكتشف تاريخ سقطرى بنفسك',
    "ctaTextEn" TEXT,
    "ctaTextAr" TEXT,
    "ctaImage" TEXT,
    "metaTitleEn" TEXT,
    "metaTitleAr" TEXT,
    "metaDescEn" TEXT,
    "metaDescAr" TEXT,
    "extraContent" JSONB DEFAULT '{}',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "history_page_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "emergency_contacts" (
    "id" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "emergency_contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "packing_categories" (
    "id" TEXT NOT NULL,
    "categoryAr" TEXT NOT NULL,
    "categoryEn" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "items" TEXT[],
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "packing_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "travel_guide_settings" (
    "id" TEXT NOT NULL,
    "heroTitleAr" TEXT NOT NULL DEFAULT 'دليل السفر',
    "heroTitleEn" TEXT NOT NULL DEFAULT 'Travel Guide',
    "heroSubtitleAr" TEXT,
    "heroSubtitleEn" TEXT,
    "visaTitleAr" TEXT NOT NULL DEFAULT 'التأشيرات ومتطلبات الدخول',
    "visaTitleEn" TEXT NOT NULL DEFAULT 'Visa & Entry Requirements',
    "transportTitleAr" TEXT NOT NULL DEFAULT 'النقل والمواصلات',
    "transportTitleEn" TEXT NOT NULL DEFAULT 'Transportation',
    "accommodationTitleAr" TEXT NOT NULL DEFAULT 'خيارات الإقامة',
    "accommodationTitleEn" TEXT NOT NULL DEFAULT 'Accommodation Options',
    "bestTimeTitleAr" TEXT NOT NULL DEFAULT 'أفضل وقت للزيارة',
    "bestTimeTitleEn" TEXT NOT NULL DEFAULT 'Best Time to Visit',
    "peakSeasonAr" TEXT NOT NULL DEFAULT 'أكتوبر - مارس',
    "peakSeasonEn" TEXT NOT NULL DEFAULT 'October - March',
    "offSeasonAr" TEXT NOT NULL DEFAULT 'يونيو - سبتمبر',
    "offSeasonEn" TEXT NOT NULL DEFAULT 'June - September',
    "safetyTitleAr" TEXT NOT NULL DEFAULT 'نصائح السلامة',
    "safetyTitleEn" TEXT NOT NULL DEFAULT 'Safety Tips',
    "ctaTitleAr" TEXT NOT NULL DEFAULT 'جاهز لرحلتك إلى سقطرى؟',
    "ctaTitleEn" TEXT NOT NULL DEFAULT 'Ready for Your Socotra Adventure?',
    "ctaDescriptionAr" TEXT,
    "ctaDescriptionEn" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "travel_guide_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "destinations_page_settings" (
    "id" TEXT NOT NULL,
    "heroImage" TEXT NOT NULL DEFAULT '/img/destinations/socotra-hero.jpg',
    "heroTitleEn" TEXT NOT NULL DEFAULT 'Tourist Destinations',
    "heroTitleAr" TEXT NOT NULL DEFAULT 'المعالم السياحية',
    "heroSubtitleEn" TEXT DEFAULT 'Explore over 50 unique tourist destinations in Socotra Island',
    "heroSubtitleAr" TEXT DEFAULT 'استكشف أكثر من 50 معلماً سياحياً فريداً في جزيرة سقطرى',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "destinations_page_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "about_sections" (
    "id" TEXT NOT NULL,
    "type" "AboutSectionType" NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleAr" TEXT NOT NULL,
    "contentEn" TEXT NOT NULL,
    "contentAr" TEXT NOT NULL,
    "imageUrl" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "about_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "endemic_species" (
    "id" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "scientificName" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "descriptionAr" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "category" "SpeciesCategory" NOT NULL,
    "conservationStatus" TEXT NOT NULL DEFAULT 'Not Evaluated',
    "facts" TEXT[],
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "endemic_species_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cultural_elements" (
    "id" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleAr" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "descriptionAr" TEXT NOT NULL,
    "imageUrl" TEXT,
    "icon" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cultural_elements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_authors" (
    "id" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "titleAr" TEXT,
    "titleEn" TEXT,
    "bioAr" TEXT,
    "bioEn" TEXT,
    "avatar" TEXT,
    "socials" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blog_authors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_tags" (
    "id" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blog_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "faqs" (
    "id" TEXT NOT NULL,
    "questionEn" TEXT NOT NULL,
    "questionAr" TEXT NOT NULL,
    "answerEn" TEXT NOT NULL,
    "answerAr" TEXT NOT NULL,
    "category" "FAQCategory" NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "faqs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contact_info" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "whatsapp" TEXT,
    "address" TEXT,
    "addressAr" TEXT,
    "hoursEn" TEXT,
    "hoursAr" TEXT,
    "facebook" TEXT,
    "instagram" TEXT,
    "twitter" TEXT,
    "youtube" TEXT,
    "linkedin" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contact_info_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historical_eras" (
    "id" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "periodAr" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "descriptionAr" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#3B82F6',
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "historical_eras_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "historical_events" (
    "id" TEXT NOT NULL,
    "eraId" TEXT NOT NULL,
    "year" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleAr" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "descriptionAr" TEXT NOT NULL,
    "icon" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "historical_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unique_features_page_settings" (
    "id" TEXT NOT NULL,
    "heroTitleEn" TEXT NOT NULL DEFAULT 'Unique Features',
    "heroTitleAr" TEXT NOT NULL DEFAULT 'ميزات فريدة',
    "heroSubtitleEn" TEXT DEFAULT 'Found nowhere else on Earth',
    "heroSubtitleAr" TEXT DEFAULT 'لن تجدها في أي مكان آخر على الأرض',
    "heroImage" TEXT,
    "beachesTitleEn" TEXT DEFAULT 'Turquoise Shores',
    "beachesTitleAr" TEXT DEFAULT 'شواطئ فيروزية',
    "beachesSubtitleEn" TEXT DEFAULT 'Where the ocean meets the sky in a scene found nowhere else.',
    "beachesSubtitleAr" TEXT DEFAULT 'حيث يلتقي المحيط بالسماء في مشهد لا يتكرر.',
    "cavesTitleEn" TEXT DEFAULT 'Hidden Depths',
    "cavesTitleAr" TEXT DEFAULT 'أسرار الكهوف',
    "cavesSubtitleEn" TEXT DEFAULT 'Socotra features a vast network of massive limestone caves stretching for kilometers underground.',
    "cavesSubtitleAr" TEXT DEFAULT 'تتميز سقطرى بشبكة واسعة من الكهوف الجيرية الضخمة التي تمتد لكيلومترات تحت الأرض.',
    "cavesCtaEn" TEXT DEFAULT 'Book a Cave Tour',
    "cavesCtaAr" TEXT DEFAULT 'احجز جولة كهوف',
    "wildlifeTitleEn" TEXT DEFAULT 'Rare Wildlife',
    "wildlifeTitleAr" TEXT DEFAULT 'حياة برية نادرة',
    "wildlifeSubtitleEn" TEXT DEFAULT 'Much of Socotra''s reptiles and birds are found nowhere else.',
    "wildlifeSubtitleAr" TEXT DEFAULT 'الكثير من زواحف وطيور سقطرى لا توجد في أي مكان آخر.',
    "metaTitleEn" TEXT,
    "metaTitleAr" TEXT,
    "metaDescEn" TEXT,
    "metaDescAr" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "unique_features_page_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "unique_features" (
    "id" TEXT NOT NULL,
    "type" "FeatureType" NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "descriptionAr" TEXT NOT NULL,
    "images" TEXT[],
    "facts" TEXT[],
    "uses" TEXT[],
    "threats" TEXT[],
    "activitiesEn" TEXT,
    "activitiesAr" TEXT,
    "bestTimeEn" TEXT,
    "bestTimeAr" TEXT,
    "depth" TEXT,
    "difficultyEn" TEXT,
    "difficultyAr" TEXT,
    "scientificName" TEXT,
    "categoryEn" TEXT,
    "categoryAr" TEXT,
    "sizeEn" TEXT,
    "sizeAr" TEXT,
    "statusEn" TEXT,
    "statusAr" TEXT,
    "rating" DOUBLE PRECISION DEFAULT 5,
    "icon" TEXT,
    "conservationStatus" TEXT,
    "conservationStatusAr" TEXT,
    "location" TEXT,
    "locationAr" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "unique_features_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hero_slides" (
    "id" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleAr" TEXT NOT NULL,
    "subtitleEn" TEXT,
    "subtitleAr" TEXT,
    "descriptionEn" TEXT,
    "descriptionAr" TEXT,
    "imageUrl" TEXT NOT NULL,
    "buttonText" TEXT,
    "buttonTextAr" TEXT,
    "buttonLink" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "hero_slides_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quick_stats" (
    "id" TEXT NOT NULL,
    "labelEn" TEXT NOT NULL,
    "labelAr" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#3B82F6',
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "quick_stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "welcome_messages" (
    "id" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleAr" TEXT NOT NULL,
    "subtitleEn" TEXT,
    "subtitleAr" TEXT,
    "contentEn" TEXT NOT NULL,
    "contentAr" TEXT NOT NULL,
    "imageUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "welcome_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "why_choose_us" (
    "id" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleAr" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "descriptionAr" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "color" TEXT NOT NULL DEFAULT '#3B82F6',
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "why_choose_us_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "travel_packages" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleAr" TEXT NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "duration" TEXT NOT NULL,
    "durationAr" TEXT NOT NULL,
    "features" TEXT[],
    "featuresAr" TEXT[],
    "gradient" TEXT NOT NULL DEFAULT 'from-gray-500 to-gray-700',
    "isPopular" BOOLEAN NOT NULL DEFAULT false,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "travel_packages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "travel_guide_sections" (
    "id" TEXT NOT NULL,
    "type" "TravelGuideSectionType" NOT NULL,
    "titleEn" TEXT,
    "titleAr" TEXT,
    "content" JSONB NOT NULL DEFAULT '{}',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "travel_guide_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blog_settings" (
    "id" TEXT NOT NULL,
    "heroTitleAr" TEXT NOT NULL DEFAULT 'مدونة سقطرى',
    "heroTitleEn" TEXT NOT NULL DEFAULT 'Socotra Blog',
    "heroSubtitleAr" TEXT DEFAULT 'اكتشف قصص المسافرين، دلائل السفر، والمعلومات الثقافية والطبيعية',
    "heroSubtitleEn" TEXT DEFAULT 'Discover traveler stories, travel guides, and cultural & natural insights',
    "heroImage" TEXT,
    "stats" JSONB NOT NULL DEFAULT '[]',
    "newsletterTitleAr" TEXT NOT NULL DEFAULT 'اشترك في نشرتنا البريدية',
    "newsletterTitleEn" TEXT NOT NULL DEFAULT 'Subscribe to Our Newsletter',
    "newsletterTextAr" TEXT NOT NULL DEFAULT 'احصل على آخر المقالات، نصائح السفر، والعروض الحصرية مباشرة في بريدك الإلكتروني',
    "newsletterTextEn" TEXT NOT NULL DEFAULT 'Get latest articles, travel tips, and exclusive offers directly in your inbox',
    "writeTitleAr" TEXT NOT NULL DEFAULT 'هل لديك قصة تريد مشاركتها؟',
    "writeTitleEn" TEXT NOT NULL DEFAULT 'Have a Story to Share?',
    "writeTextAr" TEXT NOT NULL DEFAULT 'نحن نبحث دائماً عن قصص وتجارب جديدة من مسافرين زاروا سقطرى. شارك تجربتك مع مجتمعنا!',
    "writeTextEn" TEXT NOT NULL DEFAULT 'We''re always looking for new stories and experiences from travelers who visited Socotra. Share your experience with our community!',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "blog_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "about_page_settings" (
    "id" TEXT NOT NULL,
    "heroTitle" TEXT NOT NULL DEFAULT 'The Jewel of Arabia',
    "heroTitleAr" TEXT NOT NULL DEFAULT 'جنة معزولة',
    "heroSubtitle" TEXT DEFAULT 'An isolated paradise where fantastical nature meets authentic culture',
    "heroSubtitleAr" TEXT DEFAULT 'جنة معزولة حيث تلتقي الطبيعة الخيالية بالثقافة الأصيلة',
    "heroImage" TEXT NOT NULL DEFAULT '/img/about/socotra-nature.jpg',
    "introTitle" TEXT DEFAULT 'More Than Just an Island',
    "introTitleAr" TEXT DEFAULT 'أكثر من مجرد جزيرة',
    "introContent" TEXT,
    "introContentAr" TEXT,
    "introImage" TEXT DEFAULT '/img/about/history-socotra.jpg',
    "stats" JSONB NOT NULL DEFAULT '[]',
    "metaTitle" TEXT DEFAULT 'About Us - Hawari Tours',
    "metaTitleAr" TEXT DEFAULT 'من نحن - رحلات الحواري',
    "metaDescription" TEXT,
    "metaDescriptionAr" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "about_page_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tours_page_settings" (
    "id" TEXT NOT NULL,
    "heroTitleEn" TEXT NOT NULL DEFAULT 'Choose Your Perfect Tour',
    "heroTitleAr" TEXT NOT NULL DEFAULT 'اختر رحلتك المثالية',
    "heroSubtitleEn" TEXT DEFAULT 'From exciting adventures to cultural trips, we have something for every traveler',
    "heroSubtitleAr" TEXT DEFAULT 'من المغامرات المثيرة إلى الرحلات الثقافية، لدينا ما يناسب كل مسافر',
    "heroImage" TEXT NOT NULL DEFAULT '/img/tours/hero-bg.jpg',
    "specialOffers" JSONB NOT NULL DEFAULT '[]',
    "categoriesTitleEn" TEXT NOT NULL DEFAULT 'Browse by Category',
    "categoriesTitleAr" TEXT NOT NULL DEFAULT 'تصفح حسب الفئة',
    "categoriesSubtitleEn" TEXT DEFAULT 'Choose your preferred adventure type',
    "categoriesSubtitleAr" TEXT DEFAULT 'اختر نوع المغامرة المفضلة لديك',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "tours_page_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report_categories" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "nameEn" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "icon" TEXT NOT NULL DEFAULT '📄',
    "gradient" TEXT NOT NULL DEFAULT 'from-gray-500 to-gray-700',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "report_categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports" (
    "id" TEXT NOT NULL,
    "categoryId" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL,
    "titleAr" TEXT NOT NULL,
    "descriptionEn" TEXT NOT NULL,
    "descriptionAr" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "pages" INTEGER NOT NULL,
    "languageEn" TEXT NOT NULL,
    "languageAr" TEXT NOT NULL,
    "fileSize" TEXT NOT NULL,
    "downloadUrl" TEXT NOT NULL,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "topics" TEXT[],
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "report_stats" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "labelEn" TEXT NOT NULL,
    "labelAr" TEXT NOT NULL,
    "icon" TEXT NOT NULL,
    "gradient" TEXT NOT NULL DEFAULT 'from-blue-500 to-indigo-600',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "report_stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports_page_settings" (
    "id" TEXT NOT NULL,
    "heroBadgeEn" TEXT NOT NULL DEFAULT 'Reports Library',
    "heroBadgeAr" TEXT NOT NULL DEFAULT 'مكتبة التقارير',
    "heroTitleLine1En" TEXT NOT NULL DEFAULT 'Socotra',
    "heroTitleLine1Ar" TEXT NOT NULL DEFAULT 'تقارير',
    "heroTitleLine2En" TEXT NOT NULL DEFAULT 'Reports',
    "heroTitleLine2Ar" TEXT NOT NULL DEFAULT 'سقطرى',
    "heroSubtitleEn" TEXT,
    "heroSubtitleAr" TEXT,
    "primaryButtonLabelEn" TEXT NOT NULL DEFAULT 'Browse Reports',
    "primaryButtonLabelAr" TEXT NOT NULL DEFAULT 'تصفح التقارير',
    "primaryButtonLink" TEXT NOT NULL DEFAULT '#reports',
    "secondaryButtonLabelEn" TEXT NOT NULL DEFAULT 'Statistics',
    "secondaryButtonLabelAr" TEXT NOT NULL DEFAULT 'الإحصائيات',
    "secondaryButtonLink" TEXT NOT NULL DEFAULT '#statistics',
    "statsTitleEn" TEXT NOT NULL DEFAULT 'Key',
    "statsTitleAr" TEXT NOT NULL DEFAULT 'إحصائيات',
    "statsTitleHighlightEn" TEXT NOT NULL DEFAULT 'Statistics',
    "statsTitleHighlightAr" TEXT NOT NULL DEFAULT 'رئيسية',
    "featuredBadgeEn" TEXT NOT NULL DEFAULT 'Featured Reports',
    "featuredBadgeAr" TEXT NOT NULL DEFAULT 'تقارير مميزة',
    "featuredTitleEn" TEXT NOT NULL DEFAULT 'Most Important Reports',
    "featuredTitleAr" TEXT NOT NULL DEFAULT 'أهم التقارير',
    "allReportsTitleEn" TEXT NOT NULL DEFAULT 'All',
    "allReportsTitleAr" TEXT NOT NULL DEFAULT 'جميع',
    "allReportsTitleHighlightEn" TEXT NOT NULL DEFAULT 'Reports',
    "allReportsTitleHighlightAr" TEXT NOT NULL DEFAULT 'التقارير',
    "searchPlaceholderEn" TEXT NOT NULL DEFAULT 'Search for a report...',
    "searchPlaceholderAr" TEXT NOT NULL DEFAULT 'ابحث عن تقرير...',
    "noResultsTitleEn" TEXT NOT NULL DEFAULT 'No Results Found',
    "noResultsTitleAr" TEXT NOT NULL DEFAULT 'لا توجد نتائج',
    "noResultsTextEn" TEXT NOT NULL DEFAULT 'Try searching with different keywords',
    "noResultsTextAr" TEXT NOT NULL DEFAULT 'جرب البحث بكلمات مختلفة',
    "resetButtonLabelEn" TEXT NOT NULL DEFAULT 'Reset',
    "resetButtonLabelAr" TEXT NOT NULL DEFAULT 'إعادة تعيين',
    "downloadLabelEn" TEXT NOT NULL DEFAULT 'Download',
    "downloadLabelAr" TEXT NOT NULL DEFAULT 'تحميل',
    "reportsCountLabelEn" TEXT NOT NULL DEFAULT 'reports available',
    "reportsCountLabelAr" TEXT NOT NULL DEFAULT 'تقرير متاح',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reports_page_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports_unesco_section" (
    "id" TEXT NOT NULL,
    "badgeEn" TEXT NOT NULL DEFAULT 'UNESCO World Heritage Site',
    "badgeAr" TEXT NOT NULL DEFAULT 'موقع تراث عالمي',
    "titleLine1En" TEXT NOT NULL DEFAULT 'Socotra - World',
    "titleLine1Ar" TEXT NOT NULL DEFAULT 'سقطرى - تراث',
    "titleLine2En" TEXT NOT NULL DEFAULT 'Heritage',
    "titleLine2Ar" TEXT NOT NULL DEFAULT 'عالمي',
    "descriptionEn" TEXT,
    "descriptionAr" TEXT,
    "bulletsEn" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "bulletsAr" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "buttonLabelEn" TEXT NOT NULL DEFAULT 'Official UNESCO Page',
    "buttonLabelAr" TEXT NOT NULL DEFAULT 'موقع اليونسكو الرسمي',
    "buttonLink" TEXT NOT NULL DEFAULT 'https://whc.unesco.org/en/list/1263',
    "imageUrl" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reports_unesco_section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reports_cta_section" (
    "id" TEXT NOT NULL,
    "titleEn" TEXT NOT NULL DEFAULT 'Have a Question?',
    "titleAr" TEXT NOT NULL DEFAULT 'هل لديك سؤال؟',
    "subtitleEn" TEXT,
    "subtitleAr" TEXT,
    "primaryButtonLabelEn" TEXT NOT NULL DEFAULT 'Contact Us',
    "primaryButtonLabelAr" TEXT NOT NULL DEFAULT 'تواصل معنا',
    "primaryButtonLink" TEXT NOT NULL DEFAULT '/contact',
    "secondaryButtonLabelEn" TEXT NOT NULL DEFAULT 'More About Socotra',
    "secondaryButtonLabelAr" TEXT NOT NULL DEFAULT 'المزيد عن سقطرى',
    "secondaryButtonLink" TEXT NOT NULL DEFAULT '/about',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "reports_cta_section_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cars" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameAr" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "descriptionAr" TEXT NOT NULL,
    "brand" TEXT,
    "type" TEXT NOT NULL,
    "year" INTEGER,
    "pricePerDay" DOUBLE PRECISION NOT NULL,
    "discount" DOUBLE PRECISION DEFAULT 0,
    "seats" INTEGER NOT NULL DEFAULT 4,
    "doors" INTEGER NOT NULL DEFAULT 4,
    "transmission" TEXT NOT NULL DEFAULT 'Automatic',
    "fuelType" TEXT,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "reviewsCount" INTEGER NOT NULL DEFAULT 0,
    "status" "HotelStatusEnum" NOT NULL DEFAULT 'ACTIVE',
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "coverImage" TEXT NOT NULL,
    "images" TEXT[],
    "videoUrl" TEXT,
    "features" TEXT[],
    "featuresAr" TEXT[],
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "keywords" TEXT[],
    "insurance" TEXT DEFAULT 'Basic',
    "insuranceAr" TEXT DEFAULT 'تأمين أساسي',
    "mileage" TEXT DEFAULT 'Unlimited',
    "mileageAr" TEXT DEFAULT 'غير محدود',
    "color" TEXT,
    "colorAr" TEXT,
    "minAge" INTEGER NOT NULL DEFAULT 21,
    "deposit" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "luggage" INTEGER NOT NULL DEFAULT 2,
    "viewsCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cars_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cars_page_settings" (
    "id" TEXT NOT NULL,
    "heroImage" TEXT NOT NULL DEFAULT '/img/cars/hero.jpg',
    "heroBadgeAr" TEXT NOT NULL DEFAULT 'تأجير سيارات فاخرة في سقطرى',
    "heroBadgeEn" TEXT NOT NULL DEFAULT 'Luxury Car Rental in Socotra',
    "heroTitleAr" TEXT NOT NULL DEFAULT 'رحلتك المثالية تبدأ بسيارة مثالية',
    "heroTitleEn" TEXT NOT NULL DEFAULT 'Your Perfect Journey Starts With A Perfect Car',
    "heroSubtitleAr" TEXT NOT NULL DEFAULT 'اختر من بين تشكيلة واسعة من سيارات الدفع الرباعي والسيارات الفاخرة لتنطلق بثقة',
    "heroSubtitleEn" TEXT NOT NULL DEFAULT 'Choose from a wide range of 4x4s and luxury vehicles to explore with confidence',
    "primaryButtonAr" TEXT NOT NULL DEFAULT 'استعرض الأسطول',
    "primaryButtonEn" TEXT NOT NULL DEFAULT 'Browse Fleet',
    "primaryButtonLink" TEXT NOT NULL DEFAULT '#fleet',
    "stats" JSONB NOT NULL DEFAULT '[{"value":"15+","labelAr":"مركبة دفع رباعي","labelEn":"4x4 Vehicles"},{"value":"4.9","labelAr":"تقييم العملاء","labelEn":"Customer Rating"},{"value":"24/7","labelAr":"دعم فني للطرق","labelEn":"Road Assistance"}]',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "cars_page_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_BlogToBlogTag" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_BlogToBlogTag_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "hotels_slug_key" ON "hotels"("slug");

-- CreateIndex
CREATE INDEX "hotels_slug_idx" ON "hotels"("slug");

-- CreateIndex
CREATE INDEX "hotels_featured_idx" ON "hotels"("featured");

-- CreateIndex
CREATE INDEX "hotels_status_idx" ON "hotels"("status");

-- CreateIndex
CREATE INDEX "hotels_pricePerNight_idx" ON "hotels"("pricePerNight");

-- CreateIndex
CREATE INDEX "hotels_rating_idx" ON "hotels"("rating");

-- CreateIndex
CREATE INDEX "gallery_videos_category_idx" ON "gallery_videos"("category");

-- CreateIndex
CREATE INDEX "gallery_videos_featured_idx" ON "gallery_videos"("featured");

-- CreateIndex
CREATE INDEX "gallery_videos_order_idx" ON "gallery_videos"("order");

-- CreateIndex
CREATE INDEX "virtual_tours_featured_idx" ON "virtual_tours"("featured");

-- CreateIndex
CREATE INDEX "virtual_tours_order_idx" ON "virtual_tours"("order");

-- CreateIndex
CREATE INDEX "instagram_posts_order_idx" ON "instagram_posts"("order");

-- CreateIndex
CREATE INDEX "quick_tips_order_idx" ON "quick_tips"("order");

-- CreateIndex
CREATE INDEX "visa_requirements_order_idx" ON "visa_requirements"("order");

-- CreateIndex
CREATE INDEX "notifications_isRead_idx" ON "notifications"("isRead");

-- CreateIndex
CREATE INDEX "notifications_createdAt_idx" ON "notifications"("createdAt");

-- CreateIndex
CREATE INDEX "flight_routes_order_idx" ON "flight_routes"("order");

-- CreateIndex
CREATE INDEX "local_transport_order_idx" ON "local_transport"("order");

-- CreateIndex
CREATE INDEX "accommodation_types_order_idx" ON "accommodation_types"("order");

-- CreateIndex
CREATE INDEX "safety_categories_order_idx" ON "safety_categories"("order");

-- CreateIndex
CREATE INDEX "safety_tips_categoryId_idx" ON "safety_tips"("categoryId");

-- CreateIndex
CREATE INDEX "safety_tips_order_idx" ON "safety_tips"("order");

-- CreateIndex
CREATE INDEX "timeline_events_era_idx" ON "timeline_events"("era");

-- CreateIndex
CREATE INDEX "timeline_events_order_idx" ON "timeline_events"("order");

-- CreateIndex
CREATE INDEX "archaeological_sites_featured_idx" ON "archaeological_sites"("featured");

-- CreateIndex
CREATE INDEX "archaeological_sites_order_idx" ON "archaeological_sites"("order");

-- CreateIndex
CREATE UNIQUE INDEX "historical_sections_slug_key" ON "historical_sections"("slug");

-- CreateIndex
CREATE INDEX "emergency_contacts_order_idx" ON "emergency_contacts"("order");

-- CreateIndex
CREATE INDEX "packing_categories_order_idx" ON "packing_categories"("order");

-- CreateIndex
CREATE INDEX "about_sections_type_idx" ON "about_sections"("type");

-- CreateIndex
CREATE INDEX "about_sections_order_idx" ON "about_sections"("order");

-- CreateIndex
CREATE INDEX "endemic_species_category_idx" ON "endemic_species"("category");

-- CreateIndex
CREATE INDEX "endemic_species_order_idx" ON "endemic_species"("order");

-- CreateIndex
CREATE INDEX "cultural_elements_order_idx" ON "cultural_elements"("order");

-- CreateIndex
CREATE UNIQUE INDEX "blog_tags_slug_key" ON "blog_tags"("slug");

-- CreateIndex
CREATE INDEX "faqs_category_idx" ON "faqs"("category");

-- CreateIndex
CREATE INDEX "faqs_order_idx" ON "faqs"("order");

-- CreateIndex
CREATE INDEX "historical_eras_order_idx" ON "historical_eras"("order");

-- CreateIndex
CREATE INDEX "historical_events_eraId_idx" ON "historical_events"("eraId");

-- CreateIndex
CREATE INDEX "historical_events_order_idx" ON "historical_events"("order");

-- CreateIndex
CREATE INDEX "unique_features_type_idx" ON "unique_features"("type");

-- CreateIndex
CREATE INDEX "unique_features_featured_idx" ON "unique_features"("featured");

-- CreateIndex
CREATE INDEX "unique_features_order_idx" ON "unique_features"("order");

-- CreateIndex
CREATE INDEX "hero_slides_order_idx" ON "hero_slides"("order");

-- CreateIndex
CREATE INDEX "quick_stats_order_idx" ON "quick_stats"("order");

-- CreateIndex
CREATE INDEX "why_choose_us_order_idx" ON "why_choose_us"("order");

-- CreateIndex
CREATE INDEX "travel_packages_order_idx" ON "travel_packages"("order");

-- CreateIndex
CREATE INDEX "travel_packages_isActive_idx" ON "travel_packages"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "travel_guide_sections_type_key" ON "travel_guide_sections"("type");

-- CreateIndex
CREATE UNIQUE INDEX "report_categories_slug_key" ON "report_categories"("slug");

-- CreateIndex
CREATE INDEX "report_categories_order_idx" ON "report_categories"("order");

-- CreateIndex
CREATE INDEX "report_categories_isActive_idx" ON "report_categories"("isActive");

-- CreateIndex
CREATE INDEX "reports_categoryId_idx" ON "reports"("categoryId");

-- CreateIndex
CREATE INDEX "reports_featured_idx" ON "reports"("featured");

-- CreateIndex
CREATE INDEX "reports_order_idx" ON "reports"("order");

-- CreateIndex
CREATE INDEX "reports_isActive_idx" ON "reports"("isActive");

-- CreateIndex
CREATE INDEX "report_stats_order_idx" ON "report_stats"("order");

-- CreateIndex
CREATE INDEX "report_stats_isActive_idx" ON "report_stats"("isActive");

-- CreateIndex
CREATE UNIQUE INDEX "cars_slug_key" ON "cars"("slug");

-- CreateIndex
CREATE INDEX "cars_slug_idx" ON "cars"("slug");

-- CreateIndex
CREATE INDEX "cars_featured_idx" ON "cars"("featured");

-- CreateIndex
CREATE INDEX "cars_status_idx" ON "cars"("status");

-- CreateIndex
CREATE INDEX "cars_pricePerDay_idx" ON "cars"("pricePerDay");

-- CreateIndex
CREATE INDEX "cars_rating_idx" ON "cars"("rating");

-- CreateIndex
CREATE INDEX "_BlogToBlogTag_B_index" ON "_BlogToBlogTag"("B");

-- CreateIndex
CREATE INDEX "bookings_hotelId_idx" ON "bookings"("hotelId");

-- CreateIndex
CREATE INDEX "bookings_carId_idx" ON "bookings"("carId");

-- CreateIndex
CREATE INDEX "bookings_paymentStatus_idx" ON "bookings"("paymentStatus");

-- CreateIndex
CREATE INDEX "bookings_createdAt_idx" ON "bookings"("createdAt");

-- CreateIndex
CREATE INDEX "bookings_totalPrice_idx" ON "bookings"("totalPrice");

-- CreateIndex
CREATE INDEX "bookings_customerEmail_idx" ON "bookings"("customerEmail");

-- CreateIndex
CREATE INDEX "testimonials_country_idx" ON "testimonials"("country");

-- CreateIndex
CREATE INDEX "tours_bookingsCount_idx" ON "tours"("bookingsCount");

-- CreateIndex
CREATE INDEX "tours_price_idx" ON "tours"("price");

-- CreateIndex
CREATE INDEX "tours_rating_idx" ON "tours"("rating");

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_tourId_fkey" FOREIGN KEY ("tourId") REFERENCES "tours"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_hotelId_fkey" FOREIGN KEY ("hotelId") REFERENCES "hotels"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bookings" ADD CONSTRAINT "bookings_carId_fkey" FOREIGN KEY ("carId") REFERENCES "cars"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "safety_tips" ADD CONSTRAINT "safety_tips_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "safety_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "blogs" ADD CONSTRAINT "blogs_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "blog_authors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "historical_events" ADD CONSTRAINT "historical_events_eraId_fkey" FOREIGN KEY ("eraId") REFERENCES "historical_eras"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "reports" ADD CONSTRAINT "reports_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "report_categories"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlogToBlogTag" ADD CONSTRAINT "_BlogToBlogTag_A_fkey" FOREIGN KEY ("A") REFERENCES "blogs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_BlogToBlogTag" ADD CONSTRAINT "_BlogToBlogTag_B_fkey" FOREIGN KEY ("B") REFERENCES "blog_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
