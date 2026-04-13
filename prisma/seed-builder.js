import { writeFileSync } from 'fs'

const toursSection = `
  // ─── TOURS ────────────────────────────────────────────────────
  console.log('✈️  Creating tours...')
  const tour1 = await prisma.tour.create({ data: {
    title: 'Socotra Complete Island Discovery',
    titleAr: 'اكتشاف جزيرة سقطرى الشامل',
    slug: 'socotra-complete-island-discovery',
    description: 'The ultimate Socotra experience covering Dragon Blood Trees, Detwah Lagoon, Hoq Cave, Arher Dunes, and world-class snorkeling at Dihamri Marine Reserve.',
    descriptionAr: 'التجربة الشاملة لسقطرى تغطي أشجار الدم وبحيرة ديتواه وكهف حوق وكثبان أرهر والغطس العالمي في محمية ديهامري.',
    price: 1200, discount: 10, duration: 8, maxPeople: 12,
    difficulty: 'MODERATE', category: 'NATURE', featured: true, isActive: true,
    coverImage: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200',
    images: ['https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800','https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800'],
    location: 'Socotra Island, Yemen', locationAr: 'جزيرة سقطرى، اليمن',
    latitude: 12.5, longitude: 54.0,
    itinerary: { days: [
      { day:1, titleEn:'Arrival & Hadibo City', titleAr:'الوصول وحديبو', descriptionEn:'Airport pickup, hotel check-in, evening market walk.', descriptionAr:'استقبال المطار، تسجيل الوصول، نزهة مسائية في السوق.' },
      { day:2, titleEn:'Dixam Plateau - Dragon Blood Trees', titleAr:'هضبة ديكسم - أشجار الدم', descriptionEn:'Full day at Dixam among 300-year-old Dragon Blood Trees. Sunrise photography.', descriptionAr:'يوم كامل في ديكسم بين أشجار الدم التي عمرها 300 عام. تصوير عند الشروق.' },
      { day:3, titleEn:'Detwah Lagoon', titleAr:'بحيرة ديتواه', descriptionEn:'Turquoise lagoon surrounded by white dunes and mangroves. Swimming and kayaking.', descriptionAr:'بحيرة فيروزية محاطة بالكثبان البيضاء والمانغروف. سباحة وتجديف.' },
      { day:4, titleEn:'Hoq Cave Adventure', titleAr:'مغامرة كهف حوق', descriptionEn:'Trek 2hrs to one of Arabia largest caves with ancient inscriptions inside.', descriptionAr:'تنزه ساعتين إلى أحد أكبر كهوف الجزيرة العربية مع نقوش قديمة بالداخل.' },
      { day:5, titleEn:'Arher Dunes & Stars', titleAr:'كثبان أرهر والنجوم', descriptionEn:'White sand dunes meeting the sea. Campfire dinner under a galaxy of stars.', descriptionAr:'كثبان رملية بيضاء تلتقي البحر. عشاء حول النار تحت مجرة من النجوم.' },
      { day:6, titleEn:'Dihamri Marine Reserve', titleAr:'محمية ديهامري البحرية', descriptionEn:'World-class snorkeling among vibrant reefs, tropical fish, sea turtles.', descriptionAr:'غطس عالمي بين الشعاب المرجانية الزاهية والأسماك الاستوائية والسلاحف.' },
      { day:7, titleEn:'Qalansiyah & Local Culture', titleAr:'قلنسية والثقافة المحلية', descriptionEn:'Largest fishing village, traditional Socotri feast, cultural evening.', descriptionAr:'أكبر قرية صيد، وليمة سقطرية تقليدية، أمسية ثقافية.' },
      { day:8, titleEn:'Farewell & Departure', titleAr:'الوداع والمغادرة', descriptionEn:'Last sunrise at beach, souvenir shopping, airport transfer.', descriptionAr:'آخر شروق على الشاطئ، تسوق التذكارات، المواصلات للمطار.' }
    ]},
    includes: ['Airport transfers','All accommodation','Daily breakfast & dinner','English & Arabic guide','Park entry fees','4WD vehicle','Snorkeling equipment','Camping gear'],
    excludes: ['International flights','Travel insurance','Personal expenses','Tips','Alcoholic beverages'],
    features: ['Dragon Blood Trees','Cave exploration','Snorkeling','Sand dunes','Camping','Cultural immersion'],
    featuresAr: ['أشجار الدم','استكشاف الكهوف','الغطس','الكثبان الرملية','التخييم','الغمر الثقافي'],
    rating: 4.9, reviewsCount: 47, bookingsCount: 89, viewsCount: 1240,
    metaTitle: 'Socotra Complete Discovery 8 Days | Hawari Tours',
    metaDescription: 'The ultimate 8-day Socotra tour covering Dragon Blood Trees, Detwah Lagoon, Hoq Cave and marine snorkeling.',
    keywords: ['socotra','dragon blood tree','socotra island','yemen tourism']
  }})

  const tour2 = await prisma.tour.create({ data: {
    title: 'Dragon Blood Tree & Mountain Trek',
    titleAr: 'رحلة أشجار الدم والجبال',
    slug: 'dragon-blood-tree-mountain-trek',
    description: 'A focused mountain adventure through Dixam Plateau and Firmhin Forest, centered on the iconic Dragon Blood Trees. Expert botanical guides share deep knowledge of the island flora.',
    descriptionAr: 'مغامرة جبلية مركزة عبر هضبة ديكسم وغابة فرمهين حول أشجار الدم الأيقونية. أدلاء نباتيون خبراء يشاركون معرفة عميقة بنباتات الجزيرة.',
    price: 650, discount: 0, duration: 4, maxPeople: 8,
    difficulty: 'CHALLENGING', category: 'ADVENTURE', featured: true, isActive: true,
    coverImage: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200',
    images: ['https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800'],
    location: 'Dixam Plateau, Socotra', locationAr: 'هضبة ديكسم، سقطرى',
    latitude: 12.48, longitude: 53.95,
    itinerary: { days: [
      { day:1, titleEn:'Firmhin Forest Entry', titleAr:'دخول غابة فرمهين', descriptionEn:'Enter the enchanted Dragon Blood Tree forest. Sunrise photography session.', descriptionAr:'دخول غابة أشجار الدم الساحرة. جلسة تصوير عند شروق الشمس.' },
      { day:2, titleEn:'Dixam Plateau Full Trek', titleAr:'رحلة هضبة ديكسم الكاملة', descriptionEn:'All-day trek across the plateau, rock pools, canyon panoramas.', descriptionAr:'رحلة يوم كامل عبر الهضبة وبرك الصخور وبانوراما الوادي.' },
      { day:3, titleEn:'Skand Summit', titleAr:'قمة سكند', descriptionEn:'Summit hike with 360° island views. Overnight camping under the stars.', descriptionAr:'تسلق القمة مع مناظر 360 درجة للجزيرة. التخييم طوال الليل.' },
      { day:4, titleEn:'Descent & Farewell', titleAr:'النزول والوداع', descriptionEn:'Morning descent, local botanical garden visit, return to Hadibo.', descriptionAr:'النزول الصباحي، زيارة حديقة نباتية محلية، العودة لحديبو.' }
    ]},
    includes: ['Accommodation & camping','All meals','Botanical guide','Camping equipment','Permits'],
    excludes: ['Flights','Travel insurance','Personal gear'],
    features: ['Mountain trekking','Dragon Blood Trees','Photography','Camping','Botanical expertise'],
    featuresAr: ['تنزه جبلي','أشجار الدم','التصوير','التخييم','خبرة نباتية'],
    rating: 4.8, reviewsCount: 31, bookingsCount: 52, viewsCount: 876,
    metaTitle: 'Dragon Blood Tree Trek 4 Days | Hawari Tours',
    metaDescription: '4-day mountain trek through Socotra Dragon Blood Tree forests with expert botanical guides.',
    keywords: ['dragon blood tree','socotra trekking','socotra flora','dixam plateau']
  }})

  const tour3 = await prisma.tour.create({ data: {
    title: 'Marine & Beach Paradise',
    titleAr: 'جنة الشواطئ والبحر',
    slug: 'socotra-marine-beach-paradise',
    description: 'The perfect ocean escape. World-class snorkeling at Dihamri Marine Reserve, pristine Arher white sand dunes, hidden Shoab Beach, and the famous Detwah Lagoon.',
    descriptionAr: 'الهروب المثالي للمحيط. غطس عالمي في محمية ديهامري، كثبان أرهر البيضاء النقية، شاطئ شعب الخفي، وبحيرة ديتواه الشهيرة.',
    price: 850, discount: 5, duration: 6, maxPeople: 10,
    difficulty: 'EASY', category: 'BEACH', featured: true, isActive: true,
    coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200',
    images: ['https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800'],
    location: 'Arher & Qalansiyah, Socotra', locationAr: 'أرهر وقلنسية، سقطرى',
    latitude: 12.708, longitude: 53.426,
    itinerary: { days: [
      { day:1, titleEn:'Detwah Lagoon Welcome', titleAr:'ترحيب بحيرة ديتواه', descriptionEn:'Arrive, head directly to Detwah for a welcome swim in turquoise water.', descriptionAr:'الوصول والتوجه مباشرة لديتواه للسباحة الترحيبية في المياه الفيروزية.' },
      { day:2, titleEn:'Dihamri Marine Reserve', titleAr:'محمية ديهامري البحرية', descriptionEn:'Full day snorkeling. Vibrant coral reefs, tropical fish, sea turtles.', descriptionAr:'يوم كامل من الغطس. شعاب مرجانية زاهية وأسماك استوائية وسلاحف بحرية.' },
      { day:3, titleEn:'Arher Sand Dunes', titleAr:'كثبان أرهر الرملية', descriptionEn:'Iconic white dunes meeting crystal water. Sandboarding and swimming.', descriptionAr:'كثبان بيضاء أيقونية تلتقي بالمياه الكريستالية. تزلج على الرمال وسباحة.' },
      { day:4, titleEn:'Qalansiyah & Fishing Trip', titleAr:'قلنسية ورحلة صيد', descriptionEn:'Largest fishing village, traditional boat trip, fresh seafood lunch.', descriptionAr:'أكبر قرية صيد، رحلة بالقارب التقليدي، غداء مأكولات بحرية طازجة.' },
      { day:5, titleEn:'Shoab Hidden Beach', titleAr:'شاطئ شعب الخفي', descriptionEn:'Boat ride to the most beautiful beach in Socotra. Private beach, crystal water.', descriptionAr:'رحلة قارب لأجمل شاطئ في سقطرى. شاطئ خاص ومياه كريستالية.' },
      { day:6, titleEn:'Sunrise Breakfast & Departure', titleAr:'إفطار شروق الشمس والمغادرة', descriptionEn:'Last swim, beach breakfast, airport transfer.', descriptionAr:'آخر سباحة، إفطار على الشاطئ، المواصلات للمطار.' }
    ]},
    includes: ['Airport transfers','Accommodation','All meals','Snorkeling equipment','Boat trips','Guide'],
    excludes: ['Flights','Insurance','Personal expenses'],
    features: ['Snorkeling','White beaches','Boat tours','Marine life','Sand dunes'],
    featuresAr: ['الغطس','شواطئ بيضاء','جولات بحرية','الحياة البحرية','الكثبان الرملية'],
    rating: 4.9, reviewsCount: 28, bookingsCount: 41, viewsCount: 723,
    metaTitle: 'Socotra Marine & Beach Paradise 6 Days | Hawari Tours',
    metaDescription: '6-day Socotra beach tour covering Dihamri snorkeling, Arher dunes, Detwah lagoon and Shoab beach.',
    keywords: ['socotra beach','socotra snorkeling','arher dunes','detwah lagoon']
  }})

  const tour4 = await prisma.tour.create({ data: {
    title: 'Socotra Wildlife & Birdwatching Safari',
    titleAr: 'سفاري مراقبة الطيور والحياة البرية',
    slug: 'socotra-wildlife-birdwatching-safari',
    description: 'Socotra is a birdwatcher paradise with 44 endemic bird species. This expert-led safari covers key wildlife habitats: coastal wetlands, mountain forests, and desert plateaus. Spot the Socotra Sunbird, Egyptian Vulture, and rare reptiles.',
    descriptionAr: 'سقطرى جنة مراقبي الطيور مع 44 نوعاً من الطيور المستوطنة. تغطي هذه السفاري بقيادة خبراء الموائل الحيوانية الرئيسية: الأراضي الرطبة الساحلية والغابات الجبلية والهضاب الصحراوية.',
    price: 780, discount: 0, duration: 5, maxPeople: 6,
    difficulty: 'MODERATE', category: 'WILDLIFE', featured: false, isActive: true,
    coverImage: 'https://images.unsplash.com/photo-1597149657050-44ede5d52d81?w=1200',
    images: ['https://images.unsplash.com/photo-1444464666168-49d633b86797?w=800'],
    location: 'Multiple locations, Socotra', locationAr: 'مواقع متعددة، سقطرى',
    latitude: 12.5, longitude: 54.0,
    itinerary: { days: [
      { day:1, titleEn:'Coastal Wetlands & Flamingos', titleAr:'الأراضي الرطبة والفلامنغو', descriptionEn:'Detwah Lagoon birdwatching: flamingos, herons, ospreys.', descriptionAr:'مراقبة طيور بحيرة ديتواه: فلامنغو وبلشون ونسر بحري.' },
      { day:2, titleEn:'Mountain Forest Birds', titleAr:'طيور غابة الجبل', descriptionEn:'Firmhin forest: Socotra Sunbird, Socotra Starling, endemic raptors.', descriptionAr:'غابة فرمهين: طائر الشمس السقطري، زرزور سقطرى، الجوارح المستوطنة.' },
      { day:3, titleEn:'Desert & Rocky Plateaus', titleAr:'الصحراء والهضاب الصخرية', descriptionEn:'Egyptian Vulture, Socotra Cormorant, endemic lizards and geckos.', descriptionAr:'نسر مصري وكورمورانت سقطرى وسحالي وضباب مستوطنة.' },
      { day:4, titleEn:'Marine Birds & Dolphins', titleAr:'الطيور البحرية والدلافين', descriptionEn:'Boat trip watching boobies, frigatebirds, and dolphin pods.', descriptionAr:'رحلة قارب لمشاهدة الغبس وطيور الفرقاطة وأسراب الدلافين.' },
      { day:5, titleEn:'Endemic Reptiles & Departure', titleAr:'الزواحف المستوطنة والمغادرة', descriptionEn:'Socotra chameleon and skink hunting before airport transfer.', descriptionAr:'البحث عن حرباء وسقنقور سقطرى قبل المواصلات للمطار.' }
    ]},
    includes: ['Accommodation','All meals','Expert ornithologist guide','Binoculars','Field guide book','Transport'],
    excludes: ['Flights','Insurance','Personal camera equipment'],
    features: ['44 endemic birds','Expert ornithologist','Reptile spotting','Marine birds','Boat trips'],
    featuresAr: ['44 طير مستوطن','عالم طيور خبير','رصد الزواحف','طيور بحرية','جولات قارب'],
    rating: 4.7, reviewsCount: 18, bookingsCount: 27, viewsCount: 412,
    metaTitle: 'Socotra Wildlife Birdwatching Safari 5 Days | Hawari Tours',
    metaDescription: '5-day expert birdwatching safari in Socotra, home to 44 endemic bird species and rare reptiles.',
    keywords: ['socotra birds','socotra wildlife','socotra birdwatching','endemic species']
  }})

  const tour5 = await prisma.tour.create({ data: {
    title: 'Socotra Cultural Heritage Immersion',
    titleAr: 'الانغماس في التراث الثقافي لسقطرى',
    slug: 'socotra-cultural-heritage-immersion',
    description: 'Live among the Socotri people. Stay in ancestral mountain villages, learn the ancient unwritten Socotri language, witness traditional rituals, and experience authentic island life untouched by modern tourism.',
    descriptionAr: 'عش بين أهل سقطرى. أقم في القرى الجبلية الأصيلة، تعلم اللغة السقطرية القديمة غير المكتوبة، اشهد الطقوس التقليدية، وعش حياة الجزيرة الأصيلة.',
    price: 720, discount: 0, duration: 5, maxPeople: 8,
    difficulty: 'EASY', category: 'CULTURAL', featured: false, isActive: true,
    coverImage: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1200',
    images: ['https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=800'],
    location: 'Hadibo & Villages, Socotra', locationAr: 'حديبو والقرى، سقطرى',
    latitude: 12.633, longitude: 54.017,
    itinerary: { days: [
      { day:1, titleEn:'Hadibo Old Market', titleAr:'سوق حديبو القديمة', descriptionEn:'Walking tour of old Hadibo, meet craftsmen, taste local spices and honey.', descriptionAr:'جولة مشي في حديبو القديمة، لقاء الحرفيين، تذوق التوابل المحلية والعسل.' },
      { day:2, titleEn:'Mountain Village Homestay', titleAr:'إقامة في قرية جبلية', descriptionEn:'Travel to a remote mountain village, spend the night with a local family.', descriptionAr:'السفر لقرية جبلية نائية، قضاء الليل مع عائلة محلية.' },
      { day:3, titleEn:'Traditional Arts & Crafts', titleAr:'الفنون والحرف التقليدية', descriptionEn:'Learn Socotri weaving, pottery, traditional music with Rababa instrument.', descriptionAr:'تعلم النسيج السقطري والفخار والموسيقى التقليدية بآلة الربابة.' },
      { day:4, titleEn:'Ancient Caves & Inscriptions', titleAr:'الكهوف القديمة والنقوش', descriptionEn:'Visit archaeological sites with pre-Islamic inscriptions and cave art.', descriptionAr:'زيارة المواقع الأثرية ونقوش ما قبل الإسلام والفن الكهفي.' },
      { day:5, titleEn:'Farewell Feast & Departure', titleAr:'وليمة الوداع والمغادرة', descriptionEn:'Traditional farewell feast cooked by the community, airport transfer.', descriptionAr:'وليمة وداع تقليدية تطبخها المجتمع المحلي، مواصلة للمطار.' }
    ]},
    includes: ['Homestay accommodation','Authentic local meals','Cultural guide','Transport','Village donations'],
    excludes: ['Flights','Insurance','Personal expenses'],
    features: ['Local homestay','Cultural immersion','Traditional crafts','Ancient history','Socotri language'],
    featuresAr: ['إقامة محلية','غمر ثقافي','الحرف التقليدية','التاريخ القديم','اللغة السقطرية'],
    rating: 4.7, reviewsCount: 22, bookingsCount: 34, viewsCount: 445,
    metaTitle: 'Socotra Cultural Heritage 5 Days | Hawari Tours',
    metaDescription: 'Authentic 5-day Socotra cultural tour with village homestays, traditional arts, and ancient history.',
    keywords: ['socotra culture','socotri traditions','authentic travel','socotra village']
  }})

  const tour6 = await prisma.tour.create({ data: {
    title: 'Socotra Photography Expedition',
    titleAr: 'رحلة التصوير الاحترافي في سقطرى',
    slug: 'socotra-photography-expedition',
    description: 'Designed for photographers. Hit every golden hour at the most photogenic locations: Dragon Blood Trees at sunrise, Arher dunes at sunset, star-filled skies for astrophotography, and vibrant underwater worlds.',
    descriptionAr: 'مصممة للمصورين. وصل لكل ساعة ذهبية في أكثر المواقع فوتوغرافية: أشجار الدم عند الشروق، كثبان أرهر عند الغروب، السماء المليئة بالنجوم للتصوير الفلكي، والعوالم المائية الزاهية.',
    price: 1100, discount: 0, duration: 7, maxPeople: 6,
    difficulty: 'MODERATE', category: 'ADVENTURE', featured: false, isActive: true,
    coverImage: 'https://images.unsplash.com/photo-1502003148287-a82ef80a6abc?w=1200',
    images: [],
    location: 'Island-wide, Socotra', locationAr: 'عبر الجزيرة، سقطرى',
    latitude: 12.5, longitude: 54.0,
    itinerary: { days: [
      { day:1, titleEn:'Arrival & Golden Hour', titleAr:'الوصول والساعة الذهبية', descriptionEn:'Airport pickup, first sunset shoot at Hadibo beach.', descriptionAr:'استقبال المطار، أول جلسة غروب في شاطئ حديبو.' },
      { day:2, titleEn:'Dragon Blood Tree Sunrise', titleAr:'شروق الشمس بين أشجار الدم', descriptionEn:'Pre-dawn drive to Dixam, magical sunrise shoot in Dragon Blood forest.', descriptionAr:'قيادة قبل الفجر لديكسم، جلسة شروق سحرية في غابة أشجار الدم.' },
      { day:3, titleEn:'Detwah Reflections', titleAr:'انعكاسات ديتواه', descriptionEn:'Lagoon reflections at dawn and dusk. Aerial perspectives from hilltop.', descriptionAr:'انعكاسات البحيرة عند الفجر والغسق. منظور جوي من قمة التل.' },
      { day:4, titleEn:'Underwater Photography', titleAr:'التصوير تحت الماء', descriptionEn:'Snorkel with camera at Dihamri and Shu\'ab: corals, fish, turtles.', descriptionAr:'الغطس بالكاميرا في ديهامري وشعب: مرجان وأسماك وسلاحف.' },
      { day:5, titleEn:'Arher Dunes Golden Hour', titleAr:'الساعة الذهبية في كثبان أرهر', descriptionEn:'Spend sunrise AND sunset at iconic Arher for dramatic dune photography.', descriptionAr:'قضاء الشروق والغروب في أرهر الأيقونية لتصوير الكثبان المثير.' },
      { day:6, titleEn:'Milky Way Night Session', titleAr:'جلسة درب التبانة الليلية', descriptionEn:'Socotra has zero light pollution. Epic astrophotography camping session.', descriptionAr:'سقطرى خالية من التلوث الضوئي. جلسة تصوير فلكي رائعة وتخييم.' },
      { day:7, titleEn:'Final Edit & Departure', titleAr:'التحرير الأخير والمغادرة', descriptionEn:'Morning edit session with guide, photo print shopping, airport transfer.', descriptionAr:'جلسة تحرير صباحية مع الدليل، تسوق طباعة الصور، مواصلة للمطار.' }
    ]},
    includes: ['Accommodation','All meals','Photography guide','Transport to all locations','Underwater housing rental','Camping gear'],
    excludes: ['Flights','Camera equipment','Memory cards','Insurance'],
    features: ['Sunrise shoots','Astrophotography','Underwater photography','Golden hours','Zero light pollution'],
    featuresAr: ['جلسات الشروق','التصوير الفلكي','التصوير المائي','الساعات الذهبية','انعدام التلوث الضوئي'],
    rating: 5.0, reviewsCount: 14, bookingsCount: 22, viewsCount: 567,
    metaTitle: 'Socotra Photography Expedition 7 Days | Hawari Tours',
    metaDescription: '7-day Socotra photography tour hitting every golden hour: Dragon Blood Trees, Arher dunes, astrophotography.',
    keywords: ['socotra photography','dragon blood tree photo','socotra astrophotography']
  }})
  console.log('  ✅ Tours created\\n')
`

const destSection = `
  // ─── DESTINATIONS ─────────────────────────────────────────────
  console.log('🏛️  Creating destinations...')
  await prisma.destination.createMany({ data: [
    {
      name: 'Dixam Plateau', nameAr: 'هضبة ديكسم',
      slug: 'dixam-plateau',
      description: 'Home to the largest forest of Dragon Blood Trees on Earth. This high-altitude plateau sits at 800m above sea level and presents an alien landscape unlike anywhere else on the planet.',
      descriptionAr: 'موطن أكبر غابة لأشجار الدم على وجه الأرض. تقع هذه الهضبة المرتفعة على ارتفاع 800 متر فوق مستوى البحر وتقدم منظراً غريباً لا مثيل له في أي مكان آخر على الكوكب.',
      coverImage: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200',
      images: ['https://images.unsplash.com/photo-1448375240586-882707db888b?w=800'],
      latitude: 12.48, longitude: 53.95, category: 'NATURE',
      highlights: ['Dragon Blood Trees','Rock pools','Panoramic views','Ancient forest','Endemic flora'],
      activities: ['Trekking','Photography','Bird watching','Botanical tours'],
      bestTimeToVisit: 'October to April', featured: true, isActive: true, viewsCount: 3200
    },
    {
      name: 'Detwah Lagoon', nameAr: 'بحيرة ديتواه',
      slug: 'detwah-lagoon',
      description: 'A UNESCO-recognized gem — a stunning turquoise lagoon separated from the Indian Ocean by a narrow white sand barrier. Ringed by mangroves and dunes, it is a sanctuary for flamingos and migratory birds.',
      descriptionAr: 'جوهرة معترف بها من اليونسكو — بحيرة فيروزية مذهلة تفصلها عن المحيط الهندي حاجز رملي أبيض ضيق. تحيط بها المانغروف والكثبان، وهي ملاذ للفلامنغو والطيور المهاجرة.',
      coverImage: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1200',
      images: [],
      latitude: 12.71, longitude: 53.42, category: 'BEACH', unesco: true,
      highlights: ['Turquoise lagoon','White sand dunes','Flamingos','Mangrove forest','Sunset views'],
      activities: ['Swimming','Kayaking','Bird watching','Photography','Boat rides'],
      bestTimeToVisit: 'October to March', featured: true, isActive: true, viewsCount: 2890
    },
    {
      name: 'Hoq Cave', nameAr: 'كهف حوق',
      slug: 'hoq-cave',
      description: 'One of the most spectacular and largest caves in Arabia, stretching over 4km into the limestone cliffs. Inside are ancient inscriptions in multiple languages including Palmyrene, Indian, Ethiopian, and Arabic dating back 2000 years.',
      descriptionAr: 'أحد أكثر الكهوف استعراضاً وأكبرها في الجزيرة العربية، يمتد لأكثر من 4 كيلومترات في المنحدرات الكلسية. بداخله نقوش قديمة بلغات متعددة منها البالميرية والهندية والإثيوبية والعربية تعود لـ 2000 عام.',
      coverImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1200',
      images: [],
      latitude: 12.63, longitude: 54.38, category: 'ARCHAEOLOGICAL',
      highlights: ['Ancient inscriptions','Massive stalactites','4km length','Multi-language carvings','Mystery history'],
      activities: ['Cave exploration','History tours','Photography','Archaeology'],
      bestTimeToVisit: 'All year (avoid monsoon June-September)', featured: true, isActive: true, viewsCount: 1850
    },
    {
      name: 'Arher Sand Dunes', nameAr: 'كثبان أرهر الرملية',
      slug: 'arher-sand-dunes',
      description: 'The most dramatic juxtaposition in nature — towering white sand dunes cascading directly into crystal-clear turquoise water. Arher is a photographer\'s paradise and one of the most surreal landscapes in the world.',
      descriptionAr: 'أكثر التناقضات الطبيعية إثارة — كثبان رملية بيضاء شاهقة تنحدر مباشرة في مياه فيروزية شفافة. أرهر هي جنة المصورين وواحدة من أكثر المناظر الطبيعية سريالية في العالم.',
      coverImage: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1200',
      images: [],
      latitude: 12.71, longitude: 54.50, category: 'BEACH',
      highlights: ['White dunes','Crystal water','Astrophotography','Sand boarding','Unique landscape'],
      activities: ['Sandboarding','Swimming','Photography','Camping','Astrophotography'],
      bestTimeToVisit: 'October to April', featured: true, isActive: true, viewsCount: 2100
    },
    {
      name: 'Dihamri Marine Reserve', nameAr: 'محمية ديهامري البحرية',
      slug: 'dihamri-marine-reserve',
      description: 'A protected marine park with some of the healthiest coral reefs in the Indian Ocean. Home to 253 species of fish, 253 coral species, and critically endangered sea turtles. Visibility reaches 30+ meters.',
      descriptionAr: 'حديقة بحرية محمية تضم بعضاً من أصحى الشعاب المرجانية في المحيط الهندي. موطن 253 نوعاً من الأسماك و253 نوعاً من المرجان والسلاحف البحرية المهددة بالانقراض. الرؤية تصل لـ 30 متراً وأكثر.',
      coverImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200',
      images: [],
      latitude: 12.49, longitude: 53.84, category: 'WILDLIFE',
      highlights: ['253 fish species','Coral reefs','Sea turtles','30m visibility','Protected status'],
      activities: ['Snorkeling','Scuba diving','Marine photography','Glass-bottom boat'],
      bestTimeToVisit: 'October to May', featured: true, isActive: true, viewsCount: 1650
    },
    {
      name: 'Qalansiyah Village', nameAr: 'قرية قلنسية',
      slug: 'qalansiyah-village',
      description: 'The largest settlement in western Socotra, built beside a stunning protected bay. Famous for its traditional fishing boats (shumbus), fresh seafood, and the nearby Detwah Lagoon.',
      descriptionAr: 'أكبر تجمع سكاني في غرب سقطرى، مبني بجانب خليج محمي رائع. مشهورة بقوارب الصيد التقليدية (الشمباس) والمأكولات البحرية الطازجة وبحيرة ديتواه القريبة.',
      coverImage: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1200',
      images: [],
      latitude: 12.69, longitude: 53.49, category: 'CULTURAL',
      highlights: ['Traditional fishing','Fresh seafood','Authentic culture','Protected bay','Local market'],
      activities: ['Boat trips','Fishing','Cultural tours','Seafood dining','Photography'],
      bestTimeToVisit: 'October to April', featured: false, isActive: true, viewsCount: 890
    }
  ]})
  console.log('  ✅ Destinations created\\n')
`

const content = toursSection + '\n' + destSection
writeFileSync('prisma/seed-tours-dest.js', content, 'utf8')
console.log('Parts written successfully')
