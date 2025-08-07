import { useTelegramAuthMutation } from '../store/api/api';

export const useTelegramAuth = () => {
  const [telegramAuth, { isLoading, error, data }] = useTelegramAuthMutation();

  const authenticate = async (initData: string) => {
    try {
      console.log('🔍 Начинаем аутентификацию с RTK Query');
      console.log('🔍 Init data:', {
        exists: !!initData,
        length: initData?.length || 0,
        value: initData
      });

      // Если initData нет, используем тестовые данные для разработки
      let initDataToUse = initData || '';
      if (!initDataToUse) {
        console.warn('⚠️ Init data не найден, используем тестовые данные');
        initDataToUse = 'user=%7B%22id%22%3A123456789%2C%22first_name%22%3A%22Test%22%7D&auth_date=1234567890&hash=test_hash';
      }

      console.log('🚀 Отправляем запрос через RTK Query:', {
        init_data: initDataToUse.substring(0, 100) + '...'
      });

      console.log('🔄 Вызываем telegramAuth mutation...');
      console.log('📦 Request payload:', { init_data: initDataToUse });
      
      const result = await telegramAuth({ init_data: initDataToUse }).unwrap();
      
      console.log('✅ RTK Query запрос успешен:', result);
      console.log('🔍 Тип результата:', typeof result);
      console.log('🔍 Ключи результата:', result ? Object.keys(result) : 'null');
      console.log('🔍 user_profile в результате:', result?.user_profile);
      
      return { success: true, userProfile: result.user_profile };
      
    } catch (error: any) {
      console.error('❌ Ошибка аутентификации через RTK Query:', error);
      console.error('❌ Детали ошибки:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : 'No stack'
      });
      
      // Добавляем дополнительную отладочную информацию
      if (error && typeof error === 'object') {
        if ('status' in error) {
          console.error('❌ HTTP статус:', error.status);
        }
        if ('data' in error) {
          console.error('❌ Данные ошибки:', error.data);
        }
        if ('originalStatus' in error) {
          console.error('❌ Оригинальный статус:', error.originalStatus);
        }
        if ('error' in error) {
          console.error('❌ Вложенная ошибка:', error.error);
        }
      }
      
      // Сохраняем ошибку в localStorage для отладки
      localStorage.setItem('debug_auth_error', JSON.stringify({
        timestamp: new Date().toISOString(),
        error: error,
        message: error instanceof Error ? error.message : String(error)
      }));
      
      return { success: false };
    }
  };

  return {
    authenticate,
    isLoading,
    error,
    data
  };
}; 