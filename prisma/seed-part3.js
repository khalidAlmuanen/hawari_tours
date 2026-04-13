// PART 3: Blog Authors, Tags, Blogs, FAQs, Travel Packages
export const part3 = async (prisma) => {

    // ─── BLOG AUTHORS ─────────────────────────────────────────────
    console.log('📝 Creating blog content...')
    const author1 = await prisma.blogAuthor.create({
        data: {
            nameEn: 'Mohammed Al-Kathiri', nameAr: 'محمد الكثيري',
            titleEn: 'Senior Guide & Local Expert', titleAr: 'دليل أول وخبير محلي',
            bioEn: 'Born and raised in Socotra, Mohammed has spent 15 years guiding visitors through the island\'s most remote corners. He is a certified botanical guide with deep knowledge of endemic flora and the Socotri language.',
            bioAr: 'وُلد محمد في سقطرى ونشأ فيها، وقضى 15 عاماً يرشد الزوار عبر أبعد أركان الجزيرة. هو دليل نباتي معتمد يمتلك معرفة عميقة بالنباتات المستوطنة واللغة السقطرية.',
            avatar: 'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=400',
            socials: { instagram: '@mohammed_socotra', youtube: 'MohammedSocotra' }
        }
    })
    const author2 = await prisma.blogAuthor.create({
        data: {
            nameEn: 'Layla Al-Hamdani', nameAr: 'ليلى الحمداني',
            titleEn: 'Travel Writer & Marine Biologist', titleAr: 'كاتبة سفر وعالمة أحياء بحرية',
            bioEn: 'Layla combines her passion for marine biology with travel writing. Having dived in 40+ countries, she considers Socotra\'s marine ecosystem the most pristine she has ever encountered.',
            bioAr: 'تجمع ليلى شغفها بعلم الأحياء البحرية مع الكتابة السياحية. بعد الغطس في أكثر من 40 دولة، تعتبر النظام البيئي البحري في سقطرى الأنقى الذي صادفته على الإطلاق.',
            avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400',
            socials: { twitter: '@layla_marine', instagram: '@layla_dives' }
        }
    })

    // ─── BLOG TAGS ────────────────────────────────────────────────
    const tagDragon = await prisma.blogTag.create({ data: { nameEn: 'Dragon Blood Tree', nameAr: 'شجرة الدم', slug: 'dragon-blood-tree' } })
    const tagBeach = await prisma.blogTag.create({ data: { nameEn: 'Beaches', nameAr: 'الشواطئ', slug: 'beaches' } })
    const tagWild = await prisma.blogTag.create({ data: { nameEn: 'Wildlife', nameAr: 'الحياة البرية', slug: 'wildlife' } })
    const tagCulture = await prisma.blogTag.create({ data: { nameEn: 'Culture', nameAr: 'الثقافة', slug: 'culture' } })
    const tagTravel = await prisma.blogTag.create({ data: { nameEn: 'Travel Tips', nameAr: 'نصائح السفر', slug: 'travel-tips' } })
    const tagPhoto = await prisma.blogTag.create({ data: { nameEn: 'Photography', nameAr: 'التصوير', slug: 'photography' } })
    const tagNature = await prisma.blogTag.create({ data: { nameEn: 'Nature', nameAr: 'الطبيعة', slug: 'nature' } })
    const tagHistory = await prisma.blogTag.create({ data: { nameEn: 'History', nameAr: 'التاريخ', slug: 'history' } })

    // ─── BLOGS ────────────────────────────────────────────────────
    await prisma.blog.create({
        data: {
            titleEn: '10 Reasons Why Socotra Will Change Your Life',
            titleAr: '10 أسباب ستغير حياتك في سقطرى',
            slug: '10-reasons-socotra-will-change-your-life',
            excerptEn: 'From alien-looking trees to pristine beaches untouched by mass tourism, Socotra offers experiences that will fundamentally alter how you see the world.',
            excerptAr: 'من الأشجار ذات المظهر الغريب إلى الشواطئ النقية التي لم تمسها السياحة الجماعية، تقدم سقطرى تجارب ستغير جوهرياً كيف ترى العالم.',
            contentEn: `<h2>1. The Dragon Blood Tree Forest Will Haunt Your Dreams</h2><p>No photograph, no matter how technically perfect, can prepare you for standing beneath a 300-year-old Dragon Blood Tree at sunrise. The mushroom-shaped canopy, the blood-red resin, the prehistoric landscape around you — your brain will struggle to classify what it's seeing as real. It looks like a Tolkien illustration come to life.</p><h2>2. You'll Snorkel in a Marine Paradise</h2><p>Dihamri Marine Reserve has some of the healthiest coral reefs in the entire Indian Ocean. 30-meter visibility, 253 fish species, sea turtles, octopuses, and vibrantly colored reef fish — all in waters so clear they appear painted.</p><h2>3. The Night Sky Will Blow Your Mind</h2><p>Socotra has virtually zero light pollution. On a clear October night at Arher beach, the Milky Way is so dense it lights up the sand. You'll suddenly understand why ancient civilizations built entire religions around the stars.</p><h2>4. You'll Meet a Culture That Hasn't Changed in Centuries</h2><p>The Socotri people speak a language that has never been written. Their oral traditions, their poetry, their ancient knowledge of plants — these are things that exist nowhere else and are slowly disappearing. Meeting them is a privilege.</p><h2>5. The White Sand Dunes Will Wreck Your Instagram Standards</h2><p>Arher's white sand dunes cascading into turquoise water looks better in real life than any photo suggests. Sand boarding down into the crystal water is a physical joy that's hard to match anywhere.</p><h2>6. You'll Actually Feel Like an Explorer</h2><p>In a world where every destination is documented to death, Socotra still feels genuinely undiscovered. Most of the island is roadless. The caves haven't all been mapped. The remote beaches are empty.</p><h2>7. The Food Will Surprise You</h2><p>Fresh fish grilled over wood fire by a Socotri family. Local honey from Socotra's unique bee subspecies. Coconut-based dishes. Simple, clean flavors from ingredients you can only find on this island.</p><h2>8. You'll Stop Looking at Your Phone</h2><p>Mobile signal on Socotra is limited. This is not a bug — it's a feature. You'll spend a week fully present, watching sunsets, listening to waves, actually talking to the person next to you.</p><h2>9. It Will Make You Care About Conservation</h2><p>When you see the Dragon Blood Trees and learn that climate change is reducing their regeneration by 60%, you'll leave Socotra a more committed conservationist. Beauty creates responsibility.</p><h2>10. You'll Need to Come Back</h2><p>Every traveler who visits Socotra leaves planning when they can return. It does something to you that's hard to explain. The island stays with you.</p>`,
            contentAr: `<h2>1. غابة أشجار الدم ستسكن أحلامك</h2><p>لا صورة فوتوغرافية، مهما كانت تقنياً مثالية، يمكنها أن تُعدّك للوقوف تحت شجرة دم عمرها 300 عام عند الفجر. المظلة الشبيهة بالفطر، والراتنج الأحمر الدموي، والمشهد ما قبل التاريخي حولك — سيكافح عقلك لتصنيف ما يراه كواقع.</p>`,
            coverImage: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1200',
            category: 'TRAVEL', authorId: author1.id,
            tags: { connect: [{ id: tagDragon.id }, { id: tagBeach.id }, { id: tagNature.id }, { id: tagTravel.id }] },
            published: true, featured: true, publishedAt: new Date('2025-01-10'), viewsCount: 8720,
            metaTitle: '10 Reasons Socotra Will Change Your Life | Hawari Tours Blog',
            metaDescription: 'From Dragon Blood Trees to pristine marine life — discover 10 transformative reasons why Socotra Island must be on your bucket list.',
            keywords: ['socotra reasons to visit', 'socotra bucket list', 'socotra travel guide']
        }
    })

    await prisma.blog.create({
        data: {
            titleEn: 'Dragon Blood Trees: The Complete Guide to Socotra\'s Most Iconic Tree',
            titleAr: 'أشجار الدم: الدليل الشامل لأكثر أشجار سقطرى أيقونية',
            slug: 'dragon-blood-tree-complete-guide',
            excerptEn: 'Everything you need to know about Socotra\'s legendary Dragon Blood Tree — its biology, history, where to see it, and the conservation challenges it faces.',
            excerptAr: 'كل ما تحتاج معرفته عن شجرة الدم الأسطورية في سقطرى — بيولوجيتها وتاريخها وأين يمكن رؤيتها وتحديات الحفاظ عليها.',
            contentEn: `<h2>What is the Dragon Blood Tree?</h2><p>The Dragon Blood Tree (Dracaena cinnabari) is endemic to Socotra Island. Its distinctive upward-tilting branches form a dense, mushroom-shaped canopy perfectly evolved to collect moisture from coastal fog and channel it to the roots — a remarkable adaptation to Socotra's harsh, dry environment.</p><h2>Why is it Called "Dragon Blood"?</h2><p>When the bark is cut, the tree oozes a deep crimson resin — the "dragon blood." This resin has been traded for over 2,000 years. Ancient Romans used it as a dye for violins (Stradivarius famously used it). Today it's used in traditional medicine, varnishes, and incense.</p><h2>How Old Are They?</h2><p>Dragon Blood Trees grow extremely slowly. A tree with a trunk 1 meter in diameter can be 250-300 years old. The oldest trees in Dixam Plateau may be 500+ years old.</p><h2>Where to See Them: Best Locations</h2><p><strong>Dixam Plateau</strong> — The most spectacular location. Drive 2 hours from Hadibo into the mountains. Sunrise here is transcendent.<br><strong>Firmhin Forest</strong> — Denser forest, more intimate experience. Good for botanical guides.<br><strong>Skand Mountains</strong> — Remote, requires hiking but exceptional views.</p><h2>Conservation Status</h2><p>A 2021 study published in Nature Plants found that Dragon Blood Tree regeneration has declined by up to 75% in some areas over 50 years due to changing monsoon patterns linked to climate change. Conservation efforts are now critical to their survival.</p>`,
            contentAr: `<h2>ما هي شجرة الدم؟</h2><p>شجرة الدم (Dracaena cinnabari) هي نوع مستوطن فريد في جزيرة سقطرى. فروعها المميزة المائلة للأعلى تشكل مظلة كثيفة شبيهة بالفطر، تطورت بشكل مثالي لتجمع الرطوبة من ضباب الساحل وتوجيهه نحو الجذور.</p>`,
            coverImage: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1200',
            category: 'NATURE', authorId: author1.id,
            tags: { connect: [{ id: tagDragon.id }, { id: tagNature.id }, { id: tagPhoto.id }] },
            published: true, featured: true, publishedAt: new Date('2024-12-15'), viewsCount: 12340,
            metaTitle: 'Dragon Blood Tree Complete Guide | Hawari Tours',
            metaDescription: 'Complete guide to the Dragon Blood Tree: biology, history, best viewing locations and conservation status.',
            keywords: ['dragon blood tree', 'dracaena cinnabari', 'socotra tree', 'dixam plateau']
        }
    })

    await prisma.blog.create({
        data: {
            titleEn: 'The Ultimate Socotra Packing List (From Locals Who Know)',
            titleAr: 'قائمة التعبئة الشاملة لسقطرى (من محليين يعلمون)',
            slug: 'socotra-ultimate-packing-list',
            excerptEn: 'What to pack for Socotra — the definitive list from guides who\'ve led hundreds of tours. Don\'t come without reading this.',
            excerptAr: 'ما تُعبّئ لرحلة سقطرى — القائمة الحاسمة من أدلاء قادوا مئات الجولات. لا تجئ دون قراءة هذا.',
            contentEn: `<h2>The Socotra Packing Challenge</h2><p>Socotra is remote. There are no pharmacies beyond Hadibo town, no gear shops, and supply is limited. Anything you forget, you're going without. After years of leading tours, our guides have assembled the definitive list.</p><h2>Clothing</h2><ul><li><strong>Light hiking pants x3</strong> — Avoid jeans, they're awful when wet and heavy</li><li><strong>Long-sleeve UV shirts</strong> — Sun is brutal, especially at altitude</li><li><strong>Fleece layer</strong> — Nights in the mountains drop to 15°C</li><li><strong>Good walking sandals + hiking boots</strong> — You need both</li><li><strong>Swimwear x2</strong> — You'll use it daily</li></ul><h2>Health & Safety</h2><ul><li><strong>High-SPF sunscreen (50+)</strong> — The equatorial sun is intense</li><li><strong>Oral rehydration salts</strong> — Heat exhaustion is real</li><li><strong>Broad-spectrum antibiotics</strong> (doctor prescribed) — For emergencies</li><li><strong>Diarrhea medication</strong></li><li><strong>Travel insurance documents</strong> — Absolutely essential</li></ul><h2>Photography</h2><ul><li><strong>Extra batteries x3+</strong> — No charging opportunities in camps</li><li><strong>Dust-proof bag</strong> — Desert dust will destroy unprotected gear</li><li><strong>Polarizing filter</strong> — Essential for ocean and sky shots</li><li><strong>Wide-angle lens</strong> — Dragon Blood tree forests need it</li></ul><h2>Camping Gear (If Not Renting)</h2><ul><li>Headlamp + extra batteries</li><li>Sleeping bag liner (Socotra provides tents)</li><li>Trekking poles</li></ul>`,
            contentAr: `<h2>تحدي التعبئة لسقطرى</h2><p>سقطرى نائية. لا صيدليات خارج مدينة حديبو، ولا محلات معدات، والإمدادات محدودة. أي شيء تنساه ستكون بدونه. بعد سنوات من قيادة الجولات، جمع أدلاؤنا القائمة الحاسمة.</p>`,
            coverImage: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=1200',
            category: 'TRAVEL', authorId: author2.id,
            tags: { connect: [{ id: tagTravel.id }] },
            published: true, featured: false, publishedAt: new Date('2024-11-20'), viewsCount: 5430,
            metaTitle: 'Socotra Packing List: What to Bring | Hawari Tours',
            metaDescription: 'The definitive Socotra packing list from experienced local guides — clothing, health, photography equipment.',
            keywords: ['socotra packing list', 'what to pack socotra', 'socotra travel tips']
        }
    })

    await prisma.blog.create({
        data: {
            titleEn: 'Socotra\'s Marine World: Snorkeling Guide',
            titleAr: 'عالم سقطرى البحري: دليل الغطس',
            slug: 'socotra-marine-snorkeling-guide',
            excerptEn: 'A marine biologist\'s guide to snorkeling in Socotra — the best spots, what to expect, and the incredible marine life you\'ll encounter.',
            excerptAr: 'دليل عالمة أحياء بحرية للغطس في سقطرى — أفضل المواقع وما يمكن توقعه والحياة البحرية المذهلة التي ستقابلها.',
            contentEn: `<h2>Why Socotra's Marine World is Extraordinary</h2><p>As a marine biologist who has dived in over 40 countries, I can say without hesitation that Socotra's marine ecosystems are among the most intact I have encountered. The combination of relative isolation, minimal fishing pressure in protected areas, and the convergence of three ocean currents creates conditions for exceptional biodiversity.</p><h2>Top Snorkeling Spots</h2><h3>1. Dihamri Marine Reserve ⭐⭐⭐⭐⭐</h3><p>The crown jewel. Protected since 1996. Visibility often exceeds 30 meters. You'll encounter massive schools of tropical fish, hawksbill sea turtles, octopuses, and some of the most vibrant coral gardens I've seen outside the Coral Triangle. Go at first light for the best colors.</p><h3>2. Shu'ab Bay ⭐⭐⭐⭐⭐</h3><p>Accessible only by boat, which keeps it pristine. An enclosed bay with calm water, excellent visibility, and an astonishing diversity of reef fish and coral formations.</p><h3>3. Detwah Lagoon (Inner) ⭐⭐⭐⭐</h3><p>Different ecosystem — shallow, warm lagoon water with mangrove-adapted species. Excellent for seahorses, pipefish, and juvenile reef fish. Real magic at high tide.</p><h2>Marine Life to Look For</h2><ul><li><strong>Hawksbill Sea Turtle</strong> — Common at Dihamri</li><li><strong>Socotra Grouper</strong> — Endemic species</li><li><strong>Moray Eels</strong> — In every reef crevice</li><li><strong>Lionfish</strong> — Spectacularly beautiful, do not touch</li><li><strong>Octopus</strong> — Incredibly common, fascinating to watch</li></ul>`,
            contentAr: `<h2>لماذا العالم البحري في سقطرى استثنائي؟</h2><p>بصفتي عالمة أحياء بحرية غصت في أكثر من 40 دولة، يمكنني القول بدون تردد أن الأنظمة البيئية البحرية في سقطرى من بين الأكثر سلامةً التي صادفتها.</p>`,
            coverImage: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1200',
            category: 'NATURE', authorId: author2.id,
            tags: { connect: [{ id: tagWild.id }, { id: tagNature.id }] },
            published: true, featured: false, publishedAt: new Date('2024-10-05'), viewsCount: 4210,
            metaTitle: 'Socotra Snorkeling Guide: Best Spots & Marine Life | Hawari Tours',
            metaDescription: 'Marine biologist\'s guide to snorkeling in Socotra — best spots, marine life, and tips for the perfect underwater experience.',
            keywords: ['socotra snorkeling', 'socotra marine', 'dihamri marine reserve', 'socotra diving']
        }
    })
    console.log('  ✅ Blogs created\n')

    // ─── FAQs ─────────────────────────────────────────────────────
    console.log('❓ Creating FAQs...')
    await prisma.fAQ.createMany({
        data: [
            { questionEn: 'Do I need a visa to visit Socotra?', questionAr: 'هل أحتاج تأشيرة لزيارة سقطرى؟', answerEn: 'Most nationalities require a Yemen visa to visit Socotra. However, Socotra is administered separately and some operators facilitate tourist permits directly. We handle all visa and permit arrangements for our guests. Contact us in advance for your specific nationality requirements.', answerAr: 'معظم الجنسيات تحتاج تأشيرة يمنية لزيارة سقطرى. لكن سقطرى تُدار بشكل منفصل وبعض المشغلين يسهلون تصاريح الزوار مباشرة. نحن نتولى ترتيبات جميع التأشيرات والتصاريح ضيوفنا. تواصل معنا مسبقاً لمتطلبات جنسيتك المحددة.', category: 'VISA', order: 1, isActive: true },
            { questionEn: 'What is the best time to visit Socotra?', questionAr: 'ما هو أفضل وقت لزيارة سقطرى؟', answerEn: 'October to April is the ideal period. The climate is mild (25-32°C), winds are manageable, and all activities are accessible. Avoid June to September — the southwest monsoon (Khareef) makes most boat activities dangerous and many beaches inaccessible. March-April and October-November are particularly spectacular.', answerAr: 'أكتوبر حتى أبريل هو الموسم المثالي. المناخ معتدل (25-32°C) والرياح مناسبة وجميع الأنشطة متاحة. تجنب يونيو حتى سبتمبر — الرياح الموسمية الجنوبية الغربية (الخريف) تجعل معظم الأنشطة البحرية خطرة.', category: 'TRAVEL', order: 2, isActive: true },
            { questionEn: 'How do I get to Socotra?', questionAr: 'كيف أصل إلى سقطرى؟', answerEn: 'Socotra is accessible by air from Abu Dhabi (FlyAkeed), Muscat, and Sharjah. Flight time is approximately 2 hours from UAE/Oman. Occasionally charter flights operate from other hubs. We coordinate all flight bookings and can advise on current airline schedules for your travel dates.', answerAr: 'يمكن الوصول إلى سقطرى جواً من أبوظبي (فلاي أكد) ومسقط والشارقة. وقت الرحلة حوالي ساعتان من الإمارات/عُمان. نحن نتولى جميع حجوزات الطيران ويمكننا إرشادك حول جداول الطيران الحالية.', category: 'TRAVEL', order: 3, isActive: true },
            { questionEn: 'Is Socotra safe for tourists?', questionAr: 'هل سقطرى آمنة للسياح؟', answerEn: 'Socotra Island itself is peaceful and welcoming to tourists. The Socotri people are famously hospitable. The island has its own local administration and has remained stable. Standard travel precautions apply: travel with a reputable operator like Hawari Tours, purchase comprehensive travel insurance, and follow your guide\'s safety advice.', answerAr: 'جزيرة سقطرى نفسها مسالمة ومرحّبة بالسياح. الشعب السقطري معروف بالضيافة. للجزيرة إدارتها المحلية وظلت مستقرة. تنطبق احتياطات السفر المعيارية: السفر مع مشغل موثوق كرحلات الحواري وشراء تأمين سفر شامل واتباع نصائح دليلك للسلامة.', category: 'SAFETY', order: 4, isActive: true },
            { questionEn: 'What is the currency in Socotra?', questionAr: 'ما هي العملة في سقطرى؟', answerEn: 'The official currency is the Yemeni Rial, but USD is widely accepted and preferred for tourist transactions. We recommend bringing USD cash as ATMs are unavailable. Credit cards are not accepted outside Hadibo town. Budget $50-80 USD per day for personal expenses beyond your tour package.', answerAr: 'العملة الرسمية هي الريال اليمني، لكن الدولار الأمريكي مقبول على نطاق واسع ومفضل في المعاملات السياحية. ننصح بإحضار دولار نقداً حيث لا تتوفر ماكينات الصراف الآلي. بطاقات الائتمان غير مقبولة خارج مدينة حديبو.', category: 'GENERAL', order: 5, isActive: true },
            { questionEn: 'Can I cancel or reschedule my tour?', questionAr: 'هل يمكنني إلغاء رحلتي أو إعادة جدولتها؟', answerEn: 'Yes. Cancellations made 30+ days before departure receive a full refund. 14-29 days: 75% refund. 7-13 days: 50% refund. Less than 7 days: no refund. Rescheduling is free with 14+ days notice subject to availability. We strongly recommend comprehensive travel insurance to cover unexpected cancellations.', answerAr: 'نعم. الإلغاءات التي تتم قبل 30 يوماً أو أكثر من المغادرة تحصل على استرداد كامل. 14-29 يوماً: استرداد 75%. 7-13 يوماً: استرداد 50%. أقل من 7 أيام: لا يوجد استرداد.', category: 'BOOKING', order: 6, isActive: true },
            { questionEn: 'What level of fitness do I need?', questionAr: 'ما مستوى اللياقة البدنية المطلوبة؟', answerEn: 'It depends on the tour. Some tours like Cultural Heritage are suitable for limited fitness. Our Beach tours require basic swimming ability. Mountain treks require good baseline fitness. The Complete Island Discovery tour is moderate — if you can walk 8-10km on uneven terrain, you\'ll manage. Always consult our tour pages for specific fitness requirements.', answerAr: 'يعتمد على الجولة. بعض الجولات كالتراث الثقافي مناسبة للياقة محدودة. جولاتنا الشاطئية تتطلب قدرة سباحة أساسية. الرحلات الجبلية تتطلب لياقة جيدة.', category: 'TOURS', order: 7, isActive: true },
            { questionEn: 'Is there internet and mobile signal in Socotra?', questionAr: 'هل يوجد إنترنت وإشارة هاتفية في سقطرى؟', answerEn: 'Mobile signal exists in Hadibo town and some main roads (SabaFon and Yemen Mobile networks). In remote areas, mountains, and beaches there is NO signal. Internet is very limited and slow. We recommend this as a digital detox opportunity! Arrange to stay connected via satellite messengers (like Garmin InReach) for emergencies.', answerAr: 'تتوفر إشارة هاتفية في مدينة حديبو وبعض الطرق الرئيسية (شبكات سبأفون واليمن موبايل). في المناطق النائية والجبال والشواطئ لا توجد إشارة. الإنترنت محدود جداً وبطيء.', category: 'GENERAL', order: 8, isActive: true }
        ]
    })
    console.log('  ✅ FAQs created\n')

    // ─── TRAVEL PACKAGES ─────────────────────────────────────────
    console.log('📦 Creating travel packages...')
    await prisma.travelPackage.createMany({
        data: [
            {
                title: 'Explorer Package', titleAr: 'باقة المستكشف',
                price: 650, duration: '4 Days', durationAr: '4 أيام',
                features: ['Dragon Blood Trees', 'Hoq Cave', '2 beaches', 'Camping 1 night', 'Airport transfers', 'Expert guide'],
                featuresAr: ['أشجار الدم', 'كهف حوق', 'شاطئان', 'ليلة تخييم', 'مواصلات المطار', 'دليل خبير'],
                gradient: 'from-emerald-500 to-teal-600', isPopular: false, isFeatured: false, isActive: true, order: 1
            },
            {
                title: 'Discovery Package', titleAr: 'باقة الاكتشاف',
                price: 950, duration: '6 Days', durationAr: '6 أيام',
                features: ['Dragon Blood Trees', 'Detwah Lagoon', 'Dihamri snorkeling', 'Arher Dunes', 'Hoq Cave', '2 camping nights', 'All meals included'],
                featuresAr: ['أشجار الدم', 'بحيرة ديتواه', 'غطس ديهامري', 'كثبان أرهر', 'كهف حوق', 'ليلتا تخييم', 'جميع الوجبات'],
                gradient: 'from-blue-600 to-indigo-700', isPopular: true, isFeatured: true, isActive: true, order: 2
            },
            {
                title: 'Ultimate Socotra Package', titleAr: 'باقة سقطرى الشاملة',
                price: 1450, duration: '10 Days', durationAr: '10 أيام',
                features: ['All Socotra highlights', 'Multiple campsites', 'Boat trips included', 'Village homestay', 'Professional photographer', 'All meals & accommodation', 'Private 4WD', 'Unlimited guide support'],
                featuresAr: ['جميع معالم سقطرى', 'مواقع تخييم متعددة', 'رحلات بحرية مشمولة', 'إقامة في قرية', 'مصور احترافي', 'جميع الوجبات والإقامة', 'سيارة 4WD خاصة', 'دعم دليل غير محدود'],
                gradient: 'from-amber-500 to-orange-600', isPopular: false, isFeatured: true, isActive: true, order: 3
            }
        ]
    })
    console.log('  ✅ Travel packages created\n')
}
