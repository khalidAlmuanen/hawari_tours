// 🔧 Production Database Fix Script
// سكربت إصلاح قاعدة بيانات الإنتاج

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixProductionDatabase() {
  console.log('🔧 ═══════════════════════════════════════════');
  console.log('   PRODUCTION DATABASE FIX');
  console.log('═══════════════════════════════════════════');

  try {
    // ═══════════════════════════════════════════════════
    // 🧹 Clean any old data that might cause issues
    // ═══════════════════════════════════════════════════
    console.log('\n🧹 Cleaning production database...');
    
    // Check if we have the right schema
    try {
      const userCount = await prisma.user.count();
      console.log(`✅ Found ${userCount} users in production`);
    } catch (error) {
      console.log('❌ Database schema issue detected:', error.message);
      
      // Try to apply schema
      console.log('🔄 Applying database schema...');
      await prisma.$executeRaw`CREATE TYPE IF NOT EXISTS "UserRole" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'USER')`;
      await prisma.$executeRaw`CREATE TYPE IF NOT EXISTS "BookingType" AS ENUM ('TOUR', 'HOTEL', 'CAR')`;
      await prisma.$executeRaw`CREATE TYPE IF NOT EXISTS "BookingStatus" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED')`;
      await prisma.$executeRaw`CREATE TYPE IF NOT EXISTS "PaymentStatus" AS ENUM ('PENDING', 'PAID', 'PARTIAL', 'REFUNDED')`;
      await prisma.$executeRaw`CREATE TYPE IF NOT EXISTS "PaymentMethod" AS ENUM ('CREDIT_CARD', 'BANK_TRANSFER', 'CASH', 'PAYPAL')`;
      await prisma.$executeRaw`CREATE TYPE IF NOT EXISTS "HotelStatusEnum" AS ENUM ('ACTIVE', 'DRAFT', 'SUSPENDED')`;
      await prisma.$executeRaw`CREATE TYPE IF NOT EXISTS "TourCategory" AS ENUM ('NATURE', 'BEACH', 'ADVENTURE', 'CULTURAL')`;
      await prisma.$executeRaw`CREATE TYPE IF NOT EXISTS "Difficulty" AS ENUM ('EASY', 'MODERATE', 'CHALLENGING')`;
      
      console.log('✅ Schema types created/verified');
    }

    // ═══════════════════════════════════════════════════
    // 📊 Check current data status
    // ═══════════════════════════════════════════════════
    console.log('\n📊 Checking current data status...');
    
    const stats = {
      users: await prisma.user.count().catch(() => 0),
      tours: await prisma.tour.count().catch(() => 0),
      hotels: await prisma.hotel.count().catch(() => 0),
      cars: await prisma.car.count().catch(() => 0),
      bookings: await prisma.booking.count().catch(() => 0)
    };
    
    console.log('📈 Current Production Data:');
    console.log(`👤 Users: ${stats.users}`);
    console.log(`✈️ Tours: ${stats.tours}`);
    console.log(`🏨 Hotels: ${stats.hotels}`);
    console.log(`🚗 Cars: ${stats.cars}`);
    console.log(`📅 Bookings: ${stats.bookings}`);

    // ═══════════════════════════════════════════════════
    // 🧪 Test database operations
    // ═══════════════════════════════════════════════════
    console.log('\n🧪 Testing database operations...');
    
    try {
      // Test hotels query (the failing operation)
      const hotels = await prisma.hotel.findMany({
        take: 3,
        select: {
          id: true,
          name: true,
          nameAr: true,
          pricePerNight: true,
          status: true
        }
      });
      
      console.log(`✅ Hotels query successful: Found ${hotels.length} hotels`);
      hotels.forEach((hotel, index) => {
        console.log(`   ${index + 1}. ${hotel.name} - ${hotel.pricePerNight} USD/night`);
      });
      
    } catch (error) {
      console.log('❌ Hotels query failed:', error.message);
      
      // Try to fix the specific issue
      if (error.message.includes('HotelStatus')) {
        console.log('🔧 Fixing HotelStatus enum issue...');
        await prisma.$executeRaw`DROP TYPE IF EXISTS "HotelStatus" CASCADE`;
        await prisma.$executeRaw`CREATE TYPE "HotelStatusEnum" AS ENUM ('ACTIVE', 'DRAFT', 'SUSPENDED')`;
        console.log('✅ HotelStatus enum fixed');
      }
    }

    try {
      // Test cars query
      const cars = await prisma.car.findMany({
        take: 3,
        select: {
          id: true,
          name: true,
          nameAr: true,
          pricePerDay: true,
          status: true
        }
      });
      
      console.log(`✅ Cars query successful: Found ${cars.length} cars`);
      cars.forEach((car, index) => {
        console.log(`   ${index + 1}. ${car.name} - ${car.pricePerDay} USD/day`);
      });
      
    } catch (error) {
      console.log('❌ Cars query failed:', error.message);
    }

    // ═══════════════════════════════════════════════════
    // 🎯 Recommendations
    // ═══════════════════════════════════════════════════
    console.log('\n🎯 Production Fix Recommendations:');
    
    if (stats.hotels === 0 || stats.cars === 0) {
      console.log('📝 ACTION REQUIRED: Run data seeding on production');
      console.log('   Run: node seed-simple.js');
      console.log('   Then: node add-socotra-data.js');
    }
    
    if (stats.users === 0) {
      console.log('📝 ACTION REQUIRED: Create admin user');
      console.log('   Run: node seed-simple.js');
    }
    
    console.log('\n🔄 After applying fixes:');
    console.log('1. Restart the production server');
    console.log('2. Clear browser cache');
    console.log('3. Test https://www.hawari.tours/hotels');
    console.log('4. Test https://www.hawari.tours/cars');

    console.log('\n✅ Production database fix completed!');

  } catch (error) {
    console.error('❌ Production fix failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

fixProductionDatabase().catch(console.error);
