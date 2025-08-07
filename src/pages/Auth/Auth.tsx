import type { FC } from "react";
import { useState } from "react";
import { telegramService } from "../../lib/telegram";
import { useTelegramAuth } from "../../hooks/useTelegramAuth";
import { useUser } from "../../lib/contexts/UserContext";

type PropsT = {
  onChangeTab: () => void;
};

export const AuthPage: FC<PropsT> = ({ onChangeTab }) => {
  const { authenticate } = useTelegramAuth();
  const { updateUserFromAuth } = useUser();
  const [status, setStatus] = useState<string>('Готов к аутентификации');
  
  const handleTestAuth = async () => {
    setStatus('Начинаем аутентификацию...');
    console.log('🧪 Тестируем аутентификацию...');
    const result = await authenticate(telegramService.getInitData() || '');
    console.log('📊 Результат теста:', result);
    console.log('📊 result.success:', result.success);
    console.log('📊 result.userProfile:', result.userProfile);
    
    if (result.success) {
      setStatus('✅ Аутентификация успешна!');
      console.log('✅ Тест аутентификации успешен, переходим на главную страницу');
      
      // Обновляем пользователя в контексте
      if (result.userProfile) {
        setStatus('💾 Сохраняем профиль...');
        telegramService.saveUserProfile(result.userProfile);
        localStorage.setItem('user_profile', JSON.stringify(result.userProfile));
        updateUserFromAuth(result.userProfile);
      }
      
      // Переходим на главную страницу
      setStatus('🔄 Переходим на главную...');
      console.log('🔄 Вызываем onChangeTab...');
      
      // Добавим задержку чтобы увидеть статус
      setTimeout(() => {
        try {
          setStatus('📞 Вызываем onChangeTab...');
          onChangeTab();
          setStatus('✅ onChangeTab вызван');
          console.log('✅ onChangeTab выполнен успешно');
          
          // Проверим через секунду, сменилось ли состояние
          setTimeout(() => {
            setStatus('🔍 Проверяем результат...');
          }, 1000);
        } catch (error) {
          setStatus('❌ Ошибка: ' + String(error));
          console.error('❌ Ошибка при вызове onChangeTab:', error);
        }
      }, 500);
    } else {
      setStatus('❌ Аутентификация не удалась');
      console.log('❌ Тест аутентификации не удался');
    }
  };

  return (
    <div className="h-screen w-screen m-0 bg-zinc-100 dark:bg-zinc-900 flex flex-col justify-between">
      <div className="flex h-full items-center justify-center relative flex-col">
        <h1 className="text-6xl text-center font-extrabold text-x-purple m-0 p-0">
          РИМ
        </h1>
        <div className="mt-4 p-2 bg-white dark:bg-zinc-800 rounded text-center text-sm">
          {status}
        </div>
      </div>
      <div className="flex flex-col items-center w-screen px-3 pb-10 box-border gap-3">
        <a
          href="https://t.me/ingroupsts_org_bot/RIM"
          target="_blank"
          rel="noopener noreferrer"
          className="w-full text-white px-2 py-3 bg-x-purple rounded-md text-center block"
        >
          Войти через Telegram
        </a>
        <button
          onClick={handleTestAuth}
          className="w-full text-white px-2 py-3 bg-gray-600 rounded-md text-center block"
        >
          Тест аутентификации
        </button>
      </div>
    </div>
  );
};
