import { entries, isEmpty, split } from "lodash";
import { FC, useState } from "react";
import { useForm } from "react-hook-form";

import {
  UserDriverLicenseDesc,
  UserPrinterDesc,
  UserStatusDesc,
} from "../../../lib/api-types";
import { UserProfile } from "../../../types";
import { MetroSelector } from "../../../components/MetroSelector";

type PropsT = {
  user: UserProfile;
  setUser: (user: UserProfile) => void;
  updateUserProfile?: (fields: Partial<UserProfile>) => Promise<boolean>;
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
  can_host_night: string;
};

const inputSectionClasses =
  "flex gap-3 justify-between w-full items-center dark:text-zinc-300 text-sm";

const inputClasses = "bg-zinc-700 outline-0 rounded-sm w-1/2 px-1 py-0.5";
const inputClassesError =
  "bg-zinc-700 outline-0 border-1 border-red-800 rounded-sm w-1/2 px-1 py-0.5";

export const PersonalInfoForm: FC<PropsT> = ({ user, setUser, updateUserProfile }) => {
  // Фильтруем только числовые значения для MetroSelector
  const filterNumericIds = (ids: (number | string)[]) => 
    ids.filter(id => typeof id === 'number' && !isNaN(id)) as number[];
  
  const [liveMetroStations, setLiveMetroStations] = useState<number[]>(
    filterNumericIds(user?.live_metro_station || [])
  );
  const [studyMetroStations, setStudyMetroStations] = useState<number[]>(
    filterNumericIds(user?.study_metro_station || [])
  );
  
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
      onSubmit={handleSubmit(async (data) => {
        const updatedUser = {
          ...user,
          has_driver_license: Number(data.has_driver_license),
          has_printer: Number(data.has_printer),
          status: Number(data.status),
          live_metro_station: liveMetroStations,
          study_metro_station: studyMetroStations,
          date_of_birth: new Date(data.date_of_birth)
            .toISOString()
            .split("T")[0],
          year_of_admission: data.year_of_admission,
          can_host_night: data.can_host_night === "1",
        };

        // Определяем измененные поля
        const changedFields: Partial<UserProfile> = {};
        if (updatedUser.has_driver_license !== user.has_driver_license) changedFields.has_driver_license = updatedUser.has_driver_license;
        if (updatedUser.has_printer !== user.has_printer) changedFields.has_printer = updatedUser.has_printer;
        if (updatedUser.status !== user.status) changedFields.status = updatedUser.status;
        if (JSON.stringify(updatedUser.live_metro_station) !== JSON.stringify(user.live_metro_station)) changedFields.live_metro_station = updatedUser.live_metro_station;
        if (JSON.stringify(updatedUser.study_metro_station) !== JSON.stringify(user.study_metro_station)) changedFields.study_metro_station = updatedUser.study_metro_station;
        if (updatedUser.date_of_birth !== user.date_of_birth) changedFields.date_of_birth = updatedUser.date_of_birth;
        if (updatedUser.year_of_admission !== user.year_of_admission) changedFields.year_of_admission = updatedUser.year_of_admission;
        if (updatedUser.can_host_night !== user.can_host_night) changedFields.can_host_night = updatedUser.can_host_night;

        if (updateUserProfile && Object.keys(changedFields).length > 0) {
          const success = await updateUserProfile(changedFields);
          if (success) {
            setUser(updatedUser);
          }
          // Убираем showAlert, так как он не поддерживается в этой версии
        } else {
          setUser(updatedUser);
        }
      })}
    >
      <div className={inputSectionClasses}>
        <label>Живет возле станции:</label>
        <MetroSelector
          value={liveMetroStations}
          onChange={setLiveMetroStations}
          placeholder="Выберите станции метро"
          label="Живет возле станции"
        />
      </div>
      <div className={inputSectionClasses}>
        <label>Учится возле станции:</label>
        <MetroSelector
          value={studyMetroStations}
          onChange={setStudyMetroStations}
          placeholder="Выберите станции метро"
          label="Учится возле станции"
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
          defaultValue={user.has_printer}
          {...register("has_printer")}
        >
          {entries(UserPrinterDesc).map(
            ([val, label]) => (
              <option key={val} value={Number(val)}>
                {label}
              </option>
            )
          )}
        </select>
      </div>
      <div className={inputSectionClasses}>
        <label>Может проводить НК:</label>
        <select
          {...register("can_host_night")}
          className={errors.can_host_night ? inputClassesError : inputClasses}
          defaultValue={user.can_host_night ? "1" : "0"}
        >
          <option key="1" value="1">Да</option>
          <option key="0" value="0">Нет</option>
        </select>
      </div>
      <div className={inputSectionClasses}>
        <label>Есть права/машина:</label>
        <select
          className={
            errors.has_driver_license ? inputClassesError : inputClasses
          }
          defaultValue={user.has_driver_license}
          {...register("has_driver_license")}
        >
          {entries(UserDriverLicenseDesc).map(
            ([val, label]) => (
              <option key={val} value={Number(val)}>
                {label}
              </option>
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
          defaultValue={user.status}
          {...register("status")}
        >
          {entries(UserStatusDesc).map(
            ([val, label]) => (
              <option key={val} value={Number(val)}>
                {label}
              </option>
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
