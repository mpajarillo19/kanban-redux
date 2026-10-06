import { useState } from 'react'
import { useSelector } from 'react-redux'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { Pencil, Plus } from 'lucide-react'
import ColumnModal from './ColumnModal'
import TaskCard from './TaskCard'
import TaskModal from './TaskModal'

export default function Column({ column, boardId, visibleTaskIds }) {
  const filtersActive = useSelector((state) => Boolean(state.kanban.filters.label || state.kanban.filters.assignee))
  const [editingColumn, setEditingColumn] = useState(false)
  const [addingTask, setAddingTask] = useState(false)
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: { type: 'column', columnId: column.id },
  })

  const hiddenCount = column.taskIds.length - visibleTaskIds.length

  return (
    <section className="flex w-72 shrink-0 flex-col rounded-xl border border-border bg-surface p-2">
      <header className="group mb-2 flex items-center justify-between gap-1 px-1 py-0.5">
        <h3 className="flex min-w-0 items-center gap-2 text-[13px] font-semibold tracking-tight text-primary">
          <span className="truncate">{column.title}</span>
          <span className="shrink-0 rounded-full bg-surface-muted px-1.5 py-0.5 text-[11px] font-medium tabular-nums text-muted">
            {visibleTaskIds.length}
          </span>
          {filtersActive && hiddenCount > 0 && (
            <span className="shrink-0 text-[11px] font-normal text-muted">({hiddenCount} hidden)</span>
          )}
        </h3>
        <button
          type="button"
          onClick={() => setEditingColumn(true)}
          className="rounded-md p-1 text-muted opacity-0 transition group-hover:opacity-100 focus-visible:opacity-100 hover:bg-hover hover:text-secondary"
          aria-label={`Edit ${column.title}`}
          title={`Edit ${column.title}`}
        >
          <Pencil size={14} />
        </button>
      </header>
      <div
        ref={setNodeRef}
        className={`flex min-h-24 flex-1 flex-col gap-2 rounded-lg p-1 transition-colors duration-150 ${
          isOver ? 'bg-accent-subtle/70 ring-1 ring-accent/30 ring-inset' : ''
        }`}
      >
        <SortableContext items={visibleTaskIds} strategy={verticalListSortingStrategy}>
          {visibleTaskIds.map((taskId) => (
            <TaskCard key={taskId} taskId={taskId} columnId={column.id} />
          ))}
        </SortableContext>
        {visibleTaskIds.length === 0 && (
          <p className="px-2 py-5 text-center text-xs text-muted">
            {filtersActive && hiddenCount > 0 ? 'All tasks hidden by filters' : 'No tasks yet'}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={() => setAddingTask(true)}
        className="mt-1.5 flex w-full items-center gap-1.5 rounded-lg px-2 py-1.5 text-sm text-muted transition hover:bg-hover hover:text-secondary"
      >
        <Plus size={15} /> Add task
      </button>
      {editingColumn && (
        <ColumnModal
          column={column}
          boardId={boardId}
          onClose={() => setEditingColumn(false)}
        />
      )}
      {addingTask && <TaskModal columnId={column.id} onClose={() => setAddingTask(false)} />}
    </section>
  )
}
