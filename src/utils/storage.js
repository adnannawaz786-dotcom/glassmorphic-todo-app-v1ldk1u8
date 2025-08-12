const STORAGE_KEYS = {
  TODOS: 'glassmorphic_todos',
  CATEGORIES: 'glassmorphic_categories',
  SETTINGS: 'glassmorphic_settings',
  USER_PREFERENCES: 'glassmorphic_user_preferences',
  FILTERS: 'glassmorphic_filters',
  BACKUP: 'glassmorphic_backup'
};

const DEFAULT_CATEGORIES = [
  { id: 'work', name: 'Work', color: '#3B82F6', icon: 'briefcase' },
  { id: 'personal', name: 'Personal', color: '#10B981', icon: 'user' },
  { id: 'shopping', name: 'Shopping', color: '#F59E0B', icon: 'shopping-bag' },
  { id: 'health', name: 'Health', color: '#EF4444', icon: 'heart' }
];

const DEFAULT_SETTINGS = {
  theme: 'auto',
  notifications: true,
  soundEnabled: true,
  autoDelete: false,
  defaultCategory: 'personal',
  sortBy: 'dueDate',
  showCompleted: true,
  compactView: false,
  reminderTime: 15,
  weekStartsOn: 'monday'
};

const DEFAULT_USER_PREFERENCES = {
  name: '',
  avatar: '',
  dailyGoal: 5,
  timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  language: 'en',
  dateFormat: 'MM/DD/YYYY',
  timeFormat: '12h'
};

class StorageManager {
  constructor() {
    this.isLocalStorageAvailable = this.checkLocalStorageAvailability();
    this.initializeStorage();
  }

  checkLocalStorageAvailability() {
    try {
      const test = '__storage_test__';
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch (e) {
      console.warn('LocalStorage is not available:', e);
      return false;
    }
  }

  initializeStorage() {
    if (!this.isLocalStorageAvailable) return;

    // Initialize categories if not exists
    if (!this.getItem(STORAGE_KEYS.CATEGORIES)) {
      this.setItem(STORAGE_KEYS.CATEGORIES, DEFAULT_CATEGORIES);
    }

    // Initialize settings if not exists
    if (!this.getItem(STORAGE_KEYS.SETTINGS)) {
      this.setItem(STORAGE_KEYS.SETTINGS, DEFAULT_SETTINGS);
    }

    // Initialize user preferences if not exists
    if (!this.getItem(STORAGE_KEYS.USER_PREFERENCES)) {
      this.setItem(STORAGE_KEYS.USER_PREFERENCES, DEFAULT_USER_PREFERENCES);
    }

    // Initialize todos if not exists
    if (!this.getItem(STORAGE_KEYS.TODOS)) {
      this.setItem(STORAGE_KEYS.TODOS, []);
    }
  }

  getItem(key) {
    if (!this.isLocalStorageAvailable) return null;

    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error getting item ${key}:`, error);
      return null;
    }
  }

  setItem(key, value) {
    if (!this.isLocalStorageAvailable) return false;

    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error setting item ${key}:`, error);
      return false;
    }
  }

  removeItem(key) {
    if (!this.isLocalStorageAvailable) return false;

    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing item ${key}:`, error);
      return false;
    }
  }

  // Todo-specific methods
  getTodos() {
    return this.getItem(STORAGE_KEYS.TODOS) || [];
  }

  saveTodos(todos) {
    return this.setItem(STORAGE_KEYS.TODOS, todos);
  }

  addTodo(todo) {
    const todos = this.getTodos();
    const newTodo = {
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      completed: false,
      ...todo
    };
    todos.push(newTodo);
    this.saveTodos(todos);
    return newTodo;
  }

  updateTodo(id, updates) {
    const todos = this.getTodos();
    const index = todos.findIndex(todo => todo.id === id);
    if (index !== -1) {
      todos[index] = {
        ...todos[index],
        ...updates,
        updatedAt: new Date().toISOString()
      };
      this.saveTodos(todos);
      return todos[index];
    }
    return null;
  }

  deleteTodo(id) {
    const todos = this.getTodos();
    const filteredTodos = todos.filter(todo => todo.id !== id);
    this.saveTodos(filteredTodos);
    return filteredTodos;
  }

  // Category-specific methods
  getCategories() {
    return this.getItem(STORAGE_KEYS.CATEGORIES) || DEFAULT_CATEGORIES;
  }

  saveCategories(categories) {
    return this.setItem(STORAGE_KEYS.CATEGORIES, categories);
  }

  addCategory(category) {
    const categories = this.getCategories();
    const newCategory = {
      id: this.generateId(),
      ...category
    };
    categories.push(newCategory);
    this.saveCategories(categories);
    return newCategory;
  }

  // Settings methods
  getSettings() {
    return { ...DEFAULT_SETTINGS, ...this.getItem(STORAGE_KEYS.SETTINGS) };
  }

  saveSettings(settings) {
    return this.setItem(STORAGE_KEYS.SETTINGS, settings);
  }

  updateSetting(key, value) {
    const settings = this.getSettings();
    settings[key] = value;
    this.saveSettings(settings);
    return settings;
  }

  // User preferences methods
  getUserPreferences() {
    return { ...DEFAULT_USER_PREFERENCES, ...this.getItem(STORAGE_KEYS.USER_PREFERENCES) };
  }

  saveUserPreferences(preferences) {
    return this.setItem(STORAGE_KEYS.USER_PREFERENCES, preferences);
  }

  // Backup and restore methods
  createBackup() {
    const backup = {
      todos: this.getTodos(),
      categories: this.getCategories(),
      settings: this.getSettings(),
      userPreferences: this.getUserPreferences(),
      timestamp: new Date().toISOString(),
      version: '1.0.0'
    };

    this.setItem(STORAGE_KEYS.BACKUP, backup);
    return backup;
  }

  restoreFromBackup(backupData) {
    try {
      if (backupData.todos) this.saveTodos(backupData.todos);
      if (backupData.categories) this.saveCategories(backupData.categories);
      if (backupData.settings) this.saveSettings(backupData.settings);
      if (backupData.userPreferences) this.saveUserPreferences(backupData.userPreferences);
      return true;
    } catch (error) {
      console.error('Error restoring backup:', error);
      return false;
    }
  }

  // Utility methods
  generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
  }

  clearAllData() {
    Object.values(STORAGE_KEYS).forEach(key => {
      this.removeItem(key);
    });
    this.initializeStorage();
  }

  exportData() {
    return {
      todos: this.getTodos(),
      categories: this.getCategories(),
      settings: this.getSettings(),
      userPreferences: this.getUserPreferences(),
      exportDate: new Date().toISOString()
    };
  }

  getStorageSize() {
    if (!this.isLocalStorageAvailable) return 0;

    let totalSize = 0;
    Object.values(STORAGE_KEYS).forEach(key => {
      const item = localStorage.getItem(key);
      if (item) {
        totalSize += item.length;
      }
    });
    return totalSize;
  }
}

// Create and export singleton instance
const storageManager = new StorageManager();

export { storageManager, STORAGE_KEYS, DEFAULT_CATEGORIES, DEFAULT_SETTINGS };
export default storageManager;