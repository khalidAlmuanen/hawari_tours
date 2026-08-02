import { PrismaClient } from '@prisma/client'

const p = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  }
})

try {
  // Test raw query to check what enums exist
  const result = await p.$queryRaw`
    SELECT typname, nspname 
    FROM pg_type t 
    JOIN pg_namespace n ON n.oid = t.typnamespace 
    WHERE typtype = 'e'
    ORDER BY typname;
  `
  console.log('Existing enums:', JSON.stringify(result, null, 2))
  
} catch (e) {
  console.error('Error:', e.message)
} finally {
  await p.$disconnect()
}
