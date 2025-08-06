export const enum TabsEnum {
  AUTH = "AUTH",
  MAIN = "MAIN",
  CALENDAR = "CALENDAR",
  SEARCH = "SEARCH",
  PROFILE = "PROFILE",
}

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