import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';
import taskService from '@/services/api/taskService';
import projectService from '@/services/api/projectService';

const QuickAddButton = ({ className = '', onTaskAdded }) => {
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [projects, setProjects] = useState([]);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    projectId: null
  });
const openModal = async () => {
    setShowModal(true);
    try {
      const [projectList, templateList] = await Promise.all([
        projectService.getAll(),
        taskService.getTemplates()
      ]);
      setProjects(projectList);
      setTemplates(templateList);
    } catch (error) {
      console.error('Failed to load projects and templates:', error);
    }
  };

const closeModal = () => {
    setShowModal(false);
    setSelectedTemplate('');
    setFormData({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      projectId: null
    });
  };

  const handleTemplateSelect = async (templateId) => {
    if (!templateId) {
      setSelectedTemplate('');
      setFormData({
        title: '',
        description: '',
        dueDate: '',
        priority: 'medium',
        projectId: null
      });
      return;
    }

    try {
      const template = await taskService.getTemplateById(parseInt(templateId, 10));
      setSelectedTemplate(templateId);
      setFormData({
        title: template.title,
        description: template.description,
        dueDate: template.dueDate || '',
        priority: template.priority,
        projectId: template.projectId
      });
    } catch (error) {
      console.error('Failed to load template:', error);
      toast.error('Failed to load template');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    setLoading(true);
    try {
      const newTask = await taskService.create({
        ...formData,
        dueDate: formData.dueDate ? new Date(formData.dueDate).toISOString() : null
      });
      
      toast.success('Task created! 🎉');
      closeModal();
      
      if (onTaskAdded) {
        onTaskAdded(newTask);
      }
    } catch (error) {
      toast.error('Failed to create task');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Button
        onClick={openModal}
        icon="Plus"
        className={className}
      >
        Add Task
      </Button>

      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40"
              onClick={closeModal}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
<div className="bg-white rounded-3xl shadow-xl max-w-md w-full p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-heading gradient-text">Add New Task</h2>
                  <button
                    onClick={closeModal}
                    className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
                  >
                    <ApperIcon name="X" size={20} className="text-gray-500" />
                  </button>
                </div>

<form onSubmit={handleSubmit} className="space-y-4">
                  {templates.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Use Template
                      </label>
                      <select
                        value={selectedTemplate}
                        onChange={(e) => handleTemplateSelect(e.target.value)}
                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white hover:border-gray-300 focus:ring-primary/20 focus:border-primary focus:outline-none focus:ring-4"
                      >
                        <option value="">Start from scratch</option>
                        {templates.map((template) => (
                          <option key={template.Id} value={template.Id}>
                            {template.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <Input
                    label="Task Title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="What needs to be done?"
                    required
                  />
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Description
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      placeholder="Add some details..."
                      rows={3}
                      className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white hover:border-gray-300 focus:ring-primary/20 focus:border-primary focus:outline-none focus:ring-4 placeholder:text-gray-400 resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Due Date
                      </label>
                      <input
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white hover:border-gray-300 focus:ring-primary/20 focus:border-primary focus:outline-none focus:ring-4"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Priority
                      </label>
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white hover:border-gray-300 focus:ring-primary/20 focus:border-primary focus:outline-none focus:ring-4"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                      </select>
                    </div>
                  </div>

                  {projects.length > 0 && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Project
                      </label>
                      <select
                        value={formData.projectId || ''}
                        onChange={(e) => setFormData({ ...formData, projectId: e.target.value ? parseInt(e.target.value, 10) : null })}
                        className="w-full px-4 py-3 rounded-2xl border border-gray-200 bg-white hover:border-gray-300 focus:ring-primary/20 focus:border-primary focus:outline-none focus:ring-4"
                      >
                        <option value="">No Project</option>
                        {projects.map((project) => (
                          <option key={project.Id} value={project.Id}>
                            {project.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}

                  <div className="flex space-x-3 pt-4">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={closeModal}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      loading={loading}
                      className="flex-1"
                    >
                      Create Task
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default QuickAddButton;