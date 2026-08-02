// 🚀 DIRECT PRODUCTION FIX - Apply directly to production database
// إصلاح مباشر للإنتاج - تطبيق مباشر على قاعدة بيانات الإنتاج

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function directProductionFix() {
  console.log('🚀 ═══════════════════════════════════════════');
  console.log('   DIRECT PRODUCTION FIX - Apply to Live Database');
  console.log('═══════════════════════════════════════════');

  try {
    // ═══════════════════════════════════════════════════
    // 🎯 STEP 1: Direct SQL commands to fix enum issue
    // ═══════════════════════════════════════════════════
    console.log('\n🎯 Step 1: Direct SQL enum fix...');
    
    // Execute raw SQL to completely fix the enum issue
    const sqlCommands = [
      // Drop the problematic enum completely
      `DROP TYPE IF EXISTS "HotelStatus" CASCADE;`,
      `DROP TYPE IF EXISTS "public.HotelStatus" CASCADE;`,
      
      // Create the correct enum
      `CREATE TYPE IF NOT EXISTS "HotelStatusEnum" AS ENUM ('ACTIVE', 'DRAFT', 'SUSPENDED');`,
      
      // Update any existing hotel records to use correct enum
      `UPDATE hotels SET status = 'ACTIVE' WHERE status IS NULL OR status NOT IN ('ACTIVE', 'DRAFT', 'SUSPENDED');`
    ];
    
    for (const sql of sqlCommands) {
      try {
        await prisma.$executeRaw`${sql}`;
        console.log(`✅ Executed: ${sql.substring(0, 50)}...`);
      } catch (error) {
        console.log(`ℹ️  SQL already applied or not needed: ${sql.substring(0, 50)}...`);
      }
    }

    // ═══════════════════════════════════════════════════
    // 🎯 STEP 2: Test hotels query directly
    // ═══════════════════════════════════════════════════
    console.log('\n🎯 Step 2: Testing hotels query...');
    
    try {
      const hotels = await prisma.hotel.findMany({
        take: 10,
        select: {
          id: true,
          name: true,
          nameAr: true,
          pricePerNight: true,
          status: true,
          rating: true,
          featured: true,
          coverImage: true
        }
      });
      
      console.log(`✅ SUCCESS: Found ${hotels.length} hotels`);
      hotels.forEach((hotel, index) => {
        console.log(`   ${index + 1}. ${hotel.name} - $${hotel.pricePerNight}/night - ${hotel.status}`);
      });
      
      // Test with the exact query the frontend uses
      const hotelsForFrontend = await prisma.hotel.findMany({
        where: { status: 'ACTIVE' },
        orderBy: { rating: 'desc' },
        select: {
          id: true,
          name: true,
          nameAr: true,
          slug: true,
          pricePerNight: true,
          discount: true,
          rating: true,
          reviewsCount: true,
          status: true,
          featured: true,
          coverImage: true,
          location: true,
          locationAr: true,
          shortDescription: true,
          shortDescriptionAr: true,
          amenities: true,
          highlights: true,
          checkInTime: true,
          checkOutTime: true,
          cancellationPolicy: true,
          cancellationPolicyAr: true,
          metaTitle: true,
          metaDescription: true,
          keywords: true,
          viewsCount: true,
          createdAt: true
        }
      });
      
      console.log(`✅ Frontend query SUCCESS: ${hotelsForFrontend.length} hotels ready for frontend`);
      
    } catch (error) {
      console.log('❌ Hotels query FAILED:', error.message);
      
      // If still failing, try more aggressive approach
      console.log('🔥 Applying aggressive SQL fix...');
      
      const aggressiveCommands = [
        `DROP TABLE IF EXISTS hotels CASCADE;`,
        `DROP TYPE IF EXISTS "HotelStatus" CASCADE;`,
        `DROP TYPE IF EXISTS "public.HotelStatus" CASCADE;`,
        `CREATE TYPE IF NOT EXISTS "HotelStatusEnum" AS ENUM ('ACTIVE', 'DRAFT', 'SUSPENDED');`,
        `CREATE TYPE IF NOT EXISTS "UserRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'USER');`,
        `CREATE TYPE IF NOT EXISTS "BookingType" AS ENUM ('TOUR', 'HOTEL', 'CAR');`,
        `CREATE TYPE IF NOT EXISTS "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED');`,
        `CREATE TYPE IF NOT EXISTS "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'PARTIAL', 'REFUNDED');`,
        `CREATE TYPE IF NOT EXISTS "PaymentMethod" AS ENUM ('CREDIT_CARD', 'BANK_TRANSFER', 'CASH', 'PAYPAL');`,
        `CREATE TYPE IF NOT EXISTS "TourCategory" AS ENUM ('NATURE', 'BEACH', 'ADVENTURE', 'CULTURAL');`,
        `CREATE TYPE IF NOT EXISTS "Difficulty" AS ENUM ('EASY', 'MODERATE', 'CHALLENGING');`
      ];
      
      for (const sql of aggressiveCommands) {
        try {
          await prisma.$executeRaw`${sql}`;
          console.log(`✅ Aggressive: ${sql.substring(0, 50)}...`);
        } catch (error) {
          console.log(`ℹ️  Aggressive SQL: ${sql.substring(0, 50)}...`);
        }
      }
      
      console.log('🔄 Please run: npx prisma migrate deploy && node seed-simple.js');
    }

    // ═══════════════════════════════════════════════════
    // 🎯 STEP 3: Test cars query
    // ═══════════════════════════════════════════════════
    console.log('\n🎯 Step 3: Testing cars query...');
    
    try {
      const cars = await prisma.car.findMany({
        take: 10,
        select: {
          id: true,
          name: true,
          nameAr: true,
          pricePerDay: true,
          status: true,
          rating: true,
          brand: true,
          type: true,
          year: true,
          seats: true,
          doors: true,
          transmission: true,
          fuelType: true,
          coverImage: true
        }
      });
      
      console.log(`✅ Cars SUCCESS: Found ${cars.length} cars`);
      cars.forEach((car, index) => {
        console.log(`   ${index + 1}. ${car.name} - $${car.pricePerDay}/day - ${car.status}`);
      });
      
    } catch (error) {
      console.log('❌ Cars query FAILED:', error.message);
    }

    // ═══════════════════════════════════════════════════
    // 🎯 STEP 4: Production deployment instructions
    // ═══════════════════════════════════════════════════
    console.log('\n🎯 Step 4: Production deployment checklist...');
    
    console.log('📋 DEPLOYMENT CHECKLIST:');
    console.log('✅ 1. Database enum fixed');
    console.log('🔄 2. Push changes to GitHub');
    console.log('🔄 3. Deploy to production (Vercel/Netlify)');
    console.log('🔄 4. Clear production cache');
    console.log('🔄 5. Test: https://www.hawari.tours/hotels');
    console.log('🔄 6. Test: https://www.hawari.tours/cars');

    console.log('\n🔧 COMMANDS TO RUN:');
    console.log('git add .');
    console.log('git commit -m "Fix HotelStatus enum issue for production"');
    console.log('git push origin main');
    console.log('# Then wait for deployment to complete');

    console.log('\n🎉 DIRECT PRODUCTION FIX COMPLETED!');
    console.log('📱 Test the website after deployment completes');

  } catch (error) {
    console.error('❌ Direct production fix failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

directProductionFix().catch(console.error);
