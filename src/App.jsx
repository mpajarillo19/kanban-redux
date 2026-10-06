import Board from './components/Board'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'

export default function App() {
  return (
    <div className="flex h-screen overflow-hidden bg-background text-primary">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <TopBar />
        <Board />
      </div>
    </div>
  )
}
