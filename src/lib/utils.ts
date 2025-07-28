import { format } from "date-fns";
import { ru } from "date-fns/locale";

export const formatCalendarDate = (date: string): string => {
  const dateObj = new Date(date);
  return `${format(dateObj, "EEEE", { locale: ru }).toUpperCase()}, ${format(dateObj, "d MMMM", { locale: ru })}`;
};

export const formatCalendarTime = (date: string): string => {
  const dateObj = new Date(date);
  return format(dateObj, "p", { locale: ru });
};
