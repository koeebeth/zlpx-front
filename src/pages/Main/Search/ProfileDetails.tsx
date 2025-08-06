import { Avatar } from "@mui/material";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { FC, useState } from "react";
import { telegramService } from "../../../lib/telegram";
import { useUser } from "../../../lib/contexts/UserContext";

import TelegramIcon from "../../../assets/telegram.svg?react";
import VkIcon from "../../../assets/vk.svg?react";
import {
  formatBool,
  formatDriverLicense,
  formatPrintInfo,
  formatStatus,
} from "../../../lib/utils";
import { type UserProfile } from "../../../types";
import { ContactForm } from "./ContactForm";
import { PersonalInfoForm } from "./PersonalInfoForm";

type PropsT = {
  user: UserProfile;
  setUser: (payload: UserProfile) => void;
  updateUserProfile?: (fields: Partial<UserProfile>) => Promise<boolean>;
  isSelf?: boolean;
  useContext?: boolean; // Флаг для использования контекста вместо пропсов
};

export const ProfileDetails: FC<PropsT> = ({ user, setUser, updateUserProfile, isSelf, useContext = false }) => {
  const [isEditingContacts, setIsEditingContacts] = useState(false);
  const [isEditingPersonalInfo, setIsEditingPersonalInfo] = useState(false);
  const contextUser = useUser();
  
  // Используем контекст или пропсы в зависимости от флага
  const currentUser = useContext ? contextUser.user : user;
  const currentSetUser = useContext ? contextUser.setUser : setUser;
  const currentUpdateUserProfile = useContext ? contextUser.updateUserProfile : updateUserProfile;

  return (
    <div className="flex flex-col gap-2 p-2 bg-zinc-300 flex-1 dark:bg-zinc-900 overflow-scroll">
      <div className="rounded-lg bg-zinc-400 dark:bg-zinc-800 flex items-center justify-between gap-1 p-6 relative">
        {isSelf && (
          <button
            className="absolute top-2 right-2"
            onClick={() => setIsEditingContacts((prev) => !prev)}
          >
            <span className="material-symbols-outlined dark:text-light-purple">
              {isEditingContacts ? "close" : "edit_square"}
            </span>
          </button>
        )}
        {isEditingContacts ? (
          <ContactForm user={currentUser} onSubmit={async (data: UserProfile) => {
            // Извлекаем только измененные поля
            const changedFields: Partial<UserProfile> = {};
            if (data.full_name !== currentUser.full_name) changedFields.full_name = data.full_name;
            if (data.telegram_nickname !== currentUser.telegram_nickname) changedFields.telegram_nickname = data.telegram_nickname;
            if (data.vk_nickname !== currentUser.vk_nickname) changedFields.vk_nickname = data.vk_nickname;
            if (data.phone_number !== currentUser.phone_number) changedFields.phone_number = data.phone_number;
            
            if (currentUpdateUserProfile && Object.keys(changedFields).length > 0) {
              const success = await currentUpdateUserProfile(changedFields);
              if (success) {
                currentSetUser(data);
                setIsEditingContacts(false);
                telegramService.showAlert("Профиль успешно обновлен!");
              } else {
                telegramService.showAlert("Ошибка при обновлении профиля");
              }
            } else {
              currentSetUser(data);
              setIsEditingContacts(false);
            }
          }} />
        ) : (
          <>
            <div className="animate-fadein">
              <h3 className="font-semibold text-lg mb-4 dark:text-zinc-200">
                {currentUser ? `${currentUser.full_name}` : "Имя Фамилия"}
              </h3>
              <h4 className="text-sm dark:text-zinc-400 mb-3 flex gap-2 items-center">
                <VkIcon />@{currentUser?.vk_nickname}
              </h4>
              <h4 className="text-sm dark:text-zinc-400 mb-3 flex gap-2 items-center">
                <TelegramIcon />@{currentUser?.telegram_nickname}
              </h4>
              <h4 className="text-sm dark:text-zinc-400 flex gap-2 items-center">
                <span className="material-icons md-16">phone</span>
                {currentUser?.phone_number}
              </h4>
            </div>
          </>
        )}
        <Avatar sx={{ width: 90, height: 90, backgroundColor: "blueviolet" }}>
          ТУ
        </Avatar>
      </div>
      <div className="rounded-lg bg-zinc-400 dark:bg-zinc-800 p-6 relative">
        {isSelf && (
          <button
            className="absolute top-2 right-2"
            onClick={() => setIsEditingPersonalInfo((prev) => !prev)}
          >
            <span className="material-symbols-outlined dark:text-light-purple">
              {isEditingPersonalInfo ? "close" : "edit_square"}
            </span>
          </button>
        )}
        <h4 className="dark:text-zinc-400 mb-4">Личная Информация</h4>
        {isEditingPersonalInfo ? (
          <PersonalInfoForm
            user={currentUser}
            setUser={(data) => {
              currentSetUser(data);
              setIsEditingPersonalInfo(false);
            }}
          />
        ) : (
          <div className="flex flex-col gap-3 animate-fadein">
            <p className="dark: text-zinc-300 text-sm">
              Живет возле станции: <b>{currentUser?.live_metro_station.join(",")}</b>
            </p>
            <p className="dark: text-zinc-300 text-sm">
              Учится возле станции: <b>{currentUser?.study_metro_station.join(",")}</b>
            </p>
            <p className="dark: text-zinc-300 text-sm">
              Дата рождения:{" "}
              <b>
                {format(new Date(currentUser?.date_of_birth), "d MMMM yyyy", {
                  locale: ru,
                })}
              </b>
            </p>
            <p className="dark: text-zinc-300 text-sm">
              Есть принтер: <b>{formatPrintInfo(currentUser.has_printer)}</b>
            </p>
            <p className="dark: text-zinc-300 text-sm">
              Может проводить НК: <b>{formatBool(currentUser.can_host_night)}</b>
            </p>
            <p className="dark: text-zinc-300 text-sm">
              Есть права/машина:{" "}
              <b>{formatDriverLicense(currentUser.has_driver_license)}</b>
            </p>
            <p className="dark: text-zinc-300 text-sm">
              Год вступления в СТС: <b>{currentUser.year_of_admission}</b>
            </p>
            <p className="dark: text-zinc-300 text-sm">
              Статус: <b>{formatStatus(currentUser.status)}</b>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
