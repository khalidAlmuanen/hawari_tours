// ═══════════════════════════════════════════════════════════════
// 📰 Professional News Service - خدمة الأخبار الاحترافية
// ✅ Smart Political Content Filtering
// ✅ Advanced Categorization
// ✅ Intelligent Caching System
// ✅ Multi-Source Aggregation
// ═══════════════════════════════════════════════════════════════

'use client'

// ═══════════════════════════════════════════════════════════════
// 🚫 POLITICAL KEYWORDS BLACKLIST - قائمة سوداء للمحتوى السياسي
// ═══════════════════════════════════════════════════════════════
const POLITICAL_BLACKLIST = {
  arabic: [
    'حرب', 'حوثي', 'حوثيين', 'انقلاب', 'صراع', 'نزاع', 'قصف', 'معارك',
    'ميليشيا', 'انفصال', 'تمرد', 'احتلال', 'عدوان', 'مقاومة',
    'جبهة', 'تحالف عسكري', 'قوات', 'جيش', 'عسكري', 'سياسي',
    'حزب', 'انتخابات', 'رئيس', 'وزير', 'حكومة', 'برلمان',
    'مظاهرات', 'احتجاجات', 'ثورة', 'انقسام سياسي'
  ],
  english: [
    'war', 'houthi', 'houthis', 'coup', 'conflict', 'dispute', 'bombing', 'battles',
    'militia', 'separatist', 'rebellion', 'occupation', 'aggression', 'resistance',
    'front', 'military alliance', 'forces', 'army', 'military', 'political',
    'party', 'election', 'president', 'minister', 'government', 'parliament',
    'protest', 'demonstration', 'revolution', 'political division',
    'civil war', 'armed', 'weapon', 'terror', 'violence', 'attack',
    'crisis', 'sanction', 'regime', 'insurgent'
  ]
}

// ═══════════════════════════════════════════════════════════════
// ✅ APPROVED KEYWORDS - الكلمات المفتاحية المعتمدة
// ═══════════════════════════════════════════════════════════════
const APPROVED_KEYWORDS = {
  // سياحة واقتصاد
  tourism: [
    'Socotra tourism', 'Socotra travel', 'Socotra island tourism',
    'visit Socotra', 'Socotra hotels', 'Socotra resorts',
    'Socotra flights', 'Socotra tours', 'Socotra guide',
    'Socotra adventure', 'eco-tourism Socotra', 'Socotra vacation',
    'سقطرى سياحة', 'زيارة سقطرى', 'فنادق سقطرى', 'رحلات سقطرى'
  ],
  
  // اقتصاد وتنمية
  economy: [
    'Socotra economy', 'Socotra development', 'Socotra investment',
    'Socotra trade', 'Socotra business', 'Socotra infrastructure',
    'Socotra airport', 'Socotra port', 'economic development Socotra',
    'اقتصاد سقطرى', 'تنمية سقطرى', 'استثمار سقطرى', 'تجارة سقطرى'
  ],
  
  // بيئة وطبيعة
  environment: [
    'Socotra biodiversity', 'Dragon Blood Tree', 'Socotra flora',
    'Socotra fauna', 'endemic species Socotra', 'Socotra conservation',
    'Socotra environment', 'Socotra nature', 'Socotra wildlife',
    'Socotra ecosystem', 'Socotra plants', 'Socotra animals',
    'بيئة سقطرى', 'شجرة دم الأخوين', 'محمية سقطرى', 'تنوع حيوي سقطرى'
  ],
  
  // تراث وثقافة
  culture: [
    'Socotra UNESCO', 'Socotra heritage', 'Socotra culture',
    'Socotra traditions', 'Socotra history', 'Socotra archaeology',
    'World Heritage Socotra', 'cultural heritage Socotra',
    'تراث سقطرى', 'ثقافة سقطرى', 'يونسكو سقطرى'
  ],
  
  // علوم وبحث
  science: [
    'Socotra research', 'Socotra study', 'Socotra discovery',
    'scientific Socotra', 'Socotra expedition', 'Socotra geology',
    'بحث علمي سقطرى', 'اكتشاف سقطرى', 'دراسة سقطرى'
  ],
  
  // طقس ومناخ
  weather: [
    'Socotra weather', 'Socotra climate', 'Socotra seasons',
    'Socotra monsoon', 'weather forecast Socotra',
    'طقس سقطرى', 'مناخ سقطرى', 'موسم سقطرى'
  ]
}

// ═══════════════════════════════════════════════════════════════
// 🔍 SMART POLITICAL CONTENT DETECTOR
// ═══════════════════════════════════════════════════════════════
export function isPoliticalContent(article) {
  if (!article) return true

  const text = `
    ${article.title || ''} 
    ${article.description || ''} 
    ${article.content || ''}
  `.toLowerCase()

  // ✅ Check Arabic blacklist
  const hasArabicPolitical = POLITICAL_BLACKLIST.arabic.some(keyword => 
    text.includes(keyword.toLowerCase())
  )

  // ✅ Check English blacklist
  const hasEnglishPolitical = POLITICAL_BLACKLIST.english.some(keyword => 
    text.includes(keyword.toLowerCase())
  )

  // ⚠️ Additional political indicators
  const politicalPatterns = [
    /armed\s+conflict/i,
    /military\s+operation/i,
    /political\s+crisis/i,
    /civil\s+war/i,
    /government\s+forces/i,
    /rebel\s+group/i,
    /اشتباكات|معارك|عمليات عسكرية|أزمة سياسية/i
  ]

  const hasPatterns = politicalPatterns.some(pattern => pattern.test(text))

  return hasArabicPolitical || hasEnglishPolitical || hasPatterns
}

// ═══════════════════════════════════════════════════════════════
// ✅ APPROVED CONTENT VALIDATOR
// ═══════════════════════════════════════════════════════════════
export function isApprovedContent(article) {
  if (!article) return false

  const text = `
    ${article.title || ''} 
    ${article.description || ''} 
    ${article.content || ''}
  `.toLowerCase()

  // ✅ Must mention Socotra
  const mentionsSocotra = /socotra|soqotra|سقطرى/i.test(text)
  if (!mentionsSocotra) return false

  // ✅ Check if matches approved keywords
  const allApprovedKeywords = Object.values(APPROVED_KEYWORDS).flat()
  const hasApprovedKeyword = allApprovedKeywords.some(keyword =>
    text.includes(keyword.toLowerCase())
  )

  return hasApprovedKeyword
}

// ═══════════════════════════════════════════════════════════════
// 🎯 ADVANCED CONTENT QUALITY FILTER
// ═══════════════════════════════════════════════════════════════
export function isQualityContent(article) {
  if (!article) return false

  // ✅ Must have title and description
  if (!article.title || !article.description) return false

  // ✅ Title must not be "[Removed]"
  if (article.title === '[Removed]' || article.description === '[Removed]') {
    return false
  }

  // ✅ Minimum content length
  const description = article.description || ''
  if (description.length < 50) return false

  // ✅ Must have valid source
  if (!article.source?.name) return false

  // ✅ Not too old (last 90 days)
  if (article.publishedAt) {
    const publishDate = new Date(article.publishedAt)
    const now = new Date()
    const daysDiff = (now - publishDate) / (1000 * 60 * 60 * 24)
    if (daysDiff > 90) return false
  }

  return true
}

// ═══════════════════════════════════════════════════════════════
// 🏷️ SMART CATEGORIZATION
// ═══════════════════════════════════════════════════════════════
export function categorizeArticle(article) {
  if (!article) return 'tourism'

  const text = `${article.title} ${article.description || ''} ${article.content || ''}`.toLowerCase()

  // Tourism indicators (weighted scoring)
  const tourismScore = countKeywordMatches(text, APPROVED_KEYWORDS.tourism)
  
  // Economy indicators
  const economyScore = countKeywordMatches(text, APPROVED_KEYWORDS.economy)
  
  // Environment indicators
  const environmentScore = countKeywordMatches(text, APPROVED_KEYWORDS.environment)
  
  // Culture/UNESCO indicators
  const cultureScore = countKeywordMatches(text, APPROVED_KEYWORDS.culture)
  
  // Science indicators
  const scienceScore = countKeywordMatches(text, APPROVED_KEYWORDS.science)
  
  // Weather indicators
  const weatherScore = countKeywordMatches(text, APPROVED_KEYWORDS.weather)

  // Return category with highest score
  const scores = {
    tourism: tourismScore,
    economy: economyScore,
    environment: environmentScore,
    unesco: cultureScore,
    science: scienceScore,
    weather: weatherScore
  }

  const maxScore = Math.max(...Object.values(scores))
  if (maxScore === 0) return 'tourism' // default

  return Object.keys(scores).find(key => scores[key] === maxScore) || 'tourism'
}

function countKeywordMatches(text, keywords) {
  return keywords.reduce((count, keyword) => {
    const regex = new RegExp(keyword.toLowerCase(), 'gi')
    const matches = text.match(regex)
    return count + (matches ? matches.length : 0)
  }, 0)
}

// ═══════════════════════════════════════════════════════════════
// 🧹 COMPREHENSIVE ARTICLE FILTER
// ═══════════════════════════════════════════════════════════════
export function filterArticles(articles) {
  if (!Array.isArray(articles)) return []

  return articles.filter(article => {
    // ✅ Must be quality content
    if (!isQualityContent(article)) return false

    // ✅ Must be approved content (mentions Socotra + approved topics)
    if (!isApprovedContent(article)) return false

    // 🚫 Must NOT be political
    if (isPoliticalContent(article)) return false

    return true
  })
}

// ═══════════════════════════════════════════════════════════════
// 📊 BUILD OPTIMIZED SEARCH QUERIES
// ═══════════════════════════════════════════════════════════════
export function buildSearchQueries(locale = 'en') {
  const queries = []

  // ✅ Primary Socotra queries
  queries.push('Socotra tourism development')
  queries.push('Socotra island economy')
  queries.push('Socotra biodiversity conservation')
  queries.push('Dragon Blood Tree Socotra')
  queries.push('Socotra UNESCO heritage')
  queries.push('Socotra weather climate')

  // ✅ Specific tourism queries
  queries.push('Socotra hotels resorts')
  queries.push('flights to Socotra')
  queries.push('visiting Socotra island')

  // ✅ Economy & Development
  queries.push('Socotra infrastructure development')
  queries.push('investment opportunities Socotra')

  // ✅ Environment
  queries.push('endemic species Socotra')
  queries.push('Socotra nature reserve')

  // ✅ Arabic queries if locale is Arabic
  if (locale === 'ar') {
    queries.push('سقطرى سياحة')
    queries.push('اقتصاد سقطرى')
    queries.push('شجرة دم الأخوين')
    queries.push('محمية سقطرى')
  }

  return queries.slice(0, 10) // Limit to 10 queries to avoid API limits
}

// ═══════════════════════════════════════════════════════════════
// 💾 INTELLIGENT CACHING SYSTEM
// ═══════════════════════════════════════════════════════════════
const CACHE_DURATION = 30 * 60 * 1000 // 30 minutes
let cachedData = null
let cacheTimestamp = null

export function getCachedNews() {
  if (!cachedData || !cacheTimestamp) return null

  const now = Date.now()
  const isExpired = (now - cacheTimestamp) > CACHE_DURATION

  if (isExpired) {
    cachedData = null
    cacheTimestamp = null
    return null
  }

  return cachedData
}

export function setCachedNews(data) {
  cachedData = data
  cacheTimestamp = Date.now()
}

export function clearCache() {
  cachedData = null
  cacheTimestamp = null
}

// ═══════════════════════════════════════════════════════════════
// 🎨 ADVANCED GRADIENT SELECTION
// ═══════════════════════════════════════════════════════════════
export function getAdvancedGradient(category, sentiment = 'neutral') {
  const gradients = {
    tourism: {
      positive: 'from-blue-500 via-cyan-500 to-teal-500',
      neutral: 'from-blue-600 via-indigo-600 to-purple-600',
      negative: 'from-blue-700 via-slate-700 to-gray-800'
    },
    economy: {
      positive: 'from-emerald-500 via-green-500 to-teal-500',
      neutral: 'from-emerald-600 via-green-600 to-teal-600',
      negative: 'from-emerald-700 via-slate-700 to-gray-800'
    },
    environment: {
      positive: 'from-green-500 via-lime-500 to-emerald-500',
      neutral: 'from-green-600 via-emerald-600 to-teal-600',
      negative: 'from-green-700 via-slate-700 to-gray-800'
    },
    unesco: {
      positive: 'from-purple-500 via-pink-500 to-rose-500',
      neutral: 'from-purple-600 via-pink-600 to-rose-600',
      negative: 'from-purple-700 via-slate-700 to-gray-800'
    },
    science: {
      positive: 'from-indigo-500 via-blue-500 to-cyan-500',
      neutral: 'from-indigo-600 via-blue-600 to-cyan-600',
      negative: 'from-indigo-700 via-slate-700 to-gray-800'
    },
    weather: {
      positive: 'from-orange-400 via-amber-400 to-yellow-400',
      neutral: 'from-orange-500 via-amber-500 to-yellow-500',
      negative: 'from-orange-600 via-red-600 to-rose-700'
    }
  }

  return gradients[category]?.[sentiment] || 'from-gray-600 via-slate-600 to-gray-700'
}

// ═══════════════════════════════════════════════════════════════
// 📈 REALISTIC ENGAGEMENT METRICS
// ═══════════════════════════════════════════════════════════════
export function generateEngagementMetrics(article, index, category) {
  const baseViews = {
    tourism: 2500,
    economy: 1800,
    environment: 1500,
    unesco: 1200,
    science: 1000,
    weather: 3000
  }

  const base = baseViews[category] || 1500
  const variation = Math.floor(Math.random() * 1000)
  const positionFactor = Math.max(0.3, (15 - index) / 15)
  const views = Math.floor(base * positionFactor + variation)

  // Calculate engagement score
  const hasImage = article.urlToImage ? 1.3 : 1.0
  const hasAuthor = article.author ? 1.2 : 1.0
  const contentQuality = Math.min(2.0, (article.description?.length || 500) / 500)
  const engagement = Math.min(100, Math.floor(hasImage * hasAuthor * contentQuality * 40))

  return { views, engagement }
}

const newsService = {
  isPoliticalContent,
  isApprovedContent,
  isQualityContent,
  categorizeArticle,
  filterArticles,
  buildSearchQueries,
  getCachedNews,
  setCachedNews,
  clearCache,
  getAdvancedGradient,
  generateEngagementMetrics
}

export default newsService
