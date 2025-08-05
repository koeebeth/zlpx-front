import "./App.css";

import { useEffect, useState } from "react";

import { Loader } from "./components/Loader";
import { TabsEnum, DEV_CONFIG } from "./lib/constants";
import { telegramService } from "./lib/telegram";
import { AuthPage } from "./pages/Auth/Auth";
import { MainPage } from "./pages/Main/Main";

function App() {
  const [activeTab, setActiveTab] = useState<TabsEnum | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isTelegramReady, setIsTelegramReady] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await telegramService.initialize();
        
        // В режиме разработки пропускаем Telegram аутентификацию
        if (DEV_CONFIG.SKIP_TELEGRAM_AUTH) {
          console.log('🔧 Режим разработки: пропускаем Telegram аутентификацию');
          setActiveTab(TabsEnum.MAIN);
          setIsTelegramReady(false);
          return;
        }
        
        // Проверяем, запущено ли приложение в Telegram
        if (telegramService.isTelegramWebApp()) {
          const user = telegramService.getUser();
          if (user) {
            console.log('Пользователь Telegram найден:', user);
            // Автоматически аутентифицируемся
            const authSuccess = await telegramService.authenticateWithBackend();
            if (authSuccess) {
              console.log('Автоматическая аутентификация успешна');
              setActiveTab(TabsEnum.MAIN);
              setIsTelegramReady(true);
            } else {
              console.log('Автоматическая аутентификация не удалась, показываем страницу входа');
              setActiveTab(TabsEnum.AUTH);
            }
          } else {
            console.log('Пользователь Telegram не найден, показываем страницу входа');
            setActiveTab(TabsEnum.AUTH);
          }
        } else {
          console.log('Приложение запущено вне Telegram, показываем страницу входа');
          setActiveTab(TabsEnum.AUTH);
        }
      } catch (error) {
        console.error('Ошибка инициализации:', error);
        setActiveTab(TabsEnum.AUTH);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, []);

  const onAuth = async () => {
    setIsLoading(true);
    
    try {
      // В режиме разработки пропускаем аутентификацию
      if (DEV_CONFIG.SKIP_TELEGRAM_AUTH) {
        console.log('🔧 Режим разработки: пропускаем аутентификацию');
        setActiveTab(TabsEnum.MAIN);
        return;
      }
      
      // Если это Telegram Mini App, используем Telegram аутентификацию
      if (telegramService.isTelegramWebApp()) {
        const authSuccess = await telegramService.authenticateWithBackend();
        if (authSuccess) {
          setActiveTab(TabsEnum.MAIN);
          setIsTelegramReady(true);
        } else {
          telegramService.showAlert('Ошибка аутентификации');
        }
      } else {
        // Обычная аутентификация для веб-версии
        setTimeout(() => {
          setActiveTab(TabsEnum.MAIN);
          setIsLoading(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Ошибка аутентификации:', error);
      telegramService.showAlert('Произошла ошибка при аутентификации');
    } finally {
      setIsLoading(false);
    }
  };

  // Показываем загрузку пока инициализируемся
  if (isLoading || activeTab === null) {
    return <Loader />;
  }

  return (
    <>
      {activeTab === TabsEnum.AUTH && <AuthPage onChangeTab={onAuth} isTelegramReady={isTelegramReady} />}
      {activeTab === TabsEnum.MAIN && <MainPage />}
    </>
  );
}

export default App;
