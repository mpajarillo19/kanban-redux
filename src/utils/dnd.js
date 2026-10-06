export const findColumnOfTask = (state, taskId) => {
  for (const column of Object.values(state.kanban.columns)) {
    if (column.taskIds.includes(taskId)) return column.id
  }
  return null
}

export const taskIndexInColumn = (state, columnId, taskId) =>
  state.kanban.columns[columnId]?.taskIds.indexOf(taskId) ?? -1

export const columnOfDroppable = (over) => over?.data?.current?.columnId ?? over?.id ?? null
