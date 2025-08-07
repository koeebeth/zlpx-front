import React, { useState, useMemo } from 'react';
import { useMetro } from '../lib/hooks/useMetro';
import { useDropdownManager } from '../lib/hooks/useDropdownManager';
import { getDisplayName } from '../lib/metro-utils';
import type { MetroLine } from '../types/models/Metro';
import './MetroSelector.css';

interface MetroSelectorProps {
  value: (number | string)[]; // station_id или старые строковые значения
  onChange: (value: number[]) => void;
  placeholder: string;
  label: string;
}

interface SelectedStation {
  stationId: number;
  lineId: number;
  stationName: string;
  lineName: string;
  lineColor: string;
}

export function MetroSelector({ value, onChange, placeholder, label }: MetroSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStations, setSelectedStations] = useState<SelectedStation[]>([]);
  
  // Генерируем уникальный ID для этого dropdown
  const dropdownId = `metro-selector-${label.replace(/\s+/g, '-').toLowerCase()}`;
  const { isOpen, toggleDropdown, closeDropdown } = useDropdownManager(dropdownId);

  // Получаем данные метро с фиксированными настройками
  const { data, loading, error } = useMetro({
    language: 'ru',
    include_location: false,
    use_numeric_keys: true,
    autoFetch: true
  });

  // Инициализируем выбранные станции из value (station_id)
  React.useEffect(() => {
    if (value && value.length > 0 && data.length > 0) {
      // Ищем реальные станции в данных API по station_id
      const existingStations: SelectedStation[] = [];
      
      value.forEach(stationId => {
        // Пропускаем нечисловые значения (старые строковые данные)
        if (typeof stationId !== 'number' || isNaN(stationId)) {
          return;
        }
        
        let found = false;
        data.forEach(line => {
          line.stations.forEach(station => {
            if (station.id === stationId && !found) {
              existingStations.push({
                stationId: station.id,
                lineId: line.line_id,
                stationName: getDisplayName(station.name, 'ru'),
                lineName: getDisplayName(line.name, 'ru'),
                lineColor: line.color
              });
              found = true;
            }
          });
        });
        
        // Если станция не найдена в API, не добавляем её (пропускаем)
        // Это предотвращает отображение "Станция Станция"
      });
      
      setSelectedStations(existingStations);
    } else if (!value || value.length === 0) {
      setSelectedStations([]);
    }
  }, [value, data]);

  // Фильтрация станций по поисковому запросу
  const filteredStations = useMemo(() => {
    if (!searchQuery.trim() || !data.length) return [];

    const query = searchQuery.toLowerCase();
    const results: Array<{
      station: MetroLine['stations'][0];
      line: MetroLine;
    }> = [];

    data.forEach(line => {
      line.stations.forEach(station => {
        const stationName = getDisplayName(station.name, 'ru');
        if (stationName.toLowerCase().includes(query)) {
          results.push({ station, line });
        }
      });
    });

    return results.slice(0, 8); // Ограничиваем результаты для компактности
  }, [data, searchQuery]);

  const handleStationSelect = (station: MetroLine['stations'][0], line: MetroLine) => {
    const stationName = getDisplayName(station.name, 'ru');
    const lineName = getDisplayName(line.name, 'ru');
    
    const newSelection: SelectedStation = {
      stationId: station.id,
      lineId: line.line_id,
      stationName,
      lineName,
      lineColor: line.color
    };

    // Проверяем, не выбрана ли уже эта станция
    const isAlreadySelected = selectedStations.some(
      s => s.stationId === station.id && s.lineId === line.line_id
    );

    if (isAlreadySelected) {
      // Удаляем из выбранных
      const updatedSelection = selectedStations.filter(
        s => !(s.stationId === station.id && s.lineId === line.line_id)
      );
      setSelectedStations(updatedSelection);
      onChange(updatedSelection.map(s => s.stationId));
    } else {
      // Добавляем к выбранным
      const updatedSelection = [...selectedStations, newSelection];
      setSelectedStations(updatedSelection);
      onChange(updatedSelection.map(s => s.stationId));
    }
    
    // Закрываем dropdown после выбора
    closeDropdown();
    setSearchQuery('');
  };

  const isStationSelected = (stationId: number, lineId: number) => {
    return selectedStations.some(s => s.stationId === stationId && s.lineId === lineId);
  };

  const handleToggle = () => {
    toggleDropdown();
    if (!isOpen) {
      setSearchQuery('');
    }
  };

  // Закрытие dropdown при клике вне компонента
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
      if (isOpen && !target.closest('.metro-selector')) {
        closeDropdown();
        setSearchQuery('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, closeDropdown]);

  const handleRemoveStation = (stationId: number, lineId: number, event: React.MouseEvent) => {
    event.stopPropagation(); // Предотвращаем открытие dropdown
    const updatedSelection = selectedStations.filter(
      s => !(s.stationId === stationId && s.lineId === lineId)
    );
    setSelectedStations(updatedSelection);
    onChange(updatedSelection.map(s => s.stationName));
  };

  return (
    <div className="metro-selector">
      <div className="metro-selector-input" onClick={handleToggle}>
        <div className="metro-selector-content">
          {selectedStations.length > 0 ? (
            selectedStations.map((station, index) => (
              <div key={`${station.stationId}-${station.lineId}`} className="metro-selector-tag">
                <div 
                  className="metro-selector-tag-line"
                  style={{ backgroundColor: station.lineColor }}
                >
                  {station.lineId}
                </div>
                <span className="metro-selector-tag-text">{station.stationName}</span>
                <button
                  type="button"
                  className="metro-selector-tag-remove"
                  onClick={(e) => handleRemoveStation(station.stationId, station.lineId, e)}
                >
                  ×
                </button>
              </div>
            ))
          ) : (
            <span className="metro-selector-placeholder">{placeholder}</span>
          )}
        </div>
        <span className="metro-selector-arrow">
          {isOpen ? '▲' : '▼'}
        </span>
      </div>
      
      {isOpen && (
        <div className="metro-selector-dropdown">
          <div className="metro-selector-search">
            <input
              type="text"
              placeholder="Начните вводить название станции..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="metro-selector-search-input"
              autoFocus
            />
          </div>
          
          {error && (
            <div className="metro-selector-error">
              {error.message}
            </div>
          )}
          
          {searchQuery && (
            <div className="metro-selector-results">
              {filteredStations.length === 0 ? (
                <div className="metro-selector-no-results">
                  Станции не найдены
                </div>
              ) : (
                <div className="metro-selector-stations">
                  {filteredStations.map(({ station, line }) => {
                    const isSelected = isStationSelected(station.id, line.line_id);
                    const stationName = getDisplayName(station.name, 'ru');
                    
                    return (
                      <div
                        key={`${line.line_id}-${station.id}`}
                        className={`metro-selector-station ${isSelected ? 'selected' : ''}`}
                        onClick={() => handleStationSelect(station, line)}
                      >
                        <span className="metro-selector-station-name">{stationName}</span>
                        <div 
                          className="metro-selector-line-indicator"
                          style={{ backgroundColor: line.color }}
                        >
                          {line.line_id}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
          

        </div>
      )}
    </div>
  );
} 