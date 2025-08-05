import { entries, isEmpty, split } from "lodash";
import { FC } from "react";
import { useForm } from "react-hook-form";

import {
  UserDriverLicenseDesc,
  UserPrinterDesc,
  UserStatusDesc,
} from "../../../lib/api-types";
import { UserProfile } from "../../../types";

type PropsT = {
  user: UserProfile;
  setUser: (user: UserProfile) => void;
};

type PersonalInfoFormFields = Omit<
  UserProfile,
  | "full_name"
  | "telegram_nickname"
  | "vk_nickname"
  | "phone_number"
  | "telegram_id"
  | "study_metro_station"
  | "live_metro_station"
  | "can_host_night"
> & {
  study_metro_station: string;
  live_metro_station: string;
  can_host_night: string;
};

const inputSectionClasses =
  "flex gap-3 justify-between w-full items-center dark:text-zinc-300 text-sm";

const inputClasses = "bg-zinc-700 outline-0 rounded-sm w-1/2 px-1 py-0.5";
const inputClassesError =
  "bg-zinc-700 outline-0 border-1 border-red-800 rounded-sm w-1/2 px-1 py-0.5";

export const PersonalInfoForm: FC<PropsT> = ({ user, setUser }) => {
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<PersonalInfoFormFields>({
    mode: "onChange",
  });
  return (
    <form
      className="flex flex-col gap-3 pb-8"
      onSubmit={handleSubmit((data) => {
        setUser({
          ...user,
          has_driver_license: Number(data.has_driver_license),
          has_printer: Number(data.has_printer),
          status: Number(data.status),
          live_metro_station: split(data.live_metro_station, ","),
          study_metro_station: split(data.study_metro_station, ","),
          date_of_birth: new Date(data.date_of_birth)
            .toISOString()
            .split("T")[0],
          year_of_admission: data.year_of_admission,
          can_host_night: data.can_host_night === "1",
        });
      })}
    >
      <div className={inputSectionClasses}>
        <label>Живет возле станции:</label>
        <input
          className={
            errors.live_metro_station ? inputClassesError : inputClasses
          }
          type="text"
          defaultValue={user?.live_metro_station.join(",")}
          {...register("live_metro_station")}
        />
      </div>
      <div className={inputSectionClasses}>
        <label>Учится возле станции:</label>
        <input
          className={
            errors.study_metro_station ? inputClassesError : inputClasses
          }
          type="text"
          defaultValue={user.study_metro_station.join(",")}
          {...register("study_metro_station")}
        />
      </div>
      <div className={inputSectionClasses}>
        <label>Дата рождения:</label>
        <input
          className={errors.date_of_birth ? inputClassesError : inputClasses}
          type="date"
          defaultValue={user.date_of_birth}
          {...register("date_of_birth")}
        />
      </div>
      <div className={inputSectionClasses}>
        <label>Есть принтер:</label>
        <select
          className={errors.has_printer ? inputClassesError : inputClasses}
          {...register("has_printer")}
        >
          <option value={user.has_printer} selected>
            {UserPrinterDesc[user.has_printer]}
          </option>
          {entries(UserPrinterDesc).map(
            ([val, label]) =>
              Number(val) !== user.has_printer && (
                <option value={Number(val)}>{label}</option>
              )
          )}
        </select>
      </div>
      <div className={inputSectionClasses}>
        <label>Может проводить НК:</label>
        <select
          {...register("can_host_night")}
          className={errors.can_host_night ? inputClassesError : inputClasses}
        >
          <option value={1} selected={user.can_host_night}>
            Да
          </option>
          <option value={0} selected={!user.can_host_night}>
            Нет
          </option>
        </select>
      </div>
      <div className={inputSectionClasses}>
        <label>Есть права/машина:</label>
        <select
          className={
            errors.has_driver_license ? inputClassesError : inputClasses
          }
          {...register("has_driver_license")}
        >
          <option value={user.has_driver_license} selected>
            {UserDriverLicenseDesc[user.has_driver_license]}
          </option>
          {entries(UserDriverLicenseDesc).map(
            ([val, label]) =>
              Number(val) !== user.has_printer && (
                <option value={Number(val)}>{label}</option>
              )
          )}
        </select>
      </div>
      <div className={inputSectionClasses}>
        <label>Год вступления в СТС:</label>
        <input
          type="number"
          className={
            errors.year_of_admission ? inputClassesError : inputClasses
          }
          defaultValue={user.year_of_admission}
          {...register("year_of_admission", {
            min: 1900,
            max: new Date().getFullYear(),
          })}
        />
      </div>
      <div className={inputSectionClasses}>
        <label>Статус:</label>
        <select
          className={errors.status ? inputClassesError : inputClasses}
          {...register("status")}
        >
          <option value={user.status} selected>
            {UserStatusDesc[user.status]}
          </option>
          {entries(UserStatusDesc).map(
            ([val, label]) =>
              Number(val) !== user.status && (
                <option value={Number(val)}>{label}</option>
              )
          )}
        </select>
      </div>
      <button className="absolute bottom-2 right-2" type="submit">
        <span
          className={`material-symbols-outlined ${!isEmpty(errors) ? "text-zinc-600" : "text-light-purple"}`}
        >
          check
        </span>
      </button>
    </form>
  );
};
