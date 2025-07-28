import { configureStore } from "@reduxjs/toolkit";

import { calendarSlice } from "./calendar/state";

export const store = configureStore({
  reducer: {
    calendar: calendarSlice.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
