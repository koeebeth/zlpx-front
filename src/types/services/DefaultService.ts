/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { HealthResponse } from '../models/HealthResponse';
import type { ScheduleResponse } from '../models/ScheduleResponse';
import type { UserProfileResponse } from '../models/UserProfileResponse';
import type { UserProfileUpdateRequest } from '../models/UserProfileUpdateRequest';
import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
export class DefaultService {
    /**
     * Health Check
     * Проверка состояния API
     * @returns HealthResponse Successful Response
     * @throws ApiError
     */
    public static healthCheckHealthGet(): CancelablePromise<HealthResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/health',
        });
    }
    /**
     * Get Schedule
     * Получение расписания событий
     * @param refresh Принудительное обновление кэша
     * @returns ScheduleResponse Successful Response
     * @throws ApiError
     */
    public static getScheduleScheduleGet(
        refresh: boolean = false,
    ): CancelablePromise<ScheduleResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/schedule',
            query: {
                'refresh': refresh,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Add Schedule
     * Добавление события в расписание TODO
     * @param requestBody
     * @returns ScheduleResponse Successful Response
     * @throws ApiError
     */
    public static addScheduleScheduleAddPost(
        requestBody: ScheduleResponse,
    ): CancelablePromise<ScheduleResponse> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/schedule/add',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Get User Profile
     * Получение профиля пользователя TODO
     * @param telegramId
     * @returns UserProfileResponse Successful Response
     * @throws ApiError
     */
    public static getUserProfileUserTelegramIdGet(
        telegramId: number,
    ): CancelablePromise<UserProfileResponse> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/user/{telegram_id}',
            path: {
                'telegram_id': telegramId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }
    /**
     * Update User Profile
     * Обновление профиля пользователя с указанием полей для изменения TODO
     * @param requestBody
     * @returns boolean Successful Response
     * @throws ApiError
     */
    public static updateUserProfileUserUpdatePost(
        requestBody: UserProfileUpdateRequest,
    ): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/user/update',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }
}
