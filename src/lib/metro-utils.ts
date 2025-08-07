import type { 
  MetroLine, 
  OptimizedMetroLine, 
  MetroApiResponse, 
  MetroRequestParams 
} from '../types/models/Metro';
import { BASE_PATH } from '../store/api/api';
/**
 * Проверяет, является ли данные оптимизированным форматом (с числовыми ключами)
 */
export function isOptimizedFormat(data: MetroApiResponse): data is OptimizedMetroLine[] {
  return data.length > 0 && typeof data[0] === 'object' && '1' in data[0];
}

/**
 * Нормализует метро данные в стандартный формат MetroLine[]
 */
export function normalizeMetroData(data: MetroApiResponse): MetroLine[] {
  if (isOptimizedFormat(data)) {
    return data.map(line => ({
      line_id: line['1'],
      color: line['2'],
      name: line['3'],
      stations: line['4'].map(station => ({
        id: station['1'],
        name: station['2'],
        location: station['3']
      }))
    }));
  }
  
  // Обычный формат
  return data as MetroLine[];
}

/**
 * Получает отображаемое название (строку) из названия станции/линии
 */
export function getDisplayName(name: string | { ru: string; en?: string; cn?: string }, language: 'ru' | 'en' | 'cn' | 'all' = 'ru'): string {
  if (typeof name === 'string') {
    return name;
  }
  
  // Для объекта с названиями на разных языках
  if (language === 'all') {
    // Возвращаем все названия как строку
    const names = [name.ru, name.en, name.cn].filter(Boolean);
    return names.join(' / ');
  }
  
  const nameForLanguage = name[language as 'ru' | 'en' | 'cn'];
  if (nameForLanguage) {
    return nameForLanguage;
  }
  
  // Fallback на русский
  return name.ru;
}

/**
 * Создает параметры запроса для API
 */
export function createMetroRequestParams(params: MetroRequestParams = {}): URLSearchParams {
  const searchParams = new URLSearchParams();
  
  if (params.language) {
    searchParams.set('language', params.language);
  }
  
  if (params.include_location !== undefined) {
    searchParams.set('include_location', params.include_location.toString());
  }
  
  if (params.use_numeric_keys !== undefined) {
    searchParams.set('use_numeric_keys', params.use_numeric_keys.toString());
  }
  
  return searchParams;
}

/**
 * Функция для получения данных метро с автоматической нормализацией
 */
export async function fetchMetroData(params: MetroRequestParams = {}): Promise<MetroLine[]> {
  const searchParams = createMetroRequestParams(params);
  const url = `${BASE_PATH}/metro?${searchParams.toString()}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data: MetroApiResponse = await response.json();
  return normalizeMetroData(data);
}

/**
 * Утилита для получения размера данных в байтах
 */
export function getDataSize(data: any): number {
  return new Blob([JSON.stringify(data)]).size;
}

/**
 * Сравнивает размеры обычного и оптимизированного форматов
 */
export async function compareDataSizes(baseUrl: string = '/metro'): Promise<{
  normal: number;
  optimized: number;
  savings: number;
  savingsPercent: number;
}> {
  // Получаем обычные данные
  const normalResponse = await fetch(`${baseUrl}?include_location=false`);
  const normalData = await normalResponse.json();
  const normalSize = getDataSize(normalData);
  
  // Получаем оптимизированные данные
  const optimizedResponse = await fetch(`${baseUrl}?include_location=false&use_numeric_keys=true`);
  const optimizedData = await optimizedResponse.json();
  const optimizedSize = getDataSize(optimizedData);
  
  const savings = normalSize - optimizedSize;
  const savingsPercent = (savings / normalSize) * 100;
  
  return {
    normal: normalSize,
    optimized: optimizedSize,
    savings,
    savingsPercent
  };
} 