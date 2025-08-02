import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { CalendarEventT } from "../calendar/state";
import { EventApiT } from "./models/models";

const BASE_PATH = "http://localhost:8000";

export const calendarApi = createApi({
  reducerPath: "calendarApi",
  baseQuery: fetchBaseQuery({ baseUrl: BASE_PATH} ),
  endpoints: (builder) => ({
    getSchedule: builder.query<
      CalendarEventT[],
      {
        start: string;
        end: string;
      } | void
    >({
      query: (q) => `/schedule?start_date=${q?.start}&end_date=${q?.end}` ,
      transformResponse: (rawResponse: {
        events: EventApiT[];
      }): CalendarEventT[] => {
        return rawResponse.events.map((evt) => ({
          datetime: evt.date,
          title: evt.activity,
          location: "",
          project: evt.project,
        }));
      },
      
    }),
  }),
});

export const { useGetScheduleQuery } = calendarApi;
