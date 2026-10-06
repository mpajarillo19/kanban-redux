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
              className="flex items-center gap-1 rounded-md px-2 py-1.5 text-sm text-red-600 transition hover:bg-red-50"
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
              className="rounded-md px-3 py-1.5 text-sm text-slate-600 transition hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="column-form"
              className="rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </div>
      }
    >
      <form id="column-form" onSubmit={handleSubmit}>
        <label className="block">
          <span className="mb-1 block text-sm font-medium text-slate-700">Column title</span>
          <input
            type="text"
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none"
            placeholder="To Do"
            autoFocus
          />
        </label>
      </form>
    </Modal>
  )
}
