import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import ProjectCard from '@/components/molecules/ProjectCard';
import TaskCard from '@/components/molecules/TaskCard';
import EmptyState from '@/components/molecules/EmptyState';
import SkeletonLoader from '@/components/molecules/SkeletonLoader';
import ErrorState from '@/components/molecules/ErrorState';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';
import projectService from '@/services/api/projectService';
import taskService from '@/services/api/taskService';

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [projectTasks, setProjectTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tasksLoading, setTasksLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    color: '#FF6B6B',
    icon: 'Folder'
  });

  const colorOptions = [
    '#FF6B6B', '#4ECDC4', '#FFE66D', '#95E1D3', 
    '#F3A683', '#A8E6CF', '#FFB3E6', '#C7CEEA'
  ];

  const iconOptions = [
    'Folder', 'Briefcase', 'BookOpen', 'Heart', 'Star',
    'Target', 'Zap', 'Coffee', 'Home', 'Car'
  ];

  const loadProjects = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const projectList = await projectService.getAll();
      setProjects(projectList);
    } catch (err) {
      setError(err.message || 'Failed to load projects');
      toast.error('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  const loadProjectTasks = async (projectId) => {
    setTasksLoading(true);
    
    try {
      const tasks = await taskService.getByProject(projectId);
      setProjectTasks(tasks);
    } catch (err) {
      toast.error('Failed to load project tasks');
    } finally {
      setTasksLoading(false);
    }
  };

  useEffect(() => {
    loadProjects();
  }, []);

  useEffect(() => {
    if (selectedProject) {
      loadProjectTasks(selectedProject.Id);
    }
  }, [selectedProject]);

  const handleProjectSelect = (project) => {
    setSelectedProject(project);
  };

  const handleBackToProjects = () => {
    setSelectedProject(null);
    setProjectTasks([]);
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    if (!newProject.name.trim()) return;

    setCreateLoading(true);
    try {
      const created = await projectService.create(newProject);
      setProjects([...projects, created]);
      setShowCreateModal(false);
      setNewProject({ name: '', color: '#FF6B6B', icon: 'Folder' });
      toast.success('Project created! 🎉');
    } catch (error) {
      toast.error('Failed to create project');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleTaskUpdate = (updatedTask) => {
    setProjectTasks(projectTasks.map(task => 
      task.Id === updatedTask.Id ? updatedTask : task
    ));
  };

  const handleTaskDelete = (taskId) => {
    setProjectTasks(projectTasks.filter(task => task.Id !== taskId));
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <div className="animate-pulse mb-8">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-2" />
            <div className="h-6 bg-gray-200 rounded w-1/3" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <SkeletonLoader count={6} type="project" />
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          <ErrorState message={error} onRetry={loadProjects} />
        </div>
      </div>
    );
  }

  // Project Detail View
  if (selectedProject) {
    const completedTasks = projectTasks.filter(task => task.completed);
    const incompleteTasks = projectTasks.filter(task => !task.completed);
    const progress = projectTasks.length > 0 ? (completedTasks.length / projectTasks.length) * 100 : 0;

    return (
      <div className="p-6 min-h-screen bg-background">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex items-center space-x-4 mb-6">
              <Button
                variant="ghost"
                icon="ArrowLeft"
                onClick={handleBackToProjects}
              >
                Back to Projects
              </Button>
            </div>

            <div className="flex items-center space-x-4 mb-6">
              <div 
                className="w-16 h-16 rounded-3xl flex items-center justify-center text-white"
                style={{ backgroundColor: selectedProject.color }}
              >
                <ApperIcon name={selectedProject.icon} size={28} />
              </div>
              <div>
                <h1 className="text-3xl font-heading text-gray-900 mb-2">
                  {selectedProject.name}
                </h1>
                <p className="text-gray-600">
                  {completedTasks.length} of {projectTasks.length} tasks completed
                </p>
              </div>
            </div>

            {/* Progress Bar */}
            {projectTasks.length > 0 && (
              <div className="bg-white rounded-2xl p-6 shadow-soft border border-pink-50">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-medium text-gray-900">Progress</h3>
                  <span className="text-2xl font-bold" style={{ color: selectedProject.color }}>
                    {Math.round(progress)}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3">
                  <motion.div
                    className="h-3 rounded-full"
                    style={{ backgroundColor: selectedProject.color }}
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                  />
                </div>
              </div>
            )}
          </motion.div>

          {/* Tasks */}
          <div>
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Tasks</h2>
            
            {tasksLoading ? (
              <SkeletonLoader count={3} />
            ) : projectTasks.length === 0 ? (
              <EmptyState
                icon="CheckSquare"
                title="No tasks in this project"
                description="Get started by adding your first task to this project."
                actionLabel="Add Task"
                onAction={() => {}} // Would trigger task creation
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
                      project={selectedProject}
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
                            project={selectedProject}
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
        </div>
      </div>
    );
  }

  // Projects Overview
  return (
    <div className="p-6 min-h-screen bg-background">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-8"
        >
          <div>
            <h1 className="text-3xl font-heading gradient-text mb-2">Projects</h1>
            <p className="text-gray-600">Organize your tasks into meaningful projects</p>
          </div>
          
          <Button
            onClick={() => setShowCreateModal(true)}
            icon="Plus"
          >
            New Project
          </Button>
        </motion.div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <EmptyState
            icon="FolderPlus"
            title="No projects yet"
            description="Create your first project to organize your tasks better."
            actionLabel="Create Project"
            onAction={() => setShowCreateModal(true)}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project.Id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <ProjectCard
                  project={project}
                  onClick={() => handleProjectSelect(project)}
                />
              </motion.div>
            ))}
          </div>
        )}

        {/* Create Project Modal */}
        {showCreateModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={() => setShowCreateModal(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-white rounded-3xl shadow-xl max-w-md w-full p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-heading gradient-text">Create Project</h2>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <ApperIcon name="X" size={20} className="text-gray-500" />
                  </button>
                </div>

                <form onSubmit={handleCreateProject} className="space-y-6">
                  <Input
                    label="Project Name"
                    value={newProject.name}
                    onChange={(e) => setNewProject({ ...newProject, name: e.target.value })}
                    placeholder="Enter project name"
                    required
                  />

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Color
                    </label>
                    <div className="flex flex-wrap gap-3">
                      {colorOptions.map((color) => (
                        <button
                          key={color}
                          type="button"
                          onClick={() => setNewProject({ ...newProject, color })}
                          className={`w-8 h-8 rounded-full transition-transform ${
                            newProject.color === color ? 'scale-125 ring-2 ring-offset-2 ring-gray-400' : 'hover:scale-110'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-3">
                      Icon
                    </label>
                    <div className="grid grid-cols-5 gap-3">
                      {iconOptions.map((icon) => (
                        <button
                          key={icon}
                          type="button"
                          onClick={() => setNewProject({ ...newProject, icon })}
                          className={`w-12 h-12 rounded-xl border-2 flex items-center justify-center transition-all ${
                            newProject.icon === icon 
                              ? 'border-primary bg-primary/10' 
                              : 'border-gray-200 hover:border-gray-300'
                          }`}
                        >
                          <ApperIcon name={icon} size={20} className={
                            newProject.icon === icon ? 'text-primary' : 'text-gray-600'
                          } />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex space-x-3 pt-4">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => setShowCreateModal(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      loading={createLoading}
                      className="flex-1"
                    >
                      Create Project
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </div>
    </div>
  );
};

export default Projects;