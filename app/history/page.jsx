'use client'

// ═══════════════════════════════════════════════════════════════════════
// 📜 PREMIUM HISTORY PAGE
// ═══════════════════════════════════════════════════════════════════════

import { useState, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useApp } from '@/contexts/AppContext'
import WhatsAppButton from '@/components/WhatsAppButton'
import { motion, useScroll, useTransform, useSpring, useInView } from 'framer-motion'

// Helper: 3D Card Effect
const Card3D = ({ children, className }) => {
  return (
    <motion.div
      className={`transition-all duration-300 ${className}`}
      whileHover={{ y: -10, rotateX: 5, rotateY: 5, scale: 1.02 }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
    >
      {children}
    </motion.div>
  )
}

// Helper: Section Title with Reveal
const SectionTitle = ({ children, className }) => {
  return (
    <motion.h2
      className={className}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
    >
      {children}
    </motion.h2>
  )
}

export default function HistoryPage() {
  const { locale } = useApp()
  const isAr = locale === 'ar'

  // Data State
  const [loading, setLoading] = useState(true)
  const [timelineEvents, setTimelineEvents] = useState([])
  const [archaeologicalSites, setArchaeologicalSites] = useState([])
  const [historicalSections, setHistoricalSections] = useState({})
  const [pageSettings, setPageSettings] = useState({})

  // Fetch Data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/history?t=${Date.now()}`)
        const result = await response.json()
        if (result.success) {
          setTimelineEvents(result.data.timelineEvents || [])
          setArchaeologicalSites(result.data.archaeologicalSites || [])
          setHistoricalSections(result.data.historicalSections || {})
          setPageSettings(result.data.pageSettings || {})
        }
      } catch (error) {
        console.error('Error fetching history data:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Scroll Animations for Hero
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 500], [0, 200])
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0])

  const timelineRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: timelineRef,
    offset: ["start end", "end start"]
  })
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })
  const extraContent = pageSettings.extraContent || {}

  return (
    <div
      dir={isAr ? 'rtl' : 'ltr'}
      className={`min-h-screen bg-white dark:bg-gray-950 overflow-hidden ${isAr ? 'rtl' : 'ltr'}`}
    >

      {/* ═══════════════════════════════════════════════════════════════
                 1. IMMERSIVE HERO SECTION
                 ═══════════════════════════════════════════════════════════════ */}
      <div className="relative h-screen min-h-[800px] flex items-center justify-center overflow-hidden">
        {/* Parallax Background */}
        <motion.div
          className="absolute inset-0 z-0"
          style={{ y: heroY }}
        >
          {pageSettings.heroImage ? (
            <Image
              src={pageSettings.heroImage}
              alt="History Hero"
              fill
              className="object-cover scale-110"
              sizes="100vw"
              priority
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-amber-700 via-orange-900 to-black" />
          )}
          <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-transparent" />
        </motion.div>

        {/* Content */}
        <motion.div
          className="relative z-10 text-center px-4 max-w-5xl mx-auto"
          style={{ opacity: heroOpacity }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-200 mb-8"
          >
            <span className="animate-pulse">✨</span>
            <span className="font-medium tracking-wide">
              {isAr
                ? (extraContent.heroBadgeTextAr || extraContent.heroBadgeText || '20 مليون سنة من التاريخ')
                : (extraContent.heroBadgeTextEn || extraContent.heroBadgeText || '20 Million Years of History')}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="text-6xl md:text-8xl lg:text-9xl font-bold text-white mb-6 tracking-tight leading-tight"
          >
            {pageSettings[isAr ? 'heroTitleAr' : 'heroTitleEn'] || (isAr ? 'تاريخ سقطرى' : 'HISTORY OF SOCOTRA')}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-xl md:text-2xl text-gray-200 max-w-2xl mx-auto font-light leading-relaxed"
          >
            {pageSettings[isAr ? 'heroSubtitleAr' : 'heroSubtitleEn'] || (isAr
              ? 'رحلة عبر الزمن: من الانفصال الجيولوجي إلى التراث العالمي'
              : 'A journey through time: from geological separation to world heritage')}
          </motion.p>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-10 text-white/50"
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          <div className="w-6 h-10 border-2 border-current rounded-full flex justify-center p-1">
            <div className="w-1 h-3 bg-current rounded-full" />
          </div>
        </motion.div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
                 2. INTERACTIVE TIMELINE
                 ═══════════════════════════════════════════════════════════════ */}
      <section id="timeline" ref={timelineRef} className="py-24 bg-gray-50 dark:bg-gray-950 relative overflow-hidden">
        {/* Background Decor */}
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500 rounded-full blur-[128px]" />
          <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-blue-500 rounded-full blur-[128px]" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <SectionTitle className="text-4xl md:text-6xl font-bold text-center mb-24 text-gray-900 dark:text-white">
            {isAr ? 'الخط الزمني' : 'The Timeline'}
          </SectionTitle>

          <div className="relative max-w-5xl mx-auto">
            {/* Central Line */}
            <motion.div
              style={{ scaleY }}
              className="absolute left-4 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-amber-500 via-orange-500 to-purple-600 origin-top transform md:-translate-x-1/2"
            />

            {/* Events */}
            <div className="space-y-24">
              {timelineEvents.map((event, index) => {
                const isEven = index % 2 === 0
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.6, delay: 0.1 }}
                    className={`flex flex-col md:flex-row items-center gap-8 md:gap-16 ${isEven ? '' : 'md:flex-row-reverse'}`}
                  >
                    {/* Date Bubble */}
                    <div className="md:w-1/2 flex justify-start md:justify-end">
                      <div className={`
                                                relative px-6 py-3 rounded-2xl text-2xl font-bold shadow-xl border-4 border-white dark:border-gray-900
                                                bg-gradient-to-r ${event.color} text-white
                                                md:order-1 ${isEven ? 'md:mr-[-3rem]' : 'md:ml-[-3rem]'} z-20
                                            `}>
                        {isAr ? (event.year || event.yearEn) : (event.yearEn || event.year)}
                      </div>
                    </div>

                    {/* Content Card */}
                    <div className="md:w-1/2 pl-12 md:pl-0">
                      <div className="bg-white dark:bg-gray-900 p-8 rounded-3xl shadow-2xl border border-gray-100 dark:border-gray-800 hover:border-amber-500/30 transition-colors group">
                        <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300 inline-block">{event.icon}</div>
                        <h3 className="text-2xl font-bold mb-3 text-gray-900 dark:text-white">
                          {isAr ? event.titleAr : event.titleEn}
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 leading-relaxed">
                          {isAr ? event.descriptionAr : event.descriptionEn}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
                 3. ANCIENT ERA (Sticky Header)
                 ═══════════════════════════════════════════════════════════════ */}
      <section className="relative py-24 bg-amber-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4 max-w-7xl grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Sticky Header */}
          <div className="md:col-span-4 lg:col-span-3">
            <div className="sticky top-32">
              <span className={`block text-amber-600 font-bold tracking-widest ${isAr ? 'text-right' : 'text-left'} mb-2`}>
                {isAr ? '01. حقبة' : '01. Era'}
              </span>
              <h2 className={`text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6 leading-tight ${isAr ? 'text-right' : 'text-left'}`}>
                {historicalSections.ancient ? (isAr ? historicalSections.ancient.titleAr : historicalSections.ancient.titleEn) : (isAr ? 'العصور القديمة' : 'Ancient Times')}
              </h2>
              <div className={`h-1 w-20 bg-amber-500 rounded-full ${isAr ? 'ml-auto' : ''}`} />
            </div>
          </div>

          {/* Content */}
          <div className={`md:col-span-8 lg:col-span-9 leading-loose text-lg text-gray-700 dark:text-gray-300 ${isAr ? 'text-right' : 'text-left'}`}>
            <p className={`mb-12 whitespace-pre-wrap first-letter:text-5xl first-letter:font-bold first-letter:mr-3 first-letter:float-left first-letter:text-amber-600 ${isAr ? 'first-letter:float-right first-letter:mr-0 first-letter:ml-3' : ''}`}>
              {historicalSections.ancient
                ? (isAr ? historicalSections.ancient.contentAr : historicalSections.ancient.contentEn)
                : (isAr ? 'جارٍ تحميل المحتوى...' : 'Loading content...')}
            </p>

            {/* Interactive Cards Grid */}
            <div className="grid md:grid-cols-3 gap-6">
              {(Array.isArray(extraContent.ancientCards) && extraContent.ancientCards.length > 0
                ? extraContent.ancientCards
                : [
                  {
                    titleEn: 'Ancient Myths',
                    titleAr: 'أساطير قديمة',
                    descriptionEn: 'Legends of dragons and phoenixes born from the unique flora.',
                    descriptionAr: 'أساطير عن التنانين والعنقاء ولدت من الطبيعة الفريدة.',
                    icon: '🐉'
                  },
                  {
                    titleEn: 'Incense Route',
                    titleAr: 'طريق اللبان',
                    descriptionEn: 'A pivotal hub for the trade of frankincense and myrrh.',
                    descriptionAr: 'مركز محوري لتجارة اللبان والمر.',
                    icon: '⚱️'
                  },
                  {
                    titleEn: 'Lost Language',
                    titleAr: 'لغة مفقودة',
                    descriptionEn: 'The Soqotri language preserves ancient Semitic roots.',
                    descriptionAr: 'لغة سقطرى تحفظ جذورًا سامية قديمة.',
                    icon: '🗣️'
                  }
                ]).map((card, i) => (
                  <Card3D key={card.id || i} className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border-t-4 border-amber-500">
                    {card.image ? (
                      <div className="relative w-full h-28 mb-4 rounded-xl overflow-hidden">
                        <Image src={card.image} alt={isAr ? card.titleAr : card.titleEn} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                        <div className="absolute inset-0 bg-black/20" />
                      </div>
                    ) : (
                      <div className="text-4xl mb-4">{card.icon || '✨'}</div>
                    )}
                    <h3 className={`font-bold text-xl mb-2 text-gray-900 dark:text-white ${isAr ? 'text-right' : 'text-left'}`}>
                      {isAr ? (card.titleAr || card.titleEn) : (card.titleEn || card.titleAr)}
                    </h3>
                    <p className={`text-sm text-gray-600 dark:text-gray-400 ${isAr ? 'text-right' : 'text-left'}`}>
                      {isAr ? (card.descriptionAr || card.descriptionEn) : (card.descriptionEn || card.descriptionAr)}
                    </p>
                  </Card3D>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
                 4. COLONIAL & MODERN (Rich Media)
                 ═══════════════════════════════════════════════════════════════ */}
      {[
        { id: 'colonial', color: 'red', icon: '⚔️', defaultTitle: 'Colonial Era', defaultTitleAr: 'العصر الاستعماري' },
        { id: 'modern', color: 'green', icon: '🌍', defaultTitle: 'Modern Era', defaultTitleAr: 'العصر الحديث' }
      ].map((section, idx) => (
        <section key={section.id} className="py-24 bg-white dark:bg-gray-950 overflow-hidden">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className={`flex flex-col md:flex-row items-center gap-16 ${idx % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}>
              <div className="md:w-1/2">
                <motion.div
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8 }}
                  className={`relative aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl bg-gradient-to-br from-${section.color}-100 to-${section.color}-200`}
                >
                  <div className="absolute inset-0 flex items-center justify-center text-9xl opacity-20 transform rotate-12">
                    {section.icon}
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                    <div className={`h-1 w-20 bg-${section.color}-500 mb-2`} />
                  </div>
                </motion.div>
              </div>

              <div className="md:w-1/2">
                <span className={`text-${section.color}-600 font-bold tracking-widest mb-2 block ${isAr ? 'text-right' : 'text-left'}`}>
                  {isAr ? `0${idx + 2}. فترة` : `0${idx + 2}. Period`}
                </span>
                <SectionTitle className="text-4xl md:text-6xl font-bold mb-8 text-gray-900 dark:text-white">
                  {historicalSections[section.id]
                    ? (isAr ? historicalSections[section.id].titleAr : historicalSections[section.id].titleEn)
                    : (isAr ? section.defaultTitleAr : section.defaultTitle)}
                </SectionTitle>
                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 }}
                  className={`prose prose-lg dark:prose-invert text-gray-600 dark:text-gray-400 ${isAr ? 'text-right' : 'text-left'}`}
                >
                  {historicalSections[section.id]
                    ? (isAr ? historicalSections[section.id].contentAr : historicalSections[section.id].contentEn)
                    : (isAr ? 'جارٍ تحميل المحتوى...' : 'Loading content...')}
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* ═══════════════════════════════════════════════════════════════
                 5. ARCHAEOLOGICAL SITES (Premium Grid)
                 ═══════════════════════════════════════════════════════════════ */}
      <section id="sites" className="py-24 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <SectionTitle className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
              {isAr ? 'المواقع الأثرية' : 'Archaeological Sites'}
            </SectionTitle>
            <div className="w-24 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {archaeologicalSites.map((site, index) => (
              <Card3D key={site.id} className="relative group perspective-1000">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-100 transition duration-500" />
                <div className="relative h-full bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-xl border border-gray-100 dark:border-gray-700 flex flex-col">
                  {/* Image/Gradient Area */}
                  <div className="h-48 relative overflow-hidden">
                    {site.imageUrl ? (
                      <>
                        <Image src={site.imageUrl} alt={isAr ? site.nameAr : site.nameEn} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                      </>
                    ) : (
                      <>
                        <div className={`absolute inset-0 bg-gradient-to-br ${site.gradient}`} />
                        <div className="absolute inset-0 flex items-center justify-center text-8xl opacity-30 transform group-hover:scale-110 transition-transform duration-700">
                          {site.gradient.includes('amber') ? '🏔️' : '🏛️'}
                        </div>
                      </>
                    )}
                    <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/80 to-transparent">
                      <span className="text-white text-sm font-bold px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/10">
                        {isAr ? site.periodAr : site.periodEn}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3 group-hover:text-purple-600 transition-colors">
                      {isAr ? site.nameAr : site.nameEn}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6 line-clamp-3 text-sm flex-1">
                      {isAr ? site.descriptionAr : site.descriptionEn}
                    </p>

                    <div className="grid grid-cols-2 gap-4 text-xs font-semibold text-gray-500 border-t border-gray-100 dark:border-gray-700 pt-4">
                      <div className="flex items-center gap-1">
                        <span>📍</span> {isAr ? site.locationAr : site.locationEn}
                      </div>
                      <div className="flex items-center gap-1 justify-end">
                        <span>🚶</span> {isAr ? site.accessAr : site.accessEn}
                      </div>
                    </div>
                  </div>
                </div>
              </Card3D>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
                 6. CTA footer
                 ═══════════════════════════════════════════════════════════════ */}
      <section className="relative py-24 bg-black overflow-hidden flex items-center justify-center">
        <div className="absolute inset-0 opacity-40">
          <Image
            src={pageSettings.ctaImage || "/img/hero-bg.jpg"}
            alt="History CTA"
            fill
            className="object-cover"
            sizes="100vw"
          />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />

        <div className="relative z-10 text-center max-w-4xl px-4">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-bold text-white mb-8 tracking-tighter"
          >
            {pageSettings[isAr ? 'ctaTitleAr' : 'ctaTitleEn'] || (isAr ? 'اكتشف التاريخ' : 'Discover History')}
          </motion.h2>
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex gap-6 justify-center"
          >
            <a href="/tours" className="px-8 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform">
              {isAr ? 'احجز رحلتك' : 'Book Your Tour'}
            </a>
          </motion.div>
        </div>
      </section>

      <WhatsAppButton />
    </div>
  )
}
