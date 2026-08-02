'use client'

// ═══════════════════════════════════════════════════════════════
// 🌍 PUBLIC BLOG PAGE - Ultra Professional
// المدونة العامة - تصميم احترافي
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react'
import { useApp } from '@/contexts/AppContext'
import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

export default function BlogPage() {
  const { locale } = useApp()
  const isAr = locale === 'ar'

  // State
  const [blogs, setBlogs] = useState([])
  const [filteredBlogs, setFilteredBlogs] = useState([])
  const [settings, setSettings] = useState(null)
  const [loading, setLoading] = useState(true)
  const defaultHero = '/images/socotra-hero.jpg'
  const [heroImageSrc, setHeroImageSrc] = useState(defaultHero)
  const heroFallback = 'https://images.unsplash.com/photo-1542224566-6e85f2e6772f?q=80&w=2888&auto=format&fit=crop'

  // Filters
  const [activeCategory, setActiveCategory] = useState('ALL')
  const [searchQuery, setSearchQuery] = useState('')

  // ═══════════════════════════════════════════════════════════════
  // Fetch Data
  // ═══════════════════════════════════════════════════════════════
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [blogsRes, settingsRes] = await Promise.all([
          fetch('/api/blog'),
          fetch('/api/admin/blog/settings')
        ])

        const bData = await blogsRes.json()
        const sData = await settingsRes.json()

        if (bData.success) {
          setBlogs(bData.data)
          setFilteredBlogs(bData.data)
        }
        if (sData.success) setSettings(sData.data)

      } catch (error) {
        console.error('Error loading blog data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (!settings) {
      setHeroImageSrc(defaultHero)
      return
    }
    const image = settings.heroImage?.trim()
    setHeroImageSrc(image ? image : '')
  }, [settings, defaultHero])

  // ═══════════════════════════════════════════════════════════════
  // Filtering Logic
  // ═══════════════════════════════════════════════════════════════
  useEffect(() => {
    let result = blogs

    if (activeCategory !== 'ALL') {
      result = result.filter(b => b.category === activeCategory)
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(b =>
        (b.titleEn?.toLowerCase().includes(q)) ||
        (b.titleAr?.includes(q)) ||
        (b.excerptEn?.toLowerCase().includes(q)) ||
        (b.excerptAr?.includes(q))
      )
    }

    setFilteredBlogs(result)
  }, [activeCategory, searchQuery, blogs])

  // Categories Configuration
  const categories = [
    { id: 'ALL', label: isAr ? 'الكل' : 'All', icon: '🔍' },
    { id: 'CULTURE', label: isAr ? 'ثقافة' : 'Culture', icon: '🏛️' },
    { id: 'NATURE', label: isAr ? 'طبيعة' : 'Nature', icon: '🌿' },
    { id: 'TRAVEL', label: isAr ? 'سفر' : 'Travel', icon: '✈️' },
    { id: 'STORIES', label: isAr ? 'قصص' : 'Stories', icon: '📖' }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 pb-20">

      {/* ═══════════════════════════════════════════════════════════════
                HERO SECTION
            ═══════════════════════════════════════════════════════════════ */}
      <section className="relative h-[60vh] min-h-[500px] flex items-center justify-center overflow-hidden">
        {/* Background Image / Gradient */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-gray-900 to-black" />
          {heroImageSrc && (
            <Image
              src={heroImageSrc}
              alt="Socotra"
              fill
              className="object-cover"
              sizes="100vw"
              unoptimized
              onError={() => setHeroImageSrc(heroFallback)}
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900 via-gray-900 to-black z-10 opacity-70" />
        </div>

        {/* Content */}
        <div className="relative z-20 text-center max-w-4xl px-4 animate-fade-in-up">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-blue-300 font-bold mb-6 text-sm tracking-widest uppercase">
            {isAr ? 'مدونة حواري للسياحة' : 'Hawari Tours Blog'}
          </span>
          <h1 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight">
            {isAr
              ? (settings?.heroTitleAr || 'اكتشف سحر سقطرى')
              : (settings?.heroTitleEn || 'Discover the Magic of Socotra')}
          </h1>
          <p className="text-lg md:text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed">
            {isAr
              ? (settings?.heroSubtitleAr || 'قصص ملهمة، أدلة سفر، ومعلومات ثقافية من قلب الجزيرة')
              : (settings?.heroSubtitleEn || 'Inspiring stories, travel guides, and cultural insights from the heart of the island')}
          </p>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
                SEARCH & FILTERS
            ═══════════════════════════════════════════════════════════════ */}
      <div className="sticky top-20 z-40 -mt-8 mb-12 px-4 pointer-events-none">
        <div className="max-w-5xl mx-auto bg-white dark:bg-gray-900 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-800 p-4 flex flex-col md:flex-row gap-4 pointer-events-auto">
          {/* Search */}
          <div className="flex-1 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={isAr ? 'ابحث عن مقال...' : 'Search for articles...'}
              className="w-full h-12 pl-12 pr-4 rounded-xl bg-gray-50 dark:bg-gray-800 border-transparent focus:bg-white dark:focus:bg-gray-700 outline-none transition-all text-gray-900 dark:text-white"
            />
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl">🔍</span>
          </div>

          {/* Categories */}
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {categories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-2 ${activeCategory === cat.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/20'
                  : 'bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
                STATS SECTION (Dynamic)
            ═══════════════════════════════════════════════════════════════ */}
      {settings?.stats && settings.stats.length > 0 && (
        <div className="container mx-auto px-4 -mt-16 mb-20 relative z-30">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl border border-gray-100 dark:border-gray-700 p-8 grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {settings.stats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-4xl mb-2 transform group-hover:scale-110 transition-transform duration-300">{stat.icon}</div>
                <div className="text-3xl font-black text-gray-900 dark:text-white mb-1 counter-value">
                  {stat.value}
                </div>
                <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">
                  {isAr ? stat.labelAr : stat.labelEn}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════
                BLOG GRID
            ═══════════════════════════════════════════════════════════════ */}
      <div className="container mx-auto px-6 max-w-7xl">
        {loading ? (
          <div className="grid md:grid-cols-3 gap-8">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white dark:bg-gray-900 rounded-3xl h-96 animate-pulse" />
            ))}
          </div>
        ) : filteredBlogs.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBlogs.map((blog, i) => (
              <Link href={`/blog/${blog.slug}`} key={blog.id}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="group bg-white dark:bg-gray-900 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 dark:border-gray-800 h-full flex flex-col"
                >
                  {/* Image Wrapper */}
                  <div className="relative h-60 overflow-hidden">
                    {blog.coverImage ? (
                      <Image
                        src={blog.coverImage}
                        alt={isAr ? blog.titleAr : blog.titleEn}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                        sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                        unoptimized
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-6xl">
                        📝
                      </div>
                    )}

                    {/* Category Badge */}
                    <div className="absolute top-4 left-4">
                      <span className="bg-white/90 dark:bg-black/80 backdrop-blur-md text-gray-900 dark:text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider shadow-sm">
                        {blog.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    {/* Meta */}
                    <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-gray-400 mb-3">
                      <span>📅 {new Date(blog.createdAt).toLocaleDateString()}</span>
                      {blog.readTime && <span>• ⏱️ {blog.readTime} min</span>}
                    </div>

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {isAr ? blog.titleAr : blog.titleEn}
                    </h3>

                    {/* Excerpt */}
                    <p className="text-gray-600 dark:text-gray-400 line-clamp-3 mb-6 flex-1">
                      {isAr ? blog.excerptAr : blog.excerptEn}
                    </p>

                    {/* Footer */}
                    <div className="pt-6 border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                      {blog.author ? (
                        <div className="flex items-center gap-2">
                          <div className="relative w-8 h-8 rounded-full overflow-hidden">
                            <Image
                              src={blog.author.avatar || '/placeholder-user.jpg'}
                              alt={isAr ? blog.author.nameAr : blog.author.nameEn}
                              fill
                              className="object-cover"
                              sizes="32px"
                              unoptimized
                            />
                          </div>
                          <span className="text-sm font-bold text-gray-700 dark:text-gray-300">
                            {isAr ? blog.author.nameAr : blog.author.nameEn}
                          </span>
                        </div>
                      ) : (
                        <span className="text-sm font-bold text-gray-500">Hawari Team</span>
                      )}

                      <span className="text-blue-600 dark:text-blue-400 font-bold text-sm flex items-center gap-1 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 transition-transform">
                        {isAr ? 'اقرأ المزيد' : 'Read More'} {isAr ? '←' : '→'}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {isAr ? 'لم يتم العثور على مقالات' : 'No articles found'}
            </h3>
            <p className="text-gray-500 dark:text-gray-400">
              {isAr ? 'حاول تغيير كلمات البحث أو التصنيف' : 'Try adjusting your search or filters'}
            </p>
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════════════════════════
                WRITE FOR US & NEWSLETTER
            ═══════════════════════════════════════════════════════════════ */}
      <div className="container mx-auto px-4 mt-20 max-w-6xl space-y-12">

        {/* Write For Us */}
        <div className="bg-gradient-to-r from-gray-900 to-black text-white rounded-3xl p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center gap-8 border border-gray-800">
          <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl -mr-32 -mt-32 pointer-events-none" />

          <div className="flex-1 relative z-10 text-center md:text-left rtl:md:text-right">
            <div className="text-sm font-bold text-purple-400 uppercase tracking-widest mb-2">
              {isAr ? 'شارك قصتك' : 'Share Your Story'}
            </div>
            <h3 className="text-3xl font-black mb-4">
              {isAr
                ? (settings?.writeTitleAr || 'هل لديك تجربة في سقطرى؟')
                : (settings?.writeTitleEn || 'Have a Socotra Experience?')}
            </h3>
            <p className="text-gray-400 text-lg leading-relaxed">
              {isAr
                ? (settings?.writeTextAr || 'شارك قصتك وصورك مع العالم. نحن نبحث دائماً عن مقالات جديدة.')
                : (settings?.writeTextEn || 'Share your story and photos with the world. We are always looking for new guest posts.')}
            </p>
          </div>
          <div className="relative z-10">
            <Link href="/contact" className="bg-white text-black px-8 py-4 rounded-xl font-bold hover:bg-gray-200 transition-colors shadow-lg shadow-white/10 inline-block">
              {isAr ? 'بدء الكتابة' : 'Start Writing'}
            </Link>
          </div>
        </div>

        {/* Newsletter */}
        <div className="bg-blue-600 rounded-3xl p-8 md:p-12 relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-8 shadow-2xl shadow-blue-900/20">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none" />

          <div className="text-white relative z-10 text-center md:text-left rtl:md:text-right">
            <h3 className="text-2xl md:text-3xl font-bold mb-2">
              {isAr
                ? (settings?.newsletterTitleAr || 'اشترك في نشرتنا البريدية')
                : (settings?.newsletterTitleEn || 'Subscribe to our Newsletter')}
            </h3>
            <p className="text-blue-100">
              {isAr
                ? (settings?.newsletterTextAr || 'احصل على آخر التحديثات والعروض.')
                : (settings?.newsletterTextEn || 'Get the latest updates and offers directly.')}
            </p>
          </div>

          <div className="w-full md:w-auto flex gap-2 relative z-10">
            <input
              type="email"
              placeholder="Email Address"
              className="px-6 py-3 rounded-xl outline-none text-gray-900 w-full md:w-80 shadow-inner"
            />
            <button className="bg-gray-900 text-white px-6 py-3 rounded-xl font-bold hover:bg-black transition-colors shadow-lg">
              {isAr ? 'اشتراك' : 'Join'}
            </button>
          </div>
        </div>
      </div>

    </div>
  )
}
