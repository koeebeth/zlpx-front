
export enum UserStatus {
  INACTIVE,
  WORK,
  ACTIVE,
  GRADUATED,
}

export enum UserDriverLicense {
  NO,
  YES,
  YES_AND_CAR,
}

export enum UserPrinter {
  NO,
  BLACK,
  COLOR,
  BLACK_AND_COLOR,
}

export const UserStatusDesc = {
    [UserStatus.INACTIVE]: "Неактивный",
    [UserStatus.WORK]: "Работает",
    [UserStatus.ACTIVE]: "Активный",
    [UserStatus.GRADUATED]: "Выпускник",
}

export const UserDriverLicenseDesc = {
    [UserDriverLicense.NO]: "Нет",
    [UserDriverLicense.YES]: "Только права",
    [UserDriverLicense.YES_AND_CAR]: "Права + Машина",
}

export const UserPrinterDesc = {
    [UserPrinter.NO]: "Нет",
    [UserPrinter.BLACK]: "Ч/Б",
    [UserPrinter.COLOR]: "Цветной",
    [UserPrinter.BLACK_AND_COLOR]: "Ч/Б + Цветной",
}