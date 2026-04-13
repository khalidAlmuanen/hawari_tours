'use client'

import { useMemo, useState } from 'react'
import { useApp } from '@/contexts/AppContext'
import { motion, AnimatePresence } from 'framer-motion'

export default function HotelBookingModal({ isOpen, onClose, hotel }) {
  const { locale } = useApp()
  const isAr = locale === 'ar'

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    numberOfPeople: '2',
    numberOfRooms: '1',
    checkInDate: '',
    checkOutDate: '',
    specialRequests: '',
    notes: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)
  const [bookingResult, setBookingResult] = useState(null)

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
    setError(null)
  }

  const computed = useMemo(() => {
    if (!formData.checkInDate || !formData.checkOutDate) {
      return { nights: 0, total: 0 }
    }
    const start = new Date(formData.checkInDate)
    const end = new Date(formData.checkOutDate)
    const nights = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)))
    const rooms = parseInt(formData.numberOfRooms || 1)
    const pricePerNight = hotel?.discount > 0
      ? hotel.pricePerNight * (1 - hotel.discount / 100)
      : hotel?.pricePerNight || 0
    const total = pricePerNight * nights * rooms
    return { nights, total }
  }, [formData.checkInDate, formData.checkOutDate, formData.numberOfRooms, hotel])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      if (!hotel?.id) {
        setError(isAr ? 'بيانات الفندق غير متوفرة' : 'Hotel data is not available')
        setLoading(false)
        return
      }
      const bookingData = {
        hotelId: hotel.id,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        numberOfPeople: parseInt(formData.numberOfPeople),
        numberOfRooms: parseInt(formData.numberOfRooms),
        checkInDate: formData.checkInDate,
        checkOutDate: formData.checkOutDate,
        specialRequests: formData.specialRequests || null,
        notes: formData.notes || null
      }
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      })
      const result = await response.json()
      if (result.success) {
        setSuccess(true)
        setBookingResult(result.data)
        setFormData({
          customerName: '',
          customerEmail: '',
          customerPhone: '',
          numberOfPeople: '2',
          numberOfRooms: '1',
          checkInDate: '',
          checkOutDate: '',
          specialRequests: '',
          notes: ''
        })
      } else {
        setError(result.error || (isAr ? 'فشل في إرسال الطلب' : 'Failed to submit request'))
      }
    } catch (err) {
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

  const title = isAr ? hotel?.nameAr : hotel?.name

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={`fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 ${isAr ? 'rtl' : 'ltr'}`}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            className="relative w-full max-w-3xl max-h-[92vh] bg-white dark:bg-gray-900 rounded-3xl shadow-2xl overflow-hidden"
          >
            <button
              onClick={handleClose}
              className="absolute top-4 right-4 z-10 p-2 bg-white/90 dark:bg-gray-800 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
            >
              <svg className="w-6 h-6 text-gray-600 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {success && bookingResult ? (
              <div className="p-8 sm:p-10 text-center overflow-y-auto max-h-[92vh]">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6"
                >
                  <svg className="w-12 h-12 text-emerald-600 dark:text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
                <h2 className="text-3xl font-black text-gray-900 dark:text-white mb-4">
                  {isAr ? 'تم إرسال الطلب بنجاح! ✨' : 'Request submitted successfully! ✨'}
                </h2>
                <div className="bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl p-6 mb-6">
                  <div className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {isAr ? 'رقم الطلب' : 'Request Number'}
                  </div>
                  <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400">
                    {bookingResult.bookingNumber}
                  </div>
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  {isAr ? 'تم استلام طلب الحجز الفاخر، وسنتواصل معك لتأكيد التفاصيل.' : 'Your luxury booking request is received. We will contact you to confirm details.'}
                </p>
                <button
                  onClick={handleClose}
                  className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-2xl font-black"
                >
                  {isAr ? 'حسناً' : 'Got it'}
                </button>
              </div>
            ) : (
              <div className="grid lg:grid-cols-[1.2fr_1fr] max-h-[92vh] overflow-y-auto">
                <div className="p-6 sm:p-8 space-y-6">
                  <div>
                    <p className="text-sm uppercase text-emerald-600 font-bold tracking-wider">
                      {isAr ? 'طلب حجز فاخر' : 'Luxury Booking Request'}
                    </p>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white mt-2">
                      {title || (isAr ? 'تفاصيل الفندق' : 'Hotel Details')}
                    </h2>
                  </div>

                  {error && (
                    <div className="bg-rose-50 text-rose-700 border border-rose-200 rounded-2xl px-4 py-3 text-sm">
                      {error}
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-3">
                      <input
                        name="customerName"
                        value={formData.customerName}
                        onChange={handleChange}
                        placeholder={isAr ? 'الاسم الكامل' : 'Full name'}
                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                        required
                      />
                      <input
                        name="customerEmail"
                        type="email"
                        value={formData.customerEmail}
                        onChange={handleChange}
                        placeholder={isAr ? 'البريد الإلكتروني' : 'Email address'}
                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                        required
                      />
                      <input
                        name="customerPhone"
                        value={formData.customerPhone}
                        onChange={handleChange}
                        placeholder={isAr ? 'رقم الهاتف' : 'Phone number'}
                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                        required
                      />
                      <input
                        name="numberOfPeople"
                        type="number"
                        min="1"
                        value={formData.numberOfPeople}
                        onChange={handleChange}
                        placeholder={isAr ? 'عدد الأشخاص' : 'Guests'}
                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-3">
                      <input
                        name="checkInDate"
                        type="date"
                        value={formData.checkInDate}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                        required
                      />
                      <input
                        name="checkOutDate"
                        type="date"
                        value={formData.checkOutDate}
                        onChange={handleChange}
                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                        required
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-3">
                      <input
                        name="numberOfRooms"
                        type="number"
                        min="1"
                        value={formData.numberOfRooms}
                        onChange={handleChange}
                        placeholder={isAr ? 'عدد الغرف' : 'Rooms'}
                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                        required
                      />
                      <input
                        name="specialRequests"
                        value={formData.specialRequests}
                        onChange={handleChange}
                        placeholder={isAr ? 'طلبات خاصة' : 'Special requests'}
                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
                      />
                    </div>

                    <textarea
                      name="notes"
                      value={formData.notes}
                      onChange={handleChange}
                      placeholder={isAr ? 'ملاحظات إضافية' : 'Additional notes'}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white min-h-[120px]"
                    />

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full px-6 py-4 bg-gradient-to-r from-emerald-500 to-cyan-500 text-white rounded-2xl font-black shadow-xl disabled:opacity-60"
                    >
                      {loading ? (isAr ? 'جارٍ الإرسال...' : 'Submitting...') : (isAr ? 'إرسال الطلب الفاخر' : 'Send luxury request')}
                    </button>
                  </form>
                </div>

                <div className="bg-gradient-to-br from-emerald-600 via-cyan-600 to-blue-700 p-6 sm:p-8 text-white space-y-6">
                  <div className="rounded-2xl bg-white/10 p-4">
                    <div className="text-xs uppercase text-white/70">
                      {isAr ? 'السعر التقديري' : 'Estimated total'}
                    </div>
                    <div className="text-3xl font-black mt-2">
                      ${Math.round(computed.total || 0)}
                    </div>
                    <div className="text-sm text-white/70 mt-1">
                      {computed.nights > 0
                        ? `${computed.nights} ${isAr ? 'ليالٍ' : 'nights'} · ${formData.numberOfRooms || 1} ${isAr ? 'غرف' : 'rooms'}`
                        : (isAr ? 'اختر التواريخ لرؤية التكلفة' : 'Pick dates to see cost')}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-white/10 p-4 space-y-2">
                    <div className="text-sm text-white/80">{isAr ? 'ضمانات الحجز الفاخر' : 'Luxury guarantees'}</div>
                    <div className="text-sm font-semibold">✓ {isAr ? 'تأكيد سريع خلال 24 ساعة' : 'Fast confirmation within 24 hours'}</div>
                    <div className="text-sm font-semibold">✓ {isAr ? 'خدمة كونسيرج خاصة' : 'Private concierge support'}</div>
                    <div className="text-sm font-semibold">✓ {isAr ? 'أفضل سعر متاح' : 'Best available rate'}</div>
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
