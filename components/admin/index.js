// ═══════════════════════════════════════════════════════════════
// 📦 UI/UX ENHANCEMENTS - Central Export Index
// مركز تصدير تحسينات واجهة المستخدم
// ═══════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════
// COMPONENTS
// ═══════════════════════════════════════════════════════════════

// 1. Loading & Empty States
export {
  SkeletonLoader,
  SkeletonStatCard,
  SkeletonTableRow,
  SkeletonReviewCard,
  SkeletonCardItem,
  SkeletonForm,
  SkeletonGrid
} from './SkeletonLoader'

export { default as EmptyState, EmptyStates } from './EmptyState'

// 2. Bulk Operations
export {
  useBulkSelection,
  BulkActionsBar,
  BulkCheckbox,
  BulkActionPresets
} from './BulkActions'

// 3. Search & Filters
export { default as AdvancedSearch } from './AdvancedSearch'

// 4. Navigation
export { default as Breadcrumbs, BreadcrumbPresets } from './Breadcrumbs'

// 5. Quick Actions
export { default as QuickActionsMenu, QuickActionsPresets } from './QuickActionsMenu'

// 6. Notifications
export {
  EnhancedToastProvider,
  useEnhancedToast
} from './EnhancedToast'

// 7. Modals
export { default as EnhancedModal } from './EnhancedModal'

// 8. Drag & Drop
export { default as SortableList, SortableItem, DragHandle } from './SortableList'

// 9. Theme
export {
  ThemeProvider,
  useTheme,
  ThemeCustomizer,
  ThemeButton
} from './ThemeCustomizer'

// 10. Inline Editing
export { default as InlineEdit, InlineEditExamples } from './InlineEdit'

// 11. Error Handling
export { ErrorBoundary, NetworkErrorHandler } from './ErrorBoundary'

// 12. Tooltips & Help
export {
  default as Tooltip,
  HelpIcon,
  InfoPopover,
  FieldWithHelp
} from './Tooltip'

// 13. Activity Log
export { default as ActivityLog, createActivity } from './ActivityLog'

// ═══════════════════════════════════════════════════════════════
// UTILITIES
// ═══════════════════════════════════════════════════════════════

// Export/Import
export {
  exportToCSV,
  exportToExcel,
  exportToJSON,
  exportData,
  parseCSV,
  parseExcel,
  parseJSON,
  importFile,
  validateImportedData,
  EXPORT_FORMATS
} from './ExportImport'

// Keyboard Shortcuts
export {
  useKeyboardShortcuts,
  KeyboardShortcutsHelp,
  COMMON_SHORTCUTS
} from './KeyboardShortcuts'

// Performance
export {
  VirtualList,
  LazyImage,
  useDebounce,
  useThrottle,
  createMemoizedComponent,
  useIntersectionObserver,
  usePerformanceMonitor,
  createLazyComponent
} from './PerformanceUtils'

// Responsive
export {
  useMediaQuery,
  useResponsive,
  useWindowSize,
  MobileDrawer,
  ResponsiveContainer,
  useTouchGestures
} from './ResponsiveUtils'

// Accessibility
export {
  useFocusTrap,
  SkipToContent,
  ScreenReaderOnly,
  useLiveRegion,
  LiveRegion,
  useFocusVisible,
  useArrowNavigation,
  ariaLabels,
  checkContrast,
  useReducedMotion
} from './AccessibilityUtils'

// ═══════════════════════════════════════════════════════════════
// QUICK START GUIDE
// ═══════════════════════════════════════════════════════════════

/*

# UI/UX Enhancements - Quick Start

## Installation
```bash
npm install @dnd-kit/core @dnd-kit/sortable react-datepicker react-window xlsx file-saver lucide-react
```

## Setup Providers
Wrap your app with required providers:

```jsx
import { ThemeProvider } from './components/admin/ThemeCustomizer'
import { EnhancedToastProvider } from './components/admin/EnhancedToast'
import { ErrorBoundary } from './components/admin/ErrorBoundary'
import { LiveRegion } from './utils/accessibilityUtils'

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <EnhancedToastProvider>
          <LiveRegion />
          <YourApp />
        </EnhancedToastProvider>
      </ThemeProvider>
    </ErrorBoundary>
  )
}
```

## Usage Examples

### 1. Loading States
```jsx
import { SkeletonStatCard } from './components/admin'

{loading ? <SkeletonStatCard /> : <StatCard data={data} />}
```

### 2. Empty States
```jsx
import { EmptyStates } from './components/admin'

{items.length === 0 && (
  <EmptyStates.NoReviews
    actionLabel="Add Review"
    onAction={() => setShowModal(true)}
  />
)}
```

### 3. Bulk Actions
```jsx
import { useBulkSelection, BulkActionsBar, BulkActionPresets } from './components/admin'

const bulkSelection = useBulkSelection(reviews)

<BulkActionsBar
  selectedCount={bulkSelection.selectedCount}
  onClear={bulkSelection.clearSelection}
  actions={BulkActionPresets.reviews(handleApprove, handleReject, handleDelete)}
/>
```

### 4. Advanced Search
```jsx
import { AdvancedSearch } from './components/admin'

<AdvancedSearch
  onSearch={handleSearch}
  showDateRange={true}
  filters={[
    { name: 'status', label: 'Status', type: 'select', options: [...] },
    { name: 'rating', label: 'Rating', type: 'number' }
  ]}
/>
```

### 5. Export Data
```jsx
import { exportData } from './components/admin'

<button onClick={() => exportData(reviews, 'excel', 'reviews_export')}>
  Export to Excel
</button>
```

### 6. Toast Notifications
```jsx
import { useEnhancedToast } from './components/admin'

const toast = useEnhancedToast()

toast.success('Review approved!')
toast.withUndo('Review deleted', handleUndo)
const progress = toast.progress('Importing...')
progress.update(50)
progress.complete()
```

### 7. Keyboard Shortcuts
```jsx
import { useKeyboardShortcuts, KeyboardShortcutsHelp, COMMON_SHORTCUTS } from './components/admin'

useKeyboardShortcuts({
  'Ctrl+K': () => setShowSearch(true),
  'Ctrl+N': () => setShowNewModal(true)
})

<KeyboardShortcutsHelp shortcuts={COMMON_SHORTCUTS.en} />
```

### 8. Theme Customization
```jsx
import { useTheme, ThemeCustomizer } from './components/admin'

const { theme, updateTheme } = useTheme()

<ThemeCustomizer isOpen={showTheme} onClose={() => setShowTheme(false)} />
```

### 9. Inline Editing
```jsx
import { InlineEdit } from './components/admin'

<InlineEdit
  value={name}
  onSave={(newValue) => updateName(newValue)}
  validation={(val) => val.length > 0 ? null : 'Required'}
/>
```

### 10. Activity Log
```jsx
import { ActivityLog, createActivity } from './components/admin'

const activities = [
  createActivity.create('Admin', 'Review #123'),
  createActivity.approve('Admin', 'Testimonial #45')
]

<ActivityLog activities={activities} />
```

*/
