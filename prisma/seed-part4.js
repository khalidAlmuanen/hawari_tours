// PART 4: Travel Guide, History, About, Unique Features, Homepage
export const part4 = async (prisma) => {

    // ─── QUICK TIPS ──────────────────────────────────────────────
    console.log('🧳 Creating travel guide content...')
    await prisma.quickTip.createMany({
        data: [
            { icon: '🌡️', title: 'Best Time to Visit', titleAr: 'أفضل وقت للزيارة', description: 'Visit October to April for ideal weather. Avoid June-September monsoon season.', descriptionAr: 'زر الجزيرة من أكتوبر إلى أبريل للطقس المثالي. تجنب موسم الرياح الموسمية يونيو-سبتمبر.', gradient: 'from-orange-400 to-red-500', order: 1, isActive: true },
            { icon: '💰', title: 'Budget Planning', titleAr: 'التخطيط للميزانية', description: 'Bring USD cash. No ATMs outside Hadibo. Budget $50-80/day for personal expenses.', descriptionAr: 'احضر دولارات نقداً. لا ماكينات صراف خارج حديبو. ميزانية 50-80 دولار/يوم للمصروف الشخصي.', gradient: 'from-green-500 to-emerald-600', order: 2, isActive: true },
            { icon: '☀️', title: 'Sun Protection Essential', titleAr: 'الحماية من الشمس ضرورية', description: 'SPF 50+ sunscreen mandatory. UV index is extreme. Cover up especially at altitude.', descriptionAr: 'واقي شمس 50+ إلزامي. مؤشر الأشعة فوق البنفسجية شديد. تغطى خاصةً في الارتفاعات.', gradient: 'from-yellow-400 to-orange-500', order: 3, isActive: true },
            { icon: '📵', title: 'Limited Connectivity', titleAr: 'اتصال محدود', description: 'Mobile signal only in Hadibo. Embrace the digital detox. Bring a satellite messenger.', descriptionAr: 'إشارة هاتف في حديبو فقط. استمتع بإزالة سُمّ الرقمي. احضر جهاز مراسلة فضائي.', gradient: 'from-purple-500 to-indigo-600', order: 4, isActive: true },
            { icon: '🎒', title: 'Pack Minimally & Wisely', titleAr: 'عبّئ بحكمة', description: 'No luggage shops on island. Pack light hiking clothes, swim gear, good boots, headlamp.', descriptionAr: 'لا محلات أمتعة في الجزيرة. عبّئ ملابس تنزه خفيفة، معدات سباحة، حذاء جيد، مصباح رأس.', gradient: 'from-teal-500 to-cyan-600', order: 5, isActive: true },
            { icon: '🏥', title: 'Health Preparation', titleAr: 'التحضير الصحي', description: 'No major hospital outside Hadibo. Bring prescription antibiotics, ORS, personal medications.', descriptionAr: 'لا مستشفى كبير خارج حديبو. احضر مضادات حيوية بوصفة طبية، أملاح ترطيب، أدوية شخصية.', gradient: 'from-rose-500 to-pink-600', order: 6, isActive: true }
        ]
    })

    // ─── VISA ─────────────────────────────────────────────────────
    await prisma.visaRequirement.createMany({
        data: [
            { itemEn: 'Valid passport with minimum 6 months validity', itemAr: 'جواز سفر ساري المفعول بصلاحية 6 أشهر على الأقل', icon: '🛂', order: 1, isActive: true },
            { itemEn: 'Yemen tourist visa (we facilitate through our network)', itemAr: 'تأشيرة سياحية يمنية (نسهلها عبر شبكتنا)', icon: '📋', order: 2, isActive: true },
            { itemEn: 'Tourist permit for Socotra specifically', itemAr: 'تصريح سياحي خاص بسقطرى', icon: '📃', order: 3, isActive: true },
            { itemEn: 'Travel insurance covering remote destinations (mandatory)', itemAr: 'تأمين سفر يغطي الوجهات النائية (إلزامي)', icon: '🛡️', order: 4, isActive: true },
            { itemEn: 'Return flight ticket confirmation', itemAr: 'تأكيد تذكرة العودة', icon: '✈️', order: 5, isActive: true }
        ]
    })

    // ─── FLIGHT ROUTES ────────────────────────────────────────────
    await prisma.flightRoute.createMany({
        data: [
            { fromEn: 'Abu Dhabi, UAE', fromAr: 'أبوظبي، الإمارات', airline: 'FlyAkeed', duration: '2h 10m', frequencyEn: '4 times weekly', frequencyAr: '4 مرات أسبوعياً', price: '$280 - $420', icon: '🇦🇪', gradient: 'from-green-500 to-emerald-600', order: 1, isActive: true },
            { fromEn: 'Muscat, Oman', fromAr: 'مسقط، عُمان', airline: 'Oman Air Charter', duration: '2h 30m', frequencyEn: '2 times weekly', frequencyAr: 'مرتان أسبوعياً', price: '$320 - $480', icon: '🇴🇲', gradient: 'from-red-500 to-rose-600', order: 2, isActive: true },
            { fromEn: 'Sharjah, UAE', fromAr: 'الشارقة، الإمارات', airline: 'Air Arabia Charter', duration: '2h 15m', frequencyEn: 'Seasonal (Oct–Apr)', frequencyAr: 'موسمي (أكتوبر–أبريل)', price: '$260 - $400', icon: '🇦🇪', gradient: 'from-blue-500 to-indigo-600', order: 3, isActive: true },
            { fromEn: 'Sana\'a, Yemen', fromAr: 'صنعاء، اليمن', airline: 'Yemenia', duration: '1h 40m', frequencyEn: '3 times weekly', frequencyAr: '3 مرات أسبوعياً', price: '$180 - $280', icon: '🇾🇪', gradient: 'from-amber-500 to-orange-600', order: 4, isActive: true }
        ]
    })

    // ─── LOCAL TRANSPORT ──────────────────────────────────────────
    await prisma.localTransport.createMany({
        data: [
            { typeEn: '4WD Vehicle (Recommended)', typeAr: 'مركبة دفع رباعي (موصى بها)', descriptionEn: 'Most roads on Socotra are unpaved tracks requiring 4WD. We provide experienced drivers who know the terrain.', descriptionAr: 'معظم طرق سقطرى مسالك غير معبدة تتطلب دفعاً رباعياً. نوفر سائقين خبراء يعرفون التضاريس.', priceEn: 'Included in tour packages', priceAr: 'مشمول في باقات الجولات', icon: '🚙', gradient: 'from-orange-500 to-red-600', features: ['Expert local driver', 'Island-wide access', 'Off-road capable', 'Luggage space'], order: 1, isActive: true },
            { typeEn: 'Boat Trips', typeAr: 'رحلات بالقارب', descriptionEn: 'Essential for reaching remote beaches like Shoab and for marine experiences. Traditional wooden boats (shumbus) and motorboats available.', descriptionAr: 'ضرورية للوصول للشواطئ النائية كشعب وللتجارب البحرية. قوارب خشبية تقليدية (شمباس) وقوارب بمحرك متاحة.', priceEn: '$40–120 per trip', priceAr: '40–120 دولار للرحلة', icon: '⛵', gradient: 'from-blue-500 to-cyan-600', features: ['Remote beach access', 'Snorkeling spots', 'Fishing trips', 'Island hopping'], order: 2, isActive: true }
        ]
    })

    // ─── ACCOMMODATION ────────────────────────────────────────────
    await prisma.accommodationType.createMany({
        data: [
            { typeEn: 'Beach & Desert Camping', typeAr: 'التخييم على الشاطئ والصحراء', descriptionEn: 'The most authentic Socotra experience. Sleep under stars at Arher or Wadi Ayhaft with zero light pollution. We provide high-quality Berber tents, sleeping mats, lanterns, and hearty campfire meals.', descriptionAr: 'أكثر تجارب سقطرى أصالة. النوم تحت النجوم في أرهر أو وادي عيهفت مع انعدام التلوث الضوئي.', priceEn: 'Included in tour packages', priceAr: 'مشمول في باقات الجولات', icon: '⛺', rating: 5, gradient: 'from-orange-500 to-amber-600', features: ['Berber tents', 'Sleeping mats', 'Campfire meals', 'Star gazing', 'Authentic experience'], examples: ['Arher Beach Camp', 'Wadi Ayhaft Camp', 'Dixam Mountain Camp'], order: 1, isActive: true },
            { typeEn: 'Guesthouses (Hadibo)', typeAr: 'بيوت ضيافة (حديبو)', descriptionEn: 'Simple but comfortable family-run guesthouses in Hadibo city offering AC rooms, private bathrooms, Wi-Fi, and home-cooked Yemeni breakfast.', descriptionAr: 'بيوت ضيافة عائلية بسيطة لكن مريحة في مدينة حديبو تقدم غرفاً مكيفة وحمامات خاصة وواي فاي وفطور يمني منزلي.', priceEn: '$35–65/night', priceAr: '35–65 دولار/ليلة', icon: '🏠', rating: 3, gradient: 'from-teal-500 to-green-600', features: ['Air conditioning', 'Private bathroom', 'Wi-Fi', 'Local breakfast', 'Family-run'], examples: ['Socotra Eco-Tours Guesthouse', 'Hadibo City Rest House', 'Hamid\'s Family Guesthouse'], order: 2, isActive: true },
            { typeEn: 'Eco-Lodge', typeAr: 'المنتجع البيئي', descriptionEn: 'The only upscale accommodation option on the island. Comfortable semi-permanent structures with real beds, fans, shared facilities, and remarkable locations near beaches.', descriptionAr: 'خيار الإقامة الرفيع الوحيد في الجزيرة. منشآت شبه دائمة مريحة مع أسرة حقيقية ومراوح ومرافق مشتركة ومواقع رائعة.', priceEn: '$80–130/night', priceAr: '80–130 دولار/ليلة', icon: '🌿', rating: 4, gradient: 'from-green-600 to-emerald-700', features: ['Real beds', 'Solar power', 'Beach access', 'Local meals', 'Eco-certified'], examples: ['Socotra Eco-Lodge Qalansiyah', 'Detwah Eco-Camp', 'Dihamri Eco-Lodge'], order: 3, isActive: true }
        ]
    })

    // ─── SAFETY CATEGORIES ───────────────────────────────────────
    const safetyCat1 = await prisma.safetyCategory.create({ data: { categoryEn: 'Health & Medical', categoryAr: 'الصحة والرعاية الطبية', icon: '🏥', order: 1, isActive: true } })
    const safetyCat2 = await prisma.safetyCategory.create({ data: { categoryEn: 'Sun & Heat', categoryAr: 'الشمس والحرارة', icon: '☀️', order: 2, isActive: true } })
    const safetyCat3 = await prisma.safetyCategory.create({ data: { categoryEn: 'Ocean & Marine', categoryAr: 'المحيط والبحر', icon: '🌊', order: 3, isActive: true } })

    await prisma.safetyTip.createMany({
        data: [
            { categoryId: safetyCat1.id, tipEn: 'The nearest major hospital is in Hadibo. Bring all required prescription medications.', tipAr: 'أقرب مستشفى رئيسي في حديبو. احضر جميع أدويتك الموصوفة.', isImportant: true, order: 1 },
            { categoryId: safetyCat1.id, tipEn: 'Travel insurance covering medical evacuation is mandatory and non-negotiable.', tipAr: 'تأمين السفر الذي يغطي الإخلاء الطبي إلزامي وغير قابل للتفاوض.', isImportant: true, order: 2 },
            { categoryId: safetyCat2.id, tipEn: 'Apply SPF 50+ sunscreen every 2 hours. The equatorial UV index causes severe sunburn rapidly.', tipAr: 'ضع كريم الحماية SPF50+ كل ساعتين. مؤشر الأشعة الاستوائية يتسبب في حروق شمس شديدة سريعاً.', isImportant: true, order: 1 },
            { categoryId: safetyCat2.id, tipEn: 'Drink minimum 3-4 liters of water daily. Heat exhaustion is the most common medical issue on tour.', tipAr: 'اشرب 3-4 لترات من الماء يومياً كحد أدنى. الإجهاد الحراري هو أكثر مشكلة طبية شيوعاً أثناء الجولات.', isImportant: false, order: 2 },
            { categoryId: safetyCat3.id, tipEn: 'Never swim alone. Currents on exposed beaches can be deceptively strong.', tipAr: 'لا تسبح وحدك أبداً. التيارات على الشواطئ المكشوفة يمكن أن تكون قوية بشكل مخادع.', isImportant: true, order: 1 },
            { categoryId: safetyCat3.id, tipEn: 'Only snorkel at recommended sites. Some areas have dangerous currents not visible on the surface.', tipAr: 'الغطس فقط في المواقع الموصى بها. بعض المناطق لديها تيارات خطيرة غير مرئية من السطح.', isImportant: false, order: 2 }
        ]
    })

    // ─── EMERGENCY CONTACTS ───────────────────────────────────────
    await prisma.emergencyContact.createMany({
        data: [
            { nameEn: 'Hawari Tours Emergency Line', nameAr: 'خط طوارئ رحلات الحواري', number: '+967 777 123 456', icon: '📞', order: 1, isActive: true },
            { nameEn: 'Socotra Police', nameAr: 'شرطة سقطرى', number: '+967 5 370 001', icon: '🚔', order: 2, isActive: true },
            { nameEn: 'Hadibo General Hospital', nameAr: 'مستشفى حديبو العام', number: '+967 5 370 100', icon: '🏥', order: 3, isActive: true },
            { nameEn: 'Coast Guard', nameAr: 'خفر السواحل', number: '+967 5 370 200', icon: '⛵', order: 4, isActive: true }
        ]
    })

    // ─── PACKING CATEGORIES ───────────────────────────────────────
    await prisma.packingCategory.createMany({
        data: [
            { categoryEn: 'Clothing', categoryAr: 'الملابس', icon: '👕', items: ['Light hiking pants x3', 'Long-sleeve UV shirts x3', 'Fleece/light jacket', 'Swimwear x2', 'Underwear x5', 'Hiking boots (broken in)', 'Walking sandals', 'Wide-brim hat'], order: 1, isActive: true },
            { categoryEn: 'Health & Safety', categoryAr: 'الصحة والسلامة', icon: '💊', items: ['SPF 50+ sunscreen (large)', 'Insect repellent', 'ORS sachets x10', 'Broad-spectrum antibiotics (prescribed)', 'Anti-diarrheal medication', 'Blister plasters', 'Ankle bandage', 'Personal prescription medications'], order: 2, isActive: true },
            { categoryEn: 'Photography', categoryAr: 'التصوير', icon: '📷', items: ['Extra camera batteries x3+', 'Dust-proof camera bag', 'Memory cards (ample)', 'Polarizing filter', 'Wide-angle lens', 'Headlamp for night photography', 'Underwater housing (for snorkeling)'], order: 3, isActive: true },
            { categoryEn: 'Documents', categoryAr: 'الوثائق', icon: '📄', items: ['Passport (6+ months validity)', 'Visa & tourist permits', 'Travel insurance documents & card', 'Flight tickets (printed)', 'Emergency contacts list', 'Hawari Tours booking confirmation'], order: 4, isActive: true }
        ]
    })
    console.log('  ✅ Travel guide content created\n')

    // ─── TIMELINE EVENTS ──────────────────────────────────────────
    console.log('🏛️  Creating history content...')
    await prisma.timelineEvent.createMany({
        data: [
            { year: '~8000 BCE', era: 'ancient', titleEn: 'First Human Settlement', titleAr: 'أول مستوطنة بشرية', descriptionEn: 'Archaeological evidence suggests humans first settled Socotra around 8000 BCE, making it one of the earliest inhabited islands in the Indian Ocean.', descriptionAr: 'تشير الأدلة الأثرية إلى أن البشر استوطنوا سقطرى لأول مرة حوالي 8000 قبل الميلاد.', icon: '🏕️', color: 'from-amber-600 to-orange-700', order: 1, isActive: true },
            { year: '~3000 BCE', era: 'ancient', titleEn: 'Ancient Trade Route Hub', titleAr: 'مركز طريق التجارة القديمة', descriptionEn: 'Socotra becomes a key stop on the ancient Indian Ocean trade routes. Dragon Blood resin and aloe are traded across Arabia, India, and Africa.', descriptionAr: 'تصبح سقطرى محطة رئيسية على طرق التجارة القديمة في المحيط الهندي. يُتداول راتنج الدم والصبار عبر الجزيرة العربية والهند وأفريقيا.', icon: '⛵', color: 'from-yellow-500 to-amber-600', order: 2, isActive: true },
            { year: '~100 CE', era: 'ancient', titleEn: 'Periplus of the Erythraean Sea', titleAr: 'رحلة بحر إريتريا', descriptionEn: 'The Greek maritime guide "Periplus of the Erythraean Sea" documents Socotra as "Dioscorides Island" — a wealthy island known for its aloe, dragon blood, and Indian tortoiseshell.', descriptionAr: 'يوثّق الدليل البحري اليوناني "ريبلوس البحر الإريتري" سقطرى بوصفها "جزيرة ديوسكوريدس" — جزيرة ثرية معروفة بالصبار والدم الأجوف وسلاحف الهند.', icon: '📜', color: 'from-orange-500 to-red-600', order: 3, isActive: true },
            { year: '1507 CE', era: 'colonial', titleEn: 'Portuguese Occupation', titleAr: 'الاحتلال البرتغالي', descriptionEn: 'The Portuguese build a fort near Suq (modern Hadibo) — the first European colonial presence on Socotra. They abandon it 4 years later due to harsh conditions.', descriptionAr: 'يبني البرتغاليون حصناً بالقرب من سوق (حديبو الحديثة) — أول حضور استعماري أوروبي في سقطرى. يتركونه بعد 4 سنوات بسبب الظروف القاسية.', icon: '⚓', color: 'from-blue-600 to-indigo-700', order: 4, isActive: true },
            { year: '1886 CE', era: 'colonial', titleEn: 'British Protectorate', titleAr: 'الحماية البريطانية', descriptionEn: 'Socotra becomes a British protectorate under the Mahra Sultanate treaty. British interest is primarily strategic — controlling the Gulf of Aden shipping lanes.', descriptionAr: 'تصبح سقطرى محمية بريطانية بموجب معاهدة سلطنة المهرة. الاهتمام البريطاني استراتيجي في الأساس.', icon: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', color: 'from-red-600 to-rose-700', order: 5, isActive: true },
            { year: '1967 CE', era: 'modern', titleEn: 'Independence — Socotra joins Yemen', titleAr: 'الاستقلال — سقطرى تنضم إلى اليمن', descriptionEn: 'With South Yemen\'s independence from Britain, Socotra becomes part of the People\'s Democratic Republic of Yemen. The island begins to open up after centuries of colonial isolation.', descriptionAr: 'مع استقلال جنوب اليمن عن بريطانيا، تصبح سقطرى جزءاً من جمهورية اليمن الديمقراطية الشعبية.', icon: '🕊️', color: 'from-green-600 to-teal-700', order: 6, isActive: true },
            { year: '2008 CE', era: 'modern', titleEn: 'UNESCO World Heritage Status', titleAr: 'مكانة التراث العالمي لليونسكو', descriptionEn: 'The Socotra Archipelago is inscribed as a UNESCO World Heritage Site for its Outstanding Universal Value, extraordinary biodiversity, and high endemism.', descriptionAr: 'أُدرج أرخبيل سقطرى في قائمة التراث العالمي لليونسكو لقيمته العالمية الاستثنائية وتنوعه الحيوي الاستثنائي وارتفاع معدل التوطن.', icon: '🏆', color: 'from-purple-600 to-violet-700', order: 7, isActive: true }
        ]
    })

    // ─── ARCHAEOLOGICAL SITES ─────────────────────────────────────
    await prisma.archaeologicalSite.createMany({
        data: [
            { nameEn: 'Hoq Cave', nameAr: 'كهف حوق', periodEn: 'Pre-Islamic, 1st–5th century CE', periodAr: 'ما قبل الإسلام، القرن 1-5 م', descriptionEn: 'The most significant archaeological site on Socotra — a 4km-deep cave on the northeastern coast containing hundreds of ancient inscriptions in Palmyrene, South Arabian, Brahmi, Ethiopian Ge\'ez, and early Arabic scripts. These inscriptions document the island\'s role as a trading hub visited by merchants from across the ancient world.', descriptionAr: 'أهم موقع أثري في سقطرى — كهف بعمق 4 كيلومترات على الساحل الشمالي الشرقي يحتوي على مئات النقوش القديمة بالخطوط البالميرية والجنوب عربية والبراهمية والإثيوبية الجعزية والعربية المبكرة.', significanceEn: 'Proof of Socotra\'s importance as an ancient multicultural trading post. The multilingual inscriptions show merchants from the Roman Empire, India, Yemen, and Ethiopia all visited the island.', significanceAr: 'دليل على أهمية سقطرى كمحطة تجارية قديمة متعددة الثقافات. النقوش متعددة اللغات تظهر أن تجاراً من الإمبراطورية الرومانية والهند واليمن وإثيوبيا زاروا الجزيرة.', locationEn: 'Northeast coast, near Hadibu', locationAr: 'الساحل الشمالي الشرقي، بالقرب من حديبو', accessEn: 'Accessible by 4WD + 2-hour trek. Hawari Tours guides lead this route.', accessAr: 'يمكن الوصول بسيارة 4WD + رحلة مشي ساعتين. أدلاء رحلات الحواري يقودون هذا المسار.', gradient: 'from-amber-600 to-orange-700', featured: true, isActive: true, order: 1 },
            { nameEn: 'Ditwah Lagoon Rock Art', nameAr: 'فن الصخور في بحيرة ديتواه', periodEn: 'Neolithic / Ancient', periodAr: 'العصر الحجري الحديث / قديم', descriptionEn: 'Prehistoric rock carvings around the Detwah Lagoon area depicting animals, boats, and human figures believed to date from Neolithic times (8000-3000 BCE). These carvings represent some of the earliest evidence of human presence on the island.', descriptionAr: 'نقوش صخرية ما قبل التاريخ حول منطقة بحيرة ديتواه تصوّر حيوانات وقوارب وأشكالاً بشرية يُعتقد أنها ترجع إلى العصر الحجري الحديث (8000-3000 قبل الميلاد).', locationEn: 'Detwah Lagoon area, western Socotra', locationAr: 'منطقة بحيرة ديتواه، غرب سقطرى', gradient: 'from-stone-500 to-amber-600', featured: false, isActive: true, order: 2 }
        ]
    })

    // ─── HISTORICAL ERAS ─────────────────────────────────────────
    const eraAncient = await prisma.historicalEra.create({ data: { nameEn: 'Ancient Socotra', nameAr: 'سقطرى القديمة', period: '8000 BCE – 600 CE', periodAr: '8000 ق.م – 600 م', descriptionEn: 'From first human settlement through the island\'s golden age as a hub of the ancient Indian Ocean trade routes.', descriptionAr: 'من أول مستوطنة بشرية حتى العصر الذهبي للجزيرة كمركز لطرق التجارة القديمة في المحيط الهندي.', color: '#D97706', order: 1, isActive: true } })
    const eraColonial = await prisma.historicalEra.create({ data: { nameEn: 'Colonial Era', nameAr: 'العصر الاستعماري', period: '1507 CE – 1967 CE', periodAr: '1507 م – 1967 م', descriptionEn: 'Portuguese, then British colonial influence reshaped Socotra\'s connections to the outside world while its interior remained culturally intact.', descriptionAr: 'الاستعمار البرتغالي ثم البريطاني أعاد تشكيل علاقات سقطرى مع العالم الخارجي بينما ظل داخلها ثقافياً سليماً.', color: '#3B82F6', order: 2, isActive: true } })
    const eraModern = await prisma.historicalEra.create({ data: { nameEn: 'Modern Socotra', nameAr: 'سقطرى الحديثة', period: '1967 CE – Present', periodAr: '1967 م – الحاضر', descriptionEn: 'From Yemeni unification through UNESCO World Heritage designation to emergence as a premier eco-tourism destination.', descriptionAr: 'من التوحيد اليمني عبر تصميم التراث العالمي لليونسكو إلى الظهور وجهةً رائدة للسياحة البيئية.', color: '#10B981', order: 3, isActive: true } })

    await prisma.historicalEvent.createMany({
        data: [
            { eraId: eraAncient.id, year: '~3000 BCE', titleEn: 'Dragon Blood Resin Trade Begins', titleAr: 'بدء تجارة راتنج الدم', descriptionEn: 'Socotra\'s Dragon Blood resin becomes one of the most sought-after commodities in the ancient world — used as dye, medicine, and religious incense.', descriptionAr: 'يصبح راتنج الدم في سقطرى من أكثر السلع المرغوبة في العالم القديم — يُستخدم كصبغة ودواء وبخور ديني.', icon: '🌿', order: 1, isActive: true },
            { eraId: eraAncient.id, year: '~100 CE', titleEn: 'Greek Merchants Document the Island', titleAr: 'التجار اليونانيون يوثقون الجزيرة', descriptionEn: 'The Periplus of the Erythraean Sea describes Socotra in detail, naming it Dioscorides Island and noting the Greek and Indian merchants who resided there.', descriptionAr: 'يصف ريبلوس البحر الإريتري سقطرى بالتفصيل، مسمياً إياها جزيرة ديوسكوريدس، مشيراً إلى التجار اليونانيين والهنود القاطنين فيها.', icon: '📜', order: 2, isActive: true },
            { eraId: eraColonial.id, year: '1507 CE', titleEn: 'Portuguese Fort Construction', titleAr: 'بناء الحصن البرتغالي', descriptionEn: 'Afonso de Albuquerque establishes the first European fort on Socotra near the town of Suq, attempting to control Indian Ocean trade routes.', descriptionAr: 'يؤسس أفونسو دي ألبوكيرك أول حصن أوروبي في سقطرى بالقرب من بلدة سوق محاولاً السيطرة على طرق التجارة في المحيط الهندي.', icon: '⚓', order: 1, isActive: true },
            { eraId: eraModern.id, year: '2008 CE', titleEn: 'UNESCO World Heritage Inscription', titleAr: 'إدراج اليونسكو في التراث العالمي', descriptionEn: 'The Socotra Archipelago is added to the UNESCO World Heritage List, bringing global attention to its extraordinary and fragile ecosystems.', descriptionAr: 'يُضاف أرخبيل سقطرى إلى قائمة التراث العالمي لليونسكو، مما يجلب الاهتمام العالمي لأنظمته البيئية الاستثنائية والهشة.', icon: '🏆', order: 1, isActive: true }
        ]
    })

    // ─── ABOUT SECTIONS ───────────────────────────────────────────
    await prisma.aboutSection.createMany({
        data: [
            { type: 'GEOGRAPHY', titleEn: 'An Island Apart', titleAr: 'جزيرة بعيدة', contentEn: 'Socotra is part of an island archipelago of the same name and is located in the Arabian Sea near the Gulf of Aden. The island is the largest of the four islands of the Socotra archipelago. It lies some 240 km east of the Horn of Africa and 380 km south of the Arabian Peninsula. The island is about 3,600 km² in area and inhabited by perhaps 60,000 to 70,000 people. The terrain is dominated by a limestone plateau rising from the coast with Hajhir Mountains reaching 1,525m at their highest point.', contentAr: 'سقطرى جزء من أرخبيل جزر بنفس الاسم وتقع في بحر العرب بالقرب من خليج عدن. الجزيرة هي الأكبر من بين الجزر الأربع لأرخبيل سقطرى. تقع على بُعد نحو 240 كيلومتراً شرق القرن الأفريقي و380 كيلومتراً جنوب شبه الجزيرة العربية.', order: 1, isActive: true },
            { type: 'NATURE', titleEn: 'The Galapagos of the Indian Ocean', titleAr: 'جالاباغوس المحيط الهندي', contentEn: 'Socotra has been called "the Galapagos of the Indian Ocean" due to its extraordinary level of biodiversity and endemism. The island was separated from the mainland of Africa and Arabia for the past 6–7 million years, allowing its plant and animal life to evolve in isolation. As a result, over 37% of Socotra\'s plant species, 90% of its reptile species, and significant percentages of its bird and marine life are found nowhere else on Earth.', contentAr: 'أُطلق على سقطرى "جالاباغوس المحيط الهندي" بسبب مستوى التنوع الحيوي والتوطن الاستثنائي. انفصلت الجزيرة عن بر أفريقيا والجزيرة العربية منذ 6-7 ملايين سنة، مما سمح للحياة النباتية والحيوانية بالتطور في عزلة.', order: 2, isActive: true },
            { type: 'CULTURE', titleEn: 'A Living Culture in Isolation', titleAr: 'ثقافة حية في عزلة', contentEn: 'The Socotri people maintain one of the most unique cultures in the world. They speak Socotri — an unwritten South Semitic language with no alphabet and no written literature, transmitted entirely through oral tradition. Their ancient knowledge of botanical medicines, their distinctive music, and their traditions of boat-building have survived largely intact due to the island\'s centuries of geographic isolation.', contentAr: 'يحافظ الشعب السقطري على إحدى أكثر الثقافات تميزاً في العالم. يتحدثون السقطرية — لغة سامية جنوبية غير مكتوبة بلا أبجدية ولا أدب مكتوب، تُنقل بالكامل عبر التقليد الشفهي.', order: 3, isActive: true },
            { type: 'HISTORY', titleEn: 'A Crossroads of Ancient Civilizations', titleAr: 'ملتقى الحضارات القديمة', contentEn: 'For thousands of years, Socotra was one of the most strategically important islands in the Indian Ocean. Its position on the ancient spice and incense trade routes made it a stopover for ships from Arabia, India, Egypt, and the Mediterranean. The famous cave of Hoq on the northeast coast contains ancient inscriptions in languages including Palmyrene, South Arabian, Indian Brahmi, Ethiopian Ge\'ez — proof of the island\'s cosmopolitan ancient visitors.', contentAr: 'لآلاف السنين، كانت سقطرى من أكثر الجزر أهمية استراتيجية في المحيط الهندي. موقعها على طرق تجارة البهارات والبخور القديمة جعلها محطة توقف للسفن من الجزيرة العربية والهند ومصر والبحر الأبيض المتوسط.', order: 4, isActive: true }
        ]
    })

    // ─── ENDEMIC SPECIES ─────────────────────────────────────────
    await prisma.endemicSpecies.createMany({
        data: [
            { nameEn: 'Dragon Blood Tree', nameAr: 'شجرة الدم', scientificName: 'Dracaena cinnabari', descriptionEn: 'The most iconic symbol of Socotra. Named for its deep red resin ("dragon\'s blood"), this remarkable tree has a distinctive umbrella-shaped canopy perfectly evolved to collect fog moisture. It grows extremely slowly — trees with 1m diameter trunks can be 300+ years old.', descriptionAr: 'الرمز الأكثر أيقونية لسقطرى. سُمّيت بسحر رتنجها الأحمر العميق ("دم التنين"). لهذه الشجرة الرائعة مظلة شبيهة بالمظلة تطورت بشكل مثالي لتجميع رطوبة الضباب.', imageUrl: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800', category: 'FLORA', conservationStatus: 'Vulnerable (Climate Change Threat)', facts: ['Produces blood-red resin used for 2000+ years', 'Canopy evolved to channel fog water to roots', 'Grows only 1-2cm per year', 'Used in traditional medicine, perfume, and violin varnish'], order: 1, isActive: true },
            { nameEn: 'Socotra Desert Rose', nameAr: 'وردة الصحراء السقطرية', scientificName: 'Adenium obesum socotranum', descriptionEn: 'A succulent tree with a massively swollen, water-storing trunk that looks like an elephant\'s foot. Produces strikingly beautiful pink-white flowers. A highly photogenic endemic that grows in rocky limestone areas.', descriptionAr: 'شجرة عصارية بجذع ضخم منتفخ لتخزين المياه يشبه قدم الفيل. تنتج زهوراً وردية بيضاء جميلة بشكل مذهل.', imageUrl: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800', category: 'FLORA', conservationStatus: 'Near Threatened', facts: ['Trunk stores water for drought survival', 'Related to the garden Adenium but far more extreme', 'Called "bottle tree" locally', 'Among the most photographed plants on the island'], order: 2, isActive: true },
            { nameEn: 'Socotra Sunbird', nameAr: 'طائر الشمس السقطري', scientificName: 'Cinnyris balfouri', descriptionEn: 'A brilliantly colored endemic bird with iridescent purple-blue plumage. Found only in Socotra\'s montane forests and scrublands. The male has a spectacular curved bill perfectly adapted for feeding on Dragon Blood Tree flowers.', descriptionAr: 'طير مستوطن ذو ألوان زاهية برياش أرجواني-أزرق متقزح. يوجد فقط في غابات سقطرى الجبلية والأدغال.', imageUrl: 'https://images.unsplash.com/photo-1597149657050-44ede5d52d81?w=800', category: 'BIRDS', conservationStatus: 'Least Concern (Endemic)', facts: ['Found nowhere else on Earth', 'Iridescent plumage appears different colors at different angles', 'Curved bill evolved for Dragon Blood Tree flowers', 'Listed among Arabian Peninsula\'s most beautiful birds'], order: 3, isActive: true },
            { nameEn: 'Socotra Chameleon', nameAr: 'حرباء سقطرى', scientificName: 'Chamaeleo monachus', descriptionEn: 'Socotra\'s endemic chameleon is larger than most mainland species and displays remarkable color-changing abilities. Found in trees and shrubs across the island, it is a favorite subject for wildlife photographers.', descriptionAr: 'حرباء سقطرى المستوطنة أكبر من معظم الأنواع القارية وتُظهر قدرات رائعة على تغيير الألوان.', imageUrl: 'https://images.unsplash.com/photo-1444464666168-49d633b86797?w=800', category: 'FAUNA', conservationStatus: 'Vulnerable (Endemic)', facts: ['Can change color in under 30 seconds', 'Larger than most African chameleon species', 'Males have a distinctive peaked head crest', 'Excellent night vision'], order: 4, isActive: true }
        ]
    })

    // ─── CULTURAL ELEMENTS ────────────────────────────────────────
    await prisma.culturalElement.createMany({
        data: [
            { titleEn: 'The Socotri Language', titleAr: 'اللغة السقطرية', descriptionEn: 'Socotri is a South Semitic language related to Arabic and Hebrew but entirely distinct. It has NO written form — the entire language exists only in oral tradition. Ancient poetry, medicinal knowledge, and cultural wisdom are preserved in the memories of elders. Linguists consider it one of the most fascinating unwritten living languages on Earth.', descriptionAr: 'السقطرية هي لغة سامية جنوبية ذات صلة بالعربية والعبرية لكنها مختلفة تماماً. لا يوجد لها شكل مكتوب — اللغة بأكملها موجودة في التقليد الشفهي فقط.', icon: '🗣️', order: 1, isActive: true },
            { titleEn: 'Traditional Honey Production', titleAr: 'إنتاج العسل التقليدي', descriptionEn: 'Socotra has its own subspecies of the honeybee (Apis mellifera jementica) that has evolved in isolation for millions of years. The resulting honey, produced from endemic flowers, has a unique flavor profile found nowhere else. Local beekeepers maintain ancient practices passed down for generations.', descriptionAr: 'سقطرى لديها سلالتها الخاصة من نحل العسل (أبيس ميليفيرا يمنيتيكا) الذي تطور في عزلة لملايين السنين. العسل الناتج، المُنتج من الزهور المستوطنة، له نكهة فريدة لا مثيل لها في أي مكان آخر.', icon: '🍯', order: 2, isActive: true },
            { titleEn: 'Rababa Music Tradition', titleAr: 'تقليد موسيقى الربابة', descriptionEn: 'The Rababa is a traditional one-stringed fiddle that forms the heart of Socotri musical tradition. Accompanied by rhythmic hand-clapping and call-and-response poetry singing, Rababa performances are still held in villages for celebrations, weddings, and community gatherings.', descriptionAr: 'الربابة هي كمان تقليدي أحادي الوتر يشكل قلب التقليد الموسيقي السقطري. مصحوبة بالتصفيق الإيقاعي وغناء الشعر التبادلي.', icon: '🎵', order: 3, isActive: true }
        ]
    })
    console.log('  ✅ History & about content created\n')

    // ─── UNIQUE FEATURES ──────────────────────────────────────────
    console.log('✨ Creating unique features...')
    await prisma.uniqueFeature.createMany({
        data: [
            {
                type: 'FLORA', nameEn: 'Dragon Blood Tree', nameAr: 'شجرة الدم',
                descriptionEn: 'The most iconic tree on Earth. The Dragon Blood Tree\'s alien mushroom-shaped canopy, blood-red resin, and prehistoric appearance make it the symbol of Socotra. It can live for 500+ years and produces a deep crimson resin prized since ancient times.',
                descriptionAr: 'الشجرة الأكثر أيقونية على وجه الأرض. مظلة شجرة الدم الشبيهة بالفطر والغريبة الشكل وراتنجها الأحمر الدموي ومظهرها ما قبل التاريخي تجعلها رمز سقطرى.',
                images: ['https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800'],
                facts: ['Found ONLY on Socotra', 'Produces blood-red "dragon blood" resin', 'Canopy evolved to catch ocean fog', 'Can survive 500+ years', 'Used in traditional medicine for 2000+ years'],
                uses: ['Dye (including violin varnish)', 'Traditional wound treatment', 'Incense and religious ceremonies', 'Anti-inflammatory medicine'],
                threats: ['Climate change reducing monsoon moisture', 'Reduced regeneration rate by 60%', 'Overgrazing by feral goats'],
                scientificName: 'Dracaena cinnabari', categoryEn: 'Endemic Flora', categoryAr: 'نباتات مستوطنة',
                bestTimeEn: 'October to April (clear skies, best photography)', bestTimeAr: 'أكتوبر إلى أبريل (سماء صافية، أفضل تصوير)',
                conservationStatus: 'Vulnerable', conservationStatusAr: 'عُرضة للخطر',
                location: 'Dixam Plateau, Firmhin Forest, Skand Mountains', locationAr: 'هضبة ديكسم، غابة فرمهين، جبال سكند',
                icon: '🌳', featured: true, order: 1, isActive: true, rating: 5.0
            },
            {
                type: 'BEACH', nameEn: 'Arher White Sand Dunes', nameAr: 'كثبان أرهر البيضاء',
                descriptionEn: 'The most surreal beach landscape in the world — towering white sand dunes that cascade directly into crystal-clear turquoise ocean. No other beach on Earth offers this specific combination of pure white dunes meeting the sea at their peak.',
                descriptionAr: 'أكثر مناظر الشاطئ سريالية في العالم — كثبان رملية بيضاء شاهقة تنحدر مباشرة في المحيط الفيروزي الكريستالي.',
                images: ['https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800'],
                facts: ['Dunes reach up to 40 meters height', 'White silica sand (no coral)', 'Zero development within 10km', 'Voted one of world\'s best beaches repeatedly'],
                activitiesEn: 'Sandboarding, swimming, astrophotography, camping, sunrise/sunset photography',
                activitiesAr: 'التزلج على الرمال، السباحة، التصوير الفلكي، التخييم، تصوير الشروق والغروب',
                bestTimeEn: 'October to April. Visit at sunrise or sunset for optimal photography.',
                bestTimeAr: 'أكتوبر إلى أبريل. زر عند الشروق أو الغروب للتصوير الأمثل.',
                location: 'Eastern coast, Socotra', locationAr: 'الساحل الشرقي، سقطرى',
                icon: '🏖️', featured: true, order: 2, isActive: true, rating: 5.0
            },
            {
                type: 'CAVE', nameEn: 'Hoq Cave', nameAr: 'كهف حوق',
                descriptionEn: 'One of the most spectacular and largest caves in Arabia — a 4km-deep limestone cavern on northeastern Socotra. Inside are thousands of stalactites and stalagmites, and hundreds of ancient inscriptions in multiple language scripts left by traders visiting 2000 years ago.',
                descriptionAr: 'أحد أبهى وأكبر الكهوف في الجزيرة العربية — كهف جيري بعمق 4 كيلومترات في شمال شرق سقطرى.',
                images: ['https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=800'],
                facts: ['4km+ total length (partially explored)', 'Ancient inscriptions in 5+ language scripts', 'Temperatures inside constant ~22°C', 'Some chambers over 40 meters high'],
                activitiesEn: 'Guided cave trek, archaeological exploration, photography',
                activitiesAr: 'رحلة كهف موجهة، استكشاف أثري، تصوير',
                difficultyEn: 'Moderate — 2-hour uphill trek to reach entrance',
                difficultyAr: 'متوسط — رحلة تسلق ساعتين للوصول للمدخل',
                depth: '4km+ explored depth', bestTimeEn: 'All year (cooler inside during summer)',
                bestTimeAr: 'طوال العام (أبرد في الداخل خلال الصيف)',
                location: 'Northeast coast, near Hadibu', locationAr: 'الساحل الشمالي الشرقي، بالقرب من حديبو',
                icon: '🦇', featured: true, order: 3, isActive: true, rating: 4.9
            },
            {
                type: 'WILDLIFE', nameEn: 'Socotra Endemic Birds (44 Species)', nameAr: 'طيور سقطرى المستوطنة (44 نوعاً)',
                descriptionEn: 'Socotra is a birdwatcher\'s paradise with 44 species found nowhere else on Earth. From the iridescent Socotra Sunbird to the massive Egyptian Vulture, the island\'s bird life is extraordinary and remarkably accessible.',
                descriptionAr: 'سقطرى هي جنة مراقبي الطيور مع 44 نوعاً لا توجد في أي مكان آخر على الأرض.',
                images: ['https://images.unsplash.com/photo-1597149657050-44ede5d52d81?w=800'],
                facts: ['44 endemic bird species', 'Home to Egyptian Vulture, Osprey, Socotra Sunbird', 'Detwah lagoon hosts flamingos seasonally', 'Firmhin forest best for endemic species'],
                activitiesEn: 'Birdwatching tours, photography, natural observation',
                activitiesAr: 'جولات مراقبة الطيور، تصوير، مراقبة طبيعية',
                categoryEn: 'Endemic Wildlife', categoryAr: 'حياة برية مستوطنة',
                bestTimeEn: 'October to April for migratory species. Year-round for endemic species.',
                bestTimeAr: 'أكتوبر لأبريل للأنواع المهاجرة. طوال العام للأنواع المستوطنة.',
                icon: '🦅', featured: false, order: 4, isActive: true, rating: 4.8
            }
        ]
    })
    console.log('  ✅ Unique features created\n')
}
