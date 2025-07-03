import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import TaskCard from '@/components/molecules/TaskCard';
import EmptyState from '@/components/molecules/EmptyState';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import QuickAddButton from '@/components/organisms/QuickAddButton';
import ApperIcon from '@/components/ApperIcon';
import taskService from '@/services/api/taskService';
import projectService from '@/services/api/projectService';
import achievementService from '@/services/api/achievementService';

const Today = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [recentAchievements, setRecentAchievements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [todaysTasks, projectList, achievements] = await Promise.all([
        taskService.getTodaysTasks(),
        projectService.getAll(),
        achievementService.getRecent(3)
      ]);
      
      setTasks(todaysTasks);
      setProjects(projectList);
      setRecentAchievements(achievements);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load today\'s tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTaskUpdate = (updatedTask) => {
    setTasks(tasks.map(task => 
      task.Id === updatedTask.Id ? updatedTask : task
    ));
  };

  const handleTaskDelete = (taskId) => {
    setTasks(tasks.filter(task => task.Id !== taskId));
  };

  const handleTaskAdded = (newTask) => {
    // Only add to today's view if it's due today
    const today = new Date().toISOString().split('T')[0];
    const taskDate = newTask.dueDate ? new Date(newTask.dueDate).toISOString().split('T')[0] : null;
    
    if (taskDate === today) {
      setTasks([...tasks, newTask]);
    }
  };

  const getProjectById = (projectId) => {
    return projects.find(p => p.Id === projectId);
  };

  const completedTasks = tasks.filter(task => task.completed);
  const incompleteTasks = tasks.filter(task => !task.completed);
  const completionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse mb-8">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-2" />
            <div className="h-6 bg-gray-200 rounded w-1/4" />
          </div>
          <SkeletonLoader count={3} />
        </div>
      </div>
    );
const getProjectById = (projectId) => {
    return projects.find(p => p.Id === projectId);
  };
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <ErrorState message={error} onRetry={loadData} />
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 min-h-screen bg-background">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-heading gradient-text mb-2">
                {getGreeting()}! 👋
              </h1>
              <p className="text-gray-600">
                {format(new Date(), 'EEEE, MMMM d, yyyy')}
              </p>
            </div>
            
            <div className="hidden md:block">
              <QuickAddButton onTaskAdded={handleTaskAdded} />
            </div>
          </div>

          {/* Stats */}
          {tasks.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              <div className="bg-white rounded-2xl p-4 shadow-soft border border-pink-50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <ApperIcon name="Calendar" size={20} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
                    <p className="text-sm text-gray-600">Today's Tasks</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 shadow-soft border border-pink-50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-success/20 rounded-xl flex items-center justify-center">
                    <ApperIcon name="CheckCircle" size={20} className="text-green-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{completedTasks.length}</p>
                    <p className="text-sm text-gray-600">Completed</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 shadow-soft border border-pink-50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-secondary/10 rounded-xl flex items-center justify-center">
                    <ApperIcon name="Clock" size={20} className="text-secondary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{incompleteTasks.length}</p>
                    <p className="text-sm text-gray-600">Remaining</p>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-4 shadow-soft border border-pink-50">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center">
                    <ApperIcon name="TrendingUp" size={20} className="text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{completionRate}%</p>
                    <p className="text-sm text-gray-600">Progress</p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Tasks */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Today's Tasks</h2>
              {tasks.length > 0 && (
                <div className="text-sm text-gray-500">
                  {completedTasks.length} of {tasks.length} completed
                </div>
              )}
            </div>

            {incompleteTasks.length === 0 && completedTasks.length === 0 ? (
              <EmptyState
                icon="Calendar"
                title="No tasks for today"
                description="You're all caught up! Add a new task to get started."
                actionLabel="Add Task"
                onAction={() => {}} // QuickAddButton handles this
              />
            ) : (
              <div className="space-y-4">
                {/* Incomplete Tasks */}
                {incompleteTasks.map((task, index) => (
                  <motion.div
                    key={task.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
<TaskCard
                      task={task}
                      project={getProjectById(task.projectId)}
                      onUpdate={handleTaskUpdate}
                      onDelete={handleTaskDelete}
                    />
                  </motion.div>
                ))}

                {/* Completed Tasks */}
                {completedTasks.length > 0 && (
                  <div className="mt-8">
                    <h3 className="text-lg font-medium text-gray-700 mb-4 flex items-center">
                      <ApperIcon name="CheckCircle" size={20} className="text-success mr-2" />
                      Completed ({completedTasks.length})
                    </h3>
                    <div className="space-y-4">
                      {completedTasks.map((task, index) => (
                        <motion.div
                          key={task.Id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                        >
<TaskCard
                            task={task}
                            project={getProjectById(task.projectId)}
                            onUpdate={handleTaskUpdate}
                            onDelete={handleTaskDelete}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Achievements */}
            {recentAchievements.length > 0 && (
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl p-6 shadow-soft border border-pink-50"
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                  <ApperIcon name="Award" size={20} className="text-accent mr-2" />
                  Recent Achievements
                </h3>
                <div className="space-y-3">
                  {recentAchievements.map((achievement) => (
                    <div key={achievement.Id} className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0">
                        <ApperIcon name="Star" size={16} className="text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-700">{achievement.message}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {format(new Date(achievement.earnedAt), 'MMM d, h:mm a')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-gradient-to-br from-primary/10 to-secondary/10 rounded-2xl p-6 border border-primary/20"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Keep Going!</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Today's Progress</span>
                  <span className="text-sm font-medium">{completionRate}%</span>
                </div>
                <div className="w-full bg-white rounded-full h-2">
                  <motion.div
                    className="h-2 bg-gradient-to-r from-primary to-secondary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${completionRate}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
                <p className="text-sm text-gray-600">
                  {incompleteTasks.length === 0 && tasks.length > 0
                    ? "Amazing! You've completed all your tasks for today! 🎉"
                    : incompleteTasks.length === 1
                    ? "Just 1 more task to go! You're almost there! 💪"
                    : incompleteTasks.length > 0
                    ? `${incompleteTasks.length} tasks remaining. You've got this! ⭐`
                    : "Ready to tackle some tasks? Add one to get started! 🚀"
                  }
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Today;