'use client'

// ═══════════════════════════════════════════════════════════════
// 👥 USERS MANAGEMENT - Ultra Professional & Modern
// إدارة المستخدمين - تصميم احترافي وعصري جداً
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react'
import { useApp } from '@/contexts/AppContext'
import AdminLayout from '@/components/admin/AdminLayout'
import { useToast } from '@/components/admin/Toast'
import { motion, AnimatePresence } from 'framer-motion'

export default function UsersManagement() {
  const { locale } = useApp()
  const { success, error: showError, info } = useToast()
  const isAr = locale === 'ar'

  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [modalMode, setModalMode] = useState('create')
  const [selectedUser, setSelectedUser] = useState(null)
  const [saving, setSaving] = useState(false)
  const [updating, setUpdating] = useState(null)
  
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [currentPage, setCurrentPage] = useState(1)
  const [pagination, setPagination] = useState(null)
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    inactive: 0,
    admins: 0,
    users: 0
  })

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    role: 'USER',
    avatar: '',
    isActive: true
  })

  const roles = [
    { value: 'SUPER_ADMIN', label: { ar: 'مدير عام', en: 'Super Admin' }, color: 'purple', icon: '👑' },
    { value: 'ADMIN', label: { ar: 'مدير', en: 'Admin' }, color: 'blue', icon: '⚡' },
    { value: 'USER', label: { ar: 'مستخدم', en: 'User' }, color: 'gray', icon: '👤' }
  ]

  useEffect(() => {
    fetchUsers()
  }, [searchTerm, roleFilter, statusFilter, currentPage])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: 20,
        ...(searchTerm && { search: searchTerm }),
        ...(roleFilter !== 'all' && { role: roleFilter }),
        ...(statusFilter !== 'all' && { isActive: statusFilter })
      })

      const response = await fetch(`/api/admin/users?${params}`)
      const result = await response.json()

      if (result.success) {
        setUsers(result.data.users)
        setPagination(result.data.pagination)
        
        // Calculate stats
        const total = result.data.users.length
        const active = result.data.users.filter(u => u.isActive).length
        const inactive = total - active
        const admins = result.data.users.filter(u => u.role === 'SUPER_ADMIN' || u.role === 'ADMIN').length
        const regularUsers = total - admins
        
        setStats({
          total: result.data.pagination.total,
          active,
          inactive,
          admins,
          users: regularUsers
        })
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
      showError(isAr ? 'فشل في جلب البيانات' : 'Failed to fetch data')
    } finally {
      setLoading(false)
    }
  }

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
      password: '',
      phone: user.phone || '',
      role: user.role,
      avatar: user.avatar || '',
      isActive: user.isActive
    })
    setShowModal(true)
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
      console.error('Failed to update role:', error)
      showError(isAr ? 'فشل في التحديث' : 'Failed to update')
    } finally {
      setUpdating(null)
    }
  }

  const handleToggleActive = async (userId, currentStatus) => {
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
      console.error('Failed to toggle status:', error)
      showError(isAr ? 'فشل في التحديث' : 'Failed to update')
    } finally {
      setUpdating(null)
    }
  }

  const getRoleBadge = (role) => {
    const roleObj = roles.find(r => r.value === role)
    if (!roleObj) return null

    const colors = {
      purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 border-purple-200 dark:border-purple-800',
      blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-800',
      gray: 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600'
    }

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold border ${colors[roleObj.color]}`}>
        {roleObj.icon} {roleObj.label[locale]}
      </span>
    )
  }

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-4xl font-black text-gray-900 dark:text-white mb-2">
            {isAr ? '👥 إدارة المستخدمين' : '👥 Users Management'}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            {isAr ? 'إدارة جميع المستخدمين والصلاحيات' : 'Manage all users and permissions'}
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4"
        >
          {/* Total Users */}
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white shadow-xl"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-blue-100 font-semibold">{isAr ? 'الإجمالي' : 'Total'}</span>
              <span className="text-3xl">👥</span>
            </div>
            <div className="text-4xl font-black">{stats.total}</div>
            <div className="text-blue-100 text-sm mt-2">{isAr ? 'مستخدم' : 'Users'}</div>
          </motion.div>

          {/* Active */}
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white shadow-xl"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-green-100 font-semibold">{isAr ? 'نشط' : 'Active'}</span>
              <span className="text-3xl">✅</span>
            </div>
            <div className="text-4xl font-black">{stats.active}</div>
            <div className="text-green-100 text-sm mt-2">{isAr ? 'حساب نشط' : 'Active accounts'}</div>
          </motion.div>

          {/* Inactive */}
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white shadow-xl"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-red-100 font-semibold">{isAr ? 'معطل' : 'Inactive'}</span>
              <span className="text-3xl">❌</span>
            </div>
            <div className="text-4xl font-black">{stats.inactive}</div>
            <div className="text-red-100 text-sm mt-2">{isAr ? 'حساب معطل' : 'Inactive accounts'}</div>
          </motion.div>

          {/* Admins */}
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-purple-100 font-semibold">{isAr ? 'مدراء' : 'Admins'}</span>
              <span className="text-3xl">👑</span>
            </div>
            <div className="text-4xl font-black">{stats.admins}</div>
            <div className="text-purple-100 text-sm mt-2">{isAr ? 'مدير' : 'Administrators'}</div>
          </motion.div>

          {/* Regular Users */}
          <motion.div
            whileHover={{ scale: 1.05, y: -5 }}
            className="bg-gradient-to-br from-gray-500 to-gray-600 rounded-2xl p-6 text-white shadow-xl"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-100 font-semibold">{isAr ? 'مستخدمين' : 'Users'}</span>
              <span className="text-3xl">👤</span>
            </div>
            <div className="text-4xl font-black">{stats.users}</div>
            <div className="text-gray-100 text-sm mt-2">{isAr ? 'مستخدم عادي' : 'Regular users'}</div>
          </motion.div>
        </motion.div>

        {/* Toolbar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="relative">
              <input
                type="search"
                placeholder={isAr ? '🔍 بحث باسم أو بريد...' : '🔍 Search by name or email...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pr-12 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">{isAr ? 'جميع الأدوار' : 'All Roles'}</option>
              {roles.map(role => (
                <option key={role.value} value={role.value}>
                  {role.icon} {role.label[locale]}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">{isAr ? 'الكل' : 'All'}</option>
              <option value="true">✅ {isAr ? 'نشط' : 'Active'}</option>
              <option value="false">❌ {isAr ? 'معطل' : 'Inactive'}</option>
            </select>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreate}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-2xl transition-all flex items-center justify-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span>{isAr ? 'مستخدم جديد' : 'New User'}</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-20">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 rounded-full"
            />
          </div>
        )}

        {/* Users Table */}
        {!loading && users.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden"
          >
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase">
                      {isAr ? 'المستخدم' : 'User'}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase">
                      {isAr ? 'الدور' : 'Role'}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase">
                      {isAr ? 'الحالة' : 'Status'}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase">
                      {isAr ? 'الحجوزات' : 'Bookings'}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase">
                      {isAr ? 'آخر دخول' : 'Last Login'}
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold uppercase">
                      {isAr ? 'الإجراءات' : 'Actions'}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                  {users.map((user, index) => (
                    <motion.tr
                      key={user.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold flex-shrink-0 overflow-hidden">
                            {user.avatar ? (
                              <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                            ) : (
                              user.name?.charAt(0) || 'U'
                            )}
                          </div>
                          <div>
                            <div className="font-semibold text-gray-900 dark:text-white">
                              {user.name}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {user.email}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={user.role}
                          onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                          disabled={updating === user.id}
                          className="px-3 py-1 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm font-semibold text-gray-900 dark:text-white border-0 focus:ring-2 focus:ring-blue-500 cursor-pointer"
                        >
                          {roles.map(role => (
                            <option key={role.value} value={role.value}>
                              {role.icon} {role.label[locale]}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleToggleActive(user.id, user.isActive)}
                          disabled={updating === user.id}
                          className={`px-3 py-1 rounded-full text-xs font-bold border ${
                            user.isActive
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800'
                              : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800'
                          }`}
                        >
                          {user.isActive ? '✅ ' : '❌ '}
                          {user.isActive ? (isAr ? 'نشط' : 'Active') : (isAr ? 'معطل' : 'Inactive')}
                        </motion.button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                            <span className="text-sm font-bold text-blue-700 dark:text-blue-400">
                              {user._count?.bookings || 0}
                            </span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {user.lastLogin 
                            ? new Date(user.lastLogin).toLocaleDateString(locale)
                            : (isAr ? 'لم يسجل دخول' : 'Never')
                          }
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleEdit(user)}
                          className="px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 rounded-lg font-semibold hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-all text-sm"
                        >
                          {isAr ? 'تعديل' : 'Edit'}
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && users.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-12 text-center shadow-xl"
          >
            <div className="text-6xl mb-4">👥</div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {isAr ? 'لا يوجد مستخدمين' : 'No Users Found'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {isAr ? 'ابدأ بإضافة مستخدم جديد' : 'Start by adding a new user'}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleCreate}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-xl transition-all"
            >
              {isAr ? 'إضافة مستخدم' : 'Add User'}
            </motion.button>
          </motion.div>
        )}

        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center gap-2"
          >
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg disabled:opacity-50 shadow-lg"
            >
              ←
            </motion.button>
            <span className="px-4 py-2 text-gray-900 dark:text-white font-semibold">
              {currentPage} / {pagination.totalPages}
            </span>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setCurrentPage(prev => Math.min(pagination.totalPages, prev + 1))}
              disabled={currentPage === pagination.totalPages}
              className="px-4 py-2 bg-white dark:bg-gray-800 rounded-lg disabled:opacity-50 shadow-lg"
            >
              →
            </motion.button>
          </motion.div>
        )}

        {/* Modal - Create/Edit */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
                onClick={(e) => e.stopPropagation()}
                className="bg-white dark:bg-gray-800 rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
              >
                {/* Modal Header */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6 flex items-center justify-between z-10 rounded-t-3xl">
                  <h2 className="text-3xl font-black text-white">
                    {modalMode === 'create' 
                      ? (isAr ? '🎉 مستخدم جديد' : '🎉 New User')
                      : (isAr ? '✏️ تعديل المستخدم' : '✏️ Edit User')
                    }
                  </h2>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setShowModal(false)}
                    className="p-2 hover:bg-white/20 rounded-xl transition-all"
                  >
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </motion.button>
                </div>

                <form onSubmit={handleSave} className="p-8 space-y-6">
                  <div>
                    <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                      {isAr ? 'الاسم الكامل' : 'Full Name'} *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => handleFormChange('name', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                      {isAr ? 'البريد الإلكتروني' : 'Email'} *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleFormChange('email', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                      {isAr ? 'كلمة المرور' : 'Password'} {modalMode === 'create' && '*'}
                    </label>
                    <input
                      type="password"
                      required={modalMode === 'create'}
                      value={formData.password}
                      onChange={(e) => handleFormChange('password', e.target.value)}
                      placeholder={modalMode === 'edit' ? (isAr ? 'اتركه فارغاً للإبقاء على الحالي' : 'Leave blank to keep current') : ''}
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                        {isAr ? 'الهاتف' : 'Phone'}
                      </label>
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleFormChange('phone', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                        {isAr ? 'الدور' : 'Role'} *
                      </label>
                      <select
                        required
                        value={formData.role}
                        onChange={(e) => handleFormChange('role', e.target.value)}
                        className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {roles.map(role => (
                          <option key={role.value} value={role.value}>
                            {role.icon} {role.label[locale]}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-bold text-gray-900 dark:text-white mb-2">
                      {isAr ? 'الصورة الشخصية (URL)' : 'Avatar (URL)'}
                    </label>
                    <input
                      type="url"
                      value={formData.avatar}
                      onChange={(e) => handleFormChange('avatar', e.target.value)}
                      className="w-full px-4 py-3 bg-gray-100 dark:bg-gray-700 rounded-xl text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="flex items-center gap-2 cursor-pointer p-4 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-all">
                      <input
                        type="checkbox"
                        checked={formData.isActive}
                        onChange={(e) => handleFormChange('isActive', e.target.checked)}
                        className="w-5 h-5 rounded"
                      />
                      <span className="text-gray-900 dark:text-white font-semibold">
                        ✅ {isAr ? 'الحساب نشط' : 'Account Active'}
                      </span>
                    </label>
                  </div>

                  <div className="flex gap-4 pt-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-6 py-3 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl font-bold"
                    >
                      {isAr ? 'إلغاء' : 'Cancel'}
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      type="submit"
                      disabled={saving}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:shadow-xl transition-all disabled:opacity-50"
                    >
                      {saving ? (
                        <div className="flex items-center justify-center gap-2">
                          <div className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                          <span>{isAr ? 'جاري الحفظ...' : 'Saving...'}</span>
                        </div>
                      ) : (
                        <span>💾 {isAr ? 'حفظ' : 'Save'}</span>
                      )}
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  )
}
