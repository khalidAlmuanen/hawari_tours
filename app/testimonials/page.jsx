'use client'

// ═══════════════════════════════════════════════════════════════════════
// ⭐ Testimonials Page - ENHANCED VERSION (تحسين ميه بالميه)
// ✨ Features: Better stats, advanced filters, verified badges, video reviews
// ═══════════════════════════════════════════════════════════════════════

import { useState } from 'react'
import { useApp } from '@/contexts/AppContext'
import WhatsAppButton from '@/components/WhatsAppButton'

export default function TestimonialsPage() {
  const { locale, isDark } = useApp()
  const isAr = locale === 'ar'

  const [activeFilter, setActiveFilter] = useState('all') // all, 5star, recent, verified
  const [expandedReviews, setExpandedReviews] = useState({})
  const [showVideoModal, setShowVideoModal] = useState(false)

  // Sample Testimonials Data (يمكن نقله لملف منفصل)
  const testimonials = [
    {
      id: 1,
      name: { ar: 'جون سميث', en: 'John Smith' },
      country: { ar: 'الولايات المتحدة', en: 'USA' },
      countryCode: 'US',
      rating: 5,
      date: '2024-02-01',
      tour: { ar: 'مغامرة سقطرى الكاملة', en: 'Complete Socotra Adventure' },
      review: {
        ar: 'تجربة لا تُنسى! سقطرى مكان سحري حقاً. الفريق محترف جداً والمرشدون لديهم معرفة عميقة بالجزيرة. التنظيم كان ممتازاً من البداية للنهاية. أنصح به بشدة!',
        en: 'Unforgettable experience! Socotra is truly a magical place. The team is very professional and the guides have deep knowledge of the island. Organization was excellent from start to finish. Highly recommend!'
      },
      verified: true,
      hasVideo: false
    },
    {
      id: 2,
      name: { ar: 'سارة جونسون', en: 'Sarah Johnson' },
      country: { ar: 'كندا', en: 'Canada' },
      countryCode: 'CA',
      rating: 5,
      date: '2024-01-28',
      tour: { ar: 'رحلة بيئية', en: 'Eco Tour' },
      review: {
        ar: 'أفضل رحلة في حياتي! المناظر الطبيعية خيالية والفريق رائع. اهتمامهم بالبيئة والثقافة المحلية كان واضحاً. شكراً لكم على هذه التجربة الرائعة!',
        en: 'Best trip of my life! The landscapes are surreal and the team is amazing. Their attention to environment and local culture was evident. Thank you for this wonderful experience!'
      },
      verified: true,
      hasVideo: true
    },
    {
      id: 3,
      name: { ar: 'محمد علي', en: 'Mohammed Ali' },
      country: { ar: 'الإمارات', en: 'UAE' },
      countryCode: 'AE',
      rating: 5,
      date: '2024-01-25',
      tour: { ar: 'رحلة عائلية', en: 'Family Tour' },
      review: {
        ar: 'رحلة مثالية للعائلة! أطفالي أحبوا كل لحظة. الأمان والراحة كانا أولوية. المرشدون صبورون ومتعاونون جداً. تجربة رائعة لجميع أفراد العائلة.',
        en: 'Perfect family trip! My kids loved every moment. Safety and comfort were priorities. Guides were very patient and cooperative. Wonderful experience for the whole family.'
      },
      verified: true,
      hasVideo: false
    },
    {
      id: 4,
      name: { ar: 'إيميلي براون', en: 'Emily Brown' },
      country: { ar: 'المملكة المتحدة', en: 'UK' },
      countryCode: 'GB',
      rating: 5,
      date: '2024-01-20',
      tour: { ar: 'جولة التصوير', en: 'Photography Tour' },
      review: {
        ar: 'كمصورة محترفة، كانت هذه الرحلة حلماً تحقق. كل زاوية في سقطرى تستحق التصوير. المرشدون عرفوا أفضل الأوقات والأماكن للتصوير. عدت بمئات الصور الرائعة!',
        en: 'As a professional photographer, this trip was a dream come true. Every corner of Socotra is worth capturing. Guides knew the best times and places for photography. Returned with hundreds of amazing photos!'
      },
      verified: true,
      hasVideo: true
    },
    {
      id: 5,
      name: { ar: 'لوكاس مولر', en: 'Lucas Müller' },
      country: { ar: 'ألمانيا', en: 'Germany' },
      countryCode: 'DE',
      rating: 5,
      date: '2024-01-15',
      tour: { ar: 'مغامرة التخييم', en: 'Camping Adventure' },
      review: {
        ar: 'تجربة تخييم استثنائية! النوم تحت النجوم في سقطرى كان رائعاً. المعدات كانت ممتازة والطعام لذيذ. الفريق جعل كل شيء سهلاً ومريحاً.',
        en: 'Exceptional camping experience! Sleeping under the stars in Socotra was amazing. Equipment was excellent and food delicious. Team made everything easy and comfortable.'
      },
      verified: true,
      hasVideo: false
    },
    {
      id: 6,
      name: { ar: 'ماريا غارسيا', en: 'Maria Garcia' },
      country: { ar: 'إسبانيا', en: 'Spain' },
      countryCode: 'ES',
      rating: 5,
      date: '2024-01-10',
      tour: { ar: 'جولة ثقافية', en: 'Cultural Tour' },
      review: {
        ar: 'تعرفت على ثقافة سقطرى الغنية بشكل عميق. اللقاء مع السكان المحليين والتعرف على تقاليدهم كان تجربة لا تُنسى. شكراً للفريق على هذه الرحلة الرائعة!',
        en: 'Deeply learned about Socotra\'s rich culture. Meeting locals and learning their traditions was unforgettable. Thanks to the team for this wonderful journey!'
      },
      verified: true,
      hasVideo: false
    }
  ]

  // Statistics
  const stats = [
    {
      number: '500+',
      label: { ar: 'عميل سعيد', en: 'Happy Clients' },
      icon: '😊',
      gradient: 'from-blue-500 to-indigo-600'
    },
    {
      number: '4.9/5',
      label: { ar: 'متوسط التقييم', en: 'Average Rating' },
      icon: '⭐',
      gradient: 'from-yellow-500 to-orange-600'
    },
    {
      number: '98%',
      label: { ar: 'نسبة الرضا', en: 'Satisfaction Rate' },
      icon: '👍',
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      number: '100%',
      label: { ar: 'آراء موثقة', en: 'Verified Reviews' },
      icon: '✓',
      gradient: 'from-purple-500 to-pink-600'
    }
  ]

  // Filter testimonials
  const filteredTestimonials = testimonials.filter(t => {
    if (activeFilter === 'all') return true
    if (activeFilter === '5star') return t.rating === 5
    if (activeFilter === 'recent') return new Date(t.date) > new Date('2024-01-20')
    if (activeFilter === 'verified') return t.verified
    return true
  }).sort((a, b) => new Date(b.date) - new Date(a.date))

  // Get flag emoji
  const getFlagEmoji = (countryCode) => {
    const codePoints = countryCode.toUpperCase().split('').map(char => 127397 + char.charCodeAt())
    return String.fromCodePoint(...codePoints)
  }

  // Toggle review expansion
  const toggleExpand = (id) => {
    setExpandedReviews(prev => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Hero Section */}
      <section className="relative py-20 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-600">
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 animate-pulse" style={{
              backgroundImage: 'radial-gradient(circle at 30% 70%, rgba(255,255,255,0.2) 0%, transparent 50%), radial-gradient(circle at 70% 30%, rgba(255,255,255,0.2) 0%, transparent 50%)'
            }}></div>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-10 container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full mb-6 animate-fade-in">
              <svg className="w-5 h-5 text-yellow-300" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-white font-semibold">
                {isAr ? 'تقييمات حقيقية من عملاء حقيقيين' : 'Real Reviews from Real Travelers'}
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-slide-in-up">
              {isAr ? 'آراء عملائنا' : 'Client Testimonials'}
            </h1>

            <p className="text-xl text-white/90 max-w-2xl mx-auto animate-slide-in-up" style={{animationDelay: '0.1s'}}>
              {isAr 
                ? 'اقرأ تجارب مسافرينا واكتشف لماذا نحن الخيار الأفضل لرحلتك إلى سقطرى'
                : 'Read our travelers\' experiences and discover why we\'re the best choice for your Socotra journey'}
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center transform hover:scale-105 transition-all animate-fade-in`}
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="text-5xl mb-3">{stat.icon}</div>
                <div className="text-4xl font-bold text-white mb-2">{stat.number}</div>
                <div className="text-sm text-white/80">{stat.label[locale]}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 shadow-md">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {filteredTestimonials.length} {isAr ? 'تقييم' : 'Reviews'}
            </h2>

            <div className="flex flex-wrap gap-3">
              {[
                { id: 'all', label: { ar: 'الكل', en: 'All' }, icon: '📋' },
                { id: '5star', label: { ar: '5 نجوم', en: '5 Stars' }, icon: '⭐' },
                { id: 'recent', label: { ar: 'الأحدث', en: 'Recent' }, icon: '🆕' },
                { id: 'verified', label: { ar: 'موثقة', en: 'Verified' }, icon: '✓' }
              ].map(filter => (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all flex items-center gap-2 ${
                    activeFilter === filter.id
                      ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg scale-105'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  <span>{filter.icon}</span>
                  <span>{filter.label[locale]}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Grid */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredTestimonials.map((testimonial, index) => {
              const isExpanded = expandedReviews[testimonial.id]
              const review = testimonial.review[locale]
              const shouldTruncate = review.length > 150
              const displayReview = shouldTruncate && !isExpanded ? review.substring(0, 150) + '...' : review

              return (
                <div
                  key={testimonial.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 animate-fade-in"
                  style={{animationDelay: `${index * 0.05}s`}}
                >
                  {/* Header with Gradient */}
                  <div className="h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500"></div>

                  <div className="p-6">
                    {/* Profile */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3">
                        {/* Avatar */}
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center text-white font-bold text-xl flex-shrink-0 ring-4 ring-purple-100 dark:ring-purple-900/30">
                          {testimonial.name[locale].charAt(0)}
                        </div>

                        {/* Name & Country */}
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white">
                            {testimonial.name[locale]}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                            <span className="text-lg">{getFlagEmoji(testimonial.countryCode)}</span>
                            <span>{testimonial.country[locale]}</span>
                          </div>
                        </div>
                      </div>

                      {/* Video Badge */}
                      {testimonial.hasVideo && (
                        <button className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center hover:bg-red-600 transition-colors">
                          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M6.3 2.841A1.5 1.5 0 004 4.11V15.89a1.5 1.5 0 002.3 1.269l9.344-5.89a1.5 1.5 0 000-2.538L6.3 2.84z" />
                          </svg>
                        </button>
                      )}
                    </div>

                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`w-5 h-5 ${i < testimonial.rating ? 'text-yellow-400' : 'text-gray-300 dark:text-gray-600'}`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>

                    {/* Tour Name */}
                    <div className="mb-4 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-100 dark:border-purple-800">
                      <p className="text-sm text-purple-700 dark:text-purple-300 font-semibold">
                        📍 {testimonial.tour[locale]}
                      </p>
                    </div>

                    {/* Review Text */}
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
                      "{displayReview}"
                    </p>

                    {/* Read More */}
                    {shouldTruncate && (
                      <button
                        onClick={() => toggleExpand(testimonial.id)}
                        className="text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 font-semibold text-sm flex items-center gap-2 mb-4"
                      >
                        {isExpanded ? (isAr ? 'عرض أقل' : 'Show Less') : (isAr ? 'اقرأ المزيد' : 'Read More')}
                        <svg className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    )}

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                      <div className="text-xs text-gray-500 dark:text-gray-500">
                        {new Date(testimonial.date).toLocaleDateString(isAr ? 'ar-SA' : 'en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>

                      {testimonial.verified && (
                        <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-xs font-semibold">
                          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          {isAr ? 'موثق' : 'Verified'}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-600 via-pink-600 to-orange-600 text-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {isAr ? 'جاهز لتجربتك الخاصة؟' : 'Ready for Your Own Experience?'}
          </h2>

          <p className="text-xl mb-8 opacity-90">
            {isAr 
              ? 'انضم إلى مئات المسافرين السعداء واحجز رحلتك إلى سقطرى اليوم'
              : 'Join hundreds of happy travelers and book your Socotra journey today'}
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="/tours"
              className="bg-white text-purple-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl"
            >
              {isAr ? 'تصفح الرحلات' : 'Browse Tours'}
            </a>

            <a
              href="/contact"
              className="border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-purple-600 transition-all transform hover:scale-105"
            >
              {isAr ? 'تواصل معنا' : 'Contact Us'}
            </a>
          </div>
        </div>
      </section>

      <WhatsAppButton />
    </div>
  )
}