// Утилиты для работы с Telegram Mini App

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
}

export interface TelegramInitData {
  query_id?: string;
  user?: TelegramUser;
  receiver?: TelegramUser;
  chat?: any;
  chat_type?: string;
  chat_instance?: string;
  start_param?: string;
  can_send_after?: number;
  auth_date?: number;
  hash?: string;
}

export class TelegramService {
  private static instance: TelegramService;
  private user: TelegramUser | null = null;
  private initData: string | null = null;

  static getInstance(): TelegramService {
    if (!TelegramService.instance) {
      TelegramService.instance = new TelegramService();
    }
    return TelegramService.instance;
  }

  async initialize(): Promise<void> {
    try {
      // Получаем данные из localStorage
      const storedUser = localStorage.getItem('telegram_user');
      const storedInitData = localStorage.getItem('telegram_init_data');

      if (storedUser) {
        this.user = JSON.parse(storedUser);
      }

      if (storedInitData) {
        this.initData = storedInitData;
      }

      // Если данных нет, пробуем получить из window.Telegram
      if (!this.user || !this.initData) {
        const telegramWebApp = (window as any).Telegram?.WebApp;
        if (telegramWebApp) {
          if (!this.user && telegramWebApp.initDataUnsafe?.user) {
            this.user = telegramWebApp.initDataUnsafe.user;
            localStorage.setItem('telegram_user', JSON.stringify(this.user));
          }

          if (!this.initData && telegramWebApp.initData) {
            this.initData = telegramWebApp.initData;
            localStorage.setItem('telegram_init_data', this.initData);
          }
        }
      }
    } catch (error) {
      console.error('Ошибка инициализации TelegramService:', error);
    }
  }

  getUser(): TelegramUser | null {
    return this.user;
  }

  getInitData(): string | null {
    return this.initData;
  }

  async authenticateWithBackend(): Promise<boolean> {
    try {
      if (!this.initData) {
        console.error('Init data не найден');
        return false;
      }

      const response = await fetch('/auth/telegram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          init_data: this.initData!,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Аутентификация успешна:', result);
        return true;
      } else {
        console.error('Ошибка аутентификации:', response.statusText);
        return false;
      }
    } catch (error) {
      console.error('Ошибка при аутентификации:', error);
      return false;
    }
  }

  showAlert(message: string): void {
    const telegramWebApp = (window as any).Telegram?.WebApp;
    if (telegramWebApp?.showAlert) {
      try {
        telegramWebApp.showAlert(message);
      } catch (error) {
        console.warn('showAlert не поддерживается в этой версии Telegram Web App:', error);
        // Fallback на обычный alert
        alert(message);
      }
    } else {
      alert(message);
    }
  }

  showConfirm(message: string): Promise<boolean> {
    return new Promise((resolve) => {
      const telegramWebApp = (window as any).Telegram?.WebApp;
      if (telegramWebApp?.showConfirm) {
        telegramWebApp.showConfirm(message, (confirmed: boolean) => {
          resolve(confirmed);
        });
      } else {
        resolve(confirm(message));
      }
    });
  }

  close(): void {
    const telegramWebApp = (window as any).Telegram?.WebApp;
    if (telegramWebApp?.close) {
      telegramWebApp.close();
    }
  }

  expand(): void {
    const telegramWebApp = (window as any).Telegram?.WebApp;
    if (telegramWebApp?.expand) {
      telegramWebApp.expand();
    }
  }

  isTelegramWebApp(): boolean {
    return !!(window as any).Telegram?.WebApp;
  }
}

export const telegramService = TelegramService.getInstance(); 