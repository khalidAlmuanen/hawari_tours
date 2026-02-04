// ═══════════════════════════════════════════════════════════════════════
// 📄 ملف: data/tours-complete.js
// الوصف: جميع الرحلات الـ6 كاملة - جاهز للنسخ واللصق
// ═══════════════════════════════════════════════════════════════════════

export const toursData = [
  {
    id: 1,
    slug: 'camping-adventure',
    title: {
      ar: 'مغامرة التخييم',
      en: 'Camping Adventure'
    },
    shortDesc: {
      ar: 'تجربة تخييم شاملة في قلب الطبيعة البكر',
      en: 'Complete camping experience in pristine nature'
    },
    description: {
      ar: 'استمتع بتجربة تخييم لا تُنسى في أجمل مواقع سقطرى. نوفر لك معدات احترافية ومرشدين خبراء.',
      en: 'Enjoy an unforgettable camping experience in the most beautiful sites of Socotra.'
    },
    price: 1200,
    originalPrice: 1500,
    currency: 'USD',
    duration: {
      days: 7,
      nights: 6
    },
    rating: 4.9,
    reviewsCount: 127,
    difficulty: 'moderate',
    category: 'camping',
    featured: true,
    
    images: {
      main: '/img/tours/tour1.webp',
      gallery: [
        '/img/tours/tour1.webp',
        '/img/destinations/diksam.webp',
        '/img/destinations/arher.webp'
      ]
    },
    
    groupSize: {
      min: 4,
      max: 12
    },
    
    highlights: {
      ar: [
        'مشاهدة أشجار دم الأخوين الأسطورية',
        'التخييم تحت سماء مرصعة بالنجوم',
        'استكشاف كهف حوق العميق',
        'السباحة في شاطئ عرهر الساحر'
      ],
      en: [
        'See legendary Dragon Blood Trees',
        'Camp under starry skies',
        'Explore deep Hoq Cave',
        'Swim at magical Arher Beach'
      ]
    },
    
    included: {
      ar: [
        'النقل من وإلى المطار',
        'جميع وجبات الطعام',
        'معدات التخييم الكاملة',
        'مرشد سياحي محترف',
        'دخول جميع المواقع'
      ],
      en: [
        'Airport transfers',
        'All meals',
        'Complete camping equipment',
        'Professional tour guide',
        'All site entrances'
      ]
    },
    
    notIncluded: {
      ar: [
        'تذاكر الطيران',
        'التأمين الشخصي',
        'المشتريات الشخصية',
        'البقشيش'
      ],
      en: [
        'Flight tickets',
        'Personal insurance',
        'Personal purchases',
        'Tips'
      ]
    }
  },
  
  {
    id: 2,
    slug: 'full-camping',
    title: {
      ar: 'تخييم كامل',
      en: 'Full Camping'
    },
    shortDesc: {
      ar: '7 أيام من التخييم الكامل في البرية',
      en: '7 days of complete wilderness camping'
    },
    description: {
      ar: 'رحلة للمغامرين الحقيقيين! تخييم كامل في أجمل المواقع النائية.',
      en: 'A trip for true adventurers! Complete camping in the most beautiful remote locations.'
    },
    price: 950,
    currency: 'USD',
    duration: {
      days: 7,
      nights: 7
    },
    rating: 4.8,
    reviewsCount: 89,
    difficulty: 'challenging',
    category: 'camping',
    featured: true,
    
    images: {
      main: '/img/tours/tour2.webp',
      gallery: [
        '/img/tours/tour2.webp',
        '/img/destinations/dragon-blood-tree.webp'
      ]
    },
    
    groupSize: {
      min: 6,
      max: 15
    },
    
    highlights: {
      ar: [
        'تخييم كامل لمدة 7 ليالي',
        'معدات احترافية عالية الجودة',
        'مرشدون متخصصون في التخييم',
        'زيارة أماكن نائية غير مطروقة'
      ],
      en: [
        'Full 7 nights camping',
        'Professional quality equipment',
        'Expert camping guides',
        'Visit remote untouched places'
      ]
    },
    
    included: {
      ar: [
        'النقل الداخلي',
        'جميع الوجبات',
        'معدات التخييم',
        'المرشدين',
        'الرسوم'
      ],
      en: [
        'Internal transport',
        'All meals',
        'Camping equipment',
        'Guides',
        'Fees'
      ]
    },
    
    notIncluded: {
      ar: [
        'التذاكر',
        'التأمين',
        'المشتريات الشخصية'
      ],
      en: [
        'Tickets',
        'Insurance',
        'Personal purchases'
      ]
    }
  },
  
  {
    id: 3,
    slug: 'mixed-camping-hotel',
    title: {
      ar: 'تخييم + فندق',
      en: 'Camping + Hotel'
    },
    shortDesc: {
      ar: 'مزيج مثالي بين راحة الفندق ومتعة التخييم',
      en: 'Perfect blend of hotel comfort and camping adventure'
    },
    description: {
      ar: 'الخيار الأمثل للعائلات! استمتع براحة الفندق ومتعة التخييم.',
      en: 'The perfect choice for families! Enjoy hotel comfort and camping fun.'
    },
    price: 1350,
    currency: 'USD',
    duration: {
      days: 7,
      nights: 6
    },
    rating: 4.9,
    reviewsCount: 156,
    difficulty: 'easy',
    category: 'mixed',
    featured: true,
    
    images: {
      main: '/img/tours/tour5.webp',
      gallery: ['/img/tours/tour5.webp']
    },
    
    groupSize: {
      min: 2,
      max: 10
    },
    
    highlights: {
      ar: [
        'ليلتان في فندق 3 نجوم',
        '4 ليالي تخييم في الطبيعة',
        'مناسب للعائلات والمبتدئين',
        'راحة وأمان مضمونان'
      ],
      en: [
        'Two nights in 3-star hotel',
        '4 nights nature camping',
        'Suitable for families',
        'Guaranteed comfort'
      ]
    },
    
    included: {
      ar: [
        'ليلتان في فندق',
        '4 ليالي تخييم',
        'جميع الوجبات',
        'النقل',
        'المرشد'
      ],
      en: [
        '2 nights hotel',
        '4 nights camping',
        'All meals',
        'Transport',
        'Guide'
      ]
    },
    
    notIncluded: {
      ar: [
        'الطيران',
        'التأمين',
        'الإضافات الشخصية'
      ],
      en: [
        'Flights',
        'Insurance',
        'Personal extras'
      ]
    }
  },
  
  {
    id: 4,
    slug: 'comprehensive-adventure',
    title: {
      ar: 'مغامرة شاملة',
      en: 'Comprehensive Adventure'
    },
    shortDesc: {
      ar: 'رحلة شاملة تغطي جميع معالم سقطرى',
      en: 'Complete tour covering all Socotra highlights'
    },
    description: {
      ar: 'الرحلة الأكثر شمولاً! اكتشف كل ما تقدمه سقطرى في 10 أيام.',
      en: 'The most comprehensive tour! Discover everything Socotra offers in 10 days.'
    },
    price: 1800,
    currency: 'USD',
    duration: {
      days: 10,
      nights: 9
    },
    rating: 5.0,
    reviewsCount: 203,
    difficulty: 'moderate',
    category: 'adventure',
    featured: true,
    
    images: {
      main: '/img/tours/tour4.webp',
      gallery: ['/img/tours/tour4.webp']
    },
    
    groupSize: {
      min: 4,
      max: 12
    },
    
    highlights: {
      ar: [
        'زيارة جميع المواقع الرئيسية',
        '10 أيام من الاستكشاف',
        'تجربة شاملة ومتكاملة',
        'أفضل قيمة مقابل المال'
      ],
      en: [
        'Visit all major sites',
        '10 days exploration',
        'Complete experience',
        'Best value'
      ]
    },
    
    included: {
      ar: [
        'كل شيء مشمول',
        'الإقامة الكاملة',
        'جميع الوجبات',
        'النقل الشامل',
        'جميع الأنشطة'
      ],
      en: [
        'Everything included',
        'Full accommodation',
        'All meals',
        'Complete transport',
        'All activities'
      ]
    },
    
    notIncluded: {
      ar: [
        'الطيران الدولي',
        'التأمين الشخصي'
      ],
      en: [
        'International flights',
        'Personal insurance'
      ]
    }
  },
  
  {
    id: 5,
    slug: 'boat-dolphins',
    title: {
      ar: 'رحلة بحرية ودلافين',
      en: 'Boat & Dolphins'
    },
    shortDesc: {
      ar: 'مغامرة بحرية مع الدلافين والشعاب المرجانية',
      en: 'Marine adventure with dolphins and coral reefs'
    },
    description: {
      ar: 'استكشف عالم البحر الساحر! شاهد الدلافين واغطس مع الشعاب المرجانية.',
      en: 'Explore the magical underwater world! Watch dolphins and snorkel with coral reefs.'
    },
    price: 800,
    currency: 'USD',
    duration: {
      days: 3,
      nights: 2
    },
    rating: 4.8,
    reviewsCount: 92,
    difficulty: 'easy',
    category: 'marine',
    featured: true,
    
    images: {
      main: '/img/tours/tour3.webp',
      gallery: ['/img/tours/tour3.webp']
    },
    
    groupSize: {
      min: 4,
      max: 8
    },
    
    highlights: {
      ar: [
        'مشاهدة الدلافين',
        'الغطس مع الشعاب المرجانية',
        'رحلة بحرية خاصة',
        'مناسب لجميع الأعمار'
      ],
      en: [
        'Dolphin watching',
        'Coral reef snorkeling',
        'Private boat trip',
        'All ages welcome'
      ]
    },
    
    included: {
      ar: [
        'القارب الخاص',
        'معدات الغطس',
        'الغداء',
        'المشروبات',
        'المرشد البحري'
      ],
      en: [
        'Private boat',
        'Snorkeling gear',
        'Lunch',
        'Drinks',
        'Marine guide'
      ]
    },
    
    notIncluded: {
      ar: [
        'الإقامة',
        'النقل من الفندق'
      ],
      en: [
        'Accommodation',
        'Hotel transfer'
      ]
    }
  },
  
  {
    id: 6,
    slug: 'family-adventure',
    title: {
      ar: 'باقة عائلية',
      en: 'Family Package'
    },
    shortDesc: {
      ar: 'رحلة مصممة خصيصاً للعائلات مع الأطفال',
      en: 'Specially designed for families with children'
    },
    description: {
      ar: 'رحلة عائلية آمنة ومريحة! أنشطة مناسبة للأطفال وذكريات جميلة.',
      en: 'Safe and comfortable family trip! Child-friendly activities and beautiful memories.'
    },
    price: 1450,
    currency: 'USD',
    duration: {
      days: 7,
      nights: 6
    },
    rating: 4.9,
    reviewsCount: 118,
    difficulty: 'easy',
    category: 'family',
    featured: true,
    
    images: {
      main: '/img/tours/tour6.webp',
      gallery: ['/img/tours/tour6.webp']
    },
    
    groupSize: {
      min: 4,
      max: 12
    },
    
    highlights: {
      ar: [
        'أنشطة مناسبة للأطفال',
        'سلامة وراحة قصوى',
        'برنامج عائلي متوازن',
        'ذكريات لا تُنسى'
      ],
      en: [
        'Child-friendly activities',
        'Maximum safety',
        'Balanced program',
        'Unforgettable memories'
      ]
    },
    
    included: {
      ar: [
        'إقامة عائلية',
        'وجبات للأطفال',
        'أنشطة ترفيهية',
        'مرشد عائلي',
        'التأمين'
      ],
      en: [
        'Family accommodation',
        'Children meals',
        'Fun activities',
        'Family guide',
        'Insurance'
      ]
    },
    
    notIncluded: {
      ar: [
        'الطيران',
        'الألعاب الشخصية'
      ],
      en: [
        'Flights',
        'Personal toys'
      ]
    }
  }
];

// ═══ الدوال المساعدة - مهمة جداً! لا تحذفها ═══

export function getTourBySlug(slug) {
  return toursData.find(tour => tour.slug === slug);
}

export function getAllTours() {
  return toursData;
}

export function getFeaturedTours() {
  return toursData.filter(tour => tour.featured);
}

export function getToursByCategory(category) {
  return toursData.filter(tour => tour.category === category);
}