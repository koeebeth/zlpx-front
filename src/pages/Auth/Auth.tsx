import type { FC } from "react";

import { TabsEnum } from "../../lib/constants";

type PropsT = {
  onChangeTab: (tab: TabsEnum) => void;
  isTelegramReady?: boolean;
};

export const AuthPage: FC<PropsT> = (props) => {
  return (
    <div className="h-screen w-screen m-0 bg-zinc-100 dark:bg-zinc-900 flex flex-col justify-between">
      <div className="flex h-full items-center justify-center relative">
        <h1 className="text-6xl text-center font-extrabold text-x-purple m-0 p-0">
          РИМ
        </h1>
        {props.isTelegramReady && (
          <div className="absolute top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm">
            Telegram
          </div>
        )}
      </div>
      <div className="flex flex-col items-center w-screen px-3 pb-10 box-border">
        <button
          onClick={() => props.onChangeTab(TabsEnum.MAIN)}
          className="w-full text-white px-2 py-3 bg-x-purple rounded-md"
        >
          {props.isTelegramReady ? 'Продолжить' : 'Войти'}
        </button>
      </div>
    </div>
  );
};
