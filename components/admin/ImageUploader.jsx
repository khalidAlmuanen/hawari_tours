'use client'

import { useState, useRef } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { useToast } from './Toast'
import { useApp } from '@/contexts/AppContext'

export default function ImageUploader({ value, onUploadProp, onChange, multiple = false, className = '', label, previewClassName = '', boxClassName = '' }) {
    const [dragActive, setDragActive] = useState(false)
    const [uploading, setUploading] = useState(false)
    const inputRef = useRef(null)
    const { error: showError } = useToast()
    const { locale } = useApp()
    const isAr = locale === 'ar'
    const finalLabel = label ?? (isAr ? 'رفع صورة' : 'Upload Image')

    // Helper to call either prop
    const handleUploadChange = (val) => {
        if (onChange) onChange(val)
        if (onUploadProp) onUploadProp(val)
    }

    const handleDrag = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true)
        } else if (e.type === 'dragleave') {
            setDragActive(false)
        }
    }

    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFiles(e.dataTransfer.files)
        }
    }

    const handleChange = (e) => {
        e.preventDefault()
        if (e.target.files && e.target.files[0]) {
            handleFiles(e.target.files)
        }
    }

    const handleFiles = async (files) => {
        setUploading(true)
        const uploadedUrls = []

        for (let i = 0; i < files.length; i++) {
            const file = files[i]

            // Validate size (20MB limit)
            if (file.size > 20 * 1024 * 1024) {
                showError(isAr ? `الملف كبير جدًا: ${file.name}. الحد 20MB.` : `File too large: ${file.name}. Max 20MB.`)
                continue
            }

            console.log(`[ImageUploader] Uploading ${file.name} (${file.size} bytes, ${file.type})`)

            const formData = new FormData()
            formData.append('file', file)

            try {
                const response = await fetch('/api/upload', {
                    method: 'POST',
                    body: formData,
                })

                if (!response.ok) {
                    const contentType = response.headers.get("content-type");
                    if (contentType && contentType.indexOf("application/json") !== -1) {
                        const errorData = await response.json();
                        throw new Error(errorData.error || (isAr ? 'فشل الرفع' : 'Upload failed'));
                    } else {
                        const textError = await response.text();
                        throw new Error(isAr ? `فشل الرفع: ${response.status} ${response.statusText}` : `Upload failed: ${response.status} ${response.statusText}`);
                    }
                }

                const data = await response.json()
                if (data.success) {
                    uploadedUrls.push(data.url)
                }
            } catch (err) {
                console.error(err)
                showError((isAr ? 'فشل الرفع: ' : 'Upload failed: ') + (err.message || file.name))
            }
        }

        setUploading(false)
        if (uploadedUrls.length > 0) {
            if (multiple) {
                handleUploadChange(uploadedUrls)
            } else {
                handleUploadChange(uploadedUrls[0])
            }
        }
    }

    return (
        <div className={`space-y-2 ${className}`}>
            {finalLabel && <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300">{finalLabel}</label>}

            <div
                className={`relative group cursor-pointer transition-all duration-300 overflow-hidden ${boxClassName}
                    ${dragActive
                        ? 'border-blue-500 bg-blue-50/80 dark:bg-blue-900/20 scale-[1.01]'
                        : 'border-gray-300/80 dark:border-gray-600/80 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-md'
                    }
                    ${value ? 'border-none' : 'border-2 border-dashed rounded-2xl p-8'}
                `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={() => !value && inputRef.current?.click()}
            >
                <input
                    ref={inputRef}
                    type="file"
                    multiple={multiple}
                    accept="image/*"
                    onChange={handleChange}
                    className="hidden"
                />

                {value ? (
                    <div className={`relative rounded-2xl overflow-hidden w-full bg-gray-100 dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700/80 ${previewClassName || 'aspect-video md:aspect-square'}`}>
                        <Image
                            src={value}
                            alt={isAr ? 'تم الرفع' : 'Uploaded'}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                            sizes="(min-width: 768px) 400px, 100vw"
                        />
                        <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-3 backdrop-blur-[2px]">
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    inputRef.current?.click()
                                }}
                                className="p-2 bg-white/90 text-blue-600 rounded-full hover:bg-white hover:scale-110 transition-all shadow-lg"
                                title={isAr ? 'تغيير الصورة' : 'Change Image'}
                            >
                                🔄
                            </button>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    if (multiple) {
                                        handleUploadChange([])
                                    } else {
                                        handleUploadChange('')
                                    }
                                }}
                                className="p-2 bg-white/90 text-red-600 rounded-full hover:bg-white hover:scale-110 transition-all shadow-lg"
                                title={isAr ? 'حذف الصورة' : 'Remove Image'}
                            >
                                🗑️
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center gap-4 py-4">
                        <div className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 ${uploading ? 'bg-blue-100 text-blue-600 animate-pulse' : 'bg-gray-100 dark:bg-gray-800 text-gray-400 group-hover:scale-110 group-hover:text-blue-500 group-hover:bg-blue-50'}`}>
                            {uploading ? (
                                <svg className="w-8 h-8 animate-spin" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : (
                                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            )}
                        </div>

                        <div className="text-center">
                            <p className="font-bold text-gray-700 dark:text-gray-300 group-hover:text-blue-500 transition-colors">
                                {uploading ? (isAr ? 'جارٍ الرفع...' : 'Uploading...') : (isAr ? 'اضغط أو اسحب الصورة' : 'Click or Drag Image')}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                                {uploading ? (isAr ? 'يرجى الانتظار' : 'Please wait') : (isAr ? 'يدعم JPG و PNG و WEBP' : 'Supports JPG, PNG, WEBP')}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
