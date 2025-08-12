import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Settings, Home, Calendar, CheckSquare, BarChart3, Moon, Sun, Bell, User, Palette, Database, Shield, HelpCircle, X } from 'lucide-react';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Textarea } from './components/ui/textarea';
import { Switch } from './components/ui/switch';
import { Badge } from './components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { cn } from './lib/utils';

const App = () => {
  const [activeTab, setActiveTab] = useState('home');
  const [showSettings, setShowSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [todos, setTodos] = useState([
    { id: 1, title: 'Complete project proposal', description: 'Finish the quarterly project proposal', completed: false, priority: 'high', dueDate: '2024-01-15', category: 'work' },
    { id: 2, title: 'Buy groceries', description: 'Milk, bread, eggs, vegetables', completed: false, priority: 'medium', dueDate: '2024-01-12', category: 'personal' },
    { id: 3, title: 'Exercise routine', description: '30 minutes cardio workout', completed: true, priority: 'low', dueDate: '2024-01-11', category: 'health' }
  ]);
  const [newTodo, setNewTodo] = useState({ title: '', description: '', priority: 'medium', category: 'personal', dueDate: '' });
  const [showAddForm, setShowAddForm] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
  }, [darkMode]);

  const addTodo = () => {
    if (newTodo.title.trim()) {
      setTodos([...todos, { ...newTodo, id: Date.now(), completed: false }]);
      setNewTodo({ title: '', description: '', priority: 'medium', category: 'personal', dueDate: '' });
      setShowAddForm(false);
    }
  };

  const toggleTodo = (id) => {
    setTodos(todos.map(todo => todo.id === id ? { ...todo, completed: !todo.completed } : todo));
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-600 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-600 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-600 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-600 border-gray-500/30';
    }
  };

  const getStats = () => {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const pending = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    return { total, completed, pending, completionRate };
  };

  const renderHome = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <CheckSquare className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                <p className="text-2xl font-bold">{getStats().completed}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                <p className="text-2xl font-bold">{getStats().pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-3">
        {todos.map((todo) => (
          <motion.div
            key={todo.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-4"
          >
            <div className="flex items-start space-x-3">
              <button
                onClick={() => toggleTodo(todo.id)}
                className={cn(
                  "mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center",
                  todo.completed ? "bg-green-500 border-green-500" : "border-gray-300"
                )}
              >
                {todo.completed && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-2 h-2 bg-white rounded-full" />}
              </button>
              <div className="flex-1 min-w-0">
                <h3 className={cn("font-medium", todo.completed && "line-through text-gray-500")}>{todo.title}</h3>
                {todo.description && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{todo.description}</p>}
                <div className="flex items-center space-x-2 mt-2">
                  <Badge className={cn("text-xs", getPriorityColor(todo.priority))}>{todo.priority}</Badge>
                  <Badge variant="outline" className="text-xs">{todo.category}</Badge>
                  {todo.dueDate && <span className="text-xs text-gray-500">{new Date(todo.dueDate).toLocaleDateString()}</span>}
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={() => deleteTodo(todo.id)} className="text-red-500 hover:text-red-700">
                <X className="h-4 w-4" />
              </Button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );

  const renderStats = () => {
    const stats = getStats();
    return (
      <div className="space-y-6">
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5" />
              <span>Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-2xl font-bold text-blue-500">{stats.total}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total Tasks</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-green-500">{stats.completed}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
              </div>
              <div>
                <p className="text-2xl font-bold text-orange-500">{stats.pending}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Completion Rate</span>
                <span>{stats.completionRate}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.completionRate}%` }}
                  className="bg-gradient-to-r from-blue-500 to-green-500 h-2 rounded-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderSettings = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <Card className="bg-white/10 backdrop-blur-md border-white/20">
          <CardContent className="p-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Moon className="h-5 w-5" />
                <span>Dark Mode</span>
              </div>
              <Switch checked={darkMode} onCheckedChange={setDarkMode} />
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Bell className="h-5 w-5" />
                <span>Notifications</span>
              </div>
              <Switch />
            </div>
          </CardContent>
        </Card>
        
        <div className="space-y-2">
          {[
            { icon: User, label: 'Profile Settings' },
            { icon: Palette, label: 'Theme Customization' },
            { icon: Database, label: 'Data Management' },
            { icon: Shield, label: 'Privacy & Security' },
            { icon: HelpCircle, label: 'Help & Support' }
          ].map(({ icon: Icon, label }) => (
            <Card key={label} className="bg-white/10 backdrop-blur-md border-white/20 cursor-pointer hover:bg-white/20 transition-colors">
              <CardContent className="p-4 flex items-center space-x-3">
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className={cn("min-h-screen bg-gradient-to-br from-blue-400 via-purple-500 to-pink-500", darkMode && "from-gray-900 via-purple-900 to-indigo-900")}>
      <div className="container mx-auto px-4 py-6 pb-20 max-w-md">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-2xl font-bold text-white">Todo App</h1>
            <p className="text-white/80 text-sm">Stay organized, stay productive</p>
          </div>
          <Button
            onClick={() => setShowSettings(!showSettings)}
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20"
          >
            <Settings className="h-5 w-5" />
          </Button>
        </motion.header>

        <AnimatePresence mode="wait">
          <motion.main
            key={showSettings ? 'settings' : activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
          >
            {showSettings ? renderSettings() : activeTab === 'home' ? renderHome() : renderStats()}
          </motion.main>
        </AnimatePresence>

        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-6 w-full max-w-md"
              >
                <h3 className="text-lg font-semibold text-white mb-4">Add New Task</h3>
                <div className="space-y-4">
                  <Input
                    placeholder="Task title"
                    value={newTodo.title}
                    onChange={(e) => setNewTodo({ ...newTodo, title: e.target.value })}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  />
                  <Textarea
                    placeholder="Description (optional)"
                    value={newTodo.description}
                    onChange={(e) => setNewTodo({ ...newTodo, description: e.target.value })}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Select value={newTodo.priority} onValueChange={(value) => setNewTodo({ ...newTodo, priority: value })}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">High Priority</SelectItem>
                        <SelectItem value="medium">Medium Priority</SelectItem>
                        <SelectItem value="low">Low Priority</SelectItem>
                      </SelectContent>
                    </Select>
                    <Select value={newTodo.category} onValueChange={(value) => setNewTodo({ ...newTodo, category: value })}>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="work">Work</SelectItem>
                        <SelectItem value="personal">Personal</SelectItem>
                        <SelectItem value="health">Health</SelectItem>
                        <SelectItem value="shopping">Shopping</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Input
                    type="date"
                    value={newTodo.dueDate}
                    onChange={(e) => setNewTodo({ ...newTodo, dueDate: e.target.value })}
                    className="bg-white/10 border-white/20 text-white"
                  />
                  <div className="flex space-x-3">
                    <Button onClick={addTodo} className="flex-1 bg-white/20 hover:bg-white/30 text-white border-white/30">
                      Add Task
                    </Button>
                    <Button onClick={() => setShowAddForm(false)} variant="outline" className="border-white/30 text-white hover:bg-white/10">
                      Cancel
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {!showSettings && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="fixed bottom-0 left-0 right-0 bg-white/10 backdrop-blur-md border-t border-white/20"
          >
            <div className="container mx-auto px-4 py-3 max-w-md">
              <div className="flex items-center justify-around">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveTab('home')}
                  className={cn("flex flex-col items-center space-y-1 text-white hover:bg-white/20", activeTab === 'home' && "bg-white/20")}
                >
                  <Home className="h-5 w-5" />
                  <span className="text-xs">Home</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowAddForm(true)}
                  className="flex flex-col items-center space-y-1 text-white hover:bg-white/20 bg-white/20 rounded-full p-3"
                >
                  <Plus className="h-6 w-6" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setActiveTab('stats')}
                  className={cn("flex flex-col items-center space-y-1 text-white hover:bg-white/20", activeTab === 'stats' && "bg-white/20")}
                >
                  <BarChart3 className="h-5 w-5" />
                  <span className="text-xs">Stats</span>
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default App;