import { FC } from "react";

import { CalendarEventT } from "../../../store/calendar/state";

type PropsT = {
  event: CalendarEventT;
};

export const CalendarBlock: FC<PropsT> = ({ event }) => {
  return (
    <div className="self-stretch">
        <p className="text-lg mb-1 dark:text-zinc-200">{event.title}</p>
        <p className="text-sm mb-2 dark:text-zinc-400">{event.project}</p>
        <p className="text-xs text-zinc-400 font-light">{event.location}</p>
    </div>
  );
};
