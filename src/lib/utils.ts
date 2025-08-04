import { format, isToday, isTomorrow } from "date-fns";
import { ru } from "date-fns/locale";

export const formatCalendarDate = (date: string): string => {
  const dateObj = new Date(date);
  return `${format(dateObj, "EEEE", { locale: ru }).toUpperCase()} · ${format(dateObj, "d MMMM", { locale: ru })}${isToday(dateObj) ? " · Сегодня" : ""}${isTomorrow(dateObj) ? " · Завтра" : ""}`;
};

export const formatCalendarTime = (date: string): string => {
  const dateObj = new Date(date);
  return format(dateObj, "p", { locale: ru });
};

export const formatBool = (val: boolean) => {
  return val ? "Да" : "Нет";
};

export const formatPrintInfo = (info: number) => {
  switch (info) {
    case 1:
      return "Ч/Б";
    case 2:
      return "Цветной";
    case 3:
      return "Ч/Б + Цветной";
    default:
      return "Нет";
  }
};

export const formatDriverLicense = (info: number) => {
  switch (info) {
    case 1:
      return "Только права";
    case 2:
      return "Права + Машина";
    default:
      return "Нет";
  }
};

export const formatStatus = (info: number) => {
  switch (info) {
    case 1:
      return "?";
    case 2:
      return "Активный";
    case 3:
      return "Выпускник";
    default:
      return "Неактивный";
  }
};
