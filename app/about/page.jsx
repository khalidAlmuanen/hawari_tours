'use client'

// ═══════════════════════════════════════════════════════════════════════
// 📄 ملف: app/about/page.jsx
// الوصف: صفحة من نحن - احترافية ومبهرة 100% (يدعم الترجمة + Dark Mode)
// ═══════════════════════════════════════════════════════════════════════

import Image from 'next/image'
import WhatsAppButton from '@/components/WhatsAppButton'
import { useApp } from '@/contexts/AppContext'

export default function AboutPage() {
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

  const pick = (obj, fallbackAr, fallbackEn) => {
    if (!obj) return isAr ? fallbackAr : fallbackEn
    return obj?.[locale] || obj?.en || obj?.ar || (isAr ? fallbackAr : fallbackEn)
  }

  const stats = [
    { number: '5000+', label: { ar: 'سائح سعيد', en: 'Happy Tourists' }, icon: '😊' },
    { number: '10+', label: { ar: 'سنوات خبرة', en: 'Years Experience' }, icon: '⭐' },
    { number: '50+', label: { ar: 'رحلة مميزة', en: 'Featured Tours' }, icon: '🏔️' },
    { number: '100%', label: { ar: 'رضا العملاء', en: 'Client Satisfaction' }, icon: '💯' }
  ]

  const team = [
    {
      name: { ar: 'أحمد الحواري', en: 'Ahmed Al-Hawari' },
      role: { ar: 'المؤسس والمدير', en: 'Founder & Director' },
      image: '/img/team/member-1.jpg',
      bio: { ar: 'خبير سياحي بخبرة 15 عاماً في استكشاف سقطرى', en: 'Tourism expert with 15 years of experience exploring Socotra' }
    },
    {
      name: { ar: 'محمد سالم', en: 'Mohammed Salem' },
      role: { ar: 'مرشد سياحي أول', en: 'Senior Tour Guide' },
      image: '/img/team/member-2.jpg',
      bio: { ar: 'متخصص في الرحلات البحرية والغوص', en: 'Specialized in marine trips and diving' }
    },
    {
      name: { ar: 'فاطمة علي', en: 'Fatima Ali' },
      role: { ar: 'منسقة الرحلات', en: 'Tour Coordinator' },
      image: '/img/team/member-3.jpg',
      bio: { ar: 'خبيرة في تنظيم الرحلات العائلية', en: 'Expert in organizing family trips' }
    }
  ]

  const values = [
    {
      icon: '🎯',
      title: { ar: 'الاحترافية', en: 'Professionalism' },
      description: { ar: 'نلتزم بأعلى معايير الجودة والاحترافية في كل رحلة', en: 'We follow the highest standards of quality and professionalism in every trip' }
    },
    {
      icon: '🤝',
      title: { ar: 'الأمانة', en: 'Integrity' },
      description: { ar: 'الشفافية والصدق في التعامل مع جميع عملائنا', en: 'Transparency and honesty in dealing with all our clients' }
    },
    {
      icon: '💚',
      title: { ar: 'الاستدامة', en: 'Sustainability' },
      description: { ar: 'نحافظ على البيئة ونساهم في التنمية المستدامة', en: 'We protect the environment and support sustainable development' }
    },
    {
      icon: '⭐',
      title: { ar: 'التميز', en: 'Excellence' },
      description: { ar: 'نسعى دائماً لتقديم تجارب استثنائية لا تُنسى', en: 'We always aim to deliver exceptional unforgettable experiences' }
    }
  ]

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-green-50 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950"
      dir={isRTL ? 'rtl' : 'ltr'}
    >
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <div className="absolute inset-0">
          <Image
            src="/img/about/story.jpg"
            alt={isAr ? 'من نحن' : 'About Us'}
            fill
            priority
            quality={95}
            sizes="100vw"
            className="object-cover object-center scale-[1.02] contrast-110 saturate-110"
          />

          {/* Overlay أخف + يحافظ على وضوح الصورة */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-black/25 to-black/35" />
          {/* لمسة لون خفيفة */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 via-blue-500/10 to-purple-500/10" />
        </div>

        <div className="relative h-full flex items-center justify-center text-center">
          <div className="max-w-4xl mx-auto px-4">
            <div className="inline-block px-6 py-2 bg-white/20 backdrop-blur-md rounded-full text-white text-sm font-semibold mb-6 animate-fade-in">
              {tt('nav.about', 'من نحن', 'About Us')}
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 animate-slide-in-right drop-shadow-[0_6px_18px_rgba(0,0,0,0.45)]">
              {isAr ? (
                <>
                  رحلتك إلى <span className="text-yellow-300">الجنة</span> تبدأ هنا
                </>
              ) : (
                <>
                  Your journey to <span className="text-yellow-300">paradise</span> starts here
                </>
              )}
            </h1>

            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto leading-relaxed animate-slide-in-left drop-shadow-[0_4px_12px_rgba(0,0,0,0.35)]">
              {isAr ? 'منذ أكثر من عقد ونحن نشارك جمال سقطرى مع العالم' : 'For over a decade, we have been sharing Socotra’s beauty with the world'}
            </p>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 -mt-20 relative z-10">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-900 rounded-2xl p-8 text-center shadow-xl hover:shadow-2xl transition-all transform hover:-translate-y-2 animate-fade-in border border-transparent dark:border-gray-800"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="text-5xl mb-4">{stat.icon}</div>
                <div className="text-4xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600 dark:text-gray-300 font-semibold">
                  {pick(stat.label, stat.label.ar, stat.label.en)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/img/about/story.jpg"
                  alt={isAr ? 'قصتنا' : 'Our Story'}
                  fill
                  className="object-cover"
                />
              </div>

              <div
                className={`absolute -bottom-8 ${isRTL ? '-right-8' : '-left-8'} bg-white dark:bg-gray-900 p-8 rounded-2xl shadow-2xl max-w-xs border border-transparent dark:border-gray-800`}
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center text-3xl">
                    ✨
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white">2014</div>
                    <div className="text-gray-600 dark:text-gray-300">{isAr ? 'سنة التأسيس' : 'Founded'}</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="inline-block px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-semibold mb-4">
                {isAr ? 'قصتنا' : 'Our Story'}
              </div>

              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                {isAr ? (
                  <>
                    كيف بدأت{' '}
                    <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      رحلتنا
                    </span>
                  </>
                ) : (
                  <>
                    How our{' '}
                    <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                      journey
                    </span>{' '}
                    started
                  </>
                )}
              </h2>

              <div className="space-y-4 text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                <p>
                  {isAr ? (
                    <>
                      بدأت <strong className="text-gray-900 dark:text-white">حواري للسياحة</strong> في عام 2014 من حلم بسيط: مشاركة جمال
                      جزيرة سقطرى الفريد مع العالم. كانت البداية متواضعة، لكن الشغف كان كبيراً.
                    </>
                  ) : (
                    <>
                      <strong className="text-gray-900 dark:text-white">Hawari Tourism</strong> began in 2014 with a simple dream:
                      sharing Socotra’s unique beauty with the world. The beginning was humble, but the passion was huge.
                    </>
                  )}
                </p>

                <p>
                  {isAr ? (
                    <>
                      على مدى السنوات، نجحنا في تحويل هذا الحلم إلى واقع ملموس. استقبلنا آلاف السياح
                      من مختلف أنحاء العالم، وقدمنا لهم تجارب لا تُنسى في هذه الجنة الطبيعية.
                    </>
                  ) : (
                    <>
                      Over the years, we turned this dream into reality. We welcomed thousands of travelers from around
                      the world and delivered unforgettable experiences in this natural paradise.
                    </>
                  )}
                </p>

                <p>
                  {isAr ? (
                    <>
                      اليوم، نحن فخورون بأن نكون <strong className="text-green-600 dark:text-green-400">الوكالة السياحية الرائدة</strong> في سقطرى،
                      معروفون بالاحترافية، الأمانة، والتزامنا بحماية البيئة.
                    </>
                  ) : (
                    <>
                      Today, we’re proud to be a <strong className="text-green-600 dark:text-green-400">leading travel agency</strong> in Socotra,
                      known for professionalism, integrity, and our commitment to protecting nature.
                    </>
                  )}
                </p>
              </div>

              <div className="mt-8 grid grid-cols-2 gap-4">
                {[
                  { ar: 'مرشدون محليون خبراء', en: 'Expert local guides' },
                  { ar: 'أسعار شفافة وعادلة', en: 'Transparent & fair pricing' },
                  { ar: 'معدات عالية الجودة', en: 'High-quality equipment' },
                  { ar: 'دعم 24/7', en: '24/7 Support' }
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                      <svg className="w-4 h-4 text-green-600 dark:text-green-300" fill="currentColor" viewBox="0 0 20 20">
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <span className="text-gray-700 dark:text-gray-200 font-semibold">{isAr ? item.ar : item.en}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-white dark:bg-gray-950">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-semibold mb-4">
              {isAr ? 'قيمنا' : 'Our Values'}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {isAr ? (
                <>
                  ما يميزنا{' '}
                  <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    عن الآخرين
                  </span>
                </>
              ) : (
                <>
                  What makes us{' '}
                  <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    different
                  </span>
                </>
              )}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="text-center p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-green-50 dark:from-gray-900 dark:to-gray-900 hover:shadow-xl transition-all transform hover:-translate-y-2 border border-transparent dark:border-gray-800"
              >
                <div className="text-6xl mb-4">{value.icon}</div>
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                  {pick(value.title, value.title.ar, value.title.en)}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {pick(value.description, value.description.ar, value.description.en)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-950 dark:to-gray-900">
        <div className="container mx-auto px-4 max-w-7xl">
          <div className="text-center mb-16">
            <div className="inline-block px-4 py-2 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 rounded-full text-sm font-semibold mb-4">
              {isAr ? 'فريقنا' : 'Our Team'}
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {isAr ? (
                <>
                  تعرف على{' '}
                  <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    فريق العمل
                  </span>
                </>
              ) : (
                <>
                  Meet our{' '}
                  <span className="bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                    team
                  </span>
                </>
              )}
            </h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div
                key={index}
                className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2 group border border-transparent dark:border-gray-800"
              >
                <div className="relative h-80 overflow-hidden">
                  <Image
                    src={member.image}
                    alt={pick(member.name, member.name.ar, member.name.en)}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <h3 className="text-2xl font-bold mb-1">{pick(member.name, member.name.ar, member.name.en)}</h3>
                    <p className="text-green-300 font-semibold">{pick(member.role, member.role.ar, member.role.en)}</p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{pick(member.bio, member.bio.ar, member.bio.en)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600 via-emerald-600 to-teal-600"></div>
        <div className="absolute inset-0 opacity-10 bg-pattern-dots"></div>

        <div className="relative container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-4xl md:text-6xl font-bold text-white mb-6">
            {isAr ? 'هل أنت مستعد للمغامرة؟' : 'Ready for an adventure?'}
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            {isAr
              ? 'انضم إلى آلاف المسافرين السعداء واستكشف جمال سقطرى معنا'
              : 'Join thousands of happy travelers and explore Socotra’s beauty with us'}
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <a
              href="/tours"
              className="btn btn-primary bg-white text-green-600 hover:bg-gray-100 inline-flex items-center gap-2 text-lg px-8 py-4 rounded-xl font-bold shadow-xl"
            >
              {isAr ? 'استكشف الرحلات' : 'Explore Tours'}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </a>

            <a
              href="/contact"
              className="btn btn-outline border-2 border-white text-white hover:bg-white hover:text-green-600 inline-flex items-center gap-2 text-lg px-8 py-4 rounded-xl font-bold"
            >
              {isAr ? 'تواصل معنا' : 'Contact Us'}
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      <WhatsAppButton />
    </div>
  )
}
