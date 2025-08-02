import { FC } from "react";

import { formatCalendarDate } from "../../../lib/utils";
import { CalendarEventT } from "../../../store/calendar/state";

type PropsT = {
  event: CalendarEventT;
};

export const CalendarBlock: FC<PropsT> = ({ event }) => {
  return (
    <div className="p-4 pb-3 self-stretch">
      <div className="text-zinc-500 font-medium flex justify-between mb-4 text-sm">
        <h3 className="uppercase">{formatCalendarDate(event.datetime)}</h3>
        {/* <h4>{formatCalendarTime(event.datetime)}</h4> */}
      </div>
        <p className="text-lg mb-1 dark:text-zinc-200">{event.title}</p>
        <p className="text-sm mb-2 dark:text-zinc-200">{event.project}</p>
        <p className="text-xs text-zinc-400 font-light">{event.location}</p>
    </div>
  );
};
