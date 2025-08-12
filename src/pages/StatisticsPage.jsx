import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import {
  BarChart3,
  TrendingUp,
  Target,
  Clock,
  CheckCircle,
  XCircle,
  Calendar,
  Award,
  Activity,
  Zap,
  Timer,
  Star
} from 'lucide-react';
import { useTodos } from '../hooks/useTodos';

const StatisticsPage = () => {
  const { todos } = useTodos();

  // Calculate statistics
  const totalTasks = todos.length;
  const completedTasks = todos.filter(todo => todo.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  const priorityStats = {
    high: todos.filter(todo => todo.priority === 'high').length,
    medium: todos.filter(todo => todo.priority === 'medium').length,
    low: todos.filter(todo => todo.priority === 'low').length
  };

  const categoryStats = todos.reduce((acc, todo) => {
    acc[todo.category] = (acc[todo.category] || 0) + 1;
    return acc;
  }, {});

  // Mock data for streaks and achievements
  const currentStreak = 7;
  const longestStreak = 15;
  const todayCompleted = 3;

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const StatCard = ({ title, value, icon: Icon, color, description }) => (
    <motion.div variants={itemVariants}>
      <Card className="bg-white/10 backdrop-blur-md border-white/20 hover:bg-white/15 transition-all duration-300">
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-white/70">{title}</p>
              <p className={`text-2xl font-bold ${color}`}>{value}</p>
              {description && (
                <p className="text-xs text-white/50 mt-1">{description}</p>
              )}
            </div>
            <div className={`p-3 rounded-full bg-gradient-to-r ${color.includes('emerald') ? 'from-emerald-500/20 to-green-500/20' : 
              color.includes('blue') ? 'from-blue-500/20 to-cyan-500/20' :
              color.includes('amber') ? 'from-amber-500/20 to-yellow-500/20' :
              'from-purple-500/20 to-pink-500/20'}`}>
              <Icon className={`h-6 w-6 ${color}`} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 p-4 pb-20">
      <motion.div
        className="max-w-4xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Header */}
        <motion.div variants={itemVariants} className="mb-6">
          <h1 className="text-3xl font-bold text-white mb-2">Statistics</h1>
          <p className="text-white/70">Track your productivity and progress</p>
        </motion.div>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-white/10 backdrop-blur-md border-white/20">
            <TabsTrigger value="overview" className="text-white data-[state=active]:bg-white/20">
              Overview
            </TabsTrigger>
            <TabsTrigger value="progress" className="text-white data-[state=active]:bg-white/20">
              Progress
            </TabsTrigger>
            <TabsTrigger value="achievements" className="text-white data-[state=active]:bg-white/20">
              Achievements
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6 mt-6">
            {/* Main Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard
                title="Total Tasks"
                value={totalTasks}
                icon={BarChart3}
                color="text-blue-400"
                description="All time"
              />
              <StatCard
                title="Completed"
                value={completedTasks}
                icon={CheckCircle}
                color="text-emerald-400"
                description="Tasks done"
              />
              <StatCard
                title="Pending"
                value={pendingTasks}
                icon={Clock}
                color="text-amber-400"
                description="Tasks left"
              />
              <StatCard
                title="Success Rate"
                value={`${completionRate}%`}
                icon={Target}
                color="text-purple-400"
                description="Completion"
              />
            </div>

            {/* Completion Progress */}
            <motion.div variants={itemVariants}>
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <TrendingUp className="h-5 w-5" />
                    Completion Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm text-white/70">
                      <span>Overall Progress</span>
                      <span>{completionRate}%</span>
                    </div>
                    <Progress value={completionRate} className="h-3 bg-white/10" />
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Priority & Category Stats */}
            <div className="grid md:grid-cols-2 gap-6">
              <motion.div variants={itemVariants}>
                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Priority Distribution</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Badge variant="destructive" className="bg-red-500/20 text-red-300">High</Badge>
                      <span className="text-white font-semibold">{priorityStats.high}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="bg-amber-500/20 text-amber-300">Medium</Badge>
                      <span className="text-white font-semibold">{priorityStats.medium}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="bg-green-500/20 text-green-300 border-green-500/30">Low</Badge>
                      <span className="text-white font-semibold">{priorityStats.low}</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div variants={itemVariants}>
                <Card className="bg-white/10 backdrop-blur-md border-white/20">
                  <CardHeader>
                    <CardTitle className="text-white">Categories</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {Object.entries(categoryStats).map(([category, count]) => (
                      <div key={category} className="flex items-center justify-between">
                        <span className="text-white/80 capitalize">{category}</span>
                        <span className="text-white font-semibold">{count}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </TabsContent>

          <TabsContent value="progress" className="space-y-6 mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <StatCard
                title="Current Streak"
                value={`${currentStreak} days`}
                icon={Zap}
                color="text-emerald-400"
                description="Keep it up!"
              />
              <StatCard
                title="Today's Tasks"
                value={todayCompleted}
                icon={Calendar}
                color="text-blue-400"
                description="Completed today"
              />
            </div>

            <motion.div variants={itemVariants}>
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Activity className="h-5 w-5" />
                    Weekly Progress
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-7 gap-2">
                    {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => (
                      <div key={day} className="text-center">
                        <div className="text-xs text-white/60 mb-2">{day}</div>
                        <div className={`h-12 rounded-lg flex items-center justify-center text-sm font-semibold ${
                          index < 5 ? 'bg-emerald-500/30 text-emerald-300' : 'bg-white/10 text-white/40'
                        }`}>
                          {index < 5 ? Math.floor(Math.random() * 8) + 1 : 0}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6 mt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <StatCard
                title="Longest Streak"
                value={`${longestStreak} days`}
                icon={Award}
                color="text-amber-400"
                description="Personal best"
              />
              <StatCard
                title="Total Points"
                value="1,247"
                icon={Star}
                color="text-purple-400"
                description="Productivity score"
              />
            </div>

            <motion.div variants={itemVariants}>
              <Card className="bg-white/10 backdrop-blur-md border-white/20">
                <CardHeader>
                  <CardTitle className="text-white">Recent Achievements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                    <div className="p-2 bg-emerald-500/20 rounded-full">
                      <CheckCircle className="h-5 w-5 text-emerald-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Week Warrior</p>
                      <p className="text-white/60 text-sm">Complete 7 days in a row</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-lg">
                    <div className="p-2 bg-blue-500/20 rounded-full">
                      <Target className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <p className="text-white font-medium">Task Master</p>
                      <p className="text-white/60 text-sm">Complete 100 tasks</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>
        </Tabs>
      </motion.div>
    </div>
  );
};

export default StatisticsPage;