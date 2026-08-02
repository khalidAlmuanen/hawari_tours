// 🌱 Complete Seed Data for Hawari Tours Admin Panel
// بيانات شاملة ومتكاملة لنظام إدارة رحلات الحواري

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedCompleteData() {
  console.log('🌱 ═══════════════════════════════════════════');
  console.log('   HAWARI TOURS - Complete Data Seeding');
  console.log('═══════════════════════════════════════════');

  try {
    // ═══════════════════════════════════════════════════
    // 👤 Users & Admin Accounts
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

    const managerUser = await prisma.user.create({
      data: {
        email: 'manager@hawaritours.com',
        name: 'مدير العمليات',
        password: await bcrypt.hash('manager123456', 10),
        role: 'ADMIN',
        isActive: true,
        emailVerified: true
      }
    });

    const sampleCustomers = await Promise.all([
      prisma.user.create({
        data: {
          email: 'customer1@example.com',
          name: 'أحمد محمد',
          password: await bcrypt.hash('customer123', 10),
          role: 'USER',
          phone: '+967 771 234 567',
          isActive: true,
          emailVerified: true
        }
      }),
      prisma.user.create({
        data: {
          email: 'customer2@example.com',
          name: 'فاطمة علي',
          password: await bcrypt.hash('customer123', 10),
          role: 'USER',
          phone: '+967 772 345 678',
          isActive: true,
          emailVerified: true
        }
      }),
      prisma.user.create({
        data: {
          email: 'customer3@example.com',
          name: 'عبدالله سالم',
          password: await bcrypt.hash('customer123', 10),
          role: 'USER',
          phone: '+967 773 456 789',
          isActive: true,
          emailVerified: true
        }
      })
    ]);

    console.log(`✅ Created ${2 + 3} users`);

    // ═══════════════════════════════════════════════════
    // ✈️ Tours Data
    // ═══════════════════════════════════════════════════
    console.log('\n✈️ Creating tours...');
    
    const tours = await Promise.all([
      // جولة دروبان الساحرة
      prisma.tour.create({
        data: {
          title: 'جولة دروبان الساحرة',
          titleAr: 'جولة دروبان الساحرة',
          slug: 'dragon-blood-trees-tour',
          description: 'Explore the mystical Dragon Blood Trees of Socotra, a UNESCO World Heritage site. Witness these iconic trees with their unique umbrella-shaped crowns and red sap.',
          descriptionAr: 'استكشف أشجار دم التنين الساحرة في سقطرى، موقع تراث عالمي لليونسكو. شاهد هذه الأشجار الأسطورية بتاجهاتها المظلية الفريدة ونسجها الأحمر.',
          price: 299.99,
          duration: 3,
          maxPeople: 12,
          difficulty: 'MODERATE',
          category: 'NATURE',
          featured: true,
          isActive: true,
          coverImage: '/img/tours/dragon-blood-trees.jpg',
          cardImage: '/img/tours/dragon-blood-trees-card.jpg',
          images: [
            '/img/tours/dragon-blood-trees-1.jpg',
            '/img/tours/dragon-blood-trees-2.jpg',
            '/img/tours/dragon-blood-trees-3.jpg'
          ],
          videoUrl: 'https://www.youtube.com/watch?v=demo',
          location: 'Homhil Protected Area',
          locationAr: 'منطقة حوميل المحمية',
          latitude: 12.4833,
          longitude: 53.9833,
          itinerary: {
            day1: 'Arrival at Hadibu airport, check-in at hotel, evening beach walk',
            day2: 'Early morning hike to Dragon Blood Trees forest, picnic lunch, return to hotel',
            day3: 'Free morning, transfer to airport, departure'
          },
          includes: [
            'Airport transfers',
            '2 nights accommodation',
            'Professional guide',
            'All meals',
            'Entrance fees',
            'Transportation'
          ],
          excludes: [
            'International flights',
            'Travel insurance',
            'Personal expenses',
            'Tips',
            'الرحلات الدولية',
            'تأمين السفر',
            'المصروفات الشخصية',
            'الإكراميات'
          ],
          features: [
            'UNESCO Heritage Site',
            'Professional Photography',
            'Small Group Size',
            'Expert Local Guide'
          ],
          featuresAr: [
            'موقع تراث عالمي',
            'تصوير احترافي',
            'مجموعات صغيرة',
            'دليل محلي خبير'
          ],
          metaTitle: 'Dragon Blood Trees Tour - Socotra',
          metaDescription: 'Discover the magical Dragon Blood Trees of Socotra on this 3-day guided tour.',
          keywords: ['dragon blood trees', 'socotra', 'unesco', 'nature tour'],
          rating: 4.8,
          reviewsCount: 24,
          bookingsCount: 156,
          viewsCount: 892
        }
      }),

      // جولة شواطئ قلانسيا
      prisma.tour.create({
        data: {
          title: 'Qalansiyah Beach Paradise',
          titleAr: 'جنة شواطئ قلانسيا',
          slug: 'qalansiyah-beach-tour',
          description: 'Relax on pristine white sand beaches and swim in crystal clear waters. Visit the historic fishing village of Qalansiyah and enjoy fresh seafood.',
          descriptionAr: 'استرخ على الشواطئ الرملية البيضاء النقية وسبح في المياه الصافية. زار قرية قلانسيا التاريخية الصيد واستمتع بالمأكولات البحرية الطازجة.',
          price: 199.99,
          duration: 2,
          maxPeople: 15,
          difficulty: 'EASY',
          category: 'BEACH',
          featured: true,
          isActive: true,
          coverImage: '/img/tours/qalansiyah-beach.jpg',
          images: [
            '/img/tours/qalansiyah-1.jpg',
            '/img/tours/qalansiyah-2.jpg',
            '/img/tours/qalansiyah-3.jpg'
          ],
          location: 'Qalansiyah Village',
          locationAr: 'قرية قلانسيا',
          latitude: 12.1833,
          longitude: 43.4833,
          includes: [
            'Beach transfers',
            '1 night accommodation',
            'Seafood lunch',
            'Snorkeling equipment',
            'Beach guide',
            'نقل الشاطئ',
            'إقامة ليلة واحدة',
            'غداء مأكولات بحرية',
            'معدات غوص',
            'دليل الشاطئ'
          ],
          features: [
            'Pristine Beaches',
            'Fresh Seafood',
            'Snorkeling',
            'Cultural Experience'
          ],
          featuresAr: [
            'شواطئ نقية',
            'مأكولات بحرية طازجة',
            'غوص',
            'تجربة ثقافية'
          ],
          rating: 4.9,
          reviewsCount: 18,
          bookingsCount: 98,
          viewsCount: 654
        }
      }),

      // جولة تسلق جبال حجير
      prisma.tour.create({
        data: {
          title: 'Hajhir Mountains Adventure',
          titleAr: 'مغامرة جبال حجير',
          slug: 'hajhir-mountains-adventure',
          description: 'Challenge yourself with a trek through Socotra\'s highest mountains. Enjoy breathtaking panoramic views and discover endemic plant species.',
          descriptionAr: 'تحدي نفسك برحلة عبر أعلى جبال سقطرى. استمتع بإطلالات بانورامية مذهلة واكتشف أنواع نباتات مستوطنة.',
          price: 399.99,
          duration: 4,
          maxPeople: 8,
          difficulty: 'CHALLENGING',
          category: 'ADVENTURE',
          featured: false,
          isActive: true,
          coverImage: '/img/tours/hajhir-mountains.jpg',
          images: [
            '/img/tours/hajhir-1.jpg',
            '/img/tours/hajhir-2.jpg',
            '/img/tours/hajhir-3.jpg'
          ],
          location: 'Hajhir Mountains',
          locationAr: 'جبال حجير',
          latitude: 12.5333,
          longitude: 54.0333,
          includes: [
            'Mountain guide',
            '3 nights camping',
            'All meals',
            'Climbing equipment',
            'First aid kit',
            'دليل جبلي',
            '3 ليالي مخيم',
            'جميع الوجبات',
            'معدات تسلق',
            'طبيعة أولية'
          ],
          features: [
            'Mountain Trekking',
            'Camping Experience',
            'Endemic Flora',
            'Expert Guide'
          ],
          featuresAr: [
            'رحلة جبلية',
            'تجربة مخيم',
            'نباتات مستوطنة',
            'دليل خبير'
          ],
          rating: 4.6,
          reviewsCount: 12,
          bookingsCount: 34,
          viewsCount: 423
        }
      })
    ]);

    console.log(`✅ Created ${tours.length} tours`);

    // ═══════════════════════════════════════════════════
    // 🏨 Hotels Data
    // ═══════════════════════════════════════════════════
    console.log('\n🏨 Creating hotels...');
    
    const hotels = await Promise.all([
      prisma.hotel.create({
        data: {
          name: 'Socotra Paradise Resort',
          nameAr: 'منتجع سقطرى Paradise',
          slug: 'socotra-paradise-resort',
          description: 'Luxury beachfront resort with stunning ocean views, infinity pool, spa, and world-class dining. Perfect for romantic getaways and family vacations.',
          descriptionAr: 'منتجع فاخر على شاطئ البحر بإطلالات محيطية مذهلة ومسبح لا نهائي وسبا وتعليم عالمي. مثالي للهروب الروماني والعطلات العائلية.',
          shortDescription: 'Luxury beachfront paradise',
          shortDescriptionAr: 'جنة شاطئية فاخرة',
          pricePerNight: 450.00,
          discount: 10,
          rating: 4.9,
          reviewsCount: 127,
          roomsCount: 45,
          status: 'ACTIVE',
          featured: true,
          coverImage: '/img/hotels/socotra-paradise.jpg',
          images: [
            '/img/hotels/socotra-paradise-1.jpg',
            '/img/hotels/socotra-paradise-2.jpg',
            '/img/hotels/socotra-paradise-3.jpg'
          ],
          videoUrl: 'https://www.youtube.com/watch?v=hotel-demo',
          location: 'Hadibu Beach',
          locationAr: 'شاطئ حديبو',
          latitude: 12.4833,
          longitude: 53.9833,
          amenities: [
            'Free WiFi',
            'Infinity Pool',
            'Spa & Wellness',
            'Beach Access',
            'Restaurant',
            'Bar',
            'Gym',
            'Room Service',
            'Concierge',
            'Airport Shuttle',
            'واي فاي مجاني',
            'مسبح لا نهائي',
            'سبا ومرافق صحية',
            'وصول الشاطئ',
            'مطعم',
            'بار',
            'جيم',
            'خدمة الغرف',
            'كونسيرج',
            'نقل من المطار'
          ],
          highlights: [
            'Ocean View Rooms',
            'Private Beach',
            'World-Class Spa',
            'Fine Dining Restaurant'
          ],
          highlightsAr: [
            'غرف بإطلالة على المحيط',
            'شاطئ خاص',
            'سبا عالمي المستوى',
            'مطعم فاخر'
          ],
          checkInTime: '14:00',
          checkOutTime: '12:00',
          cancellationPolicy: 'Free cancellation up to 24 hours before check-in',
          cancellationPolicyAr: 'إلغاء مجاني حتى 24 ساعة قبل تسجيل الوصول',
          metaTitle: 'Socotra Paradise Resort - Luxury Beach Hotel',
          metaDescription: 'Experience luxury at Socotra\'s premier beachfront resort with stunning ocean views.',
          keywords: ['luxury resort', 'beach hotel', 'socotra', 'paradise'],
          viewsCount: 2156
        }
      }),

      prisma.hotel.create({
        data: {
          name: 'Dragon\'s View Boutique Hotel',
          nameAr: 'فندق Dragon\'s View بوتيك',
          slug: 'dragons-view-boutique',
          description: 'Charming boutique hotel with traditional Socotri architecture and modern comforts. Located near Dragon Blood Trees forest.',
          descriptionAr: 'فندق بوتيك ساحر بعمارة سقطرية تقليدية وراحة عصرية. يقع بالقرب من غابة أشجار دم التنين.',
          shortDescription: 'Traditional charm meets modern luxury',
          shortDescriptionAr: 'السحر التقليدي يلتقي الفخامة العصرية',
          pricePerNight: 280.00,
          rating: 4.7,
          reviewsCount: 89,
          roomsCount: 20,
          status: 'ACTIVE',
          featured: true,
          coverImage: '/img/hotels/dragons-view.jpg',
          images: [
            '/img/hotels/dragons-view-1.jpg',
            '/img/hotels/dragons-view-2.jpg'
          ],
          location: 'Near Homhil',
          locationAr: 'بالقرب من حوميل',
          latitude: 12.4533,
          longitude: 53.9533,
          amenities: [
            'Free WiFi',
            'Traditional Restaurant',
            'Garden',
            'Library',
            'Tour Desk',
            'Breakfast Included'
          ],
          amenitiesAr: [
            'واي فاي مجاني',
            'مطعم تقليدي',
            'حديقة',
            'مكتبة',
            'مكتب سياحي',
            'وجبة الإفطار مشمولة'
          ],
          highlights: [
            'Traditional Architecture',
            'Dragon Trees View',
            'Cultural Experience',
            'Authentic Cuisine'
          ],
          highlightsAr: [
            'عمارة تقليدية',
            'إطلالة أشجار التنين',
            'تجربة ثقافية',
            'مطبخ أصيل'
          ],
          checkInTime: '15:00',
          checkOutTime: '11:00',
          metaTitle: 'Dragon\'s View Boutique Hotel - Traditional Socotri Experience',
          keywords: ['boutique hotel', 'traditional', 'socotri culture'],
          viewsCount: 1234
        }
      }),

      prisma.hotel.create({
        data: {
          name: 'Qalansiyah Beach Hotel',
          nameAr: 'فندق شاطئ قلانسيا',
          slug: 'qalansiyah-beach-hotel',
          description: 'Cozy beachfront hotel perfect for budget-conscious travelers. Clean rooms, friendly staff, and direct beach access.',
          descriptionAr: 'فندق شاطئي مريح مثالي للمسافرين ذوي الميزانية المحدودة. غرف نظيفة، موظفين ودودين، ووصول مباشر للشاطئ.',
          shortDescription: 'Affordable beachfront comfort',
          shortDescriptionAr: 'راحة شاطئية ميسورة',
          pricePerNight: 120.00,
          discount: 5,
          rating: 4.3,
          reviewsCount: 156,
          roomsCount: 15,
          status: 'ACTIVE',
          featured: false,
          coverImage: '/img/hotels/qalansiyah-beach.jpg',
          images: [
            '/img/hotels/qalansiyah-1.jpg',
            '/img/hotels/qalansiyah-2.jpg'
          ],
          location: 'Qalansiyah Beach',
          locationAr: 'شاطئ قلانسيا',
          latitude: 12.1833,
          longitude: 43.4833,
          amenities: [
            'Free WiFi',
            'Beach Access',
            'Restaurant',
            'Free Breakfast',
            'Parking'
          ],
          amenitiesAr: [
            'واي فاي مجاني',
            'وصول الشاطئ',
            'مطعم',
            'إفطار مجاني',
            'موقف سيارات'
          ],
          highlights: [
            'Beach Location',
            'Budget Friendly',
            'Local Restaurant',
            'Family Friendly'
          ],
          highlightsAr: [
            'موقع الشاطئ',
            'ميسور التكلفة',
            'مطعم محلي',
            'عائلي'
          ],
          checkInTime: '14:00',
          checkOutTime: '12:00',
          metaTitle: 'Qalansiyah Beach Hotel - Affordable Beach Accommodation',
          keywords: ['budget hotel', 'beach', 'qalansiyah', 'affordable'],
          viewsCount: 789
        }
      })
    ]);

    console.log(`✅ Created ${hotels.length} hotels`);

    // ═══════════════════════════════════════════════════
    // 🚗 Cars Data
    // ═══════════════════════════════════════════════════
    console.log('\n🚗 Creating cars...');
    
    const cars = await Promise.all([
      prisma.car.create({
        data: {
          name: 'Toyota Land Cruiser 4x4',
          nameAr: 'تويوتا لاند كروزر 4x4',
          slug: 'toyota-land-cruiser-4x4',
          description: 'Premium 4x4 vehicle perfect for Socotra\'s rugged terrain. Air conditioning, leather seats, and advanced safety features.',
          descriptionAr: 'مركبة 4x4 فاخرة مثالية للتضاريس الوعرة في سقطرى. تكييف هواء، مقاعد جلد، وميزات أمان متقدمة.',
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
          images: [
            '/img/cars/land-cruiser-1.jpg',
            '/img/cars/land-cruiser-2.jpg',
            '/img/cars/land-cruiser-3.jpg'
          ],
          videoUrl: 'https://www.youtube.com/watch?v=car-demo',
          features: [
            '4WD System',
            'Climate Control',
            'Leather Seats',
            'GPS Navigation',
            'Bluetooth',
            'Cruise Control',
            'Safety Airbags',
            'Roof Rack'
          ],
          featuresAr: [
            'نظام دفع رباعي',
            'تحكم في المناخ',
            'مقاعد جلد',
            'ملاحة GPS',
            'بلوتوث',
            'تحكم في السرعة',
            'وسائد هوائية',
            'رفوف سقف'
          ],
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
      }),

      prisma.car.create({
        data: {
          name: 'Nissan Patrol Safari',
          nameAr: 'نيسان باترول سفاري',
          slug: 'nissan-patrol-safari',
          description: 'Powerful and reliable 4x4 ideal for off-road adventures. Spacious interior and excellent ground clearance.',
          descriptionAr: '4x4 قوي وموثوق مثالي للمغامرات خارج الطريق. داخل فسيح وارض واضح ممتاز.',
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
          images: [
            '/img/cars/patrol-1.jpg',
            '/img/catrs/patrol-2.jpg'
          ],
          features: [
            '4WD Capability',
            'High Ground Clearance',
            'Spacious Interior',
            'Off-road Tires',
            'Winch',
            'Roof Rack'
          ],
          featuresAr: [
            'قدرة دفع رباعي',
            'ارض واضح عالي',
            'داخل فسيح',
            'إطارات خارج الطريق',
            'ونش',
            'رفوف سقف'
          ],
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
      }),

      prisma.car.create({
        data: {
          name: 'Suzuki Vitara',
          nameAr: 'سوزوكي فيتارا',
          slug: 'suzuki-vitara',
          description: 'Compact and fuel-efficient SUV perfect for city driving and light off-road use. Easy to handle and park.',
          descriptionAr: 'SUV صغير وموفر للوقود مثالي للقيادة في المدينة والاستخدام الخفيف خارج الطريق. سهل القيادة والركن.',
          brand: 'Suzuki',
          type: 'SUV',
          year: 2023,
          pricePerDay: 80.00,
          discount: 15,
          seats: 5,
          doors: 5,
          transmission: 'Automatic',
          fuelType: 'Hybrid',
          rating: 4.4,
          reviewsCount: 28,
          status: 'ACTIVE',
          featured: false,
          coverImage: '/img/cars/vitara.jpg',
          images: [
            '/img/cars/vitara-1.jpg',
            '/img/cars/vitara-2.jpg'
          ],
          features: [
            'Hybrid Engine',
            'Compact Size',
            'Easy Parking',
            'Good Fuel Economy',
            'Touch Screen',
            'Backup Camera'
          ],
          featuresAr: [
            'محرك هجين',
            'حجم صغير',
            'ركن سهل',
            'اقتصاد وقود جيد',
            'شاشة لمس',
            'كاميرا خلفية'
          ],
          insurance: 'Basic',
          insuranceAr: 'أساسي',
          mileage: '200km/day',
          mileageAr: '200 كم/يوم',
          color: 'Metallic Blue',
          colorAr: 'أزرق معدني',
          minAge: 21,
          deposit: 200.00,
          luggage: 3,
          viewsCount: 567
        }
      }),

      prisma.car.create({
        data: {
          name: 'Toyota Hilux Pickup',
          nameAr: 'تويوتا هايلكس بيك أب',
          slug: 'toyota-hilux-pickup',
          description: 'Rugged pickup truck perfect for adventure seekers and equipment transport. Excellent for camping and exploration.',
          descriptionAr: 'شاحنة بيك أب قوية مثالية لمحبي المغامرة ونقل المعدات. ممتازة للتخييم والاستكشاف.',
          brand: 'Toyota',
          type: 'Pickup Truck',
          year: 2022,
          pricePerDay: 110.00,
          seats: 5,
          doors: 4,
          transmission: 'Manual',
          fuelType: 'Diesel',
          rating: 4.5,
          reviewsCount: 19,
          status: 'ACTIVE',
          featured: false,
          coverImage: '/img/cars/hilux.jpg',
          images: [
            '/img/cars/hilux-1.jpg',
            '/img/cars/hilux-2.jpg'
          ],
          features: [
            '4WD System',
            'Pickup Bed',
            'Towing Capacity',
            'Durable Build',
            'High Ground Clearance'
          ],
          featuresAr: [
            'نظام دفع رباعي',
            'سرير بيك أب',
            'قدرة سحب',
            'بناء متين',
            'ارض واضح عالي'
          ],
          insurance: 'Basic',
          insuranceAr: 'أساسي',
          mileage: 'Unlimited',
          mileageAr: 'غير محدود',
          color: 'Dark Gray',
          colorAr: 'رمادي داكن',
          minAge: 23,
          deposit: 400.00,
          luggage: 8,
          viewsCount: 434
        }
      })
    ]);

    console.log(`✅ Created ${cars.length} cars`);

    // ═══════════════════════════════════════════════════
    // 📅 Tour Dates
    // ═══════════════════════════════════════════════════
    console.log('\n📅 Creating tour dates...');
    
    const tourDates = [];
    
    // Add dates for Dragon Blood Trees Tour
    for (let i = 0; i < 5; i++) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + (i * 7) + 3);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 3);
      
      tourDates.push({
        tourId: tours[0].id,
        startDate,
        endDate,
        availableSpots: Math.floor(Math.random() * 8) + 4,
        price: tours[0].price * (1 - (Math.random() * 0.1)),
        isActive: true
      });
    }
    
    // Add dates for Qalansiyah Beach Tour
    for (let i = 0; i < 4; i++) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + (i * 5) + 2);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 2);
      
      tourDates.push({
        tourId: tours[1].id,
        startDate,
        endDate,
        availableSpots: Math.floor(Math.random() * 10) + 5,
        price: tours[1].price * (1 - (Math.random() * 0.15)),
        isActive: true
      });
    }
    
    await prisma.tourDate.createMany({ data: tourDates });
    console.log(`✅ Created ${tourDates.length} tour dates`);

    // ═══════════════════════════════════════════════════
    // 📅 Bookings Data
    // ═══════════════════════════════════════════════════
    console.log('\n📅 Creating sample bookings...');
    
    const bookings = await Promise.all([
      // Tour booking
      prisma.booking.create({
        data: {
          bookingNumber: 'HT-TOUR-2024-001',
          userId: sampleCustomers[0].id,
          tourId: tours[0].id,
          bookingType: 'TOUR',
          startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
          endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
          numberOfPeople: 2,
          totalPrice: tours[0].price * 2,
          paidAmount: tours[0].price * 2,
          status: 'CONFIRMED',
          paymentStatus: 'PAID',
          paymentMethod: 'CREDIT_CARD',
          customerName: 'أحمد محمد',
          customerEmail: 'customer1@example.com',
          customerPhone: '+967 771 234 567',
          specialRequests: 'Vegetarian meals required',
          confirmedAt: new Date()
        }
      }),
      
      // Hotel booking
      prisma.booking.create({
        data: {
          bookingNumber: 'HT-HOTEL-2024-002',
          userId: sampleCustomers[1].id,
          hotelId: hotels[0].id,
          bookingType: 'HOTEL',
          startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
          endDate: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000), // 17 days from now
          numberOfPeople: 2,
          numberOfRooms: 1,
          totalPrice: hotels[0].pricePerNight * 3,
          paidAmount: hotels[0].pricePerNight * 3,
          status: 'CONFIRMED',
          paymentStatus: 'PAID',
          paymentMethod: 'BANK_TRANSFER',
          customerName: 'فاطمة علي',
          customerEmail: 'customer2@example.com',
          customerPhone: '+967 772 345 678',
          confirmedAt: new Date()
        }
      }),
      
      // Car rental booking
      prisma.booking.create({
        data: {
          bookingNumber: 'HT-CAR-2024-003',
          userId: sampleCustomers[2].id,
          carId: cars[0].id,
          bookingType: 'CAR',
          startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
          endDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), // 8 days from now
          numberOfPeople: 1,
          totalPrice: cars[0].pricePerDay * 3,
          paidAmount: cars[0].deposit,
          status: 'CONFIRMED',
          paymentStatus: 'PARTIAL',
          paymentMethod: 'CASH',
          customerName: 'عبدالله سالم',
          customerEmail: 'customer3@example.com',
          customerPhone: '+967 773 456 789',
          confirmedAt: new Date()
        }
      })
    ]);

    console.log(`✅ Created ${bookings.length} sample bookings`);

    // ═══════════════════════════════════════════════════
    // 💳 Payments Data
    // ═══════════════════════════════════════════════════
    console.log('\n💳 Creating payments...');
    
    const payments = await Promise.all([
      prisma.payment.create({
        data: {
          bookingId: bookings[0].id,
          amount: bookings[0].totalPrice,
          method: 'CREDIT_CARD',
          status: 'PAID',
          transactionId: 'txn_tour_001',
          notes: 'Full payment for Dragon Blood Trees tour'
        }
      }),
      
      prisma.payment.create({
        data: {
          bookingId: bookings[1].id,
          amount: bookings[1].totalPrice,
          method: 'BANK_TRANSFER',
          status: 'PAID',
          transactionId: 'txn_hotel_002',
          notes: 'Full payment for Paradise Resort'
        }
      }),
      
      prisma.payment.create({
        data: {
          bookingId: bookings[2].id,
          amount: bookings[2].paidAmount,
          method: 'CASH',
          status: 'PAID',
          transactionId: 'deposit_car_003',
          notes: 'Security deposit for Land Cruiser rental'
        }
      })
    ]);

    console.log(`✅ Created ${payments.length} payments`);

    // ═══════════════════════════════════════════════════
    // ⭐ Reviews Data
    // ═══════════════════════════════════════════════════
    console.log('\n⭐ Creating reviews...');
    
    const reviews = await Promise.all([
      prisma.review.create({
        data: {
          userId: sampleCustomers[0].id,
          tourId: tours[0].id,
          rating: 5,
          title: 'Amazing Dragon Blood Trees Experience!',
          titleAr: 'تجربة أشجار دم التنين مذهلة!',
          content: 'The tour was absolutely incredible! Our guide was very knowledgeable about the unique flora and fauna. The Dragon Blood Trees were even more spectacular in person.',
          contentAr: 'الجولة كانت مذهلة تماما! كان دليلنا على دراية كبيرة بالنباتات والحيوانات الفريدة. كانت أشجار دم التنين أكثر روعة في الواقع.',
          isActive: true
        }
      }),
      
      prisma.review.create({
        data: {
          userId: sampleCustomers[1].id,
          hotelId: hotels[0].id,
          rating: 4,
          title: 'Luxury with a View',
          titleAr: 'فخامة مع إطلالة',
          content: 'Beautiful resort with stunning ocean views. The infinity pool was amazing and the staff was very helpful. Only minus was the high price.',
          contentAr: 'منتجع جميل بإطلالات محيطية مذهلة. المسبح اللانهائي كان رائعا والموظفين كانوا مساعدين جدا. فقط السالب كان السعر المرتفع.',
          isActive: true
        }
      }),
      
      prisma.review.create({
        data: {
          userId: sampleCustomers[2].id,
          carId: cars[0].id,
          rating: 5,
          title: 'Perfect for Socotra Roads',
          titleAr: 'مثالي لطرق سقطرى',
          content: 'The Land Cruiser handled all the rough roads perfectly. Very comfortable and had all the features we needed. Highly recommend!',
          contentAr: 'تعاملت لاند كروزر مع جميع الطرق الوعرة بشكل مثالي. مريحة جدا وكان لديها جميع الميزات التي نحتاجها. أوصي بشدة!',
          isActive: true
        }
      })
    ]);

    console.log(`✅ Created ${reviews.length} reviews`);

    // ═══════════════════════════════════════════════════
    // 📧 Messages Data
    // ═══════════════════════════════════════════════════
    console.log('\n📧 Creating messages...');
    
    const messages = await Promise.all([
      prisma.message.create({
        data: {
          userId: sampleCustomers[0].id,
          name: 'أحمد محمد',
          email: 'customer1@example.com',
          phone: '+967 771 234 567',
          subject: 'Question about Dragon Blood Trees Tour',
          subjectAr: 'سؤال حول جولة أشجار دم التنين',
          content: 'Hi, I\'m interested in the Dragon Blood Trees tour. Is it suitable for children aged 8 and 10?',
          contentAr: 'مرحبا، أنا مهتم بجولة أشجار دم التنين. هل هي مناسبة للأطفال aged 8 و 10؟',
          status: 'NEW'
        }
      }),
      
      prisma.message.create({
        data: {
          userId: sampleCustomers[1].id,
          name: 'فاطمة علي',
          email: 'customer2@example.com',
          phone: '+967 772 345 678',
          subject: 'Hotel Availability Check',
          subjectAr: 'فحص توفر الفندق',
          content: 'Do you have availability at Paradise Resort for 2 adults from March 15-18?',
          contentAr: 'هل لديك توفر في منتجع Paradise لشخصين بالغين من 15-18 مارس؟',
          status: 'REPLIED'
        }
      })
    ]);

    console.log(`✅ Created ${messages.length} messages`);

    console.log('\n🎉 ═══════════════════════════════════════════');
    console.log('   ✅ DATABASE SEEDING COMPLETED SUCCESSFULLY!');
    console.log('═══════════════════════════════════════════');
    console.log('\n📊 Summary:');
    console.log(`👤 Users: ${2 + 3} (2 admins + 3 customers)`);
    console.log(`✈️ Tours: ${tours.length}`);
    console.log(`🏨 Hotels: ${hotels.length}`);
    console.log(`🚗 Cars: ${cars.length}`);
    console.log(`📅 Tour Dates: ${tourDates.length}`);
    console.log(`📅 Bookings: ${bookings.length}`);
    console.log(`💳 Payments: ${payments.length}`);
    console.log(`⭐ Reviews: ${reviews.length}`);
    console.log(`📧 Messages: ${messages.length}`);
    console.log('\n🚀 Your Hawari Tours database is now fully loaded with realistic data!');
    console.log('🎯 Ready for admin panel testing and development!');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedCompleteData().catch(console.error);
