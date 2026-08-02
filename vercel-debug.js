// 🔍 Vercel Production Debug Script
// This script helps identify why production APIs fail while localhost works

console.log('🔍 Vercel Debug - Checking Environment Variables');
console.log('===========================================');

// Check critical environment variables
const criticalVars = [
  'DATABASE_URL',
  'DIRECT_URL', 
  'NODE_ENV',
  'JWT_SECRET',
  'NEXT_PUBLIC_API_URL'
];

criticalVars.forEach(varName => {
  const value = process.env[varName];
  if (value) {
    // Mask sensitive parts for logging
    const masked = varName.includes('DATABASE') 
      ? value.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@')
      : value;
    console.log(`✅ ${varName}: ${masked}`);
  } else {
    console.log(`❌ ${varName}: NOT SET`);
  }
});

console.log('\n🔍 Database Connection Test');
console.log('============================');

// Test database connection
const { PrismaClient } = require('@prisma/client');

async function testProductionDB() {
  let prisma;
  try {
    console.log('📡 Creating Prisma client with production config...');
    
    prisma = new PrismaClient({
      log: ['error', 'warn', 'info'],
      datasources: {
        db: {
          url: process.env.DATABASE_URL
        }
      }
    });

    console.log('🔌 Testing database connection...');
    await prisma.$connect();
    console.log('✅ Database connection successful');

    // Test specific tables that are failing
    console.log('🏨 Testing hotels table...');
    const hotelCount = await prisma.hotel.count();
    console.log(`✅ Found ${hotelCount} hotels`);

    console.log('🚗 Testing cars table...');
    const carCount = await prisma.car.count();
    console.log(`✅ Found ${carCount} cars`);

    // Test the actual queries that are failing
    console.log('🔍 Testing actual API queries...');
    
    const hotels = await prisma.hotel.findMany({
      select: {
        id: true,
        name: true,
        nameAr: true,
        status: true
      },
      take: 3
    });
    console.log('✅ Hotels query successful:', hotels.map(h => h.name));

    const cars = await prisma.car.findMany({
      select: {
        id: true,
        name: true,
        nameAr: true,
        status: true
      },
      take: 3
    });
    console.log('✅ Cars query successful:', cars.map(c => c.name));

  } catch (error) {
    console.error('❌ Database test failed:');
    console.error('Error Code:', error.code);
    console.error('Error Message:', error.message);
    console.error('Full Error:', error);
    
    // Specific error analysis
    if (error.message.includes('HotelStatus')) {
      console.error('\n🎯 DIAGNOSIS: HotelStatusEnum issue detected');
      console.error('💡 SOLUTION: Run prisma migrate deploy or prisma db push');
    }
    
    if (error.message.includes('connection') || error.code === 'P1001') {
      console.error('\n🎯 DIAGNOSIS: Database connection issue');
      console.error('💡 SOLUTION: Check DATABASE_URL in Vercel env vars');
    }
    
    if (error.message.includes('timeout') || error.code === 'P1008') {
      console.error('\n🎯 DIAGNOSIS: Database timeout');
      console.error('💡 SOLUTION: Add pgbouncer=true to DATABASE_URL');
    }
    
  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
  }
}

testProductionDB().catch(console.error);
