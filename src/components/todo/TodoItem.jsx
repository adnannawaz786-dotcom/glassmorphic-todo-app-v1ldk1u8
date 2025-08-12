import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, 
  X, 
  Edit3, 
  Trash2, 
  Star, 
  Clock, 
  Calendar,
  Flag,
  MoreVertical,
  Save,
  AlertCircle
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu';
import { cn } from '../../lib/utils';

const TodoItem = ({ 
  todo, 
  onToggle, 
  onDelete, 
  onEdit, 
  onToggleFavorite,
  onSetPriority,
  className 
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editDescription, setEditDescription] = useState(todo.description || '');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSave = () => {
    if (editTitle.trim()) {
      onEdit(todo.id, {
        title: editTitle.trim(),
        description: editDescription.trim()
      });
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditDescription(todo.description || '');
    setIsEditing(false);
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-400 bg-red-400/10 border-red-400/20';
      case 'medium': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
      case 'low': return 'text-green-400 bg-green-400/10 border-green-400/20';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/20';
    }
  };

  const getPriorityIcon = (priority) => {
    return <Flag className="w-3 h-3" />;
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Today';
    if (diffDays === 1) return 'Tomorrow';
    if (diffDays === -1) return 'Yesterday';
    if (diffDays < 0) return `${Math.abs(diffDays)} days ago`;
    return `${diffDays} days left`;
  };

  const isOverdue = todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.completed;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -20, scale: 0.95 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className={cn(
        "group relative overflow-hidden rounded-2xl backdrop-blur-xl border transition-all duration-300",
        "bg-white/10 border-white/20 hover:bg-white/15 hover:border-white/30",
        todo.completed && "opacity-75 bg-white/5",
        isOverdue && "border-red-400/40 bg-red-400/5",
        className
      )}
    >
      {/* Glass effect overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent pointer-events-none" />
      
      <div className="relative p-4 space-y-3">
        {/* Main content */}
        <div className="flex items-start gap-3">
          {/* Checkbox */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => onToggle(todo.id)}
            className={cn(
              "flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200",
              todo.completed 
                ? "bg-green-500 border-green-500 text-white" 
                : "border-white/40 hover:border-white/60 hover:bg-white/10"
            )}
          >
            <AnimatePresence>
              {todo.completed && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                >
                  <Check className="w-4 h-4" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {isEditing ? (
              <div className="space-y-3">
                <Input
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60"
                  placeholder="Task title..."
                  autoFocus
                />
                <Textarea
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="bg-white/10 border-white/20 text-white placeholder:text-white/60 min-h-[60px]"
                  placeholder="Description (optional)..."
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleSave}
                    className="bg-green-500/20 hover:bg-green-500/30 text-green-400 border-green-500/30"
                  >
                    <Save className="w-4 h-4 mr-1" />
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={handleCancel}
                    className="bg-white/10 hover:bg-white/20 text-white border-white/20"
                  >
                    <X className="w-4 h-4 mr-1" />
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <h3 
                    className={cn(
                      "font-medium text-white transition-all cursor-pointer",
                      todo.completed && "line-through text-white/60"
                    )}
                    onClick={() => setIsExpanded(!isExpanded)}
                  >
                    {todo.title}
                  </h3>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => onToggleFavorite(todo.id)}
                      className={cn(
                        "w-8 h-8 p-0 hover:bg-white/20",
                        todo.favorite ? "text-yellow-400" : "text-white/60"
                      )}
                    >
                      <Star className={cn("w-4 h-4", todo.favorite && "fill-current")} />
                    </Button>
                    
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="w-8 h-8 p-0 text-white/60 hover:text-white hover:bg-white/20"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent 
                        className="bg-black/80 backdrop-blur-xl border-white/20"
                        align="end"
                      >
                        <DropdownMenuItem 
                          onClick={() => setIsEditing(true)}
                          className="text-white hover:bg-white/10"
                        >
                          <Edit3 className="w-4 h-4 mr-2" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-white/20" />
                        <DropdownMenuItem 
                          onClick={() => onSetPriority(todo.id, 'high')}
                          className="text-red-400 hover:bg-red-400/10"
                        >
                          <Flag className="w-4 h-4 mr-2" />
                          High Priority
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => onSetPriority(todo.id, 'medium')}
                          className="text-yellow-400 hover:bg-yellow-400/10"
                        >
                          <Flag className="w-4 h-4 mr-2" />
                          Medium Priority
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => onSetPriority(todo.id, 'low')}
                          className="text-green-400 hover:bg-green-400/10"
                        >
                          <Flag className="w-4 h-4 mr-2" />
                          Low Priority
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-white/20" />
                        <DropdownMenuItem 
                          onClick={() => onDelete(todo.id)}
                          className="text-red-400 hover:bg-red-400/10"
                        >
                          <Trash2 className="w-4 h-4 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                {/* Description */}
                <AnimatePresence>
                  {(isExpanded || todo.description) && todo.description && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="text-sm text-white/70 leading-relaxed"
                    >
                      {todo.description}
                    </motion.p>
                  )}
                </AnimatePresence>

                {/* Meta information */}
                <div className="flex items-center gap-3 text-xs">
                  {todo.priority && (
                    <Badge 
                      variant="outline" 
                      className={cn("border", getPriorityColor(todo.priority))}
                    >
                      {getPriorityIcon(todo.priority)}
                      <span className="ml-1 capitalize">{todo.priority}</span>
                    </Badge>
                  )}
                  
                  {todo.dueDate && (
                    <div className={cn(
                      "flex items-center gap-1",
                      isOverdue ? "text-red-400" : "text-white/60"
                    )}>
                      {isOverdue ? <AlertCircle className="w-3 h-3" /> : <Calendar className="w-3 h-3" />}
                      <span>{formatDate(todo.dueDate)}</span>
                    </div>
                  )}
                  
                  {todo.createdAt && (
                    <div className="flex items-center gap-1 text-white/40">
                      <Clock className="w-3 h-3" />
                      <span>Created {formatDate(todo.createdAt)}</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TodoItem;