import { useEffect, useState } from "react";

import { Loader } from "./components/Loader";
import { TabsEnum, DEV_CONFIG } from "./lib/constants";
import { telegramService } from "./lib/telegram";
import { UserProvider } from "./lib/contexts/UserContext";
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
            const authResult = await telegramService.authenticateWithBackend();
            if (authResult.success) {
              console.log('Автоматическая аутентификация успешна');
              // Сохраняем профиль пользователя
              if (authResult.userProfile) {
                telegramService.saveUserProfile(authResult.userProfile);
              }
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
        const authResult = await telegramService.authenticateWithBackend();
        if (authResult.success) {
          // Сохраняем профиль пользователя
          if (authResult.userProfile) {
            telegramService.saveUserProfile(authResult.userProfile);
          }
          setActiveTab(TabsEnum.MAIN);
          setIsTelegramReady(true);
        } else {
          telegramService.showAlert('Ошибка аутентификации');
        }
      } else {
        // Приложение запущено не через Telegram, показываем страницу входа
        setActiveTab(TabsEnum.AUTH);
      }
    } catch (error) {
      console.error('Ошибка аутентификации:', error);
      setActiveTab(TabsEnum.AUTH);
    } finally {
      setIsLoading(false);
    }
  };

  // Показываем загрузку пока инициализируемся
  if (isLoading || activeTab === null) {
    return <Loader />;
  }

  return (
    <UserProvider>
      {activeTab === TabsEnum.AUTH && <AuthPage onChangeTab={onAuth} />}
      {activeTab === TabsEnum.MAIN && <MainPage />}
    </UserProvider>
  );
}

export default App;
