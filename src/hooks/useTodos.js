import { useState, useEffect, useCallback, useMemo } from 'react';
import { toast } from 'sonner';

const STORAGE_KEY = 'glassmorphic-todos';

const initialFilters = {
  status: 'all', // all, active, completed
  priority: 'all', // all, low, medium, high
  category: 'all',
  search: ''
};

const initialSettings = {
  theme: 'light',
  notifications: true,
  autoSort: true,
  defaultPriority: 'medium',
  showCompleted: true,
  compactView: false
};

export const useTodos = () => {
  const [todos, setTodos] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [settings, setSettings] = useState(initialSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTodos, setSelectedTodos] = useState(new Set());

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedTodos = localStorage.getItem(STORAGE_KEY);
      const savedFilters = localStorage.getItem(`${STORAGE_KEY}-filters`);
      const savedSettings = localStorage.getItem(`${STORAGE_KEY}-settings`);

      if (savedTodos) {
        const parsedTodos = JSON.parse(savedTodos);
        setTodos(parsedTodos);
      }

      if (savedFilters) {
        setFilters({ ...initialFilters, ...JSON.parse(savedFilters) });
      }

      if (savedSettings) {
        setSettings({ ...initialSettings, ...JSON.parse(savedSettings) });
      }
    } catch (error) {
      console.error('Error loading todos:', error);
      toast.error('Failed to load todos');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Save todos to localStorage whenever todos change
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
    }
  }, [todos, isLoading]);

  // Save filters to localStorage
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(`${STORAGE_KEY}-filters`, JSON.stringify(filters));
    }
  }, [filters, isLoading]);

  // Save settings to localStorage
  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(`${STORAGE_KEY}-settings`, JSON.stringify(settings));
    }
  }, [settings, isLoading]);

  // Add new todo
  const addTodo = useCallback((todoData) => {
    try {
      const newTodo = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        title: todoData.title.trim(),
        description: todoData.description?.trim() || '',
        completed: false,
        priority: todoData.priority || settings.defaultPriority,
        category: todoData.category || 'general',
        tags: todoData.tags || [],
        dueDate: todoData.dueDate || null,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        subtasks: todoData.subtasks || [],
        attachments: todoData.attachments || []
      };

      setTodos(prev => {
        const updated = [...prev, newTodo];
        return settings.autoSort ? sortTodos(updated) : updated;
      });

      if (settings.notifications) {
        toast.success('Todo added successfully');
      }

      return newTodo;
    } catch (error) {
      console.error('Error adding todo:', error);
      toast.error('Failed to add todo');
      return null;
    }
  }, [settings.defaultPriority, settings.autoSort, settings.notifications]);

  // Update todo
  const updateTodo = useCallback((id, updates) => {
    try {
      setTodos(prev => {
        const updated = prev.map(todo =>
          todo.id === id
            ? { ...todo, ...updates, updatedAt: new Date().toISOString() }
            : todo
        );
        return settings.autoSort ? sortTodos(updated) : updated;
      });

      if (settings.notifications) {
        toast.success('Todo updated successfully');
      }
    } catch (error) {
      console.error('Error updating todo:', error);
      toast.error('Failed to update todo');
    }
  }, [settings.autoSort, settings.notifications]);

  // Delete todo
  const deleteTodo = useCallback((id) => {
    try {
      setTodos(prev => prev.filter(todo => todo.id !== id));
      setSelectedTodos(prev => {
        const updated = new Set(prev);
        updated.delete(id);
        return updated;
      });

      if (settings.notifications) {
        toast.success('Todo deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting todo:', error);
      toast.error('Failed to delete todo');
    }
  }, [settings.notifications]);

  // Toggle todo completion
  const toggleTodo = useCallback((id) => {
    updateTodo(id, { completed: !todos.find(t => t.id === id)?.completed });
  }, [todos, updateTodo]);

  // Bulk operations
  const deleteSelectedTodos = useCallback(() => {
    try {
      setTodos(prev => prev.filter(todo => !selectedTodos.has(todo.id)));
      setSelectedTodos(new Set());
      
      if (settings.notifications) {
        toast.success(`${selectedTodos.size} todos deleted`);
      }
    } catch (error) {
      console.error('Error deleting selected todos:', error);
      toast.error('Failed to delete selected todos');
    }
  }, [selectedTodos, settings.notifications]);

  const toggleSelectedTodos = useCallback(() => {
    try {
      const selectedTodosList = todos.filter(todo => selectedTodos.has(todo.id));
      const allCompleted = selectedTodosList.every(todo => todo.completed);
      
      setTodos(prev => prev.map(todo =>
        selectedTodos.has(todo.id)
          ? { ...todo, completed: !allCompleted, updatedAt: new Date().toISOString() }
          : todo
      ));

      if (settings.notifications) {
        toast.success(`${selectedTodos.size} todos ${allCompleted ? 'marked as incomplete' : 'completed'}`);
      }
    } catch (error) {
      console.error('Error toggling selected todos:', error);
      toast.error('Failed to update selected todos');
    }
  }, [todos, selectedTodos, settings.notifications]);

  // Sort todos
  const sortTodos = useCallback((todoList) => {
    return [...todoList].sort((a, b) => {
      // Priority order: high -> medium -> low
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      const priorityDiff = priorityOrder[b.priority] - priorityOrder[a.priority];
      
      if (priorityDiff !== 0) return priorityDiff;
      
      // Then by completion status (incomplete first)
      if (a.completed !== b.completed) {
        return a.completed ? 1 : -1;
      }
      
      // Finally by creation date (newest first)
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, []);

  // Filter and search todos
  const filteredTodos = useMemo(() => {
    let filtered = [...todos];

    // Filter by completion status
    if (filters.status === 'active') {
      filtered = filtered.filter(todo => !todo.completed);
    } else if (filters.status === 'completed') {
      filtered = filtered.filter(todo => todo.completed);
    }

    // Filter by priority
    if (filters.priority !== 'all') {
      filtered = filtered.filter(todo => todo.priority === filters.priority);
    }

    // Filter by category
    if (filters.category !== 'all') {
      filtered = filtered.filter(todo => todo.category === filters.category);
    }

    // Search filter
    if (filters.search.trim()) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(todo =>
        todo.title.toLowerCase().includes(searchTerm) ||
        todo.description.toLowerCase().includes(searchTerm) ||
        todo.tags.some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }

    // Hide completed todos if setting is disabled
    if (!settings.showCompleted) {
      filtered = filtered.filter(todo => !todo.completed);
    }

    return filtered;
  }, [todos, filters, settings.showCompleted]);

  // Statistics
  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const active = total - completed;
    const overdue = todos.filter(todo => 
      !todo.completed && todo.dueDate && new Date(todo.dueDate) < new Date()
    ).length;

    return {
      total,
      completed,
      active,
      overdue,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0
    };
  }, [todos]);

  // Get unique categories
  const categories = useMemo(() => {
    const uniqueCategories = [...new Set(todos.map(todo => todo.category))];
    return uniqueCategories.sort();
  }, [todos]);

  return {
    // State
    todos: filteredTodos,
    allTodos: todos,
    filters,
    settings,
    isLoading,
    selectedTodos,
    stats,
    categories,

    // Actions
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    deleteSelectedTodos,
    toggleSelectedTodos,

    // Filters and settings
    setFilters,
    setSettings,
    setSelectedTodos,

    // Utilities
    sortTodos
  };
};