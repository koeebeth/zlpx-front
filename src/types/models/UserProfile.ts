/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
 
import type { UserDriverLicense } from './UserDriverLicense';
import type { UserStatus } from './UserStatus';
export type UserProfile = {
    /**
     * Telegram ID
     */
    telegram_id: number;
    /**
     * Ник в ТГ
     */
    telegram_nickname: string;
    /**
     * Ник в ВК
     */
    vk_nickname: string;
    /**
     * Статус
     */
    status: UserStatus;
    /**
     * ФИО
     */
    full_name: string;
    /**
     * Номер телефона
     */
    phone_number: string;
    /**
     * Станция метро, на которой ты живешь
     */
    live_metro_station: Array<string>;
    /**
     * Станция метро, на которой ты учишься/работаешь
     */
    study_metro_station: Array<string>;
    /**
     * Год поступления в СтС
     */
    year_of_admission: number;
    /**
     * Есть ли у тебя водительские права и/или машина?
     */
    has_driver_license: UserDriverLicense;
    /**
     * Дата Рождения
     */
    date_of_birth: string;
    /**
     * Если ли у тебя принтер?
     */
    has_printer: UserStatus;
    /**
     * Можем ли мы проводить ночь креатива/ночь оформления у тебя дома?
     */
    can_host_night: boolean;
};

