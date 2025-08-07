import { useState, useEffect, useCallback } from 'react';
import type { MetroLine, MetroRequestParams } from '../../types/models/Metro';
import { fetchMetroData, compareDataSizes } from '../metro-utils';

interface UseMetroOptions extends MetroRequestParams {
  autoFetch?: boolean;
  onError?: (error: Error) => void;
}

interface UseMetroReturn {
  data: MetroLine[];
  loading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
  compareSizes: () => Promise<{
    normal: number;
    optimized: number;
    savings: number;
    savingsPercent: number;
  }>;
}

// Кэш для данных метро
const metroCache = new Map<string, MetroLine[]>();
const loadingCache = new Map<string, Promise<MetroLine[]>>();

/**
 * Создает ключ кэша на основе параметров
 */
function createCacheKey(params: MetroRequestParams): string {
  return JSON.stringify({
    language: params.language || 'ru',
    include_location: params.include_location ?? true,
    use_numeric_keys: params.use_numeric_keys ?? false
  });
}

/**
 * React Hook для работы с метро данными
 */
export function useMetro(options: UseMetroOptions = {}): UseMetroReturn {
  const {
    language = 'ru',
    include_location = true,
    use_numeric_keys = false,
    autoFetch = true,
    onError
  } = options;

  const [data, setData] = useState<MetroLine[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const cacheKey = createCacheKey({ language, include_location, use_numeric_keys });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Проверяем кэш
      if (metroCache.has(cacheKey)) {
        setData(metroCache.get(cacheKey)!);
        setLoading(false);
        return;
      }

      // Проверяем, не загружается ли уже
      if (loadingCache.has(cacheKey)) {
        const cachedData = await loadingCache.get(cacheKey)!;
        setData(cachedData);
        setLoading(false);
        return;
      }

      // Создаем промис для загрузки
      const loadPromise = fetchMetroData({
        language,
        include_location,
        use_numeric_keys
      });
      
      loadingCache.set(cacheKey, loadPromise);
      
      const metroData = await loadPromise;
      
      // Сохраняем в кэш
      metroCache.set(cacheKey, metroData);
      loadingCache.delete(cacheKey);
      
      setData(metroData);
    } catch (err) {
      loadingCache.delete(cacheKey);
      const error = err instanceof Error ? err : new Error('Unknown error');
      setError(error);
      onError?.(error);
    } finally {
      setLoading(false);
    }
  }, [language, include_location, use_numeric_keys, onError, cacheKey]);

  const refetch = useCallback(async () => {
    // Очищаем кэш для принудительной перезагрузки
    metroCache.delete(cacheKey);
    loadingCache.delete(cacheKey);
    await fetchData();
  }, [fetchData, cacheKey]);

  const compareSizes = useCallback(async () => {
    return await compareDataSizes();
  }, []);

  useEffect(() => {
    if (autoFetch) {
      fetchData();
    }
  }, [fetchData, autoFetch]);

  return {
    data,
    loading,
    error,
    refetch,
    compareSizes
  };
}

/**
 * Hook для получения конкретной линии метро
 */
export function useMetroLine(
  lineId: number,
  options: UseMetroOptions = {}
): { line: MetroLine | null; loading: boolean; error: Error | null } {
  const { data, loading, error } = useMetro(options);
  
  const line = data.find(l => l.line_id === lineId) || null;
  
  return {
    line,
    loading,
    error
  };
}

/**
 * Hook для поиска станции по названию
 */
export function useMetroStation(
  stationName: string,
  options: UseMetroOptions = {}
): { station: MetroLine['stations'][0] | null; line: MetroLine | null; loading: boolean; error: Error | null } {
  const { data, loading, error } = useMetro(options);
  
  let station: MetroLine['stations'][0] | null = null;
  let line: MetroLine | null = null;
  
  if (data.length > 0) {
    for (const metroLine of data) {
      const foundStation = metroLine.stations.find(s => {
        const name = typeof s.name === 'string' ? s.name : s.name.ru;
        return name.toLowerCase().includes(stationName.toLowerCase());
      });
      
      if (foundStation) {
        station = foundStation;
        line = metroLine;
        break;
      }
    }
  }
  
  return {
    station,
    line,
    loading,
    error
  };
} 