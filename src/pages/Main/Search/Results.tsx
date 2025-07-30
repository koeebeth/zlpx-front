import { FC, useState } from "react";

enum SearchTabEnum {
  PROFILES,
  DOCUMENTS,
  PHOTOS,
}

const activeTabClasses =
  "rounded-full bg-light-purple p-2 px-4 text-xs text-zinc-50 transition-all ease-in duration-100";
const tabClasses = "rounded-full bg-zinc-600 p-2 px-4 text-xs text-zinc-300 transition-all ease-in duration-100";

export const Results: FC = () => {
  const [activeTab, setActiveTab] = useState<SearchTabEnum | null>(null);

  return (
    <div className="flex-1 animate-fadein">
      <div className="flex justify-start px-4 py-2 gap-2">
        <div
          className={
            activeTab === SearchTabEnum.PROFILES ? activeTabClasses : tabClasses
          }
          onClick={() => setActiveTab(SearchTabEnum.PROFILES)}
        >
          Профили
        </div>
        <div
          className={
            activeTab === SearchTabEnum.DOCUMENTS
              ? activeTabClasses
              : tabClasses
          }
          onClick={() => setActiveTab(SearchTabEnum.DOCUMENTS)}
        >
          Документы
        </div>
        <div
          className={
            activeTab === SearchTabEnum.PHOTOS ? activeTabClasses : tabClasses
          }
          onClick={() => setActiveTab(SearchTabEnum.PHOTOS)}
        >
          Фото
        </div>
      </div>
    </div>
  );
};
