import { useDispatch, useSelector } from 'react-redux'
import { addBoard, selectActiveBoardId } from './store/kanbanSlice'

export default function App() {
  const dispatch = useDispatch()
  const activeBoardId = useSelector(selectActiveBoardId)
  const board = useSelector((state) => (activeBoardId ? state.kanban.boards[activeBoardId] : null))

  if (!board) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-100">
        <button
          type="button"
          onClick={() => dispatch(addBoard('My Board'))}
          className="rounded-lg bg-blue-600 px-4 py-2 font-medium text-white shadow transition hover:bg-blue-700"
        >
          Create first board
        </button>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-slate-100 p-6">
      <h1 className="text-2xl font-bold text-slate-800">{board.title}</h1>
    </main>
  )
}
