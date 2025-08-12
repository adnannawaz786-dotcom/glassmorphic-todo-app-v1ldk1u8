import React, { createContext, useContext, useReducer, useEffect } from 'react';

const SettingsContext = createContext();

const initialState = {
  theme: 'system',
  language: 'en',
  notifications: {
    enabled: true,
    sound: true,
    vibration: true,
    reminders: true,
    dailyDigest: false,
    completionSound: true
  },
  display: {
    compactMode: false,
    showCompletedTasks: true,
    taskAnimation: true,
    glassIntensity: 'medium',
    fontSize: 'medium',
    showTaskCount: true,
    showProgress: true
  },
  productivity: {
    defaultPriority: 'medium',
    autoArchive: false,
    archiveDays: 30,
    focusMode: false,
    pomodoroEnabled: false,
    pomodoroMinutes: 25,
    breakMinutes: 5
  },
  backup: {
    autoBackup: false,
    backupFrequency: 'weekly',
    cloudSync: false,
    lastBackup: null
  },
  privacy: {
    analytics: false,
    crashReporting: true,
    dataCollection: false
  },
  accessibility: {
    highContrast: false,
    reduceMotion: false,
    largeText: false,
    screenReader: false
  }
};

const settingsReducer = (state, action) => {
  switch (action.type) {
    case 'SET_THEME':
      return { ...state, theme: action.payload };
    
    case 'SET_LANGUAGE':
      return { ...state, language: action.payload };
    
    case 'UPDATE_NOTIFICATIONS':
      return {
        ...state,
        notifications: { ...state.notifications, ...action.payload }
      };
    
    case 'UPDATE_DISPLAY':
      return {
        ...state,
        display: { ...state.display, ...action.payload }
      };
    
    case 'UPDATE_PRODUCTIVITY':
      return {
        ...state,
        productivity: { ...state.productivity, ...action.payload }
      };
    
    case 'UPDATE_BACKUP':
      return {
        ...state,
        backup: { ...state.backup, ...action.payload }
      };
    
    case 'UPDATE_PRIVACY':
      return {
        ...state,
        privacy: { ...state.privacy, ...action.payload }
      };
    
    case 'UPDATE_ACCESSIBILITY':
      return {
        ...state,
        accessibility: { ...state.accessibility, ...action.payload }
      };
    
    case 'RESET_SETTINGS':
      return initialState;
    
    case 'LOAD_SETTINGS':
      return { ...state, ...action.payload };
    
    case 'TOGGLE_FOCUS_MODE':
      return {
        ...state,
        productivity: {
          ...state.productivity,
          focusMode: !state.productivity.focusMode
        }
      };
    
    case 'UPDATE_BACKUP_TIME':
      return {
        ...state,
        backup: {
          ...state.backup,
          lastBackup: new Date().toISOString()
        }
      };
    
    default:
      return state;
  }
};

export const SettingsProvider = ({ children }) => {
  const [settings, dispatch] = useReducer(settingsReducer, initialState);

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('todoAppSettings');
    if (savedSettings) {
      try {
        const parsedSettings = JSON.parse(savedSettings);
        dispatch({ type: 'LOAD_SETTINGS', payload: parsedSettings });
      } catch (error) {
        console.error('Failed to load settings:', error);
      }
    }
  }, []);

  // Save settings to localStorage whenever settings change
  useEffect(() => {
    localStorage.setItem('todoAppSettings', JSON.stringify(settings));
  }, [settings]);

  // Apply theme changes to document
  useEffect(() => {
    const root = document.documentElement;
    
    if (settings.theme === 'dark') {
      root.classList.add('dark');
    } else if (settings.theme === 'light') {
      root.classList.remove('dark');
    } else {
      // System theme
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      if (mediaQuery.matches) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [settings.theme]);

  // Apply accessibility settings
  useEffect(() => {
    const root = document.documentElement;
    
    if (settings.accessibility.reduceMotion) {
      root.style.setProperty('--motion-reduce', '1');
    } else {
      root.style.removeProperty('--motion-reduce');
    }

    if (settings.accessibility.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    if (settings.accessibility.largeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }
  }, [settings.accessibility]);

  const actions = {
    setTheme: (theme) => dispatch({ type: 'SET_THEME', payload: theme }),
    setLanguage: (language) => dispatch({ type: 'SET_LANGUAGE', payload: language }),
    updateNotifications: (notifications) => dispatch({ type: 'UPDATE_NOTIFICATIONS', payload: notifications }),
    updateDisplay: (display) => dispatch({ type: 'UPDATE_DISPLAY', payload: display }),
    updateProductivity: (productivity) => dispatch({ type: 'UPDATE_PRODUCTIVITY', payload: productivity }),
    updateBackup: (backup) => dispatch({ type: 'UPDATE_BACKUP', payload: backup }),
    updatePrivacy: (privacy) => dispatch({ type: 'UPDATE_PRIVACY', payload: privacy }),
    updateAccessibility: (accessibility) => dispatch({ type: 'UPDATE_ACCESSIBILITY', payload: accessibility }),
    resetSettings: () => dispatch({ type: 'RESET_SETTINGS' }),
    toggleFocusMode: () => dispatch({ type: 'TOGGLE_FOCUS_MODE' }),
    updateBackupTime: () => dispatch({ type: 'UPDATE_BACKUP_TIME' }),
    
    // Utility functions
    exportSettings: () => {
      const dataStr = JSON.stringify(settings, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'todo-app-settings.json';
      link.click();
      URL.revokeObjectURL(url);
    },
    
    importSettings: (file) => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const importedSettings = JSON.parse(e.target.result);
            dispatch({ type: 'LOAD_SETTINGS', payload: importedSettings });
            resolve();
          } catch (error) {
            reject(error);
          }
        };
        reader.onerror = reject;
        reader.readAsText(file);
      });
    }
  };

  return (
    <SettingsContext.Provider value={{ settings, ...actions }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

export default SettingsContext;