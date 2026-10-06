import { useRef, useState } from 'react'
import { useDispatch, useSelector, useStore } from 'react-redux'
import {
  DndContext,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { Plus, LayoutGrid } from 'lucide-react'
import { moveTaskBetweenColumns, moveTaskWithinColumn } from '../store/kanbanSlice'
import {
  selectActiveBoard,
  selectActiveBoardColumns,
  selectBoardList,
  selectFilteredTaskIdsByColumn,
} from '../store/selectors'
import { columnOfDroppable, findColumnOfTask, taskIndexInColumn } from '../utils/dnd'
import Column from './Column'
import ColumnModal from './ColumnModal'

export default function Board() {
  const dispatch = useDispatch()
  const store = useStore()
  const board = useSelector(selectActiveBoard)
  const columns = useSelector(selectActiveBoardColumns)
  const boards = useSelector(selectBoardList)
  const filteredTaskIds = useSelector(selectFilteredTaskIdsByColumn)
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  )
  const originRef = useRef(null)

  const handleDragStart = ({ active }) => {
    const state = store.getState()
    const columnId = findColumnOfTask(state, active.id)
    originRef.current = columnId
      ? { columnId, index: taskIndexInColumn(state, columnId, active.id) }
      : null
  }

  const handleDragOver = ({ active, over }) => {
    if (!over) return
    const state = store.getState()
    const destColumnId = columnOfDroppable(over)
    if (!destColumnId || !state.kanban.columns[destColumnId]) return

    const sourceColumnId = findColumnOfTask(state, active.id)
    if (!sourceColumnId || sourceColumnId === destColumnId) return

    const destIndex =
      over.data.current?.type === 'task'
        ? taskIndexInColumn(state, destColumnId, over.id)
        : state.kanban.columns[destColumnId].taskIds.length

    dispatch(
      moveTaskBetweenColumns({
        taskId: active.id,
        sourceColumnId,
        destColumnId,
        destIndex: destIndex === -1 ? 0 : destIndex,
      }),
    )
  }

  const handleDragEnd = ({ active, over }) => {
    const state = store.getState()
    const currentColumnId = findColumnOfTask(state, active.id)

    if (!over) {
      const origin = originRef.current
      if (origin?.columnId && currentColumnId && origin.columnId !== currentColumnId) {
        dispatch(
          moveTaskBetweenColumns({
            taskId: active.id,
            sourceColumnId: currentColumnId,
            destColumnId: origin.columnId,
            destIndex: Math.max(origin.index, 0),
          }),
        )
      }
      return
    }

    const overColumnId = columnOfDroppable(over)
    if (
      over.data.current?.type === 'task' &&
      overColumnId &&
      overColumnId === currentColumnId &&
      over.id !== active.id
    ) {
      const fromIndex = taskIndexInColumn(state, currentColumnId, active.id)
      const toIndex = taskIndexInColumn(state, currentColumnId, over.id)
      if (fromIndex !== -1 && toIndex !== -1 && fromIndex !== toIndex) {
        dispatch(moveTaskWithinColumn({ columnId: currentColumnId, fromIndex, toIndex }))
      }
    }
  }

  if (!board) {
    const hasBoards = boards.length > 0
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
        <span className="grid size-12 place-items-center rounded-xl bg-accent-subtle text-accent-text">
          <LayoutGrid size={22} />
        </span>
        <div>
          <p className="text-sm font-medium text-primary">
            {hasBoards ? 'No board selected' : 'Welcome to Kanban'}
          </p>
          <p className="mt-1 text-[13px] text-muted">
            {hasBoards
              ? 'Select a board from the sidebar to get started.'
              : 'Create your first board to start organizing tasks.'}
          </p>
        </div>
        {!hasBoards && (
          <button
            type="button"
            onClick={() => document.getElementById('new-board-input')?.focus()}
            className="rounded-md bg-accent px-3.5 py-2 text-sm font-medium text-accent-contrast transition hover:bg-accent-hover"
          >
            Create board
          </button>
        )}
      </div>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div className="flex flex-1 gap-4 overflow-x-auto p-6 pt-4">
        {columns.map((column) => (
          <Column
            key={column.id}
            column={column}
            boardId={board.id}
            visibleTaskIds={filteredTaskIds[column.id] ?? []}
          />
        ))}
        <AddColumnSlot boardId={board.id} />
      </div>
    </DndContext>
  )
}

function AddColumnSlot({ boardId }) {
  const [open, setOpen] = useState(false)
  return (
    <div className="w-72 shrink-0">
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="flex w-full items-center gap-1.5 rounded-xl border border-dashed border-border-strong px-3 py-2.5 text-sm text-muted transition hover:border-accent/60 hover:bg-accent-subtle/50 hover:text-accent-text"
      >
        <Plus size={16} /> Add column
      </button>
      {open && <ColumnModal boardId={boardId} onClose={() => setOpen(false)} />}
    </div>
  )
}
