import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Filter, SortAsc, SortDesc, Calendar, Clock, Flag, CheckCircle, Circle, AlertCircle, X } from 'lucide-react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Separator } from '../ui/separator'
import { cn } from '../../lib/utils'

const TodoFilters = ({ 
  filters, 
  onFiltersChange, 
  totalCounts = {},
  className 
}) => {
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [isSortOpen, setIsSortOpen] = useState(false)

  const filterOptions = [
    {
      key: 'all',
      label: 'All Tasks',
      icon: Circle,
      count: totalCounts.all || 0,
      color: 'bg-gray-500/20 text-gray-700 dark:text-gray-300'
    },
    {
      key: 'active',
      label: 'Active',
      icon: AlertCircle,
      count: totalCounts.active || 0,
      color: 'bg-blue-500/20 text-blue-700 dark:text-blue-300'
    },
    {
      key: 'completed',
      label: 'Completed',
      icon: CheckCircle,
      count: totalCounts.completed || 0,
      color: 'bg-green-500/20 text-green-700 dark:text-green-300'
    },
    {
      key: 'high',
      label: 'High Priority',
      icon: Flag,
      count: totalCounts.high || 0,
      color: 'bg-red-500/20 text-red-700 dark:text-red-300'
    },
    {
      key: 'overdue',
      label: 'Overdue',
      icon: Clock,
      count: totalCounts.overdue || 0,
      color: 'bg-orange-500/20 text-orange-700 dark:text-orange-300'
    }
  ]

  const sortOptions = [
    {
      key: 'created_desc',
      label: 'Newest First',
      icon: SortDesc,
      description: 'Recently created tasks first'
    },
    {
      key: 'created_asc',
      label: 'Oldest First',
      icon: SortAsc,
      description: 'Oldest created tasks first'
    },
    {
      key: 'due_date_asc',
      label: 'Due Date',
      icon: Calendar,
      description: 'Earliest due date first'
    },
    {
      key: 'priority_desc',
      label: 'Priority',
      icon: Flag,
      description: 'High priority tasks first'
    },
    {
      key: 'alphabetical',
      label: 'A-Z',
      icon: SortAsc,
      description: 'Alphabetical order'
    }
  ]

  const handleFilterChange = (filterKey) => {
    onFiltersChange({
      ...filters,
      status: filterKey === 'all' ? '' : filterKey
    })
  }

  const handleSortChange = (sortKey) => {
    onFiltersChange({
      ...filters,
      sortBy: sortKey
    })
    setIsSortOpen(false)
  }

  const clearFilters = () => {
    onFiltersChange({
      status: '',
      sortBy: 'created_desc',
      search: ''
    })
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.status && filters.status !== 'all') count++
    if (filters.sortBy && filters.sortBy !== 'created_desc') count++
    if (filters.search) count++
    return count
  }

  const activeFiltersCount = getActiveFiltersCount()
  const currentSort = sortOptions.find(option => option.key === filters.sortBy) || sortOptions[0]

  return (
    <div className={cn("flex items-center gap-3 p-4 bg-white/10 backdrop-blur-md rounded-xl border border-white/20", className)}>
      {/* Filter Button */}
      <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm"
            className="relative h-9 px-3 bg-white/5 hover:bg-white/10 border border-white/20 text-gray-700 dark:text-gray-300"
          >
            <Filter className="w-4 h-4 mr-2" />
            Filter
            {activeFiltersCount > 0 && (
              <Badge 
                variant="secondary" 
                className="ml-2 h-5 w-5 p-0 flex items-center justify-center bg-blue-500 text-white text-xs"
              >
                {activeFiltersCount}
              </Badge>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-80 p-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-white/20" align="start">
          <div className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white">Filter Tasks</h3>
              {activeFiltersCount > 0 && (
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={clearFilters}
                  className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Clear all
                </Button>
              )}
            </div>
            
            <div className="space-y-2">
              {filterOptions.map((option) => {
                const Icon = option.icon
                const isActive = filters.status === option.key || (option.key === 'all' && !filters.status)
                
                return (
                  <motion.button
                    key={option.key}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleFilterChange(option.key)}
                    className={cn(
                      "w-full flex items-center justify-between p-3 rounded-lg transition-all duration-200",
                      isActive 
                        ? "bg-blue-500/20 border-2 border-blue-500/50" 
                        : "bg-gray-50/50 dark:bg-gray-800/50 hover:bg-gray-100/50 dark:hover:bg-gray-700/50 border-2 border-transparent"
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4" />
                      <span className="font-medium">{option.label}</span>
                    </div>
                    <Badge variant="secondary" className={cn("text-xs", option.color)}>
                      {option.count}
                    </Badge>
                  </motion.button>
                )
              })}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Sort Button */}
      <Popover open={isSortOpen} onOpenChange={setIsSortOpen}>
        <PopoverTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm"
            className="h-9 px-3 bg-white/5 hover:bg-white/10 border border-white/20 text-gray-700 dark:text-gray-300"
          >
            <currentSort.icon className="w-4 h-4 mr-2" />
            Sort
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-0 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-white/20" align="start">
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Sort Tasks</h3>
            
            <div className="space-y-1">
              {sortOptions.map((option) => {
                const Icon = option.icon
                const isActive = filters.sortBy === option.key
                
                return (
                  <motion.button
                    key={option.key}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => handleSortChange(option.key)}
                    className={cn(
                      "w-full flex items-start gap-3 p-3 rounded-lg text-left transition-all duration-200",
                      isActive 
                        ? "bg-blue-500/20 border border-blue-500/50" 
                        : "hover:bg-gray-100/50 dark:hover:bg-gray-800/50"
                    )}
                  >
                    <Icon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">{option.label}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{option.description}</div>
                    </div>
                  </motion.button>
                )
              })}
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Active Filters Display */}
      <AnimatePresence>
        {activeFiltersCount > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-2 ml-auto"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="h-7 px-2 text-xs bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400"
            >
              <X className="w-3 h-3 mr-1" />
              Clear
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default TodoFilters