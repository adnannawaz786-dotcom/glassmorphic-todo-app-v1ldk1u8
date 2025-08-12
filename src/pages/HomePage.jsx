import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, Filter, CheckCircle2, Clock, AlertCircle, Star } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Card } from '../components/ui/card';
import { Checkbox } from '../components/ui/checkbox';
import { useTodos } from '../hooks/useTodos';
import { useSettings } from '../hooks/useSettings';
import { cn } from '../lib/utils';

const HomePage = () => {
  const { todos, addTodo, updateTodo, deleteTodo, loading } = useTodos();
  const { settings } = useSettings();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [quickTask, setQuickTask] = useState('');

  const filteredTodos = todos.filter(todo => {
    const matchesSearch = todo.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         todo.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filterStatus === 'all') return matchesSearch;
    if (filterStatus === 'completed') return matchesSearch && todo.completed;
    if (filterStatus === 'pending') return matchesSearch && !todo.completed;
    if (filterStatus === 'important') return matchesSearch && todo.priority === 'high';
    
    return matchesSearch;
  });

  const stats = {
    total: todos.length,
    completed: todos.filter(t => t.completed).length,
    pending: todos.filter(t => !t.completed).length,
    overdue: todos.filter(t => !t.completed && new Date(t.dueDate) < new Date()).length
  };

  const handleQuickAdd = () => {
    if (!quickTask.trim()) return;
    
    addTodo({
      title: quickTask,
      priority: 'medium',
      category: 'personal',
      dueDate: new Date().toISOString().split('T')[0]
    });
    
    setQuickTask('');
  };

  const handleToggleComplete = (todo) => {
    updateTodo(todo.id, { completed: !todo.completed });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-500';
      case 'medium': return 'text-yellow-500';
      case 'low': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const isOverdue = (dueDate) => {
    return new Date(dueDate) < new Date() && new Date(dueDate).toDateString() !== new Date().toDateString();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 p-4 pb-20">
      <div className="max-w-md mx-auto space-y-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-white mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">My Tasks</h1>
          <p className="text-white/80">Stay organized and productive</p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="grid grid-cols-4 gap-3"
        >
          <Card className="glass-card p-3 text-center">
            <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
            <div className="text-xs text-gray-600">Total</div>
          </Card>
          <Card className="glass-card p-3 text-center">
            <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
            <div className="text-xs text-gray-600">Done</div>
          </Card>
          <Card className="glass-card p-3 text-center">
            <div className="text-2xl font-bold text-orange-600">{stats.pending}</div>
            <div className="text-xs text-gray-600">Pending</div>
          </Card>
          <Card className="glass-card p-3 text-center">
            <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
            <div className="text-xs text-gray-600">Overdue</div>
          </Card>
        </motion.div>

        {/* Quick Add */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-4"
        >
          <div className="flex gap-2">
            <Input
              placeholder="Quick add task..."
              value={quickTask}
              onChange={(e) => setQuickTask(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleQuickAdd()}
              className="flex-1 bg-white/20 border-white/30 text-white placeholder:text-white/60"
            />
            <Button 
              onClick={handleQuickAdd}
              size="icon"
              className="bg-white/20 hover:bg-white/30 border-white/30"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-4 space-y-3"
        >
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/60" />
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-white/20 border-white/30 text-white placeholder:text-white/60"
              />
            </div>
            <Button 
              variant="outline" 
              size="icon"
              className="bg-white/20 hover:bg-white/30 border-white/30"
            >
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex gap-2 flex-wrap">
            {['all', 'pending', 'completed', 'important'].map((filter) => (
              <Badge
                key={filter}
                variant={filterStatus === filter ? 'default' : 'outline'}
                className={cn(
                  'cursor-pointer transition-all',
                  filterStatus === filter 
                    ? 'bg-white text-purple-600' 
                    : 'bg-white/20 text-white border-white/30 hover:bg-white/30'
                )}
                onClick={() => setFilterStatus(filter)}
              >
                {filter.charAt(0).toUpperCase() + filter.slice(1)}
              </Badge>
            ))}
          </div>
        </motion.div>

        {/* Todo List */}
        <div className="space-y-3">
          <AnimatePresence>
            {filteredTodos.map((todo, index) => (
              <motion.div
                key={todo.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card className="glass-card p-4 hover:bg-white/20 transition-all duration-200">
                  <div className="flex items-start gap-3">
                    <Checkbox
                      checked={todo.completed}
                      onCheckedChange={() => handleToggleComplete(todo)}
                      className="mt-1"
                    />
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className={cn(
                          "font-medium text-white",
                          todo.completed && "line-through opacity-60"
                        )}>
                          {todo.title}
                        </h3>
                        {todo.priority === 'high' && (
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                        )}
                      </div>
                      
                      {todo.description && (
                        <p className="text-sm text-white/70 mb-2">{todo.description}</p>
                      )}
                      
                      <div className="flex items-center gap-3 text-xs">
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span className={cn(
                            "text-white/70",
                            isOverdue(todo.dueDate) && !todo.completed && "text-red-300"
                          )}>
                            {new Date(todo.dueDate).toLocaleDateString()}
                          </span>
                        </div>
                        
                        <Badge 
                          variant="outline" 
                          className="bg-white/10 text-white/80 border-white/30"
                        >
                          {todo.category}
                        </Badge>
                        
                        <div className={cn("flex items-center gap-1", getPriorityColor(todo.priority))}>
                          <AlertCircle className="h-3 w-3" />
                          <span className="text-white/70">{todo.priority}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {filteredTodos.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <CheckCircle2 className="h-16 w-16 text-white/40 mx-auto mb-4" />
              <p className="text-white/70 text-lg">
                {searchTerm || filterStatus !== 'all' 
                  ? 'No tasks match your filters' 
                  : 'No tasks yet. Add one above!'}
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;