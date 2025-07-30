import { FC, useEffect, useState } from "react";

import { NewEventForm } from "./NewEventForm";

type PropsT = {
  bottomPanelOpen: boolean;
  onClose: () => void;
};

export const NewEventTab: FC<PropsT> = ({ onClose }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const onClosePanel = () => {
    setIsVisible(false);
    onClose();
  };
  return (
    <>
      <div
        className={`h-screen w-screen z-50 absolute top-0 left-0 overflow-hidden transition-all ease-in-out ${isVisible ? "bg-black/50" : "bg-transparent"}`}
        onClick={(e) => {
            if (e.target !== e.currentTarget) return;
            onClosePanel();
        }}
      >
        <div
          className={`z-50 h-10/12 w-screen flex flex-col bg-zinc-100 dark:bg-zinc-800 absolute transition-all duration-300 ease-out rounded-t-4xl shadow-sm ${isVisible ? "bottom-0" : "-bottom-full"}`}
        >
          <div className="w-full p-4 text-center text-xl font-medium text-light-purple relative">
            Новое Событие
            <button
              className="flex justify-center items-center absolute top-5 right-6 text-2xl"
              onClick={onClosePanel}
            >
              <span className="material-icons material-icons-round">
                close
              </span>
            </button>
          </div>
          <div className="flex-1 pb-8">
            <NewEventForm onSubmit={onClosePanel} />
          </div>
        </div>
      </div>
      )
    </>
  );
};
