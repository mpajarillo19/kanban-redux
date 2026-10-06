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
    <aside className="flex w-56 shrink-0 flex-col border-r border-border bg-surface p-3">
      <div className="mb-5 flex items-center gap-2 px-2">
        <span className="grid size-7 place-items-center rounded-md bg-accent text-accent-contrast">
          <LayoutGrid size={14} />
        </span>
        <h1 className="text-sm font-semibold tracking-tight text-primary">Kanban</h1>
      </div>
      <p className="mb-1.5 px-2 text-[11px] font-medium tracking-wider text-muted uppercase">Boards</p>
      <nav className="flex-1 space-y-0.5 overflow-y-auto">
        {boards.length === 0 && (
          <p className="px-2 py-3 text-[13px] text-muted">No boards yet.</p>
        )}
        {boards.map((board) => (
          <div
            key={board.id}
            className={`group relative flex items-center justify-between rounded-md px-2 py-1.5 text-[13px] transition ${
              board.id === activeBoardId
                ? 'bg-accent-subtle font-medium text-accent-text'
                : 'text-secondary hover:bg-hover hover:text-primary'
            }`}
          >
            {board.id === activeBoardId && (
              <span className="absolute top-1/2 left-0 h-4 w-0.5 -translate-y-1/2 rounded-full bg-accent" />
            )}
            {editingId === board.id ? (
              <form onSubmit={handleEditSubmit} className="flex-1">
                <input
                  type="text"
                  value={editTitle}
                  onChange={(event) => setEditTitle(event.target.value)}
                  onBlur={handleEditSubmit}
                  className="w-full rounded border border-border bg-background px-1.5 py-0.5 text-[13px] text-primary focus:outline-none"
                  autoFocus
                />
              </form>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => dispatch(setActiveBoard(board.id))}
                  className="min-w-0 flex-1 truncate text-left"
                >
                  {board.title}
                </button>
                <span className="flex gap-0.5 opacity-0 transition group-hover:opacity-100 group-focus-within:opacity-100">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingId(board.id)
                      setEditTitle(board.title)
                    }}
                    className="rounded p-1 text-muted transition hover:bg-hover hover:text-secondary"
                    aria-label={`Rename ${board.title}`}
                    title={`Rename ${board.title}`}
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
                    className="rounded p-1 text-muted transition hover:bg-hover hover:text-danger"
                    aria-label={`Delete ${board.title}`}
                    title={`Delete ${board.title}`}
                  >
                    <Trash2 size={13} />
                  </button>
                </span>
              </>
            )}
          </div>
        ))}
      </nav>
      <form onSubmit={handleAdd} className="mt-3 flex gap-1.5">
        <input
          id="new-board-input"
          type="text"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="New board…"
          className="min-w-0 w-full rounded-md border border-border bg-background px-2.5 py-1.5 text-[13px] text-primary transition hover:border-border-strong placeholder:text-muted focus:border-accent/60 focus:outline-none"
        />
        <button
          type="submit"
          className="rounded-md bg-accent p-1.5 text-accent-contrast transition hover:bg-accent-hover"
          aria-label="Add board"
          title="Add board"
        >
          <Plus size={16} />
        </button>
      </form>
    </aside>
  )
}
