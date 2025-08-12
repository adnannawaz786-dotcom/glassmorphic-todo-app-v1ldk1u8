import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, X, Calendar, Tag, Flag, Clock, Edit3 } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { cn } from '../../lib/utils';

const TodoForm = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  editingTodo = null,
  categories = [],
  className 
}) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium',
    dueDate: '',
    tags: []
  });
  
  const [currentTag, setCurrentTag] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const priorities = [
    { value: 'low', label: 'Low', color: 'bg-green-500' },
    { value: 'medium', label: 'Medium', color: 'bg-yellow-500' },
    { value: 'high', label: 'High', color: 'bg-red-500' }
  ];

  useEffect(() => {
    if (editingTodo) {
      setFormData({
        title: editingTodo.title || '',
        description: editingTodo.description || '',
        category: editingTodo.category || '',
        priority: editingTodo.priority || 'medium',
        dueDate: editingTodo.dueDate || '',
        tags: editingTodo.tags || []
      });
    } else {
      resetForm();
    }
  }, [editingTodo, isOpen]);

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      category: '',
      priority: 'medium',
      dueDate: '',
      tags: []
    });
    setCurrentTag('');
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (formData.dueDate && new Date(formData.dueDate) < new Date().setHours(0, 0, 0, 0)) {
      newErrors.dueDate = 'Due date cannot be in the past';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleAddTag = () => {
    if (currentTag.trim() && !formData.tags.includes(currentTag.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && e.target.name === 'tag') {
      e.preventDefault();
      handleAddTag();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const todoData = {
        ...formData,
        id: editingTodo?.id || Date.now(),
        createdAt: editingTodo?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        completed: editingTodo?.completed || false
      };
      
      await onSubmit(todoData);
      resetForm();
      onClose();
    } catch (error) {
      console.error('Error submitting todo:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const formVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 50
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 30
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.8,
      y: 50,
      transition: {
        duration: 0.2
      }
    }
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        variants={overlayVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
      >
        <motion.div
          className="absolute inset-0 bg-black/50 backdrop-blur-sm"
          onClick={onClose}
        />
        
        <motion.div
          className={cn(
            "relative w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl",
            "border border-white/20 shadow-2xl max-h-[90vh] overflow-y-auto",
            className
          )}
          variants={formVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white flex items-center gap-2">
                {editingTodo ? <Edit3 size={20} /> : <Plus size={20} />}
                {editingTodo ? 'Edit Todo' : 'New Todo'}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white/70 hover:text-white hover:bg-white/10"
              >
                <X size={20} />
              </Button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="title" className="text-white/90">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="Enter todo title..."
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                />
                {errors.title && (
                  <p className="text-red-400 text-sm mt-1">{errors.title}</p>
                )}
              </div>

              <div>
                <Label htmlFor="description" className="text-white/90">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Add description..."
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/50 min-h-[80px]"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-white/90 flex items-center gap-2">
                    <Tag size={16} />
                    Category
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleInputChange('category', value)}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-white/90 flex items-center gap-2">
                    <Flag size={16} />
                    Priority
                  </Label>
                  <Select
                    value={formData.priority}
                    onValueChange={(value) => handleInputChange('priority', value)}
                  >
                    <SelectTrigger className="bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {priorities.map((priority) => (
                        <SelectItem key={priority.value} value={priority.value}>
                          <div className="flex items-center gap-2">
                            <div className={`w-2 h-2 rounded-full ${priority.color}`} />
                            {priority.label}
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="dueDate" className="text-white/90 flex items-center gap-2">
                  <Calendar size={16} />
                  Due Date
                </Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => handleInputChange('dueDate', e.target.value)}
                  className="bg-white/10 border-white/20 text-white"
                />
                {errors.dueDate && (
                  <p className="text-red-400 text-sm mt-1">{errors.dueDate}</p>
                )}
              </div>

              <div>
                <Label className="text-white/90">Tags</Label>
                <div className="flex gap-2 mb-2">
                  <Input
                    name="tag"
                    value={currentTag}
                    onChange={(e) => setCurrentTag(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Add tag..."
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={handleAddTag}
                    disabled={!currentTag.trim()}
                  >
                    <Plus size={16} />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {formData.tags.map((tag, index) => (
                    <Badge
                      key={index}
                      variant="secondary"
                      className="bg-white/20 text-white"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:text-red-400"
                      >
                        <X size={12} />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="flex-1 border-white/20 text-white hover:bg-white/10"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  {isSubmitting ? (
                    <Clock className="animate-spin" size={16} />
                  ) : (
                    editingTodo ? 'Update' : 'Create'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default TodoForm;