'use client'

// ═══════════════════════════════════════════════════════════════════════
// 📊 ANALYTICS DASHBOARD - Professional & Modern
// لوحة تحكم التحليلات - تجربة مستخدم عصرية وشاملة
// ═══════════════════════════════════════════════════════════════════════

import { useState, useEffect, useCallback } from 'react'
import { useApp } from '@/contexts/AppContext'
import AdminLayout from '@/components/admin/AdminLayout'
import { useToast } from '@/components/admin/Toast'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    AreaChart, Area
} from 'recharts'
import {
    TrendingUp, TrendingDown, DollarSign, Users, Calendar,
    MapPin, Activity, ArrowUpRight, ArrowDownRight,
    CreditCard, Star, Clock, Filter, Download
} from 'lucide-react'

// 🎨 Contemporary Color Palette
const COLORS = {
    primary: '#10b981',    // Emerald 500
    primaryLight: '#34d399',
    secondary: '#3b82f6',  // Blue 500
    accent: '#8b5cf6',     // Violet 500
    warning: '#f59e0b',    // Amber 500
    danger: '#ef4444',     // Red 500
    dark: '#1f2937',       // Gray 800
    light: '#f3f4f6'       // Gray 100
}

const PIE_COLORS = ['#10b981', '#3b82f6', '#8b5cf6', '#f59e0b', '#ec4899', '#06b6d4']

export default function AnalyticsDashboard() {
    const { locale } = useApp()
    const { error: showError } = useToast()
    const isAr = locale === 'ar'

    // State Management
    const [period, setPeriod] = useState('30days') // 7days, 30days, 90days, 12months
    const [loading, setLoading] = useState(true)
    const [overview, setOverview] = useState(null)
    const [chartsData, setChartsData] = useState(null)
    const [bookingStatus, setBookingStatus] = useState(null)
    const [categoryData, setCategoryData] = useState(null)
    const [topPerformers, setTopPerformers] = useState(null)

    // ═══════════════════════════════════════════════════════════════
    // 🔄 Data Fetching Strategy
    // ═══════════════════════════════════════════════════════════════
    const fetchAnalytics = useCallback(async () => {
        try {
            setLoading(true)

            // Parallel data fetching for optimal performance
            const [overviewRes, chartsRes, demographicsRes, leadersRes] = await Promise.all([
                fetch(`/api/admin/analytics?type=overview&period=${period}`),
                fetch(`/api/admin/analytics?type=charts&period=${period}`),
                fetch(`/api/admin/analytics?type=demographics&period=${period}`),
                fetch(`/api/admin/analytics?type=leaders&period=${period}`)
            ])

            const overviewData = await overviewRes.json()
            const chartsDataParsed = await chartsRes.json()
            const demographicsData = await demographicsRes.json()
            const leadersData = await leadersRes.json()

            if (overviewData.success) setOverview(overviewData.data)
            if (chartsDataParsed.success) setChartsData(chartsDataParsed.data)
            if (demographicsData.success) {
                setBookingStatus(demographicsData.data.statusData)
                setCategoryData(demographicsData.data.categoryData)
            }
            if (leadersData.success) setTopPerformers(leadersData.data)

        } catch (error) {
            console.error('Error fetching analytics:', error)
            showError(isAr ? 'فشل تحميل البيانات' : 'Failed to load analytics')
        } finally {
            setLoading(false)
        }
    }, [isAr, period, showError])

    useEffect(() => {
        fetchAnalytics()
    }, [fetchAnalytics])

    // ═══════════════════════════════════════════════════════════════
    // 🛠️ Helper Functions
    // ═══════════════════════════════════════════════════════════════
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount || 0)
    }

    const formatDate = (dateStr) => {
        if (!dateStr) return ''
        const options = period === '12months'
            ? { month: 'short', year: 'numeric' }
            : { day: 'numeric', month: 'short' }
        return new Date(dateStr).toLocaleDateString(isAr ? 'ar' : 'en', options)
    }

    // ═══════════════════════════════════════════════════════════════
    // 🧩 Sub-Components
    // ═══════════════════════════════════════════════════════════════

    // KPI Card Component
    const KPICard = ({ title, value, growth, icon: Icon, color, prefix = '' }) => {
        const safeGrowth = Number.isFinite(growth) ? growth : 0
        const isPositive = safeGrowth >= 0
        const colorClasses = {
            green: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
            blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
            purple: 'bg-purple-50 text-purple-600 dark:bg-purple-900/20 dark:text-purple-400',
            orange: 'bg-orange-50 text-orange-600 dark:bg-orange-900/20 dark:text-orange-400'
        }

        return (
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow"
            >
                <div className="flex justify-between items-start mb-4">
                    <div className={`p-3 rounded-xl ${colorClasses[color]}`}>
                        <Icon size={24} strokeWidth={2} />
                    </div>
                    <div className={`flex items-center gap-1 text-sm font-medium ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
                        {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
                        <span>{Math.abs(safeGrowth).toFixed(1)}%</span>
                    </div>
                </div>
                <div>
                    <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium mb-1">{title}</h3>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{prefix}{typeof value === 'number' ? value.toLocaleString() : value}</p>
                </div>
            </motion.div>
        )
    }

    if (loading && !overview) {
        return (
            <AdminLayout title={isAr ? 'لوحة التحليلات' : 'Analytics Dashboard'}>
                <div className="h-[80vh] flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mb-4"></div>
                    <p className="text-gray-500 animate-pulse">{isAr ? 'جاري تحليل البيانات...' : 'Crunching numbers...'}</p>
                </div>
            </AdminLayout>
        )
    }

    return (
        <AdminLayout title={isAr ? 'لوحة التحليلات' : 'Analytics Dashboard'}>

            {/* ═══════════════════════════════════════════════════════════════
            HEADER & CONTROLS
            ═══════════════════════════════════════════════════════════════ */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {isAr ? 'نظرة عامة على الأداء' : 'Performance Overview'}
                    </h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
                        {isAr ? 'تتبع نمو عملك ومقاييس الأداء الرئيسية' : 'Track your business growth and key performance metrics'}
                    </p>
                </div>

                <div className="flex items-center gap-3 bg-white dark:bg-gray-800 p-1.5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm">
                    {['7days', '30days', '90days', '12months'].map((p) => (
                        <button
                            key={p}
                            onClick={() => setPeriod(p)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${period === p
                                    ? 'bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-sm'
                                    : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                        >
                            {isAr ? (
                                p === '7days' ? 'أسبوع' : p === '30days' ? 'شهر' : p === '90days' ? '3 أشهر' : 'سنة'
                            ) : (
                                p === '7days' ? '7 Days' : p === '30days' ? '30 Days' : p === '90days' ? '90 Days' : '1 Year'
                            )}
                        </button>
                    ))}
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
            KPI CARDS SECTION
            ═══════════════════════════════════════════════════════════════ */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <KPICard
                    title={isAr ? 'إجمالي الإيرادات' : 'Total Revenue'}
                    value={overview?.overview?.revenue?.value}
                    prefix="$"
                    growth={overview?.overview?.revenue?.growth}
                    icon={DollarSign}
                    color="green"
                />
                <KPICard
                    title={isAr ? 'الحجوزات الجديدة' : 'New Bookings'}
                    value={overview?.overview?.bookings?.value}
                    growth={overview?.overview?.bookings?.growth}
                    icon={Calendar}
                    color="blue"
                />
                <KPICard
                    title={isAr ? 'المستخدمين الجدد' : 'New Users'}
                    value={overview?.overview?.users?.value}
                    growth={overview?.overview?.users?.growth}
                    icon={Users}
                    color="purple"
                />
                <KPICard
                    title={isAr ? 'الرحلات النشطة' : 'Active Tours'}
                    value={overview?.overview?.activeTours}
                    growth={0} // Constant usually
                    icon={MapPin}
                    color="orange"
                />
            </div>

            {/* ═══════════════════════════════════════════════════════════════
            MAIN CHARTS (Revenue & Bookings Trend)
            ═══════════════════════════════════════════════════════════════ */}
            <div className="grid lg:grid-cols-3 gap-6 mb-8">
                {/* Main Trend Chart */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
                >
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white flex items-center gap-2">
                            <Activity size={20} className="text-emerald-500" />
                            {isAr ? 'تحليل الإيرادات والحجوزات' : 'Revenue & Booking Analysis'}
                        </h3>
                    </div>

                    <div className="h-[350px] w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartsData || []}>
                                <defs>
                                    <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={COLORS.primary} stopOpacity={0.1} />
                                        <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="colorBookings" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor={COLORS.secondary} stopOpacity={0.1} />
                                        <stop offset="95%" stopColor={COLORS.secondary} stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#374151" opacity={0.1} />
                                <XAxis
                                    dataKey="date"
                                    tickFormatter={formatDate}
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                                    dy={10}
                                />
                                <YAxis
                                    yAxisId="left"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                                    tickFormatter={(val) => `$${val / 1000}k`}
                                />
                                <YAxis
                                    yAxisId="right"
                                    orientation="right"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#9ca3af', fontSize: 12 }}
                                />
                                <Tooltip
                                    contentStyle={{
                                        backgroundColor: '#1f2937',
                                        border: 'none',
                                        borderRadius: '12px',
                                        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                                        color: '#fff'
                                    }}
                                    itemStyle={{ color: '#fff' }}
                                    labelFormatter={formatDate}
                                    formatter={(value, name) => [
                                        name === 'revenue' ? formatCurrency(value) : value,
                                        name === 'revenue' ? (isAr ? 'الإيرادات' : 'Revenue') : (isAr ? 'الحجوزات' : 'Bookings')
                                    ]}
                                />
                                <Legend iconType="circle" />
                                <Area
                                    yAxisId="left"
                                    type="monotone"
                                    dataKey="revenue"
                                    stroke={COLORS.primary}
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorRevenue)"
                                    name="Revenue"
                                />
                                <Area
                                    yAxisId="right"
                                    type="monotone"
                                    dataKey="bookings"
                                    stroke={COLORS.secondary}
                                    strokeWidth={3}
                                    fillOpacity={1}
                                    fill="url(#colorBookings)"
                                    name="Bookings"
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </motion.div>

                {/* Status Breakdown (Donut) */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col"
                >
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-6">
                        {isAr ? 'توزيع الحجوزات' : 'Booking Status'}
                    </h3>
                    <div className="flex-1 min-h-[250px] relative">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={bookingStatus || []}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {(bookingStatus || []).map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" />
                            </PieChart>
                        </ResponsiveContainer>
                        {/* Center Text */}
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <div className="text-center">
                                <span className="block text-2xl font-bold text-gray-900 dark:text-white">
                                    {bookingStatus?.reduce((acc, curr) => acc + curr.value, 0) || 0}
                                </span>
                                <span className="text-xs text-gray-500 uppercase tracking-wider">Total</span>
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
            SECONDARY METRICS & FEEDS
            ═══════════════════════════════════════════════════════════════ */}
            <div className="grid lg:grid-cols-3 gap-6">

                {/* 🏆 Top Tours Leaderboard */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
                >
                    <div className="flex justify-between items-end mb-6">
                        <h3 className="font-bold text-lg text-gray-900 dark:text-white">
                            {isAr ? 'أفضل الرحلات' : 'Top Performing Tours'}
                        </h3>
                    </div>
                    <div className="space-y-4">
                        {topPerformers?.topTours?.map((tour, idx) => (
                            <div key={tour.id} className="flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 rounded-xl transition-colors group">
                                <div className="font-bold text-gray-300 group-hover:text-emerald-500 w-6">#{idx + 1}</div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-gray-900 dark:text-white truncate">
                                        {isAr ? tour.titleAr : tour.title}
                                    </h4>
                                    <div className="flex items-center gap-2 text-xs text-gray-500">
                                        <span className="flex items-center gap-1 text-yellow-500">
                                            <Star size={10} fill="currentColor" /> {tour.rating?.toFixed(1)}
                                        </span>
                                        <span>•</span>
                                        <span>{tour.bookingsCount} {isAr ? 'حجز' : 'Bookings'}</span>
                                    </div>
                                </div>
                                <div className="font-semibold text-gray-900 dark:text-white">
                                    {formatCurrency(tour.price)}
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* ⚡ Recent Activity Feed */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
                >
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-6">
                        {isAr ? 'النشاط الأخير' : 'Recent Activity'}
                    </h3>
                    <div className="relative pl-6 border-l-2 border-gray-100 dark:border-gray-700 space-y-6">
                        {overview?.recentActivity?.map((act, idx) => (
                            <div key={idx} className="relative">
                                {/* Timeline Dot */}
                                <div className={`absolute -left-[31px] w-4 h-4 rounded-full border-2 border-white dark:border-gray-800 ${act.type === 'booking' ? 'bg-blue-500' :
                                        act.type === 'user' ? 'bg-purple-500' : 'bg-orange-500'
                                    }`}></div>

                                <div className="flex flex-col">
                                    <span className="text-xs text-gray-400 mb-1 flex items-center gap-1">
                                        <Clock size={12} />
                                        {new Date(act.date).toLocaleTimeString(isAr ? 'ar' : 'en', { hour: '2-digit', minute: '2-digit' })}
                                    </span>
                                    <p className="text-sm text-gray-900 dark:text-gray-200">
                                        <span className="font-semibold">
                                            {act.data.user?.name || (isAr ? 'مستخدم' : 'User')}
                                        </span>
                                        {' '}
                                        {act.type === 'booking' && (isAr ? 'قام بحجز رحلة جديدة' : 'booked a new tour')}
                                        {act.type === 'user' && (isAr ? 'انضم للمنصة' : 'joined the platform')}
                                        {act.type === 'review' && (isAr ? 'أضاف تقييماً جديداً' : 'left a new review')}
                                    </p>
                                    {act.type === 'booking' && (
                                        <span className="text-xs font-medium text-emerald-600 mt-1 block">
                                            {formatCurrency(act.data.totalPrice)}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

                {/* 💎 Top Customers */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700"
                >
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-6">
                        {isAr ? 'أهم العملاء' : 'Top Users'}
                    </h3>
                    <div className="space-y-4">
                        {topPerformers?.topCustomers?.map((customer, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center text-lg">
                                    {customer.user?.avatar ? (
                                        <div className="relative w-full h-full rounded-full overflow-hidden">
                                            <Image
                                                src={customer.user.avatar}
                                                alt={customer.user?.name || 'User'}
                                                fill
                                                className="object-cover"
                                                sizes="40px"
                                                unoptimized
                                            />
                                        </div>
                                    ) : (
                                        <span>👤</span>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-medium text-sm text-gray-900 dark:text-white">
                                        {customer.user?.name || 'Unknown'}
                                    </h4>
                                    <p className="text-xs text-gray-500">
                                        {customer._count.userId} {isAr ? 'حجوزات' : 'Bookings'}
                                    </p>
                                </div>
                                <div className="text-sm font-bold text-gray-900 dark:text-white">
                                    {formatCurrency(customer._sum.totalPrice)}
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>

            </div>
        </AdminLayout>
    )
}
