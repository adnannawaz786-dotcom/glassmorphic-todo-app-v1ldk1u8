import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Edit2, Trash2, Tag, Check, X, Palette } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { cn } from '../lib/utils';

const CategoriesPage = () => {
  const [categories, setCategories] = useState([
    { id: 1, name: 'Work', color: '#3B82F6', taskCount: 5 },
    { id: 2, name: 'Personal', color: '#EF4444', taskCount: 8 },
    { id: 3, name: 'Shopping', color: '#10B981', taskCount: 3 },
    { id: 4, name: 'Health', color: '#F59E0B', taskCount: 2 }
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [formData, setFormData] = useState({ name: '', color: '#3B82F6' });

  const colorOptions = [
    '#3B82F6', '#EF4444', '#10B981', '#F59E0B',
    '#8B5CF6', '#EC4899', '#06B6D4', '#84CC16',
    '#F97316', '#6366F1', '#14B8A6', '#EAB308'
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingCategory) {
      setCategories(prev => prev.map(cat => 
        cat.id === editingCategory.id 
          ? { ...cat, name: formData.name, color: formData.color }
          : cat
      ));
    } else {
      const newCategory = {
        id: Date.now(),
        name: formData.name,
        color: formData.color,
        taskCount: 0
      };
      setCategories(prev => [...prev, newCategory]);
    }

    setFormData({ name: '', color: '#3B82F6' });
    setEditingCategory(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (category) => {
    setEditingCategory(category);
    setFormData({ name: category.name, color: category.color });
    setIsDialogOpen(true);
  };

  const handleDelete = (categoryId) => {
    setCategories(prev => prev.filter(cat => cat.id !== categoryId));
  };

  const resetForm = () => {
    setFormData({ name: '', color: '#3B82F6' });
    setEditingCategory(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 p-4 pb-20">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md mx-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <motion.h1 
            className="text-2xl font-bold text-white"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            Categories
          </motion.h1>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={resetForm}
                className="bg-white/20 backdrop-blur-md border border-white/30 text-white hover:bg-white/30 transition-all duration-300"
                size="sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Category
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-white/10 backdrop-blur-xl border border-white/20 text-white">
              <DialogHeader>
                <DialogTitle className="text-white">
                  {editingCategory ? 'Edit Category' : 'Create New Category'}
                </DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="name" className="text-white/80">Category Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter category name"
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50"
                    required
                  />
                </div>
                <div>
                  <Label className="text-white/80 mb-3 block">Choose Color</Label>
                  <div className="grid grid-cols-6 gap-2">
                    {colorOptions.map((color) => (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, color }))}
                        className={cn(
                          "w-8 h-8 rounded-full border-2 transition-all duration-200",
                          formData.color === color ? "border-white scale-110" : "border-white/30"
                        )}
                        style={{ backgroundColor: color }}
                      >
                        {formData.color === color && (
                          <Check className="w-4 h-4 text-white mx-auto" />
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsDialogOpen(false)}
                    className="flex-1 border-white/20 text-white hover:bg-white/10"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-white/20 text-white hover:bg-white/30"
                  >
                    <Check className="w-4 h-4 mr-2" />
                    {editingCategory ? 'Update' : 'Create'}
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-3">
          <AnimatePresence>
            {categories.map((category, index) => (
              <motion.div
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="bg-white/10 backdrop-blur-xl border border-white/20 text-white hover:bg-white/15 transition-all duration-300">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: category.color }}
                        />
                        <div>
                          <h3 className="font-medium">{category.name}</h3>
                          <p className="text-sm text-white/70">
                            {category.taskCount} tasks
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge
                          variant="secondary"
                          className="bg-white/10 text-white border-white/20"
                        >
                          {category.taskCount}
                        </Badge>
                        <Button
                          onClick={() => handleEdit(category)}
                          size="sm"
                          variant="ghost"
                          className="text-white/70 hover:text-white hover:bg-white/10 p-1 h-auto"
                        >
                          <Edit2 className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => handleDelete(category.id)}
                          size="sm"
                          variant="ghost"
                          className="text-red-300 hover:text-red-200 hover:bg-red-500/20 p-1 h-auto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {categories.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-12"
          >
            <Tag className="w-16 h-16 text-white/50 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-white/80 mb-2">No Categories Yet</h3>
            <p className="text-white/60 mb-4">Create your first category to organize your tasks</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default CategoriesPage;