import { FC } from "react";

export const SearchTab: FC = () => {
  return (
    <>
      <div className="w-full p-4 text-center text-xl font-medium text-light-purple">
        Поиск
      </div>
      <div className="h-12 w-full p-2 px-4">
        <div className="h-full w-full bg-zinc-300 rounded-md flex items-center justify-start px-2">
          <span className="material-icons material-icons-round md-24 text-zinc-400 mr-2">
            search
          </span>
          <input type="text" className="focus:outline-0" placeholder="Поиск" />
        </div>
      </div>
      <div className=" flex-1 dark:bg-zinc-900 p-4">
        <div className="grid grid-cols-2 items-stretch gap-4 mx-auto">
          <div className="h-20 bg-zinc-200 rounded-sm"></div>
          <div className="h-20 bg-x-purple rounded-sm"></div>
          <div className="h-20 bg-x-yellow rounded-sm"></div>
          <div className="h-20 bg-zinc-400 rounded-sm"></div>
        </div>
      </div>
    </>
  );
};
