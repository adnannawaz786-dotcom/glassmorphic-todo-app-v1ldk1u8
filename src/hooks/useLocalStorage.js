import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for localStorage operations with type safety and error handling
 * @param {string} key - The localStorage key
 * @param {*} initialValue - Initial value if key doesn't exist
 * @returns {[value, setValue, removeValue, clearAll]} - Array with value, setter, remover, and clear function
 */
export const useLocalStorage = (key, initialValue) => {
  // State to store our value
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  // Return a wrapped version of useState's setter function that persists the new value to localStorage
  const setValue = useCallback((value) => {
    try {
      // Allow value to be a function so we have the same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to local storage
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
        
        // Dispatch custom event to notify other components
        window.dispatchEvent(new CustomEvent('localStorageChange', {
          detail: { key, value: valueToStore }
        }));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);

  // Function to remove the key from localStorage
  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
        
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('localStorageChange', {
          detail: { key, value: null }
        }));
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  // Function to clear all localStorage
  const clearAll = useCallback(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.clear();
        
        // Dispatch custom event
        window.dispatchEvent(new CustomEvent('localStorageChange', {
          detail: { key: null, value: null, action: 'clear' }
        }));
      }
      setStoredValue(initialValue);
    } catch (error) {
      console.error('Error clearing localStorage:', error);
    }
  }, [initialValue]);

  // Listen for changes in localStorage from other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue));
        } catch (error) {
          console.error(`Error parsing localStorage value for key "${key}":`, error);
        }
      }
    };

    const handleCustomStorageChange = (e) => {
      if (e.detail.key === key) {
        setStoredValue(e.detail.value);
      }
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
      window.addEventListener('localStorageChange', handleCustomStorageChange);
      
      return () => {
        window.removeEventListener('storage', handleStorageChange);
        window.removeEventListener('localStorageChange', handleCustomStorageChange);
      };
    }
  }, [key]);

  return [storedValue, setValue, removeValue, clearAll];
};

/**
 * Hook for managing multiple localStorage keys with batch operations
 * @param {Object} initialValues - Object with key-value pairs for initial values
 * @returns {Object} - Object with values, setters, and utility functions
 */
export const useMultipleLocalStorage = (initialValues = {}) => {
  const [values, setValues] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValues;
    }

    const storedValues = {};
    Object.keys(initialValues).forEach(key => {
      try {
        const item = window.localStorage.getItem(key);
        storedValues[key] = item ? JSON.parse(item) : initialValues[key];
      } catch (error) {
        console.error(`Error reading localStorage key "${key}":`, error);
        storedValues[key] = initialValues[key];
      }
    });
    return storedValues;
  });

  const setMultipleValues = useCallback((updates) => {
    try {
      const newValues = { ...values, ...updates };
      setValues(newValues);

      if (typeof window !== 'undefined') {
        Object.entries(updates).forEach(([key, value]) => {
          window.localStorage.setItem(key, JSON.stringify(value));
        });
      }
    } catch (error) {
      console.error('Error setting multiple localStorage values:', error);
    }
  }, [values]);

  const setSingleValue = useCallback((key, value) => {
    try {
      const valueToStore = value instanceof Function ? value(values[key]) : value;
      const newValues = { ...values, [key]: valueToStore };
      setValues(newValues);

      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [values]);

  const removeMultipleValues = useCallback((keys) => {
    try {
      const newValues = { ...values };
      keys.forEach(key => {
        newValues[key] = initialValues[key];
        if (typeof window !== 'undefined') {
          window.localStorage.removeItem(key);
        }
      });
      setValues(newValues);
    } catch (error) {
      console.error('Error removing multiple localStorage keys:', error);
    }
  }, [values, initialValues]);

  return {
    values,
    setMultipleValues,
    setSingleValue,
    removeMultipleValues
  };
};

/**
 * Hook for localStorage with expiration functionality
 * @param {string} key - The localStorage key
 * @param {*} initialValue - Initial value if key doesn't exist
 * @param {number} ttl - Time to live in milliseconds
 * @returns {[value, setValue, removeValue]} - Array with value, setter, and remover
 */
export const useLocalStorageWithExpiry = (key, initialValue, ttl = null) => {
  const [storedValue, setStoredValue] = useState(() => {
    if (typeof window === 'undefined') {
      return initialValue;
    }

    try {
      const item = window.localStorage.getItem(key);
      if (!item) return initialValue;

      const parsedItem = JSON.parse(item);
      
      // Check if item has expiry
      if (parsedItem.expiry && Date.now() > parsedItem.expiry) {
        window.localStorage.removeItem(key);
        return initialValue;
      }

      return parsedItem.value !== undefined ? parsedItem.value : parsedItem;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);

      if (typeof window !== 'undefined') {
        const itemToStore = ttl 
          ? { value: valueToStore, expiry: Date.now() + ttl }
          : valueToStore;
        
        window.localStorage.setItem(key, JSON.stringify(itemToStore));
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue, ttl]);

  const removeValue = useCallback(() => {
    try {
      setStoredValue(initialValue);
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);

  return [storedValue, setValue, removeValue];
};