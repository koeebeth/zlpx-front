import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { UserProfile } from '../../types';
import { DefaultService } from '../../types';
import { telegramService } from '../telegram';

// Fallback данные пользователя
const FALLBACK_USER: UserProfile = {
  telegram_id: 6666666,
  status: 0,
  live_metro_station: ["Станция"],
  study_metro_station: ["Станция"],
  year_of_admission: 2025,
  has_driver_license: 1,
  date_of_birth: "2004-01-11",
  has_printer: 1,
  can_host_night: false,
  full_name: "Имя Фамилия",
  vk_nickname: "username",
  telegram_nickname: "username",
  phone_number: "+7 111 111 11 11",
};

interface UserContextType {
  user: UserProfile;
  setUser: (user: UserProfile) => void;
  loading: boolean;
  error: string | null;
  updateUserProfile: (fields: Partial<UserProfile>) => Promise<boolean>;
  refetch: () => Promise<void>;
  isInitialized: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(FALLBACK_USER);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Получение профиля пользователя
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const telegramUser = telegramService.getUser();
      if (!telegramUser?.id) {
        console.warn('Telegram пользователь не найден, используем fallback');
        setUser(FALLBACK_USER);
        return;
      }

      const response = await DefaultService.getUserProfileUserTelegramIdGet(telegramUser.id);
      if (response.user_profile) {
        setUser(response.user_profile);
        console.log('Профиль пользователя загружен:', response.user_profile);
      } else {
        console.warn('Профиль пользователя не найден, используем fallback');
        setUser(FALLBACK_USER);
      }
    } catch (err) {
      console.error('Ошибка при получении профиля пользователя:', err);
      setError('Не удалось загрузить профиль');
      setUser(FALLBACK_USER);
    } finally {
      setLoading(false);
      setIsInitialized(true);
    }
  };

  // Обновление профиля пользователя
  const updateUserProfile = async (fields: Partial<UserProfile>): Promise<boolean> => {
    try {
      setError(null);
      
      const telegramUser = telegramService.getUser();
      if (!telegramUser?.id) {
        throw new Error('Telegram пользователь не найден');
      }

      const updateRequest = {
        telegram_id: telegramUser.id,
        from_user_telegram_id: telegramUser.id,
        fields,
      };

      const success = await DefaultService.updateUserProfileUserUpdatePost(updateRequest);
      
      if (success) {
        // Обновляем локальное состояние
        setUser(prev => ({ ...prev, ...fields }));
        return true;
      } else {
        throw new Error('Ошибка обновления профиля');
      }
    } catch (err) {
      console.error('Ошибка при обновлении профиля:', err);
      setError('Не удалось обновить профиль');
      return false;
    }
  };

  // Загружаем профиль при инициализации
  useEffect(() => {
    fetchUserProfile();
  }, []);

  const value: UserContextType = {
    user,
    setUser,
    loading,
    error,
    updateUserProfile,
    refetch: fetchUserProfile,
    isInitialized,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}; 