'use client';
import { useState } from 'react';

/**
 * نموذج التواصل الاحترافي
 * Professional Contact Form Component
 */

export default function ContactForm({ tour = null }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    tourInterest: tour || '',
    numberOfPeople: '2',
    preferredDate: '',
    message: '',
    language: 'ar'
  });
  
  const [status, setStatus] = useState('idle'); // idle, sending, success, error
  const [errorMessage, setErrorMessage] = useState('');
  
  // معالجة التغييرات في الحقول
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // معالجة إرسال النموذج
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('sending');
    setErrorMessage('');
    
    try {
      // إرسال البيانات إلى API
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setStatus('success');
        // إعادة تعيين النموذج
        setFormData({
          name: '',
          email: '',
          phone: '',
          tourInterest: tour || '',
          numberOfPeople: '2',
          preferredDate: '',
          message: '',
          language: 'ar'
        });
        
        // إخفاء رسالة النجاح بعد 5 ثواني
        setTimeout(() => {
          setStatus('idle');
        }, 5000);
      } else {
        setStatus('error');
        setErrorMessage(data.error || 'حدث خطأ في الإرسال');
      }
    } catch (error) {
      setStatus('error');
      setErrorMessage('فشل الاتصال بالخادم. يرجى المحاولة مرة أخرى.');
      console.error('Contact form error:', error);
    }
  };
  
  // قائمة الرحلات
  const tours = [
    { value: '', label: 'اختر رحلة (اختياري)' },
    { value: 'camping-adventure', label: 'مغامرة التخييم - 7 أيام' },
    { value: 'full-camping', label: 'تخييم كامل - 7 أيام' },
    { value: 'mixed-camping-hotel', label: 'تخييم + فندق - 7 أيام' },
    { value: 'comprehensive-adventure', label: 'مغامرة شاملة - 10 أيام' },
    { value: 'boat-dolphins', label: 'رحلة بحرية ودلافين - 3 أيام' },
    { value: 'family-adventure', label: 'باقة عائلية - 7 أيام' },
    { value: 'custom', label: 'رحلة مخصصة' }
  ];
  
  return (
    <div className="bg-white rounded-2xl shadow-xl p-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-right">
        📧 راسلنا
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6" dir="rtl">
        {/* الاسم */}
        <div>
          <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
            الاسم الكامل <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-all"
            placeholder="أدخل اسمك الكامل"
          />
        </div>
        
        {/* البريد الإلكتروني */}
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
            البريد الإلكتروني <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-all"
            placeholder="example@email.com"
            dir="ltr"
          />
        </div>
        
        {/* رقم الهاتف */}
        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
            رقم الهاتف / واتساب <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            id="phone"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-all"
            placeholder="+966 XX XXX XXXX"
            dir="ltr"
          />
        </div>
        
        {/* الرحلة المهتم بها */}
        <div>
          <label htmlFor="tourInterest" className="block text-sm font-semibold text-gray-700 mb-2">
            الرحلة المهتم بها
          </label>
          <select
            id="tourInterest"
            name="tourInterest"
            value={formData.tourInterest}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-all"
          >
            {tours.map(tour => (
              <option key={tour.value} value={tour.value}>
                {tour.label}
              </option>
            ))}
          </select>
        </div>
        
        {/* عدد الأشخاص والتاريخ */}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label htmlFor="numberOfPeople" className="block text-sm font-semibold text-gray-700 mb-2">
              عدد الأشخاص
            </label>
            <select
              id="numberOfPeople"
              name="numberOfPeople"
              value={formData.numberOfPeople}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-all"
            >
              {[1,2,3,4,5,6,7,8,9,10,11,12].map(num => (
                <option key={num} value={num}>{num} {num === 1 ? 'شخص' : 'أشخاص'}</option>
              ))}
              <option value="13+">أكثر من 12 شخص</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="preferredDate" className="block text-sm font-semibold text-gray-700 mb-2">
              التاريخ المفضل
            </label>
            <input
              type="date"
              id="preferredDate"
              name="preferredDate"
              value={formData.preferredDate}
              onChange={handleChange}
              min={new Date().toISOString().split('T')[0]}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-all"
            />
          </div>
        </div>
        
        {/* الرسالة */}
        <div>
          <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
            رسالتك <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            value={formData.message}
            onChange={handleChange}
            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-all resize-none"
            placeholder="اكتب استفسارك أو طلبك هنا..."
          />
        </div>
        
        {/* زر الإرسال */}
        <button
          type="submit"
          disabled={status === 'sending'}
          className={`
            w-full py-4 px-6 rounded-lg font-bold text-lg transition-all duration-300
            ${status === 'sending' 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
            }
            text-white
          `}
        >
          {status === 'sending' ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"/>
              </svg>
              جاري الإرسال...
            </span>
          ) : (
            'إرسال الرسالة 📨'
          )}
        </button>
        
        {/* رسالة النجاح */}
        {status === 'success' && (
          <div className="bg-green-50 border-2 border-green-500 text-green-800 px-6 py-4 rounded-lg animate-fade-in">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-bold">تم إرسال رسالتك بنجاح!</p>
                <p className="text-sm mt-1">سنتواصل معك في أقرب وقت ممكن.</p>
              </div>
            </div>
          </div>
        )}
        
        {/* رسالة الخطأ */}
        {status === 'error' && (
          <div className="bg-red-50 border-2 border-red-500 text-red-800 px-6 py-4 rounded-lg animate-fade-in">
            <div className="flex items-center gap-3">
              <svg className="w-6 h-6 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="font-bold">حدث خطأ!</p>
                <p className="text-sm mt-1">{errorMessage || 'يرجى المحاولة مرة أخرى أو التواصل عبر واتساب.'}</p>
              </div>
            </div>
          </div>
        )}
      </form>
      
      {/* خيارات التواصل البديلة */}
      <div className="mt-8 pt-8 border-t-2 border-gray-200">
        <p className="text-center text-gray-600 mb-4">أو تواصل معنا مباشرة:</p>
        <div className="flex justify-center gap-4">
          <a
            href="https://wa.me/967772371581"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-all transform hover:scale-105"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
            </svg>
            واتساب
          </a>
          
          <a
            href="tel:+967772371581"
            className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg transition-all transform hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            اتصل بنا
          </a>
        </div>
      </div>
    </div>
  );
}
