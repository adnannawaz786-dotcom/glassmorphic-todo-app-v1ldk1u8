import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Clock, Target, TrendingUp, Calendar } from 'lucide-react';
import { Card } from '../ui/card';
import { Progress } from '../ui/progress';

const TodoStats = ({ todos = [] }) => {
  const stats = useMemo(() => {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const pending = total - completed;
    const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
    
    // Priority breakdown
    const highPriority = todos.filter(todo => todo.priority === 'high' && !todo.completed).length;
    const mediumPriority = todos.filter(todo => todo.priority === 'medium' && !todo.completed).length;
    const lowPriority = todos.filter(todo => todo.priority === 'low' && !todo.completed).length;
    
    // Due today
    const today = new Date().toDateString();
    const dueToday = todos.filter(todo => 
      todo.dueDate && new Date(todo.dueDate).toDateString() === today && !todo.completed
    ).length;
    
    // Overdue
    const overdue = todos.filter(todo => 
      todo.dueDate && new Date(todo.dueDate) < new Date() && !todo.completed
    ).length;

    return {
      total,
      completed,
      pending,
      completionRate,
      highPriority,
      mediumPriority,
      lowPriority,
      dueToday,
      overdue
    };
  }, [todos]);

  const StatCard = ({ icon: Icon, label, value, color = "text-blue-400", bgColor = "bg-blue-500/10" }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="relative"
    >
      <Card className="p-4 bg-white/10 backdrop-blur-xl border-white/20 hover:bg-white/15 transition-all duration-300">
        <div className="flex items-center space-x-3">
          <div className={`p-2 rounded-lg ${bgColor} backdrop-blur-sm`}>
            <Icon className={`w-5 h-5 ${color}`} />
          </div>
          <div>
            <p className="text-2xl font-bold text-white">{value}</p>
            <p className="text-sm text-white/70">{label}</p>
          </div>
        </div>
      </Card>
    </motion.div>
  );

  const PriorityBar = ({ label, count, color, maxCount }) => {
    const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
    
    return (
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-white/70">{label}</span>
          <span className="text-sm font-medium text-white">{count}</span>
        </div>
        <div className="w-full bg-white/10 rounded-full h-2 backdrop-blur-sm">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className={`h-2 rounded-full ${color}`}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <StatCard
          icon={Target}
          label="Total Tasks"
          value={stats.total}
          color="text-blue-400"
          bgColor="bg-blue-500/10"
        />
        <StatCard
          icon={CheckCircle2}
          label="Completed"
          value={stats.completed}
          color="text-green-400"
          bgColor="bg-green-500/10"
        />
        <StatCard
          icon={Circle}
          label="Pending"
          value={stats.pending}
          color="text-orange-400"
          bgColor="bg-orange-500/10"
        />
        <StatCard
          icon={Calendar}
          label="Due Today"
          value={stats.dueToday}
          color="text-purple-400"
          bgColor="bg-purple-500/10"
        />
      </div>

      {/* Progress Overview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Card className="p-6 bg-white/10 backdrop-blur-xl border-white/20">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              Progress Overview
            </h3>
            <span className="text-2xl font-bold text-green-400">{stats.completionRate}%</span>
          </div>
          
          <div className="space-y-2">
            <Progress 
              value={stats.completionRate} 
              className="h-3 bg-white/10"
            />
            <p className="text-sm text-white/70 text-center">
              {stats.completed} of {stats.total} tasks completed
            </p>
          </div>
        </Card>
      </motion.div>

      {/* Priority Breakdown */}
      {stats.pending > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="p-6 bg-white/10 backdrop-blur-xl border-white/20">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-400" />
              Pending by Priority
            </h3>
            
            <div className="space-y-4">
              <PriorityBar
                label="High Priority"
                count={stats.highPriority}
                color="bg-gradient-to-r from-red-500 to-red-400"
                maxCount={stats.pending}
              />
              <PriorityBar
                label="Medium Priority"
                count={stats.mediumPriority}
                color="bg-gradient-to-r from-yellow-500 to-yellow-400"
                maxCount={stats.pending}
              />
              <PriorityBar
                label="Low Priority"
                count={stats.lowPriority}
                color="bg-gradient-to-r from-green-500 to-green-400"
                maxCount={stats.pending}
              />
            </div>
          </Card>
        </motion.div>
      )}

      {/* Overdue Alert */}
      {stats.overdue > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4 }}
          className="relative"
        >
          <Card className="p-4 bg-gradient-to-r from-red-500/20 to-red-600/20 backdrop-blur-xl border-red-500/30">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-red-500/20 backdrop-blur-sm">
                <Clock className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <p className="text-lg font-semibold text-red-400">
                  {stats.overdue} Overdue Task{stats.overdue !== 1 ? 's' : ''}
                </p>
                <p className="text-sm text-red-300">Requires immediate attention</p>
              </div>
            </div>
          </Card>
        </motion.div>
      )}
    </div>
  );
};

export default TodoStats;