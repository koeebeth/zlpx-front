import { FC } from "react";

type PropsT = {
  onSubmit: () => void;
};

const inputClasses =
  "dark:bg-zinc-400 rounded-md px-6 py-2 outline-0 inset-shadow-sm/25";

export const NewEventForm: FC<PropsT> = ({ onSubmit }) => {
  return (
    <form action="" className="h-full relative">
      <div className="flex flex-col gap-6 w-full p-6 h-full">
        <input className={inputClasses} placeholder="Проект" />
        <input className={inputClasses} placeholder="Название события" />
        <input className={inputClasses} placeholder="Локация" />
        <input
          className={inputClasses}
          type="date"
          placeholder="Дата события"
        />
        <div className="flex-1 flex flex-col h-full justify-end">
          <button 
          className="w-full text-white px-2 py-3 bg-light-purple rounded-md shadow-lg"
          onClick={onSubmit}
          type="button"
          >
            Сохранить
          </button>
        </div>
      </div>
    </form>
  );
};
