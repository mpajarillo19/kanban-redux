import { useEffect, useRef, useState } from 'react'
import { useSelector } from 'react-redux'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import TaskModal from './TaskModal'

const LABEL_STYLES = [
  'text-label-indigo bg-label-indigo/15',
  'text-label-emerald bg-label-emerald/15',
  'text-label-violet bg-label-violet/15',
  'text-label-amber bg-label-amber/15',
  'text-label-rose bg-label-rose/15',
  'text-label-sky bg-label-sky/15',
]

const labelStyle = (label) => {
  let hash = 0
  for (let i = 0; i < label.length; i++) hash = (hash + label.charCodeAt(i)) % LABEL_STYLES.length
  return LABEL_STYLES[hash]
}

const initials = (name) =>
  name
    .trim()
    .split(/\s+/)
    .map((word) => word[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

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

  const transformString = CSS.Transform.toString(transform)
  const style = {
    transform: transformString ? `${transformString}${isDragging ? ' rotate(2deg)' : ''}` : undefined,
    transition,
  }

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        {...listeners}
        onClick={() => {
          if (!wasDraggingRef.current) setEditing(true)
          wasDraggingRef.current = false
        }}
        className={`flex cursor-grab flex-col rounded-lg border px-3 py-2.5 transition duration-150 active:cursor-grabbing ${
          isDragging
            ? 'border-accent/40 bg-surface-raised shadow-lg'
            : 'border-border bg-background hover:border-border-strong hover:bg-surface hover:shadow-sm'
        }`}
      >
        {task.labels?.length > 0 && (
          <div className="mb-2 flex flex-wrap gap-1">
            {task.labels.map((label) => (
              <span
                key={label}
                className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${labelStyle(label)}`}
              >
                <span className="size-1.5 rounded-full bg-current" />
                {label}
              </span>
            ))}
          </div>
        )}
        <p className="text-sm font-medium break-words leading-snug text-primary">{task.title}</p>
        {task.description && (
          <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-muted">{task.description}</p>
        )}
        {task.assignee && (
          <div className="mt-2.5 flex items-center gap-1.5">
            <span className="grid size-5 shrink-0 place-items-center rounded-full bg-accent/15 text-[9px] font-semibold text-accent-text uppercase">
              {initials(task.assignee)}
            </span>
            <span className="truncate text-xs text-muted">{task.assignee}</span>
          </div>
        )}
      </div>
      {editing && <TaskModal task={task} columnId={columnId} onClose={() => setEditing(false)} />}
    </>
  )
}
