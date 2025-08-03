import { FC, useState } from "react";

import { Loader } from "../../../components/Loader";
import { useGetScheduleQuery } from "../../../store/api/api";
import { CalendarBlock } from "./CalendarBlock";
import { NewEventTab } from "./NewEvent/NewEvent";
import { Filter } from "./Filter/Filter";

export const CalendarTab: FC = () => {
  const [bottomPanelOpen, setBottomPanelOpen] = useState(false);
  const [filterOptions] = useState(() => {
    const start = new Date();
    
    return {
      start: start.toISOString().split('T')[0],
    };
  });
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
      {/* <Filter options={filterOptions} setOptions={setFilterOptions} /> */}
      <div className="flex flex-col items-center overflow-scroll bg-white grow dark:bg-zinc-900">
        {isLoading ? (
          <Loader />
        ) : (
          eventsData?.map((evt, idx) => (
            <div className="w-full">
              <CalendarBlock event={evt} />
              {idx !== eventsData.length - 1 && (
                <div className="h-0.5 mx-auto w-11/12 m-0 bg-zinc-200 dark:bg-zinc-700"></div>
              )}
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
