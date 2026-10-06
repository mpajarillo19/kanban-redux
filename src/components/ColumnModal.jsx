import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { Trash2 } from 'lucide-react'
import { addColumn, deleteColumn, editColumn } from '../store/kanbanSlice'
import Modal from './Modal'

export default function ColumnModal({ column, boardId, onClose }) {
  const dispatch = useDispatch()
  const isEditing = Boolean(column)
  const [title, setTitle] = useState(column?.title ?? '')

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!title.trim()) return
    if (isEditing) {
      dispatch(editColumn({ id: column.id, title: title.trim() }))
    } else {
      dispatch(addColumn({ boardId, title: title.trim() }))
    }
    onClose()
  }

  return (
    <Modal
      title={isEditing ? 'Edit column' : 'Add column'}
      onClose={onClose}
      footer={
        <div className="mt-4 flex items-center justify-between">
          {isEditing ? (
            <button
              type="button"
              onClick={() => {
                dispatch(deleteColumn(column.id))
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
              form="column-form"
              className="rounded-md bg-accent px-3.5 py-1.5 text-sm font-medium text-accent-contrast transition hover:bg-accent-hover"
            >
              Save
            </button>
          </div>
        </div>
      }
    >
      <form id="column-form" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-1.5 block text-[13px] font-medium text-secondary">Column title</span>
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-primary transition hover:border-border-strong placeholder:text-muted focus:border-accent/60 focus:outline-none"
            placeholder="To Do"
            autoFocus
          />
        </label>
      </form>
    </Modal>
  )
}
