import { FC, useState } from "react";

import { TabsEnum } from "../../lib/constants";
import { BottomBar } from "./BottomBar";
import { CalendarTab } from "./Calendar/Calendar";
import { Profile } from "./Profile/Profile";
import { SearchTab } from "./Search/Search";

export const MainPage: FC = () => {
  const [activeTab, setActiveTab] = useState(TabsEnum.CALENDAR);

  return (
    <div className="w-screen h-screen flex flex-col bg-zinc-100 dark:bg-zinc-800">
      <div className="w-full grow overflow-hidden flex flex-col">
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
