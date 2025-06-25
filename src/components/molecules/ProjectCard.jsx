import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';

const ProjectCard = ({ project, onClick }) => {
  const progress = project.taskCount > 0 ? (project.completedCount / project.taskCount) * 100 : 0;
  
  return (
    <Card onClick={onClick} className="overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div 
            className="w-10 h-10 rounded-2xl flex items-center justify-center text-white"
            style={{ backgroundColor: project.color }}
          >
            <ApperIcon name={project.icon} size={20} />
          </div>
          <div>
            <h3 className="font-medium text-gray-900">{project.name}</h3>
            <p className="text-sm text-gray-500">
              {project.completedCount} of {project.taskCount} tasks
            </p>
          </div>
        </div>
        
        <ApperIcon name="ChevronRight" size={16} className="text-gray-400" />
      </div>
      
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Progress</span>
          <span className="font-medium">{Math.round(progress)}%</span>
        </div>
        
        <div className="w-full bg-gray-200 rounded-full h-2">
          <motion.div
            className="h-2 rounded-full"
            style={{ backgroundColor: project.color }}
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
          />
        </div>
      </div>
    </Card>
  );
};

export default ProjectCard;