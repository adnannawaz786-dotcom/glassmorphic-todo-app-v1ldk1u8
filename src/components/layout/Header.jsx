import React from 'react';
import { motion } from 'framer-motion';
import { Settings, Calendar, Bell, Search, Filter } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '../ui/dropdown-menu';
import { Input } from '../ui/input';
import { cn } from '../../lib/utils';

const Header = ({
  title = "Todo App",
  subtitle,
  showSearch = false,
  searchValue = "",
  onSearchChange,
  onSettingsClick,
  onFilterClick,
  activeFilter = "all",
  taskCounts = { total: 0, pending: 0, completed: 0 },
  className
}) => {
  const [isSearchFocused, setIsSearchFocused] = React.useState(false);
  const [showNotifications, setShowNotifications] = React.useState(false);

  const headerVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const searchVariants = {
    collapsed: { width: "0px", opacity: 0 },
    expanded: { 
      width: "100%", 
      opacity: 1,
      transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
    }
  };

  const getCurrentDate = () => {
    return new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getFilterBadgeColor = (filter) => {
    switch (filter) {
      case 'pending':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'completed':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      case 'priority':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      default:
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    }
  };

  return (
    <motion.header
      variants={headerVariants}
      initial="hidden"
      animate="visible"
      className={cn(
        "relative z-50 w-full px-4 py-6 sm:px-6 lg:px-8",
        "bg-white/10 backdrop-blur-xl border-b border-white/20",
        "supports-[backdrop-filter]:bg-white/5",
        className
      )}
    >
      <div className="max-w-7xl mx-auto">
        {/* Main Header Row */}
        <div className="flex items-center justify-between mb-4">
          {/* Title Section */}
          <motion.div variants={itemVariants} className="flex-1 min-w-0">
            <div className="flex items-center space-x-3">
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex-shrink-0"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
              </motion.div>
              
              <div className="min-w-0 flex-1">
                <h1 className="text-2xl sm:text-3xl font-bold text-white truncate">
                  {title}
                </h1>
                {subtitle && (
                  <p className="text-sm text-white/70 truncate mt-1">
                    {subtitle}
                  </p>
                )}
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <motion.div variants={itemVariants} className="flex items-center space-x-2">
            {/* Notifications */}
            <DropdownMenu open={showNotifications} onOpenChange={setShowNotifications}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white"
                >
                  <Bell className="w-4 h-4" />
                  {taskCounts.pending > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500 text-white border-0">
                      {taskCounts.pending > 9 ? '9+' : taskCounts.pending}
                    </Badge>
                  )}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="w-80 bg-white/10 backdrop-blur-xl border-white/20 text-white"
              >
                <div className="p-4">
                  <h3 className="font-semibold mb-2">Notifications</h3>
                  <div className="space-y-2">
                    <div className="text-sm text-white/70">
                      {taskCounts.pending > 0 
                        ? `You have ${taskCounts.pending} pending task${taskCounts.pending > 1 ? 's' : ''}`
                        : 'All caught up! No pending tasks.'
                      }
                    </div>
                  </div>
                </div>
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Settings Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onSettingsClick}
              className="h-10 w-10 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white"
            >
              <motion.div
                whileHover={{ rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                <Settings className="w-4 h-4" />
              </motion.div>
            </Button>
          </motion.div>
        </div>

        {/* Date and Stats Row */}
        <motion.div variants={itemVariants} className="flex items-center justify-between mb-4">
          <div className="text-sm text-white/70">
            {getCurrentDate()}
          </div>
          
          <div className="flex items-center space-x-2">
            <Badge className="bg-white/10 text-white border-white/20">
              Total: {taskCounts.total}
            </Badge>
            <Badge className={cn("border", getFilterBadgeColor(activeFilter))}>
              {activeFilter.charAt(0).toUpperCase() + activeFilter.slice(1)}
            </Badge>
          </div>
        </motion.div>

        {/* Search and Filter Row */}
        {showSearch && (
          <motion.div
            variants={itemVariants}
            className="flex items-center space-x-3"
          >
            <motion.div
              variants={searchVariants}
              animate={isSearchFocused ? "expanded" : "collapsed"}
              className="relative flex-1"
            >
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/50" />
              <Input
                type="text"
                placeholder="Search tasks..."
                value={searchValue}
                onChange={onSearchChange}
                onFocus={() => setIsSearchFocused(true)}
                onBlur={() => setIsSearchFocused(false)}
                className="pl-10 bg-white/10 border-white/20 text-white placeholder-white/50 focus:bg-white/15 focus:border-white/40"
              />
            </motion.div>

            <Button
              variant="ghost"
              size="sm"
              onClick={onFilterClick}
              className="h-10 px-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white"
            >
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
};

export default Header;