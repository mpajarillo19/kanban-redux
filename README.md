# Kanban Board

A Trello-style kanban task management board built with React 19, Redux Toolkit, and dnd-kit — featuring drag-and-drop, filtering, dark mode, and persistence across reloads.

## Features

- **Boards, columns, tasks** — full CRUD for all three levels
- **Drag & drop** — reorder tasks within a column and move them across columns (dnd-kit)
- **Task details** — title, description, labels, and assignee via a modal editor
- **Filtering** — by label and assignee; filters derive visible tasks in selectors without mutating stored state
- **Dark mode** — class-based theme toggle, persisted across reloads with no flash on load
- **Persistence** — entire board state (boards, columns, tasks, filters) saved to localStorage via redux-persist
- **Design system** — semantic CSS tokens in `src/index.css` that adapt automatically between light and dark themes
- **Empty states** — graceful fallbacks when a board or column is deleted

## Tech stack

| Layer     | Choice                                              |
| --------- | --------------------------------------------------- |
| Build     | [Vite 8](https://vite.dev) + React 19               |
| State     | Redux Toolkit + redux-persist (localStorage)        |
| DnD       | [dnd-kit](https://dndkit.com)                       |
| Styling   | Tailwind CSS 4 (`@tailwindcss/vite`)                |
| Icons     | lucide-react                                        |
| Linting   | oxlint                                              |

## Getting started

```bash
npm install
npm run dev      # start dev server (http://localhost:5173)
```

```bash
npm run build    # production build to dist/
npm run lint     # oxlint
```

## Project structure

```
src/
├── components/   # Sidebar, TopBar, Board, Column, TaskCard, modals
├── store/        # kanbanSlice, selectors, persist config
├── utils/        # drag-and-drop helpers
└── index.css     # design tokens (light/dark) + Tailwind
```

## Architecture notes

- **Normalized state** — boards, columns, and tasks live in separate collections keyed by id; columns and boards store only id arrays.
- **Filtering lives in selectors** — `selectFilteredTaskIdsByColumn` derives what's visible; stored `taskIds` are never mutated for filtering.
- **Drag-and-drop** — cross-column moves dispatch in `onDragOver` so cards follow the pointer; `onDragEnd` handles in-column reordering and drop-outside restoration.
