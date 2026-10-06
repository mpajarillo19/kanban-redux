import { createSelector } from '@reduxjs/toolkit'
import { selectActiveBoardId } from './kanbanSlice'

export { selectActiveBoardId }

export const selectBoards = (state) => state.kanban.boards
export const selectBoardList = (state) => Object.values(state.kanban.boards)
export const selectColumns = (state) => state.kanban.columns
export const selectTasks = (state) => state.kanban.tasks
export const selectFilters = (state) => state.kanban.filters

export const selectActiveBoard = createSelector(
  [selectActiveBoardId, selectBoards],
  (activeBoardId, boards) => (activeBoardId ? boards[activeBoardId] ?? null : null),
)

export const selectActiveBoardColumns = createSelector(
  [selectActiveBoard, selectColumns],
  (board, columns) =>
    board ? board.columnIds.map((id) => columns[id]).filter(Boolean) : [],
)

export const selectActiveBoardTasks = createSelector(
  [selectActiveBoardColumns, selectTasks],
  (columns, tasks) =>
    columns.flatMap((column) =>
      column.taskIds.map((id) => tasks[id]).filter(Boolean),
    ),
)

const matchesFilters = (task, filters) => {
  if (filters.label && !(task.labels ?? []).includes(filters.label)) return false
  if (filters.assignee && task.assignee !== filters.assignee) return false
  return true
}

export const selectFilteredTaskIdsByColumn = createSelector(
  [selectActiveBoardColumns, selectTasks, selectFilters],
  (columns, tasks, filters) => {
    const result = {}
    for (const column of columns) {
      result[column.id] = column.taskIds.filter((id) => {
        const task = tasks[id]
        return task ? matchesFilters(task, filters) : false
      })
    }
    return result
  },
)

export const selectFiltersActive = createSelector(
  [selectFilters],
  (filters) => Boolean(filters.label || filters.assignee),
)

export const selectLabelOptions = createSelector(
  [selectActiveBoardTasks],
  (tasks) => {
    const labels = new Set()
    for (const task of tasks) for (const label of task.labels ?? []) labels.add(label)
    return [...labels].sort()
  },
)

export const selectAssigneeOptions = createSelector(
  [selectActiveBoardTasks],
  (tasks) => {
    const assignees = new Set()
    for (const task of tasks) if (task.assignee) assignees.add(task.assignee)
    return [...assignees].sort()
  },
)
