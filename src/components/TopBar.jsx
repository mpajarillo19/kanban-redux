import { useDispatch, useSelector } from 'react-redux'
import { X } from 'lucide-react'
import { setFilters } from '../store/kanbanSlice'
import {
  selectActiveBoard,
  selectAssigneeOptions,
  selectFilters,
  selectFiltersActive,
  selectLabelOptions,
} from '../store/selectors'

const selectClass =
  'rounded-md border border-slate-300 bg-white px-2 py-1 text-sm text-slate-700 focus:border-blue-500 focus:outline-none'

export default function TopBar() {
  const dispatch = useDispatch()
  const board = useSelector(selectActiveBoard)
  const filters = useSelector(selectFilters)
  const filtersActive = useSelector(selectFiltersActive)
  const labelOptions = useSelector(selectLabelOptions)
  const assigneeOptions = useSelector(selectAssigneeOptions)

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3">
      <h2 className="text-lg font-semibold text-slate-800">
        {board ? board.title : 'Kanban'}
      </h2>
      <div className="flex items-center gap-2">
        <select
          value={filters.label ?? ''}
          onChange={(event) => dispatch(setFilters({ label: event.target.value || null }))}
          className={selectClass}
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
          className={selectClass}
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
            className="flex items-center gap-1 rounded-md px-2 py-1 text-sm text-slate-500 transition hover:bg-slate-100 hover:text-slate-700"
          >
            <X size={14} /> Clear
          </button>
        )}
      </div>
    </header>
  )
}
