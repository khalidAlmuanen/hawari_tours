'use client'

// ═══════════════════════════════════════════════════════════════
// 📄 BLOG POST CLIENT COMPONENT - Ultra Professional
// مكون العرض التفاعلي
// ═══════════════════════════════════════════════════════════════

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useApp } from '@/contexts/AppContext'
import Link from 'next/link'
import { motion } from 'framer-motion'
import ReactMarkdown from 'react-markdown'
import Image from 'next/image'

export default function BlogPostClient({ initialPost }) {
    const { slug } = useParams()
    const { locale } = useApp()
    const isAr = locale === 'ar'

    const post = initialPost // Data is passed from Server Component

    useEffect(() => {
        // Increment view count on mount
        if (slug) {
            fetch(`/api/blog/${slug}`, { method: 'GET' }).catch(err => console.error(err))
        }
    }, [slug])

    if (!post) return null

    const title = isAr ? post.titleAr : post.titleEn
    const content = isAr ? post.contentAr : post.contentEn
    const authorName = post.author ? (isAr ? post.author.nameAr : post.author.nameEn) : 'Hawari Team'
    const authorTitle = post.author ? (isAr ? post.author.titleAr : post.author.titleEn) : ''
    const authorBio = post.author ? (isAr ? post.author.bioAr : post.author.bioEn) : ''
    const date = new Date(post.publishedAt || post.createdAt).toLocaleDateString(isAr ? 'ar-EG' : 'en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    const readTime = Math.ceil((content?.length || 0) / 1000) // Rough estimate
    const fallbackCover = '/placeholder.jpg'

    return (
        <div className="min-h-screen bg-white dark:bg-gray-950 pb-20">

            {/* ═══════════════════════════════════════════════════════════════
                HERO HEADER
            ═══════════════════════════════════════════════════════════════ */}
            <div className="relative h-[60vh] min-h-[500px] w-full overflow-hidden">
                <div className="absolute inset-0 bg-gray-900">
                    {post.coverImage && (
                        <Image
                            src={post.coverImage}
                            alt={title}
                            fill
                            className="object-cover opacity-60"
                            sizes="100vw"
                            unoptimized
                        />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-900/40 to-transparent" />
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-6 md:p-12 z-10 container mx-auto max-w-4xl">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                        <div className="flex flex-wrap gap-3 mb-4">
                            <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                                {post.category}
                            </span>
                            <span className="bg-white/10 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                ⏳ {readTime} {isAr ? 'دقائق قراءة' : 'min read'}
                            </span>
                        </div>

                        <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white mb-6 leading-tight drop-shadow-lg">
                            {title}
                        </h1>

                        <div className="flex items-center gap-4 text-white/90">
                            <div className="relative w-12 h-12 rounded-full border-2 border-white/20 overflow-hidden">
                                <Image
                                    src={post.author?.avatar || '/placeholder-user.jpg'}
                                    alt={authorName}
                                    fill
                                    className="object-cover"
                                    sizes="48px"
                                    unoptimized
                                />
                            </div>
                            <div>
                                <div className="font-bold text-lg">{authorName}</div>
                                <div className="text-sm opacity-80 flex gap-2">
                                    <span>{date}</span>
                                    <span>•</span>
                                    <span>{post.viewsCount} {isAr ? 'مشاهدة' : 'Views'}</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                CONTENT BODY
            ═══════════════════════════════════════════════════════════════ */}
            <div className="container mx-auto px-6 max-w-4xl -mt-10 relative z-20">
                <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 md:p-12 shadow-2xl border border-gray-100 dark:border-gray-800">

                    {/* Share Buttons (Sticky) */}
                    {/* <div className="hidden lg:flex flex-col gap-4 absolute -left-20 top-20 sticky">
                        <button className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                            f
                        </button>
                        <button className="w-12 h-12 rounded-full bg-sky-100 text-sky-500 flex items-center justify-center hover:bg-sky-500 hover:text-white transition-all shadow-sm">
                            t
                        </button>
                    </div> */}

                    {/* Markdown Content */}
                    <article className={`prose prose-lg dark:prose-invert max-w-none ${isAr ? 'font-arabic' : ''}`} dir={isAr ? 'rtl' : 'ltr'}>
                        <ReactMarkdown
                            components={{
                                h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mb-6 mt-10 text-gray-900 dark:text-gray-100" {...props} />,
                                h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mb-4 mt-8 text-gray-800 dark:text-gray-200 border-b pb-2 dark:border-gray-700" {...props} />,
                                h3: ({ node, ...props }) => <h3 className="text-xl font-bold mb-3 mt-6 text-gray-800 dark:text-gray-300" {...props} />,
                                p: ({ node, ...props }) => <p className="mb-6 leading-loose text-gray-600 dark:text-gray-300" {...props} />,
                                ul: ({ node, ...props }) => <ul className="list-disc list-inside mb-6 space-y-2 marker:text-blue-500" {...props} />,
                                li: ({ node, ...props }) => <li className="text-gray-600 dark:text-gray-300" {...props} />,
                                blockquote: ({ node, ...props }) => <blockquote className="border-l-4 border-blue-500 pl-4 py-2 italic bg-gray-50 dark:bg-gray-800/50 rounded-r-lg my-6 text-gray-700 dark:text-gray-300" {...props} />,
                                img: ({ node, ...props }) => (
                                    <span className="relative block w-full h-[420px] my-8">
                                        <Image
                                            src={props.src || fallbackCover}
                                            alt={props.alt || ''}
                                            fill
                                            className="object-cover rounded-xl shadow-lg"
                                            sizes="100vw"
                                            unoptimized
                                        />
                                    </span>
                                ),
                                a: ({ node, ...props }) => <a className="text-blue-600 hover:underline font-bold" {...props} />,
                            }}
                        >
                            {content}
                        </ReactMarkdown>
                    </article>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                        <div className="mt-12 pt-8 border-t border-gray-100 dark:border-gray-800">
                            <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider">
                                {isAr ? 'الوسوم' : 'Tags'}
                            </h4>
                            <div className="flex flex-wrap gap-2">
                                {post.tags.map(tag => (
                                    <span key={tag.id} className="bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors cursor-pointer">
                                        #{isAr ? tag.nameAr : tag.nameEn}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* ═══════════════════════════════════════════════════════════════
                AUTHOR BIO
            ═══════════════════════════════════════════════════════════════ */}
            {post.author && (
                <div className="container mx-auto px-6 max-w-4xl mt-12">
                    <div className="bg-white dark:bg-gray-900 rounded-3xl p-8 border border-gray-100 dark:border-gray-800 flex flex-col md:flex-row gap-8 items-center md:items-start text-center md:text-left rtl:md:text-right">
                        <div className="relative w-24 h-24 rounded-full overflow-hidden ring-4 ring-gray-50 dark:ring-gray-800">
                            <Image
                                src={post.author.avatar || '/placeholder-user.jpg'}
                                alt={authorName}
                                fill
                                className="object-cover"
                                sizes="96px"
                                unoptimized
                            />
                        </div>
                        <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                                {isAr ? 'عن الكاتب' : 'About the Author'}
                            </h3>
                            <div className="text-lg font-bold text-blue-600 dark:text-blue-400 mb-2">{authorName}</div>
                            {authorTitle && <div className="text-sm font-medium text-gray-500 uppercase tracking-widest mb-4">{authorTitle}</div>}
                            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                {authorBio}
                            </p>
                        </div>
                    </div>
                </div>
            )}

            {/* ═══════════════════════════════════════════════════════════════
                RELATED POSTS
            ═══════════════════════════════════════════════════════════════ */}
            {post.relatedPosts && post.relatedPosts.length > 0 && (
                <div className="container mx-auto px-6 max-w-6xl mt-20">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
                        {isAr ? 'مقالات ذات صلة' : 'Related Articles'}
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        {post.relatedPosts.map(rel => (
                            <Link href={`/blog/${rel.slug}`} key={rel.id} className="group cursor-pointer">
                                <div className="bg-white dark:bg-gray-900 rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-100 dark:border-gray-800">
                                    <div className="relative h-48 overflow-hidden">
                                        <Image
                                            src={rel.coverImage || '/placeholder.jpg'}
                                            alt={isAr ? rel.titleAr : rel.titleEn}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-500"
                                            sizes="(min-width: 768px) 33vw, 100vw"
                                            unoptimized
                                        />
                                    </div>
                                    <div className="p-5">
                                        <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 transition-colors line-clamp-2">
                                            {isAr ? rel.titleAr : rel.titleEn}
                                        </h3>
                                        <div className="mt-3 text-xs text-gray-400">
                                            {new Date(rel.publishedAt).toLocaleDateString()}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

        </div>
    )
}
