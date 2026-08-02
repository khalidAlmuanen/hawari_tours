// Test database connection
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('Testing database connection...');
    
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Database connection successful');
    
    // Test a simple query
    const userCount = await prisma.user.count();
    console.log(`✅ Found ${userCount} users in database`);
    
    // Test if tables exist
    const tables = [
      { name: 'users', model: prisma.user },
      { name: 'tours', model: prisma.tour },
      { name: 'hotels', model: prisma.hotel },
      { name: 'cars', model: prisma.car },
      { name: 'bookings', model: prisma.booking }
    ];
    for (const table of tables) {
      try {
        const count = await table.model.count();
        console.log(`✅ Table '${table.name}' exists with ${count} records`);
      } catch (err) {
        console.log(`❌ Table '${table.name}' error: ${err.message}`);
      }
    }
    
  } catch (error) {
    console.error('❌ Database connection failed:', error);
    console.error('Error details:', error.message);
    
    if (error.code === 'P1001') {
      console.log('\n🔧 Troubleshooting tips:');
      console.log('1. Check if DATABASE_URL is correct in .env file');
      console.log('2. Verify Supabase project is active');
      console.log('3. Check if database password is correct');
      console.log('4. Ensure Supabase allows connections from your IP');
    }
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
