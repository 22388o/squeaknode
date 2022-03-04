import { configureStore } from '@reduxjs/toolkit'

import notificationsReducer from '../features/notifications/notificationsSlice'
import { apiSlice, squeakApiSlice } from '../features/api/apiSlice'

export default configureStore({
  reducer: {
    notifications: notificationsReducer,
    [apiSlice.reducerPath]: apiSlice.reducer,
    [squeakApiSlice.reducerPath]: squeakApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    }).concat(apiSlice.middleware, squeakApiSlice.middleware),
})
