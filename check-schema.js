const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const result = await prisma.$queryRaw`
    SELECT column_name, data_type, udt_name 
    FROM information_schema.columns 
    WHERE table_name = 'hotels';
  `;
  console.log(result);
}

main().catch(console.error).finally(() => prisma.$disconnect());
