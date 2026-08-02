const { PrismaClient } = require('@prisma/client');

async function testDatabaseQueries() {
  const prisma = new PrismaClient();
  
  try {
    console.log('Testing hotel query...');
    const hotels = await prisma.hotel.findMany({
      select: { id: true, name: true, status: true }
    });
    console.log(`✅ Found ${hotels.length} hotels`);
    
    console.log('Testing car query...');
    const cars = await prisma.car.findMany({
      select: { id: true, name: true, status: true }
    });
    console.log(`✅ Found ${cars.length} cars`);
    
  } catch (error) {
    console.error('❌ Database query error:', error.message);
    console.error('Full error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testDatabaseQueries();
