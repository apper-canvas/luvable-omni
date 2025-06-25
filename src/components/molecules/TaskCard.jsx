import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, isToday, isPast } from 'date-fns';
import { toast } from 'react-toastify';
import Card from '@/components/atoms/Card';
import Checkbox from '@/components/atoms/Checkbox';
import Badge from '@/components/atoms/Badge';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import taskService from '@/services/api/taskService';
import CelebrationOverlay from '@/components/organisms/CelebrationOverlay';

const TaskCard = ({ task, onUpdate, onDelete, project }) => {
  const [loading, setLoading] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [showActions, setShowActions] = useState(false);

  const handleComplete = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      const updatedTask = await taskService.complete(task.Id);
      onUpdate(updatedTask);
      setShowCelebration(true);
      toast.success('Task completed! Great job! 🎉');
    } catch (error) {
      toast.error('Failed to complete task');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (loading) return;
    
    if (!window.confirm('Are you sure you want to delete this task?')) {
      return;
    }
    
    setLoading(true);
    try {
      await taskService.delete(task.Id);
      onDelete(task.Id);
      toast.success('Task deleted');
    } catch (error) {
      toast.error('Failed to delete task');
    } finally {
      setLoading(false);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'high';
      case 'medium': return 'medium';
      case 'low': return 'low';
      default: return 'default';
    }
  };

  const getDueDateInfo = (dueDate) => {
    if (!dueDate) return null;
    
    const date = new Date(dueDate);
    const isOverdue = isPast(date) && !isToday(date);
    const isDueToday = isToday(date);
    
    return {
      formatted: format(date, 'MMM d'),
      isOverdue,
      isDueToday,
      className: isOverdue ? 'text-error' : isDueToday ? 'text-warning' : 'text-gray-500'
    };
  };

  const dueDateInfo = getDueDateInfo(task.dueDate);

  return (
    <>
      <Card 
        className={`relative group ${task.completed ? 'opacity-75' : ''}`}
        hover={false}
      >
        <div className="flex items-start space-x-4">
          <div className="flex-shrink-0 pt-1">
            <Checkbox
              checked={task.completed}
              onChange={handleComplete}
              disabled={loading}
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className={`font-medium text-gray-900 ${task.completed ? 'line-through' : ''}`}>
                  {task.title}
                </h3>
                
                {task.description && (
                  <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                    {task.description}
                  </p>
                )}
                
                <div className="flex items-center space-x-3 mt-3">
                  {task.priority && (
                    <Badge variant={getPriorityColor(task.priority)} size="sm">
                      {task.priority}
                    </Badge>
                  )}
                  
                  {dueDateInfo && (
                    <div className={`flex items-center text-xs ${dueDateInfo.className}`}>
                      <ApperIcon name="Calendar" size={12} className="mr-1" />
                      {dueDateInfo.formatted}
                      {dueDateInfo.isOverdue && (
                        <ApperIcon name="AlertCircle" size={12} className="ml-1" />
                      )}
                    </div>
                  )}
                  
                  {project && (
                    <div className="flex items-center text-xs text-gray-500">
                      <ApperIcon name={project.icon} size={12} className="mr-1" />
                      {project.name}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex-shrink-0 ml-4">
                <Button
                  variant="ghost"
                  size="sm"
                  icon="MoreVertical"
                  onClick={() => setShowActions(!showActions)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                />
              </div>
            </div>
          </div>
        </div>
        
        <AnimatePresence>
          {showActions && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-4 right-4 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-10"
            >
              <button
                onClick={() => {
                  setShowActions(false);
                  // Edit functionality would go here
                }}
                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
              >
                <ApperIcon name="Edit" size={14} className="mr-2" />
                Edit
              </button>
              <button
                onClick={() => {
                  setShowActions(false);
                  handleDelete();
                }}
                disabled={loading}
                className="flex items-center w-full px-4 py-2 text-sm text-error hover:bg-red-50"
              >
                <ApperIcon name="Trash2" size={14} className="mr-2" />
                Delete
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
      
      <CelebrationOverlay
        show={showCelebration}
        onClose={() => setShowCelebration(false)}
        task={task}
      />
    </>
  );
};

export default TaskCard;