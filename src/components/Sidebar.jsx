import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { LayoutGrid, Pencil, Plus, Trash2 } from 'lucide-react'
import {
  addBoard,
  deleteBoard,
  editBoard,
  setActiveBoard,
} from '../store/kanbanSlice'
import { selectActiveBoardId, selectBoardList } from '../store/selectors'

export default function Sidebar() {
  const dispatch = useDispatch()
  const boards = useSelector(selectBoardList)
  const activeBoardId = useSelector(selectActiveBoardId)
  const [title, setTitle] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editTitle, setEditTitle] = useState('')

  const handleAdd = (event) => {
    event.preventDefault()
    if (!title.trim()) return
    dispatch(addBoard(title.trim()))
    setTitle('')
  }

  const handleEditSubmit = (event) => {
    event.preventDefault()
    if (editTitle.trim()) dispatch(editBoard({ id: editingId, title: editTitle.trim() }))
    setEditingId(null)
  }

  return (
    <aside className="flex w-60 shrink-0 flex-col bg-slate-800 p-3 text-slate-100">
      <div className="mb-4 flex items-center gap-2 px-2">
        <LayoutGrid size={18} className="text-blue-400" />
        <h1 className="text-base font-bold">Kanban</h1>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto">
        {boards.length === 0 && (
          <p className="px-2 py-4 text-sm text-slate-400">No boards yet.</p>
        )}
        {boards.map((board) => (
          <div
            key={board.id}
            className={`group flex items-center justify-between rounded-lg px-2 py-1.5 text-sm transition ${
              board.id === activeBoardId
                ? 'bg-blue-600 text-white'
                : 'text-slate-300 hover:bg-slate-700'
            }`}
          >
            {editingId === board.id ? (
              <form onSubmit={handleEditSubmit} className="flex-1">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(event) => setEditTitle(event.target.value)}
                  onBlur={handleEditSubmit}
                  className="w-full rounded bg-slate-900 px-1 py-0.5 text-sm text-white focus:outline-none"
                  autoFocus
                />
              </form>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => dispatch(setActiveBoard(board.id))}
                  className="flex-1 truncate text-left"
                >
                  {board.title}
                </button>
                <span className="flex gap-0.5 opacity-0 transition group-hover:opacity-100">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(board.id)
                      setEditTitle(board.title)
                    }}
                    className="rounded p-1 hover:bg-slate-600"
                    aria-label={`Rename ${board.title}`}
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Delete board "${board.title}" and all its tasks?`)) {
                        dispatch(deleteBoard(board.id))
                      }
                    }}
                    className="rounded p-1 hover:bg-slate-600"
                    aria-label={`Delete ${board.title}`}
                  >
                    <Trash2 size={13} />
                  </button>
                </span>
              </>
            )}
          </div>
        ))}
      </nav>
      <form onSubmit={handleAdd} className="mt-3 flex gap-1">
        <input
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="New board…"
          className="w-full rounded-lg bg-slate-700 px-2 py-1.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-blue-400"
        />
        <button
          type="submit"
          className="rounded-lg bg-blue-600 p-1.5 text-white transition hover:bg-blue-500"
          aria-label="Add board"
        >
          <Plus size={16} />
        </button>
      </form>
    </aside>
  )
}
