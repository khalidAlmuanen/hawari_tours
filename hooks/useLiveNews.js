// ═══════════════════════════════════════════════════════════════
// 📰 PROFESSIONAL NEWS HOOK - CLIENT SIDE
// hooks/useLiveNews.js
// ✅ Calls server-side API route
// ✅ No CORS issues
// ✅ Smart caching
// ✅ Guaranteed fallback
// ═══════════════════════════════════════════════════════════════

'use client'

import { useState, useEffect, useCallback } from 'react'

// Cache duration: 30 minutes
const CACHE_DURATION = 30 * 60 * 1000
let cachedData = null
let cacheTimestamp = null

export function useLiveNews(locale = 'en') {
  const [featuredNews, setFeaturedNews] = useState([])
  const [newsArticles, setNewsArticles] = useState([])
  const [trendingTopics, setTrendingTopics] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdate, setLastUpdate] = useState(null)
  const [newsStats, setNewsStats] = useState({
    totalArticles: 0,
    sourcesCount: 0,
    filteredOut: 0,
    updateFrequency: '30 min'
  })

  // ═══════════════════════════════════════════════════════════
  // 📡 FETCH FROM SERVER API ROUTE
  // ═══════════════════════════════════════════════════════════
  const fetchNewsData = useCallback(async () => {
    // Check cache first
    if (cachedData && cacheTimestamp) {
      const now = Date.now()
      const isExpired = (now - cacheTimestamp) > CACHE_DURATION

      if (!isExpired) {
        console.log('📦 Using cached news data')
        setFeaturedNews(cachedData.featured)
        setNewsArticles(cachedData.articles)
        setTrendingTopics(cachedData.trending)
        setNewsStats(cachedData.stats)
        setLastUpdate(new Date(cachedData.timestamp))
        setLoading(false)
        return
      }
    }

    try {
      setLoading(true)
      setError(null)
      console.log('🔄 Fetching news from server...')

      // ✅ Call SERVER API route (no CORS!)
      const response = await fetch(`/api/news?locale=${locale}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch news')
      }

      const data = await response.json()

      console.log(`✅ Received ${data.total} articles from server`)
      console.log(`📡 Sources: ${data.sources.join(', ')}`)
      if (data.isFallback) {
        console.log('ℹ️ Using fallback data')
      }

      // Process articles
      const processed = processArticles(data.articles, locale)

      // Split into categories
      const featured = processed.slice(0, 3)
      const articles = processed.slice(0, 12)
      const trending = extractTrendingTopics(processed)

      const stats = {
        totalArticles: processed.length,
        sourcesCount: data.sources.length,
        filteredOut: 0,
        updateFrequency: '30 min'
      }

      setFeaturedNews(featured)
      setNewsArticles(articles)
      setTrendingTopics(trending)
      setNewsStats(stats)

      const now = new Date()
      setLastUpdate(now)
      setLoading(false)

      // ✅ Cache ONLY if we have valid data
      if (processed.length > 0) {
        cachedData = {
          featured,
          articles,
          trending,
          stats,
          timestamp: now.getTime()
        }
        cacheTimestamp = now.getTime()
        console.log('💾 Data cached for 30 minutes')
      }

      console.log('✅ News loaded successfully!')

    } catch (err) {
      console.error('❌ Error fetching news:', err)
      setError(err.message)
      setLoading(false)
    }
  }, [locale])

  // ═══════════════════════════════════════════════════════════
  // 🔧 HELPER FUNCTIONS
  // ═══════════════════════════════════════════════════════════
  const processArticles = (articles, locale) => {
    return articles.map((article, index) => {
      const category = categorizeArticle(article)
      const sentiment = analyzeSentiment(article)

      return {
        id: `news_${index + 1}_${Date.now()}`,
        category,
        sentiment,
        breaking: isBreakingNews(article),
        trending: isTrending(article),
        title: {
          ar: article.title,
          en: article.title
        },
        excerpt: {
          ar: cleanText(article.description),
          en: cleanText(article.description)
        },
        content: article.description,
        date: new Date(article.publishedAt).toISOString().split('T')[0],
        publishedAt: article.publishedAt,
        source: article.source?.name || 'News Source',
        author: article.author || 'Staff Writer',
        url: article.url || '#',
        image: article.urlToImage,
        readTime: calculateReadTime(article.description),
        views: generateViews(index, category),
        engagement: generateEngagement(article),
        gradient: getGradient(category, sentiment),
        tags: extractTags(article, category)
      }
    })
  }

  const categorizeArticle = (article) => {
    const text = `${article.title} ${article.description || ''}`.toLowerCase()

    const scores = {
      tourism: countMatches(text, ['tourism', 'tourist', 'travel', 'hotel', 'flight', 'resort', 'visitor']),
      economy: countMatches(text, ['economy', 'investment', 'business', 'development', 'infrastructure', 'growth']),
      environment: countMatches(text, ['environment', 'biodiversity', 'species', 'conservation', 'tree', 'wildlife', 'nature']),
      unesco: countMatches(text, ['unesco', 'heritage', 'culture', 'preservation']),
      science: countMatches(text, ['research', 'study', 'discovery', 'scientific'])
    }

    const maxScore = Math.max(...Object.values(scores))
    return Object.keys(scores).find(key => scores[key] === maxScore) || 'tourism'
  }

  const countMatches = (text, keywords) => {
    return keywords.reduce((count, keyword) => {
      return count + (text.includes(keyword) ? 1 : 0)
    }, 0)
  }

  const analyzeSentiment = (article) => {
    const text = `${article.title} ${article.description || ''}`.toLowerCase()
    const positive = ['success', 'growth', 'increase', 'improve', 'benefit', 'discover']
    const negative = ['decline', 'threat', 'danger', 'crisis', 'problem']

    const posScore = positive.filter(word => text.includes(word)).length
    const negScore = negative.filter(word => text.includes(word)).length

    if (posScore > negScore) return 'positive'
    if (negScore > posScore) return 'negative'
    return 'neutral'
  }

  const isBreakingNews = (article) => {
    const publishedTime = new Date(article.publishedAt)
    const now = new Date()
    const hoursSincePublished = (now - publishedTime) / (1000 * 60 * 60)
    return hoursSincePublished < 12
  }

  const isTrending = (article) => {
    const title = article.title?.toLowerCase() || ''
    return ['record', 'first', 'new', 'major', 'historic'].some(keyword => title.includes(keyword))
  }

  const extractTrendingTopics = (articles) => {
    const topics = new Map()

    articles.forEach(article => {
      const words = (article.title.en + ' ' + article.excerpt.en)
        .toLowerCase()
        .split(/\W+/)
        .filter(word => word.length > 4 && !['socotra', 'island', 'yemen'].includes(word))

      words.forEach(word => {
        topics.set(word, (topics.get(word) || 0) + 1)
      })
    })

    return Array.from(topics.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([topic, count]) => ({
        topic: topic.charAt(0).toUpperCase() + topic.slice(1),
        count
      }))
  }

  const extractTags = (article, category) => {
    const tags = []
    if (isBreakingNews(article)) tags.push('Breaking')
    if (category === 'tourism') tags.push('Tourism')
    if (category === 'economy') tags.push('Economy')
    if (category === 'environment') tags.push('Environment')
    if (category === 'unesco') tags.push('UNESCO')
    return tags.slice(0, 3)
  }

  const cleanText = (text) => {
    if (!text) return ''
    return text
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .substring(0, 150) + (text.length > 150 ? '...' : '')
  }

  const calculateReadTime = (content) => {
    if (!content) return '3 min'
    const words = content.split(/\s+/).length
    const minutes = Math.ceil(words / 200)
    return `${Math.max(1, Math.min(minutes, 10))} min`
  }

  const generateViews = (index, category) => {
    const base = { tourism: 2500, economy: 1800, environment: 1500, unesco: 1200 }[category] || 1500
    return Math.floor(base * (1 - index * 0.1) + Math.random() * 500)
  }

  const generateEngagement = (article) => {
    return Math.floor(70 + Math.random() * 25)
  }

  const getGradient = (category, sentiment) => {
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
      }
    }

    return gradients[category]?.[sentiment] || 'from-gray-600 via-slate-600 to-gray-700'
  }

  // ═══════════════════════════════════════════════════════════
  // 🔄 INITIALIZATION
  // ═══════════════════════════════════════════════════════════
  useEffect(() => {
    fetchNewsData()

    // Auto-refresh every 30 minutes
    const interval = setInterval(fetchNewsData, 30 * 60 * 1000)
    return () => clearInterval(interval)
  }, [fetchNewsData])

  return {
    featuredNews,
    newsArticles,
    trendingTopics,
    newsStats,
    loading,
    error,
    lastUpdate,
    refresh: fetchNewsData
  }
}