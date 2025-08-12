import { v4 as uuidv4 } from 'uuid';

// Priority levels
export const PRIORITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
};

// Priority colors for UI
export const PRIORITY_COLORS = {
  [PRIORITY_LEVELS.LOW]: 'text-green-500',
  [PRIORITY_LEVELS.MEDIUM]: 'text-yellow-500',
  [PRIORITY_LEVELS.HIGH]: 'text-red-500'
};

// Category colors
export const CATEGORY_COLORS = {
  work: 'bg-blue-500/20 text-blue-400 border-blue-400/30',
  personal: 'bg-green-500/20 text-green-400 border-green-400/30',
  shopping: 'bg-purple-500/20 text-purple-400 border-purple-400/30',
  health: 'bg-red-500/20 text-red-400 border-red-400/30',
  education: 'bg-orange-500/20 text-orange-400 border-orange-400/30',
  finance: 'bg-yellow-500/20 text-yellow-400 border-yellow-400/30',
  other: 'bg-gray-500/20 text-gray-400 border-gray-400/30'
};

// Create a new todo
export const createTodo = (title, description = '', priority = PRIORITY_LEVELS.MEDIUM, category = 'other', dueDate = null) => {
  return {
    id: uuidv4(),
    title: title.trim(),
    description: description.trim(),
    completed: false,
    priority,
    category,
    dueDate: dueDate ? new Date(dueDate) : null,
    createdAt: new Date(),
    updatedAt: new Date(),
    completedAt: null
  };
};

// Update todo
export const updateTodo = (todo, updates) => {
  return {
    ...todo,
    ...updates,
    updatedAt: new Date(),
    completedAt: updates.completed && !todo.completed ? new Date() : 
                 !updates.completed && todo.completed ? null : 
                 todo.completedAt
  };
};

// Filter todos by status
export const filterTodosByStatus = (todos, status) => {
  switch (status) {
    case 'completed':
      return todos.filter(todo => todo.completed);
    case 'pending':
      return todos.filter(todo => !todo.completed);
    case 'overdue':
      return todos.filter(todo => 
        !todo.completed && 
        todo.dueDate && 
        new Date(todo.dueDate) < new Date()
      );
    default:
      return todos;
  }
};

// Filter todos by category
export const filterTodosByCategory = (todos, category) => {
  if (!category || category === 'all') return todos;
  return todos.filter(todo => todo.category === category);
};

// Filter todos by priority
export const filterTodosByPriority = (todos, priority) => {
  if (!priority || priority === 'all') return todos;
  return todos.filter(todo => todo.priority === priority);
};

// Sort todos
export const sortTodos = (todos, sortBy = 'createdAt', sortOrder = 'desc') => {
  return [...todos].sort((a, b) => {
    let aValue = a[sortBy];
    let bValue = b[sortBy];

    // Handle date sorting
    if (sortBy === 'createdAt' || sortBy === 'updatedAt' || sortBy === 'dueDate') {
      aValue = aValue ? new Date(aValue) : new Date(0);
      bValue = bValue ? new Date(bValue) : new Date(0);
    }

    // Handle priority sorting
    if (sortBy === 'priority') {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      aValue = priorityOrder[aValue] || 0;
      bValue = priorityOrder[bValue] || 0;
    }

    // Handle string sorting
    if (typeof aValue === 'string') {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (sortOrder === 'asc') {
      return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
    } else {
      return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
    }
  });
};

// Search todos
export const searchTodos = (todos, searchTerm) => {
  if (!searchTerm) return todos;
  
  const term = searchTerm.toLowerCase().trim();
  return todos.filter(todo => 
    todo.title.toLowerCase().includes(term) ||
    todo.description.toLowerCase().includes(term) ||
    todo.category.toLowerCase().includes(term)
  );
};

// Get todos statistics
export const getTodosStats = (todos) => {
  const total = todos.length;
  const completed = todos.filter(todo => todo.completed).length;
  const pending = total - completed;
  const overdue = todos.filter(todo => 
    !todo.completed && 
    todo.dueDate && 
    new Date(todo.dueDate) < new Date()
  ).length;

  const byPriority = {
    high: todos.filter(todo => todo.priority === PRIORITY_LEVELS.HIGH).length,
    medium: todos.filter(todo => todo.priority === PRIORITY_LEVELS.MEDIUM).length,
    low: todos.filter(todo => todo.priority === PRIORITY_LEVELS.LOW).length
  };

  const byCategory = todos.reduce((acc, todo) => {
    acc[todo.category] = (acc[todo.category] || 0) + 1;
    return acc;
  }, {});

  return {
    total,
    completed,
    pending,
    overdue,
    completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
    byPriority,
    byCategory
  };
};

// Check if todo is overdue
export const isTodoOverdue = (todo) => {
  return !todo.completed && todo.dueDate && new Date(todo.dueDate) < new Date();
};

// Check if todo is due today
export const isTodoDueToday = (todo) => {
  if (!todo.dueDate) return false;
  const today = new Date();
  const dueDate = new Date(todo.dueDate);
  return today.toDateString() === dueDate.toDateString();
};

// Format due date for display
export const formatDueDate = (dueDate) => {
  if (!dueDate) return null;
  
  const date = new Date(dueDate);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  if (date.toDateString() === today.toDateString()) {
    return 'Today';
  } else if (date.toDateString() === tomorrow.toDateString()) {
    return 'Tomorrow';
  } else {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
    });
  }
};

// Get todos for today
export const getTodosForToday = (todos) => {
  return todos.filter(todo => isTodoDueToday(todo));
};

// Get upcoming todos (next 7 days)
export const getUpcomingTodos = (todos) => {
  const now = new Date();
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  
  return todos.filter(todo => 
    todo.dueDate && 
    new Date(todo.dueDate) > now && 
    new Date(todo.dueDate) <= nextWeek
  );
};

// Validate todo data
export const validateTodo = (todoData) => {
  const errors = {};
  
  if (!todoData.title || todoData.title.trim().length === 0) {
    errors.title = 'Title is required';
  } else if (todoData.title.trim().length > 100) {
    errors.title = 'Title must be less than 100 characters';
  }
  
  if (todoData.description && todoData.description.length > 500) {
    errors.description = 'Description must be less than 500 characters';
  }
  
  if (todoData.dueDate && new Date(todoData.dueDate) < new Date().setHours(0, 0, 0, 0)) {
    errors.dueDate = 'Due date cannot be in the past';
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};