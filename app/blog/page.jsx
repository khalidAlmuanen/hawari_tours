'use client'

// ═══════════════════════════════════════════════════════════════════════
// 📝 Blog Page - PART 1 (Hero + Articles Grid + Data)
// المرحلة 10: المدونة - احترافي جداً وعصري ومتكامل 100%
// ═══════════════════════════════════════════════════════════════════════

import { useState } from 'react'
import { useApp } from '@/contexts/AppContext'
import WhatsAppButton from '@/components/WhatsAppButton'

export default function BlogPage() {
  const { locale, isDark } = useApp()
  const isAr = locale === 'ar'

  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedArticle, setSelectedArticle] = useState(null)

  // ═══════════════════════════════════════════════════════════════
  // Blog Stats - إحصائيات المدونة
  // ═══════════════════════════════════════════════════════════════
  const stats = [
    {
      number: '50+',
      label: { ar: 'مقال', en: 'Articles' },
      icon: '📝',
      gradient: 'from-blue-500 to-indigo-600'
    },
    {
      number: '10+',
      label: { ar: 'كاتب', en: 'Authors' },
      icon: '✍️',
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      number: '1000+',
      label: { ar: 'قارئ', en: 'Readers' },
      icon: '👥',
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      number: '25+',
      label: { ar: 'قصة مسافر', en: 'Travel Stories' },
      icon: '✈️',
      gradient: 'from-orange-500 to-red-600'
    }
  ]

  // ═══════════════════════════════════════════════════════════════
  // Authors Data - بيانات الكتّاب
  // ═══════════════════════════════════════════════════════════════
  const authors = {
    ahmed: {
      id: 'ahmed',
      name: { ar: 'أحمد الحواري', en: 'Ahmed Al-Hawari' },
      title: { ar: 'مؤسس Hawari Tours', en: 'Founder of Hawari Tours' },
      bio: {
        ar: 'مرشد سياحي سقطري لديه 15 عام خبرة في استكشاف الجزيرة',
        en: 'Socotri tour guide with 15 years exploring the island'
      },
      avatar: '👨‍💼'
    },
    sara: {
      id: 'sara',
      name: { ar: 'سارة محمد', en: 'Sara Mohammed' },
      title: { ar: 'كاتبة سفر', en: 'Travel Writer' },
      bio: {
        ar: 'متخصصة في كتابة قصص السفر والثقافات',
        en: 'Specialized in travel stories and cultures'
      },
      avatar: '👩‍💼'
    },
    khalid: {
      id: 'khalid',
      name: { ar: 'خالد علي', en: 'Khalid Ali' },
      title: { ar: 'مصور فوتوغرافي', en: 'Photographer' },
      bio: {
        ar: 'مصور محترف متخصص في تصوير الطبيعة',
        en: 'Professional photographer specializing in nature'
      },
      avatar: '📷'
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // Blog Articles Data - مقالات المدونة
  // ═══════════════════════════════════════════════════════════════
  const articles = [
    // CULTURE ARTICLES
    {
      id: 1,
      category: 'culture',
      title: {
        ar: 'الحياة التقليدية في سقطرى: بين الماضي والحاضر',
        en: 'Traditional Life in Socotra: Between Past and Present'
      },
      excerpt: {
        ar: 'استكشف كيف حافظ سكان سقطرى على تقاليدهم وثقافتهم الفريدة عبر آلاف السنين رغم التحديات الحديثة',
        en: 'Explore how Socotris preserved their unique traditions and culture through millennia despite modern challenges'
      },
      content: {
        ar: 'محتوى المقال الكامل هنا...',
        en: 'Full article content here...'
      },
      author: 'ahmed',
      date: '2024-02-01',
      readTime: { ar: '8 دقائق', en: '8 min read' },
      views: 1250,
      comments: 24,
      likes: 156,
      featured: true,
      image: 'traditional-life.jpg',
      tags: ['culture', 'traditions', 'lifestyle'],
      gradient: 'from-amber-500 to-orange-600'
    },
    {
      id: 2,
      category: 'culture',
      title: {
        ar: 'اللغة السقطرية: لغة قديمة تقاوم الزمن',
        en: 'Soqotri Language: Ancient Tongue Resisting Time'
      },
      excerpt: {
        ar: 'تعرف على اللغة السقطرية القديمة، إحدى أقدم اللغات السامية المحكية حتى اليوم',
        en: 'Learn about ancient Soqotri language, one of oldest Semitic languages still spoken today'
      },
      author: 'sara',
      date: '2024-01-28',
      readTime: { ar: '6 دقائق', en: '6 min read' },
      views: 890,
      comments: 18,
      likes: 112,
      featured: false,
      tags: ['language', 'culture', 'heritage'],
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      id: 3,
      category: 'culture',
      title: {
        ar: 'الحرف اليدوية السقطرية: فن يروي قصة',
        en: 'Socotri Handicrafts: Art That Tells a Story'
      },
      excerpt: {
        ar: 'اكتشف الحرف التقليدية التي مارسها السقطريون لأجيال، من النسيج إلى الفخار',
        en: 'Discover traditional crafts practiced by Socotris for generations, from weaving to pottery'
      },
      author: 'khalid',
      date: '2024-01-25',
      readTime: { ar: '7 دقائق', en: '7 min read' },
      views: 720,
      comments: 15,
      likes: 98,
      featured: false,
      tags: ['handicrafts', 'art', 'traditions'],
      gradient: 'from-teal-500 to-cyan-600'
    },

    // NATURE ARTICLES
    {
      id: 4,
      category: 'nature',
      title: {
        ar: 'دم الأخوين: أسطورة الشجرة الأكثر غرابة على الأرض',
        en: 'Dragon\'s Blood: Legend of Earth\'s Most Bizarre Tree'
      },
      excerpt: {
        ar: 'رحلة علمية وثقافية حول شجرة دم الأخوين الأسطورية وأهميتها البيئية والطبية',
        en: 'Scientific and cultural journey around legendary Dragon Blood tree and its environmental and medicinal importance'
      },
      author: 'ahmed',
      date: '2024-01-20',
      readTime: { ar: '10 دقائق', en: '10 min read' },
      views: 2100,
      comments: 45,
      likes: 287,
      featured: true,
      tags: ['nature', 'trees', 'environment'],
      gradient: 'from-red-500 to-orange-600'
    },
    {
      id: 5,
      category: 'nature',
      title: {
        ar: 'الحياة البحرية في سقطرى: عالم تحت الماء لم يُكتشف بعد',
        en: 'Marine Life in Socotra: Underwater World Yet to be Discovered'
      },
      excerpt: {
        ar: 'غوص في أعماق البحار المحيطة بسقطرى واكتشف التنوع البيولوجي البحري الفريد',
        en: 'Dive into depths of seas surrounding Socotra and discover unique marine biodiversity'
      },
      author: 'sara',
      date: '2024-01-15',
      readTime: { ar: '9 دقائق', en: '9 min read' },
      views: 1540,
      comments: 32,
      likes: 198,
      featured: false,
      tags: ['marine', 'wildlife', 'diving'],
      gradient: 'from-blue-500 to-cyan-600'
    },
    {
      id: 6,
      category: 'nature',
      title: {
        ar: 'الحيوانات المتوطنة: لماذا سقطرى متحف حي؟',
        en: 'Endemic Animals: Why is Socotra a Living Museum?'
      },
      excerpt: {
        ar: 'تعرف على الحيوانات الفريدة التي لا توجد إلا في سقطرى وسبب أهميتها العلمية',
        en: 'Learn about unique animals found only in Socotra and their scientific importance'
      },
      author: 'khalid',
      date: '2024-01-10',
      readTime: { ar: '8 دقائق', en: '8 min read' },
      views: 1320,
      comments: 28,
      likes: 176,
      featured: false,
      tags: ['wildlife', 'endemic', 'conservation'],
      gradient: 'from-green-500 to-emerald-600'
    },

    // TRAVEL EXPERIENCES
    {
      id: 7,
      category: 'travel',
      title: {
        ar: 'دليل المسافر: 7 أيام في سقطرى',
        en: 'Traveler\'s Guide: 7 Days in Socotra'
      },
      excerpt: {
        ar: 'برنامج سفر مفصل لقضاء أسبوع مثالي في سقطرى مع نصائح عملية ومواقع يجب زيارتها',
        en: 'Detailed travel itinerary for perfect week in Socotra with practical tips and must-visit sites'
      },
      author: 'ahmed',
      date: '2024-01-05',
      readTime: { ar: '12 دقيقة', en: '12 min read' },
      views: 3200,
      comments: 67,
      likes: 421,
      featured: true,
      tags: ['travel', 'guide', 'itinerary'],
      gradient: 'from-indigo-500 to-purple-600'
    },
    {
      id: 8,
      category: 'travel',
      title: {
        ar: 'أفضل وقت لزيارة سقطرى: دليل شهر بشهر',
        en: 'Best Time to Visit Socotra: Month-by-Month Guide'
      },
      excerpt: {
        ar: 'تحليل مفصل للطقس والأنشطة المتاحة في كل شهر لمساعدتك في اختيار الوقت الأمثل',
        en: 'Detailed analysis of weather and available activities each month to help choose optimal time'
      },
      author: 'sara',
      date: '2023-12-28',
      readTime: { ar: '10 دقائق', en: '10 min read' },
      views: 2850,
      comments: 52,
      likes: 367,
      featured: false,
      tags: ['travel', 'planning', 'weather'],
      gradient: 'from-yellow-500 to-orange-600'
    },
    {
      id: 9,
      category: 'travel',
      title: {
        ar: 'نصائح التصوير الفوتوغرافي في سقطرى',
        en: 'Photography Tips for Socotra'
      },
      excerpt: {
        ar: 'كيف تلتقط أفضل الصور في سقطرى: نصائح من مصور محترف',
        en: 'How to capture best photos in Socotra: tips from professional photographer'
      },
      author: 'khalid',
      date: '2023-12-20',
      readTime: { ar: '7 دقائق', en: '7 min read' },
      views: 1670,
      comments: 35,
      likes: 234,
      featured: false,
      tags: ['photography', 'tips', 'travel'],
      gradient: 'from-pink-500 to-rose-600'
    },

    // TRAVELER STORIES (متطلبات PDF)
    {
      id: 10,
      category: 'stories',
      title: {
        ar: 'قصتي مع سقطرى: رحلة غيرت حياتي',
        en: 'My Socotra Story: Journey That Changed My Life'
      },
      excerpt: {
        ar: 'مسافر من ألمانيا يروي كيف غيرت سقطرى نظرته للحياة والطبيعة',
        en: 'Traveler from Germany shares how Socotra changed his perspective on life and nature'
      },
      author: 'ahmed',
      date: '2023-12-15',
      readTime: { ar: '11 دقيقة', en: '11 min read' },
      views: 2340,
      comments: 58,
      likes: 312,
      featured: true,
      tags: ['story', 'experience', 'testimonial'],
      gradient: 'from-violet-500 to-purple-600'
    },
    {
      id: 11,
      category: 'stories',
      title: {
        ar: 'شهر عسل في الجنة: تجربتنا في سقطرى',
        en: 'Honeymoon in Paradise: Our Socotra Experience'
      },
      excerpt: {
        ar: 'زوجان من فرنسا يشاركان تجربتهما الرومانسية الاستثنائية في سقطرى',
        en: 'French couple shares their exceptional romantic experience in Socotra'
      },
      author: 'sara',
      date: '2023-12-10',
      readTime: { ar: '9 دقائق', en: '9 min read' },
      views: 1890,
      comments: 42,
      likes: 267,
      featured: false,
      tags: ['honeymoon', 'romance', 'testimonial'],
      gradient: 'from-rose-500 to-pink-600'
    },
    {
      id: 12,
      category: 'stories',
      title: {
        ar: 'مغامرة عائلية لا تُنسى في سقطرى',
        en: 'Unforgettable Family Adventure in Socotra'
      },
      excerpt: {
        ar: 'عائلة أمريكية تحكي عن رحلتها المميزة مع الأطفال في سقطرى',
        en: 'American family tells about their special trip with kids in Socotra'
      },
      author: 'khalid',
      date: '2023-12-05',
      readTime: { ar: '8 دقائق', en: '8 min read' },
      views: 1560,
      comments: 38,
      likes: 201,
      featured: false,
      tags: ['family', 'kids', 'testimonial'],
      gradient: 'from-emerald-500 to-teal-600'
    }
  ]

  // Categories
  const categories = [
    { 
      id: 'all', 
      label: { ar: 'الكل', en: 'All' }, 
      icon: '📚', 
      count: articles.length,
      color: 'from-gray-500 to-slate-600'
    },
    { 
      id: 'culture', 
      label: { ar: 'ثقافة', en: 'Culture' }, 
      icon: '🏛️', 
      count: articles.filter(a => a.category === 'culture').length,
      color: 'from-amber-500 to-orange-600'
    },
    { 
      id: 'nature', 
      label: { ar: 'طبيعة', en: 'Nature' }, 
      icon: '🌿', 
      count: articles.filter(a => a.category === 'nature').length,
      color: 'from-green-500 to-emerald-600'
    },
    { 
      id: 'travel', 
      label: { ar: 'سفر', en: 'Travel' }, 
      icon: '✈️', 
      count: articles.filter(a => a.category === 'travel').length,
      color: 'from-blue-500 to-indigo-600'
    },
    { 
      id: 'stories', 
      label: { ar: 'قصص', en: 'Stories' }, 
      icon: '📖', 
      count: articles.filter(a => a.category === 'stories').length,
      color: 'from-purple-500 to-pink-600'
    }
  ]

  // Filter articles
  const filteredArticles = articles.filter(article => {
    const matchesCategory = activeCategory === 'all' || article.category === activeCategory
    const matchesSearch = searchQuery === '' || 
      article.title[locale].toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.excerpt[locale].toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  // Get featured articles
  const featuredArticles = articles.filter(a => a.featured)

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[700px] overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-transparent" />
          
          {/* Animated Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.2) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.2) 0%, transparent 50%)',
              animation: 'pulse 4s ease-in-out infinite'
            }}></div>
          </div>
        </div>

        {/* Content */}
        <div className="relative h-full flex items-center z-10">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full mb-6 animate-fade-in">
                <svg className="w-5 h-5 text-purple-300" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
                <span className="text-white font-semibold">
                  {isAr ? 'قصص، تجارب، ومعرفة عن سقطرى' : 'Stories, Experiences, and Knowledge About Socotra'}
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-slide-in-up">
                {isAr ? 'مدونة' : 'Socotra'}
                <br />
                <span className="text-gradient bg-gradient-to-r from-purple-300 via-pink-300 to-rose-300 bg-clip-text text-transparent">
                  {isAr ? 'سقطرى' : 'Blog'}
                </span>
              </h1>

              <p className="text-xl md:text-2xl text-white/90 mb-8 animate-slide-in-up" style={{animationDelay: '0.1s'}}>
                {isAr
                  ? 'اكتشف قصص المسافرين، دلائل السفر، والمعلومات الثقافية والطبيعية'
                  : 'Discover traveler stories, travel guides, and cultural & natural insights'}
              </p>

              <div className="flex gap-4 animate-fade-in" style={{animationDelay: '0.2s'}}>
                <a href="#articles" className="btn btn-primary px-8 py-4 text-lg">
                  {isAr ? 'تصفح المقالات' : 'Browse Articles'}
                </a>
                <a href="#stories" className="btn btn-outline border-white text-white hover:bg-white hover:text-purple-600 px-8 py-4 text-lg">
                  {isAr ? 'قصص المسافرين' : 'Travel Stories'}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce z-20">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800 -mt-20 relative z-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`bg-gradient-to-br ${stat.gradient} p-6 rounded-2xl shadow-xl text-center transform hover:scale-105 transition-all animate-fade-in text-white`}
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="text-5xl mb-3">{stat.icon}</div>
                <div className="text-4xl font-bold mb-2">{stat.number}</div>
                <div className="text-sm opacity-90">{stat.label[locale]}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          Search & Category Filters Section
          ═══════════════════════════════════════════════════════════════ */}
      <section id="articles" className="py-8 bg-white dark:bg-gray-800 sticky top-0 z-40 border-b border-gray-200 dark:border-gray-700 shadow-md">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-2xl mx-auto">
              <input
                type="text"
                placeholder={isAr ? 'ابحث في المقالات...' : 'Search articles...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 pr-12 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none text-lg"
              />
              <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Category Filters */}
          <div className="flex overflow-x-auto gap-4 pb-2">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all ${
                  activeCategory === cat.id
                    ? `bg-gradient-to-r ${cat.color} text-white shadow-lg scale-105`
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                <span className="text-xl">{cat.icon}</span>
                <span>{cat.label[locale]}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                  activeCategory === cat.id
                    ? 'bg-white/20'
                    : 'bg-gray-200 dark:bg-gray-600'
                }`}>
                  {cat.count}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          Featured Articles Carousel
          ═══════════════════════════════════════════════════════════════ */}
      {activeCategory === 'all' && searchQuery === '' && (
        <section className="py-16 bg-gray-50 dark:bg-gray-900">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {isAr ? 'المقالات' : 'Featured'}{' '}
                <span className="text-gradient bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {isAr ? 'المميزة' : 'Articles'}
                </span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {featuredArticles.slice(0, 2).map((article, index) => (
                <div
                  key={article.id}
                  className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 cursor-pointer animate-fade-in"
                  style={{animationDelay: `${index * 0.1}s`}}
                >
                  {/* Image/Gradient Placeholder */}
                  <div className={`relative h-64 bg-gradient-to-br ${article.gradient}`}>
                    <div className="absolute inset-0 flex items-center justify-center text-white/30 text-6xl">
                      📰
                    </div>
                    
                    {/* Featured Badge */}
                    <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {isAr ? 'مميز' : 'Featured'}
                    </div>

                    {/* Category Badge */}
                    <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md text-white px-3 py-1 rounded-full text-sm font-semibold">
                      {categories.find(c => c.id === article.category)?.icon} {categories.find(c => c.id === article.category)?.label[locale]}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-8">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
                      {article.title[locale]}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                      {article.excerpt[locale]}
                    </p>

                    {/* Author & Meta */}
                    <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-500 mb-4">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{authors[article.author].avatar}</span>
                        <div>
                          <div className="font-semibold text-gray-700 dark:text-gray-300">
                            {authors[article.author].name[locale]}
                          </div>
                          <div>{article.readTime[locale]}</div>
                        </div>
                      </div>

                      <div className="text-gray-400">
                        {new Date(article.date).toLocaleDateString(locale)}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-500 border-t border-gray-200 dark:border-gray-700 pt-4">
                      <span className="flex items-center gap-1">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                        {article.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                        </svg>
                        {article.comments}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                        {article.likes}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════════════════════════════════════════════════════════════
          All Articles Grid
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Section Title */}
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {activeCategory === 'all' 
                ? (isAr ? 'جميع المقالات' : 'All Articles')
                : categories.find(c => c.id === activeCategory)?.label[locale]}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {isAr 
                ? `${filteredArticles.length} مقال`
                : `${filteredArticles.length} Articles`}
            </p>
          </div>

          {/* Articles Grid */}
          {filteredArticles.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredArticles.map((article, index) => (
                <div
                  key={article.id}
                  className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 cursor-pointer animate-fade-in"
                  style={{animationDelay: `${index * 0.05}s`}}
                >
                  {/* Image/Gradient Placeholder */}
                  <div className={`relative h-48 bg-gradient-to-br ${article.gradient || 'from-gray-400 to-gray-600'}`}>
                    <div className="absolute inset-0 flex items-center justify-center text-white/30 text-5xl">
                      {categories.find(c => c.id === article.category)?.icon}
                    </div>

                    {/* Featured Badge */}
                    {article.featured && (
                      <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                        <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {isAr ? 'مميز' : 'Featured'}
                      </div>
                    )}

                    {/* Category Badge */}
                    <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-md text-white px-2 py-1 rounded-full text-xs font-semibold">
                      {categories.find(c => c.id === article.category)?.icon}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors line-clamp-2">
                      {article.title[locale]}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm line-clamp-3 leading-relaxed">
                      {article.excerpt[locale]}
                    </p>

                    {/* Author & Meta */}
                    <div className="flex items-center gap-2 mb-4 text-xs text-gray-500 dark:text-gray-500">
                      <span className="text-xl">{authors[article.author].avatar}</span>
                      <div>
                        <div className="font-semibold text-gray-700 dark:text-gray-300">
                          {authors[article.author].name[locale]}
                        </div>
                        <div>{article.readTime[locale]}</div>
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-500 border-t border-gray-200 dark:border-gray-700 pt-3">
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                          <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                        </svg>
                        {article.views}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                        </svg>
                        {article.comments}
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                        {article.likes}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            // No Results
            <div className="text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {isAr ? 'لا توجد نتائج' : 'No Results Found'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {isAr ? 'جرب البحث بكلمات مختلفة' : 'Try searching with different keywords'}
              </p>
            </div>
          )}

          {/* Load More Button */}
          {filteredArticles.length > 9 && (
            <div className="text-center mt-12">
              <button className="btn btn-outline px-8 py-4 text-lg">
                {isAr ? 'تحميل المزيد' : 'Load More'}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          Meet Our Authors Section
          ═══════════════════════════════════════════════════════════════ */}
      <section id="authors" className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Section Title */}
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 rounded-full text-sm font-semibold mb-4">
              ✍️ {isAr ? 'تعرف على كتّابنا' : 'Meet Our Authors'}
            </div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {isAr ? 'فريق' : 'Our'}{' '}
              <span className="text-gradient bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                {isAr ? 'الكتّاب' : 'Writers'}
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {isAr ? 'خبراء ومتخصصون يشاركونكم معرفتهم وتجاربهم' : 'Experts and specialists sharing knowledge and experiences'}
            </p>
          </div>

          {/* Authors Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {Object.values(authors).map((author, index) => (
              <div
                key={author.id}
                className="bg-white dark:bg-gray-900 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 text-center animate-fade-in"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="text-7xl mb-4">{author.avatar}</div>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {author.name[locale]}
                </h3>

                <p className="text-purple-600 dark:text-purple-400 font-semibold mb-4 text-sm">
                  {author.title[locale]}
                </p>

                <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed">
                  {author.bio[locale]}
                </p>

                {/* Author Stats */}
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {articles.filter(a => a.author === author.id).length}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-500">
                      {isAr ? 'مقال' : 'Articles'}
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900 dark:text-white">
                      {Math.floor(articles.filter(a => a.author === author.id).reduce((sum, a) => sum + a.views, 0) / 1000)}K
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-500">
                      {isAr ? 'قراءة' : 'Views'}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          Popular Tags Section
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {isAr ? 'الوسوم الشائعة' : 'Popular Tags'}
            </h3>
          </div>

          {/* Tags Cloud */}
          <div className="flex flex-wrap gap-3 justify-center">
            {Array.from(new Set(articles.flatMap(a => a.tags))).slice(0, 20).map((tag, i) => (
              <button
                key={i}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-800 hover:bg-purple-100 dark:hover:bg-purple-900/30 hover:text-purple-600 dark:hover:text-purple-400 text-gray-700 dark:text-gray-300 rounded-full text-sm font-semibold transition-all transform hover:scale-105"
              >
                #{tag}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          Newsletter Signup Section
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 md:p-12 border-2 border-purple-200 dark:border-purple-800">
            <div className="text-center">
              <div className="text-6xl mb-6">📬</div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
                {isAr ? 'اشترك في نشرتنا البريدية' : 'Subscribe to Our Newsletter'}
              </h2>

              <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                {isAr
                  ? 'احصل على آخر المقالات، نصائح السفر، والعروض الحصرية مباشرة في بريدك الإلكتروني'
                  : 'Get latest articles, travel tips, and exclusive offers directly in your inbox'}
              </p>

              {/* Newsletter Form */}
              <form className="max-w-md mx-auto mb-6">
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder={isAr ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                    className="flex-1 px-6 py-4 rounded-xl border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:border-purple-500 focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="px-8 py-4 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
                  >
                    {isAr ? 'اشترك' : 'Subscribe'}
                  </button>
                </div>
              </form>

              <p className="text-sm text-gray-500 dark:text-gray-500">
                {isAr ? '✅ نرسل مقالاً واحداً أسبوعياً • لا بريد مزعج • يمكنك إلغاء الاشتراك في أي وقت' : '✅ One article weekly • No spam • Unsubscribe anytime'}
              </p>

              {/* Benefits */}
              <div className="grid md:grid-cols-3 gap-6 mt-8">
                {[
                  { icon: '📝', title: { ar: 'مقالات حصرية', en: 'Exclusive Articles' } },
                  { icon: '🎁', title: { ar: 'عروض خاصة', en: 'Special Offers' } },
                  { icon: '💡', title: { ar: 'نصائح سفر', en: 'Travel Tips' } }
                ].map((benefit, i) => (
                  <div key={i} className="text-center">
                    <div className="text-3xl mb-2">{benefit.icon}</div>
                    <div className="font-semibold text-gray-700 dark:text-gray-300 text-sm">
                      {benefit.title[locale]}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          Traveler Stories Highlight Section (متطلبات PDF)
          ═══════════════════════════════════════════════════════════════ */}
      <section id="stories" className="py-20 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4 max-w-7xl">
          {/* Section Title */}
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-semibold mb-4">
              ✈️ {isAr ? 'قصص المسافرين' : 'Traveler Stories'}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {isAr ? 'تجارب' : 'Real'}{' '}
              <span className="text-gradient bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                {isAr ? 'حقيقية' : 'Experiences'}
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {isAr ? 'اقرأ قصص المسافرين الذين زاروا سقطرى' : 'Read stories from travelers who visited Socotra'}
            </p>
          </div>

          {/* Stories Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {articles.filter(a => a.category === 'stories').map((story, index) => (
              <div
                key={story.id}
                className="bg-gradient-to-br from-white to-green-50 dark:from-gray-800 dark:to-green-900/20 rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 border-2 border-green-200 dark:border-green-800 cursor-pointer animate-fade-in"
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="text-5xl mb-4">💬</div>
                
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                  {story.title[locale]}
                </h3>

                <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm line-clamp-3">
                  {story.excerpt[locale]}
                </p>

                {/* Author */}
                <div className="flex items-center gap-3 mb-4 pb-4 border-b border-green-200 dark:border-green-800">
                  <span className="text-2xl">{authors[story.author].avatar}</span>
                  <div className="text-sm">
                    <div className="font-semibold text-gray-700 dark:text-gray-300">
                      {authors[story.author].name[locale]}
                    </div>
                    <div className="text-gray-500 dark:text-gray-500">{story.readTime[locale]}</div>
                  </div>
                </div>

                {/* Read More */}
                <button className="text-green-600 dark:text-green-400 font-semibold text-sm flex items-center gap-2 group">
                  <span>{isAr ? 'اقرأ القصة كاملة' : 'Read Full Story'}</span>
                  <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* View All Stories Button */}
          <div className="text-center mt-12">
            <button
              onClick={() => setActiveCategory('stories')}
              className="btn btn-outline border-green-500 text-green-600 dark:text-green-400 hover:bg-green-500 hover:text-white px-8 py-4 text-lg"
            >
              {isAr ? 'شاهد جميع القصص' : 'View All Stories'}
            </button>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          Write for Us Section (إضافة احترافية)
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gray-50 dark:bg-gray-800">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-8 md:p-12 border-2 border-blue-300 dark:border-blue-700">
            <div className="text-center">
              <div className="text-6xl mb-6">✍️</div>
              
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                {isAr ? 'هل لديك قصة تريد مشاركتها؟' : 'Have a Story to Share?'}
              </h2>

              <p className="text-lg text-gray-700 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                {isAr
                  ? 'نحن نبحث دائماً عن قصص وتجارب جديدة من مسافرين زاروا سقطرى. شارك تجربتك مع مجتمعنا!'
                  : 'We\'re always looking for new stories and experiences from travelers who visited Socotra. Share your experience with our community!'}
              </p>

              <div className="grid md:grid-cols-3 gap-6 mb-8">
                {[
                  { icon: '📸', title: { ar: 'شارك صورك', en: 'Share Photos' } },
                  { icon: '📝', title: { ar: 'اكتب قصتك', en: 'Write Story' } },
                  { icon: '🌟', title: { ar: 'ألهم الآخرين', en: 'Inspire Others' } }
                ].map((item, i) => (
                  <div key={i} className="bg-white dark:bg-gray-800 p-4 rounded-xl">
                    <div className="text-3xl mb-2">{item.icon}</div>
                    <div className="font-semibold text-gray-900 dark:text-white text-sm">
                      {item.title[locale]}
                    </div>
                  </div>
                ))}
              </div>

              <a
                href="/contact"
                className="inline-block bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
              >
                {isAr ? 'ابدأ الكتابة' : 'Start Writing'}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          CTA Section
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gradient-to-r from-purple-600 via-pink-600 to-rose-600 text-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {isAr ? 'ألهمتك المقالات؟ احجز رحلتك الآن!' : 'Inspired by the Articles? Book Your Trip Now!'}
          </h2>

          <p className="text-xl mb-12 opacity-90">
            {isAr
              ? 'اجعل قصتك التالية في سقطرى - تواصل معنا لتخطيط رحلة أحلامك'
              : 'Make your next story in Socotra - contact us to plan your dream trip'}
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="/tours"
              className="btn text-lg px-8 py-4 bg-white text-purple-600 hover:bg-gray-100 transform hover:scale-105 transition-all shadow-2xl"
            >
              {isAr ? 'تصفح الرحلات' : 'Browse Tours'}
            </a>

            <a
              href="/contact"
              className="btn text-lg px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-purple-600 transform hover:scale-105 transition-all"
            >
              {isAr ? 'تواصل معنا' : 'Contact Us'}
            </a>

            <a
              href="https://wa.me/967772371581"
              target="_blank"
              rel="noopener noreferrer"
              className="btn text-lg px-8 py-4 bg-green-500 text-white hover:bg-green-600 transform hover:scale-105 transition-all shadow-2xl flex items-center gap-2"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              {isAr ? 'واتساب' : 'WhatsApp'}
            </a>
          </div>
        </div>
      </section>

      <WhatsAppButton />
    </div>
  )
}