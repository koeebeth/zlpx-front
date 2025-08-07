/**
 * Форматирует номер телефона для отображения в формате tel: ссылки
 */
export function formatPhoneNumber(phone: string): string {
  // Убираем все пробелы и символы кроме цифр
  const cleanPhone = phone.replace(/\D/g, '');
  
  // Если номер начинается с 8, заменяем на +7
  if (cleanPhone.startsWith('8') && cleanPhone.length === 11) {
    return `+7${cleanPhone.slice(1)}`;
  }
  
  // Если номер начинается с 7 и имеет 11 цифр
  if (cleanPhone.startsWith('7') && cleanPhone.length === 11) {
    return `+${cleanPhone}`;
  }
  
  // Если номер имеет 10 цифр, добавляем +7
  if (cleanPhone.length === 10) {
    return `+7${cleanPhone}`;
  }
  
  // Если уже в формате +7, возвращаем как есть
  if (cleanPhone.startsWith('+7')) {
    return cleanPhone;
  }
  
  // Fallback - возвращаем исходный номер
  return phone;
}

/**
 * Создает ссылку на Telegram
 */
export function createTelegramLink(username: string): string {
  // Убираем @ если есть
  const cleanUsername = username.replace(/^@/, '');
  return `https://t.me/${cleanUsername}`;
}

/**
 * Создает ссылку на VK
 */
export function createVkLink(username: string): string {
  // Убираем @ если есть
  const cleanUsername = username.replace(/^@/, '');
  return `https://vk.com/${cleanUsername}`;
}

/**
 * Создает ссылку на телефон, совместимую с iPhone
 */
export function createPhoneLink(phone: string): string {
  const formattedPhone = formatPhoneNumber(phone);
  
  // Для iPhone важно использовать правильный формат
  // Убираем все пробелы и символы из номера для ссылки
  const cleanPhoneForLink = formattedPhone.replace(/\s+/g, '');
  
  return `tel:${cleanPhoneForLink}`;
}

/**
 * Форматирует номер телефона для красивого отображения
 */
export function formatPhoneDisplay(phone: string): string {
  const formatted = formatPhoneNumber(phone);
  
  // Форматируем для отображения: +7 (999) 123-45-67
  if (formatted.startsWith('+7') && formatted.length === 12) {
    const number = formatted.slice(2);
    return `+7 (${number.slice(0, 3)}) ${number.slice(3, 6)}-${number.slice(6, 8)}-${number.slice(8)}`;
  }
  
  return formatted;
} 