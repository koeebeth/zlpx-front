import './index.css'

import { init, miniApp } from '@telegram-apps/sdk';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'

import App from './App.tsx'
import { store } from './store/store'
import { logger } from './lib/logger'


const initializeTelegramSDK = async () => {
  try {
    logger.log('🚀 Инициализация Telegram SDK...');
    await init();
    logger.log('✅ Telegram SDK инициализирован');

    if (miniApp.ready.isAvailable()) {
      logger.log('📱 Mini App ready доступен');
      await miniApp.ready();
      logger.log('✅ Mini App готово');
      
      // Получаем данные пользователя через window.Telegram
      const telegramUser = (window as any).Telegram?.WebApp?.initDataUnsafe?.user;
      if (telegramUser) {
        logger.log('👤 Пользователь Telegram:', telegramUser);
        localStorage.setItem('telegram_user', JSON.stringify(telegramUser));
      } else {
        logger.warn('⚠️ Пользователь Telegram не найден');
      }
      
      // Получаем initData для аутентификации
      const initData = (window as any).Telegram?.WebApp?.initData;
      if (initData) {
        logger.log('🔑 Init data получен:', {
          length: initData.length,
          preview: initData.substring(0, 100)
        });
        localStorage.setItem('telegram_init_data', initData);
      } else {
        logger.warn('⚠️ Init data не найден');
      }
      
      // Логируем полную информацию о Telegram WebApp
      logger.log('📊 Telegram WebApp информация:', {
        version: (window as any).Telegram?.WebApp?.version,
        platform: (window as any).Telegram?.WebApp?.platform,
        initData: (window as any).Telegram?.WebApp?.initData,
        initDataUnsafe: (window as any).Telegram?.WebApp?.initDataUnsafe,
      });
    } else {
      logger.warn('⚠️ Mini App ready недоступен');
    }

  } catch (error) {
    logger.error('❌ Ошибка инициализации Telegram SDK:', error);
  }
};


initializeTelegramSDK();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
    <App />
    </Provider>
  </StrictMode>,
)
