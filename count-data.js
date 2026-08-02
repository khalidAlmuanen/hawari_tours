const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const hotelsCount = await prisma.hotel.count();
  const carsCount = await prisma.car.count();
  console.log(`Hotels: ${hotelsCount}, Cars: ${carsCount}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
