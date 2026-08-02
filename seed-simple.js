// 🌱 Simple Seed Data for Hawari Tours
// بيانات بسيطة ومباشرة لنظام إدارة رحلات الحواري

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedSimpleData() {
  console.log('🌱 ═══════════════════════════════════════════');
  console.log('   HAWARI TOURS - Simple Data Seeding');
  console.log('═══════════════════════════════════════════');

  try {
    // ═══════════════════════════════════════════════════
    // 👤 Users
    // ═══════════════════════════════════════════════════
    console.log('\n👤 Creating users...');
    
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@hawaritours.com',
        name: 'مدير النظام',
        password: await bcrypt.hash('admin123456', 10),
        role: 'SUPER_ADMIN',
        isActive: true,
        emailVerified: true
      }
    });

    const customer1 = await prisma.user.create({
      data: {
        email: 'customer1@example.com',
        name: 'أحمد محمد',
        password: await bcrypt.hash('customer123', 10),
        role: 'USER',
        phone: '+967 771 234 567',
        isActive: true,
        emailVerified: true
      }
    });

    console.log('✅ Created 2 users');

    // ═══════════════════════════════════════════════════
    // ✈️ Tours
    // ═══════════════════════════════════════════════════
    console.log('\n✈️ Creating tours...');
    
    const tour1 = await prisma.tour.create({
      data: {
        title: 'جولة دروبان الساحرة',
        titleAr: 'جولة دروبان الساحرة',
        slug: 'dragon-blood-trees-tour',
        description: 'Explore the mystical Dragon Blood Trees of Socotra, a UNESCO World Heritage site.',
        descriptionAr: 'استكشف أشجار دم التنين الساحرة في سقطرى، موقع تراث عالمي لليونسكو.',
        price: 299.99,
        duration: 3,
        maxPeople: 12,
        difficulty: 'MODERATE',
        category: 'NATURE',
        featured: true,
        isActive: true,
        coverImage: '/img/tours/dragon-blood-trees.jpg',
        images: ['/img/tours/dragon-blood-trees-1.jpg', '/img/tours/dragon-blood-trees-2.jpg'],
        location: 'Homhil Protected Area',
        locationAr: 'منطقة حوميل المحمية',
        latitude: 12.4833,
        longitude: 53.9833,
        includes: ['Airport transfers', '2 nights accommodation', 'Professional guide', 'All meals'],
        excludes: ['International flights', 'Travel insurance', 'Personal expenses'],
        features: ['UNESCO Heritage Site', 'Professional Photography', 'Small Group Size'],
        featuresAr: ['موقع تراث عالمي', 'تصوير احترافي', 'مجموعات صغيرة'],
        metaTitle: 'Dragon Blood Trees Tour - Socotra',
        metaDescription: 'Discover the magical Dragon Blood Trees of Socotra.',
        keywords: ['dragon blood trees', 'socotra', 'unesco'],
        rating: 4.8,
        reviewsCount: 24,
        bookingsCount: 156,
        viewsCount: 892
      }
    });

    const tour2 = await prisma.tour.create({
      data: {
        title: 'Qalansiyah Beach Paradise',
        titleAr: 'جنة شواطئ قلانسيا',
        slug: 'qalansiyah-beach-tour',
        description: 'Relax on pristine white sand beaches and swim in crystal clear waters.',
        descriptionAr: 'استرخ على الشواطئ الرملية البيضاء النقية وسبح في المياه الصافية.',
        price: 199.99,
        duration: 2,
        maxPeople: 15,
        difficulty: 'EASY',
        category: 'BEACH',
        featured: true,
        isActive: true,
        coverImage: '/img/tours/qalansiyah-beach.jpg',
        images: ['/img/tours/qalansiyah-1.jpg', '/img/tours/qalansiyah-2.jpg'],
        location: 'Qalansiyah Village',
        locationAr: 'قرية قلانسيا',
        latitude: 12.1833,
        longitude: 43.4833,
        includes: ['Beach transfers', '1 night accommodation', 'Seafood lunch'],
        excludes: ['Transportation to island', 'Personal expenses'],
        features: ['Pristine Beaches', 'Fresh Seafood', 'Snorkeling'],
        featuresAr: ['شواطئ نقية', 'مأكولات بحرية طازجة', 'غوص'],
        rating: 4.9,
        reviewsCount: 18,
        bookingsCount: 98,
        viewsCount: 654
      }
    });

    console.log('✅ Created 2 tours');

    // ═══════════════════════════════════════════════════
    // 🏨 Hotels
    // ═══════════════════════════════════════════════════
    console.log('\n🏨 Creating hotels...');
    
    const hotel1 = await prisma.hotel.create({
      data: {
        name: 'Socotra Paradise Resort',
        nameAr: 'منتجع سقطرى Paradise',
        slug: 'socotra-paradise-resort',
        description: 'Luxury beachfront resort with stunning ocean views, infinity pool, and spa.',
        descriptionAr: 'منتجع فاخر على شاطئ البحر بإطلالات محيطية مذهلة ومسبح لا نهائي وسبا.',
        pricePerNight: 450.00,
        discount: 10,
        rating: 4.9,
        reviewsCount: 127,
        roomsCount: 45,
        status: 'ACTIVE',
        featured: true,
        coverImage: '/img/hotels/socotra-paradise.jpg',
        images: ['/img/hotels/socotra-paradise-1.jpg', '/img/hotels/socotra-paradise-2.jpg'],
        location: 'Hadibu Beach',
        locationAr: 'شاطئ حديبو',
        latitude: 12.4833,
        longitude: 53.9833,
        amenities: ['Free WiFi', 'Infinity Pool', 'Spa & Wellness', 'Beach Access', 'Restaurant'],
        highlights: ['Ocean View Rooms', 'Private Beach', 'World-Class Spa'],
        highlightsAr: ['غرف بإطلالة على المحيط', 'شاطئ خاص', 'سبا عالمي'],
        checkInTime: '14:00',
        checkOutTime: '12:00',
        cancellationPolicy: 'Free cancellation up to 24 hours before check-in',
        metaTitle: 'Socotra Paradise Resort - Luxury Beach Hotel',
        metaDescription: 'Experience luxury at Socotra\'s premier beachfront resort.',
        keywords: ['luxury resort', 'beach hotel', 'socotra'],
        viewsCount: 2156
      }
    });

    const hotel2 = await prisma.hotel.create({
      data: {
        name: 'Dragon\'s View Boutique Hotel',
        nameAr: 'فندق Dragon\'s View بوتيك',
        slug: 'dragons-view-boutique',
        description: 'Charming boutique hotel with traditional Socotri architecture and modern comforts.',
        descriptionAr: 'فندق بوتيك ساحر بعمارة سقطرية تقليدية وراحة عصرية.',
        pricePerNight: 280.00,
        rating: 4.7,
        reviewsCount: 89,
        roomsCount: 20,
        status: 'ACTIVE',
        featured: true,
        coverImage: '/img/hotels/dragons-view.jpg',
        images: ['/img/hotels/dragons-view-1.jpg'],
        location: 'Near Homhil',
        locationAr: 'بالقرب من حوميل',
        latitude: 12.4533,
        longitude: 53.9533,
        amenities: ['Free WiFi', 'Traditional Restaurant', 'Garden', 'Library'],
        highlights: ['Traditional Architecture', 'Dragon Trees View', 'Cultural Experience'],
        highlightsAr: ['عمارة تقليدية', 'إطلالة أشجار التنين', 'تجربة ثقافية'],
        checkInTime: '15:00',
        checkOutTime: '11:00',
        metaTitle: 'Dragon\'s View Boutique Hotel - Traditional Socotri Experience',
        keywords: ['boutique hotel', 'traditional', 'socotri culture'],
        viewsCount: 1234
      }
    });

    console.log('✅ Created 2 hotels');

    // ═══════════════════════════════════════════════════
    // 🚗 Cars
    // ═══════════════════════════════════════════════════
    console.log('\n🚗 Creating cars...');
    
    const car1 = await prisma.car.create({
      data: {
        name: 'Toyota Land Cruiser 4x4',
        nameAr: 'تويوتا لاند كروزر 4x4',
        slug: 'toyota-land-cruiser-4x4',
        description: 'Premium 4x4 vehicle perfect for Socotra\'s rugged terrain.',
        descriptionAr: 'مركبة 4x4 فاخرة مثالية للتضاريس الوعرة في سقطرى.',
        brand: 'Toyota',
        type: 'SUV',
        year: 2023,
        pricePerDay: 150.00,
        discount: 10,
        seats: 7,
        doors: 5,
        transmission: 'Automatic',
        fuelType: 'Petrol',
        rating: 4.8,
        reviewsCount: 45,
        status: 'ACTIVE',
        featured: true,
        coverImage: '/img/cars/land-cruiser.jpg',
        images: ['/img/cars/land-cruiser-1.jpg', '/img/cars/land-cruiser-2.jpg'],
        features: ['4WD System', 'Climate Control', 'Leather Seats', 'GPS Navigation'],
        featuresAr: ['نظام دفع رباعي', 'تحكم في المناخ', 'مقاعد جلد', 'ملاحة GPS'],
        insurance: 'Comprehensive',
        insuranceAr: 'شامل',
        mileage: 'Unlimited',
        mileageAr: 'غير محدود',
        color: 'Pearl White',
        colorAr: 'أبيض لؤلؤي',
        minAge: 25,
        deposit: 500.00,
        luggage: 4,
        metaTitle: 'Toyota Land Cruiser 4x4 Rental - Socotra',
        metaDescription: 'Rent a premium 4x4 Land Cruiser for exploring Socotra\'s rugged terrain.',
        keywords: ['toyota', 'land cruiser', '4x4', 'suv rental'],
        viewsCount: 1567
      }
    });

    const car2 = await prisma.car.create({
      data: {
        name: 'Nissan Patrol Safari',
        nameAr: 'نيسان باترول سفاري',
        slug: 'nissan-patrol-safari',
        description: 'Powerful and reliable 4x4 ideal for off-road adventures.',
        descriptionAr: '4x4 قوي وموثوق مثالي للمغامرات خارج الطريق.',
        brand: 'Nissan',
        type: '4x4',
        year: 2022,
        pricePerDay: 130.00,
        seats: 8,
        doors: 5,
        transmission: 'Manual',
        fuelType: 'Petrol',
        rating: 4.6,
        reviewsCount: 32,
        status: 'ACTIVE',
        featured: true,
        coverImage: '/img/cars/patrol-safari.jpg',
        images: ['/img/cars/patrol-1.jpg'],
        features: ['4WD Capability', 'High Ground Clearance', 'Spacious Interior'],
        featuresAr: ['قدرة دفع رباعي', 'ارض واضح عالي', 'داخل فسيح'],
        insurance: 'Basic',
        insuranceAr: 'أساسي',
        mileage: '300km/day',
        mileageAr: '300 كم/يوم',
        color: 'Desert Sand',
        colorAr: 'رمل صحراوي',
        minAge: 21,
        deposit: 300.00,
        luggage: 6,
        viewsCount: 923
      }
    });

    console.log('✅ Created 2 cars');

    // ═══════════════════════════════════════════════════
    // 📅 Tour Dates
    // ═══════════════════════════════════════════════════
    console.log('\n📅 Creating tour dates...');
    
    // Add dates for Tour 1
    const tourDates1 = [];
    for (let i = 0; i < 3; i++) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + (i * 7) + 3);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 3);
      
      tourDates1.push({
        tourId: tour1.id,
        startDate,
        endDate,
        availableSpots: Math.floor(Math.random() * 8) + 4,
        price: tour1.price * (1 - (Math.random() * 0.1)),
        isActive: true
      });
    }
    
    await prisma.tourDate.createMany({ data: tourDates1 });

    // Add dates for Tour 2
    const tourDates2 = [];
    for (let i = 0; i < 2; i++) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + (i * 5) + 2);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 2);
      
      tourDates2.push({
        tourId: tour2.id,
        startDate,
        endDate,
        availableSpots: Math.floor(Math.random() * 10) + 5,
        price: tour2.price * (1 - (Math.random() * 0.15)),
        isActive: true
      });
    }
    
    await prisma.tourDate.createMany({ data: tourDates2 });

    console.log(`✅ Created ${tourDates1.length + tourDates2.length} tour dates`);

    // ═══════════════════════════════════════════════════
    // 📅 Sample Booking
    // ═══════════════════════════════════════════════════
    console.log('\n📅 Creating sample booking...');
    
    const booking1 = await prisma.booking.create({
      data: {
        bookingNumber: 'HT-TOUR-2024-001',
        userId: customer1.id,
        tourId: tour1.id,
        bookingType: 'TOUR',
        startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        numberOfPeople: 2,
        totalPrice: tour1.price * 2,
        paidAmount: tour1.price * 2,
        status: 'CONFIRMED',
        paymentStatus: 'PAID',
        paymentMethod: 'CREDIT_CARD',
        customerName: 'أحمد محمد',
        customerEmail: 'customer1@example.com',
        customerPhone: '+967 771 234 567',
        confirmedAt: new Date()
      }
    });

    console.log('✅ Created 1 sample booking');

    // ═══════════════════════════════════════════════════
    // 💳 Sample Payment
    // ═══════════════════════════════════════════════════
    console.log('\n💳 Creating sample payment...');
    
    const payment1 = await prisma.payment.create({
      data: {
        bookingId: booking1.id,
        amount: booking1.totalPrice,
        method: 'CREDIT_CARD',
        status: 'PAID',
        transactionId: 'txn_tour_001',
        notes: 'Full payment for Dragon Blood Trees tour'
      }
    });

    console.log('✅ Created 1 sample payment');

    // ═══════════════════════════════════════════════════
    // ⭐ Sample Review
    // ═══════════════════════════════════════════════════
    console.log('\n⭐ Creating sample review...');
    
    const review1 = await prisma.review.create({
      data: {
        userId: customer1.id,
        tourId: tour1.id,
        rating: 5,
        title: 'Amazing Dragon Blood Trees Experience!',
        titleAr: 'تجربة أشجار دم التنين مذهلة!',
        content: 'The tour was absolutely incredible! Our guide was very knowledgeable.',
        contentAr: 'الجولة كانت مذهلة تماما! كان دليلنا على دراية كبيرة.',
        comment: 'Highly recommend this tour to anyone visiting Socotra!',
        isActive: true
      }
    });

    console.log('✅ Created 1 sample review');

    console.log('\n🎉 ═══════════════════════════════════════════');
    console.log('   ✅ SIMPLE DATA SEEDING COMPLETED!');
    console.log('═══════════════════════════════════════════');
    console.log('\n📊 Summary:');
    console.log('👤 Users: 2 (1 admin + 1 customer)');
    console.log('✈️ Tours: 2');
    console.log('🏨 Hotels: 2');
    console.log('🚗 Cars: 2');
    console.log('📅 Tour Dates: 5');
    console.log('📅 Bookings: 1');
    console.log('💳 Payments: 1');
    console.log('⭐ Reviews: 1');
    console.log('\n🚀 Your Hawari Tours database is now loaded with sample data!');
    console.log('🎯 Ready for admin panel testing!');

    console.log('\n🔑 Login Credentials:');
    console.log('Admin: admin@hawaritours.com / admin123456');
    console.log('Customer: customer1@example.com / customer123');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedSimpleData().catch(console.error);
