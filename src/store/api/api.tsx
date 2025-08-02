import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { CalendarEventT } from "../calendar/state";
import { EventApiT } from "./models/models";

const BASE_PATH = "http://127.0.0.1:8000";

export const calendarApi = createApi({
  reducerPath: "calendarApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_PATH }),
  endpoints: (builder) => ({
    getSchedule: builder.query<CalendarEventT[], void>({
      query: () => "/schedule",
      transformResponse: (rawResponse: { events: EventApiT[] }): CalendarEventT[] => {
        return rawResponse.events
          .map((evt) => ({
            datetime: evt.date,
            title: evt.activity,
            location: "",
            project: evt.project,
          }))
          .sort((a, b) => {
            return new Date(a.datetime).getTime() <
              new Date(b.datetime).getTime()
              ? -1
              : 1;
          });
      },
    }),
  }),
});

export const { useGetScheduleQuery } = calendarApi;
