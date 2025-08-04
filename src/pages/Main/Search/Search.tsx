import { FC } from "react";

import { SearchPage } from "./SearchPage";

export const SearchTab: FC = () => {
  return (
    <>
      <div className="w-full p-4 text-center text-xl font-medium text-light-purple">
        Поиск
      </div>
      <SearchPage />
    </>
  );
};
