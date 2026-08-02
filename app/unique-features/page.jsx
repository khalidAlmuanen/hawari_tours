'use client'

// ═══════════════════════════════════════════════════════════════════════
// 🌟 Unique Features Page - Dynamic
// ═══════════════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react'
import { useApp } from '@/contexts/AppContext'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'

export default function UniqueFeaturesPage() {
  const { locale } = useApp()
  const isAr = locale === 'ar'

  const [loading, setLoading] = useState(true)
  const [data, setData] = useState(null)
  const [activeFeature, setActiveFeature] = useState('dragons-blood')
  const [lightboxItem, setLightboxItem] = useState(null)

  // ═══════════════════════════════════════════════════════════════
  // Fetch Data
  // ═══════════════════════════════════════════════════════════════
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`/api/unique-features?t=${Date.now()}`)
        const result = await response.json()
        if (result.success) {
          setData(result.data)
        }
      } catch (error) {
        console.error('Error fetching unique features:', error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-green-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400 text-lg animate-pulse">
            {isAr ? 'جاري اكتشاف كنوز سقطرى...' : 'Discovering Socotra\'s Treasures...'}
          </p>
        </div>
      </div>
    )
  }

  if (!data) return null

  const { pageSettings, dragonBloodTrees, flora, beaches, caves, mountains, wildlife } = data
  const extractFromFacts = (facts, prefix) => {
    if (!Array.isArray(facts)) return ''
    const found = facts.find(item => typeof item === 'string' && item.toLowerCase().startsWith(prefix.toLowerCase() + ':'))
    return found ? found.split(':').slice(1).join(':').trim() : ''
  }
  const splitLangList = (list) => {
    const en = []
    const ar = []
    const other = []
    if (!Array.isArray(list)) return { en, ar, other }
    list.forEach(item => {
      if (typeof item !== 'string') return
      const value = item.trim()
      if (value.toLowerCase().startsWith('en:')) {
        en.push(value.replace(/^en:\s*/i, ''))
      } else if (value.toLowerCase().startsWith('ar:')) {
        ar.push(value.replace(/^ar:\s*/i, ''))
      } else {
        other.push(value)
      }
    })
    return { en, ar, other }
  }
  const getLangList = (list) => {
    const { en, ar, other } = splitLangList(list)
    if (isAr) {
      if (ar.length) return ar
      if (other.length) return other
      return en
    }
    if (en.length) return en
    if (other.length) return other
    return ar
  }



  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">

      {/* ═══════════════════════════════════════════════════════════════
          Hero Section
          Using pageSettings from DB
      ═══════════════════════════════════════════════════════════════ */}
      {/* ═══════════════════════════════════════════════════════════════
          Hero Section (Parallax & Cinematic)
      ═══════════════════════════════════════════════════════════════ */}
      <section className="relative h-screen min-h-[800px] overflow-hidden flex items-center justify-center">
        {/* Parallax Background */}
        <div className="absolute inset-0 z-0">
          {pageSettings?.heroImage ? (
            <motion.div
              initial={{ scale: 1.1 }}
              animate={{ scale: 1 }}
              transition={{ duration: 10, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
              className="w-full h-full"
            >
              <Image
                src={pageSettings.heroImage}
                alt="Unique Features Hero"
                fill
                className="object-cover"
                priority
              />
            </motion.div>
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-green-900 to-teal-900" />
          )}
          <div className="absolute inset-0 bg-black/30 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/30" />
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="inline-block mb-6"
          >
            <span className="py-2 px-6 rounded-full bg-white/10 backdrop-blur-md text-white border border-white/20 text-sm md:text-base font-bold tracking-widest uppercase text-shadow-sm">
              {isAr ? 'اكتشف سقطرى' : 'Discover Socotra'}
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="text-6xl md:text-8xl lg:text-9xl font-black text-white mb-8 leading-tight drop-shadow-2xl"
          >
            {isAr ? (pageSettings?.heroTitleAr || 'ميزات فريدة') : (pageSettings?.heroTitleEn || 'Unique Features')}
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-300">
              {isAr ? 'لا مثيل لها' : 'Found Nowhere'}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="text-xl md:text-3xl text-gray-200 max-w-4xl mx-auto leading-relaxed font-light"
          >
            {isAr
              ? (pageSettings?.heroSubtitleAr || 'اكتشف الكنوز التي تجعل سقطرى جوهرة العالم المكنونة.')
              : (pageSettings?.heroSubtitleEn || 'Discover the treasures that make Socotra a hidden gem of the world.')
            }
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
            className="mt-12"
          >
            <div className="animate-bounce-subtle">
              <span className="text-white/50 text-sm uppercase tracking-widest">{isAr ? 'تصفح الأسفل' : 'Scroll Down'}</span>
              <div className="w-0.5 h-16 bg-gradient-to-b from-white to-transparent mx-auto mt-4"></div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          Floating Navigation
      ═══════════════════════════════════════════════════════════════ */}
      <div className="sticky top-6 z-50 pointer-events-none">
        <div className="container mx-auto px-4 flex justify-center">
          <div className="pointer-events-auto bg-white/10 dark:bg-black/30 backdrop-blur-xl border border-white/20 dark:border-white/10 rounded-full p-2 shadow-2xl flex gap-1 md:gap-2">
            {[
              { id: 'dragons-blood', label: isAr ? 'النباتات' : "Flora", icon: '🌿' },
              { id: 'beaches', label: isAr ? 'الشواطئ' : 'Beaches', icon: '🏖️' },
              { id: 'caves', label: isAr ? 'الكهوف' : 'Caves', icon: '⛰️' },
              { id: 'wildlife', label: isAr ? 'الحياة البرية' : 'Wildlife', icon: '🦎' },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveFeature(tab.id)
                  document.getElementById(tab.id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                }}
                className={`relative px-4 py-2 md:px-6 md:py-3 rounded-full transition-all duration-300 font-bold text-sm md:text-base flex items-center gap-2 ${activeFeature === tab.id
                  ? 'text-white'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
                  }`}
              >
                {activeFeature === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-600 rounded-full -z-10 shadow-lg"
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span>{tab.icon}</span>
                <span className="hidden md:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════════════
          1. Dragon's Blood Tree Section
      ═══════════════════════════════════════════════════════════════ */}
      {/* ═══════════════════════════════════════════════════════════════
          1. Flora Section (Immersive Zig-Zag)
      ═══════════════════════════════════════════════════════════════ */}
      <section id="dragons-blood" className="py-32 relative bg-white dark:bg-gray-900">
        <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-gray-100 dark:from-black/20 to-transparent pointer-events-none" />

        <div className="container mx-auto px-4 space-y-32">
          {flora?.length > 0 ? (
            flora.map((item, index) => {
              const facts = getLangList(item.facts)
              const uses = getLangList(item.uses)
              const threats = getLangList(item.threats)
              return (
              <motion.div
                initial={{ opacity: 0, y: 100 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                key={item.id}
                className={`flex flex-col lg:flex-row gap-8 lg:gap-20 items-center ${index % 2 !== 0 ? 'lg:flex-row-reverse' : ''}`}
              >
                {/* Image Side */}
                <div className="lg:w-1/2 w-full">
                  <div
                    className="relative rounded-[2.5rem] overflow-hidden shadow-2xl aspect-[4/5] md:aspect-[4/3] group cursor-pointer"
                    onClick={() => setLightboxItem(item)}
                  >
                    {item.images?.[0] ? (
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.7, ease: "easeOut" }}
                        className="w-full h-full"
                      >
                        <Image
                          src={item.images[0]}
                          alt={isAr ? item.nameAr : item.nameEn}
                          fill
                          className="object-cover"
                        />
                      </motion.div>
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                        <span className="text-8xl">🌿</span>
                      </div>
                    )}

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-md border border-white/30 flex items-center justify-center text-white font-bold tracking-widest uppercase text-xs">
                        {isAr ? 'استكشف' : 'Explore'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Side */}
                <div className="lg:w-1/2 w-full space-y-8">
                  <motion.div
                    initial={{ x: index % 2 === 0 ? 50 : -50, opacity: 0 }}
                    whileInView={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.8, delay: 0.2 }}
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <span className="h-0.5 w-12 bg-green-500"></span>
                      <span className="text-green-600 dark:text-green-400 font-bold tracking-[0.2em] uppercase text-sm">
                        {isAr ? 'نباتات نادرة' : 'Flora'}
                      </span>
                    </div>

                    <h2 className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white leading-none mb-6">
                      {isAr ? item.nameAr : item.nameEn}
                    </h2>

                    <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed font-light">
                      {isAr ? item.descriptionAr : item.descriptionEn}
                    </p>
                  </motion.div>

                  <div className="space-y-6">
                    {facts.length > 0 && (
                      <div>
                        <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">
                          {isAr ? 'حقائق' : 'Facts'}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {facts.map((fact, i) => (
                            <span key={i} className="px-3 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-200 text-xs font-semibold">
                              {fact}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {uses.length > 0 && (
                      <div>
                        <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">
                          {isAr ? 'الاستخدامات' : 'Uses'}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {uses.map((use, i) => (
                            <span key={i} className="px-3 py-1 rounded-full bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-200 text-xs font-semibold">
                              {use}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {threats.length > 0 && (
                      <div>
                        <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-widest mb-3">
                          {isAr ? 'التهديدات' : 'Threats'}
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {threats.map((threat, i) => (
                            <span key={i} className="px-3 py-1 rounded-full bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-200 text-xs font-semibold">
                              {threat}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
              )
            })
          ) : (
            <div className="text-center py-20">
              <p className="text-gray-400 text-xl font-light italic">{isAr ? 'جاري تحميل المحتوى...' : 'Loading content...'}</p>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          2. Beaches Section
      ═══════════════════════════════════════════════════════════════ */}
      {/* ═══════════════════════════════════════════════════════════════
          2. Beaches Section (Masonry / Glass Grid)
      ═══════════════════════════════════════════════════════════════ */}
      <section id="beaches" className="py-32 relative overflow-hidden bg-gray-50 dark:bg-gray-900/50">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto mb-20">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-5xl md:text-7xl font-black text-gray-900 dark:text-white mb-6"
            >
              {isAr ? (pageSettings?.beachesTitleAr || 'شواطئ فيروزية') : (pageSettings?.beachesTitleEn || 'Turquoise Shores')}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-gray-600 dark:text-gray-400 text-xl font-light"
            >
              {isAr ? (pageSettings?.beachesSubtitleAr || 'حيث يلتقي المحيط بالسماء في مشهد لا يتكرر.') : (pageSettings?.beachesSubtitleEn || 'Where the ocean meets the sky in a scene found nowhere else.')}
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {beaches?.items?.map((beach, i) => (
              (() => {
                const activitiesText = isAr ? (beach.activitiesAr || '') : (beach.activitiesEn || extractFromFacts(beach.facts, 'Activities'))
                const activities = activitiesText ? activitiesText.split(',').map(item => item.trim()).filter(Boolean) : []
                const bestTime = isAr ? (beach.bestTimeAr || '') : (beach.bestTimeEn || extractFromFacts(beach.facts, 'Best Time'))
                return (
              <motion.div
                key={beach.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                className={`group relative h-[500px] rounded-[2rem] overflow-hidden shadow-xl ${i % 3 === 0 ? 'md:col-span-2 lg:col-span-2' : ''}`}
              >
                {/* Background Image */}
                {beach.images?.[0] ? (
                  <Image
                    src={beach.images[0]}
                    alt={beach.nameEn}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-blue-100 flex items-center justify-center">
                    <span className="text-6xl">🏖️</span>
                  </div>
                )}

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                {/* Rating Badge */}
                <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white font-bold border border-white/30 shadow-lg flex items-center gap-2">
                  <span>⭐ {(beach.rating || 5).toFixed(1)}</span>
                </div>

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">
                    {isAr ? beach.nameAr : beach.nameEn}
                  </h3>

                  <p className="text-gray-200 line-clamp-2 mb-6 text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                    {isAr ? beach.descriptionAr : beach.descriptionEn}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {bestTime && (
                      <span className="px-3 py-1 bg-white/20 backdrop-blur text-white text-xs font-semibold rounded-full border border-white/20">
                        {isAr ? `أفضل وقت: ${bestTime}` : `Best Time: ${bestTime}`}
                      </span>
                    )}
                    {activities.map((tag, i) => (
                      <span key={i} className="px-3 py-1 bg-white/20 backdrop-blur text-white text-xs font-semibold rounded-full border border-white/20">
                        {tag.trim()}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
                )
              })()
            ))}

            {(!beaches?.items || beaches.items.length === 0) && (
              <div className="col-span-full py-20 text-center text-gray-400">
                {isAr ? 'لا توجد شواطئ مضافة حتى الآن.' : 'No beaches added yet.'}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          3. Caves Section
      ═══════════════════════════════════════════════════════════════ */}
      {/* ═══════════════════════════════════════════════════════════════
          3. Caves Section (Dark Mode Split Screen)
      ═══════════════════════════════════════════════════════════════ */}
      <section id="caves" className="py-32 bg-gray-900 text-white relative overflow-hidden">
        {/* Ambient Background */}
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-900/20 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-1/2 h-full bg-purple-900/20 blur-[120px] pointer-events-none" />

        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-16 lg:gap-24">

            {/* Sticky Content */}
            <div className="lg:w-1/3">
              <div className="sticky top-32">
                <motion.div
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  <span className="text-blue-400 font-mono tracking-widest text-sm uppercase mb-4 block">
                    {isAr ? 'تحت الأرض' : 'Underground'}
                  </span>
                  <h2 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
                    {isAr ? (pageSettings?.cavesTitleAr || 'أسرار الكهوف') : (pageSettings?.cavesTitleEn || 'Hidden Depths')}
                  </h2>
                  <p className="text-gray-400 text-xl leading-relaxed mb-8 font-light">
                    {isAr ? (pageSettings?.cavesSubtitleAr || 'تتميز سقطرى بشبكة واسعة من الكهوف الجيرية الضخمة التي تمتد لكيلومترات تحت الأرض.') : (pageSettings?.cavesSubtitleEn || 'Socotra features a vast network of massive limestone caves stretching for kilometers underground.')}
                  </p>

                </motion.div>
              </div>
            </div>

            {/* Scrollable List */}
            <div className="lg:w-2/3 space-y-8">
              {caves?.map((cave, index) => (
                (() => {
                  const depth = cave.depth || extractFromFacts(cave.facts, 'Depth')
                  const difficulty = isAr ? (cave.difficultyAr || cave.difficultyEn || extractFromFacts(cave.facts, 'Difficulty')) : (cave.difficultyEn || extractFromFacts(cave.facts, 'Difficulty'))
                  return (
                <motion.div
                  key={cave.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ margin: "-50px" }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  whileHover={{ y: -10 }}
                  className="group relative h-[500px] rounded-[2rem] overflow-hidden shadow-xl"
                >
                  {cave.images?.[0] ? (
                    <Image
                      src={cave.images[0]}
                      alt={cave.nameEn}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                      <span className="text-6xl">⛰️</span>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  {depth && (
                    <div className="absolute top-6 right-6 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white font-bold border border-white/30 shadow-lg flex items-center gap-2">
                      <span>📏 {depth}</span>
                    </div>
                  )}

                  <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <h3 className="text-3xl md:text-4xl font-bold text-white mb-3">
                      {isAr ? cave.nameAr : cave.nameEn}
                    </h3>

                    <p className="text-gray-200 line-clamp-2 mb-6 text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                      {isAr ? cave.descriptionAr : cave.descriptionEn}
                    </p>

                    {difficulty && (
                      <div className="flex flex-wrap gap-2">
                        <span className="px-3 py-1 bg-white/20 backdrop-blur text-white text-xs font-semibold rounded-full border border-white/20">
                          {`${isAr ? 'الصعوبة' : 'Difficulty'}: ${difficulty}`}
                        </span>
                      </div>
                    )}
                  </div>
                </motion.div>
                  )
                })()
              ))}

              {(!caves || caves.length === 0) && (
                <div className="text-center py-20 text-gray-600">
                  {isAr ? 'لا توجد كهوف مضافة.' : 'No caves added yet.'}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          4. Wildlife Section (Interactive Cards)
      ═══════════════════════════════════════════════════════════════ */}
      <section id="wildlife" className="py-32 bg-emerald-950 text-white relative overflow-hidden">
        {/* Decorative Texture */}
        <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-black to-transparent opacity-50" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-24">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block p-3 rounded-2xl bg-emerald-800/50 mb-4">
                🦎
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-black mb-6"
            >
              {isAr ? (pageSettings?.wildlifeTitleAr || 'حياة برية نادرة') : (pageSettings?.wildlifeTitleEn || 'Rare Wildlife')}
            </motion.h2>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-emerald-200/80 text-xl max-w-2xl mx-auto font-light"
            >
              {isAr ? (pageSettings?.wildlifeSubtitleAr || 'الكثير من زواحف وطيور سقطرى لا توجد في أي مكان آخر.') : (pageSettings?.wildlifeSubtitleEn || 'Much of Socotra\'s reptiles and birds are found nowhere else.')}
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {wildlife?.map((animal, i) => (
              <motion.div
                key={animal.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="group h-[400px] relative rounded-3xl overflow-hidden cursor-pointer"
              >
                {/* Background Image */}
                {animal.images?.[0] ? (
                  <Image
                    src={animal.images[0]}
                    alt={animal.nameEn}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                ) : (
                  <div className="w-full h-full bg-emerald-900 flex items-center justify-center text-8xl opacity-30">
                    {animal.icon || '🦎'}
                  </div>
                )}

                {/* Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-emerald-950 via-emerald-900/60 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

                {/* Content */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                  <span className="text-emerald-300 font-mono text-xs uppercase tracking-widest mb-2 opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                    {animal.scientificName || 'Endemic Species'}
                  </span>
                  <h3 className="text-2xl font-bold mb-2 text-white">
                    {isAr ? animal.nameAr : animal.nameEn}
                  </h3>
                  <p className="text-emerald-100/70 text-sm line-clamp-3 group-hover:line-clamp-none transition-all duration-300 group-hover:bg-black/40 group-hover:backdrop-blur-md group-hover:p-4 group-hover:rounded-xl">
                    {isAr ? animal.descriptionAr : animal.descriptionEn}
                  </p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {((isAr ? animal.categoryAr : animal.categoryEn) || '').trim() && (
                      <span className="px-2 py-1 text-[10px] font-semibold uppercase tracking-widest bg-emerald-700/60 rounded-full border border-emerald-500/40">
                        {isAr ? animal.categoryAr : animal.categoryEn}
                      </span>
                    )}
                    {((isAr ? animal.sizeAr : animal.sizeEn) || '').trim() && (
                      <span className="px-2 py-1 text-[10px] font-semibold uppercase tracking-widest bg-emerald-700/60 rounded-full border border-emerald-500/40">
                        {isAr ? animal.sizeAr : animal.sizeEn}
                      </span>
                    )}
                    {((isAr ? animal.statusAr : animal.statusEn) || '').trim() && (
                      <span className="px-2 py-1 text-[10px] font-semibold uppercase tracking-widest bg-emerald-700/60 rounded-full border border-emerald-500/40">
                        {isAr ? animal.statusAr : animal.statusEn}
                      </span>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <AnimatePresence>
        {lightboxItem && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setLightboxItem(null)}
          >
            <motion.button
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              onClick={() => setLightboxItem(null)}
              className="absolute top-6 right-6 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white text-2xl flex items-center justify-center"
            >
              ✕
            </motion.button>
            <motion.div
              initial={{ scale: 0.98, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.98, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="relative w-full max-w-6xl h-[80vh] bg-white/5 backdrop-blur-xl rounded-3xl overflow-hidden border border-white/10"
              onClick={(event) => event.stopPropagation()}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 h-full">
                <div className="relative h-64 lg:h-full">
                  {lightboxItem.images?.[0] ? (
                    <Image
                      src={lightboxItem.images[0]}
                      alt={isAr ? lightboxItem.nameAr : lightboxItem.nameEn}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-green-900 to-emerald-900 flex items-center justify-center text-7xl">
                      🌿
                    </div>
                  )}
                </div>
                <div className="p-8 lg:p-10 overflow-y-auto text-white">
                  <h3 className="text-3xl lg:text-4xl font-black mb-4">
                    {isAr ? lightboxItem.nameAr : lightboxItem.nameEn}
                  </h3>
                  <p className="text-white/80 text-lg leading-relaxed mb-6">
                    {isAr ? lightboxItem.descriptionAr : lightboxItem.descriptionEn}
                  </p>
                  <div className="space-y-6">
                    {(() => {
                      const facts = getLangList(lightboxItem.facts)
                      if (facts.length === 0) return null
                      return (
                        <div>
                          <h4 className="text-sm font-bold text-white/60 uppercase tracking-widest mb-3">{isAr ? 'حقائق' : 'Facts'}</h4>
                          <div className="flex flex-wrap gap-2">
                            {facts.map((fact, i) => (
                              <span key={i} className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-sm">
                                {fact}
                              </span>
                            ))}
                          </div>
                        </div>
                      )
                    })()}
                    {(() => {
                      const uses = getLangList(lightboxItem.uses)
                      if (uses.length === 0) return null
                      return (
                        <div>
                          <h4 className="text-sm font-bold text-white/60 uppercase tracking-widest mb-3">{isAr ? 'الاستخدامات' : 'Uses'}</h4>
                          <div className="flex flex-wrap gap-2">
                            {uses.map((use, i) => (
                              <span key={i} className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/20 text-sm">
                                {use}
                              </span>
                            ))}
                          </div>
                        </div>
                      )
                    })()}
                    {(() => {
                      const threats = getLangList(lightboxItem.threats)
                      if (threats.length === 0) return null
                      return (
                        <div>
                          <h4 className="text-sm font-bold text-white/60 uppercase tracking-widest mb-3">{isAr ? 'التهديدات' : 'Threats'}</h4>
                          <div className="flex flex-wrap gap-2">
                            {threats.map((threat, i) => (
                              <span key={i} className="px-3 py-1 rounded-full bg-red-500/20 border border-red-400/20 text-sm">
                                {threat}
                              </span>
                            ))}
                          </div>
                        </div>
                      )
                    })()}
                    {((isAr ? lightboxItem.conservationStatusAr : lightboxItem.conservationStatus) || '').trim() && (
                      <div>
                        <h4 className="text-sm font-bold text-white/60 uppercase tracking-widest mb-2">{isAr ? 'حالة الحفظ' : 'Conservation'}</h4>
                        <span className="inline-flex px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-400/20 text-sm">
                          {isAr ? lightboxItem.conservationStatusAr : lightboxItem.conservationStatus}
                        </span>
                      </div>
                    )}
                    {((isAr ? lightboxItem.locationAr : lightboxItem.location) || '').trim() && (
                      <div>
                        <h4 className="text-sm font-bold text-white/60 uppercase tracking-widest mb-2">{isAr ? 'الموقع' : 'Location'}</h4>
                        <span className="inline-flex px-3 py-1 rounded-full bg-white/10 border border-white/10 text-sm">
                          {isAr ? lightboxItem.locationAr : lightboxItem.location}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
