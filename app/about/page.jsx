'use client'

// ═══════════════════════════════════════════════════════════════════════
// 📄 About Page - Socotra Paradise (Dynamic & Premium)
// ✅ Fully Dynamic from Database
// ✅ Premium UI/UX with Framer Motion
// ═══════════════════════════════════════════════════════════════════════

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useApp } from '@/contexts/AppContext'
import { motion } from 'framer-motion'
import { FaMapMarkedAlt, FaLeaf, FaHistory, FaTheaterMasks } from 'react-icons/fa'

export default function AboutPage() {
  const { locale } = useApp()
  const [activeTab, setActiveTab] = useState('geography')
  const [scrollProgress, setScrollProgress] = useState(0)
  const isAr = locale === 'ar'

  // Database state
  const [loading, setLoading] = useState(true)
  const [dbData, setDbData] = useState({ sections: [], species: [], cultural: [], settings: {} })

  // Fetch data from database
  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/api/about', { cache: 'no-store' })
        const result = await response.json()
        if (result.success) {
          setDbData(result.data)
        }
      } catch (error) {
        console.error('Error fetching about data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Track scroll progress
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (window.scrollY / totalHeight) * 100
      setScrollProgress(progress)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Helper to get sections by type
  const getSectionsByType = (type) => {
    return dbData.sections?.filter(s => s.type === type) || []
  }

  const geographySections = getSectionsByType('GEOGRAPHY')
  const natureSections = getSectionsByType('NATURE')
  const culturalSections = getSectionsByType('CULTURE')
  const historySections = getSectionsByType('HISTORY')

  // Fallback Data (Only used if DB is empty)
  const hasDbData = dbData.sections.length > 0
  const showFallback = !loading && !hasDbData

  const statsData = (dbData.settings?.stats && dbData.settings.stats.length > 0 ? dbData.settings.stats : [
    { labelEn: 'Endemic Species', labelAr: 'أنواع مستوطنة', value: '700+' },
    { labelEn: 'Archipelago Area', labelAr: 'مساحة الأرخبيل', value: '3,796 كم²' },
    { labelEn: 'UNESCO Listed', labelAr: 'مدرج في اليونسكو', value: '2008' },
    { labelEn: 'Population', labelAr: 'عدد السكان', value: '60K+' },
  ])

  const statsIcons = ['🌿', '🗺️', '🏛️', '👥']

  const tabs = [
    { id: 'geography', label: { ar: 'الجغرافيا', en: 'Geography' }, icon: FaMapMarkedAlt, sections: geographySections },
    { id: 'nature', label: { ar: 'الطبيعة', en: 'Nature' }, icon: FaLeaf, sections: natureSections },
    { id: 'history', label: { ar: 'التاريخ', en: 'History' }, icon: FaHistory, sections: historySections },
  ]
  const activeTabData = tabs.find(tab => tab.id === activeTab) || tabs[0]
  const activeSections = activeTabData.sections

  const geographyFacts = [
    {
      icon: <FaMapMarkedAlt className="w-8 h-8" />,
      title: { ar: 'الموقع', en: 'Location' },
      value: { ar: 'المحيط الهندي', en: 'Indian Ocean' },
      description: { ar: '350 كم جنوب اليمن', en: '350 km south of Yemen' }
    },
    {
      icon: <FaLeaf className="w-8 h-8" />,
      title: { ar: 'المساحة', en: 'Area' },
      value: { ar: '3,796 كم²', en: '3,796 km²' },
      description: { ar: 'أكبر من لوكسمبورغ', en: 'Larger than Luxembourg' }
    }
  ]

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 overflow-hidden">
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 right-0 h-1 bg-gray-200 dark:bg-gray-800 z-50">
        <motion.div
          className="h-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          Hero Section - Cinematic
          ═══════════════════════════════════════════════════════════════ */}

      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <motion.div
          className="absolute inset-0"
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 12, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
        >
          <Image
            src={dbData.settings?.heroImage || "/img/about/socotra-nature.jpg"}
            alt="Socotra Island"
            fill
            className="object-cover"
            priority
            quality={90}
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/90" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(34,197,94,0.35),_transparent_60%)]" />
        <motion.div
          className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-emerald-500/20 blur-3xl"
          animate={{ x: [0, 30, 0], y: [0, 20, 0], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-40 -right-40 w-[28rem] h-[28rem] rounded-full bg-teal-400/20 blur-3xl"
          animate={{ x: [0, -20, 0], y: [0, -30, 0], opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-2 rounded-full mb-6 border border-white/20 shadow-lg shadow-black/30">
              <span className="text-green-300 font-bold tracking-widest">UNESCO</span>
              <span className="text-white font-medium">
                {isAr ? 'موقع تراث عالمي' : 'World Heritage Site'}
              </span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black text-white mb-6 tracking-tight leading-tight drop-shadow-[0_20px_60px_rgba(0,0,0,0.45)]">
              {isAr ? (dbData.settings?.heroTitleAr || 'جوهرة العرب') : (dbData.settings?.heroTitle || 'The Jewel of Arabia')}
            </h1>

            <p className="text-xl md:text-2xl text-gray-200 max-w-3xl mx-auto mb-10 leading-relaxed font-light">
              {isAr
                ? (dbData.settings?.heroSubtitleAr || 'جنة منعزلة حيث تلتقي الطبيعة الخيالية بالثقافة الأصيلة في تجربة لا تُنسى')
                : (dbData.settings?.heroSubtitle || 'An isolated paradise where fantastical nature meets authentic culture in an unforgettable experience')}
            </p>

            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/tours"
                className="px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-400 hover:to-emerald-500 text-white rounded-full font-bold text-lg transition-all transform hover:scale-105 shadow-2xl shadow-green-600/30"
              >
                {isAr ? 'اكتشف رحلاتنا' : 'Explore Tours'}
              </Link>
              <button
                onClick={() => document.getElementById('introduction').scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-white/10 hover:bg-white/20 backdrop-blur-md text-white border border-white/30 rounded-full font-bold text-lg transition-all shadow-lg shadow-black/30"
              >
                {isAr ? 'اقرأ المزيد' : 'Read More'}
              </button>
            </div>

            <div className="mt-10 flex flex-wrap justify-center gap-3">
              {statsData.slice(0, 3).map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 + i * 0.1 }}
                  className="px-5 py-3 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl text-white min-w-[150px]"
                >
                  <div className="text-xl font-black">{stat.value}</div>
                  <div className="text-xs uppercase tracking-wider text-white/70">
                    {isAr ? stat.labelAr : stat.labelEn}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          Content Sections (Dynamic)
          ═══════════════════════════════════════════════════════════════ */}

      {/* 1. Introduction & History (Dynamic from Settings) */}
      <section id="introduction" className="py-24 bg-white dark:bg-gray-900 relative">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className={`space-y-8 ${isAr ? 'lg:order-2' : ''}`}
            >
              <div>
                <h4 className="text-green-600 dark:text-green-400 font-bold uppercase tracking-wider mb-2">
                  {isAr ? 'نبذة عنا' : 'Introduction'}
                </h4>
                <h2 className="text-4xl md:text-5xl font-black text-gray-900 dark:text-white leading-tight">
                  {isAr
                    ? (dbData.settings?.introTitleAr || 'أكثر من مجرد جزيرة')
                    : (dbData.settings?.introTitle || 'More Than Just an Island')}
                </h2>
              </div>

              <div className="prose dark:prose-invert lg:prose-lg text-gray-600 dark:text-gray-300">
                <p className="whitespace-pre-line">
                  {isAr
                    ? (dbData.settings?.introContentAr || 'سقطرى هي أرخبيل يمني يقع في المحيط الهندي...')
                    : (dbData.settings?.introContent || 'Socotra is a Yemeni archipelago in the Indian Ocean...')}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className={`relative h-[600px] rounded-3xl overflow-hidden shadow-2xl ${isAr ? 'lg:order-1' : ''}`}
            >
              <Image
                src={dbData.settings?.introImage || "/img/about/history-socotra.jpg"}
                alt={isAr ? 'تاريخ سقطرى' : 'History of Socotra'}
                fill
                className="object-cover hover:scale-105 transition-transform duration-700"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* 2. Geography & Nature */}
      <section className="py-24 bg-gray-50 dark:bg-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-6">
              {isAr ? 'الجغرافيا والطبيعة' : 'Geography & Nature'}
            </h2>
            <p className="text-xl text-gray-500 dark:text-gray-400">
              {isAr ? 'مناظر طبيعية خلابة وتنوع بيئي لا مثيل له' : 'Breathtaking landscapes and unparalleled biodiversity'}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-5 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 border ${isActive
                    ? 'bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-gray-900'
                    : 'bg-white/70 dark:bg-gray-900/70 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:bg-white'
                    }`}
                >
                  <Icon className="w-4 h-4" />
                  {isAr ? tab.label.ar : tab.label.en}
                </button>
              )
            })}
          </div>

          {activeSections.length > 0 ? (
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {activeSections.map((section, idx) => {
                const Icon = activeTabData.icon
                return (
                  <motion.div
                    key={section.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    whileHover={{ y: -6 }}
                    className="group bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700 hover:shadow-2xl transition-all"
                  >
                    {section.imageUrl && (
                      <div className="relative h-48 rounded-2xl overflow-hidden mb-6">
                        <Image
                          src={section.imageUrl}
                          alt={isAr ? section.titleAr : section.titleEn}
                          fill
                          className="object-cover transition-transform duration-700 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                      </div>
                    )}
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center shrink-0 text-blue-600">
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">
                          {isAr ? section.titleAr : section.titleEn}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                          {isAr ? section.contentAr : section.contentEn}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          ) : activeTab === 'geography' ? (
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {geographyFacts.map((fact, idx) => (
                <div key={idx} className="bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-lg border border-gray-100 dark:border-gray-700">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-2xl flex items-center justify-center shrink-0 text-blue-600">
                      {fact.icon}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                        {isAr ? fact.title.ar : fact.title.en}
                      </h3>
                      <div className="text-2xl font-black text-gray-900 dark:text-white mb-1">
                        {isAr ? fact.value.ar : fact.value.en}
                      </div>
                      <p className="text-gray-600 dark:text-gray-400">
                        {isAr ? fact.description.ar : fact.description.en}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 text-gray-500">
              {isAr ? 'جاري إضافة البيانات...' : 'Content coming soon...'}
            </div>
          )}

          {/* Endemic Species Showcase */}
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 flex items-center gap-3">
            <span className="w-2 h-8 bg-green-500 rounded-full"></span>
            {isAr ? 'الأنواع المستوطنة' : 'Endemic Species'}
          </h3>

          <div className="grid md:grid-cols-3 gap-8">
            {dbData.species.length > 0 ? (
              dbData.species.map((s, idx) => (
                <motion.div
                  key={s.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -6 }}
                  className="group bg-white dark:bg-gray-800 rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-all"
                >
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={s.imageUrl || '/img/placeholder.jpg'}
                      alt={isAr ? s.nameAr : s.nameEn}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-green-700 dark:text-green-400">
                      {s.conservationStatus}
                    </div>
                  </div>
                  <div className="p-6">
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                      {isAr ? s.nameAr : s.nameEn}
                    </h4>
                    {s.scientificName && (
                      <p className="text-sm text-gray-500 italic mb-4">{s.scientificName}</p>
                    )}
                    <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-4">
                      {isAr ? s.descriptionAr : s.descriptionEn}
                    </p>
                    <div className="pt-4 border-t border-gray-100 dark:border-gray-700">
                      <div className="flex flex-wrap gap-2">
                        {s.facts?.slice(0, 2).map((fact, i) => (
                          <span key={i} className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300">
                            💡 {fact}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              // Empty State or Fallback
              <div className="col-span-3 text-center py-10 text-gray-500">
                {isAr ? 'جاري إضافة البيانات...' : 'Content coming soon...'}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 3. Culture & People */}
      <section className="py-24 bg-white dark:bg-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between mb-16 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-6">
                {isAr ? 'الثقافة والتراث' : 'Culture & Heritage'}
              </h2>
              <p className="text-xl text-gray-500 dark:text-gray-400">
                {isAr
                  ? 'تراث عريق وتقاليد أصيلة حافظ عليها سكان سقطرى عبر العصور'
                  : 'Ancient heritage and authentic traditions preserved by Socotris through ages'}
              </p>
            </div>
            <div className="w-20 h-20 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center text-purple-600 animate-pulse">
              <FaTheaterMasks className="w-10 h-10" />
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dbData.cultural.length > 0 ? (
              dbData.cultural.map((item, idx) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  whileHover={{ y: -6 }}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur p-6 rounded-3xl border border-purple-100/60 dark:border-purple-900/40 hover:shadow-2xl transition-all"
                >
                  <div className="text-4xl mb-4">{item.icon || '🎭'}</div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">
                    {isAr ? item.titleAr : item.titleEn}
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                    {isAr ? item.descriptionAr : item.descriptionEn}
                  </p>
                </motion.div>
              ))
            ) : (
              [1, 2, 3, 4].map((_, i) => (
                <div key={i} className="h-64 bg-gray-100 dark:bg-gray-800 rounded-3xl animate-pulse"></div>
              ))
            )}
          </div>

          {/* Dynamic Culture Sections Text */}
          {culturalSections.length > 0 && (
            <div className="mt-16 grid md:grid-cols-2 gap-12">
              {culturalSections.map((section, idx) => (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  whileHover={{ y: -6 }}
                  className={`bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/10 dark:to-pink-900/10 p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all ${idx % 2 === 0 ? '' : 'md:translate-y-8'}`}
                >
                  {section.imageUrl && (
                    <div className="mb-6 h-48 rounded-2xl overflow-hidden relative">
                      <Image src={section.imageUrl} alt="" fill className="object-cover transition-transform duration-700 hover:scale-105" />
                    </div>
                  )}
                  <h3 className="text-2xl font-bold text-purple-900 dark:text-purple-100 mb-4">
                    {isAr ? section.titleAr : section.titleEn}
                  </h3>
                  <p className="text-purple-800 dark:text-purple-200">
                    {isAr ? section.contentAr : section.contentEn}
                  </p>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>


      {/* 4. Statistics / Why Choose Us (Dynamic) */}
      <section className="py-24 bg-gradient-to-br from-emerald-600 via-green-600 to-teal-600 text-white overflow-hidden relative">
        <div className="absolute inset-0 opacity-10 pattern-dots"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(255,255,255,0.25),_transparent_60%)]" />
        <motion.div
          className="absolute -top-24 -left-24 w-72 h-72 rounded-full bg-white/10 blur-3xl"
          animate={{ x: [0, 30, 0], y: [0, 20, 0], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-white/10 blur-3xl"
          animate={{ x: [0, -20, 0], y: [0, -30, 0], opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-white/15 backdrop-blur-md px-5 py-2 rounded-full border border-white/20 text-sm font-bold tracking-widest mb-5">
              ✨ {isAr ? 'حقائق موثوقة' : 'Verified Facts'}
            </div>
            <h2 className="text-4xl md:text-5xl font-black mb-4">
              {isAr ? 'أرقام سقطرى' : 'Socotra by the Numbers'}
            </h2>
            <p className="text-emerald-50/90 text-lg">
              {isAr ? 'مؤشرات واقعية تعكس خصوصية الأرخبيل' : 'Real indicators that reflect the uniqueness of the archipelago'}
            </p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 lg:gap-8">
            {statsData.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="group relative overflow-hidden rounded-3xl border border-white/20 bg-white/10 backdrop-blur-xl px-6 py-8 text-center shadow-2xl"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="relative mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/20 text-2xl shadow-lg shadow-black/20">
                  {statsIcons[i % statsIcons.length]}
                </div>
                <div className="relative text-4xl md:text-5xl font-black mb-2 drop-shadow-[0_10px_20px_rgba(0,0,0,0.35)]">
                  {stat.value}
                </div>
                <div className="relative text-emerald-50/90 font-semibold tracking-wide">
                  {isAr ? stat.labelAr : stat.labelEn}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

    </div>
  )
}
