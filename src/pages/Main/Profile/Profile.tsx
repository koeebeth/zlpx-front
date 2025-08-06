import { FC } from "react";

import { useUser } from "../../../lib/contexts/UserContext";
import { ProfileDetails } from "../Search/ProfileDetails";

export const Profile: FC = () => {
  const { user, setUser, loading, error, updateUserProfile } = useUser();

  if (loading) {
    return (
      <div className="w-full p-4 text-center text-xl font-medium text-light-purple">
        Загрузка профиля...
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full p-4 text-center text-xl font-medium text-red-500">
        Ошибка: {error}
      </div>
    );
  }

  return (
    <>
      <div className="w-full p-4 text-center text-xl font-medium text-light-purple">
        Профиль
      </div>
      <ProfileDetails 
        user={user} 
        setUser={setUser} 
        updateUserProfile={updateUserProfile}
        isSelf={true}
        useContext={true}
      />
    </>
  );
};
