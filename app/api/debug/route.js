import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export async function GET() {
  const debug = {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: {
      url_set: !!process.env.DATABASE_URL,
      direct_url_set: !!process.env.DIRECT_URL,
      url_preview: process.env.DATABASE_URL ? 
        process.env.DATABASE_URL.replace(/\/\/([^:]+):([^@]+)@/, '//***:***@').substring(0, 100) + '...' : 
        'NOT_SET'
    },
    tests: {}
  }

  try {
    // Test database connection
    await prisma.$connect()
    debug.tests.connection = '✅ Connected'
    
    // Test hotels
    const hotelCount = await prisma.hotel.count()
    debug.tests.hotels_count = hotelCount
    debug.tests.hotels_query = '✅ Success'
    
    // Test cars
    const carCount = await prisma.car.count()
    debug.tests.cars_count = carCount
    debug.tests.cars_query = '✅ Success'
    
    // Test actual data
    const sampleHotel = await prisma.hotel.findFirst({
      select: { id: true, name: true, status: true }
    })
    debug.tests.sample_hotel = sampleHotel
    
    const sampleCar = await prisma.car.findFirst({
      select: { id: true, name: true, status: true }
    })
    debug.tests.sample_car = sampleCar
    
  } catch (error) {
    debug.tests.error = {
      message: error.message,
      code: error.code,
      stack: error.stack
    }
  } finally {
    await prisma.$disconnect()
  }

  return NextResponse.json(debug)
}
