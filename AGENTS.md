# AGENTS.md — Kanban Task Management Board (Trello clone)

## Status

Greenfield repo: no commits, no `package.json`, no code yet. This file is the agreed spec — follow it instead of inventing architecture.

## Bootstrap (first session)

1. Scaffold: `npm create vite@latest . -- --template react`
2. Install: `npm i @reduxjs/toolkit react-redux redux-persist @dnd-kit/core @dnd-kit/sortable @dnd-kit/utilities tailwindcss lucide-react nanoid`
3. Configure Tailwind.
4. Once `package.json` exists, record the real `dev` / `build` / `lint` commands here.

## Stack (fixed — do not substitute)

- Vite + React
- Redux Toolkit + `redux-persist` (localStorage)
- **dnd-kit** (`@dnd-kit/core`, `@dnd-kit/sortable`, `@dnd-kit/utilities`) — NOT `react-beautiful-dnd`
- Tailwind CSS; icons: `lucide-react`; ids: `nanoid`

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

## Behavior requirements

- CRUD for boards, columns, and tasks. Task fields: title, description, labels, assignee.
- Filtering (label, assignee) happens in selectors: derive visible `taskIds`, hide non-matching in the UI — never mutate stored `taskIds` for filtering.
- Graceful fallback if the active board or a column is deleted.
- Bonus: reorder columns within a board.

## Code quality

- Keep components small; extract drag-and-drop logic into helpers.
- Tailwind utility classes for hover states, transitions, shadows; clean Trello/Jira-like look.
