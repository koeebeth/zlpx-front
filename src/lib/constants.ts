export const enum TabsEnum {
  AUTH = "AUTH",
  MAIN = "MAIN",
  CALENDAR = "CALENDAR",
  SEARCH = "SEARCH",
  PROFILE = "PROFILE",
}

// API конфигурация
export const API_CONFIG = {
  // Базовый URL для API
  BASE_PATH: import.meta.env.VITE_API_BASE_URL || 'https://api.ingroupsts.ru',
};

// Переменные разработки
export const DEV_CONFIG = {
  // Пропустить Telegram аутентификацию в режиме разработки
  SKIP_TELEGRAM_AUTH: import.meta.env.VITE_SKIP_TELEGRAM_AUTH === 'true',
  // Показать отладочную информацию
  SHOW_DEBUG_INFO: import.meta.env.VITE_SHOW_DEBUG_INFO === 'true',
  // Тестовый пользователь для разработки
  DEV_USER: {
    id: 123456789,
    first_name: "Dev User",
    username: "dev_user",
    language_code: "ru"
  }
};