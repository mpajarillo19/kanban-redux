import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import TaskModal from './TaskModal'

const LABEL_COLORS = ['bg-blue-100 text-blue-700', 'bg-green-100 text-green-700', 'bg-purple-100 text-purple-700', 'bg-amber-100 text-amber-700', 'bg-rose-100 text-rose-700']

const labelColor = (label) => {
  let hash = 0
  for (let i = 0; i < label.length; i++) hash = (hash + label.charCodeAt(i)) % LABEL_COLORS.length
  return LABEL_COLORS[hash]
}

export default function TaskCard({ taskId, columnId }) {
  const task = useSelector((state) => state.kanban.tasks[taskId])
  const [editing, setEditing] = useState(false)
  const wasDraggingRef = useRef(false)
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: taskId,
    data: { type: 'task', columnId },
  })

  useEffect(() => {
    if (isDragging) wasDraggingRef.current = true
  }, [isDragging])

  if (!task) return null

  return (
    <>
      <div
        ref={setNodeRef}
        style={{ transform: CSS.Transform.toString(transform), transition }}
        {...attributes}
        {...listeners}
        onClick={() => {
          if (!wasDraggingRef.current) setEditing(true)
          wasDraggingRef.current = false
        }}
        className={`cursor-grab rounded-lg border border-slate-200 bg-white p-3 shadow-sm transition hover:shadow-md active:cursor-grabbing ${isDragging ? 'opacity-60' : ''}`}
      >
        {task.labels?.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1">
            {task.labels.map((label) => (
              <span key={label} className={`rounded-full px-2 py-0.5 text-xs font-medium ${labelColor(label)}`}>
                {label}
              </span>
            ))}
          </div>
        )}
        <p className="text-sm font-medium text-slate-800">{task.title}</p>
        {task.assignee && (
          <p className="mt-2 text-xs text-slate-500">{task.assignee}</p>
        )}
      </div>
      {editing && <TaskModal task={task} columnId={columnId} onClose={() => setEditing(false)} />}
    </>
  )
}
