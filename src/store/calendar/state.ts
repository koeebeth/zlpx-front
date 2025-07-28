import { createSlice } from "@reduxjs/toolkit";


export type CalendarEventT = {
  datetime: string;
  title: string;
  location: string;
  project: string;
};

export interface CalendarState {
  events: Array<CalendarEventT>;
}

const initialState: CalendarState = {
  events: [
    {
      datetime: new Date().toISOString(),
      title: "Собрание",
      location: "Покра, R401",
      project: "Проект",
    },
    {
      datetime: new Date().toISOString(),
      title: "Собрание",
      location: "Покра, R401",
      project: "Проект",
    },
    {
      datetime: new Date().toISOString(),
      title: "Собрание",
      location: "Покра, R401",
      project: "Проект",
    },
    {
      datetime: new Date().toISOString(),
      title: "Собрание",
      location: "Покра, R401",
      project: "Проект",
    },
    {
      datetime: new Date().toISOString(),
      title: "Собрание",
      location: "Покра, R401",
      project: "Проект",
    },
    {
      datetime: new Date("2025-09-04").toISOString(),
      title: "Собрание",
      location: "Покра, R401",
      project: "Проект",
    },
    {
      datetime: new Date("2025-09-04").toISOString(),
      title: "Собрание",
      location: "Покра, R401",
      project: "Проект",
    },
    {
      datetime: new Date("2025-09-07").toISOString(),
      title: "Собрание",
      location: "Покра, R401",
      project: "Проект",
    },
  ],
};

export const calendarSlice = createSlice({
  name: "calendar",
  initialState,
  reducers: {},
});
