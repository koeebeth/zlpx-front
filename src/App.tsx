import { useEffect, useState } from "react";

import { Loader } from "./components/Loader";
import { DebugButton } from "./components/DebugButton";
import { TabsEnum } from "./lib/constants";
import { telegramService } from "./lib/telegram";
import { useTelegramAuth } from "./hooks/useTelegramAuth";
import { UserProvider, useUser } from "./lib/contexts/UserContext";
import { AuthPage } from "./pages/Auth/Auth";
import { MainPage } from "./pages/Main/Main";
import { logger } from "./lib/logger";

function AppContent() {
  const [activeTab, setActiveTab] = useState<TabsEnum | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { updateUserFromAuth } = useUser();
  const { authenticate } = useTelegramAuth();

  // Отслеживаем изменения activeTab
  useEffect(() => {
    logger.log('🎯 activeTab изменился на:', activeTab);
  }, [activeTab]);

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await telegramService.initialize();
        
        // Проверяем, запущено ли приложение в Telegram
        logger.log('🔍 Проверяем, запущено ли приложение в Telegram...');
        const isTelegram = telegramService.isTelegramWebApp();
        logger.log('📱 Приложение в Telegram:', isTelegram);
        
        // Единственный запрос аутентификации
        logger.log('🔄 Начинаем аутентификацию...');
        const authResult = await authenticate(telegramService.getInitData() || '');
        logger.log('📊 Результат аутентификации:', authResult);
        
        if (authResult.success) {
          logger.log('✅ Аутентификация успешна');
          if (authResult.userProfile) {
            telegramService.saveUserProfile(authResult.userProfile);
            localStorage.setItem('user_profile', JSON.stringify(authResult.userProfile));
            updateUserFromAuth(authResult.userProfile);
          }
          setActiveTab(TabsEnum.MAIN);
        } else {
          logger.log('❌ Аутентификация не удалась, показываем страницу входа');
          setActiveTab(TabsEnum.AUTH);
        }
      } catch (error) {
        logger.error('Ошибка инициализации:', error);
        setActiveTab(TabsEnum.AUTH);
      } finally {
        setIsLoading(false);
      }
    };

    initializeApp();
  }, [updateUserFromAuth]);



  // Показываем загрузку пока инициализируемся
  if (isLoading || activeTab === null) {
    return <Loader />;
  }

  return (
    <>
      {import.meta.env.DEV && (
        <div style={{ 
          position: 'fixed', 
          top: '10px', 
          right: '10px', 
          zIndex: 9999, 
          background: activeTab === TabsEnum.MAIN ? 'green' : 'orange', 
          color: 'white', 
          padding: '5px', 
          borderRadius: '5px',
          fontSize: '12px'
        }}>
          {activeTab}
        </div>
      )}
      {activeTab === TabsEnum.AUTH && <AuthPage onChangeTab={() => {
        logger.log('🔄 AuthPage вызвал onChangeTab, переходим на главную...');
        logger.log('🔄 Текущий activeTab:', activeTab);
        logger.log('🔄 Устанавливаем activeTab в MAIN...');
        setActiveTab(TabsEnum.MAIN);
        logger.log('🔄 setActiveTab вызван с MAIN');
      }} />}
      {activeTab === TabsEnum.MAIN && <MainPage />}
      {import.meta.env.DEV && <DebugButton />}
    </>
  );
}

function App() {
  return (
    <UserProvider>
      <AppContent />
    </UserProvider>
  );
}

export default App;
