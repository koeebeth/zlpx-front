import { FC, useState } from "react";

import { UserProfile } from "../../../types";
import { ProfileDetails } from "../Search/ProfileDetails";

export const Profile: FC = () => {
  const [user, setUser] = useState<UserProfile>({
    telegram_id: 6666666,
    status: 0,
    live_metro_station: ["Станция"],
    study_metro_station: ["Станция"],
    year_of_admission: 2025,
    has_driver_license: 1,
    date_of_birth: "2004-01-11",
    has_printer: 1,
    can_host_night: false,
    full_name: "Имя Фамилия",
    vk_nickname: "username",
    telegram_nickname: "username",
    phone_number: "+7 111 111 11 11",
  });

  return (
    <>
      <div className="w-full p-4 text-center text-xl font-medium text-light-purple">
        Профиль
      </div>
      <ProfileDetails user={user} setUser={setUser} isSelf={true} />
    </>
  );
};
