'use client'

// ═══════════════════════════════════════════════════════════════════════
// 🏠 الصفحة الرئيسية - نسخة احترافية 100%
// ✅ دعم كامل للغات (عربي/English)
// ✅ دعم كامل للوضع الليلي (Dark Mode)
// ✅ RTL/LTR تلقائي
// ✅ ألوان متناسقة في كل الأوضاع
// ═══════════════════════════════════════════════════════════════════════

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useApp } from '@/contexts/AppContext'
import WhatsAppButton from '@/components/WhatsAppButton'
import TourCard from '@/components/TourCard'
import { getAllTours } from '@/data/tours-complete'

export default function HomePage() {
  // ✅ الحل: استخراج locale و isDark من useApp
  const { locale, isDark } = useApp()
  const [currentSlide, setCurrentSlide] = useState(0)
  const tours = getAllTours()

  // Hero Slides - مع دعم اللغتين
  const heroSlides = [
    {
      image: '/img/hero/socotra-1.jpg',
      title: {
        ar: 'اكتشف جنة سقطرى الخفية',
        en: 'Discover Socotra\'s Hidden Paradise'
      },
      subtitle: {
        ar: 'جالاباغوس المحيط الهندي',
        en: 'Galapagos of Indian Ocean'
      },
      description: {
        ar: 'استمتع بتجربة فريدة في أكثر جزيرة غرابة على وجه الأرض',
        en: 'Experience the world\'s most unique island adventure'
      }
    },
    {
      image: '/img/hero/socotra-2.jpg',
      title: {
        ar: 'مغامرات لا تُنسى',
        en: 'Unforgettable Adventures'
      },
      subtitle: {
        ar: 'تخييم تحت النجوم',
        en: 'Camping Under the Stars'
      },
      description: {
        ar: 'اقضِ ليالي سحرية تحت سماء سقطرى الصافية',
        en: 'Spend magical nights under Socotra\'s crystal clear skies'
      }
    },
    {
      image: '/img/hero/socotra-3.jpg',
      title: {
        ar: 'شواطئ بكر ومياه كريستالية',
        en: 'Pristine Beaches & Crystal Waters'
      },
      subtitle: {
        ar: 'جنة على الأرض',
        en: 'Paradise on Earth'
      },
      description: {
        ar: 'اسبح في أنقى مياه المحيط الهندي',
        en: 'Swim in the purest waters of the Indian Ocean'
      }
    }
  ]

  // Testimonials - مع دعم اللغتين
  const testimonials = [
    {
      name: {
        ar: 'سارة جونسون',
        en: 'Sarah Johnson'
      },
      country: {
        ar: 'الولايات المتحدة',
        en: 'United States'
      },
      rating: 5,
      text: {
        ar: 'رحلة لا تُنسى! سقطرى كانت مذهلة وفريق Hawari كان احترافياً للغاية. أشجار دم الأخوين كانت سريالية تماماً.',
        en: 'Unforgettable trip! Socotra was amazing and Hawari team was extremely professional. Dragon blood trees were absolutely surreal.'
      },
      image: '/img/testimonials/client-1.jpg'
    },
    {
      name: {
        ar: 'مايكل براون',
        en: 'Michael Brown'
      },
      country: {
        ar: 'بريطانيا',
        en: 'United Kingdom'
      },
      rating: 5,
      text: {
        ar: 'أفضل تجربة سياحية على الإطلاق! المرشدون كانوا رائعين والتخييم كان مريحاً جداً. سأعود بالتأكيد!',
        en: 'Best travel experience ever! The guides were fantastic and camping was so comfortable. Will definitely return!'
      },
      image: '/img/testimonials/client-2.jpg'
    },
    {
      name: {
        ar: 'إيميلي تشن',
        en: 'Emily Chen'
      },
      country: {
        ar: 'أستراليا',
        en: 'Australia'
      },
      rating: 5,
      text: {
        ar: 'جزيرة خيالية! كل يوم كان مليئاً بالمفاجآت الجميلة. الشواطئ والطبيعة لا توصف بكلمات.',
        en: 'Magical island! Every day was full of beautiful surprises. The beaches and nature are beyond words.'
      },
      image: '/img/testimonials/client-3.jpg'
    }
  ]

  // Auto slide every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [heroSlides.length])

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════
          Hero Section - مع دعم اللغات والوضع الليلي
          ═══════════════════════════════════════════════════════════════ */}

      <section className="relative h-screen min-h-[600px] overflow-hidden">
        {/* Background Images Slider */}
        {heroSlides.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              currentSlide === index ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <Image
              src={slide.image}
              alt={slide.title[locale]}
              fill
              className="object-cover"
              priority={index === 0}
              quality={90}
            />
            {/* Gradient Overlay - يتكيف مع الوضع الليلي */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent dark:from-black/80 dark:via-black/60 dark:to-black/40" />
          </div>
        ))}

        {/* Content */}
        <div className="relative h-full flex items-center z-20">
          <div className="container-custom">
            <div className="max-w-3xl">
              {/* Animated Badge */}
              <div className="inline-flex items-center gap-2 bg-white/20 dark:bg-white/10 backdrop-blur-md px-6 py-3 rounded-full mb-6 animate-fade-in">
                <span className="w-2 h-2 bg-green-400 dark:bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-white text-sm font-semibold">
                  {heroSlides[currentSlide].subtitle[locale]}
                </span>
              </div>

              {/* Main Title */}
              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-slide-in-right">
                {heroSlides[currentSlide].title[locale]}
              </h1>

              {/* Description */}
              <p className="text-xl md:text-2xl text-gray-200 dark:text-gray-300 mb-8 animate-slide-in-left">
                {heroSlides[currentSlide].description[locale]}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-4">
                <a
                  href="#tours"
                  className="btn btn-primary text-lg px-8 py-4 transform hover:scale-105 transition-all shadow-lg hover:shadow-xl"
                >
                  {locale === 'ar' ? 'استكشف الرحلات' : 'Explore Tours'}
                  <svg className={`w-5 h-5 ${locale === 'ar' ? 'mr-2' : 'ml-2'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                </a>
                <a
                  href="https://wa.me/967772371581"
                  className="btn btn-outline text-lg px-8 py-4 bg-white/10 backdrop-blur-md border-white text-white hover:bg-white hover:text-green-600 dark:hover:text-green-700 transform hover:scale-105 transition-all"
                >
                  <svg className={`w-6 h-6 ${locale === 'ar' ? 'ml-2' : 'mr-2'}`} fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  {locale === 'ar' ? 'تواصل معنا' : 'Contact Us'}
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Slider Indicators */}
        <div className="absolute bottom-8 right-1/2 translate-x-1/2 flex gap-3 z-20">
          {heroSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-1 rounded-full transition-all duration-300 ${
                currentSlide === index
                  ? 'w-12 bg-white'
                  : 'w-8 bg-white/50 hover:bg-white/75'
              }`}
              aria-label={`Slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce hidden md:block z-20">
          <div className="flex flex-col items-center gap-2 text-white">
            <span className="text-sm">{locale === 'ar' ? 'مرر للأسفل' : 'Scroll Down'}</span>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          Stats Section - مع دعم اللغات والوضع الليلي
          ═══════════════════════════════════════════════════════════════ */}

      <section className="py-20 bg-gradient-to-r from-green-500 via-emerald-600 to-teal-600 dark:from-green-700 dark:via-emerald-800 dark:to-teal-900 transition-colors">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-white text-center">
            <div className="animate-fade-in transform hover:scale-105 transition-transform">
              <div className="text-5xl md:text-6xl font-bold mb-2">700+</div>
              <div className="text-lg opacity-90">{locale === 'ar' ? 'نوع مستوطن' : 'Endemic Species'}</div>
              <div className="text-sm opacity-75 mt-1">{locale === 'ar' ? 'لا يوجد إلا في سقطرى' : 'Only in Socotra'}</div>
            </div>
            <div className="animate-fade-in transform hover:scale-105 transition-transform" style={{animationDelay: '0.1s'}}>
              <div className="text-5xl md:text-6xl font-bold mb-2">37%</div>
              <div className="text-lg opacity-90">{locale === 'ar' ? 'نباتات فريدة' : 'Unique Plants'}</div>
              <div className="text-sm opacity-75 mt-1">{locale === 'ar' ? 'من إجمالي النباتات' : 'Of total plants'}</div>
            </div>
            <div className="animate-fade-in transform hover:scale-105 transition-transform" style={{animationDelay: '0.2s'}}>
              <div className="text-5xl md:text-6xl font-bold mb-2">5000+</div>
              <div className="text-lg opacity-90">{locale === 'ar' ? 'سائح سعيد' : 'Happy Tourists'}</div>
              <div className="text-sm opacity-75 mt-1">{locale === 'ar' ? 'من جميع أنحاء العالم' : 'From around the world'}</div>
            </div>
            <div className="animate-fade-in transform hover:scale-105 transition-transform" style={{animationDelay: '0.3s'}}>
              <div className="text-5xl md:text-6xl font-bold mb-2">10+</div>
              <div className="text-lg opacity-90">{locale === 'ar' ? 'سنوات خبرة' : 'Years Experience'}</div>
              <div className="text-sm opacity-75 mt-1">{locale === 'ar' ? 'في السياحة المحلية' : 'In local tourism'}</div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          About Section - مع دعم اللغات والوضع الليلي
          ═══════════════════════════════════════════════════════════════ */}

      <section className="py-20 bg-white dark:bg-gray-900 transition-colors">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Image */}
<div className="relative group">
  <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
    {/* ✅ الصورة الحقيقية بدل الـ Placeholder */}
    <Image
      src="/img/about/socotra-nature.jpg"
      alt={locale === 'ar' ? 'طبيعة سقطرى' : 'Socotra Nature'}
      fill
      className="object-cover"
      priority={false}
      quality={90}
      sizes="(max-width: 1024px) 100vw, 50vw"
    />

    {/* Hover Overlay */}
    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
  </div>

  {/* Floating Card */}
  <div className="absolute -bottom-8 -left-8 bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl max-w-xs transform group-hover:scale-105 transition-all">
    <div className="flex items-center gap-4">
      <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-emerald-600 rounded-full flex items-center justify-center">
        <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div>
        <div className="text-2xl font-bold text-gray-900 dark:text-white">100%</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">
          {locale === 'ar' ? 'رضا العملاء' : 'Customer Satisfaction'}
        </div>
      </div>
    </div>
  </div>
</div>


            {/* Content */}
            <div>
              <div className="inline-block px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-semibold mb-4">
                {locale === 'ar' ? 'من نحن' : 'About Us'}
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                {locale === 'ar' ? 'بوابتك لاكتشاف' : 'Your Gateway to Discover'}
                <span className="text-gradient bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                  {' '}{locale === 'ar' ? 'جنة سقطرى' : 'Socotra Paradise'}
                </span>
              </h2>

              <p className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed mb-6">
                {locale === 'ar'
                  ? 'حواري للسياحة والسفر هي وكالة سياحية محلية متخصصة في تنظيم رحلات استكشافية إلى جزيرة سقطرى. مع أكثر من 10 سنوات من الخبرة، نقدم تجارب سياحية أصيلة وآمنة تجمع بين المغامرة والراحة.'
                  : 'Hawari Tours is a local travel agency specialized in organizing exploration trips to Socotra Island. With over 10 years of experience, we provide authentic and safe tourism experiences combining adventure and comfort.'}
              </p>

              {/* Features */}
              <div className="space-y-4 mb-8">
                {[
                  {
                    ar: 'مرشدون محليون محترفون',
                    en: 'Professional Local Guides',
                    desc_ar: 'خبراء في الجزيرة يتحدثون الإنجليزية بطلاقة',
                    desc_en: 'Island experts fluent in English'
                  },
                  {
                    ar: 'معدات تخييم عالية الجودة',
                    en: 'High-Quality Camping Equipment',
                    desc_ar: 'خيام مريحة ومعدات احترافية للمغامرة',
                    desc_en: 'Comfortable tents and professional adventure gear'
                  },
                  {
                    ar: 'أسعار شفافة وعادلة',
                    en: 'Transparent & Fair Pricing',
                    desc_ar: 'بدون رسوم خفية - كل شيء واضح منذ البداية',
                    desc_en: 'No hidden fees - everything clear from the start'
                  }
                ].map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-3 transform hover:translate-x-2 transition-transform"
                  >
                    <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <div className="font-semibold text-gray-900 dark:text-white">
                        {locale === 'ar' ? feature.ar : feature.en}
                      </div>
                      <div className="text-gray-600 dark:text-gray-400">
                        {locale === 'ar' ? feature.desc_ar : feature.desc_en}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                href="/about"
                className="btn btn-primary inline-flex items-center gap-2 transform hover:scale-105 transition-all"
              >
                {locale === 'ar' ? 'اعرف المزيد' : 'Learn More'}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={locale === 'ar' ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          Tours Section - مع دعم اللغات والوضع الليلي
          ═══════════════════════════════════════════════════════════════ */}

      <section id="tours" className="py-20 bg-gray-50 dark:bg-gray-800 transition-colors">
        <div className="container-custom">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-semibold mb-4">
              {locale === 'ar' ? 'رحلاتنا' : 'Our Tours'}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {locale === 'ar' ? 'استكشف' : 'Explore'}{' '}
              <span className="text-gradient bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                {locale === 'ar' ? 'أفضل الرحلات' : 'Best Tours'}
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {locale === 'ar'
                ? 'اختر من بين مجموعة متنوعة من الرحلات المصممة خصيصاً لتناسب جميع الأذواق والميزانيات'
                : 'Choose from a variety of tours specially designed to suit all tastes and budgets'}
            </p>
          </div>

          {/* Tours Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tours.slice(0, 6).map((tour) => (
              <TourCard key={tour.id} tour={tour} />
            ))}
          </div>

          {/* View All Button */}
          <div className="text-center mt-12">
            <Link
              href="/tours"
              className="btn btn-outline inline-flex items-center gap-2 transform hover:scale-105 transition-all"
            >
              {locale === 'ar' ? 'عرض جميع الرحلات' : 'View All Tours'}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={locale === 'ar' ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          Testimonials Section - مع دعم اللغات والوضع الليلي
          ═══════════════════════════════════════════════════════════════ */}

      <section className="py-20 bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-900 dark:to-gray-800 transition-colors">
        <div className="container-custom">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-block px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full text-sm font-semibold mb-4">
              {locale === 'ar' ? 'آراء العملاء' : 'Client Testimonials'}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {locale === 'ar' ? 'ماذا يقول' : 'What Our'}{' '}
              <span className="text-gradient bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                {locale === 'ar' ? 'عملاؤنا' : 'Clients Say'}
              </span>
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2"
              >
                {/* Stars */}
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="w-5 h-5 text-yellow-400 dark:text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                    </svg>
                  ))}
                </div>

                {/* Text */}
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-6 italic relative">
                  <span className="text-4xl text-green-500 dark:text-green-400 opacity-20 absolute -top-2 -left-2">"</span>
                  {testimonial.text[locale]}
                  <span className="text-4xl text-green-500 dark:text-green-400 opacity-20 absolute -bottom-6 -right-2">"</span>
                </p>

                {/* Author */}
                <div className="flex items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-green-400 to-blue-500 flex items-center justify-center text-white text-xl font-bold">
                    {testimonial.name[locale].charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 dark:text-white">
                      {testimonial.name[locale]}
                    </div>
                    <div className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      {testimonial.country[locale]}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          CTA Section - مع دعم اللغات والوضع الليلي
          ═══════════════════════════════════════════════════════════════ */}

      <section className="relative py-32 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-gradient-to-r from-green-900/95 to-blue-900/95 dark:from-green-950/98 dark:to-blue-950/98"></div>

        {/* Animated Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-pattern-dots"></div>
        </div>

        {/* Content */}
        <div className="relative container-custom text-center z-10">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            {locale === 'ar' ? 'هل أنت جاهز لمغامرة العمر؟' : 'Ready for the Adventure of a Lifetime?'}
          </h2>

          <p className="text-xl text-gray-200 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            {locale === 'ar'
              ? 'احجز رحلتك إلى سقطرى الآن واستعد لتجربة لن تنساها أبداً!'
              : 'Book your Socotra trip now and get ready for an unforgettable experience!'}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 justify-center">
            <Link
              href="/tours"
              className="btn btn-primary text-lg px-8 py-4 bg-white text-green-600 hover:bg-gray-100 dark:hover:bg-gray-200 transform hover:scale-105 transition-all shadow-2xl"
            >
              {locale === 'ar' ? 'اختر رحلتك' : 'Choose Your Tour'}
            </Link>

            <a
              href="https://wa.me/967772371581"
              className="btn btn-outline text-lg px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-green-600 dark:hover:text-green-700 inline-flex items-center gap-2 transform hover:scale-105 transition-all"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
              </svg>
              {locale === 'ar' ? 'تواصل عبر واتساب' : 'Contact on WhatsApp'}
            </a>
          </div>

          {/* Trust Badges */}
          <div className="mt-12 flex flex-wrap justify-center gap-8 text-white/80">
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{locale === 'ar' ? 'مرخص رسمياً' : 'Officially Licensed'}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              <span>{locale === 'ar' ? '5000+ عميل سعيد' : '5000+ Happy Clients'}</span>
            </div>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>{locale === 'ar' ? 'حجز آمن' : 'Secure Booking'}</span>
            </div>
          </div>
        </div>
      </section>

      <WhatsAppButton />
    </>
  )
}