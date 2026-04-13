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

    // Add BOM (\uFEFF) to fix Arabic encoding in Excel
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
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

    // Auto-size columns based on the longest string in each column
    const colWidths = Object.keys(data[0] || {}).map(key => ({
        wch: Math.max(
            key.length,
            ...data.map(row => (row[key] ? row[key].toString().length : 0))
        ) + 5
    }))
    worksheet['!cols'] = colWidths

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
 * Premium Export to Print / PDF
 */
export function exportToPrint(data, filename) {
    if (!data || data.length === 0) {
        alert('No data to export')
        return
    }

    const keys = Object.keys(data[0])
    const printWindow = window.open('', '_blank', 'width=1200,height=800')

    if (!printWindow) {
        alert('يرجى السماح بالنوافذ المنبثقة (Pop-ups) لفتح تقرير الطباعة.')
        return
    }

    const html = `
    <!DOCTYPE html>
    <html dir="rtl" lang="ar">
    <head>
        <meta charset="UTF-8">
        <title>${filename} - حواري تورز</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@400;600;700;900&display=swap" rel="stylesheet">
        <style>
            body { font-family: 'Cairo', sans-serif; background-color: #f8fafc; padding: 40px; }
            @media print {
                body { background-color: white; padding: 0; }
                .no-print { display: none !important; }
                .print-container { padding: 20px; box-shadow: none; }
                table { page-break-inside: auto; }
                tr { page-break-inside: avoid; page-break-after: auto; }
            }
        </style>
    </head>
    <body class="text-slate-800">
        <div class="print-container max-w-7xl mx-auto bg-white p-10 rounded-3xl shadow-2xl">
            
            <div class="flex justify-between items-start mb-10 border-b-2 border-slate-100 pb-8">
                <div>
                    <h1 class="text-4xl font-black text-emerald-600 mb-2">Hawari Tours</h1>
                    <h2 class="text-2xl font-bold text-slate-800">تقرير بيانات النظام المتقدم</h2>
                    <p class="text-slate-500 mt-2 font-semibold">
                        تاريخ الإصدار: ${new Date().toLocaleDateString('ar-SA', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                </div>
                <div class="text-left">
                    <button onclick="window.print()" class="no-print bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-3 rounded-xl font-bold transition-all shadow-lg hover:shadow-xl flex items-center gap-2">
                        <span>طباعة / حفظ كـ PDF</span>
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"></path></svg>
                    </button>
                    <div class="mt-4 text-slate-400 font-semibold text-sm mr-2">${filename}</div>
                </div>
            </div>

            <div class="overflow-x-auto rounded-2xl border border-slate-200">
                <table class="w-full text-right border-collapse">
                    <thead>
                        <tr class="bg-slate-50 border-b border-slate-200">
                            ${keys.map(key => `<th class="px-6 py-4 text-sm font-black text-slate-700 whitespace-nowrap">${key}</th>`).join('')}
                        </tr>
                    </thead>
                    <tbody class="divide-y divide-slate-100">
                        ${data.map((row, i) => `
                            <tr class="${i % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'} hover:bg-emerald-50 transition-colors">
                                ${keys.map(key => {
        let cellData = row[key];
        if (cellData === null || cellData === undefined || cellData === '') cellData = '-';
        if (typeof cellData === 'boolean') cellData = cellData ? 'نعم' : 'لا';
        return `
                                    <td class="px-6 py-4 text-sm font-semibold text-slate-600">
                                        ${String(cellData).replace(/\n/g, '<br>')}
                                    </td>
                                `}).join('')}
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            
            <div class="mt-10 pt-8 border-t-2 border-slate-100 flex justify-between items-center text-sm font-bold text-slate-400">
                <div>إجمالي السجلات: ${data.length}</div>
                <div>تم التصدير الآمن بواسطة بوابة <b>Hawari Tours</b></div>
            </div>
        </div>
    </body>
    </html>
    `

    printWindow.document.open()
    printWindow.document.write(html)
    printWindow.document.close()
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
        case 'print':
        case 'pdf':
            exportToPrint(data, baseName)
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
    { value: 'print', label: 'PDF / طباعة', icon: '🖨️' },
    { value: 'excel', label: 'Excel (XLSX)', icon: '📊' },
    { value: 'csv', label: 'CSV (يعمل مع العربية)', icon: '📄' },
    { value: 'json', label: 'JSON Data', icon: '📋' }
]
