'use client'

// ═══════════════════════════════════════════════════════════════
// 📱 INSTAGRAM TAB - Instagram Posts Management
// تبويب إنستغرام - إدارة منشورات إنستغرام
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react'
import { useApp } from '@/contexts/AppContext'
import { useToast } from '@/components/admin/Toast'
import { motion } from 'framer-motion'

export default function InstagramTab() {
  const { locale } = useApp()
  const { success, error: showError } = useToast()
  const isAr = locale === 'ar'

  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, totalLikes: 0, totalComments: 0 })

  useEffect(() => {
    fetchPosts()
  }, [])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/admin/gallery/instagram')
      const result = await response.json()
      if (result.success) {
        setPosts(result.data.posts)
        setStats(result.data.stats)
      }
    } catch (error) {
      console.error('Failed to fetch posts:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="text-4xl mb-2">📱</div>
          <div className="text-3xl font-bold">{stats.total}</div>
          <div className="text-white/90">{isAr ? 'منشورات' : 'Posts'}</div>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="text-4xl mb-2">❤️</div>
          <div className="text-3xl font-bold">{stats.totalLikes}</div>
          <div className="text-white/90">{isAr ? 'إعجابات' : 'Likes'}</div>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl p-6 text-white shadow-xl">
          <div className="text-4xl mb-2">💬</div>
          <div className="text-3xl font-bold">{stats.totalComments}</div>
          <div className="text-white/90">{isAr ? 'تعليقات' : 'Comments'}</div>
        </div>
      </div>

      {/* Info */}
      <div className="bg-gradient-to-r from-pink-50 to-rose-50 dark:from-pink-900/20 dark:to-rose-900/20 border-2 border-pink-300 dark:border-pink-700 rounded-2xl p-8">
        <div className="text-center">
          <div className="text-6xl mb-4">📱</div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {isAr ? 'منشورات إنستغرام' : 'Instagram Posts'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {isAr 
              ? 'قم بإضافة وإدارة منشورات إنستغرام التي تظهر في صفحة المعرض'
              : 'Add and manage Instagram posts that appear on the gallery page'}
          </p>
          <button
            onClick={() => showError(isAr ? 'سيتم تفعيل هذه الميزة قريباً' : 'This feature will be activated soon')}
            className="px-8 py-4 bg-gradient-to-r from-pink-600 to-rose-600 text-white rounded-xl font-bold hover:shadow-2xl transition-all"
          >
            {isAr ? 'إضافة منشور' : 'Add Post'}
          </button>
        </div>
      </div>

      {/* Posts Grid */}
      {!loading && posts.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {posts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.05 }}
              className="aspect-square rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transition-all group relative bg-gradient-to-br from-pink-400 to-purple-600"
            >
              {post.imageUrl ? (
                <img
                  src={post.imageUrl}
                  alt="Instagram post"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-white/30 text-4xl">
                  📷
                </div>
              )}
              
              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/70 transition-all flex items-center justify-center">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity text-white text-center p-4">
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-center gap-2">
                      <span>❤️</span>
                      <span className="font-bold">{post.likes}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2">
                      <span>💬</span>
                      <span className="font-bold">{post.comments}</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  )
}
