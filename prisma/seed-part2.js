// PART 2: News + Testimonials + Gallery Images
export const part2 = async (prisma, tourIds) => {

    // ─── NEWS ──────────────────────────────────────────────────────
    console.log('📰 Creating news...')
    await prisma.news.createMany({
        data: [
            {
                title: 'Socotra Named Top Emerging Destination 2025',
                titleAr: 'سقطرى تُدرج ضمن أفضل وجهات ناشئة 2025',
                slug: 'socotra-top-emerging-destination-2025',
                excerpt: 'International travel media names Socotra Island among the world\'s top 10 emerging travel destinations for 2025, citing its unique biodiversity and unspoiled landscapes.',
                excerptAr: 'وسائل الإعلام السياحية الدولية تُسمّي جزيرة سقطرى ضمن أفضل 10 وجهات سياحية ناشئة في العالم لعام 2025، مُستشهدةً بتنوعها الحيوي الفريد ومناظرها الطبيعية البكر.',
                content: `<p>Socotra Island has once again captured the world's imagination. Multiple leading travel publications including National Geographic Traveler, Lonely Planet, and Travel + Leisure have independently named Socotra among the most compelling destinations for discerning travelers in 2025.</p><p>What sets Socotra apart is its extraordinary endemism — over 37% of its plant species, 90% of its reptiles, and dozens of its bird species exist nowhere else on Earth. The island's isolation from the African and Arabian mainland for millions of years has created a living laboratory of evolution.</p><p>The Dragon Blood Tree (Dracaena cinnabari), with its distinctive umbrella-shaped canopy, has become an icon of natural wonder for travelers worldwide. Combined with pristine white beaches, turquoise lagoons, and some of the healthiest coral reefs in the Indian Ocean, Socotra truly offers an experience unlike any other on Earth.</p><p>Hawari Tours, the island's premier tour operator, has seen a 340% increase in international inquiries over the past year, reflecting the growing global interest in this remote paradise.</p>`,
                contentAr: `<p>استعادت جزيرة سقطرى مرة أخرى مخيلة العالم. منشورات سفر رائدة متعددة بما فيها ناشيونال جيوغرافيك ترافيلر ولونلي بلانيت وترافل + ليجر سمّت سقطرى بشكل مستقل ضمن الوجهات الأكثر إثارة للمسافرين المميزين لعام 2025.</p><p>ما يميز سقطرى هو تفردها الاستثنائي — أكثر من 37% من أنواع نباتاتها و90% من زواحفها وعشرات من أنواع طيورها لا توجد في أي مكان آخر على وجه الأرض.</p>`,
                coverImage: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?w=800',
                images: [],
                category: 'TOURISM', tags: ['socotra', 'travel', 'emerging destinations', '2025'],
                featured: true, trending: true, published: true,
                publishedAt: new Date('2025-01-15'), viewsCount: 4230,
                authorName: 'Hawari Tours Team',
                metaTitle: 'Socotra Named Top Emerging Destination 2025 | Hawari Tours',
                metaDescription: 'Socotra Island named among world\'s top 10 emerging travel destinations for 2025 by major international travel media.'
            },
            {
                title: 'New Direct Flights to Socotra Boosting Tourism',
                titleAr: 'رحلات جوية مباشرة جديدة لسقطرى تعزز السياحة',
                slug: 'new-direct-flights-socotra-tourism',
                excerpt: 'New airline routes connecting Socotra to major regional hubs are set to make the island more accessible than ever, with direct connections from Abu Dhabi and Muscat.',
                excerptAr: 'مسارات طيران جديدة تربط سقطرى بمحاور إقليمية كبرى ستجعل الجزيرة أكثر سهولة في الوصول من أي وقت مضى، مع اتصالات مباشرة من أبوظبي ومسقط.',
                content: `<p>In a landmark development for Socotra tourism, new airline routes are set to dramatically reduce travel times and improve access to this remote island paradise. The new connections from Abu Dhabi and Muscat are expected to bring a new wave of eco-conscious travelers from across the globe.</p><p>Previously, travelers often needed to connect through Sana'a or Aden on Yemen-registered carriers. The new routes represent a significant improvement in accessibility while maintaining the island's pristine, uncrowded character.</p>`,
                contentAr: `<p>في تطور بارز لسياحة سقطرى، تتهيأ مسارات طيران جديدة لتقليص أوقات السفر بشكل كبير وتحسين الوصول إلى هذه الجزيرة النائية. الاتصالات الجديدة من أبوظبي ومسقط ستجلب موجة جديدة من المسافرين المهتمين بالبيئة من شتى أنحاء العالم.</p>`,
                coverImage: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800',
                images: [], category: 'TOURISM', tags: ['flights', 'socotra', 'accessibility', 'tourism'],
                featured: false, trending: true, published: true,
                publishedAt: new Date('2025-02-10'), viewsCount: 2180,
                authorName: 'Hawari Tours Team'
            },
            {
                title: 'UNESCO Reaffirms Socotra\'s World Heritage Status',
                titleAr: 'اليونسكو تؤكد من جديد مكانة سقطرى كتراث عالمي',
                slug: 'unesco-reaffirms-socotra-world-heritage-status',
                excerpt: 'UNESCO reconfirms Socotra Archipelago\'s Outstanding Universal Value in its latest review, praising conservation efforts and unique biodiversity of the Galapagos of the Indian Ocean.',
                excerptAr: 'اليونسكو تؤكد القيمة العالمية الاستثنائية لأرخبيل سقطرى في مراجعتها الأخيرة، مشيدةً بجهود الحفاظ على التنوع الحيوي الفريد لجالاباغوس المحيط الهندي.',
                content: `<p>The United Nations Educational, Scientific and Cultural Organization (UNESCO) has issued its latest review of the Socotra Archipelago World Heritage Site, reaffirming its Outstanding Universal Value (OUV) designation that was first granted in 2008.</p><p>UNESCO specifically cited Socotra's extraordinary biodiversity: 37% plant endemism, 90% reptile endemism, and unique marine ecosystems. The review praised ongoing conservation efforts by local communities and government authorities.</p>`,
                contentAr: `<p>أصدرت منظمة الأمم المتحدة للتربية والعلم والثقافة (اليونسكو) مراجعتها الأخيرة لموقع أرخبيل سقطرى للتراث العالمي، مؤكدةً تصنيف ذات القيمة العالمية الاستثنائية الذي مُنح لأول مرة عام 2008.</p>`,
                coverImage: 'https://images.unsplash.com/photo-1559827291-72ee739d0d9a?w=800',
                images: [], category: 'UNESCO', tags: ['UNESCO', 'world heritage', 'socotra', 'conservation'],
                featured: true, breaking: false, published: true,
                publishedAt: new Date('2025-01-28'), viewsCount: 3120,
                authorName: 'Hawari Tours Team'
            },
            {
                title: 'Dragon Blood Trees: Climate Change Threatens Ancient Giants',
                titleAr: 'أشجار الدم: تغير المناخ يهدد العمالقة القدامى',
                slug: 'dragon-blood-trees-climate-change-threat',
                excerpt: 'A new scientific study finds that Socotra\'s iconic Dragon Blood Trees face serious threats from changing monsoon patterns, with younger trees struggling to survive in the altered climate.',
                excerptAr: 'دراسة علمية جديدة تجد أن أشجار الدم الأيقونية في سقطرى تواجه تهديدات جدية من أنماط الرياح الموسمية المتغيرة، مع كفاح الأشجار الأصغر للبقاء في المناخ المتغير.',
                content: `<p>A peer-reviewed study published in the journal Nature Plants has raised serious concerns about the future of Socotra's most iconic tree species — the Dragon Blood Tree (Dracaena cinnabari). Researchers from multiple universities found that changing monsoon patterns linked to climate change are reducing the moisture that young trees need to germinate and establish themselves.</p><p>The study found that while adult trees are resilient, tree regeneration has declined by 60% in some areas over the past 50 years. Conservation efforts are now urgently needed to protect nursery areas and encourage natural regeneration in protected zones.</p>`,
                contentAr: `<p>أثارت دراسة محكّمة نُشرت في مجلة نيتشر بلانتس مخاوف جدية حول مستقبل أكثر أنواع الأشجار أيقونية في سقطرى — شجرة الدم.</p>`,
                coverImage: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=800',
                images: [], category: 'ENVIRONMENT', tags: ['dragon blood tree', 'climate change', 'conservation', 'research'],
                featured: false, published: true,
                publishedAt: new Date('2025-02-02'), viewsCount: 1890,
                authorName: 'Hawari Tours Team'
            }
        ]
    })
    console.log('  ✅ News created\n')

    // ─── TESTIMONIALS ─────────────────────────────────────────────
    console.log('💬 Creating testimonials...')
    await prisma.testimonial.createMany({
        data: [
            {
                customerName: 'James Whitmore', customerNameAr: 'جيمس ويتمور',
                customerEmail: 'james.w@email.com', country: 'United Kingdom', countryAr: 'المملكة المتحدة', countryCode: 'GB',
                content: 'Words cannot describe the experience of standing among the Dragon Blood Trees at dawn. Socotra is absolutely otherworldly — the most alien and beautiful place I\'ve ever seen. Hawari Tours organized everything flawlessly. Our guide Mohammed was incredibly knowledgeable about the island\'s ecology and history. The camping under the stars at Arher was the highlight — no light pollution means the Milky Way is absolutely breathtaking.',
                contentAr: 'لا تستطيع الكلمات وصف تجربة الوقوف بين أشجار الدم عند الفجر. سقطرى عالم آخر تماماً — أكثر الأماكن غرابةً وجمالاً التي رأيتها. نظّم فريق رحلات الحواري كل شيء بشكل لا تشوبه شائبة.',
                rating: 5, tourName: 'Socotra Complete Island Discovery', tourNameAr: 'اكتشاف جزيرة سقطرى الشامل',
                date: new Date('2024-11-20'), featured: true, verified: true, published: true
            },
            {
                customerName: 'Sarah Chen', customerNameAr: 'سارة تشن',
                customerEmail: 'sarah.c@email.com', country: 'Australia', countryAr: 'أستراليا', countryCode: 'AU',
                content: 'As a wildlife biologist, I\'ve traveled extensively seeking unique ecosystems. Socotra surpassed every expectation. The endemism is staggering — on a single day walk through Firmhin forest we spotted 8 endemic bird species and 3 endemic reptiles. Hawari Tours gave us access to areas and local experts I never could have arranged independently. Unforgettable.',
                contentAr: 'بصفتي عالمة أحياء برية سافرت كثيراً بحثاً عن أنظمة بيئية فريدة، فاقت سقطرى كل توقعاتي. التوطن مذهل.',
                rating: 5, tourName: 'Socotra Wildlife & Birdwatching Safari', tourNameAr: 'سفاري مراقبة الطيور والحياة البرية',
                date: new Date('2024-10-14'), featured: true, verified: true, published: true
            },
            {
                customerName: 'Marco Bianchi', customerNameAr: 'ماركو بيانكي',
                customerEmail: 'marco.b@email.com', country: 'Italy', countryAr: 'إيطاليا', countryCode: 'IT',
                content: 'I came for photography and left with thousands of the most stunning images of my career. The Dragon Blood Trees at sunrise, Arher dunes at golden hour, and astrophotography with zero light pollution — pure magic. My guide knew exactly where to position me for the best light. Hawari Tours truly understands what photographers need.',
                contentAr: 'جئت من أجل التصوير وغادرت بآلاف من أروع الصور في مسيرتي المهنية. أشجار الدم عند الشروق، وكثبان أرهر في الساعة الذهبية، والتصوير الفلكي بلا تلوث ضوئي — سحر خالص.',
                rating: 5, tourName: 'Socotra Photography Expedition', tourNameAr: 'رحلة التصوير الاحترافي',
                date: new Date('2024-12-03'), featured: true, verified: true, published: true
            },
            {
                customerName: 'Aisha Al-Rashidi', customerNameAr: 'عائشة الراشدي',
                customerEmail: 'aisha.r@email.com', country: 'Oman', countryAr: 'عُمان', countryCode: 'OM',
                content: 'سقطرى تجربة لا تُنسى. كنت أعرف أنها جميلة، لكنني لم أكن أعرف أنها بهذا المستوى من الروعة. الشعاب المرجانية في ديهامري من أنقى ما رأيت في حياتي، والكهوف تحكي تاريخاً لا يصدق. فريق رحلات الحواري محترف جداً ويعرف كيف يجعل كل لحظة مميزة.',
                contentAr: 'سقطرى تجربة لا تُنسى. كنت أعرف أنها جميلة، لكنني لم أكن أعرف أنها بهذا المستوى من الروعة.',
                content: 'Socotra is an unforgettable experience. I knew it was beautiful, but I had no idea it was THIS magnificent. The coral reefs at Dihamri are among the purest I have ever seen in my life, and the caves tell an unbelievable history. Hawari Tours team is very professional and knows how to make every moment special.',
                rating: 5, tourName: 'Socotra Complete Island Discovery', tourNameAr: 'اكتشاف جزيرة سقطرى الشامل',
                date: new Date('2024-09-28'), featured: true, verified: true, published: true
            },
            {
                customerName: 'Thomas Gruber', customerNameAr: 'توماس غروبر',
                customerEmail: 'thomas.g@email.com', country: 'Germany', countryAr: 'ألمانيا', countryCode: 'DE',
                content: 'An incredibly well-organized cultural tour of Socotra. Staying with a local Socotri family was the highlight of my entire travel life. The family showed us how they live, cooked traditional food for us, and shared stories through our guide. The ancient inscriptions in the caves sent chills down my spine. This is REAL travel.',
                contentAr: 'جولة ثقافية منظمة بشكل رائع في سقطرى. الإقامة مع عائلة سقطرية محلية كانت أبرز لحظات حياتي السفرية بأكملها.',
                rating: 5, tourName: 'Socotra Cultural Heritage Immersion', tourNameAr: 'الانغماس في التراث الثقافي',
                date: new Date('2024-11-08'), featured: false, verified: true, published: true
            },
            {
                customerName: 'Elena Popova', customerNameAr: 'إيلينا بوبوفا',
                customerEmail: 'elena.p@email.com', country: 'Russia', countryAr: 'روسيا', countryCode: 'RU',
                content: 'Socotra is truly the Galapagos of the Indian Ocean. Swimming with sea turtles at Dihamri, watching flamingos at Detwah at sunrise, sand-boarding down Arher dunes into the sea — things I will never forget. Hawari Tours made every day feel like a discovery.',
                contentAr: 'سقطرى هي حقاً جالاباغوس المحيط الهندي. السباحة مع السلاحف البحرية، مشاهدة الفلامنغو عند الشروق، التزلج على كثبان أرهر نحو البحر — لحظات لن أنساها أبداً.',
                rating: 4, tourName: 'Marine & Beach Paradise', tourNameAr: 'جنة الشواطئ والبحر',
                date: new Date('2024-12-20'), featured: false, verified: true, published: true
            },
            {
                customerName: 'Khalid Al-Mansouri', customerNameAr: 'خالد المنصوري',
                country: 'UAE', countryAr: 'الإمارات العربية المتحدة', countryCode: 'AE',
                content: 'رحلة تستحق كل درهم وأكثر. الجزيرة زي عالم ثاني، بس بأناس محترمين وثقافة عريقة. شجرة الدم لازم تشوفها بعينك لتفهم ليش كلهم مجانين فيها. الأكل السقطري الأصيل في القرية كان ألذ أكلة في حياتي.',
                content: 'A trip worth every dirham and more. The island is like another world, but with dignified people and an ancient culture. The Dragon Blood Tree must be seen in person to understand why everyone is crazy about it. The authentic Socotri food in the village was the most delicious meal of my life.',
                rating: 5, tourName: 'Socotra Complete Island Discovery', tourNameAr: 'اكتشاف جزيرة سقطرى الشامل',
                date: new Date('2024-10-05'), featured: false, verified: true, published: true
            },
            {
                customerName: 'Yuki Tanaka', customerNameAr: 'يوكي تاناكا',
                country: 'Japan', countryAr: 'اليابان', countryCode: 'JP',
                content: 'The Dragon Blood Trees look exactly like the trees in Avatar — but they are REAL. Standing in Dixam at sunrise was the most spiritual experience of my travel life. The guide shared so much about the island\'s botany and 12 million year history. I am already planning my return trip with Hawari Tours.',
                contentAr: 'تبدو أشجار الدم مثل أشجار فيلم أفاتار تماماً — لكنها حقيقية. الوقوف في ديكسم عند الشروق كان أكثر تجربة روحانية في حياتي السفرية.',
                rating: 5, tourName: 'Dragon Blood Tree & Mountain Trek', tourNameAr: 'رحلة أشجار الدم والجبال',
                date: new Date('2025-01-10'), featured: false, verified: true, published: true
            }
        ]
    })
    console.log('  ✅ Testimonials created\n')

    // ─── GALLERY IMAGES ───────────────────────────────────────────
    console.log('🖼️  Creating gallery images...')
    await prisma.galleryImage.createMany({
        data: [
            { title: 'Dragon Blood Trees at Dawn', titleAr: 'أشجار الدم عند الفجر', description: 'Mystical Dragon Blood Trees silhouetted against the morning sky at Dixam Plateau', descriptionAr: 'أشجار الدم الغامضة تتخلل سماء الصباح في هضبة ديكسم', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=1600', thumbnail: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400', category: 'NATURE', tags: ['dragon blood tree', 'sunrise', 'dixam'], featured: true, isActive: true, width: 1600, height: 1067 },
            { title: 'Detwah Lagoon Turquoise Waters', titleAr: 'مياه بحيرة ديتواه الفيروزية', description: 'Crystal turquoise waters of Detwah Lagoon with white sand dunes', descriptionAr: 'المياه الفيروزية والكريستالية لبحيرة ديتواه مع الكثبان البيضاء', url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1600', thumbnail: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400', category: 'DESTINATIONS', tags: ['detwah', 'lagoon', 'beach'], featured: true, isActive: true, width: 1600, height: 1067 },
            { title: 'Arher Dunes Meeting the Sea', titleAr: 'كثبان أرهر تلتقي البحر', description: 'The iconic white sand dunes of Arher cascading directly into the crystal-clear ocean', descriptionAr: 'الكثبان الرملية البيضاء الأيقونية في أرهر تنحدر مباشرة نحو المحيط الكريستالي', url: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=1600', thumbnail: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=400', category: 'DESTINATIONS', tags: ['arher', 'dunes', 'beach', 'sea'], featured: true, isActive: true, width: 1600, height: 1067 },
            { title: 'Socotra Coral Reef', titleAr: 'الشعاب المرجانية في سقطرى', description: 'Vibrant coral reef at Dihamri Marine Reserve teeming with tropical fish', descriptionAr: 'شعاب مرجانية زاهية في محمية ديهامري البحرية مليئة بالأسماك الاستوائية', url: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=1600', thumbnail: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400', category: 'WILDLIFE', tags: ['coral', 'reef', 'marine', 'diving'], featured: true, isActive: true },
            { title: 'Local Fisherman at Sunrise', titleAr: 'صياد محلي عند شروق الشمس', description: 'Traditional Socotri fisherman preparing his nets at sunrise in Qalansiyah', descriptionAr: 'صياد سقطري تقليدي يُحضّر شباكه عند شروق الشمس في قلنسية', url: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=1600', thumbnail: 'https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=400', category: 'PEOPLE', tags: ['fisherman', 'culture', 'qalansiyah', 'sunrise'], featured: false, isActive: true },
            { title: 'Milky Way over Socotra', titleAr: 'درب التبانة فوق سقطرى', description: 'The Milky Way galaxy blazing overhead at Arher with zero light pollution', descriptionAr: 'مجرة درب التبانة تتألق فوق أرهر في انعدام تام للتلوث الضوئي', url: 'https://images.unsplash.com/photo-1502003148287-a82ef80a6abc?w=1600', thumbnail: 'https://images.unsplash.com/photo-1502003148287-a82ef80a6abc?w=400', category: 'NATURE', tags: ['milkyway', 'astrophotography', 'night', 'stars'], featured: true, isActive: true },
            { title: 'Hoq Cave Stalactites', titleAr: 'صواعد كهف حوق', description: 'Massive limestone stalactites inside the ancient Hoq Cave system', descriptionAr: 'صواعد كلسية ضخمة داخل نظام كهف حوق القديم', url: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600', thumbnail: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400', category: 'DESTINATIONS', tags: ['cave', 'hoq', 'limestone', 'ancient'], featured: false, isActive: true },
            { title: 'Socotri Women in Traditional Dress', titleAr: 'نساء سقطريات بالزي التقليدي', description: 'Local Socotri women in colorful traditional dress during a cultural festival', descriptionAr: 'نساء سقطريات محليات بزي تقليدي ملون خلال مهرجان ثقافي', url: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1600', thumbnail: 'https://images.unsplash.com/photo-1533105079780-92b9be482077?w=400', category: 'CULTURE', tags: ['culture', 'women', 'traditional', 'festival'], featured: false, isActive: true },
            { title: 'Socotra Sunbird on Dragon Blood Tree', titleAr: 'طائر الشمس السقطري على شجرة الدم', description: 'The endemic Socotra Sunbird perched on a Dragon Blood Tree branch', descriptionAr: 'طائر الشمس السقطري المستوطن جالساً على غصن شجرة الدم', url: 'https://images.unsplash.com/photo-1597149657050-44ede5d52d81?w=1600', thumbnail: 'https://images.unsplash.com/photo-1597149657050-44ede5d52d81?w=400', category: 'WILDLIFE', tags: ['bird', 'sunbird', 'endemic', 'wildlife'], featured: false, isActive: true },
            { title: '4WD Safari through Desert', titleAr: 'رحلة 4WD عبر الصحراء', description: 'Off-road vehicle navigating Socotra\'s dramatic desert landscapes', descriptionAr: 'مركبة طرق وعرة تتنقل عبر المناظر الصحراوية المثيرة في سقطرى', url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1600', thumbnail: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', category: 'TOURS', tags: ['4WD', 'adventure', 'desert', 'safari'], featured: false, isActive: true }
        ]
    })
    console.log('  ✅ Gallery images created\n')

}
