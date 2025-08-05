import type { FC } from "react";

import { TabsEnum } from "../../lib/constants";

type PropsT = {
  onChangeTab: (tab: TabsEnum) => void;
};

export const AuthPage: FC<PropsT> = (props) => {
  return (
    <div className="h-screen w-screen m-0 bg-zinc-100 dark:bg-zinc-900 flex flex-col justify-between">
      <div className="flex h-full items-center justify-center relative">
        <h1 className="text-6xl text-center font-extrabold text-x-purple m-0 p-0">
          РИМ
        </h1>
      </div>
      <div className="flex flex-col items-center w-screen px-3 pb-10 box-border">
        <a
          href="https://t.me/ingroupsts_org_bot/RIM"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full text-white px-2 py-3 bg-x-purple rounded-md text-center block"
        >
          Войти через Telegram
        </a>
      </div>
    </div>
  );
};
