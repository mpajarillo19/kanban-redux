import { useRef, useState } from 'react'
import { useDispatch, useSelector, useStore } from 'react-redux'
import {
  DndContext,
  PointerSensor,
  closestCorners,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import { Plus } from 'lucide-react'
import { moveTaskBetweenColumns, moveTaskWithinColumn } from '../store/kanbanSlice'
import {
  selectActiveBoard,
  selectActiveBoardColumns,
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
    return (
      <div className="flex flex-1 items-center justify-center text-sm text-slate-400">
        No board selected. Create one from the sidebar.
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
        className="flex w-full items-center gap-1 rounded-xl bg-slate-200/50 px-3 py-2 text-sm text-slate-500 transition hover:bg-slate-200 hover:text-slate-700"
      >
        <Plus size={16} /> Add column
      </button>
      {open && <ColumnModal boardId={boardId} onClose={() => setOpen(false)} />}
    </div>
  )
}
