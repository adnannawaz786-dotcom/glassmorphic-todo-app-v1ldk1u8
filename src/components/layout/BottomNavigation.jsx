import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Home, 
  CheckSquare, 
  Calendar, 
  BarChart3, 
  Settings, 
  Plus,
  Filter,
  Search
} from 'lucide-react';
import { Button } from '../ui/button';
import { cn } from '../../lib/utils';

const BottomNavigation = ({ 
  activeTab, 
  onTabChange, 
  onAddTask, 
  onToggleFilter, 
  onToggleSearch,
  className 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [hoveredTab, setHoveredTab] = useState(null);

  const navigationTabs = [
    {
      id: 'home',
      label: 'Home',
      icon: Home,
      color: 'text-blue-500',
      activeColor: 'text-blue-600'
    },
    {
      id: 'tasks',
      label: 'Tasks',
      icon: CheckSquare,
      color: 'text-green-500',
      activeColor: 'text-green-600'
    },
    {
      id: 'calendar',
      label: 'Calendar',
      icon: Calendar,
      color: 'text-purple-500',
      activeColor: 'text-purple-600'
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      color: 'text-orange-500',
      activeColor: 'text-orange-600'
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      color: 'text-gray-500',
      activeColor: 'text-gray-600'
    }
  ];

  const quickActions = [
    {
      id: 'add',
      label: 'Add Task',
      icon: Plus,
      action: onAddTask,
      color: 'text-emerald-500'
    },
    {
      id: 'filter',
      label: 'Filter',
      icon: Filter,
      action: onToggleFilter,
      color: 'text-indigo-500'
    },
    {
      id: 'search',
      label: 'Search',
      icon: Search,
      action: onToggleSearch,
      color: 'text-rose-500'
    }
  ];

  const handleTabClick = (tabId) => {
    onTabChange(tabId);
    setIsExpanded(false);
  };

  const handleQuickAction = (action) => {
    if (action) {
      action();
    }
    setIsExpanded(false);
  };

  return (
    <>
      {/* Overlay */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40"
            onClick={() => setIsExpanded(false)}
          />
        )}
      </AnimatePresence>

      {/* Quick Actions Panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 25 
            }}
            className="fixed bottom-24 left-1/2 transform -translate-x-1/2 z-50"
          >
            <div className="bg-white/20 backdrop-blur-xl border border-white/20 rounded-2xl p-4 shadow-2xl">
              <div className="flex gap-4">
                {quickActions.map((action) => (
                  <motion.div
                    key={action.id}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Button
                      variant="ghost"
                      size="lg"
                      onClick={() => handleQuickAction(action.action)}
                      className="flex flex-col items-center gap-2 h-auto p-4 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl transition-all duration-200"
                    >
                      <action.icon className={cn("w-6 h-6", action.color)} />
                      <span className="text-xs text-white/80 font-medium">
                        {action.label}
                      </span>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Navigation */}
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn(
          "fixed bottom-0 left-0 right-0 z-50",
          "bg-white/10 backdrop-blur-xl border-t border-white/20",
          "px-4 py-2 safe-area-pb",
          className
        )}
      >
        <div className="flex items-center justify-between max-w-md mx-auto">
          {navigationTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            const isHovered = hoveredTab === tab.id;
            
            return (
              <motion.div
                key={tab.id}
                className="relative flex-1"
                onMouseEnter={() => setHoveredTab(tab.id)}
                onMouseLeave={() => setHoveredTab(null)}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleTabClick(tab.id)}
                  className={cn(
                    "w-full h-12 flex flex-col items-center justify-center gap-1 p-1",
                    "hover:bg-white/10 transition-all duration-200",
                    "relative overflow-hidden rounded-xl"
                  )}
                >
                  {/* Active indicator */}
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-white/20 rounded-xl"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                  
                  {/* Hover indicator */}
                  {isHovered && !isActive && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="absolute inset-0 bg-white/5 rounded-xl"
                    />
                  )}
                  
                  <motion.div
                    animate={{
                      scale: isActive ? 1.1 : 1,
                      y: isActive ? -2 : 0
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    className="relative z-10"
                  >
                    <Icon 
                      className={cn(
                        "w-5 h-5 transition-colors duration-200",
                        isActive 
                          ? tab.activeColor 
                          : "text-white/60 hover:text-white/80"
                      )} 
                    />
                  </motion.div>
                  
                  <motion.span 
                    className={cn(
                      "text-xs font-medium transition-colors duration-200 relative z-10",
                      isActive 
                        ? "text-white" 
                        : "text-white/50"
                    )}
                    animate={{
                      opacity: isActive ? 1 : 0.7,
                      scale: isActive ? 1.05 : 1
                    }}
                    transition={{ type: "spring", stiffness: 300, damping: 25 }}
                  >
                    {tab.label}
                  </motion.span>
                </Button>
              </motion.div>
            );
          })}
          
          {/* Floating Action Button */}
          <motion.div
            className="absolute -top-6 left-1/2 transform -translate-x-1/2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              size="lg"
              onClick={() => setIsExpanded(!isExpanded)}
              className={cn(
                "w-12 h-12 rounded-full",
                "bg-gradient-to-r from-blue-500 to-purple-600",
                "hover:from-blue-600 hover:to-purple-700",
                "shadow-lg shadow-blue-500/25",
                "border-2 border-white/20",
                "transition-all duration-200"
              )}
            >
              <motion.div
                animate={{ rotate: isExpanded ? 45 : 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 25 }}
              >
                <Plus className="w-6 h-6 text-white" />
              </motion.div>
            </Button>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default BottomNavigation;