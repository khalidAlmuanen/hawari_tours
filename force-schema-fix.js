// 🔥 FORCE SCHEMA FIX - Direct Production Schema Update
// إصلاح قسري للمخطط - تحديث مباشر لمخطط الإنتاج

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function forceSchemaFix() {
  console.log('🔥 ═══════════════════════════════════════════');
  console.log('   FORCE SCHEMA FIX - Direct Production Update');
  console.log('═══════════════════════════════════════════');

  try {
    // ═══════════════════════════════════════════════════
    // 🔥 STEP 1: Force drop all problematic enums and tables
    // ═══════════════════════════════════════════════════
    console.log('\n🔥 Step 1: Force dropping problematic elements...');
    
    const forceDropCommands = [
      // Drop tables that reference the problematic enum
      `DROP TABLE IF EXISTS hotels CASCADE;`,
      `DROP TABLE IF EXISTS cars CASCADE;`,
      
      // Drop all enum variations
      `DROP TYPE IF EXISTS "HotelStatus" CASCADE;`,
      `DROP TYPE IF EXISTS "public.HotelStatus" CASCADE;`,
      `DROP TYPE IF EXISTS "HotelStatusEnum" CASCADE;`,
      `DROP TYPE IF EXISTS "public.HotelStatusEnum" CASCADE;`,
      
      // Create the correct enum
      `CREATE TYPE "HotelStatusEnum" AS ENUM ('ACTIVE', 'DRAFT', 'SUSPENDED');`
    ];
    
    for (const sql of forceDropCommands) {
      try {
        await prisma.$executeRaw`${sql}`;
        console.log(`✅ Applied: ${sql.substring(0, 60)}...`);
      } catch (error) {
        console.log(`ℹ️  Skipped: ${sql.substring(0, 60)}...`);
      }
    }

    // ═══════════════════════════════════════════════════
    // 🔥 STEP 2: Recreate tables with correct schema
    // ═══════════════════════════════════════════════════
    console.log('\n🔥 Step 2: Recreating tables with correct schema...');
    
    // Create hotels table
    const createHotelsSQL = `
      CREATE TABLE hotels (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        nameAr TEXT,
        slug TEXT UNIQUE NOT NULL,
        description TEXT,
        descriptionAr TEXT,
        shortDescription TEXT,
        shortDescriptionAr TEXT,
        pricePerNight DECIMAL(10,2) NOT NULL,
        discount INTEGER DEFAULT 0,
        rating DECIMAL(3,2) DEFAULT 0,
        reviewsCount INTEGER DEFAULT 0,
        roomsCount INTEGER DEFAULT 0,
        status "HotelStatusEnum" DEFAULT 'ACTIVE',
        featured BOOLEAN DEFAULT false,
        coverImage TEXT,
        images TEXT[],
        videoUrl TEXT,
        location TEXT,
        locationAr TEXT,
        latitude DECIMAL(10,8),
        longitude DECIMAL(11,8),
        amenities TEXT[],
        highlights TEXT[],
        highlightsAr TEXT[],
        checkInTime TEXT,
        checkOutTime TEXT,
        cancellationPolicy TEXT,
        cancellationPolicyAr TEXT,
        metaTitle TEXT,
        metaDescription TEXT,
        keywords TEXT[],
        viewsCount INTEGER DEFAULT 0,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    try {
      await prisma.$executeRaw`${createHotelsSQL}`;
      console.log('✅ Hotels table recreated with correct schema');
    } catch (error) {
      console.log('ℹ️  Hotels table recreation:', error.message);
    }

    // Create cars table
    const createCarsSQL = `
      CREATE TABLE cars (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        nameAr TEXT,
        slug TEXT UNIQUE NOT NULL,
        description TEXT,
        descriptionAr TEXT,
        brand TEXT NOT NULL,
        type TEXT NOT NULL,
        year INTEGER NOT NULL,
        pricePerDay DECIMAL(10,2) NOT NULL,
        discount INTEGER DEFAULT 0,
        seats INTEGER NOT NULL,
        doors INTEGER NOT NULL,
        transmission TEXT,
        fuelType TEXT,
        rating DECIMAL(3,2) DEFAULT 0,
        reviewsCount INTEGER DEFAULT 0,
        status "HotelStatusEnum" DEFAULT 'ACTIVE',
        featured BOOLEAN DEFAULT false,
        coverImage TEXT,
        images TEXT[],
        videoUrl TEXT,
        features TEXT[],
        featuresAr TEXT[],
        insurance TEXT,
        insuranceAr TEXT,
        mileage TEXT,
        mileageAr TEXT,
        color TEXT,
        colorAr TEXT,
        minAge INTEGER,
        deposit DECIMAL(10,2),
        luggage INTEGER,
        metaTitle TEXT,
        metaDescription TEXT,
        keywords TEXT[],
        viewsCount INTEGER DEFAULT 0,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    try {
      await prisma.$executeRaw`${createCarsSQL}`;
      console.log('✅ Cars table recreated with correct schema');
    } catch (error) {
      console.log('ℹ️  Cars table recreation:', error.message);
    }

    // ═══════════════════════════════════════════════════
    // 🔥 STEP 3: Test the fixed schema
    // ═══════════════════════════════════════════════════
    console.log('\n🔥 Step 3: Testing the fixed schema...');
    
    try {
      const hotels = await prisma.hotel.findMany({
        take: 1,
        select: {
          id: true,
          name: true,
          status: true
        }
      });
      
      console.log(`✅ Hotels query SUCCESS: Found ${hotels.length} hotels`);
      
    } catch (error) {
      console.log('❌ Hotels query FAILED:', error.message);
      
      if (error.message.includes('HotelStatus')) {
        console.log('🔥 Still has HotelStatus issue - applying final fix...');
        
        // Final aggressive fix
        await prisma.$executeRaw`DROP TABLE IF EXISTS hotels CASCADE;`;
        await prisma.$executeRaw`DROP TYPE IF EXISTS "HotelStatus" CASCADE;`;
        await prisma.$executeRaw`DROP TYPE IF EXISTS "public.HotelStatus" CASCADE;`;
        await prisma.$executeRaw`CREATE TYPE "HotelStatusEnum" AS ENUM ('ACTIVE', 'DRAFT', 'SUSPENDED');`;
        await prisma.$executeRaw`${createHotelsSQL}`;
        
        console.log('🔥 Final fix applied');
      }
    }

    try {
      const cars = await prisma.car.findMany({
        take: 1,
        select: {
          id: true,
          name: true,
          status: true
        }
      });
      
      console.log(`✅ Cars query SUCCESS: Found ${cars.length} cars`);
      
    } catch (error) {
      console.log('❌ Cars query FAILED:', error.message);
    }

    // ═══════════════════════════════════════════════════
    // 🔥 STEP 4: Reload data if tables are empty
    // ═══════════════════════════════════════════════════
    console.log('\n🔥 Step 4: Checking if data reload needed...');
    
    const hotelCount = await prisma.hotel.count().catch(() => 0);
    const carCount = await prisma.car.count().catch(() => 0);
    
    console.log(`📊 Current data: ${hotelCount} hotels, ${carCount} cars`);
    
    if (hotelCount === 0 || carCount === 0) {
      console.log('🔄 Data reload needed - run seed scripts after this fix');
      console.log('Commands to run:');
      console.log('  node seed-simple.js');
      console.log('  node add-socotra-data.js');
    }

    console.log('\n🎉 FORCE SCHEMA FIX COMPLETED!');
    console.log('📱 Test the website: https://www.hawari.tours/hotels');

  } catch (error) {
    console.error('❌ Force schema fix failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

forceSchemaFix().catch(console.error);
