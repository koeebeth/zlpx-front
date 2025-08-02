import { configureStore } from "@reduxjs/toolkit";

import { calendarApi } from "./api/api";
import { calendarSlice } from "./calendar/state";

export const store = configureStore({
  reducer: {
    calendar: calendarSlice.reducer,
    [calendarApi.reducerPath]: calendarApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(calendarApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
