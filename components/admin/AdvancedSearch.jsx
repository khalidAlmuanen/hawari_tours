// ═══════════════════════════════════════════════════════════════
// 🔍 ADVANCED SEARCH - Multi-Field Search Component
// بحث متقدم مع فلاتر متعددة
// ═══════════════════════════════════════════════════════════════

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

export default function AdvancedSearch({
    onSearch,
    filters = [], // Array of { name, label, type, options }
    savedFilters = [],
    onSaveFilter,
    showDateRange = false,
    placeholder = 'Search...',
    isAr = false
}) {
    const [isExpanded, setIsExpanded] = useState(false)
    const [searchQuery, setSearchQuery] = useState('')
    const [activeFilters, setActiveFilters] = useState({})
    const [dateRange, setDateRange] = useState({ start: null, end: null })

    // Handle search
    const handleSearch = () => {
        onSearch({
            query: searchQuery,
            filters: activeFilters,
            dateRange: showDateRange ? dateRange : undefined
        })
    }

    // Handle filter change
    const handleFilterChange = (filterName, value) => {
        setActiveFilters(prev => ({
            ...prev,
            [filterName]: value
        }))
    }

    // Clear all filters
    const clearAllFilters = () => {
        setSearchQuery('')
        setActiveFilters({})
        setDateRange({ start: null, end: null })
        onSearch({ query: '', filters: {}, dateRange: undefined })
    }

    // Count active filters
    const activeFilterCount = Object.keys(activeFilters).filter(key => activeFilters[key]).length

    return (
        <div className="space-y-4">
            {/* Main Search Bar */}
            <div className="flex gap-2">
                {/* Search Input */}
                <div className="flex-1 relative">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value)
                            // Auto-search on type (debounced in parent)
                        }}
                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                        placeholder={placeholder}
                        className="w-full px-4 py-3 pl-12 pr-4 border border-gray-300 dark:border-gray-600 
              rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white
              focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                    />
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                        🔍
                    </div>
                    {searchQuery && (
                        <button
                            onClick={() => setSearchQuery('')}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        >
                            ✖️
                        </button>
                    )}
                </div>

                {/* Advanced Filters Toggle */}
                <button
                    onClick={() => setIsExpanded(!isExpanded)}
                    className={`px-4 py-3 rounded-lg font-semibold transition-all flex items-center gap-2
            ${isExpanded
                            ? 'bg-green-600 text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                >
                    <span>🎯</span>
                    {isAr ? 'فلترة متقدمة' : 'Filters'}
                    {activeFilterCount > 0 && (
                        <span className="px-2 py-0.5 bg-white/30 rounded-full text-xs font-bold">
                            {activeFilterCount}
                        </span>
                    )}
                </button>

                {/* Search Button */}
                <button
                    onClick={handleSearch}
                    className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg 
            font-semibold transition-all flex items-center gap-2"
                >
                    <span>🔍</span>
                    {isAr ? 'بحث' : 'Search'}
                </button>

                {/* Clear Button */}
                {(searchQuery || activeFilterCount > 0) && (
                    <button
                        onClick={clearAllFilters}
                        className="px-4 py-3 bg-red-500 hover:bg-red-600 text-white rounded-lg 
              font-semibold transition-all"
                        title={isAr ? 'مسح الكل' : 'Clear All'}
                    >
                        ✖️
                    </button>
                )}
            </div>

            {/* Advanced Filters Panel */}
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700"
                    >
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {/* Date Range */}
                            {showDateRange && (
                                <>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            {isAr ? 'من تاريخ' : 'From Date'}
                                        </label>
                                        <DatePicker
                                            selected={dateRange.start}
                                            onChange={(date) => setDateRange(prev => ({ ...prev, start: date }))}
                                            selectsStart
                                            startDate={dateRange.start}
                                            endDate={dateRange.end}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 
                        rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            placeholderText={isAr ? 'اختر التاريخ' : 'Select date'}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                            {isAr ? 'إلى تاريخ' : 'To Date'}
                                        </label>
                                        <DatePicker
                                            selected={dateRange.end}
                                            onChange={(date) => setDateRange(prev => ({ ...prev, end: date }))}
                                            selectsEnd
                                            startDate={dateRange.start}
                                            endDate={dateRange.end}
                                            minDate={dateRange.start}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 
                        rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            placeholderText={isAr ? 'اختر التاريخ' : 'Select date'}
                                        />
                                    </div>
                                </>
                            )}

                            {/* Dynamic Filters */}
                            {filters.map((filter) => (
                                <div key={filter.name}>
                                    <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                        {filter.label}
                                    </label>
                                    {filter.type === 'select' ? (
                                        <select
                                            value={activeFilters[filter.name] || ''}
                                            onChange={(e) => handleFilterChange(filter.name, e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 
                        rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        >
                                            <option value="">{isAr ? 'الكل' : 'All'}</option>
                                            {filter.options?.map(option => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </select>
                                    ) : filter.type === 'checkbox' ? (
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                checked={activeFilters[filter.name] || false}
                                                onChange={(e) => handleFilterChange(filter.name, e.target.checked)}
                                                className="w-4 h-4 rounded border-gray-300 text-green-600 
                          focus:ring-green-500"
                                            />
                                            <span className="text-sm text-gray-700 dark:text-gray-300">
                                                {filter.label}
                                            </span>
                                        </label>
                                    ) : (
                                        <input
                                            type={filter.type || 'text'}
                                            value={activeFilters[filter.name] || ''}
                                            onChange={(e) => handleFilterChange(filter.name, e.target.value)}
                                            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 
                        rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            placeholder={filter.placeholder}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Saved Filters */}
                        {savedFilters.length > 0 && (
                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    {isAr ? 'فلاتر محفوظة:' : 'Saved Filters:'}
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    {savedFilters.map((saved, index) => (
                                        <button
                                            key={index}
                                            onClick={() => {
                                                setActiveFilters(saved.filters)
                                                setSearchQuery(saved.query || '')
                                            }}
                                            className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 
                        rounded-full text-sm font-semibold hover:bg-blue-200 dark:hover:bg-blue-800 
                        transition-all"
                                        >
                                            {saved.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Save Current Filter */}
                        {onSaveFilter && activeFilterCount > 0 && (
                            <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                <button
                                    onClick={() => onSaveFilter({ query: searchQuery, filters: activeFilters })}
                                    className="text-sm text-green-600 dark:text-green-400 hover:underline font-semibold"
                                >
                                    💾 {isAr ? 'حفظ هذه الفلترة' : 'Save this filter'}
                                </button>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Active Filter Chips */}
            {Object.keys(activeFilters).filter(key => activeFilters[key]).length > 0 && (
                <div className="flex flex-wrap gap-2">
                    {Object.entries(activeFilters)
                        .filter(([_, value]) => value)
                        .map(([key, value]) => (
                            <motion.div
                                key={key}
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="px-3 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 
                  rounded-full text-sm font-semibold flex items-center gap-2"
                            >
                                <span>{filters.find(f => f.name === key)?.label}: {typeof value === 'boolean' ? '✓' : value}</span>
                                <button
                                    onClick={() => handleFilterChange(key, '')}
                                    className="hover:text-red-600"
                                >
                                    ✕
                                </button>
                            </motion.div>
                        ))}
                </div>
            )}
        </div>
    )
}
