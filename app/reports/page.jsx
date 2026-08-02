'use client'

// ═══════════════════════════════════════════════════════════════════════
// 📊 Socotra Reports Page — Hawari Tours
// ✨ Premium Editorial Design — Luxury Island Heritage Aesthetic
// ═══════════════════════════════════════════════════════════════════════

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useMemo, useState, useRef } from 'react'
import { useApp } from '@/contexts/AppContext'

// ── Animated background particles ──────────────────────────────────────
function FloatingOrb({ style }) {
  return <div className="reports-orb" style={style} />
}

// ── Skeleton shimmer card ───────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="reports-skeleton">
      <div className="reports-skeleton__header" />
      <div className="reports-skeleton__line reports-skeleton__line--wide" />
      <div className="reports-skeleton__line" />
      <div className="reports-skeleton__line reports-skeleton__line--short" />
      <div className="reports-skeleton__footer" />
    </div>
  )
}

// ── Stat counter with animation ─────────────────────────────────────────
function AnimatedStat({ value, label, icon }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect() } }, { threshold: 0.3 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])
  return (
    <div ref={ref} className={`reports-stat ${visible ? 'reports-stat--visible' : ''}`}>
      <span className="reports-stat__icon">{icon}</span>
      <span className="reports-stat__value">{value}</span>
      <span className="reports-stat__label">{label}</span>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════
export default function ReportsPage() {
  const { locale } = useApp()
  const isAr = locale === 'ar'

  const [activeCategory, setActiveCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(true)
  const [content, setContent] = useState({
    categories: [], reports: [], stats: [], settings: {}, unesco: {}, cta: {}
  })

  useEffect(() => {
    let isMounted = true
    const fetchContent = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/reports')
        const result = await response.json()
        if (result.success && isMounted) setContent(result.data)
      } catch {
        if (isMounted) setContent({ categories: [], reports: [], stats: [], settings: {}, unesco: {}, cta: {} })
      } finally {
        if (isMounted) setLoading(false)
      }
    }
    fetchContent()
    return () => { isMounted = false }
  }, [])

  const settings = useMemo(() => content.settings || {}, [content.settings])
  const unescoSection = useMemo(() => content.unesco || {}, [content.unesco])
  const ctaSection = useMemo(() => content.cta || {}, [content.cta])

  const reportCategories = useMemo(() => {
    const base = (content.categories || []).map((cat) => ({
      id: cat.id,
      name: { ar: cat.nameAr, en: cat.nameEn },
      icon: cat.icon || '📄',
      gradient: cat.gradient || 'from-gray-500 to-gray-700'
    }))
    return [
      { id: 'all', name: { ar: settings.allReportsTitleAr || 'جميع التقارير', en: settings.allReportsTitleEn || 'All Reports' }, icon: '📚', gradient: 'from-gray-500 to-gray-700' },
      ...base
    ]
  }, [content.categories, settings])

  const reports = useMemo(() => content.reports || [], [content.reports])
  const statistics = useMemo(() => content.stats || [], [content.stats])

  const filteredReports = reports.filter(report => {
    const matchesCategory = activeCategory === 'all' || report.categoryId === activeCategory
    const text = `${report.titleAr || ''} ${report.titleEn || ''} ${report.descriptionAr || ''} ${report.descriptionEn || ''}`.toLowerCase()
    const matchesSearch = searchQuery === '' || text.includes(searchQuery.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const featuredReports = reports.filter((r) => r.featured)
  const heroReport = featuredReports[0] || reports[0]
  const downloadLabel = isAr ? (settings.downloadLabelAr || 'تحميل') : (settings.downloadLabelEn || 'Download')
  const reportsCountLabel = isAr ? (settings.reportsCountLabelAr || 'تقرير متاح') : (settings.reportsCountLabelEn || 'reports available')

  // ── Loading State ────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="reports-page" dir={isAr ? 'rtl' : 'ltr'}>
        <style>{STYLES}</style>
        <div className="reports-loading">
          <div className="reports-loading__orbs">
            <FloatingOrb style={{ width: 500, height: 500, top: '-10%', left: '-5%', animationDelay: '0s' }} />
            <FloatingOrb style={{ width: 350, height: 350, bottom: '5%', right: '10%', animationDelay: '-3s' }} />
          </div>
          <div className="reports-loading__spinner">
            <div className="reports-loading__ring" />
            <span>{isAr ? 'جارٍ التحميل…' : 'Loading…'}</span>
          </div>
          <div className="reports-loading__grid">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        </div>
      </div>
    )
  }

  // ── Main Render ──────────────────────────────────────────────────────
  return (
    <div className="reports-page" dir={isAr ? 'rtl' : 'ltr'}>
      <style>{STYLES}</style>

      {/* ── AMBIENT ORBS ─────────────────────────────────────────────── */}
      <div className="reports-bg-orbs" aria-hidden>
        <FloatingOrb style={{ width: 900, height: 900, top: '-20%', left: '-15%', animationDelay: '0s' }} />
        <FloatingOrb style={{ width: 600, height: 600, top: '30%', right: '-10%', animationDelay: '-4s' }} />
        <FloatingOrb style={{ width: 400, height: 400, bottom: '10%', left: '20%', animationDelay: '-7s' }} />
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* HERO SECTION                                                   */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <section className="reports-hero">
        <div className="reports-hero__noise" />

        {/* Badge */}
        <div className="reports-hero__badge">
          <span className="reports-hero__badge-dot" />
          {isAr ? (settings.heroBadgeAr || 'مكتبة التقارير الرسمية') : (settings.heroBadgeEn || 'Official Reports Library')}
        </div>

        {/* Title */}
        <h1 className="reports-hero__title">
          <span className="reports-hero__title-line reports-hero__title-line--dim">
            {isAr ? (settings.heroTitleLine1Ar || 'تقارير') : (settings.heroTitleLine1En || 'Socotra')}
          </span>
          <span className="reports-hero__title-line reports-hero__title-line--accent">
            {isAr ? (settings.heroTitleLine2Ar || 'سقطرى') : (settings.heroTitleLine2En || 'Reports')}
          </span>
        </h1>

        {/* Subtitle */}
        <p className="reports-hero__subtitle">
          {isAr
            ? (settings.heroSubtitleAr || 'تقارير اليونسكو، الدراسات الحكومية، أبحاث المنظمات، والأبحاث العلمية')
            : (settings.heroSubtitleEn || 'UNESCO reports, government studies, NGO research, and scientific papers')}
        </p>

        {/* CTA Buttons */}
        <div className="reports-hero__actions">
          <a href={settings.primaryButtonLink || '#reports'} className="reports-btn reports-btn--primary">
            <span>{isAr ? (settings.primaryButtonLabelAr || 'تصفح التقارير') : (settings.primaryButtonLabelEn || 'Browse Reports')}</span>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12h14M12 5l7 7-7 7" /></svg>
          </a>
          <a href={settings.secondaryButtonLink || '#statistics'} className="reports-btn reports-btn--ghost">
            {isAr ? (settings.secondaryButtonLabelAr || 'الإحصائيات') : (settings.secondaryButtonLabelEn || 'Statistics')}
          </a>
        </div>

        {/* Quick counters */}
        <div className="reports-hero__counters">
          {[
            { v: reports.length, l: isAr ? 'تقرير' : 'Reports', icon: '📄' },
            { v: content.categories.length, l: isAr ? 'تصنيف' : 'Categories', icon: '🏷️' },
            { v: featuredReports.length, l: isAr ? 'مميّز' : 'Featured', icon: '⭐' },
          ].map((item, i) => (
            <div key={i} className="reports-hero__counter">
              <span className="reports-hero__counter-icon">{item.icon}</span>
              <strong>{item.v}</strong>
              <span>{item.l}</span>
            </div>
          ))}
        </div>

        {/* Hero Featured Report Card */}
        {heroReport && (
          <div className="reports-hero__card">
            <div className="reports-hero__card-meta">
              <span className="reports-badge reports-badge--year">{heroReport.year}</span>
              <span className="reports-badge reports-badge--size">{heroReport.fileSize}</span>
              <span className="reports-badge reports-badge--featured">
                ⭐ {isAr ? 'مميّز' : 'Featured'}
              </span>
            </div>
            <h3 className="reports-hero__card-title">
              {isAr ? heroReport.titleAr : heroReport.titleEn}
            </h3>
            <p className="reports-hero__card-desc">
              {isAr ? heroReport.descriptionAr : heroReport.descriptionEn}
            </p>
            <a
              href={heroReport.downloadUrl || heroReport.fileUrl || '#'}
              className="reports-btn reports-btn--download"
              target="_blank"
              rel="noopener noreferrer"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              {downloadLabel}
            </a>
          </div>
        )}

        {/* Scroll indicator */}
        <div className="reports-hero__scroll">
          <div className="reports-hero__scroll-wheel" />
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* STATISTICS                                                     */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <section id="statistics" className="reports-stats">
        <div className="reports-section-header">
          <div className="reports-section-label">
            {isAr ? (settings.statsTitleAr || 'إحصائيات') : (settings.statsTitleEn || 'Key')}{' '}
            <strong>{isAr ? (settings.statsTitleHighlightAr || 'رئيسية') : (settings.statsTitleHighlightEn || 'Statistics')}</strong>
          </div>
        </div>
        <div className="reports-stats__grid">
          {statistics.map((stat, i) => (
            <AnimatedStat key={i} value={stat.number} label={isAr ? stat.labelAr : stat.labelEn} icon={stat.icon} />
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* SEARCH & FILTERS                                               */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <section className="reports-filters">
        {/* Search */}
        <div className="reports-search">
          <svg className="reports-search__icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            type="text"
            placeholder={isAr ? 'ابحث في التقارير…' : 'Search reports…'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="reports-search__input"
          />
          {searchQuery && (
            <button className="reports-search__clear" onClick={() => setSearchQuery('')}>✕</button>
          )}
        </div>

        {/* Category Tabs */}
        <div className="reports-cats">
          {reportCategories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`reports-cat ${activeCategory === cat.id ? 'reports-cat--active' : ''}`}
            >
              <span>{cat.icon}</span>
              <span>{cat.name[locale]}</span>
            </button>
          ))}
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* FEATURED REPORTS                                               */}
      {/* ══════════════════════════════════════════════════════════════ */}
      {featuredReports.length > 0 && (
        <section className="reports-featured">
          <div className="reports-section-header">
            <div className="reports-section-label">
              ⭐ {isAr ? (settings.featuredBadgeAr || 'تقارير مميزة') : (settings.featuredBadgeEn || 'Featured Reports')}
            </div>
            <h2 className="reports-section-title">
              {isAr ? (settings.featuredTitleAr || 'أهم التقارير') : (settings.featuredTitleEn || 'Most Important Reports')}
            </h2>
          </div>

          <div className="reports-featured__grid">
            {featuredReports.slice(0, 3).map((report, i) => {
              const catMeta = report.category || reportCategories.find(c => c.id === report.categoryId)
              const catLabel = report.category
                ? (isAr ? report.category.nameAr : report.category.nameEn)
                : catMeta?.name?.[locale]
              return (
                <article key={report.id || i} className={`reports-featured__card reports-featured__card--${i + 1}`}>
                  <div className="reports-featured__card-glow" />
                  <div className="reports-featured__card-top">
                    <span className="reports-featured__cat-icon">{catMeta?.icon || '📄'}</span>
                    <span className="reports-badge reports-badge--year">{report.year}</span>
                  </div>
                  <div className="reports-featured__badge">
                    ⭐ {isAr ? (settings.featuredBadgeAr || 'مميّز') : (settings.featuredBadgeEn || 'Featured')}
                  </div>
                  <h3 className="reports-featured__title">
                    {isAr ? report.titleAr : report.titleEn}
                  </h3>
                  <p className="reports-featured__desc">
                    {isAr ? report.descriptionAr : report.descriptionEn}
                  </p>
                  {(report.topics || []).length > 0 && (
                    <div className="reports-featured__topics">
                      {report.topics.slice(0, 3).map((topic, ti) => (
                        <span key={ti} className="reports-topic">{topic}</span>
                      ))}
                    </div>
                  )}
                  <div className="reports-featured__meta">
                    <span>📄 {report.pages} {isAr ? 'صفحة' : 'pages'}</span>
                    <span>💾 {report.fileSize}</span>
                  </div>
                  <div className="reports-featured__actions">
                    <a
                      href={report.downloadUrl || report.fileUrl || '#'}
                      className="reports-btn reports-btn--download"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                      {downloadLabel}
                    </a>
                    {catLabel && <span className="reports-badge reports-badge--cat">{catLabel}</span>}
                  </div>
                </article>
              )
            })}
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* ALL REPORTS GRID                                               */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <section id="reports" className="reports-all">
        <div className="reports-section-header">
          <h2 className="reports-section-title">
            {isAr ? (settings.allReportsTitleAr || 'جميع') : (settings.allReportsTitleEn || 'All')}{' '}
            <span className="reports-section-title--accent">
              {isAr ? (settings.allReportsTitleHighlightAr || 'التقارير') : (settings.allReportsTitleHighlightEn || 'Reports')}
            </span>
          </h2>
          <div className="reports-all__count">
            <span className="reports-all__count-num">{filteredReports.length}</span>
            <span>{reportsCountLabel}</span>
          </div>
        </div>

        {filteredReports.length > 0 ? (
          <div className="reports-grid">
            {filteredReports.map((report, i) => {
              const catMeta = report.category || reportCategories.find(c => c.id === report.categoryId)
              const catLabel = report.category
                ? (isAr ? report.category.nameAr : report.category.nameEn)
                : catMeta?.name?.[locale]
              return (
                <article key={report.id || i} className="reports-card" style={{ animationDelay: `${i * 60}ms` }}>
                  <div className="reports-card__accent" />
                  <div className="reports-card__header">
                    <span className="reports-card__cat-icon">{catMeta?.icon || '📄'}</span>
                    <div className="reports-card__badges">
                      {catLabel && <span className="reports-badge reports-badge--cat">{catLabel}</span>}
                      <span className="reports-badge reports-badge--year">{report.year}</span>
                    </div>
                  </div>
                  <h3 className="reports-card__title">
                    {isAr ? report.titleAr : report.titleEn}
                  </h3>
                  <p className="reports-card__desc">
                    {isAr ? report.descriptionAr : report.descriptionEn}
                  </p>
                  <div className="reports-card__meta">
                    <span>📄 {report.pages} {isAr ? 'صفحة' : 'pages'}</span>
                    <span>🌐 {isAr ? report.languageAr : report.languageEn}</span>
                    <span>💾 {report.fileSize}</span>
                  </div>
                  <a
                    href={report.downloadUrl || report.fileUrl || '#'}
                    className="reports-card__download"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                    {downloadLabel}
                  </a>
                </article>
              )
            })}
          </div>
        ) : (
          <div className="reports-empty">
            <div className="reports-empty__icon">🔍</div>
            <h3>{isAr ? (settings.noResultsTitleAr || 'لا توجد نتائج') : (settings.noResultsTitleEn || 'No Results Found')}</h3>
            <p>{isAr ? (settings.noResultsTextAr || 'جرّب البحث بكلمات مختلفة') : (settings.noResultsTextEn || 'Try searching with different keywords')}</p>
            <button
              className="reports-btn reports-btn--primary"
              onClick={() => { setActiveCategory('all'); setSearchQuery('') }}
            >
              {isAr ? (settings.resetButtonLabelAr || 'إعادة تعيين') : (settings.resetButtonLabelEn || 'Reset')}
            </button>
          </div>
        )}
      </section>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* UNESCO SECTION                                                 */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <section className="reports-unesco">
        <div className="reports-unesco__inner">
          {/* Text */}
          <div className="reports-unesco__text">
            <div className="reports-section-label reports-section-label--light">
              🌍 {isAr ? (unescoSection.badgeAr || 'موقع تراث عالمي') : (unescoSection.badgeEn || 'UNESCO World Heritage Site')}
            </div>
            <h2 className="reports-unesco__title">
              {isAr ? (unescoSection.titleLine1Ar || 'سقطرى — تراث') : (unescoSection.titleLine1En || 'Socotra —')}{' '}
              <em>{isAr ? (unescoSection.titleLine2Ar || 'عالمي') : (unescoSection.titleLine2En || 'World Heritage')}</em>
            </h2>
            <p className="reports-unesco__desc">
              {isAr
                ? (unescoSection.descriptionAr || 'في عام 2008، أدرجت اليونسكو أرخبيل سقطرى كموقع تراث عالمي تقديراً لتنوعه البيولوجي الاستثنائي وأهميته العلمية العالمية.')
                : (unescoSection.descriptionEn || 'In 2008, UNESCO inscribed Socotra Archipelago as a World Heritage Site in recognition of its exceptional biodiversity and global scientific importance.')}
            </p>
            <ul className="reports-unesco__bullets">
              {(isAr ? (unescoSection.bulletsAr || []) : (unescoSection.bulletsEn || [])).map((item, idx) => (
                <li key={idx}>
                  <span className="reports-unesco__bullet-dot" />
                  {item}
                </li>
              ))}
            </ul>
            <a
              href={unescoSection.buttonLink || 'https://whc.unesco.org/en/list/1263'}
              className="reports-btn reports-btn--light"
              target="_blank"
              rel="noopener noreferrer"
            >
              🌐 {isAr ? (unescoSection.buttonLabelAr || 'موقع اليونسكو الرسمي') : (unescoSection.buttonLabelEn || 'Official UNESCO Page')}
            </a>
          </div>

          {/* Visual */}
          <div className="reports-unesco__visual">
            {unescoSection.imageUrl ? (
              <Image
                src={unescoSection.imageUrl}
                alt="Socotra UNESCO"
                fill
                className="reports-unesco__img"
              />
            ) : (
              <div className="reports-unesco__placeholder">
                <span>🌴</span>
                <p>Socotra Archipelago</p>
                <small>UNESCO World Heritage 2008</small>
              </div>
            )}
            <div className="reports-unesco__visual-badge">
              <span>🌍</span>
              <span>UNESCO</span>
              <strong>2008</strong>
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* CTA SECTION                                                    */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <section className="reports-cta">
        <div className="reports-cta__glow" />
        <div className="reports-cta__content">
          <div className="reports-section-label">
            💬 {isAr ? 'تواصل معنا' : 'Get in Touch'}
          </div>
          <h2 className="reports-cta__title">
            {isAr ? (ctaSection.titleAr || 'هل لديك سؤال؟') : (ctaSection.titleEn || 'Have a Question?')}
          </h2>
          <p className="reports-cta__subtitle">
            {isAr
              ? (ctaSection.subtitleAr || 'للاستفسار عن التقارير أو طلب معلومات إضافية، تواصل معنا')
              : (ctaSection.subtitleEn || 'For inquiries about reports or additional information, contact us')}
          </p>
          <div className="reports-hero__actions">
            <Link href={ctaSection.primaryButtonLink || '/contact'} className="reports-btn reports-btn--primary">
              {isAr ? (ctaSection.primaryButtonLabelAr || 'تواصل معنا') : (ctaSection.primaryButtonLabelEn || 'Contact Us')}
            </Link>
            <Link href={ctaSection.secondaryButtonLink || '/about'} className="reports-btn reports-btn--ghost">
              {isAr ? (ctaSection.secondaryButtonLabelAr || 'المزيد عن سقطرى') : (ctaSection.secondaryButtonLabelEn || 'More About Socotra')}
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

// ══════════════════════════════════════════════════════════════════════
// STYLES  — Self-contained, zero external deps
// ══════════════════════════════════════════════════════════════════════
const STYLES = `
/* ── Variables ──────────────────────────────────────────────────── */
.reports-page {
  --c-bg:          #060b14;
  --c-surface:     #0d1526;
  --c-surface2:    #111e35;
  --c-border:      rgba(99,162,255,.12);
  --c-border2:     rgba(99,162,255,.22);
  --c-text:        #e8edf5;
  --c-muted:       #7b90b8;
  --c-accent:      #3d91ff;
  --c-accent2:     #06d6a0;
  --c-gold:        #f0c040;
  --c-orb1:        rgba(61,145,255,.07);
  --c-orb2:        rgba(6,214,160,.05);
  --font-display:  'Playfair Display', 'Amiri', Georgia, serif;
  --font-body:     'DM Sans', 'Tajawal', system-ui, sans-serif;
  --r-card:        20px;
  --r-btn:         100px;
  --shadow-card:   0 8px 40px rgba(0,0,0,.45);
  --shadow-glow:   0 0 80px rgba(61,145,255,.18);

  font-family: var(--font-body);
  background: var(--c-bg);
  color: var(--c-text);
  min-height: 100vh;
  overflow-x: hidden;
  position: relative;
}

/* ── Google Fonts import hint ───────────────────────────────────── */
@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700&family=DM+Sans:wght@300;400;500;600&family=Amiri:wght@400;700&family=Tajawal:wght@300;400;500;700&display=swap');

/* ── Ambient orbs ───────────────────────────────────────────────── */
.reports-bg-orbs { position: fixed; inset: 0; pointer-events: none; z-index: 0; overflow: hidden; }
.reports-orb {
  position: absolute;
  border-radius: 50%;
  background: radial-gradient(circle, var(--c-orb1) 0%, transparent 70%);
  animation: orbFloat 18s ease-in-out infinite alternate;
  pointer-events: none;
}
.reports-orb:nth-child(2) { background: radial-gradient(circle, var(--c-orb2) 0%, transparent 70%); }
@keyframes orbFloat {
  0%   { transform: translate(0, 0) scale(1); }
  100% { transform: translate(40px, -60px) scale(1.08); }
}

/* ── Shared wrappers ─────────────────────────────────────────────── */
.reports-page > * { position: relative; z-index: 1; }

/* ═════════════════════════════════════════════════════════════════ */
/* HERO                                                              */
/* ═════════════════════════════════════════════════════════════════ */
.reports-hero {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 120px 24px 80px;
  gap: 24px;
  position: relative;
}
.reports-hero__noise {
  position: absolute; inset: 0; z-index: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.025'/%3E%3C/svg%3E");
  opacity: .6;
  pointer-events: none;
}
.reports-hero > * { position: relative; z-index: 1; }

.reports-hero__badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background: rgba(61,145,255,.10);
  border: 1px solid rgba(61,145,255,.25);
  color: var(--c-accent);
  font-size: .78rem;
  font-weight: 600;
  letter-spacing: .1em;
  text-transform: uppercase;
  padding: 8px 20px;
  border-radius: var(--r-btn);
  animation: fadeDown .6s ease both;
}
.reports-hero__badge-dot {
  width: 7px; height: 7px;
  border-radius: 50%;
  background: var(--c-accent);
  box-shadow: 0 0 10px var(--c-accent);
  animation: pulse 2s infinite;
}
@keyframes pulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.5;transform:scale(1.4)} }

.reports-hero__title {
  font-family: var(--font-display);
  display: flex;
  flex-direction: column;
  line-height: 1.05;
  animation: fadeDown .6s .1s ease both;
}
.reports-hero__title-line { display: block; }
.reports-hero__title-line--dim  { font-size: clamp(2.5rem, 7vw, 5rem); color: var(--c-muted); font-weight: 700; }
.reports-hero__title-line--accent {
  font-size: clamp(4rem, 13vw, 9rem);
  font-style: italic;
  background: linear-gradient(135deg, #60aaff 0%, #06d6a0 60%, #f0c040 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: none;
  filter: drop-shadow(0 0 60px rgba(61,145,255,.35));
}

.reports-hero__subtitle {
  max-width: 600px;
  color: var(--c-muted);
  font-size: 1.05rem;
  line-height: 1.7;
  animation: fadeDown .6s .2s ease both;
}

.reports-hero__actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;
  animation: fadeDown .6s .3s ease both;
}

.reports-hero__counters {
  display: flex;
  gap: 2px;
  background: rgba(255,255,255,.03);
  border: 1px solid var(--c-border);
  border-radius: var(--r-card);
  overflow: hidden;
  animation: fadeDown .6s .4s ease both;
}
.reports-hero__counter {
  display: flex; flex-direction: column; align-items: center;
  gap: 2px;
  padding: 18px 32px;
  font-size: .85rem;
  color: var(--c-muted);
  border-inline-end: 1px solid var(--c-border);
  transition: background .2s;
}
.reports-hero__counter:last-child { border: none; }
.reports-hero__counter:hover { background: rgba(61,145,255,.05); }
.reports-hero__counter-icon { font-size: 1.3rem; margin-bottom: 2px; }
.reports-hero__counter strong { font-size: 1.6rem; font-family: var(--font-display); color: var(--c-text); }

/* Hero Card */
.reports-hero__card {
  width: 100%; max-width: 700px;
  background: linear-gradient(135deg, rgba(13,21,38,.9) 0%, rgba(17,30,53,.9) 100%);
  border: 1px solid var(--c-border2);
  border-radius: var(--r-card);
  padding: 28px 32px;
  text-align: start;
  backdrop-filter: blur(24px);
  box-shadow: var(--shadow-card), 0 0 60px rgba(61,145,255,.07);
  animation: fadeDown .6s .5s ease both;
}
.reports-hero__card-meta { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px; }
.reports-hero__card-title { font-family: var(--font-display); font-size: 1.4rem; font-weight: 700; margin: 0 0 10px; }
.reports-hero__card-desc { color: var(--c-muted); font-size: .9rem; line-height: 1.65; margin: 0 0 20px; }

/* Scroll indicator */
.reports-hero__scroll {
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  width: 26px; height: 40px;
  border: 2px solid var(--c-border2);
  border-radius: 13px;
  display: flex;
  justify-content: center;
  padding-top: 6px;
}
.reports-hero__scroll-wheel {
  width: 4px; height: 8px;
  border-radius: 2px;
  background: var(--c-accent);
  animation: scrollWheel 1.6s infinite;
}
@keyframes scrollWheel { 0%{opacity:1;transform:translateY(0)} 100%{opacity:0;transform:translateY(14px)} }

/* ═════════════════════════════════════════════════════════════════ */
/* BUTTONS                                                           */
/* ═════════════════════════════════════════════════════════════════ */
.reports-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 13px 26px;
  border-radius: var(--r-btn);
  font-size: .9rem;
  font-weight: 600;
  cursor: pointer;
  border: none;
  text-decoration: none;
  transition: all .22s;
  white-space: nowrap;
}
.reports-btn--primary {
  background: linear-gradient(135deg, var(--c-accent), #0a5fff);
  color: #fff;
  box-shadow: 0 6px 32px rgba(61,145,255,.35);
}
.reports-btn--primary:hover { transform: translateY(-2px); box-shadow: 0 10px 40px rgba(61,145,255,.5); }

.reports-btn--ghost {
  background: rgba(255,255,255,.05);
  border: 1px solid var(--c-border2);
  color: var(--c-text);
}
.reports-btn--ghost:hover { background: rgba(255,255,255,.09); border-color: rgba(99,162,255,.4); }

.reports-btn--download {
  background: rgba(6,214,160,.12);
  border: 1px solid rgba(6,214,160,.3);
  color: var(--c-accent2);
  padding: 10px 20px;
  font-size: .85rem;
}
.reports-btn--download:hover { background: rgba(6,214,160,.22); transform: translateY(-1px); }

.reports-btn--light {
  background: rgba(255,255,255,.12);
  border: 1px solid rgba(255,255,255,.25);
  color: #fff;
}
.reports-btn--light:hover { background: rgba(255,255,255,.2); }

/* ═════════════════════════════════════════════════════════════════ */
/* BADGES                                                            */
/* ═════════════════════════════════════════════════════════════════ */
.reports-badge {
  display: inline-flex; align-items: center;
  padding: 4px 12px;
  border-radius: var(--r-btn);
  font-size: .73rem;
  font-weight: 600;
  letter-spacing: .03em;
}
.reports-badge--year  { background: rgba(240,192,64,.12); border: 1px solid rgba(240,192,64,.25); color: var(--c-gold); }
.reports-badge--size  { background: rgba(61,145,255,.1); border: 1px solid rgba(61,145,255,.2); color: var(--c-accent); }
.reports-badge--cat   { background: rgba(6,214,160,.1); border: 1px solid rgba(6,214,160,.2); color: var(--c-accent2); }
.reports-badge--featured { background: rgba(240,192,64,.15); border: 1px solid rgba(240,192,64,.3); color: var(--c-gold); }

/* ═════════════════════════════════════════════════════════════════ */
/* SECTION HELPERS                                                   */
/* ═════════════════════════════════════════════════════════════════ */
.reports-section-header {
  text-align: center;
  margin-bottom: 48px;
}
.reports-section-label {
  display: inline-block;
  font-size: .78rem;
  font-weight: 700;
  letter-spacing: .12em;
  text-transform: uppercase;
  color: var(--c-accent);
  background: rgba(61,145,255,.08);
  border: 1px solid rgba(61,145,255,.18);
  padding: 6px 16px;
  border-radius: var(--r-btn);
  margin-bottom: 14px;
}
.reports-section-label--light { color: var(--c-accent2); background: rgba(6,214,160,.08); border-color: rgba(6,214,160,.2); }
.reports-section-title {
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 4vw, 3rem);
  font-weight: 900;
  margin: 0;
}
.reports-section-title--accent {
  background: linear-gradient(135deg, var(--c-accent), var(--c-accent2));
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

/* ═════════════════════════════════════════════════════════════════ */
/* STATISTICS                                                        */
/* ═════════════════════════════════════════════════════════════════ */
.reports-stats {
  padding: 80px 24px;
  max-width: 1200px;
  margin: 0 auto;
}
.reports-stats__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}
.reports-stat {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--r-card);
  padding: 32px 24px;
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  text-align: center;
  opacity: 0;
  transform: translateY(30px);
  transition: opacity .6s ease, transform .6s ease, box-shadow .25s, border-color .25s;
}
.reports-stat--visible { opacity: 1; transform: translateY(0); }
.reports-stat:hover { border-color: var(--c-border2); box-shadow: 0 6px 40px rgba(61,145,255,.12); }
.reports-stat__icon { font-size: 2rem; }
.reports-stat__value { font-family: var(--font-display); font-size: 2.4rem; font-weight: 900; color: var(--c-accent); }
.reports-stat__label { font-size: .85rem; color: var(--c-muted); }

/* ═════════════════════════════════════════════════════════════════ */
/* SEARCH & FILTERS                                                  */
/* ═════════════════════════════════════════════════════════════════ */
.reports-filters {
  padding: 0 24px 48px;
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 20px;
  align-items: center;
}
.reports-search {
  position: relative;
  width: 100%; max-width: 560px;
}
.reports-search__icon {
  position: absolute;
  inset-inline-start: 18px;
  top: 50%; transform: translateY(-50%);
  color: var(--c-muted);
  pointer-events: none;
}
.reports-search__input {
  width: 100%;
  padding: 14px 50px;
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--r-btn);
  color: var(--c-text);
  font-size: .95rem;
  font-family: var(--font-body);
  outline: none;
  transition: border-color .2s, box-shadow .2s;
}
.reports-search__input:focus { border-color: var(--c-accent); box-shadow: 0 0 0 4px rgba(61,145,255,.12); }
.reports-search__input::placeholder { color: var(--c-muted); }
.reports-search__clear {
  position: absolute;
  inset-inline-end: 16px;
  top: 50%; transform: translateY(-50%);
  background: none; border: none; cursor: pointer;
  color: var(--c-muted); font-size: .85rem;
  transition: color .2s;
}
.reports-search__clear:hover { color: var(--c-text); }

.reports-cats {
  display: flex; flex-wrap: wrap; gap: 10px; justify-content: center;
}
.reports-cat {
  display: inline-flex; align-items: center; gap: 6px;
  padding: 9px 20px;
  border-radius: var(--r-btn);
  font-size: .85rem; font-weight: 600;
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  color: var(--c-muted);
  cursor: pointer;
  transition: all .2s;
}
.reports-cat:hover { border-color: var(--c-border2); color: var(--c-text); background: var(--c-surface2); }
.reports-cat--active {
  background: linear-gradient(135deg, var(--c-accent), #0a5fff);
  border-color: transparent;
  color: #fff;
  box-shadow: 0 4px 20px rgba(61,145,255,.35);
  transform: scale(1.04);
}

/* ═════════════════════════════════════════════════════════════════ */
/* FEATURED REPORTS                                                  */
/* ═════════════════════════════════════════════════════════════════ */
.reports-featured {
  padding: 80px 24px;
  max-width: 1200px;
  margin: 0 auto;
}
.reports-featured__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 20px;
}
.reports-featured__card {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--r-card);
  padding: 28px;
  display: flex; flex-direction: column; gap: 14px;
  position: relative;
  overflow: hidden;
  transition: transform .25s, box-shadow .25s, border-color .25s;
}
.reports-featured__card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-card), 0 0 50px rgba(61,145,255,.12);
  border-color: var(--c-border2);
}
.reports-featured__card-glow {
  position: absolute; inset: 0;
  background: radial-gradient(circle at 30% 0%, rgba(61,145,255,.08) 0%, transparent 60%);
  pointer-events: none;
}
/* Gradient accent line per card */
.reports-featured__card--1 { border-top: 2px solid var(--c-accent); }
.reports-featured__card--2 { border-top: 2px solid var(--c-accent2); }
.reports-featured__card--3 { border-top: 2px solid var(--c-gold); }

.reports-featured__card-top { display: flex; justify-content: space-between; align-items: center; }
.reports-featured__cat-icon { font-size: 1.8rem; }
.reports-featured__badge { font-size: .73rem; font-weight: 700; color: var(--c-gold); letter-spacing: .05em; }
.reports-featured__title { font-family: var(--font-display); font-size: 1.15rem; font-weight: 700; margin: 0; line-height: 1.45; }
.reports-featured__desc { color: var(--c-muted); font-size: .87rem; line-height: 1.65; margin: 0; flex: 1; }

.reports-featured__topics { display: flex; flex-wrap: wrap; gap: 6px; }
.reports-topic {
  font-size: .72rem; font-weight: 600;
  background: rgba(61,145,255,.08); border: 1px solid rgba(61,145,255,.18);
  color: var(--c-accent); padding: 3px 10px; border-radius: var(--r-btn);
}

.reports-featured__meta { display: flex; gap: 16px; font-size: .8rem; color: var(--c-muted); }
.reports-featured__actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

/* ═════════════════════════════════════════════════════════════════ */
/* ALL REPORTS GRID                                                  */
/* ═════════════════════════════════════════════════════════════════ */
.reports-all {
  padding: 80px 24px;
  max-width: 1200px;
  margin: 0 auto;
}
.reports-all__count {
  display: inline-flex; align-items: center; gap: 8px;
  background: var(--c-surface); border: 1px solid var(--c-border);
  border-radius: var(--r-btn); padding: 6px 16px;
  font-size: .82rem; color: var(--c-muted);
  margin-top: 12px;
}
.reports-all__count-num { font-weight: 700; color: var(--c-accent); }

.reports-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
}

.reports-card {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--r-card);
  padding: 22px;
  display: flex; flex-direction: column; gap: 12px;
  position: relative;
  overflow: hidden;
  opacity: 0;
  animation: cardReveal .5s ease forwards;
  transition: transform .22s, box-shadow .22s, border-color .22s;
}
.reports-card:hover { transform: translateY(-3px); box-shadow: var(--shadow-card); border-color: var(--c-border2); }

.reports-card__accent {
  position: absolute; top: 0; inset-inline-start: 0;
  width: 3px; height: 0;
  background: linear-gradient(to bottom, var(--c-accent), var(--c-accent2));
  border-radius: 0 0 3px 3px;
  transition: height .35s ease;
}
.reports-card:hover .reports-card__accent { height: 100%; }

.reports-card__header { display: flex; justify-content: space-between; align-items: flex-start; gap: 8px; }
.reports-card__cat-icon { font-size: 1.6rem; flex-shrink: 0; }
.reports-card__badges { display: flex; flex-wrap: wrap; gap: 5px; }
.reports-card__title { font-family: var(--font-display); font-size: 1rem; font-weight: 700; line-height: 1.45; flex: 1; margin: 0; }
.reports-card__desc { color: var(--c-muted); font-size: .84rem; line-height: 1.6; margin: 0; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; flex: 1; }
.reports-card__meta { display: flex; flex-wrap: wrap; gap: 10px; font-size: .78rem; color: var(--c-muted); }
.reports-card__download {
  display: inline-flex; align-items: center; gap: 7px;
  background: rgba(6,214,160,.08); border: 1px solid rgba(6,214,160,.2);
  color: var(--c-accent2); padding: 9px 18px;
  border-radius: var(--r-btn); font-size: .83rem; font-weight: 600;
  text-decoration: none; transition: all .2s; align-self: flex-start;
}
.reports-card__download:hover { background: rgba(6,214,160,.18); transform: translateX(2px); }

@keyframes cardReveal { to { opacity: 1; } }

/* ─── Empty State ────────────────────────────────────────────────── */
.reports-empty {
  text-align: center; padding: 80px 24px;
  display: flex; flex-direction: column; align-items: center; gap: 16px;
}
.reports-empty__icon { font-size: 4rem; opacity: .4; }
.reports-empty h3 { font-family: var(--font-display); font-size: 1.5rem; margin: 0; }
.reports-empty p { color: var(--c-muted); margin: 0; }

/* ═════════════════════════════════════════════════════════════════ */
/* UNESCO SECTION                                                    */
/* ═════════════════════════════════════════════════════════════════ */
.reports-unesco {
  margin: 40px 24px 80px;
  max-width: 1200px;
  margin-inline: auto;
}
.reports-unesco__inner {
  background: linear-gradient(135deg, #0d1e3a 0%, #091429 50%, #0a2a1e 100%);
  border: 1px solid var(--c-border2);
  border-radius: 28px;
  overflow: hidden;
  display: grid;
  grid-template-columns: 1fr 1fr;
  min-height: 480px;
}
.reports-unesco__text {
  padding: 56px 48px;
  display: flex; flex-direction: column; gap: 20px; justify-content: center;
}
.reports-unesco__title {
  font-family: var(--font-display);
  font-size: clamp(1.8rem, 3.5vw, 2.8rem);
  font-weight: 900; line-height: 1.2; margin: 0;
}
.reports-unesco__title em { font-style: italic; color: var(--c-accent2); }
.reports-unesco__desc { color: var(--c-muted); line-height: 1.75; margin: 0; }
.reports-unesco__bullets { list-style: none; padding: 0; margin: 0; display: flex; flex-direction: column; gap: 10px; }
.reports-unesco__bullets li { display: flex; align-items: flex-start; gap: 12px; font-size: .9rem; color: var(--c-muted); }
.reports-unesco__bullet-dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: var(--c-accent2); margin-top: 6px; flex-shrink: 0;
}

.reports-unesco__visual {
  position: relative;
  background: linear-gradient(135deg, #091a2a, #0a2520);
  display: flex; align-items: center; justify-content: center;
  overflow: hidden;
}
.reports-unesco__visual::before {
  content: '';
  position: absolute; inset: 0;
  background: radial-gradient(circle at 50% 50%, rgba(6,214,160,.1) 0%, transparent 70%);
}
.reports-unesco__img { object-fit: cover; transition: transform .5s ease; }
.reports-unesco__visual:hover .reports-unesco__img { transform: scale(1.04); }
.reports-unesco__placeholder {
  text-align: center; color: var(--c-muted); z-index: 1;
  display: flex; flex-direction: column; align-items: center; gap: 8px;
}
.reports-unesco__placeholder span { font-size: 5rem; filter: drop-shadow(0 0 30px rgba(6,214,160,.3)); }
.reports-unesco__placeholder p { font-family: var(--font-display); font-size: 1.2rem; color: var(--c-text); margin: 0; }
.reports-unesco__placeholder small { font-size: .78rem; }

.reports-unesco__visual-badge {
  position: absolute; top: 20px; inset-inline-end: 20px; z-index: 2;
  background: rgba(13,21,38,.9); border: 1px solid var(--c-border2);
  border-radius: 12px; padding: 12px 16px;
  display: flex; flex-direction: column; align-items: center; gap: 2px;
  backdrop-filter: blur(12px);
  font-size: .8rem; color: var(--c-muted);
}
.reports-unesco__visual-badge span:first-child { font-size: 1.4rem; }
.reports-unesco__visual-badge strong { color: var(--c-accent2); font-size: 1rem; }

/* ═════════════════════════════════════════════════════════════════ */
/* CTA SECTION                                                       */
/* ═════════════════════════════════════════════════════════════════ */
.reports-cta {
  padding: 100px 24px;
  text-align: center;
  position: relative;
}
.reports-cta__glow {
  position: absolute; inset: 0; pointer-events: none;
  background: radial-gradient(ellipse at 50% 100%, rgba(61,145,255,.09) 0%, transparent 65%);
}
.reports-cta__content {
  position: relative; z-index: 1;
  max-width: 600px; margin: 0 auto;
  display: flex; flex-direction: column; align-items: center; gap: 20px;
}
.reports-cta__title { font-family: var(--font-display); font-size: clamp(2rem,5vw,3.5rem); font-weight: 900; margin: 0; }
.reports-cta__subtitle { color: var(--c-muted); font-size: 1rem; line-height: 1.7; margin: 0; }

/* ═════════════════════════════════════════════════════════════════ */
/* LOADING STATE                                                     */
/* ═════════════════════════════════════════════════════════════════ */
.reports-loading { position: relative; min-height: 100vh; }
.reports-loading__orbs { position: fixed; inset: 0; pointer-events: none; overflow: hidden; }
.reports-loading__spinner {
  display: flex; flex-direction: column; align-items: center; gap: 16px;
  padding: 120px 24px 48px; color: var(--c-muted); font-size: .9rem;
}
.reports-loading__ring {
  width: 48px; height: 48px;
  border: 3px solid var(--c-border);
  border-top-color: var(--c-accent);
  border-radius: 50%;
  animation: spin .8s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
.reports-loading__grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px; padding: 0 24px;
  max-width: 1200px; margin: 0 auto;
}
.reports-skeleton {
  background: var(--c-surface);
  border: 1px solid var(--c-border);
  border-radius: var(--r-card);
  padding: 24px;
  display: flex; flex-direction: column; gap: 14px;
}
.reports-skeleton__header { height: 40px; width: 40%; border-radius: 8px; background: var(--c-surface2); animation: shimmer 1.5s infinite; }
.reports-skeleton__line { height: 14px; border-radius: 7px; background: var(--c-surface2); animation: shimmer 1.5s infinite; }
.reports-skeleton__line--wide { width: 90%; }
.reports-skeleton__line--short { width: 60%; }
.reports-skeleton__footer { height: 36px; width: 45%; border-radius: var(--r-btn); background: var(--c-surface2); animation: shimmer 1.5s infinite; margin-top: 8px; }
@keyframes shimmer {
  0%   { opacity: 1; }
  50%  { opacity: .4; }
  100% { opacity: 1; }
}

/* ═════════════════════════════════════════════════════════════════ */
/* ANIMATIONS                                                        */
/* ═════════════════════════════════════════════════════════════════ */
@keyframes fadeDown {
  from { opacity: 0; transform: translateY(-18px); }
  to   { opacity: 1; transform: translateY(0); }
}

/* ═════════════════════════════════════════════════════════════════ */
/* RESPONSIVE                                                        */
/* ═════════════════════════════════════════════════════════════════ */
@media (max-width: 768px) {
  .reports-unesco__inner { grid-template-columns: 1fr; }
  .reports-unesco__visual { min-height: 280px; }
  .reports-unesco__text { padding: 36px 24px; }
  .reports-hero__counters { flex-direction: column; border-radius: var(--r-card); }
  .reports-hero__counter { border: none; border-bottom: 1px solid var(--c-border); }
  .reports-hero__counter:last-child { border: none; }
  .reports-hero__card { text-align: start; }
}

/* ─── RTL flip icon arrows ──────────────────────────────────────── */
[dir="rtl"] .reports-btn svg { transform: scaleX(-1); }
[dir="rtl"] .reports-card__download:hover { transform: translateX(-2px); }
[dir="rtl"] .reports-hero__scroll { right: 50%; left: auto; transform: translateX(50%); }
`
