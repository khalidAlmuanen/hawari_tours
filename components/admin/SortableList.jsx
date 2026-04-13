// ═══════════════════════════════════════════════════════════════
// 🎯 DRAG & DROP - Sortable List Component
// مكون السحب والإفلات للترتيب
// ═══════════════════════════════════════════════════════════════

import { useState } from 'react'
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    DragOverlay
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    useSortable,
    verticalListSortingStrategy
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { motion } from 'framer-motion'

// ═══════════════════════════════════════════════════════════════
// SORTABLE ITEM
// ═══════════════════════════════════════════════════════════════
export function SortableItem({ id, children, handle = false }) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging
    } = useSortable({ id })

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1
    }

    return (
        <div ref={setNodeRef} style={style}>
            {handle ? (
                <div className="flex items-center gap-3">
                    <button
                        {...attributes}
                        {...listeners}
                        className="cursor-grab active:cursor-grabbing p-2 hover:bg-gray-100 
              dark:hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                d="M4 8h16M4 16h16" />
                        </svg>
                    </button>
                    <div className="flex-1">{children}</div>
                </div>
            ) : (
                <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
                    {children}
                </div>
            )}
        </div>
    )
}

// ═══════════════════════════════════════════════════════════════
// SORTABLE LIST
// ═══════════════════════════════════════════════════════════════
export default function SortableList({
    items,
    onReorder,
    renderItem,
    handle = true,
    autoSave = false,
    onAutoSave,
    showIndicator = true,
    className = ''
}) {
    const [activeId, setActiveId] = useState(null)
    const [hasChanges, setHasChanges] = useState(false)

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates
        })
    )

    function handleDragStart(event) {
        setActiveId(event.active.id)
    }

    function handleDragEnd(event) {
        const { active, over } = event

        if (active.id !== over?.id) {
            const oldIndex = items.findIndex(item => item.id === active.id)
            const newIndex = items.findIndex(item => item.id === over.id)

            const newItems = arrayMove(items, oldIndex, newIndex)
            onReorder(newItems)
            setHasChanges(true)

            // Auto-save after reorder
            if (autoSave && onAutoSave) {
                setTimeout(() => {
                    onAutoSave(newItems)
                    setHasChanges(false)
                }, 500)
            }
        }

        setActiveId(null)
    }

    const activeItem = items.find(item => item.id === activeId)

    return (
        <div className={className}>
            {/* Unsaved Changes Indicator */}
            {showIndicator && hasChanges && !autoSave && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 
            dark:border-yellow-700 rounded-lg text-yellow-700 dark:text-yellow-400 
            text-sm flex items-center gap-2"
                >
                    <span>⚠️</span>
                    Order changed. Don&apos;t forget to save!
                </motion.div>
            )}

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragStart={handleDragStart}
                onDragEnd={handleDragEnd}
            >
                <SortableContext items={items} strategy={verticalListSortingStrategy}>
                    <div className="space-y-3">
                        {items.map((item) => (
                            <SortableItem key={item.id} id={item.id} handle={handle}>
                                {renderItem(item)}
                            </SortableItem>
                        ))}
                    </div>
                </SortableContext>

                <DragOverlay>
                    {activeItem ? (
                        <div className="opacity-75 scale-105">
                            {renderItem(activeItem)}
                        </div>
                    ) : null}
                </DragOverlay>
            </DndContext>
        </div>
    )
}

// ═══════════════════════════════════════════════════════════════
// DRAG HANDLE COMPONENT
// ═══════════════════════════════════════════════════════════════
export function DragHandle({ className = '' }) {
    return (
        <div className={`cursor-grab active:cursor-grabbing ${className}`}>
            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
            </svg>
        </div>
    )
}
