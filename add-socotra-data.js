// 🌱 Add Additional Comprehensive Socotra Data
// إضافة بيانات سقطرى شاملة إضافية

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function addSocotraData() {
  console.log('🌱 ═══════════════════════════════════════════');
  console.log('   HAWARI TOURS - Adding Comprehensive Socotra Data');
  console.log('═══════════════════════════════════════════');

  try {
    // ═══════════════════════════════════════════════════
    // 👤 Additional Users
    // ═══════════════════════════════════════════════════
    console.log('\n👤 Adding additional users...');
    
    const managerUser = await prisma.user.upsert({
      where: { email: 'manager@hawaritours.com' },
      update: {},
      create: {
        email: 'manager@hawaritours.com',
        name: 'مدير العمليات',
        password: await bcrypt.hash('manager123456', 10),
        role: 'ADMIN',
        isActive: true,
        emailVerified: true
      }
    });

    const guideUser = await prisma.user.upsert({
      where: { email: 'guide@hawaritours.com' },
      update: {},
      create: {
        email: 'guide@hawaritours.com',
        name: 'دليل سياحي',
        password: await bcrypt.hash('guide123456', 10),
        role: 'ADMIN',
        isActive: true,
        emailVerified: true
      }
    });

    const customers = await Promise.all([
      prisma.user.upsert({
        where: { email: 'fatima.yemen@yahoo.com' },
        update: {},
        create: {
          email: 'fatima.yemen@yahoo.com',
          name: 'فاطمة اليمنية',
          password: await bcrypt.hash('customer123', 10),
          role: 'USER',
          phone: '+967 772 345 678',
          isActive: true,
          emailVerified: true
        }
      }),
      prisma.user.upsert({
        where: { email: 'abdullah.tourist@hotmail.com' },
        update: {},
        create: {
          email: 'abdullah.tourist@hotmail.com',
          name: 'عبدالله السائح',
          password: await bcrypt.hash('customer123', 10),
          role: 'USER',
          phone: '+967 773 456 789',
          isActive: true,
          emailVerified: true
        }
      }),
      prisma.user.upsert({
        where: { email: 'maria.explorer@gmail.com' },
        update: {},
        create: {
          email: 'maria.explorer@gmail.com',
          name: 'Maria Explorer',
          password: await bcrypt.hash('customer123', 10),
          role: 'USER',
          phone: '+44 20 1234 5678',
          isActive: true,
          emailVerified: true
        }
      }),
      prisma.user.upsert({
        where: { email: 'john.adventurer@yahoo.com' },
        update: {},
        create: {
          email: 'john.adventurer@yahoo.com',
          name: 'John Adventurer',
          password: await bcrypt.hash('customer123', 10),
          role: 'USER',
          phone: '+1 555 123 4567',
          isActive: true,
          emailVerified: true
        }
      }),
      prisma.user.upsert({
        where: { email: 'sarah.nature@gmail.com' },
        update: {},
        create: {
          email: 'sarah.nature@gmail.com',
          name: 'Sarah Nature',
          password: await bcrypt.hash('customer123', 10),
          role: 'USER',
          phone: '+49 30 1234 5678',
          isActive: true,
          emailVerified: true
        }
      })
    ]);

    console.log(`✅ Added ${customers.length + 2} additional users`);

    // ═══════════════════════════════════════════════════
    // ✈️ Additional Tours
    // ═══════════════════════════════════════════════════
    console.log('\n✈️ Adding comprehensive tours...');
    
    const tours = await Promise.all([
      // جولة جبال حجير
      prisma.tour.create({
        data: {
          title: 'Hajhir Mountains Peak Adventure',
          titleAr: 'مغامرة قمم جبال حجير',
          slug: 'hajhir-mountains-peak-adventure',
          description: 'Conquer Socotra\'s highest peaks in this challenging mountain adventure. The Hajhir Mountains offer breathtaking panoramic views, rare endemic flora, and the ultimate trekking experience.',
          descriptionAr: 'تسلق أعلى قمم سقطرى في هذه المغامرة الجبلية التحدي. جبال حجير تقدم إطلالات بانورامية مذهلة ونباتات نادرة مستوطنة وتجربة تسلق نهائية.',
          price: 449.99,
          duration: 5,
          maxPeople: 8,
          difficulty: 'CHALLENGING',
          category: 'ADVENTURE',
          featured: false,
          isActive: true,
          coverImage: '/img/tours/hajhir-mountains-main.jpg',
          images: ['/img/tours/hajhir-peak-1.jpg', '/img/tours/hajhir-peak-2.jpg'],
          location: 'Hajhir Mountains Range',
          locationAr: 'سلسلة جبال حجير',
          latitude: 12.5333,
          longitude: 54.0333,
          includes: ['Professional mountain guide', '4 nights mountain camping', 'All camping equipment', 'All meals', 'Climbing safety equipment'],
          excludes: ['Personal climbing equipment', 'Travel insurance', 'Personal medications'],
          features: ['Summit Socotra\'s Highest Peak', 'Professional Mountain Guide', 'Overnight Mountain Camping'],
          featuresAr: ['تسلق أعلى قمة في سقطرى', 'دليل جبلي محترف', 'تخييم جبلي ليلي'],
          metaTitle: 'Hajhir Mountains Peak Adventure - Socotra Trekking',
          metaDescription: 'Challenge yourself with the ultimate Socotra mountain adventure to the highest peaks.',
          keywords: ['hajhir mountains', 'socotra trekking', 'mountain climbing'],
          rating: 4.7,
          reviewsCount: 28,
          bookingsCount: 67,
          viewsCount: 987
        }
      }),

      // جولة كهوف حوق
      prisma.tour.create({
        data: {
          title: 'Hoq Cave & Dixam Plateau Exploration',
          titleAr: 'استكشاف كهف حوق وهضبة دكسام',
          slug: 'hoq-cave-dixam-plateau',
          description: 'Explore the magnificent Hoq Cave with stunning stalactites and ancient inscriptions. Combined with the beautiful Dixam Plateau, this tour offers adventure, history, and natural beauty.',
          descriptionAr: 'استكشف كهف حوق المذهل مع تتاليت رائعة ونقوش قديمة. مجتمعة مع هضبة دكسام الجميلة، هذه الجولة توفر مغامرة وتاريخ وجمال طبيعي.',
          price: 319.99,
          duration: 3,
          maxPeople: 10,
          difficulty: 'MODERATE',
          category: 'ADVENTURE',
          featured: true,
          isActive: true,
          coverImage: '/img/tours/hoq-cave-main.jpg',
          images: ['/img/tours/hoq-cave-entrance.jpg', '/img/tours/hoq-cave-stalactites.jpg'],
          location: 'Hoq Cave & Dixam Plateau',
          locationAr: 'كهف حوق وهضبة دكسام',
          latitude: 12.4333,
          longitude: 53.9333,
          includes: ['Professional cave guide', '2 nights accommodation', 'Cave exploration equipment', 'Safety gear'],
          excludes: ['Personal flashlights', 'Travel insurance'],
          features: ['Ancient Cave Inscriptions', 'Stunning Stalactite Formations', 'Archaeological Significance'],
          featuresAr: ['نقوش كهف قديمة', 'تشكلات تتاليت مذهلة', 'أهمية أثرية'],
          metaTitle: 'Hoq Cave & Dixam Plateau - Socotra Adventure',
          metaDescription: 'Explore Socotra\'s magnificent Hoq Cave and beautiful Dixam Plateau.',
          keywords: ['hoq cave', 'dixam plateau', 'socotra caves', 'archaeology'],
          rating: 4.6,
          reviewsCount: 34,
          bookingsCount: 89,
          viewsCount: 1234
        }
      }),

      // جولة شعاب Dihamri
      prisma.tour.create({
        data: {
          title: 'Dihamri Marine Sanctuary Snorkeling',
          titleAr: 'الغوص في محمية Dihamri البحرية',
          slug: 'dihamri-marine-sanctuary',
          description: 'Discover the underwater paradise of Dihamri Marine Sanctuary with pristine coral reefs and colorful tropical fish. Perfect for swimming and snorkeling in crystal-clear waters.',
          descriptionAr: 'اكتشف الجنة تحت الماء في محمية Dihamri البحرية مع شعاب مرجانية نقية وأسماك استوائية ملونة. مثالية للسباحة والغوص في مياه صافية.',
          price: 189.99,
          duration: 2,
          maxPeople: 12,
          difficulty: 'EASY',
          category: 'BEACH',
          featured: false,
          isActive: true,
          coverImage: '/img/tours/dihamri-marine-main.jpg',
          images: ['/img/tours/dihamri-coral-1.jpg', '/img/tours/dihamri-fish-1.jpg'],
          location: 'Dihamri Marine Sanctuary',
          locationAr: 'محمية Dihamri البحرية',
          latitude: 12.3833,
          longitude: 53.8833,
          includes: ['Professional snorkeling guide', '1 night beach accommodation', 'All snorkeling equipment'],
          excludes: ['Personal snorkeling gear', 'Underwater camera rental'],
          features: ['Pristine Coral Reefs', 'Tropical Fish Encounters', 'Sea Turtle Sightings'],
          featuresAr: ['شعاب مرجانية نقية', 'لقاءات مع أسماك استوائية', 'مشاهدة السلاحف البحرية'],
          metaTitle: 'Dihamri Marine Sanctuary - Socotra Snorkeling Paradise',
          metaDescription: 'Experience the best snorkeling in Socotra at Dihamri Marine Sanctuary.',
          keywords: ['dihamri', 'marine sanctuary', 'socotra snorkeling', 'coral reefs'],
          rating: 4.8,
          reviewsCount: 41,
          bookingsCount: 156,
          viewsCount: 1456
        }
      })
    ]);

    console.log(`✅ Added ${tours.length} additional tours`);

    // ═══════════════════════════════════════════════════
    // 🏨 Additional Hotels
    // ═══════════════════════════════════════════════════
    console.log('\n🏨 Adding additional hotels...');
    
    const hotels = await Promise.all([
      prisma.hotel.create({
        data: {
          name: 'Hadibu City Hotel',
          nameAr: 'فندق مدينة حديبو',
          slug: 'hadibu-city-hotel',
          description: 'Modern city hotel in the heart of Hadibu with comfortable rooms and convenient access to markets and restaurants.',
          descriptionAr: 'فندق حديث في قلب حديبو مع غرف مريحة ووصول مريح للأسواق والمطاعم.',
          pricePerNight: 185.00,
          rating: 4.2,
          reviewsCount: 87,
          roomsCount: 32,
          status: 'ACTIVE',
          featured: false,
          coverImage: '/img/hotels/hadibu-city-main.jpg',
          images: ['/img/hotels/hadibu-exterior.jpg', '/img/hotels/hadibu-room.jpg'],
          location: 'Hadibu City Center',
          locationAr: 'مركز مدينة حديبو',
          latitude: 12.4833,
          longitude: 53.9833,
          amenities: ['City Center Location', 'Free WiFi', 'Business Center', 'Restaurant & Coffee Shop'],
          highlights: ['Central City Location', 'Business Facilities', 'Tour Booking Services'],
          highlightsAr: ['موقع مركزي في المدينة', 'مرافق تجارية', 'خدمات حجز الجولات'],
          checkInTime: '13:00',
          checkOutTime: '12:00',
          metaTitle: 'Hadibu City Hotel - Modern Comfort in Socotra Capital',
          metaDescription: 'Stay in the heart of Socotra\'s capital with modern amenities.',
          keywords: ['city hotel', 'hadibu', 'business hotel', 'central location'],
          viewsCount: 987
        }
      }),

      prisma.hotel.create({
        data: {
          name: 'Detwah Lagoon Eco Resort',
          nameAr: 'منتجع بحيرة دتوة البيئي',
          slug: 'detwah-lagoon-eco-resort',
          description: 'Exclusive eco-resort on the shores of stunning Detwah Lagoon with luxury tents and private lagoon access.',
          descriptionAr: 'منتجع بيئي حصري على ضفاف بحيرة دتوة الخلابة مع خيام فاخرة ووصول خاص للبحيرة.',
          pricePerNight: 385.00,
          discount: 20,
          rating: 4.8,
          reviewsCount: 56,
          roomsCount: 12,
          status: 'ACTIVE',
          featured: true,
          coverImage: '/img/hotels/detwah-lagoon-main.jpg',
          images: ['/img/hotels/detwah-lagoon-view.jpg', '/img/hotels/detwah-luxury-tent.jpg'],
          location: 'Detwah Lagoon Shore',
          locationAr: 'ضفاف بحيرة دتوة',
          latitude: 12.2833,
          longitude: 43.5833,
          amenities: ['Luxury Safari Tents', 'Private Lagoon Access', 'Gourmet Dining', 'Spa Services'],
          highlights: ['Exclusive Location', 'Luxury Tent Accommodation', 'Private Lagoon Access'],
          highlightsAr: ['موقع حصري', 'إقامة خيام فاخرة', 'وصول خاص للبحيرة'],
          checkInTime: '15:00',
          checkOutTime: '11:00',
          metaTitle: 'Detwah Lagoon Eco Resort - Exclusive Luxury Tents',
          metaDescription: 'Experience exclusive luxury in our eco-resort on Detwah Lagoon.',
          keywords: ['eco resort', 'detwah lagoon', 'luxury tents', 'exclusive accommodation'],
          viewsCount: 1876
        }
      })
    ]);

    console.log(`✅ Added ${hotels.length} additional hotels`);

    // ═══════════════════════════════════════════════════
    // 🚗 Additional Cars
    // ═══════════════════════════════════════════════════
    console.log('\n🚗 Adding additional cars...');
    
    const cars = await Promise.all([
      prisma.car.create({
        data: {
          name: 'Toyota Hilux Double Cab',
          nameAr: 'تويوتا هايلكس كابين مزدوج',
          slug: 'toyota-hilux-double-cab',
          description: 'Versatile pickup truck perfect for adventure seekers and equipment transport with comfortable double cab seating.',
          descriptionAr: 'شاحنة بيك أب متعددة الاستخدامات مثالية لمحبي المغامرة ونقل المعدات مع مقاعد كابين مزدوجة مريحة.',
          brand: 'Toyota',
          type: 'Pickup Truck',
          year: 2023,
          pricePerDay: 125.00,
          discount: 8,
          seats: 5,
          doors: 4,
          transmission: 'Manual',
          fuelType: 'Diesel',
          rating: 4.6,
          reviewsCount: 38,
          status: 'ACTIVE',
          featured: false,
          coverImage: '/img/cars/hilux-double-cab-main.jpg',
          images: ['/img/cars/hilux-exterior.jpg', '/img/cars/hilux-cargo-bed.jpg'],
          features: ['Diesel Engine', 'Double Cab Seating', 'Large Cargo Bed', '4WD Capability'],
          featuresAr: ['محرك ديزل', 'مقاعد كابين مزدوج', 'سرير شحن كبير', 'قدرة دفع رباعي'],
          insurance: 'Basic Plus',
          insuranceAr: 'أساسي زائد',
          mileage: 'Unlimited',
          mileageAr: 'غير محدود',
          color: 'Metallic Gray',
          colorAr: 'رمادي معدني',
          minAge: 22,
          deposit: 350.00,
          luggage: 10,
          metaTitle: 'Toyota Hilux Double Cab - Versatile Pickup Rental',
          metaDescription: 'Rent our versatile Toyota Hilux Double Cab for camping and adventure.',
          keywords: ['toyota hilux', 'pickup truck', 'double cab', 'utility vehicle'],
          viewsCount: 1678
        }
      }),

      prisma.car.create({
        data: {
          name: 'Suzuki Vitara 4x4',
          nameAr: 'سوزوكي فيتارا 4x4',
          slug: 'suzuki-vitara-4x4',
          description: 'Compact and efficient 4x4 perfect for city driving and light off-road use with hybrid technology.',
          descriptionAr: '4x4 صغير وموفر للوقود مثالي للقيادة في المدينة والاستخدام الخفيف خارج الطريق بتكنولوجيا هجينة.',
          brand: 'Suzuki',
          type: 'SUV',
          year: 2023,
          pricePerDay: 95.00,
          discount: 12,
          seats: 5,
          doors: 5,
          transmission: 'Automatic',
          fuelType: 'Hybrid',
          rating: 4.4,
          reviewsCount: 29,
          status: 'ACTIVE',
          featured: false,
          coverImage: '/img/cars/vitara-4x4-main.jpg',
          images: ['/img/cars/vitara-exterior.jpg', '/img/cars/vitara-city.jpg'],
          features: ['Hybrid Engine', 'Compact Size', 'Easy Parking', 'Fuel Efficient'],
          featuresAr: ['محرك هجين', 'حجم صغير', 'ركن سهل', 'اقتصاد وقود'],
          insurance: 'Basic',
          insuranceAr: 'أساسي',
          mileage: '250km/day',
          mileageAr: '250 كم/يوم',
          color: 'Metallic Blue',
          colorAr: 'أزرق معدني',
          minAge: 21,
          deposit: 250.00,
          luggage: 4,
          metaTitle: 'Suzuki Vitara 4x4 - Compact Hybrid SUV Rental',
          metaDescription: 'Rent our efficient Suzuki Vitara 4x4 hybrid for economical exploration.',
          keywords: ['suzuki vitara', 'hybrid suv', 'compact 4x4', 'fuel efficient'],
          viewsCount: 1234
        }
      }),

      prisma.car.create({
        data: {
          name: 'Mitsubishi Pajero Sport',
          nameAr: 'ميتسوبيشي باجيرو سبورت',
          slug: 'mitsubishi-pajero-sport',
          description: 'Mid-size SUV offering excellent balance of comfort and off-road capability with Super Select 4WD system.',
          descriptionAr: 'SUV متوسط الحجم يقدم توازناً ممتازاً بين الراحة والقدرة خارج الطريق بنظام Super Select 4WD.',
          brand: 'Mitsubishi',
          type: 'SUV',
          year: 2022,
          pricePerDay: 135.00,
          discount: 5,
          seats: 7,
          doors: 5,
          transmission: 'Automatic',
          fuelType: 'Diesel',
          rating: 4.5,
          reviewsCount: 34,
          status: 'ACTIVE',
          featured: false,
          coverImage: '/img/cars/pajero-sport-main.jpg',
          images: ['/img/cars/pajero-exterior.jpg', '/img/cars/pajero-family.jpg'],
          features: ['Super Select 4WD', 'Spacious Interior', 'Automatic Transmission', 'Diesel Engine'],
          featuresAr: ['Super Select 4WD', 'داخل فسيح', 'نقل أوتوماتيكي', 'محرك ديزل'],
          insurance: 'Comprehensive',
          insuranceAr: 'شامل',
          mileage: '350km/day',
          mileageAr: '350 كم/يوم',
          color: 'Black Metallic',
          colorAr: 'أسود معدني',
          minAge: 24,
          deposit: 400.00,
          luggage: 6,
          metaTitle: 'Mitsubishi Pajero Sport - Family SUV Rental',
          metaDescription: 'Rent our Mitsubishi Pajero Sport for comfortable family adventures.',
          keywords: ['mitsubishi pajero', 'family suv', '4wd rental', 'comfortable suv'],
          viewsCount: 1456
        }
      })
    ]);

    console.log(`✅ Added ${cars.length} additional cars`);

    // ═══════════════════════════════════════════════════
    // 📅 Additional Tour Dates
    // ═══════════════════════════════════════════════════
    console.log('\n📅 Adding additional tour dates...');
    
    const allTourDates = [];
    
    // Add dates for new tours
    tours.forEach((tour) => {
      for (let i = 0; i < 6; i++) {
        const startDate = new Date();
        startDate.setDate(startDate.getDate() + (i * 7) + 10);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + tour.duration);
        
        allTourDates.push({
          tourId: tour.id,
          startDate,
          endDate,
          availableSpots: Math.floor(Math.random() * (tour.maxPeople - 2)) + 2,
          price: tour.price * (1 - (Math.random() * 0.15)),
          isActive: true
        });
      }
    });
    
    await prisma.tourDate.createMany({ data: allTourDates });
    console.log(`✅ Added ${allTourDates.length} additional tour dates`);

    console.log('\n🎉 ═══════════════════════════════════════════');
    console.log('   ✅ ADDITIONAL SOCOTRA DATA COMPLETED!');
    console.log('═══════════════════════════════════════════');
    console.log('\n📊 Additional Data Added:');
    console.log('👤 Users: +7 (2 staff + 5 customers)');
    console.log('✈️ Tours: +3 comprehensive tours');
    console.log('🏨 Hotels: +2 diverse hotels');
    console.log('🚗 Cars: +3 suitable vehicles');
    console.log('📅 Tour Dates: +18 available dates');
    console.log('\n🌍 All data is 100% focused on authentic Socotra experiences!');
    console.log('🎯 Your Hawari Tours database is now fully comprehensive!');

  } catch (error) {
    console.error('❌ Adding data failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

addSocotraData().catch(console.error);
