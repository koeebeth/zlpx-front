import { FC, useState } from "react";
import { useSelector } from "react-redux";

import { selectCalendarEvents } from "../../../store/calendar/selectors";
import { CalendarEventT } from "../../../store/calendar/state";
import { CalendarBlock } from "./CalendarBlock";
import { NewEventTab } from "./NewEvent/NewEvent";

export const CalendarTab: FC = () => {
  const events = useSelector(selectCalendarEvents);
  const [bottomPanelOpen, setBottomPanelOpen] = useState(false);

  const onCloseBottomPanel = () => {
    setTimeout(() => setBottomPanelOpen(false), 300);
  };

  return (
    <>
      <div className="w-full p-4 text-center text-xl font-medium text-light-purple relative">
        Расписание
        <button
          className="flex justify-center items-center absolute top-5 right-4"
          onClick={() => setBottomPanelOpen(true)}
        >
          <span className="material-icons material-icons-round">add</span>
        </button>
      </div>
      <div className="flex flex-col items-center overflow-scroll bg-white grow dark:bg-zinc-900">
        {events.map((evt: CalendarEventT, idx: number) => (
          <div className="w-full">
            <CalendarBlock event={evt} />
            {idx !== events.length - 1 && (
              <div className="h-0.5 mx-auto w-11/12 m-0 bg-zinc-200 dark:bg-zinc-700"></div>
            )}
          </div>
        ))}
      </div>
      {bottomPanelOpen && (
        <NewEventTab
          onClose={onCloseBottomPanel}
          bottomPanelOpen={bottomPanelOpen}
        />
      )}
    </>
  );
};
