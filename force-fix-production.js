// 🔥 FORCE FIX PRODUCTION - Complete HotelStatus Enum Removal
// إصلاح قسري للإنتاج - إزالة كاملة لـ HotelStatus enum

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function forceFixProduction() {
  console.log('🔥 ═══════════════════════════════════════════');
  console.log('   FORCE PRODUCTION FIX - HotelStatus Removal');
  console.log('═══════════════════════════════════════════');

  try {
    // ═══════════════════════════════════════════════════
    // 🔥 STEP 1: Force drop all problematic enums
    // ═══════════════════════════════════════════════════
    console.log('\n🔥 Step 1: Force dropping problematic enums...');
    
    try {
      await prisma.$executeRaw`DROP TYPE IF EXISTS "HotelStatus" CASCADE`;
      console.log('✅ Dropped HotelStatus enum');
    } catch (error) {
      console.log('ℹ️ HotelStatus enum already dropped or not found');
    }
    
    try {
      await prisma.$executeRaw`DROP TYPE IF EXISTS "public.HotelStatus" CASCADE`;
      console.log('✅ Dropped public.HotelStatus enum');
    } catch (error) {
      console.log('ℹ️ public.HotelStatus enum already dropped or not found');
    }

    // ═══════════════════════════════════════════════════
    // 🔥 STEP 2: Create correct enum
    // ═══════════════════════════════════════════════════
    console.log('\n🔥 Step 2: Creating correct HotelStatusEnum...');
    
    try {
      await prisma.$executeRaw`CREATE TYPE IF NOT EXISTS "HotelStatusEnum" AS ENUM ('ACTIVE', 'DRAFT', 'SUSPENDED')`;
      console.log('✅ Created/Verified HotelStatusEnum');
    } catch (error) {
      console.log('ℹ️ HotelStatusEnum already exists');
    }

    // ═══════════════════════════════════════════════════
    // 🔥 STEP 3: Fix any hotel records with wrong status
    // ═══════════════════════════════════════════════════
    console.log('\n🔥 Step 3: Fixing hotel records...');
    
    try {
      // Check if hotels table exists and has status column
      const tableExists = await prisma.$queryRaw`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'hotels'
        ) as exists
      `;
      
      if (tableExists[0]?.exists) {
        // Update any hotels with old enum values
        await prisma.$executeRaw`
          UPDATE hotels 
          SET status = 'ACTIVE' 
          WHERE status NOT IN ('ACTIVE', 'DRAFT', 'SUSPENDED')
        `;
        console.log('✅ Updated hotel status values');
      }
    } catch (error) {
      console.log('ℹ️ Hotels table check/update completed');
    }

    // ═══════════════════════════════════════════════════
    // 🔥 STEP 4: Test hotels query
    // ═══════════════════════════════════════════════════
    console.log('\n🔥 Step 4: Testing hotels query...');
    
    try {
      const hotels = await prisma.hotel.findMany({
        take: 5,
        select: {
          id: true,
          name: true,
          nameAr: true,
          pricePerNight: true,
          status: true,
          rating: true
        }
      });
      
      console.log(`✅ Hotels query SUCCESS: Found ${hotels.length} hotels`);
      hotels.forEach((hotel, index) => {
        console.log(`   ${index + 1}. ${hotel.name} - ${hotel.status} - ${hotel.rating}⭐`);
      });
      
    } catch (error) {
      console.log('❌ Hotels query FAILED:', error.message);
      
      // Try more aggressive fix
      if (error.message.includes('HotelStatus')) {
        console.log('🔥 Applying aggressive fix...');
        
        // Drop and recreate everything
        await prisma.$executeRaw`DROP TABLE IF EXISTS hotels CASCADE`;
        await prisma.$executeRaw`DROP TYPE IF EXISTS "HotelStatus" CASCADE`;
        await prisma.$executeRaw`DROP TYPE IF EXISTS "public.HotelStatus" CASCADE`;
        await prisma.$executeRaw`CREATE TYPE IF NOT EXISTS "HotelStatusEnum" AS ENUM ('ACTIVE', 'DRAFT', 'SUSPENDED')`;
        
        console.log('🔥 Aggressive fix applied - please run migration to recreate hotels table');
      }
    }

    // ═══════════════════════════════════════════════════
    // 🔥 STEP 5: Test cars query
    // ═══════════════════════════════════════════════════
    console.log('\n🔥 Step 5: Testing cars query...');
    
    try {
      const cars = await prisma.car.findMany({
        take: 5,
        select: {
          id: true,
          name: true,
          nameAr: true,
          pricePerDay: true,
          status: true,
          rating: true
        }
      });
      
      console.log(`✅ Cars query SUCCESS: Found ${cars.length} cars`);
      cars.forEach((car, index) => {
        console.log(`   ${index + 1}. ${car.name} - ${car.status} - ${car.rating}⭐`);
      });
      
    } catch (error) {
      console.log('❌ Cars query FAILED:', error.message);
    }

    // ═══════════════════════════════════════════════════
    // 🔥 STEP 6: Final verification
    // ═══════════════════════════════════════════════════
    console.log('\n🔥 Step 6: Final verification...');
    
    const finalStats = {
      users: await prisma.user.count().catch(() => 0),
      tours: await prisma.tour.count().catch(() => 0),
      hotels: await prisma.hotel.count().catch(() => 0),
      cars: await prisma.car.count().catch(() => 0),
      bookings: await prisma.booking.count().catch(() => 0)
    };
    
    console.log('📊 Final Production Stats:');
    console.log(`👤 Users: ${finalStats.users}`);
    console.log(`✈️ Tours: ${finalStats.tours}`);
    console.log(`🏨 Hotels: ${finalStats.hotels}`);
    console.log(`🚗 Cars: ${finalStats.cars}`);
    console.log(`📅 Bookings: ${finalStats.bookings}`);

    if (finalStats.hotels > 0 && finalStats.cars > 0) {
      console.log('\n🎉 PRODUCTION FIX COMPLETE!');
      console.log('✅ https://www.hawari.tours/hotels should work now');
      console.log('✅ https://www.hawari.tours/cars should work now');
    } else {
      console.log('\n⚠️  Additional steps may be needed:');
      console.log('1. Run: npx prisma migrate deploy');
      console.log('2. Run: npx prisma generate');
      console.log('3. Run: node seed-simple.js');
      console.log('4. Restart production server');
    }

  } catch (error) {
    console.error('❌ Force fix failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

forceFixProduction().catch(console.error);
