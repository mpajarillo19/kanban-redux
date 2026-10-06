# AGENTS.md — Kanban Task Management Board (Trello clone)

## Status

Scaffolded Vite + React app; Redux store and `redux-persist` wired. Not yet built: UI components, drag-and-drop, filtering (spec below covers them).

## Commands

- `npm run dev` — Vite dev server (port 5173)
- `npm run build` — production build
- `npm run lint` — **oxlint** (not ESLint; config: `.oxlintrc.json`)
- Run `npm run lint` then `npm run build` before committing.

Environment: this machine's PowerShell blocks `npm.ps1` (execution policy) — call `npm.cmd` instead.

## Redux wiring (exists)

- `src/store/kanbanSlice.js` — slice + all reducers + `selectActiveBoardId` fallback selector.
- `src/store/index.js` — store with `persistReducer` (localStorage, key `kanban`), exports `store` and `persistor`.
- `src/main.jsx` wraps the app in `<Provider>` + `<PersistGate>`.

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
- Wrap the app in `<Provider>` and `redux-persist`'s `<PersistGate>`.

## Components

`App` (layout) → `Sidebar` (board list + add), `TopBar` (active board title, filter dropdowns), `Board` (dnd context area), `Column` (droppable), `TaskCard` (draggable), reusable `Modals` (add/edit tasks and columns).

## Drag-and-drop wiring

- `<DndContext>` wraps `Board` only; `onDragEnd` / `onDragOver` handlers live there.
- Each `Column` renders `<SortableContext>` with its own `taskIds`; `TaskCard` uses `useSortable`.
- Dispatch `moveTaskWithinColumn` vs `moveTaskBetweenColumns` based on the drag event.
- Reducer payloads: `moveTaskWithinColumn` = `{ columnId, fromIndex, toIndex }`; `moveTaskBetweenColumns` = `{ taskId, sourceColumnId, destColumnId, destIndex }` (index optional, defaults to 0).

## Behavior requirements

- CRUD for boards, columns, and tasks. Task fields: title, description, labels, assignee.
- Filtering (label, assignee) happens in selectors: derive visible `taskIds`, hide non-matching in the UI — never mutate stored `taskIds` for filtering.
- Graceful fallback if the active board or a column is deleted.
- Bonus: reorder columns within a board.

## Code quality

- Keep components small; extract drag-and-drop logic into helpers.
- Tailwind utility classes for hover states, transitions, shadows; clean Trello/Jira-like look.
