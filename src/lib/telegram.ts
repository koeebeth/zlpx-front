// Утилиты для работы с Telegram Mini App
import { logger } from './logger';
import { API_CONFIG } from './constants';

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
      logger.log('🚀 Инициализация TelegramService...');
      
      // Получаем данные из localStorage
      const storedUser = localStorage.getItem('telegram_user');
      const storedInitData = localStorage.getItem('telegram_init_data');

      logger.log('📦 Данные из localStorage:', {
        storedUser: !!storedUser,
        storedInitData: !!storedInitData,
        storedInitDataLength: storedInitData?.length || 0
      });

      if (storedUser) {
        this.user = JSON.parse(storedUser);
        logger.log('✅ Пользователь восстановлен из localStorage:', this.user);
        this.showAlert('📱 Пользователь восстановлен из localStorage');
      }

      if (storedInitData) {
        this.initData = storedInitData;
        logger.log('✅ Init data восстановлен из localStorage, длина:', this.initData.length);
        this.showAlert('📱 Init data восстановлен из localStorage');
      }

      // Если данных нет, пробуем получить из window.Telegram
      logger.log('🔍 Проверяем window.Telegram...');
      const telegramWebApp = (window as any).Telegram?.WebApp;
      logger.log('📱 Telegram WebApp:', {
        exists: !!telegramWebApp,
        hasInitData: !!(telegramWebApp?.initData),
        hasInitDataUnsafe: !!(telegramWebApp?.initDataUnsafe),
        initDataLength: telegramWebApp?.initData?.length || 0
      });
      
      if (!this.user || !this.initData) {
        if (telegramWebApp) {
          this.showAlert('🔍 Telegram WebApp найден');
          
          if (!this.user && telegramWebApp.initDataUnsafe?.user) {
            this.user = telegramWebApp.initDataUnsafe.user;
            localStorage.setItem('telegram_user', JSON.stringify(this.user));
            this.showAlert(`👤 Пользователь получен: ${this.user?.first_name || 'Unknown'} (ID: ${this.user?.id || 'Unknown'})`);
          }

          if (!this.initData && telegramWebApp.initData) {
            this.initData = telegramWebApp.initData;
            if (this.initData) {
              localStorage.setItem('telegram_init_data', this.initData);
              this.showAlert(`🔑 Init data получен: ${this.initData.substring(0, 50)}...`);
              logger.log('🔑 Init data получен из Telegram WebApp:', {
                length: this.initData.length,
                preview: this.initData.substring(0, 100),
                full: this.initData
              });
            } else {
              logger.warn('⚠️ Init data пустой в Telegram WebApp');
            }
          }
          
          // Сохраняем полную информацию для отладки
          localStorage.setItem('debug_telegram_webapp', JSON.stringify({
            initData: telegramWebApp.initData,
            initDataUnsafe: telegramWebApp.initDataUnsafe,
            version: telegramWebApp.version,
            platform: telegramWebApp.platform,
            colorScheme: telegramWebApp.colorScheme,
            themeParams: telegramWebApp.themeParams,
            isExpanded: telegramWebApp.isExpanded,
            viewportHeight: telegramWebApp.viewportHeight,
            viewportStableHeight: telegramWebApp.viewportStableHeight,
            headerColor: telegramWebApp.headerColor,
            backgroundColor: telegramWebApp.backgroundColor,
            isClosingConfirmationEnabled: telegramWebApp.isClosingConfirmationEnabled,
            backButton: telegramWebApp.backButton,
            mainButton: telegramWebApp.mainButton,
            HapticFeedback: telegramWebApp.HapticFeedback,
          }));
        } else {
          this.showAlert('❌ Telegram WebApp не найден');
          console.warn('⚠️ Telegram WebApp не найден - приложение запущено не в Telegram');
        }
      }
      
      // Финальная проверка состояния
      console.log('📊 Финальное состояние TelegramService:', {
        hasUser: !!this.user,
        hasInitData: !!this.initData,
        initDataLength: this.initData?.length || 0,
        isTelegramWebApp: this.isTelegramWebApp()
      });
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      this.showAlert(`💥 Ошибка инициализации: ${errorMessage}`);
      localStorage.setItem('debug_init_error', errorMessage);
      console.error('❌ Ошибка инициализации TelegramService:', error);
    }
  }

  getUser(): TelegramUser | null {
    return this.user;
  }

  getInitData(): string | null {
    return this.initData;
  }

  saveUserProfile(userProfile: any): void {
    if (userProfile) {
      localStorage.setItem('user_profile', JSON.stringify(userProfile));
      console.log('Профиль пользователя сохранен в localStorage:', userProfile);
      this.showAlert('💾 Профиль пользователя сохранен');
    }
  }

  async authenticateWithBackend(): Promise<{ success: boolean; userProfile?: any }> {
    try {
      console.log('🔍 Начинаем аутентификацию с бэкендом');
      console.log('🔍 Init data:', {
        exists: !!this.initData,
        length: this.initData?.length || 0,
        value: this.initData
      });
      
      // Если initData нет, используем тестовые данные для разработки
      let initDataToUse = this.initData || '';
      if (!initDataToUse) {
        console.warn('⚠️ Init data не найден, используем тестовые данные');
        initDataToUse = 'user=%7B%22id%22%3A123456789%2C%22first_name%22%3A%22Test%22%7D&auth_date=1234567890&hash=test_hash';
        this.showAlert('⚠️ Используем тестовые данные для разработки');
      }

      // Отладочная информация
      this.showAlert(`🔍 Отправляем запрос с init_data: ${initDataToUse.substring(0, 100)}...`);
      
      // Сохраняем данные для отладки
      localStorage.setItem('debug_init_data', initDataToUse);
      localStorage.setItem('debug_request_time', new Date().toISOString());

      const requestBody = {
        init_data: initDataToUse,
      };
      
      localStorage.setItem('debug_request_body', JSON.stringify(requestBody));
      
      const url = `${API_CONFIG.BASE_PATH}/auth/telegram`;
      
      console.log('🚀 Отправляем запрос на аутентификацию:', {
        url: url,
        method: 'POST',
        body: requestBody
      });
      
      console.log(`📡 Отправляем запрос на ${url}`);
      console.log(`📦 RequestBody:`, requestBody);
      console.log(`📦 RequestBody JSON:`, JSON.stringify(requestBody));

      console.log('🔄 Отправляем fetch запрос...');
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      console.log('✅ Fetch запрос завершен, получен response');

      // Сохраняем ответ для отладки
      localStorage.setItem('debug_response_status', response.status.toString());
      localStorage.setItem('debug_response_ok', response.ok.toString());
      
      console.log('📡 Получен ответ от сервера:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries())
      });

      if (response.ok) {
        const result = await response.json();
        localStorage.setItem('debug_response_data', JSON.stringify(result));
        console.log('✅ Аутентификация успешна, получены данные:', result);
        this.showAlert('✅ Аутентификация успешна!');
        return { 
          success: true, 
          userProfile: result.user_profile 
        };
      } else {
        const errorText = await response.text();
        localStorage.setItem('debug_error_response', errorText);
        logger.error('❌ Ошибка аутентификации:', {
          status: response.status,
          statusText: response.statusText,
          errorText
        });
        this.showAlert(`❌ Ошибка аутентификации: ${response.status} - ${response.statusText}`);
        return { success: false };
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      localStorage.setItem('debug_error', errorMessage);
      localStorage.setItem('debug_error_stack', error instanceof Error ? error.stack || '' : '');
      logger.error('💥 Ошибка сети при аутентификации:', error);
      logger.error('💥 Stack trace:', error instanceof Error ? error.stack : 'No stack trace');
      this.showAlert(`💥 Ошибка при аутентификации: ${errorMessage}`);
      return { success: false };
    }
  }

  showAlert(message: string): void {
    // В продакшене не показываем alert'ы
    if (!import.meta.env.DEV) {
      return;
    }
    
    const telegramWebApp = (window as any).Telegram?.WebApp;
    if (telegramWebApp?.showAlert) {
      try {
        telegramWebApp.showAlert(message);
      } catch (error) {
        logger.warn('showAlert не поддерживается в этой версии Telegram Web App:', error);
        // Fallback на обычный alert только в dev режиме
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
    const isTelegram = !!(window as any).Telegram?.WebApp;
    logger.log('🔍 Проверка Telegram WebApp:', {
      hasTelegram: !!(window as any).Telegram,
      hasWebApp: !!(window as any).Telegram?.WebApp,
      isTelegramWebApp: isTelegram
    });
    return isTelegram;
  }

  getDebugInfo(): string {
    const debugData = {
      user: this.user,
      initData: this.initData,
      debug_init_data: localStorage.getItem('debug_init_data'),
      debug_request_time: localStorage.getItem('debug_request_time'),
      debug_request_body: localStorage.getItem('debug_request_body'),
      debug_response_status: localStorage.getItem('debug_response_status'),
      debug_response_ok: localStorage.getItem('debug_response_ok'),
      debug_response_data: localStorage.getItem('debug_response_data'),
      debug_error_response: localStorage.getItem('debug_error_response'),
      debug_error: localStorage.getItem('debug_error'),
      debug_init_error: localStorage.getItem('debug_init_error'),
      debug_telegram_webapp: localStorage.getItem('debug_telegram_webapp'),
      telegram_webapp_available: !!(window as any).Telegram?.WebApp,
    };
    
    return JSON.stringify(debugData, null, 2);
  }
}

export const telegramService = TelegramService.getInstance(); 