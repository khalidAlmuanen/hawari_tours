'use client'

// ═══════════════════════════════════════════════════════════════════════
// 📄 ملف: app/contact/page.jsx
// صفحة التواصل - جاهز للنسخ واللصق (Dark Mode + i18n + RTL)
// ═══════════════════════════════════════════════════════════════════════

import { useState, useMemo } from 'react'
import WhatsAppButton from '@/components/WhatsAppButton'
import { useApp } from '@/contexts/AppContext'

export default function ContactPage() {
  const { locale, isRTL, t } = useApp()
  const isAr = locale === 'ar'

  const tt = (key, fallbackAr, fallbackEn) => {
    try {
      const v = t?.(key)
      if (!v || v === key) return isAr ? fallbackAr : fallbackEn
      return v
    } catch {
      return isAr ? fallbackAr : fallbackEn
    }
  }

  const labels = useMemo(() => {
    return {
      pageTitle: tt('contact.pageTitle', 'تواصل معنا', 'Contact Us'),
      pageDesc: tt('contact.pageDesc', 'نحن هنا للإجابة على جميع استفساراتك وتلبية احتياجاتك', 'We are here to answer all your questions and support your needs'),

      formTitle: tt('contact.formTitle', 'أرسل لنا رسالة', 'Send us a message'),
      successMsg: tt('contact.successMsg', 'تم إرسال رسالتك بنجاح! سنتواصل معك قريباً', 'Your message has been sent successfully! We will contact you soon'),

      name: tt('contact.name', 'الاسم الكامل', 'Full Name'),
      email: tt('contact.email', 'البريد الإلكتروني', 'Email Address'),
      phone: tt('contact.phone', 'رقم الهاتف', 'Phone Number'),
      message: tt('contact.message', 'الرسالة', 'Message'),

      namePH: isAr ? 'أدخل اسمك الكامل' : 'Enter your full name',
      emailPH: 'example@email.com',
      phonePH: isAr ? '+967 xxx xxx xxx' : '+967 xxx xxx xxx',
      messagePH: isAr ? 'اكتب رسالتك هنا...' : 'Write your message here...',

      send: tt('contact.send', 'إرسال الرسالة', 'Send Message'),
      sending: tt('contact.sending', 'جاري الإرسال...', 'Sending...'),

      infoTitle: tt('contact.infoTitle', 'معلومات التواصل', 'Contact Info'),
      phoneTitle: tt('contact.phoneTitle', 'الهاتف / واتساب', 'Phone / WhatsApp'),
      emailTitle: tt('contact.emailTitle', 'البريد الإلكتروني', 'Email'),
      addressTitle: tt('contact.addressTitle', 'العنوان', 'Address'),
      addressValue: tt('contact.addressValue', 'حديبو، جزيرة سقطرى، اليمن', 'Hadibo, Socotra Island, Yemen'),

      directTitle: tt('contact.directTitle', 'تفضل التواصل المباشر؟', 'Prefer direct contact?'),
      directDesc: tt('contact.directDesc', 'تواصل معنا عبر واتساب للحصول على رد فوري', 'Contact us on WhatsApp for an instant reply'),
      waBtn: tt('contact.waBtn', 'تواصل عبر واتساب', 'Chat on WhatsApp'),
      waText: tt('contact.waText', 'مرحباً! أريد الاستفسار', 'Hello! I would like to inquire')
    }
  }, [locale])

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })

  const [status, setStatus] = useState('idle') // idle, sending, success, error

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')

    // محاكاة إرسال النموذج
    setTimeout(() => {
      setStatus('success')
      setFormData({ name: '', email: '', phone: '', message: '' })

      setTimeout(() => {
        setStatus('idle')
      }, 3000)
    }, 1500)
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const successBorderClass = isRTL ? 'border-r-4' : 'border-l-4'

  return (
    <div
      dir={isRTL ? 'rtl' : 'ltr'}
      className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-green-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950"
    >
      {/* Hero Section */}
      <section className="relative h-[40vh] min-h-[300px] bg-gradient-to-r from-green-600 via-blue-600 to-purple-600">
        <div className="absolute inset-0 bg-pattern-dots opacity-10"></div>

        <div className="relative h-full flex items-center justify-center text-center">
          <div className="max-w-3xl mx-auto px-4">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4">
              {labels.pageTitle}
            </h1>
            <p className="text-xl text-white/90">
              {labels.pageDesc}
            </p>
          </div>
        </div>

        {/* Wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* المحتوى */}
      <section className="py-16 -mt-10">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* النموذج */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-8 border border-transparent dark:border-gray-800">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                {labels.formTitle}
              </h2>

              {status === 'success' && (
                <div className={`mb-6 bg-green-50 dark:bg-green-900/20 ${successBorderClass} border-green-500 p-4 rounded-lg animate-fade-in`}>
                  <div className="flex items-center gap-3">
                    <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <p className="text-green-700 dark:text-green-300 font-semibold">
                      {labels.successMsg}
                    </p>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                    {labels.name} *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-green-500 focus:ring-4 focus:ring-green-200 dark:focus:ring-green-900/30 transition-all outline-none"
                    placeholder={labels.namePH}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                    {labels.email} *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-green-500 focus:ring-4 focus:ring-green-200 dark:focus:ring-green-900/30 transition-all outline-none"
                    placeholder={labels.emailPH}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                    {labels.phone} *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-green-500 focus:ring-4 focus:ring-green-200 dark:focus:ring-green-900/30 transition-all outline-none"
                    placeholder={labels.phonePH}
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-2">
                    {labels.message} *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-green-500 focus:ring-4 focus:ring-green-200 dark:focus:ring-green-900/30 transition-all outline-none resize-none"
                    placeholder={labels.messagePH}
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {status === 'sending' ? (
                    <span className="flex items-center justify-center gap-2">
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {labels.sending}
                    </span>
                  ) : (
                    labels.send
                  )}
                </button>
              </form>
            </div>

            {/* معلومات التواصل */}
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-lg p-8 border border-transparent dark:border-gray-800">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                  {labels.infoTitle}
                </h2>

                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-green-600 dark:text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white mb-1">{labels.phoneTitle}</h3>
                      <a href="tel:+967772371581" className="text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-semibold">
                        +967 772 371 581
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white mb-1">{labels.emailTitle}</h3>
                      <a href="mailto:info@hawari.tours" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold">
                        info@hawari.tours
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-purple-600 dark:text-purple-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white mb-1">{labels.addressTitle}</h3>
                      <p className="text-gray-600 dark:text-gray-300">{labels.addressValue}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* اتصل مباشرة */}
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl shadow-lg p-8 text-white">
                <h3 className="text-2xl font-bold mb-4">
                  {labels.directTitle}
                </h3>
                <p className="mb-6 text-white/90">
                  {labels.directDesc}
                </p>
                <a
                  href={`https://wa.me/967772371581?text=${encodeURIComponent(labels.waText)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-green-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  {labels.waBtn}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <WhatsAppButton />
    </div>
  )
}
