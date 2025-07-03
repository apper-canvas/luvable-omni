import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth } from 'date-fns';
import { toast } from 'react-toastify';
import TaskCard from '@/components/molecules/TaskCard';
import EmptyState from '@/components/molecules/EmptyState';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import SearchBar from '@/components/molecules/SearchBar';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import taskService from '@/services/api/taskService';
import projectService from '@/services/api/projectService';
import achievementService from '@/services/api/achievementService';

const Archive = () => {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFilter, setDateFilter] = useState('all');
  const [showAchievements, setShowAchievements] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const [completedTasks, projectList, achievementList] = await Promise.all([
        taskService.getCompletedTasks(),
        projectService.getAll(),
        achievementService.getAll()
      ]);
      
      setTasks(completedTasks);
      setFilteredTasks(completedTasks);
      setProjects(projectList);
      setAchievements(achievementList);
    } catch (err) {
      setError(err.message || 'Failed to load data');
      toast.error('Failed to load archived tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterTasks();
  }, [tasks, searchQuery, dateFilter]);

  const filterTasks = () => {
    let filtered = [...tasks];

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Date filter
    if (dateFilter !== 'all') {
      const now = new Date();
      
      filtered = filtered.filter(task => {
        if (!task.completedAt) return false;
        
        const completedDate = new Date(task.completedAt);
        
        switch (dateFilter) {
          case 'today':
            return completedDate.toDateString() === now.toDateString();
          case 'week':
            return completedDate >= startOfWeek(now) && completedDate <= endOfWeek(now);
          case 'month':
            return completedDate >= startOfMonth(now) && completedDate <= endOfMonth(now);
          default:
            return true;
        }
      });
    }

    setFilteredTasks(filtered);
  };

  const getProjectById = (projectId) => {
    return projects.find(p => p.Id === projectId);
  };

  const handleTaskUpdate = (updatedTask) => {
    setTasks(tasks.map(task => 
      task.Id === updatedTask.Id ? updatedTask : task
    ));
  };

  const handleTaskDelete = (taskId) => {
    setTasks(tasks.filter(task => task.Id !== taskId));
  };

  const groupTasksByDate = (tasks) => {
    const grouped = {};
    
    tasks.forEach(task => {
      if (!task.completedAt) return;
      
      const date = format(new Date(task.completedAt), 'yyyy-MM-dd');
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(task);
    });

    return Object.entries(grouped)
      .sort(([a], [b]) => new Date(b).getTime() - new Date(a).getTime())
      .map(([date, tasks]) => ({
        date,
        formattedDate: format(new Date(date), 'EEEE, MMMM d, yyyy'),
        tasks: tasks.sort((a, b) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime())
      }));
  };

  const groupedTasks = groupTasksByDate(filteredTasks);

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse mb-8">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-2" />
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-6" />
            <div className="h-10 bg-gray-200 rounded w-full" />
          </div>
          <SkeletonLoader count={3} />
        </div>
      </div>
    );
  }

  if (error) {
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
              <h1 className="text-3xl font-heading gradient-text mb-2">Archive</h1>
              <p className="text-gray-600">Celebrate your completed tasks and achievements</p>
            </div>
            
            <Button
              variant={showAchievements ? 'primary' : 'secondary'}
              icon="Award"
              onClick={() => setShowAchievements(!showAchievements)}
            >
              {showAchievements ? 'Show Tasks' : 'Show Achievements'}
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-2xl p-4 shadow-soft border border-pink-50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-success/20 rounded-xl flex items-center justify-center">
                  <ApperIcon name="CheckCircle" size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{tasks.length}</p>
                  <p className="text-sm text-gray-600">Tasks Completed</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-soft border border-pink-50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-accent/20 rounded-xl flex items-center justify-center">
                  <ApperIcon name="Award" size={20} className="text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{achievements.length}</p>
                  <p className="text-sm text-gray-600">Achievements</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-4 shadow-soft border border-pink-50">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                  <ApperIcon name="Zap" size={20} className="text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">
                    {Math.max(...groupedTasks.map(group => group.tasks.length), 0)}
                  </p>
                  <p className="text-sm text-gray-600">Best Day</p>
                </div>
              </div>
            </div>
          </div>

          {/* Filters */}
          {!showAchievements && (
            <div className="flex flex-col md:flex-row gap-4 mb-6">
              <div className="flex-1">
                <SearchBar
                  onSearch={setSearchQuery}
                  placeholder="Search completed tasks..."
                />
              </div>
              
              <div className="flex space-x-2">
                {[
                  { key: 'all', label: 'All Time' },
                  { key: 'today', label: 'Today' },
                  { key: 'week', label: 'This Week' },
                  { key: 'month', label: 'This Month' }
                ].map((filter) => (
                  <button
                    key={filter.key}
                    onClick={() => setDateFilter(filter.key)}
                    className={`px-4 py-2 rounded-2xl text-sm font-medium transition-all ${
                      dateFilter === filter.key
                        ? 'bg-primary text-white'
                        : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Content */}
        {showAchievements ? (
          /* Achievements View */
          <div>
            {achievements.length === 0 ? (
              <EmptyState
                icon="Award"
                title="No achievements yet"
                description="Complete some tasks to start earning achievements!"
              />
            ) : (
              <div className="space-y-4">
                {achievements.map((achievement, index) => (
                  <motion.div
                    key={achievement.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl p-6 shadow-soft border border-pink-50"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center flex-shrink-0">
                        <ApperIcon name="Star" size={24} className="text-white" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
<Badge variant="primary" size="sm">{achievement.type?.replace('_', ' ') || ''}</Badge>
                          <span className="text-sm text-gray-500">
                            {format(new Date(achievement.earnedAt), 'MMM d, yyyy h:mm a')}
                          </span>
                        </div>
                        <p className="text-lg text-gray-900">{achievement.message}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        ) : (
          /* Tasks View */
          <div>
            {filteredTasks.length === 0 ? (
              <EmptyState
                icon="Archive"
                title={searchQuery || dateFilter !== 'all' ? 'No matching tasks' : 'No completed tasks'}
                description={
                  searchQuery || dateFilter !== 'all' 
                    ? 'Try adjusting your search or filters.' 
                    : 'Complete some tasks to see them here!'
                }
              />
            ) : (
              <div className="space-y-8">
                {groupedTasks.map((group, groupIndex) => (
                  <motion.div
                    key={group.date}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: groupIndex * 0.1 }}
                  >
                    <div className="flex items-center space-x-3 mb-4">
                      <h2 className="text-lg font-semibold text-gray-900">
                        {group.formattedDate}
                      </h2>
                      <Badge variant="success" size="sm">
                        {group.tasks.length} {group.tasks.length === 1 ? 'task' : 'tasks'}
                      </Badge>
                    </div>
                    
                    <div className="space-y-4">
                      {group.tasks.map((task, index) => (
                        <motion.div
                          key={task.Id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: (groupIndex * 0.1) + (index * 0.05) }}
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
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Archive;