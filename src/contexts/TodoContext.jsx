import React, { createContext, useContext, useReducer, useEffect } from 'react';

const TodoContext = createContext();

// Action types
const TODO_ACTIONS = {
  ADD_TODO: 'ADD_TODO',
  UPDATE_TODO: 'UPDATE_TODO',
  DELETE_TODO: 'DELETE_TODO',
  TOGGLE_TODO: 'TOGGLE_TODO',
  TOGGLE_FAVORITE: 'TOGGLE_FAVORITE',
  SET_FILTER: 'SET_FILTER',
  SET_SORT: 'SET_SORT',
  SET_SEARCH: 'SET_SEARCH',
  CLEAR_COMPLETED: 'CLEAR_COMPLETED',
  BULK_DELETE: 'BULK_DELETE',
  SET_CATEGORY: 'SET_CATEGORY',
  ADD_CATEGORY: 'ADD_CATEGORY',
  DELETE_CATEGORY: 'DELETE_CATEGORY',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR'
};

// Initial state
const initialState = {
  todos: [],
  filter: 'all',
  sortBy: 'date',
  searchQuery: '',
  categories: ['Personal', 'Work', 'Shopping', 'Health'],
  selectedCategory: 'all',
  loading: false,
  error: null
};

// Reducer function
const todoReducer = (state, action) => {
  switch (action.type) {
    case TODO_ACTIONS.ADD_TODO:
      return {
        ...state,
        todos: [...state.todos, action.payload],
        error: null
      };

    case TODO_ACTIONS.UPDATE_TODO:
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload.id ? { ...todo, ...action.payload } : todo
        ),
        error: null
      };

    case TODO_ACTIONS.DELETE_TODO:
      return {
        ...state,
        todos: state.todos.filter(todo => todo.id !== action.payload),
        error: null
      };

    case TODO_ACTIONS.TOGGLE_TODO:
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed, completedAt: !todo.completed ? new Date().toISOString() : null }
            : todo
        )
      };

    case TODO_ACTIONS.TOGGLE_FAVORITE:
      return {
        ...state,
        todos: state.todos.map(todo =>
          todo.id === action.payload
            ? { ...todo, favorite: !todo.favorite }
            : todo
        )
      };

    case TODO_ACTIONS.SET_FILTER:
      return {
        ...state,
        filter: action.payload
      };

    case TODO_ACTIONS.SET_SORT:
      return {
        ...state,
        sortBy: action.payload
      };

    case TODO_ACTIONS.SET_SEARCH:
      return {
        ...state,
        searchQuery: action.payload
      };

    case TODO_ACTIONS.CLEAR_COMPLETED:
      return {
        ...state,
        todos: state.todos.filter(todo => !todo.completed)
      };

    case TODO_ACTIONS.BULK_DELETE:
      return {
        ...state,
        todos: state.todos.filter(todo => !action.payload.includes(todo.id))
      };

    case TODO_ACTIONS.SET_CATEGORY:
      return {
        ...state,
        selectedCategory: action.payload
      };

    case TODO_ACTIONS.ADD_CATEGORY:
      return {
        ...state,
        categories: [...state.categories, action.payload]
      };

    case TODO_ACTIONS.DELETE_CATEGORY:
      return {
        ...state,
        categories: state.categories.filter(cat => cat !== action.payload),
        todos: state.todos.map(todo =>
          todo.category === action.payload
            ? { ...todo, category: 'Personal' }
            : todo
        )
      };

    case TODO_ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };

    case TODO_ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };

    default:
      return state;
  }
};

// Context provider component
export const TodoProvider = ({ children }) => {
  const [state, dispatch] = useReducer(todoReducer, initialState);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedTodos = localStorage.getItem('glassmorphic-todos');
      const savedCategories = localStorage.getItem('glassmorphic-categories');
      
      if (savedTodos) {
        const todos = JSON.parse(savedTodos);
        todos.forEach(todo => {
          dispatch({ type: TODO_ACTIONS.ADD_TODO, payload: todo });
        });
      }
      
      if (savedCategories) {
        const categories = JSON.parse(savedCategories);
        categories.forEach(category => {
          if (!state.categories.includes(category)) {
            dispatch({ type: TODO_ACTIONS.ADD_CATEGORY, payload: category });
          }
        });
      }
    } catch (error) {
      dispatch({ type: TODO_ACTIONS.SET_ERROR, payload: 'Failed to load saved data' });
    }
  }, []);

  // Save to localStorage whenever todos or categories change
  useEffect(() => {
    try {
      localStorage.setItem('glassmorphic-todos', JSON.stringify(state.todos));
      localStorage.setItem('glassmorphic-categories', JSON.stringify(state.categories));
    } catch (error) {
      dispatch({ type: TODO_ACTIONS.SET_ERROR, payload: 'Failed to save data' });
    }
  }, [state.todos, state.categories]);

  // Action creators
  const addTodo = (todo) => {
    const newTodo = {
      id: Date.now().toString(),
      title: todo.title,
      description: todo.description || '',
      category: todo.category || 'Personal',
      priority: todo.priority || 'medium',
      dueDate: todo.dueDate || null,
      completed: false,
      favorite: false,
      createdAt: new Date().toISOString(),
      completedAt: null,
      tags: todo.tags || []
    };
    dispatch({ type: TODO_ACTIONS.ADD_TODO, payload: newTodo });
  };

  const updateTodo = (id, updates) => {
    dispatch({ type: TODO_ACTIONS.UPDATE_TODO, payload: { id, ...updates } });
  };

  const deleteTodo = (id) => {
    dispatch({ type: TODO_ACTIONS.DELETE_TODO, payload: id });
  };

  const toggleTodo = (id) => {
    dispatch({ type: TODO_ACTIONS.TOGGLE_TODO, payload: id });
  };

  const toggleFavorite = (id) => {
    dispatch({ type: TODO_ACTIONS.TOGGLE_FAVORITE, payload: id });
  };

  const setFilter = (filter) => {
    dispatch({ type: TODO_ACTIONS.SET_FILTER, payload: filter });
  };

  const setSortBy = (sortBy) => {
    dispatch({ type: TODO_ACTIONS.SET_SORT, payload: sortBy });
  };

  const setSearchQuery = (query) => {
    dispatch({ type: TODO_ACTIONS.SET_SEARCH, payload: query });
  };

  const clearCompleted = () => {
    dispatch({ type: TODO_ACTIONS.CLEAR_COMPLETED });
  };

  const bulkDelete = (ids) => {
    dispatch({ type: TODO_ACTIONS.BULK_DELETE, payload: ids });
  };

  const setSelectedCategory = (category) => {
    dispatch({ type: TODO_ACTIONS.SET_CATEGORY, payload: category });
  };

  const addCategory = (category) => {
    if (!state.categories.includes(category)) {
      dispatch({ type: TODO_ACTIONS.ADD_CATEGORY, payload: category });
    }
  };

  const deleteCategory = (category) => {
    dispatch({ type: TODO_ACTIONS.DELETE_CATEGORY, payload: category });
  };

  const value = {
    ...state,
    addTodo,
    updateTodo,
    deleteTodo,
    toggleTodo,
    toggleFavorite,
    setFilter,
    setSortBy,
    setSearchQuery,
    clearCompleted,
    bulkDelete,
    setSelectedCategory,
    addCategory,
    deleteCategory
  };

  return (
    <TodoContext.Provider value={value}>
      {children}
    </TodoContext.Provider>
  );
};

// Custom hook to use the todo context
export const useTodos = () => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodos must be used within a TodoProvider');
  }
  return context;
};