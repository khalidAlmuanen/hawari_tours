'use client'

// ═══════════════════════════════════════════════════════════════════════
// ⭐ TESTIMONIALS PAGE - ULTRA MODERN & CONNECTED
// ✨ Features: Real API Data, Wizard Submission, 3D Effects
// ═══════════════════════════════════════════════════════════════════════

import { useState, useMemo, useEffect, useRef } from 'react'
import Image from 'next/image'
import { useApp } from '@/contexts/AppContext'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const getFlagEmoji = (code) => {
  if (!code || typeof code !== 'string' || code.length !== 2) return '🌍'
  const chars = code.toUpperCase().split('').map((c) => 127397 + c.charCodeAt(0))
  return String.fromCodePoint(...chars)
}

const getDisplayName = (review, isAr) => {
  const fallback = isAr ? 'مسافر' : 'Traveler'
  return isAr ? review.customerNameAr || review.customerName || fallback : review.customerName || fallback
}

const getDisplayCountry = (review, isAr) => {
  const fallback = isAr ? 'غير معروف' : 'Unknown'
  return isAr ? review.countryAr || review.country || fallback : review.country || fallback
}

const getDisplayContent = (review, isAr) => {
  const fallback = isAr ? 'تجربة رائعة' : 'Amazing experience'
  return isAr ? review.contentAr || review.content || fallback : review.content || fallback
}

const getRatingValue = (review) => {
  const value = Number(review.rating || 0)
  return Math.max(0, Math.min(5, value))
}

const getYouTubeId = (url) => {
  try {
    const parsed = new URL(url)
    if (parsed.hostname.includes('youtu.be')) {
      return parsed.pathname.replace('/', '').split('?')[0] || null
    }
    if (parsed.hostname.includes('youtube.com')) {
      if (parsed.pathname === '/watch') return parsed.searchParams.get('v')
      if (parsed.pathname.startsWith('/shorts/')) return parsed.pathname.split('/')[2] || null
      if (parsed.pathname.startsWith('/embed/')) return parsed.pathname.split('/')[2] || null
    }
    return null
  } catch {
    return null
  }
}

const getVimeoId = (url) => {
  try {
    const parsed = new URL(url)
    if (!parsed.hostname.includes('vimeo.com')) return null
    const parts = parsed.pathname.split('/').filter(Boolean)
    const id = parts.find((part) => /^\d+$/.test(part))
    return id || null
  } catch {
    return null
  }
}

const getVideoEmbedUrl = (url) => {
  if (!url) return ''
  const youTubeId = getYouTubeId(url)
  if (youTubeId) return `https://www.youtube.com/embed/${youTubeId}?autoplay=1`
  const vimeoId = getVimeoId(url)
  if (vimeoId) return `https://player.vimeo.com/video/${vimeoId}?autoplay=1`
  return url
}

// -----------------------------------------------------------------------------
// 🌍 Globe Hero (Dynamic)
// -----------------------------------------------------------------------------
const GlobeHero = ({ isAr, reviews = [] }) => {
  // Get unique countries from reviews to display on globe
  const activeCountries = useMemo(() => {
    const unique = [...new Set(reviews.map(r => getDisplayCountry(r, isAr)).filter(Boolean))].slice(0, 8)
    return unique.length > 0 ? unique : ['USA', 'Italy', 'France', 'Japan', 'UAE']
  }, [reviews, isAr])

  return (
    <div className="relative h-[80vh] min-h-[600px] w-full flex items-center justify-center overflow-hidden bg-[#0a0a0a]">
      {/* Background Atmosphere */}
      <div className="absolute inset-0 bg-radial-gradient from-blue-900/20 via-black to-black opacity-80" />

      {/* Animated Dots/Stars */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute w-full h-full bg-[url('/images/stars-pattern.png')] animate-pulse" style={{ backgroundSize: '200px' }} />
      </div>

      {/* Central Globe Representation (CSS 3D) */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
        className="relative z-10 w-[300px] h-[300px] md:w-[500px] md:h-[500px]"
      >
        {/* Globe Sphere */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue-600 to-indigo-900 opacity-80 blur-3xl" />
        <div className="absolute inset-0 rounded-full border border-blue-500/30 shadow-[0_0_50px_rgba(59,130,246,0.5)] animate-spin-slow">
          {/* Meridians / Lats */}
          {[...Array(6)].map((_, i) => (
            <div key={i} className="absolute inset-0 rounded-full border border-blue-400/10" style={{ transform: `rotate(${i * 30}deg)` }} />
          ))}
        </div>

        {/* Floating "Markers" (Reviews from around the world) */}
        {activeCountries.map((country, i) => {
          const delay = i * 0.5
          // Deterministic positioning to fix hydration mismatch (Server vs Client)
          // Uses sin/cos based on index to generate stable "random-looking" numbers
          const seed = i + 1
          const simpleHash = (n) => Math.abs(Math.sin(n * 9999))

          const x = (i % 2 === 0 ? 1 : -1) * (simpleHash(seed) * 40 + 10)
          const y = (i % 3 === 0 ? 1 : -1) * (simpleHash(seed * 2) * 40 + 10)
          return (
            <motion.div
              key={i}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1, 1], opacity: [0, 1, 0] }}
              transition={{ repeat: Infinity, duration: 5, delay: delay, ease: "easeInOut" }}
              className="absolute top-1/2 left-1/2 w-4 h-4 bg-white rounded-full shadow-[0_0_15px_white]"
              style={{
                marginLeft: `${x}%`,
                marginTop: `${y}%`,
              }}
            >
              <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-xs font-bold text-white whitespace-nowrap border border-white/20">
                {isAr ? `قصة من ${country}` : `Story from ${country}`}
              </div>
            </motion.div>
          )
        })}
      </motion.div>

      {/* Content Overlay */}
      <div className="absolute z-20 text-center px-4 max-w-4xl mt-32 md:mt-0">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <span className="inline-block px-6 py-2 rounded-full bg-blue-600/20 border border-blue-500/50 text-blue-300 font-bold mb-6 backdrop-blur-md">
            {isAr ? '🌏 صوت المسافرين' : '🌏 Global Voices'}
          </span>
          <h1 className="text-5xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 mb-6 tracking-tighter drop-shadow-2xl">
            {isAr ? 'قصص سقطرى' : 'SOCOTRA STORIES'}
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 max-w-2xl mx-auto leading-relaxed">
            {isAr
              ? 'اكتشف الجزيرة من خلال تجارب حقيقية لمسافرين من جميع أنحاء العالم.'
              : 'Discover the island through authentic experiences from travelers around the globe.'}
          </p>
        </motion.div>
      </div>
    </div>
  )
}

// -----------------------------------------------------------------------------
// 🎥 Video Showcase
// -----------------------------------------------------------------------------
const VideoShowcase = ({ isAr, videos, onPlay }) => {
  return (
    <section className="py-20 bg-[#050505] relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <div className="flex justify-between items-end mb-12">
          <div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-2">
              {isAr ? 'تجارب بالفيديو' : 'Video Stories'}
            </h2>
            <div className="h-1 w-20 bg-blue-600 rounded-full" />
          </div>
        </div>

        <div className="flex gap-6 overflow-x-auto pb-8 scrollbar-hide snap-x">
          {(videos.length > 0 ? videos : [1, 2, 3]).map((v, i) => (
            <div key={i}
              className="min-w-[300px] md:min-w-[400px] snap-center aspect-[9/16] md:aspect-video rounded-3xl overflow-hidden relative group cursor-pointer border border-white/10 transform hover:scale-105 transition-all duration-500 shadow-2xl"
              onClick={() => v.videoUrl ? onPlay(v.videoUrl) : null}
            >
              <Image
                src={v.customerImage || `https://source.unsplash.com/random/800x600?nature,socotra&sig=${i}`}
                alt={getDisplayName(v, isAr)}
                fill
                className="object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-500"
                sizes="(min-width: 768px) 400px, 300px"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

              <div className="absolute bottom-0 left-0 p-6 w-full">
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center text-white">
                    ▶
                  </div>
                  <span className="text-white font-bold">{getDisplayName(v, isAr)}</span>
                </div>
                <p className="text-gray-300 text-sm line-clamp-2">
                  {getDisplayContent(v, isAr)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// -----------------------------------------------------------------------------
// 🧙‍♂️ Wizard Submission Modal
// -----------------------------------------------------------------------------
const SubmissionWizard = ({ isOpen, onClose, isAr }) => {
  const [step, setStep] = useState(1)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    nameAr: '',
    email: '',
    phone: '',
    country: '',
    countryAr: '',
    rating: 5,
    content: '',
    hasVideo: false,
    videoUrl: '',
    date: new Date().toISOString().split('T')[0]
  })

  if (!isOpen) return null

  const isEmailValid = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  const isUrlValid = (value) => {
    try {
      new URL(value)
      return true
    } catch {
      return false
    }
  }
  const isContentValid = formData.content.trim().length > 0
  const isDetailsValid = formData.name.trim().length > 0
    && formData.nameAr.trim().length > 0
    && isEmailValid(formData.email.trim())
    && formData.phone.trim().length > 0
    && formData.country.trim().length > 0
    && formData.countryAr.trim().length > 0
    && formData.date
  const isVideoValid = !formData.hasVideo || (formData.videoUrl.trim().length > 0 && isUrlValid(formData.videoUrl.trim()))

  const nextStep = () => {
    if (step === 2 && (!isContentValid || !isVideoValid)) {
      if (!isContentValid) {
        setError(isAr ? 'يرجى كتابة القصة كاملة' : 'Please write your story')
        return
      }
      setError(isAr ? 'يرجى إدخال رابط فيديو صالح' : 'Please enter a valid video URL')
      return
    }
    setError('')
    setStep(s => s + 1)
  }
  const prevStep = () => {
    setError('')
    setStep(s => s - 1)
  }

  const handleSubmit = async () => {
    if (!isDetailsValid || !isContentValid) {
      setError(isAr ? 'يرجى تعبئة جميع الحقول المطلوبة' : 'Please fill all required fields')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      const res = await fetch('/api/testimonials', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: formData.name.trim(),
          customerNameAr: formData.nameAr.trim(),
          customerEmail: formData.email.trim(),
          customerPhone: formData.phone.trim(),
          country: formData.country.trim(),
          countryAr: formData.countryAr.trim(),
          rating: formData.rating,
          content: formData.content.trim(),
          contentAr: isAr ? formData.content.trim() : undefined,
          hasVideo: formData.hasVideo,
          videoUrl: formData.hasVideo ? formData.videoUrl.trim() : '',
          date: formData.date
        })
      })
      const result = await res.json()
      if (result.success) {
        onClose()
        alert(isAr ? 'شكراً! سيتم مراجعة تقييمك.' : 'Thank you! Your review is pending approval.')
      } else {
        alert('Submission failed. Please try again.')
      }
    } catch (e) {
      console.error(e)
      alert('Error submitting review')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
      >
        <div className="bg-white dark:bg-gray-900 rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-gray-100 dark:border-gray-800 relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            ✕
          </button>
          <div className="h-1 bg-gray-100 dark:bg-gray-800">
            <motion.div
              className="h-full bg-blue-600"
              initial={{ width: 0 }}
              animate={{ width: `${(step / 3) * 100}%` }}
            />
          </div>
          <div className="p-8">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
                  <h3 className="text-2xl font-bold mb-6 text-center dark:text-white">{isAr ? 'كيف كانت تجربتك؟' : 'How was your experience?'}</h3>
                  <div className="flex justify-center gap-2 mb-8">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button key={star} onClick={() => setFormData({ ...formData, rating: star })} className={`text-4xl transition-transform hover:scale-110 ${formData.rating >= star ? 'text-yellow-400' : 'text-gray-300'}`}>★</button>
                    ))}
                  </div>
                  <button onClick={nextStep} className="w-full py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700">{isAr ? 'التالي' : 'Next'}</button>
                </motion.div>
              )}
              {step === 2 && (
                <motion.div key="step2" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
                  <h3 className="text-2xl font-bold mb-4 text-center dark:text-white">{isAr ? 'اخبرنا قصتك' : 'Tell us your story'}</h3>
                  <textarea
                    value={formData.content}
                    onChange={e => setFormData({ ...formData, content: e.target.value })}
                    className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-800 border-none focus:ring-2 focus:ring-blue-500 min-h-[150px] mb-4 dark:text-white"
                    placeholder={isAr ? 'اكتب هنا...' : 'Write here...'}
                  />
                  <div className="flex items-center gap-3 mb-4">
                    <input
                      id="hasVideo"
                      type="checkbox"
                      checked={formData.hasVideo}
                      onChange={e => setFormData({ ...formData, hasVideo: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <label htmlFor="hasVideo" className="text-sm text-gray-600 dark:text-gray-300">
                      {isAr ? 'لدي فيديو للتجربة' : 'I have a video for this story'}
                    </label>
                  </div>
                  {formData.hasVideo && (
                    <input
                      type="text"
                      placeholder={isAr ? 'رابط الفيديو' : 'Video URL'}
                      className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 mb-4 border-none dark:text-white"
                      value={formData.videoUrl}
                      onChange={e => setFormData({ ...formData, videoUrl: e.target.value })}
                    />
                  )}
                  {error && (
                    <div className="text-red-500 text-sm mb-4 text-center">{error}</div>
                  )}
                  <div className="flex gap-4">
                    <button onClick={prevStep} className="flex-1 py-3 bg-gray-100 dark:bg-gray-800 rounded-xl font-bold dark:text-white">{isAr ? 'عودة' : 'Back'}</button>
                    <button onClick={nextStep} className="flex-1 py-3 bg-blue-600 text-white rounded-xl font-bold">{isAr ? 'التالي' : 'Next'}</button>
                  </div>
                </motion.div>
              )}
              {step === 3 && (
                <motion.div key="step3" initial={{ x: 20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -20, opacity: 0 }}>
                  <h3 className="text-2xl font-bold mb-4 text-center dark:text-white">{isAr ? 'بياناتك' : 'Your Details'}</h3>
                  <input
                    type="text"
                    placeholder={isAr ? 'الاسم (EN)' : 'Name (EN)'}
                    className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 mb-3 border-none dark:text-white"
                    value={formData.name}
                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder={isAr ? 'الاسم (AR)' : 'Name (AR)'}
                    className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 mb-3 border-none dark:text-white"
                    value={formData.nameAr}
                    onChange={e => setFormData({ ...formData, nameAr: e.target.value })}
                    dir="rtl"
                  />
                  <input
                    type="email"
                    placeholder={isAr ? 'البريد الإلكتروني' : 'Email'}
                    className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 mb-3 border-none dark:text-white"
                    value={formData.email}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder={isAr ? 'رقم الهاتف' : 'Phone Number'}
                    className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 mb-3 border-none dark:text-white"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder={isAr ? 'الدولة (EN)' : 'Country (EN)'}
                    className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 mb-3 border-none dark:text-white"
                    value={formData.country}
                    onChange={e => setFormData({ ...formData, country: e.target.value })}
                  />
                  <input
                    type="text"
                    placeholder={isAr ? 'الدولة (AR)' : 'Country (AR)'}
                    className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 mb-3 border-none dark:text-white"
                    value={formData.countryAr}
                    onChange={e => setFormData({ ...formData, countryAr: e.target.value })}
                    dir="rtl"
                  />
                  <input
                    type="date"
                    className="w-full p-3 rounded-xl bg-gray-50 dark:bg-gray-800 mb-4 border-none dark:text-white"
                    value={formData.date}
                    onChange={e => setFormData({ ...formData, date: e.target.value })}
                  />
                  {error && (
                    <div className="text-red-500 text-sm mb-4 text-center">{error}</div>
                  )}
                  <button onClick={handleSubmit} disabled={submitting} className="w-full py-3 bg-green-600 text-white rounded-xl font-bold shadow-lg shadow-green-600/30 hover:bg-green-700 disabled:opacity-50">
                    {submitting ? (isAr ? 'جاري الإرسال...' : 'Sending...') : (isAr ? 'إرسال التقييم' : 'Submit Review')}
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}

// -----------------------------------------------------------------------------
// 🧱 Main Component
// -----------------------------------------------------------------------------
export default function TestimonialsPage() {
  const { locale } = useApp()
  const isAr = locale === 'ar'
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedVideo, setSelectedVideo] = useState(null)
  const [showSubmission, setShowSubmission] = useState(false)
  const [filter, setFilter] = useState('ALL')
  const filters = [
    { id: 'ALL', label: { ar: 'الكل', en: 'All' } },
    { id: 'FEATURED', label: { ar: 'المميزة', en: 'Featured' } },
    { id: 'VERIFIED', label: { ar: 'موثقة', en: 'Verified' } },
    { id: 'VIDEO', label: { ar: 'فيديو', en: 'Video' } }
  ]

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch('/api/testimonials')
        const data = await res.json()
        if (data.success) {
          setReviews(data.data || [])
        }
      } catch (error) {
        console.error('Failed to fetch reviews', error)
      } finally {
        setLoading(false)
      }
    }
    fetchReviews()
  }, [])

  const filteredReviews = useMemo(() => {
    if (filter === 'ALL') return reviews
    if (filter === 'FEATURED') return reviews.filter((r) => r.featured)
    if (filter === 'VERIFIED') return reviews.filter((r) => r.verified)
    if (filter === 'VIDEO') return reviews.filter((r) => r.hasVideo)
    return reviews
  }, [filter, reviews])

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black font-sans text-gray-900 dark:text-white">
      <GlobeHero isAr={isAr} reviews={reviews} />

      <VideoShowcase
        isAr={isAr}
        videos={reviews.filter(r => r.hasVideo)}
        onPlay={setSelectedVideo}
      />

      <section className="py-20 container mx-auto px-4 max-w-7xl">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div>
            <h2 className="text-4xl font-bold mb-2 dark:text-white">{isAr ? 'قصص المسافرين' : 'Traveler Stories'}</h2>
            <p className="text-gray-500 dark:text-gray-400">{isAr ? 'أحدث التقييمات من زوارنا' : 'Latest reviews from our guests'}</p>
          </div>
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            {filters.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`px-6 py-3 rounded-full font-bold transition-all whitespace-nowrap ${filter === cat.id
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                  : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                  }`}
              >
                {cat.label[isAr ? 'ar' : 'en']}
              </button>
            ))}
          </div>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredReviews.map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="break-inside-avoid bg-white dark:bg-gray-900/50 backdrop-blur-md border border-gray-100 dark:border-gray-800 p-8 rounded-[2rem] shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group"
            >
              <div className="flex justify-between items-start mb-6">
                  <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-blue-500 to-purple-600 p-[2px]">
                    <div className="relative w-full h-full rounded-full bg-white dark:bg-gray-900 flex items-center justify-center font-bold text-lg overflow-hidden">
                      {review.customerImage ? (
                        <Image src={review.customerImage} alt={getDisplayName(review, isAr)} fill className="object-cover" sizes="48px" />
                      ) : (
                        getDisplayName(review, isAr)[0]
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-lg leading-tight group-hover:text-blue-500 transition-colors">{getDisplayName(review, isAr)}</h4>
                    <div className="text-sm text-gray-500 flex items-center gap-2">
                      <span>{getFlagEmoji(review.countryCode)}</span>
                      <span>{getDisplayCountry(review, isAr)}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex gap-1 text-yellow-400 mb-4 text-sm">
                {'★'.repeat(getRatingValue(review))}
              </div>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed italic relative z-10">
                &ldquo;{getDisplayContent(review, isAr)}&rdquo;
              </p>
              <div className="mt-6 pt-6 border-t border-gray-100 dark:border-gray-800 flex justify-between items-center text-sm text-gray-400">
                <span>{new Date(review.date || Date.now()).toLocaleDateString()}</span>
                {review.verified && (
                  <div className="flex items-center gap-1 text-green-500 text-xs font-bold">
                    <span className="bg-green-100 dark:bg-green-900/20 rounded-full p-1">✓</span>
                    {isAr ? 'تجربة موثقة' : 'Verified Trip'}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <motion.div
        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1 }}
        className="fixed bottom-8 right-8 z-40"
      >
        <button onClick={() => setShowSubmission(true)} className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full font-bold shadow-2xl hover:scale-110 transition-transform flex items-center gap-3">
          <span>✍️</span> {isAr ? 'شارك قصتك' : 'Share Story'}
        </button>
      </motion.div>

      <SubmissionWizard isOpen={showSubmission} onClose={() => setShowSubmission(false)} isAr={isAr} />

      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedVideo(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
          >
            <div className="w-full max-w-5xl aspect-video bg-black rounded-3xl overflow-hidden relative shadow-2xl border border-white/10">
              <iframe
                src={getVideoEmbedUrl(selectedVideo)}
                className="w-full h-full"
                allow="autoplay; encrypted-media"
                allowFullScreen
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
