import { FC, useState } from "react";

import { TabsEnum } from "../../lib/constants";
import { useUser } from "../../lib/contexts/UserContext";
import { Loader } from "../../components/Loader";
import { BottomBar } from "./BottomBar";
import { CalendarTab } from "./Calendar/Calendar";
import { Profile } from "./Profile/Profile";
import { SearchTab } from "./Search/Search";

export const MainPage: FC = () => {
  const [activeTab, setActiveTab] = useState(TabsEnum.CALENDAR);
  const { loading, isInitialized } = useUser();

  // Показываем загрузку пока профиль не инициализирован
  if (!isInitialized || loading) {
    return <Loader />;
  }

  return (
    <div className="w-screen h-screen flex flex-col bg-zinc-100 dark:bg-zinc-800">
      <div className="w-full overflow-hidden flex flex-col flex-1">
        {activeTab === TabsEnum.CALENDAR && (
          <CalendarTab />
        )}
        {activeTab === TabsEnum.SEARCH && <SearchTab />}
        {activeTab === TabsEnum.PROFILE && <Profile />}
      </div>
      <BottomBar onChangeTab={setActiveTab} activeTab={activeTab} />
    </div>
  );
};
