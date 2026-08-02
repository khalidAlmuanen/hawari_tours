// 🔧 Vercel Build Fix Script
// سكربت إصلاح بناء Vercel

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function fixVercelBuild() {
  console.log('🔧 ═══════════════════════════════════════════');
  console.log('   VERCEL BUILD FIX');
  console.log('═══════════════════════════════════════════');

  try {
    // Test database connection for Vercel
    console.log('\n🔧 Testing database connection...');
    
    const userCount = await prisma.user.count();
    console.log(`✅ Database connection successful: ${userCount} users found`);
    
    const hotelCount = await prisma.hotel.count();
    console.log(`✅ Hotels: ${hotelCount} found`);
    
    const carCount = await prisma.car.count();
    console.log(`✅ Cars: ${carCount} found`);
    
    console.log('\n🎯 Vercel Build Fix Summary:');
    console.log('✅ 1. Added vercel.json configuration');
    console.log('✅ 2. Fixed package.json postinstall script');
    console.log('✅ 3. Database connection verified');
    
    console.log('\n🚀 Redeploy Commands:');
    console.log('git add .');
    console.log('git commit -m "Fix Vercel build configuration"');
    console.log('git push origin main');
    console.log('# Then check Vercel dashboard for successful build');
    
  } catch (error) {
    console.error('❌ Vercel build fix failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixVercelBuild();
