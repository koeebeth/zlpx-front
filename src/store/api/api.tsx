import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

import { CalendarEventT } from "../calendar/state";
import { EventApiT } from "./models/models";

// Типы для аутентификации
export interface TelegramAuthRequest {
  init_data: string;
}

import { UserProfile } from '../../types/models/UserProfile';

export interface TelegramAuthResponse {
  user_profile: UserProfile;
}

const BASE_PATH = import.meta.env.VITE_API_BASE_URL || "https://api.ingroupsts.ru";

export { BASE_PATH };

// Создаем кастомный baseQuery с дополнительной отладкой
const baseQueryWithDebug = fetchBaseQuery({ 
  baseUrl: BASE_PATH,
  prepareHeaders: (headers) => {
    headers.set('Content-Type', 'application/json');
    headers.set('Accept', 'application/json');
    // Добавляем отладочные заголовки
    headers.set('X-Debug-Client', 'zlpx-front');
    headers.set('X-Request-Time', new Date().toISOString());
    return headers;
  },
  // Добавляем обработку ошибок
  validateStatus: (response, body) => {
    console.log('🔍 API Response:', {
      status: response.status,
      statusText: response.statusText,
      url: response.url,
      headers: Object.fromEntries(response.headers.entries())
    });
    
    if (response.status >= 200 && response.status < 300) {
      return true;
    }
    
    console.error('❌ API Error Response:', {
      status: response.status,
      statusText: response.statusText,
      body: body
    });
    
    return false;
  }
});

export const calendarApi = createApi({
  reducerPath: "calendarApi",
  baseQuery: baseQueryWithDebug,
  endpoints: (builder) => ({
    getSchedule: builder.query<
      CalendarEventT[],
      {
        start?: string;
        end?: string;
      } | void
    >({
      query: (q) => {
        const params = new URLSearchParams();
        if (q?.start) params.append('start_date', q.start);
        if (q?.end) params.append('end_date', q.end);

        return `/schedule?${params.toString()}`;
      },
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
    
    // Эндпоинт для аутентификации Telegram
    telegramAuth: builder.mutation<TelegramAuthResponse, TelegramAuthRequest>({
      // Отключаем кэширование для мутации аутентификации
      invalidatesTags: [],
      query: (credentials) => {
        console.log('🚀 RTK Query: Отправляем запрос на аутентификацию:', {
          url: `${BASE_PATH}/auth/telegram`,
          method: 'POST',
          body: credentials,
          timestamp: new Date().toISOString()
        });
        
        return {
          url: '/auth/telegram',
          method: 'POST',
          body: credentials,
        };
      },
      // Добавляем обработку ошибок
      async onQueryStarted(credentials, { queryFulfilled }) {
        console.log('🚀 RTK Query onQueryStarted с данными:', credentials);
        try {
          console.log('⏳ Ожидаем результат queryFulfilled...');
          const result = await queryFulfilled;
          console.log('✅ RTK Query: Запрос успешен:', result);
          console.log('✅ Тип результата:', typeof result);
          console.log('✅ Структура результата:', JSON.stringify(result, null, 2));
          console.log('✅ user_profile:', result.data?.user_profile);
        } catch (error: any) {
          console.error('❌ RTK Query: Ошибка запроса:', error);
          console.error('❌ Полная структура ошибки:', JSON.stringify(error, null, 2));
          console.error('❌ Детали ошибки:', {
            error: error?.error,
            status: error?.error?.status,
            data: error?.error?.data,
            originalStatus: error?.error?.originalStatus,
            name: error?.name,
            message: error?.message
          });
        }
      }
    }),
  }),
});

export const { useGetScheduleQuery, useTelegramAuthMutation } = calendarApi;
