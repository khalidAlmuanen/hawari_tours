const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
    const cars = await prisma.car.findMany({
        select: { id: true, nameAr: true, slug: true, status: true }
    })
    console.table(cars)
}
main().finally(() => prisma.$disconnect())
