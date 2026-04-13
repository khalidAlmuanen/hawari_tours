// ═══════════════════════════════════════════════════════════════
// 📤📥 EXPORT/IMPORT UTILITIES
// أدوات التصدير والاستيراد
// ═══════════════════════════════════════════════════════════════

import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'

// ═══════════════════════════════════════════════════════════════
// EXPORT FUNCTIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Export data to CSV format
 */
export function exportToCSV(data, filename = 'export.csv') {
    if (!data || data.length === 0) {
        alert('No data to export')
        return
    }

    const worksheet = XLSX.utils.json_to_sheet(data)
    const csv = XLSX.utils.sheet_to_csv(worksheet)

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    saveAs(blob, filename)
}

/**
 * Export data to Excel format
 */
export function exportToExcel(data, filename = 'export.xlsx', sheetName = 'Data') {
    if (!data || data.length === 0) {
        alert('No data to export')
        return
    }

    const worksheet = XLSX.utils.json_to_sheet(data)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)

    XLSX.writeFile(workbook, filename)
}

/**
 * Export data to JSON format
 */
export function exportToJSON(data, filename = 'export.json') {
    if (!data) {
        alert('No data to export')
        return
    }

    const json = JSON.stringify(data, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    saveAs(blob, filename)
}

/**
 * Export with format selection
 */
export function exportData(data, format = 'csv', filename) {
    const baseName = filename || `export_${new Date().toISOString().split('T')[0]}`

    switch (format) {
        case 'csv':
            exportToCSV(data, `${baseName}.csv`)
            break
        case 'excel':
        case 'xlsx':
            exportToExcel(data, `${baseName}.xlsx`)
            break
        case 'json':
            exportToJSON(data, `${baseName}.json`)
            break
        default:
            console.error('Unsupported format:', format)
    }
}

// ═══════════════════════════════════════════════════════════════
// IMPORT FUNCTIONS
// ═══════════════════════════════════════════════════════════════

/**
 * Parse CSV file content
 */
export function parseCSV(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = (e) => {
            try {
                const data = e.target.result
                const workbook = XLSX.read(data, { type: 'binary' })
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
                const jsonData = XLSX.utils.sheet_to_json(firstSheet)
                resolve(jsonData)
            } catch (error) {
                reject(error)
            }
        }

        reader.onerror = () => reject(new Error('Failed to read file'))
        reader.readAsBinaryString(file)
    })
}

/**
 * Parse Excel file content
 */
export function parseExcel(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = (e) => {
            try {
                const data = e.target.result
                const workbook = XLSX.read(data, { type: 'array' })
                const firstSheet = workbook.Sheets[workbook.SheetNames[0]]
                const jsonData = XLSX.utils.sheet_to_json(firstSheet)
                resolve(jsonData)
            } catch (error) {
                reject(error)
            }
        }

        reader.onerror = () => reject(new Error('Failed to read file'))
        reader.readAsArrayBuffer(file)
    })
}

/**
 * Parse JSON file content
 */
export function parseJSON(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader()

        reader.onload = (e) => {
            try {
                const jsonData = JSON.parse(e.target.result)
                resolve(Array.isArray(jsonData) ? jsonData : [jsonData])
            } catch (error) {
                reject(new Error('Invalid JSON format'))
            }
        }

        reader.onerror = () => reject(new Error('Failed to read file'))
        reader.readAsText(file)
    })
}

/**
 * Import file with auto-detection
 */
export async function importFile(file) {
    const extension = file.name.split('.').pop().toLowerCase()

    try {
        switch (extension) {
            case 'csv':
                return await parseCSV(file)
            case 'xlsx':
            case 'xls':
                return await parseExcel(file)
            case 'json':
                return await parseJSON(file)
            default:
                throw new Error(`Unsupported file format: ${extension}`)
        }
    } catch (error) {
        console.error('Import error:', error)
        throw error
    }
}

/**
 * Validate imported data
 */
export function validateImportedData(data, requiredFields = []) {
    if (!Array.isArray(data) || data.length === 0) {
        return {
            valid: false,
            error: 'No data found in file',
            data: []
        }
    }

    const errors = []
    const validData = []

    data.forEach((row, index) => {
        const missingFields = requiredFields.filter(field => !row[field])

        if (missingFields.length > 0) {
            errors.push({
                row: index + 1,
                missing: missingFields
            })
        } else {
            validData.push(row)
        }
    })

    return {
        valid: errors.length === 0,
        errors,
        validData,
        totalRows: data.length,
        validRows: validData.length
    }
}

// ═══════════════════════════════════════════════════════════════
// EXPORT FORMATS CONFIG
// ═══════════════════════════════════════════════════════════════
export const EXPORT_FORMATS = [
    { value: 'csv', label: 'CSV', icon: '📄' },
    { value: 'excel', label: 'Excel', icon: '📊' },
    { value: 'json', label: 'JSON', icon: '📋' }
]
