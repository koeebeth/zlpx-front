import './index.css'

import { init, miniApp } from '@telegram-apps/sdk';
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'

import App from './App.tsx'
import { store } from './store/store'


const initializeTelegramSDK = async () => {
  try {
    await init();

    if (miniApp.ready.isAvailable()) {
      await miniApp.ready();
      console.log('Mini App готово');
      
      // Получаем данные пользователя через window.Telegram
      const telegramUser = (window as any).Telegram?.WebApp?.initDataUnsafe?.user;
      if (telegramUser) {
        console.log('Пользователь Telegram:', telegramUser);
        localStorage.setItem('telegram_user', JSON.stringify(telegramUser));
      }
      
      // Получаем initData для аутентификации
      const initData = (window as any).Telegram?.WebApp?.initData;
      if (initData) {
        console.log('Init data получен');
        localStorage.setItem('telegram_init_data', initData);
      }
    }

  } catch (error) {
    console.error('Ошибка инициализации:', error);
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
