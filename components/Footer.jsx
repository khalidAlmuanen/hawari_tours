'use client'

// ═══════════════════════════════════════════════════════════════════════
// 🦶 Ultra-Modern Professional Footer - Hawari Tours
// تصميم احترافي جداً وعصري ومبهر
// ═══════════════════════════════════════════════════════════════════════

import Link from 'next/link'
import { useState } from 'react'
import { useApp } from '@/contexts/AppContext'

export default function Footer() {
  const { t, locale, isRTL } = useApp()
  const currentYear = new Date().getFullYear()
  const [email, setEmail] = useState('')

  const handleNewsletterSubmit = (e) => {
    e.preventDefault()
    // Newsletter logic here
    alert(locale === 'ar' ? 'شكراً للاشتراك!' : 'Thanks for subscribing!')
    setEmail('')
  }

  const footerSections = {
    company: {
      title: locale === 'ar' ? 'الشركة' : 'Company',
      links: [
        { href: '/about', label: locale === 'ar' ? 'عن سقطرى' : 'About Socotra', icon: '🌴' },
        { href: '/history', label: locale === 'ar' ? 'التاريخ' : 'History', icon: '🏛️' },
        { href: '/unique-features', label: locale === 'ar' ? 'الميزات الفريدة' : 'Unique Features', icon: '🌟' },
        { href: '/reports', label: locale === 'ar' ? 'التقارير' : 'Reports', icon: '📊' },
      ]
    },
    tours: {
      title: locale === 'ar' ? 'الرحلات' : 'Tours',
      links: [
        { href: '/tours', label: locale === 'ar' ? 'جميع الرحلات' : 'All Tours', icon: '✈️' },
        { href: '/travel-guide', label: locale === 'ar' ? 'دليل السفر' : 'Travel Guide', icon: '📚' },
        { href: '/testimonials', label: locale === 'ar' ? 'آراء العملاء' : 'Testimonials', icon: '⭐' },
      ]
    },
    media: {
      title: locale === 'ar' ? 'الإعلام' : 'Media',
      links: [
        { href: '/gallery', label: locale === 'ar' ? 'معرض الصور' : 'Gallery', icon: '📸' },
        { href: '/blog', label: locale === 'ar' ? 'المدونة' : 'Blog', icon: '📝' },
        { href: '/news', label: locale === 'ar' ? 'الأخبار' : 'News', icon: '📰' },
      ]
    },
    legal: {
      title: locale === 'ar' ? 'قانوني' : 'Legal',
      links: [
        { href: '/privacy', label: locale === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy', icon: '🔒' },
        { href: '/terms', label: locale === 'ar' ? 'الشروط والأحكام' : 'Terms & Conditions', icon: '📜' },
        { href: '/contact', label: locale === 'ar' ? 'اتصل بنا' : 'Contact Us', icon: '📞' },
      ]
    }
  }

  const socialMedia = [
    {
      name: 'Facebook',
      href: 'https://facebook.com/hawaritours',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      color: 'from-blue-600 to-blue-700'
    },
    {
      name: 'Instagram',
      href: 'https://instagram.com/hawaritours',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
      color: 'from-pink-600 via-purple-600 to-orange-500'
    },
    {
      name: 'Twitter',
      href: 'https://twitter.com/hawaritours',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
      color: 'from-gray-900 to-gray-700 dark:from-gray-100 dark:to-gray-300'
    },
    {
      name: 'WhatsApp',
      href: 'https://wa.me/967772371581',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      ),
      color: 'from-green-600 to-green-700'
    },
    {
      name: 'YouTube',
      href: 'https://youtube.com/@hawaritours',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      ),
      color: 'from-red-600 to-red-700'
    },
    {
      name: 'TikTok',
      href: 'https://tiktok.com/@hawaritours',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
        </svg>
      ),
      color: 'from-gray-900 via-pink-600 to-cyan-500'
    }
  ]

  const quickStats = [
    { number: '500+', label: locale === 'ar' ? 'مسافر سعيد' : 'Happy Travelers', icon: '😊' },
    { number: '50+', label: locale === 'ar' ? 'رحلة ناجحة' : 'Successful Tours', icon: '✈️' },
    { number: '15+', label: locale === 'ar' ? 'سنوات خبرة' : 'Years Experience', icon: '⭐' },
    { number: '100%', label: locale === 'ar' ? 'رضا العملاء' : 'Satisfaction', icon: '💯' }
  ]

  return (
    <footer className="relative bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950 border-t border-gray-200 dark:border-gray-800 transition-colors">
      {/* Decorative top wave */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-green-500 to-transparent"></div>

      {/* ═══════════════════════════════════════════════════════
          Quick Stats Banner
          ═══════════════════════════════════════════════════════ */}
      <div className="border-b border-gray-200 dark:border-gray-800 bg-gradient-to-r from-green-50 via-emerald-50 to-teal-50 dark:from-green-900/20 dark:via-emerald-900/20 dark:to-teal-900/20">
        <div className="container mx-auto px-4 max-w-7xl py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {quickStats.map((stat, index) => (
              <div key={index} className="text-center group">
                <div className="text-4xl mb-2 transform group-hover:scale-110 transition-transform">{stat.icon}</div>
                <div className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-1">
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          Main Footer Content
          ═══════════════════════════════════════════════════════ */}
      <div className="container mx-auto px-4 max-w-7xl py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12">
          {/* ═══════ Brand Section (Larger) ═══════ */}
          <div className="lg:col-span-5">
            <Link href="/" className="inline-flex items-center gap-3 mb-6 group">
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-green-400 to-emerald-600 rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
                
                {/* Logo */}
                <div className="relative w-16 h-16 bg-gradient-to-br from-green-500 via-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center shadow-2xl transform group-hover:scale-110 group-hover:rotate-6 transition-all">
                  <svg className="w-9 h-9 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
              </div>

              <div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600 bg-clip-text text-transparent">
                  Hawari Tours
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">
                  {locale === 'ar' ? '✨ جنة سقطرى' : '✨ Socotra Paradise'}
                </p>
              </div>
            </Link>

            <p className="text-gray-600 dark:text-gray-400 leading-relaxed mb-8 text-lg">
              {locale === 'ar'
                ? 'نقدم أفضل تجارب السفر في جزيرة سقطرى مع مرشدين محترفين وخدمات متميزة. اكتشف جمال الطبيعة الخلابة معنا.'
                : 'We provide the best travel experiences in Socotra Island with professional guides and premium services. Discover stunning nature with us.'}
            </p>

            {/* Contact Cards */}
            <div className="space-y-4">
              <a
                href="tel:+967772371581"
                className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl hover:shadow-lg transition-all group border border-green-100 dark:border-green-900/30"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-500 mb-1">
                    {locale === 'ar' ? 'اتصل بنا' : 'Call Us'}
                  </div>
                  <div className="font-bold text-gray-900 dark:text-white" dir="ltr">
                    +967 772 371 581
                  </div>
                </div>
              </a>

              <a
                href="mailto:info@hawari.tours"
                className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl hover:shadow-lg transition-all group border border-blue-100 dark:border-blue-900/30"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg transform group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div className="text-xs text-gray-500 dark:text-gray-500 mb-1">
                    {locale === 'ar' ? 'راسلنا' : 'Email Us'}
                  </div>
                  <div className="font-bold text-gray-900 dark:text-white">
                    info@hawari.tours
                  </div>
                </div>
              </a>
            </div>
          </div>

          {/* ═══════ Links Sections ═══════ */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {Object.values(footerSections).map((section, index) => (
                <div key={index}>
                  <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                    <span className="w-1 h-6 bg-gradient-to-b from-green-500 to-emerald-600 rounded-full"></span>
                    {section.title}
                  </h4>
                  <ul className="space-y-3">
                    {section.links.map((link, linkIndex) => (
                      <li key={linkIndex}>
                        <Link
                          href={link.href}
                          className="group flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-all"
                        >
                          <span className="text-sm">{link.icon}</span>
                          <span className="group-hover:translate-x-1 transition-transform">
                            {link.label}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════
            Newsletter Section
            ═══════════════════════════════════════════════════════ */}
        <div className="mt-16 pt-12 border-t border-gray-200 dark:border-gray-800">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-green-500 via-emerald-600 to-teal-600 rounded-3xl p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
              {/* Decorative circles */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2 blur-3xl"></div>

              <div className="relative z-10">
                <div className="text-center mb-8">
                  <div className="text-5xl mb-4">📬</div>
                  <h3 className="text-3xl font-bold mb-3">
                    {locale === 'ar' ? 'اشترك في نشرتنا البريدية' : 'Subscribe to Our Newsletter'}
                  </h3>
                  <p className="text-white/90 text-lg">
                    {locale === 'ar'
                      ? 'احصل على أحدث العروض والنصائح مباشرة إلى بريدك'
                      : 'Get latest offers and tips directly to your inbox'}
                  </p>
                </div>

                <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto">
                  <div className="flex gap-3">
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder={locale === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
                      required
                      className="flex-1 px-6 py-4 bg-white/20 backdrop-blur-md border-2 border-white/30 rounded-2xl text-white placeholder-white/60 focus:bg-white/30 focus:border-white/50 outline-none transition-all text-lg"
                    />
                    <button
                      type="submit"
                      className="px-8 py-4 bg-white text-green-600 rounded-2xl font-bold hover:bg-gray-100 transition-all transform hover:scale-105 shadow-xl flex items-center gap-2"
                    >
                      <span>{locale === 'ar' ? 'اشترك' : 'Subscribe'}</span>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isRTL ? "M15 19l-7-7 7-7" : "M9 5l7 7-7 7"} />
                      </svg>
                    </button>
                  </div>

                  <p className="text-center text-white/70 text-sm mt-4">
                    {locale === 'ar' ? '✓ لا بريد مزعج • يمكنك إلغاء الاشتراك في أي وقت' : '✓ No spam • Unsubscribe anytime'}
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════
            Social Media Section
            ═══════════════════════════════════════════════════════ */}
        <div className="mt-12">
          <div className="text-center mb-8">
            <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
              {locale === 'ar' ? 'تابعنا على' : 'Follow Us'}
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              {locale === 'ar' ? 'كن جزءاً من مجتمعنا' : 'Be part of our community'}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {socialMedia.map((social) => (
              <a
                key={social.name}
                href={social.href}
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative w-14 h-14 bg-gradient-to-br ${social.color} rounded-2xl flex items-center justify-center text-white shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 overflow-hidden`}
                aria-label={social.name}
              >
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                {/* Icon */}
                <div className="relative z-10 transform group-hover:scale-110 transition-transform">
                  {social.icon}
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* ═══════════════════════════════════════════════════════
          Bottom Bar
          ═══════════════════════════════════════════════════════ */}
      <div className="border-t border-gray-200 dark:border-gray-800 bg-gradient-to-r from-gray-50 via-white to-gray-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="container mx-auto px-4 max-w-7xl py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            {/* Copyright */}
            <div className="text-center md:text-left">
              <p className="text-gray-600 dark:text-gray-400 font-medium mb-1">
                © {currentYear} Hawari Tours. {locale === 'ar' ? 'جميع الحقوق محفوظة' : 'All rights reserved'}.
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-500 flex items-center justify-center md:justify-start gap-1">
                {locale === 'ar' ? 'صُنع بـ' : 'Made with'}
                <span className="text-red-500 animate-pulse">❤️</span>
                {locale === 'ar' ? 'في اليمن' : 'in Yemen'}
                <span className="ml-2">🇾🇪</span>
              </p>
            </div>

            {/* Legal Links */}
            <div className="flex items-center gap-6 text-sm">
              <Link href="/privacy" className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors font-medium">
                {locale === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
              </Link>
              <span className="text-gray-400">•</span>
              <Link href="/terms" className="text-gray-600 dark:text-gray-400 hover:text-green-600 dark:hover:text-green-400 transition-colors font-medium">
                {locale === 'ar' ? 'الشروط والأحكام' : 'Terms & Conditions'}
              </Link>
            </div>

            {/* Back to top */}
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-1 flex items-center justify-center group"
              aria-label={locale === 'ar' ? 'العودة للأعلى' : 'Back to top'}
            >
              <svg className="w-6 h-6 transform group-hover:-translate-y-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}