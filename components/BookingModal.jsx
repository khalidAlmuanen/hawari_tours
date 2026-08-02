'use client'

// ═══════════════════════════════════════════════════════════════
// 📅 Booking Modal - Ultra Professional & Stunning
// نموذج الحجز - احترافي وعصري ومبهر جداً
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react'
import { useApp } from '@/contexts/AppContext'
import { motion, AnimatePresence } from 'framer-motion'

export default function BookingModal({ isOpen, onClose, tour }) {
  const { locale } = useApp()
  const isAr = locale === 'ar'

  // ✅ Debug: Log tour data when modal opens
  useEffect(() => {
    if (isOpen) {
      console.log('🎯 BookingModal opened with tour:', tour)
      if (!tour) {
        console.error('❌ ERROR: tour is null or undefined!')
      } else if (!tour.id) {
        console.error('❌ ERROR: tour.id is missing!', tour)
      } else {
        console.log('✅ Tour data is valid:', { id: tour.id, title: tour.title })
      }
    }
  }, [isOpen, tour])

  // Form state
  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    numberOfPeople: '1',
    tourDate: '',
    specialRequests: '',
    emergencyContact: ''
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)
  const [bookingResult, setBookingResult] = useState(null)

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setError(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // ✅ Validation: Check if tour exists
      if (!tour || !tour.id) {
        console.error('❌ Tour data is missing!', tour)
        setError(isAr ? 'بيانات الجولة غير متوفرة' : 'Tour data is not available')
        setLoading(false)
        return
      }

      const bookingData = {
        tourId: tour.id,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        tourDate: formData.tourDate,
        numberOfPeople: parseInt(formData.numberOfPeople),
        specialRequests: formData.specialRequests || null,
        emergencyContact: formData.emergencyContact || null
      }

      console.log('📅 Sending booking request:', bookingData)

      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
      })

      console.log('📡 Response status:', response.status)

      const result = await response.json()
      console.log('📦 Response data:', result)

      if (result.success) {
        console.log('✅ Booking created successfully!', result.data)
        setSuccess(true)
        setBookingResult(result.data)
        // Reset form
        setFormData({
          customerName: '',
          customerEmail: '',
          customerPhone: '',
          numberOfPeople: '1',
          tourDate: '',
          specialRequests: '',
          emergencyContact: ''
        })
      } else {
        console.error('❌ Booking failed:', result.error)
        setError(result.error || (isAr ? 'فشل في إنشاء الحجز' : 'Failed to create booking'))
      }
    } catch (err) {
      console.error('❌ Booking error:', err)
      setError(isAr ? 'حدث خطأ. حاول مرة أخرى' : 'An error occurred. Please try again')
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setSuccess(false)
    setError(null)
    setBookingResult(null)
    onClose()
  }

  if (!isOpen) return null

  const title = isAr ? tour?.titleAr : tour?.title
  const price = tour?.discount > 0
    ? tour.price * (1 - tour.discount / 100)
    : tour?.price

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={`fixed inset-0 z-[9999] flex items-center justify-center p-4 ${isAr ? 'rtl' : 'ltr'}`}>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl max-h-[90vh] bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 p-2 bg-white/90 dark:bg-gray-700 rounded-full hover:bg-gray-100 dark:hover:bg-gray-600 transition-all"
            >
              <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {/* Success State */}
            {success && bookingResult ? (
              <div className="p-8 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <svg className="w-12 h-12 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>

                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                  {isAr ? 'تم الحجز بنجاح! 🎉' : 'Booking Successful! 🎉'}
                </h2>

                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-2xl p-6 mb-6">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {isAr ? 'رقم الحجز' : 'Booking Number'}
                  </div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                    {bookingResult.bookingNumber}
                  </div>
                </div>

                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {isAr 
                    ? 'تم إرسال تأكيد الحجز إلى بريدك الإلكتروني. سنتصل بك قريباً لتأكيد التفاصيل.'
                    : 'A booking confirmation has been sent to your email. We will contact you soon to confirm the details.'
                  }
                </p>

                <div className="space-y-3">
                  <button
                    onClick={handleClose}
                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-xl transition-all"
                  >
                    {isAr ? 'حسناً' : 'Got it'}
                  </button>
                  <a
                    href={`https://wa.me/967772371581?text=${encodeURIComponent(`Booking ${bookingResult.bookingNumber} - ${title}`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block w-full px-6 py-3 bg-green-600 text-white rounded-xl font-bold text-center hover:bg-green-700 transition-all"
                  >
                    {isAr ? 'تواصل عبر واتساب' : 'Contact via WhatsApp'}
                  </a>
                </div>
              </div>
            ) : (
              <>
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
                  <h2 className="text-3xl font-bold mb-2">
                    {isAr ? 'احجز رحلتك الآن' : 'Book Your Tour Now'}
                  </h2>
                  <p className="text-white/90">
                    {title}
                  </p>
                  <div className="mt-4 flex items-center gap-4">
                    <span className="text-2xl font-bold">
                      ${price?.toLocaleString()}
                    </span>
                    <span className="text-white/80">
                      {isAr ? 'للشخص' : 'per person'}
                    </span>
                  </div>
                </div>

                {/* Form */}
                <div className="p-8 overflow-y-auto max-h-[calc(90vh-200px)]">
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl"
                    >
                      <p className="text-red-700 dark:text-red-400 font-medium">
                        ⚠️ {error}
                      </p>
                    </motion.div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                        {isAr ? 'الاسم الكامل' : 'Full Name'} *
                      </label>
                      <input
                        type="text"
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none dark:bg-gray-700 dark:text-white transition-all"
                        placeholder={isAr ? 'أحمد محمد' : 'John Doe'}
                      />
                    </div>

                    {/* Email */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                        {isAr ? 'البريد الإلكتروني' : 'Email Address'} *
                      </label>
                      <input
                        type="email"
                        name="customerEmail"
                        value={formData.customerEmail}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none dark:bg-gray-700 dark:text-white transition-all"
                        placeholder={isAr ? 'ahmed@example.com' : 'john@example.com'}
                      />
                    </div>

                    {/* Phone */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                        {isAr ? 'رقم الهاتف' : 'Phone Number'} *
                      </label>
                      <input
                        type="tel"
                        name="customerPhone"
                        value={formData.customerPhone}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none dark:bg-gray-700 dark:text-white transition-all"
                        placeholder={isAr ? '+967 771 234 567' : '+967 771 234 567'}
                      />
                    </div>

                    {/* Tour Date */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                        {isAr ? 'تاريخ الجولة' : 'Tour Date'} *
                      </label>
                      <input
                        type="date"
                        name="tourDate"
                        value={formData.tourDate}
                        onChange={handleChange}
                        required
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none dark:bg-gray-700 dark:text-white transition-all"
                      />
                    </div>

                    {/* Number of People */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                        {isAr ? 'عدد الأشخاص' : 'Number of People'} *
                      </label>
                      <select
                        name="numberOfPeople"
                        value={formData.numberOfPeople}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none dark:bg-gray-700 dark:text-white transition-all"
                      >
                        {[...Array(Math.min(tour?.maxPeople || 10, 20))].map((_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1} {isAr ? (i + 1 === 1 ? 'شخص' : 'أشخاص') : (i + 1 === 1 ? 'Person' : 'People')}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Special Requests */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                        {isAr ? 'طلبات خاصة' : 'Special Requests'} ({isAr ? 'اختياري' : 'Optional'})
                      </label>
                      <textarea
                        name="specialRequests"
                        value={formData.specialRequests}
                        onChange={handleChange}
                        rows={3}
                        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none dark:bg-gray-700 dark:text-white transition-all resize-none"
                        placeholder={isAr ? 'أخبرنا بأي طلبات خاصة...' : 'Tell us any special requests...'}
                      />
                    </div>

                    {/* Emergency Contact */}
                    <div>
                      <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">
                        {isAr ? 'جهة اتصال طوارئ' : 'Emergency Contact'} ({isAr ? 'اختياري' : 'Optional'})
                      </label>
                      <input
                        type="tel"
                        name="emergencyContact"
                        value={formData.emergencyContact}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:border-blue-500 dark:focus:border-blue-400 focus:outline-none dark:bg-gray-700 dark:text-white transition-all"
                        placeholder={isAr ? '+967 777 888 999' : '+967 777 888 999'}
                      />
                    </div>

                    {/* Price Summary */}
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 rounded-2xl p-6">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-700 dark:text-gray-300">
                          {isAr ? 'السعر للشخص' : 'Price per person'}
                        </span>
                        <span className="font-bold text-gray-900 dark:text-white">
                          ${price?.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-700 dark:text-gray-300">
                          {isAr ? 'عدد الأشخاص' : 'Number of people'}
                        </span>
                        <span className="font-bold text-gray-900 dark:text-white">
                          {formData.numberOfPeople}
                        </span>
                      </div>
                      <div className="border-t-2 border-gray-300 dark:border-gray-600 pt-2 mt-2">
                        <div className="flex justify-between items-center">
                          <span className="text-lg font-bold text-gray-900 dark:text-white">
                            {isAr ? 'المجموع' : 'Total'}
                          </span>
                          <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                            ${(price * parseInt(formData.numberOfPeople)).toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-bold text-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-2xl"
                    >
                      {loading ? (
                        <span className="flex items-center justify-center gap-2">
                          <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>{isAr ? 'جارٍ الحجز...' : 'Processing...'}</span>
                        </span>
                      ) : (
                        <span className="flex items-center justify-center gap-2">
                          <span>✨</span>
                          <span>{isAr ? 'تأكيد الحجز' : 'Confirm Booking'}</span>
                        </span>
                      )}
                    </button>

                    {/* Info Note */}
                    <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                      {isAr 
                        ? 'بالضغط على "تأكيد الحجز"، أنت توافق على شروط وأحكام الخدمة'
                        : 'By clicking "Confirm Booking", you agree to our terms and conditions'
                      }
                    </p>
                  </form>
                </div>
              </>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
