'use client'

// ═══════════════════════════════════════════════════════════════════════
// 📰 Socotra News Page - Ultra Professional & Modern
// تصميم احترافي جداً وعصري ومبهر - متكامل 100%
// ═══════════════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react'
import { useApp } from '@/contexts/AppContext'
import WhatsAppButton from '@/components/WhatsAppButton'

export default function NewsPage() {
  const { locale, isDark } = useApp()
  const isAr = locale === 'ar'

  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedDay, setSelectedDay] = useState(0)
  const [currentTime, setCurrentTime] = useState(new Date())
  const [featuredIndex, setFeaturedIndex] = useState(0)

  // Update time
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000)
    return () => clearInterval(timer)
  }, [])

  // Auto-rotate featured
  useEffect(() => {
    const interval = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % 3)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  // Categories
  const categories = [
    { id: 'all', name: { ar: 'الكل', en: 'All' }, icon: '📰', count: 10 },
    { id: 'tourism', name: { ar: 'السياحة', en: 'Tourism' }, icon: '✈️', count: 4 },
    { id: 'environment', name: { ar: 'البيئة', en: 'Environment' }, icon: '🌿', count: 3 },
    { id: 'weather', name: { ar: 'الطقس', en: 'Weather' }, icon: '🌤️', count: 2 },
    { id: 'unesco', name: { ar: 'UNESCO', en: 'UNESCO' }, icon: '🏛️', count: 1 }
  ]

  // Featured News
  const featuredNews = [
    {
      id: 1,
      category: 'tourism',
      breaking: true,
      title: { ar: '🔥 سقطرى تسجل 5000 سائح في يناير', en: '🔥 Socotra Records 5,000 Tourists in January' },
      excerpt: { ar: 'ارتفاع قياسي بنسبة 40% مع رحلات جديدة', en: 'Record 40% increase with new flights' },
      date: '2024-02-06',
      readTime: '5 min',
      gradient: 'from-blue-600 to-indigo-700'
    },
    {
      id: 2,
      category: 'environment',
      breaking: false,
      title: { ar: 'اكتشاف 3 نباتات جديدة في جبال حجر', en: '3 New Plants Discovered in Haggier' },
      excerpt: { ar: 'فريق دولي يكتشف أنواعاً نباتية فريدة', en: 'International team finds unique species' },
      date: '2024-02-05',
      readTime: '7 min',
      gradient: 'from-green-600 to-emerald-700'
    },
    {
      id: 3,
      category: 'unesco',
      breaking: false,
      title: { ar: 'UNESCO: 2 مليون دولار لحماية دم الأخوين', en: 'UNESCO: $2M for Dragon Blood Protection' },
      excerpt: { ar: 'مشروع لحماية الأشجار المهددة', en: 'Project to protect endangered trees' },
      date: '2024-02-04',
      readTime: '6 min',
      gradient: 'from-purple-600 to-pink-700'
    }
  ]

  // News Articles
  const newsArticles = [
    { id: 4, category: 'tourism', title: { ar: '3 فنادق جديدة في حديبو', en: '3 New Hotels in Hadiboh' }, excerpt: { ar: 'استعداداً لموسم الذروة', en: 'Preparing for peak season' }, date: '2024-02-03', views: 1240, gradient: 'from-blue-500 to-cyan-600' },
    { id: 5, category: 'tourism', title: { ar: 'رحلات مباشرة من الرياض', en: 'Direct Flights from Riyadh' }, excerpt: { ar: 'طيران ناس تطلق رحلات أسبوعية', en: 'Flynas launches weekly flights' }, date: '2024-02-02', views: 2100, gradient: 'from-indigo-500 to-purple-600' },
    { id: 6, category: 'environment', title: { ar: 'نجاح برنامج إكثار النباتات', en: 'Plant Propagation Success' }, excerpt: { ar: '10,000 شتلة للتشجير', en: '10,000 seedlings produced' }, date: '2024-02-01', views: 890, gradient: 'from-green-500 to-teal-600' },
    { id: 7, category: 'environment', title: { ar: 'تنظيف الشواطئ: 2 طن نفايات', en: 'Beach Cleanup: 2 Tons' }, excerpt: { ar: 'مشاركة واسعة من المتطوعين', en: 'Wide volunteer participation' }, date: '2024-01-30', views: 1450, gradient: 'from-emerald-500 to-green-600' },
    { id: 8, category: 'weather', title: { ar: 'أمطار خفيفة في مارس', en: 'Light Rain in March' }, excerpt: { ar: 'مفيدة للغطاء النباتي', en: 'Beneficial for vegetation' }, date: '2024-01-28', views: 3200, gradient: 'from-blue-400 to-sky-600' },
    { id: 9, category: 'weather', title: { ar: 'حرارة مثالية حتى أبريل', en: 'Perfect Temps Until April' }, excerpt: { ar: '24-27°C للسياحة', en: '24-27°C for tourism' }, date: '2024-01-25', views: 1780, gradient: 'from-orange-400 to-amber-600' },
    { id: 10, category: 'unesco', title: { ar: 'ورشة دولية للتراث الطبيعي', en: 'International Heritage Workshop' }, excerpt: { ar: '15 خبيراً دولياً', en: '15 international experts' }, date: '2024-01-20', views: 670, gradient: 'from-purple-500 to-indigo-600' }
  ]

  // Weather Data
  const currentWeather = {
    temp: 26,
    feelsLike: 28,
    condition: { ar: 'صافي', en: 'Clear' },
    icon: '☀️',
    humidity: 65,
    windSpeed: 12,
    uvIndex: 7,
    sunrise: '06:15',
    sunset: '18:30'
  }

  const weeklyForecast = [
    { day: { ar: 'اليوم', en: 'Today' }, date: 'Feb 6', high: 26, low: 21, icon: '☀️', rain: 0 },
    { day: { ar: 'غداً', en: 'Tomorrow' }, date: 'Feb 7', high: 27, low: 22, icon: '⛅', rain: 10 },
    { day: { ar: 'الأربعاء', en: 'Wed' }, date: 'Feb 8', high: 28, low: 23, icon: '☀️', rain: 0 },
    { day: { ar: 'الخميس', en: 'Thu' }, date: 'Feb 9', high: 27, low: 22, icon: '🌤️', rain: 5 },
    { day: { ar: 'الجمعة', en: 'Fri' }, date: 'Feb 10', high: 26, low: 21, icon: '⛅', rain: 15 },
    { day: { ar: 'السبت', en: 'Sat' }, date: 'Feb 11', high: 25, low: 20, icon: '🌧️', rain: 40 },
    { day: { ar: 'الأحد', en: 'Sun' }, date: 'Feb 12', high: 26, low: 21, icon: '🌤️', rain: 10 }
  ]

  const filteredArticles = activeCategory === 'all' ? newsArticles : newsArticles.filter(a => a.category === activeCategory)

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero with Featured News */}
      <section className="relative h-[85vh] min-h-[700px] overflow-hidden">
        <div className="absolute inset-0">
          <div className={`absolute inset-0 bg-gradient-to-br ${featuredNews[featuredIndex].gradient} transition-all duration-1000`} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30" />
        </div>

        <div className="relative h-full flex items-center z-10">
          <div className="container mx-auto px-4 max-w-7xl">
            <div className="max-w-5xl">
              <div className="inline-flex items-center gap-3 bg-red-500/95 backdrop-blur-md px-6 py-3 rounded-full mb-6 shadow-lg">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                </span>
                <span className="text-white text-sm font-bold uppercase">{isAr ? 'أخبار حية' : 'LIVE'}</span>
                <span className="text-white/80 text-sm">{currentTime.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' })}</span>
              </div>

              {featuredNews[featuredIndex].breaking && (
                <div className="inline-block bg-yellow-400 text-gray-900 px-4 py-2 rounded-lg font-bold text-sm mb-4 animate-pulse">
                  ⚡ {isAr ? 'عاجل' : 'BREAKING'}
                </div>
              )}

              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                {featuredNews[featuredIndex].title[locale]}
              </h1>

              <p className="text-xl md:text-2xl text-gray-200 mb-8 leading-relaxed">
                {featuredNews[featuredIndex].excerpt[locale]}
              </p>

              <div className="flex flex-wrap gap-6 mb-8 text-white/90">
                <span>{new Date(featuredNews[featuredIndex].date).toLocaleDateString(locale, { month: 'long', day: 'numeric' })}</span>
                <span>• {featuredNews[featuredIndex].readTime}</span>
                <span>• {categories.find(c => c.id === featuredNews[featuredIndex].category)?.name[locale]}</span>
              </div>

              <div className="flex gap-4">
                <a href="#latest-news" className="btn btn-primary px-8 py-4">{isAr ? 'المزيد' : 'Read More'}</a>
                <a href="#weather" className="btn btn-outline border-2 border-white text-white hover:bg-white hover:text-gray-900 px-8 py-4">{isAr ? 'الطقس' : 'Weather'}</a>
              </div>

              <div className="flex gap-3 mt-12">
                {featuredNews.map((_, i) => (
                  <button key={i} onClick={() => setFeaturedIndex(i)} className={`h-2 rounded-full transition-all ${i === featuredIndex ? 'w-12 bg-white' : 'w-2 bg-white/50'}`} />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Weather Widget */}
      <section id="weather" className="py-16 bg-gradient-to-b from-blue-50 to-white dark:from-blue-900/20 dark:to-gray-900 -mt-20 relative z-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
            <div className="bg-gradient-to-r from-blue-500 via-indigo-600 to-purple-600 p-12 text-white">
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-7xl">{currentWeather.icon}</span>
                    <div>
                      <div className="text-6xl font-bold">{currentWeather.temp}°C</div>
                      <div className="text-xl opacity-90">{isAr ? 'يشعر بـ' : 'Feels'} {currentWeather.feelsLike}°C</div>
                    </div>
                  </div>
                  <h3 className="text-3xl font-bold mb-2">{currentWeather.condition[locale]}</h3>
                  <p className="text-white/80">Socotra • {isAr ? 'الآن' : 'Now'}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl">
                    <div className="text-sm mb-1">{isAr ? 'الرطوبة' : 'Humidity'}</div>
                    <div className="text-2xl font-bold">{currentWeather.humidity}%</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl">
                    <div className="text-sm mb-1">{isAr ? 'الرياح' : 'Wind'}</div>
                    <div className="text-2xl font-bold">{currentWeather.windSpeed} km/h</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl">
                    <div className="text-sm mb-1">{isAr ? 'UV' : 'UV Index'}</div>
                    <div className="text-2xl font-bold">{currentWeather.uvIndex}</div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-4 rounded-xl">
                    <div className="text-sm mb-1">{isAr ? 'الشروق' : 'Sunrise'}</div>
                    <div className="text-xl font-bold">{currentWeather.sunrise}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-8">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{isAr ? 'توقعات 7 أيام' : '7-Day Forecast'}</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
                {weeklyForecast.map((day, i) => (
                  <div key={i} className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${selectedDay === i ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-500' : 'bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700'}`} onClick={() => setSelectedDay(i)}>
                    <div className="text-center">
                      <div className="font-bold text-gray-900 dark:text-white mb-1">{day.day[locale]}</div>
                      <div className="text-xs text-gray-500 mb-3">{day.date}</div>
                      <div className="text-4xl mb-3">{day.icon}</div>
                      <div className="flex justify-center gap-2 text-sm">
                        <span className="font-bold">{day.high}°</span>
                        <span className="text-gray-500">{day.low}°</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="py-8 bg-white dark:bg-gray-800 sticky top-20 z-40 border-b border-gray-200 dark:border-gray-700 shadow">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="flex overflow-x-auto gap-4 pb-2">
            {categories.map(cat => (
              <button key={cat.id} onClick={() => setActiveCategory(cat.id)} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold whitespace-nowrap transition-all ${activeCategory === cat.id ? 'bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-lg scale-105' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200'}`}>
                <span className="text-xl">{cat.icon}</span>
                <span>{cat.name[locale]}</span>
                <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${activeCategory === cat.id ? 'bg-white/20' : 'bg-gray-200 dark:bg-gray-600'}`}>{cat.count}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News Grid */}
      <section id="latest-news" className="py-20 bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 max-w-7xl">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-12 text-center">{isAr ? 'آخر الأخبار' : 'Latest News'}</h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredArticles.map((article, i) => (
              <div key={article.id} className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 animate-fade-in" style={{animationDelay: `${i * 0.1}s`}}>
                <div className={`h-48 bg-gradient-to-br ${article.gradient} flex items-center justify-center text-6xl text-white/30`}>
                  {categories.find(c => c.id === article.category)?.icon}
                </div>

                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full text-xs font-bold">{categories.find(c => c.id === article.category)?.name[locale]}</span>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2">{article.title[locale]}</h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{article.excerpt[locale]}</p>

                  <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-500 pt-4 border-t border-gray-200 dark:border-gray-700">
                    <span>{new Date(article.date).toLocaleDateString(locale, { month: 'short', day: 'numeric' })}</span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                        <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                      </svg>
                      {article.views}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-4xl font-bold mb-6">{isAr ? 'ابق على اطلاع' : 'Stay Updated'}</h2>
          <p className="text-xl mb-8">{isAr ? 'اشترك للحصول على آخر الأخبار' : 'Subscribe for latest news'}</p>
          <div className="flex gap-4 justify-center">
            <input type="email" placeholder={isAr ? 'بريدك الإلكتروني' : 'Your email'} className="px-6 py-4 rounded-xl w-full max-w-md text-gray-900" />
            <button className="btn bg-white text-blue-600 px-8 py-4 hover:bg-gray-100">{isAr ? 'اشترك' : 'Subscribe'}</button>
          </div>
        </div>
      </section>

      <WhatsAppButton />
    </div>
  )
}