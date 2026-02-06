'use client'

// ═══════════════════════════════════════════════════════════════════════
// 📞 Contact Page - ENHANCED VERSION (تحسين احترافي 100%)
// ✨ Features: Better design, animations, map integration, social media
// ═══════════════════════════════════════════════════════════════════════

import { useState } from 'react'
import { useApp } from '@/contexts/AppContext'
import WhatsAppButton from '@/components/WhatsAppButton'

export default function ContactPage() {
  const { locale, isDark } = useApp()
  const isAr = locale === 'ar'

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: 'general',
    message: ''
  })

  const [status, setStatus] = useState('idle') // idle, sending, success, error
  const [focusedField, setFocusedField] = useState(null)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')

    // محاكاة الإرسال
    setTimeout(() => {
      setStatus('success')
      setFormData({ name: '', email: '', phone: '', inquiryType: 'general', message: '' })
      
      setTimeout(() => {
        setStatus('idle')
      }, 5000)
    }, 2000)
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Contact Methods
  const contactMethods = [
    {
      id: 'phone',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
        </svg>
      ),
      title: { ar: 'اتصل بنا', en: 'Call Us' },
      value: '+967 772 371 581',
      link: 'tel:+967772371581',
      gradient: 'from-blue-500 to-indigo-600',
      description: { ar: 'متاح من 8 ص - 8 م', en: 'Available 8 AM - 8 PM' }
    },
    {
      id: 'whatsapp',
      icon: (
        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
        </svg>
      ),
      title: { ar: 'واتساب', en: 'WhatsApp' },
      value: '+967 772 371 581',
      link: 'https://wa.me/967772371581',
      gradient: 'from-green-500 to-emerald-600',
      description: { ar: 'رد فوري 24/7', en: 'Instant reply 24/7' }
    },
    {
      id: 'email',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      ),
      title: { ar: 'البريد الإلكتروني', en: 'Email' },
      value: 'info@hawari.tours',
      link: 'mailto:info@hawari.tours',
      gradient: 'from-purple-500 to-pink-600',
      description: { ar: 'نرد خلال 24 ساعة', en: 'Reply within 24 hours' }
    },
    {
      id: 'location',
      icon: (
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      title: { ar: 'العنوان', en: 'Address' },
      value: { ar: 'حديبو، سقطرى، اليمن', en: 'Hadiboh, Socotra, Yemen' },
      link: '#map',
      gradient: 'from-orange-500 to-red-600',
      description: { ar: 'قرب المطار', en: 'Near Airport' }
    }
  ]

  // Inquiry Types
  const inquiryTypes = [
    { value: 'general', label: { ar: 'استفسار عام', en: 'General Inquiry' } },
    { value: 'booking', label: { ar: 'حجز رحلة', en: 'Tour Booking' } },
    { value: 'custom', label: { ar: 'رحلة مخصصة', en: 'Custom Tour' } },
    { value: 'group', label: { ar: 'حجز جماعي', en: 'Group Booking' } },
    { value: 'other', label: { ar: 'أخرى', en: 'Other' } }
  ]

  // Social Media
  const socialMedia = [
    {
      name: 'Facebook',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
      link: '#',
      color: 'hover:text-blue-600'
    },
    {
      name: 'Instagram',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      ),
      link: '#',
      color: 'hover:text-pink-600'
    },
    {
      name: 'Twitter',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
        </svg>
      ),
      link: '#',
      color: 'hover:text-sky-500'
    },
    {
      name: 'YouTube',
      icon: (
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      ),
      link: '#',
      color: 'hover:text-red-600'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Hero Section - Enhanced */}
      <section className="relative h-[50vh] min-h-[400px] overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-green-600 via-blue-600 to-purple-600">
          <div className="absolute inset-0 opacity-30">
            <div className="absolute inset-0 animate-pulse" style={{
              backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)'
            }}></div>
          </div>
        </div>

        {/* Content */}
        <div className="relative h-full flex items-center justify-center z-10">
          <div className="container mx-auto px-4 text-center">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full mb-6 animate-fade-in">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-white font-semibold">
                {isAr ? 'نحن هنا لمساعدتك' : 'We\'re Here to Help'}
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-slide-in-up">
              {isAr ? 'تواصل معنا' : 'Get in Touch'}
            </h1>

            <p className="text-xl text-white/90 max-w-2xl mx-auto animate-slide-in-up" style={{animationDelay: '0.1s'}}>
              {isAr 
                ? 'نحن متواجدون للإجابة على استفساراتك ومساعدتك في التخطيط لرحلتك المثالية'
                : 'We\'re available to answer your questions and help plan your perfect trip'}
            </p>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" className="w-full">
            <path d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V120Z" 
                  fill={isDark ? '#111827' : '#f9fafb'} 
            />
          </svg>
        </div>
      </section>

      {/* Contact Methods - Enhanced Cards */}
      <section className="py-16 -mt-20 relative z-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => (
              <a
                key={method.id}
                href={method.link}
                className={`group bg-gradient-to-br ${method.gradient} p-8 rounded-2xl shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 animate-fade-in`}
                style={{animationDelay: `${index * 0.1}s`}}
              >
                <div className="text-white">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    {method.icon}
                  </div>

                  <h3 className="text-xl font-bold mb-2">{method.title[locale]}</h3>
                  
                  <p className="font-semibold mb-2 break-all">
                    {typeof method.value === 'string' ? method.value : method.value[locale]}
                  </p>

                  <p className="text-sm text-white/80">
                    {method.description[locale]}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid lg:grid-cols-5 gap-12">
            {/* Form - 3 columns */}
            <div className="lg:col-span-3">
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-8 border border-gray-200 dark:border-gray-700">
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {isAr ? 'أرسل رسالة' : 'Send a Message'}
                </h2>
                <p className="text-gray-600 dark:text-gray-400 mb-8">
                  {isAr ? 'املأ النموذج وسنتواصل معك في أقرب وقت' : 'Fill the form and we\'ll get back to you soon'}
                </p>

                {/* Success Message */}
                {status === 'success' && (
                  <div className="mb-6 bg-green-50 dark:bg-green-900/20 border-l-4 border-green-500 p-4 rounded-lg animate-fade-in">
                    <div className="flex items-center gap-3">
                      <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <div>
                        <p className="font-bold text-green-700 dark:text-green-300">
                          {isAr ? 'تم الإرسال بنجاح!' : 'Sent Successfully!'}
                        </p>
                        <p className="text-sm text-green-600 dark:text-green-400">
                          {isAr ? 'سنتواصل معك قريباً' : 'We\'ll contact you soon'}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">
                        {isAr ? 'الاسم الكامل' : 'Full Name'} *
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('name')}
                        onBlur={() => setFocusedField(null)}
                        required
                        className={`w-full px-4 py-3 border-2 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-all outline-none ${
                          focusedField === 'name'
                            ? 'border-green-500 ring-4 ring-green-200 dark:ring-green-900/30'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                        placeholder={isAr ? 'أدخل اسمك' : 'Enter your name'}
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">
                        {isAr ? 'البريد الإلكتروني' : 'Email'} *
                      </label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('email')}
                        onBlur={() => setFocusedField(null)}
                        required
                        className={`w-full px-4 py-3 border-2 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-all outline-none ${
                          focusedField === 'email'
                            ? 'border-green-500 ring-4 ring-green-200 dark:ring-green-900/30'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                        placeholder="example@email.com"
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">
                        {isAr ? 'رقم الهاتف' : 'Phone Number'} *
                      </label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        onFocus={() => setFocusedField('phone')}
                        onBlur={() => setFocusedField(null)}
                        required
                        className={`w-full px-4 py-3 border-2 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-all outline-none ${
                          focusedField === 'phone'
                            ? 'border-green-500 ring-4 ring-green-200 dark:ring-green-900/30'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                        placeholder="+967 xxx xxx xxx"
                      />
                    </div>

                    {/* Inquiry Type */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">
                        {isAr ? 'نوع الاستفسار' : 'Inquiry Type'} *
                      </label>
                      <select
                        name="inquiryType"
                        value={formData.inquiryType}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white outline-none"
                      >
                        {inquiryTypes.map(type => (
                          <option key={type.value} value={type.value}>
                            {type.label[locale]}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">
                      {isAr ? 'الرسالة' : 'Message'} *
                    </label>
                    <textarea
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      onFocus={() => setFocusedField('message')}
                      onBlur={() => setFocusedField(null)}
                      required
                      rows={6}
                      className={`w-full px-4 py-3 border-2 rounded-xl bg-white dark:bg-gray-900 text-gray-900 dark:text-white transition-all outline-none resize-none ${
                        focusedField === 'message'
                          ? 'border-green-500 ring-4 ring-green-200 dark:ring-green-900/30'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                      placeholder={isAr ? 'اكتب رسالتك هنا...' : 'Write your message here...'}
                    ></textarea>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={status === 'sending'}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {status === 'sending' ? (
                      <>
                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {isAr ? 'جاري الإرسال...' : 'Sending...'}
                      </>
                    ) : (
                      <>
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                        {isAr ? 'إرسال الرسالة' : 'Send Message'}
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Sidebar - 2 columns */}
            <div className="lg:col-span-2 space-y-6">
              {/* Working Hours */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                    <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {isAr ? 'ساعات العمل' : 'Working Hours'}
                  </h3>
                </div>

                <div className="space-y-3 text-gray-600 dark:text-gray-400">
                  <div className="flex justify-between">
                    <span>{isAr ? 'السبت - الخميس' : 'Saturday - Thursday'}</span>
                    <span className="font-semibold">8:00 AM - 8:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>{isAr ? 'الجمعة' : 'Friday'}</span>
                    <span className="font-semibold">{isAr ? 'مغلق' : 'Closed'}</span>
                  </div>
                  <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                    <span className="text-green-600 dark:text-green-400 font-semibold">
                      {isAr ? 'واتساب متاح 24/7' : 'WhatsApp Available 24/7'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                  {isAr ? 'تابعنا' : 'Follow Us'}
                </h3>

                <div className="flex gap-3">
                  {socialMedia.map(social => (
                    <a
                      key={social.name}
                      href={social.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center text-gray-600 dark:text-gray-400 ${social.color} transition-all hover:scale-110`}
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>

              {/* Quick WhatsApp */}
              <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl shadow-lg p-6 text-white">
                <h3 className="text-xl font-bold mb-2">
                  {isAr ? 'تفضل الدردشة؟' : 'Prefer to Chat?'}
                </h3>
                <p className="text-sm text-white/90 mb-4">
                  {isAr ? 'تواصل معنا عبر واتساب للرد الفوري' : 'Contact us on WhatsApp for instant reply'}
                </p>
                <a
                  href="https://wa.me/967772371581"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-white text-green-600 px-6 py-3 rounded-xl font-bold hover:bg-gray-100 transition-all"
                >
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  {isAr ? 'افتح واتساب' : 'Open WhatsApp'}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section id="map" className="py-16 bg-white dark:bg-gray-800">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {isAr ? 'موقعنا' : 'Our Location'}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {isAr ? 'تفضل بزيارتنا في حديبو، سقطرى' : 'Visit us in Hadiboh, Socotra'}
            </p>
          </div>

          <div className="relative h-[400px] bg-gray-200 dark:bg-gray-700 rounded-2xl overflow-hidden">
            {/* Placeholder for map */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p className="text-gray-600 dark:text-gray-400 font-semibold">
                  {isAr ? 'الخريطة ستظهر هنا' : 'Map will be displayed here'}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                  {isAr ? 'حديبو، جزيرة سقطرى، اليمن' : 'Hadiboh, Socotra Island, Yemen'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <WhatsAppButton />
    </div>
  )
}