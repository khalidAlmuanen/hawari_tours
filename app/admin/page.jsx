'use client'

// ═══════════════════════════════════════════════════════════════
// 👑 ADMIN DASHBOARD - Ultra Modern & Professional
// لوحة تحكم احترافية وعصرية جداً مع بيانات حقيقية
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react'
import { useApp } from '@/contexts/AppContext'
import AdminLayout from '@/components/admin/AdminLayout'
import { useToast } from '@/components/admin/Toast'
import { Line, Bar, Doughnut } from 'react-chartjs-2'
import { motion } from 'framer-motion'
import Link from 'next/link'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

export default function AdminDashboard() {
  const { locale, isDark } = useApp()
  const { success, error: showError } = useToast()
  const isAr = locale === 'ar'

  // State
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [refreshing, setRefreshing] = useState(false)

  // Fetch Dashboard Data
  useEffect(() => {
    fetchDashboardData()

    // Auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchDashboardData(true)
    }, 30000)

    return () => clearInterval(interval)
  }, [])

  const fetchDashboardData = async (silent = false) => {
    if (!silent) setLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/admin/stats')

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }

      const result = await response.json()

      if (!result.success) {
        throw new Error(result.error || 'Failed to fetch stats')
      }

      setStats(result.data)
    } catch (err) {
      console.error('Dashboard fetch error:', err)
      setError(err.message)
      setStats(getFallbackData())
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchDashboardData()
    success(isAr ? 'تم تحديث البيانات بنجاح' : 'Data refreshed successfully')
  }

  const getFallbackData = () => ({
    totalTours: 0,
    totalBookings: 0,
    totalRevenue: 0,
    activeUsers: 0,
    toursGrowth: 0,
    bookingsGrowth: 0,
    revenueGrowth: 0,
    usersGrowth: 0,
    monthlyBookings: Array(12).fill(0),
    monthlyRevenue: Array(12).fill(0),
    recentBookings: [],
    topTours: [],
    trafficSources: []
  })

  // Chart Data
  const chartLabels = stats?.monthlyLabels || ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  
  const bookingsChartData = stats ? {
    labels: chartLabels,
    datasets: [{
      label: isAr ? 'الحجوزات' : 'Bookings',
      data: stats.monthlyBookings || Array(12).fill(0),
      borderColor: 'rgb(59, 130, 246)',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      fill: true,
      tension: 0.4
    }]
  } : null

  const revenueChartData = stats ? {
    labels: chartLabels,
    datasets: [{
      label: isAr ? 'الإيرادات ($)' : 'Revenue ($)',
      data: stats.monthlyRevenue || Array(12).fill(0),
      backgroundColor: 'rgba(16, 185, 129, 0.8)',
      borderColor: 'rgb(16, 185, 129)',
      borderWidth: 2
    }]
  } : null

  const trafficChartData = stats?.trafficSources?.length > 0 ? {
    labels: stats.trafficSources.map(s => s.source),
    datasets: [{
      data: stats.trafficSources.map(s => s.visitors),
      backgroundColor: [
        'rgba(59, 130, 246, 0.8)',
        'rgba(16, 185, 129, 0.8)',
        'rgba(245, 158, 11, 0.8)',
        'rgba(239, 68, 68, 0.8)',
        'rgba(139, 92, 246, 0.8)'
      ],
      borderWidth: 0
    }]
  } : null

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: true,
        position: 'top'
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }

  // Loading State
  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="text-center">
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="relative inline-block mb-8"
          >
            <div className="w-32 h-32 border-8 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-6xl">👑</div>
          </motion.div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            {isAr ? 'جاري التحميل...' : 'Loading...'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {isAr ? 'جلب البيانات من الخادم' : 'Fetching data from server'}
          </p>
        </div>
      </div>
    )
  }

  // Error State
  if (error && !stats) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center py-20">
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="max-w-md w-full bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-2xl text-center"
          >
            <div className="text-6xl mb-6">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              {isAr ? 'خطأ في الاتصال' : 'Connection Error'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
            <button
              onClick={handleRefresh}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-xl transition-all"
            >
              {isAr ? 'إعادة المحاولة' : 'Retry'}
            </button>
          </motion.div>
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {stats && (
          <>
            {/* Welcome Header */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center justify-between"
            >
              <div>
                <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-2">
                  {isAr ? 'مرحباً بك! 👋' : 'Welcome back! 👋'}
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  {isAr ? 'إليك ملخص لأداء اليوم' : "Here's what's happening with your business today"}
                </p>
                {stats.lastUpdate && (
                  <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
                    {isAr ? 'آخر تحديث:' : 'Last updated:'} {new Date(stats.lastUpdate).toLocaleTimeString(locale)}
                  </p>
                )}
              </div>
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-xl transition-all disabled:opacity-50 flex items-center gap-2"
              >
                <svg
                  className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>{isAr ? 'تحديث' : 'Refresh'}</span>
              </button>
            </motion.div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total Tours */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-6 text-white shadow-xl hover:shadow-2xl hover:shadow-blue-500/50 transition-all cursor-pointer"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.3, type: "spring" }}
                      className="flex items-center gap-1 text-sm font-bold bg-white/20 px-3 py-1 rounded-full"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      <span>+{stats.toursGrowth}%</span>
                    </motion.div>
                  </div>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="text-5xl font-black mb-2"
                  >
                    {stats.totalTours}
                  </motion.div>
                  <div className="text-blue-100 font-semibold">
                    {isAr ? 'إجمالي الجولات' : 'Total Tours'}
                  </div>
                </div>
              </motion.div>

              {/* Total Bookings */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="relative overflow-hidden bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl p-6 text-white shadow-xl hover:shadow-2xl hover:shadow-green-500/50 transition-all cursor-pointer"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.4, type: "spring" }}
                      className="flex items-center gap-1 text-sm font-bold bg-white/20 px-3 py-1 rounded-full"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      <span>+{stats.bookingsGrowth}%</span>
                    </motion.div>
                  </div>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 }}
                    className="text-5xl font-black mb-2"
                  >
                    {stats.totalBookings}
                  </motion.div>
                  <div className="text-green-100 font-semibold">
                    {isAr ? 'إجمالي الحجوزات' : 'Total Bookings'}
                  </div>
                </div>
              </motion.div>

              {/* Total Revenue */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="relative overflow-hidden bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl p-6 text-white shadow-xl hover:shadow-2xl hover:shadow-purple-500/50 transition-all cursor-pointer"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.5, type: "spring" }}
                      className="flex items-center gap-1 text-sm font-bold bg-white/20 px-3 py-1 rounded-full"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      <span>+{stats.revenueGrowth}%</span>
                    </motion.div>
                  </div>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-5xl font-black mb-2"
                  >
                    ${stats.totalRevenue?.toLocaleString() || 0}
                  </motion.div>
                  <div className="text-purple-100 font-semibold">
                    {isAr ? 'إجمالي الإيرادات' : 'Total Revenue'}
                  </div>
                </div>
              </motion.div>

              {/* Active Users */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="relative overflow-hidden bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl p-6 text-white shadow-xl hover:shadow-2xl hover:shadow-orange-500/50 transition-all cursor-pointer"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
                <div className="relative">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                    <motion.div 
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 0.6, type: "spring" }}
                      className="flex items-center gap-1 text-sm font-bold bg-white/20 px-3 py-1 rounded-full"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      <span>+{stats.usersGrowth}%</span>
                    </motion.div>
                  </div>
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-5xl font-black mb-2"
                  >
                    {stats.activeUsers}
                  </motion.div>
                  <div className="text-orange-100 font-semibold">
                    {isAr ? 'المستخدمين النشطين' : 'Active Users'}
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Charts Row */}
            {bookingsChartData && revenueChartData && (
              <div className="grid lg:grid-cols-2 gap-6">
                {/* Bookings Chart */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        {isAr ? 'الحجوزات الشهرية' : 'Monthly Bookings'}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {isAr ? 'آخر 12 شهر' : 'Last 12 months'}
                      </p>
                    </div>
                    <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-2xl">
                      <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                      </svg>
                    </div>
                  </div>
                  <div className="h-80">
                    <Line data={bookingsChartData} options={chartOptions} />
                  </div>
                </motion.div>

                {/* Revenue Chart */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        {isAr ? 'الإيرادات الشهرية' : 'Monthly Revenue'}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {isAr ? 'آخر 12 شهر' : 'Last 12 months'}
                      </p>
                    </div>
                    <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-2xl">
                      <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                  <div className="h-80">
                    <Bar data={revenueChartData} options={chartOptions} />
                  </div>
                </motion.div>
              </div>
            )}

            {/* Bottom Row */}
            <div className="grid lg:grid-cols-3 gap-6">
              {/* Recent Bookings */}
              {stats.recentBookings && stats.recentBookings.length > 0 && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="lg:col-span-2 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                        {isAr ? 'أحدث الحجوزات' : 'Recent Bookings'}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-400">
                        {isAr ? 'آخر 5 حجوزات' : 'Last 5 bookings'}
                      </p>
                    </div>
                    <Link
                      href="/admin/bookings"
                      className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-xl font-semibold hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all"
                    >
                      {isAr ? 'عرض الكل' : 'View All'}
                    </Link>
                  </div>

                  <div className="space-y-4">
                    {stats.recentBookings.map((booking, index) => (
                      <motion.div
                        key={booking.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + (index * 0.1) }}
                        className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-2xl hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                      >
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                          {booking.customer.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-gray-900 dark:text-white truncate">{booking.tour}</div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {booking.customer} • {booking.date}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-bold text-gray-900 dark:text-white">${booking.amount}</div>
                          <div
                            className={`text-xs font-semibold px-2 py-1 rounded-full ${
                              booking.status === 'confirmed'
                                ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                                : booking.status === 'pending'
                                ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400'
                                : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                            }`}
                          >
                            {booking.status}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}

              {/* Traffic Sources */}
              {trafficChartData && (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-3xl p-6 shadow-xl"
                >
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                      {isAr ? 'مصادر الزوار' : 'Traffic Sources'}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">{isAr ? 'هذا الشهر' : 'This month'}</p>
                  </div>

                  <div className="h-64 mb-6">
                    <Doughnut
                      data={trafficChartData}
                      options={{ ...chartOptions, plugins: { legend: { display: false } } }}
                    />
                  </div>

                  <div className="space-y-3">
                    {stats.trafficSources.map((source, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.9 + (index * 0.1) }}
                        className="flex items-center gap-3"
                      >
                        <div
                          className="w-3 h-3 rounded-full flex-shrink-0"
                          style={{ backgroundColor: trafficChartData.datasets[0].backgroundColor[index] }}
                        ></div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                              {source.source}
                            </span>
                            <span className="text-sm text-gray-600 dark:text-gray-400">{source.percentage}%</span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mt-1 overflow-hidden">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${source.percentage}%` }}
                              transition={{ delay: 1 + (index * 0.1), duration: 0.8 }}
                              className="h-full rounded-full"
                              style={{ backgroundColor: trafficChartData.datasets[0].backgroundColor[index] }}
                            ></motion.div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </>
        )}
      </div>
    </AdminLayout>
  )
}
