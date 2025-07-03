import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, subDays, startOfWeek, endOfWeek } from 'date-fns';
import { toast } from 'react-toastify';
import Card from '@/components/atoms/Card';
import Badge from '@/components/atoms/Badge';
import EmptyState from '@/components/molecules/EmptyState';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import ApperIcon from '@/components/ApperIcon';
import taskService from '@/services/api/taskService';
import projectService from '@/services/api/projectService';

const Insights = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [allTasks, projectList] = await Promise.all([
        taskService.getAll(),
        projectService.getAll()
      ]);
      
      setTasks(allTasks);
      setProjects(projectList);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load insights');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse mb-8">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-2" />
            <div className="h-6 bg-gray-200 rounded w-1/3" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SkeletonLoader count={6} type="card" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <ErrorState message={error} onRetry={loadData} />
        </div>
      </div>
    );
  }

  // Calculate insights
  const completedTasks = tasks.filter(task => task.completed);
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks.length / totalTasks) * 100) : 0;

  // Priority breakdown
  const priorityStats = {
    high: tasks.filter(task => task.priority === 'high').length,
    medium: tasks.filter(task => task.priority === 'medium').length,
    low: tasks.filter(task => task.priority === 'low').length
  };

  // Project statistics
  const projectStats = projects.map(project => {
    const projectTasks = tasks.filter(task => task.projectId === project.Id);
    const completedProjectTasks = projectTasks.filter(task => task.completed);
    
    return {
      ...project,
      taskCount: projectTasks.length,
      completedCount: completedProjectTasks.length,
      completionRate: projectTasks.length > 0 ? Math.round((completedProjectTasks.length / projectTasks.length) * 100) : 0
    };
  }).sort((a, b) => b.taskCount - a.taskCount);

  // Weekly completion trend (last 7 days)
  const weeklyData = Array.from({ length: 7 }, (_, i) => {
    const date = subDays(new Date(), 6 - i);
    const dateStr = date.toISOString().split('T')[0];
    const dayTasks = completedTasks.filter(task => {
      if (!task.completedAt) return false;
      const taskDate = new Date(task.completedAt).toISOString().split('T')[0];
      return taskDate === dateStr;
    });
    
    return {
      day: format(date, 'EEE'),
      date: dateStr,
      completed: dayTasks.length,
      isToday: dateStr === new Date().toISOString().split('T')[0]
    };
  });

  const maxCompletions = Math.max(...weeklyData.map(d => d.completed), 1);
  const weekTotal = weeklyData.reduce((sum, day) => sum + day.completed, 0);
  const weekAverage = Math.round(weekTotal / 7 * 10) / 10;

  // Productivity insights
  const insights = [];

  if (completionRate >= 80) {
    insights.push({
      type: 'positive',
      icon: 'TrendingUp',
      title: 'Excellent Progress!',
      description: `You've completed ${completionRate}% of your tasks. Keep up the amazing work!`
    });
  } else if (completionRate >= 60) {
    insights.push({
      type: 'neutral',
      icon: 'Target',
      title: 'Good Momentum',
      description: `${completionRate}% completion rate. You're making steady progress!`
    });
  } else if (totalTasks > 0) {
    insights.push({
      type: 'suggestion',
      icon: 'Lightbulb',
      title: 'Room for Growth',
      description: `${completionRate}% completion rate. Consider breaking down larger tasks into smaller ones.`
    });
  }

  if (priorityStats.high > priorityStats.medium + priorityStats.low) {
    insights.push({
      type: 'suggestion',
      icon: 'AlertTriangle',
      title: 'High Priority Focus',
      description: 'You have many high-priority tasks. Consider balancing your workload.'
    });
  }

  if (weekAverage > 3) {
    insights.push({
      type: 'positive',
      icon: 'Zap',
      title: 'Productive Week!',
      description: `You've completed an average of ${weekAverage} tasks per day this week.`
    });
  }

  const bestProject = projectStats.find(p => p.completionRate === Math.max(...projectStats.map(p => p.completionRate)));

  if (bestProject && bestProject.completionRate > 75 && bestProject.taskCount > 2) {
    insights.push({
      type: 'positive',
      icon: 'Star',
title: 'Project Champion!',
      description: `${bestProject.Name || bestProject.name} is your top performer with ${bestProject.completionRate}% completion rate.`
    });
  }

  if (totalTasks === 0) {
    return (
      <div className="p-6 min-h-screen bg-background">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <h1 className="text-3xl font-heading gradient-text mb-2">Insights</h1>
            <p className="text-gray-600">Track your productivity and celebrate your progress</p>
          </motion.div>

          <EmptyState
            icon="BarChart3"
            title="No data to analyze yet"
            description="Create some tasks to start seeing your productivity insights and trends."
          />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-heading gradient-text mb-2">Insights</h1>
          <p className="text-gray-600">Track your productivity and celebrate your progress</p>
        </motion.div>

        {/* Overview Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Card>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
                  <ApperIcon name="CheckCircle" size={24} className="text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{completedTasks.length}</p>
                  <p className="text-sm text-gray-600">Tasks Completed</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-secondary/10 rounded-2xl flex items-center justify-center">
                  <ApperIcon name="Target" size={24} className="text-secondary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{completionRate}%</p>
                  <p className="text-sm text-gray-600">Completion Rate</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <Card>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-accent/20 rounded-2xl flex items-center justify-center">
                  <ApperIcon name="Calendar" size={24} className="text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{weekAverage}</p>
                  <p className="text-sm text-gray-600">Daily Average</p>
                </div>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <Card>
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-success/20 rounded-2xl flex items-center justify-center">
                  <ApperIcon name="FolderOpen" size={24} className="text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
                  <p className="text-sm text-gray-600">Active Projects</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Weekly Trend */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Weekly Completion Trend</h3>
              <div className="space-y-4">
                {weeklyData.map((day, index) => (
                  <div key={day.date} className="flex items-center space-x-4">
                    <div className="w-12 text-sm text-gray-600 font-medium">{day.day}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <motion.div
                            className={`h-2 rounded-full ${day.isToday ? 'bg-primary' : 'bg-secondary'}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${(day.completed / maxCompletions) * 100}%` }}
                            transition={{ duration: 0.8, delay: 0.6 + (index * 0.1) }}
                          />
                        </div>
                        <div className="w-8 text-sm text-gray-900 font-medium text-right">
                          {day.completed}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-gray-100 text-sm text-gray-600">
                Total this week: <span className="font-medium text-gray-900">{weekTotal} tasks</span>
              </div>
            </Card>
          </motion.div>

          {/* Priority Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Priority Distribution</h3>
              <div className="space-y-4">
                {Object.entries(priorityStats).map(([priority, count]) => {
                  const percentage = totalTasks > 0 ? Math.round((count / totalTasks) * 100) : 0;
                  const colors = {
                    high: 'bg-red-500',
                    medium: 'bg-yellow-500',
                    low: 'bg-green-500'
                  };
                  
                  return (
                    <div key={priority} className="flex items-center space-x-4">
                      <Badge variant={priority} className="w-16 justify-center">
                        {priority}
                      </Badge>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <div className="flex-1 bg-gray-200 rounded-full h-2">
                            <motion.div
                              className={`h-2 rounded-full ${colors[priority]}`}
                              initial={{ width: 0 }}
                              animate={{ width: `${percentage}%` }}
                              transition={{ duration: 0.8, delay: 0.7 }}
                            />
                          </div>
                          <div className="w-12 text-sm text-gray-900 font-medium text-right">
                            {count}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* Project Performance */}
        {projectStats.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mb-8"
          >
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-6">Project Performance</h3>
              <div className="space-y-4">
                {projectStats.slice(0, 5).map((project, index) => (
                  <div key={project.Id} className="flex items-center space-x-4">
                    <div 
                      className="w-10 h-10 rounded-2xl flex items-center justify-center text-white flex-shrink-0"
                      style={{ backgroundColor: project.color }}
                    >
                      <ApperIcon name={project.icon} size={18} />
                    </div>
                    <div className="flex-1 min-w-0">
<div className="flex items-center justify-between mb-2">
                        <h4 className="font-medium text-gray-900 truncate">{project.Name || project.name}</h4>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm text-gray-600">
                            {project.completedCount}/{project.taskCount}
                          </span>
                          <Badge variant={
                            project.completionRate >= 75 ? 'success' : 
                            project.completionRate >= 50 ? 'warning' : 'default'
                          } size="sm">
                            {project.completionRate}%
                          </Badge>
                        </div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          className="h-2 rounded-full"
                          style={{ backgroundColor: project.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${project.completionRate}%` }}
                          transition={{ duration: 1, delay: 0.8 + (index * 0.1) }}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </motion.div>
        )}

        {/* Insights */}
        {insights.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Productivity Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {insights.map((insight, index) => {
                const colors = {
                  positive: 'from-success/20 to-green-100 border-success/30',
                  neutral: 'from-secondary/20 to-blue-100 border-secondary/30',
                  suggestion: 'from-accent/20 to-yellow-100 border-accent/30'
                };

                const iconColors = {
                  positive: 'text-green-600',
                  neutral: 'text-secondary',
                  suggestion: 'text-yellow-600'
                };

                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 + (index * 0.1) }}
                    className={`bg-gradient-to-br ${colors[insight.type]} border rounded-2xl p-6`}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <ApperIcon 
                          name={insight.icon} 
                          size={24} 
                          className={iconColors[insight.type]} 
                        />
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900 mb-2">{insight.title}</h4>
                        <p className="text-sm text-gray-600">{insight.description}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Insights;