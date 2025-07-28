import { Avatar } from "@mui/material";
import { FC } from "react";

export const Profile: FC = () => {
  return (
    <>
      <div className="w-full p-4 text-center text-xl font-medium text-light-purple">
        Профиль
      </div>
      <div className="flex flex-col p-2 bg-zinc-300 flex-1 dark:bg-zinc-900">
        <div className="rounded-lg bg-zinc-400 dark:bg-zinc-800 h-28 flex items-center justify-between p-2 px-6">
        <div>
            <h4 className="mb-2 text-sm dark:text-zinc-400">туту</h4>
            <h3 className="font-semibold mb-2 dark:text-zinc-200">Тутуту Тутуту</h3>
            <h4 className="text-x-purple text-sm dark:text-light-purple">тутуту</h4>
        </div>
          <Avatar
          sx={{width: 70, height: 70}}>ТУ</Avatar>
        </div>
      </div>
    </>
  );
};
