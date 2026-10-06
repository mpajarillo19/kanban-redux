import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Moon, Sun, X } from 'lucide-react'
import { setFilters } from '../store/kanbanSlice'
import {
  selectActiveBoard,
  selectAssigneeOptions,
  selectFilters,
  selectFiltersActive,
  selectLabelOptions,
} from '../store/selectors'

const selectClass = (active) =>
  `rounded-md border bg-surface px-2.5 py-1.5 text-sm transition hover:border-border-strong ${
    active ? 'border-accent/60 font-medium text-primary' : 'border-border text-secondary'
  }`

export default function TopBar() {
  const dispatch = useDispatch()
  const board = useSelector(selectActiveBoard)
  const filters = useSelector(selectFilters)
  const filtersActive = useSelector(selectFiltersActive)
  const labelOptions = useSelector(selectLabelOptions)
  const assigneeOptions = useSelector(selectAssigneeOptions)
  const [dark, setDark] = useState(() => document.documentElement.classList.contains('dark'))

  const handleToggleTheme = () => {
    const next = !dark
    setDark(next)
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('theme', next ? 'dark' : 'light')
  }

  return (
    <header className="flex items-center justify-between gap-4 border-b border-border bg-surface px-6 py-3">
      <h2 className="min-w-0 truncate text-[15px] font-semibold tracking-tight text-primary">
        {board ? board.title : 'Kanban'}
      </h2>
      <div className="flex items-center gap-1.5">
        <select
          value={filters.label ?? ''}
          onChange={(event) => dispatch(setFilters({ label: event.target.value || null }))}
          className={selectClass(Boolean(filters.label))}
          aria-label="Filter by label"
        >
          <option value="">All labels</option>
          {labelOptions.map((label) => (
            <option key={label} value={label}>
              {label}
            </option>
          ))}
        </select>
        <select
          value={filters.assignee ?? ''}
          onChange={(event) => dispatch(setFilters({ assignee: event.target.value || null }))}
          className={selectClass(Boolean(filters.assignee))}
          aria-label="Filter by assignee"
        >
          <option value="">All assignees</option>
          {assigneeOptions.map((assignee) => (
            <option key={assignee} value={assignee}>
              {assignee}
            </option>
          ))}
        </select>
        {filtersActive && (
          <button
            type="button"
            onClick={() => dispatch(setFilters({ label: null, assignee: null }))}
            className="flex items-center gap-1 rounded-md px-2 py-1.5 text-sm text-muted transition hover:bg-hover hover:text-primary"
          >
            <X size={14} /> Clear
          </button>
        )}
        <button
          type="button"
          onClick={handleToggleTheme}
          className="ml-1 rounded-md p-2 text-muted transition hover:bg-hover hover:text-primary"
          aria-label={dark ? 'Switch to light theme' : 'Switch to dark theme'}
          title={dark ? 'Switch to light theme' : 'Switch to dark theme'}
        >
          {dark ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>
    </header>
  )
}
