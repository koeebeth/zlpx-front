import React, { useState, useCallback } from 'react';

let activeDropdownId: string | null = null;
const listeners: Set<(id: string | null) => void> = new Set();

export function useDropdownManager(dropdownId: string) {
  const [isOpen, setIsOpen] = useState(false);

  const openDropdown = useCallback(() => {
    // Закрываем все остальные dropdown'ы
    if (activeDropdownId && activeDropdownId !== dropdownId) {
      listeners.forEach(listener => listener(null));
    }
    
    // Открываем текущий dropdown
    activeDropdownId = dropdownId;
    setIsOpen(true);
    listeners.forEach(listener => listener(dropdownId));
  }, [dropdownId]);

  const closeDropdown = useCallback(() => {
    if (activeDropdownId === dropdownId) {
      activeDropdownId = null;
      listeners.forEach(listener => listener(null));
    }
    setIsOpen(false);
  }, [dropdownId]);

  const toggleDropdown = useCallback(() => {
    if (isOpen) {
      closeDropdown();
    } else {
      openDropdown();
    }
  }, [isOpen, openDropdown, closeDropdown]);

  // Подписываемся на изменения других dropdown'ов
  React.useEffect(() => {
    const listener = (id: string | null) => {
      if (id !== dropdownId && isOpen) {
        setIsOpen(false);
      }
    };
    
    listeners.add(listener);
    
    return () => {
      listeners.delete(listener);
    };
  }, [dropdownId, isOpen]);

  return {
    isOpen,
    openDropdown,
    closeDropdown,
    toggleDropdown
  };
} 