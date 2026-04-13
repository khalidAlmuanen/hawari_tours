'use client'

// ═══════════════════════════════════════════════════════════════
// 📝 BLOG MANAGEMENT - Ultra Professional & Modern
// إدارة المدونة - تصميم احترافي وعصري جداً
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect, useRef, useCallback } from 'react'
import { useApp } from '@/contexts/AppContext'
import AdminLayout from '@/components/admin/AdminLayout'
import { useToast } from '@/components/admin/Toast'
import { motion, AnimatePresence } from 'framer-motion'
import BlogSettingsModal from './BlogSettingsModal'
import Link from 'next/link'
import Image from 'next/image'

// 🎨 Simplified Rich Text Editor (Clean & Modern)
const RichTextEditor = ({ value, onChange, label, dir = 'ltr' }) => {
    const textareaRef = useRef(null)

    const insertText = (before, after = '') => {
        const textarea = textareaRef.current
        if (!textarea) return

        const start = textarea.selectionStart
        const end = textarea.selectionEnd
        const text = textarea.value
        const newText = text.substring(0, start) + before + text.substring(start, end) + after + text.substring(end)

        onChange({ target: { value: newText } })

        setTimeout(() => {
            textarea.focus()
            textarea.setSelectionRange(start + before.length, end + before.length)
        }, 0)
    }

    return (
        <div className="group border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800 transition-all focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500 shadow-sm hover:shadow-md">
            <div className="flex items-center gap-1 p-2 bg-gray-50/50 dark:bg-gray-900/50 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
                <EditorButton onClick={() => insertText('**', '**')} label="B" title="Bold" />
                <EditorButton onClick={() => insertText('*', '*')} label="I" title="Italic" italic />
                <EditorButton onClick={() => insertText('[', '](url)')} icon="🔗" title="Link" />
                <div className="w-px h-4 bg-gray-300 dark:bg-gray-700 mx-1"></div>
                <EditorButton onClick={() => insertText('## ')} label="H2" title="Heading 2" />
                <EditorButton onClick={() => insertText('### ')} label="H3" title="Heading 3" />
                <div className="w-px h-4 bg-gray-300 dark:bg-gray-700 mx-1"></div>
                <EditorButton onClick={() => insertText('- ')} icon="•" title="List" />
                <EditorButton onClick={() => insertText('1. ')} icon="1." title="Ordered List" />
                <EditorButton onClick={() => insertText('> ')} icon="❝" title="Quote" />

                <span className="text-[10px] text-gray-400 font-mono ml-auto px-2 opacity-50 uppercase tracking-widest">
                    Markdown
                </span>
            </div>
            <textarea
                ref={textareaRef}
                value={value}
                onChange={onChange}
                className="w-full p-5 min-h-[350px] bg-transparent outline-none resize-y text-gray-800 dark:text-gray-200 font-mono text-sm leading-relaxed scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600"
                placeholder={label}
                dir={dir}
            />
        </div>
    )
}

const EditorButton = ({ onClick, label, icon, title, italic }) => (
    <button
        type="button"
        onClick={onClick}
        className={`w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300 transition-colors ${italic ? 'italic' : 'font-bold'}`}
        title={title}
    >
        {icon || label}
    </button>
)

// 🏷️ Tag Input Component
const TagInput = ({ tags, onChange, placeholder }) => {
    const [input, setInput] = useState('')

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' || e.key === ',') {
            e.preventDefault()
            const val = input.trim()
            if (val && !tags.includes(val)) {
                onChange([...tags, val])
                setInput('')
            }
        } else if (e.key === 'Backspace' && !input && tags.length > 0) {
            onChange(tags.slice(0, -1))
        }
    }

    return (
        <div className="p-2 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 flex flex-wrap gap-2 focus-within:ring-2 focus-within:ring-blue-500/50 transition-all">
            {tags.map((tag, i) => (
                <span key={i} className="bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-lg text-sm flex items-center gap-1.5 border border-blue-100 dark:border-blue-800">
                    {tag}
                    <button type="button" onClick={() => onChange(tags.filter(t => t !== tag))} className="hover:text-red-500 transition-colors text-lg leading-none">&times;</button>
                </span>
            ))}
            <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="flex-1 bg-transparent outline-none min-w-[120px] text-gray-900 dark:text-white px-2 py-1 placeholder-gray-400"
                placeholder={placeholder}
            />
        </div>
    )
}

// 🎨 Enhanced Tab Button
const TabButton = ({ id, label, icon, active, onClick }) => (
    <button
        type="button"
        onClick={() => onClick(id)}
        className={`relative flex items-center gap-3 px-5 py-4 rounded-xl transition-all font-medium text-sm md:text-base w-full md:w-auto text-right md:text-right overflow-hidden ${active
            ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/20'
            : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 border border-transparent hover:border-gray-200 dark:hover:border-gray-700'
            }`}
    >
        <span className="text-xl relative z-10">{icon}</span>
        <span className="relative z-10">{label}</span>
        {active && (
            <motion.div
                layoutId="activeTabBg"
                className="absolute inset-0 bg-white/10"
                initial={false}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
            />
        )}
    </button>
)

export default function BlogManagement() {
    const { locale } = useApp()
    const { success, error: showError } = useToast()
    const isAr = locale === 'ar'

    // State
    const [blogs, setBlogs] = useState([])
    const [filteredBlogs, setFilteredBlogs] = useState([])
    const [authors, setAuthors] = useState([])
    const [tags, setTags] = useState([])
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [showSettingsModal, setShowSettingsModal] = useState(false)
    const [isEditing, setIsEditing] = useState(false)
    const [currentId, setCurrentId] = useState(null)
    const [saving, setSaving] = useState(false)
    const [deleting, setDeleting] = useState(null)
    const [activeTab, setActiveTab] = useState('content')

    // Filters
    const [searchTerm, setSearchTerm] = useState('')
    const [categoryFilter, setCategoryFilter] = useState('ALL')
    const [publishedFilter, setPublishedFilter] = useState('all')

    // Initial Form
    const initialForm = {
        titleEn: '', titleAr: '',
        excerptEn: '', excerptAr: '',
        contentEn: '', contentAr: '',
        coverImage: '',
        category: 'CULTURE',
        selectedTags: [],
        metaTitle: '', metaDescription: '', keywords: [],
        featured: false, published: false,
        authorId: ''
    }

    const [formData, setFormData] = useState(initialForm)

    const categories = [
        { value: 'CULTURE', label: { ar: 'ثقافة', en: 'Culture' } },
        { value: 'NATURE', label: { ar: 'طبيعة', en: 'Nature' } },
        { value: 'TRAVEL', label: { ar: 'سفر', en: 'Travel' } },
        { value: 'STORIES', label: { ar: 'قصص', en: 'Stories' } }
    ]

    // ═══════════════════════════════════════════════════════════════
    // Fetch Data
    // ═══════════════════════════════════════════════════════════════
    const fetchData = useCallback(async () => {
        setLoading(true)
        try {
            const [blogsRes, authorsRes, tagsRes] = await Promise.all([
                fetch('/api/admin/blog', { cache: 'no-store' }),
                fetch('/api/admin/blog/authors', { cache: 'no-store' }),
                fetch('/api/admin/blog/tags', { cache: 'no-store' })
            ])

            const blogsData = await blogsRes.json()
            const authorsData = await authorsRes.json()
            const tagsData = await tagsRes.json()

            if (blogsData.success) {
                setBlogs(blogsData.data)
                setFilteredBlogs(blogsData.data)
            }
            if (authorsData.success) setAuthors(authorsData.data)
            if (tagsData.success) setTags(tagsData.data)

        } catch (error) {
            console.error('Error:', error)
            showError('Failed to fetch data')
        } finally {
            setLoading(false)
        }
    }, [showError])

    useEffect(() => {
        fetchData()
    }, [fetchData])

    // Filter Logic
    useEffect(() => {
        let result = blogs
        if (searchTerm) {
            const lower = searchTerm.toLowerCase()
            result = result.filter(b => b.titleEn.toLowerCase().includes(lower) || b.titleAr.includes(lower))
        }
        if (categoryFilter !== 'ALL') {
            result = result.filter(b => b.category === categoryFilter)
        }
        if (publishedFilter !== 'all') {
            const isPub = publishedFilter === 'published'
            result = result.filter(b => b.published === isPub)
        }
        setFilteredBlogs(result)
    }, [blogs, searchTerm, categoryFilter, publishedFilter])

    // ═══════════════════════════════════════════════════════════════
    // CRUD Logic
    // ═══════════════════════════════════════════════════════════════
    const handleCreate = () => {
        setFormData(initialForm)
        setIsEditing(false)
        setCurrentId(null)
        setActiveTab('content')
        setShowModal(true)
    }

    const handleEdit = (blog) => {
        setFormData({
            titleAr: blog.titleAr, titleEn: blog.titleEn,
            excerptAr: blog.excerptAr, excerptEn: blog.excerptEn,
            contentAr: blog.contentAr, contentEn: blog.contentEn,
            coverImage: blog.coverImage || '',
            category: blog.category,
            metaTitle: blog.metaTitle || '', metaDescription: blog.metaDescription || '',
            keywords: blog.keywords || [],
            published: blog.published, featured: blog.featured,
            authorId: blog.authorId || '',
            selectedTags: blog.tags?.map(t => t.id) || []
        })
        setIsEditing(true)
        setCurrentId(blog.id)
        setActiveTab('content')
        setShowModal(true)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setSaving(true)
        try {
            const url = isEditing ? `/api/admin/blog?id=${currentId}` : '/api/admin/blog'
            const method = isEditing ? 'PUT' : 'POST'

            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })
            const result = await res.json()

            if (result.success) {
                success(isEditing ? 'تم تحديث المقال بنجاح' : 'تم إنشاء المقال بنجاح')
                setShowModal(false)
                fetchData()
            } else {
                showError(result.error || 'Operation failed')
            }
        } catch (error) {
            showError('An error occurred')
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm(isAr ? 'هل أنت متأكد من الحذف؟' : 'Delete this post?')) return
        setDeleting(id)
        try {
            const res = await fetch(`/api/admin/blog?id=${id}`, { method: 'DELETE' })
            const result = await res.json()
            if (result.success) {
                success('Blog deleted')
                setBlogs(blogs.filter(b => b.id !== id))
            } else {
                showError(result.error)
            }
        } catch (e) {
            showError('Error deleting')
        } finally {
            setDeleting(null)
        }
    }

    // Stats Calculation
    const stats = {
        total: blogs.length,
        published: blogs.filter(b => b.published).length,
        draft: blogs.filter(b => !b.published).length,
        featured: blogs.filter(b => b.featured).length
    }

    return (
        <AdminLayout title={isAr ? 'إدارة المدونة' : 'Blog Management'}>

            <div className="relative overflow-hidden rounded-3xl p-8 mb-8 text-white bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600">
                <div className="absolute -top-10 -right-10 w-48 h-48 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute -bottom-12 -left-10 w-56 h-56 bg-white/10 rounded-full blur-2xl" />
                <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
                            {isAr ? 'إدارة المدونة' : 'Blog Management'}
                        </h1>
                        <p className="text-white/80 mt-2 text-sm md:text-base">
                            {isAr ? 'منصة متكاملة لإنشاء المقالات وإدارتها باحتراف' : 'Create, organize, and publish articles with a premium editorial flow.'}
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                        <button
                            onClick={() => setShowSettingsModal(true)}
                            className="px-5 py-3 bg-white/15 hover:bg-white/25 text-white rounded-2xl font-bold backdrop-blur-md transition-all flex items-center gap-2"
                        >
                            <span>⚙️</span>
                            <span>{isAr ? 'إعدادات المدونة' : 'Blog Settings'}</span>
                        </button>
                        <button
                            onClick={handleCreate}
                            className="px-5 py-3 bg-white text-blue-700 rounded-2xl font-extrabold shadow-xl shadow-black/10 hover:-translate-y-0.5 transition-all flex items-center gap-2"
                        >
                            <span>✍️</span>
                            <span>{isAr ? 'مقال جديد' : 'New Post'}</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                {[
                    { label: isAr ? 'مجموع المقالات' : 'Total Posts', value: stats.total, color: 'text-blue-600', bg: 'bg-blue-50 dark:bg-blue-900/20', icon: '🧾' },
                    { label: isAr ? 'منشور' : 'Published', value: stats.published, color: 'text-green-600', bg: 'bg-green-50 dark:bg-green-900/20', icon: '✅' },
                    { label: isAr ? 'مسودة' : 'Draft', value: stats.draft, color: 'text-orange-600', bg: 'bg-orange-50 dark:bg-orange-900/20', icon: '📝' },
                    { label: isAr ? 'مميز' : 'Featured', value: stats.featured, color: 'text-purple-600', bg: 'bg-purple-50 dark:bg-purple-900/20', icon: '⭐' },
                ].map((stat, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className={`${stat.bg} p-6 rounded-2xl border border-transparent dark:border-white/5 shadow-sm hover:shadow-lg transition-all`}
                    >
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-white/80 dark:bg-gray-900/40 flex items-center justify-center text-lg">
                                {stat.icon}
                            </div>
                            <div className={`text-3xl font-bold ${stat.color}`}>{stat.value}</div>
                        </div>
                        <div className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</div>
                    </motion.div>
                ))}
            </div>

            <div className="flex flex-col gap-4 mb-8 sticky top-4 z-30">
                <div className="flex flex-col lg:flex-row gap-4">
                    <div className="flex-1 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg p-3 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col md:flex-row gap-3">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder={isAr ? 'ابحث عن مقال أو كلمة مفتاحية...' : 'Search by title, excerpt, or keyword...'}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                dir={isAr ? 'rtl' : 'ltr'}
                                className="w-full h-full pl-10 pr-4 bg-transparent outline-none text-gray-700 dark:text-gray-200"
                            />
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
                        </div>
                        <div className="w-full md:w-px bg-gray-200 dark:bg-gray-700 my-1"></div>
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="bg-transparent outline-none text-sm font-medium text-gray-600 dark:text-gray-300 px-2 py-2 md:py-0"
                        >
                            <option value="ALL">{isAr ? 'كل الفئات' : 'All Categories'}</option>
                            {categories.map(c => (
                                <option key={c.value} value={c.value}>
                                    {isAr ? c.label.ar : c.label.en}
                                </option>
                            ))}
                        </select>
                        <div className="w-full md:w-px bg-gray-200 dark:bg-gray-700 my-1"></div>
                        <select
                            value={publishedFilter}
                            onChange={(e) => setPublishedFilter(e.target.value)}
                            className="bg-transparent outline-none text-sm font-medium text-gray-600 dark:text-gray-300 px-2 py-2 md:py-0"
                        >
                            <option value="all">{isAr ? 'الكل' : 'All Status'}</option>
                            <option value="published">{isAr ? 'منشور' : 'Published'}</option>
                            <option value="draft">{isAr ? 'مسودة' : 'Draft'}</option>
                        </select>
                    </div>

                    <div className="flex gap-3">
                        <button
                            onClick={() => {
                                setSearchTerm('')
                                setCategoryFilter('ALL')
                                setPublishedFilter('all')
                            }}
                            className="px-5 py-3 bg-white/90 dark:bg-gray-800/90 backdrop-blur-lg text-gray-700 dark:text-gray-200 rounded-2xl font-bold shadow-sm border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                        >
                            {isAr ? 'إعادة ضبط' : 'Reset'}
                        </button>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2">
                    <button
                        type="button"
                        onClick={() => setCategoryFilter('ALL')}
                        className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${categoryFilter === 'ALL'
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                                : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                            }`}
                    >
                        {isAr ? 'الكل' : 'All'}
                    </button>
                    {categories.map((c) => (
                        <button
                            key={c.value}
                            type="button"
                            onClick={() => setCategoryFilter(c.value)}
                            className={`px-4 py-2 rounded-full text-sm font-bold transition-all ${categoryFilter === c.value
                                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                                    : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                                }`}
                        >
                            {isAr ? c.label.ar : c.label.en}
                        </button>
                    ))}
                </div>
            </div>

            {/* 📝 Blog Grid */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent"></div>
                </div>
            ) : filteredBlogs.length === 0 ? (
                <div className="text-center py-20 bg-white dark:bg-gray-800 rounded-3xl border border-dashed border-gray-200 dark:border-gray-700">
                    <div className="text-6xl mb-4 opacity-30">📭</div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{isAr ? 'لا توجد مقالات' : 'No posts found'}</h3>
                    <p className="text-gray-500 dark:text-gray-400">{isAr ? 'جرب تغيير معايير البحث أو أنشئ مقالاً جديداً' : 'Try searching for something else.'}</p>
                </div>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <AnimatePresence>
                        {filteredBlogs.map((blog, i) => (
                            <motion.div
                                key={blog.id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ delay: i * 0.05 }}
                                className="group bg-white dark:bg-gray-800 rounded-2xl overflow-hidden border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
                            >
                                <div className="relative h-48 bg-gray-100 dark:bg-gray-900 overflow-hidden">
                                    {blog.coverImage ? (
                                        <Image
                                            src={blog.coverImage}
                                            alt={blog.titleEn}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-700"
                                            sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                                            unoptimized
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900">📝</div>
                                    )}
                                    <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                                        <span className={`px-2.5 py-1 rounded-lg text-xs font-bold backdrop-blur-md ${blog.published ? 'bg-green-500/90 text-white' : 'bg-gray-500/90 text-white'}`}>
                                            {blog.published ? (isAr ? 'منشور' : 'Published') : (isAr ? 'مسودة' : 'Draft')}
                                        </span>
                                        {blog.featured && <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-yellow-400/90 text-black backdrop-blur-md">⭐</span>}
                                    </div>
                                </div>

                                <div className="p-5 flex-1 flex flex-col">
                                    <div className="flex items-center justify-between mb-3">
                                        <span className="text-xs font-bold tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded-md uppercase">
                                            {blog.category}
                                        </span>
                                        <span className="text-xs text-gray-400 font-mono">
                                            {new Date(blog.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>

                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 line-clamp-2 leading-tight group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                        {isAr ? blog.titleAr : blog.titleEn}
                                    </h3>

                                    <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 flex-1">
                                        {isAr ? blog.excerptAr : blog.excerptEn}
                                    </p>

                                    <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-700 mt-auto">
                                        <div className="flex items-center gap-3">
                                            <span className="text-xs text-gray-400 flex items-center gap-1">👁️ {blog.viewsCount || 0}</span>
                                            <span className="text-xs text-gray-400 flex items-center gap-1">💬 {blog.commentsCount || 0}</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <Link href={`/blog/${blog.slug}`} target="_blank" className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors" title="View">
                                                🌍
                                            </Link>
                                            <button onClick={() => handleEdit(blog)} className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors" title="Edit">
                                                ✏️
                                            </button>
                                            <button onClick={() => handleDelete(blog.id)} className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Delete">
                                                {deleting === blog.id ? '⌛' : '🗑️'}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}

            {/* 🛠️ Modals */}
            <AnimatePresence>
                {showSettingsModal && (
                    <BlogSettingsModal onClose={() => {
                        setShowSettingsModal(false)
                        fetchData()
                    }} />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {showModal && (
                    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
                        <motion.div
                            initial={{ scale: 0.95, opacity: 0, y: 20 }}
                            animate={{ scale: 1, opacity: 1, y: 0 }}
                            exit={{ scale: 0.95, opacity: 0, y: 20 }}
                            className="bg-white dark:bg-gray-900 rounded-3xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden border border-gray-200 dark:border-gray-700"
                        >
                            {/* Modal Header */}
                            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex items-center justify-between bg-white dark:bg-gray-900">
                                <div>
                                    <h2 className="text-xl font-bold dark:text-white">
                                        {isEditing ? (isAr ? 'تعديل المقال' : 'Edit Post') : (isAr ? 'إنشاء مقال جديد' : 'New Post')}
                                    </h2>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {isEditing ? 'Update your content below' : 'Share a new story with the world'}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setShowModal(false)}
                                        className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full text-gray-500 transition-colors"
                                    >
                                        ✕
                                    </button>
                                </div>
                            </div>

                            {/* Modal Body */}
                            <div className="flex-1 flex overflow-hidden">
                                {/* Sidebar */}
                                <div className="w-64 bg-gray-50 dark:bg-gray-900/50 border-r border-gray-100 dark:border-gray-800 p-4 space-y-2 hidden md:block">
                                    <TabButton id="content" label={isAr ? 'المحتوى' : 'Content'} icon="✍️" active={activeTab === 'content'} onClick={setActiveTab} />
                                    <TabButton id="media" label={isAr ? 'الوسائط' : 'Media'} icon="🖼️" active={activeTab === 'media'} onClick={setActiveTab} />
                                    <TabButton id="seo" label="SEO" icon="🚀" active={activeTab === 'seo'} onClick={setActiveTab} />
                                    <TabButton id="settings" label={isAr ? 'الإعدادات' : 'Settings'} icon="⚙️" active={activeTab === 'settings'} onClick={setActiveTab} />
                                </div>

                                {/* Form Content */}
                                <div className="flex-1 overflow-y-auto p-6 md:p-10 bg-white dark:bg-gray-900 scrollbar-thin">
                                    <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-8 pb-20">

                                        {activeTab === 'content' && (
                                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                                                <div className="grid md:grid-cols-2 gap-6">
                                                    <div>
                                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">English Title *</label>
                                                        <input
                                                            required
                                                            value={formData.titleEn}
                                                            onChange={e => setFormData({ ...formData, titleEn: e.target.value })}
                                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-lg"
                                                            placeholder="Article Title..."
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">العنوان بالعربية *</label>
                                                        <input
                                                            required
                                                            dir="rtl"
                                                            value={formData.titleAr}
                                                            onChange={e => setFormData({ ...formData, titleAr: e.target.value })}
                                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold text-lg"
                                                            placeholder="عنوان المقال..."
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid md:grid-cols-2 gap-6">
                                                    <div>
                                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">English Excerpt</label>
                                                        <textarea
                                                            rows={3}
                                                            value={formData.excerptEn}
                                                            onChange={e => setFormData({ ...formData, excerptEn: e.target.value })}
                                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                                                            placeholder="Short summary..."
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">ملخص قصير</label>
                                                        <textarea
                                                            dir="rtl"
                                                            rows={3}
                                                            value={formData.excerptAr}
                                                            onChange={e => setFormData({ ...formData, excerptAr: e.target.value })}
                                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none"
                                                            placeholder="نبذة عن المقال..."
                                                        />
                                                    </div>
                                                </div>

                                                <div className="space-y-6">
                                                    <div>
                                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Content (English)</label>
                                                        <RichTextEditor
                                                            value={formData.contentEn}
                                                            onChange={e => setFormData({ ...formData, contentEn: e.target.value })}
                                                            label="Start writing your story..."
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">المحتوى (عربي)</label>
                                                        <RichTextEditor
                                                            dir="rtl"
                                                            value={formData.contentAr}
                                                            onChange={e => setFormData({ ...formData, contentAr: e.target.value })}
                                                            label="ابدأ كتابة مقالك هنا..."
                                                        />
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}

                                        {activeTab === 'media' && (
                                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">
                                                <div className="bg-gray-50 dark:bg-gray-800/50 p-6 rounded-2xl border border-gray-200 dark:border-gray-700">
                                                    <h3 className="text-lg font-bold mb-4 dark:text-white">{isAr ? 'رابط صورة الغلاف' : 'Cover Image URL'}</h3>
                                                    <div className="max-w-xl mx-auto space-y-4">
                                                        <input
                                                            type="url"
                                                            value={formData.coverImage || ''}
                                                            onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                                                            placeholder={isAr ? 'https:// رابط صورة مباشر (jpg/png/webp)' : 'https:// direct image URL (jpg/png/webp)'}
                                                            className="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-white"
                                                        />
                                                        {formData.coverImage && (
                                                            <div className="rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-700 relative group">
                                                                <Image
                                                                    src={formData.coverImage}
                                                                    alt={formData.titleEn || 'Blog cover'}
                                                                    width={1200}
                                                                    height={630}
                                                                    className="w-full h-auto"
                                                                    sizes="(min-width: 1024px) 512px, (min-width: 768px) 480px, 100vw"
                                                                    unoptimized
                                                                />
                                                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center">
                                                                    <button type="button" onClick={() => setFormData({ ...formData, coverImage: '' })} className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold hover:bg-red-600 transition-colors">
                                                                        {isAr ? 'حذف' : 'Remove'}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                        <p className="text-xs text-gray-500 dark:text-gray-400">
                                                            {isAr ? 'الصق رابط صورة مباشر فقط (ينتهي بـ jpg/png/webp). يمكنك استخدام خدمات مثل Unsplash, ImgBB, Cloudinary.' : 'Paste a direct image link only (ends with jpg/png/webp). You can use services like Unsplash, ImgBB, Cloudinary.'}
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}

                                        {activeTab === 'seo' && (
                                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
                                                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-xl border border-blue-100 dark:border-blue-800">
                                                    <h4 className="font-bold text-blue-800 dark:text-blue-300 mb-1">SEO Tips</h4>
                                                    <p className="text-sm text-blue-600 dark:text-blue-400">Add keywords and meta descriptions to improve your article&apos;s visibility on Google.</p>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Meta Title</label>
                                                    <input
                                                        value={formData.metaTitle}
                                                        onChange={e => setFormData({ ...formData, metaTitle: e.target.value })}
                                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                                                        placeholder="Custom title for search engines"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Meta Description</label>
                                                    <textarea
                                                        rows={3}
                                                        value={formData.metaDescription}
                                                        onChange={e => setFormData({ ...formData, metaDescription: e.target.value })}
                                                        className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none resize-none"
                                                        placeholder="Brief description appearing in search results"
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Keywords</label>
                                                    <TagInput
                                                        tags={formData.keywords}
                                                        onChange={newTags => setFormData({ ...formData, keywords: newTags })}
                                                        placeholder="Type keyword and press Enter"
                                                    />
                                                </div>
                                            </motion.div>
                                        )}

                                        {activeTab === 'settings' && (
                                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-8">

                                                <div className="grid md:grid-cols-2 gap-6">
                                                    <div>
                                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Category</label>
                                                        <select
                                                            value={formData.category}
                                                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                                                        >
                                                            {categories.map(c => (
                                                                <option key={c.value} value={c.value}>
                                                                    {isAr ? c.label.ar : c.label.en}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>
                                                    <div>
                                                        <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Author</label>
                                                        <select
                                                            value={formData.authorId}
                                                            onChange={e => setFormData({ ...formData, authorId: e.target.value })}
                                                            className="w-full px-4 py-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 outline-none"
                                                        >
                                                            <option value="">Select Author...</option>
                                                            {authors.map(a => <option key={a.id} value={a.id}>{isAr ? a.nameAr : a.nameEn}</option>)}
                                                        </select>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">Tags</label>
                                                    <div className="flex flex-wrap gap-2 p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
                                                        {tags.map(tag => (
                                                            <button
                                                                type="button"
                                                                key={tag.id}
                                                                onClick={() => {
                                                                    const selected = formData.selectedTags.includes(tag.id)
                                                                    const newTags = selected ? formData.selectedTags.filter(t => t !== tag.id) : [...formData.selectedTags, tag.id]
                                                                    setFormData({ ...formData, selectedTags: newTags })
                                                                }}
                                                                className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${formData.selectedTags.includes(tag.id)
                                                                        ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                                                                        : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'
                                                                    }`}
                                                            >
                                                                {isAr ? tag.nameAr : tag.nameEn}
                                                            </button>
                                                        ))}
                                                        {tags.length === 0 && <span className="text-gray-400 italic text-sm">No tags found. Add tags in Blog Settings.</span>}
                                                    </div>
                                                </div>

                                                <div className="flex gap-6 pt-4 border-t border-gray-100 dark:border-gray-800">
                                                    <label className="flex items-center gap-3 cursor-pointer group">
                                                        <div className={`w-12 h-7 rounded-full p-1 transition-colors ${formData.published ? 'bg-green-500' : 'bg-gray-300 dark:bg-gray-600'}`}>
                                                            <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${formData.published ? 'translate-x-5' : 'translate-x-0'}`} />
                                                        </div>
                                                        <input type="checkbox" className="hidden" checked={formData.published} onChange={e => setFormData({ ...formData, published: e.target.checked })} />
                                                        <span className="font-bold text-gray-700 dark:text-gray-300 group-hover:text-blue-600 transition-colors">Published</span>
                                                    </label>

                                                    <label className="flex items-center gap-3 cursor-pointer group">
                                                        <div className={`w-12 h-7 rounded-full p-1 transition-colors ${formData.featured ? 'bg-yellow-400' : 'bg-gray-300 dark:bg-gray-600'}`}>
                                                            <div className={`w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${formData.featured ? 'translate-x-5' : 'translate-x-0'}`} />
                                                        </div>
                                                        <input type="checkbox" className="hidden" checked={formData.featured} onChange={e => setFormData({ ...formData, featured: e.target.checked })} />
                                                        <span className="font-bold text-gray-700 dark:text-gray-300 group-hover:text-yellow-500 transition-colors">Featured</span>
                                                    </label>
                                                </div>

                                            </motion.div>
                                        )}

                                        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-t border-gray-200 dark:border-gray-800 flex justify-end gap-3 z-50">
                                            <button
                                                type="button"
                                                onClick={() => setShowModal(false)}
                                                className="px-6 py-2.5 rounded-xl text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 font-bold transition-colors"
                                            >
                                                Cancel
                                            </button>
                                            <button
                                                type="submit"
                                                disabled={saving}
                                                className="px-8 py-2.5 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20 disabled:opacity-50 transition-all flex items-center gap-2"
                                            >
                                                {saving ? <span className="animate-spin text-xl">⏳</span> : 'Save Post'}
                                            </button>
                                        </div>

                                    </form>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                )}
            </AnimatePresence>

        </AdminLayout>
    )
}
