import { FC, useState } from "react";

import { Results } from "./Results";

export const SearchPage: FC = () => {
  const [searchFocus, setSearchFocus] = useState(false);
  return (
    <>
      <div className="h-12 w-screen p-2 px-4 gap-2 overflow-hidden flex">
        <div
          className={`h-full w-full ${!searchFocus && "shrink-0"} bg-zinc-300 rounded-md flex items-center justify-start pl-2 transition-all ease-out`}
        >
          <span className="material-icons material-icons-round md-24 text-zinc-400 mr-2">
            search
          </span>
          <input
            type="text"
            className="focus:outline-0"
            placeholder="Поиск"
            onFocus={() => setSearchFocus(true)}
          />
        </div>
        <button
          onClick={() => setSearchFocus(false)}
          className={`text-light-purple animate-slide inline transition-all duration-200 ease-out ${!searchFocus && "opacity-5"}`}
        >
          Отмена
        </button>
      </div>
      {searchFocus ? (
        <Results />
      ) : (
        <div className="flex-1 dark:bg-zinc-900 p-4">
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-center">
              <div className="text-6xl mb-4">🚧</div>
              <h2 className="text-2xl font-bold text-zinc-300 mb-2">Поиск</h2>
              <p className="text-zinc-500">Функция находится в разработке</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
