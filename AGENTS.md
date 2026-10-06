# AGENTS.md — Kanban Task Management Board (Trello clone)

## Status

Full app implemented: components, drag-and-drop, modals, filtering. Optional column reordering not built. No test suite exists yet.

## Commands

- `npm run dev` — Vite dev server (port 5173)
- `npm run build` — production build
- `npm run lint` — **oxlint** (not ESLint; config: `.oxlintrc.json`)
- Run `npm run lint` then `npm run build` before committing.

Environment: this machine's PowerShell blocks `npm.ps1` (execution policy) — call `npm.cmd` instead.

## Redux wiring

- `src/store/kanbanSlice.js` — slice + all reducers + `selectActiveBoardId` fallback selector (falls back to first board if active was deleted).
- `src/store/index.js` — store with `persistReducer` (localStorage, key `kanban`), exports `store` and `persistor`.
- `src/store/selectors.js` — all derived selectors. Filtering happens **only** in `selectFilteredTaskIdsByColumn` (never mutates stored `taskIds`); re-export of `selectActiveBoardId` lives here too — import selectors from this file, not the slice.
- `src/main.jsx` wraps the app in `<Provider>` + `<PersistGate>`.

## Code layout

- `src/components/` — `Sidebar` (board CRUD), `TopBar` (filters), `Board` (DndContext + handlers), `Column`, `TaskCard`, `Modal`/`TaskModal`/`ColumnModal`.
- `src/utils/dnd.js` — drag helpers (`findColumnOfTask`, `taskIndexInColumn`, `columnOfDroppable`). Board reads live state via `useStore().getState()` inside handlers, not selector snapshots.

## Gotchas

- **oxlint enforces the React Compiler refs rule**: never write `ref.current` during render — wrap in `useEffect` (this bit TaskCard once).
- Click-to-edit vs drag on TaskCard: `wasDraggingRef` set via `useEffect` on `isDragging`; a click that follows a drag must not open the modal.
- Cross-column moves dispatch in `onDragOver` (so the card follows the pointer); `onDragEnd` only reorders within a column or restores the origin if dropped outside.
- `moveTaskBetweenColumns` defaults `destIndex` to 0 — always pass the real index.

## Stack (fixed — do not substitute)

- Vite + React
- Redux Toolkit + `redux-persist` (localStorage)
- **dnd-kit** (`@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`) — NOT `react-beautiful-dnd`
- Tailwind CSS; icons: `lucide-react`; ids: `nanoid`
- Tailwind **v4** via `@tailwindcss/vite` — CSS is only `@import 'tailwindcss'`; do not add v3 directives (`@tailwind base`…) or `tailwind.config.js`.

## Redux: normalized state is mandatory

Do not nest tasks in columns or columns in boards. Use exactly this shape:

```json
{
  "kanban": {
    "activeBoardId": "board-1",
    "boards": { "board-1": { "id": "board-1", "title": "Project Alpha", "columnIds": ["col-1", "col-2"] } },
    "columns": {
      "col-1": { "id": "col-1", "title": "To Do", "taskIds": ["task-1", "task-2"] },
      "col-2": { "id": "col-2", "title": "In Progress", "taskIds": [] }
    },
    "tasks": {
      "task-1": { "id": "task-1", "title": "Setup Redux", "description": "Configure RTK and redux-persist", "labels": ["frontend", "urgent"], "assignee": "Alice" },
      "task-2": { "id": "task-2", "title": "Configure Tailwind", "description": "Setup theme and colors", "labels": ["design"], "assignee": "Bob" }
    },
    "filters": { "label": null, "assignee": null }
  }
}
```

- Slice: `kanbanSlice.js` with reducers — `addBoard`, `editBoard`, `deleteBoard`, `setActiveBoard`, `addColumn`, `editColumn`, `deleteColumn`, `addTask`, `editTask`, `deleteTask`, `moveTaskWithinColumn` (mutates one column's `taskIds`), `moveTaskBetweenColumns` (removes from source, adds to destination), `setFilters`.
- Reducers may write mutatively; RTK enables Immer.

## Drag-and-drop wiring

- `<DndContext>` wraps `Board` only; `onDragEnd` / `onDragOver` handlers live there.
- Each `Column` renders `<SortableContext>` with its own `taskIds`; `TaskCard` uses `useSortable`.
- Reducer payloads: `moveTaskWithinColumn` = `{ columnId, fromIndex, toIndex }`; `moveTaskBetweenColumns` = `{ taskId, sourceColumnId, destColumnId, destIndex }` (index optional, defaults to 0).

## Behavior requirements

- CRUD for boards, columns, and tasks. Task fields: title, description, labels, assignee.
- Filtering (label, assignee) happens in selectors: derive visible `taskIds`, hide non-matching in the UI — never mutate stored `taskIds` for filtering.
- Graceful fallback if the active board or a column is deleted.
- Bonus: reorder columns within a board.

## Code quality

- Keep components small; extract drag-and-drop logic into helpers.
- Tailwind utility classes for hover states, transitions, shadows; clean Trello/Jira-like look.
