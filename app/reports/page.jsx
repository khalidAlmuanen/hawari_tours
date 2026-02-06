'use client'

// ═══════════════════════════════════════════════════════════════════════
// 📊 Socotra Reports Page - Hawari Tours (احترافية 100%)
// ✅ متطلبات PDF:
//    1. UNESCO Reports (status, conservation, challenges)
//    2. Government & NGO Reports (environmental, tourism development)
//    3. Scientific Research (biodiversity, climate change impact)
// ✨ تصميم عصري وفخم ومبهر جداً
// ═══════════════════════════════════════════════════════════════════════

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useApp } from '@/contexts/AppContext'

export default function ReportsPage() {
  const { locale, isDark } = useApp()
  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')

  // ═══════════════════════════════════════════════════════════════
  // Report Categories
  // ═══════════════════════════════════════════════════════════════
  const reportCategories = [
    {
      id: 'all',
      name: { ar: 'جميع التقارير', en: 'All Reports' },
      icon: '📚',
      gradient: 'from-gray-500 to-gray-700'
    },
    {
      id: 'unesco',
      name: { ar: 'تقارير اليونسكو', en: 'UNESCO Reports' },
      icon: '🏛️',
      gradient: 'from-blue-500 to-indigo-600'
    },
    {
      id: 'government',
      name: { ar: 'تقارير حكومية', en: 'Government Reports' },
      icon: '🏛️',
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      id: 'ngo',
      name: { ar: 'تقارير المنظمات', en: 'NGO Reports' },
      icon: '🌍',
      gradient: 'from-purple-500 to-pink-600'
    },
    {
      id: 'scientific',
      name: { ar: 'أبحاث علمية', en: 'Scientific Research' },
      icon: '🔬',
      gradient: 'from-orange-500 to-red-600'
    }
  ]

  // ═══════════════════════════════════════════════════════════════
  // Reports Data
  // ═══════════════════════════════════════════════════════════════
  const reports = [
    // UNESCO Reports
    {
      id: 1,
      category: 'unesco',
      title: {
        ar: 'حالة الحفظ لموقع سقطرى للتراث العالمي - 2024',
        en: 'State of Conservation - Socotra World Heritage Site 2024'
      },
      description: {
        ar: 'تقرير شامل عن حالة الحفظ الحالية لموقع سقطرى كتراث عالمي، يتضمن التحديات والإنجازات في مجال الحفاظ على التنوع البيولوجي والثقافي.',
        en: 'Comprehensive report on current conservation status of Socotra World Heritage Site, including challenges and achievements in biodiversity and cultural preservation.'
      },
      year: 2024,
      pages: 156,
      language: { ar: 'عربي/إنجليزي', en: 'Arabic/English' },
      fileSize: '12.5 MB',
      downloadUrl: '#',
      featured: true,
      topics: ['Conservation', 'Biodiversity', 'Cultural Heritage']
    },
    {
      id: 2,
      category: 'unesco',
      title: {
        ar: 'جهود الحفاظ على شجرة دم الأخوين',
        en: 'Dragon Blood Tree Conservation Efforts'
      },
      description: {
        ar: 'دراسة تفصيلية حول البرامج والمبادرات المتخذة للحفاظ على شجرة دم الأخوين المهددة بالانقراض.',
        en: 'Detailed study on programs and initiatives to preserve the endangered Dragon Blood Tree.'
      },
      year: 2023,
      pages: 89,
      language: { ar: 'إنجليزي', en: 'English' },
      fileSize: '8.2 MB',
      downloadUrl: '#',
      featured: true,
      topics: ['Flora', 'Endangered Species', 'Conservation']
    },
    {
      id: 3,
      category: 'unesco',
      title: {
        ar: 'التحديات والفرص في إدارة التراث العالمي',
        en: 'Challenges and Opportunities in World Heritage Management'
      },
      description: {
        ar: 'تحليل شامل للتحديات التي تواجه إدارة موقع سقطرى والفرص المتاحة للتطوير المستدام.',
        en: 'Comprehensive analysis of challenges facing Socotra site management and opportunities for sustainable development.'
      },
      year: 2023,
      pages: 124,
      language: { ar: 'عربي/إنجليزي', en: 'Arabic/English' },
      fileSize: '10.8 MB',
      downloadUrl: '#',
      featured: false,
      topics: ['Management', 'Sustainability', 'Development']
    },

    // Government Reports
    {
      id: 4,
      category: 'government',
      title: {
        ar: 'استراتيجية تطوير السياحة البيئية في سقطرى 2024-2030',
        en: 'Eco-Tourism Development Strategy for Socotra 2024-2030'
      },
      description: {
        ar: 'خطة استراتيجية شاملة لتطوير السياحة البيئية المستدامة في سقطرى خلال السنوات القادمة.',
        en: 'Comprehensive strategic plan for sustainable eco-tourism development in Socotra over coming years.'
      },
      year: 2024,
      pages: 210,
      language: { ar: 'عربي', en: 'Arabic' },
      fileSize: '15.3 MB',
      downloadUrl: '#',
      featured: true,
      topics: ['Tourism', 'Strategy', 'Sustainability']
    },
    {
      id: 5,
      category: 'government',
      title: {
        ar: 'تقرير البيئة السنوي - سقطرى 2023',
        en: 'Annual Environmental Report - Socotra 2023'
      },
      description: {
        ar: 'تقرير سنوي يوثق الحالة البيئية للجزيرة ويسلط الضوء على التحديات والإنجازات.',
        en: 'Annual report documenting island environmental status highlighting challenges and achievements.'
      },
      year: 2023,
      pages: 178,
      language: { ar: 'عربي/إنجليزي', en: 'Arabic/English' },
      fileSize: '13.7 MB',
      downloadUrl: '#',
      featured: false,
      topics: ['Environment', 'Annual Report', 'Statistics']
    },

    // NGO Reports
    {
      id: 6,
      category: 'ngo',
      title: {
        ar: 'حماية السلاحف البحرية في سقطرى',
        en: 'Sea Turtle Protection in Socotra'
      },
      description: {
        ar: 'تقرير من جمعية حماية البيئة حول برامج حماية السلاحف البحرية ومواقع التعشيش.',
        en: 'Report from Environmental Protection Society on sea turtle protection programs and nesting sites.'
      },
      year: 2024,
      pages: 67,
      language: { ar: 'إنجليزي', en: 'English' },
      fileSize: '5.4 MB',
      downloadUrl: '#',
      featured: false,
      topics: ['Marine Life', 'Protection', 'Wildlife']
    },
    {
      id: 7,
      category: 'ngo',
      title: {
        ar: 'مشروع تنمية المجتمع المحلي في سقطرى',
        en: 'Local Community Development Project in Socotra'
      },
      description: {
        ar: 'توثيق لمشاريع التنمية المجتمعية وتأثيرها على حياة السكان المحليين.',
        en: 'Documentation of community development projects and their impact on local residents lives.'
      },
      year: 2023,
      pages: 95,
      language: { ar: 'عربي', en: 'Arabic' },
      fileSize: '7.8 MB',
      downloadUrl: '#',
      featured: false,
      topics: ['Community', 'Development', 'Social Impact']
    },

    // Scientific Research
    {
      id: 8,
      category: 'scientific',
      title: {
        ar: 'دراسة التنوع البيولوجي في أرخبيل سقطرى',
        en: 'Biodiversity Study of Socotra Archipelago'
      },
      description: {
        ar: 'بحث علمي شامل يوثق الأنواع المستوطنة ويحلل التنوع البيولوجي الفريد في الجزيرة.',
        en: 'Comprehensive scientific research documenting endemic species and analyzing unique biodiversity.'
      },
      year: 2024,
      pages: 342,
      language: { ar: 'إنجليزي', en: 'English' },
      fileSize: '28.4 MB',
      downloadUrl: '#',
      featured: true,
      topics: ['Biodiversity', 'Endemic Species', 'Research']
    },
    {
      id: 9,
      category: 'scientific',
      title: {
        ar: 'تأثير تغير المناخ على النظام البيئي في سقطرى',
        en: 'Climate Change Impact on Socotra Ecosystem'
      },
      description: {
        ar: 'دراسة متعمقة حول تأثيرات التغير المناخي على النباتات والحيوانات المستوطنة في سقطرى.',
        en: 'In-depth study on climate change effects on endemic flora and fauna in Socotra.'
      },
      year: 2023,
      pages: 189,
      language: { ar: 'إنجليزي', en: 'English' },
      fileSize: '16.2 MB',
      downloadUrl: '#',
      featured: true,
      topics: ['Climate Change', 'Ecosystem', 'Impact Study']
    },
    {
      id: 10,
      category: 'scientific',
      title: {
        ar: 'الخصائص الجيولوجية الفريدة لجزيرة سقطرى',
        en: 'Unique Geological Features of Socotra Island'
      },
      description: {
        ar: 'بحث جيولوجي يستكشف التكوينات الصخرية النادرة والتاريخ الجيولوجي للجزيرة.',
        en: 'Geological research exploring rare rock formations and geological history of the island.'
      },
      year: 2023,
      pages: 156,
      language: { ar: 'إنجليزي', en: 'English' },
      fileSize: '19.6 MB',
      downloadUrl: '#',
      featured: false,
      topics: ['Geology', 'Rock Formations', 'History']
    }
  ]

  // ═══════════════════════════════════════════════════════════════
  // Statistics
  // ═══════════════════════════════════════════════════════════════
  const statistics = [
    {
      number: '700+',
      label: { ar: 'نوع مستوطن', en: 'Endemic Species' },
      icon: '🌿',
      gradient: 'from-green-500 to-emerald-600'
    },
    {
      number: '37%',
      label: { ar: 'نباتات فريدة', en: 'Unique Plants' },
      icon: '🌺',
      gradient: 'from-pink-500 to-rose-600'
    },
    {
      number: '90%',
      label: { ar: 'زواحف مستوطنة', en: 'Endemic Reptiles' },
      icon: '🦎',
      gradient: 'from-orange-500 to-red-600'
    },
    {
      number: '2008',
      label: { ar: 'تراث عالمي', en: 'World Heritage' },
      icon: '🏛️',
      gradient: 'from-blue-500 to-indigo-600'
    }
  ]

  // Filter reports
  const filteredReports = reports.filter(report => {
    const matchesCategory = activeCategory === 'all' || report.category === activeCategory
    const matchesSearch = searchQuery === '' || 
      report.title.ar.toLowerCase().includes(searchQuery.toLowerCase()) ||
      report.title.en.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  // Featured reports
  const featuredReports = reports.filter(r => r.featured)

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Hero Section */}
      <section className="relative h-[70vh] min-h-[600px] overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600" />
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 to-black/40" />
        </div>

        <div className="relative h-full flex items-center z-10">
          <div className="container-custom">
            <div className="max-w-4xl">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-6 py-3 rounded-full mb-6">
                <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 4.804A7.968 7.968 0 005.5 4c-1.255 0-2.443.29-3.5.804v10A7.969 7.969 0 015.5 14c1.669 0 3.218.51 4.5 1.385A7.962 7.962 0 0114.5 14c1.255 0 2.443.29 3.5.804v-10A7.968 7.968 0 0014.5 4c-1.255 0-2.443.29-3.5.804V12a1 1 0 11-2 0V4.804z" />
                </svg>
                <span className="text-white font-semibold">
                  {locale === 'ar' ? 'مكتبة التقارير' : 'Reports Library'}
                </span>
              </div>

              <h1 className="text-5xl md:text-7xl font-bold text-white mb-6">
                {locale === 'ar' ? 'تقارير' : 'Socotra'}
                <br />
                <span className="text-gradient bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {locale === 'ar' ? 'سقطرى' : 'Reports'}
                </span>
              </h1>

              <p className="text-xl text-gray-200 mb-8">
                {locale === 'ar'
                  ? 'تقارير اليونسكو، الدراسات الحكومية، أبحاث المنظمات، والأبحاث العلمية'
                  : 'UNESCO reports, government studies, NGO research, and scientific papers'}
              </p>

              <div className="flex gap-4">
                <a href="#reports" className="btn btn-primary">
                  {locale === 'ar' ? 'تصفح التقارير' : 'Browse Reports'}
                </a>
                <a href="#statistics" className="btn btn-outline border-white text-white hover:bg-white hover:text-blue-600">
                  {locale === 'ar' ? 'الإحصائيات' : 'Statistics'}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          Statistics Section
          ═══════════════════════════════════════════════════════════════ */}
      <section id="statistics" className="py-16 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {locale === 'ar' ? 'إحصائيات' : 'Key'}{' '}
              <span className="text-gradient bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {locale === 'ar' ? 'رئيسية' : 'Statistics'}
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {statistics.map((stat, index) => (
              <div
                key={index}
                className={`group bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2`}
              >
                <div className={`text-5xl mb-4 transform group-hover:scale-110 transition-transform`}>
                  {stat.icon}
                </div>
                <div className={`text-4xl font-bold mb-2 bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent`}>
                  {stat.number}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  {stat.label[locale]}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          Search & Categories
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-12 bg-white dark:bg-gray-900">
        <div className="container-custom">
          {/* Search Bar */}
          <div className="max-w-2xl mx-auto mb-8">
            <div className="relative">
              <input
                type="text"
                placeholder={locale === 'ar' ? 'ابحث عن تقرير...' : 'Search for a report...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-6 py-4 pr-12 rounded-xl border-2 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900/50 outline-none transition-all"
              />
              <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Categories */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            {reportCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all transform hover:scale-105 ${
                  activeCategory === category.id
                    ? `bg-gradient-to-r ${category.gradient} text-white shadow-xl scale-105`
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-lg'
                }`}
              >
                <span className="text-2xl">{category.icon}</span>
                <span>{category.name[locale]}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          Featured Reports
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-16 bg-gray-50 dark:bg-gray-800">
        <div className="container-custom">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-2 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 rounded-full text-sm font-semibold mb-4">
              ⭐ {locale === 'ar' ? 'تقارير مميزة' : 'Featured Reports'}
            </div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
              {locale === 'ar' ? 'أهم التقارير' : 'Most Important Reports'}
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredReports.slice(0, 3).map((report) => (
              <article
                key={report.id}
                className="group bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all transform hover:-translate-y-2"
              >
                {/* Header with gradient */}
                <div className={`relative h-32 bg-gradient-to-br ${reportCategories.find(c => c.id === report.category)?.gradient} p-6`}>
                  <div className="flex items-start justify-between">
                    <span className="text-4xl">
                      {reportCategories.find(c => c.id === report.category)?.icon}
                    </span>
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-bold rounded-full">
                      {report.year}
                    </span>
                  </div>
                  
                  <div className="absolute bottom-4 left-6">
                    <span className="px-3 py-1 bg-yellow-400 text-yellow-900 text-xs font-bold rounded-full">
                      ⭐ {locale === 'ar' ? 'مميز' : 'Featured'}
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {report.title[locale]}
                  </h3>

                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                    {report.description[locale]}
                  </p>

                  {/* Topics */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {report.topics.slice(0, 2).map((topic, idx) => (
                      <span key={idx} className="px-2 py-1 bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 text-xs rounded-lg">
                        {topic}
                      </span>
                    ))}
                  </div>

                  {/* Meta Info */}
                  <div className="grid grid-cols-2 gap-4 mb-4 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      {report.pages} {locale === 'ar' ? 'صفحة' : 'pages'}
                    </div>
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      {report.fileSize}
                    </div>
                  </div>

                  {/* Download Button */}
                  <button className="w-full btn btn-primary">
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    {locale === 'ar' ? 'تحميل التقرير' : 'Download Report'}
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          All Reports Grid (متطلبات PDF: 1,2,3)
          ═══════════════════════════════════════════════════════════════ */}
      <section id="reports" className="py-20 bg-white dark:bg-gray-900">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {locale === 'ar' ? 'جميع' : 'All'}{' '}
              <span className="text-gradient bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                {locale === 'ar' ? 'التقارير' : 'Reports'}
              </span>
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              {filteredReports.length} {locale === 'ar' ? 'تقرير متاح' : 'reports available'}
            </p>
          </div>

          {filteredReports.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredReports.map((report) => (
                <article
                  key={report.id}
                  className="bg-white dark:bg-gray-800 rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all"
                >
                  {/* Header */}
                  <div className={`h-24 bg-gradient-to-br ${reportCategories.find(c => c.id === report.category)?.gradient} p-4 flex items-center justify-between`}>
                    <span className="text-3xl">
                      {reportCategories.find(c => c.id === report.category)?.icon}
                    </span>
                    <div className="text-right">
                      <div className="text-white text-sm font-semibold">
                        {reportCategories.find(c => c.id === report.category)?.name[locale]}
                      </div>
                      <div className="text-white/80 text-xs">{report.year}</div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2">
                      {report.title[locale]}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                      {report.description[locale]}
                    </p>

                    {/* Meta */}
                    <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400 mb-4">
                      <span>{report.pages} {locale === 'ar' ? 'صفحة' : 'pages'}</span>
                      <span>{report.language[locale]}</span>
                      <span>{report.fileSize}</span>
                    </div>

                    {/* Download */}
                    <button className="w-full btn btn-outline text-sm py-2">
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      {locale === 'ar' ? 'تحميل' : 'Download'}
                    </button>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            /* No Results */
            <div className="text-center py-20">
              <svg className="w-24 h-24 mx-auto text-gray-400 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                {locale === 'ar' ? 'لا توجد نتائج' : 'No Results Found'}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {locale === 'ar' ? 'جرب البحث بكلمات مختلفة' : 'Try searching with different keywords'}
              </p>
              <button
                onClick={() => {
                  setActiveCategory('all')
                  setSearchQuery('')
                }}
                className="btn btn-primary"
              >
                {locale === 'ar' ? 'إعادة تعيين' : 'Reset'}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          UNESCO World Heritage Section
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
        <div className="container-custom">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div>
              <div className="inline-flex items-center gap-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-full px-6 py-3 text-sm font-semibold mb-6">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                {locale === 'ar' ? 'موقع تراث عالمي' : 'UNESCO World Heritage Site'}
              </div>

              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                {locale === 'ar' ? 'سقطرى - تراث' : 'Socotra - World'}{' '}
                <span className="text-gradient bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {locale === 'ar' ? 'عالمي' : 'Heritage'}
                </span>
              </h2>

              <div className="space-y-4 text-gray-600 dark:text-gray-400">
                <p className="text-lg">
                  {locale === 'ar'
                    ? 'في عام 2008، أدرجت اليونسكو أرخبيل سقطرى كموقع تراث عالمي تقديراً لتنوعه البيولوجي الاستثنائي وأهميته العلمية العالمية.'
                    : 'In 2008, UNESCO inscribed Socotra Archipelago as a World Heritage Site in recognition of its exceptional biodiversity and global scientific importance.'}
                </p>

                <ul className="space-y-3">
                  {[
                    locale === 'ar' ? '37% من النباتات فريدة عالمياً' : '37% of plants globally unique',
                    locale === 'ar' ? '90% من الزواحف لا توجد في مكان آخر' : '90% of reptiles found nowhere else',
                    locale === 'ar' ? 'أكثر من 700 نوع مستوطن' : 'Over 700 endemic species',
                    locale === 'ar' ? 'موقع ذو قيمة عالمية استثنائية' : 'Site of Outstanding Universal Value'
                  ].map((item, idx) => (
                    <li key={idx} className="flex items-center gap-3">
                      <svg className="w-6 h-6 text-green-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <a
                  href="https://whc.unesco.org/en/list/1263"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-primary inline-flex items-center gap-2"
                >
                  {locale === 'ar' ? 'موقع اليونسكو الرسمي' : 'Official UNESCO Page'}
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              </div>
            </div>

            {/* Image/Visual */}
            <div className="relative">
              <div className="relative h-[500px] rounded-3xl overflow-hidden shadow-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <svg className="w-32 h-32 text-white/20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          CTA Section
          ═══════════════════════════════════════════════════════════════ */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 dark:from-blue-800 dark:via-indigo-800 dark:to-purple-800 text-white">
        <div className="container-custom text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            {locale === 'ar' ? 'هل لديك سؤال؟' : 'Have a Question?'}
          </h2>

          <p className="text-xl mb-12 max-w-2xl mx-auto opacity-90">
            {locale === 'ar'
              ? 'للاستفسار عن التقارير أو طلب معلومات إضافية، تواصل معنا'
              : 'For inquiries about reports or additional information, contact us'}
          </p>

          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/contact" className="btn text-lg px-8 py-4 bg-white text-blue-600 hover:bg-gray-100 transform hover:scale-105 transition-all shadow-2xl">
              {locale === 'ar' ? 'تواصل معنا' : 'Contact Us'}
            </Link>

            <Link href="/about" className="btn text-lg px-8 py-4 border-2 border-white text-white hover:bg-white hover:text-blue-600 transform hover:scale-105 transition-all">
              {locale === 'ar' ? 'المزيد عن سقطرى' : 'More About Socotra'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}