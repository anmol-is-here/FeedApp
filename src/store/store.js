// ─── Redux Store ───────────────────────────────────────────
// Central store that combines all reducers
// Three slices:
//   1. api     → server-side data (posts from DummyJSON)
//   2. filter  → client-side UI state (search, hidden posts, editing)
//   3. auth    → user authentication (login/signup with localStorage)

import { configureStore } from '@reduxjs/toolkit';
import { apiSlice } from './apiSlice';
import filterReducer from './filterSlice';
import authReducer from './authSlice';

export const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,  // RTK Query cache reducer
    filter: filterReducer,                      // client-side filter state
    auth: authReducer,                          // authentication state
  },
  // RTK Query middleware handles caching, polling, and invalidation
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(apiSlice.middleware),
});
