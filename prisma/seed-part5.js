// PART 5: Homepage, Gallery Videos, Virtual Tours, Instagram, Bookings+Reviews
export const part5 = async (prisma, tours) => {

    // ─── HERO SLIDES ─────────────────────────────────────────────
    console.log('🏠 Creating homepage content...')
    await prisma.heroSlide.createMany({
        data: [
            { titleEn: 'Discover Socotra Island', titleAr: 'اكتشف جزيرة سقطرى', subtitleEn: 'The Galapagos of the Indian Ocean', subtitleAr: 'جالاباغوس المحيط الهندي', descriptionEn: 'Experience the world\'s most alien landscape — Dragon Blood Trees, pristine beaches, and endemic wildlife found nowhere else on Earth.', descriptionAr: 'عش أغرب مناظر العالم — أشجار الدم والشواطئ النقية والحياة البرية المستوطنة التي لا توجد في أي مكان آخر على كوكب الأرض.', buttonText: 'Explore Tours', buttonTextAr: 'استكشف جولاتنا', buttonLink: '/tours', imageUrl: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1920', order: 1, isActive: true },
            { titleEn: 'Dragon Blood Trees of Dixam', titleAr: 'أشجار الدم في ديكسم', subtitleEn: 'An Otherworldly Forest', subtitleAr: 'غابة من عالم آخر', descriptionEn: 'Stand among 300-year-old Dragon Blood Trees at sunrise on Dixam Plateau. An experience that will change how you see the world.', descriptionAr: 'قف بين أشجار الدم التي عمرها 300 عام عند الشروق في هضبة ديكسم. تجربة ستغير طريقة رؤيتك للعالم.', buttonText: 'See Mountain Tours', buttonTextAr: 'شاهد جولات الجبال', buttonLink: '/tours?category=ADVENTURE', imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1920', order: 2, isActive: true },
            { titleEn: 'Paradise Beaches Await', titleAr: 'شواطئ الجنة في انتظارك', subtitleEn: 'Arher Dunes & Detwah Lagoon', subtitleAr: 'كثبان أرهر وبحيرة ديتواه', descriptionEn: 'White sand dunes cascading into turquoise sea. Zero crowds. Zero pollution. Pure Indian Ocean paradise.', descriptionAr: 'كثبان رملية بيضاء تنحدر نحو البحر الفيروزي. لا ازدحام. لا تلوث. جنة المحيط الهندي الخالصة.', buttonText: 'Beach Tours', buttonTextAr: 'جولات الشاطئ', buttonLink: '/tours?category=BEACH', imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920', order: 3, isActive: true }
        ]
    })

    // ─── STATS ────────────────────────────────────────────────────
    await prisma.quickStat.createMany({
        data: [
            { labelEn: 'Happy Travelers', labelAr: 'مسافر سعيد', value: '5,000+', icon: '😊', color: '#F59E0B', order: 1, isActive: true },
            { labelEn: 'Tours Completed', labelAr: 'جولة مكتملة', value: '850+', icon: '✅', color: '#10B981', order: 2, isActive: true },
            { labelEn: 'Expert Guides', labelAr: 'دليل خبير', value: '24', icon: '🧭', color: '#3B82F6', order: 3, isActive: true },
            { labelEn: 'Years Experience', labelAr: 'سنة خبرة', value: '12+', icon: '⭐', color: '#8B5CF6', order: 4, isActive: true }
        ]
    })

    // ─── WHY CHOOSE US ────────────────────────────────────────────
    await prisma.whyChooseUs.createMany({
        data: [
            { titleEn: 'Local Expertise Since 2013', titleAr: 'خبرة محلية منذ 2013', descriptionEn: 'Founded by native Socotris, our guides have an unmatched depth of knowledge about the island\'s ecology, culture, and hidden gems that outside operators simply cannot match.', descriptionAr: 'أسسها سقطريون أصليون، ودليلونا يملكون عمقاً لا مثيل له في المعرفة بالبيئة والثقافة والجواهر الخفية للجزيرة.', icon: '🏆', color: '#F59E0B', order: 1, isActive: true },
            { titleEn: 'Responsible Eco-Tourism', titleAr: 'سياحة بيئية مسؤولة', descriptionEn: 'We are committed to sustainability. Our tours follow strict eco-tourism guidelines, contributing to conservation funds and local community development on every booking.', descriptionAr: 'ملتزمون بالاستدامة. جولاتنا تتبع مبادئ السياحة البيئية الصارمة، مساهمةً في صناديق الحفاظ وتنمية المجتمع المحلي في كل حجز.', icon: '🌱', color: '#059669', order: 2, isActive: true },
            { titleEn: 'Small Groups, Big Experiences', titleAr: 'مجموعات صغيرة، تجارب كبيرة', descriptionEn: 'Maximum 12 people per tour ensures personalized attention, minimal environmental impact, and access to locations larger groups simply cannot visit.', descriptionAr: 'بحد أقصى 12 شخصاً لكل جولة يضمن اهتماماً شخصياً وأثراً بيئياً ضئيلاً والوصول لمواقع لا تستطيع المجموعات الكبيرة زيارتها.', icon: '👥', color: '#3B82F6', order: 3, isActive: true },
            { titleEn: 'Complete Safety Assurance', titleAr: 'ضمان السلامة الكاملة', descriptionEn: 'All guides are first-aid certified. We carry satellite communicators on every tour. 24/7 emergency support. Full insurance facilitation. Your safety is never compromised.', descriptionAr: 'جميع المرشدين حاصلون على شهادة الإسعافات الأولية. نحمل أجهزة اتصال فضائية في كل جولة. دعم طوارئ 24/7. تسهيل التأمين الكامل.', icon: '🛡️', color: '#EF4444', order: 4, isActive: true },
            { titleEn: 'Bilingual Service (EN & AR)', titleAr: 'خدمة ثنائية اللغة (إنجليزية وعربية)', descriptionEn: 'All our tours and materials are fully available in English and Arabic. Our guides are fluent in both languages, ensuring every guest feels at home regardless of background.', descriptionAr: 'جميع جولاتنا ومواد موجهة بالكامل بالإنجليزية والعربية. مرشدونا يتحدثون اللغتين بطلاقة.', icon: '🌐', color: '#14B8A6', order: 5, isActive: true },
            { titleEn: 'All-Inclusive Packages', titleAr: 'باقات شاملة للكل', descriptionEn: 'No hidden costs. Our packages include accommodation, all meals, transport, equipment, entry fees, and guide services. You just need to show up at the airport.', descriptionAr: 'لا تكاليف خفية. تشمل باقاتنا الإقامة وجميع الوجبات والمواصلات والمعدات ورسوم الدخول وخدمات الدليل.', icon: '💎', color: '#8B5CF6', order: 6, isActive: true }
        ]
    })

    // ─── WELCOME MESSAGE ──────────────────────────────────────────
    await prisma.welcomeMessage.create({
        data: {
            titleEn: 'Welcome to Hawari Tours — Your Gateway to Socotra',
            titleAr: 'مرحباً بك في رحلات الحواري — بوابتك إلى سقطرى',
            subtitleEn: 'Authentic. Responsible. Unforgettable.',
            subtitleAr: 'أصيلة. مسؤولة. لا تُنسى.',
            contentEn: 'Hawari Tours was founded on a simple belief: that Socotra Island deserves to be experienced, not just visited. Since 2013, we have been guiding travelers from across the world through the most extraordinary island on Earth — from the Dragon Blood Tree forests of Dixam Plateau to the white sand dunes of Arher, from the world-class marine life of Dihamri to the ancient mysteries of Hoq Cave.',
            contentAr: 'تأسست رحلات الحواري على اعتقاد بسيط: أن جزيرة سقطرى تستحق أن تُعاش، لا أن تُزار فقط. منذ عام 2013، نرشد المسافرين من أنحاء العالم عبر أكثر الجزر استثنائية على وجه الأرض.',
            isActive: true
        }
    })
    console.log('  ✅ Homepage content created\n')



    // ─── GALLERY VIDEOS ───────────────────────────────────────────
    console.log('🎬 Creating gallery videos...')
    await prisma.galleryVideo.createMany({ data: [
      { title: 'Socotra Island — The Alien Paradise', titleAr: 'جزيرة سقطرى — الجنة الغريبة', description: 'A cinematic journey through Socotra Island — Dragon Blood Trees, Arher dunes, Detwah Lagoon, and Dihamri Marine Reserve.', descriptionAr: 'رحلة سينمائية عبر سقطرى — أشجار الدم وأرهر وديتواه وديهامري.', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800', featured: true, isActive: true, duration: '4:32', category: 'DESTINATIONS', viewCount: 38000, order: 1 },
      { title: 'Dragon Blood Tree Forest | Dixam Plateau', titleAr: 'غابة أشجار الدم | هضبة ديكسم', description: 'Sunrise time-lapse of the Dragon Blood Tree forests on Socotra Dixam Plateau.', descriptionAr: 'فاصل زمني لشروق الشمس في غابات أشجار الدم في هضبة ديكسم.', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800', featured: true, isActive: true, duration: '2:48', category: 'NATURE', viewCount: 24600, order: 2 },
      { title: 'Socotra Underwater World | Dihamri', titleAr: 'عالم سقطرى تحت الماء | ديهامري', description: 'Underwater footage from Dihamri Marine Reserve — coral reefs, tropical fish, sea turtles.', descriptionAr: 'لقطات مائية من محمية ديهامري — شعاب مرجانية وأسماك وسلاحف.', videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ', thumbnail: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800', featured: false, isActive: true, duration: '3:15', category: 'WILDLIFE', viewCount: 19200, order: 3 }
    ]})
    console.log('  ✅ Gallery videos created\n')

    // ─── VIRTUAL TOURS ────────────────────────────────────────────
    console.log('🥽 Creating virtual tours...')
    await prisma.virtualTour.createMany({ data: [
      { title: 'Dixam Plateau 360° Virtual Experience', titleAr: 'تجربة افتراضية 360° في هضبة ديكسم', description: 'Immerse yourself in the Dragon Blood Tree forests of Dixam Plateau. Explore the forest, discover endemic flora, and experience sunrise from 800m altitude.', descriptionAr: 'انغمس في غابات أشجار الدم في هضبة ديكسم مع هذه الجولة التفاعلية 360°.', location: 'Dixam Plateau, Socotra', locationAr: 'هضبة ديكسم، سقطرى', tourUrl: 'https://hawari-tours.com/virtual/dixam', icon: '🌳', gradient: 'from-green-500 to-emerald-600', featured: true, isActive: true, viewCount: 12800, order: 1 },
      { title: 'Detwah Lagoon 360° Birds Eye View', titleAr: 'إطلالة 360° على بحيرة ديتواه', description: 'See the full spectacular geometry of Detwah Lagoon — turquoise waters, white sand barrier, and mangroves — in full 360° panorama.', descriptionAr: 'شاهد الهندسة الرائعة لبحيرة ديتواه — المياه الفيروزية والرمال البيضاء والمانغروف — في بانوراما 360°.', location: 'Detwah Lagoon, Socotra', locationAr: 'بحيرة ديتواه، سقطرى', tourUrl: 'https://hawari-tours.com/virtual/detwah', icon: '🏖️', gradient: 'from-blue-500 to-cyan-600', featured: true, isActive: true, viewCount: 9400, order: 2 }
    ]})
    console.log('  ✅ Virtual tours created\n')

    // ─── INSTAGRAM POSTS ─────────────────────────────────────────
    console.log('📸 Creating Instagram posts...')
    await prisma.instagramPost.createMany({ data: [
      { imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600', postUrl: 'https://instagram.com/hawaritours', likes: 1842, comments: 76, isActive: true, order: 1 },
      { imageUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600', postUrl: 'https://instagram.com/hawaritours', likes: 2310, comments: 94, isActive: true, order: 2 },
      { imageUrl: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600', postUrl: 'https://instagram.com/hawaritours', likes: 1654, comments: 58, isActive: true, order: 3 },
      { imageUrl: 'https://images.unsplash.com/photo-1502003148287-a82ef80a6abc?w=600', postUrl: 'https://instagram.com/hawaritours', likes: 3201, comments: 127, isActive: true, order: 4 },
      { imageUrl: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600', postUrl: 'https://instagram.com/hawaritours', likes: 1978, comments: 83, isActive: true, order: 5 },
      { imageUrl: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=600', postUrl: 'https://instagram.com/hawaritours', likes: 1432, comments: 61, isActive: true, order: 6 }
    ]})
    console.log('  ✅ Instagram posts created\n')

    // ─── TOUR DATES ───────────────────────────────────────────────
    console.log('📅 Creating tour dates...')
    if (tours && tours.tour1) {
        const now = new Date()
        const addDays = (d, n) => { const r = new Date(d); r.setDate(r.getDate() + n); return r }
        await prisma.tourDate.createMany({ data: [
          { tourId: tours.tour1.id, startDate: addDays(now, 30), endDate: addDays(now, 38), availableSpots: 10, price: 1080, isActive: true },
          { tourId: tours.tour1.id, startDate: addDays(now, 60), endDate: addDays(now, 68), availableSpots: 12, price: 1080, isActive: true },
          { tourId: tours.tour1.id, startDate: addDays(now, 90), endDate: addDays(now, 98), availableSpots: 8, price: 1080, isActive: true }
        ]})
    }
    console.log('  ✅ Tour dates created\n')

    // ─── MESSAGES ─────────────────────────────────────────────────
    console.log('📬 Creating sample messages...')
    await prisma.message.createMany({ data: [
      { name: 'James Whitmore', email: 'james.w@email.com', phone: '+44 7911 123456', subject: 'Booking query for 8-day Complete tour', message: 'Hello, I am very interested in the Socotra Complete Island Discovery tour for October 2025. I am traveling with my wife and we would love to do the full 8-day tour. Could you confirm availability for October 15 departure and provide payment details? Thank you, James.', status: 'READ' },
      { name: 'Yuki Tanaka', email: 'yuki.t@email.com', phone: '+81 80-1234-5678', subject: 'Photography tour - solo traveler', message: 'I am a professional photographer from Japan. I saw your photography expedition tour and would love to join as a solo traveler. Do you accept solo bookings? Also can I bring my drone for aerial photography? Best, Yuki.', status: 'UNREAD' },
      { name: 'Aisha Al-Rashidi', email: 'aisha.r@email.com', phone: '+968 92 123 456', subject: 'Group booking - 8 people from Oman', message: 'السلام عليكم. نحن مجموعة من 8 أشخاص من عمان مهتمون بالزيارة في يناير 2026. هل لديكم عروض للمجموعات؟ شكراً.', status: 'REPLIED' }
    ]})
    console.log('  ✅ Messages created\n')

    // ─── NOTIFICATIONS ────────────────────────────────────────────
    await prisma.notification.createMany({ data: [
      { type: 'BOOKING', title: 'New Booking Received', message: 'James Whitmore has submitted a booking inquiry for Socotra Complete Island Discovery.', isRead: false },
      { type: 'MESSAGE', title: 'New Message', message: 'Yuki Tanaka has sent a message about the photography expedition tour.', isRead: false },
      { type: 'REVIEW', title: 'New Review Submitted', message: 'A new 5-star review has been submitted and is awaiting approval.', isRead: true }
    ]})
    console.log('  ✅ Notifications created\n')
}




