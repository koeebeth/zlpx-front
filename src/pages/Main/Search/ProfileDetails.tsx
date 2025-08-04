import { Avatar } from "@mui/material";
import { format } from "date-fns";
import { ru } from "date-fns/locale";
import { FC, useState } from "react";

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

type PropsT = {
  user: UserProfile;
  setUser: (payload: UserProfile) => void;
  isSelf?: boolean;
};

export const ProfileDetails: FC<PropsT> = ({ user, setUser, isSelf }) => {
  const [isEditingContacts, setIsEditingContacts] = useState(false);
  // const [isEditingPersonalInfo, setIsEditingPersonalInfo] = useState(false);
  return (
    <div className="flex flex-col gap-2 p-2 bg-zinc-300 flex-1 dark:bg-zinc-900 overflow-scroll">
      <div className="rounded-lg bg-zinc-400 dark:bg-zinc-800 flex items-center justify-between p-6 relative">
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
          <ContactForm user={user} onSubmit={(data: UserProfile) => {
            setUser(data);
            setIsEditingContacts(false);
          }} />
        ) : (
          <>
            <div className="animate-fadein">
              <h3 className="font-semibold text-lg mb-4 dark:text-zinc-200">
                {user ? `${user.full_name}` : "Имя Фамилия"}
              </h3>
              <h4 className="text-sm dark:text-zinc-400 mb-3 flex gap-2 items-center">
                <VkIcon />@{user?.vk_nickname}
              </h4>
              <h4 className="text-sm dark:text-zinc-400 mb-3 flex gap-2 items-center">
                <TelegramIcon />@{user?.telegram_nickname}
              </h4>
              <h4 className="text-sm dark:text-zinc-400 flex gap-2 items-center">
                <span className="material-icons md-16">phone</span>
                {user?.phone_number}
              </h4>
            </div>
          </>
        )}
        <Avatar sx={{ width: 100, height: 100, backgroundColor: "blueviolet" }}>
          ТУ
        </Avatar>
      </div>
      <div className="rounded-lg bg-zinc-400 dark:bg-zinc-800 p-6 relative">
        {isSelf && (
          <button className="absolute top-2 right-2">
            <span className="material-symbols-outlined dark:text-light-purple">
              edit_square
            </span>
          </button>
        )}
        <h4 className="dark:text-zinc-400 mb-4">Личная Информация</h4>
        <div className="flex flex-col gap-3">
          <p className="dark: text-zinc-300 text-sm">
            Живет возле станции: <b>{user?.live_metro_station.join(",")}</b>
          </p>
          <p className="dark: text-zinc-300 text-sm">
            Учится возле станции: <b>{user?.study_metro_station.join(",")}</b>
          </p>
          <p className="dark: text-zinc-300 text-sm">
            Дата рождения:{" "}
            <b>
              {format(new Date(user?.date_of_birth), "d MMMM yyyy", {
                locale: ru,
              })}
            </b>
          </p>
          <p className="dark: text-zinc-300 text-sm">
            Есть принтер: <b>{formatPrintInfo(user.has_printer)}</b>
          </p>
          <p className="dark: text-zinc-300 text-sm">
            Может проводить НК: <b>{formatBool(user.can_host_night)}</b>
          </p>
          <p className="dark: text-zinc-300 text-sm">
            Есть права/машина:{" "}
            <b>{formatDriverLicense(user.has_driver_license)}</b>
          </p>
          <p className="dark: text-zinc-300 text-sm">
            Год вступления в СТС: <b>{user.year_of_admission}</b>
          </p>
          <p className="dark: text-zinc-300 text-sm">
            Статус: <b>{formatStatus(user.status)}</b>
          </p>
        </div>
      </div>
    </div>
  );
};
