import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Trash2 } from 'lucide-react'
import { addTask, deleteTask, editTask } from '../store/kanbanSlice'
import Modal from './Modal'

export default function TaskModal({ task, columnId, onClose }) {
  const dispatch = useDispatch()
  const isEditing = Boolean(task)
  const [title, setTitle] = useState(task?.title ?? '')
  const [description, setDescription] = useState(task?.description ?? '')
  const [labels, setLabels] = useState((task?.labels ?? []).join(', '))
  const [assignee, setAssignee] = useState(task?.assignee ?? '')

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!title.trim()) return
    const payload = {
      title: title.trim(),
      description: description.trim(),
      labels: labels
        .split(',')
        .map((label) => label.trim())
        .filter(Boolean),
      assignee: assignee.trim(),
    }
    if (isEditing) {
      dispatch(editTask({ id: task.id, ...payload }))
    } else {
      dispatch(addTask({ columnId, ...payload }))
    }
    onClose()
  }

  return (
    <Modal
      title={isEditing ? 'Edit task' : 'Add task'}
      onClose={onClose}
      footer={
        <div className="mt-4 flex items-center justify-between">
          {isEditing ? (
            <button
              type="button"
              onClick={() => {
                dispatch(deleteTask(task.id))
                onClose()
              }}
              className="flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm text-danger transition hover:bg-danger/10"
            >
              <Trash2 size={15} /> Delete
            </button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md px-3 py-1.5 text-sm text-secondary transition hover:bg-hover hover:text-primary"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="task-form"
              className="rounded-md bg-accent px-3.5 py-1.5 text-sm font-medium text-accent-contrast transition hover:bg-accent-hover"
            >
              Save
            </button>
          </div>
        </div>
      }
    >
      <form id="task-form" onSubmit={handleSubmit} className="space-y-3.5">
        <label className="block">
          <span className="mb-1.5 block text-[13px] font-medium text-secondary">Title</span>
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-primary transition hover:border-border-strong placeholder:text-muted focus:border-accent/60 focus:outline-none"
            placeholder="Task title"
            autoFocus
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[13px] font-medium text-secondary">Description</span>
          <textarea
            value={description}
            onChange={(event) => setDescription(event.target.value)}
            rows={3}
            className="w-full resize-y rounded-md border border-border bg-background px-3 py-2 text-sm text-primary transition hover:border-border-strong placeholder:text-muted focus:border-accent/60 focus:outline-none"
            placeholder="Details, steps, links…"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[13px] font-medium text-secondary">Labels (comma-separated)</span>
          <input
            type="text"
            value={labels}
            onChange={(event) => setLabels(event.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-primary transition hover:border-border-strong placeholder:text-muted focus:border-accent/60 focus:outline-none"
            placeholder="frontend, urgent"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-[13px] font-medium text-secondary">Assignee</span>
          <input
            type="text"
            value={assignee}
            onChange={(event) => setAssignee(event.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-primary transition hover:border-border-strong placeholder:text-muted focus:border-accent/60 focus:outline-none"
            placeholder="Alice"
          />
        </label>
      </form>
    </Modal>
  )
}
