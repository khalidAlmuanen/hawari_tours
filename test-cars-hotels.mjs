import { PrismaClient } from '@prisma/client'

const p = new PrismaClient()

try {
  const carsCount = await p.car.count()
  console.log('Cars count:', carsCount)
  
  const hotelsCount = await p.hotel.count()
  console.log('Hotels count:', hotelsCount)
  
  const activeCars = await p.car.count({ where: { status: 'ACTIVE' } })
  console.log('Active Cars:', activeCars)
  
  const activeHotels = await p.hotel.count({ where: { status: 'ACTIVE' } })
  console.log('Active Hotels:', activeHotels)
  
  // Get sample car
  const car = await p.car.findFirst()
  console.log('Sample car:', JSON.stringify(car, null, 2))
  
  // Get sample hotel
  const hotel = await p.hotel.findFirst()
  console.log('Sample hotel:', JSON.stringify(hotel, null, 2))
  
} catch (e) {
  console.error('Error:', e.message)
  console.error('Code:', e.code)
} finally {
  await p.$disconnect()
}
