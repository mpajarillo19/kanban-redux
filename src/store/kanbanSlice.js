import { createSlice } from '@reduxjs/toolkit'
import { nanoid } from 'nanoid'

const initialState = {
  activeBoardId: null,
  boards: {},
  columns: {},
  tasks: {},
  filters: { label: null, assignee: null },
}

const findColumnIndex = (board, columnId) => board.columnIds.indexOf(columnId)

const removeTaskFromColumns = (state, taskId) => {
  for (const column of Object.values(state.columns)) {
    const index = column.taskIds.indexOf(taskId)
    if (index !== -1) column.taskIds.splice(index, 1)
  }
}

const kanbanSlice = createSlice({
  name: 'kanban',
  initialState,
  reducers: {
    addBoard: {
      prepare(title) {
        return { payload: { id: `board-${nanoid()}`, title } }
      },
      reducer(state, { payload }) {
        state.boards[payload.id] = { id: payload.id, title: payload.title, columnIds: [] }
        if (!state.activeBoardId) state.activeBoardId = payload.id
      },
    },
    editBoard(state, { payload: { id, ...changes } }) {
      const board = state.boards[id]
      if (board) Object.assign(board, changes)
    },
    deleteBoard(state, { payload: id }) {
      if (!state.boards[id]) return
      for (const columnId of state.boards[id].columnIds) {
        const column = state.columns[columnId]
        if (!column) continue
        for (const taskId of column.taskIds) delete state.tasks[taskId]
        delete state.columns[columnId]
      }
      delete state.boards[id]
      if (state.activeBoardId === id) {
        state.activeBoardId = Object.keys(state.boards)[0] ?? null
      }
    },
    setActiveBoard(state, { payload: id }) {
      if (state.boards[id]) state.activeBoardId = id
    },
    addColumn: {
      prepare({ boardId, title }) {
        return { payload: { id: `col-${nanoid()}`, boardId, title } }
      },
      reducer(state, { payload }) {
        const board = state.boards[payload.boardId]
        if (!board) return
        state.columns[payload.id] = { id: payload.id, title: payload.title, taskIds: [] }
        board.columnIds.push(payload.id)
      },
    },
    editColumn(state, { payload: { id, ...changes } }) {
      const column = state.columns[id]
      if (column) Object.assign(column, changes)
    },
    deleteColumn(state, { payload: id }) {
      const column = state.columns[id]
      if (!column) return
      for (const taskId of column.taskIds) delete state.tasks[taskId]
      delete state.columns[id]
      for (const board of Object.values(state.boards)) {
        const index = findColumnIndex(board, id)
        if (index !== -1) board.columnIds.splice(index, 1)
      }
    },
    addTask: {
      prepare({ columnId, title, description = '', labels = [], assignee = '' }) {
        return { payload: { id: `task-${nanoid()}`, columnId, title, description, labels, assignee } }
      },
      reducer(state, { payload }) {
        const column = state.columns[payload.columnId]
        if (!column) return
        state.tasks[payload.id] = {
          id: payload.id,
          title: payload.title,
          description: payload.description,
          labels: payload.labels,
          assignee: payload.assignee,
        }
        column.taskIds.push(payload.id)
      },
    },
    editTask(state, { payload: { id, ...changes } }) {
      const task = state.tasks[id]
      if (task) Object.assign(task, changes)
    },
    deleteTask(state, { payload: id }) {
      if (!state.tasks[id]) return
      delete state.tasks[id]
      removeTaskFromColumns(state, id)
    },
    moveTaskWithinColumn(state, { payload: { columnId, fromIndex, toIndex } }) {
      const column = state.columns[columnId]
      if (!column) return
      const [moved] = column.taskIds.splice(fromIndex, 1)
      column.taskIds.splice(toIndex, 0, moved)
    },
    moveTaskBetweenColumns(state, { payload: { taskId, sourceColumnId, destColumnId, destIndex = 0 } }) {
      const source = state.columns[sourceColumnId]
      const dest = state.columns[destColumnId]
      if (!source || !dest || !state.tasks[taskId]) return
      const fromIndex = source.taskIds.indexOf(taskId)
      if (fromIndex === -1) return
      source.taskIds.splice(fromIndex, 1)
      dest.taskIds.splice(destIndex, 0, taskId)
    },
    setFilters(state, { payload }) {
      state.filters = { ...state.filters, ...payload }
    },
  },
})

export const {
  addBoard,
  editBoard,
  deleteBoard,
  setActiveBoard,
  addColumn,
  editColumn,
  deleteColumn,
  addTask,
  editTask,
  deleteTask,
  moveTaskWithinColumn,
  moveTaskBetweenColumns,
  setFilters,
} = kanbanSlice.actions

export default kanbanSlice.reducer

export const selectActiveBoardId = (state) => {
  const { activeBoardId, boards } = state.kanban
  return activeBoardId && boards[activeBoardId] ? activeBoardId : Object.keys(boards)[0] ?? null
}
