'use client'

// ═══════════════════════════════════════════════════════════════
// 👥 USERS MANAGEMENT - Ultra Professional & Modern
// إدارة المستخدمين - تصميم احترافي وعصري جداً
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect, useMemo, useCallback } from 'react'
import Image from 'next/image'
import { useApp } from '@/contexts/AppContext'
import AdminLayout from '@/components/admin/AdminLayout'
import { useToast } from '@/components/admin/Toast'
import ImageUploader from '@/components/admin/ImageUploader'
import { BulkActionsBar, useBulkSelection, BulkCheckbox, BulkActionPresets } from '@/components/admin/BulkActions'
import { exportData, EXPORT_FORMATS } from '@/components/admin/ExportImport'
import { motion, AnimatePresence } from 'framer-motion'

export default function UsersManagement() {
  const { locale } = useApp()
  const { success, error: showError, info } = useToast()
  const isAr = locale === 'ar'

  // -- State --
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showDetailDrawer, setShowDetailDrawer] = useState(false) // For quick view
  const [modalMode, setModalMode] = useState('create')
  const [selectedUser, setSelectedUser] = useState(null)
  const [saving, setSaving] = useState(false)
  const [updating, setUpdating] = useState(null) // ID of user being updated (inline)
  const [showExportMenu, setShowExportMenu] = useState(false)

  // Filters & Pagination
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState(null)

  // Stats
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    admins: 0,
    users: 0,
    newThisWeek: 0 // Mocked for now or added if API supports
  })

  // Bulk Selection
  const {
    selectedIds,
    selectedCount,
    isSelectAll,
    toggleItem,
    toggleAll,
    clearSelection,
    isSelected
  } = useBulkSelection(users)

  // Form Data
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'USER',
    avatar: '',
    isActive: true
  })

  // Constants
  const roles = [
    { value: 'SUPER_ADMIN', label: { ar: 'مدير عام', en: 'Super Admin' }, color: 'purple', icon: '👑', description: { ar: 'صلاحيات كاملة', en: 'Full Access' } },
    { value: 'ADMIN', label: { ar: 'مدير', en: 'Admin' }, color: 'blue', icon: '⚡', description: { ar: 'صلاحيات إدارية', en: 'Administrative Access' } },
    { value: 'USER', label: { ar: 'مستخدم', en: 'User' }, color: 'gray', icon: '👤', description: { ar: 'صلاحيات محدودة', en: 'Limited Access' } }
  ]

  // -- Effects --
  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 20,
        ...(searchTerm && { search: searchTerm }),
        ...(roleFilter !== 'all' && { role: roleFilter }),
        ...(statusFilter !== 'all' && { isActive: statusFilter === 'true' })
      })

      const response = await fetch(`/api/admin/users?${params}`)
      const result = await response.json()

      if (result.success) {
        setUsers(result.data.users)
        setPagination(result.data.pagination)

        // Calculate dynamic stats from the current page (or better, from API if available globally)
        // For now, using logic similar to previous implementation but enhanced visually
        const total = result.data.pagination.total
        const activeCount = result.data.users.filter(u => u.isActive).length
        const inactiveCount = result.data.users.filter(u => !u.isActive).length
        const adminsCount = result.data.users.filter(u => ['ADMIN', 'SUPER_ADMIN'].includes(u.role)).length
        const usersCount = result.data.users.filter(u => u.role === 'USER').length
        setStats(prev => ({
          ...prev,
          total,
          active: activeCount,
          inactive: inactiveCount,
          admins: adminsCount,
          users: usersCount
        }))
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
      showError(isAr ? 'فشل في جلب البيانات' : 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }, [currentPage, isAr, roleFilter, searchTerm, showError, statusFilter])

  useEffect(() => {
    fetchUsers()
  }, [fetchUsers])

  const handleCreate = () => {
    setModalMode('create')
    setSelectedUser(null)
    setFormData({
      name: '',
      email: '',
      password: '',
      phone: '',
      role: 'USER',
      avatar: '',
      isActive: true
    })
    setShowModal(true)
  }

  const handleEdit = (user) => {
    setModalMode('edit')
    setSelectedUser(user)
    setFormData({
      name: user.name,
      email: user.email,
      password: '', // Password is not filled for security
      phone: user.phone || '',
      role: user.role,
      avatar: user.avatar || '',
      isActive: user.isActive
    })
    setShowModal(true)
  }

  const handleQuickView = (user) => {
    setSelectedUser(user)
    setShowDetailDrawer(true)
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)

    try {
      const url = '/api/admin/users'
      const method = modalMode === 'create' ? 'POST' : 'PUT'
      const body = {
        ...formData,
        ...(modalMode === 'edit' && { id: selectedUser.id }),
        ...(modalMode === 'edit' && !formData.password && { password: undefined })
      }

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      })

      const result = await response.json()

      if (result.success) {
        setShowModal(false)
        fetchUsers()
        success(
          modalMode === 'create'
            ? (isAr ? 'تم إنشاء المستخدم بنجاح! 🎉' : 'User created successfully! 🎉')
            : (isAr ? 'تم تحديث المستخدم بنجاح! ✨' : 'User updated successfully! ✨')
        )
      } else {
        showError(result.error || (isAr ? 'فشلت العملية' : 'Operation failed'))
      }
    } catch (error) {
      console.error('Failed to save user:', error)
      showError(isAr ? 'فشل في حفظ البيانات' : 'Failed to save data')
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateRole = async (userId, newRole) => {
    setUpdating(userId)
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, role: newRole })
      })

      const result = await response.json()
      if (result.success) {
        fetchUsers()
        success(isAr ? 'تم تحديث الدور بنجاح! 🎭' : 'Role updated successfully! 🎭')
      }
    } catch (error) {
      showError(isAr ? 'فشل في التحديث' : 'Failed to update')
    } finally {
      setUpdating(null)
    }
  }

  const handleToggleActive = async (userId, currentStatus) => {
    // Only toggling specific user
    setUpdating(userId)
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: userId, isActive: !currentStatus })
      })

      const result = await response.json()
      if (result.success) {
        fetchUsers()
        success(
          !currentStatus
            ? (isAr ? 'تم تفعيل الحساب! ✅' : 'Account activated! ✅')
            : (isAr ? 'تم تعطيل الحساب' : 'Account deactivated')
        )
      }
    } catch (error) {
      showError(isAr ? 'فشل في التحديث' : 'Failed to update')
    } finally {
      setUpdating(null)
    }
  }

  // -- Bulk Actions Handlers --
  const handleBulkActivate = async () => {
    if (!confirm(isAr ? 'هل أنت متأكد من تفعيل المستخدمين المحددين؟' : 'Are you sure you want to activate selected users?')) return

    // Implement bulk API call or loop
    // For now, looping to reuse existing API (efficient enough for small batches, but ideally bulk endpoint)
    let successCount = 0
    for (const id of selectedIds) {
      try {
        await fetch('/api/admin/users', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, isActive: true })
        })
        successCount++
      } catch (e) { console.error(e) }
    }
    fetchUsers()
    clearSelection()
    success(isAr ? `تم تفعيل ${successCount} مستخدم` : `Activated ${successCount} users`)
  }

  const handleBulkDeactivate = async () => {
    if (!confirm(isAr ? 'هل أنت متأكد من تعطيل المستخدمين المحددين؟' : 'Are you sure you want to deactivate selected users?')) return

    let successCount = 0
    for (const id of selectedIds) {
      try {
        await fetch('/api/admin/users', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id, isActive: false })
        })
        successCount++
      } catch (e) { console.error(e) }
    }
    fetchUsers()
    clearSelection()
    success(isAr ? `تم تعطيل ${successCount} مستخدم` : `Deactivated ${successCount} users`)
  }

  const formatDate = useCallback((value, options) => {
    if (!value) return isAr ? 'غير متوفر' : 'N/A'
    const date = new Date(value)
    if (Number.isNaN(date.getTime())) return isAr ? 'غير متوفر' : 'N/A'
    return date.toLocaleDateString(isAr ? 'ar' : 'en-US', options)
  }, [isAr])

  const exportRows = useMemo(() => {
    return users.map((user) => ({
      [isAr ? 'المعرف' : 'ID']: user.id,
      [isAr ? 'الاسم' : 'Name']: user.name,
      [isAr ? 'البريد الإلكتروني' : 'Email']: user.email,
      [isAr ? 'الدور' : 'Role']: user.role,
      [isAr ? 'الحالة' : 'Status']: user.isActive ? (isAr ? 'نشط' : 'Active') : (isAr ? 'معطل' : 'Inactive'),
      [isAr ? 'الهاتف' : 'Phone']: user.phone || (isAr ? 'غير متوفر' : 'N/A'),
      [isAr ? 'تاريخ الانضمام' : 'Joined At']: formatDate(user.createdAt)
    }))
  }, [users, isAr, formatDate])

  const handleExport = (format) => {
    exportData(exportRows, format, `users_export_${new Date().toISOString().slice(0, 10)}`)
    success(isAr ? 'تم تصدير البيانات بنجاح' : 'Data exported successfully')
  }

  // -- Render Helpers --
  const getRoleBadge = (role) => {
    const roleObj = roles.find(r => r.value === role) || roles[2]
    const colors = {
      purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800',
      blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
      gray: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600'
    }

    // Glowing effect for Super Admin
    const glow = role === 'SUPER_ADMIN' ? 'shadow-[0_0_10px_rgba(168,85,247,0.4)]' : ''

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 w-fit ${colors[roleObj.color]} ${glow}`}>
        <span>{roleObj.icon}</span>
        <span>{roleObj.label[locale]}</span>
      </span>
    )
  }

  return (
    <AdminLayout>
      <div className="space-y-8 pb-20">

        {/* 🌟 Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-2">
              {isAr ? '👥 إدارة المستخدمين' : '👥 Users Management'}
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 font-medium">
              {isAr ? 'نظرة شاملة وتحكم كامل في قاعدة المستخدمين' : 'Comprehensive overview and control of your user base'}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex gap-3"
          >
            <div className="relative">
              <button
                onClick={() => setShowExportMenu((prev) => !prev)}
                disabled={users.length === 0}
                className="px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl text-gray-700 dark:text-gray-300 font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <span>📊</span>
                <span className="hidden sm:inline">{isAr ? 'تصدير' : 'Export'}</span>
              </button>
              <AnimatePresence>
                {showExportMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className={`absolute ${isAr ? 'right-0' : 'left-0'} mt-2 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-xl overflow-hidden z-20`}
                  >
                    {EXPORT_FORMATS.map((format) => (
                      <button
                        key={format.value}
                        onClick={() => { handleExport(format.value); setShowExportMenu(false) }}
                        className="w-full px-4 py-3 text-sm font-bold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 flex items-center gap-2"
                      >
                        <span>{format.icon}</span>
                        <span>{format.label}</span>
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreate}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-lg hover:shadow-blue-500/30 transition-all flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>{isAr ? 'مستخدم جديد' : 'New User'}</span>
            </motion.button>
          </motion.div>
        </div>

        {/* 📊 Modern Stats Cards (Mocked Data or Real if available) */}
        {/* In a real app, these would come from an aggregation endpoint */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: isAr ? 'إجمالي المستخدمين' : 'Total Users', value: stats.total, icon: '👥', color: 'from-blue-500 to-cyan-500' },
            { label: isAr ? 'نشطين حالياً' : 'Active Users', value: stats.active || '—', icon: '✅', color: 'from-green-500 to-emerald-500' },
            { label: isAr ? 'المسؤولين' : 'Administrators', value: stats.admins || '—', icon: '🛡️', color: 'from-purple-500 to-violet-500' },
            // { label: isAr ? 'جديد هذا الأسبوع' : 'New this Week', value: '+12', icon: '📈', color: 'from-orange-500 to-red-500' }
          ].map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`relative overflow-hidden rounded-2xl p-6 text-white shadow-lg bg-gradient-to-br ${stat.color}`}
            >
              <div className="relative z-10">
                <div className="flex justify-between items-start mb-4">
                  <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                    <span className="text-2xl">{stat.icon}</span>
                  </div>
                  {/* Sparkline or trend could go here */}
                </div>
                <h3 className="text-3xl font-black mb-1">{stat.value}</h3>
                <p className="text-white/80 font-medium text-sm border-t border-white/20 pt-2 mt-2 inline-block w-full">
                  {stat.label}
                </p>
              </div>
              {/* Decorative Circles */}
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
              <div className="absolute top-0 right-0 w-20 h-20 bg-black/5 rounded-full blur-xl" />
            </motion.div>
          ))}
        </div>

        {/* 🔍 Universal Search & Filter Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-xl border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-4 items-center"
        >
          {/* Search */}
          <div className="relative flex-1 w-full">
            <input
              type="search"
              placeholder={isAr ? '🔍 بحث بالاسم، البريد...' : '🔍 Search name, email...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-5 py-3 pl-12 bg-gray-50 dark:bg-gray-900/50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 transition-all text-gray-900 dark:text-white"
            />
            <svg className={`absolute ${isAr ? 'right-4' : 'left-4'} top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>

          {/* Filters */}
          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-700 dark:text-gray-300 cursor-pointer min-w-[140px]"
            >
              <option value="all">{isAr ? 'جميع الأدوار' : 'All Roles'}</option>
              {roles.map(role => (
                <option key={role.value} value={role.value}>{role.label[locale]}</option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl border-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-700 dark:text-gray-300 cursor-pointer min-w-[120px]"
            >
              <option value="all">{isAr ? 'الكل' : 'All Status'}</option>
              <option value="true">✅ {isAr ? 'نشط' : 'Active'}</option>
              <option value="false">❌ {isAr ? 'معطل' : 'Inactive'}</option>
            </select>
          </div>
        </motion.div>

        {/* 📋 Data Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden border border-gray-100 dark:border-gray-700 relative"
        >
          {loading && (
            <div className="absolute inset-0 bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm z-10 flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700/50 border-b border-gray-100 dark:border-gray-700">
                <tr>
                  <th className="px-6 py-4 w-10">
                    <BulkCheckbox
                      checked={isSelectAll}
                      onChange={toggleAll}
                      indeterminate={selectedCount > 0 && !isSelectAll}
                    />
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {isAr ? 'المستخدم' : 'User'}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {isAr ? 'الدور' : 'Role'}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {isAr ? 'الحالة' : 'Status'}
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    {isAr ? 'معلومات الاتصال' : 'Contact'}
                  </th>
                  <th className="px-6 py-4 text-right text-xs font-bold text-gray-500 uppercase tracking-wider">
                    {isAr ? 'إجراءات' : 'Actions'}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                {users.map((user, index) => (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`group hover:bg-blue-50/50 dark:hover:bg-blue-900/10 transition-colors
                                   ${isSelected(user.id) ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                                `}
                  >
                    <td className="px-6 py-4">
                      <BulkCheckbox
                        checked={isSelected(user.id)}
                        onChange={() => toggleItem(user.id)}
                      />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white dark:border-gray-600 shadow-sm bg-gray-100 flex-shrink-0">
                            {user.avatar ? (
                              <Image src={user.avatar} alt={user.name} fill className="object-cover" sizes="48px" />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold text-lg">
                                {user.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          {/* Online Indicator (Mocked) */}
                          <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                        </div>
                        <div>
                          <div className="font-bold text-gray-900 dark:text-white text-base hover:text-blue-600 cursor-pointer" onClick={() => handleQuickView(user)}>
                            {user.name}
                          </div>
                          <div className="text-sm text-gray-500 dark:text-gray-400">
                            {`${isAr ? 'انضم في ' : 'Joined '}${formatDate(user.createdAt)}`}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getRoleBadge(user.role)}
                        {/* Role Editor Trigger */}
                        <button
                          onClick={() => handleEdit(user)}
                          className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-all text-xs text-gray-500"
                        >
                          ✏️
                        </button>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggleActive(user.id, user.isActive)}
                        disabled={updating === user.id}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                                            ${user.isActive ? 'bg-green-500' : 'bg-gray-200 dark:bg-gray-700'}
                                        `}
                      >
                        <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                                              ${user.isActive ? 'translate-x-[22px] rtl:-translate-x-[22px]' : 'translate-x-1'}
                                         `} />
                      </button>
                      {updating === user.id && <span className="text-xs text-gray-400 ml-2 animate-pulse">{isAr ? 'جارٍ التحديث...' : 'Updating...'}</span>}
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="flex flex-col gap-1 text-sm">
                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                          <span className="opacity-70">📧</span> {user.email}
                        </div>
                        {user.phone && (
                          <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                            <span className="opacity-70">📱</span> {user.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleQuickView(user)}
                          className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all"
                          title={isAr ? 'عرض سريع' : 'Quick View'}
                        >
                          👁️
                        </button>
                        <button
                          onClick={() => handleEdit(user)}
                          className="p-2 text-gray-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-all"
                          title={isAr ? 'تعديل' : 'Edit'}
                        >
                          ✏️
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}

                {!loading && users.length === 0 && (
                  <tr>
                    <td colSpan="6" className="py-20 text-center text-gray-500 dark:text-gray-400">
                      <div className="flex flex-col items-center gap-4">
                        <span className="text-4xl opacity-50">🔍</span>
                        <p className="text-lg font-semibold">{isAr ? 'لم يتم العثور على نتائج' : 'No users found matching your filters'}</p>
                        <button onClick={() => { setSearchTerm(''); setRoleFilter('all'); setStatusFilter('all'); setCurrentPage(1) }} className="text-blue-600 hover:underline">
                          {isAr ? 'إعادة ضبط الفلاتر' : 'Reset Filters'}
                        </button>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination Footer */}
          {pagination && pagination.totalPages > 1 && (
            <div className="bg-gray-50 dark:bg-gray-900/50 p-4 border-t border-gray-100 dark:border-gray-700 flex justify-center">
              <nav className="flex items-center gap-2">
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg border border-gray-200 dark:border-gray-600 disabled:opacity-50 hover:bg-white dark:hover:bg-gray-800 transition-all"
                >
                  ◀
                </button>
                <span className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-600 text-sm font-semibold">
                  {isAr ? `الصفحة ${currentPage} من ${pagination.totalPages}` : `Page ${currentPage} of ${pagination.totalPages}`}
                </span>
                <button
                  onClick={() => setCurrentPage(p => Math.min(pagination.totalPages, p + 1))}
                  disabled={currentPage === pagination.totalPages}
                  className="p-2 rounded-lg border border-gray-200 dark:border-gray-600 disabled:opacity-50 hover:bg-white dark:hover:bg-gray-800 transition-all"
                >
                  ▶
                </button>
              </nav>
            </div>
          )}
        </motion.div>

        {/* 🚀 Bulk Actions Bar */}
        <BulkActionsBar
          selectedCount={selectedCount}
          onClear={clearSelection}
          isAr={isAr}
          actions={[
            {
              label: isAr ? 'تفعيل' : 'Activate',
              icon: '✅',
              onClick: handleBulkActivate,
              variant: 'success'
            },
            {
              label: isAr ? 'تعطيل' : 'Deactivate',
              icon: '⛔',
              onClick: handleBulkDeactivate,
              variant: 'danger'
            }
          ]}
        />

        {/* 📝 Create/Edit Modal */}
        <AnimatePresence>
          {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setShowModal(false)}
              />
              <motion.div
                initial={{ scale: 0.95, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.95, y: 20 }}
                className="relative bg-white dark:bg-gray-800 rounded-3xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
              >
                {/* Modal Header */}
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 flex items-center justify-between flex-shrink-0">
                  <h2 className="text-2xl font-black text-white flex items-center gap-2">
                    {modalMode === 'create' ? '✨ ' + (isAr ? 'مستخدم جديد' : 'New User') : '✏️ ' + (isAr ? 'تعديل المستخدم' : 'Edit User')}
                  </h2>
                  <button onClick={() => setShowModal(false)} className="text-white/80 hover:text-white hover:rotate-90 transition-all">
                    <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>

                {/* Modal Body */}
                <div className="p-8 overflow-y-auto custom-scrollbar">
                  <form id="userForm" onSubmit={handleSave} className="space-y-6">
                    {/* Flex Container for Avatar + Info */}
                    <div className="flex flex-col md:flex-row gap-8">
                      {/* Left: Avatar */}
                      <div className="w-full md:w-1/3">
                        <label className="block text-sm font-bold text-gray-700 dark:text-white mb-2">{isAr ? 'الصورة الشخصية' : 'Profile Picture'}</label>
                        <ImageUploader
                          value={formData.avatar}
                          onChange={(url) => setFormData(prev => ({ ...prev, avatar: url }))}
                          label=""
                          className="w-full"
                        />
                      </div>

                      {/* Right: Info */}
                      <div className="w-full md:w-2/3 space-y-4">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 dark:text-white mb-1">{isAr ? 'الاسم الكامل' : 'Full Name'} *</label>
                          <input
                            required
                            value={formData.name}
                            onChange={e => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 dark:text-white mb-1">{isAr ? 'البريد الإلكتروني' : 'Email'} *</label>
                          <input
                            required type="email"
                            value={formData.email}
                            onChange={e => setFormData({ ...formData, email: e.target.value })}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 dark:text-white mb-1">{isAr ? 'كلمة المرور' : 'Password'} {modalMode === 'create' && '*'}</label>
                          <input
                            type="password"
                            required={modalMode === 'create'}
                            value={formData.password}
                            onChange={e => setFormData({ ...formData, password: e.target.value })}
                            placeholder={modalMode === 'edit' ? (isAr ? 'اتركه فارغاً للتجاهل' : 'Leave empty to keep current') : ''}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Divider */}
                    <hr className="border-gray-100 dark:border-gray-700" />

                    {/* Secondary Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-white mb-1">{isAr ? 'رقم الهاتف' : 'Phone Number'}</label>
                        <input
                          value={formData.phone}
                          onChange={e => setFormData({ ...formData, phone: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-bold text-gray-700 dark:text-white mb-1">{isAr ? 'الدور الوظيفي' : 'Role'} *</label>
                        <select
                          required
                          value={formData.role}
                          onChange={e => setFormData({ ...formData, role: e.target.value })}
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500"
                        >
                          {roles.map(r => (
                            <option key={r.value} value={r.value}>{r.label[locale]}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Active Toggle */}
                    <div className="flex items-center gap-3 p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
                      <button
                        type="button"
                        onClick={() => setFormData(p => ({ ...p, isActive: !p.isActive }))}
                        className={`w-12 h-7 rounded-full transition-colors relative ${formData.isActive ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}
                      >
                        <div className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all ${formData.isActive ? 'left-[26px]' : 'left-1'}`} />
                      </button>
                      <span className="font-bold text-gray-700 dark:text-gray-300">
                        {formData.isActive ? (isAr ? 'الحساب نشط ويستطيع الدخول' : 'Account is active and can login') : (isAr ? 'الحساب معطل ممنوع من الدخول' : 'Account is disabled')}
                      </span>
                    </div>

                  </form>
                </div>

                {/* Modal Footer */}
                <div className="p-6 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50 flex justify-end gap-3 flex-shrink-0">
                  <button
                    onClick={() => setShowModal(false)}
                    className="px-6 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all"
                  >
                    {isAr ? 'إلغاء' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    form="userForm"
                    disabled={saving}
                    className="px-8 py-3 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 hover:shadow-lg hover:shadow-blue-500/30 transition-all disabled:opacity-50"
                  >
                    {saving ? (isAr ? 'جاري الحفظ...' : 'Saving...') : (isAr ? 'حفظ البيانات' : 'Save Changes')}
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* 👁️ Quick View Drawer */}
        <AnimatePresence>
          {showDetailDrawer && selectedUser && (
            <>
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50"
                onClick={() => setShowDetailDrawer(false)}
              />
              <motion.div
                initial={{ x: isAr ? -400 : 400 }}
                animate={{ x: 0 }}
                exit={{ x: isAr ? -400 : 400 }}
                className={`fixed top-0 ${isAr ? 'left-0' : 'right-0'} h-full w-full max-w-md bg-white dark:bg-gray-800 shadow-2xl z-50 overflow-y-auto`}
              >
                <div className="relative h-40 bg-gradient-to-br from-blue-600 to-purple-800">
                  <button onClick={() => setShowDetailDrawer(false)} className="absolute top-4 right-4 p-2 bg-black/20 text-white rounded-full hover:bg-black/40 transition-all">
                    ✕
                  </button>
                </div>
                <div className="px-8 pb-8 -mt-16">
                  <div className="relative w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden shadow-lg mx-auto bg-gray-200">
                    {selectedUser.avatar ? (
                      <Image src={selectedUser.avatar} alt={selectedUser.name} fill className="object-cover" sizes="128px" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 text-6xl">
                        {selectedUser.name.charAt(0)}
                      </div>
                    )}
                  </div>

                  <div className="text-center mt-4">
                    <h3 className="text-2xl font-black text-gray-900 dark:text-white">{selectedUser.name}</h3>
                    <p className="text-gray-500">{selectedUser.email}</p>
                    <div className="flex justify-center mt-3 gap-2">
                      {getRoleBadge(selectedUser.role)}
                      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${selectedUser.isActive ? 'bg-green-100 text-green-700 border-green-200' : 'bg-red-100 text-red-700 border-red-200'}`}>
                        {selectedUser.isActive ? (isAr ? 'نشط' : 'Active') : (isAr ? 'معطل' : 'Inactive')}
                      </span>
                    </div>
                  </div>

                  <div className="mt-8 space-y-6">
                    <div className="p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl space-y-3">
                      <h4 className="font-bold text-gray-900 dark:text-white border-b pb-2 border-gray-200 dark:border-gray-600">
                        {isAr ? 'تفاصيل الحساب' : 'Account Details'}
                      </h4>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">{isAr ? 'تاريخ الانضمام' : 'Joined'}</span>
                        <span className="font-medium dark:text-white">{formatDate(selectedUser.createdAt)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">{isAr ? 'آخر دخول' : 'Last Login'}</span>
                        <span className="font-medium dark:text-white">
                          {selectedUser.lastLogin ? formatDate(selectedUser.lastLogin) : (isAr ? 'لم يسجل الدخول' : 'Never')}
                        </span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">{isAr ? 'رقم الهاتف' : 'Phone'}</span>
                        <span className="font-medium dark:text-white">{selectedUser.phone || (isAr ? 'غير متوفر' : 'N/A')}</span>
                      </div>
                    </div>

                    <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/30">
                      <h4 className="font-bold text-blue-900 dark:text-blue-200 mb-2">
                        {isAr ? 'نشاط المستخدم' : 'Activity Summary'}
                      </h4>
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                          <div className="text-2xl font-bold text-blue-600">{selectedUser._count?.bookings || 0}</div>
                          <div className="text-xs text-gray-500">{isAr ? 'حجوزات' : 'Bookings'}</div>
                        </div>
                        <div className="bg-white dark:bg-gray-800 p-3 rounded-lg shadow-sm">
                          <div className="text-2xl font-bold text-purple-600">{selectedUser._count?.reviews || 0}</div>
                          <div className="text-xs text-gray-500">{isAr ? 'تقييمات' : 'Reviews'}</div>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => { setShowDetailDrawer(false); handleEdit(selectedUser); }}
                      className="w-full py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold hover:shadow-lg transition-all"
                    >
                      {isAr ? 'تعديل كامل' : 'Edit Profile'}
                    </button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

      </div>
    </AdminLayout>
  )
}
