import inactiveSvg from '../assets/inactive.png';
import activePng from '../assets/active.png';
import gradSvg from '../assets/grad.svg';

/**
 * Возвращает цвет аватарки в зависимости от статуса пользователя
 */
export function getAvatarColor(status: number): string {
  // Статусы 0 и 1 - неактивные
  if (status === 0 || status === 1) {
    return "#8B5CF6"; // Фиолетовый
  }
  
  // Статус 2 - активный
  if (status === 2) {
    return "#10B981"; // Зеленый
  }
  
  // Статус 3 - выпускник
  if (status === 3) {
    return "#F59E0B"; // Оранжевый
  }
  
  // Статус 4 - grad
  if (status === 4) {
    return "#EF4444"; // Красный
  }
  
  // Fallback
  return "#6B7280"; // Серый
}

/**
 * Возвращает путь к изображению аватарки в зависимости от статуса пользователя
 */
export function getAvatarImage(status: number): string {
  // Статусы 0 и 1 - неактивные
  if (status === 0 || status === 1) {
    return inactiveSvg;
  }
  
  // Статус 2 - активный
  if (status === 2) {
    return activePng;
  }
  
  // Статус 3 - выпускник (используем active.png)
  if (status === 3) {
    return gradSvg;
  }

  
  // Fallback
  return inactiveSvg;
}

/**
 * Возвращает текст аватарки в зависимости от статуса пользователя (fallback)
 */
export function getAvatarText(status: number): string {
  // Статусы 0 и 1 - неактивные
  if (status === 0 || status === 1) {
    return "НЕ";
  }
  
  // Статус 2 - активный
  if (status === 2) {
    return "АК";
  }
  
  // Статус 3 - выпускник
  if (status === 3) {
    return "ВЫ";
  }
  
  // Статус 4 - grad
  if (status === 4) {
    return "ГР";
  }
  
  // Fallback
  return "??";
} 