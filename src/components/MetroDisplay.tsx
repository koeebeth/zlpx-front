import React from 'react';
import { useMetro } from '../lib/hooks/useMetro';
import { getDisplayName } from '../lib/metro-utils';
import type { MetroLine } from '../types/models/Metro';
import './MetroDisplay.css';

interface MetroDisplayProps {
  stationIds: (number | string)[]; // Поддержка старых строковых значений
  emptyText?: string;
}

export function MetroDisplay({ stationIds, emptyText = "Не указано" }: MetroDisplayProps) {
  const { data, loading, error } = useMetro({
    language: 'ru',
    include_location: false,
    use_numeric_keys: true,
    autoFetch: true
  });

  if (loading) {
    return <span className="metro-display-loading">Загрузка...</span>;
  }

  if (error) {
    return <span className="metro-display-error">Ошибка загрузки</span>;
  }

  if (!stationIds || stationIds.length === 0) {
    return <span className="metro-display-empty">{emptyText}</span>;
  }

  // Фильтруем только числовые ID (игнорируем старые строковые значения)
  const validStationIds = stationIds.filter(id => typeof id === 'number' && !isNaN(id)) as number[];
  
  if (validStationIds.length === 0) {
    return <span className="metro-display-empty">{emptyText}</span>;
  }

  const stations = validStationIds.map(stationId => {
    let foundStation: { station: MetroLine['stations'][0]; line: MetroLine } | null = null;
    
    data.forEach(line => {
      line.stations.forEach(station => {
        if (station.id === stationId && !foundStation) {
          foundStation = { station, line };
        }
      });
    });
    
    return foundStation;
  }).filter(Boolean);

  if (stations.length === 0) {
    return <span className="metro-display-empty">{emptyText}</span>;
  }

  return (
    <div className="metro-display">
      {stations.map(({ station, line }, index) => (
        <div key={station.id} className="metro-display-item">
          <div 
            className="metro-display-line"
            style={{ backgroundColor: line.color }}
          >
            {line.line_id}
          </div>
          <span className="metro-display-name">
            {getDisplayName(station.name, 'ru')}
          </span>
          {index < stations.length - 1 && <span className="metro-display-separator">, </span>}
        </div>
      ))}
    </div>
  );
} 