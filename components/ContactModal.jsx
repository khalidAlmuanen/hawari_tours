'use client'

// ═══════════════════════════════════════════════════════════════════════
// 📄 ملف: components/ContactModal.jsx
// الوصف: Modal احترافي لإرسال رسائل حقيقية عبر الإيميل (يدعم الترجمة + Dark Mode)
// ═══════════════════════════════════════════════════════════════════════

import { useState, useEffect, useMemo } from 'react'
import { useApp } from '@/contexts/AppContext'

export default function ContactModal({ isOpen, onClose, tourTitle, tourPrice }) {
  const { locale, t, isRTL } = useApp()
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
      title: tt('tourDetails.emailUs', 'راسلنا عبر الإيميل', 'Email Us'),
      subtitle: tt('contact.subtitle', 'سنرد عليك في أقرب وقت ممكن', 'We will reply as soon as possible'),

      selectedTour: tt('tourDetails.selectedTour', 'الرحلة المختارة', 'Selected Tour'),
      price: tt('tourDetails.price', 'السعر', 'Price'),

      successTitle: tt('contact.success', 'تم الإرسال بنجاح! ✅', 'Message sent successfully! ✅'),
      successDesc: tt('contact.successDesc', 'سنتواصل معك قريباً عبر البريد الإلكتروني', 'We’ll contact you soon via email'),
      errorTitle: tt('contact.failTitle', 'فشل الإرسال ❌', 'Sending failed ❌'),

      name: tt('contact.name', 'الاسم الكامل', 'Full Name'),
      email: tt('contact.email', 'البريد الإلكتروني', 'Email Address'),
      phone: tt('contact.phone', 'رقم الهاتف', 'Phone Number'),
      message: tt('contact.message', 'رسالتك', 'Your Message'),

      namePH: isAr ? 'أدخل اسمك الكامل' : 'Enter your full name',
      emailPH: 'example@email.com',
      phonePH: isAr ? '+967 xxx xxx xxx' : '+967 xxx xxx xxx',
      messagePH: isAr ? 'اكتب رسالتك أو استفسارك هنا...' : 'Write your message or inquiry here...',

      send: tt('contact.send', 'إرسال الرسالة', 'Send Message'),
      sending: tt('contact.sending', 'جاري الإرسال...', 'Sending...'),
      sent: tt('contact.sent', 'تم الإرسال', 'Sent'),
      cancel: tt('common.cancel', 'إلغاء', 'Cancel')
    }
  }, [locale])

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })

  const [status, setStatus] = useState('idle')
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setStatus('sending')
    setErrorMessage('')

    try {
      // ✅ Use new messages API that saves to database
      const response = await fetch('/api/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          subject: tourTitle 
            ? (isAr ? `استفسار عن: ${tourTitle}` : `Inquiry about: ${tourTitle}`)
            : (isAr ? 'استفسار عام' : 'General Inquiry'),
          message: tourTitle 
            ? `${formData.message}\n\n---\n${isAr ? 'الجولة' : 'Tour'}: ${tourTitle}\n${isAr ? 'السعر' : 'Price'}: $${tourPrice}`
            : formData.message
        })
      })

      console.log('📧 Response status:', response.status)
      const data = await response.json()
      console.log('📦 Response data:', data)

      if (response.ok && data.success) {
        console.log('✅ Message sent successfully:', data.data)
        setStatus('success')
        setFormData({ name: '', email: '', phone: '', message: '' })

        setTimeout(() => {
          onClose()
          setStatus('idle')
        }, 3000)
      } else {
        console.error('❌ Message failed:', data.error || data.message)
        throw new Error(data.error || data.message || (isAr ? 'حدث خطأ في الإرسال' : 'Failed to send'))
      }
    } catch (error) {
      console.error('❌ Send error:', error)
      setStatus('error')
      setErrorMessage(error.message || (isAr ? 'حدث خطأ في الإرسال. حاول مرة أخرى.' : 'Failed to send. Please try again.'))

      setTimeout(() => {
        setStatus('idle')
        setErrorMessage('')
      }, 5000)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/60 dark:bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className="relative bg-white dark:bg-gray-900 rounded-3xl shadow-2xl max-w-2xl w-full transform transition-all animate-scale-in border border-transparent dark:border-gray-800"
          dir={isRTL ? 'rtl' : 'ltr'}
        >
          {/* زر الإغلاق */}
          <button
            onClick={onClose}
            className={`absolute top-6 ${isRTL ? 'left-6' : 'right-6'} w-10 h-10 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors z-10`}
          >
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Header */}
          <div className="bg-gradient-to-r from-green-500 to-emerald-600 px-8 py-8 rounded-t-3xl">
            <div className="flex items-center gap-4 text-white">
              <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-1">{labels.title}</h2>
                <p className="text-white/90">{labels.subtitle}</p>
              </div>
            </div>
          </div>

          {/* Body */}
          <div className="p-8">
            {/* معلومات الرحلة */}
            {tourTitle && (
              <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/10 rounded-xl border border-green-200 dark:border-green-800/30">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">{labels.selectedTour}</p>
                    <p className="font-bold text-gray-900 dark:text-white">{tourTitle}</p>
                  </div>
                  {tourPrice && (
                    <div className="text-left">
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-1">{labels.price}</p>
                      <p className="text-2xl font-bold text-green-600 dark:text-green-400">${tourPrice}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* رسالة النجاح */}
            {status === 'success' && (
              <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border-2 border-green-500 dark:border-green-400 rounded-xl animate-fade-in">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-green-900 dark:text-green-200 text-lg">{labels.successTitle}</p>
                    <p className="text-green-700 dark:text-green-300">{labels.successDesc}</p>
                  </div>
                </div>
              </div>
            )}

            {/* رسالة الخطأ */}
            {status === 'error' && (
              <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border-2 border-red-500 dark:border-red-400 rounded-xl animate-shake">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-bold text-red-900 dark:text-red-200 text-lg">{labels.errorTitle}</p>
                    <p className="text-red-700 dark:text-red-300">{errorMessage}</p>
                  </div>
                </div>
              </div>
            )}

            {/* النموذج */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* الاسم */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">
                  {labels.name} <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  disabled={status === 'sending' || status === 'success'}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-green-500 focus:ring-4 focus:ring-green-200 dark:focus:ring-green-900/30 transition-all outline-none disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                  placeholder={labels.namePH}
                />
              </div>

              {/* البريد الإلكتروني */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">
                  {labels.email} <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  disabled={status === 'sending' || status === 'success'}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-green-500 focus:ring-4 focus:ring-green-200 dark:focus:ring-green-900/30 transition-all outline-none disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                  placeholder={labels.emailPH}
                />
              </div>

              {/* رقم الهاتف */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">
                  {labels.phone} <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  disabled={status === 'sending' || status === 'success'}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-green-500 focus:ring-4 focus:ring-green-200 dark:focus:ring-green-900/30 transition-all outline-none disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                  placeholder={labels.phonePH}
                />
              </div>

              {/* الرسالة */}
              <div>
                <label className="block text-sm font-bold text-gray-700 dark:text-gray-200 mb-2">
                  {labels.message} <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  disabled={status === 'sending' || status === 'success'}
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-950 text-gray-900 dark:text-gray-100 placeholder:text-gray-400 dark:placeholder:text-gray-500 focus:border-green-500 focus:ring-4 focus:ring-green-200 dark:focus:ring-green-900/30 transition-all outline-none resize-none disabled:bg-gray-100 dark:disabled:bg-gray-800 disabled:cursor-not-allowed"
                  placeholder={labels.messagePH}
                ></textarea>
              </div>

              {/* أزرار */}
              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={status === 'sending' || status === 'success'}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
                >
                  {status === 'sending' ? (
                    <>
                      <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {labels.sending}
                    </>
                  ) : status === 'success' ? (
                    <>
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      {labels.sent}
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      {labels.send}
                    </>
                  )}
                </button>

                <button
                  type="button"
                  onClick={onClose}
                  disabled={status === 'sending'}
                  className="px-8 py-4 border-2 border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {labels.cancel}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes scale-in {
          from {
            opacity: 0;
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
          20%, 40%, 60%, 80% { transform: translateX(5px); }
        }

        .animate-scale-in {
          animation: scale-in 0.3s ease-out;
        }

        .animate-shake {
          animation: shake 0.5s ease-in-out;
        }
      `}</style>
    </div>
  )
}
