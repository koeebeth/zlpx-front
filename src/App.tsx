import { useEffect, useState } from "react";

import { Loader } from "./components/Loader";
import { TabsEnum } from "./lib/constants";
import { telegramService } from "./lib/telegram";
import { useTelegramAuth } from "./hooks/useTelegramAuth";
import { UserProvider, useUser } from "./lib/contexts/UserContext";
import { AuthPage } from "./pages/Auth/Auth";
import { MainPage } from "./pages/Main/Main";

function AppContent() {
  const [activeTab, setActiveTab] = useState<TabsEnum | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { updateUserFromAuth } = useUser();
  const { authenticate } = useTelegramAuth();



  useEffect(() => {
    const initializeApp = async () => {
      try {
        await telegramService.initialize();
        

        
        // Единственный запрос аутентификации
        const authResult = await authenticate(telegramService.getInitData() || '');
        
        if (authResult.success) {
          if (authResult.userProfile) {
            telegramService.saveUserProfile(authResult.userProfile);
            localStorage.setItem('user_profile', JSON.stringify(authResult.userProfile));
            updateUserFromAuth(authResult.userProfile);
          }
          setActiveTab(TabsEnum.MAIN);
        } else {
          setActiveTab(TabsEnum.AUTH);
        }
      } catch (error) {
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
      {activeTab === TabsEnum.AUTH && <AuthPage />}
      {activeTab === TabsEnum.MAIN && <MainPage />}
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
