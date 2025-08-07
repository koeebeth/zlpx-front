import type { FC } from "react";
import { useState, useEffect } from "react";

export const AuthPage: FC = () => {
  const [isTelegramUser, setIsTelegramUser] = useState<boolean>(false);
  const [hasProfile, setHasProfile] = useState<boolean>(false);
  
  useEffect(() => {
    // Более точная проверка Telegram WebApp
    const telegramWebApp = (window as any).Telegram?.WebApp;
    const isTelegram = !!(telegramWebApp && telegramWebApp.initData && telegramWebApp.initDataUnsafe?.user);
    setIsTelegramUser(isTelegram);
    
    // Проверяем, есть ли профиль пользователя
    const userProfile = localStorage.getItem('user_profile');
    setHasProfile(!!userProfile);
  }, []);

  const handleAuth = async () => {
    if (isTelegramUser && !hasProfile) {
      // Если пользователь в Telegram, но нет профиля - открываем ссылку на поддержку
      window.open('https://t.me/burlak1n', '_blank');
    } else {
      // Если не в Telegram - открываем бота
      window.open('https://t.me/ingroupsts_org_bot/RIM', '_blank');
    }
  };

  const getButtonText = () => {
    if (isTelegramUser && !hasProfile) {
      return "Техническая поддержка";
    }
    return "Войти через Telegram";
  };

  return (
    <div className="h-screen w-screen m-0 bg-zinc-100 dark:bg-zinc-900 flex flex-col justify-between">
      <div className="flex h-full items-center justify-center relative flex-col">
        <h1 className="text-6xl text-center font-extrabold text-x-purple m-0 p-0">
          РИМ
        </h1>
        <div className="mt-4 p-2 bg-white dark:bg-zinc-800 rounded text-center text-sm">
          {isTelegramUser ? 'Приложение открыто в Telegram' : 'Откройте приложение в Telegram'}
        </div>
      </div>
      <div className="flex flex-col items-center w-screen px-3 pb-10 box-border gap-3">
        <button
          onClick={handleAuth}
          className="w-full text-white px-2 py-3 bg-x-purple rounded-md text-center block"
        >
          {getButtonText()}
        </button>
      </div>
    </div>
  );
};
