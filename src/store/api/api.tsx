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
      transformResponse: (rawResponse: EventApiT[]): CalendarEventT[] => {
        return rawResponse
          .map((evt) => ({
            datetime: evt.date,
            title: evt.text,
            location: "",
            project: evt.activity,
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
