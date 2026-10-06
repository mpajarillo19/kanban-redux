import { configureStore } from '@reduxjs/toolkit'
import { persistReducer, persistStore } from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import kanbanReducer from './kanbanSlice'

const persistConfig = {
  key: 'kanban',
  storage,
}

const persistedKanbanReducer = persistReducer(persistConfig, kanbanReducer)

export const store = configureStore({
  reducer: {
    kanban: persistedKanbanReducer,
  },
})

export const persistor = persistStore(store)
