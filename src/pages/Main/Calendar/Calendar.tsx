import { FC } from "react";
import { useSelector } from "react-redux";

import { selectCalendarEvents } from "../../../store/calendar/selectors";
import { CalendarEventT } from "../../../store/calendar/state";
import { CalendarBlock } from "./CalendarBlock";

export const CalendarTab: FC = () => {
  const events = useSelector(selectCalendarEvents);
  return (
    <>
      <div className="w-full p-4 text-center text-xl font-medium text-light-purple">Расписание</div>
      <div className="flex flex-col items-center overflow-scroll bg-white grow dark:bg-zinc-900">
        {events.map((evt: CalendarEventT, idx) => (
					<div className="w-full">
          <CalendarBlock event={evt} />
					{idx !== (events.length - 1) && <div className="h-0.5 mx-auto w-11/12 m-0 bg-zinc-200 dark:bg-zinc-700"></div>}
					</div>
        ))}
      </div>
    </>
  );
};
