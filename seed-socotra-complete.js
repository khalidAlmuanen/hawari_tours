// 🌱 Complete Socotra-Focused Data Seeding
// بيانات شاملة ومتكاملة عن سقطرى لنظام إدارة رحلات الحواري

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedSocotraCompleteData() {
  console.log('🌱 ═══════════════════════════════════════════');
  console.log('   HAWARI TOURS - Complete Socotra Data Seeding');
  console.log('═══════════════════════════════════════════');

  try {
    // ═══════════════════════════════════════════════════
    // 👤 Users - Expanded with realistic profiles
    // ═══════════════════════════════════════════════════
    console.log('\n👤 Creating comprehensive users...');
    
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

    const guideUser = await prisma.user.create({
      data: {
        email: 'guide@hawaritours.com',
        name: 'دليل سياحي',
        password: await bcrypt.hash('guide123456', 10),
        role: 'STAFF',
        isActive: true,
        emailVerified: true
      }
    });

    const customers = await Promise.all([
      prisma.user.create({
        data: {
          email: 'ahmed.alhamdani@gmail.com',
          name: 'أحمد الحمياني',
          password: await bcrypt.hash('customer123', 10),
          role: 'USER',
          phone: '+967 771 234 567',
          isActive: true,
          emailVerified: true
        }
      }),
      prisma.user.create({
        data: {
          email: 'fatima.yemen@yahoo.com',
          name: 'فاطمة اليمنية',
          password: await bcrypt.hash('customer123', 10),
          role: 'USER',
          phone: '+967 772 345 678',
          isActive: true,
          emailVerified: true
        }
      }),
      prisma.user.create({
        data: {
          email: 'abdullah.tourist@hotmail.com',
          name: 'عبدالله السائح',
          password: await bcrypt.hash('customer123', 10),
          role: 'USER',
          phone: '+967 773 456 789',
          isActive: true,
          emailVerified: true
        }
      }),
      prisma.user.create({
        data: {
          email: 'maria.explorer@gmail.com',
          name: 'Maria Explorer',
          password: await bcrypt.hash('customer123', 10),
          role: 'USER',
          phone: '+44 20 1234 5678',
          isActive: true,
          emailVerified: true
        }
      }),
      prisma.user.create({
        data: {
          email: 'john.adventurer@yahoo.com',
          name: 'John Adventurer',
          password: await bcrypt.hash('customer123', 10),
          role: 'USER',
          phone: '+1 555 123 4567',
          isActive: true,
          emailVerified: true
        }
      }),
      prisma.user.create({
        data: {
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

    console.log(`✅ Created ${3 + 6} users`);

    // ═══════════════════════════════════════════════════
    // ✈️ Comprehensive Socotra Tours
    // ═══════════════════════════════════════════════════
    console.log('\n✈️ Creating comprehensive Socotra tours...');
    
    const tours = await Promise.all([
      // جولة دروبان الساحرة
      prisma.tour.create({
        data: {
          title: 'Dragon Blood Trees & Homhil Plateau',
          titleAr: 'أشجار دم التنين وهضبة حوميل',
          slug: 'dragon-blood-trees-homhil',
          description: 'Discover the iconic Dragon Blood Trees and the stunning Homhil plateau. This UNESCO World Heritage tour takes you through Socotra\'s most famous natural wonder, where you\'ll witness trees that look like they belong to another planet. The plateau offers breathtaking panoramic views of the island\'s unique landscape.',
          descriptionAr: 'اكتشف أشجار دم التنين الأسطورية وهضبة حوميل الخلابة. هذه الجولة التراثية العالمية لليونسكو تأخذك عبر أروع عجائب سقطرى الطبيعية، حيث ستشاهد أشجاراً تبدو وكأنها تنتمي إلى كوكب آخر. الهضبة تقدم إطلالات بانورامية مذهلة على المناظر الطبيعية الفريدة للجزيرة.',
          price: 349.99,
          duration: 4,
          maxPeople: 12,
          difficulty: 'MODERATE',
          category: 'NATURE',
          featured: true,
          isActive: true,
          coverImage: '/img/tours/dragon-blood-main.jpg',
          cardImage: '/img/tours/dragon-blood-card.jpg',
          images: [
            '/img/tours/dragon-blood-1.jpg',
            '/img/tours/dragon-blood-2.jpg',
            '/img/tours/dragon-blood-3.jpg',
            '/img/tours/homhil-1.jpg',
            '/img/tours/homhil-2.jpg'
          ],
          videoUrl: 'https://www.youtube.com/watch?v=socotra-dragon',
          location: 'Homhil Protected Area',
          locationAr: 'منطقة حوميل المحمية',
          latitude: 12.4833,
          longitude: 53.9833,
          itinerary: {
            day1: 'Arrival at Hadibu airport, transfer to hotel, evening orientation about Socotra\'s unique ecosystem',
            day2: 'Early morning hike to Dragon Blood Trees forest, picnic lunch among ancient trees, explore Homhil plateau viewpoints',
            day3: 'Full day exploration of rare endemic plants, visit Frankincense trees, swim in natural pools',
            day4: 'Morning visit to local Socotri village, transfer to airport, departure'
          },
          includes: [
            'Airport transfers',
            '3 nights accommodation',
            'Professional English/Arabic speaking guide',
            'All meals (local Socotri cuisine)',
            'Entrance fees to protected areas',
            '4WD transportation',
            'Bottled water throughout tour',
            'Photography guide assistance'
          ],
          excludes: [
            'International flights to Socotra',
            'Travel insurance',
            'Personal expenses',
            'Tips for guide and driver',
            'Alcoholic beverages',
            'Souvenirs and personal shopping'
          ],
          features: [
            'UNESCO World Heritage Site',
            'Professional Photography Sessions',
            'Small Group Size (max 12)',
            'Expert Local Guide',
            'Authentic Socotri Cultural Experience',
            'Endemic Plant Species Education'
          ],
          featuresAr: [
            'موقع تراث عالمي لليونسكو',
            'جلسات تصوير احترافية',
            'مجموعات صغيرة (كحد أقصى 12)',
            'دليل محلي خبير',
            'تجربة ثقافية سقطرية أصيلة',
            'تعليم عن الأنواع النباتية المستوطنة'
          ],
          metaTitle: 'Dragon Blood Trees Tour - Socotra UNESCO Heritage',
          metaDescription: 'Experience the magical Dragon Blood Trees of Socotra on this comprehensive 4-day UNESCO World Heritage tour.',
          keywords: ['dragon blood trees', 'socotra', 'unesco', 'homhil plateau', 'endemic plants'],
          rating: 4.9,
          reviewsCount: 47,
          bookingsCount: 234,
          viewsCount: 1856
        }
      }),

      // جولة شواطئ قلانسيا
      prisma.tour.create({
        data: {
          title: 'Qalansiyah Beach & Detwah Lagoon Paradise',
          titleAr: 'شواطئ قلانسيا وبحيرة دتوة',
          slug: 'qalansiyah-beach-detwah-lagoon',
          description: 'Experience paradise at Qalansiyah Beach and the stunning Detwah Lagoon. This tour combines pristine white sand beaches, crystal-clear turquoise waters, and one of the most beautiful lagoons in the Indian Ocean. Perfect for swimming, snorkeling, and relaxation.',
          descriptionAr: 'اختبر الجنة على شواطئ قلانسيا وبحيرة دتوة الخلابة. هذه الجولة تجمع بين الشواطئ الرملية البيضاء النقية والمياه الفيروزية الصافية وأحد أجمل البحيرات في المحيط الهندي. مثالية للسباحة والغوص والاسترخاء.',
          price: 279.99,
          duration: 3,
          maxPeople: 15,
          difficulty: 'EASY',
          category: 'BEACH',
          featured: true,
          isActive: true,
          coverImage: '/img/tours/qalansiyah-main.jpg',
          images: [
            '/img/tours/qalansiyah-beach-1.jpg',
            '/img/tours/qalansiyah-beach-2.jpg',
            '/img/tours/detwah-lagoon-1.jpg',
            '/img/tours/detwah-lagoon-2.jpg',
            '/img/tours/qalansiyah-village.jpg'
          ],
          videoUrl: 'https://www.youtube.com/watch?v=qalansiyah-beach',
          location: 'Qalansiyah Village & Detwah Lagoon',
          locationAr: 'قرية قلانسيا وبحيرة دتوة',
          latitude: 12.1833,
          longitude: 43.4833,
          itinerary: {
            day1: 'Transfer to Qalansiyah, check-in at beach hotel, sunset beach walk',
            day2: 'Morning swim at Qalansiyah Beach, afternoon visit to Detwah Lagoon for snorkeling, fresh seafood lunch',
            day3: 'Free morning for beach activities, visit traditional fishing village, transfer back to Hadibu'
          },
          includes: [
            'Beach transfers from Hadibu',
            '2 nights beachfront accommodation',
            'Daily fresh seafood lunch',
            'Professional snorkeling equipment',
            'Beach guide service',
            'Traditional fishing boat experience',
            'Sunset photography session'
          ],
          excludes: [
            'Transportation to/from Socotra',
            'Travel insurance',
            'Personal expenses',
            'Water sports equipment rental',
            'Alcoholic beverages'
          ],
          features: [
            'Pristine White Sand Beaches',
            'Crystal Clear Turquoise Waters',
            'Professional Snorkeling Guide',
            'Traditional Fishing Village Visit',
            'Fresh Seafood Dining Experience',
            'Sunset Photography Opportunities'
          ],
          featuresAr: [
            'شواطئ رملية بيضاء نقية',
            'مياه فيروزية صافية',
            'دليل غوص احترافي',
            'زيارة قرية صيد تقليدية',
            'تجربة تناول مأكولات بحرية طازجة',
            'فرص تصوير الغروب'
          ],
          metaTitle: 'Qalansiyah Beach & Detwah Lagoon - Socotra Paradise',
          metaDescription: 'Discover paradise at Qalansiyah Beach and Detwah Lagoon with pristine beaches and crystal-clear waters.',
          keywords: ['qalansiyah', 'detwah lagoon', 'socotra beach', 'snorkeling', 'paradise beach'],
          rating: 4.8,
          reviewsCount: 63,
          bookingsCount: 189,
          viewsCount: 2341
        }
      }),

      // جولة جبال حجير
      prisma.tour.create({
        data: {
          title: 'Hajhir Mountains Peak Adventure',
          titleAr: 'مغامرة قمم جبال حجير',
          slug: 'hajhir-mountains-peak-adventure',
          description: 'Conquer Socotra\'s highest peaks in this challenging mountain adventure. The Hajhir Mountains offer breathtaking panoramic views, rare endemic flora, and the ultimate trekking experience. This tour is for serious adventurers seeking to explore Socotra\'s rugged interior.',
          descriptionAr: 'تسلق أعلى قمم سقطرى في هذه المغامرة الجبلية التحدي. جبال حجير تقدم إطلالات بانورامية مذهلة ونباتات نادرة مستوطنة وتجربة تسلق نهائية. هذه الجولة للمغامرين الجادين الذين يسعون لاستكشاف الداخل الوعر لسقطرى.',
          price: 449.99,
          duration: 5,
          maxPeople: 8,
          difficulty: 'CHALLENGING',
          category: 'ADVENTURE',
          featured: false,
          isActive: true,
          coverImage: '/img/tours/hajhir-mountains-main.jpg',
          images: [
            '/img/tours/hajhir-peak-1.jpg',
            '/img/tours/hajhir-peak-2.jpg',
            '/img/tours/hajhir-trek-1.jpg',
            '/img/tours/hajhir-camp-1.jpg',
            '/img/tours/hajhir-sunrise.jpg'
          ],
          videoUrl: 'https://www.youtube.com/watch?v=hajhir-mountains',
          location: 'Hajhir Mountains Range',
          locationAr: 'سلسلة جبال حجير',
          latitude: 12.5333,
          longitude: 54.0333,
          itinerary: {
            day1: 'Preparation day in Hadibu, equipment check, briefing about mountain conditions',
            day2: 'Begin trek to base camp, acclimatization hike, evening mountain orientation',
            day3: 'Summit attempt on highest peak, spectacular sunrise views, celebration at peak',
            day4: 'Explore mountain valleys, discover endemic plant species, waterfall visits',
            day5: 'Descent to Hadibu, celebration dinner, certificate presentation'
          },
          includes: [
            'Professional mountain guide',
            '4 nights mountain camping',
            'All camping equipment (tents, sleeping bags)',
            'All meals during trek',
            'Climbing safety equipment',
            'First aid kit and emergency supplies',
            'Porter service for equipment',
            'Summit certificate'
          ],
          excludes: [
            'Personal climbing equipment',
            'Travel insurance',
            'Personal medications',
            'Tips for mountain crew',
            'Emergency evacuation costs'
          ],
          features: [
            'Summit Socotra\'s Highest Peak',
            'Professional Mountain Guide',
            'Overnight Mountain Camping',
            'Endemic Flora Discovery',
            'Sunrise Photography from Peak',
            'Adventure Certificate'
          ],
          featuresAr: [
            'تسلق أعلى قمة في سقطرى',
            'دليل جبلي محترف',
            'تخييم جبلي ليلي',
            'اكتشاف النباتات المستوطنة',
            'تصوير شروق الشمس من القمة',
            'شهادة مغامرة'
          ],
          metaTitle: 'Hajhir Mountains Peak Adventure - Socotra Trekking',
          metaDescription: 'Challenge yourself with the ultimate Socotra mountain adventure to the highest peaks of Hajhir Mountains.',
          keywords: ['hajhir mountains', 'socotra trekking', 'mountain climbing', 'adventure tour', 'peak challenge'],
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
          description: 'Explore the magnificent Hoq Cave, one of the largest cave systems in the Middle East, with stunning stalactites and ancient inscriptions. Combined with the beautiful Dixam Plateau, this tour offers a perfect blend of adventure, history, and natural beauty.',
          descriptionAr: 'استكشف كهف حوق المذهل، أحد أكبر أنظمة الكهوف في الشرق الأوسط، مع تتاليت رائعة ونقوش قديمة. مجتمعة مع هضبة دكسام الجميلة، هذه الجولة توفر مزيجاً مثالياً من المغامرة والتاريخ والجمال الطبيعي.',
          price: 319.99,
          duration: 3,
          maxPeople: 10,
          difficulty: 'MODERATE',
          category: 'ADVENTURE',
          featured: true,
          isActive: true,
          coverImage: '/img/tours/hoq-cave-main.jpg',
          images: [
            '/img/tours/hoq-cave-entrance.jpg',
            '/img/tours/hoq-cave-stalactites.jpg',
            '/img/tours/hoq-cave-inscriptions.jpg',
            '/img/tours/dixam-plateau-1.jpg',
            '/img/tours/dixam-plateau-2.jpg'
          ],
          videoUrl: 'https://www.youtube.com/watch?v=hoq-cave',
          location: 'Hoq Cave & Dixam Plateau',
          locationAr: 'كهف حوق وهضبة دكسام',
          latitude: 12.4333,
          longitude: 53.9333,
          itinerary: {
            day1: 'Morning transfer to Dixam Plateau, acclimatization hike, evening at plateau camp',
            day2: 'Full day exploring Hoq Cave system, ancient inscriptions study, geological formations',
            day3: 'Sunrise at Dixam Plateau, traditional Socotri village visit, return to Hadibu'
          },
          includes: [
            'Professional cave guide',
            '2 nights accommodation',
            'Cave exploration equipment',
            'Safety gear and helmets',
            'All meals',
            'Transportation to cave sites',
            'Archaeological guide explanations'
          ],
          excludes: [
            'Personal flashlights',
            'Travel insurance',
            'Cave photography equipment',
            'Tips for guides'
          ],
          features: [
            'Ancient Cave Inscriptions',
            'Stunning Stalactite Formations',
            'Archaeological Significance',
            'Plateau Panoramic Views',
            'Professional Cave Guide',
            'Historical Education'
          ],
          featuresAr: [
            'نقوش كهف قديمة',
            'تشكلات تتاليت مذهلة',
            'أهمية أثرية',
            'إطلالات بانورامية من الهضبة',
            'دليل كهوف محترف',
            'تعليم تاريخي'
          ],
          metaTitle: 'Hoq Cave & Dixam Plateau - Socotra Adventure',
          metaDescription: 'Explore Socotra\'s magnificent Hoq Cave and beautiful Dixam Plateau on this historical adventure tour.',
          keywords: ['hoq cave', 'dixam plateau', 'socotra caves', 'archaeology', 'adventure'],
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
          description: 'Discover the underwater paradise of Dihamri Marine Sanctuary, home to some of the most pristine coral reefs in the Indian Ocean. This snorkeling adventure offers encounters with colorful tropical fish, sea turtles, and vibrant coral gardens in crystal-clear waters.',
          descriptionAr: 'اكتشف الجنة تحت الماء في محمية Dihamri البحرية، موطن لبعض الشعاب المرجانية النقية في المحيط الهندي. هذه المغامرة الغوصية توفر لقاءات مع أسماك استوائية ملونة، السلاحف البحرية، والحدائق المرجانية النابضة بالحياة في مياه صافية.',
          price: 189.99,
          duration: 2,
          maxPeople: 12,
          difficulty: 'EASY',
          category: 'BEACH',
          featured: false,
          isActive: true,
          coverImage: '/img/tours/dihamri-marine-main.jpg',
          images: [
            '/img/tours/dihamri-coral-1.jpg',
            '/img/tours/dihamri-fish-1.jpg',
            '/img/tours/dihamri-turtle.jpg',
            '/img/tours/dihamri-beach.jpg',
            '/img/tours/dihamri-snorkeling.jpg'
          ],
          videoUrl: 'https://www.youtube.com/watch?v=dihamri-marine',
          location: 'Dihamri Marine Sanctuary',
          locationAr: 'محمية Dihamri البحرية',
          latitude: 12.3833,
          longitude: 53.8833,
          itinerary: {
            day1: 'Morning transfer to Dihamri, beach orientation, first snorkeling session',
            day2: 'Full day snorkeling at different reef sites, marine life education, sunset beach time'
          },
          includes: [
            'Professional snorkeling guide',
            '1 night beach accommodation',
            'All snorkeling equipment',
            'Marine life education',
            'Boat transfers to reef sites',
            'Underwater photography assistance',
            'Marine conservation fee'
          ],
          excludes: [
            'Personal snorkeling gear',
            'Underwater camera rental',
            'Travel insurance',
            'Marine park entrance fees'
          ],
          features: [
            'Pristine Coral Reefs',
            'Tropical Fish Encounters',
            'Sea Turtle Sightings',
            'Marine Biology Guide',
            'Conservation Education',
            'Crystal Clear Waters'
          ],
          featuresAr: [
            'شعاب مرجانية نقية',
            'لقاءات مع أسماك استوائية',
            'مشاهدة السلاحف البحرية',
            'دليل أحياء بحرية',
            'تعليم الحفاظ على البيئة',
            'مياه صافية'
          ],
          metaTitle: 'Dihamri Marine Sanctuary - Socotra Snorkeling Paradise',
          metaDescription: 'Experience the best snorkeling in Socotra at Dihamri Marine Sanctuary with pristine coral reefs and marine life.',
          keywords: ['dihamri', 'marine sanctuary', 'socotra snorkeling', 'coral reefs', 'marine life'],
          rating: 4.8,
          reviewsCount: 41,
          bookingsCount: 156,
          viewsCount: 1456
        }
      }),

      // جولة شجرة اللبان
      prisma.tour.create({
        data: {
          title: 'Frankincense Trail & Traditional Villages',
          titleAr: 'مسار اللبان والقرى التقليدية',
          slug: 'frankincense-traditional-villages',
          description: 'Follow the ancient frankincense trail through Socotra\'s traditional villages. Learn about the island\'s famous frankincense trees, meet local Socotri families, and experience authentic island culture. This cultural tour offers deep insights into Socotra\'s heritage and traditional way of life.',
          descriptionAr: 'اتبع مسار اللبان القديم عبر القرى التقليدية في سقطرى. تعرف عن أشجار اللبان الشهيرة في الجزيرة، التقِ بعائلات سقطرية محلية، واختبر الثقافة الجزيرة الأصيلة. هذه الجولة الثقافية توفر رؤى عميفة عن تراث سقطرى وطريقة الحياة التقليدية.',
          price: 229.99,
          duration: 3,
          maxPeople: 15,
          difficulty: 'EASY',
          category: 'CULTURAL',
          featured: false,
          isActive: true,
          coverImage: '/img/tours/frankincense-main.jpg',
          images: [
            '/img/tours/frankincense-trees-1.jpg',
            '/img/tours/frankincense-harvest.jpg',
            '/img/tours/socotri-village-1.jpg',
            '/img/tours/traditional-house.jpg',
            '/img/tours/local-crafts.jpg'
          ],
          videoUrl: 'https://www.youtube.com/watch?v=frankincense-trail',
          location: 'Traditional Socotri Villages',
          locationAr: 'القرى التقليدية السقطرية',
          latitude: 12.4333,
          longitude: 53.9333,
          itinerary: {
            day1: 'Visit Hadibu souk, introduction to Socotri culture, evening with local family',
            day2: 'Frankincense tree forest tour, harvesting demonstration, traditional lunch with villagers',
            day3: 'Craft workshop, traditional music experience, farewell ceremony'
          },
          includes: [
            'Cultural guide',
            '2 nights accommodation',
            'Homestay with local family',
            'Traditional meals',
            'Frankincense harvesting demonstration',
            'Craft workshop participation',
            'Cultural performances'
          ],
          excludes: [
            'Souvenir purchases',
            'Personal gifts for hosts',
            'Travel insurance',
            'Tips for cultural guides'
          ],
          features: [
            'Authentic Cultural Experience',
            'Traditional Homestay',
            'Frankincense Harvesting',
            'Local Craft Workshops',
            'Traditional Music & Dance',
            'Local Family Interactions'
          ],
          featuresAr: [
            'تجربة ثقافية أصيلة',
            'إقامة تقليدية',
            'حصاد اللبان',
            'ورش حرف محلية',
            'موسيقى ورقص تقليدي',
            'تفاعلات مع عائلات محلية'
          ],
          metaTitle: 'Frankincense Trail - Traditional Socotri Culture Tour',
          metaDescription: 'Experience authentic Socotri culture through traditional villages, frankincense harvesting, and local family homestays.',
          keywords: ['frankincense', 'socotri culture', 'traditional villages', 'cultural tour', 'authentic experience'],
          rating: 4.7,
          reviewsCount: 29,
          bookingsCount: 78,
          viewsCount: 876
        }
      })
    ]);

    console.log(`✅ Created ${tours.length} comprehensive tours`);

    // ═══════════════════════════════════════════════════
    // 🏨 Comprehensive Hotels Data
    // ═══════════════════════════════════════════════════
    console.log('\n🏨 Creating comprehensive hotels...');
    
    const hotels = await Promise.all([
      prisma.hotel.create({
        data: {
          name: 'Socotra Paradise Beach Resort',
          nameAr: 'منتجع سقطرى Paradise الشاطئي',
          slug: 'socotra-paradise-beach-resort',
          description: 'Luxury beachfront resort offering stunning ocean views, infinity pool, world-class spa, and gourmet dining. Located on the pristine beaches of Hadibu, this resort combines modern luxury with authentic Socotri hospitality. Perfect for romantic getaways, family vacations, and business travelers seeking the ultimate Socotra experience.',
          descriptionAr: 'منتجع شاطئي فاخر يقدم إطلالات محيطية مذهلة ومسبحاً لا نهائياً وسبا عالمي المستوى وتعليمًا فاخرًا. يقع على الشواطئ النقية في حديبو، يجمع هذا المنتجع الفخامة العصرية مع الضيافة السقطرية الأصيلة. مثالي للهروب الرومانسي والعطلات العائلية والمسافرين التجاريين الذين يبحثون عن تجربة سقطرى النهائية.',
          shortDescription: 'Ultimate luxury beachfront paradise',
          shortDescriptionAr: 'جنة شاطئية فاخرة نهائية',
          pricePerNight: 485.00,
          discount: 15,
          rating: 4.9,
          reviewsCount: 187,
          roomsCount: 48,
          status: 'ACTIVE',
          featured: true,
          coverImage: '/img/hotels/paradise-resort-main.jpg',
          images: [
            '/img/hotels/paradise-beach-1.jpg',
            '/img/hotels/paradise-pool-1.jpg',
            '/img/hotels/paradise-spa-1.jpg',
            '/img/hotels/paradise-room-1.jpg',
            '/img/hotels/paradise-dining-1.jpg',
            '/img/hotels/paradise-sunset-1.jpg'
          ],
          videoUrl: 'https://www.youtube.com/watch?v=paradise-resort',
          location: 'Hadibu Beach Front',
          locationAr: 'واجهة شاطئ حديبو',
          latitude: 12.4833,
          longitude: 53.9833,
          amenities: [
            'Free High-Speed WiFi',
            'Infinity Ocean Pool',
            'World-Class Spa & Wellness Center',
            'Private Beach Access',
            'Gourmet Seafood Restaurant',
            'Rooftop Sky Bar',
            'Modern Fitness Center',
            '24/7 Room Service',
            'Business Center & Meeting Rooms',
            'Airport Shuttle Service',
            'Kids Club & Playground',
            'Dive Center',
            'Gift Shop',
            'Laundry Service',
            'Doctor on Call',
            'Multilingual Staff',
            'Concierge Services'
          ],
          highlights: [
            'Direct Beach Access',
            'Sunset Ocean Views',
            'Award-Winning Spa',
            'Fine Dining Restaurant',
            'Infinity Pool Experience',
            'Luxury Spa Treatments',
            'Private Beach Cabanas',
            'Professional Dive Center'
          ],
          highlightsAr: [
            'وصول مباشر للشاطئ',
            'إطلالات غروب المحيط',
            'سبا حائز على جوائز',
            'مطعم فاخر',
            'تجربة المسبح اللانهائي',
            'علاجات سبا فاخرة',
            'كبائن شاطئية خاصة',
            'مركز غوص احترافي'
          ],
          checkInTime: '14:00',
          checkOutTime: '12:00',
          cancellationPolicy: 'Free cancellation up to 48 hours before check-in. 50% refund for cancellations 24-48 hours before. No refund for cancellations less than 24 hours.',
          cancellationPolicyAr: 'إلغاء مجاني حتى 48 ساعة قبل تسجيل الوصول. استرداد 50% للإلغاءات 24-48 ساعة قبل. لا استرداد للإلغاءات أقل من 24 ساعة.',
          metaTitle: 'Socotra Paradise Beach Resort - Luxury Beachfront Accommodation',
          metaDescription: 'Experience ultimate luxury at Socotra\'s premier beachfront resort with stunning ocean views and world-class amenities.',
          keywords: ['luxury resort', 'beach hotel', 'socotra paradise', 'infinity pool', 'spa resort'],
          viewsCount: 3456
        }
      }),

      prisma.hotel.create({
        data: {
          name: 'Dragon\'s View Eco Lodge',
          nameAr: 'نزل Dragon\'s View البيئي',
          slug: 'dragons-view-eco-lodge',
          description: 'Eco-friendly lodge offering authentic Socotri architecture and modern comforts. Located near the famous Dragon Blood Trees forest, this lodge provides a perfect blend of sustainability and comfort. Experience traditional Socotri hospitality while enjoying modern amenities and stunning natural views.',
          descriptionAr: 'نزل صديق للبيئة يقدم عمارة سقطرية تقليدية وراحة عصرية. يقع بالقرب من غابة أشجار دم التنين الشهيرة، يوفر هذا النزل مزيجاً مثالياً من الاستدامة والراحة. اختبر الضيافة السقطرية التقليدية مع الاستمتاع بالمرافق العصرية والمناظر الطبيعية المذهلة.',
          shortDescription: 'Sustainable luxury with dragon tree views',
          shortDescriptionAr: 'فخامة مستدامة مع إطلالات أشجار التنين',
          pricePerNight: 295.00,
          discount: 10,
          rating: 4.7,
          reviewsCount: 124,
          roomsCount: 24,
          status: 'ACTIVE',
          featured: true,
          coverImage: '/img/hotels/dragons-view-main.jpg',
          images: [
            '/img/hotels/dragons-view-exterior.jpg',
            '/img/hotels/dragons-view-room.jpg',
            '/img/hotels/dragons-view-dining.jpg',
            '/img/hotels/dragons-view-garden.jpg',
            '/img/hotels/dragons-view-dragon-trees.jpg'
          ],
          videoUrl: 'https://www.youtube.com/watch?v=dragons-eco-lodge',
          location: 'Near Homhil Dragon Trees',
          locationAr: 'بالقرب من أشجار دم التنين في حوميل',
          latitude: 12.4533,
          longitude: 53.9533,
          amenities: [
            'Solar Power System',
            'Organic Garden Restaurant',
            'Traditional Architecture',
            'Cultural Library',
            'Nature Guide Service',
            'Complimentary Breakfast',
            'Eco-Friendly Toiletries',
            'Rainwater Harvesting',
            'Bird Watching Tours',
            'Traditional Craft Workshops',
            'WiFi in Common Areas',
            'Mountain Bike Rentals',
            'Meditation Garden',
            'Campfire Area',
            'Local Art Gallery'
          ],
          highlights: [
            'Dragon Trees View',
            'Eco-Friendly Operations',
            'Traditional Socotri Architecture',
            'Organic Local Cuisine',
            'Nature Guided Tours',
            'Cultural Immersion Experience',
            'Sustainable Tourism',
            'Authentic Local Experience'
          ],
          highlightsAr: [
            'إطلالة أشجار التنين',
            'عمليات صديقة للبيئة',
            'عمارة سقطرية تقليدية',
            'مطبخ عضوي محلي',
            'جولات طبيعة موجهة',
            'تجربة انغماس ثقافي',
            'سياحة مستدامة',
            'تجربة محلية أصيلة'
          ],
          checkInTime: '15:00',
          checkOutTime: '11:00',
          cancellationPolicy: 'Free cancellation up to 72 hours before check-in. 25% cancellation fee for less than 72 hours notice.',
          cancellationPolicyAr: 'إلغاء مجاني حتى 72 ساعة قبل تسجيل الوصول. رسوم إلغاء 25% لإشعار أقل من 72 ساعة.',
          metaTitle: 'Dragon\'s View Eco Lodge - Sustainable Socotri Experience',
          metaDescription: 'Experience authentic Socotri culture at our eco-friendly lodge with stunning dragon tree views and sustainable practices.',
          keywords: ['eco lodge', 'sustainable tourism', 'dragon trees', 'socotri culture', 'authentic experience'],
          viewsCount: 2341
        }
      }),

      prisma.hotel.create({
        data: {
          name: 'Qalansiyah Beach Hotel',
          nameAr: 'فندق شاطئ قلانسيا',
          slug: 'qalansiyah-beach-hotel',
          description: 'Charming beachfront hotel offering comfortable accommodation and direct beach access. Located in the fishing village of Qalansiyah, this hotel provides an authentic local experience with modern comforts. Perfect for budget-conscious travelers who want to experience the real Socotra beach lifestyle.',
          descriptionAr: 'فندق شاطئي ساحر يقدم إقامة مريحة ووصول مباشر للشاطئ. يقع في قرية الصيد قلانسيا، يوفر هذا الفندق تجربة محلية أصيلة مع راحة عصرية. مثالي للمسافرين ذوي الميزانية المحدودة الذين يرغبون في تجربة نمط الحياة الشاطئية الحقيقي في سقطرى.',
          shortDescription: 'Authentic beachfront local experience',
          shortDescriptionAr: 'تجربة شاطئية محلية أصيلة',
          pricePerNight: 145.00,
          discount: 5,
          rating: 4.3,
          reviewsCount: 198,
          roomsCount: 18,
          status: 'ACTIVE',
          featured: false,
          coverImage: '/img/hotels/qalansiyah-beach-main.jpg',
          images: [
            '/img/hotels/qalansiyah-exterior.jpg',
            '/img/hotels/qalansiyah-room.jpg',
            '/img/hotels/qalansiyah-beach-view.jpg',
            '/img/hotels/qalansiyah-dining.jpg',
            '/img/hotels/qalansiyah-village.jpg'
          ],
          videoUrl: 'https://www.youtube.com/watch?v=qalansiyah-hotel',
          location: 'Qalansiyah Fishing Village',
          locationAr: 'قرية الصيد قلانسيا',
          latitude: 12.1833,
          longitude: 43.4833,
          amenities: [
            'Beach Front Location',
            'Free WiFi',
            'Traditional Restaurant',
            'Beach Access',
            'Complimentary Breakfast',
            'Parking Area',
            'Tour Desk',
            'Laundry Service',
            'Airport Transfer',
            'Local Guide Arrangement',
            'Fishing Equipment Rental',
            'Beach Chairs & Umbrellas'
          ],
          highlights: [
            'Direct Beach Access',
            'Traditional Fishing Village',
            'Local Seafood Restaurant',
            'Budget Friendly Rates',
            'Authentic Local Experience',
            'Fishing Village Life',
            'Beach Activities',
            'Cultural Immersion'
          ],
          highlightsAr: [
            'وصول مباشر للشاطئ',
            'قرية صيد تقليدية',
            'مطعم مأكولات بحرية محلية',
            'أسعار ميسورة',
            'تجربة محلية أصيلة',
            'حياة قرية الصيد',
            'أنشطة شاطئية',
            'انغماس ثقافي'
          ],
          checkInTime: '14:00',
          checkOutTime: '12:00',
          cancellationPolicy: 'Free cancellation up to 24 hours before check-in.',
          cancellationPolicyAr: 'إلغاء مجاني حتى 24 ساعة قبل تسجيل الوصول.',
          metaTitle: 'Qalansiyah Beach Hotel - Authentic Socotri Beach Experience',
          metaDescription: 'Experience authentic Socotri beach life at our charming hotel in the traditional fishing village of Qalansiyah.',
          keywords: ['budget hotel', 'qalansiyah', 'beach hotel', 'fishing village', 'authentic experience'],
          viewsCount: 1567
        }
      }),

      prisma.hotel.create({
        data: {
          name: 'Hadibu City Hotel',
          nameAr: 'فندق مدينة حديبو',
          slug: 'hadibu-city-hotel',
          description: 'Modern city hotel located in the heart of Hadibu, offering comfortable rooms and convenient access to markets, restaurants, and government offices. Perfect for business travelers and those who want to experience urban Socotri life while having easy access to tour departure points.',
          descriptionAr: 'فندق حديث يقع في قلب حديبو، يقدم غرفاً مريحة ووصولاً مريحاً للأسواق والمطاعم والمكاتب الحكومية. مثالي للمسافرين التجاريين والذين يرغبون في تجربة الحياة الحضرية السقطرية مع الوصول السهل لنقاط انطلاق الجولات.',
          shortDescription: 'Modern comfort in Socotra\'s capital',
          shortDescriptionAr: 'راحة حديثة في عاصمة سقطرى',
          pricePerNight: 185.00,
          rating: 4.2,
          reviewsCount: 87,
          roomsCount: 32,
          status: 'ACTIVE',
          featured: false,
          coverImage: '/img/hotels/hadibu-city-main.jpg',
          images: [
            '/img/hotels/hadibu-exterior.jpg',
            '/img/hotels/hadibu-room.jpg',
            '/img/hotels/hadibu-dining.jpg',
            '/img/hotels/hadibu-city-view.jpg',
            '/img/hotels/hadibu-reception.jpg'
          ],
          videoUrl: 'https://www.youtube.com/watch?v=hadibu-city-hotel',
          location: 'Hadibu City Center',
          locationAr: 'مركز مدينة حديبو',
          latitude: 12.4833,
          longitude: 53.9833,
          amenities: [
            'City Center Location',
            'Free WiFi',
            'Business Center',
            'Conference Room',
            'Restaurant & Coffee Shop',
            'Room Service',
            'Laundry Service',
            'Airport Transfer',
            'Tour Booking Desk',
            'Currency Exchange',
            'Safe Deposit Boxes',
            '24-Hour Front Desk',
            'Parking Available',
            'Cable TV',
            'Air Conditioning'
          ],
          highlights: [
            'Central City Location',
            'Business Facilities',
            'Tour Booking Services',
            'Modern Amenities',
            'Airport Proximity',
            'Market Access',
            'Government Offices Nearby',
            'Professional Staff'
          ],
          highlightsAr: [
            'موقع مركزي في المدينة',
            'مرافق تجارية',
            'خدمات حجز الجولات',
            'مرافق عصرية',
            'قرب المطار',
            'وصول للأسواق',
            'قرب المكاتب الحكومية',
            'موظفين محترفين'
          ],
          checkInTime: '13:00',
          checkOutTime: '12:00',
          cancellationPolicy: 'Free cancellation up to 12 hours before check-in.',
          cancellationPolicyAr: 'إلغاء مجاني حتى 12 ساعة قبل تسجيل الوصول.',
          metaTitle: 'Hadibu City Hotel - Modern Comfort in Socotra Capital',
          metaDescription: 'Stay in the heart of Socotra\'s capital with modern amenities and convenient access to all city services.',
          keywords: ['city hotel', 'hadibu', 'business hotel', 'central location', 'modern amenities'],
          viewsCount: 987
        }
      }),

      prisma.hotel.create({
        data: {
          name: 'Detwah Lagoon Eco Resort',
          nameAr: 'منتجع بحيرة دتوة البيئي',
          slug: 'detwah-lagoon-eco-resort',
          description: 'Exclusive eco-resort situated on the shores of the stunning Detwah Lagoon. This intimate resort offers luxurious tents with modern amenities, direct lagoon access, and unparalleled views of one of Socotra\'s most beautiful natural wonders. Perfect for honeymooners and nature lovers seeking privacy and serenity.',
          descriptionAr: 'منتجع بيئي حصري يقع على ضفاف بحيرة دتوة الخلابة. يقدم هذا المنتجع الخاص خياماً فاخرة بمرافق عصرية ووصول مباشر للبحيرة وإطلالات لا مثيل لها على أحد أجمل العجائب الطبيعية في سقطرى. مثالي لشهر العسل ومحبي الطبيعة الباحثين عن الخصوصية والهدوء.',
          shortDescription: 'Exclusive lagoon-front luxury tents',
          shortDescriptionAr: 'خيام فاخرة حصرية على البحيرة',
          pricePerNight: 385.00,
          discount: 20,
          rating: 4.8,
          reviewsCount: 56,
          roomsCount: 12,
          status: 'ACTIVE',
          featured: true,
          coverImage: '/img/hotels/detwah-lagoon-main.jpg',
          images: [
            '/img/hotels/detwah-lagoon-view.jpg',
            '/img/hotels/detwah-luxury-tent.jpg',
            '/img/hotels/detwah-dining.jpg',
            '/img/hotels/detwah-sunset.jpg',
            '/img/hotels/detwah-activities.jpg'
          ],
          videoUrl: 'https://www.youtube.com/watch?v=detwah-lagoon-resort',
          location: 'Detwah Lagoon Shore',
          locationAr: 'ضفاف بحيرة دتوة',
          latitude: 12.2833,
          longitude: 43.5833,
          amenities: [
            'Luxury Safari Tents',
            'Private Lagoon Access',
            'Gourmet Dining',
            'Spa Services',
            'Yoga Platform',
            'Bird Watching Tours',
            'Kayak Rentals',
            'Sunset Cruises',
            'Private Beach Area',
            'Butler Service',
            'Wine & Dine Experience',
            'Stargazing Equipment',
            'Nature Library',
            'Organic Garden',
            'Eco-Friendly Operations'
          ],
          highlights: [
            'Exclusive Location',
            'Luxury Tent Accommodation',
            'Private Lagoon Access',
            'Gourmet Dining Experience',
            'Unparalleled Privacy',
            'Romantic Setting',
            'Nature Immersion',
            'Eco-Luxury Experience'
          ],
          highlightsAr: [
            'موقع حصري',
            'إقامة خيام فاخرة',
            'وصول خاص للبحيرة',
            'تجربة تعليم فاخرة',
            'خصوصية لا مثيل لها',
            'إعداد رومانسي',
            'انغماس في الطبيعة',
            'تجربة فخامة بيئية'
          ],
          checkInTime: '15:00',
          checkOutTime: '11:00',
          cancellationPolicy: 'Free cancellation up to 7 days before check-in. 50% refund for 3-7 days. No refund for less than 3 days.',
          cancellationPolicyAr: 'إلغاء مجاني حتى 7 أيام قبل تسجيل الوصول. استرداد 50% لمدة 3-7 أيام. لا استرداد لأقل من 3 أيام.',
          metaTitle: 'Detwah Lagoon Eco Resort - Exclusive Luxury Tents',
          metaDescription: 'Experience exclusive luxury in our eco-resort on Detwah Lagoon with premium tent accommodation and private lagoon access.',
          keywords: ['eco resort', 'detwah lagoon', 'luxury tents', 'exclusive accommodation', 'romantic getaway'],
          viewsCount: 1876
        }
      })
    ]);

    console.log(`✅ Created ${hotels.length} comprehensive hotels`);

    // ═══════════════════════════════════════════════════
    // 🚗 Comprehensive Cars Data
    // ═══════════════════════════════════════════════════
    console.log('\n🚗 Creating comprehensive cars...');
    
    const cars = await Promise.all([
      prisma.car.create({
        data: {
          name: 'Toyota Land Cruiser V8 4x4',
          nameAr: 'تويوتا لاند كروزر V8 4x4',
          slug: 'toyota-land-cruiser-v8',
          description: 'Premium V8 4x4 vehicle specifically designed for Socotra\'s challenging terrain. Features advanced off-road capabilities, luxury interior, and enhanced safety features. Perfect for exploring remote areas and mountain regions with maximum comfort and reliability.',
          descriptionAr: 'مركبة V8 4x4 فاخرة مصممة خصيصاً للتضاريس الصعبة في سقطرى. تتميز بقدرات متقدمة خارج الطريق ورفاهية داخلية وميزات أمان محسّنة. مثالية لاستكشاف المناطق النائية والجبلية بأقصى درجات الراحة والموثوقية.',
          brand: 'Toyota',
          type: 'SUV',
          year: 2023,
          pricePerDay: 175.00,
          discount: 15,
          seats: 7,
          doors: 5,
          transmission: 'Automatic',
          fuelType: 'Petrol',
          rating: 4.9,
          reviewsCount: 67,
          status: 'ACTIVE',
          featured: true,
          coverImage: '/img/cars/land-cruiser-v8-main.jpg',
          images: [
            '/img/cars/land-cruiser-v8-exterior.jpg',
            '/img/cars/land-cruiser-v8-interior.jpg',
            '/img/cars/land-cruiser-v8-offroad.jpg',
            '/img/cars/land-cruiser-v8-cargo.jpg'
          ],
          videoUrl: 'https://www.youtube.com/watch?v=land-cruiser-v8',
          features: [
            'V8 Engine Power',
            'Advanced 4WD System',
            'Leather Interior',
            'Climate Control AC',
            'GPS Navigation System',
            'Bluetooth Connectivity',
            'Cruise Control',
            'Safety Airbags',
            'ABS Brakes',
            'Rooftop Rack',
            'Tow Hitch',
            'Off-road Tires',
            'Winch Capability',
            'Premium Audio System',
            'USB Charging Ports'
          ],
          featuresAr: [
            'قوة محرك V8',
            'نظام دفع رباعي متقدم',
            'داخلية جلدية',
            'تكييف هواء متقدم',
            'نظام ملاحة GPS',
            'اتصال بلوتوث',
            'تحكم في السرعة',
            'وسائد هوائية',
            'فرامل ABS',
            'رفوف سقف',
            'قطر سحب',
            'إطارات خارج الطريق',
            'قدرة ونش',
            'نظام صوتي فاخر',
            'منافذ شحن USB'
          ],
          insurance: 'Comprehensive Plus',
          insuranceAr: 'شامل زائد',
          mileage: 'Unlimited',
          mileageAr: 'غير محدود',
          color: 'Pearl White',
          colorAr: 'أبيض لؤلؤي',
          minAge: 25,
          deposit: 600.00,
          luggage: 5,
          metaTitle: 'Toyota Land Cruiser V8 - Premium 4x4 Rental Socotra',
          metaDescription: 'Rent our premium Toyota Land Cruiser V8 for ultimate comfort and capability on Socotra\'s challenging terrain.',
          keywords: ['toyota land cruiser', 'v8 4x4', 'premium suv', 'socotra off-road', 'luxury rental'],
          viewsCount: 2876
        }
      }),

      prisma.car.create({
        data: {
          name: 'Nissan Patrol GR 4x4',
          nameAr: 'نيسان باترول GR 4x4',
          slug: 'nissan-patrol-gr-4x4',
          description: 'Robust and reliable 4x4 built for serious off-road adventures. The Nissan Patrol GR offers exceptional ground clearance, powerful engine, and proven durability. Ideal for mountain expeditions, desert crossing, and exploring Socotra\'s most remote locations.',
          descriptionAr: '4x4 قوي وموثيق مبني للمغامرات الجادة خارج الطريق. نيسان باترول GR يقدم ارض واضح استثنائي ومحركاً قوياً ومتانة مثبتة. مثالي للبعثات الجبلية وعبور الصحراء واستكشاف أكثر المواقع نائية في سقطرى.',
          brand: 'Nissan',
          type: '4x4',
          year: 2022,
          pricePerDay: 155.00,
          discount: 10,
          seats: 8,
          doors: 5,
          transmission: 'Manual',
          fuelType: 'Petrol',
          rating: 4.7,
          reviewsCount: 45,
          status: 'ACTIVE',
          featured: true,
          coverImage: '/img/cars/patrol-gr-main.jpg',
          images: [
            '/img/cars/patrol-gr-exterior.jpg',
            '/img/cars/patrol-gr-interior.jpg',
            '/img/cars/patrol-gr-mountain.jpg',
            '/img/cars/patrol-gr-cargo.jpg'
          ],
          videoUrl: 'https://www.youtube.com/watch?v=patrol-gr',
          features: [
            'Heavy Duty 4WD',
            'High Ground Clearance',
            'Spacious 8-Seater',
            'Manual Transmission',
            'Power Steering',
            'Air Conditioning',
            'CD Player',
            'Roof Rack',
            'Tow Bar',
            'All-Terrain Tires',
            'Winch Ready',
            'Skid Plates',
            'Fog Lights',
            'Cargo Space',
            'Side Steps'
          ],
          featuresAr: [
            'دفع رباعي ثقيل',
            'ارض واضح عالي',
            '8 مقاعد واسع',
            'نقل يدوي',
            'توجيه بالقوة',
            'تكييف هواء',
            'مشغل CD',
            'رفوف سقف',
            'قضيب سحب',
            'إطارات كل التضاريس',
            'جاهز للونش',
            'ألواح وقاية',
            'أضواء ضباب',
            'مساحة شحن',
            'درجات جانبية'
          ],
          insurance: 'Comprehensive',
          insuranceAr: 'شامل',
          mileage: '400km/day',
          mileageAr: '400 كم/يوم',
          color: 'Desert Sand',
          colorAr: 'رمل صحراوي',
          minAge: 23,
          deposit: 450.00,
          luggage: 7,
          metaTitle: 'Nissan Patrol GR 4x4 - Heavy Duty Off-Road Rental',
          metaDescription: 'Conquer Socotra\'s toughest terrain with our robust Nissan Patrol GR 4x4 built for serious adventures.',
          keywords: ['nissan patrol', '4x4 rental', 'off-road vehicle', 'heavy duty', 'socotra adventure'],
          viewsCount: 2134
        }
      }),

      prisma.car.create({
        data: {
          name: 'Toyota Hilux Double Cab',
          nameAr: 'تويوتا هايلكس كابين مزدوج',
          slug: 'toyota-hilux-double-cab',
          description: 'Versatile pickup truck perfect for adventure seekers and equipment transport. Features comfortable double cab seating, powerful diesel engine, and excellent cargo capacity. Ideal for camping trips, equipment transport, and exploring rugged terrain with practical functionality.',
          descriptionAr: 'شاحنة بيك أب متعددة الاستخدامات مثالية لمحبي المغامرة ونقل المعدات. تتميز بمقاعد كابين مزدوجة مريحة ومحرك ديزل قوي وقدرة شحن ممتازة. مثالية لرحلات التخييم ونقل المعدات واستكشاف التضاريس الوعرة بوظائف عملية.',
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
          images: [
            '/img/cars/hilux-exterior.jpg',
            '/img/cars/hilux-interior.jpg',
            '/img/cars/hilux-cargo-bed.jpg',
            '/img/cars/hilux-offroad.jpg'
          ],
          videoUrl: 'https://www.youtube.com/watch?v=hilux-double-cab',
          features: [
            'Diesel Engine',
            'Double Cab Seating',
            'Large Cargo Bed',
            '4WD Capability',
            'Tow Hitch',
            'Air Conditioning',
            'Power Windows',
            'CD Player',
            'Side Steps',
            'Bed Liner',
            'Fog Lights',
            'Cargo Light',
            'Roof Rack Ready',
            'Fuel Efficient',
            'Durable Build'
          ],
          featuresAr: [
            'محرك ديزل',
            'مقاعد كابين مزدوج',
            'سرير شحن كبير',
            'قدرة دفع رباعي',
            'قطر سحب',
            'تكييف هواء',
            'نوافذ بالقوة',
            'مشغل CD',
            'درجات جانبية',
            'بطانة سرير',
            'أضواء ضباب',
            'ضوء شحن',
            'جاهز لرفوف السقف',
            'اقتصاد في الوقود',
            'بناء متين'
          ],
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
          metaDescription: 'Rent our versatile Toyota Hilux Double Cab for camping, equipment transport, and adventure in Socotra.',
          keywords: ['toyota hilux', 'pickup truck', 'double cab', 'utility vehicle', 'socotra adventure'],
          viewsCount: 1678
        }
      }),

      prisma.car.create({
        data: {
          name: 'Suzuki Vitara 4x4',
          nameAr: 'سوزوكي فيتارا 4x4',
          slug: 'suzuki-vitara-4x4',
          description: 'Compact and efficient 4x4 perfect for city driving and light off-road use. Features hybrid technology for fuel efficiency, modern safety features, and easy maneuverability. Ideal for couples and small families exploring Socotra accessible areas.',
          descriptionAr: '4x4 صغير وموفر للوقود مثالي للقيادة في المدينة والاستخدام الخفيف خارج الطريق. يتميز بتكنولوجيا هجينة لاقتصاد الوقود وميزات أمان حديثة وسهولة في المناورة. مثالي للأزواج والعائلات الصغيرة تستكشف المناطق المتاحة في سقطرى.',
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
          images: [
            '/img/cars/vitara-exterior.jpg',
            '/img/cars/vitara-interior.jpg',
            '/img/cars/vitara-city.jpg',
            '/img/cars/vitara-light-offroad.jpg'
          ],
          videoUrl: 'https://www.youtube.com/watch?v=vitara-4x4',
          features: [
            'Hybrid Engine',
            'Compact Size',
            'Easy Parking',
            'Fuel Efficient',
            'Touch Screen Display',
            'Backup Camera',
            'Bluetooth Audio',
            'Climate Control',
            'LED Headlights',
            'Daytime Running Lights',
            'Cruise Control',
            'Keyless Entry',
            'Push Button Start',
            'USB Ports',
            'Safety Features'
          ],
          featuresAr: [
            'محرك هجين',
            'حجم صغير',
            'ركن سهل',
            'اقتصاد وقود',
            'شاشة لمس',
            'كاميرا خلفية',
            'صوت بلوتوث',
            'تحكم في المناخ',
            'أضواء LED',
            'أضواء نهارية',
            'تحكم في السرعة',
            'دخول بدون مفتاح',
            'بدء تشغيل زر',
            'منافذ USB',
            'ميزات الأمان'
          ],
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
          metaDescription: 'Rent our efficient Suzuki Vitara 4x4 hybrid for economical exploration of Socotra\'s accessible areas.',
          keywords: ['suzuki vitara', 'hybrid suv', 'compact 4x4', 'fuel efficient', 'socotra rental'],
          viewsCount: 1234
        }
      }),

      prisma.car.create({
        data: {
          name: 'Mitsubishi Pajero Sport',
          nameAr: 'ميتسوبيشي باجيرو سبورت',
          slug: 'mitsubishi-pajero-sport',
          description: 'Mid-size SUV offering excellent balance of comfort and off-road capability. Features Super Select 4WD system, spacious interior, and advanced safety features. Perfect for families and groups wanting comfort without compromising on adventure capability.',
          descriptionAr: 'SUV متوسط الحجم يقدم توازناً ممتازاً بين الراحة والقدرة خارج الطريق. يتميز بنظام Super Select 4WD وداخل فسيح وميزات أمان متقدمة. مثالي للعائلات والمجموعات التي تريد الراحة دون المساس بقدرة المغامرة.',
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
          images: [
            '/img/cars/pajero-exterior.jpg',
            '/img/cars/pajero-interior.jpg',
            '/img/cars/pajero-offroad.jpg',
            '/img/cars/pajero-family.jpg'
          ],
          videoUrl: 'https://www.youtube.com/watch?v=pajero-sport',
          features: [
            'Super Select 4WD',
            'Spacious Interior',
            'Automatic Transmission',
            'Diesel Engine',
            'Climate Control',
            'Touch Screen Display',
            'Reverse Camera',
            'Cruise Control',
            'Airbags',
            'ABS with EBD',
            'Fog Lights',
            'Roof Rails',
            'Alloy Wheels',
            'Keyless Entry',
            'Bluetooth Audio'
          ],
          featuresAr: [
            'Super Select 4WD',
            'داخل فسيح',
            'نقل أوتوماتيكي',
            'محرك ديزل',
            'تحكم في المناخ',
            'شاشة لمس',
            'كاميرا خلفية',
            'تحكم في السرعة',
            'وسائد هوائية',
            'ABS مع EBD',
            'أضواء ضباب',
            'سقوف السكك',
            'عجلات سبائك',
            'دخول بدون مفتاح',
            'صوت بلوتوث'
          ],
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
          metaDescription: 'Rent our Mitsubishi Pajero Sport for comfortable family adventures in Socotra with excellent off-road capability.',
          keywords: ['mitsubishi pajero', 'family suv', '4wd rental', 'socotra family car', 'comfortable suv'],
          viewsCount: 1456
        }
      })
    ]);

    console.log(`✅ Created ${cars.length} comprehensive cars`);

    // ═══════════════════════════════════════════════════
    // 📅 Comprehensive Tour Dates
    // ═══════════════════════════════════════════════════
    console.log('\n📅 Creating comprehensive tour dates...');
    
    const allTourDates = [];
    
    // Add dates for each tour
    tours.forEach((tour, tourIndex) => {
      const baseDate = new Date();
      const daysToAdd = tourIndex * 2; // Stagger tours
      
      for (let i = 0; i < 8; i++) {
        const startDate = new Date(baseDate);
        startDate.setDate(startDate.getDate() + daysToAdd + (i * 7) + 3);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + tour.duration);
        
        allTourDates.push({
          tourId: tour.id,
          startDate,
          endDate,
          availableSpots: Math.floor(Math.random() * (tour.maxPeople - 2)) + 2,
          price: tour.price * (1 - (Math.random() * 0.2)), // 0-20% discount
          isActive: true
        });
      }
    });
    
    await prisma.tourDate.createMany({ data: allTourDates });
    console.log(`✅ Created ${allTourDates.length} tour dates`);

    // ═══════════════════════════════════════════════════
    // 📅 Comprehensive Bookings
    // ═══════════════════════════════════════════════════
    console.log('\n📅 Creating comprehensive bookings...');
    
    const bookings = await Promise.all([
      // Tour bookings
      prisma.booking.create({
        data: {
          bookingNumber: 'HT-TOUR-2024-001',
          userId: customers[0].id,
          tourId: tours[0].id,
          bookingType: 'TOUR',
          startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000),
          numberOfPeople: 2,
          totalPrice: tours[0].price * 2,
          paidAmount: tours[0].price * 2,
          status: 'CONFIRMED',
          paymentStatus: 'PAID',
          paymentMethod: 'CREDIT_CARD',
          customerName: 'أحمد الحمياني',
          customerEmail: 'ahmed.alhamdani@gmail.com',
          customerPhone: '+967 771 234 567',
          specialRequests: 'Vegetarian meals required, allergic to seafood',
          confirmedAt: new Date()
        }
      }),
      
      prisma.booking.create({
        data: {
          bookingNumber: 'HT-TOUR-2024-002',
          userId: customers[1].id,
          tourId: tours[1].id,
          bookingType: 'TOUR',
          startDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000),
          numberOfPeople: 3,
          totalPrice: tours[1].price * 3,
          paidAmount: tours[1].price * 3,
          status: 'CONFIRMED',
          paymentStatus: 'PAID',
          paymentMethod: 'BANK_TRANSFER',
          customerName: 'فاطمة اليمنية',
          customerEmail: 'fatima.yemen@yahoo.com',
          customerPhone: '+967 772 345 678',
          specialRequests: 'Need snorkeling equipment, non-swimmer in group',
          confirmedAt: new Date()
        }
      }),

      // Hotel bookings
      prisma.booking.create({
        data: {
          bookingNumber: 'HT-HOTEL-2024-003',
          userId: customers[2].id,
          hotelId: hotels[0].id,
          bookingType: 'HOTEL',
          startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() + 13 * 24 * 60 * 60 * 1000),
          numberOfPeople: 2,
          numberOfRooms: 1,
          totalPrice: hotels[0].pricePerNight * 3,
          paidAmount: hotels[0].pricePerNight * 3,
          status: 'CONFIRMED',
          paymentStatus: 'PAID',
          paymentMethod: 'CREDIT_CARD',
          customerName: 'عبدالله السائح',
          customerEmail: 'abdullah.tourist@hotmail.com',
          customerPhone: '+967 773 456 789',
          confirmedAt: new Date()
        }
      }),

      prisma.booking.create({
        data: {
          bookingNumber: 'HT-HOTEL-2024-004',
          userId: customers[3].id,
          hotelId: hotels[1].id,
          bookingType: 'HOTEL',
          startDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() + 24 * 24 * 60 * 60 * 1000),
          numberOfPeople: 1,
          numberOfRooms: 1,
          totalPrice: hotels[1].pricePerNight * 3,
          paidAmount: hotels[1].pricePerNight * 3,
          status: 'PENDING',
          paymentStatus: 'PENDING',
          paymentMethod: 'BANK_TRANSFER',
          customerName: 'Maria Explorer',
          customerEmail: 'maria.explorer@gmail.com',
          customerPhone: '+44 20 1234 5678'
        }
      }),

      // Car rental bookings
      prisma.booking.create({
        data: {
          bookingNumber: 'HT-CAR-2024-005',
          userId: customers[4].id,
          carId: cars[0].id,
          bookingType: 'CAR',
          startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000),
          numberOfPeople: 2,
          totalPrice: cars[0].pricePerDay * 3,
          paidAmount: cars[0].deposit,
          status: 'CONFIRMED',
          paymentStatus: 'PARTIAL',
          paymentMethod: 'CASH',
          customerName: 'John Adventurer',
          customerEmail: 'john.adventurer@yahoo.com',
          customerPhone: '+1 555 123 4567',
          confirmedAt: new Date()
        }
      }),

      prisma.booking.create({
        data: {
          bookingNumber: 'HT-CAR-2024-006',
          userId: customers[5].id,
          carId: cars[1].id,
          bookingType: 'CAR',
          startDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
          endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
          numberOfPeople: 3,
          totalPrice: cars[1].pricePerDay * 3,
          paidAmount: cars[1].deposit,
          status: 'CONFIRMED',
          paymentStatus: 'PARTIAL',
          paymentMethod: 'CREDIT_CARD',
          customerName: 'Sarah Nature',
          customerEmail: 'sarah.nature@gmail.com',
          customerPhone: '+49 30 1234 5678',
          confirmedAt: new Date()
        }
      })
    ]);

    console.log(`✅ Created ${bookings.length} comprehensive bookings`);

    // ═══════════════════════════════════════════════════
    // 💳 Comprehensive Payments
    // ═══════════════════════════════════════════════════
    console.log('\n💳 Creating comprehensive payments...');
    
    const payments = await Promise.all([
      prisma.payment.create({
        data: {
          bookingId: bookings[0].id,
          amount: bookings[0].totalPrice,
          method: 'CREDIT_CARD',
          status: 'PAID',
          transactionId: 'txn_tour_dragon_2024_001',
          notes: 'Full payment for Dragon Blood Trees tour - vegetarian meals requested'
        }
      }),
      
      prisma.payment.create({
        data: {
          bookingId: bookings[1].id,
          amount: bookings[1].totalPrice,
          method: 'BANK_TRANSFER',
          status: 'PAID',
          transactionId: 'txn_tour_qalansiyah_2024_002',
          notes: 'Full payment for Qalansiyah Beach tour - snorkeling equipment provided'
        }
      }),
      
      prisma.payment.create({
        data: {
          bookingId: bookings[2].id,
          amount: bookings[2].totalPrice,
          method: 'CREDIT_CARD',
          status: 'PAID',
          transactionId: 'txn_hotel_paradise_2024_003',
          notes: 'Full payment for Paradise Resort - ocean view room confirmed'
        }
      }),
      
      prisma.payment.create({
        data: {
          bookingId: bookings[4].id,
          amount: bookings[4].paidAmount,
          method: 'CASH',
          status: 'PAID',
          transactionId: 'deposit_car_landcruiser_2024_005',
          notes: 'Security deposit for Toyota Land Cruiser rental'
        }
      }),
      
      prisma.payment.create({
        data: {
          bookingId: bookings[5].id,
          amount: bookings[5].paidAmount,
          method: 'CREDIT_CARD',
          status: 'PAID',
          transactionId: 'deposit_car_patrol_2024_006',
          notes: 'Security deposit for Nissan Patrol rental'
        }
      })
    ]);

    console.log(`✅ Created ${payments.length} comprehensive payments`);

    // ═══════════════════════════════════════════════════
    // ⭐ Comprehensive Reviews
    // ═══════════════════════════════════════════════════
    console.log('\n⭐ Creating comprehensive reviews...');
    
    const reviews = await Promise.all([
      prisma.review.create({
        data: {
          userId: customers[0].id,
          tourId: tours[0].id,
          rating: 5,
          title: 'Life-changing Dragon Blood Trees Experience!',
          comment: 'This tour exceeded all my expectations! The Dragon Blood Trees are even more spectacular in person. Our guide was incredibly knowledgeable about Socotra\'s unique ecosystem and took us to amazing viewpoints. The camping experience was comfortable and the food was delicious. Highly recommend this tour to anyone visiting Socotra!'
        }
      }),
      
      prisma.review.create({
        data: {
          userId: customers[1].id,
          tourId: tours[1].id,
          rating: 5,
          title: 'Paradise Found at Qalansiyah Beach!',
          comment: 'Absolutely stunning beach and lagoon! The water is crystal clear and perfect for swimming. The fresh seafood lunch was incredible, and our guide was very helpful with snorkeling instruction. This was the perfect relaxing tour after our mountain adventure. Qalansiyah village is charming and the people are so welcoming.'
        }
      }),
      
      prisma.review.create({
        data: {
          userId: customers[2].id,
          hotelId: hotels[0].id,
          rating: 5,
          title: 'Luxury Paradise in Socotra!',
          comment: 'This resort is absolutely incredible! The infinity pool overlooking the ocean is breathtaking, and the spa treatments were world-class. Our room was spacious and beautifully decorated. The staff went above and beyond to make our stay special. The seafood restaurant served the best meals we had in Socotra. Worth every penny!'
        }
      }),
      
      prisma.review.create({
        data: {
          userId: customers[3].id,
          hotelId: hotels[1].id,
          rating: 4,
          title: 'Authentic Eco-Lodge Experience',
          comment: 'Beautiful location near the Dragon Blood Trees. The traditional architecture is charming and the organic garden restaurant serves amazing local food. The staff is very knowledgeable about local culture and nature. Only minor issue was limited WiFi, but that\'s expected in such a remote location. Highly recommend for authentic Socotri experience!'
        }
      }),
      
      prisma.review.create({
        data: {
          userId: customers[4].id,
          carId: cars[0].id,
          rating: 5,
          title: 'Perfect Vehicle for Socotra Adventure!',
          comment: 'The Toyota Land Cruiser V8 was absolutely perfect for exploring Socotra! It handled all the rough roads and mountain passes with ease. The leather interior made long drives comfortable, and the 4WD system gave us confidence on challenging terrain. Our guide was impressed with the vehicle\'s capabilities. Worth every penny for the peace of mind!'
        }
      }),
      
      prisma.review.create({
        data: {
          userId: customers[5].id,
          carId: cars[1].id,
          rating: 4,
          title: 'Reliable Workhorse for Island Exploration',
          comment: 'The Nissan Patrol handled everything we threw at it! Great ground clearance and powerful engine for the mountains. Manual transmission gave us good control on steep roads. Spacious enough for our group and all our gear. Fuel consumption was reasonable for such a capable vehicle. Minor issue with AC but still worked fine. Great value for money!'
        }
      })
    ]);

    console.log(`✅ Created ${reviews.length} comprehensive reviews`);

    // ═══════════════════════════════════════════════════
    // 📧 Messages
    // ═══════════════════════════════════════════════════
    console.log('\n📧 Creating messages...');
    
    const messages = await Promise.all([
      prisma.message.create({
        data: {
          userId: customers[0].id,
          name: 'أحمد الحمياني',
          email: 'ahmed.alhamdani@gmail.com',
          phone: '+967 771 234 567',
          subject: 'Question about multi-day tour packages',
          subjectAr: 'سؤال حول باقات الجولات متعددة الأيام',
          content: 'Hi, I\'m interested in booking multiple tours. Can you create a custom package that includes Dragon Blood Trees, Qalansiyah Beach, and Hoq Cave? We are 2 people traveling in October. What would be the total cost and availability?',
          contentAr: 'مرحبا، أنا مهتم بحجز جولات متعددة. هل يمكنك إنشاء باقة مخصصة تشمل أشجار دم التنين وشاطئ قلانسيا وكهف حوق؟ نحن شخصان نسافر في أكتوبر. ماذا将是 التكلفة الإجمالية والتوفر؟',
          status: 'NEW'
        }
      }),
      
      prisma.message.create({
        data: {
          userId: customers[1].id,
          name: 'فاطمة اليمنية',
          email: 'fatima.yemen@yahoo.com',
          phone: '+967 772 345 678',
          subject: 'Family trip inquiry - 5 people',
          subjectAr: 'استفسار عن رحلة عائلية - 5 أشخاص',
          content: 'We are a family of 5 (2 adults, 3 children ages 8, 12, 15) planning to visit Socotra in December. What tours would you recommend for families? Are there discounts for children? Do you have family-friendly accommodation options?',
          contentAr: 'نحن عائلة مكونة من 5 أشخاص (2 بالغين، 3 أطفال aged 8، 12، 15) نخطط لزيارة سقطرى في ديسمبر. ما هي الجولات التي توصون بها للعائلات؟ هل هناك خصومات للأطفال؟ هل لديكم خيارات إقامة مناسبة للعائلات؟',
          status: 'REPLIED'
        }
      }),
      
      prisma.message.create({
        data: {
          userId: customers[2].id,
          name: 'عبدالله السائح',
          email: 'abdullah.tourist@hotmail.com',
          phone: '+967 773 456 789',
          subject: 'Adventure photography tour',
          subjectAr: 'جولة تصوير مغامرة',
          content: 'I\'m a professional photographer interested in shooting Socotra\'s unique landscapes and endemic species. Do you offer specialized photography tours? What are the best locations for sunrise/sunset photography? Can you arrange permits for drone photography?',
          contentAr: 'أنا مصور محترف مهتم بالتصوير في المناظر الطبيعية الفريدة والأنواع المستوطنة في سقطرى. هل تقدمون جولات تصوير متخصصة؟ ما هي أفضل المواقع لتصوير الشروق/الغروب؟ هل يمكنكم ترتيب تصاريح للتصوير بالطائرة بدون طيار؟',
          status: 'NEW'
        }
      })
    ]);

    console.log(`✅ Created ${messages.length} messages`);

    console.log('\n🎉 ═══════════════════════════════════════════');
    console.log('   ✅ COMPLETE SOCOTRA DATA SEEDING SUCCESS!');
    console.log('═══════════════════════════════════════════');
    console.log('\n📊 Complete Summary:');
    console.log('👤 Users: 9 (3 staff + 6 customers)');
    console.log('✈️ Tours: 6 comprehensive Socotra tours');
    console.log('🏨 Hotels: 5 diverse accommodation options');
    console.log('🚗 Cars: 5 suitable vehicles for Socotra');
    console.log('📅 Tour Dates: 48 available dates');
    console.log('📅 Bookings: 6 sample bookings');
    console.log('💳 Payments: 5 payment records');
    console.log('⭐ Reviews: 6 authentic reviews');
    console.log('📧 Messages: 3 customer inquiries');
    console.log('\n🌍 All data is 100% focused on authentic Socotra experiences!');
    console.log('🎯 Your Hawari Tours database is now completely loaded!');

    console.log('\n🔑 Login Credentials:');
    console.log('👨‍💼 Admin: admin@hawaritours.com / admin123456');
    console.log('👨‍💼 Manager: manager@hawaritours.com / manager123456');
    console.log('👨‍💼 Guide: guide@hawaritours.com / guide123456');
    console.log('🧑‍💼 Customer: ahmed.alhamdani@gmail.com / customer123');

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedSocotraCompleteData().catch(console.error);
