'use client'

// ═══════════════════════════════════════════════════════════════════════
// 🦶 ULTRA PREMIUM FOOTER - Hawari Tours (SALES READY)
// ✅ Hydration-safe: Newsletter form is client-only
// ✅ Dynamic Data: Fetches contact info from API
// ═══════════════════════════════════════════════════════════════════════

import Link from 'next/link'
import dynamic from 'next/dynamic'
import { useMemo, useState, useEffect } from 'react'
import { useApp } from '@/contexts/AppContext'

// ✅ render only on client to avoid hydration mismatch caused by extensions
const NewsletterFormClientOnly = dynamic(
  () => Promise.resolve(NewsletterForm),
  { ssr: false }
)

export default function Footer() {
  const { locale: appLocale, isRTL: appIsRTL } = useApp()
  const [mounted, setMounted] = useState(false)
  const locale = mounted ? appLocale : 'en'
  const isRTL = mounted ? appIsRTL : false

  // ✅ Avoid rare year mismatch at SSR/client boundary (and keeps hydration clean)
  const [currentYear, setCurrentYear] = useState('')
  const [contactInfo, setContactInfo] = useState(null)

  useEffect(() => {
    setMounted(true)
    setCurrentYear(String(new Date().getFullYear()))

    // Fetch Contact Settings
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings/contact')
        const data = await res.json()
        if (data.success) {
          setContactInfo(data.data)
        }
      } catch (error) {
        console.error('Failed to fetch footer contact settings:', error)
      }
    }
    fetchSettings()
  }, [])

  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState({ show: false, ok: true, message: '' })
  const [openSection, setOpenSection] = useState(null)

  // Dynamic values or defaults
  const phone = contactInfo?.contact?.phones?.primary || '+967 772 371 581'
  const email = contactInfo?.contact?.emails?.info || 'info@hawari.tours'

  // Dynamic Social Media
  const socialData = useMemo(() => (contactInfo?.socialMedia || {
    facebook: { url: 'https://facebook.com/hawaritours', active: true },
    instagram: { url: 'https://instagram.com/hawaritours', active: true },
    twitter: { url: 'https://twitter.com/hawaritours', active: true },
    youtube: { url: 'https://youtube.com/@hawaritours', active: true },
    tiktok: { url: 'https://tiktok.com/@hawaritours', active: true }
  }), [contactInfo])

  const footerSections = useMemo(() => ({
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
      title: locale === 'ar' ? 'الخدمات' : 'Services',
      links: [
        { href: '/tours', label: locale === 'ar' ? 'جميع الرحلات' : 'All Tours', icon: '✈️' },
        { href: '/cars', label: locale === 'ar' ? 'تأجير السيارات' : 'Cars Rental', icon: '🚘' },
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
  }), [locale])

  const socialMedia = useMemo(() => ([
    socialData.facebook.active && {
      name: 'Facebook', href: socialData.facebook.url, emoji: '📘',
      icon: (<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>)
    },
    socialData.instagram.active && {
      name: 'Instagram', href: socialData.instagram.url, emoji: '📷',
      icon: (<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" /></svg>)
    },
    socialData.twitter.active && {
      name: 'X', href: socialData.twitter.url, emoji: '𝕏',
      icon: (<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>)
    },
    socialData.whatsapp?.active && { // Assuming you might add WA here too or hardcode it
      name: 'WhatsApp', href: `https://wa.me/${phone.replace(/\D/g, '')}`, emoji: '💬',
      icon: (<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347" /></svg>)
    },
    socialData.youtube.active && {
      name: 'YouTube', href: socialData.youtube.url, emoji: '▶️',
      icon: (<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg>)
    },
    socialData.tiktok?.active && {
      name: 'TikTok', href: socialData.tiktok.url, emoji: '🎵',
      icon: (<svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" /></svg>)
    }
  ].filter(Boolean)), [socialData, phone])

  const quickStats = useMemo(() => ([
    { number: '500+', label: locale === 'ar' ? 'مسافر سعيد' : 'Happy Travelers', icon: '😊' },
    { number: '50+', label: locale === 'ar' ? 'رحلة ناجحة' : 'Successful Tours', icon: '✈️' },
    { number: '15+', label: locale === 'ar' ? 'سنوات خبرة' : 'Years Experience', icon: '⭐' },
    { number: '100%', label: locale === 'ar' ? 'رضا العملاء' : 'Satisfaction', icon: '💯' }
  ]), [locale])

  const toastNow = (ok, message) => {
    setToast({ show: true, ok, message })
    setTimeout(() => setToast((t) => ({ ...t, show: false })), 2600)
  }

  return (
    <footer className="relative overflow-hidden border-t border-gray-200 dark:border-white/10 bg-white dark:bg-gray-950">
      {/* Mesh Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full bg-green-500/15 blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-[520px] h-[520px] rounded-full bg-cyan-500/12 blur-3xl" />
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[720px] h-[320px] rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="absolute inset-0 bg-gradient-to-b from-white via-white to-gray-50 dark:from-gray-950 dark:via-gray-950 dark:to-black/20" />
      </div>

      {/* Top rim line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/60 to-transparent" />

      {/* Quick Stats (Premium cards) */}
      <div className="relative border-b border-gray-200 dark:border-white/10">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {quickStats.map((s, i) => (
              <div
                key={i}
                className="group relative rounded-3xl border border-gray-200/70 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl p-5 shadow-sm hover:shadow-xl transition-all"
              >
                <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-br from-emerald-500/10 via-cyan-500/8 to-fuchsia-500/8" />
                <div className="relative flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-emerald-500/20 via-cyan-500/15 to-fuchsia-500/15 flex items-center justify-center text-2xl group-hover:scale-110 transition-transform">
                    {s.icon}
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                      {s.number}
                    </div>
                    <div className="text-xs md:text-sm font-semibold text-gray-600 dark:text-gray-300">
                      {s.label}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="relative mx-auto max-w-7xl px-4 py-14 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Brand / Contacts */}
          <div className="lg:col-span-5">
            <Link href="/" className="inline-flex items-center gap-4 group">
              <div className="relative">
                <div className="absolute inset-0 rounded-3xl blur-2xl opacity-60 group-hover:opacity-90 transition-opacity bg-gradient-to-br from-emerald-500 to-cyan-500" />
                <div className="relative w-16 h-16 rounded-3xl bg-gradient-to-br from-emerald-500 via-teal-600 to-cyan-600 flex items-center justify-center shadow-2xl group-hover:scale-110 group-hover:rotate-6 transition-all">
                  <span className="text-2xl">🌍</span>
                </div>
              </div>

              <div className="leading-tight">
                <div className="text-2xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent">
                  Hawari Tours
                </div>
                <div className="text-sm font-semibold text-gray-600 dark:text-gray-300">
                  {locale === 'ar' ? 'Socotra • Luxury Travel' : 'Socotra • Luxury Travel'}
                </div>
              </div>
            </Link>

            <p className="mt-6 text-gray-700 dark:text-gray-300 leading-relaxed text-base md:text-lg">
              {locale === 'ar'
                ? 'نقدم تجارب سفر فاخرة في سقطرى بخدمات مميزة ومرشدين محترفين. خطط لرحلتك بسهولة واستمتع بالطبيعة الساحرة.'
                : 'We deliver luxury travel experiences in Socotra with premium service and pro guides. Plan effortlessly and enjoy breathtaking nature.'}
            </p>

            {/* Contact cards */}
            <div className="mt-8 space-y-3">
              <a
                href={`tel:${phone.replace(/\s+/g, '')}`}
                className="group flex items-center gap-4 rounded-3xl border border-gray-200/70 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl p-5 hover:shadow-xl transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                    {locale === 'ar' ? 'اتصل بنا' : 'Call Us'}
                  </div>
                  <div className="font-black text-gray-900 dark:text-white" dir="ltr">
                    {phone}
                  </div>
                </div>
                <span className="ml-auto text-gray-400 group-hover:text-emerald-600 transition-colors">›</span>
              </a>

              <a
                href={`mailto:${email}`}
                className="group flex items-center gap-4 rounded-3xl border border-gray-200/70 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl p-5 hover:shadow-xl transition-all"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                    {locale === 'ar' ? 'راسلنا' : 'Email Us'}
                  </div>
                  <div className="font-black text-gray-900 dark:text-white truncate">
                    {email}
                  </div>
                </div>
                <span className="ml-auto text-gray-400 group-hover:text-indigo-500 transition-colors">›</span>
              </a>
            </div>
          </div>

          {/* Links (Desktop grid + Mobile accordion) */}
          <div className="lg:col-span-7">
            {/* Desktop */}
            <div className="hidden md:grid grid-cols-2 lg:grid-cols-4 gap-8">
              {Object.values(footerSections).map((section, i) => (
                <div key={i}>
                  <div className="flex items-center gap-2 mb-5">
                    <span className="w-1.5 h-7 rounded-full bg-gradient-to-b from-emerald-500 to-teal-600" />
                    <h4 className="text-lg font-black text-gray-900 dark:text-white">{section.title}</h4>
                  </div>

                  <ul className="space-y-3">
                    {section.links.map((l, idx) => (
                      <li key={idx}>
                        <Link
                          href={l.href}
                          className="group flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all"
                        >
                          <span className="text-sm">{l.icon}</span>
                          <span className={`font-semibold ${isRTL ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'} transition-transform`}>
                            {l.label}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            {/* Mobile accordion */}
            <div className="md:hidden space-y-3">
              {Object.values(footerSections).map((section, i) => {
                const isOpen = openSection === i
                return (
                  <div key={i} className="rounded-3xl border border-gray-200/70 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setOpenSection(isOpen ? null : i)}
                      suppressHydrationWarning
                      className="w-full px-5 py-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-7 rounded-full bg-gradient-to-b from-emerald-500 to-teal-600" />
                        <span className="text-base font-black text-gray-900 dark:text-white">{section.title}</span>
                      </div>
                      <span className={`text-gray-500 dark:text-gray-300 transition-transform ${isOpen ? 'rotate-180' : ''}`}>▾</span>
                    </button>

                    {isOpen && (
                      <div className="px-5 pb-5">
                        <ul className="space-y-3">
                          {section.links.map((l, idx) => (
                            <li key={idx}>
                              <Link href={l.href} className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-emerald-600 transition-colors font-semibold">
                                <span className="text-sm">{l.icon}</span>
                                <span>{l.label}</span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Newsletter (Premium) */}
        <div className="mt-14 pt-12 border-t border-gray-200 dark:border-white/10">
          <div className="relative rounded-[34px] overflow-hidden border border-gray-200/60 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-2xl shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/12 via-cyan-500/10 to-fuchsia-500/10" />
            <div className="relative p-8 md:p-10">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
                <div className="max-w-xl">
                  <div className="text-4xl mb-3">📬</div>
                  <h3 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white">
                    {locale === 'ar' ? 'اشترك في نشرتنا البريدية' : 'Subscribe to Our Newsletter'}
                  </h3>
                  <p className="mt-2 text-gray-700 dark:text-gray-300">
                    {locale === 'ar'
                      ? 'عروض فاخرة ونصائح سفر تصل إلى بريدك — بدون إزعاج.'
                      : 'Luxury offers & travel tips straight to your inbox — no spam.'}
                  </p>
                </div>

                {/* ✅ ONLY CHANGE: render the form client-only */}
                <NewsletterFormClientOnly
                  locale={locale}
                  isRTL={isRTL}
                  submitting={submitting}
                  setSubmitting={setSubmitting}
                  toastNow={toastNow}
                />
              </div>

              {/* Toast */}
              {toast.show && (
                <div className={`mt-6 rounded-2xl px-5 py-4 border text-sm font-bold ${toast.ok
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-200 dark:border-emerald-500/20'
                  : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-500/10 dark:text-red-200 dark:border-red-500/20'
                  }`}>
                  {toast.message}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Social (Premium chips) */}
        <div className="mt-12">
          <div className="text-center mb-7">
            <h4 className="text-2xl font-black text-gray-900 dark:text-white">
              {locale === 'ar' ? 'تابعنا' : 'Follow Us'}
            </h4>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              {locale === 'ar' ? 'كن جزءاً من مجتمع Hawari Tours' : 'Be part of the Hawari Tours community'}
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-3">
            {socialMedia.map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.name}
                className="group relative flex items-center gap-3 px-5 py-3 rounded-2xl border border-gray-200/70 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl hover:shadow-xl transition-all"
              >
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity bg-gradient-to-r from-emerald-500/10 via-cyan-500/10 to-fuchsia-500/10" />
                <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-emerald-500/18 via-cyan-500/14 to-fuchsia-500/14 flex items-center justify-center text-white">
                  <span className="opacity-90">{s.icon}</span>
                </div>
                <div className="relative">
                  <div className="text-sm font-black text-gray-900 dark:text-white">{s.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">{locale === 'ar' ? 'زيارة' : 'Visit'}</div>
                </div>
                <span className="relative ml-2 text-gray-400 group-hover:text-emerald-600 transition-colors">›</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="relative border-t border-gray-200 dark:border-white/10 bg-white/70 dark:bg-white/5 backdrop-blur-xl">
        <div className="mx-auto max-w-7xl px-4 py-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <div className="text-gray-700 dark:text-gray-300 font-semibold">
              © {currentYear || ''} Hawari Tours. {locale === 'ar' ? 'جميع الحقوق محفوظة' : 'All rights reserved'}.
            </div>
            <div className="mt-1 text-sm text-gray-500 dark:text-gray-400 flex items-center justify-center md:justify-start gap-1">
              {locale === 'ar' ? 'صُنع بـ' : 'Made with'} <span className="text-red-500">❤️</span> {locale === 'ar' ? 'في اليمن' : 'in Yemen'} <span>🇾🇪</span>
            </div>
          </div>

          <div className="flex items-center gap-5 text-sm font-semibold">
            <Link href="/privacy" className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 transition-colors">
              {locale === 'ar' ? 'سياسة الخصوصية' : 'Privacy Policy'}
            </Link>
            <span className="text-gray-400">•</span>
            <Link href="/terms" className="text-gray-700 dark:text-gray-300 hover:text-emerald-600 transition-colors">
              {locale === 'ar' ? 'الشروط والأحكام' : 'Terms & Conditions'}
            </Link>

            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="ml-2 w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 text-white shadow-lg hover:shadow-2xl transition-all hover:-translate-y-0.5 flex items-center justify-center"
              aria-label={locale === 'ar' ? 'العودة للأعلى' : 'Back to top'}
              title={locale === 'ar' ? 'العودة للأعلى' : 'Back to top'}
              suppressHydrationWarning={true}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

// ═══════════════════════════════════════════════════════════════════════
// ✅ Newsletter form (client-only) — prevents fdprocessedid hydration mismatch
// ═══════════════════════════════════════════════════════════════════════
function NewsletterForm({ locale, isRTL, submitting, setSubmitting, toastNow }) {
  const [email, setEmail] = useState('')

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault()
    if (!email) return
    setSubmitting(true)
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      const data = await res.json()

      if (data.success) {
        toastNow(true, locale === 'ar' ? '✅ تم الاشتراك بنجاح!' : '✅ Subscribed successfully!')
        setEmail('')
      } else {
        throw new Error(data.error)
      }
    } catch {
      toastNow(false, locale === 'ar' ? 'حدث خطأ. حاول مرة أخرى.' : 'Something went wrong. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleNewsletterSubmit} className="w-full md:max-w-md">
      <div className="flex flex-col sm:flex-row gap-3">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={locale === 'ar' ? 'أدخل بريدك الإلكتروني' : 'Enter your email'}
          required
          className="w-full flex-1 px-5 py-4 rounded-2xl bg-white/80 dark:bg-black/20 border-2 border-gray-200/70 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:border-emerald-500/70 focus:ring-4 focus:ring-emerald-500/10 transition-all"
        />

        <button
          type="submit"
          disabled={submitting}
          className="w-full sm:w-auto px-6 py-4 rounded-2xl font-black text-white bg-gradient-to-r from-emerald-500 to-cyan-500 hover:shadow-2xl transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {submitting ? (locale === 'ar' ? 'جاري...' : 'Sending...') : (locale === 'ar' ? 'اشترك' : 'Subscribe')}
          <span className="text-lg">{isRTL ? '‹' : '›'}</span>
        </button>
      </div>

      <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
        {locale === 'ar' ? '✓ بدون رسائل مزعجة • يمكنك الإلغاء بأي وقت' : '✓ No spam • Unsubscribe anytime'}
      </p>
    </form>
  )
}
