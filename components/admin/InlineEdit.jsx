// ═══════════════════════════════════════════════════════════════
// ✏️ INLINE EDITING - Edit-in-Place Component
// تحرير مباشر في المكان
// ═══════════════════════════════════════════════════════════════

import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'

export default function InlineEdit({
    value,
    onSave,
    type = 'text', // 'text' | 'textarea' | 'number' | 'select'
    options = [], // For select type
    placeholder,
    validation,
    className = '',
    disabled = false,
    autoSave = true,
    onCancel,
    isAr = false
}) {
    const [isEditing, setIsEditing] = useState(false)
    const [editValue, setEditValue] = useState(value)
    const [error, setError] = useState('')
    const inputRef = useRef(null)

    // Focus input when editing starts
    useEffect(() => {
        if (isEditing && inputRef.current) {
            inputRef.current.focus()
            if (type === 'text' || type === 'number') {
                inputRef.current.select()
            }
        }
    }, [isEditing, type])

    // Update editValue when value prop changes
    useEffect(() => {
        setEditValue(value)
    }, [value])

    const handleSave = async () => {
        // Validation
        if (validation) {
            const validationError = validation(editValue)
            if (validationError) {
                setError(validationError)
                return
            }
        }

        // Don't save if value hasn't changed
        if (editValue === value) {
            setIsEditing(false)
            return
        }

        try {
            await onSave(editValue)
            setIsEditing(false)
            setError('')
        } catch (err) {
            setError(err.message || 'Failed to save')
        }
    }

    const handleCancel = () => {
        setEditValue(value)
        setError('')
        setIsEditing(false)
        onCancel?.()
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && type !== 'textarea') {
            e.preventDefault()
            handleSave()
        } else if (e.key === 'Escape') {
            handleCancel()
        }
    }

    const handleBlur = () => {
        if (autoSave) {
            handleSave()
        }
    }

    if (disabled) {
        return <span className={className}>{value}</span>
    }

    return (
        <div className="relative inline-block w-full">
            {!isEditing ? (
                // Display Mode
                <button
                    onClick={() => setIsEditing(true)}
                    className={`text-left w-full px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 
            transition-all group relative ${className}`}
                    title={isAr ? 'انقر مرتين للتحرير' : 'Double-click to edit'}
                    onDoubleClick={() => setIsEditing(true)}
                >
                    <span className={value ? '' : 'text-gray-400 italic'}>
                        {value || placeholder || (isAr ? 'انقر للتحرير' : 'Click to edit')}
                    </span>
                    <span className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-xs text-gray-500">
                        ✏️
                    </span>
                </button>
            ) : (
                // Edit Mode
                <motion.div
                    initial={{ scale: 0.98 }}
                    animate={{ scale: 1 }}
                    className="relative"
                >
                    {type === 'textarea' ? (
                        <textarea
                            ref={inputRef}
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onBlur={handleBlur}
                            placeholder={placeholder}
                            className={`w-full px-3 py-2 border-2 border-green-500 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700
                text-gray-900 dark:text-white resize-none ${error ? 'border-red-500' : ''}`}
                            rows={3}
                        />
                    ) : type === 'select' ? (
                        <select
                            ref={inputRef}
                            value={editValue}
                            onChange={(e) => {
                                setEditValue(e.target.value)
                                if (autoSave) {
                                    onSave(e.target.value)
                                    setIsEditing(false)
                                }
                            }}
                            onBlur={handleBlur}
                            className={`w-full px-3 py-2 border-2 border-green-500 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700
                text-gray-900 dark:text-white ${error ? 'border-red-500' : ''}`}
                        >
                            {options.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <input
                            ref={inputRef}
                            type={type}
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={handleKeyDown}
                            onBlur={handleBlur}
                            placeholder={placeholder}
                            className={`w-full px-3 py-2 border-2 border-green-500 rounded-lg 
                focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-gray-700
                text-gray-900 dark:text-white ${error ? 'border-red-500' : ''}`}
                        />
                    )}

                    {/* Error Message */}
                    {error && (
                        <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute top-full mt-1 text-xs text-red-500"
                        >
                            {error}
                        </motion.p>
                    )}

                    {/* Action Buttons (for non-autoSave) */}
                    {!autoSave && (
                        <div className="flex items-center gap-2 mt-2">
                            <button
                                onClick={handleSave}
                                className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs font-semibold"
                            >
                                ✓ {isAr ? 'حفظ' : 'Save'}
                            </button>
                            <button
                                onClick={handleCancel}
                                className="px-3 py-1 bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500 
                  text-gray-700 dark:text-gray-200 rounded text-xs font-semibold"
                            >
                                ✕ {isAr ? 'إلغاء' : 'Cancel'}
                            </button>
                        </div>
                    )}

                    {/* Hint */}
                    {autoSave && (
                        <p className="text-xs text-gray-500 mt-1">
                            {isAr ? 'اضغط Enter للحفظ، Esc للإلغاء' : 'Press Enter to save, Esc to cancel'}
                        </p>
                    )}
                </motion.div>
            )}
        </div>
    )
}

// ═══════════════════════════════════════════════════════════════
// INLINE EDIT EXAMPLES
// ═══════════════════════════════════════════════════════════════
export const InlineEditExamples = {
    // Simple text edit
    text: (value, onSave) => (
        <InlineEdit
            value={value}
            onSave={onSave}
            type="text"
            placeholder="Enter text..."
        />
    ),

    // Number with validation
    number: (value, onSave) => (
        <InlineEdit
            value={value}
            onSave={onSave}
            type="number"
            validation={(val) => {
                if (val < 0) return 'Must be positive'
                if (val > 100) return 'Must be less than 100'
                return null
            }}
        />
    ),

    // Textarea
    textarea: (value, onSave) => (
        <InlineEdit
            value={value}
            onSave={onSave}
            type="textarea"
            placeholder="Enter description..."
        />
    ),

    // Select dropdown
    select: (value, onSave, options) => (
        <InlineEdit
            value={value}
            onSave={onSave}
            type="select"
            options={options}
        />
    )
}
