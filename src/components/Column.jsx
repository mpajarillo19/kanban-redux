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
    <section className="flex w-72 shrink-0 flex-col rounded-xl bg-slate-200/70 p-2">
      <header className="mb-2 flex items-center justify-between px-1">
        <h3 className="text-sm font-semibold text-slate-700">
          {column.title}
          <span className="ml-2 text-xs font-normal text-slate-500">{visibleTaskIds.length}</span>
          {filtersActive && hiddenCount > 0 && (
            <span className="ml-1 text-xs text-slate-400">({hiddenCount} hidden)</span>
          )}
        </h3>
        <button
          type="button"
          onClick={() => setEditingColumn(true)}
          className="rounded-md p-1 text-slate-500 transition hover:bg-slate-300/60 hover:text-slate-700"
          aria-label={`Edit ${column.title}`}
        >
          <Pencil size={14} />
        </button>
      </header>
      <div
        ref={setNodeRef}
        className={`flex min-h-24 flex-1 flex-col gap-2 rounded-lg p-1 transition ${isOver ? 'bg-blue-100/60' : ''}`}
      >
        <SortableContext items={visibleTaskIds} strategy={verticalListSortingStrategy}>
          {visibleTaskIds.map((taskId) => (
            <TaskCard key={taskId} taskId={taskId} columnId={column.id} />
          ))}
        </SortableContext>
        {visibleTaskIds.length === 0 && (
          <p className="px-2 py-4 text-center text-xs text-slate-400">
            {filtersActive && hiddenCount > 0 ? 'All tasks hidden by filters' : 'No tasks'}
          </p>
        )}
      </div>
      <button
        type="button"
        onClick={() => setAddingTask(true)}
        className="mt-2 flex items-center gap-1 rounded-lg px-2 py-1.5 text-sm text-slate-500 transition hover:bg-slate-300/60 hover:text-slate-700"
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
