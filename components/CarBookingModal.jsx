'use client'

import { useMemo, useState } from 'react'
import { useApp } from '@/contexts/AppContext'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'

export default function CarBookingModal({ isOpen, onClose, car }) {
  const { locale } = useApp()
  const isAr = locale === 'ar'

  const [formData, setFormData] = useState({
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    numberOfPeople: '1',
    startDate: '',
    endDate: '',
    pickupLocation: '',
    dropoffLocation: '',
    withDriver: false,
    specialRequests: '',
    notes: ''
  })
  
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState(null)
  const [bookingResult, setBookingResult] = useState(null)

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? checked : value 
    }))
    setError(null)
  }

  const computed = useMemo(() => {
    if (!formData.startDate || !formData.endDate) {
      return { days: 0, driverCost: 0, subtotal: 0, total: 0 }
    }
    const start = new Date(formData.startDate)
    const end = new Date(formData.endDate)
    // Inclusive days
    const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1)
    
    const pricePerDay = car?.discount > 0
      ? car.pricePerDay * (1 - car.discount / 100)
      : car?.pricePerDay || 0
      
    const subtotal = pricePerDay * days
    const driverCost = formData.withDriver ? (50 * days) : 0 // hypothetical driver cost per day
    const total = subtotal + driverCost

    return { days, subtotal, driverCost, total }
  }, [formData.startDate, formData.endDate, formData.withDriver, car])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)
    
    try {
      if (!car?.id) {
        setError(isAr ? 'بيانات السيارة غير متوفرة' : 'Car data is not available')
        setLoading(false)
        return
      }

      // We use the existing bookings POST route that we updated or the specific car booking route if we have one.
      // Wait, earlier we created app/api/bookings/car/route.js in task.md, let's use that.
      const bookingData = {
        carId: car.id,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        numberOfPeople: parseInt(formData.numberOfPeople || 1),
        startDate: formData.startDate,
        endDate: formData.endDate,
        totalPrice: computed.total,
        withDriver: formData.withDriver,
        pickupLocation: formData.pickupLocation || null,
        dropoffLocation: formData.dropoffLocation || null,
        specialRequests: formData.specialRequests || null,
        notes: formData.notes || null,
        bookingType: 'CAR'
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
          numberOfPeople: '1',
          startDate: '',
          endDate: '',
          pickupLocation: '',
          dropoffLocation: '',
          withDriver: false,
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

  const title = isAr ? car?.nameAr : car?.name

  return (
    <AnimatePresence>
      {isOpen && (
        <div className={`fixed inset-0 z-[9999] flex items-center justify-center p-3 sm:p-4 ${isAr ? 'rtl' : 'ltr'}`}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            className="relative w-full max-w-4xl max-h-[95vh] bg-white dark:bg-gray-900 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col"
          >
            <button
              onClick={handleClose}
              className="absolute top-5 right-5 z-20 p-2.5 bg-gray-100 dark:bg-gray-800/80 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-all text-gray-700 dark:text-gray-300 backdrop-blur-sm"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            {success && bookingResult ? (
              <div className="p-10 text-center overflow-y-auto max-h-[92vh] flex flex-col justify-center items-center h-full">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, damping: 20 }}
                  className="w-28 h-28 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-indigo-500/30"
                >
                  <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                  </svg>
                </motion.div>
                <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-4">
                  {isAr ? 'تم تأكيد طلبك بنجاح! 🚘' : 'Request Confirmed Successfully! 🚘'}
                </h2>
                
                <div className="bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-700/50 rounded-3xl p-8 mb-8 max-w-sm mx-auto w-full">
                  <div className="text-sm text-gray-500 dark:text-gray-400 font-bold uppercase tracking-wider mb-2">
                    {isAr ? 'رقم التأكيد المرجعي' : 'Booking Reference'}
                  </div>
                  <div className="text-3xl font-black text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 py-3 rounded-2xl border border-indigo-100 dark:border-indigo-800/50 shadow-inner">
                    {bookingResult.bookingNumber}
                  </div>
                </div>
                
                <p className="text-gray-600 dark:text-gray-400 text-lg mb-8 max-w-md mx-auto">
                  {isAr 
                    ? 'لقد استلمنا طلب تأجير السيارة الخاص بك. سيقوم فريق الإدارة بمراجعته والتواصل معك قريباً لتأكيد الترتيبات.' 
                    : 'We have received your car rental request. Our management team will review it and contact you shortly to confirm arrangements.'}
                </p>
                <button
                  onClick={handleClose}
                  className="px-10 py-4 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-2xl font-black shadow-xl hover:scale-105 active:scale-95 transition-all text-lg"
                >
                  {isAr ? 'العودة للصفحة المطلوبة' : 'Return to Page'}
                </button>
              </div>
            ) : (
              <div className="grid lg:grid-cols-[1.4fr_1.1fr] max-h-[92vh] overflow-y-auto">
                {/* Form Area */}
                <div className="p-8 sm:p-10 space-y-8">
                  <div>
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-xs font-bold uppercase tracking-widest mb-4 border border-indigo-100 dark:border-indigo-800/30">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500" />
                      {isAr ? 'طلب تأجير' : 'Rental Request'}
                    </div>
                    <h2 className="text-3xl font-black text-gray-900 dark:text-white leading-tight">
                      {title || (isAr ? 'تفاصيل السيارة' : 'Car Details')}
                    </h2>
                  </div>

                  {error && (
                    <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-rose-50 text-rose-700 border border-rose-200 rounded-2xl px-5 py-4 text-sm font-semibold flex items-center gap-3">
                      <span>⚠️</span> {error}
                    </motion.div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-100 dark:border-gray-800 pb-2">{isAr ? 'البيانات الشخصية' : 'Personal Details'}</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <input
                          name="customerName"
                          value={formData.customerName}
                          onChange={handleChange}
                          placeholder={isAr ? 'الاسم الكامل' : 'Full Name'}
                          className="w-full px-5 py-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium"
                          required
                        />
                        <input
                          name="customerPhone"
                          value={formData.customerPhone}
                          onChange={handleChange}
                          placeholder={isAr ? 'رقم الهاتف' : 'Phone Number'}
                          className="w-full px-5 py-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium"
                          required
                        />
                      </div>
                      <input
                        name="customerEmail"
                        type="email"
                        value={formData.customerEmail}
                        onChange={handleChange}
                        placeholder={isAr ? 'البريد الإلكتروني' : 'Email Address'}
                        className="w-full px-5 py-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium"
                        required
                      />
                    </div>

                    <div className="space-y-4">
                       <h3 className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-wider border-b border-gray-100 dark:border-gray-800 pb-2">{isAr ? 'تفاصيل التأجير' : 'Rental Details'}</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 ml-1">{isAr ? 'تاريخ الاستلام' : 'Pick-up Date'}</label>
                          <input
                            name="startDate"
                            type="date"
                            value={formData.startDate}
                            onChange={handleChange}
                            className="w-full px-5 py-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium"
                            required
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 ml-1">{isAr ? 'تاريخ التسليم' : 'Drop-off Date'}</label>
                          <input
                            name="endDate"
                            type="date"
                            value={formData.endDate}
                            onChange={handleChange}
                            className="w-full px-5 py-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium"
                            required
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-gray-500 dark:text-gray-400 mb-1.5 ml-1">{isAr ? 'عدد الركاب' : 'Number of Passengers'}</label>
                        <input
                          name="numberOfPeople"
                          type="number"
                          min="1"
                          max={car?.seats || 8}
                          value={formData.numberOfPeople}
                          onChange={handleChange}
                          className="w-full px-5 py-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium"
                          required
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <input
                          name="pickupLocation"
                          value={formData.pickupLocation}
                          onChange={handleChange}
                          placeholder={isAr ? 'موقع الاستلام المتوقع' : 'Expected Pick-up Location'}
                          className="w-full px-5 py-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                        />
                        <input
                          name="dropoffLocation"
                          value={formData.dropoffLocation}
                          onChange={handleChange}
                          placeholder={isAr ? 'موقع التسليم المتوقع' : 'Expected Drop-off Location'}
                          className="w-full px-5 py-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all font-medium"
                        />
                      </div>

                      <label className="flex items-center gap-3 p-4 border border-indigo-100 dark:border-indigo-900/50 rounded-xl bg-indigo-50/30 dark:bg-indigo-900/10 cursor-pointer hover:bg-indigo-50 dark:hover:bg-indigo-900/20 transition-colors">
                        <input 
                          type="checkbox" 
                          name="withDriver"
                          checked={formData.withDriver}
                          onChange={handleChange}
                          className="w-5 h-5 text-indigo-600 rounded focus:ring-indigo-500 accent-indigo-600"
                        />
                        <div className="flex-1">
                          <span className="block font-bold text-gray-900 dark:text-white">{isAr ? 'طلب سائق خاص' : 'Request Private Driver'}</span>
                          <span className="block text-xs text-gray-500 dark:text-gray-400 mt-0.5">{isAr ? '+50$ لليوم الإضافي' : '+$50/day additional cost'}</span>
                        </div>
                      </label>
                    </div>

                    <div className="space-y-4 pt-2">
                      <textarea
                        name="notes"
                        value={formData.notes}
                        onChange={handleChange}
                        placeholder={isAr ? 'ملاحظات أو طلبات إضافية (اختياري)' : 'Additional Notes or Requests (Optional)'}
                        className="w-full px-5 py-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 transition-all font-medium min-h-[100px]"
                      />
                    </div>

                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full py-4 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl font-black text-lg shadow-[0_10px_30px_rgba(99,102,241,0.3)] hover:shadow-[0_15px_40px_rgba(99,102,241,0.4)] hover:scale-[1.01] active:scale-[0.99] disabled:opacity-70 disabled:scale-100 transition-all"
                    >
                      {loading ? (isAr ? 'جارٍ المعالجة...' : 'Processing...') : (isAr ? 'تأكيد طلب التأجير' : 'Confirm Rental Request')}
                    </button>
                    <p className="text-center text-xs text-gray-400 font-medium">
                      {isAr ? 'لن يتم خصم أي مبالغ الآن. الدفع عند الاستلام.' : 'No charges will be made now. Pay upon pickup.'}
                    </p>
                  </form>
                </div>

                {/* Summary Sidebar */}
                <div className="bg-gray-50 dark:bg-gray-800 p-8 sm:p-10 border-l border-gray-100 dark:border-gray-700 flex flex-col h-full rounded-r-[2rem] lg:rounded-none">
                   
                   <div className="relative h-48 rounded-2xl overflow-hidden mb-8 shadow-lg border border-gray-200 dark:border-gray-700">
                     <Image src={car?.coverImage || '/img/default-car.jpg'} alt={title} fill className="object-cover" />
                     <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                       <div className="text-white font-black text-lg">{title}</div>
                       <div className="text-white/80 text-sm font-semibold">{car?.year} • {car?.brand}</div>
                     </div>
                   </div>

                   <h3 className="text-lg font-black text-gray-900 dark:text-white mb-6 uppercase tracking-wider pb-4 border-b border-gray-200 dark:border-gray-700">
                     {isAr ? 'ملخص التكلفة التقديرية' : 'Estimated Summary'}
                   </h3>

                   <div className="space-y-5 flex-1">
                      <div className="flex justify-between items-center text-gray-600 dark:text-gray-300 font-medium">
                        <span>{isAr ? 'السعر لليوم' : 'Price per day'}</span>
                        <span className="font-bold text-gray-900 dark:text-white">
                          ${car?.discount ? (car.pricePerDay * (1 - car.discount / 100)) : car?.pricePerDay}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center text-gray-600 dark:text-gray-300 font-medium">
                        <span>{isAr ? 'مدة التأجير' : 'Rental Duration'}</span>
                        <span className="font-bold text-gray-900 dark:text-white">
                          {computed.days} {isAr ? 'أيام' : 'days'}
                        </span>
                      </div>

                      {formData.withDriver && (
                        <div className="flex justify-between items-center text-indigo-600 dark:text-indigo-400 font-medium bg-indigo-50 dark:bg-indigo-900/20 p-3 rounded-xl">
                          <span>{isAr ? 'تكلفة السائق' : 'Driver Cost'}</span>
                          <span className="font-bold">
                            +${computed.driverCost}
                          </span>
                        </div>
                      )}

                      <div className="pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
                        <div className="flex justify-between items-end">
                          <span className="text-gray-900 dark:text-white font-black text-lg">{isAr ? 'الإجمالي التقديري' : 'Estimated Total'}</span>
                          <span className="text-4xl font-black text-indigo-600 dark:text-indigo-400 leading-none">
                            ${Math.round(computed.total || 0)}
                          </span>
                        </div>
                        <div className="text-right mt-2 text-xs text-gray-500">
                          {isAr ? 'شامل الضرائب والتأمين الأساسي' : 'Includes taxes & basic insurance'}
                        </div>
                      </div>
                   </div>

                   <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700 space-y-3">
                      <div className="flex items-start gap-3">
                        <span className="text-emerald-500 mt-0.5">✓</span>
                        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 leading-relaxed uppercase tracking-wide">
                          {isAr ? 'تأكيد فوري أو تواصل سريع من الإدارة.' : 'Instant confirmation or prompt follow-up.'}
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="text-emerald-500 mt-0.5">✓</span>
                        <p className="text-xs font-semibold text-gray-600 dark:text-gray-400 leading-relaxed uppercase tracking-wide">
                          {isAr ? 'سيارات نظيفة ومعقمة بالكامل.' : 'Fully sanitized and clean vehicles.'}
                        </p>
                      </div>
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
