/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
/**
 * Схема запроса для частичного обновления профиля пользователя
 */
export type UserProfileUpdateRequest = {
    /**
     * Telegram ID пользователя для обновления
     */
    telegram_id: number;
    /**
     * Telegram ID пользователя, который делает запрос
     */
    from_user_telegram_id: number;
    /**
     * Словарь с полями для обновления
     */
    fields: Record<string, any>;
};

