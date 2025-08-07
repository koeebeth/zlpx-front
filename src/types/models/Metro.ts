// Базовые типы для метро данных
export interface MetroLocation {
  lat: number;
  lon: number;
}

export interface MetroName {
  ru: string;
  en?: string;
  cn?: string;
}

export interface MetroStation {
  id: number;
  name: string | MetroName;
  location?: MetroLocation;
}

export interface MetroLine {
  line_id: number;
  color: string;
  name: string | MetroName;
  stations: MetroStation[];
}

// Типы для оптимизированного формата (числовые ключи)
export interface OptimizedMetroStation {
  '1': number;    // id
  '2': string | MetroName; // name
  '3'?: MetroLocation; // location
}

export interface OptimizedMetroLine {
  '1': number;    // line_id
  '2': string;    // color
  '3': string | MetroName; // name
  '4': OptimizedMetroStation[]; // stations
}

// Union тип для API ответа
export type MetroApiResponse = MetroLine[] | OptimizedMetroLine[];

// Параметры запроса
export interface MetroRequestParams {
  language?: 'ru' | 'en' | 'cn' | 'all';
  include_location?: boolean;
  use_numeric_keys?: boolean;
} 