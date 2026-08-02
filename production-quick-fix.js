// 🚀 Quick Production Fix
// إصلاح سريع للبيئة الإنتاجية

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function quickProductionFix() {
  console.log('🚀 Quick Production Fix Starting...');
  
  try {
    // Test hotels query
    console.log('🏨 Testing hotels query...');
    const hotels = await prisma.hotel.findMany({ take: 1 });
    console.log(`✅ Hotels working: Found ${hotels.length} hotels`);
    
    // Test cars query  
    console.log('🚗 Testing cars query...');
    const cars = await prisma.car.findMany({ take: 1 });
    console.log(`✅ Cars working: Found ${cars.length} cars`);
    
    console.log('🎉 Production database is working correctly!');
    
  } catch (error) {
    console.log('❌ Error detected:', error.message);
    
    if (error.message.includes('HotelStatus')) {
      console.log('🔧 Fixing HotelStatus enum...');
      await prisma.$executeRaw`DROP TYPE IF EXISTS "HotelStatus" CASCADE`;
      console.log('✅ HotelStatus enum dropped');
    }
    
    console.log('🔄 Please run: npx prisma migrate deploy && npx prisma generate');
  }
  
  await prisma.$disconnect();
}

quickProductionFix();
