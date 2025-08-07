import { groupBy, isEmpty, map } from "lodash";
import { FC, useState } from "react";

import { Loader } from "../../../components/Loader";
import { formatCalendarDate } from "../../../lib/utils";
import { useGetScheduleQuery } from "../../../store/api/api";
import { CalendarBlock } from "./CalendarBlock";
import { NewEventTab } from "./NewEvent/NewEvent";

export const CalendarTab: FC = () => {
  const today = new Date().toISOString().split("T")[0];
  const [bottomPanelOpen, setBottomPanelOpen] = useState(false);
  const [filterOptions] = useState(() => ({
    start: today,
  }));
  const {
    data: eventsData,
    isLoading,
    error,
  } = useGetScheduleQuery(filterOptions);

  if (error) {
    console.log(error);
  }

  const onCloseBottomPanel = () => {
    setTimeout(() => setBottomPanelOpen(false), 300);
  };

  const events = { [today]: [], ...groupBy(eventsData, "datetime") };

  return (
    <>
      <div className="w-full p-4 text-center text-xl font-medium text-light-purple relative">
        Расписание
      </div>
      {/* <Filter options={filterOptions} setOptions={setFilterOptions} /> */}
      <div className="flex flex-col items-center gap-2 overflow-scroll bg-white grow dark:bg-zinc-900 p-2">
        {isLoading ? (
          <Loader />
        ) : (
          map(events, (dayEvents, date) => (
            <div key={date} className="w-full bg-zinc-800 rounded-md p-4">
              <h3 className="uppercase text-zinc-500 mb-3 text-sm">
                {formatCalendarDate(date)}
              </h3>
              {isEmpty(dayEvents) && <p className="text-lg mb-1 dark:text-zinc-600">Нет событий</p>}
              {map(dayEvents, (evt, idx) => (
                <div key={`${date}-${idx}`}>
                  <CalendarBlock event={evt} />
                  {idx !== dayEvents.length - 1 && (
                    <div className="h-0.5 mx-auto w-full m-0 bg-zinc-200 dark:bg-zinc-700 my-4"></div>
                  )}
                </div>
              ))}
            </div>
          ))
        )}
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
