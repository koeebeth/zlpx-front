import { FC } from "react";

type OptionT = {
  start: string;
  end: string;
};

type PropsT = {
  setOptions: (options: OptionT) => void;
  options: OptionT;
};

export const Filter: FC<PropsT> = ({ setOptions, options }) => {
  return (
    <div className="flex py-4 px-6 border-b-1 border-zinc-800 justify-between items-center bg-zinc-900">
      <div className="flex justify-between items-center gap-2">
        <label className="dark:text-zinc-500 text-xs">От:</label>
        <input
          className="border-light-purple border-1 rounded-md outline-0 dark:text-zinc-400 p-1 mr-3 text-sm"
          type="date"
          onChange={(e) => setOptions({ ...options, start: e.target.value })}
        />
      </div>
      <div className="flex justify-between items-center gap-2" >
        <label className="dark:text-zinc-500 text-xs">До:</label>
        <input
          className="border-light-purple border-1 rounded-md outline-0 dark:text-zinc-400 p-1 text-sm"
          type="date"
          onChange={(e) => setOptions({ ...options, end: e.target.value })}
        />
      </div>
    </div>
  );
};
