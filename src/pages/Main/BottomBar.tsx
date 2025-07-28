import { FC, useState } from "react";

import { TabsEnum } from "../../lib/constants";

type PropsT = {
  onChangeTab: (tab: TabsEnum) => void;
  activeTab: TabsEnum;
};

const buttonClasses = "text-zinc-400 font-extrabold";
const buttonClassesActive = `text-light-purple font-extrabold`;

export const BottomBar: FC<PropsT> = ({ activeTab, onChangeTab }) => {
  const [effect, setEffect] = useState(false);

  return (
    <div className="w-full h-20 bg-zinc-200 dark:bg-zinc-800 border-t-[1px] border-zinc-300 dark:border-zinc-700 flex justify-around items-start py-2 flex-none">
      <button
        className={
          activeTab === TabsEnum.CALENDAR
            ? `${buttonClassesActive} ${effect && "animate-touch"}`
            : buttonClasses
        }
        onClick={() => {
          onChangeTab(TabsEnum.CALENDAR);
          setEffect(true);
        }}
        onAnimationEnd={() => setEffect(false)}
      >
        <span className="material-icons material-icons-round md-36">
          view_list
        </span>
      </button>
      <button
        className={
          activeTab === TabsEnum.SEARCH
            ? `${buttonClassesActive} ${effect && "animate-touch"}`
            : buttonClasses
        }
        onClick={() => {
          onChangeTab(TabsEnum.SEARCH);
          setEffect(true);
        }}
        onAnimationEnd={() => setEffect(false)}
      >
        <span className="material-icons material-icons-round md-36">
          search
        </span>
      </button>
      <button
        className={
          activeTab === TabsEnum.PROFILE
            ? `${buttonClassesActive} ${effect && "animate-touch"}`
            : buttonClasses
        }
        onClick={() => {
          onChangeTab(TabsEnum.PROFILE);
          setEffect(true);
        }}
        onAnimationEnd={() => setEffect(false)}
      >
        <span className="material-icons material-icons-round md-36">
          account_circle
        </span>
      </button>
    </div>
  );
};
