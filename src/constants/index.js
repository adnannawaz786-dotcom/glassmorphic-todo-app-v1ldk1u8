// Application Constants and Configuration
export const APP_CONFIG = {
  name: 'Glassmorphic Todo',
  version: '1.0.0',
  description: 'A beautiful todo application with glassmorphism design',
  author: 'Todo App Team',
  maxTasks: 1000,
  maxCategoriesPerTask: 5,
  autoSaveDelay: 1000, // milliseconds
  animationDuration: 300,
  debounceDelay: 500,
};

// Storage Keys
export const STORAGE_KEYS = {
  TASKS: 'glassmorphic_todo_tasks',
  CATEGORIES: 'glassmorphic_todo_categories',
  SETTINGS: 'glassmorphic_todo_settings',
  THEME: 'glassmorphic_todo_theme',
  USER_PREFERENCES: 'glassmorphic_todo_user_prefs',
  LAST_BACKUP: 'glassmorphic_todo_last_backup',
};

// Task Priorities
export const TASK_PRIORITIES = {
  LOW: {
    id: 'low',
    label: 'Low',
    value: 1,
    color: 'text-green-500',
    bgColor: 'bg-green-500/20',
    borderColor: 'border-green-500/30',
  },
  MEDIUM: {
    id: 'medium',
    label: 'Medium',
    value: 2,
    color: 'text-yellow-500',
    bgColor: 'bg-yellow-500/20',
    borderColor: 'border-yellow-500/30',
  },
  HIGH: {
    id: 'high',
    label: 'High',
    value: 3,
    color: 'text-orange-500',
    bgColor: 'bg-orange-500/20',
    borderColor: 'border-orange-500/30',
  },
  URGENT: {
    id: 'urgent',
    label: 'Urgent',
    value: 4,
    color: 'text-red-500',
    bgColor: 'bg-red-500/20',
    borderColor: 'border-red-500/30',
  },
};

// Task Status
export const TASK_STATUS = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  ARCHIVED: 'archived',
};

// Default Categories
export const DEFAULT_CATEGORIES = [
  { id: 'personal', name: 'Personal', color: '#3B82F6', icon: 'User' },
  { id: 'work', name: 'Work', color: '#8B5CF6', icon: 'Briefcase' },
  { id: 'shopping', name: 'Shopping', color: '#10B981', icon: 'ShoppingCart' },
  { id: 'health', name: 'Health', color: '#F59E0B', icon: 'Heart' },
  { id: 'education', name: 'Education', color: '#EF4444', icon: 'BookOpen' },
  { id: 'finance', name: 'Finance', color: '#06B6D4', icon: 'DollarSign' },
];

// Navigation Items
export const NAVIGATION_ITEMS = [
  {
    id: 'home',
    label: 'Home',
    icon: 'Home',
    path: '/',
    badge: false,
  },
  {
    id: 'tasks',
    label: 'Tasks',
    icon: 'CheckSquare',
    path: '/tasks',
    badge: true,
  },
  {
    id: 'calendar',
    label: 'Calendar',
    icon: 'Calendar',
    path: '/calendar',
    badge: false,
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: 'BarChart3',
    path: '/analytics',
    badge: false,
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: 'Settings',
    path: '/settings',
    badge: false,
  },
];

// Theme Configuration
export const THEME_CONFIG = {
  LIGHT: {
    id: 'light',
    name: 'Light',
    background: 'bg-gradient-to-br from-blue-50 to-indigo-100',
    glass: 'bg-white/20 backdrop-blur-md border-white/30',
    text: 'text-gray-900',
    textSecondary: 'text-gray-600',
  },
  DARK: {
    id: 'dark',
    name: 'Dark',
    background: 'bg-gradient-to-br from-gray-900 to-blue-900',
    glass: 'bg-white/10 backdrop-blur-md border-white/20',
    text: 'text-white',
    textSecondary: 'text-gray-300',
  },
  SYSTEM: {
    id: 'system',
    name: 'System',
    background: 'bg-gradient-to-br from-slate-100 to-gray-200',
    glass: 'bg-white/25 backdrop-blur-md border-white/40',
    text: 'text-gray-900',
    textSecondary: 'text-gray-700',
  },
};

// Animation Variants
export const ANIMATION_VARIANTS = {
  fadeIn: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
  },
  slideUp: {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  },
  slideDown: {
    initial: { opacity: 0, y: -20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 20 },
  },
  scaleIn: {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.9 },
  },
  slideLeft: {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 },
  },
  slideRight: {
    initial: { opacity: 0, x: 20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -20 },
  },
};

// Notification Types
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'MMM dd, yyyy',
  INPUT: 'yyyy-MM-dd',
  TIME: 'HH:mm',
  DATETIME: 'MMM dd, yyyy HH:mm',
  FULL: 'EEEE, MMMM dd, yyyy',
};

// Sorting Options
export const SORT_OPTIONS = [
  { id: 'created_desc', label: 'Newest First', field: 'createdAt', order: 'desc' },
  { id: 'created_asc', label: 'Oldest First', field: 'createdAt', order: 'asc' },
  { id: 'priority_desc', label: 'High Priority First', field: 'priority', order: 'desc' },
  { id: 'priority_asc', label: 'Low Priority First', field: 'priority', order: 'asc' },
  { id: 'due_date_asc', label: 'Due Date (Soon)', field: 'dueDate', order: 'asc' },
  { id: 'due_date_desc', label: 'Due Date (Later)', field: 'dueDate', order: 'desc' },
  { id: 'alphabetical', label: 'Alphabetical', field: 'title', order: 'asc' },
  { id: 'completed', label: 'Completed First', field: 'completed', order: 'desc' },
];

// Filter Options
export const FILTER_OPTIONS = {
  ALL: 'all',
  ACTIVE: 'active',
  COMPLETED: 'completed',
  OVERDUE: 'overdue',
  TODAY: 'today',
  WEEK: 'week',
  MONTH: 'month',
};

// Settings Sections
export const SETTINGS_SECTIONS = [
  {
    id: 'appearance',
    title: 'Appearance',
    icon: 'Palette',
    items: ['theme', 'language', 'animations'],
  },
  {
    id: 'notifications',
    title: 'Notifications',
    icon: 'Bell',
    items: ['push', 'email', 'reminders'],
  },
  {
    id: 'data',
    title: 'Data & Privacy',
    icon: 'Shield',
    items: ['backup', 'export', 'clear'],
  },
  {
    id: 'about',
    title: 'About',
    icon: 'Info',
    items: ['version', 'help', 'feedback'],
  },
];

// Error Messages
export const ERROR_MESSAGES = {
  GENERIC: 'Something went wrong. Please try again.',
  NETWORK: 'Network error. Please check your connection.',
  VALIDATION: 'Please check your input and try again.',
  STORAGE: 'Unable to save data. Storage might be full.',
  NOT_FOUND: 'The requested item was not found.',
  PERMISSION: 'You do not have permission to perform this action.',
};

// Success Messages
export const SUCCESS_MESSAGES = {
  TASK_CREATED: 'Task created successfully!',
  TASK_UPDATED: 'Task updated successfully!',
  TASK_DELETED: 'Task deleted successfully!',
  TASK_COMPLETED: 'Task completed! Great job!',
  SETTINGS_SAVED: 'Settings saved successfully!',
  DATA_EXPORTED: 'Data exported successfully!',
  BACKUP_CREATED: 'Backup created successfully!',
};

// Keyboard Shortcuts
export const KEYBOARD_SHORTCUTS = {
  NEW_TASK: 'n',
  SEARCH: '/',
  SETTINGS: 's',
  HELP: '?',
  TOGGLE_THEME: 't',
  ESCAPE: 'Escape',
  ENTER: 'Enter',
  DELETE: 'Delete',
};

// Breakpoints (Tailwind CSS)
export const BREAKPOINTS = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};